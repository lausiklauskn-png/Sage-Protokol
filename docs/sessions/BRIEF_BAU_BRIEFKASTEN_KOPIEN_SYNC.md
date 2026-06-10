# BRIEF — Bau: „Briefkasten" für Kopien-Synchronisation (server-los, noch NICHT SBKIM)

**Erstellt:** 2026-06-07 · **Typ:** Bau-Sitzung in **einer anderen App** (das Repo, in dem die
Sitzung läuft — NICHT Sage-Protokol) · **Auslöser:** Klaus 2026-06-07 — eine App soll einen
Briefkasten bekommen, mit dem sie sich **nur mit Kopien von sich selbst** synchronisiert, über
eine Sync-Vereinbarung. Noch **nicht** ins SBKIM einbinden — erst interne Synchronisierung. Der
Briefkasten ist das Modul, das diese Kopien-Synchronisation leistet und die Grundlage für echte
Synchronisation legt.

> **Freibrief gilt** (Sage `CLAUDE.md` § Freibrief). Aus Sage geschrieben (Bau-Hub). Läuft im
> Ziel-App-Repo, braucht dort Schreib-/PR-Zugriff.

---

## Worum es geht (Konzept)

Eine PWA wird oft mehrfach installiert — Handy, Tablet, anderer Browser. Das sind **Kopien
derselben App** mit jeweils EIGENEN lokalen Daten (IndexedDB/localStorage). Der **Briefkasten**
lässt diese Kopien ihre Daten **server-los** abgleichen:

- Zwei Kopien schließen eine **Sync-Vereinbarung** (ein geteiltes Geheimnis, einmal von Kopie A
  zu Kopie B übertragen). Nur Kopien mit derselben Vereinbarung akzeptieren einander.
