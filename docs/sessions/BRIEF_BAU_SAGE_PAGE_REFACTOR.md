# Brief — Bau-Sitzung Sage-Page-Refactor (Sage als dritter Endknoten)

**Bau-Sitzung in Sage-Protokol selbst** — die Sage-Page (`index.html`)
wird vom reinen Doku-Hub zum vollwertigen Endknoten ausgebaut. Volle
`init()`-Kette aller SBKIM-Module + Andock-Wizard an der Schwarz-Loch-
Karte + Identitäts-Wechsler-UX + Schichten-Lampen für den Bau-Pipeline-
Live-Stand.

**Position 1 der Bau-99-Pipeline** aus BRIEF_99_SAMMELSPEC_ABSCHLUSS.md.
Folgt nach Abschluss der Modul-Bauten 01.Y / 02.Y / 04.A / 04.B / 05.Y /
06.Y / 07.Y / 08.Y (alle gemerged in `main` `f3a6f6f` Stand 2026-05-20)
und nach Sichttest-Nachzug PR #124 (gemerged 2026-05-20).

Voraussetzung: alle Pre-Sage-Page-Bauten der Brief-99-Pipeline sind
gemerged (Bau-Pipeline 01.Y-08.Y + Bau 04.A + 04.B + Pflege Modul 01
versions-fail-soft + Sichttest-Nachzug PR #124).

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Sage-Page-Refactor.

Branch: claude/bau-sage-page-refactor (vom main aus anlegen,
Stand mindestens `f3a6f6f` nach Sichttest-Nachzug PR #124).

Sitzungs-Rolle: Bau-Sitzung — ein Modul-übergreifender Eingriff in
`index.html` der Sage-Page, plus ggf. neues `sbkim-sw.js` im Sage-
Page-Root (App-SW Variante 3a aus INTERFACES §6.1). KEIN Eingriff
in `src/modules/*.js` — die SBKIM-Module sind in der Bau-99-Pipeline
abgeschlossen. KEIN Spec-Eingriff — die Sage-Page-Architektur ist
in INTERFACES §6.1 verbindlich spezifiziert.

Pflichtleseliste (in dieser Reihenfolge):

1. CLAUDE.md
2. docs/PULS.md (Schnellüberblick + § Vision-Anker 1 Sage als
   Hybrid-Knoten + § Sitzungs-Einträge oben)
3. docs/INTERFACES.md §6 Endknoten-Liste + §6.1 Sage-Page-
   Architektur (verbindlich) + §6.2 Plattform-Matrix
4. docs/components/09_einbau_pwa.md (Andock-Anleitung — Sage
   befolgt sie als dritter Endknoten)
5. status.json § endknoten (Sage-Eintrag mit
   `pingStatus:"pending-first-andock"`)
6. index.html (aktueller Sage-Page-Stand — Doku-Hub mit Karten,
   Universum, Sonnen-Galaxie, Schwarz-Loch-Karte)
7. src/modules/*.js — nur überfliegen, um die Module-Lade-
   Reihenfolge zu verstehen. KEIN Eingriff.

Heilige Tafeln (Sage-Page-Refactor-spezifisch):

- **KEIN Modul-Code-Eingriff.** `src/modules/*.js` und
  `src/sbkim-sw.js` bleiben unangetastet. Wenn dabei eine Lücke
  auffällt (z.B. Identitäts-Wechsler-UX braucht eine API, die in
  Modul 02 nicht da ist), eigene Folge-Pflege-Sitzung mit eigenem
  Brief — NICHT in dieser Bau-Sitzung mitfixen.

- **IndexedDB-Suffix `sbkim_sage`.** Sage-Page nutzt
  `SbkimStorage.init({dbSuffix: 'sage'})` analog zu
  `sbkim_rezeptbuch` / `sbkim_mixarium` (Pflege 2026-05-16, Karte
  01 § Konfigurationswerte). KEINE Origin-Kollision mit Mein-
  Mixarium / Mein-Rezeptbuch wenn parallel installiert.

- **App-SW Variante 3a.** Sage-Page hat aktuell KEINEN eigenen
  Service-Worker. Standalone-`sbkim-sw.js` im Sage-Page-Root als
  einziger SW. Andocker (Mein-Rezeptbuch, Mein-Mixarium) nutzen
  Variante 3b (`importScripts('./sbkim-sw.js')` im bestehenden
  App-SW). Sage-Page-`sbkim-sw.js` ist eine Kopie von
  `src/sbkim-sw.js` — KEIN Refactoring der SW-Logik.

- **Domäne „Mycel-Bibliothek".** Sage's `domainDescription` /
  `domainKeywords` / `domainVector` ergeben sich aus dem Sage-Repo-
  Inhalt: Protokoll-Doku, Mycel-Vokabular, heilige Tafeln, Karten,
  INTERFACES, ARCHITEKTUR (Stamm) — Glossar-Wartung, Schwesternetz-
  Beobachtungen, Sitzungs-Briefe, Übergabeprotokolle (Gast). Siehe
  status.json § endknoten[sage].stammCategories / guestCategories.
  `domainVector` wird per `SbkimEmbedding.embed(domainDescription)`
  einmalig erzeugt und in einer **statischen Spore-JSON** unter
  `sbkim/spore.json` im Sage-Page-Repo abgelegt (analog Mein-
  Rezeptbuch / Mein-Mixarium).

- **Andock-Geste an der Schwarz-Loch-Karte.** Die bestehende
  Schwarz-Loch-Karte in `index.html` bleibt visuell unverändert.
  Klick öffnet **zusätzlich** zur Doku-md einen Andock-Wizard
  (Modal), der Klaus durch die Erst-Identitäts-Erzeugung führt
  (`SbkimSpore.getOrCreateIdentity()` → `getNodeId()` zeigen →
  Backup-Hinweis aus Bau 02.X). Der Wizard ist klein — kein
  vollumfänglicher Onboarding-Pfad. Variante III-Andock-Wizard
  (Vision-Anker 2) ist eine eigene größere Spec-Sitzung; hier nur
  die Sage-spezifische Mini-Geste.

- **Identitäts-Wechsler-UX** seit Bau 02.Y (`setActiveIdentity` /
  `listIdentities`). Klein und versteckt: ein Drop-Down im
  Doku-Fenster-Modal (Modul 00) oder ein eigener Knopf im
  Andock-Wizard. Nicht aufdringlich — Sage hat in der Regel nur
  eine Identität.

- **Schichten-Lampen** für die Bau-99-Pipeline-Modul-Stände.
  Visuelle Erweiterung der bestehenden Module-Bento-Karte (Karte
  4): zu jeder Modul-Kachel kommt ein „Schichten-Indikator" für
  den Live-Stand (z.B. „Spec fertig + Code-Stub + Live-im-Cross-
  Knoten-Handshake"). Liest aus `status.json § modules`. KEINE
  eigene Schicht-Logik — nur Anzeige.

- **`PROTOCOL_VERSION` / `DB_VERSION` / `BACKUP_FORMAT_VERSION`
  unverändert.** Sage-Page-Refactor ist ein Endknoten-Bau, kein
  Protokoll-Schema-Eingriff.

Aufgabe — sechs Punkte a–f:

a) **`sbkim-sw.js` im Sage-Page-Root anlegen.** Kopie von
   `src/sbkim-sw.js` (oder symbolischer Verweis via Build —
   einfache Kopie ist Sage-Page-Konvention, Single-File-PWA-Stil).
   Cache-Bust via File-Rename oder `CACHE_NAME`-Bump.

b) **script-Tags in `index.html` einfügen.** Reihenfolge aus Karte
   09 § Schritt 2:
     1. `src/modules/00_doku_fenster.js`
     2. `src/modules/01_storage.js`
     3. `src/modules/02_spore.js`
     4. `src/modules/03_embedding.js` (Modul 03 ist lazy — wird
        erst beim ersten `embed()`-Aufruf geladen, also kann das
        script-Tag direkt im Head stehen)
     5. `src/modules/04_match.js`
     6. `src/modules/05_anastomose.js`
     7. `src/modules/06_heterokaryose.js`
     8. `src/modules/07_apoptose.js`
     9. `src/modules/08_ui_demo.js`
   Kein 09-Modul (Karte 09 ist die Andock-Anleitung, kein Code).

c) **`sbkim-init.js` (neue Datei) für die volle init()-Kette.**
   Ruft `SbkimStorage.init({dbSuffix: 'sage'})` → `SbkimSpore.init()`
   → `SbkimAnastomose.init()` → `SbkimHeterokaryose.init()` →
   `SbkimApoptose.init()` → `SbkimUiDemo.init()` → registriert
   `sbkim-sw.js` als Service-Worker. Fail-soft pro Modul mit
   `console.warn` (Sage-Page soll auch bei einem fehlschlagenden
   Modul ladbar bleiben — Klaus' Doku-Hub-Bedürfnis).
   `sbkim-init.js` wird als letztes script-Tag in `index.html`
   eingebunden, nach allen Modul-Tags.

d) **Sage's Spore-JSON unter `sbkim/spore.json` ablegen.** Einmalig
   erzeugen: lokal `SbkimEmbedding.embed(domainDescription)` aufrufen,
   `domainVector` extrahieren, in `sbkim/spore.json` schreiben
   (statisch; nicht zur Laufzeit erzeugt, weil Sage-Page-Origin
   nicht selbst Empfänger ist — nur Spore-Lieferant für die zwei
   anderen Endknoten). `domainDescription` aus den Stamm-Kategorien
   abgeleitet (kein Klaus-Verfasser-Text). `nodeId` bleibt `null`
   bis zur ersten Sichttest-Andockung von Klaus' Browser-Identität.

e) **Andock-Wizard im Schwarz-Loch-Karten-Klick.** Modal-Dialog
   (analog zu Bau-Sitzung 2026-05-18 Sonnen-Galaxie-Modal). Inhalt:
     1. Begrüßung („Du dockst gerade am Sage-Mycel an")
     2. Knopf „Identität erzeugen" → ruft
        `await SbkimSpore.getOrCreateIdentity()` →
        `SbkimSpore.getNodeId()` zeigen
     3. Knopf „Backup machen" → ruft
        `SbkimSpore.exportBackup(passwordPrompt)` → Download-Link
     4. Hinweis-Text mit Karte-09-Verweis für den Vollumbau auf
        Variante III-Andock-Wizard (Vision-Anker 2 langfristig).
   Wizard kann jederzeit geschlossen werden; Doku-md-Pfad bleibt
   als Alternative im Modal-Footer.

f) **Schichten-Lampen-Anzeige in der Module-Bento-Karte (Karte 4
   bzw. ähnlich).** Pro Modul-Kachel: drei kleine LED-Dots
   (Spec / Code / Sichttest), Farbe aus `status.json § modules[i].
   score` (stub → grau, werkstatt → gelb, fertig → grün). Tooltip
   zeigt `siegel`-Feld. CSS-only, keine JS-Logik außer
   `fetch('./status.json').then(...).then(renderLampen)`.

Stolperfallen:

1. **Cache-Bust.** Service-Worker hält Sage-Page-Inhalte gecached.
   Beim Sichttest in Klaus' Browser muss zuerst `chrome://
   serviceworker-internals/` Unregister + „Clear site data" + Tab-
   Reopen (vgl. Bau 04.B Sichttest-Befund 2026-05-20). Hinweis im
   Sichttest-Protokoll der Sitzung dokumentieren.

2. **Modul 03 Embedding-Lazy-Load.** Modul 03 lädt das ~30 MB
   große Embedding-Modell erst beim ersten `embed()`-Aufruf. Wenn
   Klaus die Sage-Page nur als Doku-Hub nutzt, wird Modul 03 nie
   geladen — das ist gewollt. UX-Hinweis im Andock-Wizard: „Erstes
   Andocken kann 5–15 s dauern (Modul 03 lädt Embedding-Modell)."

3. **Spore-JSON statisch vs. dynamisch.** Sage-Page-Repo committet
   `sbkim/spore.json` statisch. `domainVector` wird einmalig vor
   dem Commit erzeugt (im Browser, dann manuell rein-kopiert oder
   per Skript erzeugt). Nicht zur Laufzeit aus der Sage-Page
   heraus überschreiben — Origin-Limitierung.

4. **Andock-Wizard schließt nicht Schwarz-Loch-Karte.** Die
   Schwarz-Loch-Karte hatte ihren ursprünglichen Klick-Pfad (Doku-
   md öffnen). Der Andock-Wizard kommt parallel ALS Erweiterung —
   beide Pfade müssen koexistieren. Implementierungs-Vorschlag:
   Wizard öffnet sich automatisch beim ersten Klick falls keine
   Identität existiert; danach ist nur noch der Doku-md-Pfad
   aktiv. Beide via Modal-Schicht.

5. **App-SW-Konflikte.** Sage-Page hat aktuell keinen App-SW.
   Wenn doch einer aus früheren GitHub-Pages-Caches da ist
   (`SBKIM_SW_STANDALONE` aus Pflege App-SW-Koexistenz beachten),
   sauber via `chrome://serviceworker-internals/` deregistrieren
   und neu installieren.

6. **Sichttest braucht Klaus.** Nicht headless — Klaus muss die
   Sage-Page in seinem Browser aufrufen, den Andock-Wizard
   ausprobieren, Identität erzeugen, Backup machen, und im Sicht-
   test-Protokoll der nächsten Sitzung dokumentieren. Die Bau-
   Sitzung schließt mit „Sichttest ungeprüft, wartet auf Klaus'
   Browser-Lauf" im Karte-09-Bauzustand-Vermerk.

Zeitschätzung: ~3–4 h für Bau (Sage-Page-Refactor + sbkim-sw.js +
sbkim-init.js + Andock-Wizard-Modal + Schichten-Lampen + Spore-
JSON-Skript). Sichttest danach als eigene Mini-Pflege-Sitzung mit
Klaus' Browser-Lauf.

Pflicht am Sitzungs-Ende:

1. PULS.md aktualisieren (neuer Top-Sitzungs-Eintrag „Bau Sage-Page-
   Refactor"). 3000-Zeilen-Schutz-Klausel beachten — ggf. ältere
   Inline-Sitzungen ins Archiv auslagern.
2. Karte 09 § Bauzustand-Zeile „Sage als dritter Endknoten
   bau-fertig" (Sichttest ungeprüft-Vermerk).
3. status.json § endknoten[sage] Punkte aktualisieren wo möglich
   (`integratedAt` auf das Bau-Datum, `sporeUrl` validieren). KEIN
   `nodeId` setzen — bleibt `null` bis Klaus' erster Browser-Lauf
   (`pingStatus: "pending-first-sichttest"` als neuer Zwischen-Zustand
   denkbar — oder `pingStatus` unverändert lassen mit Hinweis-Anpassung).
4. Übergabeprotokoll in
   `docs/sessions/archiv/YYYY-MM-DD_bau-sage-page-refactor.md`.
5. Commit + Push auf Branch `claude/bau-sage-page-refactor`. Draft-PR
   anlegen mit Klaus-Sichttest-Hinweis im Body.
6. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (2–4 priorisierte Schritte, Reihenfolge-Hinweis).
   Erster Schritt: Klaus' Browser-Sichttest mit Service-Worker-
   Cleanup + Andock-Wizard-Durchklick + Backup-Erzeugung.
```
