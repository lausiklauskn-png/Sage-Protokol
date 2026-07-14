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

## `resign_spore_v02.mjs` — Neu-Signier-Welle (Spore v0.2, A6 + A10)

Signiert die **eigene, bereits veröffentlichte** `spore.json` mit der **bleibenden**
Identität (Schlüssel aus dem Umgebungs-Secret `SBKIM_NODE_KEY`) neu auf
`protocolVersion "0.2"` und hängt optional die **A10-`snippetVectors`** an. Der echte
`domainVector` aus der bestehenden Spore bleibt erhalten (A6 bleibt echt). Zum Schluss
verifiziert das Skript die Ausgabe mit dem **echten Modul-02-Verifizierer** (`✔ VALID`).

Zwei-Hälften-Arbeitsteilung (das e5-Modell läuft nur im Browser):

1. **Browser** — `tools/embed_helper.html` öffnen → Abschnitt „A10 — `snippetVectors`" →
   Domänen-Text eingeben → *Schnipsel-Vektoren erzeugen* → **als `snippets.json` speichern**.
2. **Termux/Node** — mit dem stabilen ENV-Schlüssel neu signieren:

```bash
# v0.2-Bump + Schnipsel anhängen:
SBKIM_NODE_KEY='<jwk-json | 32-Byte-Seed hex/base64>' \
  node tools/resign_spore_v02.mjs --snippets snippets.json

# Nur v0.2-Bump ohne Schnipsel (A6-Schließung, domainVector bleibt echt):
SBKIM_NODE_KEY='…' node tools/resign_spore_v02.mjs
```

- `--in <pfad>` (Default `sbkim/spore.json`) · `--out <pfad>` (Default = `--in`) ·
  `--snippets <pfad>` (JSON `[{vec,text?}]` oder `{snippetVectors:[…]}` aus dem Browser).
- Der Schlüssel muss zur `id` der Spore passen — sonst **Abbruch** (kein stiller
  Identitäts-Wechsel). Ohne `SBKIM_NODE_KEY` tut das Skript nichts.
- **Nur die öffentliche `spore.json` committen.** Der private Schlüssel bleibt im ENV.

> **App-Knopf-Pfad (pro Endknoten-PWA):** In den Apps läuft dieselbe Welle über den
> **Siegel-„✍ Semantik → Spore neu signieren"-Pfad** (lebende Identität im Browser, ggf.
> über Modul 20 Safe), jetzt v0.2 inkl. `embedSnippets`. Der netzweite Rollout des Knopfs
> ist eine Folge-Sitzung pro App; dieses Skript ist der ENV-Schlüssel-Pfad für Repos, deren
> Schlüssel als Secret liegt.

## Pflichtfelder, die der Verifizierer verlangt

`createdAt, domain, embeddingModel, endpoint, id, nodeType, protocolVersion, publicKey, signature`
— alle müssen **beim Signieren** in der Spore stehen (sie wandern in die kanonischen
Bytes). `domainVector` ist für die *Identitäts*-Verifikation nicht Pflicht.
