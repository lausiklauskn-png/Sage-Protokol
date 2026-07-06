# Brief — Bau 23.B Live-Beweis + Folge-Stränge (Incremente 2B/3, Signatur, PULS-Archiv)

```
Neue Sitzung — Sage-Protokol (+ Endknoten MR/MM/family). Freibrief gilt
(CLAUDE.md § Freibrief).

════════════════════════════════════════════════════════════════════
STAND — Bau 23.B: „Knoten fragt Knoten" ist GEBAUT und headless bewiesen
════════════════════════════════════════════════════════════════════
Die bidirektionale Bedeutungs-Suche hat jetzt ihren end-to-end-Pfad:
Modul 23 kann Fragen stellen (askNode) und — bewusst eingeschaltet —
Fragen anderer Knoten mit der eigenen lokalen Bedeutungs-Suche
beantworten (enableAnswering → Modul 04 queryLocal → Antwort-Zettel).
Tag sbkim-qry, Schutz: qid-Dedupe + 6/min-Rate-Limit + k≤5 + Text≤300.
Tafel: INTERFACES §1 Modul 23 § Bau 23.B. Smoke smoke_bau23b_query.mjs
23/23 (zwei vm-Instanzen + Mock-Relais); bau23 55/55, bau23_ui 32/32.
UI: Frage-Feld + „💬 Antworten: an/aus" + „❓ Fragen" je Raum-Karte.
Byte-Kopien in MR + MM (+UI) + family + sbkim-bundle (heilt alten Drift).
v1 EHRLICH OFFEN: Zettel unsigniert — Identitäts-Wahrheit bleibt beim
signierten Handshake + 0.80-Riegel; Antworten sind advisory.

Dazu in dieser Runde gemergt: 💡-Lade-Hinweis/Zähler/Badge + ⚖️ KI-Richter
opt-in in MR+MM, Modul-04-Claude-CORS-Header netzweit, Kunden-Tab-Suche
in beiden WorkFlohs. Bestandsaufnahme: kein weiterer Such-Übertrag nötig.

⏳ KLAUS' LIVE-BEWEIS (der eigentliche Meilenstein-Abschluss, 2 Geräte
   oder 2 Tabs, beide auf deployter main nach Hard-Reload):
   Gerät A (z.B. Mixarium): 🌐-Knopf → Mit dem Netz verbinden →
     „💬 Antworten: an" schalten → Tab offen lassen.
   Gerät B (z.B. Rezeptbuch): 🌐 → verbinden → „👥 Wer ist im Raum?" →
     oben Frage eintippen (z.B. „kuchen" oder „erfrischend ohne alkohol")
     → an der Mixarium-Karte „❓ Fragen" antippen.
   ERWARTUNG: nach wenigen Sekunden „✓ Antwort von …" mit den Top-Treffern
   aus dem ANDEREN Buch — Knoten fragt Knoten, server-los. Das wäre der
   Live-Abschluss des Meilensteins „Semantisch Bidirektionale Suche".

════════════════════════════════════════════════════════════════════
AUFGABE (eine wählen, nach Klaus' Rückmeldung priorisieren)
════════════════════════════════════════════════════════════════════
1. LIVE-BEFUND EINARBEITEN: was Klaus beim 23.B-Lauf findet (UX, Timing,
   Fehlertexte). Erst danach weiterbauen.
2. ZETTEL-SIGNATUR (Folge-Schritt aus v1-ehrlich-offen): Frage-/Antwort-
   Zettel Ed25519-signieren + verifizieren (Modul-02-Sign-Pfad wie 05/06/07),
   BEVOR Fremde außerhalb von Klaus' Netz mitspielen. Tafel zuerst.
3. INCREMENT 2B (eigene Sitzung, sicherheits-sensibel): Widget-Schlüssel-
   Tresor (Shamir 2/3, Krypto aus Modul 20) + automatischer Browser-KI-Aufruf
   mit Websuche. NICHT nebenbei bauen.
4. INCREMENT 3 (eigene Sitzung): Such-Widget ↔ App-Suchfeld-Kopplung über
   Modul 15 (op:"query"-Pfad ist seit 04.G-Fix funktional).
5. PULS-ARCHIV-PFLEGE: PULS.md ist >8000 Zeilen (Schutz-Klausel 3000
   gerissen) — Sitzungen ins Archiv auslagern, nicht kürzen.
GEPARKT (bewusst, nicht anfassen ohne Klaus): Schnipsel-Mittel-Lead (dünne
Marge, Datenvertrag-Eingriff — erst bei mehr echten Knoten); Splitscreen-
Vergleich + Pilz-Wirtschaft D.2 (Tafel: wartet auf Phase C).

════════════════════════════════════════════════════════════════════
PFLICHTLEKTÜRE (in dieser Reihenfolge)
════════════════════════════════════════════════════════════════════
CLAUDE.md · docs/PULS.md (oberster Eintrag 2026-07-06) ·
docs/INTERFACES.md §1 Modul 23 (inkl. § Bau 23.B) ·
src/modules/23_rendezvous.js (§ Bau 23.B) + 23_rendezvous_ui.js ·
tests/smoke_bau23b_query.mjs.

⚠️ BRANCH-DISZIPLIN: IMMER von origin/main branchen (Rezeptbuch-GitHub-
   Default ist ein toter Vor-SBKIM-Decoy!). Byte-Disziplin: Modul-23-Kopien
   (src == sbkim-bundle == MR/MM/family sbkim/) müssen md5-gleich bleiben.
   Mixarium: index==QC md5 + SW bumpen. Rezeptbuch: QC → build.py + CACHE.
⚠️ DEPLOY: GitHub Pages serialisiert pro Konto — Merges bündeln.

Selbst-Merge nach grünen Tests (Draft→ready→squash), dann prüft Klaus live.
Am Sitzungsende: PULS fortschreiben, Übergabeprotokoll, diesen Brief-Typ
neu ausgeben (die Kette reißt nie ab).
```
