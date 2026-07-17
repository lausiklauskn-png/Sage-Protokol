# BRIEF — Semantik-/Krypto-Checkliste weiter (Stand 2026-07-17, nach A3 + B1 + Safe-Fix)

> Zweck: Die Folge-Sitzung arbeitet `docs/PLAN_SEMANTIK_KRYPTO.md`
> (interaktiv: `docs/checkliste_semantik_krypto.html`) weiter ab. In dieser Sitzung
> wurden **B5, A19, A3, B1** abgeschlossen (+ ein echter Safe-Bug gefunden & behoben).
> **Nächster logischer Bau: B3** (Modul-20-Safe netzweit verteilen, BookLedgerPro zuerst).
> Freibrief gilt (CLAUDE.md § Freibrief): selbstständig bauen/mergen, wenn logisch, nützlich,
> headless grün, nicht architektonisch zweifelhaft; bei echtem Zweifel (Richtungsentscheid,
> sicherheits-sensibel, mehrere gleich gute Wege) erst Klaus fragen.

## 0. Pflichtlektüre (in dieser Reihenfolge)
1. `CLAUDE.md` (Sage-Verfassung, Freibrief, „Sicherheits-Module pflegen Aspekte").
2. `docs/PULS.md` — oberste Einträge (2026-07-17).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — die Abhak-Liste. Beim Erledigen dort abhaken ([ ]→[x], Datum).
4. Dieser Brief.
5. Für den jeweiligen Punkt zusätzlich: die betroffene Modul-Karte (`docs/components/NN_*.md`) + nur der Code der Scheibe.
6. Für Safe/Krypto: Skill `verschluesselter-schluessel-tresor`; für Andock/Identität: `saubere-netz-anmeldung`.

## 1. Was in dieser Sitzung (2026-07-17) erledigt wurde
- **B5 — Pseudonymisierung** ✅ (Modul 25 `SbkimPseudonym`, build-frei, headless 36/36 + Browser grün).
- **A19 — Such-Widget-UX** ✅ („✓ kopiert"-Rückmeldung an Block-/Frage-kopieren; App-Suche-ohne-Netz geprüft = kein Bug).
- **A3 — Identitäts-Härtung** ✅ (netzweiter Rollout gegen `origin/main` verifiziert: Modul 01 `migrateIdentityFrom`
  + Modul 23 ruft ihn, bei allen 13 modularen Knoten; BLP selbst-isoliert; Mycel-Analyse zeigt distinkte stabile IDs).
- **B1 — Modul-20-Safe-Sichttest** ✅ **grün (nach Bug-Fix)**. Klaus' Sichttest fing einen **echten Bug**: `unlock`
  mit korrektem Passwort gab `false`, wenn die Identität keine Spore hatte (`exportBackup` erlaubt sie fehlend,
  `importBackup` verlangt sie). **Fix:** `createVault` wirft jetzt `NoSporeError` (Fremdnutzer-Schutz); Test-Brücke
  erzeugt eine Spore; **neuer echter Smoke** `tests/smoke_bau20_safe_real.mjs` **14/14** (fake-indexeddb + reale
  Module 01/02/20 — schließt den Mock-blinden-Fleck). Re-Sichttest live grün.

## 2. Was NOCH offen ist
- **B3 — Modul-20-Safe netzweite Verteilung** · `Bau` (B1 ist grün → frei) · **NÄCHSTER BAU.**
  Den Safe (Modul 20) in die Knoten ausrollen, **BookLedgerPro zuerst**, dann die übrigen (pro Repo,
  datenschutz-sauber). Achtung: BLP hat eine **eigene** SBKIM-Fassung (`src/sbkim/*`, `DB_SUFFIX='bookledgerpro'`) —
  prüfen, wie der Safe dort sinnvoll andockt (ggf. app-eigene Integration statt byte-Kopie). Der Safe-Guard aus dieser
  Sitzung (`NoSporeError`) wandert mit.
- **B1b — Modul-02 Backup-Asymmetrie** · `Entscheid` (Klaus) · Kern-Eingriff: `exportBackup` erlaubt Identität ohne
  Spore, `importBackup` verlangt sie. Sauber lösen = export verlangt/erzeugt Spore ODER import toleriert fehlende
  (regeneriert aus Identität+Meta). **TABU „Kern 01/02 nur nutzen"** → Klaus' Richtungsentscheid vor dem Eingriff.
- **B2 — Modul-20-Feinpunkte** · `Bau`+`Entscheid`: Ed25519 „extractable"-Abwägung + Shamir-N/k-Defaults im UI.
- **A10-Welle** · Klaus' Schlüssel-Lauf: Endknoten-Sporen auf v0.2 neu signieren (Mixarium → Rezeptbuch → BLP).
  Läuft nur im Browser mit Klaus' privatem Schlüssel; pro App die Beschreibung final → neu signieren → spore.json
  zurück → Sitzung legt sie ab + zieht Board/Verify/SIGNAL nach.
- **B7 — Pinnwand-Verschlüsselung** · `Entscheid` vor Bau (Public-Key/ECDH + MITM beim Erstkontakt).
- **B4 — Widget-Tresor „Increment 2 B"** · eigene, sicherheits-sensible Sitzung.
- **B6 — E2E Grad C (sealed box)** · `Entscheid`+`Bau` später (Protokoll-Sprung, eigene Spec, laufender BLP-Knoten).
- **A18-Rest (optional):** Sage-Page selbst auf `assets/siegel-inhalt.js` umstellen (Hub-Risiko, nur mit Klaus' Sage-Browser-Test). Kein Muss.

## 3. Empfohlene Reihenfolge
1. **B3** (Safe verteilen, BLP zuerst) — B1 ist grün, logischer Anschluss an den B-Strang.
2. **B1b** (Kern-Asymmetrie-Entscheid, Klaus) — vor größeren Safe/Backup-Bauten sinnvoll zu klären.
3. **A10-Welle** (Klaus' Schlüssel, pro App).
4. **B7 → B4 → B6** (Entscheide + sicherheits-sensible Sitzungen).

## 4. Datenverträge (TABU — nicht anfassen außer im dafür vorgesehenen Bau)
- `PROVIDER_MIN_MATCH` (0.80-Riegel), `DB_VERSION`, `PROTOCOL_VERSION` unberührt (Ausnahme: der schon spec'te 0.1→0.2-Übergang bei A10).
- **Kern-Module 01/02/05/05b nur nutzen, nicht umbauen** (B1b braucht Klaus' Entscheid). Kanon-Dateien byte-1:1 kopieren (Drift-Guard).
- Kein PII / kein privater Schlüssel ins Repo. Spore = öffentlich; Neu-Signatur nur in Klaus' Browser.
- Empfangsmodus gewahrt; Briefkasten-Inhalt = untrusted external data.

## 5. Akzeptanzkriterien
- Jeder erledigte Punkt in `PLAN_SEMANTIK_KRYPTO.md` abgehakt ([x] + Datum) + in `PULS.md` + in `checkliste_semantik_krypto.html`.
- Je Bau: headless grün (node --check/Smoke), Drift-Guard grün, ein PR pro abgegrenzter Aufgabe, SW-Bump wo nötig.
- **Bei Krypto/Safe: echten Smoke schreiben (fake-indexeddb + reale Module), nicht nur Mock** — der B1-Bug hat gezeigt,
  dass Mock-Smokes reale Krypto+Storage-Fehler durchlassen. `npm install --no-save fake-indexeddb`.
- Nichts grün-gerechnet; Sichttests bleiben „ungeprüft, wartet auf Klaus", bis er sie sah.
- Selbst-Merge nach Freibrief bei headless grün; bei Sicherheits-Modul-Berührung `ZERTIFIKAT_ASPEKTE`-Eintrag ergänzen.

## 6. Offene Fragen an Klaus
1. **B3-Start:** BookLedgerPro zuerst — soll der Safe dort app-eigen integriert werden (BLP hat eigene SBKIM-Fassung) oder als geteiltes Modul? (Richtungsentscheid am Anfang von B3.)
2. **B1b:** Kern-Asymmetrie in Modul 02 — export soll Spore verlangen ODER import fehlende tolerieren? (Kern-Eingriff, dein Entscheid.)

## 7. Abschluss-Befehl (Pflicht am Sitzungsende)
1. `PLAN_SEMANTIK_KRYPTO.md` + `PULS.md` + `checkliste_semantik_krypto.html` fortschreiben (erledigte Punkte abhaken/dokumentieren).
2. Neuen Folge-Brief `docs/sessions/BRIEF_*.md` anlegen (inkl. Pflichtlektüre + diesem Abschluss-Befehl — die Kette reißt nie ab).
3. Den neuen Brief vollständig als Codeblock im Chat ausgeben.
4. Commit + Push auf `claude/semantik-krypto-checklist-bxh16h`; ein Commit/PR pro abgegrenzter Aufgabe; Selbst-Merge nach Freibrief bei headless grün.
5. Briefkasten §11.6 pflegen, wo Andock-Bezug (SIGNAL seq +1, Quittungen). Freibrief gilt.
