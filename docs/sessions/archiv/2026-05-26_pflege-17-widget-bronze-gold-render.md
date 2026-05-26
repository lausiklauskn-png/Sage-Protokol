# Übergabeprotokoll — Pflege 17 Widget-Bronze/Gold-Render (Sub-(e)-Folge-Pflege 1/3)

**Datum:** 2026-05-26
**Sitzungs-Rolle:** Pflege-Sitzung
**Branch:** `claude/pflege-17-widget-bronze-gold-render`
**Vorgänger-PR:** Sage #183 (Endknoten-Sichttest Cross-Knoten Sub (e)
+ drei Folge-Briefe, gemerged 2026-05-26 als `8d9011f3`)
**Brief:** `docs/sessions/BRIEF_PFLEGE_17_WIDGET_BRONZE_GOLD_RENDER.md`

---

## Anlass

Aus dem Endknoten-Sichttest Cross-Knoten Sub (e) am 2026-05-26 hatte
Klaus den Befund 1 von 3 geliefert:

> Das Siegel hat keine sichtbare Farbveränderung von Bronze auf Gold
> mitgemacht. Optisch war nichts zu sehen. Es müsste wenigstens einen
> Unterschied zwischen MM und MR zu sehen sein weil bei MR ist noch
> kein Verkehr.

**Diagnose:** Modul 17 Widget rendert den sichtbaren SIEGEL-Slot-
Button immer als Gold-Medaillon mit ★. Modul 16's `data-stufe="bronze"`
/`"gold"`-Attribut wirkt nur am unsichtbaren Widget-Proxy-Span im
Widget-Inneren (`<span id="sbkim-siegel-badge" visibility:hidden>`),
nicht am Slot-Button. Modul 17 muss den sichtbaren Slot-Button
stufen-abhängig stylen.

**Fix-Pfad** aus dem Brief (Architektur-Option ii — Lookup auf
`SbkimSiegel._meta.siegelStufe`):

1. Modul 17 erweitern um Stufen-Helper + State.
2. `mountSiegelSlot()` setzt initial-Stufe am Slot-Button via
   Lookup auf Modul 16.
3. `onHandshake()` re-checkt Stufe nach Event (via `setTimeout(0)`
   um Listener-Reihenfolge-Problem zu lösen).
4. CSS-Block erweitern um Bronze/Gold-Regeln + Stufenwechsel-Animation.
5. `_meta` um Live-Getter erweitern.
6. Panel 17 + Headless-Smoke + Doku nachziehen.

---

## Architektur-Entscheidung

**Pfad (ii) gewählt** (aus dem Brief): Modul 17 nutzt Lookup auf
`SbkimSiegel._meta.siegelStufe` + re-checkt bei `sbkim:handshake`-
Event.

