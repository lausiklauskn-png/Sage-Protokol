# Übergabeprotokoll 2026-09-14 — Sechs Knoten neu signiert, alle über 0,80

**Rolle:** Haupt-Sitzung.
**Spanne:** erster bis letzter Commit dieser Sitzung. ⚠ Das ist **nicht** Klaus'
Arbeitszeit — beide überschneiden sich, sind aber nicht dasselbe.

---

## Was getan

### 1 · Acht PRs gemergt

Squash, in der abgesprochenen Reihenfolge: Sage-Protokol #984 · Alis-Moderaum #54
· Perfect-Skin-Beauty #55 · Perfect-Skin-Fashion #27 · Mein-Workfloh-Page #20 ·
Tomys-Hub #164 · Privat-Brain #84 · **PWA-Toolpoint #106 zuletzt und allein**,
damit Klaus die eine sichtbare Layout-Änderung (CLS 0,062 → 0) isoliert
begutachten kann.

Vorher geprüft: die Cache-Nummern der fünf bumpenden Depots gegen **alle**
Remote-Zweige, nicht nur `main` (NETZWEIT §3a, nach dem Kimhub-Vorfall vom
2026-09-07, als zwei Sitzungen unabhängig v26 vergaben). Jede lag genau eins über
der höchsten anderswo — Alis v7>v6, Workfloh-Page v11>v10, Tomys v36>v35,
Privat-Brain v54>v53, PWA-Toolpoint v47>v46.

### 2 · Sechs Sporen geprüft, jede einzeln

Klaus hat über das Siegel neu signiert. Je Spore gemessen: Signatur gültig ·
`id == base64url(SHA256(rawPub))` · kein privater Teil `d` · `key_ops` nur
`["verify"]` · Vektor 384 Stellen, L2 = 1.000000 · Beschreibung **byte-gleich mit
beiden Glue-Dateien** auf `main`.

| Knoten | Zeichen | Raum 2026-09-10 | Depot 2026-09-14 |
|---|---|---|---|
| Alis Moderaum | 270 → 713 | 0,793347 | **0,898099** |
| Perfect Skin Beauty | 265 → 775 | 0,783216 | **0,864960** |
| Perfect Skin Fashion | 273 → 716 | 0,793030 | **0,893998** |
| Muster Werbetechnik | 421 → 864 | 0,793613 | **0,908765** |
| Tomys Hub | 300 → 811 | 0,786371 | **0,893661** |
| Private Brain | 322 → 813 | 0,800773 | **0,908875** |

**Muster Werbetechnik war das eigene Gegenbeispiel der These.** In den Proben der
Apps steht sie mit Zahlen: Kim-Bell kommt mit 82 Zeichen auf 0,874864, Muster
Werbetechnik mit 421 auf 0,793613 — weil die 82 das Protokoll nennen und die 421
nicht. Derselbe Knoten, jetzt 864 Zeichen mit SBKIM, Mycel und Sage-Protokol:
**0,908765**. Gemessen, nicht behauptet.

### 3 · Register nachgetragen

Fünf von sechs `nodeId`-Einträgen waren veraltet; die alten stehen als
`previousNodeIds` daneben, damit im Netz nachvollziehbar bleibt, dass es dieselbe
App ist und nicht ein zweiter Knoten.

### 4 · Ein Befund an Tomys Hub (behoben, Tomys-Hub#165)

`domain` trug den **Server-Namen** statt des Fachgebiets, beide Kategorie-Listen
waren leer. Älter als die Arbeit dieses Tages. Behoben, Cache-Bump v36 → v37,
sechs Wächter und fünf Gegenprobe-Fälle ergänzt.

---

## ⚠ Was dabei schiefging — drei eigene Fehler

