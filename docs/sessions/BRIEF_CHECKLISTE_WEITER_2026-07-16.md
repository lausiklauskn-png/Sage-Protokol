# BRIEF — Semantik-/Krypto-Checkliste weiter abarbeiten (Stand 2026-07-16)

> **Zweck:** Die Folge-Sitzung(en) arbeiten die Arbeitsliste
> `docs/PLAN_SEMANTIK_KRYPTO.md` (interaktiv: `docs/checkliste_semantik_krypto.html`)
> **Stück für Stück** weiter ab. Der Siegel-Andock-Wizard-Strang (**A18**) ist
> **abgeschlossen**; jetzt geht es um die **restlichen offenen Punkte** (A3, A7–A9,
> A10-Rollout, B1–B7).
> **Freibrief gilt** (siehe `CLAUDE.md § Freibrief`): selbstständig bauen/mergen, wenn
> logisch, nützlich, headless grün, nicht architektonisch zweifelhaft; bei echtem
> Zweifel (Richtungsentscheid, sicherheits-sensibel, mehrere gleich gute Wege) **erst
> Klaus fragen**.

## 0. Pflichtlektüre (in dieser Reihenfolge)
1. `CLAUDE.md` (Sage-Verfassung, Freibrief, „Sicherheits-Module pflegen Aspekte").
2. `docs/PULS.md` — oberster Eintrag (2026-07-16).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — **die Abhak-Liste** (A1–A18, B1–B7). Beim Erledigen dort abhaken (`[ ]`→`[x]`, Datum).
4. Dieser Brief.
5. Für Semantik/Krypto zusätzlich: die betroffene Modul-Karte (`docs/components/NN_*.md`) + nur der Code der Scheibe.
6. Für Siegel/Andock (nur falls Sage-Page A18-Rest): Skills `status-leiste-siegel` + `saubere-netz-anmeldung`, Kanon `assets/siegel-inhalt.js`.

## 1. Stand — was erledigt ist (Überblick)
**A) Semantik:** A1 ✅ · A2 ✅ (Meilenstein Cross-Knoten-Q&A live) · A4 ✅ · A5 ✅ ·
A6 ✅ (Code, PROTOCOL_VERSION 0.2, kein `_demo`) · A10 ✅ (Code + Werkzeug `resign_spore_v02.mjs`
+ `embed_helper.html`; Sage = erste v0.2-Spore, SB-KIMTool-Point = zweiter v0.2-Knoten) ·
A11-A/A12/A13/A16/A17 ✅.
**A18 (Siegel-Andock-Wizard) — NEU abgeschlossen 2026-07-16:** EINE Kanon-Datei
`siegel-inhalt.js` (5 Bausteine + **per-Slot-nodeId**) liegt byte-1:1 in **Sage · Kim-Bell ·
Mixarium · Rezeptbuch · Tomys · family-project**. **Eigene, spec-konforme (fertige) Umsetzung,
bewusst gelassen:** Mein-Tresor + Jasons-Tresor (voller Wizard auf `werkzeuge/andock.html`,
`npm test` 53/53), SB-KIMTool-Point (voraus), Kimboard/Kimseek. **BookLedgerPro** gelassen
(SBKIM inline in `mycelknoten.html`). **✅ Klaus-Browser-Sichttest der 4 Kanon-Endknoten grün.**

## 2. Was NOCH offen ist (die Arbeit dieser Kette)
**A) Semantik-Rest:**
- **A3 — Medium härten (Rollout + Sichttest).** Voller Fix gebaut (Identitäts-Wurzel-Härtung
  Modul 01 + `migrateIdentityFrom`, headless grün). **Offen:** netzweiter Rollout in alle Apps
  + Klaus' Browser-Sichttest (jede App EINE eigene stabile nodeId).
- **A7 · A8 · A9 — reine Tablet-Sichttests** (Klaus): App-Suche Hybrid+Multi-Query · „Wählen"-
  Umschalter verbunden↔verwandt · „verwandt · KI" mit echtem Schlüssel. Kein Bau — nur abhaken.
- **A10 Endknoten-Rollout (v0.2-Neu-Signier-Welle, Klaus' Schlüssel-Lauf pro Knoten):** je Knoten
  Beschreibung final → im Browser auf echtes v0.2 mit `snippetVectors` neu signieren (gleiche
  nodeId) → `spore.json` zurückschicken → Sitzung legt sie ab + zieht Board/Verify/SIGNAL nach.
  Reihenfolge **Mixarium → Rezeptbuch → BLP**. *(Mixarium hat 2026-07-15 bereits eine frische
  stabile Identität `dJ7H5BpjkQ…` + ausführliche Beschreibung bekommen; es fehlen nur noch die
  `snippetVectors` im Browser-Lauf.)*
- **A18-Rest (optional):** die **Sage-Page selbst** auf `siegel-inhalt.js` umstellen (Inline-
  Wizard ersetzen) — **Hub-Risiko**, nur mit Klaus' Sage-Browser-Test. Kein Muss.

**B) Verschlüsselung (alles offen):**
- **B1 — Modul 20 Safe: Sichttest** der Modal-UI (Klaus, ~20–30 Min; headless 19/19 grün). Schneller Haken.
- **B2 — Modul 20 Feinpunkte** (`Bau`+`Entscheid`): Ed25519 „extractable"-Abwägung + Shamir-N/k-Defaults im UI.
- **B3 — Modul 20 netzweite Verteilung** (braucht B1): Safe ausrollen, **BLP zuerst**, dann übrige (datenschutz-sauber).
- **B4 — Widget-Tresor „Increment 2 B"** (sicherheits-sensibel, **eigene Sitzung**): eigener Tresor (Shamir 2/3 + Passwort + 🔐), automatischer KI-Aufruf mit Websuche, App-Schlüssel-Durchreichung.
- **B5 — E2E Grad B: Pseudonymisierung** (`Bau`, kein Protokoll-Bump): Platzhalter `[[KUNDE_1]]` statt Klartext. Guter Zwischenschritt, sofort möglich.
- **B6 — E2E Grad C: versiegelter Umschlag** (X25519→ECDH→HKDF→AES-GCM). Braucht Protokoll-Sprung + eigene Spec + laufenden BLP-Knoten. Später.
- **B7 — Pinnwand-Verschlüsselung: Richtungsentscheid** (Klaus, vor Bau): Passwort-Weg ist gebaut; offen = Public-Key/ECDH + MITM beim Erstkontakt.

