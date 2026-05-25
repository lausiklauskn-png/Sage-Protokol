# Modul 17 — Floating-Widget

> **Status:** 🟨 Spec fertig (2026-05-25, Spec-Sitzung 17) · Widget-Backlog · **Priorität hoch** (vor App-Freigabe, Pipeline-Schritt 5b)  ·  **Schicht:** Render-Schicht (kein protokoll-aktives Modul)  ·  **Anker:** floating Mini-Panel im Eruda-Stil, self-mountend in `<body>` aller Endknoten-PWAs (Sage-Page behält Navleisten-Lampen)
> **Datei (Code):** `src/modules/17_floating_widget.js` (existiert noch nicht — Bau-Sitzung 17 nach dieser Spec-Sitzung fällig)

---

## Im Mycel-Bild

Ein Pilz, der sich selbst beobachtet, baut ein **Sichtkästchen**: vier
kleine Fenster, durch die der Betreiber von außen reinschaut und sieht,
ob die Hyphe atmet (LEBT), ob sie spricht (VERKEHR), ob jemand an die
Membran klopft (FREMD), und ob sie ihre Selbst-Bezeugung erbracht hat
(SIEGEL). Das Sichtkästchen ist nicht das Mycel — es ist ein **Spiegel**,
den der Pilz an sich selbst hängt, damit der Betreiber den Zustand auf
einen Blick liest.

## Vokabular

- **Floating-Widget** — ein self-mountendes, drag-fähiges Mini-Panel
  im Eruda-Stil. Vier nebeneinander liegende Status-Slots, ein winziger
  X-Knopf zum Verbergen, Drag-Griff zum Verschieben, `localStorage`-
  persistierte Position + Sichtbarkeit.
- **Status-Slot** — eine der vier Lampen-/Plaketten-Stellen
  (`LEBT` / `VERKEHR` / `FREMD` / `SIEGEL`). Jeder Slot hat einen
  Anti-Greenwashing-Pfad: er leuchtet nur, wenn er auf einem realen
  Modul-Event aufsetzen kann.
- **Event-Bus** — `window.dispatchEvent(new CustomEvent("sbkim:<kanal>", { detail: … }))`.
  Module 02/05/15 (sub b)/15 (sub e)/16 dispatchen ihren jeweiligen
  Status. Modul 17 lauscht passiv und kennt **keine** Modul-Referenz.
- **Anti-Greenwashing pro Slot** — kein Slot leuchtet, ohne dass ein
  zugrundeliegendes Modul-Event ihn bestätigt. Insbesondere SIEGEL
  bleibt unsichtbar wenn `SbkimSiegel.isCertified() === false`
  (analog Karte 16 § Strikte Tabus).
- **Klaus-Festlegung 2026-05-25 (Tafel-Evolutions-Klausel)** — der
  ursprüngliche 2-Plaketten-Vorschlag im Brief
  `BRIEF_SPEC_15_16_FLOATING_WIDGET.md` § Punkt 3 ist abgelöst durch
  ein 4-Slot-Live-Status-Dashboard. Begründung: ein Widget mit nur
  FREMD + SIEGEL wäre dekorativ; vier Slots machen den SBKIM-Lauf
  sichtbar (atmet, redet, hört, ist bezeugt).

## Warum jetzt (Hochstufungs-Begründung)

Klaus' Live-Sichttest 2026-05-25 nach den ersten zwei Endknoten-
Migrationen (Mein-Rezeptbuch + Mein-Mixarium) hat den Befund geliefert:
Lampen + Siegel in der Navleiste nehmen zu viel Platz, kein User-X-
Schließen, kein Drag, Container-Anker `.lamps` ist nicht einheitlich
zwischen den Endknoten. Vor der App-Freigabe (Pipeline-Schritt 6) muss
ein **einheitliches Modul** stehen, das beliebig viele Endknoten ohne
HTML-/CSS-Kopier-Pflicht andocken können. Eruda hat das Pattern bewiesen
— ein einziger `<script>`-Tag, das Tool self-mountet sich. Modul 17
adoptiert das Pattern für SBKIM.

---

## Vier-Slot-Layout (verbindlich)

### Übersicht

Vier nebeneinander liegende Status-Slots, von links nach rechts:

| Slot | Symbol | Aktiv-Quelle (Modul) | Aktiv-Zustand | Inaktiv-Zustand | Anti-Greenwashing |
|---|---|---|---|---|---|
| **LEBT** | grüner Punkt | Modul 02 (Spore) | pulsiert (Atmungs-Animation) | grau (kein Modul-02-Event) | grau wenn `sbkim:alive` nie gefeuert |
| **VERKEHR** | gold-pulsierende Plakette | Modul 05 (Anastomose) + Modul 15 Sub (b) (postMessage) | kurzer Puls pro Event | dunkel (keine Events) | dunkel wenn kein Modul aktiv |
| **FREMD** | rote Lampe | Modul 15 Sub (e) (Fremdzugriff) | dauer-rot solange Buffer nicht leer + Puls pro Eintrag | grau (Buffer leer ODER Modul 15 fehlt) | grau wenn `sbkim:fremd-alert` nie gefeuert |
| **SIEGEL** | Gold-Medaillon mit Wappen-SVG | Modul 16 (SBKIM-Siegel) | sichtbar (Edel-Gold-Badge, First-Boot-Animation einmalig) | **NICHT IM DOM** (Element wird gar nicht angelegt) | binär: kein Render wenn `isCertified() === false` |

### Maße und Footprint

- **Footprint Desktop / Tablet (≥ 481 px):** ~200 px × 48 px Gesamt-
  Pille, vier 40 px × 40 px Slot-Elemente horizontal, je 4 px Gap
  dazwischen, plus 8 px Padding rings um die Slots, plus winziger
  Drag-Griff oben mittig (~ 16 px Höhe `:hover`) und winziger X-Knopf
  oben rechts (~ 12 px). Gesamt-Box mit `border-radius: 12px`,
  halbtransparenter dunkler Hintergrund (z.B. `rgba(20, 20, 30, 0.85)`
  + `backdrop-filter: blur(8px)`).
- **Footprint Mobile (≤ 480 px):** identische 4-Slot-Pille, leicht
  schmaler (Slots auf 36 px × 36 px, Gap 3 px) — **kein** Karussell,
  **kein** Slot-Wechsel. Vier Slots passen auch auf 360 px-Screens noch
  in eine Zeile (4 × 36 + 3 × 3 + 2 × 8 = 169 px). Klärungs-Entscheidung
  Bau-Sitzung 17: bleibt es bei 36 px oder werden alle vier Slots
  proportional verkleinert?
