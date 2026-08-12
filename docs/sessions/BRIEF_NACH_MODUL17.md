# Brief — nach Modul 17: was gemessen ist, was noch auf Klaus wartet

**Geschrieben 2026-08-12** am Ende der Sitzung „Modul 17: schmale Handys".
Adressat: die nächste Sitzung. Klaus liest zuerst den Chat — dieser Brief steht
deshalb auch dort als Codeblock.

> **Dieser Brief löst `BRIEF_NACH_SCHALTER.md` ab.** Der alte bleibt als Historie
> liegen. Jeder Punkt seiner Offen-Liste ist am 2026-08-12 neu nachgesehen
> worden. Wer ihn weiterreicht, sieht ihn wieder neu nach — **ein Punkt, den man
> am Anfang der Sitzung geprüft hat, ist am Ende wieder ungeprüft.**

---

## Stand — Modul 17 ist netzweit behoben

Die Blase (Modul 17) hing auf schmalen Handys halb aus dem Bild. Behoben, in
**15 Repos byte-1:1 gemergt**, Kanon-sha `dd3e0d7fb596`.

| Fenster | vorher | nachher |
|---|---|---|
| 320 px | 385 px — **81 px links abgeschnitten** | 227 px |
| 360 px | 385 px — **41 px links abgeschnitten** | 227 px |
| 412 px | 385 px, passt | 385 px, unverändert **mit** Wörtern |

Unter 400 px tragen die Lampen keine Wörter mehr (Klaus' Entscheid gegen zwei
gemessene Alternativen). Ab 400 px bleibt alles wie bisher. Details, Gegenproben
und die zwei Fallen im Fix: `docs/sessions/archiv/2026-08-12_modul-17-schmale-handys.md`.

**Neu im Werkzeugkasten:** `tools/widget-breite-messen.mjs` misst ein Modul in
Reinform, ohne dass eine App drumherum stehen muss. Aufruf:

```
PW_CORE=/tmp/pw/node_modules/playwright-core/index.js \
  node tools/widget-breite-messen.mjs src/modules/17_floating_widget.js
```

---

## FOKUS — zwei Dinge warten auf Klaus, nicht auf eine Sitzung

**1. Der Sichttest am Handy.** Die schmale Ansicht ist nie in einem echten
Browser gesehen worden. Zu prüfen: passt die Pille ins Bild · stehen die Lampen
ohne Wörter · öffnet Antippen weiter die Fenster · lässt sie sich noch klein
machen (Minus-Knopf). Headless ersetzt das nicht.

**2. Der Handgriff auf dem Webhosting, weiterhin offen.**
`family-project/server/marktplatz-api.php` muss aufs **Hetzner-Webhosting**
(konsoleH, Apache — nicht der Cloud-Server, nicht Termux). Am 2026-08-12 ist beim
Hochladen versehentlich der **Brieftext** in die Datei geraten; die richtige
Fassung wurde Klaus als Datei **und** als vollständiger Copy-Paste-Block
geschickt. Ob sie oben ist, weiß nur er — **fragen, bevor du etwas daran baust.**

Nicht anfassen dabei: `freigabe-config.php` (Token) und `warteschlange.jsonl`
(Einsendungen). Erfolgsmerkmal: im Studio „Vom Server holen" bringt die
Warteschlange zurück; danach Haken **Automatik** + **Veröffentlichen** → „Ampel
veröffentlicht" statt „bad_key".

---

## Was sonst offen liegt (2026-08-12 nachgesehen)

- **`sbkim-bundle-voll` Modul 15 + 16 sind vom Kanon abgedriftet.** Neu gefunden
  beim Modul-17-Rollout: `15_membran.js` (261 Zeilen) und `16_siegel.js` (6
  Zeilen) fehlt die Pflege vom 2026-08-01. `smoke_vollbundle.mjs` steht deshalb
  bei 44 ok / 2 fail — **vorbestehend**, Gegenprobe auf blankem `origin/main`
  zeigt dasselbe. Kurze Runde: byte-1:1 neu kopieren, Smoke muss 46/46 werden.

