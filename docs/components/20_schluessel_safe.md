# Modul 20 — Schlüssel-Safe (SBKIM-Identitäts-Safe)

> **Status: Code-Stub** (Spec 2026-06-20 PR #315 gemerged; Bau-Sitzung
> 2026-06-20, `src/modules/20_schluessel_safe.js` angelegt, Headless-Smoke
> `tests/smoke_bau20_safe.mjs` 19/19 grün). **Browser-Sichttest der Modal-UI
> durch Klaus ausstehend.**
>
> **Festgelegt (Klaus 2026-06-20):** Shamir **2 von 3** (N=3, k=2). Key-
> Extractability über das Passwort gelöst durch Modul 02 `exportBackup`
> (verschlüsselt die Identität passwortbasiert; der Safe speichert nur den
> Blob). BLP kanonische nodeId `MyHVM7Pd…` (wird festgeschrieben).
>
> **Auslöser (Klaus 2026-06-20):** Jeder Knoten soll seine SBKIM-Identität
> (nodeId + privater Knotenschlüssel + eigene Spore) in einem **lokal
> verschlüsselten Safe IM Repo** sichern — automatisch, mit zweistufiger
> Passwort-Abfrage, damit niemand bei jedem Siegel-/Mycel-Eintrag alles neu
> sichern muss. **Recovery via Shamir's Secret Sharing über das Passwort**
> (Nutzer verwahrt die Anteile selbst, das System fordert das aktiv ein).
> Vorbilder: Mein-Tresor (Mehrfach-Verschlüsselung), BookLedgerPro
> „Geheim-Fach" (Tresor-im-Tresor, zweistufiger Code).

---

## 1. Zweck & Problem

**Problem (belegt):** Identitäten „wandern". Mein-Rezeptbuch, Jasons-Tresor und
zuletzt BookLedgerPro (Screenshot 2026-06-20: App zeigt nodeId `ZrBxTuAr…`,
bei Sage registriert `MyHVM7Pd…`) haben ihre nodeId verloren/gewechselt, weil der
private Schlüssel nicht dauerhaft + wiederherstellbar gesichert war. Folge: alte
Spore + Hub-Eintrag werden ungültig, Re-Andock nötig, Reputation/Kontinuität weg.

**Lösung:** Ein **standardisierter, lokal verschlüsselter Schlüssel-Safe**, der
die Identität persistiert und **wiederherstellbar** macht — ohne den privaten
Schlüssel je zu übertragen.

**Leitbild (Klaus 2026-06-20):** eine App = **eine stabile** Identität. Der Safe
ist die technische Absicherung dieses Leitbilds. (Multi-Identität bleibt Reserve
für die Agenten-Schicht, nicht hier.)

---

## 2. Krypto-Kern (Wiederverwendung, kein neues Verfahren erfinden)

- **Verschlüsselung:** PBKDF2-SHA256 (≥ 600 000 Iterationen) → AES-GCM-256.
  Das ist **bereits in Modul 02** (`exportBackup(password)` / `importBackup`)
  implementiert und erprobt. Modul 20 nutzt diesen Kern, statt eigene Krypto zu
  bauen.
- **Klartext-Payload (im Safe verschlüsselt):** `{ nodeId, privateKeyJwk,
  publicKeyJwk, spore, createdAt, schemaVersion }` (+ optional Geschwister,
  analog Modul-02-Backup-Schema).
- **At Rest:** nur der **verschlüsselte Blob** liegt in IndexedDB (neuer Store
  `sbkim_safe`, Modul 01). Der private Schlüssel liegt **nie** im Klartext auf
  der Platte; im RAM nur, solange der Safe in der Sitzung „offen" ist.
- **Build-frei:** kein CDN, reine Web-Crypto + kleine eigene Shamir-Routine
  (siehe §4).

---

## 3. Öffnen auf Abruf & zweistufiges Passwort (UX)

