# Übergabeprotokoll 2026-09-11 — die Frist, der Sprung und die fünf unter 0,80

**Rolle:** Haupt-Sitzung in Sage-Protokol · **Zweig:**
`claude/sage-protokol-main-session-udiuke` in acht Depots.

**Stundennachweis (gemessen, erster → letzter Commit):** siehe § Stundennachweis
am Ende. Was er NICHT enthält, steht dort ausdrücklich dabei.

---

## Was getan

### 1 · PULS ausgelagert — zweimal, nicht gekürzt

`docs/PULS.md` stand bei **exakt 3.000 von 3.000 Zeilen**. Die Schutz-Klausel im
Kopf verlangt auslagern statt kürzen und verbietet, die Grenze herabzusetzen.

| Griff | was | Zeilen |
|---|---|---|
| 1 | 2026-09-07 + 2026-09-04 (178 Zeilen) → `2026-09-11_puls-auslagerung.md` | 3.000 → **2.839** |
| — | Eintrag dieser Sitzung | 2.839 → **2.991** |
| 2 | 2026-09-09 (57 Zeilen) → `2026-09-11_puls-auslagerung-2.md` | 2.991 → **2.944** |

⚠ **Neun Zeilen Luft sind keine Luft.** Nach dem ersten Griff und dem eigenen
Eintrag stand die Datei bei 2.991 — die nächste Sitzung hätte sofort wieder an
der Grenze gestanden, ohne dass ihr das jemand gesagt hätte. Deshalb der zweite
Griff.

⚠ **Beide Archiv-Dateien sind NEU, keine überschrieben.** Vor dem Schreiben mit
`ls` nachgesehen, danach mit `diff` belegt, dass der ausgelagerte Text
byte-gleich ist. Der Name trägt das Datum der **Auslagerung**, nicht das der
Einträge — genau der Fehler vom 2026-09-10, bei dem eine gleichnamige Neuschrift
228 Zeilen ersetzt hat.

### 2 · `smoke_pruefer.mjs` bekommt eine eigene Frist (PWA-Toolpoint)

**Der Befund, wörtlich aus dem Brief:** `tests/smoke.mjs` startete den Prüfer als
Kindprozess **ohne eigene Frist** und meldete rot, sobald er mit einem Fehler
endete. Im Prüfer stehen Browser-Wartepunkte auf 30 s; reicht die unter Last
nicht, stirbt das Kind an seiner eigenen Uhr, und im Eltern-Lauf stand
„eigene Probe grün: nein". Gemessen am 2026-09-10: derselbe Baum, dreimal
`node tests/smoke.mjs` → **737 · 737 · 738**, einzeln jedes Mal grün.

**Gebaut:** `tests/kindprozess.mjs` mit drei Ausgängen statt zwei.

| | |
|---|---|
| ✓ grün | das Kind lief durch und war zufrieden |
| ✗ **ROT** | es hat etwas gefunden — **oder** ist aus anderem Grund gestorben. Ein Wurf ist ein Befund |
| ⊘ **nicht abgeschlossen** | es wurde nicht fertig. **Ungeprüft, nicht grün** |

**Gemessen, nicht geraten:** zwei volle Läufe des Prüfers **10 969 ms** und
**8 016 ms** → Frist **180 s**, rund das Sechzehnfache. Die gemessene Dauer steht
bei jedem Lauf daneben (`8.1 s von 180 s`).

**Die Reparatur hat ihre eigene Messung** — am echten Prüfer mit auf 1 ms
gekürzter innerer Uhr, in einer Wegwerf-Kopie, derselbe Baum:

| | alt (`origin/main`) | neu |
|---|---|---|
| Zeile | `✗ eigene Probe grün` — **ohne jeden Hinweis** | `⊘ … NICHT ABGESCHLOSSEN → das Kind ist an seiner eigenen Uhr gestorben` |
| Schlusszeile | `769/770 bestanden` | `775/775 bestanden · 1 nicht abgeschlossen` |
| Rückgabewert | **1** | **0** |

⚠ **DER RÜCKGABEWERT IST EINE ABWÄGUNG, KEINE TATSACHE — und Klaus kann sie
überstimmen.** Für ⊘ spricht: der Prüfer war einzeln jedes Mal grün, das Rot kam
von der Maschine; und ein falsches Rot ist hier teuer, weil die Gegenprobe bei
roter Ausgangslage **abbricht**. Dagegen spricht: ein wirklich hängender Prüfer
bliebe unbemerkt. Deshalb steht die dritte Spalte **immer** in der Schlusszeile,
auch als Null, mit dem Weg, ihn einzeln nachzufahren.

**Sieben Wächter fahren den Mechanismus wirklich** (Hänger · echter Befund ·
Befund-dann-Hänger · sauberer Lauf · fehlendes Kind · echte Dauer ·
Schlusszeile), **sechs Gegenprobe-Fälle**, jeder von Hand nachgestellt.

