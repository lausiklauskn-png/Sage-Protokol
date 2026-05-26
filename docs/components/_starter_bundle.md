# SBKIM-Starter-Bundle (eigenes Repo, Konzept-Karte)

> **Status:** 🟫 Schablone (2026-05-26, Tafel-Spec-Pflege Mycel-Vision) ·
> Mycel-Hub-Backlog · **Priorität niedrig** (nach App-Freigabe,
> Pipeline-Phase B)  ·  **Schicht:** Eigenes GitHub-Repo, das alle
> SBKIM-Module als kopierbares Bundle für Forker bereitstellt.
> **Datei (Code):** Eigenes Repo `sbkim-starter` (Vorschlag,
> finalisiert in Spec-Sitzung Starter-Bundle).

---

## Im Mycel-Bild

Eine Spore ist die kleinste Ausbreitungs-Form eines Pilzes — kompakt,
trocken, mit allem Erbgut zum Anwachsen. Das SBKIM-Starter-Bundle ist
genau das für Forker: ein **trockenes Paket** aus allen SBKIM-Modulen
(01–17), das ein Forker in sein Repo entpacken kann und sofort einen
SBKIM-fähigen Knoten hat. Keine NPM-Suche, kein Webpack, kein Drift
zwischen den Modulen — eine kuratierte Snapshot-Version.

## Vokabular

- **Starter-Bundle** — ein **eigenes GitHub-Repo** (NICHT Sage-Protokol),
  das alle SBKIM-Module als kopierfertige Datei-Sammlung enthält.
- **Modul-Distribution** — die `src/modules/*.js`-Datei-Familie wird
  als Bundle veröffentlicht. Forker laden das Bundle herunter und
  kopieren die `sbkim/`-Datei-Familie in sein Repo.
- **Installer-Script** (optional) — ein Shell-/Node-Script, das den
  Forker durch den Andock-Workflow führt (Karte 09 Einbau-PWA als
  Code-Variante).
- **Konfig-Template** — eine `sbkim.config.json`-Vorlage mit den
  Andock-Parametern (Domain · Knotentyp · Hub-URL).

## Warum jetzt (Hochstufungs-Begründung)

Klaus' Vision-Korrektur 2026-05-26: **mehrstufige Mycel-Architektur**.
Die Sage soll Spec-Hub bleiben, nicht Distributions-Hub. Forker, die
das SBKIM-Protokoll in ihre PWA integrieren wollen, brauchen ein
**eigenes Modul-Distributions-Repo** — sonst müssen sie aus dem
Sage-Protokol-Repo selektiv kopieren (Drift-Risiko, Karten-vs-Code-
Verwirrung).

Das Starter-Bundle trennt:
- **Sage-Protokol** = Spec + Klaus' Endknoten (Doku-zentriert)
- **SBKIM-Starter-Bundle** = Modul-Distribution für Forker (Code-zentriert)

---

## Repo-Struktur (Spec-Skizze)

```
sbkim-starter/
├── README.md                      # Forker-Anleitung
├── LICENSE                        # MIT (analog Sage)
├── modules/                       # Module 01–17 als Single-File-JS
│   ├── 01_storage.js
│   ├── 02_spore.js
│   ├── 03_embedding.js
│   ├── 04_match.js
│   ├── 05_anastomose.js
│   ├── 06_heterokaryose.js
│   ├── 07_apoptose.js
│   ├── 08_ui_demo.js
│   ├── 15_membran.js
│   ├── 16_siegel.js
│   ├── 17_floating_widget.js
│   └── sbkim-sw.js                # Service-Worker
├── examples/                      # Beispiel-Andock-Variante
│   ├── minimal/                   # Single-File-PWA mit allen Modulen
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── sbkim/                 # leere Stammkopie der modules/
│   └── pepo-style/                # bidirektionales Such-Feld-Match
│       └── index.html
├── docs/                          # Forker-Anleitungen (extrahiert aus Sage)
│   ├── EINBAU.md                  # Karte 09 als Forker-Doku
│   ├── ANDOCKEN.md                # Sage-Page-Andock-Wizard als Doku
│   └── SUCH-FELD-PATTERN.md       # Such-Feld-Integration-Pattern
├── sbkim.config.template.json     # Konfig-Vorlage
├── install.sh                     # Optional: Shell-Installer
└── package.json                   # Optional: NPM-Distribution-Manifest
```

