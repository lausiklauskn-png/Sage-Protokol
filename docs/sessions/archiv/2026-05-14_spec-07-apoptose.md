# Übergabeprotokoll · 2026-05-14 · Spec-Sitzung Modul 07 Apoptose

**Sitzungs-Rolle:** Spec-Sitzung (eine Sitzung, eine Phase). **Kein**
JS-Code unter `src/`. Modul 07 ist Code-Modul; Phase B (Bau) folgt in
einer separaten Sitzung mit eigenem Briefing.
**Branch:** `claude/spec-07-apoptose-ACUm5`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und an
das Übergabeprotokoll der Spec-Sitzung 05 vom 2026-05-14 (Komposition-
Spec mit neuem §2-Datenformat — Modul 07 spiegelt den Stil mit dem
Vermächtnis-Schema).
**Modul:** 07_apoptose

---

## Auftrag

Eine Phase (Spec), fünf Aufgabenstränge plus drei verbindliche
Pflicht-Entscheidungen plus eine Bestätigungs-Forderung zur
Self-Apoptose-Irreversibilität:

1. **`docs/components/07_apoptose.md` vollständig füllen.** Stil wie
   Karten 02/04/05/09. Pflichtblöcke: Hero · Im Mycel-Bild ·
   Visualisierung · Zweck · Verantwortlichkeiten · Schnittstelle ·
   Selbstcheck · Konfigurationswerte · Datenformate · Apoptose-Pfad ·
   TTL-Verhalten · Fehlertabelle · Manueller Test · Risiken · Bauzustand
   · Querverweise.
2. **`INTERFACES.md` §1 Modul 07 auf `entwurf`** mit voller
   Vertrag-Sektion (API, Stores mit Schreib-/Lese-/Lösch-Rollen,
   Selbstcheck, Versionierungs-Vertrag, Fehlertabelle, Garantien für
   06 / 10 / 11).
3. **`INTERFACES.md` §2 „Vermächtnis (Legacy)" verbindlich füllen**
   (LegacyMessage + LegacyResponse + kanonische Signatur + §4-Verweis +
   Verifikations-Pfad nummeriert).
4. **`INTERFACES.md` §6 Änderungsprotokoll-Zeile am unteren Ende.**
5. **Sitzungs-Abschluss:** PULS-Eintrag, Übergabeprotokoll (diese
   Datei), WEGWEISER-Stand-Block-Zeile, `status.json` Modul 07 von
   `schablone` auf `spec` (Pie regenerieren — Schablone 6 → 5, Spec
   fertig 1 → 2), Karte 07 Hero-Badge auf 🟨 Spec fertig.

Drei verbindliche Pflicht-Entscheidungen:

- **Frage 1 · TTL-Default-Wert und Ort.** Variante A (`SIBLING_MAX_AGE_MS`
  global in §0) oder Variante B (Modul-07-lokal).
- **Frage 2 · TTL-Trigger.** (a) PWA-Start im `init()` · (b) periodisch
  `setInterval` (nicht empfohlen) · (c) explizit durch den Andocker.
- **Frage 3 · Vermächtnis-Empfänger-Kreis.** Alle Geschwister parallel
  via `Promise.allSettled` (Vorschlag) oder Quote-System (Alternative).

Plus Pflicht (d) aus dem Bestätigungs-Block: Self-Apoptose-Irreversibilität
klar kennzeichnen (Konsolen-Warn-Hinweis oder zweistufiges Verfahren
`prepareSelfApoptose` → `confirmSelfApoptose`?).

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Modul 07 ist Code-Modul, kein bloßer Anleitungs-Schritt** — Bau-
  Phase B in separater Sitzung.
- **Persistenz strikt über `SbkimStorage`** — `sbkim_legacy_inbox`
  (Schreiber 07), `sbkim_siblings` (Schreibrecht bei 05; Modul 07 ist
  Löscher), `sbkim_anastomosis_log` (Leser für `lastActivity`),
  `sbkim_keys` / `sbkim_spore` (Löscher beim Self-Apoptose-Cleanup).
  Kein `indexedDB.open`.
- **Krypto strikt über kanonisches JSON + Ed25519** (gleicher Pfad wie
  Modul 02 / 05). Vermächtnis ist signierte Nachricht — Empfänger
  verifiziert wie eine Spore.
- **Spore-Verifikation** via `SbkimSpore.verifyForeignSpore` bei
  eingehenden Vermächtnissen.
- **Selbstcheck-Format synchron beim Skript-Laden** — gleiches Muster
  wie 01/02/04/05.
- **Singleton-Identität** aus Modul 02 — `confirmSelfApoptose` vergisst
  *exakt eine* Identität.
