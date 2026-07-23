# Übergabeprotokoll 2026-07-23 — RELATEDNESS_CENTER v2 (Klaus' Entscheid „V2 bauen")

## Rolle
Hauptsitzung. Auftrag: Brief `BRIEF_RELATEDNESS_CENTER_V2_…` Punkt 2.1 (Richtungsentscheid).

## Was getan
- **Befund gemessen + Klaus vorgelegt (bevor gebaut):** v1-`RELATEDNESS_CENTER` (7 Vor-v0.2-
  Vektoren) mis-rankt nach der v0.2-Re-Sign-Welle — unverwandt Point↔Sage 0.46 > echte Schwestern
  Mixarium↔Rezeptbuch 0.38. Auch ein v2 aus den 14 Live-v0.2-Vektoren stellt **keine volle**
  Schwelle her (Nachbar-Domänen bleiben im Band der Hub↔Werkzeug-Überlappung) — deckungsgleich
  mit dem 2026-06-28-Befund. Klaus entschied **„V2 bauen"**.
- **Gebaut (PR #706, gemergt):** `RELATEDNESS_CENTER` neu aus den 14 Live-`domainVector`
  (9 lokale sbkim-Inbox/Spore + 5 frisch von raw/main: family-project, kim-bell, kimseek,
  kimboard, privat-brain; alle nodeIds == Register) gemittelt, L2-normiert. `RELATEDNESS_MIN 0.30`
  unverändert (Lücke 0.19..0.78). Byte-1:1 in `such-tool/`+`sbkim-bundle/`.
- **Ehrliche Grenze festgeschrieben:** `isRelated==true` = „klar dieselbe Domäne", NICHT „fach-
  verwandt"; echtes Fach-Urteil bleibt der opt-in KI-Richter (`hybridMatch`).
- **Tafel-Evolution nicht stillschweigend:** 2026-06-28-Beschluss „v1 bleibt, v2 verworfen" in
  `docs/LEHRE-…` als neuer Stand 2026-07-23 + „⚠️ ÜBERHOLT"-Marke überschrieben.
- **Tests:** `smoke_bau04e` zurück auf echte Trennungs-Prüfung (27/27); `smoke_bau22e`+`smoke_bau23`
  auf enge Schwester Rezeptbuch↔Muttis umgestellt. **Suite 61/61 grün.** Drift-Guards grün.

## Tabu gewahrt
`PROVIDER_MIN_MATCH = 0.80` + PROTOCOL_VERSION unberührt (0.80-Riegel = roher Cosinus, v2 gatet
nichts). Kein SIGNAL/Re-Andock (reine, additive Konstante).

## Stand / offen
- **Browser-Sichttest der „verwandt"-Anzeige** wartet auf Klaus (deployt nach Merge, auf `main`).
- **BLP v0.2** (Brief 2.2) — BookLedgerPro einziger Knoten noch protocolVersion 0.1; Live-Re-Sign
  in Klaus' Browser, danach Register nachziehen. **Klaus-Browser-Schritt.**
- **S5-Härtungs-Sims** (2.3) — headless, ohne Klaus.
- **A18** (Siegel-Andock-Wizard netzweit), **A11** (Such→Frage→Andocken) — unberührt.

## Nächster sinnvoller Schritt
S5-Härtungs-Sims (headless) oder A18-Rollout; BLP v0.2 wann immer Klaus mag.
