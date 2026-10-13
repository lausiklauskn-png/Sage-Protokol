# Brief 2026-10-13 · Eigenes Netz, Schritt 2 ff. · Firmennetz für Tomys Hub

**Stand:** Schritt 1 ist gebaut (Kanon 05b + 23, PULS 2026-10-13 „Eigenes Netz Schritt 1“).
Noch **keine App** trägt die neue Fassung. Das Relais gibt es noch nicht.

## Klaus' Entscheidungen (2026-10-13)

- Relais „intern Family Project“ unter `wss://relay-intern.family-projekt.de` (Hetzner Cloud-Server).
- Im eigenen Netz verbindet eine App **beim Öffnen automatisch**; im öffentlichen Netz bleibt
  es wie heute (Mein Rezeptbuch lauscht selbst, Sende-Prüfer erst auf Tipp).
- Erster Träger: Sende-Prüfer.
- **Neu, wörtlich:** *„alle Apps, die für Tommys Hub brauchbar sind … miteinander verbinden in
  einem Netzwerk. Und wenn du noch selber brauchbare hast, die dafür sinnvoll wären …“*
- **Neu, wörtlich:** *„In der Mycel-Karte soll dieses Firmennetzwerk separat angezeigt werden
  können. Also mit einem einzigen Klick wird die komplette Seite gewechselt auf das
  Firmennetzwerk, wo ich dann die entsprechenden verbundenen Apps sehen kann und mit ihnen
  interagieren kann oder auch Analyse durchführen kann, getrennt von dem anderen Netzwerk.“*

## Die Apps des Firmennetzes (Klaus' Liste, nachgesehen am 2026-10-13)

| App | heute SBKIM-Knoten? |
|---|---|
| Tomys Hub (samt Tomys WorkFloh) | ja |
| Mein WorkFloh | ja |
| BookLedgerPro | ja (laut PULS, 23-UI #326; lokaler Klon ohne `origin/main`, nicht nachgezählt) |
| Sende-Prüfer | ja |
| Auslieferungsprüfer | ja |
| PWA Toolpoint (Marktplatz + Prüfer) | ja |
| Workflow PDF | **nein** (trägt nur Sage-Module 03/04 für die Suche) |
| Workflow-Needs (Bedarfsanalyse) | **nein** |
| Workflow-Calculate | **nein** (wie Workflow PDF) |

**Vorschläge der Sitzung, Klaus entscheidet:** Mein In-and-Out-Book (prüft, was hereinkommt und
hinausgeht — passt neben Sende-Prüfer) · Company Brain (Suche über Firmen-Dokumente, schon
Knoten) · Kimboard (Pinnwand fürs Team, schon Knoten). **Nicht** vorgeschlagen: Datei-Post (ein
Server, kein Browser-Knoten) und die privaten Apps (Rezeptbücher, Mixarium, Private Brain).

## Reihenfolge

1. **23-UI:** Einstellung „Netz“ im Verbinden-Fenster (Relais + Code, Code erzeugen, Code zeigen
   zum Weitergeben), Lage sichtbar (öffentlich · eigenes Netz · ungültig), im eigenen Netz
   Auto-Verbinden beim Öffnen. INTERFACES zuerst.
2. **Relais** `relay-intern.family-projekt.de` aufstellen (Schritt 4 des alten Briefs vorgezogen,
   weil ohne es nichts zu testen ist): DNS bei INWX, Container, Caddy-Block, `pubkey_whitelist`
   oder `[authorization]`. Befehle mit Angabe der Maschine (Hetzner **Cloud**-Server).
3. **Sende-Prüfer** als erster Träger (Kanon verteilen, Einstellung setzen, Sichttest bei Klaus).
4. Die übrigen Knoten der Liste; danach die drei Nicht-Knoten (Workflow PDF, Workflow-Needs,
   Workflow-Calculate) erst andocken (Pflicht-Module, Schublade, Siegel).
5. **Mycel-Karte:** ein Knopf schaltet die ganze Seite auf das Firmennetz (Relais + Code aus der
   Einstellung), zeigt nur dessen Knoten, Fragen und Antworten; Analyse dort getrennt vom
   öffentlichen Netz. Die Karte braucht dafür denselben Code (sonst sieht sie nur Umschläge).

## Offene Fragen an Klaus

1. Welche der drei Vorschläge (In-and-Out-Book, Company Brain, Kimboard) kommen dazu?
2. Wer gibt den Netz-Code weiter — einmal von Hand je Gerät eintippen, oder als QR/Link?
3. Soll die Mycel-Karte den Code sich merken (im Browser) oder jedes Mal fragen?

## Grenzen, die bleiben

- Der Handschlag `sbkim-anastomosis` (Modul 05) ist Klartext.
- Ein Code unter 12 Zeichen wird abgewiesen; wer die Karten vom Relais mitliest, kann einen
  kurzen Code durchprobieren.
