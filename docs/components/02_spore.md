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

Modul 02 exportiert **sieben** öffentliche Funktionen. Alle DB-
Operationen laufen über `window.SbkimStorage`, sind also Promise-
basiert. Schlüssel-Erzeugung ist **lazy** — sie passiert beim ersten
`getOrCreateIdentity()`-Aufruf, nicht beim Skript-Laden.

```
init() → Promise<void>
  // Bereitet das Modul vor: ruft SbkimStorage.init() auf, prüft
  // WebCrypto-Verfügbarkeit (wirft CryptoUnavailableError bei
  // fehlender Ed25519-Unterstützung). Erzeugt KEIN Schlüsselpaar.
  // Idempotent.

getOrCreateIdentity() → Promise<{ nodeId: string, publicKeyJwk: JsonWebKey }>
  // Lädt das Singleton-Keypair aus sbkim_keys["main"]. Wenn nicht
  // vorhanden: erzeugt es per WebCrypto Ed25519, persistiert es,
  // gibt nodeId + public key zurück. Mehrfacher Aufruf liefert
  // dieselbe Identität (Cache + Storage).

getNodeId() → Promise<string>
  // base64url-SHA-256 vom raw public key, ohne Padding.
  // Identisch zum Feld spore.id. Wirft NoIdentityError, wenn noch
  // keine Identität existiert (vorher getOrCreateIdentity rufen).

getPublicKeyJwk() → Promise<JsonWebKey>
  // Public Key als JWK-Objekt (kty: "OKP", crv: "Ed25519", x: …).
  // Wirft NoIdentityError, wenn noch keine Identität existiert.

generateOwnSpore(meta) → Promise<SporeJson>
  // Baut die Spore aus den Pflicht- und Optional-Feldern (siehe
  // Datenformat unten), signiert kanonisch, persistiert in
  // sbkim_spore["main"]. Überschreibt eine vorhandene Spore.
  // meta-Pflichtfelder: domain, nodeType, endpoint.
  // Wirft InvalidSporeMetaError bei Form-/Wertefehlern in meta.

getOwnSpore() → Promise<SporeJson | null>
  // Lädt die persistierte eigene Spore. null, wenn noch nie generiert.

verifyForeignSpore(spore) → Promise<{ valid: boolean, reason?: string }>
  // Prüft Signatur und nodeId-Konsistenz einer beliebigen Spore.
  // Liefert { valid: true } oder { valid: false, reason: "<deutsch>" }.
  // Wirft niemals — Verifikations-Fehler werden als reason zurückgegeben.

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
console.info("MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache/exportBackup/importBackup");
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
  "nodeName":          "Rezeptbuch Klaus",
  "domainDescription": "Hausgemachte Kochrezepte, vom Hefeteig bis zur Sauce.",
  "domainKeywords":    ["Backen", "Saucen", "Hauptgang"],
  "domainVector":      [/* 384 floats, optional bei kleinen Spores */],
  "endpointPaths":     { /* override für INTERFACES.md §3, falls Hoster ohne .well-known */ },
  "stammCategories":   ["Vorspeisen", "Fleisch", "Fisch", "Vegetarisch"],   // Kerngebiet (ARCHITEKTUR.md §8)
  "guestCategories":   ["Begleitgetränke", "Weinkarte"]                     // UI-Label: "Überraschungs-Plus"
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
  "version":               1,                    // = BACKUP_FORMAT_VERSION (§0)
                                                  // Hauptversion. Modul 02 versteht nur
                                                  // den eigenen Wert (sonst BackupVersionMismatchError).
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
  "payload-schema-version": 1                   // Schema-Version DES KLARTEXT-Inhalts (siehe unten).
                                                  // Additiv versioniert. Modul 02 erlaubt
                                                  // payload-schema-version <= eigene Konstante;
                                                  // höhere Werte werfen BackupSchemaError.
}
```

Der **Klartext-Payload** (Inhalt VOR der AES-GCM-Verschlüsselung) ist
eine kanonisch-JSON-serialisierte UTF-8-Bytefolge (alphabetisch
sortierte Object-Keys, rekursiv — dieselbe Disziplin wie Spore-
Signatur). Schema bei `payload-schema-version: 1` (Spec-Sitzung
Backup-Export Stufe 2, Pflicht-Frage 1 Variante b — Identität +
Geschwister):

