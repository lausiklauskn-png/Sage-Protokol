# PULS-Auslagerung vom 2026-09-14 (dritte)

Beim Eintrag zum netzweiten Rollout von Modul 23 UI stand `docs/PULS.md` bei
**2.990 von 3.000** Zeilen, der neue Eintrag misst **127**. Die Grenze wird
**nicht herabgesetzt** und der Wortlaut **nicht gekürzt** — die beiden ältesten
Einträge in voller Länge ziehen hierher um. Im PULS steht an ihrer Stelle ein
Zeiger, damit eine stille Lücke gar nicht erst entstehen kann.

---

## Stand 2026-09-10 (Haupt-Sitzung) · ✅ DRITTER MITSCHNITT — das Netz ist vollständig gemessen

**Was getan.** Klaus hat die vier Knoten geöffnet, die im zweiten Mitschnitt
gefehlt hatten. **Für alle 21 Gegenstellen liegen jetzt live gemessene Sporen
vor.** Sage tritt zum zweiten Mal mit `cos = 1.0` gegen die abgelegte Spore an —
der Maßstab hält. Beleg abgelegt unter
[`sbkim/mitschnitte/2026-09-10T1516_mycel-karte-analyse.json`](../sbkim/mitschnitte/2026-09-10T1516_mycel-karte-analyse.json).

**⚠ MEINE ERKLÄRUNG VON HEUTE NACHMITTAG IST WIDERLEGT.** Ich hatte als Kandidat
für den Vektor-Unterschied genannt, die Depot-Sporen stammten aus der
Neu-Signier-Welle und seien mit `tools/resign_spore_v02.mjs` in einer anderen
Umgebung gerechnet worden. **PWA Toolpoint widerlegt das:**

| | Depot | Raum |
|---|---|---|
| Kennung | `WJ14jzCKnqlz…` | `WJ14jzCKnqlz…` — **dieselbe** |
| signiert | 08:11:**25**.674Z | 08:11:**39**.000Z |
| Text · Stichworte | 283 Zeichen · 8 | **byte-gleich** |
| `cos(Depot, Raum)` | **0.992957** | |

Zwei Sporen, derselbe Schlüssel, derselbe Text, **vierzehn Sekunden**
auseinander — und ein anderer Vektor. Dieselbe App, derselbe Browser. Das
Embedding ist unter denselben Eingaben nicht deterministisch. **Die Ursache
bleibt ungemessen**; widerlegt ist nur die eine Vermutung, und sie wird nicht
durch die nächste plausible Geschichte ersetzt.

> Eine Vermutung, die man nicht als solche kennzeichnet, wird beim nächsten
> Lesen zum Befund. Diese war gekennzeichnet — deshalb ließ sie sich mit einer
> Messung wieder einkassieren.

**⚠ Mein Mixarium sagt im Raum etwas anderes an, als im Depot liegt:** **88
Zeichen** gegen **1476**. Wer dort neu signiert, bekommt den Zweizeiler — dieselbe
Vorrang-Falle, die Sage und Kim Hub Company heute abgestellt haben und die in
Mein-Mixarium **nicht** abgestellt ist.

**📏 Länge entscheidet nicht, der Inhalt tut es** — gemessen über alle 21:

| Knoten | Zeichen | gegen Sage | nennt SBKIM/Mycel? |
|---|---|---|---|
| Kim-Bell | **82** | **0.874864** | ja |
| SB-KIMTool-Point | **61** | **0.865795** | ja |
| Muster Werbetechnik | 421 | 0.793613 | nein |
| Perfect Skin Beauty | 265 | 0.783216 | nein |

Für die fünf Knoten unter dem Handshake-Boden ist der Hebel damit **nicht mehr
Text**, sondern der Satz, dass sie zum SBKIM-Mycel gehören. Klaus hat das am
selben Tag von sich aus benannt: *„dass sie im Sage Protokoll mit sind, das wird
nämlich bedeuten, dass sie leichter gefunden würden innerhalb des Mycels."*

