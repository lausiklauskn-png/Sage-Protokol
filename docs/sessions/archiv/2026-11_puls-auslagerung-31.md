# PULS-Auslagerung 2026-11-15 — ein Eintrag vom 2026-10-13

**Ausgelagert am 2026-11-15**, weil `docs/PULS.md` mit dem Eintrag „Topologie auf einen Blick, Klick-Hinweise heraus“ über der
3000-Zeilen-Grenze gestanden hätte (2984 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-10-13 · Firmennetz: Fragen-Marke der Mycel-Karte, Privat-Brain-Siegelprobe grün

**Brief:** [`docs/BRIEF_2026-10-14_firmennetz-sichttest.md`](BRIEF_2026-10-14_firmennetz-sichttest.md). Übergabe: [`sessions/archiv/2026-10-13_firmennetz-fragenmarke-siegel.md`](sessions/archiv/2026-10-13_firmennetz-fragenmarke-siegel.md).

**Gebaut:**
- **Mycel-Karte hört Fragen über Modul 23** (mycel-karte #31, Cache v28): die Karte abonnierte nur `sbkim-query`/`-reply` (Modul 05). Modul 23 sendet unter **einer** Marke `sbkim-qry` und nennt die Art in `content.kind`. Die Karte abonniert jetzt beide und deutet `sbkim-qry` **vor** dem Mitschnitt um. Eine unbekannte Art wird verworfen, nicht geraten. Übernommen nach `mycel-karte/` in diesem Depot (`tools/mycelkarte-uebernehmen.mjs`, nur diese 12 Zeilen).
- **Privat-Brain `e2e-siegel` grün** (Privat-Brain #100): der Code war richtig. Die Probe suchte noch die alten Kennungen `pb-*`, seit A18 heißen sie `sbkim-si-*`. Damit laufen die drei Pinnwand-Proben dahinter wieder (57 · 21 · 15).

**Gemessen:**
- mycel-karte: `browser_netz` 32 grün · `gegenprobe_netz` 14 gefangen · 0 blind · 0 tot · `gegenprobe_wiedergabe` 40/40. Ihr Anker traf seit #30 die falsche Stelle (`handleRelayEvent({` steht zweimal) und ist eindeutig gemacht.
- Sage-Kopie: `smoke_mycelkarte_kopie` 32 grün · `gegenprobe_mycelkarte_kopie` 18 gefangen · 0 blind · 0 tot (Wegwerf-Kopie).
- Privat-Brain: `e2e-siegel` 16 grün · 0 rot · `npm test` Rückgabe 0. Von Hand gegengeprüft: ohne die Wizard-Zeile 4 rot.

⚠ **Nicht gemessen:** Klaus' Sichttest im Firmennetz am Tablet (seine Rückmeldung lag nicht vor) · echter Modul-23-Fragenverkehr in der Karte (gestellt) · das echte interne Relais.

⚠ **Weiter offen:** bei 481 px schneidet Workflow PDFs Kopfzeile „Workfloh PDF" ab, auch auf `main`.

**Nächster Schritt:** Klaus' Sichttest im Firmennetz. Danach die Fragen eines Firmennetzes in der Karte am echten Relais.
