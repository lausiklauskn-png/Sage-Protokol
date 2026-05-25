# Modul 02 — Spore

> **Status:** 🟦 Code-Stub  ·  **Schicht:** Kern  ·  **Anker:** Sage-Page → Karte 4, Eintrag 02
> **Datei (Code):** `src/modules/02_spore.js`
>
> _Ed25519-Identität, signierte Visitenkarte, abgeworfen unter
> `/.well-known/sbkim/spore.json` — die Knoten-Ich-Erklärung des
> Mycels._

---

## Im Mycel-Bild

Die Spore ist die **signierte Visitenkarte** des Knotens. Sie trägt
Identität (Ed25519-Schlüsselpaar), Domäne und Endpunkt-Adressen — alles
zusammengefasst in einer kleinen JSON-Datei mit Signatur. Ein Knoten,
der seinen privaten Schlüssel verliert, ist gestorben: ein Pilz wächst
nicht aus dem Nichts wieder, er beginnt mit einer neuen Spore und ist
damit ein neuer Knoten. Konsequent gedacht: **Identität bedeutet, den
eigenen Schlüssel zu halten.**

Daraus folgt eine harte Wahl, die diese Spec verbindlich macht:
**eine Spore pro PWA, Singleton.** Beide Stores aus Modul 01
(`sbkim_keys`, `sbkim_spore`) verwenden den festen Schlüssel `"main"`.
Wer eine zweite Identität auf demselben Endknoten will, legt eine
zweite PWA an. Modul 02 unterstützt keine Multi-Identität — das wäre
ein Vermehrungsmechanismus für Sybil-Angriffe und gehört nicht in den
Kern.

---

## Visualisierung

```svg
<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sporeBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <filter id="sporeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect x="20" y="20" width="440" height="200" rx="14" fill="url(#sporeBg)" stroke="#6366F1" stroke-width="1.5" filter="url(#sporeShadow)"/>
  <text x="40" y="56" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">protocolVersion</text>
  <text x="200" y="56" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">"0.1"</text>
  <text x="40" y="84" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">id</text>
  <text x="200" y="84" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">base64url(sha256(rawPub))</text>
  <text x="40" y="112" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">domain</text>
  <text x="200" y="112" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">"rezeptbuch.example"</text>
  <text x="40" y="140" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">nodeType / endpoint</text>
  <text x="200" y="140" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">"hybrid" · "https://…/"</text>
  <text x="40" y="168" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">embeddingModel</text>
  <text x="200" y="168" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">"Xenova/multilingual-e5-small"</text>
  <g transform="translate(380,140)">
    <circle r="32" fill="none" stroke="#16A34A" stroke-width="2"/>
    <text x="0" y="-4" text-anchor="middle" font-size="11" fill="#16A34A">Ed25519</text>
    <text x="0" y="12" text-anchor="middle" font-size="11" fill="#16A34A">Signatur</text>
  </g>
  <text x="40" y="200" font-family="ui-monospace,monospace" font-size="11" fill="#94A3B8">— Spore wird unter /.well-known/sbkim/spore.json abgelegt —</text>
</svg>
```

---

## Zweck

Erzeugt und verwaltet die **eine** Identität eines Knotens:

- Ed25519-Schlüsselpaar (einmalig pro PWA, persistent in `sbkim_keys["main"]`)
- `node_id` = `base64url(sha256(rawPublicKey))`, ohne Padding — so kann
  jeder andere Knoten die ID aus dem mitgelieferten Public Key
  nachrechnen
- Spore-JSON mit Pflicht-Meta, Public Key und Ed25519-Signatur,
  persistiert in `sbkim_spore["main"]` und vom Betreiber unter
  `/.well-known/sbkim/spore.json` veröffentlicht

Geht der private Schlüssel verloren oder löscht der Browser den
IndexedDB-Speicher, ist dieser Knoten tot — eine Neuaufnahme erzeugt
eine neue Identität (neuer `nodeId`, neue Spore). Konsistent mit dem
Pilz-Modell.

---

## Verantwortlichkeiten

**Macht:**
- Ed25519-Schlüsselpaar via WebCrypto erzeugen (`name: "Ed25519"`)
- Schlüsselpaar als JWK in `sbkim_keys["main"]` persistieren (Modul 01)
- `node_id` aus dem rohen Public Key (`exportKey("raw")`) ableiten:
  SHA-256 → base64url ohne Padding
- Spore-JSON bauen, **kanonisch** serialisieren (sortierte Keys, ohne
  `signature`-Feld), Ed25519-signieren, in `sbkim_spore["main"]`
  ablegen
- Fremde Spore prüfen: Signatur-Verifikation gegen den in der Spore
  enthaltenen Public Key **und** Konsistenzprüfung
  `spore.id === base64url(sha256(rawPubFromJwk))`

**Macht nicht:**
- Keine Wiederherstellung verlorener Schlüssel — kein Backup, kein
  Mnemonic, kein Export.
- Keine Multi-Identität. Singleton mit Schlüssel `"main"`.
- Keine direkte IndexedDB-Nutzung. Persistenz **ausschließlich** über
  `window.SbkimStorage` (sonst zerreißt der Vertrag aus
  `01_storage.md`).
- Keine Spore-Veröffentlichung (Datei unter `.well-known/` deployt der
  Betreiber manuell ins Repo — siehe Modul 09).
- Kein Polyfill für fehlendes WebCrypto-Ed25519. Wenn der Browser es
  nicht kann, scheitert der Aufruf laut mit einem benannten Fehler.
- Kein eigenes Re-Sign-Schema bei Domain-Wechsel (das ist Aufgabe von
  Modul 09 / Anleitung — Spore neu generieren, neu deployen).

---

## Schnittstelle

Modul 02 exportiert **vierzehn** öffentliche Funktionen ab Brief 04 der
V1-Sammelspec-Kaskade (2026-05-19) plus Bau 02.Y (2026-05-19, Code-
Stand). Alle DB-Operationen laufen über `window.SbkimStorage`, sind also
Promise-basiert. Schlüssel-Erzeugung ist **lazy** — sie passiert beim
ersten `getOrCreateIdentity(key)`-Aufruf, nicht beim Skript-Laden.

```
init() → Promise<void>
  // Bereitet das Modul vor: ruft SbkimStorage.init() auf, prüft
  // WebCrypto-Verfügbarkeit (wirft CryptoUnavailableError bei
  // fehlender Ed25519-Unterstützung). Erzeugt KEIN Schlüsselpaar.
  // Idempotent.

getOrCreateIdentity(key?: string) → Promise<{ nodeId: string, publicKeyJwk: JsonWebKey }>
  // Default-Parameter key="main" (Rückwärts-Kompat zum Singleton-
  // Vertrag aus Spec-Sitzung 02 2026-05-14). Lädt das Keypair aus
  // sbkim_keys[key]. Wenn nicht vorhanden: erzeugt es per WebCrypto
  // Ed25519, persistiert es, gibt nodeId + public key zurück.
  // Mehrfacher Aufruf für denselben key liefert dieselbe Identität
  // (Cache + Storage). Multi-Identität: Spec-Sitzung Multi-Identität
  // (Brief 04, 2026-05-19). Siehe § Multi-Identität (Brief 04) unten
  // und INTERFACES.md § 9 Identitäts-Map.

getNodeId() → Promise<string>
  // base64url-SHA-256 vom raw public key der AKTIVEN Identität
  // (sbkim_meta["active-identity"]; Default "main"), ohne Padding.
  // Identisch zum Feld spore.id der aktiven Persona. Wirft
  // NoIdentityError, wenn noch keine Identität existiert (vorher
  // getOrCreateIdentity rufen).

getPublicKeyJwk() → Promise<JsonWebKey>
  // Public Key der AKTIVEN Identität als JWK-Objekt (kty: "OKP",
  // crv: "Ed25519", x: …). Wirft NoIdentityError, wenn noch keine
  // Identität existiert.

generateOwnSpore(meta, key?: string) → Promise<SporeJson>
  // Baut die Spore aus den Pflicht- und Optional-Feldern (siehe
  // Datenformat unten), signiert kanonisch, persistiert in
  // sbkim_spore[key]. Default-Parameter key=getActiveIdentityKey().
  // Überschreibt eine vorhandene Spore in diesem Slot. Pro Identität
  // existiert ein eigener Spore-Slot mit eigenen
  // embeddingCapabilities + embeddingNeeds (M04-Erweiterung Brief 03
  // pro Persona; Brief 04 verankert die Persona-Mehrfachheit).
  // meta-Pflichtfelder: domain, nodeType, endpoint.
  // Wirft InvalidSporeMetaError bei Form-/Wertefehlern in meta.

getOwnSpore(key?: string) → Promise<SporeJson | null>
  // Default-Parameter key=getActiveIdentityKey(). Lädt die persistierte
  // Spore der angegebenen Identität. null, wenn der Slot leer ist.

verifyForeignSpore(spore) → Promise<{ valid: boolean, reason?: string }>
  // Prüft Signatur und nodeId-Konsistenz einer beliebigen Spore.
  // Liefert { valid: true } oder { valid: false, reason: "<deutsch>" }.
  // Wirft niemals — Verifikations-Fehler werden als reason zurückgegeben.

setActiveIdentity(key: string) → Promise<void>
  // Spec-Sitzung Multi-Identität (Brief 04, 2026-05-19). Schreibt
  // sbkim_meta["active-identity"] = key. Validiert, dass key in
  // sbkim_keys existiert; sonst UnknownIdentityError (kein Storage-
  // Eingriff). Idempotent: wenn key bereits aktiv, resolves ohne
  // Storage-Schreibvorgang. resetIdentityCache() wird intern gerufen,
  // sodass nachfolgende getNodeId/getOwnSpore-Aufrufe die neue
  // Identität liefern.

getActiveIdentityKey() → Promise<string>
  // Spec-Sitzung Multi-Identität (Brief 04). Liest
  // sbkim_meta["active-identity"]; Default "main", falls fehlend
  // (Rückwärts-Kompat zum Singleton-Vertrag).

listIdentities() → Promise<string[]>
  // Spec-Sitzung Multi-Identität (Brief 04). Alle Schlüssel in
  // sbkim_keys, lexikographisch sortiert. Leeres Array, wenn noch
  // keine Identität angelegt wurde (frisch installiertes PWA-Profil).

removeIdentity(key: string, options?: { force?: boolean })
  → Promise<boolean>
  // Spec-Sitzung Multi-Identität (Brief 04). Löscht den Identitäts-
  // Slot key inkl. allen identitäts-spezifischen Stores
  // (sbkim_siblings_<key>, sbkim_anastomosis_log_<key>,
  // sbkim_legacy_inbox_<key>, sbkim_hetero_inbox_<key>,
  // sbkim_hetero_outbox_<key>) plus sbkim_keys[key] und sbkim_spore[key].
  // options-Form: { force?: boolean } (Default false):
  //   force:false → RemoveActiveIdentityError, wenn key === aktive
  //                 Identität (defensiver Schutz vor versehentlicher
  //                 Selbstauslöschung).
  //   force:true  → löscht auch die aktive Identität. setzt
  //                 active-identity auf "main", falls dort noch eine
  //                 Identität liegt; sonst auf den ersten Schlüssel
  //                 aus listIdentities() (lexikographisch); sonst
  //                 (kein Slot mehr) wird sbkim_meta["active-identity"]
  //                 gelöscht.
  //   key === active-identity → Vermächtnis-Versand pro Persona
  //                 (interner Hook in Modul 07: _sendLegacyForIdentity).
  //                 Single-Identitäts-Apoptose; die andere Persona
  //                 bleibt unangetastet. Bei key !== active-identity
  //                 wird KEIN Vermächtnis verschickt — die andere
  //                 Persona ist nicht „gestorben", sie wird nur lokal
  //                 vergessen.
  // Rückgabe: true wenn gelöscht, false wenn key unbekannt
  // (idempotent — wie forgetSibling). Bestätigungs-Konvention auf
  // Anwendungs-Ebene: UI muss vor dem Aufruf bestätigen; Modul 02
  // selbst hat keinen Bestätigungs-Token (im Gegensatz zu
  // confirmSelfApoptose in Modul 07).
  // resetIdentityCache() wird am Ende des Pfads gerufen.

resetIdentityCache() → void
  // Sync, idempotent. Leert den In-Memory-identityCache des Moduls,
  // ohne den Storage anzufassen — das ist Aufgabe von Modul 01.
  // Pflicht-Aufruf für Module, die sbkim_keys/sbkim_spore von außen
  // leeren (Modul 07 confirmSelfApoptose, ggf. Modul 12 Blocklist
  // später). Ohne diesen Aufruf liefern getNodeId / getPublicKeyJwk
  // weiter die alte Identität aus dem Cache, trotz leerem Storage,
  // und ein storage-direkter Lookup (z.B. SbkimApoptose.loadOwnPrivateKey)
  // wirft NoIdentityError trotz „frischer" Identität-Erwartung.
  // Modul 02 erkennt Storage-Cleanup nicht selbst und vertraut auf den
  // expliziten Aufruf. Pflege-Sitzung 2026-05-15 (Klaus' Sichttest-
  // Befund Modul 07 Test 6).

exportBackup(password: string) → Promise<SbkimBackupBlob>
  // Erzeugt eine passwort-verschlüsselte Snapshot-Datei der eigenen
  // Identität + bekannten Geschwister (Backup-Inhalt-Block unten,
  // Pflicht-Frage 1 Variante b).
  // Pflicht-Parameter:
  //   password (string): Mindestlänge BACKUP_PASSWORD_MIN_LEN
  //     (§0, Spec-Sitzung Backup-Export Stufe 2 = 8). Aufrufer-
  //     verantwortet. Modul 02 prüft NUR die Mindestlänge, keine
  //     Entropie-Schätzung (siehe § Risiken „Passwort-Schwäche").
  // Rückgabe-Pflichtfelder (SbkimBackupBlob, siehe § Datenformat):
  //   version, kdf, cipher, ciphertext, payload-schema-version.
  // Wirft InvalidBackupPasswordError synchron bei leerem/zu kurzem
  // Passwort. NoIdentityError, wenn noch keine Identität existiert.
  // Wirft NIE bei korruptem Storage-Inhalt — Module 02 nimmt was
  // sbkim_keys["main"] und sbkim_spore["main"] liefern, ohne zu
  // re-validieren (die Identität ist beim Erzeugen schon geprüft
  // worden). sbkim_siblings wird fail-soft gelesen (leere Liste,
  // wenn der Store leer oder nicht vorhanden ist).

importBackup(blob: SbkimBackupBlob, password: string,
             options?: { force?: boolean })
  → Promise<{ restored: boolean, reason?: string }>
  // Stellt einen Backup-Snapshot wieder her — entschlüsselt mit
  // dem mitgegebenen Passwort, prüft Schema, schreibt Identität +
  // Geschwister zurück.
  // Pflicht-Parameter:
  //   blob (SbkimBackupBlob): die Form aus exportBackup, JSON-parsed.
  //   password (string): wie exportBackup. Falsches Passwort →
  //     BackupDecryptError (nicht stiller Restore-false).
  // Optional-Parameter:
  //   options.force (boolean, Default false): bei vorhandener
  //     Identität in sbkim_keys["main"] wirft Modul 02 per Default
  //     BackupOverwriteError (Pflicht-Frage 3 Variante a — defensiv).
  //     Aufrufer setzt force:true, um die bestehende Identität
  //     bewusst zu ersetzen.
  // Rückgabe-Pflichtfeld:
  //   restored (boolean): true wenn Identität + Geschwister erfolgreich
  //     geschrieben wurden, false wenn ein Vor-Check verboten hat
  //     (z.B. force-Schwelle ohne force, oder Schema-Inkompatibilität
  //     — siehe Error-Klassen unten).
  // Rückgabe-Optional-Feld:
  //   reason (string, deutschsprachig): bei restored=false der Grund.
  // Wirft synchron InvalidBackupPasswordError (Mindest-Länge),
  // BackupVersionMismatchError (blob.version unbekannte
  // Hauptversion), BackupSchemaError (payload-schema-version ist
  // höher als das Modul kennt). Wirft asynchron BackupDecryptError
  // (falsches Passwort, korruptes Format, AES-GCM-Auth-Fail) und
  // BackupOverwriteError (bestehende Identität, force=false).
  // Nach erfolgreichem restored=true ruft Modul 02 intern
  // resetIdentityCache() — der Cache muss sich nach Storage-
  // Überschreibung neu aufbauen, sonst liefert getNodeId weiter
  // die alte Identität.
```

