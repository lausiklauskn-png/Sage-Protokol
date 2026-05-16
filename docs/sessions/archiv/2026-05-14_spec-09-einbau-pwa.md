# Übergabeprotokoll · 2026-05-14 · Spec-Sitzung Modul 09 Einbau-PWA

**Sitzungs-Rolle:** Spec-Sitzung (eine Sitzung, eine Phase). **Kein**
JS-Code unter `src/`. Modul 09 ist eine Anleitung, kein JS-Modul; die
Karte selbst *ist* die Anleitung.
**Branch:** `claude/spec-09-einbau-pwa-6Ej1r`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und an
den Übergabeprotokollen der Spec-Sitzung 05 und der Spec+Bau-Sitzung 02
vom 2026-05-14 (Karten-Stil-Referenz).
**Modul:** 09_einbau_pwa

---

## Auftrag

Eine Phase (Spec), drei Aufgabenstränge plus eine verbindliche
Entscheidung:

1. **`docs/components/09_einbau_pwa.md` vollständig füllen.** Stil wie
   Karten 02/04/05. Pflichtblöcke: Hero · Im Mycel-Bild ·
   Visualisierung · Zweck · Verantwortlichkeiten · Andock-Schritt-Pfad ·
   Sichtkontrolle · Service-Worker-Hinweis · Risiken & offene Punkte ·
   Bauzustand · Querverweise.
2. **`domainVector`-Pflicht-Frage entscheiden — verbindlich.** Drei
   Optionen: A (Soft-Pflicht im Andock-Workflow), B (Hart-Pflicht im
   Schema mit Hauptversions-Sprung `0.1 → 1.0`), C (Status quo —
   nicht empfohlen). Diese Sitzung wählt **eine** und zieht die
   Konsequenzen durch.
3. **`INTERFACES.md` §1 Modul 09 auf Status `entwurf`** mit voller
   Vertrag-Sektion, §6 Änderungsprotokoll-Zeile am Ende.
4. **Sitzungs-Abschluss:** PULS-Eintrag, Übergabeprotokoll (diese
   Datei), WEGWEISER-Stand-Block-Zeile, `status.json` Modul 09 von
   `schablone` auf `spec` (Pie regenerieren — Schablone 7 → 6, Spec
   fertig 0 → 1), Karte 09 Hero-Badge auf 🟨 Spec fertig.

