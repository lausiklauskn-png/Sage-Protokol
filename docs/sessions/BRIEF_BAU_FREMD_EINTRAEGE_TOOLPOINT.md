# BRIEF — Bau: Fremd-Einträge im Toolpoint möglich machen

**Angelegt:** 2026-08-12 · **Repo:** `lausiklauskn-png/PWA-Toolpoint` ·
**Art:** kleiner, abgegrenzter Bau. Drei Änderungen, ein PR.

Grundlage: [`Sage-Protokol/docs/PLAN_FREMDE_APPS.md`](../PLAN_FREMDE_APPS.md) §3
und §7. Klaus hat am 2026-08-12 entschieden: **„Der Eintrag kostet nichts."** und
**erster Schub fünf Apps, nicht fünfzig.**

---

```
Bau-Sitzung PWA-Toolpoint: Fremd-Einträge möglich machen (B1 · B2 · B3).

PFLICHTLEKTÜRE, in dieser Reihenfolge:
1. PWA-Toolpoint/CLAUDE.md — besonders § Die Stufen, § Der Ton,
   § Was die Gegenprobe an diesem Tag gefunden hat
2. PWA-Toolpoint/docs/sessions/BRIEF_naechste-sitzung.md
3. Sage-Protokol/docs/PLAN_FREMDE_APPS.md — §1 (was schon dasteht), §3
   (die drei Bedingungen), §7 (die Reihenfolge)
4. assets/app.js ab Z. 835 (Melde-Pfad) · assets/karte.js Z. 295–395 ·
   assets/studio.js Z. 320–380 + 990–1020

Zuerst: git fetch origin main, dann von origin/main frisch abzweigen.

AUFTRAG — drei Änderungen, je ein Commit:

B1 — der fünfte Meldegrund.
  In assets/app.js MELDE_GRUENDE (Z. 851) GANZ OBEN ergänzen:
    { wert: "eigen", text: "Das ist meine App — bitte ändern oder entfernen." }
  Dazu im Dialogtext die Zusage: eine solche Meldung wird OHNE Rückfrage und
  OHNE Frist ausgeführt. Ein Weg raus, der eine Begründung verlangt, ist keiner.
  Der Server-Vertrag (einreichung.php, zweck "meldung") nimmt `grund` als
  String ≤20 Zeichen — "eigen" passt. NICHT den Vertrag ändern.

B2 — img optional für Fremd-Einträge.
  Die Bild-Pflicht sitzt NUR im Studio (assets/studio.js Z. 345 und Z. 1005).
  Der Renderer kann es längst: ohne img zeichnet karte.js Z. 308–311 ein leeres
  Feld fester Größe, und fundKandidaten() (Z. 364) schließt bildlose Einträge
  vom Fund der Woche aus. Beides bleibt UNVERÄNDERT.
    - own === true  → Bild bleibt PFLICHT
    - own !== true  → Bild darf leer bleiben; ist eines da, gilt weiter
                      sicheresBild() (https, kein SVG)
  KEIN neutraler Platzhalter. Ein generisches Ersatzsymbol wäre eine Behauptung
  über eine ungeprüfte App; leer ist ehrlicher.
  Den Kopf von assets/config/listings.js nachziehen: img ist Pflicht für eigene
  Einträge, optional für fremde. Der Kopf ist die Regel — er darf nicht lügen.

B3 — „eingetragen, nicht abgestimmt".
  An Karten mit own !== true ein kurzer, sichtbarer Satz, dass dies ein
  Katalog-Hinweis ist und keine Zusammenarbeit. Reine Textarbeit in karte.js.
  Achtung: das Markup hat EINE Quelle (assets/karte.js) — statische Liste und
  Suche holen es beide dort. Nicht doppeln.

PFLICHT NACH JEDEM COMMIT:
  - npm test muss grün sein, mit EIGENEM Rückgabewert (kein `| tail`).
  - Für JEDE neue Prüfung einen passenden Fehler in tests/gegenprobe.sh —
    und nachsehen, ob der Smoke dabei WIRKLICH umfällt. Ein Wächter ohne
    Gegenprobe ist nur ein grüner Haken.
    Fallen aus dem Repo-CLAUDE.md: indexOf(...) < indexOf(...) bleibt wahr,
    wenn das Gesuchte fehlt (−1 ist kleiner als alles) — erst Existenz, dann
    Reihenfolge. Und: nicht das Wort suchen, sondern die Code-Stelle.
  - node tools/statische-listen.mjs laufen lassen, wenn sich das Karten-Markup
    ändert (B3), sonst laufen statische Seite und Suche auseinander.
  - CACHE_VERSION in sw.js erhöhen, wenn eine CORE-Datei angefasst wurde.

TABU:
  - KEIN Preis, KEIN Prozentsatz, KEIN „jetzt eintragen für X €" — Stufe 1
    (CLAUDE.md § Die Stufen). Die Stufe-1-Sperre im Smoke bleibt scharf.
  - KEINEN fremden Eintrag anlegen. Der Bau macht es MÖGLICH, mehr nicht.
  - KEINE E-Mail an irgendwen.
  - Die byte-1:1-Kopien unter sbkim/ NICHT anfassen (Drift-Guard).
  - Den Server-Vertrag von einreichung.php NICHT ändern.

ABSCHLUSS:
  PULS/Brief des Repos fortschreiben · Draft-PR mit ehrlicher Verifikation
  (auch was NICHT geprüft wurde) · Selbst-Merge nach Freibrief, sobald npm test
  und die Gegenprobe grün sind · „Nächste Schritte"-Block in der Chat-Antwort.
  Browser-Sichttest bleibt ehrlich als „ungeprüft, wartet auf Klaus" markiert.

Freibrief gilt (Sage CLAUDE.md § Freibrief).
```

---

## Warum dieser Bau vor dem ersten Eintrag kommt

Ohne B1 kann ein Anbieter seinen Eintrag nur unter „Etwas anderes" abmelden —
als wäre das eigene Eigentum ein Sonderfall. Ohne B2 lässt sich ein Fremd-Eintrag
gar nicht erst anlegen, ohne fremdes Bildmaterial zu nehmen. Beides sind
Bedingungen aus `PLAN_FREMDE_APPS.md` §3, und der Plan sagt ausdrücklich: vor
B1/B2 ist ein Eintragen **nicht** vertretbar.

## Was danach kommt (nicht in dieser Sitzung)

Fünf Apps aussuchen (Regeln in `PLAN_FREMDE_APPS.md` §7 Schritt 2) · eintragen ·
messen lassen · **dann** je ein GitHub-Issue mit dem Text aus §4 · nach zwei
Wochen vier Zahlen zählen. Erst danach fällt die Entscheidung über den großen
Schub.
