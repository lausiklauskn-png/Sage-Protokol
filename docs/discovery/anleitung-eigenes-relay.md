<!-- NOTIZ / PARKPLATZ (Klaus 2026-06-25): Betreiber-Anleitung für das eigene
     Toolpoint-Relay. Bewusst NICHT verlinkt — Werkstatt-Doku. Wird beim Bau der
     Toolpoint-Seite (SB-KIMTool-Point) als öffentlich-prüfbare Konfig-Quelle
     wiederverwendet. Keine PII, keine echten Schlüssel/IPs hier hartcodieren. -->

# Anleitung — Eigenes Toolpoint-Relay (VPS, log-frei, prüfbar)

> Ziel: ein **dummes, neutrales, log-freies** Nostr-Relay, das die Pinnwand /
> Cross-Knoten-Suche trägt. Es rankt nichts, verkauft nichts, liest nichts (E2E).
> Hosting-Entscheid: **VPS** (siehe `notiz-toolpoint-relay.md`).
>
> **Platzhalter:** überall `relay.<deine-domain>` durch die echte (Sub-)Domain
> ersetzen, sobald sie steht. Name noch offen (Klaus 2026-06-25).

## Warum genau diese Bausteine

- **Nostr-Relay** — die Pinnwand spricht Nostr (NIP-01, `kind:1`). Drei offene,
  gratis Optionen: **strfry** (C++, LMDB, performant), **nostr-rs-relay** (Rust,
  SQLite, einfach), **khatru** (Go, Baukasten). Diese Anleitung nimmt **strfry
  via Docker** — ein Befehl, gut dokumentiert, wenig Bastelei.
