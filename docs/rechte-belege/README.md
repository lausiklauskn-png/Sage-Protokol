# Rechte-Belege — was hier hineingehört

**Angelegt 2026-08-16.** Dieser Ordner ist die Ablage für die **Anbieter-Bedingungen
in der Fassung, die galt, als hier gebaut wurde.**

---

## Warum das überhaupt sein soll

Anthropic tritt die Rechte an den Ausgaben ausdrücklich an den Kunden ab — daran hängt
die ganze Antwort auf die Frage „wem gehören meine Apps". Bedingungen können sich aber
für die Zukunft ändern. Wer sich später auf die Abtretung berufen will, braucht **den
Wortlaut von damals**, nicht den von dann.

Das ist kein Misstrauen gegen Anthropic. Es ist dasselbe wie eine Rechnung aufheben:
Man braucht sie fast nie, und wenn doch, dann genau die von damals.

Volle Einordnung: [`../URHEBERSCHAFT_UND_RECHTE.md`](../URHEBERSCHAFT_UND_RECHTE.md),
dort Abschnitt 9, letzter Punkt.

---

## Warum der Ordner leer ist

Die Sitzung vom 2026-08-16 **konnte die Seiten nicht abrufen.** Der Netz-Zugang dieser
Umgebung lässt `anthropic.com` und `support.claude.com` nicht durch — gemessen, nicht
vermutet:

```
anthropic.com/legal/consumer-terms  ->  403 (CONNECT tunnel failed)
support.claude.com/...              ->  000 (keine Verbindung)
Proxy-Status: "gateway answered 403 to CONNECT (policy denial)"
```

Ein PDF aus einer Zusammenfassung zu bauen wäre kein Beleg gewesen, sondern etwas, das
wie einer aussieht. **Deshalb steht hier eine Anleitung statt einer Datei.**

---

## Was gesichert werden soll (vier Seiten)

| Datei-Name | Was es ist | Adresse |
|---|---|---|
| `2026-08-16_anthropic-consumer-terms.pdf` | Verbraucher-Bedingungen — gilt für claude.ai / Claude Code im Abo | <https://www.anthropic.com/legal/consumer-terms> |
| `2026-08-16_anthropic-commercial-terms.pdf` | Kommerzielle Bedingungen — falls je über die Schnittstelle gearbeitet wird | <https://www.anthropic.com/legal/commercial-terms> |
| `2026-08-16_anthropic-usage-policy.pdf` | Nutzungsrichtlinien — was man mit dem Werkzeug bauen darf | <https://www.anthropic.com/legal/aup> |
| `2026-08-16_claude-wasserzeichen.pdf` | Die Erklärung zu den Wasserzeichen | <https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content> |

**Das Datum im Dateinamen ist der Tag, an dem Du sie gesichert hast** — nicht dieser
hier. Nimm den Tag, an dem Du es wirklich machst.

---

## Wie Du eine Seite sicherst (Chrome am Tablet)

Für jede der vier Adressen dasselbe, ein Durchgang dauert etwa 40 Sekunden:

1. Adresse öffnen.
2. Chrome-Menü (drei Punkte oben rechts) → **Teilen** → **Drucken**.
3. Als Ziel **„Als PDF speichern"** wählen.
4. Speichern, Datei umbenennen wie in der Tabelle oben.

**Erfolgs-Merkmal:** Du hast vier PDFs, und in jedem steht am Rand ein Datum.

---

## Die bessere Sicherung, wenn Du eine Minute mehr hast

Ein selbst gedrucktes PDF belegt nur, dass **Du** es so gespeichert hast. Stärker ist
eine Kopie bei einem **unbeteiligten Dritten**, weil dessen Zeitstempel nicht von Dir
stammt. Dafür gibt es das Internet-Archiv:

1. <https://web.archive.org/save> öffnen.
2. Die jeweilige Adresse eintragen, **Save Page Now** drücken.
3. Die Adresse, die dabei herauskommt (sie enthält Datum und Uhrzeit), unten in die
   Liste eintragen.

Dann hast Du beides: das PDF in der Hand und einen fremd bezeugten Stand im Netz.

---

## Wohin die PDFs gehören — und wohin nicht

**In Deinen Tresor**, nicht in dieses Repo.

Grund: Die Bedingungen sind fremder Text. Sie hier hineinzulegen, hieße, sie in einem
öffentlichen Repo zu veröffentlichen — genau die Art Fremd-Text-Kopie, die wir bei
anderen nicht wollen. **Mein-Tresor** oder **Jasons-Tresor** sind dafür gebaut: ein
eigenes Fach, verschlüsselt, Dein Passwort.

**Hier im Repo steht nur die Liste unten** — was gesichert wurde, wann, und wo es liegt.
Das ist der Teil, der in der Git-Historie ein Datum bekommt und damit selbst zum Beleg
wird.

---

## Liste — was gesichert ist

Trag eine Zeile ein, wenn eine Sicherung gemacht ist. Leer heißt: steht noch aus.

| Dokument | gesichert am | wo es liegt | Archiv-Adresse |
|---|---|---|---|
| Consumer Terms | — | — | — |
| Commercial Terms | — | — | — |
| Usage Policy | — | — | — |
| Wasserzeichen-Erklärung | — | — | — |

---

## Wann das wiederholt werden sollte

Wenn Anthropic die Bedingungen ändert und Du davon erfährst — dann eine **neue** Fassung
mit neuem Datum daneben legen, die alte **nicht** ersetzen. Beide zusammen zeigen, was
wann galt. Sonst: einmal jährlich reicht.

Eine Sitzung, die es aus ihrer Umgebung heraus abrufen kann, darf die PDFs auch selbst
holen und hier vermerken — dann bitte ebenfalls nur die Liste oben füllen, nicht die
Dateien einchecken.
