# Arbeitsliste — Semantik & Verschlüsselung (was als Nächstes kommt)

> **Für jede Sitzung:** Dies ist die lebende Arbeitsliste für die zwei Stränge
> **(A) Semantik & bidirektionales Matching** und **(B) Verschlüsselung**.
> Wer einen Punkt erledigt, **hakt ihn hier ab** (`[ ]` → `[x]`), trägt Datum ein
> und ergänzt neue Punkte. So weiß die Folge-Sitzung **vorweg**, was ansteht.
> Klaus hat dieselbe Liste als interaktive Abhak-Seite
> (`docs/checkliste_semantik_krypto.html`).
>
> **Stand: 2026-07-10.** Quellen: `docs/PULS.md`, `CLAUDE.md` (Modul-Tabelle,
> Pipeline), `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`,
> `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`, `docs/E2E-VERTRAULICHKEIT.md`.

**Legende:** `Bau` = Bau-Sitzung nötig · `Test` = Klaus' Browser-Sichttest am Tablet ·
`Entscheid` = Klaus' Richtungswahl vorher. Zeit „~1 Sitzung" = ein abgegrenzter
Bau-Durchgang (~30–60 Min) + kurzer Sichttest. Grob geschätzt.

---

## A) Semantik & bidirektionales Matching

- [ ] **A1 — Frage → Antwort über das Netz verdrahten (größter Hebel)** · `Bau` `Test` · ⏱ ~2–3 Sitzungen
  Die zwei bewiesenen Hälften verbinden: Modul **04.C `queryLocal`** + Modul **15 Membran (`op:"query"`)**
  über das Relay (`wss://relay.family-projekt.de`) — Frage raus, **bedeutungs-sortierte Antwort aus dem
  Inhalt eines anderen Knotens** zurück. _erledigt am: ____ · getestet am: _____
- [ ] **A2 — Cross-Knoten-Such-Test (Pipeline-Phase C)** · `Test` (braucht A1) · ⏱ ~1 Sitzung + Live-Test
  End-to-End mit zwei Endpunkten: Anfrage auf Knoten 1 → Treffer aus Knoten 2. _getestet am: _____
- [ ] **A3 — Medium härten** · `Bau` · ⏱ ~1–2 Sitzungen
  Nostr-Brett ist bewiesen, aber ungehärtet: Spam-Schutz + Haltbarkeitsgarantie der Zettel. _erledigt am: _____
- [ ] **A4 — KI-Richter B3 (Sicherheit/Eignung)** · `Bau` · ⏱ ~1 Sitzung
  Unsicheres markieren/herabstufen, Sicheres hochstufen (Hund-Katze-/Permethrin-Fall). _erledigt am: _____
- [ ] **A5 — Rollout Hybrid-Vorfilter + Multi-Query in weitere Apps** · `Bau` · ⏱ ~1 Sitzung
  BM25+Vektor + Multi-Query byte-gleich in: Pinnwand · Mixarium · Rezeptbuch · family-project · BookLedgerPro. _erledigt am: _____
- [ ] **A6 — Echte Embedding-Vektoren statt Demo-Stub** · `Bau` · ⏱ ~1–2 Sitzungen
  Modul 03: `_demo`-`domainVector` durch echte Vektoren ersetzen → erst dann „verified-match" statt nur „verified-spore". _erledigt am: _____
- [ ] **A7 — Sichttest: App-Integration Hybrid + Multi-Query** · `Test` · ⏱ ~15–30 Min
  Sage-Suchfeld am Tablet prüfen (headless grün). _getestet am: _____
- [ ] **A8 — Sichttest: „Wählen"-Umschalter verbunden ↔ verwandt** · `Test` · ⏱ ~15–30 Min · _getestet am: _____
- [ ] **A9 — Sichttest: „verwandt · KI" mit echtem Schlüssel** · `Test` · ⏱ ~15–30 Min · _getestet am: _____
- [ ] **A10 — (Optional/später) „Schnipsel-Mittel"** · `Bau` nur b. Bedarf · ⏱ ~2 Sitzungen
  Einziges Verfahren mit messbarer Verwandt-Trennung, aber Datenvertrag-Eingriff (Schnipsel-Vektoren in die
  Spore) + **alle Knoten neu signieren**. Bewusst zurückgestellt. _erledigt am: _____

