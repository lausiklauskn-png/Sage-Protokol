# Pflege-Liste — gefunden, benannt, nicht verfolgt

**Wofür diese Datei da ist (Klaus 2026-09-16).** Wörtlich:

> *„du findest immer wieder neue Punkte, das sollten wir dann angehen in einer
> Pflegesitzung. Merk dir die Punkte, schreib sie auf."*

Unterwegs kommt immer etwas dazu. Sages Tafel sagt dazu: **mitziehen heißt nicht
abbrechen** — ein echter Fund wird aufgeschrieben und eingereiht, das Ziel läuft
weiter. Bis heute fehlte der Ort, an dem er eingereiht wird; er landete im
Übergabeprotokoll der Sitzung, die ihn gemacht hat, und damit dort, wo ihn nur
sucht, wer ohnehin schon davon weiß.

**Die Regel:** wer einen Fund macht, der nicht zum Auftrag der Sitzung gehört,
trägt ihn **hier** ein — mit Datum, Fundstelle und dem, was **gemessen** ist.
Er wird **nicht** nebenbei repariert. Eine Pflege-Sitzung arbeitet die Liste ab
und hakt ab, was erledigt ist; erledigte Punkte bleiben mit ihrem Datum stehen.

⚠ **Was hier steht, ist ein Befund, kein Auftrag.** Ob und wann etwas davon
gebaut wird, entscheidet Klaus.

---

## Offen

### 1 · `npm test` in Privat-Brain bricht vor dem Ende ab

**Gemessen 2026-09-16.** `tools/e2e-siegel.mjs` hat **vier vorbestehende Rote**
(Andock-Wizard-Injektion) — mit gleicher Stichprobe vor und nach der
Zweisprachigkeits-Arbeit gemessen, **Zeile für Zeile identisch**, also nicht von
dort. Die Kette hängt an `&&`, deshalb laufen die **drei Proben dahinter gar
nicht**. Einzeln gefahren sind sie grün:

| Probe | |
|---|---|
| `e2e-pinnwand` | 57 grün |
| `e2e-pinnwand-call` | 21 grün |
| `e2e-pinnwand-mikrofon` | 15 grün |

*Der Preis einer roten Probe ist nie die rote Zeile, sondern das, was daneben
nicht mehr gemessen wird* — 93 Zusicherungen, die niemand fährt.

**Was zu tun wäre:** die vier Roten am Wizard aufklären; bis dahin die Kette so
hängen, dass eine rote Probe die folgenden nicht mit stilllegt.

### 2 · BookLedgerPro: der Cosinus liegt um −0,001525 daneben

**Gemessen 2026-09-16** in der Briefkasten-Runde. Sechs von sieben Gegenstellen
reproduzieren den Registerwert exakt; BookLedgerPro weicht um diesen Betrag ab.
Der Grund ist **nicht geklärt** — der Klon ist flach, und was hinter der
Abschneide-Grenze liegt, sieht die Prüfung nicht.

**Was zu tun wäre:** `git fetch --unshallow`, dann die Spore-Generationen
vergleichen. *Eine ungeklärte Abweichung, die klein ist, sieht genauso aus wie
eine, die man verstanden hat.*

### 3 · Rezeptbuch und Mixarium führen Sage noch als `verified-spore`

**Gemessen 2026-09-16.** Beide haben Sage im Juli auf `verified-spore`
herabgestuft. Gegen die heute committeten Sporen liegen beide **über der
Schwelle** (Rezeptbuch 0.874048, Mixarium 0.883142) — die Herabstufung ist
überholt. Die Bitte um reziproke Neu-Einstufung steht seit dem 2026-09-16 in
`sbkim/SIGNAL.json` (seq 90) und in beiden Postfächern.

**Was zu tun wäre:** nichts von Sages Seite — die Gegenstellen sind am Zug. Der
Punkt steht hier, damit die nächste Briefkasten-Runde nachsieht, ob es
geschehen ist, statt ihn neu zu entdecken.

⚠ **Und die Zahl misst die ABGELEGTE Spore**, nicht die im Raum. Wer den
Netz-Auftritt beurteilt, braucht einen Mycel-Mitschnitt — `sbkim/spore.json` ist
Ablage und Beleg, kein Sender.

### 4 · family-project: `smoke_hintergrund` flattert

**Beobachtet 2026-09-16**, nicht systematisch nachgestellt. Die Probe war in
einem Lauf rot und einzeln gefahren grün. *Nicht reproduzierbar ist kein
Freispruch* — die Ursache stand in den bisherigen Fällen dieser Art immer im
Code, meistens als Warten auf die Uhr statt auf die Bedingung.

**Was zu tun wäre:** den Wartepunkt ansehen und fragen, worauf er wartet —
Sorte A (etwas kommt) gehört auf eine Bedingung, Sorte B (etwas bleibt aus)
braucht eine verstreichende Frist.

### 5 · Die Auswertung der Forschungs-Vorhersagen steht an

