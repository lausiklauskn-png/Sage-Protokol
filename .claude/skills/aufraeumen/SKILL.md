---
name: aufraeumen
description: Prüft alle gespeicherten Anweisungen über Klaus' Repos (CLAUDE.md, Skills, Hooks, settings.json) gegen drei Fragen und hält Archiv und Übersicht aktuell. Anwenden, wenn Klaus „/aufräumen", „aufräumen", „Anweisungen prüfen" oder „räum die Regeln auf" sagt — und wenn eine Sitzung nach dem Stichtag in CLAUDE.md von selbst darauf anspricht. Findet neue Duplikate (dieselbe Regel in mehreren Repos), Widersprüche (dieselbe Regel sagt an zwei Orten Verschiedenes), tote Zeiger, fest verdrahtete Branch-Namen und Anweisungen, die ins Leere greifen. MELDET nur — was entfernt wird, entscheidet Klaus.
---

# Aufräumen — die Anweisungen prüfen und das Archiv nachziehen

Entstanden am 2026-08-22 aus Klaus' Auftrag: *„überprüfe jede Anweisung, die Du über
mich gespeichert hast … behalte nur die Regeln, bei denen Du ohne sie tatsächlich
Fehler machen würdest … verschiebe alles in einen Archivordner, niemals dauerhaft
löschen."*

Das Ergebnis von damals: **9.647 Zeilen** Anweisungen, davon der Gerätename-Block
**20-mal** wortgleich, der Freibrief **19-mal** — und zwei Skills, die zur selben
Sache Verschiedenes sagten.

## Die Reihenfolge

### 0 · Erst den frischen Stand

```bash
bash Sage-Protokol/.claude/hooks/refresh-origin-main.sh
```

Ohne das misst die Prüfung einen Monate alten Klon. Zeigt der Lauf Repos „hinter
origin/main", **erst frisch abzweigen**, dann weiter — und vorher mit
`git log origin/main..HEAD` nachsehen, ob dort eigene, unveröffentlichte Arbeit liegt.

### 1 · Was ist überhaupt gespeichert

```bash
cd /home/user
for d in */; do n="${d%/}"; [ -d "$n/.git" ] || continue
  printf "%-28s CLAUDE.md=%-5s skills=%-3s hooks=%s\n" "$n" \
   "$([ -f "$n/CLAUDE.md" ] && wc -l < "$n/CLAUDE.md" || echo 0)" \
   "$(ls -1 "$n/.claude/skills" 2>/dev/null | wc -l)" \
   "$(ls -1 "$n/.claude/hooks" 2>/dev/null | wc -l)"
done
```

**Nicht anfassen:** `/root/.claude/*.sh` und `*.py`. Das ist die Laufzeit-Umgebung
(Git-Identität für signierte Commits, Stop-Hook), keine Anweisung von Klaus. Ein
Eingriff dort bricht das Signieren.

### 2 · Die drei Fragen, je Anweisung

1. **Würde ich das auch ohne die Anweisung tun?** — Ja bei Höflichkeit, Ehrlichkeit,
   kein PII, sprechende Commits. Nein bei allem Nachprüfbaren: Test-Befehl,
   Cache-Variable, DB-Schublade, byte-1:1-Kopien, Build-Schritt, wo der Glue hingehört.
   **Was ich nicht erraten kann, bleibt.**
2. **Behebt sie eine Schwäche, die ich nicht mehr habe?** — oder greift sie ins Leere?
   (`obsidian-cli` brauchte ein laufendes Obsidian, das es hier nie gibt.)
3. **Widerspricht sie einer anderen Anweisung?** — der wichtigste Punkt. Siehe unten.

### 3 · Wonach konkret suchen

```bash
cd /home/user
# Duplikate: steht derselbe Block in mehreren Repos?
for pat in "Gerätename gehört ins Verbinden-Panel" "Selbst-Merge-Freibrief" \
           "Pflicht vor jeder Arbeit" "Kein PII, keine Geheimnisse"; do
  printf "%-42s %2s Dateien\n" "$pat" "$(grep -l "$pat" */CLAUDE.md 2>/dev/null | wc -l)"
done

# Widersprüche: liegt derselbe Skill mehrfach — und unterschiedlich?
for f in */.claude/skills/*/SKILL.md; do
  printf "%s  %-38s %s\n" "$(md5sum "$f"|cut -c1-8)" "$(basename $(dirname "$f"))" "$(echo "$f"|cut -d/ -f1)"
done | sort
# gleicher Name + verschiedene Prüfsumme = auseinandergelaufen

# tote Zeiger
grep -o '](\(\.\./\)\?[A-Za-z0-9_/.-]*\.md)' */CLAUDE.md */docs/*.md 2>/dev/null \
 | sed 's/:](/ /; s/)$//' | sort -u | while read -r src p; do
     [ -e "$(dirname "$src")/$p" ] || echo "TOT: $src -> $p"; done

# fest verdrahtete Branch-Namen (stehen gegen den Sitzungs-Branch)
grep -rn 'claude/[a-zA-Z0-9-]*-[A-Za-z0-9]\{4,\}' */CLAUDE.md | grep -v 'claude/<' | grep -v docs/archiv
```

