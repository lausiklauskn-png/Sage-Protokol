# Modul 18 — Tool-PWA-Container (SIEGEL-Anker)

> **Status:** 🟫 Schablone (2026-05-25, Brief-Anlage Spec-Sitzung 18) ·
> Tool-PWA-Backlog · **Priorität mittel** (nach Endknoten-Re-Migration
> + App-Freigabe, vor Schutz-Backlog Modul 11/12/10)  ·  **Schicht:**
> Wartungs- + Andock-Schicht für Endknoten-PWAs, getriggert durch
> Klick auf SIEGEL-Slot im Floating-Widget (Modul 17)
> **Datei (Code):** `src/modules/18_tool_pwa.js` (existiert noch nicht
> — Spec-Sitzung 18 fällt in eigener Sitzung nach App-Freigabe)

---

## Im Mycel-Bild

Wenn das SBKIM-Siegel auf einer Endknoten-PWA leuchtet, hat sich die
Hyphe als zugehörig zum Mycel bezeugt. Ein Klick auf das Siegel öffnet
einen **Tool-Schrank** an der Hyphe: drinnen liegen alle Werkzeuge, die
ein Knoten zur Selbstpflege braucht — Andock-Geste, Sporen-Installation,
Identitäts-Wechsel, Backup, Selbstlöschung. Der Schrank ist nicht das
Mycel und auch nicht der Pilz selbst — er ist die **Wartungs-Schicht**,
sichtbar an einem klar erkennbaren Anker (Siegel-Klick).

## Vokabular

- **Tool-PWA-Container** — Wartungs- + Andock-Modal-Suite, die per
  Klick auf den SIEGEL-Slot (Modul 17) geöffnet wird. Ersetzt das
  schmale Sub-(c)-Erklärungs-Modal von Modul 16 durch einen tiefer
  geführten Wizard-artigen Container.
- **Self-Inscribing-Tool** — Tool, das die Selbst-Bezeugung sichtbar
  und bedienbar macht. Klaus-Festlegung 2026-05-25: SIEGEL ist nicht
  nur Status-Anzeige, sondern auch **Aktions-Anker**.
- **Wartungs-Aktion** — eine der Operationen, die im Tool-PWA-
  Container ausgelöst werden können (siehe § Sub-Bereiche unten).
- **Andock-Anker** — die Geste, die die PWA zum SBKIM-Knoten macht
  (Identität + Spore + erste Anastomose). Analog Sage-Page-Andock-
  Wizard (siehe `index.html` § Schwarz-Loch-Karte).

## Warum jetzt (Hochstufungs-Begründung)

Klaus' Idee bei Sichttest 17 (2026-05-25): „SIEGEL sollte einen
abgerundeten Container haben, soll später als Tool gestalltete PWA
für das Andocken und Installieren der Sporen gestaltet werden". Damit
wandert Funktionalität, die bisher Sage-Page-spezifisch war (Andock-
Wizard, Identitäts-Container-Vision-Anker 5), in einen Endknoten-
einheitlichen Container, der via SIEGEL-Klick erreichbar ist.

Vorerst eine Idee — Endknoten-Re-Migration mit Standard-Modul-16-Modal
ist OK, der Tool-PWA-Container kommt **nach App-Freigabe** als Pflege.

---

## Zweck (knapp, Spec-Vorbereitung)

Der Tool-PWA-Container kapselt **Wartungs-Aktionen** einer SBKIM-Endknoten-
PWA in einem klar geführten UI:

1. Endknoten-Bauer muss kein eigenes Wartungs-UI schreiben.
2. Forker bekommen mit drei Zeilen Einbau (Modul 17 Widget + Modul 18
   Tool-PWA) ein voll bedienbares SBKIM-Toolset.
3. Endnutzer hat **eine** klar erkennbare Geste (Klick auf SBKIM-
   Siegel) für alle Wartungs-Operationen — keine versteckte 5-Klick-
   Geste, keine DevTools-Konsole.

---

## Sub-Bereiche (Spec-Skizze, offen)

Diese Liste ist eine **Vorschlags-Skizze** — die volle Spec-Sitzung 18
entscheidet, welche Sub-Bereiche Pflicht-Bestandteil sind und welche
optional bzw. konfigurierbar.

### Sub (a) — Andock-Geste

