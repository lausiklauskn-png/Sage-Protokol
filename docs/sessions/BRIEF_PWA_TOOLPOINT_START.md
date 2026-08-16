# BRIEF für die nächste Sitzung — Stufe 0 (Stand 2026-08-09, abends)

**Freibrief gilt** (`CLAUDE.md` § Freibrief, netzweit): eigenständig bauen, eigene
PRs selbst mergen, wenn getestet, abgegrenzt und nicht architektonisch
zweifelhaft; bei echtem Zweifel erst Klaus fragen; **nie stillschweigend**
(Commit + PULS dokumentieren).

---

## Pflichtlektüre — in dieser Reihenfolge, vor dem ersten Handgriff

1. `Sage-Protokol/CLAUDE.md` — die Verfassung. Besonders § Sitzungsstart-Pflicht
   (immer frisch von `origin/main`), § Freibrief, § Tafel-Evolutions-Klausel,
   § Fremdnutzer-/Marktplatz-Brille, § Auslieferungs-Brille.
2. **`Sage-Protokol/docs/PLAN_PILZ_WIRTSCHAFT.md`** — das Wirtschafts-Papier.
   Besonders **§ 8b** (was der offene Markt ist), **§ 8b1** (warum eigenes
   Repo), **§ 8c1** (Relais), **§ 8d** (der langsame Start), **§ 12** (was nicht
   gebaut wird), **§ 13** (rechtliche Punkte).
3. `Sage-Protokol/docs/PULS.md` — oberster Eintrag.
4. **Diesen Brief.**
5. `family-project/docs/BRIEF_UEBERGABE_2026-08-09_PLANMODUS.md`, Abschnitt 3
   und 4 — die zehn Lehren aus Fehlern und die Arbeitsweise mit Klaus.

Erst dann Code. Nicht lesen, was nicht gebraucht wird.

---

## Wo wir stehen

- **Kein Geld ist geflossen.** Nur ein Spenden-Hinweis. Über Beteiligungen wird
  **in einer Woche** zum ersten Mal gesprochen.
- **Das Wirtschafts-Papier steht** (Sage #803–#810, acht Durchgänge).
- **Drei Bauten sind erledigt:** Alis-Moderaum #37 (Sicherungs-Erinnerung),
  #38 (Service-Worker — App läuft ohne Internet), family-project #254 (kurzer
  Weg zur Anfrage).
- **Klaus legt das neue Repo für den offenen Markt selbst an.** **Angelegt: `PWA-Toolpoint`.** SB-KIMTool-Point wird **nicht** umbenannt (191 Verweise in
  fünf Repos, signierte Spore auf der alten Adresse).

---

## Aufgabe 0 — Alis zieht auf ihre eigene Adresse *(zuerst, und mit Sorgfalt)*

**Stand 2026-08-09:** Alis hat **`alis-moderaum.de` und `.com` bereits gesichert
und bezahlt.** Der Umzug von `lausiklauskn-png.github.io/Alis-Moderaum/` auf die
eigene Adresse steht damit an. Der GitHub-Token ist geklärt (Klaus).

**Der Umzug ist technisch klein — eine `CNAME`-Datei plus DNS. Die Falle liegt
woanders, und sie ist ernst:**

> **Eine neue Adresse ist für den Browser eine neue Welt.** IndexedDB und
> localStorage hängen am Ursprung. Nach dem Wechsel steht Alis vor einer
> **leeren** Warenwirtschaft — Artikel, Bewegungen, Kategorien, Shop-Inhalte,
> alles bleibt auf der alten Adresse zurück.

**Geprüft, was genau betroffen ist:**

| | |
|---|---|
| **In der Sicherung enthalten** (kommt mit) | `articles`, `movements`, `categories`, `images`, `alm_products`, `alm_labels`, `alm_styles`, `alm_theme`, `alm_lang` |
| **NICHT enthalten** (muss von Hand neu) | `alm_pp_clientid` + `alm_pp_mode` (**PayPal**), `alm_gh_repo` + `sbbild_gh_token` (**GitHub-Verbindung**), `alm_bon_no` (**Bon-Nummer**) |

**Die sichere Reihenfolge — nicht abkürzen:**

1. **Komplett-Backup ziehen** und die Datei sicher ablegen (nicht nur im
   Download-Ordner). Der neue Sicherungs-Hinweis im Kopf sagt, wie alt die
   letzte Sicherung ist.
2. **Bon-Nummer notieren** (`alm_bon_no`), damit die Zählung nicht bei 1 neu
   anfängt.
3. Adresse umstellen: `CNAME`-Datei ins Repo, DNS beim Anbieter, HTTPS abwarten.
4. **Auf der neuen Adresse: Backup einspielen.**
5. **PayPal-Kennung und GitHub-Verbindung neu eintragen** — die kommen nicht mit.
6. Ist die App auf dem Tablet **installiert**, muss sie von der neuen Adresse
   **neu installiert** werden; die alte zeigt weiter auf die alte Welt.
