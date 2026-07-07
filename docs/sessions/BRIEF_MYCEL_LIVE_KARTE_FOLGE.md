# BRIEF · Mycel-Live-Karte — Folge-Sitzung (Sichttest-Nachzug + Sage-Page-Mount + Live-Beweis)

**Datum des Briefs:** 2026-07-08 · **Absender:** Bau-Sitzung Mycel-Live-Karte (Branch `claude/obsidian-skills-integration-8pg6xy`)
**Freibrief gilt** (siehe CLAUDE.md § Freibrief — netzweit, Selbst-Merge eingeschlossen).

---

## Pflichtlektüre vor der Arbeit (Reihenfolge einhalten)

1. `CLAUDE.md` (Verfassung) → 2. `docs/PULS.md` (Eintrag 2026-07-08 „Bau Mycel-Live-Karte") →
3. dieser Brief → 4. `mycel-karte/index.html` (die gebaute Seite, Einzeldatei) →
5. nur bei Mount-Arbeit: Sage-Page `index.html` Karten-Bereich (gezielt greppen, Token-Budget!).

## Stand

- `mycel-karte/index.html` ist gebaut und gemergt: Kräfte-Graph der 8 Netz-Knoten,
  lauscht auf `sbkim:*`-Fenster-Events + BroadcastChannel `sbkim`/`sbkim-membrane`
  (reine Anzeige, Empfangsmodus, gatet nichts). Regler: Pillengröße, Ton (0–100),
  drei Farben, Vollbild, Probelauf (klar als Simulation gebadged).
- Headless grün (`node --check` + Logik-Smoke 4/4). **Klaus' Browser-Sichttest steht aus.**
- Live-URL nach Pages-Deploy: `https://lausiklauskn-png.github.io/Sage-Protokol/mycel-karte/`

## Was diese Folge-Sitzung tun soll (Reihenfolge)

1. **Sichttest-Nachzug:** Klaus' Tablet-Befunde einsammeln (Optik, Regler, Ton, Vollbild,
   Probelauf) und beheben. Erst danach weiterbauen.
2. **Sage-Page-Mount:** Karte/Kachel auf der Sage-Page, Klick öffnet
   `mycel-karte/` in **neuem Fenster/Tab** (`target="_blank" rel="noopener"`) —
   Klaus' DeX-Szenario: Karte auf den Zweitbildschirm ziehen. Optik an bestehende
   Karten anlehnen (Schwarz-Loch-/Sonnen-Karten-Stil, ~280px-Bühne).
3. **Live-Cross-App-Beweis:** Klaus öffnet Mixarium + Rezeptbuch in Tabs, Karte im
   eigenen Fenster daneben → Andock auslösen → Karte muss REQUEST-Flash + Handshake-
   Zweiklang zeigen. Ergebnis ehrlich in PULS dokumentieren (grün oder Befund).
4. **Optional (nur wenn 1–3 grün):** Verwandtschafts-Badge an den Kanten
   (Modul 04 `relatedness`, REINE Anzeige) — Muster aus Bau 23 Raum-Badge übernehmen.

## Datenverträge (nicht brechen)

- Fenster-Events: `sbkim:alive {since,nodeId}` · `sbkim:handshake {outcome,peerNodeId,direction}`
  · `sbkim:fremd-alert` · `sbkim:postmessage` · `sbkim:nostr-listening` (Karte 17 Event-Bus-Schema).
- Kanal `sbkim`: `{type:"SBKIM_ANASTOMOSE_REQUEST", payload:{fromNodeId,toNodeId,…}, replyChannelName}`
  bzw. `…_RESPONSE {payload:{outcome,…}}` (Modul 05 § BroadcastChannel-Bridge).
- Die Karte bleibt **Nur-Lauscher**: nie auf Kanäle senden, keine Handshakes auslösen,
  `PROVIDER_MIN_MATCH`/Riegel unberührt. Kern-Module werden NICHT angefasst.
- Einstellungen: `localStorage sage_mycel_karte_settings {size,vol,colNode,colEdge,colBg}` — User-Wahl heilig.

## Akzeptanzkriterien

- [ ] Klaus-Sichttest der Karte grün (oder Befunde behoben + erneut vorgelegt)
- [ ] Sage-Page-Kachel vorhanden, öffnet eigenes Fenster, Sage-Page selbst unverändert funktionsfähig
- [ ] Live-Beweis dokumentiert: echter Mixarium↔Rezeptbuch-Verkehr sichtbar (+hörbar bei vol>0)
- [ ] PULS.md fortgeschrieben, neuer Folge-Brief geschrieben, als Codeblock im Chat ausgegeben

## Offene Punkte außerhalb dieses Briefs (nicht hier erledigen, nur kennen)

- Obsidian-Strang (separates Repo `SP-FP-md-Speicher`): Automatik-Intervalle im
  Git-Plugin evtl. noch einzustellen (Klaus-Schritt); Doppel-Ordner-Duplikat
  `…/SP-FP md Speicher/SP-FP md Speicher` klären; „Papers aktualisieren"-Ritual auf Zuruf.
- Sage-Pipeline (CLAUDE.md § Pipeline): Sichttest 17, Spec 15.B, Endknoten-Re-Migration
  5d/5e usw. laufen unabhängig weiter — nicht mit diesem Strang vermischen.

## Abschluss-Befehl (Pflicht, die Kette reißt nie ab)

Am Sitzungsende: PULS.md fortschreiben · neuen Brief nach `VORLAGE_BRIEF.md` anlegen ·
Pflichtlektüre + diesen Abschluss-Befehl im neuen Brief wiederholen · Brief vollständig
als Codeblock im Chat ausgeben · „Nächste Schritte"-Block in die Chat-Antwort.
