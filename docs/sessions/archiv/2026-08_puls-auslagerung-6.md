# PULS-Auslagerung 6 (2026-08-24)

**Wortwörtlich ausgelagert aus `docs/PULS.md`.** Nichts gekürzt, nichts
zusammengefasst, nichts umformuliert.

Die Datei stand bei 2.985 Zeilen, fünfzehn unter der Grenze von 3.000. Die
Schutz-Klausel im Anker sagt: **auslagern statt kürzen**, und die Grenze nicht
herabsetzen. Ausgelagert sind die ältesten noch enthaltenen Sitzungs-Einträge,
vom **15.08. bis 17.08.2026**.

> Diese Auslagerung geschah **vor** dem Schreiben des neuen Eintrags, nicht
> danach. Das Übergabeprotokoll der gelben Runde hatte genau darauf
> hingewiesen: wer erst schreibt und dann auslagert, reißt die Grenze im ersten
> Absatz.

---

## Stand 2026-08-17 (Pflege) — 🏷️ Gerätename netzweit ins Verbinden-Panel

**Klaus' Befund:** im Sage-Panel steht oben ein Feld für den Gerätenamen, bei den
anderen Mycel-Knoten nicht. Auftrag: als **festgeschriebene Bauregel** netzweit
nachziehen.

**Der Befund war schlimmer als „fehlt".** In zehn Apps war der Name **halb** eingebaut:
der Glue **las** ihn (`geraetename()` / `displayNodeName()`) und hängte ihn an die
Anmeldung — aber es gab **kein Feld, um ihn einzutragen**. Ein totes Feature, das im
Code aussieht wie ein vorhandenes. Wer nach `sbkim_geraetename` greppt, findet Treffer
und hält es für erledigt.

**Getan:**
- **`docs/INTERFACES.md` §11.7** als netzweite Tafel: Feld im Panel · Einbau nur im
  app-eigenen Glue, **nie** in die byte-kopierte Panel-Datei (Drift-Guard) · Marke
  `data-sbkim-geraetename` mit **panel-scoped** Doppel-Prüfung · Abgleich aller Felder
  beim Namenswechsel · kein Spore-Re-Sign · die drei Sicherheits-Regeln (Name immer mit
  Kennung, eigener Kontakt-Name gewinnt, selbst gewählte markiert).
- **Rollout in 20 Repos.** Zehn bekamen das Feld überhaupt erst (Alis-Moderaum,
  BookLedgerPro, Kim-Bell, Kimseek, Mein-WorkFloh, Mein-Workfloh-Page,
  Perfect-Skin-Fashion, SB-KIMTool-Point, Kimboard, Private Brain); neun wurden auf die
  neue Fassung gehoben; Company Brain (kein geteiltes Panel) und PWA Toolpoint (eigene
  Benennung) von Hand.
- **Vier Sonderfälle von Hand** statt schematisch: Mein-Rezeptbuch baut Buch-Name und
  Gerätename aus **einem** Helfer — die Marke wird dort **bedingt** gesetzt, sonst
  überschriebe der Abgleich den Buch-Namen. Kimboard und Private Brain behalten ihr
  eigenes Feld und bekommen die Marke. PWA Toolpoint heißt seine Funktion anders.
- **Skill `geraetename`** auf den Panel-Einbau umgestellt (vorher: vier Stellen in der
  `index.html`) und um Marke, Abgleich und die Fetch-Lehre erweitert.
- **CLAUDE.md** in Sage und in den zehn Repos, die eine haben.

**Zwei Lehren, beide teuer bezahlt:**
1. **Eine Bestandsaufnahme auf ungefetchten Klonen ist keine.** Meine erste Übersicht
   meldete drei Apps falsch — zwei hatten das Feld längst, bei einer hatte eine
   Parallel-Sitzung am selben Tag nachgezogen. Erst der Vergleich gegen `origin/main`
   (`git grep … origin/main`) war belastbar.
