# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Modul 02 + Modul 07 Cache-Invalidate

**Sitzungs-Rolle:** Pflege-Sitzung mit echtem Modul-Bug-Fix (nicht
Test-Bug). Klaus' Sichttest 2026-05-15 ergab in Modul 07 Test 6
(Self-Apoptose) den Befund `getNodeId_wirft_NoIdentityError:false`
trotz `stores_alle_leer:true` — Modul 02's `identityCache` wurde nicht
durch externes `storage.clear` invalidiert. Diese Sitzung erweitert
Modul 02 um eine öffentliche Reset-Funktion und ruft sie aus Modul 07's
Cleanup. Heilige Tafeln (INTERFACES.md §1 Modul 02 + §1 Modul 07 + §6 +
Karten 02 + 07) ziehen mit; status.json bleibt unverändert.
**Branch:** `claude/pflege-02-07-cache-invalidate`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und an
das Übergabeprotokoll der Pflege-Sitzung Match-Kalibrierung
(2026-05-14) sowie die Pflege-Sitzungen 00/05 vom 2026-05-15.
**Module:** 02_spore + 07_apoptose

---

## Auftrag

Eine Phase (Pflege), echter Modul-Bug, klarer Scope:

1. **Klaus' Sichttest-Befund Modul 07** würdigen (7/8 Tests grün im
   ersten Lauf; Test 6 mit Cache-Inkonsistenz-Bug).
2. **Diagnose** des Bugs: Modul 02's `identityCache` wird nicht
   durch externes `storage.clear` invalidiert; Modul 07's Cleanup
   weiß nichts vom Cache.
3. **Vier Lösungs-Optionen analysieren** und Klaus zur Entscheidung
   vorlegen — Klaus delegiert „Ich entscheide, perfekt, keine
   Tricks". Sauberere Lösung gewählt: **Option (a)** öffentliche
   `resetIdentityCache()` in Modul 02, Modul 07 ruft sie.
4. **Heilige Tafeln zuerst, Code danach** (CLAUDE.md):
   - INTERFACES.md §1 Modul 02 + §1 Modul 07 + §6
   - Karte 02 § Schnittstelle + § Selbstcheck + Bauzustand
   - Karte 07 § Schnittstelle + § Apoptose-Pfad + Bauzustand
5. **Code in Modul 02 + Modul 07** ergänzen.
6. **`status.json` und Pie unverändert** — kein Score-Wechsel.
7. **Test-Datei unverändert** — Test 6's Pass-Check bleibt streng,
   der Code-Fix erfüllt ihn jetzt.
8. **Sitzungs-Abschluss:** PULS-Pflege-Eintrag, Übergabeprotokoll
   (diese Datei), WEGWEISER-Stand-Block-Zeile, Commit + Draft-PR
   + Merge. Klaus' zweiter Sichttest-Lauf folgt im Browser.

---

## Was getan wurde

### 1. Klaus' Sichttest-Befund Modul 07 (2026-05-15)

Klaus hat Panel 07 in `tests/manual_check.html` im Browser
durchgeklickt. Befund:

- **Setup OK** — `eigene_node_id:"HLT44…"`, zwei Pseudo-Geschwister
  registriert.
- **Test 1 (Vermächtnis-Round-Trip) OK** — `outcome:accepted,
  inbox_hat_eintrag:true, sender_aus_siblings_entfernt:true`.
- **Test 2 (Signatur-Manipulation) OK** — `outcome:rejected,
  reason:"Signatur ungültig"`.
- **Test 3 (Versions-Mismatch) OK** — `outcome:rejected,
  reason:"Inkompatible Hauptversion: 1.0"`.
- **Test 4 (TTL-Cleanup) OK** — `rueckgabe_entfernt:[altOldId]`,
  `alt_old_weg:true, alt_young_bleibt:true`.
- **Test 5 (listLegacy) OK** — `eintraege_anzahl:4` (3 Demo + 1 von
  Test 1), `signature weggelassen, form_korrekt:true`.
- **Test 6 (Self-Apoptose) FEHLGESCHLAGEN** —
  `confirm_outcome:"completed", recipientsFailed.length:2
  (Pseudo-Endpunkte führen ins Leere), stores_alle_leer:true`,
  ABER `getNodeId_wirft_NoIdentityError:false`. Pass-Check schlägt
  fehl, Status „Test 6 fehlgeschlagen".
- **Test 7 (Token-Ablauf) OK** — `confirm_fehler_name:"InvalidApoptoseTokenError",
  identitaet_bleibt:true`.
