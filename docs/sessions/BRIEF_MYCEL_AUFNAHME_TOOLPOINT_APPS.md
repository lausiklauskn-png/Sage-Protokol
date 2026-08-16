# BRIEF — Die Marktplatz-Apps ins eigene Mycel aufnehmen

**Auftrag von Klaus (2026-08-16):** *„Die neu installierten Apps und Tools, die wir
in PWA Toolpoint eingetragen haben, ins Mycel aufnehmen. Ins eigene natürlich.
Das müssten fünf Apps sein und eine Internetseite."*

---

## Pflichtlektüre (in dieser Reihenfolge, VOR dem ersten Handgriff)

1. `CLAUDE.md` — besonders **§ Sitzungsstart-Pflicht** (die drei Fallen) und
   **§ Fremdnutzer-/Marktplatz-Brille**
2. `docs/PULS.md` — oberster Eintrag
3. **Dieser Brief**
4. `docs/components/23_rendezvous.md` — die Karte des Moduls, um das es geht
5. `PWA-Toolpoint/assets/config/netz.js` — dort steht schwarz auf weiß, **was
   heute geht und was nicht** (drei Ebenen der Unabhängigkeit)
6. Der Code der Scheibe, an der du arbeitest — sonst nichts

**Und zuerst, ohne Ausnahme:**

```bash
bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"
```

Die Bestandsaufnahme unten wurde am 2026-08-16 gegen **frisch geholte**
`origin/main` aller 33 Repos gemacht — nicht gegen die Klone im Container. Wenn
du sie nachprüfst, prüfe genauso. Eine Aussage über den Stand einer App aus
einem ungefetchten Klon ist **kein Beweis**.

---

## Stand — was gemessen wurde (2026-08-16, alle 33 Repos, `origin/main`)

Geprüft wurde **nach Inhalt, nicht nach Dateinamen**. Das ist kein Detail: der
erste Durchgang suchte nach Dateipfaden und meldete für Kim-Bell, Mein-WorkFloh
und SB-KIMTool-Point „kein Modul 23" — die drei tragen es **inline**. Wer nach
Dateinamen sucht, bekommt eine falsche Landkarte.

```bash
git -C <repo> grep -l "SbkimRendezvous" origin/main    # Modul 23 wirklich da?
git -C <repo> ls-tree -r origin/main --name-only | grep sbkim/spore.json
```

### A · Ganz draußen — weder Spore noch Modul 23 (**das ist die Arbeit**)

