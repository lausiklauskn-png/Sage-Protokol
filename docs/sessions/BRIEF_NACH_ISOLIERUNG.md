# Brief — nach der Identitäts-Isolierung (Folge zu 2026-07-11)

**Branch:** je Repo **frisch auf `origin/main`** setzen
(`git -C <repo> fetch origin --quiet && git -C <repo> checkout -B <branch> origin/main`).
**Freibrief gilt** (siehe jeweilige CLAUDE.md § Freibrief — eigene, getestete,
abgegrenzte PRs selbst mergen; bei echtem Zweifel erst Klaus fragen).

## SITZUNGSSTART-PFLICHT (zuerst, ohne Ausnahme)
`bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"` — oder von Hand
`git fetch origin` je Repo. **NIE** eine Aussage über „App X hat/hat nicht Feature Y"
ohne vorherigen `fetch` — die Container-Klone sind teils Monate alt. (Real passiert
2026-07-11: 5 lokale App-Klone hatten `window.SBKIM_DB_SUFFIX` noch NICHT, live auf
`origin/main` aber schon — erst `fetch` gab die Wahrheit.)

## Pflichtlektüre (in dieser Reihenfolge)
1. `CLAUDE.md` (Verfassung + § Freibrief + § SITZUNGSSTART-PFLICHT).
2. `docs/PULS.md` — **oberste 3 Einträge vom 2026-07-11** (Isolierung 11/11 doppelt
   bewiesen · Modul-01-Härtung · Selbst-Heilung).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — Abhak-Liste: **A13 erledigt/geschlossen**,
   offen sind **A14 · A15 · A11 · A12**.
4. Bei Netz-Anmeldung/Siegel-Arbeit: die Skills `saubere-netz-anmeldung` +
   `status-leiste-siegel` (2026-07-11 synchronisiert — enthalten jetzt die
   `window.SBKIM_DB_SUFFIX`-Härtung + die verifizierte 11er-Suffix-Liste).

## Stand (erledigt 2026-07-11)
- **Identitäts-Isolierung DOPPELT bewiesen + geschlossen (A13).** Klaus' Browser-
  Reihen-Test: 11 Apps → 11 verschiedene nodeIds, keine Kollision. Zweiter Beleg:
  Mycel-Karten-Aufzeichnung (keine nodeId an zwei Apps, stabile IDs über Zeit).
  Früheres Kollisions-Paar SB-KIMTool-Point ↔ family-project sauber getrennt.
  Fix live: PR #595 (`window.SBKIM_DB_SUFFIX` vor 1. SBKIM-Script + Idempotenz-Guard),
  netzweit 11/11.
