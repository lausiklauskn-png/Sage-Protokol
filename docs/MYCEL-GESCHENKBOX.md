# Mycel-Geschenkbox — was eine fremde App zum Andocken mitbekommt

**Zweck (Klaus 2026-07-30):** Wenn ein Fremder seine App im
`family-projekt.de`-Marktplatz einreicht und — **nach Klaus' Prüfung** — Teil des
Mycels werden will, soll er **nichts suchen müssen**. Er bekommt eine fertige
Kiste, die er nur **auspackt**: ein Ordner, ein paar `<script>`-Zeilen, ein
`init()`. Diese Datei sagt, **was in die Kiste gehört** und **in welcher
Reihenfolge** es eingebaut wird.

> **Zwei Kisten-Größen.** Nicht jeder braucht alles. Deshalb zwei Stufen:
> **Stufe 1 „Verbinden"** (existiert schon, `sbkim-bundle/`) und **Stufe 2
> „Voll-Knoten"** (Verbinden + Siegel + Schutz + Suche + Andock-Wizard).

---

## Vor dem Auspacken — Klaus' Prüfung (der Andock-Riegel bleibt Klaus)

Die Kiste macht das Andocken **technisch** leicht. Die **Aufnahme ins Netz**
bleibt Klaus' Entscheidung — das ist gewollt (Empfangsmodus, kein offener
Beitritt):

1. **Einreichung** über das Marktplatz-Formular „Zur Prüfung einreichen"
   (`family-project/markt.html`): App-Name, Beschreibung (in eigenen Worten,
   mit Synonymen), Link, Bild.
2. **Klaus prüft** (liegt ein Geheimnis im Repo? passt die Domäne? seriös?) und
   listet die App im Marktplatz — oder nicht.
3. Der **0.80-Andock-Riegel** (Modul 05, `PROVIDER_MIN_MATCH`) bleibt
   **unberührt**: er entscheidet automatisch, welche Knoten sich fachlich
   verbinden. Die Kiste umgeht ihn nicht.

**Wichtig (Marktplatz-Brille):** Der selbst-gewählte App-Name ist ein **Hinweis,
kein Beweis** — jede App zeigt ihren Namen **mit** der kryptografischen Kennung
(nodeId), und die Kartenechtheit (Stufe 2b, Modul 23) prüft jede Karte im Raum
per Ed25519. Niemand kann sich unter fremder Identität ins Brett hängen.

---

## Stufe 1 — die „Verbinden"-Kiste (existiert: `sbkim-bundle/`)

**Das ist die Minimal-Kiste, heute schon fertig und aktuell** (byte-1:1 mit dem
Kanon, inkl. des gehärteten Modul 23 mit Kartenechtheit). Sie bringt: eigene
Ed25519-Identität, Bedeutungs-Match, server-losen Handshake über ein
Nostr-Relais und den gemeinsamen Raum mit dem Knopf **„🌐 Mit dem Netz
verbinden"**.

| Datei | Rolle |
|---|---|
| `modules/01_storage.js` | lokaler Speicher (IndexedDB, app-eigene Schublade) |
| `modules/02_spore.js` | Identität + Spore (Ed25519 signieren/prüfen) |
| `modules/03_embedding.js` | Bedeutungs-Vektor der Beschreibung |
| `modules/04_match.js` | Bedeutungs-Match (Cosinus + Richter-Fläche) |
| `modules/05_anastomose.js` | Handshake (0.80-Riegel) |
| `modules/05b_nostr_relay.js` | server-loser Transport (Relais) |
| `modules/23_rendezvous.js` | gemeinsamer Raum + **Kartenechtheit + Flut-Deckel** |
| `modules/23_rendezvous_ui.js` | „Wer ist im Raum?"-Oberfläche |
| `modules/noble-secp256k1.js` | Krypto-Baustein (lokal, kein CDN) |
| `sbkim-connect.js` | ein `init()` verdrahtet alles |
| `beispiel.html` | Vorlage: so wird's eingebaut |
| `README.md` | 2-Schritt-Anleitung |

