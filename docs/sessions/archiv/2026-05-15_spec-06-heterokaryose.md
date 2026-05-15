# Übergabeprotokoll · 2026-05-15 · Spec-Sitzung Modul 06 Heterokaryose

**Sitzungs-Rolle:** Spec-Sitzung (eine Sitzung, eine Phase). **Kein**
JS-Code unter `src/`. Die Bau-Phase B kommt in einer separaten Sitzung
mit eigenem Briefing.
**Branch:** `claude/spec-06-heterokaryose-IAtIi`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und
am Übergabeprotokoll der Spec-Sitzung 05 vom 2026-05-14
(Karte 05 + Karte 07 als Stil-Referenz).
**Modul:** 06_heterokaryose

---

## Auftrag

Drei Aufgabenstränge in einer Phase:

1. **Komponenten-Karte 06 vollständig füllen** — die leere Schablone
   (141 Zeilen, alter Push-Stil aus dem Site-Echo 2026-05-10) mit
   einer vollen Spec ersetzen, die einer späteren Bau-Sitzung allein
   reicht (analog wie Modul 05 + Modul 07 gefüllt sind).
   Pflichtblöcke: Hero · Im Mycel-Bild · Visualisierung
   (Pull-Pattern) · Zweck · Verantwortlichkeiten (Macht / Macht
   nicht) · Schnittstelle (Fünf-Funktionen-API) · Selbstcheck ·
   Konfigurationswerte · Anker-Quelle · Datenformate
   (HeterokaryosisRequest/Response, Anker-Form, Inbox-Wert,
   sibling-Schema-Erweiterung, log-outcome-Vokabular) ·
   Heterokaryose-Pfad (14 Schritte) · Service-Worker-Hinweis ·
   Fehlertabelle · Hinweis an Karte 07 · Manueller Test ·
   Risiken · Bauzustand · Querverweise.
2. **INTERFACES.md §1 Modul 06 auf Status `entwurf`** mit voller
   Vertrag-Sektion (gespiegelt aus Karte 06), **§0 um
   `HETERO_MAX_ANCHORS = 5` erweitern**, **§2 „Heterokaryose
   (Pull)" als neuen Sub-Abschnitt** mit HeterokaryosisRequest +
   HeterokaryosisResponse + Anker-Form + Verifikations-Pfad
   füllen, §3 unangetastet (Endpunkt war schon eingetragen), §6
   Änderungsprotokoll fortschreiben.
3. **Sitzungs-Abschluss:** PULS-Eintrag (Spec-Sitzung Modul 06),
   Übergabeprotokoll (diese Datei), `status.json` Modul 06 von
   `schablone` auf `spec` (Pie regenerieren — Schablone 5 → 4,
   Spec fertig 1 → 2), `status.json.config.HETERO_MAX_ANCHORS = 5`
   neu, Branch pushen, Draft-PR gegen `main`.

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Stil-Vorbild Spec-Sitzung 05 (Anastomose):** Fünf-Funktionen-API,
  bidirektional, kanonisch signiert, Stores im `sbkim_*`-Prefix,
  Service-Worker-Vertrag, Sichtkontrolle als Pflicht-Punkte.
- **Stil-Vorbild Spec-Sitzung 07 (Apoptose):** `LegacyMessage`/
  `LegacyResponse`-Schema mit Pflicht-/Optional-Feldern, kanonische
  Signatur Wort-für-Wort identisch zu Spore und Handshake, Outcome-
  Pattern für `receiveLegacy`.
- **Selbstcheck-Format** verbindlich aus INTERFACES.md §6.
- **§0-Konstanten:** additiv, kein Hauptversions-Sprung
  (konsistent mit `SIBLING_MAX_AGE_MS` aus Spec-Sitzung 07).
- **Endpunkt** `/sbkim/heterokaryosis` ist in
  `status.json.endpoints` schon eingetragen — die Spec definiert
  jetzt den Vertrag.
- **PULS-400-Zeilen-Konvention** ist überfällig (3338 Zeilen vor
  dieser Sitzung) — diese Spec-Sitzung löst sie NICHT (eigene
  Pflege), hält ihren Sitzungs-Eintrag aber kompakt.

---

## Was getan wurde

### 1. Komponenten-Karte 06 vollständig gefüllt

