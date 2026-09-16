#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_kanon_verteilen.mjs.
#
# Ein Waechter ohne Gegenprobe ist nur ein gruener Haken. Jeder Fall hier MUSS
# die Probe umwerfen — und zwar mit dem Namen SEINER Zusicherung in der roten
# Zeile, nicht mit irgendeiner.
#
# GEARBEITET WIRD AN EINER WEGWERF-KOPIE. Die echten Dateien werden nie
# angefasst: ein abgebrochener Lauf soll kein sabotiertes Werkzeug im Depot
# hinterlassen.
set -u
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WURZEL="$(cd "$HIER/.." && pwd)"
KOPIE="$(mktemp -d)"
trap 'rm -rf "$KOPIE"' EXIT

mkdir -p "$KOPIE/tools" "$KOPIE/tests"
frisch() {
  cp "$WURZEL/tools/kanon-verteilen.mjs"          "$KOPIE/tools/"
  cp "$WURZEL/tests/smoke_kanon_verteilen.mjs"    "$KOPIE/tests/"
}

gefangen=0; durch=0; tot=0

saboten() {
  local was="$1" rel="$2" alt="$3" neu="$4"
  frisch
  if ! python3 - "$KOPIE/$rel" "$alt" "$neu" <<'PY'
import sys, io
d, a, n = sys.argv[1], sys.argv[2], sys.argv[3]
s = io.open(d, encoding="utf-8").read()
if a not in s: raise SystemExit(3)
io.open(d, "w", encoding="utf-8").write(s.replace(a, n, 1))
PY
  then echo "  ✗ $was → ANKER NICHT GEFUNDEN (misst nichts)"; tot=$((tot+1)); return; fi
  if (cd "$KOPIE" && timeout 180 node tests/smoke_kanon_verteilen.mjs > /tmp/gpkv.txt 2>&1); then
    echo "  ✗ $was → gruen geblieben, NICHT GEFANGEN"; durch=$((durch+1))
  else
    echo "  ✓ $was → rot: $(grep -m1 '✗' /tmp/gpkv.txt | sed 's/^ *//' | cut -c1-88)"; gefangen=$((gefangen+1))
  fi
}

echo "═══ Ausgangslage ═══"
frisch
if (cd "$KOPIE" && timeout 180 node tests/smoke_kanon_verteilen.mjs > /tmp/gpkv0.txt 2>&1); then
  echo "  ✓ die Kopie ist ohne Eingriff gruen"
else
  echo "  ✗ die Kopie ist SCHON OHNE EINGRIFF rot — die Gegenprobe misst nichts."
  tail -3 /tmp/gpkv0.txt; exit 1
fi

echo
echo "═══ A · Der Riegel um die App-Identitaet ═══"
# ⚠ DER WICHTIGSTE FALL. Beim Bauen am 2026-09-14 hat die erste Fassung
# `siegel-inhalt.js` wirklich mitverteilt — und damit jeder App Sages Namen,
# Sages Beschreibung und Sages Stichworte gegeben.
saboten "siegel-inhalt.js faellt aus der Sperrliste" \
  tools/kanon-verteilen.mjs \
  'const NIE_VERTEILEN = new Set(["siegel-inhalt.js", "pruefer-siegel-inhalt.js"]);' \
  'const NIE_VERTEILEN = new Set(["pruefer-siegel-inhalt.js"]);'

# ⚠ KEIN EIGENER FALL FUER DEN ZWEITEN RIEGEL, und das ist eine BENANNTE
# GRENZE statt einer Luecke. Beide Riegel lesen dieselbe Liste `NIE_VERTEILEN`:
# der Fall darueber leert sie und faengt damit BEIDE zugleich — die Zusicherung
# „die App-Identitaet bleibt unberuehrt" ist also gedeckt. Ein Fall, der NUR
# die zweite `if`-Zeile ausbaut, blieb beim ersten Lauf am 2026-09-14 gruen,
# und zwar zu Recht: der erste Riegel faengt die Datei dann immer noch ab. Er
# haette bewiesen, was er nicht misst.
#
# Warum der zweite Riegel trotzdem bleibt: er greift in einem Fall, den es
# heute nicht gibt — wenn eine ZIEL-Datei eine Kanon-Marke traegt, die im Kanon
# wirklich vorkommt. Das ist Vorsorge, kein toter Code; ein Fall dafuer waere
# heute immer „nicht gefangen". Ein Fall, der nichts messen kann, sieht aus wie
# Deckung.

