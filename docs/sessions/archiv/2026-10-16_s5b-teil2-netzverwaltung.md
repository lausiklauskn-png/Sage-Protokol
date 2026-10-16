# Übergabe · S5b Teil 2: Netz-Verwaltung als eigene Seite, „Empfehlen“, Empfehlung kommt von selbst an (2026-10-16)

**Rolle:** Hauptsitzung. Auftrag: Sammel-Brief `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`,
erster offener Schritt 5b (Teil 2).

## Startprüfung

Sitzungsliste: die vorige Sammel-Brief-Sitzung war beendet. Ihre Übergabe #1137 war gemergt, danach
fiel sie mit „Prompt is too long“ aus. Ihr Zweig trug keine eigenen Commits. Kein offener PR in Sage.

## Entscheide von Klaus in dieser Sitzung

| Frage | Antwort (2026-10-16) |
|---|---|
| Wo stehen die Listen? | eine **eigene Seite**, nicht im Studio („vom Umfang viel zu groß“); Klicks für Widerruf, Widerruf rückgängig, Bürgschaft erteilen; klar machen, wie andere Nutzer aus ihrer App bürgen |
| Welches Wort statt „Bürgen“? | gefragt mit vier Vorschlägen (Empfehlen · Partner · Freundeskreis · Vertraut) → **Empfehlen** |
| Wie kommt die Empfehlung an? | gefragt (von selbst · Text kopieren · beides) → **von selbst über den Raum** |

## Getan

| Was | Wo |
|---|---|
| Tafel zuerst: § Modul 23 „S5b Teil 2“, § Modul 23b | `docs/INTERFACES.md` |
| Netz-Verwaltung (vier Listen, Suche, Knöpfe, `page()`, Spore-Prüfung) | `src/modules/23b_netzverwaltung.js` (neu) |
| Eigene Seite in Sage, langer Druck aufs © | `netz-verwaltung.html`, `assets/studio-sage.js`, `index.html` |
| Vorrat `issued`, Karte trägt ≤ 8, Abholen in `discover()` | `src/modules/23_rendezvous.js` (+ Bündel) |
| Wort „Empfehlen“ (DE/EN) | `src/modules/23_rendezvous_ui.js`, 23b (+ Bündel) |
| Siegel-Aspekt S5b Teil 2 | `src/modules/16_siegel.js` (+ Bündel) |
| Proben, Gegenproben | `tests/smoke_23b_netzverwaltung.mjs`, `tests/smoke_23b_netzverwaltung_ui.mjs`, `tests/gegenprobe_23b_netzverwaltung.mjs`, `tests/smoke_s5b_empfehlung_ankommt.mjs`, `tests/gegenprobe_s5b_empfehlung_ankommt.mjs` |
| Alte Proben auf das neue Wort und `picked` | `tests/smoke_s5_buergen.mjs`, `tests/smoke_s5b_buergen_maerkte.mjs`, `tests/smoke_netz_eigen.mjs` |
| Anleitung für Nutzer | `docs/ANLEITUNG_EMPFEHLEN.md` |
| Rollout 16/23/23-UI | 29 Träger, je ein PR (Liste in `docs/PULS.md`) |
| Studio in beiden Märkten (`nodeId`, Spore prüfen, Knopf zur Seite, eigene Probe + Gegenprobe) | PWA-Toolpoint #175, family-project #367 |

## Gemessen

- 23b Kern 42 grün · Browser (Chromium) 13 grün · Gegenprobe 31/31.
- Übergabe 11 grün · Gegenprobe 10/10.
- S5 70 · S5b 44 · `netz_eigen` 69 · 23-UI 102 · `bauvorlagen` 55 · `bundle_connect` 25.
- Träger: Proben grün; rot und auf `main` genauso: BookLedgerPro `smoke_a5_antwortpfad`,
  Perfect-Skin-Beauty `smoke_sprachen`, family-project `smoke_kein_sprung`. Sage
  `smoke_service_worker_parst` rot nur mit zwei Nachbar-Klonen (Pflege #26).
- Auf `main` selbst nachgezählt: 29/29 mit `RDV_ISSUED_PER_CARD_MAX = 8`, 28 mit Siegel-Aspekt
  (Company-Brain ohne Siegel), beide Märkte mit 23b und `netz-verwaltung.html`.

## Was schiefging (Befund)

1. Erster Lauf 38 grün, Gegenprobe 25 von 29: drei blinde Wächter (Reihenfolge der Ablage
   verdeckte zwei Fälle, eine Sabotage war schlecht gebaut) und ein Fall auf der falschen Zeile.
2. Beim Nachziehen fand die Probe zwei echte Fehler in 23b: zwei Empfehlungen aus derselben
   Sekunde → die zuerst gelesene gewann; ein untergeschobener Zettel mit falscher Unterschrift
   stellte das angezeigte Ablaufdatum, solange daneben ein echter lag. Beide behoben.
3. `window.open` aus dem Zeitgeber des langen Drucks: am Tablet als Popup gesperrt (Fingerdruck
   gibt die Erlaubnis erst beim Loslassen). Ersetzt durch denselben Tab, vor dem Merge.
4. Im eigenen Netz ist die Karte verschlüsselt; die Probe fand `issued` darum zuerst nicht (E2/E9
   rot, obwohl das Abholen lief). Gemessen wird jetzt im offenen Mycel.
5. BookLedgerPro zum vierten Mal auf dem alten Vorgabe-Zweig geklont (Pflege #17).

## Nicht gemessen

Tablet; zwei echte Geräte, zwischen denen eine Empfehlung von selbst ankommt; ob die echte
Identität der Märkte auf der neuen Seite ankommt (in der Probe „Noch keine Identität“).

## Offen

- Kennungen (`nodeId`) der Markt-Einträge eintragen: das kann nur Klaus, im Studio, mit „Spore prüfen“.
- Hinweis vor dem Ablauf im Siegel der App (bisher im Netz-Fenster und auf der Seite).
- Sammel-Brief Schritt 6 (Paper S): Klaus' Gegenlesen.
- Funde: Pflege-Liste #25–#30.

## Nächste Sitzung

Weiter bei Schritt 6.
