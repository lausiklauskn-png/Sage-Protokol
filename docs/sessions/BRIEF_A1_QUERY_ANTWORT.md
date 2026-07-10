# BRIEF — A1: „Frage → Antwort über das Netz" absichern & live beweisen

**Thema:** Plan-Punkt **A1** (`docs/PLAN_SEMANTIK_KRYPTO.md`). Freibrief gilt (siehe
`CLAUDE.md` § Freibrief). Datum des Briefs: 2026-07-10.

---

## Stand (Ehrlichkeit zuerst)

**A1 ist headless bereits zu ~90 % gebaut** — der Kern wurde am 2026-07-06 als
**Bau 23.B** gemacht, nur über einen anderen (besseren) Weg als der Plan-Text sagt:

- Der Plan sagt „Modul 15 `op:"query"` über das Nostr-Medium". Das ist ein
  **Kategorienfehler**: Modul 15 `op:"query"` ist der **Same-Browser**-postMessage-Zwilling
  (App-zu-App im selben Browser), **kein Netz-Pfad**. Der echte Netz-Transport lebt in
  **Modul 23** (`askNode`/`enableAnswering`) — verfassungstreu, UI-getragen, byte-in-die-Apps kopiert.
- Real vorhanden: `SbkimMatch.queryLocal` (Modul 04, `src/modules/04_match.js:901`, Schwelle
  0.80), `SbkimRendezvous.askNode` (`src/modules/23_rendezvous.js:630`) + `enableAnswering`
  (`:559`, Antwortrecht **Default AUS**), UI in `23_rendezvous_ui.js` („❓ Fragen" / „💬 Antworten an/aus").
- Smokes grün: `tests/smoke_bau23b_query.mjs` (23/23), `tests/smoke_query_ueber_relais.mjs`.
  Belege: `docs/PULS.md:267-280` (Bau 23.B), `docs/INTERFACES.md:4710-4763` (Datenvertrag steht).

**Daraus folgt:** A1 muss nicht neu gebaut, sondern **abgesichert (headless)** und **live
bewiesen (Klaus)** werden. Der Live-Beweis ist ohnehin schon Plan-Punkt **A2**.

### Der eine echte Riss — die „Korpus-leer-Falle"

`enableAnswering` ruft `global.SbkimMatch.queryLocal` — das liefert nur echte Treffer, **wenn
vorher `setLocalCorpus(...)` mit dem realen Knoten-Inhalt lief**. Heute registriert nur
**Modul 22** den Korpus, und zwar **lazy erst bei der ersten Widget-Suche**
(`sbkim-init.js:355-360` `prepareCorpus: sageBuildSuchkorpus`). Antwort-Pfad (23) und
Korpus-Aufbau (22) sind **nicht fest gekoppelt** → genau der Bug, der schon einmal live
zuschlug: „Cross-Knoten-Korpus lief **live leer** … antwortete mit leerer Liste"
(`docs/PULS.md:404-407`). **Das abzusichern ist der Kern dieser Sitzung.**

---

## Was diese (erste) Sitzung tun soll — Schritt 1 (headless)

1. **Korpus-Kopplung härten.** Sicherstellen, dass bei `enableAnswering(...)` (Antwortrecht AN)
   ein **registrierter Korpus vorliegt** — explizit `prepareCorpus`/`setLocalCorpus` vor bzw. beim
   Einschalten des Antwortrechts aufrufen, statt sich auf die Lazy-Kopplung an die erste
   Widget-Suche zu verlassen. Fail-soft: kein Korpus → ehrliche leere Antwort, kein Absturz.
   (Kern-Module 02/05/05b **nicht** anfassen; nur die öffentliche `queryLocal`/`setLocalCorpus`-Fläche.)
2. **Regressions-Smoke** neu: „Antwortrecht AN → `askNode` liefert echte
   `SAGE_SUCHKORPUS`-Treffer" (Muster aus `smoke_bau23b_query.mjs` + realer Korpus aus
   `sbkim/sage-suchkorpus.js`). Bestehende Smokes grün halten
   (`smoke_bau23b_query.mjs`, `smoke_query_ueber_relais.mjs`).
3. **Optional (Knopf-Sichttest vorbereiten):** Panel 23 „❓ Fragen / 💬 Antworten" in
   `tests/manual_check.html` ergänzen (Muster: vorhandene Membran-`op:"query"`-Knöpfe
   `manual_check.html:4633,4893-4907`) — für Klaus' späteren Sichttest.
4. **Doku-Nachzug (Pflicht):**
   - `docs/PLAN_SEMANTIK_KRYPTO.md` A1-Text korrigieren: „Modul 15 `op:query` über Relay"
     → „Modul 23 Bau 23.B (`askNode`/`enableAnswering`)"; A1 als **headless-fertig** markieren,
     der verbleibende Live-Beweis ist **A2**.
   - `docs/PULS.md` fortschreiben (getan / offen / nächster Schritt = Klaus-Live).
   - **Kein** `INTERFACES.md`-Nachzug nötig — die Verträge (Modul 23 §1, Modul 15, Modul 05) stehen bereits.

## Was die Folge-Sitzung / Klaus tut — Schritt 2 (= A2, Live, zwingend Klaus)

