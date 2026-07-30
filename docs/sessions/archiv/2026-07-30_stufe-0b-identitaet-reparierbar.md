# Übergabeprotokoll — 2026-07-30 (Nachmittag): Stufe 0b, die Kennung wird reparierbar

**Rolle:** Bau-Sitzung · **Brief:** `docs/sessions/BRIEF_STUFE0B_IDENTITAET_HALTBAR.md`
**Branch:** `claude/stufe-0b-identitaet-reparierbar` · **Doku:** `claude/stufe-0b-doku`
**Gemergt:** Sage #752 · Kimboard #58 · BookLedgerPro #286 · Mein-Tresor #80 ·
Jasons-Tresor #138 · family-project #123

---

## 1. Ausgangslage

Der Brief war entsperrt: die 0a-Messung hatte geantwortet (die Kennung überlebt
die Nacht nicht, auch nicht bei „Speicher dauerhaft: ja"), die Ursache im
Lösch-Pfad von Modul 01 war gefunden und netzweit geheilt (13 PRs, 2026-07-30 früh).

Klaus lieferte während der Sitzung **zwei** neue Belege.

## 2. Was Klaus' Belege zeigen

### 2.1 Rekord `20260730T145936` (16:54–16:57 lokal) — erster Lauf nach den Fixes

**Positiv:** Sage ⟷ SB-KIMTool-Point, **fünf** Antworten, jede
`outcome: "established"`, Score **0.8635**. Kein „connection is closing", kein
`decision: null`, keine zweite Kennung mitten im Lauf. Erster Live-Beleg für Fix 1.

**Der Befund:** beide Schubladen waren **leer**.

| Zeit (lokal) | Anzeige |
|---|---|
| 16:54:39 | `Meine Kennung: noch keine (erst verbinden)` · `Speicher dauerhaft: ja` |
| 16:55:10 | `✓ Identität erzeugt: bAf_3wjfRXMlz3B11_v-…` (Spore 14:54:56 UTC) |
| 16:57:18 | `✓ Identität erzeugt: aNoV2w6NAIHDzVvl…` (Spore 14:57:08 UTC) |

Die App legt **wortlos** eine neue Kennung an, ohne je die Alternative „ich habe
eine Sicherung" anzubieten. Genau Punkt 3 des Briefs — an Klaus' eigenem Lauf belegt.

**Ehrliche Grenze der Aussage:** ob Sage/Point in diesem Browser **je** eine
Kennung hatten, lässt sich nicht sagen — in keinem der vier Rekorde vom 29./30.
tauchte einer der beiden mit lebender ID auf. Es kann ein Erst-Anlegen gewesen
sein. Unentschieden, und darum zweitrangig.

### 2.2 Rekord `20260730T151140` (14:59–15:11 UTC) — der ernüchternde Teil

**Kimboard hat seine Kennung erneut verloren.** `XFi3xrd7xMSuaf` (entstanden
04:45 UTC, noch live um 05:01) ist weg; um **15:09:38 UTC** entsteht
`e8UwgMlxrmSjetpO` — die **dritte** Kimboard-Kennung binnen zwei Tagen.
Klaus' Bild von 17:08 zeigt erneut `Speicher dauerhaft: ja`.

**Was das beweist und was nicht:** es ist **kein** Beleg, dass die Härtung vom
Morgen nicht wirkt — und **kein** Beleg, dass sie wirkt. Zwei Wege bleiben offen:

- (a) das Fenster von 05:01 lief noch mit **altem** Code (Klaus hatte es nicht
  geschlossen); eine schon **vorgemerkte** `deleteDatabase()` konnte später
  fallen, als die letzte Verbindung wegfiel.
- (b) eine weitere, noch unbekannte Ursache.

Aus den Rekorden ist das **nicht** zu entscheiden. Genau deshalb ist die richtige
Antwort nicht „noch eine Ursachensuche", sondern **Reparierbarkeit** — 0b.

**Nebenbefund, nicht in diesem Auftrag:** Kimboards Andock-Anfragen an Sage
(Ereignis 34 + 54) blieben **ohne Antwort**. Passt zur bekannten Rest-Grenze
„Antworter-Tab muss vorn und wach sein". Eigenes Thema.

## 3. Was gebaut wurde

Alles in **`src/modules/23_rendezvous_ui.js`** (Kanon), byte-1:1 kopiert nach
`sbkim-bundle/modules/`, Kimboard `modules/`, BookLedgerPro/Mein-Tresor/
Jasons-Tresor/family-project `sbkim/`. Kimboards sha-Pin in `test/smoke.test.js`
nachgezogen (`2124022de2aeac0de62d9a2f6c962a9885e1841a1f0d4b354afd378fbb58797f`).

Neuer Kasten **„🪪 Kennung sichern"** direkt unter den 0a-Statuszeilen:

1. **💾 Sicherung anlegen** — Modul 02 `exportBackup` (PBKDF2-SHA256 600k +
   AES-GCM-256). Passwort zweifach, **nirgends gespeichert** (Test prüft es).
   Ohne Sicherung **warnt** der Hinweis; danach steht dort „Letzte Sicherung: …"
   (ausdrücklich als *Vermerk*, nicht als Beweis, dass die Datei noch existiert).
2. **📥 Sicherung einspielen** — `importBackup`. Bei belegtem Fach erst Warnung,
   dann ausdrückliches „Ja, ersetzen" → die **alte** Kennung ist zurück.
   Falsches Passwort → ehrliche Fehlermeldung.
3. **Kein stummes Anlegen mehr** — leere Schublade ⇒ **Frage** statt Kennung.
   Volle Schublade ⇒ unverändert ein Klick. Lesefehler ⇒ alter Weg unverändert.
4. **🧹 Fächer aufräumen** — Mehrfach-Fächer weg, aktives bleibt, mit Rückfrage.

Die **ehrliche Grenze** steht in der Oberfläche: „Eine Räumung durch den Browser
lässt sich nicht verhindern — nur unwahrscheinlicher machen (App auf den
Startbildschirm legen) und der Verlust reparierbar halten (Sicherung)."

### Abgrenzung

REINE UI-Schicht über die **öffentlichen** Flächen von Modul 02. Kern-Module
**01/02/05/23 unangetastet**, kein `PROTOCOL_VERSION`-/`DB_VERSION`-Bump,
0.80-Andock-Riegel unberührt, fail-soft ohne Modul 02.

### Nachtrag: der Brief hatte recht, die Sitzung hatte unrecht

Diese Sitzung notierte zuerst, „kein App-Klebstoff übergibt `ensureIdentity:true`".
**Das war falsch.** Der prüfende `grep` lief mit `head -5` und wurde von
`ensureIdentityStores`-Treffern aus Modul 02 zugeschüttet; die echten Fundstellen
in den Glue-Dateien fielen unter den Tisch.

Tatsächlich fuhren **alle fünf** Apps `ensureIdentity: true` bei
`SbkimRendezvous.init()`:

| App | Datei |
|---|---|
| Kimboard | `assets/rendezvous-init.js` |
| BookLedgerPro · Mein-Tresor · Jasons-Tresor · family-project | `sbkim/sbkim-init.js` |

Damit legte die App **beim Seiten-Start** wortlos eine neue Kennung an, sobald die
Schublade leer war — das Tor im Verbinden-Knopf kam **zu spät**.

**Behoben am selben Tag** (Kimboard #59, BookLedgerPro #287, Mein-Tresor #81,
Jasons-Tresor #139, family-project #124): `ensureIdentity` ist aus dem Klebstoff
entfernt. Ist eine Kennung vorhanden, ändert sich nichts; ist die Schublade leer,
entscheidet der Nutzer. Suiten grün (6/6 · 2153/0 · 53/0 · 59/0 · `node --check`).

**Lehre:** ein `grep` mit `head -N` ist **kein Beweis für Abwesenheit**. Wer
„X kommt nirgends vor" schreibt, zählt vorher ungekürzt.

## 4. Beweis

| Lauf | Ergebnis |
|---|---|
| `tests/smoke_bau23_0b_identitaet.mjs` | **34/34 grün** |
| **GEGENPROBE** `SBKIM_0B_SABOTAGE=1` | **30/34 — fällt wie erwartet** |
| `smoke_bau23_rendezvous_ui.mjs` | 87/87 (regress-frei) |
| `smoke_bau23_rendezvous.mjs` | 59/59 |
| `smoke_bau23c_ki_richter.mjs` | 28/28 |
| `smoke_bundle_connect.mjs` | 21/21 |
| Kimboard `npm test` | 6/6 |
| Mein-Tresor / Jasons-Tresor / BookLedgerPro | 53/0 · 59/0 · 2153/0 |

Die Gegenprobe hebelt gezielt das Identitäts-Tor in `onConnect` aus; es fallen
genau die vier Proben zu Teil 3 („KEIN wortloses Anlegen", „stattdessen eine
Frage", „beide Wege angeboten", „Warnung: neue Kennung ≠ alte").

**Nicht geprüft:**

- family-projects Suite (`tests/smoke_all.mjs`) braucht `playwright-core`; in
  dieser Umgebung nicht installierbar (kein `package.json`). Dort ist die
  Änderung eine per sha256 gegen den Kanon geprüfte byte-identische Kopie.
- Der **echte Browser-Pfad** (Datei-Download, Datei-Auswahl, echte AES-Krypto,
  IndexedDB) — **wartet auf Klaus' Browser-Lauf.** Headless ersetzt ihn nicht.

## 5. Nächster sinnvoller Schritt

1. **Klaus' Sichttest:** in EINER App **💾 Sicherung anlegen**, später
   **📥 einspielen** → die alte Kennung muss zurück sein. Vorher **alle offenen
   Fenster neu laden** (alter Code läuft in offenen Fenstern weiter).
2. **Stufe 0c** (Brief liegt): die Sicherung **im Moment der Entstehung**
   anbieten, nicht nur erwähnen — und die Wiederherstellung an derselben Stelle.
3. **Pflege-Sitzung PULS-Archivierung:** `docs/PULS.md` hat 7573 Zeilen, die
   Schutz-Klausel nennt 3000. Der Überlauf bestand schon vorher (7459 auf `main`);
   „auslagern statt kürzen" ist eine eigene Sitzung.
4. Der **stumme Antworter** (Kimboard→Sage ohne Antwort) — eigenes Thema.