Plus drei Andock-Konventionen, die diese Sitzung verbindlich festlegen
soll: **Datei-Pfad-Konvention** im Endknoten, **Spore-Endpunkt-
Konvention** (`.well-known/` vs. `/sbkim/`-Alias), **Service-Worker-
Registrierungs-Pfad** für GitHub-Pages-Project-Sites.

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Modul 09 ist eine Anleitung, kein JS-Modul** (INTERFACES.md §1
  Modul 09: „Datei: `docs/components/09_einbau_pwa.md` (Anleitung,
  kein JS-Modul). Bietet: Anleitung … keine JS-Schnittstelle.")
- **Single-File-PWA-Stil bevorzugt** (Klaus' Endknoten sind
  `index.html`-Single-Files auf GitHub Pages).
- **Singleton-Identität pro PWA** (Modul 02 Spec).
- **Service-Worker-Variante A · Page-Hosted** (Bau-Sitzung 05).
- **Anastomose-Vertrag verbindlich** (Spec+Bau 05): jeder Endknoten
  muss `receiveHandshake` über die Page-Brücke des SW anbieten;
  `SbkimAnastomose.init()` registriert den `message`-Listener.
- **`PROVIDER_MIN_MATCH = 0.80`** (Pflege-Sitzung Match-Kalibrierung).

---

## Was getan wurde

### 1. Karte 09 vollständig gefüllt

`docs/components/09_einbau_pwa.md` von der Schablone (~125 Zeilen,
generische Skizze mit „Spec füllt aus"-Marker) auf 🟨 Spec fertig
gehoben (~470 Zeilen). Alle Pflichtblöcke vorhanden:

- **Hero** mit Status-Badge 🟨 Spec fertig, Schicht „Anleitung (kein
  JS-Modul)", Sage-Page-Ankern (Karte 4 Eintrag 09 + Karte 10
  Andocken).
- **Im Mycel-Bild** — Andocken als Initiations-Phase: ein neuer Pilz
  schiebt seine erste Hyphen ins Substrat. Vier Pflichten genannt:
  Singleton-Identität, Domain-Vektor, Spore publizieren, Empfangsmund.
  Origin-Bindung explizit: zwei Endknoten desselben Betreibers unter
  verschiedenen Project-Site-Pfaden ergeben zwei verschiedene
  Identitäten.
- **Visualisierung** als Mermaid-Flowchart mit acht nummerierten
  Schritten in Reihe — Schritte 1–4 sind Einbau (Code), Schritte 5–7
  sind Identitäts- und Spore-Aufbau (Daten), Schritt 8 ist der erste
  Live-Test gegen ein Geschwister.
- **Zweck** — pragmatisch: aus dem Sage-Protokol-Hub wird eine
  produktiv andockende Endknoten-PWA. Keine Vermischung mit dem Bau
  der Module selbst (Karten 01–05).
- **Verantwortlichkeiten** — „Macht" (6 Punkte) und „Macht nicht"
  (6 Punkte). Explizit ausgeschlossen: Modul-Änderungen,
  Singleton-Bruch, Eigenanfragen ins offene Netz, Auto-Update,
  Test-Knöpfe in Produktiv-App, info-Logs für Match-Treffer, Auto-
  Reveal der Doku.
- **Vor dem Einbau zu klärende Werte** — Tabelle mit neun
  Spalten-Werten für beide Endknoten (`<DOMAIN>`, `<ENDPOINT>`,
  `<KNOTENNAME>`, `<KNOTENTYP>`, `<DOMÄNEN-BESCHREIBUNG>`,
  `<DOMÄNEN-STICHWORTE>`, `<INDEX-DATEI>`, `<REPO-NAME>`,
  `<PEER-SPORE-URL>`). Klaus trägt die TBD-Werte nach.
- **Datei-Pfad-Konvention im Endknoten** — verbindlich festgelegt
  (s.u. Punkt „Drei Konventionen", Konvention 1).
- **Andock-Schritt-Pfad** in acht Schritten — jeder mit konkretem
  Code-Snippet (HTML/JS), **Sichtkontrolle** und **häufigem Fehler**
  benannt. Schritte: 1 Dateien kopieren · 2 `<script>`-Tags · 3 SW
  registrieren · 4 `SbkimAnastomose.init()` · 5 `domainVector` via
  `embedPassage` · 6 `generateOwnSpore` mit `domainVector` · 7 Spore
  als `sbkim/spore.json` deployen · 8 ersten Handshake.
- **Sichtkontrolle nach dem Andocken (Pflicht)** — drei Punkte:
  Konsolen-Selbstchecks aller fünf Module, sechs IndexedDB-Stores
  vorhanden, live-Spore-URL liefert Klartext-JSON.
- **Service-Worker-Hinweis** — Pfad, Browser-Voraussetzungen (HTTPS
  oder `localhost`; `file://` geht nicht), Lebenszyklus
  (`skipWaiting()` / `clients.claim()`), Vertrag (HTTP-Codes
  405/415/413/400/503), was der SW NICHT macht (keine Krypto, kein
  Caching, kein Wake-Lock, kein Replay-Cache), Update-Verhalten.
- **Nach dem Einbau zu pflegen** — PULS-Endknoten-Tabelle,
  `status.json` `endknoten[].integrated`, bei Domain-/Domänenwechsel
  Spore neu generieren, bei Hauptversions-Sprung Re-Deploy,
  Schlüsselverlust = Knotentod.
- **Was nicht in den Endknoten gehört** — sechs Punkte (Test-Knöpfe,
  info-Logs, Auto-Reveal-Doku, Pulsation, Crawler, Singleton-Bruch).
- **Risiken & offene Punkte** — sieben Punkte: `domainVector`-Pflicht-
  Frage (Entscheidung dieser Sitzung), CORS bei cross-Betreiber,
  SW-Scope-Falle, Embedding-Modell-Lade-Zeit, Spore-Drift, eingebauter
  `domainVector` ist nicht live-aktualisierbar ohne Re-Deploy,
  `endpointPaths`-Override-Sonderfall, Lücke-Befund (keine fehlende
  Helfer-Funktion in 01–05), `forgetSibling` manuell bis Modul 07.
- **Bauzustand-Tabelle** — Zeile *Spec gefüllt* mit Datum, Sitzung,
  ausführlicher Anmerkung.
- **Querverweise** — alle fünf Code-Module + Modul 07 + Modul 00 +
  Site-Karten + Glossar + Integration-Doku + §0/§1/§2/§3/§4 in
  INTERFACES.md.

### 2. `domainVector`-Pflicht-Frage entschieden — **Variante A**

**Entscheidung: Variante A · Soft-Pflicht im Andock-Workflow.**
`domainVector` bleibt im Spore-Schema (§2 INTERFACES) *optional* —
**kein Hauptversions-Sprung**. Karte 09 macht ihn im Andock-Workflow
zur **verbindlichen Pflicht** (Schritte 5–7 erzeugen, einbauen und
deployen den Vektor). Modul 02 (`generateOwnSpore`, `verifyForeignSpore`)
ändert sich **nicht**. Modul 05 (`receiveHandshake`) lehnt
unverändert mit `outcome:"rejected", reason:"kein domainVector
verfügbar"` ab, wenn jemand trotzdem eine Spore ohne Vektor
publiziert.

**Begründung (fünf Punkte, im Karten-Risiken-Block festgehalten):**

1. **Klaus' Netz ist klein** (3 Nutzer, 2 Endknoten desselben
   Betreibers). Hauptversions-Sprung `0.1 → 1.0` zieht §0, §2, §4,
   Modul 02 (`generateOwnSpore`/`validateSporeMeta`), Karte 02 und
   `status.json.config.PROTOCOL_VERSION` nach — fünf Stellen, eine
   Folge-Pflege-Sitzung. Das ist *asymmetrisch teuer* für ein Risiko,
   das in der Praxis kein zweiter Andocker noch verursacht hat.
2. **Modul 05 lehnt schon korrekt ab.** Wer trotzdem eine Spore
   ohne `domainVector` deployt, bekommt vom Empfänger
   `outcome:"rejected", reason:"kein domainVector verfügbar"` —
   Spec-konform, Schaden bleibt am Verursacher.
3. **`protocolVersion: "0.x"` bedeutet „Erprobungs-Modus"** (§4
   INTERFACES). Der natürliche Anlass für einen Sprung auf `1.0`
   ist nicht jetzt, sondern wenn ein zweiter Betreiber andockt oder
   ein nicht-aktualisierter Endknoten dauerhaft im Netz hängt —
   beides aktuell nicht.
