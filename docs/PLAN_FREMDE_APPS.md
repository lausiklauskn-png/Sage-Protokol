# Fremde Apps auf den Marktplatz holen — Plan

**Angelegt:** 2026-08-12 · **Art:** Plan · **Auftrag:**
[`docs/sessions/BRIEF_PLAN_FREMDE_APPS_AUFNEHMEN.md`](sessions/BRIEF_PLAN_FREMDE_APPS_AUFNEHMEN.md)

> **Stand 2026-08-12: Schritt 1 (B1 · B2 · B3) ist gebaut** — PWA-Toolpoint
> PR #37. Damit ist die Voraussetzung erfüllt, unter der §3 ein Eintragen ohne
> Nachfrage überhaupt für vertretbar hält. Was noch fehlt, ist der Versuch
> selbst: **fünf Apps** (§7 Schritt 2). Details unten bei Schritt 1.

Grundlage: [`docs/PLAN_PILZ_WIRTSCHAFT.md`](PLAN_PILZ_WIRTSCHAFT.md) §1 · §8b ·
§8d · §9 · §11 · §12 · §15. Zielort: `PWA-Toolpoint`, nicht family-project.

---

## 0. Kurzfassung

Klaus will fremde PWAs vom Markt aktiv auf PWA Toolpoint holen: eintragen, dann
die Besitzer ansprechen. Motiv ist **Reichweite**, nicht Provision.

**Der Kern der Idee trägt.** §1 des Wirtschafts-Papiers hat gemessen: *null
fremde Marktplatz-Einträge, trotz gratis.* Warten hat nachweislich nicht
funktioniert. Wer nicht kommt, muss geholt werden — das ist die Fortsetzung des
Papiers, nicht sein Bruch.

**Vier Empfehlungen, kurz:**

