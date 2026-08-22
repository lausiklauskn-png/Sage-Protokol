# Pipeline — die Reihenfolge bis zur App-Freigabe und danach

> Ausgelagert aus `CLAUDE.md` am 2026-08-22. Der Inhalt ist **unverändert**,
> einschließlich der Klausel „Wer darf umsortieren" — sie gilt weiter und bindet
> genauso wie vorher.
>
> **Warum hier:** eine Arbeits-Reihenfolge ist ein Plan, keine Verfassungsregel.
> Sie wird in [`PULS.md`](PULS.md) und in den Briefen unter [`sessions/`](sessions/)
> ohnehin fortgeschrieben; in `CLAUDE.md` stand sie ein zweites Mal, 14.184 Zeichen
> lang. Verbindlich ist sie unverändert — nur eben von hier aus.

## Pipeline-Reihenfolge bis App-Freigabe (verbindlich, 2026-05-24)

Klaus' strategische Festlegung: **vor der öffentlichen App-Freigabe**
müssen die folgenden Sitzungen **in dieser Reihenfolge** durchlaufen
sein. Eine Sitzung darf später ergänzen oder verfeinern, aber
**nicht umsortieren**, ohne Klaus' explizites Einverständnis. Die
Reihenfolge ist eine Tafel (siehe § Tafel-Evolutions-Klausel) — eine
neue Erkenntnis darf sie weiterentwickeln, aber nur mit klarem
Anpassungs-Antrag, nicht stillschweigend.

