# Übergabeprotokoll — 2026-08-16 · Modul 05b wird Siegel-Pflicht

**Auftrag (Klaus, wörtlich):** *„ja, 05b ins Siegel aufnehmen"*.

**Rezept:** `.claude/skills/netzweiter-modul-rollout` (Schritte 0–11).

---

## Der Widerspruch, um den es ging

Am selben Tag meldete das Netz-Fenster von Alis Moderaum auf Klaus' Tablet

> ✗ Raum-Lesen fehlgeschlagen: Kein Nostr-Relais-Client (Modul 05b) verfügbar

**und das Siegel leuchtete trotzdem.** Modul 16 prüfte sieben Module; der
gemeinsame Raum war keines davon.

Das ist kein Codefehler, sondern eine Lücke in einer Liste — und darin liegt der
Ärger: ein Siegel, das goldenes Vertrauen zeigt, während der Knoten den Raum gar
nicht lesen kann, sagt die Unwahrheit. Die Anti-Greenwashing-Klausel (Karte 16)
war nicht zu schwach, sie zielte nur nicht dorthin.

## Die Warnung, die nicht trug

Diese Sitzung hatte Klaus zuvor gewarnt, eine Aufnahme von 05b lasse dort, wo
das Modul fehlt, das Siegel **erlöschen**. Klaus hat nachgefragt: *„Wenn ich
null fünf einbaue, wird das Siegel erlöschen. Wie soll denn das gehen?"*

Nachgemessen über **alle 22 Knoten-Repos**: jeder lädt 05b. Die Warnung war eine
Vermutung mit dem Tonfall einer Messung. Sie steht als solche in
`docs/PFLICHT_MODULE.md`, damit die nächste Sitzung sieht, wie sie zustande kam.

## Was gebaut wurde

| | |
|---|---|
| Kanon | `src/modules/16_siegel.js`, `PFLICHT_MODULE` acht statt sieben Einträge |
| Fläche | `subscribe`, **nicht** `publish` — daran hängt das Lesen; wer nur senden kann, nimmt nicht teil |
| Kanon-sha | `3e17f6474fc7` |
| Aspekt | `ZERTIFIKAT_ASPEKTE` (Ehrlichkeits-Kopplung: Code und Aspekt zusammen, nie einzeln) |
| Vertrag | `INTERFACES.md` §1 Modul 16 **zuerst**, dann Karte 16 |
| Regeln | `CLAUDE.md`, `docs/PFLICHT_MODULE.md`, `docs/MYCEL-GESCHENKBOX.md` |
| Bauvorlage | `sbkim-bundle-voll/`, `tests/smoke_bauvorlagen.mjs` (acht Pflicht-Module) |
| Rollout | **21/21 Kopien** gegen `origin/main` geprüft, 0 abweichend |
| Pins | 13 sha-Pins in Drift-Guards und Test-Smokes nachgezogen |
| Offline-Vorrat | in **10** Repos `CACHE_VERSION` erhöht |

### Der neue Wächter

`tests/smoke_bau16_pflicht_05b.mjs` — neun Prüfungen. Die zweite Hälfte ist der
Punkt: sie baut die Umgebung **ohne** Relais-Client und verlangt, dass das
Siegel dann ausbleibt. Ohne sie liefe die Probe genauso grün, wenn 05b gar nicht
in der Liste stünde.

Gegengeprobt an beiden echten Fehlern — beide werfen sie um:

| eingebauter Fehler | Ergebnis |
|---|---|
| Feldnamen `moduleId`/`title` statt `module`/`aspect` | ✗ ROT (2 Prüfungen) |
| 05b wieder aus `PFLICHT_MODULE` gelöscht | ✗ ROT (2 Prüfungen) |

### Der Fehler dieser Sitzung, den er gefangen hat

Der neue Aspekt trug **zuerst** die Feldnamen `moduleId`/`title`. Das ist
gültiges JavaScript, `node --check` war zufrieden — und das Modal liest
`a.module`/`a.aspect`: der Eintrag wäre **leer** erschienen. Eine
Sicherheits-Änderung, die sich selbst dokumentiert, mit unsichtbarer
Dokumentation.

Gefunden hat das nicht eine Probe, sondern **Schritt 2 des Rezepts** (Diff je
Generation gegen den Kanon lesen). Genau dafür steht der Schritt dort.

## Was nachweislich NICHT angefasst wurde

- `SB-KIMTool-Point/assets/sbkim-siegel.js` — **Loader**, 754 Zeilen, keine
  `ZERTIFIKAT_ASPEKTE`. Er lädt die `web/tools/`-Module nach.
- `SB-KIMTool-Point/sandbox/16_siegel.js` — Points **eigenes Modell** („Tun
  statt Sein", 67 Zeilen, englisch). Kein Kanon-Abkömmling.

Das ist Schritt 5 des Rezepts („Loader ≠ Modul"), und er hat sich bezahlt
gemacht: beide Dateien heißen fast wie die Modul-Kopie.

## Proben — ehrlich, auch die roten

- Sage: `node tests/run_alle.mjs` → **74 grün, 0 rot, 0 nicht lauffähig**.
- Gegenprobe Bauvorlagen: **7 von 7** Fehlern bemerkt.
- 15 Träger-Repos mit `npm test`: exit 0.
- **Privat-Brain** rot: `playwright-core` fehlt (`tools/e2e-test.mjs`). Der
  Drift-Guard selbst ist grün (15 byte-identisch). Auf blankem `origin/main` in
  einem eigenen Arbeitsbaum **dieselbe** Meldung → vorbestehend.
- **SB-KIMTool-Point** rot: 119 pass / 2 fail (`kanon_import`, `spore_v02`),
  beide wegen fehlendem `fake-indexeddb`. Auf blankem `origin/main` **dieselben
  zwei Dateien, dieselben Zahlen** → vorbestehend. `kopien_drift.test.js` allein
  → 3 pass, 0 fail.

## Nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest** an einem der Knoten (Hard-Reload, weil zehn
   Service-Worker eine neue Version tragen). Headless beweist die Logik, nicht
   das Abzeichen — und genau dieses Abzeichen war das Problem.
2. **Andock-Lauf der vier neuen Knoten** (Alis-Moderaum, Perfect-Skin-Fashion,
   Perfect-Skin-Beauty, Mein-Workfloh-Page) — erst danach lassen sich
   `status.json` und die Mycel-Karte ehrlich fortschreiben.
3. **Modul 15 steht netzweit in fünf Generationen** (offen seit seq 63, nicht
   von dieser Sitzung verursacht). Eigener Rollout nach demselben Rezept.
