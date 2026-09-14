# Übergabeprotokoll — A18: der Andock-Wizard wird Kanon (2026-09-14)

**Rolle:** Haupt-Sitzung. **Auftrag von Klaus:** A18, erste Hälfte —
zusammenführen, übersetzt wird danach. Mitten in der Sitzung hat er den Umfang
erweitert: *„mache automatisch in dieser Sitzung weiter, so lange wie es
sinnvoll ist … möchte morgen weniger Sitzungen, vielleicht gar keine mehr bis
zum Ende der angefangenen Aufgabe."* Daraufhin wurde **auch die zweite Hälfte**
gebaut — der Rollout in alle 18 Nachbar-Repos.
**Branch:** `claude/andock-wizard-merge-gokcps`.

---

## 1 · Erst messen, dann bauen

Der Brief nannte „20 Fassungen, 407–540 Zeilen, 272 gemeinsam". Gemessen wurde
gegen `origin/main`, mit einem Zeichen-Automaten statt eines Regex (ein Regex
über JS-Zeichenketten stolpert über Anführungszeichen in Anführungszeichen):

| Schnitt | verschiedene Fassungen |
|---|---|
| ganze Datei | 20 von 20 |
| Rumpf ohne Konfiguration | **15** |
| ohne Kommentare **und** ohne ID-Präfix | **12** |
| nur Code (Kommentare durch einen Automaten entfernt) | **12** |

Größte byte-gleiche Gruppe: **sechs** (Jasons-Tresor · Kim-Bell ·
Mein-Rezeptbuch · Mein-Tresor · Mein-WorkFloh · Muttis-Rezeptbuch).

### Und die Textmengen sagten das Entscheidende

Die Anzeigetexte aller zwanzig Dateien nebeneinandergelegt: **jede Abweichung
war ein FEHLENDER Text**, also eine ältere Generation — mit **genau einer**
Ausnahme, Privat-Brains Satz über die Membran. Eine Vereinheitlichung, die eine
gewollte Abweichung einebnet, wäre ein Schaden, der wie Aufräumen aussieht; es
gab nur diese eine, und sie ist **bedingt** übernommen.

---

## 2 · Die Trennlinie (Tafel zuerst)

`docs/INTERFACES.md` **§11.9** wurde **vor** dem Code geschrieben.

| | |
|---|---|
| **Kanon** — `src/modules/16b_andock_wizard.js` | Ablauf, alle Anzeigetexte, alle Prüfungen |
| **App-eigen** — `siegel-inhalt.js` | `window.SBKIM_SIEGEL_WIZ` — die Identität |

Die beiden Konfigurations-Dateien bleiben in `NIE_VERTEILEN`. Deshalb liegt der
Kanon in einer **eigenen** Datei und nicht als Block in derselben: der Riegel,
der jeder App Sages Vektor verwehrt, bleibt unangetastet.

### Drei Entscheidungen, die nicht offensichtlich waren

**a · Die Konfiguration wird SPÄT gelesen.** Gemessen: in Sages `index.html`
steht `assets/siegel-inhalt.js` in Zeile 4974, `sbkim-init.js` in 4987 — der
Klebstoff kommt danach. Ein Kanon, der den Wert beim Laden einfängt, fängt in
Sage `undefined`. Gelesen wird beim Injizieren.

**b · Ohne Konfiguration wird KEIN Knopf gebaut.** Ein Knopf, hinter dem nichts
liegt, ist schlimmer als ein fehlender — und einer mit Erklärung ist die
schlimmste Sorte.

**c · Die Herkunfts-Zeile steht ÜBER dem Feld**, gegen 19 von 20 Fassungen. Das
Feld wächst mit seinem Inhalt, und die Beschreibungen sind zweieinhalb- bis
viertausend Zeichen lang; eine Zeile darunter liegt unterhalb eines
bildschirmhohen Feldes. kim-hub-company hat das am 2026-09-10 an Klaus' Schirm
gemessen. **Die bessere Fassung gewinnt, nicht die Mehrheit.**

---

## 3 · Die Texte — vorbereitet, aber ohne Wirkung

Schlüssellos: der deutsche Satz **ist** der Schlüssel. `TEXTE_DE` ist die
Daten-Tafel mit 76 Einträgen; `T()` fällt fail-soft auf Deutsch zurück.
Rangfolge `cfg.lang` → `<html lang>` → `de`.

**Tragende Zusicherung: OHNE EINSTELLUNG ÄNDERT SICH NICHTS.** Sie ist im
Browser gemessen, auch bei `<html lang="en">`.

Drei Wächter, und **der dritte ist der wichtigste** — die ersten beiden prüfen,
was da ist; nur der dritte prüft, was fehlt.

---

## 4 · ⚠ Was die Proben gefunden haben, und das Nachdenken nicht

