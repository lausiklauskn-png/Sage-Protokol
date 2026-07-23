# SPEC A12 — „Antworten: an/aus"-Modell (Erreichbarkeit · Reihenfolge · Auto-Toggle)

> **Art:** Konzept/Spec (kein Draht-Vertrag zwischen Modulen → INTERFACES unberührt).
> **Punkt:** A12 aus [`PLAN_SEMANTIK_KRYPTO.md`](PLAN_SEMANTIK_KRYPTO.md).
> **Stand:** 2026-07-23. **Ergebnis:** das Modell ist **entschieden** (Briefkasten-Prinzip,
> gebaut in A12 Phase 1–2d); ein „Immer-erreichbar"-Server ist **verfassungswidrig** und wird
> **nicht** gebaut. Rest = **eine optionale, kleine** Fairness-Tuning-Idee (Modul 11), Klaus' Wahl.
>
> **Pflichtlektüre-Bezug:** `CLAUDE.md` § „Was du nicht tust" (Empfangsmodus),
> `docs/components/11_rate_limit.md`, `docs/components/23_rendezvous.md`,
> `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` (Rest-Grenze: Antworter-Tab vorn+wach).

---

## 1. Die Frage (Klaus' Befund 2026-07-11)

Ein SBKIM-Knoten läuft **im Browser**, nicht auf einem Server. Antworten auf fremde
Fragen ist heute **opt-in/manuell** (Default aus; `enableAnswering`/`disableAnswering`,
Modul 23.B), und der Antworter-Tab muss **vorn + wach** sein (Hintergrund-Drosselung
des Browsers — die bekannte Meilenstein-Rest-Grenze). Daraus Klaus' drei offene Fragen:

1. **Erreichbarkeit** — mit „aus" gehen eingehende Fragen verloren. Soll ein Knoten
   „immer erreichbar" sein, oder soll der Toggle **automatisch** schalten?
2. **Reihenfolge/Flut** — ein Browser ist kein Server; bei vielen gleichzeitigen Fragen:
   Warteschlange? Priorisierung? (heute Rate-Limit ~6/min, kein persistenter Queue,
   single-threaded).
3. **Eigene Frage vs. fremde Fragen** — asymmetrisch; wer hat Vorrang?

---

## 2. Der verfassungsfeste Rahmen (was NICHT geht)

Zwei Leitplanken aus `CLAUDE.md` begrenzen den Lösungsraum **hart** — sie sind der Grund,
warum „immer erreichbar wie ein Server" kein gültiger Weg ist:

- **Empfangsmodus mit Antwortrecht.** „Kein Crawler, keine **Pulsation**, keine
  Eigenanfragen ins offene Netz." Ein Knoten, der dauerhaft von selbst lauscht und
  antwortet, ohne dass der Nutzer ihn dafür eingeschaltet hat, wäre eine Pulsation —
  **verboten**. Antworten bleibt eine **bewusste Nutzer-Handlung**.
- **Browser-Realität.** Hintergrund-Tabs werden gedrosselt/schlafen gelegt; es gibt
  **keinen** server-losen Weg, einen geschlossenen/backgrounded Browser „erreichbar" zu
  halten. Ein „Immer-an" wäre ein **Versprechen, das die Plattform nicht hält** — und
  damit gegen die Ehrlichkeits-Leitplanke.

**Schluss:** Die richtige Antwort auf „Erreichbarkeit" ist **nicht** ein Dauer-Server,
sondern ein **Briefkasten** — Fragen und Antworten überleben eine Zeitverzögerung, ohne
dass irgendwer dauernd wach sein muss. Genau das ist bereits gebaut (§3).

---

## 3. Was bereits gebaut ist — das Briefkasten-Prinzip (A12 Phase 1–2d, 2026-07-11)

