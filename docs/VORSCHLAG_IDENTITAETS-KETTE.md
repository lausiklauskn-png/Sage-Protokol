# Vorschlag · Die Kennungs-Kette

**Stand 2026-09-15. Das hier ist ein VORSCHLAG, kein Bau.** Er berührt
`docs/INTERFACES.md` und die Kanon-Module — das ist die Grenze, an der Klaus
entscheidet, nicht eine Sitzung.

**Die Frage, die er beantwortet** (Klaus 2026-09-15):

> *„Versetzen wir uns mal in die Lage eines Nutzers, der noch nicht so firm ist
> in dem Ganzen … er hat sich jetzt schon selber drei, vier Identitäten erzeugt
> und wieder gespeichert … Vielleicht einen einfachen, genialen Weg finden, der
> alle Agierenden an ein Ziel bringt, dass sie im Netz erkannt werden.
> Vielleicht, äh, indem die Identitäten mitgehen, auch die alten."*

---

## 1 · Erst der Befund: Kennung, ID und nodeId sind EIN Ding

Klaus hat am selben Tag gefragt, ob die Kennung in der App und die ID im
Browser zwei verschiedene Dinge sind. **Sie sind es nicht**, und das ist keine
Einschätzung, sondern steht im Code:

```js
// node_id = base64url(sha256(rawPublicKey)) without padding.
async function deriveNodeIdFromPublicKey(publicKey) { … }
```
`src/modules/02_spore.js`, Zeile 211.

| | wo es wirklich liegt |
|---|---|
| **Das Schlüsselpaar** | im **Browser**, in IndexedDB unter `sbkim_<dbSuffix>` (Modul 01) |
| **Die Kennung / ID / nodeId** | **nirgends** — sie wird bei jedem Bedarf aus dem öffentlichen Schlüssel **gerechnet** |
| **Die App** | benennt nur die Schublade (`dbSuffix`), sie besitzt die Kennung nicht |

**Daraus folgt alles Weitere:** eine Kennung lässt sich nicht „umbenennen" und
nicht „mitnehmen". Wer den Schlüssel hat, hat die Kennung; wer ihn verliert,
hat sie verloren. Ein neues Schlüsselpaar **ist** ein neuer Knoten — auch wenn
Name, Text und Stichworte byte-gleich bleiben.

⚠ **Und derselbe Satz erklärt, warum ein Wechsel nichts kostet außer der
Identität.** Gemessen an zwei Knoten dieses Tages: Mein-WorkFloh **0.902126**
vor und nach dem Wechsel, Mein-Rezeptbuch **0.874048** vor und nach — auf sechs
Stellen derselbe Wert. Der Vektor hängt am **Text**, nicht am Schlüssel.

---

## 2 · Warum ein ungeübter Nutzer sich Identitäten erzeugt, ohne es zu wollen

Vier Wege, alle gemessen, keiner davon Fahrlässigkeit des Nutzers:

| | Was passiert | Was er davon sieht |
|---|---|---|
| **Geräumter Browser-Speicher** | IndexedDB ist auf einer bloß im Tab geöffneten `github.io`-Seite **„best effort"**. Beim nächsten Öffnen entsteht still eine neue | **nichts** |
| **Zwei Geräte** | DeX-Chrome und Tablet-Chrome sind getrennte Browser mit getrenntem Speicher | nichts — beide zeigen „deine Kennung" |
| **Zwei Türen zur Sicherung** | Sichern und Wechseln gibt es im **Verbinden-Fenster** (Modul 23) **und** im **Siegel** (Modul 16b). Zwei Wege, zwei Dateinamen, zwei Gewohnheiten | er hält den zweiten für etwas anderes |
| **Mehrere Slots, keiner aktiv** | `listIdentities()` sortiert **lexikographisch**; ist keine als aktiv markiert, nimmt Modul 02 den **ersten Slot alphabetisch** — nicht die neueste nach Zeitstempel | nichts |

**Der vierte ist der unangenehmste**, weil er wie eine Entscheidung aussieht und
keine ist. Er ist nicht falsch, aber er ist **willkürlich**.

