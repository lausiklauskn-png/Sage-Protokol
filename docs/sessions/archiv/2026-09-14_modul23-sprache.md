# Übergabeprotokoll 2026-09-14 — Modul 23 UI spricht Englisch

**Rolle:** Haupt-Sitzung, Bau.
**Zweig:** `claude/family-projekt-translation-issues-yqbpth`
**PR:** [#986](https://github.com/lausiklauskn-png/Sage-Protokol/pull/986), gemergt als `8de9cf5`

---

## Anlass

Klaus hat auf **family-projekt.de** vier Übersetzungs-Befunde gemeldet und in
einer späteren Runde den eigentlichen Kern genannt: die Seite zeigte kurz
Englisch und sprang auf Deutsch zurück, weil Chrome bei ihm automatisch
übersetzt. Der Sprachriegel dagegen wurde in **family-project** gebaut (PRs
#294–#296, alle gemergt) und hält — belegt durch seinen Bildschirmfoto-Sichttest.

Danach blieb sichtbar: die Seite stand auf Englisch, die **SBKIM-Fenster darin
blieben deutsch**. Auf die Frage nach dem Umfang hat Klaus ausdrücklich
**„gestuft: erst Sage, dann netzweit"** gewählt.

## Was gebaut wurde

Ein **schlüsselloser** Sprach-Haken in `src/modules/23_rendezvous_ui.js`:

```js
var cfg = { …, lang: null };
var TEXTE = { en: { /* 195 Einträge, der deutsche Satz als Schlüssel */ } };

function sprache() {
  if (cfg.lang === "de" || cfg.lang === "en") return cfg.lang;   // was die App sagt
  try { var l = String((doc().documentElement.lang)||"").slice(0,2).toLowerCase();
        if (l === "en") return "en"; } catch (_e) {}
  return "de";
}
function T(de) {
  if (sprache() !== "en") return de;
  var w = TEXTE.en;
  return (w && Object.prototype.hasOwnProperty.call(w, de)) ? w[de] : de;
}
```

Drei Eigenschaften, jede mit Grund:

- **Fail-soft.** Fehlt ein Eintrag, steht der deutsche Satz da. Nie ein leerer
  Knopf, nie ein `undefined` im Fenster — ein eigener Wächter misst genau das.
- **Die App entscheidet zuerst** (`init({lang:"en"})`), `<html lang>` ist die
  Rückfalllinie. Eine App, die ihre Sprache selbst verwaltet, wird nicht von der
  Seite überstimmt.
- **`_meta` sagt, was gilt** (`lang`, `langKeys`) — sonst wäre von aussen nicht
  zu sehen, in welcher Sprache das Fenster gerade spricht.

Die byte-gepinnten Bauvorlagen `sbkim-bundle/modules/23_rendezvous_ui.js` und
`sbkim-bundle-voll/modules/23_rendezvous_ui.js` wurden in derselben Bewegung
nachgezogen. **Ohne das wären `smoke_bauvorlagen` und `smoke_bundle_connect` zu
Recht rot geworden** — beide wurden vorher auf `origin/main` als grün belegt,
damit ein rotes Ergebnis nicht fälschlich dieser Arbeit zugerechnet wird.

## Gemessen

| | |
|---|---|
| `tests/smoke_bau23_sprache.mjs` (neu, 16 Haken) | **16 bestanden, 0 fehlgeschlagen** |
| `node tests/run_alle.mjs` | **101 Proben — 101 grün, 0 rot, 0 nicht lauffähig** |
| `tests/gegenprobe_bau23_sprache.sh` (neu, 7 Fälle) | **7 gefangen · 0 durchgerutscht · 0 tote Anker** |
| Aufrufstellen · Schlüssel | 210 `T("…")` · **195** eindeutig, alle übersetzt |
| Modul-Umfang | 2424 → 2872 Zeilen |

Der Rückgabewert stammt jeweils aus der Prüfung selbst, nicht aus einer Pipe.

**Bauart der Gegenprobe:** jeder Fall läuft an einer **Wegwerf-Kopie**
(`mktemp -d`). Ein abgebrochener Lauf hinterlässt damit kein sabotiertes Modul
im Depot, und es braucht keinen Umgebungs-Schalter, mit dem sich die Probe
stilllegen liesse. `git status` war vor und nach dem Lauf unverändert.

## ⚠ Der Preis des Verfahrens, benannt

**Wer einen deutschen Satz ändert, verliert still seine Übersetzung.** Dagegen
steht der Wächter, der **in beide Richtungen** misst: jeder Schlüssel des
Wörterbuchs muss als `T("…")` im Code vorkommen, und jedes `T("…")` im Code muss
einen Schlüssel haben. Ohne die zweite Richtung wäre ein neu hinzugefügter
Aufruf ohne Übersetzung unsichtbar.

## ⚠ Drei eigene Fehler, alle von der Gegenprobe entlarvt

**1 · Zwei Fälle fingen aus dem falschen Grund.** „Ein `T()`-Aufruf ohne
englische Fassung" **änderte** einen bestehenden Aufruf — und tötete damit
zugleich dessen Schlüssel. Der Nachbar-Wächter („jeder Schlüssel kommt im Code
vor") feuerte zuerst, der gemeinte blieb ungemessen. Jetzt wird **hinzugefügt**
statt geändert. Der zweite nahm einen Text, den auch der Laufzeit-Teil prüft;
genommen wird jetzt einer, den nur der Kopie-Wächter sieht.

> **Eine Sabotage muss genau das treffen, was der Wächter misst — und die rote
> Zeile muss seinen Namen tragen.**

**2 · Ein Wächter war zu eng, und der Fall rutschte durch.** „Keine Übersetzung
ist nur eine Kopie" verlangte Umlaute oder eines von sechs Stoppwörtern.
*„Ziehen zum Verschieben"* hat beides nicht. **Gemessen statt geraten:** von 195
Paaren ist genau **eines** legitim wortgleich — das Auslassungszeichen, drei
Punkte sind in beiden Sprachen dieselben. Also keine Wortliste, sondern eine
Bedingung, die genau das trifft:

```js
const gleich = paare.filter((m) => m[1] === m[2] && /\p{L}/u.test(m[1]));
```

**3 · Ein Wächter fand seinen Fund im eigenen Erklär-Kommentar.** Er suchte in
einem Zeichenfenster und traf das Wort in der Erklärung darüber. Gemessen wird
jetzt der **Block**, Kommentare abgezogen. Dieselbe Falle steht in
`docs/LEHREN.md` bereits — *ein Wächter, der im Erklär-Kommentar fündig wird,
misst nichts.*

## Was NICHT getan wurde

- **Das Ausrollen in die 16 Apps.** Klaus' zweite Stufe, eigene Sitzung. Im Netz
  stehen **drei Modul-Generationen** (2249 · 2279 · 2424 Zeilen); nur
  PWA-Toolpoint und kim-hub-company entsprachen vor dieser Arbeit Sage. **Ein
  Drift-Guard sagt „unverändert", nicht „aktuell".** Skill:
  `netzweiter-modul-rollout`.
- **`16_siegel.js` (47 Texte)** und **`17_floating_widget.js` (19 Texte)** —
  das Siegel-Fenster und die LEBT/VERKEHR/FREMD/SIEGEL-Lampen bleiben deutsch.
- **`tests/manual_check.html` im Browser** — ungeprüft, weil diese Sitzung
  keinen Browser-Lauf gefahren hat; die Modul-Änderung ist additiv und von 101
  Proben gedeckt, aber das ersetzt den Sichttest nicht.
- **Klaus' Browser-Sichttest** steht aus. Dass die englischen Texte im Fenster
  wirklich so stehen, sieht nur ein Browser.

## Offene Frage an die nächste Sitzung

Beim Ausrollen ist **vor** dem Kopieren je App zu messen, welche Generation dort
liegt — eine Kopie über eine ältere Generation nimmt deren Stand mit, ohne dass
der Drift-Guard etwas dazu sagt.

---

# ⚠ NACHTRAG desselben Tages — der Wächter war blind für 52 Anzeigetexte

**PR [#988](https://github.com/lausiklauskn-png/Sage-Protokol/pull/988), gemergt als `d71a678`.**
**Die Zahlen oben sind damit überholt:** dort stehen 195 Schlüssel und 16/16;
gültig sind **237** und **17/17**.

## Der Befund, und wie er gefunden wurde

Im echten Fenster stand unter lauter englischen Zeilen **„Speicher dauerhaft:
unbekannt"**. Gefunden hat es **kein Wächter**, sondern ein Browser-Lauf, der
das Modul allein lud und den sichtbaren Text auslas.

Die beiden Wächter aus dem Hauptteil waren dabei **grün — und zu Recht.** Sie
messen das Wörterbuch gegen die `T()`-Aufrufe, in beide Richtungen, lückenlos.
**Ein Text, der gar nicht durch `T()` geht, kommt in keiner der beiden Mengen
vor.** Er war für sie unsichtbar.

> **Ein Wächter misst, was er misst — nicht, was man von ihm erwartet.**
> Die Blindstelle lag nicht in der Ausführung, sondern in der Frage.

Nachgemessen: **52 Stellen.** Knöpfe (`Abbrechen`, `🤝 Andocken`,
`📥 Einspielen`, `🔒 im Tresor merken`), Kurzinfos (`ja`/`nein`/`unbekannt`,
`an`/`aus`) und Fehlerzeilen (`✗ Fehler: `, `✗ Verbinden fehlgeschlagen: `).
Alle umhüllt, **42 neue Wörterbuch-Einträge**.

## Der neue Wächter misst Anzeige-Stellen

Eine Suche nach „jedem Literal mit einem Buchstaben" fand **627 Treffer**, fast
alle CSS, Tag- und Ereignis-Namen. **Eine Warnung, die man nicht mehr los wird,
ist keine Warnung.** Gemessen werden deshalb Zuweisungen an
`textContent`/`title`/`placeholder`/`alt` und das dritte Argument von `el()`.

**⚠ Benannte Grenze:** ein Text, der über einen selbstgebauten Umweg in den DOM
kommt, fällt nicht auf. Zweite Verteidigungslinie, keine
Vollständigkeits-Garantie.

## ⚠ Drei eigene Fehler beim Bauen des Wächters

**1 · Sein erster Filter verbot das Richtige.** Er hielt jedes Literal mit einem
Doppelpunkt für CSS — und warf damit `"🧠 KI-Richter: "` und `"✗ Fehler: "`
heraus, also ausgerechnet echte Anzeigetexte. CSS erkennt man an `;` oder an
`eigenschaft: wert`, nicht am blossen Doppelpunkt. Ein Gegenprobe-Fall nagelt
seitdem die **Gegenrichtung** fest: fällt der Filter ganz weg, meldet der
Wächter CSS-Zeilen als Fehler.

**2 · Der Scanner nahm die Wörterbuch-Grenze falsch.** Er suchte `\n  };`,
das Wörterbuch endet auf `\n  } };` — dadurch übersprang er **360 Zeilen echten
Code**, und drei Stellen blieben im ersten Durchgang unentdeckt.

**3 · Fall C1 fing aus dem falschen Grund.** Er nahm einer Zeile ihr `T()` —
damit verlor zugleich ihr Schlüssel seine Fundstelle, „jeder Eintrag hat eine
Fundstelle im Code" fiel zuerst, und der gemeinte Wächter blieb ungemessen.
Jetzt wird **hinzugefügt** statt geändert. **Derselbe Fehler wie in A2, zum
zweiten Mal an einem Tag.**

## Gemessen

| | |
|---|---|
| `tests/smoke_bau23_sprache.mjs` | **17 bestanden, 0 fehlgeschlagen** |
| `node tests/run_alle.mjs` | **101 Proben — 101 grün, 0 rot, 0 nicht lauffähig** |
| Gegenprobe (9 Fälle) | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |
| Wörterbuch | 195 → **237** Schlüssel |
| Bauvorlagen | **ein** md5 für alle drei Kopien |

**Im Browser belegt** (Chromium, Modul allein geladen, `lang="en"`): statt
„Speicher dauerhaft: unbekannt" steht **„Storage permanent: unknown"**; auf
Deutsch unverändert; keine Seitenfehler.

## Was das für das Ausrollen heisst

Die 16 Apps bekommen damit **237** Texte statt 195. Wer die Fassung aus dem
Hauptteil dieses Protokolls kopiert hätte, hätte ein Fenster ausgerollt, das an
52 Stellen weiter deutsch spricht.
