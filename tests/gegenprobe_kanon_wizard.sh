#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_kanon_wizard.mjs (A18, 2026-09-14).
#
# Ein Waechter ohne Gegenprobe ist nur ein gruener Haken. Jeder Fall hier MUSS
# die Probe umwerfen — und zwar mit dem Namen SEINER Zusicherung in der roten
# Zeile, nicht mit irgendeiner.
#
# GEARBEITET WIRD AN EINER WEGWERF-KOPIE. Die echten Dateien werden nie
# angefasst: ein abgebrochener Lauf soll kein sabotiertes Depot hinterlassen.
set -u
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WURZEL="$(cd "$HIER/.." && pwd)"
KOPIE="$(mktemp -d)"
trap 'rm -rf "$KOPIE"' EXIT
LOG=$(mktemp)

mkdir -p "$KOPIE/src/modules" "$KOPIE/assets" "$KOPIE/tests"
# ⚠ OHNE DIESE ZEILE MISST DER GANZE BROWSER-TEIL NICHTS. In der Wegwerf-Kopie
# fehlt `node_modules`, `playwright-core` laesst sich nicht laden, die Probe
# meldet „nicht lauffaehig" — und jeder Fall, dessen Waechter im Browser lebt,
# bleibt gruen. Kimhubs FUENFTE Art, wie eine Gegenprobe nichts misst: der
# Waechter laeuft gar nicht. Drei Faelle sind hier genau daran durchgerutscht.
ln -s "$WURZEL/node_modules" "$KOPIE/node_modules" 2>/dev/null || true
frisch() {
  cp "$WURZEL/src/modules/16b_andock_wizard.js" "$KOPIE/src/modules/"
  cp "$WURZEL/assets/sbkim-andock-wizard.js"    "$KOPIE/assets/"
  cp "$WURZEL/assets/siegel-inhalt.js"          "$KOPIE/assets/"
  cp "$WURZEL/index.html"                       "$KOPIE/"
  cp "$WURZEL/tests/smoke_kanon_wizard.mjs"     "$KOPIE/tests/"
  cp "$WURZEL/tests/kanon_wizard_texte.mjs"     "$KOPIE/tests/"
}

gefangen=0; durch=0; tot=0

# ⚠ ZWEI DATEIEN MUESSEN MIT: der Kanon UND seine Kopie. Ein Fall, der nur eine
# anfasst, wird immer vom Drift-Waechter „byte-gleich" gefangen — und bewiese
# damit nichts ueber den Waechter, den er meint. Genau diese Falle hat in
# kim-hub-company am 2026-09-09 zwei Fehler in EINEM Fall versteckt.
saboten() {
  local was="$1" alt="$2" neu="$3"
  frisch
  if ! python3 - "$KOPIE" "$alt" "$neu" <<'PY'
import sys, io, os
k, a, n = sys.argv[1], sys.argv[2], sys.argv[3]
# ⚠ `\n` IST HIER EIN WOERTLICHES BACKSLASH-N. Die Bash gibt es so weiter; wer
# eine Zeile einfuegen will, bekaeme sonst zwei Zeichen statt eines Umbruchs —
# der Anker passt auf nichts, und der Fall meldet sich als „ANKER NICHT
# GEFUNDEN", obwohl er richtig gemeint war. Einmal uebersetzt, an EINER Stelle.
a, n = a.replace("\\n", "\n"), n.replace("\\n", "\n")
getroffen = 0
for rel in ("src/modules/16b_andock_wizard.js", "assets/sbkim-andock-wizard.js"):
    d = os.path.join(k, rel)
    s = io.open(d, encoding="utf-8").read()
    if a not in s: continue
    io.open(d, "w", encoding="utf-8").write(s.replace(a, n))
    getroffen += 1
raise SystemExit(0 if getroffen == 2 else 3)
PY
  then echo "  ✗ $was → ANKER NICHT GEFUNDEN (misst nichts)"; tot=$((tot+1)); return; fi
  lauf "$was"
}

