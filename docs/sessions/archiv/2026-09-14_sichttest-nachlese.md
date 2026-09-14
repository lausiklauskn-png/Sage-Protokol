# Übergabeprotokoll — Sichttest-Nachlese (2026-09-14, Nacht)

**Rolle:** Haupt-Sitzung. **Aufgabe 1** des Briefs (Sichttest-Nachlese).
**Aufgabe 2** (das Andock-Werkzeug im Siegel) ist **unberührt** und wartet auf
Klaus' Entscheidung — so, wie der Brief es verlangt.
**Branch:** `claude/sichttest-andock-werkzeug-r5dezp`.

---

## Was der Auftrag vorsah, und was daraus wurde

Der Brief sagte: *„Aus dieser Sitzung heraus NICHT prüfbar: der Ausgangs-Proxy
sperrt beide Domänen (HTTP 000, gemessen)."* Das stimmt und wurde gegengeprüft
— beide Domänen antworten mit 000.

**Nicht abrufbar heißt aber nicht unprüfbar.** Was sich sehr wohl messen ließ,
ist die Frage, die dem Sichttest vorausgeht: *kommt der neue Code beim Nutzer
überhaupt an, und malt Modul 17 die Lampen, die Klaus ansehen soll?*

Gemessen wurde **lokal im echten Browser** (playwright-core + Chromium) an
frischen `git archive`-Auszügen von `origin/main`, mit der Sprachwahl im
`localStorage` gesetzt — also so, wie ein Nutzer ankommt, der beim letzten
Besuch Englisch gewählt hat.

---

## 1 · Die Voraussetzungen — alle in Ordnung

| Frage | Befund |
|---|---|
| Module byte-1:1 zum Kanon? | ja, beide Repos: 16 `7589f18d59dc` · 17 `3f757b35cea5` |
| `<html lang>` wird gesetzt? | ja — **inline Sprachriegel im `<head>`**, vor dem ersten Anstrich |
| läuft der Riegel VOR den Modulen? | ja — family-project `defer`, Toolpoint Leerlauf-Pause |
| kommt die neue Fassung an? | ja — beide Worker sind **stale-while-revalidate** (`hit \|\| netz`) |

**Die „zweimal laden"-Regel aus dem Brief ist damit am Code belegt**, nicht
angenommen: die Module fallen in keinem der beiden Worker unter `freshFirst`,
werden also beim ersten Aufruf aus dem Vorrat bedient und im Hintergrund
aufgefrischt. Beim zweiten Laden steht die neue Fassung da.

---

## 2 · Der Befund — die sichtbaren Lampen kommen nicht aus Modul 17

| Seite | `<html lang>` | Modul 17 | was SICHTBAR dasteht |
|---|---|---|---|
| family-projekt.de | en | geladen, `_meta.lang === "en"` | **LEBT · VERKEHR · FREMD · SIEGEL** |
| pwa-toolpoint.de | en | **nicht geladen** | **lebt · verkehr · fremd** |
| …/auslieferungspruefer.html | en | geladen, en | **ALIVE · TRAFFIC · FOREIGN · SEAL** |

**Der Sprach-Haken arbeitet** — die dritte Zeile beweist es. Was auf den beiden
Seiten deutsch bleibt, ist **app-eigener Klebstoff**:

- **family-project** ruft in `sbkim/sbkim-init.js` unbedingt
  `SbkimWidget.hide()` (Klaus 2026-06-27, gegen die Doppelung). Sichtbar ist
  `assets/status-widget.js`; seine Etiketten stehen als Literale im Code,
  **0 Treffer** auf `documentElement.lang`, `T(`, `TEXTE`.
- **pwa-toolpoint** lädt Modul 17 auf der Startseite bewusst nicht — sie hat
  ihre eigene `.lamps`-Leiste in der Kopfzeile. Etiketten und Tooltips stehen
  als Markup in `index.html`.

**Das ist dieselbe Lage wie beim Gerätenamen (NETZWEIT §2) und beim
Andock-Werkzeug**: der Modul-Rollout erreicht sie grundsätzlich nicht.

> **Die übertragbare Hälfte:** eine Kette mit `lang:"en"` beweist nicht, dass
> der Nutzer Englisch sieht. Wer eine App auf Englisch anbietet, prüft zuerst,
> **wer ihre Lampen malt.**

---

## 3 · Und das Wappen im Siegel trägt zwei deutsche Anzeigetexte

Gemessen an allen drei Seiten, in jeder Stufe:

```
OFFIZIELLE BESTÄTIGUNG   ← Anzeigetext, deutsch
SIEGEL                   ← Anzeigetext, deutsch
SBKIM                    ← Eigenname, bleibt
<ribbonText>             ← graviert der Host, war korrekt gesetzt
```

Sie stecken als Markup in der Konstante `WAPPEN_SVG` und gehen nicht durch
`T()`. Das betrifft **alle 19 Träger**.

