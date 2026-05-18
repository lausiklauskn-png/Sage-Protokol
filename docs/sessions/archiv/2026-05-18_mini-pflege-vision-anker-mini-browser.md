# Mini-Pflege 2026-05-18 — Vision-Anker Mini-Browser (Tauri-App) als achter Anker

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker-mini-browser`. Folge-Pflege am selben Tag
nach PR #84 (Anker 7 Extension).

---

## 1. Was geschah

PR #84 hat den siebten Vision-Anker (Browser-Extension „Lampe in der
Toolbar") in PULS eingetragen. Bei der Klärung in PR #84 hatte Klaus
zunächst entschieden: Mini-Browser bleibt **Notiz** an Anker 2 Pfad 3,
nicht eigener Anker.

Am selben Nachmittag — direkt nach Merge von PR #84 — hat Klaus seine
Entscheidung **revidiert** (per AskUserQuestion: „Zwei getrennte
Vision-Anker (7 + 8)"). Begründung implizit: Mini-Browser und Extension
sind architektonisch klar unterschieden (Browser-Erweiterung vs.
dedizierte Desktop-App), beide verdienen eigene Anker-Ebene.

Klaus' Auftrag: „Mach bitte die Minipflege. Das dauert nicht allzu lange
für den Anker acht, weil dann ist das so weit durch, denke ich, ne. Also
sieben acht ist gemacht."

## 2. Konzept — Anker 8 Mini-Browser

Standalone-Desktop-App, die nur die Sage-PWA hostet:

- **Tauri-Stack** (Rust + System-WebView) — schlank (~10-30 MB), nutzt
  OS-eigenes WebView2 / WKWebView / WebKitGTK
- **Eigene IndexedDB** im App-Daten-Verzeichnis → strukturelle Antwort
  auf Lehre 1 (Browser-Reklamation) und Spore-Verlust 2026-05-17
- **Tray-Icon-Modus** für Hintergrund-Empfang (Browser-Tab nicht nötig)
- **Doppelklick-Installer** (`.msi` / `.dmg` / `.AppImage`) — Onboarding
  ~2 Min von Link bis empfangsbereit
- **System-Autostart-Toggle** im Tray-Menü
- **Auto-Update** via Tauri-Updater + signierte GitHub-Releases

**Plattform-Ehrlichkeit:** Desktop-only (Windows/macOS/Linux). Mobile
und DeX-Chrome bleiben außen vor — wie bei Anker 7.

## 3. Architektur-Skizze

- Tauri-App-Shell hostet `index.html` lokal aus App-Bundle
  (`tauri://localhost` als interne Origin)
- WebView nutzt eigene IndexedDB-Instanz, isoliert vom System-Browser
- Tray-Icon mit denselben Lampen-Zuständen wie Extension (aus / lebt /
  andockt / etabliert / fehler) — Icon-Assets wiederverwendbar
- Tray-Menü: „Sage öffnen" / „Backup exportieren" / „Identität
  wechseln" / „Knoten beenden"
- **Modul-13-Bridge:** dieselbe wie für Extension (PWA-Code spricht
  beide an, je nach Umgebung)
- Update-Mechanismus: Tauri-Updater prüft signiertes JSON-Manifest

## 4. Verbindungen zu anderen Ankern

- **V2 (Onboarding) Pfad 3:** Mini-Browser **IST** Pfad 3. Pfad-3-Notiz
  ist Onboarding-Optik, Anker 8 ist Plattform-Architektur dahinter.
- **V4 (Königin-Relay):** Mini-Browser ist wahrscheinlichster
  Hintergrund-Empfänger für Königin-Mailbox-Polling.
- **V5 (Identitäts-Container):** Tauri hat Datei-System-Zugriff via
  Rust-Backend → wahrscheinlichster Träger für `.sbkim`-Backup-Datei-
  Verschlüsselung.
- **V6 (Multi-Identität):** Tray-Menü-Eintrag „Identität wechseln"
  zeigt Persona-Dropdown am System-Tray.
- **V7 (Extension):** komplementär — beide nutzen denselben
  Modul-13-Bridge.

## 5. Abgrenzung Anker 7 ↔ Anker 8

| Aspekt | Extension (V7) | Mini-Browser (V8) |
|---|---|---|
| Zielgruppe | Browser-Nutzer | Dedizierter-Knoten-Nutzer |
| Installation | Browser-Store, 1 Klick | Doppelklick-Installer |
| Identitäts-Speicher | Browser-IDB (Risiko bleibt) | App-Daten-Verzeichnis |
| Hintergrund-Empfang | Nein | Ja (Tray) |
| Mobile | Eingeschränkt (Kiwi) | Nein |
| Bau-Aufwand MVP | ~15-25 h | ~30-50 h |
| Neuer Stack | Manifest V3 (JS) | Tauri/Rust |

## 6. Größenordnung Anker 8

- Spec ~5-8 Stunden
- Bau Tauri-App MVP ~30-50 Stunden (Rust-Lernkurve)
- Cross-Platform-Build ~10-15 Stunden zusätzlich
- Code-Signing: Apple Developer ($99/Jahr), Windows-Zertifikat (~$200-400/Jahr, optional), Linux gratis
- Distribution: GitHub Releases + Tauri-Updater

