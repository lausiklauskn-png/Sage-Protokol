# Übergabeprotokoll — 2026-07-30 (Abend): Nachzug in fünf vergessenen Apps + Netz-Prüfung

**Rolle:** Bau-Sitzung (Fortsetzung von 0b, selbe Sitzung)
**Gemergt:** BookLedgerPro #290 · #291 · Kimseek #48 · Mein-Rezeptbuch #352 ·
Muttis-Rezeptbuch #165 · Mein-Mixarium #166 · Tomys-Hub #129

---

## 1. Der Auslöser

Klaus fragte: *„prüfe bitte, ob Du jetzt alle Repos, die den Mit-dem-Netz-
verbinden-Knopf hatten, aktualisiert hast. Ob das Siegel aktuell ist."*

Die ehrliche Antwort war **nein**.

## 2. Was die Prüfung ergab

### 2.1 Fünf Apps waren beim 0a/0b-Rollout übergangen worden

Der Auftrag nannte fünf Apps (Kimboard, BookLedgerPro, Mein-Tresor,
Jasons-Tresor, family-project) — und dabei blieb es. **Fünf weitere** trugen
weiter `f117096e` statt `c78d18d0`:

Kimseek · Mein-Rezeptbuch · Muttis-Rezeptbuch · Mein-Mixarium · Tomys-Hub

Damit hatten sie **nichts** von 0a/0b: keine „Meine Kennung"-Zeile, keine
Sicherung, kein Wiederherstellen — und vor allem: sie legten beim **Seiten-Start**
weiter wortlos eine neue Kennung an (`ensureIdentity: true`, in allen fünf genau
einmal im Klebstoff).

**Behoben.** Alle fünf auf `c78d18d0`, `ensureIdentity` überall raus.
Kimseeks sha-Pin nachgezogen. Mein-Mixarium bekam zusätzlich
`ribbonText: "Mein Mixarium"` — es war die **letzte** App ohne Wappen-Gravur.

**Lehre (gehört in jede Folge-Sitzung):** ein Auftrag, der eine App-Liste nennt,
ist **keine** Erlaubnis, den Rest des Netzes stehen zu lassen. Wer eine geteilte
Datei anfasst, prüft **alle** Träger — `git ls-tree` über jedes Repo, sha
vergleichen, Tabelle zeigen. Zwei Zeilen Skript, verhindert genau diesen Fehler.

### 2.2 Der größere Befund: Stufe 2b liegt nur in Sage

