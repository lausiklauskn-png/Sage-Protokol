# Ausgelagert aus docs/PULS.md — 2026-09-16 (fünfzehnte Auslagerung)

**Warum.** `docs/PULS.md` stand bei **2.971** von 3.000 Zeilen, und der Eintrag
dieser Sitzung ist länger als der verbleibende Platz. Die Verfassung sagt dazu:
**auslagern statt kürzen** — die Grenze wird nicht herabgesetzt und kein Satz
gestrichen. Beide Einträge unten stehen hier **wortwörtlich**, nichts daran ist
gekürzt oder umformuliert.

**Warum GERADE diese drei.** Es sind die drei ältesten noch vollständig in
`PULS.md` stehenden Einträge — alles darunter ist bereits ein Zeiger ins
Archiv. Drei statt einem, weil der Eintrag dieser Sitzung 194 Zeilen lang ist;
die Rechnung steht im Übergabeprotokoll dieser Sitzung.

---

## Stand 2026-09-15 (Haupt-Sitzung, zweiter Teil) · ⚠ DIE ZEITERFASSUNG LÄUFT IN BEIDE FEHLERRICHTUNGEN

**Rolle:** Haupt-Sitzung, Fortsetzung. **Anlass:** Klaus' Widerspruch
*„Alle hatten SBKIM UND NICHT ERST SEIT GESTERN"*, danach sein Sichttest an
sieben Apps und ein zweiter Auftrag zur Zeiterfassung.

