# PULS-Auslagerung 2026-11-16 — sieben Einträge vom 2026-10-15

**Ausgelagert am 2026-11-16**, weil `docs/PULS.md` mit dem nächsten Eintrag über der
3000-Zeilen-Grenze gestanden hätte (2993 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier stehen die Einträge **wortwörtlich**.

---

## 2026-10-15 · Sammel-Brief Schritt 7: Workflow-PDF-Probe hängt nicht mehr; Sitzungsende (Hauptsitzung)
- **Ursache gemessen:** Im hängenden Tab blieb `vendor/qrcode.js` liegen, weil `tab.route` erst am schon ladenden Tab einsetzte. Ein Fehler der Probe, nicht der App. Workflow-PDF #118: `ctx.route` vor dem Klick. Vorher 3/17 rot, danach 0/40; `npm test` 0. Auf `main` nachgezählt. PFLEGE-LISTE § 14 erledigt.
- **Diese Sitzung insgesamt:** S2-Entscheid (#1109), S2 gebaut (#1110), Küchenzettel im Mycel (#1111), Workflow-PDF #118. Übergabe: `docs/sessions/archiv/2026-10-15_s2_kuechenzettel_wpdf.md`.
- **Offen:** S2 am Gerät messen (`tools/s2-wiederholung.html`), dann S2-Rollout in alle Träger; Paper-S-Gliederung (Klaus); S5, S3, S4.

## 2026-10-15 · Küchenzettel im Mycel eingetragen (verified-match 0.897519) (Hauptsitzung)
- **Getan:** Klaus' Spore (am Gerät im Andock-Wizard erzeugt, 17:38:06Z) byte-gleich als `sbkim/kuechenzettel_inbox.json`; Prüf-Vermerk `sbkim/kuechenzettel_inbox.verify.md`; Zeile in `sbkim/NETZ-STAND.md`; Eintrag in `status.json`. Die Spore kam in `tools/s2-wiederholung.html` dazu.
- **Gemessen:** VALID (Modul-02-Pfad), id = SHA256(Pubkey) unabhängig nachgerechnet, Manipulationsprobe fällt durch, kein `d` im JWK, L2 = 1, 9 Schnipsel, `embeddingSource: "description"`. Sage-Cosinus **0.897519** (Depot-Maßstab) → `verified-match`. Keine personenbezogenen Daten in Beschreibung und Stichworten. Die Schnipsel enthalten die Stichworte, die Spore stammt also aus der Erst-Signatur („Beschreibung. Stichworte“), der zweiten Fassung, die S2 nachrechnet.
- **Nicht gemessen:** Raum-Beitritt, S2 mit dem echten Modell, Spore im App-Depot.

## 2026-10-15 · S2: Entscheid (Schwelle 0,99, Inhalts-Vektor „nicht nachprüfbar“) und Bau in Sage (Hauptsitzung)
- **Klaus' Wort:** Schwelle **0,99**; `embeddingSource: "content"` → Weg A (sichtbar, kein Abzug, kein „geprüft“, Schnipsel trotzdem nachrechnen). Eingetragen in `docs/PLAN_MYCEL_SCHICHTEN.md` S2 und im Sammel-Brief Schritt 5.
- **Gemessen:** 55 Paare der gespeicherten Vektoren in `sbkim/`: 0,780–0,983 (engstes Paar Jasons-Tresor ⟷ Mein-Tresor 0,983).
- **Nicht gemessen:** Wiederholgenauigkeit des Modells über Geräte (HuggingFace und family-projekt.de im Container gesperrt).
- **Fund:** Andock-Wizard bettet Erst-Signatur „Beschreibung. Stichworte“, Neu-Signieren nur die Beschreibung — der Empfänger muss beide nachrechnen.
- **Gebaut (gleiche Sitzung):** INTERFACES § Modul 23 S2 zuerst, dann Modul 23 `checkMeaning` (drei Text-Fassungen, dazu „Beschreibung Stichworte“ aus `tools/embed_helper.html`; nur mit geladenem Modell, sonst „nicht-geprueft“), `meaning` je Raum-Karte, „passt-nicht“ ohne Verwandtschafts- und Rang-Vorrang, bleibt sichtbar; Satz-Schnipsel gegen ihren eigenen Text (gekürzte „…“ übersprungen). Anzeige an der Karte DE/EN (fester Text). Siegel-Aspekt DE/EN. Bündel-Kopien nachgezogen.
- **Gemessen:** `smoke_s2_bedeutung` 27 grün (Modell als Attrappe; B1–B3 im echten Chromium, 360 px, fremder Name mit `<img onerror>` nur als Text), Gegenprobe 14/14 beim ersten Lauf. `run_alle` 120 grün · 2 rot (`smoke_geraetename_netzweit`, `smoke_service_worker_parst`, beide auch auf `main`) · 2 nicht lauffähig. `smoke_netz_eigen` verglich `discover` byte-gleich mit einer alten Fassung: wie bei `bestaetigt` (Bau 23.R) jetzt ohne das neue Feld `meaning`, das Feld selbst wird verlangt.
- **Werkzeug:** `tools/s2-wiederholung.html` misst am Gerät die Wiederholgenauigkeit an 33 Satz-Schnipseln aus 8 Depot-Sporen; lädt das Modell erst auf Knopfdruck. Im Chromium geladen: 320/412/1280 px ohne Überlauf, beim Laden kein Abruf außer Haus.
- **Nicht gemessen:** das echte Modell (Container gesperrt); Tablet. **Offen:** Messung am Gerät, Rollout in alle Träger.

## 2026-10-15 · Sammel-Brief Schritt 4, 4b, 5 (S1): Fragen unterschreiben netzweit, zwei Knoten angedockt (Hauptsitzung)
- **Schritt 4 (Klaus):** andocken Kuechenzettel und die Demo; nicht papas-aktenschrank, Kochfreunde. Für die Demo die öffentliche `sbkim-demo/` in Sage statt des privaten Repos semantic-match-demo.
- **S1 gebaut:** Sage #1106. INTERFACES Frage-Zettel v2 (spore + sig), Modul 23 prüft Fragen: bestätigt → 6/min, unbestätigt → höchstens 2 der 6 (Klaus' Wert), falsch → nicht beantwortet, sperrt die qid nicht. Siegel-Aspekt DE/EN. `smoke_s1_fragen_signiert` 13 grün, Gegenprobe 7/7.
- **S1 verteilt:** `kanon-verteilen --nur 16_siegel,23_rendezvous`, 26 Träger, 51 Dateien, je Repo eigene Proben, PR, Merge; auf `main` 26/26 nachgezählt, dann Zweige gehoben. Nebenfunde: Kim-sync-Probe nagelte `kimsync-v16`; In-and-Out-Book-Manifest `?v=` zog der Verteiler nicht mit.
- **Angedockt:** Kuechenzettel #10 (13 Module, feste Leiste, `kuechenzettel-v3`; Kopfleiste ragte auf `main` schon bei 360 px 33 px hinaus, jetzt passt sie bei 320/360/412). `sbkim-demo/` lädt den Kanon direkt aus `src/modules/`, Schublade `sbkimdemo`. Proben 54 bzw. 49 grün, Gegenproben 10/10 und 9/9.
- **Register:** `kuechenzettel`, `sbkimdemo`; kim-hub-company #78 (Kopie der Liste, dazu `inoutbook`, `kimsync`).
- **Paper S:** Klaus' Wünsche im Plan (Quellen mit „übernommen · vorgeschlagen · warum", drei Internetseiten ohne Alis, Browser und Knotennetz, Gegenlesen im Chat).
- **Wackel-Proben, nicht durch S1:** family-project `smoke_kein_sprung` (Zweig 42/42, `main` im selben Moment 41/42), Workflow-PDF `chrome.mjs` (Pflege-Liste #14; danach Zweig und `main` je 47/47).
- **Nicht gemessen:** Tablet; erste Sporen von Kuechenzettel und Demo.
- **Nachtrag BookLedgerPro:** fiel aus beiden Rollouts des Tages heraus (Vorgabe-Zweig auf GitHub ist nicht `main`, der Verteiler folgt `origin/HEAD`; PFLEGE-LISTE § 17). Modul 03, 16, 23 nachgeholt in BookLedgerPro #336, `tests/run.mjs` 2284 bestanden. Kimhub-Forschungseintrag #385.

## 2026-10-15 · Modul 03: Rückfall auf HuggingFace gebaut und netzweit verteilt (Hauptsitzung)
- **Anlass:** „Can't create a session“ in In-and-Out-Book, Kim-sync, Kimboard (Server-Modell); Alis (HuggingFace) ging. Server-Datei sha256 = HuggingFace; Inkognito lud; nach `caches.delete('transformers-cache')` lud es auch normal (PFLEGE-LISTE § 15).
- **Gebaut:** Sage #1103 — Rückfall in Modul 03 mit Leeren der Cache-Einträge der Wurzel und Rücksetzen von `env.localModelPath` (Haupt-Faden und Worker); `getModelFallback()`; INTERFACES §03 additiv. Probe `smoke_bau03_rueckfall` 33 grün, Gegenprobe 9/9 (erst 1 blind). Kopien in pinnwand/sbkim-bundle(-voll)/such-tool nachgezogen.
- **Verteilt:** `kanon-verteilen --nur 03_embedding --schreiben`: 26 Repos, 29 Kopien, zwei ältere Fassungen (`a6ac64d7536d` 21×, `e4bb8bd6a237` 8×). Je Repo eigene Proben, PR, Merge; alle 26 gemergt; auf `main` **29 von 29** Kopien byte-gleich mit dem Kanon `2e31baa09a29`, danach Zweige gehoben.
- **Unterwegs:** In-and-Out-Book neues Logo (Klaus) — Favicon-Ring mindestens 3 px, weil der helle Logo-Rand ihn bei 2 px einfärbte (Wächter war rot, Probe unverändert); Manifest und Gegenprobe-Anker auf `?v=9`. Kim-sync: Probe nagelte `kimsync-v15`. PWA-Toolpoint: eine Zeile in `smoke_detail` rot bei 151/180 s, einzeln auf Zweig und `main` je 780/0 — Ausreißer. Sage `smoke_service_worker_parst` rot, auf `main` ebenso.
- **Nicht gemessen:** Tablet; der Rückfall selbst im echten Browser.
- **Eingereiht:** PFLEGE-LISTE § 16 („~30 MB“ im Andock-Wizard, gemessen 118 MB).
- **Kim-sync bleibt privat** (Klaus): nicht im Mycel eintragen.

## 2026-10-15 · Mein In-and-Out-Book im Mycel eingetragen (Hauptsitzung)
- **Getan:** Klaus' Spore (am Tablet im Andock-Wizard erzeugt, 14:15:19Z) byte-gleich als `sbkim/inoutbook_inbox.json` abgelegt; Prüf-Vermerk `sbkim/inoutbook_inbox.verify.md`; Zeile in `sbkim/NETZ-STAND.md`; Eintrag in `status.json` (`endknoten`, 23. Eintrag).
- **Gemessen:** VALID (Modul-02-Pfad), id = SHA256(Pubkey), Manipulationsprobe fällt durch, kein `d` im JWK, L2 = 1, 11 Schnipsel. Sage-Cosinus **0.917311** (Depot-Maßstab) → `verified-match`.
- **Nicht gemessen:** Raum-Beitritt (`established`), Raum-Maßstab. Im App-Depot liegt keine `sbkim/spore.json` (`sporeUrl` leer).
- **Offen:** Kim-sync eintragen, sobald Klaus seine Spore schickt (Klaus: „erst einmal" nur das In-and-Out-Book).

## 2026-10-15 · Sammel-Brief Schritt 3: Mein-In-and-Out-Book und Kim-sync als SBKIM-Knoten angedockt (Hauptsitzung)

- **Getan:** zwei neue Knoten, Bauart Sende-Prüfer/Workflow-Needs (feste Leiste in der Kopfzeile, **kein Modul 17**): Mein-In-and-Out-Book #8 (Schublade `inoutbook`, Cache `inout-v8`, alle `?v=8`) und Kim-sync #19 (Schublade `kimsync`, Cache `kimsync-v15`). Je 13 Pflicht-Module byte-1:1 aus dem Kanon (23 `05a6eb42ec68`, 05b `37eee5b196b3`), in der App-Probe gepinnt; `window.SBKIM_DB_SUFFIX` im `<head>`; 05b als eigene `<script type="module">`-Zeile, nicht in der Nachlade-Kette; Identität `assets/siegel-inhalt.js` (Beschreibung ohne Post-Inhalt bzw. ohne Raum-Code); `sicherheit.html` daneben; alles im Vorrat. Kim-sync: noble ist die vorhandene Datei aus Kimboard (sha gleich Kanon), kein zweites Exemplar; `assets/pruefer-mail.js` byte-1:1 dazu. Register `sbkim/DB-SUFFIXE.md` um `inoutbook`, `kimsync` und das fehlende `workflowneeds` ergänzt.
- **Gemessen:** In-and-Out-Book `npm test` 158 → **231 grün · 0 ROT**; Kim-sync 249 → **336 grün · 0 ROT** (alle 249 alten Zeilen unverändert). Im Chromium je 4 Breiten: Kette bis zum Ende, alle Pflicht-Module da, Siegel stellt sich aus, Andock-Wizard öffnet, keine Seitenfehler, Kopfleiste ohne Überlauf, **keine WebSocket-Erzeugung und kein Abruf außer Haus beim Laden**. Gegenprobe: In-and-Out `KNOTEN:` 14/14 gefangen (6 nachgezogene Altfälle 6/6), Kim-sync neue `tests/gegenprobe-knoten.sh` 17/17. Erst 3 bzw. 1 Fall blind (Text-Wächter, WebSocket nur übers Netz-Ereignis gezählt, zweimal ein toter CSS-Eingriff) — geschärft. Verteiler `--nachbarn` ohne `--schreiben`: beide Träger gefunden, Knoten-Module gleich Kanon. Sage `run_alle` 117 grün · 1 rot (`smoke_service_worker_parst`, auch auf `main`) · 2 nicht lauffähig. Auf `main` nachgezählt, danach Zweige gehoben.
- **Benannt, nicht angefasst:** Datei-Post (kein Ja von Klaus). In-and-Out-Book `modules/25_pseudonym.js` hängt dem Kanon 86 Zeilen nach. Kim-sync: im frischen Gerät liegt das Willkommen-Fenster modal über der Leiste; bei 320 px bleibt dem Titel 0 px (main 18 px); Siegel/Verbinden-Fenster bleiben auf Russisch Deutsch. Register: Sende-Prüfer, Workflow-Calculate, Workflow-PDF fehlen dort, nicht gemessen.
- **Offen:** erste Spore je App am Gerät (Klaus, Siegel → Andock-Wizard), danach ⟳. Tablet nicht gemessen. Weiter mit Schritt 4.

## 2026-10-15 · Sammel-Brief Schritt 2, Paket A4: Bau 23.R in Alis-Moderaum, Perfect-Skin-Fashion, Perfect-Skin-Beauty — Schritt 2 erledigt (Hauptsitzung)

- **Getan:** `kanon-verteilen --schreiben --nur 02_spore,05b_nostr_relay,16_siegel,23_rendezvous` in einem Lauf. In allen drei: 02 `6789fe6e903a`, 16 `d84fa539e76e`, 23 `3caa0bb1fbe7` (549 Zeilen, Generationen-Sprung), 23-UI `fc47f16b24d5` → Kanon. 05b lag auf der Juni-Fassung `030aa2d26014` → mitgenommen (`37eee5b196b3`). Pins in `tools/drift-guard.mjs` nachgezogen; Alis-Moderaum Cache v24→v25, die beiden Perfect-Skin-Seiten haben keinen Service-Worker. Herkunfts-Riegel: keine Handarbeit. Keine in HTML eingebetteten Kopien. PRs Alis-Moderaum #72 · Perfect-Skin-Fashion #44 · Perfect-Skin-Beauty #72, gemergt; auf `main` nachgezählt (02 `0cbf0664e2a7`, 05b `37eee5b196b3`, 16 `7c12bc487d44`, 23 `05a6eb42ec68` mit `RDV_LABEL_MAX = 200`, 23-UI `efecd89ea80d`), danach Zweige gehoben.
- **Gemessen:** `npm test` je Rückgabewert 0 — Alis-Moderaum 55/55 (vorher 55/55), Perfect-Skin-Fashion 66 grün (vorher 66), Perfect-Skin-Beauty 18 + 25 (vorher 18 + 25). `npm run gegenprobe` 18/18 · 17/17 · 19/19 bemerkt. Gegenprobe von Hand (alte 23 zurück): je Drift-Guard `ABGEWICHEN: modules/23_rendezvous.js`, rc=1; danach wiederhergestellt. `index.html` je im Chromium bis zum Ende der Nachlade-Kette: Rendezvous, UI, Relais, Siegel, Spore da. Glue `assets/*.js` ohne `innerHTML` für fremden Text.
- **Benannt, nicht angefasst:** alle drei `index.html` werfen `Unexpected token 'export'` — die Nachlade-Kette lädt `modules/noble-secp256k1.js` (ES-Modul) als klassisches Skript; **auch auf `main`** so, 05b importiert noble selbst. 03 und 04 hängen weiter zurück (60 / 109 Zeilen).
- **Knoten „Muster Werbetechnik":** über den Mitschnitt `mycel-karte/mitschnitt/mycel-lauf-2026-09-10.json` (Spore `Gq_Mt8o_…`, Endpunkt `…github.io/Mein-Workfloh-Page/`) und die Spore im Repo (`sbkim/spore.json`, gleiche `id`) belegt: **Mein-Workfloh-Page**. Trägt dieselben alten Fassungen (23 `3caa0bb1fbe7`, 05b Juni). Nur gelesen — der Name fällt unter „NIE anfassen: *-Page", das Repo ist aber ein arbeitender Knoten mit eigener Schublade (`workflohpage`). Entscheid bei Klaus.
- **`docs/observatorium/tools/mycelknoten.html`:** bettet 01–05, 07, 15, 16, 17 ein, **kein 23**. 02 weicht 198 Zeilen, 16 581 Zeilen vom Kanon ab. Nach der Regel (Siegel-Ehrlichkeit) nicht nachgezogen. `innerHTML`-Stellen: fremde Werte über `textContent`/`escapeAttr`, sonst fester Text.
- **Offen:** Mein-Workfloh-Page (Klaus). Tablet nicht gemessen. Weiter mit Schritt 3.
