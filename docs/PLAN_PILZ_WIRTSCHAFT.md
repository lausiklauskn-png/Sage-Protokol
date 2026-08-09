# Pilz-Wirtschaft — wovon das Netz leben soll

**Phase D.2 der Pipeline · Stand 2026-08-09 · lebendes Dokument**

> Grundlage: die vollständige Analyse von `lausiklauskn-png/semantic-match-demo`
> (17 Dateien, Stand `031ab12` vom 2026-07-28), gegengerechnet gegen den Ist-Stand
> von family-project, Sage und den zwölf weiteren Knoten am 2026-08-09.
>
> **Was dieses Papier ist:** eine Bestandsaufnahme mit Zahlen und ein Vorschlag,
> in welcher Reihenfolge Geld entstehen kann. **Was es nicht ist:** ein
> Geschäftsplan mit belastbarer Umsatzprognose. Wo geschätzt wird, steht
> „geschätzt". Wo gemessen wurde, steht die Zahl mit Datum.

---

## 0. Warum dieses Papier jetzt kommt

In `CLAUDE.md` § Pipeline steht Phase **D.2 (Pilz-Wirtschafts-Spec)** seit Mai
mit einem ausdrücklichen Vorbehalt:

> „Genossenschaft / Lizenz-Modell / Token / etwas, das wir heute nicht benennen
> können. **Bleibt bewusst offen**, bis Phase A/B/C technisch fertig ist und
> reale Pilz-Bauten existieren, an denen sich das Modell bewähren kann."

Diese Bedingung ist eingetreten. Es gibt vierzehn laufende Apps, einen
Marktplatz mit Einreich-Weg, einen nächtlichen Mess- und Wächter-Lauf, ein
Siegel und eine bewiesene server-lose Cross-Knoten-Suche. Der Vorbehalt war
richtig — ein Wirtschaftsmodell ohne reale Bauten wäre geraten gewesen. Jetzt
gibt es etwas zu rechnen.

Auslöser ist Klaus' Frage vom 2026-08-09, wörtlich: *„Wie können WIR daraus
eine möglichst mit wenig Aufwand / mehr Automatisierung gewinnbringendes
Geschäftsmodell umsetzen? Evolution im Pilz-Mycel, um davon leben zu können."*

---

## 1. Der Kassensturz — was das Konzept kostete, was schon dasteht

Die `Kosten_Nutzen_Analyse_PWA_Plattform.pdf` (Mai 2026) beziffert die
Plattform auf **65.000–116.500 €** in 26–36 Wochen. Posten für Posten gegen den
Ist-Stand geprüft:

| Baustein laut Konzept | Preisschild im Papier | Ist-Stand 2026-08-09 |
|---|---|---|
| Semantic Matching Engine (Kerntechnik) | 20.000–37.500 € | **gebaut** — Modul 03 Embedding + Modul 04 Match |
| Vektordatenbank (Pinecone/Weaviate) | 50–200 €/Monat laufend | **entfällt** — `listings-vec.json`, int8-quantisiert, im Repo. 0 € |
| Plattform-Grundgerüst (zwei Portale, Backend) | 18.000–34.000 € | **gebaut** — `markt.html`, Studio, `einreichung.php` |
| Bidirektionale Prompt-Pipeline | 8.000–15.000 € | **zur Hälfte** — `matchDimensions` steht, die Bedarfs-Seite hat keinen Treibstoff (§ 6) |
| Matching- & Ranking-Engine | 4.000–7.000 € | **gebaut** — inkl. Zwei-Maß-Unterscheidung Rangfolge/Urteil |
| KI-Sicherheitsscan eingereichter Apps | 2.000–4.000 € | **gebaut** — der Wächter (Sicherheits-Fingerabdruck, seit PR #240) |
| Zertifizierungssystem, Entwickler-Stufen | 2.000–3.500 € | **gebaut** — SBKIM-Siegel, Bronze/Gold |
| Treuhand (PayPal-Escrow) | 2.000–4.000 € | **nicht gebaut** |
| Gerätegebundener Kopierschutz (DRM) | 4.000–7.000 € | **nicht gebaut — und soll es nicht** (§ 8) |
| Reichweite des Partners (275.000 Abonnenten) | „ersetzt 100.000–200.000 €" | **nicht vorhanden** |

**Befund:** Die teure technische Hälfte steht — nicht als Konzept, sondern als
laufender Code auf vierzehn Knoten, in Heimarbeit, ohne Fremdkapital. Nicht
gebaut ist genau das, was Geld bewegt: **ein Zahlungsweg und eine zahlende
Gegenseite.** Und der eine Baustein, auf dem die ganze Rechnung ruhte — die
Reichweite eines Partners — ist nie eingetroffen.

---

## 2. Der Messwert, der die Richtung entscheidet

Der Marktplatz listet **vierzehn Apps. Alle vierzehn sind Klaus' eigene.**
Fremde Einträge: **null.**

Das liegt nicht am Preis. Die ersten hundert fremden Plätze sind **kostenlos**
(Gründer-Angebot, scharf seit 2026-07-12). Vier Wochen gratis, kein einziger
fremder Eintrag.

Das ist keine Enttäuschung, sondern ein Messwert, und er sagt etwas Genaues:
**Der Engpass ist nicht die Technik und nicht der Preis, sondern dass niemand
weiß, dass es das gibt.** Die eigene Kosten-Nutzen-Analyse hat das im Mai
bereits beziffert, im Vergleich „mit/ohne Partner":

> „Erste Entwicklerbasis — ohne Partner: Kaltstart 3–6 Monate Akquise, Kosten
> 10.000–20.000 € Marketing. Reichweite beim Launch — organisch: 0 am Tag 1."

Genau dieser Fall ist eingetreten. Er war vorhergesagt.

**Folge für die Automatisierungs-Frage:** Automatisierung spart Arbeit an einem
Weg, den jemand geht. Wo noch niemand geht, spart sie nichts. Die Break-even-
Tabelle des Papiers braucht **400 aktive Apps und 350 Käufe im Monat** für
2.065 € — von vierzehn auf vierhundert kommt man nicht durch Bauen.

---

## 3. Die Umkehrung: der Marktplatz hat die falsche Aufgabe

Der Marktplatz ist nicht falsch gebaut. Ihm ist die falsche Rolle zugewiesen.

- **Als Provisions-Maschine** braucht er eine Menschenmenge auf beiden Seiten.
  Die gibt es nicht, und sie entsteht nicht von selbst.
- **Als Beweisstück** braucht er genau das, was vorhanden ist: vierzehn echte,
  täglich gemessene, offline lauffähige Apps mit sichtbaren Zahlen — auch den
  schlechten.

Ein Marktplatz ohne Publikum ist ein leerer Laden. Dieselbe Seite als
**Schaufenster einer Werkstatt** ist etwas anderes: sie muss keine Menge
anziehen, sondern **einen** Betrieb überzeugen, der ohnehin schon fragt.

Daraus folgt die Reihenfolge in § 4 — sie ist der Reihenfolge des
Konzeptpapiers **genau entgegengesetzt**. Das Papier durfte anders rechnen,
weil es einen Partner mit 275.000 Abonnenten voraussetzte.

---

## 4. Drei Einnahmewege, sortiert nach dem, was zuerst zahlt

### ① Auftragsarbeit — zahlt zuerst

*„So eine App, aber für meinen Betrieb."* Im Konzeptpapier ist das der
Customization-Service (§ 7.3), dort mit Berater-Stundensätzen von 85–130 €.

| | |
|---|---|
| Braucht | zwei bis drei Kunden — **keine Menge** |
| Rechnung (geschätzt) | 50 Std./Monat × 50 € = 2.500 €/Monat |
| Automatisierbar | kaum — es ist Gespräch und Handwerk |
| Rolle des Marktplatzes | Portfolio, das das Gespräch eröffnet |

Das ist der einzige Weg auf dieser Liste, der **ohne Publikum** funktioniert.

### ② Eine Fach-App als Produkt — skaliert danach

Der klarste Fall ist **WorkFloh**: ein digitaler Auftragszettel für
Werbetechnik- und Handwerksbetriebe. Öffentlich zum Verkauf angeboten seit
Klaus' Wort vom 2026-07-25.

| | |
|---|---|
| Form | einmalig 300–600 € + 15–25 €/Monat Wartung (geschätzt) |
| Rechnung (geschätzt) | 100 laufende Kunden ≈ 2.000 €/Monat **wiederkehrend** |
| Braucht | ~100 Kunden — erreichbar über Jahre, nicht über Nacht |
| Automatisierbar | teilweise (Testphase, Schlüssel, Rechnung) |

**Das Wiederkehrende ist der Punkt, nicht der Verkauf.** Von einmaligen
Verkäufen lebt niemand; von Wartung schon.

### ③ Marktplatz-Provision — zuletzt, wenn überhaupt

Erst wenn über ① und ② genug Betriebe das Netz kennen. Vorher ist jede Arbeit
daran Arbeit an einem leeren Laden.

---

## 5. Was „davon leben" konkret heißt

Damit die Frage nicht im Ungefähren bleibt — bei einem angenommenen Bedarf von
**2.000–3.000 € im Monat**:

| Weg | Was dafür nötig wäre | Einschätzung |
|---|---|---|
| Marktplatz-Provision, 10 % auf ⌀ 59 € | **400–500 Käufe im Monat** | unrealistisch auf Sicht |
| Jahresbeitrag fremder Einträge | bei 50 €/Jahr: **500 zahlende Anbieter** | unrealistisch, solange 0 fremde Einträge |
| Fach-App mit Wartung | **100 laufende Kunden** à ~20 €/Monat | erreichbar, braucht Jahre |
| Auftragsarbeit | **2–3 Kunden**, ~50 Std./Monat | erreichbar, braucht Gespräche |

Alle Zahlen außer der ersten Spalte sind Schätzungen. Die Aussage, die trägt,
ist die **Größenordnung**: die beiden Marktplatz-Wege brauchen Hunderte
Fremde, die beiden Werkstatt-Wege brauchen wenige Kunden.

---

## 6. Die technische Lücke, die zum Geschäft gehört

`matchDimensions` in Modul 04 kann beides:

```
Lane 1  queryCap   × passageNeeds     A bietet → B sucht
Lane 2  queryNeeds × passageCap       A sucht ← B bietet
→ fachlich / prozess / skalierung + bruecke
```

Das ist genau die Symmetrie-Forderung des SBKIM-Papiers, in Code, samt
LLM-Richter für Stufe B. **Aber keine Spore trägt Fähigkeit und Bedarf
getrennt** — Suche über alle Module und die ganze `INTERFACES.md` nach
`capVector`/`needsVector`: null Treffer. Jeder Knoten hat einen `domainVector`
und fällt damit in den Nur-Anbieter-Modus.

**Wirtschaftlich gelesen:** Die vierzehn Knoten sagen, was sie *sind*. Keiner
sagt, was er *braucht*. Ein Marktplatz, auf dem niemand seinen Bedarf äußert,
kann nicht vermitteln — er kann nur auflisten. Das ist dieselbe Lücke wie in
§ 3, einmal technisch und einmal wirtschaftlich formuliert.

**Nicht sofort bauen.** Erst messen, ob die zweite Spur die Rangfolge
tatsächlich verbessert (Werkbank + Messung, siehe
`family-project/docs/BRIEF_UEBERGABE_2026-08-09_BAUPLATZ.md`). Ein
nachgewiesenes „bringt nichts" spart den Bau.

---

## 7. Wo Automatisierung wirklich etwas bringt

Nur dort, wo ein **wiederkehrender Handgriff** zwischen einem vorhandenen
Interessenten und dem Geld steht. Vier kleine Dinge, keine großen:

1. **Ein zweiter Knopf am Marktplatz: „Ich hätte gern so etwas für meinen
   Betrieb."** Heute gibt es ein Formular zum *Eintragen* einer App und einen
   Spenden-Knopf. Es gibt keinen Weg für den, der etwas *bestellen* will. Die
   Maschinerie steht (`einreichung.php` mit Warteschlange, Spam-Falle,
   Rate-Limit, Mail an `info@`) — sie braucht nur einen zweiten Anlass.
   **Der billigste denkbare Schritt, an dessen Ende Geld stehen kann.**
2. **Wartung statt Verkauf.** In `assets/config/spenden.js` steht `yearlyUrl`
   leer, mit dem Vermerk „noch nicht geklärt". Das ist die wichtigste
   ungeklärte Zeile im ganzen Netz — aber **nicht** als Marktplatz-Gebühr,
   sondern als Wartungsbeitrag für Betriebe, die eine App im Alltag benutzen.
3. **Der Beweis läuft bereits.** Nächtliche Messung, Wächter, Siegel, die
   Sporen-Auswertung — das ist das Verkaufsargument, und es kostet keine
   weitere Minute. *„Meine Apps laden in zwei Sekunden. Hier sind die Zahlen,
   täglich neu gemessen, auch die schlechten."* Schwer nachzumachen, weil man
   es ehrlich machen müsste.
4. **Testphase mit Schlüssel, ohne Kopierschutz-Theater.** Eine signierte
   Lizenzdatei, fail-soft: nach Ablauf sagt die App „Testphase vorbei" und
   wehrt sich nicht. Wer kopieren will, kopiert ohnehin. Bezahlt wird für
   Wartung und dafür, dass jemand ans Telefon geht.

**Was Automatisierung nicht kann:** Kunden erzeugen. Das bleibt Gespräch.

---

## 8. Regeln — was gilt, was neu ist

**Der Empfangsmodus blockiert den Verkauf nicht.** Auf den ersten Blick scheint
„kein Crawler, keine Pulsation, keine Eigenanfragen — Empfangsmodus mit
Antwortrecht" gegen aktive Akquise zu stehen. Tut es nicht: die
Vier-Schichten-Lesart hat das bereits versöhnt — *„Akquise gehört in die
Pilz-Schicht, nicht ins Mycel."* Verkaufen ist oberirdisch, sichtbar, benannt.
Der Knoten bleibt unverändert Empfangsmodus. **Keine Regeländerung nötig.**

**Die Grenze zwischen Verschenktem und Verkäuflichem muss gezogen werden.** Das
Protokoll ist gemeinfrei, die Referenz-Implementierung MIT. Das ist richtig und
die Grundlage der Standard-Strategie („ein Protokoll, das nur einer benutzt,
ist kein Standard, sondern ein Produkt" — `Everlast_Pitch.html`). Daraus folgt
verbindlich:

> **Die Module sind nicht das Produkt.** Verkäuflich sind die fertigen Apps,
> die Anpassung an einen konkreten Betrieb und die laufende Wartung. Wer beides
> vermischt, verkauft entweder nichts oder verliert den Standard.

**Neue Regel — kein Einnahmeweg, der täuscht oder einsperrt.** Kein
DRM-Theater, keine künstliche Knappheit, keine geschönten Messwerte, keine
Dark Patterns. Nicht aus Idealismus: der gesamte Unterschied zu den großen
Anbietern ist der Ehrlichkeits-Apparat (gemessene Zahlen, Wächter, Siegel,
„Rangfolge ist kein Urteil"). Wer Ehrlichkeit verkauft und dann Nutzer
austrickst, verbrennt sein einziges Kapital. Konkrete Anwendung: der
gerätegebundene Kopierschutz aus dem Konzeptpapier (4.000–7.000 €) wird
**nicht** gebaut — er widerspräche außerdem der bestehenden Tafel
*„Obfuskation ist ausdrücklich NICHT der Weg"*.

**Anschluss an bestehende Tafeln:** Fremdnutzer-/Marktplatz-Brille (fail-soft,
klar benennen, was passiert), Auslieferungs-Brille (was gibt der Server
wirklich heraus), kein PII. Alle drei gelten unverändert weiter und werden
durch dieses Papier nicht gelockert.

---

## 9. Was ausdrücklich NICHT gebaut wird

| Nicht bauen | Grund |
|---|---|
| Gerätegebundener Kopierschutz / DRM | widerspricht der Obfuskations-Tafel; teuer; hält niemanden auf |
| Treuhand/Escrow-System | löst ein Problem, das erst ab vielen Transaktionen existiert |
| Entwickler-Stufen 1–4 aus dem Konzept | setzt Hunderte Entwickler voraus; das Siegel deckt den Zweck heute ab |
| Marktplatz-Provisionsabrechnung | nichts zu verprovisionieren, solange fremde Einträge = 0 |
| Eigenes Embedding-Modell | war schon im Papier ausgeschlossen (spart 150.000–300.000 €) — gilt weiter |

Diese Liste ist so wichtig wie die Vorschlagsliste. Jeder dieser Bausteine
sieht nach Fortschritt aus und wäre Arbeit an einem leeren Laden.

---

## 10. Erster Schritt

**Ein zweiter Knopf am Marktplatz: „Ich hätte gern so etwas für meinen
Betrieb."** Ein Formular, ein Satz, Landung im vorhandenen Postfach-Weg.

Warum genau dieser: die halbe Maschine steht, der Bau ist klein, und es ist der
einzige Punkt auf dieser ganzen Liste, an dessen Ende jemand Geld überweisen
könnte. Alles andere ist Vorbereitung auf eine Nachfrage, die noch keinen Weg
hat, sich zu melden.

---

## 11. Offene Entscheidungen — nur Klaus

1. **Everlast GmbH.** Das Konzept-Repo ist über weite Strecken ein Angebot an
   eine namentlich genannte Firma (30 Fundstellen in 7 Dateien, samt
   3-%-Gebühr im Transaktionsfluss). Solange nicht entschieden ist —
   *noch aktuell · Historie · soll raus* — wird darauf **nichts** aufgebaut.
   Offen seit 2026-08-09.
2. **Der Jahresbeitrag (`yearlyUrl`).** Marktplatz-Gebühr oder
   Wartungsbeitrag? Dieses Papier empfiehlt: Wartungsbeitrag.
3. **Preis und Form für WorkFloh.** Einmalpreis, Wartungsbeitrag, oder beides.
4. **Wie viel Zeit im Monat** für Akquise-Gespräche zur Verfügung steht. Davon
   hängt ab, ob ① überhaupt der erste Weg sein kann.

---

## 12. Belege und Fundstellen

| Aussage | Quelle |
|---|---|
| 65.000–116.500 €, 26–36 Wochen, Break-even ab Monat 8 bei 400 Apps | `semantic-match-demo/Kosten_Nutzen_Analyse_PWA_Plattform.pdf` |
| Engine 20.000–37.500 €, „einmal gebaut, beliebig integrierbar" | `Kostenanalyse_Everlast_Engine_PWA.pdf` |
| PWA-Markt +30,2 % CAGR auf 34,6 Mrd. $, 54.000 aktive PWAs | `Marktanalyse_PWA_Plattform.pdf` |
| Bidirektionalität als Alleinstellungsmerkmal | `USP_Bidirektionales_Matching.pdf`, `SBKIM_Paper_DE.html` § 3.1 |
| „Ohne Partner: Kaltstart 3–6 Monate, 10.000–20.000 € Marketing" | `Kosten_Nutzen_Analyse_PWA_Plattform.pdf` § 5 |
| 14 Einträge, alle eigene | `family-project/assets/config/listings-vec.json` |
| Erste 100 fremde Plätze gratis, seit 2026-07-12 | `family-project/markt.html`, interne Politik-Notiz |
| `yearlyUrl` leer, „noch nicht geklärt" | `family-project/assets/config/spenden.js` |
| Einreich-Weg mit Warteschlange, Spam-Falle, Rate-Limit | `family-project/server/einreichung.php` |
| `capVector`/`needsVector` nirgends vorhanden | Suche über `src/modules/*` + `docs/INTERFACES.md`, 2026-08-09 |
| „Akquise gehört in die Pilz-Schicht" | `CLAUDE.md` § Vier-Schichten-Lesart, Schicht 2 |
| „Obfuskation ist ausdrücklich NICHT der Weg" | `CLAUDE.md` § Fork ≠ Vorfall |

---

## 13. Nebenbefunde aus der Analyse (nicht wirtschaftlich, aber fällig)

- **`semantic-match-demo/CLAUDE.md` gehört einem anderen Repo.** Es ist eine
  Kopie der Regeln von Muttis Rezeptbuch (Build-Skript, Icon-Regeln,
  `QC_MeinRezb`-Dateien) und behauptet zudem „Das Repo ist privat" — es ist
  öffentlich. Das Repo hat seit dem 2026-07-28 keine gültige Verfassung.
- **`hub.html` veröffentlicht Klarnamen und private E-Mail-Adresse.** In
  `spenden.js` wurde am 2026-08-01 genau das rückgängig gemacht (PayPal-Adresse
  raus, weil Spam-Sammler sie finden). Als Kontakt für einen Pitch kann es
  gewollt sein; als Dauerzustand ist es dieselbe Falle.
- **Die Demo ist technisch überholt:** vier fremde Adressen (Google Fonts,
  PeerJS, QRCode, jsQR), Modell-Kennung vom Mai 2025, API-Schlüssel im
  Klartext in `localStorage`. Nach heutigen Bauregeln wäre nichts davon so
  gebaut. **Ob die Live-Seite noch läuft, ist ungeprüft** — die Sitzungs-
  Umgebung kommt nicht ins offene Netz.

---

**Fortschreiben:** Wer einen Punkt entscheidet oder widerlegt, trägt es hier
ein (Datum + was gilt jetzt) und vermerkt es in `docs/PULS.md`. Dieses Papier
bindet, bis eine Messung es widerlegt — Tafel-Evolutions-Klausel.