**Name „Safe" (Klaus 2026-06-20):** der App-interne SBKIM-Identitäts-Speicher
heißt **Safe** — NICHT „Tresor". Grund: Mein-Rezeptbuch/Mein-Mixarium haben
schon einen JSON-Backup-„Tresor", und BLP hat seinen eigenen „Tresor"/Geheim-
Fach. „Tresor" bleibt für diese reserviert; unser App-interner Speicher = „Safe".

**KEINE Abfrage beim Seitenstart (Klaus 2026-06-20):** die App startet immer
normal. Der Safe ist ein Werkzeug **innerhalb** der App (Einstellungen/Tool) und
wird **auf Abruf** über `SbkimSafe.open()` geöffnet. `init()` setzt nur Konfig;
`autoPrompt` Default **false**.

- **`open()`** (Knopf in den Host-Einstellungen):
  - **Safe existiert** (`hasVault() === true`) → **Entsperr-Modal**: ein
    Passwort-Feld → `unlock(password)`. Bei Erfolg ist die Identität in der
    Sitzung verfügbar (Modul 02 lädt den Schlüssel).
  - **Kein Safe** (`hasVault() === false`) → **Einrichten-Modal**: Passwort
    **zweistufig** (Eingabe + **Wiederholung**), Mindestlänge ≥ 8 (analog BLP
    Geheim-Fach). Danach `createVault(password)` → verschlüsselt die aktuelle
    Identität (aus Modul 02) → speichert den Blob → **zeigt Shamir-Anteile** (§4).
- **Einbau-Konvention:** Der Host hängt einen „Safe"-Knopf in seine
  Einstellungen/Tool-Ansicht, der `SbkimSafe.open()` ruft. KEIN `init` mit
  `autoPrompt:true` in der normalen Start-Kette.
- **Falsches Passwort:** fail-soft, Fehlermeldung im Modal, kein Throw nach außen,
  kein Hinweis auf den Klartext.

---

## 4. Shamir-Recovery (über das Passwort — Klaus-Entscheidung 2026-06-20)

- **Was geteilt wird:** das **vom Nutzer gewählte Passwort** (nicht der Schlüssel
  direkt). Mit den Anteilen wird das Passwort rekonstruiert → entschlüsselt den
  Safe. Das Passwort bleibt der Hauptweg; Shamir ist der Notfall-Pfad.
- **Schema:** Shamir's Secret Sharing über **GF(256)**, Schwelle **k von N**.
  Vorschlag-Default **N = 3, k = 2** (konfigurierbar via init). Anteil-Format:
  `v1.<index>.<base64url(share-bytes)>` (versioniert, selbst-beschreibend).