- **Test 8 (receiveLegacy unbekannter Sender) FEHLGESCHLAGEN** —
  „Keine Identität in sbkim_keys[main]" — direkte Folge von Test 6.
- **Selbstcheck-Hinweis OK** — `MODUL 07 APOPTOSE bereit, Funktionen:
  …` in DevTools-Konsole; `SELF-APOPTOSE VORBEREITET — irreversibel,
  Token gültig 60s` beim `prepareSelfApoptose`-Aufruf.

Klaus wiederholte den Lauf nach erneutem Setup-Klick (neue Identität
`6Z8r…`): Tests 1/2/3/4/5 wieder grün, Test 6 weiterhin mit
`getNodeId_wirft:false`-Befund, Test 7 OK, Test 8 wieder fehler.

Klaus' Beobachtung: „Nach der letzten Fehlermeldung zeigt bei einem
erneuten Test Test 1, 2, 3 einen Fehler, Test 4, 5 ist wieder OK,
Test 6 immer noch Fehler, Test 7 OK, Test 8 Fehler."

### 2. Diagnose: Modul-02-Cache wird nicht invalidiert

Das ist **kein Test-Bug**, sondern ein **echter Modul-Bug**. Der
Bug-Pfad:

- **Modul 02 hält einen `identityCache` (Closure-Variable Zeile
  140 in `src/modules/02_spore.js`)** als Performance-Optimierung.
  `loadIdentity()` checkt `if (identityCache) return identityCache;`
  zuerst — ein Storage-Roundtrip wird vermieden, solange die
  Identität schon einmal geladen wurde.
- **Modul 07's `confirmSelfApoptose` cleart alle Stores sequenziell**
  (`siblings → log → inbox → spore → keys`) und invalidiert seine
  **eigenen** Caches (`ownPrivateKeyCache = null;
  pseudoSiblings = null;`). Aber: Modul 07 weiß nichts von Modul
  02's `identityCache`.
- **Konsequenz:** `sbkim_keys`-Store ist leer, aber Modul 02 hat
  die alte Identität noch im Speicher. `getNodeId()` checkt
  `identityCache` zuerst → liefert die alte nodeId statt
  `NoIdentityError` zu werfen.
- **Folgeschaden für Test 6:** der Pass-Check `noIdentityThrown`
  (`try { await SbkimSpore.getNodeId(); } catch (e) { ... }`)
  erkennt **kein Throw** → `noIdentityThrown=false` → Pass-Check
  schlägt fehl.
- **Folgeschaden für Tests 1/2/3/8:** Klaus' `ensureSetup()` ruft
  `getOrCreateIdentity` → `loadIdentity` → identityCache liefert
  alte Identität → kein neuer Key wird erzeugt → kein neuer
  `sbkim_keys`-Eintrag. Beim nächsten Sign-Versuch greift Modul 07's
  `loadOwnPrivateKey` direkt zum Storage, findet keinen Key, wirft
  `NoIdentityError`.
- **Test 7 lief grün**, weil `prepareSelfApoptose` nur den
  Token erzeugt + den Cache von Modul 02 nutzt (`getNodeId`
  liefert die alte ID), und dann der Token-Ablauf-Check **vor**
  dem Sign-Pfad in `confirmSelfApoptose` greift — kein
  `loadOwnPrivateKey`-Aufruf nötig.

Querverweis Karte 07 § Schnittstelle (`confirmSelfApoptose`-Block,
Schritt 4): „Nach diesem Return gibt es keine Identität mehr —
Folge-Aufrufe von Spore/Apoptose werfen NoIdentityError bzw.
ApoptoseAlreadyExecutedError." Stimmt für die Stores, stimmt nicht
für Modul 02's In-Memory-Cache. **Vertrag-Bruch.**

### 3. Vier Lösungs-Optionen, Klaus' Entscheidung

Vier Optionen Klaus vorgelegt:

- **(a) Öffentliche `resetIdentityCache()` in Modul 02, Modul 07
  ruft sie als letzten Cleanup-Schritt.** Saubere Vertrag-Trennung,
  performance-neutral, additiv (kein Hauptversions-Sprung),
  Spec-disziplinär (kein Trick).
- (b) Modul 02 Cache-Trust abschalten — Konsistenz-Garantie ohne
  API-Eingriff, aber jeder `getNodeId`/`getPublicKeyJwk`-Aufruf wird
  zum Storage-Roundtrip. Performance-teuer für Modul 04/05/00.