```jsonc
{
  "createdAt":  "2026-05-16T07:00:00.000Z",    // ISO-8601 UTC
  "nodeId":     "<base64url-sha256-rawpub>",    // = spore.id, Plausibilitäts-Anker
  "keys": {
    "keyId":      "main",
    "privateKey": { /* JsonWebKey, kty:"OKP", crv:"Ed25519", d:..., x:... */ },
    "publicKey":  { /* JsonWebKey, kty:"OKP", crv:"Ed25519",       x:... */ }
  },
  "spore":      { /* vollständige SporeJson inkl. signature, wie in sbkim_spore["main"] */ },
  "siblings": [
    {
      "nodeId":               "<peerNodeId>",
      "domain":               "...",
      "endpoint":             "...",
      "pubKey":               { /* JsonWebKey */ },
      "since":                "<ISO-8601>",
      "heterokaryosisOptIn":  true             // optional, additiv (Modul 05/06/08)
    }
    // ... weitere Geschwister, Reihenfolge: nach since aufsteigend
  ]
}
```

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

Stores: `sbkim_keys` (Schlüssel `"main"`, Wert
`{ keyId, privateKey: JsonWebKey, publicKey: JsonWebKey }`) und
`sbkim_spore` (Schlüssel `"main"`, Wert `{ nodeId, sporeJson, signature }`,
wobei `sporeJson` das vollständige Spore-Objekt inkl. Signatur ist —
das `signature`-Feld auf der Wrapper-Ebene wird redundant gehalten,
damit Modul 05 ohne Re-Parse darauf zugreifen kann). JWK ist
strukturell-klonbar, IndexedDB akzeptiert es ohne Wrapper.

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
| `BACKUP_FORMAT_VERSION` | `1` | Hauptversion des Wrapper-Schemas (`SbkimBackupBlob.version`). Eigene additive Versionierung, getrennt von `PROTOCOL_VERSION` und `DB_VERSION`. Höhere Werte beim Import → `BackupVersionMismatchError`. |
| `BACKUP_KDF_ITERATIONS` | `600000` | PBKDF2-Iterations für die Schlüssel-Ableitung. OWASP-Empfehlung 2023+ für PBKDF2-SHA256 (Pflicht-Frage 2 Variante b). Aufruf-Zeit auf low-end Android ~1–2 s, auf Desktop < 0,5 s. |
| `BACKUP_PASSWORD_MIN_LEN` | `8` | Mindest-Länge des Passwort-Strings. Untere Validierungs-Schwelle — keine Entropie-Schätzung, keine Komplexitäts-Pflicht. Aufrufer-Pflicht, etwas Sinnvolles zu wählen. |
| `BACKUP_PAYLOAD_SCHEMA_VERSION` | `1` | Schema-Version des Klartext-Payloads. Additiv versioniert. Modul 02 erlaubt Import von `<= BACKUP_PAYLOAD_SCHEMA_VERSION`; höhere Werte → `BackupSchemaError`. Erhöhung erst nötig, wenn der Klartext-Payload Pflichtfelder hinzubekommt. |
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
| `importBackup`: `blob.payload-schema-version` > `BACKUP_PAYLOAD_SCHEMA_VERSION` (nach erfolgreichem Decrypt) oder Klartext-Payload-Pflichtfeld fehlt (`nodeId`, `keys.privateKey`, `keys.publicKey`, `spore`) | rejected mit `BackupSchemaError`, deutschsprachige Message mit Hinweis, welches Feld fehlt / welche Schema-Version unbekannt ist. |
| `importBackup`: `sbkim_keys["main"]` existiert bereits UND `options.force !== true` | rejected mit `BackupOverwriteError` (Pflicht-Frage 3 Variante a). Kein Decrypt-Versuch (Vor-Check vor Crypto). Aufrufer entscheidet bewusst per `{force:true}`, ob die bestehende Identität ersetzt werden darf. |
| `exportBackup`: keine Identität vorhanden | rejected mit `NoIdentityError` aus dem `getOrCreateIdentity`-Pfad (wird unverändert durchgereicht). Aufrufer muss erst `getOrCreateIdentity()` rufen. |

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
