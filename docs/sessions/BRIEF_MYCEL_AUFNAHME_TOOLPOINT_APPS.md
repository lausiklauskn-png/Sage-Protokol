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

| Repo | Spore | Modul 23 Kern | Netz-Oberfläche | Karten-Link | was fehlt |
|---|---|---|---|---|---|
| `Company-Brain` | **—** | ja | **—** | **—** | fast alles außer dem Kern: **kein** Modul 15/16/17, **keine** Netz-Oberfläche, **keine** Spore. Nur sechs Kern-Module + `rendezvous-init.js` |
| `Privat-Brain` | ja | ja | **eigenes** `net-widget.js` | **—** | Karten-Link · und das **Siegel ohne Identitäts-Wechsler** (siehe D) |
| `Mein-Rezeptbuch` | ja | ja | ja (**alte** UI) | **—** | Karten-Link · UI eine Generation zurück |
| `Mein-Mixarium` | ja | ja | ja (**alte** UI) | **—** | Karten-Link · UI eine Generation zurück |
| `SP-FP-md-Speicher` | **—** | ja | ja | ja | Spore — **und steht gar nicht im Marktplatz** |
| `PWA-Toolpoint` | **—** | ja | ja (**alte** UI) | ja | **eigene committete Spore** — der Marktplatz, der „das eigene Mycel" trägt, ist selbst kein Knoten auf der Karte. Dazu die UI eine Generation zurück |

### C · Vollständig drin (nichts zu tun — nicht anfassen)

`Sage-Protokol` · `Muttis-Rezeptbuch` · `Jasons-Tresor` · `Mein-Tresor` ·
`BookLedgerPro` · `Kim-Bell` · `Kimboard` · `Kimseek` · `Tomys-Hub` ·
`Mein-WorkFloh` · `SB-KIMTool-Point` · `family-project`

`mycel-karte` ist **Betrachter, kein Knoten** — das ist Absicht und bleibt so.

### D · Die zwei Werkzeuge, die eingebaut werden sollen (Klaus 2026-08-16)

> *„Dazu soll nach dem Bauplan aus Sage sowohl das Mycel-/‚Mit dem Knotennetz
> verbinden'-Flying-Widget (die in der Höhe, im Handymodus, aktualisierte
> Version) als auch das selbstausfüllende Siegel aus Sage genutzt werden. Dabei
> soll immer nach der aktuellsten Version beider Tools gesucht werden,
> gegebenenfalls in Sage angepasst werden, wenn diese schlechter und nicht
> aktuell ist."*

**Das ist eine stehende Regel, kein einmaliger Auftrag:** vor dem Einbau wird
**gemessen**, wo die neueste Fassung liegt — und wenn sie nicht in Sage liegt,
wird **zuerst Sage nachgezogen**, dann von dort verteilt. Nie andersherum, und
**nie** die Kopie im Endknoten anpassen (das erzeugt eine weitere Generation,
und der Drift-Guard schlägt zu Recht an).

**Der Abgleich am 2026-08-16 (Ausgangspunkt — beim Bauen NEU messen, nicht
abschreiben):**

```bash
# Für jede Datei über alle Repos: Zeilen, Inhalts-Fingerabdruck, Datum
for d in */; do r="${d%/}"; [ -d "$r/.git" ] || continue
  for p in $(git -C "$r" ls-tree -r origin/main --name-only 2>/dev/null | grep -i "<datei>"); do
    b=$(git -C "$r" show origin/main:"$p"); echo "$r $(echo "$b"|wc -l) $(echo "$b"|sha256sum|cut -c1-12) $p"
  done
done | sort -k3
```

**① Flying Widget** = das Netz-Panel, `src/modules/23_rendezvous_ui.js`
(Kern dazu: `23_rendezvous.js`; das freie Schweben kommt aus Modul 17).

| Fingerabdruck | Zeilen | wer trägt sie |
|---|---|---|
| **`b496bc86b5b2`** | **2279** | **KANON — der neueste Stand.** Sage `src/modules/` + `sbkim-bundle/` · Kimboard · Kimseek · BookLedgerPro · Jasons-Tresor · Mein-Tresor · Muttis-Rezeptbuch · Tomys-Hub · Kim-Bell · Mein-WorkFloh · SB-KIMTool-Point |
| `4882c3b68203` | 2249 | **zurück:** Mein-Mixarium · Mein-Rezeptbuch · **PWA-Toolpoint** · family-project · Sages eigenes `sbkim-bundle-voll/` |

**Ergebnis: Sage ist aktuell, es geht bergab statt bergauf.** Fünf Kopien
nachziehen — darunter der Marktplatz selbst und **ein Bündel in Sage**.

⚠️ **Drei Repos tragen dieselbe Datei unter anderem Namen**
(`modules/sbkim-rendezvous-ui.js`, `web/tools/sbkim-rendezvous-ui.js`) und sind
**byte-gleich zum Kanon**. Wer nach dem Dateinamen `23_rendezvous_ui` sucht,
hält sie für unversorgt und baut sie ein zweites Mal. **Nach Inhalt suchen.**

