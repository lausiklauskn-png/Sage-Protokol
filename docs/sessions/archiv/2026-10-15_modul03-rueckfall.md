# 2026-10-15 · Modul 03: Rückfall auf HuggingFace — gebaut und netzweit verteilt

**Rolle:** Hauptsitzung (Fortsetzung nach Sammel-Brief Schritt 3).

## Anlass
Klaus' Tablet: „Can't create a session“ in In-and-Out-Book, Kim-sync, Kimboard (Modell von `family-projekt.de/models/`); Alis-Moderaum (HuggingFace) lädt. Termux: Server-Datei 118 308 185 Bytes, sha256 gleich dem `x-linked-etag` von HuggingFace. Inkognito lädt. Nach `caches.delete('transformers-cache')` lädt auch der normale Tab; die erste Spore des In-and-Out-Book entstand danach.

## Getan
| Repo | PR | was |
|---|---|---|
| Sage-Protokol | #1103 | Rückfall in Modul 03, Probe + Gegenprobe, INTERFACES §03, Komponenten-Karte, Kopien pinnwand/sbkim-bundle/-voll/such-tool, Cache pinnwand v27, such-tool v8 |
| Sage-Protokol | #1104 | Mein In-and-Out-Book im Mycel eingetragen (`sbkim/inoutbook_inbox.json` + Vermerk, NETZ-STAND, status.json), `verified-match` 0.917311 |
| 26 Träger | je 1 PR | Modul 03 byte-1:1 per `kanon-verteilen` (29 Kopien), Pins, Cache-Bump, `?v=` |
| Mein-In-and-Out-Book | #9 | zusätzlich neues Logo (Klaus), Favicon-Ring ≥ 3 px |
| Kim-sync | #20 | zusätzlich Cache-Pin der Probe auf v16 |

Träger: Alis-Moderaum #73 · Perfect-Skin-Beauty #73 · Perfect-Skin-Fashion #45 · Auslieferung-Pruefer #54 · Company-Brain #25 · family-project #360 · Jasons-Tresor #187 · Kim-Bell #73 · kim-hub-company #76 · Kim-sync #20 · Kimboard #153 · Kimseek #93 · Mein-In-and-Out-Book #9 · Mein-Mixarium #250 · Mein-Rezeptbuch #439 · Mein-Tresor #135 · Mein-WorkFloh #268 · Muttis-Rezeptbuch #244 · Privat-Brain #106 · PWA-Toolpoint #168 · SB-KIMTool-Point #187 · Sende-Pruefer #81 · Tomys-Hub #247 · Workflow-Calculate #22 · Workflow-Needs #19 · Workflow-PDF #116.

## Gemessen
- `smoke_bau03_rueckfall` 33 grün; Gegenprobe 9 gefangen · 0 blind (erst 1 blind: der echte Worker-Quelltext lief nie; die Probe führt ihn jetzt selbst aus). `smoke_bau03_worker` 15/15, `smoke_a6_offline_model_source` 21/21.
- Sage `run_alle`: rot nur `smoke_service_worker_parst`, auf `main` ebenso rot.
- Je Träger die eigenen Proben grün, bevor gepusht wurde. Vier Repos ohne `package.json` brauchten playwright-core/pdf-lib aus Nachbar-Klonen (vorher „nicht lauffähig“, nicht rot). Company-Brain/Privat-Brain brauchten den Workflow-PDF-Klon (`WFPDF_KLON`).
- Auf `main` nachgezählt: **29 von 29** Kopien byte-gleich mit dem Kanon (`2e31baa09a29`), erst danach die Zweige gehoben.

## Schief gelaufen / gefunden
- Ein reiner Quellenwechsel hätte nicht gereicht: transformers.js 2.17.2 fragt den Cache zuerst unter dem lokalen Pfad (`hub.js`, `tryCache`).
- In-and-Out-Book: Favicon-Ring 2 px vom neuen Logo eingefärbt (Wächter rot) → Ring ≥ 3 px. Manifest-Symbole standen noch auf `?v=8`, der Vorrat auf `?v=9` — der Verteiler zieht `manifest.json` nicht mit.
- Kim-sync: eine Probe nagelte die Cache-Version (`kimsync-v15`).
- PWA-Toolpoint: eine Layout-Zeile rot bei 151/180 s, einzeln auf Zweig und `main` je 780/0.

## Eingereiht
PFLEGE-LISTE § 16: „~30 MB“ im Andock-Wizard, gemessen 118 MB.

## Nicht gemessen
Tablet; ob der Rückfall in einem Browser mit verdorbenem Eintrag greift; Raum-Beitritt des In-and-Out-Book.

## Offen für Klaus
Kim-sync bleibt privat (sein Wort) — Vergleich mit Datei-Manager/Datei-Sender steht bei ihm. Sammel-Brief Schritt 4 (Gruppe C). Datei-Post (kein Ja).

## Spanne
Arbeitsbeginn am Zweig (Reflog) 14:06:59Z (Unix 1792073219), Ende 14:57:27Z (Unix 1792076247): **0 h 50 min**, in Unix-Zeit gerechnet. Davor lag die Fehlersuche mit Klaus am Tablet ab 12:58:50Z; sie hinterlässt keinen Commit.
