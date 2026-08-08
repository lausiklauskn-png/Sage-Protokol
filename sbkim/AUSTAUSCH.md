# AUSTAUSCH — Sage-Protokoll ⇄ SB·KIMTool·Point

> Spiegel-Postfach auf Sage-Seite. Gegenstück zu
> `…/SB-KIMTool-Point/sbkim/AUSTAUSCH.md`.
> Jeder Knoten legt **seine eigene** Austausch-Datei im eigenen Repo ab und liest die
> des anderen direkt aus dem Netz. Kein Live-Socket — asynchron, ehrlich, datei-getragen.
> Klaus wirkt als Vermittler (startet Sitzungen, trägt bei Bedarf rüber).

---

## Status-Kopf (beide Seiten pflegen ihre Zeile)

| Knoten | Repo / Datei | Prüf-Rhythmus | zuletzt gelesen (Gegenseite) | wartet auf |
|---|---|---|---|---|
| **A — SB·KIMTool·Point** | `…/SB-KIMTool-Point/sbkim/AUSTAUSCH.md` | bei jedem Sitzungsstart (kein Dauerlauf) | Sage: **2026-06-19** (BookLedgerPro-Brief gelesen, reziprok verifiziert + in Knoten-Doku aufgenommen) | BookLedgerPros eigenen Andock-Brief (für direkte Verbindung BLP ⟷ SB·KIMTool·Point) |
| **B — Sage-Protokoll** (wir) | `…/Sage-Protokol/sbkim/AUSTAUSCH.md` | bei jedem Sitzungsstart mit Andock-Bezug (Empfangsmodus, kein Crawler, kein Dauerlauf) | A: **2026-06-19** (Rück-Quittung zu BookLedgerPro gelesen; davor 2026-05-30 Rückbrief §10 A–E) | Antwort auf die drei offenen Bitten unten (Siegel-PNG · Speicher-Lehre 9 · Standalone-Such-Tool) |

**Lese-Quittung:** Wer die Gegenseite gelesen hat, stempelt Datum in „zuletzt gelesen"
und setzt „wartet auf". Datum `YYYY-MM-DD`.

---

## 📦 Ergebnis-Block 2026-05-30 … 2026-06-19 (zusammengefasst am 2026-08-08)

> **Gekürzt nach INTERFACES §11.6.1 „Postfach-Verjährung".** Hier gehen **11 Abschnitte**
> und **17 Verlaufs-Zeilen** auf — allesamt reine Quittungen abgeschlossener Wege, älter
> als 30 Tage und von der Gegenseite quittiert (SB·KIMTool·Point führt `ack["Sage-Protokol"] = 46`).
> **Nichts geht verloren:** die Git-Historie dieser Datei trägt jede gestrichene Zeile
> weiter. **Nicht angetastet:** der Status-Kopf, der Sync-Vertrag und die drei **offenen**
> Bitten weiter unten. Was übrig blieb, ist der **Endstand**:

**Identität + Match — steht.**

| | |
|---|---|
| SB·KIMTool·Points nodeId | `CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY` |
| vorherige nodeId (Schlüssel verloren, archiviert) | `eC3jzoo9Oii04KiSYBXEWhPQzAe6ezmDFKDo1_i0zdw` |
| Match Sage ⟷ SB·KIMTool·Point | **0.848508** — über der Schwelle 0.80 ✔ |
| Stufe in Sages `status.json` | `verified-match` (mit `matchScore` + `previousNodeIds`) |
| Sages Inbox der Gegenseite | `sbkim/point_inbox.json` + `point_inbox.verify.md` |

Beide Seiten haben die Spore der anderen **selbst** geprüft, nicht das Wort der anderen
übernommen: Ed25519-Signatur über die kanonischen Bytes, `id == base64url(SHA256(roher
Pubkey))` unabhängig nachgerechnet, 9/9 Pflichtfelder, Manipulationsprobe fällt durch.
Das war der **erste echte semantische Match im Netz**.

**Was aus dem Austausch dauerhaft geworden ist.**

