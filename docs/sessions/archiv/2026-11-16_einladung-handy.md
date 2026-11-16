# Übergabe 2026-11-16 — Einladung am Handy, Knoten-Karte, Truhen-Drehrichtung

**Rolle:** Hauptsitzung · **Zweig:** `ccr-60df1e8b-fqbsl0` · dritter Abschnitt der Sitzung zu #1177

## Auftrag

Klaus' Sichttest am Handy, siehe PULS-Eintrag „Einladung am Handy …“.

## Getan

Siehe PULS-Eintrag. Dateien: `docs/einladung/index.html`,
`docs/einladung/vendor/video/scene-5-schluessel-tuer.mp4`, `…/wie-zwei-sich-finden.mp4`, `index.html`,
`assets/video/truhe-schluessel.mp4`, `tests/smoke_lebendig.mjs`, `tests/gegenprobe_lebendig.sh`,
`docs/PULS.md`, `docs/sessions/archiv/2026-11_puls-auslagerung-37.md`.

## Wie der Befund am Schlüssel entstand

Klaus meldete, der Schlüssel sei am Handy nicht zu sehen. In der Nachstellung bei 390 px stand das
Film-Element da und lief, zu sehen war nichts: der Kasten maß 0 × 0. Der Wächter „Film liegt im Depot,
lädt nicht vorab“ sah das nicht; `tests/smoke_startseite_bedienung.mjs` prüft an der Einladung die
Tür, nicht den Schlüssel. Eine Browser-Prüfung der Kastengröße gibt es weiter nicht (die neue Prüfung
liest die Stilregel).

## Nicht getan, mit Grund

- Erklärvideo für den Tour-Bildschirm der Startseite: zwei Tonspuren liegen vor (9,0 s und 11,8 s), kein
  Clip gestartet. Zwei neue Szenen (10 s und 13 s) kosten 161 Credits bei einem Guthaben von rund 317.
  Der Umbau nimmt viel Text von der Startseite; Drehbuch und Klaus' Ja stehen aus.
- Discovery mit Arthurs Stimme und mitlaufender Seite: nicht begonnen.
- „Sage in 6 Bildern“ kürzen: nicht begonnen; die Stelle ist auf der Startseite nicht unter diesem
  Wortlaut zu finden, gemeint ist vermutlich das Fenster „Was bringt mir das?“ mit dem Knopf
  „Vollständige Tour mit Live-Demo“.

## Offen

- Klaus' Blick am Handy auf Schlüssel, Tür-Film und Truhe.
- Forschungseintrag: in Kimhub `forschung/`.
