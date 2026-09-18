# PULS-Eintrag vom 2026-09-16 (Einstellungs-Bildschirm) — ausgelagert am 2026-09-18

**Wortlaut unverändert.** Dieser Eintrag stand bis zum 2026-09-18 in
`docs/PULS.md` in voller Länge (74 Zeilen). Die Datei stand bei 3.033 von
3.000 — **ausgelagert, nicht gekürzt**; die Grenze wird nicht herabgesetzt.

---

## 2026-09-16 · Der Einstellungs-Bildschirm sprach stellenweise nur Deutsch — und der Tagesabschluss

**Sitzungs-Rolle:** Hauptsitzung (Abschluss). **Repos:** Mein-Rezeptbuch,
Muttis-Rezeptbuch, Mein-Mixarium, Kimhub.

**Klaus mit Bild aus der englischen Oberfläche:** *„Mit dem Netzwerk verbinden
in Einstellungen ist nicht übersetzt worden und genauso Mistral-Schlüssel"* ·
*„Und Werkzeuge und Pinnwand. Die beschreibenden Texte sind auch nicht
übersetzt."*

### Der Mechanismus, und wo er still durchfällt

Übersetzt wird eine Beschriftung, wenn **beides** stimmt: sie trägt eine `id`,
**und** diese id steht in der Namensliste des Setzers. Fehlt eines von beidem,
bleibt sie **still deutsch** — kein Fehler, keine rote Zeile.

| | Beschriftungen ohne Schlüssel | nachgetragen |
|---|---|---|
| Mein Rezeptbuch | 13 | 11 Schlüssel × 8 Sprachen |
| Muttis Rezeptbuch | **5** | 3 Schlüssel × 8 Sprachen |
| Mein Mixarium | 14 | 14 Schlüssel × 8 Sprachen |

**Muttis Rezeptbuch stand anders da**, und das ist kein Flüchtigkeitsfehler: die
Abschnitte Netzwerk und Werkzeuge gibt es dort gar nicht.

⚠ **ZWEI FUNDE, DIE KLAUS NICHT GENANNT HATTE**, beide vom neuen Wächter:
`updateStatus` trug seinen deutschen Satz fest im Markup (beide Rezeptbücher),
und in Mixarium war die **ganze Jugendschutz-Zeile** nie übersetzt — sie hat
eine `id` und trotzdem keinen Schlüssel. *Eine Inventur nach „Beschriftungen
ohne id" sieht so etwas nicht.*

⚠ **UND MEIN ERSTER WÄCHTER FRAGTE NACH DEM NAMEN STATT NACH DER WIRKUNG.** Er
verlangte „trägt die Zeile eine id, die ein LANGS-Schlüssel ist?" — und meldete
drei Zeilen als stumm, die sehr wohl übersetzt werden: sie hängen an einem
Schlüssel mit **anderem** Namen. *Ein Wächter auf den Namen misst nicht, was ein
Nutzer erlebt, und er meldet in die falsche Richtung.* Gemessen wird jetzt
derselbe Bildschirm auf Deutsch **und** auf Englisch.

### Gemessen

41 · 17 · 50 grün, 0 ROT · Gegenproben je **7 gefangen · 0 · 0 · 0** · die
bestehenden Proben unverändert (145 · 141 · 150 grün, je 37 grün) · Mixariums
Byte-Spiegel identisch. Gemergt und auf `main` nachgezählt.

### Der Tagesabschluss

**Abschlussbrief mit Stundennachweis:**
[`docs/sessions/archiv/2026-09-16_abschluss-und-stundennachweis.md`](sessions/archiv/2026-09-16_abschluss-und-stundennachweis.md).
Aus der Historie über alle 21 Depots gemessen: **13 h 26 min** dokumentierte
Arbeit in drei Blöcken (01:14–02:20 · 10:38–15:20 · 16:16–23:54), 160 Commits.
Diese Sitzung für sich: **2 h 04 min**.

⚠ **Das ist eine Untergrenze der Bauzeit, nicht Klaus' Arbeitszeit.** Lesen und
Verwerfen vor dem ersten Commit fehlen darin; seine eigene Zeit misst die
Stechuhr in Kimhub, und die liegt im Browser — eine Sitzung kann sie nicht
drücken.

**Forschung:** der Eintrag steht in `Kimhub/forschung/sitzungen.json` (PR #184,
gemergt) — 13 Befunde, neun davon an einem blinden Wächter. Der Datensatz ist
damit bei **23 Sitzungen**; die Auswertungs-Schwelle aus `METHODE.md` § 6 liegt
bei zwanzig und ist überschritten. Beide vorregistrierten Vorhersagen halten
(V1: 15,0 % gegen 43,6 % · V2: 43,9 %). **Die Auswertung selbst ist Klaus'
Entscheidung** und steht als offener Punkt.

⚠ **Kein zweiter SIGNAL-Bump.** `seq` steht bei 91 vom ersten Abschluss dieser
Sitzung. Die Arbeit danach betrifft keine Gegenstelle — kein Modul, keine Spore,
kein Vertrag. Benannt statt stillschweigend.

### Nächster sinnvoller Schritt

Klaus' Sichttest; danach nennt er das Thema der nächsten Sitzung.

---