2. **Ein Schema-Skript über 20 Repos braucht eine Ausnahme-Erkennung.** Der erste Lauf
   setzte die Einrückung falsch (Anker war die falsche Zeile) und wäre über
   Mein-Rezeptbuchs Zwei-Felder-Helfer hinweggegangen. Beides fiel nur auf, weil der
   Diff gelesen wurde statt nur der Erfolgsmeldung.

**✅ Browser-Sichttest GRÜN (Klaus, 2026-08-17, Mycel-Analyse-Rekord 16:44–16:51):**
zwei Kimboard-Instanzen im Raum als **„Kimboard · Klaus Handy"** und **„Kimboard ·
Klaus Tablet"** (getrennte Kennungen + Schlüssel), Karte führt sie als „Kimboard ×2"
zusammen, Handschlag **beidseitig** `established` (16:50:08 Tablet→Handy, 16:50:28
zurück).

**Der eigentliche Befund steckt in den Feldern:** `content.nodeName` trug den Zusatz,
`spore.nodeName` blieb bei beiden `"Kimboard"`, `domainVector` identisch. Damit ist
„kein Spore-Re-Sign" nicht mehr nur Vorschrift, sondern **gemessen** — wäre der Name in
die signierte Identität gewandert, hätte sich der Vektor verschoben und der
0.80-Riegel die beiden womöglich getrennt.

**✅ Panel-Feld belegt (Klaus, 2026-08-17 ~19:10):** Panel aufgeklappt, das Feld sitzt
als erste Zeile im Fenster „Mit dem Knotennetz verbinden". Panel-Feld und Kimboards
eigenes Feld trugen denselben, frisch geänderten Wert (`Klaus Tablet` →
`Klaus Tablettesst`). Belegt ist damit, dass die Felder **nicht auseinanderlaufen** —
ein Standbild unterscheidet nicht zwischen live gleichgezogen und nach einem Neuladen
beide aus demselben Speicher gefüllt. Für den Zweck der Regel genügt das; mehr wird
nicht behauptet.

**Zwischenspiel, das ins Protokoll gehört:** Klaus' erster Reflex auf die zwei Felder
war **„keine 2 Etiketten / Gerätenamen"**. Auf die Rückfrage, *welches* verschwinden
soll — das app-eigene oder das im Panel —, entschied er **„so lassen"**. Kein Umbau,
Punkt 3 der Tafel bleibt. Die Rückfrage war trotzdem richtig: die andere Antwort hätte
einen Eingriff in Kimboards Seite und Private Brains Pinnwand-Fenster bedeutet.

