# PULS-Auslagerung 2026-11-15 — ein Eintrag vom 2026-10-13

**Ausgelagert am 2026-11-15**, weil `docs/PULS.md` mit dem Eintrag „Vollbild, Klappkarten, Licht-Schichten“ über der
3000-Zeilen-Grenze gestanden hätte (2981 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-10-13 · Eigenes Netz Schritt 4+5 · 17 Träger nachgezogen, 4 neue Knoten, Firmennetz-Knopf in der Mycel-Karte

**Brief:** [`docs/BRIEF_2026-10-13_eigenes-netz-schritt4.md`](BRIEF_2026-10-13_eigenes-netz-schritt4.md). Übergabe: [`sessions/archiv/2026-10-13_eigenes-netz-schritt4-5.md`](sessions/archiv/2026-10-13_eigenes-netz-schritt4-5.md).

**Gebaut:**
- **Schritt 4, Kanon 05b · 23 · 23-UI nachgezogen** per `kanon-verteilen --nur` (kann seit #1077 mehrere Teile mit Komma), je Pins und Cache-Bump, Proben im Ziel-Repo: Auslieferung-Pruefer #49 · Company-Brain #21 · PWA-Toolpoint #164 · SB-KIMTool-Point #182 · Kimboard #148 · Jasons-Tresor #184 · Kim-Bell #70 · Kimseek #89 · Mein-Rezeptbuch #432 · Mein-Tresor #132 · Mein-WorkFloh #262 · Privat-Brain #99 · Tomys-Hub #241 · BookLedgerPro #327 · Mein-Mixarium #244 · Muttis-Rezeptbuch #237 · family-project #356.
- **Neue SBKIM-Knoten** (Bauart Sende-Prüfer, kein Modul 17, feste Leiste, Box „Netz“): Workflow-Calculate #18 (Cache v37) · Workflow-Needs #15 (v21) · Workflow-PDF #106 (v81, Modul 03 bleibt hinter „Modell laden“, Leiste bis 600 px als Lasche).
- **Schritt 5, Firmennetz-Knopf in der Mycel-Karte** (mycel-karte #30, Cache v27): Beitritt nur per Link `#sbkim-netz=` nach Rückfrage (nennt Name und Relais, nie den Code), gemerkt nur unter `sbkim_netz_mycelkarte` auf diesem Rechner, nie im Depot, nie in einem Ereignis. Ungültig → kein Socket, rot benannt. Die Ableitung ist eine zweite Fassung von Modul 23 und wird gegen dieselben Zahlen geprüft. Übernommen nach `mycel-karte/` in diesem Depot.

**Gemessen:**
- Workflow-PDF: `npm test` 1235 grün · 0 ROT (`knoten.mjs` 126), Gegenprobe 13 gefangen · 0 blind · 0 tot; Pages-Lauf nach dem Merge erfolgreich.
- mycel-karte: `browser_netz` 28 grün, `gegenprobe_netz` 10 gefangen · 0 blind · 0 tot, Bestand unverändert grün.
- Die übrigen Träger: Proben je im Ziel-Repo, Angaben in den PRs.

⚠ **Benannt, nicht behoben:**
- Privat-Brain `e2e-siegel`: 4 rote Zeilen, gleich auf `main` (Andock-Wizard-Injektion), nicht von hier.
- Die Mycel-Karte lauscht öffentlich auf `sbkim-query`, Modul 23 sendet `sbkim-qry` — öffentliche Fragen sieht die Karte nicht.
- Bei 481 px schneidet Workflow PDFs Kopfzeile „Workfloh PDF“ ab, auch auf `main` ohne Knoten.

⚠ **Nicht gemessen:** der Beitritt per Link am Tablet in den einzelnen Apps · „Wer ist im Raum?“ über das echte interne Relais mit mehreren Apps zugleich.

**Nächster Schritt:** Klaus' Sichttest im Firmennetz (mehrere Apps über denselben Beitritts-Link). Danach die `sbkim-qry`-Marke in der Mycel-Karte.