# Ein Fall, der NUR eine Datei ausserhalb des Kanons anfasst.
saboten1() {
  local was="$1" rel="$2" alt="$3" neu="$4"
  frisch
  if ! python3 - "$KOPIE/$rel" "$alt" "$neu" <<'PY'
import sys, io
d, a, n = sys.argv[1], sys.argv[2], sys.argv[3]
a, n = a.replace("\\n", "\n"), n.replace("\\n", "\n")   # s. o.
s = io.open(d, encoding="utf-8").read()
if a not in s: raise SystemExit(3)
io.open(d, "w", encoding="utf-8").write(s.replace(a, n, 1))
PY
  then echo "  ✗ $was → ANKER NICHT GEFUNDEN (misst nichts)"; tot=$((tot+1)); return; fi
  lauf "$was"
}

lauf() {
  local was="$1"
  if (cd "$KOPIE" && timeout 180 node tests/smoke_kanon_wizard.mjs > "$LOG" 2>&1); then
    echo "  ✗ $was → gruen geblieben, NICHT GEFANGEN"; durch=$((durch+1))
  else
    echo "  ✓ $was → rot: $(grep -m1 '✗ ROT' "$LOG" | sed 's/^ *//' | cut -c1-92)"; gefangen=$((gefangen+1))
  fi
}

echo "═══ Ausgangslage ═══"
frisch
if (cd "$KOPIE" && timeout 180 node tests/smoke_kanon_wizard.mjs > "$LOG" 2>&1); then
  echo "  ✓ die Kopie ist ohne Eingriff gruen"
  if grep -q "nicht lauffaehig\|nicht lauffähig" "$LOG"; then
    echo "  ✗ ABBRUCH: der Browser-Teil ist NICHT GELAUFEN — die Faelle D messen nichts."
    grep -m1 "nicht lauff" "$LOG"; exit 1
  fi
  echo "  ✓ … und der Browser-Teil ist wirklich gelaufen"
else
  echo "  ✗ die Kopie ist SCHON OHNE EINGRIFF rot — die Gegenprobe misst nichts."
  tail -5 "$LOG"; exit 1
fi

echo
echo "═══ A · Die Marke und die Trennlinie ═══"
saboten "die Marke im Kopf faellt weg" \
  "SBKIM — Modul 16b — Andock-Wizard" "Andock-Wizard"
saboten "eine App-Identitaet schleicht sich in den Kanon" \
  "  var lastSpore = null;" '  var HEIMLICH = { nodeName: "Sage" };\n  var lastSpore = null;'
saboten "eine App-Adresse steht im Kanon" \
  '    return base + "_spore_" + stamp + ".json";' \
  '    if (base === "x") base = "https://lausiklauskn-png.github.io/Sage-Protokol/";\n    return base + "_spore_" + stamp + ".json";'
saboten "die Konfiguration wird beim LADEN eingefangen statt beim Injizieren" \
  "  var lastSpore = null;" "  var FRUEH = window.SBKIM_SIEGEL_WIZ;\n  var lastSpore = null;"

echo
echo "═══ B · Die drei Text-Waechter ═══"
# Waechter 1 — was da ist
saboten "ein T()-Argument steht nicht in der Tafel" \
  'T("Erzeuge Identität …")' 'T("Erzeuge nun die Identität …")'
# Waechter 2 — toter Text
saboten "ein Eintrag der Tafel wird von niemandem benutzt" \
  '    "Modell geladen ✓",' '    "Modell geladen ✓",\n    "Diesen Satz benutzt niemand mehr.",'
# ⚠ WAECHTER 3 IN DREI GESTALTEN. Eine reicht nicht: der Leser entscheidet an
# drei verschiedenen Merkmalen (Umlaut, grossgeschriebenes Wort, Markup), und ein
# Fall koennte an zweien vorbeigehen, ohne dass es auffiele.
# ⚠ HINZUFUEGEN STATT AENDERN — sonst feuert der NACHBAR-Waechter zuerst. Beim
# ersten Lauf nahmen diese drei Faelle je einen T()-Aufruf WEG; damit wurde sein
# Tafel-Eintrag tot, und Waechter 2 wurde rot statt Waechter 3. Alle drei galten
# als „gefangen" und bewiesen doch nichts ueber den Waechter, den sie meinen.
saboten "ein Anzeigetext MIT UMLAUT geht an T() vorbei" \
  "  var lastSpore = null;" \
  "  var lastSpore = null;\n  var VORBEI1 = \"Diese Zeile trägt einen Umlaut.\";"
