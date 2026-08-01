# Brief — Zwei Lighthouse-Befunde in den geteilten SBKIM-Modulen heilen

**Angelegt:** 2026-08-01 · **Auslöser:** Lighthouse-Messung an Mein-Rezeptbuch und
Muttis-Rezeptbuch (PRs MR #357/#358, Muttis #170/#171, alle gemergt).
**Klaus' Entscheidung 2026-08-01:** eigene Folge-Sitzung, nicht zwischen zwei
andere Aufgaben gequetscht — die Runde berührt 14 Apps plus die Bündel in Sage.

---

## Warum dieser Brief existiert

Beim Aufräumen der Rezeptbücher blieben genau zwei Befunde stehen, die **nicht**
den Apps gehören, sondern den **geteilten Modulen**. Sie in der Kopie zu flicken
wäre Klonen statt Kopieren — also gehören sie hierher, an die Quelle.

Beide sind gemessen, nicht vermutet: Lighthouse 13.4.1, Desktop-Preset, gegen die
lokal ausgelieferte `index.html`.

---

## Befund 1 — Widget-Beschriftungen zu blass (`17_floating_widget.js`)

Die Text-Labels neben den Lampen (LEBT / VERKEHR / FREMD) sind auf hellen Seiten
nicht ausreichend lesbar:

| Label | gemessen | Soll |
|---|---|---|
| aktiver Slot (`--sbkim-widget-fg` `#F5F5FF`) | **4,11:1** | 4,5:1 |
| ruhender Slot (`--sbkim-widget-fg-dim`) | **2,36:1** | 4,5:1 |

**Ursache:** `--sbkim-widget-bg` ist `rgba(0, 0, 0, 0.45)`. Über einer hellen
Seite ergibt das einen mittelgrauen Verlauf (gemessen `#7a7772`) — zu hell für die
weiße Schrift und viel zu hell für die auf 55 % abgeblendete. Das Widget wurde für
die dunkle Sage-Page entworfen; in einer hellen PWA kippt die Rechnung.

**Vorschlag (an der Quelle, `src/modules/17_floating_widget.js` ~Zeile 333):**

```js
"  --sbkim-widget-bg: rgba(18, 18, 24, 0.86);",   // war rgba(0, 0, 0, 0.45)
"  --sbkim-widget-fg: #F5F5FF;",
"  --sbkim-widget-fg-dim: rgba(245, 245, 255, 0.75);",  // war 0.55
```

Damit ist der Untergrund unabhängig von der Seite darunter (≈ `#14141a`), die
helle Schrift kommt auf ~16:1, die abgeblendete auf ~7:1. Der Glas-Eindruck bleibt
(der `backdrop-filter` ist unberührt), er wird nur satter.

**Wichtig:** die Variablen sind bewusst als `:root`-Variablen ausgelegt, damit eine
PWA sie überschreiben kann (Kommentar direkt darüber). Der Vorschlag ändert nur den
**Standard**, nicht diese Möglichkeit.

## Befund 2 — „🔑 Schlüssel holen"-Link ohne Adresse (`23_rendezvous_ui.js`)

Lighthouse `crawlable-anchors`: das `<a>` wird ohne `href` erzeugt und bekommt eine
Adresse erst in `updateKiKeyLink()`, wenn es sichtbar wird. Solange es verborgen
ist, ist es ein Link ins Nichts — für Suchmaschinen und für Vorlesewerkzeuge.

**Ursache** (~Zeile 1254, Erzeugung) und **Fix**: die Adresse gleich beim Anlegen
setzen, statt erst beim Einblenden. Eine Zeile:

```js
kiKeyLinkEl = doc().createElement("a");
kiKeyLinkEl.href = KI_KEY_URLS[kiProvider] || KI_KEY_URLS[Object.keys(KI_KEY_URLS)[0]] || "";
kiKeyLinkEl.textContent = "🔑 Schlüssel holen ↗";
```

`updateKiKeyLink()` überschreibt sie danach wie bisher beim Anbieter-Wechsel.

---

## Reihenfolge der Runde

1. **Quelle heilen:** `src/modules/17_floating_widget.js` + `src/modules/23_rendezvous_ui.js`.
2. **Sages eigene byte-Kopien nachziehen**, sonst schlagen die Drift-Guards an:
   - `sbkim-bundle/modules/23_rendezvous_ui.js`
   - `sbkim-bundle-voll/modules/17_floating_widget.js`, `…/23_rendezvous_ui.js`
3. **Smoke-Suiten laufen lassen** (`smoke_bau23_rendezvous_ui.mjs` u. a.) — die
   prüfen `_meta` und Sichtbarkeit, nicht Farben; ein Bruch wäre also ein echter.
4. **In die Apps kopieren.** Betroffen sind:

   | Modul 17 | Modul 23 |
   |---|---|
   | BookLedgerPro/sbkim/ | BookLedgerPro/sbkim/ |
   | Jasons-Tresor/sbkim/ | Jasons-Tresor/sbkim/ |
   | Kim-Bell/modules/sbkim-floating-widget.js | Kim-Bell/modules/sbkim-rendezvous-ui.js |
   | Kimboard/modules/ | Kimboard/modules/ |
   | Kimseek/modules/ | Kimseek/modules/ |
   | Mein-Mixarium/sbkim/ | Mein-Mixarium/sbkim/ |
   | Mein-Rezeptbuch/sbkim/ | Mein-Rezeptbuch/sbkim/ |
   | Mein-Tresor/sbkim/ | Mein-Tresor/sbkim/ |
   | Mein-WorkFloh/modules/sbkim-floating-widget.js | Mein-WorkFloh/modules/sbkim-rendezvous-ui.js |
   | Muttis-Rezeptbuch/sbkim/ | Muttis-Rezeptbuch/sbkim/ |
   | Privat-Brain/modules/ | — |
   | SB-KIMTool-Point/web/tools/sbkim-floating-widget.js | SB-KIMTool-Point/web/tools/sbkim-rendezvous-ui.js |
   | Tomys-Hub/sbkim/ | Tomys-Hub/sbkim/ |
   | family-project/sbkim/ | family-project/sbkim/ |

   **Achtung, gemessen 2026-08-01:** `17_floating_widget.js` ist in
   Mein-Rezeptbuch **schon von Sage abgewichen** (166 Diff-Zeilen). Vor dem
   Überkopieren prüfen, in welche Richtung die Abweichung geht — sonst wird eine
   Pflege zurückgedreht. `23_rendezvous_ui.js` war dort byte-identisch.
5. **Mein-Mixarium** braucht danach den md5-Abgleich `index.html` ↔ QC-Datei.

---

## Was in dieser Runde NICHT dran ist

- Die **70 geisterhaften Platzhalter-Karten** in Muttis (`.rname.em`, 1,44:1)
  bleiben blass — Klaus' ausdrückliche Entscheidung 2026-08-01, das ist Absicht
  und kein Fehler.
- Die **Ladezeit** der Rezeptbücher (LCP ~16 s bei 4,8 MB Einzeldatei) ist der
  Preis der Offline-Fähigkeit und wurde bewusst nicht angetastet.

---

## Was in den Rezeptbüchern schon erledigt ist (zur Einordnung)

| | Mein-Rezeptbuch | Muttis-Rezeptbuch |
|---|---|---|
| Bedienbarkeit | 88 → **96** | 87 → **95** |
| Auffindbarkeit | 82 → **91** | 80 → **90** |
| Leistung | 28 → **46** | 67 → 66 |

Gemacht: Eruda nur noch auf Abruf statt bei jedem Start (MR), toter
Cloudflare-Rest raus (Muttis), Zoom wieder erlaubt, `meta description`,
`role="main"`, neue Variable `--fill` für Flächen mit weißer Schrift, neue
Variable `--dim` für lesbare Nebenschrift.

---

## Pflichtlektüre vor dieser Sitzung

1. `CLAUDE.md` — Verfassung (inkl. § Fremdnutzer-/Marktplatz-Brille).
2. `docs/PULS.md` — Stand.
3. Dieser Brief.
4. `docs/components/17_floating_widget.md` + `docs/components/23_rendezvous.md`.
5. Der Code der beiden Module.

## Abschluss-Befehl

`docs/PULS.md` fortschreiben, Übergabeprotokoll in `docs/sessions/archiv/`,
„Nächste Schritte"-Block in die Chat-Antwort, und den nächsten Brief als
Codeblock im Chat ausgeben — die Kette reißt nie ab.