| # | Sitzung | Branch-Vorschlag | Brief liegt? |
|---|---|---|---|
| 1 | **Spec-Sitzung 16** — SBKIM-Siegel-Form festlegen (vier Sub-Bereiche, Pflicht-Modul-Liste, Badge-Optik, Modal-Inhalt, Aspekte-Schema) | `claude/spec-16-siegel` | ✅ erledigt 2026-05-24, PR #151 |
| 2 | **Bau-Sitzung 16** — `src/modules/16_siegel.js`, Badge-CSS in `index.html`, Modal-Mount, `ZERTIFIKAT_ASPEKTE`-Startwert | `claude/bau-16-siegel` | ✅ erledigt 2026-05-24, PR #152 + Pflege Wappen/Korona PR #154 |
| 3 | **Sichttest 16** — Klaus, Sage-Page Badge sichtbar + Modal öffnet sich | (kein eigener Branch, Sichttest-Nachzug-PR) | — |
| 3a | **Pflege CLAUDE.md** — § „Sicherheits-Module pflegen Aspekte" als neuer Pflicht-Block (Folge-Pflege aus Spec-Sitzung 16 / Karte 16 § Sub (d) Pflicht-Konvention) | `claude/pflege-claudemd-sicherheits-aspekte` | ✅ erledigt 2026-05-25, PR #<diese-Sitzung> |
| 4 | **Spec-Sitzung 15.B** — Modul 15 Sub (a) Read-API + Sub (b) postMessage-Bedienung mit Siegel-Hook im Snapshot | `claude/spec-15b-membran` | ⏳ wird in Spec-Sitzung 16 oder Bau 16 angelegt |
| 5 | **Endknoten-Migration (erste Iteration)** — Karte 09 § Schritt 10 + 11 (Membran-Allowlist + Lampe + Siegel-Anker pro Endknoten-PWA), eigene Folge-Sitzung pro Endknoten-Repo | `claude/migration-<endknoten>` (extern) | ⚠️ erste Iteration 2026-05-25 gelaufen (Mein-Rezeptbuch + Mein-Mixarium), aber **UI-Befund Klaus**: Lampen + Siegel in der Navleiste nehmen zu viel Platz, kein User-X-Schließen, nicht einheitlich. Re-Migration nach Schritt 5d nötig. Brief: `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` (erweitert via PR #162). |
| 5b | **Spec-Sitzung 17 Floating-Widget** — gemeinsames floating Mini-Panel (Eruda-Stil) bündelt FREMD-Lampe + Siegel-Badge; Self-Mount in `<body>`, Drag, X-Schließen, localStorage-Persistierung. Modul 15 + 16 Backends bleiben unverändert. Sage-Page behält Navleisten-Lampen. | `claude/spec-15-16-floating-widget` | ⏳ Brief liegt: `BRIEF_SPEC_15_16_FLOATING_WIDGET.md` (Auslöser: Klaus' UI-Befund 2026-05-25 nach erster Endknoten-Migration) |
| 5c | **Bau-Sitzung 17** — `src/modules/17_floating_widget.js` mit Standalone-CSS, Drag-Mechanik, X-Schließen + Wiederherstellung, Modal-Anker-Bridge zu Modul 15 + 16 | `claude/bau-17-floating-widget` | ⏳ wird in Spec-Sitzung 17 angelegt |
| 5d | **Endknoten-Re-Migration mit Widget** — die zwei Endknoten (Mein-Rezeptbuch + Mein-Mixarium) auf das Widget umstellen, alte Navleisten-Lampen + Siegel ausbauen. Drei-Zeilen-Einbau statt 30. | `claude/migration-<endknoten>-widget` (extern) | ⏳ wird in Bau-Sitzung 17 angelegt |
| 5e | **Re-Aktivierung Modul 15+16 in Endknoten** — Mein-Rezeptbuch + Mein-Mixarium nach Rückbau wieder mit Modul 15+16+17-Floating-Widget-Pfad bestücken. Eigene Folge-Sitzung pro Endknoten-Repo. | `claude/migration-<endknoten>-reaktivierung` (extern) | ⏳ wird nach Sub-(c)-`queryLocal`-Bau geplant |
| 5f | **Spec + Bau Modul 04.C `queryLocal`** — lokales Such-Feld-Backend (Klaus' Such-Feld-Vision). Modul 15 Sub (b) `op:"query"`-Empfänger ruft `queryLocal` → Top-k lokale Treffer + Cross-Knoten-Antwort. Tafel-Spec-Pflege 2026-05-26 hat Karte 04 § Sub (c) voll spec'd. | `claude/bau-04c-query-local` | ⏳ Brief liegt: `BRIEF_BAU_04C_QUERY_LOCAL.md` |
| 5g | **Bau Modul 16 Sub (e) Bronze-/Gold-Stufung** — zweistufiger SIEGEL nach Tafel-Spec-Pflege 2026-05-26. Modul 16 lauscht auf `sbkim:handshake outcome:"established"`, schaltet `_meta.mycelConnected:true`, re-rendert Badge in Gold. Aspekt 4 „Mycel-Verbindung etabliert" in ZERTIFIKAT_ASPEKTE. | `claude/bau-16-sub-e-bronze` | ⏳ Spec liegt (Tafel-Spec-Pflege 2026-05-26 Karte 16 § Sub e) |
| 5h | **Spec + Bau Modul 18 Tool-PWA-Container** — nach Klaus' Festlegung 2026-05-26 mit 9 Sub-Bereichen (a–i). Voll-Spec entscheidet die internen Details + Modal-Form + Risiken. Bau-Sitzung 18 implementiert `src/modules/18_tool_pwa.js`. | `claude/spec-18-tool-pwa` → `claude/bau-18-tool-pwa` | ⏳ Brief liegt: `BRIEF_SPEC_18_TOOL_PWA.md` (aktualisiert 2026-05-26 mit 9 Sub) |
| 5i | **Such-Feld-Integration-Pattern in Endknoten** — Mein-Rezeptbuch + Mein-Mixarium bekommen einen Sender-Helper im Such-Feld (postMessage `op:"query"` an Sibling-Spore-Origin), UI-Pattern lokale + Cross-Knoten-Treffer, Anker-Pfad-Konvention. Karte 18 § Such-Feld-Integration-Pattern als Vorlage. | `claude/such-feld-<endknoten>` (extern) | ⏳ wird nach 5f geplant |
| 5j | **Endknoten-Migration mit Modul 18 + Such-Feld** — die zwei Endknoten auf Modul 18 (Tool-PWA-Container) + Such-Feld-Sender-Helper umstellen. | `claude/migration-<endknoten>-modul18` (extern) | ⏳ wird nach 5h + 5i geplant |
| 6 | **Klaus' App-Freigabe** — Mein-Rezeptbuch, Mein-Mixarium, Sage-Protokol mit Siegel + Such-Feld + Modul 18 sichtbar öffentlich verteilen | (kein Branch, Klaus-Schritt) | — |

**Phase B (nach App-Freigabe, vorbereitet aber nicht-blockierend für Freigabe):**

| # | Sitzung | Branch-Vorschlag | Brief liegt? |
|---|---|---|---|
| 7 | **Spec + Bau Modul 19 Andock-Wizard (kopierbar)** — Sage-Page-Wizard-Code (`index.html` Karte 4, Z. ~969–991) als eigenständiges `src/modules/19_andock_wizard.js` extrahieren. Einsatz: Sage UND Externer Mycel-Hub. | `claude/spec-19-andock-wizard` → `claude/bau-19-andock-wizard` | ⏳ Brief liegt: `BRIEF_SPEC_19_ANDOCK_WIZARD.md` |
| 8 | **SBKIM-Starter-Bundle-Repo** — neues GitHub-Repo `<owner>/sbkim-starter` mit allen Modulen + Installer-Script + Konfig-Template + README. Modul-Distribution für Forker. | `claude/spec-starter-bundle` → `claude/bau-starter-bundle` (extern, neues Repo) | ⏳ Karte: `docs/components/_starter_bundle.md` (Tafel-Spec-Pflege 2026-05-26) |
| 9 | **Externer Mycel-Hub-Repo `SB-KIMTool-Point`** — GitHub-Repo `lausiklauskn-png/SB-KIMTool-Point` als öffentliches Observatorium light für Forker. **Repo angelegt 2026-05-26 (public, leer)** — `https://github.com/lausiklauskn-png/SB-KIMTool-Point`. Eigene `status.json` + Andock-Wizard (Modul 19) eingebaut. | `claude/spec-mycel-hub` → `claude/bau-mycel-hub` (extern, im Repo `SB-KIMTool-Point`) | ⏳ Karte: `docs/components/_mycel_hub.md` (Tafel-Spec-Pflege 2026-05-26) |

**Phase C (Forker-Test, nach Phase B):**

| # | Sitzung | Branch-Vorschlag |
|---|---|---|
| 10 | **Pepo Semantic Match Demo via Starter-Bundle integrieren** — Klaus' externes Repo `lausiklauskn-png/semantic-match-demo` als erster Forker-PWA-Knoten ans Mycel andocken (UI-Pattern aus Demo + Sage-Mycel-Architektur). | (Klaus' eigener Endknoten, eigene Sitzung) |
| 11 | **Muttis Rezeptbuch via Starter-Bundle integrieren** — Muttis blanco-Repo bekommt SBKIM-Module via Starter-Bundle + Andock an Externen Mycel-Hub. | (Forker-PWA, eigene Sitzung) |
| 12 | **Cross-Knoten-Such-Test Forker → Klaus' Mycel** — End-to-End-Test mit zwei getrennten Forker-Endpunkten + Klaus' Endknoten: tippt User in Forker-Such-Feld eine Anfrage, kriegt Cross-Knoten-Treffer aus Klaus' Mycel (oder umgekehrt)? | (manueller Sichttest) |

**Phase D (organisch, nicht-blockierend für Phase A/B/C — Klaus'
Vision-Erweiterung 2026-05-27):**

Phase D ist eine **organische Folge-Phase** nach Phase C; sie kann
inhaltlich vorbereitet, aber nicht abgeschlossen werden, bevor die
technische Schicht (Phase A/B/C) Pilz-Bauten ermöglicht. Zweigeteilt:

| # | Sitzung | Branch-Vorschlag | Status |
|---|---|---|---|
| D.1 | **Agent-Bootstrap-Mechanik-Spec** — Sybil-Schutz via bezeugte Bau-Tat (`ZERTIFIKAT_ASPEKTE`-Anker), Identitäts-Schema (Sitzung-an-Datum statt Modell-Familie), Refinanzierungs-Schleife für Agent-Mit-Bauer (Pilz-Geld → Folge-Bau-Sitzungen). Setzt voraus, dass Modul 16 Sub (e) Bronze/Gold und die Endknoten-Re-Aktivierung gebaut sind. | `claude/spec-d1-agent-bootstrap` | ⏳ wartet auf Phase A 5g + 5e |
| D.2 | **Pilz-Schicht-Wirtschafts-Spec** — Genossenschaft / Lizenz-Modell / Token / etwas, das wir heute nicht benennen können. Stand bewusst offen, „bis reale Pilz-Bauten existieren". **✅ ERÖFFNET 2026-08-09** — die Bedingung ist eingetreten (14 laufende Knoten, Marktplatz, Wächter, Siegel). Erste Fassung: [`docs/PLAN_PILZ_WIRTSCHAFT.md`](PLAN_PILZ_WIRTSCHAFT.md) — Kassensturz gegen die Mai-Kostenanalyse (die teure technische Hälfte steht bereits), der Messwert **0 fremde Marktplatz-Einträge trotz gratis**, und die daraus folgende Umkehrung: der Marktplatz ist **Beweisstück**, nicht Provisions-Maschine (① Auftragsarbeit ② Fach-App mit Wartung ③ Provision zuletzt). Zwei neue Regeln dort: **die Module sind nicht das Produkt** · **kein Einnahmeweg, der täuscht oder einsperrt** (⇒ kein DRM). Lebendes Dokument — wer etwas entscheidet oder widerlegt, trägt es dort ein. | `claude/spec-d2-pilz-wirtschaft` | 📄 Papier liegt · **§ 8e ergänzt 2026-08-17**: die gemessenen Betriebskosten (~200 €/Monat, getrennt in Betrieb ~50 € und Bau ~150 €) und was jeder Einnahmeweg davon verlangt — ein zahlender Betrieb ersetzt 130 Zwei-Euro-Verkäufe im Monat · Entscheidungen offen (EVL. · Jahresbeitrag · WorkFloh-Preisform · Play-Auswahl) |

**Vision-Anker-Vorbereitung** (vor Phase D, organisch):

- **Einladungs-Site** (`docs/einladung/`) — Drei-Format-Artefakt
  (HTML / Markdown / PDF) baut die Vier-Schichten-Lesart visuell auf.
  Bau 2026-05-27 in Sitzung `claude/bau-einladung-site`. Karte:
  `docs/components/_vision_einladung.md`. Sichttest ungeprüft, wartet
  auf Klaus' Galaxy-Tab-S6-Browser.
- **Folge-Pflege** Sage-Page-Mount der Einladung (eigene Sitzung,
  Pipeline-Phase-frei — kann parallel zu Phase A laufen).
- **Folge-Pflege** Mycel-Hub-Mount der Einladung (NACH Phase B
  Schritt 9 Externer Mycel-Hub Bau).
- **Observatoriums-Vorteilspack-Truhe** (Sage-Page-Karte, Klaus'
  Vision 2026-05-28 nach Sichttest Bau 18 Sub (a) Vorab grün).
  Alte Seemannskiste + Schlüssel-Schritt-Mechanik (analog Einladungs-
  Tür Scene 5/5b), Container-Größe wie `.blackhole-stage` /
  `.sun-scene` (~280 px). Inhalt: alle SBKIM-Tools (Module 00–19) als
  „Verpackungs"-Tiles mit Tier-Badge (Must-have / Basic / Pro),
  Klick öffnet Tool-Modal mit neun Sektionen (Was / Wie / Einbau /
  Vibe-Coding-Prompt-Paket / Code-Kopier-Knopf / Test-Modul / Quer-
  verweise). Klaus' Wort: „Vorteilspack" — die Truhe ist die
  Sage-Page-Sichtbarkeit des Starter-Bundles (Phase B Schritt 8),
  Klick-und-Kopier-Pfad statt git-clone. Pipeline-Position: **NACH**
  MR + MM Endknoten-Re-Migration (Phase A 5h.1-Folge), parallel
  möglich zu Phase B Schritt 7 (Modul 19 Andock-Wizard).
  Brief: `docs/sessions/BRIEF_BAU_OBSERVATORIUMS_VORTEILSPACK.md`.
  Konzept-Karte: `docs/components/_observatoriums_vorteilspack.md`.
  **Bauzustand 2026-05-29:** Truhe-Karte **gebaut** (Klaus'
  Vision-Erweiterung 2026-05-29). 19 Werkzeug-Symbole
  (`assets/tool-symbols/`), Truhe-Bild `assets/observatorium-truhe.png`,
  Karte `#observatorium-vorteilspack` in `index.html` + Render-Modul
  `docs/observatorium/vorteilspack.js` (Tool-Grid + 9-Sektionen-Modal
  + Clipboard), Smoke `tests/smoke_observatorium_truhe.mjs` 19/19.
  **Klaus' Browser-Sichttest steht aus.**

**Danach (organisch, ohne feste Reihenfolge — jeder Bau ergänzt
einen Aspekt-Eintrag im Siegel-Modal):**

- Modul 11 Mini-Bau (Rate-Limit-Hook für eingehende postMessage)
- Modul 12 Mini-Bau (manuelle Blocklist im Andocker-UI)
- Modul 10 Voll-Bau (Reputation — frühestens wenn Netz ≥ 10 aktive
  Geschwister hat und Statistik liefert)

### Warum diese Reihenfolge (Begründung)

- **Modul 16 vor Modul 15.B**, weil 15.B den Siegel-Hook im
  `read()`-Snapshot mitliefern soll und dafür das fertige Siegel-
  Schema braucht.
- **Modul 16 vor App-Freigabe**, weil Klaus' explizite Strategie-
  Festlegung 2026-05-24: vor der Verteilung der Apps muss ein
  sichtbares Vertrauens-Signal für Forker und Endnutzer stehen.
- **Schutz-Module 11/12/10 NACH App-Freigabe**, weil sie nach
  CLAUDE.md-Spec „erst gebaut, wenn das Netz groß genug ist, dass
  Apoptose und Match-Filter allein nicht mehr reichen". Spec-getrieben
  ohne reale Angriffsfläche → potenziell falsche Form. Aspekte-
  Wachstum im Siegel-Modal macht spätere Updates sichtbar, ohne
  dass Forker re-andocken müssen.
- **Endknoten-Migration NACH Bau 16 + Spec 15.B**, weil Migration
  Membran-Lampe **und** Siegel-Badge in einem Schritt einbaut —
  sonst zweimal pro Endknoten-Repo migrieren.
- **Schritt 5b/5c/5d (Spec 17 Widget → Bau 17 → Re-Migration) NACH
  erster Endknoten-Migration**, weil der UI-Befund (Lampen + Siegel
  in der Navleiste nehmen zu viel Platz, kein User-X, nicht
  einheitlich zwischen Mein-Rezeptbuch und Mein-Mixarium) erst durch
  Klaus' Live-Sichttest 2026-05-25 entstanden ist (Tafel-Evolutions-
  Klausel — neue Erkenntnis erlaubt bewusste Anpassung der alten
  Navleisten-Mount-Tafel). Modul 15 + 16 Backends bleiben
  unverändert, nur die Render-Schicht wandert ins Floating-Widget
  (Modul 17). Sage-Page behält ihre Navleisten-Lampen als sage-
  page-spezifischer Pfad (Klaus-Festlegung 2026-05-25). Re-Migration
  vor App-Freigabe, sonst tragen die verteilten Apps die ungeeignete
  Optik weiter.

### Wer darf umsortieren

- **Klaus** explizit per Chat — dann zieht eine eigene Pflege-Sitzung
  diese Tafel nach (CLAUDE.md aktualisieren).
- **Eine Sitzung, die einen Block-Befund hat** (Tafel-Evolutions-
  Klausel: neue Erkenntnis darf alte Tafel weiterentwickeln) — aber
  nur mit explizitem Anpassungs-Antrag an Klaus, nicht stillschweigend.
- **NIEMAND** stillschweigend. Wer einen Bau-/Spec-Brief schreibt,
  der von dieser Reihenfolge abweicht, MUSS in der Sitzungs-Antwort
  begründen, warum.