**Schutz-Plan Stufe 2b** (Kartenechtheit + Flut-Deckel, gebaut und mit Gegenprobe
getestet am 2026-07-29, PR #744) ist in **keiner einzigen App**. Dort nimmt
`discover()` Visitenkarten weiterhin **ungeprüft** entgegen:

- jeder kann eine Karte mit **fremder Identität und beliebigem Namen** ins Brett
  hängen — die Prüfung greift erst beim Andocken;
- ein Fluter kann den Raum **beliebig füllen** — kein Mengen-Deckel.

Das ist genau der **Spam- und Sybil-Schutz**, nach dem Klaus in derselben
Nachricht gefragt hat. Er ist fertig — nur nicht ausgerollt.

**Drei Generationen von Modul 23 im Umlauf:**

| Generation | sha (12) | wer |
|---|---|---|
| Kanon | `3caa0bb1` | Sage `src/modules/` + `sbkim-bundle/modules/` |
| eine zurück | `9f3a2085` | Kimboard, Kimseek, BLP, family, Rezeptbuch, Muttis, Mixarium, Tomys, Company-Brain, Privat-Brain |
| **zwei zurück** | `bbdf02a8` | Mein-Tresor, Jasons-Tresor (ohne `rankCardsByQuery` / A11) |

**Modul 16 (Siegel):** Kanon `4e11ef0d`, **alle** Apps `a581461a` — es fehlt der
`ZERTIFIKAT_ASPEKTE`-Eintrag vom 2026-07-29. Reiner Anzeige-Text, aber genau dafür
ist die Liste da.

**Sonderfall SB-KIMTool-Point:** eigene Datei `assets/sbkim-siegel.js` (`5adaa5f6`),
nicht die Modul-Kopie — nicht blind ersetzen.

## 3. BookLedgerPro: Siegel vervollständigt

BLP war die einzige App mit Modul 16 **ohne** Modal-Inhalt — die Werkzeuge lagen
abseits auf `sbkim/mycelknoten.html`. Gebaut nach dem Skill `status-leiste-siegel`:

- `sbkim/siegel-inhalt.js` 1:1 aus dem Sage-Kanon, nur `WIZ` angepasst. Fünf
  Bausteine inkl. **Identitäts-Wechsler**, Semantik-Block, Schutz-Block,
  Modell-Ladebalken.
- **`ribbonText: "BookLedgerPro"`** — fehlte; das Wappen-Band war leer.
- **`sicherheit.html`** — fehlte; „Ausführlich erklärt →" wäre ein toter Link
  gewesen. Aus Kimboard übernommen, App-Name ersetzt.
- **`CORE_ASSETS`** war unvollständig: `21_spracheingabe.js` + beide
  `23_rendezvous*.js` fehlten → **offline war das ganze Netz-Panel weg**.
  Nachgetragen, `CACHE_VERSION` v213 → v215. Gegenprobe: ein Skript prüft, dass
  jede in der Liste genannte Datei wirklich existiert.

## 4. Was in derselben Sitzung davor lief (0b-Kette)

Arbeitsteilung nach Klaus' Wort: **Netz-Panel = Alltagsansicht**, **Siegel =
Werkstatt**. Das Panel bekam den Weg zur Werkstatt (fail-soft: ohne Siegel keine
Zeile), Kimboard bekam den fehlenden Identitäts-Wechsler, und das Panel hört
jetzt auf `sbkim:alive` — eine im Siegel erzeugte Kennung steht sofort da.

Test: `smoke_bau23_0b_identitaet.mjs` **42/42** mit **zwei** Gegenproben
(`SBKIM_0B_SABOTAGE=1` → 4 Proben fallen; `…_WATCH=1` → 2 Proben fallen).

## 5. Beweis dieser Runde

| Repo | Lauf | Ergebnis |
|---|---|---|
| Kimseek | `npm test` | 11/11 |
| Mein-Rezeptbuch | `npm test` | 7/0 |
| Mein-Mixarium | vier Suiten einzeln | 8 · 11 · 14 · 7 — alle grün |
| Tomys-Hub | acht Suiten einzeln | 35 · 38 · 19 · 15 · 9 · 16 · 31 · 11 |
| BookLedgerPro | `node tests/run.mjs` | 2153/0 |

**Nicht geprüft / bekannte Grenzen (ehrlich):**

- **Muttis-Rezeptbuch** hat keine Test-Suite — Beweis liegt im Kanon, die Datei
  ist eine per sha256 geprüfte byte-identische Kopie.
- **Tomys-Hub `smoke-spore-download.cjs`** fällt (Playwright-Timeout). **Vorbestehend**
  — gegengeprüft, indem die Änderung weggestasht und der Test auf blankem
  `origin/main` gelaufen ist: dort fällt er genauso.
- **family-project** `tests/smoke_all.mjs` braucht `playwright-core`, kein
  `package.json` zum Installieren.
- **Der echte Browser-Pfad** — wartet auf Klaus.

## 6. Nächster sinnvoller Schritt

1. **Stufe-2b-Rollout** — `docs/sessions/BRIEF_MODUL23_STUFE2B_ROLLOUT.md`.
   Vollständig geschrieben (alle sha-Werte, Repo-Tabelle, Test-Erwartungen,
   bekannte Grenzen), damit die nächste Sitzung ohne Rückfrage durchziehen kann.
   **Vor Stufe 3.**
2. **Klaus' Browser-Sichttest 0b** — Sicherung anlegen, später einspielen.
3. Sage fehlt `sicherheit.html`; Sages `assets/siegel-inhalt.js` ist hinter
   Mein-Tresor (Wizard-Init-Heilung vom 2026-07-19, 13 Zeilen).
4. **PULS-Archivierung** — 7573 Zeilen gegen die 3000er-Klausel, alt, eigene Sitzung.
