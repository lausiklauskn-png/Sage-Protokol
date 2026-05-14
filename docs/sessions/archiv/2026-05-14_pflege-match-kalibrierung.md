# Übergabeprotokoll · 2026-05-14 · Pflege-Sitzung Match-Kalibrierung

**Sitzungs-Rolle:** Pflege-Sitzung (eine Sitzung, eine Phase). Keine
neuen Module, kein neuer JS-Code unter `src/`. Nur Spec- und Test-
Nachzieher in Doku, Sichttest-Aufrundung und das einzeilige Anwenden
der kalibrierten Schwelle im bestehenden Code-Stub.

**Branch:** `claude/pflege-match-kalibrierung-TgwuF`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B + §C
und am Übergabeprotokoll der Spec+Bau-Sitzung 02 vom 2026-05-14.
**Modul:** 04_match (zentrale Kalibrierung) · 01/02/03 (nur
Bauzustand-Aufrundung).

---

## Auftrag

Drei Aufgabenstränge in einer Phase:

1. **PROVIDER_MIN_MATCH und die Test-Schwellen kalibrieren** —
   Karte 04 + Panel 04 + `INTERFACES.md` §0/§1/§6 + `ARCHITEKTUR.md`
   §7 + `status.json` `config.PROVIDER_MIN_MATCH` + Code-Konstante in
   `src/modules/04_match.js`. Begründung kommt aus Klaus' fünf
   reproduzierbaren Cosinus-Messwerten vom Sichttest 2026-05-14.
2. **Offene Sichttest-Zeilen aufrunden** — Karten 01/02/03/04
   Bauzustand-Tabelle, Zeile „Sichttest", mit Datum + kurzem Befund.
3. **Sitzungs-Abschluss:** PULS-Eintrag (Pflege-Sitzung Match-
   Kalibrierung), Übergabeprotokoll (diese Datei), WEGWEISER-Stand-
   Block-Zeile, Branch pushen, Draft-PR gegen main, danach merge.

Vorgaben aus dem Sitzungs-Briefing, die diese Sitzung übernimmt:

- **`PROVIDER_MIN_MATCH = 0.80`** als zentrale Änderung — trennt
  empirisch „relevant" (0.83) von „irrelevant" (0.77).
- **Test-Schwellen für Karte 04 / Panel 04 anheben** — „Ähnlich"
  > 0.70 → > 0.92; „Fern" < 0.40 → < 0.85; Schwelle-Tests auf
  `PROVIDER_MIN_MATCH`.
- **Keine Modul-Status-Hochstufung.** Module bleiben auf ihren
  bisherigen Werten (4× stub, 1× werkstatt, 8× schablone). Pie
  regeneriert nicht.
- **Frischer-Kopf-Korrekturen erlaubt**, wenn eine der vorgeschlagenen
  Schwellen einen der echten Messwerte falsch klassifiziert. Begründung
  in den Risiken-Block der Karte 04.

---

## Was getan wurde

### 1. Schwellen kalibriert

**`PROVIDER_MIN_MATCH` 0.55 → 0.80** an allen Quellen:

- `docs/INTERFACES.md` §0 (Konstanten-Block)
- `docs/INTERFACES.md` §1 Modul 04 (drei Stellen: Vertrag-Schwelle,
  Selbstcheck-Format, Garantie-Block für 05/07)
- `docs/INTERFACES.md` §6 Änderungsprotokoll (neue Zeile mit
  Datum, „Pflege-Sitzung Match-Kalibrierung" und Befund)
- `docs/components/04_match.md` (Im-Mycel-Bild, SVG-Schwellen-Kegel-
  Beschriftung, Verantwortlichkeiten-Block, Schnittstellen-Signaturen,
  Selbstcheck-Block, Konfigurationswerte-Block, Manueller-Test-Erwartung
  in den Test-Beschreibungen, Risiken-Block, Bauzustand-Tabelle)
- `docs/ARCHITEKTUR.md` §7 Konfigurationswerte-Block
- `status.json` Feld `config.PROVIDER_MIN_MATCH`
- `src/modules/04_match.js` Code-Konstante `PROVIDER_MIN_MATCH`,
  Header-Kommentar und Selbstcheck-String
- `tests/manual_check.html` Panel 04 Selbstcheck-Hinweisknopf
- `index.html` Glossar-Eintrag „Match" + Wanderungs-Phase-2-Beschreibung

JS-Syntax mit `node --check src/modules/04_match.js` validiert (grün).
`status.json` mit `python3 -c "import json; json.load(...)"` validiert
(0.8 → korrekt).

### 2. Test-Schwellen angehoben

In Karte 04 (Manueller-Test-Abschnitt) und Panel 04
(`tests/manual_check.html`):

- **„Ähnlich" `> 0.70` → `> 0.92`** — Käsekuchen/Käsetorte = 0.9507,
  Reserve 0.0307.
- **„Fern" `< 0.40` → `< 0.90`** *(korrigiert von vorgeschlagenen
  0.85; siehe Begründung weiter unten)* — Käsekuchen/Auspuffrohr =
  0.8967, Reserve 0.0033.
