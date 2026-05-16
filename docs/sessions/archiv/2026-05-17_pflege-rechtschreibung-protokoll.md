# Mini-Pflege 2026-05-17 — Rechtschreibung „Protokoll" mit zwei L

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase (reine
Text-Korrektur). Branch `claude/pflege-rechtschreibung-protokoll`.

**Anlass:** Klaus' Beobachtung: das deutsche Wort „Protokoll"
wird im Repo an einigen Stellen mit nur einem L geschrieben
(Tippfehler), unter anderem in der Sage-Page-UI (Footer-Label,
Hero-Untertitel „Mycel-Protokol", Card-Tag „Über das Protokol").

---

## Klaus' Regel

| Schreibweise | Status | Begründung |
|---|---|---|
| **Sage-Protokol** | bleibt mit einem L | englischer Eigenname des Projekts/Repos |
| **Sage·Protokol** (mit Mittelpunkt) | bleibt | gleiche Eigennamens-Schreibweise |
| **Mycel-Protokoll** | zwei L | deutsches Wort (Mycel ist deutsch) |
| **Protokoll** (generisch, deutsch) | zwei L | normaler deutscher Sprachgebrauch |
| `protocolVersion` (Variable) | bleibt | englisch, API-Identifier |
| `PROTOCOL_VERSION` (Konstante) | bleibt | englisch, §0-Konstante |

---

## Auftrag

1. Zwei-Pass-`sed` durch `*.md`, `*.html`, `*.json`, `*.js`:
   - Pass 1: alle `\bProtokol\b` → `Protokoll`.
   - Pass 2: `Sage-Protokoll` / `Sage·Protokoll` / `Sage Protokoll` /
     `Sage_Protokoll` zurück zu Eigennamens-Form (ein L).
2. Validierung: `status.json` valid JSON, `index.html` Parse OK,
   Inline-JS via `node --check` OK.
3. PULS § Sitzungs-Eintrag + Archiv-Index-Zeile.

---

## Was getan

```bash
# Pass 1: alle "Protokol" (Wortgrenzen) → "Protokoll"
find . -type f \( -name "*.md" -o -name "*.html" -o -name "*.json" -o -name "*.js" \) \
  -not -path "./.git/*" \
  -exec sed -i 's/\bProtokol\b/Protokoll/g' {} \;

# Pass 2: Eigenname Sage-Protokol (alle Trenner-Varianten) zurück
find . -type f \( -name "*.md" -o -name "*.html" -o -name "*.json" -o -name "*.js" \) \
  -not -path "./.git/*" \
  -exec sed -i \
    -e 's/Sage-Protokoll/Sage-Protokol/g' \
    -e 's/Sage·Protokoll/Sage·Protokol/g' \
    -e 's/Sage Protokoll/Sage Protokol/g' \
    -e 's/Sage_Protokoll/Sage_Protokol/g' \
    {} \;
```

### Tatsächlich geänderte Dateien (7)

- **`index.html`** — Hero-Untertitel „Mycel-Protokoll", Meta-Description
  „peer-to-peer Mycel-Protokoll", Card-Tag „Über das Protokoll · Lesematerial",
  Footer-Label „Protokoll", Data-Screen-Definitionsliste-Labels „Protokoll".
- **`docs/INTERFACES.md`** — eine Stelle.
- **`docs/PAPER_NUTZEN_UND_INTEGRATION.md`** — 22 Stellen (Paper-Text).
- **`docs/components/06_heterokaryose.md`** — eine Stelle.
- **`docs/components/09_einbau_pwa.md`** — 20 Stellen.
- **`docs/sessions/archiv/2026-05-14_spec-09-einbau-pwa.md`** — eine Stelle.
- **`docs/sessions/archiv/2026-05-15_pflege-09-schritt-9-doku-ttl.md`** — vier Stellen.

### Treffer, die UNBERÜHRT blieben (Eigenname)

- `Sage·Protokol` im HTML-Title und Header-Logo.
- `Sage-Protokol` in URL-Pfaden zu `github.com/lausiklauskn-png/Sage-Protokol/...`
  (in Markdown-Links, HTML-Anchors).
- `status.json` `"name": "Sage-Protokol"`.
- JS-Kommentar in `src/modules/02_spore.js`.
- `tests/manual_check.html` (zwei Stellen mit „Sage-Protokol").
- `CLAUDE.md` (drei Stellen mit „Sage-Protokol").

---

## Bewusst nicht angefasst

- **GitHub-Repo-Name `lausiklauskn-png/Sage-Protokol`** — Klaus'
  Entscheidung: der englische Eigenname bleibt.
- **Repo-URLs in Doku / Sage-Page** (`github.com/.../Sage-Protokol/...`,
  `lausiklauskn-png.github.io/Sage-Protokol/...`) — sonst 404.
- **`protocolVersion`-Konstante** und `PROTOCOL_VERSION` — englisch,
  ein L korrekt.
- **SBKIM-Cross-Knoten-Verbindung** ist null betroffen. Endknoten
  Mein-Mixarium und Mein-Rezeptbuch hängen technisch nicht vom
  Sage-Repo-Namen oder seinen Doku-Texten ab. Die Cross-Knoten-
  Verbindung läuft direkt zwischen Endknoten via Service-Worker-
  POST + MessageChannel — kein Sage-Repo-Pfad im Daten-Pfad.
- **Modul-Code** in `src/modules/*` (außer Kommentar in
  `02_spore.js`, der bleibt mit Eigenname „Sage-Protokol").
- **`status.json`-Schema** und Modul-Beschreibungen unverändert.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.
- **`update_puls_pie.py`** NICHT aufgerufen.

---

## Validierung

- **`status.json` valid JSON** (`python3 -c "import json; json.load(...)"`)
- **`index.html` HTML-Parse** via Python `html.parser`: OK.
- **`index.html` Inline-JS** (Zeile 968–1868) via `node --check`: OK.
- **Stichprobe Mycel-Protokoll:** Hero-Titel + Meta-Description +
  Body-Headline alle drei mit zwei L.
- **Stichprobe Sage·Protokol:** HTML-Title bleibt korrekt mit einem L.
- **Repo-URL-Stichprobe:** `github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/PAPER_NUTZEN_UND_INTEGRATION.md`
  unverändert.

---

## Was offen blieb

- Restliche offene Punkte aus Cross-Knoten-Handshake-Sitzung +
  Sage-Page-Live-Status-Pflege unverändert
  (Tablet-Neustart-Sichttest für SW-Bridge-Phantom-Cache,
  Modul-15-Spec Sichtbarkeits-Lampen, `domainKeywords`-
  Hartkodierung in Endknoten).

---

## Nächster sinnvoller Schritt

1. **Klaus' Sichttest der Sage-Page** im Browser — Hero-Titel
   zeigt „Mycel-Protokoll", Footer-Label „Protokoll", aber
   Tab-Titel und Header-Logo weiter „Sage·Protokol" (Eigenname).
2. **Tablet-Neustart-Sichttest** für SW-Bridge-Phantom-Cache.
3. **Spec-Sitzung Modul 15 Sichtbarkeits-Lampen + Events-Strom**.

---

**Branch:** `claude/pflege-rechtschreibung-protokoll`.
**Vorgänger:** Mini-Pflege Sage-Page Live-Status (PR #66, gemerged).
