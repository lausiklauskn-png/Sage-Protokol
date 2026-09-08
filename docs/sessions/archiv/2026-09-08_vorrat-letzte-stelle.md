# Übergabeprotokoll · 2026-09-08 (Haupt-Sitzung, spät)

**Rolle:** Hauptsitzung in Sage-Protokol.
**Anschluss:** `2026-09-08_geteilter-vorrat-reparatur.md` (Bau-Sitzung, abends).

---

## Auftrag und was daraus wurde

| Auftrag | Ergebnis |
|---|---|
| Klaus' Sichttest nachfragen | **gelaufen** — beide Rezeptbücher online geöffnet, offline gegengeprüft, alles startet |
| Parallel-Sitzung in Kimhub gemergt? | **ja** (#159–#164 auf `main`), also `ansicht.js` repariert |
| `ansicht.js` in beiden Depots | Kimhub #165, kim-hub-company #44 — beide gemergt |
| Abschluss-Scan | **0 von 30 Depots** auf dem geteilten Ursprung |
| Mein-Workfloh-Page fragen | **beantwortet**: benannter Hinweis, umgesetzt in #19 |

---

## Was gemessen wurde

### Der Ausgangsbefund war teilweise anders als der Auftrag ihn nannte

Der Brief nannte für `ansicht.js` zwei Dinge: den Vorrats-Filter und
`getRegistration()` statt `getRegistrations()`.

**Der zweite Teil traf nicht zu.** Gemessen: `unregister` kommt in `ansicht.js`
überhaupt nicht vor; der ⟳ meldet keinen Worker ab, er löscht Vorräte und lädt
mit geänderter Adresse neu. Es gab dort nichts zu ersetzen. Einen Abmelde-Pfad
zu ergänzen wäre neues Verhalten ohne Auftrag gewesen.

Ebenso nannte der Brief die Zeile als `ansicht.js:4232`. Nach den 16 Commits
der Parallel-Sitzung stand sie bei **4292**. Die Nummer wurde gesucht, nicht
geglaubt.

### Die Reparatur

`caches` gehört dem Ursprung. `ansicht.js` ist in Kimhub und kim-hub-company
byte-1:1 dieselbe Datei (Drift-Guard) und **kann** den eigenen Vorrats-Präfix
nicht kennen. Er kommt deshalb vom Wirt:

| Wirt | Marke im `<head>` |
|---|---|
| Kimhub `index.html` | `window.SBKIM_VORRAT_PRAEFIX = "kimhub-werkstatt-"` |
| kim-hub-company `index.html` | `"kim-hub-company-"` |

Den Tausch macht Kimhubs Ableiter `tools/company-schale-bauen.mjs`, nicht eine
Handarbeit im Zieldepot — eine Handarbeit neben einem Ableiter ist eine zweite
Fassung, die auseinanderläuft. Der Ableiter bricht ab, wenn er den Anker nicht
findet.

Ohne die Marke wird **nichts** gelöscht (fail-soft). Der ⟳ wirkt trotzdem: die
geänderte Adresse ist für den Cache eine andere Datei.

**Zum Namen.** `SBKIM_VORRAT_PRAEFIX` ist die netzweite Marke — Modul 22 liest
sie genauso, und `tools/vorrat-scan.mjs` erkennt sie namentlich (Zeile 117).
Kimhub trägt kein SBKIM-Modul, und die naheliegende Alternative wäre
`__WERKSTATT_VORRAT` gewesen, passend zum vorhandenen `__WERKSTATT_DB`
daneben. Dagegen sprach der Scanner: ein zweiter Name für dieselbe Sache
käme dort als **„unklar"** an, und „unklar" heisst nach der eigenen Regel
dieses Netzes nicht „ok". Die Abweichung ist damit benannt, nicht
stillschweigend getroffen.

### Der Wächter misst die Wirkung, nicht den Quelltext

`tests/smoke_ansicht.mjs` legt im echten Browser drei Vorräte an
(`meinrezeptbuch-v63`, `mixarium-sw-v12`, `kimhub-werkstatt-v1`), drückt den ⟳
und liest danach `caches.keys()`.

**Beide Richtungen**, und die zweite ist die, die man vergisst: „der fremde
Vorrat bleibt" allein wäre auch dann grün, wenn der ⟳ überhaupt nichts mehr
löscht — dann wäre der Knopf still kaputt. Also muss der eigene alte Vorrat
auch wirklich weggehen.

Dazu die Fail-soft-Richtung: die Marke wird per `route()` aus der
**ausgelieferten** Seite geschnitten (nicht per `addInitScript` — das
inline-Skript liefe danach und überschriebe die Änderung), und die Probe prüft
zuerst, dass der Schnitt wirklich gegriffen hat. Ein Gegenprobe-Aufbau, der
nichts verändert, sieht aus wie eine bestandene Prüfung.

---

## Zahlen

| Depot | Probe | Ausgangslage | nachher |
|---|---|---|---|
| Kimhub | `node tests/alle.mjs` | 2071 grün · 0 rot · 0 nicht lauffähig | **2075 grün · 0 rot · 0 nicht lauffähig** |
| Kimhub | 4 neue Gegenprobe-Fälle (`fallb`, Filter `ansicht`) | — | **4 gefangen · 0 durchgerutscht** |
| Kimhub | Anker-Lauf `NUR_ANKER=1` | — | 860 Anker geprüft, **0 tot** |
| kim-hub-company | `npm test` | — | **23 grün · 0 rot** |
| Mein-Workfloh-Page | `npm test` | — | **82 grün · 0 rot** |
| Mein-Workfloh-Page | eigene Gegenprobe | — | **8 gefangen · 0 durchgerutscht** |
| Sage | `node tools/vorrat-scan.mjs` | 3 Depots | **0 von 30** auf geteiltem Ursprung |

**Beleg für den unberührten Baum:** `md5sum` der sechs angefassten
Kimhub-Dateien vor und nach dem Gegenprobe-Lauf gleich.

Die vier Fälle laufen als `fallb` mit `FALLB_FILTER="ansicht"`. Der Wächter
sitzt im Browser, und `fall` fährt mit `WERKSTATT_OHNE_BROWSER=1` — dort
könnte er nichts messen. Das ist die fünfte der sieben Arten, wie ein
Gegenprobe-Fall nichts misst.

---

## Zwei eigene blinde Wächter

**1 · Der Betreiber-Daten-Wächter prüfte nur die erste Fundstelle.** In
`tests/muster_hinweis.mjs` fragte er, ob „Nitzsche" **vor** `<html>` steht —
also im Kopf-Kommentar. Er wäre für jede weitere Stelle dahinter grün
geblieben, auch für eine im Impressum, also genau dort, wo es zählt. Aufgefallen
ist es nur daran, dass die Ausgabe „(2×)" nannte und die Prüfung trotzdem grün
war. **Eine Zahl, die nicht zur Aussage passt, ist der Ort, an dem man
hinsieht.** Er misst jetzt jede Stelle und erlaubt genau zwei: den
Kopf-Kommentar und den `_CR`-Block. Beide sagen, wem die *Vorlage* gehört —
Klaus' Copyright, ausdrücklich gewollt.

**2 · Der Company-Wächter auf `version.json` hat mich erwischt.** Ich hatte die
Fingerabdrücke im Drift-Guard nachgezogen und den Stand vergessen; `npm test`
wurde rot. Genau der Fall, für den er am 2026-09-06 gebaut wurde („die Seite
meldete einen Stand von vorgestern Mittag"). **Rot statt still falsch, wie
vorgesehen** — und `tools/version-schreiben.mjs` schreibt nur mit
`--schreiben`, sonst gibt es nur aus.

---

## Mein-Workfloh-Page

Klaus' Antwort auf die Frage: **benannter Hinweis auf der Seite**, keine echten
Betreiber-Angaben in einer firmenneutralen Vorlage.

Beim Umsetzen kam ein zweiter Befund dazu, nach dem niemand gefragt hatte: das
Impressum versprach, die vollständigen Angaben würden *„vor Veröffentlichung
ergänzt"*. Der Satz war richtig, solange die Seite ein Entwurf war — sie ist
seit langem veröffentlicht und im Marktplatz gelistet. **Eine Zusage auf einen
Zeitpunkt, der vorbei ist, liest sich wie eine Auskunft und ist keine.**
Dieselbe Sorte Satz wie „ein privates Depot liefert keine Seite aus".
Richtiggestellt in Impressum und Datenschutz.

Das Band steht als echtes HTML im Dokument (ein nachgetragenes Band schöbe die
Seite — in PWA Toolpoint hat das einmal CLS 0,136 gekostet), oben vor dem
ersten Inhalt, und ist nicht wegklickbar: ein Hinweis, den der erste Klick
abschaltet, ist beim zweiten Besucher wieder da und beim ersten schon weg.

---

## Cache-Bumps, jeder mit Grund

| Depot | | Warum |
|---|---|---|
| Kimhub | v41 → v42 | `index.html` und `ansicht.js` liegen im Vorrat |
| kim-hub-company | v43 → v44 | dieselben beiden Dateien |
| Mein-Workfloh-Page | v9 → v10 | `index.html` liegt im Vorrat |

Jeder gegen `origin/main` geprüft, nicht gegen die eigene Datei — am
2026-09-07 haben zwei Sitzungen unabhängig dieselbe Nummer vergeben.

---

## Was offen bleibt

- **Klaus' Sichttest der heutigen Änderungen.** Der Sichttest der
  Rezeptbücher ist gelaufen und in Ordnung; Werkstatt, Company und die
  Muster-Seite hat er noch nicht gesehen. Besonders das Band über der
  Kopfleiste: ein neues Element dort wirkt auf schmalem Schirm oft anders als
  gedacht.
- **Die drei Stellen auf eigener CNAME** (PWA-Toolpoint ×2,
  Perfect-Skin-Beauty ×1) — nicht angefasst, wie beauftragt. Kein Befund,
  solange die Depots dort liegen; wer eines auf den geteilten Ursprung zieht,
  zieht die Stelle mit.
- Unverändert aus dem Protokoll davor: zwei offene Tabs überschreiben
  einander die Stechuhr still · Kimhubs eigenes Impressum · der
  Toolpoint-Eigenschaften-Lauf kennt „Impressum erreichbar" nicht als Merkmal.

## PRs

| | |
|---|---|
| `Kimhub#165` | gemergt (`60d6d2a`) |
| `kim-hub-company#44` | gemergt (`949d464`) |
| `Mein-Workfloh-Page#19` | gemergt (`12dcc16`) |

Ein Depot, ein PR, je Depot die eigene Suite. Kein Sammel-PR.
