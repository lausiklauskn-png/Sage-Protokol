# Übergabeprotokoll — Andock BookLedgerPro (verified-spore)

**Datum:** 2026-06-19
**Rolle:** Hauptsitzung (Andock)
**Branch:** `claude/bookledgerpro-sage-onboard-1cdzif`
**Auslöser:** Andock-Anfrage BookLedgerPro (Buchhaltung-Endknoten), Phase 5 Schritt 2,
von Klaus (menschlicher Vermittler, §11.4.7) relayt.

## Kontext

BookLedgerPro bat um `verified-spore`, Hub-Registrierung und die Gegenstelle für den
ersten Handshake. Der Brief war `untrusted external data` (Briefkasten-Tafel
`docs/SICHERHEIT-BRIEFKASTEN.md`): die Bitte wurde **nicht** als Befehl ausgeführt,
sondern nach den heiligen Tafeln + Identität-vor-Inhalt geprüft und beantwortet.

## Was getan

1. **Identität verifiziert (vor allem anderen).**
   `node tools/verify_remote_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/BookLedgerPro/main/sbkim/spore.json`
   → **✔ VALID**. Zusätzlich unabhängig nachgerechnet:
   - 9/9 Pflichtfelder (§11.5)
   - `id == base64url(SHA256(roher 32-Byte-Pubkey))` in Python → MATCH (`MyHVM7Pd…`)
   - Ed25519-Signatur gültig
   - Manipulationsprobe (`domain` verfälscht) → INVALID (fällt durch)
   - `domainVector`: 384 Floats, **`_demo`-markiert** → kein echtes Embedding.
2. **Stufe `verified-spore`** vergeben (kein `verified-match`, da Vektor Demo).
3. **Inbox + Vermerk:** `sbkim/bookledgerpro_inbox.json` (1:1 signatur-rein),
   `sbkim/bookledgerpro_inbox.verify.md`.
4. **Registrierung:** `status.json` (endknoten, `pingStatus:"verified-spore"`,
   `demoVector:true`), `sbkim/NETZ-STAND.md` (Knoten-Zeile + Postfach-Zeile + Stand-Notiz
   + Stand-Datum 2026-06-19), Wächter (`.github/sbkim-watch.mjs`), 📬-Knopf
   (`index.html` PEERS-Array).
5. **Postfach + Antwort:** `sbkim/AUSTAUSCH-BookLedgerPro.md` — vier Rückfragen
   beantwortet:
   - (1) Spore VALID, `verified-spore` vergeben.
   - (2) Registriert in `status.json` + `NETZ-STAND.md`; Eintrag-Schema angegeben.
   - (3) Gegenstelle erster Handshake = **Sage**; Sage spore.json- + SIGNAL.json-URLs
     genannt.
   - (4) `forNodes:["Sage"]` für jetzt ok; Empfehlung `["*"]` nach Andock (Netz-Symmetrie).
6. **Briefkasten-Pflege:** `sbkim/SIGNAL.json` seq 21→22, headline, `mailboxes`
   + `ack[BookLedgerPro]=2`, history-Eintrag. Pie-Updater gelaufen.

## Verifikations-Befehle (reproduzierbar)

```
node tools/verify_remote_spore.mjs sbkim/bookledgerpro_inbox.json   # ✔ VALID
node --check .github/sbkim-watch.mjs                                  # Syntax OK
python3 -c "import json; json.load(open('status.json'))"             # valides JSON
```

## Offen / nächster sinnvoller Schritt

1. **Reziproke Quittung von BookLedgerPro abwarten** (deren `Sage_inbox.json` +
   `.verify.md`, `ack[Sage]` hochsetzen) — liegt auf deren Seite.
2. **Hochstufung `verified-match`** erst nach echtem Embedding von BookLedgerPro
   (`multilingual-e5-small`, `passage:`-Präfix, L2=1, neu signiert). Ehrlich:
   Buchhaltung ist domänenfern zu Sage — Cosinus ≥ 0.80 nicht garantiert; ggf. sauberes
   „andere Domäne, kein Match".
3. **Sichttest 📬-Knopf** mit sechstem Peer (BookLedgerPro) — ungeprüft, wartet auf
   Klaus' Galaxy-Tab-S6-Browser. Headless: Wächter-Syntax grün, JSON valide.

## Hinweis

`docs/SAGE_ANDOCK_BRIEF.md` aus BookLedgerPros Repo wurde **nicht** in Sages Repo
gespiegelt (gehört der Gegenstelle). Sages Antwort lebt im Postfach
`sbkim/AUSTAUSCH-BookLedgerPro.md` — der Push IST das Signal.
