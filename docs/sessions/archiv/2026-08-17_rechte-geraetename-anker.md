# Übergabeprotokoll — 2026-08-17 · Urheberrecht · Gerätename · zehn Sitzungs-Anker

**Drei Aufträge, alle von Klaus, alle erledigt und gemergt.** Dazu am Ende ein
neuer Auftrag für die nächste Sitzung.

---

## Auftrag 1 — Urheberrecht und Rechte an den eigenen Apps

**Klaus, sinngemäß:** er hatte von einem US-Verfahren gehört, in dem ein
„Vibecoder" alle Rechte an seinen Apps verloren haben soll, weil Anthropic per
Wasserzeichen die Urheberschaft nachwies. Was ist dran, wie schützt er seine Apps,
und muss er fürchten, dass irgendwann jemand Geld für erzielte Umsätze oder
gesparte Kosten verlangt?

Ausdrücklich dazu: *„Ich weiß, dass Du keine Rechtsberatung machst, das musst Du
nicht noch mal sagen, es geht nur um das Prinzip."*

### Was dabei herauskam

Das Verfahren ließ sich nicht belegen. Was sich belegen ließ, war eine andere
Lücke: **von 33 Repos trug genau eines eine Lizenzdatei.** Öffentlich einsehbarer
Code ohne Lizenz ist nicht gemeinfrei, aber er ist auch für niemanden benutzbar —
und für Klaus war unklar, was er eigentlich hergeben will.

| | |
|---|---|
| Kanon | `docs/URHEBERSCHAFT_UND_RECHTE.md` — Faktencheck, Wasserzeichen, Anbieter-Bedingungen, deutsches Recht, was hier Schutz trägt und was ehrlicherweise nicht |
| Rollout | **32 Repos** mit `LICENSE` + `RECHTE.md`, PR #868/#869 |
| Zwei Stufen | die **Module** sollen kopierbar sein (MIT bzw. CC BY), die **Apps** nicht (eigene Fassung). Beides stand vorher als Widerspruch in den Tafeln |
| Mit-Bauer | in `CLAUDE.md`, Einladung und Vision-Karte klargestellt: eine **Würdigung der Bau-Tat**, keine Aussage über Urheberschaft |
| Belege | `docs/rechte-belege/README.md` — Anleitung, wie Klaus die Anbieter-Bedingungen datiert sichert |

**Die PDFs gehören ausdrücklich NICHT ins Repo.** Es ist fremder Text; er gehört
in Klaus' Tresor. Das steht so in der Anleitung.

### Was hier ehrlich nicht ging

`anthropic.com`, `support.claude.com` und `terms.law` waren aus der Umgebung nicht
erreichbar (403 vom Egress-Proxy, mit `curl "$HTTPS_PROXY/__agentproxy/status"`
belegt). Das Dokument stützt sich an diesen Stellen auf Suchergebnis-Zusammen-
fassungen **und sagt das dort auch.** Ein PDF zu bauen, das wie ein archiviertes
Original aussieht, wäre die bequeme Lösung gewesen und wurde abgelehnt.

---

## Auftrag 2 — Gerätename netzweit ins Verbinden-Panel

**Klaus:** *„Im Sage-Protokoll kann oben noch ein Name eingetragen werden … bei
den anderen Mycel-Knoten ist das nicht der Fall. Das ziehe wieder als
festgeschriebene Bauregel für Mycel überall nach."*

### Was der Auslöser wirklich war

Ein Feature, das **halb** dastand. Elf Apps **lasen** `sbkim_geraetename` und
hängten ihn an die Anmeldung — aber niemand hatte das Feld gebaut, in das man ihn
einträgt. Wer nach dem Schlüsselwort greppt, findet Treffer und hält es für
erledigt.

| | |
|---|---|
| Tafel | `docs/INTERFACES.md` **§11.7** — fünf Pflichten, drei Sicherheitsregeln, eine benannte Ausnahme (Company-Brain hat keine geteilte Panel-Datei) |
| Rezept | Skill `geraetename` von Grund auf neu geschrieben |
| Rollout | **21 Repos**, PR #877 |
| Referenz | `Sage-Protokol/sbkim-init.js` — `injectGeraetenameField()` + `syncGeraetenameFields()` |

**Drei Regeln, jede aus einem Fehler:** das Feld hängt der **app-eigene Glue** ins
Panel, nie die byte-kopierte Panel-Datei (Drift-Guard) · jedes Feld trägt
`data-sbkim-geraetename`, und beim Namenswechsel gleichen sich **alle** markierten
Felder ab · der Name geht **nur** an Anzeige und Anmeldung, **nie** an
`generateOwnSpore` — sonst würde die Spore neu signiert und zwei Instanzen
derselben App fielen unter der 0,80-Schwelle auseinander.

### Der Sonderfall, der beinahe Schaden angerichtet hätte

Mein-Rezeptbuch hat **zwei** Namensfelder: den Buchnamen und den Gerätenamen. Ohne
die Bedingung `if (speichern === "sbkim_geraetename")` hätte der Abgleich den
Buchnamen überschrieben. Von Hand nachgezogen, nicht vom Skript.

