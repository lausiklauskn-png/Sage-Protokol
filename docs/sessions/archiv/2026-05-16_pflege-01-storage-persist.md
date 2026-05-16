# Übergabeprotokoll · 2026-05-16 · Pflege-Sitzung — Storage-Persist (Identitäts-Persistenz Stufe 1)

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase. Branch
`claude/pflege-01-storage-persist-BAVOp`. Folge-Pflege direkt nach
der Pflege PWA-Suffix 2026-05-16, gleicher Tag. Greift Stufe (1) der
drei-stufigen Identitäts-Persistenz-Architektur aus PULS § Offene
Querschnitts-Fragen „Identitäts-Persistenz" auf.

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C
(Pflege-Sitzung).

**Module:** ausschließlich 01 (Storage — Code + Karte + Vertrag).
Modul 00 / 02 / 03 / 04 / 05 / 06 / 07 / 08 ausdrücklich nicht
angefasst.

---

## Auftrag

Klaus' Sorge aus § Offene Querschnitts-Fragen „Identitäts-
Persistenz": tiefes Browserspeicher-Löschen tötet die nodeId. Drei
Stufen wurden zusammen vorgesehen — diese Sitzung greift Stufe (1):

`navigator.storage.persist()` im Init-Pfad von Modul 01 nach
erfolgreichem DB-Open. Der Aufruf bittet den Browser, IndexedDB
beim normalen Aufräumen nicht zu löschen. Chrome gewährt das bei
installierten PWAs automatisch (per Web-Plattform-Heuristik),
Firefox fragt den Nutzer (Prompt), Safari ist restriktiv und sagt
meist `false`. **Fail-soft ist Pflicht, nicht das Resultat** — der
Endknoten muss auch bei Verweigerung lauffähig bleiben.

Stufen (2) Backup-Export passwort-verschlüsselt (Modul 02) und
(3) Quota-Frühwarnung (Modul 00, schon spec mit
`DOKU_QUOTA_WARN_RATIO=0.80` / `_BYTES=50 MiB` aus §0) bleiben
offen — Stufe (2) braucht eine eigene Spec-Sitzung, Stufe (3)
ist schon in Modul 00 verankert.

---

## Was getan wurde

### 1. `src/modules/01_storage.js` — Code-Patch

Neue Closure-Helper-Funktion `requestStoragePersist()` zwischen dem
Migrations- und dem init-Block. Aufrufen im `req.onsuccess` vor dem
`resolve(db)`. Setzt neuen Modul-Closure-State `storagePersisted`:

- `navigator.storage` / `persist` fehlt → `null` +
  `console.info("Storage persist-Status: navigator.storage.persist
  nicht verfuegbar, fail-soft (null).")`. Knoten läuft.
- persist() resolved `true` → `storagePersisted = true` +
  `console.info("Storage persist-Status: true")`. Browser hat den
  Speicher als persistent markiert.
- persist() resolved `false` → `storagePersisted = false` +
  `console.info("Storage persist-Status: false")`. Browser hat
  verweigert — Knoten läuft trotzdem.
- persist() rejected → `null` +
  `console.info("Storage persist-Status: persist-Promise rejected,
  fail-soft (null).")`. Kein Throw, kein Reject — Persist-
  Verweigerung ist kein SBKIM-Bruchgrund.
- persist() wirft synchron → `null` +
  `console.info("Storage persist-Status: persist() warf synchron,
  fail-soft (null).")`. Sehr unwahrscheinlich, aber abgefangen.

`_meta.storagePersisted` ist neuer Getter (Live-Zustand, Default
`null` vor dem ersten `init()`-Aufruf). Idempotenz beim Re-Init:
`dbPromise`-Cache deckt das ab — persist() wird automatisch nur
einmal pro Tab-Session gerufen, weil `req.onsuccess` nur einmal
feuert (eben weil der zweite `init()`-Aufruf das gecachte
`dbPromise` zurückgibt, ohne `indexedDB.open` erneut zu rufen).

Modul-Kopfkommentar um einen vierten Pflege-Block „Pflege
Storage-Persist (2026-05-16)" erweitert (steht direkt nach dem
Pflege PWA-Suffix-Block).

### 2. Karte 01 (`docs/components/01_storage.md`)

- **§ Schnittstelle init(options?)-Doc-Block** um Hinweis erweitert:
  „nach erfolgreichem DB-Open (onsuccess) fordert Modul 01
  `navigator.storage.persist()` an (fail-soft). Bei Erfolg gibt
  `_meta.storagePersisted` true|false zurück; wenn die API fehlt
  oder das Promise rejectet, bleibt der Wert null. Persist-
  Verweigerung ist KEIN SBKIM-Bruchgrund — der Knoten läuft weiter
  (Chrome auto-bei-PWA, Firefox prompt, Safari restriktiv)."
