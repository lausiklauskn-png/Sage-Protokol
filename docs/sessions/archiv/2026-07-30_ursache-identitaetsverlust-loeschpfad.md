# Übergabeprotokoll 2026-07-30 — URSACHE des Identitätsverlusts: unser eigener Lösch-Pfad

**Rolle:** Bau-Sitzung (Fortsetzung; Klaus' Wort „entscheide selber, es geht nichts verloren").
**Branch (netzweit):** `claude/stufe-0a-identitaetskennungen-78ulx5`.
**Berührte Repos (14):** Sage + alle 12 Modul-01-Träger + Sage-Bundle.

---

## Wie die Ursache eingekreist wurde (Ausschluss-Kette)

Klaus' Über-Nacht-Messung: Kimboard und Mein-Tresor verloren **beide** ihre Kennung, obwohl
„Speicher dauerhaft: **ja**" stand und nichts gelöscht wurde. Seine Zusatz-Angaben waren
entscheidend:

1. **Gleicher Browser-Modus** → DeX-/Tablet-Verwechslung ausgeschlossen.
2. **Apps waren die Nacht über offen**, Kennung war früh noch **angezeigt**, erst der
   Hard-Reload legte den Verlust offen → die Anzeige kam aus dem **Arbeitsspeicher** der alten
   Seite; die Schublade darunter war längst leer. Zudem liefen die offenen Fenster noch mit dem
   **alten** Code (neuer Code kommt erst beim Neuladen ins Fenster).
3. **„Es ging sofort, kein Modell geladen."** Das ~30-MB-Sprachmodell liegt im **selben**
   verwalteten Speicher wie die Kennungen. Es überlebte, localStorage (Tresor-Fächer,
   Gerätename) ebenfalls. Gelöscht wurde **nur** die Kennungs-DB → **kein Browser-Eviction.**
4. **Modul 07 (Apoptose) entlastet:** `init()` macht nachweislich keinen Verfalls-Sweep
   („keine TTL-Sweeps in init()", wörtlich im Modul); Löschen nur nach Token-Bestätigung.

Damit blieb nur eine Möglichkeit: **unser eigener Code.**

## Die Ursache (im Code, `01_storage.js`)

Die „Selbst-Heilung identitäts-leerer Schrott-DB" (11.07.) löscht eine DB, deren Pflicht-Store
`sbkim_keys` fehlt. Zwei Fehler machen daraus einen Datenverlust:

1. **Fehlurteil möglich:** fährt ein **anderes Fenster** derselben Origin gleichzeitig einen
   Schema-Umbau, ist `objectStoreNames` **transient unvollständig** → „leer" → die DB **mit**
   Identität wird gelöscht.
2. **Löschung auf Vorrat:** `indexedDB.deleteDatabase()` ist unumkehrbar und wirkt bei
   `onblocked` **verzögert** — sie bleibt im Browser **vorgemerkt** und greift, sobald die
   letzte Verbindung fällt (Tab schläft über Nacht ein). Deshalb war **nie ein Fehler
   sichtbar**, und deshalb passierte es „über Nacht".
3. Am Lösch-Aufruf fehlte zudem der **Fehler-Zweig** — eine blockierte Löschung ließ die
   Promise-Kette **still sterben** (init hing, Löschung blieb vorgemerkt).

## Die Härtung

`confirmIdentityStoreMissing(name)` — eine **zweite, unabhängige Gegenprobe** vor jedem
Selbst-Heilungs-Löschen. Sie resolved `true` nur bei **zweifelsfreier** Leere; blockiert,
fehlerhaft oder „Store doch da" → `false` → **nicht löschen**, sondern ehrlich ablehnen mit
Hinweis „weitere Fenster schließen und neu laden". Leitsatz: **Löschen ist unumkehrbar, ein
ehrlicher Fehler ist reparierbar.** Fehler-Zweig ergänzt.

Kein `DB_VERSION`-/Schema-/API-Bump. Module 02/23 unberührt.

## Beweis — mit Gegenprobe (der Kern der Ehrlichkeit)

`tests/smoke_pflege_01_kein_loeschen_im_zweifel.mjs` **4/4 grün** (fake-indexeddb; die erste
Frage nach `sbkim_keys` lügt einmalig „fehlt", die Gegenprobe sagt die Wahrheit — genau das
Bild eines parallelen Schema-Umbaus).

**Gegenprobe geführt:** mit der Härtung **entfernt** fällt derselbe Test auf **2/4** mit
`WEG — Datenverlust!`. Der Bug ist damit **reproduziert** und die Heilung **belegt** — nicht
bloß plausibel. Probe 4 zeigt: der echte Leer-Fall heilt sich weiterhin selbst.

Regress-frei: M01-Suite 11/21/7/6, `reopen-retry` 3/3, `a14` 4/4, `bau02y` 33/33,
Bundle-Drift-Guard, App-Suiten (Tresore 53/59, Kimboard 6/6, Kimseek 11/11, BLP 2153/0,
Brain-Drift-Guards 8/8 + 15/15).

## Netzweiter Rollout (13 PRs, alle gemergt)

Sage #750 · Mein-Tresor #79 · Kimboard #57 · BookLedgerPro #285 (CI grün) · Jasons-Tresor #137 ·
family-project #122 · Kimseek #47 · Company-Brain #9 · Privat-Brain #65 · Mein-Rezeptbuch #351 ·
Mein-Mixarium #165 · Muttis-Rezeptbuch #164 · Tomys-Hub #128.
Vier Repos (Kimboard, Kimseek, Company-/Privat-Brain) brauchten einen Rebase — der sha-Pin war
in derselben Sitzung zweimal angefasst worden (Konflikt), sauber neu von `main` aufgetragen.

## Nebenbefund geklärt: Apps lesen NICHT den Nachbar-Speicher

Klaus' Beobachtung „Kimboard zeigt Mein-Tresor, obwohl der geschlossen ist" ist echt, die
Deutung war es nicht. Der Analyse-Rekord 05:01 beweist es:

| Zeit | Ereignis |
|---|---|
| 04:43:06 | Mein-Tresor heftet seine Karte an (App offen) |
| 05:01:43 | Kimboard liest sie — **18 Min später**, App zu |
| 05:01:43 | Kimboards Handshake an sie → `decision: null` (**keine Antwort**) |

Die Karte hängt am **Relais** (~30-Min-Fenster, so gebaut), nicht im Browser. Gelänge ein
Browser-Zugriff, wäre der Handshake nicht ins Leere gelaufen. Ebenso sind die „3 bzw. 4
Kennungen" auf der Mycel-Karte **Karten-Gedächtnis** eines durchgehenden Rekorder-Laufs, keine
vier lebenden Identitäten.

## Klaus' Entscheide (dokumentiert)

- **Alte Kennungen werden nicht gejagt** — Testphase, nichts verkauft, nichts verloren.
  Ursache beheben schlägt Identitäten retten.
- Freie Hand für die Umsetzung („entscheide selber, was Du für richtig hältst").

## Ehrliche Grenzen / offen

- **Browser-Sichttest wartet auf Klaus:** dieselbe App in zwei Fenstern → Kennung stabil,
  kein Handshake-Fehler.
- **Netzweite Lehre:** nach jedem Update **alle offenen Fenster neu laden** — in offenen
  Fenstern läuft der alte Code weiter. (Erklärt, warum der Fix vom Vorabend nachts nicht griff.)
- **„Speicher dauerhaft: ja" schützt NICHT** vor diesem Fehler — es war nie ein Räum-, sondern
  ein Lösch-/Parallelzugriffs-Problem.
- **0b offen:** Sicherung + Wiederherstellen im Panel, Aufräum-Knopf für Mehrfach-Fächer, und
  **Schluss mit stummer Neu-Anlage** (App legt beim Öffnen wortlos eine neue Identität an, wenn
  die Schublade leer ist — genau dort wurde aus einem Speicherproblem ein Identitätswechsel).

## Netz-Sync

`sbkim/SIGNAL.json` **seq 49 → 50** (Ursache + Härtung netzweit gemeldet, Rück-Quittung erbeten).
