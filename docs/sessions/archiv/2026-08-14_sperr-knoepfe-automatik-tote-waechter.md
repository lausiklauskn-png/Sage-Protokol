# Übergabeprotokoll 2026-08-14 (Teil 2) — Sperr-Knöpfe, Automatik-Schalter, tote Wächter

**Rolle:** Pflege-Sitzung, Fortsetzung. Teil 1 (Modul-23-Kern netzweit) liegt in
`2026-08-12_modul23-kern-netzweit-geschlossen.md`; dieses Protokoll deckt alles
**nach** PR #843 ab.

---

## 1. Klaus' Handgriff hat funktioniert

Der lange offene Punkt ist zu: Klaus hat die neue `marktplatz-api.php` aufs
Hetzner-Webhosting geladen und den Automatik-Schalter zum ersten Mal
eingeschaltet. Der Server nahm `"an": true` an und committete
(`PWA-Toolpoint 0adfb69`, „Studio: Wächter-Quittungen aktualisiert"). Kein
`bad_key`.

---

## 2. Was gebaut wurde (fünf Merges)

| Repo | PR | Was |
|---|---|---|
| PWA Toolpoint | #62 | Der Automatik-Schalter darf benutzt werden |
| family-project | #271 | Sperr-Knöpfe im Studio |
| family-project | #272 | Automatik-Schalter samt Zähler |
| family-project | #273 | Zähler: fehlgeschlagene Nacht zählt nicht mit |
| Sage-Protokol | #847 | Drei tote Wächter + Suite-Läufer |

### PWA Toolpoint #62 — ein Wächter, der sein eigenes Feature verhinderte

Klaus' Schalter funktionierte, und `main` wurde trotzdem rot.
`tests/smoke.mjs` verlangte `_automatik.an === false` („anfangs aus") — als
**Auslieferungs-Zustand** richtig gedacht, aber die Probe läuft bei jedem Push,
und ein Schalter ist zum Umlegen da.

Schlimmer als das rote Kreuz war die Folge: `statische-liste.yml` prüft **vor**
dem Committen, brach also ab, und der gerade eingeschaltete Schalter kam **nie
auf der Seite an**.

Geprüft wird jetzt die **Form** (`an` ist ja/nein, `naechte` 1…30,
`meldungen` 1…100). Die Zusage „anfangs aus" gilt weiter — im Code, der die
Datei liest, wo sie etwas beweist.

### family #271 — Sperr-Knöpfe

Das Studio konnte die Ampel nur **ansehen** und quittieren. Der Server konnte
das Setzen längst für beide Marktplätze, die Datei lag in beiden Repos — es
fehlte allein die Bedienung.

Übernommen, **nicht** abgeschrieben: family hat `renderSporen` statt
`zeichneEintraege`, `toast()` statt `meldung()`, `createElement` statt
HTML-Strings, und Übersetzungen (de/en), die Toolpoint gar nicht hat. Eine
Namensfalle: family hat schon ein `rang(e)` — das ist die **Sortierung**; die
Ampel heißt deshalb `wacheRang`.

**Vierter Ort derselben Rangfolge** (`gruen 0 < nichts 1 < gelb 2 < rot 3`):
`docs/RAUSWURF-REGEL.md` · `wache_rang()` im Server · `WACHE_RANG` in
Toolpoints `studio.js` · jetzt family. Im Code vermerkt.

### family #272 — der Schalter brauchte drei Stücke, nicht eines

Toolpoint bekam ihn zusammen mit dem Werkzeug, das den Zähler führt. family
hatte **weder `unterGrenze` noch eine Leistungs-Grenze**. Nur das Häkchen zu
übernehmen hätte den toten Knopf ergeben, den die Verfassung verbietet.

1. **Zähler** in `tools/messung.mjs` (`GRENZE_LEISTUNG = 50`), als **Mantel**
   um die vorhandene Bildung — sie hat sieben Ausgänge.
2. **Band** in `markt.html`, nach family-Muster zur Laufzeit gezeichnet (nicht
   eingebacken wie bei Toolpoint — dort ging es um Ladesprünge, hier baut die
   Seite die Liste ohnehin neu auf).
3. **Schalter** im Studio, de/en.

Zwei Entscheidungen: **gezählt wird der angezeigte Wert**, nicht der frische —
sonst stünde wegen der Haltefrist ein Band „drei Messungen unter 50" neben
einer 84. Und das **gerechnete Gelb wird nie gespeichert**; in
`wache-hand.json` käme es nie wieder heraus, weil der Riegel nur Verschärfen
zulässt.

### family #273 — ein Fehler in meiner eigenen Arbeit

Beim Nachprüfen des Pfades, der nachts um 02:40 UTC unbeaufsichtigt läuft,
waren zwei von acht Fällen rot.

Schlägt eine Messung fehl, trägt der Bericht die **alten Zahlen** weiter. Meine
Prüfung fragte nur „steht da eine Zahl unter 50?" — und zählte dieselbe alte
Zahl jede Nacht erneut. Nach drei Ausfällen der Leitung hätte ein gelbes Band
an einer Seite gehangen, die seit Tagen niemand gemessen hat.

**Mein eigener Kommentar hatte genau davor gewarnt.** Der Text stimmte, der
Code nicht. Ein Kommentar, der die Absicht beschreibt, ist kein Beweis, dass
sie umgesetzt wurde.

Gefragt wird jetzt der **Lauf** (`roh.ok && roh.zahlen`), nicht der Bericht.

### Sage #847 — drei tote Wächter

`smoke_bau23_0b_identitaet.mjs` und `smoke_bau23c_ki_richter.mjs` starben beim
**Start**; die Modul-23-UI hatte ihren DOM-Ersatz überwachsen. Beide Stubs
waren **unterschiedlich** verrottet (0b fehlte `setAttribute`, 23c
`getElementById`) — zwei Kopien desselben Nachbaus, jede für sich veraltet.

`smoke_resign_spore_v02.mjs` meldete **sieben gefundene Fehler**, obwohl sie
nichts prüfen konnte: das Skript, das sie startet, stirbt selbst am fehlenden
Paket. Sie sah als Kind-Prozess nur den Exit-Code und klagte an.

**Die Ursache:** Sage hat 69 einzelne Smokes und **nichts, was sie zusammen
laufen lässt**. Neu: `tests/run_alle.mjs` mit **drei** Ergebnissen —
grün · ROT · **nicht lauffähig**. Nur ROT setzt den Rückgabewert.

---

## 3. Was die Gegenproben gefunden haben

**Dreimal an einem Tag eine blinde Stelle in der EIGENEN Probe** — jedes Mal
echt, jedes Mal von der Gegenprobe aufgedeckt:

1. **family-Riegel:** die Untergrenze (`< 2`) ließ sich spurlos entfernen, weil
   `gruen` schon vom Richtungs-Vergleich gefangen wird. Sie ist trotzdem nötig
   — gegen einen **Müll-Wert** (Rang −1) wäre `gruen` (0) plötzlich „strenger".
2. **family-Schalter:** die Objekt-Prüfung ließ sich entfernen; mein Test *las*
   einen kaputten Block nur, statt darauf zu **schreiben**. Ohne die Prüfung
   schriebe `autoSetzen` auf einen Text — das verpufft lautlos.
3. **Toolpoint:** die alte Gegenprobe meldete sich selbst als BLIND, weil sie
   eine Regel bewachte, die es nicht mehr geben darf.

Merksatz dazu: eine Prüfung, die dir recht gibt, ist der Ort, an dem du am
genauesten hinsehen musst — und eine Gegenprobe prüft nicht nur den Code,
sondern die Probe.

---

## 4. Zahlen

| | |
|---|---|
| Toolpoint `npm test` | 593/593 · `gegenprobe.sh` 253 Wächter, 0 blind |
| family `smoke_studio_markt` | 102 → **182** |
| family `gegenprobe_studio_riegel.sh` (neu) | **19 Wächter, 0 blind** |
| Sage `run_alle.mjs` (neu) | 69 Proben — 50 grün, **0 rot**, 19 nicht lauffähig |
| Sage mit `fake-indexeddb` gegengeprüft | **69/69 grün** |

Cache-Bumps: family `101 → 103` (zweimal, `studio-markt.js` hängt allein an
seiner `?v=`-Adresse).

---

## 5. Was offen bleibt

1. **`package.json` für Sage** — mit `fake-indexeddb` als
   Entwicklungs-Abhängigkeit würden aus 50/69 sofort **69/69**. Gemessen, nicht
   vermutet. Bewusst nicht mitgeliefert: ändert die Form des Repos, gehört als
   eigene Entscheidung sichtbar gemacht. **Klaus gefragt, Antwort steht aus.**
2. **Vier Modul-23-UI-Kopien** (Kim-Bell · Mein-WorkFloh · SB-KIMTool-Point je
   `f117096e`; BookLedgerPro `c67b2942`) — je eine geprüfte Runde pro App, wie
   am 2026-08-12 festgelegt.
3. **`docs/PULS.md` bei ~10.100 Zeilen** gegen die eigene 3.000er-Grenze.
   Auslagern, nicht kürzen. Sechste Meldung.
4. **Klaus' Browser-Sichttest:** Sperr-Knöpfe und Grund-Feld am Tablet · der
   Automatik-Schalter im family-Studio · das gerechnete Band an einer
   Toolpoint-Karte · Modul 17 auf schmalen Handys.
5. **Der Automatik-Schalter zeigt vorerst nichts** — und das ist richtig: kein
   Eintrag liegt unter 50 (schwächster: Kimboard 78). Er ist da und springt an,
   wenn er gebraucht wird (Klaus: „lieber haben als brauchen").
