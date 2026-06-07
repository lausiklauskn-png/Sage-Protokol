# BRIEF — Bau: Semantik-Beschreibungs-Textfeld im Andock-/Identitäts-Modul

**Erstellt:** 2026-06-07 · **Typ:** Bau-Sitzung (in Sage-Protokol) ·
**Auslöser:** Klaus' Festlegung 2026-06-07 — bei der Neu-Vergabe von Identität + Vektor-Spore
soll gleichzeitig eine **bessere, reichere semantische Beschreibung** erfasst werden, damit
der `domainVector` (Modul 03) treffender wird → bessere semantische Auffindbarkeit (Modul 04).

> **Freibrief gilt** (CLAUDE.md § Freibrief). Wo eine Entscheidung mehrdeutig oder
> architektonisch tief ist: erst Klaus fragen. Diese Sitzung schreibt **Code** (Andock-/
> Siegel-UI + Embedding-Anbindung) — Pflichtleseliste beachten.

---

## Ziel in einem Satz

Im Andock-/Identitäts-Modul, das der Button **„🔑 Eigene Identität & Spore erzeugen /
verwalten →"** öffnet, erscheint ein **auto-wachsendes Textfeld** für die **semantische
Beschreibung** der App/Website/des Knotens; dieser Text wird die Grundlage des
`domainVector` (Modul 03) und landet als `domainDescription` in der signierten Spore.

---

## Genauer Ort (vom Betreiber benannt + per Screenshot bestätigt 2026-06-07)

- **Auslöser-Button:** `🔑 Eigene Identität & Spore erzeugen / verwalten →`
  (Sage-Page; in/bei der Siegel-/Andock-Ansicht). **Schritt 0 der Sitzung:** diesen Button
  in `index.html` finden (Such-Strings: „Eigene Identität", „Spore erzeugen", „andock",
  Modul 16 Siegel-Modal / Modul 18 ToolPwa / Andock-Wizard Karte 4).