- **§ Risiken** neuer Punkt „Persist-Verweigerung" als sechster
  Bullet. Verweist auf die Stufen-(2)/(3)-Pfade.
- **§ Bauzustand** neue Zeile „Pflege Storage-Persist" am unteren
  Ende der Bau-Tabelle, vor „In Endknoten eingebaut".

### 3. INTERFACES.md §1 Modul 01 + §6

- **§1 Modul 01 Nutzt-Block** um Browser-API
  `navigator.storage.persist()` als optionalen Aufruf erweitert
  (Fail-soft-Note: API-fehlend / rejected → `_meta.storagePersisted
  = null`, kein Throw, kein Reject). Steht direkt nach „(keine
  SBKIM-Module — Wurzelmodul, IndexedDB direkt)".
- **§1 Modul 01 Geprüft-Zeile** um „2026-05-16 (Pflege Storage-
  Persist Stufe 1)" erweitert.
- **§6 Änderungsprotokoll** Zeile am unteren Ende.

### 4. PULS

- **§ Offene Querschnitts-Fragen „Identitäts-Persistenz"** Stufe
  (1) mit `~~strikethrough~~` als gelöst markiert + Verweis aufs
  Übergabeprotokoll. Stufen (2) Backup-Export und (3) Quota-
  Frühwarnung explizit als offen ausgewiesen.
