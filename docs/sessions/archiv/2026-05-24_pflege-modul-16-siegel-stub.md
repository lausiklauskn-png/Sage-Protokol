# 2026-05-24 · Mini-Pflege — Modul 16 SBKIM-Siegel Stub angelegt

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-modul-16-siegel-stub`. Anschluss nach PR #146
(Sichttest-Nachzug Karte 15 grün, alle drei vorherigen Karte-15-PRs
auf `main`).

## Anlass

Klaus' strategische Planung zur App-Freigabe. Vor öffentlicher
Verteilung der PWAs (Mein-Mixarium, Mein-Rezeptbuch, Sage-Protokol +
ggf. weitere) braucht es ein sichtbares **Vertrauens-Signal** für
Forker und Endnutzer. Diskussion 2026-05-24 hat drei Eckpunkte fixiert:

1. **Name: SBKIM-Siegel** (nicht TÜV+, nicht Gift+, nicht Mycel-
   Plakette — Klaus' Festlegung).
2. **Self-Inscribing** als Aussteller-Modell — die App stellt sich
   das Siegel selbst aus nach erfolgreicher Selbst-Prüfung der
   Pflicht-Module beim Boot. Kein zentraler Hub-Aussteller, kein
   CI-Build-Check. Vertrauen kommt vom Repo.
3. **Lebendes Dokument** — die Erklärung hinter dem Siegel wächst
   organisch: jedes Sicherheits-Update ergänzt einen Aspekt mit
   Datum.

Klaus' Zusatz im späten Diskussions-Strang: **optische Wertigkeit**
als Auszeichnung (Prädikatswein- / DLG- / Stiftung-Warentest-Stil).

**Korrektur 2026-05-24** (Klaus): „ohne Garantie war nicht ernst
gemeint" — der initial vorgesehene defensive Pflicht-Block im Modal
(„Es ist KEINE Garantie im rechtlichen Sinn …") wurde gestrichen und
durch einen nüchternen Fakt-Satz ersetzt: zwei Zeilen, Self-Inscribing-
Natur + Repo-Hinweis, kein Disclaimer-Ton.

## Geänderte Dateien

- `docs/components/16_siegel.md` neu angelegt (Stub-Struktur)
- `status.json` neuer Top-Level-Block `siegelBacklog[]`
- `scripts/update_puls_pie.py` erweitert um Lesen von `siegelBacklog`
- `CLAUDE.md` Modul-Tabelle + Erläuterungs-Absatz
- `docs/PULS.md` Schnellüberblick-Zeile 16 + Sitzungs-Eintrag oben

**Kein Code in `src/`** — Spec-Sitzung 16 ist die nächste Phase.

## Eingriffe im Detail

### `docs/components/16_siegel.md`

Stub-Struktur analog Karte 14 (Diffusion) und Karte 15 (Membran):

- **Im-Mycel-Bild**: Fruchtkörper-Metapher — Mycel arbeitet verborgen,
  der Fruchtkörper macht es sichtbar.
- **Vokabular**: SBKIM-Siegel, Self-Inscribing, Lebendes Dokument,
  Anti-Greenwashing-Klausel.
- **Warum jetzt**: Hochstufungs-Begründung (App-Freigabe, dezentrales
  Netz, self-inscribing als einziger skalierbarer Pfad ohne
  Zertifizierungs-Autorität).
- **Vier Sub-Bereiche** (Anker für Spec-Sitzung 16):
  - **Sub (a)** Selbst-Prüfung: welche Module gelten als Pflicht?
    Anker-Vorschlag: 01 / 02 / 03 / 04 / 05 / 07 / 15. Nicht-Pflicht:
    00 / 04.B / 06 / 08 / 10 / 11 / 12.
  - **Sub (b)** Badge-Rendering in **Auszeichnungs-Optik** —
    Prädikatswein / DLG / Stiftung Warentest als Referenz. Medaillon-
    Form, Edelmetall-Anmutung, Default `#C9A961`-Klasse Edel-Gold,
    klassische Serif/humanistische Sans-Serif, abstraktes Mycel-
    Wappen, SVG-skalierbar, dezenter Hover-Glow, einmaliger Aufleuch-
    Puls beim ersten Bezeugen. Negativ-Beispiele: keine Neon-Farben,
    keine Emoji-Plakette, keine GIFs.
  - **Sub (c)** Erklärungs-Modal: Titel, Datum der ersten Bezeugung,
    Modul-Liste, Aspekte-Liste, **kurzer Fakt-Satz zur Aussteller-
    Klärung** (zwei Zeilen, nüchtern — KEIN Haftungsausschluss).
  - **Sub (d)** Aspekte-Liste: `ZERTIFIKAT_ASPEKTE` als modul-interne
    code-versionierte Liste, jedes neue Sicherheits-Update ergänzt
    einen Eintrag mit `since` + `module` + `aspect` + `description`.
- **Persistenz**: RAM-only-Default (analog Modul 15 Sub (e));
  optional IndexedDB für „Datum der ersten Bezeugung" — Spec-
  Sitzung 16 entscheidet.
- **Strikte Tabus**: kein Siegel ohne Selbst-Prüfung-grün, Self-
  Issued ist keine Vertrauens-Garantie (Disziplin-Hinweis im
  Spec-Doku, nicht im UI-Modal), keine Hub-Aussteller-Variante,
  keine Laufzeit-Modifikation, keine PII.
- **Schnittstellen-Anker**: `SbkimSiegel.{init, isCertified,
  getExplanation, getCertifiedModules, getAspects, _meta}` (Spec-
  Sitzung 16 finalisiert die Form).
- **Brief-99-Pipeline-Position**: Schritte 1–6 (Spec → Bau → Sichttest
  → Spec 15.B → Endknoten-Migration → App-Freigabe).