**Was offen ist.** Der Grund, aus dem das Register noch nicht auf den
Raum-Maßstab umgestellt ist, ist **weggefallen** — er war „für vier Knoten liegt
kein Mitschnitt vor". Die Entscheidung liegt bei Klaus.

**Proben:** `npm test` → **99 grün, 0 rot, 0 nicht lauffähig**.

---

## Stand 2026-09-10 (Haupt-Sitzung) · ✅ ZWEITER MITSCHNITT — 18 KNOTEN LIVE GEMESSEN

**Was getan.** Klaus hat einen zweiten Mitschnitt der Mycel-Karte geschickt
(14:02–14:33, 154 Ereignisse) und dabei **zwölf Apps nacheinander geöffnet und neu
signiert**. Damit liegen erstmals **18 live gemessene Sporen** nebeneinander statt
einer. Abgelegt als
[`sbkim/mitschnitte/2026-09-10T1433_mycel-karte-analyse.json`](../sbkim/mitschnitte/2026-09-10T1433_mycel-karte-analyse.json).

**Alle 18 verifizieren** — VALID, `id == base64url(SHA256(rawPub))`, kein `d`,
`key_ops` nur `["verify"]`, L2 = 1.

**✅ Der Vorbehalt über Sage ist eingelöst.** Sages Raum-Spore und `sbkim/spore.json`
sind **dieselbe**: gleiche Kennung, gleicher Zeitstempel, `domainVector` **byte-gleich**,
cos = 1.0. Der Maßstab, gegen den alle zwanzig `matchScore` gerechnet sind, ist damit
gemessen und nicht mehr nur behauptet.

**⚠ Dreizehn von fünfzehn Gegenstellen trugen im Raum eine ANDERE Kennung** — der
Stufe-0e-Befund vom 2026-07-29, im großen Maßstab. Kein Fehler der Apps: der
Browser-Speicher einer nur im Tab geöffneten Seite ist „best effort". Die
`nodeId`-Spalte im Register bleibt die **committete** Identität.

**⚠ BEFUND OHNE URSACHE: derselbe Text ergibt nicht immer denselben Vektor.** Bei
fünf Knoten weicht `cos(Depot, Raum)` ab, obwohl `domainDescription`,
`domainKeywords`, `domain` und `embeddingModel` **byte-gleich** sind — Alis Moderaum
0.995264 · Jasons-Tresor 0.994307 · Mein-Tresor 0.990437 · Kimseek 0.989639 ·
Kimboard 0.987958. Sieben weitere kommen auf exakt **1.000000**.

Bei Kimseek weichen **alle 384 Dimensionen** ab (größte Einzelabweichung 0.024),
beide Vektoren sind sauber normiert. **Und es ist je App stabil:** der Mitschnitt vom
2026-07-29 nennt für Kimboard 0.9880 und für Family Projekt 1.0000 — sechs Wochen und
zwei Schlüsselwechsel später stehen dort 0.987958 und 1.000000.

Ein Kandidat ist, dass die Depot-Sporen der betroffenen Knoten aus der
Neu-Signier-Welle vom 18.–19.07. stammen und mit `tools/resign_spore_v02.mjs` statt in
der App gerechnet wurden. **Das ist eine Vermutung, kein Befund.**

**Neu: `tests/smoke_mitschnitt.mjs`** (10 Prüfungen) + Gegenprobe (8 Fälle). Sie
rechnet den Satz „Sage im Raum IST Sage im Depot" bei jedem Lauf nach — ein gemessener
Satz, den keine Probe nachrechnet, ist spätestens beim nächsten Signieren wieder eine
Behauptung. Und sie prüft das Belegmaterial selbst: jede Spore darin verifiziert, jede
Kennung ist der Hash ihres Schlüssels, **kein privater Schlüsselteil**.

**Drei eigene Fehler, alle von der Handprobe gefunden:**

