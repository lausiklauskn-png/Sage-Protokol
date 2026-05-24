# 2026-05-24 · Sichttest-Nachzug — Karte 15 Sub (e) Fremd-Lampe live grün

**Sitzungs-Rolle:** Pflege-Sitzung (Sichttest-Nachzug). Branch
`claude/sichttest-15-fremd-lampe-gruen`. Anschluss nach drei PRs:
- PR #142 — Bau 15 Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe
- PR #144 — Bau 15.SW SW-Probe-Detektor
- PR #145 — Pflege Sage-Page-Sichttest-Knopf

Alle drei gemerged 2026-05-24, alle drei mit „Sichttest ungeprüft —
wartet auf Klaus' Browser-Lauf" geschlossen (CLAUDE.md-Konvention).

## Klaus' Browser-Sichttest (DeX-Chrome auf Galaxy Tab S6)

### Test 1 — Panel 15 Knopf 8 (Bau 15.SW Verifikation)

Datei: `tests/manual_check.html` (lokal via Termux `python3 -m
http.server 8000`). Setup grün, Knopf 8 grün:

```json
{
  "anzahl_eintraege": 1,
  "letzter_eintrag": {
    "at": "2026-05-24T12:45:51.586Z",
    "kind": "endpoint-probe",
    "origin": "https://probe.example",
    "agentHint": null,
    "endpoint": "/sbkim/spore.json",
    "decision": "accepted",
    "details": { "method": "GET", "secFetchSite": "cross-site" }
  },
  "lampe_fremd_alert": true,
  "erwartung": "ein Eintrag (kind:endpoint-probe, ...). Beweist End-to-End-Pfad SW→Page via BroadcastChannel('sbkim-membrane')."
}
```

Alle sechs Pflicht-Felder passen. End-to-End-Pfad SW→Page bewiesen.

### Test 2 — Sage-Page FREMD-Lampe + Modal (Bau 15 + Pflege #145)

URL: `https://lausiklauskn-png.github.io/Sage-Protokol/` (gehostete
Version nach Pages-Build von PR #145, ~1–2 min nach Merge).

Acht-Schritt-Sichttest („Funktioniert wie erwartet" — Klaus):

1. FREMD-Lampe in der Navleiste sichtbar (Default dunkel).
2. Klick auf FREMD-Lampe → Modal öffnet sich.
3. Im Summary-Bereich zwei Knöpfe: „Aufräumen" (rot-akzentuiert)
   + „🧪 Demo-Eintrag" (blau-akzentuiert).
4. Klick auf „🧪 Demo-Eintrag" → neuer `endpoint-probe`-Eintrag in
   Tabelle (`origin:https://gemini.google.com`, `endpoint:/sbkim/
   spore.json`).
5. Lampe pulst rot.
6. Modal schließen → Lampe leuchtet weiterhin rot (Dauer-Alert
   solange Buffer nicht leer).
7. Lampe erneut klicken → Modal mit Eintrag.
8. „Aufräumen" → Tabelle leer, Lampe dunkel.

## Was bleibt headless-only

**Bau 15.SW echter Live-Cross-Origin-SW-Probe** (Sage-Pages-SW empfängt
cross-site Fetch von wirklich fremder Origin) — Klaus' drei Endknoten
(Mein-Rezeptbuch, Mein-Mixarium, Sage) sind alle same-origin auf
`https://lausiklauskn-png.github.io`. Der SW-Probe-Detektor wertet
`Sec-Fetch-Site:same-origin` laut Karte 15 § Fremd-Definition Schritt 3
bewusst NICHT als Fremd (Spec-Wille — Sub (e) ist Beobachtung +
Anzeige, kein produktiver Filter).

Echter Cross-Origin-Trigger bräuchte fremde Origin:
- Gemini-3.5-Flash-Browser-Agent (im selben Chrome-DeX als Browser-
  Extension oder im Sage-Page-Tab als iframe).
- Eine Custom-Domain (eigener CNAME).
- Browser-Extension oder ein zweiter github.io-User mit Cross-Page-
  Fetch.

Der Demo-Knopf-Pfad aus PR #145 deckt den Page-Empfangs-Pfad sauber
ab. Der SW-Sender-Pfad ist headless via vm-Stub-Smoke 21/21 grün
(Bau 15.SW Übergabeprotokoll).

## Eingriffe (Dokumentations-Nachzug, kein Code)

- `docs/components/15_membran.md` § Bauzustand-Tabelle Sichttest-Zeile
  von „ungeprüft 2026-05-24" auf **„geprüft 2026-05-24 (Klaus, DeX-
  Chrome auf Galaxy Tab S6)"** umgestellt. Beleg-Block (welcher Test
  was bewies) ergänzt; Hinweis auf headless-only-Limitation des echten
  Cross-Origin-SW-Probe-Pfads beibehalten.
- `status.json` `membranBacklog[0].siegel` ergänzt um „Sichttest
  2026-05-24 grün (Klaus, DeX-Chrome)". `score` bleibt `"stub"` —
  Sub (a)+(b)+(c) sind weiterhin offen, Sichttest grün ändert daran
  nichts.
- `docs/PULS.md` Schnellüberblick-Tabellenzeile 15 Sichttest-Spalte
  auf grün. Sitzungs-Eintrag oben.

## Disziplin

- KEIN Code-Eingriff, nur Doku-Nachzug.
- KEIN Sprung von `score:"stub"` auf `"fertig"`.
- CLAUDE.md-Konvention eingehalten: die drei Bau-/Pflege-Sitzungen
  waren als „ungeprüft" geschlossen; dieser Sichttest-Nachzug stellt
  sie mit Klaus' explizitem „Funktioniert wie erwartet" auf grün.

## Vorgemerkt — Folge-Sitzungen

- **Spec-Sitzung 15.B** für Sub (a) Read-API + Sub (b) postMessage-
  Bedienungs-Pfad finalisieren — Klaus triggert mit `Befehl schreiben`.
- **Endknoten-Migration Karte 09 § Schritt 10** (Membran-Allowlist +
  Lampe in PWA-Header anhängen) — eigene Folge-Pflege pro Endknoten-
  Repo.
- **`/sbkim/query`-Endpunkt im SW-Pfad-Filter** ergänzen, sobald Modul
  04.C Search-API serverseitig steht.
- **`status.json` Endknoten-Daten nachziehen** (Re-Andock 2026-05-17:
  neue nodeIds `BSWxXm…` Rezeptbuch + `JOlHK3…` Mixarium, `integratedAt`
  von 2026-05-16 auf 2026-05-17) — Klaus' separater Wunsch aus dem
  Sichttest-Dialog.

## Nächster sinnvoller Schritt

PR mergen → fertig. Modul 15 Sub (e) ist damit code- und sichttest-
gehärtet bis zur nächsten Spec-Sitzung 15.B.
