# Übergabe · S3 „Rechenaufwand je Zettel“ gebaut und ausgerollt (2026-10-16)

**Rolle:** Hauptsitzung. Auftrag: Sammel-Brief `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`,
erster offener Schritt 5 (S3).

## Entscheid (Klaus 2026-10-16)

| Frage | Antwort |
|---|---|
| Stärke | 12 Stufen (führende Null-Bits) |
| welche Zettel | Karten + Fragen (nicht Antworten, nicht Bürgschaften) |
| Wirkung | „Vorrang bei Enge“, keine Anzeige an der Karte |
| Nachfrage „ist mehr Aufwand besser?“ | nach den richtiggestellten Zahlen: 12 bleibt |

## Getan

| Was | Wo |
|---|---|
| Tafel S3 | `docs/INTERFACES.md` § Modul 23 |
| Feld `pow`, Prüfung, Vorrang bei Enge | `src/modules/23_rendezvous.js` (+ Bündel-Kopien) |
| Siegel-Aspekt S3 DE/EN | `src/modules/16_siegel.js` (+ Bündel-Kopie) |
| Probe + Gegenprobe | `tests/smoke_s3_aufwand.mjs`, `tests/gegenprobe_s3_aufwand.mjs` |
| neue Felder benannt | `tests/smoke_netz_eigen.mjs`; Anker in `tests/gegenprobe_s1_fragen.mjs` |
| Rollout | 29 Träger, je ein PR (Liste in `docs/PULS.md`) |
| Pflege-Liste § 23, § 24 | `docs/PFLEGE-LISTE.md` |

## Gemessen

- Behälter, nicht Tablet: `crypto.subtle` 21 900 Prüfsummen/s (asynchron, langsam), reines JS 123 000/s,
  Node-crypto ein Kern 489 000/s. 12 Stufen: ~0,03 s (JS) bzw. ~0,01 s (Rechner-Code) je Zettel.
- `smoke_s3_aufwand` 19 grün; Gegenprobe 14 gefangen · 0 durch · 0 tot.
- `smoke_netz_eigen` 68 grün, Gegenprobe 14/14; `gegenprobe_s1_fragen` 7/7.
- `run_alle` 124 grün · 1 rot (`smoke_papiere_bereinigt`, siehe § 24) · 1 nicht lauffähig.
- Träger: Proben je Repo grün; auf `main` ebenso rot: BookLedgerPro `smoke_a5_antwortpfad`,
  family-project `smoke_stufe2_sporen` (8).
- Auf `main` nachgezählt: 29/29 `RDV_POW_BITS = 12`, 28/28 Siegel-Aspekt S3. Verteiler danach
  „84 schon gleich · 0 hängen zurück“.

## Was schieflief (Belegmaterial)

- Die erste Zeitangabe an Klaus (0,2 s je Zettel, 40 s für 200 Flut-Karten) kam aus `crypto.subtle`,
  dessen asynchroner Aufruf die Zeit bestimmt. Vor dem Bau richtiggestellt und neu gefragt.
- Die Nonce-Suche begann mit `Math.random`; dadurch verschob sich in `smoke_netz_eigen` (eingefrorener
  Zufall) die qid, drei Zeilen rot. Suche beginnt jetzt bei 0.
- Mit der festen Nonce wurde der Gegenprobe-Fall „Aufwand nach dem Unterschreiben angehängt“ blind
  (die Sabotage rechnete dieselbe Nonce neu aus). Geschärft: unterschreiben ohne `pow`, danach anhängen.
- Ein voller `run_alle` überschrieb vier Dateien im echten Baum (§ 24); einzeln nicht nachgestellt.
- family-project: `main` bewegte sich während der Proben (tägliche Aktualisierung); `git diff --stat`
  zeigte 711 gelöschte Zeilen und hat es gefangen. Zusammengeführt, danach nur `?v=`-Änderungen.

## Nicht gemessen

- Tablet: Zeit je Karte/Frage, Bedienbarkeit während der Rechnung.
- Ein echter voller Raum (200 Karten) im offenen Mycel.

## Offen

1. S4 — vorher Klaus' Entscheid: Sperrliste öffentlich (wie Kimboard) oder nicht (Karte 12).
2. Pflege-Liste § 22–24.
3. Paper S (Entwurf) nennt S3 noch „geplant“ und „am Tablet gemessen“; beim Gegenlesen mit Klaus nachziehen.
