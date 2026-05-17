# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Karte 09 Schritt 9 — Doku-Fenster + Apoptose im Andock-Pfad

**Sitzungs-Rolle:** Pflege-Sitzung (eine Sitzung, ein Anleitungs-
Erweiterungs-Scope). Karte 09 wird von **acht** auf **neun** Schritte
erweitert. Folge-Pflege aus zwei offenen Punkten der Spec-Sitzungen 07
und 00 (beide vom 2026-05-14). Keine Code-Änderung in Modulen; nur
Karte 09 + INTERFACES.md §6 + PULS + WEGWEISER + Übergabeprotokoll.
**Branch:** `claude/pflege-09-schritt-9-doku-ttl`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und
an die Pflege-Sitzungen 00/05/02+07 vom 2026-05-15.
**Modul:** 09_einbau_pwa (Anleitung, kein JS-Modul)

---

## Auftrag

Eine Phase (Pflege-Anleitung), klarer Scope, kein Modul-Eingriff:

1. **Karte 09 § Andock-Schritt-Pfad** von acht auf neun Schritte
   erweitern. Schritt 9 schaltet `SbkimApoptose.init()` und
   `SbkimDoku.init({searchIconSelector:...})` scharf, plus optional
   `SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)` als
   Andocker-Automatik nach jedem Handshake.
2. **Schritt 2 (`<script>`-Tags)** zieht Modul 07 + Modul 00 in
   der verbindlichen Reihenfolge nach (`01 → 02 → 03 → 04 → 05 → 07
   → 00` — Modul 00 zuletzt, weil fail-soft Lese-Quellen).
3. **§ Sichtkontrolle nach dem Andocken** von drei auf vier
   Pflicht-Punkte erweitern (sieben Selbstcheck-Zeilen, sechs
   IndexedDB-Stores inkl. `sbkim_doku_meta["meta"]`, zwei live-
   Endpunkte `/sbkim/spore.json` + `/sbkim/anastomosis`/`/sbkim/legacy`,
   5-Klick-Geste am Such-Symbol öffnet das Modal).
4. **Visualisierungs-Mermaid-Flowchart** von acht auf neun Knoten
   erweitern.
5. **§ Datei-Pfad-Konvention** von „fünf JS-Module" auf „sieben
   JS-Module" nachziehen.
6. **§ Verantwortlichkeiten** Macht-Block ergänzen.
7. **INTERFACES.md §6** Änderungsprotokoll-Zeile am unteren Ende.
8. **Karte 09 Bauzustand-Tabelle** um „Pflege Schritt 9 + 07/00"-
   Zeile erweitern.
9. **PULS** Sitzungs-Eintrag oben (ausführlich), Schnellüberblicks-
   Zeile Modul 09, „Als nächstes ✨"-Block, „Empfehlung Hauptsitzung"-
   Block aktualisieren.
10. **WEGWEISER**-Stand-Block-Zeile.
11. **Übergabeprotokoll** (diese Datei).
12. **Keine Code-Änderung in irgendeinem Modul.** Karte 09 ist
    Anleitung — sie verändert nur die Andock-Sequenz.
13. **`status.json` Modul 09 unverändert** (bleibt `score:"spec"` /
    `siegel:"Spec fertig"`); Pie nicht regeneriert (keine Score-
    Änderung).
14. **Sitzungs-Abschluss:** Commit + Draft-PR + Merge.

---

## Was getan wurde

### 1. Folge-Pflege-Anker aus den Spec-Sitzungen 07 und 00

Diese Pflege-Sitzung adressiert **zwei** offene Punkte aus den
Sitzungen vom 2026-05-14:

- **Spec-Sitzung 07** hatte „Karte 09 Schritt 9: TTL-Sweep-Aufruf"
  als offen vermerkt. TTL-Trigger-Variante (c) = explizit durch
  den Andocker; kein `setInterval`, kein Selbst-Sweep. Empfehlung
  war: nach jedem erfolgreichen Handshake aus dem Andocker rufen.
  → **9c** (`SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)`).
