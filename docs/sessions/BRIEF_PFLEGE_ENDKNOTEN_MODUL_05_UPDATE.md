# Brief — Pflege Endknoten-Modul-05 auf Sage-main-Stand updaten

**Anlass:** Endknoten-Sichttest Cross-Knoten Sub (e) am 2026-05-26 hat
gezeigt: Klaus' Endknoten haben `sbkim/05_anastomose-v2.js` (alte
BroadcastChannel-Bridge-Version aus Bau 05.Y 2026-05-17), die **NICHT
den Bau-17-DispatchEvent-Hook** enthält. Bei erfolgreichem Cross-
Knoten-Handshake dispatcht das Endknoten-Modul-05 KEIN
`sbkim:handshake`-window-Event — Modul 16's Sub-(e)-Bronze→Gold-
Listener feuert daher nicht automatisch.

**Konsequenz:** Der Bronze→Gold-Wechsel im SIEGEL-Slot + Modal
funktioniert nur via manuellem Eruda-Dispatch:

```js
window.dispatchEvent(new CustomEvent("sbkim:handshake", { detail: { outcome: "established" }}));
```

Das ist nur ein **Sichttest-Workaround**, kein produktiver Zustand.

**Fix:** Endknoten-`sbkim/05_anastomose.js` durch die aktuelle
Sage-main-Version ersetzen (Volldatei-Kopie, analog der Re-Aktivierungs-
PRs MR #249 + MM #58 für Modul 15+16+17+sw).

**Repos:** Beide Endknoten parallel:
- `lausiklauskn-png/Mein-Rezeptbuch` (extern)
- `lausiklauskn-png/Mein-Mixarium` (extern)

**Pipeline-Stellung:** Folge-Pflege zu Sub-(e)-Sichttest-Bilanz
(Pipeline-Phase A Schritt 5e abgeschlossen). Diese Pflege schließt
den **Auto-Dispatch-Bug** in beiden Endknoten.

**Voraussetzungen:**

- Sub-(e)-Sichttest-Bilanz-PR in Sage gemerged.
- Sage's `src/modules/05_anastomose.js` ist auf Bau-17-Stand (mit
  `dispatchHandshakeEvent`-Helper + Wrapper-Funktionen).
- Klaus' Endknoten haben aktuell `sbkim/05_anastomose-v2.js` (alte
  v2-Version, prä-Bau-17).

**Branch-Vorschläge:**

- MR: `claude/pflege-endknoten-modul-05-update-mr`
- MM: `claude/pflege-endknoten-modul-05-update-mm`

---

## Brief-Codeblock pro Endknoten (für den ersten Prompt)

```
Du bist eine Bau-Sitzung in <ENDKNOTEN-NAME> (externes Endknoten-
Repo, NICHT Sage-Protokol).

Sitzungs-Rolle: Pflege Modul 05 Update auf Sage-main-Stand. Behebung
des Sub-(e)-Sichttest-Befunds (2) vom 2026-05-26.

Branch: claude/pflege-endknoten-modul-05-update-<endknoten> (vom main
aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md des Endknoten-Repos (sofern vorhanden).
2. Endknoten-Repo aktueller `sbkim/`-Inhalt prüfen — falls
   `05_anastomose-v2.js` (v2-Variante) existiert, das ist die alte
   Bridge-Version. Falls nur `05_anastomose.js` (ohne v2-Suffix),
   schauen ob `dispatchHandshakeEvent` drinsteckt.
3. Sage-main src/modules/05_anastomose.js via WebFetch:
   https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/src/modules/05_anastomose.js
4. Endknoten-`sbkim-init.js` Init-Reihenfolge prüfen.

Pflicht-Disziplin:

- KEIN Sage-Protokol-Eingriff.
- KEIN Modul-Code-Edit (nur Volldatei-Kopie aus Sage-Commit).
- KEIN Spore-/IndexedDB-Reset (Klaus' Identität bleibt).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.

Deine Aufgabe:

A. **`sbkim/05_anastomose.js` ersetzen** durch die exakte Sage-main-
   Datei. WebFetch aus raw.github, dann Volldatei-Replace.

   Verifikation: `grep "dispatchHandshakeEvent" sbkim/05_anastomose.js`
   muss Treffer liefern (das ist der Bau-17-Hook).

   Falls altes `sbkim/05_anastomose-v2.js` existiert: **löschen**,
   die neue 05_anastomose.js ersetzt es.

B. **Build-Schritt:** falls Build-Source-Datei separat (z.B.
   QC_<Endknoten>_*.html), prüfen ob der `<script>`-Tag auf
   `sbkim/05_anastomose.js` zeigt (nicht auf `-v2.js`). Falls
   `-v2.js`: umbenennen.

   Dann `python3 build.py` (oder analog).

C. **node --check** für die neue Datei.

D. **Browser-Sichttest** (Klaus):
   - PWA in DeX-Chrome öffnen, Hard-Reload (Service-Worker-Bust).
   - In Eruda Cross-Knoten-Handshake gegen Sibling-Endknoten via
     BroadcastChannel-Bridge fahren (siehe Sub-(e)-Sichttest-
     Anleitung).
   - Erwartung: nach erfolgreichem `outcome:"established"` dispatcht
     Modul 05 automatisch das `sbkim:handshake`-Event → Modul 16
     wechselt SIEGEL bronze→gold OHNE manuellen Eruda-Dispatch.
     Modal-Refresh automatisch.

E. **VERKEHR-Slot im Widget** muss live einen `handshake`-Event-
   Eintrag bekommen (FIFO 10).

F. **Commit + Push + Draft-PR.**

Pflicht am Ende:

- sbkim/05_anastomose.js auf Sage-main-Stand.
- Verifikation: `dispatchHandshakeEvent` im Code, kein
  `05_anastomose-v2.js` mehr.
- Browser-Sichttest grün (Klaus).
- PR-Body verweist auf Sage-PR „Endknoten-Sichttest Cross-Knoten
  Sub (e) + drei Folge-Briefe" + diesen Brief.
```

