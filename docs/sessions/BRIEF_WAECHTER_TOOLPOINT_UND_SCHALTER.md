# Brief — Wächter für Toolpoint (Schritt 3), der Schalter (Schritt 4), und was sonst offen liegt

**Geschrieben 2026-08-11** am Ende der Sitzung „Mycel-Blase / Rauswurf-Regel".
Adressat: die nächste Sitzung. Klaus liest zuerst den Chat — der Codeblock unten
steht deshalb auch dort.

---

## Stand — was seit dem 2026-08-09 fertig wurde

| Was | Stand |
|---|---|
| **Eigener Raum je Marktplatz** (additives Etikett, künftige Marktplätze bekommen je eins) | ✅ gebaut |
| **Relais bei Hetzner** (DNS → Caddy → Zertifikat → NIP-11 belegt) | ✅ läuft |
| **Meilenstein-Bilder** in der Sage-Page (Sackgasse aus `display:none` + lazy) | ✅ gelöst |
| **Mycel-Karte** in Sage (Relais + Doppelklick auf die Pillen; eingebettete Kopie lief seit dem 8. Juli auf altem Stand) | ✅ nachgezogen |
| **`marktplatz-api.php` + `einreichung.php`** neu ausgeliefert, nachdem die beiden vertauscht worden waren | ✅ Klaus hat eingefügt |
| **Melde-Kette zum ersten Mal ganz belegt** (Knopf → Formular → Warteschlange → Mail → Studio) | ✅ belegt |
| **Rauswurf-Regel** — Klaus' Entscheid schriftlich | ✅ `pwa-toolpoint/docs/RAUSWURF-REGEL.md` |
| **Schritt 1** Meldungen nach Eintrag gruppieren, mit Zähler | ✅ |
| **Schritt 2** Messwert neben der Beschwerde, samt „N. Messung in Folge unter 50" | ✅ |
| **Messwerte ausgeschrieben** („Leistung" statt „Leis") | ✅ |
| **Mycel-Blase: der lange schmale Kasten auf dem Handy** | ✅ gelöst, **Klaus' Sichttest 2026-08-11 positiv** |

Die Blase war eine Kaskaden-Kollision: `#sbkim-rdv-btn[data-ecke-unten="1"]
{bottom:78px !important}` schlug das inline gesetzte `bottom:auto`, also galten
`top` UND `bottom` zugleich. `applyPos` nimmt das Merkmal jetzt ab. Gemessen im
echten Chromium: 88 × 662 px vorher, 88 × 33 px nachher. Elf Repos byte-1:1.

---

## FOKUS 1 — Schritt 3: den Wächter nach Toolpoint holen

**Klaus hat das ausdrücklich gewählt** (Auswahl „Toolpoint — Wächter dorthin
holen") und den heiklen Teil vorab entschieden:

> **Sperren aus dem Studio erlaubt, entsperren nur in der Datei.**
> Ein Fehlgriff sperrt dann höchstens zu viel, und das fällt auf.
> Andersherum wäre es still.

### Was schon steht — nicht neu bauen, erst nachsehen

- **family-project hat den Wächter bereits vollständig**: Ampel auf der Karte
  (`markt.html`), `assets/config/wache-hand.json`, Studio-Knöpfe in
  `assets/studio-markt.js`, und die Aktion **`commit_wache`** in
  `server/marktplatz-api.php`. Das ist die Vorlage — abschreiben, nicht neu
  erfinden.
- **`marktplatz-api.php` bedient beide Marktplätze über das Feld `ziel`**
  (`family` / `toolpoint`, `array_merge` mit dem `ziele`-Block). `commit_wache`
  läuft dadurch **ohne Code-Änderung** auch für Toolpoint: der `ziele.toolpoint`-
  Block trägt kein eigenes `wache_path`, also greift der Vorgabewert
  `assets/config/wache-hand.json` — und der ist in PWA-Toolpoint derselbe Ort.
  **Prüfen, nicht annehmen.**
- **`freigabe-config.php` auf Klaus' Apache ist fertig** (am 2026-08-11 im Bild
  bestätigt, Zeilen 41–52): `ziele.family` + `ziele.toolpoint`, richtige
  Repo-Namen, richtige Marker; `allow_origins` enthält `pwa-toolpoint.de`.
  **Da ist nichts mehr einzufügen.**