- **Default-Position:** `bottom-right` mit 16 px Abstand vom Rand
  (`right: 16px; bottom: 16px`). Eruda nutzt typisch unten-rechts —
  Andocker kann via `init({defaultCorner: "bottom-left"})` ausweichen.

### Z-Index-Konvention

- Widget-Container: `z-index: 9990` (über fast allem, aber unter Modals).
- Modul-15-Modal + Modul-16-Modal: `z-index: 9999` (das Eruda-Pattern
  belässt Eruda selbst auf einem deutlich höheren Index, daher ist
  9999 für SBKIM-Modals als Pattern-Konsistenz akzeptabel).
- Eruda: `z-index: 9999999` (out-of-the-box). Modul 17 bleibt strikt
  darunter, damit Klaus die Eruda-Konsole jederzeit aufrufen kann.

---

## Event-Bus-Schema (verbindlich)

Diese Spec legt **vier Custom-Events** auf `window` fest, die Modul 17
abonniert und die alle Modul-Anbieter dispatchen MÜSSEN, sobald die
Folge-Pflege (Bau-Sitzung 17 oder eigene Modul-02/05/15-Mini-Pflege-
Sitzungen) den jeweiligen Hook eingebaut hat.

### Pflicht-Events

| Event-Name | Dispatcher | Detail-Form | Trigger-Zeitpunkt |
|---|---|---|---|
| `sbkim:alive` | Modul 02 (Spore) | `{ since: "<ISO-Timestamp>", nodeId: "<base64url-sha256>" }` | einmalig nach erfolgreichem `init()` + `getOrCreateIdentity()` |
| `sbkim:handshake` | Modul 05 (Anastomose) | `{ outcome: "established" \| "rejected" \| "re-handshake" \| "rejected-local", peerNodeId: "<base64url-sha256>" \| null, direction: "incoming" \| "outgoing" }` | jeder erfolgreich abgeschlossene Handshake (sender + receiver beide) |
| `sbkim:postmessage` | Modul 15 Sub (b) | `{ op: "sporeRef" \| "query" \| "hint" \| "queryResult", direction: "incoming", decision: "accepted" \| "ignored" \| "rejected-allowlist" }` | jede eingehende `postMessage` mit `type:"sbkim/membrane/v1"` |
| `sbkim:fremd-alert` | Modul 15 Sub (e) | `{ kind: "membrane-read" \| "membrane-postmessage" \| "endpoint-probe", decision: "accepted" \| "ignored" \| "rejected-allowlist", bufferSize: number }` | jeder Neueintrag im Sub-(e)-Ringbuffer (Spiegelung des `subscribe(cb)`-Hooks) |
| `sbkim:siegel-certified` | Modul 16 (SBKIM-Siegel) | `{ certifiedAt: "<ISO-Timestamp>", repoUrl: "<string>" }` | einmalig nach erfolgreichem `init()` wenn `isCertified() === true` |

### Konvention

- **Event-Name-Schema:** `sbkim:<kanal>`. Kein Modul-Suffix, kein
  Versions-Suffix — die Detail-Form ist Spec-Wille und additiv
  versioniert (Felder hinzufügen erlaubt, vorhandene nicht umbenennen).
- **Detail-Form ist PII-frei.** Insbesondere keine `domain`-Strings,
  keine `text`-Inhalte von `query`-Payloads, keine `vector`-Inhalte
  von `hint`-Payloads. Modul 17 zeigt nur Counts und Status-Flags,
  keine Inhalte.
- **Anti-Greenwashing-Klausel:** ein Modul-Anbieter dispatcht das
  Event **NUR**, wenn die zugrundeliegende Operation real stattgefunden
  hat. Test-Brücken (z.B. `_recordForTest` aus Modul 15) feuern die
  Events absichtlich, weil das aus Sicht des Widgets ein „echter"
  Eintrag ist — die Disziplin gilt für produktiven Andocker-Code, nicht
  für Test-Stuben.
- **Bubbling:** Events `bubble: false`, `cancelable: false`. Modul 17
  registriert sich direkt auf `window`. Andere Module dürfen die Events
  ebenfalls abonnieren (z.B. eine zukünftige Sage-Page-Statistik-Karte).
- **Frequency-Drossel:** kein Drossel-Pflicht auf Anbieter-Seite —
  Modul 17 selbst macht Render-Drossel (typisch via `requestAnimationFrame`,
  Bau-Sitzung 17 entscheidet den genauen Mechanismus).

### Folge-Verdrahtung (NICHT in dieser Spec-Sitzung)

Spec-Sitzung 17 legt das **Event-Schema** fest. Die `dispatchEvent`-
Aufrufe in `src/modules/02_spore.js`, `src/modules/05_anastomose.js`
und `src/modules/15_membran.js` werden in **Bau-Sitzung 17** (oder
optional in eigenen Mini-Pflege-Sitzungen pro Modul) eingebaut.
Karten 02 / 05 / 15 bekommen in dieser Spec-Sitzung nur einen ein-
Satz-Verweis-Block ans Ende (siehe § Folge-Pflege-Liste unten).

---

## UX-Regeln und Tap-Verhalten

### Default-Sichtbarkeit (verbindlich)

**ALLE vier Slots sind immer im DOM**, auch wenn dunkel oder grau
(Ausnahme: SIEGEL bei `isCertified() === false` — dann ist der Slot
**nicht im DOM**, Anti-Greenwashing-Klausel Karte 16 § Strikte Tabus
binär). Ein leerer/dunkler Slot signalisiert „diese Funktion ist
bekannt, aber gerade inaktiv" — UX-Wahl gegen „verschwindende UI", die
Klaus verwirren würde.

Konsequenz: wenn z.B. Modul 15 nicht eingebaut ist, bleibt der FREMD-
Slot grau (kein Event hat ihn aktiviert), aber er ist sichtbar. Das ist
ehrlich: das Widget zeigt „diese App hat keine Fremdzugriff-Detektion".
Wer das nicht möchte, ruft `SbkimWidget.init({slots: ["lebt","verkehr","siegel"]})`
auf (siehe § API-Signatur, optionale Slot-Whitelist).

### Tap-Verhalten pro Slot

