# WEGWEISER — Einstieg für neue Sitzungen und neue Mitarbeiter

> Wer hier zum ersten Mal landet — Mensch oder Sitzung — folgt diesen
> neun Schritten der Reihe nach. Danach weißt du, wo du bist, was läuft,
> und was sinnvoll ist als nächstes zu tun.

---

## Worum geht es überhaupt?

**SBKIM** ist ein Protokoll, mit dem kleine PWAs sich gegenseitig im
Netz finden — nicht über eine zentrale Liste, sondern über **Bedeutung**.
Eine App, die Kochrezepte kennt, und eine App, die Cocktails kennt,
können einander erkennen, weil ihre Themen-Beschreibungen geometrisch
nah liegen.

**Sage-Protokol** ist nicht das Netz selbst, sondern die **Werkstatt**,
in der die Bausteine entstehen, die später per Copy-Paste in die echten
Apps wandern (zur Zeit: *Rezeptbuch* und *Mixarium*).

Bild: das Mycel im Wald. Einzelne Pilze sind sichtbar, der Boden voller
Hyphen ist unsichtbar — aber er ist das eigentliche Wesen. Sage-Protokol
beschreibt, wie die Hyphen wachsen.

---

## Neun Schritte

- [ ] **1. Diese Datei zu Ende lesen.** Sie ist der Einstieg, sonst nichts.

- [ ] **2. `CLAUDE.md` lesen.** Die Sitzungs-Verfassung. Was eine Sitzung
       tun darf, was nicht, wie sie endet, welche Tonalität gilt.

- [ ] **3. `docs/PULS.md` lesen — aber nur den obersten Eintrag.**
       PULS ist die laufende Tagebuch-Datei. Alte Einträge stehen unten,
       der oberste sagt dir, was die letzte Sitzung getan hat und was
       jetzt sinnvoll wäre. Mehr brauchst du beim Einstieg nicht.

- [ ] **4. `docs/ARCHITEKTUR.md` überfliegen.** Das Gesamtbild und der
       Bau-DAG der dreizehn Module. Wer hängt an wem. Reicht zum
       Verstehen, du musst nichts auswendig können.

- [ ] **5. `docs/INTERFACES.md` lesen.** Die **heiligen Tafeln**. Hier
       stehen die verbindlichen Schnittstellen zwischen den Modulen.
       Wenn eine Funktion hier steht, ist sie verbindlich. Wenn nicht,
       ist sie nicht festgelegt.

- [ ] **6. Deine Rolle klären.** Der Nutzer (Klaus) sagt dir im ersten
       Prompt, welche Rolle du hast:
       - **Hauptsitzung** — koordiniert, integriert, schreibt PULS fort.
       - **Spec-Sitzung** — füllt eine Komponenten-Karte und spiegelt
         die Schnittstelle in INTERFACES.md. **Kein** Code unter `src/`.
       - **Bau-Sitzung** — implementiert ein Modul nach fertiger Spec.
       Im Zweifel **frag**, bevor du loslegst.

- [ ] **7. Genau die eine Komponenten-Karte lesen, an der du arbeitest.**
       Liegt unter `docs/components/<NN>_<name>.md`. Liest nicht alle 13
       — das ist Token-Verschwendung und macht den Blick unscharf.

- [ ] **8. Arbeit machen.** Spec füllen, Code schreiben, Karte
       aktualisieren — was immer dein Auftrag ist. Halte dich an die
       Schnittstellen aus Schritt 5. Wenn du eine Schnittstelle ändern
       musst, **erst INTERFACES.md nachziehen, dann den Code**.