- **Toolpoint hat ein eigenes Studio** (`assets/studio.js`, `var ZIEL =
  "toolpoint"`), das gegen dieselbe API spricht. Nicht mit family's
  `studio-markt.js` verwechseln.

### Was zu bauen ist

1. **`pwa-toolpoint/assets/config/wache-hand.json`** — selbst-anlegend, nach
   family's Muster. Fehlt sie, muss die Karte trotzdem laufen (fail-soft).
2. **Ampel auf der Karte** — `pwa-toolpoint/assets/karte.js`. In family sind es
   rund 22 Stellen in `markt.html`; hier ist die Karte ausgelagert, das dürfte
   kürzer werden. **Ausgeschriebene Worte, keine Abkürzungen** (Klaus'
   ausdrückliche Regel vom 2026-08-11: „Leistungen", nicht „Leis").
3. **Studio-Knöpfe** in `pwa-toolpoint/assets/studio.js` → `commit_wache` mit
   `ziel: "toolpoint"`.
4. **Den Riegel lockern** in `family-project/server/marktplatz-api.php`. Heute
   steht dort ausdrücklich: *„ampel, grund und alles andere dürfen nur
   BYTEGLEICH durchgereicht werden. Eine Sperre soll niemand aus dem Browser
   setzen oder lösen."* Neu: **setzen ja, lösen nein.**
   - Der Kommentar dort ist **verbindlich** und muss mitgeändert werden — nicht
     nur der Code. Er trägt bereits einen ehrlichen Nachtrag vom 2026-08-09
     („hier stand vorher etwas Falsches"); dieselbe Ehrlichkeit gilt weiter.
   - `$vorhanden` (die Fassung aus dem Repo) ist schon da und wird verglichen.
     Der Vergleich ist die Stelle, an der die neue Regel hängt.
   - **fail-closed bleibt fail-closed**: fällt der Abruf von `$vorhanden` aus,
     gilt wieder die strenge alte Regel. Niemals fail-open.
5. **Klaus bekommt `marktplatz-api.php` als vollständigen Copy-Paste-Block** —
   Dateiname groß und deutlich obendrüber. **Beide Dateien nie zusammen
   ausgeben, ohne die dritte Zeile zur Unterscheidung zu nennen** (am 2026-08-11
   ist genau das schiefgegangen: `marktplatz-api.php` landete in
   `einreichung.php` und das Einreichformular war kaputt).

### Was die Automatik NIEMALS darf (aus der Regel, wörtlich)

1. **Rot setzen** — nicht bei Meldungen, nicht bei Messwerten, nie.
2. **Rot lösen** — eine gesetzte Sperre nimmt nur die Hand zurück.
3. **Über den kriminellen Fall entscheiden** — da gibt es nichts zu rechnen.
4. **Still handeln** — jede Schaltung trägt Datum und Grund, sichtbar im Studio.

Der Satz, aus dem alles folgt: **„Es wird nicht automatisch rausgeschmissen. Es
wird automatisch zur Prüfung gegeben."**

---

## FOKUS 2 — Schritt 4: der Schalter

Klaus: *„Für mich muss das im Studio eh umschaltbar sein … sodass ich entscheiden
kann, ob ich das automatisiere oder ob ich das händisch mache."*

| Stellung | Was passiert |
|---|---|
| **Von Hand** (Start) | Das Studio **zeigt** nur: „4 Meldungen · Leistung 42, dritte Nacht unter 50". Klaus drückt. |
| **Automatik** | Dieselben Regeln legen selbst auf den Prüfstapel und setzen gelb. **Rot bleibt Hand.** |

Daneben die drei Schwellen, änderbar: **50** (Grenze) · **3** (Nächte bis gelb) ·
**4** (Meldungen bis Prüfstapel). Wer sie dreht, trägt sie in
`docs/RAUSWURF-REGEL.md` nach — sie stehen an drei Stellen und ein Wächter im
Smoke hält zwei davon zusammen.

Weil die Anzeige in beiden Stellungen identisch ist, kostet der Schalter fast
nichts und ist jederzeit zurückdrehbar.

---

## Was sonst offen liegt (Gesamtkonzept)

### Kurz und konkret

- **Server-Updates.** Auf dem Hetzner-Cloud-Server (CX23, Ubuntu) liegen
  10 Sicherheits-Updates und ein ausstehender Neustart. Klaus per
  `ssh root@<IP> '<befehl>'` führen — **nie** einen `apt`-Befehl geben, ohne
  dazuzusagen, dass er auf den Cloud-Server gehört und nicht ins Termux.
- **Kim-Bell + Mein-WorkFloh sind vom Modul-23-Kanon abgedriftet.** Beide fahren
  `modules/sbkim-rendezvous-ui.js` (1469 Zeilen) statt
  `sbkim/23_rendezvous_ui.js` (rund 2160). Der Handy-Fehler von heute steckt dort
  **nicht** drin — der Regel fehlt es ganz. Aber die Drift bedeutet: jeder
  künftige Fix geht an diesen beiden vorbei. Eigene Runde wert, tut heute nicht
  weh.
- **Falsche App-Adressen auf der Mycel-Karte.** Das Adressbuch wurde aus
  Repo-Namen abgeleitet und konnte nicht überprüft werden — jede Probe lief
  durch den Proxy und kam mit `000` zurück. Das ist **kein Beweis, dass die
  Adressen stimmen.** Wer es angeht, braucht einen Weg, der wirklich abruft.
- **Meldungen-Block für family** (das Gegenstück zu Schritt 1+2 auf der
  family-Seite). Klaus' Entscheidung, ob nötig — Toolpoint hat ihn, family
  bisher nicht.
- **`docs/PULS.md` hat seine eigene Grenze längst gerissen** — Befund vom
  2026-08-11: die Datei nennt im Kopf **3000 Zeilen** als Obergrenze und steht
  bei **rund 9560**. Die Klausel sagt ausdrücklich, was dann zu tun ist:
  *„Älteres ins Archiv auslagern, nicht kürzen"* — und: die Grenze **nicht**
  herabsetzen, auch nicht zum Token-Sparen. Also gehören ältere Sitzungs-Zeilen
  nach `docs/sessions/archiv/`, so wie es am 2026-05-15 und am 24.07. schon
  einmal gemacht wurde (4758 → 426 Zeilen). Das ist eine eigene Pflege-Runde;
  diese Sitzung hat es **nicht** gemacht und sagt es deshalb hier. Wer die
  Datei liest, verbrennt sonst bei jedem Sitzungsstart Kontext für Einträge
  aus dem Mai.

### Längerfristig (aus `docs/PLAN_SEMANTIK_KRYPTO.md`)

- **A3 — Medium-Härtung.** Die Rest-Grenze der Cross-Knoten-Q&A: der antwortende
  Tab muss vorn und wach sein (Hintergrund-Drosselung).
- **A11 · A15 · A18** — Marktplatz-Kopplung Modul 22 ↔ 23 · Zwei-Stufen-Verbinden
  (stöbern anonym ↔ voll mitmachen) · Siegel-Andock-Wizard netzweit.
- **B4 · B6** — Widget-Tresor (sicherheits-sensibel, eigene Sitzung) · E2E Grad C
  „versiegelter Umschlag" (Pseudonymisierung, Modul 25, ist Grad B und liegt).
- **Phase D.2 — Pilz-Wirtschaft.** Papier liegt
  (`docs/PLAN_PILZ_WIRTSCHAFT.md`), drei Entscheidungen offen: **Everlast** ·
  **Jahresbeitrag** · **WorkFloh-Preisform**. Der Messwert dort: **0 fremde
  Marktplatz-Einträge trotz gratis** — daraus die Umkehrung, dass der Marktplatz
  Beweisstück ist, nicht Provisions-Maschine.

---

## Zwei Lehren aus dieser Sitzung, die nicht verloren gehen dürfen

**1. Ein Wächter, der den eigenen Text liest, ist blind.** Zweimal ist genau das
passiert: eine Prüfung „sperrt nichts" traf meinen eigenen Erklärtext, und eine
Tipp/Zug-Prüfung blieb grün, als die Rechnung durch `true` ersetzt wurde. Ein
Wächter prüft die **Tat** — die Rechnung, den Zustand danach — nie den Wortlaut.
**Und zu jedem Wächter gehört eine Sabotage-Probe:** Fix entfernen, sehen, dass
er rot wird. Ohne diese Probe weiß niemand, ob er überhaupt etwas hält.

**2. Miss nicht die Größe, von der du erwartest, dass sie falsch ist.** Der
Beweis der ersten Blasen-Runde maß nur die **Breite** und nie die Höhe — obwohl
Klaus von Anfang an „langer Container" gesagt hat. Und die letzte Probe löschte
die gemerkte Position, womit der Fehler gar nicht auftreten **konnte**. Beides
gab der Sitzung recht, und beides war falsch. **Eine Prüfung, die dir recht gibt,
ist der Ort, an dem du am genauesten hinsehen musst.**

---

## Pflichtlektüre vor der Arbeit (in dieser Reihenfolge)

1. `Sage-Protokol/CLAUDE.md` — allen voran die Sitzungsstart-Pflicht: **immer
   frisch von `origin/main` abzweigen**, nie auf dem vorgefundenen Klon urteilen.
   Und die Falle darin: `checkout -B <branch> origin/main` hängt den **Upstream**
   auf `origin/main` — gegen den **gleichnamigen Remote-Branch** prüfen, nicht
   gegen `@{upstream}`.
2. `Sage-Protokol/docs/PULS.md` — Stand.
3. **`pwa-toolpoint/docs/RAUSWURF-REGEL.md`** — die Regel, um die es geht.
   Vollständig lesen, nicht überfliegen.
4. `family-project/server/marktplatz-api.php`, Abschnitt `commit_wache` — die
   bestehende Sperre und ihr Nachtrag vom 2026-08-09.
5. `family-project/markt.html` + `assets/studio-markt.js` — die Vorlage.
6. `pwa-toolpoint/assets/karte.js` + `assets/studio.js` — das Ziel.

## Die drei Maschinen — nie erraten

- **Tablet / Termux** — Prompt `~ $`, Paketbefehl `pkg`. Kein Server.
- **Hetzner Cloud (CX23, Ubuntu)** — Prompt `root@ubuntu-…:~#`, `apt`. Caddy im
  Docker unter `/opt/relay/`, liefert `family-projekt.de` statisch aus.
  `caddy reload` (prüft, behält bei Fehler die alte Konfig), **nicht** `restart`.
- **Hetzner Webhosting S (konsoleH, Apache)** — hier läuft **PHP**, hier liegt
  `freigabe-config.php` mit dem Token, hier wirkt die `.htaccess`.

## Kommunikation mit Klaus

Kein Programmierer, lernbereit, Antworten auf **Deutsch**. **Ein Schritt pro
Antwort** mit klarem Erfolgsmerkmal, dann auf Rückmeldung warten. **Keine
Terminal-Befehle** außer als fertige `ssh root@<IP> '…'`-Einzeiler, die gar nicht
auf dem Tablet landen können. Copy-Paste-Blöcke: **Dateiname groß darüber**, und
bei mehreren Dateien eine Kennzeile zur Unterscheidung.

**Freibrief gilt** (siehe `CLAUDE.md` § Freibrief): selbstständig bauen, merken
und die **eigenen** PRs mergen, wenn es logisch, getestet und abgegrenzt ist —
ohne auf „X mergen" zu warten. Grenze bleibt das echte Zweifeln. Nie
stillschweigend: jede Entscheidung wird dokumentiert.

## Abschluss-Befehl (die Kette reißt nie ab)

Am Sitzungsende: `PULS.md` fortschreiben · Übergabeprotokoll in
`docs/sessions/archiv/YYYY-MM-DD_<thema>.md` · Commit + Push · **„Nächste
Schritte"-Block direkt in der Chat-Antwort** (2–4 Punkte, je ein Satz
Begründung) · **neuen Brief schreiben und vollständig als Codeblock im Chat
ausgeben.**