## B) Verschlüsselung

- [ ] **B1 — Modul 20 Schlüssel-Safe: Sichttest der Modal-UI** · `Test` · ⏱ ~20–30 Min
  Real gebaut (AES-GCM-256, PBKDF2 600k, Shamir 2/3, headless 19/19). Einrichten/entsperren/Recovery prüfen. _getestet am: _____
- [ ] **B2 — Modul 20 Feinpunkte** · `Bau` `Entscheid` · ⏱ ~1 Sitzung
  Ed25519 „extractable"-Abwägung + N/k-Standardwerte im UI. _erledigt am: _____
- [ ] **B3 — Modul 20 netzweite Verteilung (BLP zuerst)** · `Bau` (braucht B1) · ⏱ ~1–2 Sitzungen · _erledigt am: _____
- [ ] **B4 — Widget-Tresor „Increment 2 B" (sicherheits-sensibel, eigene Sitzung)** · `Bau` · ⏱ ~1–2 Sitzungen
  Eigener Tresor (Shamir 2/3 + Passwort + 🔐), automatischer KI-Aufruf mit Websuche, App-Schlüssel-Durchreichung.
  Heute KI-Schlüssel bewusst nur im RAM. _erledigt am: _____
- [ ] **B5 — E2E Grad B: Pseudonymisierung** · `Bau` (kein Protokoll-Bump) · ⏱ ~1 Sitzung
  Platzhalter wie `[[KUNDE_1]]` statt Klartext — sofort möglich, guter Zwischenschritt. _erledigt am: _____
- [ ] **B6 — E2E Grad C: versiegelter Umschlag** · `Entscheid` `Bau` später · ⏱ ~2–3 Sitzungen
  Sealed box (X25519 → ECDH → HKDF → AES-GCM-256). Braucht Protokoll-Sprung 0.1 → 0.2, eigene Spec-Sitzung,
  laufenden BLP-Knoten. _erledigt am: _____
- [ ] **B7 — Pinnwand-Verschlüsselung: Richtungsentscheid** · `Entscheid` vor Bau · ⏱ ~1 Sitzung
  Passwort-Weg gebaut. Offen: Public-Key/ECDH + **MITM beim Erstkontakt**. Erst Klaus' Wegwahl, dann bauen. _entschieden am: _____

---

## Empfohlene Reihenfolge

1. **A1 (+ A2)** — Frage→Antwort verdrahten + Cross-Knoten-Test. Größter Hebel. ⏱ ~3–4 Sitzungen
2. **A7 · A8 · A9** — die drei ausstehenden Sichttests. Nur Tablet. ⏱ ~1–1,5 Std
3. **B1 (+ B2, B3)** — Safe-Sichttest, Feinpunkte, dann Verteilung. ⏱ ~30 Min Test, dann ~2–3 Sitzungen
4. **B4** — Widget-Tresor als eigene, sicherheits-sensible Sitzung. ⏱ ~1–2 Sitzungen
5. **B7 + B5** — Pinnwand-Weg entscheiden; parallel Grad B (Pseudonymisierung). ⏱ ~1 Sitzung Entscheid + ~1 Sitzung Bau

**Grobe Gesamtsumme:** Kernpunkte ≈ **13–18 Bau-Durchgänge** (ohne A10 & B6) + **~2–3 Std** Tablet-Sichttests.
Schnelle Haken ohne Bau: **A7–A9, B1**.

---

## Pflege dieser Liste

- Punkt erledigt → `[ ]`→`[x]`, Datum in die _kursive_ Stelle.
- Neue Erkenntnis/neuer Punkt → hier ergänzen (mit Quelle), nicht in einer anderen Doku verstecken.
- Bei Abschluss eines Punktes zusätzlich in `docs/PULS.md` vermerken (Übergabe-Ritual).
- Die interaktive Fassung `docs/checkliste_semantik_krypto.html` ist Klaus' Ansicht — inhaltlich identisch halten.
