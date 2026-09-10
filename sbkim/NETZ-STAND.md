# NETZ-STAND — SBKIM-Mycel (lebende Übersicht)

> **Der „Tresor mit der wichtigen Information".** Eine einzige, findbare Momentaufnahme
> des gesamten SBKIM-Netzes: wer ist angedockt, mit welcher Identität, auf welcher Stufe,
> wo nachprüfbar. Jede Andock-Sitzung pflegt diese Datei nach. Wahrheitsquelle bleibt
> `status.json` (Maschine) + die `*_inbox.verify.md`-Vermerke (Beweis) — diese Datei ist
> die menschenlesbare Karte darüber.

**Stand: 2026-09-08** · Protokoll-Version im Code **`0.2`** (Spore v0.2, A6+A10) ·
Andock-Konventionen: INTERFACES §11

> **✅ Neu-Signier-Welle praktisch durch (2026-07-20, gegen `origin/main` verifiziert).** Die committeten
> `spore.json` von **elf** SBKIM-Knoten sind jetzt echte v0.2-Sporen (mit Satz-Schnipseln): Sage +
> SB-KIMTool-Point (14.07.), dann die Endknoten 18.–19.07. (Mixarium · Rezeptbuch · Jasons-Tresor ·
> Mein-Tresor · Kim-Bell · Kimboard · Kimseek · Tomys-Hub · family-project). **Private Brain** kam am
> 20.07. als **12. Knoten** dazu (erste eigene Identität, reziprok verifiziert). **Einzig BookLedgerPro**
> ist noch `v0.1` committet (Klaus-Entscheid: bewusst ohne Schnipsel, Domänen-Vektor = Demo-Stub;
> v0.2-Neu-Signatur = kurzer Schlüssel-Lauf im Browser).
> **♻️ REGISTER-REFRESH 2026-07-23:** alle Live-Sporen erneut von `main` mit dem Produktiv-Verifizierer geprüft (**14 Knoten VALID**, +Muttis Rezeptbuch als 14.). Die **Match-Scores in beiden Tabellen sind jetzt auf die verifizierten Live-Werte nachgezogen** (durchweg höher nach der v0.2-Welle). **Tomys** ist ehrlich `verified-spore` (Sage 0.7917 < 0.80, matcht Family/BLP statt Sage); **Private Brain** stieg auf `verified-match` (0.810 ≥ 0.80).
>
> **⚠️ nodeId-Drift:** beim Neu-Signieren haben die meisten Knoten **neue nodeIds** bekommen (nur Sage
> `nysOZE3V…` und BLP unverändert). Die **nodeId-Spalte der Knoten-Tabelle unten ist auf den 20.07-Stand
> nachgezogen**; die **Match-Scores** in der Tabelle + im Abschnitt „Bezeugte Cross-Knoten-Matches" stammen
> aber noch aus der **Vor-Resign-Zeit** — eine reziproke Score-Neuberechnung gegen die neuen Identitäten
> ist der dokumentierte Folge-Schritt. Datierte Historien-Vermerke behalten bewusst ihre alten nodeIds.
> Wahrheitsquelle bleibt die committete `spore.json` jedes Repos.

> **Spore v0.2 (2026-07-14, A6+A10):** `PROTOCOL_VERSION` im Code auf `0.2` (Modul 02/03 + Byte-
> Kopien). Neu: optionales Spore-Feld **`snippetVectors`** (bis 20 satz-granulare 384-dim-Vektoren)
> für eine **gratis „verwandt"-Messung über die Bedeutung** — reine Anzeige, **0.80-Andock-Riegel
> unberührt**. `verifyForeignSpore` major-tolerant → 0.1- und 0.2-Sporen bleiben gegenseitig gültig.
> **Neu-Signier-Welle (optional, Empfangsmodus, kein Zwang):** jeder Knoten signiert bei Gelegenheit
> seine Spore auf 0.2 neu + hängt Satz-Schnipsel an — Knopf in der App **oder**
> `tools/resign_spore_v02.mjs` (ENV-Schlüssel `SBKIM_NODE_KEY`) + `tools/embed_helper.html`
> (Browser rechnet `snippets.json`). Privater Schlüssel bleibt beim Knoten, nur öffentliche
> `spore.json` committen.

> **🪪 COMMITTETE vs. LEBENDE Identität (Stufe 0e, 2026-07-29).** Die `nodeId`-Spalte unten ist die
> **committete** Identität — die in der `spore.json` jedes Repos signierte, gegen `main` verifizierte
> Wahrheitsquelle. Sie ist **nicht zwingend** die **lebende** Identität, die ein Knoten gerade im
> Rendezvous-Raum (Modul 23) trägt. Grund: der Browser-Speicher einer nur im Tab geöffneten
> github.io-Seite ist „best effort" und kann zwischen Sitzungen geräumt werden — dann öffnet der Knoten
> beim nächsten Mal mit einer **neuen lebenden `nodeId`** (das ist der Befund, den Stufe 0 gerade
> reparierbar/haltbar macht). **Modul 23 findet Knoten im Raum über den `nodeName`** und handshaket die
> lebende `nodeId`; das Register muss dafür nicht stimmen. Konkret aus Klaus' Mycel-Analyse 2026-07-29
> (5 live Knoten, alle Sporen kryptografisch gültig, nur der Schlüssel wechselte):
>
> | App | committet (Register) | lebend 29.07. | cos(live,committet) |
> |---|---|---|---|
> | BookLedgerPro | `MyHVM7Pd…` | `6oKgwHRp…` | 0.8337 (Register v0.1, **live v0.2**) |
> | Jasons-Tresor | `lbUthjt-…` | `zHqjzJX5…` | 0.9155 |
> | Mein-Tresor | `feV3o4qJ…` | `nmRebxCn…` | 0.9144 |
> | Family Projekt | `XoYhjpgm…` | `eg23tVHt…` | 1.0000 (nur der Schlüssel weg) |
> | Kimboard | `1f9Jb7c3…` | `vPg4z2Ci…` | 0.9880 |
>
> Beleg: `docs/sessions/archiv/2026-07-29_mycel-analyse-identitaetsverlust.md`. **BookLedgerPro:** das
> Register führt noch `v0.1`, die **lebende** Spore läuft schon `v0.2` (inhaltstreuer Vektor) — hier ist
> die Tabelle schlechter als die Wirklichkeit.

---

## 🔬 DER ZWEITE MITSCHNITT — 18 Knoten live gemessen (2026-09-10, 14:02–14:33)

Beleg: [`sbkim/mitschnitte/2026-09-10T1433_mycel-karte-analyse.json`](mitschnitte/2026-09-10T1433_mycel-karte-analyse.json)
(154 Ereignisse, Rekorder v1.3). Klaus hat zwischen 14:04 und 14:21 **zwölf Apps
nacheinander geöffnet und neu signiert**; damit liegen erstmals **live gemessene**
Sporen von 18 Knoten nebeneinander statt einer.

**Alle 18 Raum-Sporen sind kryptografisch gültig** — VALID, `id == base64url(SHA256(rawPub))`,
kein `d` im JWK, `key_ops` nur `["verify"]`, L2 = 1 bei allen 18 (nachgerechnet).

### ✅ Der Vorbehalt über Sage ist eingelöst — Raum und Depot sind DIESELBE Spore

Bis zum 2026-09-10 stand über jeder Zahl dieses Registers der Satz, sie messe gegen
die **Depot**-Spore und nicht gegen den Knoten, dem eine App im Raum wirklich
begegnet. Das ist jetzt gemessen und **hinfällig**:

| | Depot (`sbkim/spore.json`) | Raum (Mitschnitt) |
|---|---|---|
| Kennung | `BgjXhSApoOrJ…` | `BgjXhSApoOrJ…` |
| signiert | 2026-09-10T13:20:21.535Z | 2026-09-10T13:20:21.535Z |
| Text | 3028 Zeichen · 50 Stichworte | 3028 Zeichen · 50 Stichworte |
| **`domainVector`** | **byte-gleich** — cos = 1.0 | |

**Der Maßstab, gegen den alle zwanzig `matchScore` gerechnet sind, ist damit
bestätigt.** Sage im Raum IST Sage im Depot.

### ⚠ DREIZEHN VON FÜNFZEHN KNOTEN TRAGEN IM RAUM EINE ANDERE KENNUNG

Der Stufe-0e-Befund vom 2026-07-29, zum zweiten Mal und im großen Maßstab. Nur
**Perfect Skin Beauty** und **Kim Hub Company** trugen dieselbe Kennung wie im
Depot — beide, weil ihre Spore heute nicht neu erzeugt wurde.

Das ist **kein Fehler der Apps**: der Browser-Speicher einer nur im Tab geöffneten
github.io-Seite ist „best effort". Wird er geräumt, legt die App beim nächsten
Öffnen ein neues Schlüsselpaar an. **Die `nodeId`-Spalte unten bleibt deshalb die
COMMITTETE Identität** — sie soll die abgelegte Spore beschreiben, nicht den
Tagesstand eines Browsers.

### ⚠ DERSELBE TEXT ERGIBT NICHT IMMER DENSELBEN VEKTOR — und das ist je App stabil

Gemessen wurde `cos(Depot-Vektor, Raum-Vektor)` bei byte-gleichem
`domainDescription`, byte-gleichen `domainKeywords`, byte-gleicher `domain` und
demselben `embeddingModel` (`Xenova/multilingual-e5-small`):

| Knoten | cos(Depot, Raum) | |
|---|---|---|
| family-project · WorkFloh · Muster Werbetechnik · Perfect Skin Fashion · Tomys Hub · Perfect Skin Beauty · Kim Hub Company | **1.000000** | kein Unterschied |
| Alis Moderaum | 0.995264 | |
| Jasons-Tresor | 0.994307 | |
| Mein-Tresor | 0.990437 | |
| Kimseek | 0.989639 | |
| Kimboard | 0.987958 | |

Bei Kimseek weichen **alle 384 Dimensionen** ab, die größte Einzelabweichung ist
0.024; beide Vektoren sind sauber normiert (L2 = 1.000000053 bzw. 0.999999768).
Es ist also kein Rundungsfehler und kein Normierungsfehler.

**Es ist auch nicht zufällig.** Der Mitschnitt vom 2026-07-29 nennt für Kimboard
**0.9880** und für Family Projekt **1.0000** — sechs Wochen und zwei
Schlüsselwechsel später stehen dort **0.987958** und **1.000000**. Der Unterschied
gehört zur App, nicht zum Lauf.

⚠ **DIE URSACHE IST NICHT GEMESSEN.** Ein naheliegender Kandidat: die Depot-Sporen
der betroffenen Knoten stammen aus der Neu-Signier-Welle vom 18.–19.07. und wurden
mit `tools/resign_spore_v02.mjs` + `tools/embed_helper.html` gerechnet, also in
einer **anderen Umgebung** als der App. Das ist eine **Vermutung, kein Befund** —
eine geratene Ursache klingt genau wie eine gemessene. Wer sie prüfen will,
rechnet denselben Text einmal im Helfer und einmal in der App und vergleicht.

**Nicht betroffen sind die beiden Fälle, auf die es heute ankam:** Sage (cos = 1.0)
und Kim Hub Company (cos = 1.0).

### Register gegen Raum — und was daran hängt