**Begründung:** Modul 17 spiegelt nur den Zustand von Modul 16 —
keine doppelte Stufen-Logik. Wenn später eine neue Stufen-Logik
in Modul 16 kommt (z.B. Silber/Platin trotz Klaus' Strikte-Tabu),
muss Modul 17 nicht angepasst werden.

**Listener-Reihenfolge-Problem gelöst via `setTimeout(0)`:**

Im Endknoten-Andocker ist `SbkimWidget.init()` VOR `SbkimSiegel.init()`
verdrahtet (Bau-17-Modal-Bridge-Pflicht — Modul 17 muss seinen
Proxy-Span anlegen, bevor Modul 16 dort attached). Daher registriert
Modul 17 seinen `sbkim:handshake`-Listener VOR Modul 16's Listener
auf `window`. Bei `dispatchEvent` durchläuft Browser die Listener in
Registrierungs-Reihenfolge → Modul 17's `onHandshake()` läuft VOR
Modul 16's `onHandshakeEvent()`. Würde Modul 17 sofort
`getCurrentSiegelStufe()` aufrufen, sähe es noch die alte Stufe
`"bronze"`.

**Lösung:** Modul 17 verschiebt den Lookup via `setTimeout(0)` ans
Ende des Event-Loops — alle anderen Listener (inkl. Modul 16) sind
dann garantiert gelaufen, der State ist konsistent.

---

## Was getan

### Code-Eingriffe in `src/modules/17_floating_widget.js`

**Neuer Closure-State** (Zeile ~182):

```js
var siegelStufeRendered = null;
var siegelStufenwechselTimeoutId = null;
```

**Neue Helper** (vor `nowIso()`):

```js
function getCurrentSiegelStufe() {
  try {
    var siegel = global.SbkimSiegel;
    var stufe = siegel && siegel._meta && siegel._meta.siegelStufe;
    if (stufe === "gold") return "gold";
    return "bronze";
  } catch (_e) {
    return "bronze";
  }
}

function applySiegelStufe(stufe, withAnimation) {
  var btn = slotElements.siegel;
  if (!btn) return;
  var normalized = stufe === "gold" ? "gold" : "bronze";
  var previous = siegelStufeRendered;
  siegelStufeRendered = normalized;
  try {
    btn.setAttribute("data-siegel-stufe", normalized);
  } catch (err) {
    warn("data-siegel-stufe konnte nicht gesetzt werden.", err);
    return;
  }
  if (withAnimation && previous === "bronze" && normalized === "gold") {
    try {
      btn.classList.add("sbkim-widget-siegel-stufenwechsel");
      if (siegelStufenwechselTimeoutId !== null) {
        clearTimeout(siegelStufenwechselTimeoutId);
      }
      siegelStufenwechselTimeoutId = setTimeout(function () {
        try { btn.classList.remove("sbkim-widget-siegel-stufenwechsel"); }
        catch (_e) { /* nb */ }
        siegelStufenwechselTimeoutId = null;
      }, 600);
    } catch (err) {
      warn("Stufenwechsel-Animation konnte nicht gesetzt werden.", err);
    }
  }
}
```

**`mountSiegelSlot()`** um EINEN Aufruf erweitert (nach
`siegelMounted = true;`):

```js
applySiegelStufe(getCurrentSiegelStufe(), false);
```

**`onHandshake()`** um EINEN Aufruf erweitert (am Ende):

```js
setTimeout(function () {
  applySiegelStufe(getCurrentSiegelStufe(), true);
}, 0);
```

**`_meta`** um Live-Getter erweitert:

```js
get siegelStufeRendered() { return siegelStufeRendered; },
```

### CSS-Eingriffe in `buildCss()`-Block

Vier neue Regeln + ein neuer Keyframe:

```css
#sbkim-widget .sbkim-widget-slot.siegel[data-siegel-stufe="bronze"]::before {
  filter: saturate(0.5) brightness(0.78);
}
#sbkim-widget .sbkim-widget-slot.siegel[data-siegel-stufe="bronze"] .sbkim-widget-siegel-glyph {
  filter: saturate(0.5) brightness(0.78);
}
#sbkim-widget .sbkim-widget-slot.siegel[data-siegel-stufe="gold"]::before {
  filter: none;
}
#sbkim-widget .sbkim-widget-slot.siegel[data-siegel-stufe="gold"] .sbkim-widget-siegel-glyph {
  filter: none;
}
#sbkim-widget .sbkim-widget-slot.siegel.sbkim-widget-siegel-stufenwechsel::before {
  animation: sbkim-widget-siegel-stufenwechsel 600ms ease-out;
}

@keyframes sbkim-widget-siegel-stufenwechsel {
  0%   { transform: scale(1.0);  box-shadow: 0 0 6px rgba(201, 169, 97, 0.5); }
  40%  { transform: scale(1.35); box-shadow: 0 0 16px 4px rgba(201, 169, 97, 0.75); }
  100% { transform: scale(1.0);  box-shadow: 0 0 6px rgba(201, 169, 97, 0.5); }
}
```

**Begründung des Glyph-Filters parallel:** Der ★-Glyph ist eine
separate `<span class="sbkim-widget-siegel-glyph">`, die nicht im
Element-Tree des `::before`-Pseudoelementes hängt. Daher erbt der
Glyph den `filter:saturate(...)`-Effekt NICHT automatisch — muss
parallel gestylt werden.

### Panel 17 — neue Test-Knöpfe

`tests/manual_check.html` Panel 17 um zwei Knöpfe 13+14 erweitert:

- **Test 13:** SIEGEL-Slot Bronze-Initial-Stand. Liest
  `data-siegel-stufe` + `_meta.siegelStufeRendered` direkt vom Slot.
  Pass-Bedingung: beide `"bronze"`.
- **Test 14:** Bronze→Gold via synthetischem `sbkim:handshake`-
  Dispatch. Wartet 30 ms (für `setTimeout(0)` im Listener), prüft
  dann `data-siegel-stufe="gold"` + `.sbkim-widget-siegel-stufenwechsel`-
  Klasse + `_meta.siegelStufeRendered="gold"`.

### Headless-Smoke

`tests/smoke_bau17_floating_widget.mjs` um zwei neue Proben erweitert:

- **Probe 32:** Mock-`SbkimSiegel` mit `_meta.siegelStufe:"bronze"`,
  dispatch `sbkim:siegel-certified` → Slot mounted mit
  `data-siegel-stufe="bronze"` + Getter zeigt `"bronze"`.
- **Probe 33:** Mock-Stufe auf `"gold"` setzen + dispatch
  `sbkim:handshake outcome:"established"` → nach 20 ms (`setTimeout(0)`)
  Slot zeigt `data-siegel-stufe="gold"` + Stufenwechsel-Klasse +
  Getter `"gold"`.

**Resultat:** 34/34 grün (vorher 32/32).

### Regression-Tests

- `smoke_bau15b_membran.mjs`: 31/31 grün
- `smoke_bau16_sub_e_bronze.mjs`: 15/15 grün

Keine Brüche an Modul 15/16-Code.

### Doku-Pflege

- **Karte 17 § Bauzustand** neue Zeile „Pflege Sub-(e)-Visueller-Slot-
  Render" mit vollem Bericht.
- **INTERFACES.md § 1 Modul 17 Geprüft-Zeile** um Pflege-Eintrag
  erweitert.
- **INTERFACES.md § 10 Änderungsprotokoll** neue Tabellen-Zeile.
- **PULS.md** Sitzungs-Eintrag oben.
- `status.json` Modul 17 **unverändert** (bleibt `"stub"`); Pie nicht
  regeneriert (additive UX-Pflege, kein Score-Wechsel).

---

## Was diese Pflege NICHT getan hat

- KEIN Modul-16-Eingriff (Modul 16's Sub-(e)-Logik bleibt unangetastet
  — Modul 17 spiegelt nur den Stand am sichtbaren Slot).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Schicht-Pflege, kein
  Sicherheits-Modul — CLAUDE.md § „Sicherheits-Module pflegen Aspekte"
  greift nicht).
