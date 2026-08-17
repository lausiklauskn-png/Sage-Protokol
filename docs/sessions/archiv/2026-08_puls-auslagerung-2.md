# PULS-Auslagerung August 2026 (2) — die Sitzungen vom 11. und 12.08.

Ausgelagert am **2026-08-17** aus `docs/PULS.md` (Schutz-Klausel: 3000 Zeilen —
**auslagern statt kürzen**; die Datei stand bei 2956). Der Inhalt ist
**wortwörtlich** übernommen, nichts gekürzt und nichts zusammengefasst; die
Git-Historie trägt ihn ohnehin.

Verfahren wie bei den Auslagerungen vom 2026-07-24 und 2026-08-14: Archiv-Datei
+ Zeiger an der Schnittstelle. Die stehenden Abschnitte („Als nächstes",
„Schnellüberblick", „Endknoten", „Offene Querschnitts-Fragen") bleiben in
`PULS.md` — ausgelagert werden nur Sitzungs-Einträge.

---

## Stand 2026-08-11 (2) — ⛔ Die Ampel: sperren aus dem Studio, lösen nur in der Datei

**Rolle:** Hauptsitzung. **Schritt 3 der Rauswurf-Regel** (Auftrag:
`docs/sessions/BRIEF_WAECHTER_TOOLPOINT_UND_SCHALTER.md`). Vier PRs, alle
gemergt: PWA-Toolpoint #32 · family-project #265 · Kimboard #89 · Kimseek #58.

**Was gebaut wurde.** PWA Toolpoint kann einen Eintrag jetzt **sperren** — dort,
wo Klaus ihn sieht, nicht über einen Datei-Editor. Handschalter
`assets/config/wache-hand.json`, Band an der Karte (`assets/karte.js`), zwei
Knöpfe im Studio („⛔ Sperren", „⚠ Vorbehalt", zweistufig, mit Pflicht-Grund).
**Rot heißt nicht „weg":** der Eintrag bleibt sichtbar, der Grund steht dabei,
nur der Link geht aus und er ist nicht mehr Fund der Woche. Ein stilles
Verschwinden wäre für den Anbieter nicht nachvollziehbar.

**Die Ampel wird eingebacken, nicht nachgeladen.** `tools/statische-listen.mjs`
schreibt sie in die Karten UND als `window.PT_WACHE` in die Seite; der Bau-Lauf
hört deshalb auch auf `wache-hand.json`. Ein Band, das erst nach dem Laden
erscheint, schöbe die ganze Liste — genau der Fehler, der dort schon einmal
CLS 0,136 gekostet hat.

**Der Riegel im Server, einseitig gelockert.** In
`family-project/server/marktplatz-api.php` stand: *„Eine Sperre soll niemand aus
dem Browser setzen oder lösen."* Das war für beide Richtungen gedacht und für
eine davon zu streng — wer eine gefährliche App vor sich hat, muss sie sperren
können, wo er sie sieht. Umgekehrt bleibt es beim Alten, aus einem einzigen
Grund: **ein Fehlgriff beim Setzen sperrt höchstens zu viel und fällt auf. Ein
Fehlgriff beim Lösen ist still.** Der Kommentar dort ist mitgeändert, nicht nur
der Code.

**Getragen wird das von einer Rangfolge, nicht von einer Sonderfall-Liste:**
`gruen 0 < (nichts) 1 < gelb 2 < rot 3`, aus dem Browser nur nach oben. Das
erschlägt in einem Satz: Herabstufen, Freigeben, „`gruen` setzen" und — der
stillste Weg — das **Weglassen** eines gesperrten Eintrags. Dazu `grund_fehlt`
(keine Sperre ohne lesbaren Grund) und `vorlage_nicht_lesbar` (fail-closed
bleibt fail-closed). Die Tabelle steht an drei Stellen, benannt in
`pwa-toolpoint/docs/RAUSWURF-REGEL.md`.

**Was die Automatik NIE darf, ist unverändert:** rot setzen · rot lösen · über
den kriminellen Fall entscheiden · still handeln.

**Beweis.** Toolpoint-Smoke **446/446** (28 neu), Gegenprobe **138 anschlagend,
0 blind** (13 neu). `smoke_studio_markt` **90/90** (18 neu) — diese Prüfungen
lesen die PHP-Datei nicht, sie **lassen sie laufen**: der `commit_wache`-Block
wird klammer-gezählt herausgeschnitten, mit Attrappen umgeben und mit echten
Nutzlasten gefüttert. Dazu `tests/gegenprobe_wache_riegel.sh` — acht Lücken
einzeln wieder eingebaut, **alle acht** werfen die Prüfung um.
**Browser-Sichttest ungeprüft — wartet auf Klaus.**

**Zwei blinde Wächter, gefunden von der Gegenprobe** (die Lehre aus dem Brief
hat sich sofort ausgezahlt): eine Prüfung fand `wache-hand.json` im **Kommentar**
der Workflow-Datei statt in der `paths`-Liste — die Zeile fehlte tatsächlich, und
die Prüfung gab der Sitzung recht. Und eine ältere Probe zielte auf eine
Code-Zeile, die ich verändert hatte; sie änderte nichts mehr und sah deshalb aus
wie bestanden.

**Nebenbefund — und die Berichtigung dazu.** Der Drift-Guard von
**PWA-Toolpoint, Kimboard und Kimseek** stand auf rot: `23_rendezvous_ui.js`
wurde mit dem Kanon nachgezogen, der erwartete Hash aber nicht. Gemessen:
Kimboard 5/6, Kimseek 10/11. Die Kopien sind byte-identisch mit
`src/modules/23_rendezvous_ui.js`, nachzuziehen war also der **Hash**.

**Repariert hat es eine parallele Sitzung, nicht diese** (#31 um 21:14, Kimseek
#57, Kimboards eigener Lauf). Mein Merge kam um 21:35; meine drei Commits waren
Doppelarbeit, zwei landeten als **leerer Diff**. Beim Messen war der Befund
richtig, beim Melden überholt. **Merksatz: zwischen Messen und Melden liegt
Zeit — ein `fetch` beim Sitzungsstart deckt zwei Stunden später nichts.**
Gefunden hat es Klaus, indem er den Brief gegenlesen ließ; berichtigt in
Toolpoint #33.

**Was offen blieb.**

- **Schritt 4 (der Schalter Hand/Automatik + Schwellen) NICHT gebaut** — bewusst.
  Beim Bauen kam ein Befund heraus, der die Bauweise festlegt: **das
  automatische Gelb darf nicht in `wache-hand.json` landen.** Die Regel sagt,
  die erste gute Messung nimmt es zurück; der Riegel lässt aus dem Browser nur
  Verschärfen zu — es käme nie wieder heraus und bliebe stehen, während die
  Seite längst schnell ist. In family fällt das nicht auf, weil das automatische
  Gelb dort im nächtlichen Bericht steht. Für Toolpoint heißt das: **gerechnet,
  nicht gespeichert**, aus `messung.unterGrenze`. Und die Grenze **50** ist keine
  Studio-Zahl — gezählt wird in `tools/messwerte-holen.mjs`; ein Regler, der sie
  ändert, während der nächtliche Lauf gegen 50 zählt, wäre ein Knopf, der lügt.
  Änderbar sind **3** (Nächte) und **4** (Meldungen). Alles notiert in
  `pwa-toolpoint/docs/RAUSWURF-REGEL.md`.
- **Klaus muss `server/marktplatz-api.php` aufs Webhosting laden** (Apache,
  konsoleH, neben `einreichung.php`/`freigabe.php`). Bis dahin scheitern die
  Sperr-Knöpfe mit `field_not_allowed` — sichtbar und in der sicheren Richtung.
  An `freigabe-config.php` ist **nichts** zu ändern.
- **`docs/PULS.md` reißt seine eigene Grenze weiter** (3000 im Kopf, rund 9560
  real). Diese Sitzung hat es **nicht** ausgelagert und sagt es deshalb hier zum
  zweiten Mal. Eigene Pflege-Runde: Älteres nach `docs/sessions/archiv/`,
  **nicht** kürzen und die Grenze **nicht** herabsetzen.

**Nachtrag 2026-08-12 — die halbe Kette ist belegt, der Rest zurückgestellt.**
Klaus hat `marktplatz-api.php` per WebFTP hochgeladen (Zeilen 415/418/428/440
gegen die Datei geprüft, 440 Zeilen, kein `?>`), und die Knöpfe **⛔ Sperren** /
**⚠ Vorbehalt** stehen an allen 14 Einträgen im Studio — beides von seinem
Bildschirmfoto bestätigt. Den **Sperr-Vorgang selbst** hat er bewusst nicht
getestet: *„vermutlich funktioniert das auch. Ich muss das jetzt nicht testen."*
Das ist seine Entscheidung und **kein Riegel** für Schritt 4. Ehrlich benannt:
belegt ist die Sichtbarkeit der Knöpfe und die Logik headless (90/90 + 8/8
Gegenproben an der echten PHP) — der Rundlauf Knopf→Server→Band nicht.

**Nächster sinnvoller Schritt:** Schritt 4 (der Schalter) nach dem oben
festgelegten Muster — das automatische Gelb **gerechnet, nicht gespeichert**.

---


> **↓ Ausgelagert am 2026-08-14 — die Sitzungen vom 03. bis 09.08..**
>
> Die Einträge stehen **wortwörtlich** in
> [`docs/sessions/archiv/2026-08_puls-auslagerung.md`](sessions/archiv/2026-08_puls-auslagerung.md)
> (2277 Zeilen). Nichts gekürzt, nichts zusammengefasst — die Schutz-Klausel
> oben verlangt **auslagern statt kürzen**, und die Git-Historie trägt es ohnehin.

---

## Stand 2026-08-12 (Pflege) — 🔒 Modul-23-Kern netzweit geschlossen

**Rolle:** Pflege-Sitzung, Nachzug offener Punkte aus dem Brief „nach Modul 17".
Übergabeprotokoll:
`docs/sessions/archiv/2026-08-12_modul23-kern-netzweit-geschlossen.md`.

**Getan — vier Merges:**

- **Sage #842** — `sbkim-bundle-voll` Modul 15 + 16 byte-1:1 nachgezogen. Die
  Box stand vor der Pflege vom 2026-08-01 (15: 249 Zeilen fehlten, das
  Fremdzugriff-Protokoll; 16: der zugehörige Aspekt). **Beide mussten zusammen
  wandern** — der Siegel-Aspekt behauptet eine Fähigkeit, die als Code in
  Modul 15 liegt. Der sha-Pin im Smoke stand noch auf dem alten Wert und
  arbeitete damit **gegen** den byte-1:1-Wächter zwei Zeilen darüber. 46/46.
- **Kim-Bell #41 + Mein-WorkFloh #169** — Modul-23-**Kern** von `bbdf02a8`
  (zwei Generationen zurück) auf den Kanon `3caa0bb1`. Ihnen fehlte
  **Schutz-Plan Stufe 2b**: fremde Karten wurden **gar nicht auf Echtheit
  geprüft**, kein Mengen-Deckel gegen Flutung. Beim Rollout am 2026-07-30
  durchgerutscht, weil ihre Kopie `modules/sbkim-rendezvous.js` heißt statt
  `sbkim/23_rendezvous.js`.
- **PWA Toolpoint #36** — Modul-23-**UI** von `1f8b6c68` (dem *vorigen* Kanon)
  auf `4882c3b6`. Datei **und** Pin waren beide alt, der Guard also in sich
  stimmig und grün — er bewachte nur den falschen Stand. Bringt Klaus'
  Sprachwahl vom 2026-08-11 ins Netz-Panel.

**Ergebnis:** der **Modul-23-Kern läuft jetzt in allen 33 Repos auf dem
Kanon** — die Sicherheitslücke ist netzweit zu.

**Bewusst NICHT gemacht:** die **vier zurückliegenden UI-Kopien**
(Kim-Bell · Mein-WorkFloh · SB-KIMTool-Point je `f117096e` ~780 Zeilen;
BookLedgerPro `c67b2942` ~152 Zeilen). Die Sitzung vom 2026-08-12 hat sie
ausdrücklich zurückgestellt („eine eigene, geprüfte Runde pro App") — das
gilt weiter. **Ehrliche Folge:** in Kim-Bell + WorkFloh **prüft** der Kern
jetzt, aber `cardsVerified`/`rejected` werden noch nicht **angezeigt**, und
die Sprachwahl fehlt dort weiter.

**Drei Funde:**

1. Der Brief nannte **2** Repos — ein Scan **nach Inhalt statt Dateiname** fand
   **5**. Dieselbe Lehre wie im Modul-17-Rollout, sofort wiederholt.
2. Der neue Kern prüft **nur**, wenn Modul 02 `verifyForeignSpore` mitbringt.
   Vorher geprüft (beide Apps: ja). Ohne diese Kontrolle wäre ein
   Sicherheits-PR entstanden, der grün meldet und **nichts** bewirkt.
3. **Zwei tote Wächter in Sage** (vorbestehend, auf blankem `main`
   gegengeprüft): `smoke_bau23_0b_identitaet.mjs` +
   `smoke_bau23c_ki_richter.mjs` haben einen selbstgebauten DOM-Ersatz, den
   die Modul-23-UI überwachsen hat (`d.getElementById is not a function`).

**Umgebungs-Befund:** Sage hat **keine `package.json`**. Ohne
`fake-indexeddb` sind **19 Smokes falsch rot** — jede Sitzung im frischen
Container sieht das neu. Mit dem Paket: 67 von 69 grün.

**Offen:** die vier UI-Runden · die zwei toten Wächter · `package.json` ·
`PULS.md` bei ~10.000 gegen 3.000 Zeilen (auslagern, nicht kürzen — **fünfte**
Meldung) · Klaus' Browser-Sichttest (Modul 17 schmal + Sprachwahl Toolpoint) ·
`marktplatz-api.php` aufs Webhosting.

---

## Stand 2026-08-12 (Plan) — 🗂 Plan: fremde Apps auf den Marktplatz holen

**Rolle:** Plan-Sitzung, kein Bau. Auftrag:
`docs/sessions/BRIEF_PLAN_FREMDE_APPS_AUFNEHMEN.md`. Ergebnis:
**[`docs/PLAN_FREMDE_APPS.md`](PLAN_FREMDE_APPS.md)**. Übergabeprotokoll:
`docs/sessions/archiv/2026-08-12_plan-fremde-apps.md`.

**Der Befund, der den Plan verkürzt hat.** Der Auftrag ging davon aus, der
„sichtbare Weg raus" müsse erst gebaut werden. **Er steht bereits:** jede
Marktplatz-Karte trägt einen **„⚑ Melden"**-Knopf (`PWA-Toolpoint/assets/app.js`
Z. 851 ff.) — nativer Dialog, ohne Konto, ohne E-Mail, mit `eintrag_id` und
Bot-Falle. Ebenso steht `own:false` ⇒ `rel="nofollow ugc"` (`karte.js` Z. 299).
Es fehlt nur **ein fünfter Meldegrund**: „Das ist meine App."

**Der `img:`-Konflikt ist kleiner als gedacht.** Die Pflicht sitzt **allein im
Studio** (`studio.js` Z. 345 · 1005). Der Renderer kann es längst: ohne Bild
zeichnet `karte.js` Z. 308–311 ein **leeres Feld fester Größe** — kein kaputtes
Bild, kein Layout-Sprung — und `fundKandidaten()` schließt bildlose Einträge vom
„Fund der Woche" aus. Vorschlag: `img` **optional für `own:false`**, Pflicht für
eigene. **Kein neutraler Platzhalter** (wäre eine Behauptung über eine ungeprüfte
App); leer ist ehrlicher und ist zugleich der Anreiz, sich zu melden.

**Die vier Antworten:** **A** nur verlinken, nie hosten (kein Fall gefunden, in
dem Hosten mehr bringt; ohne Lizenzdatei gilt „alle Rechte vorbehalten", und
gehostete Messwerte wären Klaus' Hosting-Leistung, als fremde ausgewiesen) ·
**B** ja, nach B1/B2 · **C** GitHub-Issue statt Impressum-Mail (§7 UWG; ein
kostenloses Angebot bleibt geschäftlich; 50 Anschreiben sind 50 Gelegenheiten
für **eine** Abmahnung) — wortwörtlicher Text liegt im Papier · **D** siehe unten.

**✅ Klaus' Entscheidungen 2026-08-12** (AskUserQuestion, weil Frage D gegen
seine eigene Tafel §8d lief und **nicht** stillschweigend korrigiert wird):

1. **„Der Eintrag kostet nichts."** — nicht „die ersten hundert". Damit bleibt
   alles Stufe 1: keine Preisankündigung, kein Gewerbe nötig, kein Graubereich.
   Die Zahl hundert lebt weiter als **innere Messmarke**, steht aber nirgends.
2. **Erster Schub: fünf Apps, nicht fünfzig.** Danach werden vier Zahlen gezählt
   (antworten · bleiben · wollen raus · beschweren sich), **dann** erst wird über
   den großen Schub entschieden. Abbruch-Regel vorher festgelegt.

**Klaus' Nebenfrage — wie weit vom bezahlbaren Modell?** Mit den Zahlen aus §9
(Bedarf 2.000–3.000 €/Monat): ① **2–3 Partner** · ② **~100 Kunden** à 20 € ·
③ **400–500 Käufe/Monat** · ④ bei 50 €/Jahr **500 Anbieter**. Fünfzig Einträge
sind **ein Zehntel** von ④ — und ④ kommt laut Papier erst nach ③, das erst nach
① und ②. **Die Idee zahlt auf Reichweite ein, nicht auf Einkommen** — genau das
hat Klaus selbst als Ziel benannt. Heute steht **null Einnahme** irgendwo. Von
§15 blockieren **0b** (Rohertrag als Grundlage) und **5** (verfügbare Zeit) die
*schnellen* Wege ① und ② und kosten je einen Satz — sie liegen seit 2026-08-09.

**Ehrlich vermerkt:** §14 Punkt 7 sagt, der offene Markt komme „erst wenn 1–5
stehen". Toolpoint ist vorgezogen worden. Vertretbar (der Bau war eine Kopie,
§8b), aber es ist eine bewusste Abweichung und steht so im Papier statt still
zu bleiben. An §9 ändert sie nichts.

**Nicht getan (Tabu eingehalten):** kein Eintrag, keine E-Mail, kein Code.
B1/B2/B3 sind Vorschläge und brauchen einen eigenen Bau-Brief in `PWA-Toolpoint`.

---

## Stand 2026-08-12 — 📱 Modul 17: die Blase hing halb aus dem Bild. Netzweit behoben, 15 Repos

**Rolle:** Hauptsitzung. Auftrag: Klaus, „Modul siebzehn starten" — der Punkt aus
`BRIEF_NACH_SCHALTER.md` § Offen-Liste. PRs: Sage #839 · BookLedgerPro #301 ·
Jasons-Tresor #155 · Kimboard #94 · Kimseek #60 · Mein-Mixarium #188 ·
Mein-Rezeptbuch #372 · Mein-Tresor #103 · Muttis-Rezeptbuch #184 ·
Privat-Brain #74 · Tomys-Hub #152 · family-project #269 · Kim-Bell #40 ·
Mein-WorkFloh #168 · SB-KIMTool-Point #149. **Alle 15 gemergt.**

**Der Befund, selbst nachgemessen.** Die Pille hat keine Breiten-Grenze — sie ist
so breit wie ihr Inhalt. Weil sie rechts in der Ecke hängt, wächst sie nach
**links** aus dem Bild:

| Fenster | vorher | nachher |
|---|---|---|
| 320 px | 385 px — **81 px links abgeschnitten** | 227 px |
| 360 px | 385 px — **41 px links abgeschnitten** | 227 px |
| 412 px | 385 px, passt | 385 px, unverändert **mit** Wörtern |

**Klaus' Entscheid (AskUserQuestion, gegen zwei gemessene Alternativen).** Unter
400 px tragen die Lampen keine Wörter mehr; ab 400 px bleibt alles wie bisher
(Klaus' Wunsch 2026-05-25 „1:1 Sage-Page-Stil" gilt dort weiter). Verworfen:
zweizeilig umbrechen (66 statt 34 px hoch) und alles enger stellen (reicht für
360 px, bei 320 px ragt sie weiter 7 px hinaus).

**Zwei Fallen im Fix selbst.** `max-width` allein hilft nicht — die Slots sind
Flex-Kinder mit `min-width: auto` und schrumpfen nicht unter ihre Wortbreite; der
Inhalt quölle dann aus der Pille statt aus dem Bild. Und die Trefferfläche kommt
über das **Innenmaß** zurück, nicht über `min-width`: auf denselben Slots steht
im minimierten Zustand `max-width: 0`, damit sie hinter SIEGEL zusammenschieben —
ein `min-width` hielte sie auf. Darum `padding` und die `:not([data-minimized])`-
Klammer. Das Modul warnt an der Stelle selbst davor; der Kommentar war zu lesen.

**Die Lehre dieser Sitzung: die Messung gab zu früh Entwarnung.** Der erste
Messaufbau meldete **274 px** und damit „alles in Ordnung". Zwei Fehler steckten
darin, beide in der Messung, nicht im Modul: (1) der SIEGEL-Slot mountet nur,
wenn `SbkimSiegel.isCertified()` wirklich `true` liefert (Anti-Greenwashing,
Modul 17 prüft doppelt) — ohne Stub fehlten 111 px; (2) die Messseite setzte eine
eigene Grundschrift (14 px), während alle Maße im Modul `rem` sind — der Aufbau
maß sich selbst. Erst korrigiert kam Klaus' 385 px heraus. **Eine Prüfung, die
dir recht gibt, ist der Ort, an dem du am genauesten hinsehen musst** — hier war
es kein falsches Ergebnis, sondern ein falscher Aufbau.

**Verifikation.** `smoke_bau17_floating_widget.mjs` **40/40** (zwei neue Wächter
auf dem **erzeugten** CSS, nicht dem Quelltext). Vier Gegenproben, alle schlagen
an, keine blind: Grenze entfernt (38/40) · `padding`→`min-width` (39/40) ·
`:not([data-minimized])` entfernt (39/40) · Wörter bleiben (39/40). Neu:
`tools/widget-breite-messen.mjs` misst ein Modul in Reinform, ohne dass eine App
drumherum stehen muss — gegen die alte Fassung schlägt es an (Exit 1). Je Repo
die echte Suite gelaufen, alle grün.

**Sechs Service-Worker-Cache-Bumps mit dabei** (BookLedgerPro v218 · Kim-Bell v26
· Kimboard v52 · Kimseek v33 · Mein-WorkFloh v120 · Privat-Brain v49). Ohne sie
lieferte der Offline-Vorrat die alte Fassung weiter, und der Fix wäre am Tablet
unsichtbar geblieben — der Rollout hätte grün gemeldet und nichts bewirkt.

**Netzweite Verifikation: 15/15 tragen den Kanon `dd3e0d7fb596`, 0 Abweichung**,
keine alte sha mehr im Netz. Fünf sha-Pins nachgezogen (vier `test/smoke.test.js`,
ein `tools/drift-guard.mjs`) — der Brief nannte drei betroffene Apps, es waren
fünfzehn.

**Was offen bleibt.**
- **Klaus' Browser-Sichttest** der schmalen Ansicht — headless ersetzt ihn nicht.
- **Vorbestehender Befund, nicht von dieser Sitzung:**
  `sbkim-bundle-voll/modules/15_membran.js` + `16_siegel.js` sind vom Kanon
  abgedriftet (Pflege 2026-08-01 fehlt, 261 bzw. 6 Zeilen). Gegenprobe auf blankem
  `origin/main`: dieselben zwei Fehler, 44 ok / 2 fail vorher wie nachher. Eigene
  Runde.
- **`docs/PULS.md` bei 9879 Zeilen** gegen 3000. Vierte Sitzung, die es meldet —
  und diese legt schon wieder einen Eintrag dazu.
- Der **Handgriff auf dem Webhosting** (`marktplatz-api.php`) ist weiter offen:
  Klaus hat beim Hochladen versehentlich den Brieftext in die Datei gelegt, die
  richtige Fassung wurde ihm als Datei **und** als Copy-Paste-Block geschickt.
  Rückmeldung steht aus.

**Nächster sinnvoller Schritt:** Klaus' Sichttest am Handy (Pille passt, Lampen
ohne Wörter, Antippen öffnet weiter die Fenster) — er ist der einzige Beweis, den
diese Sitzung nicht führen konnte.

---

## Stand 2026-08-12 (Abschluss) — 📋 Briefe geschrieben, Plan-Sitzung vorbereitet

**Rolle:** Hauptsitzung, Abschluss. Übergabeprotokoll:
`docs/sessions/archiv/2026-08-12_netz-mikrofon-sprachen.md`.

**Neuer Auftrag von Klaus für die Folge-Sitzung — PLAN-MODUS, KEIN BAU:**
`docs/sessions/BRIEF_PLAN_FREMDE_APPS_AUFNEHMEN.md`. Es geht um die Frage, ob
fremde PWAs vom Markt aktiv auf den Toolpoint-Marktplatz geholt werden können —
eintragen, dann die Besitzer ansprechen („willst du drin bleiben?"). Klaus'
Motiv ausdrücklich: **Reichweite, nicht Provision.**

**Warum die Idee einen richtigen Kern hat:** sie ist die logische Antwort auf
den gemessenen Befund aus `PLAN_PILZ_WIRTSCHAFT.md` §1 — **0 fremde Einträge
trotz gratis.** Warten hat nachweislich nicht funktioniert.

**Vier Stellen, an denen die Plan-Sitzung genau hinsehen muss** (im Brief
ausgeführt):

1. **Verlinken ≠ Hosten.** Ein öffentliches GitHub-Repo **ohne Lizenzdatei** ist
   nicht frei — „alle Rechte vorbehalten". Ein Fork auf GitHub deckt die
   GitHub-ToS; ein Weiterveröffentlichen auf `family-projekt.de` nicht.
2. **Das Pflichtfeld `img:`** in `listings.js` kollidiert mit Fremd-Einträgen —
   ein Bildschirmfoto fremder Apps ist deren Material.
3. **Impressum-Anschreiben ist der heikelste Punkt** (§7 UWG; ein kostenloses
   Angebot bleibt geschäftlich, wenn es dem eigenen Zweck dient). Sauberere
   Wege: GitHub-Issue im Repo des Anbieters, ihr eigenes Kontaktformular.
4. **„Die ersten hundert kosten nichts" läuft gegen Klaus' eigene Tafel.** §8d
   zieht die Grenze scharf: sobald ein Preis angekündigt wird, ist es **Stufe 2
   mit Gewerbeanmeldung davor**. „Der Eintrag kostet nichts" bleibt Stufe 1.
   **Wird Klaus vorgelegt, nicht stillschweigend korrigiert.**

**Nebengedanke (Klaus' Zusatzfrage: wie weit vom bezahlbaren Modell?).** Nach
`PLAN_PILZ_WIRTSCHAFT.md` §9 wachsen Marktplatz-Provision und Jahresbeitrag auf
den **langsamsten** Wegen (400–500 Käufe/Monat bzw. 500 zahlende Anbieter),
während ① Beteiligung **2–3 Partner** und ② Wartung **~100 Kunden** braucht.
Fünfzig Einträge sind ein Zehntel dessen, was ④ allein tragen würde — und ④
kommt laut Papier erst nach ① und ②. **Die Idee zahlt auf Reichweite ein, nicht
auf Einkommen.** Kein Abweichen vom Ziel, aber auch kein Schritt darauf zu.

**Nächster sinnvoller Schritt:** Klaus' Browser-Sichttest der zwölf Sprachen,
dann die Plan-Sitzung nach dem neuen Brief.

---

## Stand 2026-08-12 — 🎤 Das Netz-Mikrofon hörte immer Deutsch. Netzweit behoben, 16 Repos

**Rolle:** Hauptsitzung. Auftrag von Klaus: *„Ziehe jetzt die Sprachen, die wir
jetzt haben, in die Pinnwand mit hinein … Genauso in meinen anderen Apps …
Vergiss bitte nichts."*

### Der Befund, der die Aufgabe verändert hat

Ich hatte zuvor in `index.html` von Rezeptbuch, Mixarium und Muttis nach
`SpeechRecognition` gesucht, nichts gefunden und wollte melden: *„diese Apps
haben gar kein Mikrofon."* **Das war falsch.** Das Mikrofon liegt nicht in der
App-Datei, sondern im **Modul 23** — im 🎤 des „Mit dem Netz verbinden"-Felds.
Und dort stand:

```js
var lang = (langs[0] || ["de-DE"])[0];
```

Immer der **erste** Eintrag der Liste, also **immer Deutsch**, ohne jede
Möglichkeit, etwas daran zu ändern. Dieses 🎤 sitzt in **jeder** App mit
Modul 23 — Rezeptbuch, Mixarium, Muttis, Tomys Hub, BookLedgerPro,
family-project, Kimboard, Kimseek, Jasons-Tresor, Mein-Tresor. Für alle, die
kein Deutsch sprechen, war es unbrauchbar.

**Lehre:** eine Suche in der App-Datei sagt nichts darüber, was die App
**kann**. Die Fähigkeit steckte im Modul; wer nur `index.html` durchsieht,
übersieht die halbe App und meldet das Gegenteil der Wahrheit.

### Kanon (PR #836)

**Modul 21** — von drei auf **zwölf** Sprachen: Deutsch · English · Русский ·
العربية · Türkçe · Polski · Українська · Français · Español · Italiano · پښتو ·
دری/فارسی. Deutsch bleibt der erste Eintrag, damit Aufrufer ohne eigene Wahl
sich unverändert verhalten. Neu öffentlich: `languageLabel` ·
`preferredLanguage` · `isRtl` · `scriptMismatchHint`.

> **Mit gefunden, wäre sonst kaputtgegangen:** `alternativeCodes` reichte
> **alle** übrigen Sprachen an die EU-Engine weiter. Google Cloud
> Speech-to-Text nimmt in `alternativeLanguageCodes` höchstens **drei**.
> Solange die Liste drei Sprachen lang war, fiel das nicht auf — mit zwölf
> hätte **jede** EU-Anfrage abgelehnt werden können, und BookLedgerPro fährt
> die EU-Engine bindend. Jetzt gedeckelt, mit eigener Probe.

**Modul 23 UI** — Sprachwahl neben dem 🎤, vorbelegt aus der **Geräte-Sprache**
(wer erst eine Einstellung finden muss, um verstanden zu werden, benutzt das
Mikrofon nicht); pro App gemerkt (`sbkim_rdv_miclang_<dbSuffix>`, geteilter
Origin); **ohne Modul 21 keine Wahl** (ein Wähler ohne Spracheingabe wäre ein
toter Knopf); Erkennung des **stillen Fehlschlags** über die Schrift; `dir=auto`
am Frage-Feld.

### Rollout — 16 Repos, alle gemergt

Kanon Sage #836 · Rezeptbuch #371 · Mixarium #187 · Muttis #183 · Tomys #151 ·
BookLedgerPro #300 · Kimboard #93 · Privat-Brain #73 · Kimseek #59 ·
Kuechenzettel #5 · family-project #266+#268 · Jasons-Tresor #154 ·
Mein-Tresor #102 · SB-KIMTool-Point #148 · Kim-Bell #39 · Mein-WorkFloh #167 ·
PWA-Toolpoint #35 · Company-Brain #12 · Mein-Mixarium-Page #16.

**Die Drift-Guard-Prüfwerte sind diesmal mitgezogen** (Kimboard, Kimseek,
Kuechenzettel, Privat-Brain, Kim-Bell, Mein-WorkFloh) — genau die wurden beim
letzten Rollout vergessen und ließen drei Repos rot.

### Eine Probe, die nichts bewies

Zwei Haken der Pinnwand-Probe verlangten nur „enthält **nicht** 'lateinischer
Schrift'". Das ist auf fast jedem Text wahr — sie meldeten grün, während im
Hinweisfeld „kein Relay verbunden…" stand, also auf einem Lauf, in dem die
Erkennung das Frage-Feld nie erreicht hatte. Jetzt muss der gesprochene Text
**wirklich im Feld stehen**. Nachgezogen in Sage, Kimboard, Privat-Brain.

**Merksatz (zum zweiten Mal an einem Tag):** eine Prüfung, die nur eine
**Abwesenheit** verlangt, ist keine Prüfung.

### Gemessen

`smoke_bau21_spracheingabe` **65/65** (war 45) · neu `smoke_bau23_sprachwahl`
**22/22** · Suite regressfrei (nur `smoke_resign_spore_v02` rot, braucht
`SBKIM_NODE_KEY`, war vorher schon rot — mit `git stash` gegengeprüft).

**Fünf Sabotage-Proben** gemacht: Vorauswahl zurück auf Deutsch → 4 rot ·
EU-Deckel weg → 2 rot · Schriftkontrolle stumm → 2 rot · `langs[0]` zurück →
6 rot · Speichername ohne App-Namen → 3 rot.

### Was offen bleibt

1. **Vier Modul-23-Kopien sind kein byte-gleicher Abzug** — Kim-Bell,
   Mein-WorkFloh, SB-KIMTool-Point (alle `f117096e…`, rund **710 Zeilen**
   hinter dem Kanon) und BookLedgerPro (`c67b2942…`). Sie haben die Sprachwahl
   im Netz-Panel **nicht** bekommen. Ein blinder Überschreiber brächte
   ungeprüft eine ganze Reihe anderer Änderungen mit (u.a. die
   Identitäts-Anzeige aus Stufe 0a/0b) — das gehört in eine eigene, geprüfte
   Runde pro App.
2. **Klaus' Browser-Sichttest** der zwölf Sprachen im Netz-Panel — headless
   ersetzt ihn nicht.
3. **Dari-Test** (Klaus wollte morgen prüfen) und die **EU-Spracherkennung für
   Paschtu** (Plan liegt in `BRIEF_WAECHTER_TOOLPOINT_UND_SCHALTER.md`).
4. **PULS.md liegt bei ~9800 Zeilen** gegen die eigene 3000-Zeilen-Grenze. Die
   Schutz-Klausel sagt: auslagern, nicht kürzen. Steht weiter aus.

**Nächster sinnvoller Schritt:** Klaus' Sichttest, dann die vier abweichenden
Modul-23-Kopien einzeln nachziehen.

---

## Stand 2026-08-12 — 🎚 Schritt 4: der Schalter. Gerechnetes Gelb, öffentlich nur auf Ansage

**Rolle:** Hauptsitzung. **Schritt 4 der Rauswurf-Regel** (Auftrag:
`docs/sessions/BRIEF_SCHALTER_UND_WAS_OFFEN_LIEGT.md`). Zwei PRs, beide gemergt:
PWA-Toolpoint #34 · family-project #267. Damit ist die Bau-Reihenfolge der
Rauswurf-Regel **abgeschlossen** (Schritte 1–4).

**Was gebaut wurde.** Klaus kann jetzt entscheiden, ob der Wächter von allein
arbeitet oder ob er selbst drückt. Der Schalter heißt `_automatik` und steht in
`pwa-toolpoint/assets/config/wache-hand.json`:

| Stellung | Befund im Studio | Gelb öffentlich | Rot |
|---|---|---|---|
| **Von Hand** (Start) | steht da | nein | nur von Hand |
| **Automatik** | steht da | **ja, gerechnet** | nur von Hand |

Der Befund ist in beiden Stellungen derselbe. Es geht allein darum, wer ihn zu
sehen bekommt.

**Der Befund aus Schritt 3 ist eingehalten: gerechnet, nicht gespeichert.**
`assets/karte.js` rechnet das gelbe Band bei jedem Zeichnen aus
`messung.unterGrenze`. Stünde es in `wache-hand.json`, käme es nie wieder heraus
— der Riegel lässt aus dem Browser nur Verschärfen zu — und bliebe stehen,
während die Seite längst schnell ist. So verschwindet es von allein, sobald
wieder gut gemessen wird.

**Die offene Frage des Briefs, entschieden und begründet.** Der Schalter musste
committet sein, weil das gerechnete Band öffentlich steht: der Browser eines
fremden Besuchers muss wissen, ob die Automatik an ist, und der weiß nichts vom
`localStorage` des Studios. Gewählt wurde `_automatik` in derselben Datei wie die
Ampel — damit steht alles, was der Wächter tut, an einer Stelle, und es gibt
genau einen Commit-Weg dorthin, der schon gebaut und gegengeprüft ist.

Der Preis dafür steht offen im Papier: der Prüfer in `commit_wache`
(`family-project/server/marktplatz-api.php`) ließ neben `_hinweis` nur Schlüssel
zu, die wie eine `anchorId` aussehen. Er ist **erweitert** worden, um genau
diesen einen Namen. `wache_automatik_pruefen()` lässt vier Werte mit Typ und
Bereich durch und weist alles andere ab. **Eine Ampel kann darin nicht stehen** —
der Schalter ist damit kein zweiter Weg zur Sperre.

**Ein stiller Fehler, der dabei auffiel.** `tools/statische-listen.mjs` filterte
alles außer rot und gelb heraus, mit der Begründung „nur was etwas bewirkt". Das
stimmte, solange nichts gerechnet wurde. Seit es ein automatisches Gelb gibt,
**bewirkt grün etwas**: es ist die Hand-Freigabe, die genau dieses Gelb
überstimmt. Wäre grün weiter herausgefallen, käme das gerechnete Band trotz
Freigabe zurück — und zwar lautlos. Jetzt reicht das Werkzeug grün durch.

**Geprüft.** `npm test` **476/476** (30 neue Wächter, die die echte `karteHtml`
laufen lassen und den Schalter wirklich rechnen) · `bash tests/gegenprobe.sh`
**147 schlagen an, 0 blind** (9 neue Sabotagen) · `smoke_studio_markt` **102/102**
(12 neue Proben an der echten PHP) · `gegenprobe_wache_riegel` **11/11
anschlagend, 0 blind** (3 neue Sabotagen) · `php -l` grün · family `smoke_all`
110/110, `smoke_studio_vectors` 41/41. Cache-Version auf `v21`.

**Was offen bleibt.** Klaus' Browser-Sichttest steht aus. Und: der Schalter
braucht auf dem Hetzner-**Webhosting** die neuere `marktplatz-api.php`. Liegt
dort noch die alte, antwortet sie `bad_key` — das Studio nennt diesen Fall dann
beim Namen, statt still zu scheitern, und die Ampel selbst geht unverändert
weiter.

**Nächster sinnvoller Schritt:** die `marktplatz-api.php` hochladen (ein
WebFTP-Schritt), danach der Sichttest des Schalters. Parallel und unabhängig
davon: Modul 17 zu breit fürs Handy, `docs/PULS.md` über der Grenze, family ohne
Sperr-Knöpfe — alle drei in `docs/sessions/BRIEF_NACH_SCHALTER.md` mit dem am
2026-08-12 **neu nachgesehenen** Stand.
