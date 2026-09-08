# Übergabeprotokoll · 2026-09-08 (abends) — Der geteilte Vorrat: Reparatur

**Rolle:** Bau-Sitzung, netzweit. Anschluss an die Mess-Sitzung vom Vormittag
(`2026-09-08_geteilter-vorrat.md`). Klaus' Auflage über allem: *„allerhöchste
Vorsicht, keine App darf gelöscht werden. Alles muss weiter funktionieren."*

## Auftrag

Den Befund reparieren: Service-Worker (`activate`, Sorte A) und ⟳-Knöpfe
(Sorte B) dürfen nur den **eigenen** Vorrat löschen und nur den **eigenen**
Worker abmelden. Dazu Klaus' Zusatzaufträge: Kimhub ⟷ kim-hub-company prüfen
(Daten, Auslieferung, Impressum) und die Pflichtangaben aller
Toolpoint-Einträge.

## Was getan wurde

1. **Sorte A** in allen Depots des geteilten Ursprungs: Präfix-Filter
   (`k.startsWith(VORRAT_PRAEFIX) && k !== CACHE`), Präfix aus der
   Vorrats-Konstante abgelesen. Je Depot ein PR, je Depot die eigene Suite,
   jede Stelle mit `tests/vorrat_wirkung.mjs` in beide Richtungen gemessen.
   Rezeptbücher auf Klaus' Wort getrennt (`meinrezeptbuch-` / `muttisrezeptbuch-`).
2. **Sorte B** an 17 Seiten-Stellen in 15 Depots: `getRegistration()` statt
   `getRegistrations()`, Präfix-Filter für `caches`; Modell-Ausputzer positiv
   (`/webllm|mlc/i`). Rezeptbücher über QC + `build.py`, Mixarium QC → index,
   Tresore in den Spiegel `jasons-bibliothek/`.
3. **Modul 22** im Kanon: `window.SBKIM_VORRAT_PRAEFIX` (Wirt setzt), ohne Marke
   löscht es nichts. Sechs Kopien per Skill `netzweiter-modul-rollout`,
   Drift-Pins in Kimseek und SB-KIMTool nachgezogen. Wirte setzen die Marke.
4. **Pflichtangaben** auf sieben Seiten (Impressum, Datenschutz, Fußzeile,
   Offline-Vorrat, Cache-Bump); kim-hub-company über Kimhubs Ableiter.
5. **Scanner** (`tools/vorrat-scan.mjs`): Pages-Belege aus
   `docs/daten/auslieferung.json` (34 Depots, GitHub-API), zwei benannte
   Ausnahmen, Korrektur der falsch behaupteten Grenze — und abends die
   Einstufung: Konstanten auflösen, `includes`, Regex, Wirt-Marke, „unklar",
   eigener Ursprung getrennt. Probe `tests/smoke_vorrat_scan.mjs`.
6. **Abends dazu:** `Kimhub/company-sw.js`, `Muttis-Rezeptbuch/sw.js`,
   `New-Perfect-Skin-Beauty-/script.js`, Sages `mycel-karte/index.html`.

## Ergebnis (Abschluss-Scan gegen `origin/main`, `docs/BEFUND_geteilter-vorrat_nachher.md`)

- Geteilter/ungeprüfter Ursprung: **63 Stellen richtig gefiltert**, 2 gewollt.
- Offen: **`ansicht.js:4232`** in Kimhub und kim-hub-company (byte-gepinnt,
  Parallel-Sitzung arbeitet in der Datei) — Sages `mycel-karte/index.html:320`
  liegt in diesem PR und ist nach dem Merge zu.
- Eigener Ursprung (CNAME), kein Geschwister, unverändert: PWA-Toolpoint
  (`sw.js`, `assets/thema.js`), Perfect-Skin-Beauty (`script.js`).
- Ursprung: 3 eigen · 28 geteilt (Pages-Lauf belegt) · 2 ungeprüft.

## Was NICHT gemessen wurde

- Ob die Apps **am Tablet** nach dem Update normal starten und offline laufen —
  Klaus' Sichttest. Bei den Rezeptbüchern: einmal online öffnen.
- Ob Kimhubs Pages-Seite ohne Anmeldung lesbar ist (Egress sperrt `github.io`).
- Die zwei Tabs, die einander die Stechuhr überschreiben — Risiko benannt,
  nicht nachgestellt.

## Fehler dieser Sitzung, mit Korrektur

- „Stechuhr getrennt" — falsch, nur IndexedDB gemessen; localStorage ist
  geteilt. Korrigiert, alter Wortlaut steht daneben.
- Drei ROT-Messungen in `vorrat_wirkung.mjs` waren Nicht-Messungen
  (`js:fn()` auf nicht-globale Funktionen); auf echte Klicks umgestellt.
- Der Scanner meldete nach der Reparatur 44 Fehlurteile — ein Messwerkzeug
  ohne eigene Probe kann sich nicht selbst melden. Jetzt hat es eine.
- Pinnwand-Gegenprobe erst inert (sed-Trenner) — mit Änderungs-Nachweis wiederholt.
- Kimhub #149 Konflikt (v35→v38), khc-Push auf gemergter Historie, Scan-
  Syntaxfehler, zwei vergessene `cd` — alle behoben, keine still.

## Vorbestehend rot, per Gegenprobe belegt (nicht durch diese Sitzung)

SB-KIMTool `kanon_import`, `spore_v02` · Tomys `smoke-spore-download`,
`smoke-verbund` · mycel-karte `browser_knotenkarte`.

## Nächster sinnvoller Schritt

Nach dem Merge der Parallel-Sitzung in Kimhub: `ansicht.js:4232` reparieren
(ein Fix, Kimhub → Company kopieren, Drift-Pin). Dann Klaus' Entscheidungen zu
Mein-Workfloh-Page und Kimhubs Impressum; Toolpoint-Wächter „Impressum
erreichbar".