- KEIN Endknoten-Eingriff (Endknoten ziehen den neuen Modul-17-Code
  in eigener Folge-PR nach).
- KEINE Tafel-Umsortierung CLAUDE.md.

---

## Heilige Tafeln respektiert

- Pflege-Sitzung läuft als eigener PR (Sub-(e)-Folge-Pflege 1 von 3).
- Render-Schicht-Eingriff bleibt isoliert (kein Backend-Modul
  angefasst).
- Listener-Reihenfolge-Problem via `setTimeout(0)` gelöst — sauberer
  Pfad ohne Architektur-Bruch.

---

## Was offen blieb

- **Klaus' Browser-Sichttest** in DeX-Chrome: Panel 17 Knöpfe 13+14
  → Bronze-Slot visuell + Bronze→Gold-Animation sichtbar nach
  Cross-Knoten-Handshake.
- **Endknoten-Update-Pflege** pro MR + MM: neuer Modul-17-Code aus
  Sage-`main` in die Endknoten ziehen (kombinierbar mit den
  anderen zwei Sub-(e)-Folge-Pflegen Modul-05-Update +
  Modal-Local-Time, ein Endknoten-PR pro Repo für alle drei
  Modul-Updates auf einmal).
- **Folge-Pflege 2/3:** Endknoten-Modul-05-Update (Brief liegt).
- **Folge-Pflege 3/3:** Modul 16 Modal-Local-Time (Brief liegt).

---

## Nächster sinnvoller Schritt

**Pflege Endknoten-Modul-05-Update** als nächste Folge-Pflege. Macht
den manuellen Eruda-Dispatch aus dem Sub-(e)-Sichttest überflüssig.
Brief liegt in `docs/sessions/BRIEF_PFLEGE_ENDKNOTEN_MODUL_05_UPDATE.md`
— zwei externe Bau-Sitzungen pro MR + MM.

---

## PR-Konvention

Branch `claude/pflege-17-widget-bronze-gold-render`, Draft-PR folgt
unmittelbar nach Commit + Push. Klaus zieht ihn ready+merge via
„PR mergen"-Zuruf.
