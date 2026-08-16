# Brief — nach dem Schalter: ein Handgriff für Klaus, und was liegen bleibt

**Geschrieben 2026-08-12** am Ende der Sitzung „Schritt 4: der Schalter".
Adressat: die nächste Sitzung. Klaus liest zuerst den Chat — dieser Brief steht
deshalb auch dort als Codeblock.

> **Dieser Brief löst `BRIEF_SCHALTER_UND_WAS_OFFEN_LIEGT.md` ab.** Der alte
> bleibt als Historie liegen. **Jeder** Punkt seiner Offen-Liste ist am
> 2026-08-12 neu nachgesehen worden, nicht abgeschrieben — der Stand unten ist
> der geprüfte. Wer ihn weiterreicht, sieht ihn wieder neu nach.

---

## Stand — Schritt 4 ist fertig, die Rauswurf-Regel damit auch

| Was | Stand |
|---|---|
| **Schritt 4: der Schalter** | ✅ gebaut, gemergt (Toolpoint #34 · family #267) |
| Schritte 1–3 | ✅ seit 2026-08-11 |
| **Ein Handgriff fehlt noch** | ⏳ `marktplatz-api.php` aufs Webhosting laden — siehe unten |

Der Schalter heißt `_automatik` und steht in
`pwa-toolpoint/assets/config/wache-hand.json`:

| Stellung | Befund im Studio | Gelb öffentlich | Rot |
|---|---|---|---|
| **Von Hand** (Start) | steht da | nein | nur von Hand |
| **Automatik** | steht da | **ja, gerechnet** | nur von Hand |

Das gelbe Band wird **gerechnet, nicht gespeichert** — `assets/karte.js` liest
bei jedem Zeichnen `messung.unterGrenze`. Es verschwindet von allein, sobald
wieder gut gemessen wird. Die Hand gewinnt an jedem Eintrag, an dem sie
geschaltet hat: rot und gelb zeigen ihr eigenes Band, grün zeigt gar keins.

Volle Begründung: `pwa-toolpoint/docs/RAUSWURF-REGEL.md` § „Schritt 4 — der
Schalter, wie er gebaut wurde".

---

## FOKUS — der eine Handgriff, ohne den der Schalter nicht durchgeht

Das Studio spricht mit der `marktplatz-api.php` auf Klaus'
**Hetzner-Webhosting** (konsoleH, Apache — nicht der Cloud-Server, nicht
Termux). Dort liegt noch die Fassung vom 2026-08-12 **vor** dieser Sitzung, und
die weist den Schalter mit `bad_key` ab.

Zu tun: `family-project/server/marktplatz-api.php` von `main` holen und per
WebFTP an dieselbe Stelle legen wie am 2026-08-12. Nichts an der Konfiguration
ändern.

**Woran man merkt, dass es geklappt hat:** im Studio den Haken „Automatik"
setzen und auf „Veröffentlichen" drücken. Vorher kommt „der Server kennt den
Automatik-Schalter noch nicht (bad_key)", danach „Ampel veröffentlicht".

Der Fehlschlag ist harmlos und benannt: die Ampel selbst geht in beiden Fällen
weiter, nur der Schalter bleibt stehen. Das ist Absicht — ein stiller Fehlschlag
wäre hier das eigentliche Problem gewesen.

---

## Danach: der Sichttest, der noch nie gelaufen ist

Weder der Schalter im Studio noch das gerechnete Band an der Karte sind je in
einem echten Browser gesehen worden. Headless sind sie belegt (476/476, 147
Sabotagen), aber das ersetzt Klaus' Lauf nicht.

**Und eine ehrliche Grenze:** kein einziger der 14 Einträge liegt derzeit unter
50 (der schlechteste hat 80). Das gerechnete Band lässt sich an echten Daten
gerade **gar nicht** auslösen. Wer es sehen will, trägt vorübergehend ein
`"unterGrenze": 3` in einen `messung`-Block in `listings.js` ein — und nimmt es
wieder heraus. Das ist kein Mangel, sondern derselbe Umstand, unter dem die
Regel aufgeschrieben wurde: sie trifft gerade niemanden.

---

## Was sonst offen liegt (alles am 2026-08-12 nachgesehen)

- **Modul 17: das Mycel-Blasen-Panel ist zu breit fürs Handy.** Nachgesehen:
  `Sage-Protokol/src/modules/17_floating_widget.js` hat auf `#sbkim-widget`
  **keine** `max-width`; die Breite kommt aus dem Inhalt, gemessen 385 px bei
  360 px Bildschirm. Der Fix gehört in den Kanon (etwa
  `width: min(385px, calc(100vw - 24px))`) und muss dann **netzweit neu kopiert**
  werden, samt Drift-Guards. Betroffen: Mein-WorkFloh, Tomys-Hub, Kimboard.
  Nachmessen mit `tools/breite-messen.mjs`.

- **`docs/PULS.md` reißt seine eigene Grenze weiter.** Nachgezählt: **9665**
  Zeilen gegen 3000 im Kopf. Drei Sitzungen haben es jetzt gemeldet und nicht
  gemacht, diese eingeschlossen — sie hat sogar noch einen Eintrag dazugelegt.
  Eigene Pflege-Runde: Älteres nach `docs/sessions/archiv/`, **nicht** kürzen,
  die Grenze **nicht** herabsetzen.

- **family hat noch keine Sperr-Knöpfe.** Nachgesehen:
  `family-project/assets/studio-markt.js` **zeigt** die Ampel (`ampelZeile`) und
  ruft `commit_wache` für Quittungen, hat aber kein `data-sperren` und kein
  `data-vorbehalt`. Der Server erlaubt sie längst für beide Marktplätze. Kurze
  Runde, wenn Klaus es dort auch will — das Muster steht in
  `pwa-toolpoint/assets/studio.js`.

- **Kim-Bell + Mein-WorkFloh sind vom Modul-23-Kanon abgedriftet.** Nachgesehen
  auf `origin/main`: beide tragen weiterhin `modules/sbkim-rendezvous-ui.js`
  statt `sbkim/23_rendezvous_ui.js`. Jeder künftige Fix geht an beiden vorbei.

- **Server-Updates** auf dem Hetzner-**Cloud**-Server (10 Sicherheits-Updates +
  ein Neustart). Von einer Sitzung aus nicht prüfbar. Klaus per
  `ssh root@<IP> '<befehl>'` — **nie** einen `apt`-Befehl geben, ohne dazuzusagen,
  dass er auf den Cloud-Server gehört und nicht ins Termux.

- **Falsche App-Adressen auf der Mycel-Karte** — aus Repo-Namen abgeleitet und
  nie wirklich abgerufen (jede Probe kam durch den Proxy mit `000` zurück).

- **Mikrofon mehrsprachig in die übrigen Apps.** Erledigt in **Kimboard**
  (PR #87) und, seit dem 2026-08-12, in **PWA Toolpoint** (PR #35, zwölf
  Sprachen, Vorauswahl aus der Geräte-Sprache, `dir="auto"`). Zu tun: dasselbe
  Muster in den übrigen Apps mit Mikrofon — **erst nachsehen, wo überhaupt eins
  verbaut ist.**
  - **Berichtigung am selben Tag, und sie gehört hierher.** Dieser Punkt stand
    in der ersten Fassung dieses Briefes noch als „nur Kimboard erledigt" da.
    Toolpoint #35 wurde gemergt, **während** ich den Brief schrieb — dieselbe
    Lehre 6 des Vorgängers („zwischen Messen und Melden liegt Zeit"), diesmal
    beim Schreiben statt beim Pushen. Gefunden habe ich es beim letzten
    `git log origin/main`, nicht beim Nachsehen der Offen-Liste. **Ein Punkt,
    den man am Anfang der Sitzung geprüft hat, ist am Ende wieder ungeprüft.**
  - **Merksatz:** die Browser-Spracherkennung hat **keine** Sprach-Erkennung.
    Sie hört genau die Sprache, die man ihr sagt.
  - **Modul 21 kennt nur de/en/ru** und ist byte-1:1 zum Kanon. Weitere Sprachen
    dort sind ein netzweiter Rollout (eigene Runde, alle Repos + Drift-Guards).

- **WorkFlohs Einrichtungs-Bildschirm ist fest deutsch verdrahtet** —
  `showSetupScreen()` ohne `T()`. Der allererste Satz, den ein Fremder sieht,
  ist damit immer deutsch. Braucht einen Schlüssel in `TR` + Übersetzungen in
  allen sieben Sprachen.

- **Ob Chromes Übersetzungs-Angebot in einer INSTALLIERTEN PWA greift** — dort
  fehlt die Adressleiste und damit der Knopf. **Ungeprüft.** Vor jeder Arbeit
  daran zuerst messen. Betrifft Kimboard, Kimseek, family-project,
  BookLedgerPro, Tomys-Hub.

- **Phase D.2 — Pilz-Wirtschaft:** drei Entscheidungen offen (EVL. ·
  Jahresbeitrag · WorkFloh-Preisform), `docs/PLAN_PILZ_WIRTSCHAFT.md`.

---

## Zwei Lehren aus dieser Sitzung

**1. Eine Filter-Zeile mit der Begründung „das wirkt ohnehin nicht" ist eine
Wette auf den heutigen Stand.** `tools/statische-listen.mjs` warf alles außer
rot und gelb weg, ausdrücklich weil „nur was etwas bewirkt" durchsollte. Das
stimmte, solange nichts gerechnet wurde. In dem Moment, in dem das automatische
Gelb entstand, bewirkte **grün** etwas — es ist die Freigabe, die genau dieses
Gelb überstimmt — und die Zeile hätte es lautlos verschluckt. Wer eine neue
Wirkung baut, sieht nach, wer bisher als wirkungslos aussortiert wurde.

**2. Ein Prüfer wird nicht „gelockert", sondern um einen Namen erweitert.** Der
Schalter brauchte einen Platz in der Datei, die die Sperren trägt. Statt die
Schlüssel-Prüfung aufzuweichen (etwa: alle Unterstrich-Namen durchlassen) kennt
`commit_wache` jetzt genau einen zusätzlichen Namen, mit eigenem, engem Prüfer
und ohne jede Ampel darin. Der Unterschied ist eine einzige Gegenprobe wert —
und die schlägt an: „jeder Unterstrich-Schlüssel kommt durch" wirft den Smoke
um.

Beide Lehren gehören zur selben Familie wie die aus dem Vorgänger-Brief: **die
Stelle, an der eine Prüfung dir recht gibt, ist die, an der du am genauesten
hinsehen musst.**

---

## Pflichtlektüre vor der Arbeit (in dieser Reihenfolge)

1. `Sage-Protokol/CLAUDE.md` — allen voran die Sitzungsstart-Pflicht: **immer
   frisch von `origin/main` abzweigen**. Und die Falle darin:
   `checkout -B <branch> origin/main` hängt den **Upstream** auf `origin/main` —
   gegen den **gleichnamigen Remote-Branch** prüfen, nicht gegen `@{upstream}`.
2. `Sage-Protokol/docs/PULS.md` — oberster Eintrag ist 2026-08-12.
3. `Sage-Protokol/docs/sessions/archiv/2026-08-12_schritt4-der-schalter.md` —
   was gebaut wurde, was geprüft ist und was ausdrücklich **nicht**.
4. **`pwa-toolpoint/docs/RAUSWURF-REGEL.md`** — vollständig, besonders
   § „Die Rangfolge" und § „Schritt 4 — der Schalter, wie er gebaut wurde".
5. `pwa-toolpoint/assets/karte.js`, Abschnitt „Die Automatik: gerechnetes Gelb"
   — dort steht, warum nichts gespeichert wird und warum die Hand gewinnt.
6. `family-project/server/marktplatz-api.php`, `wache_automatik_pruefen` und
   `commit_wache` — dort wird wirklich entschieden.

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
