# Modul 16 — SBKIM-Siegel

> **Status:** 🟫 Stub (angelegt 2026-05-24) · Siegel-Backlog · **Priorität hoch** (vor App-Freigabe)  ·  **Schicht:** Selbst-Bezeugung der PWA-Zelle nach erfolgter Integration der SBKIM-Pflicht-Module  ·  **Anker:** Sage-Page Karte 4 / 13 / 14 als zusätzlicher Backlog parallel zu Schutz / Diffusion / Membran, plus Badge-Anker im Header der jeweiligen PWA

---

## Im Mycel-Bild

Ein Pilz, der gewachsen ist, zeigt seinen Fruchtkörper. Das Mycel
darunter ist die eigentliche Arbeit — verborgen, weit verzweigt,
funktional. Der Fruchtkörper ist die **Sichtbarmachung**: er sagt,
„hier hat ein Pilz gelernt, sich selbst zu erkennen". Das SBKIM-Siegel
ist diese Sichtbarmachung für eine PWA-Zelle: nach erfolgter
Integration der Pflicht-Module **bezeugt sie sich selbst** und zeigt
das nach außen.

## Vokabular

- **SBKIM-Siegel** — Selbst-Zertifikat einer PWA-Zelle, das sie sich
  beim Boot ausstellt, wenn die Pflicht-Module-Surface vorhanden ist.
  Kein zentraler Aussteller, kein CI-Build-Check.
- **Self-Inscribing** — Selbst-Bezeugung. Die App prüft beim Boot, ob
  die Pflicht-Module geladen sind, und stellt sich das Siegel selbst
  aus. Vertrauen kommt vom Repo-Reputation, nicht von einer
  Zertifizierungs-Autorität.
- **Lebendes Dokument** — die Erklärung hinter dem Siegel wächst
  organisch: jedes Sicherheits-Update ergänzt einen Aspekt mit
  Datum. Das Siegel altert nicht, es wächst.
- **Anti-Greenwashing-Klausel** — kein Siegel ohne erfüllte
  Selbst-Prüfung. Wenn ein Pflicht-Modul fehlt oder fehlerhaft lädt,
  KEIN Badge-Render. Disziplin, keine Marketing-Plakette.

## Warum jetzt (Hochstufungs-Begründung)

Klaus plant die öffentliche Freigabe seiner PWAs (Mein-Mixarium,
Mein-Rezeptbuch, Sage-Protokol). Forker und Nutzer brauchen ein
sichtbares Vertrauens-Signal: „diese App ist nicht nur funktional,
sondern SBKIM-fähig." In einem dezentralen Netz ohne Zertifizierungs-
Autorität ist self-inscribing der einzige Pfad, der nicht zentralisiert
und nicht skalierungs-blockiert ist.

Der Trade-off mit dem Schutz-Backlog (Modul 10 / 11 / 12) ist bewusst:
das Siegel bestätigt zur Freigabe-Zeit den Grundbaukasten (01–08 + 15),
nicht den Voll-Schutz. Die Erklärung wächst danach organisch — sobald
Modul 11 oder 12 dazukommt, ergänzt ein neuer `ZERTIFIKAT_ASPEKTE`-
Eintrag den Text. Forker müssen nicht re-andocken: pro PWA-Lauf
aktualisiert sich das Siegel selbst.

## Vier Sub-Bereiche (Anker für Spec-Sitzung 16)

### Sub (a) — Selbst-Prüfung (Pflicht-Modul-Liste)

Welche Module gelten als **Pflicht** für das Grund-Siegel?

**Anker-Vorschlag (Spec-Sitzung entscheidet):**

- Modul 01 (Storage) — IndexedDB-Wrapper. Pflicht (Foundation).
- Modul 02 (Spore) — Ed25519-Identität. Pflicht (Identitäts-Anker).
- Modul 03 (Embedding) — Vektor. Pflicht (Match-Voraussetzung).
- Modul 04 (Match) — Threshold-Vergleich. Pflicht (Anastomose-Voraussetzung).
- Modul 05 (Anastomose) — Handshake. Pflicht (Netz-Teilnahme).
- Modul 07 (Apoptose) — Selbstlöschung. Pflicht (Lebenszyklus).
- Modul 15 (Membran Sub (e)) — Fremdzugriff-Lampe. Pflicht (Außen-Schicht).

**Nicht Pflicht für Grund-Siegel (kann später):**

- Modul 00 (Doku-Fenster) — UI-Feature, nicht protokoll-aktiv.
- Modul 04.B (`explainMatchLLM`) — braucht API-Key, individuelle
  Entscheidung pro PWA.
- Modul 06 (Heterokaryose) — Opt-In, nicht jeder Knoten will Anker-
  Tausch.
