# Mini-Pflege 2026-05-17 — Vision-Anker Königin-Relay (Modul 13?)

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker-koenigin-relay`. Folge zur Cursor-Variante
(PR #81 `047294b`) und allen Universum-Sitzungen heute.

---

## 1. Was geschah

Spät am Abend, nach erfolgreichem Universum-Bau und Lehre-8-Befund,
stellte Klaus die **fundamentale Architektur-Frage**:

> Was, wenn ich einmal einen Browser nehme und ein andermal einen
> anderen? Ist die Spore nur zu finden, wenn der Browser offen ist?
> Ist sie empfangsbereit, wenn der Browser nicht geöffnet ist?

Die ehrliche Antwort berührt das **Empfangsmodus-Prinzip des SBKIM-
Papers** („Wer nicht da ist, schweigt"). Browser-PWAs haben drei
fundamentale Grenzen:

1. **Pages leben nur solange Tabs offen sind** — kein Empfang bei
   geschlossenen Tabs.
2. **Service-Worker werden nach Stunden suspendiert** — temporärer
   Hintergrund-Empfang, aber nicht dauerhaft.
3. **IndexedDB ist pro Browser-Instanz** — Browser-Wechsel = neue
   Identität (außer manueller Backup-Import via Modul 02).

Das ist konzeptuell sauber für ein peer-to-peer Mycel, aber eine
**harte Grenze für Verbreitung** außerhalb des Klaus-Kreises. Wer
nur „mal vorbeischauen" will, kann sich nicht im Mycel halten.

## 2. Klaus' Bild — Königin wie bei Bienen

Königin als **Bezugspunkt, nicht Daten-Eigentümer.** Übertragen auf
SBKIM: ein **„Königin-Relay" als optionales neues Modul** (möglicherweise
Modul 13).

### Modell

- Königin ist eine **Mailbox** für Geschwister.
- Speichert **nicht** private Schlüssel — nur **verschlüsselte
  Handshake-Envelopes** (Public-Key-Verschlüsselung mit dem
  Empfänger-publicKey, sodass nur dieser sie öffnen kann).
- Wenn Knoten A handshaken will mit B, und B ist offline → A schickt
  verschlüsselten Envelope an die Königin → Königin hält ihn fest →
  B kommt nächstes Mal online → fragt bei der Königin „Post für
  mich?" → bekommt den Envelope → entschlüsselt mit eigenem privaten
  Schlüssel → antwortet.
- **Privacy gewahrt:** Königin sieht nur verschlüsselte Daten,
  nicht den Inhalt.
- **Optional:** Knoten ohne Königin-Anbindung funktionieren wie
  bisher (direkter Channel-Bridge, same-instance).
- **Mehrere Königinnen möglich** → kein Single Point of Failure.
  Knoten registriert sich bei `N` Königinnen seines Vertrauens.

### Implementations-Optionen

1. **Server-Königin:** Node.js / Python / Go-Server, klassische
   Backend-Architektur.
2. **PWA-Königin mit Push-API:** browserseitige Königin, läuft im
   Service-Worker mit WebPush-Notifications. Komplexer, aber
   serverlos auf manchen Hostern.
3. **Eigenes-Gerät-Königin:** Klaus' Raspi zuhause mit immer-online
   Status.

### Trade-offs

- **Privacy-Annahmen:** Königin kann Metadaten sammeln (wer schreibt
  wann an wen). Kein perfektes Privacy-Modell, aber besser als
  zentraler Server mit Klartext.
- **Hosting-Frage:** wer betreibt Königin-Knoten? Vertrauen + Geld.
- **Implementations-Aufwand:** signifikant, vermutlich >50 Stunden für
  initiale Spec + Bau + Königin-Implementierung.

## 3. Was eingetragen

- **`docs/PULS.md` § Vision-Anker** um vierten Anker erweitert:
  „Königin-Relay (Modul 13?) — Mailbox für offline-Geschwister" mit
  voller Modell-Beschreibung, drei Implementations-Optionen,
  Anknüpfung an V1, Trade-offs, Status.
- **`docs/PULS.md` § Sitzungs-Einträge** neuer Top-Eintrag mit
  Verweis auf diesen Vision-Anker.
- **Dieses Übergabeprotokoll.**

## 4. Reihenfolge der Visionen jetzt

1. **V1 — Sage als Hybrid-Knoten** (Klaus' explizite nächste Spec-
   Wahl, PR #78)
2. **V3-Ausbau — Niedrigeres Onboarding** (langfristiger Plan,
   PR #78)
3. **Universum-Vision** (umgesetzt in PR #79 + Lehre 8 in #80)
4. **Königin-Relay (Modul 13?)** — neuer Anker, wartet auf V1-
   Erfahrung + IndexedDB-Persist-Schutz-Praxis
5. **Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser**
   — fünfter Anker, vier Konzept-Pfade (Datei-Backup-UX, Hardware-
   Wallet/WebAuthn, Passkey-Sync, Mini-Browser kombiniert mit V3).
   Klaus' Folge-Frage: „mitgeführte eigene Mini-Browser-Version oder
   Rucksack/Safe/Chipkarte mit der ich mich beim Aufwachen oder
   Anmelden neu identifiziere".

## 4a. Verbindung Königin-Relay ↔ Identitäts-Container

Beide Anker lösen unterschiedliche Probleme:

- **Königin-Relay:** „Wie empfange ich, wenn der Browser nicht offen
  ist?" → Mailbox-Modell, verschlüsselte Envelopes bei einem
  Hub-Knoten zwischengelagert
- **Identitäts-Container:** „Wie nehme ich meine Identität von Browser
  A zu Browser B mit?" → Datei / Hardware / Sync

Sie können kombiniert werden: Klaus' Identität liegt als Backup-Datei
(Rucksack), er importiert sie bei jedem neuen Browser-Anmeldung, und
seine Königin (Mailbox) hat die ausstehenden Handshakes für ihn parat.

## 5. Was NICHT angefasst

- Modul-Code, INTERFACES.md, Modul-Karten.
- Sage-Page (`index.html`) — die Vision lebt rein in PULS.md, kein
  Code-Eingriff.
- `status.json` — Visionen sind keine Modul-Stände.
- `update_puls_pie.py` NICHT aufgerufen.

## 6. Nächster sinnvoller Schritt

**Pause / Schlaf.** Klaus hatte einen Marathon-Tag (PR #75 → #76 →
#77 → #78 → #79 → #80 → #81 → #82). Diese Vision verdient frischen
Kopf, nicht müde Architektur-Entscheidungen.

Morgen:

- Optional: Mini-Pflege „Storage-Persist-Schutz" (`navigator.storage
  .persist()` in `SbkimStorage.init()`)
- Optional: Spec-Sitzung „Sage als Hybrid-Knoten (Variante I)"

## 7. Konvention für die übernächste Sitzung (IMMER drinhalten)

Wenn Klaus am Sitzungsende der **Folge-Sitzung** `Befehl schreiben`
tippt, formuliert die Folge-Sitzung **vor** dem Brief:

1. **Offene PRs auflisten** in Sage-Protokol.
2. **Pro PR eine Einordnung** (mergen / schließen / lassen).
3. **Den Brief gegen `main`-Stand schreiben**.
4. **Bei mehreren offenen PRs** Merge-Empfehlung vor dem Brief.

Brief-Stil sachlich, ohne Imponiergehabe, mit konkreten Datei-/
Zeilen-Referenzen.

**Pflicht am ENDE des Briefs:** Vollständiger Brief NOCHMAL in einem
einzigen kopierbaren Markdown-Codeblock (Outer-Fence mit vier
Backticks).

---

**Vorgänger:** Cursor-Variante (PR #81, `047294b`); Observatorium-
Lehre 8 + 8. Galaxie (PR #80); Bau Browser-Observatorium-Universum
(PR #79); Vision-Anker V1 / V3 / Universum (PR #78); Live-Channel-
Handshake + Browser-Observatorium (PR #77); Bau BroadcastChannel-
Bridge (PR #75).

**Branch:** `claude/pflege-vision-anker-koenigin-relay`.