| Slot | Tap-Verhalten | Modal-Quelle |
|---|---|---|
| **LEBT** | öffnet **Status-Modal** ("Page lebt seit X Sekunden, Modul 02 initialisiert: ja/nein, nodeId-Präfix") | neu, von Modul 17 implementiert |
| **VERKEHR** | öffnet **Mini-Log** mit letzten 10 Events (Zeit, Quelle Modul 05/15, Richtung incoming/outgoing) | neu, von Modul 17 implementiert, RAM-only (FIFO 10), KEINE Persistenz |
| **FREMD** | öffnet bestehendes **Modul-15-Sub-(e)-Modal** unverändert | Modul 15 (Karte 15 § Sub (e) Modal) |
| **SIEGEL** | öffnet bestehendes **Modul-16-Sub-(c)-Modal** unverändert | Modul 16 (Karte 16 § Sub (c) Modal) |

**Klärung Punkt E aus Klaus' Zusatz-Wunsch:**

- **LEBT-Tap-Modal** ist ein neues kleines Status-Modal — Modul 17
  baut es selbst. Inhalt: Uptime-Counter (ms seit `sbkim:alive`-Event),
  Modul-02-Init-Status (boolean), nodeId-Präfix (erste 12 Zeichen,
  zur Wiedererkennung — voller String wäre PII). Bau-Sitzung 17
  entscheidet das exakte Layout.
- **VERKEHR-Tap-Modal**: RAM-only FIFO der letzten 10 Events,
  Format: `[Zeit] kind=handshake/postmessage, direction=incoming/outgoing, decision=...`.
  KEINE Persistenz in localStorage oder IndexedDB — das Mini-Log ist
  eine **lebende Schau** (analog Modul 15 Sub (e) § Persistenz-
  Entscheidung), kein Audit-Archiv. Wer Persistenz will, hängt einen
  zweiten Listener auf `sbkim:handshake` + `sbkim:postmessage` an und
  schreibt in seinen eigenen Store.
- **FREMD-Tap-Modal** und **SIEGEL-Tap-Modal** bleiben unverändert —
  Modul 15 + 16 mounten ihre eigenen Modals weiterhin in `document.body`
  (Karte 15 § Sub (e) Modal-Mount-Pfad, Karte 16 § Sub (c) Modal-Form).
  Modul 17 setzt nur den Click-Handler auf den Slot, der das jeweilige
  Modal-Open-Pattern triggert (typisch via `document.querySelector('#lamp-fremd').click()`
  oder via Modul-15-internem Modal-Opener, je nach Bau-Sitzung-17-
  Entscheidung — die Spec lässt das offen, weil Modul 15 + 16 keine
  Public-Surface-Modal-Open-Funktion exponieren).

### Drag-Mechanik

- **Touch + Mouse beide unterstützt** über Pointer-Events-API
  (`pointerdown` / `pointermove` / `pointerup`).
- **Drag-Threshold 5 px** — kurze Klicks (< 5 px Bewegung) werden als
  Tap interpretiert und triggern den Slot-Klick-Handler. Bewegung
  ≥ 5 px aktiviert Drag-Modus.
- **Drag-Griff:** dezenter horizontaler Doppel-Strich oben mittig
  (`::` oder ähnliches Glyph) **oder** die gesamte Pille ist drag-
  fähig, wenn der Klick außerhalb der vier Slot-Bereiche landet.
  Klärungs-Entscheidung Bau-Sitzung 17: **gesamte Pille drag-fähig
  außerhalb der Slots empfohlen** (kein eigener Griff nötig, weniger
  DOM-Komplexität). Eruda macht es so.
- **Drag-Zustand:** Pille bekommt Klasse `.sbkim-widget-dragging`,
  leichter Schatten-Lift (`box-shadow: 0 8px 24px rgba(0,0,0,0.4)`,
  `transform: scale(1.03)`), Cursor `grabbing`.
- **Snap-zu-Ecken vs. freies Drag:** Klärungs-Entscheidung Bau-Sitzung
  17 — **freies Drag mit Pixel-Präzision empfohlen** (Klaus' Tablet-
  UX braucht Pixel-Wahl, Snap würde an Ecken kleben und Cocktail-Foto
  verdecken). Snap kann später als Option (`init({snapToCorners: true})`)
  nachgereicht werden, wenn ein Endknoten konkret darum bittet.
- **Position-Persistierung** siehe § localStorage-Schema unten.

### X-Schließen + Wiederherstellung (vier Pfade)

- **X-Knopf** oben-rechts auf der Pille (~ 12 px, halbtransparent,
  Hover-Aufhellung). Klick blendet das Widget aus (`display: none` +
  `localStorage.setItem("sbkim_widget_visible", "false")`).
- **Wiederherstellungs-Pfade (vier):**
  - (a) `SbkimWidget.show()` in der DevTools-Konsole (z.B. via Eruda).
  - (b) **5-Klick-Geste** am SBKIM-Such-Symbol (Modul 00 Doku-Fenster-
    Konvention). Wenn Modul 00 geladen ist und in seinem `init()` einen
    Such-Selektor übergeben hat, hängt sich Modul 17 als sekundärer
    Listener an dieselbe Geste — Modul 00 öffnet sich (Doku-Fenster),
    Modul 17 zeigt sich (`show()`). **Klärungs-Entscheidung:** die
    konkrete Hook-Form (`SbkimDoku.subscribeOpenGesture(cb)`-API oder
    DOM-Event `sbkim:doku-open`) entscheidet eine Folge-Pflege-Sitzung
    Modul 00; diese Spec verlangt nur, dass es **einen** Pfad gibt.
    Bau-Sitzung 17 entscheidet, welchen Hook sie nutzt — wenn Modul 00
    den Hook noch nicht hat, dann nur Pfade (a)/(c)/(d).
  - (c) **Doku-Fenster-Knopf**: wenn Modul 00 Doku-Fenster geöffnet ist,
    bekommt es einen optionalen Knopf „SBKIM-Widget anzeigen" (Folge-
    Pflege Modul 00, NICHT in dieser Spec-Sitzung).
  - (d) **Nächster Tab-Reload?** Klärungs-Entscheidung: **User-Wahl
    persistent respektiert.** Wenn Klaus das Widget per X versteckt,
    bleibt es nach Reload versteckt, bis er es explizit über (a)/(b)/(c)
    wieder zeigt. Argument: User-Wahl ist heilig; das Widget aufzuzwingen
    nach jedem Reload wäre Anti-UX. Wer das andere Verhalten will, ruft
    `init({rememberHidden: false})` (Bau-Sitzung 17 implementiert die
    Option, Default `true`).

---

## Schnittstelle (final)

