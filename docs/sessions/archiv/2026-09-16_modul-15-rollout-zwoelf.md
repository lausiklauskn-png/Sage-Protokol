# Übergabeprotokoll — 2026-09-16 · Modul 15 in allen zwanzig Trägern

**Rolle:** Hauptsitzung · **Zweig:** `claude/modul15-rollout-entscheidung-k7m2`
**Zweig in den zwölf Apps:** `claude/sage-modul-15-rollout-jmecb1`

Fortsetzung von [`2026-09-16_modul-15-rollout-acht.md`](2026-09-16_modul-15-rollout-acht.md).

---

## Der Auftrag

Klaus: *„lass uns die 12 noch zu Ende machen und dann berichte mir, wenn wir
damit fertig sind."*

Davor stand seine eigentliche Frage, und sie gehört ins Protokoll, weil sie
eine Lücke in der Arbeitsweise benennt: *„warum machen wir eine Sitzung nach
der anderen, ohne dass ein Ergebnis zu sehen ist? … ein Zwischenstand war das
auch nicht direkt."*

Er hatte recht. Der Grund, warum er nichts sieht, ist sachlich — die
Übersetzung zeigt sich **nur** auf einer Seite mit `lang="en"`, im Fenster
hinter der FREMD-Lampe; auf Deutsch ist alles Zeichen für Zeichen wie vorher.
**Das hätte vor der Frage gesagt werden müssen, nicht danach.**

---

## Der Befund, der den Durchgang getragen hat

Vor dem Überschreiben von zwölf byte-1:1-Kopien wurde für **jede Fassung**
nachgesehen, ob ihr sha **in Sages eigener Historie steht**:

| Fassung | Träger | in Sages Historie? |
|---|---|---|
| `fbf9f42d8a27` | 8 | **ja** — Kanon-Generation vom 2026-07-01 |
| `0f8a3f69de61` | Mein-Rezeptbuch, Muttis-Rezeptbuch | **nein** |
| `33d6fe0c5057` | Mein-Mixarium | **nein** |
| `8a07567f98ce` | family-project | **nein** |

„Nicht in der Historie" heißt: **von Hand geändert.** Und so war es. Vier Apps
trugen eine eigene Synonym-Karte mitten in der Kopie:

| App | Karte | Einträge |
|---|---|---|
| Mein-Rezeptbuch · Muttis-Rezeptbuch | `MR_QUERY_SYNONYMS` | 16 |
| Mein-Mixarium | `MX_QUERY_SYNONYMS` | 12 |
| family-project | `FP_QUERY_SYNONYMS` | 11 |

⚠ **EIN BLINDES BYTE-1:1 HÄTTE ALLE VIER LAUTLOS GELÖSCHT** — kein Fehler,
keine rote Zeile, nur ein stiller Rückfall auf den reinen Cosinus-Pfad. Das ist
der BookLedgerPro-Fall vom 2026-07-11, **dreifach wiederholt und nie bemerkt**.
Der Kanon warnt in seinem eigenen Kommentar wörtlich davor.

### Die Methode musste selbst geprüft werden

Der erste Lauf meldete **alle vier** als „nicht in der Historie" — auch die,
die es ist. Ursache: nur 80 Commits **eines** Pfades durchsucht, und Modul 15
lag früher woanders (`sbkim-bundle/modules/`).

Gefunden durch eine **Kontrolle mit bekannter Antwort**: `f88b5d04bc08` musste
auftauchen und tat es nicht. *Eine Messung, die allen dasselbe bescheinigt,
misst meistens sich selbst.*

---

## Was gebaut wurde

### Gruppe 1 — acht Repos, saubere Kanon-Generation

Jasons-Tresor · Kim-Bell · Kimboard · Kimseek · Mein-Tresor · Mein-WorkFloh ·
Privat-Brain · Tomys-Hub. Byte-1:1 nachgezogen: **+546 Zeilen, −20 ersetzt**
(14 deutsche Anzeige-Sätze, fünf Aufrufe mit zusätzlichem Detail-Feld, eine
Konsolen-Zeile).