4. **Variante B macht alle bestehenden Spores inkompatibel** —
   auch die provisorischen aus Karte 10 (Live-Generator der Sage-
   Page, die `domainVector` noch nicht setzt). Variante A bricht
   nichts.
5. **Folgesitzung möglich.** Variante B bleibt für eine spätere
   Pflege-Sitzung „Hauptversions-Sprung 0.1 → 1.0" anbietbar,
   wenn das Netz wächst (drei+ Betreiber, Cross-Betreiber-
   Anastomose). Diese Sitzung schließt diese Folgesitzung *nicht*
   aus; sie schiebt sie auf, bis das Netz die Investition
   rechtfertigt.

**Konsequenz für die Implementierung:** Karte 09 Schritte 5–7 sind
**verbindliche Pflicht**. Modul 02-Code ändert sich nicht. Modul 05
lehnt unverändert ab. **Kein** §0/§2/§4-Update, **kein** Modul-02-
Code-Update, **kein** `status.json.config.PROTOCOL_VERSION`-Wechsel —
die Spec-Sitzung 09 bleibt in ihrem Auftrag.

### 3. Drei Andock-Konventionen verbindlich festgelegt

**Konvention 1 · Datei-Pfad im Endknoten:**

```
<endknoten-repo>/
├── index.html                ← fünf SBKIM-Module als <script>-Blöcke inline eingebettet
├── sbkim-sw.js               ← Service-Worker, separate Datei (technisch nötig), Repo-Root
└── sbkim/
    └── spore.json            ← statische Spore, deployt aus dem laufenden Browser
```

