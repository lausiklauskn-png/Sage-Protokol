# Übergabeprotokoll 2026-08-15 — Modul-23-UI netzweit · Modul 15 aus BLP in den Kanon

**Rolle:** Pflege-Sitzung, Fortsetzung. Der Vortag liegt in
`2026-08-14_sperr-knoepfe-automatik-tote-waechter.md`; dieses Protokoll deckt
alles ab PR #852 ab.

---

## 1. Die Aufgabe

Der Brief vom 2026-08-14 nannte vier zurückhängende Modul-23-UI-Kopien.
Klaus' Auftrag kam in drei Schritten: erst BookLedgerPro, dann die anderen
drei, dann Modul 15 in den Kanon heben und Points sechs Abweichungen
abarbeiten.

## 2. Sieben Merges

| Repo | PR | Was |
|---|---|---|
| BookLedgerPro | #302 | Modul-23-UI + neuer Drift-Guard (15 Module) |
| Kim-Bell | #42 | Modul-23-UI, Pin + Cache nachgezogen |
| Mein-WorkFloh | #170 | Modul-23-UI, Pin + Cache nachgezogen |
| SB-KIMTool-Point | #150 | Modul-23-UI + neuer Drift-Guard (18 Dateien) |
| Sage-Protokol | #852 | Modul 15 `queryInclusion` + Siegel-Aspekt |
| BookLedgerPro | #303 | 15+16 auf den neuen Kanon, Fachworte in den Klebstoff |
| SB-KIMTool-Point | #151 | die sechs offenen Abweichungen |

## 3. Der Fund, der die Sitzung gedreht hat

Beim Abgleich **aller** Kopien in BookLedgerPro — nicht nur der einen, die im
Brief stand — weichen fünf Module ab. Vier waren bloß hinterher. **Modul 15
war abgewandelt:** es trug eine BLP-eigene Buchhaltungs-Synonym-Karte
(`BLP_QUERY_SYNONYMS` + `queryWithInclusion`, eingebaut am 2026-07-11).

Das ist echte, nützliche Funktion an der einen Stelle, die niemand ändern
darf. **Ein blindes byte-1:1-Nachziehen hätte sie gelöscht** — und der Verlust
wäre unsichtbar gewesen: die Cross-Knoten-Suche hätte einfach etwas weniger
gefunden, ohne Fehler, ohne Meldung.

Die Umkehrung: die **Mechanik** wandert in den Kanon, die **Worte** bleiben bei
der App.

```js
SbkimMembrane.init({ queryInclusion: { synonyms: {…}, hybrid: true } });
```

Default `null` = aus. Die erste und wichtigste Probe ist deshalb nicht, dass
der neue Pfad funktioniert, sondern dass **ohne Konfig alles bleibt wie es
war** — jeder andere Knoten stellt nichts ein.

## 4. Drei Repos hatten gar keinen Wächter für ihre Kopien

„Kopieren, nicht klonen" stand dort nur als Versprechen. Genau deshalb blieb
der Drift monatelang unsichtbar. Neu:

- **BookLedgerPro** — 15 Module per sha256 genagelt, Vollzähligkeits-Prüfung
- **SB-KIMTool-Point** — 18 Dateien, dazu die Regel *eine Abweichung ohne
  Begründung ist selbst ein Fehler*

Bei Point wiegt es am schwersten: Kim-Bell und Mein-WorkFloh nennen
`SB-KIMTool-Point/web/tools/*` ausdrücklich als Quelle **ihrer** Kopien. Ein
Drift dort wandert weiter.

Ehrliche Grenze beider Wächter: der Kanon liegt in einem anderen Repo und ist
dort nicht lesbar. Geprüft wird „unverändert seit der Nagelung", **nicht**
„gleich dem Kanon".

## 5. Was die Gegenproben gefunden haben

Elf Sabotagen über alle Repos, jede hat gegriffen — **bis auf eine**, und die
ist der interessante Fall:

Bei Points Einbettungs-Probe (`index.html` bettet Modul 01+02 ein) blieb eine
Sabotage wirkungslos. Die Probe fragt `html.includes(quelltext)`; zusätzlicher
Text **vor** dem Quelltext stört das nicht. Sie fängt echtes Veralten — ihren
eigentlichen Zweck, in derselben Runde nachgewiesen — aber ihr Name sagt
„byte-genau" und verspricht damit einen Tick mehr, als sie hält. Nicht
umgebaut, aber in Points `PULS.md` benannt.

## 6. Eigene Schlampigkeit, zweimal

Beim Push-Vorbereiten habe ich zweimal „Inhalts-Unterschied leer" gemeldet und
dabei gegen eine **veraltete lokale Referenz** verglichen — bei Point existierte
der Remote-Branch überhaupt nicht mehr. Das Ergebnis stimmte beide Male, die
Prüfung zielte aber ins Leere. Richtig ist `git ls-remote` zuerst, dann
`--prune`.

Merksatz, der hier zum dritten Mal an zwei Tagen zutrifft: **eine Prüfung, die
dir recht gibt, ist der Ort, an dem du am genauesten hinsehen musst.**

## 7. Zahlen

| | |
|---|---|
| Sage `npm test` | **70/70** (vorher 69) |
| Sage `smoke_vollbundle` | 47/47 |
| BookLedgerPro `tests/run.mjs` | 2157 → **2179** |
| Kim-Bell `npm test` | 4/4 |
| Mein-WorkFloh `npm test` | 6/6 |
| SB-KIMTool-Point `npm test` | **123/123** |
| Modul-23-UI netzweit | **16/16 auf `4882c3b6`** (gegen `origin/main` geprüft) |

Cache-Bumps: BLP `v218 → v220`, Kim-Bell `v26 → v27`, WorkFloh `v120 → v121`.

## 8. Was offen bleibt

1. **Modul 15 steht netzweit in fünf Generationen** — und zwar **schon vor
   dieser Sitzung** (`fbf9f42d` in acht Repos, dazu `33d6fe0c`, `0f8a3f69`,
   `92948a91`, `8a07567f`). Der Kanon-Sprung hat eine sechste obendrauf
   gesetzt, die Zersplitterung aber nicht verursacht. Das ist ein eigener
   Rollout, kein Nebenbei — und der erste, bei dem sich lohnt zu fragen, warum
   ausgerechnet Modul 15 so weit auseinandergelaufen ist.
2. **Points Einbettungs-Probe** hält weniger, als ihr Name verspricht (§ 5).
3. **`package.json` in SB-KIMTool-Point** nagelt `fake-indexeddb` mit `^6.2.5`
   nicht exakt — zwei Container können damit Verschiedenes prüfen. Dieselbe
   Lehre, die Sage am Vortag in seine Verfassung geschrieben hat. Gemeldet,
   nicht geändert.
4. **Klaus' Browser-Sichttest** für alles aus dieser Sitzung: das Netz-Panel,
   die Cross-Knoten-Antwort mit den Fachworten, und die vom Vortag offenen
   Punkte (Sperr-Knöpfe, Automatik-Schalter, Modul 17 auf schmalen Handys).
