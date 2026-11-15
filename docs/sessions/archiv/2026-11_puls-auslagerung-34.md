# PULS-Auslagerung 2026-11-15 — ein Eintrag vom 2026-10-14

**Ausgelagert am 2026-11-15**, weil `docs/PULS.md` nach dem Eintrag „Zwei Filme: Schlüssel in die Truhe, Tür als laufender Film“ über der
3000-Zeilen-Grenze stand (3002). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-10-14 · Prüfung vor dem KI-Richter (04.J), Reinigung vor der Texterkennung (24.R)

**Anlass:** Klaus' Brief für BookLedgerPro und seine Frage, wo „dieses Tool“ noch hinein muss. Die Bestandsaufnahme über rund 30 Repos ergab den Sage-Kanon als ersten Schritt. Klaus' drei Antworten: **Ausschließen und zeigen** · **Richter aus, wenn die Prüfliste fehlt (und ich verteile sie)** · **PDF wie die Rezeptbücher**. Dazu mitten in der Arbeit: *„Die Qualität muss 100 % stimmen“* und *„nur die Segmente … neu zeichnen und die anderen 1:1“*.

**Gebaut (INTERFACES zuerst):**
- `assets/pruefer-mail.js` byte-1:1 aus dem Auslieferungsprüfer (Pin in `smoke_bau04j`), auch in Pinnwand, Such-Tool und beiden Bundles; die Seiten laden sie, der Installer der Voll-Box nimmt sie mit.
- **Modul 04 · `hybridMatch`:** prüft Frage, Namen und jeden Kandidaten. Ohne Liste → Richter aus. Fund in der Frage → Richter aus. Fund in einem Kandidaten → geht nicht an die KI, steht mit `passt:false`, `sicherheit:"gefahr"`, `ausgeschlossen:"ki-anweisung"` im Urteil. Prompt nennt die Texte DATEN (Hürde, kein Schutz).
- **Modul 22:** ausgeschlossene Treffer stehen mit ⚠ am Ende, ohne Link; der Hinweis nennt die Zahl. Ein abgeschalteter Richter nennt seinen Grund.
- **Pinnwand:** derselbe Ausschluss an den Antworten (`richterAuswahl`), ohne Liste startet der Richter nicht; Cache v26.
- **Modul 24 · Reinigung:** nie das Original. JPEG → Bildpunkte 1:1, nur Metadaten und Angehängtes hinter dem Bildende weg. Andere Fotos → volle Größe neu gezeichnet (PNG bleibt PNG). PDF → Seiten mit **300 dpi** über pdf.js + `reinigung.js` von `/Workflow-PDF/`, versteckter Text zugedeckt, `isEvalSupported:false`. Geht das nicht: nichts senden. Erkannter Text geht durch die Liste; Aufrufer halten einmal an.

**Gemessen:** kleine blassgraue Schrift (20 Zeilen): 1400 px/JPEG 85 % → 9 falsch · 300 dpi/JPEG 92 % → 0; PNG ohne Gewinn. Die Browser-Probe las mit den alten Einstellungen die IBAN einer 5-pt-Zeile falsch, mit den neuen richtig. `run_alle` **115 grün · 1 rot** (`geraetename_netzweit`, auch auf main rot — Nachbar-Repos fehlen) · `smoke_bau04j` 30 · `smoke_bau24` 75 · `smoke_bau24r` 17 · `smoke_bau22` 278 · `pinnwand/_smoke` 86 · Gegenprobe `gegenprobe_bau04j_24r.mjs` **17 gefangen · 0 durchgerutscht · 0 gestolpert · 0 tote Anker** (erst 1 gestolpert: eine zu breite Sabotage, enger geschnitten und einzeln nachgefahren).

**Offen:** Verteilung an die Träger (Prüfliste + 04/22/24, Kimhub nie) · `docs/observatorium/tools/mycelknoten.html` trägt Modul 04 eingebettet und ist nicht nachgezogen · am Tablet und mit echtem Mistral/Google nicht gemessen · die Rezeptbücher und Mixarium öffnen PDFs ohne `isEvalSupported:false` und zeichnen mit 1400 px (Fund, gehört in deren Sitzung).
