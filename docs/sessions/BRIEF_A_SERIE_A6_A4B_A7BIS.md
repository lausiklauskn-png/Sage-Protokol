# BRIEF für die nächste Sitzung — A-Serie weiter (A6 · A4 Teil 2 · A7–A9 · A5b)

> **Stand: 2026-07-11 (Abend).** Freibrief gilt (siehe `CLAUDE.md` § Freibrief:
> selbstständig bauen + eigene PRs mergen, wenn getestet/abgegrenzt/nicht zweifelhaft;
> im echten Zweifel erst Klaus fragen). **Fremdnutzer-/Marktplatz-Brille immer
> mitdenken** (fail-soft, klar benennen, geteilte-Origin-Fallen vermeiden).

## Pflichtlektüre (in dieser Reihenfolge, VOR dem Bauen)

1. `CLAUDE.md` — Verfassung + § SITZUNGSSTART-PFLICHT: **immer frisch von `origin/main`
   abzweigen** (`git fetch origin main && git checkout -B <branch> origin/main`), nie auf
   altem Klon urteilen. **Lokale Klone sind teils Monate alt** (diese Sitzung: Rezeptbuch
   war 273 Commits hinter, BLP 246 — beide frisch abgezweigt).
2. `docs/PULS.md` — oberster Eintrag (A5-Rollout, 11.07.) + Schlüssel-Tresor + Meilenstein.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — die Abhak-Liste A1–A15 / B1–B7. Erledigte Punkte DORT
   abhaken (`[ ]`→`[x]`, Datum) + in PULS vermerken.
4. `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` — was bewiesen ist und was nicht.
5. Modul-Code der zugewiesenen Scheibe (nur den).

## Ausgangslage — was zuletzt (11.07.) erledigt wurde

- **✅ A5 — Multi-Query-Rollout GESCHLOSSEN** (4 PRs gemergt): Mixarium #119, Rezeptbuch #307,
  family #58, BLP #263. Wichtige **Lehre**: die Apps sind heterogen — **Such-Flächen** (Mixarium/
  Rezeptbuch `semRun`: filtert → Multi-Query im Gratis-Vorfilter) vs. **Sortier-Flächen**
  (family-Marktplatz `markt.html`, Pinnwand: ordnet um, versteckt nichts → Multi-Query als
  bester-Cosinus-über-Varianten) vs. **kein Suchfeld** (Antwort-Pfad `15_membran`) vs. **eigener
  Such-Stack** (BLP `hybridSearch`+`kontoSynonyme`, schon gut). **Immer erst kartieren, welche Art
  Fläche** — ein Filter auf einer Sortier-Fläche versteckt Nutzer-Einträge (falsch).
- **✅ Vorher (11.07.):** Schlüssel-Tresor netzweit (Modul 20 `putSecret/getSecret`), A13 Identitäts-
  Isolierung, A4 Teil 1 (Ausschluss-Filter).
- **Keine offenen eigenen PRs.** `main` ist überall Wahrheit + Pages-Deploy-Quelle.

## Geplante Aufgabe — A-Serie weiterführen

**Vorgeschlagene Reihenfolge** (mit Klaus abstimmen, Plan-vor-Code, außer Freibrief für den Umfang):

