# Sage-Protokol / SBKIM: Nutzen, Automatisierung und Integration

> **Status:** Begleit-Dokument zum technischen Paper (`sbkim_paper.pdf`).
>
> **Zielgruppe:** Betreiber kleiner Web-Anwendungen (PWAs), Entwickler
> kleiner Automatisierungs-Werkzeuge, an Datensouveränität interessierte
> Nutzer, Vereine und kleine Unternehmen ohne eigene IT-Abteilung.
>
> **Autor:** Klaus (Sage-Protokol-Betreiber, Mai 2026), mit Bau-Hilfe
> der Claude-Sitzungen.
>
> **Sprache:** Deutsch.

---

## Zusammenfassung (Abstract)

Das **SBKIM-Protokoll** (Semantisch-Empfangendes Bidirektionales
KI-Matching) und seine Referenz-Implementierung **Sage-Protokol**
beschreiben einen dezentralen Ansatz, mit dem kleine Web-Anwendungen
(typischerweise PWAs) einander **semantisch finden, signiert
verbinden und kontrolliert Daten austauschen** können, ohne
zentralen Server, ohne Cloud-Auth-Dienst, ohne kontinuierlichen
Crawler-Verkehr.

Der Kerngedanke ist nicht neu: die Bausteine (Public-Key-Identität,
JSON-basierte Selbstbeschreibung, Embedding-basiertes
Semantik-Matching, Pull-Pattern, Service-Discovery über bekannte
Pfade) existieren einzeln seit Jahren. **Neu** ist ihre
Kombination in einem zusammenhängenden, sehr kleinen Protokoll, das
in eine Single-File-PWA passt und ohne Backend lauffähig ist.

Dieses Begleit-Paper fasst zusammen:

1. **welchen praktischen Nutzen** das Protokoll für Betreiber
   einzelner Apps und für die Allgemeinheit hat,
2. **welche Automatisierungs-Prozesse** zwischen Apps damit möglich
   werden, die heute manuelle Plugin- oder Adapter-Arbeit erfordern,
3. **welche Integrations-Modelle** ein nachhaltiges, kleinteiliges
   Geschäftsmodell tragen könnten, insbesondere ein Obolus-Modell
   für leichte Integrations-Werkzeuge.

Das Paper erhebt keinen Anspruch auf wissenschaftliche Neuheit. Es
dokumentiert den **konkreten, praktischen Wert** eines bestehenden
Designs und schlägt Brücken zwischen der Forschung an föderierten
Systemen (ActivityPub, Solid, Matrix) und dem Alltag eines
Endknoten-Betreibers ohne Programmierkenntnisse.

---

## 1. Einleitung

### 1.1 Motivation

Wer heute eine eigene kleine Web-Anwendung baut, sei es ein
digitales Rezeptbuch, eine Cocktail-Sammlung, ein Vereinsregister,
ein Reisetagebuch, steht vor einer wiederkehrenden Wahl:

- **A) Allein bleiben.** Die App läuft isoliert. Sie kann nichts mit
  anderen Apps teilen, weiß nichts über sie, kann sie nicht
  ergänzen.
- **B) An eine zentrale Plattform anschließen.** Die App nutzt
  fremde APIs (Google, Meta, OpenAI), zahlt für jede Anfrage,
  liefert Nutzungsdaten an den Anbieter, verliert die Kontrolle über
  die eigenen Daten.
- **C) Selbst eine Plattform aufbauen.** Die App betreibt eigene
  Auth-Server, eigene APIs, eigene Datenbank. Aufwand, der
  Einzelpersonen oder Kleingruppen überfordert.

Es fehlt eine vierte Option: **mehrere kleine Apps reden direkt
miteinander, semantisch, ohne dass jemand das Verbindungs-Schaltbild
vorher gezeichnet hat.**

Sage-Protokol schlägt für diese vierte Option ein konkretes,
minimales Format vor: die **Spore** als selbstbeschreibender,
signierter Steckbrief, **Anastomose** als signierter Handshake nach
semantischem Match, **Heterokaryose** als kontrollierter Anker-
Austausch zwischen verbundenen Knoten, **Apoptose** als sauberes
Sterben mit signiertem Vermächtnis. Insgesamt zehn Module, alle in
purem JavaScript (kein Build, kein Bundler, keine npm-Abhängigkeit
im Endknoten), zusammen unter 5 000 Zeilen Code.

### 1.2 Was diese Arbeit leistet

