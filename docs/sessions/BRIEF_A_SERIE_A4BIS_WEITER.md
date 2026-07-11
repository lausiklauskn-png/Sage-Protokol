# BRIEF für die nächste Sitzung — A-Serie weiterführen (A4 Teil 2 · A5 · A6 · A7–A9 …)

> **Stand: 2026-07-11 (Nachmittag).** Freibrief gilt (siehe `CLAUDE.md` § Freibrief:
> selbstständig bauen + eigene PRs mergen, wenn getestet/abgegrenzt/nicht zweifelhaft;
> im echten Zweifel erst Klaus fragen). **Fremdnutzer-/Marktplatz-Brille immer
> mitdenken** (fail-soft, klar benennen, geteilte-Origin-Fallen vermeiden).

## Pflichtlektüre (in dieser Reihenfolge, VOR dem Bauen)

1. `CLAUDE.md` — Verfassung + § SITZUNGSSTART-PFLICHT: **immer frisch von `origin/main`
   abzweigen** (`git fetch origin main && git checkout -B <branch> origin/main`), nie auf
   altem Klon urteilen. Netzweiter Refresh-Hook zuerst laufen lassen.
2. `docs/PULS.md` — oberster Eintrag (Schlüssel-Tresor, 11.07.) + Meilenstein 10./11.07.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — die **Abhak-Liste A1–A15 / B1–B7**. Wer einen Punkt
   erledigt, hakt ihn DORT ab (`[ ]`→`[x]`, Datum) + vermerkt es in PULS.
4. `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` — was bewiesen ist und was nicht.
5. Modul-Code der zugewiesenen Scheibe (nur den): `src/modules/03_embedding.js` (A6),
   `04_match.js` (A4/A5), `22_such_widget.js` + `23_rendezvous_ui.js` (A5-Einbau).

## Ausgangslage — was zuletzt (11.07.) erledigt wurde

- **✅ Schlüssel-Tresor netzweit LIVE GRÜN.** BYOK-KI-Schlüssel verschlüsselt merken
  (Modul 20 `putSecret/getSecret`, PBKDF2 600k + AES-GCM-256) + **Vergessen-Schutz**
  (ehrlicher Hinweis „Schlüssel gratis neu holbar" + optionale, app-eigene Merkhilfe
  `getSecretHint`; KEINE E-Mail/kein Server/kein PII). Netz-Panel-Knöpfe „🔒 merken" /
  „🔓 entsperren", fail-soft ohne Modul 20. **11 PRs auf `main`** (Sage-Kanon + 9 Apps +
  Skill-Spiegel family). Klaus' Browser-Sichttest (Tomys Hub) grün. Skill
  `verschluesselter-schluessel-tresor` angelegt (Sage + family `.claude/skills/`).
- **✅ A13 Identitäts-Isolierung** geschlossen (11/11 Apps eigene nodeId, Browser-Beweis).
- **✅ A4 Teil 1** (Ausschluss-/Negations-Filter, Bau 04.I) + **netzweiter Rollout** —
  „ohne X"/„alkoholfrei"/„allergisch gegen X" filtern deterministisch, 10 Knoten + Kanon.
- **Keine offenen eigenen PRs.** `main` ist überall die Wahrheit + Pages-Deploy-Quelle.

## Geplante Aufgabe — die A-Serie weiterführen (Klaus' Auftrag 11.07.)

Klaus: „den Bauer A4 A5 A6 A7 und so weiter vorführen." Also die semantischen
A-Punkte abarbeiten. **Vorgeschlagene Reihenfolge** (mit Klaus abstimmen, Plan-vor-Code,
außer er gibt Freibrief für den Umfang):

### 1. Schnelle Sicht-Haken zuerst — A7 · A8 · A9 (kein Bau, ~15–30 Min je)
Alles headless grün, wartet nur auf Klaus' Browser-Lauf. Diese drei kann Klaus in
einer Sitzung am Tablet durchklicken; die Sitzung bereitet klare Ein-Schritt-Anleitungen
(benannte Knöpfe, kein Terminal) vor und hakt bei Erfolg in `PLAN_SEMANTIK_KRYPTO.md` ab:
- **A7** — Sage-Suchfeld: Hybrid-Vorfilter + Multi-Query am Tablet prüfen.
- **A8** — „Wählen"-Umschalter verbunden ↔ verwandt sichtbar/korrekt.
- **A9** — „verwandt · KI" mit echtem Schlüssel (jetzt bequem: **Schlüssel im Tresor
  merken** — der neue Tresor macht A9 angenehmer, Schlüssel muss nicht neu getippt werden).

