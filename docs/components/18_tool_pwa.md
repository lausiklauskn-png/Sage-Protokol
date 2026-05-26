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

## Klaus-Festlegungen 2026-05-25 + 2026-05-26 (vor Spec-Sitzung)

Klaus hat in der Stub-Anlage-Sitzung + der Tafel-Spec-Pflege Mycel-
Vision (2026-05-26) Spec-Punkte vorab festgelegt:

1. **Sub-Bereiche: alle neun** (erweitert von 5 auf 9 in Tafel-Spec-
   Pflege 2026-05-26) sind Pflicht-Bestandteil des Tool-PWA-
   Containers (a–i, siehe § Sub-Bereiche unten). Die Spec-Sitzung 18
   entscheidet nur noch die internen Details pro Sub-Bereich (Modal-
   Form, Schema, Risiken).
2. **Code lebt als Modul 18 in Sage-Protokol** — analog Modul 17.
   Jeder Endknoten kopiert die Datei (`src/modules/18_tool_pwa.js`)
   in sein eigenes `sbkim/`-Verzeichnis. Eigene Mini-Repo-Variante
   ist KEIN Ziel.
3. **Empfangsmodus-Prinzip wahren:** Andocken (Sub a) ist eine
   explizite User-Geste, **kein Auto-Polling** (Klaus' Klärung
   2026-05-26 als Antwort auf seine eigene Henne-Ei-Frage). Der
   Bronze-Stufen-SIEGEL (Modul 16 Sub e seit 2026-05-26) macht das
   SIEGEL klickbar auch ohne Mycel-Verbindung — d.h. Andock-Geste
   ist über SIEGEL-Klick → Modul 18 Sub (a) sofort erreichbar.

Diese Festlegungen sind Tafel-Charakter und bleiben in der Voll-
Spec-Sitzung 18 fix; die offenen Punkte unter „§ Sub-Bereiche (Spec-
Skizze, offen)" werden in der Voll-Spec auf Basis dieser drei
Festlegungen detailliert.

---

## Sub-Bereiche (Spec-Skizze, erweitert von 5 auf 9 in 2026-05-26)

Diese Liste ist eine **Vorschlags-Skizze** — die volle Spec-Sitzung 18
entscheidet die internen Details. Klaus' Festlegung 2026-05-26:
**alle neun Sub-Bereiche** sind Pflicht-Bestandteil des Tool-PWA-
Containers; optional ist nur die UI-Sichtbarkeit pro Tab.

### Sub (a) — Andocken (URL eingeben, Spore fetchen, Match-Check, Handshake)

Explizite Andock-Geste in vier Schritten:

1. **URL eingeben** (Geschwister-Repo, z.B.
   `https://lausiklauskn-png.github.io/Mein-Mixarium/`).
2. **Spore fetchen** (`fetch(url + "/sbkim/spore.json")`).
3. **Match-Check** (`SbkimMatch.match(ownDomainVector, foreignDomainVector)`
   ≥ `PROVIDER_MIN_MATCH`).
4. **Handshake** (`SbkimAnastomose.handshake(foreignSpore)`).

Sichtbar wie der Sage-Page-Andock-Wizard (`index.html` § Schwarz-Loch-
Karte), aber als modulares Tool **innerhalb** der Endknoten-PWA.

**Klaus' Klärung 2026-05-26 (Empfangsmodus-Prinzip):** Andocken ist
explizite User-Geste, **kein Auto-Polling**. Bronze-SIEGEL-Stufe
(Modul 16 Sub e) macht den SIEGEL klickbar auch ohne Mycel-
Verbindung, damit Andocken ohne Voraus-Voll-SIEGEL möglich ist.

**Offene Spec-Punkte:**

- Endknoten-Bauer muss `endpoint` + `domain` + `domainKeywords` + ggf.
  `stammCategories`/`guestCategories` in `init({…})` mitgeben — wie?
- Wer triggert das Embedding-Modell-Lazy-Load (~30 MB Modul 03)?
- Was passiert, wenn `match()` unter Schwelle (0.80)? UI-Warnung +
  trotzdem-Handshake-Knopf, oder hartes Abbrechen?

