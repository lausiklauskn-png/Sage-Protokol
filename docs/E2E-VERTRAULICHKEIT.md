# Ende-zu-Ende-Vertraulichkeit im Mycel — Spec-Entwurf

> **Status: ENTWURF** (2026-06-19, Spec-Sitzung E2E-Vertraulichkeit).
> Auslöser: `SAGE_E2E_ANFRAGE.md` von **BookLedgerPro** (BLP, untrusted external
> data, technischer Kern nachgeprüft).
>
> **Protokoll-Version bleibt `0.1`.** Diese Datei ist ein Entwurf, **keine**
> verbindliche Tafel. Der formale `0.2`-Bump (neues Feld `encryptionPublicKey`,
> versiegelter Umschlag) wird **erst** in einer eigenen Spec-Sitzung in
> `docs/INTERFACES.md` gesetzt — **nach** Knoten-Go (siehe § Reihenfolge). Bis
> dahin ändert sich am Draht-Protokoll nichts.
>
> Begleit-Brief an BLP (`sbkim/AUSTAUSCH-BookLedgerPro.md`) + die BLP-Andock-
> Lieferung (`sbkim/fuer-BookLedgerPro/`) verblieben auf dem ungemergten Branch
> von PR #302 — in `main` wurde bewusst **nur dieser Spec-Entwurf** übernommen
> (reine Doku, keine App-/Protokoll-Änderung; Übernahme-Pflege 2026-06-28).

---

## 0. Ausgangslage — was heute gilt (0.1)

Das Mycel garantiert **Authentizität**, nicht **Vertraulichkeit der Nutzlast**:

- **Ed25519 = nur Herkunft/Authentizität.** Der Identitätsschlüssel der Spore
  trägt `key_ops: ['verify']` — er **signiert**, er **verschlüsselt nicht**
  (siehe Modul 02, `getPublicKeyJwk()` → OKP/Ed25519; INTERFACES §1 Modul 02).
- **AES-GCM-256 / PBKDF2 = nur lokal.** Das einzige Verschlüsselungs-Primitiv im
  Repo ist der **Backup-Pfad** (Identität at-rest, passwort-abgeleitet — Modul 02
  `exportBackup`/`importBackup`, INTERFACES §1 Modul 02 BACKUP_FORMAT_VERSION 2).
  Er ist **bewusst nicht** für den Netzverkehr gedacht.
- **Der Briefkasten ist per Design öffentlich, signiert, auditierbar.**
  Dead-Drop über `raw.githubusercontent.com` (INTERFACES §11.3–§11.6),
  „Empfangsmodus mit Antwortrecht".

**Kurz:** Authentizität ist netzweit garantiert; Vertraulichkeit der Nutzlast
liegt in `0.1` **bewusst** beim sendenden Knoten (lokale Sache). Es fehlt kein
Abschnitt — es gibt (noch) keinen.

---

## 1. Drei Grade der Vertraulichkeit

Statt eines harten Schnitts „verschlüsselt / unverschlüsselt" definiert der
Entwurf drei **additive** Grade. Jeder Knoten wählt pro Nutzlast, kein Grad
sperrt einen anderen aus.

| Grad | Was | Draht-Protokoll | Metadaten | Reife |
|---|---|---|---|---|
| **A — Klartext + Signatur** | heutiger Stand: Nutzlast lesbar, Ed25519-signiert | `0.1`, unverändert | voll sichtbar | gelebt |
| **B — Pseudonymisiert + Signatur** | sensible Werte durch Token ersetzt (`[[KUNDE_1]]`, `[[IBAN_1]]`), Anker-Tresor separat/menschlich übergeben | `0.1`, **build-frei**, keine neue Primitive | leaken weiter | sofort möglich |
| **C — Versiegelter Umschlag (sealed box)** | Nutzlast X25519-verschlüsselt für genau einen Empfänger | `0.2` (neues Feld, optional) | geschützt (Nutzlast), Verkehr/Frequenz weiter sichtbar | Entwurf |

### 1.1 Grad B — Pseudonymisierung (Sofortpfad)

**Regelkonform und empfohlener Sofortweg**, weil er nichts am Draht-Protokoll
ändert:

- **Build-frei**, keine neue Primitive, keine Spore-Felder, `protocolVersion`
  bleibt `0.1`.
- **Briefkasten bleibt vollständig menschlich lesbar/auditierbar** — Token wie
  `[[KUNDE_1]]`, `[[IBAN_1]]` sind lesbar; Struktur, Herkunft, Signatur bleiben
  prüfbar (INTERFACES §11.1 kanonische Signier-Form gilt unverändert).
- **Schlüssel/Anker-Tresor verlässt den öffentlichen Kanal nie** — separat,
  menschlich übergeben. Verletzt **keine** Regel (insb. nicht die
  Auditierbarkeit §11.4).

**Ehrliche Grenze:** Pseudonymisierung ≠ Verschlüsselung. **Metadaten leaken**
weiter (Anzahl Datensätze, Frequenz, Beträge, Korrelationsmuster). Für Grad B
tragbar, solange der Anker-Tresor draußen bleibt. Für echte
Korrelations-Sensibilität braucht es Grad C.

### 1.2 Grad C — Versiegelter Umschlag (Zielform)

Passt zur Mycel-Philosophie: **serverlos, offline-first, build-frei,
WebCrypto-only**, sauber additiv.

---

## 2. Sealed-Box-Schema (Grad C, Entwurf für 0.2)

### 2.1 Primitive — alle in `crypto.subtle`, build-frei

