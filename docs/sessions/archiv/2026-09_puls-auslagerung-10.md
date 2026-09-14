# PULS-Auslagerung 2026-09-14 (Nacht) — „Modul 23 UI spricht Englisch"

**Ausgelagert am 2026-09-14**, weil `docs/PULS.md` mit dem Eintrag zum
automatischen Rollout auf 3.068 Zeilen kam. Die Schutz-Klausel im Kopf von
PULS.md verlangt **auslagern statt kürzen**: hier steht der Eintrag
**wortwörtlich**, nichts gekürzt, nichts zusammengefasst.

---

## Stand 2026-09-14 (Haupt-Sitzung, Abend) · ✅ MODUL 23 UI SPRICHT ENGLISCH — 195 TEXTE

**Rolle:** Haupt-Sitzung, Bau. PR #986 gemergt (`8de9cf5`). Anlass war Klaus'
Befund am Tablet: die Seite stand auf Englisch, die SBKIM-Fenster darin blieben
deutsch. Umfang auf seine ausdrückliche Wahl **„gestuft: erst Sage, dann
netzweit"**.

**Was gebaut wurde.** Ein schlüsselloser Sprach-Haken in
`src/modules/23_rendezvous_ui.js` — **der deutsche Satz IST der Schlüssel**,
`TEXTE.en` trägt die Übersetzungen, `T(de)` fällt bei fehlendem Eintrag auf
Deutsch zurück. `sprache()` nimmt zuerst `cfg.lang` (was die App über
`init({lang})` sagt), sonst `<html lang>`, sonst Deutsch. `_meta` nennt `lang`
und `langKeys`. Die beiden byte-gepinnten Bauvorlagen (`sbkim-bundle/`,
`sbkim-bundle-voll/`) wurden in derselben Bewegung nachgezogen — ohne das wären
`smoke_bauvorlagen` und `smoke_bundle_connect` zu Recht rot geworden.

**Gemessen.**

| | |
|---|---|
| `tests/smoke_bau23_sprache.mjs` (neu) | **16 bestanden, 0 fehlgeschlagen** |
| `node tests/run_alle.mjs` | **101 Proben — 101 grün, 0 rot, 0 nicht lauffähig** |
| `tests/gegenprobe_bau23_sprache.sh` (neu, 7 Fälle) | **7 gefangen · 0 durchgerutscht · 0 tote Anker** |
| Aufrufstellen · Schlüssel | 210 `T("…")` · **195** eindeutig, alle übersetzt |

Der Rückgabewert stammt jeweils aus der Prüfung selbst, nicht aus einer Pipe.
Die Gegenprobe läuft je Fall an einer **Wegwerf-Kopie** (`mktemp -d`); ein
abgebrochener Lauf hinterlässt damit kein sabotiertes Modul im Depot.
`git status` war vor und nach dem Lauf unverändert.

**⚠ Der Preis des schlüssellosen Verfahrens ist benannt:** wer einen deutschen
Satz ändert, verliert still seine Übersetzung. Dagegen steht der Wächter, der
**in beide Richtungen** misst — jeder Schlüssel muss als `T("…")` im Code
vorkommen und jedes `T("…")` einen Schlüssel haben.

**⚠ Drei eigene Fehler, alle von der Gegenprobe entlarvt.**

1. **Zwei Fälle fingen aus dem falschen Grund.** „Ein `T()`-Aufruf ohne
   englische Fassung" **änderte** einen bestehenden Aufruf und tötete damit
   zugleich dessen Schlüssel — der Nachbar-Wächter feuerte zuerst, der gemeinte
   blieb ungemessen. Jetzt wird hinzugefügt statt geändert. Der zweite nahm
   einen Text, den auch der Laufzeit-Teil prüft.
2. **Ein Wächter war zu eng.** „Keine Übersetzung ist nur eine Kopie" verlangte
   Umlaute oder eines von sechs Stoppwörtern; „Ziehen zum Verschieben" hat
   beides nicht und rutschte durch. **Gemessen statt geraten:** von 195 Paaren
   ist genau **eines** legitim wortgleich — das Auslassungszeichen. Neue
   Bedingung: wortgleich **und** enthält einen Buchstaben (`/\p{L}/u`).
3. **Ein Wächter fand seinen Fund im eigenen Erklär-Kommentar** (Zeichenfenster
   statt Block). Gemessen wird jetzt der Block, Kommentare abgezogen.

**Was offen ist.**

- **Das Ausrollen in die 16 Apps** — Klaus' zweite Stufe, eigene Sitzung. Im
  Netz stehen **drei Modul-Generationen** (2249 · 2279 · 2424 Zeilen); nur
  PWA-Toolpoint und kim-hub-company entsprechen Sage. **Ein Drift-Guard sagt
  „unverändert", nicht „aktuell".** Skill: `netzweiter-modul-rollout`.
- **`16_siegel.js` (47 Texte)** und **`17_floating_widget.js` (19 Texte)**
  bleiben deutsch — das Siegel-Fenster und die LEBT/VERKEHR/FREMD/SIEGEL-Lampen.
- **Klaus' Browser-Sichttest steht aus.** Dass die englischen Texte im Fenster
  wirklich so stehen, sieht nur ein Browser.

**Nächster sinnvoller Schritt:** das Ausrollen in die 16 Apps, nach Klaus'
Sichttest an einer Seite.
