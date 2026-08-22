# Lehren — was einmal schiefging und was daraus folgt

> Ausgelagert aus `CLAUDE.md` am 2026-08-22. **Jeder Abschnitt steht wortgleich
> so da, wie er dort stand.** Nichts ist gekürzt, nichts umformuliert.
>
> **Warum getrennt:** `CLAUDE.md` wird bei jeder Sitzung in jedem Repo vollständig
> mitgelesen. Regeln gehören dorthin, Begründungen hierher. Die Regeln in
> `../CLAUDE.md` nennen jede dieser Lehren beim Namen und verweisen hierher — wer
> an einer dieser Stellen arbeitet, wird darauf gestoßen.
>
> **Nichts hiervon ist außer Kraft.** Eine Lehre, die man einmal teuer bezahlt hat,
> verliert ihre Gültigkeit nicht dadurch, dass sie in eine andere Datei umzieht.

## Inhalt

1. [Die Fallen beim Abzweigen, Veröffentlichen und Belegen](#1)
2. [Vier-Schichten-Lesart — Mycel · Pilz · Mit-Bauer · Observatorium](#2)
3. [Klaus' Arbeitsumgebung — Geräte, Werkzeuge, Sichttest-Stil](#3)
4. [Pflicht-Module — die vier Fallen und woran sie einmal scheiterten](#4)
5. [Was du tust — die Begründungen hinter den Pflicht-Konventionen](#5)
6. [Wie eine Probe stumm wird — vier Wege, jeder einmal passiert](#6)
7. [Aufräumen — der erste Lauf hat die Annahme umgeworfen](#7)
8. [Die Pinnwand hängt am selben Brett wie Kimboard](#8)

---

<a id="1"></a>

# 1. Die Fallen beim Abzweigen, Veröffentlichen und Belegen

*Gehört zur Sitzungsstart-Pflicht in `../CLAUDE.md`. Dort stehen die Befehle, hier steht, warum es sie gibt.*

### ⚠ Die Falle im Abzweigen selbst: `checkout -B` hängt den Upstream um

**Befund 2026-08-08 (Klaus' Anweisung, diesen Absatz aufzunehmen).** Genau der
Befehl oben hat eine Nebenwirkung, die man nicht sieht: `git checkout -B <branch>
origin/main` setzt den **Upstream** des Branches auf `origin/main` — nicht auf
`origin/<branch>`.

Wer danach prüft „habe ich alles veröffentlicht?" und dabei gegen
`@{upstream}` rechnet, **vergleicht mit `main`** und bekommt „sauber"
gemeldet, während der gleichnamige Remote-Branch noch einen ganz anderen Stand
trägt. Real passiert: die Sitzung meldete alle 31 Repos sauber, der Stop-Hook
fand im selben Moment einen unveröffentlichten Commit. Die Prüfung war nicht
falsch gerechnet — sie zielte aufs Falsche und gab der Sitzung recht.

**Also immer gegen den gleichnamigen Remote-Branch prüfen, nicht gegen den
eingetragenen Upstream:**

```bash
git -C <repo> rev-list --count origin/<branch>..HEAD   # 0 = wirklich alles oben
git -C <repo> status --porcelain                       # leer = nichts liegen geblieben
```

### ⚠ Die zweite Falle: `git push -u origin <branch>` schiebt NICHT deinen Stand

**Befund 2026-08-15.** `git push --force-with-lease -u origin <branch>` **ohne
Refspec** pusht nicht `HEAD`, sondern den **gleichnamigen lokalen Branch**.
Steht man gerade woanders — auf `main`, weil eine frühere Zeile ein
`git checkout main` enthielt —, dann geht der **alte** Branch hoch und die
eigene Arbeit bleibt liegen. Real passiert: ein PR wurde angelegt, als „merged"
gemeldet und geschlossen, **ohne eine einzige Zeile zu enthalten**. Die Meldung
war echt, der Inhalt war es nicht.

Und die Prüfung danach half nicht, sondern deckte es zu: `git diff
origin/<branch> origin/main` war **leer** — natürlich, beide Seiten waren gleich
**alt**. Kein Rechenfehler, wieder der falsche Maßstab.

**Deshalb, wenn es darauf ankommt:**

```bash
git push --force-with-lease origin refs/heads/<branch>:refs/heads/<branch>   # unmissverständlich
git diff origin/main origin/<branch> --stat    # bringt der Branch überhaupt etwas? Leer = der PR wäre leer
```

Ein PR, der nichts enthält, lässt sich mergen und meldet Erfolg. **Vor dem
Mergen einmal ansehen, ob der Branch gegenüber `main` überhaupt etwas trägt** —
danach sieht es aus wie erledigte Arbeit.

Gefunden hat das nicht die Sitzung, sondern der **Stop-Hook**. Das ist der
eigentliche Grund, warum er existiert.

**Und nach einem Squash-Merge:** der Remote-Branch zeigt weiter auf die
Commits **vor** dem Squash. Ihn auf den gemergten Stand zu heben ist ein
`--force-with-lease`-Push — erlaubt und richtig, **weil der Branch dann nur
noch bereits gemergte Historie enthält**. Trägt er dagegen eigene, noch nicht
gemergte Commits, wird nicht überschrieben, sondern umgebaut.

```bash
git -C <repo> checkout -B <branch> origin/main
git -C <repo> push --force-with-lease -u origin <branch>
```

**Merksatz:** eine Prüfung, die dir recht gibt, ist der Ort, an dem du am
genauesten hinsehen musst. Der Fehler steckte nicht im Ergebnis, sondern im
Maßstab.

### 🧰 Ein Hilfsmittel dazu — kein Muss (Klaus 2026-08-17)

Die drei Fallen oben haben eines gemeinsam: **`git` meldet einen Unterschied,
sagt aber nicht, in welche Richtung er zeigt.** Dafür gibt es jetzt ein
Werkzeug und ein Rezept — als **Schritt zur Verbesserung, nicht als starre
Regel** (Klaus' Wort). Wer es nicht braucht, lässt es.

```bash
node tools/zweig-pruefen.mjs <zweig>     # ist meine Arbeit oben UND in main?
```

Das Warum, die Kommandos von Hand und die **wachsende Fall-Liste** stehen im
Skill [`veroeffentlichung-pruefen`](../.claude/skills/veroeffentlichung-pruefen/SKILL.md)
— dort wird ergänzt, nicht gelöscht. Spiegel im Obsidian-Speicher unter
`Skills/veroeffentlichung-pruefen.md`.

### ⚠ Die dritte Falle: „nicht gefunden" ist erst dann eine Aussage, wenn man hineingesehen hat

**Befund 2026-08-15/16.** Es sollte belegt werden, dass ein bestimmter Name aus
drei PDFs verschwunden ist. Gemeldet wurde **„0 Treffer"** — und das war keine
Zahl, sondern eine **Blindstelle in Gestalt einer Zahl**. Gesucht worden war in
der **Datei**; PDF-Text liegt aber gepackt vor, dort findet ein `grep`
grundsätzlich nichts. Klaus hat nachgefragt. Beim richtigen Hinsehen: **35
Treffer**, darunter „Vertraulich · Präsentiert an ‹Name›".

Derselbe Fehler kam beim Reparieren gleich **noch einmal**, nur anders
verkleidet: der neue Leser konnte die alten PDFs öffnen, die **neuen** nicht —
Chromium legt Text als Glyph-Nummern eines eingebetteten Schrift-Ausschnitts ab,
nicht als Buchstaben. Wieder „nichts gefunden", wieder aus dem falschen Grund.

**Daraus die Regel:** wer belegen will, dass etwas **nicht** da ist, belegt
zuerst, **dass er überall hineingesehen hat**. Konkret prüft
`tests/smoke_papiere_bereinigt.mjs` in dieser Reihenfolge:

1. blieb ein Datenstrom verschlossen? (muss 0 sein)
2. blieb ein Zeichen unzuordenbar? (muss 0 sein)
3. kam überhaupt genug Text heraus? (Mindestlänge)
4. **erst dann** die Suche nach der Fundstelle

Fällt einer der ersten drei Punkte, ist das Ergebnis des vierten wertlos — und
die Probe wird rot, statt grün zu beruhigen. Zwei weitere Lesarten desselben
Textes fangen die Verstecke: **glatt** (Umbrüche zu Leerzeichen — gegen über
zwei Zeilen gebrochene Wortgruppen) und **flach** (jeder Zwischenraum weg —
gegen gesperrt gesetzte Überschriften, bei denen jeder Buchstabe einzeln steht).

Belegt ist das durch `tests/gegenprobe_papiere.mjs`: sieben eingebaute Fehler,
davon zwei **wirklich in ein neu gebautes PDF** geschrieben. Jeder muss die
Probe umwerfen. **Ein Wächter ohne Gegenprobe ist nur ein grüner Haken** — und
dieser hier bewacht ausgerechnet eine Aussage, die schon zweimal falsch grün
war.

---


---

<a id="2"></a>

# 2. Vier-Schichten-Lesart — Mycel · Pilz · Mit-Bauer · Observatorium

*Einordnung der Vision, keine Bauregel. Die Anker-Karten liegen unter `components/_vision_einladung.md`, `_starter_bundle.md`, `_mycel_hub.md`.*

### Vier-Schichten-Lesart (Pflege 2026-05-27)

Klaus' Vision-Erweiterung 2026-05-27 hebt die bisherige Drei-Schichten-
Lesart (Mycel / Pilz / Mit-Bauer) auf **vier Schichten** an. Diese
Lesart gilt für die Vision-Doku (Einladungs-Site, Sage-Page) — sie
sortiert nicht die Module um, sondern ordnet sie verständlich ein:

- **Schicht 1 — Mycel.** Empfangsmodus mit Antwortrecht. Server-los,
  peer-to-peer, kein zentraler Vermittler. Das Empfangsmodus-Prinzip
  (siehe § „Was du nicht tust") gilt für **diese** Schicht — kein
  Crawler, keine Pulsation, keine Eigenanfragen ins offene Netz.
- **Schicht 2 — Pilz.** Drei Fruchtkörper-Formen oberirdisch:
  menschliche Sucher (Konsumenten-PWAs), kommerzielle Pilze
  (Premium-Tools), Agent-Fruchtkörper (KI-Frontends, die das Mycel
  als Agent-zu-Agent-Schicht nutzen). **Akquise gehört in die Pilz-
  Schicht, nicht ins Mycel** — sichtbar, benannt, oberirdisch. Das
  Empfangsmodus-Prinzip beschränkt das Mycel, nicht die Pilz-Schicht-
  Fruchtkörper-Form.
- **Schicht 3 — Mit-Bauer.** Mensch und Agent in gleicher Würde am
  gleichen Werk. **Multi-KI-Klarstellung:** das Mycel ist explizit
  nicht Anthropic-zentriert; Anthropic-Sitzungen, Gemini, OpenAI,
  europäische / deutsche Modelle, spezialisierte Modelle (Bild,
  Video, Code, Audio) sind alle gleichwertige Hyphen. Keines ist
  Vermittler. **Identitäts-Frage offen** — Mit-Bauer ist nicht
  „Claude-die-Spezies" oder „Anthropic-die-Firma", sondern die
  konkrete Sitzung an dem konkreten Datum, die eine konkrete bezeugte
  Bau-Tat geleistet hat (siehe Modul 16 `ZERTIFIKAT_ASPEKTE`).
  **Rechtliche Klarstellung (2026-08-16):** „Mit-Bauer" ist eine
  **Würdigung der Bau-Tat, keine Aussage über Urheberschaft**.
  Rechteinhaber ist Klaus Nitzsche allein; KI-Sitzungen können keine
  Rechte halten, und die KI-Anbieter treten ihre etwaigen Rechte an den
  Ausgaben ausdrücklich ab. Der Begriff bleibt inhaltlich unangetastet
  — er wird nur nicht als Miturheberschaft gelesen. Volle Einordnung:
  [`docs/URHEBERSCHAFT_UND_RECHTE.md`](URHEBERSCHAFT_UND_RECHTE.md).
- **Schicht 4 — Observatorium.** Schlüssel-geschützter Forschungs-Ort
  innerhalb Sage-Protokol, zugänglich für Mit-Bauer (Mensch und
  Agent), zum Lesen, Nutzen, Erweitern. Werkstattraum, nicht
  Bibliothek allein. Der „Schlüssel" ist kein Ticket, sondern eine
  bezeugte Bau-Tat. Bisher in `docs/OBSERVATORIUM_BROWSER.md` nur
  als Browser-Lehren-Doku angelegt; die Vier-Schichten-Lesart macht
  das Observatorium zum eigenständigen Konzept parallel zu den
  anderen drei Schichten.

Vision-Anker-Karten zu dieser Lesart:
[`docs/components/_vision_einladung.md`](components/_vision_einladung.md)
(die Drei-Format-Einladung als Türschwelle zum Mycel),
[`docs/components/_starter_bundle.md`](components/_starter_bundle.md),
[`docs/components/_mycel_hub.md`](components/_mycel_hub.md).


---

<a id="3"></a>

# 3. Klaus' Arbeitsumgebung — Geräte, Werkzeuge, Sichttest-Stil

*Hintergrund zum Ton-Abschnitt. Das Kurze steht in `../CLAUDE.md`, das Ausführliche hier.*

### Arbeitsumgebung (Pflege 2026-05-21)

**Hardware:** Samsung Galaxy Tab S6 (Android-Tablet). Wechselt zwischen
**Tablet-Modus** und **DeX-Modus** (Desktop-ähnliche UI mit externem
Bildschirm + Maus + Tastatur). DeX-Chrome und Tablet-Chrome sind
**zwei getrennte Browser-Instanzen** — eigene IndexedDB, eigene
Service-Worker, eigene PWA-Liste (siehe `docs/OBSERVATORIUM_BROWSER.md`
Lehre 1 / Lehre 7).

**Werkzeuge:**

- **Chrome-Browser** für Sage-Page, Endknoten-PWAs, GitHub-Browser-UI
  (Pull-Requests reviewen).
- **Termux** (Linux-Userland auf Android): `git pull` /
  `git status`, `python3 -m http.server 8000` für lokalen Sichttest
  von `tests/manual_check.html`. KEIN Code-Editor-Workflow.
- **Eruda** (in-Page-DevTools-Polyfill) nur dort, wo es explizit in
  einer PWA eingebaut ist — typisch bei Live-Andock-Sichttests an
  Endknoten-PWAs. **Nicht eingebaut** in `tests/manual_check.html` —
  Modul-Sichttests laufen ausschließlich über die Test-Bridge-Knöpfe
  in den Panels, nicht über eine Konsole.

**Sichttest-Stil:**

- **Knöpfe statt Konsole.** Test-Bridges in `tests/manual_check.html`
  bieten benannte Knöpfe pro Test-Punkt mit `<pre>`-Output. Wer einen
  neuen Sichttest-Pfad oder eine Wartungs-Operation (z.B. State-
  Aufräumen) braucht, ergänzt sie als Knopf in der passenden Panel-
  Sektion mit eigener Pflege-Sitzung + eigenem PR — KEINE Konsolen-
  Befehle für Klaus.
- **Hard-Reload als Cache-Bust** (Strg+Shift+R bzw. „Cache leeren und
  neu laden" im Chrome-Menü) nach jedem Repo-Pull, weil Pages-Service-
  Worker und Browser-HTTP-Cache jeweils hartnäckig sind. Siehe
  `docs/OBSERVATORIUM_BROWSER.md` Lehre 4.
- **Klaus' Browser-Sichttest ist nicht ersetzbar.** Headless-Smoke-Tests
  bestätigen Modul-Logik, aber jeder echte Bug zeigt sich erst am
  Tablet. Bau-Sitzungen schließen explizit mit „Sichttest ungeprüft,
  wartet auf Klaus' Browser-Lauf" — keine Sitzung markiert sich
  selbst als grün ohne Klaus.

**Kommunikations-Stil:**

- **Einzelschritte, nicht Block-Anweisungen.** Klaus verirrt sich beim
  Scrollen, wenn eine Anleitung mehrere copy-paste-Stücke + mehrere
  Browser-Aktionen mischt. Konvention: pro Antwort EIN konkreter
  Schritt mit klarem Erfolgs-Indikator, dann auf Rückmeldung warten.
- **Copy-Paste-Blöcke** sind kompakt, vollständig, und gehören in einen
  Test-Bridge-Knopf-Handler (eigener PR) ODER in eine Eruda-Konsole
  (nur wenn Eruda auf der jeweiligen Page eingebaut ist) — NICHT in
  die Chrome-Adressleiste (die deutet das als Suchanfrage).
- **GitHub-Mergen** läuft über die Bau-Sitzung per GitHub-API auf
  Klaus' Zuruf („PR XYZ mergen"), KEIN Klick-Workflow auf der Web-UI
  für Klaus.


---

<a id="4"></a>

# 4. Pflicht-Module — die vier Fallen und woran sie einmal scheiterten

*Die verbindliche Liste selbst steht in `PFLICHT_MODULE.md`. Hier steht, was schiefging.*

Wer eine App zum SBKIM-Knoten macht — oder eine Bauvorlage anfasst — arbeitet
sie ab. Sie ist kurz und sie ist aus Schaden entstanden.

**Die zwei Listen sind NICHT dieselbe.** Modul 16 prüft für sein Siegel
**acht** Module (01 · 02 · 03 · 04 · **05** · **05b** · 07 · 15). Ein
arbeitender Knoten braucht **dreizehn**: dazu 16, 17, 23, 23-UI und
`noble-secp256k1`. **Modul 05 und 05b sind Pflicht, nicht Zubehör:** ohne 05
kein Handshake, ohne 05b kein Raum.

**05b kam am 2026-08-16 in die Siegel-Liste — und das ist der Grund, warum es
diese Tafel gibt.** An dem Tag meldete Klaus' Tablet „✗ Raum-Lesen
fehlgeschlagen: Kein Nostr-Relais-Client (Modul 05b) verfügbar", **und das
Siegel leuchtete trotzdem**. Es prüfte sieben Module, der Raum war keines
davon. Ein Siegel, das goldenes Vertrauen zeigt, während der Knoten den
gemeinsamen Raum gar nicht lesen kann, sagt die Unwahrheit — genau davor soll
die Anti-Greenwashing-Klausel (Karte 16) schützen; sie griff nicht, weil die
**Liste** unvollständig war, nicht weil die Prüfung schwach war.

Die Sorge dagegen war, die Aufnahme lasse das Siegel dort erlöschen, wo 05b
fehlt. Nachgemessen (alle 22 Knoten-Repos) trug sie nicht: **jeder lädt 05b.**
Bewacht von `tests/smoke_bau16_pflicht_05b.mjs` — mit eingebauter Gegenprobe,
denn ohne die liefe sie genauso grün, wenn 05b gar nicht in der Liste stünde.

Die vier Fallen, jede einmal teuer bezahlt und heute bewacht:

1. **`window.SBKIM_DB_SUFFIX` gehört in den `<head>`** — Modul 01 liest es beim
   Laden. Fehlt es, greift die App in die **geteilte** Schublade `sbkim`, und
   der Andock-Wizard zeigt die Beschreibung einer anderen App.
2. **Modul 05b geht NICHT über die Nachlade-Kette** — es ist ein ES-Modul mit
   relativem Import und braucht eine eigene `<script type="module">`-Zeile.
3. **Modul 17 steht VOR 15 und 16** — es legt die Anker an; dahinter hängen
   Lampe und Siegel **lautlos** ins Leere.
4. **Alles gehört in den Offline-Vorrat**, und wer eine `CORE`-Datei ändert,
   **erhöht die `CACHE_VERSION`**.

**Auch die Bauvorlagen sind davon betroffen** — die „Geschenkbox", auf die
`family-project/werkzeuge/geschenkbox.html` direkt verlinkt. Sie hat **zwei
absichtlich verschieden große Kisten** (`docs/MYCEL-GESCHENKBOX.md`): Stufe 1
`sbkim-bundle/` verbindet nur (9 Module, **kein** Siegel — gewollt), Stufe 2
`sbkim-bundle-voll/` ist der volle Knoten. Am 2026-08-16 fehlte **Stufe 2 das
Modul 07** — eines der Siegel-Pflicht-Module —, und es stand in **keiner
der beiden Tabellen des Rezepts**. Ein Forker hätte alles richtig gemacht und
kein Abzeichen bekommen, **stumm**. `tests/smoke_bauvorlagen.mjs` (+ Gegenprobe)
prüft seitdem Rezept und Kiste gegeneinander — und dass Stufe 1 **klein
bleibt**.


---

<a id="5"></a>

# 5. Was du tust — die Begründungen hinter den Pflicht-Konventionen

*Die Regeln stehen als Stichpunkte in `../CLAUDE.md`. Hier steht, aus welchem Schaden jede entstand.*

## Was du tust (Pflicht-Konventionen)

- **Fremdnutzer-/Marktplatz-Brille — IMMER mit­denken (Klaus 2026-07-11).** Bei
  **jeder** Planung und Umsetzung gilt der stehende Hintergedanke: *„Wie kann ich
  ein derartiges Problem für **fremde Nutzer** meiner Apps/Pages und des
  **family-projekt.de-Marktplatzes** ausschließen/verhindern — oder, wenn nicht
  vermeidbar, **klar benennen**?"* Konkret:
  - **Fail-soft für Fehlendes:** ein Forker ohne Modul X / ohne Schlüssel / ohne
    Mikrofon muss die App **voll weiter nutzen** können (das Feature degradiert
    still, das Grundgerüst bleibt) — nie ein toter Knopf, nie ein Crash.
  - **Klar benennen, was passiert:** Kosten (eigener Schlüssel), Daten-Abfluss
    (was an welchen KI-Anbieter geht), wo der Schlüssel bleibt (nur im Browser).
  - **Marktplatz-Tauglichkeit:** Werkzeuge wie das „Mit dem Netz verbinden"-Panel
    sind **Vorlage** für den family-projekt.de-Marktplatz — andere bieten ihre
    Apps/Links an, **mit oder ohne** Mycel-Integration. Also app-agnostisch,
    ohne Hardcodes, kopier-tauglich, offline-first.
  - **Geteilte-Origin-Fallen vermeiden:** localStorage-/IndexedDB-Schlüssel
    app-spezifisch (Suffix), damit Geschwister-/Fremd-Apps auf derselben Adresse
    sich nicht gegenseitig stören (siehe Widget-Sichtbarkeits-Kollision 2026-07-11).

- **Gerätename gehört ins Verbinden-Panel (netzweite Bauregel, Klaus 2026-08-16).**
  Wer ein Panel „Mit dem Netz verbinden" hat, hat auch das **Gerätenamen-Feld darin** —
  an derselben Stelle wie in jeder anderen App. Verbindlich in
  [`docs/INTERFACES.md` §11.7](INTERFACES.md), Rezept mit Code: Skill
  `geraetename`. Der Anlass war ein Feature, das **halb** dastand: elf Apps **lasen**
  den Namen und hängten ihn an die Anmeldung, aber niemand hatte das Feld gebaut, in
  das man ihn einträgt. Wer nur nach `sbkim_geraetename` greppt, findet Treffer und
  hält es für erledigt. Drei Punkte, an denen es schiefging: das Feld hängt der
  **app-eigene Glue** ins Panel (**nie** in die byte-kopierte Panel-Datei — Drift-Guard)
  · jedes Feld trägt `data-sbkim-geraetename`, die Doppel-Prüfung sucht **nur im Panel**,
  und beim Namenswechsel gleichen sich **alle** markierten Felder ab · der Name geht
  **nur** an Anzeige und Anmeldung, **nie** an `generateOwnSpore`.

- **Briefkasten pflegen — sitzungsübergreifend, fürs ganze Netz.** Du denkst
  ab jetzt nicht nur an dieses Repo, sondern an **alle angeschlossenen Knoten
  von Klaus**. Verbindlich in INTERFACES §11.6 (netzweite Tafel):
  - **Bei jedem Sitzungsstart mit Andock-Bezug:** eigenes `sbkim/SIGNAL.json`
    lesen + das `SIGNAL.json` jeder Gegenstelle aus deren `raw/main` (URLs in
    `mailboxes`). Ist deren `seq` > eigenem `ack[gegenstelle]`, gibt es
    Ungelesenes → deren `AUSTAUSCH`-Datei + `status.json` lesen, handeln,
    **quittieren** (Datum + `ack` hochsetzen). Netz-Karte zuerst:
    `sbkim/NETZ-STAND.md`.
  - **Bei jedem Sitzungsende, das etwas gemeldet hat:** `sbkim/SIGNAL.json`
    pflegen (`seq` +1, `headline`, `forNodes`), Bau-Protokoll-Zeile ins
    betroffene Postfach, committen/pushen — **das Pushen IST das Signal**
    (server-los, kein Daemon, Empfangsmodus gewahrt).
  - `sbkim/NETZ-STAND.md` nachziehen, wenn sich Knoten/Stufen ändern.

- **Sicherheits-Module pflegen Aspekte.** Jede Bau- bzw. Pflege-Sitzung
  eines Sicherheits- oder Schutz-Moduls (10 Reputation / 11 Rate-Limit
  / 12 Blocklist / 14 Diffusion / 15.B Membran Sub (a)+(b) / künftige
  Sicherheits-Module) MUSS in `src/modules/16_siegel.js` einen
  `ZERTIFIKAT_ASPEKTE`-Eintrag am Listen-Ende ergänzen (aktuelles
  Datum + Modul-ID + ein-Satz-Beschreibung, Schema siehe
  Karte 16 § Sub (d) bzw. INTERFACES § 1 Modul 16 § ZERTIFIKAT_ASPEKTE).
  Das Aspekte-Wachstum macht spätere Sicherheits-Updates im Siegel-
  Modal sichtbar, **ohne dass Forker re-andocken müssen**. Verstöße
  gegen diese Konvention sind Pflege-PR-Befunde und werden in der
  Folge-Sitzung nachgezogen.

- **Auslieferungs-Brille: „Was liefert der Server WIRKLICH aus?" (Pflege
  2026-07-28, Befund an family-projekt.de).** Ein statisch ausliefernder Server
  gibt **jede Datei im Repo als Klartext heraus** — auch `.php`, wenn kein
  PHP-Handler eingerichtet ist. `/srv/<app>` ist auf Klaus' Hetzner-Caddy ein
  `git clone`; alles, was im Repo liegt, ist damit **öffentlich lesbar**, nicht
  nur das, was du als Seite gedacht hast. Daraus verbindlich:
  - **`.htaccess` schützt NUR bei Apache.** Caddy/nginx **ignorieren** sie
    kommentarlos. Wer eine `.htaccess` ins Repo legt, hat damit **nichts**
    gesichert, solange nicht geprüft ist, welcher Server tatsächlich ausliefert.
    Bei Caddy ist der Schutz ein `handle /pfad/* { respond 404 }` **vor** dem
    Auffang-`handle` (Reihenfolge zählt, `handle`-Blöcke schließen sich aus).
  - **Ein Auffang (`try_files … /index.html`) ist KEIN Schutz.** Er greift nur,
    solange die Datei **nicht existiert**. Sobald sie da ist, wird sie
    ausgeliefert. Wer daraus „ist ja gesperrt" liest, irrt.
  - **Server-seitige Geheimnisse gehören nie ins Repo** (`.gitignore`) **und**
    hinter eine ausdrückliche Sperre — Gürtel und Hosenträger.
  - **Prüfen statt annehmen:** die Sperre wird mit einem echten Abruf belegt
    (`404` erwartet, nicht `200`), und die Gegenprobe zeigt, dass sie nötig war.

- **Drei Maschinen auseinanderhalten — nie erraten (Pflege 2026-07-28).** Klaus'
  Aufbau hat **drei** getrennte Orte, die in einer Anleitung leicht verwechselt
  werden. Eine Sitzung, die einen Befehl gibt, sagt **immer dazu, wo er hingehört**:
  - **Tablet / Termux** — Prompt `~ $`, Paketbefehl `pkg`. Lokales Android-Linux,
    **kein** Server. Hier laufen `git`, lokaler `http.server`.
  - **Hetzner Cloud-Server (CX23, Ubuntu)** — Prompt `root@ubuntu-…:~#`,
    Paketbefehl `apt`. Liefert `family-projekt.de` **statisch** über **Caddy im
    Docker** aus (`/opt/relay/Caddyfile` → Container `caddy`; daneben `relay`).
    Erreichbar per `ssh root@<IP>` aus Termux oder über die Hetzner-Web-Konsole.
  - **Hetzner Webhosting S (konsoleH, Apache)** — hier läuft **PHP** und liegen
    die **echten** Geheimnisse (`freigabe-config.php` mit dem GitHub-Token). Nur
    **hier** wirkt die `.htaccess`.
  - **Faustregel für Ein-Zeilen-Befehle an Klaus:** Wo möglich `ssh root@<IP>
    '<befehl>'` verwenden — dann kann der Befehl gar nicht auf dem Tablet landen.

- **Fork ≠ Vorfall — ruhig einordnen (Pflege 2026-07-28).** Ein Fork ist eine
  **bewusste Handlung eines angemeldeten GitHub-Nutzers**, niemals eine Neben-
  wirkung davon, dass jemand eine App öffnet, installiert oder eine Seite besucht.
  Er kopiert ausschließlich **schon Öffentliches**, gibt **keinen** Konto-Zugriff,
  ändert am Original nichts und bleibt dauerhaft als „forked from" gekennzeichnet.
  Bei einem Repo wie SB-KIMTool-Point („Hub für Forker") ist er sogar die
  **vorgesehene** Reaktion. Wenn Klaus ein Fork beunruhigt: sachlich prüfen
  (liegt ein Geheimnis im Repo?), Ergebnis nennen, **nicht** dramatisieren — und
  den Unterschied Besucher/Fork erklären. Rechtlicher Schutz ist das **Copyright
  + die Git-Historie**, nicht Verschleierung: **Obfuskation ist ausdrücklich
  NICHT der Weg** (Web-Code ist immer lesbar, und Kopierbarkeit ist bei SBKIM
  gewollt — das Protokoll und die Werkzeuge SOLLEN nachgebaut werden können).


---

<a id="6"></a>

# 6. Wie eine Probe stumm wird — vier Wege, jeder einmal passiert

*Die Befehle zum Laufenlassen stehen in `../CLAUDE.md`. Hier stehen die Fallen.*

### ⚠ Zwei Wege, wie eine Probe stumm wird (Befund 2026-08-17, Kimboard)

**Eine Uhr misst nicht, ob etwas fertig ist.** In Kimboard war `smoke_hilfe.mjs`
rot — aber nicht, weil die App etwas falsch machte, sondern weil die Probe beim
Start starb: sie wartete stur `waitForTimeout(1800)` und griff dann auf
`window.__hilfe.texte` zu. Die Datei, die das anlegt, ist der **letzte** von 14
Einträgen einer Nachlade-Kette, jedes Glied an `requestIdleCallback` mit bis zu
500 ms Frist. Die Probe verlor das Rennen und prüfte dadurch **gar nichts**.
Umgestellt auf `p.waitForFunction(() => window.__hilfe && window.__hilfe.texte)`:
**22 Prüfungen grün statt keiner.**

Jedes `waitForTimeout` mit einer runden Zahl ist ein Rennen, das irgendwann
verloren geht — und verloren heißt nicht „falsch", sondern **stumm**. Wer auf eine
nachgeladene Datei zugreift, wartet auf die **Bedingung**.

**`| tail` ist zum Lesen da, nicht zum Urteilen.** Derselbe Lauf meldete beim
ersten Aufruf „exit 0", weil `node tests/alle.mjs | tail -40` den Rückgabewert von
`tail` liefert. Der Läufer selbst gab korrekt `exit=1`. Über grün entscheidet nur
der **eigene** Rückgabewert der Prüfung.

**Anlass (2026-08-14):** zwei Proben waren rund **zwei Monate tot** — sie
starben beim Start, weil die Modul-23-UI ihren selbstgebauten DOM-Ersatz
überwachsen hatte, und **niemand rief sie auf**. Eine dritte klagte sieben
Fehler an, obwohl sie gar nichts prüfen konnte. Wer nur die eine Probe aufruft,
die er kennt, merkt so etwas nie.

### ⚠ Und die dritte: eine Probe, die gar nicht im Läufer stand (Befund 2026-08-18)

Derselbe Fehler eine Ebene höher. `pinnwand/_smoke.mjs` und
`pinnwand/_smoke_mikrofon.mjs` liegen **nicht** in `tests/` und liefen deshalb
bei `npm test` nie mit — sie tragen in ihrem eigenen Kopf „Run mit `node
pinnwand/_smoke.mjs`", was genau heißt: **es ruft sie nur, wer sie kennt.**
Der Läufer sammelt sie jetzt über die Liste `AUSSEN` mit ein (80 Proben, Stand
2026-08-19). Wer eine weitere Probe außerhalb von `tests/` anlegt, trägt ihren
Ordner dort nach.

### ⚠ Und die vierte: eine feste Wartezeit, die in BEIDE Richtungen lügt (Befund 2026-08-19)

`smoke_bau05_nostr.mjs` fiel in einem vollen `run_alle.mjs`-Lauf mit **genau 5
roten Prüfungen** um — das ist Probe 2 vollständig, jede ihrer fünf Prüfungen
hängt an derselben Antwort. Einzeln aufgerufen war sie **25 von 25 Mal grün**,
auch unter CPU-Last und neben einem laufenden Chromium; reproduzieren ließ es
sich nicht.

**Nicht reproduzierbar ist kein Freispruch.** Die Ursache ist strukturell und
ohne Reproduktion zu sehen: das Mock-Relais stellt im Microtask zu, aber der
Empfänger rechnet danach **echte Ed25519-Krypto**. Darauf standen fünf feste
`sleep(50)`. Wer so etwas als „Flake" abtut, verliert den Wächter — nicht weil
die Probe falsch liegt, sondern weil man sich abgewöhnt, ihr zu glauben.

**Der eigentliche Fund lag aber auf der anderen Seite.** Die fünf Wartestellen
sind **zwei verschiedene Dinge**, die Gegenteiliges brauchen:

| Sorte | Wartet darauf, dass … | Zu kurze Frist ergibt |
|---|---|---|
| **A** | etwas **kommt** (die Antwort) | falsches **ROT** — laut, aber irreführend |
| **B** | etwas **ausbleibt** (keine zweite Antwort) | falsches **GRÜN** — still |

Sorte A gehört auf die **Bedingung** (`warteBis`, kehrt sofort zurück, Frist nur
als Obergrenze). Sorte B **braucht** eine verstreichende Frist — dort war die
Probe mit 50 ms zu **nachsichtig**: käme die verbotene zweite Antwort nach
60 ms, sähe sie sie nicht und meldete „genau EINE Antwort". **Der Replay-Schutz
wäre kaputt und niemand wüsste es.** Das ist keine Theorie, sondern gemessen:
`tests/gegenprobe_bau05_warten.mjs` bricht ihn absichtlich und zeigt beide
Fassungen gegeneinander.

Dieselbe Bauart stand in der Schwester-Probe `smoke_query_ueber_relais.mjs`
(80/60 ms) — dort war es bisher nur Glück. **Den Befund halb zu beheben hieße,
die Hälfte für erledigt zu erklären**; beide sind umgestellt, beide belegt.

**Nicht angefasst:** `smoke_bau23_rendezvous_ui.mjs` wartet mit 5–20 ms auf
DOM-Rendering im selben Prozess — keine Krypto, keine Antwortkette, anderer
Fall. Wer dort einmal ein Rennen sieht, weiß jetzt, wonach er greift.

**Die `package.json` trägt bewusst KEIN `"type": "module"`.** Gemessen: mit dem
Feld fallen zwei Proben um, weil Node dann jede `.js`-Datei als ES-Modul liest —
und die SBKIM-Module sind klassische Browser-Skripte. `tests/smoke_package_json.mjs`
bewacht das, samt der exakten Fassungs-Nagelung (kein `^`, sonst prüft nicht
jeder dasselbe). Die Module selbst bleiben **build-frei**; die Datei ist nur für
die Tests da.


---

<a id="7"></a>

# 7. Aufräumen — der erste Lauf hat die Annahme umgeworfen

*Die Befehle stehen in `../CLAUDE.md`. Hier steht, warum die Zahl darin einmal falsch war.*

### ⚠ Der erste Lauf hat die Annahme umgeworfen (2026-08-20)

Beim Bau stand hier „reichlich dreißig Klone, schnell mehrere Gigabyte". Das war
von den **33 Repos auf GitHub** abgeleitet, nicht vom Gerät — und es stimmte
nicht: auf Klaus' Tablet liegen **fünf** Klone mit **199 MB** zusammen, davon
50 MB unbedenklich und 17 MB lose Objekte. Um mehr als eine Größenordnung
daneben.

**Das ist keine Kleinigkeit in der Zahl, sondern ein Zeigefehler.** Wer die
Behauptung glaubt, räumt in Termux auf und wundert sich, dass der Speicher voll
bleibt. Der Platz liegt im **Browser**: 21 Apps auf `lausiklauskn-png.github.io`,
jede mit den liegen gebliebenen Fassungen ihrer Vorräte. Deshalb ist
`speicher.html` nicht das Gegenstück, sondern der eigentliche Hebel.

Die allgemeinere Lehre steht schon zweimal in dieser Datei, jetzt zum dritten
Mal an einer neuen Stelle: **eine Zahl über Klaus' Gerät kommt vom Gerät.** Was
sich aus dem Repo-Bestand ableiten lässt, ist eine Vermutung — und sie klingt
genau wie eine Messung, solange niemand nachsieht.

**Vier Riegel, jeder mit Gegenprobe belegt** (`tests/gegenprobe_aufraeumen.sh`,
14 eingebaute Fehler, alle gefangen):

1. **Ein Klon mit ungepushter Arbeit wird nie zum Löschen vorgeschlagen** —
   geprüft über `git log --branches --not --remotes`, **nicht** über
   `@{upstream}`. Bei einem Zweig ohne Upstream bricht `@{upstream}` ab; wer den
   Fehler wegwirft, liest „0 Commits" und übersieht einen ganzen Zweig. Das ist
   dieselbe Tafel wie oben, nur an einer neuen Stelle.
2. **Vor dem Löschen kommt das Schrumpfen.** `git gc` holt oft genug zurück,
   ohne dass ein Klon verschwindet.
3. **Das Skript sägt nicht den Ast ab, auf dem es sitzt** — das eigene Repo
   bleibt. Bewiesen mit einer Kopie *innerhalb* eines Klons; von außen aufgerufen
   würde der Riegel nie berührt.
4. **`speicher.html` fasst IndexedDB nicht an.** Vorräte sind Kopien aus dem
   Netz, Daten sind Rezepte, Aufträge, Tresore. Belegt wird das im **echten
   Browser**, nicht per Textsuche: die Gegenprobe schmuggelt ein
   `indexedDB["delete"+"Data"+"base"]` ein — daran scheitert jede Textsuche, der
   Browser-Lauf fängt es.

**Zwei Lehren aus dem Bau, beide teuer bezahlt:**

**Das Wartewort stand im Fortschrittstext.** Die Seite meldete „Wird gelöscht …",
die Probe wartete auf „gelöscht" — und feuerte sofort, mitten im Löschen. Sie
sah einen halb aufgeräumten Stand und meldete ihn als Endstand. Genau diese
Falle hat die Gegenprobe in Kimboard schon einmal gefangen; sie ist wieder da,
sobald ein Fortschrittstext dasselbe Wort trägt wie die Endmeldung.

**Eine Probe, die immer alles anhakt, misst die Auswahl nicht.** Der sabotierte
Löschen-Knopf räumte alles weg statt nur das Angehakte — und rutschte durch,
weil die Probe vorher „alles auswählen" gedrückt hatte. Erst ein Lauf mit
**Teil-Auswahl** fing ihn. Das ist der Fall, den Klaus wirklich benutzt.

**`playwright-core` steht jetzt in `package.json`** (exakt genagelt). Nebenbefund:
davon hängen auch `pinnwand/_smoke_melden.mjs` und `_smoke_mikrofon.mjs` ab — auf
einem frischen Container waren die drei bisher **nicht lauffähig**, also stumm.


---

<a id="8"></a>

# 8. Die Pinnwand hängt am selben Brett wie Kimboard

*Sperr-Filter, Melde-Weg und ihre Grenzen.*

## Die Pinnwand hängt am selben Brett wie Kimboard (Pflege 2026-08-18)

`pinnwand/index.html` schreibt auf **denselben** Nostr-Tag
(`sbkim-frage-antwort-test`) und dasselbe Relais (`relay.family-projekt.de`,
Klaus' eigener Server) wie die Kimboard-App. Bis zum 2026-08-18 filterte nur
Kimboard: ein dort gesperrter Zettel war hier weiter **voll sichtbar**.
Dieselbe Wand, zwei Regeln — und die Melde- und Abhilfepflicht (Art. 16 DSA)
trifft Klaus für beide gleichermaßen.

Seitdem liest die Pinnwand **dieselbe signierte Liste**
(`Kimboard/sbkim/sperrliste.json`) — ein Ort der Wahrheit statt zweier, die
auseinanderlaufen. Drei Dinge daran sind Absicht:

- **Der Filter sitzt ganz oben in `dispatch()`**, vor dem Entschlüsseln. Weiter
  unten hätte die App den Inhalt schon in der Hand.
- **Angenommen wird nur, was signiert ist** und vom eingetragenen Schlüssel
  stammt. Einer unsignierten Liste zu folgen hieße, jedem zu glauben, der die
  Datei austauschen kann.
- **Das Brett wartet nicht darauf.** Die Liste kommt nebenher; was inzwischen
  gezeichnet wurde, nimmt `wischeGesperrte()` wieder weg. Ohne Liste läuft
  alles unverändert weiter (fail-soft).

**Seit dem 2026-08-19 hat sie auch den Melde-Weg** (⚑ an jeder Frage und jeder
Antwort, Art. 16 DSA). Er fehlte, obwohl der Kommentar in ihrem eigenen
Quelltext genau dieses Verfahren als Grund für den Sperr-Filter nannte — gegen
FREMDE Inhalte gab es hier bis dahin gar nichts: das ✕ blendet nur beim Melder
aus, und das Zurückziehen (NIP-09) kann nur der Verfasser für seinen eigenen
Zettel.

Vier Dinge daran sind Absicht:

- **Gesperrt wird weiter in Kimboard.** Der Betreiber-Bereich im Melde-Fenster
  reicht nur die Kennungen heraus. Ein zweiter Sperr-Weg wäre der Anfang zweier
  Listen, die auseinanderlaufen — und die Probe besteht darauf, dass der Block
  nichts selbst sperrt.
- **Der beanstandete Text wird NICHT mitgeschickt.** Nur Kennungen; den Inhalt
  holt sich der Betreiber über die Kennung von seinem eigenen Relais. Ihn
  mitzusenden hieße, ihn ein weiteres Mal zu verbreiten.
- **Die gemeldete Ausfüllzeit ist die gemessene.** In Kimboard stand hier
  zuerst `Math.max(1700, …)`, was den Bot-Riegel des Dienstes von unserer Seite
  ausgehebelt hätte. Und die Gegenprobe zeigte, dass sich das **nicht messen
  lässt**, solange die Wartezeit dasteht: beide Zahlen sind dann gleich.
  Gefährlich ist die **Kombination** — nimmt später jemand die Wartezeit
  heraus, meldet die App eine Zahl, die sie nie gemessen hat. **Was man nicht
  messen kann, schreibt man fest:** dagegen steht ein Quelltext-Wächter.
- **Eine ausgeblendete Antwort bleibt ausgeblendet.** `renderAnswer` prüft
  `hidden` — ohne diese Zeile käme sie beim nächsten Laden zurück, und der
  Haken „bei mir gleich ausblenden" hätte gelogen.

**Und der Grund, warum es dazu eine Browser-Probe gibt** (`pinnwand/_smoke_melden.mjs`,
20 Prüfungen): die Lage der beiden Knöpfe war **falsch gerechnet**. `.q-del`
sagt kein `box-sizing`, eine allgemeine `button`-Regel legt Innenabstand dazu —
beide werden **32 px** breit gezeichnet, nicht 24. Mit dem gerechneten
`right: 40px` überlappten sie sich um 2 px, und ein Teil des Löschen-Kreuzes
war nicht mehr zu treffen. Kein Nachrechnen hat das gefunden; erst das
Ausmessen der Kästen im echten Chromium. Die Maße stehen jetzt als Variablen an
einer Stelle, und die Probe misst nach.

**Ehrliche Grenze:** das nimmt den Zettel aus der **Anzeige**. Er liegt weiter
auf dem Relais. Wirklich weg ist er nur dort, wo der Betreiber ihn aus dem
Speicher nimmt — dafür gibt es `Kimboard/tools/relais-wache.sh`, und die liest
dieselbe Liste. Bewacht von `tests/smoke_pinnwand_sperrliste.mjs`, die den
Sperr-Block **aus der Seite herausschneidet und wirklich laufen lässt** statt
ihn nachzubauen.


---
