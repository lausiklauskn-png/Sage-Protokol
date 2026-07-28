# Übergabeprotokoll 2026-07-28 — Fork-Einordnung, netzweite Schlüssel-Prüfung, Copyright, Server-Sperre

## Rolle
Hauptsitzung. Auslöser: Klaus' Frage zu einem **Fork** seiner Apps („Apps von Charlie
gefolgt") — daraus gewachsen zu einer netzweiten Sicherheits- und Rechte-Durchsicht
über **alle 36 Repos** plus einem realen Server-Befund an `family-projekt.de`.

## Was getan

### 1. Fork eingeordnet (Ausgangsfrage)
`mirkosalvato1-ctrl` hat **drei** Repos geforkt: **Mein-Tresor** (letzte Woche),
**SB-KIMTool-Point** (vor 5 Tagen), **Mein-Rezeptbuch**. Befund: **harmlos.** Ein Fork
kopiert nur schon-Öffentliches, gibt keinen Konto-Zugriff, verändert das Original nicht
und bleibt dauerhaft als „forked from" markiert. Die im GitHub-Feed daneben stehenden
„Trend-Repositories" (`Shared-Claude-Chats`, `Claude-of-Duty`) sind **Werbung von
GitHub**, kein Bezug zu Klaus.

**Klaus' Folgefrage (Herkunft):** Der Weg *Seite → GitHub-Link → Fork* ist plausibel —
die Seiten verlinken nachweislich auf GitHub (family-project 2, SB-KIMTool-Point 2,
Mein-Rezeptbuch 1, Mein-Tresor 1 Link in HTML). Die drei Forks kamen **nacheinander über
Tage**, was für einen lesenden Menschen spricht, nicht für einen Absauger. **Aber:** ein
Fork kann **nicht** als Nebenwirkung eines App-Downloads entstehen — er ist immer ein
bewusster Knopfdruck. Diese Unterscheidung ist jetzt in CLAUDE.md festgehalten.

### 2. Netzweite Schlüssel-Prüfung — ALLE 36 Repos (Klaus' ausdrücklicher Auftrag)
Gescannt wurden **nur getrackte Dateien** (= das, was ein Fork wirklich bekäme), über
alle 36 Repos des Kontos, öffentliche **und** private:

| Gesucht | Ergebnis |
|---|---|
| `BEGIN … PRIVATE KEY` | **keiner** |
| Private Ed25519-JWK (`d`-Feld) | **keiner** — Sporen tragen nur `x` (öffentlich) |
| API-Token (GitHub/Anthropic/Google/Slack/AWS) | **keiner** |
| Hartcodierte Passwörter / `apiKey = "…"` | **keiner** |
| `.env` / `*.pem` / `*.key` | **keine** |

Drei Treffer waren **verifizierte Fehlalarme**: die `.gitignore`-Schutzregel selbst
(Jasons-Tresor, Mein-Tresor), die Zeile in `werkzeuge/andock.html`, die einen PEM-String
im Browser **baut** (kein Schlüssel in der Datei), und der Platzhalter
`ghp_XXXX…` in `family-project/server/freigabe-config.example.php`.
`SB-KIMTool-Point/sbkim/node_key.enc.json` ist **korrekt verschlüsselt**
(AES-256-GCM, PBKDF2-SHA256 600k) — ohne Klaus' Passwort wertlos.

Ein erster, zu grober Scan lieferte Zufallstreffer **in eingebetteten Base64-Bildern**
(`data:image/png;base64,…` enthält irgendwann jede Zeichenfolge). **Lehre für Folge-
Sitzungen:** Bei Secret-Scans über Single-File-PWAs **immer** `data:image` ausschließen
und überlange Zeilen filtern, sonst erzeugt der Scan Fehlalarm-Lawinen (3,6 MB Ausgabe).

