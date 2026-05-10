# Modul 08 — UI-Demo (Sicht- und Funktionsprüfung)

**Status:** Schablone (Spec ausstehend)
**Datei (Code):** `src/modules/08_ui_demo.js` + `tests/manual_check.html`
**Abhängigkeiten:** alle anderen Module (lockerer Knopf-pro-Modul-Ansatz)

---

## Zweck

`tests/manual_check.html` ist die zentrale **Sichtprüfungs-Seite** dieses
Repos. Modul 08 liefert die Knöpfe und Status-Anzeigen, mit denen jedes
einzelne Modul angetriggert und das Ergebnis sichtbar gemacht wird.

Diese Seite **ist** der Smoke-Test. Sie ist kein automatisches Test-
Framework — der Mensch klickt, der Mensch bewertet.

---

## Verantwortung

**Macht:**
- Pro Modul mindestens einen Knopf, der dessen Hauptfunktion ausführt
- Ein Ausgabefenster (`<pre>` oder `<div>`), in das jedes Modul sein
  Ergebnis schreibt
- Eine Statuszeile pro Modul (geladen / nicht geladen / fehler)
- Keine Frameworks (kein React, kein Vue) — reines HTML+JS, eine Datei

**Macht nicht:**
- Keine produktive UI für Endknoten-Apps (das machen Rezeptbuch und
  Mixarium selbst)
- Kein Styling über das nötigste hinaus (das hier ist Werkstatt)

---

## Schnittstelle

*(noch zu spezifizieren — minimal)*

```
addPanel(moduleName: string, controls: Array<{
  label: string,
  action: () => Promise<any>,
}>)
log(moduleName: string, line: string)
setStatus(moduleName: string, status: "ok"|"warn"|"err", text: string)
```

---

## Manueller Test

Die Datei `tests/manual_check.html` *ist* der manuelle Test. Sie öffnet
sich im Browser ohne Server (`file://`) oder über einen lokalen Server
(`python3 -m http.server`).

---

## Risiken / Edge Cases

- Service-Worker (für Modul 05) braucht HTTPS oder `localhost` — unter
  `file://` nicht testbar. Hinweis prominent in der Seite.
- Embedding-Modell (Modul 03) braucht beim ersten Lauf Internet.

---

## Querverweise

- jede andere Komponenten-Karte hat einen "Manueller Test"-Abschnitt,
  der zu einem Knopf in dieser Seite wird

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Stub `tests/manual_check.html` angelegt | 2026-05-10 | Skelett | nur Gerüst |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