**② Selbstausfüllendes Siegel** — zwei Teile, die nicht verwechselt werden dürfen:

- **`16_siegel.js` — Kanon-Modul, byte-1:1, wird NIE angepasst.**

  | Fingerabdruck | Zeilen | Datum | wer |
  |---|---|---|---|
  | **`95003d208892`** | **1449** | **2026-08-15** | **KANON.** Sage `src/modules/` · BookLedgerPro · SB-KIMTool-Point |
  | `e67b72662bbc` | 1443 | 2026-08-11 | PWA-Toolpoint · family-project |
  | `4e11ef0d0390` | 1437 | 2026-07-30 | Kimboard · Kimseek · Privat-Brain · Jasons-Tresor · Mein-Mixarium · Mein-Rezeptbuch · Mein-Tresor · Muttis-Rezeptbuch · Tomys-Hub |
  | `a581461a0797` | 1431 | 2026-07-11 | Kim-Bell · Mein-WorkFloh |

  Auch hier: **Sage ist der neueste Stand**, elf Kopien hängen zurück.

- **`siegel-inhalt.js` — das ist KEIN Kanon-Modul, sondern die App-Konfiguration.**
  Sie **darf und muss** pro Knoten verschieden sein (`WIZ`-Block: App-Name,
  `ribbonText`, Adressen, Bedeutungstext, ID-Präfixe). Der Drift-Guard gilt für
  sie **nicht**. Was aber überall gleich sein muss, sind die **fünf Bausteine**
  des Wizards — und der **Identitäts-Wechsler** ist der, der in frühen Kopien
  am häufigsten fehlt.

  Gemessen (Treffer auf „Wechsler/switchIdentity"):

  | Repo | Zeilen | Wechsler |
  |---|---|---|
  | Sage-Protokol | 470 | ✅ |
  | Kimboard · PWA-Toolpoint · Kim-Bell · Mein-Tresor · Mein-WorkFloh · Jasons-Tresor | 475–483 | ✅ |
  | **Kimseek** | 399 | ❌ **fehlt** |
  | **Privat-Brain** | 391 | ❌ **fehlt** |

  Die längeren Fassungen sind **nicht** neuer — der Unterschied zu Sage ist im
  Wesentlichen das ID-Präfix (`kbdwiz-` bei Kimboard). **Länger ≠ besser**; erst
  hinsehen, dann urteilen.

**Ergebnis des Abgleichs: Sage muss für beide Werkzeuge NICHT angepasst werden.**
Klaus' Bedingung („gegebenenfalls in Sage anpassen, wenn schlechter") ist geprüft
und trifft **hier und heute nicht zu**. Beim nächsten Mal wieder messen — dieser
Satz ist ein Messergebnis, keine Eigenschaft von Sage.

**Zwei Funde, die Arbeit sind, auch wenn sie nicht im Auftrag standen:**
1. `Sage-Protokol/sbkim-bundle-voll/modules/` hängt bei **beiden** Werkzeugen
   zurück — Sage trägt eine veraltete Kopie im eigenen Haus. Das ist das
   Starter-Bündel für Forker: wer es heute nimmt, bekommt den alten Stand.
2. **Kimseek** und **Privat-Brain** haben ein Siegel **ohne Identitäts-Wechsler**.
   Beides sind laufende Knoten. Ohne den Wechsler kann Klaus dort keine zweite
   Identität wählen — ein stiller Mangel, kein sichtbarer Fehler.

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

### Schritt 0 — Kanon-Abgleich (einmalig, VOR dem ersten Repo) · Klaus-Pflicht

**Erst messen, wo die neueste Fassung liegt** (Abschnitt D oben, samt Befehl).
Nicht den Stand vom 2026-08-16 abschreiben — er ist der Ausgangspunkt, nicht die
Wahrheit von morgen.

- Liegt die neueste Fassung **in Sage** → von dort verteilen.
- Liegt sie **anderswo** → **zuerst Sage nachziehen** (eigener PR, eigene
  Gegenprobe, Drift-Guards aller Kopien neu genagelt), **dann** verteilen.
- **Nie** die Kopie im Endknoten anpassen. Das erzeugt eine weitere Generation,
  und der Drift-Guard schlägt zu Recht an.

Dann die **Vorlage** wählen: nimm ein Repo, das **beide** Werkzeuge im aktuellen
Stand trägt, und lies, wie es zusammengesetzt ist — **`Kimboard`** oder
**`Kim-Bell`** sind die saubersten. **`Kimseek` NICHT als Muster nehmen**: sein
Siegel hat keinen Identitäts-Wechsler, der Mangel würde sich fünfmal
weitervererben.

Kopiere die **Bauart**, nicht nur die Dateien.

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
- **Flying Widget** „🌐 Mit dem Netz verbinden / 👥 Wer ist im Raum?" — das
  freie, verschiebbare Panel aus `23_rendezvous_ui.js` in der Fassung aus
  Schritt 0. Die Handy-Behandlung steckt **im Modul** (`width:min(420px,92vw)`,
  `max-height:80vh`, `clampInts()` hält es beim Drehen im Bild) — **nicht**
  app-seitig nachbauen und **nicht** per eigenem CSS überschreiben.
- **Siegel-Leiste** (17/15/16) mit **selbstausfüllendem Andock-Wizard** — ohne
  ihn kann Klaus die Identität nicht erzeugen. Alle **fünf Bausteine** müssen
  drin sein, **einschließlich des Identitäts-Wechslers** (der fehlt in frühen
  Kopien am häufigsten — siehe Abschnitt D, Kimseek und Privat-Brain).
  `ribbonText` setzen, sonst bleibt das Band leer; ein geratener Name gehört
  nicht auf eine Auszeichnung.
- **Karten-Link** auf `https://lausiklauskn-png.github.io/mycel-karte/`
- **Drift-Guard im Smoke** — und zwar **beide Formen prüfen**: manche Repos
  nageln nur die **ersten 16 Zeichen** des SHA fest (`SB-KIMTool-Point`,
  `BookLedgerPro`). Wer nur die 64er-Form ersetzt, hinterlässt einen roten Guard.

### Schritt 5b — die zurückhängenden Kopien nachziehen (aus Schritt 0)

Fünf Kopien der Netz-Oberfläche und elf des Siegel-Moduls hängen zurück
(Abschnitt D). Das ist **kein Extra-Auftrag**, sondern die Voraussetzung dafür,
dass „nach dem Bauplan aus Sage" überhaupt stimmt — sonst stehen nach dieser
Sitzung fünf neue Knoten auf dem aktuellen Stand neben elf alten.

- **Zuerst** `Sage-Protokol/sbkim-bundle-voll/modules/` — das ist das Bündel,
  aus dem Forker kopieren. Solange es alt ist, verteilt Sage seinen eigenen
  Rückstand weiter.
- Dann `PWA-Toolpoint`, `family-project`, `Mein-Rezeptbuch`, `Mein-Mixarium`.
- Beim Siegel-Modul die elf Kopien — **ein PR pro Repo**, Drift-Guard neu
  genagelt. **Beide SHA-Formen prüfen** (64 und 16 Zeichen).
- `Kimseek` und `Privat-Brain`: Identitäts-Wechsler im `siegel-inhalt.js`
  ergänzen. Das ist **kein** Drift-Guard-Fall (App-Konfiguration), sondern
  Handarbeit nach dem Muster von Kimboard — mit dem **eigenen** ID-Präfix.

### Schritt 6 — die B-Liste schließen (billig, gehört dazu)

- `Company-Brain`: hat nur die sechs Kern-Module. Es fehlt praktisch alles
  Sichtbare — Modul 15/16/17, die Netz-Oberfläche, die Spore. Behandle es wie
  ein A-Repo, nicht wie einen Nachzügler.
- `Privat-Brain`: benutzt ein **eigenes** `net-widget.js` statt der
  Kanon-Oberfläche. Erst nachsehen, **warum** — wenn es nur älter ist, auf den
  Kanon umstellen; wenn es etwas kann, das der Kanon nicht kann, gehört das
  **nach Sage** (Klaus' Regel aus Schritt 0). Nicht ungeprüft überschreiben.
- `Mein-Rezeptbuch`, `Mein-Mixarium`: **Karten-Link**
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
5. ~~**„Die in der Höhe, im Handymodus, aktualisierte Version"** des Flying~~
   **✅ BEANTWORTET (Klaus, 2026-08-16): „die vorhandene ist gemeint, bau damit."**
   Also die Kanon-Fassung `b496bc86b5b2` — nichts zu suchen, nichts nachzubauen.
   Die Handy-Behandlung steckt im Modul und wird **nicht** app-seitig
   überschrieben. Die ursprüngliche Frage bleibt darunter stehen, damit
   nachvollziehbar ist, warum sie gestellt wurde:

   ~~**Die in der Höhe, im Handymodus, aktualisierte Version** des Flying
   Widgets — hier ist eine ehrliche Unschärfe: gemessen gibt es **nur zwei**
   Fassungen der Datei, und sie unterscheiden sich ausschließlich um den
   Mycel-Karten-Link (30 Zeilen, 2026-08-16). Eine dritte, „in der Höhe
   überarbeitete" Fassung existiert im Netz **nicht** — die Handy-Behandlung
   (`max-height:80vh`, `min(420px,92vw)`, Rückklemmen beim Drehen) steckt in
   **beiden**. Zwei Möglichkeiten: Klaus meint genau diese, dann ist alles gut;
   oder er meint eine Verbesserung, die er am Tablet gesehen hat und die noch
   **nirgends committet** ist. **Fragen, bevor gebaut wird** — nicht raten. Was
   auch immer herauskommt: es gehört **in den Kanon**, nicht in fünf Kopien.~~

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
