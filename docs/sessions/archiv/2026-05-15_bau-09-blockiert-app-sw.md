# Übergabeprotokoll · 2026-05-15 · Bau-Sitzung Modul 09 — BLOCKIERT (App-SW-Konflikt in beiden Endknoten)

**Sitzungs-Rolle:** Bau-Sitzung (Modul 09 Live-Andock, ursprünglich vorgesehen als erster
End-zu-End-Andock-Versuch in Rezeptbuch und Mixarium).
**Status:** Sauber abgebrochen **vor Schritt 1** der neun Andock-Schritte. Befund-Sitzung —
kein Modul-Code in `src/` angefasst, keine Datei in den Endknoten-Repos angefasst.
**Branch:** `claude/bau-09-live-andock-QF4Ry`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C und an die Bau- /
Pflege-Sitzungen vom 2026-05-14 und 2026-05-15.
**Modul:** 09_einbau_pwa (Anleitung, kein JS-Modul)

---

## Auftrag

Live-Andock von SBKIM in beide Endknoten-PWAs des Betreibers gemäß Karte 09 in
ihrer durch die Pflege-Sitzung 2026-05-15 erweiterten Fassung (neun Schritte):

1. Sieben Module (01/02/03/04/05/07/00) in beide Endknoten kopieren.
2. `<script>`-Tags in `index.html` einsetzen.
3. Service-Worker `sbkim-sw.js` im Repo-Root registrieren.
4. `SbkimAnastomose.init()` aufrufen.
5. `domainVector` über die Domänen-Stichwörter erzeugen.
6. Spore mit `domainVector` erzeugen.
7. Spore unter `/sbkim/spore.json` deployen.
8. Ersten Handshake gegen ein Geschwister auslösen.
9. `SbkimApoptose.init()` + `SbkimDoku.init({searchIconSelector:...})` scharf schalten.

Sichtkontrolle: vier Pflicht-Punkte (sieben Selbstcheck-Zeilen + sechs IndexedDB-Stores
inkl. `sbkim_doku_meta["meta"]` + zwei live-Endpunkte + 5-Klick-Geste am Such-Symbol).

---

## Was passiert ist

Bevor irgendein Schritt der Karte angefasst wurde, ergaben drei Vor-Klärungen
sequenziell, dass diese Sitzung den Andock-Pfad **nicht durchführen kann**, ohne
Karte 09 zu brechen oder die bestehenden PWAs zu beschädigen.

### Vor-Klärung 1 — Tablet-Realität: Plan A muss Eruda statt Desktop-DevTools sein

Klaus arbeitet auf einem **Samsung Galaxy Tab S6** im **DeX-Modus** an einem Monitor.
Das Desktop-Look-Layout täuscht: der Browser ist trotz DeX **Android-Chrome**. Folge:

- Kein „Mehr Tools → Entwicklertools"-Menüpunkt.
- Kein `Strg+Shift+I` (würde auf Android-Chrome nichts auslösen).
- Remote-USB-Debugging an einem zweiten Rechner fällt für Klaus aus (kein Desktop-PC
  im Workflow).

Karte 09 § Sichtkontrolle nennt die Pflicht-Punkte „**in der DevTools-Konsole / unter
Anwendung → IndexedDB**". Der Karten-Wortlaut setzt implizit Desktop-DevTools voraus.
Auf Klaus' Setup ist das nicht erreichbar.

**Pragmatischer Tablet-Pfad:** ein in-Page DevTools-Polyfill wie **Eruda**
(`<script src="…/eruda"></script>` plus `eruda.init()`). Es macht einen kleinen
Floating-Button auf der Seite, der bei Antippen Console + Resources/IndexedDB +
Network direkt im Tab öffnet — touch-bedienbar, voll passend zum Tab-S6-Setup.
Eruda wäre temporär (nur für Sichtkontrolle) und nach erfolgreichem Andock wieder
zu entfernen.

