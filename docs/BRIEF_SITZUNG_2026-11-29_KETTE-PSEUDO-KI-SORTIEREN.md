# Brief: eine Sitzung, Schritt für Schritt (Stand 28.11.2026, Samstag 14 Uhr)

Klaus 28.11.: *„Ich werde alles nur in einer Sitzung machen. Schritt für Schritt … Fragen sollen selber beantwortet werden … Es soll
gebaut werden, bis es fertig ist, soweit es geht … möglichst viele Token sparen.“* Budget ist knapp (rund 15 % bis Montag).

## Repos, die zu Beginn in die Sitzung geholt werden (`add_repo`, Schreibrecht)

`Datei-Organizer` · `PseudoDoc` · `Meine-Familienakte` · `Private-Akte` · `Privat-Brain-Pro` (Kimhub erst später; Forschungseinträge
holt Klaus später nach).

## Ziel: fertige Pro-Apps (Klaus 28.11.)

*„Am Ende lieber APK-Apps und Windows-Apps fertig haben als eine PWA.“* Die Pro-Fassungen liegen **in denselben Repos**
(`android/`, `windows/`, `tools/native`, Workflows `android.yml`/`windows.yml`); es gibt keine getrennten Pro-Repos. Jeder Schritt
hält die nativen Proben grün (`tools/native/test-native.mjs` u. a.), nicht nur die Web-Proben.

## Arbeitsweise (Freibrief)

- **Kein Warten auf Klaus:** Vorschauen entfallen, Fragen beantwortet die Sitzung selbst aus den Briefen. Design kommt aus der Wirts-App.
- **Token sparen:** im Chat nur kurze Zwischenstände (eine Zeile je Schritt), keine Themenerweiterungen, keine Rückfragen. Lange Läufe
  (Bau, Proben) im Hintergrund; Unter-Agenten nur für abgegrenzte Teilaufgaben.
- Je Schritt: frisch von `origin/main`, bauen, Proben grün, selbst mergen, auf `main` nachsehen, **dann** nächster Schritt.
- **Nichts veröffentlichen** (APK, Windows, Pages-Fassungen) bis zum Schluss; Veröffentlichen nur nach Klaus' Wort.
- Nach jedem Schritt eine kurze Zeile in diese Datei (Abschnitt „Stand“), damit eine abgebrochene Sitzung weiß, wo es weitergeht.
- Keine Forschungseinträge (Klaus: später), keine PULS-Pflicht in dieser Kette.

## Die Schritte

| # | Repo | Was | Brief dort |
|---|---|---|---|
| 1 | Datei-Organizer | S0a Pseudo-Kern aus PseudoDoc mit Pin; S1–S2 „Mit großer KI sortieren“; Plan-Format und Plan-Prüfung in `lib/` ohne Oberfläche | `docs/BRIEF_SITZUNG_2026-11-29_SORTIEREN-MIT-GROSSER-KI.md` |
| 2 | Meine-Familienakte | **Pseudonymisieren als eigenes Werkzeug**, wie in der Private Akte: eigener Knopf/Bereich statt nur „Pseudo“ im Kopf, für alle Dateien (nicht nur Mails), verständlich; Kern von PseudoDoc mit Pin (Rückweg-Prüfung, Bereinigen), Maske bleibt hier Quelle; das alte Fenster geht darin auf (kein zweites) | dieser Brief + Familienakte `CLAUDE.md` (Pseudo-Abschnitte) |
| 3 | Meine-Familienakte | F1–F4 Eingang mit großer KI sortieren (nutzt Schritt 1 und 2) | `docs/BRIEF_SITZUNG_2026-11-29_KI-SORTIEREN-EINGANG.md` |
| 4 | Private-Akte | Organizer-Klon und Pseudo-Werkzeug auf den neuen Stand ziehen (Pins), Weg „Mit großer KI sortieren“ dort sichtbar | `CLAUDE.md` dort |
| 5 | — | **entfällt hier**: Auskunft Art. 15 läuft als eigene Sitzung ab Montag 30.11. (Klaus 28.11.); nicht anfassen | `BRIEF_SITZUNG_2026-11-29_AUSKUNFT-ART15.md` |
| 6 | Privat-Brain-Pro + Private-Akte | Lokaler Assistent L0–L2. **Zu Hause in beiden** (Klaus 28.11.): Kern einmal in Private Brain Pro, byte-gleich mit Pin in die Private Akte | `BRIEF_SITZUNG_2026-11-29_LOKALER-ASSISTENT.md` |
| 7 | alle angefassten | **APK und Windows bauen**: je App die nächste freie Fassung in allen Versionsdateien, CI-Bau Android + Windows grün, Pakete und SHA-256 bereit. Dann **ein Wort von Klaus („Ja, veröffentlichen“)** und veröffentlichen wie im jeweiligen CLAUDE.md beschrieben (Update-Server, Release, Spezial), Nachweis `VEROEFFENTLICHUNG-<fassung>.json`. Danach kurze Liste fertig/offen und Brief für die nächste Sitzung | `CLAUDE.md` je Repo (Pro-Abschnitt) |

Reicht das Budget nicht, wird nach jedem fertigen Schritt sauber aufgehört; der nächste Schritt steht dann oben in „Stand“.

## Stand

- 28.11.: Kette geplant, alle Briefe auf `main`. Nächster Schritt: 1.
