# Brief · Folge-Sitzung: Schutzschichten am Knotennetz und Paper S

```
Du bist eine Hauptsitzung in Sage-Protokol.

Zuerst frisch von origin/main abzweigen:
  bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"
  git -C Sage-Protokol fetch origin --quiet && git -C Sage-Protokol checkout -B <branch> origin/main

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md (Einträge 2026-10-14 und 2026-10-15)
3. docs/sessions/archiv/2026-10-15_abschluss_pruef-reihe-sitzung6.md
4. docs/PLAN_MYCEL_SCHICHTEN.md
5. docs/papers/PLAN_PAPER_KNOTENNETZ.md
6. docs/INTERFACES.md — nur Modul 02 (signDetached/verifyDetached) und Modul 23
   (Bau 23.R, Antwort-Zettel v2)

Ausgangslage: Bau 23.R ist in Sage und 13 Trägern (Echtheit wirkt, Antworten signiert und an den
Gefragten gebunden, HTML escapt). Geplant sind die Schichten S1–S7; freigegeben ist bisher nur
S5 (Bürgen) als Planpunkt. Paper S („Sicherer Umgang im Knotennetz") ist als Gerüst geplant,
als Ergänzung zum veröffentlichten SBKIM-Paper (DOI 10.5281/zenodo.22277738).

Deine Aufgabe heute:
1. Klaus fragen, welche Schichten er freigibt (Vorschlag S1 → S2 → S5 → S3 → S4).
2. Mit dem Freigegebenen beginnen, Vorschlag S1 „Fragen unterschreiben":
   - zuerst INTERFACES: Frage-Zettel v2 (spore + sig, wie Antwort-Zettel v2)
   - dann Modul 23; eine unsignierte Frage wird weiter beantwortet, aber als „unbestätigt"
     vermerkt; Probe UND Gegenprobe (jeder Fall rot mit dem Namen seiner Zusicherung)
   - Rollout mit `node tools/kanon-verteilen.mjs`; danach in Workflow-Calculate und
     Workflow-Needs `node tools/cache-stand.mjs`; erst auf main nachzählen, dann Zweige heben
3. Die noch offenen Träger auf Bau 23.R nachziehen: PWA-Toolpoint, Kimseek, SB-KIMTool-Point,
   family-project, Kim-Bell; dazu docs/observatorium/tools/mycelknoten.html prüfen.
4. Paper S: Gliederung mit Klaus abstimmen; erst schreiben, wenn S1 gebaut ist und die offenen
   Träger nachgezogen sind (keine Anleitung zu offenen Lücken veröffentlichen).

Regeln, die hier besonders gelten:
- Befund ins Dokument, Rat in den Chat.
- „Garantiert" nur mit Probe UND Gegenprobe, in der gemessenen Umgebung.
- Natur-Vergleich: bewährt ist das MUSTER; ob der Code trägt, zeigt nur seine Gegenprobe.
- Klaus' Lesart „Störungen als Prüfmechanismus" als seine Sicht kennzeichnen.
- Die veröffentlichten Papers nicht ändern.

Kimhub: die Gegenprobe dort ist laut Klaus (2026-10-15) durch. Die Forschungseinträge für die
Sitzungen vom 2026-10-14/15 stehen als Material im Abschluss (Abschnitt 5) und werden von der
Kimhub-Sitzung übernommen. Diese Sitzung fasst Kimhub nur an, wenn Klaus es ausdrücklich sagt.

Pflicht am Ende:
- PULS.md aktualisieren, Abhak-Liste in PLAN_MYCEL_SCHICHTEN.md nachziehen.
- Übergabeprotokoll in docs/sessions/archiv/YYYY-MM-DD_<thema>.md.
- Vorgeschlagene nächste Schritte und den nächsten Brief im Chat ausgeben.
```
