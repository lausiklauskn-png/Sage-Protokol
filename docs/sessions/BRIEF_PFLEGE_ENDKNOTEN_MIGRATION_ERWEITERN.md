# Brief — Pflege-Sitzung Endknoten-Migrations-Brief erweitern (Module 15 + 16)

**Anlass:** Pipeline-Schritt 5 (Endknoten-Migration) ist nach Bau-
Sitzung 15.B (PR #159, 2026-05-25 gemerged + Sichttest grün) der
nächste Schritt vor App-Freigabe (Pipeline-Schritt 6). Der bestehende
`BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` (vor Modul 15 + 16
angelegt) deckt nur die Module 00–08 ab — er muss um Module **15
Membran** und **16 SBKIM-Siegel** erweitert werden, bevor er pro
Endknoten-Repo verwendet wird.

Zusätzlich braucht **Karte 09 § Einbau-Anleitung** zwei neue Schritte
(10 Membran-Allowlist + FREMD-Lampe, 11 Siegel-Badge-Container) —
ohne die wissen Endknoten-Bauer nicht, wo `#lamp-fremd` und die
`.lamps`-Container-Klasse hingehören und welche `allowedOrigins` zu
setzen sind.

Die Pflege-Sitzung ist **klein, reine Doku** (Karte 09 + Brief-Datei);
KEIN Modul-Code-Eingriff (Sage-Protokol-Module sind verbindlich auf
main).

**Branch (Vorschlag):** `claude/pflege-endknoten-migration-erweitern`

**Voraussetzungen:**

- PR #159 (Bau-Sitzung 15.B) ist auf main (✅ gemerged 2026-05-25).
- Bau-15.B-Sichttest 8/8 grün (Klaus, DeX-Chrome 2026-05-25; ✅
  bestätigt im PULS.md-Update aus dieser Brief-Anlage).
- Karte 15 + Karte 16 + INTERFACES.md § 1 Modul 15 + § 1 Modul 16
  sind verbindlich auf main.

---

## Brief-Codeblock (für den ersten Prompt der Pflege-Sitzung)

```
Du bist eine Pflege-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (insbesondere § „Was du tust" + § Pipeline-Reihenfolge)
2. docs/PULS.md (Schnellüberblick + jüngste Sitzungs-Einträge 2026-05-25)
3. docs/components/09_einbau_pwa.md (KOMPLETT lesen — Karte 09 wird erweitert)
4. docs/sessions/BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md (KOMPLETT — wird erweitert)
5. docs/components/15_membran.md (NUR § Sub (a)+(b) Schnittstellen-
   Block, § Sub (e) Lampe + Modal, § Konfigurations-Pfad — die
   Allowlist-Form)
6. docs/components/16_siegel.md (NUR § Schnittstelle + § Sub (a)
   Pflicht-Modul-Liste + § Sub (b) Badge-Rendering)
7. index.html (NUR die Anker-Stellen: `:root --lamp-alert / --siegel-*`,
   `.lamp.fremd-*`, `#sbkim-siegel-badge`, `#lamp-fremd`-Span,
   `.lamps`-Container — Klaus' Bau-Vorlage für die Endknoten-PWAs)
8. sbkim-init.js (NUR die `SbkimMembrane.init({allowedOrigins,
   lampSelector, enableTestButton})` und
   `SbkimSiegel.init({badgeSelector})` Stellen)
9. src/modules/15_membran.js + src/modules/16_siegel.js (NUR die
   Selbstcheck-Zeilen am Skript-Ende — für Erwartung im Sichttest)

Deine Aufgabe:

PRIMÄR — Pflege-Sitzung „Endknoten-Migrations-Brief erweitern":

1. **`docs/components/09_einbau_pwa.md` § Einbau-Anleitung** um zwei
   neue Schritte ergänzen:
   - **§ Schritt 10 — Membran-Allowlist + FREMD-Lampe + SW-Probe-
     Detektor:**
     - `src/modules/15_membran.js` ins Endknoten-`sbkim/`-Verzeichnis
       kopieren.
     - `src/sbkim-sw.js` enthält bereits den SW-Probe-Detektor (Bau
       15.SW); Endknoten kopiert die volle Datei.
     - `index.html` des Endknoten:
       - `:root` ergänzen um `--lamp-alert: #DC2626;` falls nicht da.
       - CSS-Block ergänzen: `.lamp.fremd-alert`, `.lamp.fremd-pulse`,
         `@keyframes lamp-alert-pulse`, `@keyframes lamp-breath`
         (1:1 aus Sage-Protokol's `index.html` Z. 121–127).
       - In der Navleiste neben `#lamp-traffic` einen Span
         `<span class="lamp" id="lamp-fremd" title="Fremdzugriff —
         rot bei Zugriff von außen (Klick öffnet Liste)"></span>`
         + Label `<span class="lamp-label">fremd</span>` einbauen.
     - `<script src="sbkim/15_membran.js">` in die script-Reihenfolge
       NACH 08 + 00, vor 16.
     - `sbkim-init.js`: `await SbkimMembrane.init({lampSelector:
       "#lamp-fremd", allowedOrigins: [/* siehe unten */]});`.
     - **`allowedOrigins`-Liste pro Endknoten:**
       - Mein-Rezeptbuch: `["https://lausiklauskn-png.github.io"]`
         (same-origin gilt nicht als Fremd, aber für Cross-Origin-
         Andockversuche von zukünftigen Endknoten — die Liste wird
         später erweitert, wenn neue Geschwister-Origins ins Mycel
         kommen).
       - Mein-Mixarium: `["https://lausiklauskn-png.github.io"]`
         (analog).
       - **WICHTIG:** `enableTestButton:true` setzt nur die Sage-
         Page, NICHT die Endknoten (Endknoten setzen die Flag NICHT,
         Default `false`).
   - **§ Schritt 11 — SBKIM-Siegel-Badge:**
     - `src/modules/16_siegel.js` ins Endknoten-`sbkim/`-Verzeichnis
       kopieren.
     - `index.html` des Endknoten:
       - `:root` ergänzen um die vier Siegel-Variablen
         (`--siegel-gold: #C9A961;` etc., 1:1 aus Sage-Protokol
         Z. 42–45).
       - CSS-Block ergänzen: `#sbkim-siegel-badge` + Hover-/Focus-/
         First-Boot-Animation (1:1 aus Sage-Protokol Z. 129–134).
       - Container für das Badge: typisch der Navleisten-Container,
         der schon `class="lamps"` trägt (analog Sage-Page). Falls
         der Endknoten keinen `.lamps`-Container hat, einen neuen
         Container mit `class="lamps"` neben dem Navleisten-Titel
         anlegen — Modul 16 (Option β) erzeugt den Badge-Span DARIN
         nur wenn `isCertified()===true`.
     - `<script src="sbkim/16_siegel.js">` in die script-Reihenfolge
       NACH 15 (letztes SBKIM-Modul, weil es alle anderen surface-
       checkt).
     - `sbkim-init.js`: `await SbkimSiegel.init({badgeSelector:
       ".lamps", repoUrl: "<endknoten-repo-url>"});` (Repo-URL
       Override pro Endknoten — z.B.
       `"https://github.com/lausiklauskn-png/Mein-Rezeptbuch"`).
     - **Anti-Greenwashing-Hinweis:** Badge erscheint NUR im DOM
       wenn alle sieben Pflicht-Module geladen sind (Modul 03
       Embedding gilt als `lazy:true` deferred-bestanden). Wenn
       z.B. ein Endknoten Modul 04 nicht lädt (kein Match-Pfad),
       erscheint KEIN Badge — Klaus' Wahl bewusst (Karte 16
       § Strikte Tabus).

2. **`docs/sessions/BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md`
   erweitern** um zwei neue Aufgaben-Punkte g) + h):
   - **g) Modul 15 (Membran) einbauen** — Schritt 10 aus Karte 09
     ausführen. Erwartungs-Block:
     - Selbstcheck-Zeile in DevTools-Konsole:
       `MODUL 15 MEMBRAN bereit, Funktionen: init/read/fremdzugriff.
       {list,subscribe,clear,_recordForTest}`
     - In der Navleiste FREMD-Lampe sichtbar (grau bei leerem
       Buffer, rot bei Eintrag).
     - Sub-(e)-Modal öffnet via Klick auf `#lamp-fremd`.
     - SW-Probe-Detektor aktiv (Bau 15.SW): wenn eine fremde Origin
       (z.B. Klaus per Eruda auf einem dritten Tab)
       `fetch("https://lausiklauskn-png.github.io/<endknoten>/sbkim/
       spore.json")` ruft, wird ein `endpoint-probe`-Eintrag im
       Modal sichtbar.
   - **h) Modul 16 (Siegel) einbauen** — Schritt 11 aus Karte 09
     ausführen. Erwartungs-Block:
     - Selbstcheck-Zeile in DevTools-Konsole:
       `MODUL 16 SIEGEL bereit, Funktionen: init/isCertified/
       getExplanation/getCertifiedModules/getAspects`
     - Badge sichtbar in der Navleiste (vierte Plakette nach LEBT /
       VERKEHR / FREMD).
     - Klick auf Badge öffnet Modal mit Datum + Modul-Liste +
       Aspekte (zwei Einträge: Grund-Bezeugung 2026-05-24 + Modul
       15 Sub (a)+(b) 2026-05-25) + zwei Zeilen Aussteller-Klärung.
     - Esc / Backdrop-Klick schließt Modal.
   - **Punkt e) Sichttest** (bestehender Punkt) um zwei neue
     Selbstcheck-Zeilen erweitern (MODUL 15 + MODUL 16).

