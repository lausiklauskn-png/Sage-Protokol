# 2026-09-16 · Eine Kennung, eine Spore — und die Zahl, die kein Vertrag war

**Rolle:** Haupt-Sitzung (Fortsetzung derselben Sitzung, nach der
Ordner-Zählung und der englischen Tafel).
**Zweig:** `claude/andock-wizard-merge-gokcps` in 21 Repos.

---

## Stundennachweis

**Gemessen, nicht geschätzt** — die Spanne der beiden Merges dieses Abschnitts
auf `main`:

| | |
|---|---|
| erster Merge | 2026-09-16 16:16 — #1019 (Stempel „Letzte Sicherung") |
| letzter Merge | 2026-09-16 17:00 — #1020 („Eine Kennung, eine Spore") |

⚠ **Was das NICHT enthält:** die Zeit vor dem ersten Merge hinterlässt in dieser
Spanne keine Spur. **Und die Spanne ist nicht Klaus' Arbeitszeit** — beide
überschneiden sich, sind aber nicht dasselbe.

---

## Klaus' Bitte

> *„wenn ich im Mycel, also in Knoten verbinden, und in Siegel etwas speichere,
> dann muss es kommuniziert werden, dass nicht doppelt gespeichert wird und der
> Nutzer denkt, er hätte zwei verschiedene Dateien gespeichert, aber hat nur
> einen gespeichert. … Entweder signierst du im Mycel in diesem Knotennetz
> verbinden oder du signierst im Siegel. Du musst nicht in beiden signieren.
> Also die Spore."*

Dazu: *„dass er begreift, wenn er im Siegel signiert, ist eine andere Adresse
als im Mycel."* Auf Rückfrage hat er „andere Adresse" als **„die Bedeutung"**
bestimmt — ein anderes **Thema**, nicht eine andere nodeId.

---

## 1 · Die Prämisse war messbar, und sie stimmte nicht

**Gemessen im Code, nicht geschlossen.** `generateOwnSpore(meta, key)` setzt
`slotKey = key || await getActiveIdentityKey()` — **beide** Signier-Wege landen
im selben Fach und erzeugen deshalb **dieselbe nodeId**.

| | |
|---|---|
| Wizard im Siegel (`16b_andock_wizard.js`) | ruft `generateOwnSpore` mit dem aktiven Fach |
| Verbinden-Fenster (Modul 23 UI) | **signiert gar nicht** — es hat kein `generateOwnSpore` |
| wer im Verbinden-Weg signiert | der App-Klebstoff (`sbkim-init.js` / `sbkim-connect.js`), beim ersten Verbinden |

**Daraus folgt: es sind nicht zwei Adressen, sondern eine.** Genau das ist der
Satz, der gefehlt hat — und der Grund, aus dem ein Nutzer glauben konnte, er
müsse zweimal signieren.

---

## 2 · Was gebaut wurde — vier Sätze, keine Umbauten

**Kanon `src/modules/16b_andock_wizard.js`** (Schritt-Beschreibungen, je an drei
Stellen: englische Fassung, `TEXTE_DE`-Vollständigkeitsliste, Aufrufstelle):

- Schritt 2: *„Dieselbe Spore wie im Verbinden-Fenster: eine Kennung, ein
  Eintrag im Netz. Du signierst hier ODER dort, nicht in beiden."*
- Schritt 3: *„Dieselbe Sicherung wie im Verbinden-Fenster: zweimal drücken
  ergibt zwei Dateien mit gleichem Inhalt."*

**Kanon `src/modules/23_rendezvous_ui.js`:**

- in der Identitäts-Box, **nur wenn eine Kennung da ist**: *„Eine Kennung, eine
  Spore: im Siegel signierst du dieselbe. Einmal genügt."*
- in der Erfolgsmeldung der Sicherung: *„Das ist dieselbe Sicherung wie im
  Siegel — eine Datei genügt."*