### Selbstcheck

Beim **Skript-Laden** (synchron, vor jeglichem Aufruf):

```
console.info("MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/setActiveIdentity/getActiveIdentityKey/listIdentities/removeIdentity/resetIdentityCache/exportBackup/importBackup");
```

Wie Modul 01 — die Selbstcheck-Meldung signalisiert „Modul geladen",
nicht „Identität existiert". Die Schlüssel-Erzeugung ist asynchron und
geschieht erst beim ersten `getOrCreateIdentity()`-Aufruf.

### node_id-Ableitung (verbindlich)

```
rawPub  = await crypto.subtle.exportKey("raw", publicKey)   // 32 bytes
hash    = await crypto.subtle.digest("SHA-256", rawPub)     // 32 bytes
nodeId  = base64url(hash) ohne Padding                      // 43 chars
```

Andere Knoten können die ID nachrechnen:
1. JWK aus `spore.publicKey` mit `crypto.subtle.importKey("jwk", ...)` laden
2. Mit `exportKey("raw", ...)` die 32-Byte-Form holen
3. SHA-256 darüber, base64url ohne Padding
4. Vergleich mit `spore.id` — Mismatch ⇒ Spore ungültig

`base64url ohne Padding` heißt: Standard-Base64, dann `+` → `-`,
`/` → `_`, alle `=` am Ende entfernt.

### Datenformat: Spore-JSON

Pflichtfelder (Reihenfolge im kanonischen JSON: alphabetisch):

```jsonc
{
  "createdAt":       "2026-05-14T07:00:00.000Z",   // ISO-8601 UTC
  "domain":          "rezeptbuch.example.org",     // DNS-Domain ohne Schema
  "embeddingModel":  "Xenova/multilingual-e5-small",
  "endpoint":        "https://klaus.github.io/rezeptbuch/",  // Basis-URL mit trailing slash
  "id":              "<base64url-sha256-rawpub>",  // = nodeId
  "nodeType":        "hybrid",                     // "provider" | "seeker" | "hybrid"
  "protocolVersion": "0.1",
  "publicKey":       { "kty": "OKP", "crv": "Ed25519", "x": "<base64url>" },
  "signature":       "<base64url-ed25519-sig>"     // Ed25519 über JSON ohne signature-Feld
}
```

Optionale Felder (wenn vorhanden, gehen sie in die kanonische JSON
ein und sind damit signaturpflichtig):

```jsonc
{
  "nodeName":              "Rezeptbuch Klaus",
  "domainDescription":     "Hausgemachte Kochrezepte, vom Hefeteig bis zur Sauce.",
  "domainKeywords":        ["Backen", "Saucen", "Hauptgang"],
  "domainVector":          [/* 384 floats, optional bei kleinen Spores */],
  "embeddingCapabilities": [/* 384 floats, NEU additiv aus Spec-Sitzung M04-Erweiterung */],
  "embeddingNeeds":        [/* 384 floats, NEU additiv aus Spec-Sitzung M04-Erweiterung */],
  "endpointPaths":         { /* override für INTERFACES.md §3, falls Hoster ohne .well-known */ },
  "stammCategories":       ["Vorspeisen", "Fleisch", "Fisch", "Vegetarisch"],   // Kerngebiet (ARCHITEKTUR.md §8)
  "guestCategories":       ["Begleitgetränke", "Weinkarte"]                     // UI-Label: "Überraschungs-Plus"
}
```

Stamm- und Gast-Kategorien sind reine **String-Listen** — sie werden
beim Sign- und Verify-Pfad unverändert mitgereicht und gehen normal in
die kanonische JSON-Serialisierung ein (Object-Keys werden alphabetisch
sortiert, Array-Elemente bleiben in der vom Knoten geschriebenen
Reihenfolge — die ist Teil der Signatur). Disjunktheit (kein Element
in beiden Listen) ist Hosting-Pflicht des Knotens, **kein**
`verifyForeignSpore`-Abbruch-Grund — Empfänger nehmen die Listen so an,
wie sie kommen.

### M04-Erweiterung: embeddingCapabilities + embeddingNeeds (Brief 03)

Spec-Sitzung M04-Erweiterung (Brief 03 der V1-Sammelspec-Kaskade,
2026-05-19) führt zwei neue optionale Vektor-Felder ein, beide additiv
und beide signaturpflichtig wenn vorhanden — analog zu `domainKeywords`
/ `stammCategories`. **PROTOCOL_VERSION bleibt `"0.1"`** (kein altes
Feld zur Pflicht erhoben, kein Pflicht-Rename).