**Klaus hatte recht, und zwar an der Wortwahl.** Im Chat stand
*„die vier Apps, die seit gestern gar kein SBKIM hatten"*. Gemessen: SBKIM liegt
in diesen vier Apps seit dem **2026-08-16** (Alis #39, PSB #43, PSF #15,
Muster Werbetechnik #7). Die Messung über das A18-Fenster stimmte — der Satz
las sich, als hätten die Apps SBKIM erst seit gestern. Berichtigt.
Herkunft des Befundes: `klaus`.

**Nachgemessen im echten Browser, sieben Apps, je drei Stände** (Wegwerf-Worktrees
an `A18^`, `A18`, `origin/main`): vorher Speicher/Siegel/Lampen ✓ · im A18-Stand
alle ✗ mit `Unexpected string` · heute wieder ✓ und zusätzlich Konfiguration und
Kanon. Das Fenster war rund **ein Tag**, im Depot.

**Klaus' Sichttest: grün, alle sieben.** Jede App trägt ihren eigenen Text im
Siegel, jede hat den Andock-Wizard. Der Wizard ist das **letzte** Glied der
Kette — steht er da, sind die siebzehn Dateien davor angekommen.

**Aus den Bildern gemessen — Kennung im Browser gegen `status.json`:** fünf von
sieben gleich (Mixarium, Alis, PSF, PSB, Muster Werbetechnik), **zwei anders**
(Mein Rezeptbuch, Mein WorkFloh). Am 2026-09-10 waren es netzweit zwei von
fünfzehn. **Vier Knoten hatten KEINE Sicherung ihrer Kennung** — inzwischen nach Klaus’
Angabe alle angelegt (Muster
Werbetechnik, Rezeptbuch, **Mixarium**, WorkFloh) — bei Mixarium ist die Kennung
in `status.json` und in den Proben genagelt. Klaus ist darauf hingewiesen; eine
Sitzung kann den Knopf nicht drücken.

**Nebenbefund, nicht von A18:** `modules/noble-secp256k1.js` steht in der
Nachlade-Kette und wird dort als gewöhnliches Skript geladen — es ist ein
ES-Modul und wirft `Unexpected token 'export'`, vorher wie nachher. Kette läuft
fail-soft weiter, Siegel und Spore sind da. **Nicht untersucht**, ob dadurch
etwas fehlt.

**⚠ DER BEFUND DES TAGES: die Historien-Methode ist an zwei aufeinanderfolgenden
Tagen in BEIDE Fehlerrichtungen gelaufen.** `Kimhub/tools/zeiten-sammeln.mjs`
warnt in seinem eigenen Kopf vor genau beiden — *„UNTERGRENZE … Pausen
dazwischen zaehlen voll mit"* — und niemand hat es an der Zahl gemerkt.
Gemessen über alle 22 Depots:

| Tag | Commits | Depots | Commit-Spanne | Wirkung |
|---|---|---|---|---|
| 2026-09-14 | 197 | 22 | **16 h 02 min** (07:04–23:06 UTC) | Pausen zählen voll → zu viel |
| 2026-09-15 | 24 | 8 | **0 h 29 min** (09:13–09:42 UTC) | Klaus' Bildschirmfotos tragen 12:41–12:54 UTC → mindestens **3 h 12 min** liegen nach dem letzten Commit → zu wenig |

Die ganze Arbeit des 15. nach 09:42 — drei Browser-Stände messen, Klaus'
Widerspruch, sein Sichttest, der Kennungs-Abgleich — hinterlässt **keinen
einzigen Commit**. Aus einem Arbeitstag werden 29 Minuten.
**Das trifft `forschung/METHODE.md` § 3 unmittelbar:** das Feld `spanne` IST
diese Commit-Spanne. Gemerkt hat es der Betreiber, weil ihm das Stoppen der
Stechuhr lästig wurde. Herkunft: `klaus`, Wächter blind.

**Für die Übersetzung neu gemessen:** **keine** App im Netz trägt statisch
`html lang="en"` — die Zusicherung „ohne Einstellung ändert sich nichts" hält.
**Aber zehn Apps setzen `<html lang>` zur Laufzeit**, sobald der Nutzer eine
Sprache wählt (Alis-Moderaum:448, PSF:299, New-PSB:296, PWA-Toolpoint
`sprache.js`:97, Mixarium:6100, Rezeptbuch-QC:6230, Mein-WorkFloh:1041,
Muttis:4694, Mixarium-Page:51, Tomys `workfloh`:978). Die Falle ist damit eine
andere als im alten Brief beschrieben.

**Forschungsstand nachgerechnet** (2026-09-15, über alle 22 Einträge in
`Kimhub/forschung/sitzungen.json`): 340 Befunde · `hinsehen` 43,5 % ·
`gegenprobe` 25,0 % · `klaus` 17,1 % · `regel` 14,4 % · **blinde Wächter 42,9 %**.
V1 hält, V2 hält. Die **Auswertung** selbst steht weiter aus; die Sitzungen vom
14. und 15. sind noch nicht eingetragen.

**Offen:** die Übersetzung (`TEXTE.en`) · die Zeiterfassung zusammenführen
(drei Wege vorgelegt, Klaus entscheidet) · die zwei abweichenden Kennungen ·
44 zurückhängende Kanon-Dateien · 38 blinde
Gegenprobe-Fälle in PWA Toolpoint · die zwei `jasons-bibliothek/`-Spiegel ·
`noble-secp256k1` in der Kette.

**Nächster Schritt:** `docs/sessions/BRIEF_uebersetzung-und-zeiterfassung.md` —
er trägt beide Aufträge und alle Zahlen dieses Tages.



---

## Stand 2026-09-15 (Haupt-Sitzung, Nachtrag) · ✅ MUSTER WERBETECHNIK IST ÜBER DEM HANDSHAKE-BODEN

Klaus hat noch am selben Tag über das Siegel neu signiert und die Spore
geschickt. **Acht Prüfungen, 0 rot**, bevor sie abgelegt wurde: Signatur VALID
reziprok · `id == base64url(SHA256(rawPub))` · kein `d` · `key_ops` nur
`["verify"]` · `OKP`/`Ed25519` · 384 Stellen · **L2 = 1.000000044** · kein
`_demo` · Text **byte-gleich mit beiden Wegen zur Spore** (864 Zeichen).

**Die abgelegte Spore hing bis dahin auf der ALTEN Kennung.** Das Register
führt seit dem 2026-09-10 `Gq_Mt8o…` und `_Psq_…` unter `previousNodeIds`,
`sbkim/spore.json` trug noch `_Psq_…` vom 2026-08-16. **Depot und Register
stimmen jetzt zum ersten Mal überein** — keine Identitäts-Entscheidung, die fiel
am 2026-09-10.

**Gemessen gegen Sages Spore: 0,793613 → 0,907431**, also über
`PROVIDER_MIN_MATCH = 0.80`. Von den fünf Knoten unter dem Boden sind **vier**
übrig: Alis Moderaum 0,793347 · Perfect Skin Fashion 0,793030 · Tomys Hub
0,786371 · Perfect Skin Beauty 0,783216.

⚠ **Die Ursache ist nicht die Länge, sondern der Inhalt.** 421 → 864 Zeichen,
aber entscheidend ist, dass der neue Text SBKIM, Mycel, Knoten und Sage-Protokol
**nennt**. Derselbe Hebel, den `status.json` aus den Mitschnitten vom 2026-09-10
benennt — **jetzt ein zweites Mal belegt**, an einem Knoten, der vorher darunter
lag.

⚠ **`matchScoreQuelle` ist hier `depot-2026-09-15`**, bei den übrigen zwanzig
`raum-2026-09-10`. Gerechnet gegen die abgelegte Spore, weil für diesen Tag kein
Mitschnitt vorliegt. Eine Tabelle mit zwei Maßstäben nennt sie, statt einheitlich
auszusehen.

✅ **Inzwischen erledigt** (Klaus, 2026-09-15: „Sicherungen sind alle angelegt“) — **seine Angabe, nicht gemessen**, der Vermerk lebt im Browser-Speicher und ist von einer Sitzung nicht zu lesen. **Neu signieren bleibt trotzdem etwas anderes als sichern.**



---

## Stand 2026-09-15 (Haupt-Sitzung, Nachtrag 2) · ⚠ DERSELBE KOMMA-FEHLER IM SERVICE-WORKER

**Gefunden beim Verifizieren nach `Mein-WorkFloh/CLAUDE.md`** (*„node --check auf
den `<script>`-Block von `index.html` **und** `sw.js`“*). Der A18-Rollout hat die
Wizard-Zeile auch an den **Offline-Vorrat** angehängt, und dort zweifach falsch:

```
  'assets/nostr-listen-init.js', 'assets/siegel-inhalt.js'         <- Komma fehlt
  'assets/nostr-listen-init.js', 'assets/sbkim-andock-wizard.js'   <- Doppel-Eintrag
```

**Ein Service-Worker, der nicht parst, installiert nicht** — die App hatte einen
Tag lang keinen Offline-Vorrat. **Netzweit gemessen: nur diese eine App**, alle
übrigen 24 Service-Worker parsen. Behoben, Cache-Bump v129 → v130.

⚠ **WARUM DER NEUE WÄCHTER ES NICHT FANGEN KONNTE, und das ist der Punkt:**
`tools/wizard-laedt-pruefen.mjs` **lädt die Seite** und misst, ob Konfiguration
und Kanon ankommen. Ein Service-Worker ist daran nicht beteiligt — er wird
**registriert**, nicht geladen. Die Seite war tadellos, der Vorrat tot.
**Ein Wächter misst, was er misst, und kein Zeichen mehr.**
Seitdem: `tests/smoke_service_worker_parst.mjs` fährt `node --check` über alle
**25** Service-Worker des Netzes, mit Gegenprobe auf genau den Komma-Fall.

**URSACHE IM WERKZEUG behoben.** `tools/wizard-trennen.mjs` spiegelte die
**ganze Zeile**; in `index.html` steht ein Eintrag je Zeile (dort ging es gut),
in `sw.js` stehen drei. Ab zwei Pfaden je Zeile wird jetzt nur noch der
**Eintrag** herausgelöst. **An zwei Fixtures gemessen**, nicht behauptet: die
`sw.js`-Form parst danach, die `index.html`-Form bleibt unverändert.

**MEIN-WORKFLOH HAT SEINE IDENTITÄT VERLOREN — und das ist diesmal kein
Fortschritt.** `foFm64sA…` ist weg: Klaus hat gesucht, es gibt keine Sicherung,
und der Identitäts-Wechsler der App sagt es selbst — *„Genau eine Identität —
sauber.“* Er nutzt die App ausschließlich über den DeX-Browser. Geltend ist
`LEIbBDaS…`; die alte steht unter `previousNodeIds` (jetzt **zwei** Einträge).

**Gemessen: gegen Sages Spore exakt `0.902126`** — auf sechs Stellen derselbe
Wert wie die alte Identität. **Der Wechsel kostet die Zahl nichts, er kostet die
Identität.** 10 Prüfungen vor dem Ablegen, 0 rot.

✅ **UND EINE ANTWORT AUF KLAUS'' FRAGE, GEMESSEN STATT GERATEN.** Er fragte, wie
sich verhindern lässt, dass alte Kennungen mitgenommen werden. Nachgesehen in
`src/modules/02_spore.js`: liegen **mehrere** Identitäten in einem Browser und
ist keine als aktiv markiert, nimmt Modul 02 den **ersten Slot lexikographisch**
(`listIdentities()` sortiert alphabetisch) — **nicht die neueste nach
Zeitstempel.** Das ist nicht falsch, aber willkürlich, und es steht jetzt da,
damit niemand „die neueste gewinnt“ annimmt.

