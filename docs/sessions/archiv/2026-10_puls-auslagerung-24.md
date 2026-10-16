# PULS-Auslagerung 2026-10-16 — „`vorrat_wirkung.mjs` steht im Läufer (PFLEGE-LISTE § 11)“

**Ausgelagert am 2026-10-16**, weil `docs/PULS.md` mit dem Eintrag „S3 Rechenaufwand“ über der
3000-Zeilen-Grenze gestanden hätte (2998 vorher). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-10-07 · `vorrat_wirkung.mjs` steht im Läufer (PFLEGE-LISTE § 11)

**Rolle:** Pflege-Sitzung (Brief aus Kimhub, Stand `3c8a3cc`).

**Der Brief war überholt, und das gehört an den Anfang.** Er verlangte, die
vier blinden `waitForFunction(async …)` in `tests/vorrat_wirkung.mjs` zu
reparieren. Auf `origin/main` war das seit PR #1050 (2026-09-28) erledigt —
sechs Stellen, nicht vier, mit Familien-Probe und Gegenprobe. Nachgesehen
statt nachgebaut. Offen war nur Schritt 5.

**Gemessen:** Playwright läuft (`playwright-core 1.62.1`, Chromium unter
`/opt/pw-browsers`). Mit den Nachbar-Klonen: **9 grün**, 11 s. Unter Last
(8 Dauerschleifen auf 4 Kernen): **0 rot von 10 Läufen** — die Fassung aus
#1050 hält.

**Getan.** Die Probe meldet fehlende Nachbarn vor dem ersten Browser
(Rückgabewert 3 + `⊘ NACHBAR FEHLT: … —`), `run_alle.mjs` nimmt sie über
`EINZELN` mit und zählt nur das Paar als „nicht lauffähig". Wächter
`tests/smoke_laeufer_nachbar.mjs` (11 grün), Gegenprobe
`tests/gegenprobe_laeufer_nachbar.mjs` (**6 gefangen · 0 durchgerutscht · 0
aus falschem Grund · 0 tote Anker**). `gegenprobe_warten_async.mjs` weiter
**7 gefangen**.

**Voller Lauf:** `run_alle.mjs` **110 grün · 2 rot · 0 nicht lauffähig** (112
Proben). Die zwei roten sind älter und haben einen gemeinsamen Grund — sie
brauchen Nachbar-Klone, die hier nicht liegen. Eingereiht als
`PFLEGE-LISTE.md` § 12, nicht nebenbei umgebaut.

**Offen:** § 12 · fehlendes Chromium ist in allen Sage-Browser-Proben ROT
statt „nicht lauffähig" (benannt in § 11).
