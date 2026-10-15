#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_kanon_cachestand.mjs (Pflege-Liste #13).
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
  cp "$WURZEL/tests/smoke_kanon_cachestand.mjs" "$KOPIE/tests/"
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
  if (cd "$KOPIE" && timeout 180 node tests/smoke_kanon_cachestand.mjs > "$AUS" 2>&1); then
    echo "  ✗ $was → gruen geblieben, NICHT GEFANGEN"; durch=$((durch+1))
  else
    echo "  ✓ $was → rot: $(grep -m1 '^  ✗' "$AUS" | sed 's/^ *//' | cut -c1-90)"; gefangen=$((gefangen+1))
  fi
}

echo "═══ Ausgangslage ═══"
frisch
if (cd "$KOPIE" && timeout 180 node tests/smoke_kanon_cachestand.mjs > "$AUS" 2>&1); then
  echo "  ✓ die Kopie ist ohne Eingriff gruen"
else
  echo "  ✗ die Kopie ist SCHON OHNE EINGRIFF rot — die Gegenprobe misst nichts."; tail -3 "$AUS"; exit 1
fi
echo
echo "═══ Eingriffe ═══"

# Der Kern-Fall des Briefs: der Aufruf ist weg.
saboten "der Aufruf von cache-stand.mjs fehlt" \
  tools/kanon-verteilen.mjs \
  '    const aus = execFileSync("node", [werkzeug], { cwd: rp, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60000 });' \
  '    const aus = "";'

# Je Datei statt je Traeger: haelt die Pruefsumme einer HALB nachgezogenen
# Schale fest.
saboten "Aufruf je Datei statt nach allen Schreibvorgaengen" \
  tools/kanon-verteilen.mjs \
  '    if (cacheBump(rp, t.datei)) gebumptHier = true;' \
  '    if (cacheBump(rp, t.datei)) cacheStandNachziehen(rp, repo, true, false);'

# Still geschluckt.
saboten "ein Fehlschlag wird still geschluckt" \
  tools/kanon-verteilen.mjs \
  '    cacheStandFehler.push({ repo, grund });' \
  '    return;'

# Gemeldet, aber der Rueckgabewert sagt „alles gut".
saboten "ein Fehlschlag laesst den Rueckgabewert auf 0" \
  tools/kanon-verteilen.mjs \
  ' || cacheStandFehler.length ? 1 : 0);' \
  ' ? 1 : 0);'

# Ohne Datei soll sich nichts aendern.
saboten "der Riegel „ohne Datei nichts\" fehlt" \
  tools/kanon-verteilen.mjs \
  '  if (!existsSync(werkzeug)) return;' \
  '  '

# Der Nachsehen-Gang verschweigt, was geschaehe.
saboten "der Nachsehen-Gang meldet nichts" \
  tools/kanon-verteilen.mjs \
  '    if (offenHier) console.log(' \
  '    if (false) console.log('

echo
echo "$gefangen gefangen · $durch durchgerutscht · $tot tote Anker"
[ "$durch" -eq 0 ] && [ "$tot" -eq 0 ] || exit 1
