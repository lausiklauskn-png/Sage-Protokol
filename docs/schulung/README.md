# Schulungs-Unterlagen — die Quelle liegt hier

**Was hier liegt, ist das Original.** Was auf einer Seite veröffentlicht wird, ist
eine **Kopie** davon. Reift die Unterlage, wird sie **hier** gepflegt und neu
kopiert — nicht in der veröffentlichten Fassung abgewandelt. Sonst entstehen zwei
Stände, und der zweite sieht aus wie der erste.

| Datei | Was es ist |
|---|---|
| `EU_AI_Act_Art4_KI_Schulung.html` | Interne KI-Kompetenzschulung nach **Art. 4 EU AI Act**, für Firmen. Eine einzige Datei: Schulungstext (10 Abschnitte) · Wissenstest mit 16 Fragen und Auswertung · Teilnahmebescheinigung zum Ausdrucken · Lösungsschlüssel. Stand der Unterlage: **20.08.2026**. |

## Was an dieser Datei gemessen ist (2026-09-17)

- **233 Zeilen, 34 498 Bytes**, `md5 d5f140110a1ea4404a59b636e6fb92ed`.
  ⚠ **Bis zum 2026-09-17 stand hier `cc9f4b2b…` bei 190 Zeilen** — die Fassung, wie
  Klaus sie geschickt hat. Geändert wurden seitdem der **Druck-Umbruch** und die
  **Sprache** (Umlaute, Gedankenstriche), siehe unten. Inhaltlich ist eine einzige
  Zahl berichtigt: die Überschrift des Wissenstests sagte **15 Fragen**, im Formular
  und in der Auswertung stehen **16**. Am Schulungstext, an den Fragen selbst und an
  der Bescheinigung ist nichts angefasst.
- **Keine Laufzeit-Abhängigkeit im Browser**: kein `<script src>`, kein
  `<link rel=stylesheet>`, keine Schriftart von außen. Alles steht in der Datei.
- **Zwei Verweise nach draußen**, beide `<a href>` und beide amtlich:
  `ai-act-service-desk.ec.europa.eu` und `digital-strategy.ec.europa.eu`. Das ist
  eine **bewusste Nutzer-Aktion**, kein Nachladen — Sages Versöhnung vom
  2026-06-21 deckt genau das.
- **Kein Personenbezug, kein Geheimnis.** Die Felder für Teilnehmer, Unternehmen
  und Datum stehen **leer**; gesucht wurde nach Mailadressen, Telefonnummern,
  `sk-…`- und `ghp_…`-Schlüsseln — nichts gefunden.
- Die Unterlage sagt **selbst**, was sie nicht ist: *„ersetzt keine
  Einzelfallprüfung"*. Dieser Satz gehört zu ihr und wird beim Kopieren nicht
  weggelassen.

⚠ **Eine ausgefüllte Bescheinigung kommt NIE ins Depot.** Sie trägt einen Namen
und eine Firma — genau das, was die Kein-PII-Regel meint. Wer die Unterlage
benutzt, druckt; wer sie pflegt, lässt die Felder leer.

## Die Druck-Umbrüche (Klaus 2026-09-17)

### Seite 1 und 2

Klaus, über den Ausdruck: *„rückst du den Punkt 2 … mit dem Unterstrich auf die
zweite Seite. Weil man den Bereich dann separat ausdrucken kann. Du veränderst keine
weitere Seite, nur die Seite 1 und 2."*

Vorher endete Seite 1 mit der **blossen Überschrift** „2. KI ist hilfreich – aber
nicht automatisch richtig" samt Unterstrich; der Abschnitt dazu begann auf Seite 2.

Zwei Regeln im Druck-Stil, beide gemessen:

| | |
|---|---|
| `.training h2{break-after:avoid}` | eine Überschrift bleibt bei ihrem Text. Das holt Punkt 2 auf Seite 2 — und gilt für **jede** Überschrift, also auch für die nächste, die einmal an einen Seitenrand rutscht |
| `.training h2.bogen2{margin-top:19px;…}` | die vier Überschriften des zweiten Bogens (Abschnitte 2–5) rücken etwas enger. **Der Platz kommt aus dem Bogen selbst, nicht aus Rand oder Schriftgrösse** — ein schmalerer Seitenrand hätte JEDE Seite verändert |

**Gemessen** (Chromium, A4, 14 mm Rand, alle vier Druck-Knöpfe, Seite für Seite als
Text verglichen):

| Druckweg | Ergebnis |
|---|---|
| Schulung | Seite 1 endet nach Abschnitt 1, Seite 2 beginnt mit Punkt 2 und endet mit derselben Zeile wie vorher. **Seiten 3–7 Zeile für Zeile unverändert** |
| Schulung + Bescheinigung (und Strg+P) | dasselbe, Seiten 3–8 unverändert |
| Bescheinigung allein | unverändert |
| Lösungsschlüssel | unverändert |