- **Modul 07 ist keine Mechanik der Anastomose** — ruft
  `SbkimAnastomose.handshake` *nicht* auf; Vermächtnis-Versand ist
  eigener HTTP-POST gegen `/sbkim/legacy`.
- **Hauptversions-Mismatch** → sofortiger Abbruch beim Vermächtnis-
  Empfang (analog Anastomose).
- **`PROTOCOL_VERSION = "0.1"`** und alle anderen §0-Konstanten bleiben
  unverändert — kein Hauptversions-Sprung.

---

## Was getan wurde

### 1. Karte 07 vollständig gefüllt

`docs/components/07_apoptose.md` von der Schablone (~170 Zeilen, alte
Quorum-Skizze von 2026-05-10 mit `recordMistrustVote`/
`QUORUM_MISTRUST_RATIO`) auf 🟨 Spec fertig gehoben (~480 Zeilen, Stil
02/04/05/09). Alle Pflichtblöcke vorhanden:

- **Hero** mit Status-Badge 🟨 Spec fertig, Schicht „Kern" (Modul 07
  sitzt im Kern-Block der Architektur, neben 02), Sage-Page-Anker
  (Karte 4 Eintrag 07 + Karte 13 Eigenschutz).
- **Im Mycel-Bild** — Apoptose als sauberer, gerichteter Zelltod mit
  chemischem Vermächtnis. **Bidirektional asymmetrisch:** der sterbende
  Knoten sendet einmal an alle Geschwister; jeder Empfänger speichert
  das Vermächtnis einseitig und vergisst den Sender. Keine
  Bestätigung, kein Weiterleiten. TTL-Vergessen als „stille Schwester
  der Apoptose": Knoten, die zu lange schweigen, werden ohne
  Vermächtnis vergessen — sie sind nicht verstorben, sie schweigen
  nur.
- **Visualisierung** als Mermaid-Sequenz mit zwei `alt`-Pfaden:
  Self-Apoptose (A stirbt, parallelisierter Versand via
  `Promise.allSettled`, lokaler Cleanup nach Versand) und Fremd-
  Vermächtnis-Empfang (B empfängt, verifiziert, schreibt Inbox, löscht
  Sibling).
- **Zweck** — drei Funktions-Stränge benannt: (a) Self-Apoptose mit
  Vermächtnis-Versand + lokalem Cleanup, (b) Fremd-Vermächtnis empfangen
  (Inbox + Sibling-Lösch), (c) TTL-Vergessen ohne Vermächtnis.
  Self-Apoptose explizit als **zweistufig + irreversibel** beschrieben.
- **Verantwortlichkeiten** — „Macht" (7 Punkte: zweistufige Self-
  Apoptose, kanonisches Signieren, parallelisierter Versand, Vermächtnis
  empfangen, Cleanup, TTL-Vergessen explizit, `listLegacy` als
  Lese-Helfer) und „Macht nicht" (10 Punkte: kein Match, kein Embedding,
  kein Handshake, kein direkter IndexedDB-Zugriff, keine Pulsation, kein
  Selbst-Sweep im `init()`, keine Multi-Identität, keine Schlüssel-
  Wiederherstellung, kein Vermächtnis-Weiterleiten, kein Quorum/
  Misstrauensvoten).
- **Schnittstelle** — **Sechs-Funktionen-API** mit ausführlicher Schritt-
  Dokumentation pro Funktion (`init`, `prepareSelfApoptose`,
  `confirmSelfApoptose`, `receiveLegacy`, `listLegacy`,
  `forgetExpiredSiblings`). Eine mehr als das Briefing skizziert hat
  (fünf) — die zweistufige Self-Apoptose macht aus `selfApoptose` zwei
  Funktionen.
- **Selbstcheck** — synchroner `console.info(...)` beim Skript-Laden,
  Schwelle/Endpunkt/Version bewusst nicht in der Zeile wiederholt.
  Irreversibilitäts-Hinweis erscheint erst beim `prepare`-Aufruf als
  `console.warn`.
- **Konfigurationswerte** — `PROTOCOL_VERSION`, `QUERY_TIMEOUT_MS`,
  `SIBLING_MAX_AGE_MS` (alle aus §0), `ENDPOINT.legacy` (aus §3),
  `APOPTOSE_TOKEN_TTL_MS = 60_000` (Modul-lokal). Vier-Punkt-Begründung
  für `SIBLING_MAX_AGE_MS`-in-§0-Variante-A.
- **Datenformate** — LegacyMessage (7 Pflichtfelder), LegacyResponse
  (8 Pflichtfelder + `reason` optional), `sbkim_legacy_inbox`-Wert.
