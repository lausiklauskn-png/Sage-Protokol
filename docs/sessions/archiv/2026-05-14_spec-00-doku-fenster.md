# Übergabeprotokoll · 2026-05-14 · Spec-Sitzung Modul 00 Doku-Fenster

**Sitzungs-Rolle:** Spec-Sitzung (eine Sitzung, eine Phase). **Kein**
JS-Code unter `src/`. Karte 00 wird von 🟫 Schablone auf 🟨 Spec
fertig gehoben; INTERFACES.md §0 + §1 Modul 00 + §6 ziehen nach.
**Branch:** `claude/spec-00-doku-fenster-VOmwe`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und
an die Übergabeprotokolle der Spec-Sitzungen 05 / 07 / 09 vom
2026-05-14.
**Modul:** 00_doku_fenster

---

## Auftrag

Eine Phase (Spec), drei Pflichtfragen plus die Karten-Verträge:

1. **`docs/components/00_doku_fenster.md` vollständig füllen.** Stil
   wie Karten 02/04/05/07/09. Pflichtblöcke: Hero · Im Mycel-Bild ·
   Visualisierung · Zweck · Verantwortlichkeiten · Schnittstelle ·
   Selbstcheck · Konfigurationswerte · Datenformate · 5-Klick-Pfad ·
   Sichtbarkeits-Verhalten · Fehlertabelle · Manueller Test · Risiken
   · Bauzustand · Querverweise.
2. **`docs/INTERFACES.md` §1 Modul 00 auf `entwurf`** mit voller
   Vertrag-Sektion (API, Stores mit Schreib-/Lese-Rollen, Selbstcheck,
   Versionierungs- und Sichtbarkeits-Vertrag, Fehlertabelle,
   Garantien für 08/12).
3. **`docs/INTERFACES.md` §0** um die neuen Konstanten erweitern
   (`DOKU_REVEAL_WINDOW_MS`, `DOKU_QUOTA_WARN_RATIO`,
   `DOKU_QUOTA_WARN_BYTES`); additiv, kein Hauptversions-Sprung.
4. **`docs/INTERFACES.md` §6** Änderungsprotokoll-Zeile am unteren
   Ende für „Spec-Sitzung 00".
5. **Drei Pflichtfragen verbindlich entscheiden** (keine
   Verschiebung): 5-Klick-Mechanik + Zeitfenster · Quota-Schwellwert
   + Ort der Konstanten · Sichtbarkeits-Persistenz.
6. **Sitzungs-Abschluss:** PULS-Eintrag, Übergabeprotokoll (diese
   Datei), WEGWEISER-Stand-Block-Zeile, `status.json` Modul 00 von
   `schablone` auf `spec` (Pie regenerieren — Schablone 5 → 4, Spec
   fertig 1 → 2), Karte 00 Hero-Badge auf 🟨 Spec fertig.

---

## Was getan wurde

### 1. Karte 00 vollständig gefüllt

`docs/components/00_doku_fenster.md` von ~150 Zeilen Schablone auf
~480 Zeilen 🟨 Spec fertig gehoben. Alle Pflichtblöcke vorhanden:

- **Hero** mit Status-Badge 🟨 Spec fertig, Schicht „UI", Sage-Page-
  Anker (Karte 4 Eintrag 00), Untertitel mit drei Kernanker
  (Schreiber von `sbkim_doku_meta`, Leser von Spore/Geschwister/Inbox/
  Quota).
- **Im Mycel-Bild** — die „Mycel-Lupe": versteckte Klappe am Knoten,
  zeigt eigenen Atemkreis. „Versteckt heißt nicht geheim." Zwei
  Trigger benannt: TTL-Sweep-Knopf und Inbox-Anzeige. Self-Apoptose-
  Knopf bewusst nicht vorgesehen (mit Verweis auf § Verantwortlichkeiten).
- **Visualisierung** als Mermaid-Flowchart — 5-Klick-Pfad (Klicks
  1–4 zählen, Klick 5 öffnet, 3 s ohne weiteren Klick reset) plus
  sechs Inhalts-Knoten (Knoten-ID + Domäne, Modulstand, Geschwister,
  Inbox, Quota-Warnung, drei Knöpfe). Color-Klassen
  trig/cnt/win/leaf/warn/btn mit Mercel-Reife-Gradient-Farben.
