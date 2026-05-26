# Übergabeprotokoll — 2026-05-26 · Bau-Sitzung 16 Sub (e) Bronze/Gold-Stufung

**Sitzungs-Rolle:** Bau-Sitzung. Branch
`claude/bau-16-sub-e-bronze-1UeT1`. Pipeline-Phase A Schritt 5g.
Brief: PR #179 / `BRIEF_BAU_16_SUB_E_BRONZE.md`.

---

## Was getan

### Block 1: Modul-Code-Erweiterung `src/modules/16_siegel.js`

Additiv (KEIN Bruch bestehender Public-Surface, KEIN Refactoring):

- **Closure-State**: `mycelConnected:false`, `mycelConnectedAt:null`,
  `handshakeListener:null`, `stufenwechselTimeoutId:null`. RAM-only —
  Tab-Reload startet wieder Bronze (gewollt; Karte 16 § Sub (e)
  Persistenz).
- **Closure-interne Helper** (KEIN export auf public surface):
  - `siegelStufe()` — gibt `"bronze"` (`mycelConnected===false`) oder
    `"gold"` (`true`).
  - `applyStufeToBadge()` — setzt `data-stufe`-Attribut + stufen-
    spezifisches `aria-label` (Bronze: „SBKIM-Siegel · Mycel
    suchend", Gold: „SBKIM-Siegel · Mycel verbunden"), entfernt
    `title`-Attribut (Pflege 17 Doppel-Tooltip-Klausel).
  - `playStufenwechselAnimation()` — setzt CSS-Klasse
    `stufenwechsel-gold` für 600 ms.
  - `onHandshakeEvent(event)` — idempotent + fail-soft Handler:
    `event?.detail?.outcome !== "established"` → no-op (kein Throw
    bei fehlendem detail / null); bei established setzt
    mycelConnected=true + mycelConnectedAt=ISO + ruft
    applyStufeToBadge + playStufenwechselAnimation; refresh
    renderModalContents wenn Modal offen.
  - `registerHandshakeListener()` — registriert window-Event-
    Listener für `sbkim:handshake`. Idempotent.
  - `isAspect4(a)` — eindeutige Identifikation des Aspekt-4-Eintrags
    (`since:"2026-05-26"` + `module:"16"` + aspect mit
    „Mycel-Verbindung etabliert"-Präfix).
- **`mountBadge()`** um EINE Zeile erweitert: `applyStufeToBadge()`
  vor `attachBadgeClickHandler` + `playFirstBootAnimation`.
- **`init()`** um EINE Zeile erweitert: `registerHandshakeListener()`
  vor dem `ready=true`-Flag (Listener registriert sich nach Badge-
  Mount, nur bei grünem Surface-Check).
- **`buildBadgeElement()`** setzt initiales `aria-label` auf
  `ARIA_LABEL_BRONZE` + KEIN `title`-Attribut mehr.
  Auch im `anchor.id === BADGE_ID`-Pfad das title-Setzen entfernt.
- **`mountSiegelModal()`** um `bronzeHinweisBlock` zwischen Header
  und dateLine erweitert (display:none Default).
- Neuer Helper **`renderBronzeHinweisBlock(modalRoot)`**: in
  Gold-Stufe display:none, in Bronze display:block; enthält
  Hinweis-Text + `[Andocken]`-Knopf mit fail-soft-Check
  `global.SbkimToolPwa?.openAndockTab` (bei Fehlen Info-Notiz
  „Modul 18 noch nicht verfügbar — Andocken via Sage-Page-Andock-
  Wizard.").
- **`renderModalContents()`** aspectsList-Loop um Aspekt-4-Pending-
  Marker erweitert: `isAspect4(a) && mycelConnected !== true` →
  since-Span zeigt „pending" italic + grau statt Datum.
- **`ZERTIFIKAT_ASPEKTE`** um Aspekt 4 am Listen-Ende ergänzt
  (`since:"2026-05-26"`, `module:"16"`, `aspect:"Mycel-Verbindung
  etabliert (erster Handshake)"`).
- **Test-Brücke** `_resetMycelConnectedForTest()` (Test-only,
  ausschließlich Panel-Knopf-12 + Smoke-Test). Reset auf Bronze
  + Modal-Refresh wenn offen.
- **`_meta`** um drei Live-Getter erweitert: `mycelConnected`
  (boolean), `mycelConnectedAt` (string|null ISO-8601), `siegelStufe`
  (`"bronze"|"gold"`).

### Block 2: CSS-Erweiterung in `index.html`

Additiv:

- Zwei neue `:root`-Variablen:
  `--siegel-bronze: #8C6E2F` + `--siegel-bronze-glow: rgba(140,110,47,0.45)`.
- Drei neue CSS-Regeln im Badge-Block:
  - `#sbkim-siegel-badge[data-stufe="bronze"]` mit
    `filter: saturate(0.6) brightness(0.85);`
  - `:hover`-Variante mit Bronze-Glow-Drop-Shadow.
  - `[data-stufe="gold"]` als no-op-Anker.
  - `.stufenwechsel-gold` mit `animation: siegel-stufenwechsel-gold
    600ms ease-out;`
- Neuer `@keyframes siegel-stufenwechsel-gold` (0→1.15→1.0 mit
  Gold-Glow-Box-Shadow + Drop-Shadow-Filter im Mittelpunkt).

### Block 3: Panel 16 in `tests/manual_check.html`

Vier neue Test-Knöpfe (additiv, alte Knöpfe 1–8 unverändert):

- **Knopf 9** — Sub (e) Bronze-Initial: prüft data-stufe=bronze +
  aria-label „Mycel suchend" + KEIN title-Attribut + mycelConnected=
  false + mycelConnectedAt=null.
- **Knopf 10** — Synthetischer Handshake → Gold: dispatcht
  `sbkim:handshake outcome:"established"`, prüft data-stufe=gold +
  aria-label „Mycel verbunden" + mycelConnected=true + ISO-Datum +
  CSS-Klasse `stufenwechsel-gold` direkt nach Dispatch.
- **Knopf 11** — Idempotenz: zweiter Dispatch (nach 750 ms Warten
  bis Stufenwechsel-Klasse weg) → mycelConnectedAt UNVERÄNDERT +
  keine zweite Animation + Badge bleibt Gold.
- **Knopf 12** — Bronze-Klick öffnet Modal: Reset auf Bronze via
  Test-Brücke, dann Click; prüft data-siegel-bronze-hinweis-Block
  sichtbar (display!=none) + [Andocken]-Knopf da + Aspekt 4 in
  Aspekte-Liste mit „pending"-Marker.

Panel-16-Header-Text um Bau-16-Sub-(e)-Block erweitert.
Selbstcheck-Hinweis-Knopf um Hinweis auf Knöpfe 9–12 erweitert.

### Block 4: Headless-Smoke + Doku-Pflege

- **`tests/smoke_bau16_sub_e_bronze.mjs`** (Node 22) mit minimalem
  DOM-Stub inkl. Descendant-Combinator-Support (z.B.
  `[data-siegel-aspects] li`) + textContent-Getter/Setter (für
  `textContent=""`-leeren von children): 15 Proben, **15/15 grün**.
  Probengruppen: 1 Public Surface + Test-Brücke, 2 Vor-init-State,
  3 init grüner Surface-Check + Badge im DOM, 4 Bronze-Initial-
  Badge-Attribute (data-stufe + aria-label + KEIN title), 5
  ZERTIFIKAT_ASPEKTE-Aspekt-4-am-Ende, 6 Handshake → Gold +
  CSS-Klasse, 7 mycelConnectedAt ISO-8601, 8 Idempotenz, 9
  outcome:"rejected" no-op, 10 dispatch ohne detail no-op, 11
  detail:null no-op, 12 Reset Gold→Bronze, 13 Modal-Bronze-Hinweis
  sichtbar + Andock-Knopf + Aspekt-4 pending, 14 Modal nach Gold:
  Hinweis aus + Datum, 15 fail-soft Andock-Click → Info-Notiz.
- **Regression**: smoke_bau04a 19/19 + smoke_bau04b 30/30 +
  smoke_bau04c 43/43 + smoke_bau15b 31/31 + smoke_bau17 32/32 grün.
- **node --check** für `16_siegel.js` + alle 13 Inline-`<script>`-
  Blöcke in `tests/manual_check.html` grün.
- **Karte 16** § Bauzustand neue Zeile „Bau Sub (e) Bronze/Gold-
  Stufung 2026-05-26" + neue Sichttest-Zeile „Sichttest Sub (e) —
  folgt".
- **INTERFACES.md** § 1 Modul 16 Bietet-Block (`_meta`-Erweiterung +
  `_resetMycelConnectedForTest`), Events-Block (`reagiert:
  sbkim:handshake` mit Handler-Vertrag), Geprüft-Zeile (zwei neue
  Einträge), § 10 Änderungsprotokoll voll gespiegelt.
- **`status.json`** Modul 16 `siegel`-Text aktualisiert
  (`score:"stub"` bleibt — analog 04.B/04.C-Konvention bis Klaus'
  Sichttest). `python3 scripts/update_puls_pie.py` aufgerufen
  (PULS-Pie unverändert, da kein Score-Wechsel).
- **PULS.md** Sitzungs-Eintrag oben in § Sitzungs-Einträge.

---

## Heilige Tafeln dieser Sitzung eingehalten

- ✅ Modul-Code-Eingriff NUR in `src/modules/16_siegel.js`.
- ✅ KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- ✅ KEIN Auto-Andocken — Aspekt 4 ausschließlich via empfangenem
  `sbkim:handshake`-Event aktiviert. KEIN Modul-16-Polling, KEIN
  Modul-16-eigener fetch. Empfangsmodus-Prinzip gewahrt.
- ✅ KEIN Persistent-Store für mycelConnected (RAM-only, gewollt).
- ✅ KEIN Modul-18-Code-Bau — `[Andocken]`-Knopf fail-soft.
- ✅ KEIN Endknoten-Eingriff. Mein-Rezeptbuch + Mein-Mixarium bleiben
  außen vor.
- ✅ KEINE Tafel-Umsortierung CLAUDE.md.
- ✅ KEINE Sage-Page-Änderung außer `index.html` CSS-Variablen +
  Badge-Regeln (Block 2 des Briefs).
- ✅ KEIN Modul-05/17-Eingriff.

---

## Was offen blieb

1. **Sichttest Panel 16 Knöpfe 9–12** — ungeprüft, wartet auf Klaus'
   Browser-Lauf am Galaxy Tab S6 (DeX-Chrome). Headless-Smoke 15/15
   grün, aber Klaus' Sichttest ist die Pflicht-Bestätigung.
2. **Sichttest Panel 16 Knöpfe 1–8** (Bau-16-Hauptpfad) ebenfalls
   immer noch ungeprüft seit 2026-05-24. Mit dieser Sub-(e)-PR ergibt
   sich für Klaus eine Gelegenheit, beide Test-Pfade in einem Lauf
   durchzugehen.
3. **Pipeline-Schritt 5e Re-Aktivierung Modul 15+16+17+04.C in
   Endknoten** — Folge-Sitzung pro Endknoten-Repo (extern).
4. **Bau Modul 18 Tool-PWA-Container** (Pipeline-Schritt 5h) —
   `[Andocken]`-Knopf zeigt heute Info-Notiz, sobald Modul 18 da
   ist greift der fail-soft-Check automatisch.

---

## Nächster sinnvoller Schritt

Sichttest-Nachzug-Pflege-Sitzung „Sichttest 16 Sub e grün" nach
Klaus' Browser-Lauf (Pfad analog PR #178 für 04.C). Wenn 9–12 grün,
ggf. status.json Modul 16 von `"stub"` auf weiterführende Skala
(Konvention 04.B/04.C: nach Sichttest eigener Pflege-PR mit
Score-Wechsel).

---

## Brief für die nächste Sitzung

(Wird im Chat ausgegeben.)
