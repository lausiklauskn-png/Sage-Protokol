<!-- NOTIZ / PARKPLATZ (Klaus 2026-06-25): Architektur- und Entscheidungs-Notiz
     zur Brainstorm-Sitzung „eigenes Relay als Fundament des Toolpoint". Bewusst
     NICHT in eine Seite eingebaut, NICHT verlinkt — nur Notiz. Reine Logik.
     Nicht ohne Klaus' Wort verlinken/veröffentlichen. -->

# Notiz — Eigenes Relay als Fundament des Toolpoint (Relay-zuerst)

> Geerdeter Zwischenstand aus der Brainstorm-Sitzung 2026-06-25. Frage dahinter:
> „Wie server-los ist die Pinnwand wirklich — und was ist der größte ehrliche
> Hebel?" Antwort: **ein eigenes, dummes, neutrales Relay.**

## Der Bogen (wie wir hierher kamen)

- Start bei der Pinnwand-Verschlüsselung → „wie server-los ist das eigentlich?"
  → es hängt am **Relay**.
- **Mycel ist herren-los, aber nicht server-frei.** Ein Treffpunkt ist immer
  nötig. BitTorrent-Lehre: das *Tauschen* kann reines P2P sein, aber das
  *Sich-Finden* (Rendezvous) braucht einen festen Punkt. Echtes
  Browser-zu-Browser (WebRTC) taugt nur für **Live-Gespräche**, nicht für eine
  **asynchrone Pinnwand mit Fremd-Entdeckung** (niemand ist gleichzeitig online).
- **Fremde Relays = Metadaten-Leak + Spitzel-Risiko.** Selbst bei
  verschlüsseltem Inhalt sieht der fremde Betreiber: wer (Pubkey/IP), wann, wie
  oft, an wen. Das ist die eigentliche Schwäche, nicht der Inhalt.
- **Eigenes, dummes, neutrales Relay = größter realistischer Hebel.** Es
  verlagert die Metadaten vom Fremden zu Klaus und macht die bisher unbewiesene
  **Cross-Knoten-Suche** (Meilenstein-Lücke) mit echten, getrennten Knoten
  endlich zeigbar.

## Klaus' Entscheid (2026-06-25)

- **Relay zuerst** — vor Toolbox/Andock und vor dem Marktplatz.
- **Getrennte Räume auf einer Seite:** Relay-Raum (gratis/neutral,
  **Mycel-Schicht 1**) klar getrennt vom Marktplatz (kommerziell,
  **Pilz-Schicht 2**). Vier-Schichten-Lesart gewahrt (CLAUDE.md).
- **Heimat: SB-KIMTool-Point („Toolpoint")** —
  `lausiklauskn-png/SB-KIMTool-Point`.
- **Hosting: VPS** (siehe unten; Heim-Pi verworfen wegen Heim-IP-Sichtbarkeit +
  CGNAT-Falle + Bastelei).
- **Versprechen-Wortlaut: „server-los" beibehalten, ABER mit Erklärung** (siehe
  § Die zwei Versprechen + § Das dreistufige, prüfbare Versprechen).
- **Custom-Relay-Eingabe in der Pinnwand-UI: Folge-Bau** — jetzt nur das eigene
  Relay fest in den `RELAY_POOL`; ein frei eintragbares Feld für Forker kommt
  später (eigene Sitzung).
- **Relay-(Sub-)Domain-Name: noch offen** — hängt an der gewählten Domain.
  Platzhalter in der Anleitung: `relay.<deine-domain>`.

## Die zwei Versprechen sauber trennen (Kern-Klärung)

Das ist der Punkt, an dem die meisten „server-los"-Behauptungen unehrlich werden.
Hier bewusst getrennt:

- **App-Versprechen (unangetastet wahr):** Die Apps (Rezeptbuch, Mixarium, BLP,
  Tresor …) sind **local-first** — Daten liegen in der IndexedDB am Gerät und
  erreichen den Macher **nie**. Das Relay sieht App-Daten **nie**. Es trägt
  ausschließlich, was ein Nutzer **bewusst ins Netz schickt** (Pinnwand-Frage,
  Cross-Knoten-Suche, Briefkasten). Nichts wird „abgegraben" — nur
  Netz-Botschaften weitergereicht.
- **Netz-Transport war nie server-los** — heute läuft er über **fremde** Relays.
  Ein eigenes Relay *bricht* nichts; es **verlagert** die Metadaten vom Fremden
  zu Klaus. Für die Netz-Botschaften ist das eine Verbesserung, kein Rückschritt.

→ „Server-los" stimmt für die **App-Schicht** (deine Daten brauchen keinen
Server). Für die **Netz-Schicht** stimmt „herren-los": kein Vermittler rankt,
verkauft oder besitzt — aber ein dummer Treffpunkt ist da. Deshalb: Begriff
„server-los" behalten, **immer mit dieser Erklärung daneben.**

## „Sieht der Betreiber etwas?" — ehrliche Garantie-Lage

| Ebene | Garantie | Womit |
|---|---|---|
| **Inhalt** | **garantiert blind** (Mathematik) | E2E-Verschlüsselung — „selbst ich als Betreiber kann es nicht lesen". |
| **Metadaten** (wer/wann/wie oft) | **keine** Allein-Garantie | nur „log-frei + prüfbar". Volle Garantie erst per **Mixnet** (viele unabhängige Betreiber) — später. |
| **IP** | nur der **Nutzer** kann sie garantiert verstecken | **Tor** — nicht der Server-Betreiber. |

