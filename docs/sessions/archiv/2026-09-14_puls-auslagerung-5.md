# PULS-Auslagerung — eine Sitzung vom 2026-09-14 (Sichttest)

**Ausgelagert am 2026-09-14** (A18, Abschluss). `docs/PULS.md` stand bei 3.024 von
3.000 Zeilen. **Ausgelagert, nicht gekürzt** — der Wortlaut steht hier
vollständig und unverändert.

---

## Stand 2026-09-14 (Haupt-Sitzung, Sichttest) · ⚠ DAS FENSTER WAR DEUTSCH — UND DER CODE WAR RICHTIG

**Rolle:** Haupt-Sitzung, Nachtrag zum Rollout. Klaus hat vom Tablet
Bildschirmfotos geschickt: `family-projekt.de` stand auf Englisch, das
Verbinden-Fenster darin **deutsch**. Genau der Befund, gegen den der Sprach-Haken
gebaut wurde — nach dem Rollout.

### Der Code ist es nicht. Gemessen im echten Browser.

`origin/main` lokal ausgeliefert, Chromium, Panel geöffnet:

| `fp_lang` | `<html lang>` | Seite | `_meta` | Panel-Kopf |
|---|---|---|---|---|
| `de` | `de` | deutsch | `{lang:"de", langKeys:237}` | „Mit dem Knotennetz verbinden" |
| `en` | `en` | **englisch** | `{lang:"en", langKeys:237}` | **„Connect to the node network"** |

Der Haken greift. Also ist es die **Auslieferung**, nicht der Bau.

### ⚠ EIN LADEN ZU FRÜH — und der Cache-Bump hätte NICHT geholfen

`sw.js` bedient das Modul über den letzten Zweig: `hit || net`. Gemessen am
echten Service-Worker (Wegwerf-Kopie, Modul nach dem Aufwärmen ausgetauscht):

| | 1. Laden danach | 2. Laden |
|---|---|---|
| **ohne** `CACHE_VERSION`-Bump | **altes Modul** | neues |
| **mit** Bump | **altes Modul** | neues |

**Beide Spalten sind gleich.** Der Bump wirkt hier nicht, weil das Modul gar
nicht im Installations-Vorrat steht: der neue Worker startet zwar mit leerem
Vorrat, übernimmt aber erst, wenn die letzte Seite unter dem alten zu ist.

> **Damit ist die Rollout-Entscheidung „hier kein Bump" bestätigt** — und zwar
> gemessen, nicht begründet. Ich hatte sie nach Klaus' Bild selbst für meinen
> Fehler gehalten; sie war keiner. **Ein Verdacht gegen die eigene Arbeit ist so
> lange eine Vermutung wie jeder andere.**

### ⚠ VIER ANLÄUFE, VIER BLINDE HARNISCHE — alle an derselben Probe

Keiner der vier war ein Befund über den Code; jeder sah wie einer aus:

| # | Was gemessen wurde | Warum es nichts sagte |
|---|---|---|
| 1 | `typeof NEUE_FASSUNG_MARKE` | die Marke stand **in der Modul-Kapsel** — global nie sichtbar, also immer „alt" |
| 2 | dasselbe, mit Warten auf den Worker-Wechsel | derselbe Fehler, nur langsamer |
| 3 | `fetch()` der Datei aus der Seite | las den Vorrat **nach** der Hintergrund-Auffrischung — nicht, was die Seite **ausgeführt** hat |
| 4 | ausgeführtes Modul, aber ohne Aufwärmen | beim **ersten** Laden beherrscht ein frischer Worker die Seite nicht; die Anfrage geht am fetch-Zweig vorbei und landet **nie** im Vorrat — die Schublade war leer, also kam zwangsläufig „neu" |

**Der vierte ist der lehrreichste:** die Probe maß eine Lage, die es bei Klaus
gar nicht gibt. Sein Worker läuft seit Wochen. *Eine Probe, deren Ausgangslage
die des Nutzers nicht trifft, misst etwas anderes, als sie zu messen glaubt.*

### 🔴 „Gerätename" bleibt deutsch — netzweit, und der Rollout konnte es nicht fassen

Im englischen Panel steht mitten zwischen englischen Zeilen **„🏷️ Gerätename:"**.
Gemessen: **0 Treffer** im Kanon-Modul, **3–4 Treffer** im app-eigenen Glue
**jedes** Trägers (`sbkim-init.js` / `rendezvous-init.js`).

Das ist kein Versäumnis des Rollouts, sondern Bauart: NETZWEIT § 2 legt den
Gerätenamen ausdrücklich in den app-eigenen Klebstoff, **nie** in die
byte-kopierte Panel-Datei. Er ist damit von einem Modul-Rollout grundsätzlich
nicht erreichbar.

**Offen, Entscheidung von Klaus** (unten eingereiht): das Etikett in 18 Repos
einzeln übersetzen — oder es in den Kanon ziehen und die Bauart ändern.

### Was die übrigen Bilder zeigen — und was davon SBKIM ist

- **Muttis Rezeptbuch auf EN:** die App selbst ist übersetzt („Save progress",
  „RATE YOUR PROGRESS"). Deutsch bleiben **ihre eigenen** Werkzeuge
  („Übersetzen", „ZIELSPRACHE WÄHLEN (MAX. 2)", „API-Key fehlt", „+ Menu",
  „einklappen") — **Muttis i18n-Bestand, nicht SBKIM.**
- **„SIEGEL"** ist Modul 16/17 und bleibt deutsch — seit dem Rollout benannt.
- **„🌐 Mycel"** ist in beiden Sprachen gleich: ein Eigenname, kein fehlender Text.
- **Kimboard:** der Wähler oben rechts ist der **Mikrofon-Sprachwähler**
  (Spracheingabe), kein UI-Umschalter — deshalb ändert „English"/„Українська"
  am Text nichts. Gemessen beim Rollout (`index.html:4179` setzt `lang` am
  Eingabefeld, nicht am Dokument). **Für den Nutzer sieht er aus wie ein
  Sprachumschalter der App** — Bedien-Befund, keine Fehlfunktion.

**Was NICHT geprüft werden konnte:** ob `family-projekt.de` den neuen Stand schon
ausliefert. Der Ausgangs-Proxy dieser Sitzung sperrt die Domäne (`HTTP 000`,
gemessen). Zwischen „ein Laden zu früh" und „noch nicht deployt" kann von hier
aus **niemand** unterscheiden — beide enden im selben Bild.

**Nächster sinnvoller Schritt:** Klaus lädt die Seite ein zweites Mal. Bleibt das
Fenster deutsch, ist es der Deploy und nicht der Vorrat.
