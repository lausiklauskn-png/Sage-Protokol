# Brief — Spec-Sitzung 15.B Membran Sub (a) + Sub (b)

**Anlass:** Pipeline-Schritt **4** aus der CLAUDE.md-Tafel
„Pipeline-Reihenfolge bis App-Freigabe (verbindlich, 2026-05-24)".
Karte 15 hat Sub (a) Read-API und Sub (b) postMessage-Brücke als
**Grob-Spec 2026-05-24** (Spec-Sitzung 15), die finale Detail-Spec
fehlt — sie ist verbindliche Voraussetzung für die Endknoten-
Migration (Pipeline-Schritt 5) und für die App-Freigabe
(Pipeline-Schritt 6).

Zusätzlicher Anlass: **Siegel-Hook im `read()`-Snapshot** —
INTERFACES § 1 Modul 16 § Garantien-Block (Modul-16-Spec-Sitzung
2026-05-24, Zeilen 2672-2677) hat das Snapshot-Feld
`siegel: { isCertified, repoUrl, certifiedModules }` **vorbestellt**
für Spec-Sitzung 15.B. Modul 16 stellt die sync getter (`isCertified()`
+ `getExplanation()` + `getCertifiedModules()`) bereit; Spec-Sitzung
15.B entscheidet das endgültige Snapshot-Schema des Siegel-Felds.

**Branch (Vorschlag):** `claude/spec-15b-membran`

**Voraussetzungen:**

- PR #156 (Pflege CLAUDE.md § „Sicherheits-Module pflegen Aspekte")
  ist auf `main` — Pflicht-Konvention für künftige
  Sicherheits-Bau-Sitzungen verankert (also auch für Bau 15.B).
- PR #152 (Bau-Sitzung 16) + PR #154 (Pflege Wappen/Korona) +
  PR #151 (Spec-Sitzung 16) sind auf `main`. Modul 16 Code-Stub +
  INTERFACES § 1 Modul 16 sind live; Siegel-Hook-Vorbestellung ist
  damit verbindlich.
- Keine parallel offene PR-Schicht in `src/modules/15_membran.js`
  oder Karte-15-Doku (Stand bei Brief-Anlage: keine).
- **Klaus' verbindliche Festlegungen aus Karte 15 § Sub (a)+(b)
  Grob-Spec 2026-05-24** sind Spec-Vorgaben — die Sitzung kann
  Details füllen, aber NICHT den globalen Namen
  (`window.SbkimMembrane`) ändern, NICHT die Sub-(e)-Hook-Pflicht
  kippen (jedes `read()` triggert einen Eintrag), NICHT die strikte
  Origin-Allowlist verwerfen.

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md (Schnellüberblick + jüngste Sitzungs-Einträge 2026-05-24 / 2026-05-25 zu Modul 15 + Modul 16)
3. docs/INTERFACES.md (§ 0 Konstanten, § 1 Modul 15 — du wirst hier den Sub-(a)+Sub-(b)-Block füllen — und § 1 Modul 16 § Garantien-Block, dort steht die Siegel-Hook-Vorbestellung)
4. docs/components/15_membran.md (deine Karte, KOMPLETT lesen — sie ist die Vertragsgrundlage; Sub (a) + Sub (b) sind Grob-Spec 2026-05-24, du füllst beide final)
5. docs/components/16_siegel.md (Karte 16 § Schnittstelle + § Sub (a) Pflicht-Modul-Liste — der Siegel-Hook im Snapshot braucht das Schema von dort)
6. src/modules/15_membran.js (NUR § Sub (e) `fremdzugriff`-Namespace + IIFE-Header — der ist die Architektur-Vorbild für Sub (a) + Sub (b) Code; KEIN Code-Eingriff in dieser Spec-Sitzung)
7. src/modules/16_siegel.js (NUR Public Surface `isCertified` / `getExplanation` / `getCertifiedModules` — für den Snapshot-Hook; KEIN Code-Eingriff)
8. sbkim-init.js (NUR der `SbkimMembrane.init()`-Block — Anker für die spätere Allowlist-Konfiguration in Sub (b))

Deine Aufgabe:

PRIMÄR — Karte 15 § Sub (a) Read-API + Sub (b) postMessage-Brücke vollständig spec-iieren:

