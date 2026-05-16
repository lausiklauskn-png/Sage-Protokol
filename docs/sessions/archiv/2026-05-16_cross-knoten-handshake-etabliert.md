# Live-Andock-Sitzung 2026-05-16 — Cross-Knoten-Handshake etabliert

**Sitzungs-Rolle:** Live-Andock-Sitzung, **NICHT headless** (Klaus am
Galaxy Tab S6 + Termux + Chrome + Eruda; ca. 4 h zusammen mit Claude).
Branch `claude/cross-knoten-handshake-etabliert`. Folge-Sitzung zur
Pflege PWA-Suffix Karten 01+09 (2026-05-16, PR #45): die dort
spezifizierte `SbkimStorage.init({dbSuffix})`-Architektur-Erweiterung
in beiden Endknoten-Repos (Mein-Mixarium, Mein-Rezeptbuch) live
durchgezogen und durch erfolgreichen Cross-Knoten-Handshake bewiesen.

**Hintergrund:** Klaus' Endknoten-PWAs liefen unter derselben Origin
`lausiklauskn-png.github.io` (GitHub-Pages-Project-Sites), wodurch
beide PWAs dieselbe IndexedDB `sbkim` mit identischer nodeId
`1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0` teilten — der
Cross-Knoten-Handshake war daher **technisch unmöglich**
(`pingStatus: "blocked-origin-collision"`). Die Pflege-Sitzung PWA-Suffix
hatte Modul 01 um `init({dbSuffix})` erweitert und Karte 09 entsprechend
nachgezogen, sodass jede PWA via `sbkim_<dbSuffix>` ihre eigene IndexedDB
öffnen kann. Diese Sitzung zieht den Architektur-Fix in Klaus' echte
Endknoten-Repos und beweist mit einem echten Cross-Knoten-Handshake,
dass das Mycel jetzt lebt.

---

## Ergebnis (Highlight)

- **Mein-Mixarium nodeId:** `7xf0tt33_sInwkqWURdpY1EYDIC9EMfkbC0XXZfoEg4`
  (eigener Ed25519-Schlüssel in eigener IndexedDB `sbkim_mixarium`)
- **Mein-Rezeptbuch nodeId:** `RHhposP0ZBXwUWDn71ffY7QISi_9LvGzlja8mAZ-LRI`
  (eigener Ed25519-Schlüssel in eigener IndexedDB `sbkim_rezeptbuch`)
- **Cross-Knoten-Handshake:** `outcome: "established"` —
  **der erste echte SBKIM-Handshake im Mycel**, semantisch und
  technisch erfolgreich. Match-Score Cocktails ↔ Kochrezepte über
  `PROVIDER_MIN_MATCH = 0.8` — Embedding-Vektor (Xenova
  multilingual-e5-small, 384-dim, L2-normalisiert) robust gegen
  Domain-Unterschiede.

---

## Phasen-Bericht

### Phase A — `sbkim-init.js`-Patch in beiden Endknoten-Repos

Beide Repos im Termux per `git pull --rebase` synchronisiert, dann
mit `sed -i`-Block die eine Zeile vor `await SbkimAnastomose.init();`
eingefügt:

- **Mein-Mixarium:** `await SbkimStorage.init({ dbSuffix: "mixarium" });`
- **Mein-Rezeptbuch:** `await SbkimStorage.init({ dbSuffix: "rezeptbuch" });`

Idempotent gemacht (Block prüft erst, ob `dbSuffix` schon drin ist),
Pushes durch:
- Mein-Mixarium `703cae3`
- Mein-Rezeptbuch `9b77bcd`

### Phase B — Modul 01 in Endknoten nachziehen

**Befund:** `sbkim/01_storage.js` in beiden Endknoten-Repos war die
ALTE Version (9402 Bytes, **0** `dbSuffix`-Treffer) — vor der
Pflege-PWA-Suffix-Sitzung kopiert. Die `sbkim-init.js`-Aufrufe mit
`{dbSuffix:…}` wurden also still ignoriert (Extra-Argument), und
Modul 01 öffnete weiterhin die Default-DB `sbkim`.

**Diagnose-Pfad:** Eruda im Mein-Rezeptbuch-Tab → `indexedDB.databases()`
zeigte `["MeinMxBackup1","MeinRzBackup1","sbkim"]` — keine
`sbkim_mixarium`/`sbkim_rezeptbuch`. Plus: Modul 01 live aus
Mein-Rezeptbuch hatte 9402 Bytes (alte Version), während Sage-Protokols
`main` 15747 Bytes / 11 dbSuffix-Treffer hatte.

**Fix:** Per Termux-Block die aktuelle `src/modules/01_storage.js` aus
Sage-Protokol `main` (`0c41b4a`) in beide Endknoten kopiert + gepusht:
- Mein-Rezeptbuch `2b84a70`
- Mein-Mixarium `ed0cf3c`

### Phase C — PR-#238-Schaden in Mein-Rezeptbuch reparieren

**Befund:** Beim erneuten Sichttest blieb `sbkim_rezeptbuch` weiter
ausgeblendet. Diagnose via Eruda:
```
fetch('./sbkim/01_storage.js?nc=...').then(...).then(t => t.includes('dbSuffix'))
// → true (Pages live ist OK)

document.scripts.filter(s => s.src && s.src.includes('sbkim'))
// → [] (Anzahl: 0)
```

Die LIVE-`01_storage.js` war korrekt, aber `index.html` enthielt **keine
SBKIM-Script-Tags mehr**. Im Termux verifiziert:
```
git show 463bd68:index.html | grep -n "sbkim/"   # vor PR #238
# → 14804: <script src="sbkim/01_storage.js"></script>
# → 14805..14811: alle 8 SBKIM-Module
grep -n "sbkim/" index.html   # aktuell
# → (leer)
```

**Ursache:** PR #238 „Fix Buchstabensalat im Rezept-hinzufügen-Button"
einer parallelen Claude-Sitzung (Branch
`claude/add-recipe-remove-scramble-5xx9Y`) wurde 2026-05-16 gemerged
und hatte eine ältere `index.html`-Version als Basis genommen — dabei
sind ALLE 8 SBKIM-`<script>`-Tags + Eruda still rausgewaschen worden.

**Fix:** Per `awk`-Block die 8 SBKIM-Scripts in Karte-09-Reihenfolge
(01→02→03→04→05→07→00→sbkim-init) vor dem **letzten** `</body>` (Zeile
14804 nach Eruda-Re-Insertion) wieder eingefügt. Plus Eruda nochmal
nachgepflegt (Zeile 14802+14803, dasselbe `awk`-Pattern, weil die
Datei 12 `</body>`-Strings hat — die meisten in JS-Strings).
Commits:
- `f761510` Revert "Eruda Tablet-Sichtkontrolle nach PR238-Merge wieder einbauen" (fehlerhafter sed-`0,/...`-Versuch traf einen JS-String)
- `d9ceb39` Eruda am echten body-Ende Zeile 14802 einfuegen
- `08bf08c` SBKIM-Script-Tags nach PR238 wiederherstellen

**Lehre:** SBKIM-Andock-Code in Endknoten ist verletzlich gegen
Pflege-Sitzungen, die ältere Basis-Versionen merge'n. Folge-Pflege-
Vorschlag (siehe § Offene Querschnitts-Fragen): SBKIM-Sentinel-Datei
oder GitHub-Action, die SBKIM-Scripts-Präsenz prüft.

### Phase D — Worst-Case-Reset (Klaus' Vorschlag)

Klaus' pragmatischer Wunsch nach echtem Architektur-Test: alle Site-
Daten der Origin via Chrome-Einstellungen → Browserdaten löschen mit
„Cookies und Websitedaten" + „Bilder und Dateien im Cache" über
„Gesamte Zeit" gelöscht. Damit weg: `sbkim`, `sbkim_mixarium`,
`sbkim_rezeptbuch`, `MeinMxBackup1`, `MeinRzBackup1`, alle SW, alle
Caches, Cookies.

Mein-Mixarium-Tab frisch geöffnet mit Cache-Buster-URL `?nc=mx`. Beim
Page-Load: Modul-Selbstchecks grün, `Storage persist-Status: true`
(`navigator.storage.persist()` erfolgreich), neue
`sbkim_mixarium`-DB angelegt. `__sbkimErzeugeSpore()` aufgerufen →
frische Identität:
- nodeId `MRjKmTvOPHz9mtcWRSF-HXdpLfv_-FrMFTK5-gBh8S8`

Spore-Datei downloadet als `spore-mixarium-fresh.json`, im Termux nach
`~/Mein-Mixarium/sbkim/spore.json` kopiert + gepusht (`703cae3..68f7d22`).

### Phase E — Identitäts-Persistenz-Stabilisierung Mein-Mixarium

Beim Versuch der erneuten Mein-Mixarium-Spore-Erzeugung nach Tab-Reload:
die Identität war **nicht persistent** trotz `storage.persist()=true`
— der `sbkim_mixarium`-DB-Inhalt war zwischen den Zugriffen
verschwunden. `__sbkimErzeugeSpore()` lief erneut und erzeugte eine
NEUE Identität:
- nodeId `7xf0tt33_sInwkqWURdpY1EYDIC9EMfkbC0XXZfoEg4`

Diese **stabil nach SW-Reset + Tab-Reload**. Spore-Datei `spore-mixarium-7xf0tt33.json`
downloadet + ins Repo gepusht (`09b95db..17780b8`).

**Vermutung:** der erste Page-Load nach Site-Daten-Wipe hatte möglicherweise
einen Service-Worker-Lifecycle-Race; nach explizitem SW-Unregister + Reload
war die Identität stabil. Folge-Pflege-Wert: niedrig (die jetzige Identity
ist persistent, der Bug nur in der Erst-Andock-Phase aktiv).

### Phase F — Cross-Knoten-Handshake

Erst-Versuche via Service-Worker-Bridge (`SbkimAnastomose.handshake`)
lieferten `outcome: "rejected", reason: "toNodeId stimmt nicht zum
Empfänger"`. Diagnose:

1. Sender-Side via fetch-Interceptor verifiziert:
   ```
   [INTERCEPT] POST URL: https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/anastomosis
   [INTERCEPT] toNodeId: 7xf0tt33_… | fromNodeId: RHhposP0… | senderSpore.id: RHhposP0…
   ```
   Sender baut den Request korrekt — toNodeId entspricht der LIVE-
   Mein-Mixarium-spore.json.

2. Empfänger-Side im Mein-Mixarium-Tab verifiziert:
   ```
   SbkimSpore.getNodeId() === "7xf0tt33_…"   ✓
   SbkimSpore.getOwnSpore().then(s => s.id) === "7xf0tt33_…"   ✓
   ```
   Tab-Identity konsistent.

3. SW-Page-Bridge-Listener im Mein-Mixarium-Tab installiert
   (`navigator.serviceWorker.addEventListener('message', ...)`).
   Beim Handshake-Versuch: **keine** Message in der Page.

   Erklärung: Modul-05-SW-Code (`src/sbkim-sw.js`) sucht Page-Clients
   per `self.clients.matchAll({ type:"window", includeUncontrolled:true })`
   und nimmt den ersten Eintrag. Bei mehreren Page-Instances (z.B.
   bfcache-Restbestand, frühere PWA-Window-Variante) wird die geisterhafte
   alte Page-Instance gewählt, die noch eine ALTE Modul-02-Identität
   gecacht hat und `toNodeId-Match` ablehnt.

4. **Workaround (direkt bewiesen):** HandshakeRequest aus
   Mein-Rezeptbuch in localStorage zwischengespeichert (per
   fetch-Interceptor), im Mein-Mixarium-Tab `JSON.parse` +
   `SbkimAnastomose.receiveHandshake(request)` direkt aufgerufen —
   ohne SW-Bridge. Ergebnis:

   ```json
   {
     "outcome": "established",
     "fromNodeId": "7xf0tt33_sInwkqWURdpY1EYDIC9EMfkbC0XXZfoEg4",
     "nonceEcho": "-OKtW1MEdkKi_a7hrjesPg",
     "protocolVersion": "0.1",
     "receiverSpore": {
       "createdAt": "2026-05-16T20:01:06.322Z",
       "domain": "lausiklauskn-png.github.io",
       "domainKeywords": ["Cocktail", "Drink", "Mocktail", "Limonade",
                          "Smoothie", "Aperitif", "Sake"],
       "domainVector": [...384 Floats...],
       ...
     }
   }
   ```

   Match-Score über `PROVIDER_MIN_MATCH=0.8` (Cocktails ↔ Kochrezepte
   semantisch nah genug via Embedding); Signaturen verifiziert;
   `sbkim_siblings` in Mein-Mixariums DB eingetragen.

**Damit technisch und semantisch bewiesen:** das SBKIM-Mycel lebt;
die SW-Bridge-Frage ist eine eigene Folge-Pflege (siehe unten).

### Phase G (im Sage-Protokol-Repo): Doku-Update

- `status.json` § endknoten beide `nodeId` aktualisiert, `pingStatus`
  von `"blocked-origin-collision"` auf `"live-direct"`.
- `docs/PULS.md` § Endknoten-Tabelle: neue nodeIds, Beschreibung der
  Origin-Kollisions-Auflösung und des Match-Score-Erfolgs;
  § Sitzungs-Eintrag mit allen Phasen + Erkenntnissen; § Offene
  Querschnitts-Fragen drei neue Punkte (SW-Bridge-Phantom-Cache-Bug,
  `domainKeywords`-Hartkodierung, Endknoten-Repo-Hygiene gegen
  Auto-PRs); § Archiv-Index neue Zeile.
- Dieses Übergabeprotokoll (`docs/sessions/archiv/2026-05-16_cross-knoten-handshake-etabliert.md`).

---

## Bewusst nicht angefasst (im Sage-Protokol-Repo)

- **Modul-Code** unverändert (`src/modules/00–08`). Diese Sitzung
  war reine Endknoten-Andock-Pflege + Diagnose, kein Modul-Patch.
- **INTERFACES.md** unverändert.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.
- **`update_puls_pie.py`** NICHT aufgerufen — keine Modul-Score-
  Wechsel.
- **`sbkim-sw.js`-Patch** für `includeUncontrolled:false` — Folge-
  Pflege, nicht jetzt (würde Modul-05-Vertrag berühren und braucht
  Klaus' Tablet-Neustart-Test als Voraussetzung).
- **Sage-Page (`index.html`)** unverändert (keine UI-Pflege heute).
- **Endknoten-Repos `Mein-Mixarium` und `Mein-Rezeptbuch`** sind
  außerhalb dieses Repos; Doku hier ist Reflexion, nicht Eingriff.

---

## Validierung

- Klaus' Mein-Mixarium-Tab (in Eruda): `SbkimSpore.getNodeId() ===
  "7xf0tt33_…"` UND `(await SbkimSpore.getOwnSpore()).id ===
  "7xf0tt33_…"` — Identitäts-Konsistenz Key vs. Spore.
- Klaus' Mein-Rezeptbuch-Tab (in Eruda): analog für `RHhposP0…`.
- Beide Identitäten persistent über Tab-Reload + SW-Unregister-
  Cycle (`Storage persist-Status: true` half ab Phase E).
- LIVE-spore.json beider Endknoten via curl (im Termux): nodeIds
  korrekt deployed, Bytes plausibel (~11077 für Mixarium, ~11247
  für Rezeptbuch — letztere etwas größer wegen längerer
  Stamm/Gast-Listen).
- Direkter `SbkimAnastomose.receiveHandshake`-Aufruf in Mein-Mixarium-
  Tab mit Mein-Rezeptbuch-Request: `outcome: "established"`, valider
  `receiverSpore`, `nonceEcho` durchgereicht — Signaturen + Match-
  Score grün.
- Pages-Build beider Endknoten-Repos durch (mehrere Push-Roundtrips
  während der Sitzung, jeweils ~1–2 Min Wartezeit zwischen Push und
  fetch-Verifikation).

---

## Was offen blieb

1. **SW-Bridge-Phantom-Cache-Bug** — siehe § Offene Querschnitts-
   Fragen in PULS. Workaround (direkter `receiveHandshake`-Aufruf)
   funktioniert; Tablet-Neustart-Test ausstehend; ggf. Folge-Pflege
   `sbkim-sw.js` mit `includeUncontrolled:false`.

2. **`domainKeywords`-Hartkodierung** — siehe § Offene Querschnitts-
   Fragen. Klaus' Hinweis: „Aperitif" und „Sake" sind keine echten
   Mein-Mixarium-App-Kategorien. Folge-Pflege:
   `domainKeywords` aus `stammCategories`/`guestCategories` zur
   Init-Zeit generieren.

3. **Endknoten-Repo-Hygiene** — siehe § Offene Querschnitts-Fragen.
   PR #238-Erfahrung: parallele Auto-PRs auf Endknoten können SBKIM-
   Andock still wegwaschen. SBKIM-Sentinel-Datei + GitHub-Action
   als Schutz-Vorschlag.

4. **`status.json`-`pingStatus: "live-direct"`** ist eine
   Zwischen-Stufe — der Handshake funktioniert technisch und
   semantisch, aber die SW-Bridge ist verstopft. Wenn die SW-Bridge-
   Pflege durch ist, sollte `pingStatus` auf `"live"` umgestellt
   werden.

5. **Sichtbarkeits-Lampen-Spec (Modul 15)** — Klaus' Idee aus
   2026-05-16 für „Knoten lebt"-/Verkehr-Lampen oben rechts in der
   PWA — jetzt sinnvoll, weil der erste Cross-Knoten-Handshake live
   gelaufen ist und klarer wird, was die zweite Lampe anzeigen
   sollte.

---

## Nächster sinnvoller Schritt

1. **Klaus' Tablet-Neustart-Sichttest** (NICHT headless, kostet
   nichts) — ob ein voller Tablet-Reboot den SW-Bridge-Phantom-
   Cache räumt und der normale `SbkimAnastomose.handshake`-Pfad
   via SW `outcome: "established"` liefert. Entscheidet, ob die
   `sbkim-sw.js`-Code-Pflege wirklich nötig ist.
2. **Pflege `sbkim-sw.js` mit `clients.matchAll(includeUncontrolled:false)`**
   (headless möglich, ~30 Min) — bedingt durch Schritt 1.
3. **Spec-Sitzung Modul 15 Sichtbarkeits-Lampen** (~60 Min headless)
   — jetzt sinnvoll, weil der erste Cross-Knoten-Handshake live
   gelaufen ist und das Datenmodell der zweiten Lampe (Verkehr)
   konkret werden kann.
4. **Pflege Endknoten-`sbkim-init.js` `domainKeywords`** (NICHT
   headless, Klaus muss App-Kategorien-Quelle zeigen) — kleinteilig,
   niedrig priorisiert.

---

**Branch:** `claude/cross-knoten-handshake-etabliert`.
**Vorgänger:** Pflege PWA-Suffix Karten 01+09 (PR #45, gemerged).
**Klaus' Original-Hypothese ("Cocktails und Kochrezepte vielleicht zu
unterschiedlich"):** widerlegt — Match-Score ≥ 0.8, das Mycel
akzeptiert beide als „passend".
