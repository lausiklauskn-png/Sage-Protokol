# Übergabeprotokoll · 2026-09-16 · Der Zähler zählte nicht, und der Satz war halb wahr

**Rolle:** Hauptsitzung · **Zweig:** `claude/andock-wizard-merge-gokcps`
**Auftrag (Klaus):** *„Ja, beide Spore-Befunde umsetzen."*

---

## Was getan wurde

### Kanon · `src/modules/16b_andock_wizard.js`

1. **`naechsteEmbeddingVersion(neuerVektor)`** neu, vor `reSignWithDescription`.
   Sie holt die alte Spore über `getOwnSpore()`, vergleicht den `domainVector`
   Stelle für Stelle und gibt zurück: `prev + 1` bei einer Abweichung,
   `prev || 1` bei Gleichheit, `1` wenn nichts zu lesen war.
   Eingesetzt an **beiden** `generateOwnSpore`-Aufrufstellen.
2. **Der Herkunfts-Satz** wurde um `" Die Satz-Schnipsel für die Feinsuche
   kommen weiter aus dem Text."` erweitert (Deutsch 3×), englisch
   `" The sentence snippets used for fine-grained search still come from the
   text."` (1×).

`assets/sbkim-andock-wizard.js` (Sages eigene Kopie) nachgezogen.
Neue Kanon-sha: **`c415eafdb1b6`** (vorher `0fbef6d8bcfc`).

### Tafel · `docs/INTERFACES.md`

Die `embeddingVersion`-Zeile nennt jetzt **beide** Pfade (`regenerateOwnSpore`
rechnet selbst, der Wizard reicht durch) und die Regel „nur bei einer echten
Änderung".

### Werkzeug · `tools/kanon-verteilen.mjs`

`traegerDateien()` (js + html) und, nach jedem Cache-Bump, ein Mitzieher für
`?v=` und `ASSET_V`. **Gezogen wird nur, was literal auf der alten Cache-Nummer
stand** — gemessen, nicht pauschal.

### Proben und Gegenproben

| Datei | was dazukam |
|---|---|
| `tests/smoke_kanon_wizard.mjs` | Stub mit `__altSpore` + `getOwnSpore`; `schrittZwei(datei, altSpore)`; Fixture `text-inhalt.html`; 7 neue Wächter |
| `tests/gegenprobe_kanon_wizard.sh` | Helfer `saboten_paar` (DE+EN in einem Griff), Abschnitt F (2 Fälle) und G (4 Fälle) |
| `tests/smoke_kanon_verteilen.mjs` | App-Eins bekam `ASSET_V="7"` und eine `index.html` mit `style.css?v=7`, `app.js?v=7` **und** `icons/app.png?v=1`; 3 neue Wächter |
| `tests/gegenprobe_kanon_verteilen.sh` | 2 Fälle (Mitzieher ausgebaut · Riegel weg) |

---

## Was gemessen wurde

| | |
|---|---|
| `node tests/run_alle.mjs` | **107 Proben · 107 grün · 0 rot · 0 nicht lauffähig** |
| `bash tests/gegenprobe_kanon_wizard.sh` | **35 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `bash tests/gegenprobe_kanon_verteilen.sh` | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |
| Kopien auf `main`, byte-gleich mit dem Kanon | **20 von 20** |

Beide Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe. Vor jedem
Commit wurde die **Dateiliste** angesehen, nicht nur der Diff.

### Der Rollout, Repo für Repo

18 Repos, 19 Kopien (PWA-Toolpoint trägt zwei). Je ein Commit, ein Draft-PR,
ready, Squash-Merge; **danach auf `main` nachgezählt, erst dann die Zweige
gehoben** — in dieser Reihenfolge, wie die Verfassung es seit dem Vorfall vom
selben Tag verlangt.