⚠ **Klaus' eigener Ausdruck hat NEUN Seiten, diese Messung sieben.** Sein Browser
druckt mit anderen Rändern. Die erste Regel trägt trotzdem: „Überschrift bleibt bei
ihrem Text" gilt bei jeder Seitenhöhe. Die zweite ist Feinarbeit an diesem Rand — wie
die Zeilen bei ihm im Einzelnen fallen, ist **nicht gemessen** und sieht nur er.

### Seite 3 und 4

Klaus, einen Schritt später: *„gehst du von dem Bereich Hochrisikoanwendung, den
schiebst du mit auf die nächste Seite 4. So, dass dann auf der Seite 4 steht
Hochrisikoanwendung, 8., 9. und 10."*

Vorher riss der Seitenwechsel den Bereich auseinander: Überschrift und Absatz standen
auf Seite 3, die interne Eskalationsregel begann auf Seite 4.

`.training .bogen4{break-inside:avoid}` hält die drei Teile zusammen — Überschrift,
Absatz und Eskalationsregel als **ein** Block. **Der Platz war da:** Seite 3 gibt fünf
Zeilen ab, Seite 4 nimmt sie auf, und die Seite dahinter beginnt ohnehin mit einem
erzwungenen Umbruch (der Wissenstest). Deshalb ändern sich auch hier nur zwei Seiten.

**Gemessen**, gegen die Fassung davor und gegen die Urfassung:

| | |
|---|---|
| Schulung | Seite 3 endet nach „Was ein Verstoß kostet", Seite 4 beginnt mit „Hochrisiko-Anwendungen" und endet mit derselben Zeile wie vorher. **Seiten 1, 2 und 5–7 unverändert** |
| Schulung + Bescheinigung, Strg+P | dasselbe, Seiten 5–8 unverändert |
| Bescheinigung, Lösungsschlüssel | unverändert |
| **am Bildschirm** | jede gemessene Position auf dem Pixel gleich (der Block-Rahmen kollabiert keine Abstände), Seitenhöhe 7934 px vorher wie nachher |

### Der Schluss als Fußnote

Klaus: *„setzt du Seite 8 mit auf Seite 7 unten … Quellen und Stand etwas höher …
oder als Fußnote kleiner geschrieben unten hin. Das ganze Dokument hat dann nur acht
Seiten insgesamt."*

„Quellen und Stand" samt Hinweis stand bei grösseren Seitenrändern allein auf einer
letzten, fast leeren Seite. Drei Regeln lassen es hochrücken und kleiner stehen:
`#result` kompakter, die Überschrift auf Fußnoten-Grösse, die beiden `.ref`-Absätze
auf 8,4 pt.

⚠ **Sie fassen NICHTS an, was vor dem Ergebnis-Feld steht**, und das ist der Grund
für den Zuschnitt: hätte ich die Testfragen gestrafft, wäre auf jede Wissenstest-Seite
mehr gepasst und die Seiten davor hätten sich mitverschoben.

⚠ **UND HIER WURDE KLAUS' SEITENRAND NACHGESTELLT, statt über ihn zu raten.** Sein
Ausdruck hat neun Seiten, die Messung bei 14 mm nur sieben — das Problem gibt es dort
gar nicht. Ausprobiert wurden 14 · 18 · 20 · 22 · 25 mm: bei **22 mm** entstehen
dieselben neun Seiten wie bei ihm. Genau dort wurde gemessen.

