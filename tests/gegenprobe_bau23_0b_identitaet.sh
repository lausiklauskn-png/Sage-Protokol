#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_bau23_0b_identitaet.mjs.
#
# Ein Waechter ohne Gegenprobe ist nur ein gruener Haken. Jeder Fall hier MUSS
# die Probe umwerfen — und zwar mit dem Namen SEINER Zusicherung in der roten
# Zeile, nicht mit irgendeiner.
#
# ANLASS (2026-09-16): die vier Waechter zu „Eine Kennung, eine Spore" waren von
# Hand nachgestellt und danach NICHT abgelegt. Eine Pruefung, die nur im Kopf
# einer Sitzung stattgefunden hat, ist bei der naechsten Aenderung nicht mehr da.
#
# GEARBEITET WIRD AN EINER WEGWERF-KOPIE. Die echten Dateien werden nie
# angefasst: ein abgebrochener Lauf soll kein sabotiertes Depot hinterlassen.
set -u
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WURZEL="$(cd "$HIER/.." && pwd)"
KOPIE="$(mktemp -d)"
trap 'rm -rf "$KOPIE"' EXIT
LOG=$(mktemp)

mkdir -p "$KOPIE/src/modules" "$KOPIE/tests"
ln -s "$WURZEL/node_modules" "$KOPIE/node_modules" 2>/dev/null || true
frisch() {
  cp "$WURZEL/src/modules/23_rendezvous_ui.js"        "$KOPIE/src/modules/"
  cp "$WURZEL/tests/smoke_bau23_0b_identitaet.mjs"    "$KOPIE/tests/"
}

gefangen=0; durch=0; tot=0

# ⚠ KEIN GERADES " IN EINEM FALL-LABEL. Beim ersten Lauf dieser Datei stand dort
# „eine Kennung, eine Spore" mit geradem Schlusszeichen — das BEENDET die
# bash-Zeichenkette, die Argumente verrutschen, und EIN FALL VERSCHWAND GANZ:
# gemeldet wurden 2 statt 3, mit einer leeren roten Zeile daneben. Gefunden hat
# es nicht das Nachdenken, sondern die Zahl, die nicht stimmte.

lauf() {
  local was="$1"
  if (cd "$KOPIE" && timeout 180 node tests/smoke_bau23_0b_identitaet.mjs > "$LOG" 2>&1); then
    echo "  ✗ $was → gruen geblieben, NICHT GEFANGEN"; durch=$((durch+1))
  else
    echo "  ✓ $was → rot: $(grep -m1 '✗' "$LOG" | sed 's/^ *//' | cut -c1-96)"; gefangen=$((gefangen+1))
  fi
}

# ⚠ EIN SATZ STEHT HIER ZWEIMAL: als Schluessel der englischen Tafel und an der
# Stelle, die ihn benutzt. Wer nur eine der beiden trifft, laesst eine
# Uebersetzung ohne deutschen Satz zurueck (oder umgekehrt) — dann faellt der
# SPRACH-Waechter, nicht der gemeinte. Rot ist es beides Mal; nur traegt die
# rote Zeile den falschen Namen. Deshalb wird IMMER das Paar getauscht.
saboten_paar() {
  local was="$1" alt1="$2" neu1="$3" alt2="$4" neu2="$5"
  frisch
  if ! python3 - "$KOPIE/src/modules/23_rendezvous_ui.js" "$alt1" "$neu1" "$alt2" "$neu2" <<'PY'
import sys, io
d = sys.argv[1]
paare = [(sys.argv[2], sys.argv[3]), (sys.argv[4], sys.argv[5])]
paare = [(a.replace("\\n", "\n"), n.replace("\\n", "\n")) for a, n in paare]
s = io.open(d, encoding="utf-8").read()
for a, n in paare:
    if a not in s: raise SystemExit(3)
    s = s.replace(a, n)
io.open(d, "w", encoding="utf-8").write(s)
PY
  then echo "  ✗ $was → ANKER NICHT GEFUNDEN (misst nichts)"; tot=$((tot+1)); return; fi
  lauf "$was"
}

