# Brief — Spec-Sitzung 18 Tool-PWA-Container (SIEGEL-Anker)

**Anlass:** Klaus' Idee bei Sichttest 17 (2026-05-25): „SIEGEL sollte
einen abgerundeten Container haben, soll später als Tool gestalltete
PWA für das Andocken und Installieren der Sporen gestaltet werden."
Stub-Karte 18 angelegt 2026-05-25 (diese Sitzung, PR #171). Voll-Spec
folgt nach App-Freigabe.

**Pipeline-Stellung:** Spec-Sitzung 18 läuft **NACH App-Freigabe**
(Pipeline-Schritt 6). Endknoten-Re-Migration auf Modul 17 läuft mit
dem aktuellen Standard-SIEGEL-Modal (Modul 16 Sub (c)). Tool-PWA-
Container kommt als Folge-Pflege, wenn die Apps live sind und Klaus
Endnutzer-Feedback sammelt.

**Branch-Vorschlag:** `claude/spec-18-tool-pwa`

**Voraussetzungen:**

- Karte 18 Stub liegt auf `main` (Stub-Anlage 2026-05-25, PR #171
  gemerged).
- Modul 17 ist live + Endknoten-Migration auf Widget abgeschlossen.
- App-Freigabe ist passiert (Pipeline-Schritt 6) — d.h. Klaus hat
  mindestens 5–10 Endnutzer-Sichtproben aus der Praxis.

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung 18)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Spec-Sitzung 18 Tool-PWA-Container (SIEGEL-Anker).
Pipeline-Stellung: NACH App-Freigabe (Pipeline-Schritt 6). KEIN
Modul-Code in dieser Sitzung — Spec-Arbeit allein.