- **`embeddingCapabilities`** ist der **kanonische Name** für den
  Anbieter-Vektor („was kann dieser Knoten anbieten") und semantisch
  identisch zu `domainVector`. Eine Spore darf `domainVector` ODER
  `embeddingCapabilities` ODER **beide** tragen. Falls beide vorhanden
  sind, **sollen** sie wertgleich sein — `verifyForeignSpore` prüft
  das **nicht**, weil die Signatur die ganze JSON-Form deckt und ein
  Mismatch nur den Aufbau-Pfad des Senders beträfe (additiver Übergangs-
  Pfad: neue PWAs dürfen weiterhin `domainVector` schreiben oder auf
  `embeddingCapabilities` migrieren, gemischte Sporen sind erlaubt).
  Consumer (Modul 04 `match` / `matchDimensions`, Modul 05
  `verifyForeignSpore`-Empfänger) lesen bevorzugt
  `embeddingCapabilities`, sonst `domainVector`, sonst „kein
  Anbieter-Vektor verfügbar" — derselbe Fail-soft-Pfad wie heute.

- **`embeddingNeeds`** ist das **neue Sucher-Vektor-Feld** („was sucht
  dieser Knoten"). Ohne `embeddingNeeds` ist der Knoten im **„nur
  Anbieter-Modus"** — Modul 04 `matchDimensions` liefert dann
  `availableLanes:0` und alle Schicht-Scores als `null` (siehe
  INTERFACES.md §1 Modul 04 § Drei-Schichten-Modell § Nur-Anbieter-
  Modus). Der Aufrufer fällt in dem Fall auf die einseitige Auswertung
  über `match(domainVectorA, domainVectorB)` zurück, exakt wie heute.

#### Migrations-Pfad (Aufrufer-Seite)

| Knoten-Zustand | `domainVector` | `embeddingCapabilities` | `embeddingNeeds` | matchDimensions-Verhalten |
|---|---|---|---|---|
| Alt-Spore (vor Brief 03) | ✓ vorhanden | — fehlt | — fehlt | Nur-Anbieter-Modus auf beiden Seiten → `availableLanes:0` → Aufrufer nutzt `match(…)` wie bisher (kein Funktionalitäts-Rückschritt) |
| Neu-Spore Anbieter-only | — fehlt | ✓ vorhanden | — fehlt | Nur-Anbieter-Modus → `availableLanes:0` → wie oben |
| Neu-Spore voll | optional | ✓ vorhanden | ✓ vorhanden | Bidirektional → `availableLanes:1` oder `2` je nach Gegen-Spore |
| Übergangs-Spore | ✓ vorhanden | ✓ vorhanden (wertgleich) | optional | wie Neu-Spore — Consumer liest `embeddingCapabilities` bevorzugt |

**Empfehlung an die Bau-Sitzung 02 (Folge-Bau, Brief 03 spezifiziert
nur — kein Code-Eingriff in dieser Sitzung):** `generateOwnSpore` muss
die `generateOwnSpore`-**Allow-List** im `unsigned`-Bauplan um zwei
Zeilen erweitern, analog zu `stammCategories` / `guestCategories`
(Bau-Sitzung Stamm/Gast 2026-05-15-Lehre):

```
// nach der domainVector-Zeile, vor endpointPaths:
if (Array.isArray(meta.embeddingCapabilities) || meta.embeddingCapabilities instanceof Float32Array) {
  unsigned.embeddingCapabilities = Array.from(meta.embeddingCapabilities);
}
if (Array.isArray(meta.embeddingNeeds) || meta.embeddingNeeds instanceof Float32Array) {
  unsigned.embeddingNeeds = Array.from(meta.embeddingNeeds);
}
```

Ohne diese Allow-List-Erweiterung würden die beiden neuen Felder
beim `generateOwnSpore`-Aufruf still ignoriert (wie es bei
`stammCategories` vor der 2026-05-15-Bau-Pflege passiert war).
**Validierung** in `validateSporeMeta` bleibt **unverändert** — die
Felder sind optional, non-Array-Werte werden stillschweigend
ignoriert (gleiche Konvention wie `domainKeywords`). Form-Validierung
(`Length === 384`, alle Elemente Zahlen) ist Aufrufer-Pflicht (das
ist die Konvention für alle Vektor-Felder seit Spec-Sitzung 02).

#### Bezugs-Verweise

- **Vision-Anker 9** (M04-Erweiterung — drei Schichten + Brücke +
  doppelte Spore), PULS § Vision-Anker. Brief 03 realisiert den
  Strang 2 dieses Ankers.
- **Vision-Anker 6** (Multi-Identität in der IndexedDB), PULS §
  Vision-Anker. **Brief 04 (Multi-Identität, 2026-05-19) liefert die
  Persona-Mehrfachheit** — siehe Sub-Block „Multi-Identität (Brief 04)"
  weiter unten. Pro Identitäts-Slot in `sbkim_keys[key]` existiert ein
  entsprechender Eintrag in `sbkim_spore[key]` mit eigenen
  `embeddingCapabilities` + `embeddingNeeds`. `generateOwnSpore(meta,
  key)` schreibt in den passenden Slot (Default: aktive Identität).
- **Modul 04** § Drei-Schichten-Modell / § Stufe-B-Vertrag — der
  Consumer-Pfad für die neuen Felder, mit `MatchDimensionsResult`
  und `ExplainResult` als Rückgaben.
- **Modul 06** § Brücken-Vorschlag-Eintrags-Typ (Folge-Spec-Block,
  Brief 03 hat den Verweis hinterlegt) — Outbox-Form für lokale
  Brücken-Empfehlungen.

### Multi-Identität (Brief 04)

Spec-Sitzung Multi-Identität (Brief 04 der V1-Sammelspec-Kaskade,
2026-05-19) erweitert Modul 02 um **mehrere Identitäts-Slots** in
derselben IndexedDB-Instanz. Default-Slot `"main"` bleibt verbindlich
(Rückwärts-Kompat zum Singleton-Vertrag aus Spec-Sitzung 02
2026-05-14); zusätzliche Slots können beliebig viele weitere Schlüssel
tragen (z.B. `"beruflich"`, `"test"`). Die aktive Identität steht in
`sbkim_meta["active-identity"]` und ist Default `"main"`, falls
fehlend. **PROTOCOL_VERSION bleibt `"0.1"`** — alle neuen Schlüssel-
Slots und der `active-identity`-Marker sind lokales Storage-Schema,
keine Spore-Felder. Brief 04 entscheidet sich für **Strategie A** für
die Pages-`spore.json`: nur die zum Push-Zeitpunkt aktive Identität
wird gehostet (Schema unverändert; ein Identitäts-Wechsel = neuer
Spore-Push, alte Empfänger bleiben kompatibel).

Vollständige Multi-Identitäts-Konvention siehe INTERFACES.md § 9
„Identitäts-Map (Multi-Identität, Brief 04)" — verbindliche Spec-Klausel
mit Slot-Schema, identitäts-spezifischen Stores, Receiver-Pfad,
Migrations-Strategie, Trade-off-Klausel und Verbindung zur
M04-Erweiterung.

#### API-Erweiterung (Brief 04)

Fünf neue / erweiterte Funktionen (siehe § Schnittstelle oben für die
vollen Signaturen):

- `getOrCreateIdentity(key?: string)` — Default-Parameter `key="main"`;
  pro Identitäts-Slot ein eigenes Keypair, lazy erzeugt.
- `setActiveIdentity(key: string)` — validiert key, schreibt
  `sbkim_meta["active-identity"]`, ruft `resetIdentityCache()`.
- `getActiveIdentityKey()` — liefert aktiven Slot (Default `"main"`).
- `listIdentities()` — lexikographisch sortierte Slot-Liste.
- `removeIdentity(key, options?)` — idempotent, löscht alle identitäts-
  spezifischen Stores; `force:false` (Default) wirft
  `RemoveActiveIdentityError` bei aktiver Identität; `force:true`
  triggert per-Persona-Apoptose mit Vermächtnis-Versand (Hook in Modul
  07: `_sendLegacyForIdentity`) — Single-Identitäts-Apoptose im Sinne
  von Brief 04 § Trade-off-Klausel.

Plus die bestehenden `generateOwnSpore(meta, key?)` und
`getOwnSpore(key?)` um den optionalen key-Parameter erweitert.

#### Pro-Persona-Spore und M04-Erweiterung

Pro Identitäts-Slot in `sbkim_keys[key]` existiert ein eigener Eintrag
in `sbkim_spore[key]` mit eigenen `embeddingCapabilities` +
`embeddingNeeds` (M04-Erweiterung pro Persona; Brief 03 hat die Felder
spezifiziert, Brief 04 die Mehrfachheit). Match-Pipeline pro Persona:
`SbkimMatch.matchDimensions` (aus Brief 03) konsumiert pro Aufruf die
Vektor-Slots **einer Persona** — Aufrufer wählt. Multi-Persona-Aufrufe
sind keine atomare Operation in Modul 04; wer mehrere Personae matchen
will, ruft `matchDimensions` mehrfach (einmal pro Slot-Paar).

#### Persona-Isolation und identitäts-spezifische Stores

Folgende Stores existieren pro Identitäts-Slot — Schreiber/Leser wie
in INTERFACES.md § 9.2 aufgeführt:

| Store-Basis              | Pattern                              |
|---|---|
| `sbkim_keys`             | Single-Slot-Map mit Schlüssel `<key>` |
| `sbkim_spore`            | Single-Slot-Map mit Schlüssel `<key>` |
| `sbkim_siblings`         | `sbkim_siblings_<key>`               |
| `sbkim_anastomosis_log`  | `sbkim_anastomosis_log_<key>`        |
| `sbkim_legacy_inbox`     | `sbkim_legacy_inbox_<key>`           |
| `sbkim_hetero_inbox`     | `sbkim_hetero_inbox_<key>`           |
| `sbkim_hetero_outbox`    | `sbkim_hetero_outbox_<key>`          |

Persona-Isolation: ein Geschwister gehört einer Persona, nicht dem
ganzen Knoten. Ein Peer, der mit Persona A einen `established`-
Handshake hatte, ist NICHT automatisch Geschwister von Persona B. Wer
Persona-übergreifende Sicht braucht, iteriert `listIdentities()` und
addiert aufrufer-seitig (siehe INTERFACES.md § 9.2 Persona-Isolation).

#### Backup-Strategie (Klaus' „kompletter Rucksack")

Spec-Empfehlung in Brief 04: **`exportBackup` bündelt alle
Identitäten in einem Container** („kompletter Rucksack" — Vision aus
PULS § Vision-Anker 6). Die Bau-Folge-Sitzung 02.Y zieht den Code
nach: additive Schema-Erweiterung `SbkimBackupBlob.payload.identities[]`
(Liste pro Slot mit `keyId` / `privateKey` / `publicKey` / `spore` /
`siblings` / `isActive`-Flag), Klartext nach Decrypt. **`BACKUP_FORMAT_VERSION`
wird in der Bau-Folge-Sitzung von 1 auf 2 gebumpt** — das ist ein
additiver Bump des separaten Backup-Wrapper-Schemas aus § 0; KEIN
`PROTOCOL_VERSION`-Bump (Spore-Schema bleibt unverändert).
`importBackup` muss in der Bau-Folge-Sitzung 02.Y einen Pflicht-
Vor-Check ergänzen (mindestens eine Identität im Container) und pro
Slot die `BackupOverwriteError`-Klausel anwenden (defensiver Schutz
vor versehentlicher Identitäts-Auslöschung — pro Slot, nicht global).

Alternative (NICHT in Brief 04 gewählt): separate Container pro
Identität. Vorteil: einfacheres Schema (BACKUP_FORMAT_VERSION bleibt
1). Nachteil: bricht Klaus' „ein Klick = alle Personae sichern"-
Vision. Brief 04 dokumentiert die Alternative für Folge-Spec-
Sitzungen, wählt sie aber nicht.

#### Migrations-Strategie (Modul-01-Eingriff)

Modul 01 muss die identitäts-spezifischen Stores anlegen können. Zwei
Optionen mit Trade-offs (vollständig in INTERFACES.md § 9.5):

- **Option A (Empfehlung)** — dynamische Store-Erzeugung via
  additivem Helper `SbkimStorage.ensureStore(name)` (Spec-offen für
  die genaue Signatur). Modul 02 ruft `ensureStore(...)` für jeden
  identitäts-spezifischen Store, bevor er beschrieben wird. Bau-
  Folge-Sitzung 01.Y zieht den Pfad nach.
- **Option B** — fest deklarierte Slot-Tabelle (z.B. STORES_V4 mit N
  festen Slots). Einfacherer Versions-Bump v=3 → v=4; aber Slot-
  Anzahl hartcodiert (blockiert Klaus' Vision „beliebig viele
  Personae").

Empfehlung an die Bau-Folge-Sitzung 01.Y: Option A. Klaus entscheidet
beim Andock pro Endknoten, ob er die Multi-Identitäts-Migration
mitmacht.

#### Trade-off-Klausel

1. **IndexedDB-Verlust löscht ALLE Identitäten gleichzeitig.** Anker
   5 (Identitäts-Container) bleibt parallel sinnvoll als Backup-
   Strategie. Brief 04 verweist nur — der Container-Inhalt ist Anker
   5's Spec.
2. **Königin-Relay (Anker 4) muss pro-Identität-Mailboxes verwalten,
   wenn Modul 13 gebaut wird.** Brief 04 verankert die Konvention —
   das *Wie* ist Anker 4's Spec-Sitzung.
3. **Verwirrungs-Risiko in der UI:** welche Identität ist gerade
   aktiv? Eine Folge-Bau-Sitzung Sage-Page-Refactor (BRIEF_99-Liste)
   muss einen Identitäts-Wechsler in einer Karte sichtbar machen —
   Brief 04 spezifiziert den Wechsler-UX NICHT.

#### Bezugs-Verweise

- **Vision-Anker 6 (Multi-Identität — Haupt-Anker, Brief 04
  realisiert).** PULS § Vision-Anker 6 § Status wird in der Brief-04-
  Sitzung auf „Strang 3 der V1-Sammelspec realisiert" nachgezogen.
- **Vision-Anker 9 (M04-Erweiterung — doppelte Spore PRO PERSONA).**
  Brief 04 spiegelt die Felder pro Identitäts-Slot.
- **Vision-Anker 4 (Königin-Relay — pro-Identität-Mailboxes).** Brief
  04 verankert die Pflicht; Anker 4's Spec entscheidet die Form.
- **Vision-Anker 5 (Identitäts-Container — Backup-Strategie).** Brief
  04 verweist; Anker 5's Spec entscheidet das Container-Schema.
- **INTERFACES.md § 9 Identitäts-Map** — vollständige verbindliche
  Spec-Klausel.

Unbekannte zusätzliche Felder werden bei `verifyForeignSpore`
**nicht** abgewiesen, sind aber Teil der Signatur (jeder Knoten
signiert das, was er ausliefert). Versionierungs-Regel: siehe
[INTERFACES.md §4](../INTERFACES.md). Bei Wechsel der Hauptversion
(`protocolVersion: "1.x"` ↔ `"2.x"`) sind die Spores inkompatibel.

### Kanonische Serialisierung (für Signatur und Verify)

```
1. Spore-Objekt ohne signature-Feld bauen.
2. JSON.stringify mit sortierten Object-Keys (rekursiv, lexikographisch).
3. UTF-8 → Uint8Array.
4. crypto.subtle.sign({name:"Ed25519"}, privateKey, bytes)
5. base64url ohne Padding → spore.signature
```

Verify-Pfad ist die Umkehrung: signature wegnehmen, dieselbe
kanonische Form bilden, mit dem in `spore.publicKey` gelieferten Key
verifizieren. Reihenfolge ist verbindlich, weil JSON-Stringify ohne
Sortierung Implementierungs-abhängig ist und die Signatur sonst
brechen würde.

### Datenformat: Backup-Format (SbkimBackupBlob)

Verbindliches Schema für `exportBackup` / `importBackup`, festgelegt
in der Spec-Sitzung Backup-Export Stufe 2 (2026-05-16). Wrapper-Form
mit getrennten `kdf`- / `cipher`- / `ciphertext`-Schichten; der
Klartext-Payload (vor Verschlüsselung) ist in einem eigenen
`payload-schema-version`-Feld versioniert (additiv, lessons-learned-
Pfad — siehe § Risiken „Backup-Aktualität").

```jsonc
{
  "version":               2,                    // = BACKUP_FORMAT_VERSION (§0)
                                                  // Hauptversion. Modul 02 versteht
                                                  // version 1 (alte Singleton-Backups, Bau 02.X)
                                                  // UND version 2 (Multi-Identitäts-Backups,
                                                  // Bau 02.Y). exportBackup schreibt nur
                                                  // die aktuelle Version 2; alles Andere
                                                  // beim Import → BackupVersionMismatchError.
  "kdf": {
    "algorithm":           "PBKDF2",
    "hash":                "SHA-256",
    "iterations":          600000,              // = BACKUP_KDF_ITERATIONS (§0)
    "salt":                "<base64url-16Bytes>" // crypto.getRandomValues, ohne Padding
  },
  "cipher": {
    "algorithm":           "AES-GCM-256",
    "iv":                  "<base64url-12Bytes>" // crypto.getRandomValues, ohne Padding
  },
  "ciphertext":            "<base64url>",       // AES-GCM-Ausgang (inkl. 16-Byte-Auth-Tag),
                                                  // base64url ohne Padding.
  "payload-schema-version": 2                   // Schema-Version DES KLARTEXT-Inhalts (siehe unten).
                                                  // Additiv versioniert. Modul 02 erlaubt
                                                  // payload-schema-version <= eigene Konstante;
                                                  // höhere Werte werfen BackupSchemaError.
}
```

Der **Klartext-Payload** (Inhalt VOR der AES-GCM-Verschlüsselung) ist
eine kanonisch-JSON-serialisierte UTF-8-Bytefolge (alphabetisch
sortierte Object-Keys, rekursiv — dieselbe Disziplin wie Spore-
Signatur). Schema bei `payload-schema-version: 2` (Bau 02.Y, 2026-05-19;
Multi-Identitäts-Backup „kompletter Rucksack" aus INTERFACES.md § 9.6
Pkt. 2):

```jsonc
{
  "createdAt":       "2026-05-19T07:00:00.000Z",   // ISO-8601 UTC
  "active-identity": "main",                       // Optional. Wenn vorhanden + im identities-Array enthalten,
                                                    // wird er beim Import als sbkim_meta["active-identity"]
                                                    // gesetzt. Fehlt das Feld → Default "main" (oder erster Slot).
  "nodeId":          "<base64url-sha256-rawpub>",  // Aktiver Slot, Plausibilitäts-Anker (konservative
                                                    // Down-Grade-Kompat — alte Bau-02.X-Code-Pfade
                                                    // lesen das Feld direkt).
  "keys": {                                         // Aktiver Slot — konservative Down-Grade-Kompat
                                                    // (alte Bau-02.X-Code-Pfade ohne identities[]-Verständnis
                                                    // können den aktiven Slot wiederherstellen).
    "keyId":      "main",
    "privateKey": { /* JsonWebKey */ },
    "publicKey":  { /* JsonWebKey */ }
  },
  "spore":      { /* SporeJson des aktiven Slots */ },
  "siblings":   [ /* Geschwister des aktiven Slots */ ],
  "identities": [                                   // NEU in Bau 02.Y — Pflicht-Feld bei version: 2.
                                                    //   Array von Objekten je Slot. Pflicht-Vor-Check
                                                    //   in importBackup: identities.length >= 1
                                                    //   (sonst BackupSchemaError).
    {
      "key":      "main",
      "nodeId":   "<base64url-sha256-rawpub des Slots>",   // pro Slot redundant für Identifikation
      "keys": {
        "keyId":      "main",
        "privateKey": { /* JsonWebKey, kty:"OKP", crv:"Ed25519", d:..., x:... */ },
        "publicKey":  { /* JsonWebKey, kty:"OKP", crv:"Ed25519",       x:... */ }
      },
      "spore":    { /* vollständige SporeJson inkl. signature */ },
      "siblings": [
        {
          "nodeId":               "<peerNodeId>",
          "domain":               "...",
          "endpoint":             "...",
          "pubKey":               { /* JsonWebKey */ },
          "since":                "<ISO-8601>",
          "heterokaryosisOptIn":  true             // optional, additiv (Modul 05/06/08)
        }
        // ... weitere Geschwister des Slots, Reihenfolge: nach since aufsteigend
      ]
    }
    // ... weitere Slots (z.B. "beruflich", "test")
  ]
}
```

**Migrations-Hinweis (Bau 02.Y, 2026-05-19):** Alte Backups
(`version: 1`, Bau 02.X 2026-05-16) bleiben über `importBackup`
**weiterhin importierbar**. Der Klartext-Payload trägt dort kein
`identities[]`-Feld — Modul 02 baut intern aus den Top-Level-Feldern
`nodeId` / `keys` / `spore` / `siblings` einen Eintrag mit `key: "main"`
und durchläuft denselben Multi-Identitäts-Import-Pfad. Damit
funktioniert ein Re-Import von Klaus' Mein-Mixarium- /
Mein-Rezeptbuch-Backup vom 2026-05-16 (Bau 02.X) ohne neuen Export.
`exportBackup` schreibt IMMER `version: 2` (Aufwärts-Kompat ist gut,
Aufwärts-Schreiben wäre ein Schritt zurück). Asymmetrie ist verbindlich:
Lesen beider Versionen, Schreiben nur v=2 — siehe § Risiken „Backup-
Schema-Migration v1 → v2 ist asymmetrisch".

**KDF-Pfad (verbindlich):**
```
salt        = crypto.getRandomValues(16 Bytes)
material    = utf8(password)
baseKey     = crypto.subtle.importKey("raw", material, {name:"PBKDF2"}, false, ["deriveKey"])
aesKey      = crypto.subtle.deriveKey(
                { name:"PBKDF2", salt, iterations: BACKUP_KDF_ITERATIONS, hash:"SHA-256" },
                baseKey,
                { name:"AES-GCM", length: 256 },
                false,
                ["encrypt","decrypt"])
```

**Encrypt-Pfad (verbindlich):**
```
iv          = crypto.getRandomValues(12 Bytes)
plaintext   = utf8(canonical-JSON-stringify(payload))
ciphertext  = crypto.subtle.encrypt({name:"AES-GCM", iv}, aesKey, plaintext)
              // crypto.subtle.encrypt liefert Cipher + 128-Bit-Auth-Tag in einem ArrayBuffer
blob.ciphertext = base64url(ciphertext) ohne Padding
```

**Decrypt-Pfad ist die Umkehrung.** Falsches Passwort schlägt am
AES-GCM-Auth-Tag fehl — die Implementierung fängt das, klassifiziert
es als `BackupDecryptError` (deutschsprachige Message „Falsches
Passwort oder korruptes Backup") und löst die Promise NICHT mit
`{restored:false}`, sondern als rejected.

### Storage

Stores: `sbkim_keys` (Schlüssel `"main"` oder weitere Slot-Keys, Wert
`{ keyId, privateKey: JsonWebKey, publicKey: JsonWebKey }`) und
`sbkim_spore` (Schlüssel analog, Wert `{ nodeId, sporeJson, signature }`,
wobei `sporeJson` das vollständige Spore-Objekt inkl. Signatur ist —
das `signature`-Feld auf der Wrapper-Ebene wird redundant gehalten,
damit Modul 05 ohne Re-Parse darauf zugreifen kann). JWK ist
strukturell-klonbar, IndexedDB akzeptiert es ohne Wrapper.

#### Identitäts-Slot-Vertrag (Brief 04 / Bau 02.Y)

Mit Bau 02.Y (2026-05-19) ist der Multi-Identitäts-Pfad code-produktiv.
Modul 02 schreibt nicht mehr ausschließlich auf den Default-Slot
`"main"`, sondern auf einen frei wählbaren `<key>`. Identitäts-spezifische
Stores tragen das Pattern `<store-base>_<key>` (siehe INTERFACES.md
§ 9.2) und werden via `SbkimStorage.ensureStore(...)` dynamisch
angelegt — Modul 01 kennt Identität NICHT, der Aufrufer (= Modul 02 in
`getOrCreateIdentity` / `importBackup`) trägt die Konvention.

| Eintrag | Schlüssel-Form | Schreiber | Anmerkung |
|---|---|---|---|
| `sbkim_keys[<key>]` | String-Key (Default `"main"`) | Modul 02 | Pro Identitäts-Slot ein Eintrag |
| `sbkim_spore[<key>]` | String-Key | Modul 02 | Pro Identitäts-Slot ein Eintrag (eigener `embeddingCapabilities`/`embeddingNeeds` aus Brief 03 pro Persona) |
| `sbkim_siblings_<key>` | Store-Name | Modul 05 / 06 / 08 | Pro Persona ein Store, via `ensureStore` angelegt |
| `sbkim_anastomosis_log_<key>` | Store-Name | Modul 05 / 06 | Pro Persona ein Store, via `ensureStore` angelegt |
| `sbkim_legacy_inbox_<key>` | Store-Name | Modul 07 | Pro Persona ein Store, via `ensureStore` angelegt |
| `sbkim_hetero_inbox_<key>` | Store-Name | Modul 06 | Pro Persona ein Store, via `ensureStore` angelegt |
| `sbkim_hetero_outbox_<key>` | Store-Name | Modul 08 | Pro Persona ein Store, via `ensureStore` angelegt |
| `sbkim_meta["active-identity"]` | Marker-Key | Modul 02 (alleinig) | String, Default `"main"` falls fehlend |

Modul 02 ruft `SbkimStorage.ensureStore("sbkim_siblings_<key>")` etc.
für alle fünf identitäts-spezifischen Store-Basen PRO Persona-Slot,
BEVOR ein Schreibvorgang in einen davon stattfindet. Die Aufrufe
passieren in `getOrCreateIdentity(key)` (für neue Slots) und in
`importBackup` (für Slots aus dem Backup, die in der aktuellen DB noch
nicht existieren). Idempotenz von `ensureStore` garantiert, dass
parallele oder wiederholte Aufrufe kein Problem sind (siehe Bau-01.Y-
Garantien-Block in Karte 01 / INTERFACES.md § 1 Modul 01).

**`active-identity`-Marker:** `sbkim_meta["active-identity"]` ist ein
lokaler String-Marker (kein Spore-Feld, kein Netz-Transport). Modul 02
ist alleiniger Schreiber (`setActiveIdentity` / `removeIdentity`-force-
Fall). Default `"main"`, falls fehlend — Rückwärts-Kompat zum
Singleton-Vertrag aus Spec-Sitzung 02 (2026-05-14).

**Backup-Inhalt** (Pflicht-Frage 1 Variante b der Spec-Sitzung
Backup-Export Stufe 2): `exportBackup` liest aus drei SBKIM-Stores
und schreibt sie in den Klartext-Payload (oben):

| Store | Modul 02 als | Backup-Inhalt |
|---|---|---|
| `sbkim_keys["main"]` | Leser (eigener Store) | Pflicht — `keys`-Block (privateKey + publicKey JWK + keyId) |
| `sbkim_spore["main"]` | Leser (eigener Store) | Pflicht — `spore`-Block (vollständige SporeJson inkl. Signatur) |
| `sbkim_siblings` | Leser (fremder Store, Schreiber Modul 05) | Fail-soft — `siblings`-Array (alle Einträge, leer wenn Store leer/fehlt). `heterokaryosisOptIn`-Feld bleibt erhalten (additiv, Spec-Sitzung 06/08). |

Bewusst **nicht** im Backup (vgl. § Risiken „Backup-Aktualität"):
`sbkim_anastomosis_log`, `sbkim_legacy_inbox`, `sbkim_hetero_inbox`,
`sbkim_hetero_outbox`, `sbkim_doku_meta`. Vermächtnis-Inbox und Log
sind transient/audit; Heterokaryose-Inbox/Outbox und Doku-Meta
gehören in eigene PWA-Pflege-Pfade (Klaus pflegt sie im Endknoten,
Apoptose räumt sie beim Self-Apoptose auf — Karte 07). Der Backup-
Restore stellt **Identität + Netzwerk-Mitgliedschaft** wieder her, nicht
die Anker-Vorräte oder Aktivitäts-Spuren.

`importBackup` schreibt nach erfolgreichem Decrypt + Schema-Check
genau diese drei Stores zurück (sbkim_keys["main"] + sbkim_spore["main"]
overwrite; sbkim_siblings put-pro-Eintrag, additiv — bestehende
Sibling-Einträge mit gleicher nodeId werden überschrieben, andere
bleiben). Modul 02 ruft anschließend einmal `resetIdentityCache()`,
damit der nächste `getNodeId`-Aufruf die frisch geschriebene Identität
liefert, nicht den alten Cache.

### Konfigurationswerte

Backup-spezifische Konstanten (Spec-Sitzung Backup-Export Stufe 2,
2026-05-16). Gespiegelt in `INTERFACES.md §0`; Modul 02 liest sie
beim Skript-Laden.

| Konstante | Wert | Bedeutung |
|---|---|---|
| `BACKUP_FORMAT_VERSION` | `2` | Hauptversion des Wrapper-Schemas (`SbkimBackupBlob.version`). Eigene additive Versionierung, getrennt von `PROTOCOL_VERSION` und `DB_VERSION`. Bau 02.Y 2026-05-19 bumpt von 1 auf 2. Modul 02 LIEST sowohl 1 als auch 2 (Liste `BACKUP_FORMAT_VERSION_READ_OK = [1, 2]`); SCHREIBT IMMER den aktuellen Wert. Höhere unbekannte Werte beim Import → `BackupVersionMismatchError`. |
| `BACKUP_KDF_ITERATIONS` | `600000` | PBKDF2-Iterations für die Schlüssel-Ableitung. OWASP-Empfehlung 2023+ für PBKDF2-SHA256 (Pflicht-Frage 2 Variante b). Aufruf-Zeit auf low-end Android ~1–2 s, auf Desktop < 0,5 s. |
| `BACKUP_PASSWORD_MIN_LEN` | `8` | Mindest-Länge des Passwort-Strings. Untere Validierungs-Schwelle — keine Entropie-Schätzung, keine Komplexitäts-Pflicht. Aufrufer-Pflicht, etwas Sinnvolles zu wählen. |
| `BACKUP_PAYLOAD_SCHEMA_VERSION` | `2` | Schema-Version des Klartext-Payloads. Additiv versioniert. Bau 02.Y 2026-05-19 bumpt von 1 auf 2 (neues Pflicht-Feld `identities[]`). Modul 02 erlaubt Import von `<= BACKUP_PAYLOAD_SCHEMA_VERSION`; höhere Werte → `BackupSchemaError`. v=1-Payloads werden intern in einen einzigen `identities[]`-Eintrag migriert (Rückwärts-Kompat zum Bau-02.X-Format). |
| `BACKUP_KDF_SALT_BYTES` | `16` | Salt-Länge für PBKDF2 (Konvention). |
| `BACKUP_CIPHER_IV_BYTES` | `12` | IV-Länge für AES-GCM (Standard 96 bit). |

`BACKUP_FORMAT_VERSION`, `BACKUP_KDF_ITERATIONS` und
`BACKUP_PASSWORD_MIN_LEN` sind in §0 verankert (Querschnitts-
Konstanten, falls Modul 12 Blocklist später ein eigenes Backup-Format
spezifiziert). Die salt-/iv-Längen-Konventionen sind modul-lokal
(WebCrypto-Standard, nicht §0-würdig).

---

## Fehlerverhalten

| Lage | Reaktion |
|---|---|
| WebCrypto fehlt oder unterstützt Ed25519 nicht (sehr alte Safari) | `init()` rejects mit `CryptoUnavailableError`, deutschsprachige Message. Endknoten-PWA bleibt lauffähig, SBKIM-Funktionen sind dann deaktiviert. **Kein Polyfill.** |
| Storage nicht verfügbar (Inkognito) | `init()` reicht den `StorageUnavailableError` aus Modul 01 unverändert durch. |
| `getNodeId` / `getPublicKeyJwk` ohne vorherige Identität | wirft `NoIdentityError` mit Hinweis „erst `getOrCreateIdentity()` aufrufen". |
| `generateOwnSpore` mit fehlendem Pflichtfeld in `meta` (`domain`, `nodeType`, `endpoint`) | wirft `InvalidSporeMetaError` mit Liste der fehlenden Felder. |
| `generateOwnSpore` mit ungültigem `nodeType` (≠ provider/seeker/hybrid) | wirft `InvalidSporeMetaError`. |
| `verifyForeignSpore`: fehlendes Pflichtfeld in der fremden Spore | `{ valid: false, reason: "Pflichtfeld fehlt: <name>" }` |
| `verifyForeignSpore`: `id` ≠ `base64url(sha256(rawPub))` | `{ valid: false, reason: "nodeId stimmt nicht zum Public Key" }` |
| `verifyForeignSpore`: Signatur falsch oder Spore manipuliert | `{ valid: false, reason: "Signatur ungültig" }` |
| `verifyForeignSpore`: protocolVersion-Hauptversion ≠ unsere | `{ valid: false, reason: "Inkompatible Hauptversion: <x.y>" }` |
| `exportBackup` / `importBackup` mit Passwort kürzer als `BACKUP_PASSWORD_MIN_LEN` (8) oder leerem String | wirft `InvalidBackupPasswordError` synchron, deutschsprachige Message. Kein Crypto-Aufruf. |
| `importBackup`: AES-GCM-Auth-Tag schlägt fehl (falsches Passwort) oder Blob-Form ist korrupt (kein valides base64url, Längen falsch, JSON-Parse scheitert auf dem Klartext) | rejected mit `BackupDecryptError`. Eine Sammel-Klasse — Modul 02 verrät bewusst nicht, ob Passwort falsch oder Datei beschädigt (kein Oracle für Angreifer). |
| `importBackup`: `blob.version` ≠ `BACKUP_FORMAT_VERSION` | rejected mit `BackupVersionMismatchError`. Wrapper-Hauptversion mismatch; Backup aus zukünftiger oder unbekannter Modul-Version. Kein Decrypt-Versuch. |
| `importBackup`: `blob.payload-schema-version` > `BACKUP_PAYLOAD_SCHEMA_VERSION` (nach erfolgreichem Decrypt), Klartext-Payload-Pflichtfeld fehlt (`nodeId`, `keys.privateKey`, `keys.publicKey`, `spore`), ODER bei `payload-schema-version: 2` ist `payload.identities[]` fehlend/leer | rejected mit `BackupSchemaError`, deutschsprachige Message mit Hinweis, welches Feld fehlt / welche Schema-Version unbekannt ist / „leere identities[]-Liste nach Decrypt" als zusätzlicher Auslöser (Bau 02.Y Pflicht-Vor-Check „mindestens eine Identität im Container"). |
| `importBackup`: bei `version: 2` ist mindestens ein Slot aus `payload.identities[]` bereits in `sbkim_keys[entry.key]` belegt UND `options.force !== true` | rejected mit `BackupOverwriteError` (Pflicht-Frage 3 Variante a, **pro Slot** ab Bau 02.Y). Sammel-Error mit Hinweis auf die kollidierenden Slot-Keys. Kein Decrypt-Versuch für die identifizierten Slots. Aufrufer entscheidet bewusst per `{force:true}`, ob die bestehenden Identitäten ersetzt werden dürfen. Bei `version: 1` bleibt der Pre-Brief-04-Pfad: `sbkim_keys["main"]` bereits belegt + ohne force → `BackupOverwriteError`. |
| `exportBackup`: keine Identität vorhanden | rejected mit `NoIdentityError` aus dem `getOrCreateIdentity`-Pfad (wird unverändert durchgereicht). Aufrufer muss erst `getOrCreateIdentity()` rufen. |
| `setActiveIdentity(key)`: key nicht in `sbkim_keys` | wirft `UnknownIdentityError` (sync nach dem await; kein Storage-Schreibvorgang, aktive Identität bleibt unverändert). |
| `removeIdentity(key, {force:false})`: key === `sbkim_meta["active-identity"]` | wirft `RemoveActiveIdentityError` (kein Storage-Eingriff; Aufrufer muss `{force:true}` setzen oder zuerst die aktive Identität wechseln). |
| `removeIdentity(key)` bei unbekanntem key | KEIN Throw; resolves mit `false` (idempotent, analog `forgetSibling`). |

Alle SBKIM-Fehler sind `Error`-Instanzen mit sprechendem `name` und
deutschsprachigem `message`-Feld. `verifyForeignSpore` wirft niemals —
Verifikations-Probleme kommen als `reason`-String zurück. **Backup-
Fehler werfen** (sind keine `{valid:false}`-Form-Antworten): Backup-
Restore ist eine Identitäts-mutierende Operation, ein stilles
„nichts passiert" ist gefährlicher als ein lauter Fehler.

---

## Manueller Test

In `tests/manual_check.html`, Panel **02 Spore** (seit Bau-Sitzung
2026-05-14 mit echten Aufrufen verdrahtet):

1. **Identität erzeugen oder laden** — `getOrCreateIdentity()`. Erste
   Ausführung erzeugt das Schlüsselpaar; zweite Ausführung lädt
   dasselbe (gleiche `nodeId`). Sichtprüfung: in DevTools →
   Application → IndexedDB → `sbkim` → `sbkim_keys` muss ein Eintrag
   mit Schlüssel `"main"` stehen.
2. **Eigene Spore generieren** — `generateOwnSpore({domain, nodeType, endpoint})`
   mit Beispiel-Werten. Erwartung: vollständiges Spore-Objekt mit
   Signatur. Sichtprüfung: `sbkim_spore["main"]` ist gefüllt.
3. **Sign + Verify round-trip** — `getOwnSpore()` → `verifyForeignSpore(spore)`.
   Erwartung: `{ valid: true }`.
4. **Verify mit fremder Spore** — eine zweite Spore (manuell zusammen-
   gebaut oder aus einer zweiten Identität) prüfen. Erwartung:
   `{ valid: true }` für unmodifizierte; nach Manipulation eines Felds
   `{ valid: false, reason: "Signatur ungültig" }`.
5. **Selbstcheck Konsole prüfen** — Hinweisknopf ohne Aktion: weist
   den Tester an, in der DevTools-Konsole die Zeile
   `MODUL 02 SPORE bereit, Funktionen: ...` zu suchen (erscheint
   beim Laden).
6. **Backup exportieren** — Passwort ≥ 8 Zeichen eingeben.
   Erwartung: `SbkimBackupBlob` mit `version: 1`, `kdf`-Block (PBKDF2/
   SHA-256/600 000/salt-base64url), `cipher`-Block (AES-GCM-256/iv-
   base64url), `ciphertext` (base64url), `payload-schema-version: 1`.
   Download-Link erscheint unter den Knöpfen mit Datei-Name
   `sbkim-backup-YYYY-MM-DD.json`. Mit zu kurzem Passwort
   (< 8 Zeichen) oder leerem Eingabefeld: synchron
   `InvalidBackupPasswordError`, kein Crypto-Aufruf.
7. **Backup einlesen** — Test-Backup aus Punkt 6 in derselben PWA
   wieder einlesen. Erwartung ohne `force`: `BackupOverwriteError`
   (bestehende Identität); im Panel erscheint die Warnzeile mit alter
   nodeId und der Bestätigungs-Knopf „Identität ersetzen —
   unwiderruflich" wird scharfgeschaltet. Klick auf den zweiten Knopf:
   `{restored: true}`, danach `getNodeId()` liefert dieselbe nodeId wie
   vor dem Export (Singleton-Wiederherstellung). Falsches Passwort:
   `BackupDecryptError`. Modifizierte Backup-Datei (irgendein Zeichen
   im `ciphertext` umgetippt): `BackupDecryptError`. Wrapper-Version-
   Feld auf `99` umgetippt: `BackupVersionMismatchError` (sync, kein
   Decrypt-Versuch); Wrapper-Version `1` bleibt **importierbar**
   (Rückwärts-Kompat ab Bau 02.Y).
8. **Identität anlegen + wechseln (Bau 02.Y, 2026-05-19)** —
   Sequenz `getOrCreateIdentity('test')` → `listIdentities()` →
   `setActiveIdentity('test')` → `getActiveIdentityKey()` →
   `getNodeId()`. Erwartung: vor dem Wechsel liefert `getNodeId()` die
   main-nodeId; `listIdentities()` zeigt `["main", "test"]`
   (lexikographisch sortiert); nach dem Wechsel liefert
   `getActiveIdentityKey()` `"test"` und `getNodeId()` eine andere
   nodeId. Sichtprüfung: DevTools → Application → IndexedDB → es
   existieren die fünf identitäts-spezifischen Stores
   `sbkim_siblings_test` / `sbkim_anastomosis_log_test` /
   `sbkim_legacy_inbox_test` / `sbkim_hetero_inbox_test` /
   `sbkim_hetero_outbox_test` (jeweils leer).
9. **Identität entfernen (force) (Bau 02.Y)** —
   `removeIdentity('test', {force:true})`. Erwartung: vor dem Aufruf
   `active-identity === "test"`; nach dem Aufruf `active-identity ===
   "main"` (Fallback auf main, weil `sbkim_keys["main"]` existiert);
   `getNodeId()` liefert wieder die main-nodeId. Rückgabe: `true`.
   Aufruf bei unbekanntem key (z.B. erneuter `removeIdentity('test',
   {force:true})`): Rückgabe `false`, kein Throw. Aufruf ohne force
   auf aktive Identität: `RemoveActiveIdentityError`.
10. **Backup mit Multi-Identität (Bau 02.Y)** — Setup: Identität
    `"test"` mit Knopf 8 anlegen. Dann `exportBackup` triggern.
    Erwartung: Wrapper-`version: 2`, `payload-schema-version: 2`,
    `payload.identities[]` mit zwei Einträgen (Slot-Keys `"main"` und
    `"test"`, beide nodeIds), `payload["active-identity"]`-Feld passend
    zum aktiven Slot. Import-Probe (in einer leeren Browser-Profil-
    Instanz oder nach `removeIdentity('test',{force:true})` +
    `removeIdentity('main',{force:true})` mit anschließendem Re-Import):
    beide Slots werden wieder angelegt, `listIdentities()` zeigt erneut
    `["main", "test"]`. Cleanup-Hinweis: Test-Slot wird mit Knopf 9
    gelöscht (sbkim_keys-Eintrag + Spore-Eintrag + alle fünf
    identitäts-spezifischen Stores werden via `clear` geleert); die
    identitäts-spezifischen Stores `*_test` bleiben jedoch als **leere
    Stores** in der IndexedDB stehen (Modul 01 bietet keinen
    `dropStore`-Pfad — siehe § Risiken „Backup-Schema-Migration"-
    Hinweis; manueller Cleanup über DevTools nötig, falls eine
    saubere DB gewünscht ist).

Bewertung manuell durch den Tester. Ergebnis kommt in den Bauzustand-
Block dieser Karte (Zeile „Sichttest").

---

## Risiken & offene Punkte

- **WebCrypto-Ed25519:** in modernen Browsern (Chrome ≥ 113, Firefox
  ≥ 130, Safari ≥ 17) verfügbar. Ältere Safari-Versionen liefern
  einen Fehler beim `generateKey({name:"Ed25519"})`. Modul 02
  scheitert dann laut mit `CryptoUnavailableError` — kein
  Software-Fallback. Die Endknoten-PWA bleibt lauffähig, SBKIM ist
  deaktiviert.
- **Schlüsselverlust = Knotentod:** Browser-Storage kann jederzeit
  geräumt werden (manuell, durch Speicherdruck, durch Inkognito).
  Wer den Schlüssel verliert, beginnt mit einer neuen Identität —
  das ist Spec-Wille, nicht Bug. Im UI von Modul 09 (Einbau-PWA)
  wird das dem Betreiber explizit kommuniziert.
- **Signatur-Stabilität:** kanonische Serialisierung mit sortierten
  Keys ist die einzige Garantie, dass dieselbe Spore zwischen
  Browsern dieselbe Signatur ergibt. Implementierung muss `JSON.stringify`
  mit explizitem `replacer` oder einer Sort-Routine bauen — niemals
  auf die Engine-Default-Reihenfolge vertrauen.
- **Personenbezug:** die Spore enthält keine personenbezogenen Daten
  (keine E-Mail, kein Name, keine IP). `nodeName` ist optional und
  vom Betreiber frei wählbar (typisch ein App-Name wie „Rezeptbuch",
  nicht „Klaus Müller").
- **Private Key in IndexedDB:** der private Key liegt unverschlüsselt
  in IndexedDB. Das ist ein bewusster Trade-off: ohne lokalen
  Hauptschlüssel wäre eine Verschlüsselung Augenwischerei
  („wo bewahre ich den Schlüssel zum Schlüssel auf?"). Wer ein
  härteres Bedrohungsmodell will, braucht eine andere App.
- **Domainwechsel:** ergibt eine neue Spore (neuer `endpoint`,
  potentiell neue `domain`), aber **dieselbe** Identität (gleicher
  `nodeId`). Verfahren: `generateOwnSpore` mit neuen Meta-Werten
  aufrufen; Modul 09 beschreibt den Re-Deploy.
- **Spore-Format-Drift:** sobald Modul 05 die Spore über das Netz
  empfängt, ist jede Format-Änderung ein Versions-Bruch. Pflichtfelder
  dürfen ab Status `entwurf` nur noch additiv erweitert werden —
  Streichungen brauchen einen Hauptversions-Sprung
  (`protocolVersion: "1.x"`).
- **Passwort-Schwäche (Backup-Export):** das Backup-Passwort kommt
  vom Aufrufer (Klaus, im Endknoten-UI). Modul 02 validiert
  **ausschliesslich** die Mindest-Länge (`BACKUP_PASSWORD_MIN_LEN = 8`,
  §0). Kein Entropie-Check, keine Wörterbuch-Prüfung, keine
  Komplexitäts-Pflicht. Begründung: Selbst-Heilung über einen
  hartcodierten Schlüssel ist ausgeschlossen (PULS § Offene
  Querschnitts-Fragen „Identitäts-Persistenz" Stufe 2 — jeder
  Repo-Forker hätte die Identität); ein Komplexitäts-Theater am
  Validator gibt eine Scheinsicherheit, die der echte Schutz —
  PBKDF2 mit `BACKUP_KDF_ITERATIONS = 600 000` Iterationen
  (Pflicht-Frage 2 Variante b, OWASP 2023+) — nicht braucht.
  Aufrufer-Pflicht, ein sinnvolles Passwort zu wählen; Klaus' Risiko,
  wenn er ein schlechtes wählt.
- **Sicherheits-Schwelle bei Import-Überschreibung
  (`BackupOverwriteError`):** `importBackup` wirft per Default
  (Pflicht-Frage 3 Variante a), wenn `sbkim_keys["main"]` bereits
  belegt ist. Aufrufer setzt `{force: true}`, um eine bestehende
  Identität bewusst zu ersetzen. Begründung: Identitäts-
  Überschreibung wechselt die `nodeId` der laufenden PWA. Geschwister,
  die die alte `nodeId` kennen, behandeln den Knoten ab dann als
  unbekannt (Apoptose-Pfad statt Reentry — siehe Karte 07 § TTL-
  Sweep). Ein versehentlicher Import (falsche Datei, falsches
  Geschwister) tötet den laufenden Knoten ohne Vermächtnis — das
  ist destruktiver als Self-Apoptose. Recovery-Pfad nach
  Browserspeicher-Löschen funktioniert trotzdem **ohne** `force`,
  weil dort die Identität fehlt; nur bei aktiver Identität greift
  die Schwelle.
- **Backup-Aktualität:** ein Backup ist eine Snapshot-Datei; je
  älter, desto stärker driftet sie vom aktuellen Knoten-Zustand ab.
  `siblings`-Block veraltet schneller als `keys`/`spore` (neue
  Geschwister kommen, alte gehen). Restore eines alten Backups stellt
  ältere Geschwister-Liste wieder her — Modul 06/07-Pfade (Apoptose-
  TTL, Anastomose-Reentry) korrigieren das selbständig im laufenden
  Betrieb. **Keine** Backup-Aktualität-Erzwingung durch das Modul;
  Klaus wird im Doku-Fenster (Modul 00) über die Stufe-3-
  Quota-Frühwarnung indirekt erinnert, dass ein neues Backup fällig
  ist. Heterokaryose-Anker, Vermächtnis-Inbox, Logs sind bewusst
  **nicht** im Backup (siehe § Storage „Backup-Inhalt") — der
  Backup-Inhalt ist auf das beschränkt, was ohne Backup nicht
  selbst-heilen kann (= Identität + Sibling-Mitgliedschaft).
- **Mid-Operation-Identitäts-Wechsel nicht spezifiziert (Bau 02.Y):**
  ein Aufrufer, der mitten in einem laufenden Handshake /
  Heterokaryosis-Pull / Legacy-Versand `setActiveIdentity` ruft, bekommt
  undefiniertes Verhalten. INTERFACES.md § 9.3 hat das als bewusste
  Spec-Lücke benannt — eine Folge-Spec-Sitzung darf einen aktiven Hook
  nachreichen (z.B. CustomEvent `sbkim:active-identity-changed`); Bau
  02.Y liefert ihn **NICHT**. Bis dahin gilt die Lese-Konvention:
  Modul 05 / 06 / 07 rufen `getActiveIdentityKey()` im `init()`-Pfad und
  cachen den Wert für die Operation; Wechsel-Effekte greifen erst bei
  Folge-Operationen.
- **Backup-Schema-Migration v1 → v2 ist asymmetrisch (Bau 02.Y):**
  `importBackup` LIEST sowohl `version: 1` (alte Bau-02.X-Singleton-
  Backups) als auch `version: 2` (Multi-Identitäts-Backups);
  `exportBackup` SCHREIBT IMMER `version: 2`. Konsequenz: ein Backup
  aus 02.Y-Code kann **nicht** in einem alten 02.X-Code (vor Bau 02.Y)
  importiert werden — das alte Modul kennt nur `BACKUP_FORMAT_VERSION
  === 1`. Klaus' bestehende Mein-Mixarium- / Mein-Rezeptbuch-Backups
  vom 2026-05-16 (alle `version: 1`) bleiben in 02.Y-Code importierbar
  (Rückwärts-Kompat); ein Down-Grade wäre der seltene Pfad. Hinweis im
  Aufrufer-UX (Karte 09 / Andock-Wizard): nach Multi-Identitäts-
  Migration bitte sofort ein neues Backup ziehen, falls die Endknoten
  zwischen Geräten umziehen.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Site-Echo | 2026-05-10 | Site-Echo | Hero, Bio-Metapher, Spore-SVG, Querverweise |
| Spec gefüllt | 2026-05-14 | Spec+Bau 02 | Singleton-Identität, sieben-Funktionen-API, node_id-Ableitung verbindlich, Spore-JSON-Pflichtfelder, kanonische Signatur, Fehlertabelle, manueller Test |
| Code geschrieben | 2026-05-14 | Spec+Bau 02 | `src/modules/02_spore.js`, IIFE mit `window.SbkimSpore`, WebCrypto Ed25519, Persistenz nur über `SbkimStorage`, JS-Syntax via `node --check` grün |
| Sichttest | 2026-05-14 | Spec+Bau 02 | geprüft 2026-05-14 (Klaus, im Browser): Identität deterministisch, Spore vollständig + sortiert, Sign+Verify round-trip valid, Manipulation erkannt. |
| Pflege Cache-Invalidate | 2026-05-15 | Pflege 02+07-Cache-Invalidate | Klaus' Sichttest 2026-05-15 Modul 07 Test 6 ergab `getNodeId_wirft_NoIdentityError:false` trotz `stores_alle_leer:true` — Modul 02's `identityCache` wurde nicht durch externes `storage.clear` invalidiert. **Fix**: neue öffentliche Funktion `resetIdentityCache() → void` (sync, idempotent, leert nur den Closure-Cache, kein Storage-Eingriff); Vertrag in INTERFACES.md §1 Modul 02 Bietet-Block + Selbstcheck-Format-Zeile (sieben Funktionen) + Garantien-Block für 05/06/07 (neuer Punkt „Cache-Konsistenz nach externem Storage-Cleanup"). Modul 07 ruft die Funktion als Schritt 6 nach den fünf `storage.clear`-Aufrufen. **Sauberere Lösung von vier Optionen** — Vertrag-Trennung (Modul 02 kennt keine Apoptose, bietet aber den Hook), performance-neutral (Cache bleibt schnell für Modul 04/05/00), additiv (kein Hauptversions-Sprung). `node --check` grün. status.json unverändert (kein Score-Wechsel). |
| Pflege Stamm/Gast-Durchreichung | 2026-05-15 | Bau 02 Stamm/Gast-Felder | Folge-Bau nach Spec-Sitzung „Stamm/Gast-Felder in Spore-JSON" (2026-05-15): `generateOwnSpore` Allow-List um zwei Zeilen erweitert (analog zu `domainKeywords`): `if (Array.isArray(meta.stammCategories)) unsigned.stammCategories = meta.stammCategories.slice();` + `if (Array.isArray(meta.guestCategories)) unsigned.guestCategories = meta.guestCategories.slice();` direkt nach der `domainVector`-Zeile, vor `endpointPaths`. Damit landen die neuen optionalen Felder aus INTERFACES.md §2 tatsächlich im signierten Spore-JSON, wenn der Aufrufer sie übergibt. **Validierung in `validateSporeMeta` unverändert** — die Felder sind optional, non-Array-Werte werden stillschweigend ignoriert (gleiche Konvention wie `domainKeywords`). **Disjunktheit** (kein Element in beiden Listen) bleibt Hosting-Pflicht des Knotens, kein Modul-02-Eingriff. `node --check src/modules/02_spore.js` grün. `status.json` unverändert (kein Score-Wechsel). |
| Spec Backup-Export Stufe 2 | 2026-05-16 | Spec Backup-Export | Stufe (2) der drei-stufigen Identitäts-Persistenz-Architektur (PULS § Offene Querschnitts-Fragen „Identitäts-Persistenz"). Karte 02 additiv erweitert: § Schnittstelle um `exportBackup(password) → Promise<SbkimBackupBlob>` und `importBackup(blob, password, options?) → Promise<{restored, reason?}>`; Selbstcheck-Funktionsliste um die zwei neuen Namen (zehn Funktionen statt acht); § Datenformat um neuen Sub-Block „Backup-Format (SbkimBackupBlob)" mit Wrapper-Schema (`version`, `kdf`-Block PBKDF2/SHA-256, `cipher`-Block AES-GCM-256, `ciphertext`, `payload-schema-version`) + Klartext-Payload-Schema (nodeId-Anker + `keys` + `spore` + `siblings`-Array) + KDF-/Encrypt-Pfad verbindlich; § Storage um Hinweis-Block „Backup-Inhalt" (drei Stores `sbkim_keys`/`sbkim_spore`/`sbkim_siblings`, fail-soft beim Siblings-Lesen, bewusst nicht im Backup: Log/Inbox/Outbox/Doku-Meta — Pflicht-Frage 1 Variante b); neue § Konfigurationswerte mit sechs Konstanten (drei in §0 verankert: `BACKUP_FORMAT_VERSION=1`, `BACKUP_KDF_ITERATIONS=600000`, `BACKUP_PASSWORD_MIN_LEN=8`; drei modul-lokal: `BACKUP_PAYLOAD_SCHEMA_VERSION=1`, `BACKUP_KDF_SALT_BYTES=16`, `BACKUP_CIPHER_IV_BYTES=12`); § Fehlerverhalten um sechs neue Zeilen (`InvalidBackupPasswordError`, `BackupDecryptError` als Sammel-Klasse ohne Oracle, `BackupVersionMismatchError`, `BackupSchemaError`, `BackupOverwriteError` aus Pflicht-Frage 3 Variante a, `NoIdentityError`-Durchreichung); § Risiken um drei neue Punkte (Passwort-Schwäche, Sicherheits-Schwelle Import-Überschreibung, Backup-Aktualität). **INTERFACES.md** §0 um drei Konstanten + §1 Modul 02 (Bietet/Nutzt/Fehlerverhalten/Geprüft) + §2 Spore-JSON Hinweis-Block + §6 Änderungsprotokoll nachgezogen. **`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `3`** (Backup-Format ist eigene additive Versionierung, kein Spore-Feld, kein Storage-Schema-Eingriff). Spec ist additiv; **kein Code in `src/modules/02_spore.js`** — Bau-Sitzung 02.X folgt als eigene Phase. `status.json` unverändert (Modul 02 bleibt `score:"stub"`, Spec-Erweiterung im Karten-Vertrag, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). |
| Code geschrieben (Bau 02.X Backup-Export) | 2026-05-16 | Bau 02.X Backup-Export | Folge-Bau zur Spec-Sitzung (PR #52 gemerged). Fünf Error-Klassen im Factory-Stil analog Modul 00/08 (`InvalidBackupPasswordError`, `BackupDecryptError` Sammel-Klasse ohne Oracle, `BackupVersionMismatchError`, `BackupSchemaError`, `BackupOverwriteError`); drei §0-Konstanten modul-lokal gespiegelt (`BACKUP_FORMAT_VERSION=1` / `BACKUP_KDF_ITERATIONS=600000` / `BACKUP_PASSWORD_MIN_LEN=8`) + drei modul-lokale Konstanten (`BACKUP_PAYLOAD_SCHEMA_VERSION=1` / `BACKUP_KDF_SALT_BYTES=16` / `BACKUP_CIPHER_IV_BYTES=12`); neuer Closure-Helper `derivePbkdf2AesGcmKey(password, salt, iterations)` (PBKDF2-SHA-256 → AES-GCM-256, beide non-extractable). **Helper-Reuse:** bestehender `canonicalJsonBytes`/`canonicalize`-Pfad aus dem Spore-Sign-Block + bestehender `base64urlEncode`/`base64urlDecode` werden für die Backup-Schicht wiederverwendet (kein Refactoring nötig — die kanonische Sort-Disziplin ist Vertrag, zweite Implementierung wäre Drift-Risiko). `exportBackup(password)` liest sbkim_keys["main"] + sbkim_spore["main"] direkt aus dem Storage (Roh-JWK), liest sbkim_siblings fail-soft via try/catch, baut den Klartext-Payload mit `createdAt`/`keys`/`nodeId`/`siblings`/`spore`, verschlüsselt mit PBKDF2 + AES-GCM-256 und liefert den Wrapper-Blob. `importBackup(blob, password, options?)` macht alle Vor-Checks (Mindest-Länge, Wrapper-Version, Force-Schwelle) VOR dem teuren Crypto-Aufruf; `iterations` wird aus `blob.kdf.iterations` gelesen (NICHT aus §0 — Spec-Sitzung Pflicht-Frage 2 „Hinweis zur Kompatibilität"); Decrypt + JSON-Parse in einem try/catch-Block sammelt auf `BackupDecryptError` (Sammel-Klasse ohne Oracle); Schema-Check (payload-schema-version + Pflichtfelder `nodeId`/`keys.privateKey`/`keys.publicKey`/`spore`) wirft `BackupSchemaError` mit konkret-feld-Hinweis; Sibling-Loop additiv (put pro Eintrag, key=nodeId). Letzter Schritt: `resetIdentityCache()` (Pflicht-Hook aus Pflege 2026-05-15). Selbstcheck-Zeile auf zehn Funktionen erweitert. **`_meta`** um vier Backup-Werte ergänzt (Format-Version, Iterations, Min-Len, Payload-Schema-Version). **Panel 02** in `tests/manual_check.html` um drei Knöpfe erweitert: „Backup exportieren" (Knopf 6 — Passwort-Prompt + Blob-Log + Download-Link `sbkim-backup-YYYY-MM-DD.json`), „Backup einlesen" (Knopf 7 — File-Picker + Passwort, erster Versuch ohne force, bei BackupOverwriteError Bestätigungs-Zeile mit alter nodeId), „Identität ersetzen — unwiderruflich" (Knopf 7b — force-Pfad, scharf nur wenn pendingBackup gesetzt). **Modul 00 / 01 / 03 / 04 / 05 / 06 / 07 / 08 unangetastet** (sbkim_siblings nur gelesen/geschrieben, kein Storage-Schema-Eingriff). **`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `3`** (Backup ist Aufrufer-extern, kein Store). `node --check src/modules/02_spore.js` grün; alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html` syntaktisch validiert. **status.json unverändert** (Modul 02 bleibt `score:"stub"`, additive Code-Erweiterung, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). |
| Sichttest (Bau 02.X) | 2026-05-16 | Bau 02.X Backup-Export | geprüft 2026-05-16 (Klaus, Chrome auf Galaxy Tab S6 + DeX): alle drei neuen Knöpfe grün — Knopf 6 (Backup exportieren) liefert valides Wrapper-Format `version:1`, `iterations:600000`, AES-GCM-256, `payload-schema-version:1`; Knopf 7 (Backup einlesen) ohne force → `BackupOverwriteError` mit korrekter Warnzeile + Status-Chip „Bestehende Identität" (Schutz-Pfad, erwartet); Knopf 7b (Identität ersetzen — unwiderruflich) funktioniert im normalen Pfad. Klaus hat parallel die Panels 01–08 in `tests/manual_check.html` grob durchgeklickt — alle Selbstchecks und Hauptpfade grün („die anderen 01–08 getestet, die waren alle OK"). **Test-Panel-UX-Befund** (kein Modul-Bug): der pendingBackup-Stash in Panel 02 Knopf 7 wurde beim zweiten Klick auf „Backup einlesen" überschrieben (`pendingBackup = null` direkt am Anfang des Handlers) — wenn Klaus zweimal auf Knopf 7 klickt ohne im File-Picker eine Datei zu wählen, ging der Stash verloren und Knopf 7b zeigte „Kein Backup zum Ersetzen vorgemerkt". **Modul-Vertrag unangetastet.** **In Folge-Mini-Pflege 2026-05-16 (Test-Panel-UX) gefixt:** Reset-Zeile aus dem Handler-Anfang entfernt, `pendingBackup = null` erst direkt vor dem `importBackup`-Aufruf (nach erfolgreicher File-Wahl) gesetzt — File-Picker-Cancel löst damit keine State-Änderung mehr aus, gestashter Stash aus dem vorherigen `BackupOverwriteError`-Lauf überlebt einen zweiten Knopf-7-Klick mit Picker-Cancel. Bestehende Pfade unverändert (Erfolgsfall null / `BackupOverwriteError`-Pfad füllt Stash / 7b-force-Pfad), `node --check` aller 10 Inline-Script-Blöcke grün. Sichttest des Fix-Pfads ungeprüft, weil headless gebaut — wartet auf Klaus' Browser-Lauf. |
| Spec M04-Erweiterung (Brief 03) | 2026-05-19 | Spec M04-Erweiterung | Strang 2 der V1-Sammelspec-Kaskade (Brief 03; Brief 01-PR #96 + Brief 02-PR #97 als gemerged vorausgesetzt). Karte 02 additiv erweitert: § Datenformat „Spore-JSON" um zwei neue optionale Felder `embeddingCapabilities` (Alias-Name für `domainVector`, semantisch identisch) und `embeddingNeeds` (neuer Sucher-Vektor) — beide signaturpflichtig wenn vorhanden, beide additiv; neuer Sub-Block „M04-Erweiterung: embeddingCapabilities + embeddingNeeds (Brief 03)" mit Migrations-Tabelle (vier Spore-Zustände: Alt-Spore / Neu-Spore Anbieter-only / Neu-Spore voll / Übergangs-Spore) und Bauzustand-Hinweis für die Bau-Folge-Sitzung (`generateOwnSpore`-Allow-List um zwei Zeilen analog `stammCategories`/`guestCategories`-Pflege 2026-05-15; konkreter Code-Schnipsel als Spec-Vorlage, **KEIN Code-Eingriff** in dieser Spec-Sitzung); Bezugs-Verweise auf Vision-Anker 9 (M04-Haupt-Anker) + Vision-Anker 6 (Multi-Identität — doppelte Spore pro Persona, Brief 04 spezifiziert die Persona-Mehrfachheit) + Modul 04 (Consumer-Pfad) + Modul 06 (Brücken-Vorschlag-Eintrags-Typ). **PROTOCOL_VERSION bleibt `"0.1"`** — beide neuen Felder sind optional, alte Sporen ohne sie bleiben gültig (signalisieren „nur Anbieter-Modus"). **§ Schnittstelle, § Storage, § Fehlerverhalten, § Risiken, § Manueller Test unverändert** (die Felder sind optionale meta-Erweiterungen, kein neuer API-Pfad — Bau-Folge-Sitzung erweitert nur die `generateOwnSpore`-Allow-List und ggf. die Validierung). INTERFACES.md §0 (drei neue Konstanten: `SCHICHT_MIN_MATCH=0.60`, `STUFE_B_DEFAULT_MODEL`, `STUFE_B_MAX_TOKENS`), §1 Modul 02 Bietet-Block-Spore-Schema-Erweiterungs-Hinweis, §2 Spore-JSON Optionale Felder, §9 Änderungsprotokoll (war §7, nachnummeriert weil Brief 03 § 7 + § 8 vor der Changelog einfügt) nachgezogen. **`status.json` unverändert** — Modul 02 bleibt `score:"stub"` (additive Spec-Erweiterung am Karten-Vertrag, kein Code-Bau, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). **Kein Code** in `src/modules/02_spore.js` — Bau-Folge-Sitzung folgt als eigene Phase. |
| Spec Multi-Identität (Brief 04) | 2026-05-19 | Spec Multi-Identität | Strang 3 der V1-Sammelspec-Kaskade (Brief 04; Brief 03-PR #98 als gemerged vorausgesetzt). Karte 02 erweitert: § Schnittstelle um fünf neue / erweiterte Funktionen (`getOrCreateIdentity(key?)`, `setActiveIdentity(key)`, `getActiveIdentityKey()`, `listIdentities()`, `removeIdentity(key, options?)`; `generateOwnSpore(meta, key?)` und `getOwnSpore(key?)` um optionalen key-Parameter erweitert); Selbstcheck-Funktionsliste auf zwölf Funktionen erweitert; § Singleton-Identität durch Identitäts-Slot-Vertrag ersetzt; neuer Sub-Block „Multi-Identität (Brief 04)" mit API-Erweiterung + Pro-Persona-Spore-/M04-Verknüpfung + Persona-Isolation-Stores-Tabelle + Backup-Strategie „kompletter Rucksack" + Migrations-Strategie (Option A dynamische Store-Erzeugung empfohlen, Option B feste Slot-Tabelle als Alternative) + Trade-off-Klausel + Bezugs-Verweise; Bezugs-Verweis im M04-Erweiterungs-Sub-Block aktualisiert (Persona-Mehrfachheit jetzt geliefert). **PROTOCOL_VERSION bleibt `"0.1"`** — alle neuen Schlüssel-Slots und `active-identity`-Marker sind lokales Storage-Schema, keine Spore-Felder. Strategie A für `spore.json` gewählt (nur aktive Identität wird gehostet, Identitäts-Wechsel = neuer Push). **`BACKUP_FORMAT_VERSION`-Bump-Vermerk:** die Bau-Folge-Sitzung 02.Y bumpt das separate Backup-Wrapper-Schema von 1 auf 2 (Identitäten-Array im Payload) — KEIN PROTOCOL_VERSION-Eingriff. **§ Storage, § Fehlerverhalten, § Risiken, § Manueller Test unverändert** (Multi-Identitäts-Funktionen sind additive Erweiterung — Bau-Folge-Sitzung 02.Y zieht Code + Validierung + Sichttest-Punkte nach). INTERFACES.md § 1 Modul 02 (Bietet-Block + Singleton-Klausel + Storage + Selbstcheck + Fehlerverhalten + Garantien), § 1 Modul 05 / 06 / 07 (identitäts-spezifische Slot-Pattern + Receiver-Map), § 2 Spore-JSON (Multi-Identitäts-Hinweis-Block mit Strategie A/B), § 9 Identitäts-Map (neue verbindliche Spec-Klausel mit §9.1 Slot-Schema bis §9.7 M04-Verbindung), § 10 Änderungsprotokoll (war § 9, nachnummeriert) nachgezogen. **`status.json` unverändert** — Modul 02 bleibt `score:"stub"` (additive Spec-Erweiterung am Karten-Vertrag, kein Code-Bau, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). **Kein Code** in `src/modules/02_spore.js` — Bau-Folge-Sitzung 02.Y folgt als eigene Phase (Multi-Identitäts-Migration auf den Endknoten plus Backup-Schema-Bump). |
| Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump | 2026-05-19 | Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump | Zweite Bau-Sitzung der Bau-Sitzungs-Brief-Pipeline aus Brief 99 (Klaus' Wahl 2026-05-19: logische Reihenfolge — Infrastruktur weiter). Direkte Folge auf Bau 01.Y (PR #102 gemerged 2026-05-19, `main` `8a07ed5`). **Code in `src/modules/02_spore.js` additiv** (kein Refactoring der bestehenden 10 + `resetIdentityCache` Funktionen): zwei neue Fehler-Factories (`UnknownIdentityError` sync von `setActiveIdentity`, `RemoveActiveIdentityError` sync von `removeIdentity` ohne force); In-Memory `identityCache` von Singleton auf Map `key → IdentitySnapshot` erweitert (additive Erweiterung, `resetIdentityCache()` leert die ganze Map); neuer Lese-Cache `activeIdentityKeyCache` als sync-Anker für `getActiveIdentityKey`. **`BACKUP_FORMAT_VERSION` modul-lokal 1 → 2**, neue Konstante `BACKUP_FORMAT_VERSION_READ_OK = [1, 2]` (`importBackup` akzeptiert beide; `exportBackup` schreibt nur die aktuelle). **`BACKUP_PAYLOAD_SCHEMA_VERSION` modul-lokal 1 → 2** (Klartext-Payload-Schema-Bump für `payload.identities[]`-Pflicht-Feld). Neuer Closure-Helper `ensureIdentityStores(key)` (Promise.all über fünf identitäts-spezifische Stores via `SbkimStorage.ensureStore("sbkim_<base>_<key>")`). **`getOrCreateIdentity(key)`** erweitert: Default-Slot `"main"`; Cache-Hit pro Slot; bei Cache-Miss + neuer Slot ruft `ensureIdentityStores(key)` VOR dem Schreibvorgang in `sbkim_keys[key]`; Rollback `del("sbkim_keys", key)` bei `EnsureStoreError` (vermeidet halb-angelegte Identitäten). **Neue Funktion `setActiveIdentity(key)`:** sync-TypeError bei nicht-String-key; `UnknownIdentityError`, wenn key nicht in `sbkim_keys`; idempotent (no-op wenn key bereits aktiv); schreibt `sbkim_meta["active-identity"]`; ruft `resetIdentityCache()`. **Neue Funktion `getActiveIdentityKey()`:** Lese-Cache; Default `"main"` bei fehlendem Marker. **Neue Funktion `listIdentities()`:** `SbkimStorage.all(sbkim_keys)` → Array von Slot-Keys, lexikographisch sortiert via `Array.prototype.sort()`. **Neue Funktion `removeIdentity(key, options?)`:** idempotent (`false` bei unbekanntem key, kein Throw); `RemoveActiveIdentityError` bei aktiver Identität + `!force`; force-Pfad ruft fail-soft `SbkimApoptose._sendLegacyForIdentity(key)` (typeof-check, `console.warn` wenn nicht da — Bau 07.Y noch nicht); Lösch-Pfad in INTERFACES-konformer Reihenfolge (`del(sbkim_keys)` → `del(sbkim_spore)` → fünf `clear`-Aufrufe pro identitäts-spezifischem Store, fail-soft via try/catch um `UnknownStoreError`); nach Lösch-Pfad neue aktive Identität setzen (`"main"` falls existent, sonst erster Slot aus `listIdentities()`, sonst `del("sbkim_meta", "active-identity")`); `resetIdentityCache()` am Ende. **`generateOwnSpore(meta, key?)`** und **`getOwnSpore(key?)`** um optionalen key-Parameter erweitert (Default `getActiveIdentityKey()`); `generateOwnSpore` ruft `ensureIdentityStores(key)` als Vorsichts-Pfad (für Slots, die aus Backup-Import stammen). **`exportBackup(password)`** erweitert: iteriert `listIdentities()`, baut `payload.identities[]` mit `{key, nodeId, keys, spore, siblings}` pro Slot (siblings fail-soft via try/catch); schreibt zusätzlich `payload["active-identity"]`; Wrapper schreibt `version: 2`, `payload-schema-version: 2`; alte Top-Level-Felder `nodeId`/`keys`/`spore`/`siblings` bleiben mit aktivem Slot befüllt (konservative Down-Grade-Kompat). **`importBackup(blob, password, options?)`** erweitert: akzeptiert `version: 1` ODER `version: 2`; bei v=1 Migration in eine `identities[]`-Eintrags-Liste mit `key: "main"` aus den Top-Level-Feldern (Rückwärts-Kompat zum Bau-02.X-Format); bei v=2 Pflicht-Vor-Check `identities.length >= 1` (sonst `BackupSchemaError`); pro Identität `BackupOverwriteError`-Check (Sammel-Error mit kollidierenden Slot-Keys), `ensureIdentityStores(entry.key)`, Slot-spezifische `put`-Schritte (sbkim_keys/sbkim_spore/siblings); active-identity nach Import gesetzt (optionales Top-Level-Feld `active-identity` aus dem Payload, sonst `"main"`). **Selbstcheck-Zeile** auf 14 Funktionen erweitert: `init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/setActiveIdentity/getActiveIdentityKey/listIdentities/removeIdentity/resetIdentityCache/exportBackup/importBackup`. **`_meta`** um `backupFormatVersion: 2` (nachgezogen) + `identityStoreBases` (Liste der fünf identitäts-spezifischen Store-Basen) erweitert. **`window.SbkimSpore`** um `UnknownIdentityError` + `RemoveActiveIdentityError` + die fünf neuen / erweiterten Funktionen ergänzt. **Panel 02** in `tests/manual_check.html` um drei Knöpfe erweitert: Knopf 8 „Identität anlegen + wechseln" (Sequenz `getOrCreateIdentity('test')` → `listIdentities()` → `setActiveIdentity('test')` → `getNodeId()` ≠ main-nodeId), Knopf 9 „Identität entfernen (force)" (`removeIdentity('test', {force:true})`; active-identity Fallback auf main), Knopf 10 „Backup mit Multi-Identität" (Setup zweite Identität + Export; `payload.identities.length === 2`). **`PROTOCOL_VERSION` bleibt `"0.1"`** (lokales Storage-Schema, kein Spore-Feld); **`DB_VERSION` bleibt `4`** (Bau 01.Y hat das gesetzt; neue identitäts-spezifische Stores entstehen dynamisch via `ensureStore`); **`BACKUP_FORMAT_VERSION` von 1 auf 2**. **KEINE Modul-05/06/07-Änderung** (transparenter Slot-Pfad kommt in 05.Y / 06.Y / 07.Y); KEIN `_sendLegacyForIdentity`-Implementierung in Modul 07 (Bau 02.Y ruft fail-soft via typeof-check + console.warn — Bau 07.Y bringt Implementation); KEIN Modul-01-Eingriff; KEINE Sage-Page-Änderung; KEINE CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 02 bleibt `score:"fertig"` — Multi-Identitäts-API ist additive Erweiterung, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). `node --check src/modules/02_spore.js` grün; alle Inline-`<script>`-Blöcke in `tests/manual_check.html` syntaktisch validiert. Headless-Smoke-Test mit `fake-indexeddb` (Node 22) deckt Modul-Lade / Selbstcheck / Multi-Identitäts-Pfad / removeIdentity-force-Fallback / Backup-Export v=2 / Backup-Import in leerer PWA mit Multi-Identität / alter v=1-Backup-Import. |
| Sichttest (Bau 02.Y) | 2026-05-19 | Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump | **Erster Lauf 2026-05-19 (Klaus, DeX-Chrome auf Galaxy Tab S6): Knopf 8 rot wegen Multi-Tab-`onblocked`-Befund** („Versions-Bump blockiert — ein anderer Tab hält die DB offen") — wie im Brief antizipiert (Stolperfalle 1). Zusätzlich aufgedeckt: Rollback-Pfad in `getOrCreateIdentity` war nicht atomar (sbkim_keys-Eintrag blieb nach EnsureStoreError im Storage). **Mini-Fix 2026-05-19** (Bau-Sitzung, gleicher PR): Reihenfolge in `getOrCreateIdentity` umgekehrt — `ensureIdentityStores(slotKey)` läuft jetzt VOR `storage.put(sbkim_keys, slotKey, ...)`, kein Rollback nötig. Smoke-Test 33/33 grün nach Fix. **Zweiter Browser-Lauf 2026-05-19 (Klaus, DeX-Chrome auf Galaxy Tab S6): 3/3 grün** — Knopf 8 „Identitäts-Wechsel OK" (main `PJZAMj…` ≠ test `1Q4dlF…`, `listIdentities: [main, test]`, `active-identity: test`); Knopf 9 „Persona-Apoptose OK" (`active_before: test` → `removed: true` → `active_after: main` → `listIdentities: [main]` → zweiter Aufruf `false` Idempotenz); Knopf 10 „Multi-ID-Backup OK" (wrapper `version: 2`, `payload-schema-version: 2`, `identities.length: 2`, beide Slot-Keys + nodeIds, Download-Link 4777 Bytes). **Vorbereitungs-Workaround (Klaus' Befund):** vor dem 02-Test musste Panel 01 Knopf 1 „Storage init" geklickt werden — das rekonstruiert nach Browserdaten-Cleanup die Pflicht-Stores aus `STORES_V1/V2/V3`. Bestätigt die offene Pflege Modul 01 `init()` versions-fail-soft als nächste Folge-Sitzung. Auch Panel 01 1–8 alle grün. |
| Sichttest-Nachzug Bau-Pipeline | 2026-05-20 | Klaus + Sichttest-Nachzug | **Re-Verifikation 2026-05-20 (Klaus, DeX-Chrome auf Galaxy Tab S6, Termux-`python3 -m http.server 8000`-Setup):** Panel 02 Knopf 8 „Identität anlegen + wechseln" erneut grün — `getNodeId()` wechselt von `main`-Persona auf `test`-Persona, `setActiveIdentity('test')` setzt `sbkim_meta["active-identity"]`. Identitäts-Wechsel ist Voraussetzung für Bau-05.Y/06.Y/07.Y/08.Y Slot-Pfade (siehe Karten 05–08 Sichttest-Nachzug-Vermerk). Knöpfe 9/10 in dieser Sitzung nicht erneut geklickt (bereits 2026-05-19 grün belegt). KEIN Modul-Bug aufgefallen. |
| Verweis Floating-Widget (Modul 17) | 2026-05-25 | Spec-Sitzung 17 | Seit Spec-Sitzung 17 (2026-05-25) ist Endknoten-Standard das Widget aus [Karte 17](17_floating_widget.md); Modul 02 ist Backend für den LEBT-Slot. Hook `window.dispatchEvent(new CustomEvent("sbkim:alive", { detail: { since, nodeId }}))` einmalig nach `init()` + `getOrCreateIdentity()` wird in Bau-Sitzung 17 nachgezogen. KEIN Eingriff in `src/modules/02_spore.js` durch Spec-Sitzung 17 selbst. |
| In Endknoten eingebaut | — | — | — |

---

**Querverweise**

- **Abhängigkeiten:** Modul 01 (Storage)
- **Wird genutzt von:** Modul 05 (Anastomose) · Modul 06 (Heterokaryose) · Modul 07 (Apoptose) · Modul 10 (Reputation)
- **Site-Karte:** [Karte 4 · Module-Bento](../../index.html#screen-overview), Eintrag 02 · [Karte 10 · Andocken](../../index.html#screen-overview) (Live-Generator, derzeit unsigniert)
- **Glossar:** [Spore](../GLOSSAR.md), [Knoten-ID](../GLOSSAR.md), [Ed25519](../GLOSSAR.md)
- **Integration:** `sbkim_integration.md` §4.2 (Schlüsselgenerierung), §4.3 (Spore deployen), §7 (Versionierung)
- **Paper:** Kapitel 13 (Spore-Format), Ableitung der `node_id`
- **Interfaces:** [`INTERFACES.md` §1 → Modul 02_spore](../INTERFACES.md), [`§2 Spore-JSON`](../INTERFACES.md)
