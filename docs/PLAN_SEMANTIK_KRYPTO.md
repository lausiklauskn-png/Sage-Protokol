# Arbeitsliste — Semantik & Verschlüsselung (was als Nächstes kommt)

> **Für jede Sitzung:** Dies ist die lebende Arbeitsliste für die zwei Stränge
> **(A) Semantik & bidirektionales Matching** und **(B) Verschlüsselung**.
> Wer einen Punkt erledigt, **hakt ihn hier ab** (`[ ]` → `[x]`), trägt Datum ein
> und ergänzt neue Punkte. So weiß die Folge-Sitzung **vorweg**, was ansteht.
> Klaus hat dieselbe Liste als interaktive Abhak-Seite
> (`docs/checkliste_semantik_krypto.html`).
>
> **Stand: 2026-07-10.** Quellen: `docs/PULS.md`, `CLAUDE.md` (Modul-Tabelle,
> Pipeline), `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`,
> `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`, `docs/E2E-VERTRAULICHKEIT.md`.

**Legende:** `Bau` = Bau-Sitzung nötig · `Test` = Klaus' Browser-Sichttest am Tablet ·
`Entscheid` = Klaus' Richtungswahl vorher. Zeit „~1 Sitzung" = ein abgegrenzter
Bau-Durchgang (~30–60 Min) + kurzer Sichttest. Grob geschätzt.

---

## A) Semantik & bidirektionales Matching