- **Spec-Sitzung 00** hatte „Karte 09 Folge-Pflege-Sitzung Modul
  00 im Andock-Pfad" als offen vermerkt. Andocker ruft
  `SbkimDoku.init({searchIconSelector:...})` nach
  `SbkimAnastomose.init()`. → **9b** (`SbkimDoku.init`).

Außerdem implizit aus beiden Sitzungen: Modul 07 und Modul 00
müssen in Schritt 2 `<script>`-Tags der Karte 09 ergänzt werden
(bisher nur 01–05).

### 2. Karte 09 § Andock-Schritt-Pfad erweitert

**Schritt 2 (`<script>`-Tags)** auf sieben Module erweitert:

```html
<script src="sbkim/01_storage.js"></script>
<script src="sbkim/02_spore.js"></script>
<script src="sbkim/03_embedding.js"></script>
<script src="sbkim/04_match.js"></script>
<script src="sbkim/05_anastomose.js"></script>
<script src="sbkim/07_apoptose.js"></script>     <!-- Vermächtnis-Empfang + TTL-Sweep -->
<script src="sbkim/00_doku_fenster.js"></script> <!-- 5-Klick-Statusfenster -->
```

**Reihenfolge-Begründung** als Erläuterungs-Block ergänzt: Modul
07 nutzt 01/02/05; Modul 00 nutzt 01 (Pflicht) und liest 02/05/07
fail-soft. Modul 00 zuletzt, weil es die anderen beim `init()` und
`getStatusSnapshot()` als optionale Lese-Quellen prüft — fehlen
sie auf `window`, zeigt das Doku-Fenster „Modul nicht geladen"
und bleibt benutzbar.

**Sichtkontroll-Block in Schritt 2** zeigt jetzt sechs Selbstcheck-
Zeilen (statt vier; Modul 03 weiterhin nach `init()`); inkl. der
durch Pflege-Sitzung 02+07-Cache-Invalidate erweiterten Modul-02-
Selbstcheck-Zeile (sieben Funktionen).

**Häufiger-Fehler-Block** ergänzt um „00 vor 07" → Tooltip
„SbkimApoptose nicht geladen" am TTL-Sweep-Knopf im Doku-Fenster.

### 3. Neuer Schritt 9 „Apoptose + Doku-Fenster scharf schalten"

Vollständig neu eingefügt zwischen Schritt 8 (erster Handshake)
und § Sichtkontrolle. Drei Sub-Punkte:

**9a — `await SbkimApoptose.init()`** mit ausführlichem Kommentar:

```js
// Apoptose-Modul scharf schalten — Vermächtnis-Empfang.
// Modul 07 setzt einen MessageChannel-Listener auf den
// Service-Worker, damit eingehende /sbkim/legacy-POSTs in
// sbkim_legacy_inbox landen. Ohne init() kommen Vermächtnisse
// nicht in der Inbox an.
await SbkimApoptose.init();
console.info("SBKIM-Apoptose grün — Vermächtnis-Empfang aktiv.");
```

**9b — `await SbkimDoku.init({searchIconSelector:"#search-icon"})`**
mit Kommentar:

```js
// Doku-Fenster anschalten — versteckte 5-Klick-Geste am
// Such-Symbol der PWA. Klaus klickt das Such-Symbol fünfmal
// binnen 3 Sekunden, das modale Statusfenster geht auf.
// searchIconSelector ist der CSS-Selektor des Such-Symbols
// im Endknoten — pro PWA verschieden.
await SbkimDoku.init({
  searchIconSelector: "#search-icon",   // Rezeptbuch: anpassen
  // Optional: revealClicks (Default 5), revealWindowMs (Default 3000),
  // windowTitle (Default "SBKIM-Knotenstand"), mountTarget (Default body).
});
console.info("SBKIM-Doku grün — 5-Klick-Geste am Such-Symbol aktiv.");
```

**9c (optional, empfohlen) — TTL-Sweep nach jedem Handshake**:

```js
// TTL-Sweep nach jedem Handshake. Modul 07 macht keinen
// Selbst-Sweep (kein setInterval, keine Pulsation). Der
// Andocker ruft forgetExpiredSiblings explizit — entweder
// hier nach jedem ersterHandshake() oder als manueller Klick
// im Doku-Fenster (Modul 00 hat den Knopf eingebaut).
// Empfehlung für statische Endknoten: nach jedem Handshake.
var SIBLING_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;  // §0
var removed = await SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS);
if (removed.length > 0) {
  console.info("TTL-Sweep: stille Geschwister vergessen:", removed);
}
```

**Sichtkontrolle in Schritt 9:** vier Punkte (Konsolen-Zeilen,
sbkim_doku_meta["meta"]-Eintrag in IndexedDB, 5-Klick-Geste öffnet
Modal mit allen Sektionen, lastOpenedAt nach erstem Öffnen ISO-
String).

**Zwei „Häufiger Fehler"-Diagnosen in Schritt 9:**
- `searchIconSelector` matcht kein DOM-Element → `console.warn` +
  MutationObserver-Re-Mount mit 10-s-Safety-Timeout (aus Bau-
  Sitzung 00 Frage 2). Fix: korrekten Selektor in `init()`-Aufruf
  setzen, Tab neu laden.
- TTL-Sweep wird nie gerufen → stille Geschwister bleiben
  monatelang in `sbkim_siblings`, Antworten laufen in
  `HandshakeTimeoutError`. Fix: 9c einbauen oder Doku-Fenster
  regelmäßig öffnen + TTL-Sweep-Knopf klicken.

**„Was Schritt 9 NICHT macht"** explizit dokumentiert (drei
Punkte): kein Self-Apoptose-Knopf (Karte 07 hat ihn als
zweistufig+irreversibel spezifiziert; gehört in separaten Service-
Pfad), keine Handshake-Automatik (Schritt 8 bleibt Klaus-Trigger),
kein Heterokaryose-Pfad (Modul 06 ist Schablone, späte Phase).

### 4. § Sichtkontrolle nach dem Andocken erweitert

Von drei auf **vier** Pflicht-Punkte:

1. **Sieben Selbstcheck-Zeilen** in DevTools-Konsole (alle Module
   beim Skript-Laden, 03 nach `init()`) plus vier Andock-
   Konsolen-Zeilen.
2. **Sechs IndexedDB-Stores** mit `sbkim_doku_meta["meta"]` schon
   nach Schritt 9 gefüllt.
3. **Live-Endpunkte** `/sbkim/spore.json` GET 200, `/sbkim/anastomosis`
   GET 405, `/sbkim/legacy` GET 405 (gemeinsamer SW-`fetch`-
   Listener seit Bau-Sitzung 07).
4. **5-Klick-Geste am Such-Symbol** öffnet das modale Doku-
   Fenster mit allen Sektionen.

### 5. Visualisierungs-Mermaid-Flowchart erweitert

Von acht auf neun Knoten (A1–A9). Neuer Knoten A9:

```
A9[9 · Apoptose+Doku<br/>SbkimApoptose.init<br/>+SbkimDoku.init<br/>+TTL-Sweep]
A8 --> A9
```

Erläuterungs-Text unter dem Flowchart aktualisiert: „Die neun
Schritte sind linear … Schritt 9 schaltet Vermächtnis-Empfang
(Apoptose) und das versteckte 5-Klick-Doku-Fenster scharf
(Pflege-Sitzung 2026-05-15, jetzt verbindlich im Andock-Pfad)."

### 6. § Datei-Pfad-Konvention nachgezogen

Von „fünf SBKIM-Module" auf „sieben SBKIM-Module" in zwei
Stellen. Die Endknoten-Repo-Struktur bleibt dieselbe, nur die
Anzahl der `<script>`-Blöcke ändert sich.

### 7. § Verantwortlichkeiten Macht-Block ergänzt

Statt „Module 01/02/03/04/05" jetzt „Module 01/02/03/04/05/07/00"
mit Hinweis „Modul 00 zuletzt, fail-soft als optionale Lese-
Quellen".

### 8. INTERFACES.md §6 Änderungsprotokoll