**1 · Eine Theorie zweimal aufgestellt und zweimal widerlegt.** Zuerst hiess es,
alle `github.io`-Knoten hätten ihre Identität verloren (Perfect Skin Beauty auf
eigener Domain nicht); auf Klaus' Hinweis „falscher Browser" fallen gelassen;
dann zeigte die DeX-Spore von Alis Moderaum **denselben Schlüssel** wie die aus
dem anderen Browser — der Browser war es also nicht. Die Korrelation mit der
geteilten Adresse steht weiter da, die **Ursache ist nicht bewiesen**.

**2 · Eine Abweichung mit einem Befund verknüpft, der nichts damit zu tun hat.**
Dass die Alis-Depot-Rechnung von der Raum-Messung abweicht, wurde als „passt zum
Kennungs-Befund" gemeldet. Perfect Skin Fashion hat die Kennung **auch**
gewechselt und trifft die Raum-Zahl auf sechs Stellen. Die beiden Dinge haben
nichts miteinander zu tun.

**3 · Der gemeldete Rückgabewert war der von `basename`.** In
`printf ... "$(basename $t)" "$?"` läuft die Klammer-Auswertung **vor** `$?` und
setzt ihn auf 0. Zwei Proben wurden dadurch fälschlich als „auf `main` grün"
gemeldet — also so, als hätte die eigene Änderung sie umgeworfen. Sauber
gemessen, je dreimal in beiden Bäumen: **1 · 1 · 1** hier wie dort. Dieselbe
Falle wie `| tail`, in anderem Kostüm; sie steht in diesem Netz schon zweimal
aufgeschrieben und ist trotzdem wieder zugeschnappt.

---

## ⚠ Zwei Zahlen, zwei Messbedingungen

`matchScore` ist der **Raum**-Mitschnitt vom 2026-09-10 — was ein Knoten im
Rendezvous-Raum angesagt hat. `matchScoreDepot` ist eine **Rechnung aus zwei
abgelegten Vektoren**: kein Handschlag, kein Mitschnitt. Die neue Zahl **ersetzt
die alte nicht**, sie steht daneben.

Kalibriert an den alten Sporen: bei Perfect Skin Beauty, Perfect Skin Fashion,
Muster Werbetechnik und Tomys Hub trifft die Depot-Rechnung die Raum-Messung auf
sechs Stellen. Bei **Alis Moderaum** (0,795460 gegen 0,793347) und **Private
Brain** (0,811482 gegen 0,800773) weicht sie ab — dort ist die im Depot liegende
Spore nicht dieselbe, die im Raum stand.

---

## Was NICHT gemessen ist

- **Der Live-Handshake.** Ob die sechs mit den neuen Zahlen im Raum wirklich
  andocken, sieht nur Klaus' Browser. **Sein Sichttest ist nicht ersetzbar.**
- **Warum die Depot-Rechnung bei zwei Knoten abweicht.** Gemessen, nicht erklärt.
- **Perfect Skin Fashion hat zweimal verschieden viele Schnipsel** (6 um 08:25,
  5 um 10:22, Text byte-gleich, Cosinus zueinander 0,994296). Sieht nach dem
  512-Token-Schnitt aus, passt aber nicht: Perfect Skin Beauty hat mehr Text und
  mehr Stichworte und behielt seine Stichwort-Liste. Ohne Folge für die Zahl
  (0,892662 gegen 0,893998).
- `Tomys-Hub/tests/smoke-spore-download.cjs` und `smoke-verbund.cjs` bleiben rot,
  auf `main` genauso.

---

## Nächster sinnvoller Schritt

1. **Die sechs frischen Sporen in ihre Depots legen** — die alten als
   `spore-vorgaenger-2026-09-14.json` daneben, **nie überschreiben**. `sporeUrl`
   im Register zeigt sonst weiter auf Dateien mit der alten Kennung.
2. **Einen Mycel-Mitschnitt fahren** und die Raum-Zahlen gegen die Depot-Zahlen
   halten. Erst dann steht `matchScore` wieder auf derselben Grundlage wie die
   übrigen 16 Knoten.
3. **Klaus' Sichttest für PWA Toolpoint** (Startseite, Suchzeile springt nicht
   mehr) steht weiter aus.
