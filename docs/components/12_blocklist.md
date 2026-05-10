# Modul 12 — Blocklist

> **Status:** 🟫 Schablone · Schutz-Backlog · Priorität niedrig  ·  **Schicht:** Kern (Override)  ·  **Anker:** Sage-Page → Karte 13 (Eigenschutz)
> **Datei (Code):** `src/modules/12_blocklist.js` (existiert noch nicht)
>
> _Manuelle Sperrliste durch den Betreiber — die letzte Verteidigungslinie,
> wenn Reputation und Apoptose-Vermächtnis nicht reichen._

---

## Im Mycel-Bild

Die Blocklist ist die **manuelle Override-Schicht** des Mycels: ein
Werkzeug für den Betreiber, einen bekannten Angreifer dauerhaft
auszuschließen, unabhängig vom Quorum. Die emergente Misstrauensliste
aus Vermächtnis + Heterokaryose (Modul 07 + 06) ist die biologische
Hauptvariante; sie wirkt langsam und braucht Mycelgröße. Die Blocklist
greift dort, wo das Mycel zu jung oder zu klein ist, oder wo der Block
aus nicht-technischen Gründen erforderlich ist (rechtliche Anweisung,
persönliche Entscheidung). Sie ist explizit, manuell, und wird nicht
öffentlich verteilt — sonst gäbe sie dem Angreifer wertvolle Information.

---

## Visualisierung

```mermaid
flowchart LR
  Op[Betreiber] -->|add(idOrDomain, reason)| V[Validate<br/>Schema, Format]
  V --> P[(sbkim_blocklist<br/>persistent)]
  P -->|opt-in| H[Heterokaryose-Sync<br/>nur Geschwister-Endknoten<br/>desselben Betreibers]
  P --> F[Filter im Anastomose-<br/>und Heterokaryose-Eingang]
  F -->|isBlocked = true| D[Silent Drop]
  F -->|isBlocked = false| OK[normaler Pfad]

  classDef op fill:#92400E,color:#fff,stroke:#fff
  classDef store fill:#2563EB,color:#fff,stroke:#fff
  classDef gate fill:#EA580C,color:#fff,stroke:#fff
  classDef stop fill:#F43F5E,color:#fff,stroke:#fff
  classDef ok fill:#16A34A,color:#fff,stroke:#fff
  class Op op
  class P store
  class V,F gate
  class D stop
  class OK ok
  class H store
```

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
ist. Die Blocklist ist die letzte Verteidigungslinie — explizit, manuell,
unwiderruflich (bis zum manuellen Eintragen in eine Allowlist).

---

## Verantwortlichkeiten (Skizze)

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

## Beispiel-API (Skizze)

```
async function add(idOrDomain, reason) → void
async function remove(idOrDomain) → void
async function list() → Array<{ key, reason, addedAt }>
async function isBlocked(spore) → boolean
```

---

## Manueller Test

*(später, sobald Modul 01, 05 stehen)*

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-10 | Observatorium | Schutz-Backlog, Anker zu Karte 13 |
| Site-Echo | 2026-05-10 | Site-Echo | Hero, Bio-Metapher, Mermaid-Flow, Querverweise |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |

---

**Querverweise**

- **Abhängigkeiten:** Modul 01 (Storage) · evtl. Modul 00 (Doku-Fenster, für UI) · Modul 06 (Heterokaryose) optional für Sync
- **Wird genutzt von:** Modul 05 (Anastomose) als Eingangs-Filter · Modul 06 (Heterokaryose) als Eingangs-Filter
- **Site-Karte:** [Karte 13 · Eigenschutz](../../index.html#screen-overview) (Penicillin-Schicht)
- **Glossar:** [Blocklist](../GLOSSAR.md), [Allowlist](../GLOSSAR.md), [Override](../GLOSSAR.md)
- **Paper:** Kap. 22 (Sicherheitsmodell)
- **Verwandt:** [Modul 07](07_apoptose.md) (Vermächtnis-Pfad) · [Modul 10](10_reputation.md) (vorgelagerte automatische Stufe)
