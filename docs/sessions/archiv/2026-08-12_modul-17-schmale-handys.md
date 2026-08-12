# Übergabeprotokoll 2026-08-12 — Modul 17: die Blase passt jetzt auf schmale Handys

**Rolle:** Hauptsitzung.
**Auftrag:** Klaus, „Modul siebzehn starten" — der erste Punkt der Offen-Liste in
`docs/sessions/BRIEF_NACH_SCHALTER.md`.
**Ergebnis:** gebaut, gemessen, gegengeprüft, in 15 Repos gemergt.

| Repo | PR | Repo | PR |
|---|---|---|---|
| Sage-Protokol | #839 | Muttis-Rezeptbuch | #184 |
| BookLedgerPro | #301 | Privat-Brain | #74 |
| Jasons-Tresor | #155 | Tomys-Hub | #152 |
| Kimboard | #94 | family-project | #269 |
| Kimseek | #60 | Kim-Bell | #40 |
| Mein-Mixarium | #188 | Mein-WorkFloh | #168 |
| Mein-Rezeptbuch | #372 | SB-KIMTool-Point | #149 |
| Mein-Tresor | #103 | | |

Alle gemergt. Netzweite Verifikation: **15/15 tragen den Kanon `dd3e0d7fb596`,
0 Abweichung**, keine alte sha mehr im Netz.

---

## Der Befund

Die Pille von Modul 17 hat keine Breiten-Grenze — sie ist so breit wie ihr
Inhalt. Weil sie rechts in der Ecke hängt, wächst sie nach **links** aus dem
Bild. Der `lebt`-Slot war auf einem 360-px-Handy nicht mehr zu sehen.

| Fenster | vorher | nachher |
|---|---|---|
| 320 px | 385 px — 81 px links abgeschnitten | 227 px, passt |
| 360 px | 385 px — 41 px links abgeschnitten | 227 px, passt |
| 412 px | 385 px, passt | 385 px, unverändert **mit** Wörtern |
| 768 px | 385 px, passt | 385 px, unverändert |

## Der Weg — Klaus' Entscheid an Zahlen