Alternative (wenn der Endknoten aus mehreren Dateien wächst): JS-
Module unter `<endknoten>/sbkim/01_storage.js` etc., in `index.html`
als `<script src="sbkim/…">` eingebunden. Reihenfolge bleibt
verbindlich: **01 → 02 → 03 → 04 → 05**. SW bleibt im Repo-Root.

**Begründung:** Klaus' Stil ist Single-File-PWA. Inline-`<script>`
ist sein natürliches Heim. Der SW muss separat sein (Browser-
Vorgabe). Zwei Dateien deployen ist deutlich einfacher als sieben.

**Konvention 2 · Spore-Endpunkt:**

`/sbkim/spore.json` (Alias aus INTERFACES.md §3) als **Andock-
Default**, nicht `/.well-known/sbkim/spore.json`. Konkret heißt
das: die statische Spore-Datei wird unter `<endknoten>/sbkim/spore.json`
im Repo abgelegt; die abrufbare URL ist
`https://klaus.github.io/<repo>/sbkim/spore.json`.

**Begründung:** GitHub Pages baut mit Jekyll (Default), das Dot-
Ordner (`.well-known`) standardmäßig ignoriert. Eine
`.nojekyll`-Datei oder eine `_config.yml`-Override würden das
beheben — aber das ist eine Konfigurations-Hürde, die der Andocker
nicht braucht. `/sbkim/spore.json` ist robust, semantisch
gebündelt mit den anderen `/sbkim/*`-Pfaden und vermeidet die Falle
komplett.

**Konsequenz für PULS:** die offene Querschnitts-Frage
„Speicherort der Spore bei GitHub Pages" ist damit gelöst und in
PULS.md entsprechend markiert.

**Konvention 3 · Service-Worker-Registrierungs-Pfad:**

```js
navigator.serviceWorker.register("sbkim-sw.js")
```

Relativer Pfad → SW-Datei liegt im selben Verzeichnis wie
`index.html` → automatischer Scope `/<repo>/`. Dann fängt der SW
alle eingehenden POSTs unter `/<repo>/sbkim/anastomosis` ab
(`endsWith(ANASTOMOSIS_PATH)`-Logik in `src/sbkim-sw.js` deckt
beide Pfad-Formen ab: `/sbkim/anastomosis` und
`/<repo>/sbkim/anastomosis`).

**Scope-Falle ausdrücklich dokumentiert:** Wer den SW unter
`<endknoten>/sbkim/sbkim-sw.js` ablegt, bekommt nur Scope
`/<repo>/sbkim/`. Anastomose funktioniert dort technisch noch,
aber spätere Schutz-Module (11 Rate-Limit, 12 Blocklist) können
Pfade unterhalb von `/<repo>/` ohne `/sbkim/`-Präfix nicht
abfangen. **Konvention: SW immer im Repo-Root.**

### 4. INTERFACES.md §1 Modul 09 auf `entwurf` + §6 Eintrag

§1 Modul 09 von Status `schablone` (mit „noch zu spezifizieren"-
Platzhalter) auf Status `entwurf` mit voller Vertrag-Sektion gehoben.
Enthält:

- **Datei:** `docs/components/09_einbau_pwa.md` (Anleitung, kein
  JS-Modul). Erläuterung: Status-Codes sind formal für JS-Module;
  09 nutzt `entwurf` als Marker für „Spec fertig, Inhalt verbindlich".