1. **Sub (a) Read-API — finale Feld-Liste:**
   - Anker aus Grob-Spec 2026-05-24: `protocolVersion / nodeId / domain / sporeUrl / siblings[] / storage{}`.
   - **Entscheidung Spore-Felder**: `domainKeywords`, `stammCategories`, `guestCategories` aus der Spore mitliefern? Vorschlag: ja (alle drei), weil sie öffentlich in der Spore-JSON stehen.
   - **Entscheidung Geschwister-Anonymisierung**: `nodeIdHash = base64url-sha256(nodeId)` reicht, oder per-Session-Salt (Spec-Sitzung 15 § Sub (a) offene Frage)? Vorschlag: ohne Salt — Karte 15 Grob-Spec lieferte `nodeIdHash` ohne Salt; Salt-Variante eskaliert ohne klaren Bedrohungs-Modell-Anlass.
   - **Entscheidung Geschwister-Felder**: nur `{ nodeIdHash, since, status }` oder zusätzlich `score` / `lastSeen`? Vorschlag: minimal, ohne `score` (zu nah am Empfehlungs-Pfad, den Sub (a) NICHT exponieren darf — Karte 15 § Strikte Tabus).
   - **Entscheidung Quota-Verhalten**: blockiert eine Quota-Warnung (`warningLevel:"ratio"|"bytes"|"both"`) den `read()`-Pfad, oder ist `read()` immer verfügbar? Vorschlag: immer verfügbar (Empfangsmodus-Prinzip — `read()` ist Beobachtungs-Schicht, nicht Storage-Schreiber). Karte 15 § Sub (a) entscheidet.
   - **Siegel-Hook-Feld (vorbestellt aus INTERFACES § 1 Modul 16 Garantien-Block):** `siegel: { isCertified: boolean, repoUrl: string | null, certifiedModules: ModuleStatusEntry[] }` im Snapshot. Aufgelöst über `window.SbkimSiegel.isCertified()` / `_meta.repoUrl` / `getCertifiedModules()`. Spec entscheidet:
     - Fail-Modus wenn Modul 16 fehlt/nicht initialisiert: `siegel: null` (Vorschlag) oder Feld gar nicht im Snapshot? Vorschlag: `siegel: null` mit Doku-Hinweis im Feld, damit Agent zwischen „Modul 16 nicht vorhanden" und „nicht zertifiziert" unterscheiden kann.
     - Wenn `isCertified() === false` (binärer Fail aus Karte 16): trotzdem `siegel: { isCertified:false, ... }` (Vorschlag, transparent für Agent) oder `siegel: null`?
     - Welche Felder aus `certifiedModules`: voller Eintrag (`{ id, name, surfaceFn, status }`) oder nur `{ id, status }`? Vorschlag: voll — der Agent darf sehen, welche Pflicht-Module ok/missing/broken sind.
   - **Anti-PII-Klausel** (Pflicht-Bestätigung): `sbkim_keys` NIEMALS, nodeId-Klartext der Geschwister NIEMALS, navigator.userAgent NIEMALS (Karte 15 § Strikte Tabus für Sub (a)). Klaus' API-Key (Modul 04.B) NIEMALS — der lebt nur in `sbkim_keys`/Modul 02.
   - **Sub-(e)-Hook-Bestätigung**: jeder `read()` triggert `_recordForTest`-äquivalent in den Fremdzugriff-Ringbuffer (`kind:"membrane-read"`, `decision:"accepted"`, `origin:null`, `agentHint:navigator.userAgent.slice(0,64)`, `details:{ fieldsRequested:null, snapshotByteLen: <JSON.stringify(snapshot).length> }`). Genau so wie in Karte 15 § Sub (a) Hook-Block bereits fixiert — finale Spec bestätigt nur.

