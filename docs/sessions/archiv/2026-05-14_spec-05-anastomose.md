# Übergabeprotokoll · 2026-05-14 · Spec-Sitzung Modul 05 Anastomose

**Sitzungs-Rolle:** Spec-Sitzung (eine Sitzung, eine Phase). **Kein**
JS-Code unter `src/`. Die Bau-Phase B kommt in einer separaten Sitzung
mit eigenem Briefing.
**Branch:** `claude/spec-05-anastomose-XfUyX`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und
am Übergabeprotokoll der Spec+Bau-Sitzung 02 vom 2026-05-14
(Karte 02 + Karte 04 als Stil-Referenz).
**Modul:** 05_anastomose

---

## Auftrag

Drei Aufgabenstränge in einer Phase:

1. **Komponenten-Karte 05 vollständig füllen** — die alte Schablone
   mit veralteter Schwelle `0.55` und gestrichener Match-API
   (`matchAgainstDomain` / `computeDomainVector`) ersetzen.
   Pflichtblöcke: Hero · Im Mycel-Bild · Visualisierung · Zweck ·
   Verantwortlichkeiten (Macht / Macht nicht) · Schnittstelle ·
   Selbstcheck · Konfigurationswerte · Anastomose-Pfad · Service-
   Worker-Hinweis · Fehlertabelle · Manueller Test · Risiken ·
   Bauzustand · Querverweise · plus A1–B3-Synthese (Hop B3/A3) ·
   Reentry-Verhalten · TTL-Verweis auf Modul 07.
2. **INTERFACES.md §1 Modul 05 auf Status `entwurf`** mit voller
   Vertrag-Sektion und **§2 „Anfrage (Query)" verbindlich
   ausfüllen** (HandshakeRequest + HandshakeResponse). §6
   Änderungsprotokoll fortschreiben.
3. **Sitzungs-Abschluss:** PULS-Eintrag (Spec-Sitzung Modul 05),
   Übergabeprotokoll (diese Datei), WEGWEISER-Stand-Block-Zeile,
   `status.json` Modul 05 von `schablone` auf `spec` (Pie
   regenerieren — Schablone 8 → 7, Spec fertig 0 → 1), Branch
   pushen, Draft-PR gegen main, danach merge.

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Match-Schwelle aus Pflege-Sitzung 2026-05-14:**
  `PROVIDER_MIN_MATCH = 0.80`. Modul 05 ruft
  `SbkimMatch.isAboveProviderThreshold` — niemals literal `0.80`.
- **Spore-Verifikation:** vor jeder Anastomose ruft 05
  `SbkimSpore.verifyForeignSpore` auf, bricht bei `{valid:false}` ab.
- **Persistenz strikt über `SbkimStorage`:** `sbkim_siblings` und
  `sbkim_anastomosis_log`.
- **Selbstcheck synchron beim Skript-Laden:**
  `console.info("MODUL 05 ANASTOMOSE bereit, Funktionen: …")`.
- **Identität:** `SbkimSpore.getNodeId()` aus Modul 02. Kein zweites
  Identitäts-Schema.
- **A1–B3-Synthese aus Karte 04:** Modul 05 sitzt an Hop B3/A3.

---

## Was getan wurde

### 1. Komponenten-Karte 05 vollständig gefüllt

Die alte Schablone (1 Mermaid-Block mit Match-Schwelle `0.55`,
API-Skizze mit `query(...) / onIncomingQuery / formatResponse /
initiateAnastomosis`) wurde durchgängig ersetzt. Karte 05 ist jetzt
564 Zeilen — länger als 02 (364) und 04 (357), weil Anastomose die
erste *Komposition* aus vier Modulen ist und einen vollen Schritt-für-
Schritt-Pfad braucht. Pflichtblöcke alle vorhanden:

- **Hero** mit Status-Badge 🟨 Spec fertig, Schicht „Netzwerk",
  Sage-Page-Anker.
- **Im Mycel-Bild** — Hyphenfusion als biologische Metapher.
  Bidirektionalität als Spec-Wille (einseitige Anziehung ist im
  Pilz-Modell keine Fusion).
