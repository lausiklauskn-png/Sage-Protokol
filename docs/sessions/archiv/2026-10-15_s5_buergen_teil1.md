# Übergabe · S5 Bürgen, Teil 1 (2026-10-15)

**Rolle:** Hauptsitzung nach `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`.
**Startprüfung:** In Sage war kein PR offen. `main` frisch (`7fb74d1`). Der erste offene
Schritt war 5: Der S2-Rollout wartet auf die Messung am Gerät, danach folgt S5.

## Klaus' Antworten

- S2-Messung: „Wie soll ich messen?“ Die Anleitung steht im Chat (Seite
  `tools/s2-wiederholung.html` auf der Sage-Page, Knopf „Messen“, etwa 118 MB im WLAN,
  den Satz mit dem kleinsten Wert zurückmelden). **Noch kein Messwert.**
- S5: Kette **2 Schritte**, Anker **Klaus + eigene Kontakte**, Ablauf **1 Jahr**.

## Getan

| Was | Wo |
|---|---|
| Tafel S5 Teil 1 (zuerst) | `docs/INTERFACES.md` § Modul 23, nach S2 |
| Bürgschaft/Widerruf, `vouchTrust`, `createVouch`, `createRevocation`, `addCarried`, Kontakte | `src/modules/23_rendezvous.js` |
| Karte trägt `vouches`/`revocations`; `discover` sammelt aus allen Karten-Ereignissen | ebd. |
| Anzeige „🤝 verbürgt von …“ DE/EN | `src/modules/23_rendezvous_ui.js` |
| Bündel-Kopien | `sbkim-bundle/`, `sbkim-bundle-voll/` |
| Probe, Gegenprobe | `tests/smoke_s5_buergen.mjs`, `tests/gegenprobe_s5_buergen.mjs` |
| `discover`-Vergleich ohne `vouch` | `tests/smoke_netz_eigen.mjs` |
| PULS über 3000 Zeilen: ein Eintrag wortgleich ausgelagert | `docs/sessions/archiv/2026-10_puls-auslagerung-21.md` |

## Gemessen

- `smoke_s5_buergen`: 41 grün, davon drei Zeilen im echten Chromium (360 px, DE und EN,
  fremder Name mit `<img onerror>` nur als Text).
- Gegenprobe: 14 von 14 gefangen, jeder Fall mit dem Namen seiner Zusicherung.
- `run_alle`: 2 rot (`smoke_geraetename_netzweit`, `smoke_service_worker_parst`; beide auf
  `main` ebenso rot), 2 nicht lauffähig (Nachbar-Klone fehlen).
- Anker der Gegenproben 23.R, S1, S2 leben weiter (`NUR_ANKER=1`).

## Was schieflief (Belegmaterial)

- Die Probe war beim ersten Lauf 41/41 grün. Beim Schreiben der Gegenprobe zeigte sich,
  dass G2 („Spore passt nicht zum Bürgen“) schon an der Unterschrift scheiterte und die
  Bindungsprüfung gar nicht erreichte. G2 unterschreibt jetzt gültig mit dem fremden
  Schlüssel, nur die Bindung ist falsch.
- Ein Gegenprobe-Fall rutschte durch: „Aufgefallener gilt als verbürgt“. Das war kein
  blinder Wächter, sondern ein toter Anker. Wer für einen Aufgefallenen bürgt, haftet, und
  dessen Kanten sind schon weg. Die zweite Prüfung änderte also nichts. Sie ist entfernt,
  der Grund steht im Code.
- `smoke_netz_eigen` verglich `discover` byte-gleich mit einer alten Fassung, wie bei S2.

## Nicht gemessen

- Tablet. Zwei echte Geräte, die einander bürgen.
- `tests/manual_check.html` ist ungeprüft (kein Sichttest; die Browser-Zeilen der Probe
  laden 23 und 23-UI).

## Offen

1. S2: Klaus misst am Tablet. Liegt der Wert bei mindestens 0,995, wird S2 verteilt.
2. S5: Mit welcher Identität bürgt Klaus? Bis dahin ist `RDV_VOUCH_ANCHORS` leer.
3. S5: Sollen verbürgte Karten in der Frage-Rangfolge Vorrang bekommen? Bis dahin
   ändert sich die Reihenfolge nicht.
4. S5 Teil 2: Oberfläche (Sicherheitsnummer vergleichen, Bürgschaft ausstellen und
   weitergeben, Kontakte pflegen), dann Siegel-Aspekt und Rollout.
5. S3, S4. Paper S Fassung 1.