**Ein doppelter Skill mit gleicher Prüfsumme ist kein Befund** — nur verschiedene
Prüfsummen bei gleichem Namen sind einer.

### 4 · Melden, nicht selbst wegräumen

**Was entfernt wird, entscheidet Klaus.** Dieser Skill legt eine Tabelle vor:
Anweisung · wo · welche der drei Fragen greift · Vorschlag (bleibt / Zeiger / Archiv).
Erst nach Klaus' Wort wird verschoben.

Ausgenommen sind **eindeutige Fehler**, die keine Abwägung brauchen — ein toter Zeiger,
ein Branch-Name, den es nicht mehr gibt, eine falsche Repo-Identität. Die werden
korrigiert und im PR-Text benannt.

### 5 · Archiv und Übersicht nachziehen

- Je Repo: `docs/archiv/CLAUDE-<datum>.md` mit der vollständigen alten Fassung.
- Zentral: `SP-FP-md-Speicher/Archiv/<datum>-Anweisungen/` mit allen Originalen plus
  `00 ÜBERSICHT.md`. **Obsidian-Konventionen einhalten** — Eigenschaften-Kopf
  (`title`, `date`, `tags`, `aliases`), `[[Wikilinks]]`, Callouts. Ohne Kopf fällt eine
  Notiz aus Suche und `.base`-Ansichten heraus.
- **Nie löschen.** Verschieben, mit Kopfzeile „ersetzt durch …, hier steht der Stand
  vom …".

### 6 · Den Stichtag weitersetzen

In `Sage-Protokol/CLAUDE.md` § „Stichtage" das Datum **um drei Monate** vorstellen.
Sonst erinnert der Vorgang nicht mehr an sich selbst.

### 7 · Prüfen, bevor gemeldet wird

- **Zeiger:** jeder Verweis muss existieren. Beim ersten Lauf 2026-08-22 waren **acht**
  tot — die verschobenen Blöcke verlinkten aus der Repo-Wurzel heraus, was innerhalb
  von `docs/` ins Leere zeigt.
- **Proben laufen lassen**, in jedem angefassten Repo. Achtung auf die Unterscheidung:
  `ERR_MODULE_NOT_FOUND` heißt **nicht lauffähig, nicht rot** — Kimboards Läufer meldet
  fehlende Pakete trotzdem als ROT. Wer das verwechselt, sucht am falschen Ende.
- **Rot vor der Änderung schon rot?** Gegenprüfen: die alte Datei zurückholen und
  denselben Lauf wiederholen. Am 2026-08-22 waren zwei rote Proben in SB-KIMTool-Point
  vorbestehend und hatten mit dem Aufräumen nichts zu tun.
- **Nichts verloren:** jede entfernte Zeile muss im Archiv wieder auftauchen.

## Die Fallen, die beim ersten Lauf zugeschnappt sind

- **Eine Standard-Zeile kann einen neuen Widerspruch erzeugen.** In Company-Brain
  landete „der Glue hängt das Feld ins Panel" direkt unter der dokumentierten Ausnahme
  „liegt hier in der Seite, **nicht** im Panel". Die Gegenprobe hat es gefangen. **Wer
  Text netzweit einsetzt, prüft die Ausnahmen einzeln.**
- **Ein Zitat ist kein Fund.** Zwei Prüfungen schlugen an, weil der neue Text die alte,
  falsche Formulierung **zitierte**, um zu erklären, was daran falsch war. Bevor man
  einen Treffer für einen Fehler hält: hinsehen, in welchem Satz er steht.
- **`git add pfad1 pfad2` bricht ganz ab**, wenn einer der Pfade nicht existiert — in
  acht Repos wurde dadurch nichts committet, obwohl der Befehl durchlief.
- **Ein Ersatz-Block darf nicht länger sein als das Ersetzte.** Der erste Entwurf machte
  neun Dateien **größer**; das Ziel war das Gegenteil.

## Was dieser Skill nie tut

- Code ändern. Nur Markdown.
- Eine byte-1:1-Kopie anfassen (Drift-Guard).
- Eine Regel entfernen, weil sie *„selbstverständlich"* klingt — wenn sie nachprüfbar
  ist, bleibt sie.
- Etwas löschen. **Verschieben, nie löschen.**
