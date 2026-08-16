# Pflicht-Module — was ein SBKIM-Knoten braucht

**Verbindliche Liste. Wer eine App zum Knoten macht, arbeitet sie ab.**

Anlass: am **2026-08-16** meldete das Netz-Fenster von Alis Moderaum
„✗ Raum-Lesen fehlgeschlagen: Kein Nostr-Relais-Client (Modul 05b) verfügbar".
Alle Dateien lagen im Repo. Trotzdem war der Raum unlesbar — weil nirgends
stand, welche Module **geladen** sein müssen, und weil zwei Bauvorlagen
unvollständig waren. Klaus: *„Modul 5 und Modul 5b sind dann wohl auch
Pflichtmodule. Die müssen mit ergänzt werden in allen Repos."*

---

## Die zwei Listen — sie sind NICHT dieselbe

Das ist der Kern des Missverständnisses, das den Fehler möglich gemacht hat.

### A · Die acht, die das Siegel prüft

`src/modules/16_siegel.js` → `PFLICHT_MODULE`:

| # | Modul | Global | ohne es |
|---|---|---|---|
| 01 | Storage | `SbkimStorage` | keine Schublade, keine Identität |
| 02 | Spore | `SbkimSpore` | kein Ausweis |
| 03 | Embedding | `SbkimEmbedding` | kein Vektor, keine Bedeutung |
| 04 | Match | `SbkimMatch` | kein Vergleich |
| 05 | Anastomose | `SbkimAnastomose` | **kein Handshake** |
| **05b** | **Relais-Client** | `SbkimNostrRelay` | **kein Raum** — geprüft wird `subscribe` |
| 07 | Apoptose | `SbkimApoptose` | kein sauberer Rückzug |
| 15 | Membran | `SbkimMembrane` | kein Wächter |