Die alte Schablone (141 Zeilen, mit Push-Skizze aus Site-Echo) wurde
durchgängig ersetzt. Karte 06 ist jetzt ~480 Zeilen — etwa zwischen
Karte 05 (603) und Karte 07 (759), weil Heterokaryose-Push-Pattern,
Opt-In-Mechanik und Anker-Quelle alle drei explizit dokumentiert sein
müssen. Pflichtblöcke alle vorhanden:

- **Hero** mit Status-Badge 🟨 Spec fertig, Schicht „Netzwerk",
  Sage-Page-Anker.
- **Im Mycel-Bild** — Pull-Pattern als Empfangsmodus-mit-
  Antwortrecht-Aussage, Opt-In als „Klaus markiert pro Geschwister".
- **Visualisierung** — Mermaid-Sequenz-Diagramm mit sechs
  Teilnehmern (A, B, sbkim_siblings (B), SbkimSpore (B),
  sbkim_hetero_inbox (A), sbkim_anastomosis_log (A+B)), `alt/else`
  für drei Outcomes (shared / opt-out / rejected), Notiz „Klaus hat
  siblings[B].heterokaryosisOptIn = true gesetzt" als Setup-Anker.
- **Zweck** — semantisch reichere Daten als die einzelne
  Domain-Vektor-Spore (max. 5 Anker statt 1 Vektor), Drift-
  Erkennung als Feature, explizite Abgrenzung gegen Inhalts-/
  Anfrage-/Personenbezogene Daten.
- **Verantwortlichkeiten** — „Macht" mit acht Punkten, „Macht nicht"
  mit elf Punkten. Explizit gestrichen: eigenes Match, eigenes
  Embedding, eigener Handshake, direkter IndexedDB-Zugriff,
  Pulsation, Push, automatisches Vergessen, Anker-Weiterleiten,
  Schreibrecht auf `sbkim_siblings`, Setzen des
  `heterokaryosisOptIn`-Flags, Quorum.
- **Schnittstelle** — Fünf-Funktionen-API mit ausführlicher
  Schritt-Dokumentation pro Funktion.
- **Selbstcheck** — synchroner `console.info(...)` beim Skript-Laden.
- **Konfigurationswerte** — `PROTOCOL_VERSION`, `QUERY_TIMEOUT_MS`,
  `HETERO_MAX_ANCHORS` (additiv neu in §0), `ENDPOINT.heterokaryosis`.
- **Anker-Quelle (Spec-Wille)** — Default Spore-Single-Anker mit
  Label `"(domain)"`, erweiterte Quelle `sbkim_hetero_outbox` für
  spätere Spec-Sitzung 08 oder Pflege Modul 02 (Modul 06 liest
  fail-soft).
- **Datenformate** — HeterokaryosisRequest (7 Pflichtfelder inkl.
  `toNodeId` als Pflicht, anders als bei HandshakeRequest),
  HeterokaryosisResponse (8 Pflichtfelder + 2 optionale `anchors`/
  `reason`), Anker-Form, Inbox-Wert mit Komposit-Schlüssel
  `peerNodeId|ts`, additives `heterokaryosisOptIn`-Feld auf
  `sbkim_siblings`-Einträgen, additives outcome-Vokabular in
  `sbkim_anastomosis_log` (sieben neue Werte).
- **Heterokaryose-Pfad** in 14 Schritten (Sender 1–6, Empfänger
  7–11, Sender 12–14), parallel zur Schritt-Struktur in Karte
  05 / 07.
- **Service-Worker-Hinweis** — Variante A (Page-Hosted) verbindlich,
  Pfad-Vertrag (POST, JSON, ≤ 64 KiB, 405/415/413/503), HTTP 404
  → `outcome:"endpoint_unsupported"`, MessageChannel-Brücke mit
  Typ `SBKIM_HETEROKARYOSIS_REQUEST`.
- **Fehlertabelle** — zwölf Lagen mit klarer Trennung zwischen
  *Outcome* (semantische Ablehnung, opt-out, opt-out-local,
  endpoint_unsupported) und *Throw* (Protokoll / Netz / Krypto /
  UnknownSibling).
- **Hinweis an Karte 07** — die Self-Apoptose-Cleanup-Reihenfolge
  muss in einer eigenen Folge-Pflege-Sitzung um
  `sbkim_hetero_inbox` zwischen Schritt 3 und 4 (zwischen
  `sbkim_legacy_inbox` und `sbkim_spore`) erweitert werden.
  Karte 07 wird in dieser Spec-Sitzung 06 **nicht angefasst**.