```js
window.SbkimWidget = {
  // Async-Init: mountet die Pille in <body>, registriert die fünf
  // Event-Listener (sbkim:alive / :handshake / :postmessage /
  // :fremd-alert / :siegel-certified), liest localStorage für
  // visible + position. Idempotent — zweiter Aufruf no-op.
  init: function (options) { /* Promise<void> */ },

  // Sync — Widget einblenden (display:none entfernen, localStorage
  // sbkim_widget_visible = "true"). Wenn nicht initialisiert: no-op +
  // console.warn.
  show: function () { /* void */ },

  // Sync — Widget ausblenden + localStorage-Wahl persistieren.
  hide: function () { /* void */ },

  // Sync — boolean (true wenn aktuell sichtbar). Liest aus DOM-State,
  // nicht aus localStorage (sonst könnten DOM und localStorage drift).
  isVisible: function () { /* boolean */ },

  // Sync — { corner, offsetX, offsetY } | { x, y } je nach Drag-Modus.
  // Defensive Kopie. Wenn nicht initialisiert: { corner: "bottom-right",
  // offsetX: 16, offsetY: 16 } als Default.
  getPosition: function () { /* PositionSnapshot */ },

  // Read-Anker für Tests (analog Modul 15 / Modul 16 _meta):
  //   slots:          string[]  (aktive Slot-IDs, aus init() options)
  //   eventCounts:    { alive, handshake, postmessage, fremdAlert, siegelCertified }
  //   trafficLogSize: number    (Anzahl Einträge im VERKEHR-FIFO, max 10)
  //   widgetMounted:  boolean
  //   firstBootShown: boolean
  _meta: { /* Read-Only-Anker */ },
};
```

### `options`-Form (`init()`)

```js
{
  // PFLICHT — durchgereicht an Modul 15 (siehe Karte 15 § Sub (b) Konfigurations-Pfad).
  // Wenn weggelassen: Modul 17 ruft SbkimMembrane.init() NICHT — der
  // Andocker ist dafür weiter selbst zuständig (Modul 17 ist Render-
  // Schicht, kein Init-Bündler). Klärungs-Entscheidung Bau-Sitzung 17:
  // ob ein gebündelter Init-Pfad sinnvoll ist (eine Zeile statt drei),
  // oder ob die Disziplin „jedes Modul wird im Andocker explizit
  // initialisiert" wichtiger ist. Spec-Sitzung 17 EMPFIEHLT:
  // KEINE gebündelte Init durch Modul 17 — Andocker initialisiert
  // Modul 15 + 16 weiterhin explizit, Modul 17 ist nur Render-
  // Konsument der Events.
  allowedOrigins?: string[],      // nur zur Doku-Spiegelung, NICHT durchgereicht

  // PFLICHT für Modul 16 — siehe Karte 16 § Sub (c) Repo-URL-Quelle.
  // Wie allowedOrigins: nur Doku-Spiegelung, NICHT durchgereicht.
  repoUrl?: string,

  // OPTIONAL — Default-Position + UX:
  defaultCorner?: "top-left" | "top-right" | "bottom-left" | "bottom-right",
                                  // Default "bottom-right"
  defaultOffset?: { x: number, y: number },
                                  // Default { x: 16, y: 16 }
  allowClose?: boolean,           // Default true. false = kein X-Knopf, Widget immer sichtbar
  allowDrag?: boolean,            // Default true. false = fixe Position
  rememberHidden?: boolean,       // Default true. Wenn false: ignoriert localStorage-Wahl,
                                  // zeigt Widget bei jedem Reload neu (Spec-Wille:
                                  // User-Wahl heilig, Default true).

  // OPTIONAL — Slot-Whitelist. Default ["lebt","verkehr","fremd","siegel"]
  // (alle vier). Ein Endknoten ohne Modul 15 könnte z.B. ["lebt","siegel"]
  // setzen, dann werden die VERKEHR + FREMD-Slots gar nicht angelegt.
  slots?: ("lebt" | "verkehr" | "fremd" | "siegel")[],

  // OPTIONAL — z-index-Override für Eruda-Kollision oder spezielle
  // Endknoten-Stapelung. Default 9990.
  zIndex?: number,

  // OPTIONAL — Theme. Default "auto" (folgt prefers-color-scheme).
  // "dark" / "light" überschreibt.
  theme?: "auto" | "dark" | "light",
}
```

### `PositionSnapshot`

```js
{
  corner:  "bottom-right" | "top-right" | "bottom-left" | "top-left" | null,
  offsetX: <number>,   // px von der Corner-Kante
  offsetY: <number>,   // px von der Corner-Kante
  x:       <number> | null,   // wenn Free-Drag aktiv: absolute px von links
  y:       <number> | null,   // wenn Free-Drag aktiv: absolute px von oben
}
```

Bau-Sitzung 17 entscheidet, ob Snap-zu-Ecken aktiv ist (dann `corner`
+ `offsetX/Y`) oder Free-Drag (dann `x` + `y`). Spec-Empfehlung: Free-
Drag (siehe § Drag-Mechanik).

### `localStorage`-Schema

| Schlüssel | Wert | Default |
|---|---|---|
| `sbkim_widget_visible` | `"true"` \| `"false"` | `"true"` |
| `sbkim_widget_position` | JSON-Stringify eines `PositionSnapshot` | `{corner:"bottom-right", offsetX:16, offsetY:16}` |

`localStorage` statt `IndexedDB`-Store (`sbkim_doku_meta`) gewählt, weil
(1) Modul 17 ist Render-Schicht ohne Storage-Modul-Abhängigkeit, (2)
`localStorage` funktioniert auch dann, wenn Modul 01 nicht initialisiert
wurde (Anti-Greenwashing-konsistent: das Widget startet, auch wenn die
SBKIM-Initialisierungs-Kette unterbrochen ist), (3) die persistierten
Werte sind reine UX-Preferences ohne Protokoll-Relevanz.

### Modal-Bridge (Slot-Klick → bestehende Modals)

- **FREMD-Slot Click** → Modul-15-Modal öffnen. Bau-Sitzung 17
  entscheidet den Pfad: entweder direkter `document.querySelector('#sbkim-widget-fremd-slot').click()`
  triggert intern den Modul-15-Modal-Opener (Modul 15 horcht auf
  `click` an `#lamp-fremd` — Modul 17 müsste also einen Proxy-Click
  setzen oder den Modul-15-Modal-Mechanismus direkt anstoßen), oder
  Modul 17 ruft eine zukünftige `SbkimMembrane.openFremdModal()`-API
  (existiert noch nicht — eigene Folge-Pflege Modul 15, falls Bau-
  Sitzung 17 sie braucht).
