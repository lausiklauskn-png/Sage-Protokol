# Übergabeprotokoll — Pflege 16 Modal-Local-Time (Sub-(e)-Folge-Pflege 3/3)

**Datum:** 2026-05-26
**Sitzungs-Rolle:** Pflege-Sitzung Render-Kosmetik
**Branch:** `claude/pflege-16-modal-local-time`
**Vorgänger-PR:** Sage #183 (Endknoten-Sichttest Cross-Knoten Sub (e)
+ drei Folge-Briefe, gemerged 2026-05-26 als `8d9011f3`)
**Schwester-Pflege:** Sage #185 (Pflege Modul 17 Widget Bronze/Gold-
Render, gemerged 2026-05-26 als `8d1fffbe`)
**Brief:** `docs/sessions/BRIEF_PFLEGE_16_MODAL_LOCAL_TIME.md`

---

## Anlass

Klaus' Befund aus dem Endknoten-Sichttest Cross-Knoten Sub (e) am
2026-05-26 (DeX-Chrome auf Galaxy Tab S6 in MESZ, UTC+2):

> Datum/Uhrzeit ist nicht aktuell, ich vermute nicht Mitteleuropäische
> Zeit, eher Amerikan.

Das SBKIM-Siegel-Modal in MR + MM zeigte „Bezeugt seit 2026-05-26,
19:10 Uhr" — Klaus' lokale Tablet-Zeit war zu dem Zeitpunkt aber
21:10 MESZ (also +2h gegenüber dem Modal). Klassischer UTC-vs-lokale-
Zeit-Bug.

---

## Diagnose

Code-Stelle (`src/modules/16_siegel.js` Zeile ~870–880 vor Pflege):

```js
var dateLine = modalRoot.querySelector("[data-siegel-date]");
if (dateLine) {
  if (snap.certifiedAt) {
    // ISO "2026-05-24T18:42:31.123Z" → "2026-05-24 HH:MM" lokal.
    var date = new Date(snap.certifiedAt);
    var iso = isNaN(date.getTime()) ? snap.certifiedAt : date.toISOString();
    var datePart = iso.slice(0, 10);
    var timePart = iso.slice(11, 16);
    dateLine.textContent = "Bezeugt seit " + datePart + ", " + timePart + " Uhr.";
  } else { ... }
```

Der Kommentar behauptet „lokal", aber der Code nutzt `.toISOString()`
das **immer** UTC liefert. `iso.slice(11, 16)` ist daher die
**UTC-Stunde:Minute**, nicht die lokale. Bei Klaus' MESZ (+2h) ergab
das eine 2-Stunden-Verschiebung gegenüber der echten lokalen Zeit.

---

## Architektur-Entscheidung

**Optionen aus dem Brief:**

- (A) `toLocaleString("de-DE", {dateStyle:"medium", timeStyle:"short"})`
      → Optik-Wechsel auf „26. Mai 2026, 21:10".
- (B) Lokale `Date`-Methoden (`getFullYear()`, `getMonth()` +1,
      `getDate()`, `getHours()`, `getMinutes()` mit `padStart(2, "0")`)
      → ISO-Datum-Format `YYYY-MM-DD, HH:MM` bleibt.

**Pfad (B) gewählt.** Begründung: Klaus' Doku-Pattern verwendet
überall ISO-Datum-Format (Aspekte-`since`-Feld, Übergabeprotokoll-
Dateinamen, Karte-Bauzustand-Datums-Spalte). Wechsel auf
„26. Mai 2026"-Stil wäre inkonsistent. Pfad (B) ist minimal-invasiv
und löst nur den Zeitzonen-Bug, ohne Optik-Konvention zu brechen.

---

## Was getan

### Code-Eingriff in `src/modules/16_siegel.js`

Zeile ~872–885 vorher:

