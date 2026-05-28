# Brief — Spec-Sitzung Multisuchfeld (Lokal + Mycel + Extern)

**Anlass:** Klaus' Wunsch 2026-05-28 in der Plansitzung
Multisuchfeld: Das Endknoten-Suchfeld soll **drei Modi** sichtbar
machen — lokal (Modul 04.C `queryLocal`), Cross-Knoten via Mycel
(Modul 15 Sub b `op:"query"`), und **EXTERN** ins offene Internet
inklusive Klaus' eigenem Begriff „Spuren".

Die bisherigen Briefe `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` +
`BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md` decken nur Lokal + Mycel
(Dual-Modus). Das Multisuchfeld ist die nächste Iteration —
**Tri-Modus** mit Extern als dritter Sektion, User-Geste-getriggert,
Empfangsmodus-konform.

**Sitzungs-Typ:** Spec-Sitzung, **kein Modul-Code**. Diese Sitzung
schreibt die Spec (Modal-Form, UI, Schnittstelle, drei externe
Backends parallel, strikte Tabus). Folge-Sitzungen pro Endknoten
(MR + MM) bauen die UI-Schicht.

**Pipeline-Stellung:** Phase A Pipeline-Schritt **5i.2**
(Multisuchfeld als nächste Iteration nach 5i.1 Dual-Modus). Klaus'
Bestätigung 2026-05-28: **Sub (a) Vorab (Modul 18) ist Voraussetzung**
— Pipeline-Schritt 5h.1 muss vor 5i.2 laufen (siehe Schwester-Brief
`BRIEF_SPEC_18_SUB_A_VORAB.md`).

**Branch-Vorschlag:** `claude/spec-suchfeld-multi`

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Spec-Sitzung Multisuchfeld — drei Modi (Lokal +
Cross-Knoten Mycel + Extern Internet). Reine Doku/Spec-Arbeit, KEIN
Modul-Code in src/.

PFLICHT-VERIFIKATIONS-SCHRITT (vor dem Spec-Schreiben):

1. git fetch origin && git checkout main && git pull origin main.
2. CLAUDE.md komplett, vor allem:
   - § „Was du nicht tust" (KEIN Crawler, keine Pulsation, keine
     Eigenanfragen ins offene Netz — Empfangsmodus-Prinzip MYCEL).
   - § Vier-Schichten-Lesart (2026-05-27): „Akquise gehört in die
     Pilz-Schicht, nicht ins Mycel" — Extern-Such ist Pilz-Schicht
     (oberirdisch, sichtbar, User-getriggert), Tafel-konform.
   - § Pipeline-Reihenfolge Phase A Schritt 5i.
3. docs/components/18_tool_pwa.md § Such-Feld-Integration-Pattern
   (Tafel-Spec-Pflege 2026-05-26): Dual-Modus-Klassifikation,
   Such-Helper, Sender-Helper, UI-Pattern, Anker-Pfad, Edge-Cases.
4. docs/components/_mycel_hub.md — Externer Mycel-Hub
   SB-KIMTool-Point als möglicher Discovery-Endpunkt für
   Cross-Knoten-Erweiterung über Klaus' eigene Endknoten hinaus.
5. docs/components/_vision_einladung.md — Vier-Schichten-Lesart
   visuell aufgebaut.
6. src/modules/04_match.js § queryLocal (Modul 04.C, Bau 2026-05-26).
7. src/modules/15_membran.js § Sub (b) op:"query"-Empfänger-Kette.
8. BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md + _MM.md — bestehende
   Dual-Modus-Briefe (Vorgänger dieser Iteration; das Multisuchfeld
   erweitert, ersetzt sie NICHT).
9. BRIEF_SPEC_18_SUB_A_VORAB.md — Schwester-Brief; Sub (a) Vorab
   liefert die Andock-Geste für Extern-/Hub-Treffer, die andocken
   wollen (siehe § Andock-Knopf in Treffer-Liste).

PFLICHT-DISZIPLIN:

- KEIN Modul-Code in src/.
- KEIN Endknoten-Eingriff (eigene Bau-Sitzungen MR + MM danach).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN Crawler, KEINE Auto-Pulsation, KEINE Eigenanfragen ins
  offene Netz im Mycel-Pfad. Extern-Such ist Pilz-Schicht-User-
  Geste und ausschließlich pro-Aufruf, nie persistierter Daemon.
