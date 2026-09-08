# Übergabeprotokoll · 2026-09-08 — Der geteilte Vorrat

**Rolle:** Mess-Sitzung. **Kein Code an einer App geändert.**

## Auftrag

Klaus, 2026-09-08, nach einem Befund in `kim-hub-company`: *erst messen, dann
entscheiden* — und die Hart-Neuladen-Knöpfe (⟳) ausdrücklich mit hinein.

## Was getan wurde

| | |
|---|---|
| `tools/vorrat-scan.mjs` | zählt gegen `origin/main` aus, wer fremde Vorräte löscht — entschieden am **Filter**, nicht am Löschen |
| `tests/vorrat_wirkung.mjs` | stellt die Wirkung an zwei **echten** Apps nach, beide Sorten, je mit Kontrolle |
| `docs/BEFUND_geteilter-vorrat.md` | der Bericht |
| `docs/BEFUND_geteilter-vorrat_tabelle.md` | die vollständige Tabelle, je Depot mit Belegzitaten |
| `docs/PULS.md` | fortgeschrieben |

## Ergebnis

**Wirkung, gemessen:** `Kuechenzettel` nur zu öffnen löscht den Vorrat von
`mycel-karte`. Mit Präfix-Filter bleibt er. Ein Klick auf ⟳ in `mycel-karte`
löscht den Vorrat von `Kuechenzettel` — bei stillgelegter Sorte A, Kontrolle
grün.

**Verbreitung, 33 Depots gegen `origin/main`:** Sorte A in 23 Depots (27
Stellen), Sorte B in 22 (36 Stellen). Richtig gefiltert: 4 Depots, 8 Stellen.

## Was NICHT gemessen wurde

- **Welche Apps denselben Ursprung teilen.** 3 von 33 sind über CNAME belegt,
  **30 stehen als „ungeprüft"**. Der Egress-Proxy sperrt `github.io`, die
  Pages-Einstellung ist nicht lesbar. Diese Zeilen beantwortet Klaus.
- **Ob ein Nutzer den Ausfall bemerkt.** Ein Vorrat füllt sich wieder; verloren
  geht die Offline-Fähigkeit bis zum nächsten Online-Besuch, keine Datei.

## Zwei Fehler im eigenen Werkzeug

1. Die erste Fassung **riet die Auslieferung aus Prosa** — zu eng bei
   `Company-Brain` (eine Beugung: „eigen**en** Adresse"), zu weit bei
   `Kimhub`/`Sage` (das Wort *Hetzner* in der Drei-Maschinen-Regel). Ein Muster,
   das Wortformen trifft statt Aussagen, ist keine Messung. Seitdem wird
   zitiert statt geschlossen.
2. Ein `grep` auf `caches.delete` hätte `Tomys-Hub` mitgezählt — das einzige
   Depot, das es durchgehend richtig macht.

## Prüfstand

`npm test` → **93 grün · 0 rot · 0 nicht lauffähig**, eigener Rückgabewert 0.
`node tests/vorrat_wirkung.mjs` → 7 Zusicherungen, alle wie erwartet, Rückgabewert 0.

## Nächster sinnvoller Schritt

Klaus beantwortet die 30 ungeprüften Ursprungs-Zeilen. Danach eine
**Bau-Sitzung**: den Präfix-Filter aus `Tomys-Hub` kopieren, je Repo ein PR mit
Gegenprobe. Nicht erfinden — das Muster steht im Netz schon an vier Stellen.
