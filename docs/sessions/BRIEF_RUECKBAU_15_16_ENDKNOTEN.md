# Brief — Rückbau Modul 15 + 16 + Spore-Diagnose pro Endknoten

**Anlass:** Klaus' UI-Befund 2026-05-25 nach erster Endknoten-
Migration (Mein-Rezeptbuch + Mein-Mixarium):

- Lampen + Siegel nehmen zu viel Platz in der Navleiste, nicht
  einheitlich, kein User-X-Schließen.
- **Zusätzlich:** Mein-Rezeptbuch hat seine Spore verloren (oder die
  Spore ist defekt); Mein-Mixarium kann keinen Handshake mehr zu
  Mein-Rezeptbuch herstellen.

**Strategie:** Module 15 + 16 sauber ausbauen, damit die PWAs wieder
auf den Pre-Migration-Stand kommen. Spore-Lage **diagnostizieren**,
aber **nicht in der Sitzung reparieren** — Spore-Signierung braucht
Browser-Crypto (Ed25519 + IndexedDB-Identität), das ist Klaus-Schritt
nach Sitzung im Browser.

**Pipeline-Einordnung:** Diese Sitzung ist eine Notfall-Pflege
zwischen Pipeline-Schritt 5 (erste Migration, gelaufen) und Schritt
5b (Spec-Sitzung 17). Sie ist KEINE Re-Migration mit Widget — das
folgt erst in Schritt 5d nach Bau-Sitzung 17.

**Branch im Endknoten-Repo (Vorschlag):** `claude/rueckbau-15-16`

**Voraussetzungen:**

- Brief läuft pro Endknoten-Repo (Mein-Rezeptbuch UND Mein-Mixarium).
- Brief-Inhalt ist identisch — die Sitzung erkennt selbst, welches
  Repo gerade gepflegt wird.
- Sage-Protokol bleibt unangetastet.

---

## Brief-Codeblock (für den ersten Prompt der Rückbau-Sitzung)

