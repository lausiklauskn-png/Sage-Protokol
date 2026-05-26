# Brief — Re-Aktivierung Modul 16 Sub (e) in Mein-Mixarium (extern)

**Anlass:** Bau-Sitzung 16 Sub (e) Bronze/Gold-SIEGEL-Stufung in
Sage-Protokol (PR #180, gemerged 2026-05-26 als `ffd787a`) + Sichttest
Sub (e) 4/4 grün (PR #181, gemerged 2026-05-26 als `fe011d1`). Modul
16 hat jetzt zweistufiges SIEGEL: **Bronze** („Mycel suchend") wenn
Surface-Check grün aber noch kein Cross-Knoten-Handshake, **Gold**
(„Mycel verbunden") sobald das Modul einen `sbkim:handshake
outcome:"established"`-Event empfängt.

Diese Bau-Sitzung zieht den neuen Stand in Mein-Mixarium nach und
beweist live (Klaus' Browser-Sichttest), dass der Bronze→Gold-
Wechsel beim ersten Cross-Knoten-Handshake mit Mein-Rezeptbuch
stattfindet.

**Repo:** `lausiklauskn-png/Mein-Mixarium` (extern, **NICHT
Sage-Protokol**).

**Pipeline-Stellung:** Phase A Pipeline-Schritt 5e (Re-Aktivierung
Modul 15+16 in Endknoten — siehe Sage-Protokol CLAUDE.md). Diese
Sitzung deckt **Modul 16 Sub (e) Sub-Aktivierung** ab (Modul 15 + 17
sind bereits aktiv).

**Voraussetzungen:**

- PR #180 + #181 sind in Sage-Protokol auf `main` (✅ erledigt
  2026-05-26).
- Mein-Mixarium hat bereits Modul 15 + 16 + 17 Floating-Widget
  eingebaut (Stand 2026-05-26 nach Migration-Multi-Identity +
  Endknoten-Migration mit Widget).
- `sbkim/16_siegel.js` im Endknoten ist eine Kopie eines früheren
  Sage-Commit (vor Sub (e)).
- DeX-Chrome auf Galaxy Tab S6, Termux `python3 -m http.server 8000`
  für lokalen Sichttest (sofern möglich) bzw. GitHub-Pages-Direkt-
  Test.

**Branch-Vorschlag (im Endknoten-Repo):** `claude/migration-mixarium-reaktivierung`

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung im Endknoten-Repo)

```
Du bist eine Bau-Sitzung in Mein-Mixarium (externes Endknoten-Repo,
NICHT Sage-Protokol).

Sitzungs-Rolle: Bau-Sitzung Re-Aktivierung Modul 16 Sub (e)
Bronze/Gold-SIEGEL-Stufung. Modul 16 + index.html (CSS) auf
Sage-Protokol-Commit fe011d1 nachziehen, sodass der SIEGEL beim
ersten Cross-Knoten-Handshake live Bronze→Gold wechselt.

Branch: claude/migration-mixarium-reaktivierung (vom main aus
anlegen). Sage-Protokol-Repo wird NICHT angefasst.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md des Endknoten-Repos (sofern vorhanden) — Werkzeuge +
   Pflicht-Konventionen.
2. Endknoten-Repo `index.html` (oder wo das Sage-Page-Style-Block
   sitzt) — die `:root`-Variablen + Badge-CSS-Block.
3. Endknoten-Repo `sbkim/16_siegel.js` — aktuelle Modul-Datei. Wenn
   ihr `ZERTIFIKAT_ASPEKTE` keinen 2026-05-26-Aspekt 4 (Mycel-
   Verbindung etabliert) enthält, ist die Datei pre-Sub-(e) und
   muss ersetzt werden.
4. Sage-Protokol src/modules/16_siegel.js auf Commit fe011d1 (die
   Quell-Datei für die Kopie). Im Endknoten via WebFetch / Raw-
   GitHub-URL ziehen:
   https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/src/modules/16_siegel.js
5. Sage-Protokol docs/components/16_siegel.md § Sub (e) Mycel-
   Verbindungs-Stufe (Spec-Vorlage, NUR Verständnis — nichts
   kopieren außer wenn der Endknoten eigene Doku führt).
6. Endknoten-Repo `sbkim/17_floating_widget.js` — sollte sbkim:siegel-
   certified + sbkim:handshake bereits konsumieren. Wenn nicht, ist
   das Widget pre-Bau-17 und braucht eine eigene Folge-Pflege.

Deine Aufgabe:

A. **`sbkim/16_siegel.js` ersetzen** durch die exakte Sage-Datei vom
   Commit fe011d1. NICHT modifizieren, nicht patchen, nicht
   selektive Lines kopieren — Volldatei-Ersatz.

   Verifikation nach Kopie: `grep "ZERTIFIKAT_ASPEKTE" sbkim/16_siegel.js`
   muss den Aspekt 4 mit `since:"2026-05-26"` und
   `aspect:"Mycel-Verbindung etabliert (erster Handshake)"` zeigen.
   Falls die Endknoten-Repo-Kopie individuelle Override-Aspekte
   trägt (z.B. „Mixarium-spezifisches Sicherheits-Update"), diese
   nach dem Volldatei-Ersatz wieder am Listen-Ende zufügen
   (zwischen Aspekt 4 und der schließenden Klammer); KEIN
   Listen-Reorder.

B. **`index.html` CSS um Sub-(e)-Block erweitern.** Im bestehenden
   `:root`-Block die zwei neuen Variablen ergänzen:

   ```css
   /* Sub (e) Bronze/Gold-Stufung (Karte 16 § Sub (e), 2026-05-26). */
   --siegel-bronze:      #8C6E2F;
   --siegel-bronze-glow: rgba(140, 110, 47, 0.45);
   ```

   Im bestehenden `#sbkim-siegel-badge`-CSS-Block am Ende die fünf
   neuen Regeln + Keyframe ergänzen (kopieren aus Sage `index.html`
   Zeilen 138–147 wortwörtlich; Block-Kommentar mit „Modul 16 Sub
   (e) Bronze/Gold-Stufung" beibehalten):

   ```css
   #sbkim-siegel-badge[data-stufe="bronze"] { filter: saturate(0.6) brightness(0.85); }
   #sbkim-siegel-badge[data-stufe="bronze"]:hover { filter: saturate(0.6) brightness(0.85) drop-shadow(0 0 8px var(--siegel-bronze-glow)); }
   #sbkim-siegel-badge[data-stufe="gold"] { /* Default-Render — keine Override */ }
   #sbkim-siegel-badge.stufenwechsel-gold { animation: siegel-stufenwechsel-gold 600ms ease-out; }
   @keyframes siegel-stufenwechsel-gold { 0% { transform: scale(1.00); box-shadow: 0 0 0 0 var(--siegel-gold-glow); } 40% { transform: scale(1.15); box-shadow: 0 0 24px 4px var(--siegel-gold-glow); filter: drop-shadow(0 0 14px var(--siegel-gold-glow)); } 100% { transform: scale(1.00); box-shadow: 0 0 0 0 var(--siegel-gold-glow); } }
   ```

   Falls Mein-Mixarium sein CSS in einer separaten Datei führt
   (z.B. `sbkim/siegel.css`), dorthin schreiben. Der CSS-Block muss
   für die Sage-Page-Pfad-PWAs greifen — Endknoten ohne sichtbares
   Sage-Page-Badge (Widget-only-Pfad) brauchen nur die Variablen
   im `:root` und keine Badge-Regeln (das Widget rendert sein
   SIEGEL-Slot selbst und nutzt eigene CSS-Variablen mit
   `--sbkim-widget-*`-Präfix).

C. **`sbkim/17_floating_widget.js` prüfen** — wenn Datei einen
   Listener auf `sbkim:handshake`-Event hat, ist die Widget-Bridge
   bereits voll funktional. Wenn nicht, ist das Widget pre-Bau-17;
   eigene Folge-Pflege „Widget-Update Sub-(e)" wäre dann nötig
   (NICHT in dieser Sitzung — Out-of-Scope).

D. **`sbkim-init.js` (Init-Reihenfolge) prüfen.** `SbkimSiegel.init`
   soll NACH `SbkimWidget.init` aufgerufen werden — Bau-17-
   Modal-Bridge-Pflicht. Wenn vertauscht, hier nachziehen.

   Erwartete Reihenfolge:
   ```js
   await SbkimStorage.init({ dbSuffix: "mixarium" });
   await SbkimSpore.init();
   await SbkimMatch.init();
   await SbkimAnastomose.init();
   await SbkimApoptose.init();
   SbkimWidget.init({                 // VOR Membrane + Siegel
     allowedOrigins: ["https://lausiklauskn-png.github.io"],
     repoUrl: "https://github.com/lausiklauskn-png/Mein-Mixarium",
   });
   SbkimMembrane.init({
     lampSelector: "#lamp-fremd",     // Widget-Proxy oder Navleisten-Lampe
     allowedOrigins: ["https://lausiklauskn-png.github.io"],
   });
   SbkimSiegel.init({
     badgeSelector: "#sbkim-siegel-badge",  // Widget-Proxy oder Sage-Page-Badge
     repoUrl: "https://github.com/lausiklauskn-png/Mein-Mixarium",
   });
   SbkimDoku.init({ searchIconSelector: "#search-icon" });
   ```

E. **Tests im Endknoten (Browser-Sichttest):**

   Vorbereitung: PWA in DeX-Chrome öffnen (Tab 1), zweite PWA
   Mein-Rezeptbuch in Tab 2 derselben Chrome-Instanz öffnen
   (BroadcastChannel-Bridge braucht dieselbe Instanz!).

   1. **Initial-Stand:** PWA frisch laden. Im Floating-Widget
      muss der SIEGEL-Slot sichtbar sein (gold-glühende Plakette
      mit ★). Klick öffnet das SBKIM-Siegel-Modal. Im Modal muss
      ein gelber/bronze-getönter „Mycel suchend"-Hinweis-Block
      mit `[Andocken]`-Knopf sichtbar sein. Die Aspekte-Liste
      muss vier Aspekte zeigen; der letzte (Aspekt 4) trägt
      „pending"-Marker statt Datum.

      In der Konsole (Eruda oder DevTools):
      ```js
      SbkimSiegel._meta.siegelStufe   // → "bronze"
      SbkimSiegel._meta.mycelConnected  // → false
      ```

   2. **Cross-Knoten-Handshake auslösen.** Im Mein-Mixarium-Tab
      via Eruda-Konsole:
      ```js
      var peerSpore = await fetch("https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/spore.json").then(r => r.json());
      var ownVec = SbkimSpore.getOwnSpore().domainVector;
      var r = await SbkimAnastomose.handshake(peerSpore, ownVec);
      r.outcome  // → "established"
      ```
      Bei `established` dispatcht Modul 05 ein `sbkim:handshake`-
      Event in BEIDEN Tabs (Sender + Receiver via BroadcastChannel-
      Bridge).

   3. **Im Mein-Mixarium-Tab:** Der SIEGEL-Slot im Widget muss
      jetzt voll gold-leuchtend sein (Stufenwechsel-Animation
      600 ms beim Empfang sichtbar). Modal erneut öffnen — der
      Bronze-Hinweis-Block ist verschwunden, Aspekt 4 zeigt nun
      „2026-05-26" (oder das Live-Datum) statt „pending".

      Konsole:
      ```js
      SbkimSiegel._meta.siegelStufe        // → "gold"
      SbkimSiegel._meta.mycelConnected     // → true
      SbkimSiegel._meta.mycelConnectedAt   // → ISO-Datum-String
      ```

   4. **Tab-Reload-Test:** Tab schließen + neu öffnen. SIEGEL
      sollte wieder Bronze starten (RAM-only-Persistenz, gewollt).

F. **Konsole-Hinweise:** keine `console.warn` von Modul 16 beim
   Boot. Wenn Anti-Greenwashing-Warn („Pflicht-Module fehlen"),
   dann fehlt ein Pflicht-Modul (01/02/03/04/05/07/15) — eigenen
   Befund melden.

Was du nicht tust:

- KEIN Sage-Protokol-Eingriff. Sage bleibt unangetastet.
- KEIN Modul-16-Code-Edit (nur Volldatei-Kopie aus Sage-Commit).
- KEIN Modul-15-Eingriff (Sub (b)-Empfänger ist gebaut).
- KEIN Modul-05-Eingriff (`sbkim:handshake`-Custom-Event seit Bau 17).
- KEIN Modul-17-Eingriff in dieser Sitzung (Widget-Code-Pflege ist
  Out-of-Scope; wenn nötig eigene Folge-Sitzung).
- KEIN Spore-Eingriff (`sbkim/spore.json` bleibt unangetastet).
- KEIN IndexedDB-Reset (Klaus' nodeId + Geschwister bleiben).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.

Pflicht am Ende:

- `sbkim/16_siegel.js` auf Sage-Commit-fe011d1-Stand.
- `index.html` `:root` + Badge-CSS-Block um Sub-(e)-Variablen +
  Regeln erweitert.
- `sbkim-init.js` (oder Äquivalent) Init-Reihenfolge geprüft +
  ggf. korrigiert.
- Browser-Sichttest 4 Punkte durch Klaus (Initial-Bronze /
  Cross-Knoten-Handshake / Gold-Wechsel + Modal / Tab-Reload).
- Commit + Push auf `claude/migration-mixarium-reaktivierung`.
- Draft-PR im Endknoten-Repo, Body verweist auf diesen Brief
  (Sage-PR #180 + #181 als Quelle).
- Endknoten-CLAUDE.md aktualisieren (sofern vorhanden) — Modul-
  Tabelle Modul 16 auf „Sub (e) live aktiv" markieren.
```

---

## Hintergrund

**Modul 16 Sub (e) Bronze/Gold-Stufung (Spec aus Karte 16 § Sub e,
voll-spec 2026-05-26 in PR #175, gebaut 2026-05-26 in PR #180,
sichtgetestet 4/4 grün 2026-05-26 in PR #181):**

Das SBKIM-Siegel kennt jetzt zwei Stufen:

- **Bronze („Mycel suchend"):** Surface-Check grün (alle sieben
  Pflicht-Module 01/02/03/04/05/07/15 da), aber noch kein Cross-
  Knoten-Handshake. Wappen wird via `filter: saturate(0.6)
  brightness(0.85)` gedämpft. Klick öffnet Modal mit zusätzlichem
  Hinweis-Block + `[Andocken]`-Knopf (fail-soft Modul-18-Check —
  in Phase A vor Bau Modul 18 fällt der Knopf auf Info-Notiz
  zurück).
- **Gold („Mycel verbunden"):** Modul 16 empfängt `sbkim:handshake
  outcome:"established"`-Event auf `window`, setzt
  `_meta.mycelConnected = true` + `_meta.mycelConnectedAt = ISO`,
  re-rendert Badge auf `data-stufe="gold"` + spielt 600 ms
  Stufenwechsel-Animation (`.stufenwechsel-gold`).

**RAM-only-Persistenz** — Tab-Reload startet wieder Bronze, gewollt:
das SIEGEL spiegelt die **aktive** Verbindungs-Situation, nicht
eine historisch erfolgte Verbindung. Wer mehr will, baut Modul 10
Reputation mit Append-Log.

**Idempotent + fail-soft:** zweiter Handshake-Event ändert nichts;
Event ohne `detail` oder mit `outcome:"rejected"` ist no-op (kein
Throw).

## Nach dieser Sitzung

- **Parallel:** Bau-Sitzung in Mein-Rezeptbuch (siehe
  `BRIEF_REAKTIVIERUNG_ENDKNOTEN_MR.md`). Erst wenn beide laufen,
  ist der bidirektionale Bronze→Gold-Wechsel beweisbar.
- **Cross-Knoten-Bonus-Sichttest:** Klaus tippt in MM, sieht
  Treffer aus MR (über BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md — wenn
  jener Brief auch gelaufen ist, ist das Such-Feld der Trigger
  für den ersten Cross-Knoten-Handshake — Bronze→Gold-Wechsel
  passiert live beim ersten Tippen).
- **Folge-Pflege Endknoten-CLAUDE.md** — falls nötig.

## Heilige Tafeln dieser Sitzung

- KEIN Sage-Protokol-Eingriff.
- KEIN Modul-16-Code-Edit (Volldatei-Kopie aus Sage-Commit).
- KEIN Auto-Andocken (Empfangsmodus-Prinzip — Bronze→Gold passiert
  nur, wenn Modul 05 selbst-gewollt einen Handshake fährt).
- KEIN Persistent-Store für mycelConnected (RAM-only, gewollt).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.

---

**Endstand-Codeblock für die übernächste Sitzung** (wenn beide
Endknoten reaktiviert sind, kommt Cross-Knoten-Bronze→Gold-
Sichttest):

```
Du bist Sichttest-Sitzung für den bidirektionalen Bronze→Gold-Test
Mein-Rezeptbuch ↔ Mein-Mixarium.

Voraussetzungen:
- Re-Aktivierung Modul 16 Sub (e) in MR ist gemerged.
- Re-Aktivierung Modul 16 Sub (e) in MM ist gemerged.
- Beide Endknoten haben sbkim/16_siegel.js auf Sage-Commit-fe011d1-Stand.
- DeX-Chrome auf Galaxy Tab S6, beide PWAs als Tabs in derselben
  Chrome-Instanz.

Sichttest-Schritte:
1. Beide PWAs öffnen. Beide SIEGEL-Slots im Widget sind initial
   Bronze (gedämpft). Modal-Klick zeigt „Mycel suchend"-Hinweis-
   Block.
2. In MM Eruda: SbkimAnastomose.handshake(peerSpore, ownVec) gegen
   MR. Outcome "established".
3. In MM Tab: SIEGEL wechselt auf Gold (Stufenwechsel-Animation
   600 ms beobachtbar). Modal-Klick zeigt voll-Aspekte-Liste mit
   Aspekt 4 datiert.
4. In MR Tab: BroadcastChannel-Bridge routet den Empfänger-Event
   durch — MR-SIEGEL wechselt parallel auf Gold.
5. Tab-Reload in MM: SIEGEL wieder Bronze (RAM-only).
6. Tab-Reload in MR: SIEGEL wieder Bronze (RAM-only). Beide
   können beim nächsten Handshake wieder zu Gold wechseln.
```
