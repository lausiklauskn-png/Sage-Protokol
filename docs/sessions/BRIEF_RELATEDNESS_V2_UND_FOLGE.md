# BRIEF — RELATEDNESS_CENTER v2 (Entscheid) · BLP v0.2 · S5-Härtungs-Sims · A18/A11

**Für die nächste Sitzung. Geschrieben 2026-07-23. Sage ist der Hub.**

> **Freibrief gilt** (siehe `CLAUDE.md § Freibrief`): selbstständig bauen/merken/mergen,
> solange logisch, nachvollziehbar, nützlich; echtes Zweifeln (mehrdeutig, schwer umkehrbar,
> architektonisch tiefgreifend) → **erst Klaus fragen**; nie stillschweigend. Selbst-Merge
> netzweit. Klaus' Browser-Sichttest bleibt der letzte Beweis — headless ersetzt ihn nicht.

## 0. Pflichtlektüre + Sitzungsstart (in dieser Reihenfolge)
1. `CLAUDE.md` — Verfassung, Freibrief, „von `origin/main` frisch abzweigen".
2. `docs/PULS.md` — **oberster Eintrag „Stand 2026-07-23 (Folge)"** (Register-Refresh).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — A/B-Abhak-Liste (offene: A5b, A11, A12, A15, A18, B4, B6).
4. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` — für Punkt 2.1 (RELATEDNESS_CENTER) Pflicht.
5. `status.json` (14 Endknoten, ehrlicher Real-Anteil) + `tools/match_baseline.mjs`.

**Sitzungsstart-Pflicht:** `bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"`;
für JEDES angefasste Repo `git fetch origin && git checkout -B <branch> origin/main`.
`npm install --no-save fake-indexeddb` für den Testlauf.

## 1. Ausgangslage (2026-07-23 erledigt, gemergt PR #701 + #702)
- **Register voll aktualisiert gegen die LIVE-Sporen** (14 Knoten). Alle 12 fremden Live-Sporen
  von `main` mit dem Produktiv-Verifizierer geprüft → ✔ VALID; Sage-Cosinus je Knoten unabhängig
  nachgerechnet. 9 stale nodeIds + alle Scores nachgezogen. **Tomys → `verified-spore`** (Sage
  0.7917 < 0.80), **Private Brain → `verified-match`** (0.810), **Muttis-Rezeptbuch als 14. Knoten**
  (verified-match 0.877, eigene Identität + DB-Suffix `muttisrezeptbuch`).
- **Falsche Test/Sim-Annahmen korrigiert:** die letzte Sitzung hatte aus stale Inbox-Kopien
  „Rezeptbuch/Mixarium < 0.80" geschlossen — Live-Wahrheit ist ≥ 0.80. Tomys ist jetzt das
  ehrliche <0.80-Beispiel. **Suite 61/61 grün.**
- **Wichtiger Befund für Punkt 2.1:** nach der v0.2-Welle liegt der **rohe** e5-Cosinus-Boden noch
  höher (≈0.85 Mittel), **alle** Inhalts-/Werkzeug-Knoten ≥ 0.80. Und der **zentrierte** Cosinus
  (`relatedness`, Modul 04) trennt mit `RELATEDNESS_CENTER` **v1** die Knoten **nicht mehr sauber**
  (gemessen: Point↔Sage 0.46 > Mixarium↔Rezeptbuch 0.38). Modul 04 wurde **bewusst nicht** angefasst.

## 2. Was zu tun ist (Vorschlag-Reihenfolge)

### 2.1 RELATEDNESS_CENTER v2 — **ZUERST Klaus fragen** (architektonisch, byte-copy-weit)
`RELATEDNESS_CENTER` ist ein **fest eingebauter Konstant-Vektor** in `src/modules/04_match.js`
(~Z. 231), einmal aus den **alten** (Vor-v0.2) Domänen-Vektoren gemittelt. Die v0.2-Re-Sign-Welle
(Schnipsel-Mittel A10) hat die Vektor-Geometrie verschoben → die `relatedness()`-Trennung ist
kaputt. **Das ist die dokumentierte „v2-Kalibrierung offen".**

- **Frage an Klaus (Richtungsentscheid):** Soll der Mittelpunkt aus den **neuen v0.2-Vektoren**
  neu berechnet werden? Wenn ja: **aus welchem Vektor-Satz** (nur die 14 Knoten-domainVectors?
  oder + Schnipsel-Vektoren? oder ein breiterer, repräsentativer Satz)?