- **SIEGEL-Slot Click** → Modul-16-Modal öffnen. Analog: Bau-Sitzung
  17 entscheidet, ob Proxy-Click auf `#sbkim-siegel-badge` oder
  direkte API.

**Spec-Empfehlung:** Modul 17 erzeugt **interne** Click-Trigger-DOM-
Elemente mit den jeweiligen IDs (`#sbkim-widget-fremd-trigger`,
`#sbkim-widget-siegel-trigger`), die in einem unsichtbaren Container
liegen. Modul 15 + 16 mounten ihre Click-Handler weiterhin auf
`#lamp-fremd` / `#sbkim-siegel-badge`. Modul 17 ruft beim Slot-Klick
einen Proxy-Click auf das jeweilige existierende Element auf — wenn
es im DOM ist. Falls Modul 15 / 16 nicht eingebaut sind oder ihr
Mount-Element noch nicht da ist, ist der Slot-Click ein no-op +
`console.warn` (fail-soft).

---

## Strikte Tabus (verbindlich)

- **KEINE eigene Identität.** Modul 17 erzeugt keine Spore, keine
  Schlüssel, keine `nodeId`. Es lebt rein in der Render-Schicht.
- **KEINE Krypto.** Keine Signaturen, keine Hashes, kein PBKDF2.
- **KEIN IndexedDB-Schreiben.** Nur `localStorage` für UX-Preferences
  (Visible-Flag, Position). Keine SBKIM-Store-Erweiterung, kein
  `DB_VERSION`-Bump, kein neuer Store.
- **KEIN Netz-Pfad.** Kein `fetch`, kein `BroadcastChannel`, keine
  `postMessage`, kein Service-Worker-Hook. Reine Page-Schicht-Render.
- **KEIN Auto-Verhalten ohne `init()`-Aufruf.** Wer Modul 17 als
  `<script>` einbindet, sieht beim Skript-Laden nur die Selbstcheck-
  Zeile. Erst `SbkimWidget.init()` mountet die Pille.
- **KEIN Override der Modul-15-+-16-Modals.** Slot-Click öffnet die
  bestehenden Modals unverändert (Modal-Bridge via Proxy-Click).
- **KEIN Replay-Cache, keine RAM-Persistenz über Tab-Reload hinaus**
  (außer dem 10-Element-VERKEHR-FIFO, der bei jedem Reload bei 0
  startet — analog Modul 15 Sub (e) Ringbuffer).
- **KEIN Anti-Greenwashing-Bypass.** SIEGEL-Slot bleibt nicht im DOM,
  wenn `SbkimSiegel.isCertified() === false`. FREMD/VERKEHR/LEBT-Slots
  bleiben grau, wenn kein Event sie aktiviert (sichtbar, aber unaktiv).
- **KEIN Dauer-Disclaimer-Schwall im Widget selbst.** Erklärungen
  gehören in das Sub-(c)-Modal von Modul 16 (Self-Inscribing-Klausel)
  bzw. in das Sub-(e)-Modal von Modul 15 (Fremdzugriff-Liste).
- **KEINE Anhängigkeit von einem konkreten Pflicht-Modul.** Modul 17
  initialisiert, auch wenn Modul 02 / 05 / 15 / 16 alle fehlen — alle
  vier Slots bleiben dann grau bzw. SIEGEL gar nicht im DOM. Disziplin:
  das Widget ist ein **passiver Beobachter** der SBKIM-Schicht.
- **KEIN Protokoll-Versions-Bump.** Modul 17 ist nicht protokoll-aktiv,
  PROTOCOL_VERSION bleibt unangetastet.
- **KEINE Spore-Schema-Erweiterung.** Modul 17 hat keinen Spore-
  Bezug. (Analog Karte 16 § Strikte Tabus.)
- **KEINE Pflicht-Module-Liste.** Modul 17 prüft NICHT, ob Modul 02 / 05
  / 15 / 16 da sind — es lauscht nur auf Events. Wer Pflicht-Modul-
  Bezeugung will, baut das in Modul 16 (das ist genau dafür da).

---

## Persistenz

**Wahl: `localStorage`-only** (analog Modul 15 / 16 RAM-only-Pattern,
mit zwei UX-Preference-Schlüsseln in `localStorage`).

Begründung in drei Sätzen:

1. Modul 17 ist eine **Render-Schicht ohne Storage-Modul-Abhängigkeit**
   — es soll auch funktionieren, wenn Modul 01 nicht initialisiert
   wurde. `localStorage` ist Browser-Standard, immer verfügbar, ohne
   `await`/Promise-Pflicht.
2. Die persistierten Werte (Visible-Flag, Position) sind **reine UX-
   Preferences** ohne Protokoll-Relevanz. Sie gehören weder ins
   Pflicht-Module-Schema (Karte 16) noch in die Sub-(e)-Beobachtung
   (Karte 15) noch in die Spore (Karte 02).
3. Der VERKEHR-Mini-Log (10 letzte Events) ist **RAM-only** (kein
   `localStorage`, kein IndexedDB) — analog Modul 15 Sub (e) Persistenz-
   Entscheidung. Wer Persistenz will, hängt einen eigenen Listener auf
   die Custom-Events und schreibt in seinen eigenen Store.

**Konsequenz:** Tab-Reload mit `rememberHidden:true` (Default)
respektiert die User-Wahl Visible/Hidden + persistiert die Position.
Der VERKEHR-Log startet bei jedem Reload neu mit leerem FIFO.

---

## Sage-Page-Pfad (Klaus-Festlegung 2026-05-25)

Sage-Page **behält** ihre Navleisten-Lampen (`#lamp-alive`, `#lamp-traffic`,
`#lamp-fremd`, `#sbkim-siegel-badge`) als Sage-page-spezifischer
Identitäts-Optik-Pfad — siehe Karte 15 § Sub (e) Lampe in der Navleiste
+ Karte 16 § Sub (b) DOM-Anker und Position.

**Endknoten** (Mein-Rezeptbuch, Mein-Mixarium, künftige Endknoten)
bekommen das **Widget** als Standard-Pfad — Karte 09 § Schritt 10 + 11
schrumpfen in einer Folge-Pflege-Sitzung (NICHT in dieser Spec-Sitzung)
auf je drei Zeilen Modul-Datei-Kopie + `<script>`-Tag + ein
`SbkimWidget.init({allowedOrigins, repoUrl})`-Aufruf (siehe Bau-Sitzung
17 Brief).

