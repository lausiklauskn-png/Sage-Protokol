# Übergabeprotokoll · 2026-05-15 · Spec-Sitzung — Stamm/Gast-Felder in Spore-JSON

**Sitzungs-Rolle:** Spec-Sitzung, headless, EINE Phase. Diese Sitzung
löst die vier offenen Fragen, die `docs/ARCHITEKTUR.md` §8 nach der
Konzept-Anlage aus der vorherigen *Live Andock Iteration 2*
hinterlassen hatte, und nimmt die entsprechenden additiven Felder in
INTERFACES.md §2 sowie die Pflege-Hinweise in Karten 02 und 04 auf.

**Branch:** `claude/spec-stamm-gast-spore-felder`

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B
(Spec-Sitzung) — Karten-Pflege ohne Modul-Bau, plus heilige-Tafeln-
Eintrag in §2 + §6.

**Karten:** 02 (Spore — § Datenformat), 04 (Match — § Konfigurations-
werte), plus ARCHITEKTUR.md §8 (Konzept-Sektion nachgezogen) und
INTERFACES.md §2 / §6.

---

## Auftrag

Vier Fragen aus `docs/ARCHITEKTUR.md` §8 entscheiden, die in der
vorherigen Konzept-Sitzung offen geblieben waren:

1. Feldnamen `stammCategories` / `guestCategories` (deutsch im
   Stil von `domainKeywords`) oder englischer `coreCategories` /
   `guestCategories`?
2. Match-Dämpfungsfaktor für Stamm↔Gast verbindlich festlegen
   (Default-Vorschlag `0.5`)?
3. `domainVector` als Gesamt-Vektor vs. separate `stammVector` /
   `guestVector`?
4. UI-Label „Überraschungs-Plus" verbindlich oder weicht das beim
   Live-Einbau?

Plus die entsprechenden additiven Einträge in INTERFACES.md §2
Spore-JSON, Karten-Pflege 02 / 04, und Eintrag in §6
Änderungsprotokoll.

---

## Was getan wurde

### 1. Die vier Entscheidungen

**Frage 1 (Feldnamen): `stammCategories` / `guestCategories`**

Begründung: das Sage-Protokol hat ein konsistentes Vokabular, in dem
die SBKIM-Fachbegriffe deutsch sind und nicht anglisiert werden:
**Spore** (statt seed/spore), **Anastomose** (statt connect/handshake),
**Heterokaryose** (statt heterokaryosis als API-Begriff), **Apoptose**
(statt apoptosis als API-Begriff). „Stamm" und „Gast" sind durch die
Diskussion in der vorherigen Sitzung feststehende SBKIM-Begriffe
geworden — sie gehören in dieses Vokabular hinein. Die umliegenden
Schema-Felder (`createdAt`, `nodeType`, `domainVector`) sind englisch
und bleiben das auch; Stamm/Gast sind die Sage-spezifischen Schichten.

**Frage 2 (Match-Eingriff): verworfen**

Das war meine Idee in der Konzept-Sitzung, kein Wunsch von Klaus. Bei
genauerem Hinsehen ist sie schlecht begründet:

- Zwei Knoten verbinden sich (Anastomose-Handshake) anhand der
  Cosinus-Ähnlichkeit ihrer Domäne **als Ganzes**. Sie kennen sich auf
  Knoten-Ebene, nicht auf Kategorie-Ebene. Ob der Match „im Stamm"
  oder „im Gast" zustande kam, ist für die Verbindungs-Entscheidung
  irrelevant — wichtig ist, dass es überhaupt einen passenden
  semantischen Überlapp gibt.
- Eine zweite Schwelle oder ein Dämpfungsfaktor verkomplizieren
  Modul 04 ohne Gegenwert. Die Bug-Anfälligkeit (versehentlich
  falscher `relation`-Parameter) ist genau die, die Modul 04 mit
  seinem modus-freien Design vermeiden will (siehe Karte 04 § Warum
  kein `mode`-Parameter).
- Stamm/Gast ist eine **Sortier- und Sichtbarkeits-Eigenschaft auf
  UI-Ebene** (Modul 08 / 09). Treffer aus `stammCategories` werden
  prominent angezeigt, Treffer aus `guestCategories` als
  „Überraschungs-Plus". Die Vektor-Math darunter bleibt unklassifiziert.

Konsequenz: Modul 04 bleibt **vollkommen unverändert**.
`match(queryVec, passageVec) → number` ist reine Cosinus-Mathematik
ohne Klassifikation. `isAboveProviderThreshold(score) → boolean`
bleibt eine einzige Schwelle.

