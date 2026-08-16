# Brief — Schritt 4 (der Schalter), die Kette einmal ganz belegen, und was sonst offen liegt

**Geschrieben 2026-08-11** am Ende der Sitzung „Wächter-Ampel für Toolpoint",
**berichtigt am selben Abend** (siehe unten).
Adressat: die nächste Sitzung. Klaus liest zuerst den Chat — dieser Brief steht
deshalb auch dort als Codeblock.

> **Dieser Brief löst `BRIEF_WAECHTER_TOOLPOINT_UND_SCHALTER.md` ab.** Der alte
> bleibt als Historie liegen und ist an einer Stelle weiterhin die ausführlichere
> Quelle: seinem Abschnitt zur Oberflächen-Sprache. Der **Stand** von dort ist
> hier übernommen.
>
> **Warum diese Zeile hier steht:** zwei Sitzungen liefen an diesem Abend
> nebeneinander. Während diese hier den Wächter baute, entschied und baute die
> andere die Sprachfrage — und berichtigte den alten Brief (#823), nachdem
> dieser hier ihn bereits als „offen" abgeschrieben hatte. Klaus hat es beim
> Gegenlesen gefunden. **Merksatz: ein Brief, der einen offenen Punkt
> weiterreicht, muss den Stand dieses Punktes NEU nachsehen — nicht aus dem
> Vorgänger abschreiben.**

---

## Stand — was seit dem Vor-Brief fertig wurde

| Was | Stand |
|---|---|
| **Schritt 3: die Ampel** — Handschalter, Band an der Karte, Studio-Knöpfe | ✅ gebaut, gemergt (Toolpoint #32) |
| **Der Riegel im Server**, einseitig gelockert: setzen ja, lösen nein | ✅ gebaut, gemergt (family #265) |
| **Drei rote Drift-Guards im Netz** (Toolpoint · Kimboard · Kimseek) | ✅ geheilt — **von einer parallelen Sitzung** (#31, #57, Kimboards eigener Lauf). Meine drei Commits kamen 20 Minuten zu spät und waren Doppelarbeit, zwei mit leerem Diff. |
| **Schritt 4: der Schalter** | ⏳ offen — die Bauweise steht aber fest, siehe unten |

**Die Regel als Rangfolge**, an drei Stellen dieselbe (Papier · `wache_rang()`
in `marktplatz-api.php` · `WACHE_RANG` in Toolpoints `studio.js`):

    0  gruen      Hand-Freigabe, überstimmt die Automatik
    1  (nichts)   kein Eintrag
    2  gelb       Vorbehalt
    3  rot        gesperrt

Aus dem Browser geht es **nur nach oben**. Das erschlägt Herabstufen,
Freigeben, „gruen setzen" und das Weglassen eines gesperrten Eintrags in einem
Satz. Dazu `grund_fehlt` und `vorlage_nicht_lesbar` (fail-closed).

---

## Der Stand der Kette — was belegt ist und was nicht (2026-08-12)

**Kein Riegel für die nächste Sitzung.** Klaus hat den Sperr-Test ausdrücklich
verschoben: *„Sperren ist im Studio aufgetaucht und vermutlich funktioniert das
auch. Ich muss das jetzt nicht testen."* Also **nicht** danach fragen und **nicht**
darauf warten — Schritt 4 darf ohne diesen Beleg beginnen.

| Glied der Kette | Stand |
|---|---|
| `marktplatz-api.php` auf dem Webhosting | ✅ **hochgeladen** — Klaus hat sie am 2026-08-12 per WebFTP gespeichert, Zeilennummern 415/418/428/440 gegen die Datei geprüft, 440 Zeilen, kein `?>` |
| Sperr- und Vorbehalt-Knöpfe im Studio | ✅ **sichtbar bestätigt** (Klaus' Bildschirmfoto: an allen 14 Einträgen „Bearbeiten · Löschen · ⛔ Sperren · ⚠ Vorbehalt") |
| Der Sperr-Vorgang selbst (Knopf → Server → Band an der Karte) | ⏳ **ungetestet**, bewusst zurückgestellt |

**Was das genau heißt, ohne Beschönigung:** dass die Knöpfe **da** sind, ist
belegt. Dass ein Druck darauf durchläuft, ist **nicht** belegt — nur headless
(`smoke_studio_markt` 90/90, Gegenprobe 8/8 an der echten PHP). Wer später etwas
darauf aufbaut, weiß damit, wo die Grenze liegt.

**Wenn Klaus es doch einmal prüfen will**, sind es drei Schritte: Studio öffnen
(langer Druck auf die Fußzeile) → Einträge → „⛔ Sperren", Grund eintragen,
„Veröffentlichen". Eine Minute später steht ein rotes Band an der Karte, der
Eintrag bleibt sichtbar, „Zur Seite ↗" ist weg. Zurücknehmen **nur** in
`pwa-toolpoint/assets/config/wache-hand.json` — den Eintrag herausnehmen. Das ist
der einzige Weg zurück, und das ist Absicht.

---

## FOKUS — Schritt 4: der Schalter

Klaus: *„Für mich muss das im Studio eh umschaltbar sein … sodass ich entscheiden
kann, ob ich das automatisiere oder ob ich das händisch mache."*

| Stellung | Was passiert |
|---|---|
| **Von Hand** (Start) | Das Studio **zeigt** nur: „4 Meldungen · Leistung 42, dritte Nacht unter 50". Klaus drückt. |
| **Automatik** | Dasselbe Gelb wird **öffentlich gezeigt**. **Rot bleibt Hand.** |

### Der Befund, der die Bauweise festlegt — bitte NICHT umgehen

> **Das automatische Gelb darf NICHT in `wache-hand.json` landen.**

Die Regel sagt: drei schlechte Nächte geben Gelb, und die **erste gute Messung
nimmt es zurück**. Genau das kann der Handschalter nicht — der Riegel lässt aus
dem Browser nur Verschärfen zu (richtig so), und ein Gelb, das dort einmal
steht, käme nie wieder heraus. Es bliebe stehen, während die Seite längst
schnell ist. Eine Warnung, die man nicht mehr los wird, lernt man zu übersehen;
dann ist sie schlimmer als keine.

In family-projekt.de fällt das nicht auf, weil das automatische Gelb dort im
**nächtlichen Bericht** (`spore-stand.json`) steht, nicht im Handschalter.

**Also für Toolpoint: gerechnet, nicht gespeichert.** Aus `messung.unterGrenze`,
jedes Mal neu, in `assets/karte.js` neben dem Hand-Band. Dann verschwindet es
von allein, und `wache-hand.json` bleibt, was sein Name sagt.

### Die Schwellen — zwei sind Studio-Zahlen, eine nicht

- **4** (Meldungen bis Prüfstapel) → änderbar, das Studio zählt selbst.
- **3** (Nächte bis Gelb) → änderbar, verglichen wird gegen `messung.unterGrenze`.
- **50** (die Grenze) → **kein Regler im Studio.** Gezählt wird in
  `tools/messwerte-holen.mjs`; ein Regler, der die Zahl ändert, während der
  nächtliche Lauf weiter gegen 50 zählt, wäre ein Knopf, der lügt. Zeigen: ja,
  mit dem Dateinamen daneben.

### Wo der Schalter selbst wohnt

Offene Frage, bitte bewusst entscheiden und begründen: Wenn das gerechnete Gelb
**öffentlich** sichtbar sein soll, muss der Schalter auch für die Seite lesbar
sein — also committet, nicht in `localStorage`. Ein Feld in `wache-hand.json`
(z. B. `_automatik`) geht **nicht ohne Weiteres**: der Prüfer im Server lässt
neben `_hinweis` nur Schlüssel zu, die wie eine `anchorId` aussehen. Wer diesen
Weg will, erweitert den Prüfer bewusst mit — **nie stillschweigend**.

### Was die Automatik NIEMALS darf (wörtlich aus der Regel)

1. **Rot setzen** — nicht bei Meldungen, nicht bei Messwerten, nie.
2. **Rot lösen** — eine gesetzte Sperre nimmt nur die Hand zurück.
3. **Über den kriminellen Fall entscheiden.**
4. **Still handeln** — jede Schaltung trägt Datum und Grund.

Der Satz, aus dem alles folgt: **„Es wird nicht automatisch rausgeschmissen. Es
wird automatisch zur Prüfung gegeben."**

---

## Was sonst offen liegt

### Neu aus dieser Sitzung

- **Modul 17: das Mycel-Blasen-Panel ist zu breit fürs Handy.** Gemessen
  2026-08-12: `#sbkim-widget` ist **385 px** breit — breiter als ein
  360-px-Bildschirm. Es ist `position: fixed`, reißt die Seite also nicht
  auseinander, wird aber **links angeschnitten**. Sichtbar in **Mein-WorkFloh,
  Tomys-Hub und Kimboard**. Die Kopien sind byte-geschützt: der Fix gehört in
  `src/modules/17_floating_widget.js` (etwa `width: min(385px, calc(100vw - 24px))`)
  und muss dann **netzweit neu kopiert** werden, samt Drift-Guards. Nachmessen
  mit `tools/breite-messen.mjs`.

- **family hat noch keine Sperr-Knöpfe.** Der Server erlaubt sie jetzt für
  beide Marktplätze; das Studio dort (`assets/studio-markt.js`) schickt weiter
  nur Quittungen. Kurze Runde, wenn Klaus es dort auch will — das Muster steht
  in `pwa-toolpoint/assets/studio.js`.
- **`docs/PULS.md` reißt seine eigene Grenze weiter** (3000 im Kopf, rund 9650
  real). Zwei Sitzungen haben es jetzt gemeldet und nicht gemacht. Eigene
  Pflege-Runde: Älteres nach `docs/sessions/archiv/`, **nicht** kürzen, die
  Grenze **nicht** herabsetzen.

### Aus dem Vor-Brief, unverändert offen

- **Server-Updates** auf dem Hetzner-Cloud-Server (10 Sicherheits-Updates + ein
  Neustart). Klaus per `ssh root@<IP> '<befehl>'` — **nie** einen `apt`-Befehl
  geben, ohne dazuzusagen, dass er auf den Cloud-Server gehört und nicht ins
  Termux.
- **Kim-Bell + Mein-WorkFloh sind vom Modul-23-Kanon abgedriftet** (sie fahren
  `modules/sbkim-rendezvous-ui.js` statt `sbkim/23_rendezvous_ui.js`). Jeder
  künftige Fix geht an beiden vorbei.
- **Falsche App-Adressen auf der Mycel-Karte** — aus Repo-Namen abgeleitet und
  nie wirklich abgerufen (jede Probe kam durch den Proxy mit `000` zurück).
- **Mikrofon mehrsprachig in die übrigen Apps** — **weiterhin offen.** In
  **Kimboard erledigt** (PR #87): zehn Sprachen, Vorauswahl aus der
  Geräte-Sprache, `dir="auto"` an den Feldern, Wächter 13/13 samt
  Sabotage-Probe. Zu tun: dasselbe Muster in den übrigen Apps mit Mikrofon —
  **erst nachsehen, wo überhaupt eins verbaut ist.**
  - **Merksatz:** die Browser-Spracherkennung hat **keine** Sprach-Erkennung.
    Sie hört genau die Sprache, die man ihr sagt. Wer auf „erkennt sich schon
    selbst" baut, baut nichts.
  - **Modul 21 kennt nur de/en/ru** und ist byte-1:1 zum Kanon. Weitere Sprachen
    dort sind ein **netzweiter Rollout** (eigene Runde, alle Repos +
    Drift-Guards). Bis dahin liegt die Liste bewusst im App-Code.
- **Oberflächen-Sprache: ✅ ENTSCHIEDEN UND GEBAUT am 2026-08-11.** Hier stand
  bis zur Berichtigung „Klaus' Entscheidung steht aus" — **das war schon beim
  Schreiben überholt.** Der wirkliche Stand, aus dem alten Brief übernommen:
  - **„Weg 3" (`<html lang>` mitziehen) war längst gebaut.** `applyLang()` setzt
    `document.documentElement.lang` seit jeher bei jedem Sprachwechsel. Der
    Vorschlag beruhte auf einem Suchfehler — gesucht wurde nach
    `navigator.language` statt nach `documentElement.lang`. **Merksatz: eine
    Fundstelle, die man nicht gesucht hat, ist kein Beweis für Abwesenheit.**
  - **Die echte Lücke war der erste Aufruf**, und die ist geschlossen: Weg 1 ist
    in **vier** Apps gemergt — Mein-Rezeptbuch #370 · Mein-Mixarium #186 ·
    Mein-WorkFloh #166 · Muttis-Rezeptbuch #182 (die Schwester mit, damit die
    beiden nicht auseinanderlaufen).
  - **Der Riegel, der dabei entstand — bei ähnlichen Bauten beachten:**
    übernommen wird **nur eine Sprache, die die App wirklich hat** (`LANGS`).
    Gemessen: ein erzwungenes `lang="ar"` auf durchgehend deutschem Text bringt
    Chrome dazu, **seine eigene Übersetzung nicht mehr anzubieten** — es hält die
    Seite für schon übersetzt. Blind übernehmen wäre schlechter als nichts tun.
    Eine gespeicherte Wahl gewinnt immer.
  - **Was davon offen BLEIBT:**
    - **WorkFlohs Einrichtungs-Bildschirm ist fest deutsch verdrahtet** —
      `showSetupScreen()` ohne `T()`. Der **allererste Satz**, den ein Fremder
      sieht, ist damit immer deutsch. Braucht einen Schlüssel in `TR` +
      Übersetzungen in allen sieben Sprachen; bewusst nicht nebenbei gemacht.
    - **Ob Chromes Übersetzungs-Angebot in einer INSTALLIERTEN PWA greift**
      (dort fehlt die Adressleiste und damit der Knopf) — **ungeprüft.** Vor
      jeder Arbeit daran zuerst messen. Betrifft die fünf Apps ohne eigene
      Übersetzungs-Tabelle (Kimboard, Kimseek, family-project, BookLedgerPro,
      Tomys-Hub), die zu Recht auf `lang="de"` stehen.
- **Phase D.2 — Pilz-Wirtschaft:** drei Entscheidungen offen (EVL. ·
  Jahresbeitrag · WorkFloh-Preisform), `docs/PLAN_PILZ_WIRTSCHAFT.md`.

---

## Ein Werkzeug, das diese Sitzung hinterlässt

`tools/breite-messen.mjs` — stellt eine Seite in ein schmales Fenster und sagt,
**welches Element** hinausragt und um wie viel. Es misst die Rechnung des
Browsers, nicht den Quelltext.

    PW_CORE=<pfad>/playwright-core/index.js BREITEN=320,360,412 \
      node tools/breite-messen.mjs <ordner> [datei]

Damit gefunden: ein einziges `<select>` (407 px, weil ein Auswahlfeld sich nach
seinem längsten Eintrag richtet und als Flex-Kind nicht schrumpfen darf) hielt
Pinnwand und Kimboard auf 442 bzw. 524 px. **Eine Seite, die breiter ist als das
Fenster, bricht beim Schmalerziehen nicht sauber um** — das sah aus wie „reagiert
verzögert" und war eine Platz-Rechnung.

Netzweit nachgemessen: alle übrigen Apps passen bei 360 px. Klaus' Eindruck
„fast alle Apps" waren gemessen **zwei**.

## Drei Lehren, die nicht verloren gehen dürfen

**1. Ein Wächter, der den eigenen Text liest, ist blind.** In dieser Sitzung
wieder passiert: die Prüfung „der Bau-Lauf hört auf `wache-hand.json`" fand den
Dateinamen im **Kommentar** der Workflow-Datei — die Zeile selbst fehlte. Die
Prüfung war grün und gab der Sitzung recht. Prüfe die **Tat**: lass die
Funktion laufen, rechne die Regel nach, sieh in der kommentarfreien Fassung nach.

**2. Zu jedem Wächter gehört eine Sabotage-Probe — und die veraltet.** Eine
ältere Probe zielte auf eine Code-Zeile, die diese Sitzung geändert hatte. Die
Sabotage traf nichts mehr und sah deshalb aus wie eine bestandene Prüfung.
Dieselbe Falle wie die `?v=2`/`?v=3`-Proben vom 2026-08-09. **Wer eine Zeile
ändert, sieht nach, ob eine Gegenprobe auf sie zielt.**

**3. Eine Prüfung, die dir recht gibt, ist der Ort, an dem du am genauesten
hinsehen musst.** Der rote Drift-Guard in drei Repos stand seit dem 2026-08-11
still auf rot — er hatte recht, nur hörte ihm niemand zu.

**4. Ein weitergereichter „offener Punkt" ist ein Stand, kein Zitat.** Dieser
Brief hat die Sprachfrage aus dem Vorgänger als „Entscheidung steht aus"
übernommen — sie war zu dem Zeitpunkt längst entschieden und in vier Apps
gebaut. Zwei Sitzungen liefen nebeneinander, und abgeschrieben statt nachgesehen
war schneller. Gefunden hat es Klaus beim Gegenlesen, nicht ich. **Wer eine
Offen-Liste weitergibt, sieht jeden Punkt darauf neu nach** — mindestens
`git log origin/main` der betroffenen Repos.

**5. Eine Fundstelle, die man nicht gesucht hat, ist kein Beweis für
Abwesenheit.** Aus derselben Sprach-Runde: „keine App folgt dem Browser" beruhte
darauf, dass nach `navigator.language` gesucht wurde und nicht nach
`documentElement.lang`. Die Hälfte war längst gebaut.

**6. Zwischen Messen und Melden liegt Zeit.** Dieselbe Sitzung fand drei rote
Drift-Guards, maß sie (Kimboard 5/6, Kimseek 10/11), reparierte sie und meldete
das als eigenen Fund. Zum Zeitpunkt der Messung stimmte alles. Zwanzig Minuten
später, beim Pushen, hatte eine parallele Sitzung längst dieselben drei Pins
geheilt — zwei meiner Commits landeten als **leerer Diff**. Ein `fetch` beim
Sitzungsstart deckt zwei Stunden später nichts. **Wer einen netzweiten Befund
meldet, holt den Stand unmittelbar davor noch einmal.**

Lehre 4, 5 und 6 sind dieselbe Familie: **abgeschrieben statt nachgesehen,
gesucht am falschen Ort, gemessen zur falschen Zeit.** Alle drei gaben der
Sitzung recht. Alle drei hat Klaus gefunden, nicht sie selbst.

---

## Pflichtlektüre vor der Arbeit (in dieser Reihenfolge)

1. `Sage-Protokol/CLAUDE.md` — allen voran die Sitzungsstart-Pflicht: **immer
   frisch von `origin/main` abzweigen**. Und die Falle darin:
   `checkout -B <branch> origin/main` hängt den **Upstream** auf `origin/main` —
   gegen den **gleichnamigen Remote-Branch** prüfen, nicht gegen `@{upstream}`.
2. `Sage-Protokol/docs/PULS.md` — oberster Eintrag ist 2026-08-11 (2).
3. **`pwa-toolpoint/docs/RAUSWURF-REGEL.md`** — vollständig, besonders
   § „Die Rangfolge" und § „Was beim Bau von Schritt 3 für Schritt 4 herauskam".
4. `pwa-toolpoint/assets/studio.js`, Abschnitt „DIE AMPEL" — dort steht die
   Rangfolge und warum es keinen Lösen-Knopf gibt.
5. `family-project/server/marktplatz-api.php`, Abschnitt `commit_wache` — dort
   wird wirklich entschieden.
6. `pwa-toolpoint/assets/karte.js` + `tools/statische-listen.mjs` — wie die
   Ampel in die Seite kommt (eingebacken, nicht nachgeladen).

## Die drei Maschinen — nie erraten

- **Tablet / Termux** — Prompt `~ $`, Paketbefehl `pkg`. Kein Server.
- **Hetzner Cloud (CX23, Ubuntu)** — Prompt `root@ubuntu-…:~#`, `apt`. Caddy im
  Docker unter `/opt/relay/`, liefert `family-projekt.de` statisch aus.
  `caddy reload` (prüft, behält bei Fehler die alte Konfig), **nicht** `restart`.
- **Hetzner Webhosting S (konsoleH, Apache)** — hier läuft **PHP**, hier liegt
  `freigabe-config.php` mit dem Token, **hier gehört `marktplatz-api.php` hin.**

## Kommunikation mit Klaus

Kein Programmierer, lernbereit, Antworten auf **Deutsch**. **Ein Schritt pro
Antwort** mit klarem Erfolgsmerkmal, dann auf Rückmeldung warten. **Keine
Terminal-Befehle** außer als fertige `ssh root@<IP> '…'`-Einzeiler, die gar nicht
auf dem Tablet landen können. Copy-Paste-Blöcke: **Dateiname groß darüber**, und
bei mehreren Dateien eine Kennzeile zur Unterscheidung.

**Freibrief gilt** (`CLAUDE.md` § Freibrief): selbstständig bauen, merken und die
**eigenen** PRs mergen, wenn es logisch, getestet und abgegrenzt ist. Grenze
bleibt das echte Zweifeln. Nie stillschweigend: jede Entscheidung wird
dokumentiert.

## Abschluss-Befehl (die Kette reißt nie ab)

Am Sitzungsende: `PULS.md` fortschreiben · Übergabeprotokoll in
`docs/sessions/archiv/YYYY-MM-DD_<thema>.md` · Commit + Push · **„Nächste
Schritte"-Block direkt in der Chat-Antwort** (2–4 Punkte, je ein Satz
Begründung) · **neuen Brief schreiben und vollständig als Codeblock im Chat
ausgeben.**