| Rand | vorher | nachher |
|---|---|---|
| 14 mm (diese Messung) | 7 | **7** — nur die letzte Seite anders gesetzt |
| 18 · 20 mm | 8 | **7** |
| **22 mm (Klaus' Ausdruck)** | **9** | **8** — Seiten 1–7 unverändert, Seite 9 fällt weg |
| 25 mm | 9 | 9 — reicht dort nicht |

*Eine Regel, die anderswo gemessen wurde, gilt unter den Bedingungen, unter denen sie
gemessen wurde.* Deshalb steht die Zeile für 25 mm mit da, statt weggelassen zu
werden.

⚠ **Der Lösungsschlüssel bleibt beim Drucken aus**, auch bei „Beides drucken" und
bei Strg+P — nur ein eigener Knopf holt ihn hervor. Das ist Absicht und steht als
Kommentar in der Datei: wer eine Unterlage austeilt, soll die Antworten nicht
versehentlich mitverteilen. **Wer am Druck-Stil baut, prüft das nach.**

## Wo sie veröffentlicht ist (2026-09-17)

| Ort | Rahmen | Kopie |
|---|---|---|
| PWA Toolpoint | `ki-schulung.html` (Eintrag `eigen-ki-schulung`) | `schulung/EU_AI_Act_Art4_KI_Schulung.html` — Prüfsumme in `tests/smoke.mjs` gepinnt |
| family-projekt.de | `werkzeuge/ki-schulung.html` (Karte + Markt-Eintrag `markt-ki-schulung`) | `schulung/EU_AI_Act_Art4_KI_Schulung.html` |

**Wer die Unterlage hier ändert, kopiert sie in beide Depots neu und zieht den Pin
in PWA Toolpoint nach** — so hinterlässt ein neuer Stand eine Spur, statt still
auseinanderzulaufen. Übergabeprotokoll:
`docs/sessions/archiv/2026-09-17_ki-schulung-veroeffentlicht.md`.

---

## Umlaute, Gedankenstriche und eine Zahl, die sich selbst widersprach (Klaus 2026-09-17)

Klaus nach dem Ausdruck: *„Du hast wieder viel zu viele Bindestriche eingefügt …
Und die Umlaute hast du nicht beachtet, die in ganz normaler Art und Weise
darstellen, wie zum Beispiel Lösungsschlüssel."* Er hat dabei eine Stelle beim
Namen genannt: *„Emotionserkennung am Arbeitsplatz und in Bildungseinrichtungen
— verboten"*.

Die Regel steht im Skill `menschlich-schreiben`: **höchstens ein Gedankenstrich
auf drei bis vier Absätze**, und Wichtiges wird fett, nicht angestrichen.

**Gemessen am sichtbaren Text**, nicht am Quelltext — also an dem, was ein Leser
wirklich sieht (`innerText` im Browser, samt Knopf-Beschriftungen, `title` und
Platzhaltern):

| | vorher | nachher |
|---|---|---|
| Gedankenstriche | **11** | **1** |
| Umschrift statt Umlaut | 2 (`Loesungsschluessel`, `fuer`) | **0** |

Der eine verbliebene Strich steht in den **Titeln der amtlichen Quellen**
(*„AI Literacy - Questions & Answers"*, *„Article 4 - AI literacy"*). Ein
zitierter Titel gehört wörtlich; ihn zu glätten hiesse, die Quellenangabe falsch
zu machen. **Benannte Grenze, kein Versehen.**

⚠ **UND MEINE EIGENEN KOMMENTARE MACHTEN DENSELBEN FEHLER.** Die sieben
Erklär-Blöcke zu den Druck-Umbrüchen waren durchgehend in Umschrift geschrieben
(`Ueberschrift`, `laesst`, `fuer`, `groesser`) und voller Striche. Sie sind mit
nachgezogen: in der ganzen Datei steht jetzt **keine Umschrift und kein
Gedankenstrich** mehr.

### ⚠ Die Zahl, die sich selbst widersprach

Beim Durchsehen fiel etwas auf, wonach niemand gesucht hatte: die Überschrift
sagte **„Wissenstest - 15 Fragen"**. Gemessen im Code:

| | |
|---|---|
| `<fieldset class="q">` im Formular | **16** |
| Einträge in der Auswertungs-Liste | **16** |
| `certScore` auf der Bescheinigung | **`____ / 16`** |

⚠ **UND DER KOMMENTAR DANEBEN VERSPRACH DIE KOPPLUNG, DIE ES NICHT GAB:**
*„Wer eine Frage ergänzt, ändert nur die Liste oben — Text, Zeugnis und Schlüssel
ziehen nach."* Zeugnis und Schlüssel zogen nach, die **Überschrift nicht** — sie
stand fest im Markup. Genau daraus ist die 15 geworden.

Jetzt zieht sie mit (`<span id="quizCount">`), gesetzt aus derselben `TOTAL`, aus
der auch Bescheinigung und Richtwert kommen. Der feste Wert bleibt als **Rückfall
ohne JavaScript** stehen — dieselbe Bauart wie bei `certScore`.

### Der Wächter misst die Übereinstimmung, nicht die Zahl

Eine festgenagelte 16 wäre bei der siebzehnten Frage genauso falsch wie die 15 es
war. `PWA-Toolpoint/tests/smoke.mjs` zählt deshalb die `<fieldset>` und hält die
Überschrift dagegen — und verlangt zusätzlich, dass die Kopplung im Code steht.

### Geprüft

| | |
|---|---|
| Toolpoint `npm test` | **927/927 · 0 rot** (vorher 923) |
| family-project `smoke_all` | **122/122 grün** |
| family-project `smoke_cache_version` | 12/12, Bump v121 → v122 erkannt |
| Gegenprobe, 4 neue Fälle | **4 gefangen · 0 durchgerutscht · 0 tote Anker**, jeder von Hand nachgestellt und die rote Zeile gelesen |

⚠ **Seitenumbruch gegengemessen, denn Textänderungen verschieben Zeilen.** Bei
**14 mm** (so druckt Klaus heute) bleiben es **7 Seiten, und jede Seitengrenze ist
identisch** — nur der Text in den Zeilen ist anders. Bei **22 mm** bleiben es
**8 Seiten**; dort rückt ein Aufzählungspunkt von Seite 5 auf Seite 4, weil die
geglätteten Sätze kürzer sind. Das steht hier, statt es zu verschweigen.
