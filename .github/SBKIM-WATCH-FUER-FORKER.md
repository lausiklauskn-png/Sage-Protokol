# SBKIM Netz-Wächter — kopierbar für SB·KIMTool·Point & Jasons-Tresor

Damit „alle drei gleichzeitig in die Briefkästen schauen", braucht **jeder** Knoten
dieselbe Action — jeweils auf die **anderen zwei** Peers gerichtet. Sage hat sie schon
(`.github/workflows/sbkim-watch.yml` + `.github/sbkim-watch.mjs`). Hier die fertigen
Varianten für die anderen beiden Repos. Pro Repo: **beide Dateien** an dieselben Pfade
legen, committen — fertig. Es wird nur dann ein Issue geöffnet, wenn ein Peer eine
höhere `seq` hat als der eigene `ack`. Kein Lärm, wenn nichts passiert.

> Voraussetzung: jeder Knoten pflegt sein eigenes `sbkim/SIGNAL.json` (INTERFACES §11.6).
> Der Wächter vergleicht Peer-`seq` gegen den eigenen `ack`-Block darin.

---

## Repo SB·KIMTool·Point — `.github/sbkim-watch.mjs` (nur CONFIG-Block zeigen)

Nimm Sages `.github/sbkim-watch.mjs` 1:1 und ersetze NUR den CONFIG-Block durch:

```js
const SELF = "SB-KIMTool-Point";
const SELF_SIGNAL = "sbkim/SIGNAL.json";
const PEERS = [
  {
    name: "Sage-Protokol",
    signal: "https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/SIGNAL.json",
    mailbox: "https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/AUSTAUSCH.md",
  },
  {
    name: "Jasons-Tresor",
    signal: "https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/SIGNAL.json",
    mailbox: "https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/AUSTAUSCH.md",
  },
];
```

## Repo Jasons-Tresor — CONFIG-Block

```js
const SELF = "Jasons-Tresor";
const SELF_SIGNAL = "sbkim/SIGNAL.json";
const PEERS = [
  {
    name: "Sage-Protokol",
    signal: "https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/SIGNAL.json",
    mailbox: "https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/AUSTAUSCH.md",
  },
  {
    name: "SB-KIMTool-Point",
    signal: "https://raw.githubusercontent.com/lausiklauskn-png/SB-KIMTool-Point/main/sbkim/SIGNAL.json",
    mailbox: "https://raw.githubusercontent.com/lausiklauskn-png/SB-KIMTool-Point/main/sbkim/AUSTAUSCH.md",
  },
];
```

## `.github/workflows/sbkim-watch.yml` (für beide Repos identisch)

Nimm Sages `.github/workflows/sbkim-watch.yml` **unverändert** — sie ist repo-neutral
(checkt das eigene Repo aus, ruft `node .github/sbkim-watch.mjs`, öffnet bei Neuem ein
Issue im eigenen Repo). Cron-Zeit (`0 */6 * * *` = alle 6 h) nach Geschmack anpassen.

---

## Warum „alle drei gleichzeitig" so erreicht wird

- Sages Wächter schaut auf **SB·KIMTool + Jasons**.
- SB·KIMTools Wächter schaut auf **Sage + Jasons**.
- Jasons' Wächter schaut auf **Sage + SB·KIMTool**.

→ Jeder Knoten wird unabhängig + zeitgesteuert geweckt und sieht jeden fremden Bau,
auch wenn Klaus nicht da ist. Bei Neuem: ein Issue im eigenen Repo (das ist die
Rückmeldung, auf die Klaus / die nächste Sitzung reagiert). Bei „nichts Neues":
**keine Rückmeldung** — genau wie gewünscht.

## Test vor dem Verlassen (lokal, optional)

```bash
node .github/sbkim-watch.mjs          # menschlesbar; exit 0
# oder manuell im Actions-Tab: „Run workflow"
```

---

## Seiten-Knopf „📬 Briefkasten" (für die Landing-Page jedes Knotens)

Zusätzlich zur zeitgesteuerten Action: ein Knopf **oben neben den Lampen**, der
**live im Browser** prüft (kein Token, keine Action, instant — `raw.githubusercontent.com`
erlaubt CORS). Genau das, was man während des aktiven Arbeitens braucht.

**1. Knopf in die Topbar (neben die Lampen):**
```html
<button type="button" id="netz-check-btn" class="netz-check-btn"
        title="Briefkästen der anderen Knoten jetzt prüfen">📬 <span class="ncb-label">Briefkasten</span></button>
```

**2. Ergebnis-Popup + Script vor `</body>`** — wie in Sages `index.html`
(Block „Netz-Briefkasten-Knopf"). **Nur den `PEERS`-Array anpassen** auf die jeweils
anderen zwei Knoten. SB·KIMTool z.B.:
```js
var PEERS = [
  { name: 'Sage-Protokol',  signal: 'https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/SIGNAL.json',  mailbox: 'https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/sbkim/AUSTAUSCH.md' },
  { name: 'Jasons-Tresor',  signal: 'https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/SIGNAL.json',  mailbox: 'https://github.com/lausiklauskn-png/Jasons-Tresor/blob/main/sbkim/AUSTAUSCH.md' }
];
```
Den `SELF_SIGNAL`-Pfad (`sbkim/SIGNAL.json`, relativ) unverändert lassen — er liest den
eigenen `ack` von der eigenen Pages-URL.

**Cron-Takt (in `sbkim-watch.yml`):** 6 h als Standard; die `*/15`-Zeile einkommentieren,
solange aktiv gebaut wird, danach wieder zu. Der Seiten-Knopf macht 15-Min-Polling
während aktiver Arbeit ohnehin meist überflüssig (instant > warten).