### 1. Schnelle Sicht-Haken — A7 · A8 · A9 (kein Bau, ~15–30 Min je)
Headless grün, warten auf Klaus' Browser-Lauf. Klare Ein-Schritt-Anleitungen (benannte Knöpfe,
kein Terminal) vorbereiten, bei Erfolg in `PLAN_SEMANTIK_KRYPTO.md` abhaken:
- **A7** — Sage-Suchfeld: Hybrid-Vorfilter + Multi-Query am Tablet. **Neu jetzt auch: die A5-Apps
  (Mixarium/Rezeptbuch Sinn-Suche, family-Marktplatz „Nach Bedeutung") live prüfen.**
- **A8** — „Wählen"-Umschalter verbunden ↔ verwandt.
- **A9** — „verwandt · KI" mit echtem Schlüssel (jetzt bequem via Schlüssel-Tresor).

### 2. A6 — Echte Embedding-Vektoren statt Demo-Stub (`Bau`, GRÖSSTER Hebel, ~1–2 Sitzungen)
Modul 03: `_demo`-`domainVector` durch echte Vektoren ersetzen → erst dann „verified-match" statt
nur „verified-spore". Offline-Modell-Quelle (Modul 03) ist schon ausgerollt — darauf aufbauen.
**⚠️ Schwer umkehrbar:** ändern sich die Vektoren, müssen Knoten evtl. neu signiert werden
(Datenvertrag) → **echtes Zweifeln, erst mit Klaus abstimmen**, bevor Loslegen.

### 3. A4 Teil 2 — KI-Richter B3 (`Bau`, ~1 Sitzung)
Unsicheres markieren/herabstufen, Sicheres hochstufen (Hund-Katze-/Permethrin-Fall). Baut auf dem
opt-in-KI-Richter (`hybridMatch`) auf. **Merke:** Ausschluss/Herabstufung gehört auf Korpus-SUCH-
Flächen, nicht auf SORTIER-Flächen (dort nur umordnen, nie verstecken).

### 4. A5b — (Optional) Multi-Query-Sortierung in Pinnwand (~30 Min)
Pinnwand ist eine Sortier-Fläche wie der family-Marktplatz; dasselbe „bester-Cosinus-über-Varianten"-
Muster ließe sich übertragen. Zurückgestellt (Klaus 11.07.: Pinnwand läuft gut) — nur auf Zuruf.

> **Weiter offen (nur zur Kenntnis):** A3 (Medium härten), A10 (Schnipsel-Mittel, Datenvertrag),
> A11 (Such-Ergebnis→Frage→Andocken), A12 („Antworten an/aus"), A14 (ensureStore-Race), A15
> (Zwei-Stufen-Verbinden). B1–B7 = Verschlüsselung.

## Leitplanken (immer)
- **Kopieren, nicht klonen** — Kanon in `Sage-Protokol/src/modules`, Apps byte-1:1 wo Byte-Kopie-Module,
  Drift-Guards. **Aber:** app-adaptierte Module (z.B. `15_membran` mit app-eigener Synonym-Karte) sind
  KEINE reinen Byte-Kopien — dort Muster portieren, nicht Datei kopieren.
- **Ehrlichkeit** — Headless-Beweis (`node tests/...`), Browser-Sichttest bleibt „ungeprüft, wartet auf
  Klaus", bis er es gesehen hat.
- **Kern unantastbar** — Modul 02/05/05b + `PROVIDER_MIN_MATCH` 0.80 nur lesen, nie gaten/absenken ohne
  ausdrückliche Klaus-Freigabe.
- **Build-Quellen synchron** — Mixarium `index.html` == QC (md5!); Rezeptbuch: Tag in die QC-Quelle,
  dann `python3 build.py`. SW-Cache bumpen, wo ein precachtes Shell-File geändert wird (BLP-Pflicht).
- **Fläche kartieren, bevor A-Feature einbauen** — Such- vs. Sortier- vs. Antwort-Pfad (A5-Lehre).

## Abschluss-Pflicht (Brief-Kette reißt nie ab)
1. `docs/PULS.md` fortschreiben (getan / offen / nächster Schritt).
2. Erledigte A-Punkte in `docs/PLAN_SEMANTIK_KRYPTO.md` abhaken (Datum).
3. Eigene PRs testen (headless grün) → Draft-PR → ready → squash-merge (Selbst-Merge-Freibrief);
   bei echtem Zweifel erst Klaus fragen.
4. **Neuen Brief** `docs/sessions/BRIEF_*.md` für die Folge-Sitzung schreiben + hier die Pflichtlektüre
   + diesen Abschluss-Befehl wiederholen.
5. Den vollständigen Brief-Codeblock **im Chat** ausgeben (Klaus liest zuerst den Chat).
6. „Vorgeschlagene nächste Schritte"-Block (2–4 Punkte) direkt in der Chat-Antwort.