Sollte spätere Empirik zeigen, dass Stamm↔Gast-Matches systematisch
andere Cosinus-Verteilungen haben als Stamm↔Stamm-Matches, ist das
Anlass für eine eigene Pflege-Sitzung — nicht diese Spec-Sitzung.

**Frage 3 (Vektor-Aufteilung): single `domainVector` bleibt**

Pragmatik der Erst-Iteration. Ein einziger `domainVector` (über alle
Kategorien gemittelt, wie bisher in Karte 03 spezifiziert) reicht für:

- Anastomose-Handshake (Knoten-Ebene-Ähnlichkeit).
- Match in Modul 04 (Skalar, modus-frei).
- Heterokaryose-Anker (mehrere Vektoren pro Knoten möglich, aber
  Stamm/Gast spielt für die Anker-Auswahl keine Rolle — Modul 06
  bleibt unangetastet).

Separate `stammVector` / `guestVector` als zwei zusätzliche optionale
Felder in Spore-JSON sind später additiv möglich, sobald Klaus' Live-
Andock empirisch zeigt, dass die Trennung Match-Scores erkennbar
verbessert. Bis dahin: ein Vektor, zwei Kategorie-Listen.

**Frage 4 (UI-Label): „Überraschungs-Plus" verbindlich**

Klaus' Begriff ist menschlich-charmant und trägt die Bedeutung gut
(es ist überraschend, dass man Knabbereien in einer Cocktail-App
findet — aber es plus-bringt thematisch zum Anlass). Bleibt
verbindlich für die Endknoten-PWA-UI (Mixarium, Rezeptbuch).

Die Sage-Page-Doku und der technische Begriff im Sage-Protokol
verwenden „Gast-Kategorie" — der Begriff ist neutraler, kürzer und
maschinen-tauglicher (passt zu `guestCategories`).

### 2. Die heiligen Tafeln nachgezogen

**`docs/INTERFACES.md` §2 Spore-JSON Optionale Felder:**

Block um zwei Zeilen erweitert (alphabetisch hinten angefügt, da
optional und neu):

```
stammCategories     : string[]                Kerngebiet-Kategorien des Knotens (siehe ARCHITEKTUR.md §8).
                                              Beispiel Mixarium: ["Cocktails", "Mocktails", "Limonaden"].
                                              Beispiel Rezeptbuch: ["Vorspeisen", "Fleisch", "Fisch", "Vegetarisch"].
                                              Sortier-Reihenfolge frei wählbar; kanonische JSON-Sortierung
                                              sortiert nur Object-Keys, nicht Array-Elemente.
guestCategories     : string[]                Begleit-Kategorien (UI-Label: "Überraschungs-Plus").
                                              Beispiel Mixarium: ["Knabbereien", "Fingerfood"].
                                              Beispiel Rezeptbuch: ["Begleitgetränke", "Weinkarte"].
                                              Disjunkt zu stammCategories (kein Element in beiden Listen);
                                              das ist Hosting-Pflicht des Knotens, kein Empfänger-Check.
```

Verifikations-Pfad, Versionierungs-Regel, kanonische Serialisierung —
alles **unverändert**. Die zwei neuen Felder gehen in den Sign-Pfad
wie alle anderen Optionalen.

**`docs/INTERFACES.md` §6 Änderungsprotokoll:**

Zeile am Ende (Konvention: neueste unten) mit kompakter Beschreibung
der vier Entscheidungen und Verweis auf dieses Übergabeprotokoll.

**`docs/components/02_spore.md` § Datenformat Optionale Felder:**

JSON-Beispiel-Block um die zwei neuen Zeilen erweitert. Direkt
darunter ein erklärender Absatz: dass die Felder reine String-Listen
sind, im kanonischen JSON-Format normal mitgereicht werden (Object-
Keys alphabetisch, Array-Reihenfolge bleibt vom Knoten gesetzt und
ist Teil der Signatur), und dass die Disjunktheit Hosting-Pflicht
ist (kein `verifyForeignSpore`-Abbruch).

**`docs/components/04_match.md` § Konfigurationswerte:**

Neuer Sub-Block „Stamm/Gast-Klassifikation berührt Modul 04 nicht"
direkt nach der `PROVIDER_MIN_MATCH`-Quelle. Sagt explizit: kein
`relation`-Parameter, kein Dämpfungsfaktor, keine zweite Schwelle.
Verhindert, dass eine spätere Bau-Sitzung den Match-Eingriff aus
einer alten ARCHITEKTUR-Notiz „hochzieht".

**`docs/ARCHITEKTUR.md` §8 Stamm- und Gast-Kategorien:**

- Status-Block aktualisiert: „Spec festgelegt 2026-05-15" statt
  „Spec ausstehend".
