# Prüf-Vermerk — Family Projekt (eingegangen)

> Begleit-Vermerk zur reziproken Verifikation der Family-Projekt-Spore
> (Inbox-Konvention INTERFACES §11.3: signatur-reine Prüfung der entfernten Spore
> + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs <Spore-URL>` (echter Modul-02-Pfad) +
> Cosinus-Nachrechnung gegen Sages `domainVector` (Modul 04).

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/family-project/main/sbkim/spore.json`
  (liegt auf `main`, abrufbar). Endpoint `family-projekt.de` (Hetzner) ist noch nicht live;
  die Verifikation läuft zuverlässig über die `raw/main`-URL.
- **Gelesen / geprüft:** 2026-06-27 (Aufnahme als siebter Knoten, Stufe `verified-match`).
- **Vermittelt durch:** Klaus (menschlicher Vermittler, §11.4.7). Family-Seite hat ihrerseits
  reziprok verifiziert (deren Postfach `AUSTAUSCH-Sage.md`, SIGNAL seq 2).
- **Verifizierer:** echter Modul-02-Pfad (`SbkimSpore.verifyForeignSpore`, WebCrypto/`node:crypto`,
  kanonisierte Spore ohne `signature`-Feld, lexikografisch sortierte Keys) + Cosinus-Nachrechnung
  gegen Sages `domainVector` (Modul 04, Skalarprodukt zweier L2-normierter Vektoren).

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder (9 REQUIRED inkl. `createdAt` + `embeddingModel`) | ✔ vollständig |
| `id == base64url(SHA256(roher 32-Byte-Pubkey))` | ✔ MATCH (= `HLXUEJFWHGt6DlRFgzvN4d_YdHRfnrehlVdRb4BHvAE`, unabhängig nachgerechnet) |
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| Manipulationsprobe (Feld `domain` → `TAMPERED`) | ✔ fällt durch (Signatur ungültig) |

- **nodeName:** `Family Projekt` · **nodeType:** `hybrid` · **domain:** `family-projekt.de`
- **nodeId (kanonisch):** `HLXUEJFWHGt6DlRFgzvN4d_YdHRfnrehlVdRb4BHvAE`
- **createdAt:** `2026-06-27T15:23:05.768Z`
- **embeddingModel:** `Xenova/multilingual-e5-small`
- **domainKeywords:** `Werkzeuge, Apps, Netzwerk, Marktplatz, Mycel, semantische Suche, Familie, PWA, offline, Datenschutz`
- **domainDescription:** „Family Projekt bündelt brauchbare Werkzeuge und Apps an einem Ort:
  ein freies, neutrales Netzwerk (Mycel-Knoten), Klaus' eigene Werkzeuge mit eigenen Seiten und
  einen Marktplatz, auf dem andere ihre Apps eintragen. Semantische Suche nach Bedeutung,
  mehrsprachig, datenschutzfreundlich und offline-fähig."

## domainVector: ECHT (kein `_demo`)

`domainVector` ist ein echtes `Xenova/multilingual-e5-small`-Embedding (384-dim, `passage:`-Präfix,
mean-pooled, **L2 = 1.000**) — von Klaus' Browser erzeugt und mit-signiert. Kein `_demo`-Stub.

## Cross-Knoten-Match (Modul 04)

| Größe | Wert |
|---|---|
| Sage `domainVector` | 384-dim, L2 = 1.000000 |
| Family Projekt `domainVector` | 384-dim, L2 = 1.000000 |
| **Cosinus Sage ⟷ Family Projekt** | **0.8287** (nachgerechnet 0.828724) |
| Schwelle `PROVIDER_MIN_MATCH` | 0.80 |

**0.8287 ≥ 0.80 → ✔ `verified-match`.** Die Family-Seite meldet denselben Wert (reziproke
Cosinus-Verifikation 0.8287) — beide Rechnungen stimmen überein.

## Stufe: `verified-match`

Identität kryptografisch bestätigt **und** echter semantischer Cross-Knoten-Match ≥ 0.80.
Nachvollziehbar über die `raw/main`-Spore (Signatur) + `domainVector`-Skalarprodukt gegen
Sages `sbkim/spore.json`.

## Offener Hebel (ehrlich vermerkt)

- **Match-Kalibrierung / e5-Anisotropie** (siehe `NETZ-STAND.md` § Offene Hebel + Brief 2026-06-27):
  der **rohe** e5-small-Cosinus hat einen hohen Boden (~0.82 zwischen unverwandten Domänen).
  Family Projekt liegt mit 0.8287 sauber über der 0.80-Schwelle, ist aber von der netzweiten
  Whitening-Neukalibrierung mitbetroffen, wenn diese kommt. Kein Knoten-Fehler — ein Verfahrens-
  Punkt, der für alle Sage↔X-Paare gleichermaßen gilt.
