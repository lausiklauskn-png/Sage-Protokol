---
name: netz-karte-fenster
description: Bauweise C für Container — das SCHWEBENDE FENSTER („Mit dem Netz verbinden", Modul 23 UI), das über jeder Seite liegt, sich ziehen, minimieren und schließen lässt und seine Lage merkt. Anwenden, wenn ein Werkzeug-Panel, Hilfe-Fenster, Status-Fenster oder Andock-Dialog über eine bestehende Seite gelegt werden soll — und IMMER, wenn ein solches Fenster auf schmalen Handy-Schirmen falsch dasteht (halb draußen, fingerbreiter schirmhoher Kasten, Knopf unter der Lampen-Leiste, nicht greifbar). Enthält die drei verbindlichen Lage-Regeln aus echten Befunden an Klaus' Geräten (78-px-Ausnahme unter 560 px, waagerecht nie über den Rand, senkrecht schon) und die Kaskaden-Kollision, die daraus entstand — `top` und `bottom` gleichzeitig an einem `position:fixed`-Element zieht es über die ganze Höhe. Die Gegenstücke für Listen-Karten sind `app-container-kompakt` und `app-container-schaufenster`.
---

# Bauweise C — das schwebende Fenster

**Wofür:** ein Werkzeug, das über einer fremden Seite liegt, ohne sie umzubauen.
**Gebaut an:** Modul 23 UI („Mit dem Netz verbinden"), Stand 2026-08-11.

Anders als eine Listen-Karte gehört dieses Fenster **niemandem im Seitenfluss**.
Es hängt frei im `<body>`, liegt über allem und muss sich deshalb um Dinge
kümmern, die eine normale Karte geschenkt bekommt: wo es steht, ob es noch
greifbar ist, und was passiert, wenn der Schirm kleiner ist als es selbst.

**Genau daran ist es dreimal gescheitert** — jeder Befund kam von Klaus' Geräten,
jeder kostete eine eigene Sitzung. Deshalb gibt es diesen Skill.

---

## Die drei Zustände

```
   🌐          →   ┌─────────────────┐      →   ┌──────────────────────┐
  Blase            │ Titel      – ✕  │          │ Titel           – ✕  │
 (Ruhe)            ├─────────────────┤          ├──────────────────────┤
                   │ Knöpfe          │          │ Liste, Ergebnisse    │
                   └─────────────────┘          │ …                    │
                    (Panel)                     └──────────────────────┘
                                                 (gezogen/vergrößert)
```

Die Blase ist der Ruhezustand und **klein**. Sie wächst nur bei Berührung. Ein
Fenster, das ungefragt Fläche nimmt, ist auf dem Handy sofort im Weg.

---

## Die drei Lage-Regeln — verbindlich

Jede stammt aus einem echten Befund. Sie gehören **in die Doku**, nicht nur als
Kommentar in den Code: wer die Bauart liest, sieht Kommentare nicht und räumt sie
beim nächsten Umbau ahnungslos ab. Genau das ist passiert.

| Regel | Woher sie kommt |
|---|---|
| Unter **560 px** rückt der Knopf um **78 px** hoch, wenn er in einer **unteren** Ecke verankert ist | die Status-Lampen-Leiste lag darüber; mit dem Finger war die Lampe nicht mehr zu treffen. 78 = 16 Rand + ~56 Leiste + 6 Luft |
| **Waagerecht** darf nichts über den Rand hinaus geklemmt werden | gemessen: ein 420 px breites Panel bei 1100 px zeigte nur noch **120 px**; die Blase war bei 500 px mit **−480 px ganz weg** („auch auf den iOS-Handys") |
| **Senkrecht** darf es über den Rand ragen, solange ein greifbarer Streifen bleibt | die alte Klemme verlangte, dass das GANZE Panel auf den Schirm passt — ein hohes Panel klemmte dann senkrecht fest |

Die zwei Klemm-Regeln sind **nicht symmetrisch**, und das ist Absicht: waagerecht
gibt es kein Ausweichen (was rechts raus ist, ist weg), senkrecht schiebt man mit
dem Daumen nach.

```js
/* waagerecht hart, senkrecht weich */
function clampInts(pos, el) {
  var b = el.getBoundingClientRect();
  var KEEP = 44;                       /* greifbarer Streifen */
  return {
    links: Math.min(Math.max(pos.links, 0), Math.max(0, innerWidth - b.width)),
    oben:  Math.min(Math.max(pos.oben, -(b.height - KEEP)), innerHeight - KEEP)
  };
}
```

---

## ⚠ Die Falle, die daraus entstand — und die wiederkommen kann

Auf zwei Handys stand statt der Blase ein **fingerbreiter, schirmhoher Kasten**
mit der Schrift in der Mitte. Es sah nach kaputtem Layout aus. Es war eine
**Kaskaden-Kollision zwischen genau zwei der obigen Regeln:**

```css
#sbkim-rdv-btn[data-ecke-unten="1"] { bottom: 78px !important; }
```

Das `!important` schlägt auch das `bottom: auto`, das die Positionier-Funktion
eine Zeile vorher **inline** setzt. Damit galten `top` **und** `bottom`
gleichzeitig — und ein `position: fixed`-Element mit beidem **zieht sich über die
ganze Höhe dazwischen**.

Nur unter 560 px. Und nur, **nachdem eine Position gesetzt war** (Ziehen,
Minimieren, gemerkte Lage beim Laden). Darum sah der erste Aufruf richtig aus,
und darum fand es keine Prüfung.

**Die Regel, die daraus folgt:** wer frei positioniert ist, steht nicht mehr in
der Ecke — also nimmt die Positionier-Funktion das Merkmal ab:

```js
function applyPos(el, pos) {
  el.style.top = pos.oben + "px";
  el.style.bottom = "auto";
  el.removeAttribute("data-ecke-unten");   /* ← die ganze Miete */
}
```

> **Diese Zeile sieht überflüssig aus. Sie ist es nicht.** Wer die Ecken-Ausnahme
> umbaut, misst vorher an einem schmalen Schirm **mit gemerkter Position** nach —
> ohne die tritt der Fehler gar nicht auf.

Gemessen im echten Chromium (360×800, gemerkte Position oben 60):
**88 × 662 px vorher, 88 × 33 px nachher.**

**Ein Wächter, der nur die Breite misst, ist blind.** Die erste Runde dieses
Fixes prüfte genau das — obwohl der Befund von Anfang an von einem *langen*
Container sprach. **Die Höhe gehört in jede Prüfung, die diese Stelle betrifft.**

---

## Was das Fenster sonst können muss

**Selbst einhängen.** Es baut sich in `<body>` und bringt sein Stylesheet mit
(`<style>`-Einschub), damit es in **jede** fremde Seite kopiert werden kann, ohne
dort etwas zu ändern.

**Ziehen mit Pointer-Events**, nicht mit `mouse` + `touch` getrennt. Ein
Ereignis-Satz für Maus, Finger und Stift.

**Lage merken** in `localStorage` — mit **app-eigenem Schlüssel-Suffix**. Auf
einer geteilten Adresse (mehrere Apps unter `…github.io/`) stören sich sonst
Geschwister-Apps gegenseitig: eine merkt sich die Lage, die andere liest sie.
Real passiert.

**Beim Laden die gemerkte Lage zurückklemmen.** Der Schirm von gestern ist nicht
der von heute — Drehen, Splitscreen, anderes Gerät. Ohne Zurückklemmen liegt das
Fenster außerhalb.

```js
window.addEventListener("resize", heilen, { passive: true });
window.addEventListener("orientationchange", heilen, { passive: true });
```

**Schließen muss rückgängig zu machen sein.** Ein ✕ ohne Weg zurück ist eine
Falle — das Fenster ist dann bis zum Leeren des Speichers weg.

---

## Was es NICHT tun darf

- **Nicht ungefragt ins Netz.** Anmelden und Suchen sind **nutzer-ausgelöst**.
  Kein Dauer-Piepser, kein Puls, kein Aufbau beim Laden — `init()` baut nichts
  auf. (SBKIM-Verfassung: der Knoten ist Empfangsmodus mit Antwortrecht.)
- **Kein Eingriff in die Kern-Module.** Das Fenster ist reiner Klebstoff über den
  öffentlichen Flächen von Modul 23 / 05 / 02. Byte-1:1-Kopien bleiben unberührt,
  ein SHA-256-Wächter passt darauf auf.
- **Kein toter Knopf.** Fehlt ein Modul, ein Schlüssel oder das Netz, degradiert
  das Fenster still und die Seite bleibt voll benutzbar.

---

## Prüfen

Vier Dinge, die man messen kann — und die alle schon still kaputt waren:

1. **Breite UND Höhe** des Fensters bei 360×800 — mit **gemerkter Position**.
   Ohne die tritt die schlimmste Falle gar nicht auf.
2. **Nichts ragt waagerecht hinaus**, bei 360, 412 und 500 px.
3. **Ein greifbarer Streifen bleibt** — auch wenn das Panel höher ist als der
   Schirm.
4. **Der Knopf ist mit dem Finger erreichbar**, also nicht unter der
   Status-Leiste.

> **An einem verdrehten Element misst `getBoundingClientRect` die verzerrte
> Box.** Wenn das Fenster eine Neigung oder einen Effekt trägt, in
> Layout-Koordinaten messen (`offsetWidth` / `offsetHeight`), sonst misst man den
> Effekt statt des Baus.
