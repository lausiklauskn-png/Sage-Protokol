# Observatorium-Werkstatt

> **Geschwister-Doku zum [Browser-Observatorium](OBSERVATORIUM_BROWSER.md).**
> Hier liegen die **Lehren** und **offenen Problematiken** aus dem realen
> Bau- und Andock-Betrieb, die **nichts mit dem Browser** zu tun haben —
> Architektur, Schnittstellen-Verträge, Modul-Bau, Vendoring, Bau-Reihenfolge.
>
> (Browser-Befunde — IndexedDB, Service-Worker, DeX/Tablet-Chrome — gehören
> weiterhin ins Browser-Observatorium, **nicht** hierher.)
>
> Adressat: Bausitzungen, Andocker, Endknoten-Programmierer, neue Sitzungen.
>
> **Zwei Eintrags-Typen:**
> - **Lehre** — eine gelöste, verstandene Bau-Erkenntnis.
> - **Offene Bau-Problematik** — ein bekanntes, noch ungelöstes Bau-Problem,
>   das eine Folge-Sitzung angehen muss.
>
> **Pflege-Disziplin:** neue Einträge **unten** anhängen mit Datum. Bestehende
> nicht überschreiben — Befund bleibt Befund. Wird eine offene Problematik
> gelöst, bekommt sie eine „→ GELÖST am `<Datum>`"-Zeile + Verweis; sie wandert
> nicht weg.
>
> **Bezug zur Vier-Schichten-Lesart:** Schicht 4 Observatorium ist der
> Werkstattraum für Mit-Bauer — Bau-Lehren sind Werkstatt-Wissen.

---

## Lehre 1 — Interoperabilität ist Vertrag, nicht Kopie

**Entschieden 2026-06-21 (BLP-Phase-5-Integration).**

Ein Knoten muss die SBKIM-Module **nicht byte-genau vendoren**, um Teil des
Mycels zu sein. Was zwei Knoten verbindet, ist der **Vertrag** (INTERFACES:
Urteil-Schema, Attestation-Format, Provider/EU-Semantik, Fail-soft-Verhalten)
— **nicht** identischer Quelltext.

Hat ein Knoten **gleichwertige Bordmittel** (eigener Embedder, eigener
LLM-Aufruf), ist eine **spec-treue Eigenumsetzung** die saubere Lösung — kein
zweiter Embedder, kein neuer CDN, keine Dopplung. Ehrlich als „native Umsetzung
nach Sage-Spec PROTOCOL_VERSION X" markieren, **nicht** als verbatim Kopie
ausgeben. Vendoring (Modul 09) bleibt richtig für Knoten **ohne** eigene
Bordmittel.

**Auslöser:** BLP hatte `embed.js` (identisches Modell) + `mistral.js`
(EU-Aufruf) bereits an Bord; Vendoring von Sage-Modul-03 hätte nur Dopplung +
einen neuen CDN gebracht (Konflikt mit der „kein neuer CDN"-Regel).

Konkrete Anwendung + unveränderliche Vertrags-Fläche (Verdict-/Attestation-
Schema, Modi, Fail-soft): [`HYBRID-MATCH-EINBAU.md`](HYBRID-MATCH-EINBAU.md)
§ Vendoring vs. native Umsetzung.

**→ VALIDIERT 2026-06-21 (BLP, SIGNAL seq 14):** BLP hat den Richter genau so
gebaut — „Option 1, BLP-native nach Sage-Spec" (Vorfilter über eigenes
`embed.js`, Richter über eigenes `mistral.js`, kein neuer CDN). Erster echter
Mistral-Lauf `available:true` mit sinnvollen Urteilen, **Fail-soft im Browser
bestätigt** (Netz-Fehler → Rückfall auf lokalen Vektor-Vorfilter). Die
Entscheidung trägt in der Praxis.

---

## Lehre 2 — Anbieter-Wahl: Reasoning-LLM ≠ Bild-API