- Beim Klick öffnet sich das **Andock-Modul** (bei Mein-Tresor die Seite
  `werkzeuge/andock.html` „SBKIM-Andock — Identität & verified-match") mit: Export/Import
  (Backup), ID-Erzeugung (Teil A), und **Teil B = echten domainVector erzeugen + Spore neu
  signieren**.
- **Klaus' präziser Anker („dort hinein"):** in **Teil B, Abschnitt ② „Echten domainVector
  erzeugen (Modul 03)"** — dort steht heute „rechnet den 384-dim Vektor aus **unserem
  Domänen-Text**" + Button **„domainVector erzeugen"**. **Genau dieser „Domänen-Text" wird
  das neue Textfeld.** Das Feld liefert den Text, den Modul 03 einbettet — statt eines fest
  verdrahteten/kurzen Domänentextes.
- Reihenfolge: Textfeld **über** dem „domainVector erzeugen"-Button, sodass der eingegebene
  Text beim Klick eingebettet → in die Spore geschrieben → neu signiert wird.

## Design-Referenz: Mein-Tresor-Repo

Die **Gestaltung des Siegel-/Andock-Inhalts orientiert sich am Mein-Tresor-Repo** (Klaus'
Vorgabe). **Schritt 1:** die Referenz roh holen + studieren (nur lesen, nicht 1:1 ziehen —
in Sage-Identität re-skinnen):
- `https://raw.githubusercontent.com/lausiklauskn-png/Mein-Tresor/main/index.html`
  (Siegel-Modal, Andock-Wizard, der Pfad „Identität + Spore + Backup")
- ggf. `…/Mein-Tresor/main/werkzeuge/andock.html` (dort hat Klaus mit Modul 03 den echten
  384-dim-`domainVector` im Browser erzeugt — das ist genau der Einbettungs-Pfad, an den das
  Textfeld andockt)
- Sages eigener Embedding-Pfad zum Abgleich: `tools/embed_helper.html` + `src/modules/03_embedding.js`.

---

## Das Textfeld (Anforderungen, von Klaus)

1. **Auto-wachsend.** Ausreichend groß als Startgröße, wächst mit der eingegebenen Textmenge
   (z. B. `textarea` mit `input`-Handler, der `style.height = scrollHeight` setzt; oder
   CSS `field-sizing: content` mit Fallback). Kein winziges einzeiliges Feld.
2. **Placeholder:** „**Beschreibe deine App neu oder kopiere die Beschreibung / README hier
   hinein.**"
3. **Kurzer Hinweis darunter** (Erläuterung, *wie* gut beschrieben wird) — treffender
   Inhalt, Länge, Stil. Vorschlag (Wortlaut in der Sitzung mit Klaus feinjustieren):
   > *„Je konkreter, desto besser findet dich das Mycel. Beschreibe in eigenen Worten:
   > **was** die App/Seite ist, **wofür** man sie nutzt, **welche Themen/Stichworte** sie
   > abdeckt, **für wen** sie gedacht ist. Ein gut gefüllter Absatz (ca. 3–8 Sätze) ist ideal —
   > gern auch die **README** hineinkopieren, sie beschreibt das Projekt meist am treffendsten.
   > Vermeide reine Schlagwort-Listen ohne Kontext."*
4. **Inhalts-Quelle = beides, README empfohlen** (Klaus' Wortlaut „… neu oder kopiere die
   Beschreibung hier hinein"): das eine Textfeld nimmt **freien Beschreibungstext ODER eine
   eingefügte README** entgegen. Der Hinweis empfiehlt README als beste Quelle.
   *(Falls Klaus doch reine-README-Vorgabe will: Hinweis-Wortlaut anpassen — Feld bleibt gleich.)*

---

## Anbindung an Vektor/Spore (der eigentliche Zweck)

- Der Textfeld-Inhalt wird die **`domainDescription`** der Spore (§2-Feld) und der
  **Embedding-Eingang** für Modul 03: `embedPassage` mit `passage: `-Präfix,
  `Xenova/multilingual-e5-small`, mean-pooled, **L2-normalisiert**, 384-dim → `domainVector`.
- Dieser frische `domainVector` wird **in die Spore eingebettet** und die Spore
  **mit dem vorhandenen Schlüssel neu signiert** (nodeId bleibt gleich — sie hängt nur am
  Schlüssel, nicht am Inhalt; INTERFACES §11.1/§11.5).
- **Ergebnis:** Wer eine neue Identität/Spore erzeugt ODER seine Beschreibung verbessert,
  bekommt einen treffenderen Vektor → bessere `verified-match`-Werte im Netz.

**Entscheidung für die Sitzung (mit Klaus klären, falls unklar):** Ob das Textfeld direkt
den vollen „re-embed + re-sign"-Pfad auslöst (braucht den privaten Schlüssel im Wizard,
wie bei Mein-Tresors `werkzeuge/andock.html`) **oder** zunächst nur `domainDescription` +
Vorschau erzeugt und das Signieren der bestehende Wizard-Schritt bleibt. Empfehlung:
in den **bestehenden Erzeugen/Neu-Signieren-Schritt integrieren** (ein durchgehender Fluss),
da genau das der Sinn ist — die bessere Beschreibung soll in die signierte Spore.

---

## Pflichtleseliste (in dieser Reihenfolge)

1. `CLAUDE.md` (insb. § Freibrief, § Pipeline-Reihenfolge, § Tafel-Evolutions-Klausel)
2. `docs/PULS.md` (Schnellüberblick + die 2026-06-07-Einträge)
3. `docs/INTERFACES.md` § 1 Modul 16 (Siegel) + Modul 02 (Spore-Schema, `domainDescription`/
   `domainVector`) + Modul 03 (Embedding) + §11.5 (Pflichtfelder)
4. `docs/components/16_siegel.md` + (falls vorhanden) `18_tool_pwa.md` / `19_andock_wizard.md`
5. `src/modules/16_siegel.js`, `src/modules/02_spore.js`, `src/modules/03_embedding.js`
6. Mein-Tresor-Referenz (raw, siehe oben)

## Was du NICHT tust
- **Modul 16 (Siegel) nicht protokoll-aktiv umbauen** — es bleibt Render-Modul. Das Textfeld
  gehört in den Andock-/Identitäts-Pfad (Spore-Erzeugung), nicht ins reine Siegel-Render.
- **Keine neue Krypto / kein neuer Signier-Algorithmus** — bestehenden Modul-02-Pfad nutzen.
- **Kein PII/Secret** ins Repo; privater Schlüssel bleibt im Browser.
- **Sage-Page-Navleisten-Lampen** unangetastet (Sage-spezifischer Pfad).

## Pflicht am Ende
- Sichttest IN BROWSER (Klaus): Button öffnet Modul, Textfeld da, wächst mit Text,
  Placeholder + Hinweis sichtbar, Beschreibung fließt in Spore/Vektor — ODER explizit
  „Sichttest ungeprüft, wartet auf Klaus" markieren.
- `docs/components/16_siegel.md` (bzw. die betroffene Karte) „Code geschrieben"-Zeile.
- `docs/PULS.md`-Eintrag + Übergabeprotokoll.
- Wenn Sicherheits-/Schutz-relevant berührt: `ZERTIFIKAT_ASPEKTE`-Eintrag in
  `src/modules/16_siegel.js` prüfen (CLAUDE.md § „Sicherheits-Module pflegen Aspekte").
- Commit + Push auf eigenen Branch (`claude/bau-andock-semantik-beschreibung` o. ä.),
  Draft-PR. Merge entscheidet Klaus.

## Offene Punkte, die Klaus am Start bestätigen sollte
1. **Hinweis-Wortlaut** (Punkt 3 oben) — final abnehmen.
2. **Re-embed/re-sign-Tiefe** — voller Fluss (empfohlen) oder Vorschau + späteres Signieren.
3. Ob das Textfeld **nur in Sage** gebaut wird oder direkt so, dass es **netzweit
   kopierbar** ist (Mein-Tresor/Mixarium/Rezeptbuch/SB-KIMTool übernehmen es später —
   passt zur „alle Knoten gleich"-Linie).

---

## Freibrief
Freibrief gilt, siehe `CLAUDE.md § Freibrief`.
