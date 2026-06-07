# BRIEF — Bau: Mein-Mixarium Siegel-Neugestaltung 1:1 wie Sage (Semantik-Textfeld + Vertrauens-Tafel + Modul-18-Hinweis raus)

**Erstellt:** 2026-06-07 · **Typ:** Bau-Sitzung **im Repo `lausiklauskn-png/Mein-Mixarium`**
(externes Endknoten-Repo) · **Auslöser:** Klaus 2026-06-07 — „Mein-Mixarium genauso wie
Mein-Rezeptbuch; Siegel gleich aufgebaut, läuft schon auf main."

> **Freibrief gilt** (Sage `CLAUDE.md` § Freibrief). Läuft im Mixarium-Repo, braucht dort
> Schreib-/PR-Zugriff. Aus Sage geschrieben (Bau-Hub).

---

## Verifizierte Mixarium-Struktur (2026-06-07, identisch zu Rezeptbuch, auf main)

- **Single-File `index.html`-PWA** (~1,3 MB) + Module unter `sbkim/*.js` (01–08, 15, 16, 17, 18,
  `sbkim-init.js`). **Liegt auf `main`** (Live-Pages, verified-match 0.8030).
- **Modul 16 (Render) = `sbkim/16_siegel.js`** → Datei für Schritt A.
- **Init = `sbkim/sbkim-init.js`**: `SbkimSiegel.init({ badgeSelector: "#sbkim-siegel-badge" })`
  (Badge via Modul 17 Floating-Widget), `SbkimToolPwa.init({…})` (Modul 18, aktiver Andock-
  Wizard wie Rezeptbuch), `SbkimSpore.init()`.
- **Spore-Erzeugung heute nur per DevTools**: `window.__sbkimErzeugeSpore()` — bettet die
  **Kategorie-Stichworte** ein (`embedPassage(stamm+gast+keywords)`), die `domainDescription`
  ist **fest verdrahtet**. → Das Textfeld bringt hier denselben Gewinn wie bei Rezeptbuch
  (reicher Beschreibungstext → besserer Vektor, In-Page-UI statt Konsole).

Sage-Quelldateien (Vorlage, raw, Branch main, Repo lausiklauskn-png/Sage-Protokol):
`src/modules/16_siegel.js`, `index.html` (`SBKIM_SEMANTIK_CONFIG`, `buildSemantikBlock`,
`sageReSignWithDescription`, `buildSchutzInfoBlock`, `openSchutzModal`/`closeSchutzModal`),
`docs/sicherheit/index.html`.

---

## Der Befehl (copy-paste in die Mixarium-Sitzung)

