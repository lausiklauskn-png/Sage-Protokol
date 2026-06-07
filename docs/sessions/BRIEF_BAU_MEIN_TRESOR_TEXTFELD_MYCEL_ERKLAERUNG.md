# BRIEF — Bau: Mein-Tresor — Semantik-Textfeld + Mycel-Erklärung (Siegel-DESIGN unangetastet)

**Erstellt:** 2026-06-07 · **Typ:** Bau-Sitzung **im Repo `lausiklauskn-png/Mein-Tresor`** ·
**Auslöser:** Klaus 2026-06-07 — „Mein-Tresor soll am Design seines Siegel-Innenlebens NICHTS
ändern. Nur die Texteingabe für besseres Finden und die Mycel-Erklärung dazubauen — das, was
wir neu gemacht haben."

> **Freibrief gilt** (Sage `CLAUDE.md` § Freibrief). Läuft im Mein-Tresor-Repo, braucht dort
> Schreib-/PR-Zugriff. Aus Sage geschrieben (Bau-Hub).

---

## Wichtig: REDUZIERTER Scope (Mein-Tresor ist anders gebaut)

Mein-Tresor war die Design-Vorlage und hat bereits ein reiches, statisches Siegel
(`#mt-seal-dialog` in `index.html`). Es nutzt **KEIN** Modul-16-JS-Modal und **KEINEN**
Modul-18-Andock-Wizard. Identität/Spore laufen über die eigene Seite
`werkzeuge/andock.html` (Teil B: Identität aus Datei `node_key.enc.json` + Passwort laden →
domainVector via Modul 03 → Spore inline neu signieren).

Deshalb gilt hier **NICHT** das volle „1:1 wie Sage". Es gibt nur **zwei** Ergänzungen, und
das Siegel-Design bleibt unverändert:
- **(1) Semantik-Textfeld** in `werkzeuge/andock.html` (besseres Finden).
- **(2) Mycel-Erklärung** als eigene Seite `sicherheit.html` + ein minimaler Link.

KEIN Modul-16-Austausch, KEIN Modul-18-Rückbau, KEINE Änderung an `#mt-seal-dialog`-Layout/
-Prosa, KEINE neue Krypto (der bestehende Datei-Schlüssel-Pfad bleibt).

## Verifizierte Mein-Tresor-Struktur (2026-06-07, main)
- `index.html` — statischer `#mt-seal-dialog` (Design, NICHT anfassen).
- `werkzeuge/andock.html` (~20 KB) — CONFIG (nodeName "Mein-Tresor", domainDescription,
  domainKeywords, endpoint …), `DOMAIN_TEXT = CONFIG.domainDescription + " " +
  CONFIG.domainKeywords.join(", ")`, `buildSpore(withVector)` (setzt
  `domainDescription:CONFIG.domainDescription`), Knöpfe `#btn-vec` (② domainVector via
  `SbkimEmbedding.embedPassage(DOMAIN_TEXT)`) und `#btn-resign` (③ Spore neu signieren).
  Identität wird in Teil B ① aus Datei geladen (kein getOrCreateIdentity).
- `web/tools/sbkim-embedding.js` — Modul 03. `sbkim/spore.json` vorhanden. `sicherheit.html`
  existiert noch nicht.

---

## Der Befehl (copy-paste in die Mein-Tresor-Sitzung)

