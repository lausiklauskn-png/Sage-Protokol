# BRIEF — Netzweiter App-Stand + „Sage: Demo → real funktionierendes Protokoll"

**Für die Nachfolge-Sitzung. Geschrieben 2026-07-22 (Klaus' Auftrag). Sage ist der
Hub — darum liegt dieser netzweite Brief hier.**

> Freibrief gilt (siehe `CLAUDE.md § Freibrief`): selbstständig bauen/merken/mergen,
> solange logisch, nachvollziehbar, nützlich; echtes Zweifeln → erst Klaus fragen;
> nie stillschweigend. Selbst-Merge netzweit (Klaus 2026-06-28). Klaus' Browser-
> Sichttest bleibt der letzte Beweis — headless ersetzt ihn nicht.

---

## 0. Pflichtlektüre zuerst (in dieser Reihenfolge)

1. `CLAUDE.md` (Sage) — Verfassung, Freibrief, „von origin/main frisch abzweigen".
2. `docs/PULS.md` — aktueller Stand.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — die lebende A/B-Abhak-Liste (Kern dieses Briefs).
4. `status.json` — ehrlicher Real-Anteil je Knoten.
5. Für die jeweils angefasste App: deren `CLAUDE.md` + Code der Scheibe.

**Sitzungsstart-Pflicht:** `bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"`
und für JEDES Repo, das du anfasst, erst `git fetch origin && git checkout -B <branch>
origin/main` — die Container-Klone sind oft Monate alt.

---

## 1. Was diese Sitzung (2026-07-22) erledigt hat — Ausgangslage

Reiner Icon-/Emoji-Rollout, alles gemergt:
- **Private Brain**: neues Synapsen-App-Icon + Favicon; Empty-State-Emoji
  (`catalog-emblem.png`) zweifach überarbeitet → am Ende **scharf freigestellt, ohne
  Glow, kleinere Pillen mit Abstand** (Vektor-Masken-Cutout). SW v45→v48.
- **Tomys Hub**: neues Icon (blaues 3D-T) in `icons/icon-192/512.png`; Unter-Apps +
  family-projekt.de ziehen automatisch mit; zusätzlich **in-App-Kopfzeile** (🎨-Emoji →
  echtes Icon). SW v27→v29.
- **Mein-Mixarium**: neues Flaschen-Icon (Datei + SVG + 12 inline PWA-Icon-Links,
  QC⇄index byte-identisch); **Intro-Animation** zeigt jetzt das Icon statt 🍹. SW v76→v78.
- **Mein-Mixarium-Page** + **Mein-Rezeptbuch-Page**: Icons ersetzt (Flasche bzw.
  eigenes Buch-Icon). **SB-KIMTool-Point**: Marktplatz-Karten zeigen App-Icons.

**Alle Browser-Sichttests dieser Icon-Runde stehen formal noch aus** (Klaus prüft
laufend am Tablet, bisher grün gemeldet für PB-Emoji).

---

## 2. HAUPTZIEL — Sage: „Demoversion → real funktionierendes Protokoll"

Das ist Klaus' Kernwunsch. Zerlegt in konkrete, abhakbare Schritte. Reihenfolge = Vorschlag.

### 2.1 Ist-Stand ehrlich feststellen — Test + Bestandsaufnahme (zuerst!)
- **Sage-Testlauf** headless komplett fahren: alle `tests/smoke_*.mjs` + `node --test`.
  Ergebnis wahrheitsgemäß notieren (grün/rot je Suite). Nicht „grün" melden ohne Lauf.
- **Was ist noch „Demo"?** In `status.json` haben mehrere Knoten `_demo`-`domainVector`
  bzw. `matchScore: null` (aktuell u.a. **BookLedgerPro, Tomys Hub, Private Brain**).
  → Liste aller Knoten mit Demo-Vektor / offenem Match erstellen. Das ist die Messlatte
  für „real": ein Knoten ist erst „real", wenn sein `domainVector` aus einem **echten
  Embedding** (multilingual-e5-small, L2=1) stammt und der Cross-Knoten-Cosinus zu Sage
  + Nachbarn **berechnet + reziprok signatur-verifiziert** ist (nicht `null`, nicht `_demo`).

### 2.2 Simulationen bauen (Klaus' ausdrücklicher Wunsch)
Ziel: das Protokoll **headless beweisen**, ohne für jeden Schritt Klaus' Browser + das
echte Relay zu brauchen — damit die offenen Punkte schnell durchgetestet werden können.
- **Multi-Knoten-Simulation** (mehrere Knoten in einem Node-Prozess, Mock-Relay wie in
  `smoke_bau23_rendezvous.mjs`): N Knoten melden sich im Rendezvous-Raum an (Modul 23),
  finden sich, handshaken (Modul 05), stellen sich gegenseitig Fragen (Modul 04.C
  `queryLocal` + 23b Query) und antworten aus ihrem Korpus. Prüfen: `outcome:
  "established"`, korrekte 0.80-Riegel-Trennung, Antwort-Treffer > Schwelle.
- **Hub-unabhängige Simulation** nachstellen (der 2026-07-11-Meilenstein: Endknoten fragen
  sich gegenseitig ohne Sage). Als reproduzierbaren Regressionstest festschreiben.
- **Härtungs-Fälle** aus der A2/A3-Historie als Sim-Fälle sichern (Antworter-Vorwärmen,
  Frage-Timeout, saubere Sporen, newest-per-name im Raum), damit sie nicht zurückfallen.
- Ergebnis: eine `tests/sim_*.mjs`-Familie, die das Protokoll-Verhalten netzweit abbildet.
  **Ehrlich markieren:** Sim ≠ Live — das echte Relay + Hintergrund-Drosselung bleibt
  Klaus' Browser-Beweis.

### 2.3 Offene A/B-Punkte abarbeiten (aus `docs/PLAN_SEMANTIK_KRYPTO.md`)
In sinnvoller Reihenfolge; jeder Punkt = eigene abgegrenzte Aufgabe + eigener Commit:
- **A14 — ensureStore-/ensureSlotStores-Race (Modul 05/01) beheben** · echter Bug-Befund
  2026-07-11 · ⏱ ~1 Sitzung. **Zuerst**, weil Stabilitäts-Fundament fürs Protokoll.
- **A11 — Such-Ergebnis → Frage → optional Andocken** (Marktplatz-Kopplung Modul 22↔23) ·
  Spec+Bau · ⏱ ~1–2 Sitzungen. Schließt die Lücke Suche → Netz-Andocken.
- **A12 — „Antworten: an/aus"-Modell überdenken** (Erreichbarkeit/Reihenfolge/Auto-Toggle)
  · Spec. Verbessert die reale Erreichbarkeit im Live-Betrieb.
- **A15 — Zwei-Stufen-Verbinden: Stöbern (anonym) ↔ Voll mitmachen (Identität)** · Spec+Bau.
- **A18 — Kanonischen Siegel-Andock-Wizard (`assets/siegel-inhalt.js`) netzweit ausrollen**
  · ⏱ ~1 Sitzung/Repo. (Siehe Skill `status-leiste-siegel`.)
- **B6 — E2E Grad C: versiegelter Umschlag** · der eigentliche „real"-Krypto-Baustein
  (echte Ende-zu-Ende-Verschlüsselung der Nutzlast, nicht nur Pseudonymisierung B5). ⏱ ~2–3
  Sitzungen. Entscheidung Protokoll-Bump ja/nein zuerst.
- **B4 — Widget-Tresor „Increment 2 B"** · sicherheits-sensibel, eigene Sitzung.
- **A5b** (optional) — Multi-Query auch in der Pinnwand · ⏱ ~30 Min, nur bei Bedarf.

> Nutzbare Skills für diese Arbeit: `saubere-netz-anmeldung` (Identität/Spore/Anmeldung),
> `status-leiste-siegel` (Siegel + Andock-Wizard), `verschluesselter-schluessel-tresor`
> (BYOK-Schlüssel at-rest), `geraetename` (Knoten unterscheidbar machen).

---

## 3. Muttis-Rezeptbuch auf den neuesten Stand bringen

**Befund 2026-07-22:** Muttis-Rezeptbuch (`origin/main`, v9.2) hat zwar Theme (iridescent)
+ Hardreload-Knopf, aber **KEIN SBKIM** — kein `sbkim/`-Verzeichnis, keine `status.json`,
kein Spore. Mein-Rezeptbuch (der öffentliche Klon) trägt die volle SBKIM-Integration.

**Offene Entscheidung an Klaus (erst fragen — architektonisch):**
- Soll Muttis-Rezeptbuch ein **vollwertiger eigener SBKIM-Knoten** werden (wie
  Mein-Rezeptbuch), oder bewusst **privat/kein Knoten** bleiben?
- Wird es Knoten: **eigene Identität + eigener DB-Suffix** (NICHT derselbe wie
  Mein-Rezeptbuch — sonst geteilte-Origin-Kollision, siehe Widget-Kollision 2026-07-11 +
  Skill `saubere-netz-anmeldung`). Eigenes `sbkim/spore.json`, eigener Briefkasten,
  eigener Eintrag in Sage `status.json` + `sage-knoten-korpus.js`.
- Dann Modul-Rollout byte-1:1 aus Mein-Rezeptbuch/Sage (Module 00–08, 15–17, 23,
  Siegel-Wizard A18), Drift-Guard grün.

**Unabhängig davon — Parität mit Mein-Rezeptbuch verifizieren** (grep-Vergleich beider
`index.html` auf `main`): neues Buch-Icon (Muttis mit rotem Rand), iridescent-Lesbarkeit
(app-name/nav/overlay-heads dunkel), Hardreload, Navigations-/Feature-Gleichstand. Fehlt
etwas, gezielt nachziehen (Muttis nutzt `build.py`: QC ändern → `python3 build.py`).

---

## 4. Netzweite App-Pflege — „alle aktuellen Apps aktuell + verbessern"

- **Icon-Rollout-Kontrolle:** prüfen, dass ALLE Apps + Pages + Marktplatz die neuen Icons
  zeigen (diese Sitzung: PB, Tomy, Mixarium, die zwei Pages, Marktplatz). Sichttest-Liste
  für Klaus zusammenstellen (Hard-Reload je Seite).
- **Hardreload-Knopf-Parität:** überall vorhanden? (Frühere Runde hat die meisten Apps
  bestückt; Mein-WorkFloh war der Nachzügler — verifizieren, dass keiner fehlt.)
- **Fremdnutzer-/Marktplatz-Brille (CLAUDE.md-Pflicht):** je App durchgehen — fail-soft für
  Fehlendes (kein Schlüssel/Mikro/Modul → App läuft weiter, kein toter Knopf), Kosten/
  Datenabfluss klar benannt, app-spezifische localStorage-Suffixe (geteilte github.io-
  Origin), offline-first. Das ist die Vorlage für den family-projekt.de-Marktplatz.
- **Briefkasten-Sync (§11.6):** bei Andock-Bezug SIGNAL.json der Peers lesen, quittieren,
  eigenes `seq` pflegen — das Pushen IST das Signal.

---

## 5. Sichttest-Liste für Klaus (Browser, Tablet — nach dem Bauen)

Jeweils **Hard-Reload** (Strg+Umschalt+R):
- Private Brain: Empty-State-Synapse klein + luftig, App-Icon/Favicon neu.
- Tomy (+ workfloh/bookledger): blaues T im Tab + in der Kopfzeile.
- Mixarium: Intro zeigt Flaschen-Icon; Tab/Install-Icon neu.
- Mixarium-Page / Rezeptbuch-Page: Hero-/Kopf-Icon (Flasche bzw. Buch).
- (Nach Sage-Arbeit) Cross-Knoten-Suche live an zwei Geräten prüfen.

---

## 6. Abschluss-Pflicht dieser Nachfolge-Sitzung (Kette reißt nie ab)

1. `docs/PULS.md` fortschreiben (getan/offen/nächstes); bei `status.json`-Änderung vorher
   `python3 scripts/update_puls_pie.py`.
2. Erledigte A/B-Punkte in `docs/PLAN_SEMANTIK_KRYPTO.md` abhaken (`[ ]`→`[x]` + Datum).
3. Übergabeprotokoll in `docs/sessions/archiv/`.
4. **Neuen Brief** für die Folge-Sitzung schreiben + **vollständig als Codeblock im Chat**
   ausgeben (Klaus liest zuerst den Chat).
5. „Nächste Schritte"-Block (2–4 priorisierte Punkte) direkt in der Chat-Antwort.
6. Commit + Push je abgegrenzter Aufgabe; eigene PRs selbst mergen (Freibrief), sobald
   getestet + abgegrenzt + nicht zweifelhaft.

**Empfohlener Einstieg:** 2.1 (Test + Demo-Bestandsaufnahme) → 2.2 (Simulationen) →
A14 (Bug) → dann die übrigen A/B-Punkte + Muttis-Entscheidung an Klaus.
