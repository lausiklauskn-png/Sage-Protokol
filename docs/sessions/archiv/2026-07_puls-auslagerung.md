# PULS-Auslagerung Juli 2026 — die Sitzungen vom 01. bis 29.07.

Ausgelagert am **2026-08-14** aus `docs/PULS.md` (Schutz-Klausel: 3000 Zeilen —
**auslagern statt kürzen**). Der Inhalt ist **wortwörtlich** übernommen, nichts
gekürzt und nichts zusammengefasst; die Git-Historie trägt ihn ohnehin.

Verfahren wie bei der Mai-Auslagerung vom 2026-07-24 (Klaus’ „Option A“):
Archiv-Datei + Zeiger an der Schnittstelle + Sammel-Zeile im Archiv-Index.
Diese Runde ist die dort schon vorgezeichnete Fortsetzung („Option B“).

---

<!-- Block: Stand-Eintraege Juli (PULS-Zeilen 2902–3487) -->

## Stand 2026-07-29 (Abend) — Befund aus Klaus' Mycel-Analyse: **die Identität überlebt die Sitzung nicht**

**Rolle:** Analyse-Sitzung (kein Code). Klaus lieferte seinen Mycel-Analyse-Rekord
(`mycel-analyse-20260729T174256.json`, Rekorder v1.3, 17:29:47–17:42:56 UTC, 43 Ereignisse)
mit der Vermutung, es seien „einige Sporen verloren gegangen oder vielleicht sogar in
Identitäten". **Die Vermutung bestätigt sich — mit einer anderen Ursache als zunächst
angenommen.**

**Was gemessen wurde.** Fünf Knoten waren live (BookLedgerPro · Jasons Tresor · Mein Tresor ·
Family Projekt · Kimboard, alle mit Gerätenamen „· Klaus Tablet"); die zehn übrigen
Register-Knoten waren schlicht nicht geöffnet (kein Befund). **Alle fünf Sporen sind
kryptografisch gültig** — mit `node:crypto` nachgerechnet: 5/5 Ed25519-Signatur gültig, 5/5
`nodeId === base64url(SHA-256(publicKey.x))`, alle `protocolVersion 0.2`, `nodeType hybrid`,
korrekte verschiedene Endpunkte. **Nichts gefälscht** — und die am selben Tag gebaute
Stufe-2b-Prüfung hätte keine davon fälschlich abgewiesen.

**Der Befund:** **keine einzige** lebende Kennung steht im Register, auch nicht in
`previousNodeIds` — BLP `6oKgwHRp…` (Register `MyHVM7Pd…`), Jasons `zHqjzJX5…` (`lbUthjt-…`),
Mein-Tresor `nmRebxCn…` (`feV3o4qJ…`), Family `eg23tVHt…` (`XoYhjpgm…`), Kimboard `vPg4z2Ci…`
(`1f9Jb7c3…`). Über die Läufe hinweg wechselt sie nachweislich: BLP 11.07. `itzsPCHy…` →
23.07. `ZAOvf9tZ…` → 29.07. `6oKgwHRp…`; Family 23.07. `xMRGRZEw…` → 29.07. `eg23tVHt…`.
**Der schärfste Einzelbeleg:** bei Family ist der Domänen-Vektor **exakt identisch** zum
committeten (cos 1.0000) und die Beschreibung ebenfalls — es ist **nur der Schlüssel** weg.
Kein Re-Embedding, keine Textänderung kann das erklären.

**Korrigierte Erst-Annahme (wichtig):** die Sitzung schrieb zunächst, die Apps würden sich
„beim Verbinden neu erfinden" — **das ist falsch und wurde gegenüber Klaus korrigiert.**
`connectAndAnnounce` (`23_rendezvous.js:581-612`) nimmt eine vorhandene Identität und meldet
sie an; `generateOwnSpore` (`02_spore.js:689-696`) signiert mit **derselben** nodeId neu; der
Knopf „🧹 Aufräumen & neu anmelden" ruft `repairAndReconnect()` **ohne** `newIdentity` und ist
**nicht** schlüssel-löschend; `cleanupSharedOrigin` löscht nur `sbkim`, nie `sbkim_<suffix>`;
vier Apps haben vier eigene Schubladen. Klaus hat auf Rückfrage nichts zurückgesetzt.
**Schluss:** der Schlüssel geht **zwischen** den Sitzungen aus dem Browser-Speicher verloren.

**Der zu prüfende Verdacht:** `navigator.storage.persist()` wird gerufen
(`01_storage.js:363`), das Ergebnis liegt in `_meta.storagePersisted` — und wird **nirgends
angezeigt** (nur im Membran-Schnappschuss, `15_membran.js:1035-1041`). Auf Android-Chrome
antwortet `persist()` für eine bloß im Tab geöffnete `github.io`-Seite typischerweise `false`;
dann darf das System räumen. **Verdacht, kein Beweis** — messbar, sobald der Wert sichtbar ist.

**Zweiter, unabhängiger Befund — die zwei Tresore sind für das Mycel EIN Knoten:**
cos(Jasons live, Mein-Tresor live) = **exakt 1.000000** (alle anderen Live-Paare 0.82–0.86).
Ursache gefunden: `sbkim/sbkim-init.js:107-108` ist in beiden Repos zeichengleich (derselbe
generische `domainDescription` + dieselben neun Keywords), und der Einbettungstext besteht
**nur** aus diesen beiden Feldern (`:116`) — der einzige Unterscheider `domain` geht nicht in
den Vektor. Die guten, verschiedenen Beschreibungen liegen seit 19.07. in beiden Repos
(`sbkim/spore.json`, `assets/siegel-inhalt.js:41`); der 🌐-Anmelde-Pfad liest sie **nie**.

**Dritter Befund — Schubladen-Widerspruch in BookLedgerPro:**
`window.SBKIM_DB_SUFFIX = "bookledgerpro-sbkim"` (`index.html:54`) gegen den Modul-23-Aufruf
`dbSuffix: "bookledgerpro"` (`sbkim/sbkim-init.js:239`, `:242`). Der Schlüssel bleibt richtig
liegen, aber die Hygiene-/Migrations-Proben fragen eine nicht existierende DB ab, legen sie
kurz an und löschen sie wieder — der Schutzmechanismus läuft ins Leere.

**Vierter Befund:** 12 Andock-Anfragen, **3 Antworten**, alle von BookLedgerPro. Bekannte
Rest-Grenze (Antworter-Tab muss vorn und wach sein) — auf einem Tablet kann von fünf offenen
Apps immer nur eine antworten. Eigenes Thema.

**Klaus' Entscheid:** Stufe 0 **nicht** mehr in dieser Sitzung bauen, sondern detailgetreu
festhalten und frisch starten — weil Stufe 0a eine **Messung** ist, deren Ergebnis über Nacht
entsteht und erst dann bestimmt, was 0b tun muss. Diese Sitzung liefert daher nur
Dokumentation, keinen Code.

**Offen / nächster Schritt:** [`docs/sessions/BRIEF_STUFE0_IDENTITAET_HALTBAR.md`](sessions/BRIEF_STUFE0_IDENTITAET_HALTBAR.md)
— vollständiger Auftrag mit Faktenblatt (alle Messwerte, damit nichts neu hergeleitet werden
muss), Anker-Tabelle je Repo und Akzeptanzkriterien. Reihenfolge:
`0a Kennung + Speicher-Status sichtbar machen (alle Repos) → ⛔ Klaus misst über Nacht → 0b
Identität haltbar machen`; `0c` (BLP-Schubladen-Fix), `0d` (Tresore trennen) und `0e`
(Register ehrlich) laufen unabhängig. **Stufe 0 kommt vor Stufe 3 des Schutz-Plans** — ohne
stabile Identität sind „Bekannte bevorzugen", Bezeugung und der geschlossene Kreis wertlos.
Übergabeprotokoll: `docs/sessions/archiv/2026-07-29_mycel-analyse-identitaetsverlust.md`.

## Stand 2026-07-29 — Schutz-Plan **Stufe 2b**: Echtheit der Karten im Rendezvous-Raum

**Rolle:** Bau-Sitzung Modul 23 (Schutz-Plan Stufe 2b, Fortsetzung von Stufe 1+2 in
Kimboard). **Befund, der den Bau ausgelöst hat:** `discover()` hat fremde Visitenkarten
**ungeprüft** angezeigt — es wurde nur geschaut, ob die Felder da sind, **nie** ob die
Spore echt ist (`verifyForeignSpore` fehlte ganz) und **nie** ob die Karte überhaupt ihre
eigene Spore trägt. Jeder konnte sich unter fremdem Namen ins Brett hängen; ein Fluter
konnte den Raum beliebig füllen.

**Gebaut (Tafeln zuerst, dann Code — CLAUDE.md § Heilige Tafeln):**
`docs/INTERFACES.md` (neue Konstanten + verbindlicher Block „ECHTHEIT DER KARTEN") und
`docs/components/23_rendezvous.md` (§ Echtheit der Karten) **vor** dem Eingriff nachgezogen.
Dann `src/modules/23_rendezvous.js`:
- **Bindungs-Prüfung** `card.spore.id === card.nodeId` — eine Karte kann keine fremde
  Spore unter eigenem Namen tragen. Braucht keine Krypto, wirkt also **immer**.
- **Ed25519-Prüfung je Karte** über Modul 02 `verifyForeignSpore` (neuer, getrennter
  Resolver `resolveVerifier()` — der alte verlangt nur `getOwnSpore`, eine App darf ein
  Spore-Modul ohne Prüfer mitbringen). Läuft **nach** dem Lauschfenster, weil die Prüfung
  async ist und der Empfangs-Callback sie nicht abwarten kann.
- **Mengen-Deckel:** `RDV_CARDS_MAX = 200` je Durchlauf, `RDV_CARDS_PER_SENDER_MAX = 3`
  Identitäten je Nostr-Absender. Still verwerfen — der Fluter erfährt nichts.
- **Ehrlich statt still:** fehlt der Prüfer, läuft der Raum weiter, meldet die Karten aber
  als `cardsVerified: false` **UNGEPRÜFT**; `rejected` zählt, wie viele rausfielen.

**TABU eingehalten:** `PROVIDER_MIN_MATCH`/0.80-Andock-Riegel unberührt, Kern-Module
02/05/05b unangetastet (nur öffentliche Flächen genutzt), kein PROTOCOL_VERSION-Bump.

**Beweis:** neuer `tests/smoke_bau23b_kartenechtheit.mjs` **16/16 grün** — mit einem
Prüfer-Mock, der die Prüfung wirklich durchläuft. Wichtig: die bestehenden 59 Proben in
`smoke_bau23_rendezvous.mjs` fahren einen Mock **ohne** `verifyForeignSpore` und liefen
darum am fail-soft-Pfad vorbei; der neue Test schließt genau diese Lücke. Probe 5 ist
zugleich die **Gegenprobe**: dieselbe faule Karte bleibt sichtbar, sobald der Prüfer fehlt.
Regress-frei: `smoke_bau23_rendezvous` 59/59, `..._ui` 83/83, Drift-Guard
`smoke_bundle_connect` 21/21 (Byte-Kopie `sbkim-bundle/modules/23_rendezvous.js` mitgezogen),
Siegel-Smokes 9/9 · 9/9 · 5/5 · 16/16.

**Pflicht-Konvention erfüllt:** `ZERTIFIKAT_ASPEKTE`-Eintrag 2026-07-29 / Modul 23 in
`src/modules/16_siegel.js` ergänzt (Schutz-Modul-Pflege → Aspekt, CLAUDE.md).

**Offen:** Klaus' Browser-Sichttest (Raum öffnen, Karten erscheinen weiterhin, Badge-Anzeige
unverändert) — **ungeprüft, wartet auf Klaus' Browser-Lauf**. Nächste Stufen aus dem
Schutz-Plan: 3 (Bekannte bevorzugen), 4 (Themen-Mycel + Steckbrief), 4d/4e (Wächter-Quorum
+ KI-Richter), 5 (Stufen-Schalter mit strikter Trennung), 6 (netzweiter Rollout).

## Stand 2026-07-25 — WorkFloh als 15. Endknoten registriert (Nachzug aus WorkFloh-Sitzung)

**Rolle:** Registrierungs-Nachzug (Haupt-Bau lief im Repo Mein-WorkFloh). **Getan:**
Mein-WorkFloh wurde SBKIM-Endknoten (SBKIM-Kern byte-1:1 aus Kim-Bell/Sage-Kanon,
Netz-Panel Modul 23 + Siegel/Andock-Wizard, DB-Suffix `workfloh`). Hier in Sage:
`status.json` um den **15. Endknoten „WorkFloh"** ergänzt (Werbetechnik-Auftrags-
abwicklung, `https://lausiklauskn-png.github.io/Mein-WorkFloh/`) + `sbkim/NETZ-STAND.md`
(Zeile + neue Legende `awaiting-browser-spore`). Die **Mycel-Karte liest `status.json`
automatisch** → WorkFloh erscheint beim nächsten Laden. **Ehrlich:** `pingStatus:
awaiting-browser-spore`, **kein** `matchScore` — die committete WorkFloh-Spore ist eine
Platzhalter-Spore (headless VALID, aber `domainVector` = `_demo`-Stub, ephemere nodeId).
**Offen:** Klaus erzeugt im WorkFloh-Browser über den Andock-Wizard die echte Identität +
den echten Vektor + committet `spore.json`; danach Folge-Sitzung: echte nodeId + Cross-
Knoten-Match/Live-Handshake nachziehen. **Nächster Schritt:** WorkFloh-PR mergen (Freibrief),
dann Klaus' Browser-Andock.

**✅ HOCHSTUFUNG (gleicher Tag, Klaus' Browser-Andock — WorkFloh ist funktionierender
Knoten):** Klaus hat im WorkFloh-Browser über den Andock-Wizard die **echte v0.2-Spore**
erzeugt+committet (nodeId **6YOPHbnK…**, echter `domainVector` 384-dim L2=1 + 3 Schnipsel,
kein `_demo`; headless reziprok **✔ VALID**). `status.json` + `NETZ-STAND.md` auf echte
nodeId + **`verified-match` 0.833465** gehoben. **Live-Beleg** (Mycel-Analyse 18:21–18:33):
„WorkFloh · Klaus Tablet" live im Raum `sbkim-rdv` mit 13 weiteren Knoten. Echte Matches:
**Tomys-Hub 0.8335 · Kimseek 0.8110** ≥ 0.80 (fachverwandt Werbetechnik/Druck); Sage 0.7824
< 0.80 → kein direkter Sage-Match (fachfremd zum Hub, wie Tomys). Zwei bezeugte Cross-Knoten-
Matches nachgetragen. Netzweit belegt: WorkFloh auch in SB-KIMTool-Point + family-project als
funktionierende PWA mit Siegel + Link registriert.

**✅✅ RE-SIGNATUR (gleicher Tag, 19:36 — Bedeutungstext-Umbau löst den Sage-Match):** Der
Live-Handshake WorkFloh↔Sage scheiterte zunächst (Sage-Cosinus 0.7824 < 0.80). Klaus hat den
`domainDescription` nach dem **Rezeptbuch-Muster** umgestaltet (WorkFloh als „Endknoten im
SBKIM-Mycel auf Grundlage des Sage-Protokolls", semantisch verbunden mit Tomys/BLP/Kimseek/Point,
wandelbares Branchen-Tool) und die Spore **neu signiert** (nodeId unverändert `6YOPHbnK…`, neuer
`domainVector` + 6 Schnipsel, reziprok VALID). **Wirkung gemessen:** Sage↔WorkFloh **0.7824 →
0.906269** = direkter Hub-Match; **12 Knoten ≥ 0.80** (Sage 0.906 · Point 0.897 · Muttis 0.878 ·
Rezeptbuch 0.876 · Tomys 0.860 · Kimseek 0.860 · Kim-Bell 0.849 · Jasons 0.849 · Family 0.846 ·
Mein-Tresor 0.845 · Mixarium 0.826 · Kimboard 0.817; nur Private Brain 0.771 drunter). **✅ LIVE-
HANDSHAKE** (Mycel-Analyse 2026-07-25 19:37 + 19:43): **WorkFloh ⟷ Sage BEIDSEITIG `established`**
übers echte Relais + Tablet⟷Handy `established`. `status.json`/`NETZ-STAND` + bezeugte Matches auf
0.906269 + Live-`established` nachgezogen. **Lehre:** die Infrastruktur-Rahmung im Domänen-Text
hebt fachfremde Knoten zuverlässig über den 0.80-Hub-Riegel (Rezeptbuch-Beleg bestätigt am
zweiten Fall).

## Stand 2026-07-24 (Abend) — PULS-Archivierung Mai (Klaus' Wahl: Option A)

