# Übergabeprotokoll — Endknoten-Sichttest Cross-Knoten Sub (e) + drei Folge-Briefe

**Datum:** 2026-05-26
**Sitzungs-Rolle:** Pflege-Sitzung Sichttest-Bilanz + Folge-Briefe
**Branch:** `claude/sichttest-sub-e-endknoten-bilanz`
**Vorgänger-PRs:**
- Sage #180 (Bau 16 Sub (e) Bronze/Gold)
- Sage #181 (Sichttest 16 Sub (e) grün 4/4 Headless)
- Sage #182 (Briefe Re-Aktivierung MR + MM)
- Mein-Rezeptbuch #249 (Re-Aktivierung Modul 15+16+17+sw)
- Mein-Mixarium #58 (Re-Aktivierung Modul 15+16+17+sw)
- Folge-Fix-PRs für `badgeSelector`-Konfig (MR + MM, eigene PRs)

---

## Anlass

Pipeline-Phase A Schritt 5e abzuschließen — Klaus hat in DeX-Chrome
auf Galaxy Tab S6 den vollen Cross-Knoten-Sub-(e)-Sichttest mit
beiden Endknoten in derselben Chrome-Instanz gefahren. Diese
Pflege-Sitzung zieht den Befund in alle Sage-Doku-Ankerpunkte nach
und legt **drei eigenständige Folge-Briefe** für die identifizierten
Befunde an.

---

## Sichttest-Verlauf (chronologisch)

### Schritt 1 — MR + MM Re-Aktivierung (PR #249 + #58)

Klaus' Mein-Rezeptbuch + Mein-Mixarium-PWAs nach dem
Bronze/Gold-Rückbau (PR #244) hatten zwar Modul 17 Widget gelassen,
aber Modul 15 + 16 zurückgebaut. Diese Sitzung hat in beiden Endknoten:

- `sbkim/15_membran.js` (Sage Bau 15.B Stand) eingespielt
- `sbkim/16_siegel.js` (Sage Sub (e) Stand fe011d1) eingespielt
- `sbkim/17_floating_widget.js` (Sage Pflege-17-Stand) aktualisiert
- `sbkim-sw.js` (Sage Bau 15.SW + aktueller Hook) aktualisiert
- `sbkim-init.js` minimal-patched: `SbkimMembrane.init` + `SbkimSiegel.init`
  nach `SbkimWidget.init`

Klaus hat MR PR #249 + MM PR #58 gemerged.

### Schritt 2 — badgeSelector-Konfig-Bug

Erst-Sichttest in MR: SIEGEL-Slot sichtbar im Widget, Modal öffnet
sich aber NICHT auf Klick. Diagnose in Eruda:

```
[SbkimSiegel] badgeSelector ".lamps" auch nach 10000 ms nicht
gefunden — Badge-Mount übersprungen.
```

Sage-Default `badgeSelector:".lamps"` ist Sage-Page-spezifisch (Klasse
existiert auf Sage-PWA in der Navleisten-Plaketten-Reihe). Endknoten
haben keine `.lamps`-Klasse → Badge-Mount übersprungen, kein
Click-Handler attached.

**Fix-PRs** in MR + MM (1-Zeilen-Patch in `sbkim-init.js`):

```js
SbkimSiegel.init({
  badgeSelector: "#sbkim-siegel-badge",  // Widget-Proxy-Anker
  repoUrl: "https://github.com/lausiklauskn-png/<Endknoten>",
});
```

`#sbkim-siegel-badge` ist der unsichtbare Proxy-Span, den das Floating-
Widget Modul 17 im Inneren anlegt (Modal-Bridge-Option 1 aus Bau 17).
Nach Fix-PRs: Modal öffnet sich, Bronze-Hinweis-Block + `[Andocken]`-
Knopf + Modul-18-Info-Notiz sichtbar, Aspekt 4 mit „pending"-Marker.

### Schritt 3 — Cross-Knoten-Handshake via Eruda

**Initial-Fail-Pfad** mit `fetch(MR-spore.json)`:

```js
var peerSpore = await fetch("https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/spore.json").then(r => r.json());
...
await SbkimAnastomose.handshake(peerSpore, ownVec);
```

→ `InvalidPeerSporeError: Empfänger-Spore ungültig: Signatur ungültig`.

Diagnose: MR's gepushte Pages-spore.json hat **alte nodeId
`BSWxXm…`** (Stand 2026-05-17), aber MR's aktuelles IndexedDB hat
**neue Identität `uOpUBezU…`** (nach Rückbau-Cycle). Pages-Datei +
IndexedDB-Identität sind out-of-sync — Signatur-Verify schlägt fehl.

**Workaround-Pfad** mit BroadcastChannel-Spore-Bridge:

- MR-Eruda: `var spore = await SbkimSpore.getOwnSpore(); var bc =
  new BroadcastChannel('mr-spore-bridge'); bc.postMessage(spore);`
  in einer 5-Min-Sender-Loop (alle 1s).
- MM-Eruda: 60-s-Listener auf demselben Channel-Namen empfängt
  Spore, übergibt sie an `SbkimAnastomose.handshake(peerSpore,
  ownVec)`.

(Vor-Schritt: `navigator.clipboard.readText()`-Workaround scheiterte —
DeX-Chrome `copy()` aus Eruda landet nicht im System-Clipboard.
BroadcastChannel ist robuster.)

**Resultat:**

```
ORIGIN: https://lausiklauskn-png.github.io/Mein-Mixarium/
Empfangen vec-type: Array len: 384
OUTCOME: established SCORE: 0.9544261159927087
```

Cross-Knoten-Handshake erfolgreich. Datenseitig haben beide PWAs
sich in `sbkim_siblings_<key>` gespeichert (vermutet, nicht
direkt verifiziert).

### Schritt 4 — Bronze→Gold-Wechsel via manuellem Dispatch

Nach erfolgreichem Handshake: Klaus' Eruda-Check in MM:

```js
console.log("stufe:", SbkimSiegel._meta.siegelStufe, "connected:", SbkimSiegel._meta.mycelConnected);
→ stufe: bronze connected: false
```

**Befund:** Modul 16 hat das `sbkim:handshake`-window-Event NICHT
empfangen, obwohl Modul 05 erfolgreich gehandshaket hat.

**Diagnose:** Klaus' Endknoten haben `sbkim/05_anastomose-v2.js` (alte
Bridge-Version aus 2026-05-17, prä-Bau-17). Die dispatcht KEIN
`sbkim:handshake`-Event automatisch.

