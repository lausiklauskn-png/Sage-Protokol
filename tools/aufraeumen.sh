#!/usr/bin/env bash
# aufraeumen.sh — Platz auf dem Tablet schaffen, ohne Arbeit zu verlieren.
#
# WOFÜR. Jeder Klon trägt seine ganze Git-Historie mit. Was auf GitHub liegt,
# ist dabei nicht verloren — ein Klon ist jederzeit wiederholbar, also darf er
# weg, sobald nichts Eigenes mehr drinsteckt.
#
# WIE GROSS DER GEWINN IST, sagt der erste Gang — und man sollte ihn nicht
# vorher raten. Gemessen auf Klaus' Tablet am 2026-08-20: **fünf** Klone,
# **199 MB** zusammen, davon 50 MB unbedenklich und 17 MB lose Objekte. Vorher
# stand hier "reichlich dreißig Repos, schnell mehrere Gigabyte" — von den 33
# Repos auf GitHub abgeleitet, nicht vom Gerät. Das war um mehr als eine
# Größenordnung daneben und hätte an der falschen Stelle aufräumen lassen: der
# Platz liegt im Browser (alte PWA-Vorräte), nicht in Termux. Deshalb sagt
# dieses Werkzeug Zahlen, bevor es etwas anbietet.
#
# KLAUS' REGEL, die dieses Werkzeug baut (2026-08-19):
#   „wo ich aber auch sehe, dass ich Dinge lösche, die ich nicht löschen möchte."
# Also: NACHSEHEN IST DIE VORGABE. Ein versehentlicher Aufruf tut nichts. Erst
# ein ausdrückliches SCHARF=ja entfernt etwas — und dann nur das, was der erste
# Gang als unbedenklich aufgelistet hat. Dieselbe Bauart wie
# Kimboard/tools/relais-wache.sh, die genau so seit Wochen funktioniert.
#
# DREI GÄNGE, in dieser Reihenfolge:
#   bash tools/aufraeumen.sh              nur nachsehen  (Vorgabe)
#   GC=ja bash tools/aufraeumen.sh        Historien zusammenpacken — löscht NICHTS
#   SCHARF=ja bash tools/aufraeumen.sh    die unbedenklichen Klone entfernen
#
# Der GC-Gang zuerst. Er holt oft schon genug zurück, und er kann nichts kaputt
# machen: `git gc` packt lose Objekte zusammen und lässt alles Erreichbare in
# Ruhe. Bewusst OHNE --aggressive und OHNE --prune=now — beides ist auf einem
# Tablet quälend langsam bzw. räumt Unerreichbares sofort weg, statt ihm die
# übliche Schonfrist zu lassen.
#
# WANN EIN KLON BLEIBT (der eigentliche Riegel). Drei Prüfungen, jede einzeln
# ausreichend, um ihn zu behalten:
#   1. geänderte oder unbekannte Dateien      git status --porcelain
#   2. Commits, die auf KEINEM Remote liegen  git log --branches --not --remotes
#   3. weggelegte Arbeit                      git stash list
#
# Zu (2) — und das ist der Grund, warum hier NICHT mit @{upstream} gerechnet
# wird: `git checkout -B <zweig> origin/main` hängt den Upstream auf main. Wer
# danach gegen @{upstream} prüft, vergleicht mit main und bekommt „sauber"
# gemeldet, während der gleichnamige Remote-Zweig einen ganz anderen Stand hat.
# Diese Falle steht in Sages CLAUDE.md, sie hat schon einmal einen leeren PR
# erzeugt. `--branches --not --remotes` fragt das Richtige: liegt dieser Commit
# irgendwo auf einem Remote? Wenn nein, bleibt der Klon.
#
# Lauf auf dem Tablet (Termux, Prompt `~ $`) — NICHT auf dem Hetzner-Server.

set -u

WURZEL="${WURZEL:-$HOME}"
SCHARF="${SCHARF:-nein}"
GC="${GC:-nein}"

# Das Repo, in dem dieses Skript liegt, wird nie zum Löschen vorgeschlagen —
# man sägt nicht den Ast ab, auf dem man sitzt.
SELBST="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mb() { du -sm "$1" 2>/dev/null | awk '{print $1}'; }