- **Visualisierung** — Mermaid-Sequenz-Diagramm mit fünf Teilnehmern
  (A, B, SbkimSpore, SbkimMatch, SbkimStorage), `alt/else` für drei
  Outcomes (established / score zu niedrig / Spore ungültig), Schwelle
  `0.80` aus §0.
- **Zweck** — vier Module in einem Schritt, expliziter Auslöser
  (kein Auto-Handshake, keine Pulsation).
- **Verantwortlichkeiten** — „Macht" mit acht Punkten, „Macht nicht"
  mit acht Punkten. Explizit gestrichen: eigenes Match, eigenes
  Spore-Verify, direkter IndexedDB-Zugriff, eigenes Embedding,
  Crawler/Discovery, Pulsation, Auto-Vergessen, Anfrage-Inhalte
  (gehören Modul 06).
- **Schnittstelle** — Fünf-Funktionen-API mit ausführlicher
  Schritt-Dokumentation pro Funktion (`init / handshake /
  receiveHandshake / listSiblings / forgetSibling`).
- **Selbstcheck** — synchroner `console.info(...)` beim Skript-Laden,
  Schwelle/Endpunkt/Version bewusst nicht in der Selbstcheck-Zeile
  wiederholt.
- **Konfigurationswerte** — `PROTOCOL_VERSION`, `PROVIDER_MIN_MATCH`
  (via Modul 04), `QUERY_TIMEOUT_MS`, `ENDPOINT.anastomosis`. Alle
  aus §0 / §3, kein Hartcode.
- **Datenformate** — HandshakeRequest, HandshakeResponse,
  `sbkim_siblings`-Wert, `sbkim_anastomosis_log`-Wert.
- **A1–B3-Synthese** — Modul 05 sitzt an Hop B3/A3 als
  Entscheidungs- und Verbindungs-Stelle (Karte 04 hatte vorbereitet:
  Hops tragen die Funktionen).
- **Anastomose-Pfad** in 14 Schritten (Sender 1–6, Empfänger 7–11,
  Sender 12–14). Reentry-Idempotenz ans Ende.
- **Service-Worker-Hinweis** — Pfad-Vertrag (POST `/sbkim/anastomosis`,
  JSON, ≤ 64 KiB, 405/415/413/503), Variante A (Page-Hosted via
  MessageChannel) vs. Variante B (SW-Hosted) als offene Wahl der
  Bau-Sitzung 05.
- **Fehlertabelle** — neun Lagen mit Reaktion. Klare Trennung
  zwischen *Outcome* (semantische Ablehnung) und *Throw* (Protokoll/
  Netz/Krypto).
- **Manueller Test** — Skizze für späteres Panel 05 mit acht
  Test-Punkten (lokaler Zwei-Knoten-Test ohne Netz, Domain-Mismatch,
  Versions-Mismatch, Signatur-Manipulation, Re-Handshake,
  `forgetSibling`, `listSiblings`, Selbstcheck).
- **Risiken** — sechs Punkte: CORS, Replay-Schutz (Modul 11),
  Timing-Side-Channel, Score-Stabilität, TTL ist Modul 07,
  Frischer-Kopf-Korrekturen, `domainVector`-Optional-Stellung als
  schwache Stelle (Aufhänger für Modul 09).
- **Bauzustand-Tabelle** — Spec gefüllt 2026-05-14, Code/Sichttest/
  Einbau noch leer.
- **Querverweise** — Abhängigkeiten 01/02/04 (03 indirekt),
  nutzt-von 06/07/08/09/11, drei Site-Karten-Anker, vier Glossar-
  Anker, Integration, Paper, vier §-Anker in INTERFACES.md.

### 2. INTERFACES.md §1 Modul 05 auf `entwurf`

Volle Vertrag-Sektion mit:

- API-Signaturen + ausführlichem „Bietet"-Block (Anastomose ist
  *Komposition*, nicht *Mechanik*).