- **Zweck** — pragmatisch: Lauf-Zustand des Knotens für Klaus +
  Mitnutzer, nicht für den Endnutzer. Sieben Anzeige-Punkte
  aufgelistet (nodeId-Kurzform, Domäne, Module, Geschwister, Inbox,
  Quota, lastOpenedAt). Pflichtfragen-Entscheidungen als separater
  Block weiter unten.
- **Verantwortlichkeiten** — „Macht" 8 Punkte (Klickzähler, Reveal-
  bei-Schwelle, fail-soft-Lesen, einziger Schreiber sbkim_doku_meta,
  Quota-Frühwarnung, Inbox-Anzeige, TTL-Sweep-Knopf, Schließen-Esc,
  recordSighttest); „Macht nicht" 9 Punkte mit explizit drei-Absatz-
  Begründung für „Kein Self-Apoptose-Knopf".
- **Pflichtfragen-Entscheidungen dieser Sitzung** — eigener Block,
  drei nummerierte Fragen mit Variante + Begründung in 3–4 Punkten.
- **Schnittstelle** — Sechs-Funktionen-API in Pseudocode mit
  Kommentar-Spalten: `init/open/close/isOpen/getStatusSnapshot/
  recordSighttest`. Selbstcheck-Zeile im Muster `MODUL 00 DOKU-
  FENSTER bereit, Funktionen: …`. Konfigurationswerte-Block mit
  fünf §0-Konstanten plus zwei modul-lokalen (`WINDOW_TITLE_DEFAULT`,
  `NODE_ID_SHORT_LEN`). Datenformate: `sbkim_doku_meta["meta"]`-
  Wert, `sbkim_doku_meta["<modulId>"]`-Wert, `DokuStatus`-Form als
  vollständige JSON-Skizze.
- **5-Klick-Pfad** — Acht nummerierte Schritte mit konkreten
  Ablauf-Details (PWA-Laden, init-Aufruf, click-Listener,
  Klickzähler, Reveal-Schwelle, Schließen, Reload-Verhalten).
  Vier Alternative-Pfade dokumentiert (Zeitfenster-Reset,
  Fremd-Klick-Ignorieren, fehlende `SbkimApoptose`, alter Browser
  ohne `storage.estimate()`).
- **Sichtbarkeits-Verhalten** — verbindliche Variante (a) Session-
  only mit fünf konkreten Konsequenzen (in-memory-Zustand verloren,
  Versteckt beim Start, `lastOpenedAt` bleibt persistent, kein
  `visible`-Feld, Folge-Pflege-Sitzung später möglich).
- **Fehlertabelle** — 15 Einträge plus vier benannte Error-Klassen
  (`InvalidDokuOptionsError`, `DokuDependenciesError`,
  `InvalidSighttestResultError`, `StorageQuotaError`).
- **Manueller Test** — Sechs-Knopf-Skizze für Panel 00 in
  `tests/manual_check.html` (Setup, 5 Klicks simulieren, 4 Klicks +
  Timeout, Quota-Warnzeile, TTL-Sweep, Selbstcheck-Hinweis). Drei
  zusätzliche Hand-Tests (Esc, Re-Open, Persistenz-Reload). Fünf
  Test-Brücken aufgelistet (`_dispatchClick`, `_resetClickCounter`,
  `_advanceRevealClock`, `_setQuotaForTest`, `_clearQuotaForTest`).
  Explizit: kein Self-Apoptose-Test in Panel 00.
- **Risiken & offene Punkte** — 8 Punkte (Selektor-Konfigurierbar-
  keit, Touch-Burst harmlos, Endnutzer-Versehen harmlos, Quota-API
  bei alten Browsern, TTL-Sweep-Knopf nicht automatisch,
  Self-Apoptose-Argumentation, kein Detail-View, kein Auto-Refresh,
  **Lücke-Negativ-Befund**).
- **Bauzustand-Tabelle** — Zeile *Spec gefüllt | 2026-05-14 | Spec 00
  | …* mit ausführlicher Anmerkung (alle drei Pflichtfragen-
  Entscheidungen, §0-Erweiterung, Schreib-Rolle).
- **Querverweise** — Pflicht-Abhängigkeit Modul 01, optionale
  Modul 02/05/07, Verbraucher (alle Module + Bau-Sitzungen + Modul
  12 später), zwei Folge-Pflege-Sitzungs-Aufhänger (Karte 09
  Schritt 9 + Persistenz-Strategie verbinden), Site-Karte,
  Glossar, ARCHITEKTUR.md §7, INTERFACES.md §0/§1/§5.

