# BRIEF — Schutz-Plan Stufe 2b netzweit ausrollen (+ Siegel-Aspekt nachziehen)

**Angelegt:** 2026-07-30 (nach dem 0a/0b-Nachzug) · **Stand:** ✅ **ERLEDIGT** 2026-07-30 (Nacht)
**Umfang:** ein Durchgang, wenn machbar — Klaus' Wunsch: „alles in einem Zug".

> ## ✅ Erledigt — der Rollout ist gelaufen (2026-07-30 Nacht, Sage PR #760)
>
> Stufe 2b liegt netzweit: `23_rendezvous.js` = `3caa0bb1fbe7` und
> `16_siegel.js` = `4e11ef0d0390` in **allen 13 Repos**. Der Brief bleibt als
> **Historie** liegen; die Tabellen unten sind der **Mess-Stand von vor dem
> Rollout**, nicht der heutige — sie werden bewusst nicht rückwirkend
> umgeschrieben.
>
> **Was sich seither noch geändert hat:** `23_rendezvous_ui.js` ist inzwischen
> bei **`f2cf79c9defb`** (halbe Kennung benannt, Sage PR #759 + zehn App-PRs),
> nicht mehr bei dem unten genannten `c78d18d0771c`. Wer eine Kopie prüft,
> vergleicht gegen `f2cf79c9defb`.

---

## Start-Befehl für die neue Sitzung (kopieren)

```
Du bist eine Bau-Sitzung im SBKIM-Netz von Klaus.

Pflichtlektüre, in dieser Reihenfolge, VOR jeder Zeile Code:
1. Sage-Protokol/CLAUDE.md — § SITZUNGSSTART-PFLICHT und § Freibrief
2. Sage-Protokol/docs/PULS.md — der oberste Eintrag (2026-07-30)
3. Sage-Protokol/docs/sessions/BRIEF_MODUL23_STUFE2B_ROLLOUT.md  ← dein Auftrag
4. Sage-Protokol/docs/components/23_rendezvous.md — § Echtheit der Karten

Deine Aufgabe: den Schutz-Plan-Stand aus dem Sage-Kanon in ALLE Apps
bringen. Modul 23 (Kartenechtheit + Flut-Deckel, Stufe 2b) liegt seit
2026-07-29 NUR in Sage — keine einzige App hat es. Ebenso fehlt allen Apps
der Siegel-Aspekt vom selben Tag.

Zwei Dateien, byte-1:1 aus dem Kanon, in zwölf Repos:
  src/modules/23_rendezvous.js  sha 3caa0bb1fbe7bf5293c90b6a59a74cccf8600bff45095a892b1f048244c61fcf
  src/modules/16_siegel.js      sha 4e11ef0d0390d155accf64cb4f71c473f77fd46b91ca10a1bc167ba3d3bbec53

ACHTUNG, drei Generationen im Umlauf (Tabelle im Brief). Mein-Tresor und
Jasons-Tresor sind ZWEI Generationen zurück — ihre Kopie hat rankCardsByQuery
(A11) noch nicht. Beim Ersetzen also NICHT erschrecken, dass der Diff dort
größer ist; das ist erwartet und in Ordnung, weil der Kanon ein Obermenge ist.
Trotzdem: vor dem Ersetzen je Repo prüfen, ob die Kopie eine repo-eigene
Zeile trägt (git diff gegen den Kanon lesen, nicht blind kopieren).

sha-Pins danach nachziehen:
  Kimboard  test/smoke.test.js   (16_siegel.js + 23_rendezvous.js)
  Kimseek   test/smoke.test.js   (16_siegel.js + 23_rendezvous.js)
  Company-Brain / Privat-Brain  tools/drift-guard.mjs  (23_rendezvous.js)

Je Repo zuerst `git fetch origin main`, dann von origin/main abzweigen.
Branch überall gleich: claude/modul23-stufe2b-rollout

Freibrief gilt (CLAUDE.md § Freibrief): selbst mergen, wenn getestet und
abgegrenzt. Jeden Test mit GEGENPROBE führen — Standard dieser Reihe.
```

---

## Warum das dringend ist

Klaus fragte am 2026-07-30 nach **Spam- und Sybil-Schutz**. Die Prüfung ergab:
**Stufe 2b existiert nur in Sage.** In jeder echten App nimmt `discover()`
Visitenkarten weiterhin **ungeprüft** entgegen:

- Jeder kann eine Karte mit **beliebigem Namen und fremder Identität** ins Brett
  hängen — die Prüfung greift erst beim Andocken.
- Ein Fluter kann den Raum **beliebig füllen** — es gibt keinen Mengen-Deckel.

Der Kanon hat beides seit 2026-07-29 (PR #744, mit Gegenprobe getestet). Es fehlt
nur der Rollout. **Das ist der eigentliche Spam-/Sybil-Schutz, nach dem Klaus
gefragt hat** — nicht die Backlog-Module 10/11/12.

## Der Stand (gemessen 2026-07-30, nach dem 0a/0b-Nachzug)

**KANON (Sage `src/modules/`, gespiegelt in `sbkim-bundle/modules/`):**

| Datei | sha256 (12) |
|---|---|
| `23_rendezvous.js` | `3caa0bb1fbe7` |
| `23_rendezvous_ui.js` | `c78d18d0771c` |
| `16_siegel.js` | `4e11ef0d0390` |

**Die Apps:**

| Repo | Pfad | 23_rendezvous | 23_ui | 16_siegel |
|---|---|---|---|---|
| Kimboard | `modules/` | `9f3a2085` ❌ | `c78d18d0` ✅ | `a581461a` ❌ |
| Kimseek | `modules/` | `9f3a2085` ❌ | `c78d18d0` ✅ | `a581461a` ❌ |
| BookLedgerPro | `sbkim/` | `9f3a2085` ❌ | `c78d18d0` ✅ | `a581461a` ❌ |
| Mein-Tresor | `sbkim/` | **`bbdf02a8` ❌❌** | `c78d18d0` ✅ | `a581461a` ❌ |
| Jasons-Tresor | `sbkim/` | **`bbdf02a8` ❌❌** | `c78d18d0` ✅ | `a581461a` ❌ |
| family-project | `sbkim/` | `9f3a2085` ❌ | `c78d18d0` ✅ | `a581461a` ❌ |
| Mein-Rezeptbuch | `sbkim/` | `9f3a2085` ❌ | `c78d18d0` ✅ | `a581461a` ❌ |
| Muttis-Rezeptbuch | `sbkim/` | `9f3a2085` ❌ | `c78d18d0` ✅ | `a581461a` ❌ |
| Mein-Mixarium | `sbkim/` | `9f3a2085` ❌ | `c78d18d0` ✅ | `a581461a` ❌ |
| Tomys-Hub | `sbkim/` | `9f3a2085` ❌ | `c78d18d0` ✅ | `a581461a` ❌ |
| Company-Brain | `modules/` | `9f3a2085` ❌ | — | — |
| Privat-Brain | `modules/` | `9f3a2085` ❌ | — | `a581461a` ❌ |

**Drei Generationen.** `bbdf02a8` (die zwei Tresore) ist **zwei** Generationen
zurück: ihm fehlt zusätzlich `rankCardsByQuery` (A11, Karten nach Frage-Passung
ranken). Der Kanon enthält beides — der größere Diff dort ist erwartet.

**Sonderfall SB-KIMTool-Point:** trägt eine eigene Datei `assets/sbkim-siegel.js`
(sha `5adaa5f6`), **nicht** die Modul-Kopie. Nicht blind ersetzen — erst lesen,
dann entscheiden, ob der Aspekt dort von Hand nachgetragen wird.

## Was zu tun ist

### 1. Modul 23 in alle zwölf Repos (Kern-Auftrag)

Byte-1:1 aus `Sage-Protokol/src/modules/23_rendezvous.js`. Bringt:

- **Bindungs-Prüfung** `card.spore.id === card.nodeId` — eine Karte kann keine
  fremde Spore unter eigenem Namen tragen. Braucht keine Krypto, wirkt **immer**.
- **Ed25519-Prüfung je Karte** über Modul 02 `verifyForeignSpore` (eigener
  Resolver — eine App darf ein Spore-Modul ohne Prüfer mitbringen).
- **Mengen-Deckel** `RDV_CARDS_MAX = 200` je Durchlauf, `RDV_CARDS_PER_SENDER_MAX = 3`
  Identitäten je Nostr-Absender. Still verwerfen — der Fluter erfährt nichts.
- **Ehrlich statt still:** fehlt der Prüfer, läuft der Raum weiter, meldet aber
  `cardsVerified: false` (UNGEPRÜFT); `rejected` zählt die Aussortierten.

**Vor dem Ersetzen je Repo:** `git diff` der vorhandenen Kopie gegen den Kanon
lesen. Erwartet sind nur die Kanon-Zuwächse. Findet sich eine **repo-eigene**
Zeile, NICHT überschreiben — stattdessen im Chat melden und Klaus fragen.

### 2. Modul 16 (Siegel) in alle Repos, die es tragen

Byte-1:1 aus `Sage-Protokol/src/modules/16_siegel.js`. Einziger Unterschied zum
App-Stand: der `ZERTIFIKAT_ASPEKTE`-Eintrag vom 2026-07-29 („Echtheit der Karten
im gemeinsamen Raum"). Reiner Anzeige-Text im Siegel-Modal — aber genau dafür ist
die Aspekte-Liste da: Sicherheits-Updates sichtbar machen, **ohne** dass Forker
neu andocken müssen (CLAUDE.md § Sicherheits-Module pflegen Aspekte).

### 3. sha-Pins nachziehen

| Repo | Datei | Schlüssel |
|---|---|---|
| Kimboard | `test/smoke.test.js` | `16_siegel.js`, `23_rendezvous.js` |
| Kimseek | `test/smoke.test.js` | `16_siegel.js`, `23_rendezvous.js` |
| Company-Brain | `tools/drift-guard.mjs` | `modules/23_rendezvous.js` |
| Privat-Brain | `tools/drift-guard.mjs` | `modules/23_rendezvous.js` |

### 4. Testen (je Repo, ehrlich berichten)

| Repo | Befehl | erwartet |
|---|---|---|
| Sage-Protokol | `node tests/smoke_bau23_rendezvous.mjs` · `..._ui.mjs` · `smoke_bau23b_kartenechtheit.mjs` · `smoke_bau23_0b_identitaet.mjs` · `smoke_bundle_connect.mjs` | 59 · 87 · 16 · 42 · 21 |
| Kimboard | `npm test` | 6/6 |
| Kimseek | `npm test` | 11/11 |
| BookLedgerPro | `node tests/run.mjs` | 2153/0 |
| Mein-Tresor | `npm test` | 53/0 |
| Jasons-Tresor | `npm test` | 59/0 |
| Mein-Rezeptbuch | `npm test` | 7/0 |
| Mein-Mixarium | `node tests/*.mjs` einzeln | 8 · 11 · 14 · 7 |
| Tomys-Hub | `node tests/*.cjs` einzeln | 35 · 38 · 19 · 15 · 9 · 16 · 31 · 11 |
| Company-/Privat-Brain | `npm test` | Drift-Guard grün |
| Muttis-Rezeptbuch, family-project | — | siehe „bekannte Grenzen" |

### 5. Gegenprobe (Pflicht)

`Sage-Protokol/tests/smoke_bau23b_kartenechtheit.mjs` **hat** schon eine
eingebaute Gegenprobe (Probe 5: dieselbe faule Karte bleibt sichtbar, sobald der
Prüfer fehlt). Nach dem Rollout **einmal** laufen lassen und das Ergebnis
berichten. Wird eine neue Probe ergänzt, gilt derselbe Standard: **ohne den Fix
muss sie fallen.**

## Bekannte Grenzen — nicht erschrecken, nicht „reparieren"

- **Muttis-Rezeptbuch** hat **keine** Test-Suite. Der Beweis liegt im Kanon; die
  Datei ist eine per sha256 geprüfte byte-identische Kopie. So berichten.
- **family-project**: `tests/smoke_all.mjs` braucht `playwright-core`, und es gibt
  **kein `package.json`** zum Installieren. In dieser Umgebung nicht lauffähig.
  Nicht versuchen zu reparieren — nur ehrlich vermerken.
- **Tomys-Hub**: `tests/smoke-spore-download.cjs` fällt mit Playwright-Timeout —
  **vorbestehend**, gegengeprüft auf blankem `origin/main` am 2026-07-30. Nicht
  durch den Rollout verursacht. Nicht in diesem Auftrag reparieren.
- **`docs/PULS.md` hat 7573 Zeilen** gegen die 3000er-Schutz-Klausel im Datei-Kopf.
  Der Überlauf ist alt. **Nicht** kürzen — Auslagern ist eine eigene Sitzung
  (siehe „Danach").

## TABU (unverändert)

- `PROVIDER_MIN_MATCH` / der **0.80-Andock-Riegel** — nicht anfassen.
- `DB_VERSION`, `PROTOCOL_VERSION` — kein Bump.
- Kern-Module **01/02/05/05b** — unangetastet.
- Kein PII, kein privater Schlüssel ins Repo.

## Akzeptanzkriterien

| Punkt | Nachweis |
|---|---|
| Modul 23 | alle zwölf Repos tragen `3caa0bb1…` |
| Modul 16 | alle tragenden Repos `4e11ef0d…` |
| Pins | Kimboard/Kimseek/Company-/Privat-Brain grün |
| Echtheit | `smoke_bau23b_kartenechtheit.mjs` grün, Gegenprobe berichtet |
| Regress | jede App-Suite grün (Ausnahmen oben ehrlich benannt) |
| immer | **Klaus' Browser-Sichttest** — headless ersetzt ihn nicht |

## Danach (in dieser Reihenfolge, wenn Zeit bleibt — sonst neuer Brief)

1. **Klaus' Sichttest 0b** steht noch aus: alle offenen Fenster neu laden, dann in
   EINER App **💾 Sicherung anlegen**, später **📥 einspielen** → die **alte**
   Kennung muss zurück sein.
2. **Stufe 0c** — Brief liegt: `BRIEF_STUFE0C_SICHERUNG_ANBIETEN.md`. Die Sicherung
   im **Moment ihrer Entstehung** anbieten; einen Kennungs-**Wechsel** erkennen und
   melden.
3. **Sage hat kein `sicherheit.html`**, lädt aber `assets/siegel-inhalt.js` — der
   Knopf „Ausführlich erklärt →" im Schutz-Block läuft ins Leere. Eine der
   Schwester-Dateien übernehmen (Kimboard/Mein-Tresor/family) und den Namen
   ersetzen, wie es BLP am 2026-07-30 bekommen hat.
4. **Sage `assets/siegel-inhalt.js` ist hinter Mein-Tresor:** dort fehlt die
   „Wizard-Init-Heilung" (Klaus-Befund 2026-07-19 „Backup-Knopf löst nichts aus" —
   bei vorhandener Identität Schritt 2+3 sofort freischalten). 13 Zeilen, in
   Mein-Tresor bewährt. Kanon nachziehen, dann in die Apps.
5. **PULS-Archivierung** — eigene Pflege-Sitzung, auslagern statt kürzen.
6. **Schutz-Plan Stufe 3 „Bekannte bevorzugen"** — erst wenn 1–2 stehen.

## Pflicht am Abschluss

1. `docs/PULS.md` fortschreiben. 2. Übergabeprotokoll in `docs/sessions/archiv/`.
3. Neuen Brief + **vollständig als Codeblock im Chat**. 4. „Nächste Schritte" im Chat.
5. `sbkim/SIGNAL.json` seq +1 (aktuell **52**).