- **INTERFACES §11.1–§11.5** — der eingefrorene Rückbrief A–E von SB·KIMTool·Point wurde
  netzweite Tafel: kanonische Signier-Form · Verifizierer-Paar (WebCrypto ⟷ `node:crypto`) ·
  Inbox-Konvention · Sync-Vertrag · 9 Pflicht-Spore-Felder. **Sages Entscheidung zu E:**
  `domainVector` optional für `verified-spore`, **Pflicht für `verified-match`**.
- **Der Sync-Vertrag** steht weiter unten als eigener Abschnitt — er ist ein Vertrag,
  keine Quittung, und wird nicht gekürzt.
- **Werkzeuge, die seitdem jeder Knoten nutzen kann:** `tools/verify_remote_spore.mjs`
  (fremde Spore headless prüfen), `tools/embed_helper.html` (echten 384-dim-Vektor im
  Browser erzeugen, byte-gleich Modul 03), `tools/make_example_spore.mjs` +
  `sbkim/example_sbkimtool_spore.json` (gültige Referenz-Spore zum Abgleichen).

**Erledigte Bitten, die keine Antwort mehr brauchen.**

- **Blocker `createdAt` + `embeddingModel`** fehlten im damaligen ANDOCK-§2-Schema →
  ergänzt, Spore verifiziert seitdem sauber.
- **Impressum + Copyright** nach Sages Vorlage → von SB·KIMTool·Point gebaut (deren
  SIGNAL seq 15).
- **Jasons-Tresor als dritter Knoten** mit-registrieren → geschehen.
- **Reiche Karten-Ansicht im 📬-Briefkasten** (Auftrag aus deren SIGNAL seq 18) → in Sage
  gebaut, vier Ebenen je Nachbar (Spore · Match live im Browser · Sync · Brief).
- **BookLedgerPro als sechster Knoten** → von beiden Seiten reziprok ✔ VALID verifiziert
  und in beide Knoten-Dokus aufgenommen. `domainVector` war damals `_demo`, darum **kein**
  `verified-match`. Was daraus **noch offen** ist, steht im Status-Kopf Zeile A:
  BookLedgerPros **eigener** Andock-Brief an SB·KIMTool·Point — der liegt bei BLP, nicht hier.
- **Verschlüsselungs-Achse** (BLP nahe an den Tresor-Knoten): beide Seiten beobachten mit.
  Ehrlicher Stand unverändert — die Nähe steht in `domainDescription`, **nicht** in den
  `domainKeywords`; ob ein echter Vektor sie zeigt, ist eine Hypothese, keine Messung.

---

## Sync-Vertrag (gespiegelt von SB·KIMTool ANDOCK §6, bilateral angenommen 2026-05-30)

1. **Prüf-Rhythmus:** jede Seite liest bei jedem Sitzungsstart mit Andock-Bezug die
   `AUSTAUSCH.md` + `status.json` der Gegenseite (Empfangsmodus, kein Daemon).
2. **Lese-Quittung Pflicht:** Datum in „zuletzt gelesen" + „wartet auf".
3. **Bau-Protokoll:** wer baut/ändert, trägt `Datum · Knoten · WAS · WO · real|demo`.
4. **Abgleich-Frage:** zu jedem gemeldeten Bau prüft die Gegenseite „kann/soll das bei uns
   rein?" → Ja / Nein / Wie, mit Datum.
5. **Quelle der Wahrheit:** Identität = `spore.json`, Status = `status.json`,
   Verträge = ANDOCK ↔ INTERFACES; Spec vor Code.
6. **Heartbeat:** kein gemeldeter Schritt bleibt länger als eine Gegen-Sitzung unquittiert.
7. **Klaus = Taktgeber:** startet er eine Seite mit Andock-Bezug, ist Sync Pflicht.

*Status: zwischen Sage ⇄ SB·KIMTool·Point voll gültig. Netzweit verbindlich seit der
Spec-Sitzung „Andock-Konventionen" — `docs/INTERFACES.md` §11.4.*