- **§ Sitzungs-Einträge** rotiert: dieser Eintrag oben, Pflege
  PWA-Suffix in den Archiv-Index, Bau-Sitzung 09 Iteration 3
  Mein-Rezeptbuch ebenfalls aus den inline-Einträgen entfernt (war
  ohnehin schon im Archiv-Index aus PR #?). PULS-Länge fällt von
  872 auf 563 Zeilen — sauber unter dem 700-Ziel.
- **§ Archiv-Index** zwei neue Zeile oben (diese Pflege-Sitzung;
  Pflege PWA-Suffix war schon drin).

### 5. `tests/manual_check.html` — Panel 01 fünfter Knopf

„Persist-Status zeigen" als reine Lese-Operation. Ruft
`SbkimStorage.init()` (idempotent — schließt auch an einen
laufenden Round-Trip-Test an), liest `_meta.storagePersisted`,
deutet das Ergebnis in einem deutschsprachigen Begleitsatz:

- `true`  → „Browser hat IndexedDB als persistent markiert (Chrome
  auto-bei-PWA / Firefox akzeptiert / Klaus hat zugestimmt)."
- `false` → „Browser hat persist verweigert (Safari restriktiv /
  Firefox abgelehnt). Knoten läuft trotzdem — Stufen (2) Backup +
  (3) Quota-Frühwarnung decken Verlust-Pfade ab."
- `null`  → „navigator.storage.persist nicht verfügbar oder Promise
  rejected — fail-soft (null). Knoten läuft normal weiter."

**Entscheidung zur Optionalität:** Der Brief liess „klein und
sinnvoll, kann aber weggelassen werden". Entschieden: aufgenommen.
Begründung: anders als der bewusst weggelassene „DB mit Suffix
öffnen"-Knopf aus Pflege PWA-Suffix ist das hier eine **reine
Lese-Operation** — kein Idempotenz-Konflikt zum Setup-Knopf, kein
State-Wechsel. Klaus' Sicht-Test in der Endknoten-PWA bringt die
Plattform-spezifische Antwort (Chrome Desktop vs. Android, Safari
iPad vs. Firefox Android), die in der Sage-Werkstatt schwer
nachstellbar wäre.

### 6. Übergabeprotokoll

Diese Datei.

---

## Was bewusst nicht angefasst wurde

- **`src/modules/02_spore.js`** unverändert. Stufe (2) Backup-Export
  ist eigene spätere Spec-Sitzung — Modul 02 bekommt dann die
  Backup-/Restore-Pfade.
- **`src/modules/00_doku_fenster.js`** unverändert. Stufe (3)
  Quota-Frühwarnung ist schon spec (§0-Konstanten
  `DOKU_QUOTA_WARN_RATIO` / `DOKU_QUOTA_WARN_BYTES`); Karte 01
  § Risiken zitiert sie, bricht sie aber nicht auf.
- **`src/modules/03_embedding.js` / `04_match.js` / `05_anastomose.js`
  / `06_heterokaryose.js` / `07_apoptose.js` / `08_ui_demo.js`**
  unverändert. Persist greift transparent unter ihren internen
  `Storage.init()`-Pfaden (sie rufen `SbkimStorage.init()` ohne
  Optionen und bekommen idempotent das gleiche `dbPromise` zurück
  — der persist-Pfad aus dem ersten Aufruf hat schon gewirkt).
- **`docs/INTERFACES.md` §0** keine neue Konstante (persist ist
  Browser-API ohne Schwelle; die §0-Quota-Schwellen aus Modul 00
  bleiben separat).
- **`docs/components/00_doku_fenster.md`** unverändert.
- **`status.json`** unverändert (Modul 01 bleibt `score:"stub"`;
  additive Code-Erweiterung, kein Score-Wechsel).
- **`update_puls_pie.py`** nicht aufgerufen (kein Modul-Score-
  Wechsel).
- **`index.html`** (Sage-Page) unverändert.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.
- **`DB_VERSION`** bleibt `3` (keine Schema-Änderung; persist ist
  Browser-API-Aufruf, kein DB-Eingriff).

---

## Validierung

- **`node --check src/modules/01_storage.js`** grün.
- **Smoke-Test in Node** mit stub-`navigator.storage.persist`
  (selbst-zerstörendes `/tmp/sbkim_storage_persist_test.js`, **nicht**
  ins Repo eingecheckt). Stub-`indexedDB.open` resolved den
  open-Request via `Promise.resolve()` und liefert ein
  `request`-Objekt mit minimalem DB-Stub (kein `objectStoreNames`-
  Trick, kein Migrations-Pfad — `onupgradeneeded` läuft trivial mit
  `contains:()=>false`).

  Vier Fälle alle grün:

  | # | Stub | Erwartung `_meta.storagePersisted` | Resultat | Konsolen-Zeile |
  |---|---|---|---|---|
  | A | `persist: () => Promise.resolve(true)` | `true` | PASS | `Storage persist-Status: true` |
  | B | `persist: () => Promise.resolve(false)` | `false` | PASS | `Storage persist-Status: false` |
  | C | `navigator.storage` fehlt komplett | `null` | PASS | `Storage persist-Status: navigator.storage.persist nicht verfuegbar, fail-soft (null).` |
  | D | `persist: () => Promise.reject(...)` | `null` | PASS | `Storage persist-Status: persist-Promise rejected, fail-soft (null).` |

  Brief verlangte drei Fälle (a/b/c) — Fall (D) ist
  zusätzlich aufgenommen, weil Firefox-Prompt-Pfade in der Praxis
  als Rejection auftreten können und die fail-soft-Konvention das
  decken muss.

- **Cross-Reading Karte 01 + INTERFACES.md** durchgezogen:
  Persist-Verhaltens-Beschreibung konsistent zwischen § Schnittstelle
  init(options?), § Risiken „Persist-Verweigerung", § Bauzustand-
  Zeile und INTERFACES.md §1 Modul 01 Nutzt-Block.

---

## Was offen blieb

### Stufe (2) Backup-Export (Modul 02, offen)

Klaus speichert eine `*.sbkim-backup.json` passwort-verschlüsselt
extern und kann sie bei Browser-Wechsel oder Cleanup zurückimpor­
tieren. Modul-02-Folge-Spec-Sitzung, ~60 Min headless. Format-
Entscheidungen offen: WebCrypto AES-GCM? PBKDF2-Iterations? `meta`
+ `encrypted`-Wrapper? Backup-Inhalt: nur `sbkim_keys` + `sbkim_spore`,
oder auch `sbkim_siblings`?

### Stufe (3) Quota-Frühwarnung (Modul 00, schon spec)

Modul 00 hat die §0-Konstanten `DOKU_QUOTA_WARN_RATIO = 0.80`
und `DOKU_QUOTA_WARN_BYTES = 50 MiB` schon in der Spec verankert
und das Doku-Fenster zeigt eine Warnzeile, wenn eine der beiden
Schwellen überschritten wird. Sichttest 2026-05-15 hat das grün
bestätigt. Der Querschnitts-Anker „Identitäts-Persistenz" lässt
Stufe (3) trotzdem offen, weil die drei Stufen zusammen die
Architektur ergeben — gelöst wird der Anker erst, wenn Stufe (2)
angeschlossen ist.

### Klaus' Sichttest Panel 01 fünfter Knopf

Der „Persist-Status zeigen"-Knopf liefert in der Sage-Werkstatt
unter `node --check` keine Antwort — die echte Plattform-Antwort
kommt erst in Klaus' Browser (Chrome auf Android vs. Desktop,
Safari iPad vs. Firefox Android). Wartet auf Klaus, ist aber
**nicht blockierend** — der Knoten läuft auch ungetestet.

