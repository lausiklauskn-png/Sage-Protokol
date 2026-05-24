# Brief — Bau-Sitzung 15.SW Membran (Sub (e) SW-endpoint-probe-Detektor)

**Anlass:** Bau-Sitzung 15 vom 2026-05-24 (PR #142, `a5d2aff` auf
`main`) hat Sub (e) **Page-seitig** vollständig implementiert —
Ringbuffer, Lampe, Modal, postMessage-Listener, BroadcastChannel-
**Subscription**. Es fehlt nur noch der **SW-seitige Sender** für
`kind:"endpoint-probe"`-Einträge: ein zusätzlicher `fetch`-Listener
in `src/sbkim-sw.js`, der bei Cross-Origin-`Sec-Fetch-Site` / fremder
`Referer`-Origin auf den SBKIM-Endpunkten einen
`SBKIM_MEMBRANE_PROBE` über `BroadcastChannel('sbkim-membrane')`
postet. Sobald 15.SW gemerged ist, ist Sub (e) end-to-end live.

**Branch (Vorschlag):** `claude/bau-15sw-membran-sw-probe`.

**Voraussetzungen:**

- PR #142 (`Bau 15 Sub (e)`) ist auf `main` (✅ erledigt 2026-05-24).
- Keine parallele offene PR-Schicht in `src/sbkim-sw.js` (Stand
  2026-05-24: keine).
