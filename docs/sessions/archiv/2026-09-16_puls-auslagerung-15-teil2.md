# PULS-Auslagerung — drei Sitzungen vom 2026-09-15

**Ausgelagert am 2026-09-16**, weil `docs/PULS.md` an der 3000-Zeilen-Grenze
stand und ein neuer Eintrag anstand. **Nichts wurde gekürzt** — die drei
Einträge stehen unten wortgleich so, wie sie im PULS standen.

Die Grenze wird ausgelagert, nicht herabgesetzt (Schutz-Klausel 2026-05-17).

---

## Stand 2026-09-15 (Haupt-Sitzung, vierter Teil) · ⚠ DER SIEGEL-WEG ZERSTÖRTE DEN INHALTS-VEKTOR

**Der Befund.** Es gibt **zwei Wege zur Spore**, und sie betteten Verschiedenes
ein: die stille Erst-Anmeldung (`sbkim-connect.js:88-103`) rechnete den Vektor
aus `sampleContent()` — den **echten** Inhalten —, der Siegel-Weg
(`16b_andock_wizard.js:353`) ausschließlich aus der App-Beschreibung.

**Für einen fremden Nutzer, der Mein Rezeptbuch mit SEINEN Rezepten füllt, hieß
das:** die erste Anmeldung war richtig, und in dem Moment, in dem er im Siegel
neu signierte, **verlor er seinen Inhalts-Vektor** und bekam die Beschreibung
der fremden App. Sein Knoten kündigte danach ein Thema an, das ihm nicht gehört.

**Vier Änderungen am Kanon**, verteilt in 19 Kopien, 21 Depots gemergt:

