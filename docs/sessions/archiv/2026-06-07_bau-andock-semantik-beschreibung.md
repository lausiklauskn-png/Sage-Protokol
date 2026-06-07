# Übergabeprotokoll — Bau: Semantik-Beschreibungs-Textfeld im Siegel

**Datum:** 2026-06-07
**Rolle:** Bau-Sitzung (Sage-Protokol)
**Branch:** `claude/bau-andock-semantik-beschreibung-TiY5D`
**Brief:** `docs/sessions/BRIEF_BAU_ANDOCK_SEMANTISCHE_BESCHREIBUNG.md`

---

## Auftrag

Im Siegel-Modal, direkt unter dem Knopf „🔑 Eigene Identität & Spore
erzeugen / verwalten →", ein auto-wachsendes Textfeld für die semantische
Selbst-Beschreibung einbauen. Voller Pfad: Text → `domainDescription` →
Modul-03-Embedding (384-dim, e5-small, L2) → neuer `domainVector` → in die
Spore eingebettet + mit vorhandenem Schlüssel neu signiert (gleiche nodeId,
keine neue Krypto). Zusätzlich: den Modul-18-Hinweis ganz aus dem Siegel
entfernen.

## Am Start mit Klaus abgenommen (AskUserQuestion)

1. **Hinweis-Wortlaut** = **voll** (Brief-Vorschlag): „Je konkreter, desto
   besser findet dich das Mycel. Beschreibe in eigenen Worten: was die
   App/Seite ist, wofür man sie nutzt, welche Themen/Stichworte sie abdeckt,
   für wen sie gedacht ist. Ein gut gefüllter Absatz (ca. 3–8 Sätze) ist
   ideal — gern auch die README hineinkopieren … Vermeide reine
   Schlagwort-Listen ohne Kontext."
2. **Umfang** = **Textfeld-Fokus jetzt**. Die volle Mein-Tresor-Optik der
   Siegel-Darstellung (Erklär-Prosa, „Warum wichtig?", Andock-Block,
   menschlich lesbare Pflicht-Modul-Zeilen) kommt als eigener Folge-PR —
   Modul 16 ist netzweit geteilt, deshalb der kleinere, sichere Schritt zuerst.

## Was gemacht wurde

### `index.html` (Sage-Page, Host-Wiring)
- Neuer `SBKIM_SEMANTIK_CONFIG`-Block (Knoten-Stammdaten + Placeholder +
  Hinweis + Skin). **Netzweit kopierbar:** nur diese CONFIG variiert pro
  Knoten, die Logik bleibt identisch.
- `injectIdentityLinkIntoSiegel` hängt jetzt direkt unter dem 🔑-Knopf einen
  **Semantik-Block** ein: auto-wachsendes `<textarea>` (Höhe folgt Inhalt,
  vorbefüllt mit der aktuellen `domainDescription` oder Default) + Hinweis +
  Knopf „Beschreibung übernehmen → Vektor & Spore neu signieren" + Status-`<pre>`.
- `sageReSignWithDescription`: `getOrCreateIdentity()` (vorhandener Schlüssel
  → gleiche nodeId) → `SbkimEmbedding.embedPassage(beschreibung)` (mit
  Lade-Fortschritt) → `SbkimSpore.generateOwnSpore({ …, domainDescription,
  domainVector })` → Download `spore.json` + Erfolgsmeldung (nodeId, L2).
- Bestehender `andockStep2Spore` zieht seine Felder aus derselben CONFIG
  (Duplikat entfernt, eine Quelle der Wahrheit).
- CSS für `.sage-semantik-out` (Pulse/ok/err) ergänzt.

### `src/modules/16_siegel.js` (Render-Modul, bleibt nicht protokoll-aktiv)
- `BRONZE_HINWEIS_HTML_FALLBACK`-Konstante entfernt.
- `renderBronzeHinweisBlock`: der `[data-siegel-andock-btn]`-Knopf mit der
  3-Pfad-`SbkimToolPwa`/„Modul 18 …"-Logik ist raus. Der Bronze-Block ist
  jetzt reiner Hinweis-Text und verweist auf den 🔑-Knopf (vom Host
  eingehängt) — ein einziger, sauberer Identitäts-/Andock-Pfad.
- Neuer `ZERTIFIKAT_ASPEKTE`-Eintrag „Semantische Selbst-Beschreibung im
  Siegel" (2026-06-07, module 16) — Pflicht-Konvention „Sicherheits-Module
  pflegen Aspekte".

### Tests
- `tests/smoke_bau16_sub_e_bronze.mjs`: Probe 5/13/14/15 an das neue
  Verhalten angepasst (kein Andock-Knopf, kein „Modul 18"-Text, Verweis auf
  🔑-Knopf, „Mycel-Aktivität"-Aspekt über since/module statt Position
  gefunden). → **16/16 grün.**
- `tests/manual_check.html` Panel-16 Test 12 entsprechend nachgezogen.

## Sichttest-Status

**Textfeld-Sichttest ungeprüft — wartet auf Klaus' Galaxy-Tab-S6-Browser.**
Headless: Modul-16-Smoke 16/16, Modul 04/15/17/18 grün, `node --check` auf
Modul 16 + extrahiertem index.html-Script OK. Die übrigen Smokes
(02y/05y/06y/07y/08y/01-Pflege) scheitern nur am fehlenden `fake-indexeddb`
im frischen Container (kein `node_modules`) — unberührt von dieser Änderung.

## Nächster sinnvoller Schritt

1. Klaus' Browser-Sichttest auf der Sage-Page: Siegel-Badge klicken →
   Textfeld unter dem 🔑-Knopf sichtbar, wächst beim Tippen, Placeholder +
   voller Hinweis da; eine Beschreibung eingeben → „Spore neu signieren" →
   `spore.json`-Download + Erfolgsmeldung (gleiche nodeId).
2. Falls grün: `spore.json` nach `sbkim/spore.json` committen (treffenderer
   `domainVector`), Live-Cosinus gegen Nachbarn prüfen.
3. Folge-PR (optional): Mein-Tresor-Voll-Optik der Siegel-Darstellung
   (Best-of-both-Checkliste aus dem Brief).
