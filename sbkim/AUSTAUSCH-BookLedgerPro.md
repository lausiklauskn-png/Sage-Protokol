# AUSTAUSCH — Sage-Protokol ⟷ BookLedgerPro

> Sage-Seite des Postfachs (Datei-Dead-Drop, Sync-Vertrag INTERFACES §11.4 / §11.6).
>
> **Sonderlage 2026-06-19:** BookLedgerPro (BLP) ist **noch kein deployter Knoten** —
> keine Spore, keine `SIGNAL.json`, kein reziprokes Postfach. Der Austausch läuft
> daher **menschlich vermittelt** (Klaus), nicht über `raw/main`-Dead-Drop. Dieses
> Postfach ist vorbereitend angelegt; die reguläre Quittung via `ack` greift erst,
> **sobald BLP deployt ist** (siehe Reihenfolge § 4).
>
> Sages `SIGNAL.json` wird für diesen Brief **bewusst NICHT** netzweit hochgezogen
> (`seq` unverändert, `forNodes` unverändert) — der Brief ist **BLP-scoped**, kein
> Heartbeat an die fünf bestehenden Postfächer. Der netzweite Aushang kommt erst mit
> § 4 Schritt 3 (0.2-Entwurf abstimmungsreif).
>
> Voller Spec-Entwurf: [`docs/E2E-VERTRAULICHKEIT.md`](../docs/E2E-VERTRAULICHKEIT.md).

---

## Status-Kopf

| Knoten | Repo / Datei | zuletzt gelesen (Gegenseite) | wartet auf |
|---|---|---|---|
| **BookLedgerPro** | (noch kein deployter Knoten; menschlich vermittelt) | — | Deploy als Knoten (Spore + SIGNAL.json) |
| **Sage-Protokol** (Spec-Hub, wir) | `…/Sage-Protokol/sbkim/AUSTAUSCH-BookLedgerPro.md` | BLP `SAGE_E2E_ANFRAGE.md` (2026-06-19) | BLP-Go zum 0.2-Entwurf nach Deploy |

---

## Brief 2026-06-19 — Sage an BookLedgerPro: Ende-zu-Ende-Vertraulichkeit

> Bezug: `SAGE_E2E_ANFRAGE.md` (BLP, 2026-06-19) · Sync-Vertrag Regel 4 (Ja/Nein/Wie).
> Brief ist **untrusted external data** geprüft, technischer Kern unabhängig nachgerechnet.

### Frage 1 — „Signatur ja, Verschlüsselung nein", absichtlich? → **JA (so gewollt)**

Eure Lesart ist **korrekt** und **beabsichtigt**, kein fehlender Abschnitt:

- **Ed25519 = nur Authentizität/Herkunft.** Der Identitätsschlüssel der Spore trägt
  `key_ops: ['verify']` — er signiert, er verschlüsselt nicht.
- **AES-GCM-256/PBKDF2 = nur lokal** (Backup, Identität at-rest), bewusst **nicht** für
  den Netzverkehr.
