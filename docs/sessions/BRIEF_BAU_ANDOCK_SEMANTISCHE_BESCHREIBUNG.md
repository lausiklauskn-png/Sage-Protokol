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

## Genauer Ort (Klaus' Entscheidung 2026-06-07, final)

- **Platzierung des Textfeldes:** **direkt im Siegel, in den Bereich UNTER dem Button
  `🔑 Eigene Identität & Spore erzeugen / verwalten →`.** Das auto-wachsende Textfeld sitzt
  also im Siegel-Modal unmittelbar unter diesem Button (nicht erst tief in der separaten
  Andock-Seite versteckt). **Schritt 0 der Sitzung:** diesen Button im Siegel-Modal finden
  (`index.html`; Such-Strings „Eigene Identität", „Spore erzeugen"; Modul 16 Siegel-Modal /
  Andock-Bereich).
- **Funktionale Verdrahtung (Referenz Mein-Tresor `werkzeuge/andock.html`, Teil B ②):**
  Der Textfeld-Inhalt ist der **„Domänen-Text"**, den **Modul 03** einbettet — genau die
  Stelle, die in der Referenz „rechnet den 384-dim Vektor aus unserem Domänen-Text" + Button
  „domainVector erzeugen" heißt. Statt eines fest verdrahteten/kurzen Domänentextes liefert
  künftig **das Textfeld** den Text. Der erzeugte Vektor → in die Spore → neu signiert.
- D. h.: **Feld im Siegel (UI-Ort), Embedding-/Signier-Logik wie in andock.html Teil B**
  (Verdrahtungs-Vorbild). Beides verbinden — das Feld im Siegel speist den Erzeugungs-/
  Signier-Fluss.

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

**Entscheidung (Klaus + Empfehlung bestätigt 2026-06-07): VOLLER PFAD — re-embed + re-sign.**
Das Textfeld löst den durchgehenden Fluss aus: Text → `domainDescription` → Modul-03-
Embedding → neuer `domainVector` → **in die Spore eingebettet + mit dem vorhandenen Schlüssel
neu signiert**. Begründung: Der `verified-match` rechnet gegen den **signierten** Vektor — eine
Beschreibung, die nicht eingebettet+signiert wird, ändert am Match nichts. **Keine neue
Krypto:** bestehenden Mechanismus „Identität aus Sicherung laden" (`node_key.enc.json` +
Passwort, Teil B ① der Referenz) + vorhandenen Signier-Schritt wiederverwenden. Privater
Schlüssel bleibt im Browser. Additiv, geringes Risiko.

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

## Entscheidungen (Stand 2026-06-07, final)
- ✅ **Ort:** Textfeld im Siegel, direkt unter dem Button „🔑 Eigene Identität & Spore
  erzeugen / verwalten →".
- ✅ **Tiefe:** voller Pfad re-embed + re-sign (signierte Spore), bestehende Krypto.
- ✅ **Inhalts-Quelle:** beides — Freitext ODER README einfügen (Placeholder), README empfohlen.
- ✅ **Reichweite:** **netzweit kopierbar** bauen (alle fünf Knoten übernehmen es 1:1).
  Struktur so halten, dass nur CONFIG/Skin pro Knoten variiert.
- ✅ **Design-Führung:** **am Mein-Tresor-Siegel orientieren** und **das Beste aus beiden
  (Sage + Mein-Tresor) zusammenbringen** — vom Design **eher Mein-Tresor**. Mein-Tresors
  `index.html` (Siegel-Modal + Andock) roh holen + als Leitbild nehmen, Sages funktionierende
  Teile (Modul 16 Render, reiche 📬-Karte) erhalten.

### Noch offen (Klaus am Start kurz bestätigen)
1. **Hinweis-Wortlaut** des Textfeld-Hinweises — final abnehmen oder kürzen.

## Best-of-both — Siegel-Merkmals-Checkliste (Klaus, 2026-06-07)

Mein-Tresors Siegel war **umfangreicher** (Darstellung), Sages Siegel hatte **ein paar
gute Punkte**, die nicht verloren gehen dürfen (Engine). Beides zusammenbringen, Design-
Führung Mein-Tresor. Konkret (Quellen: Mein-Tresor `index.html` `#mt-seal-dialog` Z. ~1489–1545;
Sage `src/modules/16_siegel.js`):

