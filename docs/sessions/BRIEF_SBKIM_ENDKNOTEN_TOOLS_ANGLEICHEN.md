# BRIEF — SBKIM-Tools netzweit angleichen + Checkliste weiter abarbeiten

> **Zweck:** die Folge-Sitzung(en) arbeiten die Semantik-/Krypto-Liste
> `docs/PLAN_SEMANTIK_KRYPTO.md` **Stück für Stück** weiter ab und statten **die anderen
> Repos** (Mixarium, Rezeptbuch, BLP, Kim-Bell, SB-KIMTool-Point, family, Tomys, …) mit den
> **neuen/aktualisierten SBKIM-Bausteinen** aus — so wie sie im Sage-Kanon liegen.
> **Freibrief gilt** (siehe `CLAUDE.md § Freibrief`): selbstständig bauen/mergen, wenn
> logisch, nützlich, headless grün, nicht architektonisch zweifelhaft; bei echtem Zweifel
> erst Klaus fragen.

## 0. Pflichtlektüre (in dieser Reihenfolge)
1. `CLAUDE.md` (Sage-Verfassung, Freibrief, „Sicherheits-Module pflegen Aspekte").
2. `docs/PULS.md` — aktueller Stand.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — **die Abhak-Liste** (A1–A17, B1–B7). Beim Erledigen dort abhaken.
4. Dieser Brief.
5. Für Siegel/Andock-Arbeit: Skills `status-leiste-siegel` + `saubere-netz-anmeldung`; Kanon-Datei
   `assets/siegel-inhalt.js`.

## 1. Stand (was zuletzt geschah, 2026-07-15/16)
- **Kanonischer Siegel-Andock-Wizard gebaut:** `Sage-Protokol/assets/siegel-inhalt.js` — die EINE
  1:1-kopierbare Fassung des vollen Wizards (5 Bausteine: Identität erzeugen · Spore signieren+⬇ ·
  Backup · Wiederherstellen · **Identitäts-Wechsler** mit **aktiver-nodeId-Anzeige**), als natives
  `<dialog>` (Top-Layer, liegt VOR dem Siegel). **Mein-Mixarium** fährt ihn bereits (alte
  Fehlverdrahtung 🔑→Modul 18 entfernt).
- **Mein-Mixarium** außerdem: bewusster **Identitäts-Neuanfang** (neue stabile nodeId
  `dJ7H5BpjkQ…`, alt in `previousNodeIds`) + **ausführliche Beschreibung** mit
  Organisations-/Kategorisierungs-Kern, Spore neu signiert (✔ VALID). Board 5/5 ≥ 0.80 (Tresor-Nähe
  = echte gemeinsame Werkzeug-DNA, nicht nur Länge).
- **Checklisten-Stand geprüft** (siehe § 2).

## 2. Checklisten-Stand (Quelle: `docs/PLAN_SEMANTIK_KRYPTO.md`)
**A) erledigt:** A1, A2, A4, A5, A6, A10 (Spec+Code+Werkzeug), A12 (Phasen 1–2d), A13, A16, A17 (Bau).
**A) Rest/Rollout/Sichttest offen:**
- **A3** — voller Identitäts-Isolierungs-Fix gebaut; **netzweiter Rollout + Browser-Sichttest** offen.
- **A4** — B3-Sicherheits-Verdikt gebaut; **⚠️-UI-Marker + Byte-Rollout-Kontrolle des 04-Updates** offen.
- **A7 · A8 · A9** — reine **Tablet-Sichttests** (App-Suche · „verbunden↔verwandt" · „verwandt·KI").
- **A10** — **Live-Neu-Signatur der Endknoten-Sporen auf echtes v0.2 mit `snippetVectors`** (Klaus'
  Schlüssel-Lauf pro Knoten): Mixarium (jetzt 0.1, frischer Vektor) → echtes v0.2; dann Rezeptbuch, BLP.
- **A11** Teil B (Suchergebnis→Andocken-Kopplung 22↔23) · **A14** ensureStore-Race-Bug · **A15**
  Zwei-Stufen-Verbinden · **A17** Byte-Rollout + Sichttest · **A5b** optional Pinnwand.
**B) alles offen:** B1 (Safe-Sichttest, schnell) · B2 · B3 (Modul-20-Verteilung) · B4 (Widget-Tresor) ·
B5 (Pseudonymisierung) · B6 (sealed envelope) · B7 (Pinnwand-Krypto **Entscheid**).
**NEU (in die Liste aufnehmen):** **A18 — kanonischen Siegel-Wizard (`siegel-inhalt.js`) netzweit ausrollen.**

