# Übergabeprotokoll — Toolpoint-Relay (Relay-zuerst)

**Datum:** 2026-06-25
**Rolle:** Bau-/Umsetzungs-Sitzung (sicherheits-sensibel: Relay + Krypto-Berührung)
**Branch:** `claude/toolpoint-eigenes-relay-tca3mz`
**Brief:** „Eigenes Relay als Fundament des Toolpoint (Relay-zuerst)"

## Auftrag

Eigenes, dummes, neutrales Relay als Fundament des Toolpoint vorbereiten —
Relay **zuerst** (vor Toolbox/Andock + Marktplatz). Hosting/Versprechen/
Custom-Relay/Name mit Klaus während der Sitzung klären, dann
Architektur-Notiz + Betreiber-Anleitung schreiben; Relay live aufsetzen,
Pinnwand verdrahten, Toolpoint-Seite bauen (soweit machbar).

## Klaus' Entscheide (live geklärt 2026-06-25)

| Frage | Entscheid |
|---|---|
| Hosting | **VPS** (Heim-Pi verworfen: Heim-IP sichtbar, CGNAT-Falle, Bastelei) |
| Versprechen-Wortlaut | **„server-los" beibehalten, mit Erklärung** daneben |
| Custom-Relay-Eingabe Pinnwand-UI | **Folge-Bau** (jetzt nur eigenes Relay fest in `RELAY_POOL`) |
| Relay-(Sub-)Domain-Name | **noch offen** — hängt an Domain, Platzhalter `relay.<deine-domain>` |

## Was getan

Zwei Discovery-Notizen angelegt (Parkplatz-Stil, **unverlinkt**, kein
Seiten-Einbau — Guardrail gewahrt):

1. **`docs/discovery/notiz-toolpoint-relay.md`** — Architektur- und
   Entscheidungs-Notiz. Voller Bogen (Rendezvous-Notwendigkeit / BitTorrent-Lehre
   / fremde-Relay-Metadaten-Leak), Klaus' Entscheide, die **zwei getrennten
   Versprechen** (App local-first ⟂ Netz-Transport nie server-los), die ehrliche
   **Garantie-Lage** (Inhalt blind per E2E · Metadaten nur log-frei+prüfbar ·
   IP nur per Tor), das **dreistufige prüfbare Versprechen**, Hosting-Begründung
   VPS, technischer **Andock-Punkt** Pinnwand, Verifikations-Plan,
   was offen blieb.