⚠ **Einer davon hat einen blinden eigenen Wächter entlarvt.** „Der echte Befund
wird nicht mehr ZUERST gelesen" rutschte durch, obwohl der Anker saß: das Kind,
an dem gemessen wurde, war von selbst gestorben, und dann landet es auch **ohne**
die Reihenfolge-Regel bei rot, nur über einen anderen Zweig. Die Regel wirkt erst
bei einem Kind, das **findet und danach hängt** — diesen Wächter gab es nicht.

⚠ **Die Gegenprobe hat seitdem selbst eine Frist** (`FRIST=300`, gemessen: ein
voller Smoke braucht 10 s). Ohne sie brächte ausgerechnet der Fall, der die
Kind-Frist ausbaut, den ganzen Lauf zum Stehen — **Kimhubs sechste Art**, und sie
wäre beim ersten Lauf zugeschnappt.

⚠ **Eine benannte Grenze bleibt:** dass der Frist-Fall wirklich über
`nichtFertig` gemeldet wird, **liest** ein Wächter im Quelltext, statt es zu
fahren. Es zu fahren hieße, je Gegenprobe-Fall einen ganzen Smoke-Lauf in einer
Wegwerf-Kopie zu starten. Gemessen wurde es **einmal von Hand** (Tabelle oben).

**Gemessen: 772 → 784 grün, 0 ROT, 0 nicht abgeschlossen.**

### 3 · Die Knoten unter 0,80 — sechs Depots

| Depot | Register | nannte das Protokoll? |
|---|---|---|
| Perfect Skin Beauty | 0.783216 | nein |
| Tomys Hub | 0.786371 | nein |
| Perfect Skin Fashion | 0.79303 | nein |
| Alis Moderaum | 0.793347 | nein |
| Muster Werbetechnik | 0.793613 | nein |
| Private Brain | 0.800773 | nur in den **Stichworten** |

**Private Brain ist der schönste Beleg:** er nennt SBKIM und Mycel bereits, aber
nur in den Stichworten — und liegt als einziger knapp **über** der Schwelle,
während die fünf, denen beides fehlt, darunter liegen. Kein Beweis, aber es zeigt
in dieselbe Richtung wie die Messung vom 2026-09-10.

⚠ **Keiner der sechs rechnete aus dem INHALT.** In den Mycel-Mitschnitten trägt
keiner von ihnen `embeddingSource: "content"` — der Vektor kommt bei allen aus
der Beschreibung. Der Hebel greift hier also unmittelbar, anders als bei
Mixarium und Rezeptbuch.

**Was geändert wurde:** eigener Protokoll-Absatz, **die Domäne bleibt vorn**
(Modul 03 schneidet bei 512 Tokens ab — was hinten steht, fällt zuerst weg),
beide Wege zur Spore **wortgleich**.

⚠ **UND DAS ALLEIN HÄTTE NICHTS BEWIRKT.** In allen sechs überschrieb die
gespeicherte Spore den Vorschlag der App im Siegel **still** — wer neu signierte,
bekam den alten Text zurück. Genau die Fassung, die Klaus in Kim Hub Company
zweimal beanstandet hat. Der Block war in allen sechs Depots **byte-identisch**
(per `md5` geprüft), also eine Ersetzung für alle.

Je Depot **13 Wächter** und **9 Gegenprobe-Fälle** mit `trifft`-Muster:
**9 gefangen · 0 durchgerutscht · 0 aus dem falschen Grund · 0 tote Anker** in
allen sechs.

⚠ **Einer war beim ersten Lauf blind — und zwar der FALL, nicht der Wächter.**
Er ersetzte nur „SBKIM-Mycel", und das Wort steht in der Schlagwort-Zeile ein
zweites Mal. Kimhubs **siebte Art**: die Sabotage ändert nichts an dem, was der
Wächter sieht.

### 4 · Der Fall der PWA-Toolpoint-Startseite — zwei verschiedene Dinge

**Die CLS 0,062 war echt und hatte genau eine Ursache.** `#sucheMicLang` steht
**leer** in der Seite; `app.js` füllt ihn erst nach dem Laden. `.mic-lang` trug
`max-width: 11rem` und **keine** Breite — leer 36 px, gefüllt 176 px, und in der
umbrechenden Suchzeile rutschte „Suchen" auf eine eigene Zeile. Im Trace:
`alt[356,399,36,40] → neu[20,462,176,40]`, Δx −336, Δy 63.

⚠ **Der Kommentar drei Zeilen darüber warnt seit jeher genau davor.** Er steht
über dem Mikrofon, das dagegen geschützt wurde. Der Sprach-Wähler kam am
2026-08-17 daneben — acht Tage nach der 100·100·100-Messung — und brachte den
Sprung zurück, **eine Stelle weiter rechts**. *Ein Wächter am Einzelfall ist
morgen am Nachbarn blind.*

