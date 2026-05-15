# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Karte 09 App-SW-Koexistenz + Tablet-Sichtkontrolle

**Sitzungs-Rolle:** Pflege-Sitzung (eine Sitzung, ein klar
abgegrenzter Karten-Anker). Schließt die zwei Karten-Lücken aus der
abgebrochenen Bau-Sitzung Modul 09 (2026-05-15) — den Rest, den
Pflege App-SW-Koexistenz (PR #31) noch offen gelassen hat. Datei-
Scope: ausschließlich `docs/components/09_einbau_pwa.md` plus PULS-
Eintrag plus dieses Übergabeprotokoll. **Keine Modul-Eingriffe,
keine §1-Vertragsänderung, keine Score-Änderung.**
**Branch:** `claude/pflege-karte-09-app-sw-Gga7R`
**Format:** angelehnt an `2026-05-15_pflege-sichttest-resultate.md`
(Stil-Vorbild für kompakte Pflege-Übergabeprotokolle) und an
`2026-05-15_pflege-09-app-sw-koexistenz.md` (direkte Vorgänger-
Sitzung).
**Modul:** 09_einbau_pwa (Anleitung, kein JS-Modul).

---

## Auftrag

Eine Phase, drei Stränge:

1. **Karte 09 § Datei-Pfad-Konvention + § Schritt 3** um die
   nachrangige Variante 3c (SBKIM-SW unter `/sbkim/` mit Scope-
   Einschränkung) erweitern, plus Tabelle „Wann welche Variante?"
   für die Andock-Entscheidung. Pflege App-SW-Koexistenz (PR #31)
   hat 3a/3b und den Pre-Flight-Check schon eingebaut — 3c als
   dokumentierter Notausgang fehlt noch.
2. **Karte 09 § Risiken** — heutiges achtes Risiko „App-SW-
   Überschreibung" ist schon vollständig in PR #31 verankert.
   Diese Pflege fügt **keinen** weiteren Risiko-Eintrag hinzu;
   der Brief verlangte das achte Risiko, das war aber schon
   erledigt.
3. **Karte 09 § Sichtkontrolle** um einen § Tablet-Variante-Sub-
   Block (Eruda als in-Page-DevTools-Polyfill) für Klaus' Galaxy
   Tab S6 + DeX erweitern.

Anschließend PULS-Rotation, Karten-Lücken als gelöst markieren,
Übergabeprotokoll, Commit + Push, Draft-PR.

---

## Was getan wurde

### 1. Hintergrund — die noch offene Hälfte der Karten-Lücken

Bau-Sitzung Modul 09 (2026-05-15) hatte zwei Karten-Lücken aufgedeckt
und sauber abgebrochen (siehe
`2026-05-15_bau-09-blockiert-app-sw.md`):

- **Karten-Lücke 1 — Tablet-Sichtkontrolle.** Klaus' Galaxy Tab S6
  + DeX hat Android-Chrome, keinen Desktop-DevTools-Zugriff. Karte 09
  § Sichtkontrolle setzt implizit Desktop-DevTools voraus.
- **Karten-Lücke 2 — App-SW-Koexistenz.** Beide Endknoten haben
  einen aktiven `register('./app-sw.js')` im Repo-Root mit voller
  Update-Banner-Logik. Karte 09 verlangte SBKIM-SW im Repo-Root —
  ein Browser erlaubt aber nur einen SW pro Scope.

**Pflege App-SW-Koexistenz (PR #31, 2026-05-15)** hat den größeren
Teil der Lücke 2 geschlossen:

- Schritt 3 in **3a/3b** verzweigt mit Pre-Flight-Check
  (`navigator.serviceWorker.getRegistration('./')`).
- Variante 3b = `importScripts('./sbkim-sw.js')` in bestehendem
  `app-sw.js` (= Option α aus dem Befund).
- `SBKIM_SW_STANDALONE`-Flag in `src/sbkim-sw.js` (Default `true`
  rückwärtskompatibel, `false` für 3b).
- Achtes Risiko **„App-SW-Überschreibung"** in § Risiken & offene
  Punkte.
- § Service-Worker-Hinweis Lebenszyklus-Block + fetch-Listener-
  Reihenfolge dokumentiert.
- § Sichtkontrolle fünfter (variantenspezifischer) Pflicht-Punkt
  für 3b.
- § Datei-Pfad-Konvention um optionalen `app-sw.js`-Block (Variante
  3b) ergänzt.

**Offen blieben drei Rest-Stränge:** Lücke 1 (Tablet/Eruda)
vollständig; bei Lücke 2 zusätzlich Variante 3c (= Option β) als
nachrangiger Notausgang und eine Andock-Entscheidungs-Tabelle.

### 2. Karte 09 § Datei-Pfad-Konvention — Variante 3c + Tabelle

**Variante 3c (nachrangig, Übergangslösung)** als dritter Absatz
nach 3a/3b ergänzt: SBKIM-SW unter `<endknoten>/sbkim/sbkim-sw.js`
mit Scope-Einschränkung `/<repo>/sbkim/`, disjunkt zum App-SW-Scope
`/<repo>/`. Beide Worker koexistieren. **Nicht empfohlen** — spätere
Schutz-Module (11 Rate-Limit, 12 Blocklist) wollen Pfade unterhalb
des Repo-Roots ohne `/sbkim/`-Präfix abfangen und können das in
dieser Variante nicht. Verweis auf § Schritt 3c für Code-Block.

**Neue Tabelle „Wann welche Variante?"** mit drei Zeilen:

| Variante | Pre-Flight-Ergebnis | Eigenschaften | Empfehlung |
|---|---|---|---|
| 3a Standalone | `getRegistration('./')` → `null` | Frischer SW, Scope `/<repo>/`, ein Eintrag | ⭐ Default ohne App-SW |
| 3b importScripts | aktive Registrierung Scope `/<repo>/` | Ein SW (App-SW), `SBKIM_SW_STANDALONE=false`, additiv | ⭐ Default mit App-SW (Option α) |
| 3c Scope-Einschränkung | App-SW vorhanden, Patch unerwünscht | Zwei SWs, Schutz-Module 11/12 blockiert | nachrangig (β), Übergangslösung |

Klare Empfehlung-Sterne ⭐ bei 3a und 3b; Variante 3c explizit als
nachrangig und mit Migrations-Pflicht auf 3b markiert, sobald
Schutz-Module 11/12 ziehen.

### 3. Karte 09 § Schritt 3c — Code-Block + Vor-/Nachteil

Neuer Sub-Abschnitt **„Schritt 3c — Variante ‚nachrangig: SBKIM-SW
unter /sbkim/ mit Scope-Einschränkung'"** nach dem § Schritt 3b
(„Häufige Fehler"-Block) eingefügt. Inhalt:

- **Wann wählen:** weder 3a noch 3b möglich (App-SW darf nicht
  modifiziert werden, Eilig-Andock unter Zeitdruck). Explizit als
  „Service-Worker-Scope-Konvention bewusst gebrochen / Übergangs-
  lösung".
- **Code-Block:**

  ```js
  navigator.serviceWorker.register("sbkim/sbkim-sw.js", { scope: "sbkim/" })
  ```

  `SBKIM_SW_STANDALONE` bleibt `true` (Default), zwei SW-
  Lebenszyklen koexistieren, beide rufen `skipWaiting`/
  `clients.claim` in ihrem eigenen Scope.

- **Vor/Nachteil:** App-SW unangetastet (Vorteil); Schutz-Module
  11/12 später blockiert (Nachteil); `sbkim-sw.js` muss ins
  Unterverzeichnis kopiert werden (entgegen § Schritt 1 Konvention,
  Nachteil); Migration zurück auf 3b kostet eine Folge-Pflege
  (Nachteil). Spore-Endpunkt `/sbkim/spore.json` ist davon
  unberührt (er ist statische Datei, SW-Scope-unabhängig).

- **Sichtkontrolle:** DevTools → Application → Service Workers
  zeigt **zwei** Registrierungen mit disjunkten Scopes.
  Konsolen-Zeile `SBKIM-SW (Variante 3c) registriert, Scope:
  https://klaus.github.io/<repo>/sbkim/`.

- **Häufiger Fehler:** Variante 3c aus Bequemlichkeit statt
  Pflege-Hoheits-Begründung gewählt. Lösung: bewusste Übergangs-
  Entscheidung dokumentieren, später auf 3b migrieren.

### 4. Karte 09 § Sichtkontrolle — § Tablet-Variante (Eruda)

Neuer Sub-Block **„### Tablet-Variante — Eruda als in-Page-DevTools"**
nach den vier Pflicht-Punkten und **vor** dem fünften (variantenspezifischen)
Punkt eingefügt. Inhalt:

- **Anlass:** Galaxy Tab S6 + DeX = Android-Chrome ohne Desktop-
  DevTools-Zugriff, kein Remote-USB-Debug. Eruda ist pragmatischer
  Pfad — kleines Floating-Button-Overlay, Console + Resources +
  Network touch-bedienbar.
- **Code-Block:**

  ```html
  <script src="https://cdn.jsdelivr.net/npm/eruda@3"></script>
  <script>eruda.init();</script>
  ```

  Major-Version `eruda@3` **gepinnt** für Sichttest-Reproduzierbar-
  keit (späterer Sprung auf `@4` nur in eigener Pflege-Sitzung). SRI
  nicht erforderlich — Sichttest-Modus, keine Produktiv-Pfad.

- **Mapping der vier Pflicht-Punkte** auf Eruda-Tabs:
  1. Sieben Selbstcheck-Zeilen → Eruda-Tab **Console**.
  2. Sechs IndexedDB-Stores → Eruda-Tab **Resources** →
     **IndexedDB** → `sbkim`.
  3. Zwei live-Endpunkte (`/sbkim/anastomosis` + `/sbkim/legacy`
     liefern 405 per GET; `/sbkim/spore.json` liefert 200) →
     Eruda-Tab **Network** + zweiter Browser-Tab als GET-Trigger.
  4. 5-Klick-Geste am Such-Symbol → öffnet Doku-Fenster regulär,
     beide Overlays (Eruda und Doku-Fenster) kollidieren nicht
     (Eruda `z-index` über allem, Doku-Fenster darunter, beide
     benutzbar).

- **Verbindlicher Hinweis** am Ende des Sub-Blocks: „Nach
  erfolgreichem Andock entfernen — kein Produktiv-Bestandteil,
  kein SBKIM-Modul, kein Datenschutz-Stein. Eruda ist temporäres
  Sichttest-Werkzeug für den Endknoten-Andocker, vergleichbar mit
  einem aufgehängten Putzgerüst. Dauerhafter Eruda-Einbau gehört in
  keine produktive PWA."

Sprachlich klar abgegrenzt: Eruda wird für den **Andock-Sichttest
in der Endknoten-PWA** empfohlen, nicht im Sage-Hub (Sage ist
Empfangsmodus, kein DevTools-Polyfill nötig).

### 5. Karte 09 § Bauzustand-Tabelle

Neue Zeile **„Pflege App-SW-Koexistenz + Tablet-Sichtkontrolle
(Eruda) | 2026-05-15 | Pflege 09-App-SW-Koexistenz-Tablet"** als
nächster freier Eintrag chronologisch nach „Pflege App-SW-
Koexistenz" und vor den TBD-Einbau-Zeilen. Inhalt referenziert
die drei Stränge kurz: § Datei-Pfad-Konvention + Tabelle,
§ Schritt 3c, § Sichtkontrolle § Tablet-Variante.

### 6. § Risiken — keine Erweiterung

Der Brief verlangte einen achten Risiko-Eintrag „App-SW-
Überschreibung". **Der ist seit Pflege App-SW-Koexistenz (PR #31)
bereits vollständig in Karte 09 § Risiken & offene Punkte
verankert** (Beschreibung + Erkennung + Lösung + Konvention,
Stil analog Service-Worker-Scope-Falle). Diese Pflege fügt keine
weitere Risiko-Zeile hinzu — der Auftrag war erledigt, bevor diese
Sitzung anfing.

### 7. PULS.md

- **§ Sitzungs-Eintrag oben:** „2026-05-15 · Pflege-Sitzung ·
  Karte 09 App-SW-Koexistenz + Tablet-Sichtkontrolle" ausführlich
  im Stil von Pflege Sichttest-Resultate (Anlass / Getan / Was
  bewusst nicht geändert / Validierung / Was offen / Nächster
  sinnvoller Schritt).
- **§ Offene Querschnitts-Fragen:** beide Karten-Lücke-Einträge
  mit `~~strikethrough~~` als gelöst markiert. Karten-Lücke 1
  durch diese Sitzung, Karten-Lücke 2 in zwei Pflege-Sitzungen
  (PR #31 für 3a/3b/Pre-Flight/Risiko 8, diese Sitzung für
  Variante 3c + Tabelle).
- **§ Archiv-Index:** bisheriger oberster Eintrag „Pflege Sichttest-
  Resultate" als neue oberste Zeile in den Archiv-Index verschoben
  (Format-Konvention).
- **§ Schnellüberblick** unverändert — Modul 09 bleibt `spec`,
  die Spec-Spalte zeigt schon „Pflege App-SW-Koexistenz 2026-05-15";
  der Tablet-Pfad ist Sichtkontroll-Erweiterung, kein Spec-Stand-
  Wechsel.
- **Pie unverändert** — keine Score-Änderung,
  `update_puls_pie.py` **nicht** aufgerufen.

PULS-Zeilenzahl: vor dieser Sitzung 428, nachher 445 (knapp über
dem 430-Soll). Eine PULS-Archivierungs-Pflege ist in den offenen
Fragen bereits notiert und wird die Datei in einer eigenen Sitzung
wieder ausdünnen.

### 8. INTERFACES.md — unverändert

Karte 09 ist Anleitung, kein Modul-Vertrag. Die drei Endpunkte
`/sbkim/anastomosis`, `/sbkim/heterokaryosis`, `/sbkim/legacy` sind
bereits in §3 verankert und werden nicht umbenannt. §1 (öffentliche
Funktionen) und §6 (Änderungsprotokoll) bleiben unverändert. Wenn
der Eindruck entstanden wäre, dass z.B. Eruda eine neue Pflicht-
Konstante einführen müsste (tut sie nicht), wäre die richtige
Reaktion „PULS-Eintrag und sauber enden" gewesen — der ist nicht
nötig, weil keine Schnittstelle berührt wird.

### 9. status.json — unverändert

Modul 09 bleibt `score:"spec"` / `siegel:"Spec fertig"`. Die
Pflege ist additiv im Andock-Pfad, kein Modul-Bau, kein Score-
Wechsel. Pie nicht regeneriert.

### 10. Sichttest

**Headless:** kein Browser-Test verfügbar; `node --check` ist
für Markdown nicht anwendbar. Visuelle Sichtkontrolle der Code-
Blöcke (`register(..., {scope: "sbkim/"})` und Eruda-Script-Tag)
auf Syntax-Sauberkeit durchgezogen; Karten-Querverweise auf
01/05/07 unverändert; neue Sub-Blöcke verweisen nur auf interne
Karten-09-Anker.

**Browser-Sichttest** der Tablet-Variante wartet auf Klaus'
nächsten Live-Andock-Versuch (Bau-Sitzung 09 zweite Iteration).
Der § Tablet-Variante-Block dokumentiert die vier-Punkte-Sichtung
über Eruda — beim Live-Versuch wird Klaus die Tabs Console /
Resources / Network durchklicken und die 5-Klick-Geste auslösen.

---

## Was nicht geändert wurde (bewusst)

- **Pre-Flight-Check, `SBKIM_SW_STANDALONE`-Flag, `src/sbkim-sw.js`**
  aus Pflege App-SW-Koexistenz (PR #31) unverändert. Der bestehende
  `getRegistration('./')`-Block ist für die GitHub-Pages-Project-
  Site-Konstellation präzise und funktional korrekt. Der Brief der
  Pflege empfahl alternativ `getRegistrations()` (Array-Variante,
  semantisch leicht abweichend: liefert alle Registrations, nicht
  nur die für den aktuellen Scope passende). Im Project-Site-Setup
  ist die singuläre Variante kompakter und genauso präzise. Umbau
  hätte dem Auftragsteil „nur der fehlende Rest" widersprochen.
- **`docs/INTERFACES.md`** unverändert — Karte 09 ist Anleitung,
  kein Modul-Vertrag. §1/§3/§6 bleiben.
- **`status.json`** unverändert — Modul 09 bleibt `spec`.
- **`update_puls_pie.py`** nicht aufgerufen — keine Score-Änderung.
- **Keine Code-Änderung an Modulen 00/01/02/03/04/05/07.** Modul-
  Code aller zehn JS-Module bleibt unangetastet.
- **`tests/manual_check.html`** unverändert — Werkstatt ist eigener
  Pfad; Eruda ist Werkzeug für Endknoten-Andocker, nicht Werkstatt.
- **`index.html`** (Sage-Page) unverändert — Sichtkontroll-Pflege
  betrifft Endknoten-Andocker, nicht das Observatorium.
- **`PROTOCOL_VERSION`** bleibt `"0.1"` — kein Hauptversions-Sprung.
- **Keine andere Karte angefasst** als 09. Quersicht 01/02/07: keine
  Verweise auf Eruda oder Variante 3c, die nachgezogen werden
  müssten.
- **Achtes Risiko „App-SW-Überschreibung"** nicht zum zweiten Mal
  geschrieben — bereits vollständig in PR #31 verankert.

---

## Frischer-Kopf-Befund: Rest der Karten-Lücken geschlossen, additiv

Diese Pflege schließt den noch offenen Rest der zwei Karten-Lücken
aus der abgebrochenen Bau-Sitzung 09. Pflege App-SW-Koexistenz
(PR #31) hatte die Haupt-Arbeit gemacht — Schritt-3-Verzweigung,
`SBKIM_SW_STANDALONE`-Flag, achtes Risiko. Diese Pflege legt drei
zusätzliche Bausteine drauf:

1. **Variante 3c als dokumentierter Notausgang** (β aus dem Befund).
   Klaus kann jetzt in einem Sonderfall (App-SW nicht modifizierbar)
   3c wählen und weiß, dass es eine Übergangslösung ist.
2. **Tabelle „Wann welche Variante?"** als Andock-Entscheidungs-
   hilfe. Pre-Flight-Ergebnis + Eigenschaften + Empfehlung-Stern
   machen die Auswahl auf einen Blick sichtbar.
3. **§ Tablet-Variante (Eruda)** in § Sichtkontrolle. Klaus' Galaxy
   Tab S6 + DeX kann jetzt die vier Pflicht-Punkte ohne Desktop-
   DevTools durchsichten.

Karte 09 ist nach dieser Pflege **vollständig** für die zweite
Bau-Iteration:

- 9 Schritte (Pflege Schritt 9, 2026-05-15).
- Schritt 3 mit Pre-Flight + 3a/3b (PR #31) + 3c (diese Pflege).
- Tabelle „Wann welche Variante?" + drei Pfade dokumentiert.
- § Sichtkontrolle mit Tablet-Variante (Eruda).
- § Risiken mit achtem Risiko „App-SW-Überschreibung".

Modul-Code 00/01/02/03/04/05/07 unangetastet. INTERFACES.md
unverändert. status.json unverändert. Score-Pie unverändert. Die
zweite Bau-Iteration 09 mit Klaus am Live-Andock kann auf festem
Boden starten.

---

## Was offen blieb

- **Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-Andock-
  Versuch** zwischen Rezeptbuch und Mixarium. Variante 3b mit Pre-
  Flight + `importScripts` ist Empfehlung. Eruda als Sichttest-
  Werkzeug für die vier Pflicht-Punkte auf dem Tablet. Wartet auf
  Klaus' nächste Sitzung.

- **Folge-Pflege „App-SW-Koexistenz Sicht-Validierung"** kann laufen,
  falls der Live-Versuch unter Eruda eine offene Frage aufwirft:
  z.B. zeigt Eruda-Resources die IndexedDB-Stores in einer anderen
  Reihenfolge als Desktop-DevTools, oder der GET-Trigger für die zwei
  live-Endpunkte braucht eine andere Form auf Tablet (z.B. zweite
  PWA-Instanz statt zweiter Browser-Tab).

- **PULS-Archivierungs-Pflege** ist seit Pflege PULS-Archivierung
  (2026-05-15) als wiederkehrender Aufräum-Schritt notiert. PULS ist
  nach dieser Sitzung bei 445 Zeilen, knapp über dem 430-Soll. Eine
  Mini-Pflege „PULS verdünnen" kann den ältesten Sitzungs-Eintrag
  aus dem Archiv-Index in eine Monats-Archiv-Block-Zeile bündeln.

- **`getRegistration` vs. `getRegistrations`** — der Brief der Pflege
  empfahl die Array-Variante als „richtige Wahl". Bestehender Code
  in PR #31 nutzt die singuläre Variante mit Scope `./`. Für
  GitHub-Pages-Project-Sites ist beides funktional gleich präzise.
  Wenn eine spätere Endknoten-Konfiguration (mehrere SWs unter
  geschachtelten Scopes) auftaucht, die nicht von Klaus' Default-
  Layout abgedeckt ist, kann eine Mini-Pflege „Pre-Flight-Check auf
  Array-Variante umstellen" laufen.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-Andock-
   Versuch** — der freigeschaltete Haupt-Pfad. Variante 3b mit
   Pre-Flight ist Default für beide Endknoten; Eruda als Sichttest-
   Werkzeug.

2. **Klaus' Sichttest Panel 06** (Heterokaryose, 14 Knöpfe). Bau 06
   ist Code-Stub seit 2026-05-15, Sichttest ausstehend.

3. **Mini-Pflege Panel 07 Test 6** (`allEmpty`-Check um
   `sbkim_hetero_inbox` erweitern; `sbkim_doku_meta` +
   `sbkim_hetero_outbox` als bewusst-nicht-leer dokumentieren).
   Winzig, headless möglich, niedrige Dringlichkeit.

4. **Mini-Pflege Karte 08 § Bauzustand-Zeile** „Sichttest geprüft
   2026-05-15" ergänzen (optional, weil PULS die Info schon trägt).
   Headless möglich, niedrige Dringlichkeit.

---

## Checkliste (Pflicht am Sitzungs-Ende)

- [x] **Karte 09 § Datei-Pfad-Konvention** um Variante 3c erweitert
      (SBKIM-SW unter `/sbkim/` mit Scope `/<repo>/sbkim/`,
      disjunkt zum App-SW)
- [x] **Karte 09 § Datei-Pfad-Konvention** Tabelle „Wann welche
      Variante?" mit drei Zeilen (Pre-Flight → Eigenschaften →
      Empfehlung ⭐/β) eingefügt
- [x] **Karte 09 § Schritt 3c** als neuer Sub-Block nach 3b mit
      Code-Block, Vor-/Nachteil-Vergleich, Sichtkontrolle, häufiger
      Fehler-Vermerk
- [x] **Karte 09 § Sichtkontrolle § Tablet-Variante (Eruda)** als
      neuer Sub-Block nach den vier Pflicht-Punkten eingefügt:
      Script-Tag-Snippet `eruda@3`, Mapping der vier Pflicht-Punkte
      auf Eruda-Tabs, „nach Sichtkontrolle wieder entfernen"
- [x] **Karte 09 § Bauzustand** Zeile „Pflege App-SW-Koexistenz +
      Tablet-Sichtkontrolle (Eruda) | 2026-05-15" als nächster
      freier Eintrag vor TBD-Einbau-Zeilen
- [x] **§ Risiken nicht zum zweiten Mal geändert** — achtes Risiko
      „App-SW-Überschreibung" war bereits in PR #31 vollständig
      verankert
- [x] **`docs/INTERFACES.md` unverändert** — Karte 09 ist Anleitung,
      kein Modul-Vertrag (§1/§3/§6 bleiben)
- [x] **`status.json` Modul 09 unverändert** (bleibt `score:"spec"`
      / `siegel:"Spec fertig"`); `update_puls_pie.py` NICHT
      aufgerufen
- [x] **Keine Code-Änderung an Modulen 00/01/02/03/04/05/07** (Modul-
      Code unangetastet)
- [x] **`tests/manual_check.html`**, **`index.html`** unverändert
- [x] **`PROTOCOL_VERSION`** bleibt `"0.1"` — kein Hauptversions-
      Sprung
- [x] **Keine andere Karte angefasst** als 09
- [x] **PULS § Sitzungs-Eintrag** oben mit Anlass / Getan / Was
      bewusst nicht / Validierung / Was offen / Nächster Schritt
- [x] **PULS § Offene Querschnitts-Fragen** beide Karten-Lücke-
      Einträge mit `~~strikethrough~~` als gelöst markiert
- [x] **PULS § Archiv-Index** „Pflege Sichttest-Resultate" als
      oberste Zeile durch Format-Konvention nachgezogen
- [x] **Übergabeprotokoll** (diese Datei)
- [ ] **Commit + Push** auf `claude/pflege-karte-09-app-sw-Gga7R`
      (folgt)
- [ ] **Draft-PR gegen `main`** (folgt)
