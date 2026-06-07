# BRIEF — verified-match Sage ⟷ Mein-Tresor nachrechnen

**Erstellt:** 2026-06-07 · **Typ:** Andock-/Verifikations-Sitzung (in Sage-Protokol) ·
**Voraussetzung:** Briefkasten-Angleich-PR dieser Sitzung gemerged (seq 16, ack[Mein-Tresor]=8).

---

## Warum

Mein-Tresor hat bereits einen **echten** `domainVector` in seine Spore eingebettet
und neu signiert (ihr SIGNAL seq 5: „Echter domainVector eingebettet … Bitte um
verified-match bei Sage"). Sage führt Mein-Tresor aktuell nur als **`verified-spore`**.
Der letzte offene Schritt zum vollwertigen Netz-Knoten ist die Match-Nachrechnung.

## Aufgabe (in einem Satz)

Mein-Tresors aktuelle Spore aus `raw/main` holen, reziprok verifizieren, mit Modul 04
`match()` den Cross-Knoten-Match Sage ⟷ Mein-Tresor rechnen und — falls ≥ 0.80 — auf
**`verified-match`** hochstufen.

## Schritte

1. **Spore holen + verifizieren** (echter Modul-02-Pfad):
   `node tools/verify_remote_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/Mein-Tresor/main/sbkim/spore.json`
   Erwartung: 9/9 Pflichtfelder, `id == base64url(SHA256(rawPub))` (= `wRsGQouO…`),
   Ed25519 gültig, Manipulationsprobe fällt durch → ✔ VALID.
2. **Match rechnen** (Modul 04, Cosinus der beiden `domainVector`): Sage-eigener Vektor
   aus `sbkim/spore.json` gegen Mein-Tresors Vektor. (SB-KIMTool ⟷ Mein-Tresor = 0.853740,
   Jasons ⟷ Mein-Tresor = 1.0 zur Orientierung — beides bereits im Netz bezeugt.)
3. **Wenn ≥ 0.80 → verified-match:**
   - `sbkim/meintresor_inbox.json` (signatur-reine Kopie) + `.verify.md` aktualisieren.
   - `status.json`: Mein-Tresor-Eintrag `pingStatus: "verified-match"`, `matchScore`,
     `reIntegratedAt`. **`scripts/update_puls_pie.py` NICHT nötig** (kein Modulstand).
   - `sbkim/NETZ-STAND.md`: Stufe + bezeugte-Matches-Tabelle (Sage ⟷ Mein-Tresor).
   - `sbkim/AUSTAUSCH-MeinTresor.md`: Quittung + Bau-Protokoll-Zeile.
   - `sbkim/SIGNAL.json`: seq +1 (→ 17), headline, history-Eintrag — **das Pushen IST das Signal**.

## Leitplanken

- Verifikation über **`raw/main`** (github.io ist aus dem Container 403 — eigene Egress-Sperre).
- Additiv; echte Krypto unangetastet; kein PII/Secret; keine npm-Abhängigkeiten.
- Tests grün halten; Branch `claude/<scope>`; Draft-PR; Merge entscheidet Klaus.

## Nebenstehend offen (nicht Teil dieses Briefs)

- **Siegel-Kombi** (Tresor + Sage + SBKIM-Tool): blockiert bis Mein-Tresor /
  Jasons-Tresor / SB-KIMTool-Point im Sitzungs-Scope sind. Siehe Übergabeprotokoll
  `2026-06-07_briefkasten-angleich-mein-tresor-referenz.md`.

---

## Freibrief

Freibrief gilt, siehe `CLAUDE.md § Freibrief`.