- **Skills synchronisiert** (PR #598): Härtungs-Mechanismus ergänzt, BLP-Suffix
  korrigiert (`bookledgerpro` → `bookledgerpro-sbkim`), Suffix-Liste vollständig
  (alle 11 live von origin/main verifiziert).
- **Verifizierte Suffixe** (Referenz): mixarium · rezeptbuch · familyprojekt ·
  **bookledgerpro-sbkim** · toolpoint · jasonstresor · meintresor · kimseek ·
  kimboard · tomyhub · kimbell · (Sage `sage`). Mycel-Karte = Beobachter, kein Suffix.

## PR-Status (Stand 2026-07-11)
- Eigene PRs #597 + #598 **gemergt**. Keine offenen eigenen PRs.
- **PR #401** (Draft, „Discovery-Expedition Bildmaterial", andere Sitzung 2026-06-23):
  reine Assets/Doku, unvollständig, **nicht meiner** → **lassen**, nicht anfassen
  (gehört seiner Ursprungs-Sitzung, wartet auf Klaus' Bild-Nachschub).

## Ziel dieser Sitzung — Klaus wählt (Empfehlung in Reihenfolge)
1. **Tomys-Hub-Spore veröffentlichbar machen** (kleiner, abgeschlossener Bau —
   schneller Gewinn). Tomys-Hub hat keinen „📥 Spore herunterladen"-Knopf, deshalb
   liegt seine Spore noch nicht unter `sbkim/spore.json`. Knopf ergänzen (Muster aus
   dem Andock-Wizard-Baustein 2 / vorhandenem Spore-Export anderer Apps), Browser-
   Sichttest durch Klaus, dann die erzeugte `spore.json` committen. Branch-Vorschlag
   `claude/tomyhub-spore-download`.
2. **A14 — `ensureSlotStores`-Race beheben** (`Bau`, ~1 Sitzung). Vorbestehender
   sporadischer `NotFoundError: One of the specified object stores was not found`
   (Modul 01 Transaktion via Modul 05 `ensureSlotStores`) — ein Slot-Store wird in
   einer Transaktion angefragt, bevor der Versions-Bump ihn angelegt hat. **NICHT**
   durch A13 verursacht (auf `main` ohne Fix identisch 15/16 rot in Tomys' Verbund-E2E).
   Kann im Feld gelegentlich einen Andock-/Antwort-Pfad stören. Modul 05
   `ensureSlotStores` + Modul 01 `ensureStore`-Sequenz getrennt untersuchen.
   Branch-Vorschlag `claude/a14-ensureslotstores-race`.
3. **A15 — Zwei-Stufen-Verbinden** (`Spec`+`Bau`, ~1–2 Sitzungen, Klaus' Idee).
   Marktplatz-Einstiegshürde senken: **🔎 nur stöbern/suchen (anonym, keine
   Identität)** ↔ **🌐 voll mitmachen (eigene Identität)**. Erst kurze Spec
   (`docs/PLAN_SEMANTIK_KRYPTO.md` A15 fortschreiben) + Plan an Klaus, dann Bau.
   Berührt das Netz-Anmeldungs-Muster → Skill `saubere-netz-anmeldung` mitziehen.
   Branch-Vorschlag `claude/a15-zwei-stufen-verbinden`.

**Kleinere Folgepunkte** (nicht blockierend): **A11** (Suchergebnis → Frage →
optional Andocken, Kopplung Modul 22 ↔ 23) · **A12** („Antworten: an/aus"-Modell
überdenken — Erreichbarkeit/Reihenfolge/Auto-Toggle).

## Datenverträge / TABU (nicht brechen)
- `PROVIDER_MIN_MATCH` (0.80-Andock-Riegel), `DB_VERSION`, `PROTOCOL_VERSION` bleiben
  unberührt, außer eine Aufgabe verlangt es ausdrücklich (dann Spec-vor-Code + Klaus).
- Kein PII (nur nodeId/Schlüssel/Spore), privater Schlüssel nie ins Repo.
- Kopieren-nicht-klonen: geteilte Module byte-1:1 + Drift-Guard im Smoke.
- Kern-Module 01/02/05/23 werden **benutzt**, nicht umgebaut (außer die Aufgabe ist
  genau das, wie A14 — dann eng abgegrenzt + Smoke + Regressions-frei belegen).

## Akzeptanzkriterien
- Headless-Smoke der berührten Achse grün + Regressions-frei (bestehende Smokes).
- Bei Browser-Pfaden ehrlich „ungeprüft, wartet auf Klaus' Browser-Lauf" markieren,
  bis Klaus es gesehen hat (Erst-mergen-dann-Klaus-sieht-es gilt für getestete,
  abgegrenzte, nicht-zweifelhafte Änderungen).
- `docs/PLAN_SEMANTIK_KRYPTO.md` + `docs/PULS.md` fortgeschrieben.

## Abschluss-Befehl (Kette reißt nie ab)
Am Sitzungsende: PULS + PLAN fortschreiben · Übergabeprotokoll in
`docs/sessions/archiv/` · eigenen getesteten PR selbst mergen (Freibrief) ·
„Nächste Schritte"-Block **im Chat** · **neuen Brief** `docs/sessions/BRIEF_*.md`
anlegen und **vollständig als Codeblock im Chat** ausgeben (Klaus' Tab ist der
Einstieg). Pflichtlektüre + diesen Abschluss-Befehl im neuen Brief wiederholen.

## Offene Fragen an Klaus
- Welche der drei Ziel-Optionen zuerst? (Empfehlung: 1 → 2 → 3.)
- Bei A15: soll „nur stöbern" wirklich **ohne** jede Identität laufen (echt anonym),
  oder eine flüchtige Wegwerf-Identität pro Sitzung? (Richtungsentscheid → erst fragen.)
