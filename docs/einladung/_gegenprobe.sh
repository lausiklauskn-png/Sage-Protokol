#!/usr/bin/env bash
# Gegenprobe zu docs/einladung/_smoke.mjs.
#
# Jeder Fall baut EINEN Fehler ein und besteht darauf, dass GENAU der
# zuständige Wächter rot wird — nicht irgendeiner. "Die Probe ist rot"
# genügt nicht; die rote Zeile muss den Namen der Zusicherung tragen.
#
# Läuft in einer WEGWERF-KOPIE. Eine liegengebliebene Sabotage im echten
# Baum sieht später wie ein Baufehler aus.
#
# Run: bash docs/einladung/_gegenprobe.sh
set -u
QUELLE="$(cd "$(dirname "$0")" && pwd)"
ARBEIT="$(mktemp -d)"
trap 'rm -rf "$ARBEIT"' EXIT
cp -r "$QUELLE"/. "$ARBEIT/"
ZIEL="$ARBEIT/index.html"

gefangen=0; durch=0; falsch=0; tot=0

lauf() { PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node "$ARBEIT/_smoke.mjs" 2>&1; }

# Ausgangslage: alles grün? Sonst misst kein einziger Fall etwas.
AUS="$(lauf)"; AUSCODE=$?
if [ "$AUSCODE" -ne 0 ]; then
  echo "ABBRUCH: die Ausgangslage ist schon rot — kein Fall kann etwas messen."
  echo "$AUS" | grep '^❌'
  exit 2
fi
echo "Ausgangslage grün."
echo

fall() {
  local name="$1" waechter="$2" alt="$3" neu="$4"
  # NUR_FALL="teil" faehrt nur die Faelle, deren Name das enthaelt.
  if [ -n "${NUR_FALL:-}" ] && [ "${name#*$NUR_FALL}" = "$name" ]; then return; fi
  cp "$QUELLE/index.html" "$ZIEL"
  local vorher; vorher="$(md5sum "$ZIEL" | cut -d' ' -f1)"
  python3 - "$ZIEL" "$alt" "$neu" <<'PY'
import io,sys
p,a,b = sys.argv[1], sys.argv[2], sys.argv[3]
s = io.open(p, encoding='utf-8').read()
if s.count(a) != 1:
    sys.stderr.write('ANKER %dx\n' % s.count(a)); sys.exit(9)
io.open(p,'w',encoding='utf-8').write(s.replace(a,b,1))
PY
  if [ $? -eq 9 ]; then echo "☠ TOTER ANKER   $name"; tot=$((tot+1)); return; fi
  local nachher; nachher="$(md5sum "$ZIEL" | cut -d' ' -f1)"
  if [ "$vorher" = "$nachher" ]; then echo "☠ TOTER ANKER   $name (Datei unverändert)"; tot=$((tot+1)); return; fi

  local aus; aus="$(lauf)"
  local rote; rote="$(echo "$aus" | grep '^❌' | sed 's/^❌ //' | tr '\n' ' ')"
  if [ -z "$rote" ]; then
    echo "✗ NICHT GEFANGEN $name  (kein Wächter fiel)"; durch=$((durch+1))
  elif echo " $rote " | grep -q " $waechter "; then
    echo "✓ gefangen      $name  → $rote"; gefangen=$((gefangen+1))
  else
    echo "✗ FALSCHER GRUND $name  (erwartet: $waechter · gefallen: $rote)"; falsch=$((falsch+1))
  fi
}

# --- 1 · die Rinne kommt zurück -------------------------------------------
fall "scrollbar-width abgeschaltet" "rinneAbgestellt" \
  "  scrollbar-width: none;                       /* Firefox + Chrome ab 121 */" \
  "  scrollbar-width: auto;"

fall "::-webkit-scrollbar wieder breit" "rinneAuchAelter" \
  "html::-webkit-scrollbar { width: 0; height: 0; }" \
  "html::-webkit-scrollbar { width: 12px; height: 12px; }"

# --- 1b · der Überhang der Fahrten macht die SEITE wieder zu breit ---------
fall "overflow: clip an den Foto-Sektionen weg" "dokumentNichtBreiter" \
  "#scene-1, #scene-5, #scene-6 {
  overflow: clip;
}" \
  "#scene-1, #scene-5, #scene-6 {
  overflow: visible;
}"

fall "overflow auch an der Tür-Sektion (sticky!)" "tuerOhneOverflow" \
  "#scene-1, #scene-5, #scene-6 {
  overflow: clip;
}" \
  "#scene-1, #scene-5, #scene-6, section.scene-doorway {
  overflow: clip;
}"

