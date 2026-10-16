# Übergabe · Paper S Fassung 2 · Bestand der Knoten in Märkten und Karte (2026-10-16)

**Rolle:** Hauptsitzung am Sammel-Brief, erster offener Schritt: 6 (Paper S).

## Startprüfung

Sitzungsliste: nur diese Sitzung lief („Sage-Protokol 3 Abarbeitung“ untätig seit 13:58).
Kein offener PR in Sage. Fortschritts-Tabelle: 0–5b und 7 erledigt, 6 teilweise.

## Getan

**Paper S Fassung 2** (Sage #1140): S3, S4 und S5 standen als „geplant“; jetzt gebaut und in 29
Trägern, dazu S5b (Wort „Empfehlen“, Haftung nur für die eine App, 180 Tage, Widerruf mit
Grund, Empfehlung kommt von selbst an). Proben-Tabelle in 9.1. Drei DOI über Suchauszüge.
Abschnitt 3 behauptete für S3 „am Tablet gemessen“ — nicht gemessen, berichtigt.

**Gegenprobe S3** (Sage #1140): auf `main` 12 gefangen · 2 tote Anker (rc=1). Ursache: #1136
hat den Frage-Weg umgeschrieben (Frage zuerst als Objekt, damit sie Bürgschaften mitnimmt),
die Anker suchten den alten Wortlaut. Nachgezogen: 14 gefangen, 0 tot, P2/P3 mit ihrem Namen.

**Bestand (Klaus mitten in der Sitzung: „ich habe nicht nur 14“).** Die 13 Träger im
Codeblock des Briefs sind die Ausgangslage vom 2026-10-15; heute tragen **29** Repos den
Kanon. Abgeglichen gegen die Kataloge und die Karte:

| Ort | fehlte | nachgezogen |
|---|---|---|
| Markt family-projekt.de (`assets/config/listings.js`) | Mein In-and-Out-Book, Workflow Calculate, Workflow Bedarfsanalyse | family-project #FP_PR (Klaus' Ja: alle drei) |
| Markt PWA Toolpoint | dieselben drei | PWA-Toolpoint #PT_PR |
| Adressbuch der Mycel-Karte (Symbol, Link, Kurztext) | In-and-Out-Book, Auslieferungsprüfer, Sende-Prüfer, Workflow Calculate, Workflow Bedarfsanalyse, Workfloh PDF, Kim Hub Company, SBKIM-Demo | mycel-karte #33, Sage-Kopie in diesem PR |
| Kim-sync | in keinem Markt | bleibt draußen (privat, Klaus 2026-10-15) |

Fund dabei: `adressSchluessel()` streicht Umlaute; der Eintrag `kuechenzettel` traf „Küchenzettel“
(`kchenzettel`) nie. Ergänzt.

Sages Knoten-Tabelle (`sbkim/NETZ-STAND.md`) führt Sporen für 21 Knoten; von den 29 Trägern
fehlen dort Alis-Moderaum, Company-Brain, Kim-sync, Mein-Workfloh-Page, Perfect-Skin-Beauty,
Perfect-Skin-Fashion, Sende-Pruefer, Workflow-Calculate, Workflow-Needs, Workflow-PDF. Eine
Spore entsteht im Browser mit dem Schlüssel der App; nicht von hier nachziehbar (Pflege-Liste).

## Gemessen

- Sage: Proben S1–S5b 13/27/19/33/70/44/42/13/11 grün; Gegenproben 7/14/14/15/31/24/31/10.
- mycel-karte: alle Proben grün (63 · 76 · 7 · 40 · 37 · 12 · 32 · 4; Gegenproben 35/35, 40/40,
  14/14). Neun echte Knotennamen treffen ihren Eintrag (Abgleich, keine eigene Probe).
- family-project / PWA Toolpoint: siehe die PRs; rot und auf `main` genauso benannt.

## Nicht gemessen

Tablet. Die drei Fallbeispiel-Seiten (Paper S 11.4): aus dem Container gesperrt.

## Nächste Sitzung

Weiter bei Schritt 6 (Paper S: Klaus' Gegenlesen, 11.4 von seinem Gerät, dann HTML und EN).
