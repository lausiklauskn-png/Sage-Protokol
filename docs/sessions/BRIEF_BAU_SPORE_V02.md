# BRIEF — BAU Spore v0.2: `snippetVectors` (A10) + A6-Code-Schließung + Neu-Signier-Welle

**Datum:** 2026-07-14 · **Art:** Bau (Code nach fertiger Spec) · **Freibrief gilt** (Sage
`CLAUDE.md` § Freibrief). **Branch-Vorschlag:** `claude/bau-spore-v02`.

> **Vorgeschichte:** Die **Spec** ist fertig (Spec-Sitzung Spore v0.2, 2026-07-14, PR gemergt →
> `docs/INTERFACES.md` §0/§2/§4 + Modul 02/03 + §10). Dieser Brief ist der **Bau-Teil**
> (Schritte 2–4 des ursprünglichen Briefs `BRIEF_SPORE_V02_A6_A10_RESIGN.md`).

---

## Stand (was schon entschieden + gebaut ist)

- **Protokoll:** `PROTOCOL_VERSION` steht in der Tafel (`INTERFACES.md §0`) auf **`"0.2"`** — im
  **Code (Modul 02/03) noch `"0.1"`**. Der Bau zieht den Code nach.
- **A6 ist im Code faktisch schon erledigt** (kein `_demo`-domainVector-Pfad mehr; jeder Live-Knoten
  trägt echten 384-dim-e5-Vektor, `status.json` = verified-match). A6 = nur noch verbindliche
  Schließung (Code-`PROTOCOL_VERSION`-Bump + Bestätigung, dass kein `_demo`-Pfad zurückkommt).
- **A10 ist das einzig neue Feld:** optionales Spore-Feld **`snippetVectors`** (`{vec:number[384],
  text?}`, bis `SPORE_SNIPPET_MAX`=20, **Satz**-Granularität — `SPORE_SNIPPET_GRANULARITY="sentence"`).
- **Klaus-Entscheide (2026-07-14):** Schnipsel **Satz, max 20** · Übergang **sanft** (0.1 kurz weiter
  tolerieren) · Neu-Signatur **beides** (Knopf pro App + Skript).

## Leitplanken (verbindlich — unverändert)

- **Spec ist die Tafel:** `INTERFACES.md` gilt; Code folgt ihr (nicht umgekehrt).
- **0.80-Andock-Riegel (`PROVIDER_MIN_MATCH`) bleibt unberührt.** `snippetVectors` ist **REINE
  Anzeige/Verwandt-Messung** — gatet nichts, Modul 05 (Handshake) wird nicht angefasst.
- **Kein PII, privater Schlüssel NIE ins Repo.** Neu-Signatur lokal; nur öffentliche `spore.json`
  committen. `snippetVectors.text` sind kuratierte Domänen-Sätze, kein PII.
- **Headless = Beweis** (`node tests/…`); erst mergen, dann Klaus' Browser-Lauf.
- **Sanfter Übergang:** gleiche Hauptversion „0" → 0.1- und 0.2-Sporen bleiben handshake-kompatibel
  (Verify vergleicht nur `majorVersion`). Kein harter 0.2-only-Schnitt.

## Was zu tun ist (Reihenfolge)

1. **Modul 03 `embedSnippets(text|string[], opts?)` bauen** (`src/modules/03_embedding.js`):
   - Satz-Zerlegung (Interpunktion, robust/fail-soft), je Satz `embedPassage` → L2-Vektor.
   - `opts.max` (Default `SPORE_SNIPPET_MAX`=20), Reihenfolge = Satz-Reihenfolge, `text` = gekürzter
     Quell-Satz. Leerer/whitespace-Text → `[]`. Reine Berechnung, KEIN Spore-Schreibvorgang.
   - Vertrag: `INTERFACES.md` § Modul 03 Bietet-Block.
2. **Modul 02 `generateOwnSpore` + Verify auf v0.2** (`src/modules/02_spore.js`):
   - `meta.snippetVectors` additiv aufnehmen (kanonische Signatur; harte Kürzung auf
     `SPORE_SNIPPET_MAX`; `vec`-Länge ≠ 384 → `InvalidSporeMetaError`).
   - `PROTOCOL_VERSION` im Modul auf `"0.2"`. `verifyForeignSpore` bleibt major-tolerant (0.1 ok).
   - Vertrag: `INTERFACES.md` § Modul 02 § Spore-Schema-Erweiterung v0.2 + §2 Feld `snippetVectors`.
3. **A6-Code-Schließung:** bestätigen, dass domainVector immer echt (Modul 03 `embedContentVector`)
   ist — kein `_demo`-Rückfall. (Faktisch schon so; ggf. nur Kommentar/Guard + Test.)
4. **Headless-Smokes:** neuer `tests/smoke_bau03_snippets.mjs` (Satz-Zerlegung, Max-Kürzung, L2,
   fail-soft) + `tests/smoke_bau02_spore_v02.mjs` (snippetVectors signiert+verifiziert, Kürzung,
   Längen-Check, 0.1↔0.2-Kompatibilität). Bestehende Smokes regress-frei halten.