- „Nutzt" — Storage, Spore, Match, WebCrypto via Modul 02, fetch +
  AbortController(`QUERY_TIMEOUT_MS = 4000`).
- Stores `sbkim_siblings` (peerNodeId → {nodeId, domain, endpoint,
  pubKey, since}) und `sbkim_anastomosis_log` (ts → {ts, peerId,
  outcome}). Log anonymisiert.
- Selbstcheck-Format.
- Versionierungs- und Match-Vertrag mit drei Punkten
  (Hauptversion-Abbruch, Schwelle aus Modul 04 ohne Hartcode,
  Bidirektionalität).
- Vollständige Fehlertabelle (10 Lagen) mit der `wirft niemals`-
  Regel für `receiveHandshake` (analog Modul 02 `verifyForeignSpore`).
- Reentry-Verhalten (since bleibt, Log re-handshake, forgetSibling
  idempotent).
- Service-Worker-Vertrag (Pfad, Methode, Body-Limit, HTTP-Codes,
  Variante offen).
- Garantien für Modul 06/07 (sbkim_siblings ist Einzige Quelle für
  Geschwister; 05 vergisst nicht; ein Handshake = ein Log-Eintrag).

### 3. INTERFACES.md §2 „Anfrage (Query)" verbindlich gefüllt

