# 2026-10-13 · Firmennetz-Sichttest 2 und Workflow-PDF-Kopfzeile

**Brief:** `docs/BRIEF_2026-10-14_firmennetz-sichttest-2.md` · **Zweig:** `ccr-0af6abe9-ycdh52`

## Was getan
1. **Sichttest ausgewertet.**
   - Klaus' Bilder zeigten zuerst je Gerät nur sich selbst.
   - Ein Skript in Termux (Tablet) fragte das eigene Relais nach Karten der eigenen Netz-Marke: erst 1, dann 2 Absender.
   - Die Ursache war ein Gerät außerhalb des eigenen Netzes, nicht Relais oder Code.
   - Danach sehen sich beide Geräte (Bilder).
   - Nichts gebaut, keine Befunde geraten.
2. **Workflow-PDF #107:**
   - Die Kopfzeilen-Verdichtung gilt jetzt bis 520 px statt bis 480 px.
   - Die Probe misst 13 Breiten.
   - Gegenprobe-Fall dazu, Filter `NUR_FALL`, Cache v82, CLAUDE.md nachgezogen.
3. **Kimhub #372:** Forschungseintrag (arm `voll`).

## Gemessen
- `bibliothek`: auf `main` 87 grün · 3 ROT (481, 490 px), danach 90 grün · 0 ROT.
- knoten 126 · schieber 30 · sprache 49 · zuschneiden 17: grün.
- Gegenprobe (Kopie): 2 gefangen · 0 blind · NUR_ANKER 26 · 0 tot.

## Nicht gemessen
- Die Kopfzeile am Tablet.
- Der Fragenverkehr eines Firmennetzes in der Mycel-Karte am echten Relais.

## Offen / nächster Schritt
- 05b und 23 werten nur `EVENT` aus, die OK-Antwort des Relais nicht (gelesen: `05b` Zeile 153).
- Brief: `docs/BRIEF_2026-10-15_relais-ok-antwort.md`.

## Stundennachweis
- 18:26Z bis 19:53Z = 87 min, als Obergrenze.
- Beginn ist der Checkout auf den Zweig (aufgerundet), Ende der Merge von #107 (abgeschnitten).
- Pausen sind nicht abgezogen; die Anwesenheit darin ist Klaus' Auskunft.
- Die Doku-Arbeit danach ist nicht mitgezählt.
