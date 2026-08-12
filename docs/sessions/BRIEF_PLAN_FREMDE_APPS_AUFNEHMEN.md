# BRIEF — Plan-Sitzung: fremde PWAs auf den Marktplatz holen

**Angelegt:** 2026-08-12 · **Auftraggeber:** Klaus · **Art: PLAN-MODUS, KEIN BAU.**

Diese Sitzung schreibt **keinen Code**. Sie klärt eine Frage und legt Klaus
Entscheidungen vor. Wer hier baut, hat den Auftrag missverstanden.

---

## 1. Klaus' Idee, in seinen Worten

> „Es gibt bei GitHub und auch im Allgemeinen auf dem Markt sehr viele PWA-Apps,
> die nach einer Plattform suchen, wo sie sich anbieten können. Ich hab das
> bisher mitgekriegt auf verschiedenen Anbietern. Allerdings war es nur halb so
> professionell wie unsere.
>
> Jetzt möchte ich denjenigen vorschlagen, dass sie ihre Apps bei uns hochladen.
> Ich könnte das theoretisch auch so machen, dass ich das Repository von denen
> direkt bei mir reinlade — bei PWA-Toolpoint, was eher angedacht wäre. Das
> heißt, ich könnte fünfzig verschiedene PWAs mir vom Markt holen, bei meinem
> Toolpoint reinsetzen und anbieten.
>
> **Nicht für mich, um zu verdienen, sondern für die, um bekannt zu werden**
> oder damit sie später Geld damit verdienen können. Mein Ziel ist natürlich ein
> anderes: **Reichweite.**
>
> Direkt diejenigen — die Besitzer, wo ein Impressum, eine E-Mail-Adresse oder
> irgendetwas zu erreichen ist — anzuschreiben und ihnen anzubieten, auf meiner
> Plattform zu hosten oder sich eintragen zu lassen, oder sie direkt einzutragen
> und dann anschließend zu zeigen: guck mal, so würde es jetzt aussehen, was
> hältst du davon, willst du drin bleiben oder draußen? Wenn sie sagen
> drinbleiben, dann lasse ich sie drin. Sie kosten nichts, **die ersten hundert
> kosten nichts.** Ich würde mir beim ersten Schub gleich fünfzig verschiedene
> PWA-Apps oder Internetseiten holen."

**Die Frage an diese Sitzung:** Können wir das so machen? Ist es sinnvoll?

---

## 2. Pflichtlektüre, bevor irgendetwas beantwortet wird

In dieser Reihenfolge:

1. `CLAUDE.md` (Sage) — Verfassung, insbesondere § Fremdnutzer-/Marktplatz-Brille
2. **`docs/PLAN_PILZ_WIRTSCHAFT.md`** — das Wirtschafts-Papier. **Pflicht.**
   Besonders: §1 (die Korrektur), §8b (der offene Markt), **§8d (die drei
   Stufen)**, §9 (was „davon leben" heißt), §11 (Regeln), §12 (was NICHT
   gebaut wird), §15 (offene Entscheidungen)
3. `pwa-toolpoint/assets/config/listings.js` — der **Kopf** der Datei ist das
   Schema und die Regel. Er sagt ausdrücklich: *„Hier stehen KEINE Preise und
   KEINE Provisionssätze."*
4. `pwa-toolpoint/CLAUDE.md` § Die Stufen
5. Dieses Dokument.

---

## 3. Der gemessene Ausgangspunkt — warum die Idee einen richtigen Kern hat

Aus `PLAN_PILZ_WIRTSCHAFT.md` §1, **gemessen, nicht vermutet:**

> **0 fremde Marktplatz-Einträge — trotz gratis.**

Daraus wurde die Umkehrung abgeleitet: der Marktplatz ist **Beweisstück**, nicht
Provisions-Maschine. Warten hat nachweislich nicht funktioniert.

**Klaus' Idee ist die logische Antwort auf genau diese Null.** Wer nicht kommt,
muss geholt werden. Das ist kein Bruch mit dem Papier, sondern seine Fortsetzung
— *sofern* die Methode stimmt. Und die Methode ist der eigentliche Streitpunkt.

