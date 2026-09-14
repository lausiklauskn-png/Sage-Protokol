# PULS-Auslagerung 2026-09-14 (Nacht) — „Sechs Knoten neu signiert"

**Ausgelagert am 2026-09-14**, weil `docs/PULS.md` mit dem Abschluss-Eintrag
dieser Sitzung auf 3.057 Zeilen kam und damit über die 3000-Zeilen-Grenze.
Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt kürzen**:
hier steht der Eintrag **wortwörtlich**, nichts gekürzt, nichts
zusammengefasst.

---

## Stand 2026-09-14 (Haupt-Sitzung) · ✅ SECHS KNOTEN NEU SIGNIERT — ALLE ÜBER 0,80

**Rolle:** Haupt-Sitzung. Acht PRs gemergt, sechs Sporen geprüft, Register
nachgetragen. Kein Modul-Code angefasst.

### 1 · Die acht PRs sind drin

Squash-Merge, in der mit Klaus abgesprochenen Reihenfolge — erst Sage und die
sechs Beschreibungen, PWA Toolpoint zuletzt und allein, damit die eine sichtbare
Layout-Änderung isoliert zu begutachten ist. Die Cache-Nummern wurden vorher
gegen **alle** Remote-Zweige der fünf bumpenden Depots geprüft (NETZWEIT §3a):
jede lag genau eins über der höchsten anderswo, keine Kollision.

### 2 · Klaus hat die sechs Knoten neu signiert — gemessen

| Knoten | Zeichen alt → neu | Raum 2026-09-10 | Depot 2026-09-14 |
|---|---|---|---|
| Alis Moderaum | 270 → 713 | 0,793347 | **0,898099** |
| Perfect Skin Beauty | 265 → 775 | 0,783216 | **0,864960** |
| Perfect Skin Fashion | 273 → 716 | 0,793030 | **0,893998** |
| Muster Werbetechnik | 421 → 864 | 0,793613 | **0,908765** |
| Tomys Hub | 300 → 811 | 0,786371 | **0,893661** |
| Private Brain | 322 → 813 | 0,800773 | **0,908875** |

Jede Spore einzeln geprüft: Signatur gültig · Kennung == `base64url(SHA256(rawPub))`
· kein privater Teil `d` · `key_ops` nur `["verify"]` · Vektorlänge 1.000000 ·
Text byte-gleich mit **beiden** Glue-Dateien auf `main`.

⚠ **DIE ZWEI ZAHLEN HABEN VERSCHIEDENE MESSBEDINGUNGEN, und sie stehen deshalb
in getrennten Feldern.** `matchScore` ist der Raum-Mitschnitt vom 2026-09-10,
`matchScoreDepot` eine Rechnung aus zwei abgelegten Vektoren — kein Handschlag,
kein Mitschnitt. Kalibriert an den alten Sporen trifft die Depot-Rechnung bei
vier Knoten die Raum-Messung auf sechs Stellen; bei **Alis Moderaum**
(0,795460 gegen 0,793347) und **Private Brain** (0,811482 gegen 0,800773) weicht
sie ab — dort ist die im Depot liegende Spore nicht dieselbe, die im Raum stand.
Die neue Zahl ersetzt die alte nicht; sie steht daneben, bis ein Mitschnitt sie
bestätigt.

### 3 · Muster Werbetechnik war das eigene Gegenbeispiel

In `tests/sbkim-beschreibung.smoke.mjs` der Apps steht die These mit Zahlen:
Kim-Bell kommt mit **82** Zeichen auf 0,874864, Muster Werbetechnik mit **421**
auf 0,793613 — weil die 82 das Protokoll nennen und die 421 nicht. Derselbe
Knoten, jetzt mit 864 Zeichen, die SBKIM, Mycel und Sage-Protokol nennen:
**0,908765**. Die These ist damit an ihrem eigenen Gegenbeispiel gemessen, nicht
nur behauptet.

### 4 · Fünf Kennungen waren im Register veraltet

Bei allen ausser Perfect Skin Beauty zeigte `nodeId` auf eine Identität, die die
App nicht mehr hat. Nachgetragen als `previousNodeIds`, damit im Netz
nachvollziehbar bleibt, dass es dieselbe App ist und nicht ein zweiter Knoten.

⚠ **DER BROWSER WAR NICHT DIE URSACHE**, obwohl es so aussah. Klaus meldete, die
erste Runde sei aus dem falschen Browser gekommen; die zweite aus DeX trug bei
Alis Moderaum und Perfect Skin Beauty jedoch **denselben Schlüssel**. DeX-Chrome
und Tablet-Chrome haben also dieselbe Identität — das Register hinkt schlicht
hinterher. Auffällig bleibt, dass der einzige Knoten mit **eigener Domain**
(Perfect Skin Beauty, `perfectskinbeauty.de`) seine Kennung behalten hat und
alle fünf auf der geteilten `github.io`-Adresse nicht. **Die Ursache ist damit
nicht bewiesen**, nur die Korrelation benannt.

### 5 · Ein Befund an Tomys Hub, gefunden an der Spore (behoben, Tomys-Hub#165)

Im Feld `domain` stand `lausiklauskn-png.github.io` — der **Server-Name** statt
des Fachgebiets — und beide Kategorie-Listen waren leer. Älter als die Arbeit
dieses Tages (im Eltern-Commit unverändert).

⚠ **DIE ZAHL WAR NICHT BETROFFEN, und genau deshalb brauchte es Wächter.** Der
Vektor kommt aus der Beschreibung; `domain` und die Kategorien gehen nicht ein.
Belegt durch die Gegenprobe an der Wirklichkeit: nach der Reparatur hat Klaus
neu signiert, drei Felder änderten sich, und der **Vektor blieb byte-gleich**.
Ein Fehler, den keine Messung meldet, fällt ohne Wächter beim nächsten Mal
wieder niemandem auf — sechs Wächter, fünf Gegenprobe-Fälle ergänzt.

### Was offen bleibt

- **Die sechs frischen Sporen liegen noch nicht in den Depots.** `sporeUrl` im
  Register zeigt weiter auf die alten — also auf Dateien mit der alten Kennung.
- **Kein Mitschnitt seit dem 2026-09-10.** Erst ein neuer Raum-Lauf bestätigt die
  Depot-Zahlen; bis dahin stehen sie als das da, was sie sind.
- **Warum die Depot-Rechnung bei Alis Moderaum und Private Brain abweicht** —
  gemessen, nicht erklärt.
- **Perfect Skin Fashion hat zweimal verschieden viele Schnipsel** (6 um 08:25,
  5 um 10:22, Text byte-gleich, Cosinus zueinander 0,994296). Sieht aus wie der
  512-Token-Schnitt, passt aber nicht: Perfect Skin Beauty hat mehr Text und
  mehr Stichworte und behielt seine Liste. Ungeklärt, ohne Folge für die Zahl.
- `Tomys-Hub/tests/smoke-spore-download.cjs` und `smoke-verbund.cjs` bleiben rot
  — auf `main` genauso, je dreimal gemessen.

### Nächster Schritt

Die sechs Sporen in ihre Depots legen (alte als `spore-vorgaenger-2026-09-14.json`
daneben, nie überschreiben), dann einen Mycel-Mitschnitt fahren und die
Raum-Zahlen gegen die Depot-Zahlen halten.

---