**Belegt am eigenen Netz:** Mein-Rezeptbuch trug am 2026-09-15 bereits **drei**
Einträge unter `previousNodeIds`, mit dem Wechsel dieses Tages **vier**. Kein
anderer Knoten wechselt so oft — und die Ursache liegt nicht im Knoten, sondern
in der Bedienung.

---

## 3 · Klaus' Vorschlag: der Dateiname sagt schon, was drin ist

> *„Vielleicht über die Dateibezeichnung schon erkennt, welche Spore oder ID
> oder beides."* (Klaus 2026-09-15)

**Das ist heute nicht so, und es hat an diesem Tag Verwirrung gekostet.**
Gemessen an den drei Stellen, die einen Dateinamen bauen:

| Was | Wo | Name heute | Kennung drin? |
|---|---|---|---|
| Spore (Siegel) | `16b_andock_wizard.js:192` | `<Knotenname>_spore_<TT_MM_JJ>.json` | **nein** |
| Sicherung (Verbinden) | `23_rendezvous_ui.js:1176` | `sbkim-sicherung-<dbSuffix>-<JJJJ-MM-TT>.json` | **nein** |
| Sicherung (Siegel) | `16b_andock_wizard.js:573` | `<backupPrefix>-<ISO-Zeitstempel>.sbkim.json` | **nein** |

**Zwei Sporen derselben App am selben Tag sind damit ununterscheidbar.** Genau
das ist passiert: Klaus hat an diesem Tag zwei Dateien geschickt, die
`WorkFloh_spore_15_09_26.json` und `WorkFloh_spore_15_09_26_1.json` hießen — die
`_1` kam vom Browser, nicht von der App. Welche die neuere war, stand **nur im
Inhalt** (13:03 gegen 14:04). Und an derselben Stelle schrieb er:

> *„Verwechsel nicht Workflow mit Workflow Page. Also ich glaube, ich habe es
> gerade verwechselt."*

**Der Name trug den Unterschied nicht, also musste der Mensch ihn tragen.**

### Der Vorschlag im Einzelnen

```
WorkFloh_spore_2026-09-15_LEIbBDaS.json
sbkim-sicherung-workfloh-2026-09-15_LEIbBDaS.json
```

- **Acht Zeichen der Kennung**, an den Namen gehängt. Sie sind base64url,
  also in einem Dateinamen unbedenklich (`A–Z a–z 0–9 - _`).
- **Datum sortierbar** (`JJJJ-MM-TT` statt `TT_MM_JJ`) — dann liegt in jedem
  Ordner die Zeitachse richtig, ohne dass jemand hineinsieht.
- **Bei einer Sicherung mit mehreren Identitäten** steht statt der einen
  Kennung die Anzahl: `…_2-Kennungen.json`. Eine davon herauszugreifen wäre
  eine Behauptung darüber, welche die wichtige ist.

### Was das leistet — und was nicht

| leistet | leistet **nicht** |
|---|---|
| zwei Dateien desselben Tages sind unterscheidbar, **ohne sie zu öffnen** | es macht aus einer Sicherung keine Kennung, die man wiederherstellen kann |
| die App-Verwechslung von heute fällt beim Hinsehen auf | es schützt nicht davor, dass eine Kennung überhaupt verlorengeht |
| eine Sitzung kann eine geschickte Datei zuordnen, ohne zu raten | der Dateiname ist **kein Beweis** — er lässt sich umbenennen |

⚠ **Der Name ist ein Hinweis, kein Vertrauens-Beweis** — dieselbe Regel, die
netzweit für den Gerätenamen gilt (NETZWEIT § 2). Geprüft wird weiter der
Inhalt: `id == base64url(SHA256(rawPub))`. Stimmt der Name nicht mit dem Inhalt
überein, gilt der **Inhalt**, und die Abweichung wird benannt.

**Kosten:** drei Zeilen in zwei Kanon-Dateien, keine Änderung am Protokoll,
keine Änderung an einer Spore, kein neues Signieren. **Das ist der billigste
Punkt in diesem ganzen Dokument und der einzige, der sofort wirkt.**