Die einzige Logik-Änderung ist die `queryInclusion`-Kaskade, **Vorgabe `null`
= aus**. Keines der acht stellt sie ein; das Verhalten bleibt byte-gleich.

### Gruppe 2 — vier Repos, Umzug statt Kopie

Kanon byte-1:1 **und** die Wortkarte in den app-eigenen `sbkim/sbkim-init.js`
gehoben, übergeben als `init({ queryInclusion: { synonyms: … } })`. Inhalt
Zeichen für Zeichen derselbe.

⚠ **GEMESSEN IM ECHTEN BROWSER, NICHT IM QUELLTEXT.**
`_meta.queryInclusionConfigured` ist `true`, `queryInclusionSynonymCount`
stimmt mit der Karte im Glue überein — **16 · 16 · 12 · 11**. `node --check`
hätte davon nichts gezeigt: es prüft Syntax, nicht ob ein Name existiert.

### `tests/smoke_wortkarte.mjs` — neu in allen vier

Ohne ihn wäre der Umzug eine Behauptung. Sechs Zusicherungen in **beide**
Richtungen: die Karte steht **nicht** mehr in der byte-1:1-Kopie · sie steht im
Glue · sie wird übergeben · sie hat Einträge · das laufende Modul hat sie
bekommen · **und es sind genau die aus dem Glue**.

⚠ Gemessen wird die **Übereinstimmung, nicht eine genagelte Zahl** — ein festes
„16" wäre beim ersten neuen Synonym rot, ohne dass eine Zusicherung gefallen
wäre.

Vier Gegenprobe-Fälle in einer Wegwerf-Kopie nachgestellt. ⚠ **Einer traf beim
ersten Anlauf den falschen Wächter:** er änderte den Glue-Text, den ein
früherer Wächter liest, also fiel dieser statt des gemeinten. Berichtigt — er
löscht jetzt nur zur **Laufzeit** einen Eintrag.

### Eine vorhandene Probe hat den Umzug gefangen

family-projects `smoke_a5_antwortpfad.mjs` las die Karte aus `15_membran.js`:
`FAIL: FP_QUERY_SYNONYMS nicht in 15_membran.js gefunden`. Sie zeigt jetzt auf
den neuen Ort — **Tafel-Evolutions-Klausel, im Kopf der Datei benannt** — und
hat eine **zweite Hälfte** bekommen: die Karte darf nicht zurückwandern.

---

## Gemessen

| | |
|---|---|
| Fassungen von Modul 15 im Netz | **5 → 1** |
| Träger byte-gleich mit dem Kanon | **0 → 20** |
| Schlusszeile | `20 Repos tragen Kanon-Dateien · 20 schon gleich · 0 haengen zurueck` |

**Proben in allen zwölf Ziel-Repos:**

| Repo | Ergebnis |
|---|---|
| Jasons-Tresor | 59 / 0 |
| Kim-Bell | 4 / 0 |
| Kimboard | **31 / 31 grün** |
| Kimseek | 11 / 0 |
| Mein-Tresor | 53 / 0 |
| Mein-WorkFloh | 12 / 0 |
| Privat-Brain | 12 / **4** — vorbestehend |
| Tomys-Hub | 11 Proben einzeln, alle Rückgabewert 0 |
| Mein-Rezeptbuch | 7 / 0 |
| Muttis-Rezeptbuch | 3 / 0 |
| Mein-Mixarium | 8 / 0 |
| family-project | 26 / **3** — alle drei nicht von dieser Änderung |

### Jede rote Zeile ist belegt, nicht weggeredet

- **Privat-Brains 4:** derselbe Lauf auf dem unveränderten Stand meldet
  dieselben 12/4, die Ausgaben sind **Zeile für Zeile identisch**.
- **family-projects `smoke_markt_vecpack` und `smoke_start`:** beide scheitern
  an `wss://relay.family-projekt.de` — der Egress-Proxy dieser Sitzung sperrt
  das Relais. Rot mit und ohne die Änderung.
- **`smoke_hintergrund` flattert.** ⚠ Der erste Vergleich war **unfair**: drei
  Läufe mit der Änderung gegen **einen** ohne. Gleich oft gemessen sind es
  **2 von 3 grün auf beiden Seiten**, und der eine rote ohne die Änderung fällt
  an einer *anderen* Zusicherung.

