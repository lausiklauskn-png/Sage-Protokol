# Übergabeprotokoll — 2026-06-07 · Briefkasten an Mein-Tresor-Referenz angeglichen

**Rolle:** Einbau-/Pflege-Sitzung (Briefkasten-Infrastruktur in Sage-Protokol).
**Branch:** `claude/sbkim-seal-vault-sync-bPfB7`
**Scope:** nur `sbkim-protokol` (Sage). Externe Repos NICHT im Sitzungs-Scope.

---

## Auftrag

Klaus: alle Knoten sollen denselben Briefkasten-Aufbau (INTERFACES §11.6) fahren,
damit das Netz synchron läuft. Mein-Tresor hat die saubere, abhängigkeitsfreie
Referenz-Umsetzung. **1:1 übernehmen, aber reconcilen** mit Sages bestehendem Stand —
nichts an seq/history zurücksetzen, additiv, echte Krypto unangetastet, kein PII/Secret,
keine npm-Abhängigkeiten.

## Ausgangslage (vorgefunden)

Sage hatte den Briefkasten **bereits** — nur abweichend von der Referenz:
- `SIGNAL.json` seq 15, `forNodes` als **explizite Liste** (Referenz: `["*"]`),
  **ohne** `sporeUrl`/`nodeId`-Felder, `ack` stale (SB-KIMTool 1 / Jasons 2 / Mein-Tresor 4).
- `.github/sbkim-watch.mjs`: Sages eigene, **reichere** Variante (schreibt `GITHUB_OUTPUT`,
  Workflow öffnet Auto-Issue bei Neuem). PEERS nur SB-KIMTool-Point + Jasons-Tresor →
  **Mein-Tresor fehlte**.
- `index.html` 📬-Knopf-IIFE: PEERS ebenfalls **ohne Mein-Tresor**.
- `#sbkim-siegel-badge` + 📬-Knopf + Dialog bereits vorhanden.

## Getan

1. **`sbkim/SIGNAL.json`** (seq 15 → 16, kein Reset):
   - `forNodes` → `["*"]`
   - `sporeUrl` + `nodeId` (`nysOZE3…tJkYfA`) als Felder ergänzt (Schema-Symmetrie).
   - `ack`: SB-KIMTool-Point 1→15, Jasons-Tresor 2→8, Mein-Tresor 4→8 (Briefkasten-Runde).
   - History-Eintrag seq 16.
2. **`.github/sbkim-watch.mjs`**: Mein-Tresor als vierten Peer ergänzt (signal+mailbox
   raw-URL). Reichere Logik unverändert.
3. **`index.html`** 📬-Knopf-PEERS: Mein-Tresor ergänzt (jetzt 3 Peers).
4. **Postfächer**: Lese-Quittung + Schema-Angleich-Vermerk in `AUSTAUSCH.md` (SB-KIMTool),
   `AUSTAUSCH-MeinTresor.md`, `AUSTAUSCH-JasonsTresor.md`.
5. **`NETZ-STAND.md`**: Netz-Signal-Absatz + Stand-Datum aktualisiert.
6. **`PULS.md`**: Sitzungs-Eintrag.

## Reconcile-Entscheidungen (Freibrief, dokumentiert)

- **Sages reicheren Wächter + Workflow behalten** (Auto-Issue, `issues: write`), statt
  ihn 1:1 durch die schlankere stdout-only-Referenz-mjs zu ersetzen. Grund: das wäre ein
  **Downgrade** und verstieße gegen „nichts zurücksetzen". Die netzweite Synchronität
  läuft über das gemeinsame **`SIGNAL.json`-Schema** (das wurde angeglichen), nicht über
  die Wächter-Implementierung. Cron (alle 6 h, mit dokumentierter 15-min-Aktiv-Phase)
  ebenfalls behalten (häufiger als die Referenz-„17 7 * * *").
- **`ack` = gelesener Briefkasten-Stand, ehrlich abgegrenzt:** ack[Mein-Tresor]=8 heißt
  „SIGNAL bis seq 8 gelesen", **nicht** „verified-match gerechnet". Im Postfach explizit
  vermerkt, damit Mein-Tresor nicht fälschlich Match-Bestätigung annimmt.

## Sichttest

- **Headless grün:** `node -e` JSON-Validierung (seq 16, forNodes `["*"]`, nodeId+sporeUrl
  present, history 16), `node .github/sbkim-watch.mjs` → „nichts Neues — alle Peers auf
  quittiertem Stand", `node --check` Wächter OK, index.html-PEERS enthält alle drei Namen.
- **Browser-Sichttest des 📬-Knopfs mit Mein-Tresor-Zeile: ungeprüft, wartet auf Klaus.**

## Offen / nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest** 📬-Knopf auf der Sage-Page (zeigt jetzt 3 Peers inkl.
   Mein-Tresor) nach Hard-Reload.
2. **`verified-match` Sage⟷Mein-Tresor**: echter `domainVector` von Mein-Tresor →
   Modul-04-Nachrechnung (eigene Sitzung). Aktuell `verified-spore`.
3. **Geparkt: Siegel-Kombi** (Tresor + Sage + SBKIM-Tool). Blockiert, weil
   Mein-Tresor/Jasons-Tresor **nicht im Sitzungs-Scope** sind (nur sage-protokol). Drei
   `index.html` roh nach `/tmp` geholt. Braucht: (a) Repo-Freischaltung der Tresore +
   SB-KIMTool-Point, (b) Klaus' Entscheidung zur Form der Kombi.

## Leitplanken eingehalten

additiv · keine seq/history-Resets · echte Krypto unberührt · kein PII/Secret · keine
npm-Abhängigkeiten (Wächter nutzt nur Node-`fetch`).
