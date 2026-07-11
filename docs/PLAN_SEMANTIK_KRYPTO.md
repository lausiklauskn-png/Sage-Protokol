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
- [~] **A4 — Constraint-/Ausschluss-Filter + KI-Richter B3** · `Bau` · ⏱ ~1 Sitzung
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
  **Offen (Teil 2):** KI-Richter B3 — Unsicheres markieren/herabstufen, Sicheres hochstufen
  (Hund-Katze-/Permethrin-Fall).
  _Teil 1 + Rollout erledigt am: 2026-07-10 · Browser-Sichttest wartet auf Klaus · Teil 2 offen_

  > **Architektur-Merke (2026-07-10): Ausschluss-Filter gehört NUR auf Korpus-SUCH-Flächen,
  > nicht auf Thread-SORTIER-Flächen.** Der Filter ENTFERNT Kandidaten — richtig, wenn man
  > „Rezepte durchsucht" (Mixarium/Rezeptbuch/Such-Tools). **Die Pinnwand** ist eine
  > Q&A-Thread-Sortierung: sie zeigt **alle** Antworten einer Frage und ordnet nur um
  > („es wird NICHTS weggefiltert"). Ein Entfern-Filter würde dort die Antwort eines
  > Menschen verstecken — falsch. Verneinung an der Pinnwand erledigt korrekt der
  > **KI-Richter** (er SCORED/ordnet um, entfernt nicht). Darum kein A4-Einbau in die Pinnwand.
- [ ] **A5 — Rollout Hybrid-Vorfilter + Multi-Query in weitere Apps** · `Bau` · ⏱ ~1 Sitzung
  BM25+Vektor + Multi-Query byte-gleich in: Pinnwand · Mixarium · Rezeptbuch · family-project · BookLedgerPro. _erledigt am: _____
- [ ] **A6 — Echte Embedding-Vektoren statt Demo-Stub** · `Bau` · ⏱ ~1–2 Sitzungen
  Modul 03: `_demo`-`domainVector` durch echte Vektoren ersetzen → erst dann „verified-match" statt nur „verified-spore". _erledigt am: _____
- [ ] **A7 — Sichttest: App-Integration Hybrid + Multi-Query** · `Test` · ⏱ ~15–30 Min
  Sage-Suchfeld am Tablet prüfen (headless grün). _getestet am: _____
- [ ] **A8 — Sichttest: „Wählen"-Umschalter verbunden ↔ verwandt** · `Test` · ⏱ ~15–30 Min · _getestet am: _____
- [ ] **A9 — Sichttest: „verwandt · KI" mit echtem Schlüssel** · `Test` · ⏱ ~15–30 Min · _getestet am: _____
- [ ] **A10 — (Optional/später) „Schnipsel-Mittel"** · `Bau` nur b. Bedarf · ⏱ ~2 Sitzungen
  Einziges Verfahren mit messbarer Verwandt-Trennung, aber Datenvertrag-Eingriff (Schnipsel-Vektoren in die
  Spore) + **alle Knoten neu signieren**. Bewusst zurückgestellt. _erledigt am: _____

- [ ] **A11 — Such-Ergebnis → Frage → optional Andocken (Marktplatz-Kopplung Modul 22 ↔ 23)** · `Spec`+`Bau` · ⏱ ~1–2 Sitzungen
  **Klaus' Befund 2026-07-11:** ein fremder Nutzer dockt nicht ungefragt an — er **sucht/fragt zuerst**. Heute sind
  Such-Widget (Modul 22) und Andocken (Modul 23) getrennte Werkzeuge; der Handshake ist ein separater Klick.
  **Vorschlag:** Klick auf ein **positives Suchergebnis** (Marktplatz / semantische PWA-Suche, z.B. family-project.de)
  löst zuerst eine **Frage** an den Knoten aus (Antwort holen) und bietet dann **„🤝 mit diesem Knoten verbinden"** an
  (Andock bleibt nutzer-bestätigt). Natürlicher Erst-Kontakt-Fluss statt separatem Andock-Knopf. **Verfassungstreu:**
  Empfangsmodus + 0.80-Riegel unberührt, Andock bleibt bewusst/konsensuell — nur der Auslöse-Fluss wird
  nutzerfreundlicher. _erledigt am: _____

- [ ] **A12 — „Antworten: an/aus"-Modell überdenken (Erreichbarkeit · Reihenfolge · Auto-Toggle)** · `Spec` · ⏱ ~1 Sitzung
  **Klaus' Befund 2026-07-11 (echte Grenze des server-losen Designs):** heute ist Antworten **opt-in/manuell**
  (Default aus, `enableAnswering`/`disableAnswering`, Modul 23.B), und der Antworter-Tab muss **vorn+wach** sein
  (Meilenstein-Rest-Grenze). Offene Fragen: (1) **Erreichbarkeit** — mit „aus" gehen eingehende Fragen verloren; soll
  ein Knoten „immer erreichbar" sein oder der Toggle **automatisch** schalten? (2) **Reihenfolge/Flut** — ein Browser
  ist kein Server; bei vielen gleichzeitigen Fragen: Warteschlange/Priorisierung? (heute Rate-Limit ~6/min, kein
  persistenter Queue, single-threaded). (3) **Eigene Frage vs. fremde Fragen** — asymmetrisch, Priorität? Berührt
  Schutz-Modul 11 (Rate-Limit) + Meilenstein-Doku. **Erst Spec/Konzept, dann Bau.** _erledigt am: _____

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

## B) Verschlüsselung

- [ ] **B1 — Modul 20 Schlüssel-Safe: Sichttest der Modal-UI** · `Test` · ⏱ ~20–30 Min
  Real gebaut (AES-GCM-256, PBKDF2 600k, Shamir 2/3, headless 19/19). Einrichten/entsperren/Recovery prüfen. _getestet am: _____
- [ ] **B2 — Modul 20 Feinpunkte** · `Bau` `Entscheid` · ⏱ ~1 Sitzung
  Ed25519 „extractable"-Abwägung + N/k-Standardwerte im UI. _erledigt am: _____
- [ ] **B3 — Modul 20 netzweite Verteilung (BLP zuerst)** · `Bau` (braucht B1) · ⏱ ~1–2 Sitzungen · _erledigt am: _____
- [ ] **B4 — Widget-Tresor „Increment 2 B" (sicherheits-sensibel, eigene Sitzung)** · `Bau` · ⏱ ~1–2 Sitzungen
  Eigener Tresor (Shamir 2/3 + Passwort + 🔐), automatischer KI-Aufruf mit Websuche, App-Schlüssel-Durchreichung.
  Heute KI-Schlüssel bewusst nur im RAM. _erledigt am: _____
- [ ] **B5 — E2E Grad B: Pseudonymisierung** · `Bau` (kein Protokoll-Bump) · ⏱ ~1 Sitzung
  Platzhalter wie `[[KUNDE_1]]` statt Klartext — sofort möglich, guter Zwischenschritt. _erledigt am: _____
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