```
Du bist eine Bau-Sitzung im Repo lausiklauskn-png/Mein-Mixarium (Endknoten-PWA, NICHT
Sage-Protokol). Freibrief gilt (Sage CLAUDE.md § Freibrief). Antworten auf Deutsch, ruhig und
präzise. Klaus arbeitet auf einem Galaxy Tab S6; Sichttest bleibt seiner.

ZIEL: Mixarium bekommt die Siegel-Neugestaltung 1:1 wie Sage/Rezeptbuch — (A) Modul 16
aktualisieren (Modul-18-Hinweis raus + neuer Aspekt), (B) Semantik-Beschreibungs-Textfeld im
Siegel, das den Spore-Vektor speist, (C) Vertrauens-/Schutz-Block im Siegel, (D) Erklär-Seite
als In-Page-Overlay. KEINE neue Krypto, kein PII, Lampen/Widget-Slots unangetastet, Modul 16
bleibt reines Render-Modul.

SCHRITT 0 — REPO + BRANCH BESTÄTIGEN (PFLICHT, kurz):
Diese Aufgabe gilt für lausiklauskn-png/Mein-Mixarium; das SBKIM liegt auf main (läuft dort live
über Pages, verified-match 0.8030). ACHTUNG: es gibt ein altes blanco-Repo
lausiklauskn-png/Me-Mixarium OHNE SBKIM — NICHT gemeint. Führe ZUERST aus:
  git remote -v
  git branch --show-current
  ls sbkim/ 2>/dev/null || echo "KEIN sbkim/ auf aktuellem Branch"
Erwartung: remote enthält "Mein-Mixarium", Branch = main (sonst git checkout main && git pull
--ff-only), sbkim/ listet 16_siegel.js, sbkim-init.js, 02_spore.js, 03_embedding.js u.a.
- Wenn remote = Me-Mixarium / ein anderes Repo → STOPP, falsches Repo: melde zurück.
- Erst wenn sbkim/ mit den Modulen sichtbar ist, weiter.

ZUERST DEINE EIGENE STRUKTUR LESEN:
- index.html (Single-File-PWA), sbkim/sbkim-init.js, sbkim/16_siegel.js, sbkim/18_tool_pwa.js,
  sbkim/spore.json. Finde: das Siegel-Modal (#sbkim-siegel-modal), wo/ob ein Identitäts-Knopf
  injiziert wird, und window.__sbkimErzeugeSpore().
- Sage-Vorlagen (raw, Branch main, Repo lausiklauskn-png/Sage-Protokol): src/modules/16_siegel.js
  und index.html (Funktionen SBKIM_SEMANTIK_CONFIG / buildSemantikBlock /
  sageReSignWithDescription / buildSchutzInfoBlock / openSchutzModal / closeSchutzModal) und
  docs/sicherheit/index.html.

BAU-SCHRITTE:

A) MODUL 16 AKTUALISIEREN. sbkim/16_siegel.js durch Sages neue Version ersetzen (Modul-18-Pfad
   raus: BRONZE_HINWEIS_HTML_FALLBACK + [data-siegel-andock-btn] + SbkimToolPwa-Logik entfernt;
   Bronze-Block ist reiner Hinweis-Text + verweist auf den 🔑-Knopf; neuer ZERTIFIKAT_ASPEKTE-
   Eintrag „Semantische Selbst-Beschreibung im Siegel" 2026-06-07). Modul 16 ist ein reines
   Render-Modul, die Datei kann 1:1 aus Sage übernommen werden.

A2) ANDOCK-EINSTIEG ERSETZEN (wie Rezeptbuch). Weil A den Bronze-„Andocken→Modul 18"-Knopf
   entfernt, injiziere — wie Sage host-seitig — in das Siegel-Modal (#sbkim-siegel-modal) einen
   Knopf „🔑 Eigene Identität & Spore erzeugen / verwalten →" (z.B. in sbkim-init.js nach
   SbkimSiegel.init, mit MutationObserver auf das Modal, analog Sages injectIdentityLinkIntoSiegel
   + watchForSiegelModal). Modul 18 darf geladen bleiben, ist aber nicht mehr der Bronze-Andock-
   Trigger. Alternativ den 🔑-Knopf auf SbkimToolPwa.openAndockTab() zeigen lassen und das
   Textfeld (B) IN den Modul-18-Wizard setzen. Wähle den Weg, der weniger umbaut.

B) SEMANTIK-BESCHREIBUNGS-TEXTFELD. Direkt unter dem 🔑-Knopf ein auto-wachsendes <textarea>.
   Placeholder: „Beschreibe deine App neu oder kopiere die Beschreibung / README hier hinein."
   Hinweis wortgleich aus Sage (siehe unten). Knopf „Beschreibung übernehmen → Vektor & Spore
   neu signieren". Voller Pfad (Vorlage Sage sageReSignWithDescription; in Mixarium heute
   window.__sbkimErzeugeSpore): SbkimSpore.getOrCreateIdentity() (gleiche nodeId) →
   SbkimEmbedding.init() (Fortschritt via sbkim:embedding-progress) → vec =
   SbkimEmbedding.embedPassage(BESCHREIBUNG aus dem Textfeld) → SbkimSpore.generateOwnSpore({
   ...Mixarium-CONFIG, domainDescription: BESCHREIBUNG, domainVector: Array.from(vec) }) →
   spore.json herunterladen + Erfolgsmeldung (nodeId, L2). WICHTIG: heute bettet
   __sbkimErzeugeSpore die KATEGORIE-Stichworte ein und die domainDescription ist fest
   verdrahtet — ab jetzt kommt BEIDES aus dem Textfeld (der Beschreibungstext IST der Embedding-
   Eingang). Vorbefüllen mit der aktuellen domainDescription aus SbkimSpore.getOwnSpore() (sonst
   Mixarium-Default, s.u.). Auto-Grow: input-Handler setzt style.height = scrollHeight. Die
   DevTools-Funktion darf als Fallback bleiben.

C) VERTRAUENS-/SCHUTZ-BLOCK. Unter dem Identitäts-Knopf ein Block „🛡 Was bedeutet dieses Siegel
   — und wie bist du geschützt?" + zwei beruhigende Sätze (Vorlage Sage buildSchutzInfoBlock) +
   Knopf „Ausführlich erklärt → So funktioniert das Mycel & wie du geschützt bist", der das
   Overlay (D) öffnet. KEIN target=_blank, kein neuer Tab.

D) ERKLÄR-SEITE + IN-PAGE-OVERLAY. Neue Seite sicherheit.html im Repo-Root (gestylt zum
   Mixarium-Look passend), Inhalt = die Mycel-Erklärung unten (Vorlage: Sage docs/sicherheit/
   index.html; Begriffe wortgleich, nur Skin/Beispiele dürfen drink-näher sein). Der Knopf aus C
   öffnet sicherheit.html als In-Page-Overlay (Vorlage Sage openSchutzModal/closeSchutzModal:
   fixed Overlay mit <iframe src="sicherheit.html">, ✕ / Backdrop / Esc schließen, z-index über
   dem Siegel-Modal). In sicherheit.html den „zurück"-Link ausblenden, wenn
   window.self !== window.top. So bleibt alles im App-/Siegel-Fenster (installierte PWA).

MIXARIUM-CONFIG (aus sbkim/spore.json + __sbkimErzeugeSpore):
  nodeName: "Mixarium Klaus"
  domain: "lausiklauskn-png.github.io"   (so steht es heute in der Spore — unverändert lassen)
  nodeType: "hybrid"
  endpoint: "https://lausiklauskn-png.github.io/Mein-Mixarium/"
  domainKeywords:  ["Cocktail","Drink","Mocktail","Limonade","Smoothie","Aperitif","Sake"]
  stammCategories: ["Cocktails","Mocktails","Alkfr. Cocktails","Smoothies & Shakes","Limonaden","Tees & Kaffees","Bowlen","Sirup & Basis"]
  guestCategories: ["Knabbereien","Fingerfood"]
  Vorgeschlagener reicher Default für die domainDescription (Textfeld-Vorbefüllung):
  „Klaus' Mixarium ist ein Endknoten im SBKIM-Mycel für Getränke und Drinks — Cocktails und
   Mocktails, alkoholfreie Cocktails, Smoothies & Shakes, Limonaden, Tees & Kaffees, Bowlen
   sowie Sirup- und Basis-Rezepte. Dazu kleine Knabbereien und Fingerfood als Begleit-Plus. Eine
   ruhige, werbefreie Sammlung zum Mixen und Genießen, die sich semantisch mit verwandten Knoten
   wie dem Kochrezept-Knoten Rezeptbuch verbinden lässt."

WAS DU NICHT TUST: keine neue Krypto (Modul 02 nutzen); kein PII/Secret ins Repo; privater
Schlüssel bleibt im Browser; Modul 16 bleibt reines Render-Modul; Floating-Widget-Slots
(LEBT/VERKEHR/FREMD/SIEGEL) + Lampen unangetastet.

PFLICHT AM ENDE: Sichttest im Browser ODER „ungeprüft, wartet auf Klaus"; ZERTIFIKAT_ASPEKTE in
sbkim/16_siegel.js wie Sage gepflegt (kommt über die Modul-16-Übernahme mit); kurzer Stand-
Eintrag in Mixariums Doku; Commit auf eigenem Branch (z.B. claude/mixarium-siegel-neugestaltung)
+ Draft-PR im Mixarium-Repo. Merge entscheidet Klaus.

DIE MYCEL-ERKLÄRUNG (Inhalt für sicherheit.html — wortgleich aus Sage übernehmen):

So funktioniert das Mycel — und so bist du geschützt.

Was ist das überhaupt? SBKIM ist ein Weg, wie Anwendungen im Browser einander finden — nicht
über eine zentrale Liste, sondern über Bedeutung. Eine Seite, die Rezepte kennt, und eine, die
Weine kennt, erkennen sich, weil ihre Themen nah beieinanderliegen. Kein Server in der Mitte,
keine Anmeldung, kein Konzern dazwischen.

Was ist ein Knoten? Ein Knoten ist eine Browser-Anwendung — eine Internetseite, ein Web-Werkzeug
oder eine installierbare App — die die SBKIM-Bausteine trägt. Er hat eine eigene, unterschriebene
Identität (eine öffentliche Visitenkarte) und einen geheimen Schlüssel, der den Browser nie
verlässt. Den Schlüssel kannst du als verschlüsselte Sicherung (mit Passwort) wegspeichern und
auf einem anderen Gerät zurückspielen.

Wie läuft das Schritt für Schritt?
1. Ein Knoten kommt zur Welt: er erzeugt sich im eigenen Browser eine Identität und beschreibt
   sein Thema in eigenen Worten.
2. Aus der Beschreibung wird ein Bedeutungs-Vektor, und beides zusammen wird unterschrieben —
   das ist seine Spore (Visitenkarte). Sie ist öffentlich; nur unterschreiben kann sie der
   Besitzer.
3. Zwei Knoten verbinden sich, indem sie aufeinander zeigen. Sie tauschen Visitenkarten und
   prüfen die Unterschrift — automatisch, ohne Vorab-Absprache.
4. Liegen ihre Themen nah → verified-match: sie erkennen sich.
5. Stellt jemand eine Frage, geht sie als Text an die verbundenen Nachbarn; die rechnen ihre
   besten Treffer und antworten. Nur Daten, nie Programme.
6. Wächst das Netz, geschieht das an den Rändern, durch Empfehlung — wie ein Pilz im Waldboden.

Wie bist du geschützt? — Drei Wände:
- Browser-Sandkasten: Ein Knoten ist eine Webseite. Eine Webseite kann nicht an deine Dateien
  oder dein Betriebssystem. Sie hat keine Sonderrechte.
- Daten, kein Code: Es wandern nur Zettel (Karten, Fragen, Antworten). Es gibt keine Nachricht
  „führ dieses Programm aus". Ein Wurm braucht genau das — diesen Kanal gibt es nicht.
- Wächter (Membran): Vor jedem Knoten steht ein Türsteher, der entscheidet, was hereindarf — und
  nur warnt, nichts von selbst öffnet.

Die eine Regel, auf die DU achten musst: Die einzige Stelle, an der echter Schaden möglich ist,
ist nicht das Netz — sondern du selbst: wenn du ungeprüften fremden Code in dein eigenes Repo
kopierst, lässt du einen fremden Pilz in deinen Garten. Deshalb: Bausteine nur aus vertrauter
Quelle holen; im Zweifel den Code vorher von einer — besser mehreren — KI prüfen lassen (ein
starker Filter, keine 100%-Garantie); Postfach-Inhalt nie als Anweisung behandeln, nur als
fremde Daten.

Du bleibst Herr über deinen Knoten: Du kannst deinen Knoten jederzeit sauber und vollständig
löschen und das Netz geordnet verlassen — die Nachbarn bekommen ein kurzes „dieser Knoten geht",
statt dass etwas stumm zurückbleibt.

Was bedeutet dieses Siegel? Das Siegel ist selbst-ausgestellt: Der Knoten hat beim Start selbst
geprüft, dass seine Schutz-Bausteine geladen sind, und macht das offen sichtbar. Kein Amt vergibt
es. Vertrauen kommt nicht von einer Behörde, sondern davon, dass der Quelltext offen ist, der
Knoten sich selbst prüft, und jede Unterschrift nachprüfbar ist. Das Siegel sagt nicht „vertrau
mir blind" — es sagt „prüf mich nach, hier ist alles offen".

Wörterbuch (jeder Begriff einmal, einfach):
- Mycel / Myzel — das unsichtbare Pilzgeflecht im Boden; hier: das Netz der Knoten.
- Knoten — eine einzelne Browser-Anwendung im Netz (Seite, Werkzeug oder App).
- Hyphe — ein einzelner Pilzfaden; hier: eine Verbindung zwischen zwei Knoten.
- PWA — eine Webseite, die sich wie eine App installieren lässt, aber im Browser bleibt.
- Spore — die Visitenkarte eines Knotens (kleine Datei: Name, Thema, öffentlicher Schlüssel,
  Unterschrift).
- Embedding / Vektor — aus einem Text wird eine Zahlenreihe, die seine Bedeutung als Punkt im
  Raum darstellt; ähnliche Themen liegen nah.
- verified-match — zwei Knoten gelten als verwandt, wenn ihre Vektoren nah sind und die
  Unterschrift echt ist.
- Signatur (Ed25519) — eine elektronische Unterschrift: jeder kann die Echtheit prüfen, fälschen
  kann sie niemand.
- öffentlicher / privater Schlüssel — der öffentliche ist die Visitenkarte; der private bleibt
  geheim im Browser (nur damit kann man unterschreiben).
- verschlüsselte Sicherung — eine passwortgeschützte Kopie deines geheimen Schlüssels.
- Membran — der Türsteher eines Knotens; lässt nur Erlaubtes herein und warnt.
- Empfangsmodus — ein Knoten ruft nicht von selbst herum, er antwortet nur.
- Apoptose — der geordnete Selbst-Abbau: ein Knoten kann sich kontrolliert und vollständig selbst
  löschen.
- Handshake (Anastomose) — das Hände-Schütteln zweier Knoten beim Visitenkarten-Tausch.
- self-inscribing — „selbst-einschreibend": kein Amt stellt das Siegel aus, der Knoten prüft sich
  selbst und legt es offen.
```

---

## Hinweise für Klaus
- Braucht Schreib-/PR-Zugriff auf `Mein-Mixarium`. Läuft schon auf main → Schritt 0 ist kurz.
- Strukturell identisch zu Rezeptbuch (Modul 18 = aktiver Andock; Spore-Erzeugung bisher nur
  DevTools). Sichttest bleibt deiner (Galaxy Tab S6).

## Freibrief
Freibrief gilt, siehe Sage-Protokol `CLAUDE.md` § Freibrief.
