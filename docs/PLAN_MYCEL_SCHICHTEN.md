# Arbeitsliste — Schutzschichten am Mycel-Eingang

> **Für jede Sitzung:** lebende Abhak-Liste. Wer einen Punkt erledigt, hakt ihn hier ab
> (`[ ]` → `[x]`), trägt Datum und PR ein und vermerkt es in `docs/PULS.md`.
>
> **Stand: 2026-10-15.** Anlass: Prüf-Reihe Sitzung 6
> (`docs/sessions/archiv/2026-10-14_angriffsflaeche_mycel.md`) und Klaus' Frage, ob sich
> die mehrstufigen Artgrenzen der Natur aufs Mycel übertragen lassen.
>
> Hier stand eine Sperre für Kimhub (Gegenprobe lief dort). Klaus hat sie am 2026-10-15
> aufgehoben; die Forschungseinträge stehen in Kimhub (#376).

**Legende:** `Bau` = Bau-Sitzung · `Test` = Klaus' Sichttest am Tablet · `Entscheid` = Klaus
wählt vorher. **Freigegeben sind S1, S2, S5, S3, S4 in dieser Reihenfolge** (Klaus 2026-10-15:
„Ja, S1 → S2 → S5 → S3 → S4 freigegeben"). Vorher war nur S5 (Bürgen) als Planpunkt
freigegeben („Bürgen mit in den Plan-Brief aufnehmen"). **Die Freigabe gilt dem Bau, nicht den
offenen Werten:** was eine Schicht als `Entscheid` nennt (z. B. Schwelle in S2, Kettenlänge in
S5), legt Klaus fest, bevor dieser Teil gebaut wird. **S6 und S7 sind nicht freigegeben.**

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

- [x] **S1 — Fragen unterschreiben** · `Bau` · ⏱ ~1 Sitzung
  Frage-Zettel (`sbkim-qry`, `kind: sbkim-query`) tragen `spore` + `sig` wie die Antworten
  seit Bau 23.R. Eine unsignierte Frage wird weiter beantwortet, aber als „unbestätigt"
  vermerkt (Rate-Limit strenger). Schließt die letzte offene Stelle an der Tür.
  Vorher: INTERFACES § Antwort-Zettel v2 um Frage-Zettel v2 ergänzen.
  **Stand 2026-10-15:** in Sage gebaut (INTERFACES Frage-Zettel v2, Modul 23, Siegel-Aspekt).
  Entscheid-Wert (Klaus 2026-10-15): unsignierte Fragen höchstens **2 der 6** Antworten je
  Minute. Probe `tests/smoke_s1_fragen_signiert.mjs` (13 grün), Gegenprobe
  `tests/gegenprobe_s1_fragen.mjs` (7 von 7 gefangen). **Ausgerollt 2026-10-15:** 26 Träger,
  auf `main` 26 von 26 nachgezählt; dazu Kuechenzettel und die Demo beim Andocken.

- [ ] **S2 — Vektor gegen Text nachrechnen** (Fehlerkorrektur) · `Entscheid`+`Bau` · ⏱ ~2 Sitzungen
  Der Empfänger rechnet den `domainVector` aus der Selbstbeschreibung der Spore nach und
  vergleicht mit dem angesagten. Liegt der Abstand über einer Schwelle → Karte „Bedeutung
  passt nicht zur Beschreibung", kein Match-Vorrang. Fehlt das Modell (~135 MB) beim
  Empfänger → „Bedeutung nicht geprüft", nie still grün. Offen zum Entscheid: Schwelle,
  und was mit `embeddingSource: "content"` geschieht (Vektor aus Inhalten, nicht aus dem
  Text — dort ist Nachrechnen nicht möglich). Entspricht dem offenen Punkt 6 der Prüf-Reihe.
  **Entscheid (Klaus 2026-10-15):** Schwelle **0,99** (Cosinus nachgerechnet ⟷ angesagt).
  `embeddingSource: "content"` → **„Bedeutung aus Inhalten, nicht nachprüfbar"**: sichtbar,
  kein Abzug, kein „geprüft"; die Satz-Schnipsel (immer aus der Beschreibung) werden
  trotzdem nachgerechnet.
  **Gemessen vor dem Entscheid** (gespeicherte Vektoren der 11 Sporen in `sbkim/`, 55 Paare):
  verschiedene Knoten 0,780–0,983; engste Paare Jasons-Tresor ⟷ Mein-Tresor 0,983,
  Muttis ⟷ Rezeptbuch 0,973. **Nicht gemessen:** die Wiederholgenauigkeit desselben
  Textes auf einem anderen Gerät (Modell im Container nicht ladbar) — vor dem
  Scharfschalten im Browser zu messen; liegt sie unter 0,995, wird Klaus gefragt.
  **Fund:** der Andock-Wizard bettet bei der Erst-Signatur „Beschreibung. Stichworte"
  ein, beim Neu-Signieren nur die Beschreibung (`16b_andock_wizard.js`, `quelle` bzw.
  `beschreibung`); die Spore sagt nicht, welcher Weg. Der Empfänger muss beide Fassungen
  nachrechnen.
  **Stand 2026-10-15: in Sage gebaut** (INTERFACES § Modul 23 S2, `checkMeaning`, Anzeige
  an der Karte DE/EN, Siegel-Aspekt). Geprüft werden drei Text-Fassungen — dazu
  „Beschreibung + Leerzeichen + Stichworte" aus `tools/embed_helper.html`. Gerechnet wird nur
  mit einem schon geladenen Modell (sonst „nicht geprüft", kein Nachladen). Probe
  `tests/smoke_s2_bedeutung.mjs` 27 grün (Modell als Attrappe; drei Zeilen im echten
  Chromium), Gegenprobe `tests/gegenprobe_s2_bedeutung.mjs` 14 von 14 gefangen.
  **Offen:** Wiederholgenauigkeit am Gerät messen (`tools/s2-wiederholung.html`, 33
  Schnipsel aus 8 Sporen), dann Rollout in alle Träger.

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

## Nachziehen und Sporen je Schicht

Eine Schicht ist erst fertig, wenn sie in **allen** Trägern auf `main` steht (`kanon-verteilen`,
je Repo Probe, PR, Merge, nachzählen). Sage allein reicht nicht: die Apps tragen eigene Kopien.

| Schicht | neue Spore nötig? | Übergang |
|---|---|---|
| Bau 23.R (gebaut) | nein — signiert mit dem vorhandenen Schlüssel | alte Träger antworten „unbestätigt" |
| S1 Fragen unterschreiben | nein — derselbe Schlüssel | unsignierte Fragen als „unbestätigt" beantworten |
| S2 Vektor nachrechnen | **möglich** — wessen Vektor nicht zur Beschreibung passt, signiert im Siegel neu; offen für `embeddingSource: "content"` | Karte „Bedeutung nicht geprüft" statt Ablehnung |
| S3 Rechenaufwand | nein | Zettel ohne Aufwand weiter annehmen, nur nachrangig |
| S4 Sperrliste | nein | — |
| S5 Bürgen | nein — Bürgschaften sind eigene, signierte Zettel | unverbürgt bleibt sichtbar |
| S6/S7 | nein | — |

## Reihenfolge (freigegeben, Klaus 2026-10-15)

S1 → S2 → S5 → S3 → S4; S6 und S7 erst nach eigenem Entscheid. Jede Schicht mit eigener
Probe **und** Gegenprobe, Rollout über `node tools/kanon-verteilen.mjs`.
⚠ Beim Rollout 2026-10-14 erhöhte der Verteiler nur `CACHE_VERSION`; Workflow-Calculate und
Workflow-Needs brauchen zusätzlich `node tools/cache-stand.mjs`.

## Was hier nicht hilft

Browser mit eingebauter KI lesen, was auf der Seite steht — keine Schicht am Mycel-Eingang
schützt davor (Prüf-Reihe Sitzung 6, „vermutet").
