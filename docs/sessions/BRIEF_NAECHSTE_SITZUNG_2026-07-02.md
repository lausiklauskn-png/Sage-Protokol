# BRIEF — nächste Sitzung (Stand 2026-07-02, nach Folge-Bau window.R + Korpus)

```
Neue Sitzung — Sage-Protokol. Freibrief gilt (CLAUDE.md § Freibrief).

STAND (PULS oberster Eintrag 2026-07-02 „Folge-Bau: window.R-Fix + Rezept-Korpus"):
Der A1/A4-Rollout ist in BEIDEN Endknoten (Mixarium + Rezeptbuch) komplett und
gemergt — inkl. window.R-Live-Getter + Korpus-Provider, sodass die Cross-Knoten-
Bedeutungs-Antwort erstmals echten Inhalt liefern KANN.
- Mixarium: PR #89 (A1/A4-Empfänger) + PR #90 (window.R-Getter). SW v39.
- Rezeptbuch: PR #279 (Modul-04-Sync behob fehlendes queryLocal + A1/A4) + PR #280
  (window.R-Getter + Rezept-Korpus-Provider). CACHE mrz-v28.
- Sage-Doku: PR #530/#531 + dieser Folge-Bau-Eintrag.
Headless alles grün (smoke_windowr* + smoke_rollout_a1a4* + Drift-Guards).
WICHTIG: Mein-Rezeptbuch IMMER gegen `main` prüfen — GitHub-Default-Branch ist ein
toter Vor-SBKIM-Decoy (Regel in Mein-Rezeptbuch/CLAUDE.md).

ZUERST prüfen: Hat Klaus den BROWSER-SICHTTEST gemacht? (Cross-phrased Frage von
einem Knoten an Mixarium/Rezeptbuch → kommen echte Drinks/Rezepte bedeutungs-
sortiert zurück?) Das ist Schritt 4 aus BRIEF_KORPUS_WINDOWR_ENDKNOTEN.md.
- Wenn Klaus einen BEFUND meldet → diesen zuerst fixen (Folge-Fix).
- Wenn grün → als bewiesen in PULS + status.json vermerken.

DANN eine Aufgabe wählen (nicht alle):
1. LLM-Varianten-Generator (A4-Aufsatz) in Sage Modul 22
   (src/modules/22_such_widget.js): opt-in/BYOK (wie KI-Richter) statt der kleinen
   DEFAULT_SYNONYMS-Karte optional einen LLM Query-Varianten generieren lassen;
   Default aus, fail-soft auf die Synonym-Karte. Byte-Kopie such-tool/modules/22
   mitziehen (Drift-Guard), SW-Cache bumpen. Headless-Smoke.
2. Falls Browser-Test einen Korpus-/window.R-Befund zeigt: Folge-Fix in dem
   betroffenen Endknoten (Rezeptbuch immer von main branchen!).
3. RELATEDNESS_CENTER v2 (offen aus Modul 22/23 „verwandt"): Kalibrierung des
   zentrierten Cosinus-Zentrums an echten Knoten-Vektoren.

Pflichtlektüre: CLAUDE.md · docs/PULS.md (oberster Eintrag) ·
docs/sessions/BRIEF_KORPUS_WINDOWR_ENDKNOTEN.md ·
docs/components/22_such_widget.md + 04_match.md ·
docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md.

Tests: Headless-Smoke + Drift-Guards such-tool/sbkim-bundle byte-1:1.
Selbst-Merge nach grünen Tests (Draft→ready→squash), dann prüft Klaus live.
Am Sitzungsende: PULS fortschreiben, Übergabeprotokoll, diesen Brief-Typ neu ausgeben.
```
