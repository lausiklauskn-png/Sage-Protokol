# Werkzeug-Katalog — was sich aus den SBKIM-Modulen bauen lässt

> **Zweck:** Übersicht aller Werkzeuge, die wir aus den vorhandenen Modulen als
> **eigenständige Ein-Datei-PWA**, als **Einbau-Tool** (Drop-in in fremde Apps)
> oder als **beides** anbieten können — sortiert nach „lohnt sich zuerst"
> (Nutzen × Umsetzbarkeit). Stand 2026-06-20.
>
> **Form-Legende:** `PWA` = eigenständige Ein-Datei-Anwendung · `Einbau` =
> Modul/Snippet zum Einbinden in eine fremde App · `beides` = sinnvoll als PWA
> UND als Einbau-Tool.
>
> **Außen-Nutzen** = nützlich **ohne** SBKIM-Bezug (eigenständiger Markt-Wert,
> „Pilz-Schicht"-Köder). **Aufwand** = grob; „Kern da" = Modul existiert schon.

## Schon gebaut (in der Truhe)

| Werkzeug | Module | Form | Nutzen | Stand |
|---|---|---|---|---|
| **Andock-Werkzeug** | 02/03/16 | PWA | Identität + signierte Spore + Siegel + Briefkasten im Browser erzeugen | ✅ `tools/andock.html` |
| **Mycel-Knoten** | 01–17 | PWA | kompletter Knoten mit Live-Lampen, zum Anschauen + Andocken | ✅ `tools/mycelknoten.html` |
| **Andock-Wizard** | 19 | Einbau | Repo+Domain+Typ → Spore-Vorlage + status.json-Zeile + PR-Link | ✅ `src/modules/19_andock_wizard.js` |
| **Netz-Wächter & Briefkasten** | — | beides | Peer-`SIGNAL.json` live lesen, Ungelesenes melden (server-los) | ✅ NETZ |

## Baubar — nach „lohnt sich zuerst" sortiert

| # | Werkzeug | Module | Form | Vorteil + wo andere es einbauen (Beispiel) | Außen-Nutzen | Aufwand |
|---|---|---|---|---|---|---|
| 1 | **PWA-Security-Monitor** (Fremdzugriff-/Angriff-Detektor) | 15 + 17 | beides | Live sehen, **wer die eigene Web-App anfasst**: fremde `postMessage`-Quellen, Fetch-Proben auf eigene Endpunkte, **KI-Browser-Agenten** (Operator/Gemini). *Einbau:* jede PWA klemmt das Widget rein und sieht Angriffe in Echtzeit. *Beispiel:* SaaS-PWA erkennt ein heimlich funkendes Drittanbieter-iframe. | **hoch** (heute akut) | mittel (Kern gebaut, SBKIM-Spezifika rausnehmen) |
| 2 | **Lokaler Semantik-Rechner** (Embedding + Cosinus + Cluster) | 03 + 04 | beides | Text → Vektor, zwei Texte → Ähnlichkeit, Liste → Cluster — **alles lokal, keine Cloud**. *Einbau:* eine Notiz-/Such-App bekommt private semantische Suche. *Beispiel:* 50 Support-Tickets lokal gruppieren; Lehrer vergleicht Antworten mit Musterlösung. (Löst zugleich BLPs Vektor-Frage.) | **hoch** | mittel (Module da, Modell-Download ~einmalig) |
| 3 | **Ed25519-Signatur-Prüfer** (aus Spore-Verifizierer) | 02 | beides | „Ist dieses JSON **echt & unverändert**?" — kanonische Bytes + Ed25519, ohne Server. *Einbau:* App prüft ein signiertes Konfig-/Manifest-File offline. *Beispiel:* Team verteilt signiertes Release-Manifest; jeder verifiziert im Browser. | mittel–hoch | **klein** (`verifyForeignSpore` da, keine Identität nötig) |
| 4 | **Verschlüsselungs-Tresor** (lokaler Safe + Shamir-Recovery) | 20 + 02 | beides | Geheimnisse/Schlüssel **lokal verschlüsselt** (AES-GCM-256 + PBKDF2) mit **2-von-3-Shamir-Wiederherstellung**. *Einbau:* App bekommt einen Secret-Speicher ohne Cloud. *Beispiel:* Freelancer verwahrt Kunden-API-Keys; Seed-Phrase auf 3 USB-Sticks (2 genügen). | hoch | mittel (Modul 20 da, generisch fassen) |
| 5 | **Identitäts-Backup & Recovery** | 02 + 20 | Einbau | Verschlüsselter Export/Import des lokalen App-Zustands + Shamir-Aufteilung. *Beispiel:* PWA bietet „Backup-Datei + Wiederherstellungs-Anteile". | mittel | klein–mittel (Teilmenge von #4) |
| 6 | **Verstecktes Debug-/Status-Fenster** (5-Klick) | 00 | Einbau | Drop-in „Geheim-Diagnose": 5× auf ein Logo tippen → Speicher/Quota/Version. *Beispiel:* Entwickler baut ein verstecktes Diagnosefeld in seine PWA. | mittel (Devs) | **klein** (Modul 00 da) |
| 7 | **IndexedDB-Speicher-Wrapper** | 01 | Einbau | Schlanker, getesteter IndexedDB-Helfer (Stores, Round-Trip, Versionierung). *Beispiel:* kleine App will lokal speichern ohne dicke Bibliothek. | mittel (Devs) | **klein** (Modul 01 da, generisch fassen) |
| 8 | **Self-Destruct / Daten-TTL mit signiertem Vermächtnis** | 07 | Einbau | „Recht auf Vergessen": Daten zeitgesteuert/zweistufig löschen, optional signiertes Abschluss-Dokument. *Beispiel:* Messenger-PWA mit Ablauf-Nachrichten. | niedrig–mittel | klein |
| 9 | **Cross-Tab/Cross-App-Handshake** (signiert) | 05 + 02 | Einbau | Zwei lokale Apps/Tabs erkennen + verifizieren sich gegenseitig (signiert, server-los). *Beispiel:* zwei PWAs desselben Anbieters tauschen sicher im selben Browser. | niedrig–mittel | mittel |
| 10 | **SBKIM-Siegel-Generator** | 16 | beides | Self-inscribing Auszeichnungs-Badge (SVG/PNG). *Beispiel:* Knoten erzeugt sein Vertrauens-Siegel. | niedrig (SBKIM-Bedeutung) | klein (Kern in andock.html) |
| 11 | **Geschwister-Datenaustausch** (Opt-in, beidseitig) | 06 + 08 | Einbau | Konsens-basierter Pull von Daten zwischen befreundeten Knoten. | niedrig (SBKIM-nah) | mittel |
| 12 | **Tool-/Andock-Container** (Wartungs-Suite) | 18 | Einbau | Andock + Backup + Re-Embedding + Discovery als Modal-Suite. | niedrig (SBKIM-nah) | mittel (Sub a da, b–i offen) |

## Lesart / Empfehlung

- **Zuerst bauen (größter Hebel × machbar):** #1 Security-Monitor, #2 Semantik-Rechner,
  #3 Signatur-Prüfer (klein!), #4 Tresor.
- **„Außen"-Köder (Pilz-Schicht, Akquise):** #1, #2, #4 — lösen ein *heute akutes*
  Problem (KI-Agenten / private NLP / Schlüssel ohne Cloud) und ziehen Nutzer an, die
  dann das Mycel entdecken. Akquise gehört per Vier-Schichten-Lesart in die Pilz-Schicht,
  nicht ins Mycel.
- **Form-Faustregel:** Was ein Endnutzer *direkt benutzt* → **PWA**. Was ein Entwickler
  in seine App *einbaut* → **Einbau-Tool**. Die Top-4 lohnen sich als **beides**
  (PWA zum Ausprobieren + Einbau-Modul zum Übernehmen).
- **Regeln für jedes neue Werkzeug:** generisch (kein Forker-Branding), Siegel-Band leer,
  Krypto byte-kompatibel, Headless-Smoke, Download-Knopf — wie Andock-Werkzeug / Mycel-Knoten.

> Reihenfolge ist ein Vorschlag, keine Tafel — Klaus entscheidet, welches zuerst gebaut wird.

## Sofort baubar als Upload-Werkzeug (Code existiert schon)

> „Upload-Werkzeug" = **Ein-Datei-PWA**, die der Nutzer aus der Truhe herunterlädt
> und auf den **eigenen** Host hochlädt/deployt (wie `andock.html`) — und/oder ein
> **Einbau-Snippet** zum Kopieren in die eigene App. Hier nur Werkzeuge, deren Logik
> **bereits gebaut + getestet** ist; der Rest-Aufwand ist nur **Verpacken** (generisch
> fassen, Siegel-Band leer, Smoke, Download-Knopf).
>
> **Tresor-Klärung 2026-06-20:** Klaus ist Betreiber + Besitzer **beider** Tresore
> (Mein-Tresor + Jasons-Tresor). Damit ist die echte Verschlüsselungs-Dynamik frei
> verwendbar — kein Einwilligungs-Vorbehalt; der Tresor-Bau kann die vorhandene
> AES-/Shamir-Mechanik direkt übernehmen.

| # | Werkzeug | Module (vorhanden) | Upload-Form | Was der Nutzer damit macht | Sofort-Aufwand |
|---|---|---|---|---|---|
| 1 | **PWA-Security-Monitor** | 15 + 17 | PWA + Einbau-Snippet | eigene App auf Fremdzugriff/Angriff überwachen (postMessage, Fetch-Proben, KI-Agenten) | Verpacken + Origin-Allowlist generisch |
| 2 | **Semantik-Rechner** | 03 + 04 | PWA + Einbau-Snippet | Text→Vektor, Ähnlichkeit, Cluster — lokal, ohne Cloud | Verpacken (Modell-Download ~einmalig) |
| 3 | **Signatur-/Spore-Prüfer** | 02 | PWA + Einbau-Snippet | signiertes JSON / fremde Spore offline auf Echtheit prüfen | Verpacken (kleinster Aufwand) |
| 4 | **Verschlüsselungs-Tresor** | 20 + 02 (+ Tresor-Dynamik) | PWA + Einbau-Snippet | Geheimnisse/Schlüssel lokal verschlüsseln, 2-von-3-Shamir-Recovery | Verpacken + generisch fassen |
| 5 | **Identitäts-/Daten-Backup** | 02 + 20 | PWA + Einbau-Snippet | verschlüsselten Backup-Blob + Wiederherstellungs-Anteile erzeugen/einlesen | Verpacken |
| 6 | **Siegel-Generator** | 16 | PWA | eigenes Auszeichnungs-Siegel (SVG/PNG) erzeugen | Verpacken (Kern in andock.html) |
| 7 | **Verstecktes Debug-/Status-Fenster** | 00 | Einbau-Snippet | 5-Klick-Diagnose (Speicher/Quota/Version) in die eigene PWA | Verpacken |
| 8 | **IndexedDB-Speicher-Wrapper** | 01 | Einbau-Snippet | schlanker getesteter lokaler Speicher in der eigenen App | Verpacken |

**Faustregel Upload-Form:** Endnutzer lädt herunter + deployt → **Ein-Datei-PWA**;
Entwickler kopiert in seine App → **Einbau-Snippet**. #1–#5 lohnen sich als **beides**.
Alle acht sind „jetzt schon" machbar, weil die Modul-Logik existiert — es entsteht
**keine neue Kern-Logik**, nur eine generische Single-File-Verpackung mit Smoke + Download.