- (c) `init({forceReload:true})` als Reset-Hook — Trick (Idempotenz-
  Garantie von `init()` wird gebrochen).
- (d) Pass-Check in Test 6 lockern — Symptom-Pflege; Modul-Vertrag
  bleibt gebrochen.

Klaus delegiert: „Ich möchte, dass es perfekt wird, keine Tricks,
entscheide du welche Pflege besser ist." → **Option (a)** gewählt
mit vier-Punkte-Begründung:

1. **Saubere Vertrag-Trennung.** Modul 02 weiß nichts von
   Apoptose; bietet nur einen expliziten Reset-Hook. Modul 02
   kümmert sich um Identität, Modul 07 entscheidet wann sie weg
   muss — keine versteckten Wirkungen.
2. **Performance-neutral.** Cache bleibt aktiv (Modul 04/05/00
   rufen `getNodeId` häufig). Nur Modul 07's Self-Apoptose zahlt
   den Reset.
3. **Additiv, kein Hauptversions-Sprung.** Eine neue Funktion in
   Karte 02 + INTERFACES.md §1 Modul 02; Karte 07 § Schnittstelle
   dokumentiert den Aufruf in der Cleanup-Reihenfolge. Kein Bruch
   für Modul 04/05/00.
4. **Spec-Disziplin.** Option (c) `init({forceReload})` würde die
   Idempotenz-Garantie von `init()` brechen (Trick). Option (b)
   Cache-Trust-Abschalten würde alle `getNodeId`-Aufrufer mit
   Storage-Roundtrips belasten. Option (d) Pass-Check-Lockern wäre
   Symptom-Pflege.

### 4. Heilige Tafeln zuerst (CLAUDE.md § Heilige Tafeln)

Reihenfolge der Edits strikt nach der CLAUDE.md-Konvention: erst
INTERFACES.md, dann Karten, dann Code.

**INTERFACES.md §1 Modul 02:**

- **Bietet-Block** ergänzt um `resetIdentityCache() → void` mit
  ausführlichem Kommentar (sync, idempotent, leert nur den Closure-
  Cache, kein Storage-Eingriff; Pflicht-Aufruf für externe
  Cleanup-Pfade; Modul 02 erkennt Storage-Cleanup nicht selbst).
- **Selbstcheck-Format-Zeile** auf sieben Funktionen erweitert.
- **Garantien für Modul 05/06/07** um neuen Punkt „Cache-Konsistenz
  nach externem Storage-Cleanup" erweitert (Vertrag: wer
  sbkim_keys/sbkim_spore von außen leert, MUSS resetIdentityCache
  rufen).
- **Geprüft-Zeile** ergänzt: „2026-05-14 (Spec+Bau-Sitzung 02),
  2026-05-15 (Pflege-Sitzung 02+07-Cache-Invalidate)".

**INTERFACES.md §1 Modul 07:**

- **Nutzt-Block** ergänzt um `SbkimSpore.resetIdentityCache` mit
  Pflicht-Aufruf-Hinweis.
- **Self-Apoptose-Cleanup-Reihenfolge** um Schritt 6
  `SbkimSpore.resetIdentityCache()` ergänzt — Pflicht ab dieser
  Pflege-Sitzung. Vertrag: ein Modul, das sbkim_keys/sbkim_spore
  von außen leert, MUSS resetIdentityCache unmittelbar danach
  rufen.

**INTERFACES.md §6 Änderungsprotokoll:** neue Zeile am unteren Ende
(neueste Zeile unten, Konventions-Stil). Fasst Befund + Diagnose +
Vier-Optionen-Vergleich + Wahl + alle Edits in einer langen Zeile
zusammen.

**Karte 02 § Schnittstelle:** ergänzt um `resetIdentityCache()`-
Block mit ausführlichem Kommentar.

**Karte 02 § Selbstcheck:** Konsolen-Zeile auf sieben Funktionen
erweitert.

**Karte 02 Bauzustand:** neue Zeile „Pflege Cache-Invalidate |
2026-05-15 | Pflege 02+07-Cache-Invalidate | …" mit ausführlicher
Anmerkung (Hintergrund, Fix, Vier-Optionen-Wahl, status.json
unverändert).

**Karte 07 § Schnittstelle (`confirmSelfApoptose`-Block):**
Schritt-3-Cleanup-Reihenfolge umgeschrieben — explizit als
sequenzielle Liste mit Schritt 6 `SbkimSpore.resetIdentityCache()`.
Begründung im Block-Kommentar verankert.