# ── Klone einsammeln ────────────────────────────────────────────────────────
KLONE=()
for d in "$WURZEL"/*/; do
  d="${d%/}"
  [ -d "$d/.git" ] || continue
  KLONE+=("$d")
done

if [ ${#KLONE[@]} -eq 0 ]; then
  echo "Keine Repo-Klone unter $WURZEL gefunden."
  echo "Anderer Ort? Dann:  WURZEL=/pfad/dahin bash tools/aufraeumen.sh"
  exit 0
fi

echo "AUFRÄUMEN — Klone unter $WURZEL"
case "$SCHARF/$GC" in
  ja/*) echo "Gang: SCHARF — die unbedenklichen Klone werden ENTFERNT." ;;
  */ja) echo "Gang: GC — Historien zusammenpacken. Es wird NICHTS gelöscht." ;;
  *)    echo "Gang: nachsehen. Es wird nichts verändert." ;;
esac
echo

FREI_GESAMT=0
LOSE_GESAMT=0
WEG=()

for d in "${KLONE[@]}"; do
  name="$(basename "$d")"
  gesamt="$(mb "$d")"; gesamt="${gesamt:-0}"

  gruende=()
  [ -n "$(git -C "$d" status --porcelain 2>/dev/null)" ] && gruende+=("geänderte Dateien")
  [ -n "$(git -C "$d" log --branches --not --remotes --oneline 2>/dev/null | head -1)" ] \
    && gruende+=("$(git -C "$d" log --branches --not --remotes --oneline 2>/dev/null | wc -l | tr -d ' ') Commit(s) nicht gepusht")
  [ -n "$(git -C "$d" stash list 2>/dev/null)" ] && gruende+=("weggelegte Arbeit (stash)")
  [ "$d" = "$SELBST" ] && gruende+=("hier läuft das Skript")

  letzter="$(git -C "$d" log -1 --format=%cd --date=short 2>/dev/null || echo '—')"

  # Lose Objekte: das ist es, was `git gc` zusammenpacken würde.
  lose_kb="$(git -C "$d" count-objects -v 2>/dev/null | awk '/^size:/{print $2}')"
  lose_mb=$(( ${lose_kb:-0} / 1024 ))
  LOSE_GESAMT=$(( LOSE_GESAMT + lose_mb ))

  if [ ${#gruende[@]} -eq 0 ]; then
    printf '  ✓ %-28s %5s MB  %s  alles gepusht — kann weg\n' "$name" "$gesamt" "$letzter"
    WEG+=("$d")
    FREI_GESAMT=$(( FREI_GESAMT + gesamt ))
  else
    IFS='; ' ; grund="${gruende[*]}" ; unset IFS
    printf '  ⚠ %-28s %5s MB  %s  BLEIBT: %s\n' "$name" "$gesamt" "$letzter" "$grund"
  fi

  if [ "$GC" = "ja" ]; then
    vorher="$gesamt"
    git -C "$d" gc --quiet 2>/dev/null
    nachher="$(mb "$d")"; nachher="${nachher:-$vorher}"
    gespart=$(( vorher - nachher ))
    [ "$gespart" -gt 0 ] && printf '      ↳ zusammengepackt: %s MB frei\n' "$gespart"
  fi
done

echo
echo "── Stand ───────────────────────────────────────────────────────"
echo "  Klone gesamt:            ${#KLONE[@]}"
echo "  davon unbedenklich:      ${#WEG[@]}  (${FREI_GESAMT} MB)"
echo "  lose Objekte in Summe:   ${LOSE_GESAMT} MB — das packt der GC-Gang zusammen, ohne zu löschen"
echo

if [ "$SCHARF" != "ja" ]; then
  echo "Nichts verändert."
  [ "$GC" != "ja" ] && echo "  Zuerst harmlos:  GC=ja bash tools/aufraeumen.sh"
  [ ${#WEG[@]} -gt 0 ] && echo "  Dann entfernen:  SCHARF=ja bash tools/aufraeumen.sh"
  exit 0
fi

if [ ${#WEG[@]} -eq 0 ]; then
  echo "Nichts zu entfernen — jeder Klon trägt noch etwas, das nicht auf GitHub liegt."
  exit 0
fi

echo "Entferne ${#WEG[@]} Klon(e):"
for d in "${WEG[@]}"; do
  rm -rf "$d" && echo "  entfernt: $(basename "$d")"
done
echo
echo "Fertig. ${FREI_GESAMT} MB frei."
echo "Wiederholen lässt sich jeder davon mit:  git clone https://github.com/lausiklauskn-png/<name>"