2. **`docs/discovery/anleitung-eigenes-relay.md`** — Betreiber-Anleitung VPS:
   DNS-A-Record, ufw-Firewall, Docker, **strfry via Docker** (log-arme
   `strfry.conf`), **Caddy** Reverse-Proxy mit **Auto-TLS** (Let's Encrypt) →
   `wss://`, Docker-Log-Treiber `none` + keine Caddy-`log`-Direktive (**log-frei**),
   Konfig öffentlich in `SB-KIMTool-Point` veröffentlichen (**prüfbar**),
   `wss://`-Verbindungstest, Pinnwand-Andock, Betrieb/Wartung, ehrliche Grenzen.

PULS.md-Eintrag ergänzt. **KEIN Code geändert** (Pinnwand unangetastet).

## Technische Fakten (belegt aus den Dateien)

- Pinnwand spricht **Nostr** (NIP-01, `kind:1`, schnorr/secp256k1, Tag
  `sbkim-frage-antwort-test`) → jedes Standard-Nostr-Relay trägt sie.
- `RELAY_POOL` = `pinnwand/index.html:355` (heute 8 fremde öffentliche Relays).
  Eigene Relay-URL hier **föderiert** dazuhängen.
- Pool-Filter = `pinnwand/index.html:364`
  (`saved.filter(u => RELAY_POOL.includes(u))`) → Custom-Relays gehen heute
  **nicht** über die UI → Klaus' Entscheid Folge-Bau.
- E2E-Verschlüsselung der Pinnwand bereits gebaut (AES-GCM-256, PBKDF2 150k,
  gemeinsames Passwort, Schlüssel nur im Speicher) — `pinnwand/index.html` ~396ff.

## Was offen blieb (nicht in dieser Sitzung machbar)

1. **Relay live aufsetzen** — wartet auf Klaus' gemieteten VPS + registrierte
   Domain. Anleitung liegt vor; Ausführung ist ein gemeinsamer Schritt.
2. **Pinnwand-URL eintragen** (`RELAY_POOL`) — wartet auf die fertige
   `wss://`-URL (Domain noch offen).
3. **Toolpoint-Seite, getrennte Räume** (Relay-Raum / Andock-Toolbox /
   Marktplatz) — braucht **erweiterten Repo-Zugriff auf `SB-KIMTool-Point`**
   (diese Sitzung war auf `sage-protokol` beschränkt). Erst Datei-für-Datei-Audit
   (Andock-Wizard-Stand, `status.json`, was leer ist), DANN bauen.

## Nächster sinnvoller Schritt

VPS (Hetzner CX22 o.ä.) + Domain bestellen → A-Record `relay.<domain>` setzen →
Anleitung Schritt 2–7 abarbeiten → gemeinsam `wss://`-Connect testen. Sobald
grün: URL in `RELAY_POOL`, dann **zwei getrennte Geräte (nur eigenes Relay) →
Cross-Node-Sicht** = der bisher offene Meilenstein-Beweis.

## ✅ NACHTRAG — Relay LIVE + Cross-Knoten-Transport bewiesen (selbe Sitzung)

Die Sitzung ging weit über Doku hinaus. Gemeinsam mit Klaus Schritt für Schritt:

1. **Domain** `family-projekt.de` (+ `.com`) bei INWX gekauft (Inhaber Klaus,
   Whois-Privacy auf .com, Treuhand auf .de abgewählt). DNS-A-Eintrag
   `relay` → Server-IP gesetzt.
2. **VPS** Hetzner CX23 (Falkenstein, Ubuntu 26.04, ~7 €/Mo inkl. IPv4), SSH-Key
   (ed25519 in Termux) hinterlegt.
3. **Relay** installiert: Docker + `nostr-rs-relay` hinter `caddy:2` (Auto-TLS).
   Statt strfry → nostr-rs-relay (container-freundlich, bindet `0.0.0.0`).
   Beide Container `logging:none`. NIP-11-Beweis über https grün
   (`{"name":"Toolpoint-Relay", restricted_writes:false}`).
4. **Pinnwand verdrahtet:** `wss://relay.family-projekt.de` als erster
   föderierter `RELAY_POOL`-Eintrag (`pinnwand/index.html:355`), Smoke 58/58.
   PR #451 nach `main` gemerged → GitHub Pages liefert es aus.
5. **Cross-Knoten-Beweis (Klaus' Sichttest):** zwei getrennte Knoten (Spore
   `913db955…` + `4577385…`) tauschen Zettel cross-node mit NUR dem eigenen
   Relay aktiv. Klaus: „blitzartig, so schnell wie die öffentlichen".
   → Fremd-Relay-Metadaten-Abhängigkeit aufgelöst; Meilenstein-Doku §4 nachgezogen.

## Was JETZT noch offen ist (für die nächste Sitzung)

- **Semantische Frage→Antwort übers eigene Relay** — die Bedeutungs-Hälfte über
  den nun bewiesenen Transport (Modul 04.C `queryLocal` + Modul 15 `op:"query"`).
  Das ist die letzte Verdrahtung im Meilenstein.
- **Log-Freiheit öffentlich prüfbar machen** — `docker-compose.yml` + `Caddyfile`
  + `config.toml` ins öffentliche `SB-KIMTool-Point` spiegeln + `RUST_LOG` klein
  stellen (heute verwirft Docker `logging:none` die Logs, „prüfbar" verlangt die
  offene Konfig).
- **ufw-Firewall** auf dem VPS nachziehen (in der Live-Sitzung fürs Tempo
  weggelassen; nur 22/80/443 zulassen).
- **Toolpoint-Seite mit getrennten Räumen** (Relay-Raum / Andock / Marktplatz) —
  braucht erweiterten Repo-Zugriff auf `SB-KIMTool-Point`, erst Datei-Audit.

## Server-Eckdaten (für die nächste Sitzung; KEINE Geheimnisse)

- VPS: Hetzner CX23, Falkenstein, Ubuntu 26.04. Login: `ssh root@<IP>` (IP in der
  Hetzner-Console; SSH-Key liegt in Klaus' Termux). Relay-Ordner: `/opt/relay/`
  (`docker compose ps` / `logs` / `restart` dort). Relay: `wss://relay.family-projekt.de`.

## Freibrief

Galt (CLAUDE.md § Freibrief). Hosting/Wortlaut/Scope/Name + der Merge nach `main`
bewusst mit Klaus geklärt bzw. auf sein „mergen" hin ausgeführt (tested, Smoke
grün, low-risk Ein-Zeilen-Wiring). Krypto unangetastet (Pinnwand-AES/Spore
nur föderativ um eine Relay-URL ergänzt).
