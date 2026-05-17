# Browser-Observatorium

> **Dies ist NICHT die Sage-Page.** Die Sage-Page (`index.html`) ist das visuelle
> Observatorium für den Modul-Stand. Hier liegen die **technischen Lehren
> aus dem realen Andock-Betrieb** — was lauert in Browser-Instanzen,
> IndexedDB-Persistenz, BroadcastChannel-Bedingungen und Service-Worker-Cache.
>
> Adressat: Andocker, Endknoten-Programmierer, neue Sitzungen, die SBKIM auf
> einem oder mehreren Rechnern mit unterschiedlichsten Betriebssystemen und
> Browsern aufsetzen wollen.
>
> Pflege-Disziplin: neue Befunde **unten** anhängen mit Datum + Reproduzierbarkeits-
> Skizze + ggf. Workaround. Bestehende Einträge nicht überschreiben — Befund
> bleibt Befund, auch wenn er später anders zu verstehen ist.

---

## Lehre 1 — Browser-Instanzen sind oft getrennter, als man denkt

**Beobachtung 2026-05-17 (Klaus, Galaxy Tab S6 + Samsung DeX):** Wenn DeX am
externen Monitor läuft und das Tablet-Display im normalen Touch-Modus
parallel läuft, sind **DeX-Chrome** und **Tablet-Chrome** faktisch zwei
getrennte Browser-Instanzen — mit eigener IndexedDB, eigener
Service-Worker-Registration, eigener PWA-Liste, eigenen Bookmarks. Eine
PWA-Installation in DeX ist im Tablet-Modus nicht sichtbar. Eine
gelöschte PWA im DeX-Modus bleibt im Tablet-Modus weiter installiert.
Eine Spore-Identität, die im DeX-Modus via `__sbkimErzeugeSpore()` angelegt
wurde, ist im Tablet-Modus nicht da — und umgekehrt.

### Generalisierung

Dasselbe Phänomen tritt auf in:

- **Chrome-User-Profile** auf Desktop (Windows/macOS/Linux): jedes Profil
  hat eigene IndexedDB. Identitäten leben **pro Profil**, nicht pro
  Installation.
- **Inkognito-Modus** (privates Fenster): eigener flüchtiger Storage,
  verschwindet beim Schließen.
- **Standalone-PWA vs. Tab-Modus**: dieselbe Origin, aber Chrome trennt den
  Storage bei einigen Konfigurationen.
- **App-isolierte iOS-Browser** (jede iOS-App mit eingebettetem WebView
  hat eigenen Speicher).

### Konsequenzen für SBKIM

- **`BroadcastChannel('sbkim')` funktioniert nur innerhalb derselben
  Browser-Instanz.** Zwei PWAs same-origin, aber in zwei verschiedenen
  Instanzen — sie sehen sich nicht. Der Channel-Bridge-Pfad
  (Karte 05 § BroadcastChannel-Bridge) endet in Timeout.
- **Spore-Identitäten sind pro Browser-Instanz.** Wer in DeX andockt und
  später am Tablet testet, bekommt „SBKIM-Andock bereit. Spore erzeugen
  mit `__sbkimErzeugeSpore()`" angezeigt — als wäre nie angedockt worden.
- **Pages-deployte `spore.json` ist ein Snapshot einer einzigen Andock-
  Session.** Wer in mehreren Browser-Instanzen unterschiedlich andockt
  und dann pusht, hat eine Pages-Spore mit der ID der zuletzt-pushenden
  Instanz — die anderen Instanzen kennen diese ID nicht als ihre eigene.

### Workarounds

- **Single-Instance-Disziplin:** in einer Browser-Instanz bleiben. Beide
  PWAs (Mein-Rezeptbuch + Mein-Mixarium) in DeX-Chrome ODER beide in
  Tablet-Chrome — nicht mischen.
- **Backup-Import:** Modul 02 (`SbkimSpore.exportBackup` /
  `importBackup`, Bau 02.X 2026-05-16) erlaubt Identitäts-Transfer
  zwischen Browser-Instanzen. PBKDF2-SHA256-600.000-Runden +
  AES-GCM-256-verschlüsselt, Klartext bleibt in der Browser-Welt.
