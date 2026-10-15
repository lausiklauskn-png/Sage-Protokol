# PULS-Auslagerung 2026-10-15 — „Modul 25, Generation 2 — der Kern des Sende-Prüfers zieht nach Sage“

**Ausgelagert am 2026-10-15**, weil `docs/PULS.md` über der 3000-Zeilen-Grenze stand
(3014 Zeilen nach dem Eintrag „Leitlinie Netzadmin“). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-09-28 · Modul 25, Generation 2 — der Kern des Sende-Prüfers zieht nach Sage

Klaus: *„Modul 25 gehen wir gleich als erstes an. Das ist überhaupt das Beste an
der ganzen Geschichte."* Der Prüfkern des Sende-Prüfers ist jetzt ein Sage-Modul,
das jede App tragen kann. Karte: `docs/components/25_pseudonym.md`.

| | |
|---|---|
| Platzhalter | `⟦NAME-1⟧`, `⟦RECHNUNG-1⟧`, `⟦BETRAG-1⟧` — Klaus hat das Format bestätigt. Alte `[[TYP_n]]` werden weiter gelesen |
| Sorten | SCHLUESSEL · MAIL · TELEFON · IBAN (Prüfziffer) · BETRAG (Tausenderpunkt ganz) · RECHNUNG, alle an; Namen aus Liste an Wortgrenzen |
| neu | `find` (Fundstelle mit Zeile), `findLeak`, `isIban` |
| Smoke | `smoke_bau25_pseudonym.mjs` **52 grün** · `npm test` **109 grün · 0 rot** |
| Gegenprobe | `gegenprobe_bau25_pseudonym.mjs` **15 gefangen · 0 blind · 0 aus falschem Grund · 0 tote Anker** — beim ersten Lauf **14 · 1 blind**: der Riegel gegen verschachtelte Platzhalter war mit dem Testtext nicht messbar (kein Muster traf in einen Platzhalter). Neuer Wächter 5e mit einem Muster, das träfe |
| Panel 25 | im echten Chromium alle vier Knöpfe grün; das Beispiel trug „100 EUR" ohne Nachkommastellen — das ist kein Betrag im Sinne der Regel, jetzt „1.248,50 EUR" |

⚠ **Kein Knoten benutzte Generation 1** (`25_pseudonym` in keinem App-Depot), der
Formatwechsel bricht nichts, was läuft. Klaus' Sichttest vom 2026-07-17 galt
Generation 1; der für Generation 2 steht aus.

⚠ **Benannte Doppelung:** die Muster stehen ein zweites Mal im Auslieferungsprüfer.
Der Sende-Prüfer trägt das Modul noch NICHT — Umstellung ist der nächste Schritt.

⚠ **Zum wiederholten Mal:** ein deutsches Anführungszeichen hat beim Schreiben der
Probe einen String beendet; `node` meldete es beim ersten Lauf.