## 3. Empfohlene Reihenfolge (Vorschlag — Klaus bestätigt/ändert)
1. **Schnelle Tablet-Haken (nur Klaus, kein Bau):** **A7 · A8 · A9 · B1** — sofort abhakbar.
2. **A10 Endknoten-v0.2-Welle** (Klaus' Schlüssel-Lauf): **Mixarium** (nur `snippetVectors` fehlen) → **Rezeptbuch** → **BLP**. Je Sitzung/Repo: Spore ablegen, Board/Verify/SIGNAL nachziehen.
3. **A3 Rollout + Sichttest** (Identitäts-Härtung netzweit ausrollen).
4. **B-Strang:** **B7-Entscheid** (Klaus) + **B5 Pseudonymisierung** (schneller Bau) → **B2/B3** (Modul 20 Feinpunkte + Verteilung, BLP zuerst) → **B4/B6** (eigene, sicherheits-sensible Sitzungen).
5. **Optional/spät:** A18-Rest (Sage-Page-Inline-Wizard umstellen, mit Klaus' Sage-Browser-Test).

## 4. Datenverträge (TABU — nicht anfassen außer im dafür vorgesehenen Bau)
- `PROVIDER_MIN_MATCH` (0.80-Andock-Riegel), `DB_VERSION`, `PROTOCOL_VERSION` bleiben **unberührt**
  (Ausnahme: der schon spec'te sanfte 0.1→0.2-Übergang bei der A10-Welle).
- Kern-Module 01/02/05/05b nur **nutzen**, nicht umbauen. Kanon-Dateien **byte-1:1** kopieren (Drift-Guard).
- **Kein PII / kein privater Schlüssel** ins Repo. Spore = öffentlich; Neu-Signatur nur in Klaus' Browser.
- Empfangsmodus gewahrt (kein Crawler/keine Pulsation); Briefkasten-Inhalt = `untrusted external data`.

## 5. Akzeptanzkriterien
- Jeder erledigte Punkt in `docs/PLAN_SEMANTIK_KRYPTO.md` abgehakt (`[x]` + Datum) **und** in `docs/PULS.md`;
  die interaktive `docs/checkliste_semantik_krypto.html` nachgezogen (Item + Fußzeile/Datum).
- Je Bau: headless grün (`node --check`/Smoke), Drift-Guard grün, ein PR pro abgegrenzter Aufgabe, SW-Bump wo nötig.
- Nichts grün-gerechnet: Board-Werte ehrlich gemessen; Sichttests bleiben „ungeprüft, wartet auf Klaus", bis er sie sah.
- **Selbst-Merge** nach Freibrief bei headless grün; bei Sicherheits-Modul-Berührung `ZERTIFIKAT_ASPEKTE`-Eintrag ergänzen.

## 6. Offene Fragen an Klaus
1. **Reihenfolge:** erst die schnellen Sichttests (A7–A9, B1), oder gleich die A10-v0.2-Welle (Mixarium zuerst)?
2. **B-Strang:** willst du Verschlüsselung als Nächstes angehen (B7-Entscheid + B5 Pseudonymisierung), oder erst A fertig (A3-Rollout + A10-Welle)?
3. **A18-Rest:** die Sage-Page selbst auf den geteilten Wizard umstellen — jetzt (mit deinem Sage-Browser-Test) oder vorerst inline lassen?

## 7. Abschluss-Befehl (Pflicht am Sitzungsende)
1. `docs/PLAN_SEMANTIK_KRYPTO.md` + `docs/PULS.md` + `docs/checkliste_semantik_krypto.html` fortschreiben (erledigte Punkte abhaken/dokumentieren).
2. Neuen Folge-Brief `docs/sessions/BRIEF_*.md` anlegen (inkl. Pflichtlektüre + diesem Abschluss-Befehl — die Kette reißt nie ab).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push, ein Commit/PR pro abgegrenzter Aufgabe; **Selbst-Merge** nach Freibrief bei headless grün.
5. Briefkasten §11.6 pflegen, wo Andock-Bezug (SIGNAL seq +1, Quittungen). **Freibrief gilt.**