| | |
|---|---|
| **1** | **Zwei echte Wizard-Fehler.** Schritt 1 rief `getOrCreateIdentity()` ohne Argument → hart `"main"`, Schritt 2 signiert mit dem **aktiven** Fach. Nach einem Wechsel bedienten zwei Knöpfe desselben Fensters **zwei Identitäten**. Dasselbe im Neu-Signier-Weg. Und der Semantik-Block zog nach einem Wechsel nicht nach |
| **2** | **Der Dateiname nennt die Kennung** (Klaus' eigener Vorschlag) und ein sortierbares Datum |
| **3** | **Der Siegel-Weg rechnet aus dem Inhalt**, wenn `cfg.sampleContent` welchen liefert, und setzt `embeddingSource: "content"` |
| **4** | **Wer zuletzt SELBST geschrieben hat, behält sein Wort** im Textfeld |

**Und die drei Inhalts-Apps sind verdrahtet.** `sampleContent()` steht in
Mein-Rezeptbuch, Muttis-Rezeptbuch und Mein-Mixarium jetzt auf **Datei-Ebene**
statt in `__sbkimErzeugeSpore`; `siegel-inhalt.js` verweist **spät aufgelöst**
darauf (`sbkim-init.js` wird **vor** ihr geladen). **Eine** Fassung der
Stichprobe — zwei ergäben zwei Vektoren für denselben Knoten.

**Klaus' Geltungsbereich, wörtlich:** Rezeptbuch · Muttis · Mixarium.
Ausgeschlossen BookLedgerPro (Buchhaltung) und vorerst Mein-WorkFloh.
⚠ **Der Bestand passte schon dazu:** BLPs `sampleContent()` liefert die **festen**
`STANDARD_KONTO_LABELS` (bei jedem Nutzer gleich), WorkFloh hat **gar keine**.
**Es brauchte also keine Sperre** — eine Sperre, die nichts sperrt, sieht aus
wie Schutz.

**Tafel.** `docs/INTERFACES.md` §2 trägt jetzt `embeddingSource` und
`embeddingVersion`. Beide standen **nicht** dort, obwohl Modul 02 sie seit v0.2
in die **signierte** Spore schreibt. Dazu die Lesart: **zwei Sporen desselben
Knotens sind nur vergleichbar, wenn ihr `embeddingSource` derselbe ist** —
belegt an Mixarium, dieselbe Kennung `6U3aniLM…`, 0.826040 aus dem Inhalt gegen
0.883142 aus der Beschreibung.

⚠ **EIN BLINDER WÄCHTER VON MIR, von der Gegenprobe entlarvt.** „Wirft
`sampleContent`, bleibt es still (fail-soft)" fragte nur, ob die Vektor-Zeile
fehlt. Nimmt man das `try/catch` heraus, entsteht der **ganze Semantik-Block**
nicht mehr — und **genau das hätte der Wächter „fail-soft" genannt.** Er misst
jetzt auch, dass der Block dasteht. Gefunden beim **Nachstellen von Hand**,
nicht beim Schreiben.

⚠ **EINE ZUSICHERUNG GESCHÄRFT, NICHT GELOCKERT — an drei Stellen.**
`smoke_sage_beschreibung.mjs`, PWA-Toolpoints `smoke.mjs` (zweimal, je Knoten)
und kim-hub-companys `smoke_knoten.mjs` verlangten „genau **eine** Zuweisung an
`ta.value` im Lade-Pfad". Seit Punkt 4 ist das **Zählen das falsche Maß**;
gemessen wird die **Bedingung** und die **Gegenrichtung** (dass der Vermerk beim
Signieren wirklich gesetzt wird). Tafel-Evolutions-Klausel, ausdrücklich benannt.

⚠ **ZWEI PROBEN WAREN NICHT ROT, SONDERN NICHT LAUFFÄHIG.** Kimboard meldete
„21 von 31 ROT", Privat-Brain brach ab — beide Male fehlte `playwright-core`.
Wer die erste Zahl genommen hätte, hätte eine fehlende Abhängigkeit als Schaden
am Code gemeldet. Nachinstalliert: Kimboard **31/31 grün**.

⚠ **UND PRIVAT-BRAIN IST VORBESTEHEND ROT.** `npm test` meldet dort
**12 bestanden, 4 fehlgeschlagen** (das Siegel injiziert nichts). Gemessen, nicht
vermutet: derselbe Lauf gegen `origin/main` in einem eigenen Arbeitsbaum ergibt
**dieselben vier Zeilen, Wort für Wort**. Eigener Vorgang.

**Gemessen.** `node tests/run_alle.mjs` → **107 grün · 0 rot · 0 nicht
lauffähig**, Rückgabewert **0** (ohne Pipe gelesen) · `wizard-laedt-pruefen.mjs`
→ alle **21** Seiten liefern Konfiguration **und** Kanon aus ·
`smoke_service_worker_parst.mjs` → 3 grün · **sieben Gegenproben von Hand
nachgestellt**, alle gefangen, jede mit dem Namen ihrer eigenen Zusicherung in
der roten Zeile · die Kette in den **echten App-Dateien** im Browser gemessen.
Fremde Läufe: PWA-Toolpoint **871/871**, kim-hub-company **69 grün**,
family-project **110/110**, BookLedgerPro **2182 bestanden** (Generationen-Sprung
von 1.179 Zeilen), Alis-Moderaum 55/55, Perfect-Skin-Beauty 25, Kim-Bell,
Kimseek, Jasons-Tresor, Mein-Tresor, Mein-Workfloh-Page, Perfect-Skin-Fashion
grün.

**NICHT GEBAUT, und der Grund ist gemessen:** der Drift-Hinweis („dein Inhalt
hat sich von deiner Spore entfernt"). Seine Schwelle wäre zu **raten** gewesen —
das Einbettungs-Modell ist in dieser Umgebung ein **16K-Platzhalter**, und
huggingface antwortet mit **HTTP 000**. Eine geratene Schwelle erzeugt entweder
eine Warnung, die man nicht mehr los wird, oder eine, die nie kommt.

**Offen.** Der Drift-Hinweis (braucht Klaus' Browser für die Schwelle) ·
`sbkim/15_membran.js` in family-project hängt eine Generation zurück ·
Privat-Brains vier vorbestehende rote Zeilen · der Rezept-Export trägt die Spore
**nicht** mit (benannter Befund, eigener Vorgang).

---

## Stand 2026-09-15 (Haupt-Sitzung, dritter Teil) · ⚠ DER VIERTE IDENTITÄTS-WECHSEL EINES KNOTENS

**Getan.** Klaus hat für **Mein-Rezeptbuch** über das Siegel neu signiert und die
Spore geschickt. Geltend ist `r-k1NyHeLWpLphP5O2uJKtiIyYNXABm8YOAlqQR3PcI`; die
Fassung vom 2026-07-19 liegt als `spore-vorgaenger-2026-07-19.json` daneben.
Geprüft vor dem Ablegen: **9 Prüfungen, 0 rot** (Signatur VALID reziprok,
`id == base64url(SHA256(rawPub))`, kein `d`, `key_ops` nur `["verify"]`,
OKP/Ed25519, 384 Stellen, **L2 = 0.999999811**, kein `_demo`, `endpoint` gehört
zu Mein-Rezeptbuch). Register nachgezogen: `nodeId`, `previousNodeIds` (jetzt
**vier**), `matchScore` 0.835683 → **0.874048**, Quelle `depot-2026-09-15`.

**Gemessen.** Der Text ist **byte-gleich** mit der alten Spore (851 Zeichen,
7 Stichworte), und gegen Sage steht **exakt derselbe Wert** wie zuvor. Zweites
Mal an einem Tag dasselbe Bild — bei Mein-WorkFloh war es 0.902126 vor und nach
dem Wechsel. **Der Wechsel kostet die Zahl nichts, er kostet die Identität.**

⚠ **Die Vorwerte sind NICHT unmittelbar vergleichbar:** 0.835683 stand gegen die
Raum-Spore vom 2026-09-10, 0.874048 steht gegen die abgelegte. Zwei Maßstäbe,
und deshalb trägt der Eintrag seine Quelle.

⚠ **BENANNTE LÜCKE.** Für Mein-WorkFloh lag der Beleg vor, dass die alte Kennung
verloren ist — der Identitäts-Wechsler meldete *„Genau eine Identität — sauber"*.
**Für diesen Knoten liegt er nicht vor.** Abgelegt auf Klaus\' ausdrückliche
Anweisung (*„damit übertragen wir das gleich auf die anderen"*); die alte Spore
bleibt als Vorgänger liegen, falls sich das Gegenteil herausstellt.

**Und daraus ist der eigentliche Befund gefallen:** `previousNodeIds` trägt für
diesen Knoten jetzt **vier** Einträge, mehr als für jeden anderen im Netz. Die
Ursache liegt nicht im Knoten, sondern in der **Bedienung** — Klaus hat sie
selbst benannt: *„Dann wird im Mycel eine Sicherung angelegt, die aber auch schon
im Siegel angelegt werden kann. Also auch wieder doppelt."* Nachgemessen: Sichern,
Einspielen und Wechseln stehen in **Modul 23 und Modul 16b**, mit verschiedenen
Dateinamen und verschiedenen Texten.

**Vorschlag geschrieben, nicht gebaut:** `docs/VORSCHLAG_IDENTITAETS-KETTE.md`.
Er trennt, was heute vermischt wird — `previousNodeIds` in der Spore wäre eine
**Behauptung**, eine vom alten Schlüssel unterschriebene Nachfolge (`successorOf`)
ein **Beweis**, und der zweite Weg geht nur dort, wo der alte Schlüssel noch lebt.
Das ist genau **nicht** Klaus\' häufiger Fall. Sechs Punkte, nach Kosten geordnet;
ab Punkt 3 wird `docs/INTERFACES.md` angefasst — **das entscheidet Klaus**.

**⚠ DER DATEINAME TRÄGT DIE KENNUNG NICHT, und das hat heute Verwirrung
gekostet** (Klaus: *„vielleicht über die Dateibezeichnung schon erkennt, welche
Spore oder ID oder beides"*). Nachgemessen an den drei Stellen, die einen Namen
bauen — `16b_andock_wizard.js:192` (`<Knotenname>_spore_<TT_MM_JJ>.json`),
`23_rendezvous_ui.js:1176`, `16b_andock_wizard.js:573`: **keine davon nennt die
Kennung.** Zwei Sporen derselben App am selben Tag sind damit ununterscheidbar,
und genau das ist passiert: die zweite WorkFloh-Datei hieß `…_1.json`, die `_1`
kam vom Browser. Welche die neuere war, stand **nur im Inhalt** (13:03 gegen
14:04) — und an derselben Stelle schrieb Klaus *„ich glaube, ich habe es gerade
verwechselt"*. **Der Name trug den Unterschied nicht, also musste der Mensch ihn
tragen.**

**Gemessen am Ende:** `node tests/run_alle.mjs` → **107 grün · 0 rot · 0 nicht
lauffähig**, Rückgabewert **0** (ohne Pipe gemessen).

**Offen.** Die Übersetzung (`TEXTE.en`, 76 Einträge) · 44 nachhängende
Kanon-Dateien · Klaus\' Entscheidung zu den sechs Punkten des Vorschlags · und
die Frage aus § 10: soll der Identitäts-Wechsler nach **Zeitstempel** vorwählen
statt alphabetisch? Beide Regeln haben ihren Schaden, die alphabetische ist nur
der stillere.

**Nächster Schritt.** Klaus\' Entscheid zu Punkt 1 (Dateiname) — er kostet drei
Zeilen in zwei Kanon-Dateien, ändert kein Protokoll und wirkt sofort.

---

## Stand 2026-09-15 (Haupt-Sitzung) · ⚠ EIN FEHLENDES KOMMA HAT VIER APPS ABGESCHALTET

**Rolle:** Haupt-Sitzung. **Anlass:** Klaus meldete, im Mixarium-Siegel fehle die
Beschreibung — *„die beschreibung ist in den anderen siegel auch zu sehen wenn
sie bereits eine id und spore haben, im mixarium ist es anders."*

**Ursache.** Der A18-Rollout hat die Wizard-Zeile an die Nachlade-Ketten
**angehängt**. `siegel-inhalt.js` stand dort als **letztes** Feld-Element ohne
Komma — danach fehlte es. Derselbe Fehler, zwei Sprengweiten: bei einem Feld aus
**Paaren** ist `[…]` unter `[…]` kein Syntaxfehler, sondern ein **Zugriff** (zwei
Einträge werden still zu einem `undefined`); bei einem Feld aus **Zeichenketten**
ist es ein **echter Syntaxfehler** und tötet den ganzen Skript-Block.

**Gemessen** (Chromium 390×844, jede Seite vorher gegen den Eltern-Stand des
A18-Commits, nachher gegen `main`):

| | vorher | nachher |
|---|---|---|
| Alis-Moderaum · Perfect-Skin-Beauty · Perfect-Skin-Fashion · Mein-Workfloh-Page | 01✓ 16✓ 17✓ | **01✗ 16✗ 17✗** — kein SBKIM |
| Mein-Mixarium · Mein-Rezeptbuch · Mein-WorkFloh | 01✓ 16✓ 17✓ | Module ✓, **Konfig + Wizard ✗** |
| Kimhub/start · zwei `jasons-bibliothek/`-Spiegel | ✗ | ✗ — **unverändert, nicht von A18** |

**24 Seiten geprüft · 7 Apps betroffen · 4 davon ohne jedes SBKIM.**

**Getan.** Komma in 9 Dateien (7 Repos; Mixariums Spiegel und Rezeptbuchs
`build.py` nachgezogen und verifiziert) · `tools/wizard-trennen.mjs` setzt das
Komma jetzt selbst · **`tools/wizard-laedt-pruefen.mjs`** neu: lädt jede Seite
im echten Browser und fragt, ob `SBKIM_SIEGEL_WIZ` und `SbkimSiegelTexte`
ankommen, mit benannten Ausnahmen, die in **beide** Richtungen geprüft werden ·
**`tests/smoke_werkzeuge_parsen.mjs`** neu.

**⚠ Und das Werkzeug selbst hat NIE geparst** — `tools/wizard-trennen.mjs` war
schon in dem Commit kaputt, der es anlegte (Kommentarblock mitten im Satz
geschlossen). Es lief aus einer Arbeitskopie; der Kommentar kam danach dazu.
Lehre: `docs/LEHREN.md` § 12.

**Nachher gemessen.** `tools/wizard-laedt-pruefen.mjs` → **alle 21 nicht
ausgenommenen Seiten liefern Konfiguration UND Kanon aus**, echter exit 0 ·
`node tests/run_alle.mjs` → **106 grün · 0 rot · 0 nicht lauffähig**, echter
exit 0 · die Proben der vier betroffenen Apps mit eigener Suite: 55, 25, 66, 84
grün.

**⚠ UND DIE ERSTEN SIEBEN PULL REQUESTS WAREN LEER.** Der Push auf die
App-Zweige wurde abgelehnt (kein Fast-Forward — der Server trug noch den
A18-Stand), und die Fehlerausgabe war mit `-q` und `2>/dev/null` unterdrückt.
Die PRs entstanden damit aus dem **alten** Zweig, enthielten nichts und mergten
erfolgreich. Gemeldet hat es nicht der Merge, sondern der neue Wächter: er lief
gegen `origin/main` und war weiter rot. Berichtigt mit `--force-with-lease` und
**vor** jedem neuen PR mit `git diff --stat origin/main origin/<zweig>` geprüft.
Das ist `docs/LEHREN.md` § 1 („ein PR kann erfolgreich mergen und nichts
enthalten"), diesmal durch **unterdrückte Fehlerausgabe** ausgelöst.

**Klaus' Anzeige-Frage ist damit beantwortet — es war derselbe Fehler.** Gemessen
nach der Reparatur bei 360×740: der Wizard-Knopf steht da, das Beschreibungsfeld
ist sichtbar und trägt **2.141 Zeichen**, die Herkunfts-Zeile nennt den Text.
Kim-Bell und Kimboard verhalten sich gleich (221 bzw. 238 Zeichen).

⚠ **Eine Zwischenmessung war falsch und steht hier, weil sie falsch war.** Ein
Wegwerf-Skript meldete, das Siegel-Fenster stehe bei y=1963 „außerhalb des
Sichtfelds". Das Fenster steht richtig (`fixed`, `inset 0`, 360×740); bei y=1963
lag **scrollbarer Inhalt innerhalb** eines Scroll-Kastens (`top=74 h=592`,
Inhalt 1970), und `getBoundingClientRect` meldet dort auch, was weggescrollt ist.
Das Skript prüfte zudem nur `oben < 0`, nicht `oben > Schirmhöhe` — **ein
Wächter, der nur eine Richtung misst.**

**Offen.** Die zwei `jasons-bibliothek/`-Spiegel laden SBKIM nicht, weil der
Unterordner kein eigenes `assets/` hat — **vorbestehend**, eigene Aufgabe.

---
