# Brief — Bau-Sitzung Endknoten-Migration Multi-Identität

**Bau-Sitzung in EXTERNEN Repos** (Mein-Mixarium, Mein-Rezeptbuch) —
kein Sage-Protokol-Eingriff. Die SBKIM-Module sind in Sage-Protokol
gebaut und gemerged; diese Sitzung pflegt sie in die zwei Endknoten-
PWAs ein. **Letzte Phase der Brief-99-Pipeline.**

Voraussetzung: Brief 99 (PR #100), alle vier Konsumenten-Bauten
(05.Y / 06.Y / 07.Y / 08.Y) + Bau 04.B + Pflege Modul 01 versions-
fail-soft + Bau 02.Y / 04.A / 01.Y alle gemerged.

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
in EINEM der Endknoten-Repos als Codeblock. Klaus baut beide
Endknoten parallel (gleicher Inhalt, zwei Repos).

---

```
Du bist eine Bau-Sitzung in einem Endknoten-Repo (Mein-Mixarium
ODER Mein-Rezeptbuch) — Multi-Identitäts-Migration.

Branch im Endknoten-Repo: claude/endknoten-migration-multi-identity
(vom main aus anlegen). Sage-Protokol-Repo wird NICHT angefasst.

Sitzungs-Rolle: Bau (kein Spec — die SBKIM-Module sind in Sage-
Protokol gebaut). Du kopierst die aktuellen Modul-Dateien aus
Sage-Protokol's `src/modules/` in das `sbkim/`-Verzeichnis des
Endknoten-Repos. Der Andock-Code (`sbkim-init.js` o.ä.) bleibt
**weitestgehend unverändert** — die slot-suffixed Stores sind
transparent über `SbkimSpore.getActiveIdentityKey()` (Default „main"),
also alter Singleton-Code läuft weiter.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md des Endknoten-Repos (falls vorhanden) — falls nicht,
   einfach die Endknoten-Datei-Struktur erkunden.
2. docs/components/09_einbau_pwa.md aus Sage-Protokol (Karte 09) —
   die volle Andock-Anleitung. Insbesondere:
   - § Schritt 1 (Dateien kopieren) — neue Modul-Dateien
   - § Schritt 2 (script-Tags) — Reihenfolge prüfen
   - § Schritt 9 (Apoptose + Doku-Fenster) — wenn nicht schon drin
3. Sage-Protokol's `src/modules/*.js` — die zehn Modul-Dateien (00-09).
4. Endknoten-Repo's `sbkim/`-Verzeichnis (oder Äquivalent) — der
   aktuelle Stand.

Heilige Tafeln (Endknoten-Migration-spezifisch):

- **Kein Sage-Protokol-Eingriff.** Sage-Protokol bleibt unangetastet.
  Diese Bau-Sitzung lebt im Endknoten-Repo.

- **Slot-Pfad ist transparent.** Modul 02-08 nutzen seit Bau 02.Y /
  05.Y / 06.Y / 07.Y / 08.Y intern slot-suffixed Stores
  (`sbkim_siblings_<key>`, `sbkim_anastomosis_log_<key>` etc.). Der
  Andock-Code (`sbkim-init.js`) muss NICHT angepasst werden — der
  Default-Slot „main" wird automatisch gewählt
  (`getActiveIdentityKey()` Rückwärts-Kompat).

- **Backup-Re-Import bei Datenverlust.** Wer alte Daten aus
  `sbkim_siblings` (ohne Suffix), `sbkim_hetero_inbox` (ohne Suffix),
  `sbkim_legacy_inbox` (ohne Suffix) oder `sbkim_hetero_outbox`
  (ohne Suffix) erhalten will: via `SbkimSpore.exportBackup(password)`
  ALT-Stand vor Migration, dann nach Modul-Update via
  `SbkimSpore.importBackup(blob, password)` in den main-Slot. Aufrufer-
  Pflicht; KEINE Auto-Migration in den Modulen.

- **Bau 04.B `explainMatchLLM` ist OPT-IN.** Wer Stufe B nicht nutzen
  will (z.B. weil kein Anthropic-Key vorhanden), lässt die Funktion
  weg — Stufe A (matchDimensions) ist rückgrat-tragend. Endknoten-
  Andock-Wizard SOLL die Stufe-B-Konfig optional anbieten (deferred
  bis Vision-Anker 5 Identitäts-Container — bis dahin kein UI).

- **CORS-Hinweis Bau 04.B:** Anthropic-API erlaubt direkte Browser-
  Aufrufe seit 2024 mit `anthropic-dangerous-direct-browser-access`-
  Header. Modul 04 setzt diesen Header BEWUSST NICHT. Im Endknoten-
  PWA (echte gehostete Origin auf GitHub-Pages) ist das Standard-
  CORS-Verhalten von Anthropic in der Regel OK. Im Termux-`localhost`
  scheitert CORS möglich; das ist nur eine Test-Setup-Limitierung,
  nicht eine Endknoten-Bug.

- **Andock-Wizard-Erweiterung MINIMAL.** Brief 99 spezifiziert
  „additive Andock-Wizard-Erweiterung". Was wirklich nötig ist:
  - Multi-Persona-UI (Liste der angelegten Personae +
    setActiveIdentity-Schalter + getOrCreateIdentity-Button) —
    OPTIONAL für den ersten Endknoten-Roll-Out. Klaus kann erst mal
    ohne UI auskommen (manuell via `SbkimSpore.getOrCreateIdentity(
    'beruflich')` in DevTools-Konsole).
  - Identitäts-Wechsler im Doku-Fenster (Modul 00) — OPTIONAL,
    eigene Pflege-Sitzung.

- **`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` ist `4`,
  `BACKUP_FORMAT_VERSION` ist `2`.** Endknoten erbt diese Werte
  automatisch aus den kopierten Modul-Dateien.

Deine Aufgabe heute — sechs Punkte a–f:

a) **Modul-Dateien aus Sage-Protokol nach Endknoten-Repo kopieren.**
   Quelle: Sage-Protokol `src/modules/00_doku_fenster.js` bis
   `src/modules/08_ui_demo.js`. Ziel: Endknoten-Repo's
   `sbkim/`-Verzeichnis (oder wo immer das Endknoten-Repo die SBKIM-
   Module hält). Optional Rename: `08_ui_demo.js` →
   `08_ui_demo-v3.js` als Cache-Bust falls der Endknoten schon eine
   ältere Variante hat (Klaus' Bewährungs-Strategie aus früheren
   Live-Andock-Sitzungen).

   `src/sbkim-sw.js` ebenfalls kopieren (Service-Worker).

b) **Karte 09 nachprüfen** ob script-Reihenfolge in `index.html`
   stimmt:
   ```
   01_storage → 02_spore → 03_embedding → 04_match → 05_anastomose
     → 07_apoptose → 00_doku_fenster → 06_heterokaryose → 08_ui_demo
   ```
   (Modul 06 NACH 00 wegen Outbox-Lese-Pfad aus Modul 08 / Spore-
   Single-Anker-Fallback; Modul 08 zuletzt weil Bau 08.Y die
   slot-suffixed Outbox schreibt.)

c) **`sbkim-init.js`** im Endknoten-Repo aktualisieren falls
   Code-Drift:
   - Reihenfolge der `await Sbkim<X>.init()`-Aufrufe entsprechend
     der `script`-Reihenfolge.
   - `SbkimStorage.init({dbSuffix:"<eindeutiger-suffix>"})` falls
     Klaus' Pflege PWA-Suffix aus 2026-05-16 noch nicht eingebaut
     (Karte 01 + Karte 09).
   - Wenn `SbkimSpore.exportBackup` / `importBackup` aus Bau 02.Y
     verfügbar gemacht werden soll (Doku-Backup-Knopf im Endknoten-
     UI): optional, eigene Folge-Pflege-Sitzung.

d) **Cache-Bust für Service-Worker.** Falls der Endknoten schon
   `sbkim-sw.js` hat: File-Rename als Cache-Bust (`sbkim-sw-v2.js`)
   oder Cache-Version-Bump im `CACHE_NAME` (typisch
   `CACHE_NAME = "sbkim-v2"` → `"v3"`). Klaus' Bewährungs-Strategie
   aus 2026-05-17 Live-Channel-Handshake-Sitzung.

e) **Sichttest im Endknoten-PWA:**
   - Endknoten-PWA in DeX-Chrome / Tablet-Chrome neu laden.
   - DevTools → Konsole → die neun Selbstcheck-Zeilen prüfen:
     ```
     MODUL 00 DOKU-FENSTER bereit, Funktionen: ...
     MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear/ensureStore
     MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/setActiveIdentity/getActiveIdentityKey/listIdentities/removeIdentity/resetIdentityCache/exportBackup/importBackup
     MODUL 03 EMBEDDING bereit, Funktionen: ...
     MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold/matchDimensions/explainMatchLLM, Schwellen: PROVIDER_MIN_MATCH=0.80, SCHICHT_MIN_MATCH=0.60
     MODUL 05 ANASTOMOSE bereit, Funktionen: init/handshake/receiveHandshake/listSiblings/forgetSibling
     MODUL 06 HETEROKARYOSE bereit, Funktionen: init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis
     MODUL 07 APOPTOSE bereit, Funktionen: init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings
     MODUL 08 UI-DEMO bereit, Funktionen: init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn
     ```
   - DevTools → Application → IndexedDB → die slot-suffixed Stores
     müssen erscheinen (sbkim_siblings_main, sbkim_hetero_inbox_main,
     sbkim_anastomosis_log_main etc.). Alte non-suffixed Stores
     dürfen daneben existieren (Pre-Brief-04-Bestand; Modul-Code
     greift jetzt nur auf die slot-suffixed zu).
   - Live-Cross-Knoten-Handshake mit dem anderen Endknoten (Klaus'
     Bewährungs-Test aus 2026-05-17 Live-Channel-Handshake): zwei
     Tabs (Mein-Mixarium + Mein-Rezeptbuch) auf demselben DeX-
     Chrome; einer ruft `SbkimAnastomose.handshake(peerSpore,
     ownVec)`. Erwartung: `outcome:"established"`, score > 0.80,
     siblings beidseits gefüllt.
   - **Multi-Persona-Test:** in DevTools-Konsole
     `await SbkimSpore.getOrCreateIdentity('beruflich')` +
     `await SbkimSpore.setActiveIdentity('beruflich')` + Tab-Reload;
     dann erneuter Handshake → landet jetzt in
     `sbkim_siblings_beruflich` statt `sbkim_siblings_main`.
     Cleanup: `await SbkimSpore.removeIdentity('beruflich',
     {force:true})`. Modul 07's `_sendLegacyForIdentity`-Hook wird
     dabei fail-soft gerufen (kein `console.warn` mehr — Bau 07.Y).

f) **Übergabeprotokoll im Endknoten-Repo** (typisch
   `docs/sessions/archiv/2026-05-XX_endknoten-migration-multi-identity.md`
   falls Endknoten ein eigenes PULS hat; sonst README-Eintrag).
   Inhalt: Datum, was kopiert wurde, Sichttest-Befund, Cache-Bust-
   Strategie.

Was du NICHT tust:

- **Kein Sage-Protokol-Eingriff.** Die SBKIM-Module sind in
  Sage-Protokol gepflegt; der Endknoten ist nur Konsument.
- **Kein eigener Modul-Patch.** Wenn ein Befund am Modul-Code
  auffällt: dokumentiere in PULS § Offene Querschnitts-Fragen (im
  Sage-Protokol-Repo, eigene Sitzung), KORRIGIERE NICHT direkt im
  Endknoten-`sbkim/`-Verzeichnis (das produziert Drift).
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **Keine Sage-Page-Änderung** (`index.html` der Sage-Page bleibt
  Sage-Protokol-internes Artifact).
- **Kein produktiver Identitäts-Container für API-Keys.**
  Vision-Anker 5; aktuell `window.prompt` als Test-Brücke aus
  Bau 04.B Panel 04 Knopf 10.

Pflicht am Ende der Sitzung:

1. Sichttest-Befund — wenigstens die neun Selbstcheck-Zeilen + ein
   Live-Cross-Knoten-Handshake. Bei Befund: HALTE AN, dokumentiere
   in Sage-Protokol PULS § Sitzungs-Eintrag (eigene Folge-Sitzung
   im Sage-Protokol-Repo).

2. „Vorgeschlagene nächste Schritte"-Block:
   - Zweiter Endknoten parallel migrieren (falls noch nicht).
   - Multi-Persona-UI im Andock-Wizard (optional, eigene Sitzung).
   - Identitäts-Wechsler im Doku-Fenster (optional, eigene Sitzung).
   - Anthropic-API-Key-Integration in Doku-Fenster (sicherer Key-
     Pfad — Vision-Anker 5 Identitäts-Container Spec-Sitzung als
     Voraussetzung).

Stolperfallen:

- **Cache-Bust:** ohne File-Rename ODER Cache-Version-Bump im SW
  läuft der Endknoten weiter die alten Module aus dem SW-Cache. Das
  ist Klaus' regelmäßiger Sichttest-Hammer; nicht überraschend.

- **IndexedDB-Verlust:** wenn der Endknoten die DB neu lädt (z.B.
  durch DevTools → Clear Storage), sind alle alten siblings + log
  + inbox-Daten weg. Vorher `SbkimSpore.exportBackup(password)` für
  Datenverlust-Schutz. Nach Migration via
  `SbkimSpore.importBackup(blob, password)` zurückspielen.

- **CORS bei Bau 04.B:** im Termux-`localhost`-Test scheitert
  Anthropic-API-Call mit CORS möglich. Im echten gehosteten PWA-
  Setup (GitHub-Pages) sollte das OK sein — Anthropic erlaubt
  „dangerous-direct-browser-access" für gehostete Origins typisch
  ohne Extra-Header. Falls Endknoten-CORS-Test trotzdem scheitert:
  bekannte Limitierung, nicht Endknoten-Bug. Workaround: einen
  Backend-Proxy auf der Endknoten-Origin (eigene Pflege-Sitzung).

- **Modul 08 UI-Demo Self-Apoptose-Knopf NICHT in Panel 08.**
  Spec-Sitzung 08 hat das bewusst ausgeschlossen. Wer Self-Apoptose
  im Endknoten-UI haben will: eigener Knopf (typisch unter
  „Einstellungen → SBKIM zurücksetzen", mit Token-Confirmation aus
  Modul 07). Eigene Pflege-Sitzung.

Zeitschätzung: ~2 h pro Endknoten (Datei-Kopieren + Cache-Bust +
Sichttest). Multi-Persona-UI optional, eigene Pflege-Sitzung wenn
gewünscht.
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Auslöser dieser Bau-Sitzung:** Brief 99-Pipeline-Abschluss
  (Sammelspec-Abschluss PR #100). Alle Bau-Sitzungen 01.Y / 02.Y /
  04.A / 04.B / 05.Y / 06.Y / 07.Y / 08.Y sind gemerged in
  Sage-Protokol (`main` `9f4d565` nach PR #122). **Endknoten-
  Migration ist die letzte Phase der Brief-99-Pipeline.**

- **Klaus' Endknoten:** Mein-Mixarium + Mein-Rezeptbuch (zwei
  externe GitHub-Repos). Diese Bau-Sitzung wird zwei Mal gefahren
  (einmal pro Endknoten); der Brief-Inhalt ist identisch.

- **Was diese Bau-Sitzung NICHT löst:**
  - Vision-Anker 5 Identitäts-Container (produktiver sicherer
    User-Key-Pfad — eigene Spec-Sitzung).
  - Multi-Persona-UI im Doku-Fenster (Modul 00 Erweiterung — eigene
    Pflege-Sitzung).
  - Anthropic-API-Backend-Proxy für CORS-freien Stufe-B-Pfad
    (eigene Pflege-Sitzung, optional).

- **PR-Pipeline-Stand (Sage-Protokol):**
  Brief 99 → Bau 01.Y ✓ → Bau 02.Y ✓ → Pflege Tafel-Evolution ✓ →
  Brief Pflege 01-init ✓ → Pflege Modul 01 ✓ + Sichttest ✓ →
  Brief BAU_04A ✓ → Bau 04.A ✓ + Sichttest ✓ → Brief BAU_04B ✓ →
  Brief BAU_05Y ✓ → Brief BAU_06Y ✓ → Brief BAU_07Y ✓ →
  Brief BAU_08Y ✓ → Bau 08.Y ✓ → Sichttest-Nachzug ✓ → Bau 05.Y ✓ →
  Bau 06.Y ✓ → Bau 07.Y ✓ → Bau 04.B ✓ → **Brief Endknoten-
  Migration (dieser PR)** → **eigene Bau-Sitzungen pro Endknoten
  (extern, nicht in Sage-Protokol)**.

- **`PROTOCOL_VERSION` bleibt `"0.1"`**, **`DB_VERSION` bleibt `4`**,
  **`BACKUP_FORMAT_VERSION` bleibt `2`**.

- **Auslöser-Befehl im Chat (Kaskaden-Konvention 6):** der Volltext
  des Briefes oben ist im Sage-Protokol-Repo (diese Datei). Klaus
  tippt am Sitzungs-Start im Endknoten-Repo nur den kurzen
  Auslöser-Befehl mit Verweis auf diese Brief-Datei.