**Einbau:** Ordner kopieren → `<script>`-Tags + ein `SbkimConnect.init({…})`.
Fertig. Abhängigkeitsfrei, offline-tauglich.

---

## Stufe 2 — die „Voll-Knoten"-Kiste (Vorschlag, noch zu bauen)

Wer nicht nur verbinden, sondern **das volle Vertrauens-Gesicht** will (Siegel-
Badge, Schutz-Lampen, eigene semantische Suche, Andock-Wizard, Schlüssel-Safe),
bekommt zusätzlich diese Bausteine. **Alle byte-1:1 aus dem Kanon**, mit
Drift-Guard (SHA-256) — reift ein Modul in Sage, wird neu kopiert, nicht
abgewandelt.

| Datei | Rolle | Kanon-sha (12) |
|---|---|---|
| `modules/07_apoptose.js` | **sauberer Rückzug — und Siegel-Pflicht** (siehe Kasten unten) |
| `modules/15_membran.js` | Außenhülle: Fremdzugriff-Detektor | `fbf9f42d8a27` |
| `modules/16_siegel.js` | SBKIM-Siegel (Bronze→Gold), Aspekte-Liste, DE/EN | `d84fa539e76e` |
| `modules/siegel-inhalt.js` | Inhalt des Siegel-Modals (Andock-Werkzeug) | (Kanon prüfen) |
| `modules/17_floating_widget.js` | Status-Lampen LEBT/VERKEHR/FREMD/SIEGEL, DE/EN | `3f757b35cea5` |
| `modules/19_andock_wizard.js` | Andock-Assistent (Identität/Spore/Backup) | `976c4ba35…` |
| `modules/20_schluessel_safe.js` | verschlüsselter Schlüssel-Safe (BYOK) | `e7e25c907…` |
| `modules/21_spracheingabe.js` | Spracheingabe (Mikro → Text, EU-Politik, 12 Sprachen) | `020ca26ff…` |
| `modules/22_such_widget.js` | frei bewegliches Such-Widget (optional) | `45f42a54e…` |
| `modules/24_ocr_eingabe.js` | Bild/Handschrift → Text (optional) | `c0d616ff7…` |
| `sbkim-sw.js` + `manifest.json` | PWA-Schale (installierbar, offline) | — |
| App-Kleber (frei) | `rendezvous-init.js` + Panel „🌐 Mit dem Netz verbinden" | app-eigen |

> **⚠ Modul 07 stand hier bis zum 2026-08-16 NICHT — und fehlte deshalb auch
> in der Kiste.** Das ist keine Kleinigkeit: Modul 16 prüft für sein Siegel
> **acht** Module (01 · 02 · 03 · 04 · 05 · **05b** · **07** · 15 — 05b seit
> dem 2026-08-16, weil ein Siegel sonst leuchten konnte, während der
> gemeinsame Raum unlesbar war). Fehlt eines, stellt
> sich die App **kein Siegel aus — und zwar stumm**: keine Meldung, kein Fehler,
> das Abzeichen bleibt einfach weg. Ein Forker hätte die Stufe-2-Kiste
> ausgepackt, alles richtig gemacht und sich gefragt, warum nichts kommt.
> `tests/smoke_bauvorlagen.mjs` prüft seitdem **Rezept und Kiste gegeneinander**.

**Reihenfolge beim Einbau (wichtig):**
`01 → 02 → 03 → 04 → 05 → 05b → 23/23_ui` (Verbinden), dann
`07 (Apoptose)`, dann `17 (Widget) VOR 15 (Membran) VOR 16 (Siegel)` — das Widget legt die Lampen an,
bevor Membran/Siegel sie bedienen. `19/20/21/22/24` sind additiv, fail-soft
(fehlt eins, läuft die App weiter).

**Fremdnutzer-Regeln, die in jede Kiste gehören:**
- **Fail-soft für Fehlendes** — ohne Schlüssel/Mikro/Modul X bleibt die App voll
  nutzbar; das Feature degradiert still, kein toter Knopf, kein Crash.
