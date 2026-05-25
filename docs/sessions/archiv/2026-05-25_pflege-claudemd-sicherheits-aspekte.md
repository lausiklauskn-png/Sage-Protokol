# 2026-05-25 · Mini-Pflege — CLAUDE.md § „Sicherheits-Module pflegen Aspekte" verankert

**Sitzungs-Rolle:** Mini-Pflege (Doku-Pflege, kein Modul-Code). Branch
`claude/pflege-claudemd-sicherheits-aspekte-5IOHj`. Anschluss nach
Bau-Sitzung 16 (PR #152) + Pflege Wappen/Korona (PR #154) +
Brief-Anlage (PR #155 — `BRIEF_PFLEGE_CLAUDEMD_ASPEKTE.md` auf `main`).

## Anlass

Pipeline-Schritt **3a** aus der CLAUDE.md-Tafel „Pipeline-Reihenfolge
bis App-Freigabe (verbindlich, 2026-05-24)" — explizit als to-do
markiert in:

- `docs/components/16_siegel.md` § Sub (d) Pflicht-Konvention für
  künftige Sicherheits-Module
- `docs/INTERFACES.md` § 1 Modul 16 § Garantien-Block („Folge-Pflege
  CLAUDE.md: § „Sicherheits-Module pflegen Aspekte" als neuer
  Pflicht-Block ist NACH Bau-Sitzung 16 fällig — eigene Mini-Pflege-
  Sitzung")

Der Pflicht-Block muss in CLAUDE.md gespiegelt sein, damit jede
neue Bau- bzw. Pflege-Sitzung eines Sicherheits-Moduls (10 / 11 / 12 /
14 / 15.B / künftige) die Konvention beim Pflicht-Lesen findet —
ohne dass sie zufällig den richtigen Karten-Abschnitt oder
INTERFACES-Garantien-Block liest.

## Geänderte Dateien

- `CLAUDE.md` — zwei Edits:
  - Neuer § „Was du tust (Pflicht-Konventionen)" direkt nach
    § „Was du nicht tust", mit einem Bullet-Eintrag „Sicherheits-Module
    pflegen Aspekte" (verweist auf Karte 16 § Sub (d) +
    INTERFACES § 1 Modul 16 § ZERTIFIKAT_ASPEKTE).
  - Pipeline-Reihenfolge-Tafel: Schritt 1 ✅ PR #151, Schritt 2 ✅
    PR #152 + Pflege Wappen/Korona PR #154, **Schritt 3a NEU
    eingefügt** und ✅ erledigt (PR aus dieser Sitzung); Schritte
    3 / 4 / 5 / 6 inhaltlich unverändert.
- `docs/PULS.md` — Sitzungs-Eintrag oben angefügt (Format analog
  Mini-Pflege-Einträgen 2026-05-24).
- `docs/sessions/archiv/2026-05-25_pflege-claudemd-sicherheits-aspekte.md`
  (dieses Protokoll).

## Wortlaut Pflicht-Block (verbindlich)

```markdown
## Was du tust (Pflicht-Konventionen)

- **Sicherheits-Module pflegen Aspekte.** Jede Bau- bzw. Pflege-Sitzung
  eines Sicherheits- oder Schutz-Moduls (10 Reputation / 11 Rate-Limit
  / 12 Blocklist / 14 Diffusion / 15.B Membran Sub (a)+(b) / künftige
  Sicherheits-Module) MUSS in `src/modules/16_siegel.js` einen
  `ZERTIFIKAT_ASPEKTE`-Eintrag am Listen-Ende ergänzen (aktuelles
  Datum + Modul-ID + ein-Satz-Beschreibung, Schema siehe
  Karte 16 § Sub (d) bzw. INTERFACES § 1 Modul 16 § ZERTIFIKAT_ASPEKTE).
  Das Aspekte-Wachstum macht spätere Sicherheits-Updates im Siegel-
  Modal sichtbar, **ohne dass Forker re-andocken müssen**. Verstöße
  gegen diese Konvention sind Pflege-PR-Befunde und werden in der
  Folge-Sitzung nachgezogen.
```

## Disziplin gehalten

- **KEIN Modul-Code.** `src/modules/16_siegel.js` unverändert —
  `ZERTIFIKAT_ASPEKTE`-Liste bleibt beim Spec-Startwert „Grund-
  Siegel-Bezeugung 2026-05-24". Neue Aspekt-Einträge entstehen erst
  durch echte Sicherheits-Modul-Bau-/Pflege-Sitzungen.
- **KEIN Eingriff in Karte 16 oder INTERFACES.md.** Die Pflicht-
  Konvention steht dort schon (Karte 16 § Sub (d) +
  INTERFACES § 1 Modul 16 § Garantien-Block). CLAUDE.md spiegelt sie
  zentral, damit sie Pflicht-Leseliste ist.
- **KEINE Tafel-Umsortierung.** Schritt 3a ist additive Pflege-Spalte
  zwischen 3 (Sichttest) und 4 (Spec 15.B). Klaus' Reihenfolge
  unangetastet (CLAUDE.md § „Wer darf umsortieren").
- **KEIN `status.json`-Wechsel** — kein Modul-Score-Wechsel.
  `scripts/update_puls_pie.py` NICHT aufgerufen (Pie-Block
  unverändert).
- **Sichttest nicht nötig** — reine Doku-Pflege, kein Modul-Code,
  kein UI-Element berührt.

## Begründung Schritt 3a (Pflege-PR, nicht Bau-Brief)

Die Pflicht-Konvention war beim Spec-Sitzungs-Brief 16 als
Folge-Pflege markiert, aber NICHT als eigener Pipeline-Tabellen-
Eintrag in CLAUDE.md aufgenommen. Diese Mini-Pflege schließt
genau diese Lücke — sie trägt Schritt 3a in die Tafel ein UND
markiert ihn als ✅ erledigt im selben PR, weil der Pflicht-Block
in dieser Sitzung gleichzeitig formuliert + verankert wird.

## Vorgemerkt

- Klaus' Sichttest 16 (Pipeline-Schritt 3) — läuft parallel,
  ist keine Claude-Sitzung. Badge mit Ritterschild-Wappen +
  Akkretions-Disk-Korona, Modal mit Aspekten-Liste + Pflicht-Modul-
  Liste + Aussteller-Klausel.
- Spec-Sitzung 15.B (Pipeline-Schritt 4) — nächste Claude-Sitzung,
  Brief liegt noch nicht. Per `Befehl schreiben` am Sitzungs-Ende
  einer Folge-Sitzung anlegen.
- Sobald ein Sicherheits-Modul (10 / 11 / 12 / 14 / 15.B) tatsächlich
  gebaut wird, MUSS die Bau-Sitzung jetzt verpflichtend einen
  `ZERTIFIKAT_ASPEKTE`-Eintrag in `src/modules/16_siegel.js` am
  Listen-Ende ergänzen — sonst Pflege-PR-Befund in der Folge-Sitzung.

## Nächster sinnvoller Schritt

PR mergen → Spec-Sitzung 15.B per `Befehl schreiben` als nächste
Claude-Sitzung (Pipeline-Schritt 4). Klaus' Sichttest 16
(Pipeline-Schritt 3) läuft parallel, blockiert die Spec-Sitzung
15.B nicht (Spec 15.B braucht das fertige Siegel-Code-Modul +
INTERFACES-Block, beides liegt).
