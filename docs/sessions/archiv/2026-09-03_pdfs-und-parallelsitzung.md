# 2026-09-03 · Die PDFs für Zenodo — und zwei Sitzungen am selben Auftrag

*Übergabeprotokoll. Bausitzung nach dem Brief
[`BRIEF_nach_papers_veroeffentlichung.md`](../BRIEF_nach_papers_veroeffentlichung.md).*

---

## ✅ DAS ZIEL IST ERREICHT

```
10.5281/zenodo.22277738
```

Veröffentlicht am 2026-09-03, Vorabdruck, Version 2.0, offen, CC BY 4.0.
Beide Sprachfassungen unter einer Nummer.

⚠ **Dieser Abschnitt ist nachgetragen.** Die Zeilen darunter entstanden am
Nachmittag, als der DOI noch offen war — sie stehen unverändert, weil sie den
Verlauf zeigen. Was sie über den DOI sagen, ist überholt; alles andere gilt.

**Was den Ausschlag gab, war ein Satz auf Zenodos eigener Seite**, den Klaus
auf einem Bildschirmfoto mitgeschickt hatte, das er aus einem anderen Grund
aufgenommen hatte:

> *„Reservieren Sie eine DOI … damit sie vor dem Hochladen in die Dateien
> eingefügt werden kann."*

Damit löste sich ein Henne-Ei-Problem auf, das die Sitzung vom Vortag nicht
benannt hatte: das Papier soll seinen DOI tragen, aber den gibt es erst nach
dem Veröffentlichen. Die Reihenfolge heißt: reservieren → eintragen → PDFs neu
bauen → hochladen → veröffentlichen.

### ✅ Von Klaus geprüft: der Link löst auf

`doi.org/10.5281/zenodo.22277738` führt auf den Zenodo-Eintrag. **Diese Sitzung
konnte es nicht selbst messen** — `doi.org` und `zenodo.org` sind aus der
Umgebung gesperrt (403 vom Egress-Proxy). Die Gegenprobe kam von Klaus, und
ohne sie stünde hier eine Behauptung.

### Und es sind ZWEI DOIs

```
10.5281/zenodo.22277738   diese Fassung, Version 2.0
10.5281/zenodo.22277737   das Werk, fuehrt immer zur neuesten Fassung
```

Zenodo legt den zweiten (**Concept-DOI**) automatisch an; er stand auf der
veröffentlichten Seite, die Klaus geschickt hatte. **Die Zuordnung ist nicht
Geschmackssache:** ins gedruckte Papier gehört der Versions-DOI — wer dieses PDF
in der Hand hält, hält Version 2.0. In eine Verlinkung, die stehen bleiben soll,
gehört der Concept-DOI, sonst zeigt sie nach der nächsten Fassung ins Veraltete.

### Was Klaus am Ende entschieden hat

| | |
|---|---|
| **Netz-Identität** | bleibt bei `BgjXhSAp…`. *„Die alte ist wahrscheinlich gelöscht. Und wenn nicht, können wir das immer noch machen. Es stört überhaupt nicht."* Der Punkt ist damit **entschieden, nicht offen** |
| **Lizenz** | CC BY 4.0 für den Aufsatz, Spezifikation bleibt gemeinfrei |
| **Alte Zenodo-Entwürfe** | gelöscht |

⚠ **Zur Identität gehört eine Berichtigung meinerseits.** Ich hatte in der
Übersicht behauptet, der Löschen-Knopf für Entwürfe stehe in der Zenodo-Liste.
Klaus hat widersprochen — *„Siehst Du den Screenshot? Da gibt es keinen Löschen
Knopf oder täusch ich mich da?"* — und er hatte recht: dort steht nur „Sicht".
**Ich hatte über eine Seite gesprochen, die ich nicht sehen kann.**

---

## Was das Ziel war und was daraus wurde

**Ziel: der Zenodo-DOI.** Er steht am Ende immer noch offen — zum zweiten Mal in
Folge. Diesmal aus einem anderen Grund als beim letzten Mal: nicht weil eine
Diagnose das Ziel verdrängt hätte, sondern weil die Nummer nur Klaus hat und er
sie in dieser Sitzung nicht genannt hat. Ich habe zweimal danach gefragt.

**Was stattdessen entstand**, und es gehört zum selben Ziel: die PDFs, die bei
Zenodo hinaufgehen, waren fehlerhaft. Klaus hat sie beanstandet, bevor die
Sitzung anfangen konnte — richtige Reihenfolge, denn ein DOI auf ein Papier mit
zerrissenen Tabellen wäre unveränderlich.

Beide Hälften zählen (NETZWEIT § 6a): die PDFs sind jetzt gut, **und** das Ziel
ist wieder liegen geblieben.

---

## 🔴 Der teuerste Befund: zwei Sitzungen, ein Auftrag

