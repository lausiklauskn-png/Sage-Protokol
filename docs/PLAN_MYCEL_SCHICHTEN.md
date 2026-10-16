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

- [x] **S2 — Vektor gegen Text nachrechnen** (Fehlerkorrektur) · `Entscheid`+`Bau` · ⏱ ~2 Sitzungen
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
  **Gemessen 2026-10-15 (Klaus, `tools/s2-wiederholung.html`, Tablet im DeX-Modus):** Haupt-Vektor 9 von 9 auf
  1,0000 nachgerechnet; Schnipsel 0,9949–0,9972 (40 aus 8 Sporen, alle über 0,99; einzeln
  statt im Stapel gerechnet, vermutete Ursache). SB-KIMTool-Point 0,888 und BookLedgerPro
  0,902 passen nicht zur Beschreibung und tragen kein `embeddingSource` → „nicht
  nachprüfbar“. **Schwelle 0,99 bestätigt.**
  **Ausgerollt 2026-10-15:** 28 Träger je ein PR, auf `main` 28/28 mit S2-Code, 27 mit
  Siegel-Aspekt (Company-Brain ohne Siegel); Verteiler danach „81 schon gleich · 0 hängen zurück“.

- [x] **S3 — Rechenaufwand je Zettel** (teure Balz) · `Entscheid`+`Bau` · ⏱ ~1 Sitzung
  Nostr NIP-13: der Sender rechnet vor dem Senden eine kleine Prüfsummen-Aufgabe. Fluten
  wird teuer, ein einzelner Zettel bleibt billig. Schwierigkeit mild, am Tablet zu messen.
  Empfänger bevorzugt, verwirft nicht.
  **Entscheid (Klaus 2026-10-16):** 12 Stufen, Karten + Fragen, „Vorrang bei Enge“ (ohne
  Anzeige an der Karte). Klaus fragte nach, ob mehr Aufwand besser wäre; Antwort im Chat: ein
  Angreifer mit Rechner-Code rechnet viel schneller als ein Tablet-Browser, jede Stufe, die ihn
  bremst, bremst das Tablet stärker. Er blieb bei 12.
  **Gemessen 2026-10-16 im Sitzungs-Behälter** (nicht am Tablet): reines JS 123 000
  Prüfsummen/s → 12 Stufen ~0,03 s je Zettel; Rechner-Code ein Kern 489 000/s → ~0,01 s,
  200 Flut-Karten ~2 s. Eine erste Zahl an Klaus (0,2 s / 40 s) kam aus der langsamen
  `crypto.subtle`-Schnittstelle und war falsch; sie wurde vor dem Bau richtiggestellt.
  **Gebaut in Sage** (INTERFACES § Modul 23 S3, Modul 23, Siegel-Aspekt): Feld `pow` in Karte
  und Frage; voller Raum (200) → Karte mit Aufwand verdrängt die zuletzt gekommene ohne;
  Fragen ohne Aufwand höchstens 4 der 6 Antworten je Minute (die 4 ist eine Setzung dieser
  Sitzung, benannt: „2 Plätze bleiben Fragen mit Aufwand“, wie S1 „2 von 6“).
  Probe `tests/smoke_s3_aufwand.mjs` 19 grün (nachgerechnet mit Node-crypto, nicht mit dem
  Modul), Gegenprobe `tests/gegenprobe_s3_aufwand.mjs` 14 von 14 gefangen, je mit dem Namen
  der Zusicherung. **Ausgerollt 2026-10-16:** 29 Träger je ein PR, auf `main` 29/29 mit S3-Code,
  28 mit Siegel-Aspekt (Company-Brain ohne Siegel); Verteiler danach „84 schon gleich · 0 hängen
  zurück“. **Offen:** Zeit am Tablet messen.

- [ ] **S4 — Signierte Sperrliste im Mycel** (Gedächtnis) · `Entscheid`+`Bau` · ⏱ ~1 Sitzung
  Wie in Kimboard: nur Klaus unterschreibt, nur nach oben (sperren); gelöst wird nur in der
  Datei. Gesperrte Kennungen erscheinen nicht auf der Karte und werden nicht beantwortet.

  **Entscheid (Klaus 2026-10-16):** öffentlich und signiert; die Liste liegt in Sage, und
  Sage-Protokol unterschreibt (derselbe Netzadmin wie bei den Bürgschaften, auf Nachfrage
  bestätigt: die Offenheit des Repos ändert nichts, geprüft wird mit dem öffentlichen
  Schlüssel aus der Spore). Im eigenen Netz unterschreibt dessen Netzadmin. Damit ist der
  Tafel-Widerspruch zu Karte 12 („nicht öffentlich“) für das Mycel entschieden.
  Transport wie die Bürgschaften: die Liste reist signiert auf den Karten im Raum mit, die
  Apps laden sie nicht aus dem Repo (beim Laden kein Netz). `sbkim/sperrliste.json` ist
  Ablage und Beleg. Format und Wirkung: INTERFACES § Modul 23 S4.