---

## Hintergrund

**Sage's Bau 17 (PR #166, gemerged 2026-05-25) hat additiv in Modul
05 verdrahtet:**

- Neuer Helper `dispatchHandshakeEvent(outcome, peerNodeId, direction)`.
- `handshake` + `receiveHandshake` zu thin Wrappers umgebaut um interne
  `_doHandshake`/`_doReceiveHandshake`. Wrappers dispatchen nach Result-
  Resolve einmal `sbkim:handshake` mit direction-Feld.
- Public Surface + Selbstcheck-Zeile UNVERÄNDERT.

**Sage's Bau 16 Sub (e) (PR #180, gemerged 2026-05-26) registriert in
Modul 16:**

- Window-Event-Listener auf `sbkim:handshake` mit `outcome:"established"`-
  Filter (idempotent + fail-soft).
- Bei Treffer: `_meta.mycelConnected = true`, `data-stufe="gold"`,
  Stufenwechsel-Animation 600 ms.

**Klaus' Endknoten haben aber `sbkim/05_anastomose-v2.js` aus dem
2026-05-17-Stand** (BroadcastChannel-Bridge aus PR #76, vor Bau 17).
Diese Datei hat KEINEN `dispatchHandshakeEvent`-Hook — daher feuert
nichts an Modul 16.

**Empirischer Beweis aus dem Sichttest 2026-05-26:**

- Klaus' Cross-Knoten-Handshake via Eruda: `outcome:"established",
  score:0.9544` ✓
- Modul 16's `_meta.siegelStufe`: nach Handshake immer noch `"bronze"` ✗
- Nach manuellem `window.dispatchEvent("sbkim:handshake")` in Eruda:
  `_meta.siegelStufe: "gold"` ✓

→ Modul 16 reagiert korrekt auf Events, aber Modul 05 dispatcht sie
nicht. Fix in Modul 05.

## Nach dieser Sitzung

- **Kombinierbar mit Pflege 17 Widget-Bronze/Gold-Render**: beide
  Pflegen können in einem Endknoten-PR zusammen ausgerollt werden
  (Modul 17 + Modul 05 in einem Sweep).
- **Cross-Knoten-Vollbeweis-Sichttest**: Klaus tippt einen
  Cross-Knoten-Handshake in einem Endknoten an, beide SIEGEL
  wechseln **autonom** bronze→gold, kein Eruda-Trick mehr nötig.

## Heilige Tafeln dieser Sitzung

- KEIN Sage-Eingriff.
- KEIN Modul-Code-Edit (Volldatei-Replace).
- KEIN Modul-16-Eingriff (Modul 16 ist Sub-(e)-fähig).
- KEIN Modul-17-Eingriff (eigene Folge-Pflege).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN Spore-Reset.
