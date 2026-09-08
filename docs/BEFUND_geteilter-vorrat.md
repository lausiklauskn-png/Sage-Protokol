# Der geteilte Vorrat — was die Apps einander löschen

**Gemessen am 2026-09-08.** Werkzeuge: `tools/vorrat-scan.mjs` (Code auszählen),
`tests/vorrat_wirkung.mjs` (Wirkung nachstellen). Die vollständige Tabelle steht
in [`BEFUND_geteilter-vorrat_tabelle.md`](BEFUND_geteilter-vorrat_tabelle.md).

**Kein Code wurde geändert.** Dieser Bericht misst; er repariert nicht.

---

## Der Mechanismus

`caches` gehört dem **Ursprung**, nicht dem Pfad. Ein Service-Worker unter
`…/meine-app/` steuert zwar nur seinen Pfad, darf aber jeden Vorrat des ganzen
Ursprungs aufzählen und löschen.

Der übliche Aufräum-Ausschnitt tut genau das:

```js
caches.keys().then(ks => Promise.all(
  ks.filter(k => k !== MEIN_VORRAT).map(k => caches.delete(k))))
```

`k !== MEIN_VORRAT` lässt **alle anderen** durch — auch die fremden.

Es ist dieselbe Falle wie beim DB-Suffix, eine Ebene höher: ein Namensraum, der
der **Adresse** gehört und nicht der App.

---

## Was gemessen wurde (Wirkung, an echten Apps)

Zwei von Klaus' Apps, aus `origin/main` ausgecheckt, unter **einem** Ursprung
ausgeliefert (ein Server, zwei Unterpfade), headless in Chromium.

### Sorte A — der Service-Worker, läuft von allein

| Lauf | Ergebnis |
|---|---|
| `mycel-karte` installieren | Vorrat `mycel-karte-v17` liegt an |
| `Kuechenzettel` **nur öffnen** | `mycel-karte-v17` **ist weg** |
| dasselbe, Kuechenzettels Filter auf Präfix umgestellt | `mycel-karte-v17` **bleibt** |

Die dritte Zeile ist die Gegenprobe. Ohne sie wäre „bestätigt" auch dann das
Ergebnis, wenn der Vorrat aus einem anderen Grund verschwindet.

### Sorte B — der Hart-Neuladen-Knopf (⟳)

| Lauf | Ergebnis |
|---|---|
| `Kuechenzettel` installieren | Vorrat `kuechenzettel-v1` liegt an |
| `mycel-karte` öffnen, Sorte A stillgelegt (**Kontrolle**) | `kuechenzettel-v1` **steht noch da** |
| ⟳ in `mycel-karte` klicken (`#reloadBtn`) | `kuechenzettel-v1` **ist weg** |

⚠ Die mittlere Zeile ist nicht Zierde. mycel-kartes eigener Worker löscht
selbst schon alles; ohne die Stilllegung wäre nicht zuzuordnen, **wer** gelöscht
hat. Erst die Kontrolle macht die dritte Zeile zu einer Aussage über den Knopf.

**Der Knopf ist beschriftet mit „Aktualisieren / Cache leeren & neu laden".** Er
leert nicht den Cache dieser App, sondern den aller Apps derselben Adresse.

---

## Was gemessen wurde (Verbreitung, gegen `origin/main`)

33 Depots, gelesen aus `origin/main` — nicht aus den Klonen.

| | Depots | Stellen |
|---|---|---|
| **Sorte A** (Service-Worker, läuft von allein) | **23** | 27 |
| **Sorte B** (⟳ / Knopf) | **22** | 36 |
| richtig gefiltert (Präfix) | 4 | 8 |

**Sorte A in:** Alis-Moderaum · BookLedgerPro · Company-Brain · Jasons-Tresor ·
Kim-Bell · Kimboard · Kimhub · Kimseek · Kuechenzettel · Mein-Mixarium ·
Mein-Rezeptbuch · Mein-Rezeptbuch-Page · Mein-Tresor · Mein-WorkFloh ·
Mein-Workfloh-Page · Muttis-Rezeptbuch · PWA-Toolpoint · Privat-Brain ·
SB-KIMTool-Point · Sage-Protokol · family-project · kim-hub-company ·
mycel-karte.

**Ein Präfix-Filter steht schon in:** Kimboard · Privat-Brain · Sage-Protokol ·
Tomys-Hub — an je einer Stelle, nicht überall im selben Depot.

### Die Lösung liegt im Haus

`Tomys-Hub/bookledger/sw.js` und `…/promptgenerator/sw.js`:

```js
ks.filter(k => k.startsWith('yami-bookledger-') && k !== CACHE)
```

**Präfix statt Ungleichheit.** Kein fremdes Muster — es steht im Netz schon an
vier Stellen und ist nur nicht überall angekommen.

---

## ⚠ Was NICHT gemessen wurde

**Welche Apps wirklich auf demselben Ursprung ausgeliefert werden.** Von einer
Sitzung aus ist das nicht nachsehbar: der Egress-Proxy sperrt `github.io`
(`connect_rejected`), und die Pages-Einstellung geben die GitHub-Werkzeuge nicht
her.

Belegt ist nur, was eine `CNAME` trägt — **3 von 33**. Die übrigen **30 stehen
als „ungeprüft"**, nicht als „geteilt".

Eine fehlende `CNAME` beweist nichts. Zwei Gegenbeispiele:

- `Company-Brain` — *„Läuft unter einer eigenen Adresse
  (`company-brain.family-projekt.de`)"*, keine CNAME im Depot.
- `family-project` — läuft auf dem Hetzner-Server über Caddy, **und** nennt
  zusätzlich eine Pages-Vorschau
  (`https://lausiklauskn-png.github.io/family-project/`). Es könnte also
  **beides** sein.

Die Tabelle zitiert je Depot die Doku-Zeilen, die eine Adresse nennen — als
Belegstelle, nicht als Urteil.

**Auch nicht gemessen:** ob ein Nutzer den Ausfall bemerkt. Ein Vorrat füllt
sich beim nächsten Online-Besuch wieder; verloren geht keine Datei, sondern die
Offline-Fähigkeit bis dahin.

---

## Zwei Fehler im Messwerkzeug selbst, beide gefunden und behoben

**1 · Die erste Fassung riet die Auslieferung aus Prosa** und lag in **beide**
Richtungen daneben:

| | |
|---|---|
| zu eng | `Company-Brain` galt als „geteilt" — der Ausdruck suchte „eigene Adresse", in der Datei steht „eigen**en** Adresse". Eine Beugung. |
| zu weit | `Kimhub` und `Sage-Protokol` galten als „ungeprüft", weil ihre `CLAUDE.md` das Wort *Hetzner* enthält — in der Drei-Maschinen-Regel. |

Ein Muster, das Wortformen trifft statt Aussagen, ist keine Messung. Seitdem
wird **zitiert statt geschlossen**.

**2 · Ein `grep` auf `caches.delete` hätte `Tomys-Hub` mitgezählt.** Entschieden
wird am **Filter**, nicht am Löschen. Das Werkzeug liest deshalb das Umfeld
jeder Fundstelle und gibt den Filter im Klartext aus.

---

## Nachstellen

```bash
cd Sage-Protokol && npm install     # einmalig je Container
node tools/vorrat-scan.mjs          # die Tabelle
node tests/vorrat_wirkung.mjs       # die Wirkung, beide Sorten
```
