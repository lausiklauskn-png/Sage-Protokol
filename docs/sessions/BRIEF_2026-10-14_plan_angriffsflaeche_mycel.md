# Brief · Planmodus · Ist das Mycel selbst ein Angriffspunkt für Texte, die eine KI irreführen?

**Von:** Sitzung 5 der Prüf-Reihe (2026-10-14) · **Auftraggeber:** Klaus
**Art:** Planmodus. Lesen, messen, einen Plan vorlegen. **Kein Code, kein Merge.**

⛔ **Kimhub NICHT anfassen**, bis Klaus es sagt.
⛔ **Keine Forschungseinträge in Kimhub.** In Kimhub läuft auf dem Server gerade die Gegenprobe; ein
Eintrag dort würde sie stören (Klaus 2026-10-14). GitHub ist davon nicht betroffen.
**Diesen Satz an jede Folge-Sitzung und jeden Brief weitergeben, bis Klaus ihn aufhebt.**
Die Papers werden **gelesen und geprüft**, nicht ergänzt. Was ins Paper gehört, kommt als Vorschlag in den Plan.

---

## Die Frage (Klaus' Worte, zusammengefasst)

Beim Bau der letzten Tage hat sich gezeigt, dass sich Texte, die eine KI irreführen, leicht in PDFs,
Bilder (auch PNG) und andere Dateien einbinden lassen. Die Proben haben das nachgewiesen.

1. **Inwiefern ist das SBKIM-Werkzeug selbst ein Angriffspunkt, oder das Mycel?** Die Knoten sind
   Visitenkarten, kleine Internetseiten, die mit KI arbeiten und KI in ihren Elementen eingebunden haben.
   Kann eine **Visitenkarte selbst** Schadcode enthalten oder einen Text, der eine KI irreführt oder in
   eine andere Richtung lenkt?
2. **Welche Module helfen dagegen?** Die vorhandenen und die noch nicht aktivierten. Klaus dachte an
   Modul 14, war sich aber nicht sicher. Gehört eine Aktivierung jetzt neu bedacht?
3. **Die Papers prüfen.** Was dort an andere Forschende weitergegeben wird: Trägt die Aussage, dass
   solche Protokolle mit den passenden Modulen wirksam schützen? Was müsste dort ehrlicher oder genauer
   stehen?

---

## Was schon gemessen ist (Ausgangslage, nicht neu herleiten)

- **Prüfkern** (Auslieferungsprüfer, byte-1:1 in Workflow PDF, beiden WorkFlohs, Rezeptbüchern, Mixarium,
  Sende-Prüfer, In-and-Out-Book): Anweisungen an eine KI im Text, im Seitentext eines PDFs, im Bild
  (Texterkennung, auch blass), in Bild-Metadaten, in den untersten Bits eines PNG (auf Knopfdruck),
  unsichtbarer Text im PDF. Testvorlagen: `Auslieferung-Pruefer/testvorlagen/` (0D, 1A, 2B, 3E, 4C, H6, H7).
- **Reinigung vor der KI** (Workflow PDF #112/#113, WorkFlohs, Rezeptbücher, Mixarium, Privat-Brain,
  BookLedgerPro): PDF als Seitenbilder, versteckter Text zugedeckt, Bilder ohne Metadaten, einmal anhalten.