Während diese Sitzung an den Papers arbeitete, hat eine **Parallel-Sitzung**
denselben Auftrag bearbeitet und war zuerst auf `main`: **PR #939**, „Der Druck
ist auf DIN A4 festgelegt, und die großen Blöcke dürfen umbrechen".

**Aufgefallen ist es erst beim Anlegen des eigenen PR** — `mergeable_state:
"dirty"`. Bis dahin habe ich gegen einen `main`-Stand gearbeitet, den es nicht
mehr gab.

| | #939 | diese Sitzung |
|---|---|---|
| große Blöcke | **dürfen umbrechen**, mit Zahlen belegt | zusammenhalten |
| Deckblatt für sich | — | ✓ |
| Schriftgrößen-Hierarchie | — | ✓ |
| Adressen im Druck-Kopf | ✓ | ✓ — **beide gebaut** |
| Datumszeile | „Erstveröffentlichung … auf GitHub" | „Zweite Fassung · Erstfassung Mai 2026" |

**In einem Punkt hatte #939 gemessen recht und ich falsch.** Mein
`break-inside:avoid` auf Tabellen, Fußnoten und Zusammenfassung erzeugt genau
die Lücken, die Klaus beanstandet hat („nicht so große Zwischenräume"). #939 hat
nachgerechnet: die größten Blöcke sind 555, 550, 503 und 450 px hoch bei 987 px
Nutzhöhe — passt einer nicht mehr, springt er ganz auf die nächste Seite.
**1.377 px an drei Stellen, zusammen 1,4 leere Seiten.**

**Zusammengeführt, nicht überschrieben.** #939s Block-Politik gilt; darüber
kamen die drei Dinge, die #939 nicht hatte. Zwei Regeln standen nach dem Merge
**doppelt** da, weil beide Sitzungen denselben Fehler sahen — auf je eine
Fassung zusammengelegt.

> **Die Lehre ist nicht „eine Sitzung hat sich geirrt".** Beide haben gemessen,
> und die Zusammenführung ist besser als jede Fassung für sich. Teuer war
> allein, dass keine von der anderen wusste.

Für Klaus heißt das praktisch: **wer zwei Sitzungen auf dasselbe Depot setzt,
zahlt das einmal pro Datei.** Es ist kein Fehler, aber es ist auch nicht
kostenlos.

---

## Die Mai-Fassung war öffentlich — gemessen

Klaus hat einer Entscheidung vom Vortag widersprochen: *„Das Datum für die
Erstveröffentlichung über GitHub stimmt nicht, alte Fassung schon im Mai
veröffentlicht."*

Am Vortag stand das Gegenteil im Depot, und es war eine ausdrückliche
Entscheidung: *„Ich habe noch nichts veröffentlicht. Das ist das erste Mal."*
Darauf waren vier Berichtigungs-Kästen je Sprache entfernt worden.

**Nachgemessen statt geglaubt:**

```
git log --diff-filter=A -- docs/papers/sbkim-paper-en.html   →  2026-05-18
git show 9011aad:index.html                                   →  Station 4,
    status:'live', href auf die Datei
```

Sie lag nicht nur im Depot, sie war **auf der Startseite verlinkt** und über
Pages abrufbar. **Eine Datei, die auf einer öffentlichen Seite verlinkt ist, ist
veröffentlicht** — ob jemand sie gelesen hat, ist eine andere Frage.

Nachgezogen, damit das Depot nicht zwei Dinge sagt: Datumszeile beider Papers,
der Absatz in Abschnitt 9 (den #939 ohne Datum angelegt hatte),
`docs/papers/README.md`, **Station 8** der Geschichts-Galerie.

**Die Berichtigungs-Vermerke bleiben draußen** (Klaus' Entscheidung) — aber die
Begründung musste ausgetauscht werden. Die alte lautete „es gab keine frühere
Ausgabe" und war falsch. Die neue: ein solcher Kasten wendet sich an jemanden,
der die frühere Fassung **gelesen** hat.

> **Eine Regel, deren Begründung fällt, ist damit nicht automatisch falsch.**
> Sie braucht aber eine neue, sonst steht sie als Behauptung da.

---

## Vier eigene Fehler, alle gemessen widerlegt

**1 · Mein Umbruch-Prüfer hat gelogen.** Erste Fassung suchte im ausgelesenen
PDF-Text nach Seiten, die mit einer Großbuchstaben-Zeile beginnen. Er konnte den
**Fehler** (Tabelle zerrissen) nicht vom **richtigen Fall** unterscheiden
(Tabelle beginnt sauber oben) — beide sehen im Text gleich aus. Er meldete
**fünf CSS-Varianten als wirkungslos, darunter eine, die wirkte.**

Aufgefallen ist es erst, als ich die Seite als **Bild** angesehen habe.

> **Ein Wächter, der nach dem Textmuster sucht, misst das Textmuster.**

**2 · Mein Kunstfall traf die kritische Zone nicht.** Um die CSS-Varianten zu
messen, baute ich eine Testseite mit einem Füller. Bei 640 px passte die Tabelle
noch ganz, bei 840 px verschoben **alle** Varianten — auch die, die im echten
Papier versagt. Zwei Läufe, null Erkenntnis. Der echte Gegenstand war der
bessere Test.

**3 · Zweimal Rauschen im Commit.** Ein Wegwerf-Skript (`probe-css.mjs`) und
vier Datumsstempel unter `docs/lesen/` sind in den ersten Commit gerutscht —
letztere schreibt ein Werkzeug beim Probenlauf. Beim ersten Mal bemerkt und
zurückgenommen, **beim dritten Commit durchgegangen.** Steht im PULS.

**4 · Der Werkzeug-Wächter war schneller als ich.**
`smoke_werkzeuge_lauffaehig.mjs` wurde rot, sobald das neue Werkzeug im Depot
lag: es startet beim Laden einen Browser. Der Wächter stand da, bevor die Datei
geschrieben war, und hat sie von selbst gefunden.

---

## Was gebaut wurde

| Datei | Was |
|---|---|
| `tools/paper-zu-pdf.mjs` **neu** | druckt ein Paper als A4-PDF. Schriften per `curl` in eine **Arbeitskopie**, Depot unberührt. Prüft **vor** dem Druck im geladenen Dokument; schlägt eine Prüfung fehl, entsteht **kein** PDF |
| `tools/paper-umbruch-pruefen.mjs` **neu** | misst die **Lage** der Blöcke gegen die Seitengrenzen, liest den Rand aus der `@page`-Regel des Dokuments |
| `docs/papers/*.html` | Deckblatt-Trennung · Schriftgrößen · `orphans:4` · Datumszeile · Abschnitt 9 |
| `docs/papers/README.md`, `index.html` | „nie veröffentlicht" berichtigt |
| `tests/smoke_werkzeuge_lauffaehig.mjs` | beide Werkzeuge in `NUR_SYNTAX`, mit Begründung |

**Warum das PDF-Werkzeug ins Depot gehört:** die Vorgänger-Sitzung ging diesen
Weg von Hand und legte ihn nicht ab. Genau die Familie von Fehlern aus
[NETZWEIT § 6b](../../NETZWEIT.md) — *eine Grenze, die man kennt, kostet eine
Zeile; eine, die man jedes Mal neu entdeckt, kostet eine Stunde.*

---

## Gemessen

| | |
|---|---|
| `node tests/run_alle.mjs` | **90 Proben · 90 grün · 0 rot · 0 nicht lauffähig** |
| PDF DE / EN | je **15 Seiten** (vorher 19 / 17) |
| Zeilen je Seite (DE) | 23 · 32 · 37 · 31 · 32 · 32 · 34 · 34 · 32 · 29 · 32 · 31 · 33 · 34 · 25 |
| Einleitung | jeweils oben auf Seite 2 |
| Tabellen über eine Seitengrenze | **keine** |
| PR #940 | `dirty` → nach der Zusammenführung **`clean`** |

**Nicht gemessen:** wie die PDFs auf Klaus' Tablet aussehen. Sein Sichttest ist
nicht ersetzbar.

---

## Stundennachweis

| | |
|---|---|
| erster Commit | `7c97cfc` **05:44 UTC** |
| letzter Commit | `6923e12` **06:00 UTC** |
| **Spanne** | **16 Minuten**, 3 Commits |

⚠ **Das ist die Spanne des Ablegens, nicht der Aufwand.** Davor liegen die
Pflichtlektüre, das Lesen der beiden PDFs Seite für Seite, zwei verworfene
Messreihen und das Auflösen des Merge-Konflikts — nichts davon hinterlässt einen
Commit. **Und sie ist nicht Klaus' Arbeitszeit.**

---

## Was offen ist

1. **Der Zenodo-DOI** — das Ziel. Drei Stellen lokalisiert, es fehlt die Nummer.
2. **Sages Netz-Identität** (`BgjXhSAp…` statt `nysOZE3V…`). Weg gefunden:
   Siegel → „🔑 Eigene Identität & Spore erzeugen / verwalten" → **Baustein 5,
   Identitäts-Wechsler**. Steht die alte Kennung noch als Fach, genügt ein Klick
   und **nichts wird gelöscht**; sonst Baustein 4 mit der Sicherungsdatei.
3. **Die neue Selbstbeschreibung** ins Beschreibungsfeld der App
   ([LEHREN § 9](../../LEHREN.md)). **Erst nach 2**, sonst signiert sie unter der
   falschen Kennung.
4. **Woher der Browser den Beschreibungstext nimmt** — nicht gemessen.
5. **Klaus' Sichttest** der neuen PDFs.
