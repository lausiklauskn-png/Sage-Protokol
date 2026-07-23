# SPEC A11-Teil B + A15 — Erst-Kontakt-Fluss: Suchen → Fragen → (optional) Verbinden

> **Art:** Spec/Konzept (Plan-vor-Code). Betrifft Modul 22 (Such-Widget) ↔ Modul 23
> (Rendezvous) + die Rendezvous-UI. **Kern-Module 02/05/05b + 0.80-Riegel bleiben unberührt.**
> **Stand:** 2026-07-23. Auslöser: Klaus „Weiter mit A11 und A15".
>
> **Pflichtlektüre-Bezug:** `CLAUDE.md` § „Was du nicht tust" (Empfangsmodus) + § „Was du tust"
> (Fremdnutzer-/Marktplatz-Brille), `docs/components/22_such_widget.md`,
> `docs/components/23_rendezvous.md`, `docs/PLAN_SEMANTIK_KRYPTO.md` (A11, A15).

---

## 1. Warum diese beiden zusammen

Beide beschreiben **denselben Moment**: ein **fremder Nutzer** kommt zum ersten Mal ans Netz
(z.B. über family-projekt.de) und soll sich **natürlich** zurechtfinden — nicht mit einem
nackten „🤝 Andocken"-Knopf, den er nicht versteht.

- **A11-Teil B** = der **Fluss**: ein **positives Suchergebnis anklicken** → erst eine **Frage**
  an den Knoten (Antwort holen) → *dann* das Angebot **„🤝 mit diesem Knoten verbinden"**.
  Erst-Kontakt über Neugier, nicht über einen Vertrag.
- **A15** = die **Eintrittshürde**: man muss **nicht sofort eine Identität aufbauen**, um zu
  schauen. Zwei Stufen — **🔎 nur stöbern** (Beobachter, wird selbst nicht gefunden) und
  **🌐 voll mitmachen** (eigene Identität, auffindbar, andockbar).

A11-B ist der Fluss, A15 sind die Stufen, die dieser Fluss durchläuft. Darum eine Spec.

---

## 2. Was heute schon steht (Bestandsaufnahme, Code geprüft)

- **A11-Teil A ist gebaut** (Bau 23.C): Modul 23 `rankCardsByQuery(cards, queryVec)` sortiert
  die Raum-Karten nach Passung zur Frage; die Rendezvous-UI hat den Knopf **„🔎 Antwort holen"**
  (bettet die Frage ein, liest den Raum, fragt den bestpassenden Knoten automatisch).
- **Modul 23 Flächen:** `announce` (Visitenkarte ans Brett — **braucht Identität**),
  `discover` (Raum lesen — **braucht KEINE Identität zum reinen Lesen**), `connectAndAnnounce`,
  `handshakeCard` (andocken — **braucht Identität**, signierter Handshake), `askNode`
  (Frage — **braucht heute Identität**, s.u.), `fetchAnswers` (A12-Briefkasten).
- **Harte Wahrheit aus dem Code** (`23_rendezvous.js` `askNode`): eine Frage wird als
  **signiertes Nostr-Ereignis** publiziert und verlangt `getOwnLiveSpore()` →
  *„Noch keine Identität — zuerst anmelden (announce)."* **Fragen setzt heute eine Identität
  voraus.** Das ist der Angelpunkt für A15.
- **Such-Widget (Modul 22)** sucht App-Korpus + verbundene-Knoten-Korpus (lokal) + Internet —
  **alles ohne Identität**. Es hat aber **keinen** „Klick auf Knoten-Treffer → live fragen"-Pfad
  (das ist genau A11-Teil B).

---

## 3. Verfassungs-Rahmen (die Leitplanken für den Entwurf)

1. **Empfangsmodus:** Anmelden/Fragen/Andocken bleiben **nutzer-ausgelöst**, kein Auto-Anmelden,
   keine Pulsation. Der 0.80-Riegel (Modul 05) entscheidet den Handshake unverändert.
2. **Fremdnutzer-/Marktplatz-Brille:** ein Fremder ohne Modell/ohne Identität muss die Seite
   **voll nutzen** können (fail-soft), und es muss **klar benannt** sein, was ein Schritt kostet
   (Modell-Download ~30 MB, Identität anlegen).