Im Vergleich zum technischen Hauptpaper (`sbkim_paper.pdf`), das
Schnittstellen und Algorithmen formal beschreibt, fokussiert dieses
Begleit-Paper auf den **Nutzen-Aspekt**:

- Was ändert sich konkret für einen Betreiber, der zwei kleine Apps
  hat und sie verbinden möchte? (§ 4.1)
- Welche Automatisierungs-Prozesse werden möglich, die heute Plugin-
  Wildwuchs verlangen? (§ 6)
- Wie könnte ein kleinteiliges, nachhaltiges Geschäftsmodell aussehen,
  das den Betreiber ernährt, ohne dass das Protokoll selbst
  kommerziell verschlossen wird? (§ 7)

### 1.3 Was diese Arbeit nicht leistet

- **Keine neue Kryptographie.** Ed25519, PBKDF2, AES-GCM sind
  Standard-Bausteine.
- **Keine neue Embedding-Forschung.** Das Protokoll nutzt
  `Xenova/multilingual-e5-small` als Standard-Modell (384
  Dimensionen, L2-normalisiert). Das ist Bestandsforschung.
- **Keine formale Sicherheits-Analyse.** Das Protokoll ist defensiv
  gebaut (Sybil-Schutz via Singleton-Identität, Replay-Marker als
  Nonce, kanonische Signatur), aber eine peer-reviewte
  Sicherheits-Begutachtung steht aus.
- **Keine Skalierungs-Versprechen.** Das Protokoll ist für
  *kleine* Netze (Größenordnung 10–1 000 Knoten) konzipiert. Für
  globale Skalierung gibt es bessere Werkzeuge.

---

## 2. Stand der Technik

### 2.1 Zentrale Cloud-APIs

Klassische REST-/GraphQL-APIs lösen das Problem „Client ruft Server
an" sehr gut. Ihr Modell ist asymmetrisch: ein Anbieter, viele
Konsumenten. Die Identität liegt beim Anbieter (OAuth-Tokens), die
Daten liegen beim Anbieter, die Kosten skalieren mit dem Traffic.
Für ein kleines App-zu-App-Mycel sind sie überdimensioniert.

### 2.2 Föderierte Protokolle

**ActivityPub** (W3C-Standard, Mastodon, Fediverse) löst das
Föderations-Problem zwischen sozialen Servern. Es ist mächtig, aber
syntaktisch. Der Match-Filter ist „folgst du jemandem".
Semantisches Matching auf Inhalts-Ebene gibt es nicht.

**Solid** (Tim Berners-Lee) trennt Daten-Speicher (Pods) von
Anwendungen. Die Architektur ist konsequent, aber komplex: eigene
Identity-Provider, eigenes Berechtigungs-Modell, schwer zugänglich
für Einzelpersonen ohne Server.

**Matrix** löst Föderation für Messaging mit starker Kryptographie.
Wieder: server-zentrisch, nicht für statisch gehostete PWAs gedacht.

### 2.3 Service-Discovery

**mDNS / Bonjour / DNS-SD** lösen lokale Service-Discovery
(„welche Drucker sind im Netz?"). Sie sind syntaktisch (Service-Typ
+ Port). Keine Semantik, keine signierte Identität, keine
Anwendungsdaten-Verständigung.

### 2.4 Vector-Embedding-Suche

Embedding-basierte Vektorsuche (FAISS, Annoy, Vespa) löst
semantische Ähnlichkeit über große Korpora, aber innerhalb eines
einzelnen Systems. Cross-System-Match ist nicht vorgesehen.

### 2.5 Lücke

Es fehlt ein Protokoll, das **alle drei Ebenen** kombiniert:
- **signierte Identität** (wie Solid / Matrix),
- **semantisches Matching** (wie Vector-Search),
- **leichtgewichtige Discovery** (wie mDNS / `.well-known`-Pfade),

und das gleichzeitig **klein genug** ist, um in eine Single-File-PWA
zu passen. Sage-Protokol schließt diese Lücke.

---

## 3. Architektur in Kurzform

Das Detail-Paper (`sbkim_paper.pdf`) und die Komponenten-Karten
(`docs/components/*`) beschreiben die zehn Module formal. Hier nur
die vier Kern-Operationen im Mycel-Bild:

