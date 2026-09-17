# PULS-Eintrag vom 2026-09-16 — ausgelagert am 2026-09-17

**Wortgleich aus `docs/PULS.md` übernommen, nichts gekürzt.** Ausgelagert, weil der
PULS die Grenze von 3000 Zeilen erreicht hatte; die Grenze wird nicht herabgesetzt
und der Text nicht gestrafft, sondern verschoben. Im PULS steht an dieser Stelle
ein Stummel, der hierher zeigt.

---

## 2026-09-16 · Zwanzig von zwanzig — und vier Wortkarten, die beinahe verschwunden wären

**Klaus:** *„lass uns die 12 noch zu Ende machen."* Davor seine eigentliche
Frage: *„warum machen wir eine Sitzung nach der anderen, ohne dass ein Ergebnis
zu sehen ist?"* — beantwortet, und der Grund gehört hierher: **es gibt für ihn
buchstäblich nichts zu sehen.** Die Übersetzung zeigt sich nur auf einer Seite
mit `lang="en"`, im Fenster hinter der FREMD-Lampe. Auf Deutsch ist alles
Zeichen für Zeichen wie vorher.

### Der Befund, der den Durchgang getragen hat

Vor dem Überschreiben von zwölf Dateien wurde für **jede Fassung** nachgesehen,
ob ihr sha **in Sages Historie steht**. Das war kein Ritual, es war der ganze
Unterschied:

| Fassung | Träger | in Sages Historie? |
|---|---|---|
| `fbf9f42d8a27` | 8 | **ja** — Kanon-Generation vom 2026-07-01 |
| `0f8a3f69de61` | Mein-Rezeptbuch, Muttis-Rezeptbuch | **nein** |
| `33d6fe0c5057` | Mein-Mixarium | **nein** |
| `8a07567f98ce` | family-project | **nein** |

„Nicht in der Historie" heißt: **von Hand geändert.** Und so war es — vier Apps
trugen eine eigene Synonym-Karte mitten in ihrer byte-1:1-Kopie:

- `MR_QUERY_SYNONYMS` (16 Einträge) — Torte↔Kuchen, Plätzchen↔Keks, Suppe↔Eintopf
- `MX_QUERY_SYNONYMS` (12) — Cocktail↔Drink, Limo↔Limonade, Smoothie↔Shake
- `FP_QUERY_SYNONYMS` (11) — kfz↔auto, notebook↔laptop, arznei↔medikament

⚠ **EIN BLINDES BYTE-1:1 HÄTTE SIE ALLE VIER LAUTLOS GELÖSCHT.** Kein Fehler,
keine rote Zeile — die Apps wären still auf den reinen Cosinus zurückgefallen.
Genau das ist der Schaden, vor dem der Kanon in seinem eigenen Kommentar warnt.
Das ist der BookLedgerPro-Fall vom 2026-07-11, **dreifach wiederholt und nie
bemerkt**.

**Die Methode musste dabei selbst geprüft werden.** Der erste Lauf meldete
*alle vier* als „nicht in der Historie" — auch die, die es sind. Ursache: nur
80 Commits eines Pfades durchsucht, und Modul 15 lag früher woanders
(`sbkim-bundle/modules/`). Gefunden durch eine Kontrolle mit **bekannter
Antwort**: `f88b5d04bc08` musste auftauchen, und tat es nicht. *Eine Messung,
die allen dasselbe bescheinigt, misst meistens sich selbst.*

### Was jetzt gilt: die Mechanik im Kanon, die Fachworte bei der App

Seit dem 2026-08-14 trägt Modul 15 `queryInclusion` selbst — Vorgabe `null`,
also aus. Die vier Karten liegen jetzt in `sbkim/sbkim-init.js` und werden an
`init()` übergeben; ihr Inhalt ist Zeichen für Zeichen derselbe.

⚠ **GEMESSEN IM ECHTEN BROWSER, NICHT IM QUELLTEXT.** `_meta.queryInclusion​Configured`
ist `true`, und `queryInclusionSynonymCount` stimmt mit der Karte im Glue
überein — 16 · 16 · 12 · 11. `node --check` hätte davon nichts gezeigt: es
prüft Syntax, nicht ob ein Name existiert.

`tests/smoke_wortkarte.mjs` bewacht den Umzug seitdem in **beide** Richtungen,
in allen vier Apps: die Karte steht **nicht** mehr in der byte-1:1-Kopie, sie
steht im Glue, sie wird übergeben, und sie kommt im laufenden Modul an.
Gemessen wird die **Übereinstimmung, nicht eine genagelte Zahl**.

