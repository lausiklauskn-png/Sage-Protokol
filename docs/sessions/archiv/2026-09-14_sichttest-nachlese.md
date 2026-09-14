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

---

# Teil 2 — nach Klaus' Entscheidungen (2026-09-14, Nacht)

Klaus hat alle drei Fragen beantwortet. Zwei davon sind in derselben Sitzung
gebaut und ausgerollt; die dritte ist eine eigene Sitzung wert.

| Frage | Entscheidung | Stand |
|---|---|---|
| Das Wappen | **mitsprechen lassen (DE/EN)** | gebaut, in **20 Trägern** ausgerollt |
| Aufgabe 2 · Andock-Werkzeug | **erst zusammenführen, dann übersetzen** | **unberührt** — eigene Sitzung |
| Die Lampen der Marktplätze | **ja, beide** | gebaut, beide gemergt |

---

## 1 · Das Wappen — neuer Kanon `d84fa539e76e`

| | |
|---|---|
| `OFFIZIELLE BESTÄTIGUNG` | → `OFFICIAL ATTESTATION` |
| `SIEGEL` | → `SEAL` — abgestimmt mit Modul 17 |
| `SBKIM` | bleibt — Eigenname |
| `ribbonText` | bleibt — den graviert der Host |

**Die Tafel zuerst, dann der Code** — wie beim Rollout am selben Tag.

`renderWappenSvg()` ist die einzige Ausgabestelle und führt die zwei Texte
durch `T()`. **Auf Deutsch gibt `T()` den Satz unverändert zurück, die
Ersetzung entfällt, das SVG bleibt byte-identisch** — dieselbe Bauart, die der
`ribbonText` seit jeher hat.

⚠ **Gesucht wird `>TEXT<`, nicht der Text allein.** Beide Wörter kommen im SVG
ein zweites Mal außerhalb eines Textknotens vor.

### Der Rollout — 20 Träger, und warum es nicht 19 sind

**BookLedgerPro kam dazu.** Es hing schon vorher **eine Generation zurück**
(kein Sprach-Haken) und fiel deshalb aus dem Raster, das nach der *erwarteten*
Vorgänger-Fassung suchte. Gemessen: seine 35 abweichenden Zeilen waren genau
die, die der Kanon durch `T()` ersetzt — **kein repo-eigener Code**.

> **Ein Rollout, der nur die zählt, die die erwartete Vorgänger-Fassung tragen,
> übersieht die, die noch weiter zurückhängen.**

⚠ **Und BookLedgerPro pinnte seinen EIGENEN sha** (`3e17f6474fc7f96f`), nicht
den von Sage. Die Pin-Suche lief über alle drei Längen des **Sage**-sha und
konnte ihn nicht finden. Gefunden hat ihn die Probe des Repos selbst:
**2181/1, `✗ 16_siegel.js unverändert`.** Der Drift-Guard hat getan, wofür er
da ist.

⚠ **11 von 20 brauchten einen `CACHE_VERSION`-Bump**, gemessen statt geraten,
jeder **+1 gegen `origin/main`** geprüft — nicht gegen die eigene Datei (die
Kollisionsfalle vom 2026-09-07). Beim ersten Messversuch hatte `head -1` in
zwei Repos den **falschen** Service-Worker erwischt; neu gemessen über alle.

---

## 2 · Die Lampen der zwei Marktplätze

| Repo | wo | wie |
|---|---|---|
| family-project | `assets/status-widget.js` | eigenes schlüsselloses `T()`, Rangfolge nur `<html lang>` |
| PWA-Toolpoint | `index.html` + `assets/sprache.js` | über das **vorhandene** `data-i18n`-System |

Gemessen, beide Richtungen:

| | `lang=en` | `lang=de` |
|---|---|---|
| family-projekt.de | **ALIVE · TRAFFIC · FOREIGN · SEAL** | LEBT · VERKEHR · FREMD · SIEGEL |
| pwa-toolpoint.de | **alive · traffic · foreign** | lebt · verkehr · fremd |
| …/auslieferungspruefer | ALIVE · TRAFFIC · FOREIGN · SEAL | LEBT · VERKEHR · FREMD · SIEGEL |

⚠ **Und Toolpoints Wächter schrieb das Wörterbuch ab, statt es abzulesen.**
Eine fest verdrahtete Liste von neun BASIS-Schlüsseln in `tests/smoke.mjs` —
eine zweite Fassung dessen, was in `assets/sprache.js` steht. Sie lief prompt
auseinander (**860/861**). Die Lehre stand in dessen **eigener** Verfassung
schon, an einer anderen Tür. Behoben wurde die **Ursache**.

---

## 3 · Die Wächter

| | vorher | nachher |
|---|---|---|
| `smoke_bau1617_sprache.mjs` | 64 | **83 grün** |
| `gegenprobe_bau1617_sprache.sh` | 25 | **30 gefangen · 0 durchgerutscht · 0 tote Anker** |
| voller Sage-Lauf | 103 | **103 grün, 0 rot** |

**Abschnitt 4** gleicht das Wappen gegen die Tafel ab. **Abschnitt 4b ist neu**
und misst das *wirklich gerenderte* Badge — 4 liest nur den Quelltext und
fände die Zeilen auch dann tadellos, wenn `renderWappenSvg()` gar nicht mehr
gerufen würde. *Ein Wächter, der eine Datei liest, misst nicht, ob sie läuft.*

⚠ **Zwei Gegenprobe-Fälle fingen aus dem falschen Grund.** Beide benannten
einen Wörterbuch-Schlüssel um; damit fiel er zugleich aus Abschnitt 1, und der
**Nachbar-Wächter feuerte zuerst**. Geschärft über `SBKIM` (im Wappen, mit
Absicht ohne Eintrag) und `Pflicht-Module` (Eintrag, nicht im Wappen).

⚠ **Kein Fall zur Abbruch-Bedingung** — benannte Grenze statt Lücke: ohne sie
läuft auf Deutsch ein `replace(">X<", ">X<")`, byte-genau dasselbe. Der Fall
wäre **immer** „nicht gefangen". *Ein Fall, der nichts messen kann, sieht aus
wie Deckung.*

---

## 4 · Eigene Fehler dieser Sitzung

- **Ein `exit=0` kam vom `echo`, nicht vom `node`** — die `| tail`-Falle in
  neuem Kostüm. family-project meldete „grün", während die Probe mit
  `ERR_MODULE_NOT_FOUND` abbrach: **nicht lauffähig, nicht grün.**
- **Eine These wurde von der Messung widerlegt:** „das Wappen erscheint nur in
  Gold-Stufe" — nachgemessen stehen alle drei auf Bronze und zeigen dasselbe
  Wappen. Der Unterschied waren zwei verschiedene Elemente.
- **Die Wegwerf-Kopie der Gegenprobe kannte `docs/` nicht** — alle 25 Fälle
  maßen nichts. Die Ausgangslage-Prüfung hat es gefangen.
- **Der Escape-Filter ließ `\n` durch** — im Quelltext zwei Zeichen, das
  zweite ein „n".

---

## Was offen bleibt

1. **Aufgabe 2** — das Andock-Werkzeug im Siegel. Klaus' Weg steht fest:
   **erst zusammenführen, dann übersetzen.** 20 Dateien, 407–540 Zeilen, davon
   272 gemeinsam. Unberührt.
2. **Der Sichttest** — durch nichts zu ersetzen. Der Ort, an dem er sich lohnt,
   ist jetzt **jede** der drei Seiten.
3. **`docs/PULS.md`** steht bei ~2.970 Zeilen. Die nächste Sitzung lagert aus,
   **bevor** sie schreibt.
