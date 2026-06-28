# Brief — Pinnwand auf das „verwandt · KI"-Muster bringen (opt-in), Cosinus bleibt grober Vorfilter

> Freibrief gilt netzweit (CLAUDE.md § Freibrief): eigene, getestete, abgegrenzte,
> nicht-zweifelhafte PRs selbst mergen; echtes Zweifeln (sicherheits-/UX-tiefgreifend) →
> erst Klaus fragen. Vor jedem Urteil/Bau: `git fetch origin main` + gegen `main` arbeiten,
> NIE aus dem Working-Tree schließen (Stale-Checkout-Lehre; bei Branch-Versatz lieber
> `git reset --hard origin/main` + Edit neu anwenden).

## Stand (woher dieser Brief kommt)

Im **Such-Widget (Modul 22)** ist „verwandt · KI" gebaut (Folge-Bau 2026-06-28 tiefe
Nacht, PR aus Branch `claude/relatedness-ki-richter-optin-vn8x40`): ein opt-in-Schalter
„· KI", der das „verwandt"-Maß vom **KI-Richter** (`hybridMatch`) liefern lässt statt vom
gratis zentrierten Cosinus. Cosinus bleibt der „verbunden"-Vorfilter (ehrliche Rangfolge).
Reine Anzeige, gatet nichts; `PROVIDER_MIN_MATCH` 0.80 unberührt. Details:
`docs/components/22_such_widget.md` § „verwandt · KI" + `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`
§ „Stand 2026-06-28 (tiefe Nacht)".

**Klaus-Entscheide aus der Vorsitzung:** „· KI" unter „verwandt", alter „KI-Richter"-Schalter
bleibt · **Modul 23 (Raum-Badge) bewusst nur Cosinus** · `Schnipsel-Mittel`-Lead liegt
(erst nur KI-Richter).

## Das Ziel

Die **Pinnwand** (eigener Frage-/Antwort-Q&A-Pfad mit `embedQuery`/`embedPassage` +
`.a-score`-Cosinus + optionalem `.a-judge`) auf dasselbe **„verwandt · KI"-Muster** bringen
wie Modul 22 — opt-in, BYOK, fail-soft, ohne den Gratis-Pfad zu entfernen.

Achtung Befund aus der „Wählen-UI"-Sitzung (Karte 22, Pinnwand-Absatz): die Pinnwand
**zentriert bereits** (seiten-lokaler wachsender Schwerpunkt — passender als der netzweite
`RELATEDNESS_CENTER` für freien Q&A-Text) und ihr Richter ist **schon opt-in**. **Erst
prüfen, was die Pinnwand heute wirklich tut**, bevor etwas gebaut wird — evtl. ist nur eine
ehrliche Beschriftung („Rangfolge" vs. „KI-Richter") nötig, kein neuer Schalter.

## Reihenfolge (Plan-vor-Code)

1. **Erst lesen + verstehen**, wo die Pinnwand lebt (Sage-Page `index.html` Karte/Pinnwand-
   Code, `.a-score`/`.a-judge`) und ob ein KI-Richter-Pfad schon existiert.
2. **Plan kurz an Klaus** (was wirklich fehlt: neuer „· KI"-Schalter ODER nur ehrliche
   Beschriftung). Bei echtem Zweifel/Mehrdeutigkeit → AskUserQuestion.
3. Dann Bau (analog Modul 22: opt-in, fail-soft, reine Anzeige), Smoke, ggf. Byte-Kopien,
   Drift-Guard, Doku (Karte/INTERFACES/LEHRE/PULS).

## Datenverträge (nicht brechen)
- Reine Anzeige. Cosinus + KI-Richter gaten nichts; Andock-Riegel/`PROVIDER_MIN_MATCH`
  unberührt. Kern-Module nicht anfassen (nur öffentliche Flächen lesen/nutzen).
- BYOK/RAM-only; Schlüssel nicht ohne ausdrücklichen Wunsch persistieren. EU-Politik gilt.
- Byte-Kopien nachziehen, falls betroffen; Drift-Guard (md5) grün.

## Akzeptanzkriterien
1. Gratis-Pfad (Cosinus) unverändert vorhanden + ehrlich als Rangfolge beschriftet.
2. „· KI" opt-in, nur mit Schlüssel aktiv, fail-soft, gatet nichts.
3. Headless-Smoke grün; Drift-Guard byte-1:1 grün (falls Kopien betroffen).
4. Browser-Sichttest wartet auf Klaus.

## Offene Fragen an Klaus
- Pinnwand: neuer sichtbarer „· KI"-Schalter, oder reicht ehrliche Beschriftung (Richter
  schon opt-in)?
- `Schnipsel-Mittel`-Lead jetzt anfassen, oder weiter liegen lassen?

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)
1. Dieser Brief. 2. `CLAUDE.md`. 3. `docs/PULS.md` (oberster Eintrag „Bau 22 verwandt · KI").
4. `docs/components/22_such_widget.md` § „verwandt · KI" (das Muster, das gespiegelt wird).
5. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` § „Stand 2026-06-28 (tiefe Nacht)".
6. `docs/INTERFACES.md` §1 Modul 04 (`hybridMatch`/`relatedness`) + Pinnwand-Code in `index.html`.

## Abschluss-Pflicht (die Kette reißt nie ab)
PULS fortschreiben, Übergabeprotokoll in `docs/sessions/archiv/`, „Nächste Schritte"-Block
im Chat, neuen Brief als Codeblock im Chat. Kein SIGNAL nötig, solange keine netzweite
Konstante geändert wird.
