# BRIEF — Siegel-Inhalt in Mein-Tresor + Jasons-Tresor identisch zu Sage bauen

**Erstellt:** 2026-06-06 · **Typ:** Einbau-/Pflege-Sitzung (externe Repos) ·
**Auslöser:** Klaus' Sichttest 2026-06-06 — die Tresore zeigen im Siegel-Modal
noch den **alten** Stand („Mycel suchend / noch nicht verbunden"), obwohl das
Netz nachweislich verbunden ist (Briefkasten: „3/3 verbunden · alles synchron").

> **Diese Sitzung läuft in ZWEI externen Repos**, nacheinander:
> **Mein-Tresor** und **Jasons-Tresor**. Nicht in Sage-Protokol.
> Der ganze Brief ist so geschrieben, dass die Bau-Sitzung **ohne Rückfrage**
> durchläuft. Wenn etwas fehlt: HALTE AN und schreib die Frage ans Ende der
> jeweiligen Repo-Doku — nicht raten.

---

## Was du baust (Ziel in einem Satz)

Das Siegel beider Tresore soll **inhaltlich identisch zu Sage** sein: dasselbe
Modul 16, dasselbe „SBKIM-Siegel — was bedeutet das?"-Modal, dieselbe
Membran-/Pflicht-Modul-Logik, dieselbe **Mitgliedschafts-Sprache** („im Mycel ·
ruhend / aktiv" statt „suchend / verbunden") und dieselbe **Gold-aus-echtem-
Netz**-Mechanik. **Einziger Unterschied pro Repo:** der Name auf dem Wappen-Band
(self-inscribing — jede Zelle trägt ihren eigenen Namen).

---

## Warum (Kontext, damit du die Entscheidungen verstehst)

Klaus' Korrektur (in Sage umgesetzt, PR #275 + #277):

1. **Mitgliedschaft ≠ Verbindung.** Wer das Siegel trägt, *ist* Teil des
   Mycels (ein Hyphenknoten) — egal wie klein. „Mycel suchend / nicht
   verbunden" ist unlogisch. Was variiert, ist die **Aktivität** (Hyphen-
   Verkehr / Handshakes), nicht „ob verbunden".
   → Text neu: Bronze = **„Im Mycel · ruhend"**, Gold = **„im Mycel · aktiv"**.
   → Aspekt 4 heißt jetzt **„Mycel-Aktivität (erster Hyphen-Verkehr)"**
   (vorher „Mycel-Verbindung etabliert").

2. **Gold aus echter Netz-Lage, nicht aus Tab-Handshake.** Modul 16 schaltet
   nur auf Gold, wenn ein `sbkim:handshake outcome:"established"`-Event feuert —
   RAM-only, nach jedem Reload wieder Bronze. Das misst einen flüchtigen
   Tab-Handshake, nicht die echte Mitgliedschaft. **Lösung ohne Eingriff in
   Modul 16:** die Seite feuert das Gold-Event selbst, sobald ihre eigene
   Briefkasten-/Netz-Prüfung mindestens einen `verified-match`- (oder `live`-)
   Nachbarn bestätigt.

Quelle der Wahrheit (Sage, immer aktuell):
`https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/src/modules/16_siegel.js`

---

## Schritt 1 — Modul 16 verbatim übernehmen

Hol die kanonische Datei aus Sage und **ersetze damit deine vorhandene
Modul-16-Quelle vollständig** — egal ob bei dir:

- eine eigene Datei `src/modules/16_siegel.js`, **oder**
- ein inline `<script>(function(){ … global.SbkimSiegel … })(window)`-Block
  in `index.html` (Single-File-PWA).

Quelle (1:1 kopieren, nichts kürzen):
```
https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/src/modules/16_siegel.js
```

Diese Datei ist **selbst-enthaltend**: das Gold-Wappen ist als `WAPPEN_SVG`-
Konstante inline (keine externe SVG-Datei nötig), Badge + Modal werden vom
Modul selbst gebaut, Bronze/Gold-Texte stehen drin. Du musst **keine** Aspekte-
Texte, Modul-Listen oder Modal-Inhalte separat pflegen — sie kommen mit der
Datei.

Pflicht-Module, gegen die das Siegel beim Boot prüft (müssen wie bisher in
deiner PWA geladen sein — sie sind es schon, sonst hättest du kein Siegel):
`01 Storage · 02 Spore · 03 Embedding (lazy, „deferred" = bestanden) ·
04 Match · 05 Anastomose · 07 Apoptose · 15 Membran`.

---

## Schritt 2 — Wappen-Band auf den eigenen Namen setzen (self-inscribing)

In der kopierten Datei steht **genau eine** Stelle mit dem Sage-Namen auf dem
unteren Wappen-Band (innerhalb der `WAPPEN_SVG`-Konstante):

**Suchen:**
```
>SAGE OBSERVATORIUM</textPath>
```
**Ersetzen durch (je nach Repo):**
- Mein-Tresor → `>MEIN-TRESOR</textPath>`
- Jasons-Tresor → `>JASONS-TRESOR</textPath>`

Nur diese eine Vorkommnis ändern. Sonst nichts am SVG anfassen. Halte den
Namen kurz (Band ist schmal) — Großbuchstaben wie im Original.

---

## Schritt 3 — init-Aufruf prüfen (meist unverändert)

Du rufst Modul 16 schon irgendwo auf. Stelle sicher, dass der Aufruf so aussieht
(Werte pro Repo aus der Tabelle unten):

```js
window.SbkimSiegel.init({
  badgeSelector: '<DEIN-BADGE-CONTAINER>',   // dein bestehender Selektor, NICHT ändern
  repoUrl:       '<DEINE-PAGES-URL>'          // für den Quell-Link im Modal
});
```

- `badgeSelector`: der Container, in den dein Badge schon gemountet wird —
  **lass ihn wie er ist.** Default im Modul ist `.lamps`.
- `repoUrl`: deine GitHub-Pages-URL (siehe Tabelle), damit der „Quelle"-Link im
  Modal stimmt. `null` lassen = Auto-Erkennung (auch okay).
- Reihenfolge: `SbkimSiegel.init()` muss **nach** den Pflicht-Modul-`init()`s
  laufen (wie bisher in deiner Init-Kette).

---

## Schritt 4 — Gold aus echter Netz-Mitgliedschaft (das eigentliche Fix)

Damit dein Siegel nach jedem Reload den **echten** Zustand zeigt (statt wieder
„ruhend"), feuere das Gold-Event, sobald deine **eigene** Briefkasten-/Netz-
Prüfung mindestens einen aktiven Nachbarn bestätigt.

Du hast bereits eine Netz-Prüfung (sie rendert „3/3 verbunden · alles
synchron"). Füge **in deren Erfolgs-Pfad** — dort, wo feststeht, dass ≥ 1
Nachbar `verified-match` **oder** `live` ist — exakt diesen Block ein:

```js
// === SIEGEL: Gold aus echter Mycel-Mitgliedschaft (Sage-Muster, PR #277) ===
// Diese Zelle hat einen bewiesenen Hyphenfaden (verified-match/live-Nachbar)
// -> sie ist nachweislich aktiv im Mycel -> Siegel auf Gold ("im Mycel · aktiv").
// Einmalig + idempotent. Modul 16 ist zu diesem Zeitpunkt schon init'd
// (Netz-Prüfung läuft async, nach der Init-Kette).
if (!window.__siegelGoldFired) {
  window.__siegelGoldFired = true;
  try {
    window.dispatchEvent(new CustomEvent('sbkim:handshake', {
      detail: { outcome: 'established', source: 'netz-stand' }
    }));
  } catch (_e) { /* fail-soft */ }
}
```

**Falls du keinen leicht greifbaren Erfolgs-Pfad hast** (Fallback): lies beim
Laden dein eigenes `sbkim/SIGNAL.json` bzw. die `*_inbox.verify.md`-Lage und
prüfe auf einen `verified-match`-Eintrag; bei Treffer denselben Block feuern.
Kriterium für „aktiver Nachbar": Stufe `verified-match` ODER `live` /
`live-direct` / `live-channel`. (Reine `verified-spore` = Identität ok, aber
noch kein Match → zählt NICHT als aktiv, bleibt Bronze.)

> Wichtig: **Modul 16 nicht patchen.** Es bleibt reines Render-Modul. Nur die
> Seite feuert das Event. So bleibt das Siegel über alle Repos identisch und
> updatebar.

---

## Schritt 5 — Sichttest (Pflicht, im Browser)

Nach Hard-Reload (Cache leeren!) im Tresor:

1. Siegel-Badge öffnen → Modal-Titel „**SBKIM-Siegel — was bedeutet das?**".
2. **Vor** Netz-Prüfung: Bronze-Block sagt **„Im Mycel · ruhend"** + Text
   „…trägt das SBKIM-Siegel und ist damit Teil des Mycels…".
3. **Nach** Netz-Prüfung (3/3 verbunden): Badge-`aria-label` =
   **„SBKIM-Siegel · im Mycel, aktiv"**, `data-stufe="gold"`, Bronze-Block weg.
4. Aspekte-Liste enthält **„Mycel-Aktivität (erster Hyphen-Verkehr)"** (nicht
   mehr „Mycel-Verbindung etabliert").
5. Unteres Wappen-Band zeigt **den eigenen Namen** (MEIN-TRESOR / JASONS-TRESOR).

Schließe die Sitzung mit „Sichttest ungeprüft, wartet auf Klaus" falls du nur
headless prüfen konntest.

---

## Per-Repo-Konfiguration

| Repo | Wappen-Band-Name | repoUrl (Modal-Link) | badgeSelector |
|---|---|---|---|
| **Mein-Tresor** | `MEIN-TRESOR` | `https://lausiklauskn-png.github.io/Mein-Tresor/` | bestehender (Default `.lamps`) |
| **Jasons-Tresor** | `JASONS-TRESOR` | `https://lausiklauskn-png.github.io/Jasons-Tresor/` | bestehender (Default `.lamps`) |

> Namen/URLs vor dem Commit gegen die echten Repo-Pfade prüfen; falls eine
> Pages-URL abweicht, die echte eintragen.

---

## Was du NICHT tust

- **Modul 16 nicht inhaltlich umbauen** — nur verbatim übernehmen + Band-Name.
- **Pflicht-Module nicht anfassen** (01/02/03/04/05/07/15 bleiben wie sie sind).
- **Keine neue Identität / keine Spore-Änderung** — das Siegel ist reines
  Render-Modul (kein Netz, keine Signatur).
- **Sage-Protokol nicht anfassen** — das ist die Quelle, nicht das Ziel.

## Pflicht am Ende (pro Repo)

- Commit + Push auf den im jeweiligen Repo üblichen Branch.
- Kurzer Eintrag in der dortigen Status-/PULS-Doku: „Siegel-Inhalt auf Sage-
  Stand gebracht (Mitgliedschaft + Gold-aus-Netz), Band-Name self-inscribing."
- Wenn beide Tresore fertig sind: in **Sage-Protokol** eine Mini-Pflege-Notiz
  in `docs/PULS.md` (Endknoten-Tabelle / Sitzungs-Eintrag), dass die Tresore
  nachgezogen sind. (Briefkasten-Signal optional.)

---

## Freibrief

Freibrief gilt, siehe `CLAUDE.md § Freibrief` — selbstständig entscheiden/merken
erlaubt, solange logisch, nachvollziehbar und sinnvoll; im echten Zweifel
(mehrdeutig / schwer umkehrbar) erst Klaus fragen; nie stillschweigend.