- **Apoptose-Pfad** in 11 Schritten (Sender 1–6, Empfänger 7–11).
  Cleanup-Reihenfolge explizit: siblings → log → inbox → spore → keys
  (Identität zuletzt).
- **TTL-Verhalten** in eigenem Block — Variante-c-Begründung, Empfehlung
  für Karte 09, Berechnungs-Regel für `lastActivity`.
- **Fehlertabelle** — 10 Lagen mit klarer Trennung zwischen *Outcome*
  (semantische Ablehnung in `receiveLegacy` und einzelne
  Empfänger-Probleme beim Self-Apoptose-Versand) und *Throw*
  (Token-Probleme, Identitäts-Probleme, Storage-Fehler).
- **Manueller Test** — neun Test-Punkte (lokaler Vermächtnis-Round-Trip
  ohne Netz, Signatur-Manipulation, Versions-Mismatch, TTL-Cleanup,
  `listLegacy`, Self-Apoptose mit zwei in-memory Geschwistern,
  Token-Ablauf, `receiveLegacy` mit unbekanntem Sender, Selbstcheck-
  Konsolen-Prüfung).
- **Risiken** — sieben Punkte: Self-Apoptose-Irreversibilität,
  Vermächtnis-Spam → Modul 11, TTL-Drift bei wiederkehrenden Knoten,
  Signatur-Stabilität bei kanonischer Serialisierung, inkonsistenter
  Zustand bei Cleanup-Fehler, Versand-Latenz vs. Cleanup-Zeitpunkt,
  Lücke-Befund (keine fehlende Helfer-Funktion in 01–05).
- **Bauzustand-Tabelle** — Zeile *Spec gefüllt* mit Datum, Sitzung,
  ausführlicher Anmerkung.
- **Querverweise** — Abhängigkeiten 01/02 (indirekt 05), nutzt-von
  06/00/08/09/10/11/12, Site-Karten-Anker, Glossar-Anker, Integration,
  Paper, fünf §-Anker in INTERFACES.md.

### 2. Frage 1 entschieden — Variante A (`SIBLING_MAX_AGE_MS` in §0)

**Entscheidung: Variante A.** `SIBLING_MAX_AGE_MS = 2592000000` (30 Tage)
steht **global in §0 INTERFACES.md**, nicht modul-lokal in Karte 07.

**Begründung (vier Punkte, im Karten-Konfigurations-Block festgehalten):**

1. **Konsistenz mit `PROVIDER_MIN_MATCH`, `QUERY_TIMEOUT_MS` und
   `PROTOCOL_VERSION`.** §0 ist die *eine Quelle* aller protokoll-
   relevanten Konstanten; ein Modul-lokaler Wert würde diese Konvention
   brechen.
2. **Querschnitts-Anschluss für Modul 06 / Modul 11.** Modul 06
   (Heterokaryose) und Modul 11 (Rate-Limit, Schutz-Backlog) lesen
   ebenfalls `sbkim_siblings` — sie sollen denselben „aktiv"-Begriff
   teilen.
3. **Additive Änderung — kein Hauptversions-Sprung.** §0 erlaubt
   additive Erweiterung um Konstanten.
4. **`status.json.config` zieht nach.** Die Sage-Page liest §0 aus
   `status.json.config`; Variante A liefert den Wert dort automatisch
   mit.

**Konsequenz:** §0 um `SIBLING_MAX_AGE_MS = 2592000000     // 30 Tage; TTL
für Modul 07 forgetExpiredSiblings` ergänzt. `status.json.config` um
`SIBLING_MAX_AGE_MS: 2592000000` ergänzt. §6 Änderungsprotokoll-Zeile
nennt die §0-Änderung explizit.

`APOPTOSE_TOKEN_TTL_MS = 60_000` bleibt **Modul-lokal** in Karte 07 — es
ist UI-Detail, nicht protokoll-relevant.

### 3. Frage 2 entschieden — Variante (c): TTL-Trigger explizit durch den Andocker

**Entscheidung: Variante (c).** Der Andocker (Endknoten-PWA: Rezeptbuch,
Mixarium) ruft `await SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)`
selbst auf. Empfohlene Trigger-Punkte:

- nach jedem erfolgreichen `SbkimAnastomose.handshake`,
- auf einem versteckten Modul-00-Doku-Fenster-Knopf.

**Begründung:**

