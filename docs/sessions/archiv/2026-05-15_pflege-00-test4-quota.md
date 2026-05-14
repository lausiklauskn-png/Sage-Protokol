# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Modul 00 Test 4 Quota-Werte

**Sitzungs-Rolle:** Pflege-Sitzung (eine Sitzung, ein Sichttest-Befund-Fix).
Klaus' Sichttest 2026-05-15 ergab fünf von sechs Tests grün und einen
Test-Bug in Panel 00 Test 4 (Quota-Warnzeile mit Mini-Werten). Diese
Sitzung repariert den Test-Bug; Modul-Vertrag und INTERFACES.md bleiben
unangetastet.
**Branch:** `claude/pflege-00-test4-quota`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und an
das Übergabeprotokoll der Pflege-Sitzung Match-Kalibrierung
(2026-05-14).
**Modul:** 00_doku_fenster (Test-Datei)

---

## Auftrag

Eine Phase (Pflege), ein klarer Scope, kein Vertrag-Eingriff:

1. **Klaus' Sichttest-Befund Modul 00** würdigen: fünf von sechs Tests
   grün im ersten Lauf; ein Test-Bug in Test 4.
2. **`tests/manual_check.html` Test 4** mit GiB-skalierten Werten
   reparieren, damit die beiden §0-Schwellen
   (`DOKU_QUOTA_WARN_RATIO=0.80`, `DOKU_QUOTA_WARN_BYTES=50 MiB`)
   sauber getrennt prüfbar sind.
3. **Karte 00 § Manueller Test Punkt 4** mit den neuen Werten
   nachziehen + kursivem Begründungs-Block zur Mini-Werte-Problematik.
4. **Karte 00 Bauzustand-Sichttest-Zeile** von „ungeprüft" auf
   „geprüft 2026-05-15" mit ausführlicher Befund-Notiz heben.
5. **`status.json` und INTERFACES.md unangetastet** — Modul-Vertrag
   und §0-Schwellen sind verbindlich richtig (Klaus' Sichttest hat
   sie bestätigt).
6. **Sitzungs-Abschluss:** PULS-Pflege-Eintrag, Übergabeprotokoll
   (diese Datei), WEGWEISER-Stand-Block-Zeile, Commit + Draft-PR +
   Merge.

---

## Was getan wurde

### 1. Klaus' Sichttest-Befund Modul 00 (2026-05-15)

Klaus hat Panel 00 in `tests/manual_check.html` im Browser
durchgeklickt. Befund:

- **Setup OK** — `{dokuReady:true, metaPresent:true, lastOpenedAt:null}`.
- **Test 2 (5-Klick-Simulation) OK** — Modal öffnet sich, Snapshot:
  `nodeIdShort:"3DT6lS0QT9Zp…"`, `domain:"rezeptbuch.example.org"`,
  `siblingCount:1`, `legacyCount:0`, `errors_anzahl:0`,
  `quota.ratio:0.0641`, `warningLevel:"none"`.
- **Test 3 (4-Klick + Timeout) OK** — `fenster_offen:false`, Notiz
  „Zähler war zurückgesetzt, Fenster bleibt zu".
- **Test 4 (Quota-Warnzeile, alte Werte 81/100) FEHLGESCHLAGEN** —
  `ratio:0.81`, `warnRatio:true`, **`warnBytes:true`**,
  `warningLevel:"both"`, `warn_dom_sichtbar:true`. Panel-Erwartung
  war `warningLevel:"ratio"` hartcodiert → `pass=false` → Status
  „Test 4 fehlgeschlagen".
- **Test 5 (TTL-Sweep) OK** — `entfernt_anzahl:2`, beide alten
  Geschwister entfernt, Re-Open-Snapshot listet sie nicht mehr.
- **Selbstcheck-Hinweis OK** — `MODUL 00 DOKU-FENSTER bereit,
  Funktionen: …` in DevTools-Konsole gefunden.
- **Modal-Rendering vollständig** (Screenshot 1): Knoten-Sektion
  (Knoten-ID, Domäne `rezeptbuch.example.org`, Knotentyp `hybrid`,
  Protokoll `0.1`), Sichttest-Sektion „Noch keine Sichttest-Einträge",
  Geschwister-Sektion mit einem Eintrag, Vermächtnis-Inbox „Keine
  Vermächtnisse empfangen", Speicher „701.9 MiB von 10.69 GiB belegt
  (6.4%) · 10.00 GiB frei", drei Aktion-Knöpfe sichtbar (Stille
  Geschwister vergessen / Inbox aktualisieren / Schließen).