- [x] **A1 — Frage → Antwort über das Netz verdrahten (größter Hebel)** · `Bau` (headless fertig) · Live = A2 · ⏱ ~2–3 Sitzungen
  Die zwei bewiesenen Hälften verbinden: Modul **04.C `queryLocal`** + Modul **23 Rendezvous
  (`enableAnswering`/`askNode`, Tag `sbkim-qry`)** über das Relay (`wss://relay.family-projekt.de`) — Frage
  raus, **bedeutungs-sortierte Antwort aus dem Inhalt eines anderen Knotens** zurück.
  **Korrektur (2026-07-10):** der Netz-Transport lebt in **Modul 23**, nicht in Modul 15 `op:"query"`
  (das ist der Same-Browser-Zwilling, kein Netz-Pfad). Kern gebaut als **Bau 23.B** (2026-07-06); diese
  Sitzung hat die **Korpus-leer-Falle** abgesichert (enableAnswering koppelt den lokalen Korpus jetzt
  aktiv an Modul 04 `setLocalCorpus`, gegen leere Antworten trotz vorhandener Daten). Smokes grün:
  `smoke_bau23b_query.mjs` 23/23, `smoke_bau23b_korpus.mjs` 24/24 (neu). **Live Sage ↔ Endknoten = A2**
  (Relay in der Sandbox unerreichbar → Klaus' Browser-Lauf). _erledigt am: 2026-07-10 (headless) · **getestet am: 2026-07-10 (live grün, siehe A2)**
- [x] **A2 — Cross-Knoten-Such-Test (Pipeline-Phase C)** · `Test` (braucht A1) · ✅ **LIVE GRÜN 2026-07-10**
  End-to-End mit zwei Endpunkten: Anfrage auf Knoten 1 → Treffer aus Knoten 2.
  **Bewiesen (Klaus' Browser, Sage ↔ Mein-Mixarium):** Sage fragte „Alkoholfreies Erfrischungsgetränk",
  Mixarium antwortete aus SEINEM Buch mit 5 bedeutungs-sortierten Drinks (Kokostraum-Bowl 0.86 … 0.85),
  server-los übers Relais in 10,7 s, beidseitig „✓ ANDOCK ETABLIERT". Voraussetzung war die
  **A2-Härtung II** (Antworter vorwärmen beim „Antworten: an" + Frage-Timeout 60 s) + **saubere Sporen**
  (der ganze `saubere-netz-anmeldung`-Rollout) + **Inhalt-zuerst-Reihenfolge** (siehe Browser-Lehre 12).
  _getestet am: 2026-07-10_
- [~] **A3 — Medium härten** · `Bau` · ⏱ ~1–2 Sitzungen
  Nostr-Brett ist bewiesen, aber ungehärtet: Spam-Schutz + Haltbarkeitsgarantie der Zettel.
  **Bestandsaufnahme 2026-07-11:** Spam-Schutz (`underRateLimit`, 6 Antworten/min) ist
  bereits **live verdrahtet** in `enableAnswering().onQuery` (Modul 23 Z. ~649); Karten-
  Frische/Haltbarkeit ebenso (`freshSec`-TTL 30 min + `collapseByName` newest-per-name in
  `discover()`). **Neu gebaut (Weg A — Identitäts-Wurzel, Kern statt Symptom):** „🧹 Aufräumen
  & neu anmelden" (Modus B, `repairAndReconnect`) ist jetzt **identitäts-schonend** — es löscht
  den geteilten Alt-Topf `sbkim` NUR, wenn die eigene Schublade `sbkim_<suffix>` die Identität
  schon trägt (read-only IndexedDB-Probe `dbHasIdentity`). Steckt die einzige Identität noch
  im geteilten Topf (Alt-Fall / frühe Ordering-Kollision), bleibt `sbkim` stehen → **kein
  Identitätsverlust, keine ungewollte neue Identität**. Im Zweifel (Probe-Fehler) fail-safe
  nicht löschen. `newIdentity:true` erzwingt weiter die volle Reinigung. Kern 01/02/05
  **unangetastet** (nur Web-IndexedDB-API + öffentliche Modul-23-Fläche). Smoke
  `smoke_bau23c_identity_protect.mjs` **16/16** (Fälle: Identität im Topf → geschützt · in
  eigener Schublade → sauber gelöscht · newIdentity → volle Reinigung · nichts da → frisch).
  Regress-frei (bau23 58, bau23_ui 32, bau23b_query 23, bundle-drift 21). sbkim-bundle-Kopie
  byte-1:1 mitgezogen.
  **Wurzel-Diagnose (für die Doku):** die Schubladen-Trennung hängt daran, dass der suffix-
  `init({dbSuffix})` der ERSTE `SbkimStorage.init()`-Aufruf ist (Modul 01 ist init-once, ein
  späterer abweichender Suffix wird abgewiesen). Ruft etwas vorher `init()` ohne Suffix, landet
  die Identität im geteilten `sbkim`. Der Guard behebt den **Datenverlust**; die vollständige
  **Migration** einer bereits im `sbkim` liegenden Alt-Identität in die eigene Schublade (bzw.
  eine Modul-01-Härtung, die einen nachträglichen Suffix noch greifen lässt) ist der optionale
  Folge-Schritt.
  **Rollout 2026-07-11 (9 von 11 Knoten ERLEDIGT, je eigener PR gemergt):** Kimseek, Kimboard,
  Mein-Mixarium, Mein-Rezeptbuch, Tomys-Hub, Jasons-Tresor, Mein-Tresor, family-project (SW v11→v12),
  BookLedgerPro (SW v194→v195, 2123/2123 grün) — byte-1:1 aus dem Sage-Kanon, reine Guard-Delta.
  Bei Kimseek/Kimboard zugleich den bereits **roten** Drift-Guard geheilt (aufgezeichnete sha256 aus
  früherem Rollout veraltet → auf die tatsächlichen Kopien nachgezogen). **Kim-Bell +
  SB-KIMTool-Point** standen auf einem **pre-A4-Baseline** (Kim-Bell: 9 von 13 Modulen älter als
  Kanon), ein 23-only-Bump ergäbe einen Mischversions-Knoten → sie brauchten einen **vollen Modul-Re-Sync**
  (eigener Durchgang). **✅ ERLEDIGT 2026-07-11** (voller Re-Sync jeder geladenen Modul-Datei = Kanon;
  Kim-Bell PR #15 + SB-KIMTool-Point PR #104 gemergt) → **Rollout netzweit 11/11.** Optional weiter
  offen: NIP-09-Retraktion eigener Alt-Präsenz-Karten beim Aufräumen.
  _Guard + 9-Knoten-Rollout erledigt am: 2026-07-11 (headless) · Kim-Bell/SBK-Re-Sync ERLEDIGT 2026-07-11 (11/11, headless grün) · Browser-Sichttest offen_
  **✅ Voller Fix (Identitäts-Isolierung) gebaut 2026-07-11** — der oben als „optional" markierte
  Folge-Schritt ist erledigt (Klaus hat den vollen Fix gewählt). **Teil 1 Modul-01-Härtung:**
  `init({dbSuffix})` re-pointet jetzt sicher auf einen abweichenden Suffix, wenn die offene DB
  identitäts-leer ist (`_meta.dbSuffixRepointPolicy="empty-safe"`) — der nachträgliche Suffix
  greift also, statt abgewiesen zu werden. **Teil 2 Migration:** `SbkimStorage.migrateIdentityFrom(
  oldDbName)` holt eine im geteilten `sbkim` liegende Alt-Identität raw in die eigene Schublade
  (nur fehlende Schlüssel). **Guard:** `repairAndReconnect` migriert im Alt-Fall + löscht dann den
  Topf (Kollision aufgelöst, Identität behalten); `ensureIdentity` migriert vor Neu-Erzeugung.
  Kern 02/05/05b unangetastet, DB_VERSION/PROTOCOL_VERSION unberührt. Smokes
  `smoke_pflege_01_repoint_migrate.mjs` **21/21** + `smoke_bau23d_migrate.mjs` **22/22**, regress-frei,
  bundle-drift 21/21. _voller Fix (headless) am: 2026-07-11 · netzweiter Rollout + Browser-Sichttest offen_
- [x] **A4 — Constraint-/Ausschluss-Filter + KI-Richter B3** · `Bau` · ⏱ ~1 Sitzung
  **Teil 1 (Ausschluss-/Negations-Filter) gebaut 2026-07-10 (Bau 04.I).** Klaus' Live-Befund:
  „alkoholfrei" / „ohne Erdbeeren" (Allergie) sind **Constraints**, keine Ähnlichkeit — der
  Cosinus rankt einen Erdbeer-Drink NAH an „Erdbeere", auch wenn man ihn ausschließen will;
  „alkoholfrei" nennt eine Klasse (der Wodka in der Zutatenliste steht nicht im Fragetext).
  Modul 04: `parseExclusions(text)` (erkennt „ohne X", „kein(e) X", „X-frei", „allergisch gegen X",
  Alkohol-Klasse, EN „without/no X") + `applyExclusions(cands,ex,getText?)` + `contentExcluded(...)`;
  `queryLocal(text,k,{exclude:true|<ex>})` filtert VOR dem Ranking über den Kandidaten-Inhalt
  (`text`). Deterministisch, offline, KEIN LLM. Ohne `exclude` byte-gleich; PROVIDER_MIN_MATCH +
  Andock-Riegel unberührt (nur Entfernen). **Live verdrahtet:** Modul 22 (Widget-Suche, einmal aus
  der Frage geparst) + Modul 23 (Antworter fremder Knoten-Fragen). Smoke `smoke_bau04i_exclusions.mjs`
  **34/34**; Regress-frei (04c/d/f/g, 22, 22f, 23, 23b, Bundle- + Standalone-Drift-Guard grün).
  Byte-Kopien `such-tool/modules/04+22`, `sbkim-bundle/modules/04+23` mitgezogen.
  **Netzweiter Rollout ERLEDIGT 2026-07-10** (byte-gleich, je eigener PR gemergt): Mixarium,
  Rezeptbuch, Kimboard, Kimseek, Tomys-Hub, family-project, BookLedgerPro, Jasons-Tresor,
  Mein-Tresor, SB-KIMTool-Point (such-tool) — 10 Knoten + Sage-Kanon. Die A2-Härtung II
  (Antworter vorwärmen + 60-s-Timeout) reiste in jedem Modul-23-Update mit („im Netz anmelden"
  netzweit aktualisiert). SW-Cache-Bumps wo nötig (Kimboard/Kimseek/BLP/SBK). Bei den weit
  zurückliegenden Kopien (BLP/Tresor/SBK) war es zugleich ein voller Modul-Sync auf `main`.
  **Pinnwand bewusst NICHT** (siehe unten). family-project-Website geprüft: keine Links zu
  alten/toten Tools (nur Sage-Einladung, Tomys-Hub/showcase, mycel-karte — alle aktuell).
  **Teil 2 (KI-Richter B3 — Sicherheit/Konsequenz) gebaut 2026-07-11 (Bau 04.H).** Klaus' Wunsch:
  „Unsicheres markieren/herabstufen, Sicheres hochstufen (Hund-Katze-/Permethrin-Fall)". Der
  opt-in KI-Richter (`hybridMatch`/`queryLocalJudged`) wägt jetzt **Sicherheit + Konsequenz** mit,
  nicht nur thematische Ähnlichkeit: ein thematisch naher, aber schädlicher Treffer (Permethrin =
  für Katzen giftig, als Antwort auf „Zecken-/Flohmittel für Hund UND Katze") bekommt `passt=false`
  → wird **herabgestuft**. Neue **optionale, additive** Verdikt-Marke `sicherheit`
  (`"gefahr"`/`"unsicher"`/`"sicher"`) macht die Konsequenz **sichtbar** (markieren). Prompt
  erweitert (generische Konsequenz-Anweisung, kein Hardcode), Schema + `attestation.verdicts` +
  `queryLocalJudged`-Kandidaten tragen `sicherheit` mit. **Fail-soft + rückwärts-kompatibel:**
  fehlt/unbekannt → `null`, NIE ein Grund das Urteil zu verwerfen (alte Richter/Kopien liefern es
  nicht). **REINE Anzeige/Urteil — gatet nichts,** `PROVIDER_MIN_MATCH` + 0.80-Andock-Riegel
  (Modul 05) unberührt, Modul 05 nicht angefasst. **Nur Such-Flächen** (Richter ist dort schon
  opt-in), nicht auf Sortier-Flächen. Smoke `smoke_bau04h_safety_verdict.mjs` **22/22**;
  Regress-frei (04d 68, 04g 36, 22 260, 22e 45, 22f 17, 23 58, Standalone 49, Bundle 21).
  Byte-Kopien `such-tool/modules/04`, `sbkim-bundle/modules/04` mitgezogen; dabei den
  **pre-existing Drift** `sbkim-bundle/modules/23_rendezvous(_ui)` (aus A12 #620/#582 nie
  gesynct) byte-1:1 geheilt (Bundle-Drift-Guard wieder grün).
  _Teil 1 + Rollout erledigt am: 2026-07-10 · Teil 2 (B3) erledigt am: 2026-07-11 ·
  Browser-Sichttest (KI-Schlüssel live) wartet auf Klaus · UI-Anzeige des ⚠️-Markers + netzweiter
  Byte-Rollout des 04-Updates = Folge-Schritte_

  > **Architektur-Merke (2026-07-10): Ausschluss-Filter gehört NUR auf Korpus-SUCH-Flächen,
  > nicht auf Thread-SORTIER-Flächen.** Der Filter ENTFERNT Kandidaten — richtig, wenn man
  > „Rezepte durchsucht" (Mixarium/Rezeptbuch/Such-Tools). **Die Pinnwand** ist eine
  > Q&A-Thread-Sortierung: sie zeigt **alle** Antworten einer Frage und ordnet nur um
  > („es wird NICHTS weggefiltert"). Ein Entfern-Filter würde dort die Antwort eines
  > Menschen verstecken — falsch. Verneinung an der Pinnwand erledigt korrekt der
  > **KI-Richter** (er SCORED/ordnet um, entfernt nicht). Darum kein A4-Einbau in die Pinnwand.
- [x] **A5 — Rollout Hybrid-Vorfilter + Multi-Query in weitere Apps** · `Bau` · **erledigt 2026-07-11**
  BM25+Vektor war überall schon verdrahtet (Modul 04 byte-gleich zum Kanon in allen Apps); A5 = **Multi-Query**
  (`expandQuerySimple` über app-eigene Synonym-Karte → `queryLocalMulti`) nachziehen. **Realitäts-Abgleich beim
  Rollout (die Apps sind heterogen, nicht ein Byte-Kopie-Ziel):**
  - **Mixarium** (PR #119, gemergt) + **Rezeptbuch** (PR #307, gemergt): natives Sinn-Suchfeld `semRun`, **Such-Fläche**
    → Multi-Query im Gratis-Vorfilter (Richter-Pfad `queryLocalJudged` bewusst Single-Query, Modul 04 byte-frozen).
  - **family-project** (PR #58, gemergt): (a) **Marktplatz-Suchfeld** `markt.html` ist eine **Sortier-Fläche**
    (ordnet alle Einträge um, versteckt nichts) → Multi-Query als Sortier-Verbesserung (bester Cosinus über die
    Frage-Varianten, kein Filter, Klaus-Entscheid 2026-07-11); (b) **Cross-Knoten-Antwort-Pfad** `15_membran.js`
    (`op:"query"`) → `queryWithInclusion` (A4+A1) nachgezogen (war alte Fassung ohne A4).
  - **BookLedgerPro** (PR #263, gemergt): (a) **eigene** Nutzer-Suche (`src/sbkim/hybridSearch`+`kontoSynonyme`)
    war **schon** hybrid+synonym-fähig → kein Eingriff; (b) Cross-Knoten-Antwort-Pfad `15_membran.js` nachgezogen.
  - **Pinnwand**: eigene Modul-03-Sortier-Suche (kein SbkimMatch) — **bewusst gelassen** (Klaus-Entscheid: läuft gut,
    Umbau würde ein funktionierendes Feature riskieren). Offener Folgepunkt bei Bedarf: siehe A5b.
  Jede App: eigener Headless-Smoke grün (Verdrahtungs-Guard über die ausgelieferte Synonym-Karte). Kern (02/05/05b +
  `PROVIDER_MIN_MATCH` 0.80) unberührt, kein PROTOCOL_VERSION-Bump. _erledigt am: 2026-07-11_
- [x] **Rendezvous-UX: Empfänger-Hinweis bei eingehendem Handshake** · `Bau` · **erledigt 2026-07-11**
  Klaus' Befund (Tomys ↔ family): Tomys zeigte „✓ ANDOCK ETABLIERT", family merkte nichts. Ursache-Analyse:
  (1) der Handshake funktioniert beidseitig auf Protokoll-Ebene (Modul 05 verlangt eine Live-Antwort der
  Gegenseite — sonst „timeout"), aber die Antworter-UI hatte **keine** „jemand hat angedockt"-Anzeige;
  (2) „Wer ist im Raum?" schaut nur ~30 min zurück (`RDV_FRESH_SEC_DEFAULT`), der Handshake nicht → wer nicht
  frisch neu-angemeldet ist, taucht beim anderen nicht auf. Fix: `23_rendezvous_ui.js` lauscht auf
  `sbkim:handshake` mit `direction:"incoming"`+`outcome:"established"` und zeigt einen Hinweis „🤝 X hat sich
  mit dir verbunden" (dedupe, Cap 5, Blasen-Titel auch minimiert). REINE Anzeige — Protokoll/0.80-Riegel
  unberührt, Kern 02/05/05b nicht angefasst. Smoke `smoke_bau23_rendezvous_ui.mjs` **41/41**. Netzweit byte-1:1
  in 7 Träger (Mixarium/Rezeptbuch/family/BLP/Tomys/Kimboard/Kimseek), Kim-recorded-sha + SW-Cache-Bumps
  nachgezogen. **Befund (pre-existing):** `sbkim-bundle/modules/23_rendezvous_ui.js` ist ~332 Zeilen alt
  (fehlt KI-Richter/Sprache) — Stale-Bundle, eigener Resync-Folgepunkt, NICHT hier angefasst. _erledigt am: 2026-07-11_
- [ ] **A5b — (Optional) Multi-Query-Sortierung auch in Pinnwand** · `Bau` nur b. Bedarf · ⏱ ~30 Min
  Pinnwand ist eine Sortier-Fläche wie der family-Marktplatz; dasselbe „bester-Cosinus-über-Varianten"-Muster ließe
  sich übertragen (kein Filter, nichts versteckt). Bewusst zurückgestellt (Klaus 2026-07-11: Pinnwand läuft gut). _erledigt am: _____
- [x] **A6 — Echte Embedding-Vektoren statt Demo-Stub** · `Spec`+`Bau` · ⏱ ~1–2 Sitzungen
  Modul 03: `_demo`-`domainVector` durch echte Vektoren ersetzen → erst dann „verified-match" statt nur „verified-spore".
  **Spec erledigt 2026-07-14** (mit A10 zusammen, Spec-Sitzung Spore v0.2, INTERFACES §0/§2/§4/Modul 02+03,
  PROTOCOL_VERSION 0.1→0.2). **Befund beim Spec:** A6 ist im Code faktisch schon erledigt — es gibt keinen
  `_demo`-domainVector-Pfad mehr in Modul 02/03, und `status.json` führt JEDEN Live-Knoten mit echtem 384-dim-
  e5-Vektor (verified-match). **Code-Schließung 2026-07-14 (Bau Spore v0.2):** `PROTOCOL_VERSION` im Code
  auf `"0.2"` gebumpt (Modul 02 + 03 + byte-Kopien) — die verbindliche Tafel gilt jetzt auch im Code. Kein
  `_demo`-Rückfall (Grep-belegt), domainVector bleibt optional/Soft-Pflicht, muss aber echt sein. Smoke
  `smoke_bau02_spore_v02.mjs` prüft `protocolVersion=0.2` + 0.1↔0.2-Kompat.
  _Spec erledigt am: 2026-07-14 · Code-Schließung erledigt am: 2026-07-14 (Bau Spore v0.2). Live-Sporen tragen
  schon echte Vektoren (verified-match); der v0.2-Stempel wandert bei der Neu-Signier-Welle (A10) in jede spore.json._
- [x] **A7 — Sichttest: App-Integration Hybrid + Multi-Query** · `Test` · **grün 2026-07-17 (Klaus)**
  Sage-Suchfeld am Tablet geprüft: „wie schütze ich mich vor fremden Zugriffen" liefert nach Bedeutung
  sortierte Treffer mit Prozent — die Schutz-Module oben (Membran 88 % · Rate-Limit 84 % · Schlüssel-Safe 84 %),
  dazu **KNOTEN**-Treffer (Mein-Tresor 82 % · Jasons-Tresor 81 % · BookLedgerPro 81 % · Kimboard/Kim-Bell/Kimseek).
  App-Hybrid+Multi-Query läuft. _getestet am: 2026-07-17 (Klaus, Live-Screenshots)._
- [x] **A8 — Sichttest: „Wählen"-Umschalter verbunden ↔ verwandt** · `Test` · **abgehakt 2026-07-17 (Klaus' Zuruf)**
  Das Widget läuft live, der Umschalter „🧬 verwandt (genau)" + „nur verwandte" sind sichtbar vorhanden.
  Klaus hat auf seinen Zuruf abgehakt; der Umsortier-Effekt ist headless bewiesen (`smoke_bau22e_waehlen.mjs` 45/45).
  _Hinweis: der Umschalt-Effekt wurde im Live-Bild nicht eigens demonstriert (Häkchen stand aus)._ _2026-07-17._
- [x] **A9 — Sichttest: „verwandt · KI" mit echtem Schlüssel** · `Test` · **abgehakt 2026-07-17 (Klaus' Zuruf)**
  KI-Richter-Feld (Anbieter + Schlüssel) im Widget vorhanden. Klaus hat auf seinen Zuruf abgehakt; ein echter
  KI-Schlüssel-Lauf ist optional (BYOK, kostenpflichtig). _2026-07-17._
- [ ] **A19 — Befunde aus Klaus' Sichttest 2026-07-17 (Fremdnutzer-Brille)** · `Bau` klein · ⏱ ~30–45 Min · **neu 2026-07-17**
  Zwei UX-Befunde am Such-Widget (Modul 22), beide Marktplatz-/Fremdnutzer-relevant:
  1. **„🖨 Block kopieren" gibt keine sichtbare Rückmeldung** — kopiert in die Zwischenablage, aber der Nutzer
     sieht nichts (Klaus: „ein Link ohne sichtbares Ergebnis"). → kurze Bestätigung einbauen („✓ kopiert").
  2. **Treffer erst nach Netz-Anmeldung sichtbar** — Klaus: „erst nachdem ich alle im Netz angemeldet habe,
     konnte ich was sehen". Prüfen, ob **App-Treffer** (lokaler Korpus) auch OHNE Netz-Anmeldung erscheinen
     (Fremdnutzer ohne Verbindung muss die App-Suche voll nutzen können — fail-soft). Knoten-Treffer dürfen
     Verbindung brauchen.
  Beides berührt Modul 22 + byte-Kopien (such-tool/pinnwand, Drift-Guard) → eigener abgegrenzter Bau. _offen._
- [x] **A10 — „Schnipsel-Mittel"** · `Spec`+`Bau` · ⏱ ~2 Sitzungen
  Einziges Verfahren mit messbarer Verwandt-Trennung, aber Datenvertrag-Eingriff (Schnipsel-Vektoren in die
  Spore) + **alle Knoten neu signieren**. **Klaus-Entscheid 2026-07-12: fest mit A6 in EINE Re-Sign-Welle** (statt
  zweimal signieren). **Spec erledigt 2026-07-14** (Spec-Sitzung Spore v0.2): neues OPTIONALES Spore-Feld
  `snippetVectors` (Array `{vec:number[384], text?}`), Obergrenze `SPORE_SNIPPET_MAX`=20, Granularität = SATZ
  (Klaus 2026-07-14). **Bau erledigt 2026-07-14 (Bau Spore v0.2):** Modul 03 `embedSnippets` (Satz-Zerlegung,
  max 20, L2, fail-soft) + Test-Brücken `_splitIntoSentences`/`_prepareSnippetTexts`; Modul 02 `generateOwnSpore`
  nimmt `snippetVectors` (kanonisch signiert+verifiziert, harte Kürzung 20, vec-Länge≠384 → `InvalidSporeMetaError`),
  `regenerateOwnSpore` trägt sie beim Neu-Signieren mit. Byte-Kopien (sbkim-bundle 02+03, such-tool/pinnwand 03)
  nachgezogen, Drift-Guards grün. Smokes `smoke_bau03_snippets.mjs` (32/32) + `smoke_bau02_spore_v02.mjs` (17/17).
  Übergang 0.1→0.2 SANFT (gleiche Hauptversion → auto-kompatibel, im Smoke belegt). **Welle-Werkzeug:**
  `tools/resign_spore_v02.mjs` (ENV-Schlüssel `SBKIM_NODE_KEY`, self-verify ✔) + Browser-Hälfte
  `tools/embed_helper.html` (Abschnitt A10 → `snippets.json`); Smoke `smoke_resign_spore_v02.mjs` (10/10).
  **Offen (Operator-Schritt Klaus, wie Browser-Sichttest):** die eigentliche Neu-Signatur der LIVE-Sporen läuft
  pro Knoten mit dem privaten Schlüssel (nur bei Klaus) — Knopf pro App bzw. Skript. Bis dahin tragen die Live-
  Sporen noch 0.1 (handshake-kompatibel dank sanftem Übergang).
  _Spec + Code + Werkzeug erledigt am: 2026-07-14 (Bau Spore v0.2). Netzweite Neu-Signatur der Live-Sporen = Klaus' Lauf._
  **Rollout-Teil 2026-07-14 (Welle):** Werkzeug end-to-end verifiziert (`smoke_resign_spore_v02.mjs` 10/10,
  braucht `npm install --no-save fake-indexeddb`). Sages **App-Knopf** „✍ Semantik → Spore neu signieren"
  (`index.html` `sageReSignWithDescription`) bettet die Beschreibung jetzt zusätzlich **satz-weise** ein
  (`embedSnippets`) und reicht `snippetVectors` an `generateOwnSpore` → Ein-Klick-Download = vollständige
  v0.2-Spore MIT Schnipseln, fail-soft. **Live-Signatur 2026-07-14 (#651):** Sages eigene Spore ist als
  **erste v0.2-Spore im Netz** neu signiert (Klaus' Browser, wiederhergestellte Identität `nysOZE3V…`
  unverändert, 11 Satz-Schnipsel, echter e5-`domainVector` L2=1, reziprok verifiziert; status.json +
  spore.json auf main). **SB-KIMTool-Point (2. Hub) als ZWEITER v0.2-Knoten fertig 2026-07-14:** Kanon-Identität
  `CyunQNDR…` per „Kanon-Schlüssel importieren" (node_key → Browser-`importBackup`, kein Netz-Churn) zurückgeholt +
  verbunden (Mycel-Karte bestätigt); Spore v0.2 mit voller Domänen-Beschreibung, 3 Satz-Schnipsel, `node --test` 120/120.
  Dabei **ehrliche Match-Neueinstufung**: die reiche Beschreibung rückt den Werkzeug-Hub zur Infrastruktur (Sage 0.862 /
  Jasons-/Mein-Tresor 0.862 / family 0.849 ↑), die Inhalts-Knoten trennen sich ab (Rezeptbuch 0.796 · Mixarium 0.767
  < 0.80 → verified-spore) — das Protokoll unterscheidet nach Bedeutung (Werkzeug-Hub vs. Koch-/Getränke-Knoten). Toolpoints
  SIGNAL seq 34 bittet Rezeptbuch/Mixarium um reziproke Neu-Einstufung. **Offen bleibt** der **Endknoten-Rollout**
  (Mixarium/Rezeptbuch/BLP) + der Knopf je Repo — je Folge-Sitzung/Repo, mit Klaus' Schlüssel.

- [ ] **A11 — Such-Ergebnis → Frage → optional Andocken (Marktplatz-Kopplung Modul 22 ↔ 23)** · `Spec`+`Bau` · ⏱ ~1–2 Sitzungen
  **Klaus' Befund 2026-07-11:** ein fremder Nutzer dockt nicht ungefragt an — er **sucht/fragt zuerst**. Heute sind
  Such-Widget (Modul 22) und Andocken (Modul 23) getrennte Werkzeuge; der Handshake ist ein separater Klick.
  **Vorschlag:** Klick auf ein **positives Suchergebnis** (Marktplatz / semantische PWA-Suche, z.B. family-project.de)
  löst zuerst eine **Frage** an den Knoten aus (Antwort holen) und bietet dann **„🤝 mit diesem Knoten verbinden"** an
  (Andock bleibt nutzer-bestätigt). Natürlicher Erst-Kontakt-Fluss statt separatem Andock-Knopf. **Verfassungstreu:**
  Empfangsmodus + 0.80-Riegel unberührt, Andock bleibt bewusst/konsensuell — nur der Auslöse-Fluss wird
  nutzerfreundlicher.
  **Teil A (Auto-Knoten-Auswahl) gebaut 2026-07-11 (Bau 23.C, PR #626).** Klaus' Zusatz-Befund: bei vielen Knoten
  kann der Nutzer nicht wissen, wen er fragt. Neu Modul 23 `rankCardsByQuery(cards, queryVec)` (Passung der Frage
  zu jedem Knoten-`domainVector`, Modul 04 `relatedness` zentriert) + UI-Primärknopf „🔎 Antwort holen" unter dem
  Frage-Feld: bettet die Frage ein (Modul 03), liest den Raum, sortiert die Karten nach Passung (🔎-Badge), fragt
  den bestpassenden Knoten AUTOMATISCH, Nächstbester als Nachfass (sonst A12-Briefkasten). Reine Anzeige/Auswahl,
  0.80-Riegel + Kern 02/05/05b unberührt. Smokes `smoke_bau23c_rank_by_query` 15/15, `smoke_bau23_rendezvous_ui`
  65/65, Bundle-Drift-Guard 21/21. **Offen (Teil A):** Browser-Sichttest (Klaus) + netzweiter Byte-Rollout Modul 23.
  **Offen (Teil B — Suchergebnis→Andocken-Kopplung Modul 22↔23):** der ursprüngliche „Klick auf Suchergebnis →
  Frage → 🤝 verbinden"-Fluss im Such-Widget (family-projekt.de-Marktplatz) ist noch nicht gebaut. _Teil A erledigt am: 2026-07-11_

- [ ] **A12 — „Antworten: an/aus"-Modell überdenken (Erreichbarkeit · Reihenfolge · Auto-Toggle)** · `Spec` · ⏱ ~1 Sitzung
  **Klaus' Befund 2026-07-11 (echte Grenze des server-losen Designs):** heute ist Antworten **opt-in/manuell**
  (Default aus, `enableAnswering`/`disableAnswering`, Modul 23.B), und der Antworter-Tab muss **vorn+wach** sein
  (Meilenstein-Rest-Grenze). Offene Fragen: (1) **Erreichbarkeit** — mit „aus" gehen eingehende Fragen verloren; soll
  ein Knoten „immer erreichbar" sein oder der Toggle **automatisch** schalten? (2) **Reihenfolge/Flut** — ein Browser
  ist kein Server; bei vielen gleichzeitigen Fragen: Warteschlange/Priorisierung? (heute Rate-Limit ~6/min, kein
  persistenter Queue, single-threaded). (3) **Eigene Frage vs. fremde Fragen** — asymmetrisch, Priorität? Berührt
  Schutz-Modul 11 (Rate-Limit) + Meilenstein-Doku. **Erst Spec/Konzept, dann Bau.** _erledigt am: _____
  - [x] **A12 Phase 1 — Briefkasten-TRANSPORT (Modul 23)** · **erledigt 2026-07-11** (Klaus-Entscheid „Briefkasten-Prinzip"):
    Fragen/Antworten überleben jetzt eine Zeitverzögerung, ohne Dauer-Ticker (Empfangsmodus-treu).
    (1) **Antworter-Lookback:** `enableAnswering` lauscht `since: now − RDV_ANSWER_LOOKBACK_SEC` (30 min) statt nur
    „ab jetzt" → holt liegengebliebene Fragen beim Einschalten nach (qidSeen-Dedupe + Rate-Limit schützen).
    (2) **Frager-Nachlese:** neue Fläche `fetchAnswers(qids, {lookbackSec, waitMs})` liest späte Antworten über
    dasselbe Fenster nach; `askNode`-Timeout gibt jetzt `{pending:true, qid}` zurück (Frage bleibt „offen").
    DOM-frei, fail-soft, `PROVIDER_MIN_MATCH`/Kern 02/05/05b unberührt. Smoke `smoke_bau23b_query.mjs` **28/28**
    (Probe 13: ganzer Ablauf ask→offline→Timeout→Antworter-online-Lookback→antwortet→fetchAnswers holt nach).
    **Reale Grenze: Aufbewahrungsdauer des Relais** (relay.family-projekt.de) — begrenzt, wie lange eine Frage liegen darf.
  - [x] **A12 Phase 2 — Briefkasten-UI (Kanon)** · **erledigt 2026-07-11** (Lehre aus dem git-Briefkasten eingebaut:
    ein Briefkasten scheitert am LESEN, nicht am Schreiben → Lesen sichtbar + automatisch machen). `23_rendezvous_ui.js`:
    offene Fragen in `localStorage` (dbSuffix-Suffix, kein Fremd-PII) gemerkt; **sichtbarer 📬-Zähler an der Blase**
    (ungelesene Post meldet sich von selbst); **Auto-Nachlese beim Öffnen** (`show()` + `mount()` rufen `fetchAnswers`,
    kein Knopf-Erinnern); Knopf „📬 Antworten abholen (N)"; sichtbare Quittung offen ⏳ / beantwortet ✓. REINE
    Anzeige, fail-soft (ohne Modul-23-`fetchAnswers` → no-op). Smoke `smoke_bau23_rendezvous_ui.mjs` **50/50**
    (9 neue Briefkasten-Proben). _erledigt am: 2026-07-11_
  - [x] **A12 Phase 2b — netzweiter Byte-Rollout beider Module** · **erledigt 2026-07-11**
  - [x] **A12 Phase 2c — Briefkasten-Lebenszyklus (Überladungs-Schutz)** · **erledigt 2026-07-11** (Klaus' Befund
    „der Briefkasten wird sonst überladen"): LOKALE Müllabfuhr in `23_rendezvous_ui.js` — beantwortet+gesehen wird
    automatisch entfernt (erledigt → weg), offene Fragen laufen nach TTL (45 min, > Relais-Lookback) als „abgelaufen"
    aus (zählen nicht im 📬-Zähler), Knopf **🔄 offene nochmal fragen** (stellt gespeicherte Suche NEU aufs Relais —
    Marktplatz-Muster „Suche wieder aktivieren"), **🗑 leeren**, Obergrenze `RDV_MAILBOX_MAX` (Default 20, via
    `init({mailboxMax})` per App/Browser einstellbar). **Ehrliche Grenze:** RELAIS-Aufbewahrung regelt das Relais
    selbst — der Client kann Relais-Ereignisse nicht zuverlässig löschen; hier nur der lokale Briefkasten. Smoke
    `smoke_bau23_rendezvous_ui.mjs` **58/58** (8 neue Lebenszyklus-Proben). Byte-Rollout von `23_rendezvous_ui.js`
    folgt (2d). _erledigt am: 2026-07-11_
  - [x] **A12 Phase 2d — Rollout Briefkasten-Lebenszyklus** · **erledigt 2026-07-11** · `23_rendezvous_ui.js` byte-1:1 in die 7 Träger +
    Kim-recorded-sha + SW-Bumps (7 Träger gemergt). _erledigt am: 2026-07-11_ · `Bau` (Folge): `23_rendezvous.js` (Phase 1) **und**
    `23_rendezvous_ui.js` (Phase 2) byte-1:1 in alle Träger (Mixarium/Rezeptbuch/family/BLP/Tomys/Kimboard/Kimseek),
    Kim-recorded-sha (beide Dateien) + SW-Cache-Bumps. Optional Relais-Retention prüfen/erhöhen. _erledigt am: _____

- [x] **A13 — Identitäts-Isolierung gehärtet (Doppel-Laden + globales App-Suffix)** · `Bau` · **erledigt 2026-07-11**
  **Klaus' Live-Sichttest 2026-07-11:** mehrere PWAs auf der geteilten github.io-Origin teilten sich EINE Identität
  über den geteilten Topf `sbkim` (SB-KIMTool-Point + family-project zeigten dieselbe nodeId, last-writer-wins).
  Zwei Wurzeln: (A) Doppel-Laden des Storage-Moduls (z.B. `assets/sbkim-siegel.js` zieht `web/tools/*` nach) setzte
  den State zurück → Suffix-Verlust; (B) öffnete ein Modul Storage VOR `init({dbSuffix})`, wurde der Default `sbkim`
  geöffnet. **Fix (Modul 01, PR #595):** Idempotenz-Guard `if (global.SbkimStorage) return;` + Default-DB-Name aus
  `window.SBKIM_DB_SUFFIX` (App setzt es früh) → jeder Zugriff landet reihenfolge-unabhängig in `sbkim_<suffix>`.
  Netzweit ausgerollt (11/11 Apps: Modul 01 = Kanon + `window.SBKIM_DB_SUFFIX` vor dem ersten SBKIM-Script; Mycel-Karte
  ist reiner Beobachter → kein Fix nötig). Smoke `smoke_pflege_01_shared_topf_isolation.mjs` 7/7, regress-frei.
  **✅ Browser-Reihen-Test GRÜN (Klaus 2026-07-11):** Browser komplett geleert, alle Apps deinstalliert außer
  Mycel-Karte, dann jede App einzeln geöffnet → Hard-Reload → „🌐 Mit dem Netz verbinden". **11/11 Apps zeigten
  je eine EIGENE, verschiedene nodeId** — keine Kollision. Belege (nodeId-Anfang): Mixarium `1zh_Xkqfq` ·
  Rezeptbuch `26HBrV80y` · BookLedgerPro `itzsPCHy2` · family-project `c-lFJKXPJ` · SB-KIMTool-Point `VXbd6kIqFi` ·
  Jasons-Tresor `FBTYVnW3i` · Mein-Tresor `PwZkKkaUm` · Kimseek `29NnYnLK` · Kimboard `9Xlas1Gj9` ·
  Tomys-Hub `s2-oNG-Eke` · Kim-Bell `fRx3M_xo7`. Das frühere Kollisions-Paar (SB-KIMTool-Point ↔ family-project)
  ist sauber getrennt. Isolierungs-Fix netzweit im echten Browser bewiesen — A13 vollständig geschlossen.

- [ ] **A14 — ensureStore-/ensureSlotStores-Race (Modul 05/01) beheben** · `Bau` · ⏱ ~1 Sitzung · **Befund 2026-07-11**
  Vorbestehender, sporadischer Fehler in Tomys-Hubs Verbund-E2E: `NotFoundError: One of the specified object stores was
  not found` (`01_storage.js` Transaktion via `05_anastomose.js` `ensureSlotStores`). **Nicht** durch A13 verursacht
  (auf `main` ohne den Fix identisch 15/16 rot) — eine flaky Race in der ensureStore-Versions-Bump-Achse: ein Slot-Store
  wird in einer Transaktion angefragt, bevor der Versions-Bump ihn angelegt hat. Kann im Feld gelegentlich einen
  Andock-/Antwort-Pfad stören. Getrennt untersuchen (Modul 05 ensureSlotStores + Modul 01 ensureStore-Sequenz). _erledigt am: _____

- [ ] **A15 — Zwei-Stufen-Verbinden: Stöbern (anonym) ↔ Voll mitmachen (Identität)** · `Spec`+`Bau` · ⏱ ~1–2 Sitzungen · **Idee Klaus 2026-07-11**
  Für Marktplatz-Nutzer (z.B. family-project.de) die Einstiegshürde senken: **(1) 🔎 Nur stöbern/suchen** — kein
  Identitäts-Aufbau, kein ~30-MB-Modell-Download, man findet andere, wird aber selbst NICHT gefunden (nur Beobachter).
  **(2) 🌐 Voll mitmachen** — eigene Identität, auffindbar, andockbar (braucht einmal Modell + Identität).
  „Bessere Auffindbarkeit garantiert durch Modul-Design" (A13) ↔ „einfaches Verbinden, schlechtere Auffindbarkeit".
  Gehört mit A11 (Suchergebnis→Andocken) zusammen. Verfassungstreu (Empfangsmodus). _erledigt am: _____

- [x] **A16 — Lernender Sortierer (selbst-verbessernd, on-device)** · `Bau` · **erledigt 2026-07-12**
  Klaus' Wunsch (Geist der BLP-„selbstlernenden Kalkulation", aber auf die SUCHE): das mitgelieferte Sortier-
  programm soll mit jedem Ja/Nein besser werden. Heute ist der End-Sortierer statisch (roher Cosinus/RRF, e5-small
  quetscht die Werte → schwache Rangfolge). **Bau:** ein **display-only, fail-soft Re-Ranker in Modul 22** (NEBEN
  `rankView`, NICHT in Modul 04 — der Protokoll-Kern bleibt zustandslos/Drift-Guard-sicher). Lern-Signal (positiv):
  die 📌-Merkliste (`sbkim_search_widget_merkliste`); gelernte Gewichte on-device in neuem localStorage-Key
  `sbkim_search_widget_reranker` (pro App/Origin). Re-Ranker gibt den `queryCorpus`-Kandidaten einen kleinen Boost
  nach gelernten Mustern — **Nudge auf die bestehende Reihenfolge, verändert NIE die Mitgliedschaft, kreuzt NIE den
  0.80-Riegel.** Kalt-Start = Identität (wie heute). Ehrliche Grenzen: lernt pro Gerät (nicht netzweit geteilt),
  Kalt-Start = heute, positives Signal zuerst (negatives „nicht passend" optional Phase B.2). Byte-Kopie
  `such-tool/modules/22` + Drift-Guard. _erledigt am: 2026-07-12._
  **Gebaut:** neue LS-Key `sbkim_search_widget_reranker`; reine Funktionen `computeRerankerModel(merkliste)`
  (Token/Source→Gewicht) + `learnedRerank(treffer,{model?})` (stabile, BEGRENZTE Umsortierung, max. 3 Plätze
  Aufstieg pro Volltreffer); `retrainReranker()` an `addMerk`/`removeMerk`/`clearMerkliste` gehängt; angewandt in
  `displayTreffer` NUR auf die grobe „verbunden"-Sicht (verwandt/KI unberührt). Fail-soft: leeres/kaputtes Modell →
  Identität. Surface `+learnedRerank/computeRerankerModel/trainReranker/getRerankerModel`, `_meta.rerankerReady/
  rerankerTrained/rerankerTokens`. Smoke `smoke_bau22g_lern_reranker.mjs` **33/33**; bau22 260, bau22e 45, bau22f 17,
  Drift-Guard `such-tool` byte-1:1 49/49. Modul 04/05 + 0.80-Riegel unberührt, kein PROTOCOL_VERSION-Bump, kein PII.
  **Phase B nachgezogen 2026-07-12 (Klaus wählte: nach dem Seiten-Öffnen, drei Stufen):** Treffer-
  Bewertung 👍 sehr gut (+2) · 🙂 okay (+1) · 👎 nein (−2) erscheint an GENAU dem Treffer, dessen
  Seite geöffnet wurde (Detail-Karte + Trefferzeile), sichtbar beim Zurückkommen (visibilitychange/
  focus). Neue LS-Keys `sbkim_search_widget_feedback` + `_pending`; `computeRerankerModel(merkliste,
  feedback)` verrechnet gestufte + **negative** Gewichte; Boost jetzt vorzeichen-tragend ∈[−1,1]
  (nein → Treffer sinkt, begrenzt ≤3). Surface `+recordFeedback/getFeedback/feedbackWeight`,
  `_meta.feedbackCount/pendingFeedbackCount`. Smoke 47/47. Reine Anzeige/Lern-Eingabe, kein PII.

- [x] **A17 — Last-Schoner: Embedding im Web-Worker + „Antwort holen"-Drosselung** · `Bau` · **erledigt 2026-07-12**
  Klaus' Tablet fror mehrfach ein / stürzte ab bei wiederholten Cross-Knoten-Suchen mit zwei Modellen. Ursache: das
  e5-Modell rechnet bei JEDER Suche **im Anzeige-Faden** → die Seite steht, während gerechnet wird. **Bau (die
  „vernünftige" Variante, kein Liliput — Klaus 2026-07-12):** die Modell-Rechnung wandert in einen **Inline-Blob-
  Web-Worker** (Modul 03) → der Anzeige-Faden bleibt frei. Streng fail-soft: kein Worker (Node/alter Browser/CSP) →
  transparenter Rückfall auf den Haupt-Faden = byte-gleiche Vektoren; auch Worker-Fehler mitten im Betrieb fällt
  sauber zurück; `init({worker:false})` schaltet ab. Dazu die kleine **Drosselung** in Modul 23 UI („Antwort holen"
  entprellt: kein Doppel-Start, 4 s Abkühlung für identische Frage) als Ergänzung. Kern-Module 02/05/05b unberührt,
  0.80-Riegel + kein PROTOCOL_VERSION-Bump. Smokes: `smoke_bau03_worker.mjs` **15/15** (Worker-Nutzung, Parität
  Worker==Haupt-Faden, Fail-soft, Fehler-Recovery, Opt-out) + `smoke_bau23_rendezvous_ui.mjs` (Doppelklick). Byte-1:1
  in sbkim-bundle/such-tool/pinnwand (Drift-Guards grün). **Netzweiter Byte-Rollout in die Apps = Folge-Schritt.**
  **Selbst-Hosten des Modells (Flaschenhals/Offline, `/models/…`-Pfad existiert schon) ist ein SEPARATER, optionaler
  Hebel** — löst NICHT das Einfrieren; auf Klaus' Zuruf. **Browser-Sichttest (kein Einfrieren mehr) wartet auf Klaus.**

- [ ] **A18 — Kanonischen Siegel-Andock-Wizard (`assets/siegel-inhalt.js`) netzweit ausrollen** · `Bau` · ⏱ ~1 Sitzung/Repo · **neu 2026-07-15**
  Neuer Baustein (2026-07-15): EINE 1:1-kopierbare Datei `Sage-Protokol/assets/siegel-inhalt.js` trägt den **vollen
  Andock-Wizard** im Siegel-Modal — 5 Bausteine (Identität erzeugen · Spore signieren+⬇ · verschl. Backup ·
  Wiederherstellen · **Identitäts-Wechsler mit aktiver-nodeId-Anzeige**) als natives `<dialog>` (Top-Layer, liegt
  VOR dem Siegel; behebt „Fenster hinter dem Siegel"). Extrahiert aus Sages Inline-Wizard + Kim-Bell-Fassung, um den
  Wechsler + die nodeId-Anzeige erweitert. Nur das `WIZ`-Config-Objekt variiert pro App; Code byte-gleich (Drift-Guard).
  **Erledigt:** Kanon-Datei in Sage (PR #655/#656); **Mein-Mixarium** (PR #138 ff.); **Kim-Bell** auf Kanon
  gebracht (PR #25, 2026-07-16 — es fehlten Baustein 5 + nodeId-Anzeige); **SB-KIMTool-Point** bereits aktuell
  **und sogar voraus** — sein `assets/sbkim-siegel.js` (voll re-gesynct 2026-07-14, PR #104) hat alle 5 Bausteine
  UND einen **besseren** Wechsler: er löst je Slot die nodeId auf (`Slot · nodeId` im Dropdown) + volle aktive
  nodeId. **Kandidat-Rückportierung in den Kanon** (Point-Muster: per-Slot-nodeId statt nur aktiver) — Folge-Polish.
  **Erledigt 2026-07-16 (diese Sitzung):** **Tomys-Hub** (PR #111) + **Mein-Rezeptbuch** (PR #330) auf den Kanon
  gebracht — je alte Selbst-Injektion aus `sbkim-init.js` entfernt, `sbkim/siegel-inhalt.js` byte-1:1 (nur `WIZ`),
  `__…ErzeugeSpore` erhalten (Rendezvous + bei Rezeptbuch die Inhalts-Vektor-Logik), `sicherheit.html` ergänzt/erhalten,
  SW-Bump (Tomys v22→v23, Rezeptbuch mrz-v50→v51). Damit sind **alle 4 „klassischen" Endknoten** (Kim-Bell · Mixarium ·
  Tomys · Rezeptbuch = geteiltes Modul-16-Siegel-Modal + externe `sbkim/*.js`) auf dem einheitlichen Kanon.
  **Erledigt 2026-07-16 (Folge, Klaus-Sichttest der 4 Kanon-Endknoten GRÜN):**
  - **per-Slot-nodeId in den Kanon zurückportiert** (Point-Muster) — `refreshWizardIdentities` löst je Slot die nodeId
    read-only via idempotentem `getOrCreateIdentity` auf (`Fach · nodeId`, volle nodeId im Hover). Kanon PR #660,
    byte-1:1 in die 4 Endknoten nachgezogen (Kim-Bell #26 · Mixarium #144 · Tomys #112 · Rezeptbuch #331).
  - **family-project** (PR #87): hatte KEINEN Siegel-Wizard (Identität lief nur übers Rendezvous-Panel) → Kanon-Wizard
    **additiv** ergänzt (nichts entfernt; `__fpErzeugeSpore` + Rendezvous unangetastet), `sicherheit.html` + SW-Bump.
  **NETZWEIT ABGESCHLOSSEN — Siegel-Wizard-Stand (Befund 2026-07-16):**
  - **Geteilter Kanon (`siegel-inhalt.js`, byte-1:1):** Sage · Kim-Bell · Mixarium · Rezeptbuch · Tomys · family-project.
  - **Eigene, spec-konforme Umsetzung (NICHT anfassen — vollständig + getestet):**
    · **SB-KIMTool-Point** — `assets/sbkim-siegel.js`, voraus (per-Slot-nodeId; Quelle der Rückportierung).
    · **Kimboard · Kimseek** — eigene 352-Zeilen-Fassung mit allen 5 Bausteinen + nodeId-Anzeige + `sicherheit.html`.
    · **Mein-Tresor · Jasons-Tresor** — bauten ihr Siegel selbst nach Sage-Vorgabe: Siegel-Dialog im `index.html`
      (Wappen · Pflicht-Module · ASPEKTE · 🔑/🛡-Links) + **voller Andock-Wizard auf eigener Seite `werkzeuge/andock.html`**
      (Identität/Spore/Backup/Wiederherstellen/Wechsler mit nodeId, je 327 Z., `npm test` 53/53). Kanon-Einbau wäre reine
      Dopplung an einer sicherheits-sensiblen Ein-Datei-App → **bewusst gelassen** (Klaus-Prüfung 2026-07-16).
  - **Bewusst gelassen:** **BookLedgerPro** (SBKIM in 10 000+-Zeilen standalone `sbkim/mycelknoten.html`, eigene
    Andock-UI; Kanon = tiefer Umbau ohne Nutzen).
  - **Einzig offen:** **Sage-Page selbst** auf die Datei umstellen (Inline-Wizard ersetzen) — Hub-Risiko, nur mit
    Klaus' Sage-Browser-Test.
  Skills: `status-leiste-siegel` + `saubere-netz-anmeldung`. _erledigt: 2026-07-16 (Kim-Bell · Point · Tomys · Rezeptbuch · Mixarium · family-project · per-Slot-nodeId · Tresor-Befund)_

## B) Verschlüsselung

- [ ] **B1 — Modul 20 Schlüssel-Safe: Sichttest der Modal-UI** · `Test` · ⏱ ~20–30 Min
  Real gebaut (AES-GCM-256, PBKDF2 600k, Shamir 2/3, headless 19/19). Einrichten/entsperren/Recovery prüfen. _getestet am: _____
- [ ] **B2 — Modul 20 Feinpunkte** · `Bau` `Entscheid` · ⏱ ~1 Sitzung
  Ed25519 „extractable"-Abwägung + N/k-Standardwerte im UI. _erledigt am: _____
- [ ] **B3 — Modul 20 netzweite Verteilung (BLP zuerst)** · `Bau` (braucht B1) · ⏱ ~1–2 Sitzungen · _erledigt am: _____
- [ ] **B4 — Widget-Tresor „Increment 2 B" (sicherheits-sensibel, eigene Sitzung)** · `Bau` · ⏱ ~1–2 Sitzungen
  Eigener Tresor (Shamir 2/3 + Passwort + 🔐), automatischer KI-Aufruf mit Websuche, App-Schlüssel-Durchreichung.
  Heute KI-Schlüssel bewusst nur im RAM. _erledigt am: _____
- [x] **B5 — E2E Grad B: Pseudonymisierung** · `Bau` (kein Protokoll-Bump) · **erledigt 2026-07-16**
  Platzhalter wie `[[KUNDE_1]]` statt Klartext — sofort möglich, guter Zwischenschritt.
  **Gebaut als Modul 25 `SbkimPseudonym`** (`src/modules/25_pseudonym.js`, Karte
  `docs/components/25_pseudonym.md`): build-freier Text-/Objekt-Transform, `protocolVersion`
  bleibt 0.1, KEIN Spore-Feld, KEIN Draht-Vertrag (INTERFACES unberührt). `pseudonymize`/
  `pseudonymizeObject` ersetzen explizite Werte (Namen) + eingebaut EMAIL/IBAN (TEL opt-in) +
  `customPatterns` durch stabile Token; `rehydrate`/`rehydrateObject` kehren um;
  `serializeVault`/`parseVault` für den separaten Anker-Tresor-Handover; Anker-Tresor at-rest
  optional über Modul 20 `putSecret` (entkoppelt). Fail-soft (kein Throw außer
  `InvalidPseudonymArgError`). Headless-Smoke `tests/smoke_bau25_pseudonym.mjs` **36/36 grün**;
  Panel 25 in `manual_check.html`; E2E-Spec §1.1 mit Umsetzungs-Notiz; status.json + Pie + CLAUDE.md
  nachgezogen. Ehrliche Grenze bleibt: Metadaten/Beträge leaken weiter → Grad C = B6.
  **Browser-Sichttest (Panel 25) wartet auf Klaus.** _erledigt am: 2026-07-16_
- [ ] **B6 — E2E Grad C: versiegelter Umschlag** · `Entscheid` `Bau` später · ⏱ ~2–3 Sitzungen
  Sealed box (X25519 → ECDH → HKDF → AES-GCM-256). Braucht Protokoll-Sprung 0.1 → 0.2, eigene Spec-Sitzung,
  laufenden BLP-Knoten. _erledigt am: _____
- [ ] **B7 — Pinnwand-Verschlüsselung: Richtungsentscheid** · `Entscheid` vor Bau · ⏱ ~1 Sitzung
  Passwort-Weg gebaut. Offen: Public-Key/ECDH + **MITM beim Erstkontakt**. Erst Klaus' Wegwahl, dann bauen. _entschieden am: _____

---

## Empfohlene Reihenfolge

1. **A1 (+ A2)** — Frage→Antwort verdrahten + Cross-Knoten-Test. Größter Hebel. ⏱ ~3–4 Sitzungen
2. **A7 · A8 · A9** — die drei ausstehenden Sichttests. Nur Tablet. ⏱ ~1–1,5 Std
3. **B1 (+ B2, B3)** — Safe-Sichttest, Feinpunkte, dann Verteilung. ⏱ ~30 Min Test, dann ~2–3 Sitzungen
4. **B4** — Widget-Tresor als eigene, sicherheits-sensible Sitzung. ⏱ ~1–2 Sitzungen
5. **B7 + B5** — Pinnwand-Weg entscheiden; parallel Grad B (Pseudonymisierung). ⏱ ~1 Sitzung Entscheid + ~1 Sitzung Bau

**Grobe Gesamtsumme:** Kernpunkte ≈ **13–18 Bau-Durchgänge** (ohne A10 & B6) + **~2–3 Std** Tablet-Sichttests.
Schnelle Haken ohne Bau: **A7–A9, B1**.

---

## Pflege dieser Liste

- Punkt erledigt → `[ ]`→`[x]`, Datum in die _kursive_ Stelle.
- Neue Erkenntnis/neuer Punkt → hier ergänzen (mit Quelle), nicht in einer anderen Doku verstecken.
- Bei Abschluss eines Punktes zusätzlich in `docs/PULS.md` vermerken (Übergabe-Ritual).
- Die interaktive Fassung `docs/checkliste_semantik_krypto.html` ist Klaus' Ansicht — inhaltlich identisch halten.
