# Übergabeprotokoll · 2026-05-28 · Pflege 16 Bronze-Modal-Close-on-Andock

**Branch:** `claude/pflege-modul-16-bronze-modal-close`
**Sitzungs-Rolle:** Pflege-Sitzung (UX-Fix, eine Zeile Code + Doku-
Klarstellung).
**Auslöser:** Klaus' Sichttest in Mein-Rezeptbuch nach MR PR #252
(Modul-18-Einbau, gemergt 2026-05-28). Bronze-SIEGEL-Klick öffnet
Modul-16-Modal → `[Andocken]`-Klick öffnet Modul-18-Andock-Wizard
korrekt, **aber das Bronze-Modal bleibt darunter offen** — zwei
Modale übereinander, schlechtes UX.

---

## Was getan

### 1. `src/modules/16_siegel.js` — eine Zeile

Im `andockBtn`-Click-Handler (`renderBronzeHinweisBlock`, ~Z. 838-857):
NACH `try/catch` um `toolPwa.openAndockTab()` und VOR dem `return;`
einen `closeModal()`-Aufruf ergänzt.

**Vorher:**

```js
if (toolPwa && typeof toolPwa.openAndockTab === "function") {
  try { toolPwa.openAndockTab(); }
  catch (err) { warn("Modul 18 openAndockTab fehlgeschlagen.", err); }
  return;
}
```

**Nachher:**

```js
if (toolPwa && typeof toolPwa.openAndockTab === "function") {
  try { toolPwa.openAndockTab(); }
  catch (err) { warn("Modul 18 openAndockTab fehlgeschlagen.", err); }
  // Pflege 2026-05-28 (Bronze-Modal-Close-on-Andock): nach
  // erfolgreichem Wizard-Trigger das Bronze-Modal schließen,
  // damit nicht zwei Modale übereinanderliegen (Klaus' Sichttest-
  // Befund in Mein-Rezeptbuch). Fallback-Pfad (Modul 18 fehlt)
  // lässt das Modal absichtlich offen — User soll die Info-Notiz
  // noch lesen können.
  closeModal();
  return;
}
```

`closeModal()` ist eine bestehende closure-interne Funktion in
`16_siegel.js` (~Z. 1016), wird hier wiederverwendet.

### 2. Doku-Klarstellung in Karte 16

`docs/components/16_siegel.md` § Sub (e) Klick-Verhalten — eine
Klarstellungs-Zeile ergänzt:

> Bronze-Modal schließt sich beim erfolgreichen Andock-Pfad
> automatisch; Fallback-Pfad lässt es offen.

Plus § Bauzustand-Tabelle: neue Zeile „Pflege Bronze-Modal-Close
2026-05-28" am Listen-Ende mit voller Begründung.

### 3. Headless-Smoke

`tests/smoke_bau16_sub_e_bronze.mjs` weiterhin **16/16 grün**
(keine neuen Proben nötig — der Fix ist UX-Fluss, die existierenden
Sub-(e)-Proben prüfen Bronze→Gold-Stufenwechsel und Aspekt-4-
Render, beides unverändert).

`node --check src/modules/16_siegel.js` grün.

---

## Pflicht-Disziplin eingehalten

- ✓ KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump (UI-Fix, keine Schema-Änderung).
- ✓ KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Render-Schicht-Pflege).
- ✓ KEIN Eingriff in Modul 15/17/18/Storage.
- ✓ KEIN Eingriff in andere Stellen von `16_siegel.js` — nur die
  eine Zeile im `andockBtn`-Click-Handler.
- ✓ KEIN Eingriff in den Fallback-Pfad (Info-Notiz wenn Modul 18
  fehlt) — Modal bleibt absichtlich offen.

---

## Was offen blieb

1. **Klaus' Sichttest am Tab** — am besten parallel:
   - Sage-Page Panel 16 (Knopf 12 „Bronze-Klick öffnet Modal-
     Hinweis-Block + [Andocken]" + Modul 18 muss in der Sage-Page
     geladen sein → `[Andocken]`-Click sollte Bronze-Modal
     schließen + Wizard öffnen).
   - Mein-Rezeptbuch Tab — sobald Klaus diese Modul-16-Datei in
     MR sync'd, Bronze-Klick → `[Andocken]` → Wizard öffnet,
     Bronze-Modal weg.
2. **Sync-Sitzung MR (+ MM)** — nach Sichttest grün muss die neue
   `src/modules/16_siegel.js` auch in den externen Endknoten-Repos
   gespiegelt werden. Konvention: eigene kleine Pflege-Sitzung pro
   Endknoten-Repo (analog 5e-Re-Aktivierung 2026-05-26). Klaus
   triggert sie, sobald MR-/MM-Sichttest grün ist.

---

## Nächster sinnvoller Schritt

PR mergen → Sage-Sichttest Panel 16 → Sync-Sitzung MR + MM.

---

## Querverweise

- MR-Modul-18-Einbau: `lausiklauskn-png/Mein-Rezeptbuch` PR #252
  (gemergt 2026-05-28).
- Klaus' Sichttest-Screenshots 2026-05-28 16:52 + 16:53 zeigen
  Wizard + Bronze-Modal gleichzeitig offen (Bug-Nachweis).
- Karte 16 § Sub (e) Klick-Verhalten + § Bauzustand.
- Bestehende `closeModal()`-Funktion: `src/modules/16_siegel.js`
  ~Z. 1016.
