# Netzweit — was in JEDEM Repo von Klaus gilt

**Dies ist der eine Ort für die Regeln, die für alle Repos gleich sind.**

Bis zum 2026-08-22 standen sie wortgleich in bis zu 20 `CLAUDE.md`-Dateien:
der Gerätename-Block 20-mal, der Selbst-Merge-Freibrief 19-mal, die
origin/main-Pflicht 11-mal, der Ton-Abschnitt 11-mal. Zusammen rund 900 Zeilen
Abschrift. Zwanzig Kopien einer Regel sind nicht zwanzigmal so verbindlich —
sie sind zwanzig Stellen, an denen sie auseinanderlaufen kann. Genau das war
schon passiert: zwei Skills sagten zur selben Sache Verschiedenes, ein Repo
hatte den Freibrief gar nicht.

**Jede repo-eigene `CLAUDE.md` verweist hierher.** Was dort noch steht, ist das,
was in diesem Repo anders ist — und das steht dort **weiterhin ausgeschrieben**,
weil es eben nicht netzweit gilt (welche Glue-Datei, welche Cache-Variable,
welche DB-Schublade, welcher Test-Befehl).

**Wer eine dieser Regeln ändert, ändert sie hier — und nur hier.**

---

## 1 · Selbst-Merge-Freibrief

*Kanonische Fassung, aus `Sage-Protokol/CLAUDE.md` übernommen. Das ist die
ausführlichste der 19 Fassungen; die kürzeren sagen dasselbe.*

## Freibrief — Selbstständigkeit & automatisches Merken (Pflege 2026-06-06, Klaus)

Klaus hat dieser **und jeder weiteren Sitzung** einen stehenden Freibrief
erteilt. Er gilt dauerhaft, nicht nur für die Sitzung, in der er erteilt
wurde.