- [x] **S5 — Bürgen** (Empfehlung statt Netz-Code) · `Entscheid`+`Bau` · ⏱ ~2–3 Sitzungen
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
  **Entscheid (Klaus 2026-10-15):** Kette **2 Schritte** · Anker **Klaus + eigene Kontakte** ·
  Ablauf **1 Jahr**.
  **Stand 2026-10-15: Teil 1 in Sage gebaut** (INTERFACES § Modul 23 S5): Bürgschaft und
  Widerruf als signierte Zettel, reisen in der Raum-Karte mit; `vouchTrust` prüft Kette,
  Ablauf, Widerruf und „der Bürge haftet"; Anzeige „🤝 verbürgt von …" an der Karte DE/EN,
  immer mit Kennung, ein Name nur aus den eigenen Kontakten. Probe
  `tests/smoke_s5_buergen.mjs` 41 grün, Gegenprobe `tests/gegenprobe_s5_buergen.mjs` 14 von 14
  gefangen; ein fünfzehnter Fall war ein toter Anker (die Prüfung änderte nichts), die
  Zeile ist entfernt. **Offen:** (a) mit welcher Identität Klaus bürgt — bis dahin ist der
  feste Anker leer, es zählen nur eigene Kontakte; (b) ob verbürgte Karten in der
  Frage-Rangfolge Vorrang bekommen (bis dahin ändert S5 die Reihenfolge nicht);
  (c) Teil 2: Oberfläche zum Ausstellen (Sicherheitsnummer vergleichen, Bürgschaft
  weitergeben, Kontakte pflegen); (d) „aufgefallen" kommt bis S4 nur von Hand;
  (e) Siegel-Aspekt und Rollout erst mit Teil 2.
  **Entscheid (Klaus 2026-10-15) zu (a) und (b):**
  - (a) Klaus bürgt als Netzadmin des offenen Mycels mit **Sage-Protokol**, Kennung
    `BgjXhSApoOrJD6zFJ4uuEpAliGWPokpKn7UMWRm94PA` (`sbkim/spore.json`, signiert
    2026-09-10T13:20:21.535Z; Raum und Depot dieselbe Spore, `sbkim/NETZ-STAND.md`). Der
    Schlüssel liegt in Klaus' Browser auf der Sage-Page (`index.html` trägt Andock-Wizard und
    23-UI). Nach der Leitlinie unten gilt diese Kennung **nur im offenen Mycel**, nicht in
    einem eigenen Netz.
  - (b) **Verbürgte Karten rücken nach vorne.** Bau-Vorschlag für Teil 2: in
    `rankCardsByQuery` nach der Regel „passt nicht ans Ende“ zuerst Netzadmin, eigene
    Kontakte und Verbürgte, dann Unverbürgte; innerhalb jeder Gruppe nach Frage-Passung.
    Benannter Preis: eine gut passende unverbürgte Karte kann hinter einer schwächer
    passenden verbürgten stehen.
  **Stand 2026-10-15: Teil 2 in Sage gebaut** (INTERFACES § Modul 23 S5 Teil 2):
  Netzadmin je Netz (`RDV_OPEN_MYCEL_ADMIN` = Sage-Protokol nur im öffentlichen Netz; im
  eigenen Netz das neue Feld `admin` der Netz-Einstellung, reist im Netz-Link als `a`);
  `rankCardsByQuery` stellt Netzadmin, Kontakte und Verbürgte vor die übrigen (nur mit
  Frage-Vektor; „passt nicht“ bleibt am Ende); Sicherheitsnummer `vouchSafetyNumber`
  (wie B7, aus beiden `publicKey.x`); Oberfläche: je Karte „🤝 Bürgen“ (Nummer, Haken,
  unterschreiben, Kontakt merken, widerrufen), Kasten „🤝 Bürgschaften“ (einfügen,
  Kontakte, Netzadmin); „🤝 Anker“ heißt „🤝 Netzadmin“. Siegel-Aspekt S5 ergänzt.
  `RDV_VOUCH_ANCHORS` ist ersetzt (eine feste Kennung im Kanon wäre in jedem fremden Netz
  mit verankert). **Ausgerollt 2026-10-15** in 29 Träger (je 1 PR, auf `main` 29/29
  nachgezählt, Siegel-Aspekt in 28 — Company-Brain trägt kein Siegel). **Offen:** Tablet nicht
  gemessen (zwei echte Geräte, die einander bürgen); „aufgefallen“ weiter nur von Hand (bis
  S4/Modul 10); Privat-Brains eigenes Mycel-Fenster zeigt keine Bürgen-Oberfläche (PFLEGE § 19).

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