- Modul 08 (UI-Demo) — Endknoten-Pflege-UI, optionale Schicht.
- Modul 10 / 11 / 12 (Schutz-Backlog) — werden mit Aspekten ergänzt,
  sobald sie kommen.

**Pflicht-Prüfung-Form**: Modul 16 prüft beim Boot, ob für jedes
Pflicht-Modul der globale Namensraum besteht UND eine definierte
Pflicht-Funktion existiert (z.B. `window.SbkimSpore.getOwnSpore`).
Wenn ein einziger Check fehlschlägt → **kein Siegel-Render** + ein
ehrlicher Warnungs-Eintrag in der Konsole (`console.warn`).

### Sub (b) — Badge-Rendering

**Anker-Form (Spec-Sitzung entscheidet):**

- DOM-Anker: `#sbkim-cert-badge` (CSS-Selektor, konfigurierbar pro
  PWA via `init({badgeSelector})`).
- Default-Position: neben den drei Navleisten-Lampen (LEBT / VERKEHR
  / FREMD) — als vierte Plakette mit Schriftzug `SBKIM-Siegel` oder
  einem definierten Glyph.
- Sichtbarkeits-Modi (per `init({visible})`):
  - `"visible"` (Default für Sage-Page + Endknoten): sichtbares
    Badge mit Klick-Handler.
  - `"hidden"` (für Tool-Apps mit eigenem Design-Wunsch): kein DOM-
    Render, aber Siegel-API erreichbar (`SbkimSiegel.isCertified()`,
    `SbkimSiegel.getExplanation()`).

**Optische Anforderung — Auszeichnungs-Stil (Klaus-Vorgabe 2026-05-24):**

Das Siegel soll **wie eine Auszeichnung wirken**, NICHT wie ein
billiger Marketing-Sticker. Referenzen sind klassische Qualitäts-
Siegel:

- **Prädikatswein-Plaketten** (Kabinett / Spätlese / Auslese /
  Beerenauslese): zentrierter Schriftblock, klassische Antiqua-
  Schrift, Rahmen mit Wappen-Anmutung, Datum unten klein.
- **DLG-Gold/Silber/Bronze** (Deutsche Landwirtschafts-Gesellschaft):
  rundes Medaillon, kontrastreich, mit Goldton, klar lesbar auch in
  klein.
- **Stiftung Warentest „sehr gut"**: nüchterner Stil, klare Hierarchie,
  Datum als integraler Bestandteil.

**Konkrete Design-Anker (Spec-Sitzung 16 + Bau-Sitzung 16 entscheiden
die finale Form):**

- **Form**: rundes oder leicht ovales Medaillon — keine rechteckige
  Plakette. Größe: ~32–48 px Durchmesser im Header, klickbar.
- **Farben**: nicht Neon, nicht Pastell. Klassisch — z.B. Edelmetall-
  Anmutung (Gold/Bronze/Silber je nach Aspekt-Stufe später möglich)
  + dunkler Untergrund (passend zur Sage-Page-Hintergrundsfarbe). Im
  Default ein zurückhaltendes Edel-Gold (`#C9A961`-Klasse) auf
  dunklem Grund.
- **Schrift**: Serif oder humanistische Sans-Serif mit Kontrast (NICHT
  die Mono-Schrift der Lampen-Labels). „SBKIM" größer, „SIEGEL"
  darunter kleiner, ggf. mit Datum.
- **Wappen-Element**: ein kleines abstraktes Mycel-Symbol oder ein
  Hyphen-Geflecht als zentraler Glyph. Spec-Sitzung 16 entwirft das
  SVG.
- **Hover/Aktiv-Zustand**: dezenter Glow oder Atmung (analog der
  Membran-Lampe, aber wertiger — kein hektisches Pulsieren).
