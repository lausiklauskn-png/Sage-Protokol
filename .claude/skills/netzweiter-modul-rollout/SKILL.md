---
name: netzweiter-modul-rollout
description: Kanonisches Rezept, um ein gereiftes SBKIM-Modul (z.B. Modul 23 Rendezvous mit Kartenechtheit/Flut-Deckel, oder Modul 16 Siegel) byte-1:1 aus dem Sage-Kanon in ALLE tragenden Repos des Netzes auszurollen — sicher, ehrlich, gegengeprüft. Anwenden, wenn ein Modul in Sage (`src/modules/`) reift und die Apps es noch in einer älteren Generation tragen (Schutz-Plan-Stufe fehlt netzweit, "nur Sage hat es"), wenn ein Rollout-Brief eine App-Liste + zwei sha-Pins nennt, oder wenn ein Sicherheits-Aspekt (ZERTIFIKAT_ASPEKTE) netzweit sichtbar werden soll. Deckt die Fallen ab, an denen frühere Sitzungen gestolpert sind: drei gleichzeitige Modul-Generationen, sha-Pins in Test-Dateien UND Drift-Guards (die MEHR pinnen als der Brief nennt), Loader-Datei vs. echte Modul-Kopie (SB-KIMTool-Point), Ehrlichkeits-Kopplung Siegel-Aspekt↔Code, Rebase gegen eine Parallel-Sitzung, und die Pflicht-Gegenprobe.
---

# Netzweiter Modul-Rollout (SBKIM)