- **Bietet:** Schritt-für-Schritt Andock-Anleitung in acht Schritten.
  Die drei Andock-Konventionen verbindlich aufgezählt.
- **Nutzt-von:** Endknoten-Repos Rezeptbuch + Mixarium.
- **Abhängigkeiten:** keine im Bau-DAG (formal). Inhaltlich alle fünf
  Code-Module + Service-Worker `src/sbkim-sw.js`.
- **`domainVector`-Pflicht-Entscheidung:** explizit dokumentiert mit
  Begründungs-Verweis auf Karte 09.

§6 Änderungsprotokoll-Zeile am unteren Ende der Tabelle (neueste
unten) — fasst die Spec-Sitzung 09 in einer Zeile zusammen:
acht-Schritt-Pfad, Datei-Pfad-Konvention, Spore-Endpunkt-Konvention,
SW-Registrierungs-Konvention, Sichtkontrolle-3-Pflicht-Punkte,
`domainVector`-Entscheidung Variante A, kein Hauptversions-Sprung.

### 5. status.json + Pie regeneriert

Modul 09 von `score:"schablone"` / `siegel:"noch nicht gebaut"` /
`kurz:"Anleitung zum Einbau in Endknoten-PWAs"` auf
`score:"spec"` / `siegel:"Spec fertig"` / `kurz:"Andock-Anleitung
für Endknoten — Module kopieren, Spore mit domainVector erzeugen,
Service-Worker registrieren"`.

`python3 scripts/update_puls_pie.py` lief, Pie regeneriert:

- Schablone: 7 → 6
- Werkstatt: 1 → 1
- Spec fertig: 0 → 1
- Code-Stub: 5 → 5
- Fertig: 0 → 0

Genau wie das Briefing vorgibt.

### 6. PULS-Schnellüberblick + „Als nächstes ✨" aktualisiert

- Schnellüberblicks-Zeile Modul 09: `Spec fertig (2026-05-14)` /
  `— (Anleitung, kein JS-Modul)` / `—` / kurze Notiz mit Soft-Pflicht-
  Entscheidung + Datei-Pfad-Konvention + Spore-Endpunkt.
- „Als nächstes ✨" um eine neue Zwischen-Gruppe „Spec frisch, Bau
  ausstehend (Anleitung)" mit Modul 09 ergänzt. ✨-Marker für 09
  entfernt (Spec ist nicht mehr ausstehend, der Schritt ist jetzt
  Bau — also Live-Andocken).
- Empfehlungs-Text umgestellt: **Bau-Sitzung Modul 09 Einbau-PWA mit
  Klaus am Browser** als Haupt-Empfehlung; Spec-Sitzung Modul 07 als
  Parallel-Spec; Modul 00 (Doku-Fenster) als zweite Parallel-Option;
  Sichttest Karte 05 (acht Knöpfe in Panel 05) explizit als Vor-
  Bedingung für den Live-Andock-Versuch genannt (Modul 05 wird im
  Andock-Workflow ausgeführt — Sichttest davor ist die schnellere
  Diagnose-Ebene).
- Offene Querschnitts-Frage „Speicherort der Spore" als gelöst
  durchgestrichen, Auflösung mit Datum und Verweis auf Karte 09
  Schritt 7 dokumentiert.
- Neuer Sitzungs-Eintrag oben mit Was getan / Frischer-Kopf-Befund /
  Was offen blieb / Nächster sinnvoller Schritt.

### 7. WEGWEISER-Stand-Block-Zeile

Eine Zeile unten im Stand-Block ergänzt (Wanderung — neueste Zeile
unten), umfangreich, weil die Karte 09 alle drei Konventionen + die
Pflicht-Entscheidung + den Acht-Schritt-Pfad zusammenfasst.

---

## Frischer-Kopf-Befund: keine API-Korrektur, eine Pflicht-Entscheidung,
drei Konventions-Entscheidungen

