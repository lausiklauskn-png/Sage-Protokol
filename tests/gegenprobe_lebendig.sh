#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_lebendig.mjs.
# Jeder Fall baut EINEN Fehler in eine WEGWERF-KOPIE ein und besteht darauf, dass genau der
# zuständige Wächter rot wird. Der echte Baum wird nicht angefasst.
#   bash tests/gegenprobe_lebendig.sh
set -u
QUELLE="$(cd "$(dirname "$0")/.." && pwd)"
gefangen=0; durch=0
fall() { # name · erwartete rote Zeile · Sabotage-Befehl (läuft im Kopie-Ordner)
  local A; A="$(mktemp -d)"
  mkdir -p "$A/assets" "$A/docs/einladung/vendor"
  cp "$QUELLE/index.html" "$A/"; cp "$QUELLE/assets/schwarzes-loch.js" "$A/assets/"
  cp -r "$QUELLE/assets/video" "$A/assets/"; cp "$QUELLE/docs/einladung/index.html" "$A/docs/einladung/"
  cp -r "$QUELLE/docs/einladung/vendor/video" "$A/docs/einladung/vendor/"
  ( cd "$A" && eval "$3" )
  local AUS; AUS="$(LEBENDIG_WURZEL="$A" node "$QUELLE/tests/smoke_lebendig.mjs" 2>&1)"
  if echo "$AUS" | grep -q "✗ .*$2"; then gefangen=$((gefangen+1)); echo "  gefangen: $1"
  else durch=$((durch+1)); echo "  DURCHGERUTSCHT: $1"; fi
  rm -rf "$A"
}
AUS="$(node "$QUELLE/tests/smoke_lebendig.mjs" 2>&1)" || { echo "ABBRUCH: Ausgangslage ist schon rot."; exit 2; }
echo "Ausgangslage grün."
fall "Kachel-Film fehlt"            "ms-3.mp4: Film liegt im Depot"        "rm assets/video/ms-3.mp4"
fall "Film lädt vorab"              "sonne.mp4: lädt nicht vorab"          "sed -i 's|preload=\"none\" aria-hidden=\"true\" data-src=\"assets/video/sonne.mp4\"|preload=\"auto\" aria-hidden=\"true\" data-src=\"assets/video/sonne.mp4\"|' index.html"
fall "Einladungs-Film fehlt"        "scene-5-tuer.mp4: Film liegt im Depot" "rm docs/einladung/vendor/video/scene-5-tuer.mp4"
fall "Skript nicht eingebunden"     "lädt assets/schwarzes-loch.js"        "sed -i 's|<script src=\"assets/schwarzes-loch.js\"></script>||' index.html"
fall "Rückfall-Film fehlt"          "der Rückfall-Film liegt im Depot"     "rm assets/video/schwarzes-loch.mp4"
fall "Knopf startet sichtbar"       "der Knopf startet versteckt"          "sed -i 's|id=\"bh-steuern\" hidden|id=\"bh-steuern\"|' index.html"
fall "Kachel schrumpft wieder"      "die offene Kachel nimmt zwei Spalten" "sed -i 's|aspect-ratio: auto; grid-column: span 2;|aspect-ratio: auto;|' index.html"
fall "Mindesthöhe entfernt"         "bleibt mindestens quadratisch"        "sed -i \"s|k.offsetWidth + 'px' : ''|''|\" index.html"
fall "Mini-Universen nicht gemalt"  "die Mini-Universen werden gemalt"     "sed -i 's|try { malMiniUniversum(el, lehre.shape, lehre.n); } catch (_e) {}||' index.html"
fall "Schleife läuft immer"         "die Schleife ruht"                    "sed -i 's|if (stage.offsetParent === null) {|if (false) {|' index.html"
echo "═══ $gefangen gefangen · $durch durchgerutscht ═══"
[ "$durch" -eq 0 ]