Dazu entfiel `„Erzeuge domainVector (384) …"` aus beiden Tabellen: der Aufruf
existiert seit dem Inhalts-Vektor nicht mehr. **Ein Text für einen Schritt, den
es nicht gibt, ist eine Auskunft über etwas Erfundenes.**

---

## 3 · Die Proben

| Probe | vorher | nachher |
|---|---|---|
| `tests/smoke_kanon_wizard.mjs` | 71 | **80 grün · 0 ROT** (9 neue Wächter) |
| `tests/smoke_bau23_0b_identitaet.mjs` | 56 | **60 grün · 0 rot** (4 neue, davon 1 Gegenrichtung) |
| `node tests/run_alle.mjs` | — | **107 Proben · 107 grün · 0 rot** |

Der Rückgabewert wurde **direkt** gelesen, nicht hinter einer Pipe.

⚠ **Gemessen wird der GRIFF, nicht der Quelltext.** `schrittZwei(datei)` klickt
in der Probe wirklich `#sbwiz-s2` und liest, **was `generateOwnSpore`
entgegengenommen hat** (gestellt über `window.__meta`). Eine Prüfung, die im
Text nach dem Satz sucht, wäre auch dann grün, wenn der Knopf nichts tut.

⚠ **Zwei Gegenprobe-Fälle waren zuerst aus dem falschen Grund gefangen.** Sie
tauschten nur den Eintrag in der **englischen** Tabelle — dann fallen die
Übersetzungs-Wächter, nicht der gemeinte. Neu gestellt, so dass der Satz
**überall** ersetzt wird (DE dreimal, EN einmal); danach fiel jeder mit dem
Namen seiner eigenen Zusicherung.

⚠ **Und ein Fall meldete „NICHT GEFANGEN" wegen meines eigenen Werkzeugs** —
ein mehrzeiliger Anker brach den Tab-trennenden Parser der Auswertung
(`ValueError: not enough values to unpack`). Mit einzeiligem Anker wiederholt:
gefangen.

**Benannte Grenze:** die sechs Gegenprobe-Fälle sind **von Hand** nachgestellt
und **nicht** als Gegenprobe-Datei abgelegt. Wer die Sätze anfasst, stellt sie
erneut von Hand nach.

---

## 4 · Der Befund, der die Prüfung selbst betraf

**Eine Zahl in einer Prüfung ist kein Vertrag.** Für die Rollout-Verifikation
hatte ich „mindestens 2 Dateien mit `markBackupMade` je Repo" gefordert — und
damit **BookLedgerPro, Privat-Brain und SB-KIMTool-Point als rot gemeldet**.
Gemessen: alle drei sind vollständig, sie tragen nur **eine** der beiden
Kanon-Dateien.

Ersetzt durch den Vergleich, der die Sache wirklich meint: **die sha jeder
`.js`-Datei gegen die zwei Kanon-shas.** Ergebnis **43 byte-gleiche Kopien** im
Netz.

Und ein Marker-Regex (`SBKIM . Modul (16b|23)` mit Pfadangabe) lieferte
**überall 0 Treffer** — statt „0" zu glauben, wurde auf den sha-Vergleich
gewechselt. *„0 Treffer" ist erst dann eine Aussage, wenn belegt ist, dass man
überall hineingesehen hat.*

---

## 5 · Die falsche Einrückung in der englischen Tafel

Modul 23 UI hat **6 Leerzeichen für Schlüssel, 8 für Werte**; ich habe mit 4
eingefügt und einen Anker benutzt, der **zwei Zeichen mitten in die Einrückung**
traf. Damit waren mein neuer Eintrag **und der folgende** kaputt.

**Gefangen hat es `tests/smoke_bau23_sprache.mjs`**, mit zwei Zeilen zugleich:
*„jeder T()-Aufruf hat eine englische Fassung (2 ohne)"* und *„jeder Eintrag ist
als Paar lesbar (236 von 237)"*. Behoben durch Entfernen und erneutes Einfügen
mit 6/8 Leerzeichen, verankert an der **ganzen** Zeile.

