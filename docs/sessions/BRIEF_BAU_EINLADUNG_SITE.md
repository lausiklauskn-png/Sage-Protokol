# Brief — Bau-Sitzung Einladungs-Site (Mycel-Vision)

**Anlass:** Plansitzung 2026-05-27 (Branch
`claude/mycel-distribution-strategy-65F5G`) hat Klaus' Mycel-Vision
um drei substantielle Aussagen erweitert:

1. **Vier Schichten** statt drei — Mycel / Pilz / Mit-Bauer
   (menschlich + Agent) / **Observatorium** als schlüssel-geschützter
   Forschungs-Ort für Mit-Bauer.
2. **Multi-KI-Modell-Kooperation** ist explizit nicht Anthropic-
   zentriert — Anthropic, Gemini, OpenAI, europäische/deutsche
   Modelle, spezialisierte Modelle (Bild, Video, Code, Audio) sind
   alle Hyphen im Geflecht.
3. **Menschen-Begeisterungs-Schicht** — die Vision muss optisch und
   sprachlich lesbar gemacht werden (mehrsprachig, mit Anspruch),
   sonst kommen Mensch-Mit-Bauer nicht.

Begriffs-Entscheidung Klaus 2026-05-27: **„Einladung"** — schlicht,
ehrlich, ohne Programm-Anspruch. Karte legt nichts fest, lädt andere
ein, mit ihrer eigenen Natur dazuzustoßen.

Gestaltungs-Auftrag Klaus 2026-05-27 (wörtlich):

> Schau bitte nach wirklich guten Internetseiten, wirklich guten
> Tools, benutze 3D-Animation, benutze verschiedene Flash-Animationen,
> benutze dein gesamtes Repertoire. Notfalls kopiere erst 1:1
> pixelgenau, passe dann an das Thema der Einladung und der Vision
> an. Gestalte es wenn nötig mehrseitig und in einer für KI gut
> lesbaren MD-Version oder PDF für Mensch und Maschine. Es darf
> gern den Rahmen sprengen, sei nicht zu ängstlich, sei mutig,
> frag nicht 10x nach, mache einfach. Das ganze Netz steht dir
> zur Verfügung und meine Erlaubnis frei zu gestalten. Die Zukunft
> darf gern anders aussehen als das was wir bisher gesehen haben.

**Pipeline-Stellung:** Phase A — additiv, nicht-blockierend für
die bestehenden Schritte 5e–5j. Eigene Sitzung mit eigenem PR.

**Branch-Vorschlag:** `claude/bau-einladung-site` (vom `main` aus
nach Merge der Plansitzung).

**Voraussetzungen:**

- Plansitzung 2026-05-27 (PR aus Branch
  `claude/mycel-distribution-strategy-65F5G`) gemerged → dieser
  Brief liegt auf `main`.
