# Modul 11 — Rate-Limit & TTL

**Status:** Stub (spec ausstehend)
**Priorität:** niedrig — wird gezogen, sobald spürbares Wachstum messbar wird
**Datei (Code):** `src/modules/11_rate_limit.js` (existiert noch nicht)
**Abhängigkeiten:** Querschnitt — wirkt auf 05 (Anastomose), 06 (Heterokaryose)

**Anker:** Diese Karte ist Teil des Schutz-Backlogs, sichtbar in der
Eigenschutz-Karte (Karte 13) der Observatorium-Page. Siehe auch
`docs/PULS.md` Abschnitt "Schutz-Backlog".

---

## Zweck

Querschnitts-Mechanik gegen Flooding und endlose Anastomose-Ketten. Pro-Peer
Rate-Limit auf eingehende Anfragen, globaler TTL/Hop-Limit auf weitergereichte
Suchen. Verhindert, dass:

- ein einzelner Peer durch hohe Anfragefrequenz Ressourcen frisst,
- eine Anfrage endlos im Mycel kreist (Anastomose-Loop),
- ein Angreifer das Netz mit teuren Embedding-Berechnungen lähmt.

---

## Bekannte offene Fragen

1. **Algorithmus.** Token-Bucket pro Peer (Rate + Burst) oder einfacher
   Sliding-Window-Counter? Token-Bucket ist standardisiert, aber
   speicheraufwendiger; Sliding-Window ist einfach, aber gröber.
2. **TTL-Modell.** Feste Zahl Hops (z.B. 4) oder adaptive Funktion der
   bekannten Mycel-Größe? Adaptiv ist eleganter, braucht aber zuverlässige
   Größenschätzung — die SBKIM bewusst nicht hat.
3. **Persistenz.** Wie verhält sich der Counter beim Page-Reload? IndexedDB-
   persistent (Modul 01) hält länger durch, ist aber schwer zu testen.
   Session-flüchtig ist trivial, aber öffnet Tür für Reload-Bypass.
4. **Verteiltes Flooding.** Erkennt der Empfänger, wenn ein Sender
   systematisch unterhalb der Schwelle bleibt, aber von vielen Identitäten
   gleichzeitig anfragt? Das ist Sybil-Erkennung und überlappt mit Modul 10
   (Reputation).
5. **Backpressure-Signale.** Wenn ein Knoten überlastet ist, soll er
   stilles Drop oder explizites Throttling-Signal zurückgeben? Stilles
   Drop ist sicherer (verrät keine Last-Info), Signal ist netter
   (Sender weiß Bescheid).

---

## Verantwortung (Skizze)

**Macht (geplant):**
- Pro-Peer-Counter in IndexedDB führen (Sliding-Window oder Token-Bucket)
- Beim Eingang einer Query: prüfen, ob Peer im Limit, sonst Drop
- Beim Weiterreichen einer Query: TTL inkrementieren / dekrementieren,
  bei TTL=0 Stop
- Pro-Knoten-Gesamtlast überwachen (CPU/Memory grob)

**Macht nicht (geplant):**
- Kein Reputations-Update (das ist Modul 10)
- Keine harten Sperren (das ist Modul 12)
- Kein User-Rate-Limit innerhalb des Endknotens (das ist Sache der
  Endknoten-PWA selbst, nicht des SBKIM-Moduls)

---

## Beispiel-Default (vorläufig, kann sich ändern)

```
QUERY_RATE_PER_PEER_PER_MIN = 30
QUERY_BURST                  = 10
HETEROKARYOSE_RATE_PER_DAY   = 4
ANASTOMOSE_TTL_MAX_HOPS      = 4
LOCAL_CPU_THRESHOLD_PERCENT  = 80   # ab hier Drop ohne Antwort
```

---

## Querverweise

- `sbkim_paper.pdf` Kap. 22 (Sicherheitsmodell, Skalierungsanalyse)
- `docs/INTERFACES.md` Abschnitt 0 (`QUERY_TIMEOUT_MS`)
- `docs/components/05_anastomose.md` (Hop-Logik)
- `docs/components/10_reputation.md` (überlappt bei Sybil-Erkennung)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-10 | Observatorium | Schutz-Backlog, Anker zu Karte 13 |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
