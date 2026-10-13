# PULS-Auslagerung 2026-10-13 — „Die Demo spielte nichts ab“

**Ausgelagert am 2026-10-13**, weil `docs/PULS.md` über der 3000-Zeilen-Grenze stand
(3011 Zeilen vor dem Eintrag „Eigenes Netz Schritt 1“). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-09-17 · Die Demo spielte nichts ab — die Aufzeichnung lag nicht neben der Kopie

**Klaus auf der Demo-Seite:** *„Mitschnitt abspielen … das läuft nicht. Das
sollte aber laufen, wenn jemand eine Demo betrachtet."*

`sbkim-demo/index.html` bindet die Karte als `<iframe src="../mycel-karte/">`
ein — also **Sages eigene Kopie**, nicht das eigenständige Repo. Der Knopf holt
`mitschnitt/mycel-lauf-2026-09-10.json` **relativ zu der Seite, in der er
steht**. In `mycel-karte/` lag nur `index.html`.

**Gemessen im echten Browser (playwright-core, Chromium), vor der Reparatur:**
Abruf **404** auf `/mycel-karte/mitschnitt/mycel-lauf-2026-09-10.json` ·
Protokoll „die hinterlegte Aufzeichnung ist nicht erreichbar" · Transportreihe
versteckt · Stand „—". **Danach:** **200** · „▶ Wiedergabe gestartet · 191
Ereignisse" · Stand `Ereignis 4 / 191` · Band nennt 5 Aufzeichnungen. Beides
auch über die Demo-Seite im Rahmen gemessen, nicht nur an der Karte allein.

⚠ **UND DER WÄCHTER WAR DABEI GRÜN.** `smoke_mycelkarte_kopie.mjs` fragte nach
`id="btnReplay"` und `function spieleMitschnitt(` — also danach, ob der **Code**
dasteht. Ob der Knopf seine **Datei** findet, hat nie jemand gefragt. *Ein
Wächter auf „der Code ist da" misst nicht, ob er etwas vorfindet.*

⚠ **UND DER ABLEITER KANNTE NUR EINE DATEI.** `tools/mycelkarte-uebernehmen.mjs`
holte `index.html` und sonst nichts; wer eine Funktion baut, die eine **Datei**
braucht, hätte sie von Hand nachtragen müssen. Dasselbe „eine Regel, an die man
sich erinnern muss, ist keine", aus dem dieses Werkzeug entstanden ist — nur
eine Ebene weiter. Der Pfad kommt jetzt aus `REPLAY_DATEI` der Quelle, statt
hier abgeschrieben zu werden: eine zweite Liste liefe auseinander, und die
vergessene Datei wäre wieder genau die, an die niemand denkt.

**Vier neue Zusicherungen**, jede mit Gegenprobe-Fall: die Datei liegt neben der
Kopie · sie ist lesbar · es steht wirklich Relais-Verkehr darin (gefiltert mit
`REPLAY_ARTEN` **der Kopie**, nicht mit einer abgeschriebenen Liste) · und der
Erklärtext der Seite stimmt mit der Datei überein (191 Ereignisse, fünf
Aufzeichnungen). Die Gegenprobe kann seitdem auch die Aufzeichnung selbst
verbiegen und ganz wegnehmen — ein Fall, der nur den Quelltext anfasst, ist für
einen fehlenden **Datei**-Nachbarn blind.

**Geprüft:** `node tests/run_alle.mjs` → **107 grün · 0 rot · 0 nicht
lauffähig** · `gegenprobe_mycelkarte_kopie` **18 gefangen · 0 durchgerutscht ·
0 aus falschem Grund · 0 tote Anker**. Beide Rückgabewerte direkt gelesen.

**Offen:** ob die eingebettete Karte auf der Demo-Seite von selbst zu spielen
anfangen soll, statt auf den Knopf zu warten. Klaus' Satz „Demo ist Demo" lässt
beides zu; nicht entschieden und nicht gebaut.

