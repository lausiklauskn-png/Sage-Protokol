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
```

### Selbstcheck

Beim **Skript-Laden** (synchron, vor jeglichem Aufruf):

```
console.info("MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache");
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
  "endpointPaths":     { /* override für INTERFACES.md §3, falls Hoster ohne .well-known */ }
}
```

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

### Storage

Stores: `sbkim_keys` (Schlüssel `"main"`, Wert
`{ keyId, privateKey: JsonWebKey, publicKey: JsonWebKey }`) und
`sbkim_spore` (Schlüssel `"main"`, Wert `{ nodeId, sporeJson, signature }`,
wobei `sporeJson` das vollständige Spore-Objekt inkl. Signatur ist —
das `signature`-Feld auf der Wrapper-Ebene wird redundant gehalten,
damit Modul 05 ohne Re-Parse darauf zugreifen kann). JWK ist
strukturell-klonbar, IndexedDB akzeptiert es ohne Wrapper.

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

Alle SBKIM-Fehler sind `Error`-Instanzen mit sprechendem `name` und
deutschsprachigem `message`-Feld. `verifyForeignSpore` wirft niemals —
Verifikations-Probleme kommen als `reason`-String zurück.

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
