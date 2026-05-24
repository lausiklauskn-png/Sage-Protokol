# Brief — Spec-Sitzung 16 SBKIM-Siegel

**Anlass:** Klaus hat in der Diskussion 2026-05-24 strategisch
beschlossen, dass vor der öffentlichen Verteilung seiner PWAs ein
sichtbares Vertrauens-Signal stehen muss. Modul 16 SBKIM-Siegel wurde
als Stub angelegt (Mini-Pflege „Modul 16 SBKIM-Siegel Stub", PR #147
gemerged 2026-05-24, `main` `4e7c9dd`). Diese Spec-Sitzung füllt Karte
16 vollständig — die vier Sub-Bereiche (a Pflicht-Modul-Liste,
b Badge-Rendering Auszeichnungs-Optik, c Erklärungs-Modal, d Aspekte-
Liste lebendes Dokument).

**Branch (Vorschlag):** `claude/spec-16-siegel`

**Voraussetzungen:**

- PR #142 (Bau 15 Sub (e)) + #144 (Bau 15.SW) + #145 (Pflege Sage-
  Page-Sichttest-Knopf) + #146 (Sichttest-Nachzug) + #147 (Modul-16-
  Stub) sind auf `main` (alle 2026-05-24).
- Keine parallel offene PR-Schicht in `src/modules/` oder Karte-15/16-
  Doku (Stand 2026-05-24: keine).
- **Klaus' verbindliche Festlegungen aus 2026-05-24** (siehe
  Hintergrund-Block unten) sind Spec-Vorgaben — die Sitzung kann
  Details füllen, aber NICHT den Namen ändern, nicht die Self-
  Inscribing-Variante kippen, nicht die Auszeichnungs-Optik
  verwerfen.

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md (Schnellüberblick + jüngste Sitzungs-Einträge 2026-05-24)
3. docs/INTERFACES.md (§ 0 Konstanten, § 1 Modul-Verträge — du wirst hier ein neues § 1 Modul-16-Block ergänzen)
4. docs/components/16_siegel.md (deine Karte, voller Stub mit vier Sub-Bereichen + Anker-Schnittstelle; KOMPLETT lesen — sie ist die Vertragsgrundlage)
5. docs/components/15_membran.md (Karte 15 als Architektur-Vorbild für Lampen-/Badge-DOM-Ansatz + Modal-Pattern + INTERFACES-Block-Form)
6. index.html (NUR die Navleiste rund um die drei bestehenden Lampen — `#lamp-alive`, `#lamp-traffic`, `#lamp-fremd` — das ist der Anker-Punkt für das Siegel-Badge; NICHT die ganze Datei lesen)
7. sbkim-init.js (NUR der `SbkimMembrane.init()`-Block — Vorbild für die Init-Position des Siegel-Moduls)

Deine Aufgabe:

PRIMÄR — Karte 16 SBKIM-Siegel vollständig spec-iieren:

1. **Sub (a) Selbst-Prüfung — finale Pflicht-Modul-Liste:**
   - Anker-Vorschlag aus Stub: 01 (Storage), 02 (Spore), 03 (Embedding),
     04 (Match), 05 (Anastomose), 07 (Apoptose), 15 (Membran Sub (e))
   - Entscheidung: 06 (Heterokaryose) Pflicht oder Opt-In? Karte-Stub-
     Vorschlag „Opt-In, nicht Pflicht" — bestätigen oder ändern
   - Entscheidung: 00 (Doku-Fenster) Pflicht? Vorschlag „nicht Pflicht"
     — bestätigen oder ändern
   - Entscheidung: 04.B (LLM-Erklärung) Pflicht? Vorschlag „nicht
     Pflicht, weil API-Key-abhängig" — bestätigen
   - **Pflicht-Prüfungs-Form**: pro Modul welche globale Funktion muss
     existieren? (z.B. `typeof window.SbkimSpore.getOwnSpore === "function"`
     für Modul 02). Konkrete Funktions-Liste pro Modul festlegen.
   - **Fail-Modus**: ein einziger Check-Fehlschlag → KEIN Badge-Render,
     genau EINE `console.warn`-Zeile mit ID-Liste der fehlenden Module.
     Bestätigen.
   - **Surface-Check-Zeitpunkt**: einmalig beim `init()` (snapshot)
     oder kontinuierlich beim Aufruf? Spec entscheidet (Vorschlag:
     einmalig im `init()`, dann gecacht — analog Modul 15
     `subscribeBroadcastChannel`-Pattern).

