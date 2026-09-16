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

---

## Erledigt

### ✅ Rezept-Export trägt die Spur — 2026-09-16

Klaus' Bitte („wenn ich es wieder einfüge, soll die Spur mit drin bleiben") ist
in allen drei Apps gebaut: Herkunfts-Kette am Rezept, stabile Kennung (`r.uid`),
beide Import-Wege durch eine Tür, und der Import sagt, was unsichtbar mitkommt.
Mein Rezeptbuch, Muttis Rezeptbuch und Mein Mixarium, jeweils gemessen und
gemergt.