### Sub (b) — Bidirektionaler Sporen-Informationsaustausch (Heterokaryose)

**NEU 2026-05-26 (war vorher als „Sporen-Installation" unter (b)
geführt; Klaus' Vision-Klärung trennt Andocken (a) von Anker-Tausch (b)).**

Anker-Tausch unter bestehenden Geschwistern via Modul 06
(`SbkimHeterokaryose.requestHeterokaryosis` + Co-Schreiber-Flag aus
Modul 08). UI-Liste der Geschwister mit Heterokaryose-Opt-In-Status,
Knopf „Anker anfordern" pro Geschwister, Eingehende-Anker-Inbox
(`sbkim_hetero_inbox_<slotKey>`).

**Offene Spec-Punkte:**

- Soll Modul 18 die `heterokaryosisOptIn`-Flag pro Sibling auch
  toggle-able machen, oder bleibt das ausschließlich Modul-08-UI?
- Wie wird Anker-Inbox visualisiert (Tab in Modul 18 vs. eigene
  Sektion)?

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

### Sub (f) — Sporen NEU generieren (NEU 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26: ein Endknoten muss
seine Spore im Lauf der Zeit anpassen können — z.B. Kategorien
hinzufügen, `domainKeywords` ändern, neue `embeddingNeeds` setzen.
Sporen-Regeneration ist konzeptionell dasselbe wie Andocken (Sub a),
aber **ohne neue Identität** — Spore-Datei wird mit der bestehenden
`nodeId` neu signiert und auf den Endknoten-Server gelegt.

UI:

1. Aktuelles Spore-JSON anzeigen (Read-Only) mit Diff-Marker.
2. Felder editierbar: `domain`, `domainKeywords`, `stammCategories`,
   `guestCategories`, optional `embeddingCapabilities` /
   `embeddingNeeds`.
3. „Spore neu erzeugen + signieren"-Knopf:
   `SbkimSpore.regenerateOwnSpore(updates)` (ruft intern erneut Modul
   03 lazy für neuen `domainVector` wenn `domainKeywords` geändert
   wurden, signiert mit aktuellem Privat-Schlüssel).
4. Download-Knopf für die neue `spore.json` (Endknoten-Bauer ersetzt
   die alte `sbkim/spore.json` im Repo + committet).

**Offene Spec-Punkte:**

- Soll die Spore-Regeneration auch automatisches Re-Embedding
  triggern (Sub g), oder ist das ein separater Schritt?
- Pflicht-Bestätigung bei `domainKeywords`-Wechsel (alte Geschwister-
  Matches könnten brechen)?
- Wie wird die alte Spore archiviert (lokaler Backup-Schreibpfad)?

### Sub (g) — Re-Embedding (NEU 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26. Wenn das Embedding-
Modell aktualisiert wird (Modul 03 Modell-Wechsel) ODER wenn der
Endknoten neue lokale Inhalte (Rezepte / Cocktails) erzeugt hat,
müssen die Vektoren neu gerechnet werden.

UI:

1. Liste aller embedded Vektoren (Spore + Korpus-Items für `queryLocal`).
2. „Alle neu embedden"-Knopf (`SbkimEmbedding.embedPassage` über
   Modul 03 lazy für jeden Eintrag, sequenziell mit Progress-Bar).
3. „Korpus-Eintrag hinzufügen"-Formular (Label + Text → Modul 03 →
   `passageVec` → Local-Storage / IndexedDB).

**Offene Spec-Punkte:**

- Wie wird der lokale Korpus persistiert? (`SbkimMatch.setLocalCorpus`
  + IndexedDB-Store oder reiner RAM-Pfad?)
- Progress-Bar bei großen Korpora — wie viel UI-Feedback?
- Soll Re-Embedding einen `embeddingVersion`-Marker mit `domainVector`
  abgleichen (Drift-Erkennung), oder ist das Modul-04-Pflicht?

### Sub (h) — Manueller Handshake-Trigger aus Sibling-Liste (NEU 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26. Bestehende Geschwister
können re-handshaked werden, um einen Bronze→Gold-Stufenwechsel im
SIEGEL zu triggern (Modul 16 Sub e). UI-seitig sichtbar als Liste in
Modul 18.

