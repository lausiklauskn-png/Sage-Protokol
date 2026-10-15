# PULS-Auslagerung 2026-10-15 — „Modul 25 verdeckt jetzt auch Daten (DATUM)“

**Ausgelagert am 2026-10-15**, weil `docs/PULS.md` über der 3000-Zeilen-Grenze stand
(3003 Zeilen nach dem Eintrag „Sitzungsende S5-Sitzung“). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-10-02 · Modul 25 verdeckt jetzt auch Daten (DATUM)

**Rolle:** Hauptsitzung. Punkt 4b aus Klaus' Grenzen-Liste des Sende-Prüfers
(LIESMICH Grenze 2: „Geburtsdaten werden nicht erkannt").

**Was getan.** Neue Sorte `DATUM` in `src/modules/25_pseudonym.js`. **Standardmäßig an**,
weil ein Geburtsdatum eine Person kennzeichnet:

| erkannt | nicht erkannt (gemessen) |
|---|---|
| 12.03.1985 · 1.3.26 · 2026-03-12 · 12/03/2026 | Version 1.10.12.5 · IP 192.168.1.1 |
| 3. Mai 2026 · 1. Jan. · 24. Dezember | 12.30 Uhr · 3.5 Sterne · Kapitel 3.12 |
| | 13.13.2026 · 32.01.2026 (Tag/Monat geprüft) |

1.248,50 EUR bleibt BETRAG, RE-2026-04871 bleibt RECHNUNG. Ein Satzpunkt nach dem
Datum wird nicht mitgenommen. Eine Frist kommt über `rehydrate` unverändert zurück.

⚠ **Was es kostet:** mit einem verdeckten Datum kann die KI nicht rechnen
(„wie viele Tage bis …"). Wer das braucht, lässt `DATUM` aus `options.types` weg —
steht im Kopf des Moduls. ⚠ **Grenzen:** „März 2026" ohne Tag und englische Formate
(„March 12") werden nicht erkannt. Die zweite Fassung der Muster im
Auslieferungsprüfer kennt kein DATUM; sie sucht Abflüsse, verdeckt nichts.

**Gemessen.** `smoke_bau25_pseudonym` **64 ok · 0 FAIL** (neu 1o–1z) ·
Gegenprobe **20 gefangen · 0 blind · 0 aus falschem Grund · 0 tote Anker**
(5 neue Fälle; „DATUM standardmäßig aus" traf zuerst den falschen Wächter und
sabotiert jetzt `DEFAULT_TYPES`) · `npm test` **110 grün · 0 rot · 0 nicht lauffähig**.

**Offen.** Byte-1:1 in den Sende-Prüfer (Pin, Cache-Bump, LIESMICH Grenze 2) ·
Punkt 4c: Namen nach „Herr/Frau" und aus der Anrede **vorschlagen**, nie selbst
verdecken. ⚠ PULS dafür ausgelagert: Eintrag vom 17.09. (KI-Schulung) wortwörtlich
in `sessions/archiv/2026-10_puls-auslagerung-16.md`.