```js
if (snap.certifiedAt) {
  // ISO "2026-05-24T18:42:31.123Z" → "2026-05-24 HH:MM" lokal.
  var date = new Date(snap.certifiedAt);
  var iso = isNaN(date.getTime()) ? snap.certifiedAt : date.toISOString();
  var datePart = iso.slice(0, 10);
  var timePart = iso.slice(11, 16);
  dateLine.textContent = "Bezeugt seit " + datePart + ", " + timePart + " Uhr.";
} else {
  dateLine.textContent = "Bezeugt: —";
}
```

Nachher:

```js
if (snap.certifiedAt) {
  // Pflege Modal-Local-Time 2026-05-26 (Sub-(e)-Folge-Pflege 3/3):
  // certifiedAt ist UTC-ISO. Vor der Pflege wurden die ISO-Slices
  // direkt angezeigt — Klaus' Befund DeX-Chrome (MESZ, UTC+2):
  // „Datum/Uhrzeit ist nicht aktuell, ich vermute nicht
  // Mitteleuropäische Zeit, eher Amerikan." Fix: lokale Date-
  // Methoden statt UTC-ISO-Split. ISO-Datum-Format (YYYY-MM-DD)
  // bleibt, weil Klaus' Doku-Stil das überall nutzt.
  var date = new Date(snap.certifiedAt);
  if (isNaN(date.getTime())) {
    dateLine.textContent = "Bezeugt seit " + snap.certifiedAt;
  } else {
    var yyyy = date.getFullYear();
    var mm = String(date.getMonth() + 1).padStart(2, "0");
    var dd = String(date.getDate()).padStart(2, "0");
    var HH = String(date.getHours()).padStart(2, "0");
    var MM = String(date.getMinutes()).padStart(2, "0");
    dateLine.textContent = "Bezeugt seit " + yyyy + "-" + mm + "-" + dd + ", " + HH + ":" + MM + " Uhr.";
  }
} else {
  dateLine.textContent = "Bezeugt: —";
}
```

**Was sich ändert:**

- UTC-Stunde `iso.slice(11, 16)` → lokale Stunde `date.getHours()`.
- UTC-Datum `iso.slice(0, 10)` → lokales Datum
  `getFullYear()-getMonth()-getDate()`.
- Format-Optik `YYYY-MM-DD, HH:MM Uhr` bleibt.
- Fail-soft: bei NaN-Date zeigt `Bezeugt seit <Roh-String>`.

`_meta.certifiedAt` bleibt UTC-ISO (Spec-Vertrag).

### Karte 16 § Sub (c) Modal-Body

Punkt 1 „Datum der ersten Bezeugung" um Anzeige-Konvention-Block
erweitert. Erklärt explizit:

- LOKAL via `getFullYear/getMonth/...` (Klaus' Konvention seit
  Pflege Modal-Local-Time).
- KEIN UTC-ISO-Slice.
- Format `YYYY-MM-DD, HH:MM` bleibt.
- Begründung: Klaus' MESZ-Befund.

### Karte 16 § Bauzustand

Neue Zeile „Pflege Modal-Local-Time" zwischen Sichttest Sub (e) und
„In Endknoten eingebaut".

### INTERFACES.md

- § 1 Modul 16 Geprüft-Zeile um Pflege Modal-Local-Time 2026-05-26-
  Eintrag erweitert.
- § 10 Änderungsprotokoll neue Tabellen-Zeile mit vollem Pflege-
  Bericht.

### Headless-Smoke

`tests/smoke_bau16_sub_e_bronze.mjs` um Probe 16 erweitert:

- **Probe 16:** Modal-Datum aus lokalen Date-Methoden. Test
  verifiziert Konsistenz: `dateLine.textContent` muss `getHours():
  getMinutes()` aus der **lokalen** Laufzone enthalten. Der UTC-
  Vergleich (`getUTCHours()`) wird als Diagnose-Anker mit-geloggt
  für den Fall, dass die Probe in einer UTC-Laufzone läuft (dort
  wären lokal und UTC identisch — Test bleibt grün, aber kein
  echter Beweis).