- **Manueller Test** — Skizze für späteres Panel 06 mit dreizehn
  Test-Punkten (lokaler Pull-Round-Trip, opt-out Empfänger, opt-out
  lokal, unbekannter Sibling, Sender-kein-Geschwister,
  `toNodeId`-Mismatch, Versions-Mismatch, Signatur-Manipulation,
  `HETERO_MAX_ANCHORS`-Begrenzung, `listHeterokaryosis`,
  `forgetHeterokaryosis`, `endpoint_unsupported`, Selbstcheck).
- **Risiken** — acht Punkte: Anker-Vergiftung → Modul 10,
  Privacy-Leak via Outbox, Replay → Modul 11, Rate-Limit → Modul 11,
  Blocklist → Modul 12, Drift als Feature, Sibling-Schema-
  Erweiterung additiv, Anker-Quelle minimal in Erst-Spec.
- **Bauzustand-Tabelle** — neue Zeile „Spec gefüllt 2026-05-15".
- **Querverweise** — Abhängigkeiten 01/02/05, nutzt-von
  00/08/09/10/11/12/14, Site-Karte Anker, Glossar, Integration,
  Paper, fünf §-Anker in INTERFACES.md (inkl. §0
  `HETERO_MAX_ANCHORS`).

### 2. INTERFACES.md §1 Modul 06 auf `entwurf`

Volle Vertrag-Sektion mit:

- API-Signaturen + ausführlichem „Bietet"-Block (Heterokaryose ist
  *dritte Komposition* nach 05 und 07, Pull-Pattern verbindlich).
- „Nutzt" — Storage (drei Stores), Spore, WebCrypto via Modul 02,
  fetch + AbortController(`QUERY_TIMEOUT_MS = 4000`).
- Stores `sbkim_hetero_inbox` als angekündigt (Bau-Sitzung 06 zieht
  in Karte 01 + §1 Modul 01 nach), `sbkim_siblings` als Leser mit
  additivem `heterokaryosisOptIn`-Feld, `sbkim_anastomosis_log` als
  Mit-Schreiber mit additivem outcome-Vokabular,
  `sbkim_hetero_outbox` als angekündigt (Spec-Sitzung 08).
- Events (keine — MessageChannel).
- Selbstcheck-Format.
- Versionierungs- und Heterokaryose-Vertrag mit sechs Punkten
  (Hauptversion-Abbruch, HTTP-404 ohne Throw, Sibling-Filter,
  Opt-In beidseits, Anker-Anzahl, keine Weiterleitung).
- Vollständige Fehlertabelle (14 Lagen) mit der `wirft niemals`-
  Regel für `receiveHeterokaryosis` (analog Modul 05/07).
- Datenformate-Verweis auf §2.
- Service-Worker-Vertrag (Variante A verbindlich, analog 05/07).
- Garantien für Modul 07/08/10/11/12/14 (sechs Punkte, inkl.
  Lead-Pool-Verweis für Modul 14).

### 3. INTERFACES.md §0 erweitert

Eine neue Zeile am Ende des §0-Blocks:

```
HETERO_MAX_ANCHORS     = 5              // max. Anker pro Heterokaryose-Response; Modul 06, Spec-Sitzung 06
```

Additiv, kein Hauptversions-Sprung. `status.json.config` zieht den
Wert mit (siehe Schritt 5).

### 4. INTERFACES.md §2 „Heterokaryose (Pull)" gefüllt

Neuer Sub-Abschnitt unter „Vermächtnis (Legacy)":

- **HeterokaryosisRequest Pflichtfelder (7):** `fromNodeId`,
  `nonce`, `protocolVersion`, `senderSpore`, `signature`,
  `timestamp`, `toNodeId` (Pflicht — anders als HandshakeRequest).
- **HeterokaryosisResponse Pflichtfelder (8):** `fromNodeId`,
  `nonceEcho`, `outcome` (`"shared"`/`"opt-out"`/`"rejected"`),
  `protocolVersion`, `receiverSpore`, `signature`, `timestamp`,
  `toNodeId`.
- **HeterokaryosisResponse Optionale Felder (2):** `anchors`
  (Pflicht bei `outcome="shared"`, sonst weggelassen — max.
  `HETERO_MAX_ANCHORS` Einträge der Anker-Form `{label: string,
  vector: number[384]}`), `reason` (Pflicht bei `outcome="rejected"`,
  bei `opt-out` weggelassen für minimale Antwort).