UI:

1. Liste aller Geschwister aus `sbkim_siblings_<slotKey>` (Modul 05).
2. Pro Sibling: Status-Lampe (live / silent / apoptotic), Knopf
   „Handshake versuchen" → `SbkimAnastomose.handshake(siblingSpore)`.
3. Erfolgsfall: `sbkim:handshake outcome:"established"`-Event triggert
   Modul 16 Sub (e) Bronze→Gold-Wechsel.
4. Fehler-Fall: UI zeigt Grund (Timeout / Schwelle / Signatur).

**Offene Spec-Punkte:**

- Soll Modul 18 ein automatisches „re-handshake-on-startup" für alle
  Geschwister anbieten? (Klaus' Empfangsmodus-Klausel sagt: kein
  Auto-Polling — also NEIN als Default.)
- Soll der Handshake-Erfolg in der Sibling-Liste persistiert werden
  (`sbkim_anastomosis_log_<slotKey>`), oder reicht der Bronze→Gold-
  Wechsel-Visual?

### Sub (i) — Spore-Discovery (NEU 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26 (ersetzt die alte Sub (b)
„Sporen-Installation per URL"). Neue Sporen finden via:

1. **Hub-Anfrage an Sage-Page-`status.json`** (Klaus' Mycel — fetch
   `https://lausiklauskn-png.github.io/Sage-Protokol/status.json`,
   `endknoten[]`-Liste extrahieren, jeden Eintrag als potenzielles
   Andock-Ziel anzeigen).
2. **Hub-Anfrage an Externen-Mycel-Hub-`status.json`** (Forker-Mycel
   — siehe [`_mycel_hub.md`](_mycel_hub.md); URL aus Endknoten-
   `init({externalHubUrl})`-Option).
3. **User-URL-Input** (Klaus tippt direkt eine Repo-URL ein, z.B. von
   einem Pepo-Forker-Knoten, der weder in Sage noch im externen Hub
   gelistet ist).

UI:

1. Drei-Tab-Sektion (Sage-Mycel / Externer-Hub / Manuelle-URL).
2. Pro Tab: Liste der gefundenen Sporen + „Andocken"-Knopf
   (triggert Sub a).
3. Pre-Check: Match-Score-Vorschau vor Andocken (Modul 04 + Spore-
   `domainVector`).

**Offene Spec-Punkte:**

- Soll Spore-Discovery die Sporen direkt herunterladen + validieren,
  oder nur die URL-Liste anzeigen?
- Cross-Origin-CORS-Hinweise bei Forker-Hub-`status.json`-Fetch?
- Anti-Spam: wie viele Sporen-Discovery-Aufrufe pro Session?

---

## Such-Feld-Integration-Pattern (NEU 2026-05-26, Tafel-Spec-Pflege Mycel-Vision)

**Anlass:** Klaus' Kern-Vision 2026-05-26: das **Such-Feld in einer
Endknoten-PWA** ist der bidirektionale Cross-Knoten-Matching-Anker.
Beispiel: User tippt in Mein-Rezeptbuch „welcher Wein passt zu
Lasagne" → Sender-Helper sendet `op:"query"` postMessage an alle
Geschwister-Sporen → Modul 15 Sub (b) der Geschwister-Knoten rufen
`SbkimMatch.queryLocal()` (Modul 04.C) → `op:"queryResult"` zurück
→ UI zeigt Cross-Knoten-Treffer mit Verweis-Link.

**Pepo-Demo-Studie (Referenz):**

Klaus' [Semantic Match Demo](https://github.com/lausiklauskn-png/semantic-match-demo)
(extern, NICHT Sage-Protokol-Repo) ist eine **andere Architektur-
Vorlage** für die bidirektionale Match-UI, NICHT für die Transport-
Schicht. Wichtige Übertragbare Pattern:

- **Symmetrie-Anforderung:** beide Parteien beschreiben Fähigkeiten
  UND Bedarf (Vier-Feld-Eingabe). In Sage-Mycel reduziert auf:
  Endknoten haben Spore (= Fähigkeit / Bedarf), Such-Text ist
  implizit „Bedarf" — Such-Pattern ist **eine** Eingabe, nicht vier.
