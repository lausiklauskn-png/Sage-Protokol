# Übergabeprotokoll 2026-08-12 — Schritt 4: der Schalter

**Rolle:** Hauptsitzung.
**Auftrag:** `docs/sessions/BRIEF_SCHALTER_UND_WAS_OFFEN_LIEGT.md`, Abschnitt FOKUS.
**Ergebnis:** gebaut, geprüft, gegengeprüft, in beiden Repos gemergt.

| Repo | PR | Stand |
|---|---|---|
| PWA-Toolpoint | #34 | gemergt (`e646f10`) |
| family-project | #267 | gemergt (`5154ea6`) |

Damit sind die Schritte 1–4 der Bau-Reihenfolge in `pwa-toolpoint/docs/RAUSWURF-REGEL.md`
abgehakt.

---

## Was gebaut wurde

Der Schalter heißt `_automatik` und steht in `assets/config/wache-hand.json`.

| Stellung | Befund im Studio | Gelb öffentlich | Rot |
|---|---|---|---|
| **Von Hand** (Start) | steht da | nein | nur von Hand |
| **Automatik** | steht da | **ja, gerechnet** | nur von Hand |

Der Befund ist in beiden Stellungen derselbe. Es geht allein darum, wer ihn zu
sehen bekommt. Rot bleibt Handarbeit, und die Automatik löst nie etwas.

### Gerechnet, nicht gespeichert

Der Befund aus Schritt 3, eingehalten. `assets/karte.js` rechnet das Band bei
jedem Zeichnen aus `messung.unterGrenze` — der Zahl, die der nächtliche Lauf in
`listings.js` legt. Fällt sie weg, weil wieder gut gemessen wurde, ist das Band
von allein fort.

Stünde es dagegen in `wache-hand.json`, käme es nie wieder heraus: der Riegel
lässt aus dem Browser nur Verschärfen zu. Es bliebe stehen, während die Seite
längst schnell ist, und eine Warnung, die man nicht mehr los wird, lernt man zu
übersehen.

### Wo der Schalter wohnt — die offene Frage des Briefs

Der Brief ließ die Frage offen und verlangte eine begründete Entscheidung.

**Der Zwang:** das gerechnete Band steht öffentlich. Also muss der Browser eines
wildfremden Besuchers wissen, ob die Automatik an ist, und der weiß nichts vom
`localStorage` des Studios. Der Schalter muss committet sein.

**Die Wahl:** `_automatik` in derselben Datei wie die Ampel. Damit steht alles,
was der Wächter tut, an einer Stelle, und es gibt genau einen Weg dorthin
(`commit_wache`), der schon gebaut und schon gegengeprüft ist. Eine zweite Datei
hätte eine zweite Server-Aktion gebraucht, für dasselbe Ergebnis.

**Der Preis, offen genannt:** der Prüfer im Server ließ neben `_hinweis` nur
Schlüssel zu, die wie eine `anchorId` aussehen. Er ist erweitert worden, um
genau diesen einen Namen. `wache_automatik_pruefen()` lässt vier Werte mit Typ
und Bereich durch (`an`, `naechte`, `meldungen`, `grenze`) plus Erklär-Text und
weist alles andere mit `automatik_invalid` ab. **Eine Ampel kann darin nicht
stehen** — der Schalter ist kein zweiter Weg zur Sperre. Jeder andere
Unterstrich-Name bleibt `bad_key`.

### Die Hand gewinnt

Steht an einem Eintrag eine geschaltete Ampel, schweigt die Rechnung. Rot und
gelb zeigen ihr eigenes Band mit dem Grund eines Menschen; grün zeigt gar keins.

---

## Der stille Fehler, der dabei auffiel

`tools/statische-listen.mjs` filterte alles außer rot und gelb heraus, mit der
Begründung im Kommentar: „nur was etwas bewirkt". Das stimmte, **solange nichts
gerechnet wurde**.

Seit es ein automatisches Gelb gibt, bewirkt grün etwas: es ist die
Hand-Freigabe, die genau dieses Gelb überstimmt. Wäre grün weiter
herausgefallen, käme das gerechnete Band trotz Freigabe zurück — lautlos.

> **Die Lehre:** eine Filter-Zeile mit der Begründung „das wirkt ohnehin nicht"
> ist eine Wette auf den heutigen Stand. Wer eine neue Wirkung baut, sieht nach,
> wer bisher als wirkungslos aussortiert wurde.

