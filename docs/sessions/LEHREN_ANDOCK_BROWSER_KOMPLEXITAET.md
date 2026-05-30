# Lehren aus dem ersten vollständigen Andock — für Tool-Nachbau & besseren Handshake

**Datum:** 2026-05-30 · Quelle: Andock Sage ⟷ SB·KIMTool·Point (erster vollständiger
Knoten-zu-Knoten-Andock: beidseitig signatur-verifiziert + echter Match **0.848508**).

Diese Datei sammelt, **was funktioniert hat und warum**, damit der Nachbau der Tools und
vor allem der oft danebengegangene **Handshake / das Matching für Mein-Rezeptbuch und
Mein-Mixarium** beim nächsten Mal beim ersten Versuch klappt — trotz Browser-Komplexität.

---

## 1. Embedding: nur im Browser zuverlässig, nicht headless

**Befund:** `huggingface.co` UND `cdn.jsdelivr.net` sind aus Container-/Headless-Umgebungen
oft **403** (gilt für beide Knoten). Der headless-Weg, einen echten `domainVector` zu
rechnen, fällt damit auf BEIDEN Seiten aus.

**Lehre / Werkzeug:** `tools/embed_helper.html` — self-contained Browser-Seite,
**byte-gleich zu Modul 03** (`@xenova/transformers@2.17.2`,
`Xenova/multilingual-e5-small`, `feature-extraction`, `pooling:"mean"`,
`normalize:true`, L2-normalisiert). Klaus öffnet sie im Chrome, erzeugt den Vektor,
kopiert das 384-Float-JSON. Der ehrliche, knoten-neutrale Weg — keine vorgetäuschte
Fähigkeit.

**Reproduzierbare Rezeptur** (für jeden neuen Knoten + für MR/MM-Re-Embedding):
```
prefix = "passage: "
text   = domainDescription + " " + domainKeywords.join(", ")
vector = embed(prefix + text)   // mean-pooled, L2-normalisiert, 384-dim
```
Den genauen Eingabe-Text **dokumentieren**, sonst ist ein späteres Re-Embedding nicht
reproduzierbar (und die Signatur bricht).

## 2. Kanonische Signier-Form muss byte-identisch über Laufzeiten sein

Der Handshake bricht, wenn zwei Knoten die Spore unterschiedlich kanonisieren. Heute
bewiesen: **WebCrypto (Modul 02) und `node:crypto` erzeugen identische Bytes**, weil beide
exakt dieselbe Norm fahren (INTERFACES §11.1):
- JSON ohne Whitespace, **Objekt-Schlüssel rekursiv sortiert**, Feld `signature` beim
  Signieren ausgenommen, Ed25519, base64url **ohne Padding**.
- **Arrays werden NICHT umsortiert.** Folge: der `domainVector` muss in der publizierten
  Datei in **exakt** der Reihenfolge/Float-Schreibweise stehen, in der signiert wurde —
  also genau das Objekt signieren (minus `signature`), das publiziert wird.

**Verifizierer-Paar als Gegenprobe:** `tools/verify_remote_spore.mjs` (WebCrypto-Pfad,
headless) ↔ Gegenseite `node:crypto`. Beide müssen für dieselbe Spore ✔ VALID liefern.
Vier Pflicht-Prüfpunkte: Pflichtfelder · `id==base64url(SHA256(rawPub))` · Signatur ·
Manipulationsprobe.

## 3. Warum MR/MM-Handshakes oft danebengingen — und die Workarounds

Aus den Live-Sichttests mit Mein-Rezeptbuch + Mein-Mixarium (DeX-Chrome, Galaxy Tab S6):

- **Service-Worker-Phantom-Cache:** der SW-Fetch-Pfad lieferte gecachte/alte Antworten,
  der Handshake „hängte". **Workaround:** direkter `receiveHandshake`-Aufruf statt über
  den SW-Fetch. Sauberer Fix langfristig: Endknoten-Modul-05 auf den `main`-Stand bringen
  (das alte `sbkim/05_anastomose-v2.js` ist prä-Bau-17 und dispatcht KEIN
  `sbkim:handshake`-window-Event automatisch).
