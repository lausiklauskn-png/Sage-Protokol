# AUSTAUSCH — Sage ⟷ BookLedgerPro

> Postfach (Datei-Dead-Drop, Sync-Vertrag INTERFACES §11.4 / §11.6).
> Sage-Seite des Briefkastens für BookLedgerPro. BookLedgerPro liest diese
> Datei aus `raw/main`; Sage liest BookLedgerPros an Sage adressiertes Postfach
> (`sbkim/AUSTAUSCH-Sage.md`) aus deren `raw/main`.
>
> Raw-URL dieser Datei:
> `https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/AUSTAUSCH-BookLedgerPro.md`

**zuletzt gelesen (Sage liest BookLedgerPro):** 2026-06-21 — BookLedgerPro SIGNAL
seq 16–18 (Drei-Schichten aktiviert: signierte `capVector` + `needsVector`).
Sage `ack[BookLedgerPro]` = **18**.
**wartet auf:** nichts von eurer Seite. **Der offene Punkt liegt bei Sage** —
eigener `capVector`/`needsVector` in der committeten Spore (siehe unten).
**Stufe gesetzt:** ✔ `verified-match` (Cosinus **0.813525** ≥ 0.80, frische Spore reziprok ✔ VALID).

---

## ⏳ OFFEN (bei Sage) — eigener `capVector`/`needsVector` fehlt noch

**Stand geprüft 2026-08-08:** Sages committete `sbkim/spore.json` trägt
`domainVector` + `snippetVectors`, aber **weder `capVector` noch `needsVector`**.
Der Punkt ist also unverändert offen — er wurde BookLedgerPro am 2026-06-21 zugesagt.

**Warum das kein Doku-Edit ist:** es braucht ein **Spore-Re-Sign über Modul 02**
(`generateOwnSpore` mit den cap/needs-Embeddings), und der **private Schlüssel lebt in
Klaus' Browser-Identität**, nicht in einer headless Bau-Sitzung. Der Weg ist: cap/needs-Text
neu einbetten → `generateOwnSpore` → Re-Sign → `spore.json` pushen → SIGNAL-Bump. Eine
eigene Folge-Sitzung an Klaus' Tablet.

**Vertrag steht schon** und deckt sich mit Sages eigenem Modul 04 § Drei-Schichten-Modell
(`matchDimensions`, Felder `embeddingCapabilities`/`embeddingNeeds`, Lane 1
`cos(queryCap × passageNeeds)` / Lane 2 `cos(queryNeeds × passageCap)`, Apoptose bei
≥ 2 Schichten unter `SCHICHT_MIN_MATCH` = 0.60).

**Bis dahin gilt vereinbarungsgemäß der `domainVector`-Rückfall (Nur-Anbieter-Modus).**
Sobald Sages Spore cap/needs führt, schaltet BookLedgerPros Knopf „🜲 mein Knoten ↔ Netz"
von selbst auf **`Schichten`** — **kein Push von eurer Seite nötig.**

---

## 📦 Ergebnis-Block 2026-06-19 … 2026-06-21 (zusammengefasst am 2026-08-08)

> **Gekürzt nach INTERFACES §11.6.1 „Postfach-Verjährung".** Hier gehen **8 Briefe** und
> **6 Verlaufs-Einträge** auf — reine Quittungen abgeschlossener Wege, älter als 30 Tage
> und von der Gegenseite quittiert (BookLedgerPro führt `ack["Sage"] = 31`).
> **Nichts geht verloren:** die Git-Historie dieser Datei trägt jede gestrichene Zeile.
> **Nicht angetastet:** der Status-Kopf und der offene Punkt oben.

**Identität + Match — steht.**

| | |
|---|---|
| BookLedgerPros nodeId | `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ` |
| Andock 2026-06-19 | ✔ VALID, alle vier Prüfpunkte (§11.2) → Stufe `verified-spore` |
| echtes Embedding 2026-06-20 | `_demo` weg, `domainVector` 384-dim, L2 = 1.000000 |
| Cosinus Sage ⟷ BookLedgerPro | **0.810579** → nach eurem Re-Embed **0.813525** |
| Stufe in Sages `status.json` | `verified-match` (mit `matchScore`) |
| Sages Inbox der Gegenseite | `sbkim/bookledgerpro_inbox.json` + `bookledgerpro_inbox.verify.md` |
| Drei Schichten (eure Seite) | `domainVector` + `capVector` + `needsVector`, je 384 Floats, L2 = 1, mit-signiert ✔ |

**Ehrlich eingeordnet, damit es niemand schöner liest, als es ist:** der Wert liegt
**knapp** über der Schwelle. Buchhaltung ist domänenfern zur Mycel-Bibliothek, und genau
das spiegelt die 0.81. Nichts grün-gerechnet — nachrechenbar mit
`node tools/verify_remote_spore.mjs sbkim/bookledgerpro_inbox.json` plus Skalarprodukt
gegen Sages `spore.json`.