---

## Verifikation — was wirklich lief

| Was | Ergebnis |
|---|---|
| `PWA-Toolpoint: npm test` | **476/476** (30 neue Wächter) |
| `PWA-Toolpoint: bash tests/gegenprobe.sh` | **147 schlagen an, 0 blind** (9 neue Sabotagen) |
| `family: node tests/smoke_studio_markt.mjs` | **102/102** (12 neue Proben an der echten PHP) |
| `family: bash tests/gegenprobe_wache_riegel.sh` | **11 schlagen an, 0 blind** (3 neue Sabotagen) |
| `php -l server/marktplatz-api.php` | keine Syntaxfehler |
| `family: node tests/smoke_all.mjs` | 110/110 |
| `family: node tests/smoke_studio_vectors.mjs` | 41/41 |

Die neuen Wächter lassen die echte `karteHtml` laufen und rechnen den Schalter
wirklich nach; die PHP-Proben führen den ausgeschnittenen `commit_wache`-Block
mit echten Nutzlasten aus. Kein Wächter liest den Wortlaut einer Datei.

`playwright-core` fehlte im Container und wurde nach `/tmp/pw` nachinstalliert,
damit die zwei family-Suiten wirklich laufen konnten. Ohne das wären sie
ungeprüft geblieben, und das hätte hier so stehen müssen.

### Was NICHT geprüft ist

- **Klaus' Browser-Sichttest.** Weder der Schalter im Studio noch das gerechnete
  Band an der Karte sind je in einem echten Browser gesehen worden.
- **Der Live-Weg zum Server.** Die neue `marktplatz-api.php` liegt im Repo,
  nicht auf dem Webhosting. Bis Klaus sie hochlädt, antwortet die alte Fassung
  auf `_automatik` mit `bad_key`. Das Studio nennt diesen Fall beim Namen; die
  Ampel selbst geht unverändert weiter.
- **Das gerechnete Band an echten Daten.** Kein einziger der 14 Einträge liegt
  derzeit unter 50 (schlechtester: 80). Der Pfad ist nur an Prüf-Einträgen
  gelaufen. Das ist kein Mangel, sondern derselbe Umstand, unter dem die Regel
  aufgeschrieben wurde: sie trifft gerade niemanden.

---

## Die Offen-Liste, am 2026-08-12 neu nachgesehen

Der Brief verlangt (Lehre 4), jeden weitergereichten Punkt **neu nachzusehen**
statt aus dem Vorgänger abzuschreiben. Gemacht:

| Punkt | Stand nach dem Nachsehen |
|---|---|
| **Modul 17 zu breit** | offen. `src/modules/17_floating_widget.js` hat auf `#sbkim-widget` **keine** `max-width`; die Breite kommt aus dem Inhalt. |
| **`docs/PULS.md` über der Grenze** | offen, **9665** Zeilen (Grenze 3000). |
| **family hat keine Sperr-Knöpfe** | offen. `assets/studio-markt.js` **zeigt** die Ampel und ruft `commit_wache` für Quittungen, hat aber kein `data-sperren`/`data-vorbehalt`. |
| **Kim-Bell + Mein-WorkFloh vom M23-Kanon ab** | offen. Beide tragen auf `origin/main` weiterhin `modules/sbkim-rendezvous-ui.js`. |
| **Server-Updates auf dem Cloud-Server** | von hier aus nicht prüfbar (kein Zugang). Unverändert weitergereicht. |
| **Mikrofon mehrsprachig · WorkFloh-Einrichtungsschirm · falsche Karten-Adressen · Phase D.2** | nicht angefasst, unverändert weitergereicht. |

---

## Nächster sinnvoller Schritt

1. `marktplatz-api.php` aufs Webhosting laden — ein WebFTP-Schritt, ohne den
   der Schalter nicht veröffentlicht werden kann.
2. Sichttest des Schalters im Studio.
3. Modul 17 im Kanon schmaler machen und netzweit neu kopieren (eigene Runde,
   samt Drift-Guards).
4. `docs/PULS.md` ins Archiv auslagern (eigene Pflege-Runde, nicht kürzen).

Folge-Brief: `docs/sessions/BRIEF_NACH_SCHALTER.md`.
