# Brief · Eigenes Netz: Relais und Netz-Code einstellbar (2026-10-13)

**Für die nächste Sitzung in Sage-Protokol.** Der Plan ist mit Klaus abgesprochen
(„Ja, genauso ist es richtig, wie du gesagt hast … wir machen es genauso, wie du
es geplant hast“). Gebaut ist noch **nichts**.

## Pflichtlektüre zuerst

1. `CLAUDE.md` (Sage) und `docs/NETZWEIT.md`
2. `docs/PULS.md`, oberster Eintrag (2026-10-13 · Eigenes Netz)
3. `docs/INTERFACES.md` §11 (Andock) und die Komponenten-Karten zu 05b und 23
4. dieser Brief

Vor jeder Arbeit: `git fetch origin --quiet && git checkout -B <zweig> origin/main`.

## Warum (Klaus' Worte)

> *„Für die Gäste … PWA-Toolpoint-Relais, und darüber sollen alle Apps laufen, die
> angeboten werden … Wenn ich aber meine eigenen PWA-Apps in meiner eigenen Firma
> verwenden möchte, müssen diese über ein anderes Relais laufen … sodass es keine
> Vermischung gibt.“*

> *„Jeder könnte ja so ein Relais bauen … ein eigenes Firmennetzwerk … Dafür ist es
> eigentlich gemacht, der SBKIM-Knoten und auch die Siegel und auch das Mycel.“*

> *„… die Vorbereitung dafür werden wir auf jeden Fall treffen, sodass jeder
> unabhängig von mir mit diesem Netz etwas anfangen kann.“*

## Was heute gilt (gemessen im Code, Stand `origin/main` 32c1add)

| Stelle | Stand |
|---|---|
| `src/modules/05b_nostr_relay.js` | `DEFAULT_RELAYS = ["wss://relay.family-projekt.de"]` (Z. 52). **`configure({ relays: [...] })` gibt es schon** (Z. 220) |
| `src/modules/23_rendezvous.js` | `var RDV_TAG = "sbkim-rdv"` (Z. 113), **fest**, `configure()` kennt ihn nicht. Karten gehen als `JSON.stringify(card)` im **Klartext** hinaus (Z. 568) |
| Verhalten der Apps | Mein Rezeptbuch lauscht nach dem Laden selbst am Relais und antwortet nur. Sende-Prüfer verbindet erst auf Tipp |
| Relais auf dem Server | offen, mit Grenzen seit 2026-08-19 (`Kimboard/tools/relais-grenzen.sh`). Dort steht ein `[authorization]`-Block (`pubkey_whitelist`, `nip42_auth`) **auskommentiert** für ein zweites Relais bereit |
| Vorbild für den Code | **Kim-sync** `raumOeffnen(code)`: Marke `ks-` + SHA-256(`kimsync-raum-v1:` + Code), Schlüssel AES-GCM 256 aus PBKDF2(Code, 150 000). Ohne Code findet man die Marke nicht, und der Inhalt ist unlesbar |

Folge heute: jeder, der eine von Klaus' Apps herunterlädt, landet über
`relay.family-projekt.de` im **selben** Raum `sbkim-rdv` wie Klaus' eigene Apps.

## Entschieden

1. **Keine neuen Repos, kein Neuinstallieren.** Dieselben Apps für alle. Die
   Trennung kommt aus einer **Einstellung je Installation**, nicht aus dem Code.
2. **`relay.family-projekt.de` bleibt das öffentliche Netz** und die Vorgabe. Es
   steht in jeder ausgelieferten App; umbenennen hieße Rollout und zwei
   Gäste-Netze, solange alte Kopien laufen.
3. **Eigenes Netz = Relais-Adresse + Netz-Code.** Die Adresse ist kein Geheimnis.
   Aus dem **Netz-Code** entstehen Raum-Marke und Schlüssel, wie in Kim-sync.
4. **Jeder kann sein eigenes Netz bauen**: eigenes Relais, eigener Name, eigener
   Code. Eine fremde Firma kann auch Klaus' Relais nehmen, mit eigenem Code (Weg A,
   späteres Angebot; dafür ein **drittes**, „Kunden-Relais“) oder ihr eigenes
   (Weg B).
5. **Firmen-Relais von Klaus**: zweiter Container auf dem Hetzner Cloud-Server,
   eigene Subdomain, `pubkey_whitelist` mit seinen Geräte-Schlüsseln.
6. Bezahlfunktion: **nicht** Teil dieses Auftrags (Gemeinschaftsvertrag mit einer
   befreundeten Firma, offen). Vorbereitet wird nur, dass ein Netz frei wählbar ist.

## Zu tun, in dieser Reihenfolge

### Schritt 1 · Kanon (diese Sitzung)

- **05b**: Relais-Liste aus der Netz-Einstellung übernehmen (`configure` steht
  schon). Ohne Einstellung: unverändert `relay.family-projekt.de`.
