# Pflege 2026-05-17 — Modul 05/SW Phantom-Clients-Fix in `sbkim-sw.js`

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase. Branch
`claude/pflege-sw-phantom-clients-fix`. Folge-Pflege zum
SW-Bridge-Phantom-Cache-Bug aus Cross-Knoten-Handshake-Sitzung
(PR #65) — heute durch Klaus' Tablet-Reboot-Sichttest 2026-05-17
als „Phantom-Cache überlebt auch Hardware-Reboot" verifiziert.

---

## Klaus' Befund (Tablet-Reboot-Test 2026-05-17)

1. **Identitäten überleben Stromaus** ✓ — gestriges Persist-Flag-
   Versprechen gehalten: Mein-Mixarium `7xf0tt33_…` und
   Mein-Rezeptbuch `RHhposP0…` sind nach Tablet-Aus/An weiter da.
2. **DBs sauber** ✓ — keine Phantom-`sbkim` (ohne Suffix), nur die
   vier erwarteten (`MeinMxBackup1`, `MeinRzBackup1`,
   `sbkim_mixarium`, `sbkim_rezeptbuch`).
3. **PWAs als Apps deinstalliert** + **Sage-Protokol-Test-Panel-Tab
   geschlossen** — alle gestern verdächtigen Phantom-Quellen
   eliminiert.
4. **Trotzdem** Cross-Knoten-Handshake via normalem
   `SbkimAnastomose.handshake()`-Pfad weiterhin
   `outcome:"rejected", reason:"toNodeId stimmt nicht zum Empfänger"`.

→ Bug muss im SW-Code selbst sein, nicht in zwischenzeitlichen
Browser-Caches.

---

## Diagnose

`src/sbkim-sw.js` `handleBridge()` Zeile 158–164:

```js
// VORHER
const clientList = await self.clients.matchAll({
  type: "window",
  includeUncontrolled: true,   // ← Phantom-Falle
});
const target = clientList.find(c => c.id === originatingClientId) || clientList[0];
```

**Problem:** `includeUncontrolled: true` findet ALLE Window-Clients
der Origin, auch Pages, die diesen SW NICHT als Controller haben:

- Andere Pfade derselben Origin (z.B. `Sage-Protokol/tests/manual_check.html`)
- Andere PWAs mit eigenem App-SW (Mein-Rezeptbuch beim Mein-Mixarium-
  SW-Lookup)
- bfcache-Restbestand alter Tabs

Diese „Phantom-Pages" haben oft ALTE Modul-02-Identitäten oder gar
keine SBKIM-Module geladen → antworten mit `reason:"toNodeId stimmt
nicht zum Empfänger"`. Im `find(...) || clientList[0]`-Pattern wird
der Phantom-Client gewählt statt der echte Mein-Mixarium-Tab.

---

## Fix

```js
// NACHHER (51 statt 21 Zeilen, ausführlich kommentiert)
const clientList = await self.clients.matchAll({
  type: "window",
  includeUncontrolled: false,   // ← nur Pages, die diesen SW kontrollieren
});
if (clientList.length === 0) {
  return jsonError(503, "Service Unavailable — keine aktive controlled Page-Instanz (Tab evtl. nicht vom SW kontrolliert).");
}
// Reihenfolge: erst originating-Client, dann der Rest
const ordered = [];
const origin = clientList.find(c => c.id === originatingClientId);
if (origin) ordered.push(origin);
for (const c of clientList) {
  if (c !== origin) ordered.push(c);
}
// Alle controlled Clients der Reihe nach probieren — bis einer
// NICHT "toNodeId stimmt nicht" sagt (= ist der wahre Adressat)
let pageResponse;
let lastError = null;
for (const target of ordered) {
  try {
    pageResponse = await askPage(target, parsed, messageType);
  } catch (err) {
    lastError = err;
    continue;
  }
  if (
    pageResponse &&
    pageResponse.outcome === "rejected" &&
    typeof pageResponse.reason === "string" &&
    pageResponse.reason.indexOf("toNodeId") !== -1
  ) {
    lastError = null;
    continue; // dieser Client kennt die toNodeId nicht — nächster
  }
  return new Response(JSON.stringify(pageResponse), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
// Alle Clients haben mit "toNodeId stimmt nicht" abgelehnt — letzte Antwort zurückgeben
if (pageResponse) {
  return new Response(JSON.stringify(pageResponse), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
return jsonError(503, "Service Unavailable — Page hat nicht geantwortet (" + (lastError && lastError.message ? lastError.message : "unbekannt") + ").");
```

**Zwei Verbesserungen in einer Pflege:**

1. **`includeUncontrolled: false`** schließt Phantom-Pages strukturell
   aus dem Client-Pool aus.
2. **Loop-Logik „alle controlled Clients der Reihe nach"** macht den
   SW robust auch bei mehreren Tabs der gleichen Origin mit
   unterschiedlichen Identitäten — der wahre Adressat wird dynamisch
   gefunden, statt blind den ersten zu wählen.

---

## Bewusst nicht angefasst

- **`SBKIM_SW_STANDALONE`-Flag** unverändert (Variante 3a/3b
  Koexistenz bleibt).
- **`includeUncontrolled`-Wert** hardcoded `false` (kein neues
  Opt-in-Flag) — Begründung: das alte Verhalten war ein Bug, kein
  Feature. Falls künftig spezielle Endknoten ein Opt-in brauchen,
  kann ein Flag analog zu `SBKIM_SW_STANDALONE` ergänzt werden.
- **Karte 05 (Anastomose)** und **Karte 09 (Einbau-PWA)**
  unverändert — die SW-interne Logik ist kein API-Vertrag.
- **INTERFACES.md** unverändert.
- **Modul 05 Code** (`src/modules/05_anastomose.js`) unverändert —
  Sender-Side und `receiveHandshake` blieben gleich.
- **`status.json`** unverändert.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.
- **`update_puls_pie.py`** NICHT aufgerufen (kein Score-Wechsel).
- **Endknoten-Repos** unverändert — Klaus muss die neue
  `sbkim-sw.js` selbst nachziehen (Termux-Befehle unten).

---

## Validierung

- `node --check src/sbkim-sw.js` grün.
- Manuell durchgespielt:
  - 1 controlled Client → wird direkt gewählt
  - mehrere controlled Clients → der Reihe nach versucht; erster der
    nicht „toNodeId stimmt nicht" sagt gewinnt; alle haben „toNodeId
    stimmt nicht" gesagt → letzte Antwort wird zurückgegeben
  - 0 controlled Clients → sauberes 503
- Datei wächst von 212 auf 251 Zeilen (rein interne SW-Logik).

---

## Was offen blieb (Klaus' Pflicht in Endknoten-Repos)

Nach Merge dieses PRs:

```bash
# Schritt 1: neue sbkim-sw.js in Mein-Mixarium kopieren
cd ~/Sage-Protokol && git checkout main && git pull
cp src/sbkim-sw.js ~/Mein-Mixarium/sbkim/sbkim-sw.js
cd ~/Mein-Mixarium
git add sbkim/sbkim-sw.js
git commit -m "sbkim-sw.js: Phantom-Clients-Fix nachgezogen"
git push

# Schritt 2: nach Mein-Rezeptbuch
cp ~/Sage-Protokol/src/sbkim-sw.js ~/Mein-Rezeptbuch/sbkim/sbkim-sw.js
cd ~/Mein-Rezeptbuch
git add sbkim/sbkim-sw.js
git commit -m "sbkim-sw.js: Phantom-Clients-Fix nachgezogen"
git push

# Schritt 3: Pages-Build warten (~2 min), dann beide PWA-Tabs
#   schließen + neu öffnen (damit der neue SW per Activate-Cycle aktiv wird)

# Schritt 4: Im Mein-Rezeptbuch-Tab in Eruda Console Handshake-Test:
#   (async()=>{var own=await SbkimSpore.getOwnSpore();var ownVec=Float32Array.from(own.domainVector);
#    var peer=await fetch('https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json?nc='+Date.now()).then(r=>r.json());
#    try{var result=await SbkimAnastomose.handshake(peer,ownVec);console.info('Handshake:',JSON.stringify(result,null,2));}
#    catch(e){console.error('Fehler:',e.message);}})()
```

**Erwartung diesmal:** `outcome: "established"` via normalem SW-Pfad
ohne localStorage-Bypass.

---

## Nächster sinnvoller Schritt

1. **Klaus' Endknoten-Pflege** (Schritte 1–4 oben).
2. **Falls erfolgreich:** Folge-Pflege im Sage-Protokol —
   `status.json` `pingStatus` von `"live-direct"` auf `"live"`
   umstellen, PULS-Endknoten-Tabelle nachziehen.
3. **Klaus' Browser-Daten-Lösch-Resilienz-Test** (Phase 3 vom
   Resilienz-Plan) kann danach durchgeführt werden.

---

**Branch:** `claude/pflege-sw-phantom-clients-fix`.
**Vorgänger:** Cross-Knoten-Handshake-Sitzung 2026-05-16 (PR #65)
und Klaus' Tablet-Reboot-Sichttest 2026-05-17.
