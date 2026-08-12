# Übergabeprotokoll 2026-08-12 — Modul-23-Kern netzweit geschlossen

**Rolle:** Pflege-Sitzung, Nachzug offener Punkte aus dem Brief
„nach Modul 17". Kein neues Modul, kein Protokoll-Bump.

---

## 1. Was getan wurde

### a) `sbkim-bundle-voll`: Modul 15 + 16 byte-1:1 nachgezogen (Sage #842)

Die Box trug beide Module noch im Stand **vor** der Pflege vom 2026-08-01.

| Datei | Box vorher | Kanon |
|---|---|---|
| `15_membran.js` | 1317 Zeilen | 1566 — es fehlten 249 |
| `16_siegel.js` | 1437 Zeilen | 1443 — es fehlte der Aspekt |

In Modul 15 fehlte das nachvollziehbare Fremdzugriff-Protokoll: die Box rief
noch `recordPostMessageEntry(event, op, nonce, "ignored")` — also den Stand, in
dem alle vier Abweis-Gründe gleich aussahen.

**Beide mussten zusammen wandern.** Der `ZERTIFIKAT_ASPEKTE`-Eintrag vom
2026-08-01 in Modul 16 *behauptet* eine Fähigkeit, die als Code in Modul 15
liegt. Nur 16 zu kopieren hätte das Siegel etwas bezeugen lassen, was in
derselben Box nicht drin ist.

**Der sha-Pin arbeitete gegen den Wächter über ihm.** `smoke_vollbundle.mjs`
pinnte Modul 16 auf `4e11ef0d` — den **alten** Stand. Damit forderte der Pin
genau das, was der byte-1:1-Wächter zwei Zeilen darüber verbietet. Auf
`e67b7266` gehoben.

### b) Modul-23-Kern: Stufe 2b in Kim-Bell + Mein-WorkFloh (Kim-Bell #41, WorkFloh #169)

Beide trugen `bbdf02a8` — **zwei Generationen zurück**, 960 statt 1138 Zeilen.
Ihnen fehlte **Schutz-Plan Stufe 2b**: fremde Karten im Rendezvous-Raum wurden
**gar nicht auf Echtheit geprüft**, und der Raum hatte **keinen Mengen-Deckel**
gegen Karten-Flutung.

**Warum sie beim Rollout am 2026-07-30 durchrutschten:** ihre Kopie heißt
`modules/sbkim-rendezvous.js`, nicht `sbkim/23_rendezvous.js`. Der damalige
Rollout suchte nach dem kanonischen Dateinamen.

### c) PWA Toolpoint: Modul-23-UI auf den Kanon (Toolpoint #36)

Stand auf `1f8b6c68` — dem **vorigen** Kanon. Am 2026-08-12 wurden sechs
Drift-Guards von `1f8b6c68` auf `4882c3b6` gehoben; diese App war nicht dabei,
und zwar **Datei UND Pin**. Der Guard war dadurch in sich stimmig und grün — er
verglich nur zwei gleich alte Dinge.

Damit kommt Klaus' Sprachwahl vom 2026-08-11 ins Netz-Panel (vorher fest der
erste Eintrag = immer Deutsch).

---

## 2. Der Stand jetzt

**Modul-23-Kern: 100 % netzweit auf dem Kanon.** Über alle 33 Repos gemessen,
kein Abweichler. Die Sicherheitslücke ist überall geschlossen.

**Modul-23-UI: vier Kopien bleiben zurück** — und zwar **absichtlich**:

| Repo | sha | Rückstand |
|---|---|---|
| Kim-Bell | `f117096e` | ~780 Zeilen |
| Mein-WorkFloh | `f117096e` | ~780 Zeilen |
| SB-KIMTool-Point | `f117096e` | ~780 Zeilen |
| BookLedgerPro | `c67b2942` | ~152 Zeilen |

Die Sitzung vom 2026-08-12 (Mikrofon-Sprachen) hat sie ausdrücklich
zurückgestellt: *„Ein blinder Überschreiber brächte ungeprüft eine ganze Reihe
anderer Änderungen mit. Das gehört in eine eigene, geprüfte Runde pro App."*
Das gilt weiter und wurde hier **nicht** übergangen.

**Ehrliche Folge für Kim-Bell + Mein-WorkFloh:** die Kartenprüfung **läuft**
jetzt, aber die neuen Ehrlichkeits-Felder (`cardsVerified`, `rejected`) werden
noch **nicht angezeigt**, und die mehrsprachige Mikrofon-Wahl fehlt weiter —
beides sitzt in der UI.