## 7. Was eingetragen

- **`docs/PULS.md` § Vision-Anker** um achten Anker erweitert mit
  Konzept, Plattform-Tabelle, Architektur-Skizze, Verbindungen,
  Abgrenzung zu V7, Größenordnung, Status.
- **`docs/PULS.md` § Vision-Anker Anker 7 Status-Block** ergänzt um
  „komplementär zu Anker 8"-Hinweis.
- **`docs/PULS.md` § Vision-Anker Anker 2 Pfad 3 Tauri-Notiz** ergänzt
  um Verweis „Plattform-Architektur vertieft als Anker 8".
- **`docs/PULS.md` § Sitzungs-Einträge** neuer Top-Eintrag.
- **Dieses Übergabeprotokoll.**

## 8. Acht Vision-Anker jetzt im Repo

1. V1 — Sage als Hybrid-Knoten (Klaus' nächste Spec-Wahl)
2. V2-Ausbau — Niedrigeres Onboarding (drei gleichwertige Pfade,
   Pfad 3 mit Tauri-Notiz, vertieft in Anker 8)
3. Universum-Vision (umgesetzt PR #79 + #80)
4. Königin-Relay (Modul 13?) — Mailbox für offline-Geschwister
5. Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser
6. Multi-Identität in der IndexedDB
7. SBKIM-Browser-Extension („Lampe in der Toolbar") — PR #84
8. **Eigener Mini-Browser** (Tauri-App als dedizierter Knoten) — neu

## 9. Was NICHT angefasst

- Modul-Code, INTERFACES.md, Modul-Karten, Sage-Page, `status.json`
- Vision lebt rein in PULS, kein Code-Eingriff
- `update_puls_pie.py` NICHT aufgerufen

## 10. Branch-Anmerkung

Briefing dieser Sitzung nannte ursprünglich
`claude/bau-05-broadcastchannel-bridge-xVjoF`. PR #84 hatte diesen
Branch-Namen-Mismatch bereits dokumentiert und auf einen sprechenden
Pflege-Branch gewechselt. Diese Folge-Pflege nutzt analog
`claude/pflege-vision-anker-mini-browser`.

## 11. PULS-Zeilen-Status

Anker 8 + Sitzungs-Eintrag brachten PULS auf **3160 Zeilen**, über
der 3000er-Schutz-Klausel. Per Konvention „neue Sitzungen verschieben
den dann jeweils vorletzten in den Archiv-Index" wurde der
**PR-#84-Sitzungs-Eintrag** (Anker 7 Extension) ins Archiv-Index
ausgelagert. Sein Übergabeprotokoll
(`2026-05-18_mini-pflege-vision-anker-extension.md`) bleibt
unverändert; nur der PULS-Volltext-Block wurde durch eine Index-
Tabellen-Zeile ersetzt.

PULS jetzt **3093 Zeilen** — weiterhin knapp über der 3000er-Grenze.
Vorbestehendes Problem (PULS war vor dieser Sitzung bereits bei
2953 Zeilen), nicht durch diese Mini-Pflege verursacht. Empfehlung:
nächste Mini-Pflege lagert mehrere ältere Sitzungs-Einträge in
einem Rutsch ins Archiv aus, oder eine dezidierte Auslager-Sitzung
zwischendrin.

## 12. Sieben-vs-Acht-Wechsel

PR #84 schreibt noch „Sieben Vision-Anker stehen jetzt parallel im
Repo" — historisch korrekt zum Eintragungs-Zeitpunkt, basierend auf
Klaus' damaliger Entscheidung „Mini-Browser bleibt Notiz". Diese
Pflege revidiert das. PULS dokumentiert beide Stände transparent:

- Anker 7 Status-Block: ergänzt um „komplementär zu Anker 8"
- Anker 7 Schluss-Satz alter Wortlaut „Sieben Vision-Anker stehen
  jetzt parallel" wurde **nicht rückwirkend geändert** — er ist Teil
  des historischen Eintrags und entspricht dem damaligen Stand.
  Anker 8 trägt selbst die aktualisierte Gesamt-Summe „Acht Vision-
  Anker stehen jetzt parallel".

## 13. Nächster sinnvoller Schritt

Klaus entscheidet:

- **Spec-Sitzung V1 „Sage als Hybrid-Knoten"** — Brief liegt fertig in
  gestrigen Chat als kopierbarer Codeblock
- **Storage-Persist-Schutz-Mini-Pflege** (`navigator.storage.persist()`
  in `SbkimStorage.init()`) — adressiert Spore-Verlust 2026-05-17
- **Pause der Vision-Anker-Welle** (acht Anker reichen für eine Weile;
  V1-Spec hat höhere Priorität)
- **Anderes** — Klaus' Wunsch

## 14. Konvention für die übernächste Sitzung

Standard-Konvention beim `Befehl schreiben` (offene PRs auflisten,
Brief gegen `main`-Stand, Sektionen 0-7, Brief am Ende im
4-Backtick-Codeblock).

---

**Vorgänger:** Vision-Anker Extension (PR #84, gemerged als
`576fd6a` auf `main`). **Branch:**
`claude/pflege-vision-anker-mini-browser`.