⚠ **Kimboards erster Lauf meldete 21 von 31 ROT — und keine davon war ein
Befund.** Jede rote Zeile lautete `Cannot find package 'playwright-core'`: die
dritte Spalte, **nicht lauffähig, nicht rot**. Nach dem einmaligen
`npm install --no-save playwright-core` alle 31 grün.

Rückgabewerte **direkt** gelesen. Vor jedem Commit die **Dateiliste** angesehen
— die von `npm install` erzeugten `package-lock.json` sind dadurch draußen
geblieben. Auf `main` nachgezählt, **bevor** die Zweige gehoben wurden, bei den
vier in beide Richtungen.

---

## Was offen bleibt

- ⚠ **DER VERTEILER PRÜFT DIE HERKUNFT EINER FASSUNG NICHT VON SELBST.** Dass
  vier Kopien Handarbeit trugen, hat ein Blick gefunden, kein Werkzeug. *Eine
  Regel, an die man sich erinnern muss, ist keine.* **Nicht gebaut**, weil es
  über den Auftrag hinausging — das ist der nächste sinnvolle Schritt.
- **`smoke_hintergrund`** in family-project flattert (2/3, beidseitig gemessen)
  — als Befund benannt, nicht repariert.
- **Sieben Gegenstellen mit ungelesener Post** seit Juli: BookLedgerPro 23>18 ·
  SB-KIMTool-Point 36>24 · Family Projekt 7>2 · Jasons-Tresor 14>11 ·
  Mixarium 14>6 · Rezeptbuch 13>5 · Mein-Tresor 17>14.
- **Privat-Brains `modules/net-widget.js`** (838 Zeilen, app-eigen, 0 Treffer
  auf `TEXTE`) — vom Kanon nicht erreichbar, eigene Entscheidung.
- **Privat-Brains 4** und **SB-KIMTool-Points 2** vorbestehende rote Zeilen.
- **Der Rezept-Export trägt die Spore nicht.**
- **Mein WorkFlohs `sampleContent()`-Gerüst bleibt ausgeschaltet.**
- **Klaus' Browser-Sichttest** — ob das Fenster auf einer englischen Seite
  wirklich englisch dasteht, sieht nur er.

---

## Nächster sinnvoller Schritt

Den **Herkunfts-Wächter** in `tools/kanon-verteilen.mjs` bauen: meldet, wenn
der sha einer Kopie nicht in Sages Historie steht, und hält sie zurück statt
sie zu überschreiben. Er hätte den teuersten Fund dieses Tages ohne Zutun
gemeldet — und wird ihn beim nächsten Modul wieder brauchen.


---

## Nachtrag am selben Tag — der Wächter ist gebaut

Klaus: *„ja, bau den Herkunfts-Wächter noch ein."*

`tools/kanon-verteilen.mjs` hält seitdem vor jedem Schreiben den sha jeder
Kopie gegen Sages eigene Historie. **An den echten vier nachgestellt**: er
meldet `33d6fe0c5057`, `0f8a3f69de61` (zweimal) und `8a07567f98ce` — und
**nicht** Kimboard und Kimseek, die auf der echten Kanon-Generation
`fbf9f42d8a27` standen.

Drei Ausgänge statt zwei (war Kanon · Handarbeit · nicht prüfbar), die Suche
kennt alle Pfade, unter denen eine Datei je lag, `--handarbeit-gesichert` ist
der ausdrückliche Weg daran vorbei, und der Rückgabewert ist 1 auch im
Schreib-Gang.

**Benannte Grenze:** der Klon ist flach; was hinter der Abschneide-Grenze
liegt, sieht die Prüfung nicht. Der Lauf schreibt das dazu.

Gemessen: `smoke_kanon_verteilen` **65 grün** (vorher 53) · Gegenprobe **28
gefangen · 0 durchgerutscht · 0 tote Anker** (vorher 21) · `run_alle` **107/107
grün**.

Damit ist der Punkt, den dieses Protokoll als nächsten Schritt nannte,
erledigt. Der nächste ist jetzt der **Briefkasten**.
