# Drei Stufen der Bedeutungs-Sortierung — keine erzwingt Bezahlung

> Notiz zur Frage→Antwort-Testseite (`frage-antwort.html`). Klaus' Leitfrage
> (2026-06-24): *„Muss man immer bezahlen? Die arme Oma, die sich keine KI
> leisten kann — ist sie auf ein Semi-Modell angewiesen?"* Antwort: **nein.**
> Der freie Weg ist der Boden, nicht ein Krüppel-Rest.

## Warum es überhaupt Stufen braucht

Ein **Embedding-Modell** (e5) versteht das **Thema** eines Textes, aber nicht
die **Absicht/Verneinung**: „alkoholfrei" liegt ihm thematisch *nah* an
„Alkohol". Für echte Absicht braucht es ein **Sprachmodell als Richter**. Die
Frage ist nur: muss dieser Richter Geld kosten? — Es gibt drei Wege.

## Stufe 1 — gratis & überall (Voreinstellung)

**Lokales Embedding (Modul 03, `Xenova/multilingual-e5-small`) + Whitening.**
Läuft im Browser, kein Konto, kein Server, kein Cent. Mit *tiefem Inhalt*
(Zutaten, Zubereitung statt nur Name) und dem zentrierten (whitened) Cosinus
ist das schon richtig gut — die meisten Fälle löst es ohne jede KI. **Das ist
der Boden für alle, auch die schwächste Hardware.**

Hebt den Boden später zusätzlich:
- **Tieferer Inhalt** einbetten (Klaus' Erkenntnis: „Inhalt schlägt Hülle").
- **Relevanz-Rückmeldung** (gut/daneben markieren → Frage-Vektor nachziehen,
  Rocchio-Verfahren) — lernt *pro Sitzung*, server-los, ohne PII.
- **Besserer Embedder** (e5-base, BGE-M3, GTE, Jina) — netzweit koordiniert.

## Stufe 2 — gratis, aber gerät-hungrig

**Ein kleines Sprachmodell im Browser (WebLLM / WebGPU).** Versteht
Absicht/Verneinung, kostet nichts, kein Schlüssel, server-los. Haken: braucht
ein **leistungsfähiges Gerät** (WebGPU) + einen einmaligen Modell-Download
(mehrere hundert MB). Auf einem normalen PC machbar; auf alten Tablets
grenzwertig. **Status: nächster Bau-Stich** (in der Testseite vorgemerkt,
`webllm`-Eintrag, noch deaktiviert).

## Stufe 3 — bezahlt & am stärksten

**Cloud-Richter mit eigenem Schlüssel (BYOK):** Claude (Anthropic). Stärkste
Qualität, aber kostet pro Aufruf. **Opt-in**, der Schlüssel bleibt nur im
Speicher der Seite (kein `localStorage`, kein Code, kein Tracker) und
verschwindet beim Neuladen. Ein Direktlink „🔑 Schlüssel erstellen ↗" führt zur
Anthropic-Konsole. Spiegelt die Provider-Abstraktion von Modul 04 `hybridMatch`.

*Mistral wurde bewusst NICHT aufgenommen (Klaus 2026-06-24): hat sich weder in
der Text- noch in der Bedeutungs-Erkennung bewährt — deckt sich mit der früheren
Widget-Festlegung „Mistral RAUS". Andere/EU-Anbieter können später ergänzt
werden, wenn sie sich bewähren.*

## Niemand muss *allein* zahlen (Vision)

In der SBKIM-Vier-Schichten-Lesart trägt die **Pilz-Schicht** die Kosten für
die, die nicht können: ein Verein, eine Genossenschaft oder ein kommerzieller
Pilz stellt einen Richter bereit, den andere mitnutzen — die Oma profitiert,
ohne selbst zu zahlen. Genau dafür ist das Mycel server-los und ohne Türsteher
gebaut: **kein verborgenes Interesse, das den Zugang verriegelt.**

## „Bald läuft nichts mehr ohne KI"?

Der freie On-Device-Weg (Stufe 1, später Stufe 2) ist die Antwort darauf: man
ist **nicht** in die bezahlte Cloud gezwungen, und freie lokale Modelle werden
ständig besser — der kostenlose Boden steigt mit.

*Notiz, 2026-06-24. Hintergrund Vektor-Kalibrierung:
[`../../LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`](../../LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md).
Sachstand: [`../../MEILENSTEIN_SEMANTISCHE_SUCHE.md`](../../MEILENSTEIN_SEMANTISCHE_SUCHE.md).*
