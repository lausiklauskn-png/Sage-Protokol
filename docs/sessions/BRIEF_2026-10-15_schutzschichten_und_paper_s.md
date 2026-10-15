# Brief · Folge-Sitzung: Schutzschichten am Knotennetz und Paper S

> **Ersetzt am 2026-10-15** durch `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md` (Klaus: ein einziger Brief, der Reihe nach). Hier nur noch nachschlagen, nicht danach arbeiten.

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
   family-project, Kim-Bell (Weg: Abschnitt „Nachziehen" unten); dazu
   docs/observatorium/tools/mycelknoten.html prüfen. Jede spätere Schicht (S1 …) geht denselben
   Weg in ALLE Träger, nicht nur nach Sage.
4. Paper S: Gliederung mit Klaus abstimmen; erst schreiben, wenn S1 gebaut ist und die offenen
   Träger nachgezogen sind (keine Anleitung zu offenen Lücken veröffentlichen).

Nachziehen in die anderen Repos (Klaus 2026-10-15: „wenn eine Verbesserung ist, müssen wir
das in die anderen Repos nachziehen"):
- Es läuft NICHT automatisch über Sage. Jede App trägt die Module als eigene Kopie und lädt sie
  aus ihrem eigenen Repo. Eine Änderung in Sage erreicht keine App, bis sie dort hineinkopiert
  und gemergt ist.
- Weg je Kanon-Änderung: `node tools/kanon-verteilen.mjs` (erst ohne --schreiben ansehen), dann
  --schreiben → je Repo Probe, PR, Merge → auf main nachzählen. Der Verteiler findet nur Repos,
  die in der Sitzung geklont sind; was nicht im Sitzungs-Umfang ist, bleibt liegen und wird
  NAMENTLICH als offen gemeldet.
- Stand 2026-10-15: 13 Träger gleich (Lauf ohne --schreiben: „25 schon gleich · 0 hängen
  zurück"). Offen: PWA-Toolpoint, Kimseek, SB-KIMTool-Point, family-project, Kim-Bell
  (nicht im Sitzungs-Umfang gewesen) — für diese Repos in die Sitzung holen (add_repo).
- Nach dem Merge braucht jedes Gerät einmal ⟳ / Hard-Reload; der Verteiler hat den Cache
  erhöht, der Service-Worker holt dann die neue Fassung.

Sporen (Klaus' Frage: „ob wir neue Sporen erzeugen müssen"):
- Für Bau 23.R: NEIN. Antworten werden mit dem schon vorhandenen Schlüssel der App
  unterschrieben (Modul 02 signDetached nimmt die bestehende Identität); die Spore selbst hat
  sich nicht geändert, alte Sporen bleiben gültig. Das Siegel zeigt den neuen Sicherheits-Aspekt
  ohne neues Andocken (ZERTIFIKAT_ASPEKTE).
- Ausnahme, gezielt prüfen: verschwindet nach dem Update eine App von der Karte, war ihre Spore
  schon vorher ungültig signiert und wurde nur wegen des alten Fehlers angenommen. Dann (und nur
  dann) im Siegel der App neu signieren. Live nicht gemessen — braucht einen Blick auf die
  Mycel-Karte bzw. einen Mitschnitt.
- Übergangszeit: Apps, die noch die alte Fassung tragen (die fünf oben), antworten
  unsigniert; ihre Antworten erscheinen bei aktualisierten Apps als „unbestätigt". Das ist
  gewollt und verschwindet mit dem Nachziehen.
- Für die kommenden Schichten steht je Schicht in docs/PLAN_MYCEL_SCHICHTEN.md, ob neu
  signiert werden muss.

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
