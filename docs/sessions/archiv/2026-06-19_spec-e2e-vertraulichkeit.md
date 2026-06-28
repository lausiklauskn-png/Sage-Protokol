# Übergabeprotokoll — Spec-Sitzung Ende-zu-Ende-Vertraulichkeit

**Datum:** 2026-06-19
**Rolle:** Spec-Sitzung
**Branch:** `claude/sage-e2e-encryption-spec-y7zg21`
**Auslöser:** `SAGE_E2E_ANFRAGE.md` von BookLedgerPro (BLP), vier Fragen zur
Vertraulichkeit im Mycel. Brief = `untrusted external data` (Briefkasten-Tafel),
technischer Kern unabhängig nachgeprüft.

## Was getan

Spec-Sitzung (doc-only, kein `src/`-Code). Scope durch Klaus per AskUserQuestion
festgelegt: BLP-scoped Brief + Entwurf-Doku, **kein** INTERFACES-/`protocolVersion`-Bump,
**kein** netzweites Signal.

1. **`docs/E2E-VERTRAULICHKEIT.md`** (neu) — Spec-**Entwurf** (ausdrücklich keine Tafel):
   - Ausgangslage 0.1: Ed25519 = nur Authentizität; AES-GCM/PBKDF2 = nur lokaler
     Backup-Pfad; Briefkasten per Design öffentlich/signiert/auditierbar.
   - Drei Grade: **A** Klartext+Sig (heute), **B** Pseudonymisierung (build-frei,
     Sofortpfad, Metadaten leaken weiter), **C** sealed-box X25519 (Zielform, 0.2).
   - Sealed-box-Schema: ephemeres X25519 → ECDH → HKDF-SHA256 → AES-GCM-256 (libsodium
     `crypto_box_seal`-Norm), Umschlag `{ v, epk, iv, ct }` (base64url nopad).
   - Optionales Spore-Feld `encryptionPublicKey` (X25519) neben `publicKey` (Ed25519);
     von §11.1 kanonischer Signier-Form automatisch gedeckt; **kein** Pflichtfeld.
   - Versionierungs-Plan 0.1 → 0.2, Feld optional, Fallback auf Grad B; Spec-Hoheit Sage.
2. **`sbkim/AUSTAUSCH-BookLedgerPro.md`** (neu) — Postfach vorbereitend; Brief 2026-06-19
   mit Antwort auf alle vier Fragen + Bau-Protokoll-Zeile. Sonderlage: BLP nicht deployt
   → menschlich vermittelt, `ack`-Quittung erst nach Deploy.
3. **`docs/PULS.md`** — neuer Sitzungs-Eintrag (oben im Log).

## Bewusst NICHT getan

- **Kein `INTERFACES.md`-Eintrag.** Der 0.2-Bump (neues Pflicht-/Optionalfeld + Umschlag)
  ist architektonisch tiefgreifend; er folgt erst nach Knoten-Go (Reihenfolge-Schritt 3).
  Die Antwort an BLP defert den formalen Bump selbst — INTERFACES jetzt zu ändern würde
  ihrer eigenen Reihenfolge widersprechen.
- **Kein `SIGNAL.json`-`seq`-Bump / kein Broadcast.** Klaus' Wahl: noch nicht netzweit
  signalisieren (BLP ist kein deployter Knoten; Brief ist BLP-scoped).
- **Kein `NETZ-STAND.md`-Eintrag.** BLP ist noch kein Knoten.
- **Kein `src/`-Code** (Spec-Sitzung).

## Status

- `status.json` unverändert → `update_puls_pie.py` nicht nötig.
- `tests/manual_check.html` unberührt (doc-only Sitzung).

## Nächster sinnvoller Schritt

1. **BLP deployt sich als Knoten** (echte Spore + `SIGNAL.json`, headless verifizierbar
   §11.2) → Stufe `verified-spore`, `NETZ-STAND.md`-Zeile, eigenes reziprokes Postfach.
2. **WorkFloh-Pairing** vom Hub aus.
3. **0.2-Spec-Sitzung** (formaler `protocolVersion`-Bump in INTERFACES) als Entwurf an
   alle Knoten, `SIGNAL.json` seq+1 / `forNodes: ["*"]`, Go je Knoten → dann Bau.
4. **Grad-B-Pseudonymisierung** ist sofort und unabhängig nutzbar (kein Bump/Bau nötig).
