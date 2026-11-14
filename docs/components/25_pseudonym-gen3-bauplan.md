# Modul 25 — Generation 3: Bauplan (festgelegt 14.11.2026, Klaus)

**Status:** Bauplan, in Sage **noch nicht gebaut**. Erprobt zuerst in der Familienakte 2.28.68 als Schicht über der unveränderten
Generation 2 (`lib/maske.ts`, Knopf „Pseudo“, Proben `scripts/run-maske-tests.mjs` und `tests/ui/pseudo-knopf.test.mjs`).
Wer Modul 25 verbessert oder in eine App einbaut, geht von diesem Bauplan aus. Sage bleibt Quelle; Apps ziehen byte-gleich mit Pin nach,
nie nachbauen. Plan mit Marktanalyse: Familienakte `docs/PLAN_PSEUDONYMISIEREN.md`.

## Ziel

Ein Klick „Pseudo“ in jeder Pro-App: Text, Datei, Mail mit Anhängen → pseudonymisierte Fassung, die eine KI sortieren und beantworten
kann; „Zurückführen“ setzt die echten Angaben nur auf dem Gerät wieder ein. Kein Netzweg im Modul.

## Was Generation 3 gegenüber Generation 2 ändert

| Punkt | Gen. 2 | Gen. 3 |
|---|---|---|
| Deutsche Nummern | IBAN mit Prüfziffer, sonst nichts | **Steuer-ID** (ISO 7064 MOD 11,10), **KVNR** (Buchstabe→Zahl, Gewichte 1-2, Quersumme mod 10), **RV-Nr.** (Gewichte 2,1,2,5,7,1,2,1,2,1,2,1, Quersumme mod 10, Tag/Monat plausibel), **Ausweis/Pass** (7-3-1, A=10…Z=35, nur mit Feldwort), **USt-IdNr.** (DE + 9), Kunden-/Vertrags-/Versicherungs-/Mitglieds-/Zählernummer **nur mit Feldwort** |
| Prüfziffer | ja/nein | gültig → verdecken; ungültig ohne Feldwort → nicht; ungültig **mit** Feldwort → verdecken und als „unsicher“ melden (Presidio: abwerten statt verwerfen) |
| Datum | ab Werk verdeckt | **bleibt** (Sortieren, Fristen); **Geburtsdatum** (nach „geb.“, „geboren am“, „Geburtsdatum“) wird `⟦GEBURTSDATUM-n⟧` |
| Beträge | ab Werk verdeckt | **bleiben** (für Sortieren nötig, kein Personenbezug) – je Aufruf abschaltbar |
| Gesundheit | – | ICD-10 nach „Diagnose/ICD/Dg.“ → `⟦ICD-n⟧ [Gruppe]` (Kapitel nach erstem Buchstaben) |
| Namen | nur aus Liste | Liste (Profil) **plus** Namensmuster (Anrede, Kontext, Vor-+Nachname, Firma; aus BookLedgerPro `namensmuster.js`); Nachname einer Profil-Person allein wird mit erkannt |
| Firmen | – | große Rechtsform (GmbH, AG, SE, KG, e.V. …) und **Stellen** aus dem Profil **bleiben**; e.K., GbR, UG (oft Personen) werden verdeckt |
| Anschrift | – (nur in Apps) | Straße + Hausnummer, PLZ + Ort, Telefon, Kfz-Kennzeichen (aus Familienakte `FAMILIEN_MUSTER`) |
| Marke | – | Kopfzeile `⟦PSEUDONYMISIERT v1⟧`; Marke **oder** ≥ 3 Platzhalter → Eingabe bleibt **byte-gleich** (nie doppelt) |
| Rückweg | `rehydrate` | `zurueckfuehren`: Marke abnehmen, `rehydrate`, unbekannte Platzhalter melden |
| Rollen (nächster Schritt) | – | Platzhalter mit Rolle `⟦ICH⟧`, `⟦FAMILIE-n⟧`, `⟦KONTAKT-n⟧`, `⟦STELLE-n⟧`, feste Nummer je Profil-Eintrag über alle Exporte |

Platzhalterform bleibt `⟦TYP-n⟧`; alte Aufrufe von Gen. 2 bleiben gültig (neue Sorten über Optionen, Grundwerte in einer neuen Funktion
`maskieren(text, profil, map)`).

## Profile (nächster Schritt, gemeinsam für alle Pro-Apps)

- Liegen im **Pro-Tresor**, neues Fach `profile` (Tresor-Paket, Quelle Workflow PDF Pro, byte-gleich nachziehen), verschlüsselt wie dort
  (AES-256-GCM). Jede App fragt: „Aus einer anderen Pro-App übernehmen“ oder „Selbst anlegen“; die Familienakte schlägt Personen und
  Organisationen aus der Akte vor (verknüpft, nicht kopiert).
- Nummern nur als **HMAC-SHA-256** mit einem Geräte-Geheimnis (EDPB-Leitlinien 01/2025: geheimer Schlüssel statt einfachem Hash),
  angezeigt „DE…1234“.
- **Basic (PWA):** keine gespeicherten Profile, nur Muster und Namen der Akte; Hinweis auf die Pro-App.
- Modul und Profil-Baustein haben **keinen Netzweg**; jede App belegt das mit einer Probe (Quelltext ohne `fetch`/`XMLHttpRequest`/
  `WebSocket`, UI-Probe zählt Netzaufrufe beim Pseudonymisieren = 0).

## Übernommen aus der Marktanalyse (14.11.2026)

Presidio (MIT): deutsche Erkenner mit Kontextwörtern, Prüfziffer dreiwertig, Allow-/Deny-Listen, Überlappung „längere gewinnt“ ·
`stdnum` (MIT): Prüfverfahren · Google Sensitive Data Protection: Surrogat-Marke, deterministischer Ersatz · LLM Guard (MIT):
Zuordnung und Rückweg · Schwärzen in Bildern/PDF: pdf.js + pdf-lib + tesseract.js (Rastern, Wortkästen füllen; nie Kasten über
Textebene; MuPDF ist AGPL, nein). Nicht genutzt: Cloud-Dienste (Google DLP, Limina, Tonic), Browser-DLP der Hersteller (blockieren statt
pseudonymisieren), nicht-kommerzielle Modelle. Später prüfen: OpenMed-PII-German (Apache-2.0, ONNX) für Namen ohne Muster.

## Proben (Pflicht beim Bau in Sage)

Je Sorte Treffer und Nicht-Treffer (falsche Prüfziffer), mit erfundenen Nummern, deren Prüfziffer in der Probe berechnet wird;
Marke/„nie doppelt“ byte-gleich; Rückweg; Stelle bleibt, Kleinunternehmen verdeckt; ICD mit Gruppe; Gegenprobe gegen alle
Gen.-2-Proben (dürfen nicht schlechter werden). Erst dann neuer Pin in den Apps.

## Reihenfolge

1. Sage: Gen. 3 nach diesem Bauplan bauen (Stand Familienakte `lib/maske.ts` 2.28.68 als Vorlage), Smoke und Gegenprobe.
2. Familienakte: Schicht `lib/maske.ts` durch Gen. 3 mit Pin ersetzen.
3. Fach `profile` im Tresor-Paket; Profile in der Familienakte.
4. Private Brain Pro → BookLedgerPro → Workflow PDF Pro → Datei-Organizer: Knopf „Pseudo“, byte-gleich mit Pin, je App Probe und Gegenprobe.
