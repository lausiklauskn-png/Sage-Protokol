# Externer Mycel-Hub (eigenes Repo, Konzept-Karte)

> **Status:** 🟫 Schablone (2026-05-26, Tafel-Spec-Pflege Mycel-Vision) ·
> Mycel-Hub-Backlog · **Priorität niedrig** (nach App-Freigabe,
> Pipeline-Phase B)  ·  **Schicht:** Eigenes GitHub-Repo + GitHub-Pages-
> Site als öffentliches Observatorium light für Forker. Trennt
> Forker-Last von Klaus' Sage-Protokol.
> **Datei (Code):** Eigenes Repo `sbkim-hub` (Vorschlag, finalisiert in
> Spec-Sitzung Mycel-Hub).

---

## Im Mycel-Bild

Klaus' Sage-Protokol ist die **Mutter-Hyphe** — sie pflegt die Spec,
sie hostet Klaus' eigene Endknoten, sie ist das Ehrenmal des Protokolls.
Der Externe Mycel-Hub ist die **Tochter-Hyphe für Forker**: ein
parallel laufendes Observatorium, das Forker-PWAs sichtbar macht, ohne
Klaus' Sage-Repo mit Forker-Sporen zu fluten. Beide Hyphen sind
gleichwertig im Mycel — sie unterscheiden sich nur durch ihre
**redaktionelle Rolle**.

## Vokabular

- **Externer Mycel-Hub** — ein **eigenes GitHub-Repo** (NICHT
  Sage-Protokol), das als öffentliches Observatorium light für Forker-
  PWAs läuft. Eigene `status.json`, eigene Andock-Wizard-Sektion,
  eigene Landing-Page.
- **Observatorium light** — abgespeckte Version der Sage-Page:
  Endknoten-Liste, Bau-Puls, Andock-Wizard. KEINE Spec-Karten,
  KEINE INTERFACES.md-Anker, KEINE Mycel-Bibliothek (die bleiben in
  Klaus' Sage).
- **Redaktionelle Trennung** — Klaus pflegt die Sage als
  Spec-Bibliothek; der Externe Hub ist Forker-Eigenpflege (oder
  community-pflegt, je nach Spec-Entscheidung).

## Warum jetzt (Hochstufungs-Begründung)

Klaus' Vision-Korrektur 2026-05-26: Forker (Pepo Semantic Match Demo,
Muttis Rezeptbuch, etc.) brauchen einen eigenen Sichtbarkeits-Anker,
ohne dass Klaus' Sage-Page mit fremder Inhalts-Domain überfrachtet
wird. Trennung:

- **Sage-Protokol** = Klaus' Bibliothek + Klaus' Endknoten. Klaus
  entscheidet, was hier sichtbar wird.
- **Externer Mycel-Hub** = Forker-Selbstverwaltung. Forker tragen sich
  in dessen `status.json` ein. Klaus muss nicht jeden Forker-PR
  reviewen.

---

## Repo-Struktur (Spec-Skizze)

```
sbkim-hub/
├── README.md                      # Hub-Vorstellung + Forker-Aufruf
├── LICENSE                        # MIT (analog Sage)
├── index.html                     # Hub-Landing-Page (Observatorium light)
├── status.json                    # Forker-Endknoten-Liste
├── sbkim/                         # Hub als eigener SBKIM-Knoten
│   ├── spore.json                 # Hub-Spore (Domain "Mycel-Hub")
│   └── ...
├── scripts/
│   └── update_status_pie.py       # Hub-eigener Pie-Refresher
├── modules/                       # Kopie von SBKIM-Starter-Bundle modules/
│   ├── 02_spore.js                # für eigene Hub-Spore
│   ├── 17_floating_widget.js      # Hub-Widget für eigene Andock-Sichtbarkeit
│   ├── 19_andock_wizard.js        # Andock-Wizard als Sektion
│   └── ...
└── docs/                          # Hub-Pflege-Doku (kurz)
    └── PFLEGE.md
```