Eine Zeile am unteren Ende der Tabelle eingefügt (neueste Zeile
unten, Konventions-Stil wie die anderen Pflege-Sitzungen
2026-05-15). Fasst alle Karte-09-Erweiterungen in einer langen
Zeile zusammen. §1 Modul 09 unverändert.

### 9. Karte 09 Bauzustand-Tabelle

Neue Zeile „Pflege Schritt 9 + 07/00 | 2026-05-15 | Pflege
09-Schritt-9-Doku-TTL | …" mit ausführlicher Anmerkung. Bestehende
Zeilen unverändert.

### 10. PULS-Aktualisierungen

- **Sitzungs-Eintrag oben** mit Was getan / Was nicht geändert
  (bewusst) / Frischer-Kopf-Befund (Karte 09 ist jetzt
  vollständig) / Was offen blieb / Nächster Schritt.
- **Schnellüberblicks-Zeile Modul 09** auf „Spec fertig
  (2026-05-14, Pflege Schritt 9 + 07/00 2026-05-15)" gehoben mit
  „**9 Schritte**"-Vermerk.
- **„Als nächstes ✨"-Block Modul 09** ausführlich aktualisiert
  mit Sichtkontroll-Erweiterung und neuen Empfehlungs-Hinweisen.
- **„Empfehlung Hauptsitzung"-Block** für Bau-Sitzung 09 Live-
  Andock präzisiert: „Karte 09 ist ab Pflege-Sitzung 2026-05-15
  auf neun Schritte erweitert"; Modul 02's `resetIdentityCache`
  bleibt im Andock-Pfad **unsichtbar** (greift nur bei
  Self-Apoptose, die Schritt 9 bewusst nicht einbaut); Klaus'
  Re-Sichttest Panel 07 Test 6 als kompakter Schritt **vor** dem
  Live-Andock empfohlen.

### 11. WEGWEISER-Stand-Block-Zeile

Eine Zeile am unteren Ende des Stand-Blocks ergänzt (Wanderung —
neueste Zeile unten), Konventions-Stil wie die anderen Pflege-
Sitzungen 2026-05-15. Fasst Befund + alle Karte-09-Erweiterungen
+ nächsten Schritt in einer langen Zeile zusammen.

### 12. Keine Code-Änderung

Karte 09 ist Anleitung. Keine `src/`-Datei wurde berührt. Keine
`tests/`-Datei wurde berührt.

### 13. `status.json` unverändert

Modul 09 bleibt `score:"spec"` / `siegel:"Spec fertig"`. Pie
nicht regeneriert (keine Score-Änderung). Modul 09 ist Anleitung;
Status-Hochstufung kommt erst nach erstem Live-Andock-Versuch
durch Klaus (= „erstmaliger Einbau Rezeptbuch/Mixarium"-
Bauzustand-Zeilen, die Klaus dann nachträgt).

---

## Was nicht geändert wurde (bewusst)

- **Keine Code-Änderung in irgendeinem Modul.** Karte 09 ist
  Anleitung — sie verändert nur die Andock-Sequenz, nicht die
  Modul-APIs.
- **`status.json` Modul 09 unverändert** (`score:"spec"` /
  `siegel:"Spec fertig"`); Pie nicht regeneriert. Modul 09
  Status-Hochstufung wartet auf den ersten Live-Andock.
- **INTERFACES.md §1 Modul 09 unverändert.** Vertrag-Sektion
  bleibt; nur §6 bekommt eine Änderungsprotokoll-Zeile.
- **Kein Self-Apoptose-Knopf in Schritt 9.** Bewusst — Karte 07
  hat ihn als zweistufig+irreversibel spezifiziert; gehört in
  separaten Service-Pfad.
- **Modul 06 Heterokaryose nicht im Andock-Pfad.** Spec ist
  Schablone (späte Phase); 06 vor erstem PWA-Einbau wäre
  Spekulation.
- **Test-Datei nicht geändert.** Tests/manual_check.html bleibt
  unangetastet — Karte 09 ist Andock-Anleitung für Endknoten,
  nicht Teil der Sage-Protokol-Test-Werkstatt.

---

## Frischer-Kopf-Befund: Karte 09 ist jetzt vollständig