| | vorher | nachher (3 Läufe Handy) |
|---|---|---|
| Leistung | 99 | **100 · 100 · 100** |
| CLS | 0,062 | **0 · 0 · 0** (Computer ebenfalls 0) |
| TBT | 80 ms | 20 · 40 · 40 ms |

**Die „Gute Praxis 96" ist dagegen KEIN Befund über die Seite.** Der einzige
Abzug ist `errors-in-console`, und die Fehler sind durchweg
`ERR_TUNNEL_CONNECTION_FAILED` für die App-Symbole von `github.io`.
**Nachgemessen statt angenommen:** `curl` auf genau eine dieser Adressen
antwortet aus diesem Behälter mit **HTTP 000** (curl-Fehler 56).

⚠ **Der Eintrag vom 2026-09-08 hat sie notiert, als wäre sie eine Aussage über
die Seite.** Sie ist eine über die Leitung. Damit war die Gegenüberstellung
„100·100·100 gegen 99·100·96·100" in **einer** Spalte gar kein Vergleich.
**Eine Zahl trägt ihre Messbedingung mit, oder sie trägt gar nichts.**

---

## Proben

| Depot | Ergebnis |
|---|---|
| Sage-Protokol | `npm test` — **100 Proben, 100 grün, 0 rot, 0 nicht lauffähig** |
| PWA-Toolpoint | `node tests/smoke.mjs` — **784 grün · 0 ROT · 0 nicht abgeschlossen** |
| Alis-Moderaum | `npm test` — **54/54** |
| Perfect-Skin-Fashion | `npm test` — **64 grün, 0 rot** |
| Mein-Workfloh-Page | `npm test` — **82 grün, 0 rot** |
| Perfect-Skin-Beauty | `npm test` — **25 bestanden, 0 fehlgeschlagen** |
| Privat-Brain | `npm test` — grün (letzter Lauf 15/15) |
| Tomys-Hub | alle Proben grün **außer zwei**, siehe unten |

**`tests/manual_check.html`: ungeprüft, weil in Sage kein Modul-Code angefasst
wurde.** Diese Sitzung hat dort nur Doku ausgelagert und fortgeschrieben — es
gibt nichts, was die Datei anders zeigen könnte als vorher.

---

## Was offen ist

- **Klaus' Browser-Sichttest für alles davon.** Er ist nicht ersetzbar, und die
  Register-Zahlen der sechs Knoten bewegen sich **erst nach dem Neu-Signieren
  über das Siegel** — das kann nur er.
- **`Tomys-Hub/tests/smoke-spore-download.cjs` ist rot.** Auf `origin/main`
  ebenso (gemessen), also nicht von dieser Arbeit. Sie wartet auf
  `[data-ty-spore-tool]`, und **diese Marke gibt es im ganzen Depot nicht**
  (`grep`: null Treffer außerhalb der Probe). Ursache nicht weiter untersucht —
  sie liegt außerhalb dieses Auftrags und wäre eine Ausweitung. **Benannt statt
  umfahren.**
- **`Tomys-Hub/tests/smoke-verbund.cjs` ist rot** aus demselben Grund wie die 96
  oben: der Ausgangs-Proxy sperrt `wss://relay.family-projekt.de`. 15/16 grün.
- **Acht Draft-PRs** warten auf Klaus.
- Der Rückgabewert-Entscheid bei ⊘ (§ 2) — als Abwägung benannt, überstimmbar.

---

## Stundennachweis

**Gemessen als Spanne vom ersten bis zum letzten Commit dieser Sitzung**, über
alle acht Depots:

| | |
|---|---|
| erster Commit | **2026-09-11 10:26:40 UTC** (Sage, PULS-Auslagerung) |
| letzter Commit | **2026-09-11 11:15:17 UTC** (Sage, Protokoll und Brief) |
| **Spanne** | **48 Minuten 37 Sekunden** |

Die Zeitstempel stehen in der Git-Historie und sind dort nachprüfbar
(`git log --format='%aI'` über die acht Zweige).

⚠ **WAS DIESE SPANNE NICHT ENTHÄLT:** die Zeit **vor** dem ersten Commit — das
Lesen der Pflichtlektüre, das Einrichten der Zweige, das Installieren der Pakete
und die erste Messung. Sie hinterlässt keine Spur in der Historie und wird
deshalb **nicht mitgezählt**. Wer mehr behauptet, schätzt.

⚠ **UND SIE IST NICHT KLAUS' ARBEITSZEIT.** Beide überschneiden sich, sind aber
nicht dasselbe. Wer sie zusammenzieht, meldet Stunden, die so niemand gearbeitet
hat.
