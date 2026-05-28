# Brief — Spec-Sitzung Modul 18 Sub (a) Vorab (Andocken-API)

**Anlass:** Klaus' Wunsch 2026-05-28: der `[Andocken]`-Knopf im
Modul-16-Sub-(e)-Bronze-Hinweis-Modal soll funktional werden, ohne
dass die volle Modul-18-Spec-Sitzung (alle 9 Sub-Bereiche) erst
gelaufen ist. Die Voll-Spec-Sitzung 18 ist Pipeline-Phase A 5h
(nach App-Freigabe geplant) — der Andock-Knopf hängt aber heute
schon fail-soft in der Modul-16-Modal-Render-Schicht und wartet auf
`SbkimToolPwa.openAndockTab`.

**Pipeline-Stellung:** Phase A — neuer Schritt **5m** (Spec + Bau
Modul 18 Sub (a) Vorab). Setzt voraus, dass Modul 16 Sub (e) gebaut
ist (PR #180, erledigt 2026-05-26). Vorab-Lösung bis zur Voll-Spec
Modul 18 (Phase A 5h).

**Branch-Vorschlag:** `claude/spec-18-sub-a-vorab`

**Grund für Vorab statt Voll-Spec:**

- Modul 16 Sub (e) Bronze-Modal hat den `[Andocken]`-Knopf bereits
  fail-soft eingebaut (`typeof window.SbkimToolPwa?.openAndockTab ===
  "function"` → bei Fehlen: Info-Notiz „Modul 18 noch nicht verfügbar —
  Andocken via Sage-Page-Andock-Wizard").
- Klaus' Endknoten (Mein-Rezeptbuch + Mein-Mixarium) zeigen aktuell
  diese Info-Notiz — gewollt fail-soft, aber **funktional limitiert**.
- Voll-Spec-Sitzung 18 ist mit 9 Sub-Bereichen sehr umfangreich (Sub
  a–i, je eigene Modal-Form + Schema + Risiken-Analyse). Bis dahin
  wartet der Andock-Knopf.
- Sub (a) allein ist **kleine, abgegrenzte Lösung**: einzige API
  `SbkimToolPwa.openAndockTab(url?)`, das ein Andock-Modal öffnet
  mit dem 4-Schritt-Workflow aus Karte 18 § Sub (a).

---

## Was Sub (a) Vorab umfasst

### Minimal-API (Spec-Skizze)

```js
window.SbkimToolPwa = {
  init: function (options) {
    // Promise<void>, idempotent.
    // options.endknotenMeta: domain, endpoint, domainKeywords,
    //                       stammCategories?, guestCategories?
    // options.externalHubUrl?: string | null (Default null)
    // options.bindToSiegelSlot?: boolean (Default true)
  },
  openAndockTab: function (url) {
    // Öffnet 4-Schritt-Andock-Modal.
    // url optional: vorgefüllter URL-Wert (z.B. via deep-link
    // oder aus Modul 18 Sub (i) Spore-Discovery, später).
  },
  close: function () { /* schließt das Modal */ },
  isOpen: function () { /* boolean */ },
  _meta: { /* Read-Anker */ },
};
```

**Surface-Disziplin:** nur fünf Funktionen, kein voller Tool-PWA-
Container. Alle Modul-18-Sub-(b)–(i)-Bereiche (Heterokaryose,
Identitäts-Wechsel, Backup, Self-Apoptose, Sporen-Regeneration,
Re-Embedding, Manueller Handshake, Spore-Discovery) bleiben für die
Voll-Spec-Sitzung 18. **`open(subBereich?)`-Tab-Navigation aus der
Voll-Spec-Skizze ist NICHT in Sub (a) Vorab.**

### Vier-Schritt-Andock-Workflow

Aus Karte 18 § Sub (a):

1. **URL eingeben** — `<input type="url">` mit Placeholder
   („z.B. https://lausiklauskn-png.github.io/Mein-Mixarium/"). Bei
   `openAndockTab(url)`-Aufruf mit `url` wird das Feld vorausgefüllt.
2. **Spore fetchen** — `fetch(url + "/sbkim/spore.json")`. Bei
   Fehler („404", „CORS", „JSON-Parse") → klare Fehlerbox mit
   Hinweis + Re-Try-Knopf.
3. **Match-Check** — `SbkimMatch.match(ownDomainVector,
   foreignDomainVector)`. UI zeigt Match-Score:
   - Score ≥ 0.80 → Grün + „Andocken möglich".
   - Score 0.40 – 0.79 → Gelb + Hinweis „Match unter Schwelle
     (`PROVIDER_MIN_MATCH`). Trotzdem versuchen?" + zweiter
     Bestätigungs-Klick.
   - Score < 0.40 → Rot + „Domain-Vektoren passen nicht zusammen".
     Hartes Abbrechen, kein Trotzdem-Knopf.
4. **Handshake** — `SbkimAnastomose.handshake(foreignSpore,
   ownDomainVector)`. Erfolgsfall: `outcome:"established"` →
   Modal zeigt Erfolgs-Meldung + automatisches Modul-16-Sub-(e)-
   Bronze→Gold-Wechsel (via `dispatchEvent("sbkim:handshake")`,
   bereits seit Bau 17 dispatched).

### Modal-Form (Vorab)

- **Eigenständig in `document.body`** analog Modul 15 Fremdzugriff-
  Modal + Modul 16 Erklär-Modal.
- **Vier Schritte als Wizard-Form** (Step 1/4 / Step 2/4 / Step
  3/4 / Step 4/4 in Modal-Header) ODER **Single-Page mit allen
  Feldern sichtbar** (Spec-Sitzung entscheidet — Wizard ist
  Endnutzer-freundlicher, Single-Page schneller für
  technisch-orientierte User).
- **Schließen via:** Backdrop-Klick / Esc-Keydown / ✕-Button —
  alle drei äquivalent. Bei laufendem Fetch/Handshake: Bestätigungs-
  Dialog „Andock-Vorgang läuft, wirklich abbrechen?".

---

## Drei offene Spec-Punkte (Sub-(a)-Vorab-Spec entscheidet)

### Spec-Punkt 1 — Embedding-Lazy-Trigger

**Frage:** Wer triggert das Modul 03 Embedding-Lazy-Load (~30 MB
Modell), wenn die Endknoten-PWA noch nicht selbst embedded hat?

**Optionen:**

- **a)** `openAndockTab()` lädt Modul 03 sofort beim Modal-Öffnen
  (impliziter Trigger, User sieht „Embedding wird geladen…").
- **b)** `openAndockTab()` lädt Modul 03 erst beim Match-Check-
  Schritt (Step 3/4), wenn `SbkimMatch.match()` aufgerufen wird.
  Vorher leichtgewichtig (URL + Spore-Fetch ohne Embedding).
- **c)** Endknoten-Bauer-Pflicht: vor dem `openAndockTab()`-Aufruf
  muss Modul 03 schon geladen sein (Lazy-Load in `sbkim-init.js`).

**Spec-Empfehlung:** **b)** — lazy beim Match-Check. Spore-Fetch
darf ohne Embedding laufen (Schritte 1 + 2). User sieht Progress-
Anzeige in Schritt 3.

### Spec-Punkt 2 — Match-Schwelle-UI

**Frage:** Wie reagiert das Modal auf Match-Scores unterhalb der
`PROVIDER_MIN_MATCH=0.80`?

**Optionen:**

- **a)** Hartes Abbrechen — Score < 0.80 zeigt „Domain passt nicht"
  und blockt den Handshake.
