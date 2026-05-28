# Übergabeprotokoll · 2026-05-28 · Pflege 05+18 Handshake — Eigenvektor-Auflösung (Lösung 1)

**Branch:** `claude/pflege-05-18-handshake-eigenvektor`
**Sitzungs-Rolle:** Pflege-Sitzung. Korrigiert den Ansatz von PR #201
(Handshake-Eigenvektor) auf Basis eines Befunds der Mein-Mixarium-
Bausitzung + tieferer Wurzel-Analyse.
**Auslöser:** MM-Bericht 2026-05-28 (PR #63 MM gemergt). MM hat Modul 18
1:1 aus Sage main übernommen, Match-Fix (PR #199) live grün, aber
Schritt-4-Handshake warf „ownDomainVector muss Float32Array(384) sein".
MM hält die 1:1-Regel ein und wartet auf den Sage-Fix.

---

## Wurzel-Diagnose (tiefer als PR #201)

`SbkimAnastomose.handshake(targetSpore, ownDomainVector, options?)`:
- `_doHandshake` (`src/modules/05_anastomose.js`) **sendet**
  `ownDomainVector` als `request.domainVector` mit (Z. 736) **und** die
  signierte eigene Spore als `senderSpore` (Z. 740).
- Beide müssen **denselben** Vektor tragen, sonst ist der Request in
  sich widersprüchlich (Empfänger nimmt `request.domainVector`,
  Z. 1040).
- Der signierte Spore-`domainVector` entsteht (Sage-Andock-Wizard,
  `index.html` Z. 3332) aus
  `embedPassage(domainDescription + '. ' + domainKeywords.join(', '))`.

PR #201 hatte Modul 18 einen **frischen** Vektor
`embedPassage(domainKeywords.join(", "))` rechnen lassen — das ergibt
einen **anderen** Vektor als die Spore → der gesendete
`request.domainVector` hätte nicht zur mitgesendeten `senderSpore`
gepasst. PR #201 hat den Sofort-Throw beseitigt, aber eine subtile
Inkonsistenz eingeführt.

Zusätzlich braucht `_doHandshake` die eigene Spore ohnehin (Z. 721,
zum Signieren). Sie trägt den kanonischen `domainVector` bereits — es
gibt keinen Grund, einen frischen zu rechnen.

---

## Entscheidung (Klaus, 2026-05-28): „Lösung 1"

**Modul 05 löst den Eigenvektor selbst auf.** Begründung für die
Forker-Tauglichkeit: jeder Aufrufer (Modul 18, künftige Tool-PWA-Sub-
Bereiche, Forker-Code) ruft einfach `handshake(fremdSpore)` und bekommt
automatisch den korrekten, signierten Vektor — die ganze Fehlerklasse
(falscher/fehlender Eigenvektor) wird unmöglich. Single source of truth.
Tafel-Eingriff klein + rückwärtskompatibel.

---

## Was getan

### Eingriff A — `src/modules/05_anastomose.js` `_doHandshake`

`ownDomainVector` ist jetzt **optional**. Bei `undefined`/`null` →
`loadOwnDomainVector(opSlot)` (liest `ownSpore.domainVector` →
Float32Array(384), nutzt den vorhandenen Helfer Z. 393). Liefert der
null (keine Spore / kein domainVector) → `AnastomoseDependenciesError`
„Eigene Spore noch nicht erzeugt … generateOwnSpore(meta) zuerst".
Explizit übergebener Vektor wird weiter streng als Float32Array(384)
validiert + honoriert (Tests / Spezialpfade).

### Eingriff B — `src/modules/18_tool_pwa.js` `triggerStepFourHandshake`

Wieder schlank: `anaMod.handshake(foreignSporeCache)` ohne 2. Argument,
kein `embedPassage` mehr in Schritt 4. (Revert des PR-#201-Blocks.)

### Tafel — `docs/INTERFACES.md` § 1 Modul 05

`handshake(targetSpore, ownDomainVector?, options?)` — `ownDomainVector`
als optional markiert + Auflöse-Verhalten + Fehlerfall dokumentiert
(heilige Tafel, rückwärtskompatibel).

### Doku

- `docs/components/05_anastomose.md` § Schnittstelle: Signatur +
  Auflöse-Hinweis.
- `docs/components/18_tool_pwa.md` § Sub (a) Schritt 4: Modul 18 ruft
  `handshake(foreignSpore)`, Modul 05 löst auf; Voraussetzung eigene
  Spore. § Bauzustand: neue Zeile (korrigiert PR-#201-Zeile).

### Test

`tests/smoke_bau18_sub_a_vorab.mjs` Probe 18 umgestellt: prüft jetzt
`handshake(foreignSpore)` OHNE 2. Argument (Arg2 `undefined`) + Arg1 =
Foreign-Spore + **kein** `embedPassage` in Schritt 4 → **18/18 grün**.

---

## Tests

- `node --check src/modules/05_anastomose.js` → grün.
- `node --check src/modules/18_tool_pwa.js` → grün.
- `tests/smoke_bau18_sub_a_vorab.mjs` → 18/18 grün.
- `tests/smoke_bau05y_transparent_slot_pfad.mjs` → **nicht lauffähig im
  Sandbox** (`fake-indexeddb` nicht installiert, scheitert beim Import
  vor jeder Logik) — Modul-05-Auflöse-Pfad headless ungeprüft. Logik
  trivial (vorhandener `loadOwnDomainVector`-Helfer, opSlot bereits
  geladen). Klaus' Browser-Sichttest deckt den Live-Pfad ab.

---

## Antwortbrief an die MM-Sitzung (a–d)

- **a)** Modul 05 fixt (Lösung 1, auto-resolve aus eigener Spore).
  Modul 18 wieder schlank.
- **b)** Soll-Kontrakt: `handshake(targetSpore, ownDomainVector?,
  options?)` — `ownDomainVector` optional; weggelassen → Auflösung aus
  eigener Spore; explizit → Float32Array(384) honoriert; keine Spore →
  AnastomoseDependenciesError.
- **c)** Sage-Runtime-Eigen-Spore: Sage-Page Schwarz-Loch-Karte →
  Sage-Andock-Wizard, Schritt-2-Knopf (`sage-andock-step2-btn`) ruft
  `generateOwnSpore` → persistiert die Eigen-Spore in IndexedDB
  (slot=main). MM hat ihr Pendant `__sbkimErzeugeSpore()`.
- **d)** PR dieser Sitzung (Nummer in der Sitzungs-Antwort) — MM re-synct
  die dann gemergte main-Revision von `src/modules/18_tool_pwa.js`
  **und** `src/modules/05_anastomose.js`.

