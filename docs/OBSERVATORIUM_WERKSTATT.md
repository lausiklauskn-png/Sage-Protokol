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
