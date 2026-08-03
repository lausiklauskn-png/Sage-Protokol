# Übergabeprotokoll 2026-08-04 — Sage-Page: CLS 0,328 → 0, Schriften selbst gehostet

**Rolle:** Bau-/Pflege-Sitzung (Sage-Page-Leistung).
**Branch:** `claude/sage-page-cls-optimization-p61lyo`

## Auftrag

Zwei Aufgaben. (1) Sage-Page CLS 0,328 — der größte verbliebene Posten, ein Viertel der
Note. Ausdrückliche Weisung: **erst messen, welches Element wann springt, nicht raten.**
(2) Startlast: 25 Modul-Dateien am kritischen Pfad, BLP-Muster übertragen. Dazu eine
offene Infrastruktur-Frage an Klaus.

## Klaus' Antwort zuerst eingeholt

`wss://relay.family-projekt.de/` → **das Relais soll wieder aufgesetzt werden, nichts
ändern.** In BookLedgerPro wurde folgerichtig **nichts** angefasst.

## Was gefunden wurde

### Der CLS kam vom eigenen Siegel, nicht von der Schrift

Der Verdacht im Brief lag auf der Google-Fonts-Einbindung (blockiert 780 ms, Schrift
tauscht nach dem ersten Anstrich). Er war **falsch**, und die Messung hat das gezeigt,
bevor eine Zeile Code entstand.

Werkzeug: ein `PerformanceObserver` auf `layout-shift` mit `buffered: true`, eingehängt
**vor** dem Laden, der je Sprung das Feld `sources` ausliest — dort steht das wirklich
verschobene Element mit alter und neuer Kachel. Dazu eine `document.fonts`-Zeitachse in
derselben Aufzeichnung, damit sichtbar wird, ob ein Sprung mit dem Schrifttausch
zusammenfällt. Gedrosselt wie die echte Messung (150 ms Rundreise, 1,6 Mbit/s, Prozessor
vierfach) — ungedrosselt ist alles vor dem ersten Anstrich fertig und man misst 0.

Ergebnis, unmissverständlich:

```
=== CLS gesamt 0.3275 aus 1 Spruengen ===

0.3275  bei 17368 ms
      div.wrap        Δy=+32  Δh=-32
      button#netz-check-btn   Δx=+54 Δy=+10
      span#lamp-traffic       Δy=+10
      div#topbar-meta         Δx=+68 Δy=+27
      button#hard-reload-btn  Δx=-311 Δy=+72     <- rutscht in eine NEUE Zeile

=== Schrift-Zeitachse ===
   15516 ms  *** fonts.ready ***
```

**Ein einziger Sprung, bei 17,4 s — also nach `fonts.ready` (15,5 s).** Kein
Schrifttausch. Der „Frisch laden"-Knopf wandert 311 px nach links und 72 px nach unten:
er bricht in eine zweite Zeile um. Die Topbar (`flex-wrap: wrap`) ist um eine Zeile
gewachsen und schiebt `div.wrap` um 32 px.

Was um 17,4 s in die Topbar kommt: das **SBKIM-Siegel**. Modul 16 erzeugt sein 40 px
hohes Badge und hängt es in `.lamps` — erst nachdem der ganze Modul-Stapel geladen und
`sbkim-init.js` durchgelaufen ist. Ein Viertel der Leistungsnote, verursacht von einem
Element, das die Seite sich selbst anheftet.

### Die Lösung stand schon im Modul

Modul 16 kennt den Fall (Kopf-Kommentar, Option β):

> Wenn der Selektor ein bereits-bestehendes Element matcht (z.B. `#sbkim-siegel-badge`
> vor-injiziert), wird dieses Element als Anker genutzt; sonst wird darin der Badge-Span
> erzeugt.

`index.html` legt den leeren Anker jetzt in `.lamps`, `sbkim-init.js` zeigt mit
`badgeSelector` darauf (vorher `.lamps`, also der Container → neues Element). Der Platz
steht ab der ersten Zeichnung.

**Das Sicherheits-Modul wurde nicht angefasst.** Anti-Greenwashing gilt unverändert:
ohne `isCertified()` füllt Modul 16 den Anker nicht — es wird kein Siegel gezeigt, nur
Platz gehalten.

### Schriften selbst gehostet

Klaus' Server-Bericht nannte am LCP-Element `p.hero-claim` (reiner **Text**) eine
„Verzögerung beim Rendering des Elements" von **1.950 ms** bei nur 30 ms TTFB. Ein
`<link rel="stylesheet">` auf einen fremden Ursprung blockiert das erste Zeichnen
vollständig — samt DNS, TLS und Weiterleitung auf einen **zweiten** Ursprung
(`fonts.gstatic.com`) für die Dateien.

Geprüft, ob der Proxy dieser Umgebung die Dateien überhaupt herausgibt: **ja**
(CSS 200, woff2 200). Vier `woff2` liegen jetzt unter `assets/fonts/`. Es sind
**variable** Schriften — eine Datei je Schnitt deckt 300–700 (Geist) bzw. 400–500
(Geist Mono) ab, deshalb reichen vier statt sieben Dateien. Vorabgeholt werden nur die
beiden `latin` (52 KiB); `latin-ext` holt der Browser nur bei einem Zeichen aus ihrem
`unicode-range`, bei deutschem Text also nie.

