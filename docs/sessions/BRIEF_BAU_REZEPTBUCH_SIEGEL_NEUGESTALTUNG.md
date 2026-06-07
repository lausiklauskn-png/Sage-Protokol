# BRIEF — Bau: Mein-Rezeptbuch Siegel-Neugestaltung 1:1 wie Sage (Semantik-Textfeld + Vertrauens-Tafel + Modul-18-Hinweis raus)

**Erstellt:** 2026-06-07 · **Typ:** Bau-Sitzung **im Repo `lausiklauskn-png/Mein-Rezeptbuch`**
(externes Endknoten-Repo — NICHT Sage-Protokol) · **Auslöser:** Klaus 2026-06-07 — „Mein-Rezeptbuch
soll die Siegel-Neugestaltung komplett 1:1 wie Sage bekommen, inkl. Mycel-Erklärung und dem
Rausnehmen von Modul 18."

> **Freibrief gilt** (Sage `CLAUDE.md` § Freibrief). Diese Sitzung läuft im Rezeptbuch-Repo und
> braucht dort Schreib-/PR-Zugriff. Aus Sage geschrieben, weil Sage der Bau-Hub ist.

---

## Was in Sage gebaut wurde (Vorlage, source of truth, Branch main)

Drei gemergte PRs (#291/#292/#293):
1. **Semantik-Beschreibungs-Textfeld** im Siegel: Text → `domainDescription` → Modul 03
   `embedPassage` (e5-small, 384-dim, L2) → `domainVector` → Modul 02 `generateOwnSpore`
   (re-sign mit vorhandenem Schlüssel, gleiche nodeId) **+ Modul-18-Hinweis aus Modul 16 raus**.
2. **Vertrauens-/Sicherheits-Tafel** „So funktioniert das Mycel" (browser-lesbar, einfach,
   Fachjargon übersetzt).
3. **Tafel als In-Page-Overlay** (kein neuer Tab — wichtig für installierte PWAs).

Sage-Quelldateien: `src/modules/16_siegel.js`, `index.html` (`SBKIM_SEMANTIK_CONFIG`,
`buildSemantikBlock`, `sageReSignWithDescription`, `buildSchutzInfoBlock`, `openSchutzModal`/
`closeSchutzModal`, CSS `.sage-semantik-out`), `docs/sicherheit/index.html`.

---

## Rezeptbuchs heutige Struktur (verifiziert 2026-06-07 — WICHTIG, weicht von Sage ab)

- **Single-File `index.html`-PWA** (~2,7 MB) + externe Module unter `sbkim/*.js`
  (`01_storage.js` … `08_ui_demo.js`, `15_membran.js`, `16_siegel.js`, `17_floating_widget.js`,
  `18_tool_pwa.js`, `sbkim-init.js`). Eruda ist eingebaut (Live-Konsole).
- **Modul 16 (Render) = `sbkim/16_siegel.js`** — DAS ist die Datei für Schritt A.
- **Init-Kette = `sbkim/sbkim-init.js`**: ruft `SbkimWidget.init()` (Modul 17 Floating-Widget),
  `SbkimMembrane.init()`, `SbkimSiegel.init({ badgeSelector: "#sbkim-siegel-badge", repoUrl … })`,
  `SbkimToolPwa.init({ … })` (Modul 18), `SbkimSpore.init()` u.a.
- **Siegel-Badge wird vom Floating-Widget (Modul 17) gemountet** an `#sbkim-siegel-badge` —
  Rezeptbuch nutzt das Widget, nicht Navleisten-Lampen für das Siegel. Das Siegel-MODAL
  (`#sbkim-siegel-modal`) entsteht trotzdem aus Modul 16.
- **Modul 18 (`SbkimToolPwa`) ist Rezeptbuchs AKTIVER Andock-Wizard** — laut Code-Kommentar
  „Wird vom Bronze-SIEGEL-Klick (Modul 16 Sub (e) Hook) geöffnet". D.h. der „Andocken"-Knopf im
  Bronze-Siegel ruft heute Modul 18. **Achtung:** Sages Schritt „Modul-18-Hinweis raus" entfernt
  genau diesen Knopf — in Rezeptbuch muss der Andock-/Identitäts-Einstieg ersetzt werden, nicht
  ersatzlos gestrichen (sonst bricht der funktionierende Andock-Weg).