Branch: claude/spec-18-tool-pwa (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md § Heilige Tafeln + § Pipeline-Reihenfolge + § Modul-Tabelle.
2. docs/PULS.md jüngsten Sitzungs-Eintrag „Stub-Anlage Modul 18".
3. docs/components/18_tool_pwa.md KOMPLETT (Stub mit Sub-Bereiche-
   Skizze + offenen Spec-Punkten).
4. docs/components/16_siegel.md § Sub (c) Erklärungs-Modal (das
   ablöst werden soll durch den Tool-PWA-Container).
5. docs/components/17_floating_widget.md § Schnittstelle + § Modal-
   Bridge (SIEGEL-Slot-Klick triggert in Bau 18 statt Modul-16-Modal
   den Tool-PWA-Container).
6. docs/components/02_spore.md komplett (Andock-Operationen +
   Multi-Identität + Backup).
7. docs/components/07_apoptose.md § prepareSelfApoptose +
   confirmSelfApoptose (Self-Apoptose-Geste).
8. index.html § Schwarz-Loch-Karte (Sage-Page-Andock-Wizard als
   modulare Vorlage).
9. docs/PULS.md § Vision-Anker 5 (Identitäts-Container, 2026-05-17)
   — Abgrenzung gegen Modul 18 klären.

Deine Aufgabe:

A. **Karte 18 voll spec-en.** Alle offenen Spec-Punkte aus dem Stub
   final entscheiden:
   - § Sub-Bereiche (a)–(e): welche sind Pflicht-Tabs, welche optional?
   - § Sub (a) Andock-Geste: endknotenMeta-Schema in init(), Modul-03-
     Lazy-Load-Trigger, Zertifizierungs-Pflicht vor Andock?
   - § Sub (b) Sporen-Installation: Anti-Spam-Limit, Pre-Check-UI,
     Cross-Origin-CORS-Hinweis?
   - § Sub (c) Identitäts-Wechsel: Slot-Namen-Schema, Tag-Pflicht?
   - § Sub (d) Backup: Datei-Typ, WebAuthn-Persist?
   - § Sub (e) Self-Apoptose: Per-Persona + global, Experten-Klausel?
   - § Modal-Form: ein Tab-Modal vs. fünf Sub-Modals?
   - § Schnittstelle: Public-Surface final + options-Form final +
     _meta-Read-Anker.
   - § Strikte Tabus: voll ausarbeiten.
   - § Risiken: Mindestens fünf konkrete Risiken + Mitigation.
   - § Manueller Test: zehn Test-Punkte für Panel 18.

B. **INTERFACES.md § 1 Modul 18 voll anlegen** (analog § 1 Modul 17,
   das in Spec-Sitzung 17 verbindlich entstanden ist).

C. **Pipeline-Einordnung in CLAUDE.md § Pipeline-Reihenfolge:** Modul
   18 ist NACH App-Freigabe (Pipeline-Schritt 7? eigene Stufe? oder
   organisch ohne feste Reihenfolge wie Modul 10/11/12?). Klaus
   entscheidet.

D. **Klärungs-Punkt Vision-Anker 5 (Identitäts-Container):** Modul
   18 wird als Vorläufer von Vision-Anker 5 verstanden, oder als
   davon abgegrenzte Wartungs-Schicht? Klaus' Vision-Anker 5 sieht
   eine eigene Identitäts-Container-PWA vor („Rucksack, Safe,
   Chipkarte, Mini-Browser"); Modul 18 ist eingebettete Wartungs-
   Schicht in einer Endknoten-PWA. Spec-Sitzung 18 dokumentiert die
   Abgrenzung.

E. **status.json:** Modul 18 von `score:"schablone"` auf `score:"spec"`
   nach Spec-Fertigstellung; `python3 scripts/update_puls_pie.py`.

F. **CLAUDE.md § Modul-Tabelle:** Eintrag 18 von „Schablone" auf
   „Spec fertig".

G. **Brief Bau-Sitzung 18 anlegen** als
   `docs/sessions/BRIEF_BAU_18_TOOL_PWA.md` mit verbindlichen Bau-
   Anweisungen für eine Folge-Bau-Sitzung.

Was du nicht tust:

- KEIN Modul-Code in `src/modules/18_tool_pwa.js` (Spec-Sitzung, kein
  Bau).
- KEINE Modul-15/16/17-Spec-Änderung (diese sind Tafeln; Modul 18
  baut auf ihnen auf).
- KEINE Endknoten-Sitzung (extern, eigene Folge-Sitzung pro Repo).
- KEINE Sage-Page-Änderung.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump
  (Modul 18 ist nicht protokoll-aktiv).
- KEINE Tafel-Umsortierung CLAUDE.md außer Pipeline-Stellung für
  Modul 18.

Pflicht am Ende:

- Karte 18 voll gefüllt + § Bauzustand-Zeile „Spec gefüllt"
  + Datum + Sitzung.
- INTERFACES.md § 1 Modul 18 voll + Geprüft-Zeile + § 10
  Änderungsprotokoll-Eintrag.
- CLAUDE.md § Modul-Tabelle Eintrag 18 auf „Spec fertig" +
  Pipeline-Stellung dokumentiert.
- status.json Modul 18 auf `score:"spec"`, `python3 scripts/
  update_puls_pie.py`.
- BRIEF_BAU_18_TOOL_PWA.md angelegt.
- PULS.md Sitzungs-Eintrag oben.
- Übergabeprotokoll docs/sessions/archiv/YYYY-MM-DD_spec-18-tool-pwa.md.
- Commit + Push auf claude/spec-18-tool-pwa.
- Draft-PR anlegen.
- „Vorgeschlagene nächste Schritte"-Block im Chat (Bau-Sitzung 18).
- Brief-Codeblock für Bau-Sitzung 18 im Chat ausgeben (Konvention
  CLAUDE.md Pflicht-6).
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Sitzung liest)

### Wann diese Spec-Sitzung sinnvoll ist

**Nach App-Freigabe + nach mindestens 5–10 Endnutzer-Sichtproben.**

Die Tool-PWA-Container-Form sollte aus Endnutzer-Erfahrung entstehen,
nicht aus Spec-Tisch-Mut. Spec-Sitzung 18 läuft also frühestens
~2026-06-Mitte, wenn Klaus seine drei Apps öffentlich verteilt hat und
Feedback bekommen hat: „Wie installiere ich eine fremde Spore?", „Wo
ändere ich mein Backup-Passwort?", „Was passiert wenn ich auf das
goldene Siegel klicke?".

### Abgrenzung gegen Vision-Anker 5 (Identitäts-Container)

Vision-Anker 5 aus PULS § 2026-05-17 sieht einen eigenständigen
Identitäts-Container vor („Rucksack, Safe, Chipkarte, Mini-Browser")
— eine eigene PWA, die mehrere SBKIM-Identitäten halten und zwischen
Endknoten transferieren kann. Modul 18 ist enger gefasst: nur
Wartungs-Schicht **innerhalb** einer Endknoten-PWA, getriggert durch
SIEGEL-Klick.

Spec-Sitzung 18 dokumentiert die Abgrenzung klar — beide können
parallel existieren (Modul 18 als eingebetteter Tool-Schrank, Vision-
Anker 5 als externer Container-Browser). Oder Modul 18 wird zum
Bauteil-Vorläufer für Vision-Anker 5 (UI-Komponenten teilen).

### Klaus-Disziplin: keine Endknoten-Migrations-Blockade

Diese Spec ist **nicht-blockierend** für die Endknoten-Re-Migration.
Die Endknoten kommen mit Standard-Modul-16-Modal live; Tool-PWA-
Container ist eine spätere Aufwertung. Wer Modul 18 nicht braucht,
lässt es weg.
