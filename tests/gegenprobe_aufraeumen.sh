#!/usr/bin/env bash
# Gegenprobe zu den beiden Aufräum-Werkzeugen:
#   tools/aufraeumen.sh   ← tests/smoke_aufraeumen.mjs
#   tools/speicher.html   ← tests/smoke_speicher_seite.mjs
#
# Ein Wächter ohne Gegenprobe ist nur ein grüner Haken. Diese hier baut Fehler
# ein — jeder einzelne MUSS die zugehörige Probe umwerfen. Rutscht einer durch,
# ist die Probe an dieser Stelle blind, und der Riegel, auf den Klaus sich
# verlässt, ist eine Behauptung.
#
# Gearbeitet wird an WEGWERF-KOPIEN. Die echten Dateien werden nie angefasst —
# ein abgebrochener Lauf soll kein sabotiertes Werkzeug im Repo hinterlassen.
#
# Lauf: bash tests/gegenprobe_aufraeumen.sh

set -u

HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WURZEL="$(cd "$HIER/.." && pwd)"

SKRIPT_ECHT="$WURZEL/tools/aufraeumen.sh"
SEITE_ECHT="$WURZEL/tools/speicher.html"
SKRIPT_KOPIE="$(mktemp "${TMPDIR:-/tmp}/aufraeumen-sabotiert-XXXXXX.sh")"
SEITE_KOPIE="$(mktemp "${TMPDIR:-/tmp}/speicher-sabotiert-XXXXXX.html")"
trap 'rm -f "$SKRIPT_KOPIE" "$SEITE_KOPIE"' EXIT

gruen=0; rot=0

# Ein Eingriff, der die Datei nicht verändert, wäre eine stille Lüge: die Probe
# bliebe grün und der Fall zählte als „nicht gefangen", obwohl gar nichts
# sabotiert wurde. Deshalb wird geprüft, dass der Anker wirklich getroffen hat.
ersetze() {
  local datei="$1" alt="$2" neu="$3"
  if ! grep -qF -- "$alt" "$datei"; then
    echo "  ⚠ ANKER NICHT GEFUNDEN — dieser Fall misst nichts: ${alt:0:60}…"
    rot=$((rot+1)); return 1
  fi
  ALT="$alt" NEU="$neu" python3 -c '
import os, sys
p = sys.argv[1]
s = open(p, encoding="utf-8").read()
open(p, "w", encoding="utf-8").write(s.replace(os.environ["ALT"], os.environ["NEU"]))
' "$datei"
}

skript_probe() { AUFRAEUMEN_SKRIPT="$SKRIPT_KOPIE" node "$HIER/smoke_aufraeumen.mjs" >/dev/null 2>&1; }
seiten_probe() { SPEICHER_SEITE="$SEITE_KOPIE" node "$HIER/smoke_speicher_seite.mjs" >/dev/null 2>&1; }

# fall <probe-funktion> <echte-datei> <kopie> <beschreibung> <alt> <neu>
fall() {
  local probe="$1" echt="$2" kopie="$3" was="$4" alt="$5" neu="$6"
  cp "$echt" "$kopie"
  ersetze "$kopie" "$alt" "$neu" || return
  if "$probe"; then
    rot=$((rot+1)); echo "  ✗ NICHT GEFANGEN: $was"
  else
    gruen=$((gruen+1)); echo "  ✓ gefangen: $was"
  fi
}

grundlage() {
  local probe="$1" echt="$2" kopie="$3" name="$4"
  cp "$echt" "$kopie"
  if "$probe"; then
    echo "  ✓ unverändert ist die Probe $name grün"
    gruen=$((gruen+1))
  else
    echo "  ✗ ABBRUCH: die Probe $name ist schon ohne Eingriff rot."
    exit 1
  fi
}

echo
echo "GEGENPROBE — aufraeumen.sh"
echo
grundlage skript_probe "$SKRIPT_ECHT" "$SKRIPT_KOPIE" "aufraeumen"
echo

fall skript_probe "$SKRIPT_ECHT" "$SKRIPT_KOPIE" \
  "geänderte Dateien werden nicht mehr geprüft" \
  '[ -n "$(git -C "$d" status --porcelain 2>/dev/null)" ] && gruende+=("geänderte Dateien")' \
  'false && gruende+=("geänderte Dateien")'

