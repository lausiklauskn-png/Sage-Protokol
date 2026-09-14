# PULS-Auslagerung 2026-09-14 (spät) — die Sitzung vom 2026-09-11

**Ausgelagert am 2026-09-14**, weil `docs/PULS.md` mit 2.962 Zeilen an seine
3000-Zeilen-Grenze stieß und der Eintrag dieser Sitzung darüber hinausgeführt
hätte. Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier steht der Eintrag **wortwörtlich**, nichts gekürzt, nichts
zusammengefasst.

---

## Stand 2026-09-11 (Haupt-Sitzung, später) · ✅ DIE FRIST, DER SPRUNG UND DIE FÜNF UNTER 0,80

**Rolle:** Haupt-Sitzung. Vier Aufgaben aus dem Brief, alle vier bearbeitet.
Kein Modul-Code in Sage angefasst, kein `status.json`, keine Spec.

### 1 · PULS ausgelagert, nicht gekürzt

Die Datei stand bei **exakt 3.000 von 3.000 Zeilen** — die Grenze, nicht knapp
davor. Zwei Einträge (2026-09-07 und 2026-09-04, zusammen 178 Zeilen) stehen
jetzt in [`sessions/archiv/2026-09-11_puls-auslagerung.md`](sessions/archiv/2026-09-11_puls-auslagerung.md).
Gemessen: **3.000 → 2.839**. Der ausgelagerte Text ist byte-gleich (`diff` gegen
die Originalzeilen, leer); der Name wurde vorher mit `ls` geprüft und trägt das
Datum der **Auslagerung**, nicht das der Einträge.

### 2 · `smoke_pruefer.mjs` hat eine eigene Frist — und einen dritten Ausgang

`PWA-Toolpoint/tests/smoke.mjs` startete ihn **ohne Frist** und meldete rot,
sobald er mit einem Fehler endete. Stirbt er an seiner eigenen 30-s-Uhr, stand
dort „eigene Probe grün: nein" — eine Zeile, die nach einem Befund aussieht und
eine Zeitüberschreitung ist. Gemessen am 2026-09-10: derselbe Baum, dreimal
`node tests/smoke.mjs` → 737 · 737 · 738.

`tests/kindprozess.mjs` trägt die Frist und drei Ausgänge: **grün** · **ROT**
(Befund *oder* anderer Wurf) · **⊘ nicht abgeschlossen** (ungeprüft, nicht grün).
Ein Befund gilt **vor** allem anderen — auch wenn das Kind danach hängt und auch
wenn „Timeout" in seinem Befundtext steht.

**Gemessen, nicht geraten:** zwei Läufe des Prüfers 10 969 ms und 8 016 ms →
Frist 180 s, rund das Sechzehnfache. Die gemessene Dauer steht bei jedem Lauf
daneben (`8.1 s von 180 s`), damit ein Heranwachsen sichtbar wird, bevor sie
fällt.

**Die Reparatur hat ihre eigene Messung** — am *echten* Prüfer mit auf 1 ms
gekürzter innerer Uhr, in einer Wegwerf-Kopie, derselbe Baum:

| | alt (`origin/main`) | neu |
|---|---|---|
| Zeile | `✗ eigene Probe grün` — **ohne jeden Hinweis** | `⊘ … NICHT ABGESCHLOSSEN → das Kind ist an seiner eigenen Uhr gestorben` |
| Schlusszeile | `769/770 bestanden` | `775/775 bestanden · 1 nicht abgeschlossen` |
| Rückgabewert | **1** | **0** |

⚠ **Der Rückgabewert ist die Entscheidung daran, und sie ist eine Abwägung.**
Ein falsches Rot ist hier teuer, weil die Gegenprobe bei roter Ausgangslage
abbricht; dagegen steht das Risiko, dass ein wirklich hängender Prüfer unbemerkt
bleibt. Deshalb steht die dritte Spalte **immer** in der Schlusszeile, auch als
Null. **Klaus kann das überstimmen** — es ist eine Abwägung, keine Tatsache.

