# Modul 25 — Pseudonymisierung (E2E-Vertraulichkeit Grad B)

**Status:** Code-Stub 2026-07-16 (B5 aus `docs/PLAN_SEMANTIK_KRYPTO.md`).
Headless-Smoke `tests/smoke_bau25_pseudonym.mjs` **36/36 grün**. Browser-Sichttest
(Panel 25) wartet auf Klaus. **Spec:** `docs/E2E-VERTRAULICHKEIT.md §1.1`.

## Was es ist

Der **empfohlene Sofortweg** für Vertraulichkeit im Mycel (Grad B): bevor eine
Nutzlast über den öffentlichen, signierten Briefkasten geht, werden **sensible
Werte durch lesbare Platzhalter-Token** ersetzt — `[[KUNDE_1]]`, `[[IBAN_1]]`,
`[[EMAIL_1]]`. Der **Anker-Tresor** (Token → Klartext) bleibt **getrennt** und wird
**menschlich/separat** übergeben, nie über den öffentlichen Kanal.

Reiner **Text-/Objekt-Transform** — **keine Krypto-Primitive**, **kein Spore-Feld**,
**kein Protokoll-Bump** (`protocolVersion` bleibt `0.1`). Der Briefkasten bleibt
menschlich lesbar/auditierbar (INTERFACES §11.1), Struktur + Ed25519-Signatur
bleiben prüfbar.

## Ehrliche Grenze (§1.1)

**Pseudonymisierung ≠ Verschlüsselung.** Metadaten (Anzahl Datensätze, Frequenz,
Beträge, Korrelationsmuster) **leaken weiter** — Zahlen/Booleans bleiben unberührt.
Für echte Korrelations-Sensibilität braucht es **Grad C** (versiegelter Umschlag,
Punkt B6, X25519 → ECDH → HKDF → AES-GCM). Grad B ist tragbar, solange der
**Anker-Tresor draußen bleibt**.

## Drei Grade (aus `docs/E2E-VERTRAULICHKEIT.md`)

| Grad | Was | Draht-Protokoll | Reife |
|---|---|---|---|
| A — Klartext + Signatur | heutiger Stand | `0.1` | gelebt |
| **B — Pseudonymisiert + Signatur** | **dieses Modul** — Token statt Klartext, Anker-Tresor separat | `0.1`, build-frei | **sofort** |
| C — Versiegelter Umschlag | X25519-verschlüsselt für genau einen Empfänger | `0.2` (Entwurf, B6) | Entwurf |

## Erkenner

- **Explizite Werte** (höchste Priorität): der Aufrufer übergibt die Klartexte,
  die redigiert werden sollen (typisch **Namen** — regex-untauglich), mit Typ:
  `values: [{ value: "Max Mustermann", type: "KUNDE" }]` oder
  `values: ["Max Mustermann"], valueType: "KUNDE"`.
- **Eingebaute Erkenner** (`types`, Default `["EMAIL","IBAN"]`):
  - `EMAIL` — `name@host.tld`.
  - `IBAN` — kompakt oder in 4er-Gruppen mit Leerzeichen.
  - `TEL` — **opt-in** (`types:["EMAIL","IBAN","TEL"]`), da lange Ziffernketten
    falsch-positiv anfällig sind.
- **Eigene Erkenner** (`customPatterns: [{ type, regex }]`) — z.B. Aktenzeichen.

**Reihenfolge (deterministisch):** explizite Werte → EMAIL → IBAN → (TEL) →
customPatterns. Gleicher Klartext → **gleiches Token** (stabil, auch über Läufe via
`options.map`). Bereits gesetzte Token werden **nie erneut** erkannt (kein
Verschachteln).

## Public surface (`window.SbkimPseudonym`)

```
pseudonymize(text, options?)        -> { text, map, tokens }
rehydrate(text, map)                -> text
pseudonymizeObject(obj, options?)   -> { data, map, tokens }   (Zahlen bleiben)
rehydrateObject(obj, map)           -> obj
getBuiltinPatterns()                -> Array<{ type, description, defaultOn }>
makeToken(type, index)              -> "[[TYPE_INDEX]]"
parseToken(token)                   -> { type, index } | null
isToken(str)                        -> boolean
serializeVault(map)                 -> string   (Anker-Tresor, für Handover)
parseVault(str)                     -> map
InvalidPseudonymArgError            -> ErrorFactory (sync throw nur bei Aufrufer-Fehler)
```

- **`options`**: `values`, `valueType`, `types`, `customPatterns`, `map`.
- **Fail-soft**: nie ein Throw außer `InvalidPseudonymArgError` bei klarer
  Aufrufer-Fehlbedienung (text kein String, `values`/`types`/`customPatterns` kein
  Array, Token-Typ nicht GROSS, `parseVault`-Müll). `rehydrate` lässt unbekannte
  Token stehen.

## Verwendung (Beispiel)

```js
// Vor dem Versand:
const { text, map } = SbkimPseudonym.pseudonymize(
  "Rechnung an Max Mustermann, IBAN DE89 3704 0044 0532 0130 00, 100 EUR.",
  { values: [{ value: "Max Mustermann", type: "KUNDE" }] }
);
// text -> "Rechnung an [[KUNDE_1]], IBAN [[IBAN_1]], 100 EUR."  → in den Briefkasten
// map  -> Anker-Tresor: NIE über den öffentlichen Kanal senden.

// Empfänger (nachdem er den Anker-Tresor separat/menschlich erhalten hat):
const klartext = SbkimPseudonym.rehydrate(text, map);
```

## Einbau

- Ein `<script src="…/25_pseudonym.js">` — **kein Auto-Init**, kein Netz, keine
  Abhängigkeit. Registriert `window.SbkimPseudonym`.
- Der **Anker-Tresor** wird vom Aufrufer verwahrt. Für verschlüsselte Ablage
  at-rest bietet sich **Modul 20** `SbkimSecret.putSecret` an (BYOK-Passwort) —
  das ist **bewusst NICHT** Teil dieses Moduls (Entkopplung); Modul 25 liefert nur
  `serializeVault`/`parseVault` für den Handover.
- Typischer Konsument: **BookLedgerPro** (Buchhaltungs-Nutzlast mit Kunden-/IBAN-
  Daten) und jeder Knoten, der personenbezogene Werte pseudonymisiert versenden
  will, ohne auf Grad C zu warten.

## Aktiviert durch

Aufrufer-Code (App/Werkzeug) auf **bewusste Nutzer-Aktion** vor einem Versand.
Kein Hintergrund-Lauf, kein Crawler, keine Pulsation — Empfangsmodus gewahrt.