**Karte 07 § Apoptose-Pfad Schritt 5:** Cleanup-Reihenfolge um
Schritt 6 `SbkimSpore.resetIdentityCache()` ergänzt mit Begründungs-
Block (ohne diesen Aufruf liefert getNodeId weiter die alte nodeId
aus dem Cache).

**Karte 07 Bauzustand:** Sichttest-Zeile von „ungeprüft, weil
Sitzung headless" auf „geprüft 2026-05-15 (Klaus + Pflege
02+07-Cache-Invalidate)" gehoben mit ausführlicher Befund-Notiz
(alle sieben grünen Tests mit Werten, Test 6 Befund + Pflege-Fix);
zusätzliche Zeile „Pflege Cache-Invalidate | 2026-05-15 | …" mit
Code-Anmerkung.

### 5. Code-Implementation

**`src/modules/02_spore.js`:**

```js
// Sync, idempotent. Leert den In-Memory-identityCache, ohne den
// Storage anzufassen. Pflicht-Aufruf für Module, die sbkim_keys/
// sbkim_spore von außen leeren (z.B. Modul 07 confirmSelfApoptose).
// Ohne diesen Aufruf liefert getNodeId/getPublicKeyJwk weiter die
// alte Identität aus dem Cache, trotz leerem Storage.
// Pflege-Sitzung 2026-05-15 (Klaus' Sichttest-Befund Modul 07
// Test 6: getNodeId_wirft_NoIdentityError war false trotz
// stores_alle_leer:true).
function resetIdentityCache() {
  identityCache = null;
}
```

Exportiert auf `window.SbkimSpore.resetIdentityCache`. Selbstcheck-
Konsolen-Zeile auf sieben Funktionen erweitert.

**`src/modules/07_apoptose.js`:** nach den fünf `storage.clear`-
Aufrufen + den eigenen Cache-Invalidations
(`ownPrivateKeyCache = null; pseudoSiblings = null;`) wird
`getSpore().resetIdentityCache()` als Schritt 6 gerufen, mit
`typeof`-Guard für Rückwärts-Lauffähigkeit (falls Modul 02 noch
alte Version geladen ist):

```js
if (typeof getSpore().resetIdentityCache === "function") {
  getSpore().resetIdentityCache();
}
```

Cleanup-Kommentar präzisiert (Reihenfolge `siblings → log → inbox
→ spore → keys → SbkimSpore.resetIdentityCache()`). Begründungs-
Block direkt im Code, der Querverweise auf INTERFACES.md §1 Modul
02 + § Self-Apoptose-Cleanup-Reihenfolge enthält.

`node --check src/modules/02_spore.js` grün. `node --check
src/modules/07_apoptose.js` grün.

### 6. Test-Datei unverändert

**`tests/manual_check.html` Panel 07 Test 6 unverändert.** Der
Pass-Check bleibt streng:

```js
var pass = result.outcome === "completed" && allEmpty && noIdentityThrown &&
           result.recipientsFailed.length === 2 && result.recipientsNotified.length === 0;
```

Nach dem Code-Fix wird `noIdentityThrown=true` (Modul 02's Cache
ist leer → `getNodeId` wirft `NoIdentityError`) → Pass-Check grün.

### 7. PULS-Aktualisierungen

- **Sitzungs-Eintrag oben** mit Was getan / Was nicht geändert /
  Frischer-Kopf-Befund (heilige Tafeln zuerst, Code danach) /
  Was offen blieb / Nächster Schritt.
- **Schnellüberblicks-Zeile Modul 02** aktualisiert
  („Code-Stub (2026-05-14, Pflege Cache-Invalidate 2026-05-15)",
  Sichttest-Vermerk + `resetIdentityCache()`-Hinweis).