| Was | Warum es nichts maß |
|---|---|
| „der neueste Mitschnitt" wurde am **Dateinamen** erkannt | `T` (0x54) sortiert vor `_` (0x5F) — die Probe hielt den zwei Stunden älteren für den neueren und wurde rot **aus dem falschen Grund**. Gefragt wird jetzt das Feld `beendet` in der Datei |
| der Privatteil-Fall hängte `d` an und unterschrieb **danach** neu | das frische Paar ersetzte den Schlüssel samt `d`. Umgeworfen wurde der Kennungs-Wächter; der Privatteil-Wächter kam **nie dran** und hätte blind sein können |
| drei Fälle trafen Sages eigene Spore | ein Eingriff daran wirft die drei Sage-Wächter mit um — der Fall beweist dann über den gemeinten weniger, als seine rote Zeile verspricht |

**Was offen ist — und Klaus vorgelegt.** Das Register ist **nicht** auf den
Raum-Maßstab umgestellt. Vier Knoten waren nicht im Raum (**Rezeptbuch** 0.874048 ·
**Mixarium** 0.817718 · **Muttis-Rezeptbuch** 0.870249 · **PWA Toolpoint** 0.811202),
und eine halb umgestellte Tabelle sähe einheitlich aus, ohne es zu sein.

**Woran es nicht hängt:** **kein einziger Knoten wechselt die Seite des
Handshake-Bodens** 0.80 — für alle 17 nachgerechnet. Größte Unterschiede:
BookLedgerPro −0.028687, Auslieferungsprüfer +0.028407, Kimboard +0.028326,
SB-KIMTool-Point −0.027231; sieben sind auf sechs Stellen identisch. Private Brain
liegt mit 0.800773 nur noch **acht Zehntausendstel** über dem Boden.

**Fünf sehr dünne Beschreibungen** sind dabei sichtbar geworden: SB-KIMTool-Point
**61 Zeichen**, Kim-Bell 82, BookLedgerPro 83, Private Brain 171, Kimboard 238 — zum
Vergleich Sage 3028. Bei allen fünf ist die eigene Beschreibung der nächste Hebel.

**Proben:** `npm test` → **99 grün, 0 rot, 0 nicht lauffähig**.
Gegenprobe → **8 gefangen, 0 durchgerutscht**.

---


---

## Stand 2026-09-10 (Haupt-Sitzung) · ✅ DAS REGISTER MISST JETZT GEGEN DEN RAUM

**Was getan.** Klaus: *„bevor du den Register auf den neuen Maßstab umstellst,
prüfe bitte die Analyse."* Geprüft, dann umgestellt — in dieser Reihenfolge.

**PWA Toolpoint ist von 0.808113 auf 0.917550 gesprungen**, nachdem Klaus mit der
neuen Beschreibung neu signiert hat. Geprüft wurde:

| | Ergebnis |
|---|---|
| Signatur beider Sporen | **VALID**, `id == SHA256(pub)`, kein `d`, L2 = 1 |
| Kennung | `WJ14jzCKnqlz…` — **dieselbe**, die Identität hat den Wechsel überlebt |
| Text im Raum ⟷ Depot | **byte-gleich** (2585 Zeichen, 37 Stichworte) |
| Handshake | **beide Richtungen**, 6/6 und 1/2 |

**⭐ Modul 05 hat die Zahl selbst gemeldet:** `"score": 0.9175501500545508`,
achtmal — und die Nachrechnung ergibt dieselbe Zahl. Genau der Vergleich, der
beim ersten Mitschnitt nicht stimmte.

**⚠ Ist der Sprung echt, oder nur Sages Vokabular gespiegelt?** Gemessen gegen
**alle** 21 Knoten: Toolpoint stieg gegen 19 (KHC +0.070, Muttis +0.072, WorkFloh
+0.069) und **fiel** gegen die zwei ohne Protokoll-Bezug — Tomys Hub −0.013,
Muster Werbetechnik −0.010. Hätte der Text nur gespiegelt, wäre alles
gleichmäßig gestiegen und nichts gefallen.

**Benannt bleibt:** der Anstieg gegen **Sage** (+0.109) ist rund doppelt so groß
wie der Durchschnitt gegen die übrigen. Sages Text ist der protokoll-dichteste im
Netz — *„schreib wie Sage"* ist ein Hebel auf **diese** Zahl, und das ist nicht
dasselbe wie *„passe besser zu allen"*. Und die obersten zwei trennen **vier
Zehntausendstel** (0.917550 / 0.917107): das ist keine Rangfolge.

