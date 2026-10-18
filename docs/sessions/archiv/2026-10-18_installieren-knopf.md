# Übergabe · 2026-10-18 · Installieren: Manifest-id, Rat, Kontrast, Knopf in jede App

Sitzung `session_01LevrrSPW9ZMShwtXac7ag3` (Hauptsitzung, mit Helfern). Arm: voll.
Nächste Sitzung: `docs/sessions/BRIEF_2026-10-18_workfloh-pdf-page-vorraete.md`.

## 1 · Manifest-id (12:35–14:24 UTC)

Klaus: Installieren über das Chrome-Menü endete mit „App konnte nicht geöffnet werden".
Befund an `chrome://webapks`: Chrome löst `id` gegen den **Ursprung** auf; `"./"` wurde
für jede App `https://lausiklauskn-png.github.io/`, `"./index.html"` für beide Rezeptbücher
dieselbe Kennung. Gelöst mit einer **absoluten id im eigenen Ordner** in allen betroffenen
Apps; zwei Test-Apps (`installtest/`, `installtest-mix/`) danach wieder entfernt. Am Tablet
bestätigt (Mixarium, In-and-Out). ⚠ Meine erste Reparatur in Mixarium (#259) war selbst falsch
(`/index.html`), gerechnet mit `new URL(id, start_url)` statt wie Chrome.

## 2 · Rat und Kontrast der Install-Meldung (17:16–18:07 UTC)

- Der Erklärtext riet „Websitedaten löschen" — auf github.io nähme das ALLEN Apps die Daten.
  Ersetzt (Sage #1151) und in alle Träger kopiert.
- Klaus' Handy: Meldung hell auf weiß (`color:inherit` + fehlendes `--flaeche`). Sage #1152 misst
  den Kontrast nach dem Einhängen, unter 4,5 fest #1a1a1a auf #fff (`data-lesbar`).

## 3 · Installieren-Knopf in jede App (18:03–19:09 UTC)

Klaus: *„unter Einstellungen, Installier-Button hinten … Wenn es kein Einstellungsfeld gibt,
dann oben ins Menü … Sobald die Installation stattgefunden hat … verschwindet er. In jede App."*
Sage #1153 bringt `data-in` (Knopf als letztes Element eines Einstellungs-Behälters, auch nach
Neuzeichnen). Danach in vier Helfergruppen über alle installierbaren Apps, je gemessen im echten
Browser (sichtbar · als App weg · Meldung lesbar · `getInstallabilityErrors` leer · 360 px).

| Ort | Apps |
|---|---|
| Einstellungen, hinten | Workflow-Needs, Workflow-Calculate, Workflow PDF (+ Kopf), Kim-sync, In-and-Out-Book, BookLedgerPro, Company Brain, Privat Brain, Mycel-Karte (Regler), Sende-Prüfer, Auslieferungsprüfer (+ GPT-Kopien) |
| Einstellungen, oben (Vorbild Mein Rezeptbuch) | Mein Rezeptbuch, Muttis Rezeptbuch, Mein Mixarium, Mein WorkFloh, Tomys WorkFloh, Papas Aktenschrank |
| Kopfleiste (keine Einstellungen) | Sage, Pinnwand, Such-Werkzeug (Sage + SBK), SB·KIMTool·Point, Mein Tresor, Jasons Tresor, Kim-Bell, Kimboard, Kimseek, kimhub, kim-hub-company, PWA Toolpoint, family-projekt.de, Tomys Hub (+ BookLedger, Promptgenerator, Showcase), Kochfreunde, Küchenzettel, Datei-Post, Alis Moderaum, Perfect Skin Fashion, Workfloh-PDF-Page, Mein-Rezeptbuch-Page, Mein-Workfloh-Page, isd-page-entwurf, semantic-match-demo, Family-Projekt.de-Video (schon da) |

Klaus' Entscheidungen am Ende: „oben/hinten" bleibt wie gebaut · **Papas Aktenschrank**
installierbar gemacht (echtes Manifest + `sw.js` statt `blob:`, #2) · **kim-hub-company** auf
Kimhub `1332336` nachgezogen (#86), ohne private Daten; die Forschungsaufträge bleiben in Kimhub.

### Benannt, nicht behoben

- **Workfloh-PDF-Page `sw.js`** löscht beim Aktivieren alle fremden Vorräte → nächste Sitzung (Brief).
- PWA Toolpoint / family-projekt.de: Platzhalter gegen CLS nötig (ohne: 0,198–0,540, mit: 0).
- Vorher schon rot: Sendepruefer-Made-GPT (6), BookLedgerPro `smoke_a5_antwortpfad`, Sage
  `smoke_mycelkarte_kopie` + `pinnwand/_smoke_mikrofon`; Alis Moderaum „Unexpected token export".
- `sbkim-demo/`, Datei-Post, Perfect Skin Fashion: kein Service-Worker (Chrome meldet trotzdem keine Fehler).
- kim-hub-company: zwei ältere blinde Gegenprobe-Fälle (auf main ebenso); `data-name="Kimhub"` aus dem Ableiter.
- Papas Aktenschrank: Repo privat — ob Pages unter `/papas-aktenschrank/` ausliefert, nicht prüfbar.
- Ohne Manifest, also kein Knopf: FP-Schleuse, Me-Mixarium, Mein-Mixarium-Page, Muttis-Rezeptbuch-Seite,
  New-Perfect-Skin-Beauty-, PWA-Toolpoint-com, perfect-skin-beauty, sp-fp-md-speicher.

### Nicht gemessen

Nichts aus Abschnitt 3 am Tablet. Eine schon installierte App zeigt die neue Fassung erst nach ⟳
bzw. dem nächsten Öffnen; nach einer geänderten `id` einmal neu installieren.

## 4 · Installieren-Knopf zusätzlich oben in der Kopfleiste (19:20–20:28 UTC)

Klaus: *„setze den Installationsbutton oben in die Navi-Leiste zusätzlich. Da soll er aber
verschwinden, wenn die App installiert ist … Macht das bitte überall so."* Gefahren in vier
Helfergruppen; die Zahlen unten stammen aus deren Berichten, je im echten Browser gemessen.

| App | was neu ist |
|---|---|
| Mein Rezeptbuch, Muttis Rezeptbuch, Mein Mixarium, Mein WorkFloh, Tomys WorkFloh, BookLedgerPro, Papas Aktenschrank | Knopf zusätzlich oben in der Kopfleiste; als App (oder nach `appinstalled`) weg |
| Company Brain, Privat Brain, Mycel-Karte, Workflow PDF | zusätzlich oben (Workflow PDF: Knopf steht schon im HTML, kein Sprung) |
| Sende-Prüfer (#92) · GPT-Kopie (#5) | oben auf jeder Breite, schmalere Rundknöpfe (32 px), auch auf `start.html` |
| Auslieferungsprüfer (#65) · GPT-Kopie (#4) | `start.html` bekommt den Knopf; die GPT-Kopie zeigte als App „✓ App" statt zu verschwinden |
| Kimseek `brain.html` (#104) | Kanon-Datei statt eigenem Knopf, der erst nach `beforeinstallprompt` kam |
| SB·KIMTool·Point (#201) | auf allen vier Seiten in der Statusleiste |
| kim-hub-company (#87) | Bündel-Prüfer mit festem Knopf (`data-fest`), im Drift-Guard gepinnt |

Nur nachgesehen, stand schon oben: kimhub, Kim-Bell, Kimboard, PWA Toolpoint, family-projekt.de,
Datei-Post, Kochfreunde, Küchenzettel, Alis Moderaum, Perfect Skin Fashion, semantic-match-demo,
die drei Landingpages, isd-page-entwurf, Family-Projekt.de-Video, beide Tresore, Sage samt Pinnwand
und Such-Werkzeug. Bewusst ohne Knopf: Unterseiten ohne eigenes Manifest
(`perfect-skin-fashion/video-shop.html`, `Family-Projekt.de-Video/abspielen.html`,
`such-werkzeug.html`, die Jason-Bibliothek, `sbkim-demo/`).

### Benannt, nicht behoben

- **Kanon `assets/installieren.js` verschwindet nicht nach `appinstalled` im selben Tab** — erst beim
  nächsten Öffnen als App. Die Rezeptbuch-Familie tut es schon. Kandidat für Sage.
- Vorher schon breiter als 320 px (Inhalt, nicht der Knopf): kimhub 184 px, Kim-Bell 143, Kimseek/brain 104,
  Kimboard 24, Kochfreunde 12.
- Sende-Prüfer: drei tote Gegenprobe-Anker; GPT-Prüfer `smoke_pruefer` bricht an `#leerKnopf` (beides auf main).

### Nicht gemessen

Nichts aus Abschnitt 4 am Tablet.