- **Diagnose-Einzeiler** zum Auflisten der echten Identität, bevor man
  testet:
  ```js
  SbkimSpore.getOwnSpore().then(s => alert(s ? "Identität vorhanden: " + s.id : "KEINE Spore in diesem Tab"));
  ```

### Vorteile (denn jede Tiefe hat einen Boden)

- **Mehrere Browser-Instanzen = kostenlose Multi-Knoten-Testumgebung.**
  Wer keinen zweiten Rechner hat, kann zwei Chrome-Profile (oder DeX +
  Tablet) als zwei Knoten verwenden — same-origin Channel-Bridge wäre
  zwar tot, aber HTTP-Pfad mit Service-Worker funktioniert (cross-origin)
  oder ein VM/Container-Setup.
- **Inkognito = saubere frische Identität.** Für Test-Runs ohne
  hinterlassenen IndexedDB-Müll.
- **DeX-Desktop-Chrome auf Tablet ist eine vollwertige Test-Plattform.**
  Multi-Window, weniger aggressive Hintergrund-Tab-Suspendierung als
  Mobile-Chrome, Maus + Tastatur — Klaus' bevorzugtes Setup.

---

## Lehre 2 — IndexedDB ist persistent, aber nicht unsterblich

**Beobachtung 2026-05-17 (Klaus):** Nach mehreren Andock-Sitzungen
2026-05-16 hatte Mein-Rezeptbuch und Mein-Mixarium jeweils eine angedockte
Identität (siehe PULS-Eintrag „integriert 2026-05-16"). Am 2026-05-17 nach
dem PR-#75-Merge zeigten beide DeX-Chrome-Tabs „SBKIM-Andock bereit. Spore
erzeugen mit `__sbkimErzeugeSpore()`" — die Identität war weg. Ursache
nicht abschließend geklärt: vermutlich entweder ein Chrome-Update,
„Site-Daten löschen" für den Origin, eine versehentliche
PWA-Deinstallation, oder eine Storage-Quota-Reklamation.

### Was IndexedDB löscht (und was nicht)

| Aktion | IndexedDB betroffen? |
|---|---|
| Browser-Tab schließen | nein (persistent) |
| Browser-Instanz beenden | nein |
| Browser-Profil wechseln | nicht im neuen Profil — alte Instanz behält ihn |
| „Cache leeren" / „Browserverlauf löschen" → nur Cache | meist nicht |
| „Cookies und Sitedaten löschen" für **diese Site** | **ja, vollständig** |
| „Daten beim Schließen löschen" (Einstellung) | **ja** |
| PWA deinstallieren (Standalone-Modus) | je nach Browser **ja** oder nein |
| Chrome-Update | meistens nicht — aber selten Migrations-Fehler |
| Storage-Quota-Druck (zu wenig freier Speicher) | **ja, „best effort"-Daten werden reklamiert** |
| Standard-Persistenz (kein `navigator.storage.persist()`) | reklamiert-möglich bei Druck |

### Empfehlungen für SBKIM-Andocker

- **`navigator.storage.persist()` anfragen** — Modul 01 (Storage) macht
  das standardmäßig ja schon, prüfe via Modul 00 (Doku-Fenster):
  `SbkimDoku.getStatusSnapshot().storagePersisted` muss `true` sein
  (Chrome auto-erlaubt das für PWAs). Wenn `false` ⇒ Browser hat
  Persistenz nicht zugesichert, IndexedDB ist „best effort".
- **Regelmäßiges Backup** mit Modul 02 (`exportBackup(password)`) und
  Ablegen in einem Cloud-Speicher oder lokalen Sync. Mindestens
  einmal nach Andock + nach jeder größeren Pflege.
- **Pages-`spore.json` ist KEIN Backup** der Identität. Die Pages-Datei
  enthält Spore + Public-Key + Signatur. Aber **kein Private-Key**. Bei
  IndexedDB-Verlust ist die Identität verloren, auch wenn die Pages-Spore
  noch da steht — neu andocken ist dann der einzige Weg, und die
  Pages-Spore muss überschrieben werden.

### Vorteile

- **„Best effort"-Default ist gut genug für den Alltag.** Klaus' echter
  Daten-Verlust am 2026-05-17 war händelbar (5-10 Min Neu-Andock pro
  PWA) — kein Modul-Code zu fixen, nur Pflege-Geste.
- **Backup-Export-Import ist ein vollwertiges Identitäts-Migration-Tool.**
  Wer von einem Rechner auf einen anderen wechselt: einmal exportieren,
  einmal importieren, fertig — Identität reist mit.

---

## Lehre 3 — BroadcastChannel ist same-origin UND same-instance

**Beobachtung 2026-05-17 (Klaus, Live-Channel-Handshake-Test):** Der
Channel-Pfad (`BroadcastChannel('sbkim')`) trägt nur, wenn beide Tabs
(Sender + Empfänger) in **derselben** Browser-Instanz laufen. DeX-Chrome
und Tablet-Chrome haben getrennte IPC-Kanäle — Tabs in verschiedenen
Instanzen sehen sich nicht.

### Konkrete Voraussetzungen

| Bedingung | nötig für Channel-Bridge? |
|---|---|
| Same-origin (Scheme + Host + Port) | **ja** (Browser-Sicherheits-Grenze) |
| Same Browser-Instanz (kein Profil-Wechsel, kein DeX/Tablet-Mix) | **ja** |
| Beide Tabs aktiv geladen + `SbkimAnastomose.init()` durch | **ja** |
| Receiver-Tab im Vordergrund | **nein** (BroadcastChannel-Events feuern auch im Hintergrund) |
| Receiver-Tab nicht „discarded" (Chrome reklamiert Speicher) | **ja** |
| Service-Worker aktiv | **nein** (Channel-Pfad geht am SW vorbei) |
| Beide Tabs im Vordergrund (Split-Screen) | **nein**, aber **sehr empfehlenswert** in Mobile-Chrome |

### Mobile-Chrome-Tab-Suspendierung

Mobile-Chrome (Android, normaler Touch-Modus) suspendiert
Hintergrund-Tabs nach einigen Sekunden bis Minuten. Wenn der
Receiver-Tab dabei „discarded" wird (Chrome reklamiert RAM), ist der
Channel-Listener weg → Sender bekommt Timeout (`HandshakeTimeoutError`,
Log-Zeile `"timeout-channel"`).

**Workarounds:**

- **DeX-Desktop-Modus** oder Tablet-Multi-Window: beide Tabs gleichzeitig
  sichtbar → keiner wird suspendiert.
- **Zwei Browser-Fenster nebeneinander** (Chrome erlaubt mehrere
  Fenster pro Instanz auf Desktop und in DeX): jedes Fenster ist
  individuell sichtbar.
- **Schnelles Test-Tempo:** Tab B kurz aktivieren (Tab-Wechsel),
  dann in Tab A den Handshake-Block ausführen — der Receiver-Listener
  in Tab B bleibt für mindestens ~30 s warm.

### Vorteil

**BroadcastChannel löst das same-origin-cross-PWA-Problem elegant.** Die
Architektur-Grenze „Subresource-Fetches gehen durch den SW des Senders,
nicht durch den des Empfängers" (PR #72/#73) gilt unverändert — aber
BroadcastChannel umgeht den SW komplett und routet **direkt** zwischen
Tabs derselben Instanz. Cross-domain bleibt unverändert HTTP-only.

---

## Lehre 4 — Service-Worker-Cache + Modul-Updates brauchen File-Rename

**Beobachtung 2026-05-17 (Klaus, Endknoten-Pflege nach PR #75):** Beim
Update einer JS-Modul-Datei in einem Endknoten reicht ein `git push` allein
nicht aus — Browser, Service-Worker und GitHub-Pages cachen aggressiv.

### Schichten, die cachen

1. **Browser-HTTP-Cache** für `index.html` und Modul-JS. Default-TTL je
   nach Pages-Konfiguration. Hard-Reload (`Strg+Shift+R`) bypasst das
   meistens.
2. **App-Service-Worker** (Variante 3b in Karte 09): kann statische Assets
   für Offline-Modus cachen. Klaus' beide Endknoten-Apps haben so einen
   App-SW.
3. **GitHub-Pages-Cache** auf CDN-Ebene. Kurze TTL, aber nicht null.

### Cache-Bust-Strategien (in der Reihenfolge der Robustheit)

1. **File-Rename** (z.B. `05_anastomose.js` → `05_anastomose-v2.js` +
   `index.html`-Referenz nachziehen). Der neue Dateiname ist eine andere
   URL, kein Cache-Eintrag → frischer Download. **Empfohlen.**
2. **Query-Parameter** (`05_anastomose.js?v=2`). Der Browser sieht den
   Query als anderen Asset; der App-SW könnte ihn jedoch je nach
   Konfiguration ignorieren oder cachen. **Halb-zuverlässig.**
3. **Service-Worker-Update + Reload** (`navigator.serviceWorker
   .getRegistration().then(r => r.update())` dann `location.reload()`).
   Greift, wenn der SW eine neue Version registriert. **Nicht zuverlässig**,
   wenn der SW nicht selbst aktualisiert wurde.
4. **Service-Worker-Unregister** (`r.unregister()` + Reload). Notfall —
   App-SW wird neu registriert mit frischem Cache. **Robust, aber teuer**
   (App-Offline-Pfade müssen neu aufgebaut werden).

### SBKIM-Konvention

Modul-Dateien per File-Rename busten:

- `05_anastomose.js` → `05_anastomose-v2.js`
- `sbkim-sw.js` → `sbkim-sw-v2.js` (siehe PR #73 Endknoten-Sichttest)

Den `<script>`-Tag in `index.html` per `sed` umstellen:

```bash
sed -i 's|sbkim/05_anastomose.js|sbkim/05_anastomose-v2.js|' index.html
```

Die alte Datei kann als **Rollback-Reserve** vorerst im Repo bleiben; nach
erfolgreichem Sichttest in einer Folge-Pflege löschen (`git rm`).

---

## Lehre 5 — Eruda ≠ Chrome-DevTools

**Beobachtung 2026-05-17 (Klaus, in-Page-DevTools via Eruda auf Tablet):**
Eruda ist ein pragmatischer Tablet-DevTools-Ersatz, aber subtil anders
als Desktop-Chrome-DevTools.

### Konkrete Unterschiede

| Feature | Chrome-DevTools | Eruda |
|---|---|---|
| Top-level `await` in der Console | ✓ direkt | ✗ — wirft `SyntaxError: await is only valid in async functions`. Workaround: in `(async () => { ... })()` wickeln oder `.then()`-Variante. |
| `copy(value)` für Zwischenablage | ✓ zuverlässig | ✗ teilweise blockiert durch Mobile-Permission-Modell. Workaround: Download-File via `Blob` + `<a download>`. |
| Network-Tab-Details | ✓ Headers, Body, Timing | ✓ aber UI knapp |
| Application → IndexedDB-Inspektor | ✓ | ✓ aber Werte verkürzt mit `…` |
| Sources → Breakpoints | ✓ | ✓ rudimentär |
| Top-level-Output mit großen Arrays (z.B. 384-Float-Vektor) | ✓ click-to-expand | ✗ Output abgeschnitten — `console.log(JSON.stringify(obj, null, 2))` als Workaround |

### Praktische Konsequenzen

- **Statt `copy(JSON.stringify(...))`** auf Tablet:
  ```js
  SbkimSpore.getOwnSpore().then(sp => {
    const blob = new Blob([JSON.stringify(sp, null, 2)], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "spore.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  ```
  Datei landet im Android-Downloads-Ordner, Termux kann sie via
  `~/storage/downloads/` lesen.
- **Statt `const x = await ...`** in Eruda:
  ```js
  SbkimAsync.something().then(x => console.log(x));
  ```
- **Statt großem `console.log(obj)`**: gezielt einzelne Felder loggen
  (`obj.foo`, `obj.bar`) oder per `JSON.stringify(obj, null, 2)` als
  Text-Block ausgeben.

### Vorteile von Eruda

- **In-Page-DevTools** auf Mobile/Tablet, wo `Strg+Shift+I` fehlt.
- **Touch-bedienbar**, gut für DeX + Tastatur und reines Touch.
- **Kann temporär eingebaut werden** via Bookmarklet:
  ```
  javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/eruda@3';document.body.appendChild(s);s.onload=function(){eruda.init()};})();
  ```
- **Konsole zeigt Modul-Selbstcheck-Zeilen** (`MODUL XX … bereit, …`) wie
  in Desktop-DevTools — Andock-Sichtkontrolle aus Karte 09 funktioniert.

---

## Lehre 6 — Termux + Android-Storage als Brücke

**Beobachtung 2026-05-17 (Klaus, Termux 0.118 auf Galaxy Tab S6):** Termux
ist ein vollwertiges Linux-Userland auf Android. Mit `termux-setup-storage`
gibt es Symlinks in `~/storage/` auf `/storage/emulated/0/Download/`
etc. Klaus konnte so:

- Spore-Datei aus Eruda-Download (`~/storage/downloads/`) direkt in
  ein lokales Git-Repo kopieren (`~/Mein-Rezeptbuch/sbkim/spore.json`)
- Commit + Push aus Termux direkt nach GitHub Pages
- Lokalen `python3 -m http.server 8000` für den Bau-Sichttest fahren

### Setup-Hinweise

- `pkg install python git termux-api` — Basis.
- `termux-setup-storage` — einmalig, gibt Android-Permission-Dialog.
- `termux-clipboard-get` / `termux-clipboard-set` — wenn `termux-api`-App
  + Pakete installiert sind, gibt's Clipboard-Brücke zur Android-UI.

### Vorteile

- **Single-Device-Multi-PWA-Andock-Workflow** komplett vom Tablet aus:
  Browser zum Andocken/Sichttesten, Termux für Datei-Operationen + Git.
  Klaus hat das ganze Pflege-Pipeline für PR #75 → #76 → diese Pflege
  am Tablet ausgeführt.

---

## Lehre 7 — DeX als ernsthafte Test-Plattform

**Beobachtung 2026-05-17 (Klaus, Samsung DeX auf externem Monitor):**
DeX ist nicht nur „großes Display-Modus" — es ist eine zweite
Browser-Instanz mit eigenständigem Verhalten, plus Desktop-mäßiges Multi-
Window-System. Für SBKIM-Bau-Sichttests besser als Mobile-Touch-Modus.

### Was DeX-Chrome anders macht als Tablet-Chrome

- **Weniger aggressive Hintergrund-Tab-Suspendierung** (Desktop-Verhalten).
- **Multi-Window-Modus** — zwei Chrome-Fenster nebeneinander, beide
  sichtbar → Channel-Bridge-Setup ohne Mobile-Suspend-Risiko.
- **Maus + Tastatur** — Eruda-Bedienung deutlich komfortabler.
- **Hard-Reload via `Strg+Shift+R`** wie Desktop-Chrome.

### Was bleibt schwierig

- **DeX-Chrome ist eine SEPARATE Instanz.** Identitäten aus Tablet-Chrome
  sind nicht da.
- **Storage-Permissions** auf Android können auch in DeX greifen — wer
  Termux nutzt, braucht trotzdem `termux-setup-storage` (einmalig).

---

## Lehre 8 — DeX-Cursor-Overlay ist nicht überschreibbar

**Beobachtung 2026-05-17 (Klaus, beim Universum-Bau-Sichttest auf
Galaxy Tab S6 + Samsung DeX):** Beim Bau des
Browser-Observatorium-Universums sollte der System-Mauszeiger über der
Sage-Page-Universum-Fläche verschwinden, damit der selbst gezeichnete
Komet-Schweif die einzige visuelle Geste der Maus ist. Versucht wurden
**alle bekannten Web-Workarounds:**

| Versuch | Ergebnis in DeX-Chrome |
|---|---|
| `cursor: none` | Ignoriert — System-Pfeil bleibt. |
| `cursor: crosshair` | Ignoriert; nur die `pointer`-Hand-Logik für `<button>` wird unterdrückt. |
| `cursor: url('1x1.svg') 0 0, none` (Custom-SVG-Cursor) | Ignoriert. |
| `cursor: url('1x1.png') 0 0, none` (Custom-PNG-Cursor, base64) | Ignoriert. |
| `cursor: url('32x32-transparent.png') 16 16, none` | Ignoriert. |
| `cursor: pointer` (für klickbare Elemente) | **Wird respektiert** — Hand-Cursor wird gezeigt. |

### Befund

DeX-Android zeichnet einen **System-Cursor-Overlay** über jeden
Web-Inhalt. Im Gegensatz zu Desktop-Chrome, das CSS-`cursor`-Werte
strikt respektiert, scheint DeX-Chrome nur **semantisch sinnvolle
Interaktions-Cursors** zu akzeptieren (`pointer` für klickbare
Elemente). Alle anderen Werte werden vom darüberliegenden System-
Pointer überschrieben.

### Konsequenzen

- **Custom-Cursor-Designs (Komet-Schweif, Sternen-Cursor, etc.)**
  funktionieren auf Desktop-Browsern, aber nicht auf DeX-Chrome /
  manchen Android-Browsern. Sie müssen **zusätzlich** zum System-Cursor
  gezeichnet werden — die System-Maus bleibt sichtbar, die eigene
  visuelle Geste liegt oben drauf.
- **Cursor-Verstecken via `pointer-events: none`** ist keine Lösung,
  weil es zugleich Klicks deaktiviert.
- **Pointer Lock API** wäre die einzige technische Möglichkeit, den
  System-Cursor wirklich zu verstecken — aber sie fängt die Maus
  regelrecht ein (Esc-Taste zum Lösen, intrusive Permission-Modal),
  und ist UX-mäßig ungeeignet für eine simple Web-Navigation.

### Workarounds (pragmatisch)

- **Komet-Schweif via Canvas** (siehe `setupObservatoriumUniverse()`
  in `index.html`): zeichnet eine eigene visuelle Spur, die der Maus
  folgt. Die schönere Geste liegt zusätzlich zur System-Maus.
- **Akzeptieren:** auf DeX bleibt der System-Pointer sichtbar. Auf
  Desktop ist er unsichtbar (`cursor: none` wird respektiert). Beide
  Welten leben mit der jeweiligen Begrenzung.
- **Lehre 8 ist im Universum eine taumelnde Disk-Galaxie** —
  zyklisches rotieren um die eigene Achse, dabei wird sie flacher und
  runder wie eine Frisbee in Sicht-Drehung. Visuelle Erinnerung daran,
  dass nicht alles, was man festhalten will, sich festhalten lässt.

### Vorteile

- **Die eigene Geste gewinnt trotzdem.** Der Komet-Schweif ist
  schöner als jeder System-Cursor. Klaus' visueller Eindruck im
  Sichttest: „Komet und Schweif ist sehr gut" — auch mit darüberliegender
  System-Maus.
- **Konsistenz-Befund über mehrere Browser-Plattformen** macht die
  Architektur ehrlicher: man entwirft visuelle Geste nicht als Ersatz
  des System-Cursors, sondern als **Addition** zu ihm.

---

## Pflege-Konvention für diese Datei

Neue Lehren bekommen einen eigenen `## Lehre N — Titel`-Block. Pflicht-
felder:

- **Beobachtung:** Datum + wer + welche Hardware/Software.
- **Konkrete Phänomenologie:** was passierte, wie reproduzierbar.
- **Konsequenzen:** wie SBKIM oder Andocker betroffen ist.
- **Workarounds:** konkrete Befehle / Code-Schnipsel.
- **Vorteile:** falls die Tiefe auch einen Boden hat.

Diese Datei ist eine **lebende Sammlung**. Sie ersetzt keine Modul-Karte
und kein INTERFACES.md — sie ergänzt sie um das, was zwischen den
Verträgen passiert.

---

**Letzte Aktualisierung:** 2026-05-17 · Mini-Pflege Live-Channel-Handshake
(Klaus + Folge-Sitzung zu PR #75/#76).

**Querverweise:**

- [`docs/components/05_anastomose.md`](components/05_anastomose.md) § BroadcastChannel-Bridge
- [`docs/components/09_einbau_pwa.md`](components/09_einbau_pwa.md) § Schritt 4 + § Sichtkontrolle Punkt 6
- [`docs/PULS.md`](PULS.md) § Offene Querschnitts-Fragen