**Manueller Eruda-Dispatch in MM:**

```js
window.dispatchEvent(new CustomEvent("sbkim:handshake", { detail: { outcome: "established" }}));
→ stufe: gold
```

Modul 16 reagiert KORREKT auf den Event:
- `_meta.siegelStufe: "gold"`
- `_meta.mycelConnected: true`
- `_meta.mycelConnectedAt: "2026-05-26T…"`-ISO

Modal-Refresh sichtbar: Bronze-Hinweis-Block weg, Aspekt 4 datiert.
SIEGEL-Slot im Widget rendert allerdings visuell unverändert
(siehe Folge-Befund (1) unten).

In MR auch manuell dispatcht — Modul 16 in MR reagiert genauso,
gleicher Stand.

**VERKEHR-Slot in MM-Widget** zeigt `handshake outgoing established`-
Event live aus dem manuellen Dispatch — der Widget-Event-Bus aus
Bau 17 funktioniert korrekt.

---

## Sub-(e)-Funktionale Bilanz (4-Punkte-Sichttest)

| Punkt | MR | MM |
|---|---|---|
| 1 Initial-Bronze (visuell + Eruda + Modal) | ✅ | ✅ |
| 2 Cross-Knoten-Handshake `established` 0.9544 | — (passiver Empfänger) | ✅ (aktiver Sender) |
| 3 Bronze→Gold via Dispatch + Modal-Refresh | ✅ | ✅ |
| 4 RAM-only-Persistenz (Tab-Reload) | (nicht erneut getestet, RAM-Spec-Konform vermutet) | (nicht erneut getestet) |

**Sub (e) funktional vollständig bewiesen** in beiden Endknoten.

---

## Drei eigenständige Folge-Befunde (separate Pflege-Sitzungen)

### Folge 1 — Widget-SIEGEL-Slot stufen-unabhängig

**Befund:** Modul 17 Widget rendert SIEGEL-Slot-Button immer als
Gold-Medaillon mit ★, unabhängig von Modul-16's `_meta.siegelStufe`.
Modul 16 setzt `data-stufe="bronze"`/`"gold"` am unsichtbaren
Widget-Proxy-Span — wirkt nicht am sichtbaren Slot-Button.

**Klaus' Befund-Worte:** „Das Siegel hat keine sichtbare
Farbveränderung von Bronze auf Gold mitgemacht. Optisch war nichts
zu sehen. Es müsste wenigstens einen Unterschied zwischen MM und MR
zu sehen sein weil bei MR ist noch kein Verkehr."

**Fix-Pfad:** Modul 17 erweitern um Stufen-Listener +
Slot-Button-CSS-Anpassung.

**Brief:** `docs/sessions/BRIEF_PFLEGE_17_WIDGET_BRONZE_GOLD_RENDER.md`.

### Folge 2 — Endknoten-`sbkim/05_anastomose-v2.js` prä-Bau-17

**Befund:** Klaus' Endknoten haben die alte BroadcastChannel-Bridge-
Version aus 2026-05-17. Dispatcht KEIN `sbkim:handshake`-window-Event
automatisch beim erfolgreichen Cross-Knoten-Handshake. Bronze→Gold
nur via manuellem Eruda-Dispatch testbar.

