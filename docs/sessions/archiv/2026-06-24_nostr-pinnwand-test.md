# Übergabeprotokoll — 2026-06-24 · Nostr-Pinnwand-Test (Boden-Beweis)

**Rolle:** Bau-Sitzung (Freibrief). Eigenständiger Test-Stich, KEIN Produktiv-Modul.
**Ergebnis:** auf `main` gemerged (PR #421, squash). Headless 29/29 grün.
Geräteübergreifender Sichttest wartet auf Klaus.

## Auftrag

Beweisen, dass ein Zettel aus Browser A über ein geborgtes, dummes Brett
(Nostr-Relays) in Browser B / auf einem anderen Gerät auftaucht — server-los,
Klaus betreibt nichts. Beweist NUR das Medium (Vorbedingung für die offene
Cross-Knoten-Pinnwand, `notiz-briefkasten-pinnwand.md`). Brief:
`docs/sessions/BRIEF_BAU_NOSTR_PINNWAND_TEST.md`.

## Was gebaut wurde (`docs/discovery/nostr-test/`)

- **`noble-secp256k1.js`** — lokal vendoriert, kein Runtime-CDN, kein Tracker.
- **`index.html`** — minimaler NIP-01-Client (vanilla, ES-Module).
- **`_smoke.mjs`** — Headless-Smoke, reines Node (Repo-Stil), 29/29 grün.

## Zentraler Befund (Abweichung vom Brief — bewusst, dokumentiert)

Der Brief nennt „@noble/secp256k1 **v2**, single file, async Schnorr". Faktisch:
**v2 hat Schnorr/BIP340 entfernt** (in `@noble/curves` ausgelagert, kein
`schnorr`-Export im Single-File-Build mehr — geprüft an `@noble/secp256k1@2.3.0`
und dessen README § „Upgrading v1 to v2": „Disable some features … Schnorr
signatures … switch to curves if you need them").

Nostr (NIP-01) braucht aber Schnorr mit **x-only pubkeys** (BIP340). Daher
**v1.7.1** vendoriert — die letzte Single-File-, dependency-freie ESM-Variante
mit async Schnorr via WebCrypto. Das erfüllt die eigentliche Brief-Absicht
(„single file, async Schnorr via WebCrypto, x-only"), nur unter korrekter
Versionsnummer.

**Einzige Anpassung ggü. dem npm-Original** (browser-tauglich machen, im
Datei-Kopf dokumentiert):
- Zeile `import * as nodeCrypto from 'crypto';` entfernt (Bare-Import, bricht
  im Browser-ESM — der Brief warnt ausdrücklich davor).
- `node: nodeCrypto,` → `node: undefined,` (Node-Zweig entfällt; der Browser
  nutzt ohnehin `crypto.web = self.crypto.subtle`).

Kryptographischer Kern sonst byte-für-byte unverändert. Roundtrip in Node
(mit `globalThis.self`-Shim) bestätigt: 32-Byte priv, 32-Byte x-only pub,
sha256-id, 64-Byte Schnorr-Sig, verify=true, Negativprobe schlägt fehl.

## index.html — Verhalten

- Identität: 32 Zufallsbytes (`crypto.getRandomValues` via noble `randomPrivateKey`),
  hex in `localStorage` (`sbkim_nostr_test_priv`) → Wiederkehr = gleiche Spore.
- Event `{pubkey, created_at, kind:1, tags:[["t","sbkim-pinnwand-test"]], content}`,
  `id = sha256(JSON.stringify([0,pubkey,created_at,kind,tags,content]))`,
  `sig = schnorr.sign(idBytes, priv)`.
- Senden `["EVENT", ev]`; Abo `["REQ", subId, {kinds:[1],"#t":[TAG],limit:50}]`;
  Empfang `["EVENT", subId, ev]` → Dedup per `id` → Liste (Autor-Kurz-pubkey +
  Uhrzeit + Relay), eigene Zettel markiert.
- Drei freie Relays mit Status-Punkten: `relay.damus.io`, `nos.lol`,
  `relay.nostr.band`.
- Krypto-Selbsttest beim Laden (sign+verify einer Konstante) → „OK"/„FAIL",
  belegt die Krypto auch offline.
- Eigener Zettel wird nach dem Senden sofort lokal gezeigt (Relay-Echo verzögert).

## Smoke — was er prüft / was nicht

Repo hat **kein Playwright** (trotz Brief-Wortlaut „Playwright wie die anderen"
— die echten Sage-Smokes sind reines Node). Daher: Datei-/Struktur-Analyse +
**echter Modul-Import** der vendorierten Krypto mit vollem Nostr-Roundtrip.
Geprüft: Dateien da, kein Bare-Import, schnorr-Export, voller Krypto-Roundtrip
+ Negativprobe, Seite self-contained (kein `https://`-Script), UI-Anker
(`#me #selftest #msg #post #board #relays`), Tag + Relays + EVENT/REQ + Footer.
**Relay-Round-Trip NICHT vorausgesetzt** — gehört in Klaus' Gerätetest.

## Leitplanken eingehalten

Kein Modul-Code in `src/`, kein Protokoll-Bump, keine PII, Krypto lokal
vendoriert. Nicht in Sage-Page/Discovery verlinkt (Notiz-Charakter). CI
(`sbkim-watch.yml`) führt keinen Smoke-Runner → Sage-Smokes unberührt.

## Was offen / nächster sinnvoller Schritt

1. **Klaus' geräteübergreifender Sichttest** (nicht headless ersetzbar):
   URL über GitHub Pages auf Tablet UND Handy/Freund öffnen → „Salate" tippen
   → taucht beim anderen binnen Sekunden auf, und umgekehrt. = Boden-Beweis.
2. Bei grün (nur benennen, nicht gebaut): Frage→Antwort übers Brett; grobe Tags
   am Pin fürs Vorfiltern, Bedeutungs-Sortierung bleibt lokal (Modul 03/04);
   Anschluss an `notiz-bauplan-live-suche.md`.

## Verweise

- Brief: `docs/sessions/BRIEF_BAU_NOSTR_PINNWAND_TEST.md`
- Notizen (unverlinkt): `notiz-briefkasten-pinnwand.md`, `notiz-bauplan-live-suche.md`
- Sachstand: `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`
