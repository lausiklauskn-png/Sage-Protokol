# Übergabeprotokoll · 2026-08-09 — Phase D.2 eröffnet (Pilz-Wirtschaft)

**Rolle:** Analyse-/Spec-Sitzung. **Kein Modul-Code, kein Eingriff in `src/`.**
**Branch:** `claude/semantic-match-demo-plan-ht9zn6`

---

## Auftrag

Klaus, wörtlich: *„Analysiere das gesamte Repo, jede einzelne Datei, und
versuche herauszufinden, was wir von dieser Projektidee in die Realität
umsetzen können — auf Grundlage dessen, was wir beim Bau von SBKIM, Sage und
den anderen Repos gelernt haben. Wie können WIR daraus eine möglichst mit wenig
Aufwand / mehr Automatisierung gewinnbringendes Geschäftsmodell umsetzen?
Gegebenenfalls die Regeln anpassen. Evolution im Pilz-Mycel, um davon leben zu
können."*

Vorgeschichte: dieselbe Sitzung hatte zuvor im Planmodus `semantic-match-demo`
gelesen und einen Bauplatz-Plan vorgelegt. Klaus' berechtigter Einwand darauf —
*„woher willst du wissen, was ich bauen möchte?"* — führte zu einem Gespräch
statt zu einem Bau. Aus dem Gespräch kam dieser Auftrag.

## Was getan wurde

- **Alle 17 Dateien** von `semantic-match-demo` gelesen (Stand `031ab12`,
  2026-07-28). Die fünf PDFs sind ASCII85+Flate kodiert; ein erster
  Extraktionsversuch lieferte nur Zeichensalat und wurde korrigiert.
- Jeden **Kostenposten** der Mai-Kostenanalyse gegen den Ist-Stand von Sage,
  family-project und den übrigen Knoten geprüft.
- Ergebnis als Phase-D.2-Papier angelegt: **`docs/PLAN_PILZ_WIRTSCHAFT.md`**.
- `docs/PULS.md` fortgeschrieben, Pipeline-Zeile D.2 in `CLAUDE.md` von
  „wartet auf Phase C" auf „Papier liegt" gehoben.

## Die drei tragenden Befunde

1. **Die teure Hälfte steht.** Von 65.000–116.500 € des Konzepts sind Engine
   (Modul 03/04), Grundgerüst (markt.html + Studio + `einreichung.php`),
   Sicherheitsscan (Wächter) und Zertifizierung (Siegel) gebaut. Die
   Vektordatenbank (50–200 €/Monat) entfällt ganz — `listings-vec.json` liegt
   int8-quantisiert im Repo. Nicht gebaut: Zahlungsweg und zahlende Gegenseite.
2. **Null fremde Marktplatz-Einträge, obwohl die ersten hundert Plätze seit
   dem 12.07. gratis sind.** Der Engpass ist weder Technik noch Preis, sondern
   Bekanntheit. Die eigene Mai-Analyse hatte den Fall beziffert („ohne Partner:
   Kaltstart 3–6 Monate, 10.000–20.000 € Marketing"). Daraus die Antwort auf
   die Automatisierungsfrage: **Automatisierung erzeugt keinen Käufer.**
3. **Der Marktplatz hat die falsche Aufgabe.** Als Provisions-Maschine braucht
   er 400 Apps und 350 Käufe im Monat für 2.065 €. Als Beweisstück braucht er
   nur, was vorhanden ist. Vorgeschlagene Reihenfolge, dem Konzeptpapier genau
   entgegengesetzt: ① Auftragsarbeit (2–3 Kunden) ② Fach-App mit **Wartung**
   (WorkFloh, ~100 Kunden wiederkehrend) ③ Provision zuletzt.

## Regel-Arbeit

- **Der Empfangsmodus blockiert den Verkauf nicht** — die Vier-Schichten-Lesart
  hat das bereits versöhnt („Akquise gehört in die Pilz-Schicht"). Keine
  Änderung nötig, nur die Erlaubnis, die Pilz-Schicht wirklich zu bauen.
- **Neu:** *Die Module sind nicht das Produkt.* Protokoll bleibt gemeinfrei;
  verkäuflich sind Apps, Anpassung, Wartung.
- **Neu:** *Kein Einnahmeweg, der täuscht oder einsperrt.* Folge: der
  gerätegebundene Kopierschutz aus dem Konzept (4.000–7.000 €) wird **nicht**
  gebaut — er widerspräche der bestehenden Obfuskations-Tafel.

## Was offen blieb (nur Klaus)

1. **Everlast GmbH** — 30 Fundstellen in 7 Dateien, öffentlich, samt 3-%-Gebühr
   im Transaktionsfluss. Klaus am 2026-08-09: *erst später entscheiden.* Bis
   dahin wird darauf nichts aufgebaut und nichts entfernt.
2. **Die vier „Vertraulich"-PDFs** — Klaus am 2026-08-09: *bleiben, war so
   gewollt.* Punkt beendet.
3. **Jahresbeitrag (`yearlyUrl`)** — Marktplatz-Gebühr oder Wartungsbeitrag?
   Das Papier empfiehlt Wartungsbeitrag.
4. **Preisform für WorkFloh** und **verfügbare Zeit für Akquise-Gespräche.**

## Nebenbefunde

- `semantic-match-demo/CLAUDE.md` ist eine Kopie der Regeln von Muttis
  Rezeptbuch — falsches Repo — und behauptet „privat", obwohl das Repo
  öffentlich ist. Das Repo hat seit 2026-07-28 keine gültige Verfassung.
- `hub.html` veröffentlicht Klarnamen und private E-Mail-Adresse, während
  `spenden.js` am 01.08. genau das entfernt hat.
- Die Demo hängt an vier fremden Adressen (Google Fonts, PeerJS, QRCode, jsQR),
  nennt ein Modell vom Mai 2025 und legt den API-Schlüssel im Klartext in
  `localStorage`.

## Nächster sinnvoller Schritt

**Der zweite Knopf am Marktplatz — „Ich hätte gern so etwas für meinen
Betrieb".** Die Maschinerie steht (`einreichung.php` mit Warteschlange,
Spam-Falle, Rate-Limit, Mail an `info@`); es fehlt nur ein zweiter Anlass.
Einziger Punkt der Liste, an dessen Ende jemand Geld überweisen könnte.

## Ungeprüft

Ob die Live-Demo unter `lausiklauskn-png.github.io/semantic-match-demo/` noch
läuft — die Sitzungs-Umgebung kommt nicht ins offene Netz (CONNECT 403).
Keine Datei in `semantic-match-demo` wurde angelegt oder geändert.