- **`docs/PULS.md` bei 9961 Zeilen gegen 3000.** Vierte Sitzung, die es meldet,
  und jede legt einen Eintrag dazu. Eigene Pflege-Runde: Älteres nach
  `docs/sessions/archiv/`, **nicht** kürzen, die Grenze **nicht** herabsetzen.

- **family hat noch keine Sperr-Knöpfe.** `family-project/assets/studio-markt.js`
  **zeigt** die Ampel und quittiert, hat aber kein `data-sperren`/`data-vorbehalt`.
  Der Server erlaubt beides längst für beide Marktplätze. Muster steht in
  `pwa-toolpoint/assets/studio.js`.

- **Kim-Bell + Mein-WorkFloh sind vom Modul-23-Kanon abgedriftet** — beide tragen
  `modules/sbkim-rendezvous-ui.js` statt `sbkim/23_rendezvous_ui.js`. *(Beim
  Modul-17-Rollout mitgeprüft: bei **Modul 17** war dort nichts abgedriftet, nur
  der Dateiname weicht ab — `modules/sbkim-floating-widget.js`, Inhalt byte-1:1.
  Der Modul-23-Befund steht davon unberührt.)*

- **Server-Updates** auf dem Hetzner-**Cloud**-Server (10 Sicherheits-Updates +
  Neustart). Von einer Sitzung nicht prüfbar. Klaus per `ssh root@<IP> '<befehl>'`
  — **nie** einen `apt`-Befehl geben, ohne dazuzusagen, dass er auf den
  Cloud-Server gehört und nicht ins Termux.

- **Falsche App-Adressen auf der Mycel-Karte** — aus Repo-Namen abgeleitet, nie
  wirklich abgerufen. *(Der Proxy dieser Umgebung gibt auf externe Abrufe `403`
  bzw. `000` zurück — auch am 2026-08-12 wieder bestätigt. Von hier aus nicht
  prüfbar.)*