- **Variante (a) — PWA-Start in `init()`** versteckt das Verhalten zwischen
  Skript-Laden und erstem Anastomose-Versuch. Ein Andocker, der den
  Code liest, sähe es nicht (Konvention: `init()` = „Abhängigkeiten
  prüfen, Listener registrieren").
- **Variante (b) — `setInterval`** verstößt gegen die „keine Pulsation"-
  Regel aus Modul 05 (CLAUDE.md, Karte 05 § Verantwortlichkeiten).
- **Variante (c)** macht das Verhalten **lesbar**: der Andocker
  entscheidet, wann ein Sweep passt.

**Konsequenz:** Karte 09 (Einbau-PWA) muss in einer **Folge-Pflege-
Sitzung** um einen **Schritt 9** „TTL-Sweep nach Handshake oder auf
Doku-Fenster-Knopf" ergänzt werden — als „offen" im Was-offen-blieb-
Block dieses Übergabeprotokolls vermerkt. Bis dahin bleibt
`forgetExpiredSiblings` *bereit, aber ungenutzt*. Bei Klaus' Netz (3
Nutzer, 2 Endknoten) unkritisch.

### 4. Frage 3 entschieden — alle Geschwister parallel via `Promise.allSettled`

**Entscheidung: Vorschlag bestätigt — alle Geschwister.** Vermächtnis-
Versand parallel via `Promise.allSettled` mit `AbortController(QUERY_TIMEOUT_MS)`
pro Empfänger. Trennung:

- `recipientsNotified: string[]` — `nodeId`s von Empfängern, die mit
  `outcome:"accepted"` antworteten,
- `recipientsFailed: Array<{nodeId, reason}>` — Timeout, Netz, ungültige
  Signatur, `outcome:"rejected"`.

**Kein Quote-System.** Bei Klaus' Netz (≤ 5 Geschwister) ist Vollversand
parallel der einfache, robuste Pfad. Versand-Latenz vs. Cleanup-
Zeitpunkt als Risiko-Punkt dokumentiert; Aufhänger für eine spätere
Pflege-Sitzung „Vermächtnis-Versand in Chunks" bei Netzen mit hunderten
von Geschwistern.

### 5. Pflicht (d) entschieden — zweistufiges Verfahren mit 60s-Token

**Entscheidung: Zweistufiges Verfahren `prepareSelfApoptose` →
`confirmSelfApoptose` mit 60s-Confirmation-Token PLUS `console.warn`.**

- `prepareSelfApoptose(reason)` → `{confirmationToken, expiresAt,
  recipientCount}`. Token = 16 zufällige Bytes, base64url ohne Padding.
  TTL = `APOPTOSE_TOKEN_TTL_MS = 60_000` (Modul-lokal, im Karten-
  Konfigurations-Block). Beim `prepare`-Aufruf erscheint
  `console.warn("SELF-APOPTOSE VORBEREITET — irreversibel, Token gültig
  60s")`.
- `confirmSelfApoptose(token, reason)` → führt die irreversible Operation
  aus. Prüft Token-Gültigkeit (vorhanden, nicht abgelaufen, identisches
  `reason`); sonst `InvalidApoptoseTokenError`.

**Begründung:** Ein versehentlicher einzelner API-Aufruf darf die
Identität nicht löschen. Die UI-seitige Doppel-Bestätigung (Modul 08 /
Modul 09) ergänzt das, ersetzt es aber nicht — sie schützt den
Endbenutzer, das Token-Verfahren schützt vor versehentlichen
Programm-Aufrufen.

**Folge für die API-Surface:** sechs öffentliche Funktionen statt
fünf (`init`, `prepareSelfApoptose`, `confirmSelfApoptose`,
`receiveLegacy`, `listLegacy`, `forgetExpiredSiblings`). Selbstcheck-
Zeile entsprechend angepasst.

### 6. INTERFACES.md §1 Modul 07 auf `entwurf` + §0 + §2 + §6

**§0** um `SIBLING_MAX_AGE_MS = 2592000000     // 30 Tage; TTL für Modul
07 forgetExpiredSiblings` ergänzt.

**§1 Modul 07** von Status `schablone` (mit „noch zu spezifizieren"-
Platzhalter) auf Status `entwurf` mit voller Vertrag-Sektion gehoben.
Enthält:

- API-Signaturen + Kompositions-Charakter (07 ist *zweite Komposition*
  nach 05).
- Self-Apoptose-Irreversibilität explizit beschrieben.
- Nutzt — Storage, Spore, WebCrypto, fetch + AbortController +
  Promise.allSettled.
- Storage — Schreiber-/Leser-/Löscher-Rollen sauber getrennt:
  `sbkim_legacy_inbox` (Schreiber), `sbkim_siblings` (LÖSCHER —
  Schreibrecht bleibt bei Modul 05), `sbkim_anastomosis_log` (Leser für
  `lastActivity`), `sbkim_keys` / `sbkim_spore` (Löscher beim Self-
  Apoptose-Cleanup). Cleanup-Reihenfolge sequenziell aufgelistet
  (siblings → log → inbox → spore → keys; `sbkim_doku_meta` bleibt).
