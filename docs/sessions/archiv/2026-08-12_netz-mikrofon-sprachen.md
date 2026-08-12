# Übergabe 2026-08-12 — 🎤 Das Netz-Mikrofon hörte immer Deutsch

**Rolle:** Hauptsitzung. **Auftrag (Klaus):** *„Ziehe jetzt die Sprachen, die wir
jetzt haben, in die Pinnwand mit hinein … Genauso in meinen anderen Apps wie
mein Rezeptbuch, mein Mixarium, Muttis Rezeptbuch und die anderen Apps …
Vergiss bitte nichts."* Nachgeschärft: *„die Sprachen von Kimboard"*.

---

## 1. Der Befund, der die Aufgabe verschoben hat

Ich hatte in `index.html` von Mein-Rezeptbuch, Mein-Mixarium und
Muttis-Rezeptbuch nach `SpeechRecognition`, `SbkimSpeech` und `🎤` gesucht,
**null Treffer** bekommen und wollte melden: *„diese drei Apps haben gar kein
Mikrofon, Klaus' Wunsch geht dort ins Leere."*

**Das war falsch.** Das Mikrofon liegt nicht in der App-Datei, sondern im
**Modul 23** — im 🎤 des „Mit dem Netz verbinden"-Felds. Dort stand:

```js
var lang = (langs[0] || ["de-DE"])[0];
```

Immer der **erste** Eintrag der Liste, also **immer Deutsch**, ohne jede
Möglichkeit, etwas daran zu ändern. Dieses 🎤 sitzt in **jeder** App mit
Modul 23 — Rezeptbuch, Mixarium, Muttis, Tomys Hub, BookLedgerPro,
family-project, Kimboard, Kimseek, Jasons-Tresor, Mein-Tresor.

> **Lehre für jede Folge-Sitzung:** eine Suche in der App-Datei sagt nichts
> darüber, was die App **kann**. Die Fähigkeit steckte im Modul. Wer nur
> `index.html` durchsieht und daraus ein „hat kein X" ableitet, meldet unter
> Umständen das **Gegenteil** der Wahrheit. Immer auch die geladenen Module
> durchsuchen — `grep` über `sbkim/`, `modules/`, `comm-core/vendor/`.

---

## 2. Was gebaut wurde

### Kanon — Modul 21 (`src/modules/21_spracheingabe.js`)

Von **drei auf zwölf** Sprachen: Deutsch · English · Русский · العربية ·
Türkçe · Polski · Українська · Français · Español · Italiano · پښتو ·
دری/فارسی.

Deutsch bleibt der **erste** Eintrag — Aufrufer, die ohne eigene Wahl einfach
`getLanguages()[0]` nehmen, verhalten sich dadurch unverändert.

Neu auf der öffentlichen Fläche:

| Funktion | Zweck |
|---|---|
| `languageLabel(code)` | Anzeige-Name („ar-SA" → „العربية") |
| `preferredLanguage(stored)` | Vorauswahl: gemerkte Wahl → Geräte-Sprache → Deutsch |
| `isRtl(code)` | liest diese Sprache von rechts? |
| `scriptMismatchHint(text, code)` | der **stille Fehlschlag** (siehe unten) |

**Mit gefunden, wäre sonst kaputtgegangen:** `alternativeCodes` reichte **alle**
übrigen Sprachen an die EU-Engine weiter. Google Cloud Speech-to-Text nimmt in
`alternativeLanguageCodes` **höchstens drei**. Solange die Liste drei Sprachen
lang war, fiel das nie auf — mit zwölf hätte **jede** EU-Anfrage abgelehnt
werden können, und BookLedgerPro fährt die EU-Engine **bindend**. Jetzt auf
drei gedeckelt (`EU_ALT_MAX`), mit eigener Probe.

### Kanon — Modul 23 UI (`src/modules/23_rendezvous_ui.js`)

- Sprachwahl (`#sbkim-rdv-miclang`) neben dem 🎤, vorbelegt aus der
  **Geräte-Sprache**. Wer erst eine Einstellung finden muss, um verstanden zu
  werden, benutzt das Mikrofon nicht.
- Wahl **pro App** gemerkt: `sbkim_rdv_miclang_<cfg.dbSuffix>` — Geschwister-Apps
  teilen sich auf GitHub Pages **einen** Origin.
- **Ohne Modul 21 erscheint keine Wahl** — ein Wähler ohne Spracheingabe wäre
  ein toter Knopf. Das Frage-Feld bleibt in jedem Fall voll nutzbar.
- `dir="auto"` + `lang` am Frage-Feld, damit arabischer Text von rechts steht.
  Bewusst `auto` statt festem `rtl`: der Browser entscheidet am **Inhalt** —
  ein festes `dir` lügt, sobald jemand deutsch dazwischentippt.

### Der stille Fehlschlag

Klaus' Sichttest 2026-08-11: Russisch kam als „Здравствуйте" zurück, Arabisch
als „سلام عليكم" — beides richtig. **Paschtu kam als „Salaam" zurück, in
LATEINISCHEN Buchstaben, und OHNE Fehler.** Der Browser hatte stillschweigend
etwas anderes gehört.

`speechErrorHint` kann da nicht greifen, weil es **keinen Fehler gibt**. Also
wird die **Schrift** geprüft: passt sie nicht zur gewählten Sprache, erscheint
ein Satz. Ergebnisse unter vier Zeichen werden übergangen — dort ist die
Aussage zu dünn für einen Vorwurf.

