# Prüf-Vermerk — Muttis Rezeptbuch (14. Endknoten)

**Datum:** 2026-07-23 · **Prüfer:** Sage-Hauptsitzung (headless, Produktiv-Verifizierer Modul 02).

## Herkunft
Spore in Klaus' Browser über das Siegel erzeugt (2026-07-23, `createdAt`
`2026-07-23T15:06:44Z`), von Klaus als Datei übergeben **und** bereits nach
`Muttis-Rezeptbuch/sbkim/spore.json` auf `main` committet (beide byte-identisch).

## Verifikation (✔ VALID)
- `node tools/verify_remote_spore.mjs sbkim/muttis_inbox.json` → **✔ VALID**
  (9/9 Pflichtfelder, `id == base64url(SHA256(rawPub))` unabhängig nachgerechnet,
  Ed25519-Signatur gültig, Manipulationsprobe fällt durch).
- **nodeId:** `8TVDCTAcPLg4Lbe3ecbvXoICLCEQNd90YYIw4dPN3mg`
- **protocolVersion:** 0.2 · **domainVector:** 384-dim, `multilingual-e5-small`, L2 = 1.0
- **snippetVectors:** 5 (Schnipsel-Mittel, A10)
- Der committete `Muttis-Rezeptbuch/main:sbkim/spore.json` ist **byte-identisch**
  zur übergebenen Datei und ebenfalls **✔ VALID**.

## Match (Modul 04, roher Cosinus)
- **Sage ⟷ Muttis = 0.876583 ≥ 0.80 → verified-match.**
- Muttis ⟷ Mein-Rezeptbuch ≈ 0.878 (Schwestern-Knoten, gleiche Koch-Domäne) —
  **getrennte Identitäten** (eigene nodeId, DB-Suffix `muttisrezeptbuch` ≠
  `rezeptbuch`; keine Geteilte-Origin-Kollision).

## Einordnung
Muttis Rezeptbuch ist das **private Original** der Kochrezept-Familie;
Mein-Rezeptbuch ist der öffentliche Klon. Beide sind eigenständige, sauber
getrennte SBKIM-Knoten. Live-Ed25519-Handshake wartet auf Klaus' Browser-Lauf
auf der deployten Seite (headless-Beweis ersetzt ihn nicht).