- **Animation beim ersten Bezeugen** (Page-Load mit erfolgreicher
  Selbst-Prüfung): einmaliges Aufleuchten + leichter Skalierungs-Puls
  (~600 ms), dann ruhiger Default-Zustand. Disziplin: keine Dauer-
  Animation („überschreit nicht das, was es selbst ist").
- **Print-/Hi-Resolution-Tauglichkeit**: SVG, vektorbasiert,
  skalierbar bis Visitenkarten-Druck (Klaus kann das Siegel später
  auf einer Über-Seite o.ä. drucken, wenn er die App offiziell
  vorstellt).

**Negativ-Beispiele (was das Siegel NICHT sein soll):**

- Keine Neon-Farben, kein „NEW!"-Banner-Stil.
- Keine HTML-Emoji-Plakette (`🛡` als Hauptelement).
- Keine animierten GIFs / Glitter.
- Keine Werbe-Sprache („zertifiziert von …!").
- Kein „Beta"/"Alpha"-Stempel — entweder zertifiziert oder gar nicht.

**Anti-Greenwashing-Anker**: Wenn `isCertified() === false` (eine
Pflicht-Modul-Prüfung schlug fehl), darf Sub (b) **kein Badge
rendern**. Auch nicht ausgegraut, auch nicht „in Arbeit". Spec ist
binär: zertifiziert oder nicht.

### Sub (c) — Erklärungs-Modal

Klick auf das Badge öffnet ein Modal mit:

- **Titel**: „SBKIM-Siegel — was bedeutet das?"
- **Datum der ersten Bezeugung** (der erste erfolgreiche Selbst-
  Prüfungs-Lauf — pro PWA in RAM-only oder optional in IndexedDB
  zur Persistenz).
- **Modul-Liste**: welche Pflicht-Module bei diesem Lauf grün waren
  (z.B. „01 Storage · 02 Spore · 03 Embedding · …").
- **Aspekte-Liste**: chronologische Auflistung der Sicherheits-
  Aspekte mit Datum (siehe Sub (d)).
- **Aussteller-Klärung**: ein kurzer Fakt-Satz, der die Self-
  Inscribing-Natur ehrlich benennt — ohne Disclaimer-Ton, ohne
  juristische Sprache. Anker:

  > Dieses Siegel ist **self-inscribing**: die App hat sich selbst
  > geprüft. Vertrauen kommt vom Repo, in dem sie gehostet ist:
  > `<repo-url>`.

  Zwei Zeilen reichen. Spec-Sitzung 16 darf die exakte Formulierung
  feinpolieren, aber NICHT zu einem Haftungsausschluss aufblähen.

Modal-Form analog Modul 15 Fremdzugriff-Modal (eigenständig in
`document.body`, Backdrop-Klick / Esc / ✕ zum Schließen), aber mit
**wertigerer Typografie** (Serif für Titel + Klausel-Block, dezenter
Rahmen, klassischer Stil-Wechsel weg vom Mono-/Lampen-Stil).

### Sub (d) — Aspekte-Liste (lebendes Dokument)

Modul-interne `ZERTIFIKAT_ASPEKTE`-Liste, chronologisch geordnet,
strukturierte Einträge:

```js
{
  since:       "2026-05-24",
  module:      "16",           // welches Modul den Aspekt einführt
  aspect:      "Grund-Siegel-Bezeugung",
  description: "Diese App bestätigt durch Selbst-Prüfung beim Boot,
                dass die SBKIM-Pflicht-Module 01/02/03/04/05/07/15
                geladen sind.",
}
```

Jedes neue Sicherheits-Update ergänzt einen Eintrag — z.B.:

```js
{
  since:       "2026-07-01",   // Datum des Modul-11-Mini-Builds
  module:      "11",
  aspect:      "Rate-Limit für eingehende postMessage",
  description: "Diese App begrenzt eingehende postMessage-Calls auf
                X pro Sekunde pro Origin (Modul 11 § Rate-Limit-Regel).",
}
```

**Disziplin**: Aspekte werden NICHT zur Laufzeit hinzugefügt. Die
Liste ist code-versioniert. Jeder Aspekt-Eintrag entspricht einem
Pflege-PR (oder Bau-PR) mit nachvollziehbarem Datum + Commit-SHA.

## Persistenz

**Vorschlag (Spec-Sitzung entscheidet):**

- RAM-only für Selbst-Prüfungs-Resultat (analog Modul 15 Sub (e)).
- Optional in IndexedDB für „Datum der ersten Bezeugung" (Single-
  Wert-Eintrag in einem kleinen Store `sbkim_siegel_meta`). Spec-
  Sitzung entscheidet, ob das wirklich nötig ist oder ob das First-
  Boot-Datum pro Session ausreicht.

Kein `DB_VERSION`-Bump, kein `PROTOCOL_VERSION`-Bump (Siegel ist
nicht protokoll-aktiv — kein Netz, keine Signatur, kein Embedding).

## Strikte Tabus

- **Kein Siegel ohne Selbst-Prüfung-grün.** Wenn ein Pflicht-Modul
  fehlt, KEIN Badge-Render.
- **Self-Issued ist keine Vertrauens-Garantie.** Das Modal macht das
  explizit: „Diese App hat sich selbst geprüft. Vertrauen kommt vom
  Repo." Klaus' Verantwortung als Repo-Betreiber bleibt.
- **Keine Hub-Aussteller-Variante (b)** aus der Sitzungs-Diskussion
  2026-05-24. Self-Inscribing ist die einzige spezifizierte Variante.
- **Keine Aspekte-Liste zur Laufzeit ergänzen.** Code-versioniert,
  pro Pflege-PR.
- **Keine Pflicht-Modul-Liste zur Laufzeit ändern.** Code-versioniert,
  pro Pflege-PR; Sub (a) Pflicht-Liste ist Spec-Wille.
- **Keine PII im Modal.** Repo-URL, Modul-Liste, Aspekte-Beschreibung
  sind alle öffentlich; keine `nodeId` / Geschwister-Daten / API-Keys.

## Schnittstelle (Anker, finale Spec offen)

```js
// Spec-Sitzung 16 füllt die finale Form.

window.SbkimSiegel = {
  init(options?)              // Promise<void>
  isCertified()               // sync, boolean — wahr nur wenn alle Pflicht-Module grün
  getExplanation()            // sync, ExplanationSnapshot — Modal-Inhalt
  getCertifiedModules()       // sync, string[] — Liste der bestätigten Modul-IDs
  getAspects()                // sync, Aspect[] — chronologisch
  _meta                       // Read-Anker für Tests
}

// Form:
options = {
  badgeSelector?: string,     // Default '#sbkim-cert-badge'
  visible?: "visible" | "hidden", // Default "visible"
  mountModal?: boolean,       // Default true (wenn visible)
}

ExplanationSnapshot = {
  certifiedAt: <ISO-8601>,
  repoUrl: <string | null>,   // aus document.location oder init-Option
  modules: [{ id, name, surfaceCheck: "ok" | "missing" | "broken" }],
  aspects: Aspect[],
}

Aspect = {
  since: <ISO-Datum>,
  module: <string>,
  aspect: <string>,
  description: <string>,
}
```

## Reihenfolge im Brief-99-Pipeline

```
Schritt 1: Spec-Sitzung 16 (diese Karte füllen — finale Pflicht-
           Modul-Liste, Badge-DOM-Form, Modal-Inhalt, Aspekte-
           Schema)
Schritt 2: Bau-Sitzung 16 (src/modules/16_siegel.js, Badge-CSS in
           index.html, Modal-Mount, ZERTIFIKAT_ASPEKTE-Startwert)
Schritt 3: Sichttest 16 (Klaus, Sage-Page Badge sichtbar + Modal
           öffnet sich)
Schritt 4: Spec-Sitzung 15.B (Sub (a) + Sub (b) mit Siegel-Hook im
           Snapshot)
Schritt 5: Endknoten-Migration Karte 09 § Schritt 10
           + Siegel-Anker pro Endknoten-PWA
Schritt 6: Klaus' App-Freigabe (mit Siegel sichtbar)
Später:    Modul 11 / 12 / 10 — jeder Bau ergänzt einen Aspekt
```

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-24 | Mini-Pflege „Modul 16 SBKIM-Siegel Stub" | Name fix: SBKIM-Siegel. Self-Inscribing als Aussteller-Modell, lebendes Dokument als Aspekte-Pfad. Anlass: Klaus' geplante App-Freigabe — Vertrauens-Signal für Forker und Endnutzer. Detail-Spec ausstehend (Spec-Sitzung 16). |

---

**Querverweise**

- **Abhängigkeiten (für spätere Spec):** Modul 01 / 02 / 03 / 04 / 05 / 07 / 15 (Pflicht-Surface für Selbst-Prüfung — fail-soft, kein Throw bei Fehlen, sondern „kein Siegel-Render")
- **Wird genutzt von:** Endnutzer (Vertrauens-Signal beim ersten Page-Load) · Forker (Build-Selbst-Check ohne CI-Pipeline) · Klaus selbst (Sichtbarmachung der Pflicht-Modul-Integration vor App-Freigabe) · künftiges Modul 10 Reputation (Hook: Siegel-Daten als Anfangs-Trust-Signal beim Handshake)
- **Hook-Punkte (nur Verweis, nicht implementiert):** Modul 15 Sub (a) `read()` könnte das Siegel im Snapshot mitliefern · Modul 02 Spore könnte einen optionalen `siegel`-Feld im Spore-Schema dazu bekommen (Spec-Sitzung 16 entscheidet, ob das Spore-Schema betroffen ist — Default: NEIN, additive Erweiterung später)
- **Site-Karte:** Sage-Page Karten 4 / 13 / 14 ziehen `siegelBacklog[]` parallel zu `schutzBacklog[]` / `diffusionBacklog[]` / `membranBacklog[]` — Folge-Pflege-Sitzung
- **Paper:** `sbkim_paper.pdf` Kap. 1 (Empfangsmodus-Prinzip — Self-Issued statt Hub-Aussteller passt zum dezentralen Geist)
- **Verwandt:** [Modul 15](15_membran.md) (Außen-Schicht, parallel) · [Modul 09](09_einbau_pwa.md) (Andock-Schritt 10 ergänzt Siegel-Anker pro PWA) · [Modul 00](00_doku_fenster.md) (Modal-Verhalten als Vorbild)
