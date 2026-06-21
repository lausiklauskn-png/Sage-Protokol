# Übergabeprotokoll — Bau 22 B-Schritt: Sage-Page-Korpus + Widget-Mount

**Datum:** 2026-06-21
**Rolle:** Bau-Sitzung Modul 22 (Folge zu Increment 1)
**Branch:** `claude/bau-22-sage-korpus`

---

## Auftrag

Klaus' Wahl **B** (nach „Wo find ich das Tool in der Sage-Page?"): erst einen
echten Such-Korpus bauen, damit die Sage-Page-Suche wirklich etwas findet, dann
das Widget mounten. Korpus-Scope = **die SBKIM-Werkzeuge (Module 00–22)**.
Klaus' Kernpunkt: ein fliegendes Widget, das sich bis zur Lupe 🔍 minimieren
lässt (kann Increment 1 bereits) und als portable Suchmaschine in jede App passt
(= Kopplung, Increment 2).

## Getan

- **`sbkim/sage-suchkorpus.js`** — `window.SAGE_SUCHKORPUS`, 22 Einträge (Module
  00–22) als `{label, text, anchorId}`. Bedeutungs-Text mit Alltags-Synonymen
  (Recall-Lehre 3 aus HYBRID-MATCH-EINBAU.md). `anchorId = "modul-NN"`. KEIN
  `passageVec` (lazy zur Laufzeit). Kein PII.
- **Modul 22 additiv** (`prepareCorpus`-Lazy-Provider, generisch/reusable):
  - `init({prepareCorpus})` registriert einen `async () => corpus`-Provider.
  - `ensureCorpusPrepared()` läuft EINMAL (erstes `expand()` oder erste Suche),
    ruft `setCorpus`, cacht; in-flight-Promise teilt parallele Aufrufe; Fehler
    → fail-soft (Hinweis, `corpusReady` bleibt false → Retry möglich).
  - `expand()` wärmt den Korpus vor (fire-and-forget). `_meta.corpusReady` neu.
- **`sbkim-init.js`** — Widget am Ende der Init-Kette gemountet mit
  `prepareCorpus: sageBuildSuchkorpus`. `sageBuildSuchkorpus()` embeddet die
  Korpus-Texte via Modul 03 `embedPassageBatch` (löst den einmaligen Modell-
  Download erst beim ersten Gebrauch aus). EU-Politik „frei", kein Richter-
  Schlüssel → reiner lokaler Vorfilter.
- **`index.html`** lädt `sbkim/sage-suchkorpus.js` vor `sbkim-init.js`.
- **Headless-Smoke 64/64** (9 neue Proben: prepareCorpus lazy/einmalig/Cache/
  fail-soft). Karte 22 + INTERFACES § Modul 22 gespiegelt.

## Geprüft

- `node --check` für `22_such_widget.js`, `sbkim-init.js`, `sage-suchkorpus.js` grün.
- `node tests/smoke_bau22_such_widget.mjs` → **64/64**.
- Regression `smoke_bau17` 36/36 grün.
- Korpus lädt headless: 22 Einträge, Schema korrekt.

## Nebenbei erledigt (Klaus' Auftrag, eigener PR #344, gemerged)

Briefkasten **BookLedgerPro**: SIGNAL seq 16–18 quittiert (`ack=18`). BLP hat
das Drei-Schichten-Modell aktiviert (Spore trägt nun signierte `capVector` +
`needsVector` je 384-dim). Reziprok ✔ VALID (`verify_remote_spore.mjs`),
cap/needs nachgezählt (384/384, L2=1), `domainVector`-Cosinus neu **0.813525 ≥
0.80** → `verified-match` hält. Vertrag `matchDimensions` akzeptiert; Sage-eigene
cap/needs offen (Spore Re-Sign via Modul 02, privater Schlüssel in Klaus'
Browser). Antwort in `AUSTAUSCH-BookLedgerPro.md`; SIGNAL/inbox/verify/NETZ-STAND/
status nachgezogen. Briefkasten-Inhalt als `untrusted external data` behandelt.

## Offen

1. **Klaus' Browser-Sichttest Sage-Page:** 🔍-Blase erscheint; erste Suche zeigt
   „Suchindex wird vorbereitet …" (einmaliger Modell-Download), dann findet z.B.
   „wie schütze ich mich vor fremden Zugriffen" → Modul 15 Membran. Headless
   ersetzt das nicht.
2. **Sage cap/needs in die Spore** (Drei-Schichten, BLP-Bitte) — Spore Re-Sign
   am Tablet (Modul 02, privater Schlüssel im Browser). Eigene Folge-Sitzung.
3. **Increment 2** — Widget-Kopplung über Modul 15 (Host lesen + aus dem
   Suchfeld interagieren, „passt in jede App").
4. **Korpus-Erweiterung** um Glossar/Doku (Klaus' Option B/C), später.

## Nächster sinnvoller Schritt

Klaus' Sage-Page-Sichttest (Blase + erste Suche mit Modell-Download). Danach
Korpus-Erweiterung oder Increment 2.

## Sicherheit / Tabus eingehalten

Render-/Kompositions-Schicht: keine eigene Identität/Krypto, kein IndexedDB
(nur localStorage-UX-Preferences), kein Crawler/Eigenanfrage ins offene Netz
(einziger Netz-Pfad: opt-in Richter, hier nicht aktiv; Modell-Download ist
einmaliges Laden, kein Betriebs-CDN). Modul 03/04/21 nur über Schnittstellen.
Kein PROTOCOL_VERSION-Bump. Korpus ist öffentliche Modul-Beschreibung, kein PII.