### Klaus' Sichttest — und das Zwischenspiel

Panel aufgeklappt, Feld sitzt als erste Zeile, beide Felder trugen denselben
frisch geänderten Wert. **Ehrlich abgegrenzt:** ein Standbild unterscheidet nicht
zwischen *live gleichgezogen* und *nach einem Neuladen beide aus demselben
Speicher gefüllt*. Belegt ist, dass die Felder nicht auseinanderlaufen — mehr wird
nicht behauptet.

Klaus' erster Reflex auf die zwei Felder war **„keine 2 Etiketten / Gerätenamen"**.
Auf die Rückfrage, *welches* verschwinden soll, entschied er **„so lassen"**. Kein
Umbau. Die Rückfrage war trotzdem richtig: die andere Antwort hätte einen Eingriff
in zwei Seiten bedeutet.

---

## Auftrag 3 — zehn Repos ohne `CLAUDE.md`

**Klaus:** *„Gibt es einen Grund, warum da keine CLAUDE.md drin ist? Weil die
vielleicht auf Sage immer gezogen wurde?"* — Nein. Belegt aus dem Anweisungs-Satz
dieser Sitzung selbst: er enthält **genau die elf** Repos, die eine haben. Sages
`CLAUDE.md` reist nicht mit.

Danach: *„Okay, leg los."*

| Repo | PR | Repo | PR |
|---|---|---|---|
| Alis-Moderaum | #48 | Mein-Workfloh-Page | #15 |
| Company-Brain | #16 | Perfect-Skin-Beauty | #52 |
| Kim-Bell | #48 | Perfect-Skin-Fashion | #24 |
| Kimboard | #101 | Tomys-Hub | #159 |
| Kimseek | #66 | family-project | #282 |

Gemeinsame Abschnitte: was das Repo ist · Branch frisch von `origin/main` · Push
mit Refspec samt Leer-PR-Prüfung · Selbst-Merge-Freibrief · **repo-eigene Fallen** ·
Verweis auf INTERFACES · Gerätename §11.7 in drei Sätzen · Ton · kein PII.

Die repo-eigenen Fallen sind der eigentliche Wert: Kimboard *„zwei Gerätenamen-
Felder sind hier gewollt — nicht eines davon aufräumen"* · Kim-Bell *„das hier ist
die Vorlage, Fehler werden weiterkopiert"* · Company-Brain die benannte §11.7-
Ausnahme · Alis-Moderaum *„der Markenname ist vorläufig, über ✎ Texte änderbar"* ·
Perfect-Skin-Beauty *„echte Studio-Daten, keine Platzhalter"* · family-project
Hetzner/Caddy statt Pages und die drei Maschinen.

**Ehrlich zur Länge:** angekündigt waren ~25 Zeilen, geworden sind 78–97. Freibrief,
Gerätenamen-Regel und Ton stehen **wörtlich** drin statt als Verweis — sonst sieht
sie genau die Sitzung nicht, für die der Anker gedacht ist.

---

## Was nachweislich NICHT angefasst wurde

- Keine byte-kopierte Modul-Datei (`23_rendezvous_ui.js`, `sbkim-rendezvous-ui.js`,
  `modules/01…05`). Drift-Guards in allen betroffenen Repos grün.
- Kein `PROTOCOL_VERSION`, kein `DB_VERSION`, kein `PROVIDER_MIN_MATCH`.
  Der 0,80-Andock-Riegel ist unberührt.
- Kein DB-Suffix geändert.
- `impressum.html` / `datenschutz.html` nirgends durch Platzhalter ersetzt — dort
  stehen die echten Angaben, und das ist Pflicht (§ 5 DDG).
- Keine echten Fremd-PII, kein Schlüssel, kein Token in einem Commit.

---

## Proben — ehrlich, auch die roten

| Repo | Ergebnis |
|---|---|
| Alis-Moderaum | 54/54 |
| Company-Brain | 9 grün, 0 rot |
| Kim-Bell | 4 bestanden |
| Kimboard | 6 bestanden *(siehe die Berichtigung unten)* |
| Kimseek | 11 bestanden |
| Mein-Workfloh-Page | 82 grün |
| Perfect-Skin-Beauty | 18 + 25 bestanden |
| Perfect-Skin-Fashion | 64 grün |
| Tomys-Hub | alle 9 Proben `exit=0` |
| family-project | 110/110 |
| **SB-KIMTool-Point** | **2 rot (Probe 27)** — per `git stash` als **vorbestehend** belegt, im PR vermerkt, nicht repariert |

### Die vier Fehler dieser Sitzung

1. **Ein blinder `grep -c`.** Die geprüfte Wendung war umbrochen, gemeldet wurden
   3 von 4 Sprachen. Behoben, indem der Text mit geglätteten Zwischenräumen
   gelesen wurde.
2. **Drei falsche Repo-Umfragen.** Sie liefen auf ungefetchten Klonen, während
   eine Parallel-Sitzung am selben Tag pushte. Seitdem grundsätzlich
   `git grep … origin/main`. Als Lehre im Skill festgehalten.
