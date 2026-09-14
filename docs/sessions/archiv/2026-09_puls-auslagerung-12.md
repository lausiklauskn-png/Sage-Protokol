# Ausgelagert aus docs/PULS.md — 2026-09-14 (A18-Sitzung)

> **Wortwörtlich**, nichts gekürzt. Die Schutz-Klausel in `docs/PULS.md`
> verlangt auslagern statt kürzen; die Datei stand bei 2.956 Zeilen und der
> neue Eintrag hätte die 3000er-Grenze gerissen.

## Stand 2026-09-14 (Haupt-Sitzung, Rollout) · ✅ MODUL 23 UI IN 18 APPS — UND ZWEI LÜCKEN IN DER GESCHENKBOX

**Rolle:** Haupt-Sitzung, Rollout. Skill `netzweiter-modul-rollout`.
Auftrag war das Ausrollen in „die sechzehn Apps"; **gemessen sind es achtzehn.**

**Drei Generationen sind eine geworden.** Gemessen vor dem Kopieren, gegen
`origin/main` jedes Repos, nicht gegen den Klon:

| Generation | Zeilen | Repos |
|---|---|---|
| `4882c3b68203` | 2249 | 3 — Mein-Mixarium · Mein-Rezeptbuch · family-project |
| `b496bc86b5b2` | 2279 | 13 |
| `d344a851a025` | 2424 | 2 — PWA-Toolpoint · kim-hub-company |
| **`709c4364026e`** | **2960** | **18/18 nach dem Merge** |

**Der Diff wurde je Generation gelesen, nicht überschrieben.** 235–236 entfernte
Zeilen je Generation; für **jede** wurde belegt, dass ihr Literal im Kanon noch
vorkommt (0 ohne Entsprechung). Reiner Kanon-Fortschritt, keine repo-eigene Zeile.

**Elf sha-Pins nachgezogen**, und einer davon zeigt, warum der Brief nicht reicht:
`SB-KIMTool-Point/test/kopien_drift.test.js` pinnt mit **16 Zeichen**
(`b496bc86b5b23ce0`). Eine Suche nach der vollen sha findet ihn **nicht** — die
Falle, vor der das Rezept warnt, und sie hat zugeschnappt. Danach netzweit
gegengeprüft: **keine alte sha mehr irgendwo.**

**Neun `CACHE_VERSION` erhöht** — nur dort, wo das Modul wirklich im Vorrat steht.
Die Zahl kam aus `origin/main`, nicht aus der eigenen Datei (NETZWEIT § 3a).

**Gemessen je Repo, Rückgabewert aus der Prüfung selbst.** Zwei Repos melden
rote Proben, **beide vorbestehend** — belegt per Gegenprobe auf einem frischen
Klon von unberührtem `origin/main`: SB-KIMTool-Point 130/2 (dieselben zwei
Namen, `ERR_MODULE_NOT_FOUND`), Tomys-Hub dieselben zwei. family-project ist
`⊘ nicht lauffähig, nicht rot` (`playwright-core` fehlt).

**Der Sprach-Haken wurde nicht geglaubt, sondern gefahren.** Jede der 18 Kopien
wurde in einem Mini-DOM **geladen** und gefragt: `<html lang="de">` → `de`,
`<html lang="en">` → `en`, 237 Schlüssel. **18/18.**

### ⚠ „Ausgerollt" heißt noch nicht „ändert etwas" — 9 von 18

Gemessen, welche App `<html lang>` beim Sprachwechsel **mitzieht**:

| | Apps |
|---|---|
| ✅ Haken greift heute | Alis-Moderaum · Perfect-Skin-Beauty · Perfect-Skin-Fashion · family-project · Mein-Mixarium · Mein-Rezeptbuch · Muttis-Rezeptbuch · Mein-WorkFloh · Tomys-Hub |
| ⏸ bleibt deutsch | Jasons-Tresor · Kim-Bell · Kimboard · Kimseek · Mein-Tresor · Mein-Workfloh-Page · PWA-Toolpoint · SB-KIMTool-Point · kim-hub-company |

Das ist die **Rückfalllinie, kein Fehler** — aber ohne diese Zeile hieße es
„netzweit ausgerollt" und änderte für die Hälfte der Nutzer nichts.

### 🔴 UND DANN HAT KLAUS' NACHFRAGE ZWEI LÜCKEN AUFGEDECKT

Er bat mitten in der Sitzung darum, **auch Geschenkbox und Baupläne** zu prüfen.
Beides war nötig, und beides hätte der Rollout allein nicht gefunden.

**1 · `SbkimConnect.init({lang})` wurde STILL VERSCHLUCKT.** Die Kiste verspricht
einem Fremden **genau ein `init()`** — und ausgerechnet darüber war die Sprache
nicht erreichbar. Kein Fehler, keine Warnung, nur ein deutsches Fenster.
`<html lang>` wirkte weiter, die Lücke war also nicht kaputt, sondern **stumm**.
Behoben in beiden Bauvorlagen, mit vier Wächtern und Gegenprobe.

