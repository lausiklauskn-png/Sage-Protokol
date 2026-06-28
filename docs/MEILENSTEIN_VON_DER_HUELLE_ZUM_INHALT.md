# ⭐ Meilenstein — Von der Hülle zum Inhalt (2026-06-28)

> Der `domainVector` eines Knotens — der Vektor, der den 0.80-Handschlag-Match
> steuert — beschreibt jetzt den **echten Inhalt** des Knotens, nicht mehr nur
> seine **Selbstbeschreibung**. „Beschreibe dich selbst" wird durch den Vektor
> ersetzt.

<!-- BILD-PLATZHALTER (2026-06-28): Klaus liefert das Meilenstein-Bild
     („Von der Hülle zum Inhalt" — z.B. drei gleich beschriftete Bücher, deren
     INHALT sie trennt). Bis dahin steht hier dieser klar markierte Platzhalter.
     Dateiziel-Vorschlag: assets/meilenstein-huelle-zum-inhalt.png -->
>
> 🖼️ _Bild folgt von Klaus — Platzhalter._

---

## Worum es geht

Bis zum 2026-06-28 entstand der `domainVector` aus der **Hülle**: der
`domainDescription` + den `domainKeywords`, die ein Knoten über sich selbst
schreibt. Klaus' Bild dazu: drei „Rezeptbücher" — eines voller Kuchen, eines
voller Sushi, eines voller Getränke — sind völlig verschieden, aber ihre
Beschreibung sagt nur „Rezepte". Im Bedeutungs-Raum lagen sie damit fast
aufeinander. **Der Inhalt muss entscheiden, nicht die Hülle.**

Bislang entschied der Inhalt nur in der **Suche** (Modul 04 `queryLocal`) —
nicht im **Match-Riegel** (dem 0.80-Handschlag der Anastomose). Dieser
Meilenstein schließt die Lücke an der Wurzel: die Visitenkarte (Spore) selbst
trägt jetzt einen inhalts-treuen Vektor.

## Was gebaut wurde

- **Modul 03 — `embedContentVector(samples, opts?)`.** Baut EINEN
  repräsentativen, L2-normalisierten Vektor aus bis zu 32 echten Inhalts-
  Schnipseln (jeden einbetten, Schwerpunkt bilden, normalisieren). Das ist
  der „beschreibe den Knoten durch seinen Inhalt"-Schritt. Es ist **keine**
  Match-Rechnung (die bleibt Modul 04) — nur ein einzelner Bedeutungs-Punkt.

- **Modul 02 — `regenerateOwnSpore(updates, key?)`.** Erzeugt die Spore mit
  der **bestehenden Identität** (gleiche `nodeId`) neu. Nicht genannte Felder
  bleiben erhalten. Damit kann ein Knoten seinen Vektor neu rechnen, wenn der
  Inhalt wächst (**Re-Embedding**), ohne ein neuer Knoten zu werden.

- **Zwei additive Spore-Felder** (signaturpflichtig, `PROTOCOL_VERSION` bleibt
  `"0.1"`):
  - `embeddingSource`: `"content"` oder `"description"` — woher der Vektor kommt.
  - `embeddingVersion`: Re-Embedding-Zähler / Drift-Marker.

- **Bundle `createIdentity`** nimmt einen optionalen `sampleContent()`-Callback:
  liefert die App echte lokale Inhalts-Schnipsel, entsteht der Vektor
  inhalts-treu; sonst fail-soft Fallback auf die Beschreibung.

## Was bewiesen ist — und was nicht

**Bewiesen (headless):** `tests/smoke_inhaltstreuer_domainvektor.mjs` 25/25
grün. Kern-Demonstration mit einem deterministischen Fake-Modell: zwei Knoten
mit **identischer Beschreibung** („Ein Rezeptbuch.", Beschreibungs-Cosinus =
1.0), aber verschiedenem Inhalt (Kuchen vs. Sushi) bekommen **klar
unterschiedliche** Inhalts-Vektoren (Cosinus 0.03). Die Spore wird nach dem
Re-Sign korrekt verifiziert, die `nodeId` bleibt stabil, Felder bleiben erhalten.

**Ehrlich offen:**
- Der **echte Live-Match** mit dem echten `Xenova/multilingual-e5-small`-Modell
  (~30 MB, nur im Browser) wartet auf **Klaus' Browser-Lauf**. Das Fake-Modell
  beweist die Mathematik + Verdrahtung, nicht die echten Vektor-Lagen.
- Die **0.80-Schwelle** ist nach der netzweiten Umstellung **bewusst neu zu
  kalibrieren** (zentrierter Cosinus — siehe
  `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`). Eigene Folge-Sitzung mit echten
  Vorher/Nachher-Browser-Messwerten.
- **Netzweiter Rollout** (jeder Knoten reicht seinen `sampleContent()` durch +
  re-signt im Browser) läuft schrittweise, wie bei Modul 23.

## Datenschutz

Nur **unkritische, nicht-personenbezogene** Inhalts-Schnipsel werden gesampelt
(Labels/Titel/Kategorien). Niemals Klartext-Beträge, Belege oder Geheim-Fach-
Inhalt. Der private Schlüssel bleibt lokal; nur die öffentliche Spore erscheint
im Netz.

**Sensible Apps — differenzierter Folge-Entscheid (2026-06-28, festgelegt):**
Die frühere Pauschal-Regel „sensible Apps sampeln nur Fach-Namen" war zu grob.
Präzisierung (Tafel-Evolutions-Klausel, ausdrücklich):

- **Mein-Rezeptbuch / Mein-Mixarium** (unkritische Domäne) — Inhalts-Vektor aus
  Rezept-/Drink-Namen + Kategorien. Ausgerollt (Mixarium PR #80, Rezeptbuch
  PR #269).
- **BookLedgerPro** — Inhalts-Vektor **nur** aus den **Konto-/Kategorie-Labels**
  des Standard-Kontenrahmens (non-PII). **Niemals** Beträge, Belege,
  Buchungstexte, Geschäftspartner-Namen.
- **Mein-Tresor / Jasons-Tresor** — **kein** Fach-Inhalt-Sampling. Ein
  verschlüsselter Tresor hat bewusst **keine öffentliche Domäne**, und frei vom
  Nutzer vergebene Fach-Namen (z.B. „Steuer 2025") könnten verraten. Die Tresore
  behalten den **Beschreibungs-Vektor** (`embeddingSource:"description"`), bis
  Klaus ausdrücklich eine **unkritische, fest vorgegebene Kategorie-Taxonomie**
  (keine freien Nutzer-Namen) freigibt.

Begründung: die öffentliche Spore wird ins Netz committet (server-los, von jedem
lesbar) — was hineinfließt, ist dauerhaft öffentlich. Für einen Tresor ist das
Gegenteil der Zweck.

## Querverweise

- Modul 02 Karte: [`docs/components/02_spore.md`](components/02_spore.md)
  § „Inhalts-treuer domainVector + Provenienz (2026-06-28)"
- Modul 03 Karte: [`docs/components/03_embedding.md`](components/03_embedding.md)
  § `embedContentVector`
- Modul 18 Sub (f)+(g): [`docs/components/18_tool_pwa.md`](components/18_tool_pwa.md)
- Kalibrierung: [`docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`](LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md)
- Smoke: `tests/smoke_inhaltstreuer_domainvektor.mjs`