- **Anker-Form** — keine Eigen-Signatur (Response-Signatur deckt
  das ganze JSON).
- **Versionierungs-Regel** — additiv ab `entwurf`,
  Pflicht-Hinzufügen = Hauptversions-Sprung, neue `outcome`-Werte
  additiv (Konsumenten ohne Kenntnis fallen auf `"rejected"`-
  Default zurück).
- **Verifikations-Pfad (Empfänger)** in acht Schritten (Form →
  Spore → Hauptversion → Signatur → `toNodeId` → Sibling-Filter →
  Opt-In-Filter → Antwort).

Form: alphabetisch sortierte Keys, kanonische Signatur über JSON
ohne `signature`-Feld (gleicher Pfad wie Spore in Modul 02,
HandshakeRequest in Modul 05, LegacyMessage in Modul 07).

### 5. §6 Änderungsprotokoll fortgeschrieben

Eine Zeile für „Spec-Sitzung 06" am unteren Ende der Tabelle —
fasst die API, das HeterokaryosisRequest/Response-Schema, das
Opt-In-Schema, das additive Outcome-Vokabular, den neuen Store, den
Service-Worker-Vertrag, die neue §0-Konstante, die Karte-07-
Cleanup-Folge-Pflege und den Statuswechsel auf `entwurf` in einer
Zeile zusammen.

### 6. status.json + Pie regeneriert

Modul 06 von `score: "schablone"` / `siegel: "noch nicht gebaut"`
auf `score: "spec"` / `siegel: "Spec fertig"`, `kurz` auf
„Datenaustausch unter Geschwistern (Pull, Opt-In beidseits) —
Fünf-Funktionen-API, signierte Anker (max 5), kanonisch wie 05/07,
neuer Store sbkim_hetero_inbox".

`config.HETERO_MAX_ANCHORS = 5` am Ende des `config`-Blocks
hinzugefügt (konsistent mit Reihenfolge in §0; nach
`SIBLING_MAX_AGE_MS`).

`python3 scripts/update_puls_pie.py` lief, Pie regeneriert:

- Schablone: 5 → 4
- Werkstatt: 1 → 1
- Spec fertig: 1 → 2
- Code-Stub: 7 → 7
- Fertig: 0 → 0

14 Module gesamt, genau wie das Briefing vorgibt.

### 7. PULS-Schnellüberblick + „Als nächstes ✨" aktualisiert

- Schnellüberblicks-Zeile Modul 06: `Spec fertig (2026-05-15)` /
  `—` / `—` / Drei-Sätze-Anker zu Pull-Pattern, Opt-In beidseits,
  fünf Funktionen, neuer Store, kanonisch wie 05/07,
  `endpoint_unsupported` ohne Throw.
- „Als nächstes ✨" — der „Spec frisch, Bau ausstehend"-Bucket
  bekommt Modul 06 als zweite Zeile (parallel zu Modul 09); die
  Block-Überschrift wird von „aus den Spec-Sitzungen 2026-05-14"
  auf „Spec frisch" generalisiert (additiv, weil 06 frisch von
  2026-05-15 ist).
- Neuer Sitzungs-Eintrag oben mit Getan / Was nicht geändert
  wurde / Frischer-Kopf-Befund (acht Pflicht-Fragen alle
  entscheidbar) / Was offen blieb / Nächster sinnvoller Schritt.

---

## Frischer-Kopf-Befund: die acht Pflicht-Fragen alle entscheidbar

Das Briefing nannte acht Pflicht-Fragen, von denen jede potenziell
eine Blockade-Klausel hätte auslösen können. Beim Durchgehen kein
solcher Punkt — alle acht sind im Spec-Rahmen entscheidbar (Details
im PULS-Eintrag oben). Die einzige nicht-triviale Entscheidung war
**Punkt 1 (was tauschen?)**: **Domain-Anker** setzen sich gegen
Alternativen (Anfrage-Statistiken / Spore-Aliase / k-anonymisierte
Aggregate) durch, weil sie das einzige Datum sind, das **schon im
Andock-Workflow erzeugt wird** (Embedding-Vektor pro Stichwort) und
ohne neue Embedding-Aufrufe zur Verfügung steht. Anfrage-Statistiken
bräuchten einen neuen Logger im Endknoten; Spore-Aliase gehören in
Modul 14; k-anonymisierte Aggregate sind ein eigenes Feld.