| Operation | Modul | Bedeutung im Pilz-Bild |
|---|---|---|
| **Spore werfen** | 02 (Spore) | Signierte Visitenkarte des Knotens. Liegt unter `/sbkim/spore.json`. Enthält Identität, Domäne, Endpunkt, optional einen 384-Dimensions-Vektor. |
| **Match prüfen** | 04 (Match) | Cosinus-Ähnlichkeit zweier Domain-Vektoren. Bei ≥ 0,80: „passende Erde", Knoten klopft an. Sonst: vergessen. |
| **Anastomose** | 05 (Anastomose) | Signierter beidseitiger Handshake. Beide Seiten schreiben den anderen in ihre Geschwister-Liste. Verbindung wird Wirklichkeit. |
| **Heterokaryose** | 06 (Heterokaryose) | Verbundene Knoten teilen Vektor-Anker (mit beidseitigem Opt-In). Spätere Matches werden feinkörniger. |

Plus drei Pflege-Operationen (Apoptose / Vermächtnis / TTL-Sweep)
und drei reaktive Schutz-Module (Reputation, Rate-Limit, Blocklist),
die erst bei Netz-Wachstum aktiviert werden.

### 3.1 Empfangsmodus mit Antwortrecht

Eine Design-Entscheidung, die SBKIM von den meisten anderen
Protokollen abhebt: **kein Knoten initiiert eine Anfrage ins offene
Netz**. Ein Knoten antwortet, wenn er gefragt wird (per
Service-Worker-Endpunkt); er pollt nicht, er crawlt nicht, er pulst
nicht. Das hat drei Konsequenzen:

1. **Datenschutz nach Design.** Ein Knoten erzeugt keinen
   ausgehenden Traffic, den der Betreiber nicht ausdrücklich
   ausgelöst hat.
2. **Geringer Ressourcenverbrauch.** Statisches Hosting reicht
   (GitHub Pages, Netlify, ein simples nginx). Kein Cron, kein
   Hintergrund-Worker, keine Datenbank.
3. **Kontrolliertes Wachstum.** Spore-Diffusion läuft konsensuell
   (Modul 14, Backlog): Empfehlung über bestehende Geschwister,
   nicht über Crawling.

---

## 4. Anwendungsfälle

### 4.1 Föderierte Suche zwischen einzelnen Apps

**Heute (ohne SBKIM):** Klaus hat ein digitales Rezeptbuch und eine
Cocktail-Sammlung als zwei voneinander getrennte PWAs. Er tippt im
Rezeptbuch „was passt zu Steak". Die App findet das Steak-Rezept,
und das war's. Die Wein-Empfehlung in der Cocktail-Sammlung kennt
sie nicht; um sie zu sehen, muss er die App wechseln.

**Mit SBKIM:** Beide Apps haben Sporen, sind nach Anastomose
verbunden. Die Suchanfrage wird semantisch eingebettet (384-Dim-
Vektor), das Rezeptbuch prüft seine eigene Datenbank UND fragt
parallel das Mixarium-Geschwister (signierter Pull über
`/sbkim/heterokaryosis`). Das Mixarium antwortet mit Spore-signiertem
Vorschlag „Malbec". Das Rezeptbuch rendert beide Ergebnisse in einer
einzigen Liste, jedes mit Herkunfts-Kennzeichnung.

**Nutzen für den Anwender:** Eine Suche, mehrere spezialisierte
Quellen, keine Cloud, kein Login. Die Apps werden zusammen klüger
als jede einzelne.

### 4.2 Geteiltes Wissen unter Freunden ohne Cloud

**Heute:** Wenn Klaus seine Rezepte mit Freundin Anna teilen will,
schickt er eine ZIP-Datei per E-Mail oder lädt sie zu einem
Cloud-Anbieter hoch.

**Mit SBKIM:** Anna baut sich ihr eigenes Rezeptbuch als PWA mit
SBKIM-Andock (Modul 09). Beim ersten Aufruf erzeugt sie eine eigene
Identität (eigene `nodeId`), wirft ihre Spore unter ihrer URL ab.
Klaus' Rezeptbuch kennt Annas Spore (über Andock-Bundle oder Modul
14 Diffusion). Match passt (beide kochen). Anastomose verbindet
beide Knoten. Ab jetzt: Klaus' Suche findet seine UND Annas Rezepte.

**Datenschutz:** Anna entscheidet pro Geschwister, ob sie
Heterokaryose-Opt-In setzt (Anker-Austausch). Wenn nicht: Klaus
sieht nur ihre öffentlichen Spore-Daten plus die Antworten, die sie
auf seine Suchen explizit gibt. Niemand fingerprintet sie.

