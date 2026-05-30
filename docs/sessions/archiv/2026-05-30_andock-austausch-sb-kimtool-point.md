# Übergabeprotokoll — Andock-Austausch SB·KIMTool·Point

- **Datum:** 2026-05-30
- **Rolle:** Andock-Sitzung (Inter-Knoten-Austausch, kein Modul-Code)
- **Branch:** `claude/sbkim-point-docking-exchange-eAyD2`
- **PR:** #224 (Draft)
- **Gegenstelle:** `lausiklauskn-png/SB-KIMTool-Point`
  (Arbeits-Branch `claude/zweites-werkzeug-spore-4T97H`)

## Auftrag

Klaus: Andock-Austausch mit dem Endknoten SB·KIMTool·Point starten —
deren Postfach lesen, Spiegel-Datei mit Antworten anlegen, pushen.
Anschließend freie Hand für das Ziel „direkte Repo-zu-Repo-Kommunikation
über SBKIM"; Leitlinie: **wenn SBKIM-Krypto noch nicht trägt, nicht
erzwingen — eine Brücke / ein Hilfsmittel wählen**.

## Ausgangslage (gelesen aus dem Netz)

- SB·KIMTool `sbkim/AUSTAUSCH.md`: Verbindungs-Angebot + 5 Fragen,
  Spielregeln (Lese-Quittung, eine-Frage-eine-Antwort, Spec vor Code,
  ehrlich real vs. Demo).
- SB·KIMTool `docs/ANDOCK.md`: Schema §2, Schlüssel-Haltung §3
  (`SBKIM_NODE_KEY`), kanonische Signier-Form §4 (JSON.stringify ohne
  Whitespace, Schlüssel rekursiv sortiert, `signature` ausgenommen),
  Demo-`domainVector` §5.
- Ihre `spore.json` ist **noch nicht veröffentlicht** (Pages 403,
  beide Branches 404).

## Getan

1. **Spiegel-Postfach** `sbkim/AUSTAUSCH.md` angelegt. Status-Kopf-Zeile
   B gepflegt (Prüf-Rhythmus = pro Andock-Sitzung / Empfangsmodus,
   „zuletzt gelesen 2026-05-30", „wartet auf live spore.json"). Alle
   5 Fragen direkt beantwortet:
   1. Verifizierer existiert + lief live (Doku-Tabelle „Stub" ist
      Rückstand).
   2. Kanonische Form bestätigt — **bereits identisch** zu unserem
      `canonicalize()`.
   3. Demo-Vektor fürs Andocken ok; echter Match später; Weg zum echten
      384-dim-Vektor via Live-Modul 03 skizziert.
   4. Registrierung in `status.json` als Folge-PR **nach** Verifikation.
   5. Prüf-Rhythmus = pro Andock-Sitzung, kein Crawler.
2. **Blocker** gemeldet: unser `REQUIRED_SPORE_FIELDS` verlangt
   `createdAt` + `embeddingModel`, beide fehlen in ANDOCK §2. Müssen
   beim Signieren bereits drin sein.
3. **Andock-Werkzeuge** (`tools/`) gebaut, die den echten
   Modul-02-Verifizierer headless fahren:
   - `verify_remote_spore.mjs` — Spore per URL/Datei prüfen.
   - `make_example_spore.mjs` + `sbkim/example_sbkimtool_spore.json`.
   - `tools/README.md`.
4. **Kopierbarer Generator für SB·KIMTool**
   `sbkim/fuer-SB-KIMTool-Point/generate_spore.mjs` — nach ANDOCK §2–§5
   + zwei Pflichtfelder, mit `SBKIM_NODE_KEY`-Handling + flüchtigem
   Test-Fallback.
5. **Brücke verifiziert** (statt Krypto-Zwang): Datei-Dead-Drop lebt
   bidirektional (wir → ihr Repo HTTP 200; sie → unser Branch-Raw HTTP
   200).

## Beweise (Node v22, WebCrypto / node:crypto Ed25519)

| Probe | Ergebnis |
|---|---|
| Sages eigene live-signierte `sbkim/spore.json` | ✔ VALID 9/9 |
| Referenz-Spore in SB·KIMTool-Schema + 2 Felder + `_demo` | ✔ VALID 9/9 |
| Dasselbe ohne `createdAt`/`embeddingModel` (ANDOCK §2 wörtlich) | ✗ `Pflichtfeld fehlt: createdAt` |
| Generator mit persistentem `SBKIM_NODE_KEY`, zwei Läufe | nodeId STABIL → ✔ VALID |
| Generator flüchtig (kein Secret) | ✔ VALID, klar als „ungesichert/Test" markiert |

## Befunde für Folge-Sitzungen

- **Doku-Rückstand Modul 02:** `status.json` + Karte 02 tragen
  „Code-Stub", obwohl `verifyForeignSpore` voll/live ist. Eigene
  Pflege-Sitzung nachziehen (Tafel-Evolutions-Klausel: neue Erkenntnis
  aus Live-Beweis).
- **PULS.md über Soft-Cap** (4365+ Zeilen > 3000). Eigene
  PULS-Archivierungs-Sitzung fällig (nicht in dieser Sitzung gelöst —
  Scope).

## Sichttest

Nicht-Browser-Werkzeuge, headless geprüft (siehe Beweise). Kein
Sage-Page-/`manual_check.html`-Eingriff, daher kein Klaus-Browser-
Sichttest nötig. Module unangetastet.

## Nächster sinnvoller Schritt

1. **PR #224 → `main` mergen** (Klaus' Zuruf) für stabile URL.
2. **SB·KIMTool**: `generate_spore.mjs` einsetzen, `SBKIM_NODE_KEY`
   hinterlegen, `spore.json` live stellen.
3. **Folge-Sitzung**: `node tools/verify_remote_spore.mjs <ihre-url>` →
   bei ✔ Registrierung in `status.json` (Folge-PR).
4. Optional: echter `domainVector` via Live-Modul 03.
5. Separat: Pflege-Sitzung Modul-02-Doku + PULS-Archivierung.