### 2. Drei Pflichtfragen entschieden

**Frage 1 · 5-Klick-Mechanik + Zeitfenster — Variante (a).**
5 Klicks auf das Such-Symbol innerhalb von 3 Sekunden. Neue §0-
Konstante `DOKU_REVEAL_WINDOW_MS = 3000`. Klick 1 startet den Timer
(für alle 5 Klicks insgesamt, nicht pro Klick); wenn `DOKU_REVEAL_
WINDOW_MS` ohne neuen Klick verstreicht, geht der Zähler auf 0
zurück. Such-Symbol behält seine Original-Funktion (kein
`preventDefault`).

**Begründung (4 Punkte):** klassische versteckte Doku-Geste
(CLAUDE.md-Andeutung), 3 s ist menschlich (schnell genug gegen
Klick-Aufsummen, langsam genug für Mobil-Touch), keine
Tastatur-Geste (Klaus hat 2 mobile Nutzer), Such-Symbol behält
seine Such-Funktion ohne Konflikt.

**Frage 2 · Quota-Schwellwerte — Variante (a)+(c) gemeinsam, in §0.**
Doppel-Schwelle:

```
DOKU_QUOTA_WARN_RATIO  = 0.80              // 80%-relative Schwelle (Variante a)
DOKU_QUOTA_WARN_BYTES  = 52428800          // 50 MiB absolute Schwelle (Variante c)
```

Warnzeile bei Überschreitung **einer der beiden** Schwellen. Beide
**additiv in §0** — kein Hauptversions-Sprung. `status.json.config`
zieht mit.

**Begründung (3 Punkte):** Konsistenz zum Querschnitts-Anker
„Spore-Persistenz-Strategie verteilt" (Modul 01-Persist + Modul 02-
Backup + Modul 00-Frühwarnung teilen denselben §0-Schwellwert),
additive §0-Erweiterung erlaubt (kein Hauptversions-Sprung), die
Doppel-Schwelle deckt sowohl 10-GiB-Geräte als auch 200-MiB-Mobil-
Geräte sauber ab (80% von 200 MiB = 160 MiB, aber „nur 40 MiB frei"
ist dort das dringendere Signal).

**Frage 3 · Sichtbarkeits-Persistenz — Variante (a) Session-only.**
Beim Tab-Schließen ist das Fenster weg; beim nächsten Mal startet es
versteckt; 5-Klick-Geste jedes Mal neu. `sbkim_doku_meta["meta"]`
hat **kein** `visible`-Feld — nur `lastOpenedAt` als
Anzeige-Hilfe.

**Begründung (3 Punkte):** „versteckte Doku" muss versteckt bleiben
(sonst nicht mehr versteckt), Klaus-Komfort asymmetrisch zum
Verstecken (er klickt nicht oft ins Fenster), Spec-Klarheit (kein
Toggle, kein Ablauf-Zähler, kein Migration-Pfad in der Erst-Spec).
Folge-Pflege-Sitzung kann Variante (b) oder (c) additiv einführen
(`schemaVersion: 1 → 2`, neue Felder, Migration im `init()`) —
diese Sitzung schließt das *nicht* aus; sie wählt die einfachste
Variante für das aktuelle Netz.

### 3. INTERFACES.md §0 erweitert

Drei neue Konstanten in §0 zwischen `DOKU_REVEAL_CLICKS` und
`SIBLING_MAX_AGE_MS` eingefügt:

```
DOKU_REVEAL_WINDOW_MS  = 3000           // 3 Sekunden Zeitfenster für alle 5 Klicks; Modul 00, Spec-Sitzung 00
DOKU_QUOTA_WARN_RATIO  = 0.80           // Quota-Frühwarnung relativ; Modul 00, Spec-Sitzung 00 (auch Modul 01/02 Querschnitt „Spore-Persistenz")
DOKU_QUOTA_WARN_BYTES  = 52428800       // 50 MiB freier Speicher als zweite Quota-Frühwarnung absolut; Modul 00, Spec-Sitzung 00
```

