---
title: DB-Suffix-Register
date: 2026-09-08
tags: [sbkim, netzweit, register]
---

# DB-SUFFIXE — das netzweite Register der Schubladen

> **Wozu diese Datei.** Ein `dbSuffix` wird **einmal vergeben und nie geändert**.
> Bis zum 2026-09-08 stand nirgends, welche schon vergeben sind — wer einen neuen
> Knoten baute, musste über zwanzig Klone durchsuchen, und wer das nicht tat,
> vergab einen doppelt. Zwei Apps in einer Schublade heißt: **eine Identität für
> zwei Knoten**, und wer zuerst zugreift, gewinnt.

## Warum es überhaupt Schubladen gibt

Rund zwanzig Apps liegen unter **einer** Adresse (`lausiklauskn-png.github.io`).
IndexedDB gehört dem **Ursprung**, nicht dem Pfad. Ohne eigenen Suffix öffnen alle
den Vorgabe-Topf `sbkim` und teilen sich die Identität.

**Gesehen, nicht befürchtet:** am **2026-08-16** zeigte der Andock-Wizard von Alis
Moderaum die Bedeutungs-Beschreibung von *Muster Werbetechnik*. Aus einer falschen
Beschreibung entsteht ein falscher Vektor, und damit findet der Knoten die falschen
Nachbarn. Die Ursache steht in [`docs/LEHREN.md`](../docs/LEHREN.md) § 4 als Falle 1:
`window.SBKIM_DB_SUFFIX` muss im **`<head>`** stehen, vor jedem Modul — `init({dbSuffix})`
ist asynchron und kommt zu spät.

## Die vergebenen Suffixe

**Stand 2026-09-08, GEMESSEN über alle Klone dieser Maschine** — nicht
abgeschrieben. Wer einen Knoten andockt, trägt seinen Suffix **hier** nach.

| Suffix | Depot |
|---|---|
| `alismoderaum` | Alis-Moderaum |
| `auslieferungspruefer` | **PWA-Toolpoint** — der Prüfer, eigene Seite *(neu 2026-09-08)* |
| `blp` | Sage-Protokol (Test-/Beispiel-Wert für BookLedgerPro) |
| `bookledgerpro` | BookLedgerPro (`src/core/db.js`, eigener DB-Bau) |
| `companybrain` | Company-Brain |
| `familyprojekt` | family-project |
| `jasonstresor` | Jasons-Tresor |
| `kimbell` | Kim-Bell |
| `kimboard` | Kimboard |
| `kimhubcompany` | **kim-hub-company** *(neu 2026-09-08)* |
| `kimseek` | Kimseek |
| `meintresor` | Mein-Tresor |
| `mixarium` | Mein-Mixarium |
| `muttisrezeptbuch` | Muttis-Rezeptbuch |
| `perfectskinbeauty` | Perfect-Skin-Beauty |
| `perfectskinfashion` | Perfect-Skin-Fashion |
| `privatbrain` | Privat-Brain |
| `pwatoolpoint` | PWA-Toolpoint — der **Marktplatz** |
| `rezeptbuch` | Mein-Rezeptbuch |
| `sage` | Sage-Protokol |
| `tomyhub` | Tomys-Hub |
| `toolpoint` | **SB-KIMTool-Point** |
| `workfloh` | Mein-WorkFloh |
| `workflohpage` | Mein-Workfloh-Page |

### ⚠ Zwei Berichtigungen an der Liste, die im Brief stand

Der Brief vom 2026-09-08 nannte **16** vergebene Suffixe. Nachgemessen sind es
**22** (ohne die zwei neuen), und an einer Stelle war die Zuordnung falsch:

| | im Brief | gemessen |
|---|---|---|
| `toolpoint` | „PWA Toolpoint" | **SB·KIMTool·Point** — PWA Toolpoint heisst `pwatoolpoint` |
| fehlten ganz | — | `pwatoolpoint` · `sage` · `companybrain` · `privatbrain` · `bookledgerpro` · `blp` |

**Das ist der Grund, aus dem es diese Datei gibt.** Eine Liste aus dem Gedächtnis
ist unvollständig, und eine unvollständige Liste ist genau dann gefährlich, wenn
sie beruhigt: hätte der nächste Knoten `pwatoolpoint` gewählt, wäre er nach dem
Brief „frei" gewesen. Gemessen wird mit

```bash
grep -rhoP 'SBKIM_DB_SUFFIX\s*=\s*"\K[a-z0-9_-]+' --include=*.html --include=*.js */
grep -rhoP 'DB_SUFFIX\s*=\s*"\K[a-z0-9_-]+'       --include=*.js --include=*.html */
grep -rhoP 'dbSuffix:\s*"\K[a-z0-9_-]+'            --include=*.js --include=*.html */
```

⚠ **Drei Abfragen, nicht eine** — die Wege, auf denen ein Suffix gesetzt wird,
sind verschieden: im `<head>` der Seite, als Konstante im Klebstoff, als Feld in
einer Konfiguration. Wer nur den ersten nimmt, findet `companybrain` und
`privatbrain` nicht. Was dabei zusätzlich auftaucht (`beispielapp`, `meineapp`,
`kanon_test`, `test_v02`, `sbkim_beispiel`) sind **Bauvorlagen und Proben**, keine
Knoten — sie stehen hier nicht, aber wer sie als Suffix wählt, kollidiert mit
einer Vorlage.

## Wie geprüft wird, dass ein Suffix einmalig ist

Eine Probe kann nicht in ein fremdes Depot sehen. Die Wächter in
`kim-hub-company/tests/smoke_knoten.mjs` und `PWA-Toolpoint/tests/smoke.mjs`
tragen deshalb eine **Kopie** dieser Liste — als benannte Doppelung, nicht als
zweite Wahrheit. Wer hier einträgt, trägt dort nach; wer dort einen neuen Suffix
einführt, wird von der Probe an diese Datei erinnert.

**Was das NICHT leistet:** es verhindert keine Doppelvergabe in einem Depot ohne
solchen Wächter. Die Liste ist ein Register, kein Schloss.