```
Du bist eine Bau-Sitzung in einem Endknoten-Repo (Mein-Mixarium ODER
Mein-Rezeptbuch) — Rückbau Modul 15 + 16 + Spore-Diagnose.

Branch im Endknoten-Repo: claude/rueckbau-15-16 (vom main aus
anlegen). Sage-Protokol-Repo wird NICHT angefasst.

Sitzungs-Rolle: Bau (Rückbau einer früheren Migration). Du baust
Modul 15 (Membran) und Modul 16 (Siegel) sauber aus, weil Klaus'
UI-Sichttest 2026-05-25 ergab, dass die Navleisten-Mount-Architektur
nicht skalierbar ist (siehe Sage-Protokol Pflege-Brief
BRIEF_SPEC_15_16_FLOATING_WIDGET.md). Modul 17 Widget wird in einer
späteren Sitzung gebaut + neu migriert — diese Sitzung räumt nur
auf.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md des Endknoten-Repos (falls vorhanden) — falls nicht,
   die Endknoten-Datei-Struktur erkunden.
2. Endknoten-Repo's `index.html` — wo die Module 15 + 16
   <script>-Tags + CSS-Anker + Navleisten-Markup sitzen.
3. Endknoten-Repo's `sbkim-init.js` (oder Äquivalent) — die
   `SbkimMembrane.init` + `SbkimSiegel.init`-Aufrufe.
4. Endknoten-Repo's `sbkim/`-Verzeichnis — welche Modul-Dateien
   liegen.
5. Endknoten-Repo's `sbkim/spore.json` — der aktuelle Spore-Inhalt
   (NICHT verändern).
6. Endknoten-Repo's `sbkim-sw.js` (Repo-Root) — wo der SW-Probe-
   Detektor aus Bau 15.SW eingebaut wurde.

Heilige Tafeln (Rückbau-spezifisch):

- **Kein Sage-Protokol-Eingriff.** Sage-Protokol bleibt unangetastet.

- **Spore NICHT antasten.** `sbkim/spore.json` wird NUR gelesen, nie
  geschrieben oder gelöscht. Auch wenn sie defekt ist — Reparatur ist
  Klaus-Schritt im Browser, nicht diese Sitzung.

- **IndexedDB NICHT manipulieren.** Diese Sitzung schreibt keinen
  Browser-Code — die Browser-Storage des Endknotens bleibt
  unangetastet.

- **Modul 02 / 05 / 07 / etc. NICHT entfernen.** Nur Modul 15 + 16
  + die zugehörigen UI-Anker + der SW-Probe-Detektor aus Bau 15.SW
  werden ausgebaut. Alle anderen Module bleiben.

- **`PROTOCOL_VERSION` / `DB_VERSION` / `BACKUP_FORMAT_VERSION`
  NICHT ändern.**

- **`SbkimStorage.init({dbSuffix:...})` NICHT ändern** — der PWA-
  Suffix bleibt (Identitäts-Pfad-Trennung pro Endknoten).

Deine Aufgabe heute — sechs Phasen (A0 + A + B + C + D + E,
Klaus-Phase F nach Sitzung):

PHASE A0 — PR + main-Stand prüfen (PFLICHT, ALS ERSTES):

A0a. **Branch-Stand:** auf welchem Branch arbeitet das lokale Clone?
     (`git status` + `git branch`). Sollte `main` sein oder ein
     Feature-Branch vom main.

A0b. **PR-Historie im Endknoten-Repo prüfen:** welche PRs der
     letzten 7 Tage (Stand 2026-05-25) sind gemerged in main, welche
     noch offen? Aufzulisten mit Titel + Status + merged-at-Datum.
     - GitHub Pages liefert standardmäßig `main` aus. Wenn ein PR
       NICHT gemerged ist, lebt sein Stand nur im Feature-Branch,
       NICHT live in der PWA.
     - Insbesondere zu prüfen: gibt es einen offenen PR
       „Endknoten-Migration Multi-Identität" oder „Bau 15 + 16"
       oder „Mod15.x" / „MR 15_8" / „MM 15_8"-artigen Titel?

A0c. **main-`index.html` lesen** und KONKRET ZÄHLEN:
     - Wie viele `<script src="sbkim/...">`-Tags?
     - Sind 15_membran.js + 16_siegel.js darunter?
     - Welche Lampen + Badges sind im HTML-Markup (Such-String
       `#lamp-fremd`, `#sbkim-siegel-badge`, `class="lamps"`)?
     - Sind die `--lamp-alert`-/`--siegel-*`-CSS-Variablen
       definiert?

A0d. **Pages-Build-Status prüfen:** wann hat GitHub Pages das letzte
     Mal gebaut? (`gh api repos/<owner>/<repo>/pages/builds` oder
     MCP-Pendant). Wenn der letzte Build älter als der letzte
     Migration-Merge ist, hängt Pages — Klaus muss neu pushen oder
     einen Force-Build triggern.

A0e. **Visual-Sichttest dokumentieren (aus Klaus' Screenshots
     2026-05-25):**
     - **Mein-Rezeptbuch (PWA live):** eigene Top-Header-Bar oben,
       Lampen-Pille `LEBT · VERKEHR · FREMD · SBKIM-Siegel` (alle
       drei Lampen plus Siegel, Sage-Page-Optik 1:1 übernommen).
     - **Mein-Mixarium (PWA live):** floating rechts außerhalb des
       App-Containers, nur `FREMD · SBKIM-Siegel` (Lampen LEBT +
       VERKEHR fehlen, KEINE Top-Bar).
     - Diese Diskrepanz ist KEIN Spec-Verstoß meinerseits — sie
       zeigt, dass beide Sitzungen den Brief unterschiedlich
       interpretiert haben (Rezeptbuch hat Sage-Page-Lampen
       mitkopiert, Mixarium hat nur 15+16 gemacht).
     - Mixariums Stand könnte das Ergebnis einer „Variante-2"-
       Entscheidung sein (Vorbereitung ohne volle Optik).
     - Phase A0c-Befund soll diese Hypothese bestätigen oder
       widerlegen.