Identität erzeugen (`SbkimSpore.getOrCreateIdentity`), Spore generieren
(`SbkimSpore.generateOwnSpore` + Modul 03 lazy-load), erste Anastomose-
Probe (`SbkimAnastomose.handshake`). Sichtbar wie der Sage-Page-Andock-
Wizard (`index.html` § Schwarz-Loch-Karte), aber als modulares Tool.

**Offene Spec-Punkte:**

- Endknoten-Bauer muss `endpoint` + `domain` + `domainKeywords` + ggf.
  `stammCategories`/`guestCategories` in `init({…})` mitgeben — wie?
- Wer triggert das Embedding-Modell-Lazy-Load (~30 MB Modul 03)?
- Soll der Andock-Wizard bei nicht-zertifiziertem Modul 16 angezeigt
  werden, oder erst nach Zertifizierung?

### Sub (b) — Sporen-Installation (fremde Spore importieren)

Ein Endnutzer kann eine fremde `spore.json` per Datei-Upload oder URL-
Eingabe installieren (als Sibling im aktuellen Slot). Verify via
`SbkimSpore.verifyForeignSpore`, danach `SbkimAnastomose.handshake` mit
der fremden Spore.

**Offene Spec-Punkte:**

- Cross-Origin-Spore-Fetch braucht CORS-Erlaubnis am fremden Knoten —
  Hinweis-Text im UI wenn Fetch fehlschlägt?
- Anti-Spam: wie viele fremde Spores darf ein Nutzer pro Session
  installieren? Default 5? Konfigurierbar?
- Pre-Check: zeigt die fremde Spore vor dem Handshake — Klaus' Bestätig-
  Klick als Pflicht?

### Sub (c) — Identitäts-Wechsel (Multi-Identität, Brief 04)

Liste aller Identitäts-Slots (`SbkimSpore.listIdentities`), Anzeige
des aktiven Slots, Drop-Down zum Wechsel (`SbkimSpore.setActiveIdentity`),
Knopf „Neue Identität erzeugen". Bei aktivem Slot-Wechsel: Modul-05-
Receiver-Map-Reset-Hinweis (Tab-Reload empfohlen, Karte 02 § Risiken).

**Offene Spec-Punkte:**

- Sollen Slot-Namen frei wählbar sein oder aus einer Liste?
- Soll ein Slot-Tag (Persönlich/Beruflich/Sonstiges) Pflicht sein
  für UX-Klarheit?

### Sub (d) — Backup-Export + -Import

Knöpfe „Backup exportieren" (`SbkimSpore.exportBackup(password)` →
Datei-Download) und „Backup importieren" (`SbkimSpore.importBackup`).
Passwort-Eingabe via `<input type="password">`-Feld. Sichtbarer
Hinweis: „Verwahre das Backup sicher; ohne Passwort kein Zugriff."

**Offene Spec-Punkte:**

- Soll das Backup-Passwort persistiert werden (z.B. WebAuthn)? Oder
  jedes Mal neu eingeben?
- Welcher Dateityp `.sbkimbackup` oder generisches `.json`?

### Sub (e) — Self-Apoptose (irreversibel)

Globale Self-Apoptose-Geste analog Sage-Page (`SbkimApoptose.prepareSelfApoptose`
+ `confirmSelfApoptose`, 60-s-Token-Bestätigung, Vermächtnis-Versand an
alle Geschwister). Achtung-Block: irreversibel.

**Offene Spec-Punkte:**

- Per-Persona-Apoptose (Modul 02 `removeIdentity`) auch erreichbar?
- Soll die Self-Apoptose vor der App-Freigabe sichtbar sein, oder
  hinter einer Experten-Klausel verborgen?

---

## Modal-Form (Spec-Vorbereitung)

Skizze: ein voll-Bildschirm-overlay (oder min(720×80vh, viewport))
mit Tab-Navigation oben — fünf Tabs für die fünf Sub-Bereiche. Jeder
Tab ist eigenes Sub-Modal (oder Sub-Pane innerhalb des Containers).
Schluss-Knopf unten-rechts.

**Spec-Punkte:**

- Container als eigenes Sub-Modal pro Sub-Bereich, oder als ein einziges
  großes Tab-Modal? Komplexität vs. Übersicht.
- Theme: übernimmt die PWA-Theme-CSS-Variablen analog Modul 17.

---

## Schnittstelle (Spec-Skizze)

