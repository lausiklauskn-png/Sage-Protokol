# Mini-Pflege 2026-05-18 — Vision-Anker Extension („Lampe in der Toolbar") + Mini-Browser-Konkretisierung

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker-extension`. Klaus' zweite Vision-Pflege
desselben Tages (parallel zu Anker 6 Multi-Identität, PR #83).

---

## 1. Was geschah

Klaus hat heute Morgen zwei verwandte Browser-Identifikations-Schicht-
Visionen geäußert:

1. **Vision A — „Lampe in der Toolbar":** ein kleines Tool, das jeder in
   seinem Browser oben in der Navigationsleiste installiert. Zwei Lampen:
   Status (Spore lebt, empfangsbereit) und Aktivität (Handshake-Phasen).
2. **Vision B — eigener Mini-Browser:** Standalone-App mit eigener
   IndexedDB, läuft im Hintergrund, unabhängig von Chrome. Klaus' Bild:
   „eigener kleiner Browser, von dem aus die Kommunikation startet …
   muss nicht groß oder komplex sein."

Per AskUserQuestion (zwei Klärungs-Fragen):

- **Anker-Form:** „Nur Anker 7 (Extension)" — Mini-Browser bleibt in
  Anker 2 Pfad 3 (existiert dort schon als „Eigener Browser-Wrapper als
  Fern-Vision") und bekommt eine Notiz-Konkretisierung, kein eigener
  Anker 8.
- **Onboarding-Pfad:** „Alle drei Pfade gleichwertig" — Wizard,
  GitHub-Generator, Mini-Browser sind drei Optionen, Karte 09 zeigt
  alle drei, Interessent wählt selbst.

## 2. Konzept — Anker 7 Extension

- **Manifest V3** mit Toolbar-Icon, `background.service_worker`,
  `externally_connectable` für Sage-PWA-Origin.
- Toolbar-Icon-Varianten für Status × Aktivität (aus, lebt, andockt,
  etabliert, fehler).
- **Modul 13 „Extension-Bridge"** (neu zu spezifizieren) sendet
  Status-Updates aus der PWA an die Extension, wenn vorhanden;
  degradiert sauber, wenn nicht installiert.
- **Popup HTML** für detaillierte Ansicht: Geschwister-Liste,
  Handshake-Log, Backup-Export, Identitäts-Wechsler (V6-Verbindung).
- **Storage:** `chrome.storage.local` für UX-State — **keine
  Identitäts-Schlüssel**. Identität bleibt in PWA-IndexedDB.

**Plattform-Ehrlichkeit:** Desktop-Browser (Chrome, Firefox, Edge,
Brave, Opera, Safari) ja. **Mobile-Browser nein** — Klaus' eigenes
DeX-/Tablet-Chrome-Setup bleibt außen vor. Kiwi Browser auf Android
als Workaround.

## 3. Notiz — Anker 2 Pfad 3 (Mini-Browser-Konkretisierung)

Tauri-Stack (Rust + System-WebView):

- ~10-30 MB Binaries für Windows/macOS/Linux aus einer Codebase
- Schlanker als Electron (~80-200 MB)
- Eigene IndexedDB im App-Daten-Verzeichnis → kein Browser-
  Reklamations-Risiko (löst Lehre 1 + Spore-Verlust 2026-05-17)
- Tray-Icon-Modus für Hintergrund-Empfang (Antwort auf Anker 4
  Königin-Frage „wer empfängt, wenn der Tab zu ist")
- Doppelklick-Installer (`.msi` / `.dmg` / `.AppImage`)
- Onboarding-Bild: 1 Klick → Tray-Icon → empfangsbereit, ~2 Min
- **Mobile außen vor** (Tauri Desktop-only; für Android/iOS bräuchte
  es Capacitor, separate Initiative)

## 4. Drei gleichwertige Onboarding-Pfade

Karte 09 / Sage-Page zeigt alle drei als Optionen:

| Pfad | Beschreibung | Zeit | Voraussetzung |
|---|---|---|---|
| 1 — Wizard | Im Sage-PWA-Browser geführt | ~5-8 Min | Beliebiger Browser |
| 2 — GitHub-Generator | Eigene Pages-URL | ~10-15 Min | GitHub-Account |
| 3 — Mini-Browser | Tauri-App, eigene IndexedDB | ~2 Min | Desktop-OS |

## 5. Was eingetragen

- **`docs/PULS.md` § Vision-Anker** um siebten Anker erweitert mit
  Konzept, Plattform-Tabelle, Architektur-Skizze, Verbindungen,
  Abgrenzung zu Mini-Browser, Status.
- **`docs/PULS.md` § Vision-Anker Anker 2 Pfad 3** Notiz-Anhang
  „2026-05-18 · Konkretisierung Mini-Browser-Pfad (Tauri)".
- **`docs/PULS.md` § Sitzungs-Einträge** neuer Top-Eintrag.
- **Dieses Übergabeprotokoll.**

## 6. Sieben Vision-Anker jetzt im Repo

1. V1 — Sage als Hybrid-Knoten
2. V2-Ausbau — Niedrigeres Onboarding (drei gleichwertige Pfade,
   Pfad 3 mit Tauri-Konkretisierung 2026-05-18)
3. Universum-Vision (umgesetzt PR #79 + #80)
4. Königin-Relay (Modul 13?)
5. Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser
6. Multi-Identität in der IndexedDB
7. **SBKIM-Browser-Extension** („Lampe in der Toolbar") — neu

## 7. Was NICHT angefasst

- Modul-Code, INTERFACES.md, Modul-Karten, Sage-Page, `status.json`
- Vision lebt rein in PULS, kein Code-Eingriff
- `update_puls_pie.py` NICHT aufgerufen

## 8. Branch-Anmerkung

Briefing nannte `claude/bau-05-broadcastchannel-bridge-xVjoF` — dieser
Branch existiert aber schon mit einem Bau-05-Commit (`011fa2f Bau
Modul 05: BroadcastChannel-Bridge`), unzusammenhängend mit der
Vision-Anker-Pflege. Per AskUserQuestion entschied Klaus für einen
sprechenden Pflege-Branch `claude/pflege-vision-anker-extension`,
analog zu den vorigen Vision-Anker-Pflege-PRs.

## 9. Nächster sinnvoller Schritt

Klaus entscheidet:

- **Spec-Sitzung V1 „Sage als Hybrid-Knoten"** — Brief liegt fertig in
  gestrigen Chat als kopierbarer Codeblock
- **Storage-Persist-Schutz-Mini-Pflege** (`navigator.storage.persist()`
  in `SbkimStorage.init()`) — adressiert Spore-Verlust 2026-05-17
- **Weitere Vision-Anker-Pflege** bei neuer Schlaf-Klarheit (Klaus hat
  heute schon zwei nachgereicht — Multi-Identität + Extension; weitere
  möglich)
- **Anderes** — Klaus' Wunsch

## 10. Konvention für die übernächste Sitzung

Standard-Konvention beim `Befehl schreiben` (offene PRs auflisten,
Brief gegen `main`-Stand, Sektionen 0-7, Brief am Ende im
4-Backtick-Codeblock).

---

**Vorgänger:** Vision-Anker Multi-Identität (PR #83 in
`origin/main` als `cf6a73e`). **Branch:**
`claude/pflege-vision-anker-extension`.