A0f. **Befund aus A0 EXPLIZIT ins Übergabeprotokoll schreiben.**
     Klaus muss am Tab sehen können:
     - „PR XYZ wurde am DD.MM gemerged."
     - „GitHub Pages hat zuletzt am DD.MM gebaut."
     - „Auf main stehen folgende Module 15 + 16 + zugehörige
       Lampen-/Siegel-Anker: ..."
     - „Visueller PWA-Stand laut Screenshot stimmt / weicht ab in
       folgenden Punkten: ..."

PHASE A — Diagnose Spore-Lage + Service-Worker + Modul-Liste (READ-
ONLY, kein Datei-Eingriff):

A1. **Spore-Datei prüfen:**
    - Existiert `sbkim/spore.json` im Repo? (`ls sbkim/spore.json`)
    - Ist der Inhalt valides JSON? (`python3 -m json.tool sbkim/spore.json`
      oder `node -e "JSON.parse(...)"`)
    - Welche Pflichtfelder fehlen oder sind `null`? Pflicht:
      `id`, `domain`, `endpoint`, `nodeType`, `protocolVersion`,
      `publicKey`, `domainVector` (384 Zahlen), `signature`,
      `createdAt`.
    - Logge das Ergebnis im Übergabeprotokoll.

A2. **Service-Worker-Cache prüfen:**
    - Welcher Datei-Name hat der aktive SBKIM-SW?
      (`ls sbkim-sw*.js` im Repo-Root)
    - Welche `CACHE_NAME` / `SW_VERSION` steht im SW-Code?
    - Wurde `importScripts('./sbkim-sw-...')` in `app-sw.js`
      gepatcht (Variante 3b)?
    - Logge das Ergebnis.

A3. **Modul-Liste prüfen:**
    - Welche `sbkim/*.js`-Dateien liegen im Repo?
    - Welche werden in `index.html` per `<script src="...">`
      eingebunden?
    - Welche Reihenfolge?
    - Logge die Liste.

A4. **Navleisten-Markup prüfen:**
    - Gibt es `#lamp-fremd` oder `#sbkim-siegel-badge` im HTML?
    - Wo sitzen sie (welcher Container)?
    - Wurde der `.lamps`-Container neu angelegt oder gab es ihn
      vorher?
    - Logge das HTML-Schnipsel.

A5. **sbkim-init.js prüfen:**
    - Welche `await Sbkim<X>.init(...)` Zeilen stehen drin?
    - Insbesondere `SbkimMembrane.init` und `SbkimSiegel.init` — mit
      welchen Optionen?

PHASE B — Rückbau in `index.html`:

B1. **Modul-15-+-16 `<script>`-Tags entfernen:**
    - `<script src="sbkim/15_membran.js"></script>` löschen.
    - `<script src="sbkim/16_siegel.js"></script>` löschen.
    - Die anderen Module 00-08 BLEIBEN unverändert.

B2. **Modul-15-CSS-Anker entfernen:**
    - `--lamp-alert: #DC2626;` aus `:root` entfernen (falls vor
      Migration nicht da).
    - `.lamp.fremd-alert`, `.lamp.fremd-pulse`, `@keyframes lamp-
      alert-pulse` CSS-Regeln entfernen.
    - `@keyframes lamp-breath` — NUR entfernen, wenn keine andere
      Klasse (`.lamp.alive`) sie auch nutzt. Sonst stehen lassen.

B3. **Modul-16-CSS-Anker entfernen:**
    - `--siegel-gold`, `--siegel-gold-glow`, `--siegel-ink`,
      `--siegel-line` aus `:root` entfernen.
    - `#sbkim-siegel-badge` + Hover/Focus/First-Boot-CSS entfernen.
    - `@keyframes siegel-first-boot` entfernen.

