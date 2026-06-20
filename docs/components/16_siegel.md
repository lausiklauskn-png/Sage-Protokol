# Modul 16 — SBKIM-Siegel

> **Status:** 🟦 Code-Stub (2026-05-24, Bau-Sitzung 16) · Siegel-Backlog · **Priorität hoch** (vor App-Freigabe)  ·  **Schicht:** Selbst-Bezeugung der PWA-Zelle nach erfolgter Integration der SBKIM-Pflicht-Module  ·  **Anker:** Header-Badge in der Navleiste (vierte Plakette nach `#lamp-alive` / `#lamp-traffic` / `#lamp-fremd`), Click öffnet eigenständiges Erklärungs-Modal in `document.body`
> **Datei (Code):** `src/modules/16_siegel.js` (Bau-Sitzung 16 vom 2026-05-24)
>
> **Pflege 2026-06-07 (Code geschrieben — Bau Andock-Semantik-Beschreibung):**
> Der Modul-18-Pfad ist aus dem Bronze-Hinweis-Block entfernt
> (`BRONZE_HINWEIS_HTML_FALLBACK` + `[data-siegel-andock-btn]` +
> `SbkimToolPwa`/„Modul 18 …"-Fehlertexte raus). Der Bronze-Block ist jetzt
> reiner Hinweis-Text und verweist auf den „🔑 Eigene Identität & Spore
> erzeugen / verwalten →"-Knopf, den der Host (Sage-Page / Endknoten) oben
> ins Modal einhängt — ein einziger, sauberer Identitäts-/Andock-Pfad.
> Neuer `ZERTIFIKAT_ASPEKTE`-Eintrag „Semantische Selbst-Beschreibung im
> Siegel" (2026-06-07, module 16). Die eigentliche Textfeld-/Embedding-/
> Re-Sign-Wiring (Text → `domainDescription` → Modul 03 → `domainVector` →
> Modul 02 `generateOwnSpore`) liegt host-seitig in `index.html`
> (`SBKIM_SEMANTIK_CONFIG` + `buildSemantikBlock` / `sageReSignWith­Description`),
> damit Modul 16 reines Render-Modul bleibt (nicht protokoll-aktiv).
> Smoke `tests/smoke_bau16_sub_e_bronze.mjs` 16/16 grün. **Sichttest des
> Textfeldes ungeprüft — wartet auf Klaus' Galaxy-Tab-S6-Browser.**

---

## Im Mycel-Bild

Ein Pilz, der gewachsen ist, zeigt seinen Fruchtkörper. Das Mycel
darunter ist die eigentliche Arbeit — verborgen, weit verzweigt,
funktional. Der Fruchtkörper ist die **Sichtbarmachung**: er sagt,
„hier hat ein Pilz gelernt, sich selbst zu erkennen". Das SBKIM-Siegel
ist diese Sichtbarmachung für eine PWA-Zelle: nach erfolgter
Integration der Pflicht-Module **bezeugt sie sich selbst** und zeigt
das nach außen.

## Vokabular

- **SBKIM-Siegel** — Selbst-Zertifikat einer PWA-Zelle, das sie sich
  beim Boot ausstellt, wenn die Pflicht-Module-Surface vorhanden ist.
  Kein zentraler Aussteller, kein CI-Build-Check.
- **Self-Inscribing** — Selbst-Bezeugung. Die App prüft beim Boot, ob
  die Pflicht-Module geladen sind, und stellt sich das Siegel selbst
  aus. Vertrauen kommt vom Repo, in dem sie gehostet ist, nicht von
  einer Zertifizierungs-Autorität.
- **Lebendes Dokument** — die Erklärung hinter dem Siegel wächst
  organisch: jedes Sicherheits-Update ergänzt einen Aspekt mit
  Datum. Das Siegel altert nicht, es wächst.
- **Anti-Greenwashing-Klausel** — kein Siegel ohne erfüllte
  Selbst-Prüfung. Wenn ein Pflicht-Modul fehlt oder fehlerhaft lädt,
  KEIN Badge-Render. Disziplin, keine Marketing-Plakette.
- **Surface-Check** — Pflicht-Modul-Prüfung über die globalen
  Namensräume (`window.SbkimStorage`, …) und über eine pro Modul
  definierte „zentrale Funktion" (z.B. `getOwnSpore` für Modul 02).
  Snapshot zur `init()`-Zeit, gecacht.
- **`ZERTIFIKAT_ASPEKTE`** — modul-interne, code-versionierte Liste
  von `Aspect`-Objekten. Die Liste wächst pro Pflege-PR jedes
  spätergebaut werden Sicherheits-Moduls.

## Warum jetzt (Hochstufungs-Begründung)

Klaus plant die öffentliche Freigabe seiner PWAs (Mein-Mixarium,
Mein-Rezeptbuch, Sage-Protokol). Forker und Nutzer brauchen ein
sichtbares Vertrauens-Signal: „diese App ist nicht nur funktional,
sondern SBKIM-fähig." In einem dezentralen Netz ohne Zertifizierungs-
Autorität ist self-inscribing der einzige Pfad, der nicht zentralisiert
und nicht skalierungs-blockiert ist.

Der Trade-off mit dem Schutz-Backlog (Modul 10 / 11 / 12) ist bewusst:
das Siegel bestätigt zur Freigabe-Zeit den Grundbaukasten (01–05 + 07
+ 15), nicht den Voll-Schutz. Die Erklärung wächst danach organisch —
sobald Modul 11 oder 12 dazukommt, ergänzt ein neuer
`ZERTIFIKAT_ASPEKTE`-Eintrag den Text. Forker müssen nicht re-andocken:
pro PWA-Lauf aktualisiert sich das Siegel selbst.

---

## Vier Sub-Bereiche (final spezifiziert)

### Sub (a) — Selbst-Prüfung (Pflicht-Modul-Liste)

#### Finale Pflicht-Modul-Liste

Für das **Grund-Siegel** gelten genau **sieben** Module als Pflicht:

| Modul | Global | Pflicht-Funktion (Surface-Anker) | Lazy? | Begründung |
|---|---|---|---|---|
| **01** Storage     | `SbkimStorage`     | `init`               | nein | Foundation — alle anderen Module bauen darauf. |
| **02** Spore       | `SbkimSpore`       | `getOwnSpore`        | nein | Identitäts-Anker — ohne Spore kein SBKIM-Knoten. |
| **03** Embedding   | `SbkimEmbedding`   | `embedPassage`       | **ja** | Vektor-Schicht. Sage-Page lädt 03 lazy (asset-schwer, ~30 MB Modell). Surface-Check toleriert „deferred". |
| **04** Match       | `SbkimMatch`       | `match`              | nein | Schwellen-Vergleich, Anastomose-Voraussetzung. |
| **05** Anastomose  | `SbkimAnastomose`  | `handshake`          | nein | Netz-Teilnahme — ohne Handshake kein Geschwister-Pfad. |
| **07** Apoptose    | `SbkimApoptose`    | `prepareSelfApoptose` | nein | Lebenszyklus — ohne Apoptose keine Selbstlöschung, Mycel-Grundsatz verletzt. |
| **15** Membran     | `SbkimMembrane`    | `init`               | nein | Außen-Schicht — Fremdzugriff-Sichtbarmachung Pflicht, weil seit Gemini 3.5 Flash relevant. |

**Nicht Pflicht für Grund-Siegel** (kann später als Aspekt-Eintrag
ergänzt werden, blockiert aber **nicht** das Siegel-Render):

- **Modul 00** (Doku-Fenster) — UI-Feature, nicht protokoll-aktiv. Sage-
  Page hat aktuell kein sichtbares Such-Symbol, Sage-spezifischer
  Eingang ist der Andock-Wizard. **Bestätigt nicht Pflicht.**
- **Modul 04.B** (`explainMatchLLM`) — API-Key-abhängig, individuelle
  Entscheidung pro PWA. Surface-Check erfolgt ausschließlich auf
  Modul 04 (`match`); 04.B wäre eine zusätzliche Funktion auf
  `SbkimMatch`, deren Existenz NICHT vom Surface-Check verlangt wird.
  **Bestätigt nicht Pflicht.**
- **Modul 06** (Heterokaryose) — Opt-In, nicht jeder Knoten will
  Anker-Tausch. Karte 06 ist beidseits Opt-In via Co-Schreiber-Flag,
  kein Pflicht-Verkehr. **Bestätigt nicht Pflicht.**
- **Modul 08** (UI-Demo) — Endknoten-Pflege-UI, Sage-Page hat ihn nicht
  als sichtbare UI, sondern als ladbares Modul (sbkim-init.js Z. 110).
  Pflicht-Check würde Sage-Page hart abhängig vom UI-Modul machen,
  obwohl Sage-Page kein Endknoten-PWA-UI hat. **Bestätigt nicht Pflicht.**
- **Modul 09** (Einbau-PWA) — Anleitung, kein JS-Modul.
- **Modul 10 / 11 / 12** (Schutz-Backlog) — werden mit Aspekten ergänzt,
  sobald sie kommen. Pflicht-Check bei Bau-Zeitpunkt würde 16
  zwingen, vor 11/12 niemals grün zu werden.
- **Modul 14** (Diffusion) — Backlog, ähnlich 10/11/12.

#### Surface-Check-Form

Pro Modul-Eintrag in `PFLICHT_MODULE` prüft das Modul beim **`init()`-
Snapshot**:

```js
function checkModuleSurface(entry) {
  const ns = globalThis[entry.globalName];
  if (ns === undefined) {
    return entry.lazy ? "deferred" : "missing";
  }
  if (ns === null || typeof ns !== "object") {
    return "broken";
  }
  if (typeof ns[entry.surfaceFn] !== "function") {
    return "broken";
  }
  return "ok";
}
```

Status-Werte (Schema verbindlich):

- `"ok"` — globaler Namespace existiert + Surface-Funktion ist `function`.
- `"deferred"` — globaler Namespace existiert NICHT, aber Modul ist
  als `lazy:true` markiert. Gilt für die Bezeugung als **akzeptabel**
  (kein Block).
- `"missing"` — globaler Namespace existiert nicht und Modul ist
  NICHT `lazy:true`. **Blockt das Siegel.**
- `"broken"` — Namespace existiert, aber Surface-Funktion fehlt oder
  ist kein `function`. **Blockt das Siegel.**

#### Surface-Check-Zeitpunkt

**Einmalig beim `init()` (Snapshot), dann gecacht.** Analog Modul 15
Sub (e) `subscribeBroadcastChannel`-Pattern: ein Check beim Init,
Ergebnis lebt in Closure-State, `isCertified()` / `getExplanation()`
liefern den gecachten Snapshot.

Begründung: Pflicht-Module werden vor 16 in der `sbkim-init.js`-
Kette geladen (`SbkimSiegel.init()` kommt **nach** allen anderen
Pflicht-Modulen). Ein nachträgliches Verschwinden eines Pflicht-
Moduls wäre ein nicht-spezifizierter Ausnahmefall — diese Spec
nimmt das nicht ab.

**Re-Run** ist möglich: `SbkimSiegel.init()` zweimal aufrufen wirft
nicht, aber **überschreibt den Snapshot nicht** beim zweiten Aufruf
(idempotent, gibt das gecachte Resultat zurück). Wer einen Re-Check
will, lädt die Page neu. Konvention analog Modul 15.

#### Fail-Modus (binär)

Bei **mindestens einem** Modul mit Status `"missing"` oder `"broken"`:

- **KEIN Badge-Render.** Nicht ausgegraut, nicht „in Arbeit". Spec
  ist binär.
- **Genau EINE `console.warn`-Zeile** mit ID-Liste der fehlenden /
  kaputten Module:
  ```
  SBKIM-Siegel kein Render: Pflicht-Module fehlen/defekt — 04 (missing), 07 (broken). Siehe Karte 16 § Sub (a).
  ```
- **`isCertified()` liefert `false`** (sync), `getExplanation()`
  liefert dennoch den Snapshot (für Debug-Zwecke; Modal-Render-
  Code prüft `isCertified()` und rendert nicht ohne grün).

Module mit Status `"deferred"` (z.B. Modul 03 in der Sage-Page) zählen
für die Bezeugung als **OK**. `isCertified()` liefert `true`.

### Sub (b) — Badge-Rendering (Auszeichnungs-Optik)

#### Konfigurierbarer Band-Text (`ribbonText`, Design-Fix 2026-06-19)

Das untere Wappen-Band (SVG-`textPath`) ist das **SELF-INSCRIBING**-Element
des Siegels und über `init({ ribbonText: "…" })` setzbar. Der Host graviert
seinen Knoten-Namen ein (z.B. `"MEIN-REZEPTBUCH"`); das Modul setzt den Text
**zur Render-Zeit** (`renderWappenSvg()`, XML-escaped) — **kein SVG-Edit nötig.**

**Ohne `ribbonText` bleibt das Band OFFEN (leer)** — kein Auto-Label
(Klaus-Entscheidung 2026-06-20). Begründung: eine **Auto-Ableitung** aus dem
Repo-/Pages-Namen würde einen Slug wie `SAGE-PROTOKOL` ins Band schreiben, was
auf einer Auszeichnung schnell falsch/unsauber wirkt. Stattdessen ein
**Vermerk**: das Modul gibt beim `init()` ohne `ribbonText` eine einmalige
`console.info`-Zeile aus („Band offen gelassen — `init({ribbonText})` setzen").
So entsteht **nie ein mitkopiertes Fremd-Label**, und der Name wird bewusst
eingraviert. Sage selbst setzt explizit `"SAGE OBSERVATORIUM"`
(`sbkim-init.js`). `_meta.ribbonText` liefert den effektiven Wert (`""` wenn offen).

**Befund-Anlass (2026-06-19):** Mein-Rezeptbuch und Mein-Mixarium trugen
sichtbar `MEIN-TRESOR` im Band, weil sie die statische Datei
`assets/sbkim-siegel-wappen.svg` von Mein-Tresor kopiert + nie angepasst
hatten (das Siegel passt sich NICHT von selbst an — der Band-Text steht
statisch im SVG). Der `ribbonText`-Parameter verhindert die Wiederholung,
sofern das Siegel **über das Modul** gerendert wird (nicht als statisches
`<img src=…svg>`). Für die `<img>`-Variante bleibt die SVG-Datei
hand-zu-pflegen — die saubere Lösung ist Modul-Render statt statischer Datei.

#### Optionaler Andock-Knopf (`andockTool`, 2026-06-19)

`init({ andockTool: true })` (Default `false`) hängt einen **zusätzlichen**
Knopf „🔌 Fremden Knoten andocken →" ins Modal. Er öffnet den **KI-unabhängigen**
Modul-18-Wizard `SbkimToolPwa.openAndockTab()` (Repo-/App-URL eingeben → Spore
holen → `verifyForeignSpore` → Match → Handshake via Modul 05) — reiner
Browser-Pfad (WebCrypto + fetch), **keine Claude-Sitzung nötig**.

- **Zwei Richtungen, kein Gegeneinander** (Klaus 2026-06-19): der bestehende
  „🔑"-Knopf bleibt unberührt — er ist die **Selbst**-Seite (eigene Identität,
  Spore, Vektor, signieren). Der Andock-Knopf ist die **Gegenstellen**-Seite
  (fremde URL → Handshake). Die eine erzeugt, die andere verbindet.
- **Opt-in + fail-soft:** Nur bei `andockTool:true` entsteht das DOM-Element
  `[data-siegel-andock-tool]`. Fehlt Modul 18 zur Klick-Zeit, zeigt der Knopf
  einen Hinweis statt zu werfen. Default-Render (ohne Flag) ist unverändert —
  die Sub-(e)-Tafel-Tests („kein Andock-Knopf") bleiben gültig.
- **Stabile Identität** bleibt das Leitbild (Klaus 2026-06-19): eine App = eine
  nodeId. Multi-Identität ist gebaut (Modul 02), aber für Endknoten bewusst
  nicht im Siegel sichtbar — reserviert für die spätere Agenten-Schicht.

Smoke: `tests/smoke_bau16_andock.mjs` (9/9), `tests/smoke_bau16_ribbon.mjs` (9/9),
Regression Sub-(e) 16/16.

### Sub (b) — Badge-Rendering (Auszeichnungs-Optik)

#### DOM-Anker und Position

- **DOM-Anker:** `#sbkim-siegel-badge` (CSS-Selektor, konfigurierbar
  per `init({badgeSelector})`).
- **Default-Position:** **vierte Plakette** in der Navleiste, direkt
  nach `<span class="lamp" id="lamp-fremd">` + `<span class="lamp-
  label">fremd</span>`. KEIN eigener Header-Bereich neben dem Branch-
  Text — die Lampen-Reihe ist die etablierte Schicht für „Knoten-
  Lebenszeichen", das Siegel gehört dort als die wertigste Marke
  rechts ans Ende.
- **Bau-Sitzung 16 fügt das DOM-Element in `index.html` ein** (analog
  Bau 15 § index.html-Eingriff), Default-Selektor `#sbkim-siegel-
  badge`. Endknoten-PWAs ergänzen einen passenden Anker im jeweiligen
  Header (Folge-Pflege Karte 09 § Schritt 10).

#### Form und Größe

- **Form:** rundes Medaillon (`border-radius: 50%`). Kein Oval, kein
  Rechteck, keine Plakette. Mit den drei Lampen davor entsteht eine
  visuelle Reihe „drei kleine Lichter + eine größere Münze".
- **Größe:** **40 px Durchmesser** (Mittel des Brief-Vorschlags 32–
  48 px). Klickbar (Mindest-Touch-Target 40 px erfüllt).
- **Hover-Cursor:** `pointer`. Hover-Tooltip via `title`-Attribut
  („SBKIM-Siegel — klick für Details").

#### Farb-Palette

**Default Edel-Gold** auf dunklem Grund. Keine Stufen-Varianten
(kein Bronze / Silber / Gold-Hierarchie) — Klaus' verbindliche
Festlegung 2026-05-24: das Siegel wächst über die Aspekte-Liste, NICHT
über sichtbare Stufen.

Konkrete Werte (Bau-Sitzung 16 verfeinert, Spec verankert die
Klassen):

```css
:root {
  --siegel-gold:        #C9A961;   /* Edel-Gold, gedämpft */
  --siegel-gold-glow:   rgba(201,169,97,0.55);
  --siegel-ink:         #1A1306;   /* sehr dunkler Bronze-Untergrund */
  --siegel-line:        rgba(201,169,97,0.45);
}

#sbkim-siegel-badge {
  width: 40px; height: 40px; border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, #E6CE94 0%, #C9A961 38%, #8C6E2F 100%);
  border: 1px solid var(--siegel-line);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.2), inset 0 0 6px rgba(255,255,255,0.15);
  cursor: pointer;
}

#sbkim-siegel-badge:hover {
  box-shadow: 0 0 12px var(--siegel-gold-glow), inset 0 0 6px rgba(255,255,255,0.20);
}

#sbkim-siegel-badge.first-boot {
  animation: siegel-first-boot 600ms ease-out;
}
@keyframes siegel-first-boot {
  0%   { transform: scale(0.7); opacity: 0; }
  60%  { transform: scale(1.12); opacity: 1; box-shadow: 0 0 18px var(--siegel-gold-glow); }
  100% { transform: scale(1.00); opacity: 1; }
}
```

`:root`-Variablen sind in `index.html` zu ergänzen — drei neue (Gold,
Glow, Ink); `--siegel-line` wird aus Glow abgeleitet. **Keine
Erweiterung** der `:root`-Variablen für Lampen-Farben.

#### Schrift

- **Pflicht-Konvention für Spec:** Serif-Stack mit System-Fallback —
  `font-family: 'Spectral', 'Georgia', 'Times New Roman', serif;`.
  Spec verlangt KEIN zwingendes Google-Font-Loading; Bau-Sitzung 16
  entscheidet, ob `Spectral` über `<link href="...">` nachgeladen
  wird oder System-Serif (Georgia) ausreicht. Default-Empfehlung:
  System-Serif (kein Font-Load-Lag, keine Layout-Shift, sofort
  verfügbar). Spectral kann später nachgereicht werden, wenn Klaus
  ein einheitliches Markenbild über alle Endknoten will.
- **Verboten:** Geist (Standard-Sans), Geist Mono (Lampen-Labels).
  Das Siegel muss optisch aus der Mono-/Sans-Welt rauskippen.

#### Wappen-Element (zentraler Glyph)

**Verbale Anker-Beschreibung (Spec):**

> Drei verschlungene Hyphen-Bögen, im Zentrum ein kleiner Knoten-
> Punkt. Die Bögen treffen sich nicht in einer geometrischen Mitte,
> sondern leicht versetzt — wie drei Hyphen, die durcheinander
> wachsen, aber dasselbe Ziel haben. Glyph-Farbe: dunkler als das
> Goldgrund (Bronze-Ink `#1A1306`-Klasse), nicht-glänzend, damit der
> Glyph als „Prägung im Metall" lesbar ist und nicht als „Sticker".

**SVG-Skelett (Spec-Anker, finale Pfade in Bau-Sitzung 16):**

```svg
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Drei verschlungene Hyphen-Bögen, Spec-Skelett.
       Bau-Sitzung 16 bestimmt die finalen Pfade — diese Kurven sind
       Anker-Form, nicht endgültig. -->
  <g fill="none" stroke="#1A1306" stroke-width="1.4" stroke-linecap="round">
    <path d="M10 14 Q 20 8, 30 14" />
    <path d="M14 26 Q 20 32, 26 26" />
    <path d="M12 20 Q 24 14, 28 22" />
  </g>
  <circle cx="20" cy="20" r="1.6" fill="#1A1306" />
</svg>
```

`viewBox="0 0 40 40"` gibt der Bau-Sitzung freie Skalierungs-Hand —
das SVG ist vektorbasiert und print-tauglich (Klaus' Wunsch: später
auf Visitenkarte / Über-Seite druckbar).

#### Hover / Aktiv-Zustand

- **Hover:** dezenter Glow (Box-Shadow im Gold-Ton, siehe CSS oben).
  KEIN Pulsieren bei Dauer-Hover. Klassisch-zurückhaltend wie ein
  Wachs-Siegel im Streiflicht.
- **Aktiv-Zustand:** identisch zum Default. Das Badge ist nicht
  „aktiv vs. inaktiv" — es ist entweder gerendert (zertifiziert)
  oder gar nicht da (Anti-Greenwashing).

#### First-Boot-Animation

**Bestätigt** (Brief-Vorschlag): einmaliger Aufleuch-Puls + leichte
Skalierung (`scale 0.7 → 1.12 → 1.0`) über **600 ms** beim ersten
erfolgreichen `isCertified() === true`-Lauf pro Session. Klasse
`.first-boot` wird per JS gesetzt und nach 600 ms wieder entfernt.

**Disziplin:** **keine Dauer-Animation**. Klaus' Festlegung: „Auszeichnung
überschreit nicht das, was sie selbst ist." Wer beim Reload das Badge
sieht, bekommt nur die First-Boot-Animation — bei Re-Visits derselben
Tab-Session passiert NICHTS (Animation ist an `_meta.firstBootShown`-
Flag gekoppelt, einmal pro Session).

#### Sichtbarkeits-Modi

`init({visible})` mit drei diskreten Werten (Brief-Erweiterung um
`"compact"` **zurückgestellt** — Bau-Sitzung 16 kann das später
nachreichen, wenn ein konkreter Endknoten den Wunsch äußert):

- `"visible"` (Default für Sage-Page + Endknoten) — sichtbares
  Badge, Click öffnet Modal.
- `"hidden"` (Tool-Apps mit eigenem Design) — kein DOM-Render des
  Badge, aber `SbkimSiegel.isCertified()` / `getExplanation()` /
  `getAspects()` / `getCertifiedModules()` API erreichbar. Modal-
  Mount ebenfalls unterbunden (Mountfindet kein Trigger).

**Compact-Modus** bewusst ausgeschlossen — bis ein Endknoten konkret
darum bittet, bleibt 40 px die einzige Größe. Spec spart eine zweite
SVG-Variante und eine Größen-Variable. Bau-Sitzung 16 / 17 darf das
nachreichen.

#### Anti-Greenwashing-Anker (binär)

Wenn `isCertified() === false`:

- **KEIN Badge-Render.** Element wird gar nicht angelegt (bzw.
  `display:none` ist NICHT ausreichend — kein DOM-Element überhaupt,
  damit Inspektion sofort sichtbar macht „kein Siegel").
- **Auch nicht ausgegraut.** Auch nicht „in Arbeit". Auch nicht
  „warte auf Embedding".

Diese Klausel ist binär und nicht-verhandelbar (Karte 16 § Strikte
Tabus).

#### Floating-Widget-Pfad (seit Spec-Sitzung 17, 2026-05-25)

Seit Spec-Sitzung 17 (2026-05-25) ist Endknoten-Standard das Widget
aus [Karte 17](17_floating_widget.md); die Navleisten-Badge-Optik
bleibt Sage-Page-Pfad. Modul 16 ist Backend für den SIEGEL-Slot des
Widgets — `dispatchEvent("sbkim:siegel-certified", { detail: { certifiedAt,
repoUrl }})` einmalig nach `init()` wenn `isCertified() === true` wird
in Bau-Sitzung 17 nachgezogen.

### Sub (c) — Erklärungs-Modal

#### Titel

**Bestätigt:** „SBKIM-Siegel — was bedeutet das?"

#### Inhalt (Pflicht-Struktur)

Modal-Body rendert in dieser Reihenfolge:

1. **Datum der ersten Bezeugung** (z.B. „Bezeugt seit 2026-05-24,
   18:42 Uhr"). Datum aus `_meta.certifiedAt` (siehe §
   Persistenz unten). **Anzeige LOKAL** (Klaus' Konvention seit
   Pflege Modal-Local-Time 2026-05-26): Datums-Komponenten werden
   via `new Date(certifiedAt).getFullYear()` / `getMonth()` /
   `getDate()` / `getHours()` / `getMinutes()` aus der **lokalen
   Zeitzone des Endnutzers** gebaut — KEIN `toISOString().slice(...)`-
   UTC-Pfad. Format-Konvention: `YYYY-MM-DD, HH:MM` (ISO-Datum +
   lokale Stunden/Minuten, kein Zeitzonen-Suffix). Begründung:
   Klaus' MESZ (+2h) wäre via UTC-Pfad als US-ähnliche Zeit
   verwirrend; lokale Komponenten machen die Bezeugungszeit
   sofort lesbar für den Endnutzer der aktuellen Tab-Session.
   `_meta.certifiedAt` bleibt UTC-ISO (Spec-Vertrag) — die
   Render-Schicht konvertiert.
2. **Modul-Liste** (Pflicht-Module): jede Zeile zeigt
   `<ID> · <Name> · <Status>` mit Status-Marker. Status-Marker:
   - `"ok"` → grüner Punkt + „bereit"
   - `"deferred"` → goldener Punkt + „bereit (lazy)"
   - `"missing"` / `"broken"` → roter Punkt (rendert nur, wenn
     `isCertified() === false`, kommt in der Praxis im Modal nicht
     vor, weil das Modal ohne Bezeugung gar nicht öffnet)
3. **Aspekte-Liste**: chronologisch aufsteigend (älteste oben),
   pro Aspekt `<seit-Datum> · <module-ID> · <aspect-Titel>` plus
   `<description>` als Body-Text in kleiner Schrift.
4. **Aussteller-Klärung** (zwei Zeilen, nüchtern — siehe nächster
   Abschnitt).

#### Aussteller-Klärung (final, nüchtern)

**Verbindlicher Wortlaut:**

> Dieses Siegel ist **self-inscribing**: die App hat sich beim Boot
> selbst geprüft.
> Vertrauen kommt vom Repo, in dem sie gehostet ist: `<repo-url>`.

`<repo-url>` wird zur Laufzeit eingesetzt, als anklickbarer Link
gerendert (`<a href="<repo-url>" target="_blank" rel="noopener
noreferrer">`).

**Disziplin (Klaus-Korrektur 2026-05-24):** KEIN Disclaimer-Schwall,
KEIN „ohne Garantie"-Block, KEIN Haftungs-Schein-Stil. „Ohne
Garantie" war nicht ernst gemeint und wird **nicht** aufgenommen.
Die zwei Zeilen oben sind verbindlich; eine spätere Pflege darf
Wortlaut-Politur einbringen (z.B. „bereit" statt „bereit"), aber
NICHT die Zahl der Sätze, NICHT die nüchterne Sachlichkeit kippen.

#### Modal-Form

- **Eigenständig in `document.body`** (analog Modul 15 Fremdzugriff-
  Modal). Kein Modul-00-Reuse, keine Slide-Card.
- **Backdrop-Klick / Esc-Keydown / ✕-Button** schließen das Modal,
  alle drei äquivalent.
- **Wertigere Typografie** (Spec-Wille):
  - Titel + Aussteller-Klärungs-Block in **Serif** (`'Spectral',
    'Georgia', serif`).
  - Modul-Liste + Aspekte-Liste bleiben in **Geist** (Standard-Sans)
    — das ist die „Daten"-Schicht, sie soll lesbar und kompakt sein.
  - **Dezenter Rahmen** (1 px Edel-Gold-Linie `var(--siegel-line)`
    am Modal-Container), nicht die Standard-Modul-15-Glas-Optik.
  - **Hintergrund:** sehr dunkles Bronze (`var(--siegel-ink)`-Klasse)
    statt des Modul-15-`--bg-2`-Tons — klassischer Stil-Wechsel weg
    vom Sage-Page-Mono-/Lampen-Stil.
- **Mindest-Breite** 320 px, **Maximal-Breite** 560 px, vertikal
  scrollbar bei vielen Aspekte-Einträgen.

Bau-Sitzung 16 entscheidet die exakten Padding-/Margin-Werte; die
Spec verankert nur Schrift-Familie + Rahmen-Farbe + Hintergrund-Ton.

#### Repo-URL-Quelle

**Auto-Erkennung mit Override-Option** (Brief-Vorschlag bestätigt):

```js
function defaultRepoUrl() {
  // GitHub-Pages-Konvention: https://<user>.github.io/<repo>/...
  // Anker: erste Pfad-Komponente als Repo-Pfad ankern.
  var origin = (typeof location !== "undefined" && location.origin) || "";
  var path = (typeof location !== "undefined" && location.pathname) || "/";
  var firstSegment = path.split("/").filter(Boolean)[0];
  if (firstSegment) {
    return origin + "/" + firstSegment + "/";
  }
  return origin + "/";
}
```

**Override:** `init({repoUrl: "https://github.com/..."})` ersetzt
die Auto-Erkennung. Endknoten-PWAs setzen typischerweise den
expliziten **GitHub-Repo-Source-URL** (z.B.
`https://github.com/lausiklauskn-png/Mein-Mixarium`), weil das mehr
Vertrauen bietet als die Pages-URL (Klaus kann via Repo-Issues
kontaktiert werden, Forker können forken).

**Empfehlung im Spec:** Endknoten-PWAs sollten den **Source-Repo-
URL** setzen, nicht die Pages-URL. Sage-Page-Default kann die
Auto-Erkennung nutzen (`https://lausiklauskn-png.github.io/Sage-
Protokol/`) oder explizit `https://github.com/lausiklauskn-png/Sage-
Protokol` setzen — Bau-Sitzung 16 entscheidet, Klaus genehmigt.

### Sub (e) — Mycel-Verbindungs-Stufe (Bronze / Gold, Spec-Erweiterung 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26 (Tafel-Spec-Pflege Mycel-
Vision): das SIEGEL soll **zweistufig** sein — Bronze („Mycel
suchend"), wenn der Surface-Check grün ist, aber noch kein
Cross-Knoten-Handshake stattgefunden hat; Gold („Mycel verbunden")
sobald der erste `sbkim:handshake outcome:"established"`-Event erfolgt
ist.

**Tafel-Anpassungs-Antrag (CLAUDE.md § Tafel-Evolutions-Klausel):**
Diese Karte hatte unter § Strikte Tabus den Punkt „Keine Stufen-
Varianten (Bronze / Silber / Gold) für das Grund-Siegel". Klaus'
Vision-Klärung 2026-05-26 ergänzt diese Klausel — siehe § Strikte
Tabus § „Bronze/Gold-Stufung erlaubt seit 2026-05-26".

#### Warum zweistufig

Henne-Ei-Problem (Klaus' Anmerkung 2026-05-26): „Wenn das SIEGEL erst
nach dem ersten Handshake voll erscheint, gibt es vorher kein
Andocken — und ohne Andocken kein erster Handshake." Die Tafel-
Antwort: das SIEGEL erscheint **schon Bronze** wenn die Surface-Prüfung
grün ist, sodass Klick → Modul 18 Tool-PWA-Container (Andock-Geste)
möglich wird. Nach erstem erfolgreichem Handshake wechselt der SIEGEL
auf Gold + First-Boot-Animation Aspekt 4.

#### Schema

```js
SiegelStufe = "bronze" | "gold"
```

Logik:

```js
function siegelStufe() {
  // Voraussetzung: isCertified() === true (Surface-Check grün).
  // Wenn nicht, ist KEIN Badge da (Anti-Greenwashing intakt).
  if (_meta.mycelConnected === true) return "gold";
  return "bronze";
}
```

**`_meta.mycelConnected`** wird auf `true` gesetzt, sobald Modul 16
einen `sbkim:handshake` window-Event mit
`detail.outcome === "established"` empfängt (Mechanismus siehe
nächster Block).

#### Modul-16-Listener auf `sbkim:handshake`

Bau-Sitzung 16 Sub (e) ergänzt im `init()`:

```js
window.addEventListener("sbkim:handshake", function (event) {
  const outcome = event?.detail?.outcome;
  if (outcome !== "established") return;
  if (_meta.mycelConnected) return;  // idempotent
  _meta.mycelConnected = true;
  _meta.mycelConnectedAt = new Date().toISOString();
  // Re-Render Badge mit Gold-Stufe + First-Boot-Animation-Variante
  // für Stufenwechsel (z.B. .first-boot-gold Klasse 600 ms).
  rerenderBadge();
});
```

**Idempotent:** zweiter `outcome:"established"`-Event ändert nichts.
**Fail-soft:** wenn `event.detail` fehlt oder kein Objekt ist, no-op
(Modul 16 wirft nicht).

#### Visuelle Unterscheidung Bronze vs. Gold

**Bronze (Mycel suchend):**
- Wappen-Glyph rendert in **gedämpftem Bronze-Ton** (`#8C6E2F`
  statt `#C9A961`) — derselbe SVG, andere CSS-Variable.
- Goldring-Farbe ebenfalls gedämpft.
- Tooltip: „SBKIM-Siegel · Mycel suchend"

**Gold (Mycel verbunden):**
- Vollwertige Gold-Optik (`#C9A961`-Klasse, original CSS aus Spec-
  Sitzung 16).
- First-Boot-Animation auf Stufenwechsel (`.first-boot-gold`
  Klasse, 600 ms, optisch ähnlich aber unterscheidbar von der
  originalen First-Boot-Animation).
- Tooltip: „SBKIM-Siegel · Mycel verbunden"

**CSS-Skizze (Spec-Anker, finale Werte in Bau-Sitzung 16 Sub e):**

```css
:root {
  --siegel-bronze:      #8C6E2F;
  --siegel-bronze-glow: rgba(140,110,47,0.45);
}

#sbkim-siegel-badge[data-stufe="bronze"] {
  filter: saturate(0.6) brightness(0.85);
  /* Wappen-SVG wird per JS auf Bronze-Glyph-Farbe umgesetzt */
}

#sbkim-siegel-badge[data-stufe="gold"] {
  /* Default-Render, keine Override */
}

@keyframes siegel-stufenwechsel-gold {
  0%   { transform: scale(1.00); }
  40%  { transform: scale(1.15); box-shadow: 0 0 24px var(--siegel-gold-glow); }
  100% { transform: scale(1.00); }
}

#sbkim-siegel-badge.stufenwechsel-gold {
  animation: siegel-stufenwechsel-gold 600ms ease-out;
}
```

Bau-Sitzung 16 Sub (e) entscheidet die finalen Pfade; das Spec verankert
das Verhalten + die zwei Stufen-Werte.

#### Klick-Verhalten in Bronze

**Beide Stufen klickbar.** In Bronze öffnet der Klick weiterhin das
Erklär-Modal (Sub c), aber das Modal zeigt **zusätzlich** einen
Hinweis-Block:

> „**Mycel suchend** — diese App ist SBKIM-fähig, aber noch nicht mit
> Geschwister-Knoten verbunden. Klick auf [Andocken] (Modul 18) um
> eine Verbindung herzustellen."

`[Andocken]`-Knopf öffnet Modul 18 Sub (a) (sobald gebaut). Vor
Modul 18 zeigt der Knopf eine Info-Notiz: „Modul 18 noch nicht
verfügbar — Andocken via Sage-Page-Andock-Wizard."

**Drei-Pfad-Verhalten (Pflege 2026-05-28 — Refinement von PR #197
nach Sage-Page-Sichttest):**

- **Pfad 1 — Erfolg:** `SbkimToolPwa.openAndockTab()` wirft NICHT
  (Modul 18 ist initialisiert) → Wizard startet → Bronze-Modal
  schließt sich automatisch.
- **Pfad 2 — Throw:** `openAndockTab()` wirft `ToolPwaNotReadyError`
  (Modul 18 geladen, aber Andocker hat `init()` nicht aufgerufen) →
  Bronze-Modal bleibt offen, Info-Hinweis „Modul 18 ist geladen,
  aber im Andocker nicht initialisiert" wird im Hinweis-Block
  eingeblendet. User sieht sofort die Konfigurations-Lücke.
- **Pfad 3 — Fallback:** `SbkimToolPwa` fehlt komplett (Modul-18-
  Skript nicht geladen) → bestehende Info-Notiz „Modul 18 noch nicht
  verfügbar", Modal bleibt offen.

Hintergrund: PR #197 schloss das Modal IMMER nach `openAndockTab()`,
auch wenn der Aufruf wegen fehlender `init()` warf. Klaus' Sage-Page-
Sichttest 2026-05-28 zeigte: Modal verschwand, aber kein Wizard kam
— verwirrend. Begleitende Pflege füllt diese Lücke: Sage-Page
`sbkim-init.js` ruft `SbkimToolPwa.init({…Sage-Spore-Werte…})` jetzt
nach `SbkimSiegel.init` auf (Sage ist Hybrid-Endknoten, siehe
`sbkim/spore.json` `nodeType:"hybrid"`).

#### Persistenz (Bronze → Gold-Wechsel)

**RAM-only** (analog Modul 16 Persistenz-Klausel, § Persistenz).
`_meta.mycelConnected` lebt nur in der aktuellen Tab-Session.

**Konsequenz:** beim Tab-Reload startet jeder Endknoten wieder mit
Bronze, bis der erste neue Handshake erfolgt. Das ist **gewollt** —
die Bronze/Gold-Stufe spiegelt die **aktive Verbindungs-Situation**,
nicht eine historisch erfolgte Verbindung. Wer mehr will, baut Modul
10 Reputation mit Append-Log.

#### Aspekt-4-Eintrag (verbindlich für Bau-Sitzung 16 Sub e)

Wenn `_meta.mycelConnected === true` → ZERTIFIKAT_ASPEKTE-Liste rendert
zusätzlich:

```js
{
  since:       "2026-05-26",
  module:      "16",
  aspect:      "Mycel-Verbindung etabliert (erster Handshake)",
  description: "Diese App hat in der aktuellen Session mindestens einen erfolgreichen Cross-Knoten-Handshake durchgeführt. SIEGEL-Stufe Gold.",
}
```

Aspekt 4 ist **dynamisch sichtbar** (nur in Gold-Stufe), aber bleibt
**code-versionierter Eintrag** in `ZERTIFIKAT_ASPEKTE` (in Bronze-
Stufe rendert das Modal Aspekt 4 trotzdem, aber mit Marker „pending"
statt mit Datum — Bau-Sitzung 16 Sub e entscheidet die exakte UI-
Darstellung).

### Sub (d) — Aspekte-Liste (lebendes Dokument)

#### Schema

```js
Aspect = {
  since:       <ISO-Datum>,     // "YYYY-MM-DD" (Datum, nicht Datetime)
  module:      <string>,         // Modul-ID, z.B. "16", "11", "12"
  aspect:      <string>,         // Kurz-Titel, ≤ 80 Zeichen
  description: <string>,         // 1–2 Sätze, ≤ 240 Zeichen, kein PII
}
```

**Disziplin:**

- `since` ist **Datum**, nicht Datetime. Pflege-PRs tragen das Pflege-
  Datum ein. Multiple Aspekte am selben Tag sind erlaubt (Reihenfolge
  über `module`-ID-Sortierung als Tie-Breaker).
- `module` ist **string** (analog `status.json` `modules[].id`), nie
  number. Pflicht-Format zweistellig (`"01"` statt `"1"`).
- `aspect` ist **kurzer Titel** ohne Satzende-Punkt (z.B.
  „Grund-Siegel-Bezeugung", „Rate-Limit für eingehende postMessage").
- `description` ist **1–2 Sätze**, sachlich, KEIN PII, KEINE Marketing-
  Sprache. Modal rendert `description` als Text, daher HTML-Entitäten
  per Konvention NICHT escapen-pflichtig (Bau-Sitzung 16 baut
  text-only Render).

#### Start-Eintrag (verbindlich für Bau-Sitzung 16)

```js
{
  since:       "2026-05-24",
  module:      "16",
  aspect:      "Grund-Siegel-Bezeugung",
  description: "Diese App bestätigt durch Selbst-Prüfung beim Boot, dass die SBKIM-Pflicht-Module 01/02/03/04/05/07/15 geladen sind.",
}
```

Begründungs-Disziplin: die Beschreibung **nennt die Pflicht-Module
namentlich**, weil der erste Aspekt-Eintrag den Bezugs-Anker für
spätere Erweiterungen setzt. Spätere Aspekte verweisen nur auf das
neue Modul (z.B. „Modul 11 Rate-Limit für eingehende postMessage"),
nicht auf die ganze Pflicht-Liste — die ist im ersten Eintrag
zementiert.

#### Aspekt 4 — Mycel-Verbindung etabliert (Spec-Erweiterung 2026-05-26)

```js
{
  since:       "2026-05-26",
  module:      "16",
  aspect:      "Mycel-Verbindung etabliert (erster Handshake)",
  description: "Diese App hat in der aktuellen Session mindestens einen erfolgreichen Cross-Knoten-Handshake durchgeführt. SIEGEL-Stufe Gold.",
}
```

**Sonderfall — dynamische Render-Variante (Spec-Erweiterung 2026-05-26):**

Aspekt 4 ist der einzige `ZERTIFIKAT_ASPEKTE`-Eintrag, der vom
Modul-16-Listener auf `sbkim:handshake outcome:"established"` aktiviert
wird (siehe § Sub (e) Mycel-Verbindungs-Stufe). Solange
`_meta.mycelConnected === false`, rendert das Modal Aspekt 4 mit
Marker „pending"; sobald `true`, rendert es mit Datum. Andere Aspekte
sind statisch (Datum aus `since`-Feld). Bau-Sitzung 16 Sub (e)
entscheidet, ob „pending"-Aspekte sichtbar oder ausgeblendet werden;
Default-Vorschlag: **sichtbar mit grauem Marker**, damit Endnutzer
sieht „Mycel-Verbindung noch nicht hergestellt" als sinnvollen UI-
Anker für Andock-Geste.

#### Reihenfolge

**Aufsteigend chronologisch (älteste oben).** Bestätigt
Brief-Vorschlag. Begründung: jeder spätere Aspekt setzt auf den
vorherigen auf — wer das Modal von oben nach unten liest, sieht
**das Wachsen** des Siegels über die Zeit. Tie-Breaker bei gleichem
Datum: `module`-ID aufsteigend.

#### Pflicht-Konvention für künftige Sicherheits-Module

**Verbindlich in Karte 16 § Sub (d):** jedes spätere Sicherheits- /
Schutz-Modul (10 Reputation, 11 Rate-Limit, 12 Blocklist, künftige
14 Diffusion, künftige Sub-Bereiche von Modul 15) **MUSS** in seiner
Bau- / Pflege-Sitzung in `src/modules/16_siegel.js` einen
`ZERTIFIKAT_ASPEKTE`-Eintrag ergänzen (am Listen-Ende, mit aktuellem
Datum + Modul-ID + kurzer Beschreibung).

**Folge-Pflege CLAUDE.md (Spec-Sitzung 16 markiert das als
to-do für die Hauptsitzung — diese Spec-Sitzung selbst greift
NICHT in CLAUDE.md ein, weil das eine Querschnitts-Tafel-Pflege ist):**
das Verfahren wird in CLAUDE.md § „Was du nicht tust" als positive
Pflicht aufgenommen — etwa unter einem neuen Block § „Sicherheits-
Module pflegen Aspekte". Diese Pflege ist Aufgabe einer eigenen
Mini-Pflege-Sitzung NACH Bau-Sitzung 16 (siehe § Brief-99-Pipeline
unten).

**Disziplin:** Aspekte werden **NICHT zur Laufzeit hinzugefügt**. Die
`ZERTIFIKAT_ASPEKTE`-Liste ist code-versioniert. Jeder Aspekt-
Eintrag entspricht einem Pflege-PR (oder Bau-PR) mit nachvollziehbarem
Datum + Commit-SHA.

---

## Schnittstelle (final)

```js
window.SbkimSiegel = {
  // Snapshot-Init: prüft Pflicht-Module, cached Resultat in Closure,
  // mountet Badge (wenn visible !== "hidden") und Modal-Lifecycle.
  // Idempotent — zweiter Aufruf ist no-op (kein Re-Check, kein Re-Mount).
  init: function (options) { /* Promise<void> */ },

  // Sync, boolean — true wenn alle Pflicht-Module (ohne lazy-Tolerator-
  // Sonderfall) Status ∈ {"ok", "deferred"} sind. Gültig nach init().
  isCertified: function () { /* boolean */ },

  // Sync, ExplanationSnapshot — Modal-Render-Quelle. Defensive Kopie,
  // Mutation am zurückgegebenen Objekt berührt den internen Snapshot
  // nicht (analog Modul 15 fremdzugriff.list()).
  getExplanation: function () { /* ExplanationSnapshot */ },

  // Sync, string[] — IDs der bestätigten Pflicht-Module
  // (Status "ok" + "deferred"). Defensive Kopie.
  getCertifiedModules: function () { /* string[] */ },

  // Sync, Aspect[] — chronologisch aufsteigend, defensive Kopie.
  getAspects: function () { /* Aspect[] */ },

  // Read-Anker für Tests (analog Modul 15 _meta). Pflicht-Felder:
  //   firstBootShown:    boolean   (true nach erster First-Boot-Animation)
  //   certifiedAt:       string | null  (ISO-8601, gesetzt beim ersten
  //                                       isCertified()===true im init())
  //   pflichtModuleSpec: array     (kopierter Snapshot der PFLICHT_MODULE)
  _meta: { /* Read-Only-Anker */ },
};
```

### `options`-Form (`init()`)

```js
{
  // CSS-Selektor für das Badge-Element. Default '#sbkim-siegel-badge'.
  // Wenn der Selektor zur init()-Zeit nicht matcht und `mountModal:true`,
  // wird via MutationObserver wie in Modul 00 nach DOMContentLoaded
  // erneut versucht.
  badgeSelector?: string,

  // "visible" (Default): Badge wird gerendert + Modal-Lifecycle aktiv.
  // "hidden": Kein DOM-Render des Badges, kein Modal-Mount; API
  //           (isCertified/getExplanation/getAspects/getCertifiedModules)
  //           bleibt erreichbar.
  visible?: "visible" | "hidden",

  // Default true. Wenn false: Modal wird NICHT angelegt, Click-Handler
  // am Badge ist no-op. Sinnvoll für Endknoten-PWAs, die ein eigenes
  // Modal-Design haben und nur das Badge nutzen wollen.
  mountModal?: boolean,

  // Override für die Aussteller-Klärungs-Zeile. Wenn null/undefined,
  // wird die Auto-Erkennung (`location.origin + first-path-segment`)
  // verwendet. Endknoten setzen typischerweise den Source-Repo-URL
  // (z.B. "https://github.com/lausiklauskn-png/Mein-Mixarium").
  repoUrl?: string | null,
}
```

### `ExplanationSnapshot`

```js
{
  certifiedAt:  <ISO-8601 string | null>,   // null wenn isCertified() === false
  isCertified:  <boolean>,                   // Spiegel von isCertified() zur Snapshot-Zeit
  repoUrl:      <string>,                    // aus Override oder Auto-Erkennung
  modules:      [                            // pflicht-Modul-Liste mit Status
    { id, name, globalName, surfaceFn, lazy, status }   // status ∈ "ok"/"deferred"/"missing"/"broken"
  ],
  certifiedModules: <string[]>,              // IDs aus modules[] mit status ∈ {"ok","deferred"}
  aspects:      [Aspect, ...]                // chronologisch aufsteigend
}
```

### `Aspect`

```js
{
  since:       <ISO-Datum string>,   // "YYYY-MM-DD"
  module:      <string>,              // zweistellige Modul-ID
  aspect:      <string>,              // Kurz-Titel
  description: <string>,              // 1–2 Sätze, ≤ 240 Zeichen
}
```

---

## Persistenz

**Wahl: RAM-only (Variante A).** Analog Modul 15 Sub (e).

Begründung in drei Sätzen:

1. Das Siegel ist eine **per-Session-Selbst-Bezeugung** — bei jedem
   Tab-Reload prüft die App sich erneut. Persistenz fügt keinen Wert
   hinzu, weil das Datum „erste Bezeugung dieser Tab-Session" eine
   ehrliche Aussage ist; eine IndexedDB-Persistenz würde suggerieren,
   das Siegel sei „älter" als es tatsächlich aktiv ist.
2. **Kein `DB_VERSION`-Bump** in Modul 01, kein neuer Store, keine
   Migration. Modul 16 ist storage-frei (analog Modul 15).
3. `certifiedAt` ist der Zeitstempel der **aktuellen** Bezeugung
   (`new Date().toISOString()` zur `init()`-Zeit, wenn
   `isCertified() === true`). Das Modal kommuniziert ehrlich „bezeugt
   seit dieser Session"; wer das Persistente will, baut Modul 12
   Blocklist mit Append-Log und ergänzt einen Aspekt-Eintrag.

**Konsequenz:** Modal-Datum sagt **„bezeugt seit YYYY-MM-DD HH:MM"**
mit Stunden+Minuten der aktuellen Session. Klaus' typische Sichttest-
Frage „seit wann?" beantwortet sich damit ehrlich („seit ich den
Tab geöffnet habe").

---

## Strikte Tabus (verbindlich)

- **Kein Siegel ohne Selbst-Prüfung-grün.** Wenn ein Pflicht-Modul
  fehlt (`status:"missing"` oder `"broken"`), KEIN Badge-Render. Auch
  nicht ausgegraut, auch nicht „in Arbeit". Binär.
- **Self-Issued ist eine Disziplin-Aussage, KEIN UI-Disclaimer.** Die
  Modal-Klausel ist sachliche Selbst-Beschreibung in zwei Zeilen, kein
  Haftungsausschluss-Block. „Ohne Garantie" wird NICHT in den UI-Text
  aufgenommen (Klaus-Korrektur 2026-05-24).
- **Keine Hub-Aussteller-Variante.** Self-Inscribing ist die einzige
  spezifizierte Variante. Eine zentrale Zertifizierungs-Autorität
  würde dem dezentralen SBKIM-Geist widersprechen.
- **Keine Aspekte-Liste zur Laufzeit ergänzen.** `ZERTIFIKAT_ASPEKTE`
  ist code-versioniert. Jeder neue Eintrag = ein Pflege-PR mit
  Commit-SHA. KEINE `addAspect(...)`-Funktion auf der API.
- **Keine Pflicht-Modul-Liste zur Laufzeit ändern.** `PFLICHT_MODULE`
  ist code-versioniert. KEINE `setPflichtModule(...)`-Funktion auf
  der API. Endknoten-PWAs können nicht „Modul 11 als zusätzlich
  Pflicht" konfigurieren — sie ergänzen einen Aspekt-Eintrag in
  ihrer Repo-Kopie von `16_siegel.js`, falls sie wollen.
- **Keine PII im Modal.** Repo-URL ist öffentlich (es ist die
  Hosting-URL). Modul-Liste ist öffentlich (Modul-IDs sind Spec-
  Konvention). Aspekt-Beschreibungen sind öffentlich (sie stehen
  im Code-Repo). **Keine `nodeId`** im Modal, **keine API-Keys**,
  **keine Geschwister-Liste**.
- **Bronze/Gold-Stufung erlaubt seit 2026-05-26** (Tafel-Anpassung, Tafel-
  Spec-Pflege Mycel-Vision). **Original-Klausel 2026-05-24:** „Keine
  Stufen-Varianten (Bronze / Silber / Gold) für das Grund-Siegel."
  **Anpassung 2026-05-26 (Klaus' Vision-Klärung):** zwei Stufen
  erlaubt — Bronze („Mycel suchend") und Gold („Mycel verbunden").
  Begründung: Henne-Ei-Problem (ohne SIEGEL → kein Andocken; ohne
  Andocken → kein erster Handshake → kein Voll-SIEGEL). Bronze macht
  das SIEGEL **klickbar bevor** der erste Cross-Knoten-Handshake
  erfolgt ist und triggert Modul 18 Sub (a) (Andock-Geste). Spec siehe
  § Sub (e) Mycel-Verbindungs-Stufe. **Silber, Platin, weitere Stufen
  bleiben verboten** — zwei Stufen entsprechen einer aktiven
  Bedeutung (suchend vs. verbunden), drei oder mehr wären Marketing-
  Hierarchie.
- **Modul 16 ist nicht protokoll-aktiv.** Kein Netz, keine Signatur,
  kein Embedding, kein Handshake. Lokales Render-Modul, das den
  Empfangsmodus-Grundsatz aus CLAUDE.md / `sbkim_paper.pdf` nicht
  berührt.
- **Lazy-Module-Toleranz ist auf 03 (Embedding) begrenzt.** Spätere
  Pflicht-Module dürfen NICHT pauschal als `lazy:true` markiert
  werden, um die Pflicht-Prüfung zu umgehen. Wer ein neues
  Pflicht-Modul lazy macht, muss das in einer eigenen Pflege-Sitzung
  Karte 16 begründen.

---

## Risiken

- **Surface-Check-Spoofing.** Ein böswilliges Snippet ergänzt
  `window.SbkimSpore = { getOwnSpore: () => null }`-Stub und täuscht
  das Siegel. Mitigation: Surface-Check erkennt nur „Funktion
  existiert", nicht „Funktion arbeitet korrekt". Das ist ein bewusster
  Trade-off — eine tiefe Verhaltens-Prüfung wäre fragil (Stale
  Test-Stubs würden ständig falsche Negativ-Befunde liefern). Wer
  einen tieferen Check will, baut eine Bau-Sitzung 16.B mit
  Handshake-Self-Test (Modul 05 läuft erfolgreich an sich selbst).
  Akzeptiert: Spoofing erfordert lokalen Code-Eingriff im PWA-Repo;
  wer das tut, hat schon volle Kontrolle.
- **Aspekte-Liste-Drift zwischen Endknoten.** Mein-Mixarium ergänzt
  einen Aspekt-Eintrag, Mein-Rezeptbuch nicht — das Siegel-Modal
  zeigt unterschiedliche Aspekte pro Endknoten. Mitigation: das
  ist **gewollt** — jeder Endknoten ist ein eigener Mycel-Knoten
  mit eigener Pflege-Geschichte. Falls Klaus eine zentrale Aspekte-
  Liste will, muss eine spätere Spec-Sitzung das festlegen
  (z.B. via fetch auf Sage-Hub-status.json — bricht aber den
  Empfangsmodus-Grundsatz).
- **Embedding-Lazy-Loading vortäuscht Bezeugung.** Sage-Page lädt
  Modul 03 lazy; Surface-Check sieht `status:"deferred"`, wertet
  das als bestanden. Ein PWA-Repo, das Modul 03 absichtlich NICHT
  einbindet, würde dennoch ein Siegel zeigen. Mitigation: Bau-
  Sitzung 16 setzt `lazy:false` für jedes Pflicht-Modul, das im
  Endknoten-PWA-Andock-Workflow (Karte 09 § Schritt 2) eager
  geladen werden soll. Sage-Page ist ein expliziter Sonderfall.
- **Repo-URL-Auto-Erkennung trifft falsche Pfad-Komponente.** Z.B.
  `https://lausiklauskn-png.github.io/Sage-Protokol/some/subpath` —
  Auto-Erkennung nimmt `Sage-Protokol`-Segment korrekt, aber bei
  Custom-Domain (`https://klaus.example/myapp`) wäre `myapp`-
  Segment evtl. nicht der Repo-Name. Mitigation: PWA-Andocker setzt
  bei Custom-Domain den expliziten `repoUrl`-Override.
- **First-Boot-Animation während Lade-Sequenz nicht sichtbar.** Wenn
  Klaus auf dem Tablet das Tab erst Sekunden später aktiv anschaut
  (Hintergrund-Tab), entgeht ihm die 600-ms-Animation. Mitigation:
  bewusste Akzeptanz — die Animation ist Hervorhebung, kein
  Pflicht-Signal. Wer das Badge bei Re-Visit sieht, hat denselben
  Informations-Wert (es ist da, also bezeugt).
- **Verwechslung mit „rechtlicher Garantie".** Ein Nutzer interpretiert
  das Goldglanz-Medaillon als TÜV-äquivalente Zertifizierung.
  Mitigation: das Modal sagt es **explizit, nüchtern**: „self-
  inscribing — die App hat sich selbst geprüft, Vertrauen kommt vom
  Repo". Klaus' Korrektur lehnt einen zusätzlichen Haftungsausschluss-
  Block ab — die zwei Sätze sind die definierte ehrlich Selbst-
  Beschreibung, kein Versuch, Vertrauen aufzubauen, das nicht da ist.

---

## Manueller Test (Vorbereitung für Bau-Sitzung 16)

*(Diese Spec-Sitzung definiert die Test-Punkte; konkrete
Knöpfe + Output-Form gehören in Panel 16 von
`tests/manual_check.html` aus der Bau-Sitzung 16.)*

**Erwartete Test-Punkte:**

1. **Setup**: `SbkimSiegel.init({mountModal:true})` aufrufen, im Setup-
   Output Modul-Liste mit Status-Spalte zeigen (alle „ok" oder
   „deferred"). `isCertified()` → `true`.
2. **isCertified mit fehlendem Pflicht-Modul**: Test-Brücke setzt
   `window.SbkimMatch = undefined` (oder schiebt einen Stub ohne
   `match`-Funktion), ruft `SbkimSiegel.init()` erneut auf einer
   Test-Sub-Instanz — erwartet `isCertified() === false`, eine
   `console.warn`-Zeile mit ID `04 (missing)`, KEIN Badge-Render
   (Element ist nicht im DOM).
3. **Badge-Click öffnet Modal**: Click auf `#sbkim-siegel-badge` →
   Modal mit Pflicht-Modul-Liste, Aspekte-Liste, Aussteller-Klärung
   sichtbar. Backdrop-Klick / Esc / ✕ schließen.
4. **Aussteller-Klärung mit Override**: `init({repoUrl:
   "https://github.com/lausiklauskn-png/Mein-Mixarium"})` — Modal-
   Aussteller-Klärungs-Zeile zeigt diesen Link.
5. **Aspekte-Reihenfolge**: Modal-Aspekte-Liste hat den Grund-
   Siegel-Eintrag oben (2026-05-24, Modul 16). Bei Bau-Sitzung 16
   ist genau ein Eintrag drin; spätere Pflege-Sitzungen fügen
   Einträge unten an.
6. **First-Boot-Animation**: erster Tab-Lauf → 600-ms-Aufleucht-Puls
   am Badge sichtbar. Reload des Tabs → erneut sichtbar (RAM-only,
   `firstBootShown` ist per-Session).
7. **Hidden-Modus**: `init({visible:"hidden"})` — kein Badge im DOM,
   aber `SbkimSiegel.isCertified()` und `getExplanation()` liefern
   sinnvolle Werte.
8. **Anti-Greenwashing**: Test-Brücke `_setPflichtModuleStatusForTest`
   markiert Modul 05 als `"missing"` — Re-Init ergibt kein Badge,
   eine `console.warn`-Zeile mit `05 (missing)`. (Bau-Sitzung 16
   entscheidet, ob diese Test-Brücke nötig ist oder ob das via
   tatsächliche `window.SbkimAnastomose = undefined`-Manipulation
   getestet wird.)

---

## Reihenfolge im Brief-99-Pipeline

```
Schritt 1: Spec-Sitzung 16        (DIESE — Karte gefüllt 2026-05-24)
Schritt 2: Bau-Sitzung 16          (src/modules/16_siegel.js,
                                    Badge-CSS in index.html, Modal-Mount,
                                    ZERTIFIKAT_ASPEKTE-Startwert,
                                    Panel 16 in tests/manual_check.html)
Schritt 3: Sichttest 16            (Klaus, Sage-Page Badge sichtbar +
                                    Modal öffnet sich + First-Boot-
                                    Animation + Aussteller-Klärung)
Schritt 3a: Pflege CLAUDE.md       (Sicherheits-Modul-Aspekt-Pflicht
                                    in CLAUDE.md verankern — eigene
                                    Mini-Pflege-Sitzung nach Bau 16)
Schritt 4: Spec-Sitzung 15.B       (Sub (a) Read-API: Siegel-Hook im
                                    Snapshot — read() liefert
                                    `siegel: { isCertified, repoUrl,
                                    certifiedModules }`; Sub (b)
                                    postMessage finale Form)
Schritt 5: Endknoten-Migration     (Karte 09 § Schritt 10 — Membran-
                                    Allowlist + FREMD-Lampe + Siegel-
                                    Badge pro Endknoten-PWA. Eigene
                                    Folge-Sitzung pro Endknoten-Repo
                                    (Mein-Rezeptbuch, Mein-Mixarium))
Schritt 6: Klaus' App-Freigabe     (mit Siegel sichtbar, Modal-
                                    Aussteller-Klärung verlinkt auf
                                    GitHub-Repo)
Später:    Modul 11 / 12 / 10      (jeder Bau ergänzt einen
                                    ZERTIFIKAT_ASPEKTE-Eintrag im
                                    Siegel-Modul)
```

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-24 | Mini-Pflege „Modul 16 SBKIM-Siegel Stub" | Name fix: SBKIM-Siegel. Self-Inscribing als Aussteller-Modell, lebendes Dokument als Aspekte-Pfad. Anlass: Klaus' geplante App-Freigabe — Vertrauens-Signal für Forker und Endnutzer. Detail-Spec ausstehend (Spec-Sitzung 16). |
| Spec gefüllt | 2026-05-24 | Spec-Sitzung 16 | Karte 16 vollständig gefüllt — alle vier Sub-Bereiche final, Schnittstelle (`window.SbkimSiegel = {init, isCertified, getExplanation, getCertifiedModules, getAspects, _meta}`), Persistenz RAM-only (Variante A, kein `DB_VERSION`-Bump), Sichtbarkeits-Modi `"visible"`/`"hidden"` (kein `"compact"` in Stufe 1), `ZERTIFIKAT_ASPEKTE`-Schema mit Start-Eintrag „Grund-Siegel-Bezeugung 2026-05-24", `PFLICHT_MODULE`-Liste mit sieben Modulen (01/02/03/04/05/07/15) + Surface-Funktions-Anker pro Modul (`getOwnSpore`/`embedPassage`/`match`/`handshake`/`prepareSelfApoptose`/`init`/`init`) + Lazy-Tolerator für Modul 03 (Sage-Page-spezifisch lazy-loaded). Anti-Greenwashing binär, Aussteller-Klärung verbindlich zwei Zeilen (KEIN Disclaimer-Schwall, Klaus-Korrektur). DOM-Anker `#sbkim-siegel-badge` als vierte Plakette nach FREMD-Lampe, 40 px-Medaillon Edel-Gold (`#C9A961`) auf Bronze-Ink (`#1A1306`), Serif-System-Fallback (`'Spectral','Georgia',serif`, kein Pflicht-Google-Font), Wappen-Skelett (drei Hyphen-Bögen + zentraler Knoten-Punkt). Modal eigenständig in `document.body` (analog Modul 15), wertigere Typografie (Serif für Titel + Klausel, Geist für Daten-Listen). INTERFACES.md §1 Modul 16 voll gespiegelt; §0 unverändert (Modul 16 hat keine globalen Konstanten). **Kein Modul-Code, kein `index.html`-Eingriff, kein Sichttest** — Bau-Sitzung 16 nächster Schritt. Brief: `docs/sessions/BRIEF_BAU_16_SIEGEL.md`. |
| Code geschrieben | 2026-05-24 | Bau-Sitzung 16 | `src/modules/16_siegel.js` voll angelegt (Public Surface `init/isCertified/getExplanation/getCertifiedModules/getAspects/_meta`, `PFLICHT_MODULE` mit sieben Einträgen, `ZERTIFIKAT_ASPEKTE` mit Start-Eintrag „Grund-Siegel-Bezeugung 2026-05-24", Surface-Check + binärer Fail-Modus, Badge-Mount mit Option β + MutationObserver-Re-Try analog Modul 00, Modal-Mount in `document.body` analog Modul 15, First-Boot-Animation einmalig pro Session, Repo-URL Auto-Erkennung + Override, nüchterne zweizeilige Aussteller-Klärung, KEINE benannten Error-Klassen — alle Fehlerpfade fail-soft via `console.warn`). `index.html` erweitert (`:root` mit vier neuen `--siegel-*`-Variablen, Badge-CSS-Block inkl. `@keyframes siegel-first-boot`, `<script src="src/modules/16_siegel.js">` vor `sbkim-init.js`). `sbkim-init.js` ergänzt um `SbkimSiegel.init({badgeSelector:".lamps"})`-Aufruf nach `SbkimMembrane.init`. Panel 16 in `tests/manual_check.html` mit acht Knöpfen (Setup + Tests 1–6 + Hinweis-Knöpfe 7/8 + Selbstcheck-Hinweis). **Bauzustands-Wahl Option β:** `badgeSelector` zeigt auf einen CONTAINER (Default `.lamps`); Modul-Code erzeugt das `<span id="sbkim-siegel-badge">`-Element via JS darin — ausschließlich wenn `isCertified()===true`. Damit ist die Anti-Greenwashing-Klausel binär erfüllt (kein DOM-Element überhaupt im Negativ-Fall, kein `display:none`-Workaround nötig). Wenn der Selektor ein bereits-existierendes Element mit `id="sbkim-siegel-badge"` matcht, nutzt das Modul dieses Element als Anker (Rückwärts-Kompat für Endknoten, die später ihren Header-Badge inline einbauen wollen). **Headless-Smoke 32/32 grün** (14 Happy-Path + 10 Anti-Greenwashing-Fail + 8 Hidden-Mode/Override). Sichttest ausstehend — wartet auf Klaus' Browser-Lauf in der Sage-Page + Panel 16 in `tests/manual_check.html`. |
| Spec-Erweiterung Sub (e) + Aspekt 4 | 2026-05-26 | Tafel-Spec-Pflege Mycel-Vision | Klaus' Vision-Klärung 2026-05-26: zweistufiger SIEGEL — Bronze („Mycel suchend") und Gold („Mycel verbunden"). Löst Henne-Ei-Problem (ohne SIEGEL → kein Andocken; ohne Andocken → kein Voll-SIEGEL). Karte 16 erweitert: § Sub (e) Mycel-Verbindungs-Stufe voll spec'd (`SiegelStufe = "bronze"|"gold"`, Modul-16-Listener auf `sbkim:handshake outcome:"established"`, `_meta.mycelConnected` RAM-only, visuelle Unterscheidung gedämpfter Bronze-Ton + saturate-0.6-filter + Tooltip-Variante + Stufenwechsel-Animation 600 ms, Klick-Verhalten in Bronze öffnet Modul-18-Andock-Geste mit Hinweis-Block, RAM-only-Persistenz analog Modul 16); § Sub (d) Aspekte-Liste erweitert um Aspekt 4 „Mycel-Verbindung etabliert (erster Handshake)" mit dynamischer Render-Variante (Aspekt 4 ist der einzige Eintrag, der vom `sbkim:handshake`-Listener aktiviert wird, vorher als „pending" markiert sichtbar); § Strikte Tabus Klausel „Keine Stufen-Varianten" auf „Bronze/Gold-Stufung erlaubt seit 2026-05-26" angepasst (Tafel-Anpassung mit explizitem Anpassungs-Antrag, Silber/Platin bleiben verboten — zwei Stufen entsprechen aktiver Bedeutung, drei wären Marketing-Hierarchie). **`status.json` Modul 16 bleibt `score:"stub"`** — additive Spec-Erweiterung, Bau-Sitzung 16 Sub (e) folgt mit Code. PROTOCOL_VERSION bleibt `"0.1"`. INTERFACES.md §1 Modul 16 voll gespiegelt + § 10 Änderungsprotokoll-Eintrag. |
| Wappen-Wechsel + Korona-Redesign | 2026-05-24 | Mini-Pflege (Klaus-Wunsch im Anschluss an Bau 16) | Auf Klaus' Wunsch das initiale „drei Hyphen-Bögen + Knoten-Punkt"-Skelett-Wappen aus Spec-Sitzung 16 § Sub (b) durch das vollwertige **Ritterschild-Auszeichnungssiegel** ersetzt (Klaus aus einer parallelen Claude-Chat-Sitzung mitgebracht): Gold-Ring + Navy-Interior + Bandschriftzug „OFFIZIELLE BESTÄTIGUNG" oben + Wortmarke „SBKIM SIEGEL" + drei Untermedaillons (Schild / Mycel-Baum / Unendlichkeit) + Bodenband „SELF-INSCRIBING". **Korona-Redesign** auf Klaus' Anschluss-Wunsch: die ursprünglichen Gold-Sonnenstrahlen aus dem mitgebrachten SVG ersetzt durch eine **Akkretions-Disk-Korona im `.bh-disk`-Stil** der Sage-Page-Schwarzes-Loch-Karte (`index.html:498` conic-gradient orange → gold → magenta → blau → türkis → orange). Im SVG umgesetzt als zwölf 30°-Arc-Segmente außerhalb des Gold-Rings (Radius 475, Stroke 60), mit `feGaussianBlur stdDeviation=22` zu einer smoothen Conic-Anmutung verschmolzen; dazu eine zweite, schmalere Innen-Schicht (Radius 460, Stroke 32, Blur 14) analog `.bh-disk-2`. Source of truth: `assets/sbkim-siegel-wappen.svg` (eigenständig editierbar, mit Inline-Kommentar-Anker im Korona-Block); `src/modules/16_siegel.js` enthält dieselbe SVG-Quelle als `WAPPEN_SVG`-Konstante (Konvention: beide Stellen synchron halten). `index.html` Badge-CSS bereinigt — Radial-Gradient-Background + Border + Inset-Shadow entfernt (das SVG bringt jetzt seinen eigenen Gold-Ring + Navy-Interior mit), `:focus-visible` + Hover-Glow + `@keyframes siegel-first-boot` bleiben (Hover-Effekt jetzt via `drop-shadow`-Filter, weil das Badge transparent ist). Headless-Smoke 15/15 grün (Wappen im DOM, Korona-Filter aktiv, drei Untermedaillons da, alte Hyphen-Bögen entfernt). **Bedeutungs-Klärung** (Klaus' Anmerkung „nicht ganz klargekommen mit dem Sinn"): das neue Wappen trägt seine Bedeutung explizit im Bild — „SBKIM SIEGEL" + „SELF-INSCRIBING" als Wortmarken im Bild selbst, drei Untermedaillons als visuelle Anker für Sicherheits-Schild / Mycel-Geflecht / Unendlichkeit. Sichttest ungeprüft (wartet auf Klaus' Browser-Lauf nach Pull). |
| Bau Sub (e) Bronze/Gold-Stufung | 2026-05-26 | Bau-Sitzung 16 Sub (e) | Pipeline-Phase A Schritt 5g. Karte 16 § Sub (e) Mycel-Verbindungs-Stufe voll implementiert. **`src/modules/16_siegel.js` additiv erweitert** (KEIN Bruch der bestehenden Surface, KEIN Refactoring): Closure-State `mycelConnected:false`/`mycelConnectedAt:null` (RAM-only, Tab-Reload startet wieder Bronze — gewollt); closure-interne `siegelStufe()`-Funktion (gibt `"bronze"` oder `"gold"`); `applyStufeToBadge()`-Helper setzt `data-stufe`-Attribut + stufen-spezifisches `aria-label` (Bronze: „SBKIM-Siegel · Mycel suchend", Gold: „SBKIM-Siegel · Mycel verbunden") + entfernt `title`-Attribut (Pflege 17 Tooltips, Doppel-Tooltip-Problem auf DeX-Chrome); `playStufenwechselAnimation()` setzt `stufenwechsel-gold`-Klasse für 600 ms; window-Event-Listener `sbkim:handshake` mit `outcome:"established"`-Filter (idempotent + fail-soft via `event?.detail?.outcome !== "established"` → no-op); `_resetMycelConnectedForTest()`-Test-Brücke (Panel 16 Knopf 12 + Smoke-Test). **`ZERTIFIKAT_ASPEKTE`** um Aspekt 4 „Mycel-Verbindung etabliert (erster Handshake)" am Listen-Ende ergänzt (`since:"2026-05-26"`, `module:"16"`, mit dynamischer Render-Variante: in Bronze als „pending"-Marker, in Gold mit Datum). **Modal-Erweiterung**: neuer `bronzeHinweisBlock` zwischen Header und Datum-Zeile, nur sichtbar in Bronze-Stufe; enthält Hinweis-Text + `[Andocken]`-Knopf mit Fail-soft-Check `typeof window.SbkimToolPwa?.openAndockTab === "function"` (bei Fehlen Info-Notiz „Modul 18 noch nicht verfügbar — Andocken via Sage-Page-Andock-Wizard."); Aspekt-4-Pending-Marker im Aspekte-Render (`isAspect4(a)` + `mycelConnected===false` → since-Span zeigt „pending" mit italic + grauem Text statt Datum). Stufenwechsel triggert `renderModalContents()`-Refresh wenn Modal offen. **`index.html` additiv erweitert**: zwei neue `:root`-Variablen `--siegel-bronze: #8C6E2F` + `--siegel-bronze-glow: rgba(140,110,47,0.45)`; drei neue CSS-Regeln `#sbkim-siegel-badge[data-stufe="bronze"]` (mit `filter:saturate(0.6) brightness(0.85)`), `#sbkim-siegel-badge[data-stufe="gold"]` (Default-Render, kein Override), `#sbkim-siegel-badge.stufenwechsel-gold` (`@keyframes siegel-stufenwechsel-gold` 0→1.15→1.0 mit Gold-Glow-Box-Shadow + Drop-Shadow). **`tests/manual_check.html` Panel 16 um vier Knöpfe erweitert** (Test 9 Sub-(e)-Bronze-Initial, Test 10 synthetischer Handshake → Gold + Stufenwechsel, Test 11 Idempotenz, Test 12 Bronze-Klick → Modal-Hinweis-Block + [Andocken]). **Headless-Smoke** `tests/smoke_bau16_sub_e_bronze.mjs`: 15 Proben, **15/15 grün** (Public Surface + Test-Brücke + mycelConnected-Initial-State + Bronze-Initial-Badge + Aspekt 4 in Liste + Stufenwechsel + ISO-Datum + Idempotenz + outcome:"rejected"-no-op + dispatch ohne detail + detail:null + Reset Gold→Bronze + Modal-Bronze-Hinweis-Block + Modal-Gold-Refresh + Fail-soft Andock-Click). **Regression** smoke_bau04a 19/19 + smoke_bau04b 30/30 + smoke_bau04c 43/43 + smoke_bau15b 31/31 + smoke_bau17 32/32 grün. **node --check** für 16_siegel.js + alle 13 Inline-`<script>`-Blöcke in `tests/manual_check.html` grün. **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump** (Sub (e) ist additiv, RAM-only). **KEIN Modul-05/17/18-Code-Eingriff** (Sub (e) konsumiert nur den `sbkim:handshake`-Custom-Event, der seit Bau 17 existiert; Modul 18 fail-soft-Check). **KEIN Endknoten-Eingriff** (Pipeline-Schritt 5e Re-Aktivierung folgt). **`status.json` Modul 16 bleibt `score:"stub"`** bis Klaus' Sichttest 9–12 grün (analog Konvention 04.B/04.C). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf Panel 16 Knöpfe 9–12. |
| Sichttest Sub (e) | 2026-05-26 | Sichttest 16 Sub e | **4/4 grün** (Klaus, DeX-Chrome auf Galaxy Tab S6, Termux `python3 -m http.server 8000` nach Hard-Reload). Panel 16 Knöpfe 9–12 alle live grün: Knopf 9 (Bronze-Initial) `badge_data_stufe:"bronze"` + `aria_label:"SBKIM-Siegel · Mycel suchend"` + `title:null` (Doppel-Tooltip-Pflege 17 wirkt) + `mycel_connected:false` + `mycel_connected_at:null` + `siegel_stufe_getter:"bronze"`. Knopf 10 (Bronze→Gold via synthetischem Handshake, zweimal geklickt — beide grün dank `_resetMycelConnectedForTest`-Idempotenz): `stufe_vor:"bronze"` → `stufe_nach:"gold"`, `aria_label_nach:"SBKIM-Siegel · Mycel verbunden"`, `mycel_connected_nach:true`, `mycel_connected_at_nach:"2026-05-26T16:27:22.973Z"`, `klasse_stufenwechsel_gold:true`. Knopf 11 (Idempotenz — zweiter Handshake ändert nichts): `erste_welle === zweite_welle === "2026-05-26T16:27:56.565Z"`, `datum_unveraendert:true`, `klasse_nach_zweitem_dispatch:false`, `stufe_nach_zweitem_dispatch:"gold"`. Knopf 12 (Bronze-Klick öffnet Modal-Hinweis-Block + [Andocken]): `modal_offen:true`, `hinweis_block_im_dom:true`, `hinweis_block_sichtbar:true`, `andock_button_im_modal:true`, `aspekt_4_pending_marker:true`, `letzter_aspekt_text_kopf:"pending· 16· Mycel-Verbindung etabliert (erster Handshake)…"`, `aspekte_anzahl:4`. **Cross-Knoten-Handshake-Hook live wirksam.** Sichttest Knöpfe 1–8 (Bau-16-Basis) weiterhin ungeprüft. |
| Sichttest | — | Sichttest 16 | folgt (Klaus, Sage-Page Badge sichtbar + Modal öffnet sich + First-Boot-Animation + Aussteller-Klärung) |
| Pflege Modal-Local-Time | 2026-05-26 | Pflege 16 Modal-Local-Time (Sub-(e)-Folge-Pflege 3/3) | Folge-Pflege zum Endknoten-Sichttest Cross-Knoten Sub (e) 2026-05-26 (Folge-Befund 3). Klaus' Befund DeX-Chrome (MESZ, UTC+2): „Datum/Uhrzeit ist nicht aktuell, ich vermute nicht Mitteleuropäische Zeit, eher Amerikan." Ursache: `renderModalContents()` in Modul 16 baute den `dateLine.textContent` per `new Date(snap.certifiedAt).toISOString().slice(0, 10)` + `iso.slice(11, 16)` — UTC-ISO-Substrings, daher zeigte das Modal Klaus' lokales 21:10 MESZ als „19:10 Uhr" (UTC). **Fix in `src/modules/16_siegel.js` Zeile ~872–885** (sehr klein, additiv): UTC-ISO-Slice ersetzt durch lokale `Date`-Methoden — `date.getFullYear()` / `String(date.getMonth() + 1).padStart(2, "0")` / `getDate()` / `getHours()` / `getMinutes()`. Format-Konvention `YYYY-MM-DD, HH:MM Uhr` bleibt (ISO-Datum + lokale Stunden/Minuten — kein Optik-Wechsel auf `toLocaleString("de-DE", {dateStyle, timeStyle})`-Style, weil Klaus' Doku-Pattern überall ISO-Datum verwendet). Fail-soft-Fallback: falls `new Date(certifiedAt)` `NaN` ist (kaputter ISO-String), wird der Roh-`certifiedAt` direkt angezeigt. `_meta.certifiedAt` bleibt UTC-ISO (Spec-Vertrag aus § Persistenz unverändert — nur die Render-Schicht konvertiert). **Karte 16 § Sub (c) Modal-Body Punkt 1** um Anzeige-Konvention-Block erweitert (lokale Date-Methoden statt UTC-ISO-Slice, Begründung Klaus' MESZ-Befund). **Headless-Smoke** `tests/smoke_bau16_sub_e_bronze.mjs` um Probe 16 (Modal-Datum aus lokalen Date-Methoden — Test verifiziert Konsistenz `dateLine.textContent` mit `getHours():getMinutes()` aus der Laufzone), **16/16 grün**. **Regression** smoke_bau15b 31/31 + smoke_bau17 36/36 grün. **node --check** Modul 16 grün. **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump** (Render-Pflege, additiv). **KEIN funktionaler Vertrags-Eingriff** — `_meta.certifiedAt`-Format unverändert. **KEIN ZERTIFIKAT_ASPEKTE-Eintrag** (Render-Schicht-Pflege, kein Sicherheits-Modul-Update). **KEIN Endknoten-Eingriff** (Mein-Rezeptbuch + Mein-Mixarium ziehen den neuen Modul-16-Code in eigener Folge-Pflege nach — kombinierbar mit den anderen zwei Sub-(e)-Folge-Pflegen Modul 17 + Modul 05). **KEINE Tafel-Umsortierung CLAUDE.md**. `status.json` Modul 16 unverändert (`score:"stub"`; Pie nicht regeneriert). Brief: `docs/sessions/BRIEF_PFLEGE_16_MODAL_LOCAL_TIME.md`. Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf nach Endknoten-Update + Modal-Click in der lokalen MESZ-Zone. |
| In Endknoten eingebaut | 2026-05-26 | Endknoten-Migration Sub (e) Bronze/Gold (MR PR #249 + MM PR #58) | **Live in beiden Endknoten** (Mein-Rezeptbuch + Mein-Mixarium). Re-Aktivierung Modul 15+16+17+sw aus Sage-`main` (Commit `fe011d1`) inkl. Sub-(e)-Bronze/Gold-Code; `sbkim-init.js` um `SbkimMembrane.init` + `SbkimSiegel.init({badgeSelector:"#sbkim-siegel-badge", repoUrl:…})` nach `SbkimWidget.init` erweitert. **Folge-Pflege Konfig-Bug:** Sage-Default `badgeSelector:".lamps"` ist Sage-Page-spezifisch und matcht im Endknoten nicht → Badge-Mount übersprungen → kein Modal. Fix-PRs (MR + MM): explizit `badgeSelector:"#sbkim-siegel-badge"` (Widget-Proxy-Anker aus Bau 17 Modal-Bridge-Option 1). Briefe: `BRIEF_REAKTIVIERUNG_ENDKNOTEN_MR.md` + `BRIEF_REAKTIVIERUNG_ENDKNOTEN_MM.md` (PR #182 gemerged). **Cross-Knoten-Sichttest 2026-05-26 (Klaus, DeX-Chrome auf Galaxy Tab S6, BroadcastChannel-Bridge zwischen MR + MM):** Initial-Bronze in beiden Endknoten visuell + Eruda-`_meta.siegelStufe:"bronze"`; Modal öffnet sich nach Click; Bronze-Hinweis-Block sichtbar + `[Andocken]`-Knopf mit Info-Notiz „Modul 18 noch nicht verfügbar"; Aspekt 4 zeigt „pending"-Marker statt Datum. Live-Cross-Knoten-Handshake via Eruda `SbkimAnastomose.handshake(peerSpore, ownVec)` ergibt `outcome:"established", score:0.9544` (BroadcastChannel-Path automatisch via Modul 05 BC-Bridge); VERKEHR-Slot in MM-Widget zeigt `handshake outgoing established`-Event. **Manueller `window.dispatchEvent("sbkim:handshake", outcome:"established")`-Dispatch in beiden PWAs ergibt `_meta.siegelStufe:"gold"` + `mycelConnected:true`** + Modal-Refresh (Bronze-Hinweis-Block weg, Aspekt 4 datiert auf 2026-05-26). **Sub (e) funktional komplett bewiesen** in beiden Endknoten. **Drei eigenständige Folge-Befunde** (separate Pflegen — siehe Briefe): (1) Visueller Widget-SIEGEL-Slot-Stufung Bronze/Gold fehlt (Modul 17 rendert Slot immer als gold-medaillon — `data-stufe`-Attribut landet am unsichtbaren Proxy-Span); (2) Endknoten-`sbkim/05_anastomose-v2.js` ist prä-Bau-17 und dispatcht KEIN `sbkim:handshake`-window-Event automatisch beim erfolgreichen Cross-Knoten-Handshake (manueller dispatch nur als Workaround); (3) Modal-Datum „Bezeugt seit … Uhr" zeigt UTC statt MESZ-lokal (Modul 16 `certifiedAt` wird ohne `toLocaleString` gerendert). Sichttest Knöpfe 1–8 (Bau-16-Basis) bleiben weiterhin ungeprüft. |
| Pflege Bronze-Modal-Close | 2026-05-28 | Pflege 16 Bronze-Modal-Close-on-Andock | Folge-Pflege zu MR-Modul-18-Einbau (Mein-Rezeptbuch PR #252 gemergt 2026-05-28). Klaus' Sichttest-Befund: Bronze-SIEGEL-Klick öffnet Modul-16-Modal → `[Andocken]`-Klick öffnet zwar Modul-18-Andock-Wizard korrekt, **aber das Bronze-Modal bleibt darunter offen — zwei Modale übereinander, schlechtes UX**. **Fix:** in `src/modules/16_siegel.js` `andockBtn`-Click-Handler (~Z. 838-857) NACH `try/catch` um `toolPwa.openAndockTab()` und VOR dem `return` einen Aufruf von `closeModal()` ergänzen. Erfolgreicher Andock-Pfad (Modul 18 da, `openAndockTab` aufrufbar) schließt jetzt das Bronze-Modal automatisch; der **Fallback-Pfad** (Modul 18 fehlt) lässt das Modal absichtlich OFFEN, damit der User die Info-Notiz „Modul 18 noch nicht verfügbar — Andocken via Sage-Page-Andock-Wizard" noch lesen kann. Karte 16 § Sub (e) Klick-Verhalten um Klarstellungs-Zeile erweitert. Headless-Smoke `tests/smoke_bau16_sub_e_bronze.mjs` weiterhin 16/16 grün. **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump** (UI-Fix, keine Schema-Änderung). **KEIN ZERTIFIKAT_ASPEKTE-Eintrag** (Render-Schicht-Pflege, kein Sicherheits-Modul-Update). **KEIN Eingriff in Modul 15/17/18/Storage**. **KEIN Eingriff in den Fallback-Pfad** (Info-Notiz-Branch unverändert). Übergabe: `2026-05-28_pflege-modul-16-bronze-modal-close.md`. Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf Panel 16 + Live-MR-Tab. Endknoten ziehen die neue Modul-16-Datei in eigener Sync-Sitzung nach Sichttest grün. |
| Pflege Sage-Init Modul 18 + Drei-Pfad | 2026-05-28 | Pflege Sage-Init Modul 18 + Drei-Pfad-Verhalten Modul 16 | Wurzel-Fix zu Klaus' Sage-Page-Sichttest 2026-05-28 18:35 nach PR #197 (Bronze-Modal-Close): Bronze-Modal verschwand korrekt, **aber Modul-18-Andock-Wizard öffnete nicht**. Wurzel-Diagnose: PR #197 schloss das Modal IMMER nach `openAndockTab()` — auch wenn der Aufruf `ToolPwaNotReadyError` warf. Sage-`sbkim-init.js` lud zwar das Modul-18-Skript, rief aber `SbkimToolPwa.init()` nie auf (ursprüngliches Bau-18-Brief-Tabu „kein Sage-init"). Klaus' Klärung 2026-05-28: „Sage ist selber auch ein Endknoten" — `sbkim/spore.json` bestätigt `nodeType:"hybrid"`. **Tafel-Evolution** (CLAUDE.md § Tafel-Evolutions-Klausel): Bau-Sitzung-18-Brief-Tabu durch Klaus' aktuelle Festlegung überschrieben. **Zwei Eingriffe:** (A) `sbkim-init.js` um `SbkimToolPwa.init({…Sage-Spore-Werte…})`-Block nach `SbkimSiegel.init` ergänzt — endpoint Sage-Pages-URL, domain „Mycel-Bibliothek", domainKeywords + stammCategories + guestCategories aus eigener Spore, `repoUrl` Sage-Repo, `externalHubUrl` weggelassen (Read-Anker Sub i). (B) `src/modules/16_siegel.js` `andockBtn`-Click-Handler von **Zwei-Pfad** auf **Drei-Pfad** erweitert: Pfad 1 Erfolg → `closeModal()` (analog PR #197); **Pfad 2 NEU** → Throw-Erkennung (`threw=true` in `try/catch`), Modal BLEIBT OFFEN + Info-Hinweis „Modul 18 ist geladen, aber im Andocker nicht initialisiert (SbkimToolPwa.init() fehlt)" für `ToolPwaNotReadyError` (generischer Hinweis für andere Throws); Pfad 3 Fallback → bestehender `BRONZE_HINWEIS_HTML_FALLBACK` für komplett fehlendes Modul 18. Karte 16 § Sub (e) Klick-Verhalten Block „Bronze-Modal schließt sich…" durch volles Drei-Pfad-Verhalten-Block ersetzt mit Hintergrund-Begründung (PR-#197-Lücke + Tafel-Evolution). Headless-Smoke `tests/smoke_bau16_sub_e_bronze.mjs` **16/16 grün** (Drei-Pfad ist UX-Verhalten, Stufenwechsel + Aspekt-4-Render unverändert). `node --check` für 16_siegel.js + sbkim-init.js grün. **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump** (UX-Fix + init-Hinzufügung, keine Schema-Änderung). **KEIN ZERTIFIKAT_ASPEKTE-Eintrag** (Render- + Init-Pflege, kein Sicherheits-Modul-Update). **KEIN Eingriff in Modul 15/17/18-Code** (Modul-18-Surface unverändert; nur Init-Aufruf im Andocker hinzu). **KEIN externer Repo-Eingriff** (MR-Sync + MM-Combined-Sync sind eigene Folge-Sitzungen). Übergabe: `2026-05-28_pflege-sage-init-modul-18.md`. Sichttest ungeprüft — wartet auf Klaus' Sage-Page-Hard-Reload + Bronze-`[Andocken]`-Klick (erwartet: Bronze weg + Andock-Wizard mit Stepper-Schritt 1). |

---

**Querverweise**

- **Abhängigkeiten:** Modul 01 / 02 / 03 / 04 / 05 / 07 / 15 — Pflicht-
  Surface für Selbst-Prüfung. Modul 16 ruft KEINE Funktion dieser
  Module auf — nur `typeof`-Check ihrer globalen Namensräume. Damit
  ist Modul 16 entkoppelt; ein Pflicht-Modul-Fehler bricht nur die
  Bezeugung, nicht den 16er-Lauf.
- **Wird genutzt von:** Endnutzer (Vertrauens-Signal beim ersten Page-
  Load) · Forker (Build-Selbst-Check ohne CI-Pipeline) · Klaus selbst
  (Sichtbarmachung der Pflicht-Modul-Integration vor App-Freigabe) ·
  künftiges Modul 10 Reputation (Hook: Siegel-Daten als Anfangs-
  Trust-Signal beim Handshake — eigene Spec-Sitzung 10)
- **Hook-Punkte (nur Verweis, nicht implementiert):** Modul 15 Sub (a)
  `read()` soll in Spec-Sitzung 15.B das Siegel im Snapshot mitliefern
  (`siegel: {isCertified, repoUrl, certifiedModules}`). Modul 02 Spore
  könnte einen optionalen `siegel`-Feld im Spore-Schema dazu bekommen
  — **bewusst ABGELEHNT in dieser Spec**: das Siegel ist eine PWA-
  lokale Bezeugung, kein Netz-Signal. Wer das Siegel im Netz sichtbar
  machen will, baut Modul 10 Reputation, NICHT eine Spore-
  Erweiterung.
- **Site-Karte:** Sage-Page Karten 4 / 13 / 14 ziehen `siegelBacklog[]`
  parallel zu `schutzBacklog[]` / `diffusionBacklog[]` /
  `membranBacklog[]` — eigene Folge-Pflege-Sitzung, falls Klaus die
  Bauzustands-Sichtbarkeit der Karte 16 in der Sage-Page möchte (kein
  Block für die App-Freigabe).
- **Paper:** `sbkim_paper.pdf` Kap. 1 (Empfangsmodus-Prinzip — Self-
  Issued statt Hub-Aussteller passt zum dezentralen Geist) · Kap. 6
  (Geflecht-Außenkontakt — die Bezeugung ist ein Außenkontakt-Signal,
  keine Innen-Schicht)
- **Verwandt:** [Modul 15](15_membran.md) (Außen-Schicht, parallel —
  Membran-Lampe zeigt Fremdzugriff, Siegel zeigt Selbst-Bezeugung;
  beide leben in der Navleiste) · [Modul 09](09_einbau_pwa.md) (Andock-
  Schritt 10 ergänzt Siegel-Anker pro Endknoten-PWA) · [Modul 00](00_doku_fenster.md)
  (Modal-Verhalten als loses Vorbild, aber 16 nutzt eigenes Modal,
  keine 00-Wiederverwendung) · [Modul 02](02_spore.md) (Spore-Schema
  bewusst NICHT erweitert — siehe Hook-Punkte oben)
