# Brief — Pflege Modul 16 Modal: UTC-Zeit → MESZ-lokal

**Anlass:** Endknoten-Sichttest Cross-Knoten Sub (e) am 2026-05-26 hat
gezeigt: das SBKIM-Siegel-Modal zeigt das „Bezeugt seit … Uhr"-Datum
in UTC statt in der lokalen Zeitzone des Endnutzers.

**Klaus' Befund (DeX-Chrome auf Galaxy Tab S6):**

> Datum/Uhrzeit ist nicht aktuell, ich vermute nicht Mitteleuropäische
> Zeit, eher Amerikan.

Klaus' Tablet zeigt MESZ (UTC+2). Modal zeigt aber UTC-Wert. Beispiel:
Klaus' lokal 21:54 = 19:54 UTC. Modul 16 rendert vermutlich
`new Date(certifiedAt).toLocaleString(undefined, …)` oder gar
`certifiedAt`-ISO-String roh — beides zeigt nicht garantiert lokal.

**Fix:** Modul 16 `mountSiegelModal()` muss `certifiedAt`-Anzeige
**explizit lokal** rendern via `new Date(certifiedAt).toLocaleString("de-DE",
{dateStyle:"short", timeStyle:"short"})` (oder ein analoger Approach).

**Kosmetisch — kein funktionaler Bug.** Das Datum selbst (UTC-ISO) im
`_meta.certifiedAt` bleibt korrekt; nur die Anzeige-Renderung wird
lokalisiert.

**Repo:** `lausiklauskn-png/Sage-Protokol` (interne Pflege).

**Pipeline-Stellung:** Folge-Pflege zu Sub-(e)-Sichttest-Bilanz
(Pipeline-Phase A Schritt 5e). Dritte und kleinste der drei
Folge-Pflegen.

**Branch-Vorschlag:** `claude/pflege-16-modal-local-time`

---

## Brief-Codeblock (für den ersten Prompt der Pflege-Sitzung)