| Fund | wo er herkam |
|---|---|
| **sechs Apps hatten gar kein `backupPrefix`** — ihr Sicherungs-Name stand hart im Wizard-Code | die Proben der Ziel-Repos |
| **das Verteil-Werkzeug zerlegte PWA Toolpoints `sw.js`** — es sprang nur über Zeilen, die mit `//`/`*` ANFANGEN, und traf eine Fortsetzungszeile eines Block-Kommentars | die Probe des Ziel-Repos |
| **derselbe Fehler ein zweites Mal beim Cache-Bump** — er las den Namen aus dem Kommentar und hätte jedem Nutzer einen vollen Neu-Download für nichts gekostet | beim Nachsehen nach dem ersten |
| **PWA Toolpoints Baustein-5-Wächter war blind** — er suchte `andockSwitchIdentity`, und das stand nur im KOPF-KOMMENTAR | der A18-Umzug |
| **vier eigene Gegenprobe-Fälle fingen aus dem falschen Grund** — sie nahmen einen `T()`-Aufruf weg, damit wurde sein Tafel-Eintrag tot, und Wächter 2 feuerte statt Wächter 3 | die Gegenprobe, beim Nachstellen |
| **drei Gegenprobe-Fälle maßen gar nichts** — der Wegwerf-Kopie fehlte `node_modules`, der Browser-Teil war „nicht lauffähig" | die Gegenprobe |
| **die Rangfolge der Sprache war ungemessen** — es gab keine Seite, auf der sich `cfg.lang` und `<html lang>` widersprechen | die Gegenprobe |
| **sieben tote Anker** in kim-hub-companys Gegenprobe | die Gegenprobe |
| **ein Wächter hing an einem Namen, der der Anfang eines anderen ist** — `refreshWizardIdentitiesAbgeschaltet` enthält `function refreshWizardIdentities` | die Gegenprobe |

**Merksätze, die dabei wieder zugeschnappt sind:** *Hinzufügen statt Ändern,
sonst feuert der Nachbar-Wächter zuerst* · *ein Wächter, der den Namen im
Erklär-Kommentar findet, misst nichts* — und **einmal andersherum**: ein
Kommentar hat einen tadellosen Code angeklagt · *wer Code bewegt, bewegt Anker
mit*.

---

## 5 · Der Rollout — und warum ein Werkzeug statt neunzehn Handgriffe

`tools/wizard-trennen.mjs` macht in einem Nachbar-Klon aus einer Datei zwei:
Konfiguration bleibt, Kanon kommt daneben, jede Einbindung bekommt eine
Schwester, der Cache-Bump nur dort, wo die Datei wirklich im Vorrat steht.

⚠ **PROBEN FASST ES NICHT AN.** Eine Zeile in einem Wächter sieht aus wie eine
Einbindung und ist eine **Zusicherung**: mal muss sie mitwandern, mal auf die
neue Datei zeigen, mal auf beide. Sie werden **gemeldet** und von Hand
nachgezogen. Das war keine Vorsicht, sondern nötig — in acht Repos hing daran
echte Arbeit.

`tools/wizard-trennung-pruefen.mjs` misst das Ergebnis je Repo **im echten
Browser**: die Konfiguration der App + der Kanon ergeben zusammen ein
vollständiges Werkzeug mit der **eigenen** Beschreibung im Feld.

---

## 6 · Gemessen

| | |
|---|---|
| Sage · `node tests/run_alle.mjs` | **105 grün · 0 rot · 0 nicht lauffähig** |
| `tests/smoke_kanon_wizard.mjs` | **46 grün** (Quelltext **und** Browser) |
| `tests/gegenprobe_kanon_wizard.sh` | **24 gefangen · 0 durchgerutscht · 0 tote Anker** |
| **jeder der 19 Knoten im Browser** | **8 Prüfungen grün**, PWA Toolpoint 16 (zwei Knoten) |
| `kanon-verteilen.mjs --nur 16b` | **19 Kopien · alle gleich · 0 hängen zurück** |

Die letzte Zeile ist der Sinn der Arbeit: eine Änderung am Wizard kostet ab
jetzt **eine** Datei und **einen** Befehl.

---

## 7 · Was offen bleibt

1. **Die Übersetzung** — `TEXTE.en` füllen. Der Rahmen steht, die Tafel auch.
2. **Klaus' Browser-Sichttest** am Gerät. Nicht ersetzbar; headless ist die
   Logik bewiesen, nicht das Gefühl.
3. **Die 44 Kanon-Dateien**, die netzweit zurückhängen — weiterhin gemeldet und
   nicht nachgezogen (je Generationen-Sprung ein Probenlauf im Ziel-Repo).
4. **A11, A15, B4, B6** aus `docs/PLAN_SEMANTIK_KRYPTO.md` unberührt.
