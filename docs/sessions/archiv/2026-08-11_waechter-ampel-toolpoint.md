# Übergabeprotokoll — Die Ampel des Wächters (Schritt 3 der Rauswurf-Regel)

**Datum:** 2026-08-11 · **Rolle:** Hauptsitzung
**Auftrag:** `docs/sessions/BRIEF_WAECHTER_TOOLPOINT_UND_SCHALTER.md`, FOKUS 1
**Branch (überall):** `claude/wachter-toolpoint-migration-29o19y`

## Was getan wurde

| Repo | PR | Inhalt |
|---|---|---|
| PWA-Toolpoint | [#32](https://github.com/lausiklauskn-png/PWA-Toolpoint/pull/32) | Handschalter, Band an der Karte, Studio-Knöpfe, Bau-Lauf |
| family-project | [#265](https://github.com/lausiklauskn-png/family-project/pull/265) | der Riegel in `marktplatz-api.php`, einseitig gelockert |
| Kimboard | [#89](https://github.com/lausiklauskn-png/Kimboard/pull/89) | roter Drift-Guard geheilt |
| Kimseek | [#58](https://github.com/lausiklauskn-png/Kimseek/pull/58) | roter Drift-Guard geheilt |

Alle vier gemergt (Selbst-Merge-Freibrief, `CLAUDE.md` § Freibrief).

## Die Entscheidung, die alles trägt

Klaus' Vorgabe war: **sperren aus dem Studio erlaubt, entsperren nur in der
Datei.** Umgesetzt ist das nicht als Liste von Sonderfällen, sondern als
**Rangfolge**:

| Rang | Ampel | Bedeutung |
|---|---|---|
| 0 | `gruen` | Hand-Freigabe, überstimmt die Automatik |
| 1 | *(kein Eintrag)* | es gilt, was ohnehin gilt |
| 2 | `gelb` | sichtbarer Vorbehalt |
| 3 | `rot` | gesperrt |

Aus dem Browser geht es **nur nach oben**. Damit sind vier Angriffswege in einem
Satz erschlagen: Herabstufen (`rot → gelb`), Freigeben (`rot → gruen`),
„`gruen` setzen, wo nichts stand" (die Automatik überstimmen) und — der stillste
— den gesperrten Eintrag beim Speichern **einfach weglassen**.

Dazu zwei Dinge aus der vierten Regel („nie still handeln"): `grund_fehlt`
(keine neue Sperre ohne lesbaren Grund) und `vorlage_nicht_lesbar`
(**fail-closed**: lässt sich die vorhandene Fassung nicht abrufen, wird gar
nichts geschaltet; quittieren geht weiter).

Die Tabelle steht an drei Stellen — Papier, Server, Studio. Einen Wächter über
zwei Repos hinweg gibt es nicht; deshalb nennt `pwa-toolpoint/docs/RAUSWURF-REGEL.md`
alle drei ausdrücklich.

## Zwei Bau-Entscheidungen, die begründet gehören

**1 · Die Ampel wird eingebacken, nicht nachgeladen.** Sie steht als Band in den
statischen Karten UND als `window.PT_WACHE` in der Seite, beides geschrieben von
`tools/statische-listen.mjs` aus **einer** Quelle. Ein Band, das erst nach dem
Laden erscheint, schöbe die ganze Liste — an dieser Seite war das schon einmal
der teuerste Fehler (CLS 0,136 am 2026-08-09). Folge: der Bau-Lauf muss auch auf
`wache-hand.json` hören, sonst sperrt Klaus etwas und die Seite zeigt es weiter
frei.

**2 · Rot heißt nicht „weg".** Der Eintrag bleibt sichtbar, der Grund steht
dabei, nur der Link geht aus, und er ist nicht mehr Fund der Woche. Auf einem
Markt für Fremde ist das der Unterschied zwischen einer Entscheidung und einer
Willkür.

## Der Beweis

- Toolpoint `node tests/smoke.mjs` → **446/446** (28 neu)
- Toolpoint `bash tests/gegenprobe.sh` → **138 anschlagend, 0 blind** (13 neu)
- family `node tests/smoke_studio_markt.mjs` → **90/90** (18 neu)
- family `bash tests/gegenprobe_wache_riegel.sh` → **8 anschlagend, 0 blind**
- `php -l server/marktplatz-api.php` → ohne Befund

Die Prüfungen messen die **Tat**. Die Karten-Prüfungen lassen die echte
`karteHtml` laufen; die Server-Prüfungen schneiden den `commit_wache`-Block
klammer-gezählt aus der echten Datei, umgeben ihn mit Attrappen für Netz und
Ausgabe und füttern ihn mit echten Nutzlasten. Keine zweite Fassung der Regel
irgendwo — die wäre auseinandergelaufen.

**Browser-Sichttest ungeprüft — wartet auf Klaus.**

## Was die Gegenprobe gefunden hat

Die Lehre aus dem Brief hat sich am selben Tag ausgezahlt. Zwei Wächter waren
blind:

1. Die Prüfung „der Bau-Lauf hört auf `wache-hand.json`" fand den Dateinamen im
   **Kommentar** der Workflow-Datei. Die `paths`-Zeile fehlte tatsächlich — die
   Prüfung war grün und gab der Sitzung recht. Behoben: die Zeile ergänzt, und
   die Prüfung sieht jetzt nur noch in der kommentarfreien Fassung nach, mit
   einem Muster auf die Listen-Zeile.
2. Eine ältere Probe zielte auf `return e && e.img;` — eine Zeile, die ich in
   `return e && e.img && !istGesperrt(e);` geändert hatte. Die Sabotage traf
   nichts mehr und sah deshalb aus wie eine bestandene Prüfung. Genau dieselbe
   Falle wie die `?v=2`/`?v=3`-Proben vom 2026-08-09.

## Nebenbefund: drei rote Wächter im Netz

Beim ersten Testlauf war der Drift-Guard von PWA-Toolpoint rot. Ursache: am
2026-08-11 wurde `23_rendezvous_ui.js` netzweit mit dem Sage-Kanon nachgezogen,
der erwartete Hash in den Tests aber nicht. Die netzweite Nachschau ergab genau
drei betroffene Repos (PWA-Toolpoint, Kimboard, Kimseek); die übrigen acht
tragen die Datei ohne eigenen Pin.

Die Kopien sind nachgeprüft **byte-identisch** mit
`Sage-Protokol/src/modules/23_rendezvous_ui.js` — nachgezogen wurde deshalb der
Hash, nicht die Datei. Gemessen: Kimboard 5/6 → 6/6, Kimseek 10/11 → 11/11.

## Was offen blieb

- **Schritt 4 (der Schalter) bewusst nicht gebaut** — mit einem Befund, der
  seine Bauweise festlegt (siehe unten und `RAUSWURF-REGEL.md`).
- **Klaus muss `server/marktplatz-api.php` hochladen** (Webhosting/Apache,
  konsoleH, neben `einreichung.php`). Bis dahin scheitern die Sperr-Knöpfe mit
  `field_not_allowed` — sichtbar, und in der sicheren Richtung. An
  `freigabe-config.php` ist **nichts** zu ändern.
- **family hat noch keine Sperr-Knöpfe.** Der Server erlaubt sie jetzt für beide
  Marktplätze; das Studio dort schickt weiterhin nur Quittungen. Eigene kurze
  Runde, wenn Klaus es dort auch will.
- **`docs/PULS.md`** steht bei rund 9650 Zeilen gegen 3000 im eigenen Kopf.
  Eigene Pflege-Runde: auslagern, nicht kürzen, Grenze nicht herabsetzen.

## Der Befund für Schritt 4

> **Das automatische Gelb darf NICHT in `wache-hand.json` landen.**

Die Regel sagt: drei schlechte Nächte geben Gelb, und die **erste gute Messung
nimmt es zurück**. Genau das kann der Handschalter nicht — der Riegel lässt aus
dem Browser nur Verschärfen zu (richtig so), und ein Gelb, das dort einmal
steht, käme nie wieder heraus. Es bliebe stehen, während die Seite längst
schnell ist. Eine Warnung, die man nicht mehr los wird, lernt man zu übersehen.

In family fällt das nicht auf, weil das automatische Gelb dort im **nächtlichen
Bericht** (`spore-stand.json`) steht, nicht im Handschalter.

Für Toolpoint heißt das: **gerechnet, nicht gespeichert** — aus
`messung.unterGrenze`, jedes Mal neu. Der Schalter Hand/Automatik entscheidet
dann nur, ob dieses gerechnete Gelb öffentlich **gezeigt** wird oder nur im
Studio als Vorschlag steht.

**Und die dritte Zahl ist keine Studio-Zahl.** Die Grenze **50** wird in
`tools/messwerte-holen.mjs` geändert — dort wird gezählt. Ein Regler im Studio,
der sie ändert, während der nächtliche Lauf weiter gegen 50 zählt, wäre ein
Knopf, der lügt. Änderbar sind die zwei Zahlen, die das Studio selbst auswertet:
**3** (Nächte) und **4** (Meldungen).

## Nächster sinnvoller Schritt

Klaus lädt die PHP hoch und sperrt einmal probeweise einen eigenen Eintrag
(danach in der Datei wieder lösen). Das ist der einzige Weg, die ganze Kette zu
belegen — vom Knopf über den Server bis zum Band auf der Karte.