Karte 06 dokumentiert die Anker-Quelle bewusst als zweistufig:
**Default** ist der Spore-Single-Anker mit Label `"(domain)"`
(Vektor = `senderSpore.domainVector`), damit Bau-Sitzung 06 ohne
Outbox-Vorarbeit laufen kann; die **erweiterte Quelle**
`sbkim_hetero_outbox` ist für Spec-Sitzung 08 (UI-Demo) oder eine
Pflege Modul 02 vorbereitet (Modul 06 liest fail-soft). Konsequenz
für Klaus' aktuelles Netz: erste Bau-Iteration liefert genau **einen**
Anker pro Pull — primärer Nutzen ist Drift-Erkennung beim
Domain-Vektor.

---

## Was offen blieb

- **Bau-Sitzung Modul 06** steht aus. Spec liegt vollständig vor
  (Karte 06 + INTERFACES.md §1 Modul 06 + §2 Heterokaryose + §0
  `HETERO_MAX_ANCHORS`). Die Bau-Sitzung muss zusätzlich:
  - Karte 01 § Stores um `sbkim_hetero_inbox` ergänzen (Schreiber
    06, Komposit-Schlüssel `peerNodeId|ts`), DB-Version 1 → 2
    falls ein additiver Migrations-Schritt nötig ist;
  - §1 Modul 01 § Storage-Block dito;
  - `src/sbkim-sw.js` um `/sbkim/heterokaryosis`-fetch-Listener
    erweitern (analog dem `/sbkim/legacy`-Pfad aus Bau-Sitzung 07);
  - Karte 07 § Self-Apoptose-Cleanup-Reihenfolge um
    `sbkim_hetero_inbox` zwischen Schritt 3 und 4 erweitern
    (eigene Mini-Pflege oder Teil der Bau-Sitzung 06);
  - Panel 06 in `tests/manual_check.html` mit ~13 Knöpfen.
- **Anker-Quelle `sbkim_hetero_outbox`** spec-mäßig vorbereitet,
  aber implementations-technisch erst Spec-Sitzung 08 oder Pflege
  Modul 02.
- **`heterokaryosisOptIn`-Setter im Endknoten-UI** als Folge-
  Aufgabe für Modul 00 (Doku-Fenster) oder Modul 08 (UI-Demo).
  Klaus markiert pro Geschwister, mit wem er erweiterten
  Datenaustausch erlaubt.
- **Karte 07 Self-Apoptose-Cleanup-Erweiterung** als
  Mini-Folge-Pflege notiert (siehe oben).
- **Karte 14 Status-Zeile-Mini-Pflege** und **PULS-400-Zeilen-
  Konvention** weiter offen (überfällig). Diese Spec-Sitzung löst
  sie nicht.
- **Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-
  Andock-Versuch** bleibt der empfohlene Haupt-Pfad (Modul 06 ist
  unabhängig).

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-
   Andock-Versuch** zwischen Rezeptbuch und Mixarium. Karte 09 ist
   vollständig: neun Schritte (Pflege Schritt 9) + Schritt-3-
   Verzweigung mit Pre-Flight-Check (Pflege App-SW-Koexistenz) +
   `sbkim-sw.js` mit `SBKIM_SW_STANDALONE`-Schalter. **Nicht
   headless** — Klaus klickt am Tablet, kopiert Konsolen-Ausgaben.
2. **Bau-Sitzung Modul 06 Heterokaryose** als headless-Anschluss-
   Sitzung. Spec stellt die API bereit; Bau-Sitzung implementiert
   `src/modules/06_heterokaryose.js` exakt nach Schnittstelle aus
   INTERFACES.md. *Headless möglich.*
3. **Mini-Folge-Pflege „Karte 14 Status-Zeile nachziehen"** —
   zwei Zeilen, *headless möglich*, niedrige Dringlichkeit.
4. **Pflege-Sitzung „PULS-Archivierung"** — überfällig, *headless
   möglich*, niedrige Dringlichkeit.