**Nutzen:** Geteiltes Wissen ohne Plattform-Lock-in, ohne dass jemand
einen Server mieten muss.

### 4.3 Kleinunternehmen und Vereine

Ein Verein für historische Eisenbahn (z.B. mit 50 Mitgliedern, drei
Lokal-Vereinen) hat heute typisch eine WordPress-Seite plus eine
Facebook-Gruppe. Die Daten sind verteilt, schwer zu pflegen,
zentralisiert.

**Mit SBKIM:** Jeder Lokal-Verein hostet eine kleine PWA mit den
eigenen Daten (Termine, Fotos, Fahrzeug-Bestand). Alle drei Sporen
sind miteinander verbunden. Eine Suchanfrage „Fahrt nach Heidelberg
Juni" findet Termine aus allen drei Vereinen, dargestellt im Tab des
Anfragenden, ohne dass irgendwo zentral indiziert wird.

**Nutzen:** Datenhoheit beim Verein, niedrige Betriebskosten
(GitHub Pages: kostenlos), keine Abhängigkeit von WordPress-Plugins
oder Facebook-Algorithmen.

### 4.4 Apps auf demselben Computer

Auch lokale Apps (Browser-Tabs, eigene Computer-Programme,
Browser-Extensions) können Sporen tragen. Eine Notiz-App und eine
Kalender-App, die beide SBKIM-fähig sind, erkennen sich semantisch.
Notiz „Geburtstag Mama 12.06." → Notiz-App erkennt Kalender-Domäne,
bietet Übertragungs-Knopf an. Ohne dass jemand einen Plugin-Adapter
geschrieben hat.

**Nutzen:** Der Computer wird ein lokales Mycel. Apps wissen
voneinander, ohne dass der Nutzer die Verbindung von Hand schließt.

---

## 5. Nutzen für die Allgemeinheit

### 5.1 Datensouveränität

Die Daten eines Knotens liegen **ausschließlich** im IndexedDB des
Betreibers (Stufe (1) der Identitäts-Persistenz: `navigator.storage.
persist()`; Stufe (2): passwort-verschlüsselter Backup-Export; Stufe
(3): Quota-Frühwarnung). Es gibt keinen zentralen Speicher, keinen
Anbieter, der den Schlüssel hält.

Das ist nicht nur „nice to have". Mit der DSGVO und vergleichbaren
Vorschriften ist Datensouveränität für Vereine, Selbstständige und
kleine Unternehmen ein **rechtlicher Vorteil**: weniger
Auftragsverarbeitungs-Verträge, weniger Cookie-Banner, weniger
Risiko bei Datenpannen.

### 5.2 Niedriger Ressourcen-Fußabdruck

Eine SBKIM-PWA läuft auf statischem Hosting (GitHub Pages, Netlify,
ein simples nginx). Pro Knoten entstehen typischerweise unter
1 MB Daten (Spore + Identität + bis zu ~100 Geschwister). Kein
Cron-Job, kein Hintergrund-Worker, kein laufender Datenbank-Prozess.

In Zeiten, in denen jedes Gerät einer aufgeblähten Cloud-Anwendung
gegenübersteht, ist **Minimalismus auch ein Umwelt-Argument**: ein
SBKIM-Mycel mit 1 000 Knoten erzeugt weniger Server-Last als eine
mittelgroße zentrale Anwendung mit 100 aktiven Nutzern.

### 5.3 Bildungs- und Lehr-Wert

Das Protokoll ist klein genug, dass eine engagierte
Lehrkraft / Hobbyist es in einem Wochenende durchliest und versteht.
Die zehn Modul-Karten sind je 200–500 Zeilen lesbares Deutsch +
JavaScript-Vertrag. Es ist ein **konkretes, lauffähiges Beispiel**
für Themen, die in der Informatik-Ausbildung sonst meist abstrakt
bleiben:

- Public-Key-Identität (Ed25519 in WebCrypto)
- Embedding-basierte Semantik (transformers.js im Browser)
- Service-Worker als HTTP-Gateway
- Promise-basierte IndexedDB-Wrapper
- Föderation ohne zentralen Server

Wer das Protokoll versteht, hat ein Mental-Modell für deutlich
größere Systeme.

### 5.4 Resilienz gegen Plattform-Wechsel

