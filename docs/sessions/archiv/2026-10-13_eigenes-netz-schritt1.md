# 2026-10-13 · Eigenes Netz, Schritt 1 · Relais und Netz-Code im Kanon (05b + 23)

**Rolle:** Bausitzung (Kanon 05b und 23) · **Zweig:** `claude/sage-relais-netz-code-vaqgr0`

## Auftrag
Schritt 1 aus `docs/BRIEF_2026-10-13_eigenes-netz.md`: Relais-Adresse und Netz-Code je
Installation einstellbar. Ohne Einstellung bleibt alles byte-gleich. Mit Code: Raum-Marke
und Schlüssel aus dem Code, Inhalt verschlüsselt. Bezahlfunktion nicht Teil davon.

## Antworten von Klaus auf die drei Fragen des Briefs
- Relais-Name: „intern Family Project“, Adresse `relay-intern.family-projekt.de`
  (Klaus, gegen Ende der Sitzung: „Dieser Name ist okay.“). Gebaut wird es in Schritt 4.
- Mein Rezeptbuch lauscht im öffentlichen Netz weiter selbst.
- Im eigenen Netz soll eine App **beim Öffnen automatisch** verbinden (Klaus: „wenn es schon
  im firmeninternen Netz ist“). Das ist UI, also Schritt 2.
- Erster Träger: Sende-Prüfer.

## Getan
- `docs/INTERFACES.md`: 05b Relais-Einstellung, 23 „EIGENES NETZ“ (Ableitung, Umschlag, Lagen,
  Speicher, Grenzen) — vor dem Code.
- `src/modules/05b_nostr_relay.js`: nur `wss://`, ganze Liste oder nichts, `reset`,
  `_meta.defaultRelays`, alte Verbindungen werden geschlossen.
- `src/modules/23_rendezvous.js`: `setNetwork`, `applyNetwork`, `checkNetSetting`,
  `newNetCode`, `loadNetwork`/`saveNetwork`/`clearNetwork`, Ableitung SHA-256 + PBKDF2 150 000,
  AES-GCM mit der Marke als AAD, `_meta.network`/`encrypted`/`networkReason`/`tag`/`queryTag`.
- Bündel `sbkim-bundle` und `sbkim-bundle-voll` nachgezogen, Pin im Vollbündel auf 6c25b63b.
- Proben `tests/smoke_netz_eigen.mjs` und `tests/gegenprobe_netz_eigen.mjs` (NUR_ANKER kennt sie).

## Geprüft
- `smoke_netz_eigen`: 63 grün · 0 rot. Abschnitt A misst Byte-Gleichheit gegen `origin/main`
  (eingefrorene Uhr, eingefrorener Zufall); ohne Git und ohne `NETZ_ALT` heißt er ⊘, nie grün.
- Gegenprobe in einer Wegwerf-Kopie: 14 gefangen · 0 blind · 0 aus falschem Grund · 0 tote
  Anker; jede erste rote Zeile trägt den Namen ihrer Zusicherung.
- Voller Lauf `node tests/run_alle.mjs`: Ergebnis im PR-Text.
- `tests/manual_check.html`: ungeprüft — die Änderung betrifft keine Seite, nur Kanon-Module,
  die noch keine Seite mit Einstellung aufruft.

## Benannte Grenzen
- Der Handschlag `sbkim-anastomosis` (Modul 05) bleibt Klartext.
- Ein kurzer Code lässt sich durchprobieren, wenn jemand Karten vom Relais mitliest; deshalb
  mindestens 12 Zeichen und `newNetCode()` mit 20 Zeichen.
- Vorbestehend, nicht von hier: das Vollbündel meldet `siegel-inhalt.js` nicht byte-1:1
  (auf `origin/main` ebenso).

## Offen (Schritt 2 ff.)
- 23-UI: Einstellung „Netz“, Code erzeugen/zeigen, Auto-Verbinden im eigenen Netz.
- Verteilung an den Sende-Prüfer als ersten Träger.
- Schritt 4: Relais „intern Family Project“ unter `wss://relay-intern.family-projekt.de` auf dem Hetzner Cloud-Server (DNS bei INWX, Container, Caddy-Block).