### Übrige offene Punkte aus Pflege PWA-Suffix

- **Klaus' Re-Andock beider Endknoten** mit `dbSuffix:"mixarium"` /
  `"rezeptbuch"` in `sbkim-init.js`. *Nicht headless*, wartet auf
  Klaus am Termux. Sobald Re-Andock durch ist, greift persist()
  pro PWA.
- **`status.json` `pingStatus`-Update** nach Re-Andock.
- **Cross-Knoten-Handshake** zwischen beiden Endknoten.
- **Eruda-Rückbau** in beiden Endknoten nach erstem
  erfolgreichen Cross-Handshake.
- **Mini-Pflege „Sushi-Kategorie sichtbar machen"** in Mein-Mixarium
  (entkoppelt).
- **INTERFACES.md §6 Tabellen-Bug** aus PR #45 Squash-Merge.
- **Klaus' Sichttest Panel 06** (Heterokaryose) weiterhin offen.

---

## Nächster sinnvoller Schritt

1. **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** mit
   PWA-Suffix aus Pflege 2026-05-16 — *nicht headless*, wartet auf
   Klaus am Termux. Schätzaufwand: ~30 Min für beide Endknoten
   zusammen. Erst nach Re-Andock kann eine Folge-Sitzung
   `status.json` `pingStatus` von `"blocked-origin-collision"` auf
   `"live"` wechseln.
2. **Folge-Spec „Modul 02 Backup-Export"** (Stufe 2 der
   Identitäts-Persistenz) — *headless möglich*. Geschätzt
   ~60 Min. Erzeugt das Spec-Fundament für eine Folge-Bau-
   Sitzung 02.X, die das passwort-verschlüsselte Backup-Format in
   Modul 02 nachzieht.
3. **Cross-Knoten-Handshake** nach Re-Andock (Karte 09 Schritt 8).
4. **Eruda-Rückbau** in beiden Endknoten nach erstem
   erfolgreichen Handshake.

---

## Material aus der Sitzung

**Patch-Übersicht `src/modules/01_storage.js`:**

```diff
  var dbPromise = null;
  var dbNameInUse = DB_NAME_DEFAULT;
+ var storagePersisted = null;

+ function requestStoragePersist() {
+   if (typeof navigator === "undefined" || !navigator.storage ||
+       typeof navigator.storage.persist !== "function") {
+     storagePersisted = null;
+     console.info("Storage persist-Status: navigator.storage.persist nicht verfuegbar, fail-soft (null).");
+     return Promise.resolve(null);
+   }
+   var persistPromise;
+   try { persistPromise = navigator.storage.persist(); }
+   catch (e) {
+     storagePersisted = null;
+     console.info("Storage persist-Status: persist() warf synchron, fail-soft (null).");
+     return Promise.resolve(null);
+   }
+   return Promise.resolve(persistPromise).then(function (result) {
+     storagePersisted = result === true ? true
+                      : result === false ? false : null;
+     console.info("Storage persist-Status: " + storagePersisted);
+     return storagePersisted;
+   }, function () {
+     storagePersisted = null;
+     console.info("Storage persist-Status: persist-Promise rejected, fail-soft (null).");
+     return null;
+   });
+ }

  req.onsuccess = function () {
-   resolve(req.result);
+   var db = req.result;
+   requestStoragePersist().then(function () { resolve(db); });
  };
```

**`_meta`-Block:**

```diff
  _meta: {
    get dbName() { return dbNameInUse; },
    dbNameDefault: DB_NAME_DEFAULT,
    dbVersion: DB_VERSION,
    storePrefix: SBKIM_STORE_PREFIX,
    knownStores: KNOWN_STORES.slice(),
+   get storagePersisted() { return storagePersisted; },
  },
```

**Smoke-Test-Quelle:** `/tmp/sbkim_storage_persist_test.js` (selbst-
zerstörend, nicht ins Repo eingecheckt). Stubt `indexedDB.open` mit
`Promise.resolve().then(() => onsuccess())` und liefert pro Lauf einen
frischen VM-Kontext via `vm.createContext`, damit der Modul-
Closure-State zwischen Fällen sauber zurückgesetzt ist.

**Commit dieser Sitzung:** TBD (folgt am Sitzungs-Ende).

**Branch:** `claude/pflege-01-storage-persist-BAVOp`.

**PR:** wird am Sitzungs-Ende als Draft erstellt.