2. **Sub (b) Badge-Rendering — Auszeichnungs-Optik:**
   - **DOM-Anker**: `#sbkim-siegel-badge` (oder Klaus' Wahl)
   - **Position**: vierte Plakette nach den drei Lampen
     (LEBT/VERKEHR/FREMD), oder eigener Anker im Header neben dem
     Repo-Branch-Text? Spec entscheidet
   - **Form**: rundes oder ovales Medaillon, Spec entscheidet finale
     Größe (32–48 px Durchmesser)
   - **Farb-Palette**: Default Edel-Gold `#C9A961`-Klasse auf dunklem
     Grund. Spec darf Varianten festlegen (z.B. Bronze für „Grund-
     Siegel", Gold für „erweitert" nach 11/12-Bau; oder einfaches
     Default-Gold ohne Stufen)
   - **Schrift**: Serif (z.B. Spectral, Lora) oder humanistische
     Sans-Serif (z.B. Source Serif Pro) — NICHT die Mono-Schrift der
     Lampen-Labels. Spec wählt aus Klaus' bestehender Schrift-Liste
     (siehe `index.html` `:root --font-*`-Variablen)
   - **Wappen-Element**: abstraktes Mycel-Symbol / Hyphen-Geflecht als
     zentraler Glyph. Spec entwirft das SVG-Skelett oder eine verbale
     Anker-Beschreibung („Drei verschlungene Linien, …"); finale SVG-
     Pfade gehören in die Bau-Sitzung
   - **Hover/Aktiv-Zustand**: dezenter Glow oder Atmung (analog
     `.lamp.alive`-Glow aber wertiger). Spec entscheidet
   - **First-Boot-Animation**: einmaliger Aufleuch-Puls + leichte
     Skalierung ~600 ms beim ersten erfolgreichen `isCertified()`
     pro Session — bestätigen oder anpassen
   - **Sichtbarkeits-Modi** (`init({visible})`):
     - `"visible"` (Default für Sage-Page + Endknoten): sichtbares
       Badge mit Klick-Handler
     - `"hidden"` (für Tool-Apps mit eigenem Design-Wunsch): kein DOM-
       Render, aber Siegel-API erreichbar
     - Optional `"compact"` (kleiner für mobile Endknoten-Apps)?
       Spec entscheidet
   - **SVG-vektorbasiert** für Skalierbarkeit (auch Druck-tauglich —
     Klaus möchte das Siegel später eventuell auf Visitenkarten/
     Über-Seiten drucken)
   - **Anti-Greenwashing-Anker** (im Modul-Code): wenn
     `isCertified() === false`, KEIN Badge-Render. Auch nicht
     ausgegraut, auch nicht „in Arbeit". Binär.

3. **Sub (c) Erklärungs-Modal:**
   - **Titel**: „SBKIM-Siegel — was bedeutet das?" — bestätigen oder
     anpassen
   - **Inhalt** (Pflicht-Struktur):
     - Datum der ersten Bezeugung
     - Modul-Liste mit Status (ok / missing / broken)
     - Aspekte-Liste chronologisch
     - Kurzer Aussteller-Klärungs-Satz (zwei Zeilen, nüchtern)
   - **Konkrete Aussteller-Klärung festlegen** — Karte-Stub-Vorschlag:
     > Dieses Siegel ist **self-inscribing**: die App hat sich selbst
     > geprüft. Vertrauen kommt vom Repo, in dem sie gehostet ist:
     > `<repo-url>`.

     Klaus-Korrektur 2026-05-24: „ohne Garantie war nicht ernst
     gemeint" — KEIN Disclaimer-Schwall, KEIN Haftungsausschluss-Block.
     Spec darf feinpolieren, aber NICHT aufblähen.
   - **Modal-Form**: analog Modul 15 Fremdzugriff-Modal (eigenständig
     in `document.body`, Backdrop / Esc / ✕ schließen), ABER mit
     **wertigerer Typografie** (Serif für Titel + Klausel-Block,
     dezenter Rahmen, klassischer Stil-Wechsel weg vom Mono-/Lampen-
     Stil)
   - **Repo-URL-Quelle**: `document.location.origin` + Repo-Pfad
     auto-erkennen, ODER expliziter `init({repoUrl})`-Parameter? Spec
     entscheidet (Vorschlag: auto-erkennen mit Override-Möglichkeit)

4. **Sub (d) Aspekte-Liste — lebendes Dokument:**
   - **Schema**: `{ since: ISO-Datum, module: string, aspect: string,
     description: string }` — bestätigen oder erweitern
   - **Start-Eintrag für Grund-Siegel 2026-05-24**: Spec entwirft den
     finalen Wortlaut. Anker-Vorschlag:
     ```
     {
       since: "2026-05-24",
       module: "16",
       aspect: "Grund-Siegel-Bezeugung",
       description: "Diese App bestätigt durch Selbst-Prüfung beim
                     Boot, dass die SBKIM-Pflicht-Module geladen sind."
     }
     ```
   - **Reihenfolge**: chronologisch aufsteigend (älteste oben) oder
     neueste oben? Spec entscheidet — Vorschlag: aufsteigend, weil
     sich aufbauend (jeder neue Aspekt setzt auf den vorigen auf)
   - **Pflicht-Konvention**: jedes spätere Sicherheits-Modul (10, 11,
     12, …) MUSS in seiner Pflege einen Aspekt-Eintrag ergänzen.
     Spec verankert das verbindlich in Karte 16 § Sub (d) und in
     CLAUDE.md (Folge-Pflege).

5. **Schnittstelle `window.SbkimSiegel`** (Anker aus Karte 16, finale
   Form):
   - `init(options?)` → Promise<void>
   - `isCertified()` → boolean (sync)
   - `getExplanation()` → ExplanationSnapshot (sync, Modal-Render-
     Quelle)
   - `getCertifiedModules()` → string[] (sync)
   - `getAspects()` → Aspect[] (sync, chronologisch)
   - `_meta` (Read-Anker für Tests — analog Modul 15)
   - **options-Form**: `{ badgeSelector?, visible?, mountModal?,
     repoUrl? }` — Spec definiert finale Defaults
   - Spec definiert finale Form von `ExplanationSnapshot` (siehe Karte
     16 Anker) und `Aspect` (siehe Sub (d))

6. **Persistenz-Entscheidung — binär:**
   - Variante A (Vorschlag): RAM-only (analog Modul 15 Sub (e)).
     Datum der ersten Bezeugung = Date.now() beim ersten
     `isCertified()===true`-Lauf pro Session.
   - Variante B: IndexedDB-Single-Value-Store `sbkim_siegel_meta`
     für „Datum der ersten Bezeugung" (überlebt Tab-Reload).
   - Spec entscheidet binär. Empfehlung: Variante A, weil Persistenz
     für ein per-Session sich aufstellendes Siegel überflüssig ist.

7. **INTERFACES.md § 1 Modul 16 voll spiegeln:**
   Block-Form analog § 1 Modul 15 (Datei, Status, Bietet, Nutzt,
   Storage, Events, Selbstcheck, Versionierungs-Vertrag,
   Fehlerverhalten, Datenformate, Garantien). § 0 BLEIBT
   UNVERÄNDERT — Modul 16 braucht keine §0-Konstanten (alle
   modul-lokal).

8. **Anti-Greenwashing-Klausel (Karte 16 § Strikte Tabus
   bestätigen + erweitern):**
   - Kein Siegel ohne Selbst-Prüfung-grün
   - Aspekte-Liste code-versioniert (NICHT zur Laufzeit ergänzbar)
   - Pflicht-Modul-Liste code-versioniert (NICHT zur Laufzeit
     änderbar)
   - Keine PII im Modal
   - Modal-Klausel nüchtern (zwei Zeilen, kein Disclaimer-Schwall —
     Klaus-Korrektur 2026-05-24)
   - Self-Issued ist eine Disziplin-Aussage (interne Spec-Klausel),
     NICHT im UI-Modal als Haftungsausschluss

SEKUNDÄR — wenn Zeit + Token reichen:

9. **SVG-Wappen-Entwurf grob skizzieren** — entweder als Inline-SVG-
   Code in der Karte ODER als verbale Anker-Beschreibung („drei
   verschlungene Hyphen-Bögen, im Zentrum ein abstrakter Knoten").
   Finale SVG-Pfade gehören in die Bau-Sitzung 16, nicht hier.

10. **Brief-99-Pipeline-Folge-Sitzungen vor-skizzieren** (Bau-Sitzung
    16, Sichttest 16, Spec-Sitzung 15.B mit Siegel-Hook in Sub (a)
    Read-Snapshot, Endknoten-Migration Karte 09 § Schritt 10).

ZURÜCKGEHALTEN — diese Spec-Sitzung NICHT:

- Code in `src/modules/16_siegel.js` (Bau-Sitzung 16 folgt)
- Eingriff in `index.html` (CSS + DOM kommen in Bau-Sitzung 16)
- Eingriff in andere Modul-Karten (Modul 15 Sub (a) Siegel-Hook
  kommt in Spec-Sitzung 15.B)
- Hub-Aussteller-Variante (Karte 16 verbietet explizit, Klaus' Festlegung)
- `PROTOCOL_VERSION`-Bump (Siegel ist nicht protokoll-aktiv)
- `DB_VERSION`-Bump (RAM-only default)
- Sichttest (kein Code zu testen)
- Endknoten-Migration (eigene Folge-Sitzung)
- Schutz-Module 10 / 11 / 12 spec (eigene Folge-Sitzungen)

Was du nicht tust:

- KEINE Code-Datei in `src/` anlegen
- KEINE INTERFACES.md-Erweiterung in andere Modul-Blöcke (nur Modul 16
  Block neu)
- KEIN Eingriff in `index.html` (CSS + Badge-DOM kommen in Bau 16)
- KEIN Sichttest (kein Code zu testen)
- KEIN Sprung auf `score:"stub"` (Code-Stub kommt erst nach Bau-
  Sitzung 16); Spec-fertig = `score:"spec"`
- KEINE Modifikation an Klaus' verbindlichen Festlegungen
  (Name SBKIM-Siegel, Self-Inscribing, Auszeichnungs-Optik, lebendes
  Dokument, Anti-Greenwashing, nüchterne Modal-Klausel)

Pflicht am Ende:

- Karte `docs/components/16_siegel.md` voll gefüllt (alle vier
  Sub-Bereiche final, Schnittstelle, INTERFACES-Block-Mirror,
  Risiken, manueller Test-Vorbereitung, Bauzustand-Zeile „Spec
  gefüllt | 2026-05-24 (oder Sitzungs-Datum) | Spec-Sitzung 16 | …")
- `docs/INTERFACES.md` § 1 Modul 16 voller Block (analog § 1 Modul
  15, mit allen Pflicht-Sektionen)
- `docs/PULS.md` Tabellenzeile 16 nachgezogen + Sitzungs-Eintrag oben
- `status.json` `siegelBacklog[0].score` von `"schablone"` auf
  `"spec"` hochziehen + `siegel`-Text auf „Spec fertig (Spec-Sitzung
  16 YYYY-MM-DD)" anpassen; danach `python3 scripts/update_puls_pie.py`
  aufrufen (Pie sollte sich anpassen: Schablonen 5 → 4, Spec fertig
  0 → 1, gesamt 16 unverändert)
- Übergabeprotokoll in
  `docs/sessions/archiv/YYYY-MM-DD_spec-16-siegel.md`
- Brief für die Folge-Bau-Sitzung 16 anlegen
  (`docs/sessions/BRIEF_BAU_16_SIEGEL.md`)
- Commit + Push auf `claude/spec-16-siegel`
- Draft-PR anlegen
- Brief-Codeblock für die Bau-Sitzung 16 in der Chat-Antwort
  wortwörtlich + komplett ausgeben (CLAUDE.md § Pflicht am
  Sitzungsende Punkt 6)
- „Vorgeschlagene nächste Schritte"-Block in der finalen Chat-Antwort
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Spec-Sitzung
liest)

### Klaus' verbindliche Festlegungen aus 2026-05-24

Diese Punkte sind aus der strategischen Diskussion am 2026-05-24
**fix** — die Spec-Sitzung darf Details füllen, aber NICHT diese
Anker kippen:

1. **Name: SBKIM-Siegel** (nicht TÜV+, nicht Gift+, nicht Mycel-
   Plakette).
2. **Self-Inscribing**: die App stellt sich das Siegel selbst aus
   nach erfolgreicher Selbst-Prüfung der Pflicht-Module beim Boot.
   Kein zentraler Hub-Aussteller, kein CI-Build-Check. Vertrauen
   kommt vom Repo.
3. **Auszeichnungs-Optik**: Prädikatswein- / DLG- / Stiftung-
   Warentest-Stil als Referenz. Medaillon-Form, Edelmetall-
   Anmutung, klassische Schrift, SVG-skalierbar. Kein Marketing-
   Sticker-Stil, kein Neon, kein Emoji-Glyph.
4. **Lebendes Dokument**: die Erklärung wächst organisch — jedes
   Sicherheits-Update ergänzt einen Aspekt mit Datum. Aspekte sind
   code-versioniert, NICHT zur Laufzeit ergänzbar.
5. **Modal-Klausel nüchtern**: zwei Zeilen Self-Inscribing-Hinweis +
   Repo-Anker, KEIN Disclaimer-Schwall. Klaus' Korrektur: „ohne
   Garantie war nicht ernst gemeint" — der defensive Haftungs-
   ausschluss-Block ist gestrichen.
6. **Anti-Greenwashing**: binär. Entweder Siegel-Render oder kein
   Render. Kein „ausgegraut", kein „in Arbeit".

### Was die Spec-Sitzung NICHT entscheidet

- Ob das Siegel ein „echtes" Qualitäts-Siegel im rechtlichen Sinn
  ist. Es ist keine rechtliche Garantie — aber das wird im Modal
  NICHT defensiv ausgesprochen, sondern als sachliche Selbst-
  Beschreibung.
- Ob 10 / 11 / 12 jetzt schon gebaut werden müssen. Klaus' Reihen-
  folge-Empfehlung: SBKIM-Siegel zuerst (Grundbaukasten), Schutz-
  Module wachsen organisch danach pro Pflege-PR mit einem Aspekt-
  Eintrag.
- Welche externe Zertifizierungs-Stelle das Siegel anerkennt.
  Keine — Self-Issued.

### Reihenfolge der Folge-Sitzungen

```
Schritt 1: DIESE Spec-Sitzung 16 — Form festlegen
Schritt 2: Bau-Sitzung 16        — src/modules/16_siegel.js,
                                    Badge-CSS in index.html,
                                    ZERTIFIKAT_ASPEKTE-Startwert
Schritt 3: Sichttest 16          — Klaus, Sage-Page Badge sichtbar
Schritt 4: Spec-Sitzung 15.B     — Sub (a) + Sub (b) mit Siegel-Hook
Schritt 5: Endknoten-Migration   — Karte 09 § Schritt 10 +
                                    Siegel-Anker pro Endknoten-PWA
Schritt 6: Klaus' App-Freigabe   — mit Siegel sichtbar
Später:    Modul 11 / 12 / 10    — jeder Bau ergänzt einen Aspekt
```

### Warum nicht direkt bauen ohne Spec?

Karte 16 ist die **zweite Karte**, die in die UI-Schicht der Sage-Page
reicht (Modul 15 war die erste). Die SVG-Wappen-Form, die Farb-Palette,
die exakte Modul-Pflicht-Liste, die Modal-Typografie — das sind alles
Spec-Entscheidungen, die einmal sauber überlegt sein müssen. Ohne
Spec würden in der Bau-Sitzung drei Halb-Lösungen parallel entstehen
und müssten zurückgerollt werden.

Außerdem: Modul 16 wird in **mehreren PWAs** eingebaut (Sage-Page,
Mein-Rezeptbuch, Mein-Mixarium und alle künftigen Endknoten). Die
Spec ist also de facto eine Schnittstelle gegen mehrere Konsumenten —
die Form muss stabil sein, bevor sie verteilt wird.
