# PULS-Auslagerung 2026-10-16 — zwei Einträge vom 2026-10-13

**Ausgelagert am 2026-10-16**, weil `docs/PULS.md` mit dem Eintrag „Überblick Mycel und
Siegel“ über der 3000-Zeilen-Grenze gestanden hätte (2979 vorher). Die Schutz-Klausel im Kopf
von PULS.md verlangt **auslagern statt kürzen**: hier stehen die Einträge **wortwörtlich**.

---

## 2026-10-13 · Modul 03 netzweit verteilt, Weg A (die App setzt die Adresse)

**Klaus' Wahl:** Weg A — jede App setzt `window.SBKIM_MODEL_ROOT = "https://family-projekt.de/models/"` selbst, Modul 03 in Sage bleibt neutral. Verteilt mit `tools/kanon-verteilen.mjs --nur 03_embedding --schreiben` (sha a6ac64d7536d…), Pins und Cache je Träger.

**Gemergt:** Workflow-PDF #105 · Auslieferung-Pruefer #47 · BookLedgerPro #325 · Kim-Bell #68 · Kimseek #87 · Mein-WorkFloh #260 · Sende-Pruefer #74 · SB-KIMTool-Point #179 · PWA-Toolpoint #162 · Company-Brain #20 · Privat-Brain #98 · family-project #352 · Mein-Mixarium #242 · Tomys-Hub #239 · Mein-Rezeptbuch #430 · Muttis-Rezeptbuch #235 · Kimboard #146. Hier: Startseite, Such-Tool, Pinnwand setzen die Adresse; Impressum (DE/EN) und Such-Tool-Impressum nennen Programm (jsDelivr), Modell (family-projekt.de) und den Rückfall Hugging Face. Such-Tool-Cache v6, Pinnwand-Cache v25.

**Benannt, nicht angefasst:** Sende-Prüfer setzt die Adresse in `assets/sbkim-init.js` (die vier Dateien stehen an der 96-KB-Grenze) · SB-KIMTool-Point `web/tools/mycelknoten.html` und Sages `docs/observatorium/tools/mycelknoten.html` bleiben unverändert (gepinnte Spiegelkopie bzw. alte Inline-Fassung) · BookLedgerPro `src/sbkim/embed.js` ist eigener Code, nicht Modul 03.

**Vorbestehend rot, nicht von hier:** Sende-Prüfer „23_rendezvous_ui byte-gleich mit Sage" (Sage hat 23-UI am 2026-10-11 geändert, #1067 — Kanon-Verteilung offen) · PWA-Toolpoint `detailseiten --pruefen` + Zeitzone (frischere Messwerte im Nachbar-Klon, auf `main` ebenso rot) · SB-KIMTool-Point Probe 27 (Netz-Link, auf `main` ebenso rot).

**Geprüft hier:** `node tests/run_alle.mjs` **111 grün · 0 rot · 1 nicht lauffähig** (vorrat_wirkung, Nachbar-Klone fehlen). ⚠ Das echte Modell ist im Behälter nicht gelaufen; am Tablet nicht gemessen.


## 2026-10-13 · Modul 03: Modell vom eigenen Server auch für Apps auf fremder Adresse

**Anlass (Klaus, aus einer Workflow-Calculate-Sitzung):** *„wir sind nicht angewiesen darauf, das von Hugging Face runterzuladen … auf dem Server ist das Embedding-Modell auch drauf."*

**Gemessen (Klaus in Termux, 2026-10-13):** `https://family-projekt.de/models/Xenova/multilingual-e5-small/config.json` → `200`, `application/json` · `onnx/model_quantized.onnx` → `200`, **118 308 185 Bytes** · `access-control-allow-origin: *`. Das Modell liegt auf dem Hetzner-Server; im Repo family-project steht auf `main` nur `PLATZHALTER.md`.

**Gebaut:** `src/modules/03_embedding.js` liest spät `window.SBKIM_MODEL_ROOT` (nur `https://` oder Pfad ab `/`) und probt dort zuerst, dann wie bisher `/models/` der eigenen Adresse, dann HuggingFace. Neu `getModelRoot()`, `_meta.modelRootSetting`, Test-Brücken `_configuredModelRoot`/`_modelRoot`. Ohne Einstellung byte-gleiches Verhalten. Kopien pinnwand · sbkim-bundle · sbkim-bundle-voll · such-tool byte-1:1, Pinnwand-Cache v24. Tafel INTERFACES § Modul 03 und Karte 03 nachgezogen.

**Geprüft:** `smoke_a6_offline_model_source` **21/21** (vorher 11). Gegenprobe von Hand, Wegwerf-Kopie: **9 Sabotagen, 9 gefangen** — zwei erst nach Schärfen (die Wurzel stand vor dem Fehlschlag-Fall schon auf `/models/`; Art- und Inhalts-Prüfung decken einander und werden zusammen weggenommen). Regressionsfrei: standalone_such_tool, bundle_connect, a3, bau03_snippets, bau03_worker, inhaltstreuer_domainvektor, bauvorlagen, pinnwand/_smoke 74/74.

**Offen:** netzweiter Rollout (bisher nur Workflow Calculate) · transformers.js kommt weiter von jsDelivr · im Browser am Tablet nicht gemessen. Die „~30 MB" in Texten der Apps sind falsch (gemessen 118 MB).
