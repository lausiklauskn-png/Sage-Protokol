#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# SITZUNGSSTART-PFLICHT — immer von origin/main arbeiten, NIE auf altem Klon.
#
# Warum: Die Klone im Container können MONATE alt sein (Rezeptbuch war einmal
# vom 19.04., v9.2, ganz ohne SBKIM — live war v10.0). Wer darauf arbeitet, redet
# an Klaus vorbei und baut auf totem Stand. Darum: bei JEDER Sitzung zuerst hier
# durch — fetch origin, und wo der lokale Stand sauber hinter origin liegt,
# fast-forward. Nichts Zerstörendes: unsaubere/abweichende Branches werden nur
# GEMELDET, nie hart zurückgesetzt.
#
# Aufruf: automatisch via SessionStart-Hook (.claude/settings.json) ODER von Hand:
#   bash Sage-Protokol/.claude/hooks/refresh-origin-main.sh
# ─────────────────────────────────────────────────────────────────────────────
set -u

# /home/user = Elternordner dieses Repos (…/Sage-Protokol/.claude/hooks/ → 3 hoch)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

echo "── Sitzungsstart: origin/main-Abgleich (${ROOT}) ──"

# Alle Repos parallel fetchen (schneller bei 20+ Klonen)
for d in "$ROOT"/*/; do
  [ -d "$d/.git" ] || continue
  git -C "$d" fetch origin --quiet >/dev/null 2>&1 &
done
wait

stale=0; total=0
for d in "$ROOT"/*/; do
  [ -d "$d/.git" ] || continue
  total=$((total+1))
  name="$(basename "$d")"
  def="$(git -C "$d" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#origin/##')"
  [ -z "$def" ] && def="main"
  git -C "$d" rev-parse "origin/$def" >/dev/null 2>&1 || { def="master"; }
  git -C "$d" rev-parse "origin/$def" >/dev/null 2>&1 || continue
  cur="$(git -C "$d" rev-parse --abbrev-ref HEAD 2>/dev/null)"
  behind="$(git -C "$d" rev-list --count "HEAD..origin/$def" 2>/dev/null || echo 0)"
  dirty="$(git -C "$d" status --porcelain 2>/dev/null)"
  if [ "${behind:-0}" -gt 0 ]; then
    if [ "$cur" = "$def" ] && [ -z "$dirty" ]; then
      git -C "$d" merge --ff-only "origin/$def" --quiet >/dev/null 2>&1 \
        && echo "  ↑ $name: lokal '$def' auf origin/$def aktualisiert (+$behind)" \
        || echo "  ⚠ $name: $behind hinter origin/$def, ff fehlgeschlagen"
    else
      stale=$((stale+1))
      echo "  ⚠ $name: $behind Commits hinter origin/$def (auf '$cur'${dirty:+, uncommittete Änderungen}) — NEUE Arbeit von origin/$def abzweigen!"
    fi
  fi
done

echo "── Abgleich fertig: $total Repos geprüft, $stale brauchen bewusstes Abzweigen von origin/main ──"
echo "REGEL: Vor Arbeit an einem Repo IMMER frisch von origin/<default> abzweigen"
echo "       (git fetch origin && git checkout -B <branch> origin/main) — NIE auf dem vorgefundenen Klon bauen."
exit 0
