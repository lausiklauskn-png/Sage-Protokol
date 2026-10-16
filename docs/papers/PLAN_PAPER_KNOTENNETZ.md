# Plan · Paper S: Sicherer Umgang im Knotennetz

**Stand: 2026-10-15.** Gerüst, kein Text. Wunsch von Klaus am selben Tag: ein Paper, das
zeigt, wie man ein Knotennetz so baut, dass Angriffe ins Leere laufen. Eine Gegenüberstellung
von Angriffen und Gegenmaßnahmen, zur Diskussion gestellt, damit andere sie vergleichen
können. **Als Ergänzung zum veröffentlichten SBKIM-Paper**
(`sbkim-paper-de.html` / `-en.html`, DOI 10.5281/zenodo.22277738), nicht als Ersatz.

> Hier stand eine Sperre für Kimhub (Gegenprobe lief dort). Klaus hat sie am 2026-10-15
> aufgehoben; die Forschungseinträge stehen in Kimhub (#376).
>
> Die veröffentlichten Papers werden **nicht** geändert. Wo dieses Paper einem älteren Satz
> widerspricht, sagt es das offen, mit Messung.

---

## Arbeitstitel

*Sicherer Umgang im Knotennetz: welche Angriffe es gibt, was gemessen dagegen wirkt, und wo
die Grenze liegt*

Englisch: *Safe conduct in a node network: attacks, measured countermeasures, and their limits*

## Der Kern

- **Ein Knotennetz ohne Server hat keinen Türsteher.** Jeder kann einen Knoten anlegen, jeder
  kann im Raum schreiben. Schutz entsteht nur beim **Empfänger**, durch Prüfungen, die er
  selbst vornimmt.
- **Keine einzelne Prüfung genügt.** Wirksam ist eine Folge von Hürden: billige zuerst, teure
  erst beim Ernstfall. Das Vorbild ist die Natur, die Arten mit mehreren Stufen auseinanderhält
  (Balz → Schlüssel und Schloss an der Zelle → Paarung der Chromosomen mit Fehlerkorrektur →
  Gedächtnis an Eindringlinge). Der Vergleich trägt bis zu einer Grenze: Arten *wollen* nicht
  eindringen, Viren schon, und Viren ahmen Schlüssel nach.
- **„Garantiert" heißt hier: jede Zusicherung hat eine Probe UND eine Gegenprobe.** Die Probe
  zeigt, dass der Schutz greift. Die Gegenprobe baut den Fehler absichtlich ein und zeigt, dass
  die Probe dann rot wird. Eine Zusicherung ohne Gegenprobe ist eine Behauptung. Das ist die
  Brücke zu Paper A (Regeln sind prüfbar).
- **Was sich nicht garantieren lässt, wird benannt**, nicht weggelassen.

## Warum es eine Ergänzung braucht

Das SBKIM-Paper behandelt Angriffe in **§7.3 „Adversarielle Eingaben"** mit vier Sätzen:
SBKIM sei „resistent gegenüber SEO-artiger Manipulation", Prompt-Injektion „erfordert
Eingabebereinigung". Der erste Satz ist dort **nicht gemessen**. Gemessen ist am 2026-10-14 ein
stärkerer Weg: der öffentliche Bedeutungs-Vektor eines Ziels lässt sich **kopieren**
(Verwandtschaft 0.504 = 0.504, Andock-Riegel 1.000). Dieses Paper liefert die Messung nach
und stellt den Satz damit zur Diskussion. Quelle:
`docs/sessions/archiv/2026-10-14_angriffsflaeche_mycel.md`.

---

## Aufbau (Gliederung)

1. **Einleitung.** Ein Knotennetz ohne Server; was „sicher" hier heißen kann und was nicht.
   Werkstattzugang statt Labor (wie in allen Papers: Fallzahl eins, dafür echter Betrieb mit
   21 Knoten).
2. **Das Bedrohungsmodell.** Wer greift an (Mithörer im öffentlichen Raum, Fälscher mit
   eigenem Schlüssel, Flutender, Text, der eine KI anweisen will, eine Browser-KI beim
   Nutzer), was er kann (lesen, schreiben, Schlüssel erzeugen), was er nicht kann (fremden
   privaten Schlüssel nutzen).
3. **Stand der Forschung** (Klaus 2026-10-15, Gliederung abgestimmt). Je Quelle drei Spalten:
   was dort erforscht ist · was wir übernehmen · was wir fürs Knotennetz vorschlagen, und warum.
   Quellen und Fallbeispiele: siehe „Klaus' Wünsche zum Quellenteil“ unten.
4. **Die Wege fremden Texts.** Spore, Karte, Name, Frage, Antwort, Vektor, eingefügte
   KI-Antwort, Anzeige im Browser. Für jeden Weg: wohin er führt (Mensch, KI-Richter, Rangfolge).
5. **Die Gegenüberstellung** (Herzstück, Tabelle unten).
6. **Was die Natur bewährt hat** (eigenes Kapitel, Klaus 2026-10-15: *„da ist es bewährt,
   das ist im Prinzip die Gegenprobe … durch Erhaltung der Arten"*). Die Artgrenzen sind eine
   Bewährungsprobe über sehr lange Zeit für das **Muster**: mehrere Hürden, billige zuerst,
   Ähnlichkeit erst beim Ernstfall, Gedächtnis, Schutz dessen, was weitergegeben wird. Je
   Stufe ein Abschnitt mit der Entsprechung im Netz:
   - Balz, Paarungszeit → Raum-Marke, Zeitstempel, Relais-Grenzen
   - teure Balz (Pfauenrad) → Rechenaufwand je Zettel (S3)
   - Schlüssel und Schloss (Bindin, Izumo1–Juno) → Signaturen an Spore, Antwort, Frage (S1)
   - Paarung der Chromosomen, Fehlerkorrektur (Rad51, MSH2) → Vektor nachrechnen (S2)
   - Dobzhansky-Muller-Unverträglichkeit → Pflicht-Module im Siegel
   - Methylierung bei Bakterien → eigene Einträge markieren (S6)
   - CRISPR → signierte Sperrliste (S4)
   - piRNA in der Keimbahn → Prüfung vor dem KI-Richter (04.J, S7)
   - Verwandtenerkennung → eigene Kontakte (TOFU) und Bürgen (S5)

   **Und wo die Natur verliert — ebenso Lehre:** Viren ahmen Schlüssel nach (jedes öffentliche
   Signal ist kopierbar) · Autoimmunität (zu scharfe Abwehr trifft die Eigenen; im Netz: fremde
   Apps fallen still heraus) · Mischlinge kommen vor (Filter, keine Wand) · Arten sterben aus
   (die Bewährung zeigt die Überlebenden, nicht die Verlierer).
   Die Zuordnungen Natur ↔ Netz sind beim Schreiben biologisch gegenzulesen (Quellen unten).

   **Lesart: Störungen als Prüfmechanismus** (Klaus 2026-10-15: *„ein Virus ist kein
   Schädling, ein Virus ist ein Prüfmechanismus … wenn ein System aus dem Gleichgewicht gerät,
   zeigen diese Prüfmechanismen, dass etwas nicht stimmt"*). Viren, Autoimmunität und
   Mischlinge machen eine schwache oder fehlgehende Abwehr sichtbar, ehe man sie anders sähe.
   Im Netz dasselbe: die nachgestellte gefälschte Antwort (N1) hat die ungebundenen Antworten
   sichtbar gemacht. Folgerung fürs Netz: Angriffe, Fluten und Fehlmeldungen nicht nur abwehren,
   sondern **aufzeichnen** — sie zeigen, wo es instabil ist.
   ⚠ Als **Klaus' Lesart** kennzeichnen. Die Biologie kennt keinen Planer: ein Virus *wirkt*
   als Auslesedruck, es ist nicht dafür *vorgesehen*. Formulierung im Text: „Störungen wirken
   wie eine Gegenprobe", nicht „sind als Prüfung gedacht".
7. **Die Schichten im Netz.** S1–S7 aus `docs/PLAN_MYCEL_SCHICHTEN.md` mit Stand und Probe.
8. **Vertrauen ohne Zentrale: Bürgen.** Wie man einen Bürgen bekommt, warum ein
   selbst ausgestellter nichts zählt (Sybil), die vier Riegel (kurze Kette, Haftung, Widerruf,
   Ablauf), der Anker als ehrlich benannte Mitte. Abgrenzung zum geschlossenen Netz (ein Code
   für alle, Modul 23 „Netz").
9. **Wie man prüft, dass ein Schutz wirkt.** Probe und Gegenprobe; drei Ausgänge statt zwei
   (gefangen · blind · toter Anker); Belege aus dem Betrieb, in denen ein grüner Haken nichts
   gemessen hatte (z. B. die Echtheitsprüfung, deren Probe einen Prüfer stellte, der anders
   antwortete als der echte).
10. **Ausrollen in ein lebendes Netz.** Eine Lücke steckt in jeder Kopie: dieselbe falsche Zeile
   stand in mindestens sieben Apps. Kanon an einer Stelle, Verteilung mit Herkunfts-Riegel,
   Nachzählen auf `main` statt der Meldung zu glauben.
11. **Was offen bleibt.** Unsignierte Fragen (bis S1), Vektor-Bindung (bis S2), Wortliste vor
   dem Richter, Browser mit eingebauter KI, nicht ausgerollte Träger, nichts am Tablet gemessen.
12. **Zur Diskussion.** Die Tabelle als Vergleichsvorlage für andere Netze; Fragen an Leser.
13. **Zur Entstehung dieses Textes** (wie in den anderen Papers).

---

## Die Gegenüberstellung (Rohfassung für Abschnitt 5)

Spalte „Beleg" nennt nur, was **gemessen** ist; Vermutetes steht als solches da.

| Angriff | Was er erreichte | Gegenmaßnahme | Stand | Beleg | Grenze |
|---|---|---|---|---|---|
| Gefälschte oder nachträglich veränderte Spore im Raum | galt als echt (`!== false` gegen `{valid:false}`) | Echtheit über `.valid` | gebaut 2026-10-14, Bau 23.R | gemessen N2/N2b; Probe + 10 Gegenprobe-Fälle | prüft Herkunft, nicht Inhalt |
| Namensvetter verdrängt echten Knoten | echte Karte ausgeblendet | Prüfung **vor** dem Zusammenfassen; „derselbe Name noch N×" | gebaut | gemessen N2 a/b | gültig signierter Vetter bleibt möglich, wird angezeigt |
| Gefälschte Antwort im Namen eines Knotens | ging an den KI-Richter, „✓ Antwort von …" | Antworten signiert, nur der Gefragte zählt, sonst „unbestätigt" und kein Richter | gebaut | gemessen N1 | Fragen seit S1 (2026-10-15) ebenfalls signiert; unsignierte nur noch 2 von 6 je Minute |
| Fremder Name/Text als HTML | Skript lief (Mycel-Karte, Kimboard) | nur als Text anzeigen | gebaut | gemessen, alt 3 ROT / neu 4 grün | jede neue Anzeige-Stelle braucht denselben Riegel |
| Kopierter Bedeutungs-Vektor | gleiche Verwandtschaft, Andock-Riegel 1.000 | Vektor beim Empfänger nachrechnen (S2) | geplant | gemessen N2 b/c | braucht das Modell beim Empfänger |
| Anweisung an eine KI im fremden Text | klassische Wendungen DE/EN ausgeschlossen | Prüfliste vor dem Richter (04.J) | gebaut | gemessen N1 | umformuliert, Französisch, Homoglyphen gehen durch (S7) |
| `javascript:`-Link aus eingefügter KI-Antwort | lief nicht über die Modul-Wege, aber nur weil der Browser es so tut | Schema prüfen im Modul | offen | gemessen N3 (Chromium headless) | Android, DeX nicht gemessen |
| Fluten des Raums | — | Relais-Grenzen; Rechenaufwand je Zettel (S3) | teilweise | Relais-Grenzen gemessen 2026-08-19 | Rechenaufwand trifft auch Ehrliche |
| Selbst ausgestellte Vertrauensnachweise (Sybil) | — | Bürgschaft zählt nur über eigenes Vertrauen (S5) | geplant | — | braucht einen Anker |
| Browser mit eingebauter KI liest/bedient die Seite | — | keine aus der App heraus | — | **vermutet** | nicht schützbar von innen |

---

## Wo es kippen kann

- **„Garantie" zu weit fassen.** Garantiert ist nur, was eine Probe mit Gegenprobe zeigt, in
  der gemessenen Umgebung. Kein Wort „sicher" ohne diesen Zusatz. (Dieselbe Disziplin wie im
  In-and-Out-Book: keine Wörter „Zertifikat", „sicher", „garantiert" ohne Einschränkung.)
- **Bewährung des Musters mit Bewährung des Codes verwechseln.** Die Natur ist die lange
  Gegenprobe für das **Muster** (Klaus: „durch Erhaltung der Arten"). Ob die **Umsetzung** im
  Netz trägt, zeigt nur deren eigene Probe mit Gegenprobe. Beides gehört nebeneinander, keins
  ersetzt das andere.
- **Geplantes als Gebautes zählen.** S1–S7 stehen in der Tabelle mit ihrem Stand; was beim
  Schreiben noch nicht gebaut ist, heißt „geplant".
- **Eine Anleitung für Angreifer schreiben.** Gemessene Lücken erst veröffentlichen, wenn sie
  im Netz geschlossen sind, oder nur so konkret, wie zum Verständnis nötig. Die noch offenen
  Träger (PWA-Toolpoint, Kimseek, SB-KIMTool-Point, family-project, Kim-Bell) vorher nachziehen.
- **Das eigene Paper schonen.** Wo §7.3 des SBKIM-Papers nicht trägt, steht das hier mit
  Messung, ohne das alte Paper zu ändern.

## Quellen, die beim Schreiben geprüft werden müssen

Nicht aus dem Gedächtnis zitieren — vor der Verwendung nachsehen:
- Douceur, *The Sybil Attack* (IPTPS 2002) — für Abschnitt 8.
- Greshake et al., *Not what you've signed up for* (2023) — indirekte Prompt-Injektion, Abschnitt 4/5.
- PGP-Web-of-Trust (Zimmermann) — Bürgen als bekanntes Muster, Abgrenzung.
- Nostr NIP-01 (Ereignisse, Signatur) und NIP-13 (Rechenaufwand).
- OWASP Top 10 für LLM-Anwendungen — als Vergleichsliste.

### Klaus' Wünsche zum Quellenteil (2026-10-15)

Klaus, wörtlich: *„wichtig sind da auch die Quellenangaben. Wichtig ist, was andere schon
erforscht haben und was dahingehend mit berücksichtigt wird bei der Theorie, die wir haben …
es geht daher auch Internetseiten, Sicherheit und ähnliche Sachen. Was wir davon übernehmen
können und was vorgeschlagen wird für das Knotennetz. Und warum?"*

Daraus folgt ein **eigener Abschnitt „Stand der Forschung"** (Abschnitt 3, hinter dem
Bedrohungsmodell; mit Klaus abgestimmt 2026-10-15), je Quelle drei Spalten: **was dort erforscht ist · was wir übernehmen ·
was wir fürs Knotennetz vorschlagen, und warum**. Ergänzend zu den Quellen oben zu prüfen
(nicht aus dem Gedächtnis):
- Web-Sicherheit: OWASP Top 10 (Web), Content Security Policy (W3C), Same-Origin-Policy,
  Subresource Integrity — die Apps laufen als Webseiten auf geteilter Adresse.
- Signierte Nachrichten ohne Zentrale: Nostr NIP-01/NIP-13, Secure Scuttlebutt.
- Sybil-Abwehr und Vertrauen: Douceur 2002, Web of Trust, SybilGuard (Yu et al. 2006).
- Ratenbegrenzung und Rechenaufwand: Hashcash (Back 2002).

**Fallbeispiele aus dem eigenen Netz, drei Internetseiten** (Klaus 2026-10-15):
Perfect-Skin-Beauty, PWA-Toolpoint, family-projekt.de. **Alis-Moderaum nicht** (Klaus: „ist
noch keine Internetseite"). Gemessen wird dort nur mit echtem Abruf (Skill
`auslieferung-pruefen-und-sperren`), nicht aus dem Quelltext erschlossen.

**Browser und Knotennetz** (Klaus 2026-10-15, eigener Abschnitt): *„inwiefern der Browser
selber schon zur Sicherheit beiträgt … weil er ja auch schon Erfahrungen hat mit Internetseiten
und Angriffen … und inwiefern sich das ergänzt oder auch gegenseitig schwächt"* und *„insbesondere
Google, die Erfinder von Chrome … oder DuckDuckGo … Die nutzen ja schon KI … sogar schon einen
App-Schutz bei DuckDuckGo, der im Hintergrund die App-Aktivitäten checkt."*
Zu prüfen (Quellen nachsehen, nicht aus dem Gedächtnis): was die Plattform liefert
(Same-Origin-Policy, Sandbox, TLS, WebCrypto, Content Security Policy) · was die Hersteller
dazulegen (Google Safe Browsing und die Erkennung in Chrome, DuckDuckGo-Tracker- und App-Schutz)
· wo es sich ergänzt (signierte Zettel und Empfänger-Prüfung im Netz, Schadseiten-Abwehr im
Browser) · wo es sich reiben kann (eine gemeinsame Adresse für alle Apps auf github.io, eine
Browser-KI oder Erweiterung sieht, was die Seite sieht, ein App-Schutz kann Relais-Verbindungen
kappen). Gemessen ist davon im Netz noch nichts; was nur vermutet ist, heißt so.

**Gegenlesen:** Klaus liest jede Fassung **vor** der Veröffentlichung gegen. Sie wird ihm
dazu im Chat vorgelegt (Klaus 2026-10-15: *„muss das auch noch hier erscheinen"*), nicht
nur ins Depot gelegt.

## Material im Depot

- Befund: `docs/sessions/archiv/2026-10-14_angriffsflaeche_mycel.md` samt Proben N1–N3.
- Schichten: `docs/PLAN_MYCEL_SCHICHTEN.md`.
- Verträge: `docs/INTERFACES.md` (Bau 23.R, Antwort-Zettel v2), `docs/SICHERHEIT-BRIEFKASTEN.md`,
  `docs/E2E-VERTRAULICHKEIT.md` (dort §0 „Authentizität ist netzweit garantiert" — für den Raum
  bis Bau 23.R nicht zutreffend, gemessen).
- Proben: `tests/smoke_bau23r_echtheit_antworten.mjs`, `tests/gegenprobe_bau23r.mjs`,
  `tests/smoke_mycel_karte_log.mjs`.

## Reihenfolge

1. Gliederung mit Klaus abstimmen (dieser Plan). **Abgestimmt 2026-10-15** (Klaus: „Vorschlag ok“): zwölf Abschnitte wie geplant, dazu „Stand der Forschung“ als Abschnitt 3; Klaus' Lesart in Abschnitt 6 als seine gekennzeichnet.
2. S1 bauen, damit Abschnitt 5 nicht mit einer offenen Tür beginnt; die offenen Träger nachziehen.
3. **Fassung 1 geschrieben 2026-10-15** (`docs/papers/sicherer-umgang-im-knotennetz.md`, Entwurf, Klaus liest im Chat gegen). „Browser und Knotennetz“ steht dort als Abschnitt 11, damit die abgestimmten Nummern (Gegenüberstellung 5, Natur 6, Bürgen 8) bleiben. Jede Quelle trägt ihren Prüfstand (gelesen · Auszug · offen). Die drei Internetseiten (11.4) sind nicht abgerufen. HTML erst nach dem Gegenlesen, mit DOI.
   **Fassung 2 2026-10-16:** Stand der Schichten nachgezogen (S3, S4, S5 standen als „geplant"; dazu S5b, Wort „Empfehlen", Haftung nur für die eine App, Ablauf 180 Tage), Proben-Tabelle in 9.1 mit den Zahlen dieses Tages (Proben selbst gelaufen), drei Quellen ergänzt (Greshake: AISec '23 S. 79–90, DOI 10.1145/3605764.3623985; SybilGuard: SIGCOMM '06 S. 267–278, DOI 10.1145/1159913.1159945; Ozata: DOI 10.1038/s41576-018-0073-3), alle über Suchauszüge, nicht an der Quelle. Eine Zeile in Abschnitt 3 behauptete „am Tablet gemessen" für S3; nicht gemessen, berichtigt. 11.4 weiter nicht abgerufen (Container und WebFetch gesperrt, 2026-10-16). Offen: Klaus' Gegenlesen, 11.4, HTML, EN.
   Danach: 3. Fassung 1 auf Deutsch als Markdown (Quelle), HTML erzeugt wie bei Paper A
   (`tools/paper-md-zu-html.mjs`), mit eigenem Wächter.
4. Englische Übersetzung, gleiche Gliederung (Wächter wie `smoke_paper_a.mjs`).
5. Veröffentlichung über Zenodo (`ZENODO_WEG.md`), mit Verweis auf den DOI des SBKIM-Papers.
