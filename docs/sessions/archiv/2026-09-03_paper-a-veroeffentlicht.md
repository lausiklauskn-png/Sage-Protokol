# Übergabeprotokoll · 2026-09-03 · Paper A veröffentlicht

**Rolle:** Bausitzung · **Zweig:** `claude/paper-a-veroeffentlichen-8xa6sq`
**PRs:** #943 (Englisch, Dateinamen, zwei Galaxien) · #944 (die DOIs) — beide gemergt

---

## Das Ergebnis

Paper A — *Regeln und Grundsätze · Zwei Arten, ein KI-System zu lenken, und
warum keine allein genügt* — ist bei Zenodo erschienen.

```
Eintrag        zenodo.org/records/22286072
Versions-DOI   10.5281/zenodo.22286072     steht in beiden PDFs
Concept-DOI    10.5281/zenodo.22286071     führt immer zur neuesten Fassung
```

Vorabdruck, Version 1.0, offen zugänglich, CC BY 4.0. **Beide Sprachfassungen
in einem Eintrag mit zwei Dateien**, verknüpft mit dem SBKIM-Papier
(`References` auf `10.5281/zenodo.22277738`).

## Was diese Sitzung getan hat

| | |
|---|---|
| Gegenlesen | acht Textkorrekturen des Betreibers eingearbeitet, neuer § 3.0 (Versuchsaufbau), § 3.2 als geschlossener Befund, Zahlen in § 3.9 berichtigt |
| Zusammenfassung | von 1.155 auf 322 Wörter gekürzt |
| Erzeuger | `tools/paper-md-zu-html.mjs` — Markdown ist die Quelle, HTML entsteht daraus |
| Englische Fassung | vollständig übersetzt, 1.775 Zeilen, gleiche Gliederung |
| Umbrüche | 44 Seiten / 6 zerrissene Sätze / 6 gespaltene Absätze → **41 / 0 / 0** |
| Dateinamen | tragen jetzt das Thema; die Texte sind dabei md5-gleich geblieben |
| Umgebung | `docs/papers/ZENODO_WEG.md` — der ganze Weg, mit den Fallen |

## Drei Befunde, die bleiben

**1 · Der Concept-DOI ist um eins kleiner als der Versions-DOI.** Bei Paper A
wie beim SBKIM-Papier (22286071/22286072 und 22277737/22277738). **Zwei Fälle
sind eine Beobachtung, keine Zusicherung von Zenodo.** Abgelesen wurde die
Nummer deshalb im Kasten *Versionen* („Alle Versionen zitieren?"), nicht
gerechnet. Er existiert auch bei einer einzigen Version — das ist sein Zweck.

**2 · Ein Wächter, der beim RICHTIGEN umfällt, ist so schädlich wie einer, der
beim Falschen grün bleibt.** `smoke_paper_a.mjs` wurde rot, sobald ein echter
DOI im Papier stand: die Probe baute ohne `--doi` neu und verglich gegen die
Datei mit DOI. Sie liest ihn jetzt aus der abgelegten Fassung und reicht ihn
durch.

**3 · `| tail` verschluckt den Rückgabewert — wieder.** Der erste Probelauf
dieser Sitzung endete auf `… | tail -12; echo exit=$?`; gemeldet wurde der
Rückgabewert von `tail`. Die Falle steht seit Monaten in `CLAUDE.md`. Alle
Messungen im PULS-Eintrag sind ohne Pipe wiederholt.

## Gemessen am Ende

| Probe | |
|---|---|
| `smoke_paper_a.mjs` | 26 grün, 0 rot |
| `smoke_paper_css.mjs` | 20 grün, 0 rot |
| `smoke_antragsmappe.mjs` | grün |
| `gegenprobe_paper_a.mjs` | 18 von 18 gefangen · 0 durchgerutscht · 0 tote Anker |
| Galerie headless (Chromium) | 10 Prüfungen grün, kein JS-Fehler, zehn Stationen |

## Was NICHT geprüft ist

- **zenodo.org und doi.org sind aus dieser Umgebung gesperrt** (403 vom
  Egress-Proxy). Jede Aussage über die Eintragsseite stammt aus
  Bildschirmfotos des Betreibers. Beide DOIs sind übernommen, wie sie dort
  standen — **nicht selbst aufgelöst**.
- Die **englische Fassung** ist von niemandem außer dieser Sitzung gegengelesen.
- Der **Browser-Sichttest** der Galerie durch den Betreiber steht aus.
- `tests/manual_check.html` wurde nicht geöffnet. Diese Sitzung hat keinen
  Modul-Code angefasst, nur Doku, Erzähl-Text der Galerie und Proben.

## Offen

**Im Zenodo-Eintrag** — beides ohne neue Version und ohne neue DOI änderbar:

1. Der Titel trägt **beide Sprachen in einem Feld**; der deutsche gehört als
   *Translated title* darunter. So erscheint der Doppel-Titel in jeder Zitation.
2. Das Versions-Feld enthält `Version 1.0` statt `1.0` — angezeigt wird dadurch
   „Version Version 1.0".

**Im Depot:**

- `docs/PULS.md` steht bei **2.927 von 3.000 Zeilen**. Die nächste Sitzung
  lagert ins Archiv aus — **auslagern, nicht kürzen** (Schutz-Klausel im Kopf
  der Datei).
- **Kimhub PR #75** (Regel 6) liegt weiter als Entwurf. Geprüft: 1093 grün,
  Gegenprobe 421 gefangen / 0 durchgerutscht / 0 tote Anker. Der Betreiber hat
  nicht gesagt, ob er gemergt werden soll.