**Umgestellt:** alle 21 `matchScore` messen jetzt gegen die Spore, die der Knoten
im **Raum** angesagt hat. `matchScoreMassstab` sagt es im Register, jeder Eintrag
trägt `matchScoreQuelle`. Sieben Werte bewegen sich gar nicht. **Kein Knoten
wechselt die Seite des Bodens 0.80**, die `nodeId`-Spalte bleibt die committete
Identität.

**Nächster Schritt.** Mein Mixarium — Klaus hat den Beleg im Bild geschickt: im
Siegel steht der 88-Zeichen-Zweizeiler, ohne Herkunfts-Zeile und ohne
Rückhol-Knopf. Dieselbe Vorrang-Falle, dort noch offen.

**Proben:** `npm test` → **99 grün, 0 rot, 0 nicht lauffähig**.

---


---

## Stand 2026-09-10 (Haupt-Sitzung) · ✅ MIXARIUM NACHGEZOGEN — 0.826040 → 0.883142

**Was getan.** Klaus hat über das **Siegel** neu signiert. Der Mitschnitt von
16:29 zeigt Mixarium mit **2141 Zeichen** im Raum statt 88, und der Wert steigt
auf **0.883142**. Die Spore liegt jetzt in Mein-Mixarium (PR #199), die alte als
Vorgänger daneben; Sages Register führt Zahl und `nodeId` nach, die alte Kennung
steht unter `previousNodeIds`.

**Geprüft vor dem Ablegen:** VALID · `id == base64url(SHA256(rawPub))` · kein `d`
· `key_ops` nur `["verify"]` · L2 = 1.000000103 · kanonisch byte-gleich mit der
Spore im Raum · Text byte-gleich mit dem Depot. **Die Kennung ist dieselbe** —
die Identität hat den Text-Wechsel überlebt.

**⚠ Benannt: das ist eine andere MESSGRUNDLAGE, nicht nur ein besserer Text.**
Vorher rechnete die Zahl aus den Getränke-Namen (`embeddingSource: "content"`),
jetzt aus der Selbstbeschreibung (Siegel-Weg, 14 Schnipsel). Beide Wege sind
gewollt. **Und es gab keinen Handshake** — Sage war nicht im Raum, die 0.883142
ist nachgerechnet und **nicht** von Modul 05 bestätigt.

**Zwei eigene Wächter waren zu streng oder zu eng:**

| Was | Warum es falsch war |
|---|---|
| „Sage tritt im **neuesten** Mitschnitt auf" | der Mitschnitt von 16:30 ist ein 76-Sekunden-Lauf mit nur Mixarium. Ein Wächter, der einen Ein-Knoten-Mitschnitt für einen Defekt hält, **verbietet das Ablegen genau der Belege**, die eine einzelne Reparatur zeigen. Gemessen wird jetzt am neuesten Mitschnitt, **der Sage trägt** — und dass es überhaupt einen gibt, ist eine eigene Prüfung |
| die Signatur-Wächter lasen **nur den neuesten** | jeder ältere Beleg blieb ungeprüft. Ein Mitschnitt, den niemand nachrechnet, ist eine Behauptung mit Dateinamen. Jetzt: **29 Sporen über 5 Mitschnitte**, alle geprüft |

Gefunden hat das zweite nicht das Nachdenken, sondern **vier Gegenprobe-Fälle,
die plötzlich durchrutschten**, weil ihre Sabotage in einem anderen Mitschnitt
landete als der, den der Wächter ansah.

**Proben:** `npm test` → **99 grün, 0 rot**. Gegenprobe → **8 gefangen, 0
durchgerutscht**, jeder Fall von Hand nachgestellt.

---

## Stand 2026-09-10 (Haupt-Sitzung, Nachtrag) · ⚠ MIXARIUMS ZAHL KOMMT AUS DEN DRINKS

**Was getan.** Klaus hat Mixariums Siegel fotografiert: im Feld stand der
88-Zeichen-Zweizeiler, ohne Herkunfts-Zeile und ohne Rückhol-Knopf. Behoben in
Mein-Mixarium PR #198 — beide Wege zur Spore tragen jetzt denselben Text (2141
Zeichen, 22 Stichworte, mit Protokoll-Absatz), und der Vorschlag der App gewinnt.