Alle Folge-Pflege-Punkte aus den Spec- und Bau-Sitzungen sind in
Karte 09 verankert:

- **Spec-Sitzung 07 → „Karte 09 Schritt 9: TTL-Sweep-Aufruf"**
  → 9c eingebaut (Andocker-Automatik nach jedem Handshake).
- **Spec-Sitzung 00 → „Karte 09 Folge-Pflege-Sitzung Modul 00 im
  Andock-Pfad"** → 9b eingebaut (`SbkimDoku.init`).
- **Bau-Sitzung 07 → „Cleanup-Reihenfolge zieht in INTERFACES.md
  §1 Modul 07"** — schon in Pflege 02+07-Cache-Invalidate
  erledigt (Schritt 6 `SbkimSpore.resetIdentityCache()`); für
  Schritt 9 irrelevant, weil Schritt 9 keine Self-Apoptose
  vorsieht.
- **Bau-Sitzung 00 → „Frage 2 MutationObserver-Re-Mount"** — in
  Karte 09 Schritt 9b als Fehler-Diagnose dokumentiert (10-s-
  Safety-Timeout).

**Karte 09 ist jetzt der vollständige Andock-Vertrag** für die
ersten Endknoten (Rezeptbuch + Mixarium). Klaus kann mit Karte 09
in der Hand alle neun Schritte durchgehen, ohne in andere Karten
springen zu müssen — die spezifischen Details stehen in den
Modul-Karten, aber der Andock-Pfad ist linear und vollständig
in Karte 09.

**Beobachtung zur nächsten Sitzung:** Bau-Sitzung Modul 09 Live-
Andock braucht Klaus aktiv im Browser:
1. Rezeptbuch und Mixarium als zwei Endknoten-PWA-Repos auf
   GitHub Pages.
2. Beide Repos: die sieben SBKIM-Module + `sbkim-sw.js` aus dem
   Sage-Protokol-Repo kopiert (Schritt 1).
3. `index.html` jeweils um die `<script>`-Tag-Liste in der
   verbindlichen Reihenfolge ergänzt (Schritt 2).
4. Beide PWAs einmal im Browser gestartet, alle Schritte 3–9
   durchgespielt.
5. Erster Cross-Repo-Handshake (Schritt 8).
6. Doku-Fenster in beiden öffnen (5-Klick-Geste am Such-Symbol),
   Geschwister-Liste prüfen.

Diese Sitzung kann ich **nicht headless** ausführen — sie braucht
Klaus' Browser-Iteration. Pflege-Sitzung 09 Schritt 9 hat sie
maximal vorbereitet.

---

## Was offen blieb

- **Klaus' Re-Sichttest Panel 07 Test 6** (kompakt, im Browser)
  zur Bestätigung der Pflege-Sitzung 02+07-Cache-Invalidate.
  Erwartung: `getNodeId_wirft_NoIdentityError:true`.
- **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
  Versuch** ist jetzt der nächste produktive Schritt — Karte 09
  ist vollständig (neun Schritte), Klaus hat alle nötigen Details
  in einer Karte.
- **Modul 06 Heterokaryose Spec-Sitzung** kommt erst nach dem
  ersten Live-Andock — Klaus weiß dann, welche Daten überhaupt
  austauschenswert sind und welche Opt-In-Form für ihn
  praktikabel ist.
- **Karte 04 Match-Kalibrierungs-Beleg** könnte in einer
  späteren Mini-Pflege um Klaus' Trias-Werte aus Pflege 05-Test-2
  erweitert werden (Klaus hat das bewusst auf später verschoben).
- **Folge-Pflege-Sitzung „Embedding-Baseline"** bleibt offen —
  alle drei Trias-Werte lagen sehr nah an der 0.80-Schwelle
  (0.79–0.82); PROVIDER_MIN_MATCH-Anhebung oder Vektor-Familien-
  Wechsel wären die zwei Optionen.
- **Folge-Pflege-Sitzung „Persistenz-Strategie verbinden"**
  bleibt offen, bis Modul 01 (Persist) und Modul 02 (Backup)
  spruchreif sind.

---

## Nächster sinnvoller Schritt

