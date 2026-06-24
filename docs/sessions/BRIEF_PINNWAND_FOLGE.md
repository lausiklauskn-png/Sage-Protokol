# Brief — Folge-Sitzung: Pinnwand-PWA nach Klaus' Sichttest

> Angelegt 2026-06-24 zum Sitzungsende. Vorgänger-Übergabe:
> `docs/sessions/archiv/2026-06-24_nostr-pinnwand-test.md`. Stand: alle PRs
> #421–#436 auf `main`, Pinnwand-PWA fertig (Engine + moderner Look + Icon),
> Sichttests bei Klaus offen.

```
Du bist eine Bau-Sitzung in Sage-Protokol — „Pinnwand-PWA, Folge nach Sichttest".
Freibrief gilt (CLAUDE.md § Freibrief): eigene, getestete, abgegrenzte Änderungen
selbstständig auf main mergen (kleiner Branch → Draft-PR → ready → squash).
Klaus testet geräteübergreifend selbst; headless ersetzt das nicht. WebLLM ist
aus der Cloud-Session NICHT testbar (keine GPU/Browser) — Klaus' Gerätelauf ist
der Wahrheitstest.

PFLICHTLESELISTE:
1. CLAUDE.md
2. docs/PULS.md (oberste Einträge 2026-06-24 — der ganze Pinnwand-Bogen)
3. docs/sessions/archiv/2026-06-24_nostr-pinnwand-test.md (Übergabe, voller Stand)
4. docs/discovery/nostr-test/RICHTER-STUFEN.md (drei freie Stufen)
5. Nur bei Bedarf: LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md, MEILENSTEIN_SEMANTISCHE_SUCHE.md

WAS STEHT (alles auf main, server-los, kein src/-Modul-Code):
- docs/discovery/nostr-test/ : Boden-Beweis (index.html) + Frage→Antwort
  (frage-antwort.html, Whitening + KI-Richter Cloud/WebLLM) + geraete-check.html.
- pinnwand/ : eigenständige, installierbare PWA (manifest+SW+Icon, moderne Optik,
  Engine 1:1). Geschwister zu such-tool/. Eigener Download. NICHT in Sage-Page
  verlinkt (Klaus' Wort abwarten).
- Krypto lokal vendoriert (noble v1.7.1), Embedding Modul 03 byte-vendoriert
  (Drift-Guard im Smoke). Schlüssel opt-in im localStorage, sonst nur im Speicher.

DEINE AUFGABE: Klaus' Sichttest-Rückmeldung umsetzen. Wahrscheinliche Punkte:
- Optik-Feinschliff der pinnwand-PWA (Aurora/Animation dezenter oder kräftiger,
  Farben/Logo/Schrift nach Klaus' Geschmack; ggf. näher an einen seiner Mockups).
- WebLLM: falls Klaus den Gerätelauf gemacht hat → Modell-Liste/Kennungen nach
  seinem Befund justieren (welche Klasse trägt sein Galaxy Tab S6, welche
  Modell-ID lädt sauber, f16 vs f32).
- Icon/Favicon-Nachschärfen, falls nötig.

MÖGLICHE NÄCHSTE STICHE (nur wenn Klaus es will, nicht ungefragt alles):
- Graph-Ansicht als „zweite Gestalt" (Klaus' MYZEL-Mockup) — Liste bleibt
  Grundansicht, Graph zuschaltbar; Kanten lazy/on-demand, nicht alle-gegen-alle.
- Relevanz-Rückmeldung („lernt mit jeder Antwort", server-los, pro Sitzung,
  Rocchio — Frage-Vektor zu guten Treffern ziehen). Echtes „justiert sich nach".
- Cross-Knoten: Modul 04.C queryLocal gegen echten App-Inhalt einer Geschwister-
  App (notiz-bauplan-live-suche.md, „Inhalt schlägt Name").

LEITPLANKEN: kein src/-Modul-Code (außer ausdrücklich), kein Protokoll-Bump,
keine PII, Krypto/Modelle CDN nur on-demand + nutzer-ausgelöst (Pilz-Prinzip).
pinnwand/ + nostr-test/ NICHT in Sage-Page/Discovery verlinken ohne Klaus' Wort.
Drift-Guard halten (vendorierte Module byte-gleich). Alle Smokes grün halten:
node docs/discovery/nostr-test/_smoke*.mjs und node pinnwand/_smoke.mjs.
Inhalt vor Wirkung: jede Änderung an der Render-Schicht — Engine unangetastet.

PAGES-LEHRE: nach mehreren schnellen Merges braucht GitHub Pages 1–2 min +
Klaus' Hard-Reload, bis neue Dateien live sind (sonst 404/alter Stand).
```