⚠ **Ein eigener Gegenprobe-Fall hat dabei einen blinden eigenen Wächter
entlarvt.** „Der echte Befund wird nicht mehr ZUERST gelesen" rutschte durch,
obwohl der Anker saß: das Kind, an dem gemessen wurde, war von selbst gestorben,
und dann landet es auch **ohne** die Reihenfolge-Regel bei rot, nur über einen
anderen Zweig. Die Regel wirkt erst bei einem Kind, das **findet und danach
hängt** — und diesen Wächter gab es nicht.

⚠ **Die Gegenprobe hat seitdem selbst eine Frist** (`FRIST=300`). Ohne sie
brächte ausgerechnet der Fall, der die Kind-Frist ausbaut, den ganzen Lauf zum
Stehen — Kimhubs **sechste Art**, und sie wäre beim ersten Lauf zugeschnappt.

Gemessen: **772 → 784 grün, 0 ROT, 0 nicht abgeschlossen.**

### 3 · Die Knoten unter 0,80 — sechs Depots, und der Hebel allein hätte nicht gereicht

Fünf standen unter der Handshake-Schwelle, Private Brain siebentausendstel
darüber. **Keiner von ihnen nannte SBKIM, Mycel oder Knoten in der
Beschreibung** — Private Brain nur in den Stichworten, und genau er liegt als
einziger knapp darüber. Das ist kein Beweis, aber es zeigt in dieselbe Richtung
wie die Messung vom 2026-09-10.

| Depot | Register | Beschreibung nannte das Protokoll |
|---|---|---|
| Perfect Skin Beauty | 0.783216 | nein |
| Tomys Hub | 0.786371 | nein |
| Perfect Skin Fashion | 0.79303 | nein |
| Alis Moderaum | 0.793347 | nein |
| Muster Werbetechnik | 0.793613 | nein |
| Private Brain | 0.800773 | nur in den **Stichworten** |

Alle sechs tragen jetzt einen eigenen Protokoll-Absatz, **die Domäne bleibt
vorn** (Modul 03 schneidet bei 512 Tokens ab — was hinten steht, fällt zuerst
weg), und beide Wege zur Spore tragen ihn **wortgleich**.

⚠ **UND DAS ALLEIN HÄTTE NICHTS BEWIRKT.** In allen sechs überschrieb die
gespeicherte Spore den Vorschlag der App im Siegel **still** — wer neu
signierte, bekam den alten Text zurück, ohne dass irgendwo etwas dazu dastand.
Genau die Fassung, die Klaus in Kim Hub Company zweimal beanstandet hat. Der
Block war in allen sechs Depots **byte-identisch** (`md5`), also eine
Ersetzung für alle. Jetzt gewinnt der Vorschlag der App; der zuletzt signierte
bleibt in der Spore, ein Knopf holt ihn zurück, und eine Zeile nennt jedes Mal,
welcher der beiden im Feld steht.

Je Depot **13 Wächter** (jede Sache einzeln — eine Zahl misst Umfang und keinen
Inhalt) und **9 Gegenprobe-Fälle** mit `trifft`-Muster: **9 gefangen · 0
durchgerutscht · 0 aus dem falschen Grund · 0 tote Anker** in allen sechs. Einer
war beim ersten Lauf blind, und zwar der **Fall**: er ersetzte nur
„SBKIM-Mycel", und das Wort steht in der Schlagwort-Zeile ein zweites Mal.

⚠ **WAS DAS NICHT TUT: die Zahlen im Register bewegen sich erst, wenn über das
SIEGEL neu signiert wird** — und das kann nur Klaus, im Browser. Wer die Datei
ändert und auf eine steigende Zahl wartet, wartet vergeblich.

### 4 · Der Fall der PWA-Toolpoint-Startseite — zwei verschiedene Dinge

**Die CLS 0,062 war echt und hatte genau eine Ursache.** `#sucheMicLang` steht
**leer** in der Seite; `app.js` füllt ihn erst nach dem Laden. `.mic-lang` trug
`max-width: 11rem` und **keine** Breite — leer 36 px, gefüllt 176 px, und in der
umbrechenden Suchzeile rutschte „Suchen" auf eine eigene Zeile. Im Trace:
`alt[356,399,36,40] → neu[20,462,176,40]`, Δx −336, Δy 63.

