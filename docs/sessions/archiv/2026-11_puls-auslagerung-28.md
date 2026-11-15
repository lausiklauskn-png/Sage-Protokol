# PULS-Auslagerung 2026-11-15 — ein Eintrag vom 2026-10-13

**Ausgelagert am 2026-11-15**, weil `docs/PULS.md` mit dem Eintrag „Film-Sequenzen“ über der 3000-Zeilen-Grenze
gestanden hätte (2997 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt kürzen**: hier steht der
Eintrag **wortwörtlich**.

---

## 2026-10-13 · Eigenes Netz Schritt 1 · Relais und Netz-Code einstellbar (Kanon 05b + 23)

**Brief:** [`docs/BRIEF_2026-10-13_eigenes-netz.md`](BRIEF_2026-10-13_eigenes-netz.md), Schritt 1. INTERFACES zuerst (05b Relais-Einstellung, 23 „EIGENES NETZ“), dann Code.

**Gebaut:**
- **05b:** `configure({relays})` nimmt nur `wss://`; ein schlechter Eintrag weist die **ganze** Liste ab. `{reset:true}` holt die Vorgabe zurück, `_meta.defaultRelays` nennt sie. Verbindungen zu Relais, die nicht mehr in der Liste stehen, werden geschlossen.
- **23:** `setNetwork({code})` / `applyNetwork({relay, code})` / `checkNetSetting` / `newNetCode` / Speicher `sbkim_netz_<dbSuffix>` (ohne Suffix wird nichts gespeichert). Aus dem Code (normalisiert, mindestens 12 Zeichen): Raum-Marke `sbkim-netz-…`, Frage-Marke `sbkim-netzq-…` (SHA-256), Schlüssel PBKDF2-SHA256 150 000 → AES-GCM-256. Inhalt als Umschlag `{v:1, iv, ct}`, die Marke als AAD; was nicht aufgeht, fällt still weg. Lage `net.lage`: oeffentlich · eigen · raum · wird-abgeleitet · ungueltig. **Eine ungültige Einstellung fällt nie ins öffentliche Netz zurück**, der Code gewinnt über `roomTag`.
- **Ohne Einstellung byte-gleich:** gemessen gegen `origin/main` mit eingefrorener Uhr und eingefrorenem Zufall.

**Gemessen:** `tests/smoke_netz_eigen.mjs` **63 grün · 0 rot** · `tests/gegenprobe_netz_eigen.mjs` (Wegwerf-Kopie) **14 gefangen · 0 blind · 0 aus falschem Grund · 0 tote Anker**. Bündel (`sbkim-bundle`, `-voll`) nachgezogen, Pin 6c25b63b.

⚠ **Benannte Grenzen:** der Handschlag `sbkim-anastomosis` (Modul 05) bleibt Klartext · noch **keine App** trägt die neue Fassung (Verteilung ist Schritt 2) · das Relais „intern Family Project“ (`wss://relay-intern.family-projekt.de`) gibt es noch nicht — DNS, Container und Caddy sind Schritt 4 · Kartenechtheit (Stufe 2b) unverändert.
⚠ **Vorbestehend, nicht von hier:** `sbkim-bundle-voll` meldet `siegel-inhalt.js` als nicht byte-1:1 — auf `origin/main` genauso (Arbeitskopie nachgemessen).

**Entschieden mit Klaus:** Relais „intern Family Project“ unter **`relay-intern.family-projekt.de`** (Klaus 2026-10-13: „Dieser Name ist okay.“) · im eigenen Netz soll die App **beim Öffnen automatisch** verbinden · Mein Rezeptbuch lauscht im öffentlichen Netz weiter selbst · erster Träger: Sende-Prüfer.

**Nächster Schritt:** Schritt 2 — 23-UI: Einstellung „Netz“ (Relais + Code, Code erzeugen/zeigen), Auto-Verbinden im eigenen Netz, Verteilung an den Sende-Prüfer.