2. **Sub (b) postMessage-Brücke — finale Spec:**
   - **Allowlist-Format**: strict String (`"https://lausiklauskn-png.github.io"`, exakter Origin-Match) — Karte 15 Grob-Spec 2026-05-24 hat sich darauf festgelegt; Spec bestätigt + prüft Sonder-Wert `"*self*"` für same-origin (Vorschlag: NICHT nötig, same-origin gilt ohnehin nicht als Fremd-Origin und wird nicht durch Allowlist gefiltert).
   - **Konfigurations-Pfad** (fixiert in Grob-Spec): per `SbkimMembrane.init({ allowedOrigins: [...] })` im Andocker — Spec bestätigt + entscheidet Validierungs-Strenge (sync Throw bei ungültigem Format vs. fail-soft `console.warn`).
   - **Sender-Mechanismus**: Spec entscheidet zwischen drei Optionen für die Andocker-Empfehlung — `window.open()`-Popup (User-Geste-Pflicht, Chrome/Firefox), `iframe.contentWindow` (eingebettet, kein Popup, aber UI-Komplexität in der Sage-Page), `BroadcastChannel('sbkim')`-Fallback (same-origin only, Modul 05 nutzt das schon). Vorschlag: keine Spec-Vorgabe, sondern Modul liefert Vermerk „Sender-Pattern liegt beim Andocker; Modul 15 ist nur Empfänger der `message`-Events".
   - **Verhalten bei nicht-erlaubtem Origin**: stille Verwerfung am `addEventListener("message")` (Karte 15 Grob-Spec, plus Sub-(e)-Ringbuffer-Eintrag mit `decision:"rejected-allowlist"`). Spec bestätigt — KEIN neuer Store `sbkim_membrane_log` (Karte 15 § Persistenz-Entscheidung RAM-only).
   - **`op`-Tabelle final**: `sporeRef` / `query` / `hint` (Karte 15 Grob-Spec). Spec entscheidet pro `op` die genaue Payload-Form:
     - `sporeRef.payload = { nodeId, sporeUrl, domain }` (Anker für späteren Handshake — keine Daten, nur Verweis).
     - `query.payload = { text, k }` (semantische Anfrage analog `/sbkim/query`; `k` ist Top-K, Default 5).
     - `hint.payload = { vector, label, ttlMs }` (Empfehlungs-Lead analog Modul 14 Diffusion; schreibt in `sbkim_diffusion_leads` falls Modul 14 vorhanden — sonst Vermerk via `console.info` + Sub-(e)-Buffer mit `decision:"ignored"`).
     - **NIEMALS** `op:"handshake"` (Karte 15 § Strikte Tabus — Anastomose läuft durch HTTP/BroadcastChannel, nicht durch postMessage).
   - **Nonce-Pflicht**: jede Anfrage liefert `nonce: <crypto.randomUUID()>`; jede Antwort referenziert `inReplyTo: <nonce-der-Anfrage>`. Spec entscheidet, ob Antworten überhaupt spezifiziert werden (Vorschlag: `sporeRef` und `hint` sind Fire-and-Forget; `query` darf Antwort liefern mit `op:"queryResult"` als vierter Op-Variante, finale Spec bestätigt).
   - **Rate-Limit-Hook (Vorbestellung für Modul 11)**: Karte 15 § Sub (b) offene Frage — Spec entscheidet, ob Modul 15 selbst rate-limited (Vorschlag: NEIN, Karte 11 bekommt einen Hook `SbkimRateLimit?.checkOrigin(origin)`, fail-soft wenn Modul 11 nicht vorhanden — analog Siegel-Hook).
   - **Sub-(e)-Hook-Bestätigung**: jede eingehende `message` triggert einen Ringbuffer-Eintrag mit `kind:"membrane-postmessage"`, `decision: "accepted"` / `"ignored"` / `"rejected-allowlist"`, `origin: event.origin`, `details: { op, nonce }`. Karte 15 § Sub (b) Hook-Block hat das bereits fixiert — finale Spec bestätigt.