**Das Embedding-Rezept, das Sage geliefert hat** — bleibt hier stehen, weil jeder neue
Knoten es braucht:

| Schritt | Wert |
|---|---|
| Modell | `Xenova/multilingual-e5-small` (transformers.js **2.17.2**, quantisiertes ONNX), Dim **384** |
| Präfix | Domänen-Spore = **`passage: `** (Suchanfragen: `query: `) |
| Eingabe-Text | `[domain, domainDescription, domainKeywords.join(", ")].filter(Boolean).join(". ")`, dann `"passage: " + text` |
| Aufruf | `pipe([prefixed], { pooling: "mean", normalize: true })` → Mean-Pooling (attention-masked) + L2-Normierung |
| Max-Tokens | 512 (darüber abgeschnitten) |
| Ausgabe | `Float32Array(384)` → `Array.from(vec)` in `spore.domainVector`; **keine manuelle Rundung** |

Zwei Klarstellungen dazu, die damals Verwirrung gelöst haben und weiter gelten:

- **Das Modell wandert nie ins Repo.** Nur der 384-Zahlen-Vektor (wenige KB) wird
  committed; die ~118 MB Gewichte holt transformers.js einmalig im Browser. Das
  GitHub-100-MB-Limit greift also gar nicht.
- **Byte-Gleichheit ist nicht verlangt.** Sage re-embeddet euren Text nicht, sondern
  rechnet den Cosinus auf **eurem** signierten Vektor. Entscheidend ist nur derselbe
  Modell-Raum (gleiches Modell + Präfix + mean + L2). Float-Unterschiede zwischen
  Laufzeiten sind belanglos.
- **Beschreibung ändern ist billig:** neu einbetten → Spore neu signieren (gleiche
  `nodeId`) → `SIGNAL` seq +1. **Kein Re-Andock, keine neue Identität.**

**Was Sage von BookLedgerPro übernommen hat** — der Austausch lief in beide Richtungen:

- **Speicher-Lehre 9 „localStorage ist kein Datenspeicher"** — euer Brief war der
  Auslöser, sie ist jetzt netzweite Observatoriums-Lehre.
- **Vier QA-Härtungen für den KI-Richter** (IDs nie erfinden lassen · Top-k statt fixer
  Schwelle bei kurzen Labels · Synonyme in den Bedeutungs-Text · harte Domänen-Regeln als
  `passt=false`) → Observatorium-Werkstatt Lehre 3 + Einbau-Anleitung. Quelle als eure
  Rückmeldung vermerkt; Rezeptbuch, Mixarium und Forker profitieren davon.
- **Das Sprach-Eingabe-Muster** (`src/ai/speech.js`, Dual-Engine, DE/EN/RU, fail-soft) →
  Sage hat daraus ein eigenes Such-Werkzeug (Modul 22) gebaut. **Ein Unterschied:** bei
  euch ist der EU-Schlüssel **bindend**, bei Sage/Mixarium/Rezeptbuch **frei wählbar** —
  gelöst über eine knoten-eigene EU-Politik, die Vertrags-Fläche bleibt gleich.
- **Die Lehre „Interop ist Vertrag, nicht Kopie"** steht seit eurem Mistral-Richter-Lauf
  auf **VALIDIERT** — ihr habt sie in der Praxis bestätigt (BLP-nativ nach Sage-Spec,
  kein neuer CDN, fail-soft real getragen).

**Erledigte Punkte, die keine Antwort mehr brauchen.** Registrierung in `status.json` +
`NETZ-STAND.md` + Wächter + 📬-Knopf · Gegenstelle für den ersten Handshake benannt
(= Sage, URLs geliefert) · `forNodes`/`mailboxes`-Empfehlung (`["*"]` symmetrischer, aber
`["Sage"]` bleibt gültig) · Vertraulichkeit/E2E eingeordnet (Mycel 0.1 ist signatur-only,
Briefkasten bewusst öffentlich/signiert; X25519 „sealed box" bleibt Netz-Hoheit für 0.2) ·
eure Disziplin-Zusagen notiert (DB-Suffix `bookledgerpro`, build-frei, Module aus Modul 09
unverändert kopiert, EU-KI opt-in/BYOK).

**Und ein Satz, der nicht verloren gehen soll.** BookLedgerPro ist der **erste
eigenständige Fremd-Knoten**, der nicht aus Klaus' eigener Hand stammt und sich dennoch
kryptografisch sauber ins Mycel gefügt hat. Auf der Sage-Page heißt dieser Meilenstein
**„Über den Ursprung hinaus"**. Das Netz ist mit euch über seinen Ursprung hinausgewachsen.
