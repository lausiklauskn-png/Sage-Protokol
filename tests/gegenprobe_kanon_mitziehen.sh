#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_kanon_mitziehen.mjs (Pflege-Liste § 18).
#
# Jeder Fall MUSS die Probe umwerfen — mit dem Namen SEINER Zusicherung in der
# ersten roten Zeile. Gearbeitet wird an einer Wegwerf-Kopie; die echten
# Dateien werden nie angefasst.
set -u
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WURZEL="$(cd "$HIER/.." && pwd)"
KOPIE="$(mktemp -d)"
AUS="$KOPIE/aus.txt"
trap 'rm -rf "$KOPIE"' EXIT

mkdir -p "$KOPIE/tools" "$KOPIE/tests"
frisch() {
  cp "$WURZEL/tools/kanon-verteilen.mjs"        "$KOPIE/tools/"
  cp "$WURZEL/tests/smoke_kanon_mitziehen.mjs" "$KOPIE/tests/"
}

gefangen=0; durch=0; tot=0
saboten() {
  local was="$1" rel="$2" alt="$3" neu="$4"
  frisch
  if ! python3 - "$KOPIE/$rel" "$alt" "$neu" <<'PY'
import sys, io
d, a, n = sys.argv[1], sys.argv[2], sys.argv[3]
s = io.open(d, encoding="utf-8").read()
if s.count(a) != 1: raise SystemExit(3)
io.open(d, "w", encoding="utf-8").write(s.replace(a, n, 1))
PY
  then echo "  ✗ $was → ANKER NICHT GEFUNDEN (misst nichts)"; tot=$((tot+1)); return; fi
  if (cd "$KOPIE" && timeout 180 node tests/smoke_kanon_mitziehen.mjs > "$AUS" 2>&1); then
    echo "  ✗ $was → gruen geblieben, NICHT GEFANGEN"; durch=$((durch+1))
  else
    echo "  ✓ $was → rot: $(grep -m1 '^  ✗' "$AUS" | sed 's/^ *//' | cut -c1-90)"; gefangen=$((gefangen+1))
  fi
}

echo "═══ Ausgangslage ═══"
frisch
if (cd "$KOPIE" && timeout 180 node tests/smoke_kanon_mitziehen.mjs > "$AUS" 2>&1); then
  echo "  ✓ die Kopie ist ohne Eingriff gruen"
else
  echo "  ✗ die Kopie ist SCHON OHNE EINGRIFF rot — die Gegenprobe misst nichts."; tail -3 "$AUS"; exit 1
fi
echo
echo "═══ Eingriffe ═══"

# Der Kern-Fall: das Manifest steht nicht in der Liste (der Stand vor § 18).
saboten "manifest.json wird beim ?v= nicht mitgenommen" \
  tools/kanon-verteilen.mjs \
  ' || e === "manifest.json")' \
  ')'

# Der zweite Kern-Fall: die Proben werden nicht angefasst.
saboten "die festgenagelte Cache-Kennung in den Proben bleibt stehen" \
  tools/kanon-verteilen.mjs \
  '        writeFileSync(d, t.replace(kMuster, neuK));' \
  '        void 0;'

# Zu weit: eine FREMDE Kennung, die auf die eigene endet, wandert mit.
saboten "ohne Wortgrenze davor wandert fremd-appa-v19 mit" \
  tools/kanon-verteilen.mjs \
  '`(?<![\\w-])${altK' \
  '`${altK'

# Zu weit: eine laengere Kennung (v190) wird angeschnitten.
saboten "ohne Ziffern-Grenze dahinter wird appa-v190 angeschnitten" \
  tools/kanon-verteilen.mjs \
  '"\\$&")}(?!\\d)`' \
  '"\\$&")}`'

# Zu weit: eine kurze Vorsilbe (v19) wird in jeder Probe gesucht.
saboten "der Riegel gegen kurze Vorsilben fehlt" \
  tools/kanon-verteilen.mjs \
  '    if (m[4].length >= 3 && /[a-z]/i.test(m[4])) {' \
  '    if (true) {'

# Zu weit: die Datei von tools/cache-stand.mjs wandert mit (gefunden 2026-10-16).
saboten "tests/cache-stand.json wird mitgezogen" \
  tools/kanon-verteilen.mjs \
  '      else if (e === "cache-stand.json") continue;' \
  ''

# Still: gezogen, aber keine Zeile darueber.
saboten "die Ausgabe verschweigt, was in den Proben mitgezogen wurde" \
  tools/kanon-verteilen.mjs \
  '        console.log(`        ↳ Proben mitgezogen:' \
  '        void (`        ↳ Proben mitgezogen:'

echo
echo "$gefangen gefangen · $durch durchgerutscht · $tot tote Anker"
[ "$durch" -eq 0 ] && [ "$tot" -eq 0 ] || exit 1