**Zweigleisigkeit ist Spec-Wille:** Modul 15 + 16 behalten ihre
bestehenden `lampSelector` / `badgeSelector`-Init-Pfade vollständig
unverändert — das ist der **Sage-Page-Pfad**. `SbkimWidget` ist der
**Endknoten-Standard**. Ein Endknoten-Bauer darf bewusst den
Navleisten-Pfad wählen (z.B. wenn er die Sage-Page-Optik nachbauen
will) und einfach `SbkimWidget.init()` weglassen — Modul 15 + 16
funktionieren unabhängig.

---

## Risiken

- **Slot-Event-Drift.** Wenn ein Modul (z.B. Modul 05) das
  `sbkim:handshake`-Event nicht dispatcht (weil die Bau-Sitzung 17-
  Folge-Pflege Modul 05 nicht eingebaut hat), bleibt der VERKEHR-
  Slot dauerhaft dunkel. Mitigation: Bau-Sitzung 17 verdrahtet die
  vier Pflicht-Events in einer **gemeinsamen** Sitzung; alternativ
  pro Modul eine eigene Mini-Pflege. Klaus' Sichttest-Pflicht: einer
  der vier Slots muss bei normalem Andock-Lauf wenigstens kurz
  pulsieren.
- **`localStorage`-Verlust.** Browser-Daten-Wipe, Inkognito-Modus,
  iOS-Safari-7-Tage-Reset (Storage-Cleanup-Policy) — Position +
  Visible-Flag gehen verloren. Mitigation: bewusste Akzeptanz; das
  Widget startet mit Default-Position unten-rechts + sichtbar, was
  ein vernünftiger Default ist.
- **Eruda-Kollision.** Eruda-Floating-Button überlappt das Widget bei
  Default-Position bottom-right. Mitigation: `init({defaultCorner:
  "bottom-left"})` für Sage-Page-Setup mit Eruda. Bau-Sitzung 17 darf
  optional einen Eruda-Erkennungs-Check einbauen (typof
  `window.eruda !== "undefined"` → automatisch bottom-left), aber
  Spec-Sitzung legt das nicht fest.
- **Mobile-Footprint zu groß.** 169 px Pille auf 320 px-Screen ist
  > 50 % der Breite. Mitigation: Klärungs-Entscheidung Bau-Sitzung
  17 ob 36 px Slots OK sind oder ob die ganze Pille mobile auf 80 %
  schrumpft. Spec-Sitzung lässt das offen.
- **Slot-Anti-Greenwashing-Verwechslung.** Klaus sieht einen grauen
  FREMD-Slot und denkt, der ist „kaputt", obwohl Modul 15 einfach
  noch keinen Fremdzugriff registriert hat. Mitigation: Tap auf den
  grauen FREMD-Slot öffnet das Modul-15-Modal trotzdem — die
  Tabelle ist leer, die Klärung kommt aus dem Modal-Text. UX-
  Disziplin: das Widget gibt **immer** Klick-Antwort, auch wenn
  der Slot grau ist.
- **Event-Spamming.** Bösartiger Code im selben Tab dispatcht
  `sbkim:fremd-alert` 1000-mal/Sekunde, Widget-Render bricht ein.
  Mitigation: Modul 17 macht intern Render-Drossel über
  `requestAnimationFrame` (höchstens ein Re-Render pro Frame, FIFO
  10 für den VERKEHR-Log begrenzt das Wachstum). Bau-Sitzung 17
  entscheidet die genauen Frequenz-Grenzen.

---

## Verbindung zu anderen Karten

- **[Modul 02 Spore](02_spore.md):** dispatcht `sbkim:alive` einmalig
  nach `init()` + `getOrCreateIdentity()`. Hook-Pflege in Bau-Sitzung 17
  oder eigener Folge-Pflege. Karte 02 § Bauzustand bekommt einen
  Verweis-Block.
- **[Modul 05 Anastomose](05_anastomose.md):** dispatcht `sbkim:handshake`
  pro abgeschlossenem Handshake (Sender + Empfänger beide). Hook-
  Pflege wie 02. Karte 05 § Bauzustand bekommt einen Verweis-Block.
- **[Modul 15 Membran](15_membran.md):** dispatcht `sbkim:postmessage`
  pro eingehender `message` mit `type:"sbkim/membrane/v1"` (Sub (b))
  + `sbkim:fremd-alert` pro Ringbuffer-Eintrag (Sub (e), Spiegelung
  des `subscribe(cb)`-Hooks). Karte 15 § Sub (e) bekommt einen
  Verweis-Block.
- **[Modul 16 SBKIM-Siegel](16_siegel.md):** dispatcht `sbkim:siegel-certified`
  einmalig nach `init()` wenn `isCertified() === true`. Karte 16
  § Sub (b) bekommt einen Verweis-Block.
- **[Modul 09 Einbau-PWA](09_einbau_pwa.md):** Schritt 10 + 11
  schrumpfen in einer Folge-Pflege auf je drei Zeilen + neuer
  Schritt 12 für Widget-Einbau (NICHT in dieser Spec-Sitzung).
- **[Modul 00 Doku-Fenster](00_doku_fenster.md):** optionale
  Wiederherstellungs-Geste (Pfad (b)) — wenn Modul 00 die 5-Klick-
  Geste am Such-Symbol hält, kann Modul 17 sich als Sekundär-
  Listener anhängen. Eigene Folge-Pflege Modul 00 + Modul 17.

---

## Manueller Test (Vorbereitung für Bau-Sitzung 17)

*(Diese Spec-Sitzung definiert die Test-Punkte; konkrete
Knöpfe + Output-Form gehören in Panel 17 von
`tests/manual_check.html` aus der Bau-Sitzung 17.)*

**Erwartete Test-Punkte:**

1. **Setup**: `SbkimWidget.init({})` aufrufen — Pille in `<body>`
   gemountet, vier Slots sichtbar (LEBT grau, VERKEHR dunkel,
   FREMD grau, SIEGEL nicht im DOM weil ohne Modul 16 nicht zertifiziert).
   Selbstcheck-Zeile in Konsole.
2. **LEBT-Slot wird grün**: `window.dispatchEvent(new CustomEvent("sbkim:alive",
   { detail: { since: new Date().toISOString(), nodeId: "test_node_id_12345" }}))`
   → LEBT-Slot pulsiert grün, Atmungs-Animation startet.
3. **VERKEHR-Slot pulst**: drei Custom-Events feuern (`sbkim:handshake`,
   `sbkim:postmessage`, `sbkim:handshake`) → VERKEHR-Slot pulst gold-
   farben drei Mal, Mini-Log enthält drei Einträge.
