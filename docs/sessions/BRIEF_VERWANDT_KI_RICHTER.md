# Brief — „verwandt"-Maß auf den KI-Richter umstellen (opt-in), Cosinus bleibt grober Vorfilter

> **Freibrief gilt netzweit** (CLAUDE.md § Freibrief): eigene, getestete, abgegrenzte,
> nicht-zweifelhafte PRs selbst mergen; echtes Zweifeln (sicherheits-/UX-tiefgreifend) →
> erst Klaus fragen. Vor jedem Urteil/Bau: `git fetch origin main` + gegen `main` arbeiten,
> NIE aus dem Working-Tree schließen (Stale-Checkout-Lehre; bei Branch-Versatz lieber
> `git reset --hard origin/main` + Edit neu anwenden).

## Warum dieser Brief (Stand 2026-06-28, tiefe Nacht)

Die Vektoren-Kalibrierung ist **abgeschlossen mit einem klaren Befund** (Browser-Messreihe
Klaus, Panel 04 — siehe `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` § „Stand 2026-06-28
(tiefe Nacht)"): Der **gratis zentrierte Cosinus trennt verwandt/unverwandt NICHT** (Über-
lappung; weder v1 noch v2; `Schnipsel-Mittel` nur dünn + bräuchte Spore-Datenvertrag-
Eingriff). **Klaus' Entscheid:** der Cosinus bleibt der **gratis/offline „verbunden"-
Vorfilter** (ehrliche Rangfolge), das echte **„verwandt"** liefert der **KI-Richter** (Modul
04 `hybridMatch`, opt-in/BYOK) — zurück zur Ur-Vision „Semantisches Bidirektionales KI-
Matching". `RELATEDNESS_CENTER` bleibt **v1**, keine netzweite Konstante geändert.

## Das Ziel

Das **„verwandt (genau)"-UI** (Bau 22e Such-Widget + Modul 23 Rendezvous-Badge) so erweitern,
dass „verwandt" **wahlweise vom KI-Richter** kommt statt vom zentrierten Cosinus — **opt-in,
BYOK, fail-soft**, ohne den gratis-Pfad zu entfernen.

- **„verbunden" (Default, gratis):** roher/zentrierter Cosinus, server-los, offline — bleibt
  unverändert als Rangfolge.
- **„verwandt" (Default, gratis):** bleibt der zentrierte Cosinus **als grobe Anzeige** — ABER
  ehrlich beschriftet (Rangfolge, kein Wahrheits-Stempel).
- **„verwandt · KI" (NEU, opt-in):** wenn ein Schlüssel gesetzt ist, übernimmt der KI-Richter
  (`hybridMatch`) die „verwandt"-Bewertung nach **Bedeutung**.

## Was gebaut werden soll

1. **Such-Widget (Modul 22, Bau 22e „Wählen"-UI):** neben „verbunden / verwandt" einen
   **opt-in-Schalter „· KI"** für das „verwandt"-Ranking. Ohne Schlüssel → ausgegraut/
   fail-soft auf zentrierten Cosinus. Richter-Anbieter-Dropdown + Schlüsselfeld existieren
   bereits (Bau 2026-06-26) — wiederverwenden, NICHT neu bauen.
2. **Rendezvous-Badge (Modul 23 + `23_rendezvous_ui.js`):** analog — Badge „🧬 verwandt" kann
   optional vom KI-Richter kommen (opt-in). **Architektur-Frage zuerst an Klaus:** lohnt der
   KI-Richter im Raum-Badge (Spore-Domänen-Text vs. Spore-Domänen-Text) oder bleibt er dort
   bewusst beim Cosinus? (Raum-Karten haben nur kurze Domänen-Texte — KI-Richter evtl. dünn.)
3. **Ehrliche Beschriftung:** das gratis „verwandt" als „Rangfolge" kennzeichnen (Tooltip/
   Untertitel), damit es nicht als Wahrheit missverstanden wird (LEHRE-Befund).

## Datenverträge (nicht brechen)
- **Reine Anzeige.** Weder Cosinus noch KI-Richter gaten etwas; `PROVIDER_MIN_MATCH = 0.80`
  (Modul 05 Handshake) + 0.80-Andock-Riegel **unverändert**.
- **Kern-Module 02/04/05/05b/23 unangetastet.** `hybridMatch` ist bereits da (Modul 04) —
  nur die UI ruft es opt-in fürs „verwandt"-Ranking auf.
- **BYOK/RAM-only:** Schlüssel nie persistiert ohne ausdrücklichen Nutzer-Wunsch (Tresor-
  Auto-Speicher ist eine eigene sicherheits-sensible Sitzung, Increment 2 B). EU-Politik
  `bindend`/`frei` gilt für den Richter (`euOnly`).
- **Byte-Kopien nachziehen** (`such-tool/modules/…`, `sbkim-bundle/modules/…`), Drift-Guard
  (md5) grün.

## Akzeptanzkriterien
1. „verbunden" + gratis „verwandt" unverändert vorhanden (kein Funktions-Verlust).
2. „verwandt · KI" opt-in, nur mit Schlüssel aktiv, **fail-soft** auf Cosinus ohne Schlüssel/
   Netz. Gatet nichts.
3. Headless-Smoke grün (`smoke_bau22*`, `smoke_bau23*`), Drift-Guard byte-1:1 grün.
4. Ehrliche Beschriftung des gratis „verwandt" als Rangfolge.
5. Browser-Sichttest wartet auf Klaus (live KI-Richter fürs „verwandt").

## Reihenfolge
Erst **Plan an Klaus** (UI-/Sicherheits-Eingriff): Modul-23-Frage (lohnt KI-Richter im Raum?)
+ Schalter-Form im Such-Widget. Dann Bau Modul 22, dann (falls Klaus will) Modul 23, dann
Byte-Kopien + Smoke + Drift-Guard.

## Offene Fragen an Klaus
- Soll der KI-Richter auch ins **Raum-Badge** (Modul 23), oder bleibt der dort bewusst beim
  Cosinus (kurze Domänen-Texte)?
- `Schnipsel-Mittel`-Lead (gratis „verwandt" via Schnipsel statt Mitteln) parallel
  weiterverfolgen, oder erst mal nur den KI-Richter-Weg?

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)
1. Dieser Brief. 2. `CLAUDE.md` (Freibrief, Konventionen). 3. `docs/PULS.md` (oberster
Eintrag „Kalibrier-Abschluss"). 4. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` § „Stand
2026-06-28 (tiefe Nacht)" + § Bau 04.E. 5. `INTERFACES.md` §1 Modul 04 (`hybridMatch`/
`relatedness`) + Modul 22 + Modul 23. 6. Code: `src/modules/04_match.js`,
`src/modules/22_such_widget.js`, `src/modules/23_rendezvous.js` + `23_rendezvous_ui.js`.

## Abschluss-Pflicht (die Kette reißt nie ab)
PULS fortschreiben, Übergabeprotokoll, „Nächste Schritte"-Block im Chat, neuen Brief als
Codeblock im Chat. Kein SIGNAL nötig, solange keine netzweite Konstante geändert wird.
