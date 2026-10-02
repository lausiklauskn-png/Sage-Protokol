# PULS-Auslagerung 2026-10-02 — „Die KI-Schulung steht auf beiden Seiten — hinter dem Prüfer"

**Ausgelagert am 2026-10-02**, weil `docs/PULS.md` mit dem Eintrag dieser
Sitzung über die 3000-Zeilen-Grenze gekommen wäre (2.993 Zeilen davor).
Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt kürzen**:
hier steht der Eintrag **wortwörtlich**, nichts gekürzt, nichts
zusammengefasst.

---

## 2026-09-17 · Die KI-Schulung steht auf beiden Seiten — hinter dem Prüfer

**Rolle:** Hauptsitzung (Brief `docs/sessions/BRIEF_KI_SCHULUNG_AI_ACT.md`).
**Repos:** PWA-Toolpoint (#123, gemergt) · family-project (#309, gemergt) · Sage (Doku).

**Was getan.** Die Unterlage `docs/schulung/EU_AI_Act_Art4_KI_Schulung.html` liegt
jetzt byte-gleich (`md5 cc9f4b2b…`, auf beiden `main` nachgezählt) unter
`schulung/` in beiden Ziel-Depots, davor je ein Rahmen:
**pwa-toolpoint.de/ki-schulung.html** (eigene Seite an der Wurzel, Eintrag
`eigen-ki-schulung` am Ende der Zeitachse, `sichttest: ausstehend`, Cache v59) und
**family-projekt.de/werkzeuge/ki-schulung.html** (FP_TOOL-Seite, Karte, Markt-Eintrag
`markt-ki-schulung` wörtlich hinter dem Prüfer, Cache v119). Eigenes Zeichen auf
Klaus' Wunsch: ein Blatt in Bernstein, ein Siegel mit Haken in Blau. Beide Seiten mit
Spenden- bzw. Kaffeekassen-Knopf aus der vorhandenen Konfiguration — freiwillig,
kein Preis (Stufe 1 hält). Die vier Fragen des Briefes wurden mit den Vorschlägen
entschieden: Zeitachse behalten · eine Unterlage · Deutsch mit Übersetzer-Hinweis ·
`ki-schulung.html`. Entscheidungen im Code kommentiert, nicht still.

**Gemessen.** PWA Toolpoint `npm test` 872 → **915/915**, Drift-Guard 13/13,
Gegenprobe der 13 neuen Fälle **13 gefangen · 0 blind · 0 tote Anker**, jeder von Hand
nachgestellt (zwei fielen zusätzlich am statischen Listen-Wächter, jeder trägt
trotzdem den Namen seiner Zusicherung). family-project alle `smoke_*.mjs` einzeln:
`smoke_all` 110 → **121**, `cache_version` 11 → 12, `statische_listen` 30 → 32,
`kein_sprung` 40 → 42, Rest unverändert; vorbestehend rot und identisch vorher wie
nachher: `markt_vecpack`, `start` (Proxy sperrt den Relais-WebSocket, three.js
headless), `wortkarte` nicht lauffähig (Playwright will Browser 1243, da ist 1194).
**Auslieferungsprüfer** über alle vier neuen Dateien: **0 Befunde** — die zwei aus dem
Brief vorhergesagten (EU-Links, Musterfirma-Platzhalter) meldet er gar nicht; zwei
eigene fand er (`<a href="#">`, `og:image:alt` mit Doppelpunkt), beide behoben, das
Zweite als Prüfer-Befund in der Pflege-Liste.

**Nicht gemessen:** Klaus' Sichttest an beiden Adressen · der volle Gegenprobe-Lauf
in PWA Toolpoint (~1 h) · PageSpeed der neuen Seiten (kommt über die Nacht:
Messziel `eigen-ki-schulung` in family-project angelegt, Falle 3).

**Zwei Nachträge von Klaus am selben Tag, beide gemergt** (Sage #1036,
Toolpoint #124, family #310):

1. **Der Erklär-Satz zum Nicht-Übersetzen ist von beiden Seiten raus** — *„das ist
   eine Erklärung, die du gegeben hast."* Die Entscheidung gilt weiter, ihr Grund
   steht jetzt im Kommentar. ⚠ **Damit ist Entscheidung 3 oben überholt:** nicht
   mehr „Deutsch mit Übersetzer-Hinweis", sondern **Deutsch, und der Weg zum
   Browser-Übersetzer nur noch in der ENGLISCHEN Fassung** (Toolpoint an
   `schulung_micro`, family im englischen Lead). Auf Deutsch wäre er Text ohne
   Auskunft — wer die Datei öffnet, sieht ihre Sprache.
2. **Punkt 2 rückt auf Seite 2 des Ausdrucks.** Vorher endete Seite 1 mit der
   blossen Überschrift samt Unterstrich. Zwei Regeln im Druck-Stil der Unterlage:
   eine Überschrift bleibt bei ihrem Text, und der Platz dafür kommt aus dem
   zweiten Bogen (Abschnitte 2–5 rücken enger) statt aus Rand oder Schriftgrösse —
   ein schmalerer Rand hätte **jede** Seite verändert. Gemessen, Seite für Seite
   als Text verglichen: Seite 1 und 2 geändert, **Seiten 3–7 unverändert**;
   Bescheinigung und Lösungsschlüssel unverändert. ⚠ Klaus' Ausdruck hat **neun**
   Seiten, diese Messung sieben (andere Ränder) — die erste Regel trägt bei jeder
   Seitenhöhe, die Zeilenverteilung bei ihm ist **nicht gemessen**.
3. **Zwei weitere Umbrüche am selben Nachmittag** (Sage #1037, Toolpoint #125,
   family #311): der Bereich **„Hochrisiko-Anwendungen"** bleibt als Block
   zusammen und steht geschlossen auf dem Bogen mit 8, 9 und 10; der **Schluss**
   („Quellen und Stand" samt Hinweis) rückt als Fußnote hoch, statt allein auf
   einer letzten, fast leeren Seite zu stehen.

   ⚠ **Für den zweiten wurde Klaus' Seitenrand NACHGESTELLT, statt über ihn zu
   raten.** Bei 14 mm hat das Dokument sieben Seiten — dort gibt es das Problem
   gar nicht. Ausprobiert wurden 14 · 18 · 20 · 22 · 25 mm; bei **22 mm**
   entstehen dieselben neun Seiten wie bei ihm, und dort wurde gemessen:
   **9 → 8 Seiten, Seiten 1–7 unverändert.** Bei 25 mm reicht es nicht — die
   Zeile steht mit da, statt weggelassen zu werden.

   ⚠ **Beide Eingriffe berühren nur die genannten Seiten, und das ist der
   Zuschnitt:** der Block konnte rutschen, weil die Seite dahinter ohnehin mit
   einem erzwungenen Umbruch beginnt (dem Wissenstest); die Fußnoten-Regeln
   fassen nichts an, was vor dem Ergebnis-Feld steht — eine Straffung an den
   Testfragen hätte die Seiten davor mitverschoben. Ein Wächter besteht auf
   beidem.

Die Unterlage steht damit auf `md5 7640d7a132b36ebf52ddd7d051646ca2`
(228 Zeilen, angekommen war sie mit `cc9f4b2b…` und 190); Pin in Toolpoints
Smoke nachgezogen, `npm test` 872 → **923/923**, Cache v61 bzw. v121.

**Was offen ist.** Klaus' Sichttest → danach `sichttest` auf das Datum setzen.
Klaus' Nachträge aus dem Chat: die **Rezept-Börse** (JSON-Rezepte kostenlos über den
Hetzner-Server teilen, mit Spendenknopf, „auch in family-projekt.de") — Brief
`docs/sessions/BRIEF_REZEPT_BOERSE.md`. Pflege-Liste um vier Punkte länger (6–9).

**Nächster sinnvoller Schritt.** Sichttest abwarten, dann die Rezept-Börse nach dem
Brief bauen. `SIGNAL.json` unverändert bei seq 91 — nichts für Gegenstellen.

---

