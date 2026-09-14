#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_bau23_sprache.mjs.
#
# Ein Waechter ohne Gegenprobe ist nur ein gruener Haken. Diese hier baut
# Fehler ein — jeder MUSS die Probe umwerfen, und zwar mit dem Namen SEINER
# Zusicherung in der roten Zeile.
#
# GEARBEITET WIRD AN EINER WEGWERF-KOPIE. Die echten Dateien werden nie
# angefasst: ein abgebrochener Lauf soll kein sabotiertes Modul im Depot
# hinterlassen (dieselbe Bauart wie gegenprobe_aufraeumen.sh). Damit braucht
# es auch keinen Umgebungs-Schalter, mit dem sich die Probe stilllegen liesse.
#
# Lauf:  bash tests/gegenprobe_bau23_sprache.sh
set -u
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WURZEL="$(cd "$HIER/.." && pwd)"
KOPIE="$(mktemp -d)"
trap 'rm -rf "$KOPIE"' EXIT

mkdir -p "$KOPIE/src/modules" "$KOPIE/tests"
frisch() {
  cp "$WURZEL/src/modules/23_rendezvous_ui.js" "$KOPIE/src/modules/"
  cp "$WURZEL/tests/smoke_bau23_sprache.mjs"   "$KOPIE/tests/"
}

gefangen=0; durch=0; tot=0

# saboten <beschreibung> <alt> <neu>
saboten() {
  local was="$1" alt="$2" neu="$3"
  frisch
  if ! python3 - "$KOPIE/src/modules/23_rendezvous_ui.js" "$alt" "$neu" <<'PY'
import sys, io
d, a, n = sys.argv[1], sys.argv[2], sys.argv[3]
s = io.open(d, encoding="utf-8").read()
if a not in s: raise SystemExit(3)
io.open(d, "w", encoding="utf-8").write(s.replace(a, n, 1))
PY
  then echo "  ✗ $was → ANKER NICHT GEFUNDEN (misst nichts)"; tot=$((tot+1)); return; fi
  if (cd "$KOPIE" && node tests/smoke_bau23_sprache.mjs > /tmp/gp23.txt 2>&1); then
    echo "  ✗ $was → gruen geblieben, NICHT GEFANGEN"; durch=$((durch+1))
  else
    echo "  ✓ $was → rot: $(grep -m1 '✗' /tmp/gp23.txt | sed 's/^ *//' | cut -c1-88)"; gefangen=$((gefangen+1))
  fi
}

echo "═══ Ausgangslage ═══"
frisch
if (cd "$KOPIE" && node tests/smoke_bau23_sprache.mjs > /tmp/gp23_0.txt 2>&1); then
  echo "  ✓ die Kopie ist ohne Eingriff gruen"
else
  echo "  ✗ die Kopie ist SCHON OHNE EINGRIFF rot — die Gegenprobe misst nichts."
  grep '✗' /tmp/gp23_0.txt | head -3; exit 1
fi

echo; echo "═══ A · das Woerterbuch gegen den Code ═══"
# Der stille Verfall, gegen den der ganze Waechter gebaut ist: ein deutscher
# Satz aendert sich, die Uebersetzung bleibt stehen und greift nie mehr.
saboten "ein deutscher Satz aendert sich, der Eintrag bleibt" \
  'T("👥 Wer ist im Raum?")' 'T("👥 Wer ist gerade im Raum?")'
# Umgekehrt: ein neuer Text ohne Uebersetzung.
# ⚠ HINZUFUEGEN, nicht aendern: wer einen bestehenden Aufruf umschreibt, toetet
# zugleich dessen Schluessel — dann feuert der Nachbar-Waechter („jeder Eintrag
# hat eine Fundstelle") zuerst, und der gemeinte bleibt ungemessen.
saboten "ein T()-Aufruf ohne englische Fassung" \
  'T("Siegel öffnen")' 'T("Siegel öffnen") + T("Ein Satz ohne Uebersetzung")'
# Eine „Uebersetzung", die das Deutsche nur abschreibt, ist keine.
# ⚠ Genommen wird ein Text, den der LAUFZEIT-Teil nicht prueft. „Mit dem
# Knotennetz verbinden" steht dort ausdruecklich drin — mit ihm faellt der
# Laufzeit-Waechter zuerst, und der Kopie-Waechter bleibt ungemessen.
saboten "eine Uebersetzung ist nur eine Kopie des Deutschen" \
  '"Drag to move",' '"Ziehen zum Verschieben",'

echo; echo "═══ B · zur Laufzeit ═══"
saboten "init({lang}) wird nicht mehr gelesen" \
  'if (opts.lang === "de" || opts.lang === "en") cfg.lang = opts.lang;' \
  '/* abgeschaltet */'
# Ohne <html lang> bliebe das Fenster in sechzehn Apps deutsch, obwohl die
# Seite englisch ist — sie muessten alle erst init({lang}) nachruesten.
saboten "<html lang> wird nicht mehr gelesen" \
  '      if (l === "en") return "en";' '      if (false) return "en";'
saboten "T() gibt immer den deutschen Satz zurueck" \
  '    if (sprache() !== "en") return de;' '    return de;'
# DIE GEGENRICHTUNG, und sie ist die wichtigere: sechzehn Apps duerfen von
# dieser Aenderung nichts merken, solange sie nichts einstellen.
saboten "es wird IMMER uebersetzt, auch ohne Einstellung" \
  '    return "de";
  }' '    return "en";
  }'

frisch
echo
echo "$gefangen gefangen · $durch durchgerutscht · $tot tote Anker"
[ "$durch" -eq 0 ] && [ "$tot" -eq 0 ] || exit 1