Live-Cross-Knoten-Lauf über `wss://relay.family-projekt.de`: zwei Apps (Sage ↔ Mixarium
oder Kim-Bell), beide fahren Modul 23. Eine fragt (z. B. „kuchen"), die andere hat
**Antworten AN** → **bedeutungs-sortierte Treffer aus dem fremden Inhalt** kommen zurück.
Das Relay ist aus der Sandbox nicht erreichbar (`smoke_query_ueber_relais.mjs:12-15`),
darum **headless nicht beweisbar** — braucht Klaus' Browser-Lauf.

---

## Datenverträge (nicht brechen)

- **Frage** (Tag `sbkim-qry`, Nostr kind 1):
  `{kind:"sbkim-query", qid, toNodeId, fromNodeId, fromName, text≤300, k≤5, ts}`
- **Antwort** (Tag `sbkim-query-res`):
  `{kind:"sbkim-query-res", qid, toNodeId(=Frager), fromNodeId(=Antworter), fromName,
  results:[{label, score, anchorId?}], ts}` — **nur `label/score/anchorId`, keine Inhalte, kein PII**
  (`INTERFACES.md:4746-4763`).
- `PROTOCOL_VERSION` bleibt **"0.1"** (kein Bump). **0.80-Andock-Riegel** (Modul 05) unberührt.

## Akzeptanzkriterien

- [ ] `askNode(card, text)` liefert **bedeutungs-sortierte** Treffer (Score↓, Schwelle 0.80,
      Fremdes fällt raus) aus dem **aktuellen Korpus des Zielknotens** — auch wenn vor der
      Frage **keine** Widget-Suche lief (Korpus-leer-Falle abgesichert).
- [ ] Fragen **nutzer-ausgelöst**, Antworten **Default-AUS** (Empfangsmodus gewahrt), nicht persistiert.
- [ ] Dedupe (qid, Cap 200), Rate-Limit (6/min), `k`-Cap, Text-Cap, PII-frei — alle erhalten.
- [ ] Kein Protokoll-Bump, 0.80-Riegel + Kern-Module 02/05/05b unberührt.
- [ ] Neuer + bestehende Smokes **grün** (`node tests/smoke_bau23b_query.mjs`,
      `node tests/smoke_query_ueber_relais.mjs`, neuer Korpus-Smoke).
- [ ] Plan + PULS nachgezogen.
- [ ] (Schritt 2 / A2) Live Sage ↔ Endknoten grün — **Klaus' Browser-Lauf**.

## Reihenfolge

1. Korpus-Kopplung härten → 2. Regressions-Smoke → 3. (optional) Panel 23 → 4. Doku-Nachzug.
   **Danach** an Klaus für den Live-Lauf (A2).

---

## Leitplanken (immer)

- **Empfangsmodus:** kein Crawler, keine Pulsation, keine Eigenanfragen ins Netz — Suche/Antwort
  nutzer-ausgelöst. Antwortrecht bleibt Default-AUS.
- **Kein PII**, **echte Krypto/Verträge nicht abwandeln**, **0.80-Riegel/`PROTOCOL_VERSION` nicht antasten**.
- **Beweis = einzelne Smokes.** ⚠️ **Sage hat KEINE `package.json`** → **kein** `npm test`;
  stattdessen `node tests/smoke_<name>.mjs` einzeln laufen lassen.
- **Klaus' Browser-Sichttest ist nicht ersetzbar** — headless bestätigt die Logik, den
  Cross-Knoten-Live-Lauf sieht nur Klaus.

## Offene Fragen an Klaus

- Für den Live-Lauf (A2): welche zwei Apps? (Vorschlag: **Sage ↔ Mein-Mixarium**, beide fahren
  Modul 23 bereits live.) Bitte um Rückmeldung/Quittung nach dem Lauf.

---

## Pflichtlektüre vor der Arbeit (Kette reißt nie ab)

1. `CLAUDE.md` (inkl. § „▶ Aktuelle Arbeitsliste") → 2. `docs/PULS.md` (Kopf + Bau 23.B
   `:267-280` + Korpus-Falle `:404-407`) → 3. **dieser Brief** → 4. `status.json` →
   5. Code der Scheibe: `src/modules/23_rendezvous.js` (`askNode`/`enableAnswering`),
   `src/modules/04_match.js` (`queryLocal`/`setLocalCorpus`), `sbkim/sage-suchkorpus.js`,
   `sbkim-init.js` (`prepareCorpus`), `docs/INTERFACES.md` §1 Modul 23 (`:4710-4763`).

## Abschluss-Befehl (Pflicht am Sitzungsende)

`docs/PULS.md` fortschreiben; A1 im Plan abhaken/aktualisieren; einzelne Smokes grün melden
(ehrlich, auch Fehlschläge); Commit + Push auf `claude/remove-isd-references-awst06`;
**neuen Brief** für die Live-/A2-Sitzung schreiben und als Codeblock im Chat ausgeben;
„Nächste Schritte"-Block in die Chat-Antwort. Freibrief-Merge erlaubt (headless/Doku grün,
abgegrenzt, nicht zweifelhaft).