- **Caddy** als Reverse-Proxy — holt **TLS automatisch** (Let's Encrypt) und
  macht aus `ws://localhost:7777` ein öffentliches `wss://relay.<deine-domain>`.
  Kein manuelles Zertifikat-Gefummel.
- **Log-frei** — Docker-Log-Treiber `none` + Caddy ohne `log`-Direktive +
  strfry-Verbosity runter. Es entstehen keine „wer/wann"-Protokolle.
- **Prüfbar** — die komplette Konfig (`docker-compose.yml`, `Caddyfile`,
  `strfry.conf`) wird **öffentlich** in `SB-KIMTool-Point` veröffentlicht. Jeder
  kann nachlesen, dass nichts geloggt wird. „prüf mich" statt „vertrau mir".

## Schritt 0 — Was du brauchst

> **Domain und Server sind zwei getrennte Dinge** und müssen NICHT beim selben
> Anbieter sein. Domain = der Name, VPS = der Rechner. Du kannst sie frei mischen.

- **Ein VPS** (Ubuntu 24.04 LTS), **beliebiger Anbieter** — Hetzner, Strato
  („V-Server"), IONOS, Netcup, Contabo, DigitalOcean … alle bieten VPS, alle
  gehen. ~4–5 €/Mo. Klaus' Wahl 2026-06-25: **günstig + eigene seriöse Adresse**
  (nicht der Gratis-Weg Oracle/DuckDNS). Beim Anlegen deinen **SSH-Public-Key**
  hinterlegen.
- **Eine Domain**, **beliebiger Registrar** (Strato, IONOS, Namecheap,
  Cloudflare …). Einzige Anforderung: du kannst einen **DNS-A-Eintrag** setzen —
  das können alle. Die **1-€-Angebote** sind meist nur das **erste Jahr**
  (danach ~10–15 €/Jahr); für unseren Zweck völlig ausreichend, der Name muss
  nur „zeigen".
- Die öffentliche **IPv4** deines VPS (zeigt der Anbieter nach dem Anlegen).

## Schritt 1 — DNS: Subdomain auf den VPS zeigen

Beim Domain-Anbieter einen **A-Record** anlegen:

```
Typ:   A
Name:  relay        (ergibt relay.<deine-domain>)
Wert:  <öffentliche-IPv4-des-VPS>
TTL:   3600
```

(Optional zusätzlich ein `AAAA`-Record auf die IPv6, falls der VPS eine hat.)
Verbreitung kurz abwarten, dann prüfen: `ping relay.<deine-domain>` zeigt die
VPS-IP.

## Schritt 2 — Auf den VPS einloggen + Grundsicherung

```bash
ssh root@<vps-ip>

# System aktuell
apt update && apt -y upgrade

# Firewall: nur SSH + Web. Sonst nichts erreichbar.
apt -y install ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## Schritt 3 — Docker installieren

```bash
apt -y install docker.io docker-compose-v2
systemctl enable --now docker
docker --version   # bestätigt: Docker läuft
```

## Schritt 4 — Projekt-Ordner + strfry-Konfig (log-frei)

```bash
mkdir -p /opt/toolpoint-relay/strfry-data
cd /opt/toolpoint-relay
```

Datei `strfry.conf` anlegen (`nano strfry.conf`) — Minimal-Konfig, **log-arm**:

```conf
# Toolpoint-Relay — strfry. Bewusst minimal, neutral, log-frei.
db = "/app/strfry-db/"

relay {
    bind = "0.0.0.0"
    port = 7777

    # Öffentliche Selbstbeschreibung (NIP-11). Ehrlich + neutral.
    info {
        name        = "Toolpoint-Relay"
        description = "Dummes, neutrales, log-freies SBKIM-Rendezvous. Rankt nichts, liest nichts (E2E). Konfig offen einsehbar."
        # contact/pubkey absichtlich leer lassen, bis Klaus es bewusst setzt.
    }

    # Schlank halten — kein Bedarf für Riesen-Events.
    maxWebsocketPayloadSize = 131072
    maxFilterLimit          = 500

    # Verbosity runter: keine Verbindungs-/Anfrage-Protokolle.
    logging {
        dumpInAll       = false
        dumpInEvents    = false
        dumpInReqs      = false
        dbScanPerf      = false
    }
}
```

> Hinweis: strfry schreibt betriebsbedingt nur sehr knappe Statuszeilen nach
> stdout; der Docker-Log-Treiber `none` (Schritt 5) verwirft auch die. Es
> entsteht kein „wer/wann"-Protokoll auf der Platte.

## Schritt 5 — docker-compose: strfry + Caddy (Auto-TLS, log-frei)

Datei `docker-compose.yml` (`nano docker-compose.yml`):

```yaml
services:
  strfry:
    image: dockurr/strfry        # gepflegtes strfry-Image
    container_name: strfry
    restart: unless-stopped
    volumes:
      - ./strfry.conf:/app/strfry.conf:ro
      - ./strfry-data:/app/strfry-db
    logging:
      driver: "none"             # KEINE Container-Logs auf Platte
    expose:
      - "7777"                   # nur intern, nicht nach außen

  caddy:
    image: caddy:2
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    logging:
      driver: "none"             # KEINE Access-/Container-Logs auf Platte

volumes:
  caddy_data:
  caddy_config:
```

Datei `Caddyfile` (`nano Caddyfile`) — **eine** Zeile Logik, TLS automatisch:

```caddy
relay.<deine-domain> {
    reverse_proxy strfry:7777
}
```

> Caddy holt das Let's-Encrypt-Zertifikat selbst, sobald der A-Record stimmt und
> Port 80/443 offen sind. **Bewusst KEINE `log`-Direktive** → keine Access-Logs.
> Der WebSocket-Upgrade (`wss://`) wird von `reverse_proxy` transparent
> durchgereicht — nichts Extra nötig.

## Schritt 6 — Starten

```bash
cd /opt/toolpoint-relay
docker compose up -d
docker compose ps        # strfry + caddy sollten „running" sein
```

Beim ersten Start braucht Caddy ein paar Sekunden für das Zertifikat.

## Schritt 7 — Verbindungstest (`wss://`)

Schnellster Test vom VPS oder von irgendeinem Rechner mit Node/Termux:

```bash
# websocat (oder: npx wscat -c wss://relay.<deine-domain>)
npx wscat -c wss://relay.<deine-domain>
# nach Verbindung tippen:
["REQ","probe",{"kinds":[1],"limit":1}]
# Erwartung: eine Antwortzeile, die mit ["EOSE","probe"] endet → Relay spricht.
```

Browser-Variante (DevTools-Konsole auf irgendeiner https-Seite):

```js
const ws = new WebSocket('wss://relay.<deine-domain>');
ws.onopen = () => { console.log('OPEN'); ws.send(JSON.stringify(["REQ","probe",{"kinds":[1],"limit":1}])); };
ws.onmessage = (m) => console.log('MSG', m.data);   // ...EOSE = ok
ws.onerror = (e) => console.log('ERR', e);
```

`OPEN` + eine `EOSE`-Zeile = Relay live und über TLS erreichbar.

## Schritt 8 — Log-Freiheit öffentlich prüfbar machen

Das ist der „prüf mich"-Teil. In `SB-KIMTool-Point` (öffentlich) ablegen:

- `relay/docker-compose.yml`, `relay/Caddyfile`, `relay/strfry.conf` — **exakt
  die laufenden Dateien** (ohne Geheimnisse — hier gibt es keine).
- Eine kurze `relay/README.md`: was läuft, dass `logging.driver: none` gesetzt
  ist, dass Caddy keine `log`-Direktive hat, und der Hinweis auf die ehrliche
  Grenze (ein Betreiber *könnte* theoretisch heimlich mehr tun → echte Garantie
  erst per Mixnet; für IP-Anonymität Tor nutzen).

So kann jeder die Konfig gegen das laufende Relay halten. Aus „vertrau mir" wird
„prüf mich" (siehe `notiz-toolpoint-relay.md` § Das dreistufige Versprechen).

## Schritt 9 — Pinnwand andocken

Sobald `wss://relay.<deine-domain>` steht: die URL **föderiert** in den
`RELAY_POOL` hängen — `pinnwand/index.html:355` (neben den öffentlichen, nicht
statt ihnen). Für den Meilenstein-Beweis in der Pinnwand-UI **nur** das eigene
Relay aktiv lassen, dann zwei getrennte Geräte → cross-node-Sicht. (Grenze:
`pinnwand/index.html:364` lässt nur Pool-Einträge zu; frei eintragbares Feld =
Folge-Bau, siehe Notiz.)

## Betrieb / Wartung

```bash
cd /opt/toolpoint-relay
docker compose pull && docker compose up -d   # Updates einspielen
docker compose restart                        # nach Konfig-Änderung
docker compose down                           # stoppen
```

Daten liegen in `/opt/toolpoint-relay/strfry-data` (die LMDB). Backup = diesen
Ordner sichern (enthält nur öffentliche, signierte Events — kein PII, Inhalt
E2E-verschlüsselt).

## Ehrliche Grenzen (nicht verschweigen)

- **Metadaten:** log-frei senkt das Risiko, **garantiert** aber nichts allein —
  volle Garantie erst per **Mixnet** (viele unabhängige Betreiber).
- **IP:** nur der **Nutzer** kann sie sicher verbergen (**Tor**), nicht der
  Betreiber.
- **Inhalt:** durch E2E **garantiert blind** — das ist die starke, wahre Zusage.

*Anleitung, 2026-06-25. Gehört zu `notiz-toolpoint-relay.md`. Quellen-Wahl
strfry/Caddy ist austauschbar (nostr-rs-relay / khatru gehen genauso) — Prinzip
zählt: dumm, neutral, log-frei, prüfbar.*
