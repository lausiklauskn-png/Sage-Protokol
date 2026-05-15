# Modul 08 — UI-Demo

> **Status:** 🟨 Spec fertig  ·  **Schicht:** UI  ·  **Anker:** Sage-Page → Karte 4, Eintrag 08
> **Datei (Code):** `src/modules/08_ui_demo.js`  (Endknoten-Andocker-UI für Outbox- und Opt-In-Pflege)
>
> _Sichtbare Endknoten-UI für die Pflege der Heterokaryose-Anker und
> des `heterokaryosisOptIn`-Flags pro Geschwister. Kein Self-Apoptose-
> Knopf, kein Crawler, keine Pulsation — Klaus pflegt von Hand, was
> Modul 06 sonst nicht von selbst füllt._

---

## Im Mycel-Bild

Modul 08 ist der **Pflege-Tisch am Mycel-Rand** — eine sichtbare
Andocker-UI, an der Klaus die wenigen Stellen pflegt, die das
Heterokaryose-Netz von selbst nicht füllen kann: Welche Stichworte
darf mein Knoten als Domain-Anker teilen, wenn ein verbundenes
Geschwister fragt? Mit welchen Geschwistern teile ich überhaupt mehr
als die einzelne Domain-Vektor-Spore?

Geschwister von Modul 00 (Doku-Fenster): das Doku-Fenster ist
**versteckt** und **rein lesend / triggernd** (5-Klick-Geste,
Statusanzeige). Modul 08 ist **sichtbar** und **schreibend**
(Pflege-UI, Outbox-Befüllung, Opt-In-Flag). Klaus erreicht es nicht
über die 5-Klick-Geste, sondern über einen klar benannten
Endknoten-Pfad („Einstellungen → SBKIM-Pflege" oder
gleichbedeutend) — die genaue DOM-Form bleibt jedem Endknoten
überlassen.

Modul 08 rechnet selbst **nicht**: es ruft Modul 03 (Embedding)
nicht auf, signiert nicht, baut keine Spore, schickt nichts ins Netz.
Es schreibt nur in zwei Stores (`sbkim_hetero_outbox` als
Allein-Schreiber, `sbkim_siblings.heterokaryosisOptIn` als
Co-Schreiber neben Modul 05) und liefert Lese-/Validierungs-
Helfer für die UI. Embedding-Vektoren bekommt es vom Aufrufer
geliefert (die Endknoten-PWA bedient sich an `SbkimEmbedding`, wenn
Klaus ein neues Stichwort eintragen will).

---

## Visualisierung

```mermaid
flowchart LR
  K[Klaus<br/>am Endknoten] -->|„Anker hinzufügen"| UI[Endknoten-UI<br/>z.B. Einstellungen → SBKIM-Pflege]
  UI -->|Label + Vektor| A[SbkimUiDemo<br/>addOutboxAnchor]
  UI -->|Opt-In ✓/✗ pro Sibling| O[SbkimUiDemo<br/>setSiblingHeteroOptIn]
  A -->|SbkimStorage.put| S1[(sbkim_hetero_outbox)]
  O -->|SbkimStorage.get + put| S2[(sbkim_siblings)]
  S1 -.fail-soft.->|read on Pull| M6[Modul 06<br/>Heterokaryose-Response]
  S2 -.read on Pull.-> M6
  M6 -->|HeterokaryosisResponse<br/>anchors[]| Peer[verbundenes<br/>Geschwister]

  classDef klaus  fill:#92400E,color:#fff,stroke:#fff
  classDef ui     fill:#CA8A04,color:#fff,stroke:#fff
  classDef mod    fill:#2563EB,color:#fff,stroke:#fff
  classDef store  fill:#0E7490,color:#fff,stroke:#fff
  classDef peer   fill:#16A34A,color:#fff,stroke:#fff
  class K klaus
  class UI ui
  class A,O,M6 mod
  class S1,S2 store
  class Peer peer
```

---

## Zweck

Modul 08 ist die **Endknoten-Andocker-UI für die zwei Stellen, die
Modul 06 (Heterokaryose) braucht, aber selbst nicht setzt**:

1. **`sbkim_hetero_outbox`** — der Anker-Vorrat, den Modul 06 beim
   nächsten Pull als Response liefert. Ohne diesen Store fällt Modul
   06 auf den Spore-Single-Anker zurück (Label `"(domain)"`, Vektor =
   `senderSpore.domainVector`) und ist damit primär ein Domain-Drift-
   Erkenner mit genau einem Anker pro Pull (Spec-Wille Modul 06,
   Bau-Iteration 06 / 2026-05-15). Mit gefüllter Outbox liefert
   Modul 06 bis zu `HETERO_OUTBOX_MAX_ENTRIES` Anker (= 5,
   konsistent mit `HETERO_MAX_ANCHORS` aus §0) und das Netz wird
   semantisch reichhaltig.
2. **`sbkim_siblings[peerNodeId].heterokaryosisOptIn`** — das
   additive Opt-In-Flag, das Klaus pro Geschwister setzt, um
   überhaupt erweiterten Datenaustausch mit diesem Geschwister zu
   erlauben (Spec-Sitzung 06: beidseitiger Opt-In, Modul 05 setzt
   das Feld NICHT, Modul 06 liest fail-soft).