- **Score-Ring (0-100%):** UI-Visualisierung des Match-Scores als
  Kreis-Ring, Farben teal/gold/rot bei ≥70%/40-69%/<40%. Lässt sich
  pro Cross-Knoten-Treffer in Mein-Rezeptbuch-UI rendern.
- **Drei-Dimensionen-Anzeige:** Demo zeigt fachlich/prozess/skalierung
  als drei Bars. Entspricht Modul 04.A `matchDimensions` — bei
  `queryLocal` ist meist nur `fachlich` relevant (Sub-Spec für Modul
  04.C entscheidet).
- **Match-Liste + Differenz-Liste:** zwei Listen pro Cross-Knoten-
  Treffer („was passt" + „was fehlt"). Lässt sich pro Endknoten-PWA
  bauen, ist aber UI-Pflege, nicht Modul-18-Pflicht.

**Nicht übernehmbar:**
- WebRTC/PeerJS-Transport (Demo nutzt PeerJS; Sage nutzt
  postMessage + BroadcastChannel via Modul 15).
- Claude-API als zentrale Match-Engine (Demo rechnet alles per
  Claude-API; Sage rechnet lokal via Modul 03 + 04 + optional
  Stufe-B-LLM via 04.B).
- Tablet-Hub-Vermittler-Modell (Demo hat Tablet als Hub; Sage hat
  dezentrale Peers).

### Dual-Modus-Klassifikation (Stichwort vs. Semantik) — 2026-05-26

Klaus' Heuristik 2026-05-26: nicht jede Eingabe ins Such-Feld ist eine
semantische Anfrage. Wer „Gulasch" tippt, will den vorhandenen Rezept-
Datensatz „Muttis Gulasch" sehen — kein Cross-Knoten-Embedding-Pass.
Wer „welcher Wein passt zu Lasagne?" tippt, **will** semantische
Antwort und braucht den Cross-Knoten-Schritt.

**Klassifikation (3 Signale, alle drei müssen für „Stichwort" erfüllt
sein):**

1. **Wort-Anzahl ≤ 3** (Whitespace-Split, Leerzeilen-Trim).
2. **Kein Fragezeichen** im Text.
3. **Kein Bridge-Word**. Bridge-Words sind die deutschen Wörter, die
   typisch eine semantische Brückenfrage einleiten:
   ```
   welcher, welches, welche,
   passt, zu, für, mit, ohne,
   wie, wann, warum,
   was, wer, wo
   ```
   Match: case-insensitiv, ganzes Wort (`/\b…\b/i`).

Erfüllt eine Eingabe **alle drei** → **Stichwort-Modus** (lokale Filter-
Suche auf die App-eigene Domain-Inhalts-Liste, ohne Modul 03/04). Sonst
→ **Semantik-Modus** (`queryLocal` + Cross-Knoten-Query).

Beispiele:

| Eingabe                                       | Wörter | ? | Bridge | Modus      |
|-----------------------------------------------|--------|---|--------|------------|
| `Gulasch`                                      | 1      | nein | nein | Stichwort  |
| `Spaghetti`                                    | 1      | nein | nein | Stichwort  |
| `Alkoholfreie Nachspeisen`                     | 2      | nein | nein | Stichwort  |
| `Spaghetti welche Sorte`                       | 3      | nein | **ja** (welche) | Semantik   |
| `welcher Wein passt zu Gulasch?`               | 5      | ja | ja   | Semantik   |
| `Hauptgang mit wenig Aufwand`                  | 4      | nein | ja (mit) | Semantik   |
| `Erdbeerkuchen`                                | 1      | nein | nein | Stichwort  |
| `wie mache ich Erdbeerkuchen?`                 | 4      | ja | ja   | Semantik   |

**Klassifikations-Funktion (Endknoten-Pflicht):**

