# Brief — Bau-Sitzung: Nostr-Pinnwand-Test (geräteübergreifender Boden-Beweis)

> Angelegt 2026-06-24. Eigenständiger Test-Stich, KEIN Produktiv-Modul. Ziel:
> beweisen, dass ein Zettel aus Browser A über einen geborgten dummen Relay
> (Nostr) in Browser B / auf einem anderen Gerät auftaucht — server-los für Klaus
> (er betreibt nichts). Voller Kontext in den unverlinkten Notizen unter
> `docs/discovery/`: `notiz-briefkasten-pinnwand.md`, `notiz-bauplan-live-suche.md`,
> `notiz-kosten-nutzen.md`, `vorsehung-suche.md`.

```
Du bist eine Bau-Sitzung in Sage-Protokol — „Nostr-Pinnwand-Test (Boden-Beweis)".
Freibrief gilt (CLAUDE.md § Freibrief): eigene, getestete, abgegrenzte Änderungen
selbstständig auf main mergen (kleiner Branch → PR → squash). Klaus testet
geräteübergreifend selbst; headless ersetzt das nicht.

WORUM ES GEHT (kurz, damit du frisch starten kannst):
Wir bauen eine semantische, server-lose „Pinnwand". Zwei getrennte Browser
können NICHT direkt miteinander reden (keine Leitung dazwischen). Es braucht ein
„dummes gemeinsames Brett" als Medium — wie Erde/Luft im Wald, durch die Sporen
driften. Kandidat für dieses geborgte, machtlose Brett: NOSTR (Netz aus dummen
Relays, die signierte Notizen tragen; Identität = Schlüsselpaar = die Spore).
Dieser Test beweist NUR das Medium: ein Zettel aus Browser A taucht in Browser B
auf. NICHT mehr (keine semantische Sortierung, keine Frage→Antwort, keine
Privatheit). Das ist die Vorbedingung für alles Weitere.

PFLICHTLESELISTE:
1. CLAUDE.md
2. docs/discovery/notiz-bauplan-live-suche.md (das große Bild)
3. docs/discovery/notiz-briefkasten-pinnwand.md (Briefkasten=Brett, was schon läuft)
4. Diesen Brief.

AUFGABE — eine eigenständige Test-Seite bauen:
Ort: docs/discovery/nostr-test/index.html (über GitHub Pages erreichbar, damit
Klaus die URL auf Tablet UND Handy/Freund öffnen kann). Self-contained; Krypto
LOKAL vendoriert (KEIN Runtime-CDN, kein Tracker).

1. Krypto vendorieren: @noble/secp256k1 (v2, single file, async Schnorr via
   WebCrypto) als docs/discovery/nostr-test/noble-secp256k1.js ablegen
   (npm install @noble/secp256k1 → die ESM-Datei kopieren; prüfen, dass sie KEINE
   bare imports hat / dependency-frei lädt).
2. Minimaler Nostr-Client (vanilla, NIP-01):
   - Schlüsselpaar: 32 Zufallsbytes (crypto.getRandomValues), hex in localStorage
     persistieren (Wiederkehr = gleiche Identität). pubkey = schnorr.getPublicKey
     (x-only, 32-Byte-hex).
   - Event: { pubkey, created_at, kind:1, tags:[["t","sbkim-pinnwand-test"]],
     content }. id = sha256(JSON.stringify([0,pubkey,created_at,kind,tags,content]))
     als hex (WebCrypto crypto.subtle.digest). sig = schnorr.sign(idBytes, priv)
     als hex.
   - Senden: WebSocket je Relay, ["EVENT", event] schicken.
   - Empfangen: ["REQ", subId, {kinds:[1], "#t":["sbkim-pinnwand-test"], limit:50}];
     auf ["EVENT", subId, ev] → anzeigen; ["EOSE", subId] behandeln.
   - Relays (frei, ohne Konto; einige drosseln evtl. — pro Relay Status zeigen):
     wss://relay.damus.io, wss://nos.lol, wss://relay.nostr.band
3. UI (schlicht, robust):
   - Eigene Kurz-pubkey + Relay-Status-Punkte (verbunden/aus).
   - Textfeld + Knopf „Aufs Brett legen".
   - Live-Liste eingehender Zettel (von JEDEM): Autor-Kurz-pubkey + Uhrzeit +
     Text + von welchem Relay. Eigene Zettel markieren.
   - „Krypto-Selbsttest: OK/FAIL" — beim Laden einmal signieren+verifizieren
     (Konstante), damit die Krypto auch OFFLINE belegt ist.
4. Headless-Smoke (docs/discovery/nostr-test/_smoke.mjs, Playwright wie die
   anderen): Seite lädt, Krypto-Selbsttest = OK, UI-Elemente da, keine
   Konsolen-Fehler. Relay-Verbindung NICHT voraussetzen (headless hat evtl. kein
   Netz zu den Relays) — Smoke prüft Seite + Krypto + UI, nicht den Relay-Round-Trip.

WAS „BEWIESEN" HEISST (Klaus, geräteübergreifend):
URL auf Tablet UND Handy (oder Freund) öffnen → auf dem einen „Salate" tippen →
taucht beim anderen binnen Sekunden auf; und umgekehrt. Zwei getrennte Browser,
ein geborgter Relay dazwischen, Klaus betreibt nichts. Das ist der Boden-Beweis.

LEITPLANKEN:
- Eigenständiger Test unter docs/discovery/nostr-test/. KEIN Modul-Code in src/,
  kein Protokoll-Bump, keine PII. Krypto lokal vendoriert (kein CDN zur Laufzeit).
- Ehrlich dokumentieren (im Seiten-Footer + Smoke-Kommentar): beweist NUR das
  Medium. Öffentlich (jeder Relay-Leser sieht die Zettel), keine garantierte
  Haltbarkeit (Relays dürfen verwerfen/drosseln), kein Spam-Schutz. Semantik,
  Frage→Antwort, Privatheit = spätere Schritte.
- Sage-Smokes der anderen Module unberührt/grün halten. Diese Seite NICHT in die
  Sage-Page oder Discovery verlinken (Notiz-Charakter), außer Klaus sagt es.

NÄCHSTE SCHRITTE NACH GRÜNEM BODEN-BEWEIS (nur benennen, nicht bauen):
- Frage→Antwort übers Brett (statt nur posten/lesen).
- Inhalt-statt-Name: Pin trägt grobe Tags fürs Vorfiltern, Bedeutungs-Sortierung
  bleibt lokal (Modul 03/04). Anschluss an den Live-Such-Beweis
  (notiz-bauplan-live-suche.md).
```
