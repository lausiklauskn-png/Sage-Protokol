# Übergabeprotokoll — Pflege Sichttest 04.C grün (5/5)

**Datum:** 2026-05-26
**Sitzungs-Rolle:** Pflege-Sitzung Sichttest-Nachzug
**Branch:** `claude/sichttest-04c-gruen`
**Vorgänger-PR:** #177 (Bau 04.C `queryLocal` + Such-Feld-Pattern + Hub-Vorlage + drei Folge-Briefe, gemerged 2026-05-26 als `3bb500f`)

---

## Anlass

Klaus hat unmittelbar nach Merge von PR #177 den Sichttest auf seinem
Galaxy Tab S6 (DeX-Chrome, Termux-`python3 -m http.server 8000`-Setup)
durchgeführt. Alle fünf neuen Panel-04-Knöpfe live grün. Diese Pflege-
Sitzung zieht den Befund in Karte 04 + status.json + PULS nach und
schließt damit Pipeline-Schritt 5f sauber ab.

---

## Sichttest-Befunde (5/5 grün)

**Setup:** Klaus, DeX-Chrome auf Galaxy Tab S6, Termux-
`python3 -m http.server 8000`, Browser-Hard-Reload nach Code-Pull.

| Test | Eingabe-Korpus | Ergebnis | Status-Chip |
|---|---|---|---|
| 11 Happy-Path | 3 Items, Ziel-Cosinus 0.95 / 0.85 / 0.50 | `treffer_anzahl:2`, Top (0.9501, "rez-1") + Mittel (0.8627, "rez-2"), Unter-Schwelle weggefiltert | „queryLocal Happy-Path OK" |
| 12 Schwelle-Cut | 3 Items, Ziel-Cosinus 0.30 / 0.55 / 0.78 (alle < 0.80) | `treffer_anzahl:0`, KEIN Throw | „Schwelle-Cut OK (leere Liste, kein Throw)" |
| 13 Top-k-Cut | 5 Items, Ziel-Cosinus 0.95 / 0.92 / 0.88 / 0.85 / 0.82 (alle > 0.80), k=2 | genau T1 (0.9488) + T2 (0.9144), 3 verworfen | „Top-k-Cut OK (T1+T2)" |
| 14 Provider-Pfad | `setLocalCorpus(corpus)` registriert, queryLocal OHNE options.corpus | `provider_registriert:true`, „Über Provider" (0.9318) + „Auch da" (0.8643), Drunter (0.40) gefiltert | „Provider-Pfad OK" |
| 15 Leerer Korpus | leeres Array + zweiter Aufruf ohne Provider | `mit_options_corpus_leer:0`, `ohne_provider:0`, `provider_registriert:false` | „leerer Korpus OK (kein Throw)" |

Alle Score-Werte deterministisch via `mixedVec04C(ref, target, seed)`
mit LCG-Referenz-Vektor + Mock-`SbkimEmbedding.embedQuery`. Geringe
Abweichungen zur Ziel-Cosinus-Vorgabe (z.B. 0.9501 statt 0.95 exakt)
sind erwartet — Float-Rundung + Normalisierungs-Rundung im 4.
Nachkomma-Bereich.

---

## Sichttest-Setup-Befund (Klaus' Git-Stand)

**Befund:** Klaus' lokales `main` war divergiert nach Squash-Merge
von PR #177.

**Konkret:**

- HEAD lag auf altem Feature-Branch
  `claude/pflege-17-tooltips-und-heartbeat` (zu PR #174 gehörig,
  längst gemerged).
- Lokales `main` hatte zwei nicht-pushed-erscheinende Modul-17-UX-
  Pflege-Commits `19a8a66` + `3b10a9d` vom 2026-05-25, aber beide
  als gemergede PRs auf `origin/main` mit anderem SHA — typischer
  Squash-Merge-Effekt.
- `git pull origin main` schlug fehl mit „divergent branches".
- `git pull --rebase origin main` produzierte Konflikte in
  `docs/INTERFACES.md` + `docs/PULS.md` + `src/modules/17_floating_widget.js`,
  weil der lokale `claude/pflege-17-tooltips-und-heartbeat`-Branch
  Inhalte tragen wollte, die schon (verdichtet) auf main lagen.

**Lösungs-Pfad (Termux):**

```sh
git rebase --abort                             # Schritt 3: aktuelle rebase abbrechen
git checkout main && git pull origin main      # Schritt 5: Branch wechseln + Pull (zeigt divergent)
git log --oneline origin/main..main            # Schritt 6: Diagnose der 2 lokalen Commits
git reset --hard origin/main                   # Schritt 7: sicherer Reset (Inhalte schon auf origin)
python3 -m http.server 8000                    # Schritt 8: Server neu starten
```

**Klaus' Konsequenz:** nach `git reset --hard origin/main` zeigt
Panel 04 die fünfzehn statt zehn Knöpfe. Hard-Reload-Mehrfach-Versuche
vor der Diagnose haben nicht geholfen, weil das eigentliche Problem
nicht der Browser-Cache war, sondern der lokale Code-Stand.