---

## 6 · Der Rollout

Zwei Wellen, beide vollständig gemergt:

| | |
|---|---|
| Stempel „Letzte Sicherung" | 21 PRs · gemergt · **43 byte-gleiche Kopien auf `main`** (alte shas) |
| „Eine Kennung, eine Spore" | 21 PRs · gemergt · **43 byte-gleiche Kopien auf `main`** (neue shas) |

Neue Kanon-shas: **16b = `0fbef6d8bcfc`** (vorher `119d12cd1817`) ·
**23 UI = `7de463462ae5`** (vorher `e8694ae55261`). Kein alter sha blieb im Netz
stehen.

Verteilt mit `node tools/kanon-verteilen.mjs --nur 16b --schreiben` und
`--nur 23_rendezvous_ui --schreiben` (je 19 Repos; Sages **eigene drei Kopien**
trägt der Automat nicht und wurden von Hand nachgezogen —
`assets/sbkim-andock-wizard.js`, `sbkim-bundle/modules/23_rendezvous_ui.js`,
`sbkim-bundle-voll/modules/23_rendezvous_ui.js`). `assets/siegel-inhalt.js` traf
die Suche mit und wurde **bewusst nicht angefasst**.

⚠ **Die Reihenfolge wurde eingehalten**, die am selben Tag als Lehre entstanden
ist: erst auf `main` nachgezählt, **dann** die Zweige gehoben.

### Drei rote Proben, alle als vorbestehend belegt

| Repo | rot | Beleg |
|---|---|---|
| SB-KIMTool-Point | 2 (`Probe 27: Netz-Link gerendert`, `Klick öffnet URL`) | `git stash` + Lauf auf blankem `origin/main` → **wortgleich** dieselben zwei |
| Privat-Brain | 4 | `diff` der roten Zeilen vorher/nachher **leer** |
| PWA-Toolpoint | 2 (`?v=` gegen `CACHE_VERSION`) | auf `origin/main` schon 53 zu 50 |

⚠ **Und `ERR_MODULE_NOT_FOUND: fake-indexeddb` in SB-KIMTool-Point ist NICHT
rot, sondern nicht lauffähig.** Nach `npm install`: 146/148.

---

## Was offen bleibt

1. **PWA-Toolpoint: `?v=` zieht nicht auf die Cache-Nummer nach.** Gemessen auf
   `origin/main` 53 (Worker) gegen 50 (Seite); mein Bump hat es auf 55 zu 50
   verbreitert. **Bewusst nicht behoben** — 64 Fundstellen hätten einen
   Hinweis-PR zu einem Umbau gemacht. Im PR-Text benannt. Offene Frage dahinter:
   ob der Kanon-Verteiler das künftig selbst tun soll.
2. **Ob Mein WorkFloh ein `sampleContent()` bekommt** — Auftragsdaten sind
   fremde Kundendaten. **Klaus' Entscheidung, nicht die einer Sitzung.**
3. Die sechs Gegenprobe-Fälle sind nicht abgelegt (siehe § 3).
4. Länger offen: Privat-Brains vier vorbestehende rote Zusicherungen ·
   SB-KIMTool-Points zwei · `sbkim/15_membran.js` in family-project eine
   Generation zurück · der Rezept-Export trägt die Spore nicht.

---

## Sichttest — nicht ersetzbar

Headless beweist die Logik, nicht wie es sich am Tablet liest. Die vier
Adressen, einmal **hart neu laden**:

- https://lausiklauskn-png.github.io/Mein-Rezeptbuch/
- https://lausiklauskn-png.github.io/Muttis-Rezeptbuch/
- https://lausiklauskn-png.github.io/Mein-Mixarium/
- https://lausiklauskn-png.github.io/Mein-WorkFloh/