**✅ Geschlossen am selben Tag (Klaus: „Okay, leg los"):** die zehn Repos ohne
`CLAUDE.md` haben jetzt eine (Alis-Moderaum, Company-Brain, Kim-Bell, Kimboard,
Kimseek, Mein-Workfloh-Page, Perfect-Skin-Beauty/-Fashion, Tomys-Hub,
family-project). Details im Übergabeprotokoll
[`2026-08-17_rechte-geraetename-anker.md`](sessions/archiv/2026-08-17_rechte-geraetename-anker.md).

---

## Stand 2026-08-16 (Bau) — 🔒 Das Siegel prüft jetzt auch den Raum (Modul 05b)

**Klaus' Wort:** *„ja, 05b ins Siegel aufnehmen"*.

**Der Anlass war ein Widerspruch, kein Fehler im Code.** Das Netz-Fenster von
Alis Moderaum meldete auf Klaus' Tablet „✗ Raum-Lesen fehlgeschlagen: Kein
Nostr-Relais-Client (Modul 05b) verfügbar" — **und das Siegel leuchtete
trotzdem**. Es prüfte sieben Module; der gemeinsame Raum war keines davon. Ein
Siegel, das goldenes Vertrauen zeigt, während der Knoten den Raum gar nicht
lesen kann, sagt die Unwahrheit. Genau davor soll die Anti-Greenwashing-Klausel
(Karte 16) schützen — sie griff nicht, weil die **Liste** unvollständig war,
nicht weil die Prüfung schwach war.

**Der Einwand dagegen — und warum er nicht trug.** Diese Sitzung hatte Klaus
zuerst gewarnt, die Aufnahme lasse anderswo Siegel *erlöschen*. Klaus fragte
nach („Wie soll denn das gehen?"). Nachgemessen über **alle 22 Knoten-Repos**:
jeder lädt 05b. Die Warnung war eine Vermutung, keine Messung. Die Aufnahme
löscht nirgends ein Siegel — sie verhindert nur, dass eines leuchtet, wo der
Raum tot ist.

**Getan:**
- `src/modules/16_siegel.js` — `PFLICHT_MODULE` hat **acht** Einträge. Geprüft
  wird `subscribe`, nicht `publish`: daran hängt das **Lesen** des Raums; wer
  nur senden kann, nimmt nicht teil. Kanon-sha `3e17f6474fc7`.
- Ein `ZERTIFIKAT_ASPEKTE`-Eintrag dokumentiert es im Modal
  (Ehrlichkeits-Kopplung: Code und Aspekt zusammen, nie einzeln).
- Vertrag zuerst: `INTERFACES.md` §1 Modul 16, dann Karte 16, `CLAUDE.md`,
  `docs/PFLICHT_MODULE.md`, `docs/MYCEL-GESCHENKBOX.md`,
  `tests/smoke_bauvorlagen.mjs` (acht statt sieben) und die Stufe-2-Bauvorlage.
- **Netzweiter Rollout: 21/21 Kopien tragen den Kanon** (gegen `origin/main`
  geprüft, nicht gegen den lokalen Klon). Dazu 13 sha-Pins nachgezogen und in
  **zehn** Repos die `CACHE_VERSION` erhöht — ohne die liefert der
  Service-Worker die alte Fassung weiter, und die Änderung erreicht das Tablet
  nie.

**Neu: `tests/smoke_bau16_pflicht_05b.mjs`.** Die zweite Hälfte ist der Punkt —
sie baut die Umgebung **ohne** Relais-Client und verlangt, dass das Siegel dann
ausbleibt. Ohne sie liefe die Probe genauso grün, wenn 05b gar nicht in der
Liste stünde.

**Ein Fehler dieser Sitzung, den er gefangen hat:** der neue Aspekt trug zuerst
die Feldnamen `moduleId`/`title` statt `module`/`aspect`. Gültiges JavaScript,
`node --check` zufrieden — und das Modal hätte einen **leeren** Eintrag gezeigt:
eine Sicherheits-Änderung, die sich selbst dokumentiert, mit unsichtbarer
Dokumentation. Gefunden hat das nicht eine Probe, sondern das **Lesen des
Diffs** (Rollout-Rezept Schritt 2). Ab jetzt eine Probe; beide Fehler wurden
gegengeprobt und werfen sie um.

**Proben:** `node tests/run_alle.mjs` → **74 grün, 0 rot, 0 nicht lauffähig**;
Gegenprobe Bauvorlagen 7/7. Zwei Repos melden rot aus vorbestehenden Gründen
(Privat-Brain: `playwright-core` fehlt; SB-KIMTool-Point: `fake-indexeddb`
fehlt) — beides auf blankem `origin/main` gegengeprüft, identische Zahlen.

**Offen:** Klaus' Browser-Sichttest. Headless beweist die Logik, nicht das
Abzeichen auf der Seite — und genau dieses Abzeichen war das Problem.

## Stand 2026-08-16 (Pflege) — ⚖️ Urheberschaft und Rechte, netzweit geklärt

**Klaus' Frage:** in den USA habe ein „Vibecoder" einen Prozess verloren und alle
Rechte an seinen Apps eingebüßt, weil Anthropic per Wasserzeichen die Urheberschaft
nachgewiesen habe. Sorge dahinter: dass eines Tages Ansprüche oder Geldforderungen an
seinen 33 Repos hängen.

**Befund (Web-Recherche 2026-08-16).** Den Prozess gibt es nicht. Drei echte
Nachrichten sind zu einer falschen Geschichte verschmolzen: (1) Claude setzt seit dem
2026-08-02 wirklich Wasserzeichen — als **Transparenz-Pflicht** nach Art. 50 EU-KI-VO,
die *Verarbeitung* belegt, nicht Urheberschaft, und bei Code bewusst schwächer ist.
(2) Der 1,5-Mrd.-Vergleich hatte Anthropic als **Beklagte** wegen Trainingsdaten.
(3) Rein maschinell erzeugtes Material ist nicht schutzfähig (§ 2 Abs. 2 / § 69a UrhG;
Thaler v. Perlmutter) — wer damit klagt, kann verlieren, aber weil **niemand** Rechte
hat, nicht weil ein Anbieter sie hätte. Anthropics Bedingungen treten die Rechte an den
Ausgaben ausdrücklich an den Kunden ab; es gibt keine Beteiligungs-Klausel.

**Die echte Lücke war eine andere:** von 33 Repos hatte **eines** eine Lizenzdatei
(Mein-WorkFloh). Die menschliche Prägung — Architektur, Verträge, Auswahl der Module,
Kalibrier-Messreihen, Brief-Kette, Git-Historie — war überall vorhanden, aber nirgends
als Rechte-Aussage formuliert.

**Getan:**
- **`docs/URHEBERSCHAFT_UND_RECHTE.md`** angelegt — kanonische Fassung für alle Repos:
  Faktencheck mit Quellen, Einordnung der Wasserzeichen, Anbieter-Bedingungen, deutsche
  Rechtslage, was trägt und was ehrlicherweise nicht, Marken-Zeiger, Geld-Frage,
  Beweissicherung. Ehrlich vermerkt: `anthropic.com` war aus dieser Umgebung nicht
  abrufbar, geprüft wurde über Fachberichterstattung.
- **Zwei Lizenzen** eingeführt (Klaus' Entscheid): **A · Protokoll-Lizenz** offen mit
  Namensnennung für Sage-Protokol, SB-KIMTool-Point, mycel-karte — das Protokoll *soll*
  nachgebaut werden können; **B · App-Lizenz** nach dem Muster der bestehenden
  `Mein-WorkFloh/LICENSE` für die übrigen Repos.
- **`LICENSE` + `RECHTE.md` in alle Repos** ausgerollt; die kurze `RECHTE.md` verweist
  auf die kanonische Fassung hier, damit nicht 33 Kopien gepflegt werden müssen.
- **Mit-Bauer-Klarstellung** in `docs/einladung/einladung.md` (alle vier Sprachen),
  `docs/einladung/index.html`, `CLAUDE.md` § Schicht 3 und
  `docs/components/_vision_einladung.md`: der Begriff bleibt inhaltlich unangetastet,
  ein Satz stellt klar, dass er eine Würdigung ist und keine Aussage über Urheberschaft.

**Offen / nächster sinnvoller Schritt:** Klaus sollte einmal selbst in die
Anbieter-Bedingungen sehen und eine datierte Kopie ablegen (Abschnitt 9, letzter Punkt).
Markenanmeldung erst bei Stufe 2 des Marktplatzes zu entscheiden.

---

## Stand 2026-08-16 (Bau) — 🍄 Vier Marktplatz-Apps werden Endknoten

**Klaus' Auftrag:** die im PWA-Toolpoint eingetragenen Apps ins eigene Mycel
aufnehmen, „nach dem Bauplan aus Sage" — mit dem **Flying Widget** und dem
**selbstausfüllenden Siegel**, und dabei *immer erst die aktuellste Fassung
suchen, notfalls Sage nachziehen*. Auf Rückfrage: „die vorhandene ist gemeint,
bau damit."

**Der Abgleich zuerst** (alle 33 Repos, nach Inhalt, mit Fingerabdruck +
Datum): Sage trägt bei **beiden** Werkzeugen den neuesten Stand
(`23_rendezvous_ui.js` `b496bc86…`, `16_siegel.js` `95003d20…` vom 15.08.).
Klaus' Bedingung trifft also nicht zu — Sage musste nicht nachgezogen werden.
Das ist ein **Messergebnis, keine Eigenschaft von Sage**; beim nächsten Mal
wieder messen.

**Gebaut und gemergt (4 Repos, 6 PRs):** Alis Moderaum (`#39`+`#40`, trägt
zwei Marktplatz-Einträge) · Perfect Skin Fashion (`#15`+`#16`) · Perfect Skin
Beauty (`#43`, eigene Domain) · Muster Werbetechnik (`#7`, die „Internetseite").
Je 13 Kanon-Module byte-1:1, App-eigener Klebstoff (eigene Schublade, eigenes
Wizard-Präfix, graviertes Wappen-Band), Kette in der **Leerlaufpause** statt im
kritischen Pfad (die Messwerte dieser Seiten stehen öffentlich im Marktplatz),
Reihenfolge verdrahtet **und bewacht** (17 vor 15/16 — sonst hängen Lampe und
Siegel lautlos ins Leere).

**Was die Wächter gefangen haben** — und ohne die durchgerutscht wäre:
1. Die Sicherungsdatei hätte in allen vier weiter `kimboard-backup-….json`
   geheißen (sichtbar erst, wenn man sie ein halbes Jahr später sucht).
2. Bei Perfect Skin Beauty war die Prüfung „läuft die Seite noch?" **blind**:
   sie suchte das *Wort* `script.js`, das dort fünfmal in Kommentaren steht.
   Geschärft, und in den zwei früher gebauten Repos nachgezogen — **eine
   Prüfung, die zufällig recht hat, ist keine Prüfung.**
3. Ein doppelt maskierter Punkt im Generator (`effects\\.js` statt
   `effects\.js`) machte eine Prüfung dauerhaft rot.
4. Perfect Skin Beauty läuft unter eigener Domain — ohne Eintrag hätte der
   Wächter **die eigene Seite** abgewiesen. Jetzt drin, mit und ohne `www.`

**🚫 Küchenzettel wurde bewusst NICHT gebaut.** Es sieht aus wie eine
Rezept-App, ist im Code aber eine **Tarn-Hülle** („App-Hopping schlägt
App-Verbote", „Tarnung gegen ein echtes Regime"). Ein sichtbares Netz-Fenster
plus Siegel plus Karten-Link wäre das Gegenteil dessen, wofür sie gebaut wurde.
Klaus überließ die Entscheidung der Sitzung; entschieden wurde: nichts
anfassen. Volle Begründung + der schonende Weg, falls es doch soll:
[`BRIEF_MYCEL_AUFNAHME_TOOLPOINT_APPS.md`](sessions/BRIEF_MYCEL_AUFNAHME_TOOLPOINT_APPS.md)
§ A.1.

**Ehrlich zum Stand:** die vier sind **andock-bereit, noch nicht im Mycel**.
Die lebende Identität entsteht im Browser pro Adresse — eine Sitzung kann sie
nicht erzeugen. Sie entsteht, wenn Klaus in jeder App einmal den Wizard im
Siegel drückt. Erst danach gibt es eine echte `nodeId` für `status.json` und
die Mycel-Karte.

**Offen:** Klaus' Andock-Lauf (4×) · die B-Liste des Briefes (11 zurückhängende
Siegel-Kopien, 5 zurückhängende Widget-Kopien, darunter **Sages eigenes
`sbkim-bundle-voll/`** und PWA-Toolpoint) · `Kimseek` und `Privat-Brain` haben
ein Siegel **ohne Identitäts-Wechsler**.

## Stand 2026-08-16 (Pflege) — 📄 Papiere bereinigt zurück · ein Wächter, der wirklich hineinsieht

**Was Klaus wollte** (2026-08-15/16): der Name des Hauses, dem die alten
Konzeptpapiere einmal vorgelegt wurden, soll **überall** verschwinden — „auch aus
den PDFs", damit kein Eindruck einer Zusammenarbeit entsteht und keine Abmahnung
droht. Danach: „ja, hol die Papiere bereinigt zurück." Die Form hat Klaus selbst
vereinfacht: an der Stelle des Namens **drei Punkte**.

**Gemacht (PR `#863` entfernt, PR `#864` zurückgeholt).** Die drei Papiere sind
**neu gesetzt**, nicht geschwärzt — eine Schwärzung im alten PDF ließe den Text
darunter stehen. HTML von Hand (Tabellen aus dem alten PDF rekonstruiert) +
`sbkim-demo/papiere/print.css` (nüchterner Bericht, **nicht** die Magazin-Optik
der Einladung) + `_pdf.mjs` nach dem Hausmuster aus `docs/einladung/_pdf.mjs`.
Über den Namen hinaus sind auch **Firmen-Domänen, Produkt- und Community-Namen**
heraus — mit „…" davor wären sie weiter identifizierbar gewesen, und Klaus' Ziel
war ausdrücklich „dass keine Rückschlüsse gezogen werden können". Jedes Papier
trägt oben einen **Einordnungs-Kasten**: Zeitdokument von damals, was eingelöst
wurde (das Matching läuft) und was **bewusst nicht** gebaut wurde (Lizenzserver,
Treuhand, Zertifizierungsstelle, Datenburggraben — siehe
[`PLAN_PILZ_WIRTSCHAFT.md`](PLAN_PILZ_WIRTSCHAFT.md)).

**Die eigentliche Lehre steckt im Wächter** (CLAUDE.md § „Die dritte Falle").
Zweimal war „im PDF steht nichts mehr" grün, ohne dass jemand hineingesehen
hatte: erst wurde die **Datei** statt des Inhalts durchsucht (PDF-Text ist
gepackt — `grep` findet dort grundsätzlich nichts; Klaus hat nachgefragt, dann
kamen **35 Treffer**), dann konnte der neue Leser die **Chromium**-PDFs nicht
lesen (Text als Glyph-Nummern eines Schrift-Ausschnitts). Deshalb prüft
`tests/smoke_papiere_bereinigt.mjs` **erst**, ob überall hineingesehen wurde
(kein Strom verschlossen, kein Zeichen unzuordenbar, genug Text), und **erst
dann** auf Fundstellen — zwei Lesarten *glatt*/*flach* gegen gebrochene und
gesperrt gesetzte Schreibweisen. `sbkim-demo/papiere/_pdf_text.mjs` geht den
vollen Weg Seite → Schrift → ToUnicode → Buchstaben. `tests/gegenprobe_papiere.mjs`
baut sieben Fehler ein, **zwei davon wirklich in ein neu gebautes PDF** — alle
sieben werden bemerkt.

**Nebenbei:** `hub.html` registrierte ein `./sw.js`, das es nie gab (404 bei
jedem Aufruf, stumm weggefangen). Entfernt, `aktualisieren.js` dort ergänzt.

**Proben:** 72 grün, 0 rot, 0 nicht lauffähig · Gegenprobe 7/7 · keine toten
Verweise · kein waagerechter Lauf (412 px / 1350 px) · 0 von 24 Tabellen laufen
im Druck über.

**Offen / nächster Schritt:**
- **Klaus' Browser-Lauf** an der Demo: öffnen sich die drei PDFs am Tablet, und
  treffen die Einordnungs-Kästen den richtigen Ton? (Nicht headless prüfbar.)
- `hub.html` lädt Schriften von **`fonts.googleapis.com`** — ein CDN, entgegen
  der Offline-Regel. Vorbestehend, hier bewusst **nicht** angefasst: ein
  Schriftwechsel ändert das Aussehen und gehört in eine eigene Entscheidung.

## Stand 2026-08-15 (Pflege) — 🧬 Modul-23-UI netzweit · Modul 15 aus BLP in den Kanon

Übergabeprotokoll:
`docs/sessions/archiv/2026-08-15_modul23-ui-netzweit-modul15-kanon.md`.

**Sieben Merges, vier Repos.** Die Modul-23-Oberfläche stand netzweit still: vier
Kopien hingen 150–780 Zeilen hinter dem Kanon. BookLedgerPro (`#302`), Kim-Bell
(`#42`), Mein-WorkFloh (`#170`), SB-KIMTool-Point (`#150`) — alle jetzt byte-1:1
auf `4882c3b6`. **Nachgezählt: es sind 16 Kopien im Netz, nicht vier**; die
anderen zwölf standen schon richtig, geprüft gegen `origin/main`, nicht gegen den
lokalen Klon.

### Der Fund, der die Sitzung gedreht hat

Beim Abgleich *aller* Kopien in BookLedgerPro trug **Modul 15 eine BLP-eigene
Buchhaltungs-Synonym-Karte** (`BLP_QUERY_SYNONYMS` + `queryWithInclusion`, seit
2026-07-11). Echte, nützliche Funktion — an der einen Stelle, die niemand ändern
darf. **Ein blindes byte-1:1-Nachziehen hätte sie gelöscht**, und niemand hätte es
gemerkt: die Cross-Knoten-Suche hätte einfach etwas weniger gefunden.

Statt sie zu überschreiben, ist sie **in den Kanon gewandert** (PR #852): neue
Option `queryInclusion` / `setQueryInclusion`, **Default aus** — wer nichts
einstellt, bekommt exakt den bisherigen Pfad. Die **Worte** stehen jetzt in BLPs
eigenem Klebstoff (`sbkim/sbkim-init.js`), wo die Domäne bekannt ist. Wer dort ein
Fachwort ergänzt, ändert kein Modul mehr.

Modul 16 trägt den Pflicht-Aspekt dazu — und der sagt ausdrücklich, dass dies
**keine** Schutz-Verbesserung ist. Ein Aspekt, der mehr behauptet als er leistet,
wäre genau das Greenwashing, das Karte 16 verbietet.

### Drei Repos hatten gar keinen Wächter für ihre Kopien

„Kopieren, nicht klonen" stand dort nur als Versprechen. Deshalb neu:
BookLedgerPro (15 Module genagelt) und SB-KIMTool-Point (18) haben jetzt einen
Drift-Guard mit Vollzähligkeits-Prüfung. Bei Point wiegt das am schwersten —
**Kim-Bell und Mein-WorkFloh nennen `SB-KIMTool-Point/web/tools/*` als Quelle
ihrer eigenen Kopien**, ein Drift dort wandert also weiter. Seine sechs offenen
Abweichungen sind im selben Zug zu (`#151`); keine trug Point-eigene Logik.

### Was offen bleibt

- **Modul 15 steht netzweit in fünf Generationen** — und das war schon vor dieser
  Sitzung so (`fbf9f42d` in acht Repos, dazu `33d6fe0c`, `0f8a3f69`, `92948a91`,
  `8a07567f`). Der Kanon-Sprung hat eine sechste obendrauf gesetzt, die
  Zersplitterung aber nicht verursacht. Ein eigener Rollout, kein Nebenbei.
- **Klaus' Browser-Sichttest** für alles aus dieser Sitzung.