- **Schwelle-Tests `> / < 0.55` → `PROVIDER_MIN_MATCH = 0.80`** —
  Hefeteig/Kochrezepte = 0.8312 (passt mit Reserve 0.0312);
  Tarantino/Kochrezepte = 0.7737 (passt mit Reserve 0.0263).

Knopf-Labels in Panel 04 mit-angepasst, `pass`-Konstanten in den
Knopf-Handlern entsprechend, Erwartungs-Strings mit aktualisiert.

### 3. Risiken-Block „Schwellwert-Tuning" zum Beleg-Block umgebaut

Aus dem spekulativen Risiko-Eintrag (Paper-Erst-Schätzung könnte zu
viel/wenig filtern) wurde ein empirischer Beleg-Block mit:

- Tabelle der fünf Messwerte aus Klaus' Browser-Sichttest
- Begründung der 0.80-Wahl (Trennung zwischen 0.83 relevant und 0.77
  irrelevant)
- Abweichung der „Fern"-Schwelle vom Briefing (< 0.85 → < 0.90) mit
  knapper Begründung: 0.8967 wäre unter 0.85 nicht eingeordnet worden;
  der hohe e5-small-Baseline-Cosinus für unverwandte Einzelbegriffe ist
  eine relevante Modell-Eigenschaft, kein Toleranz-Spielraum

Der „Modell-Drift"-Block wurde enger an die neuen Schwellen angepasst:
0.5 %-Drift bricht die Tests jetzt — und das soll sie auch (Frühwarnsystem
für e5-small-Updates).

### 4. Sichttest-Zeilen aufgerundet

Karten 01/02/03/04 Bauzustand-Tabelle, Zeile „Sichttest":

- **01 Storage** — „geprüft 2026-05-14 (Klaus, im Browser):
  init/round-trip/Unknown-Store sauber. DB `sbkim` mit sechs Stores
  in DevTools sichtbar."
- **02 Spore** — „geprüft 2026-05-14 (Klaus, im Browser): Identität
  deterministisch, Spore vollständig + sortiert, Sign+Verify round-trip
  valid, Manipulation erkannt."
- **03 Embedding** — „geprüft 2026-05-14 (Klaus, im Browser): Modell
  lädt, L2-Norm exakt 1.0, Query/Passage gleicher Inhalt ≈0.95, Batch
  zwischen verschiedenen Themen 0.90 (überraschend hoch — Anlass für
  Match-Kalibrierung)."
- **04 Match** — „geprüft 2026-05-14 (Klaus, im Browser): 3 Tests grün
  (Käsetorte ähnlich, Hefeteig positiv, Form-Fehler); 2 Tests
  offenbarten Schwellen-Drift (Auspuffrohr 0.8967 statt < 0.40;
  Tarantino 0.7737 statt < 0.55) — daraufhin Kalibrierungs-Sitzung
  2026-05-14 `PROVIDER_MIN_MATCH` 0.55 → 0.80, Test-Schwellen
  0.70/0.40 → 0.92/0.90".

### 5. PULS + WEGWEISER aktualisiert

- **PULS.md:** neuer Sitzungs-Eintrag oben (Pflege-Sitzung Match-
  Kalibrierung). Schnellüberblicks-Zeilen 01/02/03/04 von „ungeprüft"
  auf „geprüft 2026-05-14 (Klaus)" gesetzt. „Als nächstes ✨" umgebaut:
  die vier Module sind jetzt sichtgeprüfter Stub, Empfehlung
  Hauptsitzung verschoben auf **Spec-Sitzung Modul 05 Anastomose**
  (alle vier Vorbedingungen sichtgeprüft).
- **WEGWEISER.md:** Stand-Block-Zeile unten ergänzt (Wanderung —
  neueste Zeile unten).

### 6. status.json: KEINE Score-Änderung

Wie das Briefing vorgibt: diese Sitzung kalibriert nur, sie befördert
kein Modul auf „fertig". Status-Counts bleiben 4× stub / 1× werkstatt /
8× schablone. **`scripts/update_puls_pie.py` wurde nicht aufgerufen** —
es wäre eine No-Op gewesen und hätte nur den Hash des Pie-Blocks
verändert.

Aktualisiert wurde im `status.json` ausschließlich das Konfig-Feld
`config.PROVIDER_MIN_MATCH` von `0.55` auf `0.80`.

---