7. Erst danach die alte Adresse als erledigt betrachten.

**Nebenbei gelöst:** auf der eigenen Adresse liegt Alis’ GitHub-Token nicht mehr
auf dem geteilten Ursprung `lausiklauskn-png.github.io` — die
Geteilte-Origin-Falle aus `CLAUDE.md` entfällt für sie.

**Selbst-Verweise geprüft:** die drei fest eingetragenen `github.io`-Adressen in
ihrem Code zeigen auf **fremde** Apps (BookLedgerPro, Perfect Skin Beauty) und
brechen beim Umzug **nicht**.

---

## Aufgabe 1 — Alis: „Shop ins Repo hochladen" *(nach dem Umzug)*

**Befund 2026-08-09.** Alis' Warenwirtschaft kann heute:

| Knopf | Wirkung |
|---|---|
| „Auf diesem Gerät veröffentlichen" | Shop nur auf **ihrem** Tablet |
| „products.json herunterladen" | Datei im Download-Ordner — der Hinweis sagt: *„ins Repo legen **lassen**"*, also durch Klaus |
| „Bilder ins Repo" / „Video ins Repo" | lädt **wirklich** hoch, über GitHub-Verbindung (Repo + Token, im Browser gespeichert) |

**Es fehlt der Knopf für den Shop-Inhalt selbst.** Ihre Preisänderung erreicht
die Besucher erst, wenn sie Klaus die Datei schickt. Das ist genau der
Handgriff, der **Klaus' Zeit pro Partner** kostet (§ 5 des Papiers).

**Zu bauen:** ein Knopf **„Shop ins Repo hochladen"** neben dem Download, der
`products.json` über die **bereits vorhandene** GitHub-Verbindung schreibt —
derselbe Aufruf wie bei den Bildern, nur anderer Dateiname.

**Dabei beachten:**
- **Fail-soft:** ohne Verbindung kein toter Knopf, sondern der vorhandene
  Hinweis „erst Repository + Token eintragen" (`ghNeedSetup`).
- **Rückmeldung, die sie versteht:** nicht „204 No Content", sondern
  *„Hochgeladen — in ein bis zwei Minuten für alle sichtbar."*
- **Größenwarnung** beibehalten (der Code warnt ab 25 MB).
- **Kein Cache-Bump nötig** — `products.json` und `texte.json` sind im
  Service-Worker bewusst **frisch zuerst**. Diese Ausnahme nicht anfassen.
- Beschriftung in **DE/EN/RU**, wie alles andere dort.
- Der Download-Knopf **bleibt** — als Weg für den Fall, dass die Verbindung
  fehlt oder klemmt.

**Reihenfolge beachten:** dieser Knopf benutzt dieselbe GitHub-Verbindung, die
beim Umzug (Aufgabe 0) ohnehin neu eingetragen werden muss. Erst umziehen, dann
einrichten — sonst macht Alis es zweimal.

**Prüfung:** eigener Smoke-Test in `tests/`, dessen **eigener Rückgabewert**
über grün entscheidet. Die vier bestehenden Tests müssen grün bleiben.

---

## Aufgabe 2 — Stufe 0 für den offenen Markt

**Das Repo steht** (Klaus, 2026-08-09):
**`lausiklauskn-png/PWA-Toolpoint`** — `https://lausiklauskn-png.github.io/PWA-Toolpoint/`
Stand beim Anlegen: ein Commit, nur eine `README.md` (15 Bytes), keine
`CNAME`-Datei. Ob GitHub Pages schon eingeschaltet ist, weiß nur Klaus — diese
Umgebung kommt nicht ins offene Netz.

**Die Adressen sind gesichert** (Klaus, 2026-08-09, 19:53 bei INWX):
**`pwa-toolpoint.de`** = Haupt-Adresse · **`pwa-toolpoint.com`** = leitet dorthin
weiter. Registrant Klaus Nitzsche, Nameserver bleiben bei INWX.

**Damit gilt für den Bau von Anfang an die eigene Adresse** — nicht
`lausiklauskn-png.github.io/PWA-Toolpoint/`. Der Grund ist die Lehre aus Alis'
Umzug (Aufgabe 0): ein Adresswechsel später ist ein Umzug mit Origin-Problem.
Jetzt kostet er nichts, weil noch niemand die Seite kennt.

**Einzurichten (Klaus-Schritte, die Sitzung kann dabei anleiten):**
- bei INWX für `pwa-toolpoint.de` die DNS-Einträge auf GitHub Pages zeigen
  lassen (Apex + `www`)
- `pwa-toolpoint.com` beim Registrar als **Weiterleitung** auf die `.de` setzen
- in den Repo-Einstellungen unter Pages die Haupt-Adresse eintragen; GitHub legt
  die `CNAME`-Datei dann selbst an — **nicht von Hand anlegen**, sonst kollidiert
  sie mit der Einstellung
