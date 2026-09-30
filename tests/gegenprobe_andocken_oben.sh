#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_andocken_oben.mjs — jeder eingebaute Fehler MUSS
# eine rote Zeile werfen. Läuft in einer WEGWERF-KOPIE (der echte Baum bleibt
# unberührt). Rückgabewert 1, wenn ein Fall blind ist oder sein Anker fehlt.
set -u
WURZEL="$(cd "$(dirname "$0")/.." && pwd)"
K="$(mktemp -d)"; trap 'rm -rf "$K"' EXIT
cp -a "$WURZEL/src" "$WURZEL/tests" "$WURZEL/package.json" "$K/"
ln -s "$WURZEL/node_modules" "$K/node_modules"
cd "$K" || exit 1
gef=0; blind=0; tot=0
fall() { # datei  name  [anker ersatz]...
  local d="src/modules/$1" n="$2"; shift 2
  cp "$d" "$d.bak"
  if ! python3 - "$d" "$@" <<'PY'
import sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read(); a=sys.argv[2:]
for i in range(0,len(a),2):
    if s.count(a[i])!=1: sys.exit(1)
    s=s.replace(a[i],a[i+1])
open(p,'w',encoding='utf-8').write(s)
PY
  then echo "☠ TOTER ANKER: $n"; tot=$((tot+1)); mv "$d.bak" "$d"; return; fi
  local rot; rot=$(node tests/smoke_andocken_oben.mjs 2>&1 | grep -m1 '^✗')
  if [ -n "$rot" ]; then echo "✓ gefangen: $n → $rot"; gef=$((gef+1))
  else echo "✗ BLIND: $n"; blind=$((blind+1)); fi
  mv "$d.bak" "$d"
}
fall 17_floating_widget.js "17: rastet beim Loslassen nicht ein" \
  "try { versucheEinrasten(); }" "try { }"
# Zwei Riegel decken einander (Fenster-Größe + Größe des Widgets) — EIN Fall nimmt beide.
fall 17_floating_widget.js "17: zieht die Höhe nicht nach" \
  'try { global.addEventListener("resize", beiGroesse); }' "try { }" \
  "new global.ResizeObserver(beiGroesse).observe(widgetRoot);" "void 0;"
fall 17_floating_widget.js "17: wegziehen nimmt es nicht ab" \
  "      currentOben = null;       // wer zieht" "      // (sabotiert)"
fall 17_floating_widget.js "17: vergisst es beim Neuladen" \
  "      var ob = obenGueltig(parsed.oben);" "      var ob = null;"
fall 17_floating_widget.js "17: rastet überall ein" \
  "    if (r.top > k.bottom + OBEN_FANG_PX) return false;" "    // (sabotiert)"
fall 17_floating_widget.js "17: sucht keine Leiste" \
  "                if (r.top <= 4 && r.width >= vw * 0.5" "                if (false && r.width >= vw * 0.5"
fall 23_rendezvous_ui.js "23: rastet beim Loslassen nicht ein" \
  "        if (node === btnEl && istOben(r)) {" "        if (false) {"
fall 23_rendezvous_ui.js "23: zieht beim Fenster-Ändern nicht nach" \
  "        if (obr && !isOpen()) {" "        if (false) {"
fall 23_rendezvous_ui.js "23: vergisst es beim Neuladen" \
  "    if (savedOben) {" "    if (false) {"
fall 23_rendezvous_ui.js "23: rastet überall ein" \
  "function istOben(r) { return r && r.top <= obereKante().bottom + OBEN_FANG_PX; }" "function istOben(r) { return true; }"
fall 23_rendezvous_ui.js "23: rechts über left statt right" \
  "      btnEl.style.right = Math.min" "      btnEl.style.left = Math.min"
echo; echo "$gef gefangen · $blind blind · $tot tote Anker"
[ "$blind" -eq 0 ] && [ "$tot" -eq 0 ]