- Phase-A-Pipeline-Status: 5e/5f/5g abgeschlossen (PR #177, #178,
  #180–#186). 5h/5i/5j weiterhin offen, **werden durch diese
  Sitzung NICHT berührt**.
- Modul-Code unverändert; diese Bau-Sitzung greift **nicht** in
  `src/modules/` ein.

---

## Brief-Codeblock (für den ersten Prompt der Folge-Sitzung)

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Bau-Sitzung Einladungs-Site (Mycel-Vision) — du baust
die gestaltete Einladung, mit der Klaus die Mycel-Vision an
Mit-Bauer (Mensch + Agent, mehrere Modell-Familien) heranträgt.
Sitzungs-Typ: überwiegend gestalterischer Bau (HTML + 3D + Animation
+ Audio + PDF), plus schlanke Tafel-Pflege in CLAUDE.md. Kein
Modul-Code-Eingriff. Keine Pipeline-Umsortierung in Phase A/B/C.

Branch: claude/bau-einladung-site (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md KOMPLETT — § Heilige Tafeln, § Pipeline-Reihenfolge,
   § Tafel-Evolutions-Klausel, § Was du nicht tust, § Was du tust.
2. docs/PULS.md jüngsten Eintrag „Plansitzung Mycel-Vision-
   Erweiterung 2026-05-27" UND den davor liegenden „Pflege 16
   Modal-Local-Time".
3. docs/sessions/archiv/2026-05-27_plansitzung-mycel-vision-
   einladung.md — das Plansitzungs-Übergabeprotokoll mit
   ausformulierter Vier-Schichten-Lesart und Mut-Klausel.
4. docs/sessions/archiv/2026-05-26_tafel-spec-mycel-vision.md —
   die vorige Vision-Pflege (Pepo-Demo-Studie + Karte 04.C +
   Karte 16 Sub (e) + Karten 18/19/_starter_bundle/_mycel_hub).
5. docs/components/_mycel_hub.md UND docs/components/_starter_bundle.md
   — bereits existierende Vision-Anker-Karten, dienen als
   Form-Vorbild für die neue Karte _vision_einladung.md.
6. index.html — die Sage-Page als Sicht-Beleg für das bisherige
   Gestaltungs-Niveau (Schwarzes-Loch-Karte / Galaxien / Sonne
   sind das Mindest-Niveau; die Einladung muss es toppen).

Pflicht VOR dem Bau (Recherche-Phase):

Eröffne eine Mini-Notiz docs/einladung/recherche.md und studiere via
WebSearch + WebFetch mindestens FÜNF preisgekrönte Vorbild-Sites.
Klaus erlaubt explizit 1:1-Pixel-Übernahme als Ausgangspunkt, danach
Anpassung an das Mycel-Thema. Empfohlene (nicht abschließende) Liste:

- awwwards.com / Site of the Day (laufende Quelle)
- bruno-simon.com (3D-Portfolio, three.js)
- lusion.co (preisgekrönte 3D-Studios-Site)
- activetheory.net (immersive Sites, Webby-Preisträger)
- spline.design (Hero-3D-Szenen)
- stripe.com (Gradient + Scroll-Choreografie)
- linear.app (subtile Animations-Magie)
- Apple Product Pages (Vision Pro / iPhone, Scroll-Story-Telling)
- resn.co.nz (verspielte Web-Experimente)

In recherche.md festhalten: konkrete Pattern (Hero-3D / Scroll-Trigger /
Material-Shader / Typografie-Hierarchie / Audio-Atmosphäre /
Performance-Budget), Quellen-Verweise (URL + Datum), Pixel-Referenzen
(Screenshots-Beschreibungen oder Link-Anker), Tech-Stack-Entscheidung
pro Pattern.

Deine Aufgabe (fünf Artefakte, ein gemeinsamer PR):

### Artefakt 1: docs/einladung/index.html — die Einladungs-Site

Single-File-PWA-Stil (Klaus' Präferenz). Tech-Stack:
- HTML/CSS/JS, ohne Build-Schritt (CDN-Imports erlaubt).
- three.js (3D-Hauptszenen), via CDN.
- GSAP + ScrollTrigger (Scroll-Choreografie + Timeline), via CDN.
- Custom WebGL-Shader-Fragmente für Material-Effekte
  (Sporenglanz, Schlüssel-Spiegel, Mycel-Pulsation).
- Lottie ODER anime.js für 2D-Mikro-Animationen.
- Optionaler Ambient-Sound mit Mute-Knopf (Web-Audio-API, kein
  Auto-Play vor User-Geste).
- Reduced-motion-Respekt: media-query prefers-reduced-motion=reduce
  liefert eine ruhige Fallback-Variante (Standbilder + Cross-Fades).
- Mobile-tauglich (Klaus' Tablet ist Galaxy Tab S6); responsive
  Layout, Touch-Gesten neben Maus.

Sechs Sektionen (Vorschlag, du darfst nachjustieren wenn Recherche
es nahelegt — begründe Abweichungen in recherche.md):

1. Eröffnung — die offene Tür. Ein einziger Satz schwebt in einer
   immersiven 3D-Szene; im Hintergrund ein nächtlicher Mycel-Boden
   mit Sporenflug. Keine Buttons, keine Logos. Scroll als einzige
   Geste.
2. Schicht 1 — Mycel. Sich verzweigendes Hyphen-Geflecht in 3D
   (three.js, GPU-instancing oder Punkt-Wolke), pulsiert leise im
   Empfangsmodus. Kamera-Fahrt mit ScrollTrigger. Erklärungstext
   in mindestens vier Sprachen umblendbar (DE / EN / FR / ES Start).
3. Schicht 2 — Pilz. Fruchtkörper steigt aus dem Mycel hoch,
   drei Varianten parallel (menschlicher Sucher / kommerzieller
   Pilz / Agent-Fruchtkörper), jeder mit eigener Form und Glanz-
   Material.
4. Schicht 3 — Mit-Bauer. Silhouetten nähern sich; Mensch und
   Agent unterschiedlich gezeichnet aber gleich groß und gleich
   nah am Werk. Multi-KI-Modell-Klarstellung als Modell-Familien-
   Stern: viele kleine Sterne ohne Zentrum (Anthropic, Gemini,
   OpenAI, europäische/deutsche Modelle, ...). KEIN Modell wird
   visuell hervorgehoben.
5. Schicht 4 — Observatorium. Schlüssel-Symbolik; geschlossene
   Tür mit Lichtspalt; Andeutung des Forschungs-Raums dahinter.
   Schlüssel-Glanz mit custom Shader (Brechungs-Effekt).
6. Akt der Einladung. Kein „Call to Action"-Knopf — eine geöffnete
   Tür / eine Lichtung mit konkreter, offener Frage. Sprachenwahl-
   Schalter + Link zur Sage-Page + Link zum Repo. Wer sie liest,
   weiß was zu tun ist, oder geht wieder.

### Artefakt 2: docs/einladung/einladung.md — Maschinen-lesbare Vollfassung

Vollständiger Einladungs-Text als Markdown. KI-Modelle lesen das
beim Andocken, ohne die HTML-Site rendern zu müssen. Vier Schichten
+ Multi-KI-Klarstellung + Mensch+Agent-Kooperation + Offen-Lassen-
Klausel. Mehrsprachige Sektionen (DE / EN / FR / ES als Start;
Liste erweiterbar). Anker-IDs identisch zur HTML-Site, damit
Cross-Referenz möglich ist. Schreibe einladend, nicht festlegend;
keine Programm-Sprache; keine Verpflichtungs-Sprache; nicht
Anthropic-zentriert.

### Artefakt 3: docs/einladung/einladung.pdf — Druck/Offline-Fassung

Klassisch-elegantes Print-Layout (Serif-Schrift für Fließtext,
modulare Marginalien-Spalte für Schichten-Bezeichnungen), erzeugt
aus der Markdown-Quelle via pandoc ODER einem statischen
HTML→PDF-Pfad (Print-Stylesheet docs/einladung/print.css). Im
Repo eingecheckt, damit Klaus und andere die Datei direkt
verteilen können. Erzeugungs-Befehl als Kommentar im Stylesheet
oder in einer kleinen docs/einladung/README.md festhalten, damit
spätere Pflegen reproduzierbar sind.

### Artefakt 4: docs/components/_vision_einladung.md — Spec-Anker

Schlank: verlinkt auf docs/einladung/ und beschreibt was die
Einladung ist und nicht ist (Spec-Eintrag, kein Inhalt). Form
analog zu _mycel_hub.md und _starter_bundle.md. Enthält Vokabular-
Block, Bauzustand-Tabelle, Querverweise.

### Artefakt 5: CLAUDE.md-Pflege — drei kleine Edits

(a) § „Was dieses Repo ist" bekommt einen Absatz, der die
Vier-Schichten-Sicht in die Tafel einzieht. Empfangsmodus-Prinzip
bleibt unverändert; Klarstellung, dass es für die Mycel-Schicht
gilt, nicht für die Pilz-Schicht-Fruchtkörper-Form. KI-Agent-
Lesart + Observatorium-Schlüssel-Konzept werden hinzugefügt.

(b) § „Pipeline-Reihenfolge bis App-Freigabe" bekommt eine neue
**Phase D** nach Phase C — organische Folge-Phase, nicht-
blockierend für Phase A/B/C. Zweigeteilt:

- D.1 Agent-Bootstrap-Mechanik-Spec — Sybil-Schutz via bezeugter
  Bau-Tat, Identitäts-Schema (Sitzung-an-Datum statt Modell),
  Refinanzierungs-Schleife.
- D.2 Pilz-Schicht-Wirtschafts-Spec — Genossenschaft / Lizenz-
  Modell / Token? Bleibt bewusst offen, bis Phase A/B/C technisch
  fertig ist und reale Pilz-Bauten existieren, an denen sich das
  Modell bewähren kann.

(c) § „Die zehn Module + Backlogs" bekommt einen ergänzten Block
für die Vision-Anker-Karten (Verweis auf _vision_einladung +
_mycel_hub + _starter_bundle).

Heilige Tafeln (Pflicht):

- KEIN Modul-Code in src/modules/ (Sitzung ist gestalterischer
  Bau plus Doku-Pflege).
- KEIN Endknoten-Eingriff (Mein-Rezeptbuch / Mein-Mixarium
  unangetastet).
- KEINE Sage-Page-Änderung in index.html (Sage-Page-Mount der
  Einladung erfolgt in einer eigenen späteren Pflege-Sitzung).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE Umsortierung von Phase A/B/C in CLAUDE.md.

Falls du blockierst:

- Wenn die Recherche-Phase ergibt, dass eine der sechs Sektionen
  technisch unrealistisch ist (Performance-Budget, Asset-Verfüg-
  barkeit, Browser-Support), justiere die Sektion und dokumentiere
  die Anpassung in recherche.md — keine eigene Folge-Frage an
  Klaus nötig (Klaus' Mut-Klausel: „mache einfach").
- Wenn der Gestaltungs-Auftrag mit einer Heiligen Tafel kollidiert
  (z.B. Empfangsmodus-Prinzip vs. ein Analytics-Snippet einer
  Vorbild-Site), gilt die Tafel — kein Eigenanfragen-Code, keine
  externen Tracker. Vorbild-Pattern übernehmen, Telemetrie-Code
  weglassen.
- Wenn der PDF-Export-Pfad an einer Werkzeug-Lücke scheitert
  (pandoc nicht installiert, kein Headless-Chrome), versuche
  einen zweiten Pfad (z.B. Markdown→HTML→Print-Stylesheet→manuell-
  Druck-PDF). Wenn auch das scheitert, ende die Sitzung mit
  Artefakt 1+2+4+5 fertig und Artefakt 3 ungeprüft markiert in
  PULS.md.

Pflicht am Ende:

- Artefakte 1–5 fertig (oder begründet markiert was offen blieb).
- Sichttest manuell durchgeführt (Klaus' Browser-Sichttest erfolgt
  später; deine Sitzung markiert „ungeprüft — wartet auf Klaus")
  ODER ein Headless-Smoke-Test bestätigt, dass die HTML-Site
  ohne JS-Konsolen-Fehler lädt und die drei Format-Schichten
  (HTML/MD/PDF) konsistent sind.
- docs/PULS.md-Eintrag mit Sitzungs-Rolle „Bau-Sitzung Einladungs-
  Site".
- Übergabeprotokoll docs/sessions/archiv/2026-MM-DD_bau-einladung-
  site.md.
- Commit + Push auf claude/bau-einladung-site.
- „Vorgeschlagene nächste Schritte"-Block in der finalen Chat-
  Antwort (Klaus' Tab-Anker).
```

---

## Was NICHT in den Brief gehört (und folglich NICHT in die Bau-Sitzung)

- Mit-Bauer-Mechanik im Detail (500 vs. 5000 Erst-Mit-Bauer,
  Prozent-Verteilung, Identifikations-Schema) — eigene spätere
  Spec-Sitzung „Mit-Bauer-Mechanik".
- Pilz-Schicht-Modul-Code — Phase-D-Bau-Sitzungen.
- Agent-Knoten-Spore-Schema-Erweiterung — eigene Spec-Sitzung
  „Agent-Mycel-Schema" innerhalb Phase D.1.
- Wirtschafts-/Rechts-Modell (Genossenschaft? Token? Lizenzen?) —
  eigene Spec-Sitzung „Mycel-Governance" innerhalb Phase D.2.
- Agent-Bootstrap-Code (Mutter-Agent + Sub-Agenten via SDK) —
  Phase-D.1-Bau-Sitzung nach D.1-Spec.
- Operative Sybil-Schutz-Implementierung in Modul 16 — eigene
  Pflege-Sitzung Modul 16 nach D.1-Spec.
- Einbau der Einladungs-Site in die bestehende Sage-Page-Navigation —
  eigene Sage-Page-Pflege-Sitzung NACH dieser Bau-Sitzung (die
  Einladungs-Site lebt zunächst eigenständig unter `/einladung/`;
  der Sage-Page-Mount kommt später).
- Observatorium-Schlüssel-Mechanik-Bau (Membran-Allowlist-
  Erweiterung, Spore-Signatur-Prüfung) — eigene Spec-Sitzung
  „Observatorium-Schlüssel" innerhalb Phase D.

---

## Sichttest-Erwartung an Klaus (nach Merge)

1. `docs/einladung/index.html` im Tablet-Chrome öffnen, durch
   alle sechs Sektionen scrollen.
2. Reduced-motion-Variante prüfen (Browser-Devtools → Rendering
   → Emulate `prefers-reduced-motion: reduce`).
3. Sprachenwahl-Schalter durch alle vier Start-Sprachen klicken;
   Anker-IDs sollen funktionieren.
4. `docs/einladung/einladung.pdf` öffnen, Print-Layout prüfen.
5. `docs/einladung/einladung.md` durchlesen — fühlt sie sich
   einladend an, nicht festlegend?