- HTTPS abwarten (Zertifikat wird automatisch ausgestellt)

**Was gebaut wird:**

1. **Byte-Kopien statt Neubau** (Bausatz-Regel § 5): Marktplatz-Seite, Suche
   (Module 03/04), Einreich-Formular, Vektor-Katalog, Mess-Anzeige aus
   family-project. **Nie die Kopie ändern — die Quelle ändern und neu
   kopieren.** Einen **Drift-Guard von Anfang an** mitliefern; das ist die
   ganze Miete gegen doppelte Wartung.
2. **Eigene Kennungen:** eigene DB-Kennung (**nicht** `familyproject` — sonst
   kollidieren die Datenbestände), eigene Spore, eigener Rendezvous-Raum.
3. **Relais:** eigenes **plus zwei bis drei öffentliche**. Modul 05b nimmt eine
   Liste entgegen (`DEFAULT_RELAYS`, `configure({relays})`) — **Konfiguration,
   kein Bau.**
4. **Eigenes Gesicht:** nüchtern, professionell, **kein Community-Ton**, kein
   Sandkasten und keine Modell-Demo an der Eingangstür.
5. **Stufe 1, noch nicht scharf:** ein Formular *„Ich hätte Interesse"* —
   **kein Preis, kein Prozentsatz, kein „jetzt eintragen für X €"**.
6. **Impressum und Datenschutzerklärung** vorbereiten.

**Was ausdrücklich NICHT gebaut wird:**

- kein Bezahlvorgang (§ 4b) · keine automatische Auszahlung (§ 4d)
- kein Kopierschutz, keine Obfuskation (Tafel in `CLAUDE.md`)
- keine Preise, keine Provisionslogik — das ist Stufe 2 und braucht die
  Gewerbeanmeldung **davor** (§ 8d)
- **SB-KIMTool-Point bleibt unangetastet.** Werkzeug-Hub und Knoten. Was
  gebraucht wird, wird kopiert, nicht verschoben.

---

## Fallen, die heute Geld gekostet haben

- **Vor der Diagnose greppen, nicht danach.** Am 09.08. drei Stunden lang eine
  fehlende Funktion beschrieben, die es längst gab (der Anfrage-Abschnitt am
  Marktplatz). Ein `grep` vorher hätte gereicht.
- **`$?` nach einem Rohr ist der Wert von `tail`.** Ein Test entscheidet nur
  dann über „grün", wenn sein **eigener** Rückgabewert die Kette trägt.
- **Cache-Bump:** wer eine Datei aus `CORE` ändert, erhöht `CACHE_VERSION`.
  In family-project wacht `smoke_cache_version.mjs` darüber — und **Unterordner
  werden leicht vergessen** (am 09.08. vier Seiten unter `werkzeuge/`).
- **`playwright-core` ist in dieser Umgebung nicht installiert.** `smoke_all`,
  elf Tests und `gegenprobe_karte_zurueckgehalten.sh` scheitern deshalb —
  **identisch auf dem unveränderten Stand**. Vor jeder Fehlermeldung mit
  `git stash` gegenprüfen, ob sie vorbestand.
- **Erst committen, dann verzweigen.** `git checkout -B <zweig> origin/main`
  bricht bei Änderungen im Baum ab, und der nächste Commit landet auf dem alten
  Zweig.

---

## Offene Sichttests bei Klaus (nichts zu bauen, nur nachfragen)

1. **Alis, Flugmodus:** App öffnen, Flugmodus an, erneut öffnen — geht die
   Warenwirtschaft auf?
2. **Alis, Kopfzeile:** sitzt der Sicherungs-Hinweis gut, auch schmal?
3. **Marktplatz:** wirkt die neue Zeile unter der Suche einladend oder wie
   Werbung?
4. **Marktplatz, Wächter:** bleiben die Apps grün, sind die grünen
   Quittungs-Bänder verschwunden?

---

## Offene Entscheidungen (§ 15 des Papiers)

Bezahlvorgang für Beauty's Online-Shop · Grundlage der Beteiligung (Empfehlung:
**Rohertrag**) · innerer Kreis ja/nein · EVL. · Jahresbeitrag · **Name und
Domain des Marktes** · Provisionshöhe · verfügbare Zeit im Monat.

---

## Abschluss-Befehl (die Kette reißt nie ab)

Am Sitzungsende: `docs/PULS.md` fortschreiben · Übergabeprotokoll in
`docs/sessions/archiv/` · **neuen Brief nach diesem Muster anlegen und darin
Pflichtlektüre und diesen Abschluss-Befehl wiederholen** · den vollständigen
Brief als Codeblock in der Chat-Antwort ausgeben, weil Klaus zuerst den Chat
liest.
