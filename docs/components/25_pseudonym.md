# Modul 25 — Pseudonymisierung (E2E-Vertraulichkeit Grad B)

**Status:** **Generation 2, 2026-09-28** — der Kern des Sende-Prüfers ist hierher
umgezogen (Klaus: *„der Kern soll ein eigenes Modul sein in Sage, was dann überall
eingefügt werden kann"*). Generation 1 war der Code-Stub vom 2026-07-16 (B5 aus
`docs/PLAN_SEMANTIK_KRYPTO.md`). Headless-Smoke `tests/smoke_bau25_pseudonym.mjs`
**52 grün**, Gegenprobe `tests/gegenprobe_bau25_pseudonym.mjs` **15 gefangen ·
0 blind · 0 aus falschem Grund · 0 tote Anker** (jeder Fall zählt nur, wenn die rote
Zeile den Namen seiner Zusicherung trägt). Browser-Sichttest (Panel 25) wartet auf
Klaus. **Spec:** `docs/E2E-VERTRAULICHKEIT.md §1.1`.

## Was Generation 2 ändert

| | Generation 1 (2026-07-16) | Generation 2 (2026-09-28) |
|---|---|---|
| Platzhalter | `[[IBAN_1]]` | **`⟦IBAN-1⟧`** — alte werden von `rehydrate`, `parseToken` und einer mitgegebenen `map` weiter gelesen |
| Sorten | EMAIL, IBAN (TEL opt-in) | **SCHLUESSEL · MAIL · TELEFON · IBAN · BETRAG · RECHNUNG · DATUM**, alle an (DATUM seit 2026-10-02); Namen über `values` (Sorte NAME) |
| IBAN | Form | Form **und Prüfziffer** (ISO 13616) |
| Betrag | blieb stehen | wird verdeckt, **mit Tausenderpunkt ganz** (Klaus' Befund 2026-09-21: aus `1.248,50 EUR` blieb `1.` stehen) |
| Telefon | lange Ziffernfolge | nur mit **Ländervorwahl** oder `tel:` |
| Namen | Teilzeichenkette | an **Wortgrenzen**, ohne Groß/klein — „Müller" trifft nicht „Müllerstraße" |
| Fund | nacheinander ersetzt | nach **Lage**: jede Fundstelle trägt `start/end/line/type/value`, Überlappung wird aufgelöst |
| neu | — | `find(text, options)`, `findLeak(text, map)`, `isIban(str)` |

⚠ **Kein Knoten benutzte Generation 1** (gemessen am 2026-09-28: `25_pseudonym`
kommt in keinem App-Depot vor). Der Formatwechsel bricht deshalb nichts, was läuft.

⚠ **Benannte Doppelung:** die Muster stehen ein zweites Mal im Auslieferungsprüfer
(`pruefe-datei.py`, `assets/pruefer-formate.js`). Wer eines ändert, zieht das andere
nach. Abweichung hier mit Absicht: BETRAG erfasst den Tausenderpunkt, und bei
Feldern (`password = …`, `Rechnungsnummer: …`) wird nur der **Wert** verdeckt.

⚠ **Muster mit Lookbehind** (BETRAG, Namen) werden einzeln übersetzt; ein Browser
ohne Lookbehind verliert genau dieses Muster (steht dann in `_meta.ausgefallen`),
nicht das Modul. Namen fallen dort auf eine Suche ohne Wortgrenze zurück.

## Was es ist

Der **empfohlene Sofortweg** für Vertraulichkeit im Mycel (Grad B): bevor eine
Nutzlast über den öffentlichen, signierten Briefkasten geht, werden **sensible
Werte durch lesbare Platzhalter** ersetzt — `⟦KUNDE-1⟧`, `⟦IBAN-1⟧`, `⟦MAIL-1⟧`. Der **Anker-Tresor** (Token → Klartext) bleibt **getrennt** und wird
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

- **Namen und andere Werte aus einer Liste**: `values: ["Eva Muster"]` (Sorte
  `NAME`) oder `values: [{ value: "Eva Muster", type: "KUNDE" }]`. Namen rät das
  Modul nie — ohne Liste wird kein Name gemeldet.
- **Eingebaute Sorten** (`types`, Vorgabe alle sieben; `EMAIL`/`TEL` werden als
  alte Namen verstanden): SCHLUESSEL · MAIL · TELEFON · IBAN · BETRAG · RECHNUNG · DATUM.
- **DATUM** (Klaus 2026-10-02, Grenzen-Liste Punkt 4: Geburtsdaten): `12.03.2026`,
  `1.3.85`, `2026-03-12`, `12/03/2026`, `12. März 2026`, `3. Jan.`. Tag und Monat
  müssen gültig sein; Versionsnummern, IP-Adressen und Uhrzeiten bleiben stehen.
  Eine Frist kommt über `rehydrate` zurück; rechnen kann die KI mit einem
  verdeckten Datum nicht — wer das braucht, lässt DATUM in `types` weg.
  Nicht erkannt: „März 2026" ohne Tag, englische Schreibweisen.
- **Eigene Muster** (`customPatterns: [{ type, regex }]`), z. B. Aktenzeichen.
- **Namensvorschläge** (`suggestNames(text, {values})`, Klaus 2026-10-02, Grenzen-Liste
  Punkt 4c: „gut, solange es ein Vorschlag bleibt"). Gefunden werden Namen nach
  Herr/Frau (auch mit Dr./Prof.), aus einer Begrüßung („Hallo Petra,") und aus einer
  Grußformel („Viele Grüße" + nächste Zeile, „LG Anna"). Rückgabe
  `[{name, start, end, line, grund}]`, `grund` anrede · begruessung · grussformel.
  ⚠ **Ein Vorschlag verdeckt NICHTS** — `find` und `pseudonymize` bleiben unberührt;
  verdeckt wird ein Name erst, wenn der Aufrufer ihn in `values` übernimmt.
  Nach Herr/Frau nur EIN Wort, ein zweites nur, wenn danach der Satzteil endet
  („Herrn Meier Bescheid" → Meier). Stoppwörter (Team, Damen, Herren, Kollegen, Mama …)
  werden nicht vorgeschlagen. Grenzen: Namen ohne Anrede, Gruß oder Grußformel
  fallen durch; ein großgeschriebenes Wort hinter „Hallo" wird vorgeschlagen, auch
  wenn es kein Name ist — deshalb nur ein Vorschlag.

Gefunden wird alles, dann **nach Lage** sortiert: bei Überlappung gewinnt die
frühere Fundstelle, bei gleichem Anfang die längere. Gleicher Wert derselben Sorte
→ **gleicher Platzhalter** (auch über Läufe via `options.map`). Ein Muster, das
**in** einem vorhandenen Platzhalter träfe, wird verworfen — kein Verschachteln.

## Public surface (`window.SbkimPseudonym`)

```
pseudonymize(text, options?)        -> { text, map, tokens, findings }
find(text, options?)                -> Array<{ start, end, line, type, value }>
rehydrate(text, map)                -> text   (liest ⟦TYP-n⟧ und alte [[TYP_n]])
findLeak(text, map)                 -> string | null   (steht noch ein Klartext drin?)
isIban(str)                         -> boolean
pseudonymizeObject(obj, options?)   -> { data, map, tokens }   (Zahlen bleiben)
rehydrateObject(obj, map)           -> obj
getBuiltinPatterns()                -> Array<{ type, description, defaultOn }>
makeToken(type, index)              -> "⟦TYPE-INDEX⟧"
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
  "Rechnung an Max Mustermann, IBAN DE89 3704 0044 0532 0130 00, 1.248,50 EUR.",
  { values: [{ value: "Max Mustermann", type: "KUNDE" }] }
);
// text -> "Rechnung an ⟦KUNDE-1⟧, IBAN ⟦IBAN-1⟧, ⟦BETRAG-1⟧."  → hinaus
// Vor dem Senden: SbkimPseudonym.findLeak(text, map) === null
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
- **Erster Konsument: der Sende-Prüfer** (lausiklauskn-png/Sende-Pruefer) — er
  soll das Modul byte-1:1 tragen statt einer eigenen Fassung. Noch nicht umgestellt.
- Typischer Konsument: **BookLedgerPro** (Buchhaltungs-Nutzlast mit Kunden-/IBAN-
  Daten) und jeder Knoten, der personenbezogene Werte pseudonymisiert versenden
  will, ohne auf Grad C zu warten.

## Aktiviert durch

Aufrufer-Code (App/Werkzeug) auf **bewusste Nutzer-Aktion** vor einem Versand.
Kein Hintergrund-Lauf, kein Crawler, keine Pulsation — Empfangsmodus gewahrt.