- **Mikrofon mehrsprachig in den übrigen Apps.** Erledigt in Kimboard (#87),
  PWA Toolpoint (#35) und, seit dem 2026-08-12, netzweit im Kanon (Sage #836/#837
  — Modul 21/23). Zu tun: nachsehen, welche App noch ein eigenes Mikrofon-Feld
  hat, das nicht über den Kanon läuft.

- **WorkFlohs Einrichtungs-Bildschirm ist fest deutsch verdrahtet**
  (`showSetupScreen()` ohne `T()`). Der erste Satz, den ein Fremder sieht, ist
  damit immer deutsch. Braucht einen Schlüssel in `TR` + sieben Übersetzungen.

- **Ob Chromes Übersetzungs-Angebot in einer INSTALLIERTEN PWA greift** — dort
  fehlt die Adressleiste. **Ungeprüft.** Erst messen, dann bauen.

- **Phase D.2 — Pilz-Wirtschaft:** drei Entscheidungen offen (Everlast ·
  Jahresbeitrag · WorkFloh-Preisform), `docs/PLAN_PILZ_WIRTSCHAFT.md`.

---

## Drei Lehren aus dieser Sitzung

**1. Die Messung gab zu früh Entwarnung.** Der erste Aufbau meldete 274 px —
„passt". Zwei Fehler steckten darin, **beide in der Messung, nicht im Modul**:
der SIEGEL-Slot mountet nur bei echtem `SbkimSiegel.isCertified()`
(Anti-Greenwashing, 111 px fehlten), und die Messseite setzte eine eigene
Grundschrift, während alle Maße im Modul `rem` sind. Hätte ich den ersten Wert
geglaubt, wäre die Antwort „passt doch" gewesen — und Klaus hätte weiter auf eine
abgeschnittene Leiste gesehen. *Nicht das Ergebnis war falsch gerechnet, der
Aufbau maß das Falsche.*

**2. Der naheliegende Griff war der falsche, und das Modul sagte es selbst.**
Gegen die zu kleine Trefferfläche wäre `min-width` das Erste, was man tippt.
Genau dort steht im minimierten Zustand `max-width: 0`, damit die Slots hinter
SIEGEL zusammenschieben — ein `min-width` hätte das lautlos gebrochen. Der
Kommentar an der Stelle warnte ausdrücklich davor. **Vor dem Ändern die
Begründung daneben lesen, nicht nur die Regel.**

**3. Ein Brief nennt selten alle Träger.** Der Vorgänger nannte drei betroffene
Apps und keine Pins. Es waren **15 Träger und 5 sha-Pins** — gefunden per `grep`
über alle Repos, nicht durch Abschreiben. Dazu **6 Service-Worker-Caches**, die
niemand erwähnt hatte: ohne Bump liefert der Offline-Vorrat die alte Fassung
weiter, und der Rollout meldet grün, während sich am Tablet nichts ändert.

---

## Pflichtlektüre vor der Arbeit (in dieser Reihenfolge)

1. `Sage-Protokol/CLAUDE.md` — allen voran die Sitzungsstart-Pflicht: **immer
   frisch von `origin/main` abzweigen**. Und die Falle darin:
   `checkout -B <branch> origin/main` hängt den **Upstream** auf `origin/main` —
   gegen den **gleichnamigen Remote-Branch** prüfen, nicht gegen `@{upstream}`.
2. `Sage-Protokol/docs/PULS.md` — oberster Eintrag ist 2026-08-12.
3. `docs/sessions/archiv/2026-08-12_modul-17-schmale-handys.md`.
4. Bei einem netzweiten Rollout: das Rezept **`netzweiter-modul-rollout`**
   (Skill). Es hat in dieser Sitzung drei Fallen abgefangen, die sonst
   durchgerutscht wären.
5. Nur die Karte + den Code des Moduls, an dem du arbeitest.

## Die drei Maschinen — nie erraten

- **Tablet / Termux** — Prompt `~ $`, `pkg`. Kein Server.
- **Hetzner Cloud (CX23, Ubuntu)** — Prompt `root@ubuntu-…:~#`, `apt`. Caddy im
  Docker unter `/opt/relay/`, liefert `family-projekt.de` statisch aus.
  `caddy reload`, **nicht** `restart`.
- **Hetzner Webhosting S (konsoleH, Apache)** — hier läuft **PHP**, hier liegt
  `freigabe-config.php`, **hier gehört `marktplatz-api.php` hin.**

## Kommunikation mit Klaus

Kein Programmierer, lernbereit, Antworten auf **Deutsch**. **Ein Schritt pro
Antwort** mit klarem Erfolgsmerkmal, dann auf Rückmeldung warten. **Keine
Terminal-Befehle** außer als fertige `ssh root@<IP> '…'`-Einzeiler. Copy-Paste-
Blöcke: **Dateiname groß darüber**. Steht eine Entscheidung an, die eine frühere
ausdrückliche Klaus-Festlegung berührt (wie hier die Wörter an den Lampen), wird
**gefragt** — und zwar mit gemessenen Zahlen, nicht mit Meinungen.

**Freibrief gilt** (`CLAUDE.md` § Freibrief): selbstständig bauen, merken und die
**eigenen** PRs mergen, wenn es logisch, getestet und abgegrenzt ist. Grenze
bleibt das echte Zweifeln. Nie stillschweigend.

## Abschluss-Befehl (die Kette reißt nie ab)

Am Sitzungsende: `PULS.md` fortschreiben · Übergabeprotokoll in
`docs/sessions/archiv/YYYY-MM-DD_<thema>.md` · `sbkim/SIGNAL.json` `seq` +1 +
Headline + history (das Pushen **ist** das Signal, §11.6) · Commit + Push ·
**„Nächste Schritte"-Block direkt in der Chat-Antwort** · **neuen Brief schreiben
und vollständig als Codeblock im Chat ausgeben.**

**Und vor dem Melden noch einmal `git log origin/main`** der betroffenen Repos —
zwischen Messen und Melden liegt Zeit. In dieser Sitzung ist `origin/main`
zwischen dem ersten Blick und dem ersten Commit um zwei PRs weitergelaufen.
