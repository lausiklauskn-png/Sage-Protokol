# Abschlussprotokoll 2026-09-10 — neu signiert, und ein Wächter, der den Dateinamen maß

**Sitzungs-Rolle:** Haupt-Sitzung · **Zweig:** `claude/zwei-knoten-sporen-abschluss-3um9e8`

Fortsetzung von [`2026-09-09_zwei-knoten-sporen-abschluss.md`](2026-09-09_zwei-knoten-sporen-abschluss.md).
Dort endete die Arbeit mit zwei Fragen an Klaus; dieses Protokoll beantwortet die
erste mit einer Messung.

## Stundennachweis — gemessen, nicht geschätzt

| | |
|---|---|
| Klaus' Spore | erzeugt 2026-09-10 01:25:58 UTC (aus `createdAt`) |
| erster Commit dieser Sitzung | 2026-09-10 01:42:04 +0000 (kim-hub-company `2f348c6`) |
| letzter Commit | dieses Protokoll |

⚠ **Was diese Zahl NICHT ist.** Sie ist nicht Klaus' Arbeitszeit. Die Zeit vor
dem ersten Commit — Prüfen, Rechnen, das Nachstellen der Gegenprobe-Fälle von
Hand — hinterlässt keine Spur und ist deshalb nicht mitgezählt. Wer mehr
behauptet, schätzt.

## 1 · Die Spore ist geprüft

| | |
|---|---|
| Signatur (Ed25519, tief-kanonisch) | **gültig** |
| `id == base64url(SHA256(rawPub))` | ja, **unverändert** gegenüber dem Vortag |
| privater Teil | kein `d` im JWK · `key_ops` nur `["verify"]` |
| `domainVector` | 384 Zahlen · **L2 = 1.000000356** · kein `_demo` |
| Satz-Schnipsel | **20** (Vortag: 5), jeder 384-dimensional |
| Beschreibung | 2602 Zeichen · 36 Stichworte |
| wortgleich mit der App | ja, gegen **beide** Wege zur Spore geprüft |
| abgelegt | byte-identisch zur Datei aus dem Browser (`md5 e0512cd8…`) |

## 2 · Der Cosinus ist gerechnet, nicht erwartet

Das Protokoll vom Vortag sagte voraus: *„die nodeId bleibt … der `domainVector`
wird neu … was sie hier bewirkt, wird gerechnet, wenn die neue Spore da ist."*

| Gegenstelle | 2026-09-09 | 2026-09-10 | |
|---|---|---|---|
| **Sage** | 0.848945 | **0.910528** | +0.061583 |
| PWA Toolpoint | 0.823468 | **0.841326** | +0.017858 |
| Auslieferungsprüfer | 0.853724 | **0.818751** | **−0.034973** |

**0.910528 ist der höchste Wert im Netz**, vor WorkFloh 0.906269 und
SB·KIMTool·Point 0.899516 — Rang 11 von 20 auf Rang 1 von 20.

⚠ **Der Prüfer ist weggerückt, und das steht dabei.** Der neue Text redet mehr
vom Protokoll und von der Forschung und weniger vom Werkzeug-Alltag; dass der
Knoten an Sage heranrückt und vom Prüfer weg, ist dieselbe Ursache von zwei
Seiten. Alte gegen neue Fassung desselben Knotens: **0.883004** — die
Umarbeitung hat ihn verschoben, nicht nur ausgeschmückt.

Der Sprung entspricht der Größenordnung, die dieselbe Umarbeitung am 2026-07-25
bei WorkFloh gebracht hat (0.7824 → 0.906269).

## 3 · Ein Wächter, der den Dateinamen maß

In `kim-hub-company/CLAUDE.md` stand **„Im Depot liegt KEINE `spore.json`, und
das bleibt so"**, und ein Wächter in `tests/smoke_knoten.mjs` bestand darauf.

Der **Grund** dahinter war richtig und gilt weiter: eine **erfundene** Spore ist
schlimmer als keine — sie beantwortet „hat dieser Knoten eine Kennung?" mit einem
Ja, das niemand geprüft hat. Gemessen hat er davon aber nur den **Dateinamen**,
und ein Wächter am Namen schneidet an beiden Kanten falsch:

- Er wirft die **echte**, signierte Spore hinaus. Sages `status.json` nannte für
  diesen Knoten die ganze Zeit `…/kim-hub-company/sbkim/spore.json` — **eine
  Adresse, die nichts auslieferte.** Sages eigene Tafel sagt ausdrücklich: die
  Spore im Netz ist nicht die Spore im Depot, die Datei ist *„Ablage und Beleg,
  kein Sender"*. Zwölf Geschwister-Knoten legen sie so ab; dieser war die
  Ausnahme.
- Er lässt eine **erfundene** durch, sobald sie anders heißt.

Gemessen wird jetzt die **Zusicherung statt der Zeile**: verifiziert sich die
abgelegte Spore gegen ihren eigenen Schlüssel · trägt sie nur den öffentlichen
Teil · kündigt sie **diesen** Knoten an · mit der Beschreibung, die die App
**heute** mitbringt. Liegt keine da, ist das weiterhin in Ordnung.

⚠ **Ohne einen Nagel fängt kein Wächter eine Fälschung.** Wer ein frisches
Schlüsselpaar erzeugt und damit unterschreibt, bekommt eine Spore, die in sich
tadellos ist und nur einen **anderen** Knoten ankündigt — genau die Sorge, aus
der die alte Regel entstand. Die Kennung ist deshalb genagelt. **Wer sie
wechselt, zieht sie an zwei Stellen nach:** `Sage-Protokol/status.json` und
`kim-hub-company/tests/smoke_knoten.mjs`. Der Preis ist beabsichtigt — ein
Identitäts-Wechsel soll eine Spur im Verlauf hinterlassen.

## 4 · Neun Gegenproben, die neu unterschreiben statt zu verbiegen

Jedes Feld einer Spore steht **unter** der Signatur. Ein Eingriff von Hand
bräche also immer zuerst den Signatur-Wächter, und der Fall wäre „gefangen",
ohne den gemeinten Wächter je erreicht zu haben — dieselbe Falle, die im Kopf
von `tests/gegenprobe.sh` schon an einer anderen Tür steht.

`tests/gegenprobe-spore.mjs` unterschreibt deshalb mit einem frischen Paar, das
nur im Arbeitsspeicher lebt und die Platte nie berührt. Danach ist die Spore in
sich tadellos, und **genau ein** Wächter fällt um.

| Fall | rote Zeile |
|---|---|
| eine ZWEITE Spore unter anderem Namen | höchstens EINE abgelegte Spore |
| nur auf der Platte, nicht im Depot | … und wenn eine daliegt, führt git sie auch |
| tadellos signiert, FREMDE Kennung | … und es ist die Kennung, die im Netz für diesen Knoten steht |
| kündigt einen ANDEREN Knoten an | … und sie kündigt DIESEN Knoten an |
| Vektor ist keiner mehr | … und ihr Bedeutungs-Vektor ist echt |
| trägt den PRIVATEN Teil | … und sie trägt NUR den öffentlichen Teil |
| sagt etwas anderes als die App | … mit genau der Bedeutungs-Beschreibung |
| Signatur verdorben | die abgelegte Spore ist wirklich signiert |
| die App zieht weiter, die Spore bleibt | … mit genau der Bedeutungs-Beschreibung |

## 5 · Was dabei schiefging

**Alle drei fielen erst beim Nachstellen von Hand auf.** Der Lauf hätte sie als
„gefangen" gemeldet — die Zahl 40/0 stand schon da, bevor einer davon behoben
war.

1. **Der genagelte Kennungs-Wächter feuerte bei JEDER Fälschung mit.** Ein
   frisches Schlüsselpaar hat zwangsläufig eine andere Kennung; drei Fälle
   erzeugten zwei rote Zeilen, und eine davon war eine Wirkung des **Werkzeugs**
   statt der Sabotage. Der Fälscher zieht den Nagel jetzt nach — er stellt damit
   einen Knoten nach, der seine Kennung legitim gewechselt und den Nagel
   ordentlich nachgezogen hat und **dabei etwas anderes falsch macht**.
