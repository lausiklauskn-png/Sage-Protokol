# PULS-Auslagerung 2026-09-14

Ausgelagert aus [`docs/PULS.md`](../../PULS.md), weil die Datei nach dem Eintrag
vom 2026-09-14 bei **3.051 von 3.000** Zeilen stand. **Ausgelagert, nicht
gekürzt** — der Wortlaut steht hier byte-gleich, wie er in PULS.md stand.

Ein Eintrag, 90 Zeilen. Gemessen: 3.051 → 2.961 plus Zeiger.

---

## Stand 2026-09-10 (Haupt-Sitzung) · ✅ KIM HUB COMPANY IST NEU SIGNIERT — 0.910528, DER HÖCHSTE WERT IM NETZ

**Was getan.**

- **Klaus hat um 01:25 UTC neu signiert**, mit der überarbeiteten
  Bedeutungs-Beschreibung. Headless reziprok verifiziert mit Sages
  Modul-02-Pfad (deep-kanonisches JSON): **VALID**, `id ==
  base64url(SHA256(rawPub))`, kein `d` im JWK, `key_ops` nur `["verify"]`,
  echter `domainVector` mit **L2 = 1.000000356** und 384 Zahlen, **20**
  Satz-Schnipsel (vorher 5), kein `_demo`. Die **nodeId ist unverändert** — ein
  Neu-Signieren wechselt die Identität nicht.

- **Der Cosinus ist gerechnet, nicht erwartet.**

  | | 2026-09-09 | 2026-09-10 | |
  |---|---|---|---|
  | Sage | 0.848945 | **0.910528** | +0.061583 |
  | PWA Toolpoint | 0.823468 | **0.841326** | +0.017858 |
  | Auslieferungsprüfer | 0.853724 | **0.818751** | **−0.034973** |

  **0.910528 ist der höchste Wert im Netz**, vor WorkFloh 0.906269 und
  SB·KIMTool·Point 0.899516. Der Knoten steigt damit von Rang 11 auf Rang 1 von
  20. ⚠ **Der Prüfer ist weggerückt, und das steht dabei:** der neue Text redet
  mehr vom Protokoll und von der Forschung und weniger vom Werkzeug-Alltag —
  dieselbe Ursache von zwei Seiten. Alte gegen neue Fassung desselben Knotens:
  **0.883004**.

- **Der signierte Text ist wortgleich der der App**, gemessen gegen **beide**
  Wege zur Spore (`sbkim/rendezvous-init.js` und `sbkim/siegel-inhalt.js`).
  2602 Zeichen, 36 Stichworte, Name · Zweck · Forschung · Matching alle vier
  drin.

- **Die Spore liegt jetzt im Depot von kim-hub-company** (PR #57), und der
  Wächter dort misst die **Zusicherung statt der Zeile**. Bis dahin verbot er
  jede Datei namens `spore.json` und maß damit den **Dateinamen** — ein Wächter
  am Namen schneidet an beiden Kanten falsch: er warf Klaus' **echte** Spore
  hinaus, während Sages `status.json` für diesen Knoten die ganze Zeit
  `…/kim-hub-company/sbkim/spore.json` nannte, **eine Adresse, die nichts
  auslieferte** — und ließ eine **erfundene** durch, sobald sie anders hieß.
  Gemessen wird jetzt: Signatur gegen den eigenen Schlüssel · nur der
  öffentliche Teil · genau **dieser** Knoten (genagelte Kennung) · die
  Beschreibung, die die App **heute** mitbringt. Das ist die Rückkehr zu Sages
  eigener Tafel — *„Ablage und Beleg, kein Sender"*; zwölf Geschwister-Knoten
  legen sie so ab, Kim Hub Company war die Ausnahme.

- **Neun Gegenprobe-Fälle, die NEU UNTERSCHREIBEN statt zu verbiegen.** Jedes
  Feld einer Spore steht **unter** der Signatur; ein Eingriff von Hand bräche
  immer zuerst den Signatur-Wächter, und der Fall wäre „gefangen", ohne den
  gemeinten Wächter je erreicht zu haben. `tests/gegenprobe-spore.mjs`
  unterschreibt mit einem frischen Paar, das nur im Arbeitsspeicher lebt.

**Was dabei schiefging** — alle drei fielen erst beim **Nachstellen von Hand**
auf, der Lauf hätte sie als „gefangen" gemeldet:

1. **Der genagelte Kennungs-Wächter feuerte bei JEDER Fälschung mit.** Ein
   frisches Schlüsselpaar hat zwangsläufig eine andere Kennung — drei Fälle
   erzeugten zwei rote Zeilen, eine davon eine Wirkung des Werkzeugs statt der
   Sabotage. Der Fälscher zieht den Nagel jetzt nach.
2. **Der Platte-vs-Depot-Wächter hing an der ANZAHL statt an der DATEI** und
   fiel bei einer zweiten Spore mit um. Und die Tiefenprüfung hing an
   `sporen.length === 1` — eine verirrte zweite Datei hätte damit **sechs**
   Wächter stillgelegt.
3. **`--nagel-nachziehen` vor dem Dateinamen** machte den Schalter zum
   Dateinamen: das Werkzeug brach ab, drei Fälle sabotierten nichts mehr und
   sahen aus wie blinde Wächter.

**Was offen ist.**

- **Der Live-Handshake** für alle drei neuen Knoten — den sieht nur Klaus'
  Browser.
- **Ob Modul 03 bei 512 Tokens schneidet.** Nicht gemessen: das Modell läuft im
  Browser, ein Tokenizer liegt hier nicht vor (huggingface gesperrt), und eine
  geschätzte Token-Zahl klingt genau wie eine gemessene. Praktisch entschärft —
  der Wert ist mit dem längeren Text **gestiegen**. Klaus sieht es beim
  Signieren in der Eruda-Konsole; kommt die Zeile, wird von **hinten** gekürzt.
- **Der Kanon-Vorschlag `sporePath`** (für Knoten, deren Endpunkt eine Seite
  statt eines Verzeichnisses ist) — Klaus entscheidet.
- **Die 45 abweichenden Modul-Kopien** netzweit.
- **PWA-Toolpoint:** der volle Gegenprobe-Lauf in einer Kopie · ein
  `schedule`-Auslöser für `statische-liste.yml` (sonst wird `main` nach
  Kalender rot) · eine eigene Frist am Kindprozess in `tests/smoke.mjs` · und
  warum die Lighthouse-Zahlen der Startseite gefallen sind.

**Nächster sinnvoller Schritt.** Klaus' Sichttest: die drei Knoten im
Rendezvous-Raum wirklich nebeneinander sehen. Die Identitäten sind bewiesen, die
Vektoren gerechnet — was fehlt, ist der Live-Handshake, und den kann keine
Sitzung ersetzen.

---
