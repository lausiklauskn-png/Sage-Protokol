# BRIEF — A2: „Frage → Antwort über das Netz" LIVE beweisen (Sage ↔ Endknoten)

**Thema:** Plan-Punkt **A2** (`docs/PLAN_SEMANTIK_KRYPTO.md`). Freibrief gilt (siehe CLAUDE.md § Freibrief). Datum: 2026-07-10.

## Stand (Ehrlichkeit zuerst)
**A1 ist headless FERTIG.** Der Frage→Antwort-Netz-Pfad lebt in **Modul 23** (`enableAnswering`/`askNode`, Tag `sbkim-qry`), NICHT in Modul 15 `op:"query"` (das ist der Same-Browser-Zwilling). Kern = Bau 23.B (2026-07-06); die **Korpus-leer-Falle** wurde am 2026-07-10 abgesichert (PR #571, gemergt): `enableAnswering()` koppelt den lokalen Korpus jetzt **aktiv** an Modul 04 (`prepareCorpus` → `setLocalCorpus`) — echte Treffer auch OHNE vorherige Widget-Suche. Smokes grün: `smoke_bau23b_korpus.mjs` 24/24, `smoke_bau23b_query.mjs` 23/23, Regression 55/55 + 32/32 + Drift-Guard 21/21.

**Was A2 ist:** der **Live-Cross-Knoten-Lauf** über das echte Relay — der einzige noch fehlende Beweis. Nur Klaus' Browser kann das (Relay in der Sandbox unerreichbar).

## Schritt (= A2, Live, zwingend Klaus)
Zwei Apps, beide fahren Modul 23 live, über `wss://relay.family-projekt.de`:
1. **Beide Apps** auf `main` (GitHub Pages deployt von `main` — PR #571 ist gemergt, also ist die Härtung live). **Hard-Reload (Strg+Shift+R)** in beiden Tabs/Geräten.
2. **Knoten B (Antworter):** „🌐 Mit dem Netz verbinden" → anmelden, dann **„💬 Antworten: an"**. Dadurch wird der lokale Such-Korpus jetzt aktiv gekoppelt (die Härtung) — die erste Frage greift nicht mehr ins Leere.
3. **Knoten A (Frager):** „👥 Wer ist im Raum?" → Karte von B → Frage stellen (z.B. „kuchen" an ein Rezept-/Getränke-Endknoten).
4. **Erwartung:** A bekommt **bedeutungs-sortierte Treffer aus Bs Inhalt** zurück (Score↓, 0.80-Boden im Vorfilter, Fremdes raus).

**Vorschlag Paarung:** **Sage ↔ Mein-Mixarium** (beide fahren Modul 23 live; Sage matcht Mixarium 0.806 ≥ 0.80). Alternativ Sage ↔ Kim-Bell. Um **Quittung** nach dem Lauf bitten (grün/rot + was auf dem Schirm stand).

## Datenverträge (nicht brechen)
- Frage (Tag `sbkim-qry`, kind 1): `{kind:"sbkim-query", qid, toNodeId, fromNodeId, fromName, text≤300, k≤5, ts}`
- Antwort (`sbkim-query-res`): `{kind:"sbkim-query-res", qid, toNodeId(=Frager), fromNodeId, fromName, results:[{label,score,anchorId?}], ts}` — nur label/score/anchorId, kein PII.
- PROTOCOL_VERSION bleibt "0.1". 0.80-Andock-Riegel + Kern-Module 02/05/05b unberührt.

## Akzeptanzkriterien
- [ ] Live: A fragt, B (Antworten AN) liefert bedeutungs-sortierte Treffer aus fremdem Inhalt — Klaus' Browser-Lauf grün.
- [ ] Korpus-Falle bestätigt geheilt: Treffer kommen AUCH ohne vorherige Widget-Suche auf B.
- [ ] Fragen nutzer-ausgelöst, Antworten Default-AUS, nicht persistiert; Dedupe/Rate-Limit(6/min)/k-Cap/Text-Cap/PII-frei erhalten.
- [ ] A1 + A2 im Plan abgehakt; PULS nachgezogen.

## Falls A2 grün → Folge (Rollout der Härtung)
Die Korpus-Kopplung (`prepareCorpus` im Rendezvous-Init) byte-gleich in die anderen Modul-23-Apps ziehen: **Mein-Mixarium, Mein-Rezeptbuch, family-project** (+ deren `sbkim-init`/UI-Verdrahtung). Diese Sitzung hat nur **Sage + sbkim-bundle** gemacht. Je Repo: Modul 23 + UI byte-1:1 aktualisieren, `prepareCorpus` beim Rendezvous-Init verdrahten, Drift-Guard grün, eigener PR.

## Leitplanken
Empfangsmodus (kein Crawler/Pulsation, nutzer-ausgelöst; Antwortrecht Default-AUS). Kein PII, echte Verträge nicht abwandeln, 0.80-Riegel/PROTOCOL_VERSION nicht antasten. ⚠️ Sage hat KEINE package.json → kein `npm test`; stattdessen `node tests/smoke_<name>.mjs` einzeln. `smoke_query_ueber_relais.mjs` braucht `fake-indexeddb` (in mancher Sandbox nicht installiert). Klaus' Browser-Sichttest ist nicht ersetzbar.

## Pflichtlektüre
1. `CLAUDE.md` (inkl. § Aktuelle Arbeitsliste) → 2. `docs/PULS.md` (Kopf + Eintrag 2026-07-10 A1-Härtung) → 3. dieser Brief → 4. `status.json` → 5. Code: `src/modules/23_rendezvous.js` (`enableAnswering`/`ensureAnswerCorpus`/`askNode`), `src/modules/23_rendezvous_ui.js`, `sbkim-init.js` (`sageEnsureSuchkorpus`), `INTERFACES.md` §1 Modul 23.

## Abschluss-Befehl
Nach dem Live-Lauf: A1+A2 im Plan abhaken (Datum); PULS fortschreiben (Live-Ergebnis ehrlich); bei grün den Härtungs-Rollout (MM/MR/family) als Folge-Brief anlegen; „Nächste Schritte"-Block in die Chat-Antwort; neuen Brief als Codeblock im Chat. Freibrief-Merge erlaubt (headless/Doku grün; Live-Befund = Folge-Fix). Freibrief gilt, siehe CLAUDE.md § Freibrief.