3. **NICHT TUN:**
   - KEIN Eingriff in `src/modules/*.js` (Sage-Protokol-Module sind
     verbindlich; Endknoten-Migration kopiert sie).
   - KEIN Eingriff in `index.html` der Sage-Page (die Vorlage bleibt).
   - KEIN PR auf einem Endknoten-Repo — dies ist eine Sage-Protokol-
     Pflege.
   - KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-Bump.
   - KEIN Sichttest nötig (reine Doku-Pflege; Karte 09 + Brief sind
     Spec, kein ausführbarer Code).

SEKUNDÄR — wenn Zeit + Token reichen:

4. **`docs/INTERFACES.md` § 6 Endknoten-Liste** auf Konsistenz prüfen
   und ggf. `siegelBadgeMounted`-Spalten ergänzen (drei Endknoten
   Mein-Rezeptbuch / Mein-Mixarium / Sage — alle drei sollen nach
   Migration einen Badge tragen).

Was du nicht tust:

- KEINE inhaltliche Spec-Änderung an Karte 15 / Karte 16 / INTERFACES
  Modul 15 / Modul 16 — diese sind Tafeln, hier wird nur Karte 09
  + Brief-Datei erweitert.
- KEIN Eingriff in den bestehenden Brief
  `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` außer der
  additiven Erweiterung (Punkte g + h + e-Update).
