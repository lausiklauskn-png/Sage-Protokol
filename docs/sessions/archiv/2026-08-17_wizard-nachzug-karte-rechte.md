# Übergabeprotokoll 2026-08-17 — Wizard-Nachzug · Karte auf 19 · Rechte-Sätze

**Rolle:** Hauptsitzung (Fortsetzung des Gerätenamen-Tages).
**Umfang:** 20 Repos · 44 PRs, alle gemergt.

---

## 1. Der Wizard, der sich selbst widersprach

**Auslöser:** Klaus' Bildschirmfoto von Perfect Skin Beauty. Im selben Fenster
stand oben „nodeId: jtpnxZSxv1c…" (Schritt 1) und unten „Noch keine Identität —
oben zuerst eine anlegen" (Schritt 5), dazu in der Mitte eine rote Zeile
„Keine Identitäten in sbkim_keys" (Schritt 3).

**Die Modul-Logik war die ganze Zeit im Recht.** Headless nachgestellt mit den
App-eigenen Kopien und `fake-indexeddb`: `getOrCreateIdentity` → `listIdentities`
liefert `["main"]`. Der Fehler saß in der **Anzeige**: `refreshWizardIdentities()`
lief nur beim Öffnen des Fensters und nach einem Identitäts-Wechsel, nie nach
Schritt 1 oder 2. Beide Meldungen waren echt — nur veraltet.

**Nachgezogen in 18 Repos.** Nicht von Hand: ein Patcher mit harten Ankern
(schreibt gar nichts, wenn ein Anker nicht genau einmal passt). Die Gegenprobe
ist der eigentliche Beweis — aus dem Vorher-Stand von Perfect Skin Beauty
erzeugt er **byte-exakt** dessen gemergte Fassung.

| Gruppe | Repos | was fehlte |
|---|---|---|
| alte Fassung | PSB · PS-Fashion · Alis · Kimboard · WorkFloh-Page | Auffrischung nach Schritt **1 und 2** |
| neuere Fassung | 11 Repos + Sage-Kanon | Auffrischung nach Schritt **2** |
| ohne Wechsler | Kimseek · Privat-Brain | nur die alte Fehlerzeile geheilt |

**Sage hat ZWEI Dateien:** `assets/siegel-inhalt.js` ist Kanon,
`sbkim-bundle-voll/modules/siegel-inhalt.js` muss byte-gleich sein — der
Drift-Guard zeigt auf `ASSETS`, nicht auf `CANON`.

**Acht Cache-Bumps.** Tomys-Hub aus einem anderen Grund als die übrigen: die
Datei steht dort **nicht** im Vorrat, aber der Service-Worker bedient statische
Dateien **cache-first** — einmal geholt, bliebe sie ohne Bump dauerhaft alt.

**Offener Befund:** Kimseek und Privat-Brain haben **keinen Identitäts-Wechsler**
(Baustein 5). Nach dem Siegel-Rezept gehört er zum Pflicht-Inhalt. Nachrüsten
ist ein eigener Bau, kein Nachzug.

---

## 2. Perfect Skin Beauty ist der 19. Knoten

Spore reziprok geprüft: `✔ VALID`, 9/9 Pflichtfelder, `domainVector` 384 Floats.

| gegen | Cosinus | |
|---|---|---|
| Perfect Skin Fashion | **0.8612** | über dem Riegel |
| Alis Moderaum | 0.7911 | darunter |
| Sage | **0.7824** | darunter — richtig so |

Darum `verified-spore`, nicht `verified-match`. Zwei Besonderheiten: `sporeUrl`
zeigt auf die **eigene** Adresse (perfectskinbeauty.de, einziges der jungen fünf
mit `CNAME`), und `previousNodeIds` hält `jtpnxZSxv1c…` fest.

**Klaus' Frage, hier festgehalten:** eine neue Spore ändert die Kennung **nicht**
— sie wird mit dem vorhandenen Schlüssel signiert, die `nodeId` kommt aus dem
öffentlichen Schlüssel. „Identität erzeugen" legt nur an, **wenn das Fach leer
ist**. Die Kennung wechselte, weil PR #45 der App ihre **eigene Schublade** gab.

---

## 3. Mycel-Karte: 13 → 19 Knoten

In Klaus' Aufzeichnung erschien PSB als **loser** Knoten `live_q-sW…` neben den
Pillen. Folge: sechs Knoten waren nur sichtbar, **solange ihre App lief**.

Nachgezogen mit Alias und Adresse (Muster Werbetechnik hatte gar keine).
**Muttis Rezeptbuch bekam eine eigene Pille** — es lag als Alias auf „Mein
Rezeptbuch", und zwei Betreiber sahen wie einer aus.

**Die Fäden hängen nicht alle an Sage:** nur Muttis (0.8766) und WorkFloh
(0.9063) liegen darüber; die vier anderen (0.78–0.79) bekommen den Faden zu dem
Knoten, mit dem sie **wirklich** über dem Riegel liegen.

Zwei neue Wächter auf die **Kopplung** (jeder Samen braucht Alias + Adresse;
kein Faden unter dem Riegel), vier neue Gegenproben — **8 von 8 bemerkt**.