⚠ **Das ist NICHT dieselbe Frage wie die ZERTIFIKAT_ASPEKTE.** Dort ist der
deutsche Wortlaut die Urkunde und steht **nur im Code**; übersetzt wird an der
Anzeige-Stelle. Hier steht er **in der Anzeige**.

**Nicht entschieden.** Ob ein Wappen als Emblem deutsch bleibt oder mitspricht,
ist Klaus' Sache — die Lage ist in INTERFACES § Modul 16 SPRACHE benannt, damit
sie nicht stillschweigend weitergilt (Tafel-Evolutions-Klausel).

---

## 4 · Warum kein Wächter es gefangen hat

Abschnitt 3 der Probe misst **zeilenweise** und nur Zeilen mit einer
Anzeige-Zuweisung. `WAPPEN_SVG` ist eine `var`-Zuweisung mit Markup; eingesetzt
wird sie über eine **Variable**, auf deren Zeile keine Zeichenkette steht. Für
beide Filter unsichtbar. Das ist seine **dritte** benannte Grenze — zwei
standen schon da, diese ist nachgetragen.

**Abschnitt 4 ist neu.** Er gleicht das Wappen gegen die Tafel ab: jeder Text
darin muss in INTERFACES benannt sein.

> ⚠ **Er entscheidet NICHTS über die Übersetzungsfrage.** Ein Wächter, der
> einen festen Wortlaut festnagelt, verböte das nächste Richtigstellen.
> Gemessen wird nur, dass kein Text **unbenannt** bleibt — wer einen hinzufügt,
> zieht die Tafel nach, und dann wird die Frage gestellt statt übersehen.

Bauart bewusst **hinzufügen statt ändern**: der Gegenprobe-Fall hängt einen
NEUEN `<text>` ins Wappen. Wer einen vorhandenen umbenennt, fällt zugleich aus
der Tafel — dann feuert derselbe Wächter aus dem anderen Grund, und man weiß
nicht, welche Hälfte gemessen wurde.

---

## 5 · Zwei eigene Fehler, beide von den Proben gefangen

**Die Wegwerf-Kopie der Gegenprobe kannte `docs/` nicht.** Abschnitt 4 liest
INTERFACES; ohne die Zeile in `frisch()` war die Kopie **schon ohne Eingriff
rot** — und damit maßen **alle 25 Fälle nichts**. Gefangen hat es die
Ausgangslage-Prüfung beim ersten Lauf. *Die Ausgangslage einer Probe ist auch
eine Positivliste*, zum wiederholten Mal.

**Der Escape-Filter ließ Zeilenumbrüche durch.** Der Wappen-Auszug prüfte auf
`\p{L}` — und `\n` steht im Quelltext als **zwei Zeichen**, das zweite ist ein
„n". Der Wächter meldete Zeilenumbrüche als unbenannten Wappen-Text. Erst die
`\n`-Folgen weg, dann auf Buchstaben prüfen.

⚠ **Und eine These wurde von der Messung widerlegt.** Aus einem ersten Lauf
(„★ SEAL" beim Prüfer) hatte ich geschlossen, das Wappen erscheine nur in
Gold-Stufe. Nachgemessen: **alle drei stehen auf Bronze und zeigen dasselbe
Wappen.** Der Unterschied waren zwei verschiedene Elemente, nicht zwei Stufen.
Sie steht hier, weil sie fast in den Bericht gewandert wäre.

---

## Gemessen

| | |
|---|---|
| `tests/smoke_bau1617_sprache.mjs` | **68 grün, 0 rot** (vorher 64) |
| `tests/gegenprobe_bau1617_sprache.sh` | **27 gefangen · 0 durchgerutscht · 0 tote Anker** (vorher 25) |
| voller Lauf `node tests/run_alle.mjs` | **103 Proben grün, 0 rot, 0 nicht lauffähig** |
| `tests/manual_check.html` | 23 Inline-Blöcke, **0 kaputt** — die Reparatur der Vorsitzung hält |
| Kanon 16 / 17 | **unverändert** — kein Rollout nötig |

Der Rückgabewert des vollen Laufs wurde **direkt** gemessen, nicht hinter einer
Pipe.

---

## Was offen bleibt

1. **Aufgabe 2** — das Andock-Werkzeug im Siegel. Unberührt. Klaus entscheidet
   zwischen „20 Dateien einzeln" und „erst zusammenführen, dann übersetzen".
2. **Die zwei Wappen-Texte** — Emblem deutsch oder mitsprechen?
3. **Der app-eigene Klebstoff** der Lampen in family-project und PWA-Toolpoint.
   Nicht angefasst.
4. **Der Sichttest selbst.** Durch nichts zu ersetzen — diese Sitzung hat nur
   dafür gesorgt, dass er nicht aus dem falschen Grund scheitert.
