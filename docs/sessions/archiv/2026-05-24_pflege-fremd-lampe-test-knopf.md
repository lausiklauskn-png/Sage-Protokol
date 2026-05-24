# 2026-05-24 · Mini-Pflege — Sage-Page Fremd-Lampe Sichttest-Knopf

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-fremd-lampe-test-knopf`. Anschluss nach Bau 15 + Bau 15.SW
(PR #142 + #144 auf `main`).

## Anlass

Klaus hat den Browser-Sichttest für Bau 15.SW erfolgreich gefahren —
Panel 15 Knopf 8 in `tests/manual_check.html` ist grün, der End-to-End-
Pfad SW→Page via `BroadcastChannel('sbkim-membrane')` ist bewiesen.

Beim Versuch, die FREMD-Lampe auf der **gehosteten** Sage-Page live zu
triggern, stieß Klaus auf eine Architektur-Falle: seine drei Endknoten
(Mein-Rezeptbuch, Mein-Mixarium, Sage) liegen **alle same-origin** auf
`https://lausiklauskn-png.github.io`. Cross-PWA-Fetches zwischen ihnen
melden `Sec-Fetch-Site:same-origin` und werden vom SW-Probe-Detektor
laut Karte 15 § Fremd-Definition Schritt 3 bewusst NICHT als Fremd
gewertet (Spec-Wille).

Echter Cross-Origin-Test bräuchte eine wirklich fremde Origin:
- Gemini-3.5-Flash-Browser-Agent (im selben Chrome-DeX als Browser-
  Extension oder im Sage-Page-Tab als iframe).
- Eine custom Domain (eigener CNAME).
- Browser-Extension oder ein zweiter github.io-User mit Cross-Page-
  Fetch.

Keiner dieser Pfade ist trivial reproduzierbar. **Klaus' Konvention**
(CLAUDE.md): „Knöpfe statt Konsole" — Klaus testet nicht via Eruda-
Konsolen-Befehl, sondern über sichtbare Knöpfe. Diese Mini-Pflege
schließt die Lücke mit einem optionalen Sichttest-Knopf direkt im
Fremdzugriff-Modal.

## Geänderte Dateien

- `src/modules/15_membran.js` (Closure-Variable + Init-Option + Modal-
  Erweiterung)
- `sbkim-init.js` (Sage-Page setzt `enableTestButton:true`)
- `docs/INTERFACES.md` (§ 1 Modul 15 options-Form)
- `docs/components/15_membran.md` (§ Bauzustand-Tabelle neue Zeile)
- `docs/PULS.md` (Sitzungs-Eintrag oben)

## Eingriffe im Detail

### `src/modules/15_membran.js`

**Neue Closure-Variable** (oben bei den anderen Modul-Zustands-
Variablen):

```js
var testButtonEnabled = false;
```

Default `false` — Endknoten erben den Pfad ohne Knopf.

**Neue Init-Option** in `init(options)`:

```js
if (opts.enableTestButton === true) {
  testButtonEnabled = true;
}
```

Strict `=== true`-Check (keine truthy-Bündel) — analog der bewussten
Strict-Boolean-Disziplin aus Modul 08 (`setSiblingHeteroOptIn`).

**Demo-Knopf in `mountFremdzugriffModal`**, nach dem `clearBtn`-Append
im Summary-Bereich:

```js
if (testButtonEnabled) {
  var testBtn = doc.createElement("button");
  testBtn.textContent = "🧪 Demo-Eintrag";
  testBtn.title = "Sichttest: synthetischen endpoint-probe-Eintrag einfügen ...";
  // ... Style: blau (Akzent), klein, unauffällig ...
  testBtn.addEventListener("click", function () {
    try {
      recordForTest({
        kind: "endpoint-probe",
        origin: "https://gemini.google.com",
        agentHint: "Sichttest/1.0 (Demo-Knopf in Sage-Page-Modal)",
        endpoint: "/sbkim/spore.json",
        decision: "accepted",
        details: { method: "GET", secFetchSite: "cross-site" },
      });
    } catch (err) {
      warn("Demo-Eintrag-Knopf fehlgeschlagen", err);
    }
  });
  summary.appendChild(testBtn);
}
```

