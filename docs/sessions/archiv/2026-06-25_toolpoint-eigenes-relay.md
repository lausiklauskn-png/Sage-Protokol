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

## Freibrief

Galt (CLAUDE.md § Freibrief). Reine Doku-Sitzung, kein Code, kein Krypto-Eingriff
→ keine zweifelhaften Merk-Entscheidungen. Hosting/Wortlaut/Scope/Name bewusst
mit Klaus geklärt (richtungs- und kostenrelevant).