**Resultat:** 16/16 grün (vorher 15/15).

### Regression-Tests

- `smoke_bau15b_membran.mjs`: 31/31 grün
- `smoke_bau17_floating_widget.mjs`: 36/36 grün

Keine Brüche.

### Doku-Pflege

- PULS.md Sitzungs-Eintrag oben.
- `status.json` Modul 16 **unverändert** (bleibt `"stub"`); Pie
  nicht regeneriert (additive Render-Pflege, kein Score-Wechsel).

---

## Was diese Pflege NICHT getan hat

- KEIN funktionaler Vertrags-Eingriff (Public Surface von Modul 16
  unverändert; `_meta.certifiedAt`-Format bleibt UTC-ISO).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Schicht-Pflege, kein
  Sicherheits-Modul-Update — CLAUDE.md § „Sicherheits-Module pflegen
  Aspekte" greift nicht).
- KEIN Endknoten-Eingriff.
- KEINE Tafel-Umsortierung CLAUDE.md.
- KEIN Optik-Wechsel (Format-Konvention `YYYY-MM-DD, HH:MM Uhr`
  bleibt — wir lösen nur den Zeitzonen-Bug).

---

## Heilige Tafeln respektiert

- Pflege-Sitzung läuft als eigener PR (Sub-(e)-Folge-Pflege 3 von 3).
- Render-Schicht-Eingriff bleibt minimal (10 Zeilen Code-Patch).
- `_meta.certifiedAt`-Spec-Vertrag unverändert (UTC-ISO).

---

## Alle drei Sage-Sub-(e)-Folge-Pflegen abgeschlossen

| # | Pflege | PR | Status |
|---|---|---|---|
| 1 | Modul 17 Widget Bronze/Gold-Render | #185 | ✅ gemerged 2026-05-26 |
| 2 | Endknoten-Modul-05-Update | extern (MR + MM) | offen — Brief liegt |
| 3 | Modul 16 Modal-Local-Time | dieser PR | ✅ in Arbeit |

Nach Merge dieses PRs sind alle drei **Sage-internen** Folge-Pflegen
durch. Übrig: zwei externe Bau-Sitzungen in MR + MM für die
Endknoten-Modul-05-Update-Pflege (Pflege 2).

---

## Was offen blieb

- **Klaus' Browser-Sichttest** Modal-Datum lokal in DeX-Chrome
  nach Endknoten-Update — Beweis MESZ-Lokal statt UTC.
- **Endknoten-Sammel-Update-PR** pro MR + MM nach allen drei
  Sage-Pflegen + Endknoten-Modul-05-Update fertig: alle Updates
  (Modul 17 Stufen-Render + Modul 16 Local-Time + Modul 05 Auto-
  Dispatch) in einem Endknoten-PR pro Repo.
- **Sub-(e)-Folge-Pflege 2/3 (Endknoten-Modul-05-Update)** als
  zwei externe Bau-Sitzungen (MR + MM). Codeblock für MR wurde
  bereits im Sage-Chat ausgegeben.

---

## Nächster sinnvoller Schritt

1. **PR #186 (dieser) mergen** auf Klaus' Zuruf.
2. **Pflege Endknoten-Modul-05-Update** als externe Bau-Sitzung
   in Mein-Rezeptbuch starten (Codeblock liegt im Sage-Chat).
3. Danach analoge externe Bau-Sitzung in Mein-Mixarium.
4. Nach beiden Endknoten-PRs: **Endknoten-Sammel-Update-PR** pro
   MR + MM mit den Sage-Pflegen 1+3 (Modul 17 + Modul 16) als
   Vorlage.

---

## PR-Konvention

Branch `claude/pflege-16-modal-local-time`, Draft-PR folgt
unmittelbar nach Commit + Push. Klaus zieht ihn ready+merge via
„PR mergen"-Zuruf.