Die Wörter „lebt/verkehr/fremd/siegel" waren Klaus' ausdrücklicher Wunsch
(2026-05-25, „1:1 Sage-Page-Stil"). Sie zu entfernen ist deshalb keine
Freibrief-Entscheidung. Drei Wege wurden **gemessen** und vorgelegt:

| Weg | Pille bei 360 px | Preis |
|---|---|---|
| **A′ — nur die Lampen** (gewählt) | 223 px | Wörter unter 400 px weg |
| B — zweizeilig umbrechen | 344 px | 66 statt 34 px hoch, Pille wird Kachel |
| C — alles enger | 344 px | bei 320 px ragt sie weiter 7 px hinaus |

Klaus wählte A′. Ab 400 px bleibt alles wie bisher; die Bedeutung geht nicht
verloren (jeder Slot behält `aria-label`, Farbe und Modal).

## Zwei Fallen im Fix selbst

- **`max-width` allein hilft nicht.** Die Slots sind Flex-Kinder mit
  `min-width: auto` und schrumpfen nicht unter ihre Wortbreite. Der Inhalt
  quölle dann aus der Pille statt aus dem Bild — dasselbe Problem, eine Ebene
  tiefer.
- **Die Trefferfläche kommt über das Innenmaß zurück, nicht über `min-width`.**
  Ohne Wort schrumpft ein Slot auf 21 px und fällt unter die 24-px-Norm vom
  2026-08-03. Der naheliegende Griff wäre `min-width` — und genau der ist falsch:
  auf denselben Slots steht im minimierten Zustand `max-width: 0`, damit sie
  hinter SIEGEL zusammenschieben. Ein `min-width` hielte sie auf, die Pille ließe
  sich nicht mehr klein machen. **Das Modul warnt an genau dieser Stelle selbst
  davor** — der Kommentar war zu lesen, nicht zu überblättern.

## Die Lehre: die Messung gab zu früh Entwarnung

Der erste Messaufbau meldete **274 px** und damit „alles in Ordnung". Zwei Fehler
steckten darin, **beide in der Messung, nicht im Modul**:

1. Der **SIEGEL-Slot** mountet nur, wenn `SbkimSiegel.isCertified()` wirklich
   `true` liefert (Anti-Greenwashing — Modul 17 prüft doppelt und verwirft das
   Ereignis sonst). Ohne diesen Stub fehlte der breiteste Slot: 111 px zu wenig.
2. Die Messseite setzte eine **eigene Grundschrift** (14 px). Alle Maße im Modul
   sind `rem` — der Aufbau maß damit sich selbst statt das Modul.

Erst der korrigierte Aufbau reproduzierte die 385 px aus Klaus' Befund. Hätte ich
den ersten Wert geglaubt, wäre die Antwort gewesen: „passt doch, 274 px bei
320 px Bildschirm" — und Klaus hätte weiter auf eine abgeschnittene Leiste
gesehen.

> **Die Stelle, an der eine Prüfung dir recht gibt, ist die, an der du am
> genauesten hinsehen musst.** Diesmal war nicht das Ergebnis falsch gerechnet,
> sondern der Aufbau maß das Falsche. Dieselbe Familie wie der Upstream-Fehler
> aus CLAUDE.md und die blinden Gegenproben vom 2026-08-09.

## Was der Brief zu eng gefasst hatte

Der Brief nannte „Betroffen: Mein-WorkFloh, Tomys-Hub, Kimboard". Nachgesehen
waren es **15 Träger**, alle byte-1:1 zum Kanon — und **fünf** sha-Pins statt der
genannten. Die Pin-Menge kam per `grep` aus den Repos, nicht aus dem Brief; das
Rezept `netzweiter-modul-rollout` verlangt genau das, weil Briefe hier
regelmäßig zu wenig nennen.

## Der Punkt, den ein Rollout leicht übersieht

Sechs Apps führen das Modul in ihrem **Service-Worker-Vorrat**. Ohne Cache-Bump
liefert der SW die alte Fassung weiter — der Rollout hätte grün gemeldet und bei
Klaus nichts bewirkt. Erhöht: BookLedgerPro `v217→v218` · Kim-Bell
`kim-bell-v25→v26` · Kimboard `kimboard-v51→v52` · Kimseek `kimseek-v32→v33` ·
Mein-WorkFloh `workfloh-v119→v120` · Privat-Brain `private-brain-v48→v49`.

## Verifikation — was wirklich lief

| Was | Ergebnis |
|---|---|
| `tests/smoke_bau17_floating_widget.mjs` | **40/40** (zwei neue Wächter) |
| Gegenprobe: Grenze entfernt | 38/40 — beide fallen |
| Gegenprobe: `padding` → `min-width` | 39/40 — 2c fällt |
| Gegenprobe: `:not([data-minimized])` entfernt | 39/40 — 2c fällt |
| Gegenprobe: Wörter bleiben sichtbar | 39/40 — 2b fällt |
| `tools/widget-breite-messen.mjs`, neue Fassung | ✓ 320/360/412/768 |
| `tools/widget-breite-messen.mjs`, alte Fassung | ❌ 2 Breiten, Exit 1 |
| Kimboard · Kimseek · Kim-Bell · Mein-WorkFloh `npm test` | exit 0, fail 0 |
| Privat-Brain `tools/drift-guard.mjs` | exit 0 |
| BookLedgerPro `tests/run.mjs` | exit 0 |
| Jasons-Tresor · Mein-Tresor `npm test` | exit 0, fail 0 |
| SB-KIMTool-Point `npm test` | **120 pass, 0 fail** (nach `npm install`) |

Die Wächter prüfen das **erzeugte** CSS, nicht den Quelltext — ein Kommentar kann
sie nicht bestehen lassen. Nach der Gegenprobe war die Modul-Datei byte-identisch
wiederhergestellt (sha geprüft).

## Was NICHT geprüft ist

- **Klaus' Browser-Sichttest.** Die schmale Ansicht ist nie in einem echten
  Browser gesehen worden. Headless ersetzt ihn nicht.
- **Muttis-Rezeptbuch, Mein-Rezeptbuch, Mein-Mixarium, Tomys-Hub,
  family-project:** keine lauffähige Test-Suite in dieser Umgebung — der Beweis
  ist die sha256-Gleichheit mit dem Kanon.
- **`sbkim-bundle-voll` Modul 15 + 16:** vom Kanon abgedriftet (261 bzw. 6
  Zeilen, Pflege 2026-08-01 fehlt). **Vorbestehend** — Gegenprobe auf blankem
  `origin/main` zeigt dieselben zwei Fehler, 44 ok / 2 fail vorher wie nachher.
  Nicht von dieser Sitzung verursacht, gehört in eine eigene Runde.

## Nächster sinnvoller Schritt

Klaus' Sichttest am Handy: die Pille passt ins Bild, die Lampen stehen ohne
Wörter, Antippen öffnet weiter die Fenster. Danach die Bundle-Kopien 15/16 heilen
und `docs/PULS.md` auslagern (jetzt 9961 Zeilen gegen 3000 — vierte Sitzung, die
es meldet).