3. **INTERFACES.md § 1 Modul 15 erweitern:**
   - § Membran-Surface (`read()` / `postMessage`-Listener) als verbindlichen Block ergänzen — analog Modul 15 Sub-(e)-Block (Zeilen ca. 2355+, je nach `main`-Stand).
   - Snapshot-Schema von `read()` mit verbindlicher Feld-Liste + Pflicht-Felder vs. Optional-Felder.
   - `op`-Tabelle für postMessage mit Payload-Schema pro `op`.
   - § Garantien-Block: Sub-(a)-Tabus (kein `sbkim_keys` lesen, kein nodeId-Klartext, keine Schreiben), Sub-(b)-Tabus (kein `op:"handshake"`, Allowlist statisch, Nonce-Pflicht), Siegel-Hook-Vertrag (`siegel: null` wenn Modul 16 fehlt).
   - § Strikte Tabus: alle Karten-15-Tabus aus Sub (a) + Sub (b) gespiegelt.
   - **Aspekt-Eintrag im Siegel-Modal (Pflege-Pflicht aus CLAUDE.md § „Was du tust"):** Spec-Sitzung 15.B schreibt KEINEN `ZERTIFIKAT_ASPEKTE`-Eintrag — das ist Bau-Sitzungs-Pflicht, nicht Spec-Sitzungs-Pflicht. Die Bau-Sitzung 15.B (nächster Schritt nach dieser Spec) ergänzt den Aspekt.

4. **Karte 15 § Sub (a)+(b) finale Spec verankern:**
   - Karte 15 § Sub (a) Block: alle offenen Fragen (siehe Karte 15 Zeilen ca. 640-651) als entschieden markieren mit Verweis auf INTERFACES.
   - Karte 15 § Sub (b) Block: alle offenen Fragen (Karte 15 Zeilen ca. 653-667) als entschieden markieren.
   - Karte 15 § Status-Header: 🟨 Spec fertig (Sub (a)+(b) finalisiert 2026-05-25) — Datum entsprechend dem Sitzungs-Datum aktualisieren.

5. **Bau-Sitzungs-Brief anlegen** (`docs/sessions/BRIEF_BAU_15B_MEMBRAN.md`):
   - Branch-Vorschlag: `claude/bau-15b-membran`.
   - Voraussetzung: diese Spec-Sitzung 15.B gemerged.
   - Aufgabe: `src/modules/15_membran.js` um Sub (a) `read()` + Sub (b) postMessage-Listener erweitern, basierend auf finaler Spec.
   - Pflicht-Konvention aus CLAUDE.md § „Was du tust": Bau-Sitzung 15.B MUSS einen `ZERTIFIKAT_ASPEKTE`-Eintrag in `src/modules/16_siegel.js` ergänzen (Datum + „15" + ein-Satz-Beschreibung).
   - Headless-Smoke-Test-Liste + Panel-15-Erweiterung in `tests/manual_check.html`.