| Knoten | Register | Raum | Δ |
|---|---|---|---|
| SB-KIMTool-Point | 0.893026 | 0.865795 | −0.027231 |
| Auslieferungsprüfer | 0.836978 | 0.865385 | +0.028407 |
| Kimboard | 0.818961 | 0.847287 | +0.028326 |
| BookLedgerPro | 0.855505 | 0.826818 | −0.028687 |
| Private Brain | 0.811482 | 0.800773 | −0.010709 |
| Kimseek | 0.861596 | 0.871142 | +0.009546 |
| Mein-Tresor | 0.866101 | 0.871942 | +0.005841 |
| Alis Moderaum | 0.795460 | 0.793347 | −0.002113 |
| Jasons-Tresor | 0.872405 | 0.874249 | +0.001844 |
| Kim-Bell | 0.873750 | 0.874864 | +0.001114 |
| Family Projekt · WorkFloh · Tomys Hub · Perfect Skin Fashion · Muster Werbetechnik · Perfect Skin Beauty · Kim Hub Company | | | **±0.000000** |

**KEIN EINZIGER KNOTEN WECHSELT DIE SEITE DES HANDSHAKE-BODENS** (`PROVIDER_MIN_MATCH = 0.80`).
Die Zahlen bewegen sich, die Andock-Entscheidungen nicht. Private Brain liegt mit
0.800773 allerdings nur noch **acht Zehntausendstel** darüber.

**⚠ VIER KNOTEN WAREN NICHT IM RAUM** und tragen deshalb weiter ihre Zahl gegen die
abgelegte Spore: **Rezeptbuch** (0.874048) · **Mixarium** (0.817718) ·
**Muttis-Rezeptbuch** (0.870249) · **PWA Toolpoint** (0.811202). Klaus hat sie an
diesem Nachmittag nicht geöffnet.

**Das Register ist deshalb NICHT auf den Raum-Maßstab umgestellt.** Eine halb
umgestellte Tabelle wäre schlimmer als eine, die ihren Maßstab nennt — sie sähe
einheitlich aus und wäre es nicht. Die Entscheidung liegt bei Klaus und ist ihm
vorgelegt.

### Was der Mitschnitt sonst noch zeigt: fünf sehr dünne Beschreibungen

| Knoten | Zeichen | |
|---|---|---|
| SB-KIMTool-Point | **61** | dünnster Knoten im Netz |
| Kim-Bell | 82 | |
| BookLedgerPro | 83 | |
| Private Brain | 171 | steht 0.0008 über dem Boden |
| Kimboard | 238 | |

Zum Vergleich: Sage 3028, Kim Hub Company 2602, WorkFloh 1025. **Bei allen fünf ist
die eigene Bedeutungs-Beschreibung der nächste Hebel**, nicht Sage.

---

## 🔬 DER DRITTE MITSCHNITT — das Netz ist vollständig gemessen (2026-09-10, 15:09–15:16)

Beleg: [`sbkim/mitschnitte/2026-09-10T1516_mycel-karte-analyse.json`](mitschnitte/2026-09-10T1516_mycel-karte-analyse.json).
Klaus hat die vier Knoten geöffnet, die im zweiten Mitschnitt gefehlt hatten.
**Damit liegen für ALLE 21 Gegenstellen live gemessene Sporen vor.** Sage tritt
zum zweiten Mal mit `cos = 1.0` gegen die abgelegte Spore an — der Maßstab hält.

### ⚠ MEINE ERKLÄRUNG VON HEUTE NACHMITTAG IST WIDERLEGT

Im Abschnitt darüber steht als Kandidat für den Vektor-Unterschied, die
Depot-Sporen der betroffenen Knoten stammten aus der Neu-Signier-Welle vom
18.–19.07. und seien mit `tools/resign_spore_v02.mjs` gerechnet worden, also in
einer **anderen Umgebung** als der App. Sie stand ausdrücklich als Vermutung da.
**Sie ist falsch**, und **PWA Toolpoint** widerlegt sie:

| | Depot | Raum |
|---|---|---|
| Kennung | `WJ14jzCKnqlz…` | `WJ14jzCKnqlz…` — **dieselbe** |
| signiert | 2026-09-09T08:11:**25**.674Z | 2026-09-09T08:11:**39**.000Z |
| Text · Stichworte | 283 Zeichen · 8 | **byte-gleich** |
| `cos(Depot, Raum)` | **0.992957** | |

**Zwei Sporen, derselbe Schlüssel, derselbe Text, vierzehn Sekunden
auseinander — und ein anderer Vektor.** Keine zweite Umgebung, kein zweites
Werkzeug, keine Neu-Signier-Welle: dieselbe App, derselbe Browser, hintereinander
weg. Das Embedding ist unter denselben Eingaben **nicht deterministisch**.

⚠ **DIE URSACHE IST WEITERHIN NICHT GEMESSEN.** Widerlegt ist nur die eine
Vermutung. Was übrig bleibt, ist ein Befund ohne Erklärung — und er steht so da,
statt durch die nächste plausible Geschichte ersetzt zu werden.

> **Eine Vermutung, die man nicht als solche kennzeichnet, wird beim nächsten
> Lesen zum Befund.** Diese hier war gekennzeichnet, und deshalb ließ sie sich
> mit einer Messung wieder einkassieren, statt weitergetragen zu werden.

### ⚠ MEIN MIXARIUM SAGT IM RAUM ETWAS ANDERES AN, ALS IM DEPOT LIEGT

Der auffälligste Einzelbefund des dritten Mitschnitts:

| | Depot (`Mein-Mixarium/sbkim/spore.json`) | Raum |
|---|---|---|
| Text | **1476 Zeichen** | **88 Zeichen** |
| Wortlaut im Raum | | *„Klaus Mixarium - Cocktails, Mocktails, Smoothies und mehr; Knabbereien als Begleit-Plus."* |
| gegen Sage | 0.817718 (Register) | **0.826040** |

Die App bringt einen **Zweizeiler** mit, während im Depot eine ausgearbeitete
Beschreibung liegt. Wer im Mixarium neu signiert, bekommt den Zweizeiler — genau
die Vorrang-Falle, die Sage und Kim Hub Company am 2026-09-10 abgestellt haben
und die dort **nicht** abgestellt ist.

**Dass die Zahl trotzdem leicht STEIGT, ist kein Trost**, sondern zeigt nur, dass
Länge nicht entscheidet (siehe unten).

### 📏 LÄNGE ENTSCHEIDET NICHT — der Inhalt tut es

Über alle 21 live gemessenen Gegenstellen:

| Knoten | Zeichen | gegen Sage | nennt SBKIM/Mycel/Knoten? |
|---|---|---|---|
| Kim-Bell | **82** | **0.874864** | ja |
| SB-KIMTool-Point | **61** | **0.865795** | ja |
| Muster Werbetechnik | 421 | 0.793613 | nein |
| Perfect Skin Fashion | 273 | 0.793030 | nein |
| Perfect Skin Beauty | 265 | 0.783216 | nein |

**Zweiundachtzig Zeichen schlagen vierhunderteinundzwanzig**, wenn die zwei
Sätze vom Protokoll handeln und die vierhundert nicht. Für die fünf Knoten unter
dem Handshake-Boden heißt das: der Hebel ist **nicht mehr Text**, sondern der
Satz, dass sie zum SBKIM-Mycel gehören.

Klaus hat das am selben Tag von sich aus benannt: *„dass sie im Sage Protokoll
mit sind, das wird nämlich bedeuten, dass sie leichter gefunden würden innerhalb
des Mycels."* Die Zahlen oben sind die Messung dazu.

### Das vollständige Bild — 21 Gegenstellen, live

| gegen Sage | Zeichen | Knoten |
|---|---|---|
| 0.917107 | 2602 | Kim Hub Company |
| 0.902126 | 1025 | WorkFloh |
| 0.874864 | 82 | Kim-Bell |
| 0.874249 | 458 | Jasons Tresor |
| 0.871942 | 463 | Mein Tresor |
| 0.871142 | 272 | Kimseek |
| 0.870249 | 851 | Muttis Rezeptbuch |
| 0.865795 | 61 | SB-KIMTool-Point |
| 0.865385 | 767 | Auslieferungsprüfer |
| 0.847287 | 238 | Kimboard |
| 0.842038 | 303 | Family Projekt |
| 0.835683 | 851 | Mein Rezeptbuch |
| 0.826818 | 83 | BookLedgerPro |
| 0.826040 | 88 | Mein Mixarium |
| 0.808113 | 283 | PWA Toolpoint |
| 0.800773 | 171 | Private Brain |
| **0.793613** | 421 | Muster Werbetechnik ⬇ |
| **0.793347** | 270 | Alis Moderaum ⬇ |
| **0.793030** | 273 | Perfect Skin Fashion ⬇ |
| **0.786371** | 300 | Tomys Hub ⬇ |
| **0.783216** | 265 | Perfect Skin Beauty ⬇ |

**Fünf liegen unter dem Handshake-Boden** `PROVIDER_MIN_MATCH = 0.80`, und alle
fünf sind Läden und Vorlagen, die das Protokoll nicht erwähnen. **Private Brain**
liegt mit 0.800773 acht Zehntausendstel darüber.

**Der Grund, aus dem das Register trotzdem noch nicht umgestellt ist**, ist damit
weggefallen — es war „für vier Knoten liegt kein Mitschnitt vor". Die Entscheidung
selbst liegt bei Klaus und ist ihm vorgelegt.

---

## ✅ DAS REGISTER MISST JETZT GEGEN DEN RAUM (2026-09-10, geprüft dann umgestellt)

Klaus: *„bevor du den Register auf den neuen Maßstab umstellst, prüfe bitte die
Analyse."* Gemacht — hier steht, was geprüft wurde, bevor eine Zahl bewegt wurde.

Beleg: [`sbkim/mitschnitte/2026-09-10T1606_mycel-karte-analyse.json`](mitschnitte/2026-09-10T1606_mycel-karte-analyse.json).

### Was PWA Toolpoint gezeigt hat

Klaus hat den Marktplatz mit der neuen Beschreibung neu signiert. Der Sprung:
**0.808113 → 0.917550**.

| geprüft | Ergebnis |
|---|---|
| Signatur beider Sporen | **VALID**, `id == base64url(SHA256(rawPub))`, kein `d`, `key_ops` nur `["verify"]`, L2 = 1 |
| Kennung | `WJ14jzCKnqlz…` — **dieselbe wie vorher**, die Identität hat den Text-Wechsel überlebt |
| Text im Raum ⟷ Text im Depot | **byte-gleich**, 2585 Zeichen, 37 Stichworte |
| Handshake | **beide Richtungen** — Sage → Toolpoint 6 Anfragen / 6 Antworten, Toolpoint → Sage 1 / 2 |

**⭐ DER BESTE BELEG: Modul 05 hat die Zahl selbst gemeldet.** In den acht
Handshake-Antworten steht `"score": 0.9175501500545508` — und die Nachrechnung
aus den beiden Vektoren ergibt dieselbe Zahl. Das ist genau der Vergleich, der
beim **ersten** Mitschnitt nicht stimmte (0.863579 gegen 0.910528, Ursache waren
zwei Sage-Identitäten). Jetzt stimmt er.

### ⚠ Ist der Sprung echt, oder wurde nur Sages Vokabular gespiegelt?

Das war die eigentliche Frage, und sie ist **gemessen**: Toolpoints neuer Vektor
wurde gegen **alle** 21 Knoten gehalten, nicht nur gegen Sage.

| | Δ gegen den alten Toolpoint |
|---|---|
| Kim Hub Company | +0.070 |
| Muttis Rezeptbuch | +0.072 |
| WorkFloh | +0.069 |
| Jasons Tresor | +0.062 · Kim-Bell +0.061 · Mein Tresor +0.059 |
| **Tomys Hub** | **−0.013** |
| **Muster Werbetechnik** | **−0.010** |
| Perfect Skin Beauty | +0.0003 |