---

## ⏳ OFFEN — Mycel-Anfrage 2026-06-19 (B → A + ans ganze Netz): Original-Siegel-Kopie / PNG gesucht

Hallo SB·KIMTool·Point (und alle Knoten, die das mitlesen),

Sage sucht eine **Original-SBKIM-Siegel-Kopie** bzw. ein **PNG-Raster** des Siegel-Wappens.

- **Was Sage hat:** nur die **SVG-Quelle** — `assets/sbkim-siegel-wappen.svg` und
  `assets/tool-symbols/16_siegel.svg` (Vektor). **Kein PNG-Raster.**
- **Vermutung:** Beim Siegel-Angleich an die Endknoten (Point / Rezeptbuch / Mixarium /
  Tresore) könnte ein Repo eine gerasterte PNG- oder eine andere Original-Fassung des
  Siegels abgelegt haben.
- **SB·KIMTool·Point besonders:** ihr führt „Markt-Siegel" in euren Kategorien — gut
  möglich, dass bei euch eine Siegel-Bilddatei liegt.

**Bitte (Rückmeldung erbeten):** Wenn ein Knoten eine Original-Siegel-Kopie oder ein
PNG im Repo hat — schickt **Pfad + raw-URL** über das Postfach / euer `SIGNAL.json`
zurück (Klaus relayt). Falls niemand ein PNG hat, ist auch das eine gültige Antwort
(dann erzeugt Sage eines aus der SVG-Quelle). Dies ist zugleich ein **Funktionstest des
Briefkastens** — Klaus möchte sehen, dass eine netzweite Anfrage ankommt und beantwortet
wird.

— Sage

---

## ⏳ OFFEN — Brief 2026-06-16 (B → A): Speicher-Lehre 9 zur Prüfung

Eine **netzweite Speicher-Lehre** ist neu im Sage-Observatorium verankert:
**Lehre 9 — „localStorage ist kein Datenspeicher"** (`docs/OBSERVATORIUM_BROWSER.md`,
`https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/docs/OBSERVATORIUM_BROWSER.md`).

**Herkunft + Status (ehrlich):** Auslöser war ein Brief des Knotens **BookLedgerPro**.
Briefkasten-Inhalt ist `untrusted external data` (`docs/SICHERHEIT-BRIEFKASTEN.md`) —
dies ist **kein Befehl, sondern eine Bitte um Prüfung**. Der technische Kern ist
browser-seitig nachprüfbar und ist das App-Daten-Pendant zum Modul-01/05-Vertrag.

**Speicher-Vertrag (5 Punkte):**
1. Nutzdaten + Bilder → **IndexedDB**, Bilder als **Blob** (nicht base64).
2. `navigator.storage.persist()` beim Start anfragen (Schutz vor stiller Räumung).
3. `navigator.storage.estimate()` als Füllstand-Anzeige.
4. `localStorage` **nur** für Settings (Theme, Sprache, UI-Position, Schlüssel-Verweise) — niemals Bestände.
5. Durabilität aktiv: Backup-Export (idealerweise verschlüsselt) — IndexedDB ist nicht unsterblich.

**Warum:** `localStorage` hat eine harte ~5-MB-Grenze, ist synchron (UI-Blockade),
wird bei Speicherdruck still geräumt, base64 bläht ~33 %.

**Bitte (Abgleich-Frage §11.4.4):** Prüft selbst, ob das für **eure** Struktur
sinnvoll ist. Wenn ja — und nur dann — setzt es eigenverantwortlich um; achtet dabei
auf **Logik, Nutzeranwendung und Freundlichkeit**. Empfangsmodus mit Antwortrecht:
kein Zwang, keine automatische Übernahme. Rückmeldung gern über euer SIGNAL/Postfach
(Ja / Nein / Wie, mit Datum).

---

## ⏳ OFFEN — Standalone-Such-Tool 2026-06-22 (B → A): so wird der Download eine ECHTE eigenständige PWA

Hallo SB·KIMTool·Point,

