# PULS-Auslagerung 7 (2026-08-26)

**Wortwörtlich ausgelagert aus `docs/PULS.md`.** Nichts gekürzt, nichts
zusammengefasst, nichts umformuliert.

Die Datei stand bei 2.833 Zeilen, hundertsiebenundsechzig unter der Grenze von
3.000. Die Schutz-Klausel im Anker sagt: **auslagern statt kürzen**, und die
Grenze nicht herabsetzen. Ausgelagert sind die ältesten noch enthaltenen
Sitzungs-Einträge, beide vom **19.08.2026**.

> Diese Auslagerung geschah **vor** dem Schreiben des neuen Eintrags, nicht
> danach. Der Brief für diese Sitzung hatte genau darauf hingewiesen: wer viel
> zu schreiben hat, lagert vorher aus.

Damit ist der älteste Eintrag, der in `PULS.md` selbst steht, der vom
**23.08.2026**. Alles davor liegt in dieser Reihe von Auslagerungen, und die
Git-Historie behält ohnehin jede Fassung.

---

## Stand 2026-08-19 (Bau) — 🧹 Aufräumen, ohne Arbeit zu verlieren

**Rolle:** Bau-Sitzung. Zweig `claude/firma-demo-knotennetzwerk-4hkxun`.

**Anlass:** Klaus' Tablet-Speicher läuft voll und macht Probleme. Seine Bedingung
war die eigentliche Bauvorschrift — *„wo ich aber auch sehe, dass ich Dinge
lösche, die ich nicht löschen möchte."*

**Gebaut:** `tools/aufraeumen.sh` (drei Gänge: nachsehen · GC · scharf) für die
Repo-Klone in Termux, und `tools/speicher.html` für die Browser-Vorräte aller
Apps auf derselben Adresse. Dazu `tests/smoke_aufraeumen.mjs` (22 Prüfungen an
echten Git-Repos), `tests/smoke_speicher_seite.mjs` (14 Prüfungen im echten
Chromium) und `tests/gegenprobe_aufraeumen.sh` (14 eingebaute Fehler, **alle
gefangen**). Suite: **82 grün, 0 rot, 0 nicht lauffähig.**

**Drei Befunde, die die eigenen Proben gefunden haben:**

1. **Das Wartewort stand im Fortschrittstext.** Die Seite meldete „Wird
   gelöscht …", die Probe wartete auf „gelöscht" — und feuerte mitten im
   Löschen. Dieselbe Falle wie in Kimboard. Behoben auf beiden Seiten: die Seite
   sagt jetzt „Räume auf …" / „Fertig: …", die Probe wartet auf die Bedingung.
2. **Eine Probe, die immer alles anhakt, misst die Auswahl nicht.** Der
   sabotierte Löschen-Knopf rutschte durch, bis ein Lauf mit **Teil-Auswahl**
   dazukam — der Fall, den Klaus wirklich benutzt.
3. **Eine Textsuche findet ihre eigene Doku.** Die Quelltext-Prüfung schlug auf
   den Kommentar an, der erklärt, dass `deleteDatabase` NICHT aufgerufen wird.
   Kommentare werden jetzt abgezogen, bevor gesucht wird.

**Nebenbefund:** `playwright-core` fehlte in `package.json`. Damit waren
`pinnwand/_smoke_melden.mjs` und `_smoke_mikrofon.mjs` auf einem frischen
Container **nicht lauffähig** — also stumm. Jetzt exakt genagelt (1.62.1).

**Offen:** Klaus' Lauf auf dem Tablet. Erst `bash tools/aufraeumen.sh` (ändert
nichts), Zahlen ansehen, dann entscheiden. `tools/speicher.html` erst nach dem
Merge über GitHub Pages erreichbar.

**Nächster Schritt:** Teil A des Plans — die Werkstatt in Kimhub (Schicht,
Rollen, Deckel). Siehe die Chat-Antwort dieser Sitzung.

## Stand 2026-08-19 (Pflege) — ⏱ Eine feste Wartezeit, die in beide Richtungen log

**Rolle:** Pflege-Sitzung (Status-Prüfung Kimboard + Sage). Zweig
`claude/kimboard-relais-status-x77me9`.

**Anlass war kein Auftrag, sondern ein Messwert.** Der Brief sagte „es drängt
nichts", und das stimmte. Beim Nachprüfen — Beweis statt Annahme — meldete
`run_alle.mjs` erst **78 grün, 0 rot, 2 nicht lauffähig**: `pinnwand/_smoke_melden`
und `_smoke_mikrofon` liefen mangels `playwright-core` gar nicht. Ausgerechnet
der Melde-Weg der Pinnwand vom Vortag war damit **ungeprüft, nicht grün**.

**Was getan:**

- `npm install --no-save playwright-core` in Sage (bewusst `--no-save` — die
  `package.json` ist gepinnt und bewacht). Danach **alle 80 Proben lauffähig**.
- Im selben Lauf fiel `smoke_bau05_nostr.mjs` mit **genau 5 roten Prüfungen**
  um. Einzeln: **25 von 25 grün**, auch unter CPU- und Browser-Last. Drei weitere
  volle Läufe: grün. **Nicht reproduzierbar — und trotzdem echt.**