Knopf ruft die bereits existierende interne Funktion `recordForTest`
(die Klassen-private Funktion hinter der externen API
`SbkimMembrane.fremdzugriff._recordForTest`). KEIN neuer Pfad in den
Eintragsfluss — der Demo-Eintrag durchläuft denselben Validierungs-/
Verdrängungs-/Listener-Pfad wie jeder andere `_recordForTest`-Aufruf
und ist damit verhaltensgleich zu einem echten SW-Probe-Trigger.

### `sbkim-init.js`

```js
await initModule("SbkimMembrane", function () {
  return window.SbkimMembrane && window.SbkimMembrane.init({
    lampSelector: "#lamp-fremd",
    enableTestButton: true,  // ← nur in Sage-Page-init.js
  });
});
```

Endknoten-Repos (Mein-Rezeptbuch, Mein-Mixarium) setzen die Flag NICHT
und bekommen den Knopf damit nicht.

### `docs/INTERFACES.md` § 1 Modul 15 options-Form

```
enableTestButton?: boolean        // Default false. Wenn true, ergänzt das Fremdzugriff-Modal
                                  // einen sichtbaren „🧪 Demo-Eintrag"-Knopf neben „Aufräumen", ...
```

## Validierung

- `node --check src/modules/15_membran.js` grün.
- `sbkim-init.js`: kein syntaktischer Eingriff über die zwei Zeilen
  hinaus — Klaus' aktive Init-Kette bleibt gleich aufgebaut.

## Sichttest

**Ungeprüft — wartet auf Klaus' Browser-Lauf.**

Erwartung (nach GitHub-Pages-Build + Hard-Reload):

1. Auf der gehosteten Sage-Page (`https://lausiklauskn-png.github.io/
   Sage-Protokol/`) ist die FREMD-Lampe sichtbar (Default dunkel).
2. Klick auf die FREMD-Lampe öffnet das Fremdzugriff-Modal.
3. Im Summary-Bereich (rechts neben „N Einträge im Ringbuffer (max
   50)") sind jetzt ZWEI Knöpfe: „Aufräumen" (rot-akzentuiert) und
   „🧪 Demo-Eintrag" (blau-akzentuiert).
4. Klick auf „🧪 Demo-Eintrag" → ein neuer Eintrag erscheint in der
   Tabelle (`kind:endpoint-probe`, `origin:https://gemini.google.com`,
   `endpoint:/sbkim/spore.json`, `decision:accepted`); Lampen-Counter
   zählt hoch.
5. Modal schließen (Backdrop, Esc oder ✕) → FREMD-Lampe leuchtet
   weiterhin rot (Dauerton + Puls auf jeden neuen Eintrag).
6. Lampe erneut klicken → Modal öffnet, Tabelle zeigt den Eintrag.
7. „Aufräumen" klicken → Tabelle leert sich, Lampen-Counter geht auf 0,
   Lampe wird wieder dunkel.

## Disziplin / Tabus eingehalten

- KEIN Eingriff in das `FremdzugriffEntry`-Schema oder die drei
  `kind`-Werte.
- KEIN Eingriff in die produktiven Eintragspfade (SW-Probe via
  BroadcastChannel, postMessage-Listener, externe `_recordForTest`-API).
- KEIN Storage-Eingriff, KEIN `DB_VERSION`-Bump, KEIN
  `PROTOCOL_VERSION`-Bump.
- KEINE neuen Error-Klassen — Sub (e) bleibt rein beobachtend +
  fail-soft.
- KEINE Endknoten-Migration — Endknoten-`sbkim-init.js` setzen
  `enableTestButton` bewusst NICHT.
- KEINE Schema-Änderung am BroadcastChannel-Message-Format.

## Vorgemerkt — Folge-Sitzungen

- **Endknoten-Migration Karte 09 § Schritt 10** (Membran-Allowlist +
  Lampe in PWA-Header anhängen) — eigene Folge-Pflege, blockiert
  durch Sub (b) finale Spec. Setzt `enableTestButton` dort bewusst
  NICHT.
- **Spec-Sitzung 15.B** für Sub (a) Read-API + Sub (b) postMessage-
  Bedienungs-Pfad finalisieren — Klaus triggert mit `Befehl schreiben`.

## Nächster sinnvoller Schritt

1. PR mergen.
2. Auf GitHub-Pages-Build warten (1–2 min).
3. Sage-Page im Browser hart neu laden, FREMD-Lampe klicken, „🧪 Demo-
   Eintrag" klicken → Sichttest grün.
