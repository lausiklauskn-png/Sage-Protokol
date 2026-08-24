# tools/ — Andock-Werkzeuge (SBKIM)

Lauffähige Hilfen für den Inter-Knoten-Austausch über das SBKIM/Sage-Protokoll.
Sie fahren den **echten** Modul-02-Verifizierer (`src/modules/02_spore.js`,
`SbkimSpore.verifyForeignSpore`) headless über Node — **kein Zweitcode**, keine
Drift gegenüber dem Browser-Pfad. Node ≥ 18 (getestet v22, WebCrypto Ed25519).

Empfangsmodus-konform: jede Netzanfrage ist **eine bewusste Eigenanfrage** auf eine
genannte URL — kein Crawler, kein Dauerlauf, keine Wiederholung.

## `antragsmappe-bauen.mjs`

Baut **[`docs/antragsmappe.html`](../docs/antragsmappe.html)** aus neun
Markdown-Quellen — eine Datei, zwei Abteilungen: der Fahrplan
Forschungsgelder (privat, Arbeitspapier) und die Forschungsunterlagen
(einreichbar). Jede Abteilung hat einen eigenen Download- und Druck-Knopf und
nimmt beim Herausnehmen **nur sich selbst** mit.

```bash
node tools/antragsmappe-bauen.mjs            # Stand = heute
node tools/antragsmappe-bauen.mjs --datum=2026-08-23   # fester Stand
```

**Die Mappe wird erzeugt, nicht gepflegt.** Wer den Inhalt ändert, ändert die
`.md` und baut neu — sonst stünden dieselben Sätze zweimal im Depot und liefen
auseinander. `tests/smoke_antragsmappe.mjs` schlägt an, wenn die abgelegte
Datei nicht der aktuelle Bau ist.

**Markieren und auslesen.** In der Mappe lässt sich Text mit Maus oder Finger
ziehen und in drei Farben markieren, mit optionaler Notiz. Es geht dabei ums
**Kürzen** (Klaus 2026-08-24):

| | heißt |
|---|---|
| **grün** | soll bleiben |
| **gelb** | kann bleiben oder weg — Claude wägt ab |
| **rot** | kann komplett weg |

**Im Zweifel bleiben** — „lieber bleiben als weg". Der Satz steht in der Tafel
und reist in der ausgelesenen Liste mit, weil die Liste ohne diesen Chat
gelesen wird. Der Knopf oben rechts öffnet die Tafel; von dort geht die
Liste als `.md`-Datei oder in die Zwischenablage. Die Schicht liegt in
`antragsmappe-markieren.mjs`.

Drei Dinge daran sind Absicht:

- **Markierungen werden nie gedruckt und nie mitgeladen.** Die
  Einreich-Abteilung geht zur Behörde; ein „muss geändert werden"-Streifen
  darin wäre das Gegenteil dessen, wofür die Markierungen da sind. Wer sie auf
  Papier braucht, druckt die ausgelesene Liste.
- **Geankert wird am TEXT, nicht an der Stelle im Dokument.** Die Mappe wird
  neu gebaut, sobald sich eine `.md` ändert — eine Markierung an „Absatz 412"
  säße danach lautlos woanders. Gespeichert werden Quelldatei, markierter Text
  und das wievielte Vorkommen. Findet sich das nicht mehr, heißt die Markierung
  **verwaist** und wird gemeldet, statt zu verschwinden.
- **Der Speicher kann versagen, und dann wird es gesagt.** `localStorage` wirft
  im privaten Fenster. Wer fünfzig Stellen markiert und es erst beim nächsten
  Öffnen merkt, hat umsonst gearbeitet.
- **Die Bedeutung steht als WORT auf dem Knopf, die Farbe wird GEZEICHNET.**
  Beides kam aus einem echten Befund: die Erklärung stand zuerst nur im
  `title` — auf einem Tablet gibt es kein Hover, dort ist ein Tooltip
  unerreichbar. Und die Farben waren Emoji; fehlt die Schrift des Geräts,
  wird aus „🟩 1 · 🟨 1 · 🟥 1" schlicht „1 · 1 · 1". Klaus am 2026-08-24:
  *„Du hast da stehen nur Zahlen, deswegen konnte ich nicht erkennen, was du
  damit meinst."* Der Farbtupfen ist seitdem eine CSS-Fläche.

Der Markdown-Leser dazu ist `markdown-mini.mjs` — bewusst klein, ohne
Laufzeit-Abhängigkeit. Bewacht wird an ihm **nicht** die Optik, sondern dass er
nichts **verschluckt**: jede der 2.799 Quellzeilen muss mit ihrem Klartext in
der Ausgabe wiederauftauchen. Dazu zwei Proben und eine Gegenprobe:

```bash
node tests/smoke_antragsmappe.mjs            # liest die Datei
node tests/smoke_antragsmappe_browser.mjs    # öffnet sie wirklich (playwright-core)
node tests/smoke_antragsmappe_markieren.mjs  # markiert, druckt, lädt, liest aus
node tests/gegenprobe_antragsmappe.mjs       # 31 eingebaute Fehler, jeder MUSS auffallen
```

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
