# BRIEF — Zwei neue Endknoten: Kimseek (Suche) + Kimboard (Pinnwand)

**Datum:** 2026-07-09 · **Absender-Sitzung:** Identitäts-Hygiene / Kim-Bell-Bau
**Freibrief gilt** (siehe `CLAUDE.md` § Freibrief — selbstständig bauen & mergen,
wenn logisch/nützlich/nicht-zweifelhaft; bei echtem Zweifel Klaus fragen).

---

## Ziel (kurzfristig, konkret)

Zwei bestehende Sage-PWAs zu **eigenständigen SBKIM-Endknoten** in **eigenen Repos**
machen — nach dem **exakt bewiesenen Kim-Bell-Muster** (2026-07-08 live gebaut, Sage ↔
Kim-Bell Handshake „✓ ANDOCK ETABLIERT"):

1. **Kimseek** ← das **Such-Tool** `Sage-Protokol/such-tool/` (ist schon eine eigene,
   installierbare PWA). Repo: `lausiklauskn-png/kimseek`.
2. **Kimboard** ← die **Pinnwand** `Sage-Protokol/pinnwand/`. Repo:
   `lausiklauskn-png/kimboard`. (Kopieren vs. clonen: **kopieren** — 1:1 Dateien
   übernehmen, wie bei Kim-Bell; kein git-clone von Fremd-History.)

Beide bekommen mit den **Skills** `saubere-netz-anmeldung` + `status-leiste-siegel`
das volle Netz-Werkzeug (Siegel mit Andock-Wizard + „🌐 Mit dem Netz verbinden" +
Status-Lampen-Leiste), damit sie **selbst eine Identität + Spore erzeugen** und sich
server-los ans Mycel anmelden. Danach in **Sage** als **verbundene Knoten**
aufnehmen (NETZ-STAND + Knoten-Korpus).

**Warum:** jeder echte Endknoten erhöht `realScore` (Formel auf der Sage-Page:
`realScore = Hub(10) + Σ Module + Σ Endknoten(0..15)`, Demo-Anteil `100×(1−realScore/140)`).
Mit Kim-Bell + Kimseek + Kimboard sind es **3 neue Knoten** → wir erreichen die
**kritische Menge von 10 Endknoten** und der Demo-Balken geht weiter Richtung 0.

---

## Pflichtlektüre VOR dem Bau (in dieser Reihenfolge)

1. `CLAUDE.md` (Sage) — Verfassung + Freibrief.
2. **Skill `saubere-netz-anmeldung`** — Identitäts-Hygiene, Modus A/B, dbSuffix,
   Timeout 5 min, Fortschritts-Pflicht, Repair-Knopf gehört in jedes Panel.
3. **Skill `status-leiste-siegel`** — volles Siegel-Rezept (Lampen-Leiste 17 +
   Membran 15 + Bronze/Gold 16 + Andock-Wizard im Modal + selbst-gravierendes
   Wappen-Band via `ribbonText` + FUNDORT der Wappen-SVG).
4. **Das Kim-Bell-Repo als lebende Vorlage** (`lausiklauskn-png/kim-bell`): genau
   diese Struktur nachbauen.

---

## Die bewiesene Kim-Bell-Vorlage (1:1-Muster)

Kim-Bell ist ein self-contained Ordner. Struktur, die Kimseek/Kimboard brauchen:

```
index.html            ← lädt den Skript-Stack in der RICHTIGEN Reihenfolge (s.u.)
manifest.json         ← PWA
sbkim-sw.js           ← Service-Worker, network-first, CACHE_VERSION bumpen
impressum.html
sicherheit.html       ← Erklär-Overlay (aus SB-KIMTool-Point, PII neutralisiert)
icon-192.png / icon-512.png
sbkim/spore.json      ← ÖFFENTLICHE Spore (kommt NACH Klaus' Browser-Lauf)
.gitignore            ← *.sbkim.json, *-backup-*.json, sbkim/node_key*, sbkim/*.enc.json
modules/              ← byte-1:1-Kopien der SBKIM-Kern-Module (Drift-Guard im Smoke)
assets/               ← app-eigene Inits (dbSuffix + CFG anpassen)
test/smoke.test.js    ← sha256-Drift-Guard über modules/ + App-Schale-Checks
```

**`modules/` (byte-1:1 aus Kim-Bell bzw. Sage `src/modules`):**
noble-secp256k1.js · sbkim-storage(01) · sbkim-match(04) · sbkim-embedding(03) ·
sbkim-spore(02) · sbkim-anastomose(05) · sbkim-nostr-relay(05b, ES-Modul) ·
sbkim-rendezvous(23) · sbkim-rendezvous-ui(23-ui) · sbkim-floating-widget(17) ·
sbkim-apoptose(07) · sbkim-membran(15) · sbkim-siegel(16).
**PLUS** die tool-eigenen Module (bleiben, sind schon da): Kimseek behält 21/22/24,
Kimboard behält seine Pinnwand-Module.

**`assets/` (aus Kim-Bell, nur DB_SUFFIX + CFG ändern):**
- `storage-init.js` — `SbkimStorage.init({ dbSuffix: "<suffix>" })` DIREKT nach dem
  Storage-Kern. **Kimseek `kimseek`, Kimboard `kimboard`.**
- `rendezvous-init.js` — CFG (nodeName/domain/endpoint/domainDescription/keywords) +
  `createIdentity` (Modell-Fortschritt Pflicht: `ensureProgressEl`/`onProg`/`stopProg`).
- `schutz-init.js` — Reihenfolge **Widget(17) → Membran(15) → Siegel(16) + Apoptose(07)**;
  `SbkimSiegel.init({ badgeSelector:"#sbkim-siegel-badge", repoUrl, ribbonText:"<App-Name>" })`.
- `nostr-listen-init.js` — Empfangsmodus (lauscht, damit Gegenknoten andocken kann).
- `siegel-inhalt.js` — Andock-Werkzeug ins `#sbkim-siegel-modal` injizieren
  (🔑-Wizard 4 Schritte + Identitäts-Wechsler · ✍ Semantik · 🛡 Schutz + sicherheit.html-Overlay).
  **PFLICHT:** Prozent-Balken beim Modell-Laden in Wizard-Schritt 2 UND ✍ Semantik.

**Init-Reihenfolge in `index.html` (verbindlich):**
`modules/sbkim-storage` → `assets/storage-init` (Suffix!) → match/embedding/spore/
anastomose → `type=module` nostr-relay → rendezvous(+ui) → **floating-widget(17)** →
apoptose/membran/siegel → `assets/nostr-listen-init` → `assets/rendezvous-init` →
`assets/schutz-init` → `assets/siegel-inhalt`.

---

## Schritt 1 — Kimseek (aus `such-tool/`)

1. `such-tool/`-Inhalt 1:1 ins Repo `kimseek` (index.html/manifest/sbkim-sw.js/
   impressum/icons/modules 03,04,21,22,24). **Fehlende** Endknoten-Module aus
   Kim-Bell ergänzen (01,02,05,05b,07,15,16,17,23,23-ui,noble) + `assets/*` +
   `sicherheit.html` + `.gitignore` + `test/smoke.test.js`.
2. `index.html`: Skript-Stack in der obigen Reihenfolge einbauen; das Such-Widget
   (Modul 22) bleibt zusätzlich montiert.
3. `assets/storage-init.js` dbSuffix **`kimseek`**; CFG (rendezvous-init +
   siegel-inhalt) auf **Domäne „Semantische Bedeutungs-Suche"** setzen
   (nodeName „Kimseek", Stichworte: Suche, Bedeutung, Absicht, Cross-Knoten,
   semantisch, Embedding, server-los). `ribbonText: "Kimseek"`.
4. Smoke grün (`node --test`), SW `CACHE_VERSION` gesetzt.

## Schritt 2 — Kimboard (aus `pinnwand/`)

Analog aus `pinnwand/` ins Repo `kimboard`. dbSuffix **`kimboard`**;
Domäne „Pinnwand / Notizen / Merken / Sammeln"; nodeName „Kimboard";
`ribbonText: "Kimboard"`. Pinnwand-Module bleiben, Endknoten-Stack ergänzen.
**Achtung Origin-Hygiene:** beide neuen Apps liegen unter `lausiklauskn-png.github.io`
→ eigener dbSuffix ist Pflicht (sonst Kollision, siehe Skill).

## Schritt 3 — Anmelden + in Sage aufnehmen

1. **Klaus im Browser** (nach Deploy, hart neu laden): pro App „🔑 Identität & Spore"
   im Siegel-Wizard ODER „🌐 Mit dem Netz verbinden" → ID+Spore entstehen, Spore
   herunterladen → Session committet sie nach `<repo>/sbkim/spore.json`
   (öffentlich, KEIN privater Schlüssel; Backup bleibt bei Klaus, .gitignore schützt).
2. **Live-Handshake** Klaus: Sage ↔ Kimseek und Sage ↔ Kimboard („✓ ANDOCK ETABLIERT",
   Timeout steht auf 5 min).
3. **In Sage aufnehmen:** `sbkim/NETZ-STAND.md` + `sbkim/sage-knoten-korpus.js`
   um Kimseek + Kimboard ergänzen (Stufe `verified-match` nach dem Live-Handshake,
   mit nodeId + Endpoint + Domänen-Text). Ggf. `status.json`-Endknoten-Zahl +
   `docs/PULS.md` nachziehen (Demo-Anteil sinkt).

---

## Datenverträge / TABU (nicht brechen)

- `PROVIDER_MIN_MATCH` (0.80-Andock-Riegel), `PROTOCOL_VERSION`, `DB_VERSION`
  **unverändert**. Kern-Module 01/02/05/05b/23 werden **kopiert, nicht umgebaut**
  (Drift-Guard byte-1:1 im Smoke).
- **Kein PII, kein privater Schlüssel** im Repo. `.gitignore` wie Kim-Bell.
- Nur **öffentliche** `spore.json` committen.
- Verfassungstreu: Empfangsmodus, kein Dauer-Piepser; Anmelden/Suchen nutzer-ausgelöst.

## Akzeptanzkriterien

- [ ] Kimseek + Kimboard sind installierbare PWAs mit vollem Endknoten-Stack.
- [ ] Beide haben eigenen dbSuffix (`kimseek`/`kimboard`), Status-Lampen-Leiste,
      volles Siegel mit Andock-Wizard, „🌐 Mit dem Netz verbinden" inkl. 🧹-Repair,
      Modell-Ladefortschritt überall.
- [ ] `spore.json` committet (nach Klaus' Browser-Lauf), Live-Handshake mit Sage grün.
- [ ] In Sage NETZ-STAND + Knoten-Korpus als `verified-match` aufgenommen.
- [ ] Smoke je Repo grün; Drift-Guard byte-1:1.

## Reihenfolge / Hinweise

- Repos via `add_repo` in die Sitzung holen (kimseek, kimboard sind im Scope).
- Erst Kimseek komplett (Muster festigen), dann Kimboard (gleiches Muster).
- Schritt 3 (Anmelden) braucht **Klaus' Browser** — Session baut + committet spore.json
  erst, wenn Klaus die Datei geschickt/erzeugt hat (wie bei Kim-Bell).
- Selbst-Merge-Freibrief gilt (getestet/abgegrenzt → Draft→ready→squash).

## Offene Fragen an Klaus

- Kimseek/Kimboard-Domänen-Beschreibungen final so ok (Suche / Pinnwand), oder
  eigene Formulierung?
- Sollen die neuen Apps ein eigenes Icon bekommen oder vorerst das Tool-Icon behalten?

---

### Abschluss-Befehl (die Kette reißt nie ab)

Am Sitzungsende: `docs/PULS.md` + NETZ-STAND fortschreiben, „Nächste Schritte"-Block
im Chat, neuen Folge-Brief anlegen + als Codeblock ausgeben, Pflichtlektüre wiederholen.
