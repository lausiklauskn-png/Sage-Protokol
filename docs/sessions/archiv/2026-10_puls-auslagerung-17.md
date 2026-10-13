# PULS-Auslagerung 2026-10-13 — „Umlaute, Gedankenstriche und eine Zahl, die sich selbst widersprach"

**Ausgelagert am 2026-10-13**, weil `docs/PULS.md` über der 3000-Zeilen-Grenze stand
(3054 Zeilen vor dem Eintrag dieser Sitzung). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-09-17 · Umlaute, Gedankenstriche und eine Zahl, die sich selbst widersprach

**Klaus nach dem Ausdruck:** *„Du hast wieder viel zu viele Bindestriche
eingefügt … Und die Umlaute hast du nicht beachtet, die in ganz normaler Art und
Weise darstellen, wie zum Beispiel Lösungsschlüssel."* Eine Stelle hat er beim
Namen genannt: *„Emotionserkennung am Arbeitsplatz und in Bildungseinrichtungen"*.

Die Regel steht im Skill `menschlich-schreiben` und ist nicht neu: höchstens ein
Gedankenstrich auf drei bis vier Absätze. Ich hatte sie nicht angewandt.

**Gemessen am sichtbaren Text** (`innerText` im Browser, samt Knopf-Beschriftungen,
`title` und Platzhaltern), nicht am Quelltext:

| | vorher | nachher |
|---|---|---|
| Gedankenstriche | **11** | **1** |
| Umschrift statt Umlaut | 2 | **0** |

Der eine verbliebene Strich steht in den Titeln der amtlichen Quellen
(*„AI Literacy - Questions & Answers"*). Ein zitierter Titel gehört wörtlich;
ihn zu glätten machte die Quellenangabe falsch. Benannte Grenze.

⚠ **UND MEINE STRICH-SUCHE HAT DIE STELLE ZUERST NICHT GEFUNDEN, DIE KLAUS
NANNTE.** `grep -E ' [-–—] '` greift bei einer Zeichenklasse mit mehrbyte-Zeichen
daneben; gemeldet wurden 4 statt 11. **Eine Suche, die zu wenig findet, sieht
genauso aus wie ein sauberer Befund.** Gezählt wird seitdem jede Strichsorte
einzeln.

⚠ **UND MEINE EIGENEN KOMMENTARE MACHTEN DENSELBEN FEHLER.** Die sieben
Erklär-Blöcke zu den Druck-Umbrüchen waren durchgehend in Umschrift geschrieben
(`Ueberschrift`, `laesst`, `fuer`). Mit nachgezogen; in der ganzen Datei steht
jetzt keine Umschrift und kein Gedankenstrich mehr.

### ⚠ Die Zahl, die sich selbst widersprach

Beim Durchsehen fiel etwas auf, wonach niemand gesucht hatte: die Überschrift
sagte **„Wissenstest - 15 Fragen"**. Im Formular stehen **16** `<fieldset>`, in
der Auswertungs-Liste **16** Einträge, und die Bescheinigung rechnet mit
`____ / 16`.

⚠ **DER KOMMENTAR DANEBEN VERSPRACH DIE KOPPLUNG, DIE ES NICHT GAB:** *„Wer eine
Frage ergänzt, ändert nur die Liste oben; Text, Zeugnis und Schlüssel ziehen
nach."* Zeugnis und Schlüssel zogen nach, die Überschrift stand fest im Markup.
Genau daraus ist die 15 geworden. Sie zieht jetzt mit (`<span id="quizCount">`),
gesetzt aus derselben `TOTAL`; der feste Wert bleibt als Rückfall ohne
JavaScript stehen, wie bei `certScore`.

⚠ **DER WÄCHTER MISST DIE ÜBEREINSTIMMUNG, NICHT DIE ZAHL.** Eine festgenagelte
16 wäre bei der siebzehnten Frage genauso falsch wie die 15 es war. Gezählt
werden die `<fieldset>`, dagegen gehalten wird die Überschrift.

### Was davor lag: die Bescheinigung war nie kaputt

Klaus hatte zuerst gemeldet, die Urkunde fehle im Ausdruck. **Gemessen an
derselben Datei:** erster Knopf 7 Seiten ohne Bescheinigung, dritter Knopf
(*„Schulung + Bescheinigung"*) 8 Seiten mit, eigener Knopf 1 Seite. Jeder Knopf
tat, was draufsteht. Klaus hat das selbst aufgelöst (*„Schulung ausdrucken heißt
Schulung ausdrucken"*), und die angefangene Umstellung der Knopfzeile wurde
**zurückgenommen**: ein veröffentlichtes Dokument wird nicht ohne Auftrag
geändert.

### Geprüft

| | |
|---|---|
| Toolpoint `npm test` | **927/927 · 0 rot** (vorher 923) |
| family-project `smoke_all` | **122/122 grün** |
| `smoke_cache_version` | 12/12, Bump v121 → v122 erkannt |
| Gegenprobe, 4 neue Fälle | **4 gefangen · 0 durchgerutscht · 0 tote Anker** |

Jeder der vier Fälle ist **von Hand nachgestellt und die rote Zeile gelesen**;
jede trägt den Namen ihrer eigenen Zusicherung neben dem erwarteten Pin-Ausfall.

⚠ **Seitenumbruch gegengemessen**, denn Textänderungen verschieben Zeilen. Bei
**14 mm** bleiben es **7 Seiten und jede Seitengrenze ist identisch**; bei 22 mm
bleiben es 8 Seiten, dort rückt ein Aufzählungspunkt von Seite 5 auf Seite 4.

Stand der Unterlage: `md5 d5f140110a1ea4404a59b636e6fb92ed`, 233 Zeilen. Cache
Toolpoint **v62**, family-project **v122** (dort trugen 5 Dateien noch `?v=121`
fest verdrahtet; jede Adresse trägt jetzt dieselbe Zahl).

⚠ **PULS ausgelagert, nicht gekürzt:** der Eintrag *„Zwanzig von zwanzig"* vom
2026-09-16 steht jetzt vollständig unter
[`docs/sessions/archiv/2026-09-16_puls-eintrag-zwanzig-von-zwanzig.md`](sessions/archiv/2026-09-16_puls-eintrag-zwanzig-von-zwanzig.md),
im PULS ein Stummel. 2980 auf 2860 Zeilen.
