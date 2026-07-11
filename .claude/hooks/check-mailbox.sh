#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# SITZUNGSSTART — UNGELESENE BRIEFKASTEN-POST SICHTBAR MACHEN (git-Briefkasten).
#
# Lehre (Klaus 2026-07-11): ein Briefkasten scheitert am LESEN, nicht am
# Schreiben — die Briefe (AUSTAUSCH-*.md) liegen oft lange ungelesen, weil das
# Lese-Ritual (§11.6: „bei Sitzungsstart Peer-SIGNAL.json lesen, mit ack
# vergleichen, quittieren") freiwillig ist und vergessen wird. Dieser Hook macht
# das Lesen AUTOMATISCH sichtbar: er vergleicht das seq jeder Gegenstelle
# (deren sbkim/SIGNAL.json auf origin/main) mit dem eigenen ack und meldet
# jede ungelesene Post prominent — so kann keine Sitzung sie mehr übersehen.
#
# NUR ANZEIGE. Er quittiert NICHTS (das bleibt Aufgabe der Sitzung, nachdem sie
# den Brief gelesen + gehandelt hat). Läuft NACH refresh-origin-main.sh, damit
# die origin/main-Stände frisch sind. Bricht eine Sitzung nie ab (exit 0).
#
# Aufruf: automatisch via SessionStart-Hook (.claude/settings.json) ODER:
#   bash Sage-Protokol/.claude/hooks/check-mailbox.sh
# ─────────────────────────────────────────────────────────────────────────────
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SELF="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"   # …/Sage-Protokol

python3 - "$ROOT" "$SELF" <<'PY'
import json, subprocess, sys, os
ROOT, SELF = sys.argv[1], sys.argv[2]

# Ausnahme-Zuordnung Sage-Briefkasten-Label -> lokaler Repo-Ordner (nur wo der
# Name abweicht; sonst Label == Ordner). Neue Abweichung? Hier ergänzen.
DIR_EXCEPTIONS = {"Family Projekt": "family-project"}

def git_show(repo, path):
    try:
        out = subprocess.run(["git", "-C", repo, "show", "origin/main:%s" % path],
                             capture_output=True, text=True, timeout=15)
        return out.stdout if out.returncode == 0 else None
    except Exception:
        return None

def load_signal(repo):
    raw = git_show(repo, "sbkim/SIGNAL.json")
    if raw is None:
        # Fallback: Arbeitskopie (falls origin/main die Datei nicht hat)
        p = os.path.join(repo, "sbkim", "SIGNAL.json")
        try:
            raw = open(p, encoding="utf-8").read()
        except Exception:
            return None
    try:
        return json.loads(raw)
    except Exception:
        return None

own = load_signal(SELF)
if not own:
    print("── 📬 Briefkasten-Check: eigene sbkim/SIGNAL.json nicht lesbar — übersprungen ──")
    sys.exit(0)

ack = own.get("ack", {}) or {}
mailboxes = own.get("mailboxes", {}) or {}
peers = sorted(set(list(ack.keys()) + list(mailboxes.keys())))

unread, missing = [], []
for peer in peers:
    d = DIR_EXCEPTIONS.get(peer, peer)
    repo = os.path.join(ROOT, d)
    if not os.path.isdir(os.path.join(repo, ".git")):
        missing.append((peer, d))
        continue
    sig = load_signal(repo)
    if not sig:
        missing.append((peer, d))
        continue
    seq = sig.get("seq")
    have = ack.get(peer, 0)
    if isinstance(seq, int) and seq > (have if isinstance(have, int) else 0):
        # lokale AUSTAUSCH-Datei aus der Mailbox-URL ableiten (Basename)
        url = mailboxes.get(peer, "")
        fname = url.rsplit("/", 1)[-1] if url else "sbkim/AUSTAUSCH*.md"
        unread.append((peer, seq, have, sig.get("headline", ""), "sbkim/" + fname))

print("── 📬 Briefkasten-Check (git, §11.6) ──")
if unread:
    print("  ⚠ UNGELESENE POST — %d Gegenstelle(n) haben Neues:" % len(unread))
    for peer, seq, have, head, fpath in unread:
        print("    • %s: seq %s > dein ack %s" % (peer, seq, have))
        if head:
            print("        „%s“" % head[:110])
        print("        → lies %s (bzw. deren AUSTAUSCH), handeln, dann ack auf %s setzen." % (fpath, seq))
    print("  (NUR Anzeige — quittiere selbst, nachdem du gelesen + gehandelt hast.)")
else:
    print("  ✓ nichts Ungelesenes (alle Gegenstellen quittiert).")
if missing:
    print("  · nicht lokal prüfbar (kein Klon/keine SIGNAL.json): " + ", ".join(p for p, _ in missing))
print("──────────────────────────────────────────")
PY
exit 0
