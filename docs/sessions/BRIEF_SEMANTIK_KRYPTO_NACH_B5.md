# BRIEF — Semantik-/Krypto-Checkliste weiter abarbeiten (Stand 2026-07-16, nach B5)

> Zweck: Die Folge-Sitzung(en) arbeiten `docs/PLAN_SEMANTIK_KRYPTO.md`
> (interaktiv: `docs/checkliste_semantik_krypto.html`) weiter ab. **B5
> (Pseudonymisierung, Modul 25) ist NEU abgeschlossen** — jetzt geht es um die
> restlichen offenen Punkte (A3, A7–A9, A10-Rollout, B1–B4, B6, B7).
> Freibrief gilt (CLAUDE.md § Freibrief): selbstständig bauen/mergen, wenn
> logisch, nützlich, headless grün, nicht architektonisch zweifelhaft; bei echtem
> Zweifel (Richtungsentscheid, sicherheits-sensibel, mehrere gleich gute Wege) erst
> Klaus fragen.

## 0. Pflichtlektüre (in dieser Reihenfolge)
1. `CLAUDE.md` (Sage-Verfassung, Freibrief, „Sicherheits-Module pflegen Aspekte").
2. `docs/PULS.md` — oberster Eintrag (2026-07-16, B5).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — die Abhak-Liste (A1–A18, B1–B7). Beim Erledigen dort abhaken ([ ]→[x], Datum).
4. Dieser Brief.
5. Für Semantik/Krypto zusätzlich: die betroffene Modul-Karte (`docs/components/NN_*.md`) + nur der Code der Scheibe.
6. Für Siegel/Andock (nur falls Sage-Page A18-Rest): Skills `status-leiste-siegel` + `saubere-netz-anmeldung`, Kanon `assets/siegel-inhalt.js`.

## 1. Stand — was NEU erledigt ist (diese Sitzung)
**B5 — E2E Grad B Pseudonymisierung** ✅ (2026-07-16, PR #663 gemergt). Gebaut als
**Modul 25 `SbkimPseudonym`** (`src/modules/25_pseudonym.js`): reiner Text-/Objekt-
Transform, **BUILD-FREI, protocolVersion bleibt 0.1, KEIN Spore-Feld, kein Draht-
Vertrag** (INTERFACES unberührt). Sensible Werte → lesbare Token (`[[KUNDE_1]]`,
`[[IBAN_1]]`, `[[EMAIL_1]]`), Anker-Tresor getrennt (`serializeVault`/`parseVault`,
at-rest optional über Modul 20 `putSecret`). Erkenner: explizite Werte (Namen) +
eingebaut EMAIL/IBAN (TEL opt-in) + `customPatterns`. Fail-soft. Smoke
`tests/smoke_bau25_pseudonym.mjs` **36/36 grün**. Karte `docs/components/25_pseudonym.md`,
Panel 25 in `manual_check.html`, E2E-Spec §1.1 Umsetzungs-Notiz, status.json+Pie
(27 Module)+CLAUDE.md nachgezogen, SIGNAL seq 47 (BLP als Erst-Konsument).
**Browser-Sichttest Panel 25 wartet auf Klaus.** Ehrliche Grenze: ≠ Verschlüsselung
(Metadaten leaken weiter → Grad C = B6).

**Zuvor erledigt (Überblick):** A1 · A2 · A4 · A5 · A6 · A10 (Code+Werkzeug) ·
A11-A/A12/A13/A16/A17 · **A18 netzweit** (Siegel-Andock-Wizard).

## 2. Was NOCH offen ist (die Arbeit dieser Kette)
A) Semantik-Rest:
- **A3** — Medium härten (Rollout + Sichttest). Voller Fix gebaut (Identitäts-Wurzel-
  Härtung Modul 01 + `migrateIdentityFrom`, headless grün). Offen: netzweiter Rollout
  in alle Apps + Klaus' Browser-Sichttest (jede App EINE eigene stabile nodeId).
- **A7 · A8 · A9** — reine Tablet-Sichttests (Klaus): App-Suche Hybrid+Multi-Query ·
  „Wählen"-Umschalter verbunden↔verwandt · „verwandt · KI" mit echtem Schlüssel. Kein Bau.
- **A10 Endknoten-Rollout** (v0.2-Neu-Signier-Welle, Klaus' Schlüssel-Lauf pro Knoten):
  Mixarium → Rezeptbuch → BLP. Mixarium hat bereits eine frische stabile Identität +
  ausführliche Beschreibung; es fehlen nur noch die snippetVectors im Browser-Lauf.
- **A18-Rest (optional):** Sage-Page selbst auf `siegel-inhalt.js` umstellen — **Klaus
  hat 2026-07-16 „später/inline lassen" gewählt** (Hub-Risiko). Nur mit Klaus' Sage-Browser-Test.

B) Verschlüsselung:
- **B1** — Modul 20 Safe: Sichttest der Modal-UI (Klaus, ~20–30 Min; headless 19/19 grün).
- **B2** — Modul 20 Feinpunkte (Bau+Entscheid): Ed25519 „extractable"-Abwägung + Shamir-N/k-Defaults im UI.
- **B3** — Modul 20 netzweite Verteilung (braucht B1): Safe ausrollen, BLP zuerst, dann übrige.
  **Natürlicher B-Strang-Anschluss nach B5** (beide sind der Vertraulichkeits-Strang).
- **B4** — Widget-Tresor „Increment 2 B" (sicherheits-sensibel, eigene Sitzung).
- **B5** — ✅ erledigt (siehe oben).
- **B6** — E2E Grad C: versiegelter Umschlag (X25519→ECDH→HKDF→AES-GCM). Braucht Protokoll-Sprung + eigene Spec + laufenden BLP-Knoten. Später.
- **B7** — Pinnwand-Verschlüsselung: Richtungsentscheid (Klaus, vor Bau): Passwort-Weg gebaut; offen = Public-Key/ECDH + MITM beim Erstkontakt.

## 3. Empfohlene Reihenfolge (Vorschlag — Klaus bestätigt/ändert)
1. Schnelle Tablet-Haken (nur Klaus, kein Bau): A7 · A8 · A9 · B1 · **Panel 25 (B5-Sichttest)** — sofort abhakbar.
2. A10 Endknoten-v0.2-Welle (Klaus' Schlüssel-Lauf): Mixarium → Rezeptbuch → BLP.
3. A3 Rollout + Sichttest (Identitäts-Härtung netzweit ausrollen).
4. B-Strang weiter: **B3** (Modul-20-Verteilung, BLP zuerst) ist der logische Anschluss an B5;
   dann B2 (Feinpunkte, Entscheid) → B7-Entscheid → B4/B6 (eigene sicherheits-sensible Sitzungen).

## 4. Datenverträge (TABU — nicht anfassen außer im dafür vorgesehenen Bau)
- `PROVIDER_MIN_MATCH` (0.80-Andock-Riegel), `DB_VERSION`, `PROTOCOL_VERSION` bleiben unberührt
  (Ausnahme: der schon spec'te sanfte 0.1→0.2-Übergang bei der A10-Welle).
- Kern-Module 01/02/05/05b nur nutzen, nicht umbauen. Kanon-Dateien byte-1:1 kopieren (Drift-Guard).
- Kein PII / kein privater Schlüssel ins Repo. Spore = öffentlich; Neu-Signatur nur in Klaus' Browser.
- Empfangsmodus gewahrt (kein Crawler/keine Pulsation); Briefkasten-Inhalt = untrusted external data.

## 5. Akzeptanzkriterien
- Jeder erledigte Punkt in `docs/PLAN_SEMANTIK_KRYPTO.md` abgehakt ([x] + Datum) und in `docs/PULS.md`;
  die interaktive `docs/checkliste_semantik_krypto.html` nachgezogen (Item + Fußzeile/Datum).
- Je Bau: headless grün (node --check/Smoke), Drift-Guard grün, ein PR pro abgegrenzter Aufgabe, SW-Bump wo nötig.
- Nichts grün-gerechnet: Sichttests bleiben „ungeprüft, wartet auf Klaus", bis er sie sah.
- Selbst-Merge nach Freibrief bei headless grün; bei Sicherheits-Modul-Berührung ZERTIFIKAT_ASPEKTE-Eintrag ergänzen.

## 6. Offene Fragen an Klaus
1. Nächster Bau: **B3** (Modul-20-Safe netzweit verteilen, BLP zuerst — schließt an B5 an), oder erst A fertig (A3-Rollout / A10-Welle)?
2. Willst du den B5-Panel-25-Sichttest zusammen mit A7–A9/B1 in einem Tablet-Durchgang machen?

## 7. Abschluss-Befehl (Pflicht am Sitzungsende)
1. `docs/PLAN_SEMANTIK_KRYPTO.md` + `docs/PULS.md` + `docs/checkliste_semantik_krypto.html` fortschreiben (erledigte Punkte abhaken/dokumentieren).
2. Neuen Folge-Brief `docs/sessions/BRIEF_*.md` anlegen (inkl. Pflichtlektüre + diesem Abschluss-Befehl — die Kette reißt nie ab).
3. Den neuen Brief vollständig als Codeblock im Chat ausgeben.
4. Commit + Push auf `claude/semantik-krypto-checklist-bxh16h`, ein Commit/PR pro abgegrenzter Aufgabe; Selbst-Merge nach Freibrief bei headless grün.
5. Briefkasten §11.6 pflegen, wo Andock-Bezug (SIGNAL seq +1, Quittungen). Freibrief gilt.
