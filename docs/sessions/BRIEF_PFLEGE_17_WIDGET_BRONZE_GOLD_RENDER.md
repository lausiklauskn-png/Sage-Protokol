# Brief — Pflege Modul 17 Widget-SIEGEL-Slot Bronze/Gold-Render

**Anlass:** Endknoten-Sichttest Cross-Knoten Sub (e) am 2026-05-26 hat
gezeigt: das Floating-Widget Modul 17 rendert den SIEGEL-Slot
**stufen-unabhängig** als Gold-Medaillon mit ★, unabhängig von Modul
16's `_meta.siegelStufe`-Wert. Modul 16 setzt `data-stufe="bronze"`/
`"gold"` auf das `#sbkim-siegel-badge`-Element — aber im Endknoten-
Widget-Pfad ist das nur der unsichtbare Proxy-Span im Widget-Inneren,
nicht der sichtbare Slot-Button.

**Klaus' Befund (DeX-Chrome, Mein-Mixarium-Tab):**

> Das Siegel hat keine sichtbare Farbveränderung von Bronze auf Gold
> mitgemacht. Optisch war nichts zu sehen. Es müsste wenigstens einen
> Unterschied zwischen MM und MR zu sehen sein weil bei MR ist noch
> kein Verkehr.

Klaus hat funktional recht: Modal-Inhalt zeigt den Wechsel korrekt
(Bronze-Hinweis-Block sichtbar/weg, Aspekt 4 pending/datiert), aber
der SIEGEL-Slot im Widget-Pille ist visuell immer gleich.

**Repo:** `lausiklauskn-png/Sage-Protokol` (interne Bau-Pflege-Sitzung).

**Pipeline-Stellung:** Folge-Pflege zu Sub-(e)-Sichttest-Bilanz
(Pipeline-Phase A Schritt 5e abgeschlossen). Diese Sitzung ergänzt
**Sub (e) Visueller Slot-Unterschied** auf Modul 17.

**Voraussetzungen:**

- Sub-(e)-Sichttest-Bilanz-PR ist gemerged (`claude/sichttest-sub-e-
  endknoten-bilanz`).
- Modul 17 `src/modules/17_floating_widget.js` aktuell auf Sage-main.
- Modul 16 `src/modules/16_siegel.js` ist Sub-(e)-fähig (PR #180 + #181
  gemerged).

**Branch-Vorschlag:** `claude/pflege-17-widget-bronze-gold-render`

---

## Brief-Codeblock (für den ersten Prompt der Pflege-Sitzung)

```
Du bist eine Pflege-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Pflege Modul 17 Floating-Widget — visueller Stufen-
Unterschied am SIEGEL-Slot-Button (Bronze gedämpft / Gold voll).
Behebung des Sub-(e)-Sichttest-Befunds (1) vom 2026-05-26.

Branch: claude/pflege-17-widget-bronze-gold-render (vom main aus
anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md § Pflicht am Sitzungsende + § „Was du tust" (Pflicht-
   Konvention Sicherheits-Module-Aspekt gilt NICHT — Modul 17 ist
   Render-Schicht, kein Sicherheits-Modul).
2. docs/PULS.md jüngsten Sitzungs-Eintrag „Endknoten-Sichttest Cross-
   Knoten Sub (e) + drei Folge-Briefe".
3. docs/components/17_floating_widget.md (KOMPLETT — Modul 17 wird
   um Stufen-Render erweitert).
4. docs/components/16_siegel.md § Sub (e) Mycel-Verbindungs-Stufe
   (Verständnis der Stufen-Logik in Modul 16 + Modal-Bridge).
5. src/modules/17_floating_widget.js (KOMPLETT — die Render-Logik
   für SIEGEL-Slot finden).
6. src/modules/16_siegel.js § applyStufeToBadge (Verständnis, wo
   Modul 16 das `data-stufe`-Attribut setzt — das passiert am
   `#sbkim-siegel-badge`-Proxy-Span im Widget-Inneren).

Heilige Tafeln dieser Sitzung:

- KEIN Modul-16-Eingriff (Modul 16 setzt `data-stufe` korrekt, das
  ist Spec-Konform).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN Endknoten-Eingriff (Endknoten werden in eigener Folge-Sitzung
  aktualisiert nach Merge).
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Schicht-Pflege, kein
  Sicherheits-Modul-Update).
- KEINE Tafel-Umsortierung CLAUDE.md.

Deine Aufgabe:

A. **Architektur-Entscheidung.** Zwei Pfade:
   - (i) Modul 17 lauscht auf `sbkim:handshake outcome:"established"`
        und ändert beim Empfang das CSS des SIEGEL-Slot-Buttons
        (z.B. `data-siegel-stufe="gold"` setzen).
   - (ii) Modul 17 nutzt einen lookup auf `SbkimSiegel._meta.siegelStufe`
         im `mountSiegelSlot()`-Aufruf + setzt initial-data-attribut +
         re-setzt bei `sbkim:handshake`-Event.

   Empfehlung: (ii) — robust gegen Event-Reihenfolge (Modul 16 init
   vor Modul 17 dispatch). Initial-Stand wird sauber abgebildet.