---

## 4 · Die alten Kennungen gehen mit — was davon es schon gibt

Klaus' eigentliche Idee: *„indem die Identitäten mitgehen, auch die alten … eine
Liste der eigenen Kennungen oder der ehemaligen Kennungen mitgehen, bis man sie
löscht."*

**Die Hälfte davon gibt es bereits, nur an der falschen Stelle.**
`previousNodeIds` steht in `Sage-Protokol/status.json` — also **im Register**,
gepflegt von Hand durch eine Sitzung. In der **Spore**, die ein Knoten im Raum
ansagt, steht es **nicht**. Ein Fremder, der die Spore sieht, erfährt die
Vorgeschichte nicht; nur wer Sages Register liest, erfährt sie.

### Vorschlag: `previousNodeIds` wird ein Feld der Spore

```json
{
  "id": "r-k1NyHeLWpLphP5O2uJKtiIyYNXABm8YOAlqQR3PcI",
  "previousNodeIds": ["VtvtrDV4…", "uOpUBezU…", "BSWxXmX…"],
  "…": "…"
}
```

**Drei Dinge daran sind die eigentliche Arbeit:**

1. **Das Feld steht UNTER der Signatur** — wie jedes Feld einer Spore. Damit
   sagt der neue Schlüssel: *„ich behaupte, diese alten Kennungen waren ich."*
   **Das ist eine Behauptung, kein Beweis** (siehe § 5), und die Spore muss das
   selbst sagen, statt es offenzulassen.
2. **Die Liste muss einen Deckel haben.** Ohne ihn wächst jede Spore mit jedem
   Wechsel; bei vier Wechseln sind das 172 Zeichen, bei vierzig 1.720. Vorschlag:
   **höchstens acht**, die ältesten fallen heraus — und das Herausfallen steht
   in der App, statt still zu geschehen.
3. **Löschen muss gehen.** Klaus sagt es selbst: *„bis man sie löscht."* Wer eine
   alte Kennung nicht mehr mit sich führen will, nimmt sie heraus; das ist sein
   Recht und keine Fehlbedienung.

---

## 5 · Der Unterschied zwischen einer Behauptung und einem Beweis

**Das ist der Punkt, an dem der einfache Weg und der richtige auseinandergehen,
und er ist der wichtigste Absatz dieses Dokuments.**

Eine Spore, die alte Kennungen aufzählt, **behauptet** eine Vorgeschichte. Jeder
kann das: wer ein frisches Schlüsselpaar erzeugt, kann darin beliebige fremde
Kennungen als seine früheren ausgeben. Die Spore wäre in sich tadellos — gültige
Signatur, `id == base64url(SHA256(rawPub))`, Vektor normiert — und die
Behauptung darin trotzdem frei erfunden.

### Der Beweis, wo er möglich ist: die alte Kennung unterschreibt die neue

```json
"successorOf": {
  "nodeId":    "VtvtrDV4KhQv3Q9B9jwZL5UIc9W7xrsKLduZ9xqk9T8",
  "signature": "<Ed25519 über die NEUE Kennung, mit dem ALTEN Schlüssel>",
  "at":        "2026-09-15T13:05:41.909Z"
}
```

Wer das prüft, rechnet nach: **hat der Inhaber des alten Schlüssels wirklich
gesagt, dieser neue sei sein Nachfolger?** Das lässt sich nicht erfinden — dafür
bräuchte man den alten privaten Schlüssel.

**Und genau da liegt die Grenze, ehrlich benannt:**

| Lage | was geht |
|---|---|
| Der alte Schlüssel lebt noch (Wechsel aus freien Stücken, Sicherung vorhanden) | **Beweis** — die Nachfolge ist unterschrieben |
| Der alte Schlüssel ist weg (geräumter Speicher, keine Sicherung) | **nur Behauptung** — mehr ist mathematisch nicht möglich |