**Es stieg gegen 19 Knoten und FIEL gegen die zwei, die das Protokoll nicht
erwähnen.** Hätte der Text nur Sages Wörter gespiegelt, wäre alles gleichmäßig
gestiegen und nichts gefallen. Der Knoten hat sich wirklich zum Protokoll-Feld
hin bewegt und leicht von den Läden weg.

⚠ **BENANNTE EINSCHRÄNKUNG.** Der Anstieg gegen **Sage** (+0.109) ist rund
**doppelt** so groß wie der Durchschnitt gegen die übrigen (+0.04). Sages eigene
Beschreibung ist der protokoll-dichteste Text im Netz, also landet jeder Text
über das Protokoll in ihrer Nähe. Das ist eine **Eigenschaft des Maßstabs**, kein
Fehler — aber es heißt: *„schreib wie Sage"* ist ein Hebel auf **diese** Zahl,
und das ist nicht dasselbe wie *„passe besser zu allen"*.

⚠ **UND DIE OBERSTEN ZWEI TRENNEN VIER ZEHNTAUSENDSTEL** — PWA Toolpoint
0.917550, Kim Hub Company 0.917107. **Das ist keine Rangfolge**, das sind zwei
gleich nahe Knoten. Wer die Liste als Rangliste liest, liest sie falsch.

### Was umgestellt wurde

Alle **21** `matchScore` sind jetzt gegen die Spore gerechnet, die der Knoten im
**Raum** angesagt hat — je Knoten die neueste aus den vier Mitschnitten.
`status.json` sagt das im Feld `matchScoreMassstab`, und jeder Eintrag trägt
`matchScoreQuelle: "raum-2026-09-10"`.

**Sieben Werte bewegen sich gar nicht**, weil Depot- und Raum-Spore denselben
Vektor tragen. Die größten Bewegungen:

| Knoten | alt | neu | Δ |
|---|---|---|---|
| PWA Toolpoint | 0.811202 | **0.917550** | +0.106348 |
| Rezeptbuch | 0.874048 | 0.835683 | −0.038365 |
| BookLedgerPro | 0.855505 | 0.826818 | −0.028687 |
| Auslieferungsprüfer | 0.836978 | 0.865385 | +0.028407 |
| Kimboard | 0.818961 | 0.847287 | +0.028326 |
| SB-KIMTool-Point | 0.893026 | 0.865795 | −0.027231 |

**Kein Knoten wechselt die Seite des Handshake-Bodens** `0.80`; die fünf darunter
bleiben dieselben fünf. **Die `nodeId`-Spalte ist NICHT mitgewandert** — sie führt
weiter die committete Identität.

### Der Stand nach der Umstellung

| gegen Sage | Zeichen | Knoten |
|---|---|---|
| 0.917550 | 2585 | PWA Toolpoint |
| 0.917107 | 2602 | Kim Hub Company |
| 0.902126 | 1025 | WorkFloh |
| 0.874864 | 82 | Kim-Bell |
| 0.874249 | 458 | Jasons Tresor |
| 0.871942 | 463 | Mein Tresor |
| 0.871142 | 272 | Kimseek |
| 0.870249 | 851 | Muttis Rezeptbuch |
| 0.865795 | 61 | SB-KIMTool-Point |
| 0.865385 | 767 | Auslieferungsprüfer |
| 0.847287 | 238 | Kimboard |
| 0.842038 | 303 | Family Projekt |
| 0.835683 | 851 | Mein Rezeptbuch |
| 0.826818 | 83 | BookLedgerPro |
| 0.826040 | 88 | Mein Mixarium |
| 0.800773 | 171 | Private Brain |
| **0.793613** | 421 | Muster Werbetechnik ⬇ |
| **0.793347** | 270 | Alis Moderaum ⬇ |
| **0.793030** | 273 | Perfect Skin Fashion ⬇ |
| **0.786371** | 300 | Tomys Hub ⬇ |
| **0.783216** | 265 | Perfect Skin Beauty ⬇ |

---

## ⚠ PRÄZISIERT: Mixariums Zahl kommt aus den Drinks, nicht aus der Beschreibung

Der Abschnitt „DER DRITTE MITSCHNITT" sagt, Mein Mixarium sage im Raum 88 Zeichen
an, während im Depot 1476 liegen, und *„wer dort neu signiert, bekommt den
Zweizeiler"*. **Der Text-Teil stimmt. Die Folgerung über die ZAHL war zu kurz
gegriffen.**

Nachgesehen in der Raum-Spore vom 2026-09-02: **`embeddingSource: "content"`.**

| Weg zur Spore | was eingebettet wird |
|---|---|
| **Siegel** (`reSignWithDescription`) | `embedPassage(beschreibung)` — der **Text** |
| **stille Erst-Anmeldung** (`sbkim-init.js`) | `embedContentVector(samples)` — die **Getränke-Namen** aus dem eigenen Bestand |

Die zweite Zeile ist eine **Entscheidung vom 2026-06-28**, ausdrücklich so
gewollt: *„wenn echte Drinks vorhanden sind, entscheidet der INHALT statt der
Selbstbeschreibung."* Sie bleibt — sie ist die ehrlichere Messung.

**Daraus folgt:** Mixariums **0.826040** stammt aus seinen Drinks, nicht aus
seiner Selbstbeschreibung. Eine bessere Beschreibung wirkt dort erst, wenn über
das **Siegel** neu signiert wird. Wer nur die Datei ändert und wartet, dass die
Zahl steigt, wartet vergeblich.