- **b)** Drei-Stufen-Anzeige (Score-Empfehlung in dieser Sub-(a)-
  Vorab-Spec):
  - ≥ 0.80 → Grün, „Andocken möglich".
  - 0.40 – 0.79 → Gelb, „Match unter Schwelle, trotzdem versuchen?"
    (zweiter User-Klick erforderlich).
  - < 0.40 → Rot, hartes Abbrechen.
- **c)** Aufweich-Knopf für jeden Score-Wert (User kann immer
  trotzdem-Andocken).

**Spec-Empfehlung:** **b)** — Drei-Stufen-UI, weil Klaus'
Forker-Knoten mit unterschiedlichen `domainKeywords` und
unterschiedlichen Embedding-Versionen reale Edge-Cases haben
werden (Vegan-Rezeptbuch vs. allgemein-Rezeptbuch könnte 0.65
liefern — gerade so unter Schwelle). User-Entscheidungs-Anker
sinnvoll.

### Spec-Punkt 3 — Endknoten-Init-Schema

**Frage:** Wie wird `endknotenMeta` (`domain` + `endpoint` +
`domainKeywords` + Kategorien) an `SbkimToolPwa.init()` übergeben?

**Optionen:**

- **a)** Endknoten-Bauer übergibt `endknotenMeta` explizit
  beim `init({endknotenMeta: {...}})`-Aufruf in `sbkim-init.js`.
- **b)** Modul 18 fragt **Modul 02 Spore** (`SbkimSpore.getOwnSpore()`)
  ab und liest die Felder aus der eigenen Spore. Endknoten-Bauer
  muss keine extra Konfig schreiben.
