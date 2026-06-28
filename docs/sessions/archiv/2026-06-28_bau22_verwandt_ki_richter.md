# Übergabeprotokoll — Bau 22 „verwandt · KI" (Verwandtschafts-Maß opt-in vom KI-Richter)

**Datum:** 2026-06-28 (tiefe Nacht, Folge)
**Rolle:** Bau-Sitzung (Modul 22)
**Branch:** `claude/relatedness-ki-richter-optin-vn8x40`
**Brief:** `docs/sessions/BRIEF_RELATEDNESS_KI_RICHTER_OPTIN.md`
**Freibrief:** galt (CLAUDE.md § Freibrief). Plan-vor-Code: drei Richtungs-Entscheide
vorab an Klaus (AskUserQuestion).

## Auftrag

Das „verwandt"-Maß (Bau 22e „Wählen"-UI) so erweitern, dass es wahlweise vom
**KI-Richter** (Modul 04 `hybridMatch`) statt vom zentrierten Cosinus kommt —
opt-in, BYOK, fail-soft, ohne den Gratis-Pfad zu entfernen. Cosinus bleibt der
„verbunden"-Vorfilter. Auslöser: Kalibrier-Abschluss (gratis Cosinus trennt
verwandt/unverwandt nicht zuverlässig, LEHRE-Doc § „tiefe Nacht").

## Klaus' Entscheide (AskUserQuestion, vorab)

1. **Schalter-Form:** „· KI" unter „verwandt", **alter „KI-Richter"-Schalter bleibt** daneben.
2. **Modul 23 (Raum-Badge):** vorerst **nur Cosinus** (kurze Domänen-Texte, Kosten je Karte).
3. **Schnipsel-Mittel-Lead:** **erst nur KI-Richter**, Lead bleibt liegen.

## Getan (Modul 22 only)

- **UI:** dritter Schalter „· KI" in der Anzeige-Sicht-Zeile, nur im verwandt-Modus
  sichtbar (`updateViewRowState`), Default aus. Anhaken ohne Schlüssel → nüchterner
  Hinweis. Ehrliche Beschriftung des gratis „verwandt" als **Rangfolge** (Tooltip +
  Block-Kopf + Badge-Tooltip).
- **Logik:** `kiRelatedness(query, treffer)` (alle Verdikte, nicht auf `passt`
  gefiltert → byKey-Karte) + `ensureKiRelated(res)` (stößt das Urteil an, Cache-/
  `running`-Guard, fail-soft) + `kiRelatedActive()`. `rankView` um den `kiByKey`-Pfad
  erweitert (Sortierung nach KI-Score, `isRelated` aus `passt`, `kiJudged:true`,
  `relatedOnly`-Filter). `displayTreffer` reicht `kiByKey` rein, wenn das Urteil zur
  aktuellen Frage vorliegt. `runAndRender` setzt `kiRelatedState` bei neuer Suche
  zurück. Per-Treffer-Badge „🧬 NN % · KI" + `begruendung`.
- **Persistenz/Surface:** `kiRelated` in `sbkim_search_widget_view`; `init({kiRelated?})`;
  `setKiRelated/getKiRelated`; `_meta.kiRelated/kiRelatedActive`. Urteil selbst RAM-only,
  **nicht** persistiert (kein PII).
- **Verträge gewahrt:** reine Anzeige, gatet nichts; `PROVIDER_MIN_MATCH` 0.80 +
  Modul 04/05 unberührt (nur öffentliche `hybridMatch`-Fläche); EU-Politik (`euOnly`/
  Anbieter-Filter) reist mit; alter „KI-Richter"-Schalter unberührt.
- **Tests:** `smoke_bau22e_waehlen.mjs` **45/45** (neue Proben 8–11: KI-Sortierung,
  `nur verwandte`-Filter über `passt`, fail-soft bei Lücke, Eingabe nicht mutiert,
  Surface/Default opt-in). `smoke_bau22_such_widget.mjs` 257/257.
  `smoke_standalone_such_tool.mjs` 46/46 (Drift-Guard). Byte-Kopie
  `such-tool/modules/22…` md5-identisch.
- **Doku:** Karte 22 § „verwandt · KI", INTERFACES §1 Modul 22 (Surface + `_meta` +
  init + Smoke-Note 45/45), LEHRE-Doc § Umsetzung, CLAUDE.md Modul-22-Zeile, PULS.

## NICHT getan (bewusst, abgegrenzt)

- **Modul 23 Raum-Badge**: kein Eingriff (Klaus-Entscheid Cosinus).
- **Pinnwand**: kein Eingriff (eigener `.a-judge`-Pfad; eigene Folge-Sitzung).
- **Schnipsel-Mittel** gratis-Weg: nicht verfolgt (Lead notiert).
- **Widget-Tresor-Auto-Speicher** des Schlüssels: sicherheits-sensibel, Increment 2 B.

## Nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest** (KI-Schlüssel live) auf der deployten Seite nach Merge
   — „· KI" sortiert sichtbar nach Bedeutung, ohne Schlüssel sauber auf Cosinus.
2. **Pinnwand** auf dasselbe „· KI"-Muster (Folge-Sitzung) — siehe Folge-Brief.
3. **Verträge unberührt** ⇒ kein SIGNAL/Rollout nötig (keine netzweite Konstante).

## Status

Headless grün, Verträge unberührt. **Browser-Sichttest wartet auf Klaus.**