2. **Ein Wächter hing an der ANZAHL statt an der DATEI.** „Wenn eine daliegt,
   führt git sie auch" prüfte `sporen.length === 1` und fiel deshalb bei einer
   zweiten Spore mit um. Schlimmer war die Bedingung darüber: die ganze
   Tiefenprüfung hing an derselben Zahl — **eine verirrte zweite Datei hätte
   sechs Wächter stillgelegt**, während die Zeile darüber rot leuchtete und
   niemand mehr wusste, ob die echte Spore noch trägt.
3. **`--nagel-nachziehen` stand VOR dem Dateinamen.** `argv.slice(2)` ohne
   Filter machte den Schalter zum Dateinamen; das Werkzeug brach ab, drei Fälle
   sabotierten nichts mehr und sahen dabei aus wie blinde Wächter.

**Die Lehre ist keine neue, sondern dieselbe zum wiederholten Mal:** eine
Prüfung, die dir recht gibt, ist der Ort, an dem du am genauesten hinsehen
musst. Gefunden hat es nicht das Nachdenken, sondern das Nachstellen.

## 6 · Was gemessen wurde und was nicht

| | |
|---|---|
| `npm test` (kim-hub-company) | **68 grün · 0 ROT · 0 nicht lauffähig** |
| `npm run gegenprobe` | **40 gefangen · 0 durchgerutscht** |
| `NUR_ANKER=1` | **35 Anker geprüft, 0 tot** |
| `npm run drift` | 27 byte-1:1, 0 zu klären |
| `npm run sbkim-drift` | 13 byte-1:1 aus Sage, 0 zu klären |

**Kein `CACHE_VERSION`-Bump**, und das ist gemessen statt vergessen: `sw.js`
holt für `.json` **Netz zuerst** und greift auf den Vorrat nur offline zurück —
eine neu signierte Spore kommt also sofort an. Keine `SCHALE`-Datei hat sich
bewegt.

⚠ **NICHT GEMESSEN: ob Modul 03 die 2602 Zeichen bei `EMBEDDING_MAX_TOKENS =
512` abschneidet.** Das Modell läuft im Browser, ein Tokenizer liegt in dieser
Umgebung nicht vor (huggingface ist gesperrt); eine geschätzte Token-Zahl klingt
genau wie eine gemessene, deshalb steht hier keine. Praktisch ist die Frage
entschärft — der Wert ist mit dem **längeren** Text gestiegen, nicht gefallen.
Sieht Klaus beim Signieren in der Eruda-Konsole `MODUL 03 EMBEDDING: Eingabe >
512 Tokens, abgeschnitten`, wird von **hinten** gekürzt: der Baukasten-Absatz
zuerst.

⚠ **NICHT GEMESSEN: der Live-Handshake.** Ob die drei neuen Knoten im
Rendezvous-Raum wirklich nebeneinander auftauchen und sich unterscheiden lassen,
sieht nur ein Browser. Klaus' Sichttest ist nicht ersetzbar.

## 7 · Was offen bleibt

- Der **Live-Handshake** für alle drei neuen Knoten.
- Der Kanon-Vorschlag **`sporePath`** für Knoten, deren Endpunkt eine Seite
  statt eines Verzeichnisses ist — Klaus entscheidet.
- Die **45 abweichenden Modul-Kopien** netzweit.
- **PWA-Toolpoint:** der volle Gegenprobe-Lauf in einer Kopie · ein
  `schedule`-Auslöser für `.github/workflows/statische-liste.yml` (sonst wird
  `main` nach Kalender rot) · eine eigene Frist am Kindprozess in
  `tests/smoke.mjs` · und warum die Lighthouse-Zahlen der Startseite gefallen
  sind (99·100·96·100, CLS 0,062 gegen dokumentierte 100·100·100, CLS 0).
- `docs/PULS.md` steht bei **2787 Zeilen**. Die Grenze ist 3000 und wird
  **nicht** herabgesetzt; wer als Nächster hier einträgt, lagert vorher aus.

## 8 · Nebenbei erledigt

✅ **Die Sicherung der Kennung gibt es jetzt.** Das Protokoll vom Vortag
vermerkte, dass Klaus' Verbinden-Fenster für diesen Knoten **keine** meldete.
Am 2026-09-10 steht dort `sbkim-sicherung-kimhubcompany-2026-09-10.json`
(466 KB). Die Datei liegt bei ihm, nicht hier — das Fenster hält nur das Datum
fest.