3. **Eine blinde Vollständigkeits-Prüfung.** Das gesuchte Wort stand auch in den
   `querySelector`-Zeichenketten — die Marke ließ sich entfernen, und die Prüfung
   meldete weiter „in Ordnung". **Gefunden hat das die Gegenprobe, nicht die
   Prüfung.** Verschärft auf `setAttribute\("data-sbkim-geraetename"`, danach
   nachgesehen, dass sie wirklich umfällt und wieder grün wird.
4. **Ein PDF-Leser, der nichts fand — aus dem falschen Grund.** Chromium legt Text
   als Glyph-Nummern eines eingebetteten Schrift-Ausschnitts ab. „Nichts gefunden"
   war deshalb keine Aussage. So berichtet, statt es als Beleg auszugeben.

**Und der fünfte, im eigenen Werk:** der frisch angelegte Kimboard-Anker nannte
als Prüfung nur `npm test` samt „6 bestanden". Kimboards `README.md` sagt
ausdrücklich *„Alles prüfen mit `node tests/alle.mjs` (nicht nur `npm test`)"* —
`npm test` fasst die **26 Proben unter `tests/`** nicht an, darunter
`smoke_loeschen.mjs`. Genau die Falle aus der eigenen Tafel. Berichtigt, samt
Begründung im Anker selbst.

### Was der richtige Läufer sofort zutage förderte: ein toter Wächter

Der erste volle Lauf meldete **`hilfe … ROT (0 Proben)`**. Per `git stash` als
**vorbestehend** belegt — seit wann, weiß niemand.

Nicht die App war kaputt, die **Probe** war es. `assets/hilfe.js` ist der
**letzte** von 14 Einträgen der Nachlade-Kette in `index.html`, jedes Glied an
`requestIdleCallback` mit bis zu 500 ms Frist. `smoke_hilfe.mjs` wartete stur
1800 ms und griff dann auf `window.__hilfe.texte` zu. Sie verlor das Rennen und
starb beim Start — **rot, aber aus dem falschen Grund, und dabei stumm.**

An zwei Stellen behoben (die zweite direkt nach `p.reload()`), beide Male durch
`p.waitForFunction(() => window.__hilfe && window.__hilfe.texte)`. Ergebnis:
**22 Prüfungen grün statt keiner.** Gegenprobe gefahren — Erklärtext `tb-zoom`
entfernt ⇒ ROT (exit 1), zurückgesetzt ⇒ grün (exit 0).

**Das wiegt schwer, weil dieser Wächter erzwingt, dass jeder sichtbare Knopf eine
Erklär-Blase hat** — und der neue Kimboard-Brief verlässt sich für den Melde-Knopf
genau darauf.

Zwei Lehren, beide in Kimboards Anker und Brief festgehalten:

- **Eine Uhr misst nicht, ob etwas fertig ist.** Auf die Bedingung warten, nie auf
  eine geschätzte Dauer. Ein verlorenes Rennen macht die Probe nicht falsch,
  sondern **stumm**.
- **`| tail` ist zum Lesen da, nicht zum Urteilen.** Mein erster Aufruf hängte
  `| tail -40` an und meldete „exit 0" — das war der Rückgabewert von `tail`. Der
  Läufer selbst gibt bei Rot korrekt `exit=1`.

---

## Der neue Auftrag: Hassrede vom Brett nehmen

**Klaus:** *„Einhaltung von Gesetzen in Kimboard bezüglich Hassrede … sie müssen
endgültig vom Board genommen werden können, nicht vom Rechner, das geht glaube ich
nicht. oder?"*

Seine Vermutung stimmt zur Hälfte. Fremde Relais kann man nur **bitten**
(NIP-09 verpflichtet niemanden), und eine Lösch-Bitte darf ohnehin nur der
Absender stellen. Aber Klaus **betreibt selbst ein Relais** — auf seinem eigenen
Brett ist echtes Entfernen möglich, und dort trifft ihn auch die Melde- und
Abhilfepflicht nach Art. 16 DSA. Kimboard hat heute keinen Melde-Weg.

Klaus entschied: **alle drei Stränge** (eigenes Relais · signierte Sperr-Liste ·
Melde-Weg). Voller Auftrag mit Grenzen, Reihenfolge und Wächtern in
`Kimboard/docs/BRIEF_MODERATION_UND_RECHT.md`.

---

## Nächster sinnvoller Schritt

1. **Die vier Anbieter-Bedingungen als PDF sichern** — der einzige offene Punkt
   aus Auftrag 1, den nur Klaus machen kann. Anleitung liegt in
   `docs/rechte-belege/README.md`, Ablage in seinem Tresor.
2. **Kimboard-Sitzung nach dem neuen Brief** — beginnt mit Schritt 0: was läuft
   wirklich auf dem Server. Aus der Sitzungs-Umgebung nicht prüfbar.
3. **Gerätename in einer zweiten App am Tablet ansehen** — für Kimboard liegt der
   Beleg vor, für die übrigen zwanzig ist es bisher nur Code.
4. **Die zwei roten Proben in SB-KIMTool-Point** (Probe 27) — eigene kleine
   Sitzung wert, sie waren schon vorher rot.