Modul 08 ist **kein** universelles Endknoten-UI-Framework. Es ist
eine kleine, fokussierte Andocker-Bibliothek mit fünf öffentlichen
Funktionen. Die DOM-Form der UI (HTML-Layout, CSS, Eingabe-Felder)
liegt beim Endknoten — Rezeptbuch und Mixarium gestalten sie selbst,
weil das in Klaus' Single-File-PWA-Stil pro Endknoten anders
aussehen wird (mal als Modal, mal als ausklappbarer Abschnitt im
Einstellungs-Screen).

---

## Modul-08-Rollenwahl: Endknoten-Modul, nicht Werkstatt-Datei

In der alten Schablone fielen zwei Rollen unscharf zusammen:

- **(a) UI-Werkstatt:** die Datei `tests/manual_check.html` selbst —
  Sichtprüfungs-Tisch des Sage-Protokol-Repos. Jede Bau-Sitzung
  füllt ein Panel.
- **(b) `SbkimUiDemo`-JS-Modul:** ein optionales `src/modules/
  08_ui_demo.js`, das im Endknoten als Andocker-UI für Outbox-
  Befüllung und Opt-In-Pflege dient.

**Diese Spec-Sitzung entscheidet: Karte 08 spezifiziert die Rolle
(b).** Die Werkstatt `tests/manual_check.html` ist *nicht* Modul-08-
Code; sie ist ein Sage-Protokol-Repo-internes Werkzeug, das jede
Bau-Sitzung wachsen lässt, und bleibt unbenannt unter
`tests/manual_check.html`. Begründung:

- Die Werkstatt hat **keinen Endknoten-Vertrag** — sie wird nie in
  Rezeptbuch / Mixarium kopiert. Ein Karten-Vertrag, der nur eine
  Test-HTML beschreibt, wäre für die Andock-Anleitung (Karte 09)
  ohne Nutzen.
- Die Rolle (b) **schließt eine reale Spec-Lücke** — Spec-Sitzung
  06 hat `sbkim_hetero_outbox` als angekündigten Store hinterlassen
  und das Opt-In-Flag als „Klaus setzt es im Endknoten-UI (Modul 00
  Doku-Fenster oder Modul 08 UI-Demo)" definiert. Spec-Sitzung 00
  hat den Setter aus Modul 00 ausgenommen (Doku-Fenster ist Lese-/
  Trigger-Modul). Modul 08 ist damit *der* spezifizierte Ort für
  beides.
- Karten-Statuscodes (🟨 Spec fertig, 🟦 Code-Stub, 🟩 Fertig) sind
  formal für JS-Module gedacht — die Werkstatt fällt nicht darunter
  und würde dauerhaft 🟧 In Werkstatt bleiben, was den Modulstand
  verzerrt.

Eine spätere Bau-Sitzung 08 implementiert `src/modules/08_ui_demo.js`
und ein Panel 08 in `tests/manual_check.html` mit Knöpfen für die
fünf Funktionen. Diese Spec-Sitzung schreibt **keinen JS-Code** und
**ändert `tests/manual_check.html` nicht**.

---

## Verantwortlichkeiten

**Macht:**

- **Outbox-Schreiber:** Modul 08 ist der alleinige Schreiber des
  Stores `sbkim_hetero_outbox` (Schlüssel `label`, Wert `{label,
  vector, addedAt}`). Modul 06 ist Leser.
- **Outbox-Leser** (für die eigene UI-Anzeige): `listOutbox()` gibt
  alle Einträge zurück — sortiert absteigend nach `addedAt`
  (neueste zuerst), damit die UI die zuletzt gepflegten Stichworte
  oben zeigt und Modul 06 (beim Pull) die *frischesten* fünf Anker
  liefert.
- **Outbox-Begrenzung:** `addOutboxAnchor` wirft `OutboxFullError`,
  wenn der Store bereits `HETERO_OUTBOX_MAX_ENTRIES` (= 5) Einträge
  hat. Klaus muss zuerst einen alten Anker entfernen
  (`removeOutboxAnchor`), bevor er einen neuen anlegt. Bewusst
  *kein* automatisches Verdrängen — das wäre stille Datenlöschung
  ohne Klaus-Bestätigung.
- **Outbox-Update:** ein erneutes `addOutboxAnchor(label, …)` mit
  bekanntem `label` **überschreibt** den bestehenden Eintrag
  (eindeutiger Schlüssel pro Knoten, `addedAt` wird auf `now()`
  aktualisiert). Klaus pflegt einen einzigen Eintrag pro Stichwort.
- **Opt-In-Co-Schreiber:** Modul 08 darf das additive Feld
  `sbkim_siblings[peerNodeId].heterokaryosisOptIn: boolean` setzen,
  **wenn der Sibling-Eintrag bereits existiert** (sonst
  `UnknownSiblingError`). Modul 05 bleibt Haupt-Schreiber von
  `sbkim_siblings` — Modul 08 berührt ausschließlich dieses *eine*
  Feld und legt keinen Eintrag neu an. Co-Schreiber-Konvention
  spezifiziert in §1 Modul 01.
- **Validierung:** Label-Länge ≤ `OUTBOX_LABEL_MAX_LEN` (= 64
  Zeichen, modul-lokal), Vektor-Form `number[EMBEDDING_DIM]`
  (= 384, aus §0). `setSiblingHeteroOptIn`-Argument `optIn` strikt
  Boolean.
- **Selbstcheck-Meldung** in der DevTools-Konsole beim Skript-Laden
  (Format wie 00 / 01 / 02 / 04 / 05 / 06 / 07).

**Macht nicht:**

