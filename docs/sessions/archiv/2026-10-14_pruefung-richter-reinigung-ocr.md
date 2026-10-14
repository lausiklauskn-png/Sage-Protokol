# Übergabe 2026-10-14 — Prüfung vor dem KI-Richter (04.J) · Reinigung vor der Texterkennung (24.R)

**Rolle:** Hauptsitzung (Sage-Kanon, Punkt 1 der Reihenfolge aus der Bestandsaufnahme).

## Klaus' Entscheidungen (wörtlich gewählt)
- Fremder Text mit Anweisung an eine KI: **Ausschließen und zeigen**.
- Prüfliste fehlt in einer App: **Richter aus + ich verteile**.
- PDF in der Texterkennung: **wie die Rezeptbücher** (pdf.js und Reinigung von `/Workflow-PDF/`).
- Mitten in der Arbeit: *„Die Qualität muss 100 % stimmen“* und *„nur die Segmente … neu zeichnen und die anderen 1:1“*.

## Getan
Siehe PULS-Eintrag vom selben Tag. Kurz: `assets/pruefer-mail.js` (byte-1:1), Modul 04 prüft vor dem Richter,
Modul 22 und die Pinnwand zeigen Ausgeschlossene, Modul 24 sendet nie das Original
(JPEG 1:1 ohne Metadaten/Angehängtes, PDF mit 300 dpi gereinigt), erkannter Text wird geprüft.

## Gemessen
- Qualität (Tesseract als Messgerät, kleine blassgraue Schrift, 20 Zeilen): 1400 px/JPEG 85 % → 9 falsch,
  2000 px/JPEG 92 % → 1, 300 dpi/JPEG 92 % → 0; PNG ohne Gewinn. Alte Einstellungen lasen eine IBAN falsch.
- Proben und Gegenprobe: siehe PULS.

## Offen
- Verteilung in die Träger (Prüfliste + Module 04/22/24); Kimhub nie.
- `docs/observatorium/tools/mycelknoten.html` (Modul 04 eingebettet) nicht nachgezogen.
- Nicht gemessen: Tablet, echter Mistral/Google-Lauf.