| | Frage | Empfehlung |
|---|---|---|
| **A** | verlinken oder hosten? | **nur verlinken.** Hosten bringt in keinem Fall mehr und braucht eine Lizenz, die es meist nicht gibt |
| **B** | eintragen ohne zu fragen? | **ja, für einen Link-Katalog** — mit zwei kleinen Bauten davor (Bild-Pflicht lockern, „das ist meine App"-Grund) |
| **C** | wie ansprechen? | **GitHub-Issue, nicht E-Mail.** Wortlaut steht in §4 |
| **D** | „die ersten hundert kosten nichts"? | **Klaus hat entschieden: „Der Eintrag kostet nichts."** (§5) |

**Erster Schub: fünf Apps, nicht fünfzig** (Klaus' Entscheid). Dann wird
gezählt, dann erst skaliert.

---

## 1. Was schon dasteht — geprüft, nicht vermutet

Bevor irgendetwas geplant wird: der Marktplatz kann mehr, als der Auftrag
annimmt. Gelesen am 2026-08-12 in `PWA-Toolpoint`:

| Was | Wo | Stand |
|---|---|---|
| **Fremd-Eintrag als eigener Zustand** | `assets/karte.js` Z. 299–302 | `own: false` ⇒ der Link bekommt `rel="nofollow ugc"`. Der Marktplatz bürgt bei Google **nicht** für fremde Inhalte |
| **Weg raus, ohne Konto** | `assets/app.js` Z. 851 ff. | **„⚑ Melden" steht bereits an jeder Karte.** Nativer Dialog, kein Konto, keine E-Mail, mit `eintrag_id`, Bot-Falle, mailto-Rückfall |
| **Sperre von Hand** | `assets/config/wache-hand.json` | rot ⇒ Eintrag bleibt sichtbar, Grund steht dabei, **nur der Link geht aus** |
| **Karte ohne Bild** | `assets/karte.js` Z. 308–311 | rendert `<span class="img"></span>` — **kein kaputtes Bild, kein Layout-Sprung** |
| **Bild-Zwang** | `assets/studio.js` Z. 345 · 1005 | „Ohne brauchbares Bild wird das nicht übernommen." **Hier** sitzt die Pflicht, nicht im Renderer |
| Einträge heute | `assets/config/listings.js` | **14, davon 14 `own: true`.** Null fremde — genau die Null aus §1 |

Zwei Sätze, die den ganzen Plan verkürzen:

> **Der „sichtbare Weg raus", den Frage B verlangt, ist schon gebaut.** Es fehlt
> nur der passende Grund in der Auswahlliste.
>
> **Die Bild-Pflicht ist eine Studio-Regel, keine technische.** Der Marktplatz
> zeigt eine Karte ohne Bild sauber an. Das ändert Frage B von „geht nicht" zu
> „eine Zeile ändern".

---

## 2. Frage A — verlinken oder hosten

**Empfehlung: ausschließlich verlinken. Hosten nicht, in keinem Fall.**

Klaus hat beides gesagt („hochladen" · „das Repository von denen direkt bei mir
reinladen" · „sich eintragen lassen"). Das sind zwei verschiedene Vorgänge mit
sehr verschiedenen Folgen.

| | **Verlinken** (Katalog) | **Hosten** (Kopie) |
|---|---|---|
| Was liegt bei Klaus | Titel, Beschreibung, Link | **fremder Code** |
| Lizenz nötig | nein | **ja** |
| Aufwand je App | Minuten | Einbau, Updates, Ausfälle, Haftung |
| Wer haftet für Inhalte | der Anbieter | **auch Klaus** |
| Rückzug des Anbieters | Zeile löschen | Code entfernen, Adresse abschalten |

### Der Lizenz-Punkt, klar gesagt

Ein öffentliches GitHub-Repo **ohne Lizenzdatei ist nicht frei.** Es gilt „alle
Rechte vorbehalten". Ein **Fork auf GitHub** ist von den GitHub-Bedingungen
gedeckt — das Weiterveröffentlichen unter `pwa-toolpoint.de` ist es **nicht**.
Auch eine MIT-Lizenz ist keine Blankovollmacht: sie verlangt, dass der
Urheberrechts-Hinweis mitwandert.

### Gibt es überhaupt einen Fall, in dem Hosten mehr bringt?

Ich habe danach gesucht. Drei Kandidaten, alle fallen:

1. *„Die App ist tot, ich halte sie am Leben."* → das ist die schwierigste
   Lizenzlage überhaupt, weil niemand mehr da ist, der zustimmen könnte.
2. *„Schneller, weil auf meinem Server."* → die Messwerte gehören dann Klaus'
   Hosting, nicht der App. Der Marktplatz würde **seine eigene Leistung messen**
   und als fremde ausweisen. Das bricht die einzige Regel, die ihn trägt.
3. *„Damit sie im Mycel hängt."* → braucht kein Hosten. Der Anbieter behält
   seine Spore bei sich, der Marktplatz **liest** sie nur — genau so steht es im
   Kopf von `listings.js` (`sporeUrl`).

Bleibt: **verlinken.** Was Klaus gewinnt (Reichweite für den Anbieter,
Sichtbarkeit für den Markt), gewinnt er beim Verlinken vollständig. Das Hosten
fügt nur Pflichten hinzu.

> **Die eine Ausnahme, die keine ist:** wenn ein Anbieter von sich aus fragt
> *„kannst du das für mich hosten?"*, ist das keine Marktplatz-Frage mehr,
> sondern **Auftragsarbeit** — Weg ① aus §3 des Wirtschafts-Papiers, mit
> Vereinbarung, und ab dem ersten Euro Stufe 2.

---

## 3. Frage B — eintragen, ohne vorher zu fragen

**Empfehlung: ja — für einen reinen Link-Katalog, und erst nach zwei kleinen
Bauten.**

Ein Verzeichnis, das öffentlich Zugängliches auflistet und verlinkt, tut das,
was Verzeichnisse seit jeher tun. Es steht und fällt mit drei Bedingungen. Zwei
davon sind bereits erfüllt.

### Bedingung 1 — ein sofort wirksamer Weg raus ✅ fast fertig

**Steht schon:** „⚑ Melden" an jeder Karte, ohne Konto, ohne E-Mail-Adresse.

**Was fehlt:** die vier Gründe in `MELDE_GRUENDE` (`assets/app.js` Z. 851)
lauten *kaputt · anders · recht · sonstig*. **Keiner davon heißt „das ist meine
App".** Wer seinen Eintrag loswerden will, muss ihn heute unter „Etwas anderes"
melden — als wäre das eigene Eigentum ein Sonderfall.

→ **Bau 1: ein fünfter Grund, ganz oben.**

```
{ wert: "eigen", text: "Das ist meine App — bitte ändern oder entfernen." }
```

Dazu die Zusage im Dialogtext, dass eine solche Meldung **ohne Rückfrage und
ohne Frist** ausgeführt wird. Ein Weg raus, der eine Begründung verlangt, ist
keiner.

### Bedingung 2 — kein fremdes Bildmaterial ⚠ hier steckt der Konflikt

Der Auftrag nennt es richtig: `img:` ist im Schema **Pflicht**, und ein Logo
oder Bildschirmfoto einer fremden App ist deren Material.

**Der Konflikt ist kleiner als gedacht.** Gemessen:

- `karte.js` rendert ohne Bild ein **leeres Feld fester Größe** — kein
  Platzhalter-Symbol, kein kaputtes Bild, kein Sprung im Layout.
- `fundKandidaten()` verlangt `e.img`. Ein Eintrag ohne Bild kann also **nie
  „Fund der Woche"** werden. Das ist keine Panne, sondern richtig: ohne Bild
  taugt er nicht zum Herausstellen.
- Die harte Sperre sitzt **allein im Studio** (`studio.js` Z. 345 · 1005).

→ **Bau 2: `img` wird für Fremd-Einträge optional.**

| | heute | Vorschlag |
|---|---|---|
| Eigene Einträge (`own: true`) | Pflicht | **bleibt Pflicht** |
| Fremd-Einträge (`own: false`) | Pflicht | **darf leer bleiben** |
| Karte ohne Bild | rendert sauber | unverändert |
| Fund der Woche | braucht Bild | unverändert |

**Kein neutraler Platzhalter.** Ein generisches Ersatz-Symbol wäre eine
Behauptung über eine App, die niemand geprüft hat. Leer ist ehrlicher — und es
ist zugleich ein sichtbarer Anreiz für den Anbieter, sich zu melden und ein
eigenes Bild beizusteuern. Genau die Reaktion, die gemessen werden soll.

**Was erlaubt bleibt:** ein Bild, das der Anbieter **selbst** an einer Stelle
veröffentlicht hat, die dafür gemacht ist — das Icon aus seinem `manifest.json`,
das `og:image` seiner Seite. Beides ist dazu bestimmt, von anderen angezeigt zu
werden. Alles andere wartet, bis der Anbieter es schickt.

### Bedingung 3 — kein Anschein einer Partnerschaft ✅ steht

`own: false` ⇒ `rel="nofollow ugc"` ist bereits gebaut. Ergänzend gehört an die
Karte ein sichtbarer Satz, dass dieser Eintrag ein Katalog-Hinweis ist und keine
Zusammenarbeit — ein Wort wie **„eingetragen, nicht abgestimmt"**. Das ist
Textarbeit, kein Bau.

### Wofür das ausdrücklich NICHT gilt

Für gehostete Kopien. Siehe Frage A. Ohne Lizenz kein Hosten, mit oder ohne
Nachfrage.

---

## 4. Frage C — wie ansprechen

**Empfehlung: GitHub-Issue im Repo des Anbieters. Keine E-Mail aus einem
Impressum.**

### Die Warnung, unverkürzt

Unaufgeforderte Werbe-E-Mail fällt in Deutschland unter **§ 7 UWG**, auch von
Gewerbetreibendem zu Gewerbetreibendem. Drei Dinge, die dabei gern
missverstanden werden:

1. **Kostenlos ist trotzdem geschäftlich.** Ein Angebot, das dem eigenen Zweck
   dient, ist Werbung — und *Reichweite* ist ein eigener Zweck. Klaus hat das
   selbst so gesagt.
2. **Impressum-Adressen sind besonders heikel.** Ein Impressum besteht für die
   **rechtliche Erreichbarkeit**. Es ist kein Verteiler und wird von Gerichten
   auch nicht als einer gelesen.
3. **Fünfzig Anschreiben sind nicht fünfzig kleine Risiken.** Sie sind fünfzig
   Gelegenheiten für **eine** Abmahnung. Eine genügt, und sie ist teuer.

**Das ist keine Rechtsberatung.** Hier steht das Risiko und der sicherere Weg.
Ob und wie Klaus anschreibt, entscheidet er — bei Zweifel mit einem Anwalt
(§13 des Wirtschafts-Papiers).

### Die sauberen Wege

| Weg | Warum er trägt |
|---|---|
| **GitHub-Issue** im Repo des Anbieters | genau dafür veröffentlicht, öffentlich nachlesbar, zum Projekt statt ins Postfach |
| **Kontaktformular** auf seiner Seite | er hat den Kanal selbst geöffnet |
| **Mastodon / Forum**, wo das Projekt auftritt | öffentlich, widerruflich |
| **Er findet sich selbst** | die stärkste Variante — die Reaktion ist dann echt |

Der GitHub-Weg passt zusätzlich zur Sache: wer eine PWA auf GitHub Pages
veröffentlicht, hat sein Repo öffentlich gemacht und Issues offen gelassen. Das
ist der Ort, an dem über dieses Projekt geredet wird.

### Der Wortlaut — zum Kopieren

Vier Regeln stecken darin: **der Weg raus steht im ersten Absatz** · kein
Verkaufston · keine Bewertung der fremden App · und es wird **nicht behauptet,
dass etwas schon steht**, bevor es steht.

```markdown
**Titel:** Eintrag im PWA-Marktplatz — passt das für dich?

Hallo,

ich habe deine App in ein PWA-Verzeichnis eingetragen:
https://pwa-toolpoint.de/#<anker>

**Wenn du das nicht willst, klick auf der Karte „⚑ Melden" und wähle
„Das ist meine App".** Der Eintrag ist dann weg — ohne Rückfrage, ohne
Konto, ohne Frist. Du musst darauf nicht antworten.

Was dort steht: Name, deine eigene Beschreibung, ein Link auf deine Seite.
Kein Bild von dir, solange du keins schickst. Kein Code von dir liegt bei
mir — es ist ein Verzeichnis, keine Kopie.

Was der Marktplatz zusätzlich anzeigt: die Ladezeiten deiner Seite,
gemessen mit Google PageSpeed, mit Datum. Auch die schlechten. Bei allen
Einträgen gleich, auch bei meinen eigenen.

Der Eintrag kostet nichts. Sollte sich das je ändern, frage ich vorher —
niemand wird hier stillschweigend zahlungspflichtig.

Was ich davon habe, sage ich offen: das Verzeichnis wird nur etwas wert,
wenn etwas drinsteht. Was du davon hast, musst du selbst einschätzen —
ich verspreche keine Besucherzahlen, die ich nicht kenne.

Wenn du drin bleiben willst und die Beschreibung oder das Bild ändern
möchtest: derselbe Melden-Knopf, oder antworte hier.

Viele Grüße
Klaus
```

**Was bewusst fehlt:** keine Zahlen über Reichweite (es gibt keine) · kein
Kompliment über die fremde App (klingt gekauft) · kein „exklusiv" · kein „nur
noch" · keine Frist.

---

## 5. Frage D — „die ersten hundert kosten nichts"

**Diese Frage lief gegen Klaus' eigene Tafel und wurde ihm deshalb vorgelegt,
statt sie stillschweigend zu korrigieren.**

Der Widerspruch, kurz: `PLAN_PILZ_WIRTSCHAFT.md` §8d zieht die Grenze scharf —
*„sobald irgendwo ein Preis, ein Prozentsatz oder ein ‚jetzt eintragen' steht,
ist es Stufe 2"*, und Stufe 2 braucht die Gewerbeanmeldung **davor**. Der Satz
„die **ersten hundert** kosten nichts" sagt mit, dass es ab
hundertundeins etwas kostet. Das ist eine angekündigte Preisstruktur.

### ✅ Klaus' Entscheidung, 2026-08-12

> **„Der Eintrag kostet nichts."**

Damit bleibt alles in Stufe 1: keine Preise, keine Provision, kein Gewerbe
nötig, kein Graubereich. Der Satz sagt die Wahrheit über heute und verspricht
nichts über morgen.

**Die Zahl hundert ist damit nicht tot** — sie ist nur nicht mehr öffentlich.
Sie lebt weiter als **innere Messmarke**: der Punkt, an dem Klaus prüft, ob aus
dem Zeigen ein Handeln werden soll. Steht sie nirgends geschrieben, bindet sie
auch niemanden.

**Was das für den Anschreibe-Text heißt** (in §4 schon so gebaut): der Satz
lautet dort *„Der Eintrag kostet nichts. Sollte sich das je ändern, frage ich
vorher."* Das ist ehrlicher als ein Kontingent — und es hält Stufe 2 offen,
ohne sie anzukündigen.

---

## 6. Der Nebengedanke — wie weit sind wir vom bezahlbaren Modell weg?

Klaus' Zusatzfrage, beantwortet mit den Zahlen aus §9, nicht aus dem Gefühl.

**Bedarf: 2.000–3.000 € im Monat.**

| Weg | Was nötig wäre | Größenordnung | Reihenfolge laut §9 |
|---|---|---|---|
| ① Beteiligung an Partnerbetrieben | **2–3 Partner** | eine Handvoll Menschen | erreichbar, teilweise vorhanden |
| ② Wartung / Betreuung | **~100 Kunden** à ~20 €/Monat | überschaubar, über Jahre | erreichbar über Jahre |
| ③ Marktplatz-Provision | **400–500 Käufe/Monat** | Hunderte | **erst nach ① und ②** |
| ④ Jahresbeitrag | bei 50 €/Jahr: **500 zahlende Anbieter** | Hunderte | **erst nach ③** |

### Der Befund, unbeschönigt

Fünfzig Einträge sind **ein Zehntel** dessen, was Weg ④ bräuchte, um allein zu
tragen. Und Weg ④ steht laut §9 **hinter** ③, das wiederum hinter ① und ② steht.
Die Marktplatz-Idee wächst also auf den **zwei langsamsten** Geld-Wegen.

**Das heißt nicht, dass die Idee falsch ist.** Sie zahlt auf **Reichweite** ein
— und genau das hat Klaus selbst als sein Ziel benannt. Sie ist damit **kein
Abweichen vom Ziel, aber auch kein Schritt darauf zu.** Der Weg zum bezahlbaren
Modell läuft weiter über ① und ②.

### Steht heute Geld irgendwo?

**Nein.** Papier-Stand vom 2026-08-09, unverändert: *kein Geld eingenommen, nur
ein Spenden-Hinweis auf der Seite.* Auch Toolpoint selbst steht bei **null
Einnahmen** und trägt nach §8d bewusst keinen Preis.

### Welche offenen Entscheidungen aus §15 blockieren ① und ②?

| §15 | Blockiert | Kann Klaus das heute entscheiden? |
|---|---|---|
| **0** — wer macht Beauty's Bezahlvorgang | ① (der Shop wartet darauf) | **fast** — die Empfehlung steht (erprobter Anbieter, kein Eigenbau). Es fehlt nur die Wahl |
| **0b** — Umsatz, Rohertrag oder Gewinn | ① | **ja.** Empfehlung Rohertrag, die Daten liegen bereits vor |
| **4** — Preisform WorkFloh + Betreuung | ② | **ja** — es ist eine Zahl und eine Form, kein Bau |
| **5** — verfügbare Zeit im Monat | ② | **ja** — nur Klaus weiß es |
| 3 — Jahresbeitrag | ④ | nicht dringend, ④ ist der letzte Weg |

**Zwei davon kosten nur einen Satz** (0b und 5) und stehen seit dem 2026-08-09
offen. Sie blockieren die **schnellen** Wege, während dieser Plan hier den
**langsamsten** bedient.

### Wo stehen wir in den drei Stufen aus §8d?

**Mitten in Stufe 1 — und die Stufe ist selbst die Messung.** Die Seite steht,
zeigt Apps mit gemessenen Werten, hat ein Interesse-Formular ohne Preis. Was
fehlt, ist genau das, was dieser Plan liefern soll: **jemand, der reagiert.**

> Ein ehrlicher Hinweis zur Reihenfolge: §14 Punkt 7 sagt, der offene Markt
> komme *„erst wenn 1–5 stehen"*. Toolpoint ist vorgezogen worden. Das ist
> vertretbar — der Bau kostete fast nichts, weil er eine Kopie ist (§8b) — aber
> es ist eine bewusste Abweichung und steht hier, statt still zu bleiben. Sie
> ändert nichts an §9: die Reihenfolge des **Geldes** bleibt ① ② ③ ④.

---

## 7. Die Reihenfolge — klein anfangen, messen, dann erst skalieren

Aus §8d abgeleitet: *„kein Preismodell ohne Nachfrage. Erst messen, dann
verpflichten."* Hier heißt das: **keine fünfzig ohne gemessene Reaktion auf
fünf.** Klaus hat den ersten Schub auf **fünf Apps** festgelegt.

### Schritt 1 — zwei kleine Bauten ✅ **erledigt 2026-08-12** (PWA-Toolpoint PR #37)

| Bau | Was | Umfang |
|---|---|---|
| **B1** ✅ | fünfter Meldegrund `eigen`: „Das ist meine App — bitte ändern oder entfernen", ganz oben, mit der Zusage „ohne Rückfrage, ohne Frist" | `assets/app.js`, dazu Smoke + Gegenprobe |
| **B2** ✅ | `img` optional für `own: false` — im **Studio**, nicht im Renderer (der kann es längst) | `assets/studio.js`, Kopf von `listings.js`, Smoke + Gegenprobe |
| **B3** ✅ | Satz an der Fremd-Karte: „eingetragen, nicht abgestimmt" | Textarbeit in `karte.js` |

Vor B1/B2 ist ein Eintragen **nicht** vertretbar: der Weg raus wäre unvollständig
und die Bild-Frage ungelöst. **Diese Bedingung ist jetzt erfüllt.**

**Ein Befund aus dem Bau, der im Plan noch nicht stand:** „ganz oben" und
„vorausgewählt" waren dasselbe. Der Melde-Dialog gab schlicht dem *ersten* Grund
den Haken. Mit „Das ist meine App" an erster Stelle wäre jede Meldung, bei der
niemand etwas anklickt, zu einer **behaupteten Eigentümerschaft** geworden — und
genau die wird laut §3 ohne Rückfrage ausgeführt. Der Haken hängt seitdem an
einem eigenen Wert (`MELDE_STANDARD`), nicht mehr an der Position.

Geprüft: Smoke **495/495**, Gegenprobe **167 Wächter, 0 blind**. Klaus' Blick am
Tablet steht aus. **Es ist kein fremder Eintrag entstanden** — der Bau macht es
möglich, mehr nicht.

### Schritt 2 — fünf Apps aussuchen

Auswahl-Regeln, damit der erste Schub etwas aussagt:

- **öffentliches GitHub-Repo mit offenen Issues** (sonst gibt es keinen sauberen
  Ansprechweg — dann lieber überspringen)
- **läuft wirklich** (Seite erreichbar, installierbar)
- **fünf verschiedene Bereiche**, nicht fünfmal dasselbe — sonst misst man den
  Bereich statt die Idee
- **kein Bild übernehmen**, außer Manifest-Icon oder `og:image`
- **Beschreibung aus den eigenen Worten des Anbieters**, nicht neu erfunden

### Schritt 3 — messen lassen und ansprechen

Eintragen · nächtliche Messung mitlaufen lassen · **dann** je ein GitHub-Issue
mit dem Text aus §4. Nicht umgekehrt: wer anschreibt, bevor die Karte steht,
verweist ins Leere.

### Schritt 4 — zählen, nach zwei Wochen

Vier Zahlen, mehr nicht:

| Zahl | Was sie bedeutet |
|---|---|
| **wie viele antworten überhaupt** | ob der Kanal trägt |
| **wie viele bleiben drin** | ob das Angebot etwas wert ist |
| **wie viele wollen raus** | ob der Ton stimmt |
| **wie viele beschweren sich** | die einzige Zahl, die sofort alles stoppt |

**Die Abbruch-Regel, vorher festgelegt, nicht nachher:** *eine* Beschwerde, die
über „nimm es raus" hinausgeht, beendet den Versuch und wird mit Klaus besprochen.
Wer die Abbruchbedingung erst nach dem Ergebnis formuliert, formuliert sie so,
dass sie nicht eintritt.

### Schritt 5 — erst dann über den großen Schub entscheiden

Mit den vier Zahlen auf dem Tisch. Nicht vorher, und nicht auf Gefühl.

---

## 8. Was diese Sitzung NICHT entschieden hat

- **Kein Eintrag ist entstanden**, auch nicht probeweise.
- **Keine E-Mail ist geschrieben worden**, an niemanden.
- **Kein Code wurde geändert** — B1/B2/B3 waren Vorschläge und brauchten einen
  eigenen Bau-Brief. *(Nachtrag 2026-08-12: dieser Bau ist inzwischen gelaufen,
  siehe §7 Schritt 1. Der Satz beschreibt den Stand der Planungs-Sitzung, nicht
  den von heute.)*
- **Die Rechtsfrage bleibt offen.** §4 nennt das Risiko und den sichereren Weg.
  Ob Klaus E-Mails schreibt, entscheidet er, bei Zweifel mit einem Anwalt.
- **§15 Punkt 7** (Provisionshöhe im Klon) bleibt unberührt — er gehört zu
  Stufe 2 und ist hier nicht angefasst worden.

---

## 9. Belege

| Aussage | Fundstelle |
|---|---|
| null fremde Marktplatz-Einträge trotz gratis | `PLAN_PILZ_WIRTSCHAFT.md` §1 |
| drei Stufen, Grenze scharf, „kein Preismodell ohne Nachfrage" | ebenda §8d |
| 2.000–3.000 €/Monat, Reihenfolge ① ② ③ ④ | ebenda §9 |
| offene Entscheidungen 0 · 0b · 3 · 4 · 5 · 7 | ebenda §15 |
| der Klon kommt „erst wenn 1–5 stehen" | ebenda §14 Punkt 7 |
| „Hier stehen KEINE Preise und KEINE Provisionssätze" | `PWA-Toolpoint/assets/config/listings.js` Kopf |
| „⚑ Melden" ohne Konto, `zweck:"meldung"`, vier Gründe | `PWA-Toolpoint/assets/app.js` Z. 851 ff. |
| `own:false` ⇒ `rel="nofollow ugc"` | `PWA-Toolpoint/assets/karte.js` Z. 299–302 |
| Karte ohne Bild rendert leeres Feld | ebenda Z. 308–311 |
| Fund der Woche verlangt `e.img` | ebenda Z. 364–367 |
| Bild-Zwang sitzt im Studio | `PWA-Toolpoint/assets/studio.js` Z. 345 · 1005 |
| 14 Einträge, alle `own: true` | `PWA-Toolpoint/assets/config/listings.js`, gezählt 2026-08-12 |
| rot ⇒ Eintrag bleibt, Link geht aus | `PWA-Toolpoint/CLAUDE.md` § Die Ampel |

---

**Fortschreiben:** Wer einen Punkt entscheidet oder widerlegt, trägt es hier ein
(Datum + was jetzt gilt) und vermerkt es in `docs/PULS.md`. Dieses Papier bindet,
bis eine Messung es widerlegt.
