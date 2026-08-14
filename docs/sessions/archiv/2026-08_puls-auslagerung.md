# PULS-Auslagerung August 2026 — die Sitzungen vom 03. bis 09.08.

Ausgelagert am **2026-08-14** aus `docs/PULS.md` (Schutz-Klausel: 3000 Zeilen —
**auslagern statt kürzen**). Der Inhalt ist **wortwörtlich** übernommen, nichts
gekürzt und nichts zusammengefasst; die Git-Historie trägt ihn ohnehin.

Verfahren wie bei der Mai-Auslagerung vom 2026-07-24 (Klaus’ „Option A“):
Archiv-Datei + Zeiger an der Schnittstelle + Sammel-Zeile im Archiv-Index.
Diese Runde ist die dort schon vorgezeichnete Fortsetzung („Option B“).

---

<!-- Block: Stand-Eintraege 08-09 und aelter (PULS-Zeilen 625–2901) -->

## Stand 2026-08-09 (11) — 📄 Pilz-Wirtschaft Fassung 2: die Grundannahme war falsch

**Rolle:** Analyse-/Spec-Sitzung, Fortsetzung von (10). Kein Modul-Code.

Fassung 1 des Papiers rechnete gegen einen **Kaltstart** — null fremde
Marktplatz-Einträge trotz gratis, also fehle Bekanntheit. **Diese Annahme war
falsch**, und Klaus hat sie im Gespräch korrigiert: er arbeitet bereits mit
Kundenkontakt, hat über seine Gemeinschaft Zugang zu Geschäftsleuten, und die
vierzehn Einträge sind **keine eigenen Beispiel-Apps, sondern Partnerbetriebe**.
Alis Moderaum, Perfect Skin Beauty, Tomys Hub sind reale Partner. Fassung 1 hat
sie falsch gezählt.

**Das tatsächliche Modell — drei Säulen:** ① Beteiligung an Partnerbetrieben
(Software als Einlage) ② persönliche Betreuung, sauber getrennt in
**Einarbeitung** (endlich) und **Wartung** (laufend) ③ Markt mit Provision und
Vermittlung — auf Klaus' Entscheid als **eigene Instanz**, „ein
Family-Projekt-Klon für Fremde", parallel zum Kreis.

**Drei Belege aus dem Code, die das Modell tragen:**

1. **Alis pflegt selbst** — Warenwirtschaft, Kasse, Produkte, eigene
   `gebrauchsanleitung.html`; 76× Backup, 64× Import, 20× Anlegen. Eine
   Nicht-Programmiererin betreibt ihr eigenes System. Das ist der Referenzfall.
2. **Tomys Hub ist ein vollständiger zweiter Werkzeugkasten** — eigenes
   BookLedger, eigenes WorkFloh, `tomy-data`, `tomy-ui`, `tomy-tresor.js`,
   eigene Tests. **Der Bausatz ist keine Idee, er wurde schon einmal
   dupliziert.**
3. **Beauty arbeitet sich gerade ein** (mit ihrem Mann, ein weiterer Shop
   geplant). Das ist die nicht wiederholbare Messgelegenheit: wo sie stockt,
   ist die Spezifikation des Bausatzes.

**Wo Klaus' Zeit wirklich hingeht — geprüft, nicht vermutet:** nicht in die
Apps (die pflegen sich selbst), sondern in die **Internetseiten**. `texte.json`
liegt in Beauty praktisch leer (`{"inputLang":"ru","labels":{},"styles":{}}`),
in Workfloh-Page und Muttis-Seite gar nicht. Das Studio, das wirklich
funktioniert, steht in family-project und kennt nur den Marktplatz. **Erstes
Bausatz-Stück ist deshalb eine Zweitverwendung, kein Neubau.**

**Was bei fünf Partnern bricht:** die Regel „die Brücke läuft immer parallel"
(`Mein-WorkFloh/CLAUDE.md`) funktioniert bei zwei. Gegenmittel existiert
woanders — der **Drift-Guard**. Neue Regel im Papier: *was geteilt ist, wird
geteilt gepflegt und per Prüfsumme bewacht; was eigen ist, bleibt eigen.*

**Neu im Papier auf Klaus' Auftrag:** das **Übersichtsblatt** über alle Partner
(§ 6) — lebt · Leistung · Wächter · zuletzt selbst gepflegt · meine Stunden ·
Bausatz-Stand · Vereinbarung. Mit der ehrlichen Einschränkung, dass
„selbst gepflegt" bei **Apps** grundsätzlich nicht messbar ist (die Daten
bleiben auf dem Gerät — und das bleibt so; eine Hintertür wäre der Bruch des
Kerns, der die Apps verkäuflich macht).

