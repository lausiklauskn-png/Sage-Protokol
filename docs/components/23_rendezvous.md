# Modul 23 — Rendezvous (gemeinsamer Raum)

> **Status:** Code-Stub 2026-06-28 (Bau-Sitzung 23). Kern `src/modules/23_rendezvous.js`
> (Headless-Smoke `tests/smoke_bau23_rendezvous.mjs` **40/40 grün**) + geteiltes UI
> `src/modules/23_rendezvous_ui.js` (`SbkimRendezvousUI`, öffentlicher Floating-Knopf,
> Headless-Smoke `tests/smoke_bau23_rendezvous_ui.mjs` **23/23 grün**). Panel 23 in
> `tests/manual_check.html`, Skript-Load beider in `index.html` (KEIN Auto-Init).
> **✅ LIVE-CROSS-APP-SICHTTEST GRÜN (Klaus 2026-06-28):** Sage ↔ Mein Mixarium
> **beidseitig** „✓ ANDOCK ETABLIERT" über das echte Relais — server-loser
> Live-Cross-Knoten-Handshake zwischen zwei Apps, die **beide das geteilte
> Modul 23** fahren (Sage-Page-Mount in `sbkim-init.js`, Mixarium-Rollout PR #79).
> Alle drei Knoten (Sage, Mixarium, family) sahen sich gegenseitig im Raum; die
> Adress-Wand ist gelöst. Bestätigt auch, dass der 0.80-Bedeutungs-Riegel korrekt
> trennt (Mixarium ↔ family 0.7753 = rejected-local, kein Fehler).
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

## UI-Stück — geteiltes Modul 23 UI (`SbkimRendezvousUI`)

Klaus' Festlegung 2026-06-28: ein **eigener kleiner Floating-Knopf**,
**öffentlich** (kein `?dev`-Gate), **einheitlich** über alle Apps. Damit das
nicht 6× neu gebaut wird, gibt es ein **geteiltes UI-Modul**
`src/modules/23_rendezvous_ui.js` (`window.SbkimRendezvousUI`), das — wie Modul
23 selbst — **byte-1:1 in jede PWA kopiert** wird. Es self-mountet einen
dezenten 🌐-Knopf, der ein Mini-Panel mit den drei Gesten öffnet:

- **🌐 Mit dem Netz verbinden** → `SbkimRendezvous.connectAndAnnounce({ createIdentity })`
- **👥 Wer ist im Raum?** → `discover()` → pro Karte ein **🤝 Andocken** → `handshakeCard(card)`
- **📌 Nur neu anmelden** → `announce()`

Die App parametrisiert nur:

```js
SbkimRendezvousUI.init({
  nodeName: "Mein Rezeptbuch",        // Anzeigename der Visitenkarte
  createIdentity: async () => { ... }, // app-eigen (Domänen-Stichworte!), optional
  corner: "bl",                        // bl|br|tl|tr (Default unten links)
});
```

Surface: `init/show/hide/isOpen/_meta`. DOM-only, fail-soft, idempotent, baut
die Elemente per `createElement` (kein `innerHTML` für abgefragte Knoten) →
stub- und real-DOM-fest. Komponiert **ausschliesslich** Modul 23 (keine direkten
02/03/05/05b-Aufrufe). Headless-Smoke `tests/smoke_bau23_rendezvous_ui.mjs`
**23/23 grün** (DOM-Stub + Mock-Rendezvous).

`createIdentity` ist app-eigen, weil die Domänen-Stichworte app-spezifisch sind.
Hat die App schon eine lebende Identität (bereits angedockt), genügt `announce`
ohne `createIdentity`. Vorlage für den family-Pfad: `__fpErzeugeSpore` (mit
Modell-Download-Fortschritt) in `family-project/sbkim/sbkim-init.js`.

## Verwandtschafts-Score der Raum-Karten (REINE ANZEIGE, 2026-06-28)

Folge zur „Wählen"-UI (Bau 04.E / Modul 22): der Rendezvous-Raum zeigt pro
Knoten einen **zentrierten Verwandtschafts-Score** zur eigenen Domäne — genau
das Zwei-Maß-Prinzip aus `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`, jetzt am
zweiten Einbau-Ort.

- **Modul 23 (`discover` + `relatednessForCards`)** hängt je Karte
  `relatedness` (zentrierter Cosinus, `SbkimMatch.relatedness`, whitened-light)
  + `isRelated` (≥ `RELATEDNESS_MIN` 0.30) an. `relatednessForCards(cards,
  ownSpore)` ist eine **pure**, DOM-freie Funktion (headless testbar), mutiert
  die Eingabe nicht. Modul 04 ist eine **optionale** Anzeige-Abhängigkeit —
  fehlt es (oder ein `domainVector`), bleibt `relatedness` `null` und der Raum
  voll funktionsfähig.
- **UI (`23_rendezvous_ui.js`)** rendert pro Karte ein Badge
  („🧬 verwandt 0.72" wenn `isRelated`, sonst „· verbunden …") und bietet einen
  **„🧬 nur verwandte"-Schalter** (Default aus), der die Karten-Liste auf echte
  Verwandte filtert.
- **Verfassungstreu:** das ist **reine Anzeige**. Der 0.80-Andock-Riegel
  (Modul 05 Handshake / `PROVIDER_MIN_MATCH`) bleibt **unberührt** — der Score
  gatet **nichts**, er sortiert/filtert nur die Darstellung. Die Kern-Module
  02/05/05b sind unangetastet; Modul 04 wird nur gelesen.

## Tests

- **Headless:** `tests/smoke_bau23_rendezvous.mjs` (55/55) — Mock-Relais +
  Mock-Spore + Mock-Anastomose, beweist die Rendezvous-Logik (Karte heften,
  Raum lesen/dedupen/eigene filtern, Handshake an lebende Karte, fail-soft) +
  den Verwandtschafts-Score an **echten** Knoten-Domänen-Vektoren (Schwester
  Rezeptbuch `isRelated`, Hub Sage / BookLedger `isRelated:false`) + fail-soft.
- **Headless UI:** `tests/smoke_bau23_rendezvous_ui.mjs` (32/32) — Badge-Render
  + „nur verwandte"-Filter + Andock-Verdrahtung.
- **Browser-Sichttest (wartet auf Klaus):** zwei Geräte/Tabs am echten Relais
  `wss://relay.family-projekt.de`: ein Gerät 🌐, das andere 👥 → 🤝 →
  „ETABLIERT". Jetzt zusätzlich: Verwandtschafts-Badge je Karte sichtbar.

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

---

## Härtung „Identitäts-Isolierung" (2026-07-11)

`repairAndReconnect` **löst** den geteilte-Topf-Kollisionsfall jetzt auf, statt
ihn nur zu schützen: liegt die einzige Identität noch im geteilten `sbkim`, wird
sie via `SbkimStorage.migrateIdentityFrom` in die eigene Schublade **migriert**,
DANN der Topf gelöscht (Kollision weg, Identität behalten). Scheitert die
Migration oder fehlt der Pfad (älteres Storage-Modul) → reiner Schutz-Fallback
(Topf stehen lassen). `ensureIdentity` (Modus A) migriert ebenfalls, bevor es
eine neue Identität erzeugt. Rückgabe: `migratedIdentity`; `_meta.hasMigrate`.
Kern-Module 02/05/05b unangetastet. Smoke `tests/smoke_bau23d_migrate.mjs`
(22/22). Bundle byte-1:1.
