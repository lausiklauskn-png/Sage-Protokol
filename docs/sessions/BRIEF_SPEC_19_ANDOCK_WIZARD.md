# Brief — Spec-Sitzung 19 Andock-Wizard (kopierbar)

**Anlass:** Tafel-Spec-Pflege Mycel-Vision 2026-05-26 (PR
`claude/tafel-spec-mycel-vision`) hat die Stub-Karte 19 angelegt
(`docs/components/19_andock_wizard.md`). Klaus' Vision: bestehender
Sage-Page-Andock-Wizard-Code (`index.html` Karte 4, Z. ~969–991) wird
in ein **kopierbares JS-Modul** extrahiert, damit der Externe Mycel-
Hub (siehe [`_mycel_hub.md`](../components/_mycel_hub.md)) den
gleichen Wizard einsetzen kann.

**Pipeline-Stellung:** **Phase B (nach App-Freigabe)** — Pipeline-
Schritt 7 (siehe CLAUDE.md § Pipeline-Reihenfolge nach Tafel-
Erweiterung 2026-05-26).

**Branch-Vorschlag:** `claude/spec-19-andock-wizard`

**Voraussetzungen:**

- Tafel-Spec-Pflege Mycel-Vision (PR `claude/tafel-spec-mycel-vision`)
  ist gemerged → Karte 19 Stub liegt auf `main`.
- Klaus' App-Freigabe ist passiert (Pipeline-Schritt 6).
- Modul 17 + 18 sind live (Endknoten-Re-Migration abgeschlossen).
- Modul 04.C `queryLocal` ist gebaut (kein direkter Block, aber für
  Spore-Discovery-Pre-Check (Sub i in Karte 18) wäre 04.C nützlich).

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung 19)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Spec-Sitzung 19 Andock-Wizard (kopierbar). KEIN
Modul-Code — Spec-Arbeit allein.