- **Warum erst fragen:** Modul 04 ist **byte-kopiert** (`such-tool/`, `pinnwand/`, `sbkim-bundle/`)
  → Drift-Guards + Re-Copy überall; die Änderung wirkt auf die **„verwandt"-Anzeige aller Apps**.
  Reine Anzeige (gatet NICHTS — der 0.80-Andock-Riegel ist der ROHE Cosinus, unberührt), aber
  sichtbar netzweit.
- **Wenn Klaus „ja" sagt:** neuen Mittelpunkt headless aus den Live-Sporen rechnen (Skript analog
  `tools/match_baseline.mjs`), `RELATEDNESS_CENTER` in Modul 04 ersetzen, **byte-1:1 in alle
  Kopien** ziehen (Drift-Guards grün), `smoke_bau04e_relatedness` von „nur Invarianten" zurück auf
  eine **echte Trennungs-Prüfung** heben (Schwestern/Essen↔Trinken verwandt, Hub↔Endknoten nicht),
  `smoke_bau22e`/`smoke_bau23` mitziehen. **KEIN** Eingriff am 0.80-Riegel / `PROVIDER_MIN_MATCH`.
- **Wenn Klaus „nein/später":** Punkt ruht; der ehrliche Invarianten-Test bleibt (kein Grün-Rechnen).

### 2.2 BLP v0.2 — die letzte echte Demo-Grenze schließen (Operator-Schritt Klaus)
BookLedgerPro ist der **einzige** Knoten noch auf `protocolVersion 0.1` (domainVector real, aber
kein Schnipsel-Mittel). Live-Re-Sign mit privatem Schlüssel in Klaus' Browser (Siegel → Spore neu
signieren). Danach headless verifizieren + Register-Score/Notiz nachziehen (wie in dieser Sitzung).

### 2.3 S5 — Härtungs-Fälle als Sims sichern (Brief-Vorläufer §2.2, offen)
Aus der A2/A3-Historie in die Sim-Familie festschreiben, damit sie nicht zurückfallen: Antworter-
Vorwärmen, Frage-Timeout, saubere Sporen, newest-per-name im Raum. Ausbau von `tests/sim_multinode.mjs`
oder eigene `tests/sim_haertung.mjs`. **Ehrlich:** Sim ≠ Live (Mock-Bus, deterministischer Embedding-Stub).

### 2.4 A18 — kanonischen Siegel-Andock-Wizard netzweit ausrollen
Skill `status-leiste-siegel` + `assets/siegel-inhalt.js`. Pro Repo eine Sitzung; byte-1:1, Fremdnutzer-
/Marktplatz-Brille (fail-soft, klar benennen). Reihenfolge/Stand in `PLAN_SEMANTIK_KRYPTO.md` A18.

### 2.5 A11 — Such-Ergebnis → Frage → optional Andocken (Marktplatz-Kopplung Modul 22 ↔ 23)
Teil B aus `PLAN_SEMANTIK_KRYPTO.md`. Spec + Bau. Setzt nichts Blockierendes voraus.

### 2.6 Kleinkram / optional
- **A5b** Multi-Query in der Pinnwand (~30 Min). **B6** E2E Grad C (Bump-Entscheid zuerst).
- `docs/checkliste_netzstand_sage_real.html` bei Gelegenheit auf den 14-Knoten-Stand nachziehen.

## 3. Empfohlener Einstieg
**2.1 RELATEDNESS_CENTER v2 als Frage an Klaus stellen** (Richtungsentscheid + Vektor-Satz) →
je nach Antwort bauen oder ruhen lassen → **2.3 S5-Härtungs-Sims** (headless, ohne Klaus) →
**2.4 A18**. **2.2 BLP v0.2** ist ein Klaus-Browser-Schritt, wann immer er mag.

## 4. Nutzbare Skills
`saubere-netz-anmeldung` · `status-leiste-siegel` · `verschluesselter-schluessel-tresor` · `geraetename`.

## 5. Abschluss-Pflicht (Kette reißt nie ab)
1. `docs/PULS.md` fortschreiben (bei `status.json`-Änderung vorher `python3 scripts/update_puls_pie.py`).
2. Erledigte A/B-Punkte in `PLAN_SEMANTIK_KRYPTO.md` + Checkliste abhaken.
3. Übergabeprotokoll in `docs/sessions/archiv/`.
4. **Neuen Brief** schreiben + **vollständig als Codeblock im Chat** ausgeben.
5. „Nächste Schritte"-Block (2–4 Punkte) direkt in der Chat-Antwort.
6. Commit + Push je abgegrenzter Aufgabe; eigene PRs selbst mergen (Freibrief).
