# Übergabeprotokoll · 2026-05-16 · Spec-Sitzung — Modul 02 Backup-Export (Identitäts-Persistenz Stufe 2)

**Sitzungs-Rolle:** Spec-Sitzung, headless, EINE Phase. Branch
`claude/spec-02-backup-export-cn828`. Folge-Spec direkt nach der
Pflege Storage-Persist 2026-05-16 (PR #51), gleicher Tag. Greift
Stufe (2) der drei-stufigen Identitäts-Persistenz-Architektur aus
PULS § Offene Querschnitts-Fragen „Identitäts-Persistenz" auf.

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B
(Spec-Sitzung).

**Module:** ausschließlich 02 (Spore — Karte + Vertrag).
Module 00 / 01 / 03 / 04 / 05 / 06 / 07 / 08 ausdrücklich nicht
angefasst. Stufe (1) (Modul 01) und Stufe (3) (Modul 00) zitiert,
nicht aufgebrochen.

---

## Auftrag

Klaus' Sorge aus § Offene Querschnitts-Fragen „Identitäts-Persistenz":
tiefes Browserspeicher-Löschen oder ein Browser-Wechsel tötet die
nodeId endgültig. Drei Stufen wurden zusammen vorgesehen:

- Stufe (1) `navigator.storage.persist()` — **gelöst 2026-05-16**
  (Pflege Storage-Persist Stufe 1, PR #51).
- Stufe (2) Backup-Export passwort-verschlüsselt — **diese Sitzung**.
- Stufe (3) Quota-Frühwarnung — schon spec (Modul 00,
  `DOKU_QUOTA_WARN_RATIO=0.80` / `_BYTES=50 MiB` aus §0); bleibt
  offen, bis Stufe (2) angeschlossen ist.

Klaus' Wunsch: eine `*.sbkim-backup.json`-Datei extern speichern
können (Cloud, USB-Stick, E-Mail an sich selbst), damit ein tiefes
Browserspeicher-Löschen oder ein Wechsel des Browsers / Geräts die
nodeId nicht endgültig tötet. Ohne Backup-Pfad ist Stufe (1)
allein zerbrechlich: persist() ist eine Bitte, keine Garantie —
Safari sagt meist `false`, Firefox prompt-abhängig, Chrome auto-bei-
PWA. Und selbst bei `true` kann der Nutzer manuell den
Browserspeicher löschen.

**Reine Spec-Sitzung — KEIN Code in `src/`.** Bau-Sitzung 02.X
folgt als eigene Phase, nachdem Klaus die drei Pflicht-Fragen
dieser Spec gesehen hat (sie sind hier verbindlich entschieden,
falls Klaus sich anders entscheidet, korrigiert das eine kleine
Folge-Pflege).

---

## Drei Pflicht-Fragen — verbindliche Entscheidung mit Begründung

Die Spec-Sitzungen 00 und 08 haben die Konvention eingeführt,
Pflicht-Fragen ausführlich im Übergabeprotokoll zu begründen.
Diese Spec übernimmt das Format.

### Pflicht-Frage 1 — Backup-Inhalt

> Welche Stores gehen in welcher Form ins Backup?
>
> (a) Nur Identität: `sbkim_keys["main"]` + `sbkim_spore["main"]`.
> (b) Identität + Geschwister: zusätzlich `sbkim_siblings`.
> (c) Voller Snapshot: alle `sbkim_*`-Stores inkl. Vermächtnis-Inbox,
>     Anastomosis-Log, Heterokaryose-Inbox/Outbox.

**Entscheidung: (b) Identität + Geschwister.**

Verankert in §0-Konstante `BACKUP_PAYLOAD_SCHEMA_VERSION = 1` (modul-
lokal in Karte 02 § Konfigurationswerte) und im Karten-Block § Storage
„Backup-Inhalt" (Tabelle mit drei Stores).

**Begründung (vier Punkte):**

1. **(a) ist zu sparsam — re-handshake-Kosten widersprechen dem
   Empfangsmodus-Prinzip.** Wenn das Backup nur die Identität enthält,
   muss Klaus nach jedem Restore alle Geschwister neu kennenlernen.
   Das Anastomose-Modul (05) macht das technisch sauber — aber jeder
   Re-Handshake ist eine Eigenanfrage ins offene Netz. CLAUDE.md
   („Kein Crawler, keine Pulsation, keine Eigenanfragen ins offene
   Netz") und das Paper sind streng: Der Knoten ist Empfangsmodus
   mit Antwortrecht. Wenn Klaus nach einem Browser-Wechsel sofort
   wieder zu allen alten Geschwistern anklopfen muss, ist das eine
   Sequenz, die nicht durch eine Spore-Empfang ausgelöst wurde — es
   ist eine Klaus-getriebene Eigenanfrage. Variante (b) macht aus
   dieser Sequenz eine einmalige Restore-Operation: Klaus' Knoten
   weiß sofort wieder, wer seine Geschwister sind, und wartet
   passiv, dass die Geschwister sich wieder melden (oder dass Klaus
   gezielt einzelne re-handshakt, wenn nötig).

2. **(c) ist zu üppig — transient/audit-Stores haben keinen
   Wiederherstellungs-Wert.** Das Anastomose-Log (`sbkim_anastomosis_log`)
   ist eine Begegnungs-Spur, keine Konfiguration. Die Vermächtnis-
   Inbox (`sbkim_legacy_inbox`) sammelt Apoptose-Nachrichten anderer
   Knoten — interessant für Modul 10 (Reputation) später, aber kein
   Knoten-Bestandteil. Die Heterokaryose-Inbox/Outbox
   (`sbkim_hetero_inbox`/`sbkim_hetero_outbox`) sind Anker-Pools, die
   Klaus pro PWA-Endknoten manuell pflegt (Modul 08) — ein
   Browser-Wechsel ist nicht automatisch ein PWA-Wechsel; die
   Heterokaryose-Anker bleiben im Endknoten-UI definierbar. Die
   Doku-Meta (`sbkim_doku_meta`) ist Modul-00-internes Sichttest-
   Protokoll, völlig irrelevant für Identitäts-Wiederherstellung.
   Variante (c) bläht die Backup-Datei mit Schema-Drift-Risiko auf
   (jeder neue Store wird automatisch Backup-Pflicht) und macht das
   Backup-Format zur Falle bei jeder Spec-Evolution.

3. **(b) ist der semantische Sweet Spot — „Identität + Netzwerk-
   Mitgliedschaft".** `sbkim_siblings` enthält genau das, was nach
   einem Restore Wert hat: die Liste der Knoten, mit denen Klaus
   schon verbunden war, inkl. ihres `pubKey` (für Signatur-
   Verifikation eingehender Anfragen ohne neuen Handshake) und
   `endpoint` (für gezielten Re-Handshake, falls nötig). Plus das
   additive `heterokaryosisOptIn`-Feld (Spec-Sitzung 06/08), das
   Klaus pro Geschwister manuell gesetzt hat — das wäre nach
   Variante (a) verloren.

4. **(b) ist Backup-Größen-vertretbar.** Eine Spore ist ~1–2 KiB;
   ein Sibling-Eintrag ~500 Bytes (publicKey JWK ~250 Bytes plus
   nodeId/domain/endpoint/since/Flag). Bei realistisch 5–20
   Geschwistern liegt das Backup bei ~5–15 KiB; PBKDF2 + AES-GCM
   addieren ~50 Bytes Wrapper-Overhead plus base64url-Aufblähung
   (4/3 ≈ 1,33). Die `*.sbkim-backup.json`-Datei landet bei
   ~10–25 KiB — passt in jede E-Mail, jeden Cloud-Ordner, jeden
   USB-Stick. Variante (c) würde bei aktivem Knoten leicht auf
   100+ KiB klettern (Vermächtnis-Inbox und Heterokaryose-Inbox
   wachsen monoton).

**Konkrete Schema-Folge:** Klartext-Payload (vor AES-GCM-
Verschlüsselung, Schema-Version 1) enthält genau:

```jsonc
{
  "createdAt":  "<ISO-8601 UTC>",
  "nodeId":     "<base64url-sha256-rawpub>",      // Plausibilitäts-Anker
  "keys":       { keyId, privateKey JWK, publicKey JWK },
  "spore":      { /* vollständige SporeJson inkl. signature */ },
  "siblings":   [ { nodeId, domain, endpoint, pubKey, since, heterokaryosisOptIn? }, … ]
}
```

`siblings` ist fail-soft beim Export — wenn der Store leer oder
nicht vorhanden ist (Knoten hat noch keinen Handshake gemacht),
ist es ein leeres Array, kein Fehler.

### Pflicht-Frage 2 — PBKDF2-Iterations

> (a) 100 000 — alt-OWASP (2017), schnell auch auf low-end Android.
> (b) 600 000 — OWASP-Empfehlung 2023+ für PBKDF2-SHA256.
> (c) 1 000 000 — paranoider, sichtbar langsam auf low-end.

**Entscheidung: (b) 600 000.**

Verankert in INTERFACES.md §0 als `BACKUP_KDF_ITERATIONS = 600000`.

**Begründung (drei Punkte):**

1. **(a) ist veraltet — OWASP-Stand 2017.** Die ursprüngliche OWASP-
   Empfehlung von 100 000 für PBKDF2-SHA256 ist seit 2023 offiziell
   überholt. Moderne GPUs schaffen 100 000 Iterationen in Bruchteilen
   einer Sekunde; ein Offline-Bruteforce mit einem Wörterbuch-
   Angriff auf ein 8-Zeichen-Passwort ist bei 100 000 Iterationen
   für einen ernsthaften Angreifer in Tagen-Bereich machbar.
   `BACKUP_PASSWORD_MIN_LEN = 8` ist eine sehr niedrige Schwelle
   (siehe Pflicht-Frage „Passwort-Schwäche" in § Risiken); die
   Iterations-Konstante muss diese Schwäche teilweise kompensieren.

2. **(c) ist zu paranoid für low-end Android — Klaus' Tablet leidet
   darunter.** Klaus arbeitet primär an einem Galaxy Tab S6 mit DeX
   (Eruda-Pfad in Karte 09 dokumentiert). Auf älteren ARM-Chips kann
   1 000 000 Iterationen PBKDF2-SHA256 leicht 3–5 Sekunden Aufruf-
   Zeit bedeuten — sichtbar langsam beim Export/Import. Der
   Sicherheits-Gewinn von 1 000 000 gegenüber 600 000 ist marginal
   (~0,7 Bit zusätzliche Entropie); die UX-Kosten sind höher.

3. **(b) ist Industrie-Standard und auf low-end vertretbar.** OWASP
   2023+ empfiehlt 600 000 für PBKDF2-SHA256 als Mindest-Schwelle für
   Disk-Encryption-Pfade. Aufruf-Zeit auf low-end Android ~1–2 s,
   auf Desktop < 0,5 s — beides für eine einmalige Backup-
   Operation (Klaus exportiert ein Backup pro Quartal oder bei
   größeren Änderungen) absolut vertretbar. Die Konstante ist
   bewusst in §0 (nicht modul-lokal), damit eine spätere
   Sicherheits-Pflege sie zentral anheben kann, ohne den Code zu
   berühren — Bau-Sitzung 02.X liest `BACKUP_KDF_ITERATIONS` zur
   Laufzeit, kein literal-600000 im Code.

**Hinweis zur Kompatibilität:** Erhöhung der Konstante in einer
späteren Pflege-Sitzung ist additiv und braucht KEINEN Hauptversions-
Sprung — der `iterations`-Wert steht IM Backup-Blob (`kdf.iterations`),
nicht nur in §0. Alte Backups mit `kdf.iterations: 100000` ließen
sich auch nach einer §0-Erhöhung weiter importieren; nur neue
Exports nutzen die neue Schwelle. Bau-Sitzung 02.X muss das
respektieren (lesen aus `kdf.iterations`, nicht aus §0 — die §0-
Konstante ist nur Export-Default).

### Pflicht-Frage 3 — Import-Überschreibung bei bestehender Identität

> (a) Per Default werfen (`BackupOverwriteError`); Aufrufer muss
>     explizit `{force: true}` mitgeben.
> (b) Per Default überschreiben; Aufrufer muss explizit
>     `{force: false}` mitgeben, um vorab zu prüfen.

**Entscheidung: (a) Per Default werfen.**

Verankert in Karte 02 § Schnittstelle (`importBackup`-Doc-Block,
`options.force` Default `false`), § Fehlerverhalten (neue Zeile
`BackupOverwriteError`), § Risiken (neuer Punkt „Sicherheits-Schwelle
bei Import-Überschreibung") und in INTERFACES.md §1 Modul 02
Fehlerverhalten-Block.

**Begründung (vier Punkte):**

1. **Identitäts-Überschreibung ist destruktiver als Self-Apoptose.**
   Bei Self-Apoptose (Modul 07) bekommen alle bekannten Geschwister
   eine signierte Vermächtnis-Nachricht — sie wissen, dass der
   Knoten weg ist, und vergessen ihn ordentlich. Bei stiller
   Identitäts-Überschreibung wechselt die `nodeId` der laufenden
   PWA, ohne dass irgendjemand außer Klaus es weiß. Geschwister, die
   die alte nodeId in ihrem `sbkim_siblings` haben, behandeln den
   Knoten nach Überschreibung als unbekannt — `receiveHandshake`
   wirft `outcome:"rejected", reason:"Sender ist kein Geschwister"`
   für jeden Heterokaryose-Pull, und der TTL-Sweep aus Modul 07
   räumt die alte nodeId nach `SIBLING_MAX_AGE_MS` (30 Tage)
   ohnehin auf. Das ist ein „toter Knoten ohne Vermächtnis" — exakt
   das, was Modul 07 § Risiken „stille Löschung" als Anti-Muster
   benennt.

2. **Recovery-Pfad nach Browserspeicher-Cleanup greift ohne `force`.**
   Wenn der Browserspeicher tatsächlich gelöscht wurde (Klaus' echter
   Recovery-Fall), ist `sbkim_keys["main"]` leer — die Vor-Check-
   Schwelle in `importBackup` ist nicht ausgelöst, der Import läuft
   ohne `force`. Variante (a) verteuert also nicht den eigentlichen
   Recovery-Pfad, sie schützt nur den Sonderfall „PWA hat aktive
   Identität, Klaus klickt versehentlich auf eine falsche Backup-
   Datei" oder „Klaus testet im falschen Tab".

3. **`{force:true}` ist ein expliziter Klick, kein Code-Verstecken.**
   Die UX in Bau-Sitzung 02.X wird in Panel 02 (`tests/manual_check.html`)
   einen Knopf „Backup einlesen" haben, der zuerst ohne `force`
   versucht. Bei `BackupOverwriteError` zeigt das Panel eine
   Bestätigungs-Zeile mit der alten nodeId vs. der nodeId aus dem
   Backup („Identität ersetzen?") und einen zweiten Knopf
   „Identität ersetzen — unwiderruflich". Klaus sieht beide nodeIds
   nebeneinander, bevor er bewusst überschreibt. Das ist die zwei-
   stufige Konvention aus Modul 07 `prepareSelfApoptose` →
   `confirmSelfApoptose` (60-s-Token-Pfad), nur ohne den Token (weil
   `importBackup` keinen serverseitigen State braucht — die UI-
   Schicht macht die Bestätigung).

4. **Variante (b) ist asymmetrisch riskant.** Bei `{force:false}` als
   nicht-default müsste Bau-Sitzung 02.X eine zweistufige Aufrufer-
   Konvention erzwingen, die niemand sieht, der die Signatur liest.
   Eine Helper-Funktion oder ein Endknoten-Wrapper könnte aus
   Bequemlichkeit `force` weglassen und die Identität zerstören —
   das ist genau die „silent foot-gun"-Klasse, die Spec-Sitzung 07
   beim Self-Apoptose-Pfad (Token-TTL 60 s, Reason-String muss
   matchen) bewusst vermieden hat. Variante (a) macht die Falle
   sichtbar — wer überschreiben will, muss es buchstabieren.

---

## Was getan wurde

### 1. Karte 02 (`docs/components/02_spore.md`)

- **§ Schnittstelle** Block direkt nach `resetIdentityCache()`:
  `exportBackup(password) → Promise<SbkimBackupBlob>` und
  `importBackup(blob, password, options?) → Promise<{restored, reason?}>`
  mit ausführlichen API-Doc-Blöcken (Pflicht-/Optional-Parameter,
  Pflicht-/Optional-Rückgabefelder, Wirft-Liste, Konvention zu
  internem `resetIdentityCache()`-Aufruf nach erfolgreichem
  `restored:true`).
- **Selbstcheck-Funktionsliste** auf zehn Funktionen erweitert
  (`init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache/exportBackup/importBackup`).
- **§ Datenformat** neuer Sub-Block „Backup-Format (SbkimBackupBlob)"
  zwischen „Kanonische Serialisierung" und „Storage". Wrapper-Schema
  (`version`, `kdf`-Block mit `algorithm:"PBKDF2"`/`hash:"SHA-256"`/
  `iterations:600000`/`salt:base64url-16`, `cipher`-Block mit
  `algorithm:"AES-GCM-256"`/`iv:base64url-12`, `ciphertext:base64url`,
  `payload-schema-version:1`) + Klartext-Payload-Schema mit
  Identitäts-Anker `nodeId` + `keys` + `spore` + `siblings`-Array +
  verbindliche KDF-/Encrypt-Pfade.
- **§ Storage** Tabelle unverändert; neuer Hinweis-Block „Backup-
  Inhalt" mit drei-Spalten-Tabelle (Store / Modul 02 als / Backup-
  Inhalt) — Identität Pflicht, Geschwister fail-soft, fünf andere
  Stores bewusst nicht im Backup.
- **§ Konfigurationswerte** neue Sektion (zwischen § Datenformat und
  § Fehlerverhalten) mit sechs-Zeilen-Konstanten-Tabelle.
- **§ Fehlerverhalten** sechs neue Tabellen-Zeilen
  (`InvalidBackupPasswordError`, `BackupDecryptError`-Sammel,
  `BackupVersionMismatchError`, `BackupSchemaError`,
  `BackupOverwriteError`, `NoIdentityError`-Durchreichung) +
  Anschluss-Absatz „Backup-Fehler werfen, sind keine
  `{valid:false}`-Antworten".
- **§ Risiken** drei neue Bullet-Punkte: „Passwort-Schwäche",
  „Sicherheits-Schwelle bei Import-Überschreibung", „Backup-
  Aktualität".
- **§ Bauzustand** neue Zeile „Spec Backup-Export Stufe 2".

### 2. INTERFACES.md §0

Drei neue Konstanten direkt nach `DOKU_QUOTA_WARN_BYTES`:

```
BACKUP_FORMAT_VERSION    = 1            // Modul 02, Spec-Sitzung Backup-Export Stufe 2; …
BACKUP_KDF_ITERATIONS    = 600000       // Modul 02, Spec-Sitzung Backup-Export Stufe 2; OWASP 2023+
BACKUP_PASSWORD_MIN_LEN  = 8            // Modul 02, Spec-Sitzung Backup-Export Stufe 2; untere Schwelle
```

`BACKUP_PAYLOAD_SCHEMA_VERSION`, `BACKUP_KDF_SALT_BYTES`,
`BACKUP_CIPHER_IV_BYTES` sind bewusst modul-lokal (Karte 02
§ Konfigurationswerte) — sie sind WebCrypto-Konventionen ohne
Querschnitts-Relevanz. Nur Hauptversion, Iterations und Mindest-
Länge landen in §0, weil Modul 12 Blocklist später ein eigenes
Backup-Format spezifizieren darf und dann dieselben Querschnitts-
Werte teilen kann.

### 3. INTERFACES.md §1 Modul 02

- **Bietet-Block** um `exportBackup` und `importBackup` erweitert
  (siehe Karte 02 § Schnittstelle für Detail).
- **Selbstcheck-Format-Zeile** auf zehn Funktionen erweitert.
- **Nutzt-Block** um `SbkimStorage.all` (Sibling-Lese-Pfad beim
  Export) und vier neue WebCrypto-Aufrufe erweitert
  (`importKey("raw")` für Passwort als KDF-Input, `deriveKey`
  PBKDF2 → AES-GCM, `encrypt`, `decrypt`, `getRandomValues`).
  Storage-Block unverändert (Backup ist Aufrufer-extern, geht in
  keinen SBKIM-Store — Klaus speichert die `.sbkim-backup.json`
  außerhalb der PWA).
- **Fehlerverhalten-Block** sechs neue Zeilen.
- **Geprüft-Zeile** um 2026-05-16 (Spec-Sitzung Backup-Export
  Stufe 2) erweitert.

### 4. INTERFACES.md §2 Spore-JSON

Hinweis-Block am Ende des „Verifikations-Pfad"-Sub-Blocks:
„Backup-Format ist separat (siehe §1 Modul 02 + Karte 02 §
Datenformat / Backup-Format). Spore und Backup teilen sich nur
den Identitäts-Schlüssel-Inhalt; das Wrapper-Schema lebt auf einer
separaten Schicht. **KEINE Spore-Feld-Erweiterung**;
`PROTOCOL_VERSION` bleibt `"0.1"`."

Bewusste Trennung: Backup ist eine Klaus-Operation (lokales
Snapshot-Format, externe Speicherung), Spore ist eine Knoten-zu-
Knoten-Operation (signierte Visitenkarte). Mischung würde das
Spore-Format mit lokalen Wartungs-Werten verschmutzen.

### 5. INTERFACES.md §6 Änderungsprotokoll

Neue Zeile am unteren Ende.

### 6. PULS

- **§ Offene Querschnitts-Fragen „Identitäts-Persistenz"** Stufe (2)
  mit „Spec fertig 2026-05-16"-Hinweis erweitert + Verweis auf
  dieses Übergabeprotokoll. **NICHT** mit strikethrough markiert,
  weil der Querschnitt erst gelöst ist, wenn Code da ist (Bau-
  Sitzung 02.X folgt). Stufe (3) bleibt unverändert offen.
- **§ Spore-Persistenz-Strategie verteilt** Modul-02-Punkt
  „Backup-Export" mit Spec-Vermerk + Bauauftrag-Hinweis erweitert.
- **Schnellüberblick-Tabelle** Modul 02 Spec-Spalte um „Pflege Spec
  Backup-Export Stufe 2 2026-05-16" + Backup-Details (PBKDF2/AES-
  GCM, drei §0-Konstanten, fünf Error-Klassen, Bau-Sitzung 02.X
  ausstehend) erweitert.
- **§ Sitzungs-Einträge** rotiert: dieser Eintrag oben, Pflege
  Storage-Persist in den Archiv-Index verschoben (PULS-Länge fällt
  von 735 auf 612 Zeilen — sauber unter dem 700-Ziel).
- **§ Archiv-Index** neue Zeile oben (diese Spec-Sitzung).

### 7. Übergabeprotokoll

Diese Datei.

---

## Was bewusst nicht angefasst wurde

- **`src/modules/02_spore.js`** unverändert. Bau-Sitzung 02.X ist
  eigene spätere Phase. Spec ist additiv im Karten-Vertrag — der
  Code in `getOrCreateIdentity` / `generateOwnSpore` /
  `verifyForeignSpore` / `resetIdentityCache` bleibt unberührt.
- **`src/modules/00_doku_fenster.js`** unverändert. Stufe (3) Quota-
  Frühwarnung (§0-Konstanten `DOKU_QUOTA_WARN_RATIO` / `_BYTES`) ist
  schon spec; Karte 02 § Risiken „Backup-Aktualität" zitiert die
  Stufe, bricht sie aber nicht auf. Eine spätere „Persistenz-
  Strategie verbinden"-Pflege darf Modul 00 um eine „Backup
  empfohlen"-Zeile erweitern, wenn `_meta.storagePersisted === false`
  ODER Quota-Frühwarnung greift — nicht Teil dieser Spec.
- **`src/modules/01_storage.js`** unverändert. Stufe (1)
  `navigator.storage.persist()` ist gelöst (2026-05-16); Karte 02 § Risiken
  „Backup-Aktualität" zitiert die Stufe, Karte 01 § Risiken
  „Persist-Verweigerung" wird in der Querschnitts-Frage Stufe (2)-
  Bauauftrag nicht aufgebrochen.
- **`src/modules/03_embedding.js` / `04_match.js` / `05_anastomose.js`
  / `06_heterokaryose.js` / `07_apoptose.js` / `08_ui_demo.js`**
  unverändert. Backup ist Modul-02-intern.
- **`docs/components/00_doku_fenster.md`** unverändert.
- **`docs/components/01_storage.md`** unverändert.
- **INTERFACES.md §2 Spore-JSON Pflicht-/Optional-Felder** unverändert
  — Backup-Format ist separate Schicht, kein Spore-Eingriff. Auch
  KEIN neuer Sub-Block für Backup-Format in §2 (er steht in §1 Modul
  02 und Karte 02; §2 ist „Datenformate Querschnitt — über das Netz",
  Backup geht nicht über das Netz).
- **`PROTOCOL_VERSION`** bleibt `"0.1"` (keine Spore-Erweiterung).
- **`DB_VERSION`** bleibt `3` (kein neuer Store, kein Schema-Eingriff;
  Backup ist Aufrufer-extern).
- **`BACKUP_FORMAT_VERSION = 1`** ist eigene additive Versionierung,
  startet bei 1, unabhängig von `PROTOCOL_VERSION` und `DB_VERSION`.
- **`status.json`** unverändert (Modul 02 bleibt `score:"stub"`;
  Spec-Erweiterung im Karten-Vertrag, kein Score-Wechsel).
- **`update_puls_pie.py`** NICHT aufgerufen (kein Modul-Score-
  Wechsel; CLAUDE.md-Konvention).
- **`tests/manual_check.html`** unverändert (Panel 02 fünfter/
  sechster Knopf für `exportBackup`/`importBackup` entstehen in
  Bau-Sitzung 02.X — Spec-Sitzung schreibt keine UI-Knöpfe).
- **`index.html`** (Sage-Page) unverändert.
- **Karten 14 / 10 / 11 / 12** unangetastet.
- **Andock-Versuch** nicht unternommen (Spec-Sitzung, kein Bau-Auftrag).

---

## Validierung

- **Spec-Sitzung — kein Code, kein `node --check`-Aufruf nötig.**
- **Cross-Reading durchgezogen** auf Konsistenz zwischen:
  - Karte 02 § Schnittstelle ↔ INTERFACES.md §1 Modul 02 Bietet-Block
    (Funktionsnamen + Parameter + Rückgabe-Form passen).
  - Karte 02 § Konfigurationswerte ↔ INTERFACES.md §0 (`BACKUP_*`-
    Konstanten-Werte passen 1:1 für die drei §0-Konstanten).
  - Karte 02 § Datenformat „Backup-Format" ↔ Karte 02 § Storage
    „Backup-Inhalt" (was im Klartext-Payload steht, kommt aus den
    drei Stores).
  - Karte 02 § Fehlerverhalten ↔ INTERFACES.md §1 Modul 02
    Fehlerverhalten-Block (fünf Error-Klassen-Namen passen).
  - Karte 02 § Risiken „Sicherheits-Schwelle Import-Überschreibung"
    ↔ Karte 02 § Schnittstelle `importBackup`-Doc-Block ↔ Karte 02
    § Fehlerverhalten `BackupOverwriteError` (Pflicht-Frage 3
    Variante a konsistent dreifach erwähnt).
  - PULS § Offene Querschnitts-Fragen „Identitäts-Persistenz"
    Stufe (2) ↔ § Spore-Persistenz-Strategie verteilt ↔ Schnellüber-
    blick-Tabelle Modul 02 Spec-Spalte (alle drei verweisen auf
    diese Sitzung mit konsistenten Daten).
- **CLAUDE.md-Vorgaben respektiert:**
  - Spec-Sitzung schreibt kein JS in `src/`.
  - `update_puls_pie.py` nicht aufgerufen (kein Score-Wechsel).
  - Keine personenbezogenen Daten in Code / Specs / Tests / PULS.
  - Antworten auf Deutsch, ruhig + präzise.

---

## Was offen blieb

### Bau-Sitzung 02.X — Backup-Export Code-Stub

`src/modules/02_spore.js` muss um folgende Bauteile erweitert
werden (additiv, kein Refactoring der bestehenden sieben+`resetIdentityCache`-
Funktionen):

1. **Fünf neue Error-Klassen** (im Factory-Stil analog Modul 00 /
   08): `InvalidBackupPasswordError`, `BackupDecryptError`,
   `BackupVersionMismatchError`, `BackupSchemaError`,
   `BackupOverwriteError`. Auf `window.SbkimSpore.*` exportiert.
2. **Drei Helper-Funktionen** (modul-lokal, Closure):
   - `canonicalJsonStringify(obj)` — kann reused werden, falls die
     bestehende Spore-Signatur-Helper schon dieselbe Funktion baut
     (Bau-Sitzung prüft, ob ein DRY-Pfad möglich ist; sonst zweite
     Implementation analog Modul 05/06/07 — die kanonische-Sort-
     Disziplin ist verbindlich identisch).
   - `base64urlEncode(buffer)` / `base64urlDecode(string)` —
     vermutlich schon vorhanden für Spore-Signatur, sonst nachziehen.
   - `derivePbkdf2AesGcmKey(password, salt, iterations)` — neuer
     WebCrypto-Helper, baut den AES-GCM-Key aus dem Passwort.
3. **Zwei öffentliche Funktionen** `exportBackup` und `importBackup`
   exakt nach Karte 02 § Schnittstelle. Wichtig:
   - `exportBackup` ruft `getOrCreateIdentity()` (existierend) für
     den `nodeId`-Anker im Klartext-Payload, liest `sbkim_keys["main"]`
     direkt für die JWK-Form, liest `sbkim_spore["main"]` direkt für
     die `sporeJson`, ruft `SbkimStorage.all("sbkim_siblings")` mit
     try/catch (fail-soft → leeres Array bei `UnknownStoreError`
     oder leerem Store).
   - `importBackup` macht den Vor-Check für `BackupOverwriteError`
     **vor** dem Crypto-Aufruf (PBKDF2 ist teuer; ein Vor-Check
     spart die Iterations-Kosten). Nach erfolgreichem Decrypt +
     Schema-Check ruft `importBackup` `resetIdentityCache()` als
     letzten Schritt — sonst liefert `getNodeId()` weiter die alte
     nodeId aus dem Cache, trotz frisch geschriebener Identität.
4. **Selbstcheck-Zeile** auf zehn Funktionen erweitern.
5. **Panel 02 in `tests/manual_check.html`** zwei neue Knöpfe:
   - „Backup exportieren" (öffnet Prompt für Passwort, ruft
     `exportBackup`, zeigt die `.sbkim-backup.json`-Datei zum
     Download an).
   - „Backup einlesen" (öffnet File-Picker + Passwort-Prompt, ruft
     `importBackup` zuerst ohne `force`, bei `BackupOverwriteError`
     zeigt eine Bestätigungs-Zeile mit alter und neuer nodeId und
     einen zweiten Knopf „Identität ersetzen — unwiderruflich").
6. **Smoke-Test** (vermutlich Node mit stub-`crypto.subtle` oder
   manuell im Browser): Export → Import in leerer PWA → nodeId
   gleich nach Restore. Export → Import in PWA mit anderer Identität
   → `BackupOverwriteError` ohne `force` → Erfolg mit `force:true`,
   nodeId nach Restore = Backup-nodeId. Falsches Passwort →
   `BackupDecryptError`. Korruptes Blob → `BackupDecryptError`.

Geschätzt ~60–90 Min headless.

### Stufe (3) Quota-Frühwarnung

Modul 00 hat die §0-Konstanten `DOKU_QUOTA_WARN_RATIO = 0.80` und
`DOKU_QUOTA_WARN_BYTES = 50 MiB` verankert; das Doku-Fenster zeigt
eine Warnzeile. Querschnitts-Anker „Identitäts-Persistenz" lässt
Stufe (3) offen, bis Stufe (2) durch Bau-Sitzung 02.X angeschlossen
ist — dann darf eine kleine „Persistenz-Strategie verbinden"-
Pflege das Doku-Fenster um eine „Backup empfohlen"-Zeile erweitern
(wenn `_meta.storagePersisted === false` ODER Quota-Schwelle
greift). Klein, ~30 Min headless.

### Klaus' Sichttest entfällt für diese Spec

Spec-Sitzung erzeugt keine UI-Knöpfe, also nichts zu klicken. Erst
nach Bau-Sitzung 02.X bringt Panel 02 die zwei neuen Knöpfe, und
Klaus' Browser-Lauf bringt die echte Plattform-Antwort (PBKDF2-
Aufruf-Zeit auf seinem Tab S6 vs. Desktop, AES-GCM-Verhalten in
Safari iOS).

### Übrige offene Punkte aus Pflege Storage-Persist

Unverändert offen:
- Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch mit PWA-Suffix.
- `status.json` `pingStatus`-Update nach Re-Andock.
- Cross-Knoten-Handshake zwischen beiden Endknoten.
- Eruda-Rückbau in beiden Endknoten nach erstem Cross-Handshake.
- Mini-Pflege „Sushi-Kategorie sichtbar machen" in Mein-Mixarium.
- INTERFACES.md §6 Tabellen-Bug aus PR #45 Squash-Merge.
- Klaus' Sichttest Panel 06 (Heterokaryose).
- Klaus' Sichttest Panel 01 fünfter Knopf „Persist-Status zeigen".

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung 02.X — Backup-Export Code-Stub** in
   `src/modules/02_spore.js`. *Headless möglich*. Geschätzt
   ~60–90 Min. Briefing-Vorlage: BRIEFING_TEMPLATE.md §C (Bau-
   Sitzung), Modul-Nummer 02, Modul-Name spore.
2. **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** mit
   PWA-Suffix aus Pflege 2026-05-16 (unverändert offen, *nicht
   headless*, wartet auf Klaus am Termux).
3. **Cross-Knoten-Handshake** nach Re-Andock.
4. **Folge-Pflege „Persistenz-Strategie verbinden"**, sobald Bau
   02.X durch ist — Modul 00 Doku-Fenster optional um eine „Backup
   empfohlen"-Zeile erweitern. Damit ist der Querschnitt
   „Identitäts-Persistenz" final gelöst und kann mit
   ~~strikethrough~~ markiert werden.

---

## Material aus der Sitzung

**Backup-Format (SbkimBackupBlob) — Wrapper-Beispiel:**

```jsonc
{
  "version": 1,
  "kdf": {
    "algorithm":  "PBKDF2",
    "hash":       "SHA-256",
    "iterations": 600000,
    "salt":       "AAECAwQFBgcICQoLDA0ODw"
  },
  "cipher": {
    "algorithm": "AES-GCM-256",
    "iv":        "AAECAwQFBgcICQoL"
  },
  "ciphertext":            "VGhpc0lzVGhlRW5jcnlwdGVkUGF5bG9hZEJ1ZmZlcg",
  "payload-schema-version": 1
}
```

**Klartext-Payload-Beispiel** (vor AES-GCM-Verschlüsselung,
kanonisch sortierte Keys):

```jsonc
{
  "createdAt": "2026-05-16T12:00:00.000Z",
  "keys": {
    "keyId":      "main",
    "privateKey": { "crv": "Ed25519", "d": "…", "kty": "OKP", "x": "…" },
    "publicKey":  { "crv": "Ed25519", "kty": "OKP", "x": "…" }
  },
  "nodeId": "1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0",
  "siblings": [
    {
      "domain":              "mixarium.example.org",
      "endpoint":            "https://lausiklauskn-png.github.io/Mein-Mixarium/",
      "heterokaryosisOptIn": true,
      "nodeId":              "<peerNodeId>",
      "pubKey":              { "crv": "Ed25519", "kty": "OKP", "x": "…" },
      "since":               "2026-05-16T10:30:00.000Z"
    }
  ],
  "spore": {
    "createdAt":       "2026-05-16T08:00:00.000Z",
    "domain":          "rezeptbuch.example.org",
    "domainVector":    [ 0.012, -0.034, /* … 384 floats … */ ],
    "embeddingModel":  "Xenova/multilingual-e5-small",
    "endpoint":        "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/",
    "guestCategories": ["Begleitgetränke", "Weinkarte"],
    "id":              "1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0",
    "nodeType":        "hybrid",
    "protocolVersion": "0.1",
    "publicKey":       { "crv": "Ed25519", "kty": "OKP", "x": "…" },
    "signature":       "…",
    "stammCategories": ["Vorspeisen", "Fleisch", "Fisch", "Vegetarisch"]
  }
}
```

**Größen-Schätzung** für ein realistisches Klaus-Backup (Identität
+ Spore mit `domainVector` + 5 Geschwister):

- Klartext-Payload: ~5–8 KiB (überwiegend `domainVector`
  384×float-Form als JSON-Zahlen).
- AES-GCM-Ciphertext: identisch zur Klartext-Größe + 16 Byte
  Auth-Tag.
- base64url-Aufblähung: × 4/3 ≈ × 1,33.
- Wrapper-JSON: ~150 Bytes.
- **Gesamt-Datei: ~7–11 KiB.** Passt überall hin.

**Commit dieser Sitzung:** TBD (folgt am Sitzungs-Ende).

**Branch:** `claude/spec-02-backup-export-cn828`.

**PR:** wird am Sitzungs-Ende als Draft erstellt.
