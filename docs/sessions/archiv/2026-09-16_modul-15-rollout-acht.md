# Übergabeprotokoll — 2026-09-16 · Modul-15-Rollout in acht Träger

**Rolle:** Hauptsitzung · **Zweig:** `claude/modul15-rollout-entscheidung-k7m2`
**Zweig in den acht Apps:** `claude/sage-modul-15-rollout-jmecb1`

---

## Der Auftrag und die Entscheidung

Der Brief stellte den Rollout von Modul 15 als offene Frage: acht Träger stehen
byte-genau auf dem Kanon, zwölf auf einer älteren Generation, und
`--schreiben` kannte keinen Repo-Filter — es wäre ganz oder gar nicht gewesen.

**Klaus hat entschieden: erst die acht.** Seine Rückfrage davor — *„du meinst
Englisch und deutsch?"* — ist am Code beantwortet worden, nicht aus dem Brief:

```js
function T(de) {
  if (sprache() !== "en") return de;   // 15_membran.js:244-245
}
```

`T()` bekommt den **deutschen Satz selbst** als Argument. Deutsch bleibt
unverändert, Englisch kommt als Nachschlage-Tabelle daneben.

---

## Die Prämisse wurde nachgemessen, nicht übernommen

Der Brief nannte die acht einen *reinen Nachtrag*. Gemessen an allen acht
Trägern einzeln: **+203 / −22 Zeilen**, bei allen acht identisch.

Die 22 entfallenden Zeilen sind **ausnahmslos Anzeige-Zeilen** — Fenster-Titel,
`aria-label`, Spaltenkopf „Zeit", der Tipp, die Klartext-Zeile unter jedem
Eintrag, `(lokal)`, plus die drei Zähl-Zeilen, die zu `zaehlText()`
zusammengefasst wurden. **Keine Zeile der Schutz-Logik ist berührt.**

„Reiner Nachtrag" im Sinne von *nur Zusätze* war also falsch; richtig ist *alle
Änderungen in der Render-Schicht*. Die Formulierung ist im Chat gegenüber Klaus
berichtigt worden, bevor etwas geschrieben wurde.

---

## Was gebaut wurde

### `--nur-generation <sha>` im Verteiler

Schreibt nur in die Träger, deren Datei diesen sha trägt.

⚠ **Gefiltert wird nach dem sha des TRÄGERS, nicht nach Repo-Namen.** Eine
getippte Repo-Liste wäre die gepflegte Liste, vor der der Kopf des Verteilers
warnt — sie vergisst die App, die nach ihr gebaut wurde.

Drei Riegel, jeder mit eigenem Gegenprobe-Fall:

| Riegel | Warum |
|---|---|
| zurückgehalten wird **laut**, mit Repo, Fassung und Grund | ein Repo, das still aus einem Rollout fällt, ist der Schaden vom Vortag |
| ein sha ohne Treffer gibt **2** zurück | sonst meldete ein Tippfehler „0 nachgezogen", und das sieht aus wie ein gleiches Netz |
| die Fassungs-Übersicht bleibt **vollständig** | sonst meldete ein gefilterter Lauf „eine Fassung", während fünf draußen liegen |

### Der Standardzweig wird gefragt, nicht geraten

Die Veraltet-Prüfung vom Vortag riet: `catch { def = "master"; }`. Gibt es auch
`origin/master` nicht, warf das `rev-list` ein `fatal: ambiguous argument`, der
äußere `catch` schluckte es, **und das Repo fiel aus der Prüfung, ohne dass
eine Zeile darüber stand.** Gemessen an `Meine-In-and-Out-Book`.

Derselbe Schaden, gegen den dieser Block einen Tag vorher gebaut wurde — eine
Zeile weiter. Jetzt: `origin/HEAD`, dann `main`/`master`, und **drei Ausgänge
statt zwei**: aktuell · hängt zurück · **NICHT MESSBAR**.

### BookLedgerPros Klon

302 Commits / drei Monate zurück, frisch von `origin/main` aufgesetzt. Der
Zweig trug keinen ungepushten Commit — nachgesehen, nicht angenommen. Der
Verteiler sieht seitdem **20 Träger** statt 19.

---

## Gemessen

| | vorher | nachher |
|---|---|---|
| Fassungen von Modul 15 im Netz | **5** bei 20 Trägern | **4** bei 12 |
| Träger byte-gleich mit dem Kanon | 0 | **8** |
| `smoke_kanon_verteilen.mjs` | 35 grün | **53 grün · 0 rot** |
| `gegenprobe_kanon_verteilen.sh` | 13 gefangen | **21 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `node tests/run_alle.mjs` | 107/107 | **107 Proben · 107 grün · 0 rot · 0 nicht lauffähig** |

**Proben in den acht Ziel-Repos, nach dem Nachziehen:**

| Repo | Ergebnis |
|---|---|
| Alis-Moderaum | 55/55 bestanden |
| BookLedgerPro | 2182 bestanden, 0 fehlgeschlagen |
| Mein-Workfloh-Page | 84 grün, 0 rot |
| PWA-Toolpoint | 872/872 · 0 nicht abgeschlossen |
| Perfect-Skin-Beauty | 14 + 69 + 18 + 25 grün, 0 rot |
| Perfect-Skin-Fashion | 66 grün, 0 rot |
| SB-KIMTool-Point | 146 grün, **2 rot** (vorbestehend, siehe unten) |
| kim-hub-company | 69 grün · 0 ROT · 0 nicht lauffähig |