# Ein Fall, der genau EINE Stelle tauscht (die Bedingung, nicht den Text).
saboten1() {
  local was="$1" alt="$2" neu="$3"
  frisch
  if ! python3 - "$KOPIE/src/modules/23_rendezvous_ui.js" "$alt" "$neu" <<'PY'
import sys, io
d, a, n = sys.argv[1], sys.argv[2], sys.argv[3]
a, n = a.replace("\\n", "\n"), n.replace("\\n", "\n")
s = io.open(d, encoding="utf-8").read()
if a not in s: raise SystemExit(3)
io.open(d, "w", encoding="utf-8").write(s.replace(a, n, 1))
PY
  then echo "  ✗ $was → ANKER NICHT GEFUNDEN (misst nichts)"; tot=$((tot+1)); return; fi
  lauf "$was"
}

echo "═══ Ausgangslage ═══"
frisch
if (cd "$KOPIE" && timeout 180 node tests/smoke_bau23_0b_identitaet.mjs > "$LOG" 2>&1); then
  echo "  ✓ die Kopie ist ohne Eingriff gruen"
else
  echo "  ✗ die Kopie ist SCHON OHNE EINGRIFF rot — die Gegenprobe misst nichts."
  tail -5 "$LOG"; exit 1
fi

echo
echo "═══ Eine Kennung, eine Spore (Klaus 2026-09-16) ═══"
# Klaus: „es muss kommuniziert werden, dass nicht doppelt gespeichert wird und
# der Nutzer denkt, er haette zwei verschiedene Dateien gespeichert, aber hat
# nur eine gespeichert."
saboten_paar "der Satz „eine Kennung, eine Spore“ verschwindet aus der Box" \
  '      "Eine Kennung, eine Spore: im Siegel signierst du dieselbe. Einmal genügt.":
        "One identity, one spore: in the seal you sign that very same one. Once is enough.",' '' \
  '        lines.push(T("Eine Kennung, eine Spore: im Siegel signierst du dieselbe. Einmal genügt."));' ''

# ⚠ UND HIER DARF DER ANKER KEIN \n ENTHALTEN. Der Helfer uebersetzt `\n` in
# einen ECHTEN Umbruch (damit sich Zeilen einfuegen lassen) — im Quelltext steht
# an dieser Stelle aber ein WOERTLICHES Backslash-n innerhalb einer JS-Zeichen-
# kette. Der erste Anlauf dieses Falls meldete deshalb „ANKER NICHT GEFUNDEN":
# er hat nichts sabotiert und nichts gemessen. Getauscht wird der SATZ ohne
# seinen Umbruch, und zwar gegen einen anderen harmlosen Satz statt gegen
# nichts — sonst stuenden Schluessel und Uebersetzung beide leer da.
saboten_paar "der Zusatz „eine Datei genügt“ verschwindet aus der Erfolgsmeldung" \
  'Das ist dieselbe Sicherung wie im Siegel — eine Datei genügt.' 'Bewahre sie gut auf.' \
  'This is the same backup as the one in the seal — one file is enough.' 'Keep it safe.' ''

# ⚠ DIE GEGENRICHTUNG, und sie ist die wichtigere Haelfte. Ohne sie waere der
# Waechter oben auch dann gruen, wenn der Satz IMMER dastuende — auch fuer
# jemanden, der noch gar keine Kennung hat. Der haette dann einen Hinweis auf
# etwas, das es bei ihm nicht gibt.
saboten1 "der Satz steht auch OHNE Kennung da" \
  '      if (st.nodeId) {
        lines.push(T("Eine Kennung, eine Spore: im Siegel signierst du dieselbe. Einmal genügt."));' \
  '      if (true) {
        lines.push(T("Eine Kennung, eine Spore: im Siegel signierst du dieselbe. Einmal genügt."));'

echo
echo "── $gefangen gefangen · $durch durchgerutscht · $tot tote Anker ──"
rm -f "$LOG"
[ "$durch" -eq 0 ] && [ "$tot" -eq 0 ]
