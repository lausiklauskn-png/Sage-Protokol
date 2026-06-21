# Vision — Das Such-Werkzeug als Mycel-Agent (Modul 22)

Konzept-Karte (kein Modul-Code). Hält Klaus' Vision 2026-06-21 fest: **das
Such-Tool ist die Manifestation der SBKIM-Idee** und zugleich eine **Brücke** —
solange wir nicht in der nötigen Geschwindigkeit echte Knoten erzeugen können,
überbrücken das Such-Tool **plus die schon laufenden PWAs** diese Lücke. Aktuell
sind es noch ausschließlich **Klaus' eigene Knoten**. Die Suchmaschine könnte ein
**Weg nach draußen** werden, um Interesse zu wecken und das Netz wachsen zu lassen.

---

## 1. Warum das Such-Tool, gerade weil es am Mycel hängt, mehr kann

Stichwort-Suche fragt das **anonyme offene Web** („welche Seiten enthalten diese
Wörter?"). Mycel-Suche versteht die **Absicht** und fragt damit ein Netz aus
**bekannten, vertrauenswürdigen, bedeutungs-markierten Knoten** — server-los,
ohne zentralen Türsteher. Die sieben Möglichkeiten:

1. **Bedeutungs-Suche im Knoten-Netz** statt im Web (heute angelegt: „Knoten"-Bereich).
2. **Absicht → an den passenden Knoten geroutet** (Spore + Anastomose, Modul 02/05).
3. **Agent-zu-Agent** statt Stichwort-Index — spezialisierte Versteher setzen die Antwort zusammen.
4. **Vertrauen & Herkunft** — Antworten aus bezeugten Quellen (Siegel), nicht aus SEO-Müll. Gold für Sicherheits-Fragen (Katzen-Beispiel).
5. **Gedächtnis & Kontext** — der Knoten hat Identität (02) + Tresor (B1) + Persistenz; er liest Absicht gegen deinen Kontext (die „Datei → Absicht"-Idee).
6. **Zwei-Wege (Empfangsmodus)** — dein Knoten antwortet auch auf die Bedeutungs-Fragen anderer.
7. **Kein zentraler Türsteher** — peer-to-peer; niemand filtert mit verborgenen Interessen (Antwort auf das „Handschellen"-Unbehagen).

---

## 2. Die Agenten-Visitenkarte (Klaus' Kern-Idee 2026-06-21)

**Das Such-Tool ist selbst ein Agent.** Bevor es eine Anfrage startet, **beschreibt
es sich** — nicht *was* es technisch ist, sondern **was sein Ziel ist** und **was
es zu bieten hat**. Die Gegenstelle (eine KI / ein komplexeres System, also auch
eine Art Agent) liest diese **Visitenkarte**, erkennt das **Muster** und antwortet:
„ich passe / ich habe eine Antwort auf dein Ziel — oder nicht." Das **semantische
Verstehen beginnt schon am Handschlag**, nicht erst bei der Anfrage. Hat eine KI
die andere einmal verstanden, muss die andere nicht mehr viel erzählen — sie
erkennen sich am Muster (genau das, was wir mit dem „Bedeutung zuerst"-Prompt
schon im Kleinen versuchen).

**Nicht der ganze Bauplan wird geschickt, sondern die Visitenkarte.** So erkennt
**jede** KI — egal wie schwach — „das ist ein Such-Werkzeug mit bestimmten
Aufgaben, eine Agenten-Oberfläche mit diesen Eigenschaften".

### Zwei Horizonte
- **Jetzt (Chat-KIs wie ChatGPT/Gemini):** Die Visitenkarte ist eine **Priming-
  Präambel** im Prompt. Chat-KIs „verhandeln" nicht, aber die Selbst-Beschreibung
  versetzt sie in den richtigen **Modus** (semantisch, absichts-zuerst). Unser
  „Bedeutung zuerst"-Prompt ist bereits ein **Proto-Davon**.
- **Später (echte Agenten / Mycel-Knoten / MCP-Systeme):** maschinenlesbare
  **Agent-Card (JSON)**. Fit-Check = **Anastomose** (Modul 05), Bedeutungs-Match
  = **Modul 04**. Hier wird der Handschlag echt beidseitig.

### Leitlinien (Vorschläge der Sitzung)
- **Eine Identität, zwei Leser:** Die Visitenkarte IST die **Spore** des Tools
  (Modul 02) — kein Parallel-Konstrukt. Menschen lesen sie als **Einladung**,
  Agenten als **Fähigkeits-Karte**.
- **An Normen andocken:** Form an etablierte **Agent-Card / MCP**-Konventionen
  anlehnen, statt eigenen Dialekt zu erfinden → „jede KI erkennt das Muster".
- **Symmetrisch/bidirektional:** Wir zeigen unsere Karte UND lesen ihre; „passen
  wir?" = Bedeutungs-Match der zwei Karten (Modul 04 Cosinus). „Die meisten
  sollten zusammenpassen" — weil semantisch verglichen, nicht starr nach Schema.
- **Wachstum nach außen:** Die Visitenkarte ist zugleich **Einladung** —
  Recruiting-Fläche der Pilz-Schicht. Ein **„Sage-Protokol"-Button** im Tool führt
  Interessierte ans Netz. Das **SBKIM-Siegel** bleibt **verdient** (bezeugte
  Bau-Tat, Anti-Greenwashing) — kein gratis Abzeichen, sondern Lohn der Arbeit.

---

## 3. Konkreter nächster Bau-Schritt (Vorschlag)

**Visitenkarten-Präambel in `buildAiPrompt`** — eine kurze, stabile Selbst-
Beschreibung des Tools vor jeder Anfrage:

> „Ich bin ein semantisches Such-Werkzeug des SBKIM-Mycels. Mein Ziel: nach
> Bedeutung/Absicht finden, nicht nach Stichwörtern. Ich biete eine strukturierte
> JSON-Treffer-Liste. Prüfe als Gegen-Agent zuerst, ob du zu diesem Ziel beitragen
> kannst, und arbeite dann in diesem Sinn."

Klein, gratis, sofort testbar (am Referenzfall 2), und der erste reale Tropfen des
Agenten-Handschlags. Größere Stufen (maschinenlesbare Agent-Card, echter
beidseitiger Handshake) folgen mit Modul 04.C / 05 / dem Mycel-Hub.

---

## Status
Vision-Karte. **Proto-gebaut:** „Bedeutung zuerst"-Prompt. **Native Mechanik
vorhanden:** Spore (02), Match (04), Anastomose (05). **Nächster Schritt:**
Visitenkarten-Präambel (Abschnitt 3) — auf Klaus' Zuruf.