- Konsequenzen-Tabelle: Modul 04 von „Dämpfungsfaktor" auf
  „unverändert" korrigiert mit Begründung. Modul 03 von „getrennt
  vektorisiert" auf „Erst-Iteration unverändert, single
  `domainVector`" korrigiert.
- Vier offene Fragen jeweils mit `~~strikethrough~~` als gelöst
  markiert; Antwort direkt unterhalb (knapp).

**`docs/PULS.md`:**

- §Empfehlung-Block umformuliert: nächster Schritt ist **Bau-Sitzung
  09 Iteration 3**, Voraussetzung Stamm/Gast-Spec ist jetzt geliefert.
- §Schnellüberblick: Modul-02-Zeile und Modul-04-Zeile mit
  Anmerkungen zu der Karten-Pflege ergänzt.
- §Sitzungs-Einträge: bisheriger Eintrag „Live Andock Iteration 2"
  als Index-Zeile in §Archiv-Index, dieser neue Eintrag ausführlich
  oben.

---

## Was bewusst nicht geändert wurde

- **`docs/INTERFACES.md` §0** — keine neue Konstante (kein
  Dämpfungsfaktor, keine zweite Schwelle).
- **`docs/INTERFACES.md` §1 Modul-Verträge** — keine API-Signatur
  ändert sich. Karten-Pflege ist nicht Karten-API-Eingriff.
- **`docs/INTERFACES.md` §3 / §4 / §5** — Endpunkte, Versionierungs-
  Regeln, Status-Farb-Mapping unverändert.
- **`src/modules/*`** — Module 02 / 03 / 04 bleiben unverändert.
  `stammCategories` / `guestCategories` sind **optionale Felder** —
  bestehende Spore-Builder müssen nichts ändern, sie schreiben die
  Felder nur, wenn sie etwas haben.
- **`tests/manual_check.html`** — Panel 02 / 04 bleiben unverändert.
- **`status.json`** — keine Score-Änderung (`update_puls_pie.py`
  nicht aufgerufen).