- **Kein Self-Apoptose-Knopf.** Karte 07 hat Self-Apoptose als
  zweistufig + irreversibel spezifiziert (`prepareSelfApoptose` →
  60 s Token → `confirmSelfApoptose`); ein Knopf in der Pflege-UI
  würde den 60-s-Token-Schutz nicht aufweichen, aber den Hot-Path
  „falsche Pflege-Sitzung" gefährlicher machen. Bewusst aus dieser
  Erst-Spec ausgeklammert (Spec-Sitzung 00 hat den Knopf bereits aus
  Modul 00 ausgelagert mit dem Verweis „Modul 08 oder separater
  Endknoten-Pfad"). Eine eigene Spec-Sitzung 08.2 oder Karte 07
  § UI-Doku darf das später nachholen, *wenn* es real gebraucht wird.
- **Kein Embedding-Aufruf.** `addOutboxAnchor` erwartet einen
  fertigen Vektor — die Endknoten-PWA ruft `SbkimEmbedding` selbst,
  wenn Klaus ein neues Stichwort eintippt. Modul 08 bleibt
  Embedding-frei (Konsistenz mit Modul 00 — UI-Module rechnen
  nicht).
- **Kein Match-Aufruf, kein Spore-Bau, kein Netz-Aufruf, kein
  Handshake, kein Heterokaryose-Pull.** Modul 08 schreibt lokal in
  zwei Stores und liest sie. Alles andere ist Sache von 03/04/05/06.
- **Kein direkter `indexedDB.open`.** Persistenz strikt über
  `SbkimStorage.{init, get, put, del, all}`.
- **Keine personenbezogenen Daten.** Labels sind themen-bezogene
  Stichworte (z.B. „Hefeteig", „Whisky Sour"), nicht Nutzer-Namen
  oder Anfragen.
- **Keine `sbkim_doku_meta`-Schreibrechte.** Sichttest-Persistenz
  läuft über `SbkimDoku.recordSighttest` (Modul 00 ist alleiniger
  Schreiber).
- **Keine UI-DOM-Pflege.** Die HTML-Form der Pflege-Seite liegt beim
  Endknoten. Modul 08 liefert nur die fünf JS-Funktionen plus
  Selbstcheck-Meldung.
- **Kein Auto-Sweep, kein TTL.** Outbox-Einträge bleiben bis Klaus
  sie selbst entfernt — kein automatisches Vergessen. Wenn Klaus
  einen Anker entsorgen will, ruft die UI `removeOutboxAnchor(label)`.

---

## Schnittstelle

Modul 08 exportiert **fünf** öffentliche Funktionen. Alle DB-
Operationen liefern ein `Promise`. Es gibt keine Callback-Variante.

```
init(options) → Promise<void>
  // options:
  //   storeName?            : string         // Default "sbkim_hetero_outbox" (aus Karte 01 v=3)
  //   labelMaxLen?          : number         // Default OUTBOX_LABEL_MAX_LEN (= 64)
  //   embeddingDim?         : number         // Default EMBEDDING_DIM (= 384, aus §0)
  //   maxEntries?           : number         // Default HETERO_OUTBOX_MAX_ENTRIES (= 5, aus §0)
  //
  // Prüft Pflicht-Abhängigkeit (SbkimStorage), ruft SbkimStorage.init().
  // Idempotent: zweimaliger Aufruf läuft ohne Nebeneffekt.
  // Wirft UiDemoDependenciesError bei fehlendem SbkimStorage.
  // KEIN DOM-Mount, keine Listener-Registrierung — Modul 08 ist eine
  // reine API-Schicht, die DOM-Pflege liegt beim Endknoten.

listOutbox() → Promise<Array<{label, addedAt}>>
  // Liest alle Outbox-Einträge aus sbkim_hetero_outbox.
  // Reihenfolge: ABSTEIGEND nach addedAt (neueste zuerst).
  // Wert pro Eintrag: {label: string, addedAt: ISO-8601}.
  // VEKTOREN WERDEN NICHT MIT-GELIEFERT — die UI braucht sie nicht,
  // und mit-Liefern würde die UI für große Vektor-Arrays
  // verlangsamen. Wer den Vektor braucht, ruft SbkimStorage.get
  // direkt (interner Modul-06-Pfad). Modul 08 ist Klaus-UI, nicht
  // Modul-06-Backend.

addOutboxAnchor(label, vector) → Promise<void>
  // label  : string (≤ OUTBOX_LABEL_MAX_LEN Zeichen, nicht leer)
  // vector : number[EMBEDDING_DIM]
  //
  // Schreibt sbkim_hetero_outbox[label] = {label, vector, addedAt: now()}.
  // Wenn label bereits existiert: ÜBERSCHREIBT den Eintrag (addedAt
  // wird neu gesetzt). Wenn der Store HETERO_OUTBOX_MAX_ENTRIES
  // Einträge hat und label NEU ist: OutboxFullError (kein
  // automatisches Verdrängen — Klaus muss zuerst removeOutboxAnchor
  // aufrufen).
  // Wirft InvalidAnchorLabelError, wenn label leer / nicht-string /
  // zu lang. Wirft InvalidAnchorVectorError, wenn vector nicht
  // Array oder Länge != EMBEDDING_DIM oder Werte nicht endliche
  // Zahlen.
  // KEIN Embedding-Aufruf in 08 — vector wird von der UI mitgegeben
  // (typisch: SbkimEmbedding.embedPassage(label) im Aufrufer).
  // KEINE L2-Norm-Prüfung in 08 — Modul 03 garantiert die Norm
  // (Konsistenz mit Modul 04, das ebenfalls vertraut).

removeOutboxAnchor(label) → Promise<void>
  // Löscht sbkim_hetero_outbox[label]. Idempotent: kein Fehler,
  // wenn label nicht existiert.
  // Wirft InvalidAnchorLabelError, wenn label leer / nicht-string.

setSiblingHeteroOptIn(peerNodeId, optIn) → Promise<void>
  // peerNodeId : string (= sibling.nodeId aus sbkim_siblings)
  // optIn      : boolean
  //
  // Liest sbkim_siblings[peerNodeId]. Wenn der Eintrag fehlt:
  // UnknownSiblingError (Modul 08 legt KEINEN Sibling-Eintrag an —
  // Modul 05 bleibt Haupt-Schreiber). Wenn er existiert: setzt das
  // additive Feld heterokaryosisOptIn = optIn und schreibt das
  // gesamte Objekt zurück (alle anderen Felder unverändert).
  // KEIN Throw, wenn das Feld vorher nicht vorhanden war —
  // additiv aus Spec-Sitzung 06.
  // Wirft InvalidOptInArgError, wenn optIn nicht strikt Boolean ist
  // (kein truthy/falsy-Cast — bewusste Strenge bei Klaus-Pflege).
```

### Selbstcheck

Beim **Skript-Laden** (synchron, vor jeglichem Aufruf — Muster wie
Modul 00 / 01 / 02 / 04 / 05 / 06 / 07):

```
console.info("MODUL 08 UI-DEMO bereit, Funktionen: init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn");
```

Wie die anderen Module — die Meldung signalisiert „Modul geladen",
nicht „DB offen" oder „UI gebaut". `HETERO_OUTBOX_MAX_ENTRIES`,
`OUTBOX_LABEL_MAX_LEN` und `EMBEDDING_DIM` werden in der
Selbstcheck-Zeile bewusst **nicht** wiederholt (stehen in §0 bzw.
sind modul-lokal).

### Konfigurationswerte

Aus [INTERFACES.md §0](../INTERFACES.md#0-globale-konstanten):

```
HETERO_OUTBOX_MAX_ENTRIES = 5     // max. Anker in sbkim_hetero_outbox; Modul 08, Spec-Sitzung 08
                                  //   konsistent mit HETERO_MAX_ANCHORS = 5 (Modul 06)
EMBEDDING_DIM             = 384   // Dimension des Vektor-Arrays pro Anker
```

**Modul-lokal** in Karte 08 (nicht in §0):

```
OUTBOX_LABEL_MAX_LEN      = 64    // max. Zeichen pro Anker-Label
                                  //   konsistent mit Anker-Form aus Karte 06 § Anker-Form
                                  //   (label ≤ 64 Zeichen). Modul 08 prüft beim Schreiben,
                                  //   Modul 06 vertraut beim Lesen.
```

Begründung `HETERO_OUTBOX_MAX_ENTRIES = 5` (statt 10 oder höher):
Modul 06 begrenzt die Response ohnehin auf `HETERO_MAX_ANCHORS = 5`.
Eine größere Outbox würde dazu führen, dass einige Einträge nie ans
Netz gehen — Klaus wäre verwirrt („Warum kennt mein Geschwister
diesen Anker nicht?"). Die feste Gleichheit Outbox = Response
hält das Bild sauber: was in der Outbox steht, geht beim nächsten
Pull raus.

### Datenformate

**`sbkim_hetero_outbox[label]`** — Wert pro Outbox-Eintrag:

```jsonc
{
  "label":   "Hefeteig",                                  // ≤ OUTBOX_LABEL_MAX_LEN Zeichen, nicht leer, eindeutig pro Knoten
  "vector":  [/* 384 floats, L2-normalisiert */],         // EMBEDDING_DIM, aus Modul 03
  "addedAt": "2026-05-15T08:30:00.000Z"                   // ISO-8601 UTC, Modul 08 setzt beim addOutboxAnchor
}
```

Schlüssel = `label` (string). Damit ist der Eintrag pro Stichwort
eindeutig; doppelte `addOutboxAnchor`-Aufrufe mit demselben Label
überschreiben den Eintrag und aktualisieren `addedAt`. Reihenfolge
in `listOutbox()`: **absteigend nach `addedAt`** (neueste zuerst).
Begründung: die UI zeigt das gerade Gepflegte oben, und Modul 06
nimmt beim Pull die *frischesten* Anker (wenn die Outbox voll ist,
sind das alle fünf).

`signature` ist **nicht** Teil des Outbox-Werts — der Eintrag ist
rein lokal; die Response-Signatur in Modul 06 deckt das
HeterokaryosisResponse-JSON inklusive `anchors` ab, der lokale
Outbox-Store braucht keine Eigen-Signatur.

**`sbkim_siblings[peerNodeId]` — Co-Schreiber-Verhalten von Modul 08:**

```jsonc
{
  "nodeId":               "<base64url-sha256-rawpub>",   // bleibt unverändert (Modul 05 hat es gesetzt)
  "domain":               "rezeptbuch.example.org",      // bleibt unverändert
  "endpoint":             "https://klaus.github.io/rezeptbuch/", // bleibt unverändert
  "pubKey":               { /* JsonWebKey */ },          // bleibt unverändert
  "since":                "2026-05-14T07:00:00.000Z",    // bleibt unverändert
  "heterokaryosisOptIn":  true                            // ← AUSSCHLIESSLICH von Modul 08 gesetzt
  //  Modul 05 schreibt dieses Feld NICHT (additive Schema-Erweiterung).
  //  Modul 08 darf das Feld setzen, wenn der Eintrag bereits existiert
  //  (sonst UnknownSiblingError) — alle anderen Felder bleiben unverändert
  //  (Modul 08 liest den Eintrag, ändert nur das eine Feld, schreibt
  //  zurück).
  //  Modul 06 liest fail-soft (fehlend → default false).
}
```

**`addOutboxAnchor`-Argument-Form:**

| Argument | Typ | Bedingung |
|---|---|---|
| `label` | `string` | nicht leer; `label.length ≤ OUTBOX_LABEL_MAX_LEN` |
| `vector` | `number[]` | `vector.length === EMBEDDING_DIM`; alle Werte `Number.isFinite(v) === true` |

Vektor-Norm-Prüfung **bewusst nicht** in Modul 08. Modul 03 garantiert
die L2-Norm (siehe Karte 03); Modul 04 vertraut dem (siehe Karte 04
§ Hot-Path); Modul 08 vertraut dem genauso. Wer einen unnormierten
Vektor reinwirft, hat den Vertrag aus Modul 03 zerrissen — Modul 08
ist nicht die Stelle, das zu reparieren.

**`setSiblingHeteroOptIn`-Argument-Form:**

| Argument | Typ | Bedingung |
|---|---|---|
| `peerNodeId` | `string` | nicht leer; muss als Schlüssel in `sbkim_siblings` existieren (sonst `UnknownSiblingError`) |
| `optIn` | `boolean` | strikt — `true === true` / `false === false`; kein truthy/falsy-Cast |

---

## Fehlertabelle

| Aufrufer | Bedingung | Verhalten |
|---|---|---|
| `init()` | `SbkimStorage` nicht auf `window` | `UiDemoDependenciesError` (sync throw vor jeglicher DB-Operation) |
| `init()` | `SbkimStorage.init()` wirft | unverändert durchgereicht |
| `init()` | zweimaliger Aufruf | idempotent — kein Fehler, kein Nebeneffekt |
| `listOutbox()` | Store leer | leeres Array, kein Fehler |
| `listOutbox()` | `SbkimStorage.all()` wirft (z.B. `StorageUnavailableError`) | unverändert durchgereicht |
| `addOutboxAnchor()` | `label` nicht-string / leerer String | `InvalidAnchorLabelError` (sync throw) |
| `addOutboxAnchor()` | `label.length > OUTBOX_LABEL_MAX_LEN` | `InvalidAnchorLabelError` (sync throw) |
| `addOutboxAnchor()` | `vector` nicht Array / `vector.length !== EMBEDDING_DIM` | `InvalidAnchorVectorError` (sync throw) |
| `addOutboxAnchor()` | ein `vector`-Wert nicht `Number.isFinite` (NaN, ±∞) | `InvalidAnchorVectorError` (sync throw) |
| `addOutboxAnchor()` | Store hat bereits `HETERO_OUTBOX_MAX_ENTRIES` Einträge, `label` ist NEU | `OutboxFullError` (kein automatisches Verdrängen) |
| `addOutboxAnchor()` | Store hat bereits `HETERO_OUTBOX_MAX_ENTRIES` Einträge, `label` existiert | Überschreibt den Eintrag, kein Fehler (Anzahl bleibt gleich) |
| `addOutboxAnchor()` | Quota überschritten | `SbkimStorage.put()` wirft `QuotaExceededError` durch — Modul 08 reicht unverändert weiter |
| `removeOutboxAnchor()` | `label` nicht-string / leerer String | `InvalidAnchorLabelError` (sync throw) |
| `removeOutboxAnchor()` | `label` existiert nicht | idempotent, kein Fehler |
| `setSiblingHeteroOptIn()` | `peerNodeId` nicht in `sbkim_siblings` | `UnknownSiblingError` (sync throw nach Read-Versuch) |
| `setSiblingHeteroOptIn()` | `optIn` nicht strikt Boolean | `InvalidOptInArgError` (sync throw) |
| `setSiblingHeteroOptIn()` | Storage-Lese-/Schreibfehler auf `sbkim_siblings` | unverändert durchgereicht |

**Fünf benannte Error-Klassen** (analog 00 / 02 / 04 / 05 / 06 / 07,
exportiert auf `window.SbkimUiDemo.<Error>` für `instanceof`-Checks):

```
UiDemoDependenciesError   — SbkimStorage nicht auf window
InvalidAnchorLabelError    — Label leer / nicht-string / zu lang
InvalidAnchorVectorError   — Vektor falscher Typ / falsche Länge / Werte nicht endlich
OutboxFullError            — Store am Limit (HETERO_OUTBOX_MAX_ENTRIES) und Label neu
UnknownSiblingError        — peerNodeId nicht in sbkim_siblings (kein Eintrag von Modul 05)
                              Name bewusst identisch zu Modul 06 (UnknownSiblingError),
                              weil die Bedeutung dieselbe ist. Wer in einem Endknoten-UI
                              beide Module nutzt, sieht denselben Error-Namen.
                              Modul-Zugehörigkeit über window.SbkimUiDemo vs.
                              window.SbkimHeterokaryose erkennbar.
InvalidOptInArgError       — optIn nicht strikt Boolean
```

Versions-Mismatch zwischen Modul 08 und §0-Konstanten: **es gibt
keinen** — Modul 08 spiegelt §0, ist nicht protokoll-aktiv (kein
Netz-Aufruf, keine Signatur, keine Spore-Erzeugung). Wer §0 ändert,
ändert Modul 08 ohne Code-Eingriff nach (Konstanten beim Skript-
Laden gelesen).

---

## Manueller Test

Test-Plan für ein späteres Panel 08 in `tests/manual_check.html`
(Bau-Sitzung 08 implementiert das; diese Spec-Sitzung skizziert nur
den Pfad). Mindestens **sieben Knöpfe**:

1. **Setup** — `SbkimStorage.init()` + `SbkimUiDemo.init()`.
   Erwartung: `console.info("MODUL 08 UI-DEMO bereit, …")`-Zeile
   in DevTools sichtbar; `sbkim_hetero_outbox` als Store in
   DevTools → Application → IndexedDB → `sbkim` sichtbar (leer);
   DB-Version 3.
2. **Outbox add + list** — drei Pseudo-Vektoren (z.B. via
   `SbkimEmbedding.embedPassage("Hefeteig")` /
   `embedPassage("Schwarzwald-Torte")` / `embedPassage("Sauerteig")`)
   eintragen, dann `listOutbox()` ausgeben. Erwartung: drei
   Einträge, Reihenfolge absteigend nach `addedAt` (zuletzt
   eingetragener oben), keine Vektoren in der Ausgabe (nur
   `{label, addedAt}`).
3. **Outbox remove** — `removeOutboxAnchor("Schwarzwald-Torte")`.
   Erwartung: `listOutbox()` zeigt zwei Einträge ohne den
   gelöschten; erneutes `removeOutboxAnchor("Schwarzwald-Torte")`
   wirft *nicht* (idempotent).
4. **Outbox überschreiben** — `addOutboxAnchor("Hefeteig", neuerVektor)`
   mit demselben Label wie in Schritt 2. Erwartung: `listOutbox()`
   zeigt weiterhin zwei Einträge (Anzahl unverändert), Hefeteig-
   Eintrag hat ein frisches `addedAt` und steht oben.
5. **`HETERO_OUTBOX_MAX_ENTRIES`-Überschreitung** — fünf Anker
   eintragen, dann einen sechsten *neuen* versuchen. Erwartung:
   `OutboxFullError`. Nach `removeOutboxAnchor` eines beliebigen
   alten Eintrags geht der sechste durch.
6. **Opt-In setzen** — `_addPseudoSibling("peerXY", {…})` als
   Test-Brücke (analog Modul 05 / 06 — direkter `SbkimStorage.put`
   auf `sbkim_siblings`), dann
   `setSiblingHeteroOptIn("peerXY", true)`. Erwartung:
   `SbkimStorage.get("sbkim_siblings","peerXY")` zeigt
   `heterokaryosisOptIn: true`, alle anderen Felder unverändert.
   Anschließend `setSiblingHeteroOptIn("peerXY", false)`.
   Erwartung: Feld auf `false`. Anschließend
   `setSiblingHeteroOptIn("unbekannt", true)` → `UnknownSiblingError`.
7. **Selbstcheck-Hinweis** — Hinweis-Knopf zeigt in der Konsole
   die erwartete Selbstcheck-Zeile (analog Panel 00 / 01 / 02 / 04
   / 05 / 06 / 07).

Test-Brücken (Unterstrich-Präfix, exportiert für `manual_check.html`,
analog Modul 05 / 06 / 07):

```
_clearOutbox()              — leert sbkim_hetero_outbox für saubere Test-Wiederholungen
_addPseudoSibling(id, obj)  — direkter SbkimStorage.put auf sbkim_siblings
                               (Vorbereitung für Test 6 / Opt-In)
_clearPseudoSiblings()
```

`_addPseudoSibling` ist konsistent mit Modul 06 (das dieselbe
Test-Brücke verwendet, weil Modul 06 ebenfalls Storage-basiert liest).

Sichttest-Pflicht: Bau-Sitzung 08 trägt das Ergebnis im
§ Bauzustand-Block ein. Bei `addOutboxAnchor`-Schreibfehlern (Quota
voll) ist eine begründete „ungeprüft"-Markierung zulässig — Quota-
Bedingungen sind im Werkstatt-Browser kaum reproduzierbar.

---

## Risiken & offene Punkte

- **Privacy-Leak via Outbox-Label.** Anker-Labels gehen im
  HeterokaryosisResponse signiert raus an alle Opt-In-Geschwister.
  Klaus sollte keine personenbezogenen Stichworte eintragen (z.B.
  „Kuchen für Geburtstag von Anna" — verrät den Namen). Spec-Wille:
  Modul 08 prüft das **nicht** programmatisch (kein semantischer
  Filter), die Karte 08 UI muss eine ruhige Hinweiszeile zeigen
  („Stichworte werden mit Opt-In-Geschwistern geteilt — nur
  Themen-Begriffe, keine Namen / Anfragen / Personen"). Endknoten-
  Verantwortung.
- **Anker-Vergiftung durch eigene Outbox.** Wer Klaus' Endknoten
  physisch zugreift, könnte semantisch-irreführende Anker
  eintragen, die das Match-Netz verzerren. Schutz dagegen ist nicht
  Modul 08 — Modul 10 (Reputation, Schutz-Backlog) ist der Ort, an
  dem Anker-Vergiftung auf Empfänger-Seite gedämpft wird.
- **Outbox-Anker-Manipulation ist Klaus-Schreib-Recht.** Bewusst
  keine zusätzliche Bestätigungs-Stufe (`prepareUiAction` / `confirmUiAction`)
  in dieser Erst-Spec — Outbox-Pflege ist reversibel (Klaus kann
  einen Anker jederzeit entfernen) und betrifft nur Knoten mit
  beidseitigem Opt-In. Eine zweistufige Bestätigung wäre Overhead
  ohne Sicherheitsgewinn. Self-Apoptose ist anders (irreversibel),
  daher zweistufig — siehe Karte 07.
- **`setSiblingHeteroOptIn` kann nicht initial setzen.** Wenn der
  Sibling-Eintrag fehlt, wirft Modul 08 `UnknownSiblingError`. Das
  ist Spec-Wille: Modul 05 ist Haupt-Schreiber von `sbkim_siblings`;
  Modul 08 darf nur das eine additive Feld setzen. Konsequenz für
  die UI: der Opt-In-Toggle ist nur sichtbar für Geschwister, die
  *bereits* erfolgreich angedockt haben (Listing über
  `SbkimAnastomose.listSiblings()`).
- **Kein Self-Apoptose-Knopf — bewusst nicht spezifiziert.**
  Spec-Sitzung 00 hat den Knopf aus Modul 00 ausgelagert mit dem
  Hinweis „gehört in Modul 08 (UI-Demo) oder einen separaten
  Endknoten-Pfad". Diese Erst-Spec entscheidet: **nicht in Modul 08**.
  Begründung: Self-Apoptose ist sicherheitskritisch (zweistufig +
  60s-Token, Karte 07), und ein versteckter Knopf in der Pflege-UI
  macht das Risiko nicht kleiner. Eine eigene Spec-Sitzung 08.2
  oder Karte 07 § UI-Doku darf das später nachholen, *wenn* Klaus
  einen sichtbaren Pfad braucht (z.B. „Knoten stilllegen" im
  Einstellungs-Screen mit eigener zweistufiger Bestätigung).
- **DOM-Form bleibt offen.** Modul 08 spezifiziert keine HTML-
  Struktur. Rezeptbuch und Mixarium gestalten die Pflege-Seite
  selbst (typisch: ein Abschnitt im Einstellungs-Screen mit
  Eingabefeld + Liste + Toggle). Karte 09 (Einbau-PWA) könnte in
  einer späteren Pflege-Sitzung einen minimalen Referenz-HTML-Block
  liefern — diese Spec-Sitzung 08 lässt das offen.
- **Quota-Frühwarnung delegiert.** Modul 00 (Doku-Fenster) zeigt
  die Quota-Schwellen aus §0 (`DOKU_QUOTA_WARN_RATIO` /
  `DOKU_QUOTA_WARN_BYTES`). Modul 08 nutzt sie *nicht* aktiv —
  wenn die Quota voll ist, wirft `SbkimStorage.put` einen
  `QuotaExceededError`, den Modul 08 unverändert durchreicht.
  Klaus sieht die Quota im Doku-Fenster und reagiert dort
  (Geschwister vergessen, Inbox aufräumen).
- **Outbox-Lese-Pfad in Modul 06 ist offen.** Die heutige Bau-
  Iteration Modul 06 (2026-05-15) implementiert ausschließlich den
  Spore-Single-Anker-Fallback. Eine **Folge-Pflege Bau 06.1**
  (Outbox-Lese-Pfad in `src/modules/06_heterokaryose.js`) ist nach
  Spec-Sitzung 08 fällig — das ist *kein* Teil dieser Spec-Sitzung
  (siehe § Querverweise). Modul 06 § Anker-Quelle / § Manueller Test
  Punkt 9 antizipiert das.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Stub `tests/manual_check.html` angelegt | 2026-05-10 | Skelett | Werkstatt-Tisch (nicht Modul-08-Code; siehe § Modul-08-Rollenwahl) |
| Site-Echo | 2026-05-10 | Site-Echo | Hero, Bio-Metapher, Mermaid-Werkbank, Querverweise (alter Werkstatt-Stil) |
| Spec gefüllt | 2026-05-15 | Spec 08 | Modul-08-Rollenwahl verbindlich entschieden (Variante b — Endknoten-Modul `SbkimUiDemo`); Werkstatt `tests/manual_check.html` ausdrücklich KEIN Modul-08-Code. Fünf-Funktionen-API (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn`); Modul 08 alleiniger Schreiber von `sbkim_hetero_outbox` (Schlüssel `label`, Wert `{label, vector, addedAt}`, Reihenfolge absteigend nach `addedAt`); Co-Schreiber für `sbkim_siblings[peerNodeId].heterokaryosisOptIn` (Haupt-Schreiber bleibt Modul 05, Modul 08 darf nur das eine additive Feld setzen, wenn der Eintrag bereits existiert — sonst `UnknownSiblingError`). **§0 um `HETERO_OUTBOX_MAX_ENTRIES = 5` erweitert** (additiv, kein Hauptversions-Sprung, konsistent mit `HETERO_MAX_ANCHORS = 5`). **Karte 01 § Stores um `sbkim_hetero_outbox` erweitert (DB-Version 2 → 3, additive Migration v=3)** — Schreiber 08, Leser 06. Selbstcheck-Format synchron beim Skript-Laden. Modul-lokale Konstante `OUTBOX_LABEL_MAX_LEN = 64` (konsistent mit Anker-Form aus Karte 06). Fehlertabelle mit 16 Lagen + sechs benannte Error-Klassen (`UiDemoDependenciesError`, `InvalidAnchorLabelError`, `InvalidAnchorVectorError`, `OutboxFullError`, `UnknownSiblingError`, `InvalidOptInArgError`). Manueller-Test-Skizze mit sieben Test-Punkten + drei Test-Brücken (`_clearOutbox`, `_addPseudoSibling`, `_clearPseudoSiblings`). **Self-Apoptose-Knopf bewusst NICHT in Modul 08** (Spec-Sitzung 00 hatte ihn aus Modul 00 ausgelagert; Spec-Sitzung 08 entscheidet: auch nicht hier; eigene Spec-Sitzung 08.2 darf das später nachholen). **DOM-Form bleibt offen** — Endknoten gestaltet die Pflege-UI selbst. **Embedding-frei** — `addOutboxAnchor` erwartet einen fertigen Vektor (Aufrufer ruft `SbkimEmbedding` selbst). INTERFACES.md §0 (`HETERO_OUTBOX_MAX_ENTRIES`-Zeile) + §1 Modul 01 (Storage-Block, DB-Version-Tabelle v=3, Co-Schreiber-Hinweis auf `sbkim_siblings.heterokaryosisOptIn`) + §1 Modul 08 (volle Vertrag-Sektion auf Status `entwurf`) + §6 (Änderungsprotokoll-Zeile) nachgezogen. `status.json` Modul 08 von `score:"werkstatt"` / `siegel:"in Werkstatt"` auf `score:"spec"` / `siegel:"Spec fertig"`, `kurz` aktualisiert; `config.HETERO_OUTBOX_MAX_ENTRIES = 5` ergänzt. Pie regeneriert (Werkstatt 1 → 0, Spec fertig 1 → 2). **Kein JS-Code** in `src/modules/08_ui_demo.js`. **Keine `tests/manual_check.html`-Änderung.** **Keine Karte-05-/Karte-06-/Karte-07-Schnittstellen-Änderung.** Folge-Pflege Bau 06.1 (Outbox-Lese-Pfad in `06_heterokaryose.js`) als Querverweis notiert. |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |

---

**Querverweise**

- **Abhängigkeiten (Pflicht):** Modul 01 (Storage — Pflicht-
  Abhängigkeit für `sbkim_hetero_outbox` und `sbkim_siblings`).
- **Abhängigkeiten (indirekt, nicht über window-Globale):** Modul 02
  (Spore — Modul 08 berührt es nicht direkt; die Sibling-Einträge
  werden über Modul 05 geschrieben, das selbst Modul 02 nutzt) ·
  Modul 03 (Embedding — Aufrufer ruft `SbkimEmbedding` selbst,
  bevor er `addOutboxAnchor` aufruft).
- **Wird genutzt von:** Modul 06 (Heterokaryose — liest
  `sbkim_hetero_outbox` fail-soft, sobald **Folge-Pflege Bau 06.1**
  den Lese-Pfad in `src/modules/06_heterokaryose.js` ergänzt; bis
  dahin liest Modul 06 nur den Spore-Single-Anker als Fallback) ·
  Endknoten-PWAs Rezeptbuch + Mixarium (gestalten die Pflege-UI
  selbst und rufen die fünf Modul-08-Funktionen aus dem
  Einstellungs-Screen).
- **Folge-Pflege Bau 06.1 (offen nach Spec 08):** Modul 06's
  Outbox-Lese-Pfad in `src/modules/06_heterokaryose.js` ergänzen
  (heute liefert Modul 06 nur den Spore-Single-Anker-Fallback —
  Bau-Iteration 06 / 2026-05-15). Headless möglich, kleine Pflege;
  macht Panel 06 Test 9 (`HETERO_MAX_ANCHORS`-Begrenzung) voll
  testbar. **Kein** Teil dieser Spec-Sitzung 08.
- **Folge-Pflege Karte 09 (offen):** Karte 09 (Einbau-PWA) könnte
  in einer späteren Pflege-Sitzung einen minimalen Referenz-HTML-
  Block für die Pflege-Seite liefern (Eingabefeld + Liste + Opt-In-
  Toggle), damit Rezeptbuch und Mixarium nicht bei null anfangen.
  Diese Spec-Sitzung 08 lässt die DOM-Form offen.
- **Spec-Sitzung 08.2 (optional, später):** Self-Apoptose-Knopf in
  Modul 08 oder einem separaten Endknoten-Pfad. Spec-Sitzung 08
  hat ihn bewusst aus der Erst-Spec ausgenommen (siehe § Risiken).
- **Site-Karte:** [Karte 4 · Module-Bento](../../index.html#screen-overview),
  Eintrag 08.
- **Glossar:** [Anker](../GLOSSAR.md), [Sichttest](../GLOSSAR.md),
  [Werkstatt](../GLOSSAR.md).
- **Architektur:** [ARCHITEKTUR.md §7](../ARCHITEKTUR.md)
  (Konfigurationswerte).
- **INTERFACES.md:**
  [§0 Globale Konstanten](../INTERFACES.md#0-globale-konstanten)
  (`HETERO_OUTBOX_MAX_ENTRIES`, `EMBEDDING_DIM`) ·
  [§1 Modul 01](../INTERFACES.md#modul-01_storage)
  (`sbkim_hetero_outbox` als v=3-Store, Co-Schreiber-Hinweis auf
  `sbkim_siblings.heterokaryosisOptIn`) ·
  [§1 Modul 08](../INTERFACES.md#modul-08_ui_demo) (voller Vertrag) ·
  [§1 Modul 06](../INTERFACES.md#modul-06_heterokaryose)
  (`sbkim_hetero_outbox` als angekündigte Anker-Quelle, fail-soft
  zu lesen).
- **Eigenleistung:** kein direkter Bezug zu `sbkim_integration.md` —
  Sage-Protokol-Eigenleistung (die Outbox-Pflege-UI ist eine
  Klaus-PWA-Konvention, parallel zum Doku-Fenster Modul 00).
