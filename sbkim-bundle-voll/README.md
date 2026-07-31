# SBKIM Voll-Knoten-Geschenkbox

**Eine PWA zu einem VOLLEN Mycel-Knoten machen — Verbinden + Vertrauens-Siegel
+ Schutz-Lampen + Andock-Wizard + Suche, aus einem Ordner.**

Das ist die große Schwester des schlanken [`sbkim-bundle/`](../sbkim-bundle/)
(nur „Verbinden"). Wer nicht nur mit dem Netz reden, sondern auch das **sichtbare
Vertrauens-Gesicht** (SBKIM-Siegel, Status-Lampen, Andock-Wizard, verschlüsselter
Schlüssel-Safe, semantische Suche) will, nimmt diese Box.

> **Quelle der Wahrheit / kopieren, nicht klonen:** Alle Dateien in `modules/`
> sind **byte-1:1-Kopien** aus `Sage-Protokol/src/modules/` (bzw.
> `assets/siegel-inhalt.js`). **Nicht hier abwandeln** — reift ein Modul, wird es
> neu kopiert. Ein Drift-Guard (`tests/smoke_vollbundle.mjs`) wacht per SHA-256.

> **Was die Box NICHT ändert:** Der 0.80-Andock-Riegel (Modul 05) und deine
> Prüfung als Betreiber bleiben. Die Box macht das Andocken *technisch* leicht,
> nicht *automatisch* (Empfangsmodus).

---

## Was drin ist

**Verbinden-Kern** (wie im schlanken Bundle):

| Datei | Global | Rolle |
|---|---|---|
| `modules/01_storage.js` | `SbkimStorage` | lokaler Speicher (app-eigene Schublade) |
| `modules/02_spore.js` | `SbkimSpore` | Identität + Spore (Ed25519) |
| `modules/03_embedding.js` | `SbkimEmbedding` | Bedeutungs-Vektor |
| `modules/04_match.js` | `SbkimMatch` | Bedeutungs-Match |
| `modules/05_anastomose.js` | `SbkimAnastomose` | Handshake (0.80-Riegel) |
| `modules/05b_nostr_relay.js` | `SbkimNostrRelay` | server-loser Transport |
| `modules/23_rendezvous.js` | `SbkimRendezvous` | gemeinsamer Raum + **Kartenechtheit + Flut-Deckel** |
| `modules/23_rendezvous_ui.js` | `SbkimRendezvousUI` | „Wer ist im Raum?"-Oberfläche |
| `modules/noble-secp256k1.js` | — | Krypto-Baustein (lokal) |
| `sbkim-connect.js` | `SbkimConnect` | Ein-Aufruf-Glue für den Kern |

**Vertrauen + Oberfläche** (das Plus der Voll-Box):

| Datei | Global | Rolle |
|---|---|---|
| `modules/17_floating_widget.js` | `SbkimWidget` | Status-Lampen LEBT/VERKEHR/FREMD/SIEGEL |
| `modules/15_membran.js` | `SbkimMembrane` | Außenhülle: Fremdzugriff-Detektor |
| `modules/16_siegel.js` | `SbkimSiegel` | SBKIM-Siegel (Bronze→Gold) |
| `modules/siegel-inhalt.js` | — | Inhalt des Siegel-Modals (Andock-Werkzeug) |
| `modules/19_andock_wizard.js` | `SbkimAndockWizard` | Andock-Assistent (Spore-Vorlage + PR) |
| `modules/20_schluessel_safe.js` | `SbkimSafe` | verschlüsselter Schlüssel-Safe (BYOK) |
| `modules/21_spracheingabe.js` | `SbkimSpeech` | Spracheingabe (Mikro → Text), optional |
| `modules/22_such_widget.js` | `SbkimSearchWidget` | frei bewegliches Such-Widget, optional |
| `modules/24_ocr_eingabe.js` | `SbkimOcr` | Bild/Handschrift → Text, optional |

Ein lauffähiges Vorbild steht in [`beispiel-voll.html`](beispiel-voll.html).

---

## Schnellweg: der Installer (ein Befehl)

Für Terminal-Nutzer (PC oder Termux) — kopiert die Box in dein Repo **und** trägt
die Script-Zeilen in `index.html` ein, in einem Schritt. Plattformübergreifend
(Windows/macOS/Linux/Android), nur Node, **kein npm**.

```bash
# im Ordner deines Repos (wo die index.html liegt):
node sbkim-bundle-voll/install.mjs

# oder ohne die Box vorher zu holen — direkt aus dem Netz:
node install.mjs --fetch --target .

# nur zeigen, was passieren würde (schreibt nichts):
node install.mjs --dry
```

Er ist **idempotent** (zweiter Lauf setzt den Block nicht doppelt), **fail-soft**
(fehlt die `index.html`, kopiert er trotzdem die Box und sagt dir Bescheid) und
ändert **nur** `sbkim-bundle-voll/*` und additiv deine `index.html`. Danach den
eingesetzten `init()`-Vorlage-Block mit deinen Werten füllen und einkommentieren.

Wer keinen Terminal nutzt, nimmt stattdessen den manuellen Weg:

---

## Einbau in 3 Schritten (manuell)

### 1. Ordner kopieren

Kopiere `sbkim-bundle-voll/` in dein Repo. Abhängigkeitsfrei (kein npm, kein
Bundler, kein CDN).

### 2. Script-Tags — **Reihenfolge ist wichtig**

```html
<!-- Verbinden-Kern -->
<script src="sbkim-bundle-voll/modules/noble-secp256k1.js"></script>
<script src="sbkim-bundle-voll/modules/01_storage.js"></script>
<script src="sbkim-bundle-voll/modules/02_spore.js"></script>
<script src="sbkim-bundle-voll/modules/03_embedding.js"></script>
<script src="sbkim-bundle-voll/modules/04_match.js"></script>
<script src="sbkim-bundle-voll/modules/05_anastomose.js"></script>
<script src="sbkim-bundle-voll/modules/05b_nostr_relay.js"></script>
<script src="sbkim-bundle-voll/modules/23_rendezvous.js"></script>
<script src="sbkim-bundle-voll/modules/23_rendezvous_ui.js"></script>
<script src="sbkim-bundle-voll/sbkim-connect.js"></script>
<!-- Vertrauen + Oberfläche: 17_floating_widget VOR 15_membran VOR 16_siegel! -->
<script src="sbkim-bundle-voll/modules/17_floating_widget.js"></script>
<script src="sbkim-bundle-voll/modules/15_membran.js"></script>
<script src="sbkim-bundle-voll/modules/siegel-inhalt.js"></script>
<script src="sbkim-bundle-voll/modules/16_siegel.js"></script>
<!-- Onboarding + Safe + (optional) Suche/Eingabe -->
<script src="sbkim-bundle-voll/modules/19_andock_wizard.js"></script>
<script src="sbkim-bundle-voll/modules/20_schluessel_safe.js"></script>
<script src="sbkim-bundle-voll/modules/21_spracheingabe.js"></script>
<script src="sbkim-bundle-voll/modules/22_such_widget.js"></script>
<script src="sbkim-bundle-voll/modules/24_ocr_eingabe.js"></script>
```

> **Warum `17_floating_widget` VOR `15_membran` / `16_siegel`?** Das Widget legt
> die Lampen-Proxy-Elemente an, die Membran (FREMD) und Siegel (SIEGEL) dann
> bedienen. Andersherum finden 15/16 ihre Anzeige-Slots nicht.

### 3. Ein `init()`-Block

```js
(async () => {
  // (a) Verbinden-Kern in einem Aufruf
  await SbkimConnect.init({
    dbSuffix:          "meineapp",           // eigener IndexedDB-Suffix (Pflicht — Origin-Kollision vermeiden)
    nodeName:          "Meine App",
    endpoint:          "https://meinnutzer.github.io/MeineApp/",
    domain:            "meine-domaene",
    domainDescription: "Was die App ist, in 3–8 Sätzen, mit Synonymen …",
    domainKeywords:    ["Stichwort A", "Stichwort B"],
  });

  // (b) Status-Lampen ZUERST (legt die Proxy-Slots an)
  if (window.SbkimWidget)   await SbkimWidget.init();
  // (c) dann Schutz-Hülle + Siegel
  if (window.SbkimMembrane) await SbkimMembrane.init();
  if (window.SbkimSiegel)   await SbkimSiegel.init({ ribbonText: "Meine App" });

  // (d) Andock-Wizard in ein Element mounten (z.B. im Siegel-Modal oder einer Einstellungs-Karte)
  if (window.SbkimAndockWizard && document.querySelector("#andock-wizard")) {
    SbkimAndockWizard.mount({ container: "#andock-wizard" });
  }

  // (e) optional, auf Abruf (kein Auto-Prompt): Schlüssel-Safe / Suche / Eingaben
  //   await SbkimSafe.init();          // öffnet NICHTS beim Start (autoPrompt Default false)
  //   await SbkimSearchWidget.init();  // 🔍-Blase, self-mount in <body>
})();
```

**Alles fail-soft:** fehlt ein Modul-Script, läuft die App weiter (die App
prüft `if (window.SbkimX)`), das Feature degradiert still. Kein toter Knopf,
kein Crash.

---

## Fremdnutzer-Regeln (gehören in jede Auslieferung)

- **Fail-soft für Fehlendes** — ohne Schlüssel/Mikro/Modul bleibt die App voll
  nutzbar.
- **Klar benennen, was passiert** — Kosten (eigener KI-Schlüssel), Daten-Abfluss
  (an welchen EU-KI-Anbieter), wo der Schlüssel bleibt (nur im Browser, BYOK).
- **Geteilte-Origin-Falle** — `dbSuffix` app-spezifisch setzen, damit
  Geschwister-Apps auf derselben Adresse (`github.io`, `family-projekt.de`) sich
  nicht stören.
- **Kein PII, kein privater Schlüssel** im ausgelieferten Repo.

---

## Beweis

```bash
node sbkim-bundle-voll/tests/smoke_vollbundle.mjs   # Drift-Guard: alle Module byte-1:1 gegen den Kanon
```

Der **Browser-Sichttest** (Installation als PWA + Andock im Raum + Siegel-Badge
sichtbar) bleibt bei dir — headless ersetzt ihn nicht.