saboten "ein Anzeigetext OHNE Umlaut geht an T() vorbei" \
  "  var lastSpore = null;" \
  "  var lastSpore = null;\n  var VORBEI2 = \"Modell wurde nun geladen\";"
saboten "ein Anzeigetext IM MARKUP geht an T() vorbei" \
  "  var lastSpore = null;" \
  "  var lastSpore = null;\n  var VORBEI3 = '<b>Eigene Identitaet und Spore</b>';"
saboten1 "die Ausnahme-Liste waechst still" tests/kanon_wizard_texte.mjs \
  'export const AUSNAHMEN = ["use strict"];' \
  'export const AUSNAHMEN = ["use strict", "Escape"];'

echo
echo "═══ C · Was beim Zusammenfuehren gewonnen wurde ═══"
saboten "Baustein 5 (Identitaets-Wechsler) faellt wieder heraus" \
  "  function refreshWizardIdentities() {" "  function refreshWizardIdentitiesAbgeschaltet() {"
saboten "der Backup-Name wird wieder hart eingetippt" \
  'var praefix = c.backupPrefix || "sbkim-backup";' 'var praefix = "sage-backup" + "";'
# ⚠ Der Ersatz ist KLEINGESCHRIEBEN und ohne Wortpaar — sonst faengt ihn
# Waechter 3 als Anzeigetext ab, und der Fall bewiese wieder etwas anderes.
saboten "der Spore-Dateiname kommt nicht mehr aus der Konfiguration" \
  'String(c.nodeName || "SBKIM")' 'String("sbkim")'
saboten "die Wizard-Init-Heilung faellt weg (Schritt 3 bleibt tot)" \
  '          var s3 = dlg.querySelector("#sbwiz-s3"); if (s3) s3.disabled = false;' '          '
saboten "Schritt 5 wird nach Schritt 1 nicht mehr nachgezogen" \
  "        refreshWizardIdentities();\n      }).catch(function (e) { out(\"#sbwiz-o1\"" \
  "      }).catch(function (e) { out(\"#sbwiz-o1\""
saboten "die alte Fehlzeile aus Schritt 3 bleibt stehen" \
  'if (o3 && /Keine Identit/.test(o3.textContent || "")) o3.textContent = "";' \
  'if (o3) { /* stehen lassen */ }'
saboten "ein App-eigenes ID-Praefix kehrt zurueck" "sbwiz-s1" "kbdwiz-s1"
saboten "die Herkunfts-Zeile rutscht wieder UNTER das Feld" \
  "    wrap.appendChild(herkunft); wrap.appendChild(zurueck);\n    wrap.appendChild(ta);" \
  "    wrap.appendChild(ta);\n    wrap.appendChild(herkunft); wrap.appendChild(zurueck);"
saboten "die Membran wird allen in den Mund gelegt" \
  "    if (window.SbkimMembrane) {" "    if (true) {"

echo
echo "═══ D · Fail-soft und die Sprache (im Browser gemessen) ═══"
saboten "ohne Konfiguration wird doch ein Knopf gebaut" \
  "    if (!cfg()) {" "    if (false) {"
# ⚠ Der Rueckfall traegt die GANZE Oberflaeche — ohne ihn steht nirgends mehr
# Text, nicht nur an einer Stelle. Welcher Waechter zuerst rot wird, ist deshalb
# beliebig; der Fall heisst nach dem, was er wirklich zeigt.
saboten "ohne Rueckfall auf Deutsch bleibt die Oberflaeche leer" \
  '    return (typeof s === "string" && s) ? s : de;' '    return (typeof s === "string" && s) ? s : "";'
saboten "die Sprache aus der Konfiguration wird ignoriert" \
  '    var l = (c && c.lang)' '    var l = (false && c.lang)'

echo
echo "═══ E · Die Kopie in dieser App ═══"
saboten1 "die Kopie haengt hinter dem Kanon zurueck" assets/sbkim-andock-wizard.js \
  '  var lastSpore = null;' '  var lastSpore = null; /* abgewandelt */'
saboten1 "index.html laedt den Kanon nicht mehr" index.html \
  '  <script src="assets/sbkim-andock-wizard.js"></script>' '  <!-- weg -->'

echo
echo "── $gefangen gefangen · $durch durchgerutscht · $tot tote Anker ──"
rm -f "$LOG"
[ "$durch" -eq 0 ] && [ "$tot" -eq 0 ]