## Leitlinie: Wer ein Netz betreibt, ist dort der Netzadmin (Klaus 2026-10-15)

Das Knotennetz ist ein Werkzeug, das andere für ihre Firma oder ihren Verein nachbauen
(Modul 23 „eigenes Netz“, Netz-Code). Darum gilt für S4, S5 und das Melden:

- **Im offenen Mycel ist Klaus der Netzadmin. In einem eigenen Netz ist es dessen
  Betreiber.** Bürgen, Melden und Sperrliste unterschreibt in jedem Netz dessen eigener
  Netzadmin, nicht Klaus.
- **Das Wort:** In Doku und Oberfläche heißt die Rolle **„Netzadmin“** (Klaus
  2026-10-15, statt „Anker“). Im Code bleibt der Name `anchor` / `vouchAnchors` /
  `RDV_VOUCH_ANCHORS`. Die Oberfläche zeigt seit S5 Teil 1 noch „🤝 Anker“ (in 28 Trägern
  mit dem S2-Rollout #1118); umbenannt wird mit S5 Teil 2, damit es ein Rollout bleibt.
- **Folge für den Bau:** Klaus' Kennung gehört in die Einstellung des **offenen** Mycels,
  nicht fest in den Kanon. Sonst wäre sie in jedem fremden Netz mit verankert. S5 nimmt den
  Netzadmin schon als Einstellung (`init({vouchAnchors})`); `RDV_VOUCH_ANCHORS` ist leer.
  Offen: wie die Netz-Einstellung den Netzadmin trägt.
- **Die Werkzeuge stecken in den Modulen**, nicht nur in Klaus' Seiten (PWA Toolpoint,
  family-project, Studio). Wer ein eigenes Netz aufbaut, bekommt Bürgen, Melden und
  Sperrliste mit.

### Zuordnung zu den alten Modul-Karten (gelesen 2026-10-15)

Die Karten 10, 11, 12 und 14 sind Pläne (`docs/MODUL-STAND.md`: Stub, Priorität niedrig);
Code gibt es zu keiner. Was davon in den Schichten aufgeht, wird **als** dieses Modul gebaut,
nicht daneben neu:

| Modul-Karte | Inhalt der Karte | geht auf in |
|---|---|---|
| 10 Reputation | Ruf-Wert mit Verblassen; Quorum (`QUORUM_RATIO = 0.15`) → gemeinsame Misstrauensliste | **Melden** (mindestens zwei unabhängige, verbürgte Knoten, mit Beleg → „aufgefallen“, Bürge haftet); „Rang durch Bewährung“ erst später. Gebaut ist davon nur „der Bürge haftet“ (S5 Teil 1) |
| 11 Rate-Limit | Bremse gegen Fluten, Hop-Grenze | zum großen Teil schon in Modul 23/05b verteilt (6/min, 2 davon unsigniert, 3 Identitäten je Absender, Raum-Deckel); **S3** ist das nächste Stück |
| 12 Blocklist | Sperrliste des Netzadmins | **S4** |
| 14 Diffusion | Knoten empfehlen einander beim Andocken | nicht Teil der Schichten; bleibt liegen |

Bei 13 Trägern ergeben 15 % genau 2 Knoten — dieselbe Zahl wie Klaus' „mindestens zwei“.
Vor dem Bau von Modul 10 nachsehen, was PWA Toolpoint und family-project schon haben
(Melde-Knopf, „geprüft/ungeprüft“, aus dem Studio steuerbar — Klaus 2026-10-15, in dieser
Sitzung nicht angesehen).

**Entschieden (Klaus 2026-10-16, Tafel-Widerspruch aufgelöst):** Karte 12 sagte, die
Sperrliste wird **nicht öffentlich** verteilt (sonst erfährt der Angreifer davon). S4 sagt:
**signiert und öffentlich** wie in Kimboard, damit jede App sie lesen kann. Klaus hat
„öffentlich, signiert“ gewählt. Der Preis bleibt benannt: ein Gesperrter sieht es und kann
eine neue Kennung erzeugen; dagegen tragen S3 und S5.

## Reihenfolge (freigegeben, Klaus 2026-10-15)

S1 → S2 → S5 → S3 → S4; S6 und S7 erst nach eigenem Entscheid. Jede Schicht mit eigener
Probe **und** Gegenprobe, Rollout über `node tools/kanon-verteilen.mjs`.
⚠ Beim Rollout 2026-10-14 erhöhte der Verteiler nur `CACHE_VERSION`; Workflow-Calculate und
Workflow-Needs brauchen zusätzlich `node tools/cache-stand.mjs`.

## Was hier nicht hilft

Browser mit eingebauter KI lesen, was auf der Seite steht — keine Schicht am Mycel-Eingang
schützt davor (Prüf-Reihe Sitzung 6, „vermutet").
