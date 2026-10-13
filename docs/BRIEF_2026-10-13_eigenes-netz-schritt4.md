# Brief · Eigenes Netz, Schritt 4 und 5 · Träger nachziehen, Mycel-Karte

**Von:** Sitzung 2026-10-13 (Schritte 2 und 3). **Für:** die nächste Sitzung, Zweig wie vorgegeben, frisch von `origin/main`.

## Stand (auf main)
- **Sage #1075:** 23-UI trägt die Einstellung „Netz“, also eine Box in der Mycel-Blase, einen Beitritts-Link `#sbkim-netz=…` (die App fragt vorher), „Zurück“ und Auto-Verbinden. INTERFACES steht dazu.
- **family-project #355:** `server/relais-intern/` (EINRICHTEN.md) für `wss://relay-intern.family-projekt.de`, ohne pubkey_whitelist.
- **Sende-Pruefer #76:** erster Träger (05b, 23, 23-UI, Cache v66).

## Vorher bei Klaus (die Sitzung kann das nicht)
1. **INWX:** A-Eintrag `relay-intern` → `167.233.204.72`.
2. **Hetzner Cloud-Server:** `git -C /srv/family-project pull`, dann `bash /srv/family-project/server/relais-intern/einrichten.sh`.
3. **Hetzner Cloud-Server:** `curl -s -H 'Accept: application/nostr+json' https://relay-intern.family-projekt.de/` muss mit `{"name":"intern Family Project"` beginnen.
4. **Tablet, Sichttest im Sende-Prüfer:**
   - Mycel-Blase → „Netz“ → Netz anlegen (Relais `wss://relay-intern.family-projekt.de`) → Link kopieren.
   - Den Link auf einem zweiten Gerät öffnen; die App fragt nach.
   - Die Frage muss im eigenen Netz ankommen.
   - Danach „Zurück zum öffentlichen Netz“.

## Zu tun
**Schritt 4 · übrige Träger.**
- `node tools/kanon-verteilen.mjs` (erst nachsehen, dann `--schreiben`) über alle Träger:
  - 16 Träger hängen bei Modul 23 nach.
  - Modul 23-UI liegt in **zwei** älteren Fassungen vor (`d2d762c9` bei 13, `fc47f16b` bei Jasons- und Mein-Tresor).
  - Das ist ein Generationssprung: **Proben je Ziel-Repo fahren**, ein PR je Repo.
- Einschließlich In-and-Out-Book, Company Brain und Kimboard.
- Ein Repo ohne passende Pins zieht man von Hand nach, und zwar nur an der Pin-Zeile.
- Nachziehen ist auf einen Träger einzuengen, indem `--nachbarn` auf ein Verzeichnis mit **einem** Verweis zeigt.
- Workflow PDF, Workflow-Needs und Workflow-Calculate sind noch **keine** Knoten. Andocken heißt Pflicht-Module nach `docs/PFLICHT_MODULE.md`: Schublade im `<head>`, Vorrat, Kopfleiste. Das ist eine eigene Arbeit je App; vorher prüfen und Klaus fragen, ob alle drei jetzt dran sind.

**Schritt 5 · Mycel-Karte.**
- Ein Knopf schaltet aufs Firmennetz um.
- Klaus: Der Code wird **nur auf eigenen Rechnern im Firmennetz** gemerkt. „Fremde sollen da nicht Eingriff haben.“ Also nie als Vorgabe im Depot, nie in einer öffentlich ausgelieferten Datei. Gespeichert wird lokal nach Beitritt per Link.

## Regeln
- Der Netz-Code kommt nie ins Repo und nie in ein Ereignis.
- Ein ungültiger Code fällt nie still ins öffentliche Netz.
- Kanon-Module bleiben byte-1:1, mit Pins und Cache-Bump.
- Ein Befehl nennt immer seine Maschine.
- Proben und Gegenproben laufen in einer Wegwerf-Kopie.

## Abschluss
PULS, Übergabeprotokoll, Kimhub-Forschungseintrag (`arm` ist Pflicht), Abschlussbrief mit Stundennachweis, dazu der nächste Brief als Codeblock im Chat.