## Frischer-Kopf-Korrektur: „Fern"-Schwelle 0.85 → 0.90

Das Briefing schlug vor:

```
„Fern": < 0.85   (statt < 0.40)
```

Der gemessene Wert für „Fern" ist jedoch **0.8967** (Käsekuchen /
Auspuffrohr). Eine Schwelle `< 0.85` hätte diesen Test als
**fehlgeschlagen** klassifiziert — was dem Sichttest-Befund
„3 Tests grün, 2 Tests offenbarten Drift, Pflege-Sitzung kalibriert
nach" widersprochen hätte (alle Tests sollten nach Kalibrierung grün
sein).

Korrektur: **„Fern" < 0.90** mit 0.0033 Reserve gegen den Messwert.
Eng, aber empirisch belegt. Der Beleg-Block in Karte 04 hält fest, dass
die e5-small-Baseline für unverwandte Einzelbegriffe ungewöhnlich hoch
sitzt — das ist eine Modell-Eigenschaft, kein Bug. Eine zukünftige
Modell-Drift > 0.5 % bricht die Tests, und das ist beabsichtigt
(Frühwarnsystem).

---

## Was offen blieb

- **Modul 05 Anastomose** verwendet in seiner Schablone noch die alte
  Schwelle 0.55 (Mermaid-Block + manueller-Test-Abschnitt). Wird in der
  nächsten Spec-Sitzung Modul 05 ohnehin umgeschrieben — die Schablone
  ist die ganze Karte. Keine Pflege-Aktion dafür nötig.
- **Sage-Page (`index.html`)** zieht den Schwellwert aus zwei Quellen:
  `status.json` (Konfig, jetzt 0.80) und zwei hardgecodete Strings
  (jetzt beide 0.80). Wer den Wert künftig wieder ändert, sollte beide
  Stellen auf die Datenquelle zurückführen — kleiner Aufräum-Auftrag
  für eine UI-Sitzung.
- **Historische Doku** (PULS-Sitzungs-Einträge 2026-05-14, Übergabe-
  protokolle der vorigen Sitzungen) erwähnt 0.55 — bleibt unverändert
  (historische Records).

---

## Nächster sinnvoller Schritt

1. **Spec-Sitzung Modul 05 Anastomose** starten — alle vier
   Vorbedingungen (01, 02, 03, 04) stehen jetzt sichtgeprüft als Stub.
   Anastomose ist der Handshake zwischen zwei Knoten und braucht alle
   vier Bausteine zusammen: IDs aus 02, Embedding aus 03, kalibriertes
   Match aus 04, Persistenz für Geschwisterliste aus 01.
2. Alternativ: **Spec-Sitzung Modul 07 Apoptose** (Vorbedingungen
   01 + 02 erfüllt; signiertes Vermächtnis braucht den Ed25519-
   Schlüssel aus 02).
3. Parallel anbietbar: **Spec-Sitzung Modul 00 (Doku-Fenster)** oder
   **Modul 09 (Einbau-PWA)** — beide ohne Abhängigkeiten.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/INTERFACES.md` §0 `PROVIDER_MIN_MATCH` 0.55 → 0.80
- [x] `docs/INTERFACES.md` §1 Modul 04 Vertrag konsistent (drei Stellen)
- [x] `docs/INTERFACES.md` §6 Änderungsprotokoll-Zeile ergänzt
- [x] `docs/components/04_match.md` Schwelle aktualisiert, Risiken-Block
      zum Beleg-Block umgebaut, Test-Schwellen 0.70/0.40 → 0.92/0.90,
      Bauzustand-Sichttest-Zeile aufgerundet
- [x] `docs/components/01_storage.md` Sichttest-Zeile aufgerundet
- [x] `docs/components/02_spore.md` Sichttest-Zeile aufgerundet
- [x] `docs/components/03_embedding.md` Sichttest-Zeile aufgerundet
- [x] `docs/ARCHITEKTUR.md` §7 `PROVIDER_MIN_MATCH` 0.55 → 0.80
- [x] `tests/manual_check.html` Panel 04 Knopf-Labels +
      `pass`-Konstanten + Selbstcheck-Hinweis
- [x] `src/modules/04_match.js` Code-Konstante + Header-Kommentar +
      Selbstcheck-String, JS-Syntax via `node --check` grün
- [x] `index.html` Glossar-Match-Eintrag + Wanderungs-Phase-2-Mech
- [x] `status.json` `config.PROVIDER_MIN_MATCH` 0.80; KEINE
      Modul-Score-Änderung; Pie NICHT regeneriert (No-Op)
- [x] `docs/PULS.md` Sitzungs-Eintrag oben, Schnellüberblick + „Als
      nächstes ✨" angepasst
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile unten ergänzt
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/pflege-match-kalibrierung-TgwuF`
      (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