⚠ **Ein Gegenprobe-Fall traf beim ersten Anlauf den falschen Wächter.** Er
änderte den Glue-Text, den ein früherer Wächter liest — also fiel dieser, nicht
der gemeinte. Berichtigt: er löscht jetzt nur zur **Laufzeit** einen Eintrag,
und dann fällt „es sind GENAU die Einträge aus dem Glue — Glue 16, laufend 15".

### Eine vorhandene Probe hat den Umzug gefangen

family-projects `smoke_a5_antwortpfad.mjs` las die Karte aus `15_membran.js`
und meldete `FAIL: FP_QUERY_SYNONYMS nicht in 15_membran.js gefunden`. Sie
zeigt jetzt auf den neuen Ort — **Tafel-Evolutions-Klausel, im Kopf der Datei
benannt** — und hat eine **zweite Hälfte** bekommen: die Karte darf nicht
zurückwandern. Ohne die wäre sie auch dann grün, wenn jemand sie in die Kopie
zurückschiebt, und das nächste Nachziehen löschte sie wieder.

### Gemessen

| | |
|---|---|
| Fassungen von Modul 15 im Netz | **5 → 1** |
| Träger byte-gleich mit dem Kanon | **0 → 20** |
| Schlusszeile des Verteilers | `20 Repos tragen Kanon-Dateien · 20 schon gleich · 0 haengen zurueck` |

**Proben in allen zwölf Ziel-Repos, nach dem Nachziehen:** Jasons-Tresor 59/0 ·
Kim-Bell 4/0 · Kimboard **31/31** · Kimseek 11/0 · Mein-Tresor 53/0 ·
Mein-WorkFloh 12/0 · Privat-Brain 12/**4** · Tomys-Hub 11 Proben einzeln,
alle 0 · Mein-Rezeptbuch 7/0 · Muttis-Rezeptbuch 3/0 · Mein-Mixarium 8/0 ·
family-project 26/**3**.

Alle roten sind **belegt** nicht von dieser Änderung:

- **Privat-Brains 4** — derselbe Lauf auf dem unveränderten Stand meldet
  dieselben 12/4, die Ausgaben sind **Zeile für Zeile identisch**.
- **family-projects `smoke_markt_vecpack` und `smoke_start`** — beide
  scheitern an `wss://relay.family-projekt.de`; der Egress-Proxy dieser Sitzung
  sperrt das Relais. Rot mit und ohne die Änderung.
- **`smoke_hintergrund` flattert.** ⚠ Der erste Vergleich war unfair: drei
  Läufe mit der Änderung gegen **einen** ohne. Gleich oft gemessen sind es
  **2 von 3 grün auf beiden Seiten** — und der eine rote ohne die Änderung
  fällt an einer *anderen* Zusicherung. Als flatterhaft **benannt, nicht
  repariert**: eine Schwelle in einer Animations-Messung nachzuziehen wäre eine
  Verbreiterung gewesen.

⚠ **Kimboards erster Lauf meldete 21 von 31 ROT — und keine davon war ein
Befund.** Jede rote Zeile lautete `Cannot find package 'playwright-core'`. Das
ist die dritte Spalte: **nicht lauffähig, nicht rot.** Nach dem einmaligen
`npm install --no-save playwright-core` alle 31 grün.

Rückgabewerte **direkt** gelesen. Auf `main` nachgezählt, **bevor** die Zweige
gehoben wurden — bei den vier in **beide** Richtungen: die englische Zeile ist
da, die Wortkarte liegt im Glue, und in der Modul-Kopie steht sie **nicht**
mehr.

### Was offen bleibt

- ⚠ **DER VERTEILER PRÜFT DIE HERKUNFT EINER FASSUNG NICHT VON SELBST.** Dass
  vier Kopien von Hand geändert waren, hat diesmal ein Blick gefunden, kein
  Werkzeug. *Eine Regel, an die man sich erinnern muss, ist keine* — ein
  Wächter „dieser sha steht nicht in Sages Historie, hier liegt Handarbeit"
  gehört in `tools/kanon-verteilen.mjs`. **Nicht gebaut**, weil es über den
  Auftrag hinausging.
- **`smoke_hintergrund`** in family-project flattert (2/3, beidseitig gemessen).
- **Sieben Gegenstellen mit ungelesener Post** seit Juli — unverändert offen.
- **Privat-Brains `modules/net-widget.js`** (838 Zeilen, app-eigen, 0 Treffer
  auf `TEXTE`) und seine 4 vorbestehenden roten Zeilen ·
  **SB-KIMTool-Points 2** · der Rezept-Export ohne Spore ·
  **Mein WorkFlohs `sampleContent()`-Gerüst bleibt ausgeschaltet.**
- **Klaus' Browser-Sichttest.**

**Nächster sinnvoller Schritt:** den Herkunfts-Wächter in den Verteiler bauen —
er hätte den teuersten Fund dieses Tages ohne Zutun gemeldet.
