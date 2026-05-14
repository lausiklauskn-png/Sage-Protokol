# Übergabeprotokoll · 2026-05-14 · Spec+Bau-Sitzung Modul 02 Spore

**Sitzungs-Rolle:** Spec+Bau-Sitzung (eine Sitzung, zwei Phasen).
**Branch:** `claude/spec-bau-02-spore-tPre4`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B + §C
und am Übergabeprotokoll der Spec+Bau-Sitzung 04 vom 2026-05-14.
**Modul:** 02_spore

---

## Auftrag

Drei verschränkte Aufgaben in einer Sitzung:

1. **Phase A — Spec:** Komponenten-Karte 02 vollständig füllen,
   Schnittstelle in `INTERFACES.md` spiegeln, **§2 Spore-JSON**
   verbindlich ausfüllen (Pflicht-/Optional-Felder, Versionierung
   verweist auf §4), Singleton-Identität pro PWA verbindlich machen
   (Schlüssel `"main"` in beiden Stores).
2. **Phase B — Bau:** `src/modules/02_spore.js` schreiben (gleiche
   Bauart wie 01/03/04 — IIFE, `<script>`-Tag, `window.SbkimSpore`,
   synchroner Selbstcheck beim Skript-Laden, lazy
   Schlüssel-Erzeugung), Panel 02 in `tests/manual_check.html` von
   „noch nicht gebaut" auf „Code-Stub" stellen mit mindestens fünf
   Knöpfen, `status.json` auf `stub` und Pie regenerieren.
3. **Sitzungs-Abschluss:** PULS-Eintrag (beide Phasen), Übergabe-
   protokoll (diese Datei), WEGWEISER-Stand-Block-Zeile, Branch
   pushen, Draft-PR gegen main, danach merge.

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Singleton-Identität** mit Schlüssel `"main"` in beiden Stores.
  Eine zweite Identität ist nicht Sache von 02 — wer das will, legt
  eine neue PWA an.
- **WebCrypto Ed25519** als einzige Krypto-Quelle:
  `crypto.subtle.generateKey({name:"Ed25519"}, true, ["sign","verify"])`.
  Wo nicht verfügbar (sehr alte Safari): benannter Fehler
  `CryptoUnavailableError`. **Kein Polyfill, keine Fallback-Krypto.**
- **Persistenz nur über `window.SbkimStorage`** —
  `put/get("sbkim_keys"|"sbkim_spore", "main", …)`. Niemals direkter
  `indexedDB.open` aus 02, sonst zerreißt der Vertrag aus 01.
- **Selbstcheck-Format** synchron beim Skript-Laden (wie 01):
  `console.info("MODUL 02 SPORE bereit, Funktionen: …")`.
- **node_id-Ableitung:** SHA-256 über `exportKey("raw", publicKey)`,
  base64url ohne Padding. Andere Knoten können die ID nachrechnen.

---

## Was getan wurde

### Phase A — Spec

#### 1. Komponenten-Karte 02 vollständig gefüllt

Die alte Schablone (mit Vorschlags-API `getNodeId`/`getPublicKeyJwk`/
`generateOwnSpore`/`verifyForeignSpore` und einer ungeordneten
SporeJson-Skizze) wurde **konkretisiert** und mit verbindlichen
Entscheidungen versehen:

- **Singleton-Identität pro PWA** als ausdrücklicher Entscheid im
  „Im Mycel-Bild"-Block. Mehrfach-Identität ist explizit gestrichen
  („wäre Vermehrungsmechanismus für Sybil-Angriffe und gehört nicht
  in den Kern").
- **Sieben-Funktionen-API** mit klarer Lazy-Init-Trennung:
  `init` prüft nur Vorhandensein und schlägt bei fehlendem
  WebCrypto laut auf; die eigentliche Schlüsselerzeugung passiert
  beim ersten `getOrCreateIdentity()`-Aufruf.
- **node_id-Ableitung** als Pseudocode-Block, mit dem Verifikations-
  Prozedere für andere Knoten in vier Schritten — JWK importieren →
  raw exportieren → SHA-256 → base64url-Vergleich.
- **Spore-JSON-Schema** mit Pflicht- und Optional-Trennung,
  inklusive der bewussten Entscheidung, dass Pflichtfelder
  alphabetisch sortiert in der kanonischen Form erscheinen.
- **Storage-Wrapper-Form** explizit dokumentiert
  (`sbkim_spore["main"] = { nodeId, sporeJson, signature }`, wobei
  die Signatur auf der Wrapper-Ebene redundant gehalten wird, damit
  Modul 05 ohne Re-Parse darauf zugreifen kann).
- **Vier-Punkt-Risiken-Block:** WebCrypto-Verfügbarkeit,
  Schlüsselverlust = Knotentod, Signatur-Stabilität, kein
  Personenbezug. Plus drei Folge-Fragen (Private-Key in IndexedDB
  als bewusster Trade-off, Domainwechsel = neue Spore + dieselbe
  Identität, Spore-Format-Drift bricht Versions-Vertrag).

Karten-Größe: 364 Zeilen. Über der konservativen 150-Zeilen-Schwelle
aus dem Briefing, aber im Bereich der bisherigen Karten 01 (295) und
04 (~340), die in einer Sitzung gemacht wurden. Die Schwelle ist als
Sicherheitsnetz gegen aufschwellende Spec gedacht; bei mir waren alle
Entscheidungen sauber und der Code-Plan klar — Phase B konnte direkt
anschließen.

#### 2. INTERFACES.md gespiegelt

Modul-02-Sektion von „schablone / noch zu spezifizieren" auf
`entwurf` gehoben. Volle Vertrag-Sektion mit Signaturen,
Lazy-Schlüssel-Vermerk, WebCrypto-Aufrufen, Storage-Schreib-Form,
node_id-Pseudocode, kanonischer Signatur-Regel, Fehlertabelle,
„Garantien für Modul 05/06/07". Änderungsprotokoll fortgeschrieben.

#### 3. INTERFACES.md §2 Spore-JSON ausgefüllt

Bisher leerer Platzhalter. Jetzt verbindlich:

- **Neun Pflichtfelder** mit Typ, Format und Beispiel:
  `createdAt`, `domain`, `embeddingModel`, `endpoint`, `id`,
  `nodeType`, `protocolVersion`, `publicKey`, `signature`. Reihenfolge
  im Schema ist alphabetisch — entspricht der kanonischen Form.
- **Fünf optionale Felder** (`nodeName`, `domainDescription`,
  `domainKeywords`, `domainVector`, `endpointPaths`) mit dem
  expliziten Hinweis, dass sie — wenn vorhanden — Teil der Signatur
  sind.
- **Versionierungs-Regel** (additiv ab `entwurf`, neue Pflichtfelder
  = Hauptversions-Sprung) mit Verweis auf §4.
- **Verifikations-Pfad** in vier Schritten (Pflichtfelder vollzählig,
  Hauptversion kompatibel, id-Konsistenz, Signatur). Details in
  Karte 02.

### Phase B — Bau

#### 4. `src/modules/02_spore.js` geschrieben

IIFE-Modul wie 01 (klassisches `<script>`-Tag, kein ESM-Import),
exportiert `window.SbkimSpore` mit den sieben öffentlichen Surface-
Einträgen aus der Spec.

Implementierung:

- **WebCrypto Ed25519** ohne Polyfill: `getSubtle()` greift auf
  `crypto.subtle` zu und wirft `CryptoUnavailableError`, wenn nicht
  vorhanden. Zusätzlich fängt `getOrCreateIdentity` einen
  `generateKey`-Fehler ab und re-wirft ihn als
  `CryptoUnavailableError` mit `cause` — manche Browser melden
  fehlende Algorithmus-Unterstützung erst beim Aufruf, nicht beim
  `crypto.subtle`-Probe.
- **Persistenz strikt über `SbkimStorage`** — `getStorage()` wirft
  `StorageUnavailableError`, wenn das Modul nicht im `window` ist.
  Kein einziger `indexedDB.open`-Aufruf in 02.
- **JWK-Persistenz** als Trick gegen IndexedDB-Strukturklon:
  `CryptoKey`-Instanzen sind nicht klonbar, JWK-Objekte schon. Beim
  Laden werden die JWKs über `importKey` re-importiert.
- **Kanonische Serialisierung** (`canonicalize()`): rekursiv,
  lexikographisch sortierte Keys, gibt einen neuen Objekt-Baum
  zurück (Eingabe wird nicht mutiert). `canonicalJsonBytes()`
  serialisiert + UTF-8 → `Uint8Array`.
- **`base64urlEncode/Decode`** als kleine eigene Helfer (RFC 4648 §5):
  Standard-Base64 → `+→-`, `/→_`, Padding entfernen; Decode rückwärts
  inklusive Padding-Wiederherstellung.
- **`generateOwnSpore(meta)`:** validiert meta (`domain`, `endpoint`,
  `nodeType` Pflicht; `nodeType` aus weißer Liste), baut den
  Pflichtteil, hängt optional gesetzte Felder an, kanonisiert,
  signiert, persistiert. Der gespeicherte Spore-JSON ist die
  kanonische Form mit Signatur — beim Verify reicht es, das
  `signature`-Feld auszuschneiden und den Rest erneut zu
  kanonisieren.
- **`verifyForeignSpore(spore)`:** wirft niemals. Prüft in dieser
  Reihenfolge: Objektform, Pflichtfelder, Hauptversion-Kompatibilität,
  `nodeType`-Whitelist, `id`-Konsistenz mit `publicKey`,
  Signatur-Verifikation. Jeder Fehlpfad liefert
  `{valid:false, reason:"<deutsch>"}`.
- **Selbstcheck synchron am Skript-Ende:**
  `console.info("MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore")`.
- **`_meta`-Objekt** mit `protocolVersion`, `identityKey`,
  `keysStore`, `sporeStore`, `requiredSporeFields` zur Inspektion in
  DevTools (analog 01/03/04).

Bewusst weggelassen:

- **Kein Backup, kein Export.** Schlüsselverlust = Knotentod.
- **Kein Re-Sign-Schema bei Domain-Wechsel.** Aufruf:
  `generateOwnSpore` mit neuen Meta-Werten (überschreibt Spore,
  behält Identität). Re-Deploy ist Modul 09.
- **Keine Multi-Identität, kein Schlüsselrotations-Pfad.** Singleton
  ist die ganze Spec.

JS-Syntax mit `node --check src/modules/02_spore.js` validiert (grün).

#### 5. `tests/manual_check.html` Panel 02 verdrahtet

Panel-Status von „noch nicht gebaut" auf „Code-Stub". Hinweis-Text
mit WebCrypto-Browser-Voraussetzung. Fünf echte Knöpfe via
`SbkimUI.addButton`:

1. **Identität erzeugen oder laden** — `init()` + `getOrCreateIdentity()`.
   Erste Ausführung erzeugt; zweite Ausführung lädt; gleiche
   `nodeId`. Pass-Kriterium: zwei Klicks nacheinander geben dieselbe
   `nodeId` zurück.
2. **Eigene Spore generieren** — `generateOwnSpore(demoMeta)` mit
   einer inline gehaltenen Demo-Konfiguration (Domain
   `rezeptbuch.example.org`, nodeType `hybrid`, Endpoint
   `https://klaus.github.io/rezeptbuch/`, plus `nodeName`,
   `domainDescription`, `domainKeywords`). Pass-Kriterium:
   vollständiges Spore-JSON mit alphabetisch sortierten Keys.
3. **Sign + Verify round-trip** — `getOwnSpore()` → `verifyForeignSpore(spore)`.
   Pass-Kriterium: `{valid:true}`.
4. **Verify mit manipulierter Spore** — eine Kopie der Spore wird
   im Feld `domain` verändert, dann verifiziert. Pass-Kriterium:
   `{valid:false, reason:"Signatur ungültig"}`.
5. **Selbstcheck Konsole prüfen** — Hinweisknopf ohne Aktion.

Skript-Tag-Einbindung folgt dem Muster: `<script src="../src/modules/02_spore.js"></script>`
am Ende der Datei, nach den anderen Modul-Skripten.

#### 6. `status.json` + PULS-Pie aktualisiert

Modul 02 von `score: "schablone"` auf `score: "stub"`, `siegel` auf
„Code-Stub", `kurz` auf „Ed25519-Identität, Singleton,
base64url(sha256(rawPub))". `python3 scripts/update_puls_pie.py`
lief, Pie regeneriert:

- Schablone: 9 → 8
- Werkstatt: 1 → 1
- Spec fertig: 0 → 0
- Code-Stub: 3 → 4
- Fertig: 0 → 0

#### 7. PULS-Schnellüberblick + „Als nächstes ✨" aktualisiert

- Schnellüberblicks-Zeile für Modul 02: `Spec fertig (2026-05-14)` /
  `Code-Stub (2026-05-14)` / `ungeprüft (Sitzung headless)` /
  `Ed25519-Identität, Singleton, base64url-sha256-rawpub`.
- „Als nächstes ✨" um Modul 02 in der Code-Stub-Liste ergänzt;
  Empfehlungs-Text auf „Klaus klickt 01+02+03+04 im Browser durch,
  danach Spec-Sitzung Modul 05 Anastomose oder Modul 07 Apoptose"
  aktualisiert. Hinweis: Modul 05 hat jetzt alle vier
  Vorbedingungen als Stub.

#### 8. WEGWEISER-Stand-Block-Zeile

Eine Zeile unten im Stand-Block ergänzt (Wanderung — neueste Zeile
unten, wie das Format vorschreibt).

---

## Was offen blieb

- **Sichttest im Browser** durch Klaus — fünf Knöpfe in Panel 02.
  Voraussetzung: WebCrypto Ed25519 (Chrome ≥ 113, Firefox ≥ 130,
  Safari ≥ 17). Erwartungen:
  - *Identität*: zwei Klicks → dieselbe `nodeId`. In DevTools →
    Application → IndexedDB → `sbkim` muss `sbkim_keys["main"]`
    stehen.
  - *Spore generieren*: vollständiges JSON mit alphabetisch
    sortierten Keys. `sbkim_spore["main"]` ist gefüllt.
  - *Round-trip*: `{valid:true}`.
  - *Manipulation*: `{valid:false, reason:"Signatur ungültig"}`.
  - *Selbstcheck*: Zeile beim Laden in der Konsole sichtbar.
- **Sichttests 01 + 03 + 04** weiterhin offen, kommen im selben
  Browser-Klick-Durchlauf mit.

---

## Nächster sinnvoller Schritt

1. Klaus klickt 01, 02, 03 und 04 im Browser durch und trägt die
   Sichttest-Zeilen in den vier Karten nach.
2. **Spec-Sitzung Modul 05 Anastomose** starten — alle vier
   Vorbedingungen (01, 02, 03, 04) stehen jetzt als Stub.
   Anastomose ist der Handshake zwischen zwei Knoten und braucht
   alle vier Bausteine: IDs aus 02, Embedding aus 03, Match aus 04,
   Persistenz für Geschwisterliste aus 01.
3. Alternativ: **Spec-Sitzung Modul 07 Apoptose** (Vorbedingungen
   01 + 02 erfüllt; signiertes Vermächtnis braucht den Ed25519-
   Schlüssel aus 02).
4. Parallel anbietbar: **Spec-Sitzung Modul 00 (Doku-Fenster)** oder
   **Modul 09 (Einbau-PWA)** — beide ohne Abhängigkeiten.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/components/02_spore.md` vollständig gefüllt (Phase A)
- [x] `docs/INTERFACES.md` Modul 02 auf `entwurf` mit Vertrag-Sektion
- [x] `docs/INTERFACES.md` §2 Spore-JSON mit verbindlichem Schema
      ausgefüllt (Pflicht- + Optional-Felder, Versionierungs-Regel
      auf §4 verwiesen)
- [x] Singleton-Identität pro PWA verbindlich (Schlüssel `"main"`
      in `sbkim_keys` und `sbkim_spore`)
- [x] `src/modules/02_spore.js` (Phase B), JS-Syntax via `node --check` grün
- [x] WebCrypto Ed25519 als einzige Krypto-Quelle, kein Polyfill,
      `CryptoUnavailableError` bei Fehlen
- [x] Persistenz strikt über `window.SbkimStorage`, kein direkter
      `indexedDB.open` aus 02
- [x] Selbstcheck-Format synchron beim Skript-Laden (wie 01)
- [x] `tests/manual_check.html` Panel 02 auf „Code-Stub" mit fünf Knöpfen
- [x] `status.json` 02 auf `stub` + Pie regeneriert
- [x] `docs/PULS.md` Sitzungs-Eintrag (Phase A + Phase B), Schnell-
      überblick und „Als nächstes ✨" aktualisiert
- [x] Übergabeprotokoll (diese Datei)
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile ergänzt
- [ ] Manueller Sichttest in `tests/manual_check.html` — explizit
      als „ungeprüft, weil Sitzung headless" markiert; Klaus klickt
      im Browser
- [ ] Commit + Push auf `claude/spec-bau-02-spore-tPre4` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