```js
const BRIDGE_WORDS = [
  "welcher","welches","welche",
  "passt","zu","für","mit","ohne",
  "wie","wann","warum",
  "was","wer","wo",
];
const BRIDGE_RE = new RegExp(
  "\\b(?:" + BRIDGE_WORDS.join("|") + ")\\b",
  "i",
);

function classifySearch(text) {
  const trimmed = String(text || "").trim();
  if (trimmed.length === 0) return "leer";
  const wordCount = trimmed.split(/\s+/).length;
  const hasQuestionMark = trimmed.includes("?");
  const hasBridgeWord = BRIDGE_RE.test(trimmed);
  if (wordCount <= 3 && !hasQuestionMark && !hasBridgeWord) {
    return "stichwort";
  }
  return "semantik";
}
```

### Such-Helper (Endknoten-Pflicht, kein Modul-Code)

```js
async function runSearch(text, opts) {
  const mode = classifySearch(text);
  if (mode === "leer")     return { mode, localResults: [], crossResults: [] };
  if (mode === "stichwort") {
    // Stichwort-Modus: lokal-Filter auf die App-eigene Domain-Liste.
    // KEIN queryLocal-Aufruf, KEIN Cross-Knoten-Pass. App ist
    // verantwortlich für die Filter-Funktion (Substring-Match auf
    // Titel / Tags / Kategorie der lokalen Items).
    const localResults = opts.localKeywordFilter(text);
    return { mode, localResults, crossResults: [] };
  }
  // Semantik-Modus: queryLocal + Cross-Knoten parallel.
  const k = opts.k || 5;
  const [localResults, crossResults] = await Promise.all([
    SbkimMatch.queryLocal(text, k),          // Modul 04.C
    sendCrossKnotenQuery(text, k, opts),     // siehe Sender-Helper unten
  ]);
  return { mode, localResults, crossResults };
}
```

`opts.localKeywordFilter` ist eine Endknoten-Funktion, die Synchron
über die App-Daten filtert (z.B. Substring-Match in Titeln). Sie
existiert pro App separat — Mein-Rezeptbuch filtert über Rezept-
Titel + Tags, Mein-Mixarium über Cocktail-Namen + Kategorien.

### Sender-Helper-Code-Pattern (Spec-Vorbereitung)

Im Semantik-Modus muss neben `queryLocal` auch eine `op:"query"`-
Botschaft an die Geschwister-Sporen gehen. Sender-Mechanismus:

```js
async function sendCrossKnotenQuery(text, k, opts) {
  // Geschwister aus Modul 05 sibling-Store lesen (slot-spezifisch).
  const siblings = opts.siblings || [];          // Endknoten lädt einmalig
  if (siblings.length === 0) return [];

  // Pro Geschwister: postMessage op:"query" via BroadcastChannel.
  // Für cross-origin Mycel-Mitglieder (Forker) wäre window.postMessage
  // an ein eingebettetes iframe der Empfehlungs-Pfad (Spec für eine
  // spätere Iteration).
  const channel = new BroadcastChannel("sbkim-membrane");
  const replies = [];
  const TIMEOUT_MS = 3000;

  const collected = await Promise.all(siblings.map(s => sendOne(s)));

  channel.close();
  return collected.flat();

  function sendOne(sibling) {
    return new Promise(resolve => {
      const nonce = crypto.randomUUID();
      const handler = (e) => {
        const env = e.data;
        if (!env || env.type !== "sbkim/membrane/v1") return;
        if (env.op !== "queryResult") return;
        if (env.inReplyTo !== nonce) return;
        channel.removeEventListener("message", handler);
        clearTimeout(timer);
        const results = (env.payload && Array.isArray(env.payload.results))
          ? env.payload.results
          : [];
        resolve(results.map(r => ({
          ...r,
          siblingOrigin: sibling.origin,
          siblingNodeId: sibling.nodeId,
        })));
      };
      const timer = setTimeout(() => {
        channel.removeEventListener("message", handler);
        resolve([]);   // Timeout → leere Liste, kein Fehler
      }, TIMEOUT_MS);
      channel.addEventListener("message", handler);

      channel.postMessage({
        type:       "sbkim/membrane/v1",
        op:         "query",
        fromOrigin: window.location.origin,
        nonce:      nonce,
        payload:    { text: text, k: k },
      });
    });
  }
}
```

