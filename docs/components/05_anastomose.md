# Modul 05 — Anastomose (Handshake zwischen Knoten)

**Status:** Schablone (Spec ausstehend)
**Datei (Code):** `src/modules/05_anastomose.js`
**Abhängigkeiten:** Modul 02 (Spore), Modul 04 (Match), Modul 01 (Storage)

---

## Zweck

Realisiert den eigentlichen Knoten-zu-Knoten-Kontakt:

- **Anfrage senden** an einen anderen Knoten (Suchender / Hybrid)
- **Anfragen empfangen** und beantworten (Anbieter / Hybrid)
- **Handshake** durchführen, sobald ein Match festgestellt wurde
- **Geschwister-Liste** pflegen

Dies ist das Modul, in dem die "Bedeutungs-statt-Adress"-Routinglogik
sichtbar wird: ein Knoten antwortet **nur**, wenn die Anfrage zu seiner
Domäne passt — sonst Schweigen.

---

## Verantwortung

**Macht:**
- HTTP-POST an `/sbkim/query` eines Zielknotens
- HTTP-POST an `/sbkim/anastomosis` für den Handshake
- Eingehende Anfragen empfangen (über Service-Worker bei statischem Hosting)
- Match-Schwelle prüfen, Antwort formulieren oder schweigen
- Geschwister in `sbkim_siblings` aufnehmen
- Handshake-Historie in `sbkim_anastomosis_log` mitschreiben (anonymisiert)

**Macht nicht:**
- Kein Crawler. Kein Discovery. Anfragen gehen nur an Adressen, die der
  Betreiber oder ein anderer verbundener Knoten **explizit** geliefert hat.
- Keine Pulsation, keine periodischen Eigenanfragen.
- Keine Datenkörper außer dem, was Modul 06 (Heterokaryose) explizit
  freigibt.

---

## Schnittstelle

*(noch zu spezifizieren)*

Skizze:

```
init({ ownSpore: SporeJson }) → Promise<void>

query(targetSporeUrl: string, queryText: string, options?: {
  timeout?: number,        // default QUERY_TIMEOUT_MS
  minMatchScore?: number,  // default PROVIDER_MIN_MATCH
}) → Promise<{
  match: boolean,
  score?: number,
  responsePointers?: Array<{ url, summary?: string }>,
  responder?: { nodeId, domain }
}>

onIncomingQuery(handler: async (q: IncomingQuery) => Response | null)
  // null = schweigen

formatResponse(candidates: any[], score: number) → ResponsePayload

initiateAnastomosis(siblingSpore: SporeJson) → Promise<HandshakeResult>
listSiblings() → Promise<Array<{nodeId, domain, since}>>
```

---

## Datenformate (in INTERFACES.md spiegeln, sobald spezifiziert)

- IncomingQuery: { embedding, queryText?, fromNodeId, fromSpore? ... }
- ResponsePayload: { score, pointers, responderNodeId, signature }
- HandshakeResult: { peerNodeId, peerDomain, established: bool }

---

## Manueller Test

1. Zwei Browser-Tabs, beide mit eingebautem SBKIM (zwei Knoten
   "Rezeptbuch-Test" und "Mixarium-Test"), beide auf `localhost`
   verschiedener Ports.
2. Tab A: `Sbkim.query("http://localhost:8081/.well-known/sbkim/spore.json",
   "Cocktail mit Tequila")`. Erwartung: match=true, score>0.55.
3. Tab A: dieselbe Anfrage an Tab B (Rezeptbuch). Erwartung: match=false
   (Domäne passt nicht).
4. Anastomose-Knopf: nach erfolgreichem Match Handshake auslösen.
   Beide Tabs zeigen einander in `listSiblings()`.

---

## Risiken / Edge Cases

- CORS: Browser-zu-Browser-POST geht nur, wenn der Zielserver CORS-
  Header setzt oder ein Service-Worker dazwischen liegt. → Spec klärt
  Strategie für GitHub Pages.
- Wiederholungen: ein Knoten darf eine Anfrage nicht zweimal beantworten
  (Replay-Schutz via Nonce + Signatur).
- Timeouts: Antwort > QUERY_TIMEOUT_MS → als "kein Match" werten.
- Spam: ein Knoten, der zu viele unsinnige Anfragen sendet, sollte vom
  Empfänger temporär ignoriert werden (Reputation, später).

---

## Querverweise

- `sbkim_integration.md` §6 (eingehende Anfragen)
- `sbkim_paper.pdf` Kapitel 14 (Handshake)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