```
Du bist eine Bau-Sitzung im Repo lausiklauskn-png/Mein-Tresor (Endknoten, NICHT Sage-Protokol).
Freibrief gilt (Sage CLAUDE.md § Freibrief). Antworten auf Deutsch, ruhig und präzise. Klaus
arbeitet auf einem Galaxy Tab S6; Sichttest bleibt seiner.

ZIEL (REDUZIERT — Siegel-Design bleibt unverändert!): Mein-Tresor bekommt NUR zwei Ergänzungen,
die wir bei Sage neu gebaut haben:
 (1) ein Semantik-Beschreibungs-Textfeld (für besseres Finden), und
 (2) die Mycel-/Sicherheits-Erklärung als eigene Seite + minimaler Link.
NICHT machen: KEIN Modul-16-Austausch, KEIN Modul-18-Rückbau, KEINE Änderung am Layout/an der
Prosa des Siegel-Dialogs #mt-seal-dialog, KEINE neue Krypto (der Datei-Schlüssel-Pfad bleibt).

SCHRITT 0 — REPO + BRANCH BESTÄTIGEN (PFLICHT, kurz):
Gilt für lausiklauskn-png/Mein-Tresor; SBKIM liegt auf main (live über Pages, nodeId
wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0). Führe ZUERST aus:
  git remote -v
  git branch --show-current
  ls werkzeuge/andock.html web/tools/sbkim-embedding.js 2>/dev/null || echo "Dateien fehlen?"
Erwartung: remote = Mein-Tresor, Branch = main (sonst git checkout main && git pull --ff-only),
werkzeuge/andock.html + web/tools/sbkim-embedding.js vorhanden. Wenn remote ein anderes Repo ist
→ STOPP, melde zurück.

LESEN: werkzeuge/andock.html (CONFIG, DOMAIN_TEXT, buildSpore, #btn-vec, #btn-resign),
index.html (#mt-seal-dialog — nur zum Verstehen, NICHT umbauen). Vorlage für Wortlaut/Inhalt
(raw, Repo lausiklauskn-png/Sage-Protokol, Branch main): docs/sicherheit/index.html (die
Mycel-Erklärung) und index.html (der Hinweis-Wortlaut des Textfeldes).

BAU-SCHRITT (1) — SEMANTIK-TEXTFELD in werkzeuge/andock.html:
- In Teil B (am besten direkt bei ② „domainVector erzeugen", ODER als eigener kleiner Block
  davor) ein auto-wachsendes <textarea> einhängen, vorbefüllt mit CONFIG.domainDescription.
  Placeholder: „Beschreibe deine App neu oder kopiere die Beschreibung / README hier hinein."
  Darunter der Hinweis (wortgleich aus Sage): „Je konkreter, desto besser findet dich das Mycel.
  Beschreibe in eigenen Worten: was die App/Seite ist, wofür man sie nutzt, welche
  Themen/Stichworte sie abdeckt, für wen sie gedacht ist. Ein gut gefüllter Absatz (ca. 3–8
  Sätze) ist ideal — gern auch die README hineinkopieren. Vermeide reine Schlagwort-Listen ohne
  Kontext." Auto-Grow: input-Handler setzt style.height = scrollHeight.
- Verdrahtung (bestehenden Pfad benutzen, NICHTS Neues an der Krypto):
   • Der Embedding-Eingang (heute DOMAIN_TEXT, in #btn-vec via embedPassage(DOMAIN_TEXT)) kommt
     ab jetzt aus dem Textfeld: vec = SbkimEmbedding.embedPassage(<textfeld-inhalt>).
   • In buildSpore(...) wird u.domainDescription = <textfeld-inhalt> statt CONFIG.domainDescription
     (die übrigen Felder bleiben). Dann wie gehabt mit dem in Teil B ① geladenen Schlüssel
     signieren (#btn-resign) — gleiche nodeId, keine neue Krypto.
   • Reihenfolge wie bisher: ① Identität aus Datei laden → (Beschreibung eintippen) → ②
     domainVector → ③ Spore neu signieren → spore.json herunterladen. Falls das Textfeld leer
     bleibt, auf CONFIG.domainDescription zurückfallen (heutiges Verhalten).

BAU-SCHRITT (2) — MYCEL-ERKLÄRUNG:
- Neue Seite sicherheit.html im Repo-Root anlegen, im Mein-Tresor-Skin (dunkel, wie index.html),
  Inhalt = die Mycel-Erklärung unten (Vorlage Sage docs/sicherheit/index.html; Begriffe
  wortgleich, Skin/Beispiele dürfen tresor-näher sein).
- EINEN minimalen Link auf sicherheit.html ergänzen — OHNE das Siegel-Design umzubauen. Am
  unaufdringlichsten: eine einzelne Zeile im #mt-seal-dialog im Stil der dort schon vorhandenen
  Links (z.B. „🛡 So funktioniert das Mycel & wie du geschützt bist →"), ODER im Footer / in
  andock.html. Wenn machbar ohne neuen Tab: als In-Page-Overlay/<dialog> öffnen (iframe auf
  sicherheit.html, ✕/Esc schließen; in sicherheit.html den „zurück"-Link ausblenden, wenn
  window.self !== window.top). Neuer Tab ist nur die Notlösung.

MEIN-TRESOR-CONFIG (aus werkzeuge/andock.html — vorhanden, nur als Referenz):
  nodeName: "Mein-Tresor", nodeType: "hybrid", domain: "Mein-Tresor-Bibliothek",
  endpoint: "https://lausiklauskn-png.github.io/Mein-Tresor/"
  Vorgeschlagener reicher Default für die domainDescription (Textfeld-Vorbefüllung):
  „Mein-Tresor ist ein Endknoten im SBKIM-Mycel zum sicheren Verwahren: er verschlüsselt und
   speichert JSON-Dateien und SBKIM-Schlüssel offline im Browser (AES-256-GCM), Tresor und
   Bibliothek zugleich. Backups lassen sich passwortgeschützt exportieren und auf einem anderen
   Gerät zurückspielen; der private Schlüssel verlässt den Browser nie. Verwandt mit dem
   Schwester-Tresor Jasons-Tresor und angedockt ans Netz aus Sage, SB-KIMTool-Point, Rezeptbuch
   und Mixarium."

WAS DU NICHT TUST: keine Änderung am #mt-seal-dialog-Design/-Inhalt (außer dem einen Erklär-
Link); keine neue Krypto / kein neuer Signier-Algorithmus (bestehenden andock.html-Pfad nutzen);
kein Modul-16/18-Umbau (Mein-Tresor hat das nicht); kein PII/Secret ins Repo; privater Schlüssel
bleibt im Browser/in der Datei.

PFLICHT AM ENDE: Sichttest im Browser ODER „ungeprüft, wartet auf Klaus"; kurzer Stand-Eintrag
in Mein-Tresors Doku; Commit auf eigenem Branch (z.B. claude/mein-tresor-textfeld-mycel-erklaerung)
+ Draft-PR im Mein-Tresor-Repo. Merge entscheidet Klaus.

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
- Braucht Schreib-/PR-Zugriff auf `Mein-Tresor` (liegt auf main).
- Bewusst KLEIN gehalten: Siegel-Design bleibt, nur Textfeld (andock.html) + Erklär-Seite +
  ein Link. Sichttest bleibt deiner.

## Freibrief
Freibrief gilt, siehe Sage-Protokol `CLAUDE.md` § Freibrief.
