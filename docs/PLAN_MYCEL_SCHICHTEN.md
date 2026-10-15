# Arbeitsliste — Schutzschichten am Mycel-Eingang

> **Für jede Sitzung:** lebende Abhak-Liste. Wer einen Punkt erledigt, hakt ihn hier ab
> (`[ ]` → `[x]`), trägt Datum und PR ein und vermerkt es in `docs/PULS.md`.
>
> **Stand: 2026-10-15.** Anlass: Prüf-Reihe Sitzung 6
> (`docs/sessions/archiv/2026-10-14_angriffsflaeche_mycel.md`) und Klaus' Frage, ob sich
> die mehrstufigen Artgrenzen der Natur aufs Mycel übertragen lassen.
>
> ⛔ **KIMHUB NICHT ANFASSEN. KEINE FORSCHUNGSEINTRÄGE IN KIMHUB** — dort läuft gerade die
> Gegenprobe. Diesen Satz an jede Folge-Sitzung weitergeben, bis Klaus ihn aufhebt.

**Legende:** `Bau` = Bau-Sitzung · `Test` = Klaus' Sichttest am Tablet · `Entscheid` = Klaus
wählt vorher. **Freigegeben** ist bisher nur **S5 (Bürgen) als Planpunkt** (Klaus 2026-10-15:
„Bürgen mit in den Plan-Brief aufnehmen"). Alle anderen Punkte sind Vorschläge; gebaut wird
erst nach Klaus' Wort je Punkt.

---

## Das Muster

Die Natur hält Arten mit mehreren Hürden hintereinander auseinander: billige zuerst (Balz,
Paarungszeit), dann Schlüssel und Schloss an der Zelloberfläche, die Prüfung auf Ähnlichkeit
erst beim Ernstfall (Paarung der Chromosomen, Fehlerkorrektur), dazu ein Gedächtnis an
Eindringlinge (CRISPR) und ein Schutz dessen, was weitergegeben wird (piRNA). Keine Hürde muss
alles allein leisten.

**Zwei Grenzen gelten für jede Schicht:**
- **Jedes öffentliche Signal lässt sich nachahmen** (Name, Stichworte, Raum-Marke). Tragen
  kann nur ein Geheimnis (privater Schlüssel) oder Aufwand, den ein Angreifer nicht billig
  fälschen kann.
- **Zu scharfe Abwehr trifft die Falschen.** Fremde Apps im Marktplatz dürfen nicht still
  herausfallen. Im Zweifel wird **markiert** („unbestätigt"), nicht abgewiesen — wie seit
  Bau 23.R bei den Antworten.

Der Raum bleibt öffentlich: abweisen kann nur der **Empfänger**.

---

## Was schon steht

| Natur | Mycel | Stand |
|---|---|---|
| Balz, Paarungszeit | Raum-Marke, Protokoll-Version, Zeitstempel nicht in der Zukunft, Relais-Grenzen | steht (Relais-Grenzen 2026-08-19) |
| Schlüssel und Schloss | Spore signiert, Kennung = Prüfsumme des Schlüssels; Antworten signiert, nur der Gefragte zählt | steht (Bau 23.R, Sage #1087, 13 Träger) |
| Verträglichkeit | Siegel prüft die Pflicht-Module | teilweise |
| piRNA (Keimbahn) | Prüfliste vor dem KI-Richter | steht (04.J), nur feste Wendungen |
| Verwandte erkennen | eigene Kontakte (TOFU, B7) gewinnen über jeden Namen | steht |

---

## Die Schichten

- [ ] **S1 — Fragen unterschreiben** · `Bau` · ⏱ ~1 Sitzung
  Frage-Zettel (`sbkim-qry`, `kind: sbkim-query`) tragen `spore` + `sig` wie die Antworten
  seit Bau 23.R. Eine unsignierte Frage wird weiter beantwortet, aber als „unbestätigt"
  vermerkt (Rate-Limit strenger). Schließt die letzte offene Stelle an der Tür.
  Vorher: INTERFACES § Antwort-Zettel v2 um Frage-Zettel v2 ergänzen.

- [ ] **S2 — Vektor gegen Text nachrechnen** (Fehlerkorrektur) · `Entscheid`+`Bau` · ⏱ ~2 Sitzungen
  Der Empfänger rechnet den `domainVector` aus der Selbstbeschreibung der Spore nach und
  vergleicht mit dem angesagten. Liegt der Abstand über einer Schwelle → Karte „Bedeutung
  passt nicht zur Beschreibung", kein Match-Vorrang. Fehlt das Modell (~135 MB) beim
  Empfänger → „Bedeutung nicht geprüft", nie still grün. Offen zum Entscheid: Schwelle,
  und was mit `embeddingSource: "content"` geschieht (Vektor aus Inhalten, nicht aus dem
  Text — dort ist Nachrechnen nicht möglich). Entspricht dem offenen Punkt 6 der Prüf-Reihe.

- [ ] **S3 — Rechenaufwand je Zettel** (teure Balz) · `Entscheid`+`Bau` · ⏱ ~1 Sitzung
  Nostr NIP-13: der Sender rechnet vor dem Senden eine kleine Prüfsummen-Aufgabe. Fluten
  wird teuer, ein einzelner Zettel bleibt billig. Schwierigkeit mild, am Tablet zu messen.
  Empfänger bevorzugt, verwirft nicht.

- [ ] **S4 — Signierte Sperrliste im Mycel** (Gedächtnis) · `Entscheid`+`Bau` · ⏱ ~1 Sitzung
  Wie in Kimboard: nur Klaus unterschreibt, nur nach oben (sperren); gelöst wird nur in der
  Datei. Gesperrte Kennungen erscheinen nicht auf der Karte und werden nicht beantwortet.

- [ ] **S5 — Bürgen** (Empfehlung statt Netz-Code) · `Entscheid`+`Bau` · ⏱ ~2–3 Sitzungen
  Freigegeben als Planpunkt (Klaus 2026-10-15). Ein bekannter Knoten unterschreibt:
  „Diese Kennung kenne ich." Steht zwischen dem offenen Mycel und dem eigenen Netz
  (Modul 23 „Netz", ein Code für alle).

  **Wie man einen Bürgen bekommt:** der Neue meldet sich auf einem zweiten Weg beim Bürgen
  (persönlich, Telefon, bekannte E-Mail), beide vergleichen die Sicherheitsnummer wie bei B7,
  dann unterschreibt der Bürge. Die Bürgschaft hängt an der **Kennung**, nie am Namen.

  **Gegen Selbst-Bürgen (Sybil):** eine Bürgschaft zählt beim Leser **nur**, wenn er dem
  Bürgen selbst schon traut (eigener Kontakt oder Anker). Hundert erfundene Knoten, die
  füreinander bürgen, zählen bei niemandem, der keinen von ihnen kennt. Dazu:
  - **Kurze Kette:** höchstens 2 Schritte vom eigenen Vertrauen (Wert zum Entscheid).
  - **Der Bürge haftet:** fällt ein Verbürgter auf, verlieren die Bürgschaften seines Bürgen
    an Gewicht.
  - **Widerruf:** der Bürge zieht zurück, sofort wirksam; Widerruf ist selbst signiert.
  - **Ablauf:** eine Bürgschaft gilt befristet (Vorschlag: 1 Jahr) und wird erneuert.

  **Anker:** Vertrauen muss irgendwo anfangen. Vorschlag: Klaus' Kennung fest in der App
  (wie `betreiberSchluessel` in Kimboard), dazu eigene Kontakte. Das ist eine **Mitte**,
  keine Gleichberechtigung — benannt, nicht verschwiegen.

  **Anzeige:** „verbürgt von ‹Kontakt›" an der Karte, immer mit Kennung. Unverbürgte Knoten
  bleiben sichtbar (offenes Mycel), sie bekommen nur keinen Vorrang.

  Vorher: Format der Bürgschaft (Zettel-Art, Felder, Signatur über welche Bytes) in
  INTERFACES festlegen; Gegenprobe-Fälle für jede der vier Regeln.

- [ ] **S6 — Eigene Einträge markieren** (Bakterien-Methylierung) · `Entscheid`+`Bau`
  Was die App selbst ablegt, trägt eine eigene Prüfsumme; was von außen in den Speicher
  geschrieben wurde, fällt auf. Nutzen gegen Kosten noch ungeklärt.

- [ ] **S7 — Prüfliste über die Wortliste hinaus** (piRNA) · `Entscheid`
  Die Prüfliste vor dem KI-Richter findet nur feste Wendungen (gemessen 2026-10-14:
  umformuliert, Französisch und ähnlich aussehende Zeichen gehen durch). Weg offen.

---

## Reihenfolge (Vorschlag)

S1 → S2 → S5 → S3 → S4; S6 und S7 erst nach eigenem Entscheid. Jede Schicht mit eigener
Probe **und** Gegenprobe, Rollout über `node tools/kanon-verteilen.mjs`.
⚠ Beim Rollout 2026-10-14 erhöhte der Verteiler nur `CACHE_VERSION`; Workflow-Calculate und
Workflow-Needs brauchen zusätzlich `node tools/cache-stand.mjs`.

## Was hier nicht hilft

Browser mit eingebauter KI lesen, was auf der Seite steht — keine Schicht am Mycel-Eingang
schützt davor (Prüf-Reihe Sitzung 6, „vermutet").