## Versionierungs-Strategie

- **Git-Tags** statt `package.json`-Versionen.
- Jedes Tag = Snapshot der Sage-Protokol-Module zu einem konkreten Datum.
- Forker pinnen sich auf ein konkretes Tag → kein Drift.
- Pflege-Sitzung im Sage-Protokol erzeugt einen Sync-PR im Starter-
  Bundle-Repo, der die Module aktualisiert.

## Welche Module ins Bundle gehören

**Pflicht-Module (Bundle-Kern):**
- Modul 01 Storage
- Modul 02 Spore
- Modul 03 Embedding
- Modul 04 Match (inkl. 04.A `matchDimensions`, 04.B `explainMatchLLM`,
  04.C `queryLocal` sobald gebaut)
- Modul 05 Anastomose
- Modul 07 Apoptose
- Modul 15 Membran (Sub a + b + e)
- Modul 16 SBKIM-Siegel
- Modul 17 Floating-Widget
- Service-Worker (`src/sbkim-sw.js`)

**Optional-Module (Bundle-Erweiterung):**
- Modul 06 Heterokaryose (Opt-In, nicht jeder Knoten will)
- Modul 08 UI-Demo (Endknoten-Pflege-UI)
- Modul 18 Tool-PWA-Container (sobald gebaut)

**NICHT im Bundle:**
- Modul 19 Andock-Wizard (gehört auf den **Hub**, nicht in den Forker-
  Knoten — Forker hat einen Andock-Wizard NICHT in seiner PWA, sondern
  besucht den Hub um anzudocken)
- Modul 00 Doku-Fenster (Sage-Page-spezifisch, Forker-PWAs haben eigene
  Doku-Wege)

---

## Spec-Punkte (offen für Spec-Sitzung Starter-Bundle)

### Repo-Name (Klaus entscheidet)

Vorschläge:
- `sbkim-starter` (kurz, klar)
- `sbkim-bundle` (alternative)
- `sbkim-toolkit` (alternative, breiter Begriff)

Klaus' Vorzug für SBKIM-Branding: wahrscheinlich `sbkim-starter`. Spec-
Sitzung Starter-Bundle finalisiert den Namen.

### Repo-Owner (Klaus entscheidet)

