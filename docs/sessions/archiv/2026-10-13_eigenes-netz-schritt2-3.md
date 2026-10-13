# Übergabe 2026-10-13 · Eigenes Netz Schritt 2+3

**Sitzung:** https://claude.ai/code/session_01GtKEi91QFcvK8vUSwJ94tQ · Zweig `ccr-08329384-c8raun`
**Spanne (Reflog/Merges):** 14:58Z – 15:27Z am Code, dazu Doku danach.

## Getan
| Repo | PR | was |
|---|---|---|
| Sage-Protokol | #1075 | 23-UI-Einstellung „Netz“ (Box, Beitritts-Link mit Rückfrage, Zurück, Auto-Verbinden), INTERFACES, Bündel |
| family-project | #355 | Einrichte-Werkzeug für das interne Relais `relay-intern.family-projekt.de` |
| Sende-Pruefer | #76 | erster Träger: 05b, 23 und 23-UI byte-1:1, Cache v66 |

## Gemessen
| Probe | Ergebnis |
|---|---|
| smoke_netz_ui | 44 grün |
| gegenprobe_netz_ui | 9 gefangen · 0 blind · 0 tot |
| smoke_relais_intern | 21 grün |
| gegenprobe_relais_intern | 9 gefangen · 0 blind · 0 tot |
| Sende-Prüfer npm test | 675 grün |

## Nicht gemessen
- echter Server
- echtes Relais
- Tablet

## Klaus' Antworten (verbindlich)
- Weitergabe per Link, sonst QR oder von Hand.
- Die Mycel-Karte merkt sich den Code nur auf eigenen Rechnern im Firmennetz.
- Keine Schlüssel-Liste auf dem Relais.
- Dazu kommen In-and-Out-Book, Company Brain und Kimboard.

## Offen
Siehe den Brief [`BRIEF_2026-10-13_eigenes-netz-schritt4.md`](../../BRIEF_2026-10-13_eigenes-netz-schritt4.md).