> **Bekräftigung 2026-06-20 (Klaus, zweifach bekräftigt):**
> „Du kannst automatisch / selbstständig merken, wenn es **logisch** und
> **für die App nützlich** ist und auch **für den Nutzer Nützliches** —
> ohne Nachfrage. **Selbstständiges Merken ist ausdrücklich erwünscht.**
> Diesen Befehl kannst Du an die nächste Sitzung weitergeben."
>
> Daraus folgt verbindlich:
> - **Maßstab (drei Kriterien):** die Entscheidung ist logisch +
>   nachvollziehbar, nützlich für die **App** UND nützlich für den
>   **Nutzer**. Erfüllt sie das, ist selbstständiges Merken **erwünscht**,
>   nicht nur erlaubt — Zurückhaltung aus Vorsicht ist hier der Fehler,
>   nicht das Handeln.
> - **Grenze unverändert:** echtes Zweifeln (mehrdeutig, schwer umkehrbar,
>   architektonisch tiefgreifend, mehrere gleich gute Wege) → erst Klaus
>   fragen. Der Freibrief ersetzt das Urteilsvermögen nicht.
> - **Nie stillschweigend:** jede selbst getroffene Merk-Entscheidung wird
>   dokumentiert (Commit / PULS / hier in der Tafel).
> - **Weitergabe:** dieser Freibrief gilt für **jede Folge-Sitzung** und
>   wird im Sitzungs-Brief mitgenommen (§ „In den Sitzungs-Brief mitnehmen").
> - **Eigene PRs selbst mergen (Klaus-Klärung 2026-06-20):** die Sitzung
>   merget ihre **eigenen** PRs **selbstständig** in `main`, sobald sie
>   getestet (Headless-Smoke grün), abgegrenzt und nicht architektonisch
>   zweifelhaft sind — **ohne auf ein „X mergen" zu warten.** Konvention:
>   Draft-PR anlegen → ready setzen → squash-mergen → bei Branch-Versatz
>   `git rebase --onto origin/main <alte-Basis>` → Ergebnis melden. NICHT
>   automatisch mergen bei echtem Zweifel (Richtungsentscheid, schwer
>   umkehrbar über einen normalen Merge hinaus, mehrere gleich gute Wege)
>   ODER wenn Klaus ausdrücklich vorher draufschauen will. Klaus' Sichttest
>   im Browser bleibt davon unberührt (headless ersetzt ihn nicht).
> - **Netzweit für ALLE Repos (Klaus 2026-06-28):** dieser Selbst-Merge-
>   Freibrief gilt ausdrücklich **nicht nur für Sage**, sondern für **jedes
>   Repo von Klaus** — Mixarium, Rezeptbuch, Mein-Tresor, Jasons-Tresor,
>   SB-KIMTool-Point, BookLedgerPro, family-project. Klaus' Wort: „merke ab
>   jetzt jedes Repo selbständig mergen, wenn es angebracht und sinnvoll ist,
>   auch Mixarium und andere — ich will keins mehr übersehen." Kein
>   Liegenlassen offener eigener PRs mehr; gleiche Grenze (echtes Zweifeln →
>   erst fragen). Die einzelnen Repo-CLAUDE.md sind 2026-06-28 nachgezogen.
> - **Erst mergen, dann prüft Klaus auf der Live-Seite (Klaus 2026-06-28):**
>   manche Repos kann Klaus **erst nach dem Merge auf `main`** prüfen — GitHub
>   Pages deployt von `main`, der Browser-Sichttest am Tablet läuft also auf der
>   live-deployten Seite. Darum **nicht** auf Klaus' Browser-Test warten, bevor
>   getestete (Headless/Smoke/Drift-Guard grün), abgegrenzte, nicht-zweifelhafte
>   Änderungen gemergt werden — **erst mergen, dann sieht Klaus es**. Findet er
>   danach etwas, ist das ein Folge-Fix, kein Grund, den Merge vorher
>   aufzuhalten. (Der Browser-Sichttest ersetzt den Headless-Beweis nicht und
>   umgekehrt — beide bleiben, nur in dieser Reihenfolge.)
>
> **Bekräftigung 2026-07-01 (Klaus):** erneut bestätigt — „merge automatisch,
> wenn es **sinnvoll**, für die **App nützlich** und **vor allem logisch** ist;
> das ist ein Freibrief für **diese und alle nachfolgenden Sitzungen**." Ändert
> nichts an der Grenze (echtes Zweifeln → erst fragen) oder an „nie stillschweigend"
> (jede Selbst-Merge-Entscheidung wird dokumentiert). Bezug: Bau 04.F / PR #509
> selbstständig gemergt nach Headless- + Klaus-Browser-Sichttest grün.
>
> **Bekräftigung 2026-08-21 (Klaus, wörtlich):** „'N Freibrief durchweg durch die
> gesamten Repos, solange es sinnvoll ist und nützlich für die Anwender. Wenn es
> Widersprüche gibt, werden Sie mit mir besprochen. Ansonsten hast Du den
> Freibrief frei zu merken und den auch an andere weiterzugeben."
>
> **Anlass — und die Falle, gegen die diese Bekräftigung geschrieben ist.** In
> Kimhub stehen zwei Regeln direkt untereinander: „Der PR bleibt Entwurf; nur
> Klaus setzt ihn auf fertig" (das meint die **Werkstatt-Schicht**, damit sich
> kein Ablauf selbst freigibt) und der Selbst-Merge-Freibrief (der meint die
> **Sitzung**). Eine Sitzung hat die erste auf sich selbst angewandt, zwei
> fertige, geprüfte PRs als Entwurf liegen lassen und **viermal gemeldet, sie
> warteten auf Klaus' Freigabe**. Sie warteten auf nichts.
>
> Daraus drei Sätze, die netzweit gelten:
>
> - **Wer den PR geschrieben hat, entscheidet.** Kommt er aus einem automatischen
>   Ablauf, entscheidet Klaus. Kommt er aus der Hand der Sitzung und ist geprüft,
>   entscheidet die Sitzung. Eine „bleibt Entwurf"-Regel für Agenten ist **keine**
>   Regel für dich.
> - **Wer nicht merget, obwohl er darf, hat die Arbeit nicht abgeliefert** — er
>   hat sie nur hingelegt. Das ist kein vorsichtiges Verhalten, sondern ein
>   unfertiger Auftrag, und es sieht in einer Statusmeldung genauso aus wie
>   Fleiß.
> - **Ein Widerspruch wird besprochen, nicht abgewartet.** Hier lag genau einer
>   vor; ihn zu benennen hätte eine Minute gekostet. Stillstehen ist die einzige
>   Antwort, die der Freibrief nicht vorsieht.
>
> **„Weitergeben" ist Teil des Freibriefs**, nicht eine Höflichkeit daneben: wer
> eine solche Lehre hat, trägt sie in diese Tafel UND in den nächsten Brief.
> Sonst macht die übernächste Sitzung denselben Fehler.