Bisher leerer Platzhalter („noch zu spezifizieren — siehe Modul
05"). Jetzt:

- **HandshakeRequest Pflichtfelder (5):** `fromNodeId`, `nonce`,
  `protocolVersion`, `senderSpore`, `signature`, `timestamp`.
- **HandshakeRequest Optionale Felder (2):** `domainVector`,
  `toNodeId`. Signaturpflichtig, wenn vorhanden.
- **HandshakeResponse Pflichtfelder (8):** `fromNodeId`, `nonceEcho`,
  `outcome`, `protocolVersion`, `receiverSpore`, `signature`,
  `timestamp`, `toNodeId`.
- **HandshakeResponse Optionale Felder (2):** `reason` (Pflicht
  bei outcome="rejected"), `score`.
- **Versionierungs-Regel** — additiv ab `entwurf`, Pflicht-Hinzufügen
  = Hauptversions-Sprung, Verweis auf §4.
- **Verifikations-Pfad (Empfänger)** in sieben Schritten, mit dem
  Detail-Pfad-Verweis auf Karte 05.

Form: alphabetisch sortierte Keys, kanonische Signatur über JSON
ohne `signature`-Feld (gleicher Pfad wie Spore in Modul 02).

### 4. §6 Änderungsprotokoll fortgeschrieben

Eine Zeile für „Spec-Sitzung 05" am unteren Ende der Tabelle —
fasst die API, das HandshakeRequest/Response-Schema, das Reentry-
Verhalten, die Service-Worker-Skizze und den Statuswechsel auf
`entwurf` in einer Zeile zusammen.

### 5. status.json + Pie regeneriert

Modul 05 von `score: "schablone"` / `siegel: "noch nicht gebaut"`
auf `score: "spec"` / `siegel: "Spec fertig"`, `kurz` auf
„Handshake zwischen Knoten — kanonisch signiert, bidirektional,
Schwelle aus Modul 04".

`python3 scripts/update_puls_pie.py` lief, Pie regeneriert:

- Schablone: 8 → 7
- Werkstatt: 1 → 1
- Spec fertig: 0 → 1
- Code-Stub: 4 → 4
- Fertig: 0 → 0

Genau wie das Briefing vorgibt.

### 6. PULS-Schnellüberblick + „Als nächstes ✨" aktualisiert

- Schnellüberblicks-Zeile Modul 05: `Spec fertig (2026-05-14)` /
  `—` / `—` / „Handshake; Fünf-Funktionen-API, bidirektional,
  kanonisch signiert, Schwelle aus Modul 04".
- „Als nächstes ✨" um eine neue Zwischen-Gruppe „Mit Spec fertig,
  Code ausstehend" mit Modul 05 ergänzt. Empfehlungs-Text auf
  „Bau-Sitzung Modul 05 Anastomose" als Hauptweg umgestellt; Modul 07
  Apoptose als Parallel-Spec; Modul 09 mit dem zusätzlichen
  Aufhänger „domainVector-Pflicht-Frage" aus dieser Sitzung.
- Neuer Sitzungs-Eintrag oben mit Was getan / Was offen / Nächster
  sinnvoller Schritt.

### 7. WEGWEISER-Stand-Block-Zeile

Eine Zeile unten im Stand-Block ergänzt (Wanderung — neueste Zeile
unten).

---

## Frischer-Kopf-Befund: keine API-Korrektur, eine Folge-Frage

Das Briefing erlaubte API-Korrekturen, wenn beim Lesen eine
Vorgabe als falsch gerichtet auffiel. Beim Durchgehen kein
solcher Punkt:

- Die Fünf-Funktionen-Surface (`init/handshake/receiveHandshake/
  listSiblings/forgetSibling`) trägt sauber.
- Bidirektionalität erzeugt keinen Deadlock — der Empfänger setzt
  *vor* der Response, der Sender *nach* der Response. Fällt die
  Response aus (Timeout/Netz), bleibt B einseitig im Log mit
  „established", A im Log mit „timeout". Beim nächsten Lauf heilt
  sich das via `re-handshake`.
- Versions-Mismatch-Abbruch ohne Netz-Aufruf ist Standard und
  spart Latenz.
- Reentry-Idempotenz mit eingefrorenem `since` ist die saubere Lösung
  gegen Doppel-Klicks und kurze Netz-Wiederholungen.

**Aber:** eine in der Karte 02 / §2 als optional gesetzte Information
— `domainVector` in der Spore — wird in Modul 05 zur kritischen
Ressource. Ohne `domainVector` kann der Empfänger nicht matchen.
Aktuelle Spec-Wahl: Empfänger antwortet `outcome:"rejected",
reason:"kein domainVector verfügbar"`. Das ist eine schwache Stelle
— deshalb als Risiko in Karte 05 dokumentiert und als Aufhänger für
eine Spec-Sitzung Modul 09 (Einbau-PWA) vorgemerkt: dort sollte der
Andock-Workflow den `domainVector` *erzeugen und mitliefern*, bevor
die Spore deployt wird. Wenn der Pflicht-Schritt auf §2 / Karte 02
durchschlägt, ist das ein Hauptversions-Sprung
(`protocolVersion: "0.1" → "1.0"`) und gehört in eine eigene
Hauptsitzung.

---

## Was offen blieb

- **Bau-Sitzung Modul 05** steht aus. Spec liegt vollständig vor
  (Karte 05 + INTERFACES.md §1 Modul 05 + §2 Anfrage). Die Bau-
  Sitzung entscheidet die zwei offenen Punkte:
  - **Service-Worker-Variante:** Page-Hosted (SW leitet via
    MessageChannel an die Page weiter) vs. SW-Hosted (SW lädt
    `05_anastomose.js` selbst und ruft `receiveHandshake` im
    Worker-Scope auf). Karte 05 § „Service-Worker-Hinweis"
    skizziert beide.
  - **Replay-Schutz:** das `nonce`-Feld ist im Schema, aber in der
    Erst-Spec wird **nicht** aktiv auf Wiederholungen geprüft. Bau-
    Sitzung darf das offen lassen (Karte 05 vermerkt, dass aktiver
    Replay-Schutz in Modul 11 gehört).
- **`domainVector` optional vs. pflicht** in der Spore — Aufhänger
  für eine Folge-Sitzung Modul 09 (Einbau-PWA). Bei Pflicht-Wandel:
  Hauptversions-Sprung notwendig.
- **PULS.md Zeilen-Längen-Schwellwert.** CLAUDE.md sagt 400 Zeilen
  Maximum, jetzt 892. Älteres in `docs/sessions/archiv/` umzuziehen
  ist Querschnitts-Aufräum-Arbeit für eine eigene Sitzung — nicht
  Teil dieser Spec-Sitzung. Die letzten drei Sitzungen (Pflege
  Match-Kalibrierung, Spec+Bau 02, Spec+Bau 04) sind genauso
  vorgegangen.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 05 Anastomose** — `src/modules/05_anastomose.js`
   als IIFE schreiben (gleiche Bauart wie 01/02/04), Panel 05 in
   `tests/manual_check.html` von „noch nicht gebaut" auf „Code-Stub"
   stellen mit acht Knöpfen (siehe Karte 05 Manueller-Test-Block),
   Service-Worker-Code für eine der zwei Varianten,
   `status.json` Modul 05 auf `stub` und Pie regenerieren.
2. Parallel: **Spec-Sitzung Modul 07 Apoptose** (Vorbedingungen
   01 + 02 erfüllt; signiertes Vermächtnis braucht den Ed25519-
   Schlüssel aus 02). Unabhängig von 05-Bau.
3. Parallel anbietbar: **Spec-Sitzung Modul 00 (Doku-Fenster)** —
   dependenz-frei, 5-Klick-UI in der Endknoten-PWA. Oder
   **Spec-Sitzung Modul 09 (Einbau-PWA)** — sollte den
   `domainVector`-Aufhänger aus dieser Sitzung mitnehmen.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/components/05_anastomose.md` vollständig gefüllt
      (Karte 05, 564 Zeilen, Stil 02/04)
- [x] `docs/INTERFACES.md` §1 Modul 05 auf `entwurf` mit Vertrag-
      Sektion (API, Stores, Selbstcheck, Service-Worker-Vertrag,
      Fehlertabelle, Reentry-Regel, Garantien für 06/07)
- [x] `docs/INTERFACES.md` §2 „Anfrage (Query)" verbindlich
      ausgefüllt (HandshakeRequest 5+2 Felder, HandshakeResponse
      8+2 Felder, kanonische Signatur, Verifikations-Pfad in
      sieben Schritten, Versionierung auf §4 verwiesen)
- [x] `docs/INTERFACES.md` §6 Änderungsprotokoll-Zeile ergänzt
- [x] Match-Schwelle ausschließlich über
      `SbkimMatch.isAboveProviderThreshold` (kein literales `0.80`
      in 05, in Karte 05 explizit dokumentiert)
- [x] Spore-Verifikation ausschließlich über
      `SbkimSpore.verifyForeignSpore` (in Karte 05 + §1 Vertrag
      dokumentiert)
- [x] Persistenz ausschließlich über `SbkimStorage` (in Karte 05 +
      §1 Vertrag dokumentiert; kein direkter IndexedDB-Zugriff)
- [x] Singleton-Identität via `SbkimSpore.getNodeId()` (kein
      zweites Identitäts-Schema)
- [x] Selbstcheck-Format synchron beim Skript-Laden
      (`MODUL 05 ANASTOMOSE bereit, Funktionen: …`)
- [x] Bidirektionale Eintragung nur bei beidseitigem Match
      (einseitig → kein `sbkim_siblings`-Eintrag, beidseitige
      `"rejected"`-Log-Zeile)
- [x] Hauptversion-Mismatch → sofortiger Abbruch
- [x] Reentry-Verhalten (since eingefroren, `re-handshake`-Log)
- [x] TTL/Vergessen explizit als Aufgabe von Modul 07 markiert,
      Modul 05 vergisst nicht von selbst
- [x] A1–B3-Synthese auf Hop B3/A3 fortgeschrieben (Karte 05 +
      §1 Vertrag)
- [x] `status.json` Modul 05 auf `score: "spec"`, `siegel: "Spec
      fertig"` (keine anderen Modul-Scores geändert)
- [x] `python3 scripts/update_puls_pie.py` gelaufen (Schablone
      8→7, Spec fertig 0→1)
- [x] `docs/PULS.md` Sitzungs-Eintrag oben, Schnellüberblick und
      „Als nächstes ✨" aktualisiert
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile unten ergänzt
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/spec-05-anastomose-XfUyX` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