---

## 3. Drei Dinge, die ohne Nachsehen falsch gelaufen wären

### Der Brief nannte 2 Repos — es waren 5

Der Übergabebrief nannte Kim-Bell und Mein-WorkFloh. Ein Scan **nach Inhalt
statt nach Dateiname** über alle 33 Repos fand fünf Abweichler, drei davon nur
auf der UI-Datei (SB-KIMTool-Point, BookLedgerPro, PWA Toolpoint). Das ist
dieselbe Lehre wie im Modul-17-Rollout und sie hat sich sofort wiederholt.

### Ein Sicherheits-Fix, der lautlos nichts getan hätte

Der neue Kern prüft Karten **nur**, wenn Modul 02 `verifyForeignSpore`
mitbringt — sonst setzt er still `cardsVerified: false` und prüft nichts.
Vor dem Kopieren geprüft: beide Apps bringen es mit (je 5 Treffer). Ohne diese
Kontrolle wäre ein Sicherheits-PR entstanden, der grün meldet und nichts
bewirkt.

### Eine Zurückstellung, die wie ein Versäumnis aussah

Die vier zurückliegenden UI-Kopien sahen zunächst nach vergessener Arbeit aus.
Das Archiv der Vorsitzung zeigte: sie waren **bewusst** zurückgestellt, mit
Begründung. Ein „Nachzug" ohne diesen Blick hätte genau den blinden
Überschreiber gebaut, vor dem dort gewarnt wird.

---

## 4. Verifikation (ehrlich, auch was nicht ging)

| Prüfung | Ergebnis |
|---|---|
| `smoke_vollbundle.mjs` | 46/46 (vorher 44/46) |
| Gegenprobe Bundle | alte Fassung → 44/46, beide Wächter beißen |
| Kim-Bell `npm test` | 4/4 · Gegenprobe 3/4 |
| Mein-WorkFloh `npm test` | 6/6 · Gegenprobe 5/6 |
| PWA Toolpoint `npm test` | 476/476 · Drift 12/0 |
| PWA Toolpoint `gegenprobe.sh` | 147 Wächter schlagen an, **0 blind** |
| Sage: alle 69 Smokes | 67 grün, 2 rot — **vorbestehend** |

**Die 2 roten sind nicht durch diese Sitzung verursacht** — auf blankem
`origin/main` gegengeprüft, dort ebenfalls rot:
`smoke_bau23_0b_identitaet.mjs` und `smoke_bau23c_ki_richter.mjs`. Sie brauchen
kein fehlendes Paket, sondern haben einen **selbstgebauten DOM-Ersatz, den die
Modul-23-UI überwachsen hat** (`d.getElementById is not a function`). **Zwei
tote Wächter** — gemeldet, nicht behoben.

**Nebenbefund zur Umgebung:** 19 weitere Sage-Smokes waren nur deshalb rot,
weil `fake-indexeddb` fehlte. Mit dem Paket sind sie grün. Sage hat **keine
`package.json`**, die es mitbrächte — jede Sitzung in einem frischen Container
sieht dieselben 19 falschen Roten.

**Nicht angefasst:** `PROVIDER_MIN_MATCH` / 0.80-Riegel, `PROTOCOL_VERSION`,
`DB_VERSION`, der Kanon selbst.

---

## 5. Was offen bleibt

1. **Modul-23-UI in vier Apps** (siehe Tabelle oben) — eine geprüfte Runde pro
   App, wie 2026-08-12 festgelegt.
2. **Zwei tote Wächter in Sage** — `smoke_bau23_0b_identitaet.mjs` +
   `smoke_bau23c_ki_richter.mjs` brauchen einen DOM-Ersatz, der zum heutigen
   Modul 23 passt.
3. **Keine `package.json` in Sage** — kostet jede Sitzung 19 falsche Rote.
4. **`docs/PULS.md` bei ~10.000 Zeilen** gegen die eigene 3.000er-Grenze.
   Auslagern, nicht kürzen. Fünfte Sitzung, die es meldet.
5. **Klaus' Browser-Sichttest** — Modul 17 auf schmalen Handys, und jetzt
   zusätzlich die Sprachwahl im Netz-Panel von PWA Toolpoint.
6. **`marktplatz-api.php` aufs Webhosting** — unverändert offen, nur Klaus
   kann es.