### 3. Copyright netzweit vervollständigt (9 Repos, alle gemergt)
Bestand vorher: 21 Repos mit Vermerk (beide Rezeptbücher zusätzlich mit `_CR`-
Wasserzeichen), 22 mit `papas-aktenschrank` (trug bereits „© 2025 Klaus Nitzsche").

Ergänzt und **selbstständig gemergt** (Freibrief), je eine Kommentarzeile am Dateikopf
bzw. als README-Fußzeile — reiner Rechtsvermerk, keine Renderung, kein Funktionsbezug:

| Repo | PR | Ort |
|---|---|---|
| Company-Brain | #7 | `index.html` |
| Kuechenzettel | #3 | `index.html` |
| Kochfreunde *(öffentlich)* | #2 | `index.html` |
| ISD-Page-Entwurf | #14 | `index.html` (trug vorher nur three.js-Fremd-Copyright) |
| semantic-match-demo | #22 | `index.html` |
| yamilet-Promptgenerator | #4 | `index.html` |
| BookLedgerPro | #280 | `index.html` |
| mycel-karte | #6 | `index.html` |
| SP-FP-md-Speicher | #4 | `README.md` (kein HTML im Repo) |

Fünf Repos (`Kochfreunde`, `ISD-Page-Entwurf`, `semantic-match-demo`,
`papas-aktenschrank`, `yamilet-Promptgenerator`) lagen außerhalb des Sitzungs-Scopes und
wurden per `add_repo` + Clone dazugeholt.

**Bewusst ausgelassen** (leere Platzhalter, 0–2 Dateien, keine App): `Me-Mixarium`,
`Kimhub`, `Kim-sync`, `Muttis-Rezeptbuch-Seite`, `Meine-In-and-Out-Book` (0 Dateien).

**Klaus-Entscheid festgehalten:** Obfuskation ist **nicht** gewünscht und nicht sinnvoll
— Web-Code ist immer lesbar, und die Kopierbarkeit von Protokoll + Werkzeugen ist bei
SBKIM **gewollt** (SB-KIMTool-Point ist ausdrücklich der Hub für Forker). Schutz =
Copyright + Git-Historie.

### 4. Server-Befund + Sperre an `family-projekt.de` (der eigentliche Fund)
**Befund:** Die Caddy auf dem Hetzner-Cloud-Server führt **kein PHP aus** (kein
`php_fastcgi`). Der `file_server` liefert `.php`-Dateien deshalb **als Klartext** aus.
Da `/srv/family-project` ein `git clone` des Repos ist, waren `server/freigabe.php`,
`einreichung.php`, `marktplatz-api.php` und `freigabe-config.example.php` im **Quelltext
öffentlich lesbar**. Das `server/.htaccess` schützt dort **nicht** — Caddy ignoriert
Apache-Dateien.

**Wichtige Präzisierung (im Verlauf korrigiert):** Der **echte** Token war **nie**
offen. Laut `server/README.md` gehören die PHP-Endpunkte aufs **Hetzner-Webhosting
(Apache)**, wo die `.htaccess` greift; die echte `freigabe-config.php` existiert auf dem
Caddy-Server gar nicht (steht in `.gitignore`). Der Auffang `try_files … /index.html`
lieferte deshalb die Startseite aus — **Zufall, kein Schutz**. Es war also
**Quelltext-Einsicht, kein Token-Leck** → Härtung, kein Notfall.

**Gebaut (PR #118, gemergt):** `handle /server/* { respond 404 }` **vor** einem
`handle`-Auffangblock, in den das bisherige `try_files` + `file_server` gewandert ist.
Verhalten für alle anderen Pfade unverändert. Gleiche Änderung im Kern-Block von
`docs/DEPLOY.md` + neuer Abschnitt „Warum die Sperre nötig ist" + Prüf-Befehle.

**Belegt mit echtem Caddy v2.8.4** (Binary im Container geholt, lokal ausgeführt):

| Pfad | neu | alt (ohne Sperre) |
|---|---|---|
| `/` | 200 | 200 |
| `/assets/app.js` | 200 | 200 |
| `/server/freigabe-config.php` | **404**, kein Token | **200 MIT Token im Klartext** |
| `/server/freigabe-config.example.php` | **404** | **200 MIT Token im Klartext** |

`caddy validate` → `Valid configuration`. Die Gegenprobe beweist, dass die Sperre nötig
**und** wirksam ist.

**Live scharfgeschaltet (Klaus' Server, mit Klaus zusammen durchgeführt):**
Caddyfile liegt unter `/opt/relay/Caddyfile` (gemountet in Container `caddy`, daneben
`relay`; beide `restart: unless-stopped`). Sicherungskopie `Caddyfile.bak-2026-07-28`
angelegt, Sperre eingefügt, `caddy reload`, dann live geprüft:
`200 /` · `200 /assets/app.js` · **`404`** für alle drei `/server/`-Pfade. ✅

### 5. Server-Wartung (Nebenertrag)
Klaus' Vermutung, die 13 anstehenden Updates könnten von seinen Marktplatz-Tests
stammen, wurde geprüft und **widerlegt** — es waren ausnahmslos Ubuntu-Systempakete
(`libc6`, `libgcrypt20`, `iproute2`, `apport`, `sg3-utils`, `locales`, …). Updates
eingespielt (mit `NEEDRESTART_MODE=l`, damit die Seite währenddessen online blieb),
danach Neustart: Kernel **7.0.0-15 → 7.0.0-28**, beide Container automatisch wieder
oben, Seite 200, Sperre hat den Neustart überlebt. Der monatelang stehende Hinweis
„System restart required" ist erledigt.

## Was offen blieb
- **Nichts Blockierendes.** Alle 10 PRs dieser Sitzung sind gemergt.
- **Der `/server/`-Pfad auf dem Caddy-Server war nie funktional** (kein PHP-Handler) —
  die Marktplatz-Einreichung läuft über das Webhosting (`cjlb.your-vhost.de/formular/`).
  Falls jemand später erwartet, dass `family-projekt.de/server/…` etwas tut: tut es
  nicht, und das ist jetzt bewusst so.
- **Kosmetisch, bewusst nicht angefasst:** Caddy meldet beim Reload
  „Caddyfile input is not formatted" (Zeile 2, **Relay**-Block, von uns unberührt).
  `caddy fmt --overwrite` würde die ganze fremde Datei umschreiben — an einem laufenden
  Server ohne Grund nicht gemacht.
- Die Sicherungskopie `/opt/relay/Caddyfile.bak-2026-07-28` liegt auf dem Server.

## Nächster sinnvoller Schritt
1. **Marktplatz-Kette Ende-zu-Ende durchgehen** (Einreich-Endpunkt auf dem Webhosting:
   `einreichung.php` + `.htaccess` per WebFTP, `FP_MARKT_SUBMIT_ENDPOINT` in
   `assets/config/listings.js`) — das ist der noch ungeprüfte Teil der Kette und der
   Ort, an dem die echten Geheimnisse liegen.
2. **Auslieferungs-Brille auf die anderen Server-Pfade anwenden** — jedes Repo, das
   serverseitige Dateien mitliefert, auf dieselbe Frage prüfen: „Was gibt der Server
   davon als Klartext heraus?"
3. Regulär weiter in der Arbeitsliste `docs/PLAN_SEMANTIK_KRYPTO.md` (A1/A2 bzw. A3
   Medium-Härtung) — diese Sitzung hat daran nichts verändert.

## Tafeln berührt
- **`CLAUDE.md` § „Was du tust"** um drei Pflicht-Blöcke erweitert: **Auslieferungs-
  Brille** (statischer Server liefert alles als Text, `.htaccess` nur bei Apache,
  Auffang ≠ Schutz, Sperre belegen), **Drei Maschinen auseinanderhalten**
  (Termux/Cloud-Server/Webhosting, Prompt-Erkennung, `ssh root@<IP> '<befehl>'` als
  verwechslungsfeste Form) und **Fork ≠ Vorfall** (inkl. Klaus-Entscheid gegen
  Obfuskation).
- Keine Modul-Spec, kein `INTERFACES.md`, kein `PROTOCOL_VERSION` berührt.
- Kein Code in `src/` angefasst.
