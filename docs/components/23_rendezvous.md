# Modul 23 — Rendezvous (gemeinsamer Raum)

> **Status:** Code-Stub 2026-06-28 (Bau-Sitzung 23). `src/modules/23_rendezvous.js`,
> Headless-Smoke `tests/smoke_bau23_rendezvous.mjs` **40/40 grün**, Panel 23 in
> `tests/manual_check.html`, Skript-Load in `index.html` (KEIN Auto-Init).
> **Live-Cross-App-Sichttest (zwei Geräte/Tabs, echtes Relais) wartet auf Klaus.**
>
> Auslöser: am **2026-06-28** wurde der server-lose Live-Cross-Knoten-Handshake
> BEWIESEN (Klaus' Browser-Lauf Tablet↔Handy: „✓ ANDOCK ETABLIERT mit Family
> Projekt (lebende ID)"). Der Durchbruch war das **Rendezvous** (Klaus' Entwurf).
> Dieses Modul gliedert den family-project-Prototyp sauber + konfig-getrieben aus,
> damit **jede** PWA es 1:1 kopieren kann.

## Das Problem (Adress-Wand)

Die in GitHub committete `nodeId` (aus `sbkim/spore.json`) ist **nicht** die
**lebende** `nodeId`, die ein Knoten gerade im Browser über `listenNostr`
belauscht. Wer an die committete ID adressiert, erreicht niemanden — der
lauschende Knoten hört auf eine andere (lebende) ID. Handshakes an die
committete ID laufen darum in einen Timeout.

## Die Lösung (gemeinsamer Raum, wie eine Pinnwand)

Lebende Knoten treffen sich in einem **geteilten Etikett** (Nostr-Tag
`sbkim-rdv`) auf demselben Relais:

1. **Anmelden (`announce`):** ein aktiver Knoten lauscht (`listenNostr`) und
   **heftet** auf bewusste Nutzer-Aktion seine **lebende Visitenkarte** ans
   Brett — ein Nostr-Event mit der echten Spore inkl. **lebender** `nodeId`.
2. **Suchen (`discover`):** ein Suchender liest die Visitenkarten aus dem Raum.
3. **Andocken (`handshakeCard`):** der Suchende handshaket die **lebende** ID
   aus der Karte — genau die ID, die der Gegenknoten gerade wirklich belauscht.

## Verfassungstreue (Empfangsmodus, Mycel-Schicht 1)

Anmelden **und** Suchen sind ausschließlich **nutzer-ausgelöst** (Knöpfe in der
App). **KEIN** getakteter Dauer-Piepser (= Pulsation, fürs Mycel verboten),
**KEIN** Crawl, **KEINE** Eigenanfrage ins offene Netz beim Laden. Das Anmelden
ist eine bewusste **Pilz-Schicht-Geste** (Schicht 2); der Knoten selbst bleibt
unverändert Empfangsmodus mit Antwortrecht (siehe CLAUDE.md § Vier-Schichten-
Lesart + § „Was du nicht tust").

## Datenverträge (1:1 aus dem bewiesenen family-Prototyp — nicht brechen)

| Begriff | Wert |
|---|---|
| Gemeinsamer Raum | Nostr-Tag `["t","sbkim-rdv"]`, Event `kind: 1` |
| Visitenkarte (Presence) | `content` JSON: `{ "kind":"sbkim-presence", "nodeId":<lebende nodeId>, "nodeName":<App-Name>, "spore":<volle eigene Spore>, "ts":<unix-sec> }` |
| Entdecken | `subscribe({ kinds:[1], "#t":["sbkim-rdv"], since:<now-1800> })`, ~4 s sammeln, dedupe nach `nodeId` (frischeste behalten), eigene `nodeId` rausfiltern |
| Handshake | Modul 05 `handshake(card.spore, null, { transport:"nostr", timeoutMs:12000 })` → adressiert die **lebende** ID |

Konstanten: `RDV_TAG="sbkim-rdv"`, `RDV_PRESENCE_KIND="sbkim-presence"`,
`RDV_FRESH_SEC=1800` (Karten der letzten 30 min), `RDV_LISTEN_MS=4000`
(Sammelfenster), `RDV_HANDSHAKE_TIMEOUT_MS=12000`.

## Architektur-Wahrheit (warum kopieren, nicht zentral)

Das Anmelden **muss aus dem eigenen Browser jeder App** laufen — die **lebende
Identität + der private Schlüssel** liegen pro App/Origin getrennt.
family-projekt.de **kann nicht** für Rezeptbuch anmelden. Darum wird Modul 23
**in jede App kopiert** (byte-1:1), nicht zentral gehostet. Nur das **UI-Stück**
(die Knöpfe) ist app-eigen — und der injizierte `nodeName`.

## Komposition (geteilte Kern-Module bleiben unangetastet)

Modul 23 ist **reiner Tool-Code** über die öffentlichen Flächen von:

- **Modul 05** (`handshake`, `listenNostr`) — Anastomose.
- **Modul 05b** (`publish`, `subscribe`) — Nostr-Relais-Client.
- **Modul 02** (`getOwnSpore`) — eigene lebende Spore.

Die Kern-Module 05/05b/02 werden **nicht** verändert (kein Netz-Bruch).

## Konfig-getrieben (keine family-Hardcodes)

`init({ nodeName, relayClient, anastomose, spore, freshSec, listenMs })` — alle
optional; `relayClient`/`anastomose`/`spore` werden sonst aus den Globals
aufgelöst (`SbkimNostrRelay` / `SbkimAnastomose` / `SbkimSpore`). `nodeName` ist
der Anzeigename der eigenen Visitenkarte (z.B. „Mein Rezeptbuch"). `init()` baut
**nichts** auf (Empfangsmodus) — es setzt nur Konfig.

## Public surface (`window.SbkimRendezvous`)

| Funktion | Rückgabe | Zweck |
|---|---|---|
| `init(opts?)` | `Promise<void>` | Konfig setzen (idempotent, fail-soft, baut nichts auf) |
| `configure(opts)` | `void` | Teil-Update der Konfig |
| `announce()` | `Promise<{ ok, nodeId?, reason? }>` | Lauschen + lebende Visitenkarte heften (setzt Identität voraus) |
| `connectAndAnnounce(opts?)` | `Promise<{ ok, created, nodeId?, reason? }>` | Wie `announce`, erzeugt Identität via `opts.createIdentity` (app-eigen), falls keine da |
| `discover(opts?)` | `Promise<{ ok, cards, reason? }>` | Raum lesen, dedupen, eigene filtern. `cards=[{nodeId,nodeName,spore,ts,ageSec}]` (ts-absteigend) |
| `handshakeCard(card, opts?)` | `Promise<{ outcome, score?, reason?, raw? }>` | Handshake an lebende Karten-ID. `outcome ∈ {established, rejected, rejected-local, timeout, error}` (fail-soft, nie Throw) |
| `_meta` | object | `{ version, tag, presenceKind, freshSec, listenMs, nodeName, hasRelay, hasAnastomose, hasSpore }` |

`createIdentity` ist app-eigen, weil die **Domänen-Stichworte** app-spezifisch
sind (Rezepte ≠ Cocktails ≠ Buchhaltung). family-project z.B. reicht hier seinen
`__fpErzeugeSpore`-Pfad durch.

## Fail-soft (Pflicht)

Kein Relais-Client / keine Identität / Netz weg / Handshake-Timeout → ruhiges
Ergebnis-Objekt (`ok:false` bzw. `outcome:"timeout"/"error"` mit `reason`),
**nie** ein Throw. Die App-UI bleibt immer bedienbar.

## UI-Stück (app-eigen — nicht im Modul)

Jede PWA baut ein kleines, eigenes UI um das Modul:

- **🌐 Mit dem Netz verbinden** → `connectAndAnnounce({ createIdentity })`
- **👥 Wer ist im Raum?** → `discover()` → pro Karte ein **🤝 Andocken** →
  `handshakeCard(card)`
- (optional) **📌 Nur anmelden** → `announce()`

Vorlage für die Karten-Darstellung: family-project `renderRoomCards`
(`sbkim/sbkim-init.js`).

## Tests

- **Headless:** `tests/smoke_bau23_rendezvous.mjs` (40/40) — Mock-Relais +
  Mock-Spore + Mock-Anastomose, beweist die Rendezvous-Logik (Karte heften,
  Raum lesen/dedupen/eigene filtern, Handshake an lebende Karte, fail-soft).
- **Browser-Sichttest (wartet auf Klaus):** zwei Geräte/Tabs am echten Relais
  `wss://relay.family-projekt.de`: ein Gerät 🌐, das andere 👥 → 🤝 →
  „ETABLIERT".

## Risiken / offene Punkte

- Der Raum trägt **öffentliche** Visitenkarten (jeder am Relais sieht sie). Das
  ist Absicht (Pilz-Schicht, Akquise oberirdisch) — Härtung (Rate-Limit Modul
  11, Blocklist Modul 12, Reputation Modul 10) folgt, wenn das Netz groß genug
  ist. Die Visitenkarte enthält nur die **öffentliche** Spore (kein privater
  Schlüssel, keine PII).
- Eine veraltete Visitenkarte (Knoten ging offline) führt zu `timeout` beim
  Andocken — sauber gemeldet, kein Fehler.
- Marktplatz-Schicht (Such-Werkzeug Modul 22 über den Raum legen) ist ein
  eigener Folge-Strang nach dem Rollout.