5. **Spec-Sitzung Modul 08 UI-Demo** — Werkstatt-Stub füllen,
   *headless möglich*, niedrige Dringlichkeit; ergänzt den
   Outbox-Pfad für Modul 06.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/components/06_heterokaryose.md` vollständig gefüllt
      (Karte 06, ~480 Zeilen, Stil 05/07)
- [x] `docs/INTERFACES.md` §1 Modul 06 auf `entwurf` mit Vertrag-
      Sektion (API, Stores, Selbstcheck, Service-Worker-Vertrag,
      Fehlertabelle, Versionierungs- und Heterokaryose-Vertrag,
      Garantien für 07/08/10/11/12/14)
- [x] `docs/INTERFACES.md` §0 um `HETERO_MAX_ANCHORS = 5` ergänzt
- [x] `docs/INTERFACES.md` §2 „Heterokaryose (Pull)" verbindlich
      ausgefüllt (HeterokaryosisRequest 7 Felder, HeterokaryosisResponse
      8+2 Felder, Anker-Form, kanonische Signatur, Verifikations-
      Pfad in acht Schritten, Versionierung auf §4 verwiesen)
- [x] `docs/INTERFACES.md` §6 Änderungsprotokoll-Zeile ergänzt
- [x] `docs/INTERFACES.md` §3 unangetastet (Endpunkt
      `heterokaryosis: /sbkim/heterokaryosis` war seit Hauptsitzung
      Site-Echo schon eingetragen)
- [x] Karte 06 nutzt `SbkimSpore.verifyForeignSpore` für Sender-
      Verifikation (in §1 Vertrag dokumentiert)
- [x] Karte 06 nutzt `SbkimStorage.{init,get,put,del,all}` für
      Persistenz (kein direkter IndexedDB-Zugriff)
- [x] Singleton-Identität via `SbkimSpore.getNodeId()` (kein zweites
      Identitäts-Schema)
- [x] Selbstcheck-Format synchron beim Skript-Laden
      (`MODUL 06 HETEROKARYOSE bereit, Funktionen: …`)
- [x] Pull-Pattern verbindlich (kein Push), Empfangsmodus-mit-
      Antwortrecht-Prinzip eingehalten
- [x] Beidseitiger Opt-In via additivem `heterokaryosisOptIn`-Feld
      auf `sbkim_siblings`-Einträgen (fail-soft default `false`,
      Modul 05 setzt nicht, Karte 05 unangetastet)
- [x] Hauptversion-Mismatch → `outcome:"rejected"` mit
      `reason:"Inkompatible Hauptversion: <x.y>"` (analog 05/07)
- [x] HTTP 404 → `outcome:"endpoint_unsupported"` (KEIN Throw,
      drehbuchkonform für Geschwister mit älterem Protokoll-Stand)
- [x] Max. `HETERO_MAX_ANCHORS` (= 5) Anker pro Response (Spec-Wille)
- [x] Hinweis an Karte 07 für Self-Apoptose-Cleanup-Erweiterung
      dokumentiert, Karte 07 selbst **nicht angefasst** (Spec-Disziplin)
- [x] Karten 05/10/11/12/14 unangetastet (nur Hook-Verweise in
      Karte 06)
- [x] **Kein JS-Code in `src/`** — `src/modules/06_heterokaryose.js`
      existiert nicht und entsteht in einer eigenen Bau-Sitzung
- [x] **Keine `tests/manual_check.html`-Änderung** — Panel 06
      entsteht in der Bau-Sitzung 06
- [x] **Kein Hauptversions-Sprung** — `HETERO_MAX_ANCHORS` additiv
      in §0; `heterokaryosisOptIn` additiv im Storage-Schema; neue
      Datenformate (kein Optional→Pflicht-Wandel); neue `outcome`-
      Werte additiv; `PROTOCOL_VERSION` bleibt `"0.1"`
- [x] `status.json` Modul 06 auf `score: "spec"`, `siegel: "Spec
      fertig"`, `kurz` aktualisiert; `config.HETERO_MAX_ANCHORS = 5`
      ergänzt
- [x] `python3 scripts/update_puls_pie.py` gelaufen (Schablone
      5 → 4, Spec fertig 1 → 2; 14 Module gesamt unverändert)
- [x] `docs/PULS.md` Schnellüberblicks-Zeile Modul 06 aktualisiert
- [x] `docs/PULS.md` § Als nächstes ✨ — Modul 06 zum „Spec frisch,
      Bau ausstehend"-Bucket ergänzt
- [x] `docs/PULS.md` Sitzungs-Eintrag oben (Getan/Was nicht/
      Frischer-Kopf/Offen/Nächster Schritt)
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/spec-06-heterokaryose-IAtIi` (folgt)
- [ ] Draft-PR gegen `main` (folgt)