Ehrlich bleiben: ein einzelner Betreiber *könnte* theoretisch heimlich
mitschreiben. Die Antwort darauf ist nicht „vertrau mir", sondern **„prüf mich"**
(offene Konfig, siehe Anleitung) und langfristig **Mixnet** (Garantie aus
Verteilung statt aus Versprechen).

## Das dreistufige, prüfbare Versprechen (Wortlaut-Vorschlag)

Vorschlag für die Toolpoint-Seite (Relay-Raum). Wortlaut in der Bau-Sitzung der
Seite final schleifen:

1. **App-Daten bleiben am Gerät.** Was du in Rezeptbuch, Mixarium, dem Tresor
   speicherst, liegt in deinem Browser. Es erreicht uns nie. (local-first)
2. **Netz-Inhalte kann selbst der Betreiber nicht lesen.** Was du bewusst ins
   Netz schickst, ist Ende-zu-Ende verschlüsselt. Das Relay sieht nur
   Geheimtext. (E2E)
3. **Das Relay ist log-frei — und das ist nachprüfbar.** Die komplette
   Konfiguration ist offen einsehbar; du musst es nicht glauben. Für volle
   Anonymität (auch der IP) nutze Tor. (offene Konfig + ehrliche Grenze)

→ Aus „vertrau mir" wird „prüf mich".

## Hosting — Entscheidung VPS (begründet)

- **VPS (gewählt):** Hetzner / Netcup / Contabo / DigitalOcean ~4–5 €/Mo, oder
  Oracle Free Tier gratis. Domain ~10–15 €/Jahr. TLS gratis (Let's Encrypt).
  **Vorteil:** immer-an, IP von zu Hause getrennt, wenig Bastelei.
- **Heim-Pi (verworfen):** einmalig ~50–80 €, aber 24/7-Gerät, Port-Freigabe +
  **DynDNS**, **CGNAT-Falle** (viele Anschlüsse haben keine echte öffentliche
  IPv4), TLS-Bastelei, **Heim-IP sichtbar**. Für ein neutrales, vertrauens-
  würdiges Relay ungeeignet.
- **Tablet:** ungeeignet als Dauer-Server.

Konkrete Betreiber-Anleitung (VPS + Domain + TLS via Caddy + log-frei + prüfbar):
[`anleitung-eigenes-relay.md`](anleitung-eigenes-relay.md).

## Technischer Andock-Punkt (Pinnwand)

Die Pinnwand spricht **Nostr** (NIP-01, `kind:1`-Events, schnorr/secp256k1,
Tag `sbkim-frage-antwort-test`). Jedes Standard-Nostr-Relay (strfry, khatru,
nostr-rs-relay) trägt sie also.

- `RELAY_POOL` — `pinnwand/index.html:355` (heute 8 öffentliche, fremde Relays).
  **Hier wird die eigene Relay-URL föderiert dazugehängt** (neben den
  öffentlichen, nicht statt ihnen), sobald die Domain steht.
- **Grenze:** `pinnwand/index.html:364` filtert die gespeicherte Auswahl gegen
  den **festen** Pool (`saved.filter(u => RELAY_POOL.includes(u))`). Frei
  eintragbare Custom-Relays gehen daher heute **nicht** über die UI → Klaus'
  Entscheid: **Folge-Bau** (eigenes Eingabefeld für Forker später).

## Verifikation des Meilenstein-Beweises

`wss://`-Connect ok → Pinnwand so einstellen, dass **nur** das eigene Relay
aktiv ist → eine Frage absenden → **zweites Gerät** (ebenfalls nur eigenes
Relay) sieht die Frage → **zwei getrennte Knoten cross-node über das eigene
Relay**. Das ist genau der Hin-und-Zurück-Beweis, der im
[`MEILENSTEIN_SEMANTISCHE_SUCHE.md`](../MEILENSTEIN_SEMANTISCHE_SUCHE.md) noch
als „offen" steht.

## Was diese Sitzung NICHT konnte (offen für Folge)

- **Relay live aufsetzen** (Schritt 4) — wartet auf Klaus' gemieteten VPS +
  registrierte Domain. Anleitung liegt, Ausführung ist ein gemeinsamer Schritt.
- **Pinnwand-URL eintragen** (Schritt 5) — wartet auf die fertige `wss://`-URL
  (Domain noch offen). Andock-Punkt oben exakt markiert.
- **Toolpoint-Seite, getrennte Räume** (Schritt 6) — braucht erweiterten
  Repo-Zugriff auf `SB-KIMTool-Point` (diese Sitzung ist auf `sage-protokol`
  beschränkt). Erst Datei-für-Datei-Audit (Andock-Wizard-Stand, `status.json`,
  was leer ist), DANN bauen.

*Notiz, 2026-06-25. Verwandte (ebenfalls unverlinkt): `notiz-briefkasten-pinnwand.md`,
`notiz-pinnwand-verschluesselung.md` (PR #450), `notiz-bauplan-live-suche.md`,
`anleitung-eigenes-relay.md`. Sachstand: `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`.*