- **c)** Mischung: Default aus Modul 02 Spore, Override via
  `init()`-Options.

**Spec-Empfehlung:** **c)** — Mischung. Endknoten-Bauer schreibt
nichts wenn nicht nötig (Default aus Spore); Override für Sonder-
Fälle (z.B. Sage-Page hat keine `domainKeywords` in der Spore,
muss sie explizit angeben). Konvention analog Modul 16
(`init({repoUrl})`-Override).

---

## Strikte Tabus (verbindlich)

- **KEIN automatisches Andock-Triggern.** Nur auf explizite User-
  Geste (`SbkimToolPwa.openAndockTab()`-Aufruf aus Modul 16 Sub (e)
  Bronze-Hinweis-Modal oder via Endknoten-eigenen Knopf).
- **KEIN Auto-Polling** für Andock-Ziele.
- **KEIN Modul-05-Code-Eingriff** (Sub (a) ruft `SbkimAnastomose.
  handshake()` als Konsument; Modul 05 unangetastet).
- **KEIN Modul-04-Code-Eingriff** (analog Modul 05).
- **KEIN Modul-16-Code-Eingriff in der Bau-Sitzung Sub (a) Vorab**
  (Modul 16 hat den fail-soft-Check schon eingebaut, Sub (a) macht
  ihn nur produktiv).
- **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump**
  (Sub (a) ist UI-Schicht, nicht protokoll-aktiv).
- **KEINE Sub-(b)–(i)-Funktionen** (alle anderen Sub-Bereiche
  bleiben für die Voll-Spec-Sitzung 18). Sub-(a)-Vorab darf
  KEINEN `open(subBereich?)`-Tab-Switch enthalten — `openAndockTab`
  ist die EINZIGE Modal-Funktion.
- **KEIN Endknoten-Eingriff in der Spec-Sitzung** (Bau-Briefe MR +
  MM kommen NACH der Spec-Sitzung + Bau-Sitzung Sub (a) Vorab).

---

## Was die Spec-Sitzung zu entscheiden hat

1. **Drei offene Spec-Punkte** oben (Embedding-Lazy / Match-Schwelle-
   UI / Endknoten-Init-Schema).
2. **Modal-Form:** Wizard-4-Schritte oder Single-Page mit allen
   Feldern.
3. **Error-Klassen:** brauchen wir benannte Error-Klassen für Sub
   (a) (z.B. `SporeFetchError`, `MatchTooLowError`,
   `HandshakeRejectedError`), oder reichen fail-soft-`console.warn`
   wie in Modul 16? Spec-Empfehlung: benannte Error-Klassen, weil
   Andock-Flow User-facing ist und klare Fehler-Meldungen braucht.
4. **CSS-Anker:** eigene `:root`-Variablen oder Mitnutzung von Modul
   16 `--siegel-*` / Modul 17 Widget-CSS? Spec-Empfehlung: eigene
   `--toolpwa-*`-Variablen, weil die Modal-Optik anders sein soll
   (heller / freundlicher als Modul 16-Bronze-Ink).
5. **Test-Setup:** Panel 18 in `tests/manual_check.html` mit wie
   vielen Knöpfen? Spec-Empfehlung: 5 Knöpfe (Setup + 4 Test-Punkte
   für die vier Andock-Schritte mit Mock-Spore).
6. **Headless-Smoke-Test:** wie viele Proben? Spec-Empfehlung:
   ~15 (analog Modul 16 Sub (e)).
7. **Endknoten-Einbau:** Karte 09 § Schritt 10 muss um eine Zeile
   ergänzt werden (`<script src="src/modules/18_tool_pwa.js">` + ein
   `SbkimToolPwa.init({...})`-Aufruf in `sbkim-init.js`). Eigene
   Folge-Pflege Karte 09 ODER in der Sub-(a)-Bau-Sitzung mit-erledigt?
   Spec-Empfehlung: eigene Folge-Pflege Karte 09 (Disziplin: Karte
   pro PR).
8. **`bindToSiegelSlot:true`-Verhalten:** soll Modul 18 selbst einen
   Click-Listener auf den SIEGEL-Slot anhängen, oder erwartet Modul
   18 dass Modul 16 / Modul 17 den Listener registriert und
   `openAndockTab()` aufruft? Spec-Empfehlung: Modul 18 hängt KEINEN
   Listener an (Render-Schicht-Disziplin). Modul 16 Sub (e) ruft im
   Bronze-Hinweis-Modal-`[Andocken]`-Knopf-Handler bereits
   `window.SbkimToolPwa?.openAndockTab()` (fail-soft) auf — das
   reicht.