- **Klar benennen, was passiert** — Kosten (eigener KI-Schlüssel), Daten-Abfluss
  (an welchen EU-KI-Anbieter), wo der Schlüssel bleibt (nur im Browser).
- **Geteilte-Origin-Falle** — DB-/Storage-Schlüssel app-spezifisch (Suffix),
  damit Geschwister-Apps auf derselben Adresse sich nicht stören.
- **Kein PII, kein privater Schlüssel** im ausgelieferten Repo.

---

## Was heute schon steht / was fehlt

- ✅ **Stufe 1 „Verbinden"** ist fertig und aktuell (`sbkim-bundle/`), inkl.
  Kartenechtheit (Modul 23 sha `3caa0bb1`).
- ✅ **Verbinden-Fenster, Siegel und Lampen sprechen Deutsch UND Englisch**
  (23 UI seit 2026-09-14, sha `709c4364026e`; 16 und 17 seit demselben Tag)
  — siehe den Abschnitt „Die Sprache der Kiste"
  weiter unten. Der Fremde bekommt das **ohne Zutun**; wer nichts einstellt,
  bekommt Deutsch wie bisher.
- ✅ **Marktplatz-Einreichung** steht (`family-project/markt.html`, „Zur Prüfung
  einreichen") + die Werkzeug-Seiten `family-project/werkzeuge/andock-werkzeug.html`,
  `knoten-werkzeug.html`, `such-werkzeug.html`.
- ✅ **Siegel-Bau-Rezept** als Skill: `.claude/skills/status-leiste-siegel`.
- ✅ **Stufe 2 „Voll-Knoten"-Kiste** existiert jetzt als EIN Ordner:
  [`sbkim-bundle-voll/`](../sbkim-bundle-voll/) — 18 Module byte-1:1 aus dem
  Kanon (inkl. gehärtetem Modul 23 + Siegel-Aspekt), `sbkim-connect.js`,
  `README.md` (Einbau in 3 Schritten, Ladereihenfolge 17→15→16),
  `beispiel-voll.html` (lauffähiges Vorbild) und ein Drift-Guard
  (`tests/smoke_vollbundle.mjs`, 42/42 grün). Gebaut 2026-07-30.

---

## Die Sprache der Kiste (2026-09-14)

**Anlass:** Klaus hatte `family-projekt.de` am Tablet auf Englisch gestellt — und
die SBKIM-Fenster darin blieben deutsch. Für eine Kiste, die an **Fremde** geht,
wiegt das doppelt: ein deutsches Fenster mitten in einer englischen Seite sieht
nicht nach „noch nicht übersetzt" aus, sondern nach kaputt.

**Was drin ist.** `modules/23_rendezvous_ui.js` trägt **237 englische Texte**. Das
Verfahren ist **schlüssellos**: der deutsche Satz IST der Schlüssel, fehlt eine
Übersetzung, bleibt der Satz deutsch — nie leer, nie ein Platzhalter.

**Wie ein Fremder die Sprache setzt** — beides geht, keins ist Pflicht:

| Weg | wann |
|---|---|
| `SbkimConnect.init({ …, lang: "en" })` | wenn die App die Sprache umschaltet, **ohne** `<html lang>` mitzuziehen |
| `<html lang="en">` am Dokument | wenn die App das Attribut ohnehin pflegt — dann ist **nichts** zu tun |

> **OHNE EINSTELLUNG ÄNDERT SICH NICHTS.** Wer weder das eine noch das andere
> tut, bekommt Deutsch wie bisher. Jeder andere Wert (`ru`, `zh`, `fr` …) fällt
> fail-soft auf Deutsch zurück — das ist die Rückfalllinie, kein Fehler.

⚠ **`SbkimConnect.init({lang})` hat das Feld bis zum 2026-09-14 STILL
VERSCHLUCKT.** Die Kiste verspricht einem Fremden genau EIN `init()` — und
ausgerechnet darüber war die Sprache nicht erreichbar. Kein Fehler, keine
Warnung, nur ein deutsches Fenster. Aufgefallen ist es nicht beim Bauen des
Sprach-Hakens, sondern weil Klaus danach ausdrücklich nach der Geschenkbox
gefragt hat. Vier Wächter in `tests/smoke_bundle_connect.mjs` stehen seitdem
dagegen, mit Gegenprobe (`tests/gegenprobe_bundle_sprache.mjs`, 4/4 gefangen).

⚠ **Der zweitwichtigste Wächter misst das GEGENTEIL:** ohne Angabe darf die
Kiste `lang` **nicht** setzen. Ein hier erfundener Standard („`de`, wenn nichts
dasteht") würde `<html lang>` überstimmen — dann wäre eine englische Seite, die
das Attribut korrekt mitzieht, plötzlich wieder deutsch, **und zwar wegen der
Kiste**. Ein Wächter nur auf „durchgereicht" wäre dafür blind.

### ✅ Eine Voll-Kiste spricht durchgehend zwei Sprachen (seit 2026-09-14)

| Modul | Stand |
|---|---|
| `23_rendezvous_ui.js` — das Verbinden-Fenster | ✅ Deutsch + Englisch (237 Texte) |
| `16_siegel.js` — das Siegel-Fenster | ✅ Deutsch + Englisch (55 Texte) |
| `17_floating_widget.js` — LEBT/VERKEHR/FREMD/SIEGEL | ✅ Deutsch + Englisch (28 Texte) |

> **Bis zum 2026-09-14 stand hier: „Eine Voll-Kiste ist auf Englisch heute
> GEMISCHTSPRACHIG"** — englisches Verbinden-Fenster neben deutschen Lampen,
> 16 und 17 nur Deutsch. Der Satz galt fünf Tage. Er bleibt hier stehen, weil er
> beschreibt, was ein Fremder in einer **älteren Kopie** der Kiste wirklich
> vorfindet; maßgeblich sind die sha-Werte in der Tabelle oben.

⚠ **`lang` GEHT AN DREI AUFRUFE, NICHT AN EINEN.** `SbkimConnect.init({lang})`
reicht den Wert nur an das Verbinden-Fenster durch. Lampen und Siegel startet
die App selbst, und dort nimmt `init({lang})` denselben Wert:

```js
await SbkimConnect.init({ …, lang: "en" });               // Verbinden-Fenster
await SbkimWidget.init({ lang: "en" });                   // die Lampen
await SbkimSiegel.init({ ribbonText: "…", lang: "en" });  // das Siegel
```

**Über `<html lang="en">` entfällt das alles** — alle drei Module lesen das
Attribut selbst. Das ist der Weg, der in den meisten Apps schon da ist.

Wer eine **Stufe-1**-Kiste auspackt, merkt von 16/17 ohnehin nichts — sie trägt
sie gar nicht.

⚠ **Die Sprache kommt in den Apps NICHT von selbst.** Gemessen am 2026-09-14 an
allen 18 Trägern im Netz: **9 ziehen `<html lang>` beim Sprachwechsel mit, 9
nicht.** Bei den neun anderen bleibt das Fenster deutsch, bis die App entweder
das Attribut mitzieht oder `lang` übergibt. Wer eine Kiste weitergibt, sagt das
dazu — sonst heißt es „kann Englisch" und ändert für den Nutzer nichts.

---

## Fahrplan, wenn Klaus „Voll-Box bauen" sagt

1. Ordner `sbkim-bundle-voll/` (oder Erweiterung des bestehenden) anlegen.
2. Module byte-1:1 aus `src/modules/` kopieren (Liste oben), Drift-Guard-Test
   ergänzen (SHA-256 gegen den Kanon — wie im Skill `netzweiter-modul-rollout`).
3. `README.md` mit der Einbau-Reihenfolge + `beispiel.html` (Voll-Knoten).
4. Als Klick-und-Kopier-Pfad in die **Observatoriums-Vorteilspack-Truhe**
   (Sage-Page) hängen, damit Forker per Knopf statt git-clone nehmen können.
5. Sichttest durch Klaus (Installation als PWA + Andock im Raum).