Vorschläge:
- `lausiklauskn-png/sbkim-starter` (Klaus' Konto, analog Sage)
- Eigene Organisation `sbkim/sbkim-starter` (für Forker-Community)

### Installer-Script (Spec entscheidet)

- Soll es einen `install.sh` geben, oder bleibt der Workflow rein
  manuell (Copy-Paste der `modules/`-Dateien)?
- Spec-Vorbereitung: **MANUELL** als Default, weil Klaus' PWA-Workflow
  bewusst kein Build-System hat. Ein Installer-Script wäre eine
  Erleichterung für Forker mit Terminal-Erfahrung, aber kein Block.

### Konfig-Template-Form (Spec entscheidet)

```jsonc
// sbkim.config.template.json
{
  "domain": "<DEINE_DOMAIN>",          // z.B. "Kochrezepte"
  "domainKeywords": [],                // 5–15 deutsch, kurze Strings
  "nodeType": "hybrid",
  "hubUrl": "<HUB_URL>",                // z.B. "https://sbkim-hub.example/"
  "embedding": {
    "model": "Xenova/multilingual-e5-small",
    "lazy": true
  },
  "siegel": {
    "visible": "visible",
    "repoUrl": "<DEIN_REPO_URL>"
  },
  "widget": {
    "allowedOrigins": ["<ANDERE_KNOTEN_URLS>"]
  }
}
```

---

## Strikte Tabus (Spec-Vorbereitung)

- **KEINE Sage-Protokol-Spec im Bundle.** Das Bundle ist Code-
  Distribution, keine Spec. Forker, die die Spec lesen wollen, gehen
  auf Sage-Protokol-Repo.
- **KEINE PII im Bundle.** Auch nicht im Konfig-Template (Placeholder
  statt Beispiel-Daten).
- **KEINE Auto-Update-Mechanismen im Bundle.** Forker entscheidet,
  wann er das Bundle aktualisiert. Service-Worker auto-update bleibt
  PWA-Verantwortung.
- **KEIN NPM-Publish ohne Klaus' Entscheidung.** Bundle als
  GitHub-Repo + Tags reicht; NPM ist optional.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Konzept-Karte angelegt | 2026-05-26 | Tafel-Spec-Pflege Mycel-Vision | Klaus' Vision-Korrektur 2026-05-26: mehrstufige Mycel-Architektur. Diese Karte ist Vorbereitungs-Konzept mit Repo-Struktur-Skizze + offenen Spec-Fragen. Volle Spec-Sitzung Starter-Bundle folgt nach App-Freigabe + Spec/Bau-Sitzungen Modul 18 + 19. |
| Spec gefüllt | — | Spec-Sitzung Starter-Bundle | folgt — Repo-Name finalisieren, Repo-Owner entscheiden, Installer-Script-Form, Konfig-Template-Form. |
| Repo angelegt | — | Bau-Sitzung Starter-Bundle | folgt — neues GitHub-Repo `<Owner>/sbkim-starter` erzeugen + initiale Module-Kopie aus Sage-Protokol-Tag synchronisieren. |
| Erster Forker | — | Forker-Test | folgt — Pepo Semantic Match Demo via Starter-Bundle integrieren (Pipeline-Phase C, siehe CLAUDE.md). |

---

**Querverweise**

- **Abhängig von:** Sage-Protokol als Quell-Repo (Module werden
  hierhin synchronisiert).
- **Wird genutzt von:** Forker-PWAs (Muttis Rezeptbuch, Pepo Semantic
  Match Demo, etc.) · Externer Mycel-Hub (siehe [`_mycel_hub.md`](_mycel_hub.md))
  als Anker für Andock-Wizard-Empfehlung.
- **Verwandt:** [Modul 09](09_einbau_pwa.md) (Einbau-PWA-Anleitung,
  inhaltlich identisch — Modul 09 ist die Doku in Sage-Protokol, das
  Bundle hat eine extrahierte Forker-Version davon) · [Modul 19](19_andock_wizard.md)
  (Andock-Wizard, gehört NICHT ins Bundle — der lebt im Hub) ·
  [`_mycel_hub.md`](_mycel_hub.md) (öffentliches Observatorium light).

## Architektur-Mehrstufe (Klaus' Vision 2026-05-26)

```
┌──────────────────────────────────────────────────────────────┐
│ Sage-Protokol (Klaus' Spec-Hub + Endknoten)                  │
│ - Spec-Karten (docs/components/*.md)                          │
│ - INTERFACES.md, ARCHITEKTUR.md                               │
│ - Klaus' eigene Endknoten (MR, MM, Sage)                     │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ Tag-Sync (Pflege-Sitzung)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ SBKIM-Starter-Bundle (DIESE KARTE)                            │
│ - Module 01–17 als kopierfertige Datei-Sammlung               │
│ - Forker-Anleitung, Konfig-Template                          │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ Forker klont/kopiert
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ Externer Mycel-Hub (siehe _mycel_hub.md)                      │
│ - eigene status.json mit Forker-Endknoten                     │
│ - Andock-Wizard (Modul 19) als Sektion                        │
│ - öffentliches Observatorium light                            │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ Forker docken an Hub an
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ Forker-PWAs                                                  │
│ - Pepo Semantic Match Demo                                    │
│ - Muttis Rezeptbuch                                          │
│ - weitere Forker-Apps                                        │
└──────────────────────────────────────────────────────────────┘
```