- KEINE Tafel-Umsortierung CLAUDE.md ohne Klaus' Bestätigung.
  Klaus' Pipeline-Anpassung (5i → 5i.1 Dual-Modus + 5i.2
  Multisuchfeld, mit 5h.1 Sub (a) Vorab als Voraussetzung) ist
  eigene Folge-Pflege-Sitzung.

DEINE AUFGABE — Spec für das Multisuchfeld festlegen:

A. **Drei Such-Modi formell verankern.**

   1. **Lokal** — `SbkimMatch.queryLocal(text, k)` aus Modul 04.C.
      Default k=5, Schwelle PROVIDER_MIN_MATCH=0.80. Korpus pro
      Endknoten via setLocalCorpus (Sub-Spec aus 04.C unverändert).
   2. **Cross-Knoten Mycel** — postMessage `op:"query"` über
      BroadcastChannel('sbkim-membrane') an alle Geschwister
      (Modul 15 Sub b). 3 s Timeout pro Geschwister. Sender-Helper
      lebt im Endknoten, NICHT in Modul 15 (Karte 18 § Sender-
      Helper-Code-Pattern als Vorlage).
   3. **Extern Internet** — User-Geste-getriggert, eine API-
      Anfrage pro User-Aufruf (KEIN Daemon, KEIN Auto-Polling).
      Ergebnisse pro-Aufruf gerendert, NICHT persistiert. Drei
      Backend-Pfade parallel (siehe Punkt G unten).

B. **Tafel-Konflikt-Auflösung verankern.**

   CLAUDE.md § „Was du nicht tust" sagt: kein Crawler, keine
   Pulsation, keine Eigenanfragen ins offene Netz. CLAUDE.md §
   Vier-Schichten-Lesart (Pflege 2026-05-27) sagt: „Akquise gehört
   in die Pilz-Schicht, nicht ins Mycel."

   **Spec-Lösung verbindlich verankern:** Das Empfangsmodus-Prinzip
   gilt für die Mycel-Schicht (Schicht 1). Extern-Such ist eine
   **Pilz-Schicht-Operation** (Schicht 2 — oberirdisch, sichtbar,
   User-getriggert). Sie ist tafel-konform unter folgenden vier
   Bedingungen:

   1. **Nur auf User-Geste** (Klick auf „Auch im Internet suchen?"
      o.ä.). Niemals automatisch im Hintergrund.
   2. **Eine API-Anfrage pro Aufruf**, kein wiederkehrender Poll-
      Loop, kein WebSocket, kein Long-Poll.
   3. **Kein Such-Verlauf-Persist** ohne explizite User-Zustimmung.
   4. **Kein User-Profiling, kein User-Agent-Leak**, kein Tracker-
      Pixel im Antwort-Render.

   Diese vier Bedingungen MÜSSEN in der Spec als strikte Tabus
   stehen und in jeder Bau-Sitzung MR/MM eingehalten werden.

