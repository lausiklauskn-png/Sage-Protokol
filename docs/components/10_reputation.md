# Modul 10 — Reputation

> **Status:** 🟫 Schablone · Schutz-Backlog · Priorität niedrig  ·  **Schicht:** Netzwerk  ·  **Anker:** Sage-Page → Karte 13 (Eigenschutz)
> **Datei (Code):** `src/modules/10_reputation.js` (existiert noch nicht)
>
> _Numerischer Reputations-Score pro Peer mit Decay — die Grauzone
> zwischen "alles gut" und "Knoten muss sterben"._

---

## Im Mycel-Bild

Reputation ist die **Grauzonen-Bewertung** im Mycel. Apoptose (Modul 07)
ist binär: ein Knoten lebt oder ist gestorben. Was dazwischen passiert
— ein Peer wird **schlechter**, liefert dürftigere Treffer, ist aber
nicht bösartig genug für ein Vermächtnis — bildet sich in einem
gleitenden Score ab. Decay sorgt dafür, dass alte Sünden verblassen
und neue Beobachtungen Gewicht bekommen. Optional kann das Mycel diese
Bewertung über Heterokaryose teilen, sodass Knoten C nicht denselben
Müllweg erst selbst durchlaufen muss, den Knoten A bei Knoten X bereits
beobachtet hat.

---

## Visualisierung

```svg
<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="repBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#05050F"/>
    </linearGradient>
  </defs>
  <rect width="480" height="240" fill="url(#repBg)"/>

  <!-- Achsen -->
  <line x1="50" y1="200" x2="450" y2="200" stroke="#94A3B8" stroke-width="1"/>
  <line x1="50" y1="40" x2="50" y2="200" stroke="#94A3B8" stroke-width="1"/>
  <text x="40" y="50" text-anchor="end" font-size="10" font-family="ui-monospace,monospace" fill="#94A3B8">1.0</text>
  <text x="40" y="135" text-anchor="end" font-size="10" font-family="ui-monospace,monospace" fill="#94A3B8">0.5</text>
  <text x="40" y="205" text-anchor="end" font-size="10" font-family="ui-monospace,monospace" fill="#94A3B8">0.0</text>
  <text x="450" y="216" text-anchor="end" font-size="10" font-family="ui-monospace,monospace" fill="#94A3B8">t →</text>

  <!-- Quorum-Schwelle 0.15 -->
  <line x1="50" y1="176" x2="450" y2="176" stroke="#F43F5E" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="455" y="180" font-size="10" font-family="ui-monospace,monospace" fill="#F43F5E">Quorum 0.15</text>

  <!-- Score-Kurve -->
  <path d="M 50 60 L 110 70 L 160 100 L 200 105 L 240 140 L 290 150 L 340 168 L 400 180 L 450 188" fill="none" stroke="#16A34A" stroke-width="2.5"/>
  <circle cx="50"  cy="60"  r="3" fill="#16A34A"/>
  <circle cx="160" cy="100" r="3" fill="#16A34A"/>
  <circle cx="240" cy="140" r="3" fill="#16A34A"/>
  <circle cx="340" cy="168" r="3" fill="#EA580C"/>
  <circle cx="400" cy="180" r="3" fill="#EA580C"/>

  <!-- Vermächtnis-Marker -->
  <g transform="translate(280, 80)">
    <line x1="0" y1="0" x2="0" y2="60" stroke="#F43F5E" stroke-width="1" stroke-dasharray="2 2"/>
    <text x="6" y="-2" font-size="10" font-family="ui-monospace,monospace" fill="#F43F5E">Vermächtnis</text>
  </g>

  <text x="240" y="30" text-anchor="middle" font-size="13" font-family="ui-monospace,monospace" fill="#EEEEFF">Reputations-Decay über Zeit</text>
</svg>
```

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
sterben".

---

## Verantwortlichkeiten (Skizze)

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

## Manueller Test

*(später, sobald Modul 06 + 07 stehen)*

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-10 | Observatorium | Schutz-Backlog, Anker zu Karte 13 |
| Site-Echo | 2026-05-10 | Site-Echo | Hero, Bio-Metapher, Decay-SVG, Querverweise |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |

---

**Querverweise**

- **Abhängigkeiten:** Modul 06 (Heterokaryose) · Modul 02 (Spore)
- **Wird genutzt von:** Modul 12 (Blocklist) als vorgelagerte Stufe vor harter Sperre
- **Site-Karte:** [Karte 13 · Eigenschutz](../../index.html#screen-overview) (Penicillin-Schicht)
- **Glossar:** [Reputation](../GLOSSAR.md), [Quorum](../GLOSSAR.md), [Vermächtnis](../GLOSSAR.md)
- **Paper:** Kap. 6.3 (Heterokaryose) · Kap. 22 (Sicherheitsmodell)
- **Verwandt:** [Modul 06](06_heterokaryose.md) · [Modul 07](07_apoptose.md) · [Modul 12](12_blocklist.md)
