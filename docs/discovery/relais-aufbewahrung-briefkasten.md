<!-- Notiz (Klaus 2026-07-11): Relais-Aufbewahrung als Deckel des A12-Briefkastens.
     Reine Logik/Empfehlung — die eigentliche Umsetzung liegt auf Klaus' VPS
     (nicht im Repo änderbar). Nicht ohne Klaus' Wort verlinken/veröffentlichen. -->

# Relais-Aufbewahrung — der einzige echte Deckel des Briefkastens (A12)

**Ausgangslage.** Der A12-Briefkasten (server-lose Cross-Knoten-Frage) lebt über
das Relais. Eine Frage/Antwort überlebt eine Zeitverzögerung nur so lange, wie
das **Relais** das Ereignis **aufbewahrt**. Der lokale Briefkasten (Browser) ist
bereits geregelt (Auto-Aufräumen, TTL-Ablauf, Kappung, „🔄 nochmal fragen",
„🗑 leeren" — Modul 23 UI). **Der verbleibende Deckel ist die Relais-Aufbewahrung.**

## Was fest steht (ehrlich)

- **Das Relais ist selbst-gehostet:** `wss://relay.family-projekt.de` — Klaus'
  eigene Domäne, Hetzner-VPS (CX23), **nostr-rs-relay** hinter **Caddy** (Docker,
  `logging:none`). Beleg: `docs/discovery/notiz-toolpoint-relay.md`.
- **Damit ist die Aufbewahrung Klaus' Konfig-Sache** (auf dem VPS), **nicht** aus
  einem Repo heraus umstellbar und **nicht** vom Browser-Client erzwingbar
  (ein „lösch das nach dem Lesen" vom Client ist bei Nostr unzuverlässig).

## Das Aufbewahrungs-Verhalten von nostr-rs-relay

- nostr-rs-relay **behält Ereignisse** in seiner SQLite-DB — es gibt **keine**
  starke, standardmäßige **zeitbasierte** automatische Löschung. Praktisch:
  - **Gut für den Briefkasten:** Briefe liegen lange → eine offline gestellte
    Frage wird auch nach Stunden/Tagen noch gefunden (sofern der Antworter in der
    Zeit online geht — client-seitig deckelt das ohnehin der 30-min-Lookback beim
    Antworter, siehe unten).
  - **Preis:** die DB **wächst** mit der Zeit. Bei Klaus' **kleinem Netz**
    (wenige Knoten, wenige Fragen/Tag) ist das Wachstum **vernachlässigbar**
    (Kilobytes/Tag) — Überfüllung ist real erst bei großem, fremdem Verkehr ein
    Thema (Marktplatz-Skalierung).

## Zusammenspiel mit dem Client-Deckel (schon gebaut)

- **Antworter-Lookback = 30 min** (`RDV_ANSWER_LOOKBACK_SEC`, Modul 23): der
  Antworter holt beim Einschalten Fragen der **letzten 30 min** nach. Eine Frage,
  die älter ist, wird von einem *neu* online gehenden Antworter **nicht** mehr
  gefangen — unabhängig davon, wie lange das Relais sie noch hält.
- **Lokaler TTL = 45 min** (`RDV_MAILBOX_OPEN_TTL_MS`): danach zeigt der Frager
  die Frage als „abgelaufen" (mit „🔄 nochmal fragen").
- **Fazit:** solange das Relais **mindestens ~1 h** aufbewahrt, ist der
  Briefkasten voll funktionsfähig. nostr-rs-relay hält deutlich länger → **die
  aktuelle Aufbewahrung reicht für den Briefkasten bereits aus.** Es besteht
  **kein akuter Handlungsbedarf** gegen „zu kurz".

## Empfehlung (gegen langfristige Überfüllung — Klaus' VPS)

Nur nötig, wenn die DB spürbar wächst (großer/fremder Verkehr). Zwei saubere Wege:

1. **Prune-Cron auf dem VPS (einfach, robust):** ein wöchentlicher Cron, der
   Ereignisse älter als z. B. **30 Tage** aus der SQLite löscht (bzw. `strfry`/
   `nostr-rs-relay`-Bordmittel zum Kompaktieren). Behält den Briefkasten großzügig,
   hält die DB klein. **Empfohlener Default: 30 Tage.**
2. **NIP-40-Ablauf-Tags am Client (sauberste, client-getrieben):** die
   `sbkim-qry`-Frage-/Antwort-Ereignisse bekommen einen `["expiration", <unix>]`-
   Tag (z. B. +7 Tage). Relais, die **NIP-40** unterstützen, löschen sie dann
   automatisch nach Ablauf. **Harmlos, wenn das Relais NIP-40 ignoriert** (nur ein
   zusätzlicher Tag). — Das ist der **einzige** Aufbewahrungs-Hebel, den man aus
   dem Code ziehen kann; er ist **noch NICHT gebaut** (bewusst: er berührt den
   Publish-Pfad in Modul 23/05b und bräuchte einen netzweiten Byte-Rollout — als
   Folge-Schritt sinnvoll, wenn Marktplatz-Verkehr wächst).

## Marktplatz-Blick (family-projekt.de)

Für fremde Nutzer/Marktplatz-Skalierung wird die Relais-Aufbewahrung relevanter:
- **NIP-40-Ablauf (Weg 2)** ist dann der sauberste Selbstschutz — jeder Brief
  trägt sein eigenes Verfallsdatum, das Relais bleibt schlank ohne manuellen Cron.
- Kombiniert mit dem lokalen Briefkasten-Lebenszyklus (schon gebaut) ist das Netz
  dann in **beide** Richtungen gegen Überladung geschützt: Client (lokal) **und**
  Relais (Ablauf-Tag).

## Nächster konkreter Schritt

- **Kurzfristig:** nichts nötig — die Aufbewahrung reicht für den Briefkasten.
- **Bei Bedarf (Wachstum/Marktplatz):** entweder Prune-Cron auf dem VPS (30 Tage)
  **oder** NIP-40-Ablauf-Tags im Client bauen (client-seitig, netzweiter Rollout).
  Beides ist Klaus' Entscheidung; der Code-Weg (NIP-40) ist auf Zuruf baubar.