4. **FREMD-Slot wird rot**: `sbkim:fremd-alert` mit `bufferSize: 1` →
   FREMD-Slot wird dauer-rot + pulst kurz. Zweiter Event mit `bufferSize: 2`
   → erneut Puls, bleibt rot.
5. **SIEGEL-Slot erscheint**: erst `SbkimSiegel.init()` simulieren
   (`window.SbkimSiegel = { isCertified: () => true, ... }`) +
   `sbkim:siegel-certified`-Event → SIEGEL-Slot wird ins DOM angefügt
   mit 600-ms-First-Boot-Animation.
6. **SIEGEL-Slot erscheint NICHT bei isCertified false**: `window.SbkimSiegel
   = { isCertified: () => false, ... }` + `sbkim:siegel-certified`-Event
   wird gar nicht gefeuert (Anti-Greenwashing) → kein DOM-Element.
7. **Drag funktioniert**: Drag-Pille von bottom-right nach top-left
   (Pointer-Events simuliert). Nach `pointerup`: `getPosition()`
   liefert neue Koordinaten, `localStorage.getItem("sbkim_widget_position")`
   hat den neuen Wert.
8. **X-Schließen + Reload-Wiederherstellung**: Klick auf X-Knopf →
   `display: none`, `localStorage.getItem("sbkim_widget_visible") === "false"`.
   Tab-Reload → Widget bleibt versteckt (Default `rememberHidden: true`).
9. **Wiederherstellung via `show()`**: `SbkimWidget.show()` →
   Widget sichtbar, `localStorage.getItem("sbkim_widget_visible") === "true"`.
10. **Slot-Whitelist**: `init({slots: ["lebt","siegel"]})` → nur zwei
    Slots im DOM, die anderen beiden fehlen ganz.

---

## Selbstcheck (Pflicht, Modul-Konvention)

```js
console.info("MODUL 17 FLOATING-WIDGET bereit, Funktionen: init/show/hide/isVisible/getPosition");
```

Beim Skript-Laden (synchron, vor jeglichem Aufruf). Format wie alle
anderen Module (00/01/02/04/05/06/07/08/15/16).

---

## Folge-Pflege-Liste (Nach dieser Spec-Sitzung)

1. **Bau-Sitzung 17** — `src/modules/17_floating_widget.js` mit
   Standalone-CSS, Drag-Mechanik, X-Schließen, localStorage-
   Persistierung, Modal-Bridge zu Modul 15 + 16, vier Custom-Event-
   Listener. Brief: `docs/sessions/BRIEF_BAU_17_FLOATING_WIDGET.md`.
2. **Pflege Modul 02 + 05 + 15 (Event-Hooks)** — entweder als Teil
   der Bau-Sitzung 17 mit-erledigt, oder drei separate Mini-Pflege-
   Sitzungen, die `window.dispatchEvent(new CustomEvent("sbkim:alive", ...))`
   bzw. `:handshake` / `:postmessage` / `:fremd-alert` in den
   jeweiligen Modulen einbauen.
3. **Pflege Modul 16 (Event-Hook)** — `sbkim:siegel-certified` nach
   `init()` mit `isCertified() === true` dispatchen. Klein, kann als
   Teil der Bau-Sitzung 17 mit-erledigt werden.
4. **Sichttest 17** — Panel 17 in `tests/manual_check.html` mit
   zehn Test-Punkten (siehe § Manueller Test oben). Klaus am Tablet.
5. **Endknoten-Re-Migration** — neuer kleinerer Brief
   `BRIEF_BAU_ENDKNOTEN_MIGRATION_WIDGET.md` (oder additive Erweiterung
   von `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md`). Vorhandene
   Lampen + Siegel-Badge in der Navleiste werden ausgebaut, drei
   Zeilen Widget-Einbau kommen rein.
6. **Pflege Karte 09 § Schritt 10 + 11** — schrumpfen auf je drei
   Zeilen + neuer Schritt 12 für Widget-Einbau. Eigene Folge-Pflege
   nach Bau 17.