echo
echo "═══ B · Erkennung am INHALT statt am Namen ═══"
# Ohne die Marke traefe eine Namens-Suche den Loader und die Fassung des
# Modells mit — genau die Falle, in die ich am 2026-09-14 fast gelaufen waere.
saboten "die Marke wird ignoriert, es zaehlt nur noch der Dateiname" \
  tools/kanon-verteilen.mjs \
  '    const marke = markeVon(txt);
    const k = marke' \
  '    const marke = null;
    const k = marke'

# Modul 20 schreibt „SBKIM — Modul 20:" mit Doppelpunkt. Wer nur „—" zulaesst,
# verliert es STILL — kein Fehler, nur eine Datei weniger.
saboten "das Marken-Muster laesst den Doppelpunkt nicht mehr zu" \
  tools/kanon-verteilen.mjs \
  '\s*[—:]/;' \
  '\s*—/;'

echo
echo "═══ C · Der Cache-Bump ═══"
# Ein Automat, der bei JEDEM Lauf hochzaehlt, zwingt jedem Nutzer bei jedem
# Lauf einen neuen Download auf.
# ⚠ TOTER ANKER, GEFUNDEN AM 2026-09-16: der Fall zeigte auf
#   `if (!imVorrat) continue;` — die Bedingung heisst seitdem
#   `if (!imVorrat && !faengtAb) continue;`. Er meldete „ANKER NICHT GEFUNDEN"
#   und mass nichts. Nachgezogen und in DREI Faelle zerlegt, weil die Regel
#   jetzt drei Haelften hat.
saboten "der Bump prueft gar keine Bedingung mehr" \
  tools/kanon-verteilen.mjs \
  '    if (!imVorrat && !faengtAb) continue;' \
  '    if (false) continue;'

# ⚠ DIE TEURERE RICHTUNG: ein Sicherheits-Update, das still nicht ankommt.
saboten "ein cache-first-Worker wird wieder uebersehen" \
  tools/kanon-verteilen.mjs \
  '    if (!imVorrat && !faengtAb) continue;' \
  '    if (!imVorrat) continue;'

# ⚠ Und die Gegenrichtung: ohne Geltungsbereich fliegt der Vorrat jeder
#   Unter-App im selben Depot mit.
saboten "der Geltungsbereich wird nicht mehr geprueft" \
  tools/kanon-verteilen.mjs \
  '    const faengtAb = ziel.startsWith(bereich)' \
  '    const faengtAb = true'

# ⚠ Und ohne das Gedaechtnis bumpt ein Repo mit ZWEI Kopien zweimal — der
#   zweite Bump wirft den Vorrat weg, den der erste gerade angelegt hat.
#   Gefangen wird das von der Zusicherung „v2 → v3": ohne das Gedaechtnis
#   steht dort v4. App-Eins traegt zwei Kanon-Dateien (Modul 16 und Modul 20),
#   deshalb misst der Fall hier wirklich etwas — mit nur einer Kopie waere er
#   immer „nicht gefangen".
saboten "zwei Kopien im selben Repo bumpen zweimal" \
  tools/kanon-verteilen.mjs \
  '    if (schonGebumpt.has(sw)) continue;' \
  '    if (false) continue;'

echo
echo "$gefangen gefangen · $durch durchgerutscht · $tot tote Anker"
[ "$durch" -eq 0 ] && [ "$tot" -eq 0 ] || exit 1