- **Schnellüberblicks-Zeile Modul 07** aktualisiert
  („geprüft 2026-05-15 (Klaus) — 7/8 Tests grün; Test 6
  Modul-Bug → Pflege 2026-05-15", Cleanup-Schritt-6-Hinweis).
- **„Als nächstes ✨" Code-Stub-Block für Modul 07** aktualisiert
  (von „ungeprüft, weil Sitzung headless" auf ausführlichen
  Sichttest-Befund mit Pflege-Hinweis).

### 8. WEGWEISER-Stand-Block-Zeile

Eine Zeile am unteren Ende des Stand-Blocks ergänzt (Wanderung —
neueste Zeile unten), mit Konventions-Stil wie die anderen
Pflege-Sitzungen 2026-05-15. Fasst Befund + Diagnose + Vier-
Optionen-Wahl + alle Edits + nächsten Schritt in einer langen
Zeile zusammen.

---

## Was nicht geändert wurde (bewusst)

- **`tests/manual_check.html` Panel 07 unverändert.** Test 6's
  Pass-Check bleibt streng; der Code-Fix erfüllt ihn jetzt.
- **`status.json` unverändert.** Modul 02 und Modul 07 bleiben
  `score:"stub"` / `siegel:"Code-Stub"`. Pie nicht regeneriert
  (keine Score-Änderung).
- **Karte 02 § Datenformate / § Fehlertabelle / § Manueller Test
  unverändert.** Karte 07 § Datenformate / § Fehlertabelle /
  § Manueller Test unverändert.
- **`PROTOCOL_VERSION` unverändert.** Die Erweiterung ist additiv
  (eine neue Funktion in Modul 02), kein Hauptversions-Sprung.
- **Kein Eingriff in Modul 04/05/00.** Sie nutzen den Cache
  weiterhin transparent — keine Code-Änderung dort, keine API-
  Erweiterung dort.

---

## Frischer-Kopf-Befund: heilige Tafeln zuerst, Code danach

Diese Pflege-Sitzung ist die erste, die einen **echten Modul-Bug**
(nicht Test-Bug) repariert seit Bau-Beginn. Die CLAUDE.md-
Konvention „Heilige Tafeln zuerst, dann Code" wurde streng
eingehalten:

1. **INTERFACES.md §1 Modul 02 + §1 Modul 07 + §6** wurden vor
   jeder Code-Zeile aktualisiert.
2. **Karten 02 + 07 § Schnittstelle** wurden vor jeder Code-Zeile
   aktualisiert.
3. **Erst dann** wurde der Code in beiden Modulen ergänzt.

**Sauberere Lösungs-Wahl** (Option a): Modul 02 weiß nichts von
Apoptose, bietet aber den expliziten Reset-Hook. Modul 07's
Cleanup-Vertrag ist explizit erweitert um den neuen Schritt 6.
Andere Module (04/05/00) sind nicht betroffen — sie nutzen den
Cache weiterhin transparent.

**Performance-Erwägung**: der Cache bleibt aktiv für alle
nicht-Cleanup-Pfade. Modul 04/05/00 rufen `getNodeId` häufig
(beim Snapshot, beim Handshake, beim Sign), und sie zahlen
nichts für den Reset-Mechanismus.

**Spec-Disziplin**: Option (b) Cache-Trust-Abschalten wäre
robuster gewesen (Modul 02 würde Cache-Inkonsistenzen selbst
erkennen), aber Performance-teuer. Option (c) `init({forceReload})`
hätte die Idempotenz-Garantie von `init()` gebrochen — Trick.
Option (d) Pass-Check-Lockern wäre Symptom-Pflege.

**Rückwärts-Lauffähigkeit**: Modul 07 ruft `resetIdentityCache`
mit `typeof`-Guard, falls jemand mal eine alte Modul-02-Version
ohne die Funktion lädt. Defensive Programmierung gegen partielle
Updates in Endknoten.

**Beobachtung zu Modul 12 (Blocklist-Stub):** Modul 12 könnte
später ähnliche Cache-Invalidate-Pflichten haben, wenn es
geblockte Identitäten via Storage-Cleanup entfernt. Die
`resetIdentityCache`-API ist bereits da — Modul 12 ruft sie
einfach mit, wenn es spruchreif wird. Vertrag: jeder externe
Cleaner muss den Hook ziehen.

---

## Was offen blieb

- **Klaus klickt Panel 07 Test 6 (Self-Apoptose) erneut im
  Browser.** Erwartung jetzt:
  - `outcome:completed` (wie vorher)
  - `stores_alle_leer:true` (wie vorher)
  - `recipientsFailed.length:2` (wie vorher)
  - `recipientsNotified.length:0` (wie vorher)
  - **`getNodeId_wirft_NoIdentityError:true` (NEU — durch den
    Cache-Fix)**
  Pass-Check grün → Status „Test 6 OK". Folge-Tests 1/2/3/8 nach
  Setup-Reset funktionieren wieder.
- **Klaus' Trias-Sichttest Modul 05** (Pflege-Sitzung 05 Test-2)
  hat bereits die Werte geliefert — Beleg-Eintrag in Karte 05
  wurde von Klaus bewusst auf später verschoben.
- **Folge-Pflege-Sitzung Karte 09 „Schritt 9: TTL-Sweep + Modul
  00 im Andock-Pfad"** bleibt der nächste sinnvolle Schritt
  (jetzt mit Modul 00, 05, 07 alle sichtgeprüft).
- **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
  Versuch** bleibt die produktivste Folge-Sitzung — Module
  00/05/07 sind alle Code-Stub und können mit-andocken.

---

## Nächster sinnvoller Schritt

1. **Klaus klickt Panel 07 Test 6 (Self-Apoptose) erneut im
   Browser** und schickt den Output. Erwartung:
   `getNodeId_wirft_NoIdentityError:true`. Wenn ja: Modul 07
   Sichttest vollständig grün; Karte 07 Bauzustand-Sichttest-
   Zeile bekommt einen „voll grün"-Vermerk.
2. **Folge-Pflege-Sitzung Karte 09 „Schritt 9: TTL-Sweep + Modul
   00 im Andock-Pfad"** — kompakte Pflege, jetzt spruchreif.
3. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
   Versuch** — der erste echte Andock-Klick zwischen Rezeptbuch
   und Mixarium.

---

## Pflicht-Häkchen am Sitzungsende

- [x] **Klaus' Sichttest-Befund Modul 07** dokumentiert (7/8
      grün im ersten Lauf, Test 6 mit Cache-Inkonsistenz-Bug)