3. **Identität ist stabil & echt:** kein Wegwerf-Identitäts-Spam ins Netz. Jedes publizierte
   Ereignis ist von einer **echten, stabilen** Identität signiert (auditierbar).

---

## 4. Der Entwurf — drei Sichtbarkeits-Stufen (A15), ein Fluss (A11-B)

### 4.1 Die Stufen (A15) — was ohne was geht

| Stufe | Was der Nutzer tut | Braucht Modell? | Braucht Identität? | Auffindbar? |
|---|---|---|---|---|
| **① Stöbern (Liste)** | Raum lesen (`discover`), Knoten als **Text-Liste** sehen (Name + Domänen-Beschreibung) | **nein** | **nein** | nein (nur Beobachter) |
| **② Stöbern (semantisch)** | + Frage eintippen → Knoten **nach Passung** sortiert (`rankCardsByQuery`), App-/Knoten-Korpus semantisch durchsuchen | **ja** (lädt on-demand beim ersten Suchen) | nein | nein |
| **③ Voll mitmachen** | + **Identität anlegen** → `announce` (auffindbar) + **fragen** (`askNode`) + **andocken** (`handshakeCard`) | ja | **ja** (einmal) | ja |

**Kern-Entscheidung (der einzige echte Fork): darf ein Beobachter (Stufe ①/②) eine LIVE-Frage
an einen Knoten stellen, ohne eine Identität zu haben?**

- **Empfehlung: NEIN — Fragen/Andocken = Stufe ③.** Begründung:
  - Es hält den Vertrag von `askNode` (signiert = auditierbar, kein Wegwerf-Spam-Vektor) und
    die Kern-Module **unangetastet** — reiner UI-/Fluss-Bau, kein Protokoll-Eingriff.
  - Es deckt sich mit Klaus' eigener A15-Formulierung: *„man findet andere, wird aber selbst
    NICHT gefunden"* (Stöbern = **finden/sehen**, nicht interagieren). Interaktion (fragen,
    verbinden) ist „mitmachen".
  - Der Übergang ist **sanft**: klickt ein Beobachter auf „Antwort holen" / „verbinden",
    erscheint **an genau der Stelle** „Dafür einmal eine Identität anlegen (bleibt lokal)"
    → ein Klick, dann läuft die Frage. Keine tote Sackgasse.
- **Verworfene Alternative:** Wegwerf-Ephemeral-Schlüssel fürs anonyme Fragen. Zwar bequem,
  aber (a) öffnet einen anonymen Spam-/Sybil-Vektor ins Netz (widerspricht Schutz-Backlog-Geist),
  (b) verlangt einen Eingriff in `askNode`/Kern (Ephemeral-Signatur-Pfad) — **nicht** reiner
  UI-Bau. **Bewusst zurückgestellt** (optionaler Folge-Punkt, falls je gewünscht).

### 4.2 Der Fluss (A11-Teil B) im Such-Widget (Modul 22)

Heute zeigt das Widget Knoten-Treffer nur als Text. Neu — **auf Klick eines Knoten-Treffers**
eine Tool-eigene **Knoten-Detail-Karte** (Overlay, wie die bestehende Merken-Detail-Karte):

```
┌───────────────────────────────────────────────┐
│ 🔵 <Knoten-Name>            🧬 verwandt 0.72   │   ← Passungs-Badge (rankCardsByQuery, reine Anzeige)
│ <Domänen-Beschreibung, gekürzt>                │
│                                                 │
│ Frage an diesen Knoten:  [_______________]      │   ← vorbelegt mit der Suchfrage
│                            [ 🔎 Antwort holen ] │   ← ruft Modul 23 askNode(card, frage)
│                                                 │
│  … Antwort erscheint hier (bedeutungs-sortiert) │
│                                                 │
│                        [ 🤝 mit Knoten verbinden ]  ← erscheint NACH einer Antwort; handshakeCard
└───────────────────────────────────────────────┘
```

