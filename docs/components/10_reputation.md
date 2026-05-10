# Modul 10 — Reputation

**Status:** Stub (spec ausstehend)
**Priorität:** niedrig — wird gezogen, sobald spürbares Wachstum messbar wird
**Datei (Code):** `src/modules/10_reputation.js` (existiert noch nicht)
**Abhängigkeiten:** 06 (Heterokaryose), 02 (Spore)

**Anker:** Diese Karte ist Teil des Schutz-Backlogs, sichtbar in der
Eigenschutz-Karte (Karte 13) der Observatorium-Page. Siehe auch
`docs/PULS.md` Abschnitt "Schutz-Backlog".

---

## Zweck

Knoten-Reputation aufbauen, sodass wiederholt schlechte Treffer-Lieferanten
nicht nur per Apoptose lokal vergessen werden, sondern aktiv abgewertet
werden, bevor das Mycel sie aus der Spore-Liste eines neu andockenden
Knotens propagiert.

**Wichtig:** Der biologische Hauptmechanismus liegt bereits in Modul 07
(Apoptose mit signiertem Vermächtnis, Paper Kap. 16). Eine kompromittierte
oder bösartig erkannte Spore erzeugt vor dem Sterben ein signiertes
Vermächtnis mit `suspected_node_id`. Diese Vermächtnisse verbreiten sich
über Heterokaryose. Mehrere ähnliche Vermächtnisse → Quorum (Paper §17,
`QUORUM_RATIO = 0.15`) → emergente Misstrauensliste. Forensische Kette
ohne zentrale Instanz.

Modul 10 ist also nicht der Reputations-Mechanismus selbst, sondern eine
**formal-quantitative Ergänzung**: numerische Scores statt binärer
Misstrauensliste, Decay-Funktion, optionales Gossip ohne Apoptose-
Auslöser. Es schließt die Lücke zwischen "alles gut" und "Knoten muss
sterben" — die Grauzone, in der ein Peer schlechter wird, aber noch
nicht bösartig genug ist, um sich selbst aufzulösen.

Apoptose (Modul 07) löscht passiv lokal und meldet bei Kompromittierung.
Heterokaryose (Modul 06) verbreitet Vermächtnisse. Reputation (Modul 10)
soll dazwischen **kontinuierlich abgestuft** sein: Wenn Knoten A bemerkt,
dass Knoten X durchgängig schwache Treffer liefert (aber nicht bösartig
ist), soll diese Bewertung — vorsichtig, signiert, mit Decay —
Heterokaryose-tauglich weitergegeben werden, damit Knoten C nicht
denselben Müllweg erst selbst durchlaufen muss.

---

## Bekannte offene Fragen

1. **Eigenständig oder in Modul 06?** Wandert das in Modul 06 (Heterokaryose)
   als erweiterte Tausch-Logik, oder wird es ein eigenständiges Modul mit
   eigenen Stores?
2. **Reputations-Berechnung.** Gleitendes Mittel über Treffer-Qualität?
   Welcher Zeit-Decay (linear, exponentiell)? Wie wird "Treffer-Qualität"
   überhaupt operationalisiert — implizit durch Klick-Verhalten des
   Nutzers oder explizit durch Bewertungs-API?
3. **Lokale vs. geteilte Reputation.** Lokale Bewertung (jeder Knoten für
   sich) ist trivial sicher, aber langsam. Geteilte Bewertung (Gossip-
   Protokoll) ist schnell, aber anfällig für Reputations-Vergiftung
   (mehrere kollaborierende Angreifer werten einen ehrlichen Knoten ab).
   Hybrid?
4. **Signatur-Frage.** Wer signiert eine Reputations-Aussage — der
   bewertende Knoten lokal mit seinem Pubkey aus Modul 02? Wie verhindert
   man Replay-Attacken (alte negative Bewertungen werden wieder
   ausgespielt)?
5. **Schwelle zum Verwerfen.** Ab welchem Reputations-Wert wird ein Peer
   nicht nur abgewertet, sondern aktiv blockiert (Übergabe an Modul 12,
   Blocklist)?

---

## Verantwortung (Skizze)

**Macht (geplant):**
- Reputations-Score pro bekanntem Peer in IndexedDB führen
- Score bei jedem Treffer/Nicht-Treffer aktualisieren
- Score-Decay über Zeit
- Optional: signierte Reputations-Aussagen mit Geschwistern austauschen

**Macht nicht (geplant):**
- Keine zentrale Reputations-Datenbank — nur lokal + Opt-In-Gossip
- Keine harten Sperren (das ist Modul 12)
- Kein User-Tracking (Reputation ist Knoten-zu-Knoten, nicht User-zu-Knoten)

---

## Querverweise

- `sbkim_paper.pdf` Kap. 6.3 (Heterokaryose) und Kap. 22 (Sicherheitsmodell)
- `docs/components/06_heterokaryose.md` (parallele Spec, sobald gefüllt)
- `docs/components/07_apoptose.md` (passive Selbstreinigung)
- `docs/components/12_blocklist.md` (harte Sperre als nächste Stufe)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-10 | Observatorium | Schutz-Backlog, Anker zu Karte 13 |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