**Nebenbefund:** der Gerätename läuft live — „Kimboard · Klaus Tablet" und
„Sage-Protokoll · Klaus Tablet" standen im Raum, Kimboard mit zwei Kennungen
unter einer Pille.

---

## 4. Einladung: Rolle statt Klarname

Klaus' Entscheidung. Statt „… ist Klaus Nitzsche allein" jetzt „… liegen allein
beim Betreiber (siehe Impressum)" — vier Sprachen, HTML + Markdown + PDF.
Rechtlich unverändert: Urhebervermutung und CC-BY-Nennung hängen an
`impressum.html`, `RECHTE.md`, `LICENSE` und der Git-Historie.

---

## 5. „die Anbieter" → „die KI-Anbieter" (20 Repos)

Klaus' Befund: **„Anbieter" ist im Marktplatz ein feststehender Begriff** — es
sind die Leute, die dort ihre Apps anbieten. Gemeint sind die Anbieter der
KI-Modelle. Verschärft durch die Änderung von Punkt 4: seither steht im Satz
davor „beim **Betreiber**".

Nachgezogen: 20 × `RECHTE.md`, dazu in Sage `CLAUDE.md`, `WEGWEISER.md`, die
Vision-Karte und die Einladung in **vier Sprachen**.

---

## 6. Was fast durchgerutscht wäre (drei Fälle)

**Der PDF-Leser.** `sbkim-demo/papiere/_pdf_text.mjs` meldete **0 Treffer** für
den Klarnamen. Die Null war wertlos: er holt aus 34 Seiten **1819 Zeichen** (nur
die Kopfzeile) und meldet einen ungeöffneten Strom. Aufgefallen an der
Gegenfrage — **er fand auch den neuen Satz nicht**, den ich gerade
hineingeschrieben hatte. Beweis kam von einem zweiten Leser (pdf.js): 26.456
Zeichen, alle Kontrollwörter gefunden.

> **Nachgemessen, und das ist die Entwarnung:** bei den drei bewachten
> Demo-Papieren holt der Haus-Leser **100 %** heraus (9.036 / 17.525 / 6.759
> Zeichen, identisch mit pdf.js, 0 verschlossene Ströme).
> `tests/smoke_papiere_bereinigt.mjs` bewacht zuverlässig. Die Blindstelle
> betrifft **nur** die Einladungs-PDF (eigene mitgelieferte Schriften).
> **Klaus-Entscheid: kein Wächter dafür** — die PDF wird erzeugt, nicht
> bearbeitet, und der eigene Name auf der eigenen Seite wäre kein Vorfall.

**Der PDF-Bau fiel um.** Der Bauer zieht `marked` aus `/tmp/vendor`, und der
Scratch-Ordner war geleert. Rückgabewert 1 — **aber die alte PDF lag noch da**.
Sie sah aus wie gebaut. Merksatz: *eine Datei, die noch daliegt, ist kein
Beweis, dass sie neu ist.*

**Zwei Parallel-Sitzungen.** In Perfect Skin Beauty (#50) und Kimboard (#102)
mergte jemand mitten hinein. Mein Zweig saß jeweils auf dem Stand davor; in
Kimboard hätte ein PR daraus **433 Zeilen fremder Arbeit** zurückgedreht.
Aufgefallen beim Vergleich `origin/main` gegen den Zweig, nicht beim Committen.

---

## 7. Wirtschafts-Papier § 8e — die gemessene Zahl

Klaus hat die echten laufenden Kosten genannt: **Hetzner ~50 €** (Betrieb) +
**Anthropic ~150 €** (Bau) = ~200 €/Monat. Die Trennung ist der Fund: der Server
ist eine Rechnung, die 150 € sind eine Investition, die Klaus selbst dreht.

> **50 € müssen gedeckt werden. 150 € sollten verdient werden.**

Jeder Weg dagegen gerechnet — 2 € je App über PayPal bräuchte **~130 Verkäufe im
Monat**, ein Betrieb mit Betreuungsvertrag **einen**. Dazu zwei Punkte, die
vorher nirgends standen: „Spende" ist nur ohne Gegenleistung eine Spende (sonst
Kauf mit Update-Pflicht nach § 327f BGB), und der Unterstützungs-Knopf deckt den
Server, nicht den Bau-Anteil.

---

## 8. Stand am Ende

| | |
|---|---|
| Sage-Knoten | **19** |
| Karte | 13 → **19** Pillen, v17 |
| Proben | Sage 75/75 · Karte 18/18 + 8/8 Gegenprobe · Toolpoint 617/617 |
| Repos sauber | **20 von 20**, Zweig == `main`, nichts unversioniert |
| `PULS.md` | 2583 Zeilen (11./12.08. ausgelagert), 417 frei |

**Ungeprüft — wartet auf Klaus' Browser:** der Wizard in 18 Repos, die Karte mit
19 Pillen (Hard-Reload), die Einladung ohne Klarnamen.

**Offen:** Company Brain fehlt in `status.json` (keine Spore geschickt) ·
Identitäts-Wechsler fehlt in Kimseek und Privat-Brain · die Preis-Entscheidung
(§ 8e liegt vor, Klaus entscheidet).
