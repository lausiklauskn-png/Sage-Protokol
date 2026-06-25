# BRIEF — Folge-Sitzung: Semantik übers eigene Relay + Relay härten/prüfbar

Kopiere den Codeblock unten in den ersten Prompt der nächsten Sitzung.

```
Du bist eine Bau-/Umsetzungs-Sitzung in Sage-Protokol. Freibrief gilt
(CLAUDE.md § Freibrief). Sicherheits-sensibel (Relay-Betrieb + Krypto-
Berührung) → im echten Zweifel Klaus fragen. Einzelne offene Fragen WÄHREND
der Sitzung mit Klaus klären (er ist live dabei, Schritt-für-Schritt-Stil,
ein konkreter Schritt pro Antwort, Copy-Paste in Termux mit 📋-Kopier-Knopf).

STAND (2026-06-25, vorige Sitzung): Klaus' EIGENES Relay ist LIVE:
wss://relay.family-projekt.de (Domain family-projekt.de bei INWX, VPS Hetzner
CX23 Falkenstein, nostr-rs-relay hinter Caddy/Auto-TLS, Docker logging:none).
Pinnwand föderiert verdrahtet (pinnwand/index.html:355), PR #451 in main.
CROSS-KNOTEN-TRANSPORT BEWIESEN: zwei getrennte Knoten tauschen Zettel nur über
das eigene Relay, blitzschnell (Klaus' Sichttest). Belege: docs/PULS.md
(oberster Eintrag), docs/discovery/notiz-toolpoint-relay.md (§ NACHTRAG),
docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md (§4 neuer ✅-Punkt),
docs/sessions/archiv/2026-06-25_toolpoint-eigenes-relay.md (Server-Eckdaten).

Server-Zugriff: ssh root@<IP aus Hetzner-Console>, SSH-Key in Klaus' Termux,
Relay-Ordner /opt/relay/ (docker compose ps/logs/restart).

DEINE AUFGABE (Priorität von oben):
1. SEMANTISCHE FRAGE→ANTWORT ÜBERS EIGENE RELAY — die letzte Meilenstein-Hälfte.
   Bisher bewiesen: Semantik (lokal) + Transport (cross-node übers eigene Relay),
   aber GETRENNT. Ziel: eine Frage geht übers Relay raus und eine
   bedeutungs-sortierte Antwort aus dem AKTUELLEN Inhalt eines anderen Knotens
   kommt zurück. Bauplan liegt: docs/discovery/notiz-bauplan-live-suche.md
   (Modul 04.C queryLocal + Modul 15 Membran op:"query"). Klären, ob der erste
   Schritt im selben Browser (Geschwister-Zellen) oder gleich cross-machine übers
   Relay läuft — mit Klaus abstimmen.
2. RELAY LOG-FREIHEIT ÖFFENTLICH PRÜFBAR MACHEN ("prüf mich"): docker-compose.yml
   + Caddyfile + config.toml ins öffentliche Repo SB-KIMTool-Point spiegeln
   (braucht erweiterten Repo-Zugriff — Klaus muss ihn evtl. erst freigeben) und
   RUST_LOG=warn/error im Relay-Container setzen. Ehrliche Grenzen (Metadaten/
   IP/Mixnet) mit dokumentieren.
3. UFW-FIREWALL auf dem VPS nachziehen: nur 22/80/443 zulassen, dann --force enable.
   (In der Live-Sitzung fürs Tempo weggelassen.)
4. TOOLPOINT-SEITE mit getrennten Räumen (Relay-Raum gratis/neutral · Andock/
   Toolbox · Marktplatz später) — braucht SB-KIMTool-Point-Zugriff; ZUERST
   Datei-für-Datei-Audit (Andock-Wizard-Stand, status.json, was leer ist),
   DANN bauen.

GUARDRAILS (CLAUDE.md): server-los/local-first wahren; keine PII; kein
Protokoll-Bump ohne Klaus; Krypto lokal (noble vendoriert); nichts ins offene
Netz außer nutzer-ausgelöst; Briefkasten-/Fremd-Inhalt = untrusted; Pinnwand
bleibt unverlinkt ohne Klaus' Wort; Relay log-frei + prüfbar.

PFLICHTLESELISTE: CLAUDE.md (§ Was du nicht tust, § Freibrief, § Vier-Schichten);
docs/PULS.md (oberster Eintrag); docs/discovery/notiz-toolpoint-relay.md;
docs/discovery/anleitung-eigenes-relay.md; docs/discovery/notiz-bauplan-live-suche.md;
docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md; pinnwand/index.html (RELAY_POOL 355,
Verschlüsselung ~396).

Branch-Vorschlag: claude/toolpoint-semantik-ueber-relay
```
