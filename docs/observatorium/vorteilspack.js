/* ============================================================================
 * Observatoriums-Vorteilspack-Truhe — Sage-Page Render-Schicht (Schicht 4).
 *
 * Rendert das Tool-Grid in der geöffneten Truhe + das Tool-Detail-Modal
 * (neun Sektionen pro Werkzeug) + Clipboard-Kopier-Pfade. Reine
 * Distributions-/Render-Schicht: KEIN Eingriff in src/modules/, KEIN
 * Live-Andock, KEIN Version-Bump. Modul-Code wird beim Kopier-Klick
 * lazy per fetch() vom selben Host geholt (Hybrid-Strategie, Brief § 6 C).
 *
 * Klaus' Vision 2026-05-28 (Truhe) + 2026-05-29 (Bild-Asset + Symbole).
 * ========================================================================== */
(function () {
  "use strict";

  /* --- Werkzeug-Symbole (selbst gezeichnet, monochrom currentColor) ------- */
  var SYM = {
    "22": '<circle cx="27" cy="27" r="13"/><path d="M37 37 L51 51"/><path d="M27 21 V33 M21 27 H33"/><circle cx="27" cy="27" r="3"/>',
    "00": '<path d="M32 50 L13 45 V52 L32 56 Z"/><path d="M32 50 L51 45 V52 L32 56 Z"/><path d="M32 50 V56"/><path d="M17 47.6 L28 49.6"/><path d="M36 49.6 L47 47.6"/><circle cx="36" cy="23" r="10"/><path d="M43.4 30.4 L50 37"/>',
    "01": '<rect x="20" y="12" width="24" height="40" rx="12"/><path d="M20 30 H44"/><path d="M32 34 L38 40 L32 48 L26 40 Z"/><path d="M26 40 H38 M32 34 V48"/>',
    "02": '<path d="M32 10 C45 22 45 44 32 54 C19 44 19 22 32 10 Z"/><path d="M32 13 V25"/><circle cx="32" cy="38" r="7"/><path d="M28.5 40 q2 -4 4 -1 q1.5 2 3 -1"/>',
    "03": '<path d="M32 14 L17 48"/><path d="M32 14 L47 48"/><path d="M17 48 A 32 32 0 0 0 47 48"/><circle cx="32" cy="18" r="2.5"/><path d="M22 50 L46 22"/><path d="M46 22 L39.5 23 M46 22 L45 28.5"/>',
    "04": '<path d="M32 16 V46"/><path d="M24 50 H40"/><path d="M32 46 L26 50 M32 46 L38 50"/><circle cx="32" cy="15" r="2"/><path d="M14 20 H50"/><path d="M14 20 L11 32 M14 20 L17 32"/><path d="M10 32 A 5 5 0 0 0 18 32"/><path d="M50 20 L47 32 M50 20 L53 32"/><path d="M46 32 A 5 5 0 0 0 54 32"/>',
    "05": '<path d="M8 16 C 20 24 24 28 28 31"/><path d="M8 48 C 20 40 24 36 28 33"/><path d="M56 16 C 44 24 40 28 36 31"/><path d="M56 48 C 44 40 40 36 36 33"/><path d="M14 12 C 22 20 24 26 27 30"/><path d="M50 52 C 42 44 40 38 37 34"/><circle cx="32" cy="32" r="4.5"/>',
    "06": '<circle cx="32" cy="15" r="7"/><circle cx="32" cy="15" r="2.5"/><path d="M32 22 V52"/><path d="M32 42 H26 M28 42 V38"/><path d="M32 50 H38 M36 50 V46"/>',
    "07": '<path d="M16 13 H48"/><path d="M16 51 H48"/><path d="M19 13 L33 32 L19 51"/><path d="M45 13 L31 32 L45 51"/><path d="M32 30 V38"/><path d="M27 44 q3 -4 6 0 q-3 4 -6 0 Z"/><path d="M34 47 q2.5 -3 5 0 q-2.5 3 -5 0 Z"/>',
    "08": '<path d="M14 16 H50"/><path d="M32 10 V22"/><path d="M16 16 V39"/><path d="M48 16 V43"/><path d="M32 22 V42"/><circle cx="32" cy="46" r="3.5"/><circle cx="16" cy="40.5" r="1.4"/><circle cx="48" cy="44.5" r="1.4"/>',
    "09": '<circle cx="20" cy="20" r="6.5"/><circle cx="20" cy="20" r="2.8"/><path d="M24.6 24.6 L40 40"/><path d="M40 40 L48 36 M40 40 L44 48 M48 36 L52 44 M44 48 L52 44"/><path d="M27 27 q5 1 4 6"/><path d="M33 33 q6 0 6 6.5"/>',
    "10": '<path d="M32 11 V16 M29.5 13.5 H34.5"/><path d="M23 14 V18 M21 16 H25"/><path d="M41 14 V18 M39 16 H43"/><path d="M26 20 L28 31 M38 20 L36 31"/><circle cx="32" cy="40" r="10"/><path d="M32 34 L33.47 37.98 L37.71 38.15 L34.38 40.77 L35.53 44.85 L32 42.5 L28.47 44.85 L29.62 40.77 L26.29 38.15 L30.53 37.98 Z"/>',
    "11": '<path d="M10 22 H54"/><path d="M10 46 H54"/><path d="M32 17 V39"/><path d="M28 17 H36"/><path d="M29 23 H35 M29 28 H35 M29 33 H35"/><path d="M13 30 H26 M13 38 H24"/><path d="M40 34 H50"/>',
    "12": '<path d="M14 24 H50"/><path d="M14 20 V30 M50 20 V30"/><rect x="25" y="32" width="14" height="12" rx="2"/><path d="M28 32 V26 a4 4 0 0 1 8 0 V32"/><circle cx="32" cy="37" r="1.4"/><path d="M32 37 V40.5"/>',
    "14": '<circle cx="18" cy="46" r="2.2" fill="currentColor" stroke="none"/><path d="M18 34 A 12 12 0 0 1 30 46"/><path d="M18 26 A 20 20 0 0 1 38 46"/><path d="M18 18 A 28 28 0 0 1 46 46"/>',
    "15": '<path d="M32 11 L50 17 V32 C50 44 42 52 32 56 C22 52 14 44 14 32 V17 Z"/><path d="M23 23 L41 41 M31 21 L45 35 M19 31 L33 45"/><path d="M41 23 L23 41 M33 21 L19 35 M45 31 L31 45"/>',
    "16": '<path d="M27 10 L37 10 L34 16 L30 16 Z"/><rect x="29.5" y="16" width="5" height="4"/><circle cx="32" cy="40" r="11"/><circle cx="32" cy="40" r="8"/><path d="M32 29 V27 M43 40 H45 M32 51 V53 M21 40 H19"/><path d="M24.2 32.2 L22.8 30.8 M39.8 32.2 L41.2 30.8 M39.8 47.8 L41.2 49.2 M24.2 47.8 L22.8 49.2"/><path d="M32 35.8 L33.06 38.54 L35.99 38.70 L33.71 40.56 L34.47 43.40 L32 41.8 L29.53 43.40 L30.29 40.56 L28.01 38.70 L30.94 38.54 Z"/>',
    "17": '<circle cx="32" cy="26" r="12"/><path d="M27 19 a7 7 0 0 1 7 -1.5"/><path d="M37 22 V25 M35.5 23.5 H38.5"/><path d="M24 44 C 26 40 38 40 40 44"/><path d="M28 38 L26 44 M36 38 L38 44"/><path d="M22 50 H30 M34 50 H42"/>',
    "18": '<rect x="11" y="35" width="27" height="9" rx="4.5"/><circle cx="35" cy="39.5" r="1.4" fill="currentColor" stroke="none"/><path d="M36 38 C 45 32 52 31 56 33"/><path d="M37 40.5 C 45 37 51 35.5 56 33"/><path d="M36 41 L52 46"/><path d="M52 46 L48.5 45 M52 46 L51 48.5"/>',
    "19": '<path d="M14 50 L38 26"/><path d="M20 44 L23 47 M26 38 L29 41"/><circle cx="44" cy="20" r="6.5"/><path d="M44 13.5 L45.6 18.4 L50.5 20 L45.6 21.6 L44 26.5 L42.4 21.6 L37.5 20 L42.4 18.4 Z"/><path d="M53 12 V15 M51.5 13.5 H54.5"/><path d="M51 28 V30 M50 29 H52"/>',
    "NETZ": '<rect x="12" y="22" width="40" height="26" rx="3"/><path d="M12 25 L32 39 L52 25"/><path d="M12 47 L26 34 M52 47 L38 34"/><circle cx="46" cy="16" r="5"/><path d="M46 11 V13 M46 19 V21 M41 16 H43 M49 16 H51"/>',
    "andock": '<rect x="22" y="30" width="20" height="16" rx="3"/><path d="M28 30 V21 M36 30 V21"/><path d="M32 46 V55"/><path d="M25 55 H39"/><path d="M27 38 H37"/>',
    "knoten": '<rect x="12" y="14" width="40" height="36" rx="4"/><path d="M12 24 H52"/><circle cx="18" cy="19" r="1.5"/><circle cx="23" cy="19" r="1.5"/><circle cx="28" cy="19" r="1.5"/><circle cx="32" cy="39" r="6"/><path d="M32 33 V30 M27 42 L20 46 M37 42 L44 46"/>'
  };

  /* --- Tool-Datenbank (statische Metadaten, Code lazy per fetch) ---------- */
  var TOOLS = [
    { id:"andock", name:"Andock-Werkzeug", tier:"komplett", status:"fertig", kind:"html",
      task:"Identität, Spore, Siegel & Briefkasten im Browser erzeugen.",
      was:"Ein vollständiges, eigenständiges Andock-Werkzeug in einer einzigen HTML-Datei: erzeugt im Browser eine eigene Ed25519-Identität, eine signierte Spore (byte-kompatibel mit Sages Verifizierer), ein echtes e5-small-Domain-Embedding, das SBKIM-Siegel (SVG + PNG) und die Briefkasten-Dateien.",
      wie:"Datei öffnen, Eckdaten ausfüllen, vier Schritte durchklicken, Dateien herunterladen und ins eigene Repo legen. Keine Installation, keine Abhängigkeiten, kein Build — alles läuft lokal im Browser. Einzige Netz-Aktion: optionaler Modell-Download beim Embedding.",
      deps:"keine (eigenständige Ein-Datei-PWA)", code:"docs/observatorium/tools/andock.html", smoke:null, karte:"docs/observatorium/tools/README.md" },
    { id:"knoten", name:"Mycel-Knoten", tier:"komplett", status:"fertig", kind:"html",
      task:"Alle echten Sage-Module + Live-Lampen in einer Datei.",
      was:"Der komplette SBKIM-Knoten in einer einzigen HTML-Datei: dieselben echten, unveränderten Sage-Module 01/02/03/04/05/07/15/16/17, inklusive Live-Lampen-Widget (LEBT / VERKEHR / FREMD / SIEGEL). Referenz-Knoten zum Anschauen und Andocken.",
      wie:"Datei öffnen — unten rechts erscheint das schwebende Panel mit den vier Live-Lampen. Über die echten Module andocken (Identität, Embedding, Spore, Handshake). Vollständig lokal; einzige Netz-Aktion ist der optionale Embedding-Modell-Download.",
      deps:"keine (Ein-Datei-PWA, bündelt die Module selbst)", code:"docs/observatorium/tools/mycelknoten.html", smoke:null, karte:"docs/observatorium/tools/README.md" },

    { id:"01", name:"Storage", tier:"must", status:"stub",
      task:"IndexedDB-Wrapper für alle Knoten-Daten.",
      was:"Das Fundament jedes Knotens: ein versionierter IndexedDB-Wrapper mit festen Stores für Identität, Sporen, Logs und Konfiguration.",
      wie:"Öffnet eine versionierte Datenbank, legt die Pflicht-Stores an und bietet round-trip-sichere put/get-Operationen. Der init ist versions-fail-soft, damit alte Test-Stores keinen neuen Start blockieren.",
      deps:"keine", code:"src/modules/01_storage.js", smoke:"tests/smoke_pflege_01_init_fail_soft.mjs", karte:"docs/components/01_storage.md" },
    { id:"02", name:"Spore", tier:"must", status:"stub",
      task:"Eigene Identität + signierte Spore.",
      was:"Erzeugt die kryptographische Identität des Knotens und eine signierte Spore, an der Geschwister ihn wiedererkennen.",
      wie:"Generiert ein Schlüsselpaar, leitet die nodeId deterministisch aus dem Public Key ab, signiert die eigene Spore und verifiziert fremde Sporen. Multi-Identitäts-fähig (mehrere Personas pro Knoten).",
      deps:"01 Storage", code:"src/modules/02_spore.js", smoke:"tests/smoke_bau02y.mjs", karte:"docs/components/02_spore.md" },
    { id:"15", name:"Membran", tier:"must", status:"fertig",
      task:"Außenhülle: Fremdzugriff + postMessage.",
      was:"Die Außenhülle zur Browser-Umgebung: erkennt Fremdzugriff (KI-Browser-Agenten, App-zu-App-Brücken) und bedient die postMessage-Brücke ohne Server.",
      wie:"Sub (a) Read-API liefert einen Snapshot (mit Siegel-Hook), Sub (b) bedient eingehende postMessage-Ops (u.a. op:\"query\" → Modul 04 queryLocal). Ein Fremdzugriff-Detektor schaltet die FREMD-Lampe.",
      deps:"01 Storage, 02 Spore (+ 16 Siegel-Hook)", code:"src/modules/15_membran.js", smoke:"tests/smoke_bau15b_membran.mjs", karte:"docs/components/15_membran.md" },

    { id:"22", name:"Such-Werkzeug", tier:"basic", status:"fertig",
      task:"Semantische Bedeutungs-Suche (App · Knoten · Netz), server-los.",
      was:"Ein frei bewegliches Floating-Such-Tool, das die BEDEUTUNG hinter den Worten versteht — nicht Stichwörter. Drei getrennt ankreuzbare Bereiche: App (eigener Werkzeug-Korpus), Knoten (verbundene Mycel-Knoten, rein lokal) und Internet (Pilz-Egress: KI-Such-Brücke). Mit eigenem Schlüssel-Tresor (Shamir 2/3 + 🔐), automatischem KI-Aufruf mit Web-Suche (Claude direkt aus dem Browser, CORS live bestätigt), Schärfen-Feld, Agenten-Visitenkarte, Treffern als Prozent + 10+▾-Pfeil + 🖨 Block-Kopieren + Fortschrittsbalken. Läuft eigenständig — auch ohne Mycel-Anschluss.",
      wie:"Skript laden (KEIN Auto-Init), SbkimSearchWidget.init({...}) aufrufen — es self-mountet als 🔍-Blase und wächst bei Interaktion zum Panel. Komponiert Modul 03 (Embedding) + 04 (Match) für die Bedeutungs-Sortierung, optional Modul 21 (Sprache). Der Kopier-Weg ist gratis; der automatische Aufruf braucht einen BYOK-Schlüssel im Tresor.",
      deps:"03 Embedding, 04 Match (+ 21 Spracheingabe optional)", code:"src/modules/22_such_widget.js", smoke:"tests/smoke_bau22_such_widget.mjs", karte:"docs/components/22_such_widget.md" },

    { id:"03", name:"Embedding", tier:"basic", status:"fertig",
      task:"Text → Vektor (384-dim, lazy).",
      was:"Wandelt Text in einen 384-dimensionalen, L2-normierten Vektor — die Grundlage des semantischen Matchings.",
      wie:"Lädt das Embedding-Modell lazy beim ersten Aufruf und liefert danach normierte Vektoren. Nach dem Modell-Load kein Netz nötig.",
      deps:"keine", code:"src/modules/03_embedding.js", smoke:null, karte:"docs/components/03_embedding.md" },
    { id:"04", name:"Match", tier:"basic", status:"fertig",
      task:"Semantischer Match + lokale Cross-Knoten-Suche.",
      was:"Vergleicht Sporen semantisch über Cosinus-Ähnlichkeit und beantwortet lokale Such-Anfragen mit Top-k-Treffern.",
      wie:"Drei-Schichten-Match (Cosinus + Schwellwert + optionale Stufe-B-LLM-Erklärung) plus queryLocal als lokales Such-Backend für eingehende op:\"query\"-Nachrichten der Membran.",
      deps:"03 Embedding", code:"src/modules/04_match.js", smoke:"tests/smoke_bau04c_query_local.mjs", karte:"docs/components/04_match.md" },
    { id:"05", name:"Anastomose", tier:"basic", status:"fertig",
      task:"Handshake mit Geschwister-Knoten.",
      was:"Der Handschlag des Mycels: zwei Knoten erkennen sich, tauschen Sporen und etablieren einen direkten Faden.",
      wie:"postMessage- bzw. BroadcastChannel-Handshake, slot-spezifische Sibling-Stores, Outcome \"established\". Server-los, peer-to-peer — der Hub vermittelt nur den Erstkontakt.",
      deps:"01 Storage, 02 Spore", code:"src/modules/05_anastomose.js", smoke:"tests/smoke_bau05y_transparent_slot_pfad.mjs", karte:"docs/components/05_anastomose.md" },
    { id:"07", name:"Apoptose", tier:"basic", status:"stub",
      task:"TTL-Sweep + Self-Apoptose.",
      was:"Das bewusste Vergehen: abgelaufene Einträge werden gekehrt, und ein Knoten kann sich selbst — irreversibel — beenden.",
      wie:"TTL-Sweep über die Stores, Legacy-Inbox pro Slot, irreversible Self-Apoptose mit ausdrücklicher Bestätigung. Co-Schreiber-sicher.",
      deps:"01 Storage, 02 Spore", code:"src/modules/07_apoptose.js", smoke:"tests/smoke_bau07y_transparent_slot_pfad_und_legacy_hook.mjs", karte:"docs/components/07_apoptose.md" },
    { id:"16", name:"Siegel", tier:"basic", status:"stub",
      task:"Self-inscribing Vertrauens-Bezeugung (Bronze/Gold).",
      was:"Das SBKIM-Siegel: eine PWA-Zelle stellt sich nach erfüllter Selbst-Prüfung selbst ein Vertrauens-Siegel in Auszeichnungs-Optik aus.",
      wie:"Anti-Greenwashing — kein Siegel ohne erfüllte Pflicht-Module. Bronze nach Surface-Check, Gold nach mindestens einem etablierten Handshake. Lebendes Dokument: jedes Sicherheits-Update ergänzt einen Aspekt.",
      deps:"01 Storage, 02 Spore (+ 05 für Gold)", code:"src/modules/16_siegel.js", smoke:"tests/smoke_bau16_sub_e_bronze.mjs", karte:"docs/components/16_siegel.md" },
    { id:"17", name:"Floating Widget", tier:"basic", status:"stub",
      task:"Live-Status-Pille (LEBT/VERKEHR/FREMD/SIEGEL).",
      was:"Ein schwebendes Mini-Dashboard, das vier Live-Slots bündelt: LEBT, VERKEHR, FREMD, SIEGEL.",
      wie:"Self-Mount in <body>, fünf window-Event-Listener, Drag per Pointer-Events, X-Schließen + localStorage-Persistierung. Muss VOR Membran/Siegel initialisiert werden (Modal-Bridge-Proxy).",
      deps:"lauscht auf Events von 02/05/15/16", code:"src/modules/17_floating_widget.js", smoke:"tests/smoke_bau17_floating_widget.mjs", karte:"docs/components/17_floating_widget.md" },
    { id:"18", name:"Tool-PWA", tier:"basic", status:"stub",
      task:"Andock-Container / Tool-PWA-Hülle.",
      was:"Der Container, der die SBKIM-Werkzeuge in einer eigenständigen Tool-PWA bündelt — Andocken, Heterokaryose, Backup, Self-Apoptose, Sporen-Regeneration u.a.",
      wie:"Neun Sub-Bereiche (a–i). Sub (a) Andock-Wizard ist als Vorab gebaut; die weiteren Sub-Bereiche folgen nach App-Freigabe.",
      deps:"01 Storage, 02 Spore, 05, 06, 15, 16", code:"src/modules/18_tool_pwa.js", smoke:"tests/smoke_bau18_sub_a_vorab.mjs", karte:"docs/components/18_tool_pwa.md" },

    { id:"00", name:"Doku-Fenster", tier:"pro", status:"stub",
      task:"5-Klick-versteckte Lauf-Zustand-Anzeige.",
      was:"Ein verstecktes Doku-Fenster, das per 5-Klick-Geste am Such-Symbol den Lauf-Zustand des Knotens zeigt — Speicher, TTL, letzte Handshakes.",
      wie:"Lauscht auf eine 5-Klick-Folge am konfigurierten Such-Icon und öffnet ein Overlay mit Live-Zahlen aus Storage + Apoptose. Nur Lesen, kein Netz.",
      deps:"01 Storage (für Lauf-Zustand)", code:"src/modules/00_doku_fenster.js", smoke:null, karte:"docs/components/00_doku_fenster.md" },
    { id:"06", name:"Heterokaryose", tier:"pro", status:"stub",
      task:"Anker-Tausch zwischen Geschwistern.",
      was:"Zwei verbundene Knoten tauschen ausgewählte Anker — wie zwei Zellkerne, die sich eine Hyphe teilen.",
      wie:"Slot-spezifische Outbox/Inbox, Opt-In pro Geschwister, transparenter Slot-Pfad. Setzt einen etablierten Handshake voraus.",
      deps:"01 Storage, 02 Spore, 05 Anastomose", code:"src/modules/06_heterokaryose.js", smoke:"tests/smoke_bau06y_transparent_slot_pfad.mjs", karte:"docs/components/06_heterokaryose.md" },
    { id:"08", name:"UI-Demo", tier:"pro", status:"stub",
      task:"Andocker-UI für Outbox + Opt-In.",
      was:"Eine Werkstatt-UI, die die zwei Stellen füllt, die Heterokaryose braucht: die Anker-Outbox und das Geschwister-Opt-In.",
      wie:"Storage-only Fünf-Funktionen-API, slot-spezifisch. Keine Netz-/Embedding-Logik — die Vektor-Erzeugung bleibt Aufrufer-Pflicht.",
      deps:"01 Storage, 02 Spore, 06 Heterokaryose", code:"src/modules/08_ui_demo.js", smoke:"tests/smoke_bau08y_slot_spezifische_outbox.mjs", karte:"docs/components/08_ui_demo.md" },
    { id:"09", name:"Einbau-PWA", tier:"pro", status:"fertig",
      task:"Schritt-für-Schritt-Andock-Anleitung.",
      was:"Kein Modul-Code, sondern die Anleitung (Karte 09), wie man die SBKIM-Module in eine bestehende PWA einbaut.",
      wie:"Neun Schritte vom Datei-Kopieren über die Skript-Reihenfolge bis zum Sichtkontroll-Block. Folge der Karte 09.",
      deps:"—", code:null, smoke:null, karte:"docs/components/09_einbau_pwa.md" },
    { id:"10", name:"Reputation", tier:"pro", status:"schablone",
      task:"Vertrauens-Signal über Zeit (Schutz-Backlog).",
      was:"Reaktives Schutz-Modul: bewertet Geschwister über Zeit. Wird erst gebaut, wenn das Netz groß genug ist, dass Apoptose + Match-Filter nicht mehr reichen.",
      wie:"Stub — Voll-Bau frühestens bei ≥10 aktiven Geschwistern mit Statistik.",
      deps:"—", code:null, smoke:null, karte:"docs/components/10_reputation.md" },
    { id:"11", name:"Rate-Limit", tier:"pro", status:"schablone",
      task:"Eingehende postMessage drosseln (Schutz-Backlog).",
      was:"Reaktives Schutz-Modul: begrenzt den Durchfluss eingehender Nachrichten.",
      wie:"Stub — Mini-Bau (Rate-Limit-Hook für eingehende postMessage) nach App-Freigabe geplant.",
      deps:"—", code:null, smoke:null, karte:"docs/components/11_rate_limit.md" },
    { id:"12", name:"Blocklist", tier:"pro", status:"schablone",
      task:"Manuelle Sperre im Andocker-UI (Schutz-Backlog).",
      was:"Reaktives Schutz-Modul: eine manuelle Blocklist für unerwünschte Knoten.",
      wie:"Stub — Mini-Bau (manuelle Blocklist im Andocker-UI) nach App-Freigabe geplant.",
      deps:"—", code:null, smoke:null, karte:"docs/components/12_blocklist.md" },
    { id:"14", name:"Diffusion", tier:"pro", status:"schablone",
      task:"Wuchs durch Empfehlung (Backlog).",
      was:"Proaktives Modul nach innen: konsensuelle Empfehlung im Handshake — das Netz wächst durch Empfehlung statt durch Crawling.",
      wie:"Stub — Spec folgt.",
      deps:"—", code:null, smoke:null, karte:"docs/components/14_diffusion.md" },
    { id:"19", name:"Andock-Wizard", tier:"pro", status:"fertig",
      task:"Aus Repo-URL + Domain + Knotentyp eine Spore-Vorlage erzeugen.",
      was:"Kopierbarer Andock-Wizard, extrahiert aus der Sage-Page: aus drei Eingaben (Repo-URL · Domain · Knotentyp) erzeugt er eine unsignierte Spore-Vorlage, die passende status.json-Zeile und einen vorgelinkten GitHub-PR. Reine Eingabe→Text-Hilfe — kein Signieren (Modul 02), kein Storage, kein Netz.",
      wie:"Modul kopieren, SbkimAndockWizard.mount({container}) aufrufen (oder die reinen Funktionen generate()/buildSporeTemplate() direkt nutzen). Läuft eigenständig, ohne Abhängigkeiten.",
      deps:"keine (reine Eingabe→Text-Hilfe)", code:"src/modules/19_andock_wizard.js", smoke:"tests/smoke_bau19_andock_wizard.mjs", karte:"docs/components/19_andock_wizard.md" },

    { id:"NETZ", name:"Netz-Wächter & Briefkasten", tier:"basic", status:"fertig",
      task:"Knoten melden Bauten + finden Neues — server-los.",
      was:"Die Auto-Sync-Schicht des Mycels: jeder Knoten legt einen maschinenlesbaren Briefkasten-Aushang (sbkim/SIGNAL.json) ab und erfährt von Bauten der anderen — per zeitgesteuerter GitHub-Action UND per Briefkasten-Knopf auf der Seite. Kein Server, kein Daemon, kein Push.",
      wie:"INTERFACES §11.6: SIGNAL.json mit monoton steigender seq + ack-Symmetrie. Die Action (.github/sbkim-watch.mjs) liest die SIGNAL.json der Peers aus raw/main, vergleicht seq gegen den eigenen ack und öffnet NUR bei Neuem ein Issue. Der 📬-Knopf neben den Lampen prüft dasselbe live im Browser (CORS, kein Token). Das Pushen der Datei IST das Signal.",
      deps:"keine (eigenständig; ergänzt 02 Spore / 05 Anastomose)", code:".github/sbkim-watch.mjs", smoke:null, karte:".github/SBKIM-WATCH-FUER-FORKER.md" }
  ];

  /* --- Helfer ------------------------------------------------------------- */
  var TIER_LABEL = { komplett:"Ein-Datei-PWA", must:"Must-have", basic:"Basic", pro:"Pro" };
  var TIER_ORDER = { komplett:-1, must:0, basic:1, pro:2 };
  var STATUS = {
    fertig:    { mark:"🟩", label:"Fertig" },
    stub:      { mark:"🟦", label:"Code-Stub" },
    schablone: { mark:"🟫", label:"Schablone" }
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function svgFor(id) {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (SYM[id] || "") + '</svg>';
  }
  function fileOf(path) { return path ? path.split("/").pop() : ""; }
  // Numerische Modul-IDs werden als "NN · Name" gezeigt; Wort-IDs (andock,
  // knoten, NETZ) nur als Name — sonst doppelt die ID den Namen.
  function displayName(t) {
    return /^[0-9]+$/.test(t.id) ? (t.id + " · " + t.name) : t.name;
  }

  // Live-Status aus status.json — dieselbe Quelle wie der Bau-Puls auf der
  // ersten Seite. Verhindert, dass die fest verdrahteten status-Werte hier
  // abdriften. Module liegen in status.json über mehrere Gruppen verteilt.
  function gatherLiveStatus(statusJson) {
    var groups = ["modules", "schutzBacklog", "diffusionBacklog",
      "membranBacklog", "toolPwaBacklog", "siegelBacklog", "mycelHubBacklog"];
    var map = {};
    groups.forEach(function (g) {
      var arr = statusJson && statusJson[g];
      if (Array.isArray(arr)) arr.forEach(function (m) {
        if (m && m.id != null && STATUS[m.score]) map[String(m.id)] = m.score;
      });
    });
    return map;
  }
  function applyLiveStatus(tiles) {
    if (typeof fetch !== "function") return;
    // Teilt sich die Holung mit der Seite (window.sageStatusJson, 2026-08-09):
    // status.json wurde vorher von drei Stellen einzeln geholt. Fehlt die
    // Hülle — etwa weil diese Datei anderswo eingebaut wird —, holt sie
    // weiterhin selbst. Fail-soft, kein toter Pfad.
    var holen = (typeof window !== "undefined" && typeof window.sageStatusJson === "function")
      ? window.sageStatusJson()
      : fetch("status.json", { cache: "no-store" }).then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        });
    holen.then(function (data) {
      var map = gatherLiveStatus(data);
      // 1) Daten patchen, damit auch das Modal den Live-Stand zeigt.
      TOOLS.forEach(function (t) { if (map[t.id]) t.status = map[t.id]; });
      // 2) Sichtbare Badges patchen (Tiles sind schon gerendert).
      tiles.forEach(function (el) {
        var id = el.getAttribute("data-tool");
        var st = map[id] && STATUS[map[id]];
        if (st) {
          var s = el.querySelector(".vp-status");
          if (s) s.textContent = st.mark + " " + st.label;
        }
      });
    }).catch(function () { /* fail-soft: fest verdrahteter Status bleibt */ });
  }

  // Live-Status aus status.json — dieselbe Quelle wie der Bau-Puls auf der
  // ersten Seite. Verhindert, dass die fest verdrahteten status-Werte hier
  // abdriften. Module liegen in status.json über mehrere Gruppen verteilt.
  function gatherLiveStatus(statusJson) {
    var groups = ["modules", "schutzBacklog", "diffusionBacklog",
      "membranBacklog", "toolPwaBacklog", "siegelBacklog", "mycelHubBacklog"];
    var map = {};
    groups.forEach(function (g) {
      var arr = statusJson && statusJson[g];
      if (Array.isArray(arr)) arr.forEach(function (m) {
        if (m && m.id != null && STATUS[m.score]) map[String(m.id)] = m.score;
      });
    });
    return map;
  }
  function applyLiveStatus(tiles) {
    if (typeof fetch !== "function") return;
    // Teilt sich die Holung mit der Seite (window.sageStatusJson, 2026-08-09):
    // status.json wurde vorher von drei Stellen einzeln geholt. Fehlt die
    // Hülle — etwa weil diese Datei anderswo eingebaut wird —, holt sie
    // weiterhin selbst. Fail-soft, kein toter Pfad.
    var holen = (typeof window !== "undefined" && typeof window.sageStatusJson === "function")
      ? window.sageStatusJson()
      : fetch("status.json", { cache: "no-store" }).then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        });
    holen.then(function (data) {
      var map = gatherLiveStatus(data);
      // 1) Daten patchen, damit auch das Modal den Live-Stand zeigt.
      TOOLS.forEach(function (t) { if (map[t.id]) t.status = map[t.id]; });
      // 2) Sichtbare Badges patchen (Tiles sind schon gerendert).
      tiles.forEach(function (el) {
        var id = el.getAttribute("data-tool");
        var st = map[id] && STATUS[map[id]];
        if (st) {
          var s = el.querySelector(".vp-status");
          if (s) s.textContent = st.mark + " " + st.label;
        }
      });
    }).catch(function () { /* fail-soft: fest verdrahteter Status bleibt */ });
  }

  function buildEinbau(t) {
    if (t.kind === "html") {
      var hf = fileOf(t.code);
      return [
        "Werkzeug herunterladen (Knopf »Datei herunterladen«) oder den Code kopieren.",
        "Die Datei " + hf + " 1:1 ins eigene Repo legen (z.B. ins Repo-Root) — nicht verändern.",
        "Über GitHub Pages o.ä. veröffentlichen und im Browser öffnen — es läuft eigenständig, ohne Installation.",
        "Eigenen Knoten-Namen + Domäne eintragen und den Schritten in der Datei folgen."
      ];
    }
    if (!t.code) {
      return ["Dieses Werkzeug ist noch Konzept bzw. reine Anleitung — siehe Modul-Karte. Kein 1:1-kopierbarer Modul-Code."];
    }
    var file = fileOf(t.code);
    var steps = [
      "Datei " + t.code + " aus diesem Repo nach sbkim/" + file + " kopieren (1:1, nicht verändern).",
      'In sbkim/sbkim-init.js ein <script src="sbkim/' + file + '"></' + 'script> ergänzen — nach den Abhängigkeiten (' + t.deps + ").",
      "await Sbkim<Modul>.init({ … }) aufrufen — Pflichtfelder siehe Modul-Karte + INTERFACES § 1 Modul " + t.id + "."
    ];
    if (t.smoke) {
      steps.push("Smoke-Test kopieren + laufen: node " + t.smoke + " (erwartet grün).");
    }
    steps.push("Panel " + t.id + " in tests/manual_check.html ergänzen (optional, Sichttest).");
    return steps;
  }

  function buildVibe(t) {
    if (t.kind === "html") {
      var hf = fileOf(t.code);
      return "" +
        "Du baust das eigenständige SBKIM-Werkzeug \"" + t.name + "\" in mein Repo ein.\n\n" +
        "Quelle: https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/" + t.code + "\n" +
        "Zielpfad: " + hf + " (1:1 kopieren, nicht verändern).\n\n" +
        "Es ist eine vollständige Ein-Datei-PWA — keine Abhängigkeiten, kein Build, keine Installation.\n" +
        "Veröffentlichen (GitHub Pages o.ä.), im Browser öffnen, eigenen Knoten-Namen + Domäne eintragen.\n\n" +
        "Tabus:\n" +
        "- KEIN Eingriff in den Code (1:1 Kopie) — Krypto + Kanonisierung müssen byte-kompatibel mit Sage bleiben.\n" +
        "- KEIN PROTOCOL_VERSION-Bump.";
    }
    if (!t.code) {
      return "Dieses Werkzeug hat noch keinen Modul-Code (Stand: Schablone/Konzept).\n" +
        "Stand + Plan: siehe Karte " + t.karte + ".";
    }
    var file = fileOf(t.code);
    var testBlock = t.smoke
      ? "- Kopiere " + t.smoke + " nach tests/.\n- Lauf: node " + t.smoke + " (erwartet N/N grün)."
      : "- Smoke-Test: modul-spezifisch, siehe tests/.";
    return "" +
      "Du baust SBKIM-Modul " + t.id + " " + t.name + " in mein Repo ein.\n\n" +
      "Quelle: https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/" + t.code + "\n" +
      "Zielpfad: sbkim/" + file + " (1:1 kopieren, nicht verändern).\n\n" +
      "Andocker-Pflege (sbkim/sbkim-init.js):\n" +
      "1. <script src=\"sbkim/" + file + "\"></script> ergänzen — nach den Abhängigkeiten.\n" +
      "2. await Sbkim<Modul>.init({…}) aufrufen (Pflichtfelder: siehe Karte " + t.karte +
      " + INTERFACES § 1 Modul " + t.id + ").\n\n" +
      "Abhängigkeiten: " + t.deps + ".\n\n" +
      "Test:\n" + testBlock + "\n\n" +
      "Sichttest in tests/manual_check.html: Panel " + t.id + ".\n\n" +
      "Tabus:\n" +
      "- KEIN Eingriff in den Modul-Code (1:1 Kopie).\n" +
      "- KEIN PROTOCOL_VERSION-Bump.";
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  function downloadFile(path) {
    return fetch(path).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.blob();
    }).then(function (blob) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = path.split("/").pop();
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      return true;
    });
  }

  /* --- DOM-Aufbau --------------------------------------------------------- */
  function init() {
    var truhe = document.getElementById("vp-truhe");
    var grid = document.getElementById("vp-grid");
    var pillBox = document.getElementById("vp-tier-pills");
    if (!truhe || !grid) return; // Karte nicht auf dieser Seite

    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sorted = TOOLS.slice().sort(function (a, b) {
      if (TIER_ORDER[a.tier] !== TIER_ORDER[b.tier]) return TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
      return a.id < b.id ? -1 : 1;
    });
    var byId = {};
    TOOLS.forEach(function (t) { byId[t.id] = t; });

    // Tiles rendern
    grid.innerHTML = sorted.map(function (t) {
      var st = STATUS[t.status];
      return '<button type="button" class="vp-tile vp-tier-' + t.tier + '" data-tool="' + t.id +
        '" data-tier="' + t.tier + '" aria-label="' + esc(t.id + " " + t.name + " — " + t.task) + '">' +
        '<span class="vp-tile-icon">' + svgFor(t.id) + '</span>' +
        '<span class="vp-badge">' + esc(TIER_LABEL[t.tier]) + '</span>' +
        '<span class="vp-tile-name">' + esc(displayName(t)) + '</span>' +
        '<span class="vp-tile-task">' + esc(t.task) + '</span>' +
        '<span class="vp-status">' + st.mark + " " + esc(st.label) + '</span>' +
        '</button>';
    }).join("");

    var tiles = Array.prototype.slice.call(grid.querySelectorAll(".vp-tile"));

    // Status live aus status.json nachziehen (Bau-Puls-Quelle der ersten Seite).
    applyLiveStatus(tiles);

    // Klick auf die Truhe = "Eingang in die Truhe": öffnet die zweite
    // Seite (Werkzeug-Screen) — genau wie die Einladungs-Tür der Eingang
    // zur Einladung ist und das Schwarze Loch der Eingang zum Observatorium.
    function enterTruhe() {
      truheBurst();
      var go = function () {
        if (typeof window.goScreen === "function") window.goScreen("vorteilspack", "vorteilspack");
        else { location.hash = "#observatorium-vorteilspack"; }
      };
      if (prefersReduced) go();
      else setTimeout(go, 620);
    }
    truhe.addEventListener("click", enterTruhe);
    truhe.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enterTruhe(); }
    });

    // --- Tür-artige FX: Feenstaub folgt der Maus + Nähe-Licht am Deckel ---
    var glow = truhe.querySelector(".vp-glow");
    var dustCanvas = truhe.querySelector(".vp-dust");
    var glowHover = 0;
    var dustSpawn = null;
    function updateGlow() {
      if (glow) glow.style.opacity = String(glowHover);
    }
    function truheBurst() {
      truhe.classList.add("is-opening");
      if (dustSpawn && dustCanvas) {
        var r = dustCanvas.getBoundingClientRect();
        for (var i = 0; i < 70; i++) {
          dustSpawn(r.width * (0.25 + Math.random() * 0.5), r.height * (0.3 + Math.random() * 0.35), 1);
        }
      }
      setTimeout(function () { truhe.classList.remove("is-opening"); }, 700);
    }

    if (dustCanvas && !prefersReduced && dustCanvas.getContext) {
      var ctx = dustCanvas.getContext("2d");
      var particles = [];
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var dustResize = function () {
        var r = dustCanvas.getBoundingClientRect();
        if (r.width === 0) return;
        dustCanvas.width = Math.round(r.width * dpr);
        dustCanvas.height = Math.round(r.height * dpr);
        dustCanvas.style.width = r.width + "px";
        dustCanvas.style.height = r.height + "px";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      };
      dustResize();
      if (window.ResizeObserver) new ResizeObserver(dustResize).observe(dustCanvas);

      dustSpawn = function (x, y, n) {
        for (var i = 0; i < n; i++) {
          if (particles.length > 240) particles.shift();
          particles.push({
            x: x + (Math.random() - 0.5) * 14, y: y + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 0.7, vy: -0.3 - Math.random() * 0.7,
            life: 0, maxLife: 0.9 + Math.random() * 1.6,
            size: 1.3 + Math.random() * 2.8, tint: Math.random()
          });
        }
      };

      truhe.addEventListener("pointerenter", function () { truhe.classList.add("is-near"); });
      truhe.addEventListener("pointerleave", function () { truhe.classList.remove("is-near"); glowHover = 0; updateGlow(); });
      truhe.addEventListener("pointermove", function (e) {
        var r = dustCanvas.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        dustSpawn(x, y, 2 + Math.floor(Math.random() * 3));
        // Nähe zum geöffneten Deckel (Lid-Zentrum ~ 50% / 42% der Bildhöhe)
        var dx = x / r.width - 0.5, dy = y / r.height - 0.42;
        glowHover = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 0.55);
        updateGlow();
      });

      var lastT = performance.now();
      (function dustLoop() {
        if (!dustCanvas.isConnected) return;
        var now = performance.now();
        var dt = Math.min(0.05, (now - lastT) / 1000);
        lastT = now;
        var w = dustCanvas.width / dpr, h = dustCanvas.height / dpr;
        ctx.clearRect(0, 0, w, h);
        if (particles.length) {
          particles = particles.filter(function (p) {
            p.life += dt;
            if (p.life >= p.maxLife) return false;
            p.x += p.vx; p.y += p.vy; p.vy -= 0.018;
            var lr = 1 - (p.life / p.maxLife);
            var alpha = lr * 0.9;
            var s = p.size * (0.55 + lr * 0.55);
            // teal-gold (Mycel-Palette): gold bzw. türkis
            var g = p.tint < 0.5 ? 200 : 231;
            var b = p.tint < 0.5 ? 90 : 211;
            ctx.fillStyle = "rgba(255," + g + "," + b + "," + alpha + ")";
            ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "rgba(255," + g + "," + b + "," + (alpha * 0.55) + ")";
            ctx.fillRect(p.x - s * 3, p.y - 0.5, s * 6, 1);
            ctx.fillRect(p.x - 0.5, p.y - s * 3, 1, s * 6);
            return true;
          });
        }
        requestAnimationFrame(dustLoop);
      })();
    } else {
      // Reduced-motion / kein Canvas: Nähe-Licht binär per Hover
      truhe.addEventListener("pointerenter", function () { truhe.classList.add("is-near"); glowHover = 0.7; updateGlow(); });
      truhe.addEventListener("pointerleave", function () { truhe.classList.remove("is-near"); glowHover = 0; updateGlow(); });
    }

    // Tier-Filter-Pillen
    var activeTier = null;
    function applyFilter(tier) {
      tier = tier || null;
      activeTier = tier;
      tiles.forEach(function (el) {
        el.classList.toggle("vp-dim", !!tier && el.getAttribute("data-tier") !== tier);
      });
      if (pillBox) {
        Array.prototype.slice.call(pillBox.querySelectorAll(".vp-pill")).forEach(function (p) {
          var pt = p.getAttribute("data-tier") || null;
          p.classList.toggle("is-active", pt === activeTier);
        });
      }
    }
    if (pillBox) {
      pillBox.addEventListener("click", function (e) {
        var btn = e.target.closest(".vp-pill");
        if (!btn) return;
        var tier = btn.getAttribute("data-tier") || null;
        applyFilter(activeTier === tier ? null : tier);
      });
      applyFilter(null); // "Werkzeuge (alle)" ist Default-Ansicht
    }

    // Tile → Modal
    grid.addEventListener("click", function (e) {
      var tile = e.target.closest(".vp-tile");
      if (!tile) return;
      var t = byId[tile.getAttribute("data-tool")];
      if (t) openModal(t);
    });

    // --- Modal ---
    var modal = document.createElement("div");
    modal.className = "vp-modal";
    modal.id = "vp-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    document.body.appendChild(modal);
    var lastFocus = null;

    function section(title, bodyHtml) {
      return '<div class="vp-section"><h4>' + esc(title) + '</h4>' + bodyHtml + '</div>';
    }

    function renderModal(t) {
      var st = STATUS[t.status];
      var einbau = '<ol>' + buildEinbau(t).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ol>';
      var vibe = buildVibe(t);
      var copyLabel = t.kind === "html" ? "Werkzeug-Code kopieren" : "Modul-Code kopieren";
      var codeBtn = t.code
        ? '<button type="button" class="vp-copy-btn" id="vp-copy-code">' + copyLabel + '</button>'
        : '<button type="button" class="vp-copy-btn" disabled title="kein Code">Kein Code</button>';
      var dlBtn = t.code
        ? '<button type="button" class="vp-copy-btn secondary" id="vp-dl-file">Datei herunterladen</button>'
        : '';
      var copyRow = '<div class="vp-copy-row">' + codeBtn + dlBtn +
        '<button type="button" class="vp-copy-btn secondary" id="vp-copy-vibe">Vibe-Prompt kopieren</button>' +
        '<span class="vp-toast" id="vp-toast" role="status"></span></div>';
      var testHtml = t.smoke
        ? '<p>Smoke-Test <code>' + esc(t.smoke) + '</code> — nach <code>tests/</code> kopieren, dann <code>node ' + esc(t.smoke) + '</code>.</p>'
        : '<p>Kein eigener Smoke-Test hinterlegt.</p>';
      var karteLabel = t.kind === "html" ? "Karte: " : "Modul-Karte: ";
      var codeLabel = t.kind === "html" ? "Werkzeug-Datei: " : "Modul-Code: ";
      var links = '<ul>' +
        '<li><a href="' + esc(t.karte) + '" target="_blank" rel="noopener">' + karteLabel + esc(t.karte) + '</a></li>' +
        (t.kind === "html" ? '' : '<li>INTERFACES § 1 Modul ' + esc(t.id) + '</li>') +
        (t.code ? '<li><a href="' + esc(t.code) + '" target="_blank" rel="noopener">' + codeLabel + esc(t.code) + '</a></li>' : '') +
        '</ul>';

      modal.innerHTML =
        '<div class="vp-modal-backdrop" data-close="1"></div>' +
        '<div class="vp-modal-card vp-tier-' + t.tier + '">' +
          '<button type="button" class="vp-modal-close" id="vp-modal-close" aria-label="Schließen">×</button>' +
          '<div class="vp-modal-head">' +
            '<span class="vp-tile-icon">' + svgFor(t.id) + '</span>' +
            '<div><h2 class="vp-modal-title">' + esc(displayName(t)) + '</h2>' +
            '<div class="vp-modal-meta">' + esc(TIER_LABEL[t.tier]) + ' · ' + st.mark + " " + esc(st.label) + '</div></div>' +
          '</div>' +
          section("Was das ist", '<p>' + esc(t.was) + '</p>') +
          section("Wie es funktioniert", '<p>' + esc(t.wie) + '</p>') +
          section("Wie man es einbaut", einbau) +
          section("Vibe-Coding-Prompt-Paket", '<pre class="vp-pre">' + esc(vibe) + '</pre>') +
          section("Kopieren", copyRow) +
          section("Test-Modul", testHtml) +
          section("Querverweise", links) +
        '</div>';

      // Kopier-Handler
      var cc = modal.querySelector("#vp-copy-code");
      if (cc && t.code) {
        cc.addEventListener("click", function () {
          cc.disabled = true;
          fetch(t.code).then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.text();
          }).then(function (txt) {
            return copyText(txt).then(function (ok) {
              toast(ok ? "✓ Kopiert (" + txt.split("\n").length + " Zeilen)" : "⚠ Kopieren fehlgeschlagen — Link unten nutzen");
            });
          }).catch(function () {
            toast("⚠ Konnte Code nicht laden — Link unten nutzen");
          }).then(function () { cc.disabled = false; });
        });
      }
      var dl = modal.querySelector("#vp-dl-file");
      if (dl && t.code) {
        dl.addEventListener("click", function () {
          dl.disabled = true;
          downloadFile(t.code).then(function () {
            toast("✓ Heruntergeladen: " + fileOf(t.code));
          }).catch(function () {
            toast("⚠ Download fehlgeschlagen — Link unten nutzen");
          }).then(function () { dl.disabled = false; });
        });
      }
      var cv = modal.querySelector("#vp-copy-vibe");
      if (cv) {
        cv.addEventListener("click", function () {
          copyText(vibe).then(function (ok) { toast(ok ? "✓ Vibe-Prompt kopiert" : "⚠ Kopieren fehlgeschlagen"); });
        });
      }
      var close = modal.querySelector("#vp-modal-close");
      if (close) close.addEventListener("click", closeModal);
    }

    var toastTimer = null;
    function toast(msg) {
      var el = modal.querySelector("#vp-toast");
      if (!el) return;
      el.textContent = msg;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { if (el) el.textContent = ""; }, 4000);
    }

    function openModal(t) {
      lastFocus = document.activeElement;
      renderModal(t);
      modal.hidden = false;
      var c = modal.querySelector("#vp-modal-close");
      if (c) c.focus();
    }
    function closeModal() {
      modal.hidden = true;
      modal.innerHTML = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    modal.addEventListener("click", function (e) {
      if (e.target && e.target.getAttribute("data-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }

  // Headless-Test-Anker (kein Browser-Effekt — nur für tests/)
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { TOOLS: TOOLS, SYM: SYM, buildVibe: buildVibe, buildEinbau: buildEinbau, TIER_LABEL: TIER_LABEL, STATUS: STATUS };
  }
})();
