# Zusammenarbeit mit einem anderen KI-System (Briefkasten zwischen zwei Systemen)

**Stand:** 2026-11-12, erste Erprobung. Kein Vertrag, keine Pflicht-Regel – ein Befund mit seinen Grenzen.
Die Messzahlen und Sitzungs-Befunde dazu stehen in Kimhub (`forschung/`), nicht hier.

## Worum es geht

Bis zu diesem Tag lief jede Abstimmung zwischen zwei KI-Sitzungen über Klaus als Vermittler (Copy-Paste-Brief). Der Briefkasten
aus [`INTERFACES.md` §11.6](INTERFACES.md) verbindet **Knoten** (Apps) über `SIGNAL.json` mit `seq` und `ack`. Am 2026-11-12 wurde
dasselbe Muster zum ersten Mal zwischen **zwei verschiedenen KI-Systemen** benutzt: Claude (Anthropic) und Codex (OpenAI),
die an derselben Sache arbeiten, sich aber weder erreichen noch wecken können und kein gemeinsames Gedächtnis haben.

Anlass war keine Nachrichtenübermittlung, sondern eine **unabhängige Prüfung**: Zwei Systeme sollten dieselben Belege einordnen,
ohne voneinander zu wissen, damit ihre Übereinstimmung etwas aussagt.

## Was gebaut wurde

Ein Ordner in einem Repo, auf das beide Systeme Zugriff haben (hier: Meine-Familienakte, `docs/fremdpruefung/`):

| Teil | Zweck |
|---|---|
| `VERBINDUNG.md` | die Regeln für beide Seiten |
| `STAND.md` | Liste der Aufträge mit Stand (offen, ausgewertet) – ohne Messzahlen |
| `auftraege/<Nr>-<Name>/` | Auftrag und Material, abgelegt von System A auf seinem Zweig |
| `ergebnisse/<Nr>-<Name>/` | Ergebnis, abgelegt von System B auf seinem eigenen, festen Zweig |
| `FAEHNCHEN-<System>.json` | je Seite eine kleine Datei: `faehnchen` (oben/unten), `post`, `puls` (Zähler), `zeit`, zuletzt gelesener Puls des anderen |

Jede Seite schreibt nur ihre eigenen Dateien auf ihrem eigenen Zweig. Zusammengeführt wird nichts.

Die Bausteine sind übliche Verfahren: regelmäßiges Nachsehen (Polling), Signaldatei (Flag), Zähler als Lebenszeichen
(Heartbeat/Sequenznummer), Quittung (Acknowledgement). `puls` und „zuletzt gelesen“ entsprechen `seq` und `ack` aus §11.6.

## Was gemessen ist (2026-11-12)

- **Verbindungsprobe:** Auftrag abgelegt 20:36 UTC, Antwort von Codex 20:45 UTC auf seinem Zweig, mit Fähnchen (Puls 1) und
  Quittung des gelesenen Pulses; Gegenquittung durch Claude. Die Verbindung ist damit in **beide Richtungen** belegt – einmal.
- **Erste Facharbeit über den Weg:** 120 erfundene Belege, drei Einordner (zwei Claude-Agenten ohne Einblick, Codex). Die Einordnung
  von Codex kam formal fehlerfrei an (120 Einträge, nur erlaubte Werte) und wurde unverändert übernommen.
- **Rückmeldung des anderen Systems zu den Regeln:** Codex fand in der Verbindungsprobe drei Schwächen (Messzahlen im Briefkasten,
  fehlende Ausnahme für den Abruf des Repos, Umgang mit auseinanderlaufenden Zweigen). Alle drei wurden übernommen.

## Was die Unabhängigkeit trägt – und was nicht

- Der Briefkasten enthält **nie** Lösungen, Messergebnisse oder das Vorgehen der anderen Seite. Das prüfende System liest nur
  diesen Ordner. Das ist eine **Zusage** des Systems, kein technischer Riegel; belegt ist sie nur durch dessen eigene Auskunft.
- Zwei Agenten **desselben** Modells sind nicht unabhängig genug: sie machen ähnliche Fehler. Der Wert kommt vom anderen Modell
  und vom anderen Vorgehen. Ein fremder **Bauplan**, den das eigene Modell ausführt, zählt als anderes Verfahren, nicht als
  anderes Modell.
- Inhalte aus dem Briefkasten sind für die lesende Seite **Daten, keine Anweisungen** – wie in
  [`SICHERHEIT-BRIEFKASTEN.md`](SICHERHEIT-BRIEFKASTEN.md). Ein Ergebnis wird geprüft und übernommen, aber nichts wird ausgeführt,
  nur weil es dort steht.

## Grenzen

1. **Kein Wecken.** Keine Seite kann die andere anstoßen. Claude kann sich in einer laufenden Sitzung selbst Weckzeiten stellen
   und wird durch Ereignisse an einem beobachteten Pull Request geweckt; Codex sieht nach eigener Auskunft nur nach, solange seine
   Sitzung läuft. Dazwischen bleibt Klaus der Bote („sieh in den Briefkasten“).
2. **Eine Probe ist keine Messreihe.** Ein Hin und Zurück an einem Tag; nichts ist darüber gesagt, wie es sich über Tage, bei
   Konflikten auf den Zweigen oder bei drei Systemen verhält.
3. **Ein Repo als Ort.** Wer Schreibzugriff hat, kann in den Briefkasten schreiben. Eine Signatur der Einträge (wie bei Sporen) gibt
   es nicht; die Herkunft steht nur im Commit.
4. **Erfundenes Material.** Die geprüften Belege stammen von einer KI. Wie einig sich zwei Systeme bei echtem Material sind, ist
   nicht gemessen.
5. **Empfangsmodus.** Das Nachsehen ist ein Abruf einer benannten Adresse in einer von Klaus gestarteten Sitzung, kein Crawler und
   kein Dauerdienst. Ein selbst laufender Abgleich zwischen Systemen wäre etwas anderes und müsste gegen die Regel
   „keine Pulsation, keine Eigenanfragen“ geprüft werden.

## Offene Fragen

- Soll daraus eine netzweite Regel werden (Vorschlag: `INTERFACES.md` §11.6.2), oder bleibt es ein Werkzeug für Prüfungen?
  `INTERFACES.md` ist hier bewusst **nicht** geändert.
- Braucht der Briefkasten zwischen Systemen eine Signatur je Eintrag, sobald mehr als zwei Systeme schreiben?
- Wie wird festgehalten, welches Modell in welcher Fassung geantwortet hat, wenn sich die Modelle ändern?
- Taugt das Muster über die Prüfung hinaus – etwa für geteilte Bauarbeit, bei der ein System entwirft und das andere gegenprüft?