- **Karte 15 § „Fremd"-Definition** (Bewertungs-Reihenfolge im
  SW-Hook) ist verbindlich und gilt **unverändert** — diese Bau-
  Sitzung implementiert nur, sie spezifiziert nicht.

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung)

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md (Schnellüberblick + jüngster Sitzungs-Eintrag 2026-05-24 Bau-Sitzung 15)
3. docs/INTERFACES.md (§ 1 Modul 15-Block; § Browser-API BroadcastChannel("sbkim-membrane"); § Modul 05/06/07 SW-Endpunkt-Pfade)
4. docs/components/15_membran.md (NUR § Sub (e) Architektur-Trennung → Pfad 3 (SW-Fetch-Listener) + § „Fremd"-Definition für endpoint-probe — Bewertungs-Reihenfolge ist verbindlich)
5. src/sbkim-sw.js (KOMPLETT lesen — die Datei ist nur 273 Zeilen und du baust dort additiv einen weiteren fetch-Listener-Pfad ein)
6. src/modules/15_membran.js (NUR die `subscribeBroadcastChannel`-Closure + `BROADCAST_CHANNEL_NAME` / `SW_PROBE_MESSAGE_TYPE`-Konstanten — der Page-Empfänger ist fertig und bestimmt das Message-Schema)
7. tests/manual_check.html (NUR Panel 15 — du ergänzt EINEN Knopf 8 für „SW-Probe simulieren" via direktem BroadcastChannel-Post; kein neues Panel)

Deine Aufgabe:

PRIMÄR — Bau 15.SW (Pflicht):

1. **`src/sbkim-sw.js` erweitern** (additiv, KEIN Eingriff in die
   bestehenden drei fetch-Listener-Pfade ANASTOMOSIS/LEGACY/
   HETEROKARYOSIS):
   - **Neuer Konstanten-Block** ganz oben bei den anderen Pfaden:
     ```js
     const MEMBRANE_PROBE_CHANNEL = "sbkim-membrane";
     const MEMBRANE_PROBE_MESSAGE_TYPE = "SBKIM_MEMBRANE_PROBE";
     const SBKIM_ENDPOINT_PATHS = ["/sbkim/spore.json", "/sbkim/anastomosis", "/sbkim/legacy", "/sbkim/heterokaryosis"];
     ```
     Bonus-Pfad `/sbkim/query` aus § Modul-15-Karte ist KÜNFTIG (Modul
     04.C Search-API) — JETZT NICHT mit aufnehmen, sonst feuert der
     Detektor für noch nicht existierende Endpunkte.
   - **Sub-(e)-Hook im bestehenden `fetch`-Listener** als ERSTE Zeile
     im Listener-Body (vor den drei `isOwnEndpoint`-Branches):
     `maybeRecordMembraneProbe(event.request)` — Funktion ruft
     **synchron** (kein `await` im fetch-Listener — sonst
     Browser-Reset), eigene Fehlerpfade fail-soft, KEIN respondWith,
     KEIN Eingriff in den weiteren Response-Pfad.
   - **`maybeRecordMembraneProbe(request)`-Implementierung:**
     1. `url = new URL(request.url)`.
     2. Pfad-Filter: `pathMatchesSbkimEndpoint(url.pathname)` — nutzt
        `isOwnEndpoint(url.pathname, p)` für jeden `p` aus
        `SBKIM_ENDPOINT_PATHS`. Trifft KEIN Eintrag → return (kein
        Eintrag).
     3. Fremd-Bewertung (Karte 15 § „Fremd"-Definition Reihenfolge
        1→4):
        - `url.origin !== self.location.origin` → **Fremd**.
        - sonst `request.headers.get('Sec-Fetch-Site')` ∈
          `{"cross-site", "same-site"}` → **Fremd**.
        - sonst `Sec-Fetch-Site === "same-origin"` ODER fehlend →
          **same-origin** (return).
        - Fallback: `Referer`-Header-Origin parsen; wenn !=
          `self.location.origin` → **Fremd**.
     4. Bei Fremd: `entry` bauen:
        ```js
        {
          at: new Date().toISOString(),
          kind: "endpoint-probe",
          origin: <Schema+Host+Port des Referers ODER null>,
          agentHint: null,                    // SW hat kein navigator.userAgent — Page-Schicht setzt nichts nach (Schema-konform)
          endpoint: url.pathname,
          decision: "accepted",               // SW erkennt nur, bedient nicht — wird vom jeweiligen Modul (05/06/07) später bedient bzw. abgewiesen
          details: {
            method: request.method,
            secFetchSite: request.headers.get('Sec-Fetch-Site') || null
          }
        }
        ```
        `agentHint:null` bewusst — der Cross-Origin-Fetcher sendet
        in der Regel keinen `User-Agent`-Header an Sub-Resources, der
        SW kann ihn ohnehin nicht zuverlässig auslesen.
     5. `postProbeViaBroadcastChannel(entry)` — neue Channel-Instanz
        pro Aufruf (BroadcastChannel ist billig, ein `new
        BroadcastChannel(name); ch.postMessage(...); ch.close()` ist
        die einfache + thread-sichere Variante; long-lived Channel
        im SW braucht extra Lebenszyklus-Logik, NICHT in dieser
        Sitzung). Fehlerpfade fail-soft (`try/catch`, `console.warn`
        ohne Throw).
   - **Reihenfolge im fetch-Listener:** Probe-Hook ZUERST, dann die
     drei bestehenden `isOwnEndpoint`-Branches mit `respondWith`.
     Probe-Hook ist beobachtend — er greift nicht in den Response-
     Pfad ein.
   - `node --check src/sbkim-sw.js` muss grün sein.

2. **Selbstcheck-Zeile NICHT ergänzen** — der SW hat heute keine
   Selbstcheck-Konsolen-Ausgabe (SW läuft ohnehin nicht in der
   Devtools-Konsole des Tabs). Modul 15 Page-Seite trägt die
   Selbstcheck-Pflicht, die Bau-Sitzung 15 schon eingebaut hat.

3. **Panel 15 in `tests/manual_check.html` um EINEN Knopf 8
   ergänzen:** „Test 8: SW-Probe-Simulation via BroadcastChannel".
   Inhalt:
   - Setup wie immer.
   - Open ein **eigenes** `new BroadcastChannel("sbkim-membrane")`
     im Panel-Code (NICHT über `SbkimMembrane._meta.broadcastChannel`
     — wir testen den End-to-End-Pfad, nicht die interne Closure).
   - `channel.postMessage({type:"SBKIM_MEMBRANE_PROBE", entry:
     {kind:"endpoint-probe", decision:"accepted", origin:
     "https://probe.example", endpoint:"/sbkim/spore.json", details:
     {method:"GET", secFetchSite:"cross-site"}}})`.
   - `await new Promise(r => setTimeout(r, 30))` (BroadcastChannel
     ist asynchron im Browser — der Page-Listener feuert nicht
     synchron).
   - `SbkimMembrane.fremdzugriff.list()` → erwartet einen
     Eintrag mit `kind:"endpoint-probe"` und `details.method ===
     "GET"`.
   - Lampe `.fremd-alert` an `#panel-15-fake-lamp`.
   - `channel.close()` am Ende.
   - **Knopf 9 (Bonus):** „Test 9: Live-SW-Probe-Auslöser" —
     instruiert Klaus in `<pre>`-Output, dass ein echter SW-Probe-
     Test eine zweite Origin braucht (z.B. von Mein-Mixarium-PWA
     auf `https://lausiklauskn-png.github.io/Sage-Protokol/sbkim/
     spore.json` fetchen) und in der Sage-Page-Lampe `#lamp-fremd`
     rot wird; in `tests/manual_check.html` allein nicht
     reproduzierbar.
   - `tests/manual_check.html` muss weiterhin als statische Datei
     funktionieren (KEINE Server-Side-Includes).

SEKUNDÄR — wenn Zeit + Token reichen:

4. **Karte 15 § Bauzustand-Tabelle** Zeile „Sichttest" um Hinweis
   ergänzen: „Bau 15.SW SW-Probe Sichttest ausstehend — Knopf 8 in
   Panel 15 prüft den BroadcastChannel-Pfad headless, Knopf 9 ist
   nur ein Klaus-Hinweis für echten Cross-Origin-Test." `Code
   geschrieben`-Zeile bleibt 2026-05-24 (Page-Seite); zusätzliche
   Zeile „Code geschrieben (SW-Seite) | YYYY-MM-DD | Bau-Sitzung
   15.SW | …" ergänzen.

5. **INTERFACES.md § 1 Modul 15 Storage-Block** Hinweis ergänzen,
   dass `BroadcastChannel('sbkim-membrane')` jetzt zwei aktive
   Schreiber hat: Sub-(e)-Subscriber in der Page (lesend) UND
   SW-Sender (schreibend). KEINE Schema-Änderung am
   `SBKIM_MEMBRANE_PROBE`-Message-Format — das ist bereits in Bau-
   Sitzung 15 verankert.

ZURÜCKGEHALTEN — diese Bau-Sitzung NICHT:

- Sub (a) Read-API finale Spec/Bau (Spec-Sitzung 15.B + Folge-Bau
  15.B).
- Sub (b) postMessage-Bedienungs-Pfad (Spec-Sitzung 15.B + Folge-
  Bau 15.B).
- `/sbkim/query`-Endpunkt im Pfad-Filter (existiert noch nicht
  serverseitig — feuert sonst sinnlos).
- Long-lived BroadcastChannel-Instanz im SW mit Lebenszyklus-Logik
  (eigene Folge-Pflege falls Probe-Volumen so hoch wird, dass
  per-Probe-Channel-Open zum Bottleneck wird — vermutlich nie).
- Replay-/Dedupe-Schutz im Probe-Pfad (kein Schutz nötig — Sub (e)
  ist Beobachtung, jeder Probe-Versuch ist sehenswert; Modul 11
  Rate-Limit kann später drauf hooken).
- Endknoten-Migration (Karte 09 § Schritt 10 — eigene Folge-Sitzung
  „Pflege Karte 09 Membran-Anker").
- Karten 10 / 11 / 12 (Schutz-Backlog) — kommen erst NACH Sub (a)+(b)
  finalem Bau.

Was du nicht tust:

- Kein Eingriff in die bestehenden drei `handleBridge`-Pfade (05/
  07/06). Probe-Hook ist additiv VOR den `respondWith`-Branches.
- Kein neuer Storage-Store, kein `DB_VERSION`-Bump, kein
  `PROTOCOL_VERSION`-Bump.
- KEIN `event.respondWith()` im Probe-Hook — sonst würden die
  Pfad-Fetches gekapert (Sub (e) ist passiv beobachtend, das ist
  Spec-Wille).
- Kein Eingriff in das Empfangsmodus-Prinzip — SW-Sender postet
  nur, antwortet nicht; postet KEINE Page-Seite, postet nur an die
  BroadcastChannel-Subscriber (Page-Sub-(e)-Schicht).

Pflicht am Ende:

- `src/sbkim-sw.js` erweitert (additiv, eine neue Hilfsfunktion +
  einen vorgezogenen Aufruf im fetch-Listener)
- `tests/manual_check.html` Panel 15 um Knopf 8 (+ optional Knopf 9
  Hinweis) erweitert
- `node --check src/sbkim-sw.js` grün
- Sichttest VORGEMERKT (Knopf 8 läuft headless im Browser, Knopf 9
  ist Klaus-Live-Hinweis — wartet auf zweite Origin)
- Karte 15 § Bauzustand-Tabelle Zeile „Code geschrieben (SW-Seite)"
  mit Datum
- status.json: `membranBacklog[0].score` bleibt `"stub"` (kein
  Sprung auf `"fertig"` — Sub (a)+(b)+(c) sind noch offen); `siegel`-
  Text um „SW-Probe-Detektor Bau 15.SW YYYY-MM-DD" ergänzen
- `python3 scripts/update_puls_pie.py` aufrufen (Pie ändert sich
  nicht, aber Konvention)
- PULS.md Tabellenzeile 15 um „Bau 15.SW SW-Probe-Detektor" +
  Sitzungs-Eintrag oben
- Übergabeprotokoll in
  `docs/sessions/archiv/YYYY-MM-DD_bau-15sw-membran-sw-probe.md`
- Commit + Push auf `claude/bau-15sw-membran-sw-probe`
- Draft-PR anlegen
- Brief-Codeblock für die nächste Sitzung im Chat ausgeben (nach
  Bau 15.SW ist Spec-Sitzung 15.B die natürliche Folge — Klaus
  entscheidet aber selbst per `Befehl schreiben`)
- „Vorgeschlagene nächste Schritte"-Block
```
