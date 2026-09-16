# Ausgelagerter PULS-Eintrag — 2026-09-16 (Rollout mit Filter, acht von zwanzig)

> Ausgelagert am 2026-09-16, weil `docs/PULS.md` auf 29 Zeilen an die
> 3000-Zeilen-Grenze herangekommen war — die nächste Sitzung hätte keinen
> Eintrag mehr unterbekommen. **Nichts gekürzt:** der Eintrag steht hier
> wortgleich, wie er in PULS.md stand.

---

## 2026-09-16 · Acht von zwanzig — der Rollout mit Filter

**Klaus' Entscheidung**, auf die Frage nach ganz oder gar nicht: *„Erst die 8
byte-aktuellen."* Seine Rückfrage davor: *„du meinst Englisch und deutsch?"* —
ja, beides; belegt an `15_membran.js:244`, `if (sprache() !== "en") return de;`.

### Die Prämisse hielt nicht ganz, und das steht hier statt in der Erinnerung

Der Brief nannte die acht einen **reinen Nachtrag**. Nachgemessen, an allen
acht Trägern einzeln:

| | |
|---|---|
| Unterschied zum Kanon | **+203 / −22** Zeilen, bei allen acht gleich |
| die 22 entfallenden | **alle Anzeige-Zeilen** — Fenster-Titel, `aria-label`, Spaltenkopf „Zeit", der Tipp, die Klartext-Zeile, plus die drei Zähl-Zeilen, die zu `zaehlText()` wurden |
| Schutz-Logik | **keine Zeile berührt** |

„Reiner Nachtrag" im Sinne von *nur Zusätze* war falsch. Richtig ist: **alle
Änderungen liegen in der Render-Schicht.** Der Unterschied ist klein und
trotzdem einer — ein Wächter auf „nur `+`-Zeilen" wäre hier zu Recht rot
geworden.

### Der Filter: nach der Fassung, nicht nach Repo-Namen

`--nur-generation <sha>` schreibt nur in die Träger mit diesem sha.

⚠ **GEFILTERT WIRD NACH DEM sha DES TRÄGERS.** Eine getippte Repo-Liste wäre
genau die gepflegte Liste, vor der der Kopf des Verteilers warnt: sie vergisst
die App, die nach ihr gebaut wurde. Der sha steht in der Fassungs-Übersicht
desselben Laufs — eine Messung, kein Name.

Drei Riegel, jeder mit Gegenprobe-Fall:

- **Zurückgehalten wird laut**, mit Repo, Fassung und Grund, und zählt in der
  Schlusszeile mit. Ein Repo, das still aus einem Rollout fällt, ist wortgleich
  der Schaden vom Vortag.
- **Ein sha, der keinen Träger trifft, gibt 2 zurück.** Sonst meldete ein
  Tippfehler „0 nachgezogen", und das sieht aus wie ein Netz, das gleich steht.
- **Die Fassungs-Übersicht bleibt vollständig.** Beschnitte der Filter sie,
  meldete ein gefilterter Lauf „eine Fassung im Netz", während fünf draußen
  liegen — die Auskunft, wegen der es den Filter gibt.

### Und ein stilles Überspringen, einen Tag alt und eine Zeile weiter

Die Veraltet-Prüfung vom Vortag riet den Standardzweig: `catch { def =
"master"; }`. Gibt es auch `origin/master` nicht, warf das folgende `rev-list`
ein `fatal: ambiguous argument`, der äußere `catch` schluckte es, **und das
Repo fiel aus der Prüfung, ohne dass eine Zeile darüber stand.** Gemessen an
`Meine-In-and-Out-Book` (Depot ohne einen einzigen Zweig auf `origin`).

Das ist derselbe Schaden, gegen den dieser Block einen Tag vorher gebaut wurde.
Der Zweig wird jetzt **gefragt** (`origin/HEAD`, dann `main`/`master`), und es
gibt **drei Ausgänge statt zwei**: aktuell · hängt zurück · **NICHT MESSBAR**.

### BookLedgerPro ist wieder sichtbar

Sein Klon stand 302 Commits / drei Monate zurück und fiel deshalb aus jedem
Lauf. Frisch von `origin/main` aufgesetzt (der Zweig trug keinen ungepushten
Commit — nachgesehen, nicht angenommen). Der Verteiler sieht seitdem **20
Träger** statt 19, und BookLedgerPro gehörte zur byte-aktuellen Gruppe.

### Gemessen

| | vorher | nachher |
|---|---|---|
| Fassungen von Modul 15 im Netz | **5** bei 20 Trägern | **4** bei 12 |
| Träger byte-gleich mit dem Kanon | 0 | **8** |
| `smoke_kanon_verteilen.mjs` | 35 grün | **53 grün · 0 rot** |
| `gegenprobe_kanon_verteilen.sh` | 13 gefangen | **21 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `node tests/run_alle.mjs` | 107/107 | **107 Proben · 107 grün · 0 rot · 0 nicht lauffähig** |