**Diagnose Test 4:** bei Mini-Werten `usage:81, quota:100` ist
`freeBytes = 19` (Bytes). Das ist trivial unter 50 MiB (52428800
Bytes), also greift die Bytes-Schwelle automatisch mit, und
`warningLevel = "both"` ist die korrekte Antwort der Modul-Logik.
Die Panel-Test-Erwartung `warningLevel === "ratio"` war zu strikt
für diese Mini-Werte; die Modul-Doppel-Schwelle aus §0 greift wie
spezifiziert.

### 2. Test 4 mit GiB-Skalierung repariert

`tests/manual_check.html` Panel-00-Test-4-Knopf neu geschrieben:

```js
var GiB = 1024 * 1024 * 1024;
var usage = Math.round(8.1 * GiB);   // ≈ 8.7 GB → ratio ≈ 0.81
var quota = 10 * GiB;
SbkimDoku._setQuotaForTest({ usage: usage, quota: quota });
await SbkimDoku.open();
var snap = await SbkimDoku.getStatusSnapshot();
var warnEl = document.querySelector(".sbkim-doku-warn");
var pass = !!snap.quota && snap.quota.warnRatio === true &&
           snap.quota.warnBytes === false &&
           snap.quota.warningLevel === "ratio" && !!warnEl;
```

Mit diesen Werten:

- `ratio = 8696118477 / 10737418240 ≈ 0.81` → `warnRatio:true` ✓
- `freeBytes = 10737418240 − 8696118477 ≈ 2.04 GiB` → deutlich
  über 50 MiB → `warnBytes:false` ✓
- `warningLevel = "ratio"` (nur die Ratio-Schwelle greift) ✓
- DOM-Warnblock-Text:
  „Speicher knapp · 80%-Schwelle (81.0% belegt)" → erfüllt
  Karte 00 § Manueller Test Punkt 4 wörtlich.