**Gemessen 2026-09-16.** `Kimhub/forschung/sitzungen.json` steht bei **23
Sitzungen** und 353 Befunden. `forschung/METHODE.md` § 6 legt fest:
*„Ausgewertet wird bei **zwanzig** Sitzungen, vorher nicht."* Die Schwelle ist
überschritten.

Gerechnet halten beide vorregistrierten Vorhersagen — V1 (Anteil `regel` unter
`hinsehen`): **15,0 % gegen 43,6 %**; V2 (blinde Wächter nicht unter 10 %):
**43,9 %**.

**Was zu tun wäre:** nichts von selbst. *Die Rechnung ist nicht die Auswertung* —
wie das Ergebnis formuliert wird und was es für Paper A heißt, entscheidet
Klaus. Der Punkt steht hier, damit die Schwelle nicht unbemerkt verstreicht.

---

### 6 · PWA Toolpoint: der Prüfer selbst fehlt in der Sitemap und meldet keinen Service-Worker an

**Gemessen 2026-09-17.** `sitemap.xml` nennt Start, Impressum, Datenschutz (und jetzt
`ki-schulung.html`) — `auslieferungspruefer.html` nicht. Und die Seite enthält kein
`serviceWorker.register`; `tools/eigenschaften-pruefen.mjs` setzt deshalb `offline:
false` auf seine Karte, während der Text „läuft auch ohne Netz" verspricht. Beides
stimmt auf seine Weise (der Worker gilt für die ganze Adresse, sobald die Startseite
ihn einmal angemeldet hat) — auf der Karte sieht es nach einem Widerspruch aus.

**Was zu tun wäre:** die Anmeldung wie in `index.html` und `ki-schulung.html` in die
Prüfer-Seite, die Adresse in die Sitemap, dann den nächtlichen Eigenschaften-Lauf
nachsehen.

### 7 · Der Auslieferungsprüfer liest „Wort:" in `meta content` als Adress-Schema

**Gemessen 2026-09-17** an `og:image:alt="KI-Schulung: ein Blatt mit Siegel"`: beide
Fassungen (JS und Python) melden `FREMDE-ADRESSE … holt von aussen: ki-schulung:`.
Ein Doppelpunkt in einem beschreibenden Text ist kein Schema. Für die neue Seite
umformuliert; der Prüfer ist unverändert.

**Was zu tun wäre:** in `assets/pruefer.js` **und** dem Python-Zwilling in Kimhub den
Adress-Fund an ein echtes Schema binden (`^[a-z][a-z0-9+.-]*://` oder eine
bekannte Liste), mit Gegenprobe in beide Richtungen — Zwei-Fassungen-Regel.

### 8 · PWA Toolpoint: die Messwerte des Prüfers stehen seit dem 2026-09-08 fest

**Gemessen 2026-09-17.** Der Eintrag `eigen-toolpoint-pruefer` trägt `messung.datum:
2026-09-08`. `tools/messwerte-holen.mjs` sucht in family-projects `messreihe.json`
nach genau dieser Kennung; das Messziel dort ist seit dem 2026-09-13 abgeschaltet
(„wird im Marktplatz gemessen"), und die Markt-Messung läuft unter
`markt-auslieferungspruefer` — eine Kennung, die Toolpoint nicht kennt. Die Zahl auf
der Karte altert also still. Für die Schulung wurde deshalb ein eigenes Ziel
`eigen-ki-schulung` angelegt.

**Was zu tun wäre:** entweder das Ziel wieder einschalten (dann die Doppelung in der
Rangliste in Kauf nehmen) oder `messwerte-holen.mjs` einen zweiten Namen je Eintrag
lesen lassen.

### 9 · family-project: `smoke_wortkarte` ist an eine Browser-Fassung gebunden

**Gemessen 2026-09-17.** Die Probe stirbt mit `Executable doesn't exist at
…/chromium_headless_shell-1243/…`; installiert ist 1194, und `npx playwright install`
darf in dieser Umgebung nicht laufen. Alle anderen Browser-Proben nehmen den
vorhandenen Browser. Die Probe ist damit **nicht lauffähig, nicht rot** — aber sie
wird auch von niemandem gefahren.

**Was zu tun wäre:** den Browser wie in `smoke_all.mjs` wählen (`executablePath`
aus der Umgebung), damit die Probe auf jeder Maschine dasselbe misst.

## Erledigt

### ✅ Rezept-Export trägt die Spur — 2026-09-16

Klaus' Bitte („wenn ich es wieder einfüge, soll die Spur mit drin bleiben") ist
in allen drei Apps gebaut: Herkunfts-Kette am Rezept, stabile Kennung (`r.uid`),
beide Import-Wege durch eine Tür, und der Import sagt, was unsichtbar mitkommt.
Mein Rezeptbuch, Muttis Rezeptbuch und Mein Mixarium, jeweils gemessen und
gemergt.