---

## Strikte Disziplin

- Modul 05 + INTERFACES-Tafel bewusst geändert (Tafel-Evolutions-Klausel,
  Klaus' Entscheidung „Lösung 1" eingeholt). Rückwärtskompatibel.
- KEIN VERSION-Bump, KEIN ZERTIFIKAT_ASPEKTE-Eintrag.
- KEIN externer Repo-Eingriff (MR + MM re-syncen selbst).
- Sporen-Reinigung/Neubildung (Klaus' Frage) NICHT hier umgesetzt —
  eigenes Thema (Modul 18 Sub (f)/(g)), separater Brief auf Wunsch.

---

## Sichttest-Status

**Ungeprüft — wartet auf Klaus.** Voraussetzung: Sage-Knoten hat seine
Eigen-Spore via Sage-Andock-Wizard erzeugt. Dann Schritt 4 erneut:
erwartet „Handshake erfolgreich" statt Vektor- bzw. „Eigene Spore"-Fehler.

---

## Nächster sinnvoller Schritt

1. **Sage-Eigen-Spore erzeugen** (Sage-Andock-Wizard) — Voraussetzung
   für jeden ausgehenden Handshake vom Sage-Knoten.
2. **Klaus' Schritt-4-Sichttest** nach Hard-Reload.
3. **MR + MM Re-Sync** beider Dateien (18 + 05) nach Merge + Sichttest.
4. **Optional:** Brief für Sporen-Reinigung/Neubildung (Modul 18 Sub f/g).