- Selbstcheck-Format.
- Versionierungs- und Vermächtnis-Vertrag (Hauptversions-Mismatch,
  pro-Empfänger-Verhalten beim Versand, kein Vermächtnis-Weiterleiten,
  Quorum-Streichung).
- Vollständige Fehlertabelle (12 Lagen) mit der `wirft niemals`-Regel
  für `receiveLegacy`.
- TTL-Trigger-Entscheidung (Variante c).
- `SIBLING_MAX_AGE_MS`-Ort-Entscheidung (Variante A).
- Garantien für Modul 06 / 10 / 11.

**§2 „Vermächtnis (Legacy)"** verbindlich gefüllt — bisher leerer
Platzhalter („noch zu spezifizieren — siehe Modul 07"):

- **LegacyMessage Pflichtfelder (7):** `fromNodeId`, `nonce`,
  `protocolVersion`, `reason`, `senderSpore`, `signature`, `timestamp`.
- **LegacyResponse Pflichtfelder (8):** `fromNodeId`, `nonceEcho`,
  `outcome`, `protocolVersion`, `receiverSpore`, `signature`,
  `timestamp`, `toNodeId`.
- **LegacyResponse Optionale Felder (1):** `reason` (Pflicht bei
  `outcome="rejected"`).
- **Versionierungs-Regel** — additiv ab `entwurf`, Pflicht-Hinzufügen =
  Hauptversions-Sprung, Verweis auf §4.
- **Verifikations-Pfad (Empfänger)** in sieben Schritten, mit Detail-
  Pfad-Verweis auf Karte 07.

Form: alphabetisch sortierte Keys, kanonische Signatur über JSON ohne
`signature`-Feld (gleicher Pfad wie Spore in Modul 02 und HandshakeRequest
in Modul 05).

**§6 Änderungsprotokoll** — eine ausführliche Zeile für „Spec-Sitzung 07"
am unteren Ende der Tabelle. Nennt explizit alle drei Pflicht-
Entscheidungen + Pflicht (d) + §0-Erweiterung + Quorum-Streichung.

### 7. status.json + Pie regeneriert

Modul 07 von `score:"schablone"` / `siegel:"noch nicht gebaut"` /
`kurz:"Selbstlöschung + signiertes Vermächtnis"` auf
`score:"spec"` / `siegel:"Spec fertig"` / `kurz:"Selbstlöschung mit
signiertem Vermächtnis — zweistufige Self-Apoptose (Token 60s),
Vermächtnis-Inbox, TTL-Vergessen explizit durch Andocker"`.

`config` um `SIBLING_MAX_AGE_MS: 2592000000` ergänzt.

`python3 scripts/update_puls_pie.py` lief, Pie regeneriert:

- Schablone: 6 → 5
- Werkstatt: 1 → 1
- Spec fertig: 1 → 2
- Code-Stub: 5 → 5
- Fertig: 0 → 0

Genau wie das Briefing vorgibt.

### 8. PULS-Schnellüberblick + „Als nächstes ✨" aktualisiert

- Schnellüberblicks-Zeile Modul 07: `Spec fertig (2026-05-14)` / `—` /
  `—` / kurze Notiz mit Zweistufigkeit + Inbox + TTL-Trigger +
  `SIBLING_MAX_AGE_MS`-§0.
- „Als nächstes ✨" um eine neue Zwischen-Gruppe „Spec frisch, Bau
  ausstehend (JS-Modul)" mit Modul 07 ergänzt — analog zur
  Anleitung-Gruppe für Modul 09.
- Empfehlungs-Text umgestellt: **Bau-Sitzung Modul 07 Apoptose** als
  zusätzliche Option neben **Bau-Sitzung Modul 09**. Modul 00
  (Doku-Fenster) als Parallel-Spec; Modul 07 explizit als „natürliche
  Anker-Stelle für Vermächtnis-Inbox-Anzeige" in Modul 00 markiert.
- Neuer Sitzungs-Eintrag oben mit Was getan / Frischer-Kopf-Befund /
  Was offen blieb / Nächster sinnvoller Schritt.

### 9. WEGWEISER-Stand-Block-Zeile

Eine Zeile unten im Stand-Block ergänzt (Wanderung — neueste Zeile
unten), umfangreich, weil die Sitzung drei verbindliche Pflicht-
Entscheidungen + Pflicht (d) + §0-Erweiterung + §2-Vermächtnis-Schema
zusammenfasst.

---

## Frischer-Kopf-Befund: keine API-Korrektur, drei Pflichtfragen, eine Quorum-Streichung

Das Briefing erlaubte API-Korrekturen an Modul 01–05, wenn beim
Durchgehen eine Lücke auffiele, die Modul 07 blockieren würde. Beim
Lesen kein solcher Punkt — alle benötigten Surface-Einträge sind
exportiert:

- `SbkimStorage.{init, get, put, del, all, clear, getStore}` — `clear`
  ist die Schlüssel-Funktion für den Self-Apoptose-Cleanup, vorhanden.
- `SbkimSpore.{init, getOrCreateIdentity, getNodeId, getPublicKeyJwk,
  generateOwnSpore, getOwnSpore, verifyForeignSpore}` — `verifyForeignSpore`
  + `getOwnSpore` + privater Schlüssel-Zugriff via `sbkim_keys["main"]`
  reichen für das Vermächtnis-Sign/Verify.
- `SbkimAnastomose.{init, handshake, receiveHandshake, listSiblings,
  forgetSibling}` — `listSiblings` wäre ein bequemer Lese-Helfer, aber
  Modul 07 liest `sbkim_siblings` direkt über `SbkimStorage.all` (gleicher
  Pfad wie 05's eigener `listSiblings`-Implementierung), um keine
  Anastomose-Abhängigkeit einzuziehen. Modul 07 hängt im Bau-DAG nur an
  01 und 02, nicht an 05 — siehe ARCHITEKTUR.md §0.

Die drei Pflicht-Entscheidungen waren als „verbindlich entscheiden,
keine Verschiebung" gekennzeichnet — entschieden mit Begründungs-Block in
der Karte:

- **Frage 1 · §0 vs. Modul-lokal:** Variante A (§0). Vier-Punkt-
  Begründung im Karten-Konfigurations-Block.
- **Frage 2 · TTL-Trigger:** Variante (c) — Andocker-explizit.
  Karte 09 Folge-Pflege-Sitzung als „offen" markiert.
- **Frage 3 · Empfänger-Kreis:** Vorschlag bestätigt — alle Geschwister
  parallel via `Promise.allSettled`.

Pflicht (d) — Self-Apoptose-Irreversibilität — als **zweistufiges
Verfahren mit 60s-Token + `console.warn`** gelöst. Die API wächst
dadurch von skizzierten fünf auf sechs Funktionen; die zweite Funktion
(`confirmSelfApoptose`) ist die einzige Abweichung vom Briefing-Skizzen-
API und ist explizit durch Pflichtpunkt (d) gedeckt.

**Quorum-Streichung** (gegenüber 2026-05-10-Schablone) verdient die
Notiz: die ursprüngliche `recordMistrustVote`-/
`QUORUM_MISTRUST_RATIO`-Skizze hat im Erst-Spec-Aufbau keinen Platz,
weil sie semantisch Modul 10 (Reputation, Schutz-Backlog) ist.
Apoptose im engeren Sinn ist *freiwilliger Selbstmord*; Modul 07 ist
nicht der Ort, an dem fremde Knoten einen Knoten *zwingen* können zu
sterben. Das Briefing erlaubte die Streichung implizit (Auftrag „drei
Funktions-Stränge" + Verantwortlichkeiten „Macht nicht" mit „kein
Quorum").

---

## Was offen blieb

- **Bau-Sitzung Modul 07 Apoptose** steht aus. Spec liegt vollständig
  vor (Karte 07 + INTERFACES.md §1 Modul 07 + §0 +
  §2 Vermächtnis + §6 Eintrag). Die Bau-Sitzung implementiert:
  - `src/modules/07_apoptose.js` als IIFE mit `window.SbkimApoptose`,
    sechs öffentliche Funktionen, fünf bis sechs benannte Error-Klassen
    (`ApoptoseDependenciesError`, `InvalidApoptoseTokenError`,
    `ApoptoseAlreadyExecutedError`, `InvalidTtlError`, ggf.
    `LegacyTimeoutError`/`LegacyNetworkError` für einzelne
    Versand-Versuche obwohl die in `recipientsFailed` landen sollen);
    kanonischer Sign/Verify-Pfad aus 02/05 spiegeln (oder via
    `window.SbkimSpore._canonicalize`-Export teilen — Bau-Sitzung
    entscheidet);
  - Panel 07 in `tests/manual_check.html` mit acht bis neun
    Test-Knöpfen (gemäß Karte 07 § Manueller Test);
  - Service-Worker-Erweiterung in `src/sbkim-sw.js` um den
    `/sbkim/legacy`-Pfad (analog der `/sbkim/anastomosis`-Behandlung
    aus Bau-Sitzung 05, Variante A · Page-Hosted via MessageChannel);
  - Test-Brücken `_invokeReceiveLegacyDirect`,
    `_buildSignedLegacyMessage`, `_verifyLegacyResponseSignature` für
    den lokalen Vermächtnis-Round-Trip ohne Netz (analog Modul 05's
    Test-Brücken).
- **Folge-Pflege-Sitzung „Karte 09 Schritt 9: TTL-Sweep-Aufruf"** —
  Karte 09 um den Schritt ergänzen, der den Andocker zum
  `forgetExpiredSiblings(SIBLING_MAX_AGE_MS)`-Aufruf anleitet. Ohne
  diesen Schritt bleibt `forgetExpiredSiblings` *bereit, aber
  ungenutzt*. Bei Klaus' Netz (3 Nutzer, 2 Endknoten) unkritisch.
- **Folge-Pflege-Sitzung „Vermächtnis-Reaktivierung"** (anbietbar bei
  größerem Netz) — wenn ein Knoten nach Vermächtnis-Empfang die gleiche
  `fromNodeId` wieder handshakt (z.B. Identität mit gleichem Schlüssel
  redeployt), könnte der alte Inbox-Eintrag automatisch bereinigt
  werden. Erst bei größerem Netz nötig.
- **Folge-Pflege-Sitzung „Transaktionaler Cleanup für 07"** (anbietbar)
  — der sequenzielle `clear`-Pfad in `confirmSelfApoptose` ist anfällig
  für inkonsistente Zwischen-Zustände bei Storage-Fehlern. Eine
  *transaktionale* Cleanup-Sequenz (alle clears in einer IndexedDB-
  Transaktion) wäre sauberer, ist aber Modul-01-Aufgabe.
- **Folge-Pflege-Sitzung „Vermächtnis-Versand in Chunks"** (anbietbar bei
  Netzen mit hunderten von Geschwistern) — die Erst-Spec versendet alle
  Vermächtnisse parallel; bei Klaus' Netz (≤ 5 Geschwister) unkritisch.
- **PULS.md Zeilen-Längen-Schwellwert.** CLAUDE.md sagt 400 Zeilen
  Maximum, jetzt deutlich darüber. Auslager-Sitzung für eine eigene
  Pflege-Phase — nicht Teil dieser Spec-Sitzung. Die letzten sechs
  Sitzungen sind genauso vorgegangen.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 07 Apoptose** — `src/modules/07_apoptose.js` als
   IIFE schreiben (gleiche Bauart wie 01/02/04/05), Panel 07 in
   `tests/manual_check.html` mit acht bis neun Test-Knöpfen, Service-
   Worker um `/sbkim/legacy` erweitern (Variante A · Page-Hosted
   analog Modul 05), `status.json` Modul 07 auf `stub` und Pie
   regenerieren.
2. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Browser** — die acht
   Schritte aus Karte 09 *live* durchlaufen an Rezeptbuch und/oder
   Mixarium. Voraussetzung: Klaus' Werte-Sammlung und Sichttest Karte
   05 vorher.
3. Parallel anbietbar: **Spec-Sitzung Modul 00 (Doku-Fenster)** —
   dependenz-frei, 5-Klick-UI in der Endknoten-PWA, natürliche
   Anker-Stelle für die Vermächtnis-Inbox-Anzeige aus Modul 07 und
   den TTL-Sweep-Knopf (Folge-Pflege-Sitzung Karte 09 Schritt 9).

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/components/07_apoptose.md` vollständig gefüllt (Karte 07,
      ~480 Zeilen, Stil 02/04/05/09) mit Hero · Im Mycel-Bild ·
      Visualisierung · Zweck · Verantwortlichkeiten · Schnittstelle ·
      Selbstcheck · Konfigurationswerte · Datenformate · Apoptose-Pfad
      · TTL-Verhalten · Fehlertabelle · Manueller Test · Risiken ·
      Bauzustand · Querverweise
- [x] **Frage 1 entschieden: Variante A** — `SIBLING_MAX_AGE_MS =
      2592000000` (30 Tage) **global in §0 INTERFACES.md**, additiv,
      kein Hauptversions-Sprung. Vier-Punkt-Begründung in Karte 07 §
      Konfigurationswerte. `status.json.config` mitgezogen.
- [x] **Frage 2 entschieden: Variante (c)** — TTL-Trigger **explizit
      durch den Andocker**. Kein `setInterval`, kein Selbst-Sweep im
      `init()`. Empfehlung für Karte 09 + Vermerk „Folge-Pflege-Sitzung
      Schritt 9" in „Was offen blieb".
- [x] **Frage 3 entschieden: alle Geschwister parallel via
      `Promise.allSettled`** mit `AbortController(QUERY_TIMEOUT_MS)` pro
      Empfänger. Trennung `recipientsNotified` / `recipientsFailed`.
- [x] **Pflicht (d) entschieden:** Self-Apoptose **zweistufig** mit
      60s-Confirmation-Token (`APOPTOSE_TOKEN_TTL_MS = 60_000`,
      Modul-lokal) plus `console.warn` beim `prepare`-Aufruf. API
      wächst auf sechs Funktionen.
- [x] **Quorum / Misstrauensvoten** aus der ursprünglichen Schablone
      (2026-05-10) gestrichen — gehören in Modul 10 (Reputation,
      Schutz-Backlog). Apoptose 07 ist freiwilliger Selbsttod.
- [x] **LegacyMessage / LegacyResponse-Schema verbindlich:** 7 + 8
      Pflichtfelder, 0 + 1 optionale, kanonische Ed25519-Signatur
      identisch zu Spore (Modul 02) und HandshakeRequest (Modul 05),
      Verifikations-Pfad in sieben Schritten, Versionierungs-Regel auf
      §4 verwiesen.
- [x] **`receiveLegacy` wirft niemals** (Outcome statt Throw, analog
      `verifyForeignSpore` und `receiveHandshake`).
- [x] **`sbkim_legacy_inbox`-Wert verbindlich:** `{fromNodeId, reason,
      signature, receivedAt}`. `senderSpore` wird **nicht** im Storage
      aufbewahrt.
- [x] **Cleanup-Reihenfolge sequenziell:** siblings → log → inbox →
      spore → keys (Identität zuletzt). `sbkim_doku_meta` bleibt
      unangetastet.
- [x] **Modul 07 ruft `SbkimAnastomose.handshake` NICHT auf** — eigener
      HTTP-POST gegen `/sbkim/legacy`.
- [x] **Hauptversion-Mismatch im `receiveLegacy`** →
      `outcome:"rejected", reason:"Inkompatible Hauptversion: <x.y>"`
      (analog Anastomose).
- [x] **`PROTOCOL_VERSION` und alle anderen §0-Konstanten bleiben
      unverändert** — kein Hauptversions-Sprung; nur additive Erweiterung
      um `SIBLING_MAX_AGE_MS`.
- [x] `docs/INTERFACES.md` §0 um `SIBLING_MAX_AGE_MS` ergänzt
- [x] `docs/INTERFACES.md` §1 Modul 07 auf `entwurf` mit voller
      Vertrag-Sektion (API, Stores mit Schreib-/Lese-/Lösch-Rollen,
      Selbstcheck, Versionierungs-Vertrag, Fehlertabelle mit 12 Lagen,
      TTL-Trigger-Entscheidung, `SIBLING_MAX_AGE_MS`-Ort-Entscheidung,
      Garantien für 06/10/11)
- [x] `docs/INTERFACES.md` §2 „Vermächtnis (Legacy)" verbindlich
      ausgefüllt (LegacyMessage 7 Pflicht, LegacyResponse 8 Pflicht + 1
      optional, kanonische Signatur, Verifikations-Pfad in sieben
      Schritten, Versionierung auf §4 verwiesen)
- [x] `docs/INTERFACES.md` §6 Änderungsprotokoll-Zeile ergänzt
- [x] **Kein JS-Code unter `src/` geändert** — Spec-Charakter dieser
      Sitzung gehalten. Phase B (Bau) folgt in einer separaten Sitzung.
- [x] `status.json` Modul 07 auf `score:"spec"` / `siegel:"Spec fertig"`
      mit aktualisiertem `kurz`-Feld; `config` um `SIBLING_MAX_AGE_MS:
      2592000000` ergänzt (keine anderen Modul-Scores geändert)
- [x] `python3 scripts/update_puls_pie.py` gelaufen (Schablone 6→5,
      Spec fertig 1→2; Code-Stub bleibt 5, Werkstatt bleibt 1)
- [x] Karte 07 Hero-Badge auf 🟨 Spec fertig
- [x] Karte 07 Bauzustand-Tabelle: Zeile *Spec gefüllt | 2026-05-14 |
      Spec 07 | …* ergänzt
- [x] `docs/PULS.md` Sitzungs-Eintrag oben, Schnellüberblick und „Als
      nächstes ✨" aktualisiert
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile unten ergänzt (Wanderung,
      neueste Zeile unten)
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/spec-07-apoptose-ACUm5` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