- **Bauzustand-Tabelle**: eine Zeile „Stub angelegt 2026-05-24".

### `status.json`

Neuer Top-Level-Block `siegelBacklog[]` parallel zu `schutzBacklog`
(reaktiv) / `diffusionBacklog` (proaktiv nach innen) /
`membranBacklog` (proaktiv nach außen). **Siegel ist proaktiv nach
innen+außen — Selbst-Bezeugung.**

Eintrag Modul 16:
- `score: "schablone"`
- `siegel: "Stub (Siegel-Backlog, angelegt 2026-05-24), Priorität
  hoch (vor App-Freigabe)"`
- `kurz: ...` (Self-Inscribing, Anti-Greenwashing, lebendes Dokument,
  Anlass App-Freigabe)

### `scripts/update_puls_pie.py`

Erweitert um `siegelBacklog`-Lesen zusätzlich zu den drei bestehenden
Backlogs. Skript gelaufen:

```
PULS-Pie aktualisiert (Stand 2026-05-24, 16 Module):
  🟫 Schablone: 5
  🟧 In Werkstatt: 0
  🟨 Spec fertig: 0
  🟦 Code-Stub: 8
  🟩 Fertig: 3
```

**15 → 16 Module, Schablonen 4 → 5**, andere Score-Verteilungen
unverändert.

### `CLAUDE.md`

- Modul-Tabelle Zeile 16 ergänzt.
- Überschrift „Die zehn Module + Schutz-Backlog 10-12 + Proaktiv-
  Backlog 14 + 15 + Siegel-Backlog 16" angepasst.
- Erläuterungs-Absatz nach dem Karten-14+15-Block: „Karte 16 (Siegel)
  ist die Selbst-Bezeugungs-Karte — self-inscribing SBKIM-Siegel in
  Auszeichnungs-Optik (Prädikatswein- / DLG-Stil) …" Modal-Klausel
  nüchtern beschrieben („kein Disclaimer-Schwall").

### `docs/PULS.md`

- Schnellüberblick-Zeile 16 ergänzt.
- Sitzungs-Eintrag oben mit voller Hintergrund-Erklärung.

## Korrektur „Ohne Garantien"-Klausel (Klaus, 2026-05-24)

Initial hatte ich Klaus' Bemerkung „""ohne garantien""" (mit
ironischen Anführungszeichen) als Pflicht-Spec-Vorgabe interpretiert
und einen defensiven Haftungsausschluss-Block ins Modal eingebaut:

> Es ist **KEINE Garantie** im rechtlichen Sinn, kein Versprechen
> einer externen Zertifizierungs-Stelle, keine Versicherung gegen
> Bugs oder Angriffe …

Klaus' Korrektur: „ohne Garantie war nicht ernst gemeint". Der Block
wurde gestrichen und durch einen **nüchternen Fakt-Satz** ersetzt:

> Dieses Siegel ist **self-inscribing**: die App hat sich selbst
> geprüft. Vertrauen kommt vom Repo, in dem sie gehostet ist:
> `<repo-url>`.

Zwei Zeilen, nüchtern, ohne Disclaimer-Ton. Spec-Sitzung 16 darf
feinpolieren, aber NICHT aufblähen.

Drei Stellen korrigiert: Karte 16 § Sub (c), CLAUDE.md
Erläuterungs-Absatz, PULS.md Sitzungs-Eintrag-Klausel-Block. Die
Verwendungen in Karte 16 § Strikte Tabus („Self-Issued ist keine
Vertrauens-Garantie") bleiben als Disziplin-Hinweis für die Bau-
Sitzung (kein UI-Text, sondern interne Klausel).

## Disziplin

- KEIN Code-Eingriff. Nur Karte 16 anlegen, status.json erweitern,
  Pie regenerieren, Doku nachziehen.
- KEIN Spec-Eingriff in andere Module. Modul-16-Hooks (z.B. Modul 15
  Sub (a) `read()` trägt Siegel im Snapshot) sind Spec-Sitzung-16-
  Pflicht, nicht hier.
- `score:"schablone"` (Stub) — KEIN Sprung auf `"spec"` oder
  `"stub"`, weil Spec-Sitzung 16 noch nicht gelaufen ist.
- KEIN `PROTOCOL_VERSION`-Bump, KEIN `DB_VERSION`-Bump.

## Vorgemerkt — Folge-Sitzungen

Klaus' Reihenfolge-Empfehlung aus 2026-05-24-Diskussion:

```
Schritt 1: Spec-Sitzung 16    (Karte 16 füllen — finale Pflicht-
                               Modul-Liste, Badge-DOM-Form,
                               SVG-Wappen-Entwurf, Modal-Inhalt,
                               Aspekte-Schema)
Schritt 2: Bau-Sitzung 16     (src/modules/16_siegel.js, Badge-CSS
                               in index.html, Modal-Mount,
                               ZERTIFIKAT_ASPEKTE-Startwert)
Schritt 3: Sichttest 16       (Klaus, Sage-Page Badge sichtbar +
                               Modal öffnet sich)
Schritt 4: Spec-Sitzung 15.B  (Sub (a) + Sub (b) mit Siegel-Hook)
Schritt 5: Endknoten-Migration Karte 09 § Schritt 10
                               (Membran-Lampe + Siegel-Anker pro
                                Endknoten-PWA)
Schritt 6: Klaus' App-Freigabe (mit Siegel sichtbar)
Später:    Modul 11 / 12 / 10  (jeder Bau ergänzt einen Aspekt)
```

## Nächster sinnvoller Schritt

PR mergen → fertig. Klaus triggert Spec-Sitzung 16 mit `Befehl
schreiben`, sobald er bereit ist.