---

## Folge-Briefe (nach Spec-Sitzung Sub (a) Vorab)

- **`BRIEF_BAU_18_SUB_A_VORAB.md`** — Bau-Sitzung des Vorab-Codes
  (`src/modules/18_tool_pwa.js` mit der Minimal-API + 4-Schritt-
  Andock-Modal-Code + Panel 18 in `tests/manual_check.html` +
  Headless-Smoke).
- **Optional `BRIEF_PFLEGE_09_MODUL_18_EINBAU.md`** — Karte 09
  Schritt 10 um Modul 18 Sub (a) Einbau erweitern.
- **`BRIEF_BAU_ENDKNOTEN_MODUL_18_MR.md`** + `_MM.md` — Endknoten-
  Sitzungen, Modul 18 Sub (a) in MR/MM kopieren + `init()`-Aufruf.

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Spec-Sitzung Modul 18 Sub (a) Vorab — finalisiere
die Voll-Spec für die Minimal-Andock-API SbkimToolPwa.openAndockTab,
ausschließlich Sub-Bereich (a) aus Karte 18. Die Voll-Spec der
9 Sub-Bereiche bleibt für eine spätere Spec-Sitzung 18.

Branch: claude/spec-18-sub-a-vorab (vom main aus anlegen).

PFLICHT-VERIFIKATIONS-SCHRITT (vor allem anderen):

1. git fetch origin && git checkout main && git pull origin main.
2. CLAUDE.md komplett (vor allem § Pipeline-Reihenfolge Phase A 5m).
3. docs/PULS.md § Schnellüberblick + JÜNGSTE Sitzungs-Einträge.
4. status.json modules + toolPwaBacklog.
5. docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md (dieser Brief — Voll-
   Skelett der Vorab-Spec mit drei offenen Spec-Punkten).
6. docs/components/18_tool_pwa.md (KOMPLETT — § Sub (a) Andocken
   ist die Spec-Vorlage; § Sub (b)–(i) bleiben für Voll-Spec 18).
7. docs/components/16_siegel.md § Sub (e) — Bronze-Hinweis-Modal mit
   [Andocken]-Knopf + fail-soft-Check auf SbkimToolPwa.openAndockTab.
8. docs/components/05_anastomose.md § handshake-API + 09_einbau_pwa.md
   § Schritt 10 (Endknoten-Einbau-Pflicht).
9. docs/components/04_match.md § match-API (Pre-Check-Schwelle 0.80).

Deine Aufgabe:

A. **Karte 18 ergänzen** um neuen § „Sub (a) Vorab-Spec (final)"
   am Ende der Sub-(a)-Skizze. Drei offene Spec-Punkte entscheiden:
   - Embedding-Lazy-Trigger: a/b/c (Empfehlung: b).
   - Match-Schwelle-UI: a/b/c (Empfehlung: b — Drei-Stufen).
   - Endknoten-Init-Schema: a/b/c (Empfehlung: c — Mischung).
   Plus Modal-Form-Frage (Wizard vs. Single-Page), Error-Klassen-
   Liste, CSS-Anker-Wahl, Test-Setup-Form, bindToSiegelSlot-
   Verhalten — alle aus Brief § "Was die Spec-Sitzung zu
   entscheiden hat".

B. **INTERFACES.md ergänzen** um Modul-18-Sub-(a)-Block (Public
   Surface init/openAndockTab/close/isOpen/_meta).

C. **status.json toolPwaBacklog-Eintrag** ergänzen — Sub-(a)-
   Vorab-Bauzustand-Marker. NICHT versions-bumpen, NICHT score
   ändern (bleibt `schablone` bis Bau-Sitzung).

D. **CLAUDE.md ergänzen** — § Pipeline Phase A neuer Schritt 5m
   (Spec + Bau Sub (a) Vorab) in der Tabelle einfügen.

E. **Brief-Codeblock-Block für Folge-Briefe** — BRIEF_BAU_18_SUB_A_
   VORAB.md als Stub + optional Pflege-Brief Karte 09. Klaus'
   Konvention 2026-05-21: wortwörtlich in der Chat-Antwort am
   Sitzungs-Ende ausgeben.

Was du NICHT tust:

- KEIN Modul-Code in src/.
- KEIN Endknoten-Eingriff.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump
  (Sub a ist UI-Schicht).
- KEINE Tafel-Umsortierung CLAUDE.md ohne Klaus' explizite
  Bestätigung.
