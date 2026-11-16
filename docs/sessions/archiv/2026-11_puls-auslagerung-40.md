# PULS-Auslagerung 2026-11-16 — neun Einträge vom 2026-10-15

**Ausgelagert am 2026-11-16**, weil `docs/PULS.md` mit dem Eintrag „Zwei Proben melden nicht lauffähig“ über der
3000-Zeilen-Grenze gestanden hätte (2993 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier stehen die Einträge **wortwörtlich**.

---

## 2026-10-15 · S5 Teil 2 gebaut und in 29 Träger ausgerollt (Hauptsitzung)
- **Startprüfung:** kein offener PR in Sage; erster offener Schritt im Sammel-Brief: 5 (S5 Teil 2). Während der Sitzung hat eine zweite Sitzung #1122 (Mein-Workfloh-Page nachgezogen) gemergt — anderes Thema, vor dem PR zusammengeführt; Mein-Workfloh-Page damit 29. Träger.
- **Gebaut (Sage #1123):** INTERFACES § Modul 23 S5 Teil 2 zuerst. `RDV_OPEN_MYCEL_ADMIN` (Sage-Protokol, nur im öffentlichen Netz) ersetzt `RDV_VOUCH_ANCHORS`; Netz-Einstellung mit optionalem `admin` (geprüft, reist im Netz-Link als `a`); `rankCardsByQuery` stellt Netzadmin, Kontakte, Verbürgte vor die übrigen (nur mit Frage-Vektor, „passt nicht“ bleibt am Ende); `vouchSafetyNumber` (wie B7, aus beiden `publicKey.x`), `vouchPassOn`, `currentNetAdmin`. 23-UI: je Karte „🤝 Bürgen“, Kasten „🤝 Bürgschaften“, Netzadmin-Feld; „🤝 Anker“ → „🤝 Netzadmin“. Siegel-Aspekt S5. Bündel-Kopien nachgezogen.
- **Gemessen:** `smoke_s5_buergen` 70 grün (Oberfläche im echten Chromium DE/EN, 360 px), Gegenprobe 31/31 gefangen, jede erste rote Zeile mit dem Namen ihrer Zusicherung (ein Fall traf zuerst den Nachbarn N4 statt N5, Sabotage geschärft). `run_alle` 123 grün · 0 rot · 2 nicht lauffähig. Erster Lauf der Sicherheitsnummer rot: `publicKey` ist ein JWK, kein Text — die Probe hat es gefunden.
- **Rollout:** `kanon-verteilen --nur 16_siegel,23_rendezvous --schreiben`, 84 Dateien in 29 Trägern, keine Handarbeit. Proben je Repo grün; von Hand nachgezogen: Kim-sync Cache-Pin, In-and-Out-Book Manifest `?v=` (PFLEGE § 18, vierter Treffer). PWA-Toolpoint `smoke_detail` einmal rot unter paralleler Last (144,7 von 180 s), beim Wiederholen 780 grün. Mehrere Proben brauchen Nachbar-Klone unter ihrem Großbuchstaben-Namen (`/home/user/Workflow-PDF`, `/home/user/Auslieferung-Pruefer`), sonst „nicht lauffähig“.
- **PRs:** Alis-Moderaum #76 · Auslieferung-Pruefer #57 · BookLedgerPro #338 · Company-Brain #28 · Jasons-Tresor #190 · Kim-Bell #76 · Kim-sync #23 · Kimboard #156 · Kimseek #96 · Kuechenzettel #12 · Mein-In-and-Out-Book #12 · Mein-Mixarium #253 · Mein-Rezeptbuch #442 · Mein-Tresor #138 · Mein-WorkFloh #271 · Mein-Workfloh-Page #39 · Muttis-Rezeptbuch #247 · PWA-Toolpoint #171 · Perfect-Skin-Beauty #76 · Perfect-Skin-Fashion #48 · Privat-Brain #109 · SB-KIMTool-Point #190 · Sende-Pruefer #84 · Tomys-Hub #250 · Workflow-Calculate #25 · Workflow-Needs #22 · Workflow-PDF #120 · family-project #363 · kim-hub-company #80. Auf `main` 29/29 23 `00f1f66eb6c8`, 23-UI 27/27 `af3385d97111`, 16 28/28 `5c8c2b89e86a`; Verteiler danach „84 schon gleich · 0 hängen zurück“. Zweige danach gehoben.
- **Nicht gemessen:** Tablet; zwei echte Geräte, die einander bürgen. Nach dem Merge am Gerät ⟳ / Hard-Reload. SIGNAL `seq` 93.
- **Offen:** S3; S4 nach Klaus' Entscheid (Sperrliste öffentlich oder nicht); Paper S nennt S5 noch „geplant“.

## 2026-10-15 · Mein-Workfloh-Page („Muster Werbetechnik") nachgezogen (Hauptsitzung, Nachtrag zu A4)

- **Klaus' Wort:** nachziehen. Damit gilt „NIE anfassen: *-Page" für dieses Repo nicht (Vorlage-PWA und arbeitender Knoten, Schublade `workflohpage`).
- **Getan:** `kanon-verteilen --nur 02_spore,05b_nostr_relay,16_siegel,23_rendezvous --schreiben`, ein Lauf, keine Handarbeit. Gleicher Stand wie die übrigen 28 Träger seit #1118 (S1, S2, S5 Teil 1): 02 `0cbf0664e2a7`, 05b `030aa2d26014` → `37eee5b196b3`, 16 `853e60807e14`, 23 `3caa0bb1fbe7` → `bc8cc295b449`, 23-UI `828855bbbc0e`. Cache `werbetechnik-page-v27` → `v28`. PR Mein-Workfloh-Page #38, gemergt, auf `main` nachgezählt (alle fünf = Kanon, `RDV_LABEL_MAX = 200`, `RDV_MEANING_MIN = 0.99`), Zweig danach gehoben.
- **Gemessen:** `npm test` rc 0 vorher wie nachher (13 byte-1:1 · 9 · 14 · 84 grün). Gegenprobe des Repos 18/18. Von Hand: alte 23 zurück → Drift-Guard rot (rc=1). `index.html` im Chromium bis zum Kettenende: 23, 23-UI, 05b, Siegel, Spore da, vorher wie nachher; `Unexpected token 'export'` (noble als klassisches Skript) auch auf `main`.
- **Benannt:** 03 und 04 hängen zurück. Tablet nicht gemessen; am Gerät ⟳ / Hard-Reload.

## 2026-10-15 · Sitzungsende S5-Sitzung: Übergabe und Forschungseintrag (Hauptsitzung)
- **Diese Sitzung insgesamt:** S5 Teil 1 (#1116), Leitlinie Netzadmin und Zuordnung Module 10–12 (#1119), Netzadmin = Sage-Protokol, verbürgte Karten nach vorne (#1120). Alle auf `main` nachgezählt. Übergabe: `docs/sessions/archiv/2026-10-15_s5_buergen_teil1.md` (Nachtrag am Ende). Forschungseintrag in Kimhub.
- **Weiter:** Sammel-Brief Schritt 5, S5 Teil 2.

## 2026-10-15 · S5: Netzadmin ist Sage-Protokol, verbürgte Karten nach vorne (Hauptsitzung)
- **Klaus' Wort:** Er bürgt mit **Sage-Protokol** (Kennung `BgjXhSApoOrJ…`, `sbkim/spore.json`); verbürgte Karten rücken in der Frage-Rangfolge nach vorne. Das Wort „Netzadmin“ bleibt (Vorschlag „Netz-Ad-Mini“ verworfen: weniger verständlich, nicht übersetzbar). Eingetragen in `docs/PLAN_MYCEL_SCHICHTEN.md` S5 und im Sammel-Brief.
- **Offen:** S5 Teil 2 bauen (Oberfläche, Umbenennung, Kennung nur im offenen Mycel, Rangfolge), dann Rollout.

## 2026-10-15 · Schichten: Leitlinie Netzadmin, Zuordnung zu den Modulen 10–12 (Hauptsitzung)
- **Klaus' Wort:** Wer ein Netz betreibt, ist dort der **Netzadmin** (das Wort ersetzt „Anker“ in Doku und Oberfläche; im Code bleibt `anchor`). Bürgen, Melden und Sperrliste unterschreibt in jedem eigenen Netz dessen Netzadmin. Eingetragen in `docs/PLAN_MYCEL_SCHICHTEN.md`.
- **Gelesen:** Karten 10, 11, 12, 14 sind Pläne ohne Code. Zuordnung im Plan: Melden/Quorum = Modul 10, Rate-Limit = Modul 11 (+ S3), S4 = Modul 12, Modul 14 bleibt liegen.
- **Offen:** Sperrliste öffentlich (S4) oder nicht (Karte 12) — Klaus' Entscheid vor S4. Oberfläche zeigt noch „🤝 Anker“, umbenannt mit S5 Teil 2.

## 2026-10-15 · S5 Bürgen, Teil 1: Format, Prüfung, Anzeige in Sage (Hauptsitzung)
- **Startprüfung:** kein offener PR in Sage; erster offener Schritt im Sammel-Brief: 5. S2-Rollout wartet auf die Messung am Gerät. Klaus fragte, wie er misst — Anleitung im Chat gegeben (Seite `tools/s2-wiederholung.html`, Knopf „Messen", kleinster Wert).
- **Klaus' Wort zu S5:** Kette 2 Schritte, Anker „Klaus + eigene Kontakte", Ablauf 1 Jahr. Eingetragen in `docs/PLAN_MYCEL_SCHICHTEN.md`.
- **Gebaut:** INTERFACES § Modul 23 S5 zuerst, dann Modul 23: Bürgschaft und Widerruf als signierte Zettel (Modul 02 `signDetached`), reisen in der Raum-Karte mit (`vouches`, `revocations`); `vouchTrust` (Kette ≤ 2, Ablauf ≤ 1 Jahr und nicht still gekürzt, Zeit nicht in der Zukunft, Widerruf, „der Bürge haftet"); `createVouch`, `createRevocation`, `addCarried`, eigene Kontakte im Speicher `sbkim_buergen_<dbSuffix>`. Zettel werden aus ALLEN Karten-Ereignissen eines Laufs gesammelt, damit eine nachgemachte neuere Karte keinen Widerruf verdrängt. Anzeige an der Karte DE/EN, ein Name nur aus den eigenen Kontakten. Bündel-Kopien nachgezogen. Reine Anzeige, die Rangfolge ist unverändert.
- **Gemessen:** `smoke_s5_buergen` 41 grün (echtes Modul 01/02, drei Zeilen im echten Chromium bei 360 px), Gegenprobe 14 von 14 gefangen. Ein fünfzehnter Fall rutschte durch und war ein toter Anker: eine zweite Prüfung „Aufgefallener nie verbürgt" änderte nichts, weil dessen Bürge schon haftet. Die Zeile ist entfernt. `smoke_netz_eigen` verglich `discover` byte-gleich: wie bei S2 ohne das neue Feld `vouch`, das Feld selbst wird verlangt. `run_alle` danach: 2 rot (`smoke_geraetename_netzweit`, `smoke_service_worker_parst`, beide auch auf `main` rot) · 2 nicht lauffähig. `tests/manual_check.html` ungeprüft (kein Browser-Sichttest dieser Sitzung; die Browser-Zeilen der Probe laden 23 + 23-UI).
- **Nicht gemessen:** Tablet. **Offen:** Klaus' Bürgen-Identität (der feste Anker ist leer), Vorrang in der Frage-Rangfolge (Entscheid), Teil 2 (Oberfläche zum Ausstellen), Siegel-Aspekt und Rollout mit Teil 2.
- **Parallel:** Während dieser Sitzung hat eine zweite Sitzung am selben Sammel-Brief S2 mit Klaus gemessen (#1115) und Paper S Fassung 1 geschrieben (#1114). Kein Überschneiden mit S5; beim Zusammenführen bemerkt (Diff gegen `main` hätte 832 Zeilen fremder Arbeit zurückgedreht), vor dem PR zusammengeführt.

## 2026-10-15 · S2 in alle 28 Träger ausgerollt (Hauptsitzung)
- **Klaus' Wort:** „Du kannst S2 in alle Repos tragen … die 26, wo es Not tut oder wo es angedacht war.“ Dazu BookLedgerPro und Kuechenzettel, die Modul 23 ebenfalls tragen: 28.
- **Getan:** `kanon-verteilen --nur 16_siegel,23_rendezvous --schreiben`: 81 Dateien, eine ältere Fassung je Modul (S1-Stand), keine Handarbeit. S5 Teil 1 (#1116, parallele Sitzung, gemergt, kein offener PR) kam mit, im PR-Text genannt. Je Repo ein PR, gemergt. Privat-Brain: eigenes Mycel-Fenster zeigt jetzt die Bedeutungs-Prüfung, Auswahl beim Nachfragen beachtet sie (Probe ergänzt, Gegenprobe von Hand gefangen).
- **Gemessen:** auf `main` 28/28 mit `RDV_MEANING_MIN = 0.99`, 27 mit dem Siegel-Aspekt (Company-Brain ohne Siegel); Verteiler danach „81 schon gleich · 0 hängen zurück“. Proben je Repo grün, außer: Workflow-Needs `browser.mjs` 3 rot und family-project `smoke_stufe2_sporen`, beide auf `main` ebenso rot (Vergleichsordner neben den Klonen). Nachgezogen: Kim-sync Cache-Pin, In-and-Out-Book Manifest `?v=` (PFLEGE-LISTE § 18, dritter Treffer). Gemeinsamer Paket-Ordner brauchte `playwright-core@1.56.1` und `pdf-lib` (§ 20).
- **PRs:** Alis-Moderaum #75 · Auslieferung-Pruefer #56 · BookLedgerPro #337 · Company-Brain #27 · Jasons-Tresor #189 · Kim-Bell #75 · Kim-sync #22 · Kimboard #155 · Kimseek #95 · Kuechenzettel #11 · Mein-In-and-Out-Book #11 · Mein-Mixarium #252 · Mein-Rezeptbuch #441 · Mein-Tresor #137 · Mein-WorkFloh #270 · Muttis-Rezeptbuch #246 · PWA-Toolpoint #170 · Perfect-Skin-Beauty #75 · Perfect-Skin-Fashion #47 · Privat-Brain #108 · SB-KIMTool-Point #189 · Sende-Pruefer #83 · Tomys-Hub #249 · Workflow-Calculate #24 · Workflow-Needs #21 · Workflow-PDF #119 · family-project #362 · kim-hub-company #79.
- **Eingereiht:** PFLEGE-LISTE § 19 (eigene Mycel-Fenster), § 20 (Paket-Ordner), § 21 (Klaus' Idee BookLedgerPro im Firmennetz). SIGNAL `seq` 92.
- **Nicht gemessen:** Tablet nach dem Update (⟳ / Hard-Reload nötig).

## 2026-10-15 · S2 am Gerät gemessen: Schwelle 0,99 hält (Hauptsitzung)
- **Gemessen (Klaus, `tools/s2-wiederholung.html`, Chrome 154 am Tablet im DeX-Modus (Klaus' Auskunft; UA „X11; Linux x86_64“)):** Haupt-Vektor aus der Beschreibung bei 9 Sporen auf **1,0000** nachgerechnet. Satz-Schnipsel einzeln nachgerechnet **0,9949–0,9972** (40 aus 8 Sporen). SB-KIMTool-Point 0,8879 und BookLedgerPro 0,9020 passen nicht zur Beschreibung, beide ohne `embeddingSource` → S2 zeigt „nicht nachprüfbar“.
- **Gelesen daraus:** Wiederholgenauigkeit = Haupt-Vektor (exakt). Die Schnipsel-Abweichung kommt vermutlich vom Stapel beim Signieren (nicht gemessen); alle liegen über 0,99. Die Fazit-Zeile der Mess-Seite prüfte die Schnipsel gegen 0,995 und meldete deshalb fälschlich „zu prüfen“; jetzt: Haupt-Vektor exakt und Schnipsel ≥ 0,99.
- **Nächster Schritt:** S2 in alle Träger (`kanon-verteilen --nur 16_siegel,23_rendezvous`, dazu 23-UI).

## 2026-10-15 · Paper S: Fassung 1 (Entwurf) geschrieben (Hauptsitzung)
- **Getan:** `docs/papers/sicherer-umgang-im-knotennetz.md`, 14 Abschnitte nach der abgestimmten Gliederung; „Browser und Knotennetz“ als Abschnitt 11, damit die abgestimmten Nummern bleiben. Klaus' Lesart in 6.4 als seine gekennzeichnet. Die veröffentlichten Papers sind nicht geändert.
- **Quellen:** in derselben Sitzung nachgesehen, nicht aus dem Gedächtnis. Gelesen: Douceur, NIP-01/13, PGP-Handbuch 1994, OWASP Top 10 2025 und LLM 2026, Hashcash (Spiegel), GitHub-Diskussion #54257. Nur über Auszüge (der Abruf der meisten Verlags- und Blog-Seiten war im Container gesperrt): Biologie, Google-Blogs, W3C/WHATWG, Greshake, SybilGuard, SSB. Jeder Eintrag trägt seinen Prüfstand. Vier biologische Zuordnungen wurden korrigiert (mutS/RecA bei Bakterien, Schlüssel-Schloss nicht absolut, Handicap umstritten, virale Nachahmung). Ein Satz ohne Quelle (Web of Trust „gescheitert“) wurde gestrichen.
- **Nicht gemessen:** die drei Fallbeispiel-Seiten (11.4).
- **Offen:** Klaus' Gegenlesen; HTML erst danach mit DOI; englische Fassung.