## 3. Was gebaut/getestet/entschieden werden soll — empfohlene Reihenfolge
**Phase 1 — schnelle Haken (kein/kaum Bau):**
- **A7 · A8 · A9 · B1** — Klaus' Tablet-Sichttests (Sage-Suche, Umschalter, KI-Richter, Modul-20-Safe).
  Ergebnis in der Liste + `PULS.md` abhaken. (Nur Klaus, keine Sitzung nötig.)

**Phase 2 — neuer Baustein netzweit (A18, das „andere Repos ausstatten"):**
- **Sage-Page selbst** auf `siegel-inhalt.js` umstellen (Inline-Wizard ersetzen) — mit Klaus'
  Sage-Browser-Test.
- Dann **Kim-Bell · SB-KIMTool-Point · Mein-Rezeptbuch · BookLedgerPro · family-project** je auf den
  kanonischen Wizard bringen (Datei 1:1 kopieren, nur `WIZ`-Config anpassen; alte/abweichende
  Injektionen entfernen; SW-Bump; Drift-Guard). **Ein Repo pro PR**, headless `node --check` + (wo
  vorhanden) Smoke grün, dann Klaus-Sichttest.

**Phase 3 — A10 v0.2-Re-Sign-Welle der Endknoten (Klaus' Schlüssel-Lauf):**
- Pro Knoten: Beschreibung final → im Browser neu signieren (echtes v0.2 mit `snippetVectors`,
  gleiche nodeId) → `spore.json` zurückschicken → Sitzung legt sie ab + zieht Board/Verify/SIGNAL nach.
  Reihenfolge: **Mixarium** (nur noch snippetVectors fehlen) → Rezeptbuch → BLP.

**Phase 4 — offene Bau-/Rollout-Punkte:**
- **A4** ⚠️-UI-Marker (Sicherheit sichtbar) + Byte-Rollout-Kontrolle 04 · **A17** 03-Worker-Rollout +
  Sichttest · **A3** voller-Fix-Rollout + Sichttest · **A14** Race-Bug · **A11** Teil B.

**Phase 5 — Entscheide (Klaus, vor Bau):**
- **A12** „Antworten an/aus" Auto-Toggle-Konzept · **A15** Zwei-Stufen-Verbinden · **B7** Pinnwand-Krypto-Weg.
- Danach B-Strang bauen: **B5** (Pseudonymisierung, guter Zwischenschritt) → **B3/B2** (Modul 20 verteilen) → B4/B6.

## 4. Datenverträge (unberührt lassen)
- `PROVIDER_MIN_MATCH` (0.80-Andock-Riegel), `DB_VERSION`, `PROTOCOL_VERSION` sind **TABU** außer im
  ausdrücklich dafür vorgesehenen Bau (z. B. 0.1→0.2 sanfter Übergang, schon spec'd).
- Kern-Module 01/02/05/05b nur nutzen, nicht umbauen. Kanon-Dateien **byte-1:1** kopieren (Drift-Guard).
- Privater Schlüssel/PII nie ins Repo. Spore = öffentlich; Neu-Signatur nur in Klaus' Browser.

## 5. Akzeptanzkriterien
- Jeder erledigte Listenpunkt in `docs/PLAN_SEMANTIK_KRYPTO.md` abgehakt (`[x]` + Datum) **und** in `PULS.md`.
- Jeder Repo-Rollout: headless grün (`node --check`/Smoke), Drift-Guard grün, ein PR pro Repo, SW-Bump wo nötig.
- Nichts grün-gerechnet: Board-Werte ehrlich gemessen; Sichttests bleiben „ungeprüft, wartet auf Klaus", bis er sie sah.

## 6. Offene Fragen an Klaus
1. **Reihenfolge:** erst die schnellen Sichttests (A7–A9, B1) — oder gleich der Siegel-Wizard-Rollout (A18)?
2. **A18-Umfang:** Sage-Page-Inline-Wizard wirklich durch die Datei ersetzen (Hub-Risiko, dein Browser-Test),
   oder nur die Endknoten angleichen und Sage vorerst inline lassen?
3. **B-Strang:** willst du bald Verschlüsselung angehen (B7-Entscheid + B5 Pseudonymisierung), oder erst A fertig?

## 7. Abschluss-Befehl (Pflicht am Sitzungsende)
1. `docs/PLAN_SEMANTIK_KRYPTO.md` + `docs/PULS.md` fortschreiben (erledigte Punkte abhaken/dokumentieren).
2. Neuen Folge-Brief `docs/sessions/BRIEF_*.md` anlegen (inkl. Pflichtlektüre + diesem Abschluss-Befehl).
3. Neuen Brief **als Codeblock im Chat** ausgeben.
4. Commit + Push, ein Commit/PR pro abgegrenzter Aufgabe; **Selbst-Merge** nach Freibrief bei headless grün.
5. Briefkasten §11.6 pflegen, wo Andock-Bezug (SIGNAL seq +1, Quittungen). **Freibrief gilt.**