**Der zweite Fall ist der häufige**, und er ist genau Klaus' Fall bei
Mein-WorkFloh: die alte Kennung war weg, bevor jemand sie sichern konnte.
**Ein System, das nur den ersten Fall kann, hilft dem ungeübten Nutzer nicht.**

### Daraus folgt: beide Felder, sauber getrennt

Eine Spore trägt **beides** und sagt, was welches ist:

- `previousNodeIds` — **behauptet**, unbeglaubigt, hilft beim Wiedererkennen
- `successorOf` — **bewiesen**, nachrechenbar, hilft beim Vertrauen

Und die Oberfläche zeigt den Unterschied: *„früher (Angabe des Knotens)"* gegen
*„Nachfolge bestätigt ✓"*. **Zwei Dinge, die verschieden viel wert sind, dürfen
nicht gleich aussehen** — sonst ist das schwächere in Wahrheit eine
Beruhigung.

---

## 6 · Was das Register dabei ist — und was es nicht wird

Klaus hat gefragt, ob die Nutzer ihre Sporen zurückschicken sollen und ob eine
Tabelle wieder ausgeliefert wird, oder ob es über den Hetzner-Server läuft.

**Vorschlag: nein, und zwar aus einem Grund, der schon in der Verfassung steht.**
Der Knoten ist **Empfangsmodus mit Antwortrecht**; ein zentraler
Identitäts-Dienst, den jede App fragt, wäre genau das Gegenteil — und die
nächste Frage wäre, wer ihn betreibt und wer ausfällt, wenn er ausfällt.

Was das Register (`Sage-Protokol/status.json`) **ist**:

| | |
|---|---|
| **Eine Rückfalllinie** | wer eine Kennung nicht zuordnen kann, sieht dort nach — freiwillig, lesend, ohne dass jemand etwas hinschicken muss |
| **Eine Beobachtung** | es hält fest, was gemessen wurde, mit Datum und Quelle |
| **Kein Ausweisamt** | es entscheidet nicht, wer wer ist. Das entscheidet der Schlüssel |

**Es trägt schon heute genau das, was Klaus beschreibt** — eine Tabelle der
früheren Kennungen je Knoten. Der Unterschied zu seinem Vorschlag ist nur: es
wird **gelesen, nicht ausgeliefert**, und es ist nicht die Wahrheit, sondern ihr
Protokoll.

---

## 7 · Die Ursache, nicht das Symptom: zwei Türen werden eine

Alle Vorschläge oben behandeln die Folgen. **Die Ursache dafür, dass ein
ungeübter Nutzer sich drei, vier Identitäten erzeugt, ist die doppelte
Bedienung** — Klaus hat sie von sich aus benannt:

> *„Dann wird im Mycel eine Sicherung angelegt, die aber auch schon im äh,
> Siegel angelegt werden kann. Also auch wieder doppelt."*

Er hat recht, und es ist nachgemessen: Sichern, Einspielen und Wechseln stehen
**im Verbinden-Fenster (Modul 23) und im Siegel (Modul 16b)**, mit
verschiedenen Dateinamen, verschiedenen Texten und verschiedenen Passwort-Fragen.

**Vorschlag:** eine Tür. Die zweite Stelle zeigt denselben Zustand an und
**verweist** darauf, statt einen eigenen Weg anzubieten. Welche der beiden die
Tür wird, ist eine Entscheidung, keine Rechnung — das Siegel ist der Ort, an dem
der Nutzer ohnehin über Identität nachdenkt; das Verbinden-Fenster ist der Ort,
an dem er merkt, dass er eine braucht.

---

## 8 · Die getrennte Frage: den INHALT mitsignieren

Klaus hat sie am selben Tag gestellt, und sie gehört nicht in dieselbe Schublade:

> *„Die aktuelle zum Beispiel bei meinem Rezeptbuch soll auch den Inhalt äh,
> signieren … Wenn jetzt zum Beispiel jemand äh, Sushi äh, ändert in Kuchen …
> dann soll natürlich der Inhalt des Rezeptbuches ebenfalls mit signiert werden."*