```
Du bist eine Pflege-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Pflege Modul 16 Modal — Anzeige des „Bezeugt seit"-
Datums lokalisiert (Klaus' Tablet-Zeitzone MESZ statt UTC). Kleinste
der drei Folge-Pflegen aus dem Sub-(e)-Sichttest-Bilanz 2026-05-26.

Branch: claude/pflege-16-modal-local-time (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md § Pflicht am Sitzungsende.
2. docs/PULS.md jüngsten Sitzungs-Eintrag „Endknoten-Sichttest Cross-
   Knoten Sub (e) + drei Folge-Briefe" → § Folge-Befund (3).
3. docs/components/16_siegel.md § Sub (c) Erklärungs-Modal
   (NUR diesen Block, kein Rest).
4. src/modules/16_siegel.js — Funktion `mountSiegelModal` und
   `renderModalContents` finden; dort wird `certifiedAt` angezeigt.

Pflicht-Disziplin:

- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Kosmetik, kein Sicherheits-
  Modul-Update).
- KEIN Endknoten-Eingriff (Endknoten ziehen nach Merge nach via
  eigener Modul-16-Update-PR — analog Sub-(e)-Re-Aktivierung).
- KEINE Tafel-Umsortierung CLAUDE.md.

Deine Aufgabe:

A. **Code-Lokalisierung** in `src/modules/16_siegel.js`:
   Finde die Stelle, wo der Modal-Text „Bezeugt seit …" gerendert
   wird. Aktuell vermutlich:

   ```js
   var d = new Date(certifiedAt);
   dateLine.textContent = "Bezeugt seit " + d.toLocaleString() + " Uhr.";
   ```

   oder ähnlich.

B. **Fix:** explizit `toLocaleString("de-DE", {dateStyle:"medium",
   timeStyle:"short"})` benutzen. Format-Empfehlung:
   ```
   Bezeugt seit 26. Mai 2026, 21:10 Uhr.
   ```
   (lokal-formatierte Datums-Zeit, eindeutig Zeitzone des Endnutzers).

   Alternative falls Klaus' Spec eine andere Form will: numerisch
   `dd.mm.yyyy, HH:MM`. Spec-Konvention prüfen — Karte 16 § Sub (c)
   sagt aktuell nur „Datum der ersten Bezeugung (z.B. „Bezeugt seit
   2026-05-24, 18:42 Uhr")", das ist mit "de-DE" + medium-style
   konsistent.

C. **Test-Brücke**: in `tests/manual_check.html` Panel 16 ein neuer
   Mini-Test:
   - `var d = SbkimSiegel._meta.certifiedAt;`
   - `var formatted = document.querySelector("[data-siegel-modal] .dateLine")?.textContent;`
   - Prüfen: `formatted` enthält **lokal** das aktuelle Datum mit
     plausibler Stunden-Differenz zu UTC (z.B. +2h für MESZ).

D. **Headless-Smoke** `tests/smoke_bau16_sub_e_bronze.mjs` erweitern:
   eine Probe, die `Intl.DateTimeFormat`-Output prüft (deterministisch
   nicht möglich ohne Zeitzonen-Mock; Probe könnte einfach prüfen,
   dass `dateLine.textContent` einen Datums-String enthält, der
   *nicht* `"T"` enthält — UTC-ISO hat `T`, lokal-Format nicht).

E. **Karte 16 § Sub (c)** explizit ergänzen: „Datums-Anzeige
   im Modal verwendet `toLocaleString('de-DE', {dateStyle:'medium',
   timeStyle:'short'})` — zeigt das Datum in der Zeitzone des
   Endnutzers, nicht UTC."

F. **INTERFACES.md § 1 Modul 16 Geprüft-Zeile** + § 10
   Änderungsprotokoll neue Tabellen-Zeile.

G. **`status.json` Modul 16** unverändert lassen (Score bleibt
   `"stub"`); Pie nicht regenerieren (kein Score-Wechsel).

H. **Endknoten-Hinweis im PR-Body**: Mein-Rezeptbuch + Mein-Mixarium
   müssen `sbkim/16_siegel.js` auf den neuen Sage-Commit nachziehen —
   eigene Folge-PRs pro Endknoten (kombinierbar mit Pflege 17 + Pflege
   Endknoten-Modul-05).

Pflicht am Ende:

- src/modules/16_siegel.js mit lokal-formatierter Datums-Anzeige.
- node --check grün.
- Karte 16 § Sub (c) ergänzt.
- INTERFACES.md § 1 + § 10 nachgezogen.
- Commit + Push + Draft-PR.
```

---

## Hintergrund

**Klaus' Workflow** ist DeX-Chrome auf Galaxy Tab S6 (Android). Klaus
arbeitet in der MESZ-Zeitzone (UTC+2 Sommerzeit). Das Modal zeigt
`certifiedAt`-Werte, die per `new Date().toISOString()` in UTC erzeugt
sind.

**Aktuelle Render-Logik** (vermutet, ohne Code-Lesung):

```js
"Bezeugt seit " + new Date(certifiedAt).toLocaleString() + " Uhr"
```

`toLocaleString()` ohne Argumente verwendet Browser-Default-Locale +
-Zeitzone. Auf einigen Android-Chromes (oder bei nicht-konfigurierten
Browser-Locales) kann das UTC bleiben oder einen US-Stil ausgeben.

**Robust-Fix:** explizit `toLocaleString("de-DE", {dateStyle:"medium",
timeStyle:"short"})`. Das nutzt:
- Browser-System-Zeitzone (immer lokal).
- Deutsche Locale-Format-Konvention (z.B. „26. Mai 2026, 21:10").

## Nach dieser Sitzung

- **Endknoten-Update-Sitzungen** ziehen die neue Modul-16-Datei nach
  (kombinierbar mit Pflege 17 + Pflege Endknoten-Modul-05).
- **Klaus' Sichttest** verifiziert: Modal zeigt lokales Datum, nicht
  UTC.

## Heilige Tafeln dieser Sitzung

- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Kosmetik).
- KEIN PROTOCOL_VERSION-Bump.
- KEIN funktionaler Vertrags-Eingriff (Modul 16 Public Surface bleibt
  unverändert; `_meta.certifiedAt` bleibt UTC-ISO).
- KEINE Tafel-Umsortierung CLAUDE.md.