B4. **Navleisten-Markup entfernen:**
    - `<span class="lamp" id="lamp-fremd" ...></span>` und
      `<span class="lamp-label">fremd</span>` entfernen.
    - `<span ... id="sbkim-siegel-badge">` (falls Modul 16 ihn
      schon gemountet hatte) entfernen.
    - Falls der `.lamps`-Container vor Modul-15-Migration nicht
      existierte (Phase-A4-Befund): den Container komplett
      entfernen. Sonst nur die FREMD-Lampe + Siegel-Badge-Spans
      raus, Container bleibt mit den anderen Plaketten (z.B. LEBT
      / VERKEHR aus Sage-Page-Optik) — was Phase-A4 ergab.

PHASE C — Rückbau in `sbkim-init.js`:

C1. **`await SbkimMembrane.init(...)` Aufruf entfernen** (kompletter
    Block inkl. Kommentar).

C2. **`await SbkimSiegel.init(...)` Aufruf entfernen** (kompletter
    Block inkl. Kommentar).

C3. Reihenfolge der anderen `init()`-Aufrufe BLEIBT unverändert.

PHASE D — Modul-Dateien + Service-Worker:

D1. **Modul-Dateien aus `sbkim/` löschen:**
    - `sbkim/15_membran.js` löschen.
    - `sbkim/16_siegel.js` löschen.
    - Andere `sbkim/*.js`-Dateien BLEIBEN.

D2. **`sbkim-sw.js` (Repo-Root) — SW-Probe-Detektor entfernen:**
    - Den `fetch`-Listener-Block, der `/sbkim/`-Endpunkt-Probes als
      Page-Message weiterreicht (Bau 15.SW), entfernen.
    - Falls die SW-Datei aus dem Sage-Protokol-Repo `src/sbkim-sw.js`
      kopiert ist und der Detektor dort als getrennter Block sitzt:
      sauber entfernen.
    - `CACHE_NAME` / `SW_VERSION` bumpen für Cache-Bust (z.B.
      `v25` → `v26`).
    - Falls Variante 3b: `app-sw.js` `importScripts('./sbkim-sw-
      vXX.js')`-Pfad mitbumpen.

D3. **File-Rename als zusätzlicher Cache-Bust:**
    - `sbkim-sw-vXX.js` → `sbkim-sw-vXX+1.js`.
    - Referenzen in `index.html`, `app-sw.js`, `sbkim/`-Pfaden
      durchziehen.

PHASE E — Sichtkontrolle (Klaus, im Browser):

E1. Endknoten-PWA in DeX-Chrome / Tablet-Chrome neu laden (Hard-
    Reload Strg+Shift+R).

E2. DevTools → Konsole → erwartete Selbstcheck-Zeilen (NEUN, nicht
    elf):
    ```
    MODUL 00 DOKU-FENSTER bereit, Funktionen: ...
    MODUL 01 STORAGE bereit, Funktionen: ...
    MODUL 02 SPORE bereit, Funktionen: ...
    MODUL 03 EMBEDDING bereit, Funktionen: ... (nach init)
    MODUL 04 MATCH bereit, Funktionen: ...
    MODUL 05 ANASTOMOSE bereit, Funktionen: ...
    MODUL 06 HETEROKARYOSE bereit, Funktionen: ...
    MODUL 07 APOPTOSE bereit, Funktionen: ...
    MODUL 08 UI-DEMO bereit, Funktionen: ...
    ```
    KEINE Modul-15-Zeile, KEINE Modul-16-Zeile.

E3. Navleiste: keine FREMD-Lampe, kein Siegel-Badge. Die App-eigene
    Header-Optik atmet wieder.

E4. Live-Cross-Knoten-Handshake mit dem anderen Endknoten (nach
    Spore-Reparatur in Klaus-Phase F): zwei Tabs, einer ruft
    `SbkimAnastomose.handshake(peerSpore, ownVec)`. Erwartung:
    `outcome:"established"`. **Erst NACH Klaus' Spore-Reparatur.**

PHASE F (KLAUS-SCHRITT, NICHT DIESE SITZUNG) — Spore-Reparatur:

NACH dem Rückbau, im Browser am Tablet:

F1. **Diagnose live im Browser:**
    - Endknoten-PWA öffnen (z.B. Mein-Rezeptbuch).
    - Eruda öffnen (sofern noch eingebaut — siehe Karte 09
      § Tablet-Variante).
    - In Eruda → Resources → IndexedDB → `sbkim_rezeptbuch` →
      Store `sbkim_keys` → Schlüssel `"main"` → ist das Keypair
      drin?
    - Wenn JA: Identität existiert, nur die Datei `sbkim/spore.json`
      ist verloren → F2 (Re-Sign).
    - Wenn NEIN: Identität ist weg → F3 (Backup-Import) oder F4
      (frische Identität).

F2. **Re-Sign-Pfad** (Identität OK, nur Datei weg):
    - In Eruda-Konsole:
      ```js
      var spore = await SbkimSpore.getOwnSpore();
      copy(JSON.stringify(spore, null, 2));
      ```
    - In GitHub-Web-UI (oder Termux `git`) den JSON-Inhalt in
      `Mein-Rezeptbuch/sbkim/spore.json` einfügen + commit + push.
    - Pages-Build wartet 1–2 Minuten.

F3. **Backup-Import-Pfad** (Identität weg, Backup-Blob vorhanden
    aus früherem `SbkimSpore.exportBackup(password)`):
    - Im Endknoten-Andock-Wizard (oder via Eruda-Konsole):
      ```js
      await SbkimSpore.importBackup(blob, password);
      var spore = await SbkimSpore.getOwnSpore();
      copy(JSON.stringify(spore, null, 2));
      ```
    - Wie F2 committen.

F4. **Frische-Identität-Pfad** (Identität weg, kein Backup):
    - In Eruda-Konsole:
      ```js
      await SbkimSpore.getOrCreateIdentity();  // erzeugt frisches Keypair
      var spore = await SbkimSpore.generateOwnSpore({
        domain: "...",            // aus alter Spore übernehmen, siehe Repo
        endpoint: "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/",
        nodeType: "hybrid",
        nodeName: "Rezeptbuch Klaus",
        domainDescription: "...",
        domainKeywords: [...],
        domainVector: Array.from(await SbkimEmbedding.embedPassage("...")),
      });
      copy(JSON.stringify(spore, null, 2));
      ```
    - Wie F2 committen.
    - **WICHTIG:** Neue Identität = neue `nodeId`. Mein-Mixariums
      `sbkim_siblings_main`-Eintrag mit der alten Rezeptbuch-nodeId
      ist ungültig — Klaus löscht ihn manuell via Eruda-Konsole
      ODER ein neuer Handshake legt einen frischen Eintrag an.

F5. **Konnektivitäts-Test:**
    - Mein-Mixarium-Tab + Mein-Rezeptbuch-Tab beide offen.
    - In Mein-Mixariums Eruda:
      ```js
      var peer = await fetch("https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/spore.json").then(r=>r.json());
      var vec = window.__sbkimDomainVector;
      var res = await SbkimAnastomose.handshake(peer, vec);
      console.log(res);
      ```
    - Erwartung: `outcome:"established"`, score > 0.80.

Was du NICHT tust:

- **Kein Sage-Protokol-Eingriff.**
- **Kein Eingriff in `sbkim/spore.json`** — die bleibt unangetastet
  (auch wenn defekt, weil Reparatur Browser-Crypto braucht).
- **Kein Eingriff in `sbkim/01_storage.js` … `sbkim/08_ui_demo.js`
  oder `00_doku_fenster.js`** — nur Modul 15 + 16 raus.
- **Kein `<script src="sbkim/17_widget.js">` einbauen** — Modul 17
  ist Spec ausstehend (Pipeline-Schritt 5b in Sage-Protokol).
- **Kein Inkrement von `PROTOCOL_VERSION`** etc.
- **Kein Spore-Re-Generate als Code-Eingriff** — Klaus macht das im
  Browser (Phase F).

Pflicht am Ende der Sitzung:

1. **Übergabeprotokoll im Endknoten-Repo** (typisch
   `docs/sessions/archiv/2026-05-XX_rueckbau-15-16.md`, falls
   Endknoten ein eigenes PULS hat; sonst README-Eintrag oder
   Commit-Message ausreichend dokumentieren).
   Inhalt:
   - Datum + Endknoten-Name.
   - Phase-A-Diagnose-Ergebnisse (Spore-Lage, SW-Cache, Modul-Liste,
     Navleisten-Markup, sbkim-init.js-Zustand).
   - Phase-B-D-Eingriffe (was wurde entfernt, was bleibt).
   - Phase-E-Sichttest-Erwartung (wartet auf Klaus).
   - Phase-F-Schritte (Klaus' Browser-Arbeit nach der Sitzung).

2. **Commit-Reihenfolge:**
   - Commit 1: „PhaseA Diagnose-Logs" (z.B. als
     `docs/diagnose-2026-05-25.md` oder im Übergabeprotokoll).
   - Commit 2: „PhaseB+C+D Rückbau Modul 15 + 16 + SW-Probe-
     Detektor entfernt".
   - Commit 3: „Cache-Bust v25→v26" (File-Rename + SW-Code-Bump).

3. Push auf Branch `claude/rueckbau-15-16`.

4. Draft-PR im Endknoten-Repo anlegen mit Übergabeprotokoll-Inhalt
   als PR-Beschreibung.

5. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort:
   - PR mergen lassen.
   - Klaus' Phase-F Spore-Reparatur (drei Pfade F2/F3/F4 — Klaus
     wählt nach Diagnose-Ergebnis).
   - Konnektivitäts-Test F5.
   - DANACH: warten auf Sage-Protokol Spec-Sitzung 17 + Bau-Sitzung
     17 (Modul 17 Widget). Erst nach Modul 17 Bau läuft die
     RE-Migration mit Widget (Pipeline-Schritt 5d).

Stolperfallen:

- **Cache-Bust ist Pflicht.** Ohne File-Rename ODER `CACHE_NAME`-
  Bump läuft der Endknoten weiter mit dem alten SW, der noch Modul
  15/16-Pfade routet. Klaus' Sichttest zeigt dann „Modul 15 / 16
  noch da" trotz git-pull → Cache-Bust nochmal.

- **Spore-Re-Sign braucht die LIVE-Domain.** Wenn Klaus die alte
  Identität noch in IndexedDB hat, kann er via `getOwnSpore()` die
  Spore re-bauen — aber der `domainVector` muss aus der gleichen
  Liste von `domainKeywords` kommen wie früher, sonst wird der
  Score-Wert anders. Vorsichtshalber: Klaus prüft erst, ob
  `sbkim_spore[main]` in IndexedDB noch eine vollständige Spore
  enthält — wenn ja, ist das die Kopie zum Wiederholen.

- **Variante 3b App-SW-Patch:** falls der Endknoten-App-SW
  `importScripts('./sbkim-sw-vXX.js')` enthält, muss der Pfad beim
  Rename mitbumpen. Sonst lädt der App-SW ein veraltetes Skelett.

- **Inkonsistenz zwischen Endknoten zulässig.** Wenn nur Mein-
  Rezeptbuch Modul 15/16 verbaut hatte und Mein-Mixarium nicht
  (z.B. weil Mixarium-Sitzung wegen Variante-1/2-Frage pausierte):
  der Rückbau läuft pro Repo eigenständig. Phase A2/A3/A4-Logs
  zeigen den tatsächlichen Stand.

- **PR-Stand prüfen ist wichtiger als Code-Diagnose.** Phase A0
  klärt zuerst, was überhaupt auf main steht. Klaus' Screenshot-
  Befund 2026-05-25 (Mein-Rezeptbuch zeigt VOLLE Sage-Page-Lampen-
  Optik LEBT+VERKEHR+FREMD+Siegel, Mein-Mixarium zeigt nur FREMD
  +Siegel floating ohne Top-Bar) deutet darauf hin, dass die zwei
  Endknoten unterschiedliche Migration-Stände auf main haben. PR-
  Historie pro Repo zeigt warum. Wenn ein Endknoten-Bauer
  zusätzlich Sage-Page-spezifische CSS-Anker übernommen hat
  (`#lamp-alive`, `#lamp-traffic`, Topbar-`<header>`), gehören die
  beim Rückbau MIT raus — sonst bleibt eine halbe Optik liegen, die
  keine Funktion hat.