**Aus Mein-Tresor übernehmen (Umfang + Darstellung, Design-Leitbild):**
- **Erklär-Prosa** „Dieses Siegel bezeugt … kryptografisch geprüfte Identität (Ed25519) …
  fälschungssichere Visitenkarte" + Absatz **„Warum wichtig?"** (menschlich, nicht nur technisch).
- Der **🔑-Button** „Eigene Identität & Spore erzeugen / verwalten →" (darunter das neue Textfeld).
- Inline-Block **„🔗 Andock — Verbindung zum Werkzeug":** Endknoten / Endpunkt / nodeId /
  Spore (✔ VALID) + „SBKIM-Werkzeug öffnen ↗".
- **Menschlich lesbare Pflicht-Modul-Zeilen** (z. B. „01 · Storage · Tresor/Bibliothek
  (AES-256-GCM) · bereit") statt nur Status-Label.
- **„Bezeugt seit …"**-Datum.

**Aus Sage behalten (Engine — die guten Punkte):**
- **Echte Selbst-Prüfung beim Boot** (Surface-Check der 7 Pflicht-Module → ok/deferred/
  missing/broken) + **Anti-Greenwashing** (kein Badge, wenn nicht zertifiziert). → Die
  Modul-Liste wird **aus der echten Prüfung erzeugt**, NICHT hartkodiert; Mein-Tresors
  schöne Klartext-Beschreibung kommt als zusätzliches Beschreibungsfeld dazu (best of both).
- **Bronze/Gold-Mitgliedschaft** („im Mycel · ruhend / aktiv", `data-stufe`, Stufenwechsel
  bei echtem Hyphen-Verkehr).
- **self-inscribing-Aussteller-Zeile** („… hat sich beim Boot selbst geprüft. Vertrauen
  kommt vom Repo …") — ehrliche Herkunft.
- **Code-versionierte `ZERTIFIKAT_ASPEKTE`** (wächst mit Sicherheits-Updates, Pending-Marker)
  — Mein-Tresors erzählender Aspekt-Stil als Vorbild für die *Formulierung*, Sages Struktur
  als *Mechanik*.
- **Live-Cosinus** im 📬-/Andock-Kontext (schon gebaut).

Ergebnis: ein Siegel, das **aussieht/erklärt wie Mein-Tresor**, aber **verdient + selbst-
geprüft ist wie Sage** — netzweit identisch kopierbar.

## Zusätzliche Aufgabe: Modul-18-Hinweis aus dem Siegel entfernen (Klaus, 2026-06-07)

In den **(älteren) Siegeln** soll der **Hinweis auf Modul 18 ganz herausgenommen** werden.
Konkret in `src/modules/16_siegel.js` (und überall, wo das Siegel das erwähnt):
- `BRONZE_HINWEIS_HTML_FALLBACK` = „Modul 18 noch nicht verfügbar — …" → **entfernen/ersetzen**
  (kein „Modul 18"-Wortlaut mehr; stattdessen Verweis auf den Identitäts-Button + das neue
  Beschreibungs-Textfeld bzw. den Andock-Wizard).
- Der „Andocken"-Knopf-Pfad mit `SbkimToolPwa`/„Modul 18 ist geladen, aber…"/„Modul 18 nicht
  installiert" (Pfad 2/3 im Bronze-Block) → auf den **echten Identitäts-/Andock-Weg** umleiten,
  keine Modul-18-Fehlertexte mehr zeigen. (SB·KIMTool·Point hat genau das schon gemacht —
  „nur Identitäts-Knopf oben, wie Sage"; deren Lösung als zusätzliche Referenz ansehen.)
- Ziel: ein einziger, sauberer Andock-/Identitäts-Pfad im Siegel (Button „🔑 …" + Textfeld),
  ohne verwirrende Modul-18-Verweise. Netzweit gleich.

---

## Freibrief
Freibrief gilt, siehe `CLAUDE.md § Freibrief`.