# Gegenrichtung: ohne Überhang gäbe es nichts zu clippen — dann wäre der
# Wächter oben trivial grün. Deshalb wird auch das gemessen.
# ⚠ Dieser Fall war einen Lauf lang FALSCH und rutschte durch: er setzte EINE
#   Fahrt auf scale(1.0) — seit der Spielraum als `inset: -8%` am Kasten steht,
#   nimmt das der Schicht ihren Überhang nicht. Er nimmt jetzt beides auf
#   einmal, und genau das ist die Lage, gegen die der Wächter steht: gäbe es
#   nichts zu clippen, wäre `dokumentNichtBreiter` trivial grün.
fall "gar nichts steht mehr über den Kasten hinaus" "ueberhangGeclippt" \
  "#scene-1::before,
#scene-5::before,
#scene-6::before {
  inset: -8%;
}" \
  "#scene-1::before,
#scene-5::before,
#scene-6::before {
  inset: 0;
  animation: none !important;
  transform: none !important;
}"

# --- 2 · die Voll-Schichten enden wieder vor dem Fensterrand ---------------
fall "Voll-Schicht-Regel entfernt" "vollbildFotos" \
  ".scene-fade-top, .scene-fade-bot {
  right: min(0px, calc(100% - 100vw));" \
  ".scene-fade-top, .scene-fade-bot {
  right: 0;"

fall "Tür-Bühne wieder nur 100%" "tuerBuehneVoll" \
  "  width: max(100%, 100vw);" \
  "  width: 100%;"

# --- 3 · der Spielraum im Kasten ------------------------------------------
# Ohne ihn fällt die Deckung zurück auf den Haarstrich von 0,22 %.
fall "inset: -8% an den Foto-Schichten weg" "ueberhangGenug" \
  "#scene-1::before,
#scene-5::before,
#scene-6::before {
  inset: -8%;
}" \
  "#scene-1::before,
#scene-5::before,
#scene-6::before {
  inset: 0;
}"

# Gegenrichtung: ein Spielraum, der nur an EINER Seite steht, deckt die
# Gegenseite nicht — der Wächter misst alle vier.
fall "Spielraum nur links, nicht rechts" "ueberhangGenug" \
  "#scene-1::before,
#scene-5::before,
#scene-6::before {
  inset: -8%;
}" \
  "#scene-1::before,
#scene-5::before,
#scene-6::before {
  inset: -8% 0 -8% -8%;
}"

# --- 4 · das Korn gegen die Stufen ----------------------------------------
fall "Korn aus der Seite genommen" "kornDa" \
  '<div class="korn" aria-hidden="true"></div>' \
  '<!-- kein Korn -->'

fall "Korn zu schwach zum Wirken" "kornWirkt" \
  "  opacity: 0.055;
  mix-blend-mode: overlay;" \
  "  opacity: 0.001;
  mix-blend-mode: overlay;"

fall "Korn ohne Rauschen" "kornWirkt" \
  "%3CfeTurbulence type='fractalNoise'" \
  "%3CfeFlood flood-color='gray' data-x='fractalNoise'"

fall "Korn liegt unter dem Inhalt" "kornWirkt" \
  "  z-index: 60;
  pointer-events: none;
  opacity: 0.055;" \
  "  z-index: 1;
  pointer-events: none;
  opacity: 0.055;"

# --- 5 · die Rampe wieder als gerade Linie --------------------------------
fall "Rampe wieder zweistufig" "rampeWeich" \
  "  --rampe-ab:
    rgba(6, 8, 10, 1.000)  0%," \
  "  --rampe-ab: rgba(6, 8, 10, 1) 0%, rgba(6, 8, 10, 0) 100%;
  --rampe-alt:
    rgba(6, 8, 10, 1.000)  0%,"

cp "$QUELLE/index.html" "$ZIEL"
echo
echo "$gefangen gefangen · $durch durchgerutscht · $falsch aus falschem Grund · $tot tote Anker"
if [ "$durch" -eq 0 ] && [ "$falsch" -eq 0 ] && [ "$tot" -eq 0 ]; then ergebnis=0; else ergebnis=1; fi
# ⚠ Ohne das ausdrückliche `exit` gibt das `trap … EXIT` den Rückgabewert von
#    `rm -rf` zurück — der ist immer 0, und die Gegenprobe meldete Erfolg,
#    während ein Anker tot war. Gemessen am 2026-09-18.
exit "$ergebnis"
