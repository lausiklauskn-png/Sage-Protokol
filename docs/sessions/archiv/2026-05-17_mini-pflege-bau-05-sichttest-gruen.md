# Mini-Pflege 2026-05-17 — Bau-Sichttest BroadcastChannel-Bridge grün

**Sitzungs-Rolle:** Mini-Pflege, headless (Klaus' Browser-Output
eingetragen), EINE Phase. Branch
`claude/pflege-bau-05-sichttest-gruen`. Folge-Eintrag zur Bau-
Sitzung BroadcastChannel-Bridge (PR #75 `b8c8f41`).

---

## 1. Was geschah

Klaus hat unmittelbar nach dem Squash-Merge von PR #75 das Test-
Panel `tests/manual_check.html` lokal über Termux + `python3 -m
http.server 8000` aufgerufen und Panel 05 Knöpfe 9 / 9a / 9b / 9c
nacheinander durchgeklickt. **Vier von vier Tests grün im ersten
Lauf**, keine Modul-Befunde, keine retroaktiven Pflege-Bedarfe.

Setup: Galaxy Tab S6 + DeX, Chrome auf Android, lokaler HTTP-Server
gegen frisch geklontes Sage-Protokol-Repo (Commit-Stand `b8c8f41`).
Embedding-Modell `Xenova/multilingual-e5-small` über CDN-Fallback
(`cdn.jsdelivr.net`) — die `/models/.../tokenizer.json`-,
`/models/.../config.json`-, `/models/.../model_quantized.onnx`-404er
vom Python-Server sind erwartet (transformers.js sucht zuerst lokal
und fällt dann ans CDN, weil `env.allowRemoteModels` Default `true`
ist).

---

## 2. Test-Outputs (kopiert aus Panel 05)

### Setup ✓

Erster Klick zog ~30 MB Modell-Download vom CDN, ~80 s bei der
Tablet-Bandbreite. Setup grün, alle 10 SBKIM-Module geladen.

### Test 9 — Channel-Pfad established (alt → main, intra-tab) ✓

```json
{
  "response_outcome": "established",
  "response_score": 0.8880516027995051,
  "response_signatur_ok": true,
  "alt_als_sibling_eingetragen": true,
  "erwartung": "outcome=established, score > 0.80, Response-Signatur ok, alt als sibling",
  "transport_pfad": "BroadcastChannel('sbkim') intra-tab, kein Netz"
}
```

Bestätigt: Receiver-Listener wird in `init()` eager registriert,
filtert `toNodeId === ownId` + `fromNodeId !== ownId`, ruft
`receiveHandshake`, signiert die Response kanonisch, postet auf
Reply-Channel. Sender empfängt + verifiziert + trägt alt als sibling
ein.

### Test 9a — toNodeId-Mismatch-Timeout ✓

```json
{
  "fehler_name": "HandshakeTimeoutError",
  "fehler_message": "Channel-Reply > 4000 ms ausgeblieben.",
  "timeout_ms": 4005,
  "log_eintraege_vor": 1,
  "log_eintraege_nach": 1
}
```

`QUERY_TIMEOUT_MS = 4000 ms` greift sauber, 5 ms Overhead durch
Event-Loop. Keine Log-Zeile geschrieben (Test 9a nutzt das rohe
`_postChannelEnvelope`, nicht den `handshake`-Pfad — der Log-
Eintrag „timeout-channel" wäre in `sendViaChannel` geschrieben, hier
nicht erwartet).

### Test 9b — MissingToNodeIdError synchron ✓

```json
{
  "request_hat_toNodeId": false,
  "fehler_name": "MissingToNodeIdError",
  "fehler_message": "Channel-Pfad erfordert request.toNodeId — ohne ihn kann der Receiver den Request nicht filtern (Karte 05 § Pflichtfeld-Schärfung).",
  "erwartung": "MissingToNodeIdError vor jeglichem BroadcastChannel-Bau"
}
```

`_buildSignedRequest(..., undefined)` lässt das `toNodeId`-Feld weg;
`_postChannelEnvelope` prüft als allererstes (vor jedem
BroadcastChannel-Bau) und wirft synchron.

### Test 9c — Auto-Fallback-Beweis (HTTP 404 → Channel etabliert) ✓

```json
{
  "ergebnis": {
    "outcome": "established",
    "peerNodeId": "25IUGiGscRhvgYd_O4EqBttkm6XME8KXST1iX2MEbI4",
    "peerDomain": "mixarium.example.org",
    "score": 0.8880516027995051
  },
  "fehler_name": null,
  "fehler_message": null,
  "fehler_cause": null,
  "target_endpoint": "http://localhost:8000/nicht-vorhanden-fuer-test-9c/"
}
```

HTTP-POST auf einen 404-Sub-Pfad derselben Origin → Auto-Fallback-
Bedingung erfüllt (Status ≥ 400) → `sendViaChannel` mit HTTP-`cause`
in der Kette → Pseudo-Peer-Echo (Test-Helfer im Panel) antwortet
kanonisch signiert → `outcome:"established"`. **Score-Stabilität
0.8881 identisch zu Test 9** — Auto-Fallback liefert kein
verschlechtertes Ergebnis.

---

## 3. Was eingetragen

- **`docs/components/05_anastomose.md` § Bauzustand:** neue Zeile
  „Sichttest BC-Bridge | 2026-05-17 | Klaus + Mini-Pflege
  Bau-Sichttest-grün" mit allen vier Test-Outputs + Hinweis auf das
  Termux/Galaxy-Setup + Score-Stabilitäts-Beobachtung.
- **`docs/PULS.md` Schnellüberblick:** Modul-05-Zeile von „Sichttest
  ausstehend" auf „2026-05-17 grün" umgestellt mit Kurzform der vier
  Ergebnisse.
- **`docs/PULS.md` Sitzungs-Einträge:** neuer Top-Eintrag „Mini-
  Pflege — Bau-Sichttest BroadcastChannel-Bridge grün".
- **Übergabeprotokoll:** dieses Dokument.

`status.json` nicht geändert — Modul 05 bleibt `score:"fertig"`,
Sichttest-Bestätigung ist keine Score-Bewegung.

---

## 4. Was nicht angefasst

- Modul-Code (`src/modules/05_anastomose.js`).
- INTERFACES.md / Karte 09 (beide aus PR #74/#75 final).
- `tests/manual_check.html`.
- `src/sbkim-sw.js`.
- `PROTOCOL_VERSION` bleibt `"0.1"`.

---

## 5. Nächster sinnvoller Schritt — Endknoten-Pflege

Klaus' Browser-Sichttest in Sage-Protokol ist erledigt. Die
**zweite Stufe** ist die Live-Bestätigung im Endknoten-Setup:

1. **`src/modules/05_anastomose.js` in beide Endknoten kopieren**
   (`Mein-Mixarium/sbkim/` + `Mein-Rezeptbuch/sbkim/`). Cache-Bust
   via File-Rename oder Query-Param je nach SW-Setup. Commit +
   Push in beiden Endknoten-Repos.
2. **Beide PWA-Tabs öffnen** (Mein-Rezeptbuch + Mein-Mixarium auf
   `lausiklauskn-png.github.io`). `__sbkimErzeugeSpore()` nur,
   falls nötig.
3. **In einem Tab regulärer `SbkimAnastomose.handshake(peerSpore,
   ownVec)`-Aufruf** über Eruda (Default `transport:"auto"` reicht
   — HTTP scheitert auf GitHub Pages 405/404, Channel-Fallback
   greift). **Erwartet `outcome:"established"` über den Channel-
   Pfad** — erster Cross-Knoten-Handshake **ohne** localStorage-
   Bypass.
4. **Falls Timeout statt `established`:** Receiver-Tab-Pflicht
   prüfen (beide Tabs wirklich offen? Modul 05 geladen + `init()`
   durch? `SBKIM-Init grün` in beiden Konsolen sichtbar?).

Bei Erfolg dieser Live-Stufe würde der `pingStatus` in der
Endknoten-Tabelle in PULS von `"live-direct"` auf z.B.
`"live-channel"` o.ä. wechseln (eine eigene Folge-Mini-Pflege).

---

## 6. Konvention für die übernächste Sitzung (IMMER drinhalten)

Wenn Klaus am Sitzungsende der **Folge-Sitzung** `Befehl schreiben`
tippt, formuliert die Folge-Sitzung **vor** dem Brief:

1. **Offene PRs auflisten** in Sage-Protokol (und ggf. Endknoten).
2. **Pro PR eine Einordnung** (mergen / schließen / lassen +
   Konflikt-Risiko, typisch PULS.md / INTERFACES.md).
3. **Den Brief gegen `main`-Stand schreiben**, nicht gegen die
   eigene Branch-Erwartung. Voraussetzungen aus ungemergten PRs
   **explizit** nennen.
4. **Bei mehreren offenen PRs** Merge-Empfehlung vor dem Brief
   vorlegen; der Brief kommt erst nach Klaus' Bestätigung der
   Merge-Strategie (oder explizit „Brief auf aktuellem Stand,
   keine Merges").

Brief-Stil sachlich, ohne Imponiergehabe, mit konkreten Datei-/
Zeilen-Referenzen.

**Pflicht am ENDE des Briefs:** Vollständiger Brief NOCHMAL in
einem einzigen kopierbaren Markdown-Codeblock (Outer-Fence mit vier
Backticks, damit interne ```js-Blöcke nicht schließen).

---

**Vorgänger:** PR #75 (Bau BroadcastChannel-Bridge, `b8c8f41`).
**Branch:** `claude/pflege-bau-05-sichttest-gruen`.
