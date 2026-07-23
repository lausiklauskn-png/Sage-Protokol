# Übergabeprotokoll 2026-07-23 — Ist-Stand ehrlich + Multi-Knoten-Simulation

**Rolle:** Hauptsitzung (Hub). **Auftrag:** `BRIEF_NETZWEIT_STAND_UND_SAGE_REAL.md`
(Sage „Demo → real", netzweiter Stand). Empfohlener Einstieg: 2.1 Test +
Bestandsaufnahme → 2.2 Simulationen → A14. Genau das ist erledigt.

## Was getan (alles gemergt via PR #697)

1. **S1 — Netzweiter Testlauf (ehrlicher Ist-Stand).** Alle 60 `tests/smoke_*.mjs`
   gefahren (per-Test-Timeout, `fake-indexeddb`). **War 56/60 grün, jetzt 60/60**
   nach ehrlicher Reparatur — KEINE Code-Bugs:
   - `bau04e` / `bau22e` / `bau23` (Probe 15): assertierten `Hub↔Endknoten
     match() ≥ 0.80` mit Rezeptbuch/Mixarium↔Sage. Nach der v0.2-Re-Sign-Welle
     (A10) fielen diese Inhalts-Knoten **korrekt** unter 0.80 (0.79 / 0.77 →
     `verified-spore`) — gewolltes Protokoll-Verhalten. Gate-Beweis nutzt jetzt
     BookLedger↔Sage (0.86 ≥ 0.80) + prüft explizit die korrekte Unter-Boden-Lage.
   - `bau05y`: kein Assertion-Fehler — 25/25 liefen durch, aber der Prozess
     beendete sich nie (Modul 05 `init()` öffnet `BroadcastChannel('sbkim')` →
     offener Handle). Sauberer `process.exit(0)`, wie `smoke_bau05_nostr`.
2. **S2/S3/S4 — Multi-Knoten-Simulation** `tests/sim_multinode.mjs` (Brief §2.2):
   vier echte Knoten-Instanzen (Sandbox-Namensraum je Knoten, eigene DB-Schublade,
   eigene Ed25519-Identität, echte e5-domainVektoren) über EINEN Mock-Relais-Bus:
   Anmelden → Finden → 0.80-Riegel nach Bedeutung → Q&A über Hub → **Q&A OHNE Hub**
   (Meilenstein 2026-07-11 als Regression). **24/24 grün.** Ehrliche Grenzen im
   Datei-Kopf.
3. **A14 — Nachlese.** Fix (`ensureChain`-Serialisierung Modul 01) + Test
   (`smoke_a14_…` 4/4) waren **schon auf main** (#648), nur nie abgehakt. Verifiziert
   + in `PLAN_SEMANTIK_KRYPTO.md` [x] gesetzt.
4. **Demo-Bestandsaufnahme (2.1).** Siehe PULS 2026-07-23. Kern: KEINE echten
   `_demo`-Vektoren mehr im Code; 11× `verified-match`, PB `verified-spore`, Sage=self.
   Einzige echte Demo-Grenze: **BLP** (Vektor-Stub, Spore v0.1).
5. **Doku:** PULS + Plan + interaktive Checkliste nachgezogen.

## Offene Befunde (an Folge-Sitzung — bewusst NICHT blind geändert)

- **status.json Register-Drift:** (a) **Tomys Hub** steht `verified-match` mit
  `matchScore: null`, dokumentiert aber Sage-Match 0.7977 < 0.80 → müsste
  `verified-spore` (wie PB). (b) Mehrere `matchScore`/`nodeId` wirken stale
  gegenüber den re-signierten Live-Sporen (Register-Rezeptbuch 0.824 vs. aktuelle
  Inbox-Vektoren 0.792). **Nicht korrigiert**, weil die autoritative Quelle jede
  Live-`spore.json` am `sporeUrl` ist (Netz, sandbox-seitig nicht sicher erreichbar)
  — ein Register-Refresh gehört an Klaus' Browser / eine gezielte Sync-Sitzung.
- **Muttis-Rezeptbuch (M1):** hat KEIN SBKIM. Architektur-/Identitäts-Entscheid an
  Klaus (eigener Knoten mit eigener Identität/DB-Suffix ↔ privat/kein Knoten) —
  bewusst nicht autonom gebaut (schwer umkehrbar). Details im Folge-Brief.

## Nicht headless prüfbar (wartet auf Klaus' Browser)
Echtes Relais / Live-Cross-Gerät; BLP-v0.2-Neu-Signatur (Schlüssel-Lauf);
Register-Refresh gegen Live-Sporen.

## Nächster sinnvoller Schritt
Siehe Folge-Brief `BRIEF_NETZSTAND_FOLGE_2026-07-24.md` (Register-Refresh + S5
Härtungs-Sims + Muttis-Entscheid + A11/A18).