Branch: claude/spec-19-andock-wizard (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md § Heilige Tafeln + § Pipeline-Reihenfolge + § Modul-Tabelle.
2. docs/PULS.md jüngsten Sitzungs-Eintrag „Tafel-Spec-Pflege Mycel-Vision".
3. docs/components/19_andock_wizard.md KOMPLETT (Stub mit Sub-Bereiche-
   Skizze + offenen Spec-Punkten).
4. docs/components/_starter_bundle.md (Architektur-Mehrstufe).
5. docs/components/_mycel_hub.md (Hub bettet Modul 19 ein).
6. docs/components/02_spore.md § getOwnSpore + § makeSporeTemplate
   (sobald sie spec'd ist — Bau-Sitzung 02.Z für das Template).
7. docs/components/09_einbau_pwa.md § Schritt 1–3 (Spore-Erzeugung).
8. index.html § Schwarz-Loch-Karte (Z. ~969–991) — Code-Vorlage.

Deine Aufgabe:

A. **Karte 19 voll spec-en.** Alle offenen Spec-Punkte aus dem Stub
   final entscheiden:
   - § Sub-Bereiche (a)–(e): welche sind Pflicht, welche optional?
   - § Sub (a) Drei-Felder-Eingabe + Validierung: genaue Form-Regeln.
   - § Sub (b) Spore-Vorlage erzeugen: makeSporeTemplate-Schema (ohne
     nodeId/publicKey/signature — die werden beim PWA-Boot generiert).
   - § Sub (c) PR-Vorschlag: pre-filled-PR-Body-Form, owner-Auto-
     Erkennung aus URL.
   - § Sub (d) Andock-Hilfe: Verlinkungen auf Karte 09 + Starter-
     Bundle.
   - § Sub (e) Hub-Adressierung: mehrere Hubs gleichzeitig oder nur
     einer?
   - § Modal-Form: eingebetteter Card-Anker vs. Modal.
   - § Schnittstelle: Public-Surface final + options-Form final.
   - § Strikte Tabus: voll ausarbeiten.
   - § Risiken: mindestens drei.

B. **INTERFACES.md § 1 Modul 19 voll anlegen** (analog § 1 Modul 17).

C. **Pipeline-Einordnung in CLAUDE.md § Pipeline-Reihenfolge:** Modul
   19 ist Phase B (nach App-Freigabe), Schritt 7. Klaus genehmigt.

D. **Relation zu Modul 02.** Spec-Sitzung 19 prüft, ob Modul 02
   `makeSporeTemplate()` als eigene Funktion gebraucht wird (Spec-
   Vorbereitung), oder ob der Wizard direkt JSON-Template selbst
   erzeugt (ohne Modul-02-Aufruf).

E. **status.json:** Modul 19 von `score:"schablone"` auf `score:"spec"`
   nach Spec-Fertigstellung; `python3 scripts/update_puls_pie.py`.

F. **CLAUDE.md § Modul-Tabelle:** Eintrag 19 von „Schablone" auf
   „Spec fertig".

G. **Brief Bau-Sitzung 19 anlegen** als
   `docs/sessions/BRIEF_BAU_19_ANDOCK_WIZARD.md` mit verbindlichen
   Bau-Anweisungen.

Was du nicht tust:

- KEIN Modul-Code in `src/modules/19_andock_wizard.js` (Spec-Sitzung).
- KEINE Modul-02-/17-/18-Spec-Änderung (Tafeln).
- KEINE Sage-Page-Änderung (`index.html` wird nur als Code-Vorlage
  referenziert, nicht modifiziert).
- KEINE Endknoten-Sitzung.
- KEIN PROTOCOL_VERSION-/DB_VERSION-Bump.

Pflicht am Ende:

- Karte 19 voll gefüllt + § Bauzustand-Zeile „Spec gefüllt".
- INTERFACES.md § 1 Modul 19 voll + § 10 Änderungsprotokoll.
- CLAUDE.md § Modul-Tabelle Eintrag 19 auf „Spec fertig".
- status.json Modul 19 auf `score:"spec"`, Pie regeneriert.
- BRIEF_BAU_19_ANDOCK_WIZARD.md angelegt.
- PULS.md Sitzungs-Eintrag oben.
- Übergabeprotokoll docs/sessions/archiv/YYYY-MM-DD_spec-19-andock-wizard.md.
- Commit + Push auf claude/spec-19-andock-wizard.
- Draft-PR anlegen.
- „Vorgeschlagene nächste Schritte"-Block im Chat.
- Brief-Codeblock für Bau-Sitzung 19 im Chat ausgeben.
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Sitzung liest)

### Warum extrahieren (nicht Sage-Page kopieren)

Bestehender Wizard-Code in `index.html` ist Sage-Page-spezifisch:
- Inline-JS in der HTML-Datei (keine Modul-Trennung).
- Hartcodiert auf `lausiklauskn-png/Sage-Protokol`-PR-URL.
- Theme-CSS direkt mit Sage-Page-Variablen.

Externer Mycel-Hub will:
- Eigenes Repo (`<owner>/sbkim-hub`).
- Eigene `status.json` als PR-Ziel.
- Eigenes Theme.

Lösung: Wizard als **kopierbares Modul** mit Mount-Anker + Konfig-
Optionen.

### Was nach dieser Spec-Sitzung kommt

- **Bau-Sitzung 19** (`src/modules/19_andock_wizard.js` + Panel 19 in
  `tests/manual_check.html` + Headless-Smoke).
- **Starter-Bundle-Repo-Anlage** (siehe `_starter_bundle.md`).
- **Externer Mycel-Hub-Repo-Anlage** (siehe `_mycel_hub.md`) mit
  eingebettetem Modul 19.
- **Pepo Semantic Match Demo + Muttis Rezeptbuch via Starter-Bundle
  integrieren** (Phase C).