**⚠ Und dabei ist eine eigene Folgerung von heute Nachmittag präzisiert worden.**
Ich hatte geschrieben, *„wer dort neu signiert, bekommt den Zweizeiler"* — und
das im Register so vermerkt. Der Text-Teil stimmt. Die Folgerung über die **Zahl**
war zu kurz gegriffen:

| Weg zur Spore | was eingebettet wird |
|---|---|
| **Siegel** | `embedPassage(beschreibung)` — der Text |
| **stille Erst-Anmeldung** | `embedContentVector(samples)` — die **Getränke-Namen** |

Gemessen an der Raum-Spore vom 2026-09-02: `embeddingSource: "content"`.
**Mixariums 0.826040 stammt aus seinen Drinks.** Das ist die Entscheidung vom
2026-06-28 und bleibt so — sie ist die ehrlichere Messung. Eine bessere
Beschreibung wirkt dort erst beim Signieren **über das Siegel**.

> **Eine Folgerung ist keine Messung.** Der Text im Raum war gemessen; dass er
> auch den Vektor bestimmt, war angenommen. Das eine stimmte, das andere nicht.

**Proben:** `npm test` → **99 grün, 0 rot**. Mixarium: 15 Wächter grün,
Gegenprobe 10 gefangen / 0 durchgerutscht.

---

---

## Stand 2026-09-10 (Haupt-Sitzung) · ✅ DIE MYCEL-KARTE SPIELT DEN ECHTEN LAUF NACH

Klaus: *„könnte man die 235 Ereignisse in der Mycelkarte mit den entsprechenden
Knoten als Probelauf im Regler starten lassen, so dass man aus dem realen
bereits Gelaufenen eine Demo macht … das natürlich langsamer abgespielt, in
ungefähr 235 Sekunden?"*

