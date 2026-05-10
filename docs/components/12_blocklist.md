# Modul 12 — Blocklist (manuelle Sperrliste)

**Status:** Stub (spec ausstehend)
**Priorität:** niedrig — wird gezogen, sobald spürbares Wachstum messbar wird
**Datei (Code):** `src/modules/12_blocklist.js` (existiert noch nicht)
**Abhängigkeiten:** 01 (Storage), evtl. 00 (Doku-Fenster, für UI)

**Anker:** Diese Karte ist Teil des Schutz-Backlogs, sichtbar in der
Eigenschutz-Karte (Karte 13) der Observatorium-Page. Siehe auch
`docs/PULS.md` Abschnitt "Schutz-Backlog".

---

## Zweck

Dem Endknoten-Betreiber (Klaus, oder einem Nutzer) ein Werkzeug geben, um
einen bekannten bösen Peer dauerhaft zu sperren — unabhängig von Reputation
(Modul 10) und Apoptose (Modul 07). Schutz vor:

- gezielten Angriffen, bei denen eine spezifische Spore-ID identifiziert ist,
- Datenschutz-Verletzungen ("dieser Knoten loggt zu viel"),
- Themen-Verschmutzung (rechtlich, ethisch, praktisch),
- Spam-Wellen, die Reputation zu langsam abfedert.

**Wichtig:** Die emergente Misstrauensliste aus dem Quorum-Vermächtnis-
Modell (Modul 07 + Heterokaryose, Paper Kap. 16-17) ist die biologische
Hauptvariante. Wenn `QUORUM_RATIO = 0.15` der aktiven Topologie ein
Vermächtnis gegen einen `suspected_node_id` gesendet hat, bildet sich
automatisch eine Misstrauensliste — ohne dass jemand manuell eingreifen
muss.

Modul 12 ist also nicht der Blocking-Mechanismus selbst, sondern die
**manuelle Override-Schicht**: explizite Sperren durch den Betreiber für
Fälle, in denen die Quorum-Schwelle noch nicht erreicht ist (zu kleines
Netz), oder in denen der Block aus nicht-technischen Gründen erforderlich
ist (rechtliche Anweisung, persönliche Entscheidung). Die Blocklist ist
die letzte Verteidigungslinie — explizit, manuell, unwiderruflich (bis
zum manuellen Eintragen in eine Allowlist).

---

## Bekannte offene Fragen

1. **Speicherort.** Sitzt die Blocklist als zusätzliche Tabelle in Modul 01
   (Storage) oder rechtfertigt sie ein eigenes Modul? Eigenes Modul macht
   die Verantwortung klarer, ist aber mehr Code.
2. **Granularität.** Sperre pro-Knoten (per Spore-ID) oder pro-Domain
   (Endpoint-URL)? Pro-Knoten ist genau, aber Angreifer kann neue Spore
   erzeugen. Pro-Domain ist robust, aber zu grob (sperrt eventuell andere
   Knoten desselben Hosters mit).
3. **Geteilt zwischen Endknoten?** Wenn Klaus Mixarium und Rezeptbuch
   betreibt, sollen die ihre Blocklist teilen? Vermutlich ja, optional
   per Heterokaryose-Tausch. Aber: Dann muss klar sein, ob beide PWAs
   denselben Betreiber haben und wie das authentisiert wird.
4. **UI-Frage.** Reicht ein einfaches Listen-UI im Modul 00 (Doku-Fenster)
   oder braucht es eine eigene Verwaltungs-Karte? Letzteres ist nutzer-
   freundlicher; ersteres ist sparsamer.
5. **Allowlist-Pendant.** Soll es zusätzlich eine Allowlist geben, die
   bestimmte Peers immer als vertrauenswürdig markiert (Bypass für
   Reputation und Rate-Limit)? Das wäre konsequent, ist aber eigenes
   Konfliktpotenzial.

---

## Verantwortung (Skizze)

**Macht (geplant):**
- IndexedDB-Tabelle `sbkim_blocklist` (Schlüssel: Spore-ID oder Domain)
- API zum manuellen Hinzufügen / Entfernen
- Filter, der bei jeder eingehenden Anastomose / Query / Heterokaryose
  prüft, ob der Sender geblockt ist → sofort Drop ohne Antwort
- Optionaler Heterokaryose-Sync zwischen Geschwister-Endknoten

**Macht nicht (geplant):**
- Keine automatischen Sperren (das ist Reputation + Apoptose)
- Keine Listen-Verteilung an unbekannte Knoten — eine Blocklist ist
  nicht öffentlich, sonst gibt sie dem Angreifer wertvolle Information
  preis
- Keine Inhaltsfilterung (das ist Sache der Endknoten-PWA, nicht von SBKIM)

---

## Beispiel-API (Skizze)

```
async function add(idOrDomain, reason) → void
async function remove(idOrDomain) → void
async function list() → Array<{ key, reason, addedAt }>
async function isBlocked(spore) → boolean
```

---

## Querverweise

- `sbkim_paper.pdf` Kap. 22 (Sicherheitsmodell)
- `docs/components/01_storage.md` (möglicher Träger)
- `docs/components/06_heterokaryose.md` (möglicher Sync-Kanal zwischen
  Geschwister-Endknoten)
- `docs/components/10_reputation.md` (vorgelagerte automatische Stufe)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-10 | Observatorium | Schutz-Backlog, Anker zu Karte 13 |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