B. **`src/modules/17_floating_widget.js` erweitern**:
   - Neue Helper `getSiegelStufe()`: liest fail-soft
     `window.SbkimSiegel?._meta?.siegelStufe || "bronze"`.
   - In `mountSiegelSlot()`: nach Slot-Button-Mount das Attribut
     `data-siegel-stufe` setzen.
   - Im `sbkim:handshake`-Listener: bei `outcome:"established"`
     den `data-siegel-stufe`-Wert auf `"gold"` aktualisieren +
     CSS-Klasse `.sbkim-widget-siegel-stufenwechsel` für 600 ms
     setzen (Animation analog Modul 16's `.stufenwechsel-gold`).

C. **`buildCss()`-Block in Modul 17 erweitern**:
   - `#sbkim-widget-slot-siegel[data-siegel-stufe="bronze"]`:
     gedämpftes Gold-Medaillon (filter saturate(0.6) brightness(0.85)
     analog Sub-(e)-Spec), Bronze-glow im Hover.
   - `#sbkim-widget-slot-siegel[data-siegel-stufe="gold"]`:
     Default-Render (kein Override).
   - `#sbkim-widget-slot-siegel.sbkim-widget-siegel-stufenwechsel`:
     600 ms Animations-Klasse (Skalierung + Glow), analog
     `@keyframes siegel-stufenwechsel-gold` aus index.html.

D. **Modul 17 _meta erweitern** um Live-Getter
   `siegelStufeRendered` (string|null — was das Widget gerade
   anzeigt). Für Tests und Diagnose.

E. **Panel 17 in `tests/manual_check.html`** — neuer Test:
   - Test N: SIEGEL-Slot zeigt initial `data-siegel-stufe="bronze"`
     bei Mock-isCertified + Mock-stufe=bronze.
   - Test N+1: Nach `dispatchEvent("sbkim:handshake", outcome:"established")`
     ändert sich `data-siegel-stufe="gold"` + Stufenwechsel-Klasse
     für 600 ms.

F. **Headless-Smoke** `tests/smoke_bau17_floating_widget.mjs`
   erweitern: zwei neue Proben für Stufen-Render-Logik.

G. **Karte 17 § Bauzustand** neue Zeile „Pflege Sub-(e)-Visueller
   Slot-Render".

H. **INTERFACES.md § 1 Modul 17** Bietet-Block + Storage-Block
   um `data-siegel-stufe`-Attribut + _meta-Getter erweitern;
   § 10 Änderungsprotokoll neue Tabellen-Zeile.

I. **`status.json`** Modul 17 unverändert lassen (Score bleibt
   `"stub"`, Render-Pflege ist additiv); `python3 scripts/
   update_puls_pie.py` aufrufen.

J. **Endknoten-Hinweis im PR-Body**: Mein-Rezeptbuch + Mein-Mixarium
   müssen `sbkim/17_floating_widget.js` auf den neuen Sage-Commit
   nachziehen — eigene Folge-PRs pro Endknoten.

Pflicht am Ende:

- src/modules/17_floating_widget.js erweitert.
- Panel 17 + smoke_bau17 grün.
- node --check grün.
- Modul-15-Regression (smoke_bau15b) + Modul-16-Sub-(e)-Regression
  (smoke_bau16_sub_e_bronze) grün.
- Commit + Push + Draft-PR.
- PR-Body verweist auf Sub-(e)-Sichttest-Bilanz-PR + diesen Brief.
```

---

## Hintergrund

**Modal-Bridge-Architektur (Bau 17 Option 1):**

Klaus' Endknoten nutzen das Floating-Widget Modul 17, das einen
sichtbaren SIEGEL-Slot-Button rendert + im Inneren einen
unsichtbaren Proxy-Span `<span id="sbkim-siegel-badge"
style="visibility:hidden;pointer-events:none">` als DOM-Anker für
Modul 16. Klick auf den sichtbaren Slot-Button leitet via
`proxyClickModalBridge` zum Proxy-Span weiter, der Modul-16's
Click-Handler trägt.

**Was Modul 16 macht (Sub e):** `data-stufe="bronze"`/`"gold"` wird
am Proxy-Span gesetzt. Die CSS-Regeln in Sage's `index.html`
(`#sbkim-siegel-badge[data-stufe="bronze"] { filter: saturate(0.6) }`)
greifen am Proxy-Span — der ist aber unsichtbar.

**Was fehlt:** Modul 17 muss den sichtbaren Slot-Button entsprechend
stufen-abhängig stylen. Das ist eine Pflege auf Modul-17-Ebene, kein
Modul-16-Bug.

## Nach dieser Sitzung

- **Endknoten-Update-Sitzungen** pro MR + MM (eigene PRs in den
  Endknoten-Repos): `sbkim/17_floating_widget.js` auf neuen Sage-
  Commit ziehen, dann Klaus' Browser-Sichttest visuell verifizieren
  (SIEGEL bronze in MR pre-handshake, gold in beiden post-handshake).
- **Optional kombinierbar** mit Pflege Modul-05-Update (zweite Folge-
  Pflege aus dem Sichttest-Befund) — ein gemeinsamer Endknoten-
  Update-PR pro Repo.

## Heilige Tafeln dieser Sitzung

- KEIN Modul-16-Eingriff.
- KEIN PROTOCOL_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag.
- KEIN Endknoten-Eingriff.