**Nebenbefund, der die ganze bisherige Messlage erklärt:** die Bau-Maschine erreicht
`fonts.googleapis.com` **gar nicht**. Vorher: `fonts.ready` bei 15,5 s und *keine
einzige* Schrift geladen — die Seite zeichnete durchweg in der Systemschrift und hat die
Schrift-Bytes nie bezahlt. Nachher: beide Schriften nach **789 ms** da.

### Aufgabe 2 gebaut, gemessen, verworfen

Das BLP-Muster wurde vollständig umgesetzt: 25 Dateien ans `load`-Ereignis, `async=false`
für die Reihenfolge, `05b` als ES-Modul, `readyState === "complete"`-Zweig für bfcache,
vorher geprüft, dass kein Code nach der Stelle synchron auf `window.Sbkim*` zugreift.

Gemessen: **LCP 7,6 s → 8,4 s, Note 64 → 63**, reproduzierbar über drei Läufe.
**Kein Gewinn, kleiner Verlust → zurückgenommen.**

Die Erklärung, die in den nächsten Brief gehört: die Skripte stehen bereits am **Ende des
`<body>`**. Sie blockieren das Zeichnen des Inhalts über ihnen heute nicht. Sie später zu
holen verschiebt ihre Kosten nur hinter den LCP-Zeitpunkt — und weil der LCP-Kandidat auf
dieser Seite spät steht, verschiebt sich der LCP mit. Der kritische Pfad ist real, aber
der Hebel ist die **Menge**, nicht der **Zeitpunkt**.

## Zahlen

Bau-Maschine, je 3 Läufe, gleiche Maschinenlage. Der Ausgangswert wurde frisch
nachgemessen (`git archive origin/main` in einen Temp-Baum), nicht aus dem Protokoll
übernommen — eine erste Messreihe hatte zwischen 34 und 60 geschwankt, das war
Maschinenlärm und hätte jede Zuordnung wertlos gemacht.

| Zustand | Leistung | CLS | LCP | TBT |
|---|---|---|---|---|
| `origin/main` | 45 · 45 · 45 | 0,328 | 7,1 s | 60–80 ms |
| nur Platz-Anker | 61 · 61 · 59 | **0** | 7,1 s | 40–160 ms |
| + Schriften selbst gehostet | **66 · 67 · 69** | **0** | 7,6 s | 160–290 ms |
| (verworfen) + Stapel zurückgestellt | 62 · 63 · 64 | 0 | 8,4 s | 330–400 ms |

## Beweise

- **CLS-Gegenprobe:** vorher ein Sprung 0,3275 mit benanntem Quell-Element; nachher
  **0,0000 aus 0 Sprüngen**.
- **Siegel funktional gegengeprüft** (Chromium, `serviceWorkers: "block"`): Anker gefüllt
  (`hatSvg: true`), `role=button`, `tabindex=0`, `aria-label` gesetzt,
  `data-stufe="gold"`, 40 × 40 px, Modal öffnet auf Klick, **keine Seitenfehler**.
- **Tests 64 von 66 grün.** Die zwei roten (`smoke_bau23_0b_identitaet`,
  `smoke_bau23c_ki_richter`) sind per Gegenprobe **auch auf blankem `origin/main` rot**.

### Fund für die Sitzungs-Vorbereitung

Beim ersten Lauf waren **21 von 66** Tests rot. Die Gegenprobe auf `origin/main` ergab
exakt dieselben 21 — und der Grund war in allen Fällen
`Cannot find package 'fake-indexeddb'`. Nach `npm install fake-indexeddb --no-save` sind
19 davon grün. **Wer das nicht installiert, hält 19 gesunde Tests für kaputt** und misst
seine eigene Arbeit gegen eine falsche Grundlinie.

## Nicht geprüft / offen

- **Klaus' Browser-Sichttest.** Sitzt das Siegel in der Topbar noch richtig? Wirkt die
  Seite mit der jetzt *wirklich* geladenen Geist-Schrift wie gewohnt?
- **Nachmessung am echten Server:** der Ausgangs-Proxy verweigert `github.io` (403).
- **Der Schrift-Gewinn ist lokal untertrieben.** Der Ausgangszustand hat die 52 KiB nie
  bezahlt (siehe Nebenbefund), und trotzdem stieg die Note von 61 auf 67. Am Server
  sollte der Gewinn größer sein — belegt ist das erst nach Klaus' Messung.
- **`docs/papers/sbkim-paper-de.html` / `-en.html`** binden weiterhin Google Fonts ein
  (Source Serif 4, Source Code Pro, Inter). Bewusst nicht angefasst.
- **`docs/PULS.md` hat 8.159 Zeilen** — die Schutz-Klausel nennt 3.000 als Grenze mit der
  Auflage „auslagern statt kürzen". Die Grenze ist seit Längerem überschritten; das
  Auslagern ist eine eigene Sitzung wert und wurde hier **nicht** nebenbei erledigt, weil
  es die halbe Datei bewegt.
- **Kritischer Pfad / Hauptthread** bleibt offen. Der einfache Weg ist gemessen widerlegt.

## Nächster sinnvoller Schritt

Klaus' Server-Messung abwarten und gegen die 67 halten. Erst danach lohnt der nächste
Leistungs-Eingriff — und der müsste an der **Menge** des SBKIM-Stapels ansetzen (was
braucht die Seite wirklich beim Start?), nicht am Zeitpunkt.
