# Übergabe · S4 „Signierte Sperrliste im Mycel“ gebaut und ausgerollt (2026-10-16)

**Rolle:** Hauptsitzung („Sage-Protokol 1 Abarbeitung“). Auftrag: Sammel-Brief
`docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, erster offener Schritt 5 (S4).

## Startprüfung

- Kein offener PR in Sage. Zwei Sitzungen wurden im Abstand von 53 s mit demselben Brief
  gestartet. Die zweite („… 2 Abarbeitung“) fand diese hier nur über die Sitzungsliste und
  brach ohne Bau ab (Kimhub #394). Diese Sitzung hat sich danach über `list_sessions` als
  einzige laufende bestätigt.
- Folge: Die Zeile zu Schritt 0 in der Fortschritts-Tabelle nennt jetzt die Sitzungsliste. Der
  Codeblock des Briefs ist unverändert.

## Entscheid (Klaus 2026-10-16)

| Frage | Antwort |
|---|---|
| öffentlich oder nicht | öffentlich, signiert (wie Kimboard) |
| wo, wer unterschreibt | in Sage, Sage-Protokol (Nachfrage: „auch wenn das Repo offen liegt?“ → ja, bleibt) |
| Rückfragen | der geheime Schlüssel bleibt in Klaus' Browser; prüfen braucht nur den öffentlichen aus der Spore; Rat: verschlüsseltes Backup der Sage-Identität |

## Getan

| Was | Wo |
|---|---|
| Tafel S4 | `docs/INTERFACES.md` § Modul 23 |
| Zettel, Prüfung, Mittragen, Filter in discover/Antworten/Fragen | `src/modules/23_rendezvous.js` (+ Bündel-Kopien) |
| Kasten „⛔ Sperrliste“, Knopf „⛔ Sperren“ (nur Netzadmin) | `src/modules/23_rendezvous_ui.js` (+ Bündel-Kopien) |
| Siegel-Aspekt S4 DE/EN | `src/modules/16_siegel.js` (+ Bündel-Kopie) |
| Probe + Gegenprobe | `tests/smoke_s4_sperrliste.mjs`, `tests/gegenprobe_s4_sperrliste.mjs` |
| neues Feld benannt | `tests/smoke_netz_eigen.mjs` |
| Tafel-Evolution | `docs/PLAN_MYCEL_SCHICHTEN.md`, `docs/components/12_blocklist.md` |
| Rollout | 29 Träger, je ein PR (Liste in `docs/PULS.md`) |

## Gemessen

- `smoke_s4_sperrliste` 33 grün. Darin stecken Liste (F1–F16), Raum (D0–D7), Fragen und
  Antworten (A1–A4) und die Oberfläche im echten Chromium, DE/EN bei 360 px (U1–U5).
- `gegenprobe_s4_sperrliste` 15/15, jede erste rote Zeile trägt den Namen ihrer Zusicherung.
- `gegenprobe_s5_buergen` 31/31, nachdem zwei tote Anker aus dem eigenen Bau nachgezogen waren.
  `smoke_netz_eigen` 69 grün, Gegenprobe 14/14.
- `run_alle` 126 grün · 1 rot (`smoke_netz_eigen`, danach behoben) · 1 nicht lauffähig
  (`vorrat_wirkung`, mycel-karte nicht geklont). Der Baum war vor und nach dem Lauf gleich.
- Träger: `npm test` bzw. jede Probe einzeln. Grün bis auf: PWA-Toolpoint `smoke_detail`
  (1 rot, auf `main` derselbe Wert) und Sende-Pruefer (unter paralleler Last 1 rot, allein 682
  grün).

## Was schiefging (Befund)

1. F7 prüfte nur das Wort „Netzadmin“, und das steht auch in der Meldung „Ungültige Liste
   (… Netzadmin selbst …)“. Ohne den Riegel wäre F7 grün geblieben. Vor dem Gegenprobe-Lauf
   geschärft (`/nur der Netzadmin/`), danach im Fall „wer nicht Netzadmin ist, darf
   unterschreiben“ gefangen.
2. `sperrePruefen` übernahm zwei Zeilen wortgleich aus `vouchPruefen`. Damit trafen zwei Anker
   der S5-Gegenprobe doppelt und galten als tot. Umbenannt, danach 31/31.
3. `git stash` lief, während ein voller Probenlauf im Hintergrund lief. Der Lauf hat kurz den
   alten Stand gesehen und wurde verworfen.
4. `pkill -f "tests/run_alle.mjs"` traf die eigene Shell, Rückgabe 144 (dieselbe Falle wie in
   Kimhubs Verfassung). Die Korrektur dahinter lief deshalb nicht und wurde wiederholt.
5. Ein Python-Ersatz in Karte 12 griff nicht (die Zeilen beginnen mit `> `). Die Zeile war ohne
   Prüfung geschrieben, es kam keine Meldung, und der Fehler ging in den ersten Commit. Gefunden
   an der Dateiliste des Commits, nachgezogen im zweiten.
6. BookLedgerPro fiel aus der ersten Verteiler-Liste (28 statt 29), wie in Pflege-Liste § 17.

## Nicht gemessen

- Tablet. Zwei echte Geräte. Eine echte, von Sage-Protokol unterschriebene Liste:
  `sbkim/sperrliste.json` gibt es noch nicht. Sie entsteht, wenn Klaus im Sage-Mycel-Fenster
  an einer Karte „⛔ Sperren“ drückt und die Liste mit „📋 Liste kopieren“ ablegt.

## Offen

- Sammel-Brief Schritt 6 (Paper S): Gegenlesen; der Entwurf nennt S3, S4 und S5 noch „geplant“.
- Pflege-Liste § 22–24. Privat-Brains eigenes Mycel-Fenster zeigt keinen Sperrlisten-Kasten
  (wie § 19).

## Nächste Sitzung

Weiter bei Schritt 6.