Ein Cloud-Dienst, der seine API ändert oder schließt, reißt
Hunderte abhängiger Apps mit sich. Ein SBKIM-Knoten hängt von keinem
einzelnen Anbieter ab. Der Endknoten-Betreiber kann den Hoster
wechseln (GitHub Pages → Netlify → eigene Domain → Heim-Server),
ohne dass die Geschwister-Beziehungen brechen, solange die Identität
(Ed25519-Schlüssel) erhalten bleibt. **Backup-Export** (Modul 02
ab Mai 2026) macht das praktikabel.

---

## 6. Automatisierungsprozesse

### 6.1 Klassische Plugin-Automatisierung — und ihr Problem

Heute funktioniert App-zu-App-Automatisierung typisch über:
- **Plugin-Marktplätze** (WordPress-Plugins, Zapier, IFTTT):
  zentralisiert, kommerziell, Anbieter-Lock-in.
- **API-Adapter-Code**: jede neue App-Kombination braucht einen
  manuell geschriebenen Adapter.
- **Webhooks**: gut für einfache „X passierte, melde Y"-Fälle, aber
  semantische Verknüpfung („wenn neue Notiz mit Datum → in Kalender
  übertragen") braucht weiterhin Klebe-Code.

Das Plugin-Modell hat eine kombinatorische Explosion: bei *n* Apps,
die untereinander reden sollen, braucht es im schlechtesten Fall
*n²* Adapter.

### 6.2 SBKIM als semantischer Verbindungs-Backbone

Wenn alle beteiligten Apps Sporen tragen und über Anastomose
verbunden sind, ändert sich das Bild:

- **Match-Filter ersetzt manuelle Adapter.** Eine App, die eine
  Anfrage stellen will, schickt sie an alle Geschwister, deren
  Cosinus-Match passt. Wer die Anfrage versteht (in seiner Domäne),
  antwortet. Wer nicht, ignoriert.
- **Heterokaryose-Anker liefern Feinabstimmung.** Eine
  Reise-App teilt mit der Foto-App einen Anker
  „Reise-Erinnerung". Beim nächsten Foto-Upload erkennt die
  Reise-App, dass das Foto-Tag „Argentinien 2025" semantisch passt
  zu ihrem Reise-Eintrag „Argentinien 2025".
- **Vermächtnis** (Apoptose) räumt automatisch auf, wenn eine App
  abgeschaltet wird. Kein toter Plugin-Eintrag.

Konkrete Beispiele für **automatisierbare Pfade**, die heute manuell
sind:

- **Termin-Erkennung**: Notiz-App → Kalender-App, ohne Plugin.
- **Rezept-Wein-Pairing**: Rezeptbuch → Cocktail-Sammlung, ohne
  Plugin.
- **Foto-Reise-Zuordnung**: Foto-App → Reisetagebuch, ohne Plugin.
- **Aufgaben-Eskalation**: Aufgabenliste → Kalender-App bei
  Deadline-Nähe, ohne Plugin.
- **Vereins-Termin-Föderation**: drei Vereins-Apps teilen Termine,
  ohne dass ein zentraler Kalender-Server steht.

Jeder dieser Pfade ist heute mit Zapier oder einem WordPress-Plugin
machbar, aber kostet Geld, Vendor-Bindung und Datenschutz-Risiko.
Mit SBKIM ist der Pfad **selbsterklärend**: Apps mit passenden
Sporen finden sich, der Rest ist Match-Schwelle und Opt-In.

### 6.3 Grenzen der Automatisierung

Es ist wichtig, ehrlich zu sagen, was SBKIM **nicht** automatisiert:

- **Aktionen über das Pull-Pattern hinaus.** Eine App kann nicht
  „im Namen einer anderen App" eine Drittsystem-API aufrufen
  (Stripe, PayPal, Banken). Solche Pfade brauchen weiterhin
  klassische Adapter.
- **Komplexe Workflow-Logik.** SBKIM ist ein
  Verbindungs-Protokoll, kein Workflow-Engine. Wer „wenn A und B
  und nicht C, dann tue D" braucht, kombiniert SBKIM mit Apache
  Airflow, n8n o.ä.
- **Garantien für Zustellung / Reihenfolge.** SBKIM-Pulls sind
  Best-Effort. Wer transaktionale Garantien braucht, ist mit
  Message-Queues besser bedient.

---

## 7. Integrations-Werkzeuge und mögliche Geschäftsmodelle

### 7.1 Das Protokoll selbst bleibt frei

SBKIM und Sage-Protokol sind als offen-spezifiziertes Protokoll
gedacht. Jeder kann eine eigene Implementierung bauen, jeder kann
eigene Knoten betreiben, niemand muss eine Lizenz bezahlen.

**Das ist Voraussetzung für Wachstum.** Ein kostenpflichtiges
Protokoll erreicht keine kritische Masse. Was sich monetarisieren
lässt, sind **Werkzeuge um das Protokoll herum**.

### 7.2 Modell 1 — Andock-Bundle mit Obolus

Das größte praktische Hindernis für Nicht-Programmierer ist heute
der **Andock-Prozess** (Modul 09): neun Schritte mit Code-Bearbeitung
(`sbkim-init.js`), Service-Worker-Registrierung, Spore-Deploy,
Pfad-Konfiguration. Klaus selbst hat das im Mai 2026 erstmals
durchgespielt, und es war Pionier-Tanz.

**Vision:** Ein **Andock-Bundle** (`sbkim-bundle.js`), das in einer
Single-Datei alles mitliefert: das Protokoll, einen Andock-Wizard,
die Standard-UI für Status-Anzeige. Endknoten-Betreiber kopiert eine
Datei, fügt einen `<script>`-Tag ein, fertig.

**Geschäftsmodell:** Das Bundle ist als Open-Source frei verfügbar.
Wer professionelle Unterstützung will (Update-Pfad, getestete
Versions-Kompatibilität, Konfigurations-Hilfe, Daten-Migration bei
Knoten-Umzug), zahlt einen **Obolus**, einen freiwilligen Beitrag in
Monats- oder Jahresform. Ähnlich, wie SQLite-Hilfsdienste, ZFS-
Support, oder PostgreSQL-Consulting heute funktionieren. Größenordnung
für Kleinunternehmen: 5–20 € pro Monat pro Knoten; für Vereine
freiwillig, was sie zahlen wollen.

**Skalierung:** Bei 200 zahlenden Knoten zu durchschnittlich 10 €
ergibt das 2 000 € pro Monat. Das ist ein kleiner, aber nachhaltiger
Lebensunterhalt für eine Einzelperson, die die Werkzeuge pflegt.
Im Vergleich zu Risikokapital-finanzierten Startups bescheiden, aber
auf Nutzer-Bedürfnisse statt auf Investor-Renditen ausgerichtet.

### 7.3 Modell 2 — Schlüsselfertige Knoten-Templates

Manche Anwendungsbereiche wiederholen sich:
- **Vereinskalender mit Termin-Föderation** zwischen Lokal-Gruppen.
- **Lokale Rezept-Sammlung mit Wein-Pairing**.
- **Hobby-Forum mit Cross-Knoten-Suche** (Eisenbahn, Briefmarken,
  …).
- **Familien-Foto-Album mit privater Föderation** zwischen
  Verwandten.

Statt jedes Mal von Null aufzubauen, gibt es **Knoten-Templates**:
fertige PWAs mit vorkonfigurierten Stamm-/Gast-Kategorien (Modul 02
§ Spore-JSON, Felder `stammCategories` und `guestCategories`),
Standard-Domain-Vektor, Standard-Andock-Bundle. Endkunde lädt das
Template, ändert den Branding-Block (Logo, Domain), deployt es.

**Geschäftsmodell:** Templates als einmaliger Kauf (10–100 € je
nach Komplexität) plus optionaler laufender Support-Obolus. Open-
Source-Templates bleiben kostenlos verfügbar; bezahlte Templates
sind die mit professionellem Branding, Tutorials, gepflegter
Update-Politik.

### 7.4 Modell 3 — Beratung und Schulung

Vereine und kleine Unternehmen, die zwischen Cloud-Bindung und
Eigen-Aufbau gefangen sind, brauchen oft eine zweistündige Beratung,
um zu verstehen, ob SBKIM für sie passt. Das ist klassisch
honorierbar (50–150 € pro Stunde) und braucht keine technische
Skalierung. Der Berater (Klaus oder ein Kollege) skaliert sich
selbst.

**Skalierung:** Bei 5–10 Beratungs-Stunden pro Woche zu
durchschnittlich 80 € sind das 1 600–3 200 € pro Monat. Plus
Modell 1 und 2 ergibt sich eine plausible Lebensunterhalts-Basis.

### 7.5 Modell 4 — Knoten-Hosting für Nicht-Programmierer

Manche Anwender wollen das Mycel nutzen, aber sich nicht um
GitHub-Pages-Konfiguration und Service-Worker-Setup kümmern.
**Managed Hosting** für SBKIM-Knoten: Anbieter (z.B. Klaus) hostet
einen Knoten auf eigener Infrastruktur, der Kunde bekommt eine
Web-UI zum Pflegen der Inhalte.

**Datenschutz (wichtig):** Die Identität (Ed25519-Privatschlüssel)
bleibt verschlüsselt auf dem Endknoten-Speicher oder im
Passwort-geschützten Backup. Der Hoster kann die Daten **nicht
lesen** (Backup-Export ist passwort-verschlüsselt mit
PBKDF2-SHA256/AES-GCM, siehe Modul 02 Spec Stufe 2). Der Hoster
liefert nur den Storage, nicht den Schlüssel.

**Geschäftsmodell:** Monatliche Hosting-Pauschale, ähnlich kleinen
Webhosting-Anbietern (3–10 € pro Monat pro Knoten). Skaliert linear
mit der Knoten-Anzahl, kostet wenig Infrastruktur (statisches
Hosting, Standby-Service-Worker).

### 7.6 Was nicht funktionieren wird

Aus Ehrlichkeit auch das, was vermutlich **nicht** trägt:

- **Advertising / Daten-Monetarisierung.** Das widerspricht dem
  Kern-Versprechen. Wer Werbe-Modelle aufbaut, verliert die
  Vertrauensbasis.
- **Patent-Schutz auf das Protokoll.** Die Bausteine sind alt; eine
  Patentierung wäre weder durchsetzbar noch wünschenswert.
- **Vendor-Lock-in über proprietäre Erweiterungen.** Würde das Mycel
  spalten, ohne langfristigen Nutzen.

---

## 8. Limitationen und offene Fragen

### 8.1 Browser-Sicherheits-Modell

Web-Browser sind nicht für peer-to-peer-Kommunikation zwischen
Tabs/Origins konzipiert. Same-Origin-Policy verhindert direkte
Kommunikation; eingehende Pulls funktionieren nur, weil
Service-Worker als Page-Hosted-Endpunkte dienen.

**Offene Frage:** Wie skaliert das, wenn ein Knoten mehrere
gleichzeitige eingehende Pulls bearbeiten soll? Spec-Sitzung 05 sagt
„Single-PWA, Single-Thread". Für 10 Geschwister reicht das; für
1 000 wahrscheinlich nicht. **Antwort vermutlich:** Bei dieser
Größenordnung ist eine Cloud-Variante (eigener Server) sinnvoller,
und das Protokoll selbst hindert nicht daran. Sage-Protokol-PWA ist
ein Einstieg, kein Endzustand.

### 8.2 Bootstrap-Problem

Ein neues Mycel hat anfangs nur einen Knoten. Der hat niemanden zum
Reden. Wie kommen die ersten 5–10 Geschwister zusammen?

**Heutige Lösung:** Manuell. Klaus kennt Anna, beide deployen ihre
PWAs, tragen die Domain des anderen in ihren Andock-Schritt
ein. Modul 14 (Diffusion, im Backlog) soll später konsensuelle
Empfehlung beim Handshake einführen.

**Geschäftsmodell-Bezug:** Beratungs- und Andock-Bundle-Angebote
(§ 7.2 / 7.3) sind in dieser Phase besonders wertvoll, weil sie das
Bootstrap-Problem aktiv begleiten.

### 8.3 Embedding-Modell-Drift

Das Standard-Modell (`Xenova/multilingual-e5-small`) ist
deterministisch: Vektoren passen für eine bestimmte Modell-Version.
Wenn das Modell sich ändert, brechen alle bestehenden
Domain-Vektoren.

**Spec-Antwort:** Die Modell-Version steht in jeder Spore
(`embeddingModel`-Feld); Knoten mit unterschiedlichen Modellen
matchen vorsichtig oder gar nicht. Eine globale Modell-Migration
wäre ein Protokoll-Hauptversions-Sprung.

### 8.4 Geschäftsmodell-Tragfähigkeit

Ehrlich: 2 000–5 000 € pro Monat als Lebensunterhalt-Ziel (aus
Klaus' Sicht, § 7.2 + 7.3 + 7.4 kombiniert) erfordert eine
**kritische Masse an zahlenden Nutzern**, die das Protokoll erst
durch organisches Wachstum erreichen kann. Es gibt keinen
Venture-Capital-Sprint, der diese Phase überspringt.

**Strategie:** Klein anfangen. Erst 5–10 nicht-zahlende
Test-Knoten (Klaus' Apps, befreundete Vereine). Dann erste 1–3
zahlende Knoten (kleine Vereine, die Beratung wollen). Dann
Skalierung über Mund-zu-Mund-Empfehlung und Modul 14 Diffusion. Die
ersten zwei Jahre sind Lehr- und Werkzeug-Phase, nicht Umsatz-Phase.

---

## 9. Schlussfolgerung

Sage-Protokol und SBKIM sind **kein revolutionärer Bruch** mit dem
heutigen Web. Sie sind eine **bewusst minimale Synthese** bekannter
Bausteine (Ed25519, JSON, Embedding-Vektoren, Service-Worker,
`.well-known`-Pfade) zu einem zusammenhängenden Protokoll, das
Endknoten-Betreiber ohne IT-Abteilung direkt einsetzen können.

Der Nutzen liegt nicht in technischer Neuheit, sondern in
**Zugänglichkeit**: ein Single-File-PWA-fähiges Mycel, das
- **Datensouveränität** ohne Cloud-Bindung gewährt,
- **App-zu-App-Automatisierung** ohne kombinatorische Plugin-
  Explosion ermöglicht,
- **kleinteilige Geschäftsmodelle** (Andock-Bundle-Obolus, Templates,
  Beratung, Managed Hosting) trägt, die einen Pflege-Lebensunterhalt
  hergeben können, ohne dass das Protokoll selbst kommerziell
  verschlossen wird.

Klaus, Mai 2026: zwei Endknoten (Rezeptbuch, Mixarium), drei
Nutzer. Sage-Protokol als Spezifikations- und Bau-Hub, beide
Endknoten live mit SBKIM integriert. Die nächsten zwei Jahre
entscheiden, ob das Mycel wächst und ob die Geschäftsmodelle aus
§ 7 tragen.

Das ist ein leiser Anfang. Genau so soll es sein.

---

## 10. Verweise

### Innerhalb dieses Repos

- **`sbkim_paper.pdf`** — technisches Hauptpaper (formale
  Protokoll-Beschreibung, Algorithmen, Sicherheits-Eigenschaften).
- **`CLAUDE.md`** — Sitzungs-Anker, Konventionen, Tonalität.
- **`docs/PULS.md`** — lebender Status aller Module + Sitzungs-
  Übersicht.
- **`docs/ARCHITEKTUR.md`** — Bau-DAG, Modul-Abhängigkeiten.
- **`docs/INTERFACES.md`** — verbindliche Vertrags-Definitionen.
- **`docs/GLOSSAR.md`** — Begriffs-Klärung (Spore, Anastomose,
  Heterokaryose, Apoptose, Mycel, Knoten-ID).
- **`docs/components/00_doku_fenster.md`** bis **`12_blocklist.md`**
  + **`14_diffusion.md`** — die zehn aktiven Module plus drei
  Schutz-Stubs plus Diffusions-Stub.

### Stand der Technik

- **ActivityPub** — W3C-Recommendation, https://www.w3.org/TR/activitypub/
- **Solid** — Tim Berners-Lee, https://solidproject.org/
- **Matrix** — https://matrix.org/
- **DNS-SD / mDNS / Bonjour** — RFC 6762 / 6763.
- **Verifiable Credentials** — W3C-Recommendation,
  https://www.w3.org/TR/vc-data-model-2.0/

### Kryptographie

- **Ed25519** — RFC 8032.
- **PBKDF2** — RFC 8018 (Empfehlung 2023+: 600 000 Iterationen für
  PBKDF2-SHA256, siehe OWASP Password Storage Cheat Sheet).
- **AES-GCM** — NIST SP 800-38D.
- **WebCrypto** — W3C-Recommendation,
  https://www.w3.org/TR/WebCryptoAPI/

### Embedding-Modell

- **Multilingual E5 Small** — Wang et al., 2022,
  „Text Embeddings by Weakly-Supervised Contrastive Pre-training".
- **transformers.js** — https://huggingface.co/docs/transformers.js
  (Browser-fähige Inferenz).

---

**Lizenz:** Dieses Dokument folgt der Lizenz des Sage-Protokol-Repos
(siehe `LICENSE`-Datei). Verbreitung und Anpassung sind ausdrücklich
erwünscht, das Protokoll lebt vom Mit-Aufbau.

**Kontakt:** Klaus, Sage-Protokol-Betreiber. Erreichbar über die
Endknoten Mein-Rezeptbuch und Mein-Mixarium (siehe Tabelle
„Endknoten" in `docs/PULS.md`).
