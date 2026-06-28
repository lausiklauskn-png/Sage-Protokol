# SBKIM-Verbinden-Bundle

**Eine PWA in das SBKIM-Mycel bringen — mit ein paar Script-Tags + einem Aufruf.**

Dieses Bundle bündelt alles, was ein Knoten braucht, um sich **server-los** mit
anderen SBKIM-Knoten zu verbinden: eigene Identität (Ed25519-Spore), Bedeutungs-
Match, Handshake über ein Nostr-Relais und den **gemeinsamen Raum (Rendezvous)**
mit dem öffentlichen Knopf **„🌐 Mit dem Netz verbinden"**.

Es löst die **Adress-Wand** (committete `nodeId` ≠ lebende `nodeId`): lebende
Knoten treffen sich im geteilten Raum, heften ihre **lebende** Visitenkarte ans
Brett und handshaken die **lebende** ID — kein GitHub-Commit nötig, um sich live
zu verbinden.

> **Quelle der Wahrheit:** Die `modules/`-Dateien sind **byte-1:1-Kopien** aus
> `Sage-Protokol/src/modules/`. Nicht hier abwandeln — bei Updates neu kopieren
> (ein Drift-Guard im Smoke-Test wacht darüber).

---

## Einbau in 2 Schritten

### 1. Bundle in deine App kopieren

Kopiere den Ordner `sbkim-bundle/` in dein Repo (oder lade die Dateien herunter).
Alle Dateien sind abhängigkeitsfrei (kein npm, kein Bundler); `05b` lädt nur die
lokal mitgelieferte `noble-secp256k1.js` (kein CDN).

### 2. Script-Tags + ein `init()` einfügen

Vor `</body>` (Reihenfolge ist wichtig):

```html
<script src="sbkim-bundle/modules/01_storage.js"></script>
<script src="sbkim-bundle/modules/02_spore.js"></script>
<script src="sbkim-bundle/modules/03_embedding.js"></script>
<script src="sbkim-bundle/modules/04_match.js"></script>
<script src="sbkim-bundle/modules/05_anastomose.js"></script>
<script type="module" src="sbkim-bundle/modules/05b_nostr_relay.js"></script>
<script src="sbkim-bundle/modules/23_rendezvous.js"></script>
<script src="sbkim-bundle/modules/23_rendezvous_ui.js"></script>
<script src="sbkim-bundle/sbkim-connect.js"></script>
<script>
  SbkimConnect.init({
    dbSuffix:          "meineapp",                 // eigener IndexedDB-Suffix (eindeutig je App-Origin!)
    nodeName:          "Meine App",                // Anzeigename im Raum
    endpoint:          "https://example.org/meineapp/",
    domain:            "meine-domaene",
    domainDescription: "Was die App ist, wofür man sie nutzt, welche Themen sie abdeckt … (3–8 Sätze).",
    domainKeywords:    ["Stichwort A", "Stichwort B", "Stichwort C"],
    // optional:
    // stammCategories: [...], guestCategories: [...],
    // nodeType: "hybrid", corner: "bl"  // bl|br|tl|tr
  });
</script>
```

Das war's. Unten links erscheint **„🌐 Mit dem Netz verbinden"**.

---

## So funktioniert es für den Nutzer

- **🌐 Mit dem Netz verbinden** — ein Klick: Identität erzeugen (falls noch keine
  da, lädt einmalig das ~30-MB-Embedding-Modell) + lebende Visitenkarte in den
  Raum heften + lauschen. Tab offen lassen, damit man erreichbar bleibt.
- **👥 Wer ist im Raum?** — liest die lebenden Visitenkarten der anderen Knoten.
- **🤝 Andocken** (pro Karte) — Handshake an die **lebende** ID. Liegt die
  Bedeutungs-Ähnlichkeit beider Domänen unter **0.80**, lehnt der Knoten lokal
  ab (`rejected-local`) und sendet bewusst nichts — kein Fehler, nur zu
  verschiedene Domänen.

---

## Was im Bundle steckt

| Datei | Rolle |
|---|---|
| `modules/01_storage.js` | IndexedDB-Wrapper |
| `modules/02_spore.js` | Identität (Ed25519-Spore), lokal |
| `modules/03_embedding.js` | Domain-Vektor (nur bei Identitäts-Erzeugung) |
| `modules/04_match.js` | Bedeutungs-Cosinus + 0.80-Schwelle |
| `modules/05_anastomose.js` | Handshake + `listenNostr` (Empfangsmodus) |
| `modules/05b_nostr_relay.js` | Relais-Client (browser-only, `type=module`) |
| `modules/noble-secp256k1.js` | Schnorr/BIP340 für 05b (lokal, kein CDN) |
| `modules/23_rendezvous.js` | Gemeinsamer Raum (Logik, DOM-frei) |
| `modules/23_rendezvous_ui.js` | Öffentlicher 🌐-Floating-Knopf |
| `sbkim-connect.js` | Ein-Aufruf-Glue (`SbkimConnect.init`) |
| `beispiel.html` | Minimal-Beispielseite |

---

## Verfassung / Datenschutz

- **Empfangsmodus mit Antwortrecht:** der Knoten antwortet nur auf eingehende
  Handshakes, initiiert NIE von selbst. Kein Crawler, keine Pulsation, kein
  Auto-Connect beim Laden — alles ist nutzer-ausgelöst.
- **Privater Schlüssel bleibt lokal** (IndexedDB). Nur die **öffentliche** Spore
  (Visitenkarte) erscheint im Raum. Kein PII.
- **Eigener `dbSuffix` pro App-Origin** ist Pflicht-Empfehlung, sonst kollidieren
  Geschwister-Apps auf demselben Origin (z. B. GitHub Pages).

---

## Eigenheiten beim Einbau (je App)

- **Single-File-PWAs** (z. B. byte-identische `index.html`/QC-Spiegel): die
  Script-Tags in **beide** Spiegel einfügen und Byte-Identität wahren.
- **Build-Schritt-Apps** (z. B. `build.py` aus Quell-Datei): die Tags in die
  **Quell-Datei** schreiben, dann bauen.
- **Service-Worker-Apps:** nach dem Deploy **Hard-Reload (Strg+Shift+R)**, sonst
  liefert der SW die alte Seite ohne den Knopf. Module ggf. in die SW-Precache-
  Liste / Runtime-Cache aufnehmen, wenn Offline-Betrieb gewünscht ist.

---

## Dauerhafte Registrierung (optional, eigene Schicht)

Live-Verbinden braucht **kein** GitHub. Wer zusätzlich dauerhaft auffindbar und
reziprok verifiziert sein will (Briefkasten / `status.json` / verified-match),
committet seine öffentliche Spore separat — das ist die **Profi-/Persistenz-
Schicht**, kein Tor zum Mitmachen.
