# Übergabeprotokoll 2026-08-19 — Warten auf die Bedingung, nicht auf die Uhr

**Rolle:** Pflege-Sitzung (Status-Prüfung Kimboard + Sage-Protokol).
**Zweig:** `claude/kimboard-relais-status-x77me9`.
**Basis:** Sage `fa85267` · Kimboard `4654d2f`, beide frisch von `origin/main`.

## Auftrag und Ausgangslage

Der Brief (`Kimboard/docs/BRIEF_NAECHSTE_SITZUNG.md`) sagte: das Vorhaben
„Löschen" ist geschlossen und am echten Relais belegt, **es drängt nichts**.
Zwei offene Punkte, beide bewusst wartend. Er schloss mit dem Satz: *„wenn
nichts Dringendes offen ist: das ehrlich sagen, statt Arbeit zu erfinden."*

Das war richtig — und die Arbeit dieser Sitzung ist trotzdem nicht erfunden.
Sie kam aus dem Nachprüfen selbst.

## Was das Nachprüfen ergab

**Erster Befund: zwei Proben waren gar nicht gelaufen.** `run_alle.mjs` meldete
78 grün, 0 rot, **2 nicht lauffähig** — `pinnwand/_smoke_melden` und
`_smoke_mikrofon` fehlte `playwright-core`. Ausgerechnet der Melde-Weg der
Pinnwand vom Vortag war damit **ungeprüft, nicht grün**. Der Läufer sagt das
ausdrücklich; wer nur auf „0 rot" sieht, überliest es.

Behoben mit `npm install --no-save playwright-core` — bewusst `--no-save`, weil
`package.json` gepinnt und von `smoke_package_json.mjs` bewacht ist.
`git status` blieb leer.

**Zweiter Befund: `smoke_bau05_nostr.mjs` fiel um** — genau **5 rote
Prüfungen**. Das ist Probe 2 vollständig; alle fünf hängen an derselben
Antwort.

## Die Diagnose, und warum sie ohne Reproduktion trägt

Reproduzieren ließ es sich **nicht**:

| Versuch | Ergebnis |
|---|---|
| einzeln, 25 Läufe | 25 × grün |
| einzeln unter 8 CPU-Brennern auf 4 Kernen | 3 × grün |
| einzeln neben laufendem Chromium-Lauf, 12 Läufe | 12 × grün |
| voller Läufer, 3 weitere Male | 3 × grün |

**Nicht reproduzierbar ist kein Freispruch.** Die Ursache steht im Code: das
Mock-Relais stellt im Microtask zu, aber der Empfänger rechnet danach **echte
Ed25519-Krypto** (Signatur prüfen, Antwort signieren). Darauf standen fünf feste
`sleep(50)`. Und die Zahl passt exakt: 5 rote Prüfungen = Probe 2, die
vollständig an `replyP2` hängt.

Ein solches Rot als „Flake" abzutun kostet mehr als es spart — nicht weil die
Probe falsch liegt, sondern weil man sich abgewöhnt, ihr zu glauben.

## Der eigentliche Fund: die andere Richtung

Beim Aufschreiben zeigte sich, dass die fünf Wartestellen **zwei verschiedene
Dinge** sind, die Gegenteiliges brauchen:

| Sorte | Wartet darauf, dass … | Zu kurze Frist ergibt |
|---|---|---|
| **A** | etwas **kommt** (die Antwort) | falsches **ROT** — laut, irreführend |
| **B** | etwas **ausbleibt** (keine zweite Antwort) | falsches **GRÜN** — still |

Sorte B war die gefährlichere Hälfte und niemandem aufgefallen: käme die
verbotene zweite Antwort nach 60 ms, sähe die Probe sie mit ihrer 50-ms-Frist
nicht und meldete „genau EINE Antwort". **Der Replay-Schutz wäre kaputt und
niemand wüsste es.**

## Was gebaut wurde

- **Sorte A → `warteBis(bedingung)`**: kehrt zurück, sobald die Bedingung
  erfüllt ist; die Frist (5 s) ist nur Obergrenze und wird im Normalfall nie
  erreicht. Schneller **und** sicherer als eine feste Zahl.
- **Sorte B → `RUHE_MS = 400`**: hier hilft keine Bedingung, es muss eine Frist
  verstreichen — aber eine, die etwas taugt.
- **Probe 4 bekam beides**: erst auf die erste Antwort warten (A), dann den
  Replay senden, dann die Ruhe-Frist (B). Vorher prüfte der Replay gegen einen
  Zustand, der noch gar nicht stand.
- **Dieselbe Kur in `smoke_query_ueber_relais.mjs`** (80/60 ms). Sie ist die
  Schwester-Probe, strukturell identisch — dort war es bisher nur Glück. Den
  Befund halb zu beheben hieße, die Hälfte für erledigt zu erklären.

## Die Gegenprobe — `tests/gegenprobe_bau05_warten.mjs`

Ein Fix, dessen Wirkung man nicht zeigen kann, ist eine Meinung. **8 Fälle über
beide Dateien**, jeder mit erwartetem Ausgang:

| Fall | heutige Fassung | alte feste Frist |
|---|---|---|
| Antwort kommt erst nach 120 ms | grün ✓ | **ROT** ✓ (falsches Rot belegt) |
| verbotene zweite Antwort nach 150 ms | **ROT** ✓ (gefangen) | grün ✓ (**blind** belegt) |

Sie arbeitet an einer **Wegwerf-Kopie** (`_wegwerf_*.mjs`, im `finally`
gelöscht, vom Läufer nicht eingesammelt). Die echte Probe wird nie angefasst —
damit greift die Falle „während einer Gegenprobe wird nichts committet" hier
gar nicht erst.

## Verifikation

| Was | Ergebnis |
|---|---|
| `node tests/run_alle.mjs` (Sage) | **80 grün, 0 rot, 0 nicht lauffähig** |
| `node tests/gegenprobe_bau05_warten.mjs` | **8 wie erwartet, 0 nicht** |
| `node tests/alle.mjs` (Kimboard) | **alle 31 Prüfungen grün** |
| `git status` nach den Läufen | sauber, `package.json` unberührt |

**Ehrliche Grenze:** das ist der Headless-Beweis. Klaus' Browser-Sichttest wird
davon nicht ersetzt — hier war allerdings auch nichts an der App zu sehen, die
Änderung betrifft ausschließlich Proben.

## Bewusst NICHT angefasst

`smoke_bau23_rendezvous_ui.mjs` trägt rund zwanzig `sleep(5…20)`. Die warten
auf **DOM-Rendering im selben Prozess** — keine Krypto, keine Antwortkette,
anderer Fall. Ein breiter Umbau grüner Wächter ohne Anlass birgt mehr Risiko als
Nutzen. Benannt statt stillschweigend umgangen (Tafel-Evolutions-Klausel).

## Nächster sinnvoller Schritt

Nichts Dringendes. Die zwei Punkte aus dem Brief stehen unverändert und eilen
beide nicht. Wer als Nächstes hier arbeitet, ruft **einmal**
`node tests/run_alle.mjs` auf und liest die Zeile „nicht lauffähig" mit — sie
ist kein Nebensatz, sondern die Auskunft darüber, was **gar nicht** gemessen
wurde.

**Stichtag:** die Liste im Kimboard-Brief greift ab **2026-09-02**. Heute ist
der 2026-08-19 — noch nicht fällig.