Proben **in den acht Ziel-Repos**, nach dem Nachziehen: Alis-Moderaum 55/55 ·
BookLedgerPro 2182/0 · Mein-Workfloh-Page 84/0 · PWA-Toolpoint 872/872 ·
Perfect-Skin-Beauty 14+69+18+25 grün · Perfect-Skin-Fashion 66/0 ·
SB-KIMTool-Point 146 grün / **2 rot** · kim-hub-company 69/0.

⚠ **DIE ZWEI ROTEN SIND VORBESTEHEND, UND DAS IST BELEGT statt behauptet.**
Derselbe Lauf auf dem unveränderten Stand (Änderung weggestasht, `git status`
leer) meldet exakt dieselben zwei — `Probe 27: Netz-Link gerendert` und
`Probe 27: Klick öffnet URL`. Vor und nach dem Nachziehen: **148 Proben, 146
grün, 2 rot.**

Rückgabewerte **direkt** gelesen. Auf `main` nachgezählt, **bevor** die acht
Zweige gehoben wurden: die englische Zeile steht in allen acht.

### Zwei eigene Fehler, beide in der Messung

| Was | Warum es nichts maß |
|---|---|
| ein Wächter zählte die Fassungs-**Gruppen** statt ihrer **Mitglieder** | `gm.set(gkey, [])` legt den Schlüssel weiter an: die Zahl blieb 2, die Liste war leer. Eine Übersicht, die zwei Fassungen behauptet und **kein Repo nennt**, wäre durchgegangen |
| eine Sabotage traf die **Kandidatenliste** statt des **Fragens** | `git clone` setzt `origin/HEAD`, also antwortete schon das `symbolic-ref` — die Liste kam nie an die Reihe |

⚠ **UND DIE GEGENPROBE LAS ALS „ROTE ZEILE" DIE AUSGABE DES WERKZEUGS.** Der
neue Leer-Treffer-Riegel schreibt selbst eine `✗`-Zeile auf stderr; `grep -m1
'✗'` fand sie zuerst. Drei Fälle trugen damit den Namen einer **fremden**
Meldung. Gegriffen wird jetzt nur die eigene Marke der Probe (`^  ✗`).

⚠ **Und ein Rückgabewert kam einmal von `tail`** — beim Prüfen meines eigenen
Riegels. Er meldete 0, während das Werkzeug 2 gab. Dieselbe Falle, netzweit
aufgeschrieben, in noch einem Kostüm.

### Benannte Grenze

Der Verteiler beschriftet die acht weiter als **„GENERATIONEN-SPRUNG, Proben im
Ziel-Repo fahren"** — seine Schwelle ist eine reine **Zeilenzahl** (≥ 50), und
225 Zeilen liegen darüber. Für diese acht war es eine Render-Schicht. Die
Beschriftung ist damit vorsichtig, nicht falsch; wer sie liest, prüft mit
`diff`, was die Zeilen wirklich sind. Nicht geändert, weil eine Schwelle, die
den Nachtrag vom Sprung unterscheiden soll, den Inhalt messen müsste — und das
ist ein eigener Bau.

### Was offen bleibt

- **Zwölf Träger auf vier älteren Generationen** (bis 657 Zeilen zurück):
  `fbf9f42d8a27` 8× · `0f8a3f69de61` 2× · `33d6fe0c5057` 1× ·
  `8a07567f98ce` 1× (family-project). Jeder braucht einen Probenlauf im
  Ziel-Repo.
- **Der Briefkasten hat sieben ungelesene Gegenstellen** (BookLedgerPro seq 23
  > ack 18, SB-KIMTool-Point 36 > 24, Family Projekt 7 > 2, Jasons-Tresor
  14 > 11, Mixarium 14 > 6, Rezeptbuch 13 > 5, Mein-Tresor 17 > 14). Die
  Schlagzeilen datieren aus Juli; in dieser Sitzung nicht bearbeitet.
- **Privat-Brains `modules/net-widget.js`** (838 Zeilen, app-eigen, 0 Treffer
  auf `TEXTE`), **Privat-Brains 4** und **SB-KIMTool-Points 2** vorbestehende
  rote Zeilen, der Rezept-Export ohne Spore, **Mein WorkFlohs
  `sampleContent()`-Gerüst bleibt ausgeschaltet.**
- **Klaus' Browser-Sichttest** — ob das Fenster auf einer englischen Seite
  wirklich englisch dasteht, sieht nur er.

**Nächster sinnvoller Schritt:** die zwölf zurückgehaltenen Träger in Gruppen
nach ihrer Fassung nachziehen, je Gruppe mit Probenlauf im Ziel-Repo — die
`fbf9f42d8a27`-Gruppe ist mit acht Repos die größte.