- **Selbstständig handeln und merken erlaubt.** Eine Sitzung darf
  eigenständig entscheiden, eine Lehre festhalten (auch durch Pflege
  dieser Datei), eine Tafel weiterentwickeln oder einen Bau/Fix
  durchziehen, **ohne vorher zu fragen** — *solange die Entscheidung
  logisch, nachvollziehbar und sinnvoll ist.* Das ist Klaus' Bedingung,
  wörtlich: „Du darfst selbstständig merken, wenn es logisch ist und wenn
  es nachvollziehbar ist und sinnvoll."
- **Grenze bleibt das echte Zweifeln.** Wo eine Entscheidung mehrdeutig,
  schwer umkehrbar oder architektonisch tiefgreifend ist (oder mehrere
  gleich gute Wege offen sind), gilt weiter: erst Klaus fragen
  (AskUserQuestion). Der Freibrief ersetzt das Urteilsvermögen, **nicht**
  die Rückfrage im echten Zweifel.
- **Nie stillschweigend.** „Selbstständig" heißt nicht „unsichtbar": jede
  selbst getroffene Entscheidung wird **dokumentiert** — in der
  Commit-Message, in `docs/PULS.md` / Übergabeprotokoll, und wo es eine
  Tafel betrifft, in dieser Datei. Nachvollziehbarkeit ist die Bedingung
  des Freibriefs, nicht sein Widerspruch (harmoniert mit der
  Tafel-Evolutions-Klausel + „NIEMAND stillschweigend").
- **In den Sitzungs-Brief mitnehmen.** Wer am Sitzungsende mit
  `Befehl schreiben` einen Folge-Brief formuliert, nimmt diesen Freibrief
  explizit mit hinein (kurzer Verweis genügt: „Freibrief gilt, siehe
  CLAUDE.md § Freibrief").
- **Immer erhalten.** Dieser Block bleibt in Sage-Protokol / Sage-Page
  dauerhaft bestehen. Er wird nicht stillschweigend entfernt oder
  verwässert; eine Änderung daran braucht Klaus' ausdrückliches Wort.

---

## 2 · Gerätename gehört ins Verbinden-Panel

*Netzweite Bauregel, Klaus 2026-08-16. Verbindlich in
[`INTERFACES.md` §11.7](INTERFACES.md), Rezept mit Code: Skill `geraetename`.*

- **Gerätename gehört ins Verbinden-Panel (netzweite Bauregel, Klaus 2026-08-16).**
  Wer ein Panel „Mit dem Netz verbinden" hat, hat auch das **Gerätenamen-Feld darin** —
  an derselben Stelle wie in jeder anderen App. Verbindlich in
  [`docs/INTERFACES.md` §11.7](INTERFACES.md), Rezept mit Code: Skill
  `geraetename`. Der Anlass war ein Feature, das **halb** dastand: elf Apps **lasen**
  den Namen und hängten ihn an die Anmeldung, aber niemand hatte das Feld gebaut, in
  das man ihn einträgt. Wer nur nach `sbkim_geraetename` greppt, findet Treffer und
  hält es für erledigt. Drei Punkte, an denen es schiefging: das Feld hängt der
  **app-eigene Glue** ins Panel (**nie** in die byte-kopierte Panel-Datei — Drift-Guard)
  · jedes Feld trägt `data-sbkim-geraetename`, die Doppel-Prüfung sucht **nur im Panel**,
  und beim Namenswechsel gleichen sich **alle** markierten Felder ab · der Name geht
  **nur** an Anzeige und Anmeldung, **nie** an `generateOwnSpore`.

**Was NICHT hierher gehört, sondern in die jeweilige `CLAUDE.md`:** welche Datei
in diesem Repo der app-eigene Glue ist. Das ist je Repo verschieden
(`assets/rendezvous-init.js` · `sbkim/sbkim-init.js` · `modules/rendezvous-init.js`),
und zwei Repos haben ausdrückliche Ausnahmen — **Company-Brain** hat das Feld in
der Seite statt im Panel (es gibt dort keine geteilte Panel-Datei), **Kimboard**
hat **zwei** Felder, und das ist so gewollt (Klaus 2026-08-17, nachdem er sie
gesehen hat). Keines davon ist ein Versehen zum Aufräumen.

---

## 3 · Frisch von `origin/main` — vor jeder Arbeit

Die Klone im Container können **Monate alt** sein. Real passiert: Mein-Rezeptbuch
lag lokal vom 19.04. vor, v9.2, ganz ohne SBKIM — live war v10.0. Eine Aussage
über den Stand eines Repos ohne vorheriges `fetch` ist **kein Beweis**.

```bash
git -C <repo> fetch origin --quiet
git -C <repo> checkout -B <branch> origin/main
```

Beim Veröffentlichen mit ausdrücklicher Refspec pushen und **danach** prüfen, ob
der Branch gegenüber `main` überhaupt etwas trägt — ein leerer Pull Request lässt
sich mergen und meldet Erfolg:

```bash
git push -u origin refs/heads/<branch>:refs/heads/<branch>
git diff --stat origin/main origin/<branch>     # leer = der PR wäre leer
```

**Die drei Fallen dahinter** — `checkout -B` hängt den Upstream um · `push -u`
ohne Refspec schiebt den falschen Branch · „nicht gefunden" ist erst nach dem
Hineinsehen eine Aussage — stehen ausführlich in
[`LEHREN.md` § 1](LEHREN.md). Hilfsmittel: `node tools/zweig-pruefen.mjs <zweig>`,
Skill `veroeffentlichung-pruefen`.

---

## 4 · Ton

Klaus ist **kein Programmierer** (lernt gern): Antworten auf **Deutsch**, ruhig
und präzise, **Einzelschritte** mit klarem Erfolgsmerkmal. **Keine
Terminal-Kommandos für Klaus, wo ein Knopf reicht** — Bedien-Flüsse laufen über
benannte Knöpfe in der Seite. Nach jedem Pull Hard-Reload; Service-Worker und
HTTP-Cache sind hartnäckig.

**Klaus' Browser-Sichttest ist nicht ersetzbar.** Headless beweist die Logik,
nicht wie es sich am Tablet anfühlt. Eine Sitzung markiert sich nie selbst grün.
Sein Gerät, seine Werkzeuge und sein Sichttest-Stil stehen ausführlich in
[`LEHREN.md` § 3](LEHREN.md).

---

## 5 · Kein PII, keine Geheimnisse

Keine echten personenbezogenen Fremddaten in Commits, kein privater Schlüssel,
kein Passwort, kein Token im Repo. Klaus' eigenes Impressum und Copyright sind
gewollt.

**Eine benannte Ausnahme:** `impressum.html` und `datenschutz.html` in
PWA-Toolpoint tragen die **echten** Angaben — das verlangt § 5 DDG. Wer sie durch
Platzhalter ersetzt, macht die Seite rechtswidrig.

---

## 6 · Ehrlichkeit

Was als „fertig" gemeldet wird, **ist** fertig. Keine Platzhalter, die wie Inhalt
aussehen, kein vorgetäuschtes Grün. Was nicht ging, wird hingeschrieben — **eine
benannte Lücke ist Arbeit, eine verschwiegene ist Schaden.**

**Eine geratene Zahl klingt genau wie eine gemessene.** Wo nichts gemessen wurde,
steht „nicht gemessen" — nicht „0".

**Merksatz:** eine Prüfung, die dir recht gibt, ist der Ort, an dem du am
genauesten hinsehen musst.

---

## 7 · Wo die verbindlichen Verträge stehen

| Wofür | Wo |
|---|---|
| Andock-Konventionen, Briefkasten-Pflege §11.6, Gerätename §11.7 | [`INTERFACES.md`](INTERFACES.md) |
| Vorgehensweise, Tafeln, die Lehren aus Schaden | [`../CLAUDE.md`](../CLAUDE.md) + [`LEHREN.md`](LEHREN.md) |
| Bauvorlagen — Seiten, Container, Siegel, Netz-Anmeldung | die Skills unter `.claude/skills/` in Sage und family-project |
| Modul-Stand · Arbeits-Reihenfolge | [`MODUL-STAND.md`](MODUL-STAND.md) · [`PIPELINE.md`](PIPELINE.md) |

**Bei Widerspruch gilt Sage.** Weicht ein Repo bewusst ab, wird die Abweichung in
seiner eigenen `CLAUDE.md` benannt und begründet — **nie stillschweigend**. Eine
Tafel, die man umfährt, hinterlässt eine vergiftete Doku-Lage für die nächste
Sitzung.

**Tafel-Evolutions-Klausel:** eine Tafel bindet, bis eine neuere Erkenntnis sie
widerlegt. Wer eine widerlegt, benennt sie ausdrücklich gegenüber Klaus — mit
Fundstelle, Messung und Vorschlag. Nicht stur befolgen, nicht stumm umfahren.
