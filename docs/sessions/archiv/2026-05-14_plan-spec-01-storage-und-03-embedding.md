# Übergabeprotokoll · 2026-05-14 · Plan-Sitzung Spec 01 Storage + 03 Embedding

**Sitzungs-Rolle:** Plan-Sitzung (Variante Hauptsitzung — keine Modul-
Detailarbeit, kein Code, kein Spec-Inhalt; nur Auftragsdesign für die
folgende Spec-Sitzung)
**Branch:** `claude/semantic-agent-network-Y03Vg`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md`
**Plan-File (außerhalb Repo):** `/root/.claude/plans/1-es-soll-sage-resilient-crane.md`

---

## Auftrag

Klaus startet eine neue Arbeitsphase: nachdem das Sage·Observatorium
(Landing-Page + 13 Komponenten-Karten + Bau-Puls) im Site-Echo-Stand ist,
sollen jetzt die ersten zwei Spec-Sitzungen aufgesetzt werden. PULS-
Empfehlung der vorigen Sitzungen lautete eindeutig: **Modul 01 (Storage)
+ Modul 03 (Embedding) parallel** spezifizieren — beide ohne
Abhängigkeiten, blockieren am meisten Folge-Module.

Im Verlauf der Plan-Sitzung kamen zwei Klaus-Beobachtungen hinzu, die
das Briefing ergänzen mussten:

1. **A1–B3-Notations-Überlappung:** Klaus hatte gemerkt, dass die Sage-
   Landingpage in Karte 11 „Wanderung" dieselben Buchstaben A1–B3
   verwendet wie sein externes Repo Mein-Mixarium in
   `SBKIM_AGENTS.md`, aber mit unterschiedlicher Bedeutung (Hops vs.
   Rollen).
2. **Andock-Selbstcheck:** Module sollen sich beim Laden in der DevTools-
   Konsole mit Name und Funktionsliste melden, damit beim Einbau in die
   Endknoten-PWA sofort sichtbar ist, dass das Modul gezogen hat.

Plus eine inhaltliche Klärung zur e5-Embedding-API (Query/Passage-
Prefix-Drift), die im Plan zuerst als Risiko stand und in der Plan-
Sitzung gelöst wurde.

---

## Was getan wurde

### 1. Recherche A1–B3-Notation

`index.html` Karte 11 „Wanderung" (Z. 2741–2819) gelesen — A1/A2/A3 und
B1/B2/B3/B4 sind dort **Knoten-Hops** in zwei Such-Pfaden: Pfad A
(golden → grün, erfolgreich, endet auf A3 ✓) und Pfad B (rosa, fadet
aus, Apoptose bei B4). Quervergleich mit der Mixarium-`SBKIM_AGENTS.md`:
dort sind A1–A3/B1–B3 **Agenten-Rollen** (A1 Curator, A2 Auditor, A3
Devil's Advocate · B1 Interviewer, B2 Matcher, B3 Critic).

Notation in beiden Welten kongruent, Bedeutung verschieden. Plausible
Synthese: die Hops *tragen* die Funktionen — Pfad A geht Curator →
Auditor → Devil's Advocate (Anbieter-Seite verfeinert die Antwort),
Pfad B geht Interviewer → Matcher → Critic → Apoptose (Anfrage-Seite
verfeinert die Frage, im Negativ-Fall stirbt der Strang). Diese
Synthese gehört nicht in Spec 01+03, sondern in Spec **Modul 04 Match**.

### 2. Plan-File erstellt

Im Plan-Mode des Claude-Code-Harnesses entstand
`/root/.claude/plans/1-es-soll-sage-resilient-crane.md` — kein Repo-File,
sondern Sitzungs-Notiz. Der Plan beschreibt die anstehende Spec-Sitzung
mit **8 Liefer-Artefakten**:

1. `docs/components/01_storage.md` — Schnittstelle füllen (Promise-API,
   Stores-Liste, Versionsmigration, Privatmodus-Fehlerbehandlung,
   Selbstcheck-`console.info`)
2. `docs/components/03_embedding.md` — Schnittstelle füllen
   (`embedQuery` / `embedPassage` / Batch-Varianten, L2-Norm,
   Lazy-Init, Truncate-Strategie, Selbstcheck-`console.info`)
3. `docs/INTERFACES.md` — `storage.*` + `embedding.*`-Verträge,
   erstmals Vertrag-Sektionen (Datei war bisher leer bis auf
   Versionsfeld und Schablone)
4. `status.json` — Status 01 + 03 auf `spec` setzen
5. `docs/PULS.md` — Pie-Chart, Tabelle, „Als nächstes ✨"-Liste,
   Querschnitts-Frage (A1–B3) eintragen, Sitzungs-Eintrag
6. `tests/manual_check.html` — Test-Knöpfe als Stub, plus „Selbstcheck
   Konsole prüfen"-Hinweisknopf
7. Eigenes Sitzungs-Archiv der Spec-Sitzung
8. **`docs/WEGWEISER.md` (NEU)** — Einstiegs-Anleitung für neue
   Mitarbeiter und Claude-Sitzungen, mit nummerierten Checkbox-Schritten
   (1–9), Glossar in einfacher Sprache, und Stand-Block am Ende, in dem
   jede Sitzung eine Zeile einträgt („was getan / NÄCHSTES: …")

### 3. Entscheidung: e5-Prefix-Drift gelöst durch API-Design

In der ersten Plan-Iteration stand `embedText(text, mode)` mit
`mode: "query"|"passage"` und das Risiko, dass Modul 04 vergisst, den
Modus zu beachten und Vektoren leicht abdriften.

Klaus' Frage „Wie würdest du das lösen?" — Antwort nach Abwägung dreier
Optionen (A: Modus-Parameter mit dokumentiertem Risiko · B: selbst-
validierende Vektor-Objekte · C: zwei getrennte API-Funktionen) ist:

**Lösung C — zwei API-Funktionen statt Modus-Parameter.** Modul 03
exportiert vier Funktionen: `embedQuery`, `embedPassage`,
`embedQueryBatch`, `embedPassageBatch`. Modul 04 Match wird modus-frei
und signiert `match(queryVec, passageVec)` — der Parametername zwingt
zur richtigen Kombination, kein Laufzeit-Check, kein vergessbarer
Parameter. Risiko-Eintrag im Plan-File von „dokumentiert, ungelöst" zu
„durch API-Design gelöst" umgeschrieben.

### 4. Entscheidung: Selbstcheck via `console.info`

Beide Module emittieren beim Laden / beim ersten `init()`-Erfolg eine
Konsolen-Meldung:
- `console.info("MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear")`
- `console.info("MODUL 03 EMBEDDING bereit, Funktionen: init/embedQuery/embedPassage/embedQueryBatch/embedPassageBatch, Modell: e5-small, Dim: 384")`

Format ist über alle Module einheitlich (Spec-Sitzung legt das fest).
Storage emittiert beim Skript-Laden, Embedding erst beim
`init()`-Erfolg (Modell-Download asynchron — die Konsole soll nicht
„bereit" signalisieren, bevor das Modell tatsächlich nutzbar ist).

### 5. Empfehlung: Modul 09 (Einbau-PWA) parallel anbieten

Klaus' Notiz beschrieb den 5-Schritte-Andock-Workflow:
1. Modul-Datei kopieren
2. Script-Tag in `index.html` der Endknoten-PWA
3. Storage-Prefix prüfen
4. Konsolen-Selbstcheck verifizieren
5. Manueller Roundtrip-Test

Modul 09 ist dependenz-frei und blockiert sonst die Bau-Sitzungen
(weil ohne Andock-Anleitung keine Bau-Sitzung weiß, wie ihr Modul in
die Endknoten-PWA wandert). Daher gehört es früh in die Spec-Pipeline.
Im Plan-File als zusätzlicher PULS-Empfehlungs-Eintrag vorgesehen.

### 6. PULS.md aktualisiert

Neuer Sitzungs-Eintrag oben (2026-05-14, Plan-Sitzung). Querschnitts-
Frage A1–B3-Notations-Überlappung als neuer Punkt unter „Offene
Querschnitts-Fragen" eingetragen — Hinweis auf Spec-Sitzung Modul 04
als Erfüllungsort.

Modulstand-Pie und „Als nächstes ✨"-Liste **bewusst nicht** geändert:
keine Status-Wechsel in dieser Plan-Sitzung (Spec 01+03 bleiben
🟫 Schablone, bis ihre Spec-Sitzung sie auf 🟨 Spec setzt).

---

## Was offen blieb

- **Spec-Sitzung 01+03 selbst** ist Auftrag für die nächste Sitzung,
  nicht für diese. Diese Plan-Sitzung hat nur den Brief geschrieben.
- **A1–B3-Synthese** als Querschnitts-Frage notiert, ihre Auflösung
  ist Aufgabe der Spec-Sitzung Modul 04 Match.
- **Bestätigung Stores-Liste in 01:** Plan listet die offene Frage „Fehlt
  ein Store für Suchhistorie / Embedding-Cache?" — Spec-Sitzung 01
  entscheidet.
- **L2-Norm-Implementierungs-Detail:** Plan schreibt fest, dass Modul 03
  immer normalisierte Vektoren liefert (damit Cosinus = Skalarprodukt).
  Konkrete Norm-Stelle in der API-Doku ist Sache der Spec-Sitzung 03.

---

## Nächster sinnvoller Schritt

1. **Frische Spec-Sitzung starten.** Briefing-Vorlage aus
   `docs/sessions/BRIEFING_TEMPLATE.md` §B, mit Verweis auf das Plan-File
   `/root/.claude/plans/1-es-soll-sage-resilient-crane.md`. Klaus
   entscheidet bei Sitzungsstart, ob beide Module in einer Sitzung
   gemacht werden oder ob zwei parallele Sitzungen (CLAUDE.md-empfohlen
   für Token-Sparsamkeit).
2. **Parallel anbietbar:** Spec-Sitzung Modul 09 Einbau-PWA als dritte
   parallele Sitzung — dependenz-frei, Andock-Workflow schon notiert.
3. **Erst nach Spec 01+03:** Bau-Sitzung Modul 01, Bau-Sitzung Modul 03
   (jeweils mit `manual_check.html`-Knöpfen + `console.info`-Selbstcheck
   im Code).

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/PULS.md` aktualisiert (Sitzungs-Eintrag + Querschnitts-Frage)
- [x] Übergabeprotokoll unter `docs/sessions/archiv/2026-05-14_plan-spec-01-storage-und-03-embedding.md` (diese Datei)
- [ ] Kein Code geändert → kein `tests/manual_check.html`-Sichttest nötig
- [ ] Commit + Push auf `claude/semantic-agent-network-Y03Vg` (folgt)
- [ ] Draft-PR prüfen / anlegen (folgt)
