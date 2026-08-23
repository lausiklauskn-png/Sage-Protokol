# PULS-Auslagerung August 2026 (3) — die beiden Sitzungen vom 14.08.

Ausgelagert am **2026-08-23** aus `docs/PULS.md` (Schutz-Klausel: 3000 Zeilen —
**auslagern statt kürzen**; die Datei stand bei 3.038). Der Inhalt ist
**wortwörtlich** übernommen, nichts gekürzt und nichts zusammengefasst; die
Git-Historie trägt ihn ohnehin.

Verfahren wie bei den Auslagerungen vom 2026-07-24, 2026-08-14 und 2026-08-17:
Archiv-Datei + Zeiger an der Schnittstelle. Die stehenden Abschnitte („Als
nächstes", „Schnellüberblick", „Endknoten", „Offene Querschnitts-Fragen")
bleiben in `PULS.md` — ausgelagert werden nur Sitzungs-Einträge.

---

## Stand 2026-08-14 (Pflege) — 🗂 PULS ausgelagert: 10.150 → 2.592 Zeilen

**Rolle:** Pflege-Sitzung auf Klaus' Zuruf „PULS.md auslagern". Die Schutz-Klausel
nennt 3000 Zeilen; die Datei stand bei **10.150** — sechs Sitzungen in Folge hatten
das gemeldet, ohne dass es jemand tat.