Das Briefing erlaubte API-Korrekturen an Modul 01–05, wenn beim
Durchgehen eine Lücke auffiele, die einen Andocker blockieren würde.
Beim Lesen kein solcher Punkt — alle benötigten Surface-Einträge
sind exportiert:

- `SbkimStorage.{init, get, put, del, all, clear, getStore}`
- `SbkimSpore.{init, getOrCreateIdentity, getNodeId, getPublicKeyJwk,
  generateOwnSpore, getOwnSpore, verifyForeignSpore}`
- `SbkimEmbedding.{init, isReady, embedQuery, embedPassage,
  embedQueryBatch, embedPassageBatch}`
- `SbkimMatch.{match, isAboveProviderThreshold, PROVIDER_MIN_MATCH}`
- `SbkimAnastomose.{init, handshake, receiveHandshake, listSiblings,
  forgetSibling}`

Der Andock-Workflow nutzt davon nur eine kleine Teilmenge —
`SbkimEmbedding.{init, embedPassage}`, `SbkimSpore.{getOrCreateIdentity,
generateOwnSpore, getOwnSpore}`, `SbkimAnastomose.{init, handshake}`,
plus die Service-Worker-Registrierung. Alles vorhanden. Der Lücke-
Hinweis ist als Risiko-Punkt in Karte 09 dokumentiert (negativ-Befund:
„keine fehlende Helfer-Funktion identifiziert"), damit eine spätere
Pflege-Sitzung den Status sieht ohne nochmal alle fünf Module zu
inspizieren.

Eine zweite frischer-Kopf-Beobachtung: **Modul 02 `getOrCreateIdentity`
wird vom Andocker nicht direkt aufgerufen** — `SbkimAnastomose.init()`
ruft es intern (siehe Briefing-Vorgabe und Karte 05 § Schnittstelle).
Klaus muss also nur `await SbkimAnastomose.init()` aufrufen; die
Identität entsteht beim Aufruf, ohne dass der Andocker `Sbkim*`-
Aufrufe in der falschen Reihenfolge oder doppelt machen kann. Sauber.

Die drei Andock-Konventionen waren im Briefing als „Sitzung
entscheidet" gekennzeichnet — entschieden mit Begründungs-Block in
der Karte:

- **Konvention 1 · Datei-Pfad:** SW im Endknoten-Repo-Root, JS-Module
  inline in `index.html` (Klaus-Default) oder alternativ unter
  `<endknoten>/sbkim/`. Begründung: Single-File-PWA-Stil + SW-Scope.
- **Konvention 2 · Spore-Endpunkt:** `/sbkim/spore.json` (§3-Alias),
  weil GitHub-Pages-Jekyll-Dot-Ordner-Falle. Begründung: robuster +
  semantisch gebündelt.
- **Konvention 3 · SW-Registrierungs-Pfad:** `register("sbkim-sw.js")`
  aus Repo-Root, automatischer Scope `/<repo>/`. Scope-Falle
  dokumentiert.

Die `domainVector`-Pflicht-Frage war als „verbindlich entscheiden,
keine Verschiebung" gekennzeichnet — Variante A gewählt mit fünf-Punkt-
Begründung. Konsequenz: keine §0/§2/§4-Folgearbeit, kein Modul-02-
Code-Update, kein `PROTOCOL_VERSION`-Wechsel. Spec-Sitzung 09 bleibt
in ihrem Auftrag.

---

## Was offen blieb

- **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Browser** — die acht
  Schritte aus Karte 09 *live* durchlaufen an Rezeptbuch und/oder
  Mixarium. Liefert den ersten echten Handshake zwischen zwei
  Endknoten desselben Betreibers (gleicher Origin → kein CORS-Problem).
  Voraussetzung: Klaus hat die Werte `<DOMAIN>`, `<ENDPOINT>`,
  `<DOMÄNEN-STICHWORTE>` etc. für beide Endknoten gesammelt (siehe
  Tabelle in Karte 09 § Vor dem Einbau zu klärende Werte). Diese
  Bau-Phase füllt die Bauzustand-Tabelle Zeile *Erstmaliger Einbau
  Rezeptbuch* / *Mixarium*.
- **Sichttest Karte 05 durch Klaus** — Panel 05 mit acht Knöpfen
  (Setup + sieben Test-Punkte). Sollte idealerweise *vor* der
  Bau-Sitzung 09 laufen — Modul 05 wird im Andock-Workflow
  ausgeführt; ein vorgängiger Sichttest ist die schnellere Diagnose-
  Ebene bei Andock-Problemen.
- **`forgetSibling`-UI-Pfad im Endknoten.** Karte 09 erwähnt, dass
  der Andocker dem Betreiber eine UI-Möglichkeit anbieten sollte,
  ein Geschwister manuell zu vergessen (bis Modul 07 Apoptose den
  TTL-Pfad liefert). Konkrete UI-Empfehlung gehört in Bau-Sitzung 09
  oder eine spätere Pflege-Sitzung — diese Spec-Sitzung markiert es
  nur als „offen".
- **Cross-Betreiber-CORS.** Rezeptbuch ↔ Mixarium funktionieren ohne
  CORS-Probleme (gleicher Origin `klaus.github.io`). Andocken an
  einen Endknoten anderen Betreibers braucht CORS-Header beim
  Empfänger — GitHub Pages liefert das nicht automatisch. Eine
  Folge-Pflege-Sitzung „CORS-Pfad für fremde Origins" ist anbietbar,
  sobald ein zweiter Betreiber andockt.
- **`domainVector`-Pflicht-Hebung (Variante B) bleibt anbietbar.**
  Wenn das Netz wächst (drei+ Betreiber, dauerhafter Cross-
  Betreiber-Verkehr), kann die Pflicht-Hebung in einer eigenen
  Pflege-Sitzung „Hauptversions-Sprung 0.1 → 1.0" sauber durchgezogen
  werden — mit Migrations-Plan, `verifyForeignSpore`-Update, Karte-
  02-Nachzieher und `status.json.config.PROTOCOL_VERSION`-Wechsel.
  Diese Sitzung schließt das *nicht* aus; sie schiebt es auf.
- **PULS.md Zeilen-Längen-Schwellwert.** CLAUDE.md sagt 400 Zeilen
  Maximum, jetzt deutlich darüber. Älteres in
  `docs/sessions/archiv/` umzuziehen ist Querschnitts-Aufräum-Arbeit
  für eine eigene Sitzung — nicht Teil dieser Spec-Sitzung. Die
  letzten fünf Sitzungen sind genauso vorgegangen.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Browser** — die
   acht Schritte aus Karte 09 *live* durchlaufen an Rezeptbuch
   und/oder Mixarium. Liefert den ersten echten Handshake und füllt
   die Bauzustand-Tabelle. **Vorbereitung Klaus:** Werte für die
   beiden Endknoten sammeln (Tabelle in Karte 09).
2. **Sichttest Karte 05 durch Klaus** — Panel 05 mit acht Knöpfen
   (idealerweise *vor* Punkt 1).
3. **Spec-Sitzung Modul 07 Apoptose** — Vorbedingungen 01 + 02
   erfüllt, signiertes Vermächtnis braucht den Ed25519-Schlüssel aus
   02. Liefert den TTL-Pfad, der `forgetSibling` ergänzt. Unabhängig
   von 09-Bau.
4. Parallel anbietbar: **Spec-Sitzung Modul 00 (Doku-Fenster)** —
   dependenz-frei, 5-Klick-UI in der Endknoten-PWA.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/components/09_einbau_pwa.md` vollständig gefüllt
      (Karte 09, ~470 Zeilen, Stil 02/04/05) mit Hero · Im Mycel-Bild ·
      Visualisierung · Zweck · Verantwortlichkeiten · Vor dem Einbau
      zu klärende Werte · Datei-Pfad-Konvention · Andock-Schritt-Pfad
      in 8 Schritten · Sichtkontrolle · Service-Worker-Hinweis ·
      Nach dem Einbau zu pflegen · Was nicht in den Endknoten gehört ·
      Risiken & offene Punkte · Bauzustand · Querverweise
- [x] `domainVector`-Pflicht-Frage **verbindlich entschieden:
      Variante A · Soft-Pflicht im Andock-Workflow** (kein
      Hauptversions-Sprung 0.1 → 1.0). Begründung in fünf Punkten
      in Karte 09 § Risiken & offene Punkte
- [x] **Konsequenz korrekt umgesetzt:** Modul 02 (`generateOwnSpore`,
      `verifyForeignSpore`) UNVERÄNDERT, INTERFACES.md §0
      `PROTOCOL_VERSION: "0.1"` UNVERÄNDERT, §2 Spore-JSON-
      Pflichtfeld-Liste UNVERÄNDERT, §4 Versionierungs-Regeln
      UNVERÄNDERT, `status.json.config.PROTOCOL_VERSION` UNVERÄNDERT.
      Variante A ist ein Anleitungs-Schritt, kein Schema-Update.
- [x] **Datei-Pfad-Konvention verbindlich:** SW `sbkim-sw.js` im
      Endknoten-Repo-Root; JS-Module 01–05 inline in `index.html`
      (Klaus-Default) oder alternativ unter `<endknoten>/sbkim/`;
      Reihenfolge 01 → 02 → 03 → 04 → 05
- [x] **Spore-Endpunkt-Konvention verbindlich:** `/sbkim/spore.json`
      (Alias aus §3), nicht `.well-known/`; offene Querschnitts-Frage
      in PULS gelöst markiert
- [x] **Service-Worker-Registrierungs-Konvention verbindlich:**
      `navigator.serviceWorker.register("sbkim-sw.js")` aus Repo-Root
      mit automatischem Scope `/<repo>/`; Scope-Falle bei Ablage
      unter `<endknoten>/sbkim/sbkim-sw.js` ausdrücklich dokumentiert
- [x] **Andock-Schritt-Pfad** für nicht-programmierenden Andocker
      durchklickbar: alle acht Schritte mit konkreten HTML/JS-Snippets,
      Sichtkontrolle-Output und häufigen Fehlern dokumentiert
- [x] **Sichtkontrolle (3 Pflicht-Punkte)** in eigenem Block:
      Konsolen-Selbstchecks der fünf Module · sechs IndexedDB-Stores ·
      live-Spore-URL liefert Klartext-JSON
- [x] `docs/INTERFACES.md` §1 Modul 09 auf Status `entwurf` mit
      voller Vertrag-Sektion (Datei, Bietet, Nutzt-von, Abhängigkeiten,
      `domainVector`-Pflicht-Entscheidung, drei Andock-Konventionen)
- [x] `docs/INTERFACES.md` §6 Änderungsprotokoll-Zeile am unteren
      Ende ergänzt (neueste unten)
- [x] **Kein JS-Code unter `src/` geändert** — Spec-Charakter dieser
      Sitzung gehalten. Modul 09 ist eine Anleitung, kein JS-Modul.
- [x] `status.json` Modul 09 auf `score:"spec"` / `siegel:"Spec
      fertig"` mit aktualisiertem `kurz`-Feld (keine anderen Modul-
      Scores geändert)
- [x] `python3 scripts/update_puls_pie.py` gelaufen (Schablone 7→6,
      Spec fertig 0→1; Code-Stub bleibt 5, Werkstatt bleibt 1)
- [x] Karte 09 Hero-Badge auf 🟨 Spec fertig
- [x] Karte 09 Bauzustand-Tabelle: Zeile *Spec gefüllt | 2026-05-14 |
      Spec 09 | …* ergänzt
- [x] `docs/PULS.md` Sitzungs-Eintrag oben, Schnellüberblick und „Als
      nächstes ✨" aktualisiert; offene Querschnitts-Frage „Speicherort
      der Spore" gelöst markiert
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile unten ergänzt (Wanderung,
      neueste Zeile unten)
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/spec-09-einbau-pwa-6Ej1r` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
