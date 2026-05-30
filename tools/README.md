# tools/ — Andock-Werkzeuge (SBKIM)

Lauffähige Hilfen für den Inter-Knoten-Austausch über das SBKIM/Sage-Protokoll.
Sie fahren den **echten** Modul-02-Verifizierer (`src/modules/02_spore.js`,
`SbkimSpore.verifyForeignSpore`) headless über Node — **kein Zweitcode**, keine
Drift gegenüber dem Browser-Pfad. Node ≥ 18 (getestet v22, WebCrypto Ed25519).

Empfangsmodus-konform: jede Netzanfrage ist **eine bewusste Eigenanfrage** auf eine
genannte URL — kein Crawler, kein Dauerlauf, keine Wiederholung.

## `verify_remote_spore.mjs`

Holt eine fremde (oder eigene) `spore.json` per URL **oder** Datei und prüft Identität
+ Signatur mit dem Produktiv-Verifizierer.

```bash
# Fremde, live veröffentlichte Spore:
node tools/verify_remote_spore.mjs https://<host>/sbkim/spore.json

# Lokale Datei:
node tools/verify_remote_spore.mjs sbkim/spore.json

# Selbsttest (eigene Spore, ohne Argument):
node tools/verify_remote_spore.mjs
```

Exit-Code 0 = `✔ VALID`, 1 = `✗ INVALID` / Abruf-Fehler (mit Grund).

## `make_example_spore.mjs`

Erzeugt eine vollständig gültige, kanonisch signierte **Referenz**-Spore (flüchtiger
Demo-Schlüssel, Demo-`domainVector` mit `_demo`-Markierung) im Zielschema. Dient als
nachprüfbares Beispiel für andockende Knoten.

```bash
node tools/make_example_spore.mjs            # -> sbkim/example_sbkimtool_spore.json
node tools/verify_remote_spore.mjs sbkim/example_sbkimtool_spore.json   # -> ✔ VALID
```

> Der Schlüssel ist pro Lauf neu = **keine bleibende Identität**. Echte Knoten
> hinterlegen ihren privaten Schlüssel als Umgebungs-Secret und publizieren nur den
> öffentlichen Teil (siehe SB·KIMTool·Point `docs/ANDOCK.md` §3).

## Pflichtfelder, die der Verifizierer verlangt

`createdAt, domain, embeddingModel, endpoint, id, nodeType, protocolVersion, publicKey, signature`
— alle müssen **beim Signieren** in der Spore stehen (sie wandern in die kanonischen
Bytes). `domainVector` ist für die *Identitäts*-Verifikation nicht Pflicht.