Zeitschätzung: ~2 h pro Endknoten (Phase A0 PR-Stand + A Spore-
Diagnose + B-D Rückbau + Cache-Bust). Phase F ist Klaus-Schritt,
weitere ~30 min. Sitzung soll NICHT übermäßig lang werden —
Phase A0 ist die wichtigste; wenn A0 ergibt „PR gar nicht gemerged"
oder „Pages baut den falschen Stand aus", ist der Rückbau-Pfad
eventuell anders (z.B. einfach PR schließen statt Code rückbauen).
Klaus EXPLIZIT informieren, bevor Phase B startet.
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Rückbau-Sitzung
liest)

### Warum die Spore in Phase F repariert wird und nicht in der Sitzung

Spore-Signierung braucht den **privaten Ed25519-Key**, der in deiner
**Browser-IndexedDB** liegt — eine Code-Sitzung ist headless, hat
keinen Browser-Crypto-Pfad und kann **deine Identität nicht klonen**.

Drei Pfade in Phase F, je nach Diagnose-Ergebnis:

- **F2 Re-Sign:** Identität ist noch da (IndexedDB-Keypair OK), nur
  die Datei `sbkim/spore.json` ist weg → schnellster Pfad, alte
  `nodeId` bleibt erhalten, Mein-Mixariums Geschwister-Eintrag bleibt
  valide.

- **F3 Backup-Import:** Wenn du irgendwann mal `SbkimSpore.
  exportBackup(password)` aus Bau 02.X gemacht hast (z.B. nach dem
  ersten Andocken 2026-05-16), kannst du den verschlüsselten Blob
  re-importieren. Selbe `nodeId`, selbes Keypair.

- **F4 Frische Identität:** Wenn weder F2 noch F3 möglich → neue
  `nodeId`, neue Spore. Mein-Mixariums alter Sibling-Eintrag wird
  ungültig (entweder Klaus löscht ihn manuell oder ein neuer
  Handshake legt einen frischen an, der alte verschwindet beim
  TTL-Sweep nach 30 Tagen).

### Was diese Sitzung NICHT löst

- Modul 17 Widget bauen — eigene Sitzung in Sage-Protokol (Pipeline
  5b/5c).
- Re-Migration mit Widget — eigene Sitzung im Endknoten-Repo
  (Pipeline 5d) NACH Bau-Sitzung 17.
- App-Freigabe — Pipeline-Schritt 6.

### Notfall-Termux-Pfad

Termux ist KEIN Code-Editor-Workflow (CLAUDE.md § Arbeitsumgebung).
Aber für **drei spezifische Operationen** ist Termux der saubere
Pfad:

- **`git clone` + `cat sbkim/spore.json`** — Diagnose, was im Repo
  liegt (alternative zu GitHub-Web-UI).
- **Commit + Push der reparierten Spore** (Phase F) — `git add
  sbkim/spore.json && git commit -m "fix: spore re-signed" && git
  push`.
- **`python3 -m http.server 8000`** — falls Klaus den Endknoten lokal
  testen will, bevor er pusht.

Code-Änderungen am `index.html` oder `sbkim-init.js` laufen
**nicht** via Termux — die kommen aus der Bau-Sitzung als PR.

### Optionale Folge-Pflegen

- **Backup-Routine etablieren:** nach Phase F (egal welcher Pfad)
  legt Klaus sich an, **jeden Monat einmal** `SbkimSpore.
  exportBackup(password)` zu rufen und den Blob lokal außerhalb des
  Browsers zu sichern. So tritt der „Spore verloren"-Befund nicht
  wieder ein.

- **Pages-Cache-Header prüfen:** wenn GitHub Pages den Spore-Endpunkt
  aggressiv cacht, kann ein Re-Sign 5–10 Minuten dauern, bis er live
  ist. Eigene Mini-Pflege Karte 09 § Schritt 7 mit Cache-Hinweis.
