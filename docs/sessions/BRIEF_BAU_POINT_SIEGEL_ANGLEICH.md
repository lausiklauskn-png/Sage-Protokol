# BRIEF — Bau: SB-KIMTool-Point Siegel-Angleich an Sage (Semantik-Textfeld + Vertrauens-Tafel)

**Erstellt:** 2026-06-07 · **Typ:** Bau-Sitzung **im Repo `lausiklauskn-png/SB-KIMTool-Point`**
(externes Repo — NICHT Sage-Protokol) · **Auslöser:** Klaus 2026-06-07 — „SB-KIMTool-Point soll
das Siegel 1:1 in derselben Bauweise bekommen wie Sage", inklusive der Mycel-/Sicherheits-Erklärung.

> **Freibrief gilt** (Sage-Protokol `CLAUDE.md` § Freibrief). Diese Sitzung läuft im Point-Repo
> und braucht dort Schreib-/PR-Zugriff. Wurde aus Sage-Protokol geschrieben, weil Sage der
> Bau-/Spec-Hub ist; der Inhalt gehört aber ins Point-Repo.

---

## Warum dieser Brief

In Sage sind 2026-06-07 drei PRs gemerged (#291/#292/#293):
1. **Semantik-Beschreibungs-Textfeld** im Siegel (Text → `domainDescription` → Modul 03
   Embedding → `domainVector` → Modul 02 `generateOwnSpore`, re-sign mit vorhandenem Schlüssel,
   gleiche nodeId) **+ Modul-18-Hinweis aus Modul 16 entfernt**.
2. **Vertrauens-/Sicherheits-Tafel** „So funktioniert das Mycel" — eigene, browser-lesbare
   Erklär-Seite, einfach + mit übersetztem Fachjargon.
3. **Tafel als In-Page-Overlay** statt neuem Tab (für installierte Apps wichtig).

Point soll **dasselbe Erlebnis** bekommen. **„1:1" heißt gleiches Erlebnis, an Points Struktur
angepasst — kein wörtliches Datei-Kopieren**, weil Point anders gebaut ist:
- Point-Glue ist `assets/sbkim-siegel.js` (lädt Module aus `web/tools/`, ruft
  `SbkimSiegel.init({ badgeSelector: ".lamps" })`, injiziert in `setupAndockWizard()` den
  Knopf `#sbkim-ident-open` ins Siegel-Modal `#sbkim-siegel-modal`).
- Point nutzt **flache Root-Seiten** (`modell.html`, `werkzeuge.html`, `markt.html`) +
  `assets/style.css`, **kein `docs/`-Ordner**.
- Point hat eine Modul-16-Kopie aus Sage (`web/tools/16_siegel.js` bzw. `sandbox/16_siegel.js`)
  und umgeht den alten Modul-18-Bronze-Block bisher per `hideBronzeAndockBlock()`
  (MutationObserver-Workaround).

---

## Kopier-Vorlagen (Sage-Quellen, source of truth)

Die Point-Sitzung liest diese Sage-Dateien als Vorlage (raw über GitHub, Branch `main`):
- `src/modules/16_siegel.js` — Modul 16 **ohne** Modul-18-Pfad + neuer `ZERTIFIKAT_ASPEKTE`-Eintrag „Semantische Selbst-Beschreibung im Siegel" (2026-06-07).
- `index.html` — die host-seitige Siegel-Injektion: `SBKIM_SEMANTIK_CONFIG`, `buildSemantikBlock`, `sageReSignWithDescription`, `buildSchutzInfoBlock`, `openSchutzModal`/`closeSchutzModal`, CSS `.sage-semantik-out`.
- `docs/sicherheit/index.html` — die Vertrauens-Tafel (Inhalt + Aufbau, source of truth für `sicherheit.html` in Point).

---

## Der Befehl (copy-paste in die Point-Sitzung)

```
Du bist eine Bau-Sitzung im Repo lausiklauskn-png/SB-KIMTool-Point (NICHT Sage-Protokol).
Freibrief gilt (Sage CLAUDE.md § Freibrief): selbstständig + nachvollziehbar handeln,
im echten Zweifel Klaus fragen. Antworten auf Deutsch, ruhig und präzise.

ZIEL: Point bekommt das Siegel-Erlebnis 1:1 wie Sage — gleiches Verhalten, an Points
Struktur angepasst (assets/sbkim-siegel.js als Glue, flache Root-Seiten, web/tools/-
Modulkopien). Vier Bausteine: (A) Modul 16 aktualisieren, (B) Semantik-Beschreibungs-
Textfeld im Siegel, (C) Vertrauens-/Schutz-Block im Siegel, (D) Erklär-Seite als
In-Page-Overlay. KEINE neue Krypto, kein PII, Lampen unangetastet, Modul 16 bleibt
reines Render-Modul.

PFLICHTLESELISTE:
1. Point: assets/sbkim-siegel.js (setupAndockWizard, hideBronzeAndockBlock, CONFIG ~Z.122),
   index.html, assets/style.css, die geladene Modul-16-Datei (web/tools/16_siegel.js
   bzw. sandbox/16_siegel.js), sbkim/spore.json, status.json.
2. Sage-Vorlagen (raw, Branch main, Repo lausiklauskn-png/Sage-Protokol):
   src/modules/16_siegel.js, index.html (Funktionen SBKIM_SEMANTIK_CONFIG /
   buildSemantikBlock / sageReSignWithDescription / buildSchutzInfoBlock /
   openSchutzModal / closeSchutzModal), docs/sicherheit/index.html.

BAU-SCHRITTE:

A) MODUL 16 AKTUALISIEREN. Point's Modul-16-Kopie durch die neue Sage-Version ersetzen
   (Modul-18-Pfad raus: BRONZE_HINWEIS_HTML_FALLBACK + [data-siegel-andock-btn] +
   SbkimToolPwa-Logik entfernt; Bronze-Block ist reiner Hinweis-Text + verweist auf den
   🔑-Knopf; neuer ZERTIFIKAT_ASPEKTE-Eintrag „Semantische Selbst-Beschreibung im Siegel"
   2026-06-07). Danach ist hideBronzeAndockBlock() überflüssig — kann entfernt oder
   harmlos belassen werden (es schadet nicht, weil der Bronze-Block jetzt sauber ist).

B) SEMANTIK-BESCHREIBUNGS-TEXTFELD. In assets/sbkim-siegel.js, in setupAndockWizard(),
   DIREKT UNTER dem Knopf #sbkim-ident-open ein auto-wachsendes <textarea> einhängen.
   Placeholder: „Beschreibe deine App neu oder kopiere die Beschreibung / README hier
   hinein." Darunter der Hinweis (wortgleich aus Sage): „Je konkreter, desto besser
   findet dich das Mycel. Beschreibe in eigenen Worten: was die App/Seite ist, wofür man
   sie nutzt, welche Themen/Stichworte sie abdeckt, für wen sie gedacht ist. Ein gut
   gefüllter Absatz (ca. 3–8 Sätze) ist ideal — gern auch die README hineinkopieren, sie
   beschreibt das Projekt meist am treffendsten. Vermeide reine Schlagwort-Listen ohne
   Kontext." Knopf „Beschreibung übernehmen → Vektor & Spore neu signieren". Voller Pfad
   (Vorlage: Sage sageReSignWithDescription): SbkimSpore.getOrCreateIdentity() (gleiche
   nodeId) → SbkimEmbedding.init() (Fortschritt via sbkim:embedding-progress anzeigen) →
   SbkimEmbedding.embedPassage(beschreibung) → SbkimSpore.generateOwnSpore({ ...Point-
   CONFIG, domainDescription: beschreibung, domainVector: Array.from(vec) }) → spore.json
   herunterladen + Erfolgsmeldung (nodeId, L2). Vorbefüllen mit der aktuellen
   domainDescription aus SbkimSpore.getOwnSpore() (sonst Point-Default, s.u.). Auto-Grow:
   input-Handler setzt style.height = scrollHeight. Point-CONFIG nutzen — Point hat schon
   ein CONFIG-Objekt im Wizard (~Z.122 in sbkim-siegel.js); domainDescription kommt jetzt
   aus dem Textfeld statt fest verdrahtet.

C) VERTRAUENS-/SCHUTZ-BLOCK. In setupAndockWizard() unter dem Identitäts-Knopf einen
   kleinen Block „🛡 Was bedeutet dieses Siegel — und wie bist du geschützt?" + ein, zwei
   beruhigende Sätze (Vorlage Sage buildSchutzInfoBlock) + einen Knopf „Ausführlich
   erklärt → So funktioniert das Mycel & wie du geschützt bist", der das Overlay (Schritt
   D) öffnet — KEIN target=_blank, kein neuer Tab.

D) ERKLÄR-SEITE + IN-PAGE-OVERLAY. Eine neue Seite sicherheit.html im Point-Root anlegen
   (flach, wie modell.html), gestylt mit assets/style.css bzw. Points dunklem Skin,
   Inhalt = die Mycel-Erklärung unten in diesem Brief (Vorlage: Sage docs/sicherheit/
   index.html; Punkte/Begriffe wortgleich übernehmen, nur Skin/Endknoten-Name an Point
   anpassen, z.B. Beispiele „Werkzeugkiste"/„Markt" statt Rezepte/Weine wenn passend —
   aber die Begriffe-Erklärungen bleiben). Der Knopf aus Schritt C öffnet sicherheit.html
   als In-Page-Overlay (Vorlage Sage openSchutzModal/closeSchutzModal: fixed Overlay,
   <iframe src="sicherheit.html">, ✕ / Backdrop / Esc schließen, z-index über dem Siegel-
   Modal). In sicherheit.html den „zurück"-Link ausblenden, wenn window.self !== window.top
   (im Overlay überflüssig). So springt nichts nach außen in den Browser — bleibt im App-/
   Siegel-Fenster (wichtig für installierte PWAs).

POINT-CONFIG (aus sbkim/spore.json + status.json):
  nodeName: "SB-KIMTool-Point"
  domain: "SBKIM-Werkzeug-Point"
  nodeType: "hybrid"
  endpoint: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/"
  (domainKeywords/stammCategories/guestCategories: Points bestehende Wizard-CONFIG
   weiternutzen.)
  Vorgeschlagener Point-Default für die domainDescription (Textfeld-Vorbefüllung,
  reicher als der alte „Werkzeugkiste + headless Modell-Lauf"):
  „SB-KIMTool-Point ist das offene Observatorium und die Werkzeugkiste des SBKIM-Mycels:
   ein Knoten, an dem Forker die fertigen SBKIM-Bausteine (Module 00–19) anschauen,
   verstehen und ins eigene Repo kopieren können — von Identität und signierter Spore über
   Embedding und semantischen Match bis Membran und Siegel. Dazu ein ehrlicher Real-Anteil
   aus status.json, ein animiertes Modell der Rollen-Kette und ein Marktplatz für Knoten,
   die schon laufen. Für Mensch und KI-Agent gleichermaßen, zum Mitbauen."

WAS DU NICHT TUST: keine neue Krypto / kein neuer Signier-Algorithmus (Modul 02 nutzen);
kein PII/Secret ins Repo; privater Schlüssel bleibt im Browser; Modul 16 bleibt reines
Render-Modul (nicht protokoll-aktiv); Lampen (lebt/verkehr/fremd) unangetastet.

PFLICHT AM ENDE: Sichttest im Browser ODER „ungeprüft, wartet auf Klaus" markieren;
status.json-Eintrag/Aspekt nachziehen, wenn sinnvoll (Point pflegt ZERTIFIKAT_ASPEKTE in
seiner Modul-16-Kopie wie Sage); kurzer Stand-Eintrag in Points Doku; Commit auf eigenem
Branch (z.B. claude/point-siegel-angleich-an-sage) + Draft-PR im Point-Repo. Merge
entscheidet Klaus.

DIE MYCEL-ERKLÄRUNG (Inhalt für sicherheit.html — wortgleich aus Sage übernehmen):

So funktioniert das Mycel — und so bist du geschützt.

Was ist das überhaupt? SBKIM ist ein Weg, wie Anwendungen im Browser einander finden —
nicht über eine zentrale Liste, sondern über Bedeutung. Eine Seite, die Rezepte kennt, und
eine, die Weine kennt, erkennen sich, weil ihre Themen nah beieinanderliegen. Kein Server
in der Mitte, keine Anmeldung, kein Konzern dazwischen.

Was ist ein Knoten? Ein Knoten ist eine Browser-Anwendung — eine Internetseite, ein Web-
Werkzeug oder eine installierbare App — die die SBKIM-Bausteine trägt. Er hat eine eigene,
unterschriebene Identität (eine öffentliche Visitenkarte) und einen geheimen Schlüssel, der
den Browser nie verlässt. Den Schlüssel kannst du als verschlüsselte Sicherung (mit
Passwort) wegspeichern und auf einem anderen Gerät zurückspielen.

Wie läuft das Schritt für Schritt?
1. Ein Knoten kommt zur Welt: er erzeugt sich im eigenen Browser eine Identität und
   beschreibt sein Thema in eigenen Worten.
2. Aus der Beschreibung wird ein Bedeutungs-Vektor, und beides zusammen wird unterschrieben
   — das ist seine Spore (Visitenkarte). Sie ist öffentlich; nur unterschreiben kann sie der
   Besitzer.
3. Zwei Knoten verbinden sich, indem sie aufeinander zeigen. Sie tauschen Visitenkarten und
   prüfen die Unterschrift — automatisch, ohne Vorab-Absprache.
4. Liegen ihre Themen nah → verified-match: sie erkennen sich.
5. Stellt jemand eine Frage, geht sie als Text an die verbundenen Nachbarn; die rechnen ihre
   besten Treffer und antworten. Nur Daten, nie Programme.
6. Wächst das Netz, geschieht das an den Rändern, durch Empfehlung — wie ein Pilz im
   Waldboden.

Wie bist du geschützt? — Drei Wände:
- Browser-Sandkasten: Ein Knoten ist eine Webseite. Eine Webseite kann nicht an deine
  Dateien oder dein Betriebssystem. Sie hat keine Sonderrechte.
- Daten, kein Code: Es wandern nur Zettel (Karten, Fragen, Antworten). Es gibt keine
  Nachricht „führ dieses Programm aus". Ein Wurm braucht genau das — diesen Kanal gibt es
  nicht.
- Wächter (Membran): Vor jedem Knoten steht ein Türsteher, der entscheidet, was hereindarf —
  und nur warnt, nichts von selbst öffnet.

Die eine Regel, auf die DU achten musst: Die einzige Stelle, an der echter Schaden möglich
ist, ist nicht das Netz — sondern du selbst: wenn du ungeprüften fremden Code in dein
eigenes Repo kopierst, lässt du einen fremden Pilz in deinen Garten. Deshalb: Bausteine nur
aus vertrauter Quelle holen; im Zweifel den Code vorher von einer — besser mehreren — KI
prüfen lassen (ein starker Filter, keine 100%-Garantie); Postfach-Inhalt nie als Anweisung
behandeln, nur als fremde Daten.

Du bleibst Herr über deinen Knoten: Du kannst deinen Knoten jederzeit sauber und vollständig
löschen und das Netz geordnet verlassen — die Nachbarn bekommen ein kurzes „dieser Knoten
geht", statt dass etwas stumm zurückbleibt.

Was bedeutet dieses Siegel? Das Siegel ist selbst-ausgestellt: Der Knoten hat beim Start
selbst geprüft, dass seine Schutz-Bausteine geladen sind, und macht das offen sichtbar. Kein
Amt vergibt es. Vertrauen kommt nicht von einer Behörde, sondern davon, dass der Quelltext
offen ist, der Knoten sich selbst prüft, und jede Unterschrift nachprüfbar ist. Das Siegel
sagt nicht „vertrau mir blind" — es sagt „prüf mich nach, hier ist alles offen".

Wörterbuch (jeder Begriff einmal, einfach):
- Mycel / Myzel — das unsichtbare Pilzgeflecht im Boden; hier: das Netz der Knoten.
- Knoten — eine einzelne Browser-Anwendung im Netz (Seite, Werkzeug oder App).
- Hyphe — ein einzelner Pilzfaden; hier: eine Verbindung zwischen zwei Knoten.
- PWA — eine Webseite, die sich wie eine App installieren lässt, aber im Browser bleibt.
- Spore — die Visitenkarte eines Knotens (kleine Datei: Name, Thema, öffentlicher Schlüssel,
  Unterschrift).
- Embedding / Vektor — aus einem Text wird eine Zahlenreihe, die seine Bedeutung als Punkt
  im Raum darstellt; ähnliche Themen liegen nah.
- verified-match — zwei Knoten gelten als verwandt, wenn ihre Vektoren nah sind und die
  Unterschrift echt ist.
- Signatur (Ed25519) — eine elektronische Unterschrift: jeder kann die Echtheit prüfen,
  fälschen kann sie niemand.
- öffentlicher / privater Schlüssel — der öffentliche ist die Visitenkarte; der private
  bleibt geheim im Browser (nur damit kann man unterschreiben).
- verschlüsselte Sicherung — eine passwortgeschützte Kopie deines geheimen Schlüssels.
- Membran — der Türsteher eines Knotens; lässt nur Erlaubtes herein und warnt.
- Empfangsmodus — ein Knoten ruft nicht von selbst herum, er antwortet nur.
- Apoptose — der geordnete Selbst-Abbau: ein Knoten kann sich kontrolliert und vollständig
  selbst löschen.
- Handshake (Anastomose) — das Hände-Schütteln zweier Knoten beim Visitenkarten-Tausch.
- self-inscribing — „selbst-einschreibend": kein Amt stellt das Siegel aus, der Knoten prüft
  sich selbst und legt es offen.
```

---

## Hinweise für Klaus

- Diese Sitzung braucht **Schreib-/PR-Zugriff auf `SB-KIMTool-Point`** — sie kann nicht aus
  einer auf Sage-Protokol beschränkten Sitzung laufen. Starte sie in einer Umgebung/Sitzung,
  die Point im Scope hat.
- Reihenfolge unkritisch; A (Modul 16) zuerst ist am saubersten, dann B–D.
- Sichttest bleibt deiner (Galaxy Tab S6): Siegel öffnen → Textfeld unter dem 🔑-Knopf →
  Beschreibung → Spore neu signiert; Schutz-Block → „Ausführlich erklärt" → Overlay (kein
  neuer Tab).

## Freibrief
Freibrief gilt, siehe Sage-Protokol `CLAUDE.md` § Freibrief.