- **23**: Raum einstellbar (`roomTag` über `init`/`configure`), Vorgabe
  `sbkim-rdv`. Mit Netz-Code: Marke aus dem Code ableiten (eigenes Salz, z. B.
  `sbkim-netz-raum-v1:`), Karten und Fragen im eigenen Netz **AES-GCM-verschlüsselt**
  (Schlüssel aus PBKDF2(Code), eigenes Salz `sbkim-netz-schluessel-v1`).
  Im öffentlichen Netz bleibt alles, wie es ist.
- **Wo die Einstellung liegt**: je App eigener Speicher-Schlüssel (geteilte
  Adresse github.io!), z. B. über `SBKIM_DB_SUFFIX` gebildet. Der Code liegt nur
  lokal. Vorschlag: im IndexedDB der Schublade, nicht `localStorage` fremd lesbar.
  ⚠ Entscheidung der Sitzung, dokumentieren.
- **INTERFACES.md zuerst** nachziehen (heilige Tafel), dann Code.
- Proben + Gegenproben: ohne Einstellung byte-gleiches Verhalten · mit Code andere
  Marke · zwei Codes sehen einander nicht · ohne Code kein Klartext im Ereignis ·
  falscher Code liest nichts · ungültige Relais-Adresse (nur `wss://`) abgewiesen.

### Schritt 2 · Verbinden-Fenster (23-UI)

- Bereich **„Eigenes Netz“**: Name, Relais-Adresse, Netz-Code (Knopf „Neuen Code
  erzeugen“), „Zurück ins öffentliche Netz“.
- **QR-Code / Link** mit allen drei Angaben zum Übertragen auf weitere Geräte.
- ⚠ **Schutz gegen untergeschobene Netze**: vor dem Übernehmen aus Link/QR Adresse
  und Netzname deutlich zeigen und fragen. In der Leiste sichtbar, in welchem Netz
  man ist (öffentlich ⟷ Name).
- Den eigenen **Geräte-Schlüssel zum Kopieren** zeigen (für die Freigabeliste).
- Texte DE/EN wie das übrige Fenster.

### Schritt 3 · Verteilen

`node tools/kanon-verteilen.mjs --nur 05b_nostr_relay` bzw. `23_rendezvous`
(erst nachsehen, dann `--schreiben`), Pins und Cache je Träger, PRs, mergen, auf
`main` nachzählen.

### Schritt 4 · Firmen-Relais (Server, nicht in einer Sitzung ausführbar)

- Skript nach dem Muster von `Kimboard/tools/relais-grenzen.sh`: **Nachsehen-Gang
  als Vorgabe**, scharf nur mit `SCHARF=ja`, Sicherung vorher, sagt bei jedem
  Befehl, **auf welcher Maschine** er läuft (Hetzner Cloud-Server, Caddy im Docker).
- `[authorization]` mit `pubkey_whitelist`; `nip42_auth` nur, wenn das
  Relais-Programm es kann (vorher am Server prüfen).
- Eine Anleitung „Eigenes Relais aufstellen“ für Kunden aus demselben Skript.

## Antworten von Klaus (2026-10-13)

1. Relais „intern Family Project“ unter `wss://relay-intern.family-projekt.de`.
2. Mein Rezeptbuch lauscht im öffentlichen Netz weiter selbst. Im **eigenen** Netz soll jede App
   beim Öffnen automatisch verbinden (Schritt 2).
3. Erster Träger: Sende-Prüfer.

Schritt 1 ist gebaut (PULS 2026-10-13, Protokoll `docs/sessions/archiv/2026-10-13_eigenes-netz-schritt1.md`).

## Offene Fragen an Klaus (vor Schritt 1 gestellt, oben beantwortet)

1. Name und Adresse des Firmen-Relais (Subdomain)?
2. Soll das öffentliche Netz in **Mein Rezeptbuch** weiter **selbst lauschen**,
   oder überall erst nach einem Tipp verbinden (wie im Sende-Prüfer)?
3. Welche App zuerst als Probe-Träger (Vorschlag: Sende-Prüfer)?

## Benannte Grenzen (vorab)

- Wer den Netz-Code kennt, ist drin, wie bei einem WLAN-Passwort. Neuer Code heißt:
  auf allen Geräten neu eintragen.
- `pubkey_whitelist` schützt das **Schreiben**. Lesen schützt erst die
  Verschlüsselung (oder NIP-42, falls das Relais es kann).
- Ein Gerät, das im öffentlichen Netz eine Identität hatte, behält sie; was dort
  angekündigt war, wandert nicht mit.
- Welche der Apps überhaupt Mycel-Knoten sind, ist für Workflow PDF nicht geprüft.

## Abschluss-Befehl (für die nächste Sitzung)

PULS fortschreiben · Übergabeprotokoll in `docs/sessions/archiv/` · Forschungseintrag
in `Kimhub/forschung/sitzungen.json` (`tools/sitzung-eintragen.mjs`, `arm` Pflicht,
Spanne aus Reflog und letztem Commit gemessen) · Brief für die Folge-Sitzung als
Codeblock im Chat.