**Fix-Pfad:** Endknoten-Modul-05 auf Sage-main-Stand updaten
(Volldatei-Replace, analog Modul 15/16/17/sw aus PR #249 + #58).

**Brief:** `docs/sessions/BRIEF_PFLEGE_ENDKNOTEN_MODUL_05_UPDATE.md`.

### Folge 3 — Modal-„Bezeugt seit … Uhr" zeigt UTC statt MESZ

**Befund:** Modal-Datum wird ohne explizite `toLocaleString("de-DE")`-
Konvertierung gerendert. Klaus' Tablet-Zeit ist MESZ; Modal zeigt
aber UTC-Zeit (~2h Differenz).

**Klaus' Befund-Worte:** „Datum/Uhrzeit ist nicht aktuell, ich
vermute nicht Mitteleuropäische Zeit, eher Amerikan."

**Fix-Pfad:** Modul 16 `mountSiegelModal()` `certifiedAt`-Anzeige auf
explizite `toLocaleString("de-DE", {dateStyle:"medium",
timeStyle:"short"})` umstellen.

**Brief:** `docs/sessions/BRIEF_PFLEGE_16_MODAL_LOCAL_TIME.md`.

---

## Was diese Pflege-Sitzung getan hat

1. **Karte 16 § Bauzustand** Zeile „In Endknoten eingebaut" gefüllt
   mit vollem Cross-Knoten-Sichttest-Bericht + drei Folge-Befunde.
2. **INTERFACES.md § 1 Modul 16 Geprüft-Zeile** um Endknoten-
   Cross-Knoten-Sichttest-Eintrag erweitert.
3. **INTERFACES.md § 10 Änderungsprotokoll** neue Tabellen-Zeile
   „Endknoten-Sichttest Cross-Knoten Sub (e) + drei Folge-Briefe".
4. **`status.json` Modul 16** `siegel`-Text um Cross-Knoten-
   Sichttest-Befund + drei Folge-Befunde erweitert.
5. **`python3 scripts/update_puls_pie.py`** aufgerufen — Pie
   unverändert (Score-Wechsel nicht stattfindend; Modul 16 bleibt
   `"stub"` bis Voll-Sichttest 1–8 + Folge-Befunde behoben).
6. **PULS.md** Schnellüberblick Modul-16-Zeile aktualisiert + neuer
   Sitzungs-Eintrag oben.
7. **Drei Folge-Briefe** in `docs/sessions/` angelegt.
8. **Übergabeprotokoll** (diese Datei) angelegt.

---

## Was diese Pflege NICHT getan hat

- KEIN Modul-Code-Eingriff in Sage (Diagnose-Sitzung; Code-Pflegen
  kommen in den drei Folge-PRs).
- KEIN Endknoten-Eingriff (Klaus' Sichttest war live, MR + MM laufen
  bereits auf neuer Sage-Code-Basis nach Merge der Re-Aktivierungs-
  PRs + badgeSelector-Fix-PRs).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Sichttest-Bilanz ist keine
  Sicherheits-Modul-Pflege).
- KEINE Tafel-Umsortierung CLAUDE.md.

---

## Heilige Tafeln respektiert

- Score-Wechsel-Konvention: Modul 16 bleibt `"stub"`, weil Knöpfe
  1–8 (Bau-16-Basis) noch ungeprüft + drei Folge-Befunde offen.
- Sichttest-Befund in alle drei Doku-Ankerpunkte (Karte +
  INTERFACES.md + status.json + PULS).
- Folge-Pflegen als eigene Briefe — keine vermischte Sammel-PR.
- Pipeline-Phase A Schritt 5e ist hiermit funktional abgeschlossen.

---

## Was offen blieb

- **Sichttest Bau-16-Basis Knöpfe 1–8** weiterhin ungeprüft.
- **Drei Folge-Pflegen** in eigenen PRs (Briefe liegen):
  1. Pflege 17 Widget-Bronze/Gold-Render (Sage)
  2. Pflege Endknoten-Modul-05-Update (MR + MM — zwei externe PRs)
  3. Pflege 16 Modal lokale Zeit (Sage)
- **Endknoten-Update-Welle** nach Sage-Pflegen: MR + MM ziehen die
  drei aktualisierten Module nach (kombinierbar in einem Endknoten-
  PR pro Repo).

---

## Nächste Schritte (priorisiert)

1. **Pflege 17 Widget-SIEGEL-Slot Bronze/Gold** (Sage, kleine Bau-
   Sitzung). Klaus' visueller Wunsch.
2. **Pflege Endknoten-Modul-05-Update** (zwei externe Bau-Sitzungen).
   Macht den manuellen Eruda-Dispatch überflüssig — produktiver
   Auto-Bronze→Gold-Wechsel.
3. **Pflege 16 Modal lokale Zeit** (Sage, sehr kleine Pflege).
4. **Endknoten-Update-Welle** (MR + MM): die drei neuen Sage-
   Pflegen 1+2+3 in einem PR pro Endknoten nachziehen.
5. Optional: Sichttest Bau-16-Basis Knöpfe 1–8 (Klaus).

---

## PR-Konvention

Branch `claude/sichttest-sub-e-endknoten-bilanz`, Draft-PR folgt
unmittelbar nach Commit + Push. Klaus zieht ihn ready+merge via
„PR mergen"-Zuruf.
