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

## Parallel-Sitzung

Während dieser Sitzung hat eine zweite Sitzung am selben Brief gearbeitet: S2 mit Klaus
gemessen (#1115, Haupt-Vektor 9/9 exakt, Schwelle 0,99 bestätigt) und Paper S Fassung 1
geschrieben (#1114). Bemerkt erst beim `git diff --stat origin/main` vor dem PR: der Zweig
hätte 832 Zeilen dieser Arbeit zurückgedreht. Vor dem PR zusammengeführt (Konflikte in
PULS, INTERFACES, Brief). Paper S nennt S5 weiter „geplant“; das stimmt, solange S5 nicht
in den Trägern steht, und der Entwurf gehört der anderen Sitzung.
⚠ Wer jetzt `kanon-verteilen --nur 23_rendezvous` für S2 laufen lässt, trägt S5 Teil 1
mit (der Kanon wird byte-gleich verteilt). Das ist unschädlich (reine Anzeige, ohne Anker
und Kontakte zeigt keine Karte etwas), gehört aber in den Rollout-PR-Text.

## Nach Teil 1 (Gespräch mit Klaus, gleiche Sitzung)

| PR | Was |
|---|---|
| Sage #1119 | Leitlinie „wer ein Netz betreibt, ist dort der Netzadmin“; Zuordnung der Modul-Karten 10, 11, 12, 14 zu den Schichten; Tafel-Widerspruch Sperrliste benannt |
| Sage #1120 | Netzadmin des offenen Mycels = Sage-Protokol (`BgjXhSApoOrJ…`); verbürgte Karten rücken nach vorne |

- Klaus' Vorschlag „drei Bürgschaften“: (1) seine Prüfung von Hand, ein Jahr gültig;
  (2) Nutzer bürgen; (3) das Knotennetz nimmt einen Knoten heraus, wenn mindestens zwei
  Knoten Schaden feststellen. Klaus' Wort zur Reihenfolge: 1 und 3 zuerst, 2 zurückstellen.
  Melde-Knopf und „geprüft/ungeprüft“ gibt es nach Klaus schon in PWA Toolpoint und
  family-project (aus dem Studio steuerbar); in dieser Sitzung nicht angesehen.
- Gelesen: Karten 10 (Reputation, Quorum `QUORUM_RATIO = 0.15`), 11 (Rate-Limit),
  12 (Blocklist), 14 (Diffusion) sind Stubs ohne Code. Bei 13 Trägern ergeben 15 % genau 2.
- Das Wort: „Anker“ → „Netzadmin“. Klaus' Zwischenvorschläge „Netzadministrator“ und
  „Netz-Ad-Mini“ verworfen (Klaus: „Netzadmin ist besser“).
- Klaus' Idee, dass Firmen und Vereine ein eigenes Netz mit denselben Schutz-Werkzeugen
  aufbauen: als Leitlinie im Plan; Klaus' Kennung gehört deshalb nur in die Einstellung des
  offenen Mycels.

## Offen (Stand Sitzungsende)

1. S5 Teil 2: Oberfläche zum Ausstellen (Sicherheitsnummer vergleichen, Bürgschaft
   ausstellen und weitergeben, Kontakte pflegen), „🤝 Anker“ → „Netzadmin“ (steht seit
   #1118 in 28 Trägern), Sage-Protokol als Netzadmin nur im offenen Mycel, verbürgte Karten
   nach vorne; dann Siegel-Aspekt und Rollout.
2. Entscheid vor S4: Sperrliste öffentlich (S4) oder nicht (Karte 12).
3. S3; danach Melden/Quorum als Modul 10 (vorher PWA Toolpoint und family-project ansehen).
4. Paper S: Klaus' Gegenlesen (Fassung 1 aus #1114).

Erledigt seit Teil 1 durch die Parallel-Sitzung: S2-Rollout in 28 Träger (#1118).

## Offen (Stand Teil 1, überholt)


1. S2-Rollout in alle Träger (Messung liegt vor, #1115).
2. S5: Mit welcher Identität bürgt Klaus? Bis dahin ist `RDV_VOUCH_ANCHORS` leer.
3. S5: Sollen verbürgte Karten in der Frage-Rangfolge Vorrang bekommen? Bis dahin
   ändert sich die Reihenfolge nicht.
4. S5 Teil 2: Oberfläche (Sicherheitsnummer vergleichen, Bürgschaft ausstellen und
   weitergeben, Kontakte pflegen), dann Siegel-Aspekt und Rollout.
5. S3, S4. Paper S Fassung 1.
