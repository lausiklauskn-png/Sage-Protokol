# Brief: Sichttest des Überblicks, dann Pflege (Stand 2026-10-16)

## Was es gibt

`sicherheit.html` ist seit dem 2026-10-16 ein Überblick in Stichworten zu Mycel, Siegel und
Schutz (S1–S5b), Deutsch und Englisch, mit Wort-Sprüngen und „↩ zurück“. Er liegt in 27
Trägern (Übergabe `sessions/archiv/2026-10-16_ueberblick-mycel-siegel.md`). Verteilt wird mit
`node tools/sicherheit-verteilen.mjs [--schreiben]`; was eine App anpasst, gehört zwischen die
Marken `APP-EIGEN-DE/-EN/-KOPF/-FUSS` (`docs/PFLICHT_MODULE.md` § sicherheit.html).

## Der Auftrag

1. **Klaus' Sichttest abholen.** Fragen: Lesen sich die Stichworte für einen normalen Nutzer?
   Gehen Sprung und Rückweg mit dem Finger, auch im Siegel-Fenster? Fehlt ein Begriff, der ein
   Link sein sollte? Änderungen in Sages `sicherheit.html`, dann Probe, Gegenprobe, verteilen.
2. **Pflege-Liste § 37:** fragt Klaus, ob Mixarium, Rezeptbuch, Mein-Tresor und Jasons-Tresor ihr
   eigenes Aussehen der Seite zurückbekommen sollen. Wenn ja: als `APP-EIGEN-KOPF`-Stil.
3. **Pflege-Liste § 36:** `kanon-verteilen.mjs` auf `tools/lib/cache-bump.mjs` umbauen, Anker
   seiner Gegenproben nachziehen. Nur, wenn Zeit bleibt.

## Nicht

- Keinen Modul-Code ändern. Die veröffentlichten Papers nicht ändern; Paper S steht im
  Gegenlesen bei Klaus.

## Der Brief zum Kopieren

```
Du bist eine Hauptsitzung in Sage-Protokol. Auftrag:
docs/sessions/BRIEF_2026-10-17_ueberblick_sichttest.md

Startprüfung: bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh",
Sitzungsliste und offene PRs ansehen, frisch von origin/main abzweigen.
Pflichtleseliste: CLAUDE.md, docs/PULS.md (ab 2026-10-16), der Brief oben,
docs/PFLICHT_MODULE.md (Abschnitt sicherheit.html), sicherheit.html.
Skill: menschlich-schreiben.

Zuerst Klaus nach seinem Sichttest fragen, dann ändern, prüfen (Probe und Gegenprobe),
mit tools/sicherheit-verteilen.mjs verteilen, auf main nachzählen.
Am Ende: PULS, Übergabe, Forschungseintrag in Kimhub, Brief für die nächste Sitzung im Chat.
```
