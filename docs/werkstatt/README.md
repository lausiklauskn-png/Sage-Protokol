# Werkstatt: Regeln und Grundsätze

**Momentaufnahme vom 2026-08-23.** Dieser Ordner gehört zum
[Forschungskorpus](../FORSCHUNGSKORPUS.md) und trägt den Teil der Werkstatt aus
dem Repo [Kimhub](https://github.com/lausiklauskn-png/Kimhub), der die
Forschungsfrage belegt: **was lässt sich einer KI durch Regeln vorschreiben, und
was muss man ihr stattdessen als Grundsatz mitgeben?**

---

## Die drei Dateien

| Datei | Was drin steht |
|---|---|
| **[`WERKSTATTREGELN.md`](WERKSTATTREGELN.md)** | die sechs **erzwungenen** Regeln, prüfbar, im Code, jede Rolle bekommt sie |
| **[`grundsaetze.md`](grundsaetze.md)** | die fünf **Grundsätze**, nicht prüfbar, in Markdown, ohne Programmierer änderbar |
| **[`BEFUND.md`](BEFUND.md)** | was sich daran beobachten ließ, **und was daraus nicht folgt** |

**Fang mit `BEFUND.md` an**, wenn du wissen willst, worum es geht. Die anderen
beiden sind das Material.

---

## Die Quelle liegt woanders

**Der lebende Stand steht in Kimhub.** Was hier liegt, ist eine Momentaufnahme.
Wer etwas ändern will, ändert es **dort** und zieht es hierher nach, nie
umgekehrt. Sonst entsteht ein zweiter Stand, der aussieht wie der erste.

> Dieselbe Regel gilt in `SP-FP-md-Speicher`, und sie ist dort nicht theoretisch
> geblieben: zwei Notizen trugen eine dritte, veraltete Fassung derselben Rezepte
> und rieten weiter zu einer Datei, in der etwas fehlte.

### Prüfsummen: damit eine Drift auffällt

Eine Momentaufnahme ohne Prüfsumme läuft still vom Original weg. Deshalb:

| Datei hier | Quelle in Kimhub | Art | SHA-256 der Quelle |
|---|---|---|---|
| `grundsaetze.md` | `schicht/grundsaetze.md` | **byte-gleich** | `422a3c7b3cb35fea6dade14093409076…` |
| `WERKSTATTREGELN.md` | `schicht/rollen.mjs` | **Auszug** | `6b151749ed4525b14b7598313b50f4d9…` |

Kimhub-Depotstand bei der Entnahme: **`1f226d3`**.

So prüfst du, ob die Kopie noch stimmt:

```bash
sha256sum Kimhub/schicht/grundsaetze.md      # muss oben stehen
diff Kimhub/schicht/grundsaetze.md Sage-Protokol/docs/werkstatt/grundsaetze.md
```

**`WERKSTATTREGELN.md` ist kein Byte-Kopie und kann nicht per `diff` geprüft
werden**, im Original stehen die Regeln als Zeichenkette in einer Quelldatei.
Ändert sich deren Prüfsumme, gehört der Auszug nachgesehen.

---

## Warum Kimhub selbst nicht im Korpus liegt

Kimhubs Git-Historie trägt Klaus' Rechnungsdaten aus der Zeit, bevor sie am
2026-08-22 aus dem Arbeitsbaum genommen wurden, **`git rm` entfernt nicht aus
der Vergangenheit.** 859 Zeilen, 75 Belege, mit Rechnungsnummern und Beträgen,
über den Commit davor weiter abrufbar.

Eine offene Lizenz ist eine **Einladung zum Forken**, und ein Fork nimmt die
Historie mit, danach hat niemand mehr Zugriff darauf. Deshalb bleibt das Depot
privat, und hierher kommt nur der Forschungsteil, der keine solchen Daten trägt.

**Geprüft, nicht angenommen:** die Historie wurde vollständig entflacht (56
Commits) und durchsucht. Keine Schlüssel, keine Tokens, die Treffer auf
`sk-ant-api…` sind die Testdaten des eigenen Wächters (`const SCHEIN = … + "x".repeat(90)`).
Die Beleg-Datei dagegen liegt wirklich darin.

---

## Was hier bewusst NICHT liegt

- **Kein lauffähiger Code.** Die Schicht, die Proben und die Gegenprobe bleiben in
  Kimhub. Eine Probe, die in keinem Läufer steht, ist stumm, und Sages Läufer
  kennt diese nicht. Sie hier abzulegen hieße, grüne Haken vorzutäuschen, die
  niemand einlöst.
- **Keine Buchhaltung, kein Fahrtenbuch, keine Stechuhr.** Das ist der Stand
  einer Maschine, nicht des Depots, und gehört Klaus.
- **Keine Kosten- oder Verbrauchszahlen.**

## Verwandtes in diesem Repo

- [`./LEHREN.md`](./LEHREN.md) § 6, die Proben-Disziplin: die zwei Sorten
  Warten, die vier Wege, wie eine Probe stumm wird
- [`./FORSCHUNGSKORPUS.md`](./FORSCHUNGSKORPUS.md), die ganze Kette
- [`./FORSCHUNGSFOERDERUNG.md`](./FORSCHUNGSFOERDERUNG.md), wofür der Korpus
  gebraucht wird