### 2. A5 — Rollout Hybrid-Vorfilter + Multi-Query in weitere Apps (`Bau`, ~1 Sitzung)
BM25+Vektor + Multi-Query (aus Bau 22f, in Sage-Suchfeld schon live) **byte-gleich** in:
Pinnwand · Mixarium · Rezeptbuch · family-project · BookLedgerPro. Reine Vorfilter-/
Inklusions-Verbesserung; `PROVIDER_MIN_MATCH`/0.80-Andock-Riegel + Modul 05 unberührt,
kein PROTOCOL_VERSION-Bump. Byte-1:1-Disziplin + Drift-Guards + SW-Cache-Bumps wo nötig.

### 3. A6 — Echte Embedding-Vektoren statt Demo-Stub (`Bau`, ~1–2 Sitzungen, GRÖSSTER Hebel)
Modul 03: den `_demo`-`domainVector` durch **echte** Vektoren ersetzen. Erst dann wird
aus „verified-spore" ein echtes „verified-match" — die Verwandt-Trennung, an der bisher
der gratis-Cosinus scheitert (siehe LEHRE-Doc „tiefe Nacht"). Offline-tauglich halten
(A6-Baustein „Offline-Modell-Quelle Modul 03" ist schon upstreamed/ausgerollt — darauf
aufbauen). **Datenvertrag beachten:** ändern sich die Vektoren, ggf. Knoten neu signieren
(mit Klaus abstimmen — das ist der schwer-umkehrbare Teil → echtes Zweifeln, erst fragen).

### 4. A4 Teil 2 — KI-Richter B3 (`Bau`, ~1 Sitzung)
Unsicheres markieren/herabstufen, Sicheres hochstufen (Hund-Katze-/Permethrin-Fall).
Baut auf dem opt-in-KI-Richter (`hybridMatch`) auf, den es im Widget + Netz-Panel schon
gibt. **Merke (2026-07-10):** Ausschluss-Filter gehört NUR auf Korpus-SUCH-Flächen, nicht
auf Thread-SORTIER-Flächen (Pinnwand ordnet nur um, entfernt nichts) — B3 dort korrekt.

> **Weiter offen danach (nicht dieser Auftrag, nur zur Kenntnis):** A3 (Medium härten,
> Antworter-Tab-Grenze), A10 (Schnipsel-Mittel, Datenvertrag-Eingriff — zurückgestellt),
> A11 (Such-Ergebnis → Frage → Andocken, Marktplatz-Kopplung), A12 („Antworten an/aus"
> überdenken), A14 (ensureStore-Race Modul 05/01), A15 (Zwei-Stufen-Verbinden: Stöbern
> anonym ↔ voll mitmachen). B1–B7 = Verschlüsselung.

## Leitplanken (immer)
- **Kopieren, nicht klonen** — Kanon in `Sage-Protokol/src/modules`, Apps byte-1:1,
  Drift-Guards (Kimboard/Kimseek/Kim-Bell recorded-sha; SB-KIMTool byte-embed).
- **Ehrlichkeit** — was gemeldet wird, ist real; Headless-Beweis (`node tests/...`),
  Browser-Sichttest bleibt „ungeprüft, wartet auf Klaus", bis er es gesehen hat.
- **Kern unantastbar** — Modul 02/05/05b + `PROVIDER_MIN_MATCH` 0.80 nur lesen, nicht
  gaten/absenken ohne ausdrückliche Klaus-Freigabe.
- **Build-Quellen synchron** — Mixarium `index.html` == QC (md5!); Rezeptbuch: Tag in
  die QC-Quelle, dann `python3 build.py` (sonst verliert der nächste Build den Tag).
- **Fremdnutzer-/Marktplatz-Brille** — fail-soft für Fehlendes, Kosten/Daten-Abfluss/
  Schlüssel-Verbleib klar benennen, geteilte-Origin-Fallen (app-eigene Suffixe) meiden.

## Abschluss-Pflicht (Brief-Kette reißt nie ab)
1. `docs/PULS.md` fortschreiben (getan / offen / nächster Schritt).
2. Erledigte A-Punkte in `docs/PLAN_SEMANTIK_KRYPTO.md` abhaken (Datum).
3. Eigene PRs testen (headless grün) → Draft-PR → ready → squash-merge (Selbst-Merge-
   Freibrief); bei echtem Zweifel erst Klaus fragen.
4. **Neuen Brief** `docs/sessions/BRIEF_*.md` für die Folge-Sitzung schreiben + hier die
   Pflichtlektüre + diesen Abschluss-Befehl wiederholen.
5. Den vollständigen Brief-Codeblock **im Chat** ausgeben (Klaus liest zuerst den Chat).
6. „Vorgeschlagene nächste Schritte"-Block (2–4 Punkte) direkt in der Chat-Antwort.
