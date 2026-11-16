# PULS-Auslagerung 2026-11-16 — vier Einträge vom 2026-10-15

**Ausgelagert am 2026-11-16**, weil `docs/PULS.md` mit dem Eintrag „Einladung am Handy“ über der
3000-Zeilen-Grenze gestanden hätte (2997 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier stehen die Einträge **wortwörtlich**.

---

## 2026-10-15 · Sammel-Brief Schritt 2, Paket A3: Bau 23.R in Mein-Tresor, Jasons-Tresor, Company-Brain (Hauptsitzung)

- **Getan:** `kanon-verteilen --schreiben --nur 02_spore,16_siegel,23_rendezvous` in einem Lauf (je Träger ein Bump). Mein-Tresor und Jasons-Tresor: 02 (auch `web/tools/sbkim-spore.js`), 16, 23, 23-UI (23 `9464fba75e5a` → `05a6eb42ec68`), Cache v26→v27. Company-Brain: 02 (`0dcde79489a5`, 53 Zeilen) und 23, Pins in `tools/drift-guard.mjs`, Cache `v0-9`→`v0-10`; trägt kein 16 und kein 23-UI (eigenes Panel). 05b war in allen dreien schon Kanon, also keine 05b-Ausnahme. Herkunfts-Riegel: keine Handarbeit. Keine in HTML eingebetteten Kopien von 02/16/23. PRs Mein-Tresor #134 · Jasons-Tresor #186 · Company-Brain #24, gemergt; auf `main` nachgezählt (23 = `05a6eb42ec68`, `RDV_LABEL_MAX = 200`, 02 = `0cbf0664e2a7`, 16 = `7c12bc487d44`), danach Zweige gehoben.
- **Gemessen:** Mein-Tresor `npm test` 53 grün · Jasons-Tresor 59 grün · je `tests/smoke_b3_safe_secret.mjs` Rückgabewert 0. Company-Brain: `drift-guard` grün, sieben e2e-Läufe 0 rot (8 · 3 · 10 · 14 · 7 · 10 · 9); `e2e-ki-reinigung` nicht lauffähig (Workflow-PDF-Klon fehlt, nicht 23.R). Beide Tresore im Chromium geladen (keine eigene Browser-Probe): 23, 23-UI, 05b, Siegel, Spore, Box „Netz" da, keine Seiten- und Konsolenfehler. Gegenprobe von Hand (alte 23 zurück): Company-Brain `drift-guard` rot (rc=1); die Tresore haben keinen eigenen Wächter, der Verteiler meldet „hängt zurück". Glue: Tresore ohne `innerHTML`, Company-Brain fremder Name über `esc()`.
- **Benannt, nicht nachgezogen:** beide Tresore 01 (`web/tools/sbkim-storage.js`, 159 Zeilen), 03 (60), 04 (264), 05 (255). `web/tools/sbkim-spore.js` wird von keiner Seite geladen und wurde trotzdem mitgezogen (der Verteiler zählt es als Träger von 02).
- **Offen:** Paket A4. Tablet nicht gemessen.

## 2026-10-15 · Sammel-Brief Schritt 2, Paket A2: Bau 23.R in Kim-Bell, kim-hub-company, family-project; Kimhub ohne Träger (Hauptsitzung)

- **Getan:** `kanon-verteilen --schreiben --nur …` in zwei Läufen (je Träger ein Bump). Kim-Bell und family-project: 02, 16, 23, 23-UI (23 `9464fba75e5a` → `05a6eb42ec68`). kim-hub-company: dazu **05b**, weil 23 zusammen mit 05b weitergebaut wurde (#1074, #1080) und dort noch die Fassung vom 2026-06-27 lag; 23 sprang dort von `3caa0bb1fbe7` (zwei Generationen). Cache Kim-Bell v52→v53, kim-hub-company v76→v77, family-project v152→v153 samt `ASSET_V` und 96 `?v=`. Herkunfts-Riegel: keine Handarbeit. Keine in HTML eingebetteten Kopien von 02/16/23 in den vier Repos. PRs Kim-Bell #72 · kim-hub-company #75 · family-project #359, gemergt; auf `main` nachgezählt (sha = Kanon, `RDV_LABEL_MAX = 200`, Verteiler für 02/05b/16/23: 0 hängen zurück).
- **Kimhub:** trägt keine Modul-Dateien (die Werkstatt ist kein Knoten, die Dateien liegen in kim-hub-company). Alte shas stehen dort nur in Forschungsaufzeichnungen. Kein Code-PR, nur der Forschungseintrag.
- **Gemessen:** Kim-Bell `npm test` 4/4 · kim-hub-company `npm test` 72 grün, `sbkim-drift` 13/13, `drift` 27/27 · family-project alle 48 `tests/smoke_*.mjs` mit Rückgabewert 0 (zwei melden je einen Teil ungemessen: Nachbar-Klon PWA-Toolpoint fehlt). Kim-Bell und kim-hub-company im Chromium geladen: 23, 23-UI, 05b, Siegel, Box „Netz" da, keine Skriptfehler. Gegenprobe von Hand (alte 23 zurück): Kim-Bell `not ok 1 - Drift-Guard`, kim-hub-company `ABGEWICHEN … rc=1`, family-project (kein eigener Wächter) Verteiler „hängt zurück". Glue: fremder Text nur über `esc()`/`textContent`.
- **Benannt, nicht nachgezogen:** Kim-Bell 01 (133 Zeilen), 04 (264, Bau 04.J mit Prüfliste), 20 (14); kim-hub-company 03 (60, Modell-Wurzel). Eigene Generationen, nicht Teil von 23.R.
- **Offen:** Pakete A3–A4. Tablet nicht gemessen.

## 2026-10-15 · Sammel-Brief Schritt 2, Paket A1: Bau 23.R in PWA-Toolpoint, SB-KIMTool-Point, Kimseek (Hauptsitzung)

- **Getan:** `kanon-verteilen --schreiben` über die drei Repos: Modul 02, 16, 23, 23-UI byte-1:1 (23 sha `05a6eb42ec68`), Pins, Cache-Bump (PWA-Toolpoint v90→v91 samt 244 `?v=`, SB-KIMTool-Point v10→v11, Kimseek v62→v63). Alle drei trugen dieselbe ältere Fassung je Modul; keine Handarbeit gemeldet. SB-KIMTool-Point: `jasons-bibliothek/index.html` trägt 02 eingebettet und ist neu eingebettet (Probe verlangt es byte-genau). PRs #167 · #186 · #92, gemergt, auf `main` nachgezählt (sha = Kanon, `RDV_LABEL_MAX = 200`, Verteiler: 0 hängen zurück).
- **Gemessen:** PWA-Toolpoint `npm test` 2425/2425 · SB-KIMTool-Point 140 bestanden · Kimseek 12 bestanden. Gegenprobe von Hand je Repo (alte 23-Fassung zurück): Drift-Guard rot. Glue nachgesehen (Knotenkarte, Briefkasten, brain.html): fremder Text nur über `esc`/`textContent`.
- **Benannt, nicht geändert:** SB-KIMTool-Point `web/tools/mycelknoten.html` trägt 02/16 eingebettet, aber kein 23 — 16 dort nachzuziehen ließe das Siegel eine 23.R-Prüfung behaupten. `sbkim/SIGNAL.json` dort steht seit 2026-08-15 still, nicht angefasst.
- **Offen:** Pakete A2–A4. Tablet nicht gemessen.

## 2026-10-15 · Schutzschichten freigegeben (Hauptsitzung)

- **Klaus' Wort:** „Ja, S1 → S2 → S5 → S3 → S4 freigegeben“. Eingetragen in `docs/PLAN_MYCEL_SCHICHTEN.md` (Legende und Reihenfolge) und in der Fortschritts-Tabelle des Sammel-Briefs (Schritt 5: teilweise).
- **Grenze:** die Freigabe gilt dem Bau; offene `Entscheid`-Werte je Schicht (Schwelle S2, Kettenlänge S5 …) fragt die Bau-Sitzung vorher ab. S6/S7 nicht freigegeben.
- **Nächster Schritt:** unverändert Schritt 2 (Bau 23.R, Paket A1); danach Schritt 5 ohne erneute Freigabe-Frage.
