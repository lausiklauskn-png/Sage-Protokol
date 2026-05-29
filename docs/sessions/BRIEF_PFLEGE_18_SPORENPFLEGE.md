# Brief — Modul 18 Sub (d)+(f)+(g) · Sporenpflege (Backup / Re-Spore / Re-Embedding)

**Sitzungs-Rolle:** Bau-Sitzung im Sage-Protokol-Repo. Baut die
Sporenpflege-Sub-Bereiche von Modul 18 auf: **Sub (d) Backup**,
**Sub (f) Sporen neu generieren**, **Sub (g) Re-Embedding**.

**Auslöser:** Klaus' Erkenntnis 2026-05-28 (Sporenpflege-Lehre, PULS
Vision-Anker): Ohne Pflege geht ein Knoten im Netz verloren oder muss
sich neu einbetten + neu handshaken. Das Ed25519-Schlüsselpaar ist die
*wahre Identität* (nodeId = base64url(sha256(publicKey))), die Spore nur
die signierte Visitenkarte. Drei Pflege-Pflichten ergeben sich daraus.

**Pipeline-Einordnung:** organischer Strang nach App-Freigabe, parallel
zur Modul-18-Voll-Spec (Phase A 5h.2) möglich. Nicht blockierend für
den aktuellen Handshake-/Match-Fix-Strang (PR #199/#202).

---

## Pflicht-Verifikations-Schritt (vor dem Code-Schreiben)

1. `git fetch origin && git checkout main && git pull origin main`.
2. Lesen (read-only, Kontext):
   - `docs/components/18_tool_pwa.md` § Sub (d) Backup, § Sub (f)
     Sporen neu generieren, § Sub (g) Re-Embedding (Schablonen-Texte).
   - `docs/PULS.md` § Vision-Anker „Sporenpflege-Lehre" (2026-05-28).
   - `docs/components/02_spore.md` — Identitäts-API + Backup-Export
     (Bau 02.X/02.Y): `getOrCreateIdentity`, `listIdentities`,
     `generateOwnSpore`, Backup-Export-/Import-Surface.
   - `docs/INTERFACES.md` § 1 Modul 02 (Backup-Schema + Multi-Identität)
     + § 1 Modul 03 (`embedPassage`) + § 1 Modul 05 (`handshake` —
     `ownDomainVector` optional seit 2026-05-28).
   - `src/modules/18_tool_pwa.js` Surface (`init`/`openAndockTab`/
     `close`/`isOpen`/`_meta`) + `tests/smoke_bau18_sub_a_vorab.mjs`.

---

## Pflicht-Disziplin (verbindlich)

- **Schlüssel zuerst.** Sub (d) Backup ist die **kritische** Pflege
  (Schlüsselverlust = Identitätsverlust = überall neu handshaken).
  Sub (f)/(g) sind wichtig, aber zweitrangig.
- **nodeId-Erhalt ist der rote Faden.** Re-Spore + Re-Embedding dürfen
  die nodeId **nicht** ändern (gleiches Schlüsselpaar, nur neuer
  `domainVector` + neue Signatur). Nur der explizite Voll-Reset (eigene
  Geste, deutliche Warnung) erzeugt eine neue Identität.
- **Knöpfe statt Konsole.** Jede Pflege-Operation als benannter
  Test-Bridge-Knopf in `tests/manual_check.html` Panel 18 mit
  `<pre>`-Output (kein Konsolen-Befehl für Klaus). Destruktive
  Operationen (Restore-Überschreiben, Voll-Reset) mit `confirm()`-
  Bestätigung.
- **KEIN Auto-Trigger.** Keine periodische Re-Embedding-Schleife, kein
  Auto-Backup ins Netz. Empfangsmodus-Prinzip gilt.
- **KEIN** `PROTOCOL_VERSION`-Bump (es sei denn das Spore-Schema ändert
  sich wirklich — dann erst INTERFACES-Tafel, dann Code).
- **Sicherheits-Aspekt prüfen:** Backup/Restore berührt Schlüssel-
  material. Falls die Sitzung als Schutz-relevant gewertet wird →
  `ZERTIFIKAT_ASPEKTE`-Eintrag in Modul 16 erwägen (Karte 16 § Sub d).

---

## Deine Aufgabe — drei Sub-Bereiche

### Sub (d) — Backup / Restore (kritisch, zuerst)

- **Export:** Schlüsselpaar + Spore(n) aller Slots als signiertes
  Backup-JSON (Modul 02 Backup-Export wiederverwenden, nicht neu
  bauen). Download-Knopf im Modul-18-Modal-Tab + Test-Bridge-Knopf.
- **Restore:** Backup-JSON einlesen → Schlüssel + Spore in IndexedDB
  zurückschreiben (slot-bewusst). `confirm()` vor Überschreiben einer
  vorhandenen Identität.
- **Verifikation:** nach Restore muss `getOrCreateIdentity().nodeId`
  identisch zur Backup-nodeId sein (Test-Punkt).

### Sub (f) — Sporen neu generieren (nodeId bleibt)

- `domainKeywords` / `domainDescription` / Kategorien ändern →
  `domainVector` über Modul 03 neu rechnen (siehe Sub g) →
  `SbkimSpore.generateOwnSpore(meta)` mit **gleichem** Schlüsselpaar →
  neue signierte `spore.json` (Download + Hinweis „nach
  `sbkim/spore.json` committen").
- Test-Punkt: nodeId vor/nach identisch, `domainVector` verändert,
  Signatur valide (`verifyForeignSpore` auf der eigenen Spore).

### Sub (g) — Re-Embedding (Modul 03 lazy)

- Kanonische Vektor-Ableitung **konsistent** zur Spore-Erzeugung
  halten: `embedPassage(domainDescription + '. ' + domainKeywords.join(', '))`
  (siehe Sage-Andock-Wizard `index.html` + Modul 05 nutzt
  `ownSpore.domainVector`). **Wichtig:** dieselbe Formel verwenden,
  damit `request.domainVector` und `senderSpore.domainVector` im
  Handshake übereinstimmen (Lehre aus Pflege 05+18 2026-05-28).
- Lade-Hinweis (~30 MB Modell), kein künstlicher Timeout.

---

## Tests

- `node --check src/modules/18_tool_pwa.js`.
- `tests/smoke_bau18_sub_a_vorab.mjs` (Regression, additiv erweitern um
  Backup-Roundtrip-Probe: Export → Restore → nodeId identisch).
- Panel 18 in `tests/manual_check.html`: neue Knöpfe pro Pflege-
  Operation (Export / Restore / Re-Spore / Re-Embedding / Voll-Reset).

---

## Pflicht am Sitzungsende

- `src/modules/18_tool_pwa.js` mit Sub (d)+(f)+(g).
- `docs/components/18_tool_pwa.md` § Sub (d)/(f)/(g) von Schablone auf
  Bau-Stand + § Bauzustand-Zeile.
- `docs/INTERFACES.md` § 1 Modul 18 Surface nachziehen (neue
  `open(subBereich)`-Pfade), falls die Surface wächst.
- Übergabeprotokoll + PULS-Eintrag.
- Commit + Push auf `claude/bau-18-sporenpflege`, Draft-PR mit
  Test-Plan + Sichttest-Schritten für Klaus.
- „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort.

---

## Querverweise

- Sporenpflege-Lehre: `docs/PULS.md` § Vision-Anker 2026-05-28.
- Identität/Backup: Modul 02 Bau 02.X (Backup-Export) + 02.Y
  (Multi-Identität), `docs/components/02_spore.md`.
- Handshake-Eigenvektor-Konsistenz: Pflege 05+18 2026-05-28
  (`docs/sessions/archiv/2026-05-28_pflege-05-18-handshake-eigenvektor.md`)
  — `embedPassage(domainDescription + '. ' + domainKeywords)` ist die
  kanonische Formel; Sub (g) muss sie spiegeln.
- Modul 18 9-Sub-Schablone: `docs/sessions/BRIEF_SPEC_18_TOOL_PWA.md`.