---

## 3. Rollout — 19 PRs, alle gemergt

| Repo | PR | was |
|---|---|---|
| Sage-Protokol | #836 · #837 | Kanon + PULS |
| Mein-Rezeptbuch | #371 | 21 + 23 |
| Mein-Mixarium | #187 | 21 + 23 |
| Muttis-Rezeptbuch | #183 | 21 + 23 |
| Tomys-Hub | #151 | 21 + 23 |
| Kimboard | #93 | 21 + 23 + Probe nachgeschärft |
| Kimseek | #59 | 21 + 23 |
| family-project | #266 · #268 | Feld-Mikrofone + 21 + 23 |
| Jasons-Tresor | #154 | 23 |
| Mein-Tresor | #102 | 23 |
| BookLedgerPro | #300 | 21 (EU-Deckel!) |
| Kuechenzettel | #5 | 21 |
| SB-KIMTool-Point | #148 | 21 |
| Kim-Bell | #39 | 21 |
| Mein-WorkFloh | #167 | 21 |
| Privat-Brain | #73 | 21 + Probe nachgeschärft |
| PWA-Toolpoint | #35 | eigenes Such-Mikrofon |
| Company-Brain | #12 | eigenes Mikrofon |
| Mein-Mixarium-Page | #16 | Vorsorge (Seite hat kein Textfeld) |

**Die Drift-Guard-Prüfwerte sind diesmal mitgezogen** (Kimboard, Kimseek,
Kuechenzettel, Privat-Brain, Kim-Bell, Mein-WorkFloh) — genau die wurden beim
Modul-23-Rollout davor vergessen und ließen drei Repos rot.

Alter Prüfwert 21: `6be3902c…` → neu `020ca26f…`
Alter Prüfwert 23: `1f8b6c68…` → neu `4882c3b6…`

---

## 4. Eine Probe, die nichts bewies

Zwei Haken der Pinnwand-Probe verlangten nur *„enthält **nicht** 'lateinischer
Schrift'"*. Das ist auf fast jedem Text wahr — sie meldeten **grün**, während im
Hinweisfeld „kein Relay verbunden…" stand, also auf einem Lauf, in dem die
Erkennung das Frage-Feld **nie erreicht hatte**.

Jetzt muss der gesprochene Text **wirklich im Feld stehen**. Nachgezogen in
Sage, Kimboard, Privat-Brain.

> **Merksatz, zum zweiten Mal an einem Tag:** eine Prüfung, die nur eine
> **Abwesenheit** verlangt, ist keine Prüfung. Sie muss die **Tat** verlangen.

---

## 5. Gemessen

- `smoke_bau21_spracheingabe` **65/65** (war 45)
- neu `smoke_bau23_sprachwahl` **22/22**
- Suite regressfrei — alle `tests/smoke_*.mjs` gelaufen; einzig
  `smoke_resign_spore_v02` rot (braucht `SBKIM_NODE_KEY`), war vorher schon rot,
  mit `git stash` gegengeprüft.

**Fünf Sabotage-Proben:**

| Sabotage | rote Proben |
|---|---|
| Vorauswahl zurück auf Deutsch | 4 |
| EU-Deckel weg | 2 |
| Schriftkontrolle stumm | 2 |
| `langs[0]` zurück | 6 |
| Speichername ohne App-Namen | 3 |

Alle Proben messen die **Tat**: ein eingehängter Erkenner schreibt mit, welches
`lang` wirklich übergeben wird. Ein Blick in den Quelltext („steht da
`voiceLang()`?") wäre auch dann grün, wenn der Aufruf nie stattfindet.

---

## 6. Was offen bleibt

1. **Vier Modul-23-Kopien sind kein byte-gleicher Abzug** und haben die
   Sprachwahl im Netz-Panel **nicht** bekommen:
   - Kim-Bell, Mein-WorkFloh, SB-KIMTool-Point — alle `f117096e…`, rund
     **710 Zeilen** hinter dem Kanon (ihnen fehlt u. a. die Identitäts-Anzeige
     aus Stufe 0a/0b)
   - BookLedgerPro — eigener Prüfwert `c67b2942…`

   Ein blinder Überschreiber brächte ungeprüft eine ganze Reihe anderer
   Änderungen mit. Das gehört in eine **eigene, geprüfte Runde pro App**.

2. **Klaus' Browser-Sichttest** der zwölf Sprachen im Netz-Panel — headless
   ersetzt ihn nicht.

3. **Dari-Test** (Klaus wollte prüfen) und die **EU-Spracherkennung für
   Paschtu** (Plan liegt in `BRIEF_WAECHTER_TOOLPOINT_UND_SCHALTER.md`).

4. **`docs/PULS.md` liegt bei ~9.800 Zeilen** gegen die eigene 3.000-Zeilen-
   Grenze. Schutz-Klausel: **auslagern, nicht kürzen**. Steht weiter aus.

---

## 7. Nächster sinnvoller Schritt

Klaus' Sichttest. Danach: der Plan-Brief
`BRIEF_PLAN_FREMDE_APPS_AUFNEHMEN.md` (fremde PWAs auf den Marktplatz holen) —
**Plan-Modus, kein Bau**.