| Repo | Probe | Ergebnis |
|---|---|---|
| Alis-Moderaum | `npm test` | 55/55 |
| Jasons-Tresor | `npm test` | 59 / 0 |
| Kim-Bell | `npm test` | 4 / 0 |
| Kimboard | `node tests/alle.mjs` | alle 31 grün |
| Kimseek | `npm test` | 11 / 0 |
| Mein-Mixarium | 3 Proben einzeln | 23 · 14 · 7 grün |
| Mein-Rezeptbuch | `npm test` | 7 / 0 |
| Mein-Tresor | `npm test` | 53 / 0 |
| Mein-WorkFloh | `npm test` | 12 / 0 |
| Mein-Workfloh-Page | `npm test` | 84 grün, 0 rot |
| Muttis-Rezeptbuch | **keine Probe berührt den Wizard** | Beweis ist die sha256-Kopie |
| PWA-Toolpoint | `npm test` | 872/872 |
| Perfect-Skin-Beauty | `npm test` | 14 · 69 · 18 · 25, je 0 rot |
| Perfect-Skin-Fashion | `npm test` | 66 grün, 0 rot |
| Privat-Brain | `npm test` | **4 vorbestehende rot** (belegt) |
| Tomys-Hub | `sbkim-beschreibung.smoke.mjs` | 20 grün, 0 rot |
| family-project | `smoke_all` + `smoke_cache_version` + 29 weitere | 110/110 · 12/12 · 27 grün, **2 vorbestehende rot** (belegt) |
| kim-hub-company | `npm test` | 69 grün · 0 ROT |

**Perfect-Skin-Beauty und -Fashion bekamen keinen Cache-Bump** — sie haben
keinen Service-Worker, der die Datei abfangen könnte. Der Automat hat das
gemessen, nicht angenommen.

### Die sechs vorbestehenden roten Zeilen, mit Gegenprobe belegt

`git stash` + erneuter Lauf auf unberührtem `origin/main`, beide Male wortgleich:

- **Privat-Brain (4):** 🔑 Andock-Wizard-Knopf ins Modal injiziert · ✍
  Semantik-Beschreibung-Block injiziert · 🛡 Schutz-Block injiziert ·
  Andock-Wizard-Dialog vorhanden.
- **family-project (2):** `wss://relay.family-projekt.de` —
  *„Establishing a tunnel via proxy server failed"* (der Egress-Proxy dieser
  Sitzung sperrt die Domäne) · `MycelBg.setTheme` (three.js/WebGL headless).

---

## Was dabei herauskam, ohne dass jemand danach gesucht hat

**BookLedgerPro trägt den Wizard-Kanon nicht.** Gemessen auf `origin/main`: es
gibt dort kein `sbkim-andock-wizard.js`; `sbkim/siegel-inhalt.js` hat **479
Zeilen** und trägt den Wizard weiter inline — die Fassung von **vor** der
A18-Trennung vom 2026-09-14. In jeder anderen App sind es 32 Zeilen.

Es fehlen dort damit vier Generationen: `embeddingVersion` (dieser Befund),
`embeddingSource`/`sampleContent` (2026-09-15), der Identitäts-Wechsler-Nachzug
und die Übersetzungs-Tabelle.

⚠ **Der Automat konnte das nicht melden.** Er erkennt Träger am **Inhalt**
(`SBKIM — Modul NN` im Kopf) und findet deshalb nur, **was da ist**. Eine App
ohne Kopie trägt keine Marke, steht in keiner Fundliste und wird
stillschweigend übersprungen; die Meldung lautete „19 Kopien geschrieben".

**Nicht nachgezogen, ausdrücklich:** das ist ein Generationen-Sprung
(Ladekette, `siegel-inhalt.js` kürzen, Cache-Bump, Probenlauf im Ziel-Repo),
kein Zwei-Zeilen-Nachtrag. **Klaus entscheidet.**

---

## Was offen bleibt

1. **Klaus' Browser-Sichttest** — nicht ersetzbar.
2. **BookLedgerPro** (siehe oben).
3. **Privat-Brains 4** und **SB-KIMTool-Points 2** vorbestehende rote Zeilen.
4. **`sbkim/15_membran.js` in family-project** hängt eine Generation zurück.
5. **Der Rezept-Export trägt die Spore nicht** — benannter Befund, nicht gebaut.
6. **Mein WorkFlohs `sampleContent()`-Gerüst bleibt ausgeschaltet.**
7. **`docs/PULS.md` steht bei 2971 von 3000 Zeilen** — die nächste Sitzung, die
   einen längeren Eintrag schreibt, lagert vorher ins Archiv aus. **Nicht
   kürzen, auslagern.**
