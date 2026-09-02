# Brief für die nächste Sitzung — nach der Veröffentlichung der Papers

*Geschrieben am 2026-09-02, nach der Sitzung „Papers als Feldbericht".*

---

## Wo wir stehen

Die beiden Papers sind **veröffentlicht** und liegen auf `main`:
`docs/papers/sbkim-paper-de.html` und `-en.html`. Als **Erstveröffentlichung**,
nicht als Neufassung — vorher war nichts draußen. Sie sind ein **Feldbericht**,
kein Methoden-Vorschlag: *die Bausteine sind bekannt, der Betrieb ist der Beitrag.*

Was in derselben Sitzung noch entstand: die Lehre über die Sporen im Netz
(`LEHREN.md` § 9), der Grundsatz „Das Ziel im Auge behalten" (`NETZWEIT § 6a`),
ein Wächter über die Papier-Titel, und `PULS.md` von 3.000 auf gut 2.850 Zeilen
ausgelagert.

## Was offen ist, in der Reihenfolge

### 1 · Der Zenodo-DOI — das Sitzungs-Ziel, das liegen blieb

Alle Angaben stehen bereit; Klaus hat sie als Datei. Sobald er den DOI hat,
gehört er an **drei** Stellen eingetragen:

- in beide Papers (eine Zeile unter dem Titel)
- in `docs/papers/README.md`
- in die Geschichts-Galerie in `index.html`

**Frag ihn danach, wenn er es nicht von selbst sagt.** Es ist der letzte Schritt
einer Arbeit, die sonst fertig ist.

### 2 · Sages Netz-Identität ist die falsche

Die am 2026-09-02 neu signierte Spore trägt `BgjXhSAp…` statt Sages
`nysOZE3V…`. **Nicht eingespielt** — sie liegt nur in Klaus' Downloads.

Zurückzuholen ist sie über den **Identitäts-Wechsler** aus der verschlüsselten
Sicherung. Das läuft im Browser, eine Sitzung kann es nicht.

### 3 · Die neue Beschreibung gehört in die App, nicht in die Datei

⚠ **Lies zuerst [`LEHREN.md` § 9](../LEHREN.md).** Der Kurzschluss ist naheliegend
und falsch: die `sbkim/spore.json` im Depot zu ändern bewirkt **gar nichts**. Was
ein Knoten ankündigt, entsteht im Browser. Gemessen an zwei Knoten.

Der Text für Sages Selbstbeschreibung ist geschrieben und steht im Verlauf der
letzten Sitzung. Er gehört ins Beschreibungsfeld der App, dort neu signiert; die
Datei im Depot wird **danach** nachgezogen, damit beide dasselbe sagen.

## Was gemessen ist und was nicht

| gemessen | offen |
|---|---|
| Leitungs-Spore ≠ Depot-Spore, an **zwei** Knoten | ob die anderen 16 sich gleich verhalten |
| die Verschiebung Upload ⟷ Leitung: **0,0735** (3,1 × sd) | woher der Browser den Text nimmt |
| Handschlag Sage ⟷ family-project: `established`, 1 s | ob das Beschreibungsfeld selbst kappt |

**Der Analyse-Rekorder der Mycel-Karte ist das Messgerät dafür.** Keine Probe im
Depot kann diese Dinge sehen — alle Wächter prüfen Dateien, und die Dateien sind
nicht der Gegenstand.

## Zwei Dinge, die diese Sitzung anders machen soll

**Das Ziel im Auge behalten, und zwar gegenseitig** (`NETZWEIT § 6a`). Die letzte
Sitzung ist für den DOI losgegangen und hat vier Stunden an einer Sporen-Diagnose
gearbeitet. Die Diagnose war richtig und hat drei Irrtümer aufgedeckt — und das
Ziel blieb trotzdem liegen. **Beide Hälften zählen.**

Der Satz, der hilft, kommt von beiden Seiten: *„Wo wollten wir eigentlich hin?"*
Keine Schuldzuweisung, weder an Klaus noch an die Sitzung — die bringt keine
Minute zurück.

**Die Regeln binden beide** (`NETZWEIT § Für wen sie gelten`). Die Sitzung
arbeitet nach Anleitung; wer die Anleitung gibt, setzt mit aus, was gilt. Eine
Bitte, die gegen eine Regel steht, wird **benannt** statt stumm umfahren.

## Pflichtlektüre

1. `CLAUDE.md`
2. `docs/PULS.md` — der oberste Eintrag
3. **`docs/LEHREN.md` § 9**, bevor irgendetwas an einer Spore angefasst wird
4. `docs/NETZWEIT.md` § 6a und § Für wen sie gelten

## Pflicht am Sitzungsende

`PULS.md` fortschreiben · Übergabeprotokoll nach `docs/sessions/archiv/` ·
Commit und Push auf den vorgegebenen Branch · **„Vorgeschlagene nächste Schritte"
direkt in der Chat-Antwort** · den nächsten Brief **vollständig als Codeblock im
Chat** ausgeben. Die Kette reißt nie ab.

⚠ `PULS.md` steht bei rund 2.850 von 3.000 Zeilen. Die nächste größere Sitzung
lagert wieder aus — **auslagern, nicht kürzen**.