| Schritt | Primitive | Verfügbar |
|---|---|---|
| Schlüsselpaar Empfänger | **X25519** (`X25519` / ECDH) | Browser-WebCrypto **und** `node:crypto` |
| ephemeres Schlüsselpaar Sender | **X25519** | dito |
| gemeinsames Geheimnis | **ECDH** (`deriveBits`) | dito |
| Schlüssel-Ableitung | **HKDF-SHA256** | dito |
| Nutzlast-Verschlüsselung | **AES-GCM-256** | dito (schon gelebt im Backup-Pfad) |

Reifegrad-Schwelle vergleichbar mit dem heute schon verlangten Ed25519 in
WebCrypto. **Fallback** vorsehen: ältere Engines ohne X25519 fallen auf Grad B
zurück (nicht auf Klartext-Zwang).

### 2.2 Norm: libsodium `crypto_box_seal`

Richtet sich an der gelebten **„sealed box"**-Form aus:

```
ephemeres X25519-Schlüsselpaar (epk, esk)  beim Sender, einmal pro Nachricht
shared   = ECDH(esk, recipientEncryptionPublicKey)
key      = HKDF-SHA256(shared, salt=∅, info="sbkim-sealed-box-v1") → 32 byte
iv       = crypto.getRandomValues(12 byte)
ct       = AES-GCM-256(key, iv, plaintext)          // 16-byte Auth-Tag inklusive
// esk wird nach dem Senden verworfen → Forward Secrecy pro Nachricht
```

Entschlüsselung beim Empfänger: `shared = ECDH(recipientEncryptionPrivateKey,
epk)`, gleiche HKDF-Ableitung, `AES-GCM`-Decrypt (Auth-Tag-Fail = ablehnen).

### 2.3 Umschlag-Format

Wiederverwendet das vorhandene Umschlag-Muster (Backup-Pfad: `{ kdf, cipher,
ciphertext }`) in kompakter Form und ergänzt den **ephemeren Pubkey** `epk`:

```json
{
  "v": 1,
  "epk": "<base64url-nopad, roher 32-Byte X25519-Pubkey>",
  "iv":  "<base64url-nopad, 12 byte>",
  "ct":  "<base64url-nopad, Ciphertext inkl. AES-GCM-Auth-Tag>"
}
```

- `v` — Umschlag-Version (nicht `protocolVersion`; erlaubt spätere Kurven-/KDF-Wechsel).
- Alle Binär-Felder **base64url ohne Padding** (RFC 4648 §5), wie überall im Mycel.

---

## 3. Spore-Feld `encryptionPublicKey` (Entwurf für 0.2)

**Signieren ≠ Verschlüsseln** — getrennte Schlüssel:

- Neues Spore-Feld **`encryptionPublicKey`** (X25519) **neben** `publicKey`
  (Ed25519). Beide roh, **base64url ohne Padding**.
- **Optional.** Eine Spore ohne `encryptionPublicKey` empfängt weiter Grad A/B;
  niemand wird ausgesperrt. Bei den `REQUIRED_SPORE_FIELDS` (INTERFACES §11.5)
  bleibt es **nicht** — kein Pflichtfeld.
- **Kanonische Signier-Form deckt es automatisch ab** (INTERFACES §11.1): das
  Feld geht — wie jedes andere — in die rekursiv alphabetisch sortierten
  kanonischen Bytes ein, ohne Sonderbehandlung. Die Signatur bezeugt also auch
  den Verschlüsselungs-Schlüssel.

---

## 4. Versionierung & Abwärtskompatibilität

- **`protocolVersion 0.1 → 0.2`**, Feld + Umschlag **optional**.
- Knoten ohne `encryptionPublicKey` bleiben voll teilnahmefähig (Grad A/B).
- **Spec-Hoheit für den Bump liegt bei Sage** (Spec-Hub) — formal gesetzt erst in
  der eigenen 0.2-Spec-Sitzung in `docs/INTERFACES.md`, **nicht** in diesem
  Entwurf.

---

## 5. Reihenfolge (bestätigt mit BLP)

1. **BLP wird Knoten** — echte Spore/`SIGNAL.json`, headless verifizierbar
   (INTERFACES §11.2 Vier-Prüfpunkte) → Stufe `verified-spore`, Eintrag in
   `sbkim/NETZ-STAND.md`.
2. **WorkFloh-Pairing** vom Hub aus.
3. **`0.2`-Entwurf an alle Knoten** zur Stellungnahme (Briefkasten,
   `SIGNAL.json` seq+1, `forNodes: ["*"]`), Klaus vermittelt → **Go je Knoten →
   dann Bau.**

**Grad B (Pseudonymisierung) läuft sofort und unabhängig** von dieser
Reihenfolge — er braucht weder Bump noch Bau.

---

## 6. Quittung an BLP (2026-06-19)

| Frage | Antwort |
|---|---|
| 1 — „Signatur ja, Verschlüsselung nein" absichtlich? | **JA** (so gewollt, kein fehlender Abschnitt) |
| 2 — Pseudonymisierungs-Zwischenweg mycel-konform? | **JA** (empfohlener Sofortpfad) |
| 3 — X25519-„versiegelter Umschlag" als Zielform? | **JA, mit Wie** (sealed box, § 2/§ 3) |
| 4 — Reihenfolge | **bestätigt** (§ 5) |

Weiterführung regulär über `sbkim/SIGNAL.json` + `sbkim/AUSTAUSCH-BookLedgerPro.md`
(Quittung via `ack`), **sobald BLP deployt ist**. Bis dahin menschlich vermittelt
(Klaus).
