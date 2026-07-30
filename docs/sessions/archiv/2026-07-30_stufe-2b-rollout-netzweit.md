# Übergabeprotokoll — Schutz-Plan Stufe 2b netzweit ausgerollt

**Datum:** 2026-07-30 (Nacht) · **Rolle:** Bau-Sitzung (Rollout)
**Branch:** `claude/modul23-stufe2b-rollout-vpzaar` (in jedem Repo gleich)
**Auftrag:** `docs/sessions/BRIEF_MODUL23_STUFE2B_ROLLOUT.md`

## Was getan

Modul 23 (`23_rendezvous.js`, sha `3caa0bb1…`) + Modul 16 (`16_siegel.js`, sha
`4e11ef0d…`) byte-1:1 aus dem Sage-Kanon in **13 Repos** ausgerollt und gemergt
(Freibrief, alle squash):

| Repo | PR | Pfad | Test |
|---|---|---|---|
| Kimboard | #63 | `modules/` | npm test 6/6 |
| Kimseek | #50 | `modules/` | npm test 11/11 |
| BookLedgerPro | #293 | `sbkim/` | run.mjs 2153/0 |
| Mein-Tresor | #85 | `sbkim/` | npm test 53/0 |
| Jasons-Tresor | #143 | `sbkim/` | npm test 59/0 |
| family-project | #128 | `sbkim/` | nicht lauffähig (kein package.json/playwright) |
| Mein-Rezeptbuch | #354 | `sbkim/` | npm test 7/0 |
| Muttis-Rezeptbuch | #167 | `sbkim/` | keine Suite (sha256-Beweis) |
| Mein-Mixarium | #168 | `sbkim/` | 8·11·14·7 |
| Tomys-Hub | #131 | `sbkim/` | 35·38·19·15·9·16·31·11 |
| Company-Brain | #10 | `modules/` | Drift-Guard 8 byte-1:1 (kein 16) |
| Privat-Brain | #66 | `modules/` | Drift-Guard 15 byte-1:1 |
| SB-KIMTool-Point | #138 | `web/tools/` | node --test 120/120 |

**Netz-Verifikation:** 12/12 Kern-Repos tragen den Kanon auf `main`, 0 Fehler.

**sha-Pins:** Kimboard/Kimseek `test/smoke.test.js` (16+23), Company-Brain
`tools/drift-guard.mjs` (23). **Befund:** Privat-Brain `tools/drift-guard.mjs`
pinnt auch `16_siegel.js` — Brief nannte nur 23; der 16-Pin war mechanisch
zwingend mitzuziehen (sonst fällt der Drift-Guard).

## Zwei Befunde (nicht stillschweigend)

1. **SB-KIMTool-Point — über den Brief-Scope hinaus, bewusst.** Der Brief nannte
   es nur als Siegel-Aspekt-Sonderfall und warnte, `assets/sbkim-siegel.js` nicht
   blind zu ersetzen. Das ist aber nur der **Loader** (unberührt gelassen). Die
   echte Modul-Kopie liegt in `web/tools/` — `sbkim-rendezvous.js` lag auf der
   alten Gen `9f3a2085`, `sbkim-siegel.js` auf `a581461a`. **Nur** den Aspekt
   nachzutragen (der behauptet „Karten werden jetzt geprüft") ohne den Modul-Code
   hätte das Siegel **lügen** lassen → Anti-Greenwashing-Leitplanke. Als
   Forker-Vorlage (Marktplatz-Brille) gehört der Schutz genau hier zuerst hin.
   Darum beide Dateien byte-1:1. `kanon_import.test.js` (byte-1:1 gg. Kanon) jetzt
   grün.
2. **Parallel-Sitzung.** Während des Rollouts mergte eine andere Sitzung
   „Aufräum-Knöpfe" (#758/#759 in Sage; analog #NN in 10 Apps) — betraf nur
   `23_rendezvous_ui.js` (+ 0b-Test), **nicht** meine Ziel-Dateien. Die 10
   betroffenen App-Branches sauber neu von `origin/main` aufgesetzt
   (force-with-lease), das 23_ui der Parallel-Sitzung unberührt übernommen.

## Gegenprobe (Pflicht, grün)

`tests/smoke_bau23b_kartenechtheit.mjs` — 16/16:
- Probe 2/3/4: **mit** Prüfer fällt die untergeschobene / signatur-ungültige /
  werfende Karte raus (`rejected` gezählt).
- Probe 5 (**Gegenprobe**): **ohne** Prüfer läuft die App weiter, `cardsVerified`
  ehrlich `false`, Karten bleiben sichtbar (nicht still verschluckt), Bindungs-
  Prüfung wirkt trotzdem.
- Probe 6/7: Flut-Deckel (3/Absender, 210→200).

## Was offen

- **Klaus' Browser-Sichttest** (headless ersetzt ihn nicht): in einer App „👥 Wer
  ist im Raum?" öffnen — faule/fremde Karten dürfen nicht mehr erscheinen,
  ehrliche Zähler sichtbar.
- Sichttest 0b (Sicherung anlegen/einspielen → alte Kennung zurück).
- Danach-Liste aus dem Brief (Stufe 0c; Sage `sicherheit.html`; Wizard-Init-
  Heilung im Kanon-`siegel-inhalt.js`; PULS-Archivierung; Stufe 3).

## Klaus' Folge-Aufträge (mitten in der Sitzung, in Arbeit)

- Skill/Doku für den Modul-23-Rollout (Rekonstruierbarkeit) — `.claude/skills/`.
- family-project-Marktplatz prüfen: Semantische Suche + „Werde Teil des Mycels"
  für fremde Apps auf aktuellem Stand?
- „Geschenkbox": welche Tools eine fremde App mitbekommt, um nach Klaus' Prüfung
  leicht Teil des Mycels zu werden (auspacken statt suchen).

## Nächster sinnvoller Schritt

Klaus' Browser-Sichttest der Kartenechtheit in einer deployten App; parallel die
drei Folge-Aufträge (Skill → family-project-Prüfung → Geschenkbox-Konzept).