| # | Repo | Marktplatz-Eintrag | Art |
|---|---|---|---|
| 1 | `Alis-Moderaum` | `eigen-alis-moderaum` **+** `eigen-alis-warenwirtschaft` | App (**zwei** Einträge, ein Repo) |
| 2 | `Kuechenzettel` | `eigen-kuechenzettel` | App |
| 3 | `Perfect-Skin-Fashion` | `markt-perfect-skin-fashion` | App |
| 4 | `Perfect-Skin-Beauty` | `markt-perfect-skin-beauty` | Seite mit eigener Domain (`perfectskinbeauty.de`) |
| 5 | `Mein-Workfloh-Page` | `eigen-workfloh-page` („Muster Werbetechnik") | **Schaufenster-Seite**, keine App |

Das sind Klaus' „fünf Apps und eine Internetseite" — genauer: **fünf Repos**,
davon zwei Seiten und drei Apps, und eines der App-Repos trägt zwei Einträge.
**Sag es in der Abschluss-Meldung so genau, nicht gerundet.**

### B · Halb drin — je ein Teil fehlt (billig zu schließen, gehört dazu)

| Repo | Spore | Modul 23 | Karten-Link | was fehlt |
|---|---|---|---|---|
| `Company-Brain` | **—** | ja | **—** | **Ausweis**: ist im Raum, hat aber keine Identität auf der Karte |
| `Privat-Brain` | ja | ja | **—** | nur der Karten-Link |
| `Mein-Rezeptbuch` | ja | ja | **—** | nur der Karten-Link |
| `Mein-Mixarium` | ja | ja | **—** | nur der Karten-Link |
| `SP-FP-md-Speicher` | **—** | ja | ja | Spore — **und steht gar nicht im Marktplatz** |
| `PWA-Toolpoint` | **—** | ja | ja | **eigene committete Spore** — der Marktplatz, der „das eigene Mycel" trägt, ist selbst kein Knoten auf der Karte |

### C · Vollständig drin (nichts zu tun — nicht anfassen)

`Sage-Protokol` · `Muttis-Rezeptbuch` · `Jasons-Tresor` · `Mein-Tresor` ·
`BookLedgerPro` · `Kim-Bell` · `Kimboard` · `Kimseek` · `Tomys-Hub` ·
`Mein-WorkFloh` · `SB-KIMTool-Point` · `family-project`

`mycel-karte` ist **Betrachter, kein Knoten** — das ist Absicht und bleibt so.

---

## Die Wahrheit, an der jeder Plan hier zerbricht, wenn man sie übergeht

**Eine Sitzung kann die lebende Identität eines Knotens NICHT erzeugen.**

Der private Schlüssel entsteht **im Browser, pro Adresse (Origin)** — er liegt in
der IndexedDB des Geräts und kommt nie ins Repo. Was eine Sitzung committen
kann, ist eine **Visitenkarte** (`sbkim/spore.json`), erzeugt mit einem
Schlüssel aus der Umgebung. Deren `nodeId` ist dann aber **nicht** die, die der
Knoten im Browser wirklich belauscht — das ist die **Adress-Wand**, und genau
dafür gibt es Modul 23 (lebende Karte im gemeinsamen Raum, siehe
`docs/components/23_rendezvous.md`).

Daraus die **saubere Arbeitsteilung**, und sie gehört so in die Abschluss-Meldung:

| Die Sitzung kann | Nur Klaus kann |
|---|---|
| Modul 23 + UI byte-1:1 einbauen | den **Andock-Wizard im Siegel** einmal drücken |
| das App-eigene Netz-Panel bauen | damit die **lebende Identität** erzeugen |
| den Karten-Link setzen | den **Live-Andock** bezeugen |
| `status.json` + `NETZ-STAND.md` vorbereiten | die echte `nodeId` liefern |

**Also nicht behaupten, ein Knoten sei „im Mycel", wenn nur Code eingebaut ist.**
Der ehrliche Stand nach dieser Sitzung heißt **„andock-bereit, wartet auf Klaus'
Browser-Lauf"**. Alles andere wäre das vorgetäuschte Grün, das die Verfassung
verbietet.

---

## Die eine Entscheidung, die vor dem Bauen zu klären ist

Klaus sagt **„ins eigene Mycel, natürlich"**. Das lässt zwei Lesarten zu, und sie
führen zu verschiedener Arbeit:

**Lesart 1 — „Klaus' eigenes Netz"** (statt eines fremden). Dann ist es der
normale Andock: gemeinsamer Raum `sbkim-rdv`, Eintrag in Sages `status.json`,
Erscheinen auf der Mycel-Karte. **Das ist die wahrscheinliche Lesart** und
komplett heute baubar.

**Lesart 2 — „PWA Toolpoints eigener Raum"**, getrennt von Sage und Family
Projekt. Das ist **heute nicht möglich**: Modul 23 trägt das Raum-Etikett als
feste Konstante (`src/modules/23_rendezvous.js` Z. 113, `var RDV_TAG =
"sbkim-rdv"`), und `configure()` kennt es nicht. `PWA-Toolpoint/assets/config/netz.js`
hat den Wert bereits vorbereitet (`raumAktiv: false`) und benennt den sauberen
Weg: **ein optionales `roomTag` IM KANON**, Standard unverändert — **nicht** die
Kopie ändern (das erzeugte eine dritte Modul-Generation, und der Drift-Guard
schlüge zu Recht an).

**Vorgehen:** mit **Lesart 1** bauen (sie liefert sofort Nutzen), und Lesart 2 als
eigenen, klar benannten Punkt an Klaus zurückgeben. Nicht beides in einer
Sitzung vermischen: das `roomTag` im Kanon berührt **jede** Modul-23-Kopie in
zwölf Repos und ist ein eigener PR mit eigener Gegenprobe.

---

## Was gebaut werden soll — Reihenfolge

**Ein Repo nach dem anderen, ein PR pro Repo.** Nicht fünf Repos in einem Rutsch
anfassen: geht einer schief, weiß hinterher niemand welcher.

### Schritt 0 — Vorlage wählen (einmalig, vor dem ersten Repo)

Nimm ein **fertiges** Repo als Muster und lies, wie es dort zusammengesetzt ist:
`Kimseek` oder `Kim-Bell` sind die saubersten. Kopiere die Bauart, nicht nur die
Dateien.

### Schritt 1–5 — je Repo (A-Liste, in dieser Reihenfolge)

1. `Kuechenzettel` — kleinste App, der Probelauf
2. `Perfect-Skin-Fashion`
3. `Alis-Moderaum` — **Achtung: trägt zwei Marktplatz-Einträge** (Moderaum +
   Warenwirtschaft). Ein Knoten, zwei Einträge — nicht zwei Identitäten bauen.
4. `Perfect-Skin-Beauty` — eigene Domain: `allowedOrigins` müssen **beide**
   Schreibweisen tragen (mit und ohne `www.`), sonst weist Modul 15 die eigene
   Seite ab
5. `Mein-Workfloh-Page` — **Schaufenster, keine App.** Erst prüfen, ob ein
   Knoten hier überhaupt sinnvoll ist: eine reine Landing-Page hat keinen
   eigenen Bestand, den sie beantworten könnte. Wenn nein: **das sagen** statt
   einen leeren Knoten zu bauen.

Pro Repo:

- **SBKIM-Kern byte-1:1** aus dem Kanon (`Sage-Protokol/src/modules/`), Module
  01 · 02 · 03 · 04 · 05 · 05b · 23 · `23_rendezvous_ui.js` + `noble-secp256k1`.
  **Nie abwandeln** — Drift-Guard mit SHA-256.
- **App-eigener Klebstoff** (frei): `rendezvous-init.js` nach Kimseek-Muster,
  eigener `dbSuffix` (**app-spezifisch, nie ändern** — geteilte Adresse auf
  GitHub Pages, sonst kollidieren die Datenbestände), `allowedOrigins`.
- **Netz-Panel** „🌐 Mit dem Netz verbinden / 👥 Wer ist im Raum?"
- **Siegel-Leiste** (17/15/16) mit **Andock-Wizard** — ohne den kann Klaus die
  Identität nicht erzeugen, und der fehlt in frühen Kopien am häufigsten.
- **Karten-Link** auf `https://lausiklauskn-png.github.io/mycel-karte/`
- **Drift-Guard im Smoke** — und zwar **beide Formen prüfen**: manche Repos
  nageln nur die **ersten 16 Zeichen** des SHA fest (`SB-KIMTool-Point`,
  `BookLedgerPro`). Wer nur die 64er-Form ersetzt, hinterlässt einen roten Guard.

### Schritt 6 — die B-Liste schließen (billig, gehört dazu)

- `Company-Brain`: Spore ergänzen
- `Privat-Brain`, `Mein-Rezeptbuch`, `Mein-Mixarium`: nur der **Karten-Link**
- `PWA-Toolpoint`: eigene Spore — **oder** begründet festhalten, warum der
  Marktplatz bewusst kein Knoten ist. Beides ist vertretbar; **stillschweigend
  offen lassen ist es nicht.**
- `SP-FP-md-Speicher`: erst mit Klaus klären, ob es überhaupt in den Marktplatz gehört

### Schritt 7 — Register nachziehen (**erst wenn Klaus angedockt hat**)

Die Mycel-Karte holt ihre Knoten automatisch aus
`Sage-Protokol/status.json` → `endknoten[]` (`mycel-karte/index.html`,
`STATUS_URL`, fail-soft auf den eingebetteten Seed). Ein Eintrag dort **ist** der
Eintrag auf der Karte.

Danach `sbkim/NETZ-STAND.md` nachziehen und die Postfächer bedienen
(INTERFACES §11.6: `seq`+1, `headline`, `forNodes` — **das Pushen IST das
Signal**).

---

## Datenverträge (nicht brechen)

**`status.json` → `endknoten[]`**, Pflichtfelder nach dem Muster des 15.
Endknotens (WorkFloh):

```json
{
  "name": "…", "domain": "…", "integrated": true, "integratedAt": "YYYY-MM-DD",
  "nodeId": "…", "sporeUrl": "https://…/sbkim/spore.json",
  "stammCategories": ["…"], "guestCategories": ["…"],
  "pingStatus": "verified-match | verified-spore", "matchScore": 0.0,
  "note": "…", "url": "https://…"
}
```

- `nodeId` = `base64url(SHA256(rawPub))`, reziprok verifizierbar
- `pingStatus`: **`verified-match`** nur bei Cosinus **≥ 0.80** zu Sage; darunter
  ehrlich **`verified-spore`** (so steht Tomys drin, 0.7917). **Keine Zahl
  schönen.**
- `PROTOCOL_VERSION` bleibt **0.2**, `PROVIDER_MIN_MATCH` / der 0.80-Riegel
  bleiben **unberührt**. Der Riegel wird nicht gesenkt, damit ein Knoten hineinpasst.

**PWA-Toolpoint `listings.js`:** Kopf und Fuß bleiben (`PT_SUBMIT_ENDPOINT`,
`PT_CONTACT_MAIL`, `PT_MARKT_API`). Wird `sporeUrl` je Eintrag ergänzt, danach
`node tools/statische-listen.mjs` laufen lassen — sonst zeigen die
eingebackenen Karten etwas anderes als die Liste. Die Sortierung nach `seit`
(ältestes zuerst) **nicht** anfassen.

---

## Akzeptanzkriterien

- [ ] `npm test` im jeweiligen Repo **grün** — Drift-Guard byte-1:1
- [ ] `Sage-Protokol`: `node tests/run_alle.mjs` grün (derzeit **72**), Rückgabewert
      **selbst gelesen** — nicht durch `| tail`, der schluckt ihn
- [ ] Jeder neue Wächter hat eine **Gegenprobe**, und die wirft ihn wirklich um
- [ ] Keine toten Verweise, kein waagerechter Lauf bei 412 px und 1350 px
- [ ] Fehlt ein Schlüssel / ein Modul / das Netz: die App **läuft weiter**, still
      degradiert — kein toter Knopf, kein Absturz (Fremdnutzer-Brille)
- [ ] Kein PII, kein Geheimnis im Repo
- [ ] Der Stand heißt **„andock-bereit, wartet auf Klaus' Browser-Lauf"**, bis
      Klaus wirklich angedockt hat

---

## Die drei Fallen, die hier schon Zeit gekostet haben

1. **Der Klon ist alt.** `fetch` vor jeder Aussage. Ein lokaler Klon ohne `fetch`
   ist kein Beweis. (Real passiert: eine App galt als „ohne SBKIM", weil der
   Klon vom April war.)
2. **`git push -u origin <branch>` schiebt nicht deinen Stand**, sondern den
   gleichnamigen **lokalen** Branch. Immer mit Refspec, und danach **beides**
   prüfen:
   ```bash
   git push --force-with-lease origin refs/heads/<b>:refs/heads/<b>
   git rev-list --count origin/<b>..HEAD        # 0 = wirklich oben
   git diff origin/main origin/<b> --stat       # leer = der PR wäre leer
   ```
3. **„Nicht gefunden" ist erst dann eine Aussage, wenn du belegt hast, dass du
   überall hineingesehen hast.** Siehe `CLAUDE.md § Die dritte Falle` und
   `tests/smoke_papiere_bereinigt.mjs`. Beim Suchen nach Modulen in fremden
   Repos gilt dasselbe: **nach Inhalt suchen, nicht nach Dateinamen** — genau
   daran ist die erste Bestandsaufnahme für diesen Brief gescheitert.

**Merksatz:** eine Prüfung, die dir recht gibt, ist der Ort, an dem du am
genauesten hinsehen musst.

---

## Offene Fragen an Klaus

1. **`Mein-Workfloh-Page` („Muster Werbetechnik")** ist ein Schaufenster ohne
   eigenen Bestand. Soll es trotzdem ein Knoten werden, oder reicht der
   Karten-Link? (Ein Knoten, der auf jede Frage „nichts" antwortet, macht das
   Netz nicht größer, sondern die Antworten schlechter.)
2. **Eigener Raum für PWA Toolpoint** (Lesart 2 oben) — jetzt als eigener PR im
   Kanon angehen, oder später?
3. **`SP-FP-md-Speicher`** trägt Modul 23, steht aber in keinem Marktplatz.
   Absicht?
4. **`PWA-Toolpoint` selbst**: eigener Knoten mit Spore, oder bewusst nur
   Marktplatz?

---

## Abschluss-Befehl für diese Sitzung (Pflicht, die Kette reißt nie ab)

1. `docs/PULS.md` fortschreiben: Datum, was getan, was offen, nächster Schritt
2. Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`
3. Ein Commit pro abgegrenzter Aufgabe, ein PR pro Repo, Selbst-Merge nach
   Freibrief (getestet · abgegrenzt · nicht architektonisch zweifelhaft)
4. **„Nächste Schritte"-Block direkt in der Chat-Antwort** — 2–4 Punkte, je ein
   Satz Begründung. Klaus liest den Chat, nicht den Dateibrowser.
5. **Neuen Brief** anlegen und **vollständig als Codeblock im Chat** ausgeben
6. Postfächer bedienen (INTERFACES §11.6) — das Pushen IST das Signal