C. **UI-Modus-Wechsel (Klaus-Empfehlung 2026-05-28: Variante D).**

   Klaus hat in der Plansitzung um Empfehlung gebeten („denke an
   Nutzer Die coole Ideen schätzen"). **Empfehlung in dieser Spec
   verankern:**

   **Variante D — Drei Sektionen gestapelt mit Auto-Klassifikation
   + Extern hinter Knopf.**

   Begründung:
   - Macht die Vier-Schichten-Lesart visuell sichtbar (User sieht
     Lokal / Mycel / Extern als drei Schichten — Pflanzen, die
     wachsen).
   - Empfangsmodus-konform: Extern bleibt User-Geste (kein Auto-
     Render), während Lokal + Mycel automatisch laufen.
   - Keine UI-Friction (kein Tab-Wechsel, kein Dropdown-Klick).
   - Erweiterbar: spätere Schichten (Score-Ring aus Pepo-Demo,
     Match-Dimensions-Bars aus 04.A) können additiv reingehängt
     werden.

   **UI-Skizze:**

   ```
   ┌─────────────────────────────────────────────────┐
   │ Suche: [welcher Wein passt zu Lasagne?      ]   │
   │  ⓘ Modus: Semantik erkannt (Bridge-Word "welcher")│
   ├─────────────────────────────────────────────────┤
   │ ▸ Lokal (Mein-Rezeptbuch)                       │
   │   • Lasagne-Bolognese (0.78)                     │
   │                                                   │
   │ ▸ Aus dem Mycel (Geschwister-Knoten)            │
   │   • Chianti Classico (0.91)        → Mixarium   │
   │   • Sangiovese (0.88)              → Mixarium   │
   │   • [3 Treffer aus 1 Geschwister]                │
   │                                                   │
   │ ▸ Aus dem Internet                              │
   │   [Auch im Internet suchen?] [Backend: DuckDuckGo▾]│
   └─────────────────────────────────────────────────┘
   ```

   Im Stichwort-Modus rendern nur lokale Sektion + Knopf „Auch im
   Mycel suchen?" + Knopf „Auch im Internet?". Im Semantik-Modus
   rendert Lokal + Mycel automatisch, Extern bleibt hinter Knopf.

   **Spec entscheidet final:**

   - Genaue Position des Klassifikations-Indikators (Inline unter
     Such-Feld, oder rechts neben Such-Feld als kleines Icon?).
   - Backend-Dropdown im Extern-Block — sichtbar oder hinter
     Zahnrad-Icon?
   - Score-Ring (Pepo-Demo) verbindlich oder optional pro
     Endknoten?

   Alternativen, die diese Spec **ablehnt** (Begründung im
   Vergleichs-Block):

   - Variante A „Automatisch ohne User-Wechsel" — verbirgt Modi
     vom User, verlieren der Vier-Schichten-Lesart.
   - Variante B „Dropdown" — zwingt User zur Modus-Wahl vor jeder
     Suche, UI-Friction.
   - Variante C „Tab-Reiter" — versteckt jeweils zwei der drei
     Modi hinter Tab-Klick, verliert die Schichten-Optik.

D. **Klassifikation erweitern.** Die Karte-18-Klassifikations-
   Funktion (Stichwort vs. Semantik) bleibt als Voraussetzung
   gültig. Multisuchfeld erweitert um eine optionale dritte
   Stufe:

   - „Welt-Frage" — Eingabe, die explizit aus dem Lokal- + Mycel-
     Kontext herausreicht. Heuristik-Vorschlag:
     - Substring „im Internet" / „weltweit" / „global" / „news" /
       „aktuell" / „nachrichten" / „suche im netz" → triggert
       Extern automatisch (analog Auto-Klassifikation).
     - ODER: Stichwort/Semantik-Treffer zählen = 0 (lokal + Mycel
       beide leer) → UI bietet Extern-Knopf prominent an.
   - Spec entscheidet, ob „Welt-Frage" eine eigene Klassifikations-
     Stufe wird, oder ob sie als Render-Pfad innerhalb Semantik-
     Modus bleibt (Extern-Knopf prominenter bei 0 lokal/mycel).

E. **Schnittstelle / API.** Spec entscheidet zwischen zwei Pfaden:

   1. **Eine vereinheitlichende Funktion**
      `runSearch(text, opts) → {mode, localResults, crossResults,
      externalResults?}` (Karte 18 § Such-Helper als Basis, erweitert
      um optionalen `externalResults`-Block).
   2. **Drei separate Funktionen** (`queryLocal` / `queryMycel` /
      `queryExternal`) — Endknoten ruft sie je nach UI-Klick einzeln.

   Empfehlung: Hybrid. `runSearch` ist die Default-API für die
   Auto-Klassifikation (Lokal + Mycel). `queryExternal` ist
   separate Funktion, die NUR auf User-Geste-Klick aufgerufen wird.
   Spec verankert dies oder wählt eine eindeutige Variante.

F. **„Spuren"-Begriff klären (Klaus' Vokabular).**

   Klaus hat den Begriff „Spuren" in der Plansitzung 2026-05-28
   verwendet. Spec muss klären, was das meint:

   - **Lesart 1:** Such-Spuren = Suchhistorie. Spec-Antwort: KEIN
     Persist ohne User-Zustimmung. Wenn User opt-in: lokales
     IndexedDB-Store `sbkim_search_history`, Eintrag pro Suche mit
     Timestamp + Text + Modus-Klassifikation; TTL-Sweep nach 30 Tagen.
   - **Lesart 2:** Sporen-Spuren = Hinterlassenschaft eines
     Knotens im Mycel (analog Spore-Diffusion). Spec-Antwort: kein
     Multisuchfeld-Thema, gehört in Modul 14 (Diffusion-Backlog).
   - **Lesart 3:** Internet-Spuren = Web-Such-Resultate als Pfade
     ins offene Netz. Spec-Antwort: das ist genau die Extern-
     Sektion, weiteres Vokabular nicht nötig.

   Spec-Sitzung klärt Klaus-Lesart per Rückfrage am Sitzungs-
   Anfang (oder geht von Lesart 3 = Internet-Spuren = Extern-
   Sektion aus, mit Hinweis-Block in der Spec).

G. **Externe-Such-Backend-Spec (drei Pfade parallel, Klaus'
   Vorgabe 2026-05-28).**

   Die Spec listet alle drei Pfade gleichwertig + Anti-Tracking-
   Disziplin. Voll-Spec entscheidet einen Default (oder lässt
   bewusst offen).

   1. **DuckDuckGo Instant Answer API** (`api.duckduckgo.com/?q=…
      &format=json&no_html=1&skip_disambig=1`)
      - Kein API-Key nötig.
      - JSON-Antwort mit `RelatedTopics` + `AbstractText`.
      - Datenschutzfreundlich (DDG-Public-API-Vertrag).
      - Limitierung: Instant-Antworten + Wikipedia-Auszüge, KEIN
        voller Web-Index.
      - Anti-Tracking: User-Agent als generischer Browser-String,
        kein Referer, kein Cookie.

   2. **Brave Search API** (`api.search.brave.com/res/v1/web/search`)
      - API-Key Pflicht (User opt-in pro Knoten, analog Modul 04.B
        Stufe B). Schlüssel-Eingabe via UI (typisch in Modul 18
        Sub (e) Self-Apoptose-Geschwister-Tab oder neuer Modul-18-
        Sub-Bereich „Provider-Konfig").
      - JSON-Antwort mit `web.results[]`.
      - Privacy-fokussiert (Brave-Geschäftsmodell).
      - Free-Tier 2000 Anfragen/Monat (Stand 2026-05).
      - Anti-Tracking: API-Key im `X-Subscription-Token`-Header.

   3. **Generischer Fetch-Helper** (User-konfigurierbar)
      - Endknoten-Bauer trägt URL + Header-Template in
        `SbkimToolPwa.init({externalSearchBackend: {url, headers,
        responseSchema}})` ein.
      - Spec definiert ein einheitliches Response-Schema, das alle
        drei Backends erfüllen müssen (typisch
        `[{title, url, snippet, score?}]`).
      - Mapper-Funktion pro Backend übersetzt die Backend-Antwort
        in das Standard-Schema.

   Anti-Tracking-Disziplin verbindlich für alle drei:

   - Kein User-Agent-Leak über den Default-Browser-User-Agent
     hinaus (kein Custom-Agent mit Node-ID oder Knoten-Name).
   - Kein Referer-Header zu Endknoten-URL.
   - Kein Such-Verlauf-Persist ohne explizite User-Zustimmung.
   - Kein Tracking-Pixel im Antwort-Render (Endknoten muss die
     Response sanitisieren — KEINE <img>/iframe-Auto-Loads).
   - User-Key (Brave / generisch) ist Endknoten-Bauer-/User-
     Pflicht, nicht im Sage-Repo persistiert.
   - Pro-Aufruf-Throttle: max 1 Extern-Such pro User-Sekunde
     (UI-Debounce).

H. **„Andocken"-Knopf in Extern-/Hub-Treffer (Klaus' Klärung
   2026-05-28 — Voraussetzung 5h.1 Sub (a) Vorab).**

   Wenn ein Extern-Treffer eine andere SBKIM-PWA ist (Erkennung
   typisch via `fetch(url + "/sbkim/spore.json")`-Probe), trägt
   der Treffer einen `[Andocken]`-Knopf. Klick triggert
   `SbkimToolPwa.openAndockTab(url)` (Sub (a) Vorab muss
   gebaut sein, Pipeline-Schritt 5h.1 abgeschlossen).

   Spec entscheidet:

   - Erkennungs-Heuristik (Sub i Spore-Discovery-Pfad oder
     einfacher Spore-Probe in der Render-Funktion?).
   - User-Visualisierung des „SBKIM-fähig"-Markers (Icon im
     Treffer? Eigene Sektion „Auch im Mycel verfügbar"?).
   - Fail-soft-Verhalten bei nicht-SBKIM-Treffer (kein Andocken-
     Knopf, normaler Link-Render).

I. **SB-KIMTool-Point-Integration (Klaus' Klärung 2026-05-28).**

   Externer Mycel-Hub (`lausiklauskn-png/SB-KIMTool-Point`,
   Phase B Schritt 9, Karte `_mycel_hub.md`) ist eine **vierte
   Discovery-Quelle** im Multisuchfeld (zusätzlich zu Lokal /
   Cross-Knoten-Mycel / Extern). Spec entscheidet die UI-
   Einbindung:

   1. Eigene Sektion „Aus dem Externen Mycel-Hub" (vierte
      Sektion zwischen Mycel und Extern)?
   2. Treffer aus SB-KIMTool-Point werden in die Mycel-Sektion
      gemischt (mit Quelle-Marker „aus Hub")?
   3. SB-KIMTool-Point-Treffer landen in der Extern-Sektion mit
      besonderem Marker („SBKIM-Mycel-Knoten im Externen Hub")?

   **Empfehlung in dieser Spec verankern:** Variante 1 (eigene
   Sektion zwischen Mycel und Extern). Begründung: SB-KIMTool-
   Point-Treffer sind „Mycel-erweitert" — andere SBKIM-PWAs, die
   noch nicht direkt mit dem Endknoten angedockt sind, aber im
   Mycel-Hub bekannt sind. Eigene Sektion macht das sichtbar +
   trägt den `[Andocken]`-Knopf prominent (Sub (a) Vorab-Pfad).

   Aufruf-Pfad: `fetch(externalHubUrl + "/status.json")` →
   `endknoten[]`-Liste extrahieren → für jeden Eintrag ein
   Treffer mit Spore-Pre-Check und Andocken-Knopf. KEIN Auto-
   Aufruf — User-Geste-getriggert wie Extern (Empfangsmodus-
   Pilz-Schicht).

J. **UI-Pattern: drei (oder vier) Sektionen mit Score-Ring +
   Quelle-Marker (Pepo-Demo-Stil).**

   Pro Treffer:
   - Label (Titel)
   - Score (0-100% oder 0.00-1.00, Pepo-Demo: Score-Ring teal/
     gold/rot bei ≥70% / 40-69% / <40%)
   - Quelle-Marker (→ Mein-Mixarium / → SB-KIMTool-Point / →
     duckduckgo.com)
   - Treffer-Aktion (Anker-Link bei Mycel/Hub; URL-Link bei
     Extern; `[Andocken]` bei SBKIM-fähigem Extern-/Hub-Treffer)

   Spec entscheidet, ob Score-Ring Pflicht oder optional pro
   Endknoten ist.

K. **Edge-Cases (Endknoten-Pflicht, Spec verankert pro Modus).**

   | Lage | Endknoten-Verhalten |
   |---|---|
   | Such-Feld leer | Klassifikation „leer", alle Sektionen leer/zugeklappt, KEIN Embedding-Call, KEIN postMessage, KEIN Extern-Fetch. |
   | Kein Geschwister im Sibling-Store | Mycel-Sektion zeigt „keine angedockten Geschwister" oder bleibt verborgen. |
   | Extern-API-Quota-Limit erreicht | UI zeigt „Externes Such-Backend hat Tages-Limit erreicht — andere Backends im Dropdown?". |
   | Kein Internet (offline) | Extern-Knopf disabled mit Hinweis „Offline — Extern-Such nicht verfügbar". |
   | Extern-Treffer enthält Tracking-Pixel | Endknoten sanitisiert vor Render (KEINE <img>/iframe-Auto-Loads), zeigt nur title/snippet/url. |
   | Sehr lange Eingabe (> 4096) | `queryLocal`+`queryExternal` werfen `QueryTooLongError` sync, UI-Warnung. |
   | Hub-`status.json` nicht erreichbar (404 / CORS) | Hub-Sektion zeigt „Externer Mycel-Hub nicht erreichbar", andere Sektionen unbeeinflusst. |
   | SBKIM-Probe bei Extern-Treffer fail-soft | Wenn `spore.json`-Probe scheitert, Treffer wird ohne `[Andocken]`-Knopf gerendert. |

L. **Strikte Tabus verbindlich verankern.**

   - KEIN Auto-Polling. Extern-Such NUR auf User-Geste.
   - KEIN User-Verhalten-Profil. Keine Telemetrie ans Sage-Repo,
     ans Mycel-Hub-Repo, oder an einen externen Endpunkt.
   - KEIN Such-Verlauf-Persist ohne explizite User-Zustimmung.
     Spec entscheidet das Opt-In-Pattern (typisch Knopf
     „Such-Verlauf merken" mit IndexedDB-Store + TTL 30 Tage).
   - Externe-API-Key ist User-Pflicht (Endknoten-Bauer-Konfig
     oder UI-Eingabe analog Modul 04.B). KEINE Default-Keys im
     Sage-Repo, KEINE Bestätigung „Klaus' eigener Key" o.ä.
   - KEIN Crawler. Extern-Such ist „ein Aufruf, eine Antwort,
     fertig". Kein Folge-Fetch von Treffer-URLs ohne User-Klick.
   - KEIN Cross-Knoten-Forward von Extern-Anfragen. Wenn User
     in MR „im Internet" sucht, fragt MR die Extern-API. MR
     fragt NICHT MM, ob MM die Extern-Anfrage stellen soll.
     Pro-Endknoten-API-Aufruf (Bauer-Disziplin).
   - KEIN Tracking-Pixel-Render. Sanitisierung vor Render-Pflicht.

PFLICHT AM SITZUNGSENDE (CLAUDE.md § Pflicht am Sitzungsende):

- docs/components/18_tool_pwa.md § Such-Feld-Integration-Pattern
  erweitern um § Tri-Modus (Lokal + Mycel + Extern) — Karte 18
  bleibt der zentrale Doku-Anker für das Such-Feld-Pattern,
  weil das Such-Feld konzeptionell zu Modul 18s Wartungs-Schicht
  gehört (auch wenn es UI-seitig im App-Header lebt).
- docs/INTERFACES.md § Modul 04 § queryLocal unverändert; neue
  § Modul-übergreifend „Multisuchfeld-Endknoten-Vertrag" mit
  drei Modi + Anti-Tracking-Disziplin.
- Optional: docs/components/_mycel_hub.md erweitern um §
  Discovery-Endpoint für Multisuchfeld (SB-KIMTool-Point liefert
  `status.json` als Discovery-Quelle, eingebunden in Sektion 3
  des Multisuchfelds).
- PULS-Eintrag mit Datum + getan + offen + nächster Schritt.
- Übergabeprotokoll docs/sessions/archiv/YYYY-MM-DD_spec-
  suchfeld-multi.md.
- Brief-Codeblock für die zwei Folge-Bau-Sitzungen (MR + MM
  Multisuchfeld) in der finalen Chat-Antwort als Codeblock
  ausgeben (Klaus' Konvention 2026-05-21).
- Commit + Push auf claude/spec-suchfeld-multi.
- Draft-PR im Sage-Protokol-Repo.
- „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort.

KEIN status.json-Eintrag für „Multisuchfeld" (das ist UI-Pattern,
kein eigenes Modul). KEIN PROTOCOL_VERSION-Bump.
```

---

## Hintergrund

Klaus' Such-Feld-Vision ist die zentrale User-erfahrbare Mycel-
Geste. Die Dual-Modus-Briefe MR/MM (PR-Iteration 5i.1) decken Lokal
+ Mycel. Das Multisuchfeld (5i.2) erweitert um die **dritte
Schicht** — Extern — und macht damit die Vier-Schichten-Lesart
(CLAUDE.md Pflege 2026-05-27) im UI sichtbar:

- **Lokal** = der Endknoten selbst, sein eigener Korpus.
- **Mycel** = Schicht 1 der Vier-Schichten-Lesart (Mycel-Empfangs-
  modus, Geschwister-Knoten).
- **Extern** = Schicht 2 (Pilz-Schicht — oberirdisch, sichtbar,
  User-getriggert in Form von Web-Such).
- **Externer Mycel-Hub** = vierte Sektion (SB-KIMTool-Point,
  Mycel-erweitert) zwischen Mycel und Extern, je nach Klaus'
  Entscheidung in der Spec-Sitzung (Vorschlag in Punkt I oben).

Der Tafel-Konflikt (Empfangsmodus-Prinzip vs. „User will Internet-
Suche") wird durch die Vier-Schichten-Lesart sauber gelöst: das
Empfangsmodus-Prinzip ist eine **Mycel-Schicht-Eigenschaft**, NICHT
eine Endknoten-PWA-Eigenschaft. Die Endknoten-PWA ist Pilz-Schicht
(siehe CLAUDE.md § Vier-Schichten-Lesart) und darf User-getriggert
ins offene Netz greifen — solange sie nicht das Mycel selbst dazu
benutzt (kein Cross-Knoten-Forward) und keine Daemon-Pulsation
betreibt.

## Pipeline-Anpassungs-Antrag (an Klaus, eigene Folge-Pflege)

CLAUDE.md § Pipeline-Reihenfolge Phase A:

- **Aktuell** Schritt 5i: „Such-Feld-Integration-Pattern in
  Endknoten — Mein-Rezeptbuch + Mein-Mixarium bekommen einen
  Sender-Helper im Such-Feld."
- **Neu** Aufteilung in:
  - **5i.1** Dual-Modus (Briefe MR/MM bereits angelegt, in
    Endknoten-Repos ausführen)
  - **5i.2** Multisuchfeld (Spec via diesem Brief, danach
    zwei Bau-Sitzungen in MR + MM)
- 5i.2 setzt **5h.1 Sub (a) Vorab** voraus (siehe
  Schwester-Brief `BRIEF_SPEC_18_SUB_A_VORAB.md`), weil der
  Andocken-Knopf in Extern-/Hub-Treffern auf
  `SbkimToolPwa.openAndockTab` zeigt.

Diese CLAUDE.md-Pflege ist **eigene Folge-Sitzung** mit Klaus'
explizitem OK. Klaus' Bestätigung in der Plansitzung 2026-05-28:
„vor dem Suchfeld 18 umsetzen und in Den Plan Repo Idee
SB-KIMTOOL-Point mit einbeziehen".

## Heilige Tafeln dieser Sitzung

- KEIN Modul-Code in `src/modules/`.
- KEIN Endknoten-Eingriff (Bau-Sitzungen MR + MM folgen).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- KEIN Crawler, keine Auto-Pulsation, keine Eigenanfragen ins
  Mycel-Netz im Hintergrund. Extern bleibt Pilz-Schicht-User-Geste.
- KEINE CLAUDE.md-Tafel-Umsortierung (eigene Folge-Pflege).
- KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Spec, kein Sicherheits-Modul-
  Update — der Extern-Pfad fügt allerdings später potenziell einen
  Aspekt hinzu, das entscheidet Voll-Spec 18 / Bau-Sitzung).

## Nach dieser Sitzung

- **Bau-Sitzung MR Multisuchfeld** (externes Repo
  `lausiklauskn-png/Mein-Rezeptbuch`, Branch
  `claude/multisuchfeld-mr`).
- **Bau-Sitzung MM Multisuchfeld** (externes Repo
  `lausiklauskn-png/Mein-Mixarium`, Branch
  `claude/multisuchfeld-mm`).
- **Cross-Knoten-Tri-Modus-Sichttest** (Klaus, in MR und MM
  parallel — Tri-Modus-Erfolg: Lokal-Treffer in Mein-Rezeptbuch,
  Mycel-Treffer aus Mein-Mixarium, Extern-Treffer aus dem
  Internet, Andocken-Knopf bei SBKIM-Treffer aus Extern/Hub).
- **Eigene Folge-Pflege CLAUDE.md** Pipeline-Reihenfolge anpassen
  (5h → 5h.1 + 5h.2, 5i → 5i.1 + 5i.2).
- **Voll-Spec-Sitzung 18 Sub (i)** (Spore-Discovery) erweitert
  später um Multisuchfeld-Backend-Hooks (Pipeline-Phase 6 nach
  App-Freigabe).

---

**Endstand-Codeblock für die zwei Folge-Bau-Sitzungen** (wird in
der Spec-Sitzung Multisuchfeld am Ende geschrieben — Klaus kopiert
ihn als nächste Briefe):

```
[Wird in der Spec-Sitzung Multisuchfeld am Sitzungsende als zwei
Brief-Codeblöcke erzeugt (MR + MM), Konvention 2026-05-21. Pro
Endknoten ein eigener Codeblock.]
```