**Der halbe Weg dorthin ist gebaut und läuft seit Monaten.** Mein Mixarium
rechnet seinen Vektor in der stillen Erst-Anmeldung aus den **Getränke-Namen**,
nicht aus der Selbstbeschreibung — `embeddingSource: "content"`, gemessen an der
Spore vom 2026-09-02, und ausdrücklich so entschieden (2026-06-28): *„wenn echte
Drinks vorhanden sind, entscheidet der INHALT statt der Selbstbeschreibung."*

**Was fehlt, ist der Unterschied zwischen „daraus gerechnet" und „dafür
gebürgt".** Ein Vektor aus dem Inhalt sagt, **worum** es geht; er sagt nicht,
dass der Inhalt unverändert ist. Dafür bräuchte es einen **Hash über den
Bestand**, mit in der Spore, mit unter der Signatur:

```json
"contentDigest": { "alg": "SHA-256", "value": "…", "count": 142, "at": "…" }
```

⚠ **Das ist die teuerste Idee in diesem Dokument, und sie hat einen Preis, der
benannt gehört:** jede Änderung am Rezeptbuch macht die Signatur ungültig. Wer
ein Rezept ändert, müsste neu signieren — sonst stünde im Netz eine Spore, die
einen Bestand bezeugt, den es nicht mehr gibt. **Eine gebrochene Zusicherung ist
schlimmer als keine.** Realistisch ist es nur mit einem Weg, der ohne Klicken
neu signiert, und den gibt es nicht.

**Deshalb: nicht jetzt.** Aufgeschrieben, damit die Frage nicht verlorengeht.

---

## 9 · Die Reihenfolge, wenn Klaus zustimmt

| | Was | Kosten | Wirkt sofort? |
|---|---|---|---|
| **1** | **Dateiname trägt Kennung + Datum** (§ 3) | drei Zeilen, zwei Dateien, kein Protokoll | **ja** |
| **2** | **Warnung, solange keine Sicherung vorliegt** | ein Satz im Verbinden-Fenster; die Marke gibt es schon | ja |
| **3** | **`previousNodeIds` in der Spore** (§ 4) | INTERFACES §4/§7, Modul 02, ein neues Signieren je Knoten | erst beim nächsten Signieren |
| **4** | **Eine Tür statt zwei** (§ 7) | Modul 23 **und** 16b, Oberflächen-Entscheidung | ja |
| **5** | **`successorOf`, signierte Nachfolge** (§ 5) | neues Feld, neue Prüfung, nur wo der alte Schlüssel lebt | nein |
| **6** | **`contentDigest`** (§ 8) | teuer, siehe oben | nein |

**1 und 2 lassen sich ohne Protokoll-Änderung bauen.** Ab 3 wird
`docs/INTERFACES.md` angefasst, und das ist die heilige Tafel — dort entscheidet
Klaus, nicht eine Sitzung.

---

## 10 · Offene Frage an Klaus

**Soll der Identitäts-Wechsler nach ZEITSTEMPEL vorwählen statt alphabetisch?**

Heute nimmt Modul 02 bei mehreren Slots ohne aktive Markierung den **ersten
lexikographisch**. Das ist nicht falsch, aber willkürlich — und für einen
Nutzer, der gerade eine neue Identität erzeugt hat, überraschend: er bekommt
unter Umständen eine ältere zurück.

**Dagegen spricht etwas Ernstes**, deshalb steht es hier als Frage und nicht als
Vorschlag: *„die neueste gewinnt"* heißt auch, dass ein **versehentlich**
erzeugter Schlüssel die gewachsene Identität verdrängt — genau der Fall, den
dieses ganze Dokument verhindern will. Beide Regeln haben ihren Schaden; die
alphabetische ist nur der stillere.

---

## Was in diesem Dokument NICHT steht

- **Keine Zahl darüber, wie oft ein Browser-Speicher wirklich geräumt wird.**
  Nicht gemessen; eine geratene Zahl klingt genau wie eine gemessene.
- **Kein Urteil darüber, welcher der sechs Punkte gebaut wird.** Das ist Klaus'
  Entscheidung, und ein Vorschlag, der sie vorwegnimmt, ist keiner.