**Status:** Eruda ist **kein** Werkzeug, das Karte 09 in ihrer jetzigen Fassung
zulässt — das wäre eine Drehbuch-Abweichung. Diese Bau-Sitzung darf nicht
eigenmächtig vom Drehbuch abweichen (CLAUDE.md § „Was du nicht tust"). Eintrag als
**Karten-Lücke 1**.

### Vor-Klärung 2 — Pages-URLs der Endknoten

Bisher in PULS und `status.json` als „TBD" / `null` geführt. Klaus hat die beiden
Pages-URLs in der Sitzung mitgeteilt:

- **Rezeptbuch:** `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/`
- **Mixarium:**   `https://lausiklauskn-png.github.io/Mein-Mixarium/`

Beide unter dem gleichen Pages-Origin `lausiklauskn-png.github.io` — also aus
Browser-Sicht **gleicher Host, verschiedene Pfade** (zwei verschiedene Origins für
Service-Worker- und IndexedDB-Scope, weil GitHub Pages Project-Sites jeweils einen
Scope `/<repo>/` haben). Karte 09 § Im Mycel-Bild beschreibt das genau so („zwei
verschiedene `nodeId`-Werte, zwei verschiedene Spores").

PULS-Tabelle „Endknoten" und `status.json` `endknoten[*].url` werden in dieser
Sitzung mit den konkreten URLs nachgezogen (kein `integrated`-Status-Wechsel — der
Andock ist nicht erfolgt). Eintrag als **Mini-Befund, keine offene Frage mehr**.

### Vor-Klärung 3 (Show-Stopper) — beide Endknoten haben aktiven App-Cache-SW im Repo-Root

Stichprobe per github.dev-Suche in `index.html` beider Endknoten-Repos, gefiltert auf
den Token `.register(`:

- **`Mein-Mixarium/index.html` Zeile 12543:**

  ```js
  if('serviceWorker' in navigator){
    let swReg;
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./app-sw.js').then(reg=>{
        swReg = reg;
        if(reg.waiting) showUpdBanner(reg.waiting);
        reg.addEventListener('updatefound',()=>{
          const nw = reg.installing;
          nw.addEventListener('statechange',()=>{
             if(nw.state==='installed' && navigator.serviceWorker.controller){
               showUpdBanner(nw);
             }
          });
        });
      }).catch(()=>{});
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        window.location.reload();
      });
    });
  }
  ```

- **`Mein-Rezeptbuch/index.html` Zeile 10453:** identischer Block, identisches
  `register('./app-sw.js')`.

Beide PWAs haben einen voll funktionsfähigen **App-Cache-Service-Worker** mit
Update-Banner-Logik (`updatefound` + `controllerchange`-Listener), bereits live
deployt, im Repo-Root mit Scope `/<repo>/`.

Karte 09 § Datei-Pfad-Konvention (Zeile 192) verlangt verbindlich:

> **„Konvention dieser Karte: SW immer im Repo-Root."**

Damit kollidiert SBKIM-SW (`sbkim-sw.js`) mit dem bestehenden `app-sw.js`
**im selben Scope `/<repo>/`**. Ein Browser erlaubt **nur einen aktiven
Service-Worker pro Scope** — der neue ersetzt den alten. Wenn Schritt 3 der
Karte 09 ausgeführt würde, würde Klaus' App-Update-Banner und Cache-Strategie
stillschweigend abgeschaltet.

Karte 09 § Risiken (Zeile 837–842) dokumentiert die SW-Scope-Falle nur in eine
Richtung („SBKIM-SW falsch platziert unter `/<repo>/sbkim/sbkim-sw.js`"). Der
**umgekehrte Fall** — bestehender App-SW im Root blockiert die SBKIM-SW-Platzierung
— ist in der Karte **nicht antizipiert**. Eintrag als **Karten-Lücke 2**.

---

## Konsequenz

Bau-Sitzung 09 wird **sauber abgebrochen vor Schritt 1**.

- **Kein Modul-Code** in `src/` dieses Repos angefasst.
- **Kein Endknoten-Code** in `Mein-Rezeptbuch` oder `Mein-Mixarium` angefasst.
- **Karte 09 selbst nicht ergänzt** — das wäre Pflege-Arbeit, nicht Bau-Arbeit
  (CLAUDE.md § „Keine Vermischung der Module"). Pflege ist Sache der nächsten Sitzung.
- **`status.json` `score`-Werte unverändert** — Modul 09 bleibt `score:"spec"` /
  `siegel:"Spec fertig"`. Pie nicht regeneriert.
- **`status.json` `endknoten[*].url`** mit den Pages-URLs nachgezogen
  (additiv, kein Schema-Bruch; `integrated:false` bleibt).

---

## Befund-Notiz für die nächste Sitzung (Karten-Lücken)

Karte 09 muss durch eine **Pflege-Sitzung** um zwei Sub-Pfade erweitert werden,
bevor Bau-Sitzung 09 sinnvoll wiederholbar ist:

### Karten-Lücke 1 — Tablet-Sichtkontrolle

Karte 09 § Sichtkontrolle bracht eine Eruda-Variante als gleichwertigen Ersatz für
Desktop-DevTools auf Tablet-Setups (Android-Chrome, kein Remote-USB-Debug).
Skizze für die Pflege:

- Script-Tag-Snippet (`<script src="…eruda"></script>` + `eruda.init()`) als
  optionaler Einsatz **nur in der Andock-Sitzung**, ausdrücklich nicht im
  Produktiv-Andock dauerhaft.
- Drei Tab-Pfade dokumentieren: Console für Selbstcheck-Zeilen · Resources →
  IndexedDB für die sechs Stores · Network für die zwei live-Endpunkte.
- Hinweis „nach erfolgreichem Andock entfernen" — passt zu Karte 09 § Was nicht
  in den Endknoten gehört (keine Test-Helfer in der Produktiv-App dauerhaft).

### Karten-Lücke 2 (gravierender) — Andocken in PWA mit bestehendem Service-Worker

Karte 09 § Datei-Pfad-Konvention und § Risiken müssen den häufigen Normalfall
spezifizieren, dass die Endknoten-PWA bereits einen App-Cache-SW im Repo-Root hat
(Klaus' beide PWAs sind exakt dieser Fall, vermutlich auch jede künftige Sage-
PWA, weil App-Update-Banner-Logik Industriestandard für PWAs ist).

Drei denkbare Optionen, mit Empfehlung:

- **Option α (empfohlen) — SBKIM-Logik in den bestehenden `app-sw.js` integrieren.**
  Konvention bleibt „ein SW im Repo-Root". Der Andocker editiert `app-sw.js` und
  hängt die SBKIM-fetch-Listener für `/sbkim/anastomosis` und `/sbkim/legacy`
  als zusätzliche `addEventListener('fetch',...)`-Blöcke an. MessageChannel-Brücke
  zur Page bleibt unverändert. App-Update-Banner-Logik bleibt unangetastet.
  Karte 09 § Schritt 3 müsste eine Doppel-Variante zeigen („SW frisch registrieren"
  vs. „SW-Patch in bestehenden app-sw.js einfügen") mit Code-Patch-Beispiel.
  Pflichthinweis: der App-SW darf SBKIM-Endpunkte **nicht cachen**, sonst
  Spore-Drift und CSP-Konflikt mit Anastomose-Antworten.

- **Option β — SBKIM-SW unter `/sbkim/sbkim-sw.js` mit Scope `/<repo>/sbkim/`.**
  Karte 09 § Risiken nennt das schon als suboptimal. Spätere Schutz-Module
  (11 Rate-Limit, 12 Blocklist) brauchen Root-Scope. Als Übergangslösung
  dokumentierbar, aber nicht zukunftsfähig.

- **Option γ — bestehenden App-SW deaktivieren und durch einen einzigen,
  vereinheitlichten SW ersetzen,** der App-Caching + SBKIM-Endpunkte abdeckt.
  Höchster Bau-Aufwand, sauberste Architektur — gehört in eine eigene
  Architektur-Diskussion, nicht in eine Pflege-Sitzung Karte 09.

**Empfehlung:** Pflege-Sitzung wählt Option α als Drehbuch-Default, Option β als
dokumentierten Notausgang, Option γ als Verweis auf Karte 05 + Karte 09 § Risiken
(Architektur-offen).

INTERFACES.md §6 zieht die Karten-Pflege als Änderungsprotokoll-Zeile nach.

---

## Was getan wurde (in dieser Sitzung, im Sage-Protokol-Repo)

- **Dieses Übergabeprotokoll.**
- **`docs/PULS.md`:** neuer Sitzungs-Eintrag oben, Endknoten-Tabelle mit Pages-URLs
  nachgezogen, „Offene Querschnitts-Fragen" um die zwei Karten-09-Lücken erweitert,
  „Als nächstes ✨" und „Empfehlung Hauptsitzung" auf die Pflege-Sitzung Karte 09
  umgestellt.
- **`status.json`:** `endknoten[0].url` und `endknoten[1].url` mit den konkreten
  Pages-URLs gefüllt (`integrated:false` bleibt). `lastUpdated` auf `2026-05-15`.
  `modules[*].score` unverändert.
- **`scripts/update_puls_pie.py`** **nicht** ausgeführt — keine `score`-Änderung,
  Pie-Block in PULS.md bleibt wie er ist.

---

## Was offen bleibt

- **Pflege-Sitzung Karte 09** mit Auftrag „Erweiterung um zwei Sub-Pfade":
  Tablet-Sichtkontrolle (Eruda) und Andocken in PWA mit bestehendem
  Service-Worker (Optionen α/β/γ, Empfehlung α).
- **Bau-Sitzung 09 erneut** — sobald die Pflege durch ist und Karte 09 die
  zwei Sub-Pfade verbindlich beschreibt.

---

## Nächster sinnvoller Schritt

Pflege-Sitzung Karte 09 „App-SW-Koexistenz + Tablet-Sichtkontrolle". Eine Phase,
ein Karten-Anker, keine Modul-Eingriffe. Auftrag:

1. Karte 09 § Datei-Pfad-Konvention um die Doppel-Variante (frisch vs. Patch
   in bestehenden SW) ergänzen, Option α als Default.
2. Karte 09 § Schritt 3 um einen Code-Patch-Snippet für `importScripts` /
   `addEventListener('fetch',...)` in einem bestehenden `app-sw.js` ergänzen.
3. Karte 09 § Risiken um „bestehender App-SW im Repo-Root, SBKIM-SW würde ihn
   ersetzen — Konvention: patchen statt registrieren" erweitern.
4. Karte 09 § Sichtkontrolle um Eruda-Tab-S6-Pfad ergänzen (Script-Snippet,
   drei Tab-Pfade, „nach Andock entfernen").
5. INTERFACES.md §6 Änderungsprotokoll-Zeile nachziehen.
6. PULS-Sitzungs-Eintrag, Karten-09-Bauzustand-Tabelle, WEGWEISER-Zeile.
7. `status.json` Modul 09 unverändert (kein Score-Sprung, Karten-Erweiterung
   ist additiv).

Danach Bau-Sitzung 09 mit neuem Briefing am gleichen Branch oder einem frischen
`claude/bau-09-live-andock-…`-Branch.

---

## Branch und Commit

- **Branch:** `claude/bau-09-live-andock-QF4Ry`
- **Commit:** dieser Sitzungs-Abschluss (PULS-Eintrag, status.json-URLs, dieses
  Archiv-Protokoll). **Kein PR-Merge** — die Sitzung liefert einen Befund, keinen
  Modul-Bau. PR bleibt Draft, damit Klaus ihn vor Pflege-Sitzung 09 lesen kann.