⚠ **Die zwei roten sind belegt vorbestehend.** Derselbe Lauf auf dem
unveränderten Stand (Änderung weggestasht, `git status` leer) meldet exakt
dieselben zwei: `Probe 27: Netz-Link gerendert` und `Probe 27: Klick öffnet
URL`. Vor und nach dem Nachziehen: 148 Proben, 146 grün, 2 rot.

Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe. Vor jedem Commit die
**Dateiliste** angesehen, nicht nur den Diff — die von `npm install` erzeugten
`package-lock.json` (PWA-Toolpoint, kim-hub-company) sind dadurch draußen
geblieben.

**Auf `main` nachgezählt, BEVOR die acht Zweige gehoben wurden:** die Zeile
`Foreign-access window` steht in allen acht. Das ist die Reihenfolge aus der
Verfassung — erst nachsehen, was angekommen ist, dann die Zweige heben.

---

## Drei eigene Fehler, alle in der Messung

| Was | Warum es nichts (oder das Falsche) maß |
|---|---|
| ein Wächter zählte die Fassungs-**Gruppen** statt ihrer **Mitglieder** | `gm.set(gkey, [])` legt den Schlüssel weiter an — die Zahl blieb 2, die Liste war leer. Eine Übersicht, die zwei Fassungen behauptet und **kein Repo nennt**, wäre durchgegangen |
| eine Sabotage traf die **Kandidatenliste** statt des **Fragens** | `git clone` setzt `origin/HEAD`, also antwortete schon das `symbolic-ref`, und die Kandidatenliste kam nie an die Reihe |
| die Gegenprobe las als „rote Zeile" die Ausgabe des **Werkzeugs** | der neue Leer-Treffer-Riegel schreibt selbst eine `✗`-Zeile auf stderr; `grep -m1 '✗'` fand sie zuerst. Drei Fälle trugen den Namen einer fremden Meldung. Gegriffen wird jetzt nur die eigene Marke der Probe (`^  ✗`) |

⚠ **Und ein Rückgabewert kam einmal von `tail`** — beim Prüfen meines eigenen
Riegels. Er meldete 0, während das Werkzeug 2 gab.

---

## Benannte Grenze

Der Verteiler beschriftet die acht weiter als „GENERATIONEN-SPRUNG, Proben im
Ziel-Repo fahren". Seine Schwelle ist eine reine **Zeilenzahl** (≥ 50), und 225
Zeilen liegen darüber; für diese acht war es Render-Schicht. Die Beschriftung
ist vorsichtig, nicht falsch. **Nicht geändert**, weil eine Schwelle, die
Nachtrag von Sprung unterscheiden soll, den Inhalt messen müsste — das ist ein
eigener Bau, keine Nebenbei-Änderung.

---

## Was offen bleibt

- **Zwölf Träger auf vier älteren Generationen.** `fbf9f42d8a27` 8×
  (Jasons-Tresor, Kim-Bell, Kimboard, Kimseek, Mein-Tresor, Mein-WorkFloh,
  Privat-Brain, Tomys-Hub) · `0f8a3f69de61` 2× (Mein-Rezeptbuch,
  Muttis-Rezeptbuch) · `33d6fe0c5057` 1× (Mein-Mixarium) · `8a07567f98ce` 1×
  (family-project, die entfernteste Fassung). Jede Gruppe braucht einen
  Probenlauf im Ziel-Repo.
- **Sieben Gegenstellen mit ungelesener Post** (BookLedgerPro 23 > 18,
  SB-KIMTool-Point 36 > 24, Family Projekt 7 > 2, Jasons-Tresor 14 > 11,
  Mixarium 14 > 6, Rezeptbuch 13 > 5, Mein-Tresor 17 > 14). Die Schlagzeilen
  datieren aus Juli. In dieser Sitzung **nicht** bearbeitet — das ist eine
  benannte Auslassung, keine Erledigung.
- **Privat-Brains `modules/net-widget.js`** (838 Zeilen, app-eigen, 0 Treffer
  auf `TEXTE`) — vom Kanon nicht erreichbar, eigene Entscheidung.
- **Privat-Brains 4** und **SB-KIMTool-Points 2** vorbestehende rote Zeilen.
- **Der Rezept-Export trägt die Spore nicht** (benannter Befund).
- **Mein WorkFlohs `sampleContent()`-Gerüst bleibt ausgeschaltet.**
- **Klaus' Browser-Sichttest** — ob das Fenster auf einer englischen Seite
  wirklich englisch dasteht, sieht nur er.

---

## Nächster sinnvoller Schritt

Die zwölf zurückgehaltenen Träger **in Gruppen nach ihrer Fassung** nachziehen,
je Gruppe mit Probenlauf im Ziel-Repo. Die `fbf9f42d8a27`-Gruppe ist mit acht
Repos die größte und trägt dieselbe Fassung — ein Durchgang deckt acht Apps ab.