- Eine Kopie baut ein **Sync-Paket** (ihre geänderten Datensätze + Sequenznummer, mit dem
  Geheimnis signiert/MAC'd).
- Die andere Kopie **prüft** (MAC) und **mischt** das Paket in ihre Daten (Last-Write-Wins per
  `updatedAt`, idempotent).
- **Transport ist erst manuell** (Datei / Zwischenablage / QR) — bewusst transport-agnostisch,
  damit später Repo-Datei / Relay / SBKIM denselben Paket-String tragen können.

**Abgrenzung (wichtig):** Das ist **NICHT** SBKIM. KEINE SBKIM-Module einbauen, NICHT ans Mycel
andocken, KEINE öffentliche Identität/Spore. Nur interne Kopien-Synchronisation. Die Konventionen
(Sequenz, Quittung/ack, kanonische JSON, „Pushen ist das Signal") sind aber bewusst SO gewählt,
dass der spätere SBKIM-Schritt klein wird.

---

## Der Befehl (copy-paste in die Ziel-App-Sitzung)

```
Du bist eine Bau-Sitzung im Repo deiner App (NICHT Sage-Protokol). Freibrief gilt
(Sage CLAUDE.md § Freibrief). Antworten auf Deutsch, ruhig und präzise. Sichttest bleibt Klaus.

ZIEL: Baue einen „Briefkasten" — ein eigenständiges Modul, mit dem sich KOPIEN DERSELBEN App
(Handy/Tablet/anderer Browser) server-los synchronisieren, über eine Sync-Vereinbarung. NOCH
NICHT SBKIM: KEINE SBKIM-Module, KEIN Mycel-Andock, KEINE öffentliche Identität/Spore. Nur
interne Kopien-Synchronisation. Aber so gebaut, dass es die Grundlage für echte Synchronisation
ist (stabile IDs + updatedAt + Sequenz + ack + idempotentes Mergen + authentifizierte Pakete).

SCHRITT 0 — REPO + BRANCH BESTÄTIGEN (PFLICHT, kurz):
  git remote -v        (ist das wirklich das gemeinte App-Repo?)
  git branch --show-current   (arbeite auf dem Branch, der live über Pages läuft — i.d.R. main;
                               sonst git checkout main && git pull --ff-only)
  ls                   (verschaffe dir Überblick)
Lies die App: wie/wo speichert sie ihre Datensätze (IndexedDB/localStorage)? Was ist ein
„Datensatz" (z.B. ein Rezept, ein Eintrag)? Hat jeder Datensatz eine STABILE id? Wenn nicht:
das ist Voraussetzung — siehe „Grundlagen" unten.

BAUSCHRITT 1 — VORAUSSETZUNG SCHAFFEN (Grundlage für echte Synchronisation):
Jeder synchronisierbare Datensatz braucht zwei Felder:
  - id: stabil und eindeutig (z.B. crypto.randomUUID() beim Anlegen; NIE neu vergeben).
  - updatedAt: ISO-Zeitstempel, der bei JEDER Änderung neu gesetzt wird (new Date().toISOString()).
Lösch-Vorgänge nicht hart löschen, sondern als „tombstone" markieren ({id, updatedAt, deleted:true}),
damit Löschungen sich auch synchronisieren. (Tombstones kann die App nach langer Zeit aufräumen.)
Diese drei Regeln (stabile id, updatedAt bei jeder Änderung, Tombstones) SIND die Grundlage —
ohne sie kann kein deterministisches Mergen funktionieren.

BAUSCHRITT 2 — DAS MODUL briefkasten.js ANLEGEN (Referenz-Implementierung, anpassen: APP_ID):

/* briefkasten.js — server-loser Sync-Briefkasten NUR für Kopien DERSELBEN App.
   NICHT SBKIM. Transport-agnostisch: Pakete sind Strings (Datei/Clipboard/QR). */
(function (global) {
  "use strict";
  var APP_ID = "DEINE-APP-ID";   // EINDEUTIG pro App setzen, z.B. "muttis-rezeptbuch-v1"
  var LS = { pact:"bk_pact", copyId:"bk_copy_id", seq:"bk_seq", ack:"bk_ack" };

  function b64u(bytes){ var b="",v=new Uint8Array(bytes); for(var i=0;i<v.length;i++)b+=String.fromCharCode(v[i]);
    return btoa(b).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); }
  function unb64u(s){ var p=s.length%4===0?"":"====".slice(s.length%4);
    var b=atob(s.replace(/-/g,"+").replace(/_/g,"/")+p),o=new Uint8Array(b.length);
    for(var i=0;i<b.length;i++)o[i]=b.charCodeAt(i); return o; }
  function utf8(s){ return new TextEncoder().encode(s); }
  function canon(v){ if(v===null)return null; if(Array.isArray(v))return v.map(canon);
    if(typeof v==="object"){var o={};Object.keys(v).sort().forEach(function(k){o[k]=canon(v[k]);});return o;} return v; }
  function subtle(){ if(!global.crypto||!global.crypto.subtle) throw new Error("WebCrypto fehlt — über https/Pages öffnen."); return global.crypto.subtle; }
  function rnd(n){ var a=new Uint8Array(n); global.crypto.getRandomValues(a); return a; }
  function lget(k){ try{var v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;} }
  function lset(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} }

  async function mac(secretB64,obj){
    var key=await subtle().importKey("raw",unb64u(secretB64),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
    return b64u(await subtle().sign("HMAC",key,utf8(JSON.stringify(canon(obj)))));
  }
  function copyId(){ var id=lget(LS.copyId); if(!id){id=b64u(rnd(8));lset(LS.copyId,id);} return id; }

  // --- Sync-Vereinbarung ---
  function createAgreement(){ lset(LS.pact,{pactId:b64u(rnd(8)),secret:b64u(rnd(32))}); copyId(); return exportCode(); }
  function exportCode(){ var p=lget(LS.pact); if(!p)return null;
    return b64u(utf8(JSON.stringify({app:APP_ID,pactId:p.pactId,secret:p.secret}))); }
  function joinAgreement(code){ var o; try{o=JSON.parse(new TextDecoder().decode(unb64u(code.trim())));}catch(e){throw new Error("Vereinbarungs-Code ungültig.");}
    if(o.app!==APP_ID) throw new Error("Code gehört zu anderer App ("+o.app+").");
    if(!o.pactId||!o.secret) throw new Error("Code unvollständig.");
    lset(LS.pact,{pactId:o.pactId,secret:o.secret}); copyId(); return true; }
  function hasAgreement(){ return !!lget(LS.pact); }

  // --- Outbox: items = [{id, updatedAt, deleted?, data}] ---
  async function exportPacket(items){
    var p=lget(LS.pact); if(!p) throw new Error("Keine Sync-Vereinbarung — erst erstellen/beitreten.");
    var seq=(lget(LS.seq)||0)+1; lset(LS.seq,seq);
    var body={v:1,app:APP_ID,pactId:p.pactId,from:copyId(),seq:seq,createdAt:new Date().toISOString(),items:items};
    body.mac=await mac(p.secret,body); return JSON.stringify(body);
  }

  // --- Inbox: handlers = { getItem(id)->{updatedAt,...}|null, upsert(item), remove(id) } ---
  async function importPacket(str,handlers){
    var pkt; try{pkt=JSON.parse(str);}catch(e){throw new Error("Paket ist kein JSON.");}
    var p=lget(LS.pact); if(!p) throw new Error("Keine Sync-Vereinbarung.");
    if(pkt.app!==APP_ID) throw new Error("Paket einer anderen App.");
    if(pkt.pactId!==p.pactId) throw new Error("Paket einer anderen Sync-Vereinbarung — abgelehnt.");
    var sent=pkt.mac, check={}; Object.keys(pkt).forEach(function(k){ if(k!=="mac")check[k]=pkt[k]; });
    if((await mac(p.secret,check))!==sent) throw new Error("MAC ungültig — keine echte Kopie dieser Vereinbarung.");
    if(pkt.from===copyId()) return {applied:0,skipped:0,reason:"eigenes Paket"};
    var ack=lget(LS.ack)||{};
    if((ack[pkt.from]||0)>=pkt.seq) return {applied:0,skipped:(pkt.items||[]).length,reason:"schon verarbeitet"};
    var applied=0,skipped=0;
    (pkt.items||[]).forEach(function(it){
      var local=handlers.getItem(it.id), lt=(local&&local.updatedAt)||"";
      if(!local || it.updatedAt>lt){ if(it.deleted)handlers.remove(it.id); else handlers.upsert(it); applied++; }
      else skipped++;
    });
    ack[pkt.from]=pkt.seq; lset(LS.ack,ack);
    return {applied:applied,skipped:skipped};
  }

  global.Briefkasten={ APP_ID:APP_ID, createAgreement, exportCode, joinAgreement, hasAgreement,
    exportPacket, importPacket, copyId };
})(typeof window!=="undefined"?window:globalThis);

BAUSCHRITT 3 — DIE APP VERDRAHTEN:
- briefkasten.js laden (<script src="briefkasten.js">) und APP_ID eindeutig setzen.
- Export-Sammler: baue aus deinen Datensätzen die items-Liste [{id, updatedAt, deleted?, data}]
  (data = der eigentliche Datensatz-Inhalt). Für den Anfang reicht „alle Datensätze"; später nur
  die seit dem letzten Export geänderten (Delta).
- Import-Handler: { getItem(id): liefert deinen lokalen Datensatz (mit updatedAt) oder null;
  upsert(item): schreibt item.data unter item.id mit item.updatedAt in deinen Speicher;
  remove(id): löscht/tombstoned den Datensatz }.

BAUSCHRITT 4 — UI (4 Knöpfe, schlicht, im Einstellungen-/Sync-Bereich):
- „Sync-Vereinbarung erstellen" → Briefkasten.createAgreement() → zeige den Code (Text zum
  Kopieren; optional QR). Hinweis: Diesen Code sicher zur anderen Kopie bringen (wie ein Backup).
- „Vereinbarung beitreten" → Texteingabe → Briefkasten.joinAgreement(code).
- „Sync-Paket exportieren" → str=await Briefkasten.exportPacket(items) → Download als .json ODER
  in die Zwischenablage ODER QR.
- „Sync-Paket importieren" → Texteingabe/Datei → res=await Briefkasten.importPacket(str,handlers)
  → melde res.applied/res.skipped. App-Ansicht neu rendern.

WAS DU NICHT TUST: KEINE SBKIM-Module/-Spore/-Identität; NICHT ans Mycel andocken; keine neue
Krypto jenseits von WebCrypto-HMAC; kein PII/Secret ins Repo committen (die Vereinbarung lebt im
Browser/wird vom Nutzer übertragen, NICHT im Repo); der geteilte Schlüssel verlässt das Gerät nur
auf bewusste Nutzer-Geste (Code zeigen/übertragen).

SICHTTEST (für Klaus, server-los nachstellbar):
1. Zwei Browser-Profile/Geräte mit der App. In A „Vereinbarung erstellen" → Code kopieren.
2. In B „Beitreten" → Code einfügen.
3. In A einen Datensatz anlegen/ändern → „Sync-Paket exportieren" → Datei/Clipboard zu B.
4. In B „Sync-Paket importieren" → der Datensatz erscheint. Nochmal importieren → applied:0
   (idempotent). Eine Änderung in B zurück nach A testen.

GRUNDLAGEN FÜR ECHTE SYNCHRONISATION (so geht es weiter):
- Stabile id + updatedAt bei jeder Änderung + Tombstones = deterministisches Mergen (Last-Write-
  Wins per updatedAt). DAS ist das Fundament.
- Pro Kopie eine monotone seq + ack[copyId] = Reihenfolge + Idempotenz (kein Doppel-Anwenden).
- Authentifizierte Pakete (HMAC) + app/pactId-Scope = nur Kopien DERSELBEN App + Vereinbarung.
- Pakete sind reine Strings = transport-agnostisch. Erst manuell (Datei/Clipboard/QR). Später
  OHNE Änderung der Merge-Logik austauschbar gegen: eine im Repo committete Datei (wie SBKIMs
  SIGNAL.json/AUSTAUSCH — „Pushen ist das Signal"), einen kleinen Relay, oder den SBKIM-Briefkasten.
- SPÄTERER SBKIM-Schritt (nicht jetzt): das geteilte HMAC-Geheimnis wird durch die öffentliche
  Ed25519-Identität (Modul 02) ersetzt, der Paket-Transport durch die netzweite Briefkasten-
  Konvention (INTERFACES §11.6). Weil seq/ack/kanonische JSON schon passen, ist der Sprung klein.

PFLICHT AM ENDE: Sichttest ODER „ungeprüft, wartet auf Klaus"; kurzer Stand-Eintrag in der App-
Doku; Commit auf eigenem Branch (z.B. claude/briefkasten-kopien-sync) + Draft-PR im App-Repo.
Merge entscheidet Klaus.
```

---

## Hinweise für Klaus
- Generisch gehalten — die Sitzung passt APP_ID + die drei Daten-Handler an ihre App an.
- Bewusst **nicht** SBKIM: erst interne Kopien-Synchronisation, sauber als Fundament. Der spätere
  Mycel-Schritt ist im Brief skizziert (HMAC-Geheimnis → Ed25519-Identität, manueller Transport →
  Briefkasten-Konvention), bleibt aber für jetzt außen vor.
- Sichttest server-los mit zwei Profilen/Geräten möglich.

## Freibrief
Freibrief gilt, siehe Sage-Protokol `CLAUDE.md` § Freibrief.