⚠ **Der Kommentar drei Zeilen darüber warnt seit jeher genau davor** — er steht
über dem Mikrofon, das dagegen geschützt wurde. Der Sprach-Wähler kam am
**2026-08-17** daneben, acht Tage nach der 100·100·100-Messung, und brachte den
Sprung zurück, **eine Stelle weiter rechts**. *Ein Wächter am Einzelfall ist
morgen am Nachbarn blind.*

| | vorher | nachher (3 Läufe Handy) |
|---|---|---|
| Leistung | 99 | **100 · 100 · 100** |
| CLS | 0,062 | **0 · 0 · 0** (Computer ebenfalls 0) |
| TBT | 80 ms | 20 · 40 · 40 ms |

**Die „Gute Praxis 96" ist dagegen KEIN Befund über die Seite, sondern ein
Artefakt der Messumgebung.** Der einzige Abzug ist `errors-in-console`, und die
Fehler sind durchweg `ERR_TUNNEL_CONNECTION_FAILED` für die App-Symbole von
`github.io`. **Nachgemessen statt angenommen:** ein `curl` auf genau eine dieser
Adressen antwortet aus diesem Behälter mit **HTTP 000** (curl-Fehler 56).

⚠ **Der Eintrag vom 2026-09-08 hat diese 96 notiert, als wäre sie eine Aussage
über die Seite.** Sie ist eine über die Leitung. Damit war die Gegenüberstellung
„100·100·100 gegen 99·100·96·100" in **einer** Spalte gar kein Vergleich.
**Eine Zahl trägt ihre Messbedingung mit, oder sie trägt gar nichts.**

### Was offen ist

- **Klaus' Browser-Sichttest für alles davon.** Er ist nicht ersetzbar. Und die
  Register-Zahlen der sechs Knoten bewegen sich erst nach dem Neu-Signieren.
- **`Tomys-Hub/tests/smoke-spore-download.cjs` ist rot** — auf `origin/main`
  ebenso, also nicht von dieser Arbeit. Sie wartet auf `[data-ty-spore-tool]`,
  und **diese Marke gibt es im ganzen Depot nicht** (`grep`: null Treffer
  außerhalb der Probe). Ursache nicht weiter untersucht; benannt statt umfahren.
- **`Tomys-Hub/tests/smoke-verbund.cjs` ist rot** aus demselben Grund wie die
  96 oben: der Ausgangs-Proxy sperrt `wss://relay.family-projekt.de`. 15/16 grün.
- **Acht Draft-PRs** stehen offen und warten auf Klaus.

### Und der PULS wurde ZWEIMAL ausgelagert

Nach dem Eintrag oben stand die Datei bei **2.991 von 3.000** — neun Zeilen Luft
sind keine Luft, die nächste Sitzung stünde sofort wieder an der Grenze. Der
Eintrag vom 2026-09-09 (57 Zeilen) ist deshalb in einem zweiten Griff nach
[`sessions/archiv/2026-09-11_puls-auslagerung-2.md`](sessions/archiv/2026-09-11_puls-auslagerung-2.md)
gegangen. Gemessen: **3.000 → 2.839 → 2.991 (nach dem Eintrag) → 2.944**.
Beide Auslagerungen sind mit `diff` als byte-gleich belegt.

**Proben:** Sage **100/100 grün** · Toolpoint **784 grün, 0 ROT, 0 nicht
abgeschlossen** · Alis 54/54 · Perfect Skin Fashion 64 · Muster Werbetechnik 82
· Perfect Skin Beauty 25 · Private Brain grün · Tomys alle außer den zwei oben.

**Übergabeprotokoll:** [`sessions/archiv/2026-09-11_frist-sprung-und-die-fuenf.md`](sessions/archiv/2026-09-11_frist-sprung-und-die-fuenf.md)

---