**Behoben ist trotzdem beides, was wirklich ein Fehler war** (Mein-Mixarium
PR #198): die zwei Wege trugen **verschiedene** Texte, und die gespeicherte
Spore überschrieb den Vorschlag der App **still**. Klaus hat den Beleg als
Bildschirmfoto des Siegels geschickt — dort stand der Zweizeiler im Feld, ohne
Herkunfts-Zeile und ohne Rückhol-Knopf.

> **Eine Folgerung ist keine Messung.** Der Text im Raum war gemessen; dass er
> auch den Vektor bestimmt, war angenommen. Das eine stimmte, das andere nicht.

---

## Stufen-Legende

| Stufe | Bedeutung |
|---|---|
| `live-direct` / `live-channel` | Lokal eingebauter Endknoten, Spore antwortet direkt im Browser |
| `verified-spore` | Identität kryptografisch verifiziert (Signatur + nodeId), `domainVector` noch Demo → **kein** Match |
| `verified-match` | zusätzlich echter Cross-Knoten-Match ≥ 0.80 (echter `domainVector` beidseits) |
| `angekündigt` | Knoten hat Andock angekündigt, Identität noch flüchtig (kein dauerhafter Schlüssel/`spore.json`) → noch nicht verifiziert |
| `gebaut-ohne-kennung` | Alle 13 Pflicht-Dateien + Klebstoff + Siegel eingebaut, aber im Depot liegt **KEINE** `spore.json` — auch keine Platzhalter-Spore. Die Kennung entsteht erst im Browser des Betreibers. Unterscheidet sich von `awaiting-browser-spore` genau darin: dort liegt eine Datei, hier keine |
| `awaiting-browser-spore` | SBKIM-Code voll eingebaut, committete `spore.json` ist eine **Platzhalter-Spore** (headless VALID, aber `domainVector` = `_demo`-Stub + ephemere nodeId); echter Vektor + stabile Identität + Live-Handshake entstehen erst in Klaus' Browser über den Andock-Wizard |

## Knoten im Netz

| Knoten | Domäne | nodeId | Stufe | Beweis |
|---|---|---|---|---|
| **Sage-Protokol** (Hub + Knoten) | Mycel-Bibliothek | `BgjXhSApoOrJD6zFJ4uuEpAliGWPokpKn7UMWRm94PA` (Vorgänger: `nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA`) | `live-direct` · **neu signiert 2026-09-10** (3028 Zeichen, 50 Stichworte, 17 Schnipsel) · im Raum belegt | `sbkim/spore.json` · Vorgänger als Beleg `sbkim/spore-vorgaenger-2026-07-14.json` |
| **Mein-Rezeptbuch** | Kochrezepte | `VtvtrDV4KhQv3Q9B9jwZL5UIc9W7xrsKLduZ9xqk9T8` | **`verified-match` 0.881144** (auch `live-direct`) | `sbkim/rezeptbuch_inbox.verify.md` |
| **Mein-Mixarium** | Cocktails / Drinks | `YD68l2ScNzd-RWS8tCrL_JAtgpoPp3i3VKc4N9GKvbo` | **`verified-match` 0.822299** (auch `live-direct`) | `sbkim/mixarium_inbox.verify.md` |
| **SB·KIMTool·Point** | SBKIM-Werkzeug-Point | `JZ7MeMtprz5XAiXF81agCQ1mmynZUUPl_gLerqR_Zrg` | **`verified-match` 0.899516** | `sbkim/point_inbox.verify.md` |
| **Jasons-Tresor** | Jasons-Tresor-Bibliothek | `lbUthjt-outt4ns4NJQI2TaMzubX4BzQJGp_Odx_vek` | **`verified-match` 0.879330** | `sbkim/jason_inbox.verify.md` |
| **Mein-Tresor** (Schwester v. Jasons-Tresor) | Mein-Tresor-Bibliothek | `feV3o4qJF58caokPJr_oajm9dcnKwGjVXzBum8M8icM` | **`verified-match` 0.873202** | `sbkim/meintresor_inbox.verify.md` |
| **BookLedgerPro** | BookLedgerPro-Buchhaltung | `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ` | **`verified-match` 0.855505** (2026-06-21; cap/needs signiert → Drei-Schichten-bereit) | `sbkim/bookledgerpro_inbox.verify.md` |
| **Family Projekt** | Werkzeuge / Apps / Marktplatz (`family-projekt.de`) | `XoYhjpgm0F_lWqmaygHEdStBUDGAl70wcOZR--NhhR4` | **`verified-match` 0.854844** (2026-06-27; echter `domainVector`, L2=1) | `sbkim/familyproject_inbox.verify.md` |
| **Tomys Hub** | Digitaldruck / Stick / Werbeartikel (`lausiklauskn-png.github.io/Tomys-Hub/`) | `yaerFGfy7yAajFEce-sUiE6jo263TwkUmbsjIS8Js-8` | **`verified-spore`** (Sage-Cosinus 0.791717 < 0.80 → **kein Sage-Match**; 2026-07-11; Spore im Browser über das Siegel erzeugt, reziprok verifiziert VALID; echter `domainVector`, L2=1; offline nachgerechnet: **Family 0.8073 · BookLedgerPro 0.8064** ≥ 0.80. Ehrlich: Sage 0.7977 < 0.80 → **kein** Match mit dem Hub, dafür mit den fachverwandten Werkzeug-/Buchhaltungs-Knoten. **✅ LIVE bewiesen (Klaus' Browser 2026-07-11): Tomys ⟷ BookLedgerPro bidirektional `established` übers Relais** — Cross-Knoten-Bedeutungssuche live („bedruckte Tassen?" → 5 Treffer aus Tomys' Katalog 0.80–0.84). Lebende Rendezvous-ID variiert (Adress-Wand, Modul 23)) | `Tomys-Hub/sbkim/spore.json` (verifiziert) + Mycel-Analyse-Rekord 2026-07-11 |
| **Kim-Bell** | SBKIM-Netz-Glocke / Netz-Anmeldung (`lausiklauskn-png.github.io/Kim-Bell/`) | `Xg1xKoZ9vIgimEKlqeCDL_u4ptbRT6qvKplPAppyJfI` (committet); lebende Rendezvous-ID variiert | **`verified-match`** (2026-07-08; **Live-Cross-Knoten-Handshake im Browser bestätigt** — Klaus' Sichttest Sage ↔ Kim-Bell beidseitig „✓ ANDOCK ETABLIERT" über das echte Relais, nach Timeout-Fix 12 s → 5 min; Offline-Cosinus 0.8711 ≥ 0.80) | Klaus' Browser-Sichttest 2026-07-08 (Splitscreen Sage↔Kim-Bell) + `Kim-Bell/sbkim/spore.json` |
| **Kimseek** | Semantische Bedeutungs-Suche (`lausiklauskn-png.github.io/Kimseek/`) | `Yd8mwHSDYkcyd1meDe-7DJa5PS4KrY5bsl8VDn6x-TM` | **`verified-match` 0.858884** (2026-07-09; echter `domainVector`, L2=1; Live-Handshake wartet auf Klaus' Browser-Lauf) | `Kimseek/sbkim/spore.json` (aus such-tool nach Kim-Bell-Muster) |
| **Kimboard** | Pinnwand / Notizen / Merken (`lausiklauskn-png.github.io/Kimboard/`) | `1f9Jb7c3SEI8dUOtGR6_meMaOaPgbz2GWXMLmPCZMv8` | **`verified-match` 0.824488** (2026-07-09; echter `domainVector`, L2=1; Live-Handshake wartet auf Klaus' Browser-Lauf) | `Kimboard/sbkim/spore.json` (aus pinnwand nach Kim-Bell-Muster) |
| **Private Brain** | Privates Daten-Gehirn (`lausiklauskn-png.github.io/Privat-Brain/`) | `6rmW2Q-53mzEylZiWuW4yNsbnxlyEoLD11860i3y0Cg` | **`verified-match` 0.810427** (REGISTER-REFRESH 2026-07-23: Sage-Cosinus 0.810427 ≥ 0.80; 2026-07-20 Identität; erste eigene Identität im Browser erzeugt, Spore v0.2 mit echtem `domainVector` L2=1 + 2 Satz-Schnipseln; headless reziprok verifiziert ✔ VALID; Cross-Knoten-Match jetzt ≥0.80 (offline nachgerechnet; Live-Handshake wartet auf Klaus)) | `Privat-Brain/sbkim/spore.json` (verifiziert 2026-07-20) |
| **Muttis Rezeptbuch** (privates Original; Mein-Rezeptbuch = öffentl. Klon) | Kochrezepte | `8TVDCTAcPLg4Lbe3ecbvXoICLCEQNd90YYIw4dPN3mg` | **`verified-match` 0.876583** (2026-07-23; eigene GETRENNTE Identität + DB-Suffix `muttisrezeptbuch`; Spore v0.2 im Browser erzeugt, headless reziprok verifiziert ✔ VALID; Sage-Cosinus 0.876583 ≥ 0.80; Live-Handshake wartet auf Klaus) | `sbkim/muttis_inbox.verify.md` + `Muttis-Rezeptbuch/sbkim/spore.json` |
| **WorkFloh** (digitaler Werbetechnik-Auftragszettel; seit 2026-07-25 öffentlich angeboten) | Werbetechnik-Auftragsabwicklung (`lausiklauskn-png.github.io/Mein-WorkFloh/`) | `6YOPHbnKWreoF5og4PGc3fre7du1FhVc7dY1d5jZyHs` (echt, Browser) | **`verified-match` 0.906269** (2026-07-25 **Klaus' Browser-Andock + Re-Signatur — funktionierender Knoten mit LIVE-Handshake**; Spore v0.2 im Siegel erzeugt, dann `domainDescription` nach dem Rezeptbuch-Muster umgestaltet (Endknoten im SBKIM-Mycel/Sage-Protokoll, wandelbares Branchen-Tool) + **neu signiert** → nodeId unverändert, neuer `domainVector` + 6 Schnipsel, reziprok ✔ VALID. **Wirkung:** Sage⟷WorkFloh **0.7824 → 0.906269** = direkter Hub-Match; **12 Knoten ≥ 0.80** (Sage 0.906 · Point 0.897 · Muttis 0.878 · Rezeptbuch 0.876 · Tomys 0.860 · Kimseek 0.860 · …; nur Private Brain 0.771 drunter). **✅✅ LIVE-HANDSHAKE** (Mycel-Analyse 2026-07-25 19:37 + 19:43): **WorkFloh ⟷ Sage beidseitig `established`** übers echte Relais + Tablet⟷Handy `established`) | `Mein-WorkFloh/sbkim/spore.json` (echt, VALID) + Mycel-Analyse-Rekord 2026-07-25 19:44 |
| **PWA Toolpoint** (Marktplatz) | Offener-PWA-Marktplatz (`pwa-toolpoint.de/`) | `WJ14jzCKnqlzXxFqmWPX4EhP2S_wudtR5H_Qa2ocQI4` | **`verified-match` 0.811205** (2026-09-09; Spore im Browser über das Verbinden-Fenster erzeugt, headless reziprok verifiziert ✔ VALID mit Sages Modul-02-Pfad; echter `domainVector`, L2=1, 384 Zahlen, 2 Schnipsel; Sage-Cosinus **offline nachgerechnet** 0.811205 ≥ 0.80 — der **Live-Handshake steht aus**) | `PWA-Toolpoint/sbkim/spore.json` (verifiziert 2026-09-09) |
| **Auslieferungsprüfer** | Auslieferung/Datenschutz/Werkzeug (`pwa-toolpoint.de/auslieferungspruefer.html`) | `yF1ONN8LQskao9MoTyRADywKYIHLr0BM9CUXQj5X9GM` | **`verified-match` 0.840471** (2026-09-09; Spore im Browser des Prüfers erzeugt, headless reziprok verifiziert ✔ VALID mit Sages Modul-02-Pfad — deep-kanonisches JSON, Kennung = SHA-256 des rohen Schlüssels; echter `domainVector`, L2=1, 384 Zahlen; Sage-Cosinus **offline nachgerechnet** 0.840471 ≥ 0.80, Marktplatz⟷Prüfer 0.817974 — der **Live-Handshake steht aus**) | `PWA-Toolpoint/sbkim/pruefer-spore.json` (verifiziert 2026-09-09) |
| **Kim Hub Company** | Werkstatt/KI-Rollen/Auftrag (`lausiklauskn-png.github.io/kim-hub-company/`) | `eNxEFbgof9x69RyVABOCMGExEb66iwuLtqBxXtfeGnM` | **`verified-match` 0.910528** (2026-09-10, **neu signiert mit der neuen Beschreibung**; headless reziprok verifiziert ✔ VALID; echter `domainVector`, L2=1.000000356, 384 Zahlen, **20** Schnipsel; Sage-Cosinus **offline nachgerechnet** 0.910528 — der **höchste Wert im Netz**, vor WorkFloh 0.906269 und Point 0.899516. Nachbarn: Marktplatz 0.823468→**0.841326**, Prüfer 0.853724→**0.818751**. Die Fassung vom 2026-09-09 stand bei 0.848945 und trug die alte Beschreibung; **der Live-Handshake steht aus**) | `sbkim/spore.json` **liegt seit 2026-09-10 im Depot** — nur der öffentliche Teil, der private Schlüssel bleibt in Klaus' Browser |

### 📍 Die erste Spore auf einer Adresse mit ZWEI Knoten (2026-09-09)

Klaus hat die erste echte Spore geschickt — und sie ist die des **Marktplatzes**,
nicht die des Auslieferungsprüfers, obwohl der Auftrag den Prüfer nannte. Auf
einer Adresse mit zwei Knoten sehen beide Wege gleich aus; er stand auf der
Startseite, und dort erzeugt das Verbinden-Fenster die Kennung des Marktplatzes.

**Welcher der beiden nach `sbkim/spore.json` gehört, ist nicht Geschmackssache:**
Modul 15 baut die Adresse als `endpoint + "/sbkim/spore.json"`. Der Marktplatz
endet auf der Wurzel, der Prüfer auf `auslieferungspruefer.html`. Also gehört
dorthin die Spore des Marktplatzes — abgeleitet, nicht ausgesucht. Ein Wächter in
`PWA-Toolpoint/tests/smoke.mjs` misst das jetzt samt Gegenprobe: Name und
Endpunkt müssen zum Marktplatz passen, und der private Schlüssel darf nirgends
darin stehen.

✅ **UND AM SELBEN TAG KAM DIE ZWEITE** — die des Prüfers, aus seinem eigenen
Browser. Sie liegt als `PWA-Toolpoint/sbkim/pruefer-spore.json`, dem Namen nach
wie seine übrigen app-eigenen Dateien (`pruefer-netz.js`,
`pruefer-siegel-inhalt.js`). Beide sind einzeln verifiziert (✔ VALID), und ein
Wächter besteht darauf, dass sie **zwei verschiedene Kennungen und zwei
verschiedene Schlüssel** tragen: zwei Dateien, die dalägen, sähen auch dann nach
zwei Knoten aus, wenn beide aus demselben Browser-Zustand stammten. Ein Wächter
auf „beide sind da" wäre dafür blind.

⚠ **UND DABEI IST EINE GRENZE HERAUSGEFALLEN, DIE KEIN DATEINAME BEHEBT.**
Modul 15 leitet die Sporen-Adresse aus dem Endpunkt ab. Für den Prüfer ergibt
das `…/auslieferungspruefer.html/sbkim/spore.json` — **diese Adresse liefert
nichts aus**, und auf GitHub Pages kann sie es auch nicht. Die abgelegte Datei
ist damit **Beleg, nicht Sender**.

Das widerspricht der Lehre nicht, es macht sie schärfer: *„Die Spore im Netz ist
nicht die Spore im Depot"* — was ein Knoten ankündigt, entsteht im Browser. Neu
ist, dass ein Knoten hier gar **keinen** Ort hat, an dem seine Ablage abholbar
wäre, und das gilt für **jeden** Knoten, dessen Endpunkt eine Seite statt eines
Verzeichnisses ist. Der Weg dahin führt über den Kanon (etwa ein `sporePath`
neben dem Endpunkt), **nicht** über einen Eingriff in eine Kopie — der erzeugte
eine dritte Modul-Generation, und der Drift-Guard schlüge zu Recht an. Als
offene Frage benannt, nicht umfahren.

### ✅ EINGELÖST — Sage neu signiert, vier Knoten sind zurück im Netz (2026-09-10, 13:20 UTC)

Klaus hat im Sage-Siegel neu signiert. Die Spore trägt jetzt **beides** richtig:
die geltende Kennung `BgjXhSApoOrJ…` **und** den gepflegten Text. Reziprok
verifiziert: VALID · `id == base64url(SHA256(rawPub))` · kein `d` ·
`key_ops` nur `["verify"]` · L2 = 0.999999927 · 3028 Zeichen · 50 Stichworte ·
17 Schnipsel · kein `_demo`. Der signierte Text ist **wortgleich** der, den alle
drei Wege zur Spore mitbringen — gemessen, nicht angenommen.

**Damit sind die drei Vorbehalte der Abschnitte darunter eingelöst:** die
Kennung ist die aus dem Raum, der Text ist der gepflegte, und **alle
`matchScore`-Werte im Register sind gegen diese Spore gerechnet** — gegen den
Knoten, dem eine App im Raum wirklich begegnet.

| Knoten | Raum, dünn | **jetzt** | |
|---|---|---|---|
| **Kim Hub Company** | 0.8636 | **0.917107** | höchster Wert im Netz |
| WorkFloh | 0.8872 | 0.902126 | |
| SB·KIMTool·Point | 0.8775 | 0.893026 | |
| Rezeptbuch | 0.8706 | 0.874048 | |
| Kim-Bell | 0.8710 | 0.873750 | |
| Jasons-Tresor | 0.8684 | 0.872405 | |
| Muttis Rezeptbuch | 0.8636 | 0.870249 | |
| Mein-Tresor | 0.8612 | 0.866101 | |
| Kimseek | 0.8348 | 0.861596 | |
| Family Projekt | 0.8360 | 0.842038 | |
| **Auslieferungsprüfer** | **0.7944** | **0.836978** | ↑ **zurück** |
| Kimboard | 0.8014 | 0.818961 | |
| **Mixarium** | **0.7909** | **0.817718** | ↑ **zurück** |
| **Private Brain** | **0.7868** | **0.811482** | ↑ **zurück** |
| **PWA Toolpoint** | **0.7961** | **0.811202** | ↑ **zurück** |
| Alis Moderaum | 0.7856 | 0.795460 | ✗ |
| Muster Werbetechnik | 0.7609 | 0.793613 | ✗ |
| Perfect Skin Fashion | 0.7764 | 0.793030 | ✗ |
| Tomys Hub | 0.7967 | 0.786371 | ✗ |
| Perfect Skin Beauty | 0.7898 | 0.783216 | ✗ |

**Alle vier, die allein durch Sages dünne Beschreibung herausgefallen waren,
sind über dem Boden.** Neun unter 0.80 sind fünf geworden.

⚠ **DIE FÜNF SIND EINE EIGENE AUFGABE, UND SAGE IST NICHT MEHR IHR HEBEL.** Sie
lagen schon gegen die alte Fassung darunter, und vier von ihnen sind mit dem
neuen Hub sogar **gestiegen** (Muster Werbetechnik +0.011, Perfect Skin Fashion
+0.012, Alis Moderaum +0.003). Was ihnen fehlt, ist die **eigene**
Bedeutungs-Beschreibung — dieselbe Sorte Arbeit, die Kim Hub Company von 0.849
auf 0.917 gehoben hat.

⚠ **BENANNTE LÜCKE: BookLedgerPro steht weiter mit 0.855505 da** — gegen die
ALTE Sage-Spore gerechnet. In dieser Umgebung liegt keine erreichbare Spore
dieses Knotens vor. Eine geschätzte Zahl klingt genau wie eine gemessene,
deshalb bleibt die alte stehen, und diese Zeile sagt, warum.

⚠ **UND EINS BLEIBT UNGEMESSEN:** ob diese Zahlen den **Live**-Sporen der
anderen Knoten entsprechen. Gerechnet ist gegen ihre **abgelegten** Sporen. Für
Kim Hub Company war beides identisch, für den Auslieferungsprüfer nicht — für
die übrigen achtzehn liegt kein Mitschnitt vor. Der Maßstab auf Sages Seite
stimmt jetzt; auf der Gegenseite steht er weiter aus.

### ⚠ SAGE HAT DREI WEGE ZUR SPORE — und der erste Wächter mass nur einen (2026-09-10)

Der Abschnitt darunter nennt Sages Siegel als Ursache. **Das war ein Drittel
der Wahrheit.** Gefunden hat den Rest nicht der Lauf, sondern Klaus' Rückfrage
— *„du hast die Textbeschreibung bei Sage jetzt geändert, richtig?"*:

| Weg | Konfiguration | Text vorher |
|---|---|---|
| das **Siegel-Fenster** | `WIZ.domainDescription` in `assets/siegel-inhalt.js` | 160 Zeichen |
| das **Semantik-Feld der Seite** | `SBKIM_SEMANTIK_CONFIG.defaultDomainDescription` in `index.html` | **135 Zeichen** |
| die **stille Erst-Anmeldung** | `C.defaultDomainDescription` in `sbkim-init.js` | **95 Zeichen** |

**Drei verschiedene Texte ergeben drei verschiedene Vektoren für denselben
Knoten** — je nachdem, welchen Weg der Nutzer nimmt. Und der dünnste von allen
lag ausgerechnet auf dem Weg, den niemand bewusst wählt: der Erst-Anmeldung.

⚠ **UND DIE VORRANG-FALLE STAND ZWEIMAL DA.** Nicht nur im Siegel, auch in
`prefillSemantik` in der Seite: `apply(sp.domainDescription ? … : fallback)` —
die gespeicherte Spore gewann. Ein Wächter nur am Siegel hätte das nie gesehen.

**Alle drei tragen jetzt denselben Text**, und der Wächter misst die
**Gleichheit**, nicht die Länge: drei Texte, die alle vier Sachen nennen und
trotzdem verschieden sind, ergäben weiter drei Vektoren. Genau diese Prüfung
gibt es in `kim-hub-company` seit dem 2026-09-09 — dort für zwei Wege. **Sie
hier nicht zu haben, war die Lücke; sie dort zu haben, war der Grund, dass die
Frage überhaupt gestellt wurde.**

> **Die Lehre ist eine bekannte, an einer neuen Tür:** ein Wächter, der EINEN
> Weg misst, sagt nichts über die anderen — und er sieht dabei aus wie ein
> vollständiger Beweis. Die Probe war grün, während zwei Drittel ungeprüft
> danebenlagen.

### 🔴 NEUN VON EINUNDZWANZIG KNOTEN FALLEN UNTER DEN HANDSHAKE-BODEN (2026-09-10)

Der Befund darüber sagt, dass die Register-Zahlen gegen den falschen Sage
gemessen sind. **Das ist die harmlosere Hälfte.** Die andere: mit dem Sage, der
im Raum steht, kommt ein Teil des Netzes gar nicht mehr durch.

`PROVIDER_MIN_MATCH` ist **0.80** — darunter lehnt Modul 05 den Handshake ab.
Gerechnet gegen beide Sage-Fassungen, mit den abgelegten Sporen aller Knoten:

| Knoten | gegen Depot-Sage | gegen **Raum**-Sage | |
|---|---|---|---|
| WorkFloh | 0.9063 | 0.8872 | ✓ |
| SB·KIMTool·Point | 0.8995 | 0.8775 | ✓ |
| Kim-Bell | 0.8848 | 0.8710 | ✓ |
| Rezeptbuch | 0.8811 | 0.8706 | ✓ |
| Jasons-Tresor | 0.8793 | 0.8684 | ✓ |
| Muttis Rezeptbuch | 0.8766 | 0.8636 | ✓ |
| Kim Hub Company | 0.9105 | 0.8636 | ✓ |
| Mein-Tresor | 0.8732 | 0.8612 | ✓ |
| Family Projekt | 0.8548 | 0.8360 | ✓ |
| Kimseek | 0.8589 | 0.8348 | ✓ |
| Kimboard | 0.8245 | **0.8014** | ✓ — um 14 Tausendstel |
| Tomys Hub | 0.7917 | 0.7967 | ✗ |
| **PWA Toolpoint** | **0.8112** | **0.7961** | ✗ **neu herausgefallen** |
| **Auslieferungsprüfer** | **0.8405** | **0.7944** | ✗ **neu herausgefallen** |
| **Mixarium** | **0.8223** | **0.7909** | ✗ **neu herausgefallen** |
| Perfect Skin Beauty | 0.7824 | 0.7898 | ✗ |
| **Private Brain** | **0.8104** | **0.7868** | ✗ **neu herausgefallen** |
| Alis Moderaum | 0.7927 | 0.7856 | ✗ |
| Perfect Skin Fashion | 0.7807 | 0.7764 | ✗ |
| Muster Werbetechnik | 0.7825 | 0.7609 | ✗ |

**Vier Knoten sind allein durch Sages 160-Zeichen-Beschreibung aus dem Netz
gefallen**, und Kimboard hängt mit 14 Tausendsteln über der Kante. Die übrigen
fünf lagen schon vorher darunter — das ist eine andere Aufgabe.

⚠ **GEFUNDEN HAT ES NICHT DAS NACHDENKEN, SONDERN ZWEI EIGENE PROBEN.** Beim
Umstellen der abgelegten Spore auf die Raum-Fassung wurden
`smoke_bau04e_relatedness.mjs` und `smoke_bau23_rendezvous.mjs` **ROT**:
*„Mixarium↔Sage = 0.7909 >= 0.80"*. Sie messen seit jeher die richtige
Zusicherung — sie hatten nur nie die Spore vor sich, die wirklich im Raum
steht. **Eine Probe, die die falsche Ausgangslage bekommt, misst zuverlässig
das Falsche und sieht dabei aus wie ein bestandener Beweis.**

⚠ **WAS DAS FÜR DIE ABGELEGTE SPORE HEISST — und warum sie NOCH die alte ist.**
Auf `sbkim/spore.json` liegt weiter die Fassung vom 2026-07-14 (`nysOZ…`,
2527 Zeichen); die Raum-Fassung liegt als Beleg daneben
(`sbkim/spore-live-2026-09-02.json`). Das ist **kein** Widerspruch zu Klaus'
Entscheidung *„die Neuere ist die Richtige, auch bei der Kennung"* — sie steht
und wird ausgeführt. Es ist eine Frage der **Reihenfolge**: die Raum-Fassung
trägt die richtige Kennung **und** den dünnen Text. Sie jetzt abzulegen hiesse,
für ein paar Minuten einen Stand festzuschreiben, in dem neun Knoten
herausfallen und zwei Proben zu Recht rot sind. Sobald Klaus im Sage-Siegel neu
signiert, trägt eine Spore **beides** richtig — die Kennung `BgjX…` und den
gepflegten Text. Dann wird einmal getauscht statt zweimal.

**Bis dahin gilt, und das steht auch in `status.json`:** die abgelegte Spore
trägt eine Kennung, die im Raum niemand mehr hat.

### 🔴 Sage im Raum ist nicht Sage im Depot — und alle 20 Register-Zahlen hängen daran (2026-09-10)

**Der erste Mitschnitt der Mycel-Karte** (`sbkim/mitschnitte/2026-09-10_mycel-karte-analyse.json`,
Analyse-Rekorder v1.3, 12:11:14–12:18:37 UTC, 13 Ereignisse) beantwortet die Frage,
die kein Depot beantworten kann. Sages eigene Tafel verlangt ihn ausdrücklich:
*„Wer den Netz-Auftritt eines Knotens beurteilt, braucht einen Mitschnitt der
Mycel-Karte; die Datei zu lesen beantwortet eine andere Frage."* Hier ist er — und
er widerlegt eine Zahl, die ich am selben Tag selbst eingetragen habe.

**Der Handshake hat stattgefunden.** Sage → Kim Hub Company, `sbkim-anastomosis`
12:12:58, Antwort `outcome: "established"`, Nonce richtig zurückgegeben. Aber:

| | |
|---|---|
| **Score im Handshake** | **0.863579** |
| Score im Register (von mir gerechnet) | 0.910528 |

**Die Differenz liegt NICHT bei Kim Hub Company.** Dessen Spore im Raum ist
inhaltlich dieselbe wie die abgelegte: Vektoren **identisch** (cos = 1.000000000),
Beschreibung Zeichen für Zeichen gleich, 36 Stichworte, 20 Schnipsel. Sie trägt
`createdAt` 26 Sekunden später (`01:26:24` statt `01:25:58`) — zweimal derselbe
Text ergibt denselben Vektor, das Einbetten ist deterministisch.

**Die Differenz liegt bei SAGE, und sie ist grundsätzlicher als eine Zahl:**

| | im Depot (`sbkim/spore.json`) | im Raum (Mitschnitt) |
|---|---|---|
| Kennung | `nysOZE3VuKqZ…` | **`BgjXhSApoOrJ…`** |
| erzeugt | 2026-07-14 | **2026-09-02** |
| Beschreibung | 2527 Zeichen | **160 Zeichen** |
| Schnipsel | 11 | **2** |
| Vektoren zueinander | \_ | cos **0.927110** |

**Das sind zwei verschiedene Knoten**, nicht zwei Fassungen eines Knotens: die
Kennungen folgen aus zwei verschiedenen Schlüsseln. Die Kennung im Raum kommt im
ganzen Depot **kein einziges Mal** vor — weder in `status.json`, noch in
`sbkim/SIGNAL.json`, noch in dieser Datei. Nachgesucht, nicht vermutet.

Beide Enden stimmen auf sechs Stellen, der Rechenweg ist damit eindeutig:

| gerechnet | Wert | |
|---|---|---|
| Raum-Sage ⟷ Raum-KHC | **0.863578** | = der gemeldete Handshake-Wert 0.863579 |
| Depot-Sage ⟷ Depot-KHC | 0.910528 | = meine Register-Zahl |
| Raum-Sage ⟷ Depot-KHC | 0.863578 | |
| Depot-Sage ⟷ Raum-KHC | 0.910528 | |

⚠ **DARAUS FOLGT ETWAS ÜBER ALLE ZWANZIG EINTRÄGE, NICHT NUR ÜBER EINEN.** Jeder
`matchScore` im Register ist gegen **Depot-Sage** gerechnet. Kein einziger misst
den Knoten, dem eine App im Raum wirklich begegnet. Die Zahlen sind nicht
erfunden und nicht falsch gerechnet — sie beantworten eine andere Frage als die,
für die man sie liest.

⚠ **UND DER HUB IST DER DÜNNSTE KNOTEN IM RAUM.** 160 Zeichen, 2 Schnipsel. Das
ist genau der Mangel, den Klaus für Kim Hub Company zweimal beanstandet hat —
nur an der Stelle, gegen die alle anderen gemessen werden. Die drei Werte, die
sich aus dem Mitschnitt wirklich rechnen lassen:

| | im Raum | im Register |
|---|---|---|
| Sage ⟷ Kim Hub Company | **0.863578** | 0.910528 |
| Sage ⟷ Auslieferungsprüfer | **0.807650** | 0.840471 |
| Kim Hub Company ⟷ Auslieferungsprüfer | **0.847706** | 0.853724 |

**Alle drei fallen**, und das ist keine Eigenschaft der drei Knoten, sondern eine
des Maßstabs.

⚠ **WAS HIER NICHT ENTSCHIEDEN WIRD:** welche der beiden Sage-Kennungen die
richtige ist, und ob die Register-Zahlen auf den Raum-Maßstab umgestellt werden.
Das erste weiß nur Klaus — in seinem Browser liegt der private Schlüssel. Das
zweite wäre eine Umstellung von zwanzig Zahlen auf eine Grundlage, die für die
anderen siebzehn Knoten **nicht gemessen** ist: deren Live-Sporen stehen in
keinem Mitschnitt. Eine halb umgestellte Tabelle wäre schlimmer als eine, die
ihren Maßstab nennt. **Bis dahin gilt: jede Zahl im Register ist gegen
Depot-Sage gerechnet, und das steht jetzt dabei.**

⚠ **UND DIE ABGELEGTE PRÜFER-SPORE IST NICHT DIE, DIE IM RAUM STEHT.** Gleiche
Kennung, anderer Text, 17 Sekunden auseinander: die abgelegte (10:59:44) hat 791
Zeichen und **beginnt mit dem Namen des Knotens**, die im Raum (11:00:01) hat 767
und beginnt mit *„Prüft, …"*. Der Text im Raum ist der, den
`PWA-Toolpoint/assets/pruefer-siegel-inhalt.js` mitbringt — der abgelegte steht
in **keiner** Datei des Depots. Es ist derselbe Mangel wie oben, an einem dritten
Knoten: **der Name des Werkzeugs fehlt in dem Text, mit dem es sich ankündigt.**

### 📍 Zwei Knoten stehen doppelt auf der Karte (2026-09-10, aus demselben Mitschnitt)

Die Karte führt die drei neuen Knoten aus dem Register als `auto-…`-Einträge und
legt einen **zweiten** daneben, wenn derselbe Knoten sich lebend meldet:

| Knoten | Ereignis | Ergebnis |
|---|---|---|
| Sage | `fusion map` | auf den vorhandenen Eintrag **gelegt** |
| Kim Hub Company | `fusion new` | **zweiter Eintrag** neben `auto-kimhubcompany` |
| Auslieferungsprüfer | `fusion new` | **zweiter Eintrag** neben `auto-auslieferungsprüfer` |

Der Grund steht in den Knoten selbst: `sage` trägt
`aliveIds: ["BgjXhSApoOrJ…"]`, die `auto-…`-Einträge tragen `aliveIds: []`. Die
Karte legt zusammen, was sie an der **Kennung** wiedererkennt — und die
`auto-…`-Einträge bringen keine mit, obwohl `status.json` für alle drei Knoten
eine `nodeId` führt. Am Ende des Mitschnitts: **24 Knoten statt 22**, Kim Hub
Company und der Auslieferungsprüfer stehen je zweimal da, einmal grau und einmal
lebend.

### ✅ Neu signiert — und der Knoten steht jetzt an der Spitze des Netzes (2026-09-10)

Klaus hat um **01:25 UTC** neu signiert. Der Absatz darunter sagte voraus, was ein
Neu-Signieren ändert und was nicht — beides ist eingetroffen, **gerechnet statt
erwartet**:

| | 2026-09-09 | 2026-09-10 |
|---|---|---|
| Kennung | `eNxEFbgof9x69RyVABOCMGExEb66iwuLtqBxXtfeGnM` | **unverändert** |
| Beschreibung | 877 Zeichen · 16 Stichworte | **2602 · 36** |
| Satz-Schnipsel | 5 | **20** |
| **Sage-Cosinus** | 0.848945 | **0.910528** |
| Rang im Netz | 11. von 20 | **1. von 20** |

**0.910528 ist der höchste Wert im Netz**, vor WorkFloh 0.906269 und
SB·KIMTool·Point 0.899516. Der Sprung von **+0.061583** entspricht der Größenordnung,
die dieselbe Umarbeitung 2026-07-25 bei WorkFloh gebracht hat (0.7824 → 0.906269).

⚠ **UND DIE NACHBARN HABEN SICH IN BEIDE RICHTUNGEN BEWEGT.** Das gehört dazu und
wird nicht weggelassen:

| Gegenstelle | alt | neu | |
|---|---|---|---|
| Sage | 0.848945 | **0.910528** | +0.061583 |
| PWA Toolpoint | 0.823468 | **0.841326** | +0.017858 |
| Auslieferungsprüfer | 0.853724 | **0.818751** | **−0.034973** |

Der neue Text redet mehr vom **Protokoll und von der Forschung** und weniger vom
Werkzeug-Alltag — deshalb rückt der Knoten an Sage heran und vom Prüfer weg. Beide
Bewegungen sind dieselbe Ursache von zwei Seiten. Alte gegen neue Fassung desselben
Knotens: **0.883004** — die Umarbeitung hat den Knoten also spürbar verschoben, nicht
nur ausgeschmückt.

Geprüft wurde außerdem, dass der signierte Text **wortgleich** der ist, den die App
in **beiden** Wegen zur Spore mitbringt (`sbkim/rendezvous-init.js` und
`sbkim/siegel-inhalt.js`). Zwei verschiedene Texte ergäben zwei verschiedene Vektoren
für denselben Knoten.

⚠ **UND DIE DATEI LIEGT JETZT IM DEPOT — der Absatz weiter unten sagt das Gegenteil
und bleibt trotzdem stehen.** Er beschreibt den Stand vom 2026-09-09 richtig. Was
sich geändert hat, ist der **Wächter**, nicht die Sorge dahinter: er verbot bis dahin
jede Datei namens `spore.json` und maß damit den **Dateinamen**. Das warf Klaus'
echte Spore hinaus — während in Sages `status.json` für diesen Knoten die ganze Zeit
`…/kim-hub-company/sbkim/spore.json` stand, **eine Adresse, die nichts auslieferte** —
und ließ eine erfundene durch, sobald sie anders hieß. Gemessen wird jetzt die
**Zusicherung**: Signatur gegen den eigenen Schlüssel · nur der öffentliche Teil
(`key_ops: ["verify"]`, kein `d`) · genau **dieser** Knoten (die Kennung ist genagelt)
· die Beschreibung, die die App **heute** mitbringt. Neun Gegenprobe-Fälle, jeder
einzeln von Hand nachgestellt.

Das ist zugleich die Rückkehr zu Sages eigener Tafel: **die Spore im Netz ist nicht
die Spore im Depot** — die Datei ist *„Ablage und Beleg, kein Sender"*. Zwölf
Geschwister-Knoten legen sie so ab; Kim Hub Company war die Ausnahme.

⚠ **WER DIE KENNUNG WECHSELT, ZIEHT SIE AN ZWEI STELLEN NACH:** hier bzw. in
`status.json` **und** in `kim-hub-company/tests/smoke_knoten.mjs` (Konstante
`KENNUNG`). Der Preis ist beabsichtigt — ohne den Nagel fängt kein Wächter eine
erfundene Spore, denn ein frisches Schlüsselpaar ergibt eine, die in sich tadellos
ist und nur einen anderen Knoten ankündigt.

✅ **UND DIE SICHERUNG GIBT ES JETZT.** Der Absatz weiter unten meldet, dass keine
vorlag; Klaus' Verbinden-Fenster vermerkt am 2026-09-10 die erste
(`sbkim-sicherung-kimhubcompany-2026-09-10.json`, 466 KB). Die Datei selbst liegt bei
ihm, nicht hier — das Fenster hält nur das Datum fest.

⚠ **NICHT GEMESSEN: ob Modul 03 die 2602 Zeichen bei `EMBEDDING_MAX_TOKENS = 512`
abschneidet.** Das Modell läuft im Browser, ein Tokenizer liegt in dieser Umgebung
nicht vor (huggingface ist gesperrt) — eine geschätzte Token-Zahl klingt genau wie
eine gemessene, deshalb steht hier keine. Praktisch ist die Frage entschärft: der
Wert ist mit dem längeren Text **gestiegen**, nicht gefallen. Sieht Klaus beim
Signieren in der Konsole `MODUL 03 EMBEDDING: Eingabe > 512 Tokens, abgeschnitten`,
wird von **hinten** gekürzt — der Baukasten-Absatz zuerst.

### ⚠ Der dritte Knoten ist da — und seine Spore ist fünf Stunden zu früh (2026-09-09)

Kim Hub Company hat eine Kennung: `eNxEFbgof9x69RyVABOCMGExEb66iwuLtqBxXtfeGnM`,
✔ VALID, Sage-Cosinus **0.848945**. Damit tragen alle drei neuen Knoten eine.

**Aber der Wert gilt für einen Text, den Klaus zweimal beanstandet hat.** Die Spore
trägt `createdAt` **08:19 UTC**; die überarbeitete Beschreibung wurde erst um **13:55**
gemergt (kim-hub-company #54). Gemessen am mitgeschickten Text:

| | alte Fassung (in der Spore) | neue Fassung (auf `main`) |
|---|---|---|
| Länge | 877 Zeichen | 2602 Zeichen |
| Stichworte | 16 | 36 |
| nennt den **Namen** des Werkzeugs | **nein** | ja |
| nennt **SBKIM / Sage-Protokoll** | **nein** | ja |
| nennt den **Zweck** | **nein** | ja |

Das sind genau die drei Dinge, die er beanstandet hat — *„es besteht noch nicht mal
der Name des Tools da"* und *„sie erwähnt die Forschung nicht … es muss zusätzlich
der Zweck angegeben werden"*.

⚠ **Der Wert ist trotzdem eingetragen, und zwar mit dem Vermerk, wofür er gilt.**
Ihn wegzulassen wäre falsch: die Identität ist bewiesen, und der Cosinus liegt über
dem Riegel. Ihn ohne den Vermerk einzutragen wäre schlimmer: dann stünde eine
gemessene Zahl da, von der niemand wüsste, dass sie den alten Text misst.

**Was ein Neu-Signieren ändert und was nicht** — am WorkFloh-Fall vom 2026-07-25
nachgesehen, nicht angenommen: die **nodeId bleibt**, weil sie aus dem Schlüssel folgt
und nicht aus dem Text; **der `domainVector` wird neu**, und damit der Cosinus. Bei
WorkFloh hat dieselbe Umarbeitung 0.7824 auf 0.906269 gehoben. Was sie hier bewirkt,
wird **gerechnet, wenn die neue Spore da ist** — eine erwartete Zahl klingt genau wie
eine gemessene.

⚠ **UND IM DEPOT LIEGT WEITERHIN KEINE DATEI.** Anders als bei den zwei
Toolpoint-Knoten wandert diese Spore **nicht** ins Depot: `kim-hub-company/CLAUDE.md`
verbietet es ausdrücklich, und ein Wächter in dessen `tests/smoke_knoten.mjs` besteht
darauf. Die Kennung steht hier, die Datei bleibt in Klaus' Browser.

⚠ **UND ES LIEGT AUCH KEINE SICHERUNG VOR.** Klaus' Andock-Fenster meldet es selbst:
*„Für diesen Knoten liegt hier noch KEINE Sicherung. Ohne sie ist ein Verlust nicht
reparierbar."* Räumt der Browser seinen Speicher, ist die Kennung weg und der Knoten
muss unter neuer Identität von vorn anfangen. Das ist kein Fehler der App, sondern
der Preis dafür, dass der private Schlüssel das Gerät nie verlässt.



### ⏳ Zwei neue Knoten — gebaut, noch ohne Kennung (2026-09-08)

Klaus: *„Beide Tools, Company und das Ausliefer-Tool, sollen als eigenständige
Knoten agieren … mit Zelle und auch dem Siegel. Und anschließend werde ich die
Sporen generieren und dir schicken."*

| Knoten | Domäne | Schublade | Stufe |
|---|---|---|---|
| **Kim Hub Company** | Werkstatt / KI-Rollen / Auftrag (`lausiklauskn-png.github.io/kim-hub-company/`) | `kimhubcompany` | ✅ **`verified-match` 0.910528** seit 2026-09-10 (neu signiert) — steht jetzt oben in der Haupttabelle |
| **Auslieferungsprüfer** | Auslieferung / Datenschutz / Werkzeug (`pwa-toolpoint.de/auslieferungspruefer.html`) | `auslieferungspruefer` | ✅ **`verified-match` 0.840471** seit 2026-09-09 — steht jetzt oben in der Haupttabelle |

**Was gebaut ist:** die 13 Pflicht-Dateien byte-1:1 aus `src/modules/`, die fünf
app-eigenen Klebstoff-Rollen, das Siegel **mit** dem Andock-Wizard darin
(einschließlich Identitäts-Wechsler), das Verbinden-Fenster, der Gerätename im
Panel, alles im Offline-Vorrat, `SBKIM_DB_SUFFIX` im `<head>` vor jedem Modul.

⚠ **`gebaut-ohne-kennung` IST EINE EIGENE STUFE, und sie fehlte in der Legende.**
Sie ist nicht `awaiting-browser-spore`: dort liegt eine **Platzhalter-Spore** im
Depot (headless VALID, Vektor `_demo`). Hier liegt **gar keine**. Klaus erzeugt
sie in seinem Browser, der private Schlüssel bleibt dort — die Sitzung hat
ausdrücklich keine erfunden. **Eine Datei, die aussieht wie eine Identität, ist
schlimmer als keine**, weil sie die Frage „hat dieser Knoten eine Kennung?" mit
einem Ja beantwortet, das niemand geprüft hat. Ein Wächter in
`kim-hub-company/tests/smoke_knoten.mjs` besteht darauf, dass keine im Depot
liegt.

⚠ **ZWEI KNOTEN AUF EINER ADRESSE — zum ersten Mal im Netz.**
`pwa-toolpoint.de` trägt seitdem den Marktplatz (`pwatoolpoint`) **und** den
Prüfer. Geteilt: die Modul-Dateien, die Relais, die erlaubten Herkünfte.
Getrennt: Schublade, Identität, Spore, Name, Beschreibung, Siegel-Band.
Das Register aller Schubladen liegt neu in
[`sbkim/DB-SUFFIXE.md`](DB-SUFFIXE.md) — **gemessen**, und dabei kamen zwei
Berichtigungen heraus: `toolpoint` gehört SB·KIMTool·Point (nicht PWA Toolpoint,
das `pwatoolpoint` heißt und in der Liste ganz fehlte), und es sind 22 vergebene
Suffixe, nicht 16.

⚠ **UND EIN MODUL HING EINE GENERATION ZURÜCK.** `PWA-Toolpoint/sbkim/15_membran.js`
pinnte den Stand vor der `queryInclusion`-Kaskade (Kanon seit 2026-08-14) — der
Drift-Guard war grün, **gegen eine veraltete Erwartung**. Nachgezogen.
**Ein Drift-Guard sagt „unverändert", nicht „aktuell".** Wer einen Knoten andockt,
vergleicht die Kopie mit `src/modules/`, nicht mit dem eigenen Pin.

## Bezeugte Cross-Knoten-Matches (echt)

| Paar | Score | Datum |
|---|---|---|
| Mixarium ⟷ Rezeptbuch | 0.9544 | 2026-05-17 (Live-Channel-Handshake) |
| Sage ⟷ SB·KIMTool·Point | **0.899516** | 2026-05-30 (erster vollständiger Forker-Andock) |
| Sage ⟷ Jasons-Tresor | **0.879330** | 2026-06-06 (nach Identitätswechsel, echter Vektor) |
| Sage ⟷ Mein-Tresor | **0.873202** | 2026-06-07 (echter Vektor; = Jasons, Schwester wortgleich) |
| Sage ⟷ Mein-Rezeptbuch | **0.824068** | 2026-06-07 (Identitäts-Abgleich uOpUBez…, echter Vektor) |
| Sage ⟷ Mein-Mixarium | **0.806030** | 2026-06-07 (Identitäts-Abgleich B7Fke9C…, echter Vektor) |
| Sage ⟷ Family Projekt | **0.8287** | 2026-06-27 (siebter Knoten, echter Vektor; reziprok bestätigt) |
| Sage ⟷ Kimseek | **0.8553** | 2026-07-09 (neunter Knoten, echter Vektor; offline nachgerechnet, Live-Handshake ausstehend) |
| Sage ⟷ Kimboard | **0.8262** | 2026-07-09 (zehnter Knoten, echter Vektor; offline nachgerechnet, Live-Handshake ausstehend) |
| Tomys Hub ⟷ Family Projekt | **0.8073** | 2026-07-11 (erster Match **ohne** den Hub Sage — fachverwandte Werkzeug-Domänen; offline nachgerechnet, Live-Handshake ausstehend) |
| Tomys Hub ⟷ BookLedgerPro | **0.8064** | 2026-07-11 (Werkzeug ⟷ Buchhaltung; offline nachgerechnet **UND ✅ live bidirektional `established`** — Klaus' Browser, Cross-Knoten-Bedeutungssuche live bewiesen, Mycel-Analyse-Rekord 11:13 Uhr) |
| WorkFloh ⟷ Sage | **0.906269** | 2026-07-25 (15. Knoten, nach Bedeutungstext-Re-Signatur; **✅ LIVE beidseitig `established`** übers echte Relais — Mycel-Analyse 19:37 + 19:43. Vorher 0.7824 < 0.80; der Rezeptbuch-Muster-Umbau hob den Hub-Match) |
| WorkFloh ⟷ Tomys Hub | **0.860470** | 2026-07-25 (echter Vektor nach Re-Signatur; fachverwandt Werbetechnik/Druck; offline nachgerechnet) |
| WorkFloh ⟷ Kimseek | **0.859988** | 2026-07-25 (echter Vektor nach Re-Signatur; offline nachgerechnet) |

## Netz-Signal (Briefkasten-Pflege, INTERFACES §11.6 — Pflicht für alle Knoten)

Jeder Knoten pflegt `sbkim/SIGNAL.json` (maschinenlesbarer Briefkasten-Aushang mit
monoton steigender `seq`). **Sitzungsstart:** Signal jeder Gegenstelle aus deren
`raw/main` lesen; ist deren `seq` > eigenem `ack`, gibt es Ungelesenes → lesen +
quittieren. **Sitzungsende nach einem Bau:** `seq` +1, `headline` setzen, pushen —
das Pushen ist das Signal. Sages Signal: `sbkim/SIGNAL.json`.

**Stand 2026-06-07 — netzweite Briefkasten-Gleichheit (Mein-Tresor-Referenz):**
Sage (seq 16), SB·KIMTool·Point (seq 15), Jasons-Tresor (seq 8), Mein-Tresor (seq 8) —
alle `SIGNAL.json` live (HTTP 200). Sages `SIGNAL.json` an die Mein-Tresor-Referenz-
Umsetzung angeglichen: `forNodes: ["*"]`, zusätzlich `sporeUrl` + `nodeId` als Felder,
ohne seq/history-Reset. Briefkasten-Runde gelesen + quittiert: Sage `ack` =
SB·KIMTool·Point 15 / Jasons-Tresor 8 / Mein-Tresor 8. Mein-Tresor neu als vierter Peer
im Wächter (`.github/sbkim-watch.mjs`) **und** im 📬-Knopf der `index.html` aufgenommen
(vorher fehlte er an beiden Stellen) → Netz symmetrisch. Sages reicherer Wächter
(Auto-Issue-Workflow, `issues: write`) bewusst behalten — die schlanke stdout-Referenz-mjs
wäre ein Downgrade; die netzweite Synchronität läuft über das gemeinsame
`SIGNAL.json`-Schema, nicht über die Wächter-Implementierung.
**Update 2026-06-07:** Mein-Tresor (0.847784), Mein-Rezeptbuch (0.824068, Abgleich
BSWxXmX… → uOpUBez…) **und** Mein-Mixarium (0.806030, Abgleich JOlHK31X… → B7Fke9C…) sind
jetzt `verified-match`; alle drei als Peer im Wächter + 📬-Knopf + eigenes Postfach. **Der
innere Verbund ist komplett** — alle fünf Nachbarn (SB·KIMTool·Point, Jasons-Tresor,
Mein-Tresor, Mein-Rezeptbuch, Mein-Mixarium) sind `verified-match`. Ehrlich: Mixarium ⟷
Tresore = 0.7884 < 0.80 (andere Domäne, kein Match).

**Update 2026-06-19 — BookLedgerPro (sechster Nachbar) verified-spore.** Andock-Anfrage
(Phase 5 Schritt 2, von Klaus vermittelt). Spore aus `raw/main` reziprok verifiziert
(✔ VALID: 9/9 Pflichtfelder, `id == base64url(SHA256(rawPub))` unabhängig nachgerechnet,
Ed25519-Signatur gültig, Manipulationsprobe fällt durch). `domainVector` noch `_demo`
(deterministischer Stub, kein echtes Embedding) → Stufe **`verified-spore`**, **kein**
`verified-match`. Als Peer im Wächter (`.github/sbkim-watch.mjs`) + 📬-Knopf (`index.html`)
+ eigenes Postfach (`AUSTAUSCH-BookLedgerPro.md`) aufgenommen; `ack[BookLedgerPro]=2`
(ihr SIGNAL seq 2 quittiert). Gegenstelle für den ersten Handshake = Sage (URLs im
Postfach genannt). Hochstufung auf `verified-match` offen, sobald BookLedgerPro echtes
Embedding (`multilingual-e5-small`, L2=1) nachliefert — ehrlich: Buchhaltung ist
domänenfern zu Sage, Cosinus ≥ 0.80 nicht garantiert.

**Update 2026-06-27 — Family Projekt (siebter Nachbar) `verified-match`.** Andock-Anfrage
(von Klaus vermittelt, Family SIGNAL seq 2). Spore aus `raw/main` reziprok verifiziert
(✔ VALID: Pflichtfelder vollständig, `id == base64url(SHA256(rawPub))` unabhängig
nachgerechnet = `HLXUEJFW…`, Ed25519-Signatur gültig, Manipulationsprobe fällt durch).
`domainVector` echt (384-dim, L2=1, `multilingual-e5-small`); Cosinus Sage ⟷ Family Projekt
= **0.8287 ≥ 0.80** → **`verified-match`** (Family-Seite meldet denselben Wert, reziprok
bestätigt). Eigenes Postfach (`AUSTAUSCH-FamilyProjekt.md`) + `status.json` + Prüf-Vermerk
(`familyproject_inbox.verify.md`) angelegt; `ack[Family Projekt]=2`. Endpoint
`family-projekt.de` (Hetzner) noch nicht live → Verifikation über `raw/main`. Domäne
(Werkzeug-/App-Bündelung + Marktplatz + semantische Suche) liegt thematisch nah an Sages
Mycel-Bibliothek — daher der etwas höhere Wert (0.8287) als bei den domänenfernen Knoten.

## Postfächer (Datei-Dead-Drop, Sync-Vertrag §11.4)

| Gegenstelle | Sage-Seite | externe Seite |
|---|---|---|
| SB·KIMTool·Point | `sbkim/AUSTAUSCH.md` | `…/SB-KIMTool-Point/main/sbkim/AUSTAUSCH.md` |
| Jasons-Tresor | `sbkim/AUSTAUSCH-JasonsTresor.md` | `…/Jasons-Tresor/main/sbkim/AUSTAUSCH.md` |
| Mein-Tresor | `sbkim/AUSTAUSCH-MeinTresor.md` | `…/Mein-Tresor/main/sbkim/AUSTAUSCH.md` |
| Mein-Rezeptbuch | `sbkim/AUSTAUSCH-Rezeptbuch.md` | `…/Mein-Rezeptbuch/main/sbkim/AUSTAUSCH-Sage.md` |
| Mein-Mixarium | `sbkim/AUSTAUSCH-Mixarium.md` | `…/Mein-Mixarium/main/sbkim/AUSTAUSCH-Sage.md` |
| BookLedgerPro | `sbkim/AUSTAUSCH-BookLedgerPro.md` | `…/BookLedgerPro/main/sbkim/AUSTAUSCH-Sage.md` |
| Family Projekt | `sbkim/AUSTAUSCH-FamilyProjekt.md` | `…/family-project/main/sbkim/AUSTAUSCH-Sage.md` |

## Werkzeuge (für Andock, Verifikation, Embedding)

- `tools/verify_remote_spore.mjs` — fremde Spore per URL/Datei prüfen (echter Modul-02-Pfad).
- `tools/embed_helper.html` — echten `domainVector` **und** (neu, A10) `snippetVectors` im Browser
  erzeugen (byte-gleich Modul 03; Abschnitt „A10 — snippetVectors" → `snippets.json`).
- `tools/resign_spore_v02.mjs` — **eigene** Spore auf v0.2 neu signieren (ENV-Schlüssel
  `SBKIM_NODE_KEY`, self-verify ✔), optional `--snippets snippets.json` anhängen.
- `tools/make_example_spore.mjs` — Referenz-Spore erzeugen.
- `sbkim/fuer-SB-KIMTool-Point/generate_spore.mjs` — kopierbarer Spore-Generator für Forker.

## Offene Hebel

- **Match-Kalibrierung / e5-Anisotropie (Befund 2026-06-20, Klaus-Skepsis):** Der **rohe**
  Cosinus von `multilingual-e5-small` hat einen hohen Boden — unverwandte Domänen liegen
  schon bei **mean 0.8215** (sd 0.0223, Spanne 0.787–0.854). Die Schwelle `PROVIDER_MIN_MATCH
  = 0.80` liegt damit **unter** dem Rauschboden; fast jedes Paar „matcht". Nach Mittelwert-
  Abzug (Whitening-light) werden **alle Sage↔Endknoten-Paare negativ** — echt sind nur die
  Tresor-Schwestern (1.0) und Rezeptbuch↔Mixarium (0.70). Heißt: die Sage↔X-`verified-match`-
  Stempel (inkl. BookLedger 0.811) sind **boden-nah/schwach**, kein echter Themen-Bezug.
  **Kein Fehler der Knoten**, sondern des Verfahrens — **nicht stillschweigend umstempeln.**
  Plan (Klaus' Entscheidung, netzweit): (1) Schwelle mit Zufallstext-Boden neu kalibrieren,
  (2) Modul 04 auf **whitened Cosinus** umstellen (Mean-Vektor netzweit als Konstante),
  (3) alle Matches einmal sauber neu rechnen. Beleg: `tools/match_baseline.mjs`. Vollständige
  Lehre + Fix-Konzept: `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`.

  **✔ Kalibrierung abgeschlossen 2026-06-28 (Bau 04.E, Klaus' Entscheidung „zentrierten
  Cosinus jetzt bauen"):** Neu-Messung `mean 0.8214 · sd 0.0236`. **Schwelle bewusst NICHT
  angehoben** — `PROVIDER_MIN_MATCH = 0.80` ist der **Andock-Boden** (gatet den Handshake,
  Modul 05); eine Anhebung auf mean+2sd (≈0.87) würde **jeden Hub↔Endknoten-Andock abreißen**
  (alle roh 0.79–0.85, inkl. des live bewiesenen BLP↔Sage). Stattdessen **additiv** in Modul 04:
  `relatedness()` = **zentrierter Cosinus** (Verwandtschafts-Maß, **gatet nichts**) +
  `isRelated()` gegen `RELATEDNESS_MIN = 0.30`. Smoke `tests/smoke_bau04e_relatedness.mjs`
  **29/29 grün** (echt verwandt zentriert 0.72–1.0, Boden −0.20…0.002 — klarer Spalt).
  **Ehrliche Lesart der Stempel:** Sage↔X-`verified-match` bleiben gültig als **Andock-Beleg**
  (die Knoten verbinden sich real), sind aber **keine** Domänen-Verwandtschaft; echt verwandt
  zentriert nur Jason↔Mein-Tresor (1.0) und Mixarium↔Rezeptbuch (0.72). `MEAN_VECTOR` v1 aus 7
  Vektoren (additiv durch größeres Korpus ersetzbar). Browser-Live-Anzeige des Scores: Folge-Schritt.

- **Siegel-Band-Fix (Befund 2026-06-19):** Endknoten zeigten falschen Band-Text im
  Siegel (statische `assets/sbkim-siegel-wappen.svg` von Mein-Tresor kopiert, nie
  angepasst). **Mein-Rezeptbuch ✔ erledigt 2026-06-20** (Band `MEIN-TRESOR` →
  `MEIN-REZEPTBUCH`, PR #262 → main `f0278ab`, live auf raw/main verifiziert).
  **Mein-Mixarium offen** (Brief relayt, Band soll `MEIN-MIXARIUM` werden). Dauerlösung
  (konfigurierbarer Band via Modul 16 `ribbonText` statt statischer `<img>`) optional pro
  Endknoten. Sage selbst: `ribbonText`-Option gebaut + Andock-Knopf live (Stand main).

- **Briefkasten-Runde 2026-06-19 (Funktionstest):** Alle sechs Peer-`SIGNAL.json` aus
  `raw/main` gelesen — **alle HTTP 200, Briefkasten funktioniert**. Ungelesene Briefe waren
  durchweg Bestätigungen (reziproke Handshakes, Ring-Schluss, gegenseitige Acks), **kein
  offener Handlungsbedarf an Sage**. Quittiert: ack Point 20→24, Jasons 10→11, Tresor 13→14,
  Rezeptbuch 1→5, Mixarium 1→6, BookLedgerPro 2→5. (BLP-Direkt-Andock an SB·KIMTool·Point
  bestätigt via BLP seq 5.)

- **Mycel-Anfrage Original-Siegel / PNG (offen):** 2026-06-19 netzweit gestellt (Sage
  `SIGNAL.json` seq 25, `forNodes:"*"` + Brief im SB·KIMTool·Point-Postfach). Sage hat nur
  die SVG-Quelle (`assets/sbkim-siegel-wappen.svg` + `tool-symbols/16_siegel.svg`), kein
  PNG-Raster. Gesucht: Original-Siegel-Kopie oder PNG in einem Knoten-Repo. Rückmeldung
  erbeten (Postfach/SIGNAL). Falls niemand eins hat → Sage rastert aus der SVG.

- **BookLedgerPro ⟷ SB·KIMTool·Point Quer-Andock**: **A-Seite erledigt 2026-06-19** —
  SB·KIMTool·Point hat BookLedgerPro selbst offline reziprok verifiziert (✔ VALID →
  `verified-spore`) und in seine Knoten-Doku aufgenommen (`docs/KNOTEN.md`,
  `web/data/knoten.json` + vendorte Spore, `nodes.json`/`marktplatz.json`, `status.json`;
  `npm test` 9/9). Rück-Quittung in `sbkim/AUSTAUSCH.md`. **Offen:** BookLedgerPros eigener
  Direkt-Andock-Brief an SB·KIMTool·Point (Klaus relayt) → dann richtet SB·KIMTool·Point die
  direkte Verbindung ein.

- **BookLedgerPro → `verified-match`**: ✔ **erledigt 2026-06-20.** Betreiber hat das
  Modell einmalig in der App geladen, echten `domainVector` eingebettet
  (`multilingual-e5-small`, `passage:`-Präfix, L2=1) + Spore neu signiert (SIGNAL seq 11).
  Frische Spore reziprok ✔ VALID; Cosinus Sage ⟷ BookLedgerPro = **0.810579 ≥ 0.80** →
  `verified-match`. `ack[BookLedgerPro]=11`. Prüf-Vermerk: `sbkim/bookledgerpro_inbox.verify.md`.
  Ehrlich: knapp über der Schwelle (Buchhaltung domänenfern), aber sauber nachrechenbar.
  **Verschlüsselungs-Achse zu den Tresoren (Hypothese):** weiter offen — wäre eine eigene
  Cosinus-Messung BookLedgerPro ⟷ Jasons-/Mein-Tresor; bisher nicht gemessen.

- **Mein-Tresor → `verified-match`**: ✔ erledigt 2026-06-07. Echter `domainVector`
  (eingebettet re-signt, `multilingual-e5-small`, L2=1) aus raw/main verifiziert,
  Match Sage ⟷ Mein-Tresor = 0.847784 ≥ 0.80 → `verified-match`. Prüf-Vermerk:
  `sbkim/meintresor_inbox.verify.md`. (Wert = Jasons-Tresor, Schwester wortgleich.)

- **Jasons-Tresor → `verified-match`**: ✔ erledigt 2026-06-06 (Identitätswechsel auf
  echte Identität `E13GDzI…` + echter Vektor → Match Sage ⟷ Jasons-Tresor 0.847784).
- **SB·KIMTool ⟷ Jasons-Tresor**: optionale direkte gegenseitige Verifikation (Drei-Knoten-
  Netz vollständig beidseitig bezeugt) — Abgleich-Frage liegt in `sbkim/AUSTAUSCH.md`.
- **Pages-Hinweis:** github.io-Spore-URLs sind im Browser live, aus Sages Container aber 403
  (eigene Egress-Sperre) — Verifikation läuft zuverlässig über die `raw/main`-URLs.