Bewusst zwischen `DOKU_REVEAL_CLICKS` (Modul 00) und
`SIBLING_MAX_AGE_MS` (Modul 07) platziert, damit die §0-Sektion
modulthematisch lesbar bleibt. Additive Änderung — kein
Hauptversions-Sprung, kein Eingriff in §2/§4/Modul-02.

### 4. INTERFACES.md §1 Modul 00 auf `entwurf`

§1 Modul 00 von Status `schablone` mit „noch zu spezifizieren"-
Platzhalter auf Status `entwurf` mit voller Vertrag-Sektion gehoben.
Inhalt:

- **Bietet:** Sechs-Funktionen-API mit `options`-Form.
- **Nutzt:** Pflicht-Abhängigkeit `SbkimStorage` (Lese + Schreibe
  `sbkim_doku_meta`); optionale Quellen `SbkimSpore.{getNodeId,
  getOwnSpore, getPublicKeyJwk}`, `SbkimAnastomose.listSiblings`,
  `SbkimApoptose.{listLegacy, forgetExpiredSiblings}`,
  `navigator.storage.estimate()`. DOM-Anker:
  `document.querySelector(options.searchIconSelector)` für den
  Click-Listener und `document.addEventListener("keydown")` für Esc.
- **Storage:** alleiniger Schreiber von `sbkim_doku_meta`,
  Schlüssel `"meta"` (Modul-Meta: `lastOpenedAt`, `schemaVersion`)
  + `"<modulId>"` (Sichttest-Spur). Andere Module schreiben
  `sbkim_doku_meta` nicht; Lese-Rechte sind offen.
- **Events:** keine — DOM-Listener werden in `init()` registriert,
  ein Custom-Event-Pub/Sub gibt es nicht.
- **Selbstcheck:** `MODUL 00 DOKU-FENSTER bereit, Funktionen: …`
  beim Skript-Laden, ohne Konstanten in der Zeile.
- **Versionierungs- und Sichtbarkeits-Vertrag:** kein protokoll-
  aktiver Hauptversions-Check (Modul 00 spiegelt nur §0);
  Sichtbarkeits-Persistenz Session-only verbindlich; additive
  Schema-Erweiterung in `sbkim_doku_meta["meta"]` per
  `schemaVersion` möglich.
- **Fehlerverhalten:** modul-spezifische Tabelle mit 14 Lagen + vier
  benannte Error-Klassen.
- **Garantien für Modul 08 / 12 und Bau-Sitzungen:** Schreibrecht
  exklusiv bei 00; `DokuStatus` reines JSON; keine Netz-Aufrufe;
  Self-Apoptose-Knopf NICHT in 00.

### 5. INTERFACES.md §6 Änderungsprotokoll

Zeile „2026-05-14 | Spec-Sitzung 00 | …" am unteren Ende der
Tabelle eingefügt (neueste Zeile unten, Konventions-Stil wie
Spec-Sitzung 07 / 09). Fasst die Sitzung in einer Zeile zusammen:
Sechs-Funktionen-API, alleiniger Schreiber `sbkim_doku_meta`,
Lese-Quellen, drei Pflichtfragen-Entscheidungen, §0-Erweiterung,
TTL-Sweep-Andocken ohne API-Erweiterung, `listLegacy`-Anzeige ohne
Detail-View, Self-Apoptose explizit NICHT in 00, `DokuStatus`-
Schlüsselfelder, vier Error-Klassen, Karte-09-Folge-Pflege-Sitzung
als offen.

### 6. status.json + Pie regeneriert

Modul 00 von `score:"schablone"` / `siegel:"noch nicht gebaut"` /
`kurz:"5-Klick versteckte Statusanzeige im Such-Symbol"` auf
`score:"spec"` / `siegel:"Spec fertig"` mit aktualisiertem
`kurz`-Feld:

```
"Versteckte 5-Klick-Statusanzeige in Endknoten-PWAs — Sechs-Funktionen-API,
reines Lese-/Trigger-Modul, alleiniger Schreiber von sbkim_doku_meta,
Quota-Frühwarnung (80% + 50 MiB) und TTL-Sweep-Knopf andocken"
```

`status.json.config` um drei Werte erweitert
(`DOKU_REVEAL_WINDOW_MS: 3000`, `DOKU_QUOTA_WARN_RATIO: 0.80`,
`DOKU_QUOTA_WARN_BYTES: 52428800`).

`python3 scripts/update_puls_pie.py` lief, Pie regeneriert:

- Schablone: 5 → **4**
- Werkstatt: 1 → 1
- Spec fertig: 1 → **2**
- Code-Stub: 6 → 6
- Fertig: 0 → 0

Genau wie das Briefing vorgibt.

### 7. PULS-Aktualisierungen

- **Schnellüberblicks-Zeile Modul 00:** `Spec fertig (2026-05-14)` /
  `—` / `—` / ausführliche Notiz mit Sechs-Funktionen-API,
  Schreib-Rolle, 3 s Zeitfenster, Doppel-Schwelle, Session-only,
  Self-Apoptose-Ausschluss.
- **„Als nächstes ✨" umgestellt:** Modul 00 raus aus der
  „dependenz-frei, Spec ausstehend"-Liste (es ist jetzt Spec fertig)
  und in die Liste „Spec frisch, Bau ausstehend" rein neben Modul
  09. Empfehlungs-Text auf **Bau-Sitzung Modul 00** als Haupt-
  Empfehlung (headless möglich); Bau-Sitzung Modul 09 (mit Klaus am
  Browser) als parallel produktivere Option.
- **Offene Querschnitts-Frage „Spore-Persistenz-Strategie verteilt"**
  als **teilweise gelöst** markiert: Modul 00 hat seine Schwellen
  in §0 verankert, die anderen drei Stränge (Modul 01 Persist,
  Modul 02 Backup, Modul 07 Risiko-Vermerk) bleiben offen oder
  bereits dokumentiert.
- **Neuer Sitzungs-Eintrag oben** mit Was getan / Frischer-Kopf-
  Befund (keine API-Korrektur, kleine Beobachtung zum Skript-
  Reihenfolge-Vertrag in Karte 09) / Was offen blieb (Bau 00,
  Folge-Pflege-Sitzung Karte 09 Schritt 9, Persistenz-Strategie
  verbinden, Sichtbarkeits-Persistenz später, Sichttest 00 erst nach
  Bau) / Nächster sinnvoller Schritt (4 Punkte).

### 8. WEGWEISER-Stand-Block-Zeile

Eine Zeile am unteren Ende des Stand-Blocks ergänzt (Wanderung —
neueste Zeile unten), zusammenfassend: drei Pflichtfragen-
Entscheidungen, drei §0-Konstanten, Sechs-Funktionen-API,
alleiniger Schreiber `sbkim_doku_meta`, TTL-Sweep-Andocken ohne
API-Erweiterung, Self-Apoptose explizit NICHT in 00.

---

## Frischer-Kopf-Befund: keine API-Korrektur, drei verbindliche
Entscheidungen, zwei Folge-Pflege-Sitzungs-Aufhänger

Das Briefing erlaubte API-Korrekturen an Modul 01/02/05/07, wenn
beim Durchgehen eine Lücke auffiele, die einen Andocker im Bau
blockieren würde. Beim Lesen kein solcher Punkt — alle benötigten
Surface-Einträge sind exportiert:

- `SbkimStorage.{init, get, put, all}` (Karte 01 § Schnittstelle)
- `SbkimSpore.{getNodeId, getOwnSpore, getPublicKeyJwk}` (Karte 02)
- `SbkimAnastomose.listSiblings` (Karte 05)
- `SbkimApoptose.{listLegacy, forgetExpiredSiblings}` (Karte 07)
- `navigator.storage.estimate()` (Browser-API-Standard)