Gebaut in **mycel-karte** (PR #21, gemergt): ein Knopf **▶ Mitschnitt
abspielen** im Regler spielt **191 echte Ereignisse** aus den fünf hier
abgelegten Aufzeichnungen des 10.09.2026 ab, ein Ereignis je Sekunde — rund
drei Minuten statt der vier Stunden des Originals.

**Gemessen** (2026-09-10):

| | |
|---|---|
| abgespielte Ereignisse | **191** aus 5 Mitschnitten (136 · 20 · 25 · 2 · 8) |
| davon Anwesenheit / Anfrage / Handshake | 42 · 125 · 24 |
| Takt | 1 000 ms je Ereignis |
| statische Wächter | 34 grün · 0 ROT |
| Gegenprobe | 18 gefangen · 0 durchgerutscht · 0 aus dem falschen Grund · 0 tote Anker |
| im echten Chromium | 14 grün · 0 ROT |

**Die Wiedergabe nimmt denselben Weg wie echter Verkehr** — sie gibt jedes
Ereignis an `handleRelayEvent`, dieselbe Funktion, die auch die Poststellen
bedient. Ein zweiter Zeichen-Weg wäre eine zweite Fassung.

**Drei Riegel dagegen, dass eine Vorführung für einen echten Lauf gehalten
wird:** der Rekorder schweigt während einer Wiedergabe · das Lauschen wird
angehalten (sonst mischte sich echter Verkehr darunter und ginge zugleich aus
der Aufzeichnung verloren) · das Band nennt Datum, Herkunft und ausdrücklich,
dass das Originaltempo **nicht** wiedergegeben wird.

⚠ **DIE MITSCHNITTE HIER BLEIBEN UNVERÄNDERT — SIE SIND DER BELEG.** Was die
Karte abspielt, ist eine **abgeleitete** Datei
(`mycel-karte/mitschnitt/mycel-lauf-2026-09-10.json`, 50 KB), gekürzt auf die
Felder, die die Karte beim Zeichnen liest; sie sagt das in ihrem eigenen Kopf.
Die 17 MB mit jeder Spore, jedem 384-stelligen Vektor und jeder Signatur
liegen weiter unter `sbkim/mitschnitte/`. Abgeleitet wird mit
`mycel-karte/tools/mitschnitt-eindampfen.mjs` — eine Datei, die einen echten
Lauf behauptet und von Hand entstand, wäre eine erfundene Aufzeichnung.

⚠ **UND DERSELBE GRIFF DANEBEN WIE IN `smoke_mitschnitt.mjs`, EINE DATEI
WEITER:** der Kopf der abgeleiteten Datei nahm Anfang und Ende aus der nach
**Dateinamen** geordneten Liste. `T` sortiert vor `_` — das Ende stand vor
seinem Anfang. Geordnet wird nach der Zeit der Ereignisse; ein Wächter und ein
Gegenprobe-Fall halten es fest.

**Offen:** Klaus' Browser-Sichttest. Ob die drei Minuten die richtige Länge
sind und ob man dem Band ansieht, dass es eine Vorführung ist, sagt nur er.

---


---

## Stand 2026-09-10 (Haupt-Sitzung, Abend) · ✅ DIE ZWEITE EIGENE TÜR IST IN DER LISTE

Klaus: *„In Kimboard fehlt ein Relais und auch in der Pinnwand … das von PWA
Toolpoint. Da müsste noch das private Relais rein."*

Er hat recht: `wss://relay.pwa-toolpoint.de` fehlte in **Kimboard** und in
**`pinnwand/`**, obwohl die Mycel-Karte und PWA Toolpoint es längst führen.
Nachgetragen, in beiden.

⚠ **ES IST KEINE ZWEITE POSTSTELLE, SONDERN EINE ZWEITE TÜR.** Belegt in
`family-project/Caddyfile.example`: seit dem 2026-08-11 liegt der Name als
zweiter Caddy-Block auf **demselben** Relais-Container (Klaus hat es an der
Server-Konsole gemessen — Zertifikat, HTTP 200, NIP-11-Name „Toolpoint-Relay").
Beide Türen führen in denselben Nachrichten-Speicher.

**Daraus folgt etwas für den Default-Aktiv-Satz.** Der zählte fünf
**verschiedene** Speicher (`RELAY_POOL.slice(0, 5)`); die zweite Tür einfach
hineinzuschieben hätte daraus vier gemacht, während die Oberfläche weiter
„fünf gestreut" schreibt — eine Zahl, die etwas anderes verspricht, als sie
hält.

**Klaus hat den Satz deshalb auf SECHS gehoben** (*„Ja, mach den Default-Satz
auf sechs"*): fünf Speicher wie vorher, plus die zweite Tür des ersten. Die
Streuung schrumpft dadurch nicht, und der Grund steht im Code daneben — sonst
kürzt die nächste Sitzung den Satz wieder auf fünf, „weil da eine Dopplung
drin ist", und nimmt dabei einen echten Speicher mit. Gemessen wird nicht die
Zahl der Pillen, sondern die Zahl der **verschiedenen Speicher** darin.

Doppelt ankommende Zettel sind unkritisch: Kimboard verwirft sie über
`seen.has(ev.id)` (nachgesehen, nicht angenommen).

**Nebenbei berichtigt:** der Kopf-Kommentar über `RELAY_POOL` behauptete in
beiden Apps, der **erste** Eintrag sei das „Toolpoint-Relay", und verwies auf
eine Notiz, die es in keinem der Depots gibt. Der erste Eintrag ist
`relay.family-projekt.de`.

**Gemessen:** Sage `node tests/run_alle.mjs` **99 grün · 0 rot**,
`pinnwand/_smoke.mjs` **74 grün** (vorher 67) · Kimboard `tests/alle.mjs`
**alle 31 Prüfungen grün**, `smoke_vorgezeichnet` **22 grün** (vorher 11).
Von Hand gegengeprüft: Relais entfernt · Grund gestrichen · „(eigenes)" nur am
Heim-Relais · **den Satz wieder auf fünf gekürzt** — der letzte meldet
„4 verschiedene Speicher bei 5 Pillen", jeder mit dem Namen seiner eigenen
Zusicherung in der roten Zeile.

---