Ein gereiftes Modul wird in Sage-Protokol gepflegt (`src/modules/NN_*.js`) und
dann **byte-1:1** in jede App kopiert (Modul 09, „kopieren, nicht klonen"). Dieses
Rezept ist die feste Reihenfolge dafür — jede Zeile ist aus einem realen Rollout
gelernt (Stufe 2b Kartenechtheit, 2026-07-30, 13 Repos).

## Grundregel: MESSEN vor ÄNDERN, Diff-LESEN vor ÜBERSCHREIBEN

Nie blind kopieren. Erst den Ist-Stand jedes Trägers per sha256 messen, dann den
`git diff` der vorhandenen Kopie gegen den Kanon **lesen** — erwartet sind nur
Kanon-Zuwächse. Findet sich eine **repo-eigene** Zeile: NICHT überschreiben,
sondern Klaus fragen.

## Schritt 0 — Kanon fixieren

```bash
cd Sage-Protokol
git fetch origin main --quiet
sha256sum src/modules/NN_*.js   # die Ziel-sha(s), gegen die alle prüfen
```

Der Kanon ist die einzige Wahrheit. Prüfe zusätzlich, ob eine **Parallel-Sitzung**
den Kanon währenddessen bewegt (`git log HEAD..origin/main`): betrifft sie deine
Ziel-Datei oder eine Nachbar-Datei (z.B. `23_rendezvous_ui.js`)? Nachbar-Dateien
sind nicht dein Auftrag — nur wissen, dass sie sich bewegen.

## Schritt 1 — Alle Träger messen (origin/main, nicht der lokale Klon!)

```bash
for r in <alle Repos>; do
  git -C "$r" fetch origin main --quiet
  git -C "$r" show origin/main:<pfad>/NN_modul.js | sha256sum | cut -c1-12
done
```

**Drei Generationen sind normal.** Beim Stufe-2b-Rollout liefen gleichzeitig:
Kanon `3caa0bb1`, die meisten Apps `9f3a2085` (eine Gen zurück), beide Tresore
`bbdf02a8` (**zwei** Gen zurück — ihnen fehlte zusätzlich `rankCardsByQuery`/A11).
Der größere Diff bei den Zurückliegenden ist **erwartet**, weil der Kanon eine
Obermenge ist. Kein Grund zu erschrecken — aber trotzdem den Diff lesen.

**Abkürzung, die gilt:** Repos mit **identischer** sha tragen eine **byte-
identische** Datei → derselbe Diff. Es genügt, den Diff je **eindeutiger** sha
**einmal** zu lesen (nicht 12×).

## Schritt 2 — Diff je Generation gegen den Kanon lesen

```bash
git -C <repo> show origin/main:<pfad>/NN.js > /tmp/gen.js
diff /tmp/gen.js Sage-Protokol/src/modules/NN.js
```

Prüfe die **entfernten** Zeilen (`<`): sie müssen kanonische Ersetzungen sein
(z.B. `setTimeout(function…` → `setTimeout(async function…`), keine repo-eigene
Logik. Sind alle `<`/`>` reiner Kanon-Fortschritt → sicher.

## Schritt 3 — Branch je Repo + byte-1:1 kopieren

```bash
BR=claude/<scope>
git -C "$r" checkout -B "$BR" origin/main
cp Sage-Protokol/src/modules/NN.js "$r/<pfad>/NN.js"
sha256sum "$r/<pfad>/NN.js"   # muss == Kanon-sha
```

## Schritt 4 — sha-Pins nachziehen (die HÄUFIGSTE Falle)

Zwei Orte pinnen Modul-shas, und **der Brief listet oft nicht alle**:

- **Test-Smokes** (`test/smoke.test.js`, Kimboard/Kimseek): pinnen die Modul-sha.
- **Drift-Guards** (`tools/drift-guard.mjs`, Company-/Privat-Brain; auch
  `_smoke.mjs`, Standalone-Drift-Guards): pinnen viele Module.

**Verlass dich NICHT auf die Pin-Tabelle im Brief.** Der Stufe-2b-Brief nannte für
Privat-Brain nur den 23-Pin — der Drift-Guard pinnte aber **auch** `16_siegel.js`.
Änderst du 16 byte-1:1, MUSST du den 16-Pin mitziehen, sonst fällt der Guard.
Darum immer per grep die **echte** Pin-Menge finden und danach netzweit scannen:

```bash
# Welche Module pinnt der Guard WIRKLICH?
git -C <repo> show origin/main:tools/drift-guard.mjs | grep -E "'.*\.js':"
# sed alt->neu, dann: taucht IRGENDWO noch eine alte sha auf?
for r in <alle>; do git -C "$r" grep -l "<ALTE_SHA>"; done   # muss leer sein
```

## Schritt 5 — Loader ≠ Modul (SB-KIMTool-Point-Falle)

Manche Repos tragen eine **eigene Datei mit ähnlichem Namen**, die NICHT das Modul
ist. In SB-KIMTool-Point ist `assets/sbkim-siegel.js` nur ein **Loader/
Verdrahtungs-Skript** (lädt `web/tools/`-Module nach) — **nicht** ersetzen. Die
echte Modul-Kopie liegt in `web/tools/sbkim-siegel.js` / `web/tools/sbkim-
rendezvous.js`. Erst `head` + `grep ZERTIFIKAT_ASPEKTE` lesen, dann entscheiden,
welche Datei die Modul-Kopie ist.

## Schritt 6 — Ehrlichkeits-Kopplung: Aspekt NUR mit Code

Ein Sicherheits-Update trägt zwei Teile: den **Code** (Modul 23) und den
**Siegel-Aspekt** (Modul 16 `ZERTIFIKAT_ASPEKTE`, „Karten werden jetzt geprüft").
**Nie den Aspekt ohne den Code ausrollen** — dann behauptet das Siegel eine
Prüfung, die die App nicht leistet (Anti-Greenwashing-Leitplanke, Karte 16). In
SB-KIMTool-Point lag der Rendezvous-Code auf der alten Generation; nur den Aspekt
nachzutragen hätte das Siegel lügen lassen. Darum: **beide zusammen oder keins.**
Und: wer ein Schutz-Modul anfasst, ergänzt einen Aspekt (CLAUDE.md § Sicherheits-
Module pflegen Aspekte).

## Schritt 7 — Testen je Repo, mit GEGENPROBE

Pro Repo die echte Suite laufen (`npm test` / `node tests/*.mjs` / Drift-Guard) —
**ehrlich berichten**, auch Fehlschläge. Vorbestehende Fehler (fehlendes
`playwright-core`/`fake-indexeddb`, Playwright-Timeouts) durch **Gegenprobe auf
blankem `origin/main`** als „nicht durch den Rollout verursacht" belegen — nie
stillschweigend übergehen.

**Pflicht-Gegenprobe** für Kartenechtheit: `smoke_bau23b_kartenechtheit.mjs` hat
sie eingebaut (Probe 5: **ohne** Prüfer bleibt die faule Karte sichtbar,
`cardsVerified:false`; Probe 2/3/4: **mit** Prüfer fällt sie raus). Standard der
Reihe: **ohne den Fix muss die Probe fallen.**

## Schritt 8 — Commit, Push, PR, Merge (Freibrief)

Ein Commit pro Repo (deutsche Message, Kanon-sha nennen). Draft-PR → ready →
squash-merge (Selbst-Merge-Freibrief, CLAUDE.md § Freibrief). Nur pushen/mergen,
was getestet + abgegrenzt + nicht zweifelhaft ist.

## Schritt 9 — Parallel-Sitzungs-Konflikt (Rebase, nicht erschrecken)

Läuft eine Parallel-Sitzung, ist `origin/main` beim Merge evtl. **voraus** →
„Pull Request has merge conflicts". Dann NICHT den Kanon in Frage stellen:

```bash
git -C "$r" fetch origin main
git -C "$r" checkout -B "$BR" origin/main   # frisch neu aufsetzen
cp <kanon> "$r/<pfad>/NN.js"                 # meine Änderung neu drauflegen
# Pins neu sed'en (der Parallel-Pin, z.B. 23_ui, bleibt intakt)
git -C "$r" add -A && git -C "$r" commit …
git -C "$r" push --force-with-lease -u origin "$BR"
```

Weil deine Änderung byte-1:1 auf frischem `main` neu abgeleitet wird, entsteht kein
Kern-Konflikt — die Parallel-Änderung (z.B. `23_rendezvous_ui.js`) bleibt erhalten.

## Schritt 10 — Netzweite Verifikation

Nach allen Merges: `origin/main` jedes Repos neu fetchen und sha == Kanon prüfen.
Ziel: **N/N tragen den Kanon, 0 Fehler.** Erst dann ist der Rollout fertig.

## Schritt 11 — Abschluss (Sage)

`docs/PULS.md` fortschreiben · Übergabeprotokoll in `docs/sessions/archiv/` ·
`sbkim/SIGNAL.json` `seq +1` + Headline + history (das Pushen IST das Signal,
§11.6) · Folge-Brief als Chat-Codeblock · „Nächste Schritte" im Chat ·
**Klaus' Browser-Sichttest** anmahnen (headless ersetzt ihn nie).

## Bekannte Grenzen dieser Umgebung (nicht „reparieren")

- **family-project**: kein `package.json`, `tests/smoke_all.mjs` braucht
  playwright-core → nicht lauffähig. Beweis = sha256-Kopie.
- **Muttis-Rezeptbuch**: keine Test-Suite. Beweis = sha256-Kopie.
- **Playwright/e2e** (Tomys `smoke-spore-download.cjs`, Company-/Privat-Brain,
  family): hängen/timeouten headless — Drift-Guard/Logik-Suite ist der Beweis.
- **`fake-indexeddb`/`playwright-core`** fehlen bis `npm install` — vorbestehend,
  per Gegenprobe belegen.