7. **Pflege Modul 00 (5-Klick-Geste-Hook)** — wenn Modul 17 sich an
   die Such-Symbol-Geste hängen soll, braucht Modul 00 entweder ein
   Custom-Event (`sbkim:doku-open`) oder eine Subscribe-API
   (`SbkimDoku.subscribeOpenGesture(cb)`). Eigene Folge-Pflege.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt + Pipeline-Eintrag | 2026-05-25 | Brief-Anlage Spec-Sitzung 17 (PR #163) | Klaus' UI-Befund nach erster Endknoten-Migration: Lampen + Siegel-Badge nehmen zu viel Platz in der Navleiste, kein User-X-Schließen, kein Drag, nicht einheitlich zwischen Endknoten. Klaus' Architektur-Forderung: floating Mini-Panel im Eruda-Stil, self-mountend in `<body>`, drag-fähig, mit X-Schließen + localStorage-Persistierung. Tafel-Evolutions-Klausel (CLAUDE.md § Heilige Tafeln) — die alte Tafel „Navleisten-Mount" war scope-bezogen auf Sage-Page; Endknoten brauchen einen einheitlichen Pfad. **Pipeline-Reihenfolge erweitert** um 5b (Spec-Sitzung 17), 5c (Bau-Sitzung 17), 5d (Endknoten-Re-Migration mit Widget) zwischen Schritt 5 und Schritt 6 (App-Freigabe). Brief: `docs/sessions/BRIEF_SPEC_15_16_FLOATING_WIDGET.md`. |
| Spec gefüllt | 2026-05-25 | Spec-Sitzung 17 | Karte 17 vollständig gefüllt — **Vier-Slot-Live-Status-Dashboard** als finale Form (Klaus-Zusatz-Wunsch 2026-05-25 ersetzt den ursprünglichen 2-Plaketten-Vorschlag aus Brief-Punkt 3 via Tafel-Evolutions-Klausel; vier Slots LEBT/VERKEHR/FREMD/SIEGEL machen den SBKIM-Lauf sichtbar, jeder Slot mit eigenem Anti-Greenwashing-Pfad). **Event-Bus-Schema** (vier Custom-Events) als verbindlicher Kontrakt: `sbkim:alive` (Modul 02) · `sbkim:handshake` (Modul 05) · `sbkim:postmessage` (Modul 15 Sub b) · `sbkim:fremd-alert` (Modul 15 Sub e) · `sbkim:siegel-certified` (Modul 16). Modul 17 lauscht passiv auf `window`, kennt keine Modul-Referenz. Detail-Form PII-frei (nur Counts, Status-Flags). **Layout:** ~200 px × 48 px Pille, vier 40 px-Slots horizontal, X-Knopf oben-rechts, Drag-Griff = gesamte Pille außerhalb Slots, Default-Position bottom-right + 16 px Abstand. **Default-Sichtbarkeit:** alle vier Slots immer im DOM (Ausnahme SIEGEL bei `isCertified() === false`, dann nicht im DOM, binär). Drag-Mechanik via Pointer-Events, 5 px Threshold, freies Drag mit Pixel-Präzision empfohlen (kein Snap in Stufe 1). X-Schließen + vier Wiederherstellungs-Pfade (DevTools-`show()` / 5-Klick-Geste am SBKIM-Such-Symbol / Doku-Fenster-Knopf / Tab-Reload bei `rememberHidden:false`). **Persistenz:** `localStorage` für Visible + Position (analog Modul 15/16 RAM-only-Pattern, aber UX-Preferences brauchen Reload-Persistenz); VERKEHR-Mini-Log RAM-only (FIFO 10). **Tap-Verhalten:** LEBT → neues Status-Modal von Modul 17; VERKEHR → neues Mini-Log-Modal von Modul 17; FREMD → bestehendes Modul-15-Sub-(e)-Modal (Modal-Bridge via Proxy-Click); SIEGEL → bestehendes Modul-16-Sub-(c)-Modal. **Modul-15-+-16-Backends unverändert** (Klaus-Festlegung). Sage-Page-Pfad: Navleisten-Lampen + Siegel-Badge bleiben Sage-Page-spezifisch (Klaus-Festlegung 2026-05-25); Endknoten-Standard ist das Widget. Schnittstelle `window.SbkimWidget = {init/show/hide/isVisible/getPosition/_meta}`. options-Form mit `slots`-Whitelist, `defaultCorner`/`defaultOffset`, `allowClose`/`allowDrag`/`rememberHidden`/`zIndex`/`theme`. **KEINE benannten Error-Klassen** (Render-Schicht, fail-soft via `console.warn`). INTERFACES.md § 1 Modul 17 voll spezifiziert + Event-Schema in INTERFACES § 1 Modul 02 + Modul 05 + Modul 15 als Verweis nachgezogen + § 10 Änderungsprotokoll-Eintrag. Karten 02 + 05 + 15 § Sub (e) + 16 § Sub (b) bekommen je einen ein-Satz-Verweis-Block ans Ende. `status.json § modules[]` um Modul 17 erweitert (`score:"spec"`, `siegel:"Spec fertig"`); `python3 scripts/update_puls_pie.py` aufgerufen. CLAUDE.md § Modul-Tabelle Eintrag 17 auf „Spec fertig" aktualisiert. **KEIN Modul-Code in `src/modules/17_floating_widget.js`** (Spec-Sitzung, kein Bau). **KEINE Endknoten-Sitzung.** **KEIN Eingriff in `src/modules/15_membran.js` / `src/modules/16_siegel.js` / `src/modules/02_spore.js` / `src/modules/05_anastomose.js`** (Code-Hooks sind Bau-Sitzung 17 oder eigene Folge-Pflege). **KEINE Sage-Page-Änderung.** **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump** (Modul 17 ist nicht protokoll-aktiv). Brief Bau-Sitzung 17: `docs/sessions/BRIEF_BAU_17_FLOATING_WIDGET.md`. |
| Code geschrieben | — | Bau-Sitzung 17 | folgt — `src/modules/17_floating_widget.js` + Standalone-CSS + Panel 17 in `tests/manual_check.html` + Event-Hooks in Modul 02/05/15/16. |
| Sichttest | — | Sichttest 17 | folgt — Klaus, Panel 17 in `tests/manual_check.html` + Endknoten-Re-Migration. |
| In Endknoten eingebaut | — | Endknoten-Re-Migration (Folge-Sitzung pro Endknoten-Repo) | folgt — drei Zeilen Einbau-Anweisung pro Endknoten statt 30 (Modul-Datei-Kopie + `<script>`-Tag + `SbkimWidget.init({allowedOrigins, repoUrl})`). |

---

**Querverweise**

- **Abhängigkeiten:** keine. Modul 17 hat keine Pflicht-Modul-Achse —
  es lauscht passiv auf vier Custom-Events. Wenn ein Anbieter-Modul
  fehlt, bleibt der jeweilige Slot grau (bzw. SIEGEL nicht im DOM).
- **Wird genutzt von:** Klaus + Endnutzer als Live-Status-Dashboard
  in Endknoten-PWAs · Forker (drei-Zeilen-Einbau statt 30) ·
  künftige Endknoten-PWAs als Standard-Andock-Optik.
- **Hook-Punkte (nur Verweis, Bau-Sitzung 17 implementiert):** Modul
  02 dispatcht `sbkim:alive` · Modul 05 dispatcht `sbkim:handshake` ·
  Modul 15 Sub (b) dispatcht `sbkim:postmessage` · Modul 15 Sub (e)
  dispatcht `sbkim:fremd-alert` · Modul 16 dispatcht
  `sbkim:siegel-certified` · Modul 00 (optional) liefert eine
  5-Klick-Geste-Hook für Wiederherstellung.
- **Site-Karte:** Sage-Page Karten 4 / 13 / 14 könnten in einer
  Folge-Pflege einen `widgetBacklog[]`-Eintrag parallel zu den
  bestehenden Backlog-Karten bekommen (kein Block für die App-
  Freigabe, optional).
- **Paper:** `sbkim_paper.pdf` Kap. 6 (Geflecht-Außenkontakt — das
  Widget ist Selbst-Spiegel, kein Außenkontakt; gehört zur Render-
  Schicht, nicht zum Protokoll).
- **Verwandt:** [Modul 15](15_membran.md) (Fremd-Slot Quelle +
  Verkehr-Slot Sub-(b)-Quelle) · [Modul 16](16_siegel.md) (Siegel-Slot
  Quelle) · [Modul 02](02_spore.md) (Lebt-Slot Quelle) ·
  [Modul 05](05_anastomose.md) (Verkehr-Slot Sub-Quelle) ·
  [Modul 00](00_doku_fenster.md) (optionale Wiederherstellungs-Geste) ·
  [Modul 09](09_einbau_pwa.md) (Endknoten-Einbau in Folge-Pflege drei
  Zeilen statt 30)