- [ ] **9. Sitzung sauber beenden.** Pflicht-Häkchen vor `END`:
       - `docs/PULS.md` aktualisiert (neuer Eintrag oben: Datum, Rolle,
         getan, offen, nächster sinnvoller Schritt).
       - Übergabeprotokoll unter
         `docs/sessions/archiv/YYYY-MM-DD_<thema>.md` (Vorlage:
         `docs/sessions/BRIEFING_TEMPLATE.md`).
       - Wenn `status.json` angefasst wurde:
         `python3 scripts/update_puls_pie.py` laufen lassen — das
         regeneriert den Mermaid-Pie in PULS.md aus den Daten.
       - Code geändert? Manuell prüfen, dass `tests/manual_check.html`
         im Browser noch lädt — oder begründet als „ungeprüft, weil ..."
         markieren.
       - Stand-Block unten in dieser Datei um eine Zeile ergänzen
         (siehe Format darunter).
       - Commit + Push auf `claude/semantic-agent-network-Y03Vg`. Ein
         Commit pro abgegrenzter Aufgabe, sprechende Message.
       - Draft-PR prüfen, ggf. anlegen.

---

## Mini-Glossar in einfacher Sprache

- **Sitzung** — ein Lauf einer Claude-Instanz. Hat keinen Gedächtnis
  über den Lauf hinaus. PULS.md und Sitzungs-Archiv sind ihr Gedächtnis.
- **Modul** — ein abgegrenzter Baustein des Protokolls (z.B.
  „Storage", „Embedding"). Es gibt zehn aktive + drei Schutz-Backlog-
  Module.
- **Komponenten-Karte** — die Markdown-Datei, in der ein Modul
  spezifiziert wird. Liegt unter `docs/components/`.
- **Spec** — Spezifikation. Beschreibt, **was** ein Modul tut und
  **wie** seine Schnittstelle aussieht. Noch kein Code.
- **Code** — die JS-Datei unter `src/modules/`. Setzt eine fertige
  Spec um. Wird von einer Bau-Sitzung geschrieben, nie von einer
  Spec-Sitzung.
- **Embedding** — die Übersetzung eines Textes in eine Liste von 384
  Zahlen. Ähnlich bedeutender Text → ähnliche Zahlen. Grundlage des
  Findens-durch-Bedeutung.
- **Selbstcheck** — eine Konsolen-Meldung, mit der ein Modul beim
  Laden in der DevTools-Konsole sagt: „Ich bin da, hier sind meine
  Funktionen." Erleichtert das Andocken in der Endknoten-PWA.
- **Endknoten** — eine echte PWA des Betreibers, in die SBKIM
  eingebaut ist (z.B. Rezeptbuch). Sage-Protokol selbst ist **kein**
  Endknoten, sondern die Werkstatt davor.
- **Mycel** — die durchgängige biologische Metapher: das unsichtbare
  Geflecht im Boden, das die einzelnen Pilze verbindet. Steht für das
  Netz der untereinander verbundenen Endknoten.
- **Andocken** — der Vorgang, mit dem ein neues PWA Mitglied wird.
  Schrittweise: Module kopieren, Spore erzeugen, in Geschwisterliste
  einsortieren.
- **PULS.md** — das Tagebuch. Jede Sitzung trägt unten einen Eintrag
  ein. Oberster Eintrag = jüngster.
- **Bau-DAG** — der Abhängigkeits-Graph der Module: wer hängt an wem.
  Visualisiert in `ARCHITEKTUR.md` §0.
- **status.json** — die maschinenlesbare Quelle für den Stand aller
  Module. Wird von der Sage-Page und vom Pie-Skript gelesen.

---

## Stand

Jede Sitzung trägt am Sitzungs-Ende **eine Zeile** unten ein. Format:

```
- YYYY-MM-DD · <Rolle> · <was getan> · NÄCHSTES: <was sinnvoll wäre>
```

Neueste Zeile **unten**. (Anders als PULS.md, wo der neueste Eintrag
oben steht — der Stand-Block hier ist eine Wanderung, kein Stapel.)