**Verfahren wie beim letzten Mal, nicht neu erfunden.** Die Mai-Auslagerung vom
2026-07-24 (Klaus' „Option A") hatte den nächsten Schritt sogar vorgezeichnet:
*„Juni könnte in einer Folge-Sitzung ebenso ausgelagert werden (wäre Option B)."*
Genau das ist hier passiert, nur zusätzlich für Juli und den älteren August.

| Archiv-Datei | Inhalt | Zeilen |
|---|---|---|
| `2026-08_puls-auslagerung.md` | Sitzungen 03.–09.08. | 2.290 |
| `2026-07_puls-auslagerung.md` | alle Juli-Sitzungen | 2.731 |
| `2026-06_puls-auslagerung.md` | alle Juni-Sitzungen | 2.608 |

**In PULS bleiben:** die acht jüngsten Sitzungen (14.08. bis 11.08.) und **alle**
Struktur-Sektionen — „Als nächstes", Schnellüberblick, Endknoten, Offene
Querschnitts-Fragen, Schutz-Backlog, Vision-Anker, Archiv-Index. An jeder der drei
Schnittstellen steht ein Zeiger, im Archiv-Index drei Sammel-Zeilen.

**Ausgelagert, NICHT gekürzt** — und das ist nachgerechnet, nicht behauptet:
von **360** Überschriften fehlt **keine**, keine ist erfunden, und von **8.472**
nicht-leeren Zeilen wird **keine einzige** vermisst. Alle **124** Archiv-Verweise
in PULS zeigen auf existierende Dateien. Der Mermaid-Pie-Block ist unberührt (er
wird aus `status.json` erzeugt und nie von Hand angefasst), die **3000er-Grenze
steht unverändert** — sie wurde ausdrücklich nicht herabgesetzt.

**Luft für die Zukunft:** 2.592 von 3.000 Zeilen, also gut 400 frei. Wer die
nächste Auslagerung braucht, nimmt wieder den ältesten Monat.

**Offen:** die vier Modul-23-UI-Kopien (je eine geprüfte Runde pro App) ·
Klaus' Browser-Sichttests.


## Stand 2026-08-14 (Pflege) — 🔓 Sperr-Knöpfe · Automatik-Schalter · drei tote Wächter

**Rolle:** Pflege-Sitzung, Fortsetzung nach PR #843. Übergabeprotokoll:
`docs/sessions/archiv/2026-08-14_sperr-knoepfe-automatik-tote-waechter.md`.

**✅ Klaus' Handgriff ist erledigt:** die neue `marktplatz-api.php` liegt auf
dem Hetzner-Webhosting. Belegt durch die Tat — Klaus schaltete den
Automatik-Schalter ein, der Server nahm `"an": true` an und committete
(Toolpoint `0adfb69`). Kein `bad_key`. Der Punkt stand seit dem 2026-08-12 offen.

**Fünf Merges:**

- **Toolpoint #62** — der Automatik-Schalter darf **benutzt** werden.
  `tests/smoke.mjs` verlangte `_automatik.an === false`; als Auslieferungs-Zustand
  richtig gedacht, aber die Probe läuft bei jedem Push. Beim ersten echten
  Gebrauch wurde `main` rot — und weil `statische-liste.yml` **vor** dem
  Committen prüft, kam der Schalter **nie auf der Seite an**. Ein Wächter, der
  sein eigenes Feature verhindert. Geprüft wird jetzt die **Form**, nicht der
  Anfangswert.
- **family #271** — **Sperr-Knöpfe** im Studio. Server und Datei konnten es
  längst; es fehlte allein die Bedienung. Übernommen, nicht abgeschrieben
  (family: `renderSporen`, `toast()`, `createElement`, de/en). **Vierter Ort**
  der Rangfolge `gruen 0 < nichts 1 < gelb 2 < rot 3`.
- **family #272** — der **Automatik-Schalter**, und zwar mit **drei** Stücken:
  family hatte weder `unterGrenze` noch eine Leistungs-Grenze. Nur das Häkchen
  wäre der tote Knopf gewesen. Gezählt wird der **angezeigte** Wert (sonst
  widerspräche das Band der Zahl daneben); das gerechnete Gelb wird **nie**
  gespeichert.
- **family #273** — **Fehler in der eigenen Arbeit**, gefunden beim Nachprüfen
  des nächtlichen Pfades: eine **fehlgeschlagene** Messung trägt die alten
  Zahlen weiter und zählte den Zähler jede Nacht erneut hoch. Nach drei
  Ausfällen der Leitung hätte ein Band an einer ungemessenen Seite gehangen.
  Der eigene Kommentar hatte davor gewarnt — der Text stimmte, der Code nicht.
- **Sage #847** — **drei** tote Wächter, nicht zwei. `bau23_0b` und
  `bau23c` starben beim Start (DOM-Ersatz überwachsen, und zwar
  **unterschiedlich** verrottet); `resign_spore_v02` meldete **sieben
  gefundene Fehler**, obwohl sie nichts prüfen konnte. **Ursache:** Sage hat 69
  Smokes und nichts, was sie zusammen laufen lässt → neu `tests/run_alle.mjs`
  mit **drei** Ergebnissen (grün · ROT · **nicht lauffähig**).

**Dreimal an einem Tag fand die Gegenprobe eine blinde Stelle in der EIGENEN
Probe** — jedes Mal echt: die Untergrenze des Riegels (greift nur gegen einen
Müll-Wert), die Objekt-Prüfung des Schalters (mein Test las nur, statt zu
schreiben), und eine Toolpoint-Gegenprobe, die eine abgeschaffte Regel bewachte.

**Zahlen:** Toolpoint 593/593 · 253 Wächter 0 blind · family
`smoke_studio_markt` 102 → **182** · neue `gegenprobe_studio_riegel.sh` 19
Wächter 0 blind · Sage `run_alle` 50 grün / **0 rot** / 19 nicht lauffähig, mit
`fake-indexeddb` gegengeprüft **69/69**.

**✅ Nachtrag am selben Tag — `package.json` gebaut (PR #849).** Klaus hat
zugestimmt; der Punkt stand oben noch als „Klaus gefragt, Antwort steht aus"
und wäre für die nächste Sitzung eine falsche Fährte gewesen. Ergebnis:
**70/70 grün** (die neue Wächter-Probe kommt dazu). Damit laufen die 19
Speicher-/Krypto-Härtungen wieder — Modul 01 („Löschen nur bei zweifelsfreier
Leere", Identitäts-Isolierung), 02 (Spore v0.2, Multi-Identität), 20 (Safe),
05 (Nostr).

Zwei Entscheidungen darin: **kein `"type": "module"`** — gemessen, mit dem Feld
fallen zwei Proben um, weil Node dann jede `.js` als ES-Modul liest; ein neuer
Wächter `tests/smoke_package_json.mjs` hält es fest (samt exakter Fassungs-
Nagelung, kein `^`). Und **`package-lock.json` bleibt in `.gitignore`** — eine
bestehende Entscheidung wird nicht still umgedreht; die exakte Nagelung liefert
die Reproduzierbarkeit ohnehin. `CLAUDE.md` § „Die Proben laufen lassen"
erklärt jetzt `npm install`/`npm test` und warum 19 Proben ohne das Paket
**ungeprüft** und nicht **rot** heißen.

**Offen:** die vier Modul-23-UI-Kopien · `PULS.md` bei ~10.100 gegen 3.000
Zeilen (**sechste** Meldung) · Klaus' Browser-Sichttests.

---

> **↓ Ausgelagert am 2026-08-17 — die Sitzungen vom 11. und 12.08.**
>
> Die Einträge stehen **wortwörtlich** in
> [`docs/sessions/archiv/2026-08_puls-auslagerung-2.md`](sessions/archiv/2026-08_puls-auslagerung-2.md).
> Nichts gekürzt, nichts zusammengefasst — die Schutz-Klausel oben verlangt
> **auslagern statt kürzen**, und die Git-Historie trägt es ohnehin.
>
> Ältere Sitzungen: [August 03.–09.](sessions/archiv/2026-08_puls-auslagerung.md)
> · [Juli](sessions/archiv/2026-07_puls-auslagerung.md)
> · [Mai](sessions/archiv/2026-05_puls-auslagerung.md)