- **Bau 04.J** (Sage #1082): Der KI-Richter in Modul 04 prüft Suchfrage und **fremde Antworten** mit
  `pruefer-mail.js`. Fehlt die Liste, läuft er nicht. Eine Antwort mit Anweisung geht nicht an die KI
  (`ausgeschlossen: "ki-anweisung"`). In alle Träger verteilt, Pinnwand-Richter (Kimboard, Privat-Brain) ebenso.
- **Bau 24.R:** Die Texterkennung bekommt nie das Original. Versteckter Text und eine Anweisung im
  erkannten Text halten an.
- **Gemessen 2026-09-10:** Die Zahl im Register hängt am Inhalt der Beschreibung, nicht an ihrer Länge.
  Kim-Bell kommt mit 82 Zeichen auf 0.874864, weil der Text SBKIM, Mycel und Knoten nennt.
  (`Mein-Mixarium/CLAUDE.md` „Warum das Protokoll in der Beschreibung steht")

---

## Was zu prüfen ist — die Wege, auf denen fremder Text in eine KI oder auf den Schirm gelangt

Je Weg: **wo kommt der Text her · wer liest ihn (Mensch, Embedding, KI-Richter, Browser) · was schützt
heute · ist das gemessen oder nur behauptet.** Nichts davon ist vorab entschieden.

| Weg | Fremder Text darin | Frage |
|---|---|---|
| **Spore / Visitenkarte** | `description` (≤ 240 Z.), Stichworte, `nodeName`, Gerätename, `endpoint` | Die Signatur beweist die Herkunft, nicht die Harmlosigkeit. Geht die Beschreibung in einen KI-Prompt (Richter 04, Erklärungen)? Wird sie irgendwo als HTML gezeichnet? |
| **Modul 04 Richter** | Suchfrage, Treffer-Texte fremder Knoten | 04.J deckt Anweisungen ab. Was deckt es **nicht** (umformulierte Anweisung, andere Sprache, Unicode-Tricks, Zitat)? |
| **Embedding / Rangfolge (03/04)** | Beschreibung, Inhalts-Vektor | Kein KI-Befehl, aber eine **Rangfolge-Manipulation**: eine Spore, die gezielt Begriffe stopft, rückt nach oben. Ist das ein Angriff, und was hält dagegen? |
| **Modul 23 Raum / Brett** | Karten fremder Knoten, Zettel (Kimboard) | Anzeige-Filter, Sperr-Liste, Relais-Grenzen. Wird eine Karte gerendert, bevor sie geprüft ist? |
| **Modul 22 Such-Widget** | KI-Antwort, die man einfügt (Kopier-Pfad), Web-Treffer | `parseAiAnswer` — was passiert mit einer eingefügten Antwort, die selbst Anweisungen trägt? |
| **Briefkasten** (`SIGNAL.json`, `AUSTAUSCH-*.md`) | Texte anderer Repos und Sitzungen | Leser-Regel steht in `docs/SICHERHEIT-BRIEFKASTEN.md`. Liest eine **Sitzung** (eine KI!) das ungeprüft? Das ist der direkteste Weg zu einer KI. |
| **Siegel-Erklärseite, `sicherheit.html`** | eigene Seite, im iframe | Kann ein fremder Knoten dort etwas einschleusen? |
| **Mycel-Karte / Knoten-Seite** | alle angekündigten Sporen | Die Knoten-Seite trägt Module der alten Generation (offener Punkt aus Sitzung 4). |

⚠ **`innerHTML`** kommt in `src/modules/16_siegel.js`, `22_such_widget.js` und `23_rendezvous_ui.js`
vor. Nachsehen, ob dort je **fremder** Text ankommt. Nicht vermuten: einen Treffer mit einer erfundenen
Spore (`<img onerror>` in der Beschreibung) im Browser nachstellen.

---

## Die Module — Stand laut `docs/MODUL-STAND.md`

| Modul | Was es ist | Stand |
|---|---|---|
| 10 Reputation | Score pro Peer mit Abklingen | Schablone, Priorität niedrig |
| 11 Rate-Limit | Drosselung | Schablone, Priorität niedrig |
| 12 Blocklist | Sperre | Schablone, Priorität niedrig (Kimboard hat eine eigene signierte Sperr-Liste) |
| **14 Diffusion** | **Empfehlungs-Sporen** beim Handshake weitergeben | Schablone, Priorität niedrig |
| 15 Membran | `allowedOrigins`, Fremd-Alarm | aktiv |
| 16 Siegel | Prüfung der Pflicht-Module, Aspekte | aktiv |
| 04.J | Prüfliste vor dem KI-Richter | aktiv seit 2026-10-14 |
| 25 Pseudonym | Platzhalter, Namensvorschläge | aktiv in Sende-Prüfer, Workflow-Needs, BookLedgerPro |

⚠ **Modul 14 ist kein Schutz-Modul**, sondern Wachstum durch Empfehlung. Zu prüfen ist deshalb die
**Gegenrichtung**: Würde 14 fremde, ungeprüfte Sporen weiterreichen und damit die Angriffsfläche
**vergrößern**? Unter welcher Bedingung (Prüfung vor dem Weitergeben, Reputation) wäre es vertretbar?

Je Modul beantworten: **schützt es gegen einen der Wege oben · wogegen nicht · was kostet die
Aktivierung · Reihenfolge.**

---

## Die Papers

Lesen: `docs/papers/sbkim-paper-de.html` (und `-en`), `docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.md`,
`docs/papers/PLAN_PAPERS.md`, `docs/PAPER_NUTZEN_UND_INTEGRATION.md`, `docs/E2E-VERTRAULICHKEIT.md`.

Prüfen:
- Wo behauptet ein Paper Schutz, der **nicht gemessen** ist?
- Wo fehlt der Befund dieser Tage (Anweisungen in Dateien, Bildern, Metadaten, PNG-Bits; Prüfliste vor
  dem Richter; „die Signatur beweist Herkunft, nicht Harmlosigkeit")?
- Was ist eine **benannte Grenze**, die ins Paper gehört (feste Wortliste, umformulierte Anweisung fällt
  durch, kein Virenscanner)?

**Nur Vorschläge im Plan.** Keine Änderung an den Paper-Dateien, keine Forschungseinträge.

---

## Was am Ende vorliegen soll

1. **Eine Tabelle der Wege** wie oben, je Weg: geschützt / teilweise / ungeschützt, mit Fundstelle,
   und **gemessen oder nur gelesen**.
2. **Höchstens drei Nachstellungen im Browser** mit erfundenen Sporen. Die Spore wird **neu signiert**,
   nicht von Hand verbogen (`Mein-Mixarium/CLAUDE.md` „Die Gegenprobe musste neu unterschreiben").
   Kandidaten: Beschreibung mit Anweisung → Richter · Beschreibung mit HTML → Anzeige · Begriffe gestopft → Rangfolge.
3. **Je Modul (10, 11, 12, 14, dazu neue Ideen) eine Empfehlung** mit Kosten und Reihenfolge, Klaus zur Wahl.
4. **Vorschläge für die Papers** als Liste, nicht eingebaut.
5. **Eine ehrliche Antwort auf Klaus' Frage**, ob das Mycel ein Angriffspunkt ist, getrennt nach
   „gemessen" und „vermutet".

**Befund ins Dokument, Rat in den Chat** (`CLAUDE.md` dieses Repos).

## Pflicht vorher

```bash
bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"
git -C Sage-Protokol fetch origin --quiet
```

Netzweit: [`docs/NETZWEIT.md`](../NETZWEIT.md) · Verträge: [`docs/INTERFACES.md`](../INTERFACES.md) ·
Briefkasten-Tafel: [`docs/SICHERHEIT-BRIEFKASTEN.md`](../SICHERHEIT-BRIEFKASTEN.md).