---

## 4. Was die Sitzung klären muss — vier Fragen, getrennt zu beantworten

Die Idee enthält **vier verschiedene Vorgänge**, die sehr unterschiedlich
riskant sind. Sie dürfen nicht als ein Paket behandelt werden.

### Frage A — Verlinken oder Hosten?

Klaus sagt beides („hochladen" / „das Repository von denen direkt bei mir
reinladen" / „sich eintragen lassen"). Das sind **zwei völlig verschiedene
Dinge**:

| | Verlinken (Katalog) | Hosten (Kopie) |
|---|---|---|
| Was passiert | Eintrag mit Titel, Beschreibung, **Link** auf ihre Seite | ihr Code liegt auf Klaus' Server / in seinem Repo |
| Vorbild | Suchmaschine, Branchenbuch, App-Verzeichnis | ein Shop, der fremde Ware ins Regal stellt |
| Lizenz nötig? | nein | **ja** |
| Aufwand pro App | Minuten | Einbau, Pflege, Updates, Haftung |

**Der Lizenz-Punkt ist hart und wird oft übersehen:** ein öffentliches
GitHub-Repo **ohne Lizenzdatei** ist *nicht* frei — es gilt „alle Rechte
vorbehalten". Ein Fork **auf GitHub** ist von den GitHub-Nutzungsbedingungen
gedeckt; das Weiterveröffentlichen auf `family-projekt.de` ist es **nicht**.

→ **Zu klären:** Empfehlung mit Begründung. Die Sitzung soll prüfen, ob es
überhaupt einen Fall gibt, in dem Hosten mehr bringt als Verlinken.

### Frage B — Eintragen ohne zu fragen?

Klaus' Vorschlag: erst eintragen, dann zeigen, dann fragen („willst du drin
bleiben oder draußen?").

**Für einen reinen Link-Katalog** ist das nah an dem, was Verzeichnisse seit
jeher tun. Es steht und fällt mit:

- ein **sichtbarer, sofort wirksamer Weg raus** pro Eintrag („Das ist deine
  App? → ändern oder entfernen") — ohne Konto, ohne Rückfrage, ohne Frist
- **kein fremdes Bildmaterial**, das nicht dafür gedacht ist. Achtung: das
  Schema in `listings.js` hat **`img:` als PFLICHT**. Ein Bildschirmfoto oder
  Logo einer fremden App ist deren Material. Das ist pro Eintrag zu klären —
  **hier steckt ein echter Konflikt zwischen dem Pflichtfeld und der Idee.**
- **kein Anschein einer Partnerschaft**, die es nicht gibt

**Für gehostete Kopien** ist es nicht vertretbar — siehe Frage A.

→ **Zu klären:** Ist das Pflichtfeld `img:` mit Fremd-Einträgen vereinbar? Muss
es optional werden, oder braucht es einen neutralen Platzhalter?

### Frage C — Wie ansprechen? (der heikelste Punkt)

Klaus will Impressum-/E-Mail-Adressen nutzen und anschreiben.

**Hier muss die Sitzung Klaus ausdrücklich warnen — nicht beschwichtigen:**

Unaufgeforderte Werbe-E-Mail ist in Deutschland **§ 7 UWG**, auch von
Gewerbetreibendem zu Gewerbetreibendem. Ein **kostenloses** Angebot ist trotzdem
geschäftlich, wenn es dem eigenen Zweck dient — und Reichweite **ist** ein
eigener Zweck. Adressen aus einem **Impressum** sind dabei besonders heikel: das
Impressum besteht für die **rechtliche Erreichbarkeit**, nicht als
Werbe-Verteiler. Und: 50 Anschreiben sind nicht „50 × ein kleines Risiko",
sondern 50 Gelegenheiten für **eine** Abmahnung, die richtig Geld kostet.

**Es gibt saubere Wege, und sie sind nicht schlechter:**

| Weg | Warum er trägt |
|---|---|
| **GitHub-Issue / Discussion** im Repo des Anbieters | genau dafür veröffentlicht, öffentlich, zum Projekt, keine Werbe-Mail |
| **Kontaktformular** auf ihrer Seite | sie haben den Kanal selbst geöffnet |
| **Mastodon / X / Forum**, wo das Projekt auftritt | öffentlich, widerruflich, kein Postfach |
| **Sie finden sich selbst** — der Katalog steht, wird gefunden | die stärkste Variante, weil die Reaktion echt ist |

→ **Zu klären:** ein konkreter, wortwörtlicher Text-Vorschlag für den
GitHub-Issue-Weg — kurz, ehrlich, ohne Verkaufston, mit dem Weg raus im ersten
Absatz. **Keine Rechtsberatung** — die Sitzung nennt das Risiko und den
sichereren Weg, die Entscheidung trifft Klaus (ggf. mit einem Anwalt).

### Frage D — „Die ersten hundert kosten nichts"

**Das ist der Satz, an dem die Sitzung am genauesten hinsehen muss.**

`PLAN_PILZ_WIRTSCHAFT.md` §8d zieht die Grenze **scharf**:

> **Stufe 1 · Zeigen:** Seite ist online, zeigt Apps. **Keine Preise, keine
> Provision, kein „trag dich ein für X €"** → kein Gewerbe nötig.
> **Stufe 2 · Handeln:** zum ersten Mal ein Preis → **Gewerbeanmeldung davor.**
>
> „Sobald irgendwo ein Preis, ein Prozentsatz oder ein ‚jetzt eintragen' steht,
> ist es Stufe 2. Eine Seite, die *zeigt*, ist eindeutig; eine, die *fast schon
> anbietet*, ist ein Graubereich — und Graubereiche sind das, was vermieden
> werden soll."

**„Die ersten hundert kosten nichts" sagt mit: ab hundertundeins kostet es.**
Das ist eine angekündigte Preisstruktur. Nach Klaus' **eigener** Regel wäre das
der Übergang in Stufe 2 — mit Gewerbeanmeldung davor.

Der Unterschied ist ein einziges Wort:

- ❌ „Die **ersten hundert** kosten nichts." → kündigt einen Preis an
- ✅ „Der Eintrag kostet nichts." → Stufe 1, sauber

→ **Zu klären:** Klaus vorlegen, dass sein Satz gegen seine eigene Tafel läuft,
und die zwei Formulierungen zur Wahl stellen. **Nicht stillschweigend
korrigieren** (Tafel-Evolutions-Klausel).

---

## 5. Der Nebengedanke — wie weit sind wir vom bezahlbaren Modell weg?

Klaus' ausdrückliche Zusatzfrage. Die Sitzung beantwortet sie **mit Zahlen aus
dem Papier**, nicht aus dem Gefühl.

Aus `PLAN_PILZ_WIRTSCHAFT.md` §9 (Bedarf 2.000–3.000 €/Monat):

| Weg | Was nötig wäre | Größenordnung |
|---|---|---|
| ① Beteiligung an Partnerbetrieben | **2–3 Partner** | eine Handvoll Menschen |
| ② Wartung / Betreuung | **~100 Kunden** à ~20 €/Monat | überschaubar, über Jahre |
| ③ Marktplatz-Provision | **400–500 Käufe/Monat** | Hunderte |
| ④ Jahresbeitrag | bei 50 €/Jahr: **500 zahlende Anbieter** | Hunderte |

**Der Befund, den die Sitzung Klaus nennen soll:**

Die Marktplatz-Idee wächst auf den **langsamsten** Geld-Wegen (③ und ④). Fünfzig
Einträge sind ein Zehntel dessen, was ein Jahresbeitrag bräuchte, um allein zu
tragen — und ein Zehntel von etwas, das laut Papier **erst nach ① und ②** an die
Reihe kommt.

**Das heißt nicht, dass die Idee falsch ist.** Es heißt: sie zahlt auf
**Reichweite** ein, nicht auf Einkommen — und genau das hat Klaus selbst gesagt
(*„Mein Ziel ist natürlich Reichweite"*). Sie ist damit **kein Abweichen vom
Ziel**, aber auch **kein Schritt darauf zu**. Der Weg zum bezahlbaren Modell
läuft weiter über ① und ②.

Zu prüfen und zu berichten:

- Steht heute schon Geld irgendwo? (Papier-Stand 2026-08-09: **null Einnahmen**,
  nur ein Spenden-Hinweis)
- Welche der offenen Entscheidungen aus §15 blockieren ① und ② — und welche
  davon könnte Klaus in dieser Sitzung treffen?
- Wo genau stehen wir in den drei Stufen aus §8d?

---

## 6. Was die Sitzung abliefert

**Ein Dokument** — `docs/PLAN_FREMDE_APPS.md` — und einen kurzen Chat-Abriss:

1. **Empfehlung zu A** (verlinken vs. hosten) mit Begründung
2. **Empfehlung zu B**, inklusive der Lösung für das Pflichtfeld `img:`
3. **Empfehlung zu C**, mit einem wortwörtlichen Vorschlagstext
4. **Klaus' Entscheidung zu D** einholen (`AskUserQuestion`, zwei Formulierungen)
5. **Der Nebengedanke** aus §5 als eigener Abschnitt, mit Zahlen
6. **Eine Reihenfolge:** was zuerst, was gemessen wird, wann skaliert

**Eine Maßgabe für die Reihenfolge, aus der Hausdisziplin abgeleitet:**

> `PLAN_PILZ_WIRTSCHAFT.md` §8d: *„kein Preismodell ohne Nachfrage. Erst messen,
> dann verpflichten."*
>
> Hier heißt das: **keine fünfzig ohne gemessene Reaktion auf fünf.** Der erste
> Schub sind nicht 50 Apps, sondern eine kleine Zahl — und dann wird gezählt,
> wie viele antworten, wie viele drin bleiben, wie viele sich beschweren. Erst
> danach fällt die Entscheidung über den großen Schub.

---

## 7. Tabu für diese Sitzung

- **Kein Code.** Kein Eintrag in `listings.js`, keine Änderung am Schema, kein
  Werkzeug zum Einsammeln. Erst der Plan, dann Klaus' Entscheid, dann ein
  eigener Bau-Brief.
- **Keine fremde App eintragen, auch nicht probeweise.**
- **Keine E-Mail an irgendwen.**
- **Keine Rechtsberatung.** Risiken benennen, Belege nennen, Entscheidung bei
  Klaus lassen. Wo es dicht wird: auf einen Anwalt verweisen (§13 des Papiers).
- **Nicht stillschweigend korrigieren.** Wo Klaus' Idee gegen eine bestehende
  Tafel läuft (Frage D), wird das **ausdrücklich vorgelegt**, nicht umgangen.

---

## 8. Freibrief und Pflichten

Der stehende **Freibrief** gilt (CLAUDE.md § Freibrief): selbstständig
entscheiden und mergen, wo es logisch, nachvollziehbar und nützlich ist —
**aber** dies ist eine Plan-Sitzung mit einem ausdrücklichen Entscheidungspunkt
für Klaus (Frage D). Der wird **nicht** selbst entschieden.

Am Sitzungsende: `docs/PULS.md` fortschreiben · Übergabeprotokoll in
`docs/sessions/archiv/` · „Nächste Schritte"-Block **in der Chat-Antwort** ·
den Folge-Brief vollständig als Codeblock im Chat ausgeben.

---

## 9. Stand der Vorgänger-Sitzung (2026-08-12)

Das Netz-Mikrofon hörte in **jeder** App mit Modul 23 immer Deutsch. Behoben,
19 PRs gemergt, zwölf Sprachen im Kanon. Details:
`docs/sessions/archiv/2026-08-12_netz-mikrofon-sprachen.md`.

**Offen von dort:** Klaus' Browser-Sichttest · vier abweichende
Modul-23-Kopien (Kim-Bell, Mein-WorkFloh, SB-KIMTool-Point, BookLedgerPro) ·
Dari-Test · EU-Spracherkennung für Paschtu · `PULS.md` bei ~9.800 Zeilen gegen
die eigene 3.000-Zeilen-Grenze.
