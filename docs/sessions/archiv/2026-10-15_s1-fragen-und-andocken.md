# 2026-10-15 · S1 „Fragen unterschreiben" netzweit, Kuechenzettel und Demo angedockt

**Rolle:** Hauptsitzung, Sammel-Brief `BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, ab Schritt 4.

## Entscheide von Klaus (2026-10-15)
- Gruppe C: Kuechenzettel und die Demo andocken; papas-aktenschrank und Kochfreunde nicht.
- Demo: die öffentliche Fassung `Sage-Protokol/sbkim-demo/`, nicht das private Repo semantic-match-demo.
- S1: unsignierte Fragen höchstens 2 der 6 Antworten je Minute.
- Paper S: Quellenteil (was erforscht ist · was übernommen wird · was vorgeschlagen wird · warum), Internetseiten Perfect-Skin-Beauty, PWA-Toolpoint, family-projekt.de (Alis-Moderaum nicht, noch keine Internetseite), Browser und Knotennetz (Chrome, DuckDuckGo), Gegenlesen jeder Fassung im Chat.

## Getan
| Repo | PR | was |
|---|---|---|
| Sage-Protokol | #1106 | S1: INTERFACES, Modul 23, Siegel-Aspekt DE/EN, Bündel-Kopien, Probe + Gegenprobe |
| 26 Träger | je 1 | Modul 23 + 16 per `kanon-verteilen`, Pins, Cache-Bump |
| Kuechenzettel | #10 | als Knoten angedockt |
| kim-hub-company | #78 | Schubladen-Liste nachgetragen |
| Sage-Protokol | #1107 | `sbkim-demo/` angedockt, Register, Pläne, Brief, PULS |
| Kimhub | #385 | Forschungseintrag `2026-10-15-s1-fragen-und-andocken` |
| BookLedgerPro | #336 | Modul 03, 16, 23 nachgeholt (fehlte in beiden Rollouts) |
| Sage-Protokol | Nachtrag | PFLEGE-LISTE § 17, § 18, dieser Nachtrag |

Träger S1: Alis-Moderaum #74 · Auslieferung-Pruefer #55 · Company-Brain #26 · Jasons-Tresor #188 · Kim-Bell #74 · Kim-sync #21 · Kimboard #154 · Kimseek #94 · Mein-In-and-Out-Book #10 · Mein-Mixarium #251 · Mein-Rezeptbuch #440 · Mein-Tresor #136 · Mein-WorkFloh #269 · Muttis-Rezeptbuch #245 · PWA-Toolpoint #169 · Perfect-Skin-Beauty #74 · Perfect-Skin-Fashion #46 · Privat-Brain #107 · SB-KIMTool-Point #188 · Sende-Pruefer #82 · Tomys-Hub #248 · Workflow-Calculate #23 · Workflow-Needs #20 · Workflow-PDF #117 · family-project #361 · kim-hub-company #77.

## Gemessen
- `smoke_s1_fragen_signiert` 13 grün, `gegenprobe_s1_fragen` 7 gefangen · 0 durchgerutscht · 0 aus falschem Grund · 0 tote Anker; `gegenprobe_bau23r` weiter 10/10.
- Auf `main` nachgezählt: 26 von 26 Trägern mit `RDV_QUERY_UNSIGNED_MAX_PER_MIN = 2`, 25 mit dem Siegel-Aspekt (Company-Brain trägt kein Siegel-Modul). Der Verteiler meldet danach „0 hängen zurück".
- Kuechenzettel `knoten.test.mjs` 54 grün (1280/360/320 px), Gegenprobe 10/10; comm-core 33, shell.smoke 15.
- Demo `smoke_sbkim_demo_knoten` 49 grün, Gegenprobe 9/9.

## Schief gelaufen / gefunden
- Erster Probenlauf über die 26 Träger: 6 rot. Zwei echte Funde (Kim-sync nagelt die Cache-Version, In-and-Out-Book-Manifest `?v=`), vier aus der Umgebung: der gemeinsame Paket-Vorrat hatte eine zu neue `playwright-core` (sucht chromium-1248, hier liegt 1194), dazu zwei Wackel-Proben (family-project `smoke_kein_sprung`, Workflow-PDF `chrome.mjs`).
- Zweige heben: `git rev-parse origin/<zweig> 2>/dev/null` gibt in flachen Klonen den Namen selbst aus statt nichts. Der Push brach deshalb ab, bevor er etwas schickte; der alte Stand kam dann aus `git ls-remote`.
- Küchenzettel-Gegenprobe: K5 zählte die Kettenglieder und nahm K6 die Arbeit ab (aus falschem Grund); „width:auto fehlt" rutschte erst durch, weil kein Wächter maß, ob die Lampen in ihren Knopf passen. Beides nachgezogen.
- Die Demo-Probe fand einen Abruf von `raw.githubusercontent.com`: er kommt aus der eingebetteten Mycel-Karte (iframe), schon vor dem Andocken. B9 zählt nur die Seite selbst.
- Das Register nannte eine Listen-Kopie in `PWA-Toolpoint/tests/smoke.mjs`, die es dort nicht gibt. Berichtigt.

- **BookLedgerPro fiel aus beiden Rollouts des Tages.** Sein Vorgabe-Zweig auf GitHub ist `claude/general-discussion-x9xyk9`; der Klon setzte `origin/HEAD` darauf, und der Verteiler meldete nur „44 Commits hinter origin". Gefunden hat es `forschung-bauen.mjs` in Kimhub, das `origin/main` verlangt. `smoke_a5_antwortpfad` dort ist auch auf `main` rot (Modul 15), die CI fährt nur `run.mjs`.

## Nicht gemessen
Tablet; die ersten Sporen von Kuechenzettel und Demo; der Rückfall auf unsignierte Fragen zwischen zwei echten Geräten.

## Offen
- S2 braucht Klaus' Entscheid: Schwelle für „Bedeutung passt nicht zur Beschreibung" und was bei `embeddingSource: "content"` geschieht.
- Schritt 6: Gliederung Paper S mit Klaus abstimmen.
- Sporen von Kuechenzettel und Demo am Gerät erzeugen und im Mycel eintragen.
- Schritt 7 (Workflow-PDF `chrome.mjs`) weiter offen; heute einmal gehangen, danach grün.

## Spanne
Arbeitsbeginn am Zweig (Reflog) 15:25:12Z (Unix 1792077912), Stand dieses Protokolls 16:47:26Z (Unix 1792082846): **1 h 22 min**, in Unix-Zeit gerechnet.