PRIMÄR — KEINE Bau-Arbeit. Spec-Sitzung:
- KEIN Code-Eingriff in `src/modules/15_membran.js`. KEIN Code-Eingriff in `src/modules/16_siegel.js`.
- KEINE Test-Brücke-Knöpfe in `tests/manual_check.html`. Panel 15 bleibt unberührt.
- KEIN Eingriff in `index.html`. KEIN Eingriff in `sbkim-init.js`.
- KEIN Sichttest — finale Spec ist Doku-Arbeit + Brief-Anlage.
- KEINE Tafel-Umsortierung (CLAUDE.md § „Pipeline-Reihenfolge" Schritt 4 bleibt Schritt 4).

Pflicht am Sitzungsende (CLAUDE.md § Pflicht am Sitzungsende):
1. `docs/PULS.md` Sitzungs-Eintrag oben einfügen.
2. `status.json` darf für Modul 15 von `🟨 Spec fertig (teilweise)` auf `🟨 Spec fertig (Sub a+b+e voll)` aktualisiert werden — falls ja, `python3 scripts/update_puls_pie.py` aufrufen.
3. Übergabeprotokoll `docs/sessions/archiv/<heute>_spec-15b-membran.md` anlegen.
4. Commit + Push auf `claude/spec-15b-membran`. Sprechende Message.
5. Draft-PR via GitHub-MCP. PR-Body skeleton siehe Brief unten.
6. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort.
7. Brief-Codeblock für `BRIEF_BAU_15B_MEMBRAN.md` direkt im Chat ausgeben (CLAUDE.md-Konvention 2026-05-21).

Befehl: durchziehen.
```

---

## Hintergrund (für die Spec-Sitzung lesbar)

### Karte 15 Sub (a) — was schon fixiert ist (Grob-Spec 2026-05-24)

- Globaler Name `window.SbkimMembrane` (Sub-(e)-`fremdzugriff` ist
  ein Unter-Objekt davon).
- Sub-(e)-Hook-Pflicht: jeder `read()` triggert einen Ringbuffer-
  Eintrag.
- Strikte Tabus: kein `sbkim_keys`, kein nodeId-Klartext der
  Geschwister, kein Schreiben/Signieren/Handshake.

### Karte 15 Sub (b) — was schon fixiert ist (Grob-Spec 2026-05-24)

- Konfiguration über `SbkimMembrane.init({ allowedOrigins: [...] })`
  im Andocker — keine Hardcode in `15_membran.js`.
- Origin-Allowlist statisch konfiguriert, kein Wildcard, exakter
  String-Match.
- Strikte Tabus: kein `op:"handshake"`, Allowlist nicht durch
  Membran selbst änderbar, Nonce-Pflicht gegen Replay.

### INTERFACES § 1 Modul 16 § Garantien (Siegel-Hook-Vorbestellung)

> **Modul 15 Sub (a) read()-Hook (vorbestellt für Spec-Sitzung 15.B):**
>   `read()`-Snapshot SOLL ein optionales Feld
>   `siegel: { isCertified, repoUrl, certifiedModules }` mitliefern.
>   Modul 16 stellt dafür die sync getter (`isCertified()` +
>   `getExplanation()`) bereit; Modul 15 Sub (a) finale Spec
>   entscheidet das Snapshot-Schema.

Dieses Feld macht das Siegel auch agentisch sichtbar — ein
KI-Browser-Agent, der `read()` aufruft, sieht ohne UI-Klick, ob die
PWA-Zelle zertifiziert ist + welche Pflicht-Module ok sind.

### Pipeline-Stand

Nach Karten:

- ✅ Schritt 1 Spec-Sitzung 16 (PR #151)
- ✅ Schritt 2 Bau-Sitzung 16 (PR #152 + Pflege Wappen/Korona PR #154)
- ⏳ Schritt 3 Sichttest 16 (Klaus, parallel)
- ✅ Schritt 3a Pflege CLAUDE.md § „Sicherheits-Module pflegen Aspekte" (PR #156)
- **DIESE SITZUNG: Schritt 4 Spec-Sitzung 15.B**
- ⏳ Schritt 5 Endknoten-Migration (Brief liegt schon, wird vor
  Schritt 5 um Siegel-/Lampen-Anker erweitert)
- ⏳ Schritt 6 Klaus' App-Freigabe

---

## PR-Body-Skeleton (für die Spec-Sitzung 15.B nutzbar)

```markdown
## Summary
- Karte 15 § Sub (a) Read-API finale Spec (Feld-Liste, Anonymisierungs-
  Tiefe, Quota-Verhalten, Siegel-Hook-Schema).
- Karte 15 § Sub (b) postMessage-Brücke finale Spec (Allowlist-Format,
  Op-Tabelle final, Nonce-Pflicht, Rate-Limit-Hook-Vorbestellung).
- INTERFACES.md § 1 Modul 15 Sub-(a)+Sub-(b)-Block ergänzt
  (verbindliches Snapshot-Schema + Op-Payload-Schema + Garantien).
- Karte 15 § Status-Header auf 🟨 Spec fertig (Sub a+b+e voll)
  aktualisiert.
- Bau-Sitzungs-Brief `BRIEF_BAU_15B_MEMBRAN.md` angelegt.

## Hintergrund
Pipeline-Schritt 4 der CLAUDE.md Pipeline-Reihenfolge-Tafel
(verbindlich, 2026-05-24). Finalisiert Karte 15 Sub (a)+(b) auf
Basis der Grob-Spec aus Spec-Sitzung 15 vom 2026-05-24.
Siegel-Hook im Snapshot aus INTERFACES § 1 Modul 16 § Garantien-
Vorbestellung.

## Disziplin gehalten
- Kein Code-Eingriff in `src/modules/15_membran.js` oder
  `src/modules/16_siegel.js`.
- Kein Sichttest — reine Doku-/Spec-Arbeit.
- Keine Tafel-Umsortierung.
- Pflicht-Konvention aus CLAUDE.md § „Was du tust" beachtet:
  Aspekt-Eintrag im Siegel ist Bau-Sitzungs-Pflicht (15.B Bau),
  NICHT Spec-Sitzungs-Pflicht.

## Test plan
- [ ] INTERFACES § 1 Modul 15 ist konsistent (Snapshot-Schema deckt
      sich mit `op`-Tabelle, Garantien decken alle Tabus).
- [ ] Karte 15 § Sub (a) + Sub (b) offene Fragen sind alle als
      entschieden markiert (keine offenen TODOs mehr in den beiden
      Blöcken).
- [ ] Bau-Brief 15.B referenziert die Pflicht-Konvention aus CLAUDE.md
      § „Was du tust" (ZERTIFIKAT_ASPEKTE-Eintrag).
```

---

## Erwarteter Umfang

Mittelgroß: ein Block in INTERFACES.md (Modul 15 Sub-(a)+Sub-(b)-Spec
ergänzt, analog Sub-(e)-Block), zwei Blöcke in Karte 15 final-spec-
markiert, neuer Bau-Brief, PULS-Sitzungs-Eintrag, Übergabeprotokoll.
Kein Modul-Code. Erwartete Sitzungs-Dauer 30–60 Minuten (Spec-Sitzung
mit Entscheidungs-Aufwand).
