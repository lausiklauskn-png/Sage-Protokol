# Brief — Schritt 4 (der Schalter), die Kette einmal ganz belegen, und was sonst offen liegt

**Geschrieben 2026-08-11** am Ende der Sitzung „Wächter-Ampel für Toolpoint".
Adressat: die nächste Sitzung. Klaus liest zuerst den Chat — dieser Brief steht
deshalb auch dort als Codeblock.

---

## Stand — was seit dem Vor-Brief fertig wurde

| Was | Stand |
|---|---|
| **Schritt 3: die Ampel** — Handschalter, Band an der Karte, Studio-Knöpfe | ✅ gebaut, gemergt (Toolpoint #32) |
| **Der Riegel im Server**, einseitig gelockert: setzen ja, lösen nein | ✅ gebaut, gemergt (family #265) |
| **Drei rote Drift-Guards im Netz** (Toolpoint · Kimboard · Kimseek) | ✅ geheilt (#32 · #89 · #58) |
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

## ZUERST: die Kette einmal ganz belegen (Klaus-Schritt)

Bevor irgendetwas Neues gebaut wird, muss **ein Mensch einmal drücken**. Bisher
ist die Kette nur headless bewiesen.

1. **`server/marktplatz-api.php` aufs Webhosting laden** (Hetzner Webhosting S,
   konsoleH, **Apache** — dort, wo `einreichung.php` und `freigabe.php` schon
   liegen). Die Datei liegt in `family-project/server/`.
   - **Nicht mit `einreichung.php` verwechseln.** Am 2026-08-11 ist genau das
     einmal passiert und das Einreichformular war kaputt. Die dritte Zeile von
     `marktplatz-api.php` lautet:
     `* marktplatz-api.php — JSON-API fürs Marktplatz-Studio (Warteschlange im Studio).`
   - An `freigabe-config.php` ist **nichts** zu ändern.
2. **Im Toolpoint-Studio einmal sperren** (langer Druck auf die Fußzeile →
   Einträge → „⛔ Sperren" → Grund eintragen → „Veröffentlichen").
   **Erfolgsmerkmal:** eine Minute später steht auf `pwa-toolpoint.de` ein
   rotes Band an der Karte, der Eintrag ist noch da, „Zur Seite ↗" ist weg.
3. **Danach in der Datei wieder lösen** —
   `pwa-toolpoint/assets/config/wache-hand.json`, den Eintrag herausnehmen. Das
   ist der einzige Weg zurück, und das ist Absicht.

**Solange Schritt 1 nicht passiert ist,** scheitern die Sperr-Knöpfe mit
`field_not_allowed`. Das ist kein Fehler im Studio, sondern die alte PHP auf dem
Server — sichtbar und in der sicheren Richtung.

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
- **Mikrofon mehrsprachig in die übrigen Apps** (in Kimboard erledigt, PR #87).
  Merksatz: die Browser-Spracherkennung hat **keine** Sprach-Erkennung — sie
  hört genau die Sprache, die man ihr sagt.
- **Oberflächen-Sprache folgt nirgends dem Browser.** Drei Wege liegen Klaus
  vor, seine Entscheidung steht aus — **nicht eigenmächtig loslegen.**
- **Phase D.2 — Pilz-Wirtschaft:** drei Entscheidungen offen (Everlast ·
  Jahresbeitrag · WorkFloh-Preisform), `docs/PLAN_PILZ_WIRTSCHAFT.md`.

---

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