**Lehre dokumentiert:** dieser Setup-Pfad ist generisch für jeden
Sichttest-Nachzug nach Squash-Merge. Klaus' Tablet-Workflow profitiert
von einer eindeutigen Befehls-Reihenfolge — auf eine
Pflege-Sitzung „Sichttest-Setup-Lehre in `OBSERVATORIUM_BROWSER.md`"
verzichten wir, weil der Pfad in diesem Übergabeprotokoll vollständig
liegt und Klaus die Konvention künftig im Chat von der laufenden
Bau-Sitzung wieder durchgereicht bekommt.

---

## Was diese Pflege-Sitzung getan hat

1. **Karte 04 § Bauzustand** — neue Zeile „Sichttest (Bau 04.C)"
   mit allen fünf Score-Werten + Vorgeschichte-Block + Konsequenz-
   Marker (Cross-Knoten-Such-Lücke geschlossen). Die alte Zeile
   „In Endknoten eingebaut | — | — | —" bleibt unverändert (wird
   gefüllt, wenn die externen Endknoten-Sitzungen die Module
   re-aktivieren).
2. **`status.json` Modul 04** `score:"stub"` → `"fertig"`; `siegel`-
   Text aktualisiert mit Sichttest-Befund (alle fünf Score-Werte
   wortwörtlich) + Headless-Smoke 43/43-Bilanz + Cross-Knoten-Such-
   Lücke-Geschlossen-Marker; `kurz`-Feld um „sichtgetestet 2026-05-26"
   erweitert.
3. **PULS.md** § „Als nächstes ✨" Modul-04-Zeile von 🟦 (Code-Stub)
   auf 🟩 (Fertig) gewechselt; voller Sichttest-Block mit Tabelle
   ergänzt. Neuer Sitzungs-Eintrag oben.
4. **`update_puls_pie.py`** aufgerufen → Pie regeneriert. Neue
   Bilanz: 21 Module, 🟫 8 / 🟧 0 / 🟨 0 / 🟦 8 / 🟩 5 (Fertig 4→5).
5. **Übergabeprotokoll** (diese Datei) angelegt.

---

## Was diese Pflege NICHT getan hat

- KEIN Modul-Code-Eingriff in `src/modules/`.
- KEIN Eingriff in andere Module (00/01/02/03/05/06/07/08/15/16/17/18/19).
- KEINE Endknoten-Sitzung (externe Repos unangetastet).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE INTERFACES.md-Änderung (Sichttest-Befund ist Karten-Doku,
  kein Vertrags-Eingriff — Karte 04 § 1 Modul 04 § Schnittstelle ist
  schon nach Bau 04.C aktuell).
- KEINE Tafel-Umsortierung CLAUDE.md.
- KEIN neuer Brief.

---

## Heilige Tafeln respektiert

- Modul-04-Score-Wechsel ist konvention-konform (analog Modul 05
  nach 2026-05-16-Sichttest, analog Modul 15 nach 2026-05-25-
  Sichttest).
- Sichttest-Befund kommt in **alle drei** Doku-Ankerpunkte (Karte +
  status.json + PULS), nicht nur PULS.
- Pflege-Sitzung läuft als eigener PR (nicht in den Bau-PR
  zurückgemerged) — Übersichts-Disziplin.

---

## Nächster sinnvoller Schritt

1. **Bau 16 Sub (e) Bronze/Gold-SIEGEL-Stufung** (Pipeline-Schritt 5g)
   — Sage-Protokol-interne Sitzung. Modul 16 lauscht auf
   `sbkim:handshake outcome:"established"`, schaltet
   `_meta.mycelConnected:true`, re-rendert Badge in Gold, ergänzt
   Aspekt 4 in `ZERTIFIKAT_ASPEKTE`. Spec liegt voll (Karte 16 §
   Sub e aus Tafel-Spec-Pflege 2026-05-26).
2. **Re-Aktivierung Modul 15+16+04.C in Mein-Rezeptbuch** (extern,
   Klaus' Sitzung im MR-Repo). Brief
   `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` aus PR #177 ist die Vorlage.
   Setzt PR #177-Merge voraus (erledigt) — Modul 15 Sub (b) ruft
   jetzt live `queryLocal`.
3. **Re-Aktivierung Modul 15+16+04.C in Mein-Mixarium** — analog,
   Brief `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md` liegt.
4. **SB-KIMTool-Point Hub-Initial-Commit** — extern, Klaus' Sitzung
   im neuen Repo `lausiklauskn-png/SB-KIMTool-Point`. Brief
   `BRIEF_BAU_HUB_SB_KIMTOOL_POINT_INITIAL.md` + Vorlage in
   `docs/components/_sb_kim_tool_point_template/` aus PR #177.

---

## PR-Konvention

Branch `claude/sichttest-04c-gruen`, Draft-PR folgt unmittelbar nach
Commit + Push. Klaus zieht ihn ready+merge via „PR mergen"-Zuruf.