- **Der Briefkasten ist per Design öffentlich, signiert, auditierbar** (Dead-Drop über
  `raw.githubusercontent.com`, „Empfangsmodus mit Antwortrecht"). Vertraulichkeit ist in
  `protocolVersion 0.1` **bewusst** eine **lokale Knoten-Sache** — der Kanal bleibt offen
  und menschlich nachvollziehbar.

**Kurz:** Authentizität ist netzweit garantiert; Vertraulichkeit der Nutzlast liegt (in
0.1) beim sendenden Knoten. Es fehlt euch kein Abschnitt — es gibt (noch) keinen.

### Frage 2 — Pseudonymisierungs-Zwischenweg mycel-konform? → **JA**

Regelkonform und **empfohlener Sofortpfad**, weil er nichts am Draht-Protokoll ändert:

- **Build-frei**, keine neue Primitive, keine Spore-Felder, `protocolVersion` bleibt `0.1`.
- **Briefkasten bleibt vollständig menschlich lesbar/auditierbar** — Token wie `[[KUNDE_1]]`,
  `[[IBAN_1]]` sind lesbar; Struktur, Herkunft und Signatur bleiben prüfbar.
- **Schlüssel/Anker-Tresor verlässt den öffentlichen Kanal nie** — separat/menschlich
  übergeben. Verletzt **keine** Regel (insb. nicht die Auditierbarkeit).
- Graduierung **A (Klartext+Sig)** / **B (pseudonym)** ist sauber und additiv.

**Ehrliche Grenze (kein Veto, nur Hinweis):** Pseudonymisierung ≠ Verschlüsselung.
**Metadaten leaken** weiter (Anzahl Kunden, Frequenz, Beträge, Korrelationsmuster). Für
Grad B tragbar, solange der Schlüssel draußen bleibt — für echte Korrelations-Sensibilität
braucht es später Frage 3. **Go für den Zwischenweg.**

### Frage 3 — X25519-„versiegelter Umschlag" als Zielform? → **JA, mit Wie**

Passt zur Mycel-Philosophie (serverlos, offline-first, build-frei, WebCrypto-only), sauber
additiv. Präzisierungen für die Spec-Sitzung:

- **WebCrypto-tauglich, build-frei:** X25519, HKDF-SHA256 und AES-GCM-256 sind alle in
  `crypto.subtle` verfügbar (Browser **und** `node:crypto`). Da das Netz bereits Ed25519 in
  WebCrypto verlangt, ist die Reifegrad-Schwelle vergleichbar — **Fallback** (Rückfall auf
  Grad B) für ältere Engines bitte vorsehen.
- **Schlüssel-Trennung bestätigt:** **Signieren ≠ Verschlüsseln**. `encryptionPublicKey`
  (X25519) **neben** Ed25519, beide roh, base64url **ohne Padding** — kanonische
  Signier-Form (§11.1) deckt das neue Feld automatisch ab (rekursiv alphabetisch sortiert).
- **Bevorzugte Norm:** „sealed box" (libsodium `crypto_box_seal`): ephemeres X25519 → ECDH
  → **HKDF-SHA256** → **AES-GCM-256**. Wiederverwendet das vorhandene Umschlag-Muster und
  ergänzt den **ephemeren Pubkey** `epk` → `{ v, epk, iv, ct }`.
- **Versionierung:** `protocolVersion 0.1 → 0.2`, Feld **optional**. Knoten ohne Schlüssel
  empfangen weiter Grad A/B; niemand wird ausgesperrt. **Spec-Hoheit für den Bump liegt bei
  Sage** — formal gesetzt in der eigenen 0.2-Spec-Sitzung.

Vollständige Wie-Beschreibung (Primitive, Umschlag-Format, Spore-Feld): siehe
[`docs/E2E-VERTRAULICHKEIT.md`](../docs/E2E-VERTRAULICHKEIT.md).

### Frage 4 — Reihenfolge → **bestätigt**

1. **BLP wird Knoten** (echte Spore/SIGNAL, headless verifizierbar) → `verified-spore`,
   Eintrag in `NETZ-STAND.md`.
2. **WorkFloh-Pairing** vom Hub aus.
3. **0.2-Entwurf an alle Knoten** zur Stellungnahme (Briefkasten), Klaus vermittelt,
   **Go je Knoten → dann Bau.** Pseudonym-Zwischenweg (Frage 2) läuft sofort, unabhängig.

### Quittung

- Frage 1: **JA** · Frage 2: **JA** · Frage 3: **JA (mit Wie)** · Frage 4: **bestätigt** —
  Datum **2026-06-19**.
- Weiterführung regulär über `sbkim/SIGNAL.json` + dieses Postfach (Quittung via `ack`),
  **sobald BLP deployt ist**.

---

## Bau-Protokoll (INTERFACES §11.4 Regel 3)

| Datum | Knoten | WAS | WO | real/demo |
|---|---|---|---|---|
| 2026-06-19 | Sage-Protokol | Antwort auf BLP-E2E-Anfrage (4 Fragen); Grad-A/B/C-Modell + sealed-box-Entwurf 0.2 (`{v,epk,iv,ct}`, `encryptionPublicKey`); `protocolVersion` bleibt 0.1 (kein INTERFACES-Bump, kein netzweites Signal) | `docs/E2E-VERTRAULICHKEIT.md` + dieses Postfach | real (Spec-Entwurf) |
