# Übergabeprotokoll 2026-08-03 — Lampen-Leiste barrierefrei + Sage-Page-Bilder

**Rolle:** Bau-/Pflege-Sitzung. Kanon Modul 17 + 23 UI, netzweiter Rollout, Bild-Pflege.
**Branch:** `claude/lampen-leiste-blp-messung-2nhnf6`

## Auftrag

Zwei Aufgaben: (1) die Kontrast- und Berührungsziel-Meldungen an der SBKIM-Lampen-Leiste
im **Sage-Kanon** reparieren und byte-1:1 zurückholen, (2) BookLedgerPro am echten Server
nachmessen. Mitten in der Sitzung kamen Klaus' PageSpeed-Berichte für BookLedgerPro **und**
die Sage-Page dazu.

## Was gefunden wurde

### 1. Die 63 im Screenshot war der alte Stand

Klaus' Screenshot (Leistung 63) ist von **20:27:25**; `cover.webp` kam erst mit Commit
`49d4325` um **21:07:28** ins Repo. Zeitachse vor Diagnose — das hat eine falsche Fährte
gespart.

### 2. Das LCP-Bild wartete auf den Modulbaum (BookLedgerPro)

Klaus' Aufschlüsselung: TTFB 0 ms, Laden 150 ms, Ladedauer 150 ms, **Rendering 2.000 ms**.
Das Bild stand nur in `src/ui/intro.js` und konnte erst gemalt werden, wenn sechs Module
geladen **und ausgeführt** waren. Jetzt statisch im HTML; `intro.js` **übernimmt** dasselbe
`<img>` (früher LCP-Zeitpunkt bleibt, kein Versatz).

**Messanlage musste erweitert werden.** `tools/lh-messen-root.mjs` liefert von `127.0.0.1`
aus, also **ohne Latenz** — die Aufschlüsselung zeigte lokal 114 ms statt 2.000 ms. Erst mit
echter Drosselung (150 ms Rundreise, 1,6 Mbit/s, Prozessor vierfach) wurde der Unterschied
messbar, und zwar mit ±10 ms Streuung statt der halben Sekunde, um die die Lighthouse-Zahl
schwankt: **1.748 → 1.404 → 1.028 ms**.

### 3. Drei Mängel an der Lampen-Leiste, einer verdeckt den anderen

- Berührungsziele 54,5 × 18,6 px (Norm 24 × 24), kleine Knöpfe 18 × 18 px.
- Der 🌐-Knopf lag **auf** der LEBT-Lampe (nur 8,2 px frei) — daher meldete der Prüfer beide
  Elemente zugleich. Klaus' Entscheid: der Knopf rückt unter 560 px hoch.
- Erst als er nicht mehr auf der Leiste lag, wurde messbar, dass er in der App-Akzentfarbe
  schreibt: bei BookLedgerPro dunkles Petrol auf dunklem Grund, **1,35:1**.

Der Kontrast der Lampen-Beschriftung dagegen war **kein** neuer Mangel: BookLedgerPro trug
eine zwei Generationen alte Modul-17-Fassung mit `rgba(0, 0, 0, 0.45)`. 45 % Schwarz über
hellem Grund ergibt rechnerisch genau das `#8c8c8c`, das der Prüfer meldete — und gegen
dieses Grau erreicht **keine** helle Schrift 4,5:1 (Weiß schafft 3,4:1). Der Kanon hatte den
Fix seit 2026-08-01.

### 4. Beinahe-Regression beim Rollout

Mein-Rezeptbuch, Muttis-Rezeptbuch und Mein-Mixarium trugen einen **eigenen** Fix, der nie in
den Kanon zurückkam: app-eigene `localStorage`-Schlüssel (`WIDGET_SCOPE`, 2026-06-28). Ein
byte-1:1-Rollout hätte ihn ausgebaut. Zuerst in den Kanon geholt, dann gerollt.

Zwei Träger wurden **nur** über einen Inhalts-Abgleich aller `.js`-Dateien gefunden: Kim-Bell
und Mein-WorkFloh führen das Modul als `sbkim-floating-widget.js`. Suche nach Dateinamen
hätte sie übersehen. **Lehre für den Rollout-Skill: nach sha suchen, nicht nach Namen.**

### 5. Sage-Page: 16,2 MB Bilder

Meilenstein-Kacheln luden 1254 × 1254 große Bildschirmfotos (~2,2 MB je Stück), dargestellt
als 312 × 312 große Kachel-Hintergründe. Über den vorhandenen Chromium in WebP umgerechnet:
**16.236 KiB → 688 KiB**, LCP **48,8 s → 7,1 s**.

## Eigener Fehler

Beim Einfügen eines Erklär-Absatzes in `BookLedgerPro/index.html` rutschte der Text hinter
das schließende `-->`. Der Kommentar stand als sichtbarer Text im `<body>`, war das größte
Element und wurde zum LCP-Element — der Bericht sah dadurch **besser** aus (1.028 → 548 ms).
Nur die Gegenprobe hat es aufgedeckt. Ein Test in `BookLedgerPro/tests/run.mjs` fängt das
jetzt ab (Kommentar-Klammern + Übereinstimmung Vorabruf/`<img>`), mit Gegenprobe belegt.

## Beweise

`smoke_bau17` 38/38 · `smoke_bau23_rendezvous_ui` 91/91 (4 neue Proben, Gegenprobe: ohne Fix
4 rot) · `smoke_bau23_rendezvous` 59/59 · `smoke_bundle_connect` 21/21 · BookLedgerPro
`tests/run.mjs` 2157/2157 · netzweite Verifikation **29/29 Dateien in 15 Repos auf Kanon**.

Vorbestehende Fehlschläge, per Gegenprobe auf blankem `origin/main` belegt: SB-KIMTool-Point
114/2 (`kanon_import`, `spore_v02`), Privat-Brain `npm test` (fehlendes `playwright-core`;
dessen Drift-Guard ist 15/15 grün).

## Nicht geprüft

- **Klaus' Browser-Sichttest** überall.
- **Nachmessung am echten Server**: der Ausgangs-Proxy dieser Umgebung verweigert
  `github.io` (403). Alle Zahlen stammen von der Bau-Maschine.

## Nächster sinnvoller Schritt

**Sage-Page CLS 0,328.** Das ist jetzt der größte Posten (ein Viertel der Note) und der
Grund, warum die Leistung trotz LCP 48,8 s → 7,1 s nur von 44 auf 45 steigt. Der Sprung kommt
aus `div.wrap`; Verdacht auf die Google-Fonts-Einbindung (blockiert 780 ms). **Erst messen,
welches Element wann springt** — nicht raten.
