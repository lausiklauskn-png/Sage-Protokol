# Schulungs-Unterlagen — die Quelle liegt hier

**Was hier liegt, ist das Original.** Was auf einer Seite veröffentlicht wird, ist
eine **Kopie** davon. Reift die Unterlage, wird sie **hier** gepflegt und neu
kopiert — nicht in der veröffentlichten Fassung abgewandelt. Sonst entstehen zwei
Stände, und der zweite sieht aus wie der erste.

| Datei | Was es ist |
|---|---|
| `EU_AI_Act_Art4_KI_Schulung.html` | Interne KI-Kompetenzschulung nach **Art. 4 EU AI Act**, für Firmen. Eine einzige Datei: Schulungstext (10 Abschnitte) · Wissenstest mit 15 Fragen und Auswertung · Teilnahmebescheinigung zum Ausdrucken · Lösungsschlüssel. Stand der Unterlage: **20.08.2026**. |

## Was an dieser Datei gemessen ist (2026-09-17)

- **228 Zeilen, 34 093 Bytes**, `md5 7640d7a132b36ebf52ddd7d051646ca2`.
  ⚠ **Bis zum 2026-09-17 stand hier `cc9f4b2b…` bei 190 Zeilen** — die Fassung, wie
  Klaus sie geschickt hat. Geändert wurde seitdem **nur der Druck-Umbruch**, siehe
  unten; am Text der Schulung, am Test und an der Bescheinigung ist nichts angefasst.
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
