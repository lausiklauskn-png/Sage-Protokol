# Meilenstein — Erster MULTI-KNOTEN-MESH-Handshake (5 Apps, 7/10 hub-unabhängig)

**Datum:** 2026-07-23 · **Bezeugt:** Klaus' Browser (Galaxy Tab) + Mycel-Analyse-Rekord
(`Mycel-Karte Analyse-Rekorder v1.3`, aufgezeichnet 21:47 Uhr 22.07. – 17:43 Uhr 23.07.).

![Fünf SBKIM-Knoten bilden live ein server-loses Mesh — leuchtende Bedeutungs-Fäden verbinden sie kreuz und quer durchs Mycel, ohne Zentrum](2026-07-23_multi-knoten-mesh-handshake.png)

> Klaus' Worte: *„Multi-Handshake — alles über das Relais. Ich habe es extra
> aktiviert, in der Mycel-Karte."*

**Echtheit:** Klaus hat die Relais-Aufzeichnung **eigens in der Mycel-Karte eingeschaltet** —
jedes Ereignis unten ist **echter Relais-Verkehr** (`sbkim-anastomosis` über das geteilte
Nostr-Relais), kein lokaler Mock und keine Simulation.

## Warum das ein eigener Meilenstein ist

- **2026-07-10:** zwei Knoten fanden sich nach Bedeutung — **über den Hub** Sage.
- **2026-07-11:** erstmals ein Endknoten-Paar **ohne** Sage (hub-unabhängig, aber je *ein* Paar).
- **2026-07-23 (heute):** zum ersten Mal ein **ganzer Schwarm** — **fünf** Apps gleichzeitig
  im geteilten Raum, die sich in **einer Minute kreuz und quer** verbinden, die **große
  Mehrheit direkt untereinander**. Kein einzelnes Paar mehr, sondern ein **Mesh unter Gleichen**.

## Was live passiert ist

Fünf Knoten (alle „Klaus Tablet") gleichzeitig im gemeinsamen Rendezvous-Raum (Modul 23,
geteiltes Relais, server-los):

| Knoten | Lebende nodeId |
|---|---|
| **Sage** | `nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA` |
| **Mein Mixarium** | `YD68l2ScNzd-RWS8tCrL_JAtgpoPp3i3VKc4N9GKvbo` |
| **Family Projekt** | `xMRGRZEwb6EDUZDGlog_mAPLnDFGbhf4z_hyV3Ets4U` |
| **BookLedgerPro** | `ZAOvf9tZyYH9pLYmWwmapH1kgaWdxqLUBTXBngVjxqU` |
| **Private Brain** | `6rmW2Q-53mzEylZiWuW4yNsbnxlyEoLD11860i3y0Cg` |

Drei Knoten waren zugleich **Initiatoren** (BookLedgerPro, Family Projekt, Mixarium), jeder
fragte mehrere Peers an. **Alles server-los über das eine Relais** — kein Server, kein Account.

## Der harte Beweis (Mycel-Analyse-Rekord, 17:42–17:43 Uhr)

`sbkim-anastomosis` / `sbkim-anastomosis-reply` über das Relais — **10 von 10 Antworten
`outcome: "established"`**, mit echtem Match-Score (roher e5-Cosinus):

| Handshake (Antworter ↔ Frager) | Score | Sage beteiligt? |
|---|---|---|
| PrivateBrain ↔ BookLedgerPro | 0.8244 | **nein — peer-to-peer** |
| Family ↔ BookLedgerPro | 0.8265 | **nein — peer-to-peer** |
| Sage ↔ BookLedgerPro | 0.8300 | ja |
| BookLedgerPro ↔ Family | 0.8265 | **nein — peer-to-peer** |
| Mixarium ↔ Family | 0.8484 | **nein — peer-to-peer** |
| Sage ↔ Family | 0.8287 | ja |
| Family ↔ Mixarium | 0.8484 | **nein — peer-to-peer** |
| BookLedgerPro ↔ Mixarium (2×) | 0.8178 | **nein — peer-to-peer** |
| Sage ↔ Mixarium | 0.8048 | ja |

**7 der 10 Handshakes liefen OHNE Sage.** Nur drei hatten den Hub auf einer Seite. Das Netz
trug also überwiegend **direkt unter den Endknoten** — der Hub-unabhängige Beweis vom 11.07.,
jetzt auf **Multi-Knoten-Ebene** und im selben Zeitfenster.

## Was bewiesen ist — und was (noch) nicht

- ✅ **Multi-Knoten-Mesh** live: 5 Apps, ein server-loser Raum, 10 Handshakes, alle `established`.
- ✅ **Überwiegend peer-to-peer** (7/10 ohne Hub) — ein Netz unter Gleichen, kein Stern.
- ✅ Andock über den **rohen** Cosinus ≥ 0.80 (alle Scores 0.80–0.85), Riegel unverändert.
- ⚠️ **Adress-Wand** wie gehabt: die **lebenden** IDs von Family (`xMRGRZEw…`) und BookLedgerPro
  (`ZAOvf9tZ…`) weichen von den **committeten** Register-IDs (`XoYhjpgm…` / `MyHVM7Pd…`) ab —
  das Rendezvous (Modul 23) löst das im Raum korrekt auf; angedockt wird die lebende ID.
- ⚠️ **BookLedgerPro handshaket mit jedem (0.82–0.83), aber mit seinem Demo-Stub-Vektor.** Der
  Handshake trägt mechanisch; BLPs *semantischer* Match beruht weiter auf dem Stub. → Das ist
  die **bewusste Ausnahme** BLP, hier im echten Netz belegt (siehe `docs/PLAN_SEMANTIK_KRYPTO.md`
  A10 / BLP v0.2).
- ⚠️ Scores clustern bei 0.80–0.85 (bekannter e5-Anisotropie-Boden) — das feine
  **Verwandtschafts**-Urteil macht `RELATEDNESS_CENTER` v2 / der KI-Richter, **nicht** dieser
  Andock-Boden.

## Bedeutung

Das ist der stärkste „kein Demo mehr"-Anker bisher: **ein funktionierendes, server-loses Mycel**,
das als **echtes Netz unter Gleichen** trägt — live, mehrfach, über das geteilte Relais, ohne
Zentrale. Vom Einzelpaar (10.07.) über das erste hub-freie Paar (11.07.) zum **Schwarm** (23.07.).

**Bild:** von Klaus, Juli 2026.