**Der innere Kreis (Klaus' Frage „family-project + Sage, nur für meinen
Geschäftskreis"):** das ist keine Einschränkung, sondern die Form, die die
Vier-Schichten-Lesart ohnehin vorsieht — der Kreis *ist* die Mycel-Schicht, der
öffentliche Markt *ist* der Fruchtkörper. Der bewiesene Cross-Knoten-Versuch
vom 11.07. („wo bekomme ich bedruckte Tassen?" → Tomy antwortet aus seinem
Katalog) ist im offenen Netz eine Spielerei und **im Geschäftskreis ein
Empfehlungsnetz unter Betrieben, die sich kennen.** Modul 14 (Diffusion) ist der
passende Aufnahmeweg und gehört hochgestuft. **Die eine Stelle, an der der
Ist-Stand nicht reicht:** Vertraulichkeit — geschlossen in der Sichtbarkeit ist
nicht geschlossen in den Daten. Vor dem ersten echten Geschäftsdaten-Austausch
im Kreis ist **B6 (Grad C)** fällig.

**Messwerkzeuge neu eingeordnet:** Analyse-Rekorder der Mycel-Karte („schick sie
Claude") wird zum **Übergabe-Werkzeug für die Einarbeitung** — nur auf
Knopfdruck, nur lokal, keine Inhalte. Forschungsstation trägt künftig die
**Geschäftszahl** („wie viel Pflege läuft noch über Klaus"). Drift-Guard
beantwortet die Bausatz-Frage. **Merksatz: automatisiere nicht das Verkaufen,
sondern das Hinsehen.**

**Rechtliches** in § 13 benannt, nicht entschieden: Form der Beteiligung,
Vermittler-Pflichten beim Klon, der Kreis als Rechtsgebilde, und keine Beträge
in öffentliche Repos. Gehört zum Steuerberater, bei Anteilen zum Notar.

**Nachtrag 11 — die Adressen sind gesichert, die letzte offene Entscheidung ist
gefallen.** Klaus hat am 2026-08-09 um 19:53 bei INWX registriert:
**`pwa-toolpoint.de`** (5,97 € erstes Jahr, 4,65 € Verlängerung) als
**Haupt-Adresse** und **`pwa-toolpoint.com`** (17,37 €) als **Weiterleitung** —
zusammen 23,34 €. Registrant Klaus Nitzsche, Nameserver bei INWX.

**Bewusst NICHT genommen und warum** (gehört zur Fremdnutzer-Brille):
`.com.de` und `.co.de` sind **keine echten Endungen**, sondern Unteradressen
einer privaten Firma. Sie fangen **niemanden** ab, der `.com` eintippt — genau
der Denkfehler, wegen dem sie verlockend wirken — und sehen für Fremde nach
Tippfehler oder Betrugsadresse aus. Ebenfalls weggelassen: **Treuhandservice**
(INWX wäre dann eingetragener Inhaber statt Klaus, also schwächere
Rechtsposition an der eigenen Adresse) und **Whois-Privacy** (die ladungsfähige
Anschrift steht ohnehin im Impressum, sobald es gewerblich wird — 4,99 €/Jahr
dafür, sie in einer Datenbank zu verbergen, ist Geld für nichts).

**Damit ist § 15 Punkt 6 geschlossen.** Der Bau in PWA-Toolpoint richtet sich
von Anfang an auf die eigene Adresse — kein späterer Umzug, kein
Origin-Problem wie bei Alis.

**Nachtrag 10 — das Repo für den offenen Markt steht.** Klaus hat es angelegt:
**`lausiklauskn-png/PWA-Toolpoint`**, erreichbar unter
`https://lausiklauskn-png.github.io/PWA-Toolpoint/`. Stand beim Anlegen: ein
Commit, nur eine `README.md` (15 Bytes), keine `CNAME`-Datei. Ob Pages
eingeschaltet ist, kann diese Umgebung nicht prüfen (kein offenes Netz). Damit
ist die Entscheidung gefallen, die alles blockierte — der Brief nennt jetzt den
echten Namen statt einer Rückfrage.

**Ein zeitkritischer Hinweis dazu (§ 8b + die Lehre aus Alis' Umzug):** die
Adresse trägt Klaus' persönlichen Handle. Für einen Markt, der Fremden Vertrauen
abverlangt, gehört dort eine eigene Domain hin — und **solange niemand die Seite
kennt, kostet der Wechsel nichts.** Später wäre es derselbe Umzug mit demselben
Origin-Problem wie bei Alis. Also jetzt entscheiden, nicht nach dem ersten
Besucher.

**Nachtrag 9 — Alis bekommt eine eigene Adresse, und das hat eine Falle.**
Klaus: `alis-moderaum.de` und `.com` sind **bereits gesichert und bezahlt**; der
GitHub-Token ist geklärt. **Token-Prüfung netzweit gemacht** (Auslieferungs-
Brille): kein echter Token in Alis' Dateien, keiner in ihrer Historie, keiner in
irgendeinem der 31 Repos — der einzige Treffer war der Platzhalter
`ghp_XXXX…` in `freigabe-config.example.php`, dessen echte Datei gitignored ist
und nicht im Repo liegt. Ihr Token liegt in **ihrem Browser**
(`sbbild_gh_token`), wie vorgesehen.

**Die Falle beim Umzug — geprüft, nicht vermutet:** eine neue Adresse ist für
den Browser eine **neue Welt**. IndexedDB und localStorage hängen am Ursprung;
nach dem Wechsel stünde Alis vor einer **leeren** Warenwirtschaft. Die
Komplett-Sicherung trägt `articles`, `movements`, `categories`, `images` und die
Shop-Inhalte mit — **nicht** aber `alm_pp_clientid`/`alm_pp_mode` (PayPal),
`alm_gh_repo`/`sbbild_gh_token` (GitHub-Verbindung) und `alm_bon_no`
(Bon-Nummer). Die drei fest eingetragenen `github.io`-Adressen in ihrem Code
zeigen auf **fremde** Apps und brechen nicht.

Als **Aufgabe 0** in den Brief aufgenommen, mit der sicheren Reihenfolge:
Backup ziehen → Bon-Nummer notieren → CNAME + DNS → Backup einspielen → PayPal
und GitHub neu eintragen → App neu installieren. **Der heute gebaute
Sicherungs-Hinweis wird damit zum Sicherheitsnetz genau dieses Umzugs.**
Nebenbei gelöst: auf eigener Adresse entfällt für sie die Geteilte-Origin-Falle.

**Nachtrag 8 — Befund zum Hochladen bei Alis (Klaus' Frage).** Klaus fragte, ob
Alis' Änderungen automatisch hochgeladen werden. **Nein — teilweise.** Geprüft
in `warehouse.html`:

| Knopf | Wirkung |
|---|---|
| „Auf diesem Gerät veröffentlichen" | Shop nur auf **ihrem** Tablet (`localStorage`) |
| „products.json herunterladen" | Datei im Download-Ordner; der Hinweis sagt wörtlich *„ins Repo legen **lassen**"* — also durch Klaus |
| „Bilder ins Repo" / „Video ins Repo" | lädt **wirklich** hoch, über GitHub-Verbindung (Repo + Token, nur im Browser) |

**Es fehlt der Knopf für den Shop-Inhalt selbst.** Ihre Preisänderung erreicht
die Besucher erst, wenn sie Klaus die Datei schickt — genau der Handgriff, der
**Klaus' Zeit pro Partner** kostet (§ 5). Klein zu schließen: die
Hochlade-Maschinerie steht in derselben Datei, für `products.json` ist es
derselbe Aufruf mit anderem Dateinamen. **Als Aufgabe 1 in den Brief
aufgenommen.**

**Zur Cache-Version klargestellt:** die Regel gilt für **Programmdateien**, die
wir ändern — nicht für Alis' Arbeit. Und `products.json`/`texte.json` sind im
neuen Service-Worker bewusst **frisch zuerst**, kommen also immer aus dem Netz.
**Ein Shop-Upload braucht deshalb keinen Versions-Sprung.** Genau dafür war die
Ausnahme gedacht.

**Klaus legt das Repo für den offenen Markt selbst an** (Arbeitsname PWA
Toolpoint). Der Brief `docs/sessions/BRIEF_PWA_TOOLPOINT_START.md` ist auf zwei
Aufgaben umgestellt: (1) Alis' Hochlade-Knopf, (2) Stufe 0 im neuen Repo.

**Nachtrag 7 — zwei Bauten und eine Berichtigung.**
**(a) Alis ist offline-fähig (Alis-Moderaum #38).** Befund: die App hatte ein
Manifest, aber KEINEN Service-Worker — die einzige Erwähnung stand in
`hardReload`, wo er abgemeldet wird. Die Daten lagen sicher, aber das
**Programm** kam bei jedem Öffnen aus dem Netz; ohne Internet ging die
Warenwirtschaft gar nicht auf. Gebaut nach dem Muster aus `family-project/sw.js`
samt dessen Lehren (`Promise.allSettled`, `cache:"reload"`, frisch-zuerst für
`products.json`/`texte.json`); die schweren Ordner (6,4 + 4,4 MB) bewusst nicht
im Vorrat. `tests/smoke_service_worker.mjs` **36/36**, Gegenprobe bestätigt
(erfundene Vorrats-Datei → 36/37).

**(b) Marktplatz: kurzer Weg zur Anfrage (family-project #254) — und eine
Berichtigung.** Ich hatte den ganzen Abend behauptet, am Marktplatz fehle ein
Knopf „Ich hätte gern so etwas für meinen Betrieb", und ihn als billigsten
Schritt auf Platz eins gesetzt. **Das war falsch.** Der Abschnitt gibt es seit
dem 21.07., voll verdrahtet. Gefehlt hat nur der **Weg dorthin**: die Seite
hatte **keine einzige Sprungmarke**, der Abschnitt steht hinter vierzehn
App-Karten. Gebaut: Sprungziel `#anfrage` + eine Zeile unter der Suche,
zweisprachig, ohne Preis (Stufe 1). `smoke_anfrage_weg.mjs` **10/10**.
Cache-Bump v97→v98 mitgezogen — vier Seiten unter `werkzeuge/` waren
durchgerutscht, bis `smoke_cache_version.mjs` sie meldete.
**Lehre, dieselbe wie am Nachmittag: vor der Diagnose greppen, nicht danach.**

**Ehrlich zur Umgebung:** `smoke_all.mjs`, elf weitere Tests und
`gegenprobe_karte_zurueckgehalten.sh` brauchen `playwright-core`, das hier nicht
installiert ist. Sie scheitern **identisch auf dem unveränderten Stand**
(per `git stash` geprüft) — nicht durch diese Änderungen verursacht. Beide
Browser-Sichttests stehen aus.

**Nachtrag 6 — Entscheidungen zum offenen Markt (§ 8b1, § 8c1, § 8d) + Brief.**

**(a) Eigenes Repo statt Umbenennung (§ 8b1).** Zur Debatte stand,
SB-KIMTool-Point umzuwidmen — es war ursprünglich dafür gedacht und trägt
Werkzeugkiste, Knoten-Verzeichnis und neutrale Identität. **Gemessen**, was ein
Umbenennen anfassen würde: **191 Dateien** in fünf Repos (Sage 101,
family-project 34, Jasons-Tresor 30, Mein-Tresor 25, mycel-karte 1), dazu eine
**auf die alte Adresse signierte Spore** → Neu-Signatur und Adress-Wand.
**Klaus' Entscheidung: neues Repo.** Inhaltlich sauberer — der Werkzeug-Hub
bleibt Knoten im Mycel, der Markt bekommt eigene Identität. Gebraucht wird
**kopiert, nicht verschoben**. Arbeitsname **PWA Toolpoint** (besteht den
Vorlese-Test, vermeidet „Kim" nach außen — das gehört nach innen).

**(b) Relais (§ 8c1).** Klaus betreibt bereits ein **eigenes**
(`wss://relay.family-projekt.de`, Hetzner hinter Caddy), und **Modul 05b kann
längst mehrere** (`DEFAULT_RELAYS` ist eine Liste, `configure({relays})`) —
mehrere Relais sind **Konfiguration, kein Bau**. Empfehlung, unterschiedlich je
Seite: **offener Markt** = eigenes + zwei bis drei öffentliche (Reichweite und
Verfügbarkeit erwünscht); **Kreis** = nur das eigene (jedes weitere Relais ist
eine weitere öffentlich mitlesbare Stelle). Wunder Punkt notiert: Relais und
Markt lägen auf derselben Maschine — zusammenhängender Ausfall. Zwei
Klarstellungen: mehr Relais bringt **Verfügbarkeit, nicht Vertraulichkeit**, und
ein eigenes Relais ist **noch keine Mitgliedschaft**.

**(c) Der langsame Start (§ 8d).** Klaus' Lage: **kein Geld eingenommen**, nur
ein Spenden-Hinweis; über Beteiligungen wurde mit niemandem gesprochen — das
kommt **in einer Woche**; zunächst als **zweite Einnahmequelle** gedacht.
Wunsch: geringstes Risiko. Drei Stufen mit scharfer Grenze — **0 Bauen** ·
**1 Zeigen** (online, aber keine Preise, keine Provision; Impressum und
Datenschutz trotzdem) · **2 Handeln** (erster Preis → Gewerbe **davor**). Die
Formulierung: *„Solange ich nur zeige, gibt es keine Preise. Sobald ich zum
ersten Mal etwas gegen Bezahlung anbiete, melde ich das Gewerbe an — vorher
nicht, aber auch nicht später."* Stufe 1 ist zugleich die **Messung**: ein
Formular „Ich hätte Interesse", das nichts kostet und nichts verspricht.
Dieselbe Disziplin wie überall: **kein Preismodell ohne Nachfrage.**

**Brief für die nächste Sitzung:** `docs/sessions/BRIEF_PWA_TOOLPOINT_START.md`
— Auftrag Stufe 0, Byte-Kopien mit Drift-Guard von Anfang an, eigene DB-Kennung,
kein Bezahlvorgang, keine Preise, SB-KIMTool-Point bleibt unangetastet.
**Der Bau hängt an einer einzigen Entscheidung: Name und Domain.**

**Nachtrag 5 — der offene Markt und der geschlossene Kreis (§ 8b, § 8c).**
Klaus hat den Markt angesehen: es gibt inzwischen etliche PWA-Marktplätze, aber
sie wirken **unprofessionell und community-artig** („hast du nicht Lust…"). Er
will das Gegenteil: professionell, ehrlich, offen — und der Grund mitzumachen
soll **unverblümt sein, dass man Geld verdient**, ohne Diskussion darüber.
Deshalb strikt getrennt: family-project bleibt **familiär**, der Klon ist
**offen für den gesamten Markt**, gleiches Prinzip, anderer Ton. Muss
**nebenbei** laufen.

**§ 8b** buchstabiert den Klon aus: warum die Trennung technisch UND menschlich
richtig ist (die beiden brauchen einen gegensätzlichen Ton — wer sie mischt,
macht den Kreis unpersönlich und den Markt unseriös); der Wettbewerbsvorteil ist
**nicht behauptet, sondern belegbar** (nächtlich gemessene Ladezeiten auch der
schlechten, Wächter, Siegel an Bedingungen, Herkunft jeder Zahl — kein anderer
PWA-Marktplatz zeigt das heute); Muss-Liste (Preis und Provision auf die erste
Seite, Aufnahme in Minuten ohne Gespräch, **null Minuten Klaus-Zeit** je
Eintrag) und Darf-nicht-Liste (kein Community-Ton, kein Eigenbau-Bezahlvorgang,
keine Vermischung mit dem Kreis).

**§ 8c** korrigiert einen Wunsch, der so nicht erfüllbar ist: „family-project
verschlüsseln, damit niemand die Apps klaut" geht nicht — die eigene Tafel sagt
es bereits (*Obfuskation ist ausdrücklich NICHT der Weg; Kopierbarkeit ist
gewollt; Schutz ist Copyright + Git-Historie*). **Der eigentliche Wunsch
betrifft nicht den Code, sondern die Zugehörigkeit** und ist voll erfüllbar:
Mitgliedschaft (Module 12/14/10 liegen als Karten bereit), **höfliche
Weiterleitung** Fremder auf den offenen Markt — *Ausschluss und Wachstum sind
dasselbe Bauteil* —, und Vertraulichkeit im Kreis (Grad C / B6), sobald dort
Geschäftsdaten fließen. Die Ansage nach außen in einem Satz: *die Apps sind
offen und dürfen kopiert werden; nicht offen ist der Kreis — wer mitmachen
will, findet nebenan einen Marktplatz für jedermann.*

**Der Bau ist an genau einer Entscheidung aufgehängt:** Name und Adresse des
Klons. Ohne Namen kein Repo, ohne Repo kein Anfang.

**Nachtrag 3 — Alis nimmt Fahrt auf: erster Bau dieser Sitzung.** Klaus:
„erste Einkäufe finden statt, Planung/Preise/Vertriebswege nehmen Fahrt auf."
Damit wird aus dem Referenzfall ein arbeitender Betrieb. **Geprüft**, wo die
Daten liegen: Lager und Bewegungen in **IndexedDB**, Shop-Inhalte in
localStorage — `persist()` fehlte, eine **Erinnerung an die Sicherung** fehlte
ganz. (Berichtigung: eine erste schnellere Durchsicht hatte den Bestand
komplett in localStorage verortet; das war falsch, der Befund bleibt.) Der
Backup-Tresor selbst war bereits vollständig und gut gebaut — es fehlte nur:
*eine Sicherungsfunktion, die niemand drückt, ist keine Sicherung.*
**Gebaut + gemergt (Alis-Moderaum PR #37):** der Kopf zeigt „Sicherung: heute /
gestern / vor N Tagen / noch nie", ab 14 Tagen auffällig, Klick führt zum
Tresor; `exportFullBackup()` setzt den Stempel selbst; `persist()` als Bitte an
den Browser. Nur ein Datum gespeichert, keine Inhalte, durchgehend fail-soft,
DE/EN/RU. Beweis `tests/smoke_backup_erinnerung.mjs` **17/17** (eigener
Rückgabewert, kein Rohr); die zwei bestehenden Smokes weiter grün.
**Browser-Sichttest wartet auf Klaus.** Netzweite Regel im Papier (§ 4c):
*sobald bei einem Partner echtes Geld durch die Daten geht, ist die Sicherung
keine Funktion mehr, sondern eine Zusage.*

**Nachtrag 4 — Provision/Anteil im System (§ 4d, Klaus' Frage).** Zerfällt in
drei verschieden zu beantwortende Teile. **Rechnen: ja** — `ekcent`/`vkcent`
sind da, jede Form ist rechenbar; die Wahl der Grundlage ist die eigentliche
Entscheidung (Umsatz / **Rohertrag, empfohlen** / Gewinn). **Auszahlen: nein** —
ein selbstgebautes System rechnet und zeigt, es bewegt kein fremdes Geld
(„liest nur · schlägt vor · bewegt nichts", Privat-Brain). **Weg:**
Warenwirtschaft rechnet die Zahl → Beleg an BookLedgerPro (Muster
`?uebernahme=` existiert seit WorkFloh→BLP) → EÜR; Abrechnung und Zahlung sind
Menschen-Schritte. Starker Nebeneffekt: BLPs GoBD-Festschreibung macht die
Abrechnung unveränderlich nachvollziehbar — schützt bei einer Beteiligung
beide Seiten. **Steuerseite:** die Behandlung folgt der **Rechtsform**, nicht
der Rechenweise (Leistung mit Rechnung + USt ↔ Gewinnanteil ohne). Praktisch:
die Berechnung kann jetzt gebaut werden, denn die Zahl ist in beiden Fällen
dieselbe — ihre **Beschriftung** wartet auf den Steuerberater-Termin.

**Nachtrag 2 — zwei Auskünfte von Klaus, beide ändern etwas.**
(a) **Tomy arbeitet sich ein.** Die *Software* ist ein vollständiger zweiter
Werkzeugkasten, der *Mensch* ist noch in der Einarbeitung. Das sind zwei
verschiedene Reifegrade, und das Papier hatte sie vermischt. Von drei Partnern
ist einer selbstständig (Alis) und **zwei sind in der Einarbeitung** — der
aktuelle Engpass, zugleich die beste Nachricht für den Bausatz: es laufen zwei
Beobachtungsfälle gleichzeitig. **Was bei Tomy UND bei Beauty klemmt, ist ein
Fehler im Bausatz, nicht am Menschen.**
(b) **Beauty's neuer Shop ist ein Online-Shop**, kein zweiter Laden. Damit
erster Fall, in dem Geld durch Klaus' Software fließt. Neuer § 4b im Papier mit
der klarsten Bau-Empfehlung des ganzen Textes: **den Bezahlvorgang NICHT selbst
bauen** — er bedeutet dauerhafte Verantwortung für Zahlungssicherheit,
Steuerlogik und Rechtspflichten, für einen fremden Betrieb, und widerspricht der
Regel „muss den Erbauer überleben können". Saubere Teilung: Katalog, Suche,
Messung, Vertrauen von Klaus — Warenkorb, Bezahlung, Rechnungen vom erprobten
Anbieter. Dazu die Pflichten-Liste (Bestellknopf, Widerruf, AGB,
**Kosmetikverordnung**, **Verpackungsregister**, Umsatzsteuer) — aufgezählt,
nicht entschieden, gehört vor den Shop-Start.

**Nachtrag — Skills und Regeln als geteilte Teile (§ 7b im Papier).** Auf Klaus'
Frage nach der Erfassung von Fortschritt, Regeln und Dokumentation gemessen:
dieselben Skills liegen in mehreren Repos, und **zwei von drei sind
auseinandergelaufen** (`status-leiste-siegel`, `saubere-netz-anmeldung` — je
verschiedene Prüfsummen in Sage und family-project; nur
`verschluesselter-schluessel-tresor` ist identisch). Dazu liegt
`menschlich-schreiben` nur in Sage und `seiten-bauregeln` nur in family-project —
beide würden im jeweils anderen Repo gebraucht. Extremfall: die `CLAUDE.md` von
`semantic-match-demo` ist die Verfassung von Muttis Rezeptbuch.
**Dieselbe Krankheit wie bei den Modulen und den zwei WorkFlohs — geteilte Teile
ohne Wächter, hier aber an den Regeln selbst.** Neue Regel im Papier: *Was in
mehr als einem Repo gilt, hat eine Quelle und einen Wächter.* Und der wichtigste
Skill für das Geschäft fehlt noch: **einen neuen Partner aufnehmen** — sein
Inhalt entsteht gerade von allein bei Beauty's Einarbeitung.

**Nächster sinnvoller Schritt:** Beauty jetzt mitschreiben (kostet nichts, ist
nicht wiederholbar), dann der zweite Knopf am Marktplatz („Ich hätte gern so
etwas für meinen Betrieb"), dann das Übersichtsblatt mit den Spalten, die schon
Daten haben.

---

## Stand 2026-08-09 (10) — 📄 Phase D.2 eröffnet: `docs/PLAN_PILZ_WIRTSCHAFT.md`

**Rolle:** Analyse-/Spec-Sitzung (Planmodus, kein Modul-Code).
**Auftrag (Klaus):** `lausiklauskn-png/semantic-match-demo` vollständig
analysieren — jede Datei — und daraus beantworten, wie aus family-project & Co.
mit wenig Aufwand und viel Automatisierung ein tragfähiges Geschäftsmodell
werden kann. Regeln gegebenenfalls anpassen. „Evolution im Pilz-Mycel, um davon
leben zu können."

**Was getan:** 17 Dateien gelesen (beide Papiere, alle fünf PDFs entpackt —
sie sind ASCII85+Flate, ein erster Versuch lieferte nur Zeichensalat —, Pitch,
Hub, vier Demo-Seiten, `sw.js`, Manifest). Jeden Kostenposten der
Mai-Analyse gegen den Ist-Stand von Sage + family-project gerechnet. Ergebnis
als **Phase-D.2-Papier** angelegt: [`docs/PLAN_PILZ_WIRTSCHAFT.md`](PLAN_PILZ_WIRTSCHAFT.md).
D.2 stand seit Mai bewusst offen („bis reale Pilz-Bauten existieren") — die
Bedingung ist eingetreten.

**Die drei tragenden Befunde:**

1. **Die teure Hälfte steht schon.** Von den 65.000–116.500 € des Konzepts sind
   Engine, Grundgerüst, Sicherheitsscan (Wächter) und Zertifizierung (Siegel)
   gebaut — die Vektordatenbank (50–200 €/Monat) entfällt ganz, weil
   `listings-vec.json` int8-quantisiert im Repo liegt. Nicht gebaut ist genau
   das, was Geld bewegt: Zahlungsweg und zahlende Gegenseite.
2. **Der Messwert, der die Richtung dreht:** 14 Einträge im Marktplatz, **alle
   eigene, null fremde** — obwohl die ersten hundert Plätze seit dem 12.07.
   **gratis** sind. Der Engpass ist nicht Technik und nicht Preis, sondern
   Bekanntheit. Die eigene Mai-Analyse hatte das beziffert („ohne Partner:
   Kaltstart 3–6 Monate, 10.000–20.000 € Marketing"). Genau das ist eingetreten.
   **Automatisierung erzeugt keinen Käufer** — sie spart Arbeit an einem Weg,
   den jemand geht.
3. **Der Marktplatz hat die falsche Aufgabe.** Als Provisions-Maschine braucht
   er eine Menge (400 Apps / 350 Käufe im Monat für 2.065 €). Als **Beweisstück**
   braucht er nur, was da ist. Vorgeschlagene Reihenfolge — dem Konzeptpapier
   genau entgegengesetzt: ① Auftragsarbeit (2–3 Kunden) · ② Fach-App mit
   **Wartung** (WorkFloh, ~100 Kunden wiederkehrend) · ③ Provision zuletzt.

**Regel-Arbeit:** Der Empfangsmodus blockiert den Verkauf **nicht** — die
Vier-Schichten-Lesart hat das versöhnt („Akquise gehört in die Pilz-Schicht").
Keine Änderung nötig. Neu festgehalten: **die Module sind nicht das Produkt**
(Protokoll bleibt gemeinfrei, verkäuflich sind Apps/Anpassung/Wartung) und
**kein Einnahmeweg, der täuscht oder einsperrt** — daraus folgt: der
gerätegebundene Kopierschutz (4.000–7.000 € im Konzept) wird **nicht** gebaut,
passend zur bestehenden Obfuskations-Tafel.

**Technische Lücke, wirtschaftlich gelesen:** `matchDimensions` (Modul 04)
trägt beide Lanes und die drei Schichten — aber keine Spore trägt Fähigkeit und
Bedarf getrennt (`capVector`/`needsVector`: null Treffer über alle Module +
`INTERFACES.md`). Die vierzehn Knoten sagen, was sie *sind*; keiner sagt, was er
*braucht*. Ein Marktplatz, auf dem niemand Bedarf äußert, kann nur auflisten.
**Nicht sofort bauen** — erst messen, ob die zweite Spur die Rangfolge
verbessert.

**Was offen ist (nur Klaus):** Everlast GmbH (30 Fundstellen in 7 Dateien,
öffentlich, samt 3-%-Gebühr) — bis zur Entscheidung wird darauf nichts
aufgebaut · Jahresbeitrag `yearlyUrl`: Marktplatz-Gebühr oder Wartungsbeitrag ·
Preisform für WorkFloh · verfügbare Zeit für Akquise-Gespräche.

**Nebenbefunde:** `semantic-match-demo/CLAUDE.md` ist eine Kopie der Regeln von
Muttis Rezeptbuch (falsches Repo) und behauptet „privat", obwohl öffentlich ·
`hub.html` veröffentlicht Klarnamen + private E-Mail, während `spenden.js` am
01.08. genau das entfernt hat · die Demo hängt an vier fremden Adressen und
legt den API-Schlüssel im Klartext in `localStorage`.

**Nächster sinnvoller Schritt:** der **zweite Knopf am Marktplatz** — „Ich
hätte gern so etwas für meinen Betrieb". Die Maschinerie steht
(`einreichung.php` mit Warteschlange, Spam-Falle, Rate-Limit); es fehlt nur ein
zweiter Anlass. Einziger Punkt der ganzen Liste, an dessen Ende jemand Geld
überweisen könnte.

**Ungeprüft:** ob die Live-Demo unter `lausiklauskn-png.github.io/semantic-match-demo/`
noch läuft — die Sitzungs-Umgebung kommt nicht ins offene Netz.

---

## Stand 2026-08-09 (9) — ✅ 97 bestätigt (#799 bleibt) · Discovery: gerade Linien raus, Erd-Maske korrigiert

### Zuerst: die 84 war Streuung

| Uhrzeit | Handy |
|---|---|
| 10:16 | 97 |
| 10:29 | 84 |
| 10:42 | **97** |

Tageswerte 70 · 83 · 97 · 84 · 97. Die Seite steht bei **~97** mit einem Ausreißer nach
unten. **#799 wird NICHT zurückgenommen** — der in Stand (8) angekündigte Rückbau
entfällt. Das war der Grund, nicht auf einen einzelnen Lauf hin zu handeln.

### Klaus' Befund an der Discovery-Seite

*„Zu Beginn oben hast Du Designelemente drin, gerade Linien und Striche, die durchs
Bild wandern. Die kannst Du rausnehmen — in der Natur gibt es keine geraden Linien in
dem Sinne."* Und: *„auch da hat die Erde diesen schwarzen Hintergrundrand."*

### Gebaut

**1 · Filament-Linien entfernt.** `THREE.LineSegments` mit goldenem
`LineBasicMaterial`, gezogen von Galaxien-Zentrum zu Galaxien-Zentrum — weil die
Galaxien driften, wanderten die Linien mit. Erzeugung (~20 Zeilen) und die
Einblend-Zeile in der Animationsschleife sind raus; `centers` bleibt (trägt die
Sternpunkte). Im Bild bestätigt: keine goldenen Verbindungslinien mehr.

**2 · Erd-Maske korrigiert — gemessen, nicht geschätzt.** Radial an beiden
Vollformat-Bildern (1254×1254):

```
Scheibenkante bei r ≈ 0,428
danach:  erde-blau   Helligkeit 1   (schwarz)
         erde-dunkel Helligkeit 12  <- die Spiegelplatte, NICHT schwarz
alte Maske: smoothstep(0.425, 0.445)  -> blendet erst AB der Kante aus,
                                         der Plattensaum blieb stehen
neue Maske: smoothstep(0.395, 0.415)  -> endet VOR der Platte
```

Vor der hellen Nebelwand war dieser Saum als dunkler Ring sichtbar. Die neue Maske
nimmt den äußersten Scheibenrand mit, was den Abfall zugleich weicher macht.
`uDarkZoom` steht unverändert auf 1.0 (wird nirgends gesetzt) — war nicht die Ursache.

### Geprüft

Die Szene wurde **gerendert und angesehen** (WebGL, drei Zeitpunkte + später Stand).
Keine Seitenfehler, kein 404, drei Skriptblöcke syntaktisch grün, `linkGeo`/`linkPos`/
`linkPairs`/`LineBasicMaterial` restlos entfernt (die zwei verbliebenen Nennungen
stehen in Kommentaren).

### Zwei Dinge zur Entscheidung vorgelegt — ✅ Klaus hat entschieden: BLEIBEN SO

1. **Die Kometen-Schweife.** Im gerenderten Bild zieht weiterhin ein langer heller
   Strich durchs Bild — das sind die Kometen/Meteoriten mit Feenstaub-Schweif, die auf
   den Planeten zufliegen (Klaus' Hero-Vision 2026-06-23). Sie sind leicht gebogen,
   aber auffällig. **Falls Klaus DIESE meinte und nicht die Filamente:** sagen, dann
   kommen sie raus oder werden dezenter.
   → **✅ Klaus 2026-08-09: „Kometen sollen bleiben, das ist alles kein Problem."**
   Damit ist geklärt: gemeint waren die Filament-Linien, und die sind raus. Die
   Kometen-Schweife sind **gewollt** — eine Folge-Sitzung schlägt sie nicht erneut
   zum Entfernen vor.
2. **Die Früherde ist sehr dunkel.** Nach dem Masken-Fix ist der *Rand* sauber, aber
   die Scheibe selbst steht als fast schwarzer Ball vor dem hellen Nebel — das Bild
   `erde-dunkel.webp` hat Helligkeit 10–54, dazu dunkelt der Shader mit Faktor 0.82
   ab (`col *= mix(0.82, 1.0, uHabitable)`). Das ist die **erzählerische Absicht**
   („dunkle, unbewohnliche Früherde"), keine Panne. Aufhellen wäre eine
   Gestaltungsentscheidung — **nicht eigenmächtig**.
   → **✅ Klaus 2026-08-09: „auch die Erde ist so in Ordnung."** Die Früherde bleibt
   so dunkel wie sie ist. **Nicht aufhellen**, auch nicht gut gemeint.

---

## Stand 2026-08-09 (8) — Erde auf der Discovery-Karte: Dauer-Blinken raus, Spiegelplatte weggeschnitten

**Rolle:** Sicht-Befund von Klaus, Bau + Sichtprüfung am gerenderten Bild.

### Klaus' zwei Befunde

1. *„Die Erde wird, ohne dass die Maus sich darüber bewegt, hell und dunkel … die
   gesamte Zeit. Erst wenn die Maus draufgeht, soll sie das tun — so wie die Tür
   darüber."*
2. *„Dahinter ist ein dunkler Schatten … Er ragt vor der Erde hervor. Er muss nicht
   so groß sein."* Nachgereicht: *„Auf der Discovery-Seite ist die Erde noch einmal,
   dort wurde sie auf einen dunklen Hintergrund gelegt, der vorher ein Spiegel
   werden sollte — daher kommt der dunkle Hintergrund."*

### Nachgemessen statt geraten

```
erde-blau-web.webp    420x420 · durchsichtig 0 % · sehr dunkel 72 %
erde-dunkel-web.webp  420x420 · durchsichtig 0 % · sehr dunkel 80 %
```

**Beide Dateien sind zu 100 % undurchsichtig.** Klaus' Vermutung („die ist wohl
transparent, deswegen sieht man den dunklen Hintergrund") trifft es also nicht ganz
— und sein Nachtrag erklärt es richtig: die dunkle Fläche ist die **einbelichtete
Spiegelplatte**, Teil des Bildes. **Kein CSS-Schatten.** Der `inset`-Schatten am
Kreis wird ohnehin von den beiden `<img>`-Kindern überdeckt und war nie der Grund.

### Gebaut

1. **Dauer-Blinken raus.** `animation: discoEarth 11s infinite` (elf Sekunden hin
   und her, ohne Zutun) ersetzt durch dasselbe Muster wie die Einladungs-Tür:
   Übergang nur bei `:hover` / `:focus-visible`, langsam hin (1,8 s), schneller
   zurück (0,9 s).
2. **Ruhezustand umgedreht.** Vorher lag im Ruhezustand die **dunkle** Früherde
   oben — ein fast schwarzer Ball, genau das, was Klaus als „dunklen Schatten"
   gesehen hat. Jetzt liegt ruhig die **blaue** Erde da; die Früherde kommt erst bei
   Berührung. Beide Befunde lösen sich damit an derselben Stelle.
3. **Spiegelplatte weggeschnitten.** `transform: scale(1.18)` →
   `scale(1.42) translateX(7%)`. Die Platte ragte rechts sichtbar über die Erde
   hinaus; jetzt füllt die Kugel den Kreis, **die Nachtseite bleibt erhalten**
   (Klaus: „so weit, dass die Erde noch ihre dunklen Effekte hat").

`prefers-reduced-motion` zieht mit (`transition: none` statt `animation: none`).

### Geprüft

Nicht nur Zahlen: die Karte wurde in **Ruhe und bei Berührung gerendert und
angesehen** (Bauregel Bilder, „alt und neu nebeneinander"). Ruhe = erkennbare blaue
Erde ohne überstehende Platte; Berührung = dunkle Früherde, Kontinente noch sichtbar.
`earth-blue` opacity 1 → 0 im Wechsel bestätigt. Skriptblöcke syntaktisch grün,
`discoEarth` restlos entfernt.

**Nebenbei:** eine der acht „nicht zusammengesetzten Animationen" aus dem
PageSpeed-Bericht ist damit weg — sie lief dauerhaft im Hintergrund.

**Wenn die Bilder je neu geschnitten werden** (Spiegelplatte raus, echte
Transparenz): dann `scale` wieder auf ~1.18 zurück. Steht als Kommentar im Code.

### ⚠ Offen und wichtig: die Note ist von 97 auf 84 gefallen

| Uhrzeit | Handy | davor gemergt |
|---|---|---|
| 10:16 | **97** | #798 Bilder |
| 10:29:47 | **84** | #799 CSS-Hintergründe |

Dazwischen liegt **genau #799**. Zwei Lesarten, und ich kann sie mit je einem Lauf
**nicht** trennen:

- **Streuung.** Die Tageswerte lagen bei 70 · 83 · 97 · 84. Wenn die Seite real bei
  ~90 ± 7 steht, sind 97 und 84 beides normale Ziehungen.
- **#799 kostet wirklich.** Mechanisch wäre das erklärungsbedürftig: die drei Bilder
  liegen ab 9.857 px, der Beobachter feuert beim Laden für keines davon (gemessen:
  beim Öffnen wurde keines geholt). Ein Grund ist nicht ersichtlich — aber
  „nicht ersichtlich" ist kein Beweis.

**Nächster Schritt: ein bis zwei weitere Läufe.** Bleibt es unter dem 97er-Niveau,
wird **#799 zurückgenommen** — der Posten hatte ohnehin keinen Noten-Nutzen (das
stand schon in Stand (7)), also ist ein Rückbau billig und richtig.

---

## Stand 2026-08-09 (7) — ✅ Handy 70 → 83 → **97** live · und die letzten 238 KiB Hintergrundbilder

**Rolle:** Bau + Messung. Klaus' Wort: *„CSS-Hintergründe auch noch machen."*

### Zuerst der Beleg: der Tag ist gemessen, nicht behauptet

Klaus' PageSpeed-Läufe an der live-deployten Seite, **Handy**:

| Uhrzeit | Note | was davor gemergt wurde |
|---|---|---|
| 09:14:30 | 70 | (Grundlinie) |
| 09:49:43 | **83** | #796 status.json einmal · #797 toter Code |
| 10:16 | **97** | #798 Bilder (307 KiB aus dem Dokument, 8 spät ladend) |

```
FCP 1,3 s · LCP 1,7 s · TBT 0 ms · CLS 0,098
```

**LCP war der rote Wert und ist jetzt grün.** Damit ist auch die offene Frage von
09:50 beantwortet: die 83 waren echt, kein Glückslauf.

⚠ **Eine Zahl ist gewandert und wird nicht übergangen: CLS 0 → 0,098.** Grün reicht
bis 0,1 — das ist knapp, nicht komfortabel. Lokal in drei Läufen **nicht
reproduzierbar** (CLS 0,0000 jedes Mal), auch nach dem Hintergrund-Bau nicht. Also
entweder ein einmaliger Ausreißer oder etwas, das nur auf der echten Leitung
auftritt. **Beim nächsten Live-Lauf gezielt draufschauen.**

### Gebaut — die drei CSS-Hintergrundbilder

Sie luden weiter sofort, obwohl sie ab 9.857 px stehen: `galaxie-hintergrund`
(103 KiB) · `observatorium-truhe` (99 KiB) · `scene-5-door` (36 KiB) = **238 KiB**.
Für CSS-Hintergründe gibt es **kein** `loading="lazy"` — also gebaut:

- Die Adresse wanderte aus der Grundregel in eine eigene `.bild-da`-Regel; Position,
  Zuschnitt, Filter und **alle Hover-Effekte bleiben, wo sie waren**.
- Ein IntersectionObserver (`rootMargin: 600px`) hängt `.bild-da` an, sobald die
  Karte in Sichtweite kommt — 600 px Vorlauf, damit nichts aufpoppt.
- **Fail-soft:** kein IntersectionObserver → sofort anhängen (wie bisher); JS ganz
  aus → nur die Dekoration fehlt, die Karten bleiben lesbar und anklickbar.
- **Kein Sprung-Risiko:** alle drei liegen `position:absolute; inset:0` in Behältern
  mit fester Größe. Ein später ankommender Hintergrund kann dort nichts verschieben.

`.vp-screen-hero` (dasselbe Truhen-Bild auf dem Vorteilspack-Bildschirm) bleibt
**bewusst unangetastet**: der Bildschirm ist bis zum Öffnen ausgeblendet, ein
IntersectionObserver feuert dort nie — die Regel würde das Bild dauerhaft
unterdrücken statt es zu verzögern.

### Gemessen

```
beim Öffnen geholte Bilder   nur icon.svg + mark.svg (die drei NICHT dabei)
nach dem Scrollen            alle drei, richtige Adressen, kein 404
CLS                          0,0000
Seitenfehler                 keine
Truhe-Smoke                  22/22
```

Lighthouse abwechselnd, je 3 Läufe gegen `origin/main`:

| | Leistung | LCP | Gewicht |
|---|---|---|---|
| alt | 68 | 10,4 s | 2100 KiB |
| neu | 72 | 6,2 s | **1866 KiB** |

Belastbar wieder das Gewicht: **−234 KiB**, in allen drei Läufen identisch — genau
die drei Bilder.

### Ehrlich zur Erwartung

Bei **97** mit LCP 1,7 s und TBT 0 ms ist an der Note fast nichts mehr zu holen; die
238 KiB lagen unter dem ersten Schirm und kosteten dort keine Punkte mehr. Der Grund,
es trotzdem zu tun, ist **kein** Punktegewinn, sondern echtes Datenvolumen bei
jemandem, der die Seite über Mobilfunk öffnet und nie so weit scrollt.

### Was aus dem PageSpeed-Bericht übrig bleibt

| Posten | Stand |
|---|---|
| JS komprimieren 183 KiB | **verboten** — 159 KiB davon sind der byte-1:1-Modul-Kanon |
| Cache-Verweildauer 1.035 KiB | **unmöglich** — GitHub Pages setzt fest 10 Min., keine eigenen Kopfzeilen |
| Sicherheits-Kopfzeilen | **unmöglich** auf Pages (kopfzeilen-only); auf family-projekt.de machbar |
| CSS 34 + 12 KiB | **offen** — der letzte Posten, der die erste Anzeige betrifft |
| Nicht zusammengesetzte Animationen · erzwungener Umbruch · lange Aufgabe | ohne Wirkung (CLS/TBT sind grün) |

---

## Stand 2026-08-09 (6) — Bilder: 307 KiB steckten IM Dokument, 500 KiB luden zu früh · 64 → 70

**Rolle:** Bau nach Klaus' Bauregeln (`seiten-bauregeln`, Gewerk Bilder). Auslöser: Klaus'
PageSpeed-Posten „Bildübermittlung verbessern, 367 KiB".

### Erst gemessen, wie die Bauregel es verlangt

Auf einem Handy-Schirm (412 × 823) nachgesehen, wo die Bilder liegen und was das
LCP-Element ist:

```
LCP-Element   <p class="hero-claim">   — TEXT, kein Bild
Seitenhöhe    18.658 px   (erster Schirm: 823 px)

sun-img (eingebettet)      ab  9.857 px    loading=auto
erde-dunkel / erde-blau    ab 13.563 px    loading=auto
meilenstein-1/2/…/07-23    ab 16.487 px    loading=auto
```

**Kein einziges Bild hatte `loading="lazy"`** (Bauregel Bilder Nr. 3), und alle liegen
nicht knapp, sondern **um den Faktor 20** unter dem ersten Schirm. Das LCP-Element ist
Text — Bilder konnten es nie direkt beschleunigen, nur die Leitung freimachen.

### Der eigentliche Fund stand nicht im Bericht

**Zwei Bilder steckten als base64 IM Dokument** (Bauregel Nr. 6, „niemals base64 in die
HTML"). PageSpeed listet sie unter „Bilder" gar nicht, weil sie Teil der HTML sind:

| | im Dokument | als Datei | Aufschlag |
|---|---|---|---|
| Sonnen-Bild (`sun-img`, 480×480) | 113,6 KiB | 85,2 KiB | 33 % |
| Milchstraßen-Hintergrund (`--milkyway-bg`, 1500×643) | 193,2 KiB | 144,9 KiB | 33 % |

Zusammen **307 KiB**, die bei **jedem** Seitenaufruf geladen und durchgeparst werden
mussten, bevor ein Pixel erscheinen konnte — für Bilder, die erst nach 12 Bildschirmen
Scrollen bzw. nach einem Klick auf die Sonnen-Seite sichtbar werden.

### Gebaut

1. **Beide base64-Bilder als Datei ausgelagert** → `assets/sonne-web.webp`,
   `assets/milchstrasse-web.webp`. `index.html` **651 → 344 KiB**.
2. **`loading="lazy"` + `decoding="async"`** auf alle 8 `<img>` unterhalb des ersten
   Schirms (5 Meilenstein + 2 Erd-Bilder + Sonne).
3. **`width`/`height` mit den ECHTEN Maßen** (Bauregel Nr. 4) — 640×640, **720×576** beim
   2026-07-23-Bild (nicht blind 640 überall), 420×420, 480×480.

**Bewusst NICHT verkleinert oder nachkomprimiert.** PageSpeed schlägt „responsive Bilder"
vor (312 px angezeigt gegen 640 px Datei), aber auf Klaus' Tablet mit doppelter
Pixeldichte wären 624 px genau richtig — 640 ist also praktisch schon die Zielgröße.
Kleiner rechnen hieße sichtbar unschärfer für ein paar Kilobyte. Nachkomprimieren wurde
nicht gemacht, weil die Bauregel dafür den Sicht-Vergleich alt/neu verlangt und der
Gewinn ohne Lazy-Laden ohnehin verpufft.

### Gemessen — und die Regel-7-Falle geprüft, nicht angenommen

```
Dokument                      651 KiB  →  344 KiB
beim Öffnen geholte Bilder    alle     →  keins der acht späten
nach dem Scrollen             —        →  sonne/erde kommen nach
CLS                           0        →  0        (width/height halten)
404                           —        →  keine
```

Die **Milchstraße** war der gefährliche Punkt: sie steckt in einer CSS-Variablen, und eine
relative `url()` dort löst gegen das *Stylesheet* auf, nicht gegen das Dokument
(Bauregel Nr. 7 — an SB-KIMTool-Point kostete das drei unsichtbare Kopf-Streifen). Darum
nicht hingeschaut, sondern gemessen: `getComputedStyle` zeigt
`url("…/assets/milchstrasse-web.webp")`, Antwort **200**, und sie kommt erst beim Öffnen
der Sonnen-Seite. Kein Fallback, der einen Fehler verdeckt.

Lighthouse abwechselnd, je 3 Läufe gegen `origin/main`:

| | Leistung | LCP | TBT | Gewicht |
|---|---|---|---|---|
| alt | 64 | 10,3 s | 222 ms | 2843 KiB |
| neu | **70** | 7,6 s | 42 ms | **2100 KiB** |

Belastbar ist wieder vor allem das **Gewicht — in allen drei Läufen exakt gleich**
(−743 KiB). Die Note streut stark (ein alt-Lauf fiel auf 37), der Median-Gewinn von
6 Punkten ist ein Hinweis, kein Beweis. **PageSpeed entscheidet** (Bauregel 1b).

### Offen geblieben — der nächste Posten

Drei Bilder liegen als **CSS-Hintergrund**, nicht als `<img>`, und laden deshalb weiter
sofort, obwohl sie ab 9.857 px stehen:

```
galaxie-hintergrund-web.webp   103 KiB
observatorium-truhe-web.webp    99 KiB
scene-5-door-web.webp           36 KiB
```

Zusammen **238 KiB**. `loading="lazy"` gibt es für CSS-Hintergründe nicht; es bräuchte
`content-visibility: auto` an den Karten oder einen Umbau zu `<img>`. Eigener Schritt,
vorher messen.

---

## Stand 2026-08-09 (5) — Klaus' Ring-Idee führte zu einem Fund daneben: status.json dreimal geholt

**Rolle:** Prüfung + Bau. Klaus' Idee: *„Die null Prozent … null kann auch eine schlichte Null
sein, muss keine Messung sein. Erst wieder anfangen mit Messen, wenn eine Neuerung dazugekommen
ist."* Auftrag: **erst nachprüfen, ob das wirklich so ist.**

### Nachgeprüft — die Vermutung stimmt, und der Mechanismus ist schon eingebaut

```
17 Module    → 170 von 170   (alle "fertig")
15 Endknoten → 225 von 225   (alle integriert + live)
Hub          →  10
             = 405 von 405 → 100 % real → Demo-Anteil 0 %
```

Exakt aufgegangen. Der **Nenner ist definiert als „alles fertig"** (Hub + je Modul 10 + je
Endknoten 15). Kommt etwas Neues und noch Unfertiges dazu, wächst der Nenner, der Zähler nicht
— **der Wert verlässt die Null von selbst wieder**. Genau Klaus' Idee; es brauchte nur die
Erkenntnis, dass die Rechnung heute nichts anderes als 0 ergeben *kann*.

Im Browser bestätigt: die Anzeige stand beim Laden, nach 3 s und nach Scrollen+12 s **jedes Mal
auf „0 %"**, nie auf etwas anderem.

### Der eigentliche Fund lag daneben — und wurde erst beim dritten Anlauf richtig zugeordnet

`status.json` (68 K roh / 22 K komprimiert) wurde **viermal pro Seitenaufruf** geholt. Die
erste Zuordnung war **falsch** — zwei Abrufe wurden `vorteilspack.js` zugeschrieben, weil dort
`gatherLiveStatus`/`applyLiveStatus` **doppelt definiert** sind (Zeilen 189–224 byte-gleich mit
225–260, nur eine Aufrufstelle). Erst eine Spur mit Herkunfts-Kopfzeile zeigte die Wahrheit:

| Abruf | Herkunft |
|---|---|
| 1 | `index.html` → `loadStatus()` |
| 2 | `index.html` → `setupSchichtenLampen()` |
| 3 | `docs/observatorium/vorteilspack.js` → `applyLiveStatus()` |
| 4 | **`mycel-karte/` im `<iframe>`** — eigenes Dokument, eigener Abruf |

**Lehre:** ein gepatchtes `window.fetch` sieht nur die eigene Seite. Was aus einem `<iframe>`
kommt, taucht dort nicht auf — nur am Server. Wer nur eine der beiden Zählungen hat, ordnet
falsch zu.

### Gebaut

1. **`window.sageStatusJson()`** oben im Haupt-Skriptblock: holt `status.json` **einmal** und
   reicht allen dasselbe Versprechen weiter. Schlägt die Holung fehl, wird das Versprechen
   vergessen (sonst wäre ein Netz-Aussetzer für die ganze Sitzung eingebrannt); jeder Aufrufer
   behält seine eigene fail-soft-Behandlung. `{frisch:true}` erzwingt eine neue Holung.
   `vorteilspack.js` nutzt die Hülle, **fällt aber auf seinen eigenen Abruf zurück**, wenn sie
   fehlt — die Datei bleibt anderswo einbaubar (Fremdnutzer-Brille).
   Der `<iframe>` bleibt bewusst ein eigener Abruf: fremdes Dokument, kann nicht mittrinken.
2. **Die Null wird nicht mehr hochgezählt.** `countUp` lief 1400 ms und schrieb in jedem Bild
   dieselbe „0 %" hin — rund **84 Mal umsonst**, mitten im Ladefenster, und eine der „8 nicht
   zusammengesetzten Animationen" aus dem PageSpeed-Bericht. Bei `demoPct === 0` steht die Zahl
   jetzt einfach da. Wird der Wert wieder > 0, zählt sie von selbst wieder hoch.

### Gemessen

```
Abrufe von status.json am Server   4  →  2   (der zweite ist der iframe)
Schreibvorgänge an der Ring-Zahl  ~84 →  1
```

Nichts fiel aus: Kopfzeile, Fußzeile, 25 Modul-Zeilen mit 25 Lämpchen-Gruppen, Balken
100/100/100, 23 Vorteilspack-Kacheln mit Live-Status (19 fertig, 4 Schablone — deckt sich mit
`status.json`), **keine Seitenfehler**. Smoke: Truhe 22/22, Standalone 49/49, Bundle 21/21.

Lighthouse abwechselnd, je 3 Läufe gegen `origin/main`:

| | Leistung | LCP | Gewicht |
|---|---|---|---|
| alt | 64 | 10,3 s | 2974 KiB |
| neu | 65 | 8,5 s | **2845 KiB** |

**Ehrlich eingeordnet:** der eine Punkt ist Rauschen, LCP streut hier zu stark, um etwas zu
belegen. Belastbar ist allein das **Gewicht — in allen drei Läufen exakt gleich**. Und auch das
muss man richtig lesen: der Testserver **komprimiert nicht**, GitHub Pages schon. Live sind es
also rund **2 × 22 KiB ≈ 44 KiB**, nicht 129.

### Nicht gemacht (bewusst)

- **Die Erklärung „Was bringt mir das?" bleibt im Dokument.** Klaus vermutete, sie werde
  vorgeladen — sie lädt heute **gar nichts** nach: 4 KiB HTML, versteckt bis zum Klick, keine
  Anfrage. Auslagern spart ~1,5 KiB komprimiert und kostet beim Klick eine Wartezeit.
- **Der doppelte Block in `vorteilspack.js`** blieb zunächst stehen — er verursacht keinen
  zusätzlichen Abruf, das Entfernen gehörte nicht in den Auftrag. **Nachgeholt auf Klaus'
  Wort („Totencode rauswerfen"), siehe unten.**

### Nachtrag — toter Code in `vorteilspack.js` entfernt

`gatherLiveStatus` + `applyLiveStatus` standen **zweimal** in der Datei, byte-gleich (Zeilen
189–231 == 232–274, 43 Zeilen). Bei Funktions-Deklarationen gewinnt die **letzte** im gleichen
Bereich — die erste Fassung war seit jeher wirkungslos. Sie hat aber Schaden angerichtet: sie
ließ die Abruf-Zählung so aussehen, als käme der vierte `status.json`-Abruf aus dieser Datei,
und führte zu einer falschen Zuordnung, die erst die Server-Spur korrigierte.

Die **erste** Fassung ist raus (die zweite war die wirksame), 687 → 644 Zeilen. Beide Funktionen
kommen jetzt genau einmal vor.

Verhalten unverändert nachgewiesen: Truhe-Smoke 22/22, Browser-Lauf identisch zu vorher —
23 Kacheln, 19 „Fertig" + 4 „Schablone" (deckt sich mit `status.json`), keine Seitenfehler.

**Lehre für die nächste Sitzung:** doppelte Funktions-Deklarationen sind nicht nur unsauber,
sie **verfälschen die Fehlersuche**. Wer zwei gleich aussehende Stellen findet, prüft zuerst,
welche überhaupt läuft, bevor er eine Beobachtung zuordnet.

---

## Stand 2026-08-09 (4) — Relais erst auf Knopfdruck: 0 WebSockets beim Öffnen, aber KEIN Notengewinn

**Rolle:** Bau + Messung. Klaus' Entscheidung: *„Websocket auch erst auf Knopfdruck."*

Damit spricht die Sage-Page beim bloßen Öffnen mit **niemandem** mehr — weder per Abruf noch
per Dauerverbindung.

### Gebaut

Die WebSocket zu `wss://relay.family-projekt.de` wird nicht mehr beim Laden geöffnet.
`window.sageLauschenStarten()` liegt bereit und hängt am **vorhandenen** Knopf „🌐 Mycel"
(Modul 23). Angehängt wird in der Erfassungsphase am Fenster — das **Kanon-Modul 23 UI bleibt
unangetastet**, hier wird nur mitgehört. Die Lampe „Verkehr" bleibt grau und sagt auch warum
(„noch nicht am Relais. Sage antwortet erst, wenn du 🌐 Mycel drückst"), statt stumm
auszusehen wie ein Fehler.

**Was das kostet, ohne Beschönigung:** solange niemand verbunden hat, **beantwortet Sage keine
Fragen anderer Knoten**. Das Antwortrecht aus „Empfangsmodus mit Antwortrecht" braucht eine
offene Leitung. Die Verbindung ist kein Beiwerk — sie ist die Teilnahme am Mycel. Neu ist nur,
dass sie mit einer Entscheidung beginnt.

### Gemessen im Browser — das trägt

```
beim Öffnen              0 WebSockets (vorher 1), 0 Fremd-Abrufe
Lampe verkehr            grau, mit ehrlichem Hinweistext
nach Druck auf 🌐 Mycel  1 WebSocket -> wss://relay.family-projekt.de
```

### Die Note: KEIN Gewinn — und warum die Messung das gar nicht sehen kann

Abwechselnd, je drei Läufe, gegen den **richtigen** Vergleichsstand (`8c3b5b3`, der den
15→0-Fix schon enthält und sich nur im Relais unterscheidet):

| | Leistung | LCP |
|---|---|---|
| alt (Relais beim Laden) | 78 · 77 · 78 | 5,0 · 5,1 · 4,9 s |
| neu (Relais auf Knopfdruck) | 74 · 76 · 78 | 6,0 · 5,5 · 4,9 s |

**Median 78 → 76.** Also kein Gewinn, eher ein Punkt Verlust im Rauschen.

**Der Grund ist die Messung selbst, nicht der Umbau:** auf dieser Maschine ist
`relay.family-projekt.de` **gar nicht erreichbar** (der Proxy blockt die WebSocket). Die
Verbindung scheitert sofort und kostet hier praktisch nichts — es gibt lokal also nichts zu
gewinnen. **Die Messung ist für genau diese Änderung blind.** Auf Klaus' Tablet verbindet sie
sich wirklich (TLS-Handschlag, Leitung offen halten); was das dort kostet, sieht man nur dort.

**Die Änderung wurde ohnehin nicht wegen der Note gemacht.** Der Grund ist: wer die Seite nur
öffnet, meldet damit keine dauerhafte Verbindung mehr an. Das Argument steht unabhängig von
jeder Zahl — und es ist dasselbe, das schon bei Mein-Tresor und Jasons-Tresor galt.

### Ein Fehler von mir, der fast durchgegangen wäre

Der erste Anlauf dieser Messung verglich gegen `fab5b87` — den Stand **vor** dem 15→0-Fix. Er
meldete 72 → 77 und hätte dem Relais-Umbau einen Verdienst zugeschrieben, der ihm nicht
gehört. Ursache: nach dem Merge von PR #794 hatte ich **kein `git fetch origin main`** gemacht,
mein Zeiger war alt. Das steht wörtlich im ersten Absatz dieser Verfassung — *ein Klon ohne
`fetch` ist kein Beweis* — und gilt für einen Mess-Maßstab genauso wie für eine Aussage über
eine App. Aufgefallen ist es nur, weil die Zahl **zu gut** war und ich nachgesehen habe.

### Offen

- **Klaus' PageSpeed-Lauf.** Nur dort verbindet sich das Relais wirklich. Fällt der Handy-Wert
  ab, ist das ein Grund, den Umbau noch einmal zu besprechen.
- **Ob Sage passiv erreichbar bleiben soll.** Wenn im Alltag auffällt, dass ein anderer Knoten
  Sage nicht mehr fragen kann, während das Tablet die Seite offen hat, braucht es einen
  Mittelweg (z. B. Verbindung merken und beim nächsten Besuch selbst wieder aufbauen).

## Stand 2026-08-09 (3) — Sage-Page: 15 Fremd-Abrufe beim Öffnen auf null, Note 72 → 77

**Rolle:** Fehlersuche + Bau. Grundlage war Klaus' Handy-Bericht (PageSpeed 63) und seine
Entscheidung für die Punkte 1–3 der Analyse.

### Die Einordnung, die Arbeit spart

**Jeder Posten aus dem Bericht hat in der Wertung `Gewicht 0`** — Minifizieren (160 KiB),
ungenutztes CSS/JS, Hauptthread 3,3 s, die acht Animationen. Die Note machen nur FCP, **LCP**,
TBT, CLS und Speed Index; TBT (10–40 ms) und CLS (0) sind hier schon perfekt. Es ging also
allein um LCP. Und Minifizieren ist für die SBKIM-Module ohnehin verboten (byte-genaue
Kanon-Kopien, ein Prüfwert wacht darüber).

### Was gebaut wurde

1. **Beim Öffnen spricht die Seite mit niemandem mehr.** Zwei Quellen, nicht eine:
   - Die stille Briefkasten-Prüfung beim Laden ist raus; das Badge kommt aus dem gemerkten
     Ergebnis des letzten Blicks (`localStorage`, app-eigener Schlüssel).
   - **Der eigentliche Brocken war `pingEndknoten()`** — für jeden Eintrag in `status.json` ein
     Abruf der fremden `sbkim/spore.json`: **15 Adressen, nacheinander, je 4 s Zeitlimit**, im
     schlimmsten Fall eine Minute im kritischen Pfad. Zweck: reine Kosmetik auf Karten weit
     unten („Lebendig" statt „Angedockt"). Läuft jetzt erst, wenn die Karten ins Bild kommen,
     und fragt alle **gleichzeitig**.
2. **Das Such-Widget wird nachgeladen** (62 KiB, davon 34 beim Start ungenutzt) — in einer
   Ruhepause nach dem Laden oder sofort bei der ersten Berührung.
3. **Die Einblendung bleibt, der LCP kommt trotzdem zurück.** Der Start-Bildschirm beginnt
   nicht mehr bei völliger Unsichtbarkeit, sondern bei `opacity: 0.35`. Ein Element mit
   `opacity: 0` gilt als noch nicht gemalt — der LCP wartete das ganze Einblenden ab.

### Gemessen

Fremd-Abrufe im echten Browser (Handy-Fenster):

```
beim Öffnen, vorher    15        nachher   0
Badge aus dem Merker   zeigt "4" bei 0 Abrufen
nach Druck auf 📬      Fenster öffnet, Abrufe starten
Such-Blase             nachgeladen und im Bild
```

Note und LCP, abwechselnd, je drei Läufe:

| | Leistung | LCP |
|---|---|---|
| **alt** | 72 · 72 · 72 | 6,8 · 7,5 · 7,5 s |
| **neu** | **77 · 74 · 77** | **5,0 · 5,8 · 5,0 s** |

**Median 72 → 77, LCP 7,5 → 5,0 s.** Bemerkenswert im Vergleich zu den zwei Messungen von
vorhin: der Stand **mit abgeschalteter Einblendung** lag bei 72 · 73 · 75 und LCP 4,9 · 6,4 ·
5,6 s. Die Seite ist jetzt also **besser als damals — und die Einblendung ist trotzdem an.**
Punkt 3 hat den Tausch aufgelöst, statt ihn zu gewinnen.

### Zwei Fehler von mir, festgehalten

1. **Mein erster Fix zielte daneben.** Ich hielt die Briefkasten-Prüfung für die Quelle der
   15 Abrufe und baute sie um — die Abrufe blieben. Sie holten `spore.json`, der Briefkasten
   holt `SIGNAL.json`; die Adressen hätten es mir sofort gesagt, wenn ich sie gelesen hätte
   statt meiner Vermutung zu folgen. Die Messung hat den Irrtum aufgedeckt, nicht das Gefühl.
2. **Die Klasse `erstanzeige` heißt jetzt das Gegenteil von vorher.** Am 2026-08-07 schaltete
   sie die Einblendung ab, heute lässt sie sie nur nicht bei Unsichtbarkeit beginnen. Der alte
   Kommentar ist um einen Nachtrag ergänzt, damit niemand die beiden verwechselt.

### Offen

- **Klaus' PageSpeed-Lauf** — lokal ist ein Hinweis. Sein letzter Handy-Wert war 63.
- **Die WebSocket-Verbindung zum Relais** (`wss://relay.family-projekt.de`) öffnet weiterhin
  beim Laden. Sie ist der Empfangsmodus und war nicht Teil der Entscheidung — aber sie liegt
  ebenfalls im kritischen Pfad und wäre der nächste Kandidat.

## Stand 2026-08-09 (2) — Discovery-Expedition: die Erde war nie ein Ei, nur gedehnt

**Rolle:** Fehlersuche + Fix. Klaus' Befund: *„In Discovery Expedition sieht die Erde noch aus
wie ein Ei. Sie ist nicht rund, wie man's erwartet."*

### Die Ursache — nicht dort, wo man zuerst sucht

Zwei naheliegende Verdächtige geprüft und **beide entlastet**:

- **Die Bilder.** `erde-blau.webp` und `erde-dunkel.webp` sind 1254 × 1254, und die Scheibe
  darin ist ein sauberer Kreis: gemessen aus drei verlässlichen Rändern (links, oben, unten —
  der rechte liegt im Schatten und taugt nicht) ergibt sich Mitte 611/621 bei Radius 522 px
  bzw. 614/620 bei 517 px. Rund, nur rund 14 px nach links und 6 px nach oben versetzt.
- **Die Maske im Shader.** Sie schneidet bei r = 0,425…0,445 vom **Bild**mittelpunkt. Der
  Versatz der Scheibe bringt ihren linken Rand auf 0,429 — knapp in die Ausblend-Zone, aber sie
  wird dort nur leicht gedimmt, nicht abgeschnitten. Die sichtbare Scheibe misst waagerecht wie
  senkrecht 0,833 UV. **Also rund.** Diese Erklärung trug nicht, und sie wurde verworfen.

**Der Fehler sitzt zwischen Zeichenfläche und Anzeigefläche.** Das Canvas ist per CSS
`width:100vw; height:100vh` groß. Auf Android-Chrome ist `100vh` die **große** Sicht (so, als
wäre die Adressleiste weg), während `window.innerHeight` die **aktuell sichtbare** Höhe meldet.
`renderer.setSize(w, h, false)` schreibt die CSS-Größe bewusst nicht (das dritte Argument heißt
`updateStyle`). Gezeichnet wurde also in ein Bild von 412 × 730, angezeigt wurde es auf
412 × 823 — der Browser zieht die Differenz glatt auseinander. **Alles um rund 13 % in die
Länge gezogen; ein Kreis wird zum Ei.**

### Der Fix

`resize()` misst jetzt an `canvas.clientWidth` / `clientHeight` — genau der Fläche, auf der das
Bild landet — statt am Fenster. Damit können die beiden per Bauart nicht mehr auseinanderlaufen.
Dazu lauscht die Seite zusätzlich auf `orientationchange` und `visualViewport.resize`, weil das
Ein- und Ausfahren der Adressleiste nicht immer ein `resize` am Fenster auslöst.

### Beweis — und was er NICHT zeigt

Der Tablet-Fall im Browser nachgebildet (`100vh` = 823 bei `innerHeight` = 730):

| | Zeichenfläche | Anzeigefläche | Dehnung senkrecht |
|---|---|---|---|
| alt | 412 × 730 | 412 × 823 | **1,127** |
| neu | 412 × 823 | 412 × 823 | **1,000** |

Das ist die Verzerrung selbst, direkt gemessen — nicht erschlossen. Nach einem Größenwechsel
bleiben beide Flächen gleich (900 × 600 / 900 × 600), keine Seitenfehler.

**Was der Beweis nicht leistet, ehrlich:** ein sauberes Vorher/Nachher-**Bild** der Erde gibt es
nicht. Headless existiert keine Adressleiste, der Fehler tritt dort also gar nicht auf; und die
Nachbildung ändert die Canvas-Höhe, was zugleich den Bildausschnitt verschiebt — eine
Silhouetten-Messung mischt dann zwei Wirkungen. Ein erster Versuch, die Scheibe im
Bildschirmfoto zu messen, meldete prompt **auch dort „Ei", wo nachweislich keine Dehnung
vorlag** (Kontrolle 1,094). Der Maßstab war untauglich und wurde verworfen statt hübsch geredet.

**Klaus' Blick aufs Tablet ist hier der Test.**

## Stand 2026-08-09 — Die Sage-Page blendet wieder ein (Klaus' Entscheidung)

**Rolle:** Pflege-Sitzung. Klaus' Wort: *„Nicht verschlechtern nur zu Testzwecken."* Danach
ausdrücklich: *„Einblendung aus PR #788 wieder herstellen."*

PR #788 hatte am 2026-08-07 die Einblende-Animation des Start-Bildschirms abgeschaltet
(`.screen.active.erstanzeige { animation: none }`), weil `fade-in` bei `opacity: 0` startet und
der Hero-Text darin das LCP-Element ist. Rückgängig gemacht sind genau diese zwei Stellen — die
CSS-Regel und die Klasse am `<main>`.

### Was es kostet — gemessen, abwechselnd, je drei Läufe

| | Leistung | LCP |
|---|---|---|
| **alt** (Einblendung aus) | 72 · 73 · 75 | 4,9 · 6,4 · 5,6 s |
| **neu** (Einblendung an) | 72 · 72 · 72 | 7,3 · 7,6 · 7,5 s |

Barrierefreiheit 100, Gute Praxis 96, SEO 100, CLS 0 — in allen sechs Läufen gleich.

**Die Note kostet es rund einen Punkt** (Median 73 → 72). **Der LCP kostet rund zwei Sekunden**
(Median 5,6 → 7,5 s). Das ist der Preis, und er steht damit hier.

### Zwei Dinge, die gegen mich selbst sprechen

**1. Meine Vorhersage war falsch.** Ich hatte Klaus „ungefähr sieben Punkte" angekündigt —
gestützt auf die Zahlen aus PR #788 (dort: 69·71 → 77·77). Gemessen sind es **etwa eins**. Die
alte Messung und die heutige widersprechen sich also deutlich. Warum, weiß ich nicht sicher:
die Bau-Maschine hat an verschiedenen Tagen verschiedene Grundwerte, und ob damals wirklich
abwechselnd gemessen wurde, steht dort nicht. **Wer die Note aus #788 als Argument verwenden
will, misst sie vorher nach.**

**2. Der erste Mess-Anlauf war falsch aufgesetzt.** Er startete alt und neu **gleichzeitig** —
beide auf demselben Prozessor, also beide verfälscht. Abgebrochen und sauber wiederholt
(abwechselnd, immer nur eine Messung zur Zeit). Genau davor warnt Regel 2 der Bauregeln.

### Ein Nebenbefund, der zum Nachdenken taugt

Mit Einblendung ist der LCP **stabil** (7,3 · 7,6 · 7,5), ohne sie **streut** er
(4,9 · 6,4 · 5,6). Das ist logisch: die Animation gibt dem größten Anstrich einen festen
Zeitpunkt; ohne sie hängt er davon ab, was gerade sonst fertig wird. Der abgeschaltete Zustand
war also nicht nur schneller, sondern auch **launischer** — und die 4,9 s aus dem besten Lauf
waren nie der Normalfall.

### Offen

- **Klaus' Blick auf die Live-Seite** — ob die Einblendung wieder so wirkt, wie sie soll.
- **Was die Sage-Page am Handy wirklich bremst** (PageSpeed 2026-08-09: **63** am Handy,
  **97** am Computer — dieselbe Messung, zwei Geräte, kein Vorher/Nachher) ist damit **nicht**
  beantwortet. Die Einblendung ist ein kleiner Posten. Der Bericht nennt die großen; gelesen
  hat sie noch niemand.

## Stand 2026-08-08 (2) — Postfach-Verjährung: Sages zwei größte Briefkästen von 1091 auf 324 Zeilen

**Rolle:** Pflege-Sitzung (Klaus' Freigabe: „Verjährung anwenden — kein Vorzug, Vorschlag
Sage zuerst"). Erste Anwendung von **INTERFACES §11.6.1** außerhalb von Mein-Tresor, wo die
Regel entstanden ist. Sage ist der Kanon-Knoten und trug die beiden größten Postfächer des
ganzen Netzes.

| Postfach | vorher | nachher | zusammengefasst |
|---|---|---|---|
| `sbkim/AUSTAUSCH.md` (⇄ SB·KIMTool·Point) | 653 | **204** | 11 Abschnitte + 17 Verlaufs-Zeilen |
| `sbkim/AUSTAUSCH-BookLedgerPro.md` | 438 | **120** | 8 Briefe + 6 Verlaufs-Einträge |

**Zusammengefasst wurde nur, was beide Bedingungen erfüllt:** älter als 30 Tage (alle
Einträge 2026-05-30 bis 2026-06-22) **und** von der Gegenstelle quittiert — Point führt
`ack["Sage-Protokol"] = 46`, BookLedgerPro führt `ack["Sage"] = 31`. Beides nachgesehen,
nicht angenommen.

**Nicht angetastet:** die Datenverträge (`SIGNAL.json`, `spore.json`, `*_inbox.json`,
`*.verify.md` — `git diff` darauf ist leer), die Status-Köpfe, der **Sync-Vertrag** in
`AUSTAUSCH.md` (ein Vertrag, keine Quittung) und **drei offene Bitten** an
SB·KIMTool·Point, auf die nie geantwortet wurde: Siegel-PNG gesucht · Speicher-Lehre 9 zur
Prüfung · Standalone-Such-Tool. Im Postfach der Gegenstelle nachgesehen — keine Antwort,
also bleiben sie stehen.

### Befund beim Nachprüfen (nicht nur umgeschichtet)

- **Sage schuldet BookLedgerPro noch `capVector`/`needsVector`.** Am 2026-06-21 zugesagt;
  die committete `sbkim/spore.json` trägt bis heute **weder das eine noch das andere**
  (nachgesehen: `domainVector` + `snippetVectors`, sonst nichts). Der Punkt stand bisher als
  Nebensatz in zwei Briefen — jetzt steht er als eigener **OFFEN-Block ganz oben** im
  Postfach, mit dem Weg dahin (Re-Sign über Modul 02 an Klaus' Tablet, der private Schlüssel
  lebt in der Browser-Identität). Solange gilt der vereinbarte `domainVector`-Rückfall.
- **Der Status-Kopf log leicht:** er nannte `ack[BookLedgerPro] = 15`, während `SIGNAL.json`
  18 führt. Auf 18 berichtigt.

### Hinweis an Klaus (nicht stillschweigend übergangen)

**Diese Datei ist bei 8405 Zeilen** — die Schutz-Klausel im Kopf nennt 3000 als Grenze und
sagt: „auslagern statt kürzen". Der Überlauf ist also nicht neu und nicht durch diese
Sitzung entstanden, aber er steht seit Längerem unbenannt da. Eine eigene Auslagerungs-
Sitzung nach `docs/sessions/archiv/` wäre fällig — **nicht** hier nebenbei, das wäre genau
das falsche Aufräumen, vor dem die Regel warnt.

### Offen / nächster Schritt

1. **Die übrigen Knoten mit großen Postfächern** — SB·KIMTool·Point (573 + 471),
   Jasons-Tresor (362), BookLedgerPro (630 auf deren Seite). Jeder räumt **nur im eigenen**
   Depot; das Muster steht jetzt zweimal vor.
2. **Sages cap/needs-Re-Sign** an Klaus' Tablet — der einzige echte Rückstand, den diese
   Prüfung zutage gefördert hat.
3. **PULS-Auslagerung** (siehe Hinweis oben).

## Stand 2026-08-08 — CLAUDE.md: die Falle im Abzweigen selbst

**Rolle:** Pflege-Sitzung (Klaus' Anweisung: „CLAUDE.md Absatz auch noch machen").

`git checkout -B <branch> origin/main` — der Befehl, den die Sitzungsstart-Pflicht
oben verlangt — hängt den **Upstream** des Branches auf `origin/main` um. Eine
Prüfung „habe ich alles veröffentlicht?", die gegen `@{upstream}` rechnet,
vergleicht danach mit `main` und meldet **sauber**, während der gleichnamige
Remote-Branch einen anderen Stand trägt.

Real passiert am 2026-08-08: die Sitzung meldete alle 31 Repos sauber, der
Stop-Hook fand im selben Moment einen unveröffentlichten Commit. Die Prüfung war
nicht falsch gerechnet — sie zielte aufs Falsche und gab der Sitzung recht.

Aufgenommen als eigener Unterabschnitt in CLAUDE.md § Sitzungsstart-Pflicht, mit
den zwei Befehlen, die wirklich tragen (`rev-list origin/<branch>..HEAD` +
`status --porcelain`) und der Einordnung des `--force-with-lease`-Pushes nach
einem Squash-Merge (erlaubt, solange der Branch nur gemergte Historie trägt).

**Tafel-Änderung, nicht stillschweigend:** CLAUDE.md ist eine heilige Tafel. Der
Absatz kam auf Klaus' ausdrückliche Anweisung; die Sitzung hatte den Befund
vorher benannt und um Erlaubnis gefragt (Tafel-Evolutions-Klausel).

**Gilt netzweit**, steht aber vorerst nur hier — die Übertragung in die anderen
Repo-CLAUDE.md ist ein eigener Schritt und wurde nicht mitgemacht.

---

## Stand 2026-08-07 — LCP 7,3 → 4,6 s: es war das Einblenden des Bildschirms

**Rolle:** Mess-/Pflege-Sitzung. Auslöser war die offene Frage aus dem
Übergabe-Brief in family-project: die gemeldete Skript-Zeit
(`docs/observatorium/vorteilspack.js`, 24,5 s) passe nicht zur gemeldeten
Blockierzeit (100 ms), eine der beiden Zahlen müsse in die Irre führen.

### Der Widerspruch war keiner — drei Fallen

- **Die 24,5 s sind keine Ausführungszeit.** Die Spalte `total` in
  „Skript-Ausführungszeit reduzieren" ist die Hauptthread-Zeit, die dem
  **Aufgabenbaum** des Skripts zugerechnet wird, samt Layout und Malen. Die
  Ausführung steht daneben: **1.052 ms**, Parsen 5 ms.
- **TBT deckt nur ein Fenster ab** (zwischen FCP und TTI). Klein heißt nicht
  „Hauptthread frei".
- **Lighthouse misst voreingestellt `simulate`.** Im selben Bericht steht LCP
  **7.563 ms simuliert** neben **847 ms beobachtet**; die LCP-Aufschlüsselung
  rechnet beobachtet, die Kennzahl oben simuliert.

### Die Ursache: eine einzige CSS-Regel

Der LCP ist `p.hero-claim`, **reiner Text**, TTFB 22 ms — die ganze Zeit ist
Render-Verzögerung. Der Text liegt in `.screen.active`, und dessen
`fade-in`-Animation startet bei `opacity: 0`. Der größte Anstrich wartet also
auf das Ende der Einblendung.

`<main id="screen-overview">` trägt `active` **fest im HTML**, und **kein
einziges Skript** setzt die Klasse je auf einen anderen Bildschirm. Die
Einblendung spielt also genau einmal: auf der Seite, die ohnehin schon da ist.
Ein Übergang *in die Sicht hinein* für etwas, das nicht von außen kommt.

**Behoben** mit einer Regel + einer Klasse: `.screen.active.erstanzeige {
animation: none }`, Marker am Start-Bildschirm. Bildschirme, die später aktiv
werden, blenden unverändert ein.

| gegen `origin/main`, Handy, im Wechsel | Leistung | FCP | LCP |
|---|---|---|---|
| vorher | 69 · 71 | 2,6 · 2,7 s | 7,6 · 7,3 s |
| nachher | **77 · 77** | 2,7 · 2,7 s | **4,6 · 4,7 s** |

Der **erste** Anstrich ist unverändert. Nur der **größte** rückt um 2,7 s vor.

### Zwei Fehlschlüsse auf dem Weg — festgehalten, damit sie niemand wiederholt

Der Verdacht fiel zuerst auf die acht dauernd laufenden Animationen
(`non-composited-animations`). Alle abzuschalten brachte tatsächlich 82 statt
66. Die naheliegenden Schuldigen waren es aber **beide Male nicht**:

| Fassung (Wegwerf-Kopie unter `/tmp`) | Leistung | LCP |
|---|---|---|
| nur die 6 Animationen unterhalb des Bildschirms aus | 72 · 72 | 7,3–7,5 s — **unverändert** |
| nur der Puls der Verkehrs-Lampe aus | 70 · 71 · 70 | 7,3–7,6 s — **unverändert** |
| nur das Einblenden aus | **77 · 79 · 76 · 77** | **4,5–5,0 s** |

Die Lampen-Animation über `box-shadow` sah teuer aus (wachsender Schein,
nicht kompositierbar) und ist auf 9 × 9 Pixeln schlicht zu klein, um zu zählen.
**Vom Mechanismus auf die Größenordnung zu schließen ist der Fehler**, der
zweimal hintereinander passiert ist. Nur die Gegenprobe entscheidet — und
zwar auch die auf den *Vorschlag*, nicht nur die auf die Ursache.

### Offen

- **Klaus' Browser-Sichttest.** Die Seite erscheint jetzt ohne die halbe
  Sekunde Einblenden. Wirkt das zu abrupt?
- **PageSpeed** an der live ausgelieferten Seite. Alle Zahlen hier sind lokal.
- Die zwei Lampen-Animationen (Verkehr, Siegel) bleiben unangetastet — sie
  kosten messbar nichts. Klaus' Wunsch, den Verkehrs-Puls durch einen kurzen
  Farbwechsel zu ersetzen, steht als **Geschmacks**-Änderung offen, nicht als
  Reparatur.

---

## Stand 2026-08-04 (später) — Kontrast: 21 von 26 Beanstandungen behoben

**Rolle:** Pflege-Sitzung (Klaus' Auftrag: „die 12 MB Bilder mit dem Kontrast").

### Die 12 MB Bilder gibt es nicht mehr — sie waren schon erledigt

Der Auftrag stammte aus einem Befund am **alten** Stand: fünf PNG-Dateien mit
rund 12 MB hingen in der Startseite. Auf `origin/main` liegen dort längst
WebP-Fassungen — **zusammen 408 KiB**:

| Datei | Größe |
|---|---|
| `assets/meilenstein-2026-07-23-web.webp` | 117 KiB |
| `assets/meilenstein-2026-07-10-web.webp` | 97 KiB |
| `assets/meilenstein-2-web.webp` | 67 KiB |
| `assets/meilenstein-1-web.webp` | 63 KiB |
| `assets/meilenstein-web.webp` | 61 KiB |

Nichts zu tun. Festgehalten, damit die nächste Sitzung nicht dieselbe Sackgasse
sucht — und als Beleg für die Sitzungsstart-Pflicht ganz oben in CLAUDE.md: der
Befund war eine Aussage über einen Stand, der schon nicht mehr galt.

### Der Kontrast: `--dim` war die Ursache für 21 der 26 Fundstellen

Gemessen gegen den Seitengrund `#08081A`:

| | vorher | Verhältnis | nötig | jetzt |
|---|---|---|---|---|
| `--dim` | 0.36 | **3,08 : 1** | 4,5 : 1 (ab 0.47) | **0.50 → 4,99 : 1** |

Betroffen waren `.card-tag`, `.mod-num` und `.module-list-divider`. Der Wert
0.50 statt der nötigen 0.47 gibt etwas Luft und hält die Abstufung sauber:
voll 1.0 > `--muted` 0.62 > `--dim` 0.50.

### Neuer Wächter — und warum es ihn brauchte

`tests/smoke_lighthouse_module.mjs` rechnete schon Kontrast, aber über
`--sbkim-widget-fg-dim` — die Variable des **Widget-Moduls**. Die Seite hat eine
eigene, gleichnamige Idee (`--dim` in `index.html`), und die war **nie gedeckt**.
Der Test liest sie jetzt direkt aus `index.html` (keine zweite Zahlenliste, die
auseinanderläuft) und prüft dreierlei: `--dim` ≥ 4,5 : 1, `--muted` ≥ 4,5 : 1,
und dass `--dim` leichter bleibt als `--muted` — sonst „repariert" eine spätere
Sitzung den Kontrast, indem sie beide gleichzieht, und die Seite verliert ihre
Tiefe.

**Gegenprobe:** `--dim` auf 0.36 zurück → die Probe fällt durch mit
„abgeblendete Seiten-Schrift 3.08:1 (Soll 4.5)". 23 grün statt 17.

### Gemessen (drei Läufe, Bau-Maschine)

| | Wert |
|---|---|
| Leistung | 72 · 72 · 72 |
| Barrierefreiheit | 93 (unverändert — siehe unten) |
| CLS | 0 |

Die Zahl bleibt bei 93, weil vier Fundstellen offen sind. Das ist **kein**
Fehlschlag der Reparatur: 21 von 26 sind weg, die restlichen vier hängen an
einer heiligen Tafel.

### ⚠ OFFEN — Anpassungs-Antrag an Klaus (Tafel-Evolutions-Klausel)

Die vier verbliebenen Fundstellen sind `.badge`-Elemente in der Modul-Liste.
Sie tragen die **Status-Farben** aus `docs/INTERFACES.md §5` — der Tafel, die
sich selbst als „die **eine Quelle**" bezeichnet und exakte Hex-Werte nennt,
„identisch verwendet" in Markdown-Karten, Mermaid-Diagrammen, dem PULS-Pie und
der Sage-Page.

Gemessen gegen `#08081A`:

| Status | Hex | Verhältnis | |
|---|---|---|---|
| schablone | `#92400E` | **2,79 : 1** | zu dunkel |
| stub | `#2563EB` | **3,83 : 1** | zu dunkel |
| werkstatt | `#EA580C` | 5,57 : 1 | ok |
| fertig | `#16A34A` | 6,01 : 1 | ok |
| spec | `#CA8A04` | 6,74 : 1 | ok |
| nextup | `#F4B435` | 10,78 : 1 | ok |

Zwei von sechs Farben sind auf dunklem Grund nicht lesbar genug. **Nicht
stillschweigend geändert** — die Tafel bindet die Werte. Klaus entscheidet;
drei Wege standen in der Chat-Antwort (Farben aufhellen / Abzeichen umbauen /
liegen lassen).

### ✅ Erledigt am selben Tag — Klaus: „machen wir bei Sage Protokoll die Statusfarben"

**Barrierefreiheit jetzt 100** (von 93 über 97 auf 100, drei Läufe bestätigt).

**Was gemacht wurde.** Der Kern des Befundes war eine **Doppelrolle**: dieselbe
Farbe ist *Füllung* (Punkt, Modul-Lampe, Mermaid-Knoten) **und** *Schrift* im
`.badge`. Als Füllung ist ein dunkles Braun gut; als Schrift auf Dunkel fällt es
durch. Ein Hexwert kann beide Rollen nicht gleich gut bedienen — das ist keine
Meinung, sondern die Rechnung.

Beide durchgefallenen Farben sind auf **demselben Farbton** aufgehellt worden:

| Status | alt | neu | Badge-Schrift | Weiß auf Füllung |
|---|---|---|---|---|
| schablone | `#92400E` | **`#A9714B`** | 2,88 → **5,01 : 1** | 7,09 → 4,08 |
| stub | `#2563EB` | **`#4479EE`** | 3,95 → **5,07 : 1** | 5,17 → 4,03 |

Die anderen vier bleiben unverändert. Zwei Nebenbedingungen wurden mitgeprüft:

- **Unterscheidbarkeit.** Braun wird beim Aufhellen zu Orange — und Orange ist
  schon `werkstatt`. Deshalb ein gedämpftes Erdbraun (ΔE 49,7 zu `#EA580C`),
  kein helles Orange.
- **Weiß auf Füllung** (Mermaid) sinkt zwar, liegt mit 4,08 / 4,03 aber
  **über** `werkstatt` (3,56), `fertig` (3,30), `spec` (2,94) und `nextup`
  (2,15). Die Diagramme werden dadurch nicht schlechter, sondern gleichmäßiger.

**Tafel zuerst, dann Code** (INTERFACES-Regel eingehalten): `docs/INTERFACES.md
§5` trägt jetzt die neuen Werte, die Messung, die Regel für Folge-Sitzungen
(„eine Status-Farbe wird in **beiden** Rollen gemessen") und eine **Abgrenzung**
— die `classDef`-Zeilen in den Komponenten-Karten (00/03/08/12/14/15) benutzen
dieselben Hexwerte für *Diagramm-Rollen* (`agent`, `pwa`, `store`, …), haben mit
Modul-Status nichts zu tun und bleiben unangetastet. Nachgezogen wurden
`index.html` (CSS-Variablen + `STATUS_META` + Lampen-Schein) und
`docs/ARCHITEKTUR.md` (Bau-DAG). Der PULS-Pie führt keine Hexwerte.

**Die letzten drei Punkte** (97 → 100) waren etwas anderes:
`link-in-text-block` (Gewicht 7) — der Verweis in `.legal-line` hob sich
**allein durch die Farbe** ab. Jetzt unterstrichen. Übrig bleibt nur
`label-content-name-mismatch` mit **Gewicht 0** — kostet keinen Punkt.

**Wächter** (`tests/smoke_lighthouse_module.mjs`, 23 → **40 Proben**): liest die
sechs Werte **aus `index.html`** (keine zweite Liste = keine zweite Wahrheit),
rechnet jede als Badge-Schrift nach, vergleicht CSS-Variable gegen `STATUS_META`
(die stehen 2000 Zeilen auseinander und driften sonst lautlos) und prüft den
Farbabstand schablone↔werkstatt.

**Gegenprobe, beide Richtungen:** `#92400E` zurückgesetzt → 2 rot (Kontrast +
Abweichung zur JS-Karte). Braun „repariert" zu Orange `#E86A18` → 1 rot
(ΔE 9,4). Der Wächter greift also wirklich, nicht nur formal.

**Nebenbefund, nicht geändert:** `--status-nextup` steht in `index.html` auf
`#F4B435`, die Tafel nennt `#F59E0B`. Beide bestehen den Kontrast; es ist eine
reine Doku-Drift. Nicht angefasst, weil es eine Farbe ändern würde, die Klaus
sieht — eigener kleiner Folge-Schritt.

**Werkzeug verbessert:** `family-project/tools/lh-messen.mjs` nennt jetzt **alle**
durchgefallenen Prüfungen der Barrierefreiheit statt einer fest eingebauten
Auswahl. Die alte Liste hat genau die Beanstandung versteckt, die man noch nicht
kannte — bei 97 statt 100 suchte man im Dunkeln.

---

## Stand 2026-08-04 — Sage-Page: CLS 0,328 → 0, Leistung 45 → 67

**Rolle:** Bau-/Pflege-Sitzung (Sage-Page-Leistung). Zwei Eingriffe, jeder einzeln gemessen.

### 1. Der CLS kam nicht von der Schrift — er kam vom eigenen Siegel

Der Bericht nannte nur `div.wrap 0,326`. Das ist der Container, nicht die Ursache.
Ein `PerformanceObserver` auf `layout-shift`, der **vor** dem Laden hängt und das Feld
`sources` ausliest (gedrosselt wie die echte Messung), zeigte etwas Eindeutiges:
**ein einziger Sprung, bei 17,4 s.**

`fonts.ready` lag bei **15,5 s** — also *davor*. Der Verdacht auf die Google-Fonts-
Einbindung war damit **widerlegt**, bevor eine Zeile Code geschrieben wurde.

Der Sprung kam vom **SBKIM-Siegel selbst**. Modul 16 hängt sein 40 px hohes Badge erst
nach dem ganzen Modul-Stapel in `.lamps`. Die Topbar (`flex-wrap`) wuchs dadurch um eine
Zeile — die Messung zeigt den „Frisch laden"-Knopf um **72 px nach unten** in eine neue
Reihe rutschen — und schob `div.wrap` um **32 px**. Ein Viertel der Leistungsnote, aus
einem Element, das die Seite sich selbst anheftet.

Modul 16 kennt für genau diesen Fall einen **vor-injizierten Anker** (Option β, im
Modul-Kopf dokumentiert). `index.html` legt ihn jetzt leer in `.lamps`, `sbkim-init.js`
zeigt mit `badgeSelector` darauf. Der Platz steht ab der ersten Zeichnung.

**Das Sicherheits-Modul bleibt unangetastet.** Anti-Greenwashing gilt weiter: ohne
Zertifizierung füllt Modul 16 den Anker nicht — es wird kein Siegel gezeigt, nur Platz
gehalten.

### 2. Schriften selbst gehostet

Vorher blockierte ein `<link>` auf `fonts.googleapis.com` das erste Zeichnen um rund
750 ms, samt DNS/TLS und einem **zweiten** Ursprung für die Dateien selbst. Genau das
steckte in Klaus' Server-Messung als „Verzögerung beim Rendering des Elements"
**1.950 ms** am LCP-Element `p.hero-claim` — reiner Text.

Jetzt liegen vier `woff2` unter `assets/fonts/` (es sind **variable** Schriften, eine
Datei je Schnitt deckt 300–700 bzw. 400–500 ab), die `@font-face`-Regeln stehen im
vorhandenen `<style>`. Vorabgeholt werden nur die beiden `latin`-Dateien (52 KiB); die
`latin-ext`-Fassung holt der Browser nur, wenn ein Zeichen aus ihrem `unicode-range`
vorkommt — bei deutschem Text nie.

**Nebenbefund, der die alte Messlage erklärt:** auf der Bau-Maschine kam Google Fonts
**nie an**. `fonts.ready` bei 15,5 s, und *keine einzige* Schrift geladen. Die Seite hat
also durchweg in der Systemschrift gezeichnet. Jetzt sind beide Schriften nach **789 ms**
da. Die Seite hält ihr Offline-Versprechen erstmals auch bei den Schriften.

### 3. Verworfen — den Modul-Stapel zurückstellen

Aufgabe 2 des Briefs (BLP-Muster: 25 Modul-Dateien ans `load`-Ereignis, `async=false` für
die Reihenfolge) wurde gebaut und gemessen: **LCP 7,6 s → 8,4 s, kein Punkt gewonnen**,
reproduzierbar über drei Läufe. **Zurückgenommen.** Der Grund gehört in den nächsten Brief:
der kritische Pfad ist real, aber am Ende des `<body>` blockieren die Skripte das Zeichnen
schon heute nicht — sie später zu holen verschiebt nur ihre Kosten hinter den LCP-Zeitpunkt.

### Zahlen (Bau-Maschine, je 3 Läufe, gleiche Maschinenlage)

| Zustand | Leistung | CLS | LCP |
|---|---|---|---|
| `origin/main` | 45 · 45 · 45 | 0,328 | 7,1 s |
| nur Platz-Anker | 61 · 61 · 59 | **0** | 7,1 s |
| + Schriften selbst gehostet | **66 · 67 · 69** | **0** | 7,6 s |
| (verworfen) + Stapel zurückgestellt | 62 · 63 · 64 | 0 | 8,4 s |

Der Ausgangswert wurde in derselben Maschinenlage frisch nachgemessen (`git archive
origin/main`), nicht aus dem alten Protokoll übernommen — eine erste Messreihe hatte
zwischen 34 und 60 geschwankt, das war Maschinenlärm.

### Beweise

- **CLS-Ursache:** ein einziger Sprung, mit Quell-Element und Zeitpunkt. Gegenprobe nach
  dem Eingriff: **0,0000 aus 0 Sprüngen.**
- **Siegel funktional gegengeprüft** (Chromium, `serviceWorkers: "block"`): Anker gefüllt,
  `role=button`, `tabindex=0`, `data-stufe="gold"`, 40 × 40 px, Modal öffnet auf Klick,
  **keine Seitenfehler**.
- **Tests 64 von 66 grün.** Die zwei roten (`smoke_bau23_0b_identitaet`,
  `smoke_bau23c_ki_richter`) sind per Gegenprobe **auch auf blankem `origin/main` rot** —
  vorbestehend. Nebenbei: 21 Tests scheiterten zunächst nur an der fehlenden
  Test-Abhängigkeit `fake-indexeddb`; nach `npm install fake-indexeddb --no-save` laufen sie.
  **Das gehört in die Sitzungs-Vorbereitung** — sonst hält man 21 gesunde Tests für kaputt.

### Was offen blieb / nicht geprüft

- **Klaus' Browser-Sichttest.** Besonders: sitzt das Siegel in der Topbar noch richtig, und
  wirkt die Seite mit der jetzt wirklich geladenen Geist-Schrift wie gewohnt?
- **Nachmessung am echten Server** — der Ausgangs-Proxy dieser Umgebung verweigert
  `github.io` (403). Alle Zahlen stammen von der Bau-Maschine.
- **Der Schrift-Gewinn ist lokal untertrieben.** Die Bau-Maschine erreichte Google Fonts
  gar nicht, der Ausgangszustand hat die 52 KiB also nie bezahlt. Trotzdem stieg die Note
  von 61 auf 67. Am Server, wo die Schriften wirklich über den fremden Ursprung kommen,
  sollte der Gewinn **größer** sein — belegt ist das aber erst nach Klaus' Messung.
- **`docs/papers/sbkim-paper-de.html` und `-en.html`** binden weiterhin Google Fonts ein
  (andere Familien: Source Serif 4, Source Code Pro, Inter). Bewusst nicht angefasst —
  eigener Umfang.
- **BookLedgerPro `wss://relay.family-projekt.de/` nicht auflösbar:** Klaus' Antwort
  (2026-08-04) — **das Relais soll wieder aufgesetzt werden, nichts ändern.** Bleibt
  unverändert stehen.
- **Kritischer Pfad / Hauptthread** der Sage-Page bleibt offen (Klaus' Bericht: 2.662 ms
  bzw. 4,4 s). Der einfache Weg (Zurückstellen) ist gemessen widerlegt; der nächste Ansatz
  müsste an der Menge ansetzen, nicht am Zeitpunkt.

**Nächster sinnvoller Schritt.** Klaus' Server-Messung abwarten und gegen die 67 halten —
erst danach lohnt der nächste Leistungs-Eingriff.

---

## Stand 2026-08-03 — Lampen-Leiste barrierefrei (netzweit) + Sage-Page-Bilder 16,2 MB → 0,7 MB

**Rolle:** Bau-/Pflege-Sitzung (Kanon Modul 17 + 23 UI, netzweiter Rollout, Bild-Pflege).

**Was getan.**

*Modul 17 + 23 UI — drei Mängel, jeder einzeln gemessen.* Lighthouse meldete an
BookLedgerPro Kontrast und Berührungsziele an der Lampen-Leiste.
1. **Berührungsziele:** Lampen-Knöpfe 54,5 × 18,6 px, die kleinen `−`/`✕` 18 × 18 px —
   Norm ist 24 × 24. Jetzt `min-height: 24px` an den Slots (NUR die Höhe; ein `min-width`
   bräche das Zusammenschieben im minimierten Zustand) und 24 × 24 an den Knöpfen.
2. **Der 🌐-Knopf lag AUF der Leiste.** Auf 412 px Breite reicht die Leiste bis nach links;
   der Knopf unten links lag mitten auf der LEBT-Lampe, nur 8,2 px blieben frei. Das war die
   eigentliche Ursache dafür, dass der Prüfer beide Elemente zugleich meldete. **Klaus'
   Entscheid:** der Knopf rückt unter 560 px hoch (Modul 23 UI, eingehängte Medien-Abfrage
   mit `!important`, weil die Position inline am Element steht).
3. **Dadurch wurde ein verdeckter Mangel sichtbar:** der Knopf schrieb in der Akzentfarbe
   der App — bei BookLedgerPro dunkles Petrol auf dunklem Grund, **1,35:1** statt 4,5:1.
   Jetzt dieselbe Schriftfarbe wie das Panel, Akzent bleibt als Rahmen.

*Befund beim Rollout (wichtig).* Mein-Rezeptbuch, Muttis-Rezeptbuch und Mein-Mixarium trugen
seit 2026-06-28 einen **eigenen** Fix, der nie in den Kanon zurückkam: app-eigene
`localStorage`-Schlüssel (`WIDGET_SCOPE`). Ein byte-1:1-Rollout hätte ihn stillschweigend
ausgebaut. Er wurde **zuerst in den Kanon geholt** — der Kanon ist jetzt die Obermenge, die
übrigen zehn Träger bekommen den Fix mit dazu. (CLAUDE.md § Fremdnutzer-Brille verlangt genau
das.) Gefunden wurden zwei Träger übrigens **nur** über einen Inhalts-Abgleich aller
`.js`-Dateien: Kim-Bell und Mein-WorkFloh führen das Modul unter dem Namen
`sbkim-floating-widget.js` — die Suche nach Dateinamen hätte sie übersehen.

*Sage-Page-Bilder.* Klaus' Bericht: 17,4 MB Gesamt-Nutzlast, davon 16,2 MB Bilder. Die
Meilenstein-Kacheln luden Bildschirmfotos mit 1254 × 1254 und je ~2,2 MB — dargestellt als
312 × 312 große Kachel-Hintergründe. Über den vorhandenen Chromium in WebP umgerechnet
(kein cwebp/PIL/sharp in dieser Umgebung): **16.236 KiB → 688 KiB**. Die Originale bleiben
liegen, sie sind aus Doku-Dateien verlinkt; geändert wurde nur, worauf die Seite zeigt.

**Zahlen.**

| | vorher | nachher |
|---|---|---|
| BookLedgerPro Barrierefreiheit | 92 | **100** |
| BookLedgerPro Leistung (Median aus 3) | 88 | **91** |
| BookLedgerPro LCP (echt gedrosselt, je 5 Läufe) | 1.748 ms | **1.028 ms** |
| Sage-Page LCP | 48,8 s | **7,1 s** |
| Sage-Page Bilder | 16,2 MB | **0,7 MB** |

**Tests.** `smoke_bau17` 38/38, `smoke_bau23_rendezvous_ui` **91/91** (4 neue Proben für die
Ausweich-Regel; **Gegenprobe**: ohne den Fix fallen genau diese 4), `smoke_bau23_rendezvous`
59/59, `smoke_bundle_connect` 21/21. Die DOM-Attrappe im 23-UI-Smoke kannte kein
`setAttribute`/`getElementById` — nachgezogen. Netzweite Verifikation nach den Merges:
**29/29 Dateien in 15 Repos tragen den Kanon, 0 Abweichungen.**

**Was offen blieb.**
- **Klaus' Browser-Sichttest** überall. Besonders: sitzt der 🌐-Knopf auf dem Handy gut, und
  sehen die verkleinerten Sage-Page-Kacheln noch scharf aus?
- **Der Ausgangs-Proxy dieser Umgebung verweigert `github.io` (403)** — die Nachmessung am
  echten Server konnte ich nicht selbst machen. Alle Zahlen stammen von der Bau-Maschine.
- **Sage-Page CLS 0,328** — das ist jetzt der mit Abstand größte Posten (ein Viertel der
  Note) und der Grund, warum die Leistung trotz LCP 48,8 s → 7,1 s nur von 44 auf 45 steigt.
  Der Sprung kommt laut Bericht aus `div.wrap`; der Verdacht liegt auf der **Google-Fonts-
  Einbindung** (blockiert 780 ms, Schrift tauscht nach dem ersten Anstrich). Nicht angefasst
  — das gehört gemessen, nicht geraten.
- **Sage-Page lädt ~25 Modul-Dateien und Dutzende `spore.json`/`SIGNAL.json` sofort**
  (kritischer Pfad 2.662 ms). Eigene Sitzung wert.
- **BookLedgerPro:** die Konsole meldet `wss://relay.family-projekt.de/` als nicht
  auflösbar. Kostet Punkte bei „Gute Praxis"; **Infrastruktur-Frage an Klaus**, bewusst
  nichts geändert.

### Nachtrag — Klaus' Server-Messung der Sage-Page (2026-08-03, 23:03, mobil)

Die erste Messung **am echten Server** nach dem Merge (PageSpeed Insights,
`lausiklauskn-png.github.io/Sage-Protokol/`, Mobil):

| | Server 23:03 | Bau-Maschine |
|---|---|---|
| Leistung | **47** | 45 |
| Barrierefreiheit | 93 | 93 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |
| FCP | 4,2 s | — |
| LCP | 9,2 s | 7,1 s |
| TBT | **0 ms** | 50 ms |
| CLS | **0,326** | 0,328 |

**Was das belegt — und was nicht.**

- **Server und Bau-Maschine liegen für diese Seite eng beieinander** (47 gegen 45,
  CLS 0,326 gegen 0,328). Damit ist die lokale Messanlage für die Sage-Page
  belastbar; man muss nicht für jeden Schritt auf Klaus warten. Das ist dasselbe
  Bild wie beim Schaufenster (zwei Punkte Abstand).
- **Der CLS ist am Server bestätigt.** 0,326 — das ist ein Viertel der Note und
  mit Abstand der größte verbliebene Posten. Die Diagnose stimmt also, sie war
  kein Artefakt der Bau-Maschine.
- **TBT ist am Server 0 ms** (lokal 50). Der Hauptthread ist nicht das Problem.
- **Ehrlich offen:** es gibt **keine** Server-Zahl von VOR der Bild-Pflege. Die
  Verbesserung LCP 48,8 s → 7,1 s ist damit **nur auf der Bau-Maschine belegt**,
  nicht am Server. Was ohne Messung feststeht: die Seite holt jetzt **0,7 MB statt
  16,2 MB** Bilder — das ist eine Eigenschaft der Dateien, keine Schätzung.
- Der LCP liegt am Server 2 s höher als lokal (9,2 gegen 7,1 s). Das passt zu
  echter Latenz und dem, was der kritische Pfad zeigt (2.662 ms, ~25 Modul-Dateien
  und Dutzende `spore.json`-Abrufe beim Start).

**Nächster sinnvoller Schritt.** Sage-Page CLS 0,326 einkreisen (zuerst messen, welches
Element wann springt), dann die Schrift-Einbindung entscheiden. Der Wert ist jetzt
beidseitig — lokal und am Server — bestätigt.

---

## Stand 2026-08-02 — Pinnwand: Lighthouse-Verbesserungen aus Kimboard nachgezogen

**Rolle:** Pflege-Sitzung · **Branch:** `claude/mein-rezeptbuch-lighthouse-w26lsr`

**Was getan.** Die drei Befunde aus Klaus' Kimboard-Lighthouse-Bericht (dort PR
#83) auf die **Pinnwand** übertragen — sie hatte dieselben Stellen, weil
Kimboard aus ihr hervorgegangen ist.

1. **Das Logo war 474 KiB groß für ein 64-Pixel-Bild.** Oben hing
   `icon-512.png`, dargestellt mit 64 px; dazu `icon-192.png` (77 KiB) als
   Tab-Symbol. Neu: **`icon-128.png` (37 KiB) für beides** — gleiche Adresse,
   ein Download. Die Datei ist **byte-gleich** zu Kimboards (die Symbole sind
   in beiden Repos dieselben, sha256 stimmt überein). Die großen Dateien
   bleiben unberührt; sie gehören ins Manifest, wo das Betriebssystem sie beim
   Installieren wirklich braucht.
2. **Die Seite sprang beim Laden.** Die Relais-Leiste stand **leer** im HTML
   und wurde erst von `relayPills()` gefüllt — also erst, wenn die Modul-Kette
   geladen war. Neu steht sie fertig im HTML, im voreingestellten Zustand,
   wörtlich so wie der Code sie gleich darauf erzeugt. Dazu `#me`/`#selftest`
   auf ihre Endbreite festgehalten (die Kennung wächst von 1 auf 13 Zeichen).
3. **Die App-Schale holte Dinge doppelt.** Das Dokument kam dreimal
   (Navigation auf `/`, plus `./` und `./index.html` im Vorrat — für den Cache
   drei Adressen, dieselbe Datei), und der Vorrat holte beide großen Symbole,
   die die Seite gar nicht zeigt. `CACHE_VERSION` v19 → v20.

Nebenbei: fünf Bedienelemente hatten keinen Namen für Vorlese-Programme
(`boardkey`, `qmsg`, `judgeprov`, `judgekey`, `webllmmodel`), und die Seite
hatte keinen `<main>`-Bereich. Beides ergänzt, sichtbar ändert sich nichts.

**Gemessen** (Erstbesuch, leeres Profil, Server mit GitHub-Pages-Kopfzeilen —
`max-age` + ETag):

| | vorher | nachher |
|---|---|---|
| vom Server ausgeliefert | 820 KiB | **227 KiB** (−593, −72 %) |
| Layout-Sprung (CLS) | 0,178 | **0,002** |

**Gegenproben.** (a) Offline starten `/`, `/index.html` und `/impressum.html`
alle drei aus dem Cache, Relais-Leiste sofort da. (b) Ein zusätzliches Relais
im `RELAY_POOL`, ohne das HTML nachzuziehen, macht **drei Proben rot** — die
neue Probe 7 schlägt also wirklich an, sie ist nicht nur grün. (c) Das
Vorher/Nachher wurde am **selben** Server gemessen, per `git stash` umgeschaltet.

**Preis der Lösung, offen benannt.** Die Relais-Liste steht jetzt an **zwei**
Stellen (HTML + `RELAY_POOL`). Wer eine ändert und die andere vergisst, baut
eine stille Lüge in die Seite — sie zeigte beim Start etwas anderes als eine
Sekunde später. `pinnwand/_smoke.mjs` **Probe 7** vergleicht beide und wird
rot. Diese Probe gehört untrennbar zur Lösung.

**Eine eigene Fehlannahme, korrigiert.** In Kimboard war zwischenzeitlich eine
Verzögerung eingebaut (Vorrat erst nach `load`). Grundlage war eine Messung von
3529 KiB — gegen einen Prüf-Server **ohne** Cache-Kopfzeilen. Gegen einen
Pages-ähnlichen Server war der Unterschied dann **exakt null**: der Browser legt
gleichzeitige Anfragen für dieselbe Adresse von selbst zusammen. Die
Verzögerung wurde wieder ausgebaut. **Merksatz** (steht im Kopf beider `sw.js`):
*einen Prüf-Server ohne Cache-Kopfzeilen zu benutzen, misst nicht die Seite,
sondern den Prüf-Server.*

**✅ NACHGETRAGEN 2026-08-02 19:55 — Klaus' Messung bei Googles PageSpeed
(mobil), an der live deployten Seite:**

| Leistung | Barrierefreiheit | Best Practices | SEO |
|---|---|---|---|
| **100** | **100** | **96** | **100** |

Damit ist der Browser-Lauf erledigt und die Vorhersage bestätigt — die
headless gemessene Ersparnis (820 → 227 KiB) und der beseitigte Sprung
(0,178 → 0,002) schlagen tatsächlich durch. Die fehlenden 4 Punkte bei „Best
Practices" sind aller Wahrscheinlichkeit nach genau die **Relais-Fehler in der
Konsole**, die bewusst NICHT angefasst wurden (die Meldung „WebSocket
connection failed" kommt vom Browser selbst und ist aus dem Code nicht zu
unterdrücken). Das ist keine Nachlässigkeit, sondern die benannte Grenze —
und sie kostet vier Punkte.

**Was offen bleibt.**
- **Die Relais-Fehler in der Konsole** (`nos.lol`, `damus`, `nostr.band`,
  `primal`, `family-projekt.de`) wurden **nicht** angefasst: die Meldung
  „WebSocket connection failed" kommt vom Browser selbst und ist aus dem Code
  nicht zu unterdrücken. Vier der fünf sind bekannte, funktionierende
  öffentliche Relais. `relay.family-projekt.de` ist das bekannte tote eigene
  und liegt weiter bei Klaus.
- Ein Rest-Sprung von 0,002 kommt von zwei Auswahlfeldern, die beim Füllen ein
  paar Pixel breiter werden. Dafür müsste eine Breite geraten werden.

**Nächster sinnvoller Schritt.** Klaus misst die Pinnwand bei PageSpeed nach.
Danach dieselben drei Stellen an den übrigen Endknoten prüfen — das Muster
(zu großes Logo · leere Bereiche, die später gefüllt werden · `./` und
`./index.html` beide im Vorrat) ist offenbar netzweit kopiert worden.

**Prüfungen:** `node pinnwand/_smoke.mjs` **67/67** (vorher 62/62, fünf neue),
`node tests/smoke_pinnwand_dm.mjs` 16/16.

---

## Stand 2026-07-31 — Tafel-Anpassung: Vektoren für den offenen Marktplatz

**Rolle:** Pflege-Sitzung · **Branch:** `claude/modul23-stufe2b-rollout-vpzaar`

**Was getan.** Die Tafel in `docs/components/_toolpoint_marktplatz.md` („Keine
Vektoren im Listing — `passageVec` lazy zur Laufzeit") wurde **mit Klaus'
ausdrücklicher Zustimmung** angepasst, nicht still umgangen. Neu gilt gestaffelt:
unter ~20 Einträgen weiter lazy (so bleiben die Sage-Korpora), für den **offenen
Marktplatz** vorberechnete Vektoren in einer getrennten, faul geladenen
Katalog-Datei mit Modell-Kennung und Rückfall auf den lazy Weg.

**Warum.** Die alte Fassung entstand für 14 Sage-Knoten. `markt.html:396` rechnet
die Passagen-Vektoren bei **jedem Besuch neu** (nur RAM); bei 100 fremden Apps
sind das grob 3–8 Sekunden pro Besuch, wachsend. Wer sich listen lässt, um
gefunden zu werden, verliert genau daran. Beide Sorgen der alten Tafel bleiben
bedient: `listings.js` wächst nicht (getrennte Datei), und die Modell-Kennung plus
ein Quellen-Hash halten das Paket re-embedding-fest. Gemessen: ein 384er-Vektor ist
als JSON 8.025 Bytes, int8-quantisiert ~530 Bytes, Cosinus-Fehler unter 0,00005.

**Zusammenhang.** Vorbedingung für Stufe 1 des family-project-Vorhabens
„Katalog-Spore" (fremde Apps sollen gefunden werden, auch wenn sie geschlossen
sind). Stufe 4 dieses Plans ist bereits gebaut: Melde-Knopf an jedem
Marktplatz-Eintrag + Haftung für fremde Links im Impressum (family-project PR #136,
22/22 grün).

**Was offen.** Stufe 1 (Vektor-Paket) ist noch nicht gebaut, nur die Tafel ist frei.
Weiter offen: Spore-Adresse je Eintrag, täglicher Wächter mit gestufter Reaktion,
Lighthouse-Güte, längerer Relais-Blick, Gast-Pillen auf der Mycel-Karte,
Aufräum-Frist auf dem Relais.

**Befund am Rande (nicht behoben):** Diese Datei hat **7816 Zeilen** und liegt damit
weit über der eigenen 3000-Zeilen-Grenze aus dem Kopf-Abschnitt. Die Tafel verlangt
Auslagern ins Archiv statt Kürzen. Das ist eine eigene Pflege-Sitzung wert.

**Nächster sinnvoller Schritt.** Stufe 1 in family-project: geteilter Codec
(`assets/vec-codec.js`) mit Headless-Test, danach die Leseseite in `markt.html`.

## Stand 2026-07-30 (späte Nacht) — Die halbe Kennung heißt jetzt so (11 Repos)

**Rolle:** Bau-Sitzung (Fortsetzung 0b) · **Branch:** `claude/halbe-kennung-benennen`
**Gemergt:** Sage #759 · Kimboard #64 · Kimseek #51 · BookLedgerPro #294 ·
Mein-Tresor #86 · Jasons-Tresor #144 · family-project #129 · Mein-Rezeptbuch #355 ·
Muttis-Rezeptbuch #168 · Mein-Mixarium #169 · Tomys-Hub #132

### Der Befund kam aus Klaus' Browser (18:54/18:55)

Drei Stellen gaben **drei verschiedene Antworten auf dieselbe Frage**:

| Stelle | Aussage |
|---|---|
| Statuszeile | `Meine Kennung: noch keine (erst verbinden)` |
| Einspielen | „In diesem Browser liegt schon eine Kennung. Einspielen ERSETZT sie." |
| Sicherung | erst **nach** dem Passwort: „Identität 'main' hat noch keine Spore" |

Alle drei hatten recht. Es ist ein **Zwischenzustand**: der Schlüssel liegt im
Browser, die Visitenkarte (Spore) fehlt noch. Nur hatte ihn niemand benannt —
und ausgerechnet die Sicherung meldete ihn erst, nachdem Klaus zweimal ein
Passwort getippt hatte.

### Was gebaut wurde

Alles in `src/modules/23_rendezvous_ui.js` (Kanon, jetzt sha `f2cf79c9defb`):

- `readIdentityState()` liest zusätzlich `getOwnSpore()` → `hasSpore`
- die Statuszeile nennt den Zustand — **„⚠ Angefangene Kennung: der Schlüssel
  liegt hier, die Visitenkarte (Spore) fehlt noch."** — samt Ausweg (einmal
  „🌐 Mit dem Knotennetz verbinden", oder im Siegel Schritt 2 „Spore erzeugen")
- `openBackupForm()` prüft **vor** der Passwort-Eingabe statt danach

REINE UI-Schicht über die **öffentlichen** Flächen von Modul 02. Kern-Module
01/02/05/05b/23 unangetastet, kein `PROTOCOL_VERSION`-/`DB_VERSION`-Bump,
0.80-Andock-Riegel unberührt, fail-soft ohne Modul 02.

### Beweis

| Lauf | Ergebnis |
|---|---|
| `smoke_bau23_0b_identitaet.mjs` | **49/49** (Proben `0b/8` neu) |
| **GEGENPROBE** `SBKIM_0B_SABOTAGE_HALF=1` (neu) | **45/49 — genau die vier neuen fallen** |
| GEGENPROBE `SBKIM_0B_SABOTAGE=1` | 45/49 |
| GEGENPROBE `SBKIM_0B_SABOTAGE_WATCH=1` | 47/49 |
| `smoke_bau23_rendezvous_ui` / `_rendezvous` / `bau23c` / `bundle_connect` | 87 · 59 · 28 · 21 |
| Kimboard · Kimseek | 6/6 · 11/11 (sha-Pins nachgezogen) |
| **GEGENPROBE Drift-Guard** (eine Zeile an die Kimboard-Kopie angehängt) | **5/6 — er beißt** |
| BookLedgerPro · Mein-Tresor · Jasons-Tresor · Mein-Rezeptbuch | 2153/0 · 53/0 · 59/0 · 7/0 |
| Mein-Mixarium (4 Suiten) | 8 · 11 · 14 · 7 |
| Tomys-Hub (8 Suiten) | 35 · 38 · 19 · 15 · 9 · 16 · 31 · 11 |

**Netzweite Nachprüfung auf `main`** (die Lehre aus dem Nachzug-Fehler): alle
**12 Träger** der Datei auf `f2cf79c9defb` — Sage `src/` + `sbkim-bundle/` und
die zehn Apps. Company-Brain, Privat-Brain, SB-KIMTool-Point und Mein-WorkFloh
wurden **ausdrücklich mitgeprüft** und tragen die UI-Datei nicht (0 Kopien) —
keine stillschweigende Auslassung.

**Gegenprobe, dass der parallel gelaufene 2b-Rollout nicht überschrieben wurde:**
`23_rendezvous.js` = `3caa0bb1fbe7` und `16_siegel.js` = `4e11ef0d0390` stehen
in allen Apps unverändert auf `main`.

**Nicht geprüft — ehrliche Grenzen:**

- **Muttis-Rezeptbuch** hat keine Test-Suite; **family-project** braucht
  `playwright-core` und hat keine `package.json`. Beide tragen eine per sha256
  gegen den Kanon geprüfte byte-identische Kopie.
- **Tomys-Hub `smoke-spore-download.cjs`** fällt weiterhin (Playwright-Timeout).
  **Vorbestehend** — in der vorigen Runde auf blankem `origin/main` gegengeprüft.
- **Der echte Browser-Pfad** — wartet auf Klaus.

### Klaus' 0b-Sichttest ist grün (18:57)

Sein Bild von 18:57 schließt den offenen Sichttest aus dem Nachmittag positiv ab:
`Meine Kennung: zmNI_S_bB7BimoGBTmd8l_FCOAqdNRDxiKnaEt3o2B0`, `Letzte Sicherung:
2026-07-30`, `✓ Sicherung erzeugt: sbkim-sicherung-kimboard-2026-07-30.json`,
Chrome meldet „Datei heruntergeladen (25,42 KB)". Und: **kein Aufräum-Knopf** —
bei einem Fach bleibt er weg, genau wie gebaut. Offen bleibt nur noch
**📥 Sicherung einspielen** mit genau dieser Datei.

Übergabeprotokoll: `docs/sessions/archiv/2026-07-30_halbe-kennung-benennen.md`.

## Stand 2026-07-30 (Nacht) — Schutz-Plan Stufe 2b NETZWEIT ausgerollt (13 Repos)

**Rolle:** Bau-Sitzung (Rollout aus `BRIEF_MODUL23_STUFE2B_ROLLOUT.md`).
**Branch:** `claude/modul23-stufe2b-rollout-vpzaar` (überall gleich).

### Was getan — Kartenechtheit + Flut-Deckel in ALLE Apps

Modul 23 (`23_rendezvous.js`, sha `3caa0bb1…`) + Modul 16 (`16_siegel.js`,
sha `4e11ef0d…`) byte-1:1 aus dem Kanon in **13 Repos** gebracht — alle 12 aus
dem Brief **plus** SB-KIMTool-Point (Forker-Vorlage, Befund siehe unten). Jede
App prüft jetzt Raum-Karten vor der Anzeige: **Bindung** (`spore.id===nodeId`)
+ **Ed25519** je Karte (Modul 02) + **Flut-Deckel** (200/Durchlauf, 3/Absender),
fail-soft (`cardsVerified:false` wenn Prüfer fehlt). Das ist der eigentliche
Spam-/Sybil-Schutz, nach dem Klaus fragte.

**Gemergt (14 PRs, alle squash, Freibrief):** Kimboard #63 · Kimseek #50 ·
BookLedgerPro #293 · Mein-Tresor #85 · Jasons-Tresor #143 · family-project #128 ·
Mein-Rezeptbuch #354 · Muttis-Rezeptbuch #167 · Mein-Mixarium #168 · Tomys-Hub
#131 · Company-Brain #10 · Privat-Brain #66 · SB-KIMTool-Point #138.
**Netz-Verifikation: 12/12 tragen den Kanon auf main, 0 Fehler.**

**sha-Pins nachgezogen:** Kimboard/Kimseek `test/smoke.test.js` (16+23),
Company-Brain `tools/drift-guard.mjs` (23). **Befund Privat-Brain:** dessen
`tools/drift-guard.mjs` pinnt auch `16_siegel.js` — der Brief nannte nur 23;
der 16-Pin war mechanisch zwingend mitzuziehen (sonst fällt der Drift-Guard).

### Zwei Befunde

1. **SB-KIMTool-Point (über den Brief-Scope hinaus, bewusst):** Der Brief nannte
   es nur als Siegel-Aspekt-Sonderfall und warnte, `assets/sbkim-siegel.js` nicht
   blind zu ersetzen — das ist aber nur der **Loader** (unberührt gelassen). Die
   echte Modul-Kopie liegt in `web/tools/`, mit `sbkim-rendezvous.js` auf der
   **alten** Gen `9f3a2085`. Nur den Siegel-Aspekt nachzutragen hätte das Siegel
   **lügen** lassen (Anti-Greenwashing-Leitplanke). Als Forker-Vorlage gehört der
   Schutz genau hier zuerst hin. Darum beide Dateien byte-1:1. `node --test` →
   120/120 grün (inkl. `kanon_import.test.js`, der byte-1:1 gegen den Kanon prüft).
2. **Parallel-Sitzung:** während des Rollouts mergte eine andere Sitzung
   „Aufräum-Knöpfe" (#758/#759 in Sage, analog in 10 Apps) — betraf nur
   `23_rendezvous_ui.js`, **nicht** meine Ziel-Dateien. Die 10 betroffenen App-
   Branches sauber neu von origin/main aufgesetzt (force-with-lease), 23_ui der
   Parallel-Sitzung unberührt übernommen. Kein Datei-Konflikt im Kern.

### Tests (ehrlich)

Kimboard 6/6 · Kimseek 11/11 · BookLedgerPro 2153/0 · Mein-Tresor 53/0 ·
Jasons-Tresor 59/0 · Mein-Rezeptbuch 7/0 · Mein-Mixarium 8·11·14·7 · Tomys-Hub
35·38·19·15·9·16·31·11 · Company-/Privat-Brain Drift-Guard grün (8 bzw. 15
byte-1:1) · SB-KIMTool-Point 120/120. Sage-Suite 59·87·**16**·42·21. Die
**Gegenprobe** (`smoke_bau23b_kartenechtheit.mjs` Probe 5: ohne Prüfer bleibt die
faule Karte sichtbar, `cardsVerified:false`; Probe 2/3/4: mit Prüfer fällt die
untergeschobene/ungültige Karte raus) grün.

**Bekannte Grenzen (nicht durch Rollout verursacht):** family-project ohne
`package.json`/playwright nicht lauffähig; Muttis-Rezeptbuch ohne Test-Suite
(Beweis = sha256-Kopie); Tomys `smoke-spore-download.cjs` + Company-/Privat-Brain
e2e = vorbestehender Playwright-Timeout (gegengeprüft).

### Was offen / nächster Schritt

- **Klaus' Browser-Sichttest** — headless ersetzt ihn nicht. Nach Deploy in
  einer App „👥 Wer ist im Raum?" öffnen; faule/fremde Karten dürfen nicht mehr
  erscheinen, ehrliche Zähler sichtbar.
- Sichttest 0b (Sicherung anlegen/einspielen → alte Kennung zurück) steht noch.
- Danach-Liste aus dem Brief (Stufe 0c, Sage `sicherheit.html`, Wizard-Init-
  Heilung im Kanon-`siegel-inhalt.js`, PULS-Archivierung, Stufe 3).

## Stand 2026-07-30 (Abend) — Nachzug: fünf vergessene Apps + Netz-Prüfung

**Rolle:** Bau-Sitzung (Fortsetzung 0b). **Gemergt:** BookLedgerPro #290 (Wizard
ins Siegel) · #291 (offline-Schale) · Kimseek #48 · Mein-Rezeptbuch #352 ·
Muttis-Rezeptbuch #165 · Mein-Mixarium #166 · Tomys-Hub #129.

### Der Befund, der die Sitzung verlängert hat

Klaus' Frage „hast du wirklich **alle** Repos aktualisiert?" war berechtigt.
**Nein.** Der 0a/0b-Rollout ging an fünf Apps, weil der ursprüngliche Auftrag
fünf nannte — **fünf weitere** trugen weiter den alten Panel-Stand und legten beim
Seiten-Start wortlos neue Kennungen an: **Kimseek, Mein-Rezeptbuch,
Muttis-Rezeptbuch, Mein-Mixarium, Tomys-Hub**. Alle fünf sind jetzt auf
`c78d18d0…`, `ensureIdentity` überall raus, Mixarium hat seine Wappen-Gravur
(`ribbonText: "Mein Mixarium"` — es war die letzte App ohne).

**Lehre:** ein Auftrag, der eine App-Liste nennt, ist keine Erlaubnis, den Rest
des Netzes stehen zu lassen. Wer eine geteilte Datei anfasst, prüft **alle**
Träger — `git ls-tree` über jedes Repo, sha vergleichen, Tabelle zeigen.

### BookLedgerPro: Siegel vervollständigt (nach Skill `status-leiste-siegel`)

BLP war die einzige App mit Modul 16 **ohne** Modal-Inhalt. Es bekam
`sbkim/siegel-inhalt.js` (1:1 aus dem Sage-Kanon, nur `WIZ` angepasst) mit allen
fünf Bausteinen inkl. **Identitäts-Wechsler**. Der Skill deckte zwei Lücken auf:
**`ribbonText` fehlte** (Wappen-Band leer) und **`sicherheit.html` fehlte** (toter
Knopf im Schutz-Block) — beides behoben. Dazu Nachzug: `21_spracheingabe.js` +
beide `23_rendezvous*.js` fehlten in `CORE_ASSETS` → **offline war das ganze
Netz-Panel weg**; nachgetragen, `CACHE_VERSION` v213 → v215.

### Die Netz-Prüfung — und der eigentliche Befund

**Schutz-Plan Stufe 2b (Kartenechtheit + Flut-Deckel, gebaut 2026-07-29) liegt
NUR in Sage. Keine einzige App hat sie.** In jeder echten App nimmt `discover()`
Karten weiterhin ungeprüft entgegen: jeder kann sich unter fremdem Namen ins Brett
hängen, ein Fluter kann den Raum füllen. **Das ist der Spam-/Sybil-Schutz, nach dem
Klaus gefragt hat** — er ist gebaut und getestet, nur nicht ausgerollt.

**Drei Generationen von Modul 23 im Umlauf:** Kanon `3caa0bb1` · die meisten Apps
`9f3a2085` · Mein-Tresor + Jasons-Tresor `bbdf02a8` (zwei Generationen zurück, ohne
`rankCardsByQuery`). Ebenso fehlt **allen** Apps der Siegel-Aspekt vom 2026-07-29
(Modul 16: Kanon `4e11ef0d`, Apps `a581461a`).

**Vollständige Tabelle, Vorgehen, Test-Erwartungen je Repo, bekannte Grenzen und
alle sha-Werte:** `docs/sessions/BRIEF_MODUL23_STUFE2B_ROLLOUT.md` — der Brief ist
so geschrieben, dass die nächste Sitzung **ohne Rückfrage** durchziehen kann.

### Schutz-Plan, Stand

| Stufe | Was | Stand |
|---|---|---|
| 1 + 2 | Grundschutz (Kimboard) | ✅ |
| **2b** | Kartenechtheit + Flut-Deckel | ✅ gebaut · ❌ **nur in Sage** |
| **0a** | Kennung + Speicher sichtbar | ✅ netzweit (11 Apps) |
| **0b** | Kennung reparierbar, keine stumme Neu-Anlage | ✅ netzweit (11 Apps) |
| 3 | Bekannte bevorzugen | ⏳ nach 2b-Rollout |
| 4 · 4d/4e · 5 · 6 | Themen-Mycel · Wächter-Quorum · Stufen-Schalter · Rollout | ⏳ |

### Offen

1. **Klaus' Browser-Sichttest 0b** — Sicherung anlegen, später einspielen.
2. **Stufe-2b-Rollout** (der neue Brief) — vor Stufe 3.
3. Sage fehlt `sicherheit.html`; Sages `siegel-inhalt.js` ist hinter Mein-Tresor
   (Wizard-Init-Heilung vom 2026-07-19).
4. PULS-Archivierung (7573 Zeilen gegen 3000er-Klausel, alt).

---

## Stand 2026-07-30 (Nachmittag) — Stufe 0b gebaut: die Kennung ist jetzt REPARIERBAR

**Rolle:** Bau-Sitzung (Brief `BRIEF_STUFE0B_IDENTITAET_HALTBAR.md`).
**Branch:** `claude/stufe-0b-identitaet-reparierbar` · **6 PRs gemergt**
(Sage #752, Kimboard #58, BookLedgerPro #286, Mein-Tresor #80, Jasons-Tresor #138,
family-project #123).

### Zwei Belege von Klaus, die diesen Bau ausgelöst haben

**Lauf 16:54–16:57 (Mycel-Rekord `20260730T145936`, erster Lauf NACH den Fixes):**

- **Der Handshake läuft sauber.** Sage ⟷ SB-KIMTool-Point, **fünf** Antworten,
  jede `outcome: "established"`, Score **0.8635**. Kein „connection is closing",
  kein `decision: null`, keine zweite Kennung mitten im Lauf. Erster Live-Beleg,
  dass **Fix 1** im Browser greift.
- **Aber beide Schubladen waren LEER.** Klaus' Bild 16:54 zeigt
  `Meine Kennung: noch keine (erst verbinden)` bei `Speicher dauerhaft: ja`;
  16:55 dann `✓ Identität erzeugt: bAf_3wjfRXMlz3B11_v-…` (Spore 14:54:56 UTC),
  16:57 dasselbe für den Point (`aNoV2w6NAIHDzVvl…`, 14:57:08 UTC).
  **Die App legt wortlos neu an** — genau Punkt 3 des 0b-Briefs, an Klaus'
  eigenem Lauf belegt. **0a hat den Fehler beim ersten Blick sichtbar gemacht.**

**Lauf 14:59–15:11 (Rekord `20260730T151140`) — der ernüchternde Teil:**

- **Kimboard hat SEINE Kennung erneut verloren.** `XFi3xrd7xMSuaf` (04:45 UTC,
  noch live um 05:01) ist weg; um **15:09:38 UTC** entsteht `e8UwgMlxrmSjetpO`
  — die **dritte** Kimboard-Kennung binnen zwei Tagen. Klaus' Bild 17:08 zeigt
  wieder `Speicher dauerhaft: ja`.
- **Ehrlich zur Ursache:** das ist **kein Beweis, dass die Härtung nicht wirkt**,
  aber auch **kein Beweis, dass sie wirkt**. Zwei Wege bleiben offen: (a) das
  Fenster vom 05:01 lief noch mit **altem** Code (Klaus hatte es nicht
  geschlossen) und eine schon **vorgemerkte** `deleteDatabase()` ist später
  gefallen; (b) eine andere, noch unbekannte Ursache. Die Frage lässt sich aus
  den Rekorden **nicht** entscheiden — darum ist die Antwort nicht „noch eine
  Ursachensuche", sondern **Reparierbarkeit**.
- Nebenbefund: Kimboards Andock-Anfragen an Sage (Ereignis 34 + 54) blieben
  **ohne Antwort** — dazu passt die bekannte Rest-Grenze „Antworter-Tab muss
  vorn und wach sein". **Nicht** in diesem Auftrag, eigenes Thema.

### Was gebaut wurde (Modul 23 UI, Kanon → 5 Apps + Bundle)

Neuer Kasten **„🪪 Kennung sichern"** im Netz-Panel, direkt unter den
0a-Statuszeilen:

1. **💾 Sicherung anlegen** — verschlüsselte Datei über Modul 02 `exportBackup`
   (PBKDF2-SHA256 600k + AES-GCM-256). Passwort **zweifach** eingegeben,
   **nirgends** gespeichert (Test prüft das). Solange keine Sicherung angelegt
   wurde, **warnt** der Hinweis: „Für diesen Knoten liegt hier noch KEINE
   Sicherung."
2. **📥 Sicherung einspielen** — `importBackup`. Liegt schon eine Kennung im
   Fach, kommt **erst die Warnung**, dann das ausdrückliche „Ja, ersetzen".
   Danach ist die **alte** Kennung zurück (das ist die Gegenprobe des Briefs).
   Falsches Passwort → ehrliche Fehlermeldung, kein stiller Erfolg.
3. **Schluss mit stummer Neu-Anlage** — war die Schublade leer, hat „🌐 Mit dem
   Knotennetz verbinden" bisher **wortlos** eine neue Identität erzeugt. Jetzt
   fragt es **einmal**: neu anlegen ODER Sicherung einspielen, mit der Warnung
   „eine neue Kennung ist NICHT dieselbe wie eine frühere". Ist eine Kennung da,
   ändert sich **nichts** (kein zusätzlicher Klick); lässt sich der Stand nicht
   lesen, läuft der alte Weg unverändert (ein Lese-Problem darf keine neue Hürde
   bauen).
4. **🧹 Fächer aufräumen** — die schon entstandenen Mehrfach-Fächer entfernen,
   das aktive bleibt. Mit Rückfrage, als **Knopf**, keine Konsole.

**Dateiname der Sicherung** (Klaus' Rückfrage): `sbkim-sicherung-<app>-<datum>.json`
— der App-Teil ist der `dbSuffix` des Knotens, also `kimboard`,
`bookledgerpro-sbkim`, `meintresor`, `jasonstresor`, `familyprojekt`. Damit ist
jede Datei ohne Umbenennen zuzuordnen, und mehrere Stände derselben App
sortieren sich nach Datum.

**Die ehrliche Grenze steht sichtbar in der Oberfläche**, nicht nur in der Doku:
„Eine Räumung durch den Browser lässt sich nicht verhindern — nur
unwahrscheinlicher machen (App auf den Startbildschirm legen) und der Verlust
reparierbar halten (Sicherung)."

### Abgrenzung

REINE UI-Schicht über die **öffentlichen** Flächen von Modul 02. Die Kern-Module
**01/02/05/23 bleiben unangetastet**, kein `PROTOCOL_VERSION`-/`DB_VERSION`-Bump,
der 0.80-Andock-Riegel unberührt. Konsequent fail-soft: ohne Modul 02 sagen die
Knöpfe das **ehrlich** — kein toter Knopf, kein Crash (Fremdnutzer-/Marktplatz-Brille).

**Nachtrag am selben Tag — der Brief hatte recht, die Sitzung hatte unrecht.**
Diese Sitzung hatte zunächst notiert, „kein App-Klebstoff übergibt
`ensureIdentity:true`" — das war **falsch** (ein `grep` mit `head -5` wurde von
`ensureIdentityStores`-Treffern aus Modul 02 zugeschüttet, die eigentlichen
Fundstellen fielen unter den Tisch). Tatsächlich fuhren **alle fünf** Apps
`ensureIdentity: true` bei `SbkimRendezvous.init()` — Kimboard, BookLedgerPro,
Mein-Tresor, Jasons-Tresor, family-project. Die App legte damit **beim
Seiten-Start** wortlos eine neue Kennung an, sobald die Schublade leer war; das
Tor im Verbinden-Knopf kam **zu spät**.

**Behoben** (5 PRs: Kimboard #59, BookLedgerPro #287, Mein-Tresor #81,
Jasons-Tresor #139, family-project #124): `ensureIdentity` ist aus dem
App-Klebstoff **entfernt**. Die Kennung entsteht nur noch auf ausdrückliche
Nutzer-Entscheidung im Netz-Panel. Ist eine Kennung vorhanden, ändert sich
nichts — sie wird beim Start unverändert gelesen. Nur Klebstoff, eine Zeile je
App; Kern-Module unangetastet. Suiten grün (Kimboard 6/6, Mein-Tresor 53/0,
Jasons-Tresor 59/0, BookLedgerPro 2153/0, `node --check` überall).

**Lehre für die nächste Sitzung:** ein `grep`-Ergebnis mit `head -N` ist **kein
Beweis für Abwesenheit**. Wer „X kommt nirgends vor" schreibt, zählt vorher die
Treffer ungekürzt.

### Beweis

| Lauf | Ergebnis |
|---|---|
| `tests/smoke_bau23_0b_identitaet.mjs` | **34/34 grün** |
| **GEGENPROBE** `SBKIM_0B_SABOTAGE=1` (Tor ausgehebelt) | **30/34 — fällt** |
| `smoke_bau23_rendezvous_ui.mjs` | 87/87 (regress-frei) |
| `smoke_bau23_rendezvous.mjs` · `smoke_bau23c_ki_richter.mjs` · `smoke_bundle_connect.mjs` | 59/59 · 28/28 · 21/21 |
| Kimboard `npm test` (Drift-Guard) | 6/6 |
| Mein-Tresor · Jasons-Tresor · BookLedgerPro | 53/0 · 59/0 · 2153/0 |

**Nicht geprüft (ehrlich):** family-projects Suite braucht `playwright-core` und
ließ sich hier nicht installieren (kein `package.json`) — dort ist die Änderung
eine per sha256 geprüfte byte-identische Kopie. Und: der **echte Browser-Pfad**
(Datei-Download, Datei-Auswahl, echte AES-Krypto, IndexedDB) **wartet auf Klaus'
Browser-Lauf**. Headless ersetzt ihn nicht.

### Offen / nächster Schritt

1. **Klaus' Sichttest (nicht ersetzbar):** in EINER App zuerst **💾 Sicherung
   anlegen**, dann später **📥 einspielen** → die alte Kennung muss zurück sein.
   Vorher alle offenen Fenster neu laden (alter Code läuft in offenen Fenstern
   weiter — die Lehre vom 30.07.).
2. **Stufe 0c** (neuer Brief): Sicherung **anbieten, sobald** eine Kennung
   entsteht, statt sie nur zu erwähnen — und die Wiederherstellung an derselben
   Stelle. Erst danach ist der Kreis wirklich zu.
3. Der **stumme Antworter** (Kimboard→Sage ohne Antwort) bleibt eigenes Thema.

Übergabeprotokoll: `docs/sessions/archiv/2026-07-30_stufe-0b-identitaet-reparierbar.md`.

**Befund am Rande (nicht in diesem Auftrag, gehört aber gemeldet):** diese Datei
hat **7573 Zeilen** — die Schutz-Klausel im Kopf nennt **3000** als Grenze und
verlangt „auslagern statt kürzen". Der Überlauf bestand schon vor dieser Sitzung
(7459 Zeilen auf `main`). Das Auslagern älterer Stände ins Archiv ist eine eigene
Pflege-Sitzung — hier bewusst **nicht** nebenbei erledigt, aber auch nicht
stillschweigend übergangen.

---

## Stand 2026-07-30 (früh) — URSACHE GEFUNDEN: unser Code löschte die Identität, nicht der Browser

**Rolle:** Fortsetzung derselben Bau-Sitzung (Klaus: „entscheide selber, es geht nichts verloren").
Branch netzweit `claude/stufe-0a-identitaetskennungen-78ulx5`.

**Klaus' Messung hat den Bug gefangen.** Über Nacht verloren Kimboard (`zv5jVTBnjIS…` →
`XFi3xrd7x…`) UND Mein-Tresor (`X0Mal…` → `11hoBL…` → `50RfCiT9r…`) ihre Kennung — **obwohl
„Speicher dauerhaft: ja" stand** und Klaus nichts gelöscht hat. Entscheidende Zusatz-Angaben:
er war im **gleichen** Browser-Modus, die Apps waren die ganze Nacht **offen**, und heute früh
war die Kennung noch **angezeigt** — der Hard-Reload legte den Verlust erst offen (die Anzeige
kam aus dem Arbeitsspeicher der alten Seite; die offenen Fenster liefen zudem noch mit dem
**alten** Code, weil neuer Code erst beim Neuladen ins Fenster kommt).

**Der Ausschluss-Beweis:** „es ging sofort, kein Modell geladen." Das ~30-MB-Sprachmodell liegt
im **selben** verwalteten Speicher wie die Kennungen. Hätte der **Browser** geräumt, wäre es
mit weg. Es war da — und localStorage (Tresor-Fächer, Gerätename „Klaus Tablet") ebenfalls.
Gelöscht wurde **nur** die Kennungs-Datenbank. Also: **kein Browser-Eviction.**
Modul 07 (Apoptose) ebenfalls entlastet — dessen `init()` macht nachweislich **keinen**
Verfalls-Sweep („keine TTL-Sweeps in init()", wörtlich im Modul).

**Die Ursache (im Code gefunden, `01_storage.js`):** die Selbst-Heilung vom 11.07. löscht eine
DB, die sie für „identitäts-leeren Schrott" hält (fehlender Store `sbkim_keys`). Fährt ein
**anderes Fenster** derselben Origin gleichzeitig einen Schema-Umbau, ist `objectStoreNames`
**transient unvollständig** → Fehlurteil „leer" → die DB **mit** Identität wird gelöscht.
**Verschärfend:** `indexedDB.deleteDatabase()` ist unumkehrbar und wirkt bei `onblocked`
**verzögert** — die Löschung bleibt im Browser **vorgemerkt** und greift, sobald die letzte
Verbindung fällt (Tab schläft über Nacht ein). Genau der beobachtete Ablauf, und es erklärt,
warum **nie ein Fehler sichtbar** war. Dazu fehlte am Lösch-Aufruf der Fehler-Zweig — eine
blockierte Löschung ließ die Promise-Kette **still sterben**.

**Härtung (Modul 01):** vor JEDEM Selbst-Heilungs-Löschen eine **zweite, unabhängige
Gegenprobe** (`confirmIdentityStoreMissing`). Widerspricht sie — oder ist sie blockiert/unklar
— wird **nicht gelöscht**, sondern ehrlich abgelehnt. **Löschen ist unumkehrbar, ein ehrlicher
Fehler ist reparierbar.** Fehler-Zweig ergänzt. Kein `DB_VERSION`-/Schema-/API-Bump; 02/23 unberührt.

**BEWEIS mit Gegenprobe (der Kern der Ehrlichkeit):** neuer
`tests/smoke_pflege_01_kein_loeschen_im_zweifel.mjs` **4/4 grün**. Mit der Härtung **entfernt**
fällt derselbe Test auf **2/4** mit `WEG — Datenverlust!` — der Bug ist damit **reproduziert**
UND die Heilung **belegt**, nicht bloß plausibel. Probe 4 zeigt: der echte Leer-Fall heilt sich
weiterhin selbst. Regress-frei: M01-Suite 11/21/7/6, reopen-retry 3/3, a14 4/4, bau02y 33/33.

**Netzweit gemergt (13 PRs):** Sage #750 · Mein-Tresor #79 · Kimboard #57 · BookLedgerPro #285
(CI grün) · Jasons-Tresor #137 · family-project #122 · Kimseek #47 · Company-Brain #9 ·
Privat-Brain #65 · Mein-Rezeptbuch #351 · Mein-Mixarium #165 · Muttis-Rezeptbuch #164 ·
Tomys-Hub #128. sha-Pins nachgezogen; vier Repos brauchten einen Rebase (Pin-Konflikt).

**Nebenbefund geklärt (Klaus' Frage „Kimboard liest Mein-Tresors Browser?"): NEIN.** Der
Analyse-Rekord 05:01 beweist das Gegenteil: Mein-Tresors Karte wurde **04:43** angeheftet (App
war offen) und **18 Minuten später** gelesen — sie hängt am **Relais**, nicht im Browser. Und
Kimboards Handshake an sie ergab `decision: null` (**keine Antwort**) — könnte Kimboard den
Nachbar-Speicher lesen, wäre er gelungen. Apps können sich gegenseitig **nicht** in die
Schublade schauen; der Raum zeigt Karten der letzten ~30 Min (so gebaut). Ebenso sind die
„3 bzw. 4 Kennungen" auf der Karte **Karten-Gedächtnis** eines durchgehenden Rekorder-Laufs,
keine 4 lebenden Identitäten.

**Klaus' Entscheid:** alte Kennungen werden **nicht** gejagt (Testphase, nichts verkauft,
nichts verloren) — Ursache beheben schlägt Identitäten retten.

**Browser-Sichttest wartet auf Klaus:** dieselbe App in zwei Fenstern öffnen → Kennung muss
stabil bleiben, kein Handshake-Fehler. **Wichtig:** nach jedem Update **alle offenen Fenster
neu laden**, sonst arbeitet der alte Code weiter.

**Offen (0b):** Sicherung + Wiederherstellen im Panel, Aufräum-Weg für die schon entstandenen
Mehrfach-Fächer, und **Schluss mit stummer Neu-Anlage** (die App legt beim Öffnen wortlos eine
neue Identität an, wenn die Schublade leer ist — künftig fragt sie).

---

## Stand 2026-07-29 (tiefe Nacht) — Fix-Bau: Identitäts-Churn gefunden und netzweit geheilt („connection is closing")

**Rolle:** Bau-Sitzung (Fortsetzung derselben Sitzung wie Stufe 0a, Klaus' ausdrückliches
„startet den Fixbau jetzt"). Branch netzweit `claude/stufe-0a-identitaetskennungen-78ulx5`.

**Der Befund — Klaus hat den Identitätsverlust LIVE reproduziert.** Direkt nach dem
0a-Merge maß Klaus an Mein-Tresor: Kennung `X0MalwVNjV…` → nach kurzer Zeit `11hoBLLRZ7…`,
obwohl „Speicher dauerhaft: **ja**" stand und nichts gelöscht wurde. Seine Screenshots
zeigen die rauchende Pistole: **`(InvalidStateError) Failed to execute 'transaction' on
'IDBDatabase': The database connection is closing.`** Analyse-Rekord
`mycelanalyse20260729T191549.json`: Mein-Tresor mit **drei** lebenden Kennungen gleichzeitig
im Raum (nmRebxCn/X0Mal/11hoBL), Kimboard ×2, Handshakes an alte Karten-Fächer scheiterten.

**Die Ursache (im Code belegt, `01_storage.js`):** Ist dieselbe App auf derselben Origin in
**zwei Fenstern** offen (bei Klaus: Browser-Tab + Brett-Fenster), feuert der Browser
`onversionchange` → `db.close()`. Modul 01 gab die **tote** gecachte Verbindung weiter;
`db.transaction()` wirft dann synchron den InvalidStateError. Zwei Folgen: (a) der
Handshake bricht; (b) ein so fehlgeschlagener Identitäts-**Lese**vorgang wird als „keine
Identität" missverstanden → `getOrCreateIdentity` würfelt eine **neue** Kennung; das alte
Fach bleibt liegen (nichts gelöscht — mehrere Fächer, nach Reload gewinnt das alte).
Persistenz („ja") schützt davor NICHT — es ist kein Räum-, sondern ein Parallelzugriffs-Problem.

**Der Fix (Modul 01, additiv — bewusste Kern-Modul-Pflege auf Klaus' „startet den Fixbau"):**
Neuer `beginTx`-Helfer mit genau **einem Reopen-Retry**: `onversionchange` invalidiert
`dbPromise`/`currentDb` schon immer — der zweite Versuch bekommt eine frische Verbindung.
`get`/`put`/`del`/`all`/`clear` laufen jetzt durch `beginTx`. Schlägt auch der Retry fehl →
**ehrlicher Fehler**, nie stilles `undefined` (kein fälschliches „keine Identität" mehr).
Kein `DB_VERSION`-/Schema-/API-Bump; Module 02/23 unberührt.

**Beweis:** Neuer `tests/smoke_pflege_01_reopen_retry.mjs` **3/3** — reproduziert den Bug
(transaction() wirft „connection is closing") und belegt Selbstheilung + Ehrlichkeits-
Gegenprobe. Regress-frei: M01-Pflege-Suite 11/21/6/7, bau02y 33/33, bau23 59/59,
bundle-Drift-Guard 21/21.

**Netzweiter Rollout — alle 12 Modul-01-Träger + Bundle, alle gemergt:** Sage #748 ·
Mein-Tresor #78 · Kimboard #56 · BookLedgerPro #284 (CI grün) · family-project #121 ·
Jasons-Tresor #136 · Mein-Rezeptbuch #350 · Mein-Mixarium #164 · Muttis-Rezeptbuch #163 ·
Tomys-Hub #127 · Kimseek #46 · Company-Brain #8 · Privat-Brain #64. sha-Pins nachgezogen
(Kimboard/Kimseek `test/smoke.test.js`, Company-/Privat-Brain `tools/drift-guard.mjs`).
Ehrlich: Company-/Privat-Brain e2e-Suiten brauchen `playwright-core` (Container-Grenze,
vorbestehend); deren Drift-Guards 8/8 bzw. 15/15 byte-identisch.

**Für Klaus' Wieder-Test (nach Hard-Reload):** dieselbe App in **einem** Fenster → Kennung
muss stabil bleiben; zweites Fenster derselben App darf keinen Handshake-Fehler und keine
neue Kennung mehr erzeugen. Alte Geister-Karten verschwinden ~30 Min nach dem letzten
Anheften von selbst. **Browser-Sichttest wartet auf Klaus.** Noch offen (0b): Aufräum-Weg
für die schon entstandenen Mehrfach-Fächer (aktive Kennung behalten, alte Fächer entfernen)
— gehört zu 0b, nach Klaus' Messung.

---

## Stand 2026-07-29 (Nacht) — Stufe 0a/0c/0d/0e gebaut: Kennung + Speicher sichtbar, Widersprüche geheilt

**Rolle:** Bau-Sitzung (Stufe 0 aus `docs/sessions/BRIEF_STUFE0_IDENTITAET_HALTBAR.md`).
Branch netzweit `claude/stufe-0a-identitaetskennungen-78ulx5` (je Repo frisch von `origin/main`).

**Was getan.**

- **0a — messen, bevor repariert wird.** Das Netz-Panel (Modul 23 UI,
  `23_rendezvous_ui.js`) zeigt jetzt zwei ehrliche Zeilen: **„Meine Kennung: …"**
  (aus Modul 02 `getOwnSpore()`) und **„Speicher dauerhaft: ja/nein/unbekannt"**
  (aus Modul 01 `SbkimStorage._meta.storagePersisted`). Bei „nein" erscheint ein
  Satz in Klaus-Sprache (installieren macht ihn dauerhaft; Sicherung schützt
  zusätzlich). Reine Anzeige, konsequent fail-soft (fehlt ein Wert → „unbekannt"/
  „noch keine", nie ein Fehler). Beide Werte existierten schon im Code, sie wurden
  nur nicht gezeigt. Kern-Module **23/01/02 unangetastet** — die Änderung sitzt in
  der UI-Glue-Datei, die byte-1:1 in allen fünf Apps liegt: **zuerst im Sage-Kanon
  `src/modules/23_rendezvous_ui.js`**, dann byte-kopiert nach `sbkim-bundle/` +
  BookLedgerPro + Mein-Tresor + Jasons-Tresor + family-project + Kimboard
  (`modules/`). Kimboards sha256-Drift-Guard-Pin nachgezogen.
- **0c — BookLedgerPro-Schubladen-Widerspruch geheilt.** `sbkim/sbkim-init.js`
  rief Modul 23 mit `dbSuffix:"bookledgerpro"`, während die App-Identität in
  `bookledgerpro-sbkim` liegt (`index.html:54` + `DB_SUFFIX`). Beide Modul-23-Aufrufe
  nutzen jetzt die Variable `DB_SUFFIX` (= `bookledgerpro-sbkim`) → keine Phantom-DB
  `sbkim_bookledgerpro` mehr, die vorhandene Identität bleibt auffindbar.
- **0d — die zwei Tresore wieder unterscheidbar.** Der 🌐-Anmelde-Pfad in beiden
  `sbkim/sbkim-init.js` bettete den **generischen, zeichengleichen** Satz ein →
  Live-Cosinus exakt 1,0. Jetzt liest jeder Tresor seine **reiche, app-eigene**
  Beschreibung (identisch zum Andock-Wizard `assets/siegel-inhalt.js` WIZ). Jasons
  `scripts/generate_spore.mjs` mitgezogen. Gegenprobe headless: der Einbettungs-Text
  war vorher **byte-identisch** (= gemessener Cosinus 1,0), ist jetzt **verschieden**
  → echter e5-Cosinus < 1,0. **Der reale Browser-Cosinus wartet auf Klaus' Lauf**
  (kein e5-Modell headless). Die committete `spore.json` wurde **nicht** überschrieben
  (ihr echter Browser-Vektor darf nicht durch einen Demo-Stub ersetzt werden).
- **0e — Register ehrlich.** `status.json` (neues Top-Feld `identityNote` + Notiz am
  BLP-Eintrag) und `sbkim/NETZ-STAND.md` trennen jetzt **committete** (Register-)
  gegenüber **lebender** (Raum-)Identität; BLP läuft **live v0.2** (Register führt
  v0.1). Werte aus Klaus' Analyse übernommen, **nicht** neu verifiziert (Live-Sporen
  liegen in Klaus' Downloads).

**Beweis (headless).** Sage `smoke_bau23_rendezvous_ui.mjs` **87/87** (vorher 83, +4
neue 0a-Proben) · `smoke_bundle_connect` 21/21 · `smoke_bau23_rendezvous` 59/59 ·
`smoke_bau23b_kartenechtheit` 16/16. Kimboard `node --test` **6/6** (Drift-Guard-Pin
+ zwei vorher fehlende Modul-Kopien `echtheit.js`/`relay_rotation.js` in die Manifest-
Liste nachgetragen — main war dort **schon rot**, jetzt grün). Mein-Tresor 53/53 ·
Jasons-Tresor 59/59 · BookLedgerPro `tests/run.mjs` 2153/0 · family-project Nicht-
Browser-Smokes grün (`smoke_all.mjs` braucht playwright-core, im Container nicht
installiert — reiner Browser-Test, keine Regression durch die Anzeige-Änderung).

**⛔ STOPP nach 0a — bewusst, kein Zweifel.** 0b (Identität haltbar machen:
Installations-Hinweis + Sicherungs-Angebot + Wiederherstellen im Panel) wartet auf
**Klaus' Messung über Nacht** (öffnen → Kennung notieren → Hard-Reload → gleich? →
nächster Tag → gleich?). Erst das Ergebnis entscheidet, was 0b tun muss.

**Browser-Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf.**

**Nächster sinnvoller Schritt.** Klaus misst über Nacht (0a). Ergebnis → 0b bauen
(installieren/Sicherung/Wiederherstellen). Danach Stufe 3 „Bekannte bevorzugen".

---