Klaus' Entscheid „Briefkasten-Prinzip" ist umgesetzt und headless bewiesen. Es beantwortet
Frage (1) **Erreichbarkeit** und den Kern von Frage (2) **Reihenfolge** verfassungsfest:

| Baustein | Was er löst | Fundstelle |
|---|---|---|
| **Antworter-Lookback** — `enableAnswering` lauscht `since: now − RDV_ANSWER_LOOKBACK_SEC` (30 min) statt nur „ab jetzt" | Eine Frage, die kam, während der Antworter **aus** war, wird beim **Einschalten nachgeholt**. „Aus" heißt nicht mehr „verloren", sondern „ungelesen". | `23_rendezvous.js`, `smoke_bau23b_query.mjs` 28/28 |
| **Frager-Nachlese** — `fetchAnswers(qids,{lookbackSec,waitMs})`; `askNode`-Timeout gibt `{pending:true, qid}` (Frage bleibt „offen") | Eine späte Antwort geht dem Frager nicht verloren; er liest sie über dasselbe Fenster nach. | `23_rendezvous.js` |
| **Sichtbarer 📬-Briefkasten** — ungelesen-Zähler an der Blase, **Auto-Nachlese beim Öffnen**, „📬 Antworten abholen (N)", Quittung ⏳/✓ | Lehre aus dem git-Briefkasten: ein Briefkasten scheitert am **Lesen**, nicht am Schreiben → Lesen **sichtbar + automatisch**. | `23_rendezvous_ui.js`, `smoke_bau23_rendezvous_ui.mjs` 58/58 |
| **Lebenszyklus/Überladungs-Schutz** — erledigt→weg, offene laufen nach TTL (45 min) ab, „🔄 offene nochmal fragen", „🗑 leeren", `RDV_MAILBOX_MAX` (Default 20) | Frage (2) Flut auf **Client-Seite**: der lokale Briefkasten kann nicht überlaufen. | `23_rendezvous_ui.js` |
| **Rate-Limit im Antworter** — `underRateLimit`, 6 Antworten/min; `qidSeen`-Dedupe | Frage (2) Flut auf **Antworter-Seite**: ein lauter Frager kann den Browser nicht lähmen; Doppel-Fragen werden einmal beantwortet. | `enableAnswering().onQuery`, Modul 23 |

**Ehrliche Rest-Grenze (unverändert, benannt):** Die **Aufbewahrungsdauer regelt das
Relais** (`relay.family-projekt.de`), nicht der Client — sie begrenzt, wie lange eine Frage
liegen darf, und der Client kann Relais-Ereignisse nicht zuverlässig löschen. Das ist eine
Eigenschaft des server-losen Transports, kein Bug.

---

## 4. Antwort je Frage (Empfehlung)

### (1) Erreichbarkeit → **Briefkasten, kein Auto-Always-On.** ✅ entschieden

- **Kein** automatisches Dauer-Einschalten des Antwortens (wäre Pulsation, s. §2).
- **Empfohlene, verfassungsfeste Bequemlichkeit** statt Auto-Always-On: ein rein
  **lokaler, nutzer-gesetzter** Merker „beim Öffnen dieser App Antworten gleich
  anschalten" (opt-in, Default **aus**, pro App/Origin in `localStorage`). Das ist
  **keine** Pulsation — es wirkt nur, während der Nutzer die App **selbst offen** hat,
  und er hat es **selbst** eingeschaltet. Es verschiebt nichts an der Browser-Realität
  (geschlossen bleibt unerreichbar), macht aber den Briefkasten-Nachlese-Effekt beim
  nächsten echten Öffnen automatisch wirksam. **Status: Idee, nicht gebaut — Klaus' Wahl**
  (kleiner Zusatz in `23_rendezvous_ui.js`, reine Anzeige/Bequemlichkeit).

### (2) Reihenfolge/Flut → **im Kern gelöst; kleine Fairness-Idee offen**

- Der **Antworter** ist durch Rate-Limit (6/min) + `qidSeen`-Dedupe gegen Flut geschützt;
  heute gilt **first-come-first-served** innerhalb des Fensters (single-threaded, kein
  persistenter Queue). Das ist für die reale Netzgröße (Dutzende Knoten, nicht Tausende)
  **ausreichend** — ein voller persistenter Prioritäts-Queue wäre Über-Engineering gegen
  eine Last, die es (noch) nicht gibt (vgl. Schutz-Backlog-Doktrin: erst bauen, wenn die
  Angriffsfläche real ist).
- **Offene, kleine Fairness-Idee** (Modul 11, optional): Wenn **viele verschiedene**
  Frager gleichzeitig anfragen, soll das Token-Bucket **pro Frager** greifen (statt einer
  globalen Antwort-Quote), damit ein einzelner lauter Frager nicht das ganze Minutenkontingent
  aufbraucht und andere aushungert. Modul 11 spezifiziert dafür bereits
  `QUERY_RATE_PER_PEER_PER_MIN`/`QUERY_BURST` (`docs/components/11_rate_limit.md` §Defaults) —
  Modul 23 nutzt heute aber ein **globales** Antwort-Limit. Das Angleichen (pro-Peer statt
  global) ist der **einzige** konkrete Bau-Rest von A12. Klein, additiv, gatet nichts.

### (3) Eigene vs. fremde Fragen → **eigene zuerst, per Design bereits so**

- Die **eigene** Frage (`askNode`/„🔎 Antwort holen") ist eine **synchrone Nutzer-Handlung**
  im Vordergrund; das **Beantworten fremder** Fragen läuft nur, wenn „Antworten: an" **und**
  der Tab wach ist. Damit hat die eigene Frage strukturell bereits Vorrang — es braucht
  **keinen** expliziten Scheduler. Bei der optionalen pro-Peer-Fairness (§4.2) zählt der
  eigene Knoten nicht als „Peer" gegen sich selbst; die Asymmetrie bleibt gewahrt.

---

## 5. Ergebnis & Empfehlung

- **A12 als Modell ist entschieden und größtenteils gebaut.** Das Briefkasten-Prinzip
  (Phase 1–2d) ist die verfassungsfeste Antwort auf „Erreichbarkeit ohne Server". Ein
  „Immer-erreichbar" wird **bewusst nicht** gebaut (Empfangsmodus + Browser-Realität +
  Ehrlichkeit).
- **Offen bleiben nur zwei kleine, optionale, additive Bauten** — beide Klaus' Wahl, keiner
  blockiert irgendetwas, keiner berührt `PROVIDER_MIN_MATCH`/den 0.80-Riegel oder die
  Kern-Module 02/05/05b:
  1. **Pro-Peer-Antwort-Fairness** (Modul 23 nutzt Modul-11-Token-Bucket pro Frager statt
     globaler Quote) — der eigentliche „Flut-Reihenfolge"-Rest.
  2. **Lokaler „beim Öffnen gleich antworten"-Merker** (opt-in, Default aus) — reine
     Bequemlichkeit, verfassungsfest.
- **Empfehlung:** A12 als **Spec/Konzept abschließen** (dieses Dokument), die zwei Resten
  als **optionale Folge-Bauten** in der Liste vermerken. Kein zwingender Bau nötig, um das
  Netz „real" zu halten — der Kern trägt.

---

## 6. Was dieses Dokument NICHT tut

- Es baut **keinen** Dauer-Server, **keine** Pulsation, **keinen** Hintergrund-Daemon.
- Es ändert **keinen** Draht-Vertrag (INTERFACES unberührt), **keinen** Kern (02/05/05b),
  **keinen** Riegel (0.80 / `PROVIDER_MIN_MATCH`), **keine** Protokoll-Version.
- Es ersetzt **nicht** Klaus' Browser-Sichttest der bereits gebauten Briefkasten-UI.