- **Hard-Reload Pflicht nach jedem Pull:** Pages-Service-Worker UND HTTP-Cache sind beide
  hartnäckig (`docs/OBSERVATORIUM_BROWSER.md` Lehre 4). „Cache leeren und neu laden" nach
  jedem Repo-Pull, sonst testet man alten Code.
- **DeX-Chrome ≠ Tablet-Chrome:** zwei getrennte Browser-Instanzen, eigene IndexedDB +
  Service-Worker + PWA-Liste. Identitäten/Stores aus der einen sind in der anderen NICHT
  da — häufiger „warum ist meine nodeId weg?"-Stolperstein.
- **`navigator.clipboard.readText()` unzuverlässig zwischen DeX-Tabs:** für den
  Spore-Transfer zwischen zwei PWAs besser **BroadcastChannel** nutzen (Sender-Loop +
  Listener) statt Clipboard.

## 4. Identität dauerhaft sichern (sonst wechselt die nodeId)

Heute real passiert: SB·KIMTools erste nodeId (`eC3jzoo9…`) war **ungesichert** und ging
verloren → neue Identität nötig (`CyunQNDR…`). **Lehre:** den privaten Ed25519-Schlüssel
als Umgebungs-Secret / Passwort-Tresor ablegen (NIE ins Repo), nur den öffentlichen Teil
publizieren. Dann bleibt die nodeId über Sitzungen **stabil**. Bei Wechsel: alte nodeId
als `previousNodeIds` archivieren (gelebt in `status.json`).

## 5. Gestufte Andock-Stufen (niedrigschwellig anfangen)

- **`verified-spore`** = Identität/Signatur verifiziert, `domainVector` optional/Demo.
  Reiner Identitäts-Andock — niedrigschwellig, gut zum Anfangen.
- **`verified-match`** = zusätzlich echter Cross-Knoten-Match ≥ `PROVIDER_MIN_MATCH`
  (0.80), mit `matchScore`. Verlangt echten `domainVector` beidseits (`_demo` entfernt).

So kann ein neuer Knoten erst andocken (Identität) und den echten Match später nachliefern
— genau der Pfad, den dieser Andock real durchlaufen hat (erst spore, dann 0.8485).

## 6. Inbox-Konvention für nachprüfbares Vertrauen

Jeder Knoten legt eine signatur-reine 1:1-Kopie der Gegenseite ab
(`<gegenseite>_inbox.json`, KEIN Zusatzfeld) + einen Prüf-Vermerk
(`<gegenseite>_inbox.verify.md`: Quelle, Datum, Verifizierer+Befehl, 4-Punkte-Ergebnis,
Identität, Manipulationsprobe). Macht den Andock **beidseitig bezeugbar**.

---

## Konkrete To-dos für die MR/MM-Re-Migration (abgeleitet)

1. Endknoten-Modul-05 (`sbkim/05_anastomose-v2.js`) auf `main`-Stand heben →
   automatischer `sbkim:handshake`-Dispatch, kein manueller Eruda-Workaround mehr.
2. Echten `domainVector` für MR + MM per `tools/embed_helper.html` neu erzeugen, Spore
   neu signieren, `_demo` raus (falls noch gesetzt).
3. Nach jedem Schritt Hard-Reload; Sichttest in DERSELBEN Chrome-Instanz (DeX **oder**
   Tablet, nicht gemischt).
4. Spore-Transfer zwischen PWAs über BroadcastChannel, nicht Clipboard.
5. Ziel: Cross-Knoten-Match MR ⟷ MM bzw. MR/MM ⟷ Sage als `verified-match` mit Score in
   `status.json` eintragen — analog SB·KIMTool (0.8485).
