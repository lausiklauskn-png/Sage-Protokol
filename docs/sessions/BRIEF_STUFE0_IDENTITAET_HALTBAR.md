# BRIEF — Stufe 0: die Identität haltbar machen

**Angelegt:** 2026-07-29 · **Auslöser:** Klaus' Mycel-Analyse vom 2026-07-29, 17:29–17:42
**Vorgänger:** Schutz-Plan Stufe 1 + 2 (Kimboard, gebaut) und Stufe 2b (Modul 23, PR #744, gemergt)
**Status:** offen — noch nichts gebaut

---

## Warum dieser Brief existiert

Der Schutz-Plan für das Mycel hat als nächsten Schritt **Stufe 3 — „Bekannte bevorzugen"**
vorgesehen. Klaus' Mycel-Analyse hat gezeigt, dass das auf Sand steht: **die Identität eines
Knotens überlebt die Sitzung nicht.** Ein „Bekannter" trägt beim nächsten Öffnen eine andere
Kennung. Damit wären Bezeugung (4c) und der geschlossene Kreis (Stufe 5) wertlos — die
Bekanntschaft würde jeden Tag von vorn anfangen.

**Stufe 0 kommt deshalb vor Stufe 3.** Sie ist das Fundament unter dem Fundament.

**Klaus' Entscheid 2026-07-29:** nicht mehr in der Analyse-Sitzung bauen, sondern frisch
starten — weil Stufe 0a eine **Messung** ist, deren Ergebnis über Nacht entsteht und erst
dann entscheidet, was in 0b richtig ist.

---

## Pflichtlektüre (in dieser Reihenfolge, vor jeder Zeile Code)

1. `CLAUDE.md` — insbesondere § SITZUNGSSTART-PFLICHT (immer von `origin/main`),
   § Freibrief (gilt, auch fürs Selbst-Mergen), § Fremdnutzer-/Marktplatz-Brille.
2. `docs/PULS.md` — oberster Eintrag „Stand 2026-07-29 (Abend)".
3. **Diesen Brief.**
4. `docs/sessions/archiv/2026-07-29_mycel-analyse-identitaetsverlust.md` — das
   Übergabeprotokoll mit der vollständigen Auswertung.
5. Nur die Dateien der jeweiligen Scheibe (siehe Anker-Tabelle unten).

---

## Das Faktenblatt — alles Gemessene, damit nichts neu hergeleitet werden muss

Quelle: `mycel-analyse-20260729T174256.json` (Mycel-Karte Analyse-Rekorder v1.3), Lauf
17:29:47–17:42:56 UTC, 43 Ereignisse. **Die Rohdatei liegt in Klaus' Downloads, nicht im
Repo.** Alle daraus nötigen Werte stehen hier.

**Fünf Knoten waren live**, Anmelde-Reihenfolge: BookLedgerPro 17:30:06 · Jasons Tresor
17:30:51 · Mein Tresor 17:32:09 · Family Projekt 17:32:59 · Kimboard 17:37:11. Alle Karten
trugen den Gerätenamen „· Klaus Tablet". Zehn weitere Register-Knoten waren nicht geöffnet —
kein Befund, nur zu.

**Alle fünf Sporen sind kryptografisch gültig.** Nachgerechnet mit `node:crypto`:
Ed25519-Verify über kanonisches JSON ohne `signature`, plus
`nodeId === base64url(SHA-256(publicKey.x))`. Ergebnis 5/5 Signatur gültig, 5/5 Kennung passt
zum Schlüssel. Alle `protocolVersion: "0.2"`, `nodeType: "hybrid"`, verschiedene korrekte
`endpoint`s. **Nichts gefälscht.**

**Lebende gegen committete Kennung** — keine einzige steht im Register, auch nicht in
`previousNodeIds`:

| App | Register (`status.json`) | live 29.07. | cos(live, committet) | Beschreibung gleich? |
|---|---|---|---|---|
| BookLedgerPro | `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ` | `6oKgwHRpun_0Kh92UJIzi3EN2hNpRY2WcEEsVQ-ujeg` | 0.8337 | ja (Register v0.1, live v0.2 `embeddingSource:"content"`) |
| Jasons-Tresor | `lbUthjt-outt4ns4NJQI2TaMzubX4BzQJGp_Odx_vek` | `zHqjzJX55qa8xoO7-X5LKZGjfsJDHfbSXUhUE2rafGc` | 0.9155 | **nein** |
| Mein-Tresor | `feV3o4qJF58caokPJr_oajm9dcnKwGjVXzBum8M8icM` | `nmRebxCnsGEA5zjLnK9QkwmEfV3hV065FoJey-2SJMw` | 0.9144 | **nein** |
| Family Projekt | `XoYhjpgm0F_lWqmaygHEdStBUDGAl70wcOZR--NhhR4` | `eg23tVHt9LqzYBxpW07cqGR3sZxLJ02M-VR5PI3XRs0` | **1.0000** | ja |
| Kimboard | `1f9Jb7c3SEI8dUOtGR6_meMaOaPgbz2GWXMLmPCZMv8` | `vPg4z2CilqC9hus-petfdTuwwMbN2ezhAVIFj03g8bg` | 0.9880 | ja |

**Der schärfste Einzelbefund steht in der Family-Zeile:** der Vektor ist **exakt identisch**
zum committeten (1.0000), die Beschreibung ebenfalls — es ist **nur der Schlüssel** weg. Kein
Re-Embedding, keine Textänderung, nichts sonst kann das erklären. Reiner Identitätsverlust.

**Kennungswechsel über die Läufe:**

| App | 11.07. | 23.07. | 29.07. |
|---|---|---|---|
| BookLedgerPro | `itzsPCHy2x4…` | `ZAOvf9tZyYH9…` | `6oKgwHRpun_0…` |
| Family Projekt | — | `xMRGRZEwb6ED…` | `eg23tVHt9Lqz…` |

Fundstellen: `docs/meilenstein/2026-07-11_hub-unabhaengige-cross-knoten-qa.md:41`,
`docs/meilenstein/2026-07-23_multi-knoten-mesh-handshake.md:32-33`.

**Zwei Tresore, ein Vektor:** cos(Jasons live, Mein-Tresor live) = **exakt 1.000000**.
Alle anderen Live-Paare liegen bei 0.82–0.86 (das ist das e5-Grundrauschen, keine Ähnlichkeit).

**Andock-Verkehr:** 12 Anfragen, **3 Antworten** — alle von BookLedgerPro
(`outcome: established`, Scores 0.8290 / 0.8290 / 0.8265). Kimboard, Jasons-Tresor und
Mein-Tresor blieben stumm.

**Klaus hat nichts zurückgesetzt** — auf ausdrückliche Rückfrage: „nur geöffnet".

---

## Was NICHT die Ursache ist — bitte nicht neu vermuten

Die naheliegende Erklärung „die App erzeugt beim Verbinden jedes Mal neu" ist **geprüft und
falsch**:

- `connectAndAnnounce` (`23_rendezvous.js:581-612`) nimmt zuerst `getOwnLiveSpore()`; ist eine
  Identität da, wird sie angemeldet (`created:false`). Der `createIdentity`-Zweig läuft **nur**
  bei fehlender Identität.
- Auch der erzeugt nicht zwingend neu: `generateOwnSpore` (`02_spore.js:689-696`) lädt den
  vorhandenen Schlüssel und signiert die Spore **mit derselben nodeId** neu. Neuer
  Ed25519-Schlüssel nur bei wirklich leerem `sbkim_keys`.
- Der UI-Knopf „🧹 Aufräumen & neu anmelden" ruft `repairAndReconnect()` **ohne**
  `newIdentity` (`23_rendezvous_ui.js:867`) — **nicht** schlüssel-löschend.
  `cleanupSharedOrigin` löscht nur den geteilten Topf `sbkim`, nie `sbkim_<suffix>`.
  `{newIdentity:true}` ist in **keinem** Repo an einen Knopf verdrahtet.
- Die Apps haben **je eine eigene Schublade**: `sbkim_meintresor`, `sbkim_jasonstresor`,
  `sbkim_kimboard`, `sbkim_bookledgerpro-sbkim`. Keine Kollision.

**Schluss:** Der Schlüssel geht nicht beim Verbinden verloren, sondern **zwischen den
Sitzungen aus dem Browser-Speicher**.

---

## Der zu prüfende Verdacht

`navigator.storage.persist()` wird gerufen (`01_storage.js:363`), das Ergebnis landet in
`_meta.storagePersisted` — und wird **nirgends angezeigt**. Es wandert nur in den
Membran-Schnappschuss (`15_membran.js:1035-1041`), den kein Mensch je sieht.

Auf Android-Chrome antwortet `persist()` einer bloß im Tab geöffneten `github.io`-Seite
typischerweise mit **false**. Dann ist der Speicher „best effort" und darf vom System geräumt
werden. Das passt zu allem: Code korrekt, Nutzer hat nichts gelöscht, Kennung trotzdem weg.

**Das ist ein Verdacht, kein Beweis.** Deshalb steht Messen vor Reparieren.

---

## Der Auftrag

### Stufe 0a — messen, bevor repariert wird ⭐ zuerst

Das Netz-Panel bekommt zwei Zeilen. **Beide Werte existieren bereits**, sie werden nur nicht
gezeigt:

- **„Meine Kennung: `6oKgwHRp…`"** — aus `getOwnSpore()`
- **„Speicher dauerhaft: ja / nein / unbekannt"** — aus `SbkimStorage._meta.storagePersisted`;
  bei „nein" mit einem Satz in Klaus-Sprache, was das heißt und was hilft

Fail-soft: fehlt der Wert (`null`), steht „unbekannt" da, nie ein Fehler, nie ein toter Knopf
(Fremdnutzer-/Marktplatz-Brille).

**Danach ⛔ STOPP.** Klaus misst über Nacht: App öffnen → Kennung notieren → Hard-Reload →
gleiche Kennung? → App schließen → **am nächsten Tag** wieder öffnen → immer noch gleich?
Erst dieses Ergebnis entscheidet, was 0b tun muss.

### Stufe 0b — die Identität haltbar machen (NACH der Messung)

Drei Hebel, in dieser Reihenfolge:

1. **App auf den Startbildschirm legen (installieren).** Der einzige Hebel, der Chrome auf
   Android dazu bewegt, `persist()` mit `true` zu beantworten. **Kein Code** — Anleitung plus
   Hinweis im Panel genau dann, wenn nicht persistiert wird.
2. **Sicherung anbieten, wenn keine existiert.** `exportBackup` (Modul 02, PBKDF2-SHA256 600k
   + AES-GCM-256) ist gebaut und im Andock-Wizard verdrahtet. Es fehlt nur der Hinweis „für
   diesen Knoten gibt es noch keine Sicherung" und ein Klick dorthin.
3. **Wiederherstellen sichtbar machen.** `importBackup` existiert; der Weg dahin gehört ins
   Netz-Panel, nicht nur tief in den Wizard.

**Ehrliche Grenze, die in die Bedienoberfläche gehört:** Aus dem Browser heraus lässt sich eine
Räumung **nicht verhindern**, nur unwahrscheinlicher machen (Installation) und der Verlust
**reparierbar** halten (Sicherung). Das ist keine Fehlfunktion, sondern die Eigenschaft des
Speichers — und es muss so dastehen.

### Stufe 0c — Schubladen-Widerspruch in BookLedgerPro heilen (unabhängig, sofort machbar)

`window.SBKIM_DB_SUFFIX = "bookledgerpro-sbkim"` (`index.html:54`) steht gegen den
Modul-23-Aufruf `dbSuffix: "bookledgerpro"` (`sbkim/sbkim-init.js:239`, `:242`).

Folge: `ensureIdentity()` versucht auf `sbkim_bookledgerpro` umzuschwenken, wird von
`repointOrReject` (`01_storage.js:472-496`) korrekt abgewiesen, der Wurf wird fail-soft
geschluckt. Der Schlüssel bleibt richtig liegen — aber die **Hygiene- und Migrations-Proben
fragen eine DB ab, die es nicht gibt**, legen sie dabei kurz an und löschen sie wieder. Der
Schutzmechanismus läuft in BLP ins Leere.

Ein Wert, an einer Stelle. **Vorsicht:** den *bestehenden* Suffix behalten
(`bookledgerpro-sbkim`) und den Modul-23-Aufruf angleichen — nicht umgekehrt, sonst ist die
vorhandene Identität nicht mehr auffindbar.

### Stufe 0d — die zwei Tresore unterscheidbar machen (unabhängig, sofort machbar)

**Ursache, wörtlich gefunden** — `sbkim/sbkim-init.js:107-108` ist in **beiden** Repos
zeichengleich:

```js
domainDescription: "Verwahrt und verschlüsselt JSON-Dateien und SBKIM-Schlüssel offline; Bibliothek/Tresor.",
domainKeywords: ["Tresor","Verschlüsselung","AES","Geheimfach","Bibliothek","Offline","Datenschutz","JSON","Schlüssel"],
```

und der Einbettungstext besteht **nur** aus diesen beiden Feldern (`:116`):

```js
embedPassage(RDV_CFG.domainDescription + ". " + RDV_CFG.domainKeywords.join(", "))
```

Der einzige Unterscheider `RDV_CFG.domain` geht **nicht** in den Vektor — er wird erst danach
als Metadaten-Feld angehängt. Gleicher Eingabetext + deterministisches Modell = Cosinus 1,0.
Kein Bug im Match, sondern die logische Folge.

**Verschärfend:** Die guten, verschiedenen Beschreibungen liegen längst in beiden Repos
(`sbkim/spore.json` vom 19.07., `assets/siegel-inhalt.js:41`) — der 🌐-Anmelde-Pfad liest sie
**nie**. Nur der manuelle Andock-Wizard benutzt sie.

**Fix:** in `sbkim/sbkim-init.js` die eigene, reiche Beschreibung verwenden statt der
generischen — **eine** Quelle je App, kein zweiter Text. Den generischen Satz auch in
`Jasons-Tresor/scripts/generate_spore.mjs:25` mitziehen.

**Gegenprobe verpflichtend:** der Cosinus der beiden Live-Sporen muss danach deutlich unter
1,0 liegen. Weil sich der Vektor ändert, muss der `matchScore` im Register nachgezogen werden.

### Stufe 0e — das Register ehrlich machen

- **BookLedgerPros Eintrag ist veraltet, nicht die App:** Register führt v0.1 vom 21.06., live
  läuft v0.2 mit inhaltstreuem Vektor. Hier ist die Tabelle schlechter als die Wirklichkeit.
- In `status.json` und `sbkim/NETZ-STAND.md` ausdrücklich trennen: **committete** Identität
  (was das Register führt) gegenüber **lebender** Identität (was im Raum steht). Modul 23 löst
  das zur Laufzeit über den Namen — das ist so gebaut, steht aber nirgends klar.

---

## Anker-Tabelle — wo genau angefasst wird

**Pflicht vorab (CLAUDE.md § Sitzungsstart):** je Repo `git fetch origin main --quiet`, dann
`git checkout -B <branch> origin/main`. Die Klone im Container können Monate alt sein. Die
Zeilennummern sind gegen `origin/main` vom 2026-07-29 geprüft und können sich verschieben —
im Zweifel am Symbolnamen suchen, nicht an der Zeile.

| Repo | Datei | Anker | Wofür |
|---|---|---|---|
| Kimboard | `assets/rendezvous-init.js` | `CFG` :30-37, `createIdentity` :45-117 | 0a |
| Kimboard | `index.html` | `SBKIM_DB_SUFFIX = "kimboard"` :365 | Kontrolle (konsistent ✅) |
| BookLedgerPro | `sbkim/sbkim-init.js` | `RDV_CFG` :136-143, `rdvCreateIdentity` :193-229 | 0a |
| BookLedgerPro | `sbkim/sbkim-init.js` | `dbSuffix:"bookledgerpro"` :239, :242 | **0c** |
| BookLedgerPro | `index.html` | `SBKIM_DB_SUFFIX="bookledgerpro-sbkim"` :54 | **0c (Gegenstück)** |
| Mein-Tresor | `sbkim/sbkim-init.js` | `RDV_CFG` :102-109, Einbettung :116, Callback :110-124 | 0a + **0d** |
| Mein-Tresor | `assets/siegel-inhalt.js` | reiche Beschreibung :41 | **0d (Quelle)** |
| Jasons-Tresor | `sbkim/sbkim-init.js` | `RDV_CFG` :102-109, Einbettung :116 | 0a + **0d** |
| Jasons-Tresor | `assets/siegel-inhalt.js` | reiche Beschreibung :41 | **0d (Quelle)** |
| Jasons-Tresor | `scripts/generate_spore.mjs` | generischer Satz :25 | 0d mitziehen |
| family-project | `sbkim/sbkim-init.js` | `RDV_CFG` (Symbol suchen) | 0a |
| alle | `01_storage.js` | `requestStoragePersist` :347-380, `_meta.storagePersisted` :1286 | 0a — Wert existiert schon |
| alle | `sbkim/23_rendezvous_ui.js` | Panel-Render | 0a (Anzeigeort) |
| Sage | `status.json`, `sbkim/NETZ-STAND.md` | BLP-Eintrag | 0e |

**Unantastbar (Drift-Guard byte-1:1):** `23_rendezvous.js`, `01_storage.js`, `02_spore.js`,
`04_match.js`, `05*_*.js` in allen Repos. Alle Änderungen gehören in den **app-eigenen
Klebstoff** (`sbkim-init.js` / `rendezvous-init.js` / `23_rendezvous_ui.js`). Die UI-Datei ist
in mehreren Repos ebenfalls byte-1:1 aus dem Sage-Kanon — dann muss die Änderung **zuerst in
Sage** und danach byte-kopiert werden, sonst wird der Drift-Guard rot.

**Reihenfolge mit Sperre:**

```
0a (alle Repos)  →  ⛔ KLAUS MISST (über Nacht)  →  0b
0c · 0d · 0e sind unabhängig und können sofort nach 0a laufen.
```

---

## Akzeptanzkriterien

| Stufe | Nachweis |
|---|---|
| 0a | Panel zeigt Kennung + Speicher-Status; fehlender Wert → „unbekannt", kein Fehler |
| 0a | Klaus: öffnen → Kennung notieren → Hard-Reload → gleich? → nächster Tag → gleich? |
| 0b | Ohne Sicherung erscheint der Hinweis, mit Sicherung nicht. Gegenprobe: Sicherung einspielen → **alte** Kennung ist zurück |
| 0c | In BLP zeigt `SbkimStorage._meta` genau eine Schublade; keine Phantom-DB `sbkim_bookledgerpro` wird mehr angelegt |
| 0d | Zwei Live-Sporen der Tresore: Cosinus **deutlich unter 1,0**. Gegenprobe dokumentieren: vorher exakt `1.000000` |
| 0e | `status.json` gegen eine frische Analyse gehalten — BLP v0.2, Trennung committet/lebend benannt |
| immer | Smoke-Suiten der berührten Repos + Drift-Guards grün |
| immer | **Klaus' Browser-Sichttest** — headless ersetzt ihn nicht |

---

## Was ausdrücklich NICHT in diesen Auftrag gehört

- **Der stumme Antworter** (12 Anfragen, 3 Antworten). Bekannte Rest-Grenze: der antwortende
  Tab muss vorn und wach sein; auf einem Tablet kann von fünf offenen Apps immer nur eine
  antworten. Eigenes Thema, eigener Brief.
- **Modul 23 / Modul 01 / Modul 02 anfassen.** Alles hier ist app-eigener Klebstoff und
  Anzeige.
- **Stufe 3–6 des Schutz-Plans** (Bekannte bevorzugen, Themen-Mycel, Wächter-Quorum,
  Stufen-Schalter, netzweiter Rollout). Die kommen **nach** Stufe 0.
- **Die zehn Knoten, die nicht im Raum waren.** Sie waren nicht geöffnet. Kein Befund.

---

## Freibrief

Klaus' stehender Freibrief gilt (siehe `CLAUDE.md` § Freibrief): selbstständig handeln,
merken und **eigene PRs selbst mergen**, sobald getestet, abgegrenzt und nicht architektonisch
zweifelhaft — netzweit für alle Repos. Grenze bleibt das echte Zweifeln → dann Klaus fragen.
Nie stillschweigend: jede eigene Entscheidung wird dokumentiert.

**Achtung bei Stufe 0a:** die Messung ist eine bewusste Sperre, kein Zweifel. 0a bauen und
mergen ist vom Freibrief gedeckt; **0b vor Klaus' Messergebnis zu bauen ist es nicht.**

---

## Pflicht am Abschluss dieser Folge-Sitzung

1. `docs/PULS.md` fortschreiben (getan / offen / nächste Schritte).
2. Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`.
3. **Neuen Brief** für die Folge-Sitzung anlegen und **vollständig als Codeblock im Chat**
   ausgeben — die Brief-Kette reißt nie ab.
4. „Nächste Schritte"-Block direkt in der Chat-Antwort (2–4 priorisierte Punkte).
5. Bei gebauten Änderungen mit Andock-Bezug: `sbkim/SIGNAL.json` pflegen (`seq` +1) — das
   Pushen IST das Signal.