- [x] **Diagnose** des Bugs (Modul 02 `identityCache` wird nicht
      durch externes `storage.clear` invalidiert) klar in PULS +
      Übergabeprotokoll + WEGWEISER festgehalten
- [x] **Vier Lösungs-Optionen analysiert** (a öffentliche Reset
      · b Cache-Trust-Abschalten · c init({forceReload}) · d
      Pass-Check-Lockern) und dokumentiert
- [x] **Klaus' Entscheidung „Ich entscheide, perfekt, keine
      Tricks"** mit vier-Punkte-Begründung in der Antwort
      verankert
- [x] **Heilige Tafeln zuerst (CLAUDE.md):**
      - INTERFACES.md §1 Modul 02 (Bietet + Selbstcheck-Format
        + Garantien für 05/06/07 + Geprüft-Datum)
      - INTERFACES.md §1 Modul 07 (Nutzt + Self-Apoptose-Cleanup-
        Reihenfolge mit Schritt 6)
      - INTERFACES.md §6 Änderungsprotokoll-Zeile (neueste unten)
      - Karte 02 § Schnittstelle + § Selbstcheck (auf 7 Funktionen)
      - Karte 02 Bauzustand „Pflege Cache-Invalidate"-Zeile
      - Karte 07 § Schnittstelle (`confirmSelfApoptose`-Block
        Schritt 3 Cleanup-Reihenfolge)
      - Karte 07 § Apoptose-Pfad (Schritt 5 Cleanup-Reihenfolge)
      - Karte 07 Bauzustand-Sichttest-Zeile auf „geprüft
        2026-05-15" gehoben mit ausführlicher Befund-Notiz
- [x] **Code danach:**
      - `src/modules/02_spore.js`: neue Funktion
        `resetIdentityCache()`, Selbstcheck-Zeile auf 7 Funktionen,
        Export auf `window.SbkimSpore`
      - `src/modules/07_apoptose.js`: Cleanup-Schritt 6
        `getSpore().resetIdentityCache()` mit `typeof`-Guard +
        Begründungs-Kommentar
- [x] **`node --check`** für `02_spore.js` und `07_apoptose.js`
      grün
- [x] **Test-Datei unverändert** — Pass-Check bleibt streng,
      Code-Fix erfüllt ihn
- [x] **`status.json` unverändert** — beide Module bleiben
      `score:"stub"` / `siegel:"Code-Stub"`, Pie nicht regeneriert
- [x] **PULS-Sitzungs-Eintrag oben** mit Was getan / Was nicht
      geändert / Frischer-Kopf-Befund / Was offen blieb /
      Nächster Schritt
- [x] **PULS-Schnellüberblicks-Zeilen Modul 02 + Modul 07** und
      „Als nächstes ✨" Block für Modul 07 aktualisiert
- [x] **WEGWEISER-Stand-Block-Zeile** unten ergänzt (Wanderung,
      neueste Zeile unten)
- [x] **Übergabeprotokoll** (diese Datei)
- [ ] **Commit + Push** auf `claude/pflege-02-07-cache-invalidate`
      (folgt)
- [ ] **Draft-PR gegen `main`, danach merge** (folgt)
