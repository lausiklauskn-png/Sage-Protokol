# BRIEF — „Demo → kein Demo mehr" abschließen (Verifikations-Befund 2026-07-23)

**Für die nächste Sitzung. Sage ist der Hub. Freibrief gilt (CLAUDE.md § Freibrief).**

## 0. Pflichtlektüre + Sitzungsstart
1. `CLAUDE.md` · 2. `docs/PULS.md` (oberste Einträge — mehrere parallele Stränge 07-23) ·
3. `docs/PLAN_SEMANTIK_KRYPTO.md` · 4. `status.json` · 5. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`.
Sitzungsstart: `bash .claude/hooks/refresh-origin-main.sh`; je Repo `git fetch origin && git checkout -B <branch> origin/main`.
`npm install --no-save fake-indexeddb` für Tests.

## 1. Verifikations-Befund 2026-07-23 (Klaus' Prüf-Auftrag)
**„8 % Demo" ist echt gerechnet, aber KEIN Fake:** die 8 % = zu 100 % die 10 „stub"-Module
(je 7/10 statt 10/10 = 30 P Lücke von 390). ALLE 14 Endknoten zählen voll (live). „stub" =
„gebaut + headless-grün, wartet auf Klaus' Browser-Sichttest". Protokoll-Kern ist live bewiesen
(heute 5-Knoten-Mesh). Reale Fertigstellung eher 93–100 %.
**Register:** alle 14 Knoten-Apps eingetragen, alle 14 IDs == committete Spore, kein Knoten fehlt
(die anderen ~16 Repos haben keine Spore). Adress-Wand: Family (`xMRGRZEw`) + BLP (`ZAOvf9tZ`)
laufen live mit anderer ID als committet.

## 2. Was zu tun ist, um „definitiv kein Demo mehr" abzuhaken (MUSS)
- [ ] **status.json-Module-Scores nachziehen** (headless möglich, aber Wahrheit prüfen): laut
  PLAN B1/B5 sind **20 Safe** + **25 Pseudonym** am 17.07. von Klaus im Browser grün getestet →
  gehören auf `score: "fertig"` (aktuell „stub"). Debattierbar: 01 Storage + 02 Spore laufen
  live bei jedem Andock — Score zu konservativ. **Erst prüfen (Notiz/Beleg), dann nachziehen,
  nichts schön-rechnen.** Danach `python3 scripts/update_puls_pie.py`.
- [ ] **Stale Label fixen** (`index.html` ~Z.1211): zeigt „/140", rechnet aber dynamisch „/390".
  Auf die dynamische Formel/Zahl angleichen (ehrliche Anzeige).
- [ ] **BLP als bewusste Ausnahme festschreiben** (Demo-Stub-Vektor, v0.1) — im Register-Note +
  ggf. eigener Vermerk, damit es nicht mehr als „offener Punkt" gilt.
- [ ] **Protokoll-nahe Browser-Sichttests (Klaus' Tablet, kein Bau):** Live-Ed25519-Handshake
  Kimseek/Kimboard/Private Brain (bisher nur offline gerechnet), Muttis, B3 (🔒/🔓 KI-Schlüssel),
  B7 (Pinnwand-DM). Danach die betroffenen Module/Knoten-Notizen nachziehen.
- [ ] **A18-Rest: Siegel-Modal-Sichttest** (Klaus, goldenes Badge) → A18 grün abhaken.
- [ ] **Adress-Wand (optional, Register live-genau):** Family + BLP ihre lebende Spore committen,
  dann Register-ID nachziehen. Sonst Modul 23 löst es zur Laufzeit — kein Muss.

## 3. Was bewusst liegen bleibt (KANN/später/nur bei Angriff)
Schutz-Schablonen 10/11/12/14 (reaktiv); B6/Grad C versiegelte Verschlüsselung (eigener
Protokoll-Sprung 0.1→0.2); Semantik-Ausbauten A5b/A11/A12/A15/B4 (laufen im Parallel-Strang);
Observatorium-als-eigener-Knoten; „Lehre-Fenster"-Abschneide-Schutz (`.universe-modal-card`
hat kein max-height/Scroll — gleicher Fix wie Meilenstein-Kacheln, falls gewünscht).
Klarstellung: `config.PROTOCOL_VERSION 0.1` ist ABSICHT (Wire-Version bis B6), kein Bug.

## 4. Abschluss-Pflicht
PULS fortschreiben · erledigte Punkte in PLAN abhaken · Übergabeprotokoll · neuen Brief als
Codeblock im Chat · „Nächste Schritte"-Block · Commit/Push je Aufgabe, eigene PRs selbst mergen.
