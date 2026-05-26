# SB-KIMTool-Point

**Externer SBKIM-Mycel-Hub.** Öffentliches Observatorium light für
Forker-PWAs jenseits von Klaus' [Sage-Protokol](https://github.com/lausiklauskn-png/Sage-Protokol).

## Was ist das?

SBKIM (Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel) ist
ein dezentrales Andock-Protokoll für progressive Web-Apps. Die
**Sage** pflegt die Spec; dieser **SB-KIMTool-Point** sammelt die
Forker — neue PWAs, die das Protokoll nutzen, ohne Klaus' Sage-Repo
mit fremder Inhalts-Domain zu fluten.

## Repo-Struktur

```
SB-KIMTool-Point/
├── README.md           # diese Datei
├── index.html          # Hub-Landing-Page (GitHub-Pages-fähig)
├── status.json         # Forker-Endknoten-Liste
├── sbkim/
│   └── spore.json      # Hub-Spore (Domain "Mycel-Hub")
├── modules/            # ausgewählte SBKIM-Module aus Sage
│   ├── 02_spore.js
│   ├── 17_floating_widget.js
│   └── 19_andock_wizard.js   # sobald gebaut (Phase B)
└── EINBAU.md           # Anleitung für Klaus / Maintainer
```

## Andock-Pfad für Forker

1. **PWA bauen** mit SBKIM-Modulen aus
   [Sage-Protokol](https://github.com/lausiklauskn-png/Sage-Protokol)
   (siehe Karte 09 § Einbau-PWA).
2. **Andock-Wizard öffnen** auf dieser Hub-Seite
   (sobald Modul 19 gebaut ist).
3. **Spore eintragen:** der Wizard erzeugt einen Pull-Request gegen
   `status.json`, mit Repo-URL + Domain + nodeId + Spore-URL.
4. **Maintainer reviewed** den PR (Klaus in Erst-Iteration, später
   Community-Maintainer-Liste).
5. **Live:** nach Merge erscheint die PWA auf der Hub-Liste.

## Pflege-Konvention

- **Keine PII** von Forkern (keine E-Mail-Adressen, kein Klar-Name).
- **Keine Spec-Spiegelung** — wer die Spec lesen will, geht zur
  Sage.
- **Keine Klaus-Endknoten** (Mein-Rezeptbuch / Mein-Mixarium / Sage
  selbst) im Default — die stehen in der Sage-`status.json`.
- **Kein Auto-PR-Merge** — jede Forker-Registrierung läuft durch
  Maintainer-Review.

## Spec-Quelle

Alle Modul-Verträge, Karten und heiligen Tafeln leben im
[Sage-Protokol-Repo](https://github.com/lausiklauskn-png/Sage-Protokol):

- [`docs/components/`](https://github.com/lausiklauskn-png/Sage-Protokol/tree/main/docs/components) — Module
- [`docs/INTERFACES.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/INTERFACES.md) — Verträge
- [`docs/components/_mycel_hub.md`](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/components/_mycel_hub.md) — Hub-Konzept-Karte

## Lizenz

MIT (analog Sage-Protokol).