Sind diese acht da, stellt sich das Siegel selbst aus (Bronze; Gold nach dem
ersten „established"-Handshake).

### B · Was ein KNOTEN darüber hinaus braucht

**Das Siegel prüft sie NICHT.** Bis zum 2026-08-16 gehörte **05b** in diese
Gruppe — und genau deshalb konnte ein Siegel golden leuchten, während der Raum
unlesbar war. Es steht jetzt in Liste A; hier bleibt der Rest:

| # | Modul | Global | ohne es |
|---|---|---|---|
| 16 | Siegel | `SbkimSiegel` | kein Abzeichen, kein Andock-Wizard |
| 17 | Widget | `SbkimWidget` | keine Lampen — und **keine Anker** für 15/16 |
| 23 | Rendezvous | `SbkimRendezvous` | keine lebende Visitenkarte |
| 23-UI | Netz-Fenster | `SbkimRendezvousUI` | kein „Mit dem Netz verbinden" |
| — | `noble-secp256k1` | (ES-Modul) | 05b kann nicht signieren |

**Zusammen: 13 Dateien.** Weniger ist kein Knoten, sondern eine App mit
Modulen darin.

> **05b ist am 2026-08-16 in Liste A gewandert** — Klaus' Entscheidung, am Tag
> des Befundes. Die Sorge davor war, das würde in den Repos, denen 05b fehlt,
> das Siegel **erlöschen** lassen. Nachgemessen wurde sie nicht bestätigt:
> **alle 22 Knoten-Repos laden 05b**. Die Aufnahme löscht also nirgends ein
> Siegel — sie verhindert nur, dass eines leuchtet, wo der Raum tot ist.
> Bewacht von `tests/smoke_bau16_pflicht_05b.mjs`, mit eingebauter Gegenprobe:
> **ohne** Relais-Client MUSS das Siegel ausbleiben, sonst ist die Probe wertlos.

---

## Der Klebstoff — fünf Dateien, app-eigen

Kein Kanon, kein Drift-Guard: sie **müssen** pro App verschieden sein.

| Datei | trägt |
|---|---|
| `storage-init.js` | den eigenen `DB_SUFFIX` |
| `rendezvous-init.js` | Knoten-Name, Bedeutungs-Beschreibung, Stichworte |
| `schutz-init.js` | `allowedOrigins`, `repoUrl`, `ribbonText` |
| `nostr-listen-init.js` | Empfangsmodus (lauschen, nie initiieren) |
| `siegel-inhalt.js` | den **Andock-Wizard** samt Identitäts-Wechsler |

---

## Die vier Fallen beim Einbau

Jede hat einmal Zeit gekostet. Alle vier sind heute in den Bau-Proben bewacht.

**1 · `window.SBKIM_DB_SUFFIX` muss im KOPF stehen.**
Modul 01 liest es **beim Laden**. Fehlt es, ist der Vorgabe-Name die geteilte
Schublade `sbkim` — und alle Apps liegen unter *einer* Adresse.
`storage-init.js` setzt den Wert zwar, aber **asynchron**: greift ein Modul
vorher zu, ist der geteilte Topf längst offen. Modul 01 nennt das in seinem
Kopf **Fall (B)**.
*Gesehen als: der Wizard zeigte die Beschreibung einer anderen App.*

```html
<script>window.SBKIM_DB_SUFFIX="<eigener-wert>";</script>   <!-- vor </head> -->
```

**2 · Modul 05b geht NICHT über die Nachlade-Kette.**
Es ist ein ES-Modul mit relativem Import auf `noble`. In der Kette (die
Skripte per `document.createElement` nachhängt) läuft es **nie**. Es braucht
eine eigene Zeile:

```html
<script type="module" src="./modules/05b_nostr_relay.js"></script>
```

**3 · Modul 17 steht VOR 15 und 16.**
Das Widget legt die Anker `#lamp-fremd` und `#sbkim-siegel-badge` an. Steht es
dahinter, hängen Lampe und Siegel **lautlos** ins Leere: die Seite sieht normal
aus, nur beides fehlt.

**4 · Alles gehört in den Offline-Vorrat.**
Der Service-Worker antwortet **zuerst aus dem Speicher**. Ein Modul, das nie im
Vorrat war, muss jedes Mal übers Netz — und offline gar nicht. Und: **wer eine
Datei aus `CORE` ändert, erhöht die `CACHE_VERSION`**, sonst liefert der
Service-Worker die alte Fassung weiter.

---

## Die Ladereihenfolge

```
03_embedding · 01_storage · storage-init · 04_match · 02_spore · noble
05_anastomose · 23_rendezvous · 23_rendezvous_ui · 17_floating_widget
07_apoptose · 15_membran · 16_siegel
nostr-listen-init · rendezvous-init · schutz-init · siegel-inhalt
```

Dazu **getrennt**, als ES-Modul: `05b_nostr_relay`.

Die Kette wird **nach** dem Seitenaufbau in der Leerlaufpause geholt
(`requestIdleCallback`), nicht als `<script src>` im Dokument — sonst drückt
sie die Messwerte, die öffentlich im Marktplatz stehen. Eine fehlende Datei
darf die Kette nicht anhalten (`s.onload = s.onerror = …`).

---

## Die Bauvorlagen

Das Rezept steht in [`docs/MYCEL-GESCHENKBOX.md`](MYCEL-GESCHENKBOX.md).
`family-project/werkzeuge/geschenkbox.html` **verlinkt direkt auf diese
Ordner** — sie kopiert sie nicht. Was hier besser wird, ist dort sofort drin.

**Die zwei Kisten sind absichtlich verschieden groß:**

| Vorlage | Umfang | kann ein Siegel? |
|---|---|---|
| `sbkim-bundle/` · **Stufe 1 „Verbinden"** | 9 Module | **nein — und das ist gewollt** |
| `sbkim-bundle-voll/` · **Stufe 2 „Voll-Knoten"** | 18 Module + `siegel-inhalt.js` | ja |

Wer nur mitreden will, soll nicht das ganze Vertrauens-Gesicht mitschleppen
müssen. **Stufe 1 darf deshalb nicht heimlich anwachsen** — am 2026-08-16 hat
eine Sitzung ihr 07/15/16/17 hinzugefügt, gut gemeint, und damit war die
Minimal-Kiste weg. Die Probe verhindert das jetzt in **beide** Richtungen.

**Der echte Fehler lag in Stufe 2:** ihr fehlte **Modul 07** — eines der sieben,
die Modul 16 fürs Siegel verlangt. Es stand in **keiner der beiden Tabellen des
Rezepts**; die Lücke war also nicht nur im Ordner, sondern schon in der
Anleitung. Ein Forker hätte die Kiste ausgepackt, alles richtig gemacht und
sich gefragt, warum kein Abzeichen kommt — **stumm, ohne Fehlermeldung**.
Dazu hing ihr `23_rendezvous_ui` eine Generation zurück.

`tests/smoke_bauvorlagen.mjs` prüft seitdem **Rezept und Kiste gegeneinander**:
jedes Modul ist da, byte-1:1, und das Rezept nennt es auch. Reift ein Modul in
`src/modules/`, wird es neu kopiert — nie am Ort abgewandelt.

---

## Beim Bauen abzuhaken

- [ ] 13 Kanon-Module byte-1:1 aus `src/modules/`, Drift-Guard nagelt jeden Fingerabdruck
- [ ] `window.SBKIM_DB_SUFFIX` im Kopf, eigener Wert, netzweit eindeutig
- [ ] 05b als **ES-Modul** mit eigener Zeile, nicht in der Kette
- [ ] Reihenfolge: 01 vor storage-init · **17 vor 15/16** · 16 vor siegel-inhalt
- [ ] Kette in der Leerlaufpause, fail-soft
- [ ] fünf Klebstoff-Dateien mit **eigenen** Werten (kein Vorlagen-Rest)
- [ ] Andock-Wizard vollständig, **mit Identitäts-Wechsler**
- [ ] `ribbonText` gesetzt — sonst bleibt das Wappen-Band leer
- [ ] alles im Offline-Vorrat, `CACHE_VERSION` erhöht
- [ ] Probe **und Gegenprobe** — ein Wächter ohne Gegenprobe ist nur ein grüner Haken