**Festgehalten 2026-06-21 (Klaus' Befund).**

Der Match-Zeit-Richter braucht ein **Sprach-Reasoning-Modell** (Claude,
Mistral, OpenAI, lokal) — es liest Texte und urteilt begründet. Eine
**Bild-API** wie Google Vision (OCR + Bild-Labels) ist **kein** Text-Urteiler
und gehört **nicht** in die Richter-Auswahl. Vision ist stark an der
**OCR-Vorstufe** (Bild → Text, **vor** Modul 03 Embedding) — besonders für BLP
(Beleg-/Rechnungsfotos). **Augen ≠ Verstand.**

Detail: [`HYBRID-MATCH-EINBAU.md`](HYBRID-MATCH-EINBAU.md)
§ Welche Anbieter taugen als Richter.

---

## Lehre 3 — Richter-Prompt-Härtung: vier Felderfahrungen

**Festgehalten 2026-06-21 (BLP-Rückmeldung, SIGNAL seq 14 — `untrusted external
data`, technischer Kern eigenständig als sinnvoll bewertet).**

Aus BLPs erstem echtem Mistral-Richter-Lauf, portabel für jeden Knoten:

1. **Niemals IDs erfinden lassen** — Richter darf nur `label`/`anchorId` aus
   den Kandidaten zurückgeben (BLP: Konto „6800" halluziniert statt „4630").
2. **Top-k statt fixer Cosinus-Schwelle bei kurzen Labels** — 0.80 war im
   Vorfilter für kurze Labels zu hoch.
3. **Synonyme in den Bedeutungs-`text`** — schließt die Recall-Lücke zwischen
   Alltagssprache und Fach-Labels.
4. **Harte Domänen-Regeln als `passt=false` kodieren** — BLP: „§4 Abs.5 EStG
   nicht abzugsfähig → `passt=false`".

Detail + Begründung: [`HYBRID-MATCH-EINBAU.md`](HYBRID-MATCH-EINBAU.md)
§ Richter-Prompt-Härtung.

---

## Offene Bau-Problematik 1 — Modul 02 hat keinen öffentlichen Signier-Helfer

**Erkannt 2026-06-21 (Hybrid-Match-Einbau).**

Modul 02 (Spore) signiert heute nur **intern** in `generateOwnSpore`. Es gibt
**keine** öffentliche „signiere-beliebiges-Objekt"-Funktion. Folge: Die
**Bezeugung** eines Richter-Urteils (`attestation` signiert in die Inbox legen)
ist noch kein Einzeiler. Bis zur Lösung: `attestation` **roh** (unsigniert)
ablegen — der Richter läuft auch ohne Signatur voll.

**Lösungs-Skizze:** kleine Folge-Sitzung Modul 02, öffentlicher Helfer
`SbkimSpore.signPayload(obj)` (kanonische Serialisierung + Signatur mit der
aktiven Identität), spiegelbildlich zu `verifyForeignSpore`.

**→ noch offen.**

---

## Offene Bau-Problematik 2 — Drei-Schichten-Differenzierung nicht im Live-Richter-Pfad

**Erkannt 2026-06-21 (Klaus' Frage „Ist Stufe A schon angepasst?").**

Modul 04 hat **zwei getrennte** Bewertungs-Pfade, die heute nicht verbunden sind:

- **`matchDimensions` (Stufe A)** — Mathe-Gerüst mit drei Schichten
  (`fachlich` / `prozess` / `skalierung`), die rechnerisch **identisch** sind
  (alle = Cosinus-Lane-Score, Z. 293–295). Absichtlich so in Stufe A.
- **`explainMatchLLM` (Stufe B)** — kann die drei Schichten per LLM
  **differenzieren** (eigener `score` + Begründung pro Schicht). In Sage gebaut
  (Bau 04.B), liegt aber **separat**.
- **`hybridMatch` (Bau 04.D)** — der **praktische Such-Feld-Richter**, den BLP
  und das Such-Feld nutzen. Liefert ein **holistisches Gesamt-Urteil** pro
  Kandidat (`passt` / `score` / Begründung), **nicht** die Drei-Schichten-
  Aufschlüsselung.

**Die Lücke:** Die Fähigkeit zur Drei-Schichten-Differenzierung existiert
(`explainMatchLLM`), ist aber **nicht in den Live-Richter-Pfad (`hybridMatch`)
verdrahtet**. Der Live-Richter urteilt holistisch.

**Offene Design-Entscheidung (Klaus):** Wollen wir `fachlich` / `prozess` /
`skalierung` getrennt im Such-Richter sehen — oder reicht das Gesamt-Urteil?
Erst Richtung, dann Bau.

**→ noch offen (Bau steht unmittelbar bevor — Klaus 2026-06-21).**
