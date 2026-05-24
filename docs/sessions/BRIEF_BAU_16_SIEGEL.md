# Brief — Bau-Sitzung 16 SBKIM-Siegel

**Anlass:** Spec-Sitzung 16 vom 2026-05-24 hat Karte 16 vollständig
gefüllt (alle vier Sub-Bereiche final, Schnittstelle, INTERFACES.md
§ 1 Modul 16 voller Block, Anti-Greenwashing-Klausel, nüchterne
Modal-Klausel, Persistenz RAM-only, Sichtbarkeits-Modi visible/hidden,
KEINE Stufen-Varianten). Bau-Sitzung 16 implementiert die Spec —
Modul-Code, Badge-CSS, Modal-Mount, ZERTIFIKAT_ASPEKTE-Startwert,
Panel 16 in `tests/manual_check.html`.

**Branch (Vorschlag):** `claude/bau-16-siegel`

**Voraussetzungen:**

- PR #151 (Spec-Sitzung 16) muss auf `main` sein (Karte 16, INTERFACES,
  PULS, status.json, Pie).
- Keine parallel offene PR-Schicht in `src/modules/16_siegel.js` oder
  in den `:root --siegel-*`-Variablen-Block in `index.html`.
- **Klaus' verbindliche Festlegungen aus 2026-05-24** (Karte 16
  § Strikte Tabus + INTERFACES.md § Tabus + Bauzustand-Block in
  Karte 16) sind Bau-Vorgaben — die Sitzung füllt die Code-Form,
  aber NICHT die Anker (Name SBKIM-Siegel, Self-Inscribing,
  Auszeichnungs-Optik, lebendes Dokument, Anti-Greenwashing-Klausel,
  nüchterne Modal-Klausel, KEINE Stufen-Varianten, KEIN
  Disclaimer-Schwall).

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung)

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md (Schnellüberblick + jüngste Sitzungs-Einträge 2026-05-24)
3. docs/INTERFACES.md (§ 1 Modul 16 — voller Block aus Spec-Sitzung 16)
4. docs/components/16_siegel.md (deine Karte, voll gefüllt aus Spec-Sitzung 16 — KOMPLETT lesen, sie ist die Vertragsgrundlage)
5. src/modules/15_membran.js (NUR die Closure-Struktur + Modal-Mount-Pfad + Lampen-Toggle — Vorbild für Modul-Layout, DOM-Mount, Lifecycle, fail-soft-Pattern)
6. src/modules/00_doku_fenster.js (NUR die MutationObserver-Re-Try-Schleife für selector-Mount — Vorbild für badgeSelector-fail-soft)
7. index.html (NUR die Navleiste rund um die drei bestehenden Lampen + #lamp-fremd und das :root-CSS-Variablen-Block für --lamp-*-Farben — du wirst hier vier neue --siegel-*-Variablen + Badge-CSS + DOM-Element ergänzen)
8. sbkim-init.js (NUR der SbkimMembrane.init()-Block — du wirst danach einen SbkimSiegel.init()-Aufruf ergänzen)
9. tests/manual_check.html (NUR Panel 15 als Vorlage für Panel 16 — Test-Knopf-Struktur, Setup-Output-Form)

Deine Aufgabe:

PRIMÄR — Bau-Sitzung 16 vollständig durchziehen:

1. **`src/modules/16_siegel.js`** neu anlegen — voller Modul-Code:
   - **Public Surface** auf `window.SbkimSiegel = {init, isCertified, getExplanation, getCertifiedModules, getAspects, _meta}` (Karte 16 § Schnittstelle, INTERFACES § 1 Modul 16 § Bietet).
   - **PFLICHT_MODULE** als Modul-interne Konstante (sieben Einträge — siehe Karte 16 § Sub (a) Tabelle bzw. INTERFACES § 1 Modul 16 § PFLICHT_MODULE).
   - **ZERTIFIKAT_ASPEKTE** als Modul-interne Konstante (Start-Eintrag verbindlich — siehe Karte 16 § Sub (d) Start-Eintrag).
   - **Surface-Check** im `init()`: pro PFLICHT_MODULE-Eintrag `typeof globalThis[entry.globalName]` + `typeof ns[entry.surfaceFn] === "function"`. Status ∈ {"ok","deferred","missing","broken"} nach der Logik in Karte 16 § Sub (a) Surface-Check-Form. Snapshot einmalig, gecacht. Re-Init no-op.
   - **`isCertified()`**: sync, true wenn alle PFLICHT_MODULE-Status ∈ {"ok","deferred"}.
   - **Fail-Modus binär**: bei missing/broken → genau EINE `console.warn`-Zeile mit ID-Liste, KEIN Badge-Mount, KEIN Modal-Mount. Element ist nicht im DOM (nicht display:none).
   - **`getExplanation()` / `getCertifiedModules()` / `getAspects()`**: defensive Kopie analog Modul 15 fremdzugriff.list().
   - **`_meta`**: Read-Anker mit `firstBootShown`, `certifiedAt`, `pflichtModuleSpec` (kopierter Snapshot).
   - **Badge-Mount**: `init({badgeSelector})` mit Default `'#sbkim-siegel-badge'`. Wenn Selektor nicht matcht und `mountModal:true`, via MutationObserver-Re-Try analog Modul 00 nach DOMContentLoaded; nach 10 s aufgeben (console.warn). **Badge-Element wird im DOM ERZEUGT (Inner-HTML mit SVG-Wappen + title-Attribut), wenn `isCertified() === true` und ein Container-Element via `badgeSelector` existiert** — siehe Diskussion-Punkt unten.
   - **Modal-Mount**: bei `mountModal:true` (Default) Modal in `document.body` analog Modul 15 `mountFremdzugriffModal`. Backdrop / Esc / ✕ schließen. Click auf Badge öffnet.
   - **First-Boot-Animation**: einmalig pro Session, `.first-boot`-Klasse per JS gesetzt, nach 600 ms entfernt. `_meta.firstBootShown` als Guard.
   - **Repo-URL Auto-Erkennung** wie in Karte 16 § Sub (c) Repo-URL-Quelle.
   - **Aussteller-Klärungs-Block** im Modal verbindlich zwei Zeilen (Karte 16 § Sub (c) Aussteller-Klärung) — KEIN Disclaimer-Schwall, KEIN „ohne Garantie"-Block.
   - **KEINE benannten Error-Klassen** (rein lokal/beobachtend, fail-soft via `console.warn` analog Modul 15).
   - **Selbstcheck**: `console.info("MODUL 16 SIEGEL bereit, Funktionen: init/isCertified/getExplanation/getCertifiedModules/getAspects")` beim Skript-Laden.

   **Diskussionspunkt — Badge-DOM-Erzeugung**: zwei Optionen, Bau-
   Sitzung wählt:
   - Option α: Bau-Sitzung 16 fügt das `<span id="sbkim-siegel-
     badge">…</span>`-Element direkt in `index.html` nach dem
     FREMD-Lampen-Label ein; Modul-Code zeigt es per Klasse-Toggle.
     Vorteil: einfacher, Inspector zeigt sofort den Anker.
     Nachteil: bei `isCertified()===false` muss das Element via JS
     entfernt werden, damit Anti-Greenwashing binär ist.
   - Option β: Modul-Code erzeugt das `<span>`-Element via JS und
     hängt es im Container (`badgeSelector` zeigt auf Container, z.B.
     `.lamps`), nur wenn `isCertified()===true`. Vorteil: Anti-
     Greenwashing trivial (kein Element überhaupt). Nachteil: Element
     erst nach `init()` da, was bei späteren Endknoten-PWAs mit eigenem
     Layout zu CSS-Layout-Shift führen kann.
   **Empfehlung: Option β** — passt zur Spec-Klausel „Element wird
   gar nicht angelegt bei not certified". `badgeSelector` zeigt auf
   einen **Container** (z.B. `.lamps`); Modul-Code erzeugt das
   `#sbkim-siegel-badge`-Span darin. Default-Selektor kann
   `.lamps` sein (Container) oder `#sbkim-siegel-badge` (Element
   selbst, wenn vor-existierend). Bau-Sitzung wählt EINE Variante
   und benennt sie in Karte 16 § Bauzustand.

2. **`index.html`** additiv erweitern:
   - **`:root`-Variablen** ergänzen (vier neue):
     ```css
     --siegel-gold:      #C9A961;
     --siegel-gold-glow: rgba(201,169,97,0.55);
     --siegel-ink:       #1A1306;
     --siegel-line:      rgba(201,169,97,0.45);
     ```
   - **Badge-CSS-Block** (Karte 16 § Sub (b) Farb-Palette + Hover-/
     First-Boot-Animation, an passender Stelle im bestehenden CSS-
     Block analog `.lamp.fremd-alert`-Regeln).
   - **Wappen-SVG** (Karte 16 § Sub (b) Wappen-Element, SVG-Skelett
     als Anker — Bau-Sitzung verfeinert finale Pfade).
   - **DOM-Anker** (siehe Option α vs β oben). Bei Option β: keine
     statische DOM-Änderung in der Navleiste, nur `.lamps` als
     Container.
   - **Modal-CSS** für `#sbkim-siegel-modal` mit wertigerer
     Typografie (Karte 16 § Sub (c) Modal-Form): Serif für Titel +
     Klausel-Block (`'Spectral','Georgia',serif`), Bronze-Ink-
     Hintergrund (`var(--siegel-ink)`), Edel-Gold-Rahmen
     (`var(--siegel-line)`).

3. **`sbkim-init.js`** Init-Aufruf ergänzen — nach `SbkimMembrane.init`,
   vor `SbkimDoku.init`:
   ```js
   await initModule("SbkimSiegel", function () {
     return window.SbkimSiegel && window.SbkimSiegel.init({
       // badgeSelector aus Bau-Sitzungs-Entscheidung (Option α/β)
       // repoUrl optional explizit setzen wenn gewünscht
     });
   });
   ```

4. **Panel 16 in `tests/manual_check.html`** anlegen mit Setup + den
   Test-Punkten aus Karte 16 § Manueller Test:
   - Setup: `SbkimSiegel.init({mountModal:true})` + Setup-Output zeigt
     Modul-Liste mit Status-Spalte.
   - Test 1: `isCertified()` → erwartet true (alle Pflicht-Module geladen).
   - Test 2: Test-Brücke setzt `window.SbkimMatch = undefined` (oder
     stubbt es zu `{}`), ruft `SbkimSiegel.init()` auf neuer
     Test-Sub-Instanz — erwartet `isCertified() === false`, eine
     `console.warn`-Zeile mit ID `04 (missing)`.
   - Test 3: Click-Simulation auf Badge → Modal sichtbar. Esc → Modal
     geschlossen.
   - Test 4: `init({repoUrl: "https://github.com/example/repo"})` —
     Modal-Aussteller-Klärungs-Zeile zeigt diesen Link.
   - Test 5: `getAspects()`-Reihenfolge — Start-Eintrag oben, Datum
     2026-05-24, Modul-ID „16".
   - Test 6: `_meta.firstBootShown` → vor erstem init false, nach
     init mit isCertified===true → true.
   - Test 7: `init({visible:"hidden"})` — kein Badge im DOM, aber
     `isCertified()` + `getExplanation()` funktionieren.
   - Selbstcheck-Hinweis-Knopf wie in Panel 15.

5. **Headless-Smoke-Test** in Node (analog Bau 15: `vm.createContext`
   mit `globalThis`-Stub für `SbkimStorage`/`SbkimSpore`/... +
   `document`-Stub mit `querySelector`/`createElement`). Mindest-
   Abdeckung: API-Surface, Pflicht-Modul-Spoofing (alle vier Status-
   Werte), defensive Kopie, isCertified-Snapshot-Stabilität,
   First-Boot-Animation-Guard, MutationObserver-Re-Try-Pfad,
   Aussteller-Klärung-Override.

6. **Karte 16 § Bauzustand** Zeile „Code geschrieben" ergänzen
   (Datum, Sitzung, Anmerkung mit Schlüssel-Entscheidungen).

7. **INTERFACES.md § 1 Modul 16** Status von `entwurf` auf `review`
   ziehen (Bau-Sitzung 16 schließt die Implementation, finale
   Sichtung ist Klaus' Sichttest).

8. **PULS.md** Tabellenzeile 16 nachziehen + Sitzungs-Eintrag oben.

9. **status.json** `siegelBacklog[0].score` von `"spec"` auf `"stub"`
   ziehen (Karte 16 hat dann Spec + Code-Stub); `siegel`-Text
   aktualisieren. `python3 scripts/update_puls_pie.py` aufrufen
   (Pie passt sich an: Spec fertig 1→0, Code-Stub 8→9).

SEKUNDÄR — wenn Zeit + Token reichen:

10. **Wappen-SVG verfeinern** — finale Pfade für die drei verschlungenen
    Hyphen-Bögen + zentraler Knoten-Punkt. Spec lieferte ein Anker-
    Skelett; Bau-Sitzung verfeinert für 40-px-Druck-Tauglichkeit.

11. **Spectral-Font-Load entscheiden** — System-Fallback (Georgia)
    reicht für Stufe 1, oder Webfont via `<link>`? Bau-Sitzung baut
    Default mit System-Serif; eine Mini-Pflege darf Spectral
    nachreichen, wenn Klaus es will.

ZURÜCKGEHALTEN — diese Bau-Sitzung NICHT:

- Eingriff in andere Modul-Karten (Modul 15 Sub (a) Siegel-Hook
  kommt in Spec-Sitzung 15.B).
- Eingriff in `sbkim_paper.pdf` oder `docs/ARCHITEKTUR.md`.
- Endknoten-Migration (eigene Folge-Sitzung Karte 09 § Schritt 10).
- Mini-Pflege CLAUDE.md „Sicherheits-Module pflegen Aspekte" — eigene
  Mini-Pflege-Sitzung NACH Bau 16, weil Querschnitts-Tafel-Pflege
  (Tafel-Evolutions-Klausel).
- Sichttest (Klaus, Sage-Page Badge sichtbar + Modal öffnet sich) —
  Bau-Sitzung markiert „Sichttest ungeprüft, wartet auf Klaus' Browser-
  Lauf" analog Bau 15.
- `PROTOCOL_VERSION`-Bump (Siegel ist nicht protokoll-aktiv).
- `DB_VERSION`-Bump (RAM-only — keine neuen IndexedDB-Stores).

Was du nicht tust:

- KEINE Modifikation an PFLICHT_MODULE-Liste oder Surface-Funktions-
  Ankern. Wenn ein Modul-Code-Symbol nicht existiert (z.B. `match`
  in Modul 04 wäre nicht da), HALTE AN und schreibe das in PULS.md
  als offene Frage — das ist Spec-Klärung, kein Bau-Job.
- KEINE Erweiterung um `"compact"`-Sichtbarkeits-Modus (Spec hat
  das zurückgestellt).
- KEINE Stufen-Varianten (Bronze/Silber/Gold) — Klaus-Festlegung.
- KEIN Disclaimer-Schwall im Modal — zwei Zeilen reichen.
- KEINE `addAspect(...)`-API auf `window.SbkimSiegel`. Aspekte sind
  code-versioniert.
- KEINE `setPflichtModule(...)`-API. Pflicht-Liste ist code-
  versioniert.
- KEINE Funktions-Aufrufe auf Pflicht-Modulen — nur typeof-Check.
- KEINE PII im Modal. nodeId/API-Keys/Geschwister-Daten niemals.
- KEIN Spore-Schema-Eingriff in Modul 02. Modul 16 ist PWA-lokal.

Pflicht am Ende:

- `src/modules/16_siegel.js` voller Code (alle public-surface-
  Funktionen, PFLICHT_MODULE, ZERTIFIKAT_ASPEKTE, Badge-Mount, Modal-
  Mount, fail-soft analog Modul 15).
- `index.html` additiv erweitert (`:root --siegel-*`-Variablen,
  Badge-CSS + Wappen-SVG, Modal-CSS, evtl. Container-DOM falls
  Option α).
- `sbkim-init.js` `SbkimSiegel.init()`-Aufruf nach `SbkimMembrane.init`.
- Panel 16 in `tests/manual_check.html` mit Setup + Test-Knöpfen
  + Selbstcheck-Hinweis.
- Headless-Smoke-Test grün im Node-Stub.
- `node --check src/modules/16_siegel.js` grün.
- Karte 16 § Bauzustand Zeile „Code geschrieben" mit Datum + Anmerkung.
- INTERFACES.md § 1 Modul 16 Status auf `review`.
- PULS.md Tabelle 16 + Sitzungs-Eintrag oben.
- status.json `siegelBacklog[0].score` → `"stub"`; Pie aktualisiert.
- Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_bau-16-siegel.md`.
- Commit + Push auf `claude/bau-16-siegel`.
- Draft-PR anlegen.
- Sichttest-Anweisung-Codeblock für Klaus in der Chat-Antwort
  wortwörtlich + komplett ausgeben (Karte 16 § Manueller Test
  Punkte 1–7, als kompakte Schritt-Liste).
- „Vorgeschlagene nächste Schritte"-Block in der finalen Chat-
  Antwort (mindestens: Klaus' Sichttest, Mini-Pflege CLAUDE.md
  Aspekt-Pflicht, Spec-Sitzung 15.B mit Siegel-Hook im read()).
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Bau-Sitzung
liest)

### Spec-Sitzung 16 Stand 2026-05-24

Alle vier Sub-Bereiche sind final spezifiziert. Die Bau-Sitzung 16
implementiert die Spec **1:1**:

- **Sub (a)** legt sieben Pflicht-Module mit Surface-Funktions-Ankern
  fest (`init`/`getOwnSpore`/`embedPassage`/`match`/`handshake`/
  `prepareSelfApoptose`/`init`). Modul 03 ist `lazy:true` (Sage-Page-
  spezifisch lazy-loaded).
- **Sub (b)** legt das 40-px Edel-Gold-Medaillon fest, mit
  Wappen-Skelett (drei Hyphen-Bögen + Knoten-Punkt), First-Boot-
  Animation 600 ms, KEINE Stufen-Varianten.
- **Sub (c)** legt das Modal mit nüchterner Aussteller-Klärung
  (zwei Zeilen, kein Disclaimer-Schwall) fest, wertigere Typografie
  (Serif für Titel + Klausel).
- **Sub (d)** legt das `ZERTIFIKAT_ASPEKTE`-Schema + den verbindlichen
  Start-Eintrag fest.

### Was die Bau-Sitzung NICHT entscheidet

- Ob das Siegel rechtlich verbindlich ist (es ist nicht — Modal
  sagt es nüchtern).
- Ob 10/11/12 jetzt schon gebaut werden (nein — organisch nach
  App-Freigabe).
- Ob ein Webfont (Spectral) verpflichtend geladen wird (nein —
  System-Fallback reicht für Stufe 1; Mini-Pflege darf Webfont
  später nachreichen).

### Nach der Bau-Sitzung

1. **Klaus' Sichttest** in der Sage-Page (DeX-Chrome auf Galaxy Tab
   S6) — Badge sichtbar in der Navleiste, Modal öffnet sich, First-
   Boot-Animation läuft, Aussteller-Klärung verlinkt korrekt.
2. **Mini-Pflege CLAUDE.md** — § „Sicherheits-Module pflegen
   Aspekte" als Pflicht-Block einführen.
3. **Spec-Sitzung 15.B** — Sub (a) Read-API mit Siegel-Hook
   (`siegel: {isCertified, repoUrl, certifiedModules}`).
4. **Endknoten-Migration** — Karte 09 § Schritt 10 (Membran-Allowlist
   + FREMD-Lampe + Siegel-Badge pro Endknoten-PWA).
5. **Klaus' App-Freigabe** — mit Siegel sichtbar.

### Warum direkt bauen ohne Klaus-Zwischenrückfrage

Karte 16 ist nach der Spec-Sitzung 16 vom 2026-05-24 vollständig
spezifiziert. Die verbindlichen Tafeln aus Klaus' Festlegungen sind
in der Spec festgenagelt. Bau-Sitzung 16 hat klare Vorgaben — die
einzigen Bau-Entscheidungs-Punkte sind:

- Option α vs β für Badge-DOM-Erzeugung (Empfehlung in der Spec: β).
- Spectral-Webfont jetzt oder später (Empfehlung: später).
- Wappen-SVG-Pfade verfeinern.

Diese sind Bau-Detail, kein Spec-Risiko.