- **Spore-Erzeugung läuft heute nur per DevTools-Konsole**: `window.__sbkimErzeugeSpore()` in
  `sbkim-init.js`. Dabei wird der Vektor aus den **Kategorie-Stichworten** gebildet
  (`embedPassage(stamm+gast+keywords)`), die `domainDescription` ist **fest verdrahtet** und wird
  NICHT eingebettet. **Genau hier bringt das Textfeld den größten Gewinn:** der eingegebene
  Beschreibungstext wird `domainDescription` UND der Embedding-Eingang → treffenderer Vektor.

---

## Der Befehl (copy-paste in die Rezeptbuch-Sitzung)

```
Du bist eine Bau-Sitzung im Repo lausiklauskn-png/Mein-Rezeptbuch (Endknoten-PWA, NICHT
Sage-Protokol). Freibrief gilt (Sage CLAUDE.md § Freibrief). Antworten auf Deutsch, ruhig
und präzise. Klaus arbeitet auf einem Galaxy Tab S6; Sichttest bleibt seiner.

ZIEL: Rezeptbuch bekommt die Siegel-Neugestaltung 1:1 wie Sage — (A) Modul 16 aktualisieren
(Modul-18-Hinweis raus + neuer Aspekt), (B) Semantik-Beschreibungs-Textfeld im Siegel, das
den Spore-Vektor speist, (C) Vertrauens-/Schutz-Block im Siegel, (D) Erklär-Seite als
In-Page-Overlay. KEINE neue Krypto, kein PII, Lampen/Widget-Slots unangetastet, Modul 16
bleibt reines Render-Modul.

SCHRITT 0 — RICHTIGES REPO UND RICHTIGEN BRANCH BESTÄTIGEN (PFLICHT, vor allem anderen):
Diese Aufgabe gilt für lausiklauskn-png/Mein-Rezeptbuch. ZWEI FALLEN (beide haben schon
Vorgänger-Sitzungen in die Irre geführt):
 (1) Es gibt ein ähnlich benanntes blanco-Repo lausiklauskn-png/Muttis-Rezeptbuch OHNE SBKIM
     — NICHT gemeint.
 (2) Mein-Rezeptbuch hat ~37 Branches. Der Branch, auf dem ein frischer Klon landet, kann ein
     ALTER claude/*-Branch OHNE sbkim/ sein (z.B. claude/recipe-book-app-… von vor Monaten).
     Das volle SBKIM liegt auf dem Branch, der auch live über GitHub Pages läuft — i.d.R. main.
Führe ZUERST aus:
  git remote -v
  git branch -a
  ls sbkim/ 2>/dev/null || echo "KEIN sbkim/ auf aktuellem Branch"
Wenn sbkim/ fehlt:
  git fetch origin && git checkout main && git pull --ff-only && ls sbkim/
Falls auch main kein sbkim/ hat, finde den richtigen Branch:
  git fetch --all
  for b in $(git branch -r | sed 's| *origin/||'); do git ls-tree --name-only "origin/$b" -- sbkim/16_siegel.js 2>/dev/null | grep -q . && echo "sbkim/ liegt auf: $b"; done
Erwartung: ein Branch (i.d.R. main) listet sbkim/ mit 16_siegel.js, sbkim-init.js, 02_spore.js,
03_embedding.js (~33 Dateien) — DAS ist dein Arbeitsstand. Belegt: Mein-Rezeptbuch ist live ein
voller SBKIM-Endknoten (verified-match 0.8320, Siegel im Floating-Widget); es ist NICHTS „von
Grund auf" zu bauen — du musst nur auf dem richtigen Branch sein.
- Wenn remote = Muttis-Rezeptbuch / ein anderes Repo → STOPP, falsches Repo: melde zurück.
- Erst wenn sbkim/ mit den Modulen sichtbar ist, weiter.

ZUERST DEINE EIGENE STRUKTUR LESEN (nicht raten — Lehre aus einer Vorgänger-Sitzung):
- index.html (Single-File-PWA), sbkim/sbkim-init.js, sbkim/16_siegel.js, sbkim/18_tool_pwa.js,
  sbkim/spore.json, status.json. Finde: das Siegel-Modal (#sbkim-siegel-modal), wo/ob ein
  Identitäts-Knopf injiziert wird, und window.__sbkimErzeugeSpore().
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

A2) ANDOCK-EINSTIEG ERSETZEN (Rezeptbuch-spezifisch!). Weil A den Bronze-„Andocken→Modul 18"-
   Knopf entfernt, injiziere — wie Sage host-seitig — in das Siegel-Modal (#sbkim-siegel-modal)
   einen Knopf „🔑 Eigene Identität & Spore erzeugen / verwalten →". Setze die Injektion
   sinnvoll auf (z.B. in sbkim-init.js nach SbkimSiegel.init, mit MutationObserver auf das
   Modal, analog Sages injectIdentityLinkIntoSiegel + watchForSiegelModal). Modul 18 darf
   geladen bleiben (schadet nicht), ist aber nicht mehr der Bronze-Andock-Trigger. Wenn Klaus
   lieber Modul 18 als Wizard behalten will: dann den 🔑-Knopf auf SbkimToolPwa.openAndockTab()
   zeigen lassen und das Textfeld (B) IN den Modul-18-Wizard setzen — funktioniert auch. Wähle
   den Weg, der weniger umbaut; im Zweifel Klaus fragen.

B) SEMANTIK-BESCHREIBUNGS-TEXTFELD. Direkt unter dem 🔑-Knopf im Siegel ein auto-wachsendes
   <textarea> einhängen. Placeholder: „Beschreibe deine App neu oder kopiere die Beschreibung /
   README hier hinein." Hinweis wortgleich aus Sage (siehe unten). Knopf „Beschreibung
   übernehmen → Vektor & Spore neu signieren". Voller Pfad (Vorlage Sage
   sageReSignWithDescription; in Rezeptbuch heute window.__sbkimErzeugeSpore): SbkimSpore.
   getOrCreateIdentity() (gleiche nodeId) → SbkimEmbedding.init() (Fortschritt via
   sbkim:embedding-progress) → vec = SbkimEmbedding.embedPassage(BESCHREIBUNG aus dem Textfeld)
   → SbkimSpore.generateOwnSpore({ ...Rezeptbuch-CONFIG, domainDescription: BESCHREIBUNG,
   domainVector: Array.from(vec) }) → spore.json herunterladen + Erfolgsmeldung (nodeId, L2).
   WICHTIG: Heute bettet __sbkimErzeugeSpore die KATEGORIE-Stichworte ein und die
   domainDescription ist fest verdrahtet — ab jetzt kommt BEIDES aus dem Textfeld (der
   Beschreibungstext IST der Embedding-Eingang). Vorbefüllen mit der aktuellen domainDescription
   aus SbkimSpore.getOwnSpore() (sonst Rezeptbuch-Default, s.u.). Auto-Grow: input-Handler setzt
   style.height = scrollHeight. Die DevTools-Funktion __sbkimErzeugeSpore() darf als Fallback
   bleiben.

C) VERTRAUENS-/SCHUTZ-BLOCK. Unter dem Identitäts-Knopf ein Block „🛡 Was bedeutet dieses Siegel
   — und wie bist du geschützt?" + zwei beruhigende Sätze (Vorlage Sage buildSchutzInfoBlock) +
   Knopf „Ausführlich erklärt → So funktioniert das Mycel & wie du geschützt bist", der das
   Overlay (D) öffnet. KEIN target=_blank, kein neuer Tab.

D) ERKLÄR-SEITE + IN-PAGE-OVERLAY. Neue Seite sicherheit.html im Repo-Root anlegen (gestylt zum
   Rezeptbuch-Look passend), Inhalt = die Mycel-Erklärung unten (Vorlage: Sage docs/sicherheit/
   index.html; Begriffe wortgleich, nur Skin/Beispiele dürfen rezept-näher sein). Der Knopf aus
   C öffnet sicherheit.html als In-Page-Overlay (Vorlage Sage openSchutzModal/closeSchutzModal:
   fixed Overlay mit <iframe src="sicherheit.html">, ✕ / Backdrop / Esc schließen, z-index über
   dem Siegel-Modal). In sicherheit.html den „zurück"-Link ausblenden, wenn
   window.self !== window.top. So bleibt alles im App-/Siegel-Fenster (installierte PWA).

REZEPTBUCH-CONFIG (aus sbkim/spore.json + __sbkimErzeugeSpore):
  nodeName: "Rezeptbuch Klaus"
  domain: "lausiklauskn-png.github.io"   (so steht es heute in der Spore — unverändert lassen,
                                          außer Klaus will es korrigieren)
  nodeType: "hybrid"
  endpoint: "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/"
  domainKeywords:  ["Rezept","Kochen","Essen","Hauptgang","Beilage","Backen","Saucen"]
  stammCategories: ["Vorspeisen","Suppen","Fleisch","Fisch","Vegetarisch","Kuchen","Desserts"]
  guestCategories: ["Getränke","Smoothies & Shakes","Mocktails","Alkfr. Cocktails","Limonaden",
                    "Tees & Kaffees","Cocktails","Bowlen","Sirup & Basis","Knabbereien","Fingerfood"]
  Vorgeschlagener reicher Default für die domainDescription (Textfeld-Vorbefüllung):
  „Klaus' Rezeptbuch ist ein Endknoten im SBKIM-Mycel für hausgemachte Kochrezepte — von
   Vorspeisen, Suppen, Fleisch, Fisch und vegetarischen Gerichten über Kuchen und Desserts bis
   zu Saucen und Beilagen, vom Hefeteig bis zur fertigen Sauce. Dazu passende Begleitgetränke
   (Limonaden, Tees, Mocktails, alkoholfreie Cocktails) und kleine Knabbereien als
   Überraschungs-Plus. Eine ruhige, werbefreie Sammlung zum Nachkochen, die sich semantisch mit
   verwandten Knoten wie dem Cocktail-Knoten Mixarium verbinden lässt."

WAS DU NICHT TUST: keine neue Krypto (Modul 02 nutzen); kein PII/Secret ins Repo; privater
Schlüssel bleibt im Browser; Modul 16 bleibt reines Render-Modul; Floating-Widget-Slots
(LEBT/VERKEHR/FREMD/SIEGEL) + Lampen unangetastet.

PFLICHT AM ENDE: Sichttest im Browser (Eruda hilft) ODER „ungeprüft, wartet auf Klaus";
ZERTIFIKAT_ASPEKTE in sbkim/16_siegel.js wie Sage gepflegt (kommt über die Modul-16-Übernahme
automatisch mit); kurzer Stand-Eintrag in Rezeptbuchs Doku; Commit auf eigenem Branch (z.B.
claude/rezeptbuch-siegel-neugestaltung) + Draft-PR im Rezeptbuch-Repo. Merge entscheidet Klaus.

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

- Diese Sitzung braucht **Schreib-/PR-Zugriff auf `Mein-Rezeptbuch`** — aus einer auf
  Sage-Protokol beschränkten Sitzung nicht ausführbar. In einer Sitzung mit Rezeptbuch im Scope
  starten.
- **Ein echter Unterschied zu Sage/Point:** Modul 18 ist hier der aktive Andock-Wizard, und die
  Spore-Erzeugung lief bisher nur per DevTools-Konsole. Schritt A2 ersetzt den Andock-Einstieg
  durch den Sage-Stil (🔑-Knopf + Textfeld im Siegel). Falls du Modul 18 lieber als Wizard
  behalten willst, sag Bescheid — dann setzt die Sitzung das Textfeld in den Modul-18-Wizard
  statt in den injizierten Knopf (beides möglich, der Brief nennt beide Wege).
- Sichttest bleibt deiner (Galaxy Tab S6, Eruda eingebaut).

## Freibrief
Freibrief gilt, siehe Sage-Protokol `CLAUDE.md` § Freibrief.