Die Datei war auf ~10 020 Zeilen gewachsen (Schutz-Klausel nennt 3000). Klaus wählte **Option A**:
**nur die ältesten** Einträge auslagern, Juni + Juli bleiben inline. Die **51 Mai-Sitzungen (26.–31.05.)**
aus § „Sitzungs-Einträge" sind nach [`docs/sessions/archiv/2026-05_puls-auslagerung.md`](sessions/archiv/2026-05_puls-auslagerung.md)
verschoben (2 942 Zeilen), an der Schnittstelle bleibt ein Zeiger, im Archiv-Index eine Sammel-Zeile.
**PULS 10 020 → 7 111 Zeilen.** Nichts geht verloren (Git-Historie + Archiv-Datei). Vision-Anker (05-17/18/28)
+ alle Struktur-Sektionen unberührt. **Rest:** Juni könnte in einer Folge-Sitzung ebenso ausgelagert werden
(wäre „Option B"), wenn Klaus es noch schlanker will.

## Stand 2026-07-24 (Nachmittag, Folge) — OCR-Markdown-Putz (Klaus' Befund aus dem Live-Lauf)

Direkt nach dem OCR-Live-Beweis fiel Klaus beim **Internet-Weg** auf: der Mistral-OCR-**Markdown-Rausch**
(`![img-0.jpeg](img-0.jpeg)`, `#`/`##`-Überschriften) wandert wörtlich in die Google-Anfrage. Google
ignoriert das Meiste („Es fehlt: …") und fand trotzdem das richtige Rezept — aber die Anfrage ist unsauber.

- **Fix in Modul 24** (`src/modules/24_ocr_eingabe.js`): neuer Helfer `cleanOcrText` — Bild-Platzhalter
  `![…](…)` raus, Link `[Text](url)` → nur der Text, Überschriften-Marker `#`…`######` am Zeilenanfang weg,
  Mehrfach-Leerraum/Leerzeilen zusammengezogen; **der eigentliche Text bleibt vollständig**. Angewandt im
  `recognize`-Pfad (mistral + google), Browser-Klartext ist praktisch No-Op. Konsequent **fail-soft**
  (Nicht-Strings unberührt, kein Throw). Hilft **beiden** Wegen — interne Knoten-Suche UND Internet/Google.
- **Byte-Kopien** `such-tool/` + `pinnwand/` mitgezogen (beide nutzen Modul 24), **SW-Cache** gebumpt
  (`sbkim-such-tool-v4`, `sbkim-pinnwand-v19`). Sage-Hauptseite hat keinen SW → Hard-Reload reicht.
- **TABU gewahrt:** `PROVIDER_MIN_MATCH`/0.80-Riegel + PROTOCOL_VERSION unberührt, additive Fläche
  (`SbkimOcr.cleanOcrText`). Smoke `smoke_bau24` **52/52** (neue Probe 13, Klaus' echtes Rezept-Beispiel),
  Drift-Guards `standalone_such_tool` 49/49 + `pinnwand_dm` 16/16.
- **Browser-Sichttest des geputzten Textes wartet auf Klaus** (nach Hard-Reload: Foto → Feld sollte jetzt
  ohne `![img…]`/`#` sein).

## Stand 2026-07-24 (Nachmittag) — Demo-Anteil 2 % → **0 %**: die letzten drei Module grün (00·21·24)

Klaus hat nach der Arbeit die drei Rest-Module am Tablet durchgetestet — **Demo-Anteil steht jetzt
auf 0 %** (alle 27 Module non-stub, Fertig 21/21 im Modul-Kern; real 390 / max 390).

- **00 Doku-Fenster** — die echte **5-Klick-Geste öffnet das Doku-Fenster LIVE** (SBKIM-Knotenstand
  mit nodeId/Domäne/Protokoll 0.2/Geschwister/Vermächtnis-Inbox/Speicher, „Geöffnet 12:06"). Setup
  dokuReady · Test 2 Fenster öffnet + Snapshot vollständig (0 Fehler) · Test 4 Quota-Warnzeile 81 %
  sichtbar · Test 5 TTL-Sweep entfernt beide alten Geschwister. **Voll live-grün.**
- **21 Spracheingabe** — Logik grün (Sprachen DE/EN/RU, EU-Politik frei=[browser,eu]/bindend=[eu],
  pickEngine, `browserSupport:true`); Browser-Erkennung **live gestartet mit Mikro-Freigabe** (de-DE);
  EU-Engine fail-soft abbrechbar. **Ehrliche Grenze:** die Web-Speech-Transkription selbst ist ein
  Browser-Feature, EU-STT bleibt BYOK (optional).
- **24 OCR** — Logik grün (Anbieter mistral/google/browser + EU-Politik, isFileSupported png/jpeg/pdf,
  ocrErrorHint 3 Hinweise); OCR-Erkennen fail-soft abbrechbar. **Ehrliche Grenze:** Live-OCR bewusst
  BYOK — mistral/google brauchen Bezahl-Schlüssel, Browser-Shape-Detection hier nicht unterstützt
  (`browserOcrSupport:false`); der eigentliche Erkenn-Lauf ist ungetestet-aber-fail-soft. Score
  „fertig" mit diesem Vermerk (Klaus' Drive-to-0, Modul-Logik voll bewiesen; upgradebar sobald ein
  echter OCR-Schlüssel läuft).

`status.json`: Score `stub`→`fertig` für **00·21·24**. Pie: Fertig 18→**21**, Code-Stub 3→**0**.
Zusammen mit dem Vormittags-Strang (01/02/06/07/08/20/25) sind damit **alle 10 einst-stub-Module
auf „fertig"** — der Demo-Anteil-Ring steht auf **0 %**.

**Nächster sinnvoller Schritt:** nichts Dringendes mehr am Demo-Anteil. Wenn Klaus mag: (1) den
24-OCR-Live-Lauf mit echtem Schlüssel nachholen (macht den Vermerk voll), (2) die große `PULS.md`
(~10 000 Zeilen) in einer eigenen Pflege-Sitzung ins Archiv auslagern.

## Stand 2026-07-24 (Vormittag) — Demo-Anteil 8 % → 2 %: sieben Module auf „fertig" (Klaus-Browser-Sichttest)

Interaktive Sichttest-Sitzung mit Klaus am Tablet (deployte
`tests/manual_check.html`). Ziel: die stub-Module auf „fertig" bringen und damit
den Demo-Anteil senken (die 8 % kamen **allein** von den 10 stub-Modulen — jeder
stub verliert 3 der 10 Punkte; alle 14 Endknoten zählen schon voll live).

**Fünf Module heute im Browser durchgetestet — alle Panel-Tests grün:**

- **01 Storage** — init (DB v10, 14 Stores) · round-trip · UnknownStoreError · ensureStore
  happy-path (v10→11) + idempotent + InvalidStoreNameError · **versions-fail-soft** (v11→12,
  Re-Init nach Reload sauber, kein `VersionError` — der alte Wackel-Punkt ist bestätigt geheilt).
- **02 Spore** — Identität stabil (gleiche nodeId) · Sign+Verify · Manipulation erkannt
  („Signatur ungültig") · Export v2/PBKDF2-600k/AES-GCM. Backup-**Restore** nicht per Panel
  (Klaus wollte keine Datei einlesen) — **real bewiesen** durch den netzweiten Spore-/
  Identitäts-Austausch (mehrfach, alle Repos). „Backup einlesen"-Rot = kein Test (keine Datei gewählt).
- **06 Heterokaryose** — Tests 1–12 alle grün (shared/`anchor_count:1` nach #724-Fix · opt-out ·
  opt-out-local · UnknownSiblingError · alle rejected-Pfade mit richtigem Grund · Signatur ·
  MAX_ANCHORS=5 neueste-zuerst · list ohne Vektoren · forget idempotent · endpoint_unsupported).
- **07 Apoptose** — Tests 1–8 alle grün (Vermächtnis-Round-Trip · Signatur · Version · TTL-Cleanup ·
  listLegacy · Self-Apoptose completed/Stores leer/`NoIdentityError` · Token-Ablauf · unbekannter Sender).
- **08 UI-Demo** — Tests 1–6 alle grün (add+list · remove idempotent · überschreiben · OutboxFullError ·
  Validierung 6 Fälle · setSiblingHeteroOptIn strikt boolean).

**Zwei weitere geflippt (waren schon dokumentiert grün, nur nie im Score umgestellt):**
**20 Schlüssel-Safe** (Panel 20 GRÜN 2026-07-17) · **25 Pseudonymisierung** (Panel 25 GRÜN 2026-07-17).

**Ergebnis:** `status.json` — Score `stub`→`fertig` für **01·02·06·07·08·20·25** (7 Module).
Pie: Fertig 11→**18**, Code-Stub 10→**3**. **Demo-Anteil rechnerisch 8 % → 2 %**
(real 381 / max 390; identisch zur `index.html`-`computeScore`-Formel). Pie-Block via
`scripts/update_puls_pie.py` neu gezogen.

**Offen (die letzten ~2 %) — drei stub-Module, brauchen Sondertests am Tablet:**
`00 Doku-Fenster` (5-Klick-Trick auf der echten Sage-Seite) · `21 Spracheingabe`
(Live-Mikro; Logik-Knöpfe gehen ohne, echter Sprech-Test braucht Mikro — gratis) ·
`24 OCR` (echter BYOK-OCR-Schlüssel für den Live-Erkenn-Test). **Nächster Schritt:** Panel 21
(3 Logik-Knöpfe + gratis Browser-Mikro-Test), Panel 24 (3 Logik-Knöpfe), 00 auf der Seite → 0 %.

## Stand 2026-07-23 (Abend, Meilenstein-Strang) — A18-Siegel-Modal + Multi-Knoten-Mesh-Meilenstein + Galerie-Fix

Interaktiver Strang mit Klaus (parallel zum A11/A15-Strang oben). Alles gemergt:

- **A18 Teil 1 — Sage-Siegel-Modal auf den Kanon** (PR #712): `index.html` lädt jetzt
  `assets/siegel-inhalt.js`; Sages alte Inline-Injektion ins Siegel auf `window.__sbkimSiegelInhalt`
  gated (kein Doppel, Fallback bleibt). Kanon-Datei UNVERÄNDERT → family-project + alle Endknoten
  byte-1:1 in Sync. **Klaus-Entscheid: die Schwarz-Loch-Karte + der 785-Zeilen-Inline-Wizard bleiben
  bewusst** (funktioniert, reine Aufräumarbeit ohne Demo-Nutzen). **Browser-Sichttest des Siegel-Modals
  steht noch aus** (Klaus, goldenes Badge).
- **Meilenstein „Erster Multi-Knoten-Mesh-Handshake"** (PR #713 Doc + #714 Bild): aus Klaus'
  Mycel-Analyse-Rekord (Relais-Aufzeichnung eigens in der Mycel-Karte aktiviert → echter Verkehr):
  **5 Apps, 10 Handshakes alle `established`, 7/10 hub-unabhängig, Scores 0.80–0.85, alles über das
  Relais**. `docs/meilenstein/2026-07-23_multi-knoten-mesh-handshake.md` + `.png` (Klaus' Bild).
  BLP established mit Demo-Stub-Vektor (bewusste Ausnahme, im echten Netz belegt).
- **Meilenstein-Galerie-Fix** (PR #715 + #716): Kachel-Text wurde beim Öffnen unten abgeschnitten
  (Quadrat + overflow:hidden) → Kachel wächst jetzt bei `.is-open` auf volle Text-Höhe; Hover-Zittern
  behoben (Aufklappen nur noch bei Klick/Tipp, nicht :hover); neue ⭐-Kachel „Fünf Knoten bilden ein
  Netz" (23.07.) ergänzt. Klaus-Sichttest GRÜN.
- **Ehrlicher „Demo → real"-Befund** (aus der Bestandsaufnahme): Sage ist protokollarisch schon KEIN
  Demo mehr (Identität/Spore/Andock/Cross-Knoten-Q&A live bewiesen). Rest bis „definitiv kein Demo":
  **MUSS** = BLP-Stub als bewusste Ausnahme festschreiben + protokoll-nahe Browser-Sichttests (Kimseek/
  Kimboard/Private Brain Live-Handshake, Muttis, B3, B7) + A18-Siegel-Sichttest. **KANN/später** =
  Schutz-Schablonen 10/11/12/14 (nur bei Angriff), B6/Grad C, Observatorium-als-Knoten.
  Klarstellung: `config.PROTOCOL_VERSION 0.1` ist **Absicht** (Wire-Version bis B6), kein Bug.

## Stand 2026-07-23 (Folge¹⁰) — Erst-Kontakt-Fluss NETZWEIT ausgerollt

Klaus: „Rollout" → der Erst-Kontakt-Fluss (A15-Inc-1 + A11B-Inc-2/3) byte-1:1 in die Träger-Apps.

- **Voller Fluss (Modul 22 Inc-2/3 + 23-UI Inc-1 + `connectNode`-Wire):** **Kimseek** (#42, gemergt) — die App,
  die Modul 22 + 23 trägt (Host-Wire `kimseekConnectNode`). Sage selbst trägt den vollen Fluss schon (Inc-1/2/3).
- **Zwei-Stufen-Hinweis (23-UI Inc-1) byte-1:1 gemergt in 8 Apps:** Mein-Mixarium #159 · Mein-Rezeptbuch #345 ·
  Muttis-Rezeptbuch #158 · Tomys-Hub #124 · family-project #107 · Jasons-Tresor #132 · Mein-Tresor #74 · Kimboard #42
  (Kimboard: Drift-Guard-sha nachgezogen + SW `kimboard-v29`). Alle: REINE Anzeige, Kern + 0.80-Riegel unberührt,
  fail-soft; wo kein Live-Pfad, degradiert der Ask/Connect still (die 8 tragen Modul 22 nicht, nur das Netz-Panel).
- **Modul 22 nur in Kimseek + such-tool-Vorlagen:** Mixarium/Rezeptbuch/family/BLP haben eigene native Suchfelder
  (kein Floating-Widget) → Inc-2/3 dort nicht anwendbar.
- **Offen (klein, niedrige Prio):** SB-KIMTool-Point such-tool + `web/tools`-Widget-Kopie liegen eine Version hinter
  dem Kanon (Vorlage, fail-soft) — eigener Nachzug-Schritt. **Browser-Sichttest des Flusses (Sage + Kimseek) wartet auf Klaus.**

---

## Stand 2026-07-23 (Folge⁹) — A11B-Inc-3 gebaut („🤝 verbinden" nach der Antwort)

Klaus: „Inc-3" → der Verbinden-Knopf nach der Antwort. Damit ist der **Erst-Kontakt-Fluss komplett**
(stöbern → Knoten fragen → verbinden).

- **„🤝 mit diesem Knoten verbinden"** erscheint in der Widget-Detail-Karte **erst NACH einer Antwort**
  (Erst-Kontakt über Neugier). Neue Widget-Fläche `options.connectNode(nodeId)` (+ `_meta.liveNodeConnect`);
  Sage-Wire **`sageConnectNode`** in `sbkim-init.js`: Modul 23 `discover` (Raum) → Karte zum nodeId finden →
  `handshakeCard` → **der 0.80-Andock-Riegel (Modul 05) entscheidet unverändert**. Ergebnis ehrlich benannt
  (✓ verbunden NN % · „unter der Andock-Schwelle" · „noch nicht angemeldet: 🌐 voll mitmachen").
- **REINE Anzeige/Auswahl — Kern (02/05/05b) + 0.80-Riegel + PROTOCOL_VERSION unberührt**, fail-soft (ohne
  `connectNode`-Injektion kein Knopf; Standalone/Forker unberührt). Kein PII (nur öffentliche nodeId/Spore).
- Smoke `smoke_bau22_such_widget.mjs` **268/268** (Probe 53), bau22e 46 / bau22f 17 / bau22g 47 / Standalone 49 grün,
  byte-1:1 `such-tool/modules/22`. **Offen: netzweiter Rollout** (Modul 22 + `23_rendezvous_ui.js` A15-Inc-1 +
  `connectNode`-Wire in jede Träger-App, in einem Rutsch). **Browser-Sichttest des ganzen Flusses wartet auf Klaus.**

---

## Stand 2026-07-23 (Folge⁸) — A11B-Inc-2 gebaut (Knoten gezielt fragen im Such-Widget)

Klaus: „weiter" → **A11B-Increment 2** (der eigentliche Erst-Kontakt-Fluss).

- **Knoten-Detail-Frage im Such-Widget** (`src/modules/22_such_widget.js` + byte-1:1 `such-tool/`): Klick auf einen
  **KNOTEN-Treffer** (nodeId) öffnet die Detail-Karte jetzt mit **„Frage an diesen Knoten"** — Feld vorbelegt mit der
  Suchfrage + **„🔎 Antwort holen"** → fragt gezielt via `queryNodeFn(nodeId, frage)` (der schon injizierte Live-Pfad,
  Modul 05) und zeigt die bedeutungs-sortierte Antwort direkt in der Karte. `merkItemOf` trägt jetzt `nodeId`.
- **REINE Anzeige/Auswahl — 0.80-Riegel + Kern (02/05/05b) unberührt**, kein neuer Kern-Bezug (nur die öffentliche
  `queryNode`-Fläche), fail-soft: ohne Live-Pfad ehrlicher Hinweis „einmal 🌐 voll mitmachen" (A15-Stufe ③).
- Smoke `smoke_bau22_such_widget.mjs` **264/264** (Probe 52), bau22e 46 / bau22f 17 / bau22g 47 / Standalone 49 grün,
  Drift-Guard byte-1:1. **Offen: A11B-Inc-3 („🤝 verbinden" nach Antwort) + netzweiter Rollout Modul 22 + 23-UI.**
  **Browser-Sichttest wartet auf Klaus.**

---

## Stand 2026-07-23 (Folge⁷) — A15-Inc-1 gebaut (Zwei-Stufen-Hinweis)

Klaus bestätigte die Richtung („Schauen frei, Mitreden mit Identität — logisch und nachvollziehbar")
→ **A15-Increment 1** gebaut.

- **Zwei-Stufen-Hinweis** in `src/modules/23_rendezvous_ui.js` (+ byte-1:1 `sbkim-bundle`): ehrliche
  Kosten-Benennung im „🌐 Mit dem Netz verbinden"-Panel — **🔎 Nur stöbern** (anonym, kein Download/keine
  Identität, du wirst nicht gefunden) vs. **🌐 Voll mitmachen** (einmal lokale Identität → auffindbar +
  fragen/verbinden). **REINE Anzeige — kein Verhaltens-Eingriff**, Kern/0.80-Riegel/PROTOCOL_VERSION unberührt.
- Smoke `smoke_bau23_rendezvous_ui.mjs` **83/83** (2 neue A15-Proben), byte-1:1 Drift-Guard grün.
- **Offen:** A11B-Inc-2 (Knoten-Detail-Karte im Such-Widget mit „Antwort holen") + A11B-Inc-3 („🤝 verbinden"
  nach Antwort) + netzweiter Rollout der UI-Datei. **Browser-Sichttest wartet auf Klaus.**

---

## Stand 2026-07-23 (Folge⁶) — A11-Teil B + A15 Spec geschrieben (Erst-Kontakt-Fluss)

Klaus: „Weiter mit A11 und A15." Beide sind derselbe Moment (fremder Nutzer, Erst-Kontakt am
Marktplatz) → **eine gemeinsame Spec**: `docs/SPEC_A11B_A15_ZWEISTUFEN_VERBINDEN.md`.

- **Entwurf:** drei Sichtbarkeits-Stufen — ① Stöbern (Raum-Liste, kein Modell/Identität) · ② Stöbern
  semantisch (Modell on-demand) · ③ Voll mitmachen (Identität → auffindbar/fragen/andocken). A11-Teil B =
  der Fluss „Knoten-Treffer anklicken → 🔎 Antwort holen → 🤝 verbinden (nach Antwort)".
- **Kern-Entscheid (der einzige echte Fork):** darf ein anonymer Beobachter live fragen? **Empfehlung NEIN** —
  Fragen/Andocken = Stufe ③ (Identität). Grund: `askNode` verlangt heute eine signierte Identität (Code geprüft);
  das hält den Vertrag + Kern-Module **unangetastet** (reiner UI-/Fluss-Bau) und deckt sich mit Klaus' A15-Wortlaut
  („findet andere, wird selbst nicht gefunden"). Übergang sanft: an den Interaktions-Knöpfen erscheint „einmal
  anmelden (bleibt lokal)". **Ephemeral-Fragen bewusst zurückgestellt** (wäre Kern-Eingriff + Sybil-Vektor).
- **Bau-Plan:** A15-Inc-1 Zwei-Stufen-UI → A11B-Inc-2 Knoten-Detail-Karte im Widget → A11B-Inc-3 „🤝 verbinden"
  nach Antwort → netzweiter Rollout. Je eigener PR + Headless-Smoke; Kern/0.80-Riegel/PROTOCOL_VERSION unberührt.
  **Marktplatz-Erst-Kontakt → Klaus' Browser-Sichttest je Increment.** PLAN + Spec verlinkt. Doku-only bisher.

---

## Stand 2026-07-23 (Folge⁵) — A5b Multi-Query in Pinnwand + Kimboard (Klaus' Zuruf)

Klaus: „und in Pinnwand und in Kimboard integrieren" → **A5b** (die frühere „Pinnwand läuft gut"-Zurückstellung
damit aufgehoben).

- **A5b Multi-Query gebaut** in Sage-**Pinnwand** (`pinnwand/index.html`) **und Kimboard** (`index.html`, eigenes Repo,
  PR #41 gemergt). Die Bedeutungs-Sortierung bettet neben der Original-Frage jetzt ein paar **Varianten** ein
  (`expandQuery`: Füllwörter weg + kleine erweiterbare Synonym-Karte, max 4) und nimmt je Antwort den **besten Cosinus**
  (`bestRelevance`) über alle Varianten. So werden auch **anders formulierte** Antworten gut sortiert.
- **REINE Sortier-Fläche wie der family-Marktplatz — es wird NICHTS gefiltert**, fail-soft (keine Variante →
  Ein-Frage-Sortierung wie zuvor). Nur `index.html`; drift-guarded `modules/` + Kern (02/05/05b) + 0.80-Riegel +
  PROTOCOL_VERSION **unberührt**, kein PII.
- Sage-Pinnwand `pinnwand/_smoke.mjs` **62/62** (neue A5b-Probe). Kimboard `node --test` **6/6** (A5b-Assertions),
  SW-Cache `kimboard-v28`. **Browser-Sichttest (Live-Rangfolge) wartet auf Klaus.** PLAN + Checkliste abgehakt.

---

## Stand 2026-07-23 (Folge⁴) — A12-Spec abgeschlossen („Antworten an/aus"-Modell)

Autonom weiter „die Reihe nach" (Klaus rejected die Rückfrage → Freibrief greift, kein Nachfragen).
Nächster spec-barer, kern-freier Listenpunkt genommen: **A12**.

- **A12 als Spec/Konzept ABGESCHLOSSEN** → `docs/SPEC_A12_ERREICHBARKEIT.md`. Ergebnis: das
  „Antworten: an/aus"-Modell ist **entschieden**. Das **Briefkasten-Prinzip** (Phase 1–2d, schon
  gebaut/netzweit) ist die verfassungsfeste Antwort auf „Erreichbarkeit ohne Server"; ein
  **„Immer-erreichbar"-Server wird bewusst NICHT gebaut** (Empfangsmodus verbietet Pulsation +
  Browser drosselt Hintergrund-Tabs + Ehrlichkeit). Frage (1) Erreichbarkeit = gebaut · (2) Flut =
  im Kern gelöst (Rate-Limit 6/min + `qidSeen`-Dedupe + Lebenszyklus) · (3) eigene vs. fremde =
  per Design schon erfüllt (eigene Frage = Vordergrund → Vorrang, kein Scheduler nötig).
- **Offen bleiben nur zwei kleine, optionale, additive Bauten** (Klaus' Wahl, blockieren nichts,
  0.80-Riegel/Kern 02/05/05b/INTERFACES unberührt): **A12-opt-1** pro-Peer-Antwort-Fairness
  (Modul 23 nutzt Modul-11-Token-Bucket pro Frager statt globaler Quote) · **A12-opt-2** lokaler
  „beim Öffnen gleich antworten"-Merker (opt-in, Default aus).
- PLAN + Checkliste-HTML nachgezogen (A12 abgehakt, zwei Rest-Bauten ergänzt). **Doku-only, kein Code,
  kein Test berührt.**

---

## Stand 2026-07-23 (Folge³) — S5 Härtungs-Sims gebaut + A18-Status geklärt

Auftrag Klaus: „S5-Härtungs-Sims und A18".

- **S5 erledigt (headless):** die im echten Browser-Lauf gefundenen Antwort-Härtungsfälle
  (A2-Härtung II 2026-07-10, hub-unabhängig 2026-07-11) sind als **Phase 6** in
  `tests/sim_multinode.mjs` als Regression festgenagelt (echter Relais-Round-Trip
  `enableAnswering ↔ askNode` über den geteilten Bus, echte Knoten-Instanzen):
  6a Frage-Timeout (pending, kein Hänger) · 6c Korpus-leer-Falle (`answerCorpusEnsured`) +
  Antworter-Vorwärmen · 6d Adress-Wand/newest-per-name (STALE verliert gegen lebende ID) ·
  6e A12-Briefkasten (späte Antwort nachgeholt) · 6f LIVE-Round-Trip (bester Treffer oben,
  `answeredCount++`) · 6g Timeout zu totem Knoten. **Sim 22→36 grün, über 5 Läufe stabil.**
  Ehrlich: Mock-Bus + Embedding-Stub — geprüft ist die VERDRAHTUNG, nicht Live-Latenz/echtes Modell.
- **A18-Status geklärt (Befund, kein Bau):** der Siegel-Andock-Wizard ist **netzweit bereits
  abgeschlossen** (Stand 2026-07-16, PLAN A18): geteilter Kanon `siegel-inhalt.js` in
  Sage/Kim-Bell/Mixarium/Rezeptbuch/Tomys/family-project; Point/Kimboard/Kimseek/Tresore mit
  eigener spec-konformer Fassung; BLP bewusst gelassen. **Einzig offen:** die **Sage-Page selbst**
  vom Inline-Wizard auf die Kanon-Datei `assets/siegel-inhalt.js` umstellen — **Hub-Risiko, braucht
  Klaus' Sage-Browser-Test** (kein Blind-Self-Merge). **An Klaus zurückgegeben** (bauen + du testest,
  oder Inline-Wizard lassen).
- **Suite 61/61 grün.**

---

## Stand 2026-07-23 (Folge²) — RELATEDNESS_CENTER v2 gebaut (Klaus' Entscheid „V2 bauen")

Auftrag: Brief `BRIEF_RELATEDNESS_CENTER_V2_…` Punkt 2.1. **Klaus-Entscheid diese Sitzung: „V2 bauen"**
(nach Vorlage der Messung + der ehrlichen Grenze).

- **Befund vorgelegt, bevor gebaut wurde:** v1-`RELATEDNESS_CENTER` (7 Vor-v0.2-Vektoren) mis-rankt
  nach der v0.2-Re-Sign-Welle — unverwandt **Point↔Sage 0.46 > echte Schwestern Mixarium↔Rezeptbuch
  0.38**. Auch ein v2 aus den **14 Live-v0.2-Vektoren** stellt **keine volle** Schwelle her (Nachbar-
  Domänen Essen↔Trinken bleiben im Band der Hub↔Werkzeug-Überlappung) — deckungsgleich mit dem
  2026-06-28-Befund. **Aber:** v2 stellt die **enge-Schwester-Rangfolge** wieder her.
- **Gebaut (reine Anzeige):** `RELATEDNESS_CENTER` neu gemittelt aus den 14 Live-`domainVector`
  (ohne Schnipsel), L2-normiert; `RELATEDNESS_MIN 0.30` unverändert (sitzt in der Lücke 0.19..0.78 →
  Schwestern `isRelated=true`, alles andere `false`). `isRelated==true` heißt jetzt ehrlich **„klar
  dieselbe Domäne", NICHT „fachverwandt"** — echtes Fach-Urteil = opt-in KI-Richter (`hybridMatch`).
- **Tafel-Evolution NICHT stillschweigend:** der 2026-06-28-Beschluss „v1 bleibt, v2 verworfen" ist
  in `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` (neuer Stand 2026-07-23 + „⚠️ ÜBERHOLT"-Marke am
  alten Punkt) sauber überschrieben — neuer Grund: v1 mis-rankt nach v0.2, das gab es 06-28 noch nicht.
- **Tabu gewahrt:** `PROVIDER_MIN_MATCH = 0.80` + PROTOCOL_VERSION unberührt (0.80-Riegel = ROHER
  Cosinus, v2 gatet nichts). Byte-1:1 in `such-tool/`+`sbkim-bundle/` (Drift-Guards grün).
- **Tests:** `smoke_bau04e` zurück von „nur Invarianten" auf **echte Trennungs-Prüfung** (27/27);
  `smoke_bau22e`+`smoke_bau23` auf die enge Schwester **Rezeptbuch↔Muttis** umgestellt (Essen↔Trinken
  ist unter v2 bewusst nicht mehr `isRelated`). **Suite 61/61 grün.**
- **Offen:** Klaus' Browser-Sichttest der „verwandt"-Anzeige (deployt nach Merge). BLP v0.2 (2.2),
  S5-Härtungs-Sims (2.3), A18/A11 unberührt.

---

## Stand 2026-07-23 (Folge) — Register-Refresh gegen die LIVE-Sporen + Muttis als 14. Knoten (Hauptsitzung)

Auftrag: Brief `BRIEF_NETZSTAND_REGISTER_REFRESH.md` (2.1 Register-Refresh, 2.3 Muttis).
Klaus-Entscheide in dieser Sitzung: **„Register voll aktualisieren" + „die falschen Test/Sim-
Annahmen mitkorrigieren"**; Muttis-Entscheid **per Tat** (Klaus hat die Muttis-Spore im Browser
erzeugt + hochgeladen → voller Knoten).

- **Autoritative Live-Prüfung (server-los erreichbar über authentifiziertes GitHub-MCP):** alle
  **12 fremden Live-Sporen frisch von `main`** geholt + mit dem Produktiv-Verifizierer (Modul 02
  `verifyForeignSpore`) headless geprüft → **alle VALID**, Sage-Cosinus je Knoten unabhängig
  nachgerechnet. **Befund: das Register war mehrfach stale** — 9 von 12 committeten nodeIds
  überholt (Adress-Wand, neue v0.2-Identitäten), **alle** matchScores gedriftet (durchweg HÖHER,
  nicht tiefer). **Wichtig:** die letzte Sitzung (PR #697) hatte aus **veralteten lokalen
  Inbox-Kopien** geschlossen „Rezeptbuch 0.792 / Mixarium 0.767 < 0.80" — die **Live-Wahrheit ist
  das Gegenteil**: Rezeptbuch **0.881**, Mixarium **0.822** (beide klar ≥ 0.80). Nach der v0.2-Welle
  liegt der e5-Anisotropie-Boden noch höher (≈0.85), **alle Inhalts-/Werkzeug-Knoten ≥ 0.80**.
- **`status.json` voll aktualisiert (14 Endknoten):** 9 stale nodeIds → Live-Werte (alte in
  `previousNodeIds`), alle matchScores → Live-Cosinus, ehrliche Refresh-Notizen. **Tomys Hub**
  `verified-match` → **`verified-spore`** (Sage 0.791717 < 0.80 → kein Sage-Match; matcht weiter
  Family/BLP, hub-unabhängig). **Private Brain** `verified-spore` → **`verified-match`** (0.810427
  ≥ 0.80). **Muttis Rezeptbuch** als **14. Endknoten** (verified-match **0.876583**, eigene GETRENNTE
  Identität `8TVDCTAc…` + DB-Suffix `muttisrezeptbuch`, ✔ VALID). `sage-knoten-korpus.js` (8 nodeIds)
  + `NETZ-STAND.md` (Scores/Labels/Muttis) + `muttis_inbox.verify.md` nachgezogen. `update_puls_pie` gelaufen.
- **Muttis:** ist bereits **voll auf seinem eigenen `main` integriert** (Module 00–08/15–18/20/21/23,
  `status.json`-Identität, `sbkim/spore.json` byte-identisch zur verifizierten Upload-Datei) — kein
  Muttis-Repo-Push nötig, nur Sage-Register-Eintrag + Prüf-Vermerk. Getrennter DB-Suffix = keine
  Geteilte-Origin-Kollision mit Mein-Rezeptbuch.
- **Inbox-Kopien refresht** (rezeptbuch/mixarium/point/jason/meintresor/bookledgerpro auf die Live-
  v0.2-Sporen; neu: `tomys_inbox.json` als ehrliches <0.80-Beispiel, `muttis_inbox.json`).
- **Falsche Test/Sim-Annahmen korrigiert (Klaus-Auftrag):** `sim_multinode` Phase 3 + `smoke_bau23_
  rendezvous` Probe 15 + `smoke_bau04e_relatedness` reflektierten die stale „<0.80"-Wahrheit. Jetzt
  ehrlich: Rezeptbuch/Mixarium ≥ 0.80 (established), **Tomys** als einziger echter <0.80-Fall vs Sage.
  **`smoke_bau04e`:** die v0.2-Welle hat auch den **zentrierten** Cosinus verschoben — mit
  `RELATEDNESS_CENTER` v1 trennt er diese Knoten NICHT mehr sauber (Point↔Sage 0.46 > Mixarium↔
  Rezeptbuch 0.38). **Nicht grün-gerechnet:** Modul 04 NICHT angefasst; der Test prüft jetzt nur die
  wahren Invarianten (Symmetrie, self=1, roher Gate ≥0.80, Schwestern am verwandtesten) + dokumentiert
  **RELATEDNESS_CENTER v2 als offenen Modul-04-Kalibrier-Entscheid (wartet auf Klaus).**
- **Suite: 61/61 grün** (unabhängig nachgefahren, `npm install --no-save fake-indexeddb`).

**Offen / nächster Schritt:** (a) **RELATEDNESS_CENTER v2** — Modul-04-Entscheid, ob der zentrierte
Cosinus-Mittelpunkt aus den neuen v0.2-Vektoren neu berechnet wird (architektonisch, byte-copy-weit →
Klaus). (b) **BLP v0.2** — einziger verbliebener Demo-Grenzfall (Spore noch v0.1). (c) S5-Härtungs-Sims,
A18/A11 (aus Brief). (d) Muttis Live-Ed25519-Handshake im Browser (headless-Beweis steht).

## Stand 2026-07-22 — Karte + Knoten-Register + Modul-Status-Klarstellung

Auf Klaus' Zuruf (Icon/Knoten/Module-Runde):
- **Mycel-Karte** `mycel-karte/index.html`: Seed von 8 auf **13 Knoten** ergänzt
  (Tomys, Kim-Bell, Kimseek, Kimboard, Private Brain), Kanten ehrlich nach
  NETZ-STAND (PR #690, gemergt).
- **Knoten-Register synchronisiert:** Private Brain als **12. Endknoten** in
  `status.json` aufgenommen (`verified-spore`, matchScore noch offen); Such-Korpus
  `sbkim/sage-knoten-korpus.js` um **Private Brain, Family Projekt, Tomys Hub**
  ergänzt (jetzt 12 Einträge) — echte nodeIds aus den Sporen, keine erfundenen Daten.
- **Modul-Status ehrlich klargestellt** (Klaus-Entscheid: Code-Stub behalten, aber
  klarstellen): 05 Anastomose = `fertig` (Live-Handshake). 06 Heterokaryose bleibt
  `score:stub`, aber `siegel` erklärt jetzt „Code-Stub = gebaut + headless-grün
  (Smoke 25/25), NICHT leer; nur Browser-Sichttest offen". CLAUDE.md-Modultabelle
  (00–09) für 05/06 korrigiert (waren fälschlich „spec ausstehend"). 21/24 waren
  schon ehrlich beschriftet.
- Tests: status.json valide (12 Endknoten), Pie unverändert (10 Code-Stub / 11 Fertig),
  smoke_bau19 15/15, smoke_bau23b_korpus 24/24, smoke_bau06y 25/25, korpus `node --check` grün.
- **Icon:** family-project-Marktplatz zieht das neue Private-Brain-Icon per URL
  automatisch — kein Eingriff nötig. Browser-Sichttests (Karte am Tablet) offen.
- **Nachtrag:** **Tomys Hub** als 11. Endknoten in `status.json` nachgezogen (war nur
  in NETZ-STAND + Such-Korpus + Karten-Seed, fehlte im Register). Ehrlich: kein
  Sage-Match (0.7977 < 0.80), aber verified-match zu Family (0.8073) + BLP (0.8064),
  live bidirektional bewiesen 2026-07-11. Jetzt 13 Endknoten. smoke_bau19 15/15, Pie unverändert.

## Stand 2026-07-23 — Sage „Demo → real": Ist-Stand ehrlich + Multi-Knoten-Sim (Hauptsitzung)

Auftrag: Brief `BRIEF_NETZWEIT_STAND_UND_SAGE_REAL.md`. Empfohlener Einstieg 2.1 (Test +
Bestandsaufnahme) → 2.2 (Simulationen) → A14. Diese Sitzung hat 2.1, 2.2 und die
A14-Nachlese erledigt.

- **S1 — Netzweiter Testlauf (ehrlicher Ist-Stand):** alle 60 `tests/smoke_*.mjs` gefahren
  (`npm install --no-save fake-indexeddb`, per-Test-Timeout). **Ergebnis war 56/60 grün, 4 rot** —
  jetzt **60/60 grün** nach ehrlicher Reparatur (KEINE Code-Bugs):
  - `smoke_bau04e_relatedness` · `smoke_bau22e_waehlen` · `smoke_bau23_rendezvous` (Probe 15):
    alle drei assertierten `Hub<->Endknoten match() >= 0.80` mit **Rezeptbuch/Mixarium<->Sage**.
    Nach der v0.2-Re-Sign-Welle (A10) fielen diese **Inhalts-Knoten korrekt unter den 0.80-Boden**
    (Rezeptbuch 0.792 / Mixarium 0.767 → `verified-spore`) — **gewolltes bedeutungs-basiertes
    Protokoll-Verhalten, kein Regress**. Gate-Beweis nutzt jetzt einen Werkzeug/Hub-nahen Knoten
    (BookLedger<->Sage 0.856 ≥ 0.80) + prüft explizit, dass Inhalts-Knoten korrekt darunter liegen.
  - `smoke_bau05y_transparent_slot_pfad`: **kein Assertion-Fehler** — alle 25 Proben liefen durch,
    aber der Prozess beendete sich nie (Modul 05 `init()` öffnet `BroadcastChannel('sbkim')` →
    offener Handle hält Nodes Event-Loop wach; „hängt", obwohl fertig). Sauberer `process.exit(0)`
    auf dem Erfolgspfad, genau wie `smoke_bau05_nostr`. (Commit c4530c0)
- **S2 — Multi-Knoten-Simulation gebaut** (`tests/sim_multinode.mjs`, Brief §2.2): **vier ECHTE
  Knoten-Instanzen gleichzeitig in einem Node-Prozess** (je eigener Modul-Namensraum via
  Sandbox-Loader, eigene IndexedDB-Schublade, eigene Ed25519-Identität, eigene Spore mit echtem
  e5-domainVector) über EINEN geteilten Mock-Relais-Bus — voller Lebenszyklus: **Anmelden (23) →
  Finden (23) → 0.80-Riegel nach Bedeutung (04) → Q&A über Hub → Q&A OHNE Hub** (Endknoten↔Endknoten,
  Meilenstein 2026-07-11 als Regression). **24/24 grün.** Ehrliche Grenzen im Datei-Kopf: Mock-Bus
  statt echtem Relais (Live = Klaus' Browser), deterministischer Embedding-Stub headless (Modell-
  Qualität in Klaus' Browser bewiesen), Phase 3 nutzt ECHTE Sporen-Vektoren. (Commit 0f3358e)
- **A14 abgehakt (Nachlese, kein Neubau):** der ensureStore-Race-Fix (`ensureChain`-Serialisierung
  in Modul 01) **ist schon auf `main`** (mit `smoke_a14_…` 4/4 grün, beide via #648 2026-07-14),
  war in `PLAN_SEMANTIK_KRYPTO.md` nur nie abgehakt. Verifiziert + abgehakt.
- **Demo-Bestandsaufnahme (2.1):** `status.json` führt **13 Endknoten**. Real vs. Demo ehrlich:
  KEINE echten `_demo`-domainVektoren mehr im Code (A6/A10 geschlossen). **11 `verified-match`**
  (Rezeptbuch/Mixarium/Point/Jasons/Mein-Tresor/BLP/Family/Kim-Bell/Kimseek/Kimboard — echter
  ≥0.80-Match), **Private Brain `verified-spore`** (matchScore null, korrekt), **Sage** = self.
  **Befund (an Folge-Sitzung, nicht diese Sitzung geändert):** (a) **Tomys Hub** steht als
  `verified-match` mit `matchScore: null` — aber der dokumentierte Sage-Match ist 0.7977 < 0.80
  (→ müsste `verified-spore` sein, wie Private Brain); (b) mehrere `matchScore`/`nodeId` im Register
  wirken **stale gegenüber den re-signierten Live-Sporen** (Rezeptbuch-Register 0.824 vs. aktuelle
  Inbox-Vektoren 0.792). **Nicht blind korrigiert** — die autoritative Quelle ist jede Live-`spore.json`
  am `sporeUrl` (Netz, hier nicht sicher erreichbar); ein Register-Refresh gehört an Klaus' Browser /
  eine gezielte Sync-Sitzung. Als offener Punkt geführt.
- **Einzige echte Demo-Grenze:** **BookLedgerPro** — committete Spore noch v0.1, Domänen-Vektor ist
  bewusst ein Demo-Stub (Klaus-Entscheid, kein echtes Modell); v0.2-Neu-Signatur wartet auf einen
  kurzen Schlüssel-Lauf im Browser (A10-Operator-Schritt).
- **M1/M3 — Muttis-Rezeptbuch wird eigener SBKIM-Knoten** (Klaus-Entscheid 2026-07-23, Muttis PR #153
  gemergt): 18 Module + noble + sbkim-sw **byte-1:1** aus dem Mein-Rezeptbuch/Sage-Kanon (SHA-identisch),
  Glue (`sbkim-init.js`/`siegel-inhalt.js`) auf **eigenen `dbSuffix "muttisrezeptbuch"`** (≠ `rezeptbuch`
  → keine geteilte-Origin-Kollision), nodeName „Muttis Rezeptbuch", eigene URLs; QC + SBKIM-Script-Block,
  `build.py` grün, `node --check` grün; `status.json` mit `nodeId:null` (Identität = Klaus' Browser-Schritt).
  **M2 ✅ ERLEDIGT 2026-07-23:** Klaus hat die Identität im Browser erzeugt (nodeId **`8TVDCTAc…`**), Spore
  v0.2 übergeben → committet (Muttis PR #154). Reziprok verifiziert (id==SHA256(pub) VALID, Ed25519-Sig
  VALID). **verified-match zu ALLEN Nachbarn:** Sage **0.8766** · Schwester Mein-Rezeptbuch **0.878** ·
  Mixarium 0.845 · SB-KIMTool-Point 0.864 · Tresore 0.839 · BLP 0.823. Muttis als **14. Endknoten** in
  Sage `status.json` + `sage-knoten-korpus.js` eingetragen (verified-match, matchScore 0.8766).
  **✅ Browser-Sichttest GRÜN (Klaus 2026-07-23):** Muttis lädt, 🌐-Panel + Status-Lampen (LEBT/VERKEHR/
  FREMD/SIEGEL) + Gerätename „Klaus Tablet" sichtbar, Identitäts-Erzeugung lief durch.
  **✅ M4 Parität-Check erledigt (Klaus-Entscheid „abschließen"):** Parität bestätigt (Icon/Lesbarkeit/
  Nav/Hardreload), **2 sichere Robustheits-Gewinne nachgezogen** — Fehler-Overlay (Muttis PR #155) +
  persistenter Speicher `navigator.storage.persist()` (PR #156). Bewusst NICHT: navTo (kollidiert mit
  Muttis' eigenem `_scStack`/`OVERLAY_MAP`-Zurück-System), übersetzungs-bewusste Suche (schon da via
  `matchSQ`+`rTr`); Einheiten-Übersetzung + Import-Zuordnung + KI-Kreativ-Suite bleiben dokumentierter,
  bewusst-offener Feature-Rückstand (verschachtelt/kostenpflichtig, kein sicherer ungetesteter Batch).
  **Offen:** Klaus' verschlüsseltes Identitäts-Backup (Stabilität der nodeId); optional Briefkasten/SW-Precache.

<!-- Block: Alt-Format Juli (PULS-Zeilen 3576–5705) -->

## 2026-07-18 · B7 Browser-Sichttest GRÜN (Klaus, Kimboard DeX↔Handy) + Byte-Priv-Fix

**Rolle:** Bausitzung (Sichttest-Begleitung + Fix). **Freibrief gilt.**

Klaus hat B7 im Browser durchgetestet (Kimboard, DeX ↔ Handy, geführt Schritt für Schritt).
**Ergebnis: ✅ GRÜN** — private Nachricht DeX → Handy live verschlüsselt gesendet + korrekt
entschlüsselt (🔒), „blitzschnell" übers echte Relais `relay.family-projekt.de`. Damit ist die
Ende-zu-Ende-Direktnachricht (B7) **live beidseitig bewiesen**, nicht nur headless.

**Echter Bug gefangen (den der Headless-Smoke nicht sah):** beim Senden fror „Frage stellen"
ein, der Zettel erschien auch lokal nicht. Ursache: die App reicht den privaten Nostr-Schlüssel
als **Uint8Array** durch (`const priv = fromHex(privHex)`), `dm_crypto` `sharedX()` rief darauf
`fromHex()` → `.substr` auf Bytes → `TypeError`. Der Smoke lief mit Hex-Text. **Fix:**
`asPrivBytes()`/`asPubHex()`-Normalisierer in `pinnwand/modules/dm_crypto.js` (Priv als Uint8Array
ODER Hex) — byte-1:1 auch in Kimboard. Smoke um 3 Byte-Priv-Proben erweitert → **16/16**;
Pinnwand-Drift 61/61, Kimboard `npm test` 5/5. PRs Sage #679 + Kimboard #32 gemergt.

Nebenbei bestätigt: der `toast()`-Folgefix sitzt („Das bist du selbst."-Hinweis erschien live).
**Klaus-UX-Befund (offen, Folge-Bau):** mehrere Instanzen derselben App (zwei „Kimboard") sind in
der Netz-Karte/im Raum nur an der kryptischen Kennung unterscheidbar → Wunsch: ein **Gerätename**
(„Klaus-Handy"), der in Karte/Raum + auf den Zetteln mitreist. Nächster kleiner Bau.

## 2026-07-17 · B7 gebaut — Pinnwand E2E-Direktnachricht (ECDH + TOFU + Sicherheitsnummer)

**Rolle:** Bausitzung (Semantik/Krypto-Strang B). **Freibrief gilt.**

**Was & warum:** Die Pinnwand hatte bisher nur Passwort-Kanäle (`sbkimenc1:`, geteiltes Brett-Passwort).
Klaus wollte **echte Ende-zu-Ende-Direktnachricht** an *einen* bekannten Empfänger — wie WhatsApp/Signal,
wo man die Gegenseite einmal freigibt. Umgesetzt als **Grad-C-E2E** auf den **schon vorhandenen
Nostr-Schlüsseln** (kein neuer Schlüssel-Typ): **ECDH auf secp256k1** → HKDF-SHA256 → **AES-GCM-256**.

**Klaus-Entscheid (nach MITM-Aufklärung):** server-los kann man den **Erstkontakt-MITM nicht technisch
verhindern** (kein Server, der Schlüssel beglaubigt) → **TOFU** (Trust-On-First-Use, wie SSH/Signal):
**Ein-Klick-Freigabe** eines Kontakts + **Änderungs-Warnung**, falls derselbe Name später mit anderem
Schlüssel auftaucht + **optionale Sicherheitsnummer** (SAS, aus SHA-256 des sortierten Schlüssel-Paars)
zum Vorlesen über einen zweiten Kanal.

**Gebaut (rein additiv, Kern-Module unberührt):**
- **`pinnwand/modules/dm_crypto.js`** (NEU) — Krypto-Kern über die öffentliche Fläche von
  `noble-secp256k1.js`: `dmEncrypt`/`dmDecrypt` (Umschlag `sbkimdm1:iv:ct`, ECDH symmetrisch — Sender
  liest die eigene Nachricht mit Empfänger-Pub), `isDm` (trennt sauber vom Passwort-Weg `sbkimenc1:`),
  `safetyNumber` (symmetrisch, verschieden je Paar → MITM sichtbar), `newIdentity`/`pubFromPriv`.
  Konsequent fail-soft (falscher/fehlender Schlüssel, Manipulation → `null`, nie Throw).
- **`pinnwand/index.html`** — Empfänger-Auswahl (`#dm-to`), 👤-Kontakte-Overlay (Freigabe + Namens-
  Kollisions-Warnung + Sicherheitsnummer), „wer"-Klick zum Anheften, 🔒-Badge an entschlüsselten DMs,
  `buildEvent`-Zweig (verschlüsselt für `dmRecipient`, Tags `p`+`enc:dm1`), Dispatch-Zweig (`isDm` →
  `dmDecrypt` gegen den Gegen-Pubkey). Kontakte in `localStorage` `sbkim_pinnwand_contacts` (nur
  Name+Pubkey, **kein PII, kein Klartext, kein privater Schlüssel**).
- **`pinnwand/sw.js`** — `CACHE_VERSION` v16→v17 + `dm_crypto.js` in die APP_SHELL (Cache-Bust).

**Beweis (headless, echtes WebCrypto):** `tests/smoke_pinnwand_dm.mjs` **13/13 grün** — Round-Trip A↔B,
Sender-Selbstlesung, Fremder C → null, falscher Gegen-Pub → null, Manipulation → null, `isDm`-Trennung,
Sicherheitsnummer symmetrisch + paar-verschieden. Pinnwand-Drift-Smoke **60/60** grün (Kern-Module
byte-1:1 unberührt). **TABU gewahrt:** `PROVIDER_MIN_MATCH`/0.80-Riegel, DB_VERSION, PROTOCOL_VERSION
unberührt (reine Transport-Krypto, kein Spore-Feld). **Browser-Sichttest wartet auf Klaus** (zwei Geräte,
Kontakt gegenseitig freigeben, DM schicken, 🔒 + Sicherheitsnummer prüfen).

_Nächster Punkt der Liste: B4 (Widget-Tresor, sicherheits-sensibel, eigene Sitzung) → B6 (Grad C sealed
box / X25519-encryptionPublicKey in der Spore, Protokoll 0.1→0.2, später)._

## 2026-07-17 · B1b + B2 erledigt (Klaus-Entscheide: Weg A · „so lassen")

**Rolle:** Bausitzung (Semantik/Krypto-Strang B). **Freibrief gilt.**

**B1b — Modul-02 Backup-Asymmetrie (Weg A, Kern-Eingriff):** `exportBackup` erlaubte eine Identität
**ohne** Spore, `importBackup` verlangt sie je Identität → ein Backup, das man anlegen, aber nie
zurückspielen kann. **Klaus-Entscheid: Weg A** — `exportBackup` verlangt die Spore jetzt auch: fehlt sie,
wirft es **vor** der Verschlüsselung `SporeMissingError` (symmetrisch zu `importBackup`), statt ein
unbrauchbares Backup zu erzeugen. **Spec-vor-Code:** INTERFACES §1 Modul 02 (Fehler-Sektion) zuerst
nachgezogen, dann Guard in `exportBackup` (nach dem Bauen der Identitäten-Liste). Byte-Kopie
`sbkim-bundle/modules/02_spore.js` mitgezogen. Smoke `smoke_bau02_b1b_export_spore.mjs` **8/8** (ohne
Spore→SporeMissingError, mit Spore→Round-Trip export/import + falsches PW→BackupDecryptError). Regress-frei
(bau02y 33/33, bau20_safe_real 14/14, spore_v02 17/17). Modul 20 behält seinen `NoSporeError`-Guard
(Safe-spezifische Meldung). **Real verhaltensneutral** (Identitäten haben immer eine Spore) — es ist eine
Ehrlichkeits-/Korrektheits-Härtung. **Folge-Schritt:** netzweiter Byte-Re-Sync von Modul 02 in die Apps
(Kern-Modul; nur additiver Guard).

**B2 — Modul-20-Feinpunkte (Klaus: „so lassen", rein dokumentarisch):** (1) Ed25519 `extractable:true`
bleibt — nötig, damit Backup/Safe/Identitäts-Umzug den privaten Schlüssel sichern können; at-rest immer
passwort-verschlüsselt. (2) Shamir 2-von-3-Default im Modal fest; `init({shamirN,shamirK})` app-weit
konfigurierbar, keine Pro-Nutzer-N/k-UI. Kein Code-Eingriff — festgehalten in der Modul-20-Karte § B2.

_Nächster Punkt der Liste: B7 (Pinnwand-Krypto-Entscheid) → B4 (Widget-Tresor, sicherheits-sensibel) → B6
(Grad C sealed box, später). Offen aus B3: Browser-Sichttest je Knoten + optionale Verschlüsselung des
Haupt-App-KI-Schlüssels; aus B1b: netzweiter Modul-02-Re-Sync._

## 2026-07-17 · B3 ERLEDIGT — Modul-20-Safe netzweit verteilt (9 Knoten + Sage-Page)

**Rolle:** Bausitzung (Semantik/Krypto-Checkliste, Strang B). **Freibrief gilt** (CLAUDE.md § Freibrief).

**Klaus-Entscheid vorweg (statt „BLP zuerst"):** Kanon-Stack-Endknoten zuerst; BLP separat, weil
BLP eine **eigene, reife Krypto** (`src/core/vault.js`/`shamir.js`/`crypto.js`) + nur eine minimale
SBKIM-Fassung (`src/sbkim/*`, kein Modul 01/02) hat — Sages Modul 20 hängt an Modul 01/02, wäre in
BLP byte-1:1 unmöglich und redundant. **Umfang:** Safe + verschlüsselte BYOK-KI-Schlüssel-Ablage.

**Befund beim Verteilen (ehrlich):** die verschlüsselte KI-Richter-Schlüssel-Ablage (🔒 im Tresor
merken / 🔓 entsperren, Modul 23 UI) lag in den Endknoten über `23_rendezvous_ui.js` **byte-1:1 zum
Kanon schon** vor; `window.SbkimSafe` entsteht beim Laden (Geheimnis-Pfad braucht kein `createVault`).
Der **einzige** Defekt war das **je eine Version alte Modul 20** (fehlende B1-`NoSporeError`-Härtung
im Identitäts-Vault-Pfad). „Verteilung" = Modul 20 auf Kanon heilen + `SbkimSafe.init()` in die
Init-Kette + SW-Cache-Bump + echter Headless-Smoke (WebCrypto: putSecret/getSecret Round-trip,
falsches PW → null, kein Klartext im Blob, frisches Salt/IV, Heal-Beweis).

**Getan (je eigener PR, selbst gemergt nach Headless grün — Freibrief):**
**Geheilt (stale Modul 20 → Kanon), je Smoke 11/11:**
- **Rezeptbuch #332** (`sbkim/20`→Kanon, `SbkimSafe.init()` in `sbkim-init.js`, `app-sw.js` mrz-v52→v53;
  QC unangetastet → kein `build.py`) · **Mixarium #145** (`app-sw.js` mixarium-sw-v71→v72; md5 index==QC identisch)
  · **family-project #88** (sw family-projekt-v50→v51; init lag schon vor; smoke_all 94/100 = pre-existing) ·
  **Tomys-Hub #113** (sw tomy-hub-v24→v25) · **Kimboard #30** (`modules/20`, sw kimboard-v22→v23) ·
  **Kimseek #34** (sw kimseek-v26→v27) · **SB-KIMTool-Point #129** (`web/tools/sbkim-safe.js`; kein SW-Bump —
  Hub ohne SW; npm test 114/2 = 2 pre-existing).

**Ergänzt (Modul 20 fehlte GANZ — additiv + fail-soft, Spiegel + eigener Daten-Tresor unberührt):**
- **Mein-Tresor #65** (`sbkim/20` neu + Script-Tag; npm test 53/53) · **Jasons-Tresor #123** (dito; npm test 59/59).

**Sage-Page selbst:** lädt den Kanon-Modul 20 (`src/modules/20…`, immer aktuell) + KI-Richter-UI schon →
**keine Änderung nötig** (init an der Hub-Seite wäre Hub-Risiko, für den Geheimnis-Pfad nicht nötig).

**Grenzen/bewusst NICHT:** Kern 01/02 nur genutzt; `PROVIDER_MIN_MATCH`/0.80-Riegel + `DB_VERSION` +
`PROTOCOL_VERSION` unberührt; kein PII, kein Klartext-Schlüssel. Der **Haupt-App-KI-Schlüssel**
(Rezeptbuch `claudeKey9m`, Mixarium `mxkey9m`) liegt weiter im **Klartext-`localStorage`**
(persistiert schon über Hard-Reload) — dessen optionale Verschlüsselung ist ein **separater, größerer
Härtungs-Schritt** (App liest ihn an vielen Stellen; bräuchte Passwort pro Sitzung), Klaus-Entscheid offen.

**Kern-Befund (ehrlich):** die verschlüsselte KI-Richter-Schlüssel-Ablage (🔒/🔓) lag über das
byte-Kanon-`23_rendezvous_ui.js` in fast allen Knoten **schon** verdrahtet; das Safe-Modul (20) war nur
je eine Version alt (fehlende B1-`NoSporeError`-Härtung) ODER fehlte bei den Tresoren ganz. B3 = auf
Kanon bringen/ergänzen, nicht neu bauen.

**Offen (Folgepunkte, kein Blocker):**
- **Browser-Sichttest** (Live-🔒/🔓 mit echtem KI-Schlüssel) je Knoten wartet auf Klaus.
- **BLP separat** (app-eigener Tresor `core/vault.js`/`shamir.js` — kein Modul-20-Ziel).
- **Haupt-App-KI-Schlüssel** (Rezeptbuch `claudeKey9m`, Mixarium `mxkey9m`) liegt weiter im
  Klartext-`localStorage` (persistiert schon) — optionale Verschlüsselung = eigener, größerer
  Härtungs-Schritt (App liest ihn an vielen Stellen; bräuchte Passwort pro Sitzung), Klaus-Entscheid offen.

## 2026-07-17 · B1-Sichttest fing echten Safe-Bug — reproduziert + behoben (Modul 20 + echter Smoke)

**Rolle:** Sichttest-Begleitung + Bug-Fix (Freibrief). **Genau der Wert des Browser-Sichttests:** Klaus' B1-Lauf
an Panel 20 fand einen Bug, den der Mock-Smoke (19/19) NICHT sah.

**Bug:** `SbkimSafe.createVault` gelang, aber `unlock` mit **korrektem** Passwort gab `false` (Knopf 4 rot;
Shamir/Recovery/falsch-Passwort korrekt grün). **Ursache (reproduziert mit fake-indexeddb + realen Modulen):**
`SbkimSpore.exportBackup` sichert eine Identität **ohne Spore**, aber `importBackup` **verlangt** je Identität eine
Spore (`BackupSchemaError: identities[0].spore fehlt`) — ein Safe, der sich anlegen, aber nie entsperren lässt. Die
Panel-20-Test-Brücke erzeugte nie eine Spore; echte Apps tun es (Andock-Wizard) → im Feld unauffällig, aber ein
**Fremdnutzer-Footgun**.

**Warum der Mock-Smoke blind war:** `smoke_bau20_safe.mjs` **mockt** `exportBackup`/`importBackup` + Storage → die
reale Krypto+Storage-Runde lief nie.

**Fix (diese Sitzung):**
1. **Modul 20 `createVault`**: wirft bei fehlender Spore einen klaren **`NoSporeError`** (Fremdnutzer-Schutz statt
   stillem unlock-Fehlschlag). Fail-soft: greift nur, wenn Modul 02 `getOwnSpore` anbietet (reine `putSecret`-Nutzung
   unberührt — Smoke 18/18). Kern-Module 01/02 **nicht** angefasst.
2. **Test-Brücke** Panel 20 „Setup" erzeugt eine Spore wie eine echte App (idempotent).
3. **Neuer echter Smoke** `tests/smoke_bau20_safe_real.mjs` **14/14** — fake-indexeddb + reale Module 01/02/20,
   deckt beide Pfade (ohne Spore → NoSporeError; mit Spore → createVault→lock→unlock(korrekt)=true / (falsch)=false /
   recover). Aufruf: `npm install --no-save fake-indexeddb && node tests/smoke_bau20_safe_real.mjs`.

**Kern-Asymmetrie als B1b (Klaus-Entscheid) notiert:** die saubere Lösung (export verlangt Spore ODER import
toleriert sie fehlend) liegt in **Modul 02 (Kern, TABU „nur nutzen")** — Richtungsentscheid vor einem Kern-Eingriff.

**Beweis:** neuer Smoke 14/14 · Mock-Smoke 19/19 (Guard übersprungen, da Mock kein `getOwnSpore`) · putSecret 18/18 ·
`node --check` grün. **✅ Klaus-Re-Sichttest Panel 20 GRÜN (2026-07-17):** Reset → Safe anlegen (3 Anteile,
`entsperrt:true`) → „Entsperren (richtiges Passwort)" = **entsperrt** (Statusfeld grün). **B1 damit erledigt.**
Nächster Schritt: **B3** (Modul-20-Safe netzweit verteilen, BookLedgerPro zuerst).

## 2026-07-17 · A3 abgeschlossen — netzweiter Rollout der Identitäts-Härtung verifiziert (kein Bau nötig)

**Rolle:** Verifikation + Doku-Abschluss (Freibrief; Klaus: „baue A3, dann sind wir fertig").

**Befund (gegen `origin/main` geprüft, nicht behauptet):** A3 war im PLAN noch `[~]` (Rollout „offen"),
ist aber faktisch **schon netzweit ausgerollt**. Der volle Fix — Modul 01 `migrateIdentityFrom` + Modul 23
ruft ihn in `repairAndReconnect`/`ensureIdentity` (mit `hasMigrate`-Fähigkeitsprüfung) — liegt deployt auf
`main` bei **allen 13 modularen Knoten**: Mein-Mixarium · Mein-Rezeptbuch · Tomys-Hub · family-project ·
Kim-Bell (`modules/sbkim-*.js`) · Kimboard · Kimseek · SB-KIMTool-Point (`web/tools/sbkim-*.js`) ·
Mein-Tresor · Jasons-Tresor · Company-Brain · Privat-Brain (+ Sage-Kanon).
- **BookLedgerPro** trägt eine **eigene, selbst-isolierte** SBKIM-Fassung (`src/sbkim/*`, `DB_SUFFIX='bookledgerpro'`),
  nutzt den geteilten `sbkim`-Topf NIE → Migration N/A (kein Loch).
- **odysseus** ist kein SBKIM-Knoten (eigenes `static/js/storage.js`).

**Ziel im Feld bestätigt:** Klaus' Mycel-Analyse 2026-07-16 (Nacht) zeigt pro Knoten eine **eigene, stabile,
verschiedene nodeId** (Sage `nysOZE3V…` · Jasons `fnzoLJMX…` · Mein-Tresor `wS7oxsky…` · Tomys/Kim-Bell live) —
genau das A3-Ziel „jede App EINE eigene stabile ID". Ein dedizierter A3-Browser-Sichttest ist damit praktisch
erbracht; formal optional.

**Ergebnis:** A3 als **erledigt (2026-07-17)** markiert (PLAN + Checkliste + Reihenfolge). **Kein Code gebaut** —
ehrlich: es gab nichts zu bauen, der Rollout war schon vollständig. Semantik-Strang A ist damit im Kern fertig;
offen bleibt nur die A10-Welle (Klaus' Schlüssel). Nächster Schritt: **B1** (Safe-Sichttest, Klaus) → **B3**.

## 2026-07-17 · A19 — UX-Fix Such-Widget: „✓ kopiert"-Rückmeldung + App-Suche-ohne-Netz geprüft

**Rolle:** Bau (Freibrief, Klaus wählte A19). Modul 22 (Such-Widget) + Byte-Kopie such-tool.

**Befund 1 — „Block kopieren" ohne sichtbare Rückmeldung → gebaut:** der Knopf setzte zwar schon einen Hint,
der wurde aber übersehen (Klaus: „ein Link ohne sichtbares Ergebnis"). Jetzt zeigt der Knopf beim Klick kurz
**„✓ kopiert!"** (grün, ~1,6 s) direkt an der Klickstelle; dieselbe Rückmeldung am „📋 Frage kopieren"-Knopf.
Fail-soft (`global.setTimeout`-guard), keine neue CSS-Klasse (inline).

**Befund 2 — „Treffer erst nach Netz-Anmeldung" → geprüft, KEIN Bug:** die **App-Suche ist rein lokal**
(`window.SAGE_SUCHKORPUS`, lazy via Modul 03) und läuft ohne Verbindung; sie zeigt beim ersten Gebrauch schon
den Hinweis „Suchindex wird vorbereitet …" (`ensureCorpusPrepared`). Nur der **Knoten-Bereich holt LIVE-Treffer**
übers Relais (`queryNode`, Modul 05) — verbindungs-pflichtig by design (Empfangsmodus). Klaus' Beobachtung
bezog sich auf diese (korrekt) verbindungs-pflichtigen Live-Knoten-Treffer.

**Beweis:** `smoke_bau22_such_widget.mjs` **260/260**, Standalone-Drift-Guard **49/49**, byte-identisch (md5 gleich),
`node --check` grün. **Browser-Sichttest der Kopier-Rückmeldung wartet auf Klaus.**

## 2026-07-17 · Klaus-Sichttest A7–A9 grün + Test-Seiten-Fix (Panel-Knöpfe) + zwei UX-Befunde

**Rolle:** Sichttest-Begleitung + kleiner Fix (Freibrief).

**A7–A9 (Klaus, Live am Tablet, Sage-Suchfeld):**
- **A7 ✅ grün** — „wie schütze ich mich vor fremden Zugriffen" → nach Bedeutung sortierte Treffer mit
  Prozent, Schutz-Module oben (Membran 88 % · Rate-Limit 84 % · Schlüssel-Safe 84 %) + echte **KNOTEN**-
  Treffer (Mein-Tresor 82 % · Jasons-Tresor 81 % · BookLedgerPro 81 % · Kimboard/Kim-Bell/Kimseek). App-
  Hybrid+Multi-Query läuft sichtbar.
- **A8 + A9 abgehakt (Klaus' Zuruf)** — Umschalter „🧬 verwandt (genau)" + KI-Richter-Feld sind live vorhanden;
  ehrlich vermerkt: der Umschalt-/KI-Effekt wurde im Bild nicht eigens umgelegt (Logik headless bewiesen,
  `smoke_bau22e` 45/45). In PLAN + `checkliste_semantik_krypto.html` abgehakt (2026-07-17).

**Test-Seiten-Fix (`tests/manual_check.html`, PR #665 gemergt):** Befund aus Klaus' Sichttest — Panel 24 + 25
zeigten **keine Knöpfe**. Ursache: beide registrieren ihre Knöpfe via `SbkimUI.addButton` **bevor** `window.SbkimUI`
definiert war → ReferenceError. `SbkimUI`-Helfer vor Panel 24 verschoben (einmalig). Latenter Panel-24-Bug
(nie browser-getestet) mitbehoben. Nach Cache-Bust (06:53) erscheinen die Knöpfe bei Panel 24 **und** 25 —
Fix browser-bestätigt. **✅ B5-Browser-Sichttest Panel 25 GRÜN (Klaus 2026-07-17):** Round-trip live korrekt
(„Max Mustermann" → `[[KUNDE_1]]`, EMAIL/IBAN als Token, **Betrag 100 EUR bleibt**, `rehydrate == Original`,
Anker-Tresor sauber getrennt). B5 ist damit headless **und** im Browser bewiesen.

**Zwei UX-Befunde (Fremdnutzer-Brille, als A19 im PLAN notiert):**
1. **„🖨 Block kopieren" ohne sichtbare Rückmeldung** (Klaus: „ein Link ohne sichtbares Ergebnis") → kurze
   Bestätigung „✓ kopiert" einbauen.
2. **Treffer erst nach Netz-Anmeldung sichtbar** (Klaus: „erst nachdem ich alle im Netz angemeldet habe, konnte
   ich was sehen") → prüfen, ob **App-Treffer** (lokaler Korpus) auch ohne Verbindung erscheinen. Beides berührt
   Modul 22 + byte-Kopien (Drift-Guard) → eigener abgegrenzter Bau (A19).

**Nächster Schritt:** A19-Fix (kleiner Modul-22-Bau) oder B-Strang (B3 Modul-20-Verteilung) — Klaus' Wahl.

## 2026-07-16 · B5 — E2E Grad B Pseudonymisierung gebaut (Modul 25 `SbkimPseudonym`)

**Rolle:** Bau-Sitzung (Freibrief; Klaus wählte per AskUserQuestion „B5 zuerst", Sage-Page-Wizard-Umstellung A18-Rest bewusst später/inline).

**Was getan:** B5 aus `docs/PLAN_SEMANTIK_KRYPTO.md` gebaut — der „empfohlene Sofortweg"
für Vertraulichkeit (`docs/E2E-VERTRAULICHKEIT.md §1.1`) als neues **Modul 25
`SbkimPseudonym`** (`src/modules/25_pseudonym.js`).
- **Reiner Text-/Objekt-Transform, BUILD-FREI:** keine Krypto-Primitive, **KEIN
  Spore-Feld, `protocolVersion` bleibt 0.1**, **kein Draht-Vertrag** → INTERFACES
  unberührt (die Spec §1.1 ist die Vorgabe). Briefkasten bleibt lesbar/auditierbar,
  Ed25519-Signatur prüfbar.
- `pseudonymize(text, options)` / `pseudonymizeObject(obj, options)` ersetzen sensible
  Werte durch **lesbare, stabile Token** (`[[KUNDE_1]]`, `[[IBAN_1]]`, `[[EMAIL_1]]`):
  explizite Werte (Namen) + eingebaut EMAIL/IBAN (TEL opt-in) + `customPatterns`;
  gleicher Wert → gleiches Token (stabil über `options.map`), bestehende Token nie
  verschachtelt. `rehydrate`/`rehydrateObject` kehren um; `serializeVault`/`parseVault`
  für den **separaten/menschlichen Anker-Tresor-Handover** (verlässt den öffentlichen
  Kanal NIE). Anker-Tresor at-rest optional über Modul 20 `putSecret` (entkoppelt).
- Konsequent **fail-soft** (kein Throw außer `InvalidPseudonymArgError`). **Kein PII im Code.**
- Karte `docs/components/25_pseudonym.md`, Panel 25 in `tests/manual_check.html`,
  E2E-Spec §1.1 mit Umsetzungs-Notiz, status.json + Pie (26→27 Module, Code-Stub 9→10) +
  CLAUDE.md-Modultabelle nachgezogen.

**Beweis:** Headless-Smoke `tests/smoke_bau25_pseudonym.mjs` **36/36 grün**
(Round-trip Namen/EMAIL/IBAN, stabile/aufsteigende Token, Objekt-Transform mit Zahl-Erhalt,
Vault-Round-trip, fail-soft, Invarianten `protocolVersion 0.1`). `node --check` grün.

**Ehrliche Grenze:** Pseudonymisierung ≠ Verschlüsselung — Metadaten/Beträge leaken
weiter → echte Zielform bleibt **Grad C = B6** (versiegelter Umschlag, Protokoll-Sprung).

**Manual-Check:** Panel 25 in `tests/manual_check.html` **ungeprüft, wartet auf Klaus'
Browser-Lauf** (headless ist grün; die Modul-Logik ist bewiesen, die Panel-Optik nicht).

**Nächster sinnvoller Schritt:** siehe „Vorgeschlagene nächste Schritte" im Chat —
schnelle Tablet-Haken (A7–A9, B1), die A10-v0.2-Welle (Klaus' Schlüssel), oder A3-Rollout.
B3 (Modul-20-Verteilung, BLP zuerst) wäre der natürliche B-Strang-Anschluss.

## 2026-07-16 · A18 Siegel-Wizard — per-Slot-nodeId zurückportiert + family-project + NETZWEIT ABGESCHLOSSEN

**Rolle:** Bau/Rollout (Freibrief). **Klaus-Sichttest der 4 Kanon-Endknoten GRÜN** (Wizard vor Siegel, ✍, 🛡).
**Erledigt (je eigener PR, selbst-gemergt):**
- **per-Slot-nodeId in den Kanon** (Point-Muster): `refreshWizardIdentities` löst je Slot die nodeId read-only via
  idempotentem `getOrCreateIdentity` auf (`Fach · nodeId`, volle nodeId im Hover). Kanon PR #660 → byte-1:1 in
  Kim-Bell #26 · Mixarium #144 · Tomys #112 · Rezeptbuch #331.
- **family-project** (PR #87): Kanon-Wizard **additiv** ergänzt (hatte keinen; Rendezvous-Panel + `__fpErzeugeSpore`
  unangetastet), `sicherheit.html` + SW-Bump.
**Netzweiter Befund (Siegel-Wizard, 2026-07-16) — ABGESCHLOSSEN:** Geteilter Kanon = Sage · Kim-Bell · Mixarium ·
Rezeptbuch · Tomys · family-project. Eigene, spec-konforme (fertige) Umsetzungen, **bewusst NICHT angefasst:**
SB-KIMTool-Point (voraus) · Kimboard/Kimseek (eigene 352-Z.-Fassung) · **Mein-Tresor + Jasons-Tresor** (Siegel-Dialog
im index + voller Wizard auf `werkzeuge/andock.html`, `npm test` 53/53 — Kanon wäre nur Dopplung). BLP bewusst gelassen.
**Einzig offen:** Sage-Page selbst auf `siegel-inhalt.js` umstellen (Hub-Risiko, Klaus' Sage-Browser-Test). Details:
`docs/PLAN_SEMANTIK_KRYPTO.md` A18.

## 2026-07-16 · A18 Siegel-Wizard-Rollout — Tomys-Hub + Mein-Rezeptbuch auf den Kanon

**Rolle:** Bau/Rollout (Freibrief). Fortsetzung der A18-Welle (Kanon `assets/siegel-inhalt.js`).
**Erledigt (je eigener PR, selbst-gemergt nach headless grün + Drift-Guard):**
- **Tomys-Hub** (PR #111): alte Selbst-Injektion aus `sbkim/sbkim-init.js` entfernt, `sbkim/siegel-inhalt.js`
  byte-1:1 (nur `WIZ`), `__tomyErzeugeSpore` erhalten (Modul 23), `sicherheit.html` ergänzt (aus Kim-Bell re-geskinnt),
  SW `tomy-hub-v22→v23`.
- **Mein-Rezeptbuch** (PR #330): alte `SIEGEL-NEUGESTALTUNG`-IIFE entfernt, Kanon-Datei byte-1:1, `__sbkimErzeugeSpore`
  **inkl. Inhalts-Vektor-Logik** erhalten, QC-Quelle + `build.py` (index.html neu), SW `mrz-v50→v51`.

Damit stehen **alle 4 klassischen Endknoten** (Kim-Bell · Mixarium · Tomys · Rezeptbuch) auf dem einheitlichen Wizard.
**Bewusst NICHT autonom angeglichen (Freibrief-Grenze — architektonisch tiefgreifend, erst Klaus):** **BLP**
(10 000+-Zeilen inline-`mycelknoten.html`, kein geteiltes Siegel-Modal), **SB-KIMTool-Point** (schon voraus:
per-Slot-nodeId-Wechsler, Rückportierung Point→Kanon statt Downgrade), **family-project** (Rendezvous-Ursprung, eigenes
Muster). Details + Entscheid siehe `docs/PLAN_SEMANTIK_KRYPTO.md` A18. **Alle Sichttests: ungeprüft, wartet auf Klaus.**

## 2026-07-14 · A10-Nachzug: SB-KIMTool-Point als 2. v0.2-Knoten fertig (Doku-Sync von der Toolpoint-Sitzung)

**Rolle:** Cross-Repo-Status-Sync (aus der SB-KIMTool-Point-Sitzung heraus). Nur `docs/PLAN_SEMANTIK_KRYPTO.md`
+ `docs/checkliste_semantik_krypto.html` (A10 „Offen bleibt"-Zeile + Footer + Stand-Datum). **Kein Code.**

- **SB-KIMTool-Point (2. Hub) ist der ZWEITE v0.2-Knoten im Netz** (nach Sage). Kanon-Identität `CyunQNDR…`
  per neuem Browser-Knopf **„Kanon-Schlüssel importieren"** (node_key.enc.json → Modul-02-`importBackup`,
  kein Netz-Churn) zurückgeholt + verbunden (Mycel-Karte bestätigt); Spore v0.2 mit voller Beschreibung, 3
  Satz-Schnipsel, `node --test` 120/120.
- **Herkunfts-Prüfung (Klaus' Frage „war Sage die Vorlage?"):** JA für den A10-Kern — Toolpoints
  `web/tools/sbkim-spore.js` (02) und `sbkim-embedding.js` (03) sind **byte-1:1 mit Sages** `src/modules/02+03`
  (`diff -q` identisch); der ✍-„Spore neu signieren"-Knopf folgt Sages `sageReSignWithDescription`. **Toolpoint-
  ORIGINAL** ist nur der **„Kanon-Schlüssel importieren"-Knopf** (node_key.enc.json → Browser-Backup → importBackup) —
  den hat Sage NICHT (Sage rettete seine Identität über eine Backup-Datei/Schritt 4). Kandidat, um bei Bedarf als
  Vorlage zu Knoten mit gleicher node_key-Lage zurückzufließen.
- **Ehrliche Match-Neueinstufung bei Toolpoint:** reiche Beschreibung → Infrastruktur-Nähe (Sage 0.862 / Tresore
  0.862 / family 0.849 ↑), Inhalts-Knoten trennen sich (Rezeptbuch 0.796 · Mixarium 0.767 < 0.80 → verified-spore).
  Toolpoints SIGNAL seq 34 bittet Rezeptbuch/Mixarium um reziproke Neu-Einstufung.
- **Offen:** Endknoten-Rollout v0.2 (Mixarium/Rezeptbuch/BLP) + reziproke Neu-Einstufung — je Folge-Sitzung/Repo.

## 2026-07-14 · Welle Spore v0.2 — Sages Live-Spore neu signiert (ERSTE v0.2-Spore im Netz) + Identität aus Backup gerettet

**Rolle:** Operator-Begleitung (Klaus am Browser) + Verifikation/Commit (Freibrief). **Ereignis:**
Klaus hat Sages Spore über den Siegel-Knopf „✍ Semantik → Spore neu signieren" live auf **v0.2**
gehoben. Diese Sitzung hat die Datei verifiziert und committet.

**Verlauf (bemerkenswert — ehrlicher Netz-/Hub-Test):**
- Klaus hatte zuvor **alle Browser-Daten gelöscht** und dabei befürchtet, Sages Identität sei weg.
- Beim Backup-Zurückspielen (🔑-Wizard Schritt 4) meldete der Browser „Identität mit diesem Schlüssel
  existiert bereits" → **die Identität hatte überlebt bzw. wurde aus dem verschlüsselten Backup vom
  2026-05-21 sauber wiederhergestellt**. Der Backup-Weg (AES-GCM-256/PBKDF2) ist damit **live bewiesen**.
- Danach v0.2-Neu-Signatur: **nodeId `nysOZE3V…` unverändert**, 11 Satz-Schnipsel, domainVector L2=1.

**Verifikation dieser Sitzung (Beweis):** hochgeladene `spore.json` reziprok geprüft — protocolVersion
**0.2** ✓, id == base64url(SHA256(rawPub)) ✓, id == committet ✓, publicKey identisch ✓, **Ed25519-Signatur
gültig** ✓, domainVector L2=1.000000 ✓, **11/11 snippetVectors je 384-dim** ✓, kein PII. Committet nach
`sbkim/spore.json`; `status.json` (top `protocolVersion` 0.1→0.2, Sage-Eintrag `reSignedAt`+Note),
`NETZ-STAND.md` (Sages Live-Spore jetzt v0.2 = erste im Netz) + SIGNAL seq 45→46 nachgezogen.

**Peer-Quer-Check (2026-07-14):** committete vs. live veröffentlichte nodeIds — **8/10 stimmen** live
überein (Rezeptbuch, Mixarium, Jasons-Tresor, Mein-Tresor, SB-KIMTool-Point, Family, Kimseek, Kimboard);
BookLedgerPro + Kim-Bell von hier nicht abrufbar (kein Beweis für Abweichung). Netz konsistent.

**Was BLEIBT:** übrige Live-Sporen noch 0.1 (kompatibel) → optionaler Neu-Signatur-Knopf pro Endknoten
(Folge-Sitzung/Repo); Verwandt-Anzeige aus Schnipseln (Consumer 04/22/23), sobald ≥ 2 Knoten v0.2 tragen
— jetzt trägt **einer** (Sage); Tablet-Sichttests A7·A8·A9·B1.

## 2026-07-14 · Welle Spore v0.2 (Rollout-Teil) — Werkzeug verifiziert + App-Knopf emittiert jetzt Schnipsel

**Rolle:** Rollout/Test (Freibrief). **Auftrag:** Brief `BRIEF Welle Spore v0.2` (Operator + Rollout +
Sichttests A7·A8·A9·B1). **Leitplanken gewahrt:** kein privater Schlüssel im Repo, kein PII, 0.80-Riegel
unberührt, headless = Beweis.

**Was getan:**
- **Re-Sign-Werkzeug end-to-end verifiziert:** `tests/smoke_resign_spore_v02.mjs` **10/10 grün**
  (nach `npm install --no-save fake-indexeddb`, wie der Test-Kopf verlangt). Beweist: JWK-Schlüssel +
  Schnipsel → gültige v0.2-Spore (protocolVersion 0.2, echter domainVector 384 erhalten, snippetVectors
  angehängt, id/Identität stabil, echter Modul-02-Verifizierer ✔ VALID) **und** reziproke Sicherheit
  (falscher Schlüssel → Abbruch exit 3, ohne Schlüssel → Abbruch exit 2). Klaus' Operator-Schritt ist
  damit ein sauberer Ein-Klick/Ein-Befehl — de-riskt.
- **App-Knopf „✍ Semantik → Spore neu signieren" (Sage-Page `index.html`) auf v0.2 vervollständigt:**
  `sageReSignWithDescription` bettet die Beschreibung jetzt zusätzlich **satz-weise** ein
  (`SbkimEmbedding.embedSnippets`) und reicht `snippetVectors` an `generateOwnSpore` → der im Browser
  erzeugte Download ist eine **vollständige v0.2-Spore mit Schnipseln** in EINER Aktion (besser als der
  Zwei-Schritt-Operator-Pfad embed_helper + Node-Skript). **Fail-soft:** schlägt das Schnipsel-Einbetten
  fehl, wird ohne Schnipsel weiter signiert (v0.2 bleibt). Erfolgs-Meldung nennt jetzt Protokoll-Version
  + Schnipsel-Zahl. **REINE Anzeige/Verwandt-Messung — gatet nichts, 0.80-Riegel unberührt,
  Kern-Module 02/03 nur über ihre öffentliche Fläche genutzt.**
- **Smokes grün (Beweis):** `smoke_bau03_snippets` 32/32, `smoke_bau02_spore_v02` 17/17,
  `smoke_resign_spore_v02` 10/10.

**Was BLEIBT (blockiert — nicht headless machbar):**
- **Sages Live-`spore.json` auf v0.2 neu signieren** braucht den **privaten Schlüssel** (nur bei Klaus:
  App-Knopf im Browser mit lebender Identität ODER `SBKIM_NODE_KEY` + `tools/resign_spore_v02.mjs`).
  Der committete Stand bleibt bis dahin **0.1 — handshake-kompatibel**, nichts ist kaputt.
- **Endknoten-Rollout des App-Knopfs** (je eigene Folge-Sitzung/Repo, wie Modul-23-Rollout).
- **Peer-Quittungen** (kommen, wenn Knoten neu signieren) → `ack` + NETZ-STAND/status nachziehen.
- **Sichttests A7·A8·A9·B1** — nur Klaus' Tablet, ungeprüft.

**Nächster sinnvoller Schritt:** Klaus signiert Sages Spore neu (App-Knopf **oder** Skript), committet die
**öffentliche** `spore.json`; danach kann die Verwandt-Anzeige aus Schnipseln (Consumer 04/22/23) als
eigener Folge-Bau gemessen werden, sobald ≥ 2 Knoten v0.2-Sporen tragen.

## 2026-07-14 · Bau-Sitzung Spore v0.2 — `embedSnippets` (A10) + Code-`PROTOCOL_VERSION` 0.2 (A6) + Re-Sign-Werkzeug

**Rolle:** Bau (Code nach fertiger Spec, Freibrief). **Auftrag:** Brief `BRIEF_BAU_SPORE_V02.md`
(Bau-Teil der Spec-Sitzung 2026-07-14). **Leitplanken gewahrt:** 0.80-Andock-Riegel unberührt
(Modul 05 nicht angefasst), kein PII, kein privater Schlüssel im Repo, Headless = Beweis.

**Was gebaut (Code):**
- **Modul 03** `src/modules/03_embedding.js` — neuer Helfer `embedSnippets(text|string[], opts?)`:
  Satz-Zerlegung (an `.!?…` + Zeilenumbrüchen, fail-soft), je Satz `embedPassage` → L2-Vektor,
  bis `SPORE_SNIPPET_MAX`=20 in Satz-Reihenfolge, `text` = gekürzter Quell-Satz (≤160, kein PII);
  leer → `[]`, reine Berechnung (kein Spore-Schreibvorgang). Test-Brücken `_splitIntoSentences` +
  `_prepareSnippetTexts`, `_meta.sporeSnippetMax/Granularity`.
- **Modul 02** `src/modules/02_spore.js` — `PROTOCOL_VERSION "0.1" → "0.2"` (A6-Code-Schließung);
  `generateOwnSpore` nimmt optional `snippetVectors` additiv in den kanonischen Sign-/Verify-Pfad
  (`sanitizeSnippetVectors`: harte Kürzung auf 20, `vec`-Länge≠384 → `InvalidSporeMetaError`, leer →
  Feld weg = 0.1-kompatibel). `regenerateOwnSpore` trägt Schnipsel beim Neu-Signieren mit.
  `verifyForeignSpore` bleibt major-tolerant (0.1 ↔ 0.2 gegenseitig gültig, sanfter Übergang).
- **A6-Schließung:** kein `_demo`-domainVector-Pfad (Grep-belegt); Live-Knoten tragen schon echte
  e5-Vektoren (verified-match). Der Code-Stempel wandert bei der Neu-Signatur in jede spore.json.

**Byte-Kopien / Drift-Guards** nachgezogen: `sbkim-bundle/modules/02+03`, `such-tool/modules/03`,
`pinnwand/modules/03` — alle byte-1:1, Guards grün.

**Neu-Signier-Werkzeug (beides, Klaus-Entscheid):**
- `tools/resign_spore_v02.mjs` — Termux/Node, Schlüssel aus `SBKIM_NODE_KEY` (JWK oder 32-Byte-Seed);
  übernimmt den echten domainVector, bumpt → 0.2, hängt browser-gerechnete `snippetVectors` an,
  signiert kanonisch, **self-verify mit dem echten Modul-02-Verifizierer** (✔ VALID). Bricht bei
  fremdem Schlüssel/ohne Schlüssel ab. Nur öffentliche spore.json wird geschrieben.
- `tools/embed_helper.html` — Browser-Hälfte: Abschnitt „A10 — snippetVectors" zerlegt den
  Domänen-Text satz-weise und rechnet die echten e5-Vektoren → `snippets.json` für `--snippets`.

**Headless-Beweis (grün):** `smoke_bau03_snippets.mjs` 32/32 · `smoke_bau02_spore_v02.mjs` 17/17 ·
`smoke_resign_spore_v02.mjs` 10/10. Regress-frei: `smoke_bau02y` 33/33, `smoke_a3_contextual_chunking`
20/20, `smoke_bau03_worker` 15/15, `smoke_bundle_connect` 21/21 (Drift-Guards), `smoke_standalone_such_tool`
49/49, `pinnwand/_smoke` 60/60, `smoke_bau15b_membran` 35/35, `smoke_bau19_andock_wizard` 15/15,
`smoke_bau23_rendezvous` 58/58 u.a.

**Offen / nächster Schritt:** Die **eigentliche Neu-Signatur der LIVE-Sporen** braucht den privaten
Schlüssel jedes Knotens (nur bei Klaus) — Knopf pro App bzw. `resign_spore_v02.mjs` mit `SBKIM_NODE_KEY`.
Das ist Klaus' Operator-Schritt (wie der Browser-Sichttest). Bis dahin bleiben die Live-Sporen auf 0.1
(handshake-kompatibel, sanfter Übergang). **Browser-Sichttest der Schnipsel-Anzeige wartet auf Klaus.**

---

## 2026-07-14 · Spec-Sitzung Spore v0.2 — echte Vektoren (A6) + Schnipsel-Vektoren (A10), Protokoll 0.1→0.2

**Rolle:** Spec (Spec-vor-Code, Freibrief). **Auftrag:** Brief `BRIEF Spore v0.2` (2026-07-12,
Klaus-Entscheid: A6 + A10 in EINEN Protokoll-Sprung + EINE Neu-Signier-Welle). **NUR Tafel, KEIN
Modul-Code** — der Bau folgt in der Bau-Sitzung.

**Klaus-Entscheide (AskUserQuestion 2026-07-14):** (1) Schnipsel = **Satz, max 20**; (2) Übergang
0.1→0.2 **sanft** (alte 0.1-Sporen kurz weiter tolerieren); (3) Neu-Signatur = **beides** (Knopf pro
App + Termux/Node-Skript).

**Was getan (nur `docs/INTERFACES.md` + Plan/Checkliste):**
- **§0:** `PROTOCOL_VERSION "0.1" → "0.2"`; neue Konstanten `SPORE_SNIPPET_MAX=20` +
  `SPORE_SNIPPET_GRANULARITY="sentence"`.
- **§2 Spore-JSON:** neues **optionales** Feld `snippetVectors : object[]` (`{vec:number[384], text?}`,
  bis 20, signaturpflichtig wenn vorhanden, fail-soft); § „Spore v0.2" (A6-Schließung + sanfter Übergang
  + Welle-Form); `protocolVersion`-Wert in allen vier Schema-Blöcken auf `"0.2"`.
- **§4 Versionierungs-Regeln:** Klarstellung, dass 0.1↔0.2 wechselseitig kompatibel bleiben (gleiche
  Hauptversion „0", nur optionales Feld) → sanfter Übergang ist automatisch.
- **Modul 02:** `generateOwnSpore` nimmt `meta.snippetVectors` (harte Kürzung auf Max, `vec`-Längen-Check).
- **Modul 03:** neuer Helfer `embedSnippets(text|string[], opts?)` (Satz-Zerlegung → Passage-Vektoren).
- **§10 Änderungsprotokoll:** Zeile 2026-07-14 Spore v0.2.
- **Plan + interaktive Checkliste:** A6 + A10 auf `[~]` (Spec fertig, Bau offen).

**Wichtiger Befund (ehrlich):** **A6 ist im Code faktisch schon erledigt** — kein `_demo`-domainVector-Pfad
mehr in Modul 02/03, und `status.json` führt JEDEN Live-Knoten mit echtem 384-dim-e5-Vektor (verified-match).
v0.2 macht die Erwartung nur zur Tafel. Die teure Neu-Signier-Welle wird **real von A10 (snippetVectors)**
getrieben — das ist das einzige neue Feld.

**Was offen (= Bau-Sitzung Spore v0.2, Brief `BRIEF_BAU_SPORE_V02.md`):** Modul 03 `embedSnippets` bauen +
Modul 02 Assembly/Verify v0.2 + Headless-Smoke; `PROTOCOL_VERSION` im Code 0.1→0.2; byte-gleiche App-Kopien
(Drift-Guards); Re-Sign-Automatik (Knopf pro App + `npm run`-Skript, `npm run verify` ✔); dann die EINE Welle
(alle Knoten neu signieren) + `NETZ-STAND.md`. Kein PII, privater Schlüssel NIE ins Repo; 0.80-Riegel unberührt.

**Manual-Check:** reine Doku-Änderung (kein Code) — `npm test` bleibt der bestehende grüne Baseline-Beweis
(zur Bestätigung mitlaufen lassen). Browser-Sichttest: N/A (keine UI berührt).

## 2026-07-12 · Tooltip-Texte gekürzt (Klaus: „viel zu lang, kein Modul-Kram")

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus — die Tooltips waren zu lang/technisch („Modul 21",
Cosinus-Details). „Die meisten wollen nur wissen, WOFÜR es ist; an/aus erklärt sich selbst."

**Was getan:** alle `title`-Texte in **Modul 23 UI** (23 Stück) + **Modul 22** (11 Stück) auf knappe
„wofür"-Sätze gekürzt — kein „Modul XX", keine Technik. Beispiele: „Frage einsprechen (Spracheingabe,
Modul 21)…" → **„Frage einsprechen"**; der lange KI-Richter-Absatz → **„KI bewertet die Antworten
(eigener Schlüssel)"**. Byte-Kopien `such-tool/22` + `sbkim-bundle/23_ui`. Smokes bau22 260/bau22e
45/bau22f 17/bau22g 47/bau23_ui 81, Drift 49+21 grün. **Rollout:** Modul 22 (4 Kopien) + Modul 23 UI
(10 Kopien).

## 2026-07-12 · Eigener Tooltip statt nativem `title` (Modul 23 UI) — Split-Screen-Fix

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Screenshot — im Rendezvous-Panel landete der
native Browser-Tooltip (🎤-Knopf `title`) im Split-Screen/DeX halb **hinter dem Panel**. Ursache:
native `title`-Tooltips platziert der Browser selbst; per CSS nicht steuerbar.

**Was getan (Modul 23 UI):** `adoptTips(panelEl)` beim Panel-Mount stellt alle `title` auf einen
**eigenen Tooltip** um: Text → `data-sbtip`, natives `title` entfernt, Hover/Focus → ein am
`<body>` verankerter Tooltip (`position:fixed`, z-index max, unter dem Element, in den Viewport
geklemmt). Damit kontrolliert die App die Platzierung — nie mehr hinter dem Container. DOM-only,
fail-soft. Byte-Kopie `sbkim-bundle/modules/23_ui`. Smoke bau23_ui 81/81, Drift 21/21.

**Netzweiter Rollout:** alle 10 Modul-23-UI-Kopien. **Offen:** dynamisch gesetzte Titel (Blase bei
eingehendem Andock, kurze Toggle-Meldungen) bleiben vorerst nativ — unkritisch (kurz, am Rand).
Modul 22 (Suche) könnte denselben Helfer bekommen, falls dort auch gemeldet.

## 2026-07-12 · Icon-Entwirrung + ehrlicher Leer-Hinweis + Bereich-ausblenden (Klaus' Verwechslungs-Befund II)

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Screenshots — gleiche Zeichen für verschiedene
Funktionen (📌 „Merken" vs. „Nur neu anmelden"; 🔄 Hard-Reload vs. „nochmal fragen") + „Knoten
findet nichts" (Kimseek speist keinen Korpus). Klaus' Wahl (Chat, da Frage-Dialog buggte):
🙋 statt 📣 für „neu anmelden", Rest wie vorgeschlagen.

**Was getan:**
- **Modul 23 UI (Icons):** „Nur neu anmelden" 📌→**🙋** (sich melden/winken), „offene nochmal
  fragen" 🔄→**🔁** (auch die zugehörigen Briefkasten-Hinweise). Damit bleiben 📌=Merken und
  🔄=neu laden eindeutig der Suche vorbehalten. Reine Beschriftung.
- **Modul 22 (Ehrlichkeit):** neuer `areaHasSource(id)` + `unpopulatedAreaNote()` — ein
  angehakter, aber **nicht bestückter** Bereich meldet jetzt ehrlich „Hier nicht bestückt: „App"
  hat hier keinen eigenen Inhalt / „Knoten" ist hier nicht mit dem Netz verbunden" statt stumm
  „Keine Treffer." (fail-soft, reine Anzeige).
- **Modul 22 (`areasHidden`-Option):** eine App ohne eigenen Inhalt kann einen Bereich ganz
  ausblenden (`init({areasHidden:{app:true}})`) — ausgeblendet = keine Checkbox + zwangs-aus.
- **Funktions-Audit bestätigt:** KI-Richter ist wasserdicht (Anbieter+Schlüssel+Modell erreichen
  Modul 04); App/Knoten funktionieren korrekt, **wenn** die App den Korpus liefert (Sage: ja).
- Byte-Kopien `such-tool/modules/22` + `sbkim-bundle/modules/23_ui`; Smokes bau22 260/bau22e
  45/bau22f 17/bau22g 47/bau23_ui 81, Drift 49+21 — grün.

**Kimseek (Folge, eigener PR):** „App" ausgeblendet (kein eigener Inhalt), „Knoten" live ans
gemeinsame Netz verdrahtet (queryNode via Anastomose + Knoten-Korpus aus dem Rendezvous-Raum).

**Netzweiter Rollout:** Modul 23 UI (Icons) → alle 8 Apps + Tresore; Modul 22 → such-tool +
SB-KIMTool-Point + Kimseek. **Offen:** Mein-Tresor + Jasons-Tresor (ältere 23-UI) separat.
Browser-Sichttest wartet auf Klaus.

## 2026-07-12 · Namens-Entwirrung „Netz" — Internet vs. Knotennetz (Klaus' Verwechslungs-Befund)

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Screenshot — im Such-Widget (Kimseek) hieß der
**Internet-Suchbereich „Netz"**, und das schwebende Modul-23-Panel heißt **„Mit dem Netz
verbinden"** (= Knotennetz). Zwei verschiedene Dinge, beide „Netz" → Verwechslungsgefahr.
Klaus' Entscheid (AskUserQuestion): **beide umbenennen** + Hinweistext schärfen.

**Was getan:**
- **Modul 22:** Internet-Bereichs-Checkbox „Netz" → **„Internet"**; Treffer-Badge `SOURCE_LABELS`
  „Netz" → „Internet"; „↗ Im Netz weitersuchen" → „↗ Im Internet weitersuchen". Neuer,
  nur-bei-aktivem-Internet-Bereich sichtbarer **Klartext-Hinweis** („Internet = Suche im Web,
  nicht das Knotennetz. Mit SearXNG-URL: Treffer direkt hier. Ohne: Suchmaschine im neuen Tab.").
- **Modul 23 UI:** Panel/Blase/Knopf „🌐 Mit dem Netz verbinden" → **„🌐 Mit dem Knotennetz
  verbinden"** (alle Anzeige-Stellen). Reine Beschriftung — Rendezvous-Logik unberührt.
- Byte-Kopien in-repo (`such-tool/modules/22`, `sbkim-bundle/modules/23_ui`) + Smoke
  `smoke_bau23_rendezvous_ui` an den neuen Text angepasst.

**Kimseek-Audit (Klaus: „Kimseek soll Grundlage für den family-project-Machtplatz-Suchmaschine sein"):**
Kimseek war bei **16 von 17 Modulen** byte-identisch zum Kanon — nur **Modul 04 (Richter)** hing
zurück. **Nachgezogen (PR #26 gemergt):** Bau-04.H Sicherheits-/Konsequenz-Bewertung (Richter
wägt „gefahr/unsicher/sicher" mit). Kimseek jetzt in allen 17 Modulen auf Kanon-Stand.

**Tests:** bau22 260, bau22e 45, bau22f 17, bau22g 47, bau23_ui 81, Drift `such-tool` 49 +
`sbkim-bundle` 21 — alle grün. **Netzweiter Rollout:** Modul 22 (4 Kopien) + Modul 23 UI
(10 Kopien, davon Mein-Tresor + Jasons-Tresor auf älterem Stand — separat prüfen).

**Was offen / nächster Schritt:** **Browser-Sichttest durch Klaus** (nicht ersetzbar). Modul-23-UI-
Rollout an die 10 Kopien; die 2 Tresor-Apps tragen eine ältere 23-UI-Version — dort erst prüfen,
ob byte-1:1-Kanon oder nur die Beschriftung.

## 2026-07-12 · A16 Phase B — Treffer-Bewertung (👍 sehr gut · 🙂 okay · 👎 nein) füttert den Sortierer

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Wunsch nach A16 — nicht nur „gemerkt = gut",
sondern **nach der Gegenprüfung** bewerten, *wie* gut ein Treffer war (Geist echter Lernprogramme:
Antwort holen → Seite anschauen → zurück → zufrieden?). Klaus' Design-Wahl (AskUserQuestion):
**Bewertung nach dem Seiten-Öffnen**, an genau dem geprüften Treffer, **drei Stufen**.

**Was getan (Kanon Modul 22):**
- **Bewertungs-Zeile „Hat's getroffen? 👍 sehr gut · 🙂 okay · 👎 nein"** erscheint an GENAU dem
  Treffer, dessen Seite geöffnet wurde — sowohl in der Detail-Karte (nach „↗ Seite öffnen") als
  auch an der Trefferzeile in der Liste. Sichtbar beim Zurückkommen (`visibilitychange`/`focus`).
  Schon bewertet → „Bewertet: … (ändern)".
- **Zwei neue LS-Keys** (kein PII, nur Text/Link/Note): `sbkim_search_widget_feedback`
  (key→{rating,titel,text,source}) + `_pending` (geöffnet, noch nicht bewertet).
- **Lern-Verrechnung:** `computeRerankerModel(merkliste, feedback)` verrechnet jetzt auch die
  Bewertungen — **gestuft** (`feedbackWeight`: gut +2, okay +1, **nein −2**). Modell-Gewichte
  dürfen negativ werden; der Boost ist jetzt **vorzeichen-tragend** ∈ [−1,1] (👎 → Treffer **sinkt**,
  begrenzt ≤ 3 Plätze — Nudge, kein Umbruch). `retrainReranker()` lernt aus Merkliste **und**
  Bewertungen.
- Surface `+recordFeedback/getFeedback/feedbackWeight`, `_meta.feedbackCount/pendingFeedbackCount`.
- **REINE ANZEIGE/Lern-Eingabe** — gatet nichts, 0.80-Riegel + Modul 04/05 unberührt, kein
  PROTOCOL_VERSION-Bump. Fail-soft ohne localStorage.

**Tests:** Smoke `smoke_bau22g_lern_reranker.mjs` **47/47** (jetzt inkl. Phase B: gestufte Gewichte,
negatives Signal senkt begrenzt, positiv+negativ zusammen, fail-soft). Regress-frei: bau22 260,
bau22e 45, bau22f 17. Byte-Kopie `such-tool/modules/22` gezogen, Drift-Guard **49/49**.

**Netzweiter Rollout:** Kanon Sage `src` + `such-tool` → SB-KIMTool-Point `such-tool/modules/22`
+ Kimseek `modules/22` (je SW-Bump, Kimseek Drift-SHA nachgezogen).

**Was offen / nächster Schritt:** **Browser-Sichttest durch Klaus** (nicht ersetzbar) — suchen →
Treffer öffnen → zurück → 👍/🙂/👎 → erneut suchen: gut-bewertete/ähnliche Treffer stehen höher,
👎-Treffer tiefer. Offene A16-Folgefrage (aus dem A16-Brief): soll der Lern-Boost auch die
**Knoten-Rangfolge** (A11 „🔎 Antwort holen") beeinflussen — heute nur die lokale Treffer-Liste.

## 2026-07-12 · A16 — Lernender Sortierer (display-only Re-Ranker, on-device) in Modul 22

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Wunsch (Geist der BLP-„selbstlernenden
Kalkulation", auf die SUCHE): das mitgelieferte Sortierprogramm soll mit jedem 📌-Merken
**besser** werden. Der rohe e5-small-Cosinus sortiert flach (A11-Befund: Treffer 0.81–0.83).

**Was getan (Kanon Modul 22):**
- **Neuer LS-Key** `sbkim_search_widget_reranker` (pro App/Origin) — gelerntes Modell
  `{tokens, sources, n}` aus der 📌-Merkliste. KEIN PII (nur Token/Quelle/Gewicht, wie die
  Merkliste selbst schon speichert).
- **Reine Funktionen:** `computeRerankerModel(merkliste)` (Wortzerleger auf Titel/Text →
  Token-Gewichte + Quelle-Gewichte, Stoppwörter raus) + `learnedRerank(treffer,{model?})` —
  **stabile, BEGRENZTE Umsortierung**: effektiver Sortier-Schlüssel `index − boost·3`, ein
  Volltreffer steigt höchstens 3 Plätze. Boost ∈ [0,1] aus Token-Übereinstimmung (saturierend)
  + Quelle. **Kalt-Start / leeres / kaputtes Modell → Identität** (gleiche Reihenfolge, gleiche
  Objekte). Entfernt NICHTS, fügt NICHTS hinzu.
- **Training-Hook:** `retrainReranker()` hängt an `addMerk`/`removeMerk`/`clearMerkliste` —
  das Modell lernt bei jedem Merken/Entfernen neu (fail-soft, ohne localStorage kein Bruch).
- **Angewandt in `displayTreffer`** NUR auf die grobe „verbunden"-Standardsicht; die explizite
  „verwandt"-/KI-Sortierung bleibt unberührt. **REINE ANZEIGE — gatet nichts, 0.80-Andock-
  Riegel (Modul 05) + Modul 04 unberührt, kein PROTOCOL_VERSION-Bump.**
- Surface `+learnedRerank/computeRerankerModel/trainReranker/getRerankerModel`,
  `_meta.rerankerReady/rerankerTrained/rerankerTokens`.
- **Ehrliche Grenzen:** lernt pro Gerät (nicht netzweit geteilt); nur positives Signal (📌);
  negatives „passt nicht" bewusst Phase B.2 (kostet ein UI-Element mehr — offene Frage an Klaus).

**Tests:** neuer Smoke `smoke_bau22g_lern_reranker.mjs` **33/33** (Kalt=Identität · Pin-nudged-
hoch · Nudge-kein-Umbruch/Aufstieg≤3 · fail-soft kaputte Gewichte · Quell-Signal). Regress-frei:
bau22 260/260, bau22e 45/45, bau22f 17/17. Byte-Kopie `such-tool/modules/22` gezogen, Drift-Guard
`smoke_standalone_such_tool.mjs` **49/49**.

**Netzweiter Rollout (Modul 22 lebt nur an 4 Orten, nicht in den Rezept-Apps):** Kanon Sage
`src` + `such-tool` (dieser PR) → externe Byte-Kopien **SB-KIMTool-Point** `such-tool/modules/22`
+ **Kimseek** `modules/22` (je eigener PR, SW-Cache-Bump, Kimseek Drift-Guard-SHA nachgezogen).

**Was offen / nächster Schritt:** **Browser-Sichttest durch Klaus** (nicht ersetzbar) — im
Such-Widget etwas suchen, einen Treffer 📌-merken, erneut suchen: der gemerkte/ähnliche Treffer
steht sichtbar weiter oben. Optional Phase B.2 (sichtbares „👎 passt nicht") auf Klaus' Zuruf.

## 2026-07-12 · Briefkasten entdoppeln (B) + Mikrofon/Modul 21 nachgezogen (C) — netzweit

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Tablet-Screenshots nach A17 — (1) der
Briefkasten stand voll **doppelter** Fragen (Zähler „Antworten abholen (13)"), (2) das 🎤 im
Netz-Panel meldete „Modul 21 nicht geladen — bitte tippen" (toter Knopf).

**Was getan:**
- **B — Briefkasten (Modul 23 UI, A12) entdoppeln + 🗑/↗ je Eintrag.** `recordOpenQuestion`
  fasst offene Fragen jetzt nach `(Frage-Text, Ziel-Name)` zusammen (normalisiert
  trim+lowercase) statt nach der jedes Mal neuen `qid` → aus 13 identischen wird EIN Eintrag
  mit Versuchszähler (`tries`). Der Briefkasten rendert je Gruppe eine interaktive Karte mit
  „×N · zuletzt vor …", einem **🗑-Knopf je Eintrag** (nur diese Gruppe) und — falls die
  Adresse bekannt ist — **„↗ App öffnen" je Eintrag** (endpoint beim Schreiben mit abgelegt,
  Selbst-Suche ohne Warten). Reine Anzeige/Speicher: kein PROTOCOL_VERSION-Bump, kein PII,
  Kern 02/05/05b + 0.80-Riegel unberührt. Smoke `smoke_bau23_rendezvous_ui.mjs` **81/81**;
  Drift-Guard `smoke_bundle_connect.mjs` 21/21 (byte-1:1 `sbkim-bundle`). Kanon PR #635.
- **C — Mikrofon/Modul 21 (Spracheingabe) fehlte in den Apps.** Audit ergab: **6 von 7 Apps**
  luden `21_spracheingabe.js` gar nicht (nur Kimseek hatte es). Datei byte-1:1 aus dem Kanon
  nachgezogen + `<script>`-Tag ergänzt. Jetzt startet 🎤 die Erkennung (Browser-Web-Speech)
  oder gibt ehrlich Bescheid, wenn ein EU-Schlüssel nötig ist — kein toter Knopf mehr.
- **Netzweiter Rollout (7 Apps, je eigener PR, alle gemergt):** Mixarium #127 (B+C, QC-Spiegel,
  SW v58→v59), Rezeptbuch #315 (B+C, QC + build.py, SW mrz-v43→v44), family-project #66 (B+C,
  SW v23→v24), BookLedgerPro #271 (B+C, SW v206→v207, `node tests/run.mjs` 2123/0),
  Tomys-Hub #104 (B+C, SW tomy-hub-v14→v15, smoke-workfloh 31/31), Kimboard #23 (B+C, modules/,
  Drift-Guard-SHA nachgezogen, smoke 5/5), Kimseek #23 (nur B — hatte 21 schon; Drift-Guard-SHA
  23_ui nachgezogen, smoke 4/4). Alle byte-1:1 verifiziert (23_ui md5 `156d3932…`, 21 md5
  `6912ea55…` netzweit identisch).

**Kimseek-Nebenbefund (nicht gefixt, bewusst):** in Kimseek lädt `index.html` das Modul 21
**nach** Modul 23 — funktional egal, weil `SbkimSpeech` erst zur Laufzeit im Voice-Click-Handler
aufgelöst wird (alle Skripte dann geladen). Ein Reorder wäre eine nicht-byte-1:1-Änderung ohne
Nutzen gewesen.

**Was offen / nächster sinnvoller Schritt:** **A16 Lernender Sortierer** (eigener Brief
`docs/sessions/BRIEF_A16_LERNENDER_SORTIERER.md`) — display-only Re-Ranker in Modul 22, lernt
aus der 📌-Merkliste, on-device, fail-soft. Danach optional/auf Zuruf: Modell selbst hosten
(Ladezeit/Offline, `/models/…`-Pfad in Modul 03 existiert). **Browser-Sichttest B+C wartet auf
Klaus** (läuft nach Merge auf den live-deployten Seiten — Hard-Reload nach Pull).

## 2026-07-12 · Rendezvous UI — Partner-Link „↗ App öffnen" + Diagnose „nur wer könnte antworten"

**Rolle:** Bau (Freibrief). **Klaus' Live-Befund nach A17:** friert nicht mehr ein (✅), aber
die Suche zeigt oft **nur, WER antworten könnte**, nicht die Antwort selbst; Briefkasten voll
**doppelter** Fragen. **Diagnose (ehrlich):** server-los kommt die Antwort nur, wenn der
Gegen-Tab offen+vorn+wach ist — auf einem Gerät unmöglich, wenn man selbst vorn ist → System
zeigt die Rangfolge + legt die Frage in den Briefkasten (daher Doppel).

**Gebaut + netzweit (Freibrief):** jede Raum-Karte trägt jetzt **„↗ App öffnen"** (Adresse aus
Spore-`endpoint`, neuer Tab, fail-soft ohne endpoint) → Selbst-Suche ohne Warten; die „keine
Antwort"-Meldung ist ehrlich („Knoten nicht offen/wach") + verweist auf den Link. Reine Anzeige,
Kern 02/05/05b + 0.80-Riegel unberührt. Smoke `smoke_bau23_rendezvous_ui` **73/73** (+4).
Kanon PR #632; Rollout 7/7: Mixarium #126 (SW v57→58), Rezeptbuch #314 (v42→43),
family #65 (v22→23), BLP #270 (v205→206), Tomys #103 (v13→14), Kimboard #22 (v14→15, sha),
Kimseek #22 (v11→12, sha). Der Rollout brachte auch die A17-Drosselung in die Apps mit.

**Offen (Brief `docs/sessions/BRIEF_BRIEFKASTEN_DEDUP_UND_MODUL21_MIC.md`):**
- **Briefkasten entdoppeln + Löschen je Eintrag + Partner-Link je Eintrag** (A12, Modul 23 UI).
- **Mikrofon/Modul 21:** in Mixarium (& weiteren Apps) fehlt `21_spracheingabe.js` → 🎤 meldet
  „Modul 21 nicht geladen". Datei + Script-Tag nachziehen, netzweit.
- Danach A16 (lernender Sortierer). Optional: Modell selbst hosten (Ladezeit/Offline).

## 2026-07-12 · A17 Last-Schoner — Embedding im Web-Worker (gegen Tablet-Einfrieren)

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Tablet fror mehrfach ein / stürzte ab
bei wiederholten Cross-Knoten-Suchen mit zwei Modellen. **Ursache:** das e5-Modell rechnet
bei JEDER Suche — bisher **im Anzeige-Faden**, der dabei steht. Klaus' Ansage: die
„vernünftige" Variante, **kein Liliput** (Bauzeit ist nicht das Problem).

**Getan:**
- **Modul 03** rechnet Embeddings jetzt in einem **Inline-Blob-Web-Worker** (Hintergrund-
  Faden) statt im Haupt-Faden. Neue Innereien: `makeCfg`/`workerSource`/`ensureWorker`/
  `postToWorker`/`onWorkerMessage`/`failWorker` + `loadMainPipe` (Rückfall) + `computeVectors`
  (zentrale Rechen-Stelle, Worker zuerst). `embedSingle`/`embedBatch`/`embedContentVector`
  laufen alle darüber. `isReady()` kennt den Worker; `_workerState()`-Test-Brücke; `_meta.workerMode`.
- **Streng fail-soft:** kein Worker (Node/alter Browser/CSP) → transparenter Rückfall auf den
  Haupt-Faden = **byte-gleiche Vektoren**; Worker-Fehler mitten im Betrieb fällt sauber zurück;
  `init({worker:false})` schaltet ab. Kern-Module 02/05/05b unberührt, kein PROTOCOL_VERSION-/
  DB_VERSION-Bump, 0.80-Riegel nicht angefasst.
- **Byte-1:1** in sbkim-bundle/such-tool/pinnwand (Drift-Guards grün). Neuer Smoke
  `smoke_bau03_worker.mjs` **15/15** (Worker-Nutzung · Parität Worker==Haupt-Faden · Fail-soft ·
  Fehler-Recovery · worker:false). Regress: `smoke_a3` 20/20, `smoke_bundle_connect` 21/21,
  `smoke_standalone_such_tool` 49/49, `pinnwand/_smoke` 60/60.
- Dazu (im selben Branch, PR #630 gewachsen): die kleine **Drosselung** in Modul 23 UI
  („Antwort holen" entprellt — kein Doppel-Start, 4 s Abkühlung) als Ergänzung.

**Offen / nächster Schritt:**
- **Netzweiter Byte-Rollout** von Modul 03 in die Apps — ✅ **erledigt 2026-07-12** (7/7 gemergt,
  Subagenten): Mixarium PR #125 (SW v56→57), Rezeptbuch #313 (v41→42), family-project #64 (v21→22),
  BookLedgerPro #269 (v204→205), Tomys-Hub #102 (v12→13), Kimboard #21 (v13→14, sha-Guard),
  Kimseek #21 (v10→11, sha-Guard). Alle 7 hatten Modul 03 byte-identisch zum Vor-Worker-Kanon
  (kein Fork) → saubere Byte-Kopie.
- **Browser-Sichttest (kein Einfrieren mehr) wartet auf Klaus** — headless beweist die Logik,
  das echte Tablet-Verhalten sieht nur Klaus.
- **Selbst-Hosten des Modells** (Flaschenhals/Offline, `/models/…`-Pfad existiert schon in
  Modul 03) ist ein **separater, optionaler** Hebel — löst NICHT das Einfrieren, auf Klaus' Zuruf.
- Danach **A16** (lernender Sortierer, Brief liegt).

## 2026-07-11 · A11 Teil A (Bau 23.C) — Auto-Knoten-Auswahl + „🔎 Antwort holen"

**Rolle:** Bausitzung (Modul 23), Freibrief, Plan-Modus vorab (Plan freigegeben). Auslöser:
Klaus' Live-Test KimSeek→Mixarium — „bei 100 Knoten weiß ich nicht, wen ich frage; das soll
automatisch gehen, und der Knopf gehört unter die Frage, nicht als ❓ neben Andocken".

Neu: Modul 23 `rankCardsByQuery(cards, queryVec, {raw?})` rankt die Raum-Karten nach Passung
der getippten Frage zu jedem Knoten-`domainVector` (Modul 04 `relatedness`, zentriert; DOM-frei,
fail-soft). UI: Primärknopf **„🔎 Antwort holen"** direkt am Frage-Feld — bettet die Frage ein
(Modul 03), liest den Raum, zeigt die Karten **nach Passung sortiert** (🔎-Badge) und fragt den
**bestpassenden Knoten automatisch**; bleibt er stumm → **nächstbester** als Nachfass (sonst
A12-Briefkasten). Per-Karte-Knopf bleibt als manueller Override „❓ gezielt fragen".
**REINE Anzeige/Auswahl** — 0.80-Andock-Riegel + Kern 02/05/05b unberührt, kein PROTOCOL-Bump,
Empfangsmodus. Smokes `smoke_bau23c_rank_by_query` 15/15, `smoke_bau23_rendezvous_ui` 65/65,
Regress grün, Bundle-Drift-Guard 21/21. PR #626 gemergt.
**✅ Netzweiter Rollout ERLEDIGT 2026-07-11** (byte-gleich, je eigener PR gemergt): Mixarium #123
(SW v54→55), Rezeptbuch #311 (mrz-v39→40), family-project #62 (v19→20), BookLedgerPro #267
(v202→203, tests/run.mjs 2123 grün), Tomys-Hub #100 (v10→11), Kimboard #19 (v11→12, Drift grün),
Kimseek #19 (v8→9, Drift grün) — 7 Apps + Sage-Kanon/Bundle.
**✅✅ LIVE BEWIESEN (Klaus' Browser 2026-07-11):** KimSeek fragte „Erfrischendes ohne Alkohol"
→ „🔎 Antwort holen" wählte **automatisch** Mixarium (Frage-Passung 0.42) → Mixarium antwortete
aus seinem Buch (Melya/Tropical Sunrise Bowl/Fruit Shake/Kräuter-Nektar/Bora Bora, 32 s). Kein
Karten-Anklicken nötig. Rest-Grenze wie gehabt: e5-small-Cosinus flach (0.81–0.83) → Feinsortierung
noch grob (genau der Hebel für A16). **Offen:** **Teil B** = lernender Sortierer (Plan-Punkt A16,
Brief liegt: `docs/sessions/BRIEF_A16_LERNENDER_SORTIERER.md`); A11-Teil-B (Suchergebnis→Andocken-
Kopplung Modul 22↔23) weiter offen.

## 2026-07-11 · A4 Teil 2 (Bau 04.H) — KI-Richter wägt Sicherheit/Konsequenz mit

**Rolle:** Bausitzung (Modul 04), Freibrief. Auslöser: Klaus „ok 1." → A4 Teil 2.

Der opt-in KI-Richter (`hybridMatch`/`queryLocalJudged`) beurteilte bisher nur die
**thematische** Passung. Klaus' Referenzfall (Hund-Katze-/**Permethrin**): ein Mittel,
das thematisch perfekt zur Frage „Zecken-/Flohmittel für Hund UND Katze" passt, aber für
Katzen **giftig** ist, ranke oben — falsch. Jetzt wägt der Richter **Sicherheit + Konsequenz**:

- **Prompt** um generische Sicherheits-/Konsequenz-Anweisung erweitert (kein Stoff-Hardcode):
  thematisch nah + schädlich → `passt=false` → **herabgestuft**.
- **Neue optionale, additive Verdikt-Marke `sicherheit`** (`gefahr`/`unsicher`/`sicher`) in
  Schema, `attestation.verdicts` + `queryLocalJudged`-Kandidaten → macht die Konsequenz
  **sichtbar** (markieren).
- **Fail-soft + rückwärts-kompatibel:** fehlt/unbekannt → `null`, nie ein Grund das Urteil zu
  verwerfen (alte Richter/Kopien liefern es nicht).
- **REINE Anzeige/Urteil — gatet nichts:** `PROVIDER_MIN_MATCH` + 0.80-Andock-Riegel (Modul 05)
  unberührt. **Nur Such-Flächen**, nicht Sortier-Flächen.

Smoke `smoke_bau04h_safety_verdict.mjs` **22/22**; voller Sweep 0 echte Fehlschläge (13 Env-Skips
`fake-indexeddb`/`playwright`, vorbestehend). Byte-Kopien `such-tool/modules/04` +
`sbkim-bundle/modules/04` mitgezogen; dabei den pre-existing Drift `sbkim-bundle/modules/23_rendezvous(_ui)`
(aus A12 #620/#582 nie gesynct) byte-1:1 geheilt (Bundle-Drift-Guard wieder grün). PR #624 gemergt.
**Offen:** Browser-Sichttest mit echtem KI-Schlüssel (Klaus); UI-Anzeige des ⚠️-Markers (Modul 22) +
netzweiter Byte-Rollout des 04-Updates in die App-Repos. PLAN A4 auf `[x]` gesetzt.

## 2026-07-11 · Rendezvous-UX + A12 Briefkasten (Erreichbarkeit trotz Zeitverzögerung)

**Rolle:** Bausitzung (Modul 23 + UI), Freibrief. Auslöser: Klaus' Live-Test Tomys ↔ family.

**Was getan (alles netzweit gemergt, Klaus prüft live):**
- **Empfänger-Hinweis bei eingehendem Handshake** (Modul 23 UI): das „Mit dem Netz verbinden"-Panel
  zeigt „🤝 X hat sich mit dir verbunden", wenn ein fremder Knoten live andockt (`sbkim:handshake`
  `direction:"incoming"`). Löste Klaus' Befund „Handshake gemacht, aber Gegenseite merkt nichts".
  **✅ Browser-Sichttest GRÜN (Klaus 2026-07-11):** beidseitig sichtbar (Screenshot). Kanon-Smoke 41/41.
  Netzweit: 8 Repos.
- **A12 Briefkasten** (Klaus' Befund: Frage fällt in ein Zeitlimit, wenn der Antworter beim Fragen zu ist):
  - **Phase 1 Transport** (`23_rendezvous.js`): Antworter-**Lookback** (`enableAnswering` hört 30 min zurück
    → holt liegengebliebene Fragen beim Einschalten nach) + **`fetchAnswers`** (Frager liest späte Antworten
    nach); `askNode`-Timeout gibt `{pending:true, qid}` zurück. Smoke `smoke_bau23b_query.mjs` **28/28**.
  - **Phase 2 UI** (`23_rendezvous_ui.js`): offene Fragen gemerkt (localStorage, dbSuffix), **sichtbarer
    📬-Zähler an der Blase**, **Auto-Nachlese beim Öffnen**, Knopf „📬 Antworten abholen", Quittung offen/
    beantwortet. Smoke `smoke_bau23_rendezvous_ui.mjs` **50/50**.
  - **Phase 2b Rollout:** beide Module byte-1:1 in 7 Träger + Kim-recorded-sha (beide) + SW-Cache-Bumps.
  - **LEHRE (Klaus):** ein Briefkasten scheitert am **Lesen**, nicht am Schreiben (wie der git-Briefkasten,
    wo Briefe ungelesen liegen) — darum Lesen **sichtbar** (Zähler) + **automatisch** (beim Öffnen) gemacht,
    nicht hinter einem Knopf versteckt. Reale Grenze: **Aufbewahrungsdauer des Relais** (offener Folge-Check).

**Kern (02/05/05b + `PROVIDER_MIN_MATCH` 0.80) unberührt, reine Anzeige/Transport, fail-soft.
Browser-Sichttest des Briefkastens wartet auf Klaus (Live nach Deploy).**

---

## 2026-07-11 · A5 — Multi-Query-Rollout in die Apps (Mixarium · Rezeptbuch · family · BLP)

**Rolle:** Bausitzung A-Serie (A5). Freibrief gilt (siehe CLAUDE.md § Freibrief).

**Was getan (alle 4 PRs gemergt, Klaus prüft live):**
- **Mixarium** (PR #119, `c36f524`) + **Rezeptbuch** (PR #307, `372b837`): natives Sinn-Suchfeld `semRun`
  auf **Multi-Query** gehoben — Frage über app-eigene `SEM_SYN`-Karte auffächern (`expandQuerySimple`) →
  `queryLocalMulti` (RRF) statt reinem `queryLocal`. Hybrid war schon da. Gratis-Pfad; Richter-Pfad bleibt
  bewusst Single-Query (Modul 04 byte-frozen). Mixarium: `index.html` byte-gleich zur QC (md5). Rezeptbuch:
  QC-Quelle + `build.py`.
- **family-project** (PR #58, `cd9e733`): **Marktplatz-Suchfeld** `markt.html` (Klaus' Befund — im Erst-Mapping
  übersehen!) ist eine **Sortier-Fläche** → Multi-Query als Sortier-Verbesserung (bester Cosinus über die
  Frage-Varianten, versteckt nichts, Klaus-Entscheid). PLUS Cross-Knoten-**Antwort-Pfad** `15_membran.js`
  (`op:"query"`) → `queryWithInclusion` (A4+A1) nachgezogen. SW-Cache v15→v16.
- **BookLedgerPro** (PR #263, `886c57f`): eigene Nutzer-Suche war **schon** hybrid+synonym-fähig (kein Eingriff);
  Cross-Knoten-Antwort-Pfad `15_membran.js` nachgezogen. SW-Cache v198→v199.
- **Pinnwand:** bewusst gelassen (eigene Sortier-Suche läuft gut, Klaus-Entscheid). Offener Folgepunkt A5b.

**Verifikation:** je App eigener Headless-Smoke grün (Verdrahtungs-Guard über die ausgelieferte Synonym-Karte):
Mixarium `smoke_a5_suchfeld_multiquery` 8/0, Rezeptbuch 8/0, family `smoke_a5_markt_sortierung` 6/0 +
`smoke_a5_antwortpfad` 6/0, BLP `smoke_a5_antwortpfad` 6/0 + Haupt-Suite 2123/0. Kern (02/05/05b +
`PROVIDER_MIN_MATCH` 0.80) unberührt, kein PROTOCOL_VERSION-Bump. **Browser-Sichttest wartet auf Klaus (Live-Seiten).**

**Realitäts-Abgleich (Tafel-Evolutions-Klausel):** der Brief nahm 5 vergleichbare Suchfelder an — die Apps sind
heterogen (Such- vs. Sortier-Flächen, teils kein Suchfeld, teils eigener Such-Stack). Detail + A5b in
`docs/PLAN_SEMANTIK_KRYPTO.md`.

---

## 2026-07-11 · Schlüssel-Tresor: KI-Richter-Schlüssel verschlüsselt merken + Vergessen-Schutz, netzweit

**Rolle:** Bausitzung (Modul 20 + Netz-Panel + netzweiter Rollout + neuer Skill).

**Was getan:**
- **Modul 20 (Safe) kann Geheimnisse:** `putSecret/getSecret/hasSecret/removeSecret`
  (PBKDF2-SHA256 600k → AES-GCM-256, frisches Salt/IV, kein Klartext at rest,
  unabhängig vom Identitäts-Vault). Bereits als PR #612 auf `main`.
- **Vergessen-Schutz (Klaus 2026-07-11, diese Runde):** BYOK-Schlüssel ist gratis
  neu holbar (jeder Nutzer holt SEINEN selbst — kein Support/keine Last für Klaus),
  „Passwort vergessen" ist also **kein Datenverlust**. Zwei offline-taugliche
  Bausteine, KEINE E-Mail/KEIN Server/KEIN PII: (1) ehrlicher `FORGOT_HINT`,
  (2) optionale **Merkhilfe** `putSecret(...,{hint})` + `getSecretHint(name)`
  (unverschlüsselt, app-eigen via dbSuffix → kein Cross-App-Leck, NIE das Passwort;
  wird beim Entsperren in die Passwort-Frage eingeblendet). Shamir 2-von-3 bleibt
  für *wertvolle, nicht ersetzbare* Geheimnisse (nicht für gratis-KI-Schlüssel).
- **Netz-Panel (Modul 23 UI):** „🔒 im Tresor merken" / „🔓 Tresor entsperren" am
  KI-Richter, `safeMod()`-Guard (fail-soft ohne Modul 20). E-Mail-Recovery bewusst
  verworfen (bräche offline + kein-PII; würde Fremdnutzer eine E-Mail abverlangen).
- **Netzweiter Rollout** byte-1:1 in alle 9 Apps (Mixarium/Rezeptbuch/Tomys/BLP/
  family/Kimboard/Kimseek/Kim-Bell/SB-KIMTool): Modul 20 neu geladen (nach 01),
  23_ui + 16 nachgezogen; Mixarium-QC + Rezeptbuch-QC (build.py) synchron gehalten;
  Drift-sha256 in Kimboard/Kimseek/Kim-Bell aktualisiert.
- **Skill** `verschluesselter-schluessel-tresor` angelegt (Sage `.claude/skills/`) —
  Rezept fürs Merken jedes BYOK-Geheimnisses in neuen Apps (inkl. Vergessen-Schutz).

**Was getestet:** `smoke_bau20_secret.mjs` 18/18, `smoke_bau23c_ki_richter.mjs` 28/28
(echtes WebCrypto + Bedien-Verdrahtung inkl. Merkhilfe). App-Drift-Guards grün
(Kimboard 5/5, Kimseek 4/4, Kim-Bell 4/4, Rezeptbuch 6/6, BLP 2123/0, SB-KIMTool
node --test 103/103 — Probe 27 im Such-Widget-Smoke ist **vorbestehend rot auf main**,
unabhängig vom Tresor).

**✅ Browser-Sichttest GRÜN (Klaus 2026-07-11):** Tomys Hub live — KI-Richter an,
Schlüssel eingetippt, „🔒 im Tresor merken" → Bestätigung „🔒 Schlüssel verschlüsselt
im Tresor gemerkt … Passwort vergessen? Kein Drama — hol dir beim Anbieter gratis
einen neuen Schlüssel und leg ihn neu ab." sichtbar wie gebaut (Vergessen-Hinweis
live). „Alles funktioniert" (Klaus). Tresor netzweit gemergt (11 PRs auf `main`).

**Was offen / nächster Schritt:** Merkhilfe/Tresor ggf. auch an anderen BYOK-Feldern
(Suche/OCR) — bei Bedarf. Weiter mit der A-Serie (A4 Teil 2 / A5 / A6 / A7–A9) —
Brief `docs/sessions/BRIEF_A_SERIE_A4BIS_WEITER.md`.

---

## 2026-07-11 · Offline-Modell-Quelle (Modul 03) upstreamed + netzweit ausgerollt (A6-Baustein)

**Rolle:** Bausitzung (Upstream + byte-1:1-Rollout, Klaus' ausdrückliche Freigabe
„Ja, upstreamen"). Spec-vor-Code light: additiv, Default byte-gleich, Headless-Beweis.

**Was:** Das in **family-project** bewährte **Offline-first**-Feature aus dem Fork in den
**Kanon** `src/modules/03_embedding.js` gehoben (Klaus' Entscheid nach dem Drift-Audit).
Das Embedding-Modell wird vom **eigenen Server** (`<origin>/models/…`) statt HuggingFace
geladen, wenn es dort liegt — `detectModelSource()` entscheidet per **Body-Probe** (ein
SPA-Server liefert für fehlende Dateien die index.html mit 200+HTML statt 404; nur echtes
JSON `{`… gilt als `local`), konsequent **fail-soft** (jeder Fehler → `remote`).
`configureModelSource()` setzt `transformers.js env` passend. Surface `+getModelSource`/
`+_detectModelSource`, `_meta.localModelRoot`/`localModelProbe`.

**Strikt additiv:** ohne lokales Modell (Default) byte-gleiches Verhalten — gleiches Modell,
gleiche Vektoren. **Kein** Spore-Feld, **kein** PROTOCOL_VERSION-/DB_VERSION-Bump,
Match-Schwelle (04/05) unberührt.

**Beweis (headless):** neuer Smoke `tests/smoke_a6_offline_model_source.mjs` **11/11**
(fail-soft-Kette · SPA-HTML-Falle → remote · echtes JSON → local · `!res.ok`/Throw →
remote · Surface/`_meta`). Regressionsfrei: `smoke_a3_contextual_chunking`,
`smoke_bundle_connect`, `smoke_standalone_such_tool`, `pinnwand/_smoke` 60/60.
(`smoke_inhaltstreuer_domainvektor` ist unabhängig rot — fehlendes npm-Paket
`fake-indexeddb`, schon auf main, nicht diese Sitzung.)

**Kanon-Merge:** Sage PR #604 (src + sbkim-bundle + such-tool + pinnwand byte-1:1,
Drift-Guards grün). **Neuer Kanon-03 = `36e87c26` (sha256 `60d6f516`).**

**Netzweiter byte-1:1-Rollout (alle gemergt):** Mixarium #114 · Rezeptbuch #302 ·
BookLedgerPro #259 · Tomys-Hub #90 · Kimboard #11 · Kimseek #11 · Kim-Bell #19 ·
SB-KIMTool-Point #108 (beide Kopien: `web/tools/sbkim-embedding.js` + `such-tool/modules`).
family-project war schon Kanon (Quelle). Jede berührte Datei per Blob-SHA `36e87c26`
bestätigt; Repo-Tests grün (BLP 2123/0, SB-KIMTool 103/103, Rezeptbuch 6/6, Mixarium-Smokes,
Kim-Bell 4/4, Kimboard 5/0, Kimseek 4/0).

**Nebenbefund + repariert:** Kimboard/Kimseek Drift-Guard (`test/smoke.test.js`) war auf
`main` bereits **rot** — der A14-Rollout hatte `01_storage.js` aktualisiert, aber den
aufgezeichneten sha256 (`28299cb8`) nicht nachgezogen (Ist: `e507aec1`). In denselben PRs
mitrepariert → beide wieder grün.

**Browser-Sichttest** (echtes lokales Modell vom eigenen Server laden) ungeprüft — wartet
auf Klaus' Browser-Lauf.

## 2026-07-11 · Netzweiter Modul-Drift-Audit — BLP 03+05 nachgezogen, family-project 03 als Fork markiert

**Rolle:** Bausitzung (Sauberkeits-Audit + byte-1:1-Sync, Klaus' Freibrief „entscheide
selbst die Reihenfolge, solange die Modul-01-Fehler weg sind — sauberes Coden").

**Anlass:** Nach dem A14-Abschluss die Basis netzweit geprüft — sind die übrigen
geteilten Kern-Module (02/03/05/05b/23) noch überall byte-1:1 zum Kanon? Vergleich per
git-Blob-SHA auf `origin/main`.

**Ergebnis:** Modul 01 (A14) + 04 (Hybrid/BM25+Multi-Query) sind netzweit **synchron**.
Zwei echte Drifts gefunden, unterschiedlicher Natur:

- **BookLedgerPro — reiner Rückstand (behoben, PR #258):** `03_embedding.js` (fehlte A3
  Contextual Chunking) + `05_anastomose.js` (fehlte der Query-über-Relais-Transport
  `queryNostr`) waren strikte Teilmengen des Kanons (255 bzw. Netto-Rückstand, keine
  BLP-eigene Logik). Byte-1:1 nachgezogen (03=858819b1, 05=6bb282c1), `node tests/run.mjs`
  2123/0 grün. **Datenschutz-Hinweis:** `05` ist Empfangsmodus — aktiviert nichts von
  selbst; BLPs Buchhaltungs-Korpus geht erst übers Relais, wenn die App das Antworten
  ausdrücklich verdrahtet (tut sie nicht).

- **family-project — echter App-Fork (NICHT angefasst, Entscheid an Klaus):**
  `03_embedding.js` ist **Kanon + eigenes Feature** (self-hosted Offline-Modell:
  `detectModelSource`/`getModelSource` + Body-Probe gegen SPA-`try_files`, damit
  transformers.js das Modell vom eigenen Server statt HuggingFace lädt). family hat A3
  Contextual Chunking bereits; die 62 Zusatzzeilen sind das Offline-Feature. Blind
  überschreiben würde es löschen → bewusst gelassen. **Offene Frage an Klaus:** soll das
  Offline-Self-Hosting nach oben in den Kanon `src/modules/03_embedding.js` (und damit in
  alle Apps) gehoben werden? Das ist netzweit nützlich (offline-first), aber ein
  Architektur-Schritt mit eigener Spec-/Bau-Sitzung.

**Nächster sinnvoller Schritt:** entweder das family-Offline-Feature upstreamen (Klaus'
Entscheid) oder A5-Rest (Multi-Query im Such**feld** der Apps verdrahten — Modul 04 trägt
`expandQuerySimple`/`queryLocalMulti` schon überall, die App-Suchfelder rufen aber nur
`queryLocal({hybrid:true})`, noch nicht die Multi-Query-Erweiterung).

## 2026-07-11 · A14-Rollout ABGESCHLOSSEN — Rest-Knoten + eingebettete Kopien netzweit nachgezogen

**Rolle:** Bausitzung (Rollout-Abschluss, eng abgegrenzt, byte-1:1).

**Was getan:** Der A14-Fix (`ensureStore`-Race, Kanon Sage PR #600) war noch
NICHT überall angekommen. Prüfung netzweit über die **git-Blob-SHA** auf
`origin/main` (GitHub-Code-Suche war stale und unbrauchbar — Blob-SHA ist der
verlässliche Vergleich): Kanon-fixiert = `66b31066…`, Vor-Fix = `43a6ad59…`.

Sieben Repos trugen noch den **exakten** Vor-Fix-Stand und wurden byte-1:1 auf
den gehärteten Kanon gehoben (alle gemergt):

| Repo | Datei | PR |
|---|---|---|
| Sage-Protokol | `sbkim-bundle/modules/01_storage.js` | #601 — Drift-Guard war rot, jetzt grün |
| Mein-Rezeptbuch | `sbkim/01_storage.js` | #301 |
| BookLedgerPro | `sbkim/01_storage.js` | #257 |
| Jasons-Tresor | `sbkim/01_storage.js` | #118 |
| Mein-Tresor | `sbkim/01_storage.js` | #60 |
| SB-KIMTool-Point | `web/tools/sbkim-storage.js` (+ Einbettung `jasons-bibliothek/index.html`) | #107 |
| Kim-Bell | `modules/sbkim-storage.js` (+ Drift-sha256 in `test/smoke.test.js`) | #18 |

**Verifikation:** jede geänderte Datei per Blob-SHA byte-identisch zum Kanon
(`66b31066…`) bestätigt; jedes Repo lädt das Modul als eigene `<script src>`
(kein verstecktes Inline-Duplikat im Haupt-App-Pfad). Repo-Tests grün:
SB-KIMTool-Point 103/103 (inkl. Einbettungs-Drift-Guard test 32, den der Fix
zunächst rot zog → Einbettung nachgezogen), BookLedgerPro 2123/0, Jasons 59/59,
Mein-Tresor 53/53, Mein-Rezeptbuch 6/6, Kim-Bell 4/4 (aufgezeichneter sha256
nachgezogen), Sage `smoke_bundle_connect` Drift-Guard wieder grün.

**Bewusst NICHT angefasst (Brief „divergiert → erst Ursache klären"):** die
**getrimmten Inline-Kopien** des Moduls in den *Knoten-Demo-Seiten*
`BookLedgerPro/sbkim/mycelknoten.html` und `SB-KIMTool-Point/web/tools/mycelknoten.html`.
Sie weichen von der Standalone-Serialisierung ab (Header getrimmt, ~976 vs.
1297 Zeilen), tragen aber denselben Race und werden von keinem Drift-Guard
gedeckt → **eigener, browser-verifizierter Folge-Fix** (chirurgisches Einsetzen
der zwei `ensureChain`-Hunks in den Inline-Block, nicht blind überschreiben).

**Nicht betroffen (kein Storage-Modul auf main):** Kimhub, Kimsync, mycel-karte,
ISD-Page-Entwurf, Mein-WorkFloh, die `-Page`-Repos, Muttis-Rezeptbuch(-Seite),
yamilet-Promptgenerator. Mixarium/Tomys-Hub/family-project/Kimboard/Kimseek
waren schon in der Vorsitzung fixiert (bestätigt: Blob = `66b31066…`).

**Browser-Sichttest ungeprüft** — wartet auf Klaus' Browser-Lauf (der Race
zeigte sich am Galaxy Tab bei wiederholtem Slot-/Modul-Wechsel).

## 2026-07-11 · A14 — `ensureStore`-Race gehärtet (Modul 01, netzweit)

**Rolle:** Bausitzung (Kern-Modul 01, eng abgegrenzt).

**Befund (reproduziert, headless):** Zwei GLEICHZEITIGE `ensureStore`-Aufrufe
(z.B. Modul 05 `ensureSlotStores` neben Modul 07 Apoptose im selben Tick) lasen
beide dasselbe `db.version`, errechneten beide `db.version + 1` und öffneten
beide `indexedDB.open(name, N)`. Der zweite Open traf die schon auf N gehobene
DB → **kein** `onupgradeneeded`, resolved aber trotzdem → sein Store wurde nie
angelegt, `KNOWN_STORES` behauptete ihn dennoch → nächster Zugriff warf
`NotFoundError: One of the specified object stores was not found`. Repro:
8/8 Trials fielen auf dem unveränderten Modul.

**Fix:** Serieller Anker `ensureChain` in `src/modules/01_storage.js` reiht
jeden Versions-Bump strikt hinter den vorigen — jeder Lauf sieht ein frisches
`db.version` (Idempotenz-Check + korrekter nächster Bump). Rein interne
Serialisierung, die öffentliche `ensureStore`-Signatur (`Promise<void>`) bleibt
unberührt; ein Fehlerpfad vergiftet die Kette nicht (Rejection wird abgefangen,
an den Aufrufer aber durchgereicht). **KEIN** DB_VERSION-/PROTOCOL_VERSION-Bump.

**Beweis:** neuer Smoke `tests/smoke_a14_ensurestore_concurrent_race.mjs` **4/4
grün** (gleichzeitig 2/3 Stores + Modul-05-`ensureSlotStores`-Muster + zwei
Wellen). Non-vakuum verifiziert: dieselben 4 Proben fielen 4/4 auf dem
unveränderten Modul. Regression frei: `smoke_pflege_01_init_fail_soft` 11/11,
`_repoint_migrate` 21/21, `_shared_topf_isolation` 7/7,
`_versions_bump_race` 6/6.

**Offen / nächster Schritt:** byte-1:1-Rollout des gehärteten Modul 01 in die
Konsumenten-Repos (Tomys-Hub, Mixarium, family-project, Kimboard, Kimseek — alle
waren byte-identisch zum Vor-Fix-Stand). Browser-Sichttest ungeprüft — wartet
auf Klaus' Browser-Lauf (der Race zeigte sich am Galaxy Tab bei wiederholtem
Slot-/Modul-Wechsel).

## 2026-07-11 · ✅ Browser-Reihen-Test GRÜN — Identitäts-Isolierung 11/11 live bewiesen

**Rolle:** Begleit-/Sichttest-Sitzung (Klaus am Tablet, Freibrief galt). **Abschluss von A13.**
Klaus hat den Browser komplett geleert + alle Apps deinstalliert (außer Mycel-Karte, reiner
Beobachter), dann **jede App einzeln** geöffnet → Hard-Reload (Strg+Shift+R, frischer SW) →
„🌐 Mit dem Netz verbinden". **Ergebnis: 11/11 Apps zeigten je eine EIGENE, verschiedene nodeId —
keine einzige Kollision.**

| App | nodeId (Anfang) | App | nodeId (Anfang) |
|---|---|---|---|
| Mein Mixarium | `1zh_Xkqfq` | Mein-Tresor | `PwZkKkaUm` |
| Mein Rezeptbuch | `26HBrV80y` | Kimseek | `29NnYnLK` |
| BookLedgerPro | `itzsPCHy2` | Kimboard | `9Xlas1Gj9` |
| family-project | `c-lFJKXPJ` | Tomys-Hub | `s2-oNG-Eke` |
| SB-KIMTool-Point | `VXbd6kIqFi` | Kim-Bell | `fRx3M_xo7` |
| Jasons-Tresor | `FBTYVnW3i` | | |

**Kern-Beweis:** das frühere Kollisions-Paar **SB-KIMTool-Point `VXbd6kIqFi` ↔ family-project
`c-lFJKXPJ`** (teilten sich vorher dieselbe nodeId `3Qo4OKI…`, last-writer-wins) ist jetzt sauber
getrennt. Der Isolierungs-Fix (PR #595: Idempotenz-Guard + `window.SBKIM_DB_SUFFIX`) hält netzweit
im echten Browser, nicht nur headless. **A13 vollständig geschlossen** (PLAN nachgezogen).
Nebenbeobachtung (harmlos, kein Befund): SB-KIMTool-Point zeigte zwei Ladebalken beim ersten
Verbinden = das ~30 MB Embedding-Modell wird einmal in die eigene Schublade geladen, **nicht**
eine zweite Identität (Panel bestätigte „✓ Identität erzeugt" genau einmal).

**Zweiter, unabhängiger Beleg — Mycel-Karten-Aufzeichnung** („Mycel-Karte Analyse-Rekorder v1.3",
Klaus, 08:00–08:47 Uhr desselben Tages, 38 Ereignisse): die Live-Karte hat mitgeschrieben, welche
Identität jeder Knoten im gemeinsamen Raum (`sbkim-rdv`) trägt. Maschinell ausgewertet: **(1) keine
einzige nodeId hing je an zwei Apps** (keine Kollision), **(2) kein Knoten zeigte je mehrere/wechselnde
IDs** (jede App durchgehend genau eine). End-Schnappschuss: 9 Knoten gleichzeitig live, jeder mit
eigener ID — **exakt dieselben** wie im Reihen-Test (family `c-lFJKXPJ`, toolpoint `VXbd6kIqFi`,
jtresor `FBTYVnW3i`, mtresor `PwZkKkaUm`, tomyhub `s2-oNG-Eke`, kimseek `29NnYnLK`, kimboard
`9Xlas1Gj9`, kimbell `fRx3M_xo7`, blp `itzsPCHy2`). Dass die 08-Uhr-Aufzeichnung dieselben IDs sah
wie der 10:25-Test, belegt zusätzlich **stabile, persistente Identitäten** (überleben Zeit + Neuladen,
ohne zu wandern). Damit ist die Isolierung **doppelt bewiesen** — manueller Reihen-Test + Live-Karten-Log.

**Offen / nächster Schritt:** **A14** (vorbestehende `ensureSlotStores`-Race, Modul 05/01 — nicht
durch A13 verursacht) separat untersuchen · **A15** (Zwei-Stufen-Verbinden: 🔎 stöbern anonym ↔
🌐 voll mitmachen) + **A11** (Suchergebnis→Andocken) als Marktplatz-Folge · Tomys-Hub-Spore
veröffentlichen (braucht „📥 Spore herunterladen"-Knopf — kleiner Bau).

## 2026-07-11 · Identitäts-Isolierung gehärtet — Doppel-Laden + globales App-Suffix, netzweit 11/11

**Rolle:** Bausitzung (Anschluss, gleiche Sitzung). Freibrief galt. **Auslöser:** Klaus' Live-Sichttest
zeigte, dass mehrere PWAs auf der geteilten github.io-Origin sich EINE Identität über den geteilten Topf
`sbkim` teilten (SB-KIMTool-Point + family-project zeigten dieselbe nodeId `3Qo4OKI…`, last-writer-wins;
SBK „erbte" family-projects Identität und umgekehrt). Tomys-Hub war die Ausnahme (sauber isoliert).

**Zwei Wurzeln, beide gefixt (Modul 01, PR #595 gemergt):**
- **(A) Doppel-Laden:** lädt eine Seite das Storage-Modul ein ZWEITES Mal (SB-KIMTool-Point:
  `assets/sbkim-siegel.js` zieht `web/tools/sbkim-storage.js` dynamisch nach), lief die IIFE erneut und
  SETZTE den State zurück → der gesetzte `dbSuffix` ging verloren → Rückfall auf den geteilten Topf.
  Fix: Idempotenz-Guard `if (global.SbkimStorage) return;` — zweites Laden ist No-Op.
- **(B) Reihenfolge:** öffnete irgendein Modul den Storage VOR `init({dbSuffix})`, wurde der Default `sbkim`
  geöffnet. Fix: Default-DB-Name kommt aus dem globalen App-Suffix `window.SBKIM_DB_SUFFIX` (App setzt es
  ganz früh) → JEDER Storage-Zugriff landet reihenfolge-unabhängig in `sbkim_<suffix>`, selbst nach Reset.
Additiv + rückwärtskompatibel; DB_VERSION 4 unberührt. Smoke `smoke_pflege_01_shared_topf_isolation.mjs`
**7/7** (Doppel-Laden No-Op + zwei Apps getrennte Schubladen + keine Kollision + rückwärtskompat.), regress-frei.

**Netzweiter Rollout ERLEDIGT — 11/11 Apps** (je eigener PR gemergt): jede App bekam die neue Modul-01-Version
**+** `window.SBKIM_DB_SUFFIX="<suffix>"` nachweislich VOR dem ersten SBKIM-Script (Offset-Beleg je HTML):
Kim-Bell (#17, kimbell) · Mein-Mixarium (#112, mixarium, index==QC md5-sync) · Mein-Rezeptbuch (#300,
rezeptbuch via QC+build.py) · Kimboard (#9) · Kimseek (#9) · SB-KIMTool-Point (#106, toolpoint, 4 HTMLs +
jasons-bibliothek-Embed) · Mein-Tresor (#59) · Jasons-Tresor (#117) · BookLedgerPro (#256, Suffix
`bookledgerpro-sbkim` = Identitäts-Store; Rendezvous-Variante `bookledgerpro` wird fail-soft auf dieselbe
Schublade geheilt) · family-project (#51, 6 HTMLs) · Tomys-Hub (#86, tomyhub). **Mycel-Karte** ist reiner
Beobachter (nur WebSocket-Lausch, keine Identität, kein Storage) → kein Fix nötig, geprüft.

**Offen / nächster Schritt:** Klaus' **Browser-Reihen-Test** (leerer Browser, eine App nach der anderen:
Hard-Reload → „🌐 Mit dem Netz verbinden" → jede App eine eigene, verschiedene nodeId). Kein „Aufräumen"
nötig (Browser geleert). **A14** (vorbestehende `ensureSlotStores`-Race, Modul 05/01 — Tomys verbund-E2E
15/16, nicht durch diesen Fix verursacht) separat untersuchen. **A15** (Zwei-Stufen-Verbinden, Klaus' Idee)
+ **A11** (Suchergebnis→Andocken) als Marktplatz-Folge.

## 2026-07-11 · Modul-01 Selbst-Heilung — netzweiter Rollout 11/11 (Aufräum-Rettung repariert)

**Rolle:** Bausitzung (Anschluss an den 11/11-Re-Sync, gleiche Sitzung). Freibrief galt.
**Auslöser (Klaus' Live-Sichttest 2026-07-11):** nach dem Re-Sync + komplettem Browser-
Speicher-Löschen brach die „🧹 Aufräumen & neu anmelden"-Rettung (Modus B) auf **Mein
Rezeptbuch** + **BookLedgerPro** ab mit „Pflicht-Stores fehlen in existing DB (v=7): sbkim_keys,
…"; zugleich teilten **Kim-Bell + SB-KIMTool-Point** dieselbe Identität (`28MUVbD7…`, aus dem
geteilten `sbkim`-Topf). Weil der Speicher vorher leer war → **echter Kern-Zustand, keine
Alt-Verschmutzung**: auf der geteilten Pages-Origin kann durch openProbe-Bump-Race eine
versioniert-aber-store-lose DB entstehen; Modul 01 warf hart `StorageOpenError` und reparierte
nicht → Rettung konnte nie durchlaufen.

**Fix (Sage-Kanon, PR #592 gemergt):** fehlt unter den Pflicht-Stores der Identitäts-Store
`sbkim_keys`, kann die DB **keine Identität tragen** → gefahrloser Neu-Aufbau (löschen, frisch
unter DB_VERSION öffnen) statt Fehler. Ist `sbkim_keys` da und nur ein anderer Store fehlt →
weiter fail-fast (kein stiller Datenverlust). Open-Körper nach `openFreshAtDbVersion()`
ausgegliedert (Initial-Pfad unverändert). `DB_VERSION` 4 unberührt, kein Schema-Bruch.
`sbkim-bundle/modules/01_storage.js` byte-1:1 mitgezogen. Smoke `smoke_pflege_01_init_fail_soft`
**11/11** (Probe 3 Selbst-Heilung + Probe 4 fail-fast-Grenze neu), regress-frei.

**Netzweiter Rollout ERLEDIGT — alle 11 Endknoten byte-1:1 auf die neue Kanon-Version**
(je eigener PR, gemergt, headless grün, SW-Cache-Bumps wo cache-first):
Mein-Mixarium (#111, SW v49→v50) · Mein-Rezeptbuch (#299, SW network-first) · family-project
(#50, SW v13→v14) · BookLedgerPro (#255, SW v196→v197, 2123/2123) · SB-KIMTool-Point (#105,
+ Embed jasons-bibliothek) · Jasons-Tresor (#116, 2 Kopien, 59/59) · Mein-Tresor (#58, 2 Kopien,
53/53) · Kimseek (#8, SW v6→v7) · Kimboard (#8, SW v6→v7) · Tomys-Hub (#85, SW v6→v7) ·
Kim-Bell (#16, SW v14→v15). **Live-Beleg:** Tomys-Hub-Verbund-E2E heilt jetzt den zuvor roten
Fall „Identität aus leerer DB laden" (16/16, vorher 15/16).

**Offen / nächster Schritt:** Klaus' Browser-Reihen-Test — pro App Hard-Reload +
„🌐 Mit dem Netz verbinden": jede App zeigt eine **eigene, verschiedene** nodeId (eigene
Schublade `sbkim_<app>`); „🧹 Aufräumen & neu anmelden" läuft jetzt sauber durch. Tomys-Hub
(`tomyhub`) + family-project (`familyprojekt`) bekommen ihre lebende Identität in Klaus'
Browser (eigene Instanz; Tomys Gerät bliebe ein separater Knoten). Optionale veröffentlichte
`sbkim/spore.json` nur auf Wunsch (öffentliche Spore committen, privater Schlüssel bleibt im Browser).

## 2026-07-11 · Identitäts-Isolierung KOMPLETT — Kim-Bell + SB-KIMTool-Point voll re-synct (11/11)

**Rolle:** Bausitzung (Brief `BRIEF_KIMBELL_SBK_VOLLER_RESYNC.md`). Freibrief galt.
Die zwei bewusst ausgelassenen Knoten (pre-A4-Baseline) auf den **vollen Sage-Kanon**
gehoben — **kein** 01+23-only-Bump (der hätte einen Mischversions-Knoten erzeugt),
sondern Modul für Modul jede geladene Datei = Kanon.

- **Kim-Bell** (PR #15 gemergt, `c081ee5`): alle 13 geladenen `modules/sbkim-*.js` auf
  Kanon (10 geändert; apoptose/nostr-relay/noble waren schon Kanon). Drift-Guard-sha256
  (`test/smoke.test.js`) nachgezogen, SW `kim-bell-v13→v14`. **node --test 4/4 grün.**
- **SB-KIMTool-Point** (PR #104 gemergt, `f27784e`): `web/tools/*` 12 Module auf Kanon;
  `such-tool/modules/03_embedding.js` auf Kanon + SW `sbkim-such-tool-v2→v3`;
  `jasons-bibliothek/index.html` eingebettete Module 01+02 mitgezogen (Embed-Byte-Guard
  `test/jason_lib.test.js` gewahrt). **npm test 103/103 grün.**
- Bringt beiden: Modul-23 Identitäts-Schutz (Weg A), Bau-23.B-Korpus-Kopplung, Spore
  `regenerateOwnSpore` + Embedding-Felder, `embedContentVector`/Contextual-Chunking (03).
- **Verträge unberührt:** PROTOCOL_VERSION 0.1 · DB_VERSION 4 · PROVIDER_MIN_MATCH 0.80.
  Alt-Dateinamen bleiben, nur Inhalt = Kanon. Kein PII.
- **Bewusst unberührt:** SBK-Ein-Datei-Spiegel `andock.html`/`mycelknoten.html` (eigene
  sha-Guard, Kanon-Quelle = Sages Ein-Datei-Tools, nicht `src/modules`) → Folge-Schritt bei Bedarf.

**Damit ist der Identitäts-Isolierungs-Rollout netzweit 11/11.** Offen: **Klaus-Sichttest**
(eigene stabile nodeId je App + Handshake ✓) läuft post-Merge auf den deployten Seiten
(GitHub Pages von `main`, „erst mergen, dann sieht Klaus es"). PLAN A3 (Medium-Härtung) bleibt.

## 2026-07-11 · Identitäts-Isolierung — Modul-01-Härtung (dbSuffix-Re-Point) + Migration (voller Fix, Klaus' Wahl)

**Rolle:** Bausitzung (Brief `BRIEF_IDENTITAETS_ISOLIERUNG_MODUL01_MIGRATION.md`). Freibrief galt;
Klaus hat ausdrücklich den **vollen Fix** (Modul 01 + Migration) gewählt. Kern-Modul-Umbau
(Modul 01 = Speicher-Fundament) — headless dreifach abgesichert, DANN netzweit.

**Warum:** Der A3-Guard (unten) verhindert nur den *Verlust* der Identität, behebt die
*Kollision* nicht — nodeId `2zgB0…` wurde von zwei Apps geteilt (eine Identität im geteilten
Topf `sbkim`), Handshakes „Request-Signatur ungültig". Wurzel: `init()` ist init-once; ein
späterer `init({dbSuffix})` mit abweichendem Namen wurde blind abgewiesen → landete etwas ohne
Suffix zuerst im geteilten `sbkim`, blieb es dort.

**Gebaut — Teil 1 (Modul 01 `init` Re-Point):** ein Folge-`init({dbSuffix})` mit ABWEICHENDEM
Suffix wird nicht mehr blind abgewiesen. Ist die offene DB **identitäts-leer** (`sbkim_keys`
count 0) → Verbindung sauber schließen (`closeConnectionAndWait`), `dbPromise=null`, mit neuem
Suffix neu öffnen (sicheres Re-Point). Trägt sie Identität ODER Probe unsicher → weiter
fail-fast. `DB_VERSION` unberührt, gleicher/kein Suffix byte-gleich. `_meta.dbSuffixRepointPolicy
= "empty-safe"`.

**Gebaut — Teil 2 (`SbkimStorage.migrateIdentityFrom(oldDbName)`):** raw-IndexedDB-Kopie aller
`sbkim_*`-Stores (keys+spore+meta+identitäts-Stores) aus einer fremden DB in die aktive —
**nur fehlende Schlüssel** (kein Überschreiben). Fehlende Stores additiv via `ensureStore`.
Fail-soft (resolves immer Summary; sync-Wurf nur bei Bad-Arg). Identität isoliert UND behalten.

**Gebaut — Guard (Modul 23):** `repairAndReconnect` **migriert** im Alt-Fall die Identität aus
`sbkim` in die eigene Schublade und **löscht dann** den geteilten Topf (Kollision aufgelöst +
Identität behalten); scheitert die Migration / fehlt der Pfad → reiner Schutz als Fallback.
`ensureIdentity` (Modus A) migriert ebenfalls, bevor es eine neue Identität erzeugt. Rückgabe
um `migratedIdentity`, `_meta` um `hasMigrate` erweitert. Kern-Module 02/05/05b UNANGETASTET.

**Tests:** neu `smoke_pflege_01_repoint_migrate.mjs` **21/21** (Re-Point leer/mit-Identität/
gleicher-Suffix + Migration kopiert/kein-Überschreiben/fehlende-Quelle/gleiche-DB/Bad-Arg) ·
`smoke_bau23d_migrate.mjs` **22/22** (Migration erfolgreich→Topf löschen · noop/Wurf/kein-Pfad→
Schutz-Fallback · Schublade-trägt-Identität · ensureIdentity-Migrate · `hasMigrate`). Regress-frei:
bau23c 16/16, bau23 58/58, bau23_ui 32/32, bau23b_korpus 24/24, bau23b_query 23/23, bau02y 33/33,
pflege_01_fail_soft 8/8, versions_bump_race 6/6, slot-Pfade 05y/06y/07y/08y, query-relais 18/18,
bundle-drift **21/21**. `sbkim-bundle/modules/{01,23}` byte-1:1 mitgezogen.

**Netzweiter Rollout ERLEDIGT für 9 Endknoten** (byte-1:1 Modul 01 + 23 aus dem Kanon, je eigener
PR gemergt, SW-Cache gebumpt wo cache-first, Repo-Tests grün): **Kimseek** (#7, 4/4) · **Kimboard**
(#7, 5/5) · **Mein-Mixarium** (#110, 14/14, md5-Mirror grün, sw-v49) · **Tomys-Hub** (#84, tomy-hub-v6)
· **family-project** (#49, smoke_spore 6/6, sw-v13) · **Mein-Rezeptbuch** (#298, 13/13, mrz-v36) ·
**Jasons-Tresor** (#115, 59/59, 2 Modul-01-Kopien) · **Mein-Tresor** (#57, 53/53, 2 Kopien) ·
**BookLedgerPro** (#254, 2123/2123, v196). In jedem war Modul 01 == alter Kanon → sauberes Delta.

**Bewusst NICHT partiell gebumpt — Kim-Bell + SB-KIMTool-Point** (Entscheid dokumentiert, nicht
stillschweigend): ihr Modul 01 (`sbkim-storage.js`) ist zwar sauberes Alt-Kanon-Delta, aber ihr
**Modul 23 (`sbkim-rendezvous.js`) liegt ~237–239 Zeilen hinter dem Kanon** (fehlt u.a. die
Bau-23.B-Korpus-Kopplung, ist prä-A4). Ein 01+23-only-Bump auf Kanon wäre ein 237-Zeilen-Multi-
Versions-Sprung bei Modul 23, während Match/Spore/Anastomose alt bleiben → **Mischversions-Knoten**
(genau die im A3-Eintrag benannte Falle). Darum brauchen diese zwei einen **vollen Modul-Re-Sync**
als eigenen Durchgang (Brief `BRIEF_KIMBELL_SBK_VOLLER_RESYNC.md`). Architektur-tiefgreifend →
Klaus-Sichttest nach dem Re-Sync Pflicht.

**Sofort-Entlastung für Klaus (heute, ohne Rollout):** pro App EINMAL frische eigene Identität
erzwingen (Notfall-/„nur neu anmelden") + hart neu laden löst die Kollision pro App. **Browser-
Sichttest (jede App EINE eigene stabile ID, Handshake ✓ etabliert) wartet auf Klaus** — auf den
9 gemergten Apps läuft der Fix jetzt live nach hartem Neuladen.

## 2026-07-11 · A3 (Medium härten) — Identitäts-Wurzel: „Aufräumen" schützt jetzt die Identität (Weg A)

**Rolle:** Bausitzung (Brief A3 Medium-Härtung + Identitäts-Wurzel). Freibrief galt;
Weg-Wahl A von Klaus bestätigt („weiter mit dem Bau").

**Befund (aus dem Code verifiziert):** Das gemeldete Symptom „🧹 Aufräumen & neu anmelden
erzeugt eine neue Identität" hat seine Wurzel in Modul 01: `SbkimStorage.init()` ist
**init-once** (Z. 355–371) — der erste Aufruf beansprucht den DB-Namen **synchron und
endgültig**; ein späterer `init({dbSuffix})` mit abweichendem Namen wird **abgewiesen**
(`InvalidDbSuffixError`, in den App-Inits per `catch` verschluckt). Ruft also irgendetwas
`init()` **ohne** Suffix zuerst, landet die Identität im **geteilten** Topf `sbkim` (Modul 02
schreibt ausschließlich über `SbkimStorage`). `cleanupSharedOrigin()` löschte genau diesen
Topf → Identität weg → neue beim Neu-Anmelden.

**Gebaut (Modul 23, Kern 01/02/05 unangetastet):** `repairAndReconnect` ist jetzt
**identitäts-schonend**. Neue read-only IndexedDB-Probe `dbHasIdentity(dbName)` (öffnet lesend,
prüft nicht-leeren `sbkim_keys`, löscht eine evtl. angelegte Phantom-DB wieder). Modus B löscht
`sbkim` **nur**, wenn die eigene Schublade `sbkim_<suffix>` die Identität schon trägt; sonst
bleibt `sbkim` stehen (`cleanupSharedOrigin({deleteSharedDb:false})`) → kein Identitätsverlust,
keine ungewollte neue Identität. Im Zweifel (Probe-Fehler) fail-safe nicht löschen.
`newIdentity:true` erzwingt weiter die volle Reinigung. Rückgabe um `protectedIdentity` +
`identityNote` erweitert. Spam-Schutz (`underRateLimit` 6/min) + Karten-Frische
(`freshSec`-TTL + newest-per-name) waren bereits live verdrahtet — nur bestätigt.

**Tests:** neuer `smoke_bau23c_identity_protect.mjs` **16/16** (4 Fälle: im Topf→geschützt ·
eigene Schublade→gelöscht · newIdentity→volle Reinigung · nichts da→frisch). Regress-frei:
bau23 58/58, bau23_ui 32/32, bau23b_query 23/23, bundle-drift 21/21. `sbkim-bundle/modules/
23_rendezvous.js` byte-1:1 mitgezogen.

**Rollout 2026-07-11 ERLEDIGT für 9 von 11 Knoten** (je eigener PR gemergt): Kimseek, Kimboard,
Mein-Mixarium, Mein-Rezeptbuch, Tomys-Hub, Jasons-Tresor, Mein-Tresor, family-project (SW→v12),
BookLedgerPro (SW→v195, 2123/2123). Bei Kimseek/Kimboard den bereits roten Drift-Guard mitgeheilt.
**Kim-Bell + SB-KIMTool-Point** standen auf pre-A4-Baseline (Kim-Bell 9/13 Module älter) → brauchten
vollen Modul-Re-Sync (eigener Durchgang), kein 23-only-Bump. **✅ ERLEDIGT 2026-07-11** (voller
Re-Sync, PR #15 Kim-Bell + PR #104 SB-KIMTool-Point gemergt — siehe obersten PULS-Eintrag). **Rollout
damit netzweit 11/11.**

**Offen / nächster Schritt:** **netzweiter byte-1:1-Rollout** des neuen Modul 23 in die 10
Endknoten (Kim-Bell `sbkim-rendezvous.js`, Kimseek/Kimboard/Mixarium/family/Tomys
`23_rendezvous.js`, + Rezeptbuch/BLP/Tresor/Point) inkl. SW-Cache-Bumps wo cache-first —
eigener Folge-Durchgang. Optionale Vertiefung: Migration einer bereits im `sbkim` liegenden
Alt-Identität (bzw. Modul-01-Härtung für nachträglichen Suffix) + NIP-09-Retraktion eigener
Alt-Präsenz-Karten. **Browser-Sichttest (wiederholtes „Aufräumen" behält EINE Identität) wartet
auf Klaus.**

## 2026-07-10 · ⭐⭐ MEILENSTEIN GESCHLOSSEN — bidirektionale Cross-Knoten-Suche LIVE beidseitig + Rendezvous-Härtung netzweit

**Der große Punkt.** Die volle **bidirektionale, server-lose Cross-Knoten-
Bedeutungs-Suche** ist in Klaus' Browser **live in beide Richtungen** bewiesen
(Splitscreen, beide deployte `main`, Relais `wss://relay.family-projekt.de`):
- **Sage → Mixarium:** „Cocktails mit anderen Waldfrüchten" → 5 Drinks aus
  Mixariums Buch (Tropical Creamwave 0.83 …), 39 s.
- **Mixarium → Sage:** „wer weiß was über Pilze" → 4 Module aus Sages Bibliothek
  (Reputation/Membran/Heterokaryose/Match), 0,5 s.

Damit ist die in `MEILENSTEIN_SEMANTISCHE_SUCHE.md` als „noch nicht end-to-end
gezeigt" geführte Hälfte **geschlossen** (Doc + CLAUDE.md-Tafel nachgezogen).

**Was den Durchbruch möglich machte — Rendezvous-Härtung (Modul 23 + UI):**
Klaus' Mycel-Karte + Analyse-JSON zeigten die Ursache der Fehlversuche:
wiederholtes „🧹 Aufräumen & neu anmelden" hinterlässt Alt-Identitäten, deren
Präsenz-Kärtchen ~30 min weiterleben → die Frage zielte auf eine **verwaiste,
nicht-lauschende ID** → Timeout. Fix:
- **`discover()` zeigt pro Knoten-NAME nur die neueste Karte** (`collapseByName`,
  Default an) — tote Alt-Kärtchen verschwinden, „Fragen" trifft die lauschende ID.
- **`enableAnswering()` heftet beim Einschalten eine frische Karte** unter der
  lauschenden ID ans Brett.
- **Flying-Widget:** „Mit dem Netz verbinden" frei verschiebbar (Kopfzeile) +
  „–" minimierbar, Position gemerkt (Klaus' Wunsch, verdeckte sonst die Seite).
- **Mycel-Karte** läuft als eigene installierbare PWA (`…github.io/mycel-karte/`).

Smokes: `smoke_bau23_rendezvous` **58/58** (Probe 6b „Mixarium ×2 → newest-per-
name"), 23_ui 32/32, bau23b 23+24, Bundle 21. **Netzweit ausgerollt** (byte-gleich,
je eigener PR): Sage + Mixarium + Rezeptbuch + Jasons-Tresor + Mein-Tresor +
Tomys-Hub + family-project + BookLedgerPro + Kimboard + Kimseek = **10 Knoten**
(SW-Bumps Kimboard v3/Kimseek v3). Kern 02/05/05b + 0.80-Riegel unberührt.

**Rest-Grenze (ehrlich):** die Antwort kommt zuverlässig nur, wenn der Antworter-
Tab **vorn + wach** ist (Handy/Tablet drosseln Hintergrund-Tabs); Wiederhol-Frage
auf gealterte Karte → „Visitenkarte veraltet". **Nächster Schliff:** bei
veralteter Karte automatisch neu lesen + einmal nachfragen (Teil von A3).

## 2026-07-10 · A4 Teil 1 — Ausschluss-/Negations-Filter (Bau 04.I): „alkoholfrei" / „ohne Erdbeeren" filtern wirklich

**Klaus' Live-Befund nach A2:** Die semantische Suche liefert bei „alkoholfreies
Erfrischungsgetränk" auch Drinks mit Wodka, und ein Allergiker, der „ohne Erdbeeren"
sucht, bekommt trotzdem Erdbeer-Rezepte oben. Grund: **Ähnlichkeit ist kein
Constraint.** Der Cosinus rankt einen Erdbeer-Drink NAH an „Erdbeere", auch wenn man
ihn ausschließen will; „alkoholfrei" nennt eine **Klasse** (der Wodka steht in der
Zutatenliste, nicht im Fragetext).

**Gebaut (Modul 04, deterministisch/offline, KEIN LLM):**
- `parseExclusions(text)` — liest Verneinungen: „ohne X", „kein(e) X", „X-frei"
  (zuckerfrei/laktosefrei), „allergisch gegen X", Alkohol-Klasse („alkoholfrei",
  „ohne Alkohol", „alcohol-free", „non-alcoholic", „virgin"), EN „without/no X";
  mehrere Begriffe („ohne Erdbeeren und Himbeeren") werden alle erfasst.
- `contentExcluded(text, ex)` / `applyExclusions(cands, ex, getText?)` — filtert
  Kandidaten deterministisch über ihren Inhalt (Alkohol-Lexikon per Wortgrenze,
  freie Begriffe per Stamm-Teilstring).
- `queryLocal(text,k,{exclude:true|<ex>})` filtert **VOR** dem Ranking. Ohne
  `exclude` **byte-gleich**; `PROVIDER_MIN_MATCH` + Andock-Riegel (Modul 05)
  **unberührt** (der Filter entfernt nur, senkt keine Schwelle).

**Live verdrahtet:** Modul 22 (Widget-Suche — einmal aus der Original-Frage geparst,
konsistent über Multi-Query-Varianten) + Modul 23 (Antworter auf fremde Knoten-Fragen).

**Tests:** `smoke_bau04i_exclusions.mjs` **34/34** grün (beide Klaus-Fälle bewiesen);
regress-frei: 04c 45, 04d 68, 04f 32, 04g 36, 22 260, 22f 17, 23 55, 23b 23,
Bundle-Connect 21, Standalone-Drift 49 — alle grün. Byte-Kopien
`such-tool/modules/04+22`, `sbkim-bundle/modules/04+23` mitgezogen (Drift-Guard grün).

**Netzweiter Rollout ERLEDIGT (2026-07-10, je eigener PR gemergt):** A4 + A2-Härtung II
byte-gleich in **10 Knoten** — Mixarium, Rezeptbuch, Kimboard, Kimseek, Tomys-Hub,
family-project, BookLedgerPro, Jasons-Tresor, Mein-Tresor, SB-KIMTool-Point (such-tool)
— plus Sage-Kanon. Bei den weit zurückliegenden Kopien (BLP/Tresor/SBK) zugleich voller
Modul-Sync auf `main` (reine ältere Sage-Kopien, keine App-Modifikation; BLP `node
tests/run.mjs` 2123 grün). SW-Cache-Bumps wo cache-first (Kimboard v2/Kimseek v2/BLP
v194/SBK such-tool v2). **„Im Netz anmelden" damit netzweit aktualisiert** (A2-Härtung II
reiste in jedem 23-Update mit). **family-project-Website geprüft:** keine Links zu alten/
toten Tools (Sage-Einladung, Tomys-Hub/showcase, mycel-karte — alle aktuell).

**Pinnwand bewusst NICHT** (Architektur-Merke): Ausschluss-Filter gehört auf Korpus-SUCH-
Flächen (entfernt Kandidaten), nicht auf die Q&A-Thread-Sortierung der Pinnwand („nichts
wegfiltern" — jede Antwort bleibt sichtbar, Verneinung erledigt dort der KI-Richter).

**Offen:** Browser-Sichttest (Klaus, live an Sage/Mixarium); **A4 Teil 2** KI-Richter
B3 (Eignung/Sicherheit, Hund-Katze-/Permethrin-Fall).

## 2026-07-10 · ⭐ A2 LIVE GRÜN — erster server-loser Cross-Knoten-Frage→Antwort-Lauf (Sage ↔ Mixarium)

**Meilenstein (Klaus' Browser).** Sage fragte „Alkoholfreies Erfrischungsgetränk" → **Mein-Mixarium
antwortete aus SEINEM eigenen Buch** mit 5 bedeutungs-sortierten Drinks (Tropische Kokostraum-Bowl
„Alkohol frei" 0.86 … Tropical Creamwave 0.85), server-los übers Relais `wss://relay.family-projekt.de`
in **10,7 s**, beidseitig „✓ ANDOCK ETABLIERT". Damit ist **A1 + A2** der Plan-Liste live bewiesen
(`docs/PLAN_SEMANTIK_KRYPTO.md`).

**Was den Durchbruch möglich machte (alles heute):**
1. **Saubere, getrennte Sporen** — der ganze netzweite `saubere-netz-anmeldung`-Rollout (eigene
   Schublade + Modus A/B in allen 12 Knoten). Ohne saubere Identität lief A2 vorher ins Leere.
2. **A2-Härtung II** (PR #575 Sage + #104 Mixarium): der Antworter **wärmt Modell+Korpus beim
   „💬 Antworten: an" im Hintergrund vor**, Frage-Timeout 15 s → 60 s. Vorher: „Keine Antwort in 15 s",
   weil Mixarium sein ~30-MB-Modell erst bei der ersten Frage lud.
3. **Inhalt-zuerst-Reihenfolge** (Klaus' Befund → **Browser-Lehre 12**): erst Buch füllen, dann Spore
   erzeugen/anmelden — sonst steht ein leerer Knoten im Raum.

**Ergebnis-Ehrlichkeit:** die Trefferliste ist **bedeutungs-sortiert** (semantisch nah an „alkoholfrei
+ erfrischend"), **kein harter Alkohol=0-Filter**. Treffer 1 ist explizit „Alkohol frei"; 2–5 (Sunrise
Bowl, Kräuter-Nektar, Raspberry Cooler, Creamwave) sind dem Namen nach plausibel alkoholfrei, aber
nicht garantiert. Ein garantierter Alkohol-frei-Filter wäre **Plan-Punkt A4 (KI-Richter Sicherheit/
Eignung)** — natürlicher nächster Schritt.

**Offen / nächste Schritte:** A2-Härtung II in die übrigen Knoten nachziehen (byte-gleich); dann A3
(Medium härten) / A4 (KI-Richter, u.a. harter Alkohol-frei-Filter) / A5 (Hybrid+Multi-Query-Rollout).

## 2026-07-10 · A1-Härtung — Korpus-leer-Falle im Frage→Antwort-Pfad (Modul 23) abgesichert

**Rolle:** Bau-Sitzung (Freibrief gilt). **Branch:** `claude/a1-query-answer-security-qa26ts`.
Umsetzung von Schritt 1 aus `BRIEF` A1 (2026-07-10).

**Ehrlichkeit zuerst — was A1 wirklich ist:** A1 war headless bereits ~90 % gebaut (Bau 23.B,
2026-07-06), nur über einen besseren Weg als der Plan-Text sagte. **Der Netz-Transport für
„Frage → Antwort über das Netz" lebt in Modul 23** (`enableAnswering`/`askNode`, Tag `sbkim-qry`),
NICHT in Modul 15 `op:"query"` (das ist der Same-Browser-Zwilling, kein Netz-Pfad). Plan +
Karte im PLAN_SEMANTIK_KRYPTO.md sind entsprechend korrigiert; A1 headless-fertig, Live = A2.

**Der eine echte Riss (behoben):** die **Korpus-leer-Falle**. `enableAnswering()` beantwortet
eine Frage über `queryLocal` — echte Treffer gibt es aber nur, wenn Modul 04 vorher einen lokalen
Korpus registriert bekam (`setLocalCorpus`). Bisher tat das **ausschließlich das Such-Widget
(Modul 22) lazy bei der ersten Widget-Suche** → wer „💬 Antworten" AN-schaltete, aber nie selbst
suchte, antwortete mit **leerer Liste trotz vorhandener Daten** (live zugeschlagen, siehe
2026-07-02-Eintrag).

**Was gebaut (headless, per Freibrief):**
1. **Korpus-Kopplung gehärtet (Modul 23):** neue Konfig `prepareCorpus` (app-eigener async-Provider);
   `enableAnswering()` koppelt den lokalen Korpus jetzt **aktiv** an Modul 04 (`ensureAnswerCorpus` →
   `setLocalCorpus`), unabhängig davon, ob je eine Widget-Suche lief. Konsequent **fail-soft** (ohne
   Provider / ohne `setLocalCorpus` / bei Provider-Fehler → ehrlich leer, kein Bruch), idempotent,
   rein lokal. Neue `_meta.hasPrepareCorpus`/`answerCorpusEnsured`. **Kern-Module 02/05/05b unangetastet,
   0.80-Riegel + PROTOCOL_VERSION „0.1" unberührt, kein PII.** UI-Modul (`23_rendezvous_ui.js`) reicht
   `prepareCorpus` durch; `sbkim-init.js` verdrahtet einen **gecachten, geteilten** Korpus-Provider
   (`sageEnsureSuchkorpus`) für Modul 22 UND Modul 23 → kein doppelter ~30-MB-Modell-Bau.
2. **Byte-Kopien** `sbkim-bundle/modules/23_rendezvous.js` + `23_rendezvous_ui.js` mitgezogen (Drift-Guard grün).
3. **Neuer Smoke** `tests/smoke_bau23b_korpus.mjs` **24/24** — beweist die Falle (leer vor AN) + Heilung
   (echte SAGE_SUCHKORPUS-Treffer nach AN, auch ohne Widget-Suche) + End-to-end askNode + drei Fail-soft-Pfade.
4. **Panel 23** in `tests/manual_check.html`: Knopf „💬/❓ Antworten AN + Frage (Korpus-Kopplung 23.B)" —
   zeigt Klaus die Heilung im Browser (Knopf statt Konsole).
5. Plan A1 abgehakt (headless) + Modul-Referenz korrigiert; dieser PULS-Eintrag.

**Smokes einzeln grün (ehrlich):** `smoke_bau23b_korpus.mjs` 24/24 (neu), `smoke_bau23b_query.mjs` 23/23,
`smoke_bau23_rendezvous.mjs` 55/55, `smoke_bau23_rendezvous_ui.mjs` 32/32, `smoke_bundle_connect.mjs` 21/21.
⚠️ `smoke_query_ueber_relais.mjs` **nicht ausgeführt** — braucht `fake-indexeddb`, in dieser Sandbox
nicht installiert (Sage hat keine package.json/node_modules). Umgebungs-Lücke, **nicht** von dieser
Änderung berührt; auf einer Node-Umgebung mit dem Paket läuft er wie zuvor.

**Offen / nächster sinnvoller Schritt:**
- **A2 (Live, zwingend Klaus):** zwei Apps über `wss://relay.family-projekt.de` — eine fragt „kuchen",
  die andere hat Antworten AN → bedeutungs-sortierte Treffer aus fremdem Inhalt. Relay in der Sandbox
  unerreichbar. Vorschlag Sage ↔ Mein-Mixarium (beide fahren Modul 23 live). Brief liegt.
- **Rollout der Härtung** (byte-gleich) in die anderen Modul-23-Apps (MR/MM/family) + dort `prepareCorpus`
  im Rendezvous-Init verdrahten — Folge-Schritt (diese Sitzung: Sage + Bundle).

## 2026-07-08 · Mycel-Karte v1.4 — Nach-Fusion (Klaus' Durchspiel-Befund: namenlose Knoten-Pillen)

**Klaus' Durchspiel-Lauf mit v1.3:** Fusion wirkt (keine Namens-Zwillinge mehr),
ABER zwei namenlose Pillen „Knoten SAri-w…"/„Knoten bGH3UB…" blieben stehen —
das sind die lebenden IDs von Sage/BLP, die über den KANAL (Handshake) ankamen,
BEVOR das Relais ihre Visitenkarte lieferte; v1.3 fusionierte nachträglich nicht.
**Fix v1.4 `migrateLiveNode()`:** trifft der Name später ein, wandert die
namenlose Pille samt Fäden (heat/active gerettet, Duplikat-Kanten verschmolzen)
restlos in die Seed-Pille; liveIdMap wird umgezogen. Headless-Browser-Test am
exakten Klaus-Szenario grün (2 namenlose Pillen → 0, Faden mitgewandert).
**Weitere Durchspiel-Befunde eingeordnet (kein Karten-Bug):** (1) Mixarium meldet
sich korrekt als „Mein Mixarium" an (sbkim-init.js) — „Mixarium als Rezeptbuch"
war Alt-Stand vor v1.3 bzw. die namenlose-Pillen-Verwechslung. (2) „Wer ist im
Raum zeigt meist nur Sage+BLP": Visitenkarten altern (30-Min-Frische) und die
EIGENE Karte wird nie gelistet — „Nur neu anmelden" frischt auf; Verhalten,
kein Verlust. (3) family-projekt.de: der Verbinden-Knopf sitzt auf der
Unterseite netzwerk.html (Nav „Netzwerk"), Domain und Repo sind dieselbe Seite.
**Analyse-JSON:** liegt in Klaus' Downloads — Sitzung kann sie erst lesen, wenn
Klaus sie in den Chat anhängt oder in den Obsidian-Vault legt (Git-Sync).

## 2026-07-08 · Mycel-Karte v1.3 — Namens-Fusion gegen Doppel-Pillen + Analyse-Rekorder 🔬

**Klaus' Live-Relais-Sichttest GRÜN mit Befunden** (7 Screenshots): Relais an,
echte „Hier bin ich"-Karten + Handshakes sichtbar (Ereignisse bis 48) — ABER
Doppel-Pillen („Mein Rezeptbuch"/„Mein Mixarium"/„BookLedgerPro" je 2×,
„Sage-Protokoll" neben Seed „Sage") und der aktive Cluster hing neben dem
statischen Stern. **Ursache:** v1.2 legte für jede lebende nodeId eine NEUE
Pille an, statt sie mit der Seed-Pille zu verschmelzen; der 30-min-Nachlauf
des REQ holte zudem alte Anmeldungen mit frischen IDs nach.
**Fix v1.3:** (1) **Namens-Fusion** — Presence-nodeName wird normalisiert auf
die Seed-Pille abgebildet (`SEED_ALIASES`), lebende IDs werden Aliasse EINER
Pille (Anzeige „×N" bei mehreren, z.B. Tablet+Handy); `liveIdMap` löst auch
Handshake-IDs auf → Fäden glühen jetzt an den richtigen Seed-Kanten
(Sage↔Rezeptbuch statt Zwillings-Cluster). Unbekannte Namen bekommen weiter
ehrlich eine eigene Pille. (2) **🔬 Analyse-Rekorder** (Klaus: „ich spiele alles
durch und du schaust zu"): Kopfleisten-Knopf Start/Stopp; zeichnet ALLE Roh-
Ereignisse auf (Relais/Kanal/Fenster/Fusion-Entscheidungen/Handshake-Auflösung
+ Start/Stopp-Schnappschüsse von Knoten/Kanten/liveIdMap); Stopp lädt
`mycel-analyse-<zeit>.json` herunter → Klaus schickt sie der Sitzung zur Auswertung.
**Headless-Browser-Test grün:** Fusion (3 bekannte Namen → 0 Zwillinge, ×2-Alias,
Fremd-App bekommt eigene Pille), Handshake landet an Seed-Kante, Rekorder-Download
mit Schnappschüssen, 0 Seitenfehler. **Klaus' Durchspiel-Lauf mit Rekorder steht aus.**

## 2026-07-08 · Mycel-Karte v1.2 — Relais-Lauscher 📡 + App-Leiste (Klaus' Befund: „Karte sieht meine Aktionen nicht")

**Klaus' Sichttest v1.1 GRÜN** (Demo, Optik, Themen). Sein Folge-Befund: Aktionen in
Andock-Tool/Suche/Pinnwand erscheinen nicht auf der Karte. **Diagnose (ehrlich):**
Knoten unversehrt (diese Sitzung hat keine App angefasst; Identitäten liegen in
Klaus' Browser-IndexedDB). Die Karte lauschte nur auf BroadcastChannel (gleiche
Origin, gleicher Browser) — aber Rendezvous/Modul-23-Andocks + Pinnwand laufen
übers NOSTR-RELAIS, und family-projekt.de ist eine andere Origin. Das Ohr saß
am falschen Kanal.
**Fix v1.2:** (1) **📡 Relais-Knopf** in der Kopfleiste — NUR LESEN, nutzer-
ausgelöst (Pilz-Werkzeug Schicht 2, kein Auto-Start = keine Pulsation): WebSocket
zu `wss://relay.family-projekt.de`, REQ kinds:[1] #t: sbkim-rdv/-anastomosis/
-anastomosis-reply/-query/-query-reply, since −30 min. Presence-Karten →
Knoten erscheint mit echtem nodeName + Puls; Handshakes → Kanten-Flash/aktiver
Faden; fail-soft (Relais weg → Hinweis, Karte läuft weiter). (2) **App-Leiste**
im Regler-Panel: 6 Mycel-Apps nebeneinander öffnen (je _blank) mit Hinweis,
in jeder App „🌐 Mit dem Netz verbinden" zu drücken — das „Hier bin ich" bleibt
bewusst Handarbeit (Verfassung: kein Auto-Funk beim Laden).
**Headless-Browser-Test grün:** App-Leiste 6/6 _blank, Relais-Fail-Soft (Sandbox
blockt wss — Label fällt sauber auf „Relais aus" zurück, 0 Seitenfehler), Karte
danach voll bedienbar. **Live-Relais-Sichttest wartet auf Klaus** (Sandbox kann
das echte Relais nicht erreichen — bekannte Grenze, siehe Modul 05b Kopf).

## 2026-07-08 · Mycel-Karte v1.1 + echter Browser-Test + Sage-Page-Knopf + PWA-Gründung

**Getan (Freibrief, Fortsetzung):** (1) **v1.1 der Karte** (PR #548): family-Themen
◐ Dunkel/Neon/Hell in der Kopfleiste (Farbwelten 1:1 aus family-project), Partikel-
Hintergrund mit Parallaxe/Funkeln (ohne three.js), Fäden bei etabliertem Handshake
dauerhaft kräftig in Akzentfarbe (heat-Puls bei Verkehr). (2) **Echter Browser-Test
(headless Chromium/Playwright)** fand die Wurzel von Klaus' DeX-Befund „Container
passt sich nicht an": `<canvas>` mit `inset:0` dehnt sich als replaced element NICHT —
Fix `width/height:100%` + `fitCanvas()`-Wächter pro Frame (DPR-Wechsel beim
Monitor-Umzug). Re-Test grün: 900→1700px sofort angepasst, Themen schalten, Probelauf
läuft, 0 Seitenfehler. (3) **Sage-Page-Knopf**: goldene Pille „🍄 Mycel-Live-Karte
öffnen ↗" unter der Modul-Topologie (Klaus' Platzwahl), `target=_blank` fürs
DeX-Zweitfenster. (4) **PWA-Gründung** in Klaus' neuem Repo `mycel-karte` (privat):
Karte + Manifest + SW (cache-first, relativ = umbenennungs-sicher) + generiertes
App-Icon + README mit Markt-Vision (family-project-App-Markt, nummerierte PWAs)
und Umbenennungs-Checkliste; Stand v1.1 nachgezogen (SW v2). **Klaus' Sichttest
der v1.1 + PWA-Installation stehen aus.**

## 2026-07-08 · Sichttest-Nachzug Mycel-Live-Karte: Pillen auf Obsidian-Maß (Klaus' Befund, DeX)

**Klaus' Sichttest (DeX-Chrome, live-deployte Seite): Karte läuft** — Kräfte-Graph, Regler,
Probelauf (Demo-Knoten schwebte korrekt herein) live bestätigt; ein anfängliches
Abschneide-Bild war laut Klaus ein DeX-Browser-Darstellungsproblem (Vollbild sauber).
**Befund:** Pillen in der Grundeinstellung zu groß — das Netz wird wachsen.
**Fix (dieser Nachzug):** Pillenradius Hub 20→9 / Knoten 13→5 (Obsidian-Maß), Labels
10px/dezenter, Fäden 0.8px, Halo/Ringe schlanker, SPRING_LEN 150→115 (kompakter),
Größen-Regler jetzt bis 3× (Spielraum nach oben), Start/Zurücksetzen zentriert
via `centerView()`. Headless: node --check grün. **Re-Sichttest wartet auf Klaus.**
**Parallel:** Klaus' neues Repo `mycel-karte` (privat) für die eigenständige
Mycel-Karten-PWA angelegt — Bau läuft in dieser Sitzung, Vision: Eingangs-App zum
family-project-App-Markt (nummerierte PWAs). Doku dort im README.

## 2026-07-08 · Bau Mycel-Live-Karte (`mycel-karte/`) — Klaus' Obsidian-Graph-Inspiration (Freibrief)

**Rolle:** Bau-Sitzung (Fortsetzung der Obsidian-Skills-Sitzung). **Branch:** `claude/obsidian-skills-integration-8pg6xy`. **Freibrief:** Klaus ausdrücklich („lege sofort los, alle Freiheiten, selbstständig merken/umsetzen").

**Auslöser:** Klaus sah im Obsidian-Graphen seines neuen Vaults dasselbe Knoten-und-Kanten-Muster wie im Mycel und wünschte: dieselbe lebendige Darstellung für Sage — mit Reglern (Pillengröße, Farben), Ton bei Aktionen (laut/leise), Vollbild, eigenes Fenster für den Zweitbildschirm (DeX), um z.B. Mixarium ↔ Rezeptbuch live agieren zu sehen.

**Gebaut:** `mycel-karte/index.html` — eigenständige Einzeldatei-Seite (kein Build, kein CDN, keine Fremd-Bibliothek; eigene Kräfte-Physik + Canvas):
- **Kräfte-Graph** mit den 8 bekannten Netz-Knoten (statischer Samen aus PULS/NETZ-STAND, ehrlich beschriftet) + bekannten Andock-Kanten; Pillen ziehbar, Rad/Pinch-Zoom, Hub verankert.
- **Lauscht NUR (Empfangsmodus, reine Anzeige, gatet nichts):** Fenster-Events `sbkim:alive/handshake/fremd-alert/postmessage/nostr-listening` + BroadcastChannel `sbkim` (`SBKIM_ANASTOMOSE_REQUEST/RESPONSE` mit from/to-Flash) + `sbkim-membrane`. Da alle Apps auf derselben Origin (`lausiklauskn-png.github.io`) laufen, sieht die Karte echten Cross-Tab-Verkehr. Lebende nodeIds werden als neue Pillen „Knoten abcdef…wxyz" ergänzt (ehrlich gekürzt, kein Namens-Raten).
- **Regler-Panel:** Pillengröße (0.5–2×), Ton-Lautstärke 0–100 (WebAudio-Töne: Anfrage-Tick, Handshake-Zweiklang, Ablehnungs-Brummen; 0 = stumm, erst nach Nutzer-Geste), drei Farbwähler (Pillen/Fäden/Hintergrund), Zurücksetzen, ⛶ Vollbild. Einstellungen persistiert (`localStorage sage_mycel_karte_settings`).
- **🎬 Probelauf-Knopf:** simulierte Ereignis-Sequenz, IMMER sichtbar als „PROBELAUF — simuliert" gebadged + gestrichelte Log-Einträge (Ehrlichkeit: kein Fake-Live).
- **Ereignis-Protokoll** unten links (letzte 40, aria-live), Kanal-Lampe + Ereignis-Zähler im Kopf.

**Verifiziert (headless):** Script-Block `node --check` fehlerfrei; Mini-Logik-Smoke 4/4 grün (edgeKey symmetrisch, hexToRgb + fail-soft, Live-ID-Kürzung). **Klaus' Browser-Sichttest UNGEPRÜFT — wartet auf Tablet-Lauf** (`https://lausiklauskn-png.github.io/Sage-Protokol/mycel-karte/` nach Merge).

**Bewusste Entscheidungen (Freibrief, dokumentiert):** (1) Eigenständige Seite statt Sage-Page-Einbau — der Mount auf der Sage-Page (Klick → eigenes Fenster) ist eigener Folge-Schritt mit eigenem Brief (`BRIEF_MYCEL_LIVE_KARTE_FOLGE.md`), um `index.html` nicht im Nebenscope anzufassen. (2) Handgebaute Physik statt vendoriertem D3 — ~80 Zeilen, hält die Einzeldatei-Disziplin. (3) Obsidians Graph-Code NICHT kopiert (proprietär) — nur das offene Force-Directed-Prinzip.

**Offen / nächste Schritte:** siehe `docs/sessions/BRIEF_MYCEL_LIVE_KARTE_FOLGE.md` (Sichttest → Sage-Page-Mount → Live-Cross-App-Beweis mit Karte im Zweitfenster).

## 2026-07-07 · Werkzeug-Übernahme: Obsidian Agent-Skills nach `.claude/skills/` (Klaus' Auftrag)

**Rolle:** Pflege-Sitzung (kein Modul-Code). **Branch:** `claude/obsidian-skills-integration-8pg6xy`.

**Getan:**
- Die fünf Agent-Skills aus [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)
  (MIT-Lizenz, Steph Ango/@kepano) **byte-gleich kopiert** nach `.claude/skills/`:
  `obsidian-markdown` · `obsidian-bases` · `json-canvas` · `obsidian-cli` · `defuddle`
  (je `SKILL.md` + Referenz-Dateien). Lizenz mitgenommen (`.claude/skills/LICENSE-obsidian-skills`),
  Herkunft + Pflege-Regel in `.claude/skills/README.md`.
- **Wirkung:** Claude-Code-Sitzungen an diesem Repo laden die Skills automatisch und können
  damit Obsidian-Formate erzeugen/bearbeiten (Obsidian-Markdown mit Wikilinks/Callouts,
  `.base`-Datenbank-Views, `.canvas`-Karten, Obsidian-CLI, Web→Markdown via defuddle).
- **Verifiziert (in der Sitzung):** Skills real angewendet — Beispiel-`.md`/`.canvas`/`.base`
  erzeugt und nach den Skill-Checklisten validiert (Canvas-JSON: IDs eindeutig + Kanten
  aufgelöst; Base-YAML parsebar; alles grün). Beispiele gingen als Dateien an Klaus,
  **nicht** ins Repo committet.
- **Ziel-Wahl dokumentiert:** Klaus wollte zunächst ein neues eigenes Repo; das Anlegen
  scheiterte an GitHub-Rechten (403, Integration darf keine Repos erstellen). Klaus'
  Zweit-Entscheid per AskUserQuestion: **Sage-Protokol**.

**Kein App-/Modul-Code berührt** — reiner `.claude/`-Zugang + diese PULS-Zeilen.
`tests/manual_check.html` unberührt (keine Prüfung nötig, keine Code-Änderung).

**Offen / nächster sinnvoller Schritt:** Nichts blockiert. Optional später: Skills-Kopie
per Pflege-Sitzung aktualisieren, wenn kepano das Quell-Repo weiterentwickelt
(Pflege-Regel in `.claude/skills/README.md`).

## 2026-07-06 · Bau 23.B — Cross-Knoten-Frage (Knoten fragt Knoten) + Such-UX-Runde in den Endknoten

**Rolle:** Hauptsitzung (Freibrief gilt). **Branch:** `claude/semantic-search-judge-fix-bqx85p` (netzweit gleicher Name in Sage/MR/MM/family/WorkFlohs).

**Getan (alles headless getestet, per Freibrief selbst gemergt):**
1. **Bau 23.B — bidirektionale Bedeutungs-Suche end-to-end (Modul 23):** neue Flächen `enableAnswering`/`disableAnswering`/`askNode` — ein Knoten stellt einem anderen LEBENDEN Knoten eine Suchfrage server-los über das Relais (Tag `sbkim-qry`), der Gegenknoten antwortet mit Top-k seiner lokalen Bedeutungs-Suche (Modul 04 `queryLocal`, app-registrierter Korpus). Tafel zuerst (INTERFACES §1 Modul 23 § Bau 23.B). Verfassungstreu: Fragen nutzer-ausgelöst, Antworten = Antwortrecht (Default AUS, bewusster Schalter, nicht persistiert); Schutz: qid-Dedupe + Rate-Limit 6/min + k-Cap 5 + Text-Kappung 300. **v1 ehrlich offen: Zettel unsigniert** (Identitäts-Wahrheit bleibt beim signierten Handshake + 0.80-Riegel; Antworten advisory) — Signatur = notierter Folge-Schritt. Smoke `smoke_bau23b_query.mjs` **23/23** (zwei vm-Instanzen + Mock-Relais); Regression bau23 55/55 + bau23_ui 32/32. UI: Frage-Feld + „💬 Antworten: an/aus" + „❓ Fragen" je Raum-Karte. Byte-Kopien: sbkim-bundle + MR + MM (+UI) + family (Modul; heilt dort den alten 23er-Drift vor `relatednessForCards`). **Live-Beweis (zwei Apps, echtes Relais) wartet auf Klaus.**
2. **Endknoten-Such-UX (MR #289/#290 + MM #99/#100 + Folge, alle gemergt):** 💡-Sinn-Suche hat jetzt sichtbaren Lade-Hinweis („wird vorbereitet … ~30 MB") + Vorab-Laden beim Einschalten + Zähler „✨ N nach Bedeutung" + **💡-Sinn-Badge** an Nur-Bedeutungs-Treffern; **⚖️ KI-Richter opt-in** (nutzt vorhandenen App-Schlüssel `claudeKey9m`/`mistralKey9m` bzw. `mxkey9m`, fail-soft auf gratis). Modul 04 netzweit: `anthropic-dangerous-direct-browser-access`-Header im claude-Richter (sonst CORS im Browser; Sage #539). WorkFlohs: Suchleiste jetzt auch im Kunden-Tab (Mein-WorkFloh #147 + Tomys-Hub #72, Parallel-Regel).
3. **Bestandsaufnahme aller 21 Session-Repos:** jede echte Sinn-Suche (Sage-Widget/Pinnwand, BLP, family-Markt, Point) hat bereits Lade-Hinweise; Muttis/Tresore = bewusst simple Textfilter; Kim-Repos leer. Nichts weiter zu übertragen.

**Befunde/offen:**
- **PULS.md ist >8000 Zeilen** — die 3000er-Schutz-Klausel ist gerissen; eigene Archiv-Pflege-Sitzung nötig (auslagern, nicht kürzen).
- Schnipsel-Mittel-Lead bleibt geparkt (dünne Marge 0.0188, Datenvertrag-Eingriff) bis das Netz mehr echte Knoten hat.
- Increment 2B (Widget-Schlüssel-Tresor + Auto-KI-Aufruf) + Increment 3 (Membran-Kopplung) = eigene Folge-Sitzungen (sicherheits-sensibel bzw. eigener Scope) — Brief liegt: `docs/sessions/BRIEF_BIDIREKTIONAL_LIVE_UND_INCREMENTE.md`.
- Klaus' Sichttests ausstehend: 💡/⚖️/Badge in MR+MM, Kunden-Suche WorkFlohs, **Bau 23.B live** (❓/💬 im Raum-Panel, zwei Geräte).

**Nachtrag 2026-07-07 — Discovery-Seite Schluss-Text (PR #543, gemergt):** Klaus fand den
Schluss-Bild-Text (`docs/discovery/index.html` § „Das gelebte Leben") als KI-geschrieben
erkennbar (er war die Bild-Generierungs-Beschreibung). Aus mehreren Chat-Vorschlägen hat
Klaus diesen Wortlaut freigegeben, 1:1 eingebaut: Überschrift „Wie tief das Leben verbunden
ist." + „Wer durch einen Wald geht, sieht viele einzelne Bäume, hört einen Bach, vielleicht
ein Tier. Was keiner sieht: die feinen Fäden, die das alles zusammenhalten." Reine
Text-Änderung, keine Byte-Kopien betroffen (grep leer). Sichttest = Lesen auf der Live-Seite.

## 2026-07-05 · Bedeutungs-Suche im normalen Suchfeld beider Endknoten (opt-in 💡, gratis/offline)

**Rolle:** Feature-Bau in den Endknoten-Apps (Klaus' Richtungswunsch). **Freibrief gilt.**
Klaus' Einwand nach dem 04.G-Fix: der Such-Nutzen gehöre **in das Suchfeld, das er
benutzt** (die Rezept-/Drink-Suche), nicht in ein verstecktes SBKIM-Tool — „damit ich
weniger suchen muss". Befund: das normale Suchfeld war reiner **Wort-Abgleich**
(`matchSQ` → `.includes`), fand also „Eierschecke" bei „Kuchen" NICHT.

**Gebaut (beide Apps identisch):** kleiner **💡-Schalter** (`#semBtn`) neben dem Suchfeld,
Default **AUS**, gemerkt in `localStorage` (Rezeptbuch `mrSemOn` / Mixarium `mxsem9m`).
AN = eine **semantische Suche** ergänzt Treffer nach **Sinn** (Modul 03 Embedding + Modul 04
`queryLocal({hybrid:true})`). `matchSQ` in `wordMatchSQ` (exakt, unverändert) + semantischen
Zusatz (`SEM_ON && SEM_IDS.has(r.id)`) getrennt. **Rein additiv/Inklusion** — Wortsuche
bleibt exakt + sofort, `alcAllowed`/Andock-Riegel/`PROVIDER_MIN_MATCH` unberührt, konsequent
**fail-soft** (jeder Fehler → reine Wortsuche).

**Effizienz-Kernentscheidung:** `embedPassage` cacht NICHT → der sbkim-init-Korpus-Provider
re-embeddet bei jedem Aufruf (langsam pro Tastendruck). Darum baut die App den Korpus **einmal
selbst** (`SEM_CORPUS`, gecacht, Signatur über die Rezept-id-Menge; ~30 MB Modell einmalig beim
ersten Einschalten) und reicht ihn per `options.corpus` an `queryLocal` — pro Suche wird nur die
**Anfrage** embeddet. Debounce 350 ms + Staleness-Guard (`SQ!==term`).

**Live:** Rezeptbuch **PR #288** (QC→`build.py`, `CACHE` mrz-v31→v32, index.html im SHELL-Precache)
· Mixarium **PR #98** (QC→index byte-identisch md5 `fdbd502…`, `SW_VERSION` v44→v45). Verifikation
headless: alle inline-`<script>` node --check sauber (Rezeptbuch 9/9, Mixarium 8/8), Semantik-Block
standalone node --check grün.

**Ehrliche Grenze:** das GRATIS-Netz wirft breiter und kann ohne den (opt-in) KI-Richter Lockeres
reinnehmen (0.80-Anisotropie-Boden, siehe LEHRE-Doc). Wortsuche bleibt exakt.

**Offen / nächster Schritt:** Klaus' **Browser-Sichttest** beider 💡-Schalter (fühlt es sich gut an?
Trennschärfe okay?). Danach je nach Rückmeldung: Sinn-Treffer-Kennzeichnung / strengeres Netz,
ODER KI-Richter (opt-in) an die App-Suche zum Schärfen, ODER RELATEDNESS_CENTER v2 (gratis).
Brief: `docs/sessions/BRIEF_NAECHSTE_SITZUNG_2026-07-05.md`.

## 2026-07-05 · Trennschärfe (Aufgabe 1): async-Provider-Bug in `queryLocalJudged` (Bau 04.G) gefixt

**Rolle:** Bau-/Fix-Sitzung (Branch `claude/cross-node-search-verification-nmt3bd`, von aktuellem
`main` #535). **Freibrief gilt.** Aufgabe 1 aus `BRIEF_NAECHSTE_SITZUNG_2026-07-02.md` (Trennschärfe
via opt-in KI-Richter).

**Prüf-Befund vor dem Bau (Klaus' Auftrag „prüf genau, wir sind schon weiter"):** Der Brief
empfahl, den KI-Richter in den Cross-Knoten-Antwort-Pfad einzubauen. Prüfung ergab: das ist
**schon gebaut** — `queryLocalJudged` (Bau 04.G, Strang A2) komponiert Vorfilter (`queryLocal`)
+ Richter (`hybridMatch`, opt-in/BYOK, fail-soft), ist exportiert, byte-kopiert (such-tool +
sbkim-bundle), im `op:"query"`-Empfänger von Modul 15 verdrahtet (`setQueryJudge`) und hat einen
Siegel-Aspekt. Kein Neubau nötig.

**Der echte Rest — ein LIVE-Bug (gefunden + gefixt):** `queryLocalJudged` löste den
registrierten Korpus-Provider **ohne `await`** auf (Z. ~1773) — exakt der async-Provider-Bug,
den PR #533 in `queryLocal` fixte, in der Schwester-Funktion 04.G aber übersehen wurde. Der
Cross-Knoten-Empfänger (Modul 15) übergibt `queryLocalJudged` nur die Richter-Config, **keinen
Korpus** → die Funktion nutzt den registrierten Provider, und der ist auf den Endknoten **async**
(baut den Korpus faul via Modul 03). Folge ohne Fix: ein Promise landet als Korpus in `queryLocal`
→ `InvalidCorpusError` → der Empfänger fällt auf eine **leere Fehler-Antwort** (`module-04c-query-failed`)
zurück. Heißt: sobald Klaus den KI-Richter live einschaltet, käme **nichts** statt geurteilter Treffer.

**Fix (rein additiv, Leitplanken unberührt):** `await` + try/catch (fail-soft parity mit
`queryLocal`) in `queryLocalJudged`, byte-1:1 in `src/modules/04_match.js` +
`such-tool/modules/04_match.js` + `sbkim-bundle/modules/04_match.js` (alle drei md5-gleich).
`PROVIDER_MIN_MATCH` (0.80) / Andock-Riegel (Modul 05) / PROTOCOL_VERSION unberührt.

**Tests:** Regressions-**Probe 8** (async Provider via `setLocalCorpus`, ohne `options.corpus`)
in `smoke_bau04g_query_local_judged.mjs` — vorher blind (alle Proben nutzten explizites `corpus:`).
Beweis geführt: gegen die un-gefixte Kopie wird Probe 8 rot (wirft), mit Fix **36/36 grün** (vorher 28).
Regressionsfrei: Drift-Guards such-tool 49/49 + sbkim-bundle 21/21, smoke_bau04c 45/45, 04d 68/68,
04f 32/32, 15b 35/35, 22 260/260, 22e 45/45, 22f 17/17.

**Endknoten-Rollout ERLEDIGT (gleiche Sitzung, Klaus-Freigabe „1"):** die Byte-Kopie
`sbkim/04_match.js` byte-1:1 aus der Sage-Quelle in **Mein-Mixarium (PR #97, SW mixarium-sw-v43→v44)**
+ **Mein-Rezeptbuch (PR #287, CACHE mrz-v30→v31)** nachgezogen, beide Branches sauber von `origin/main`
aufgesetzt (Rezeptbuch-Decoy-Falle umgangen). Diff je 0 zu Sage, await=2/non-await=0, Endknoten-Smokes
grün (Mixarium 14/14+7/7, Rezeptbuch 13/13+13/13), Mixarium index==QC md5 unverändert. Beide gemergt.

**Offen / nächster Schritt:** Klaus' **Browser-Sichttest** mit echtem Schlüssel — KI-Richter live
einschalten, „kuchen" → „Hühnerfrikassee" muss rausfallen. Der Fix greift jetzt auf allen drei
`main`-Deployments (Sage + beide Endknoten). Danach optional RELATEDNESS_CENTER v2 (gratis-Pfad).

## ✅ 2026-07-02 · MEILENSTEIN: Cross-Knoten-Antwort-Kette LIVE bewiesen (Klaus-Browser, Rezeptbuch)

**Rolle:** Bau-/Sichttest-Sitzung. Klaus hat die **komplette lokale Bedeutungs-Such-Kette
live in seinem Browser** (Rezeptbuch, Eruda-Konsole) bestätigt — der Endbeweis, den kein
Headless-Test liefern kann.

**Bewiesener Pfad (echte Daten):** `window.R` (47 echte Rezepte, via Live-Getter) →
`SbkimMatch.setLocalCorpus`-Provider baut den Korpus **faul** (Modul 03 e5-small,
384-dim, im Browser geladen) → `queryLocal("kuchen", {hybrid:true})` liefert **echte
Rezeptnamen** mit Score:
```
[MR-SBKIM] queryLocal-Korpus aus 47 Rezepten gebaut
TREFFER: Eierschecke 0.81 · Erdbeer-Joghurt-Torte 0.78 · Karottenkuchen 0.80 · Stollen 0.80 · Hühnerfrikassee 0.80
```
Damit sind **alle heute gebauten Teile live grün**: window.R-Getter, der `queryLocal`-
`await`-Fix (async-Provider), der Korpus-Provider, A1-Hybrid. Serverlos, im Browser.

**Weg dahin — drei Live-Befunde nacheinander gefixt (jeder nur im Browser sichtbar):**
1. Eruda-Blase versteckt → standardmäßig sichtbar gemacht (PR #91/#281).
2. `queryLocal` warf `Korpus muss ein Array sein, war: Promise` → **echter Vertrags-Bug**:
   async-Provider wurde nicht `await`et. Fix + Regressions-Probe 8c (PR #533/#92/#282).
3. Korpus „0 Rezepte" trotz `window.R.length`=70 → **alle 70 waren blank-Slots**; nach
   Rezept-Import 47 echte → Korpus baut korrekt. (Kein Bug — richtige Filterung.)

**⚠️ Ehrlich offen — Trennschärfe (Klaus' scharfe Beobachtung):** der Gratis-Cosinus hat
den bekannten Anisotropie-Boden ~0.80 — **„Hühnerfrikassee" landet bei 0.80 gleichauf mit
echten Kuchen**. Das Werkzeug **findet** die Kuchen (4/5 Treffer korrekt), kann Fremdes aber
nicht sauber **abweisen**. Trennschärfe ist die nächste Kalibrier-Baustelle (KI-Richter opt-in
/ RELATEDNESS_CENTER v2) — **Klaus-Entscheid 2026-07-02: erstmal so lassen, Meilenstein
sichern, Trennschärfe eigene Folge-Sitzung.** Passt zur LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.

## 2026-07-02 · Folge-Bau: window.R-Fix + Rezept-Korpus — Cross-Knoten-Antwort in beiden Endknoten funktional

**Rolle:** Bau-Sitzung (Branch `claude/sage-search-rollout-2tlm28`). Umsetzung der
Schritte 1–3 aus `BRIEF_KORPUS_WINDOWR_ENDKNOTEN.md` (Klaus-Auftrag „Folgebau 1,2,3").

**Behobene Lücke:** In beiden Endknoten lasen Korpus-Provider (+ Rezeptbuchs Domänen-Vektor)
`window.R`, aber `window.R` war **nie gesetzt** (top-level `let R` hängt nicht am window) →
Cross-Knoten-Korpus lief **live leer**. Der A1/A4-Empfänger antwortete daher trotz korrekter
Verdrahtung mit leerer Liste.

**Was gebaut (beide Endknoten, gemergt):**
- **Mixarium (PR #90):** `R` als LIVE `window.R` via `Object.defineProperty`-Getter (QC +
  `index.html` byte-identisch). Der bestehende Provider `buildMixariumQueryCorpus` (mit
  `text`-Feld seit PR #89) sieht damit echte Drinks. `SW_VERSION` v38→v39. Smoke
  `smoke_windowr.mjs` 7/7.
- **Rezeptbuch (PR #280):** derselbe `window.R`-Getter (QC → `build.py`-Rebuild) **+ neuer
  Rezept-Korpus-Provider** `buildRezeptbuchQueryCorpus` in `sbkim-init.js` (fehlte ganz):
  `{label, passageVec, text, anchorId}` aus Name+Geschmack+Zutaten+Kategorie, `text` für
  A1/BM25, lazy/fail-soft/Deckel 80/kein PII, Muster von Mixarium gespiegelt. `CACHE`
  mrz-v27→v28. Smoke `smoke_windowr_corpus.mjs` 13/13.

**Der Getter-Trick:** ein einmaliges `window.R = R` wäre stale (R wird beim Laden reassigned).
Der Getter `Object.defineProperty(window,'R',{get:()=>R})` schließt über die Bindung → liefert
immer das aktuelle R und repariert **alle** `window.R`-Leser (auch Rezeptbuchs `sampleContent`).

**Leitplanken:** `PROVIDER_MIN_MATCH` (0.80)/Andock-Riegel (Modul 05) unberührt, kein
PROTOCOL_VERSION-Bump, kein PII. Mixarium `index.html`==QC md5 verifiziert; Rezeptbuch
`index.html`==deterministischer build.py-Rebuild.

**⚠️ Offen — Klaus' Browser-Sichttest (Schritt 4, PFLICHT):** Von einem Knoten (Sage/
Rendezvous) eine cross-phrased Frage an Mixarium/Rezeptbuch stellen → kommen jetzt echte
Drinks/Rezepte bedeutungs-sortiert zurück? Erst dieser Live-Lauf beweist die Fütterung
(window.R populiert + ~30 MB Embedding). Bis dahin: headless grün, Live „ungeprüft".

## 2026-07-02 · KORREKTUR + Rezeptbuch-A1/A4-Rollout — „Rezeptbuch hat kein SBKIM" war FALSCH (Wrong-Branch-Artefakt)

**Rolle:** Bau-/Korrektur-Sitzung (Branch `claude/sage-search-rollout-2tlm28`). Auslöser:
Klaus' Hinweis, dass Rezeptbuch **immer wieder** falsch als „kein SBKIM" eingeschätzt wird.

**⚠️ Richtigstellung des Eintrags direkt darunter:** Die Aussage „Mein-Rezeptbuch trägt gar
kein SBKIM → nichts zu rollen" war **FALSCH**. Ursache — ein **wiederkehrendes Wrong-Branch-
Artefakt**: der auf GitHub eingestellte **Default-Branch von Mein-Rezeptbuch ist NICHT `main`**,
sondern ein toter **Vor-SBKIM-Branch** (`claude/recipe-book-app-update-fGP7B`, ohne `sbkim/`).
Automatisch angelegte Session-Branches (auch `claude/sage-search-rollout-2tlm28`) zweigen von
diesem Decoy ab und sind **bit-identisch** mit ihm → jede Sitzung, die den ausgecheckten Stand
liest, „sieht" kein SBKIM. **`main` trägt die volle SBKIM-Integration** (Module 00–08, 15, 16,
17, 18, 23, Briefkästen, Spore) — die **Modul-09-Migration hat längst stattgefunden**.

**Netzweite Lehre (verankert):** In `Mein-Rezeptbuch/CLAUDE.md` steht jetzt ganz oben eine
Pflicht-Regel „🚨 IMMER gegen `main` prüfen — der Default-Branch ist ein toter Decoy" (fetch
`origin/main`, Branch von `main` neu aufsetzen, nie gegen Default/Session-Branch urteilen).

**Was gebaut (Rezeptbuch, PR #279 gemergt) — additiv, fail-soft:**
- **Modul 04 byte-1:1 aus Sage** synchronisiert. Rezeptbuch stand auf Bau **04.A — OHNE
  `queryLocal`**. Der `op:"query"`-Empfänger (`15_membran.js`) rief also ein **fehlendes**
  `queryLocal` und antwortete stets `module-04c-not-available` — **echter Vertrags-Bug, jetzt
  behoben** + A1/A4-Fähigkeit (BM25/`queryLocalMulti`/`expandQuerySimple`) dazu.
- `15_membran.js` — fail-soft `queryWithInclusion` (A4 koch-eigene Synonym-Karte → A1 Hybrid-
  Multi → Cosinus) im Empfänger.
- `app-sw.js` CACHE `mrz-v26`→`mrz-v27`. `index.html`/QC unberührt (nur separate `sbkim/*.js`,
  Rebuild deterministisch identisch verifiziert).
- Headless-Smoke `Mein-Rezeptbuch/tests/smoke_rollout_a1a4.mjs` **13/13 grün**.

**⚠️ Offen (Folge-Bau, Klaus-Entscheid „jetzt mergen + Korpus als Folge-Bau, Mixarium mit
aufnehmen"):** Voll funktional wird die Cross-Knoten-Antwort erst mit einem **Rezept-Korpus**,
den `sbkim-init.js` noch **nicht** anlegt (`SbkimMatch.setLocalCorpus` fehlt). Dazu die
**latente `window.R`-Lücke**: `window.R` wird **nirgends zugewiesen** (top-level `let R`),
obwohl mehrere Stellen es lesen (auch der Domänen-Vektor `sampleContent`) → Korpus/Content
sehen zur Laufzeit `[]`. **Betrifft Mein-Mixarium gleichermaßen** (dessen Korpus-Provider,
2026-06-28 gebaut, liest ebenfalls `window.R` → vermutlich leerer Korpus live). Folge-Bau:
`window.R` sauber exponieren (Live-Getter, übersteht Reassignment) + Rezept-Korpus-Provider
in beiden Apps + Klaus' Browser-Test. Brief unten.

## 2026-07-02 · A1/A4-Rollout in die Endknoten — Mixarium gebaut+gemergt, Rezeptbuch+Pinnwand geprüft/begründet

**Rolle:** Bau-/Rollout-Sitzung (Branch `claude/sage-search-rollout-2tlm28`). Brief:
Rollout der App-Integration (A1 Hybrid + A4 Multi-Query, PR #528) in die Endknoten.
Freibrief gilt. **Kern-Befund:** die drei Rollout-Ziele haben sehr unterschiedliche
Ausgangslagen — nur eines trägt einen SBKIM-Such-Pfad, den A1/A4 verbessern.

**Investigation (die Voraussetzung fürs „prüfen ob einzubauen"):**
- **Mein-Mixarium** — trägt Modul 04 (`sbkim/04_match.js`, war stale bei Bau 04.D). Sein
  **einziger** SBKIM-Such-Pfad ist der **Cross-Knoten-Antwort-Empfänger** (`op:"query"` in
  `sbkim/15_membran.js`) + der Korpus-Provider (`sbkim/sbkim-init.js`). **Kein** nutzer-
  sichtbares SBKIM-Suchfeld (die Drink-Suche der App ist reiner Textfilter, nicht SBKIM).
  → A1/A4 gelten dem **Antwort-Pfad** (Mycel-Kern-Nutzen: Cross-Knoten-Suche). **ROLLOUT.**
- **Mein-Rezeptbuch** — ~~trägt gar kein SBKIM~~ **← FALSCH, siehe Korrektur-Eintrag oben
  (2026-07-02 Wrong-Branch-Artefakt).** Diese Aussage entstand, weil gegen den Session-/
  Default-Branch statt gegen `main` geprüft wurde. **`main` trägt volle SBKIM-Integration;
  Modul-09-Migration längst erfolgt. A1/A4 dort ausgerollt (PR #279).**
- **Pinnwand** (`pinnwand/`) — trägt Modul 03 (Embedding) + inline **whitened Cosinus**-
  Rangfolge + opt-in KI-Richter; **kein Modul 04**, **keine 0.80-Schwelle** (zeigt ALLE
  Einträge, nur sortiert). → A1s Gewinn ist **INKLUSION über einen Filter-Boden** — den es
  in der Pinnwand nicht gibt (nichts wird ausgeschlossen). A4 (Synonym-Varianten) dupliziert,
  was das reine Bedeutungs-Embedding schon leistet, und widerspräche der Pinnwand-These
  „Bedeutung über Stichwörter". → **Bewusst ausgelassen** (kein Nutzen, würde Design
  verwässern). Ehrliche Beschriftung (Cosinus=Rangfolge) steht bereits (PR #498).

**Was gebaut (Mixarium, additiv, minimal-invasiv) — PR #89 gemergt:**
- **A1** — `sbkim/04_match.js` **byte-1:1 aus Sage `src/modules/04_match.js`** synchronisiert
  (reiner additiver Superset: BM25/`queryLocalMulti`/`expandQuerySimple` dazu, keine app-
  eigenen Änderungen — byte-bewiesen durch Sages `smoke_bau22f`/`smoke_bau04f`).
- `sbkim/sbkim-init.js` — Korpus-Items tragen jetzt ein `text`-Feld (roher Passage-Text),
  damit BM25 Zutaten/Geschmack trifft, nicht nur den Drink-Namen.
- `sbkim/15_membran.js` — neuer fail-soft-Helfer `queryWithInclusion` (A4 Synonym-
  Auffächerung über kleine getränke-eigene `MX_QUERY_SYNONYMS` → A1 Hybrid-`queryLocalMulti`
  mit RRF; Stufe für Stufe Rückfall Multi → Hybrid-Single → einfacher Cosinus). Der
  `op:"query"`-Empfänger nutzt ihn.
- `app-sw.js` — `SW_VERSION` v37→v38 (Cache-Bust der geänderten Modul-Dateien).

**Leitplanken gewahrt:** REINE INKLUSIONS-Verbesserung — `PROVIDER_MIN_MATCH` (0.80) =
Vektor-Boden UND Andock-Riegel (Modul 05) **unberührt**, kein PROTOCOL_VERSION-Bump, kein
Netz/LLM. `index.html` == `QC_Mixarium_20_04_26.html` byte-identisch **unverändert** (nur
separate `sbkim/*.js` geändert, keine `<script>`-Tags). Kern-Module nicht angefasst.

**Tests:** Neuer Headless-Smoke `Mein-Mixarium/tests/smoke_rollout_a1a4.mjs` **14/14 grün**
(gegen Mixariums AUSGELIEFERTES Modul 04) — Cross-Phrasing-Rettung („limo"→„limonade" via
BM25-Variante bei orthogonalem Cosinus), fail-soft bei fremder Frage, Rückwärts-Kompatibilität
für Korpus ohne `text`. `node --check` alle geänderten Dateien grün. Sage-Quelle unberührt →
Drift-Guards weiter grün (`smoke_standalone_such_tool` 49/49, `smoke_bundle_connect` 21/21,
`smoke_bau22f` 17/17). **Browser-Sichttest (live Cross-Knoten-Antwort) wartet auf Klaus**
(Mixarium `main` deployt, PR #89 gemergt).

**Offen / nächster Schritt:** (1) Klaus' Live-Sichttest der Mixarium-Cross-Knoten-Antwort.
(2) Rezeptbuch bleibt ohne SBKIM — falls es je ein Mycel-Knoten werden soll, ist das eine
eigene Modul-09-Migrations-Sitzung. (3) Optional A4-Aufsatz LLM-Varianten-Generator (BYOK,
opt-in) in Sage Modul 22 — als eigene Folge-Sitzung.

## 2026-07-02 · App-Integration A1 (Hybrid) + A4 (Multi-Query) ins Suchfeld (Modul 22)

**Rolle:** Bau-Sitzung (Branch `claude/sage-app-integration-a1-a4-f4dy8b`). Brief:
`docs/sessions/BRIEF_A_APP_INTEGRATION.md`. Freibrief gilt (Sofort-Start, kein „1/2/3/4?").
Die zwei gemessen-positiven Hebel (A1 Bau 04.F, A4 Bau 04.H) endlich ins echte Suchfeld
verdrahtet, damit Nutzer den Vorteil bekommen.

**Was getan (additiv, minimal-invasiv):** In `src/modules/22_such_widget.js` die
Sortiermaschine `queryCorpus` (bisher `queryLocal(q, k, {corpus})` — reiner Cosinus)
umgebaut:
- **A1:** Vorfilter auf **`{corpus, hybrid:true}`** (BM25+Vektor-Fusion) gehoben. Fail-soft:
  ohne `text`-Feld fällt BM25 in Modul 04 auf `label` zurück.
- **A4:** vor der Suche `expandVariants()` → `match.expandQuerySimple(q, {synonyms})` mit
  einer **kleinen, app-eigenen Synonym-Karte** (`DEFAULT_SYNONYMS`, bidirektional, Rezept-/
  Getränke-Domäne + allgemeine Umschreibungen), dann **`queryLocalMulti(varianten, k,
  {corpus, hybrid:true})`** (RRF-Fusion) statt `queryLocal`. Ohne `queryLocalMulti` fällt es
  auf hybrid-`queryLocal` zurück; bei jedem A1/A4-Fehler auf den einfachen Cosinus-Pfad.
- Gilt einheitlich für App-, Knoten- **und** Internet-Korpus (alle über `queryCorpus`).
- `init({synonyms})` ersetzt die Default-Karte (App kennt ihre Domäne besser);
  `init({queryExpand:false})` schaltet A4 ab (hybrid bleibt). Neue `_meta`-Marker
  `hybridPrefilter/queryExpand/synonymCount`.
- Byte-Kopie `such-tool/modules/22_such_widget.js` mitgezogen (Drift-Guard byte-1:1);
  `such-tool/sbkim-sw.js` `CACHE_VERSION` v1→v2 (Modul 22 wird cache-first precacht).

**Leitplanken gewahrt:** REINE Vorfilter-/Anzeige-Verbesserung — `PROVIDER_MIN_MATCH`
(0.80) + Andock-Riegel (Modul 05) **unberührt**, kein PROTOCOL_VERSION-/DB_VERSION-Bump,
KI-Richter (`richterRerank`, A2) bleibt unverändert daneben (opt-in). Kern-Module 04/05
nicht angefasst (nur öffentliche Flächen genutzt). Der Widget-End-Sort bleibt Cosinus —
der Gewinn ist **INKLUSION** (cross-phrased Treffer, die der 0.80-Cosinus-Boden ausschließt,
werden über den BM25-Pfad AUFGENOMMEN), nicht Umsortierung.

**Tests:** Neuer Headless-Smoke `tests/smoke_bau22f_app_integration.mjs` **17/17 grün** —
Cross-Phrasing-Rettung (Frage „torte" findet Doku „kuchen"; Kontrolle: reiner
`queryLocal('torte',hybrid)` rettet 0) + Spy beweist `queryLocalMulti({hybrid:true})` mit
Synonym-Variante + fail-soft (`queryExpand:false`, Leer-Frage). Regress-frei:
`smoke_bau22` 260/260, `smoke_bau22e` 45/45, `smoke_bau04f` 32/32, `smoke_bau04d` 68/68,
Drift-Guards `smoke_standalone_such_tool` 49/49, `smoke_bundle_connect` 21/21.
**Browser-Sichttest wartet auf Klaus** (nach Merge live; Pages deployt von main).

**Offen / nächster Schritt:** Rollout byte-gleich in `pinnwand/` (hat KEIN Modul 04 —
prüfen ob sinnvoll) + Endknoten-PWAs Mixarium/Rezeptbuch (eigenes Suchfeld — separat
prüfen ob A1/A4 passt). LLM-Varianten-Generator (A4 opt-in-Aufsatz, BYOK) später.

## 2026-07-02 · Namens-Tafel — „Kim"-Produktfamilie festgehalten

**Rolle:** Pflege-Sitzung (Branch `claude/pinnwand-spelling-fix-2ikwzy`).
**Was getan:** Auslöser war Klaus' Rechtschreib-Prüfung „Pinwand vs. Pinnwand".
Befund: der gesamte App-/Doku-Inhalt nutzt bereits durchgehend **„Pinnwand" (zwei n)**
— 364 Treffer, 0× falsches „Pinwand"; einziges Ein-n „Pinwand" ist der **leere Repo-Name**.
Daraus wurde ein Branding-Gespräch: Dachmarke **Kim** (aus KI-Matching/SBKIM),
Regel `Kim` + kurzes hartes Wort. Festgelegt: **Kimboard** (Pinnwand-App),
**Kimseek** (Suche/Modul 22), **Kimsync** (Finden & Verständigen), Merge-Name
**Kim**/**Kimhub** offen. Zwei-Ebenen-Prinzip: Protokoll bleibt Mycel/Spore,
Apps tragen die Kim-Marke (Fruchtkörper-Schicht). Neue Tafel:
[`docs/NAMENSGEBUNG_KIM_FAMILIE.md`](NAMENSGEBUNG_KIM_FAMILIE.md).
**Was offen:** (1) Klaus benennt leeres Repo `Pinwand` → `Kimboard` in GitHub-Settings
(kein Rename-Zugriff aus der Sitzung). (2) App-Inhalts-Umbenennung Pinnwand→Kimboard
aufgeschoben ins eigene Kimboard-Repo. (3) Web-Freiheits-Check für Kimseek/Kimsync/Kimhub.
**Nächster Schritt:** Namens-Freiheit von Kimseek/Kimsync prüfen, wenn Klaus grünes Licht gibt.

## 2026-07-01 · A4 — Query-Expansion / Multi-Query in Modul 04 (Strang A, additiv)

**Rolle:** Bau-Sitzung (Branch `claude/semantic-matching-quality-a3-jb0aut`). Nächster Hebel
A4 nach A1 (positiv gemessen) + A3 (negativ gemessen). Klaus wählte „1" (A4 bauen).

**Was getan (Bau 04.H, additiv):**
- `expandQuerySimple(text, {synonyms?, maxVariants?})` — freie/offline Varianten-Erzeugung
  (Original zuerst, dedupe, Deckel; ohne Synonym-Karte → `[text]`; kein Netz/LLM).
- `queryLocalMulti(queries, k, options)` — sucht mit JEDER Variante (`queryLocal`, options
  inkl. `hybrid` durchgereicht) und verschmilzt die Rang-Listen via **RRF** (dieselbe Fusion
  wie A1, nur über Varianten). `score` = bester Cosinus, `matchedQueries` = #Varianten;
  fail-soft je Variante (werfende Variante übersprungen).
- **Leitplanken:** bestehende `queryLocal`/hybrid-Pfade **byte-gleich**; `PROVIDER_MIN_MATCH`
  (0.80) + Andock-Riegel (Modul 05) unberührt; **kein** PROTOCOL_VERSION-/DB_VERSION-Bump.
- **Panel 04 „A4-NACHMESSUNG"**-Knopf (deterministischer Hash-Mock, lokal gesichert+restauriert,
  andere Tests unberührt) misst, wie viele Ziele die Multi-Query rettet, die die Einzel-Frage
  verpasst. Cache-Bust `?v=a4-20260701`.
- **Tests:** Headless `tests/smoke_a4_query_expansion.mjs` **16/16 grün**; Regression
  04a/04c/04d/04e/04f/04g grün; Drift-Guards such-tool (49/49) + sbkim-bundle (21/21) byte-1:1
  (Modul 04 byte-kopiert; pinnwand hat kein Modul 04). Doku: INTERFACES §1 Modul 04, Karte 04.

**GEMESSEN POSITIV (Klaus, Browser 2026-07-01, Panel 04 A4-NACHMESSUNG):** Multi-Query rettet
**4/4** Ziele, die die Einzel-Frage (andere Formulierung) verpasst (z. B. „auto reparatur" →
„kfz reparatur"). Dritter gemessener Hebel: **A1 positiv (4/4), A3 negativ (Δ −0.11), A4 positiv
(4/4)** — A1 und A4 wirken beide durch einen ZUSÄTZLICHEN Zugang zum Treffer, A3 drehte am selben
Signal und verschlechterte.

**Ehrlich offen:** die freie Synonym-Karte ist begrenzt; der starke Varianten-Generator wäre ein
**opt-in LLM-Aufsatz** (BYOK) — die Fusion (`queryLocalMulti`) bleibt gleich. **Nächster Schritt:**
App-Integration im Suchfeld (Modul 22) mit Synonym-Karte und/oder opt-in LLM-Generator; oder A5/A6
bzw. App-UX-Wünsche.

## 2026-07-01 · A3 — Contextual Chunking in Modul 03 `embedContentVector` (Strang A, additiv)

**Rolle:** Bau-Sitzung (Branch `claude/semantic-matching-quality-a3-jb0aut`). Nächster Hebel
A3 nach A1 (Hybrid BM25+Vektor) + A2 (KI-Richter im Antwort-Pfad). Klaus-Freibrief für die
Sitzungs-Entscheidung („entscheide selber, solange sinnvoll und logisch").

**Was getan:**
- `embedContentVector` (Modul 03) bekommt **additiven Kontext-Vorspann**: `opts.context`
  (global) + pro-Schnipsel `{ …, context }` (überschreibt global) stellt jedem Inhalts-
  Schnipsel VOR dem Einbetten einen kurzen Domänen-/Dokument-Kontext voran (Anthropic
  „Contextual Retrieval", deterministisch/offline/gratis). Ohne Kontext **byte-gleiches**
  Verhalten (Rückwärts-Kompat bewiesen). Rückgabe-Feld `contextUsed`; Test-Brücke
  `_assembleContentTexts` (reine Text-Assemblierung, headless prüfbar).
- **Leitplanken gewahrt:** gatet nichts, `PROVIDER_MIN_MATCH = 0.80`/Andock-Riegel (Modul 05)
  unberührt, **kein** PROTOCOL_VERSION-/DB_VERSION-Bump, **kein** Spore-Feld.
- **Panel 04 „A3-NACHMESSUNG"**-Knopf (Browser): Baseline (ohne Kontext) vs. A3 (mit
  Domänen-Vorspann) über dieselbe Mittelung + zentrierten Cosinus (`relatedness`, v1),
  zeigt Lücken-Delta. Reine Messung, setzt keine Konstante. Cache-Bust `?v=a3-20260701`.
- **Tests:** Headless `tests/smoke_a3_contextual_chunking.mjs` **20/20 grün**; Rückwärts-
  Kompat `smoke_inhaltstreuer_domainvektor.mjs` **25/25 grün**; Drift-Guards such-tool
  (49/49) + sbkim-bundle (21/21) + pinnwand (60/60) byte-1:1 grün (Modul 03 byte-kopiert).

**GEMESSEN (Klaus, Browser, 2026-07-01 Abend): NEGATIV.** Panel 04 `A3-NACHMESSUNG` mit echten
transformers.js-Vektoren: Baseline-Lücke −0.0135, A3-Lücke −0.1210, **Δ −0.1075 → A3
verschlechtert die Trennung.** Ursache: pro-Knoten unterschiedliche Domänen-Vorspänne schieben
auch echte Verwandte (rezept↔mix) auseinander; die Anisotropie ist durch keinen gratis Cosinus-
Trick am Domänen-Zentroid heilbar (der „verwandt"-Weg bleibt der KI-Richter). **Konsequenz:** A3
wird **NICHT** netzweit verdrahtet, bleibt harmloses additives opt-in-Werkzeug (byte-gleich ohne
Kontext). Ehrlicher Negativ-Befund wie beim v2-Center. Doku: LEHRE § „Stand 2026-07-01 (Abend) —
A3 im Browser gemessen: NEGATIV". **Nächster Hebel: A4 (Query-Expansion), orthogonaler Recall-Hebel.**

**Kontrast A1 GEMESSEN POSITIV (Klaus, Browser 2026-07-01, neuer Panel-04-Knopf A1-NACHMESSUNG):**
Hybrid BM25+Vektor rettet **4/4** Wort-Treffer unter dem 0.80-Vektor-Boden, die die reine Vektor-
Suche verliert — **0 Fehl-Rettungen** (Kontroll-Fall ohne Wort-Bezug korrekt NICHT gehoben). Der
saubere Beweis, dass A1 verbessert (zweites Signal dazu), während A3 verschlechtert (am selben
Signal gedreht). A1-NACHMESSUNG-Knopf deterministisch (Mock wie Test 20, kein Modell-Lade).

**Nächster sinnvoller Schritt:** (1) Klaus: Panel 04 Baseline + A3-NACHMESSUNG im Browser
laufen lassen → Delta ablesen. (2) Bei positivem Delta: `embedContentVector`-Aufrufer
(Modul 02 `regenerateOwnSpore`-Pfad / Andock) optional mit Knoten-Titel als Kontext
verdrahten (eigene Folge-Sitzung, netz-koordiniert). (3) family-project OCR-Rollout
(Strang B2, offener „nicht vergessen"-Faden).

## 2026-07-01 · B2-Rollout — OCR ins Such-Widget (Modul 22) + Sage Such-Tool

**Rolle:** Bau-Sitzung (Branch `claude/b2-ocr-suchwidget`). Strang-B2-Rollout App 3/5 (Sage
Such-Tool), nachdem App 1 (Mein-Rezeptbuch #273) + App 2 (Mein-Mixarium #85) live sind.

**Was getan:** Modul 22 (Such-Widget) bekommt einen **📷-OCR-Knopf** neben dem 🎤-Sprach-Knopf —
**Foto/Handschrift → Suchtext** via Modul 24 (`SbkimOcr`), im selben Muster wie die Sprach-Eingabe.
Öffnet Datei-Wähler → Mistral OCR (EU, BYOK, Schlüssel RAM-only via prompt) → `appendToField` hängt
den erkannten Text ans Suchfeld. EU-Politik des Widgets (`optEuPolicy`) gilt; konsequent fail-soft
(kein Modul 24 / kein Schlüssel / Fehler → Hinweis, kein Throw). Modul 24 nach `such-tool/modules/`
byte-kopiert + in `such-tool/index.html` geladen; Sage-Page lädt Modul 24 bereits (aus B1).

**Beweis (headless):** `smoke_bau22` **260/260** (+3 Proben: OCR-Knopf gerendert / Klick ohne Modul 24
wirft nicht / „Modul 24"-Hinweis). Drift-Guard `smoke_standalone_such_tool` **49/49** (Modul 24 als
Pflicht-Datei + byte-1:1 + im index.html geladen). `smoke_bau22e` 45/45, `smoke_bundle_connect` 21/21.
`node --check` 22 grün.

**TABU:** rein additiv (DOM-Knopf + fail-soft-Handler), kein Eingriff in Suche/Match/Andock; Modul 24
nur über öffentliche `recognize`-Fläche; kein Schlüssel im Code, kein PII.

**Nächster Schritt:** B2 App 4 (Pinnwand) + App 5 (BookLedgerPro, EU-Option neben Google Vision).
Browser-Sichttest (📷-Knopf im Widget + Mistral-Schlüssel) wartet auf Klaus.

## 2026-07-01 · Modul 24 — OCR-/Bild-Eingabe (Strang B1, Geschwister von Modul 21)

**Rolle:** Bau-Sitzung (Branch `claude/b1-ocr-eingabe-modul`, von frischem `main`). Klaus: „weiter"
→ gewählt: **Strang B1**, das OCR-Eingabe-Modul.

**Was getan:** neues `src/modules/24_ocr_eingabe.js` (`SbkimOcr`) — input-agnostische Bild/Handschrift-→-
Text-Schicht, **1:1 nach dem Muster von Modul 21**. Liefert nur Text; Suche (03/04) unberührt. Drei
steckbare Anbieter: **`mistral`** (Mistral OCR `mistral-ocr-latest`, EU, **Favorit**) · `google` (Cloud
Vision EU-Endpunkt, `DOCUMENT_TEXT_DETECTION`) · `browser` (Shape Detection, experimentell). EU-Politik
`frei`/`bindend` per Knoten; konsequent **fail-soft** (kein Schlüssel/Bild/Netz/HTTP → deutscher Hinweis,
kein Throw außer `InvalidEuPolicyError`); **BYOK, kein Schlüssel im Code, kein PII**. Surface
`init/getProviders/availableProviders/pickProvider/isFileSupported/isBrowserOcrSupported/recognize/
recognizeBrowser/ocrErrorHint`. `index.html` lädt das Skript (KEIN Auto-Init); Panel 24 in
`manual_check.html` (3 Logik-Knöpfe + Live-Knopf „OCR erkennen": Bild wählen + Anbieter/Schlüssel via
prompt → Text ins Feld). Karte 24 + `status.json` (Modul 24, `score:"stub"`) + Pie regeneriert (26 Module)
+ CLAUDE.md-Modul-Tabelle nachgezogen.

**Beweis (headless):** `tests/smoke_bau24_ocr_eingabe.mjs` **41/41 grün** (Export/Meta, EU-Politik +
pickProvider, isFileSupported, Mistral-/Google-Happy-Path + Request-Bau, data-URL-Entpackung, Fail-soft
×4, bindend-schließt-browser-aus, InvalidEuPolicyError, ocrErrorHint, Browser-fail-soft, init-euPolicy).
`node --check` grün, Panel-24-Inline-Skript validiert.

**TABU:** `PROVIDER_MIN_MATCH`/0.80-Andock-Riegel unberührt, kein PROTOCOL_VERSION-/DB_VERSION-Bump,
kein Eingriff in andere Module.

**Offen / nächster Schritt:** (1) Browser-Sichttest Panel 24 (+ echter Mistral-Schlüssel) — wartet auf
Klaus. (2) **INTERFACES.md §1 formaler Modul-24-Eintrag** als Folge-Pflege (Leaf-Modul, kein Modul hängt
dran — bewusst nachgezogen, nicht stillschweigend ausgelassen). (3) **Strang B2**: Rollout byte-gleich in
die Apps (Such-Tool/Pinnwand, Mixarium/Rezeptbuch, family-project, BLP als EU-Option) — braucht Klaus'
Reihenfolge-Wahl.

## 2026-07-01 · Modul-15-Verdrahtung — KI-Richter im Cross-Knoten-Antwort-Pfad (Strang A2, Folge)

**Rolle:** Bau-Sitzung (Branch `claude/a2b-membran-judged-verdrahtung`, von `main` nach 04.G-Merge).
Klaus: „Weiter" → gewählt: die Modul-15-Verdrahtung von `queryLocalJudged` (der logische Anschluss).

**Was getan:** der `op:"query"`-Empfänger in `src/modules/15_membran.js` (Membran Sub b) nutzt jetzt
**opt-in** den KI-Richter. Neue Konfig `queryJudge` (Default `null` = AUS → byte-gleich, roher
`queryLocal`); gesetzt via `init({queryJudge:{apiKey,…}})` ODER Setter `setQueryJudge(cfg)` → Empfänger
ruft `SbkimMatch.queryLocalJudged` (Vorfilter + Richter, BYOK, fail-soft) und antwortet mit der
umsortierten Kandidaten-Liste. Schlüssel RAM-only/nie im Code; `_meta.queryJudgeConfigured` (Boolean,
kein Leak). Pflicht-Aspekt in `16_siegel.js` `ZERTIFIKAT_ASPEKTE` ergänzt (Schutz-Modul-Konvention).
Karte 15 + INTERFACES §1 nachgezogen.

**Beweis (headless):** `tests/smoke_bau15b_membran.mjs` **35/35 grün** (+4 A2-Proben: Flag konfiguriert /
Richter-Pfad genutzt / setQueryJudge(null)-Reset / roher Vorfilter ohne Richter). `node --check` 15+16 grün.

**Branch-Hygiene-Notiz:** die Sitzung hatte den Branch versehentlich von stale `origin/main` (nur bis
04.F) abgezweigt; vor dem Commit auf frisches `main` (inkl. 04.G) rebased (stash → checkout -B → pop,
konfliktfrei), sonst hätte `queryLocalJudged` gefehlt.

**TABU:** `PROVIDER_MIN_MATCH` (0.80) + 0.80-Andock-Riegel (Modul 05) unberührt; Modul 04 nur über die
öffentliche `queryLocalJudged`-Fläche genutzt (kein Eingriff); kein PROTOCOL_VERSION-/DB_VERSION-Bump.

**Was offen / nächster Schritt:** Browser-Sichttest (reine Empfänger-Logik; optionaler Panel-15-Knopf
als Folge-Pflege). Damit ist die antwortende Seite (queryLocal → Hybrid → Richter) komplett. Danach:
Strang B1 (OCR-Modul) oder A3 (Schnipsel-Chunking) — Klaus' Wahl.

## 2026-07-01 · Bau 04.G — queryLocalJudged (Strang A2: KI-Richter fest im Antwort-Pfad)

**Rolle:** Bau-Sitzung (Branch `claude/a2-queryjudged-verankerung`, von `main` nach A1-Merge).
Klaus: „entscheide selber" → gewählt: **Strang A2** als direkte Fortsetzung von A1 auf demselben
Strang (Trefferqualität, antwortende Seite), sauber in Modul 04 (keine Modul-Vermischung).

**Was getan:**
- Neue async-Funktion `queryLocalJudged(text, k, options?)` in `src/modules/04_match.js` — komponiert
  **Vorfilter** (`queryLocal`, A1-Hybrid durchgereicht) + **Richter** (`hybridMatch`, opt-in/BYOK):
  1. queryLocal liefert lokale Top-k (server-los). 2. Nur mit `options.apiKey` urteilt der Richter über
  die Finalisten und sortiert um (`passt` zuerst, dann Richter-Score). 3. Fail-soft: kein Schlüssel /
  leerer Vorfilter / Richter nicht erreichbar → roher Vorfilter, kein Throw.
- Richter beurteilt den Passage-**Text** → queryLocalJudged löst den Korpus identisch zu queryLocal auf
  und baut die Text-Karte (anchorId bevorzugt, sonst label). Treffer tragen additiv
  `passt`/`judgeScore`/`begruendung`; `score` bleibt der Cosinus. Bezeugung (`attestation`) durchgereicht.
- **Kein anderes Modul angefasst** — die Verdrahtung in Modul 15 (`op:"query"`-Empfänger) bleibt eigener,
  klar abgegrenzter Folge-Schritt. `_meta` + Selbstcheck + Doku (Karte 04, INTERFACES §1) nachgezogen.
  Byte-Kopien `such-tool/` + `sbkim-bundle/` mitgezogen (Drift-Guard grün). Panel 04 **Test 21**.

**Beweis (headless):** neuer `tests/smoke_bau04g_query_local_judged.mjs` **28/28 grün** (Opt-in-aus ohne
fetch-Call, leerer Vorfilter, Richter-Umsortierung + Bezeugung, Fail-soft, Passage-Text erreicht Richter,
Hybrid-Durchreichung). Regression 04c/04d/04e/04f grün, Drift-Guard standalone 46/46 + bundle 21/21.

**TABU:** `PROVIDER_MIN_MATCH` (0.80) + Andock-Riegel (Modul 05) unberührt; kein Schlüssel im Code;
kein PROTOCOL_VERSION-/DB_VERSION-Bump; kein Modul-Eingriff außer 04.

**Was offen / nächster Schritt:** Browser-Sichttest Panel 04 Test 21 (+ echter Richter-Schlüssel) —
**wartet auf Klaus**. Danach: Modul-15-Verdrahtung von `queryLocalJudged` in den Cross-Knoten-Antwort-Pfad
(eigener Schritt, Modul-15-Scope) ODER Strang B1 (OCR-Modul) / A3 (Schnipsel-Chunking).

## 2026-07-01 · Bau 04.F — Hybrid BM25+Vektor in Modul 04 (Strang A1 der Semantik-Matching-Werkzeugkiste)

**Rolle:** Bau-Sitzung (Branch `claude/semantic-matching-mistral-ocr-raxbb9`). Auftrag:
Brief 2026-07-01 „Semantische Matching-Qualität (Strang A) + Mistral-OCR-Eingabe (Strang B)".
Diese Sitzung setzt **Strang A1** um — den im Brief als **größten Hebel** benannten Schritt.

**Was getan:**
- **BM25 (lokal, offline, deterministisch) + Reciprocal Rank Fusion** in `src/modules/04_match.js`
  ergänzen den reinen e5-Cosinus (dessen Anisotropie-Boden ~0.82 Bedeutung nicht trennt, siehe
  `LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`). Drei neue Funktionen: `tokenizeBM25`, `bm25Scores`
  (exportiert für Panel-04-Messung), intern `rrfScore`. `k1=1.5`/`b=0.75`/`RRF_K=60`.
- **`queryLocal` opt-in `options.hybrid`:** ohne Flag byte-gleiches Bau-04.C-Verhalten (nur
  Cosinus); mit `hybrid:true` fusioniert es BM25+Vektor via RRF. Aufnahme = (cos ≥ 0.80 **ODER**
  bm25 > 0) → der **Kern-Hebel**: ein Eintrag unter dem Vektor-Boden mit exaktem Wort-Treffer wird
  jetzt gefunden. Treffer tragen additiv `bm25`+`fused`; `score` bleibt der Cosinus.
- **Korpus-Schema additiv:** optionales `text`-Feld (BM25-Doc; Fallback `label`), `validateCorpus`
  prüft es nur wenn vorhanden — Bestands-Korpora bleiben gültig.
- **Doku nachgezogen:** Karte 04 § Bauzustand (Bau 04.F + Sichttest-Zeile), INTERFACES.md §1
  (queryLocal-Signatur + Selbstcheck-Zeile). Byte-Kopien `such-tool/` + `sbkim-bundle/` mitgezogen
  (Drift-Guard grün).
- **TABU eingehalten:** `PROVIDER_MIN_MATCH` (0.80) unverändert = Vektor-Pfad-Boden UND Andock-
  Riegel (Modul 05 unberührt); kein Netz/LLM/Schlüssel in BM25; kein PROTOCOL_VERSION-/DB_VERSION-
  Bump; kein Modul-Eingriff außer 04.

**Beweis (headless):** neuer `tests/smoke_bau04f_hybrid_bm25.mjs` **32/32 grün**. Regression:
smoke_bau04c 43/43, 04d 68/68, 04e 29/29, standalone-Drift 46/46, bundle-connect 21/21, 05_nostr
17/17 (konsumiert Modul 04). (Die restlichen Smokes brauchen `fake-indexeddb`/transformers.js — im
frischen Klon nachinstalliert, Modul-01/05–08-Tests danach grün; nichts durch Bau 04.F berührt.)

**✅ Browser-Sichttest GRÜN (Klaus, 2026-07-01, Termux + `python3 -m http.server`):** Panel 04
**Test 20** „Hybrid BM25+Vektor" live bestätigt. Frage „wespen hausmittel": Standard (nur Cosinus)
liefert nur B (0.8645) + C (0.8369), „A (unter Boden)" (cos 0.7091) fehlt; **Hybrid** stellt A mit
`bm25 1.3938`/`fused 0.03227` an die Spitze (vor C 0.03226 und B 0.01639). Kern-Hebel im Browser
bewiesen — der lexikalische Pfad holt den Unter-Boden-Treffer zurück, 0.80-Andock-Riegel unberührt.
PR #509 damit headless (32/32) UND Browser grün → merge-reif.

**Was offen / nächster sinnvoller Schritt:**
- **Schritt-0-Baseline-Messung** (KALIBRIER-BODEN / SCHWELLEN-ANALYSE / VERFAHREN-VERGLEICH) bleibt
  als Instrument in Panel 04 — optional für die spätere A5-Modellwechsel-Entscheidung.
- **Panel-04-Knopf für Hybrid** in `tests/manual_check.html` (Test 20: `queryLocal({hybrid:true})`
  vs. Default am Mini-Korpus) — Folge-Pflege, headless deckt die Logik schon ab.
- **Strang A2/A3/A4** (Richter fest im Antwort-Pfad / Schnipsel-Chunking / Query-Expansion) +
  **Strang B1** (OCR-Modul, Geschwister von Modul 21) — je eigener Bau, warten auf Klaus'
  Richtungsentscheide (Pipeline-Position, A5-Modellwechsel-Timing, B2-Rollout-Reihenfolge).
