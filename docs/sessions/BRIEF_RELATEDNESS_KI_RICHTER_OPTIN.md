# Brief — „verwandt"-Maß auf den KI-Richter umstellen (opt-in), Cosinus bleibt grober Vorfilter

> **ERLEDIGT 2026-06-28 (tiefe Nacht, Folge).** Umgesetzt in Modul 22 („verwandt · KI"),
> Branch `claude/relatedness-ki-richter-optin-vn8x40`. Übergabeprotokoll:
> `docs/sessions/archiv/2026-06-28_bau22_verwandt_ki_richter.md`. Folge-Brief:
> `docs/sessions/BRIEF_PINNWAND_VERWANDT_KI.md`. Klaus-Entscheide (AskUserQuestion):
> „· KI" unter „verwandt", alt bleibt · Modul 23 vorerst nur Cosinus · erst nur KI-Richter.

> Freibrief gilt netzweit (CLAUDE.md § Freibrief): eigene, getestete, abgegrenzte,
> nicht-zweifelhafte PRs selbst mergen; echtes Zweifeln (sicherheits-/UX-tiefgreifend) →
> erst Klaus fragen. Vor jedem Urteil/Bau: `git fetch origin main` + gegen `main` arbeiten,
> NIE aus dem Working-Tree schließen (Stale-Checkout-Lehre; bei Branch-Versatz lieber
> `git reset --hard origin/main` + Edit neu anwenden).

## Warum dieser Brief (Stand 2026-06-28, tiefe Nacht)

Die Vektoren-Kalibrierung ist abgeschlossen mit einem klaren Befund (Browser-Messreihe
Klaus, Panel 04 — siehe `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` § „Stand 2026-06-28
(tiefe Nacht)"): Der gratis zentrierte Cosinus trennt verwandt/unverwandt NICHT (Über-
lappung; weder v1 noch v2; `Schnipsel-Mittel` nur dünn + bräuchte Spore-Datenvertrag-
Eingriff). Klaus' Entscheid: der Cosinus bleibt der gratis/offline „verbunden"-Vorfilter
(ehrliche Rangfolge), das echte „verwandt" liefert der KI-Richter (Modul 04 `hybridMatch`,
opt-in/BYOK) — zurück zur Ur-Vision „Semantisches Bidirektionales KI-Matching".
`RELATEDNESS_CENTER` bleibt v1, keine netzweite Konstante geändert.

## Das Ziel

Das „verwandt (genau)"-UI (Bau 22e Such-Widget + Modul 23 Rendezvous-Badge) so erweitern,
dass „verwandt" wahlweise vom KI-Richter kommt statt vom zentrierten Cosinus — opt-in,
BYOK, fail-soft, ohne den gratis-Pfad zu entfernen.

- „verbunden" (Default, gratis): roher/zentrierter Cosinus, server-los, offline — unverändert.
- „verwandt" (Default, gratis): bleibt der zentrierte Cosinus als grobe Anzeige — ehrlich
  als Rangfolge beschriftet (kein Wahrheits-Stempel).
- „verwandt · KI" (NEU, opt-in): mit Schlüssel übernimmt der KI-Richter (`hybridMatch`).

## Was gebaut werden soll

1. Such-Widget (Modul 22, Bau 22e „Wählen"-UI): opt-in-Schalter „· KI" für das
   „verwandt"-Ranking. Ohne Schlüssel → fail-soft auf Cosinus. Richter-Anbieter-Dropdown +
   Schlüsselfeld existieren bereits (Bau 2026-06-26) — wiederverwenden, NICHT neu bauen.
2. Rendezvous-Badge (Modul 23 + `23_rendezvous_ui.js`): analog — ABER Architektur-Frage
   zuerst an Klaus: lohnt der KI-Richter im Raum-Badge (kurze Domänen-Texte) oder bleibt
   dort bewusst der Cosinus?
3. Ehrliche Beschriftung des gratis „verwandt" als Rangfolge (Tooltip/Untertitel).

## Datenverträge (nicht brechen)
- Reine Anzeige. Cosinus + KI-Richter gaten nichts; `PROVIDER_MIN_MATCH = 0.80` + Andock-
  Riegel unverändert. Kern-Module 02/04/05/05b/23 unangetastet (`hybridMatch` ist schon da).
- BYOK/RAM-only; Schlüssel nicht persistieren ohne ausdrücklichen Wunsch (Tresor = eigene
  sicherheits-sensible Sitzung). EU-Politik `bindend`/`frei` gilt (`euOnly`).
- Byte-Kopien nachziehen (`such-tool/`, `sbkim-bundle/`), Drift-Guard (md5) grün.

## Akzeptanzkriterien
1. „verbunden" + gratis „verwandt" unverändert vorhanden.
2. „verwandt · KI" opt-in, nur mit Schlüssel aktiv, fail-soft, gatet nichts.
3. Headless-Smoke grün (`smoke_bau22*`, `smoke_bau23*`), Drift-Guard byte-1:1 grün.
4. Ehrliche Beschriftung des gratis „verwandt" als Rangfolge.
5. Browser-Sichttest wartet auf Klaus.

## Reihenfolge
Erst Plan an Klaus (Modul-23-Frage + Schalter-Form). Dann Bau Modul 22, dann (falls Klaus
will) Modul 23, dann Byte-Kopien + Smoke + Drift-Guard.

## Offene Fragen an Klaus
- KI-Richter auch ins Raum-Badge (Modul 23), oder dort bewusst Cosinus?
- `Schnipsel-Mittel`-Lead parallel verfolgen, oder erst mal nur KI-Richter?

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)
1. Dieser Brief. 2. `CLAUDE.md`. 3. `docs/PULS.md` (oberster Eintrag „Kalibrier-Abschluss").
4. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` § „Stand 2026-06-28 (tiefe Nacht)" + Bau 04.E.
5. `INTERFACES.md` §1 Modul 04 (`hybridMatch`/`relatedness`) + Modul 22 + Modul 23.
6. Code: `src/modules/04_match.js`, `22_such_widget.js`, `23_rendezvous.js` + `23_rendezvous_ui.js`.

## Abschluss-Pflicht (die Kette reißt nie ab)
PULS fortschreiben, Übergabeprotokoll, „Nächste Schritte"-Block im Chat, neuen Brief als
Codeblock im Chat. Kein SIGNAL nötig, solange keine netzweite Konstante geändert wird.