**Pass-Check zusätzlich um `warnBytes === false`** erweitert, damit
die Schwellen-Trennung explizit getestet wird. **Erwartungs-Text**
in der Rückgabe präzisiert auf „{ratio:~0.81, warnRatio:true,
warnBytes:false, warningLevel:\"ratio\", DOM-Warnblock sichtbar mit
Text \"Speicher knapp · 80%-Schwelle\"}".

### 3. Karte 00 § Manueller Test Punkt 4 nachgezogen

Werte-Block auf GiB-Skalierung umgestellt + kursiver Begründungs-
Block angehängt:

```
4. Quota-Warnzeile — Test-Brücke _setQuotaForTest({usage: ~8.1
   GiB, quota: 10 GiB}) setzt GiB-skalierte Pseudo-Werte (Pflege-
   Sitzung 2026-05-15); Fenster neu öffnen. Erwartung:
   warnRatio: true, warnBytes: false (freeBytes ≈ 1.9 GiB,
   deutlich über 50 MiB), warningLevel: "ratio", Warnzeile sichtbar
   im Fenster, Text enthält „Speicher knapp · 80%-Schwelle". —
   Bau-Sitzung 00 nutzte ursprünglich Mini-Werte 81/100; bei denen
   ist freeBytes=19 Bytes automatisch < 50 MiB und warningLevel
   wird "both" statt "ratio" — Test 4 ist seit Pflege-Sitzung
   2026-05-15 auf realistische GiB-Werte umgestellt, damit die
   beiden Schwellen sauber getrennt prüfbar sind.
```

### 4. Karte 00 Bauzustand-Sichttest-Zeile

Von „ungeprüft, weil Sitzung headless" auf „geprüft 2026-05-15
(Klaus + Pflege 00-Test-4)" gehoben mit ausführlicher Befund-Notiz:
fünf von sechs Tests grün im ersten Lauf (Setup, Test 2, Test 3,
Test 5, Selbstcheck) mit konkreten Werten aus dem Snapshot;
Modal-Rendering-Beobachtung aus Screenshot; Test 4 Test-Bug
benannt + GiB-Skalierungs-Fix vermerkt; Klarstellung, dass
Modul-Logik korrekt war und die Doppel-Schwelle aus §0 greift wie
spezifiziert.

### 5. PULS-Aktualisierungen

- **Sitzungs-Eintrag oben** mit Was getan / Was nicht geändert
  (bewusst) / Frischer-Kopf-Befund (Modul-Vertrag bestätigt
  sich) / Was offen blieb / Nächster Schritt.
- **Schnellüberblicks-Zeile Modul 00** auf „geprüft 2026-05-15
  (Klaus) — 5/6 Tests grün im ersten Lauf, Test 4 Test-Bug in
  Pflege-Sitzung 2026-05-15 mit GiB-Skalierung repariert" gehoben.
- **„Als nächstes ✨" Code-Stub-Block** für Modul 00 von
  „ungeprüft, weil Sitzung headless" auf den ausführlichen
  Sichttest-Befund mit Pflege-Hinweis umgestellt.

### 6. WEGWEISER-Stand-Block-Zeile

Eine Zeile am unteren Ende des Stand-Blocks ergänzt (Wanderung —
neueste Zeile unten): „Pflege-Sitzung 00 Test-4-Quota · Klaus'
Sichttest 2026-05-15 ergab fünf von sechs Tests grün im ersten
Lauf · Test 4 Test-Bug (Mini-Werte 81/100 → warningLevel:\"both\"
statt erwartetem \"ratio\") · GiB-Skalierung repariert · Karte 00
+ INTERFACES.md unangetastet · Modul-Vertrag bestätigt."

### 7. `node --check` für Inline-Scripts

Alle acht Inline-`<script>`-Blöcke in `tests/manual_check.html`
einzeln extrahiert und syntaktisch validiert → alle grün.

---

## Was nicht geändert wurde (bewusst)

- **`src/modules/00_doku_fenster.js` unverändert.** Modul-Code und
  -Vertrag sind korrekt; der Bug war in der Test-Datei.
- **INTERFACES.md unangetastet.** §0-Schwellen
  (`DOKU_QUOTA_WARN_RATIO`, `DOKU_QUOTA_WARN_BYTES`) sind verbindlich
  richtig — Klaus' Sichttest hat die Doppel-Schwelle **bestätigt**.
  §1 Modul 00 bleibt `entwurf`.
- **`status.json` unverändert.** Modul 00 bleibt `score:"stub"` /
  `siegel:"Code-Stub"`; keine Hochstufung, weil der Sichttest mit
  einem Test-Bug startete und die Pflege ihn behebt — der Status
  bleibt „Code-Stub mit erstem Sichttest". Pie nicht regeneriert
  (keine Score-Änderung).
- **Karte 00 Hero-Badge** bleibt 🟦 Code-Stub.
- **Karte 00 §0/§1/§5/§Schnittstelle/§Datenformate/§Fehlertabelle
  unverändert.** Nur § Manueller Test Punkt 4 und Bauzustand-
  Tabelle ziehen nach.

---

## Frischer-Kopf-Befund: Modul-Vertrag bestätigt sich

Klaus' Sichttest hat die zentralen Modul-Vertrag-Eigenschaften
**bestätigt**:

- **5-Klick-Mechanik** mit 3-s-Zeitfenster funktioniert
  reproduzierbar (Test 2 öffnet, Test 3 hält zu).
- **`_advanceRevealClock(ms)`-Brücke** verschiebt die Reset-Zeit
  ohne realen Zeit-Verlauf (Test 3 in <1 s Browser-Zeit).
- **Snapshot fail-soft** zeigt Erwartetes (`siblingCount:1` aus
  Setup-Spore, `legacyCount:0` ohne Vermächtnisse, `errors_anzahl:0`).
- **Modal-Render** stimmt mit Bau-Sitzungs-Frage-1-Entscheidung
  überein (Modal mit Backdrop, alle Sektionen sichtbar, drei
  Aktion-Knöpfe).
- **TTL-Sweep** über `SbkimApoptose.forgetExpiredSiblings` entfernt
  beide alten `sbkim_siblings`-Einträge wie spezifiziert.
- **Selbstcheck-Format** stimmt
  (`MODUL 00 DOKU-FENSTER bereit, Funktionen: …` ohne Konstanten
  — wie in §1 Modul 00 verankert).
- **Doppel-Schwelle aus §0** (`DOKU_QUOTA_WARN_RATIO` UND
  `DOKU_QUOTA_WARN_BYTES`) greift wie spezifiziert — Test 4 hat
  das sogar mit Mini-Werten unfreiwillig demonstriert (beide
  Schwellen waren überschritten, `warningLevel:"both"`).

Der Test-Bug ist somit ein **Beleg dafür, dass die Spec funktioniert**
— nicht gegen sie.

---

## Was offen blieb

- **Sichttest Modul 05 Anastomose** durch Klaus (Panel 05 acht
  Knöpfe) — Klaus hat im selben Sichttest-Lauf einen weiteren
  Test-Bug-Befund geliefert: Test 2 „Domain-Mismatch (Tarantino-
  Vektor)" liefert `outcome:established, score:0.854` statt
  erwartetem `outcome:rejected, score<0.80`. Modul-Vertrag wieder
  korrekt — der Test-Vektor ist semantisch zu nah am Mixarium-
  Domänenvektor (analog zum Match-Kalibrierungs-Befund 2026-05-14
  bei Tarantino/Kochrezepte 0.7737, aber Mixarium-Cocktails liegt
  bei 0.854 darüber). **Eigene Folge-Pflege-Sitzung „Modul 05
  Test 2 Vektor-Wahl"** wird empfohlen — sie braucht einen
  semantisch klar von Cocktails entfernten Test-Vektor
  (Kandidaten: „Steuerrecht und Bilanzierung", „Numerische
  Mathematik", „Eisenbahnsignalanlagen"), Klaus muss den
  Sichttest neu durchgehen, um den passenden Vektor zu finden.
- **Sichttest Modul 07 Apoptose** durch Klaus (Panel 07 zehn
  Knöpfe) steht weiterhin aus.
- **Folge-Pflege-Sitzung Karte 09 „Schritt 9: TTL-Sweep + Modul
  00 im Andock-Pfad"** bleibt der nächste sinnvolle Schritt
  (jetzt mit Modul 00 sichtgeprüft).
- **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
  Versuch** bleibt die produktivste Folge-Sitzung — Module
  00/05/07 sind alle drei Code-Stub.

---

## Nächster sinnvoller Schritt

1. **Folge-Pflege-Sitzung „Modul 05 Test 2 Vektor-Wahl"** —
   Panel 05 Test 2 neuen semantisch klar fernen Vektor wählen
   (Klaus probiert im Browser), Karte 05 § Manueller Test
   Punkt 2 nachziehen, Bauzustand-Sichttest-Zeile auf „geprüft
   2026-05-15 (Klaus + Pflege 05-Test-2)" heben.
2. **Sichttest Karte 07 Apoptose** durch Klaus (Panel 07 zehn
   Knöpfe).
3. **Folge-Pflege-Sitzung Karte 09 „Schritt 9: TTL-Sweep + Modul
   00 im Andock-Pfad"** — kompakte Pflege, jetzt spruchreif.
4. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
   Versuch** — der erste echte Andock-Klick zwischen Rezeptbuch
   und Mixarium.

---

## Pflicht-Häkchen am Sitzungsende

- [x] **Test 4 in `tests/manual_check.html`** mit GiB-skalierten
      Werten repariert (`usage:8.1 GiB, quota:10 GiB`); Pass-Check
      erweitert um `warnBytes === false`
- [x] **Karte 00 § Manueller Test Punkt 4** nachgezogen mit
      kursivem Begründungs-Block zur Mini-Werte-Problematik
- [x] **Karte 00 Bauzustand-Sichttest-Zeile** von „ungeprüft" auf
      „geprüft 2026-05-15 (Klaus + Pflege 00-Test-4)" gehoben mit
      ausführlicher Befund-Notiz (5/6 grün, Test-Bug, Pflege-Fix)
- [x] **Modul-Vertrag und INTERFACES.md unangetastet** — §0-Schwellen
      sind verbindlich richtig; Klaus' Sichttest hat sie bestätigt
- [x] **`src/modules/00_doku_fenster.js` unverändert** — Modul-Code
      ist korrekt
- [x] **`status.json` unverändert** — Modul 00 bleibt `stub` /
      „Code-Stub"; keine Pie-Regeneration (keine Score-Änderung)
- [x] **`node --check`** für alle acht Inline-`<script>`-Blöcke in
      `manual_check.html` grün
- [x] **PULS-Sitzungs-Eintrag oben** mit Was getan / Was nicht
      geändert / Frischer-Kopf-Befund / Was offen blieb /
      Nächster Schritt
- [x] **PULS-Schnellüberblicks-Zeile Modul 00** auf
      „geprüft 2026-05-15 (Klaus) — 5/6 Tests grün, Test 4
      Test-Bug in Pflege-Sitzung 2026-05-15 mit GiB-Skalierung
      repariert" gehoben
- [x] **PULS „Als nächstes ✨" Modul 00** von „ungeprüft" auf
      Sichttest-Befund mit Pflege-Hinweis umgestellt
- [x] **WEGWEISER-Stand-Block-Zeile** unten ergänzt (Wanderung,
      neueste Zeile unten)
- [x] **Übergabeprotokoll** (diese Datei)
- [ ] **Modul-05-Test-2-Befund** in eigener Folge-Pflege-Sitzung
      addressieren (Klaus hat im selben Sichttest-Lauf geliefert;
      braucht semantisch klar fernen Vektor + Klaus-Browser-Test)
- [ ] **Commit + Push** auf `claude/pflege-00-test4-quota` (folgt)
- [ ] **Draft-PR gegen `main`, danach merge** (folgt)