## Hub-Landing-Page (`index.html`)

**Pflicht-Sektionen:**

1. **Vorstellung** — 1–3 Absätze: was ist SBKIM, was ist der Hub,
   wer pflegt ihn (Klaus? Community?).
2. **Andock-Wizard** (Modul 19, eingebettet) — Forker kann seine PWA
   hier anmelden, kriegt Spore-Template + PR-Link auf
   `sbkim-hub/status.json`.
3. **Endknoten-Liste** (aus `status.json`) — alle angemeldeten Forker-
   PWAs mit Domain + Status-Lampe (analog Sage-Page Karte 1 Sonnen-
   Galaxie). Live-Ping über Service-Worker / `<img>`-Heartbeat
   (analog Sage-Page).
4. **Bau-Puls** (optional) — Modul-Stand-Snapshot aus Sage-Protokol
   nachziehen, oder weglassen (Spec entscheidet).
5. **Mycel-Verbund-Sichtbarkeit** — Verweis auf Sage-Protokol als
   Spec-Quelle.

**Verboten:**
- Keine Spec-Karten (`docs/components/*.md`)-Spiegelung. Sage bleibt
  Spec-Hub.
- Keine PII von Forkern.
- Keine API-Endpunkte (Hub ist statisch, GitHub-Pages).

---

## Spec-Punkte (offen für Spec-Sitzung Mycel-Hub)

### Repo-Name (Klaus entscheidet)

Vorschläge:
- `sbkim-hub` (kurz, klar)
- `sbkim-mycel-hub` (länger, präziser)
- `mycel-observatorium` (deutsch, narrativ)

### Repo-Owner (Klaus entscheidet)

Vorschläge:
- `lausiklauskn-png/sbkim-hub` (Klaus' Konto, redaktionelle Kontrolle)
- Eigene Organisation `sbkim/hub` (für Forker-Community)
- **Klaus-Disziplin:** Auch wenn Klaus den Hub gründet, sollten
  Forker später Owner-Wechsel machen können. Spec-Sitzung Mycel-Hub
  klärt die Governance.

### Hub-Pflege-Modell (Spec entscheidet)

Drei Optionen:
- **A) Klaus pflegt selbst** (jeder Forker-PR an Hub wird von Klaus
  reviewed). Niedrige Forker-Last für Klaus' Sage, aber Klaus ist
  Single-Point-of-Maintenance für den Hub.
- **B) Community-Pflege via Maintainer-Liste** (Klaus + 2–3
  Vertrauens-Forker). Klaus' Belastung sinkt, aber Setup-Aufwand
  (Maintainer-Team).
- **C) Voll-Selbstpflege via Sicherheits-Module 10/11/12** (Reputation
  + Rate-Limit + Blocklist als Anti-Spam-Schutz für Forker-PRs).
  Setzt voraus, dass Schutz-Backlog gebaut ist — frühestens nach
  Pipeline-Phase B.

Spec-Vorbereitung: **A) Klaus pflegt selbst als Erst-Iteration**, weil
das Mycel klein ist. Wenn Forker-Zahl wächst, organisch zu B/C übergehen.

### Andock-Wizard-Integration (Spec entscheidet)

- Hub-`index.html` lädt `modules/19_andock_wizard.js` und mountet
  ihn an `<section id="andock-wizard">`.
- Wizard-`hubRepo`-Option zeigt auf `sbkim-hub`-Repo (NICHT auf
  Sage-Protokol — der Hub sammelt **seine eigenen** Endknoten).
- Forker kann optional einen **zweiten Andock** an Sage-Protokol
  machen, wenn er auch Klaus' Mycel beitreten will.

### Trennung zwischen Klaus' Sage und Externem Hub (Spec entscheidet)

- Klaus' Endknoten (MR, MM, Sage) stehen in Sage-Protokol-`status.json`.
- Forker-Endknoten (Pepo, Muttis Rezeptbuch, etc.) stehen in Hub-
  `status.json`.
