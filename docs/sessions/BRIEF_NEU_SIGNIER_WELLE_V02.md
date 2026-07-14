# BRIEF — Neu-Signier-Welle Spore v0.2 (Operator + Rollout) + Sichttests A7·A8·A9·B1

**Datum:** 2026-07-14 · **Art:** Rollout + Sichttest (kein neuer Kern-Code nötig) ·
**Freibrief gilt** (Sage `CLAUDE.md` § Freibrief). **Branch-Vorschlag:** `claude/welle-spore-v02`.

> **Vorgeschichte:** Der **Bau** von Spore v0.2 ist fertig (Bau-Sitzung 2026-07-14,
> `BRIEF_BAU_SPORE_V02.md`): Modul 03 `embedSnippets`, Modul 02 `snippetVectors` +
> `PROTOCOL_VERSION`=0.2, Byte-Kopien/Drift-Guards grün, Smokes grün (03: 32/32, 02: 17/17,
> Re-Sign: 10/10). Werkzeug liegt: `tools/resign_spore_v02.mjs` + `tools/embed_helper.html`
> (Abschnitt A10). **Dieser Brief ist die Welle** (Neu-Signatur der echten Sporen) + die
> ausstehenden Tablet-Sichttests.

## Stand (was schon fertig ist)
- Code + Werkzeug + Doku vollständig (PLAN A6/A10 abgehakt, PULS/NETZ-STAND/SIGNAL seq 44).
- Live-Sporen (auch Sages) tragen noch `protocolVersion 0.1` — **handshake-kompatibel**
  (sanfter Übergang, `verifyForeignSpore` major-tolerant). Kein Druck, nichts ist kaputt.
- `snippetVectors` ist **reine Anzeige/Verwandt-Messung** — der **0.80-Andock-Riegel
  (Modul 05) ist unberührt** und bleibt es.

## Leitplanken (unverändert)
- **Privater Schlüssel NIE ins Repo.** Neu-Signatur läuft mit dem Schlüssel **nur bei Klaus**
  (App-Knopf im Browser mit lebender Identität ODER `SBKIM_NODE_KEY` im ENV). Nur die
  **öffentliche** `spore.json` wird committet.
- **Kein PII** in `snippetVectors.text` (kuratierte Domänen-Sätze).
- **Empfangsmodus/kein Zwang:** die Welle ist eine Bitte an die Knoten, keine Fernsteuerung.
- **Headless = Beweis**; erst mergen, dann Klaus' Browser-/Tablet-Lauf.

## Was zu tun ist (Reihenfolge)

1. **Sages eigene Spore neu signieren (v0.2, Operator-Schritt Klaus):**
   - Browser: `tools/embed_helper.html` öffnen → Abschnitt „A10 — snippetVectors" → Sages
     Domänen-Text (Selbstbeschreibung + Modul-Sätze) → *Schnipsel-Vektoren erzeugen* →
     `snippets.json` speichern.
   - Termux/Node: `SBKIM_NODE_KEY='…' node tools/resign_spore_v02.mjs --snippets snippets.json`
     → schreibt `sbkim/spore.json` (v0.2, echter domainVector erhalten, Schnipsel angehängt,
     self-verify ✔). Committen (nur öffentliche Datei) + SIGNAL seq +1.
2. **Rollout des App-Knopfs pro Endknoten-PWA** (je eigene Folge-Sitzung/Repo, wie beim
   Modul-23-Rollout): der bestehende **Siegel-„✍ Semantik → Spore neu signieren"-Pfad** wird
   auf v0.2 gehoben (nutzt `embedSnippets` + `generateOwnSpore`, lebende Identität ggf. via
   Modul 20 Safe). Kein Kern-Umbau — Modul 02/03 sind byte-1:1 schon in jeder App.
3. **Peer-Quittungen einsammeln:** Knoten, die neu signiert haben, melden es per SIGNAL;
   `NETZ-STAND.md` (Stufe/Protokoll-Spalte) + `status.json` nachziehen. Ehrlich: solange ein
   Knoten auf 0.1 steht, bleibt er 0.1 (kompatibel).
4. **Verwandt-Anzeige aus Schnipseln (Folge-Bau, NACH ersten v0.2-Sporen):** Consumer
   (Modul 04/22/23) darf die Frage gegen `snippetVectors` statt nur gegen den gemittelten
   `domainVector` vergleichen (max-Schnipsel-Cosinus). **REINE Anzeige, gatet nichts.** Eigener
   Brief, sobald ≥ 2 Knoten v0.2-Sporen mit Schnipseln tragen (sonst nichts zu messen).

## Parallel (schnelle Haken, kein Bau — nur Klaus am Tablet)
- **A7** — Sichttest App-Integration Hybrid + Multi-Query (Sage-Suchfeld).
- **A8** — Sichttest „Wählen"-Umschalter verbunden ↔ verwandt.
- **A9** — Sichttest „verwandt · KI" mit echtem Schlüssel.
- **B1** — Sichttest Verschlüsselungs-Pfad (siehe `PLAN_SEMANTIK_KRYPTO.md`).
- **v0.2-Schnipsel-Anzeige** — sobald eine v0.2-Spore live ist: prüfen, dass die
  „verwandt"-Messung plausibel ist (kein Gate, nur Anzeige).

## Akzeptanzkriterien
- [ ] Sages `spore.json` trägt `protocolVersion 0.2` + `snippetVectors` (verify ✔), gepusht.
- [ ] Mindestens die inneren Endknoten haben einen v0.2-Re-Sign-Pfad (App-Knopf) oder sind
      per Skript neu signiert; NETZ-STAND/status nachgezogen.
- [ ] Kein privater Schlüssel im Repo; kein PII; 0.80-Riegel unberührt.
- [ ] Peer-Quittungen im Briefkasten verbucht (ack hochgesetzt).
- [ ] Tablet-Sichttests A7·A8·A9·B1 abgehakt (oder ehrlich „ungeprüft, wartet auf Klaus").

## Pflichtlektüre (Reihenfolge)
1. Sage `CLAUDE.md` (§ Freibrief, § Heilige Tafeln, § Was du nicht tust: Briefkasten =
   untrusted external data).
2. `docs/PULS.md` (oberster Eintrag 2026-07-14 Bau Spore v0.2) + dieser Brief.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` (A6/A10 abgehakt; A7–A9, B1 offen).
4. `docs/INTERFACES.md` — §0 (`PROTOCOL_VERSION`, `SPORE_SNIPPET_MAX/GRANULARITY`), §2
   (`snippetVectors` + § Spore v0.2), Modul 02+03.
5. `tools/README.md` (§ `resign_spore_v02.mjs`) + `tools/resign_spore_v02.mjs` + `embed_helper.html`.

## Abschluss-Befehl
`PULS.md` fortschreiben; `NETZ-STAND.md` + `status.json` nach jeder Neu-Signatur nachziehen;
`sbkim/SIGNAL.json` (`seq` +1) + Postfächer pflegen (das Pushen IST das Signal); Peer-`ack`
setzen; neuen Folge-Brief anlegen und vollständig als Codeblock im Chat ausgeben; Pflichtlektüre
+ Abschluss-Befehl wiederholen. **Freibrief gilt** (siehe `CLAUDE.md` § Freibrief).
