# PULS-Auslagerung 2026-11-16 — zwei Einträge vom 2026-10-15, zwei vom 2026-10-14

**Ausgelagert am 2026-11-16**, weil `docs/PULS.md` mit dem Eintrag „Wie zwei sich finden als Film, Schlüssel dreht sich“ über der
3000-Zeilen-Grenze gestanden hätte (2992 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt
kürzen**: hier stehen die Einträge **wortwörtlich**.

---

## 2026-10-15 · Abschluss Prüf-Reihe Sitzung 6 · Plan Paper S (Hauptsitzung)

- **Getan:** `docs/papers/PLAN_PAPER_KNOTENNETZ.md` (Paper S „Sicherer Umgang im Knotennetz", Ergänzung zum SBKIM-Paper; Natur als eigenes Kapitel, Klaus' Lesart „Störungen als Prüfmechanismus" gekennzeichnet), Zeiger in `PLAN_PAPERS.md`, Antragsmappe neu erzeugt. Abschluss `docs/sessions/archiv/2026-10-15_abschluss_pruef-reihe-sitzung6.md`, Folge-Brief `docs/sessions/BRIEF_2026-10-15_schutzschichten_und_paper_s.md`. Pflege-Liste #13, #14.
- **Kimhub:** Klaus meldet die Gegenprobe dort als durch und hat die Forschungseinträge freigegeben. Diese Sitzung konnte Kimhub nicht einbinden (Zugriff abgelehnt); die Einträge stehen als Material im Abschluss, Abschnitt 5.
- **Nächster Schritt:** Folge-Brief — Klaus' Freigabe der Schichten, dann S1 (Fragen unterschreiben) und die fünf noch offenen Träger.

## 2026-10-15 · Plan: Schutzschichten am Mycel-Eingang (Hauptsitzung)

- **Getan:** `docs/PLAN_MYCEL_SCHICHTEN.md` angelegt — Abhak-Liste S1–S7 nach Klaus' Frage, ob sich die mehrstufigen Artgrenzen der Natur aufs Mycel übertragen lassen. Kein Code.
- **Klaus' Wort:** „Bürgen mit in den Plan-Brief aufnehmen“ → S5. Sein Einwand „man kann sich selber einen Bürgen ausstellen“ steht als Regel darin: eine Bürgschaft zählt nur, wenn der Leser dem Bürgen schon traut; dazu kurze Kette, Haftung, Widerruf, Ablauf, Anker.
- **Stand Rollout Bau 23.R:** auf `main` von Sage und 13 Trägern nachgezählt (`RDV_LABEL_MAX = 200`), Mycel-Karte mit `sicher()`. Nicht ausgerollt: PWA-Toolpoint, Kimseek, SB-KIMTool-Point, family-project, Kim-Bell.
- **Offen:** alle Schichten außer dem Planpunkt S5 warten auf Klaus' Freigabe; Vorschlag S1 → S2 → S5 → S3 → S4.

## 2026-10-14 · Prüf-Reihe Sitzung 6 (Planmodus): Ist das Mycel ein Angriffspunkt?

⛔ Kimhub nicht angefasst, keine Forschungseinträge in Kimhub (Gegenprobe läuft dort). Satz weitergeben, bis Klaus ihn aufhebt.

**Befund:** [`sessions/archiv/2026-10-14_angriffsflaeche_mycel.md`](sessions/archiv/2026-10-14_angriffsflaeche_mycel.md), Proben daneben. Gemessen mit echten Modulen und frisch signierten Sporen:
- Modul 23 liest `verifyForeignSpore(...) !== false`, Modul 02 liefert `{valid,reason}` → **die Kartenechtheit im Raum wirkt nicht**. Die Probe dazu stellte einen Prüfer mit `true/false`.
- `collapseByName` vor der Prüfung → eine fremde Karte gleichen Namens verdrängt die echte.
- Antworten (`sbkim-query-res`) sind nicht an den gefragten Knoten gebunden; ein Mithörer antwortet in dessen Namen.
- Prüfliste vor dem Richter (04.J): klassisch DE/EN ausgeschlossen; umformuliert, Französisch, Homoglyph stehen im Prompt.
- `domainVector` nicht an den Text gebunden; Vektor-Kopie trifft den Andock-Riegel mit 1.0.
- Gelesen: `innerHTML` mit fremdem Namen in `mycel-karte/index.html` (Ereignis-Protokoll) und Kimboard („Kontakt senden").

**Klaus' Wahl:** Punkte 1–4 freigegeben (Echtheit `.valid`, Namen nach der Prüfung zusammenfassen, Antworten binden, die zwei HTML-Stellen escapen). Module 10/11/12 nach 1–3; 14 erst danach (vergrößert sonst die Fläche).

**Gebaut (Bau 23.R + 02.Z):** Echtheit liest `.valid`, Prüfung vor dem Zusammenfassen, `gleicherName`; Antworten mit Spore + Unterschrift, nur der gefragte Knoten, unbestätigte nicht an den Richter; Modul 02 `signDetached`/`verifyDetached`; Aspekt in Modul 16; INTERFACES zuerst. Mycel-Karte (#32 im Original, Kopie hier) und Kimboard „Kontakt senden“: fremder Name als Text — **in der alten Fassung lief in beiden ein Skript (gemessen)**. Proben: `smoke_bau23r` 18 grün · Gegenprobe 10/10 · `smoke_mycel_karte_log` alt 3 ROT/neu 4 grün. Voller Lauf: 117 grün, 1 rot (`smoke_geraetename_netzweit`: „keines der Knoten-Repos liegt neben Sage“, auch ohne diese Änderung), 1 nicht lauffähig.
**Offen:** Rollout 02/16/23/23-UI in alle Träger (`kanon-verteilen`), `mycelknoten.html` (02/16 eingebettet, kein 23) nicht nachgezogen. Nicht am Tablet gemessen.

## 2026-10-14 · Prüf-Reihe Sitzung 4: Kim-sync zeichnet empfangene Bilder neu, 04/22/24 in den letzten Trägern, Mycel-Knoten

**Gebaut (Kimhub nicht angefasst):**
- **Kim-sync #18:** jedes empfangene Bild wird neu gezeichnet, bevor es gespeichert, gezeigt oder heruntergeladen wird (EXIF/XMP/PNG-Text und Angehängtes weg). Nicht zeichenbar → nicht gezeigt, nie das Original. Probe 250 grün · Gegenprobe 7 gefangen · 0 durchgerutscht.
- **PWA-Toolpoint #166 · Kimseek #91 · SB-KIMTool-Point #184:** `kanon-verteilen --nur 04_match,24_ocr_eingabe` und danach `--nur 22_such_widget` (22 hing ebenfalls zurück und ruft 24 auf). Herkunfts-Riegel: alles Kanon. Prüfliste je Träger direkt nach 04, gepinnt, im Browser `prueflisteGeladen === true`, ohne die Zeile `false`. Kimseeks `brain.html` zeigt ausgeschlossene Kandidaten, nennt den Grund eines abgeschalteten Richters, hält bei verstecktem Text einmal an. SB-KIMTool-Point trägt die Liste auch inline in `such-werkzeug.html`.
- **`docs/observatorium/tools/mycelknoten.html`:** Modul 04 nachgezogen, Prüfliste direkt dahinter (gespiegelt nach SB-KIMTool-Point). Im Browser alt und neu gleich: Init-Kette fertig, Siegel zertifiziert, Andocken VALID; neu `prueflisteGeladen === true`.

**Offen:** die übrigen Module der Mycel-Knoten-Seite (01/02/03/05/15/16/17) stehen in einer älteren Generation — das heutige Siegel verlangt 05b, das sich nicht einbetten lässt (README dort) · BookLedgerPro-Arbeitsbaum 317 Commits hinter origin (Automat lässt ihn aus) · nichts am Tablet gemessen.