Hinweis: dieses Pattern ist **BroadcastChannel-basiert** (same-origin
Mycel, Klaus' Apps auf `lausiklauskn-png.github.io`). Für cross-origin-
Forker entscheidet eine spätere Spec-Sitzung den genauen Transport
(typisch `window.postMessage` an ein iframe der Geschwister-PWA).
**Modul 15 ist nur Empfänger** — der Sender lebt im Endknoten-Code,
nicht in Modul 15.

### UI-Pattern: zwei Sektionen mit Bedienungs-Vokabular

Endknoten-PWA-Such-Feld zeigt **zwei Ergebnis-Sektionen** nach einem
Semantik-Pass:

```
┌─────────────────────────────────────────────────┐
│ Suche: "welcher Wein passt zu Lasagne?"         │
├─────────────────────────────────────────────────┤
│ ▸ Lokal (Mein-Rezeptbuch)                       │
│   — keine Treffer (oder Top-5-Liste)            │
│                                                  │
│ ▸ Aus dem Mycel (Geschwister-Knoten)            │
│   • Chianti Classico (0.91)        → Mixarium   │
│   • Sangiovese (0.88)              → Mixarium   │
│   • Trockene Rotweine (0.84)       → Mixarium   │
└─────────────────────────────────────────────────┘
```

Im Stichwort-Modus wird nur die lokale Sektion gezeigt (kein „Aus dem
Mycel"-Block, weil kein Cross-Knoten-Pass lief).

**Spalten:** Label · Score (optional, 0.00–1.00 oder Prozent-Form) ·
„→ <Geschwister-Name>"-Link.

### Anker-Pfad in Cross-Knoten-Treffer (Konvention)

Cross-Knoten-Treffer-Link öffnet die Geschwister-PWA mit URL-Fragment:

```
https://lausiklauskn-png.github.io/Mein-Mixarium/#anchor=<anchorId>
```

Wobei `anchorId` aus `queryLocal`-Rückgabe der Geschwister-Sporen
stammt (`{label, score, anchorId}`). Geschwister-PWA prüft bei
Boot `window.location.hash`:

```js
window.addEventListener("DOMContentLoaded", () => {
  const m = window.location.hash.match(/^#anchor=(.+)$/);
  if (m) scrollToAnchor(decodeURIComponent(m[1]));
});
```

`scrollToAnchor` ist endknoten-PWA-eigene Funktion (z.B. setzt
`document.querySelector(\`[data-anchor="${id}"]\`).scrollIntoView()`).
**KEINE Modul-18-Pflicht** — das ist UI-Pflege im jeweiligen Endknoten.

### Edge-Cases (Endknoten-Pflicht)

| Lage | Endknoten-Verhalten |
|---|---|
| Such-Feld leer (`text === ""`) | Klassifikation `"leer"`, beide Listen leer, KEIN Embedding-Call, KEIN postMessage. |
| Stichwort liefert 0 lokale Treffer | „keine Treffer" sichtbar, KEIN Auto-Semantik-Pass (User-Geste). UI darf einen Knopf „Auch im Mycel suchen?" anbieten — explizit. |
| Modul 03 noch nicht geladen | `queryLocal` wirft `EmbeddingNotAvailableError` → UI zeigt „Embedding-Modul lädt noch …" und macht die Stichwort-Sektion sichtbar. |
| Kein Geschwister im Sibling-Store | `sendCrossKnotenQuery` liefert `[]` sofort, kein Channel-Open. „Aus dem Mycel"-Sektion zeigt „keine angedockten Geschwister" oder bleibt verborgen. |
| BroadcastChannel-Timeout (kein Geschwister antwortet) | Pro Geschwister 3 s Timeout, dann leere Liste für dieses Geschwister. Andere Geschwister antworten unabhängig. Gesamt-Promise scheitert nie. |
| Cross-Knoten-Antwort mit `error:"module-04c-not-available"` | Geschwister hat 04.C noch nicht geladen — Treffer-Liste leer, Endknoten zeigt „Geschwister-Knoten unterstützt Such-API nicht (Modul 04.C fehlt)". Da Bau 04.C diese Sitzung schließt, sollten alle Endknoten nach Migration den Pfad fahren. |
| Sehr lange Eingabe (> 4096 Zeichen) | `queryLocal` wirft `QueryTooLongError` sync → UI zeigt „Eingabe zu lang, max 4096 Zeichen". Cross-Knoten-Pass wird NICHT versucht (Eingabe muss zuerst gekürzt werden — defensiv-Schutz). |
| Klaus tippt während embedding läuft | Endknoten-eigene Debounce-Logik (typisch 300 ms). Modul 04 hat KEINE eigene Debounce — wer ohne Debounce mit jeder Tastenanschlag-Anfrage Modul 03 ruft, blockiert sich selbst (Modul-03-Lazy gilt nur beim ersten Call, danach Cache-Hit ~10–50 ms). |

### Pattern-Status

Diese Sektion ist **Vorlage für Endknoten-Bauer**, keine Modul-18-
Surface-Spec. Modul 18 selbst bietet Wartungs-Aktionen (Andocken,
Backup, Self-Apoptose etc.); das Such-Feld lebt **außerhalb** von
Modul 18, im endknoten-domain-spezifischen UI. Die Endknoten-Briefe
`BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` und
`BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md` setzen dieses Pattern in den
beiden Endknoten um.

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

**options-Form (Spec-Vorbereitung, erweitert 2026-05-26):**

```js
{
  endknotenMeta: {
    domain: string,
    endpoint: string,
    domainKeywords: string[],
    stammCategories?: string[],
    guestCategories?: string[],
  },
  // Welche Sub-Bereiche aktiv sind. Default: alle neun.
  enabledTabs?: ("andocken"|"heterokaryose"|"identitaet"|"backup"|"apoptose"|"sporeregen"|"reembedding"|"handshake"|"discovery")[],
  // SBKIM-Siegel-Slot triggert open() automatisch?
  bindToSiegelSlot?: boolean,  // Default true
  // URL des Externen Mycel-Hubs (siehe _mycel_hub.md) für Sub (i)
  // Spore-Discovery. Default null (nur Sage-Mycel + Manuelle-URL).
  externalHubUrl?: string | null,
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
| Tafel-Erweiterung 5→9 Sub-Bereiche | 2026-05-26 | Tafel-Spec-Pflege Mycel-Vision | Klaus' Vision-Klärung 2026-05-26: Sub-Bereiche von 5 (a–e) auf 9 (a–i) erweitert. Sub (a) Andocken erweitert um 4-Schritt-Workflow (URL eingeben, Spore fetchen, Match-Check, Handshake) + Empfangsmodus-Klausel (kein Auto-Polling). Sub (b) NEU: bidirektionaler Sporen-Informationsaustausch (Heterokaryose, ersetzt alte „Sporen-Installation" — die wandert in Sub i). Sub (c)–(e) bleiben (Identitäts-Wechsel / Backup / Self-Apoptose). Sub (f) NEU: Sporen NEU generieren (`domainKeywords` ändern, neu signieren, ohne neue Identität). Sub (g) NEU: Re-Embedding (Modul 03 lazy, Spore + Korpus neu rechnen). Sub (h) NEU: Manueller Handshake-Trigger aus Sibling-Liste (`SbkimAnastomose.handshake`, triggert SIEGEL Bronze→Gold-Wechsel über Modul 16 Sub e). Sub (i) NEU: Spore-Discovery (Hub-Anfrage an Sage-`status.json` ODER Externer-Mycel-Hub-`status.json` ODER User-URL-Input). Neuer Karten-Abschnitt § Such-Feld-Integration-Pattern (Pepo-Demo-Studie als Referenz, Sender-Helper-Code-Pattern, UI-Pattern lokale + Cross-Knoten-Treffer, Anker-Pfad-Konvention). § Schnittstelle `options.enabledTabs` von 5 auf 9 Werte erweitert + `externalHubUrl` neu. **`status.json` Modul 18 bleibt `score:"schablone"`** — Voll-Spec folgt in Spec-Sitzung 18 nach App-Freigabe. Brief: `docs/sessions/BRIEF_SPEC_18_TOOL_PWA.md` aktualisiert. |
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
