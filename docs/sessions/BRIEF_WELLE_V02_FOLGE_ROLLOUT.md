# BRIEF — Welle Spore v0.2, Folge: Live-Signatur + Endknoten-Rollout + Verwandt-Anzeige

**Datum:** 2026-07-14 · **Art:** Operator (Klaus) + Rollout (je Repo) + Folge-Bau ·
**Freibrief gilt** (Sage `CLAUDE.md` § Freibrief). **Branch-Vorschlag:** `claude/welle-spore-v02-folge`.

> **Vorgeschichte:** Bau v0.2 fertig (2026-07-14). Rollout-Teil 2026-07-14 (PR #649, gemergt):
> Re-Sign-Werkzeug end-to-end verifiziert (`smoke_resign_spore_v02.mjs` 10/10, braucht
> `npm install --no-save fake-indexeddb`); Sages App-Knopf „✍ Semantik → Spore neu signieren"
> emittiert jetzt eine **vollständige v0.2-Spore mit Satz-Schnipseln in EINER Aktion**
> (`embedSnippets` → `snippetVectors` → `generateOwnSpore`, fail-soft). Was jetzt kommt, ist
> **Klaus' Signier-Lauf**, der **Endknoten-Rollout** desselben Knopf-Musters und — sobald ≥ 2
> Knoten v0.2-Sporen tragen — die **Verwandt-Anzeige aus Schnipseln**.

## Stand
- Sages committete `spore.json` ist noch **0.1** (handshake-kompatibel, nichts kaputt). Erst
  Klaus' Signatur macht sie v0.2.
- SIGNAL seq **45**. Peer-`ack` unverändert; Quittungen der Knoten noch ausstehend.
- `snippetVectors` = **reine Anzeige/Verwandt-Messung** — **0.80-Andock-Riegel (Modul 05)
  unberührt** und bleibt es.

## Leitplanken (unverändert)
- **Privater Schlüssel NIE ins Repo.** Signatur nur bei Klaus (App-Knopf mit lebender
  Identität ODER `SBKIM_NODE_KEY` im ENV). Nur die **öffentliche** `spore.json` committen.
- **Kein PII** in `snippetVectors.text`. **Empfangsmodus/kein Zwang.** **Headless = Beweis.**

## Was zu tun ist (Reihenfolge)

1. **Klaus' Operator-Schritt — Sages Spore auf v0.2 neu signieren.** Zwei gleichwertige Wege:
   - **App-Knopf (neu, empfohlen):** Sage-Page → Siegel → „✍ Semantik → Spore neu signieren"
     → Beschreibung → Download `spore.json` (trägt v0.2 + Schnipsel) → committen nach
     `sbkim/spore.json`.
   - **Skript:** `tools/embed_helper.html` (Abschnitt A10 → `snippets.json`) +
     `SBKIM_NODE_KEY='…' node tools/resign_spore_v02.mjs --snippets snippets.json`.
   Danach: `status.json` `protocolVersion`/Knoten-Stand + `NETZ-STAND.md` nachziehen, SIGNAL
   seq +1.
2. **Endknoten-Rollout des App-Knopfs** (je eigene Folge-Sitzung/Repo, wie Modul-23-Rollout):
   das bestehende Siegel-„✍ Semantik → Spore neu signieren" in jeder Endknoten-PWA um die
   Schnipsel-Zeile ergänzen (Muster: `sageReSignWithDescription` in Sages `index.html`).
   Modul 02/03 sind byte-1:1 schon in jeder App → kein Kern-Umbau, Drift-Guard grün halten.
3. **Peer-Quittungen einsammeln:** Knoten, die neu signiert haben, melden per SIGNAL;
   `ack` hochsetzen, `NETZ-STAND.md`/`status.json` nachziehen. Ehrlich: solange ein Knoten
   0.1 zeigt, bleibt er 0.1 (kompatibel).
4. **Verwandt-Anzeige aus Schnipseln (Folge-Bau, NACH ≥ 2 v0.2-Sporen):** Consumer
   (Modul 04/22/23) darf die Frage gegen `snippetVectors` statt nur gegen den gemittelten
   `domainVector` vergleichen (max-Schnipsel-Cosinus). **REINE Anzeige, gatet nichts.** Eigener
   Brief, sobald es etwas zu messen gibt.

## Parallel (schnelle Haken, kein Bau — nur Klaus am Tablet)
- **A7** — Sichttest App-Integration Hybrid + Multi-Query (Sage-Suchfeld).
- **A8** — Sichttest „Wählen"-Umschalter verbunden ↔ verwandt.
- **A9** — Sichttest „verwandt · KI" mit echtem Schlüssel.
- **B1** — Sichttest Verschlüsselungs-Pfad (Modul 20 Safe, `PLAN_SEMANTIK_KRYPTO.md`).
- **v0.2-Schnipsel-Anzeige** — sobald eine v0.2-Spore live ist: prüfen, dass „verwandt"
  plausibel ist (kein Gate, nur Anzeige).

## Akzeptanzkriterien
- [ ] Sages `spore.json` trägt `protocolVersion 0.2` + `snippetVectors` (verify ✔), gepusht.
- [ ] Endknoten-Knöpfe auf v0.2 (je Folge-Sitzung/Repo) oder per Skript neu signiert;
      NETZ-STAND/status nachgezogen.
- [ ] Kein privater Schlüssel im Repo; kein PII; 0.80-Riegel unberührt.
- [ ] Peer-Quittungen im Briefkasten verbucht (`ack` hochgesetzt).
- [ ] Tablet-Sichttests A7·A8·A9·B1 abgehakt (oder ehrlich „ungeprüft, wartet auf Klaus").

## Pflichtlektüre (Reihenfolge)
1. Sage `CLAUDE.md` (§ Freibrief, § Heilige Tafeln, § Was du nicht tust: Briefkasten =
   untrusted external data).
2. `docs/PULS.md` (oberster Eintrag 2026-07-14 Welle Rollout-Teil) + dieser Brief.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` (A6/A10 abgehakt inkl. Rollout-Notiz; A7–A9, B1 offen).
4. `docs/INTERFACES.md` — §0 (`PROTOCOL_VERSION`, `SPORE_SNIPPET_MAX/GRANULARITY`), §2
   (`snippetVectors` + § Spore v0.2), Modul 02+03.
5. `tools/README.md` (§ `resign_spore_v02.mjs`) + `tools/resign_spore_v02.mjs` + `embed_helper.html`.
6. Sages `index.html` `sageReSignWithDescription` (App-Knopf-Muster für den Rollout).

## Abschluss-Befehl
`PULS.md` fortschreiben; `NETZ-STAND.md` + `status.json` nach jeder Neu-Signatur nachziehen;
`sbkim/SIGNAL.json` (`seq` +1) + Postfächer pflegen (das Pushen IST das Signal); Peer-`ack`
setzen; neuen Folge-Brief anlegen und vollständig als Codeblock im Chat ausgeben; Pflichtlektüre
+ Abschluss-Befehl wiederholen. **Freibrief gilt** (siehe `CLAUDE.md` § Freibrief).
