# Brief — Pflege-Sitzung CLAUDE.md § „Sicherheits-Module pflegen Aspekte"

**Anlass:** Pipeline-Reihenfolge-Tafel (CLAUDE.md § Pipeline-Reihenfolge
bis App-Freigabe, 2026-05-24) Schritt **3a** — explizit als to-do
markiert in Spec-Sitzung 16 (Karte 16 § Sub (d) Pflicht-Konvention für
künftige Sicherheits-Module + INTERFACES § 1 Modul 16 § Garantien
„Folge-Pflege CLAUDE.md: § „Sicherheits-Module pflegen Aspekte" als
neuer Pflicht-Block ist NACH Bau-Sitzung 16 fällig (eigene Mini-Pflege-
Sitzung)").

**Branch:** `claude/pflege-claudemd-sicherheits-aspekte` (frisch von
`main` abzweigen).

**Sitzungs-Rolle:** Mini-Pflege (Doku-Pflege, kein Modul-Code).

**Voraussetzung:** Keine offenen PRs (`gh pr list --state open` leer).
Wenn ein PR offen sein sollte, vor dieser Sitzung mergen oder den
Konflikt klären.

---

## Pflichtleseliste (in dieser Reihenfolge)

1. `CLAUDE.md` (komplett — Tafel + § „Was du nicht tust" sind die
   Eingriffs-Stellen)
2. `docs/PULS.md` (NUR Schnellüberblick + die jüngsten drei Sitzungs-
   Einträge 2026-05-24 zu Modul 16)
3. `docs/components/16_siegel.md` (NUR § Sub (d) „Pflicht-Konvention
   für künftige Sicherheits-Module" + § Bauzustand letzte Zeile, als
   Quelle-Beleg für den neuen Pflicht-Block)
4. `docs/INTERFACES.md` § 1 Modul 16 (NUR § Garantien-Block, dort steht
   die exakte Formulierung der Pflicht-Konvention, die in CLAUDE.md
   gespiegelt werden soll)

---

## Deine Aufgabe

Eine einzige Doku-Pflege — KEIN Modul-Code, KEINE Spec-Änderung, KEINE
Schnittstellen-Berührung.

### 1. CLAUDE.md § „Was du nicht tust" um positiven Pflicht-Block erweitern

Aktuell hat der Block (CLAUDE.md Zeile 221-231) nur Negativ-Klauseln
(„Kein Modul-Code ohne Auftrag", „Keine Vermischung", „Keine PII",
„Kein Crawler"). Ergänze NACH diesem Block einen neuen positiven
Pflicht-Block:

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

**Disziplin beim Wortlaut:**

- Der Block heißt § „Was du tust (Pflicht-Konventionen)" (analog
  zum bestehenden § „Was du nicht tust"). Plural, weil die Sektion
  weitere positive Pflichten aufnehmen kann.
- Genau ein Bullet-Eintrag in dieser Pflege — KEINE weiteren
  Pflichten dazu erfinden. Der Block wächst pro Pflege-PR.
- Verweis-Anker auf Karte 16 § Sub (d) UND INTERFACES § 1 Modul 16
  § ZERTIFIKAT_ASPEKTE — beide Stellen müssen genannt werden, weil
  beide die verbindliche Quelle sind.
- KEIN Code-Beispiel im Block (CLAUDE.md ist Sitzungs-Anker, kein
  Code-Handbuch — Code-Beispiele gehören in die Karte 16).
- KEINE Formulierung wie „der Aspekt wird im nächsten Pflege-PR
  ergänzt" — der MUSS ist absolut, keine Aufschiebung.

### 2. Pipeline-Reihenfolge-Tafel Stand nachziehen

CLAUDE.md Zeile 300-307. Aktualisierungen pro Zeile:

| # | Sitzung | Aktualisierung |
|---|---|---|
| 1 | Spec-Sitzung 16 | `Brief liegt?` ✅ → `✅ erledigt 2026-05-24, PR #151` |
| 2 | Bau-Sitzung 16 | `Brief liegt?` ⏳ → `✅ erledigt 2026-05-24, PR #152 + Pflege Wappen/Korona PR #154` |
| 3 | Sichttest 16 | bleibt ⏳ wartet auf Klaus |
| 3a | (NEU einfügen!) Pflege CLAUDE.md § „Sicherheits-Module pflegen Aspekte" | `✅ erledigt 2026-05-24, PR #<diese-Sitzung>` |
| 4 | Spec-Sitzung 15.B | bleibt ⏳ |
| 5 | Endknoten-Migration | bleibt ⏳ |
| 6 | Klaus' App-Freigabe | bleibt ⏳ |

**Disziplin:**

- Schritt 3a ist NEU in der Tafel (war in Spec-Sitzung 16 vergessen).
  Diese Pflege-Sitzung trägt ihn nach UND markiert ihn als ✅ erledigt
  in derselben Sitzung.
- PR-Nummern in den Brief NICHT raten — beim Schreiben des
  Übergabeprotokolls die echten Nummern aus `gh pr list` einsetzen.
  Wenn der PR dieser Sitzung noch keine Nummer hat, Platzhalter
  `PR #<diese-Sitzung>` lassen; nach `gh pr create` den echten Wert
  per Folge-Edit nachziehen.
- KEIN Umsortieren der Reihenfolge ohne Klaus' Einverständnis (siehe
  § „Wer darf umsortieren" Zeile 335-344).

### 3. Was du NICHT tust in dieser Sitzung

- **Kein Modul-Code.** Insbesondere KEIN Eingriff in
  `src/modules/16_siegel.js` — die `ZERTIFIKAT_ASPEKTE`-Pflicht wird
  in CLAUDE.md verankert, NICHT als Code-Ergänzung gespielt. Diese
  Pflege schreibt KEINEN neuen Aspekt-Eintrag — das passiert erst,
  wenn ein konkretes Sicherheits-Modul gebaut wird.
- **Kein Eingriff in Karte 16 oder INTERFACES § 1 Modul 16.** Die
  Pflicht-Konvention steht dort schon. CLAUDE.md spiegelt sie nur an
  zweiter Stelle, wo Bau-Sitzungen sie verbindlich sehen.
- **Keine Tafel-Umsortierung** (siehe § „Wer darf umsortieren").
- **Kein Sichttest** — Klaus' Sichttest 16 läuft parallel und ist
  nicht Teil dieser Sitzung.

---

## Pflicht am Sitzungsende (CLAUDE.md § Pflicht am Sitzungsende)

1. `docs/PULS.md` — Eintrag in das Sitzungs-Tagebuch, oben einfügen,
   Format analog der jüngsten Mini-Pflege-Einträge 2026-05-24.
   Schnellüberblick-Tabelle für Modul 16 ist **nicht** zu ändern
   (Modul-Code unverändert).
2. `status.json` **nicht ändern** (kein Score-Wechsel, keine
   Modul-Wertung). Pie-Skript also **nicht aufrufen**.
3. Übergabeprotokoll in `docs/sessions/archiv/2026-05-25_pflege-
   claudemd-sicherheits-aspekte.md` (Datum aktualisieren!) anlegen,
   Format analog `docs/sessions/archiv/2026-05-24_bau-16-siegel.md`.
4. Commit auf `claude/pflege-claudemd-sicherheits-aspekte`, sprechende
   Message („Pflege CLAUDE.md — Pflicht-Block Sicherheits-Module
   pflegen Aspekte verankern").
5. `git push -u origin claude/pflege-claudemd-sicherheits-aspekte`,
   bei Netz-Fehler bis zu 4× retry (exp. backoff 2/4/8/16 s).
6. **Draft-PR aufmachen** via GitHub-MCP. PR-Body skeleton siehe
   unten.
7. **„Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort** —
   typischerweise:
   - „Klaus' Sichttest 16 (parallel, keine Claude-Sitzung nötig)"
   - „Spec-Sitzung 15.B mit `Befehl schreiben`" — Pipeline-Schritt 4
   - „Klaus mergt diese Pflege per Zuruf"
8. **Brief-Codeblock für Spec-Sitzung 15.B im Chat ausgeben**
   (CLAUDE.md-Konvention 2026-05-21) — wenn diese Pflege den
   Folge-Brief `BRIEF_SPEC_15B_MEMBRAN.md` anlegt. Wenn die Pflege
   den Folge-Brief NICHT anlegt (weil 15.B noch eigenständige
   Vorbereitung braucht), darf der Codeblock weggelassen werden,
   aber dann muss der Schritt „Spec-Sitzung 15.B mit `Befehl
   schreiben`" explizit oben erscheinen.

---

## PR-Body-Skeleton

```markdown
## Summary
- CLAUDE.md § „Was du tust (Pflicht-Konventionen)" als neuer
  positiver Pflicht-Block angelegt, mit einem Bullet-Eintrag
  „Sicherheits-Module pflegen Aspekte" (verweist auf Karte 16
  § Sub (d) + INTERFACES § 1 Modul 16 § ZERTIFIKAT_ASPEKTE).
- Pipeline-Reihenfolge-Tafel Stand nachgezogen (Schritt 1 ✅, Schritt
  2 ✅, Schritt 3a NEU eingefügt und ✅, Schritte 3/4/5/6 unverändert).

## Hintergrund
Aufgabe aus Spec-Sitzung 16 (Karte 16 § Sub (d) Pflicht-Konvention +
INTERFACES § 1 Modul 16 § Garantien). Pipeline-Schritt 3a der CLAUDE.md
Pipeline-Reihenfolge-Tafel.

## Test plan
- [ ] CLAUDE.md liest sich konsistent (positiver Pflicht-Block kommt
      direkt nach negativem § „Was du nicht tust"-Block).
- [ ] Tafel-Stand stimmt zu live-Status der PRs (#151, #152, #154,
      diese-Sitzung-PR).
- [ ] Kein Modul-Code, kein Spec-/INTERFACES-/Karten-Eingriff (Doku-
      Pflege only).

https://claude.ai/code/session_<aktuelle-session-id>
```

---

## Erwarteter Umfang

Sehr klein: zwei Edits in `CLAUDE.md` (neuer Block + Tafel-Nachzug),
ein neuer Eintrag in `docs/PULS.md` Sitzungs-Tagebuch, ein neues
Übergabeprotokoll. Kein Modul-Code, keine Tests, keine Smoke-Probe.
Erwartete Sitzungs-Dauer ≤ 10 Minuten.