- KEINE Tafel-Umsortierung Pipeline (Reihenfolge bleibt:
  Schritt 5 Endknoten-Migration → Schritt 6 App-Freigabe).

Pflicht am Ende:

- `docs/components/09_einbau_pwa.md` § Einbau-Anleitung mit
  Schritt 10 + 11 ergänzt.
- `docs/sessions/BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md`
  Aufgaben g + h + e-Update ergänzt.
- PULS.md Sitzungs-Eintrag „Pflege Endknoten-Migrations-Brief
  erweitern (Module 15 + 16)" oben.
- Übergabeprotokoll in
  `docs/sessions/archiv/YYYY-MM-DD_pflege-endknoten-migration-erweitern.md`.
- Commit + Push auf `claude/pflege-endknoten-migration-erweitern`.
- Draft-PR anlegen.
- „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort:
  Empfehlung „PR mergen → pro Endknoten-Repo (Mein-Rezeptbuch +
  Mein-Mixarium) eine EXTERNE Bau-Sitzung mit dem erweiterten Brief —
  Pipeline-Schritt 5 voll ausführen. Danach App-Freigabe Pipeline-
  Schritt 6."
- Brief-Codeblock für nächste Sitzung im Chat ausgeben — falls
  diese Pflege noch einen Folge-Brief erzeugt (z.B. für die
  externe Endknoten-Bau-Sitzung). Sonst sagt die Sitzung explizit
  „kein Folge-Brief — Klaus startet die externen Endknoten-Sitzungen
  manuell mit dem erweiterten Brief aus
  `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md`".
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Pflege-Sitzung
liest)

### Warum erst diese Pflege, dann die externen Endknoten-Sitzungen

Die externen Endknoten-Sitzungen (in den Repos `Mein-Rezeptbuch` und
`Mein-Mixarium`) laufen in fremden Code-Bases mit anderem Stand. Sie
brauchen einen Brief, der **alle zehn SBKIM-Module + 15 + 16** abdeckt,
sonst landet pro Endknoten ein Halbstand (Sub (e) Lampe ohne Modul-15-
Init, Siegel-Badge ohne Container etc.). Karte 09 ist die verbindliche
Andock-Anleitung; sie muss auch die zwei neuen Module 15+16
enthalten, sonst sucht der nächste Endknoten-Bauer im Sage-Protokol-
Code-Lager die richtigen CSS-Anker selbst — fehleranfällig.

### Was die Pflege-Sitzung NICHT entscheidet

- Welche `allowedOrigins` pro Endknoten wirklich nötig sind — der
  Brief schlägt einen sicheren Default vor (`["https://lausiklauskn-
  png.github.io"]`); die echte Liste wächst, sobald neue Geschwister-
  Origins ins Mycel kommen, das ist Folge-Pflege pro Endknoten.
- Ob ein Endknoten den `enableTestButton:true` setzt — der Brief
  sagt explizit „NICHT bei Endknoten, nur Sage-Page" und begründet
  das (Karte 15 § Pflege Sage-Page-Sichttest-Knopf 2026-05-24).
- Ob das Siegel-Badge im Endknoten-DOM einen eigenen Container
  bekommt oder den `.lamps`-Container teilt — der Brief schlägt
  letzteres vor (Option β analog Sage-Page), aber der Endknoten-
  Bauer darf einen eigenen Container wählen, wenn der Navleisten-
  Look das verlangt.

### Nach dieser Pflege

1. Klaus startet pro Endknoten eine **externe Bau-Sitzung** im
   jeweiligen Repo (`Mein-Rezeptbuch` und `Mein-Mixarium`) mit dem
   erweiterten Brief als ersten Prompt.
2. Nach beiden externen Sitzungen: Klaus' Sichttest pro Endknoten —
   FREMD-Lampe + Siegel-Badge + alle neun Selbstcheck-Zeilen.
3. Klaus' **App-Freigabe** Pipeline-Schritt 6 — die drei Apps
   (Mein-Rezeptbuch + Mein-Mixarium + Sage) bekommen ihre öffentliche
   Sichtbarkeit, das SBKIM-Siegel als Vertrauens-Signal sichtbar.