Eine zweite frischer-Kopf-Beobachtung — **Skript-Reihenfolge-Vertrag
in Karte 09:** Karte 00 erwartet im Endknoten die Reihenfolge 01 →
02 → 03 → 04 → 05 → 07 → **00**. Karte 09 § Andock-Schritt-Pfad
Schritt 2 schreibt aktuell nur 01 → 02 → 03 → 04 → 05 vor. Modul 07
und Modul 00 sind in Karte 09 noch nicht im Andock-Pfad — das ist
Folge-Pflege-Sitzungs-Stoff für Karte 09 („Schritt 9: 07 + 00
nachziehen"). Diese Spec-Sitzung markiert das als offen; sie bricht
**nicht** ab und ändert Karte 09 **nicht** (kleinere Spec-Korrektur,
gehört in eine eigene kompakte Pflege-Sitzung).

Die drei Pflichtfragen waren im Briefing als „verbindlich
entscheiden, keine Verschiebung" gekennzeichnet — entschieden mit
Begründungs-Block in Karte 00 § Pflichtfragen-Entscheidungen:

- **Frage 1 Variante (a):** 5 Klicks auf Such-Symbol in 3 s
  (`DOKU_REVEAL_WINDOW_MS = 3000`).
- **Frage 2 Variante (a)+(c) gemeinsam in §0:** Doppel-Schwelle
  (`DOKU_QUOTA_WARN_RATIO = 0.80`, `DOKU_QUOTA_WARN_BYTES =
  52428800`).
- **Frage 3 Variante (a):** Sichtbarkeit session-only — kein
  `visible`-Feld.

Die Querschnitts-Frage „Spore-Persistenz-Strategie verteilt" aus
PULS.md ist durch diese Spec **teilweise gelöst** — Modul 00 hat
seinen Anteil verankert (`DOKU_QUOTA_WARN_*` als gemeinsamer
Anker in §0). Die Frage bleibt offen, weil Modul 01 (Persist) und
Modul 02 (Backup) noch nicht spruchreif sind.

---

## Was offen blieb

- **Bau-Sitzung Modul 00 Doku-Fenster.** Diese Spec-Sitzung liefert
  die volle API + Datenformate + Test-Plan. Bau-Sitzung schreibt
  `src/modules/00_doku_fenster.js` als IIFE (Muster wie 01/02/04/05/
  07), implementiert die sechs öffentlichen Funktionen, die vier
  Error-Klassen, die fünf Test-Brücken; füllt Panel 00 in
  `tests/manual_check.html` mit den sechs Knöpfen aus Karte 00
  § Manueller Test. Headless-Sitzung möglich; Sichttest danach durch
  Klaus im Browser.
- **Folge-Pflege-Sitzung Karte 09 „Schritt 9: TTL-Sweep + Modul 00
  im Andock-Pfad".** Karte 09 § Andock-Schritt-Pfad Schritt 2
  (`<script>`-Tags) erweitern: Modul 07 und Modul 00 sind aktuell
  nicht im Reihenfolge-Block; sollten ergänzt werden. Außerdem
  Andocker-Automatik für TTL-Sweep nach jedem Handshake andocken
  (Spec-Sitzung 07 hat das als offen vermerkt). Modul 00 hat den
  manuellen Knopf jetzt.
- **Folge-Pflege-Sitzung „Persistenz-Strategie verbinden".** Modul
  00 hat seinen Anteil (Quota-Schwellen) in §0 verankert. Wenn
  Modul 01 (Persist) und Modul 02 (Backup) spruchreif sind, kann
  eine Pflege-Sitzung die drei Stränge zusammenführen. Verbleibend:
  §0-Schwellen jetzt da; §2-Backup-Format (offen); Warntext-Form
  jetzt da (Karte 00 § Datenformate `quota.warningLevel`).
- **Folge-Pflege-Sitzung „Sichtbarkeits-Persistenz" (optional).**
  Wenn Klaus später Komfort wünscht, kann eine Pflege-Sitzung
  Variante (b) oder (c) additiv einführen: `sbkim_doku_meta["meta"]
  .visible:true` plus `expiresAt`-Feld, `schemaVersion: 1 → 2`,
  Migration in `init()`. Diese Sitzung schließt das *nicht* aus.
- **Sichttest Modul 00 durch Klaus** kommt erst nach der
  Bau-Sitzung.
- **PULS.md Zeilen-Längen-Schwellwert.** CLAUDE.md sagt 400 Zeilen
  Maximum, jetzt deutlich darüber. Querschnitts-Aufräum-Arbeit für
  eine eigene Sitzung — nicht Teil dieser Spec-Sitzung. Die letzten
  sechs Sitzungen sind genauso vorgegangen.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 00 Doku-Fenster** (headless möglich, Sichttest
   danach durch Klaus im Browser). Vorbedingung: keine — Modul 00
   hängt nur an Modul 01 (Storage, Code-Stub schon da) und ist
   sonst fail-soft. Liefert `src/modules/00_doku_fenster.js`,
   Panel 00 mit sechs Knöpfen, vier Error-Klassen, fünf Test-
   Brücken.
2. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Browser** (parallel
   anbietbar) — der erste echte Andock-Klick zwischen Rezeptbuch
   und Mixarium. Module 05 und 07 sind beide Code-Stub und können
   live mit-andocken.
3. **Sichttests Karte 05 + Karte 07** durch Klaus (Panel 05 acht
   Knöpfe, Panel 07 zehn Knöpfe) — vor Schritt 2.
4. **Folge-Pflege-Sitzung Karte 09 „Schritt 9: TTL-Sweep + Modul 00
   im Andock-Pfad"** — kompakte Pflege-Sitzung, sobald Modul 00
   Code-Stub ist.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/components/00_doku_fenster.md` vollständig gefüllt
      (~480 Zeilen, Stil 02/04/05/07/09) mit Hero · Im Mycel-Bild ·
      Visualisierung · Zweck · Verantwortlichkeiten ·
      Pflichtfragen-Entscheidungen · Schnittstelle ·
      Konfigurationswerte · Datenformate · 5-Klick-Pfad ·
      Sichtbarkeits-Verhalten · Fehlertabelle · Manueller Test ·
      Risiken & offene Punkte · Bauzustand · Querverweise
- [x] **Drei Pflichtfragen verbindlich entschieden:**
      - Frage 1 · Variante (a) 5 Klicks auf Such-Symbol in 3 s
        (`DOKU_REVEAL_WINDOW_MS = 3000`)
      - Frage 2 · Variante (a)+(c) Doppel-Schwelle in §0
        (`DOKU_QUOTA_WARN_RATIO = 0.80`, `DOKU_QUOTA_WARN_BYTES =
        52428800`)
      - Frage 3 · Variante (a) Session-only-Sichtbarkeit
- [x] **Modul 00 als reines Lese-/Trigger-Modul** spezifiziert —
      alleiniger Schreiber `sbkim_doku_meta`, fail-soft-Leser von
      Spore / Geschwister / Inbox / Quota
- [x] **Drei Anker sauber angedockt** (Vermächtnis-Inbox · TTL-
      Sweep-Knopf · Quota-Frühwarnung) ohne API-Erweiterung an
      01/02/05/07
- [x] **Self-Apoptose-Knopf bewusst NICHT in Modul 00** —
      ausdrücklich in § Verantwortlichkeiten „Macht nicht" mit
      drei-Absatz-Begründung dokumentiert
- [x] **`docs/INTERFACES.md` §0** um drei neue Konstanten erweitert
      (additiv, kein Hauptversions-Sprung):
      `DOKU_REVEAL_WINDOW_MS`, `DOKU_QUOTA_WARN_RATIO`,
      `DOKU_QUOTA_WARN_BYTES`
- [x] **`docs/INTERFACES.md` §1 Modul 00** auf Status `entwurf` mit
      voller Vertrag-Sektion (Bietet · Nutzt · Storage · Events ·
      Selbstcheck · Versionierungs- und Sichtbarkeits-Vertrag ·
      Fehlerverhalten · Garantien für 08/12)
- [x] **`docs/INTERFACES.md` §6** Änderungsprotokoll-Zeile am
      unteren Ende ergänzt (neueste unten, Konventions-Stil)
- [x] **Kein JS-Code unter `src/` geändert** — Spec-Charakter dieser
      Sitzung gehalten
- [x] `status.json` Modul 00 auf `score:"spec"` /
      `siegel:"Spec fertig"` mit aktualisiertem `kurz`-Feld;
      `status.json.config` um drei neue Konstanten erweitert (keine
      anderen Modul-Scores geändert)
- [x] `python3 scripts/update_puls_pie.py` gelaufen (Schablone 5→4,
      Spec fertig 1→2; Code-Stub bleibt 6, Werkstatt bleibt 1)
- [x] Karte 00 Hero-Badge auf 🟨 Spec fertig
- [x] Karte 00 Bauzustand-Tabelle: Zeile *Spec gefüllt | 2026-05-14
      | Spec 00 | …* mit ausführlicher Anmerkung
- [x] `docs/PULS.md` Sitzungs-Eintrag oben, Schnellüberblick und
      „Als nächstes ✨" aktualisiert; offene Querschnitts-Frage
      „Spore-Persistenz-Strategie verteilt" als **teilweise gelöst**
      markiert (Modul 00 hat seinen Anteil verankert)
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile unten ergänzt
      (Wanderung, neueste Zeile unten)
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/spec-00-doku-fenster-VOmwe` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