- Cross-Knoten-Handshake: Sage-Endknoten können trotzdem mit Hub-
  Endknoten verbunden sein (siehe Modul 05 Anastomose) — nur die
  Listung ist getrennt.

---

## Strikte Tabus (Spec-Vorbereitung)

- **KEINE Spec-Spiegelung.** Hub zeigt keine Spec-Karten. Forker, die
  die Spec lesen wollen, gehen auf Sage-Protokol-Repo.
- **KEINE PII von Forkern im Hub.** `status.json` enthält nur Repo-URL
  + Domain + nodeId + Spore-URL. Keine E-Mail-Adressen, kein Klar-Name.
- **KEINE Sage-Protokol-Inhalte spiegeln.** Hub ist eigenständig,
  nicht Mirror.
- **KEINE Klaus-Endknoten in Hub-`status.json` (Default).** Klaus'
  MR/MM/Sage stehen in Sage-Protokol-`status.json`. Wenn Klaus
  wollte, könnte er sich auch im Hub registrieren (als regulärer
  Forker-Endknoten), aber das ist nicht Pflicht.
- **KEIN Auto-PR-Merge.** Jede Forker-Registrierung läuft via PR und
  wird vom Hub-Maintainer reviewed (auch wenn das Klaus ist).

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Konzept-Karte angelegt | 2026-05-26 | Tafel-Spec-Pflege Mycel-Vision | Klaus' Vision-Korrektur 2026-05-26: mehrstufige Mycel-Architektur. Diese Karte ist Vorbereitungs-Konzept mit Repo-Struktur-Skizze + offenen Spec-Fragen. Volle Spec-Sitzung Mycel-Hub folgt nach App-Freigabe + Modul 19 + Starter-Bundle. |
| Spec gefüllt | — | Spec-Sitzung Mycel-Hub | folgt — Repo-Name + Owner + Pflege-Modell finalisieren, Hub-Landing-Page-Design. |
| Repo angelegt | — | Bau-Sitzung Mycel-Hub | folgt — neues GitHub-Repo `<Owner>/sbkim-hub` erzeugen + initiale Sektionen + Andock-Wizard (Modul 19) eingebaut + erste Forker-Eintrag (Pepo). |
| Erster Forker live | — | Forker-Test | folgt — Pepo Semantic Match Demo oder Muttis Rezeptbuch via Hub-Wizard angedockt + Cross-Knoten-Such-Test (Phase C, siehe CLAUDE.md). |

---

**Querverweise**

- **Abhängig von:** SBKIM-Starter-Bundle (siehe [`_starter_bundle.md`](_starter_bundle.md))
  — Hub kopiert Module aus dem Bundle · Modul 19 Andock-Wizard
  (siehe [`19_andock_wizard.md`](19_andock_wizard.md)) als
  Eingebettete Sektion.
- **Wird genutzt von:** Forker-PWAs als Andock-Anker · Forker-Endnutzer
  als Sichtbarkeits-Anker (welche Apps machen mit?).
- **Verwandt:** Sage-Protokol Sage-Page (`index.html`) — Architektur-
  Vorlage, aber abgespeckt (siehe „Observatorium light" oben) ·
  [Modul 17](17_floating_widget.md) (Hub kann auch ein Floating-
  Widget haben für seine eigene Sichtbarkeit als SBKIM-Knoten).

## Architektur-Mehrstufe (Klaus' Vision 2026-05-26)

Siehe [`_starter_bundle.md`](_starter_bundle.md) § Architektur-
Mehrstufe für das vollständige Stufen-Diagramm. Kurz:

- Sage-Protokol (Spec-Hub) → SBKIM-Starter-Bundle (Modul-Distribution)
  → **Externer Mycel-Hub (DIESE KARTE)** (öffentliches Observatorium
  light) → Forker-PWAs