1. **Klaus' Re-Sichttest Panel 07 Test 6** (kompakt, im Browser)
   — Bestätigung der Cache-Invalidate-Pflege.
2. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
   Versuch** zwischen Rezeptbuch und Mixarium. Karte 09 ist jetzt
   vollständig (neun Schritte); Klaus hat alle nötigen Details
   in einer Karte.
3. Nach dem Live-Andock: **Spec-Sitzung Modul 06 Heterokaryose**,
   sobald Klaus aus dem echten Endknoten-Betrieb weiß, welche
   Daten ausgetauscht werden sollen.
4. Optional: **Folge-Pflege-Sitzung „Embedding-Baseline"**, falls
   die Schwelle bei realen Knoten-Paaren auch zu nah liegt.

---

## Pflicht-Häkchen am Sitzungsende

- [x] **Karte 09 § Andock-Schritt-Pfad** von acht auf neun
      Schritte erweitert
- [x] **Schritt 2 (`<script>`-Tags)** zieht Modul 07 + Modul 00
      in der verbindlichen Reihenfolge nach
      (`01 → 02 → 03 → 04 → 05 → 07 → 00`)
- [x] **Sichtkontroll-Block in Schritt 2** zeigt jetzt sechs
      Selbstcheck-Zeilen (statt vier; 03 weiterhin nach `init()`)
- [x] **Neuer Schritt 9 „Apoptose + Doku-Fenster scharf
      schalten"** mit drei Sub-Punkten (9a/9b/9c) eingebaut
- [x] **Zwei „Häufiger Fehler"-Diagnosen** in Schritt 9
      dokumentiert (searchIconSelector matcht nichts; TTL-Sweep
      nie gerufen)
- [x] **„Was Schritt 9 NICHT macht"** explizit (kein Self-
      Apoptose-Knopf, keine Handshake-Automatik, kein
      Heterokaryose-Pfad)
- [x] **§ Sichtkontrolle nach dem Andocken** von drei auf vier
      Pflicht-Punkte erweitert
- [x] **Visualisierungs-Mermaid-Flowchart** von acht auf neun
      Knoten erweitert (A1–A9)
- [x] **§ Datei-Pfad-Konvention** von „fünf JS-Module" auf
      „sieben JS-Module" nachgezogen
- [x] **§ Verantwortlichkeiten Macht-Block** ergänzt um Modul
      07 + 00 mit Reihenfolge-Hinweis
- [x] **INTERFACES.md §6** Änderungsprotokoll-Zeile am unteren
      Ende ergänzt (neueste unten, Konventions-Stil)
- [x] **§1 Modul 09 unverändert** (Vertrag-Sektion bleibt; nur
      §6 ergänzt)
- [x] **Karte 09 Bauzustand-Tabelle** „Pflege Schritt 9 + 07/00"-
      Zeile mit ausführlicher Anmerkung
- [x] **Keine Code-Änderung in irgendeinem Modul** —
      `src/modules/*.js` und `src/sbkim-sw.js` unverändert
- [x] **`status.json` Modul 09 unverändert** (`score:"spec"`,
      kein Pie-Regenerate)
- [x] **Test-Datei nicht geändert**
- [x] **PULS Sitzungs-Eintrag oben** mit Was getan / Was nicht
      geändert / Frischer-Kopf-Befund / Was offen blieb /
      Nächster Schritt
- [x] **PULS-Schnellüberblicks-Zeile Modul 09** auf
      „Spec fertig (2026-05-14, Pflege Schritt 9 + 07/00
      2026-05-15)" gehoben
- [x] **PULS „Als nächstes ✨" Modul-09-Block + Empfehlung
      Hauptsitzung-Block** ausführlich aktualisiert
- [x] **WEGWEISER-Stand-Block-Zeile** unten ergänzt (Wanderung,
      neueste Zeile unten)
- [x] **Übergabeprotokoll** (diese Datei)
- [ ] **Commit + Push** auf
      `claude/pflege-09-schritt-9-doku-ttl` (folgt)
- [ ] **Draft-PR gegen `main`, danach merge** (folgt)