- 2026-05-14 · Spec-Sitzung 01+03 · Karten 01 (Storage) und 03 (Embedding) gefüllt, erste Vertrag-Sektionen in INTERFACES.md, status.json auf `spec`, WEGWEISER.md angelegt, manual_check.html mit Stub-Knöpfen ergänzt · NÄCHSTES: Bau-Sitzung Modul 01 oder Modul 03 (parallel möglich; Spec-Sitzung Modul 09 Einbau-PWA bleibt anbietbar).
- 2026-05-14 · Spec+Bau-Sitzung 04 · Karte 04 (Match) gefüllt mit modus-freier API `match(queryVec, passageVec)` + `isAboveProviderThreshold` + `PROVIDER_MIN_MATCH`, A1–B3-Notations-Synthese in der Karte gelöst (Hops tragen die Funktionen), `src/modules/04_match.js` geschrieben mit synchronem Selbstcheck beim Skript-Laden, sechs Knöpfe in `manual_check.html` Panel 04, INTERFACES.md Modul 04 auf `entwurf`, status.json 04 auf `stub`, Pie regeneriert · NÄCHSTES: Klaus klickt 01+03+04 im Browser durch; danach Spec-Sitzung Modul 02 Spore oder Modul 05 Anastomose (parallel: Modul 00 oder 09).
- 2026-05-14 · Spec+Bau-Sitzung 02 · Karte 02 (Spore) gefüllt mit Singleton-Identität (`"main"` in `sbkim_keys` + `sbkim_spore`), Sieben-Funktionen-API (init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore), `node_id = base64url(sha256(rawPublicKey))` ohne Padding (von anderen Knoten nachrechenbar), kanonischer Signatur-Pfad mit alphabetisch sortierten Keys; `src/modules/02_spore.js` geschrieben mit WebCrypto Ed25519 ohne Polyfill (`CryptoUnavailableError` bei Fehlen) und Persistenz strikt über `SbkimStorage`; fünf Knöpfe in `manual_check.html` Panel 02 (Identität / Spore / round-trip / Manipulation / Selbstcheck); INTERFACES.md Modul 02 auf `entwurf` und §2 Spore-JSON mit neun Pflicht- und fünf optionalen Feldern verbindlich ausgefüllt; status.json 02 auf `stub`, Pie regeneriert · NÄCHSTES: Klaus klickt 01+02+03+04 im Browser durch; danach Spec-Sitzung Modul 05 Anastomose (alle vier Vorbedingungen jetzt Stub) oder Modul 07 Apoptose; parallel: Modul 00 oder 09.
- 2026-05-14 · Pflege-Sitzung Match-Kalibrierung · Klaus' Sichttest 2026-05-14 ergab fünf reproduzierbare Cosinus-Messwerte (Käsekuchen/Käsetorte 0.9507, Käsekuchen/Auspuffrohr 0.8967, Hefeteig/Kochrezepte 0.8312, Tarantino/Kochrezepte 0.7737, gleicher Inhalt ~0.95); `PROVIDER_MIN_MATCH` 0.55 → 0.80 in INTERFACES.md §0 + Vertrag-Sektion Modul 04 + ARCHITEKTUR.md §7 + status.json + src/modules/04_match.js + index.html-Schwellen-Strings nachgezogen; Test-Schwellen in Karte 04 und Panel 04 von 0.70/0.40 auf 0.92/0.90 angehoben (frischer-Kopf-Korrektur „Fern" 0.85 → 0.90 wegen Messwert 0.8967); Risiken-Block „Schwellwert-Tuning" zum Beleg-Block mit Messwert-Tabelle umgebaut; Sichttest-Zeilen in Karten 01/02/03/04 mit Datum 2026-05-14 + kurzem Befund aufgerundet; KEINE Modul-Status-Hochstufung, Pie nicht regeneriert · NÄCHSTES: Spec-Sitzung Modul 05 Anastomose (alle vier Vorbedingungen sichtgeprüfter Stub) oder Modul 07 Apoptose; parallel: Modul 00 oder 09.
- 2026-05-14 · Spec-Sitzung 05 · Karte 05 (Anastomose) gefüllt mit Fünf-Funktionen-API (`init/handshake/receiveHandshake/listSiblings/forgetSibling`), bidirektionaler Eintragung in `sbkim_siblings` nur bei beidseitigem Match, anonymisiertem `sbkim_anastomosis_log`, Reentry-Idempotenz (since eingefroren, `re-handshake`-Log) und kanonischer Ed25519-Signatur über Request und Response; A1–B3-Synthese fortgeschrieben (Modul 05 sitzt an Hop B3/A3 als Entscheidungs- und Verbindungs-Stelle); Match-Schwelle strikt über `SbkimMatch.isAboveProviderThreshold` (kein literales 0.80); Service-Worker-Vertrag für statisch gehostete Endknoten (POST `/sbkim/anastomosis`, JSON, ≤ 64 KiB, 405/415/413/503; Variante Page-Hosted vs. SW-Hosted offen für Bau-Sitzung); INTERFACES.md Modul 05 auf `entwurf` und §2 „Anfrage (Query)" mit HandshakeRequest (5 Pflicht + 2 optional) und HandshakeResponse (8 Pflicht + 2 optional) plus Verifikations-Pfad in sieben Schritten verbindlich ausgefüllt; status.json 05 auf `spec`, Pie regeneriert (Schablone 8→7, Spec fertig 0→1); offene Folge-Frage: `domainVector` in der Spore optional → kritisch für 05, Aufhänger für Spec-Sitzung Modul 09 · NÄCHSTES: Bau-Sitzung Modul 05 Anastomose; parallel Spec-Sitzung Modul 07 Apoptose oder Modul 00 / Modul 09.
- 2026-05-14 · Bau-Sitzung 05 · `src/modules/05_anastomose.js` als IIFE mit `window.SbkimAnastomose`, fünf öffentliche Funktionen (`init/handshake/receiveHandshake/listSiblings/forgetSibling`), sechs benannte Error-Klassen (`AnastomoseDependenciesError`, `InvalidPeerSporeError`, `ProtocolVersionMismatchError`, `HandshakeTimeoutError`, `HandshakeNetworkError`, `HandshakeSignatureInvalidError`); kanonischer Sign/Verify-Pfad bewusst aus Modul 02 dupliziert (Single-File-PWA-Stil); privateKey über `SbkimStorage.get("sbkim_keys","main")` re-importiert (kein Singleton-Bruch, kein Eingriff in Modul 02); Match strikt über `SbkimMatch.isAboveProviderThreshold` (kein literales 0.80); Persistenz strikt über `SbkimStorage`; Log-Sub-Counter `+N` an ISO-Timestamp gegen ms-Kollision beim Re-Handshake; **Service-Worker-Variante A (Page-Hosted via MessageChannel)** in `src/sbkim-sw.js` gewählt (Modul 03 schwer im SW-Scope, ein Code-Pfad in der Page, „503 wenn Tab zu" deckt sich mit Spec); Brücken-Listener in Modul 05's `init()` registriert; Panel 05 in `tests/manual_check.html` von „noch nicht gebaut" auf „Code-Stub" mit Setup-Knopf (einmalig Embedding + Main/Alt-Knoten, Alt als In-Memory-Pseudo-Knoten ohne IndexedDB) + sieben Test-Punkten (passendes Match · Domain-Mismatch · Versions-Mismatch · Signatur-Manipulation · Re-Handshake · forgetSibling · listSiblings) + Selbstcheck-Hinweis; inoffizielle Test-Brücken `_invokeDirect / _buildSignedRequest / _verifyResponseSignature / _setOwnDomainVector` exportiert; `node --check` für 05_anastomose.js und sbkim-sw.js grün; Karte 05 Hero-Badge auf 🟦 Code-Stub, Bauzustand-Tabelle um *Code geschrieben* + *Sichttest ungeprüft (Sitzung headless)* ergänzt, § „Service-Worker-Hinweis" mit Variante-A-Entscheidung und vier Begründungen fortgeschrieben; status.json 05 auf `stub`, Pie regeneriert (Spec fertig 1→0, Code-Stub 4→5) · NÄCHSTES: Klaus klickt Panel 05 im Browser durch; Spec-Sitzung Modul 07 Apoptose oder Modul 09 Einbau-PWA (mit domainVector-Pflicht-Frage); parallel Modul 00.
- 2026-05-14 · Spec-Sitzung 09 · Karte 09 (Einbau-PWA) vollständig gefüllt mit Acht-Schritt-Andock-Pfad (Dateien kopieren · `<script>`-Tags · SW registrieren · `SbkimAnastomose.init()` · `domainVector` via `embedPassage` · `generateOwnSpore` mit `domainVector` · Spore als `sbkim/spore.json` deployen · ersten Handshake auslösen) mit konkreten Konsolen-Befehlen für nicht-programmierenden Andocker; Datei-Pfad-Konvention verbindlich (SW `sbkim-sw.js` im Endknoten-Repo-Root, fünf JS-Module inline in `index.html` oder unter `<endknoten>/sbkim/`); Spore-Endpunkt verbindlich `/sbkim/spore.json` (Alias aus §3 INTERFACES) wegen Jekyll-Dot-Ordner-Falle bei GitHub-Pages-Project-Sites; Service-Worker-Registrierungs-Konvention `navigator.serviceWorker.register("sbkim-sw.js")` aus Repo-Root mit automatischem Scope `/<repo>/` und ausdrücklich dokumentierter Scope-Falle bei Ablage unter `<endknoten>/sbkim/sbkim-sw.js`; Sichtkontrolle (3 Pflicht-Punkte: Konsolen-Selbstchecks · sechs IndexedDB-Stores · live-Spore-URL); Risiken-Block (CORS bei cross-Betreiber · Scope-Falle · 30 MB Embedding-Modell · Spore-Drift bei Domänen-Wandel · `domainVector`-Live-Update braucht Re-Deploy · Lücke-Befund: keine fehlende Helfer-Funktion in 01–05 · `forgetSibling` manuell bis Modul 07 da ist); **`domainVector`-Pflicht-Frage aus Spec-Sitzung 05 verbindlich entschieden: Variante A (Soft-Pflicht im Andock-Workflow, kein Hauptversions-Sprung)** — `domainVector` bleibt in §2 OPTIONAL, Karte 09 macht ihn Andock-Pflicht; Modul 02 und §0 `PROTOCOL_VERSION: "0.1"` unverändert; Begründungs-Kern: Klaus' Netz klein (3 Nutzer, 2 Endknoten desselben Betreibers), Karte 09 ist die *eine* Stelle die der Andocker liest, Variante B würde provisorische Spores aus Karte 10 Live-Generator inkompatibel machen, Folge-Pflege-Sitzung bleibt für späteres Netz-Wachstum anbietbar; INTERFACES.md §1 Modul 09 auf `entwurf` mit voller Vertrag-Sektion (Datei-/Endpunkt-/SW-Konventionen + Pflicht-Entscheidung), §6 Änderungsprotokoll-Zeile am Ende; status.json 09 auf `spec` mit `siegel:"Spec fertig"`, Pie regeneriert (Schablone 7→6, Spec fertig 0→1); PULS-Offene-Querschnitts-Frage „Speicherort der Spore" als gelöst markiert · NÄCHSTES: Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-Versuch (Rezeptbuch + Mixarium); davor Sichttest Karte 05 (Panel 05 acht Knöpfe); parallel Spec-Sitzung Modul 07 Apoptose oder Modul 00 Doku-Fenster.
- 2026-05-14 · Spec-Sitzung 07 · Karte 07 (Apoptose) vollständig gefüllt (Stil 02/04/05/09): zweite Komposition nach Modul 05, drei Funktions-Stränge (Self-Apoptose · Fremd-Vermächtnis empfangen · TTL-Vergessen); Sechs-Funktionen-API (`init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings`) mit **zweistufiger Self-Apoptose** (Pflicht (d) entschieden: Token gültig 60 s via `APOPTOSE_TOKEN_TTL_MS`, plus `console.warn` beim `prepare`-Aufruf, Schutz gegen versehentlichen einzelnen API-Aufruf, weil Operation irreversibel ist); `receiveLegacy` wirft NIEMALS (Outcome statt Throw, analog `verifyForeignSpore`/`receiveHandshake`); Quorum / Misstrauensvoten aus 2026-05-10-Schablone gestrichen (gehören in Modul 10 Reputation); Modul 07 ruft `SbkimAnastomose.handshake` NICHT auf — eigener HTTP-POST gegen `/sbkim/legacy`; Cleanup-Reihenfolge sequenziell (siblings → log → inbox → spore → keys, Identität zuletzt, `sbkim_doku_meta` bleibt); **Frage 1 entschieden Variante A** (`SIBLING_MAX_AGE_MS = 2592000000` = 30 Tage **global in §0 INTERFACES.md**, additiv, kein Hauptversions-Sprung; Konsistenz mit `PROVIDER_MIN_MATCH`/`QUERY_TIMEOUT_MS`/`PROTOCOL_VERSION`; Querschnitts-Anschluss für 06/11; `status.json.config` mitgezogen); **Frage 2 entschieden Variante (c)** (TTL-Trigger **explizit durch den Andocker**, kein `setInterval`, kein Selbst-Sweep im `init()`, keine Pulsation; Empfehlung nach jedem Handshake oder auf Modul-00-Doku-Fenster-Knopf; Folge-Pflege-Sitzung „Karte 09 Schritt 9: TTL-Sweep-Aufruf" als offen vermerkt); **Frage 3 entschieden** (alle Geschwister parallel via `Promise.allSettled` mit `AbortController(QUERY_TIMEOUT_MS)` pro Empfänger, Trennung `recipientsNotified` / `recipientsFailed`); INTERFACES.md §0 um `SIBLING_MAX_AGE_MS` ergänzt, §1 Modul 07 auf `entwurf` mit voller Vertrag-Sektion (Storage-Rollen Schreiber/Leser/Löscher sauber getrennt, 12 Fehler-Lagen, Garantien für 06/10/11), §2 „Vermächtnis (Legacy)" verbindlich mit LegacyMessage (7 Pflicht) und LegacyResponse (8 Pflicht + `reason` optional) gefüllt, kanonische Ed25519-Signatur identisch zu Spore/HandshakeRequest, Verifikations-Pfad in sieben Schritten, §6 Änderungsprotokoll-Zeile; `sbkim_legacy_inbox`-Wert `{fromNodeId, reason, signature, receivedAt}` (senderSpore wird nicht im Storage aufbewahrt, hält Store schlank); status.json 07 auf `spec` mit `siegel:"Spec fertig"`, Pie regeneriert (Schablone 6→5, Spec fertig 1→2); Risiken-Block 7 Punkte (Irreversibilität · Spam → Modul 11 · TTL-Drift · Signatur-Stabilität · inkonsistenter Cleanup · Versand-Latenz · Lücke-Befund: keine fehlende Helfer-Funktion in 01–05) · NÄCHSTES: Bau-Sitzung Modul 07 Apoptose (Code + Panel 07 + Service-Worker um `/sbkim/legacy` erweitern); parallel Bau-Sitzung Modul 09 (mit Klaus am Browser) oder Spec-Sitzung Modul 00 Doku-Fenster (natürliche Anker-Stelle für Vermächtnis-Inbox-Anzeige und TTL-Sweep-Knopf).
- 2026-05-14 · Bau-Sitzung 07 · `src/modules/07_apoptose.js` als IIFE mit `window.SbkimApoptose`, sechs öffentliche Funktionen (`init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings`), fünf benannte Error-Klassen (`ApoptoseDependenciesError`, `InvalidApoptoseTokenError`, `ApoptoseAlreadyExecutedError`, `InvalidTtlError`, plus `LegacyTimeoutError`/`LegacyNetworkError` für einzelne Versand-Versuche — landen in `recipientsFailed`, werden nicht nach außen geworfen, `NoIdentityError` aus Modul 02 unverändert durchgereicht); **Frage 1 entschieden Variante (a)** — kanonischer Sign/Verify-Pfad (`canonicalize`/`base64url`/`signEnvelope`/`verifyEnvelope`) **bewusst aus Modul 02 + 05 dritter Pfad dupliziert**, kein Eingriff in 02/05 (Single-File-PWA-Stil, keine Verkopplung — gleiche Linie wie Bau-Sitzung 05); **Frage 2 entschieden** — Test-Brücken-Surface `_invokeReceiveLegacyDirect`/`_buildSignedLegacyMessage`/`_addPseudoSibling`/`_clearPseudoSiblings`/`_advanceTokenClock` (für Token-Ablauf-Test ohne 61 s Wartezeit) plus `_canonicalize`/`_base64urlEncode`/`_base64urlDecode`/`_signEnvelope`/`_verifyEnvelope`; **Frage 3 entschieden Variante (a)** — **ein gemeinsamer `fetch`-Listener** in `src/sbkim-sw.js` für `/sbkim/anastomosis` und `/sbkim/legacy` (`isPathSuffix`-Helfer, `handleBridge(request, originatingClientId, messageType)` mit Message-Typ `SBKIM_ANASTOMOSIS_REQUEST` bzw. `SBKIM_LEGACY_REQUEST`, leichter erweiterbar für Modul 06/11); Self-Apoptose-Token im Modul-Closure (16 Bytes via `crypto.getRandomValues`, base64url ohne Padding, 60 s TTL, `console.warn` beim `prepare`-Aufruf — Token überlebt Browser-Refresh nicht); Cleanup-Reihenfolge sequenziell verbindlich (siblings → log → inbox → spore → keys, Identität zuletzt, `sbkim_doku_meta` bleibt); `receiveLegacy` wirft niemals — Form-/Spore-/Versions-/Signatur-/Storage-Fehler werden als `outcome:"rejected"` zurückgegeben (Storage-Fehler beim `put`/`del` zusätzlich in `console.error` für Debugging); `forgetExpiredSiblings(maxAgeMs)` mit Pflicht-Parameter, `InvalidTtlError` bei `≤ 0` oder fehlend, `lastActivity = max(log.ts mit outcome ∈ {"established","re-handshake"} und peerId == sibling.nodeId)`, Fallback `sibling.since`; Panel 07 in `tests/manual_check.html` von „noch nicht gebaut" auf 🟦 Code-Stub mit zehn Knöpfen (Setup + 8 Test-Punkten aus Karte 07 § Manueller Test + Selbstcheck-Hinweis); Test 6 (Self-Apoptose) prüft lokalen Cleanup — Pseudo-Endpunkte führen ins Leere, beide Empfänger landen in `recipientsFailed`, alle SBKIM-Stores leer, `getNodeId` wirft `NoIdentityError` (Test-Pragmatismus wie Modul 05, voller bidirektionaler Pfad gehört in Modul 09); `node --check` für `07_apoptose.js` und `sbkim-sw.js` grün; alle Inline-`<script>`-Blöcke in `manual_check.html` syntaktisch validiert; Karte 07 Hero-Badge auf 🟦 Code-Stub, Bauzustand-Tabelle um *Code geschrieben* (ausführliche Anmerkung) + *Sichttest ungeprüft (Sitzung headless)* ergänzt; status.json 07 auf `stub` mit `siegel:"Code-Stub"`, Pie regeneriert (Spec fertig 2→1, Code-Stub 5→6) · NÄCHSTES: Sichttests Karte 05 + Karte 07 durch Klaus im Browser; danach Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-Versuch (Module 05 und 07 sind beide Code-Stub und können mit-andocken); parallel anbietbar Spec-Sitzung Modul 00 Doku-Fenster.