- **Aktive Einforderung (wichtig, Klaus):** Nach `createVault` zeigt das Modal die
  N Anteile mit **Kopier-/Download-Knopf** und verlangt eine **bewusste
  Bestätigung** („Ich habe die Anteile gesichert"), bevor es schließt. Optional
  später: periodische Erinnerung, wenn keine Bestätigung vorliegt.
- **Recovery-Flow:** `recoverPassword(shares[])` mit ≥ k Anteilen → rekonstruiert
  das Passwort → `unlock()`. Reines Lokal-Verfahren, kein Netz.
- **Grenze (ehrlich):** Wer **Passwort UND** ausreichend Anteile verliert, kann den
  Safe **nicht** wiederherstellen — by design (Zero-Knowledge, kein Hintertür-
  Server). Das Modal sagt das nüchtern.
- **Implementierungs-Hinweis:** Shamir korrekt über GF(256) ist heikel — die Bau-
  Sitzung schreibt einen eigenen Headless-Smoke (split→combine round-trip,
  k-1 Anteile reichen NICHT, k Anteile reichen, beliebige k-Teilmengen).

---

## 5. Datenschutz (BLP-Sonderfall, gilt für alle)

- Der Safe speichert **ausschließlich SBKIM-Identität/Schlüssel** — **keine**
  App-/Buchhaltungs-/Personendaten. Strikte Trennung von App-Daten.
- Privater Schlüssel + Passwort + Shamir-Anteile **verlassen nie das Gerät** und
  gehen **nie** über Briefkasten/Spore/Netz.
- Das Siegel + die Spore tragen weiterhin nur nodeId/publicKey/Domäne/Vektor/
  Signatur (kein PII). Der „Mycel"-Button fügt nur das Selbst-Siegel + die
  Visitenkarten-Spore ein.
- Für datenschutz-sensible Knoten (BLP): der Safe ist **additiv** zu deren
  eigener Verschlüsselung (Geheim-Fach) — er ersetzt sie nicht, er sichert die
  SBKIM-Identität nach demselben Muster.

---

## 6. Vorgeschlagene Schnittstelle (finalisiert in der Bau-Sitzung)

**Umgesetzte Schnittstelle (Bau 2026-06-20):**
```
window.SbkimSafe = {
  init(options?)            -> Promise<void>   // autoPrompt Default false, shamirN/K, mountSelector
  open()                   -> Promise<void>   // Safe-Modal AUF ABRUF (Einstellungen/Tool)
  hasVault()               -> Promise<boolean>
  isUnlocked()             -> boolean (sync)
  createVault(password)    -> Promise<{ shares: string[] }>   // wirft bei schwachem PW
  unlock(password)         -> Promise<boolean>
  lock()                   -> void
  recoverPassword(shares)  -> string | null                   // null wenn < k / ungültig
  _meta                    // { storeName, minPasswordLen, ready, unlocked, shamirN, shamirK }
}
```

- **options:** `{ autoPrompt?: boolean (Default true), shamirN?: number (3),
  shamirK?: number (2), mountSelector?: string }`.
- **Fehler-Klassen (Factory-Stil, analog Modul 00/08):**
  `WeakPasswordError`, `PasswordMismatchError`, `VaultExistsError`,
  `VaultNotFoundError`, `InvalidShareError`, `ShamirThresholdError`.
- **Garantien:** kein Klartext-Schlüssel at rest; idempotenter `init()`;
  fail-soft Auto-Prompt; deterministischer Shamir-Round-Trip; kein Netz-Pfad.

---

## 7. Verhältnis zu bestehenden Modulen

- **Modul 02 (Spore):** liefert Identität + Krypto-Kern (`exportBackup`/
  `importBackup`). Modul 20 ist die **Persistenz-/Recovery-/UX-Schicht** darüber.
  Identitäts-Erzeugung bleibt Modul 02.
- **Modul 01 (Storage):** neuer Store `sbkim_safe` (additive DB-Migration).
- **Modul 16 (Siegel):** der „🔑"-Pfad (eigene Spore erzeugen/signieren) und der
  Safe greifen ineinander — der Safe sichert genau die Identität, die der
  🔑-Pfad erzeugt. Kein Konflikt.
- **Modul 09 (Einbau-PWA):** Andock-Schritt bekommt einen Safe-Init-Schritt.

---

## 8. Offene Punkte für die Bau-Sitzung

- Endgültige N/k-Defaults + ob konfigurierbar im UI.
- Private-Key-Extractability: Ed25519-Schlüssel muss `extractable:true` erzeugt
  werden, damit er in den Safe exportiert werden kann — Sicherheits-Abwägung
  dokumentieren (Modul 02 prüfen, ggf. Migration bestehender Identitäten).
- Periodische „Anteile gesichert?"-Erinnerung: jetzt oder Folge-Pflege.
- Endknoten mit eigenem Vault (BLP Geheim-Fach): Adapter vs. eigenes Modul-20-
  Mount — pro Endknoten entscheiden.
- ZERTIFIKAT_ASPEKTE-Eintrag (Modul 16) bei Bau ergänzen (Sicherheits-Modul-
  Konvention).

---

## 9. Pipeline

1. **Spec-Karte** (diese Datei) — Klaus prüft.
2. **Bau-Sitzung Modul 20** in Sage (Krypto-Kern + Shamir + Auto-Prompt-UI +
   Headless-Smokes). Branch `claude/bau-20-schluessel-safe`.
3. **Sichttest** Klaus (Safe einrichten / entsperren / Recovery mit Anteilen).
4. **Netzweite Verteilung** via Relay-Briefe (BLP zuerst, datenschutz-sauber),
   dann übrige Endknoten — eigener Brief pro Repo.