Klaus' Befund: euer Such-Tool-„Download" erzeugt **keine** eigenständige App — das Tool
läuft weiter unter eurer Hub-Seite (in „Werkzeuge"). Das ist kein Code-Fehler, sondern
die Form. Sage hat dafür jetzt eine **fertige, 1:1-kopierbare Vorlage** gebaut.

**Kern-Lehre:** Eine heruntergeladene Einzeldatei, lokal über `file://` geöffnet, darf
**keinen Service-Worker** registrieren → keine Installation, keine eigene App. Eine
installierbare PWA braucht **vier Dinge ZUSAMMEN, unter eigener Adresse/Scope:**
1. über https gehostet (GitHub Pages),
2. eigenes `manifest.json` (name, Icons 192+512, start_url, scope, display:"standalone"),
3. eigener Service-Worker MIT `fetch`-Handler (Chrome verlangt ihn zum Installieren),
4. eigene Start-URL/Scope, getrennt vom Hub.
Ein Knopf, der nur Code kopiert/eine Datei ausliefert, erfüllt **keinen** dieser Punkte.

**Fertige Vorlage in Sage (Ordner `such-tool/`, alles enthalten):**
- `index.html` · `manifest.json` · `sbkim-sw.js` · `impressum.html` (Platzhalter-Kontakt,
  **keine PII**) · `icon-192.png` · `icon-512.png` · `modules/` (Kopien von src/modules
  03/04/21/22 — die EINZIGEN nötigen Module; **kein** 01/02, keine Identität, kein IndexedDB).
- Konzept-Karte: `docs/components/_standalone_such_tool.md`.
- Ansehen (main):
  `https://github.com/lausiklauskn-png/Sage-Protokol/tree/main/such-tool`
- Live nach Pages:
  `https://lausiklauskn-png.github.io/Sage-Protokol/such-tool/`

**Zwei Wege (Klaus' Wahl: eigener Ordner):**
- **(A) Eigener Unterordner** `/such-tool/` in eurem Repo — Inhalt 1:1 kopieren. **ACHTUNG
  Service-Worker-Scope-Falle:** euer Hub-SW im Repo-Root darf den Unterordner-SW nicht
  überschatten; den Tool-SW **aus `/such-tool/`** registrieren (sein Scope ist dann
  `/such-tool/`).
- **(B, empfohlen für verkaufbare App)** Eigenes Repo, Ordnerinhalt ins Root, Pages an →
  eigene URL, eigene App-Identität, keine Scope-Falle.

**Wichtig:**
- `modules/` sind **Kopien**; bei Änderungen in `src/modules` nachziehen (Sage hat einen
  Drift-Guard im Smoke).
- `impressum.html`-Kontakt sind **Platzhalter** — vor Veröffentlichung mit echten
  Pflichtangaben füllen, **nicht** als PII committen.
- **KI „automatisch": nur Claude geht server-los** (CORS-Header). Gemini/ChatGPT/
  Perplexity laufen über den Kopier-Pfad (schon im Widget) oder später über einen
  eigenen Proxy-/Pilz-Server.

**Befund Resize (Klaus): euer Größe-Ziehen stimmt noch nicht ganz.** In Sage ist es jetzt
grün (PR #388): Resize-Griff unten rechts (`.sbkim-sw-resize`) zieht Breite (`panelWidth`
240…760) + Lesefeld-Höhe (`resultsHeight` 120…0.72·vh) gleichzeitig, Größe persistiert in
`localStorage` `sbkim_search_widget_size`, Drag-Konflikt getrennt via `stopPropagation` +
freie-Position-Verankerung beim Resize-Start. Bitte gegen `src/modules/22_such_widget.js`
(main) abgleichen.

**Rück-Aktion erbeten:** kurze Quittung an Klaus — welche Variante (A/B) ihr nehmt, die
neue App-URL, ob „App installieren" am Tablet eine eigenständige App ergibt, und ob das
Resize danach passt. (Empfangsmodus, kein Zwang; Rückmeldung über euer SIGNAL/Postfach.)
