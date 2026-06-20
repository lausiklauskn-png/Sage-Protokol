# Konzept — Hybrid-Match (Bau-Zeit-KI-Authoring + geteiltes Embedding + EU-LLM-Richter)

> **Status:** Konzept-Spec 2026-06-20 (Brainstorming Klaus + Sage).
> **Match-Zeit-Richter gebaut 2026-06-20 (Bau 04.D, `SbkimMatch.hybridMatch`)** —
> additiv, fail-soft, opt-in; siehe `src/modules/04_match.js` +
> `docs/components/04_match.md` § Hybrid-Match-Schicht + INTERFACES.md § 7.1.
> Headless-Smoke 62/62 grün, Browser-Sichttest ausstehend.
> Baut auf dem Anisotropie-Befund auf
> ([`LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`](LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md)).
> Umsetzung: eigene Bau-Sitzung, Brief `docs/sessions/BRIEF_BAU_HYBRID_MATCH.md`.
> Netzweite Änderung → erst Spec, dann koordinierter Bau, nichts stillschweigend.
> **Noch offen (separater Anisotropie-Hebel, NICHT in Bau 04.D):** der
> Whitening-Flip + die netzweite Schwellen-Neusetzung von
> `matchDimensions`/`queryLocal` (koordinierte Klaus-Entscheidung). Bau 04.D
> baut den Richter NEBEN den bestehenden Vorfilter-Pfaden, ändert deren
> Default nicht.

## Warum

Der rohe e5-small-Cosinus misst überwiegend **Oberfläche/Sprache**, nicht **Bedeutung**
(hoher anisotroper Boden ~0.82). Ein *kleines* Embedding-Modell unterscheidet „Buchhaltung
vs. Rezepte vs. Mycel-Bibliothek" kaum. Eine **LLM** erkennt echten Sinn — sogar aus
unsauberem Text. SBKIM hieß ursprünglich *KI-Matching*: die KI sollte entscheiden. Genau
dorthin kehren wir zurück — aber **server-los-fähig**, nicht als Zwang.

## Die Entscheidung: Hybrid (Option C)

Match in zwei Stufen, getrennt nach **Zeitpunkt** und **Rolle**:

### Drei Rollen (verbindliche Trennung — Tafel)

1. **Bau-Zeit-Authoring (einmalig, Entwickler, beste KI):**
   Der Entwickler formuliert mit seiner **bevorzugten/besten** KI (Klaus → Claude;
   BLP → EU-Anbieter) die sinn-dichteste `domainDescription` / `domainKeywords` /
   (optional) `needs` + `capabilities`. **DSGVO-unkritisch** — eigener Domänen-Text des
   Entwicklers, keine Endnutzer-Daten.
2. **Geteilte Vergleichs-Koordinate (netzweit EIN Modell):**
   Den vergleichbaren `domainVector` erzeugt **immer dasselbe netzweite Embedding-Modell**
   (heute lokal e5-small). Die KI verbessert die **Eingabe**, das geteilte Modell liefert die
   **Koordinate**. → Vektoren bleiben über alle Knoten vergleichbar. **Eine KI darf NICHT den
   gespeicherten Vektor direkt liefern** (kein gemeinsamer Raum sonst).
3. **Match-Zeit-Richter (opt-in, Laufzeit, Knoten-eigener EU-Anbieter):**
   Für die Finalisten des Vorfilters fällt eine **LLM** das echte Urteil (passt / passt nicht
   + Begründung). Braucht **keinen** geteilten Vektor → jeder Knoten nutzt seinen **eigenen**
   Anbieter (BYOK, EU-konform, z.B. Mistral). Das ist der Punkt, an dem der Anisotropie-Boden
   endgültig irrelevant wird.

### Ablauf eines Matches

```
1. VORFILTER (lokal, server-los, immer):
   geteiltes Embedding → (gewhiteter) Cosinus → grobe Kandidaten-Liste
2. RICHTER (opt-in, LLM, fail-soft):
   wenn KI verfügbar + Knoten opt-in → LLM urteilt über Kandidaten (echter Sinn)
   wenn KI NICHT erreichbar / kein opt-in → Vorfilter-Ergebnis gilt (lokal entscheidet)
3. BEZEUGEN:
   LLM-Urteil + Begründung signiert in der Inbox ablegen (bezeugte Match-Tat)
```

## Die zwei Eigenschaften, die das tragen

- **DSGVO-elegant durch Zeit-Trennung:** lokales e5 **sendet nichts** (Browser-only) → der
  Grund-Layer ist der datenschutz-sicherste überhaupt. Teure KI nur (a) zur Bau-Zeit
  (Entwickler-Akt) oder (b) zur Match-Zeit über den **eigenen** EU-Anbieter des Knotens.
- **Fail-soft / Resilienz (Klaus' Anker):** fällt die KI aus oder ist nicht erreichbar,
  **übernimmt das lokale Sprachmodell** die Einordnung weiter. Kein Stillstand, kein harter
  Fehler — exakt das `fail-soft`-Prinzip, das Modul 04 Sub-B schon hat.

## Bidirektional (zurück zu Station 2)

Beim LLM-Richter urteilt **jede Seite mit ihrer eigenen KI** (BLP mit Mistral, Sage mit
Claude). „Beide Seiten entscheiden" = echtes *bidirektionales* KI-Matching, nicht einseitig.
Konvention offen: Match gilt, wenn **eine** Seite zustimmt (großzügig) oder **beide**
(streng) — Bau-Entscheidung.

## Der Keim existiert schon

**Modul 04 Sub-B `explainMatchLLM`** (Anthropic-API, fail-soft, BYOK) ist gebaut — liefert
heute nur eine *Erklärung* zum Cosinus. Hybrid-Match = dieses Modul vom **Erklärer** zum
**Richter** hochstufen + EU-Anbieter-Abstraktion + Fallback-Verdrahtung. Wir drehen eine
vorhandene Schraube, erfinden nichts neu.

## Offene Bau-Parameter — Bau-04.D-Entscheidungen (2026-06-20)

1. Richter **Pflicht oder opt-in**? → **opt-in/BYOK** (gebaut). Leerer
   apiKey → fail-soft, Vorfilter gilt; Basis-Mycel bleibt server-los.
2. **Anbieter-Abstraktion:** → **gebaut** (`HYBRID_PROVIDERS`: Claude /
   Mistral / OpenAI / lokal). EU-Default `"mistral"` für DSGVO-Knoten via
   `options.euOnly`.
3. **Bidirektional-Regel:** → **streng „both" als Default** (Klaus
   2026-06-20; `bidirectionalVerdict(passtA, passtB, "one"|"both")`).
4. **Vorfilter:** → **unverändert** in Bau 04.D (Tabu). Roh vs. gewhitened
   bleibt der separate Anisotropie-Hebel (eigene koordinierte Entscheidung).
5. **Bezeugung:** → **gebaut** (`attestation`-Objekt: `kind` + `judgedAt` +
   Anbieter-Marker + `verdicts`; Aufrufer signiert via Modul 02).
6. **Bau-Zeit-Workflow:** → **offen** (Bau-Zeit-Authoring-Helfer/Doku; eigene
   Folge-Sitzung, berührt Bau 04.D nicht).

## Querverweise
- Anisotropie-Befund: [`LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`](LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md)
- Modul 04 (Match) + Sub-B: `docs/components/04_match.md` · `src/modules/04_match.js`
- Vision-Schichten (Agent-Schicht / Layer 2): `CLAUDE.md` § Vier-Schichten-Lesart
- Bau-Brief: `docs/sessions/BRIEF_BAU_HYBRID_MATCH.md`