```js
window.SbkimToolPwa = {
  init: function (options) { /* Promise<void>, idempotent */ },
  open: function (subBereich?) { /* öffnet Container, optional spezifischer Tab */ },
  close: function () { /* schließt Container */ },
  isOpen: function () { /* boolean */ },
  _meta: { /* Read-Anker */ },
};
```

**options-Form (Spec-Vorbereitung):**

```js
{
  endknotenMeta: {
    domain: string,
    endpoint: string,
    domainKeywords: string[],
    stammCategories?: string[],
    guestCategories?: string[],
  },
  // Welche Sub-Bereiche aktiv sind. Default: alle fünf.
  enabledTabs?: ("andock"|"installieren"|"identitaet"|"backup"|"apoptose")[],
  // SBKIM-Siegel-Slot triggert open() automatisch?
  bindToSiegelSlot?: boolean,  // Default true
  theme?: "auto" | "dark" | "light" | "transparent",
}
```

---

## Strikte Tabus (Spec-Vorbereitung)

- **KEINE eigene Identität.** Modul 18 ist Render-/Wartungs-Schicht —
  ruft Modul 02 für alle Identitäts-Operationen.
- **KEINE Modul-Vorgaben.** Modul 18 ist optional; ein Endknoten kann
  ihn weglassen, dann öffnet SIEGEL-Klick das Modul-16-Sub-(c)-Modal
  wie bisher (Fallback).
- **KEIN automatisches Andock-Triggern.** Nur auf explizite Geste
  (Knopf-Klick im Container).
- **KEIN Backup-Passwort-Persist.** UX-Pflicht: User merkt sich
  Passwort selbst.
- **KEIN Auto-Confirm bei Self-Apoptose.** 60-s-Token-Bestätigung
  Pflicht.
- **KEIN Bypass für Anti-Greenwashing-Klausel.** Modul 18 prüft, ob
  Modul 16 (Siegel) zertifiziert ist, bevor der SIEGEL-Slot ihn
  triggert.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-25 | Stub-Anlage Modul 18 | Klaus' Idee bei Sichttest 17 (2026-05-25): SIEGEL soll später als Tool-PWA-Container für Andocken + Sporen-Installation gestaltet werden. Diese Karte ist Vorbereitungs-Spec mit Vokabular + Sub-Bereiche-Skizze + offenen Spec-Fragen. Volle Spec-Sitzung 18 folgt nach App-Freigabe (Pipeline-Schritt 6) und entscheidet die offenen Punkte. Brief: `docs/sessions/BRIEF_SPEC_18_TOOL_PWA.md`. |
| Spec gefüllt | — | Spec-Sitzung 18 | folgt — alle Sub-Bereiche final entscheiden + Schnittstelle festlegen + Modal-Form klären. |
| Code geschrieben | — | Bau-Sitzung 18 | folgt — `src/modules/18_tool_pwa.js` + CSS + Panel 18 in `tests/manual_check.html` + Headless-Smoke. |
| In Endknoten eingebaut | — | Endknoten-Folge-Sitzungen | folgt — Modul 18 in Mein-Rezeptbuch / Mein-Mixarium kopieren + `init()`-Aufruf. |

---

**Querverweise**

- **Abhängigkeiten:** Modul 02 (Spore, Andock + Identitäts-API +
  Backup) · Modul 03 (Embedding, lazy beim Andock) · Modul 04 (Match,
  für Sporen-Installation-Pre-Check) · Modul 05 (Anastomose, Andock-
  Handshake) · Modul 07 (Apoptose, Self-Löschung) · Modul 16 (SBKIM-
  Siegel, Anti-Greenwashing-Klausel) · Modul 17 (Floating-Widget,
  SIEGEL-Slot-Klick triggert `SbkimToolPwa.open()`).
- **Wird genutzt von:** Endknoten-PWAs als Endnutzer-Wartungs-UI ·
  Forker als Standard-Toolset (sechs Zeilen Einbau Modul 17 + Modul 18
  statt eigenes Wartungs-UI schreiben).
- **Verwandt:** Sage-Page-Andock-Wizard (`index.html` § Schwarz-Loch-
  Karte) — Modul 18 ist die modulare Variante davon · Vision-Anker 5
  (Identitäts-Container Rucksack/Safe/Chipkarte, `docs/PULS.md` 2026-05-17)
  — Modul 18 könnte Vorläufer dafür sein, oder davon abgegrenzt
  bleiben (Spec-Sitzung 18 entscheidet).