- Ursache strukturell belegt: fünf feste `sleep(50)`, während der Empfänger
  echte Ed25519-Krypto rechnet. Die 5 roten Prüfungen sind exakt Probe 2, die
  vollständig an einer Antwort hängt.
- **Der größere Fund lag auf der Gegenseite.** Die Wartestellen sind zwei
  Sorten: „etwas kommt" (zu kurz ⇒ falsches ROT) und „etwas bleibt aus" (zu
  kurz ⇒ **falsches GRÜN**). Bei Sorte B war die Probe **zu nachsichtig**: eine
  verspätete zweite Antwort hätte einen gebrochenen Replay-Schutz verborgen.
- Beide umgestellt — Sorte A auf `warteBis` (Bedingung, Frist nur Obergrenze),
  Sorte B auf `RUHE_MS = 400`. Dieselbe Kur in der Schwester-Probe
  `smoke_query_ueber_relais.mjs` (80/60 ms), wo es bisher nur Glück war.
- **Gegenprobe gebaut:** `tests/gegenprobe_bau05_warten.mjs` — 8 Fälle, beide
  Dateien, arbeitet an einer **Wegwerf-Kopie** (die echte Probe wird nie
  angefasst, also greift die Falle „während einer Gegenprobe wird nicht
  committet" hier gar nicht erst). Sie bricht den Replay-Schutz absichtlich und
  zeigt: heute gefangen, mit der alten Frist blind.
- `CLAUDE.md` § „Die Proben laufen lassen" um die **vierte** Art, wie eine Probe
  stumm wird, ergänzt.

**Kimboard:** `node tests/alle.mjs` → **alle 31 Prüfungen grün**, nichts zu tun.

**Was offen bleibt (unverändert, nichts eilt):**

1. `grub-pc-bin` + `grub2-common` auf dem Server — von Ubuntu wegen „phasing"
   zurückgehalten, kommt von allein. Bootloader, nichts erzwingen.
2. Anzeige-Filter für die anderen 20 Apps (Modul 23 `discover()`) —
   Richtungsentscheid für Klaus, bewusst vertagt. Heute gäbe es nichts zu
   filtern. Wieder aufnehmen, sobald jemand Fremdes aufs Relais schreibt.

**Bewusst NICHT angefasst:** `smoke_bau23_rendezvous_ui.mjs` wartet mit 5–20 ms
auf DOM-Rendering im selben Prozess — keine Krypto, keine Antwortkette, anderer
Fall. Benannt statt stillschweigend umgangen.

**Stichtag:** die Liste im Kimboard-Brief greift ab **2026-09-02**. Heute ist der
2026-08-19 — noch nicht fällig, deshalb nicht angesprochen.

**Nächster sinnvoller Schritt:** nichts Dringendes. Wer als Nächstes hier
arbeitet, ruft **einmal** `node tests/run_alle.mjs` auf und achtet auf die Zeile
„nicht lauffähig" — sie ist kein Nebensatz, sondern die Auskunft darüber, was
gar nicht gemessen wurde.

---

> **Ausgelagert am 2026-08-24.** Der Eintrag vom **17.08.** („Zehn Sitzungs-Anker
> · Abschluss · Brief Hassrede vom Brett") steht wortwörtlich in
> [`docs/sessions/archiv/2026-08_puls-auslagerung-4.md`](sessions/archiv/2026-08_puls-auslagerung-4.md).
> Die Datei stand bei 3.019 Zeilen; die Schutz-Klausel sagt: auslagern statt kürzen.


> **Ausgelagert am 2026-08-24.** Der Eintrag vom **17.08.** („Ein Wizard, der sich
> selbst widersprach · 18 Repos · Karte auf 19 Knoten") steht wortwörtlich in
> [`docs/sessions/archiv/2026-08_puls-auslagerung-5.md`](sessions/archiv/2026-08_puls-auslagerung-5.md).


> **Ausgelagert am 2026-08-24.** Die Sitzungs-Einträge vom **15.08. bis 17.08.**
> (Gerätename netzweit · Modul 05b prüft den Raum · Urheberschaft und Rechte ·
> vier Marktplatz-Apps werden Endknoten · Papiere bereinigt zurück · Modul-23-UI
> netzweit) stehen wortwörtlich in
> [`docs/sessions/archiv/2026-08_puls-auslagerung-6.md`](sessions/archiv/2026-08_puls-auslagerung-6.md).
> Die Datei stand bei 2.985 Zeilen; die Schutz-Klausel sagt: auslagern statt kürzen.

> **Ausgelagert am 2026-08-23.** Die beiden Sitzungs-Einträge vom **14.08.**
> („PULS ausgelagert: 10.150 → 2.592 Zeilen" und „Sperr-Knöpfe · Automatik-Schalter
> · drei tote Wächter") stehen wortwörtlich in
> [`docs/sessions/archiv/2026-08_puls-auslagerung-3.md`](sessions/archiv/2026-08_puls-auslagerung-3.md).
> Nichts gekürzt, nichts zusammengefasst — die Datei stand bei 3.038 Zeilen, und
> die Schutz-Klausel sagt: auslagern statt kürzen.