5. **Byte-gleiche App-Kopien** von Modul 02/03 (Drift-Guards) in allen Trägern nachziehen
   (`sbkim-bundle/`, `such-tool/`, `pinnwand/` + Endknoten-Repos, je nach vorhandenem Guard).
6. **Re-Sign-Automatik (beides):**
   - **Knopf pro App** „Spore neu signieren (v0.2)": im Browser jeder App, nutzt die **lebende**
     Identität (ggf. über Modul 20 Safe) → `embedSnippets` + `generateOwnSpore` → Download/Persist
     der neuen `spore.json`. (Pflicht-Pfad — der private Schlüssel lebt pro Origin im Browser.)
   - **Skript** (Termux/Node) für Repos mit Schlüssel im ENV (`SBKIM_NODE_KEY`): headless
     `embedSnippets` + Spore-Assembly + `verify` (✔ VALID) → committet nur die öffentliche
     `spore.json`.
7. **EINE Neu-Signier-Welle:** alle Knoten (Sage + Endknoten + Forker) neu signieren, dann
   `sbkim/NETZ-STAND.md` + `PULS.md` + `PLAN_SEMANTIK_KRYPTO.md` (A6/A10 → `[x]`) nachziehen.

Parallel (schnelle Haken, kein Bau, nur Tablet): **A7 · A8 · A9 · B1** (Sichttests).

## Datenverträge / Dateien

`INTERFACES.md` (bereits v0.2 — nur lesen) · `src/modules/03_embedding.js` (+`embedSnippets`) ·
`src/modules/02_spore.js` (+`snippetVectors`, `PROTOCOL_VERSION` 0.2) · byte-Kopien in den Apps ·
Re-Sign-Knopf (App-UI) + Re-Sign-Skript · `sbkim/NETZ-STAND.md` · `PLAN_SEMANTIK_KRYPTO.md` ·
`docs/checkliste_semantik_krypto.html` · `PULS.md`.

## Akzeptanzkriterien

- [ ] Modul 03 `embedSnippets` gebaut (Satz-granular, max 20, L2, fail-soft) + Smoke grün.
- [ ] Modul 02 `generateOwnSpore` schreibt/verifiziert `snippetVectors`; `PROTOCOL_VERSION`=0.2 im Code;
      0.1↔0.2 wechselseitig verifizierbar (major-tolerant) + Smoke grün.
- [ ] A6 im Code geschlossen (kein `_demo`, domainVector echt) — Treffer = „verified-match".
- [ ] Byte-Kopien/Drift-Guards grün.
- [ ] Re-Sign-Automatik: ein Knopf pro App **und** ein Skript → gültige v0.2-Spore; `verify` ✔.
- [ ] Kein Schlüssel im Repo; kein PII; 0.80-Riegel unberührt.
- [ ] Neu-Signier-Welle netzweit; `NETZ-STAND.md`/`PULS`/`PLAN` nachgezogen.
- [ ] Browser-Sichttest „wartet auf Klaus".

## Offene Fragen an Klaus (jetzt geklärt — hier als Beleg)

1. **Schnipsel-Granularität/Anzahl:** ✅ **Satz, max 20** (`SPORE_SNIPPET_MAX`=20,
   `SPORE_SNIPPET_GRANULARITY="sentence"`).
2. **Übergang 0.1→0.2:** ✅ **sanft** — 0.1-Sporen kurz weiter tolerieren (automatisch, gleiche
   Hauptversion; kein harter Schnitt).
3. **Re-Sign-Form:** ✅ **beides** — Knopf pro App (Pflicht-Pfad, lebende Identität ggf. via Modul 20
   Safe) + Termux/Node-Skript (ENV-Schlüssel-Repos).

## Pflichtlektüre (Reihenfolge)

1. Sage `CLAUDE.md` (§ Freibrief, § Heilige Tafeln, § Spec/Vertrag vor Code).
2. `docs/PULS.md` (oberster Eintrag 2026-07-14) + dieser Brief.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` (A6 + A10).
4. `docs/INTERFACES.md` — **v0.2 ist bereits eingetragen**: §0 (`PROTOCOL_VERSION`, `SPORE_SNIPPET_MAX`,
   `SPORE_SNIPPET_GRANULARITY`), §2 Spore-JSON (`snippetVectors` + § „Spore v0.2"), §4, Modul 02+03, §10.
5. Karten + Code Modul 03 (Embedding) + 02 (Spore).

## Abschluss-Befehl

`PULS.md` fortschreiben; `PLAN` + HTML-Checkliste nachziehen (A6/A10 → `[x]` nach der Welle);
`sbkim/NETZ-STAND.md` + Briefkasten-`SIGNAL.json` (seq +1) pflegen; neuen Folge-Brief anlegen und
vollständig als Codeblock im Chat ausgeben; Pflichtlektüre + Abschluss-Befehl wiederholen.
**Freibrief gilt** (siehe `CLAUDE.md` § Freibrief).
