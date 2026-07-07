# Obsidian Agent-Skills (Fremd-Werkzeug, 1:1 kopiert)

**Quelle:** [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)
(Steph Ango / @kepano, Obsidian-CEO) · **Lizenz:** MIT — siehe
[`LICENSE-obsidian-skills`](LICENSE-obsidian-skills) · **Übernommen:** 2026-07-07
(Klaus' Auftrag, Ziel-Wahl Sage-Protokol per AskUserQuestion).

Nach Sage-Disziplin **kopiert, nicht abgewandelt** — die fünf Skill-Ordner sind
byte-gleiche Kopien aus `skills/` des Quell-Repos (Stand: Clone 2026-07-07).

## Was diese Skills tun

Claude-Code-Sitzungen an diesem Repo laden Skills aus `.claude/skills/`
automatisch. Damit kann jede Sitzung mit Obsidian-Formaten arbeiten:

| Skill | Zweck |
|---|---|
| `obsidian-markdown` | Obsidian-Markdown: Wikilinks, Embeds, Callouts, Properties |
| `obsidian-bases` | `.base`-Dateien: Views, Filter, Formeln, Summaries |
| `json-canvas` | `.canvas`-Dateien: Knoten, Kanten, Gruppen (JSON Canvas 1.0) |
| `obsidian-cli` | Obsidian-Vault per CLI steuern, Plugin-/Theme-Entwicklung |
| `defuddle` | Webseiten in sauberes Markdown wandeln (Token-sparend) |

## Pflege-Regel

Aktualisierung = frischer Clone des Quell-Repos, `skills/*` erneut byte-gleich
hierher kopieren, `LICENSE-obsidian-skills` mitnehmen. Keine lokalen
Abwandlungen in den Skill-Dateien — eigene Ergänzungen gehören in eigene
Skill-Ordner, nicht in die kopierten.