fall skript_probe "$SKRIPT_ECHT" "$SKRIPT_KOPIE" \
  "ungepushte Commits werden nicht mehr geprüft" \
  '[ -n "$(git -C "$d" log --branches --not --remotes --oneline 2>/dev/null | head -1)" ]' \
  'false'

# DER Fall, für den die Tafel in CLAUDE.md steht. `@{upstream}` bricht bei einem
# Zweig ohne Upstream ab; wer den Fehler wegwirft, liest „0 Commits" und
# übersieht die Arbeit eines ganzen Zweiges.
fall skript_probe "$SKRIPT_ECHT" "$SKRIPT_KOPIE" \
  "Ungepusht-Prüfung gegen @{upstream} statt gegen die Remotes (die Tafel-Falle)" \
  'git -C "$d" log --branches --not --remotes --oneline 2>/dev/null | head -1' \
  'git -C "$d" log @{upstream}..HEAD --oneline 2>/dev/null | head -1'

fall skript_probe "$SKRIPT_ECHT" "$SKRIPT_KOPIE" \
  "weggelegte Arbeit (stash) wird nicht mehr geprüft" \
  '[ -n "$(git -C "$d" stash list 2>/dev/null)" ] && gruende+=("weggelegte Arbeit (stash)")' \
  'false && gruende+=("weggelegte Arbeit (stash)")'

fall skript_probe "$SKRIPT_ECHT" "$SKRIPT_KOPIE" \
  "der Selbstschutz fällt weg — das eigene Repo landet in der Löschliste" \
  '[ "$d" = "$SELBST" ] && gruende+=("hier läuft das Skript")' \
  'false && gruende+=("hier läuft das Skript")'

fall skript_probe "$SKRIPT_ECHT" "$SKRIPT_KOPIE" \
  "der scharfe Gang löscht ALLE Klone statt nur die unbedenklichen" \
  'for d in "${WEG[@]}"; do' \
  'for d in "${KLONE[@]}"; do'

fall skript_probe "$SKRIPT_ECHT" "$SKRIPT_KOPIE" \
  "schon der Vorgabe-Gang löscht (der Riegel SCHARF fällt weg)" \
  'if [ "$SCHARF" != "ja" ]; then' \
  'if false; then'

echo
echo "GEGENPROBE — speicher.html"
echo
grundlage seiten_probe "$SEITE_ECHT" "$SEITE_KOPIE" "speicher-seite"
echo

fall seiten_probe "$SEITE_ECHT" "$SEITE_KOPIE" \
  "die Seite löscht eine Datenbank (offen im Quelltext)" \
  'for (const n of namen) { if (await caches.delete(n)) weg++; }' \
  'for (const n of namen) { if (await caches.delete(n)) weg++; }
  indexedDB.deleteDatabase("probe_daten");'

# DER Fall, für den der Browser-Lauf überhaupt existiert: ein zusammengesetzter
# Name geht an jeder Textsuche vorbei. Fängt ihn nur der echte Lauf, hat er sich
# bezahlt gemacht — fängt ihn niemand, war die Zusicherung eine Behauptung.
fall seiten_probe "$SEITE_ECHT" "$SEITE_KOPIE" \
  "Datenbank-Löschung über einen ZUSAMMENGESETZTEN Namen (keine Textsuche findet das)" \
  'for (const n of namen) { if (await caches.delete(n)) weg++; }' \
  'for (const n of namen) { if (await caches.delete(n)) weg++; }
  indexedDB["delete" + "Data" + "base"]("probe_daten");'

fall seiten_probe "$SEITE_ECHT" "$SEITE_KOPIE" \
  "alle Vorräte gelten als alte Fassung" \
  'gruppe.forEach((v) => (v.alt = v.nummer !== null && v.nummer < hoechste));' \
  'gruppe.forEach((v) => (v.alt = true));'

fall seiten_probe "$SEITE_ECHT" "$SEITE_KOPIE" \
  "der Löschen-Knopf räumt alles weg, statt nur das Angehakte" \
  'const namen = haken().filter((h) => h.checked).map((h) => h.dataset.name);' \
  'const namen = haken().map((h) => h.dataset.name);'

fall seiten_probe "$SEITE_ECHT" "$SEITE_KOPIE" \
  "die Trennlinie verschwindet von der Seite" \
  'Diese Seite fasst sie nicht an' \
  'Diese Seite raeumt auch die auf'

echo
echo "— $gruen gefangen, $rot durchgerutscht —"
echo
[ "$rot" -gt 0 ] && exit 1
exit 0
