# Mini-Pflege 2026-05-17 — Live-Channel-Handshake + Browser-Observatorium

**Sitzungs-Rolle:** Mini-Pflege (Folge zur Bau-Sitzung
BroadcastChannel-Bridge, PR #75 `b8c8f41`, und Mini-Pflege Bau-
Sichttest, PR #76 `8801896`). Branch
`claude/pflege-live-channel-handshake-observatorium`. Klaus hat den
**ersten regulären Cross-Knoten-Handshake im SBKIM-Netz ohne
localStorage-Bypass** über Eruda gefahren — das Ziel der gesamten
Sitzungskette PR #65 → #70 → #71 → #72 → #73 → #74 → #75 → #76 ist
erreicht.

---

## 1. Was geschah — Schritt für Schritt

### 1.1 Endknoten-Pflege (Termux)

Klaus hat in Termux das Sage-Protokol-Repo geklont (lag bereits in
`~/Mein-Mixarium/Sage-Protokol/`, geupdatet auf Commit `8801896`).
Aus dem aktuellen `src/modules/05_anastomose.js` wurde die neue
v2-Modul-Datei in beide Endknoten kopiert:

```bash
cp ~/Mein-Mixarium/Sage-Protokol/src/modules/05_anastomose.js \
   ~/Mein-Rezeptbuch/sbkim/05_anastomose-v2.js
sed -i 's|sbkim/05_anastomose.js|sbkim/05_anastomose-v2.js|' \
   ~/Mein-Rezeptbuch/index.html
# … analog für Mein-Mixarium …
```

Cache-Bust per **File-Rename** (`05_anastomose.js` →
`05_anastomose-v2.js`), konsistent zur PR-#73-Konvention für den SW.

Commits:

- Mein-Rezeptbuch `a1b9ded` „Modul 05 BroadcastChannel-Bridge live (Sage-Protokol PR #75)"
- Mein-Mixarium `9d2f127` „Modul 05 BroadcastChannel-Bridge live (Sage-Protokol PR #75)"

### 1.2 IndexedDB-Verlust-Befund

Beim Live-Test in DeX-Chrome zeigten beide Endknoten-Tabs:

```
SBKIM-Andock bereit. Spore erzeugen mit __sbkimErzeugeSpore() in der DevTools-Konsole.
```

Die in PULS dokumentierten 2026-05-16-Identitäten
(`RHhposP0…` Rezeptbuch, `7xf0tt33_…` Mixarium) waren **nicht mehr da**.
Diagnose via Eruda:

```js
SbkimSpore.getOwnSpore().then(s => alert(s ? "SPORE: " + s.id : "KEINE Spore in diesem Tab"));
```

→ Popup „KEINE Spore in diesem Tab" in beiden Tabs.

Ursache nicht abschließend geklärt — vermutlich Chrome-Update,
versehentliches „Site-Daten löschen", PWA-Re-Install oder
Storage-Quota-Reklamation zwischen 2026-05-16 und 2026-05-17.

Pragmatische Entscheidung: **Variante B (Re-Andock in DeX-Chrome)**
statt Backup-Import. Die alten Identitäten waren nur Ed25519-
Schlüssel ohne Daten — kein menschlich wichtiger Inhalt verloren.

### 1.3 Re-Andock in DeX-Chrome

In beiden Tabs:

```js
__sbkimErzeugeSpore();
```

Embedding-Modell (`Xenova/multilingual-e5-small`, ~30 MB) wurde
erstmals vom CDN gezogen — ~60 s bei Klaus' Bandbreite. Output:

```
MODUL 03 EMBEDDING bereit, Funktionen: …, Modell: Xenova/multilingual-e5-small, Dim: 384
Domain-Vektor erzeugt: 384 Floats
Spore erzeugt, nodeId = BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY
Signatur-Länge = 86
```

(Mein-Mixarium-Tab analog mit nodeId `JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY`.)

### 1.4 Spore-Export via Blob-Download

Eruda's `copy()`-Funktion und `await` top-level funktionierten nicht
zuverlässig (Eruda-Eigenheit, siehe Observatorium § Lehre 5). Pragmatischer
Workaround:

```js
SbkimSpore.getOwnSpore().then(sp => {
  const blob = new Blob([JSON.stringify(sp, null, 2)], {type: "application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "rezeptbuch-spore.json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
});
```

Datei landet im Android-Downloads-Ordner. Termux nach
`termux-setup-storage` greift via `~/storage/downloads/` darauf zu.

### 1.5 Spore-Push pro Endknoten

```bash
cp ~/storage/downloads/rezeptbuch-spore.json ~/Mein-Rezeptbuch/sbkim/spore.json
cd ~/Mein-Rezeptbuch
git add sbkim/spore.json
git commit -m "Re-Andock: neue Spore mit eigenem Channel-Pfad-Empfang"
git push
# → cbc2531..3bcc453 main -> main (Mein-Rezeptbuch)

# analog Mein-Mixarium:
# → 9b32dc7..e9d0a45 main -> main
```

(Tatsächliche Commit-Reihenfolge: Mein-Rezeptbuch nach `3bcc453`
direkt nach dem ersten v2-Push `a1b9ded`; Mein-Mixarium nach
`e9d0a45` direkt nach `9d2f127`.)

Pages-Deploy-Verifikation:

```bash
curl -fsSL "https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json?$(date +%s)" | grep -m1 '"id"'
#   "id": "JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY",
curl -fsSL "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/spore.json?$(date +%s)" | grep -m1 '"id"'
#   "id": "BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY",
```

### 1.6 Live-Handshake-Test

In **Mein-Rezeptbuch-Tab** (DeX-Chrome, Multi-Window mit
Mein-Mixarium nebeneinander) via Eruda:

```js
(async () => {
  const peer = await fetch(
    "https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json?"+Date.now(),
    {cache:"no-store"}
  ).then(r=>r.json());
  const own = await SbkimSpore.getOwnSpore();
  const vec = new Float32Array(own.domainVector);
  const result = await SbkimAnastomose.handshake(peer, vec);
  console.log("ERGEBNIS:", JSON.stringify(result, null, 2));
})();
```

**Resultat:**

```json
{
  "outcome": "established",
  "peerNodeId": "JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY",
  "peerDomain": "lausiklauskn-png.github.io",
  "score": 0.9544261159927087
}
```

🟩 **Erster regulärer Cross-Knoten-Handshake im SBKIM-Netz, ohne
localStorage-Bypass.**

### 1.7 Gegenrichtung

Im Mein-Mixarium-Tab denselben Block mit Rezeptbuch als Peer:

```json
{
  "outcome": "established",
  "peerNodeId": "BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY",
  "peerDomain": "lausiklauskn-png.github.io",
  "score": 0.9544261159927087
}
```

🟩 **Bidirektionalität bewiesen.** Score identisch — cosine ist
symmetrisch, beide Vektoren liegen in beiden Berechnungen vor.

### 1.8 Sibling-Persistenz

```js
SbkimAnastomose.listSiblings().then(s => console.log(s.map(x => ({nodeId: x.nodeId, domain: x.domain}))));
// → [{ nodeId: "JOlHK31XEiyl…", domain: "lausiklauskn-png.github.io" }]
```

`sbkim_siblings` in IndexedDB bidirektional gefüllt, persistent.

---

## 2. Was eingetragen

### 2.1 `docs/OBSERVATORIUM_BROWSER.md` (neue Datei)

Tech-Note für Andocker und Programmierer mit sieben Lehren aus dem
2026-05-17-Live-Betrieb:

1. **Browser-Instanzen sind oft getrennter, als man denkt** — DeX vs.
   Tablet, Chrome-Profile, Inkognito, Standalone-PWA. Konsequenz für
   BroadcastChannel (same-instance). Workarounds: Single-Instance-
   Disziplin oder Modul-02-Backup-Import. Vorteil: kostenlose
   Multi-Knoten-Testumgebung.
2. **IndexedDB ist persistent, aber nicht unsterblich** — Tabelle
   was IndexedDB löscht (Site-Daten / Quota-Reklamation / PWA-
   Deinstallation / Chrome-Update). `navigator.storage.persist()` +
   regelmäßiges `SbkimSpore.exportBackup` als Schutz.
3. **BroadcastChannel ist same-origin UND same-instance** — Mobile-
   Tab-Suspendierung als Risiko, DeX-Multi-Window als Workaround.
4. **Service-Worker-Cache + Modul-Updates brauchen File-Rename** —
   vier Cache-Bust-Strategien, SBKIM-Konvention dokumentiert.
5. **Eruda ≠ Chrome-DevTools** — Tabelle Unterschiede, konkrete
   Workarounds (Blob-Download statt `copy()`, `.then()` statt
   top-level `await`).
6. **Termux + Android-Storage als Brücke** — Setup-Hinweise,
   Single-Device-Multi-PWA-Andock-Workflow vom Tablet.
7. **DeX als ernsthafte Test-Plattform** — was DeX-Chrome anders
   macht als Tablet-Chrome.

Pflege-Konvention dokumentiert: neue Lehren bekommen eigenen Block
mit Beobachtung + Phänomenologie + Konsequenzen + Workarounds +
Vorteile-Vermerk.

### 2.2 `index.html` — neue Sage-Page-Karte „Browser-Observatorium"

Am Ende des Overview-Screens (vor `meta-footer`), volle Breite
(`span-12`). Visuelles Schwarzes Loch als SVG-/CSS-Animation:

- **`bh-disk`** + **`bh-disk-2`** — zwei rotierende Akkretionsscheiben
  als `conic-gradient` mit gegenläufiger Drehung (9 s + 13 s), mit
  `mix-blend-mode: screen` für ineinandergreifende Lichtspuren.
- **`bh-horizon`** — schwarzer Ereignishorizont als
  `radial-gradient` mit innerem Glow.
- **`bh-core`** — tiefschwarzer Kern, inset 30 %.
- **`bh-chrome`** — verschwommenes SVG-Chrome-Icon (vier Quadranten
  rot/gelb/grün/blau + Kern), `@keyframes bh-fall` in 7 s Loop von
  140 % oben-rechts in den Kern → ins Nichts → spawn wieder oben-
  rechts. Bei Hover verkürzt sich die Animation auf 3,2 s.
- **Caption** mit Klaus' Wortlaut: „Browser sind wie schwarze
  Löcher, neugierig?". Verweistext mit „Klicke ins Loch → die Doku
  öffnet sich am anderen Ende des Ereignishorizonts."
- **Maus-Anziehung:** `setupBlackholeAnziehung()` in der Sage-Page-
  Init-Sequenz hookt `mousemove` auf den Stage-Container und
  verschiebt die Szene leicht zum Cursor (`requestAnimationFrame`-
  geglättet, 14 %-Pull-Faktor, leichte Skalierung). Auf Mobile/
  Touch ohne Effekt (kein Hover). Bei `prefers-reduced-motion:
  reduce` keine Animation und kein Pull.
- **Klick:** öffnet `https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/OBSERVATORIUM_BROWSER.md`
  im neuen Tab.

### 2.3 PULS.md

- **§ Endknoten-Tabelle:** beide Endknoten-Zeilen aktualisiert mit
  neuen nodeIds, Spore-Commits (`3bcc453` / `e9d0a45`), Modul-05-v2-
  Commits (`a1b9ded` / `9d2f127`), Re-Andock-Datum, Live-Channel-
  Handshake-Bestätigung, `pingStatus: "live-channel"` (vorher
  `"live-direct"`).
- **§ Offene Querschnitts-Fragen:**
  - SW-Bridge-Phantom-Cache-Bug-Eintrag auf **vollständig erledigt**
    umgestellt, Pflege-Kette PR #65 → diese Mini-Pflege geschlossen.
  - **Neuer Eintrag** „DeX-Chrome vs. Tablet-Chrome — zwei getrennte
    Browser-Instanzen" mit Verweis auf Observatorium § Lehre 1.
- **§ Sitzungs-Einträge:** neuer Top-Eintrag „Mini-Pflege —
  Live-Channel-Handshake + Browser-Observatorium" mit vollem
  Verlaufsdiagramm, Resultaten, Beobachtungen, Validierungs-Stand.

### 2.4 `docs/components/05_anastomose.md` § Bauzustand

Zeile „In Endknoten eingebaut" von `—` auf
`2026-05-17 | Klaus + Mini-Pflege Live-Channel-Handshake` umgestellt
mit kompletten Belegen (nodeIds, Commits, Score, Resultat-JSON-
Auszug, Verweise).

---

## 3. Was nicht angefasst

- Modul-Code (`src/modules/05_anastomose.js`) — final aus PR #75.
- INTERFACES.md / Karte 09 — beide aus PR #74/#75 verbindlich.
- `tests/manual_check.html` — Panel 05 mit Knöpfen 9/9a/9b/9c aus
  PR #75 ausreichend.
- `src/sbkim-sw.js` — PR #72 `isOwnEndpoint`-Scope-Fix final.
- `PROTOCOL_VERSION` bleibt `"0.1"`.
- `status.json` — keine Score-Bewegung (Sichttest-Bestätigung +
  Doku, kein Funktionalitäts-Verlust). `update_puls_pie.py` NICHT
  aufgerufen.

---

## 4. Validierung

- **Sage-Page JS** (`index.html` Inline-Script) per `node --check`
  validiert — grün.
- **Markdown-Doku** `OBSERVATORIUM_BROWSER.md` formal sauber
  (Header, sieben Lehren mit Beobachtung/Konsequenz/Workaround/
  Vorteile, Pflege-Konvention, Querverweise zu Karte 05/09 und PULS).
- **PULS** unter 3000-Zeilen-Schutz (aktuell ~2100).
- **Browser-Sichttest der Schwarz-Loch-Karte ausstehend** — Klaus
  prüft die Animation visuell beim nächsten Sage-Page-Aufruf.
  Falls Performance-/Layout-Probleme auf Mobile-Chrome auftreten,
  eigene Mini-Folge-Pflege „Browser-Observatorium-Karte
  optimieren".

---

## 5. Klaus' Pflichtaufgaben

Keine. Die Endknoten-Pflege ist erledigt, der Live-Handshake bewiesen,
die Doku eingetragen. Klaus prüft beim nächsten Aufruf der Sage-Page
die neue Schwarz-Loch-Karte (Animation, Hover-Sog, Klick zur Doku).

---

## 6. Nächster sinnvoller Schritt

1. **Klaus:** Diesen Mini-Pflege-PR mergen.
2. **Klaus optional:** Sage-Page besuchen, Schwarz-Loch-Karte
   ansehen, falls Anpassungs-Bedarf (Größe / Animation / Tagline) →
   eigene Mini-Pflege.
3. **Folge-Pflege „Embedding-Baseline" (offener Punkt aus
   2026-05-15)** könnte jetzt fällig werden — Score 0.9544 zwischen
   Rezeptbuch- und Cocktail-Domain ist verdächtig hoch, könnte auf
   Embedding-Baseline-Drift hindeuten. Karte 04 Match-Kalibrierungs-
   Beleg dokumentiert das bereits als bekannt; eigene Pflege-Sitzung
   wäre angemessen, wenn ein weiteres Live-Knotenpaar mit klar
   fremden Domänen ähnlich hoch matcht.
4. **Optional aufräumen:** alte `05_anastomose.js` (ohne v2-Suffix)
   aus beiden Endknoten in einer Folge-Mini-Pflege per `git rm`
   entfernen, sobald der Live-Test stabil über einige Sitzungen
   wiederholbar ist. Aktuell als Rollback-Reserve drin.

---

## 7. Konvention für die übernächste Sitzung (IMMER drinhalten)

Wenn Klaus am Sitzungsende der **Folge-Sitzung** `Befehl schreiben`
tippt, formuliert die Folge-Sitzung **vor** dem Brief:

1. **Offene PRs auflisten** in Sage-Protokol (und ggf. Endknoten).
2. **Pro PR eine Einordnung** (mergen / schließen / lassen +
   Konflikt-Risiko, typisch PULS.md / INTERFACES.md).
3. **Den Brief gegen `main`-Stand schreiben**, nicht gegen die
   eigene Branch-Erwartung. Voraussetzungen aus ungemergten PRs
   **explizit** nennen.
4. **Bei mehreren offenen PRs** Merge-Empfehlung vor dem Brief
   vorlegen; der Brief kommt erst nach Klaus' Bestätigung der
   Merge-Strategie (oder explizit „Brief auf aktuellem Stand,
   keine Merges").

Brief-Stil sachlich, ohne Imponiergehabe, mit konkreten Datei-/
Zeilen-Referenzen.

**Pflicht am ENDE des Briefs:** Vollständiger Brief NOCHMAL in einem
einzigen kopierbaren Markdown-Codeblock (Outer-Fence mit vier
Backticks, damit interne ```js-Blöcke nicht schließen). Klaus liest
den Brief am Tab und kopiert ihn in die nächste Sitzung — der
Codeblock ist sein Anker.

---

**Vorgänger:** Mini-Pflege Bau-Sichttest (PR #76, `8801896`); Bau
BroadcastChannel-Bridge (PR #75, `b8c8f41`); Spec BroadcastChannel-
Bridge (PR #74, `a5bbd60`); Pflege SW-Scope-Fix (PR #72) + Endknoten-
Sichttest (PR #73). Endknoten-Stand nach dieser Mini-Pflege:
Mein-Rezeptbuch `3bcc453` (Spore `BSWxXm…`, Modul `a1b9ded`),
Mein-Mixarium `e9d0a45` (Spore `JOlHK3…`, Modul `9d2f127`).

**Branch:** `claude/pflege-live-channel-handshake-observatorium`.