- **„🔎 Antwort holen"** → `SbkimRendezvous.askNode(card, frage)`. Hat der Nutzer noch keine
  Identität (Stufe ①/②), zeigt der Knopf zuerst **„Dafür einmal anmelden — Identität bleibt
  lokal"** (ein Klick → `connectAndAnnounce` → dann Frage). Fail-soft: kein Modul 23 / kein
  Relais → deutscher Hinweis, Widget bleibt nutzbar.
- **„🤝 mit Knoten verbinden"** erscheint **erst nach** einer erhaltenen Antwort (Erst-Kontakt
  über Neugier). → `handshakeCard(card)`. Der **0.80-Riegel entscheidet unverändert**;
  Ergebnis wird ehrlich angezeigt („✓ verbunden" / „geprüft, aber andere Domäne").
- **Reine Anzeige/Auswahl:** das Widget **gatet nichts**, es ruft nur die öffentlichen
  Modul-23-Flächen. Kein Eingriff in Modul 04/05/23-Kern.

### 4.3 UI-Anker für die Stufen (A15)

Im „🌐 Mit dem Netz verbinden"-Panel (Rendezvous-UI) statt eines einzelnen Knopfes **zwei
klar benannte Wege**, plus ehrliche Kosten-Benennung:

- **🔎 Nur stöbern** — „Sieh dich um, ohne dich anzumelden. Du findest andere, wirst aber
  selbst nicht gefunden." (→ `discover`, Liste; semantische Sortierung lädt das Modell erst
  beim ersten Suchen, mit Hinweis „~30 MB, einmalig").
- **🌐 Voll mitmachen** — „Eigene Identität anlegen: auffindbar, du kannst fragen und dich
  verbinden. Die Identität bleibt in deinem Browser." (→ `connectAndAnnounce`).

---

## 5. Bau-Plan (Increments, je eigener PR + Headless-Smoke)

1. **A15-Inc-1 — Zwei-Stufen-UI** in der Rendezvous-UI (`23_rendezvous_ui.js`): „🔎 Nur stöbern"
   vs. „🌐 Voll mitmachen" + Kosten-Benennung. `discover` ohne Identität (Beobachter) sauber
   trennen vom `announce`. Reine UI, fail-soft.
2. **A11B-Inc-2 — Knoten-Detail-Karte im Such-Widget** (Modul 22): Klick auf Knoten-Treffer →
   Overlay mit Frage-Feld + „🔎 Antwort holen" (`askNode`) + Passungs-Badge.
3. **A11B-Inc-3 — „🤝 verbinden" nach Antwort** (Modul 22 → `handshakeCard`), Ergebnis ehrlich
   anzeigen. Identitäts-Nachhol-Klick („einmal anmelden") an den Interaktions-Knöpfen.
4. **Rollout** byte-1:1 in die Träger-Apps (wie bei A4/A12: Mixarium/Rezeptbuch/family/BLP/
   Tomys/Kimboard/Kimseek + such-tool/sbkim-bundle), Drift-Guards + SW-Bumps.

Jedes Increment: Kern (02/05/05b) + `PROVIDER_MIN_MATCH` (0.80) + PROTOCOL_VERSION **unberührt**,
kein PII, fail-soft. **Browser-Sichttest (Klaus) je Increment** — es ist der Marktplatz-
Erst-Kontakt, den nur er am Tablet beurteilen kann.

---

## 6. Offene Entscheidung für Klaus (eine, nicht blockierend)

- **Ephemeral-Fragen für anonyme Beobachter** (Stufe ①/② dürfen fragen, ohne Identität) —
  **Empfehlung: NEIN / zurückstellen** (§4.1). Wenn Klaus es **doch** will, wird es ein eigener,
  sicherheits-sensibler Kern-Folge-Bau (Ephemeral-Signatur-Pfad in `askNode`), **nicht** Teil
  dieser UI-Increments. Bis dahin gilt: stöbern frei, fragen/verbinden = einmal anmelden.

## 7. Was diese Spec NICHT tut

- Kein Eingriff in Kern-Module (02/05/05b), keinen 0.80-Riegel, keine Protokoll-Version,
  keine INTERFACES-Draht-Verträge.
- Kein Auto-Anmelden, keine Pulsation, kein Crawler (Empfangsmodus gewahrt).
- Ersetzt **nicht** Klaus' Browser-Sichttest des Erst-Kontakt-Flusses.