- **`index.html`** (Sage-Page) unverändert — keine Mermaid-/DAG-
  Änderung.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`. Additive Optionale; kein
  Hauptversions-Sprung.
- **`docs/GLOSSAR.md`** — bewusst noch nicht erweitert. Sobald die
  Bau-Sitzung 09 Iteration 3 die Begriffe „Stamm" / „Gast" / „Über-
  raschungs-Plus" in den Endknoten live verdrahtet, gehören sie ins
  Glossar. Heute Spec-Sitzung greift dem nicht vor.
- **`docs/components/03_embedding.md`** — keine Pflege nötig.
  Embedding bleibt single-`domainVector`; eine spätere Pflege „Stamm
  /Gast-Vektor-Aufteilung" kann die Karte erweitern, wenn empirisch
  motiviert.
- **Andere Karten (00, 01, 05, 06, 07, 08, 09, 10, 11, 12, 14)** —
  keine Pflege nötig. UI-Konsequenzen (Stamm prominent, Gast
  sekundär) kommen in einer Folge-Pflege Karte 08 / 09, **nicht in
  dieser Spec-Sitzung**.

---

## Validierung

- **Cross-Reading der vier betroffenen Doku-Files** (ARCHITEKTUR.md,
  INTERFACES.md, 02_spore.md, 04_match.md):
  - ARCHITEKTUR.md §8 Konsequenzen-Tabelle „Modul 04 unverändert" ↔
    Karte 04 § neuer Sub-Block „berührt Modul 04 nicht": **stimmen
    überein**.
  - INTERFACES.md §2 Spore-JSON Optionale Felder ↔ Karte 02 §
    Datenformat Optionale Felder: **gleiche zwei Felder mit gleicher
    Begründung**.
  - ARCHITEKTUR.md §8 Status-Block ↔ INTERFACES.md §6
    Änderungsprotokoll-Zeile: beide verweisen auf dieses
    Übergabeprotokoll-File.
- **Markdown-Syntax sichtgeprüft** — keine kaputten Anker-Links, keine
  unbalancierten Backticks, keine unbalancierten Code-Blöcke (vier
  Edits, jeder geöffnete Code-Block sauber geschlossen).
- **PULS-Rotation** durchgezogen — bisheriger oberster Eintrag jetzt
  als Index-Zeile in §Archiv-Index mit Link, neuer Eintrag oben
  ausführlich.

---

## Was offen blieb

### Bau-Sitzung 09 Iteration 3

Voraussetzungen jetzt alle erfüllt:

- Karte 09 vollständig (Schritte 1–9, Pre-Flight, 3a/3b/3c, Tablet-
  Variante mit Eruda) — aus Pflege Karte 09 (2026-05-15).
- Eruda live in beiden Endknoten — aus Live Andock Iteration 2
  (2026-05-15).
- Stamm/Gast-Felder spezifiziert — aus dieser Spec-Sitzung.

Iteration 3 kann jetzt die ersten echten `/sbkim/spore.json` für
beide Endknoten erstellen, **inklusive** `stammCategories` und
`guestCategories`. Variante 3b (`importScripts('./sbkim-sw.js')` im
bestehenden App-SW) ist Default.

### INTERFACES.md §6 Änderungsprotokoll-Tabellen-Bug

Beim Squash-Merge des vorigen PRs (#45) sind zwei Tabellenzeilen
verschmolzen: die Bau-Sitzung-08-Zeile und die Live-Andock-Iteration-
2-Zeile stehen in einer Zeile, was die Markdown-Tabellen-Darstellung
bricht. Inhaltlich beide Einträge vorhanden, nur formatlich falsch.

**Fix-Anleitung für eine spätere kleine Pflege-Sitzung:**

1. INTERFACES.md aufmachen, Zeile 1695-1696 anschauen.
2. Die kurze Bau-Sitzung-08-Zeile (Z. 1695) löschen — sie ist
   redundant zu dem langen Bau-Sitzung-08-Inhalt, der am Ende von
   Z. 1696 steht.
3. Z. 1696 in zwei Zeilen splitten:
   - Erste Zeile: vom Anfang bis einschließlich
     `...2026-05-15_live-andock-eruda-stamm-gast.md). |`
   - Zweite Zeile (neu eingefügt): `| 2026-05-15 | Bau-Sitzung 08 |
     IIFE mit window.SbkimUiDemo, … bau-08-ui-demo.md angelegt. |`
4. Commit als „Pflege INTERFACES.md §6 Tabellen-Bug nach
   Squash-Merge".

Niedrige Dringlichkeit — die Tabelle ist lesbar, nur eine Zeile
wirkt überfüllt.

### Endknoten-Mini-Pflege „Sushi-Kategorie sichtbar machen"

Entkoppelt von dieser Spec-Sitzung. Klaus entscheidet, ob die
ehemals existierende Sushi-Kategorie in Mein-Mixarium reaktiviert
wird (dann werden die 6 Items als Gast-Kategorie sichtbar) oder ob
die 6 Items in der Mixarium-Datenbank gelöscht werden (weil im
Rezeptbuch parallel vorhanden).

### Eruda-Rückbau

Nach erfolgreichem Bau-09 Iteration 3 die zwei Eruda-Zeilen aus
beiden Endknoten-`index.html` wieder entfernen:

```bash
sed -i '/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/eruda@3"><\/script>/d; /<script>eruda\.init();<\/script>/d' index.html
```

Plus Commit und Push pro Endknoten.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung 09 Iteration 3** mit Klaus am Live-Andock-Versuch
   in beiden Endknoten. *Nicht headless.* Variante 3b mit
   Pre-Flight + `importScripts` ist Default. Spore-JSONs mit
   `stammCategories` + `guestCategories` versehen.
2. **Mini-Pflege INTERFACES.md §6 Tabellen-Bug** — *headless
   möglich*, niedrige Dringlichkeit.
3. **Endknoten-Mini-Pflege „Sushi-Kategorie sichtbar machen"** in
   Mein-Mixarium — parallel zu Schritt 1 möglich.
4. **Klaus' Sichttest Panel 06** (Heterokaryose), weiterhin offen.

---

## Material aus der Sitzung

**Beispielwerte für die zwei neuen Felder (für Bau-Sitzung 09):**

Mein-Mixarium:
```json
{
  "stammCategories": ["Cocktails", "Mocktails", "Alkfr. Cocktails",
                      "Smoothies & Shakes", "Limonaden"],
  "guestCategories": ["Knabbereien", "Fingerfood"]
}
```

(Spätere Erweiterung um `["Wein"]` in Stamm, sobald Klaus die
Weinkarte einbaut.)

Mein-Rezeptbuch:
```json
{
  "stammCategories": ["Vorspeisen", "Suppen", "Fleisch", "Fisch",
                      "Vegetarisch"],
  "guestCategories": ["Begleitgetränke"]
}
```

(Spätere Erweiterung um `["Weinkarte"]` in Gast, sobald sie
existiert.)

**Disjunktheit-Prüfung:** Beide Beispiele haben keine Überlappung —
gut. Hosting-Pflicht des Knotens, wird beim Verify nicht
abgewiesen, aber gute Hygiene.