- KEINE Sub-(b)–(i)-Funktionen spec'n (bleiben für Voll-Spec 18).
- KEINE INTERFACES.md-Erweiterung für die anderen Sub-Bereiche.

Sitzungs-Ende-Pflicht (CLAUDE.md § Pflicht am Sitzungsende):

- PULS-Eintrag mit Datum + getan + offen + nächster Schritt.
- Übergabeprotokoll docs/sessions/archiv/YYYY-MM-DD_spec-18-sub-a-
  vorab.md.
- Commit + Push + Draft-PR.
- "Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort.
- Brief-Codeblock für die Folge-Bau-Sitzung wortwörtlich in der
  Chat-Antwort.

Klaus' Arbeitsumgebung-Konvention (seit 2026-05-27): Klaus gibt am
Sitzungs-Beginn Uhrzeit an für Zeit-Abschätzung.
```

---

## Querverweise

- **Karte 18 Tool-PWA** (`docs/components/18_tool_pwa.md`) — § Sub
  (a) Andocken hat die Vier-Schritt-Workflow-Skizze; diese Vorab-
  Spec finalisiert nur Sub (a), die übrigen acht Sub-Bereiche
  bleiben für Voll-Spec-Sitzung 18 (Phase A 5h, nach App-Freigabe).
- **Karte 16 Siegel** (`docs/components/16_siegel.md`) — § Sub (e)
  Bronze-Hinweis-Modal mit fail-soft-`[Andocken]`-Knopf wartet auf
  `SbkimToolPwa.openAndockTab` (PR #180, Bau-Sitzung 16 Sub (e)).
- **Karte 05 Anastomose** (`docs/components/05_anastomose.md`) —
  `SbkimAnastomose.handshake(foreignSpore, ownDomainVector)` ist
  der vierte Schritt im Andock-Workflow.
- **Karte 04 Match** (`docs/components/04_match.md`) —
  `SbkimMatch.match()` liefert den Pre-Check-Score; Schwelle
  `PROVIDER_MIN_MATCH=0.80`.
- **Karte 09 Einbau-PWA** (`docs/components/09_einbau_pwa.md`) —
  Schritt 10 muss in einer Folge-Pflege um Modul 18 erweitert
  werden (Pflicht nach Bau-Sitzung Sub (a)).
- **Brief Multisuchfeld** (`docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md`)
  — parallele Spec-Sitzung; Multisuchfeld hat einen unabhängigen
  Pfad, nutzt aber dieselbe Pilz-Schicht-Disziplin und referenziert
  Modul 18 Sub (a) als Folge-Knoten (Sub (i) Spore-Discovery führt
  Treffer zu `SbkimToolPwa.openAndockTab(url)`).

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Brief angelegt | 2026-05-28 | Plansitzung Multisuchfeld-Brief | Klaus' Wunsch 2026-05-28: Modul 16 Sub (e) Bronze-Hinweis-Andock-Knopf produktiv machen ohne auf Voll-Spec 18 (alle 9 Sub-Bereiche) warten zu müssen. Vorab-Pfad = nur Sub (a) Minimal-API, eigene Spec-Sitzung + Bau-Sitzung. KEIN Modul-Code in dieser Plansitzung. |
| Spec-Sitzung Sub (a) Vorab | — | Spec-Sitzung | folgt — finalisiert drei offene Spec-Punkte (Embedding-Lazy-Trigger / Match-Schwelle-UI / Endknoten-Init-Schema) + Modal-Form + Error-Klassen + CSS-Anker + Test-Setup. |
| Bau-Sitzung Sub (a) Vorab | — | Bau-Sitzung | folgt — `src/modules/18_tool_pwa.js` mit Minimal-API + 4-Schritt-Modal + Panel 18 in `tests/manual_check.html` + Headless-Smoke. |
| Endknoten-Einbau MR + MM | — | Endknoten-Sitzungen (extern) | folgt — Modul 18 Sub (a) in `Mein-Rezeptbuch` + `Mein-Mixarium` kopieren + `init()`-Aufruf. Karte 16 Sub (e) Bronze-Hinweis-Andock-Knopf wird damit produktiv (statt fail-soft-Info-Notiz). |
| Voll-Spec-Sitzung 18 (alle 9 Sub) | — | Voll-Spec-Sitzung 18 | bleibt Pipeline-Phase A 5h (nach App-Freigabe). Sub-(a)-Vorab bleibt rückwärts-kompatibel: Voll-Spec 18 erweitert das Modul additiv um Sub (b)–(i). |