> ⚠ **Der zweitwichtigste Wächter misst das GEGENTEIL:** ohne Angabe darf die
> Kiste `lang` **nicht** setzen. Ein erfundener Standard („`de`, wenn nichts
> dasteht") überstimmte `<html lang>` — dann wäre eine englische Seite, die das
> Attribut korrekt mitzieht, wieder deutsch, **und zwar wegen der Kiste**. Ein
> Wächter nur auf „durchgereicht" wäre dafür blind.

**2 · `docs/INTERFACES.md` kannte den Sprach-Haken nicht.** Die Tafel nannte
`init({ nodeName, createIdentity?, corner?, accent? })` — `lang?` fehlte. PR #986
und #988 haben Modul und beide Bauvorlagen geändert, **ohne die Tafel
anzufassen**; die Schnittstelle war vier Tage lang breiter als ihre Beschreibung.

> **Die Regel lautet umgekehrt:** *„Wer eine Schnittstelle ändert, zieht ZUERST
> dort nach, DANN den Code."* Hier lief es andersherum, und es ist niemandem
> aufgefallen — auch mir nicht, bis Klaus ausdrücklich danach fragte.
> Nachgetragen, samt dem Vermerk, dass es nachgetragen wurde.

**Nachgezogen wurden außerdem:** `docs/MYCEL-GESCHENKBOX.md`, beide
Kisten-READMEs und `docs/PFLICHT_MODULE.md` — überall mit der ehrlichen Zeile,
dass ein **Voll-Knoten auf Englisch heute gemischtsprachig** ist (23-UI englisch,
16 und 17 deutsch). Eine benannte Lücke ist Arbeit, eine verschwiegene ist Schaden.

**Kein `ZERTIFIKAT_ASPEKTE`-Eintrag**, und das ist eine Entscheidung, keine
Auslassung: die Regel gilt für **Schutz-Module** (10/11/12/14/15.B). 23-UI ist
Oberfläche. Ein Aspekt ohne Schutz-Änderung ließe das Siegel etwas behaupten,
das nicht dazugehört.

### ⚠ Mein eigener Harnisch war zuerst falsch — und sah aus wie ein Befund

Die drei ersten Sprach-Wächter meldeten rot. Nicht der Code war schuld: mein
Stub hatte `SbkimStorage` weggelassen, und `init()` steigt ohne es mit einem
blanken `return` aus, **bevor** es den UI-Mount erreicht. Ein Fehlschlag, der wie
eine Aussage über den Code aussah und eine über die Probe war.

### 🔴 Dabei herausgefallen, NICHT behoben — eine Frage an Klaus

Genau dieser `return` steht gegen eine Zusicherung, die dreißig Zeilen darunter
im selben File steht: *„Öffentlicher Rendezvous-Knopf — **UNABHÄNGIG von der
Init-Kette** gemountet … soll **immer** erscheinen, auch wenn die Kette oben mal
stolpert."* Fehlt `SbkimStorage`, erscheint er **nicht**.

Ich habe es **nicht** eigenmächtig geändert: ob ein Verbinden-Knopf ohne Speicher
erscheinen *soll*, ist eine Verhaltensfrage im Störfall und damit echtes Zweifeln.
**Offene Frage, unten eingereiht.**

**Gemessen (Sage).**

| | |
|---|---|
| `node tests/run_alle.mjs` | **101 Proben — 101 grün, 0 rot, 0 nicht lauffähig** |
| `tests/smoke_bundle_connect.mjs` | **25 grün, 0 rot** (4 davon neu) |
| `tests/gegenprobe_bundle_sprache.mjs` (neu) | **4 gefangen · 0 durchgerutscht · 0 aus dem falschen Grund** |
| `tests/gegenprobe_bau23_sprache.sh` | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `tests/gegenprobe_bauvorlagen.mjs` | **7/7 bemerkt, kein blinder Fleck** |
| Netzweit | **18/18 tragen `709c4364026e` auf `origin/main`** |

Die neue Gegenprobe läuft je Fall an einer **Wegwerf-Kopie** (`mktemp -d`) — ein
abgebrochener Lauf hinterlässt kein sabotiertes Modul im Depot.

**Was NICHT geprüft ist.** Wie die englischen Texte im echten Fenster stehen,
sieht nur ein Browser — **Klaus' Sichttest steht aus**, und `family-project` ist
dafür der richtige Ort, weil der Befund dort entstand. `16_siegel.js` (47 Texte)
und `17_floating_widget.js` (19) bleiben deutsch.

**Nächster sinnvoller Schritt:** Klaus' Sichttest an `family-projekt.de` auf
Englisch; danach Modul 16 und 17 nach demselben Muster.
