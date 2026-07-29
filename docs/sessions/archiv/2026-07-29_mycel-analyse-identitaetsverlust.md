# Übergabeprotokoll 2026-07-29 — Mycel-Analyse: Identitätsverlust + Schutz-Plan Stufe 2b

**Rolle:** Bau-Sitzung (Modul 23, Schutz-Plan Stufe 2b) + Analyse-Sitzung (Klaus'
Mycel-Analyse-Rekord).
**Branch:** `claude/apps-followed-charlie-5z0lcc`
**PRs:** #744 (Stufe 2b, gemergt) · dieser Doku-PR

---

## Teil 1 — Gebaut: Schutz-Plan Stufe 2b (Echtheit der Karten, Modul 23)

### Befund

`discover()` hat fremde Visitenkarten **ungeprüft** angezeigt. Geprüft wurde nur, ob die
Felder vorhanden sind — **nie**, ob die Spore echt ist (`verifyForeignSpore` fehlte ganz), und
**nie**, ob die Karte überhaupt ihre eigene Spore trägt. Dazu keine Mengengrenze. Folge: jeder
konnte sich unter fremdem Namen ins Brett hängen; ein Fluter konnte den Raum füllen.

### Umsetzung

Tafeln zuerst (CLAUDE.md § Heilige Tafeln): `docs/INTERFACES.md` (neue Konstanten + Block
„ECHTHEIT DER KARTEN") und `docs/components/23_rendezvous.md` (§ Echtheit der Karten). Dann
`src/modules/23_rendezvous.js`:

- **Bindungs-Prüfung** `card.spore.id === card.nodeId` — braucht keine Krypto, wirkt immer.
- **Ed25519-Prüfung je Karte** über Modul 02 `verifyForeignSpore`, mit getrenntem Resolver
  `resolveVerifier()` (der bestehende verlangt nur `getOwnSpore`; eine App darf ein
  Spore-Modul ohne Prüfer mitbringen). Läuft **nach** dem Lauschfenster, weil async.
- **Mengen-Deckel** `RDV_CARDS_MAX = 200` je Durchlauf, `RDV_CARDS_PER_SENDER_MAX = 3`
  Identitäten je Nostr-Absender. Still verwerfen.
- **Ehrlich statt still:** ohne Prüfer läuft der Raum weiter, meldet die Karten aber als
  `cardsVerified: false` UNGEPRÜFT; `rejected` zählt mit.

TABU eingehalten: `PROVIDER_MIN_MATCH` / 0.80-Riegel unberührt, Kern-Module 02/05/05b
unangetastet, kein `PROTOCOL_VERSION`-Bump. Byte-Kopie `sbkim-bundle/` mitgezogen.
`ZERTIFIKAT_ASPEKTE`-Eintrag 2026-07-29 / Modul 23 in `src/modules/16_siegel.js` ergänzt.

### Beweis

`tests/smoke_bau23b_kartenechtheit.mjs` **16/16 grün** — als eigener Test angelegt, weil der
Mock in `smoke_bau23_rendezvous.mjs` nur `getOwnSpore` kann und jene 59 Proben deshalb am
fail-soft-Pfad **vorbeilaufen**, die neue Prüfung also gar nicht ausführen. Probe 5 ist die
eingebaute Gegenprobe: dieselbe faule Karte bleibt sichtbar, sobald der Prüfer fehlt.
Regress-frei: bau23 59/59, bau23_ui 83/83, `smoke_bundle_connect` 21/21, Siegel-Smokes
9/9 · 9/9 · 5/5 · 16/16.

**Browser-Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf.**

---

## Teil 2 — Analysiert: Klaus' Mycel-Analyse-Rekord vom 2026-07-29

Klaus lieferte `mycel-analyse-20260729T174256.json` (Analyse-Rekorder v1.3, Lauf
17:29:47–17:42:56 UTC, 43 Ereignisse) mit der Vermutung, es seien „einige Sporen verloren
gegangen oder vielleicht sogar in Identitäten". **Die Vermutung bestätigt sich.**

### Was gemessen wurde

**Fünf Knoten live**, Anmelde-Reihenfolge: BookLedgerPro 17:30:06 · Jasons Tresor 17:30:51 ·
Mein Tresor 17:32:09 · Family Projekt 17:32:59 · Kimboard 17:37:11. Alle Karten mit
Gerätenamen „· Klaus Tablet". Zehn weitere Register-Knoten waren nicht geöffnet — kein Befund.

**Alle fünf Sporen kryptografisch gültig.** Nachgerechnet mit `node:crypto` (Ed25519-Verify
über kanonisches JSON ohne `signature`, plus `nodeId === base64url(SHA-256(publicKey.x))`):
5/5 Signatur gültig, 5/5 Kennung passt zum Schlüssel. Alle `protocolVersion: "0.2"`,
`nodeType: "hybrid"`, verschiedene korrekte `endpoint`s. **Nichts gefälscht** — und die frisch
gebaute Stufe-2b-Prüfung hätte keine davon fälschlich abgewiesen.

**Keine der fünf lebenden Kennungen steht im Register** — auch nicht in `previousNodeIds`:

| App | Register | live 29.07. | cos(live, committet) | Beschreibung gleich? |
|---|---|---|---|---|
| BookLedgerPro | `MyHVM7Pd…` | `6oKgwHRpun_0Kh92UJIzi3EN2hNpRY2WcEEsVQ-ujeg` | 0.8337 | ja (Register v0.1, live v0.2 `embeddingSource:"content"`) |
| Jasons-Tresor | `lbUthjt-…` | `zHqjzJX55qa8xoO7-X5LKZGjfsJDHfbSXUhUE2rafGc` | 0.9155 | **nein** |
| Mein-Tresor | `feV3o4qJ…` | `nmRebxCnsGEA5zjLnK9QkwmEfV3hV065FoJey-2SJMw` | 0.9144 | **nein** |
| Family Projekt | `XoYhjpgm…` | `eg23tVHt9LqzYBxpW07cqGR3sZxLJ02M-VR5PI3XRs0` | **1.0000** | ja |
| Kimboard | `1f9Jb7c3…` | `vPg4z2CilqC9hus-petfdTuwwMbN2ezhAVIFj03g8bg` | 0.9880 | ja |

**Der schärfste Einzelbefund ist die Family-Zeile:** Vektor **exakt identisch** zum
committeten, Beschreibung ebenfalls — es ist **nur der Schlüssel** weg. Kein Re-Embedding,
keine Textänderung kann das erklären. Reiner Identitätsverlust.

**Kennungswechsel über die Läufe** (aus den Meilenstein-Doku):

| App | 11.07. | 23.07. | 29.07. |
|---|---|---|---|
| BookLedgerPro | `itzsPCHy2x4…` | `ZAOvf9tZyYH9…` | `6oKgwHRpun_0…` |
| Family Projekt | — | `xMRGRZEwb6ED…` | `eg23tVHt9Lqz…` |

**Zwei Tresore, ein Vektor:** cos(Jasons live, Mein-Tresor live) = **exakt 1.000000**. Alle
anderen Live-Paare liegen bei 0.82–0.86 (e5-Grundrauschen).

**Andock-Verkehr:** 12 Anfragen, **3 Antworten**, alle von BookLedgerPro
(`established`, 0.8290 / 0.8290 / 0.8265). Die drei anderen blieben stumm.

**Klaus hat nichts zurückgesetzt** — auf ausdrückliche Rückfrage: „nur geöffnet".

### Korrigierte Erst-Annahme (wichtig für die Folge-Sitzung)

Die Sitzung schrieb zunächst, die Apps würden sich „beim Verbinden neu erfinden". **Das ist
falsch und wurde gegenüber Klaus korrigiert.** Die Code-Prüfung zeigt:

- `connectAndAnnounce` (`23_rendezvous.js:581-612`) nimmt zuerst `getOwnLiveSpore()`; ist eine
  Identität da, wird sie angemeldet (`created:false`).
- `generateOwnSpore` (`02_spore.js:689-696`) lädt den vorhandenen Schlüssel und signiert **mit
  derselben nodeId** neu; neuer Schlüssel nur bei leerem `sbkim_keys`.
- „🧹 Aufräumen & neu anmelden" ruft `repairAndReconnect()` **ohne** `newIdentity`
  (`23_rendezvous_ui.js:867`) — nicht schlüssel-löschend. `cleanupSharedOrigin` löscht nur
  `sbkim`, nie `sbkim_<suffix>`. `{newIdentity:true}` ist an keinen Knopf verdrahtet.
- Vier Apps, vier eigene Schubladen — keine Kollision.

**Schluss:** Der Schlüssel geht **zwischen** den Sitzungen aus dem Browser-Speicher verloren,
nicht beim Verbinden.

### Der zu prüfende Verdacht

`navigator.storage.persist()` wird gerufen (`01_storage.js:363`), das Ergebnis liegt in
`_meta.storagePersisted` — und wird **nirgends angezeigt** (nur im Membran-Schnappschuss,
`15_membran.js:1035-1041`). Auf Android-Chrome antwortet `persist()` für eine bloß im Tab
geöffnete `github.io`-Seite typischerweise mit `false`; dann darf das System den Speicher
räumen. Passt zu allem. **Verdacht, kein Beweis** — messbar, sobald der Wert sichtbar ist.

### Zweiter, unabhängiger Befund: die zwei Tresore sind ein Knoten

`sbkim/sbkim-init.js:107-108` ist in Mein-Tresor und Jasons-Tresor **zeichengleich**
(derselbe generische `domainDescription`, dieselben neun Keywords), und der Einbettungstext
besteht **nur** aus diesen beiden Feldern (`:116`). Der einzige Unterscheider `domain` geht
nicht in den Vektor. Gleicher Eingabetext + deterministisches Modell = Cosinus 1,0. Die
guten, verschiedenen Beschreibungen liegen seit 19.07. in beiden Repos
(`sbkim/spore.json`, `assets/siegel-inhalt.js:41`) — der 🌐-Anmelde-Pfad liest sie **nie**.

### Dritter Befund: Schubladen-Widerspruch in BookLedgerPro

`window.SBKIM_DB_SUFFIX = "bookledgerpro-sbkim"` (`index.html:54`) gegen den
Modul-23-Aufruf `dbSuffix: "bookledgerpro"` (`sbkim/sbkim-init.js:239`, `:242`). Der Schlüssel
bleibt richtig liegen, aber die Hygiene-/Migrations-Proben fragen eine nicht existierende DB
ab, legen sie kurz an und löschen sie wieder — der Schutzmechanismus läuft ins Leere.

---

## Was offen blieb

- **Stufe 0 wurde bewusst NICHT gebaut.** Klaus' Entscheid: detailgetreu festhalten und in
  einer frischen Sitzung starten. Sachlicher Grund: Stufe 0a ist eine **Messung**, deren
  Ergebnis über Nacht entsteht und erst dann entscheidet, was 0b tun muss.
- **Klaus' Browser-Sichttest zu Stufe 2b** (Modul 23) steht aus.
- **Klaus' Browser-Sichttest zu Kimboard Stufen 1+2** (Echtheit der Zettel, Flut-Bremse,
  Absender-Sperre) steht ebenfalls noch aus.
- **Der stumme Antworter** (12 Anfragen, 3 Antworten) — bekannte Rest-Grenze, eigenes Thema.

## Nächster sinnvoller Schritt

`docs/sessions/BRIEF_STUFE0_IDENTITAET_HALTBAR.md` — der vollständige Auftrag mit
Faktenblatt, Anker-Tabelle und Akzeptanzkriterien. Reihenfolge dort:
`0a (alle Repos) → ⛔ Klaus misst über Nacht → 0b`; `0c · 0d · 0e` laufen unabhängig.
