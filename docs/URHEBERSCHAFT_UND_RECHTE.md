# Urheberschaft und Rechte im Sage-Netz

**Stand: 2026-08-16.** Diese Datei ist die kanonische Fassung für **alle** Repos von
Klaus Nitzsche. Jedes Repo trägt eine kurze `RECHTE.md`, die hierher verweist; gepflegt
wird nur diese eine Datei.

> Das hier ist **keine Rechtsberatung**, sondern eine geordnete Zusammenstellung dessen,
> was nachprüfbar ist. Wo eine Frage wirklich Geld oder Streit bedeutet, gehört sie zu
> einer Anwältin für IT- und Urheberrecht. Der Satz steht einmal hier und wird unten
> nicht wiederholt.

---

## 1 · Der Anlass, und was davon stimmt

Klaus hat gehört, in den USA habe ein „Vibecoder" einen Prozess verloren und **alle
Rechte an seinen Apps** eingebüßt, weil Anthropic per Wasserzeichen nachgewiesen habe,
dass Claude der eigentliche Urheber sei. Am 2026-08-16 nachgesehen — hier der Befund,
Behauptung für Behauptung:

| Behauptung | Befund |
|---|---|
| Ein Prozess, in dem einem Entwickler wegen Anthropic-Wasserzeichen die Rechte aberkannt wurden | **Nicht auffindbar.** Weder in den laufenden Fall-Übersichten (Norton Rose Fulbright, Mishcon de Reya, ailawsuittracker.com) noch in der Fachpresse. |
| Claude setzt Wasserzeichen | **Stimmt, und es ist neu.** Seit dem **2026-08-02** tragen Ausgaben neuer Claude-Modelle ein unsichtbares Text-Wasserzeichen; erzeugte Dateien bekommen zusätzlich signierte Herkunftsdaten nach dem C2PA-Standard. Weltweit, nicht nur in Europa. |
| Dadurch bekommt Anthropic Rechte an den Apps der Nutzer | **Nein.** Das Wasserzeichen ist eine **Transparenz-Markierung**, kein Eigentumsvermerk. Anthropic sagt selbst: ein gefundenes Wasserzeichen zeigt, dass Claude den Inhalt **verarbeitet** hat — nicht, dass Claude ihn verfasst hat. Menschen lassen ihre eigenen Texte übersetzen und überarbeiten; das trägt dieselbe Markierung. |
| Anthropic zieht gegen Nutzer vor Gericht | **Umgekehrt.** Der große Fall des Jahres 2026 (Vergleich über 1,5 Mrd. USD, Endgenehmigung 2026-07-20) hatte Anthropic als **Beklagte** — es ging um Bücher in den Trainingsdaten, nicht um Nutzer-Apps. |
| Es gibt trotzdem ein echtes rechtliches Thema dahinter | **Ja, aber ein anderes.** Siehe Abschnitt 4. |

**Wie das Gerücht wahrscheinlich entstanden ist.** Drei echte Nachrichten aus denselben
zwei Wochen sind zu einer Geschichte verschmolzen: die Wasserzeichen (real, aber harmlos),
der Anthropic-Vergleich (real, aber Anthropic war die Beklagte) und die Rechtsprechung
zur fehlenden Schutzfähigkeit rein maschinell erzeugter Werke (real, aber sie nützt
Anthropic nichts). Aus drei richtigen Teilen wurde eine falsche Erzählung.

**Prüftiefe, ehrlich gesagt:** die Anthropic-Seiten selbst (`anthropic.com`,
`support.claude.com`) waren aus dieser Sitzung heraus nicht abrufbar — der Netz-Zugang
dieser Umgebung lässt sie nicht durch. Geprüft wurde über Suchergebnisse und
Fachberichterstattung, die den Wortlaut wiedergeben. **Ein Blick in die Originale lohnt
sich einmal selbst**, die Adressen stehen in Abschnitt 11.

---

## 2 · Was das Wasserzeichen ist, und was es nicht ist

**Was es ist.** Eine Pflicht aus **Artikel 50 der EU-KI-Verordnung**: maschinell erzeugte
Inhalte sollen maschinell erkennbar sein. Zwei Techniken:

- **Text-Wasserzeichen** — die Wortwahl des Modells wird statistisch leicht verschoben.
  Über genügend Text ergibt das ein erkennbares Muster. Es überlebt Kopieren und
  Einfügen und Formatwechsel.
- **C2PA-Herkunftsdaten** — eine signierte Notiz in der Datei: von welchem Werkzeug,
  wann, und ob jemand daran manipuliert hat.

**Was es nicht ist.** Kein Eigentumsvermerk, keine Urheber-Angabe, keine Lizenz-Sperre.
Es ist näher am Prüfstempel als am Namenszug.

**Wo es an Grenzen stößt** — auch das sagt Anthropic selbst:

- Umschreiben (Paraphrase) schwächt das Text-Wasserzeichen bis zur Unlesbarkeit ab.
- Ein Bildschirmfoto oder ein erneutes Speichern entfernt die C2PA-Daten vollständig.
- **Bei Code ist es bewusst schwächer** als bei Fließtext: funktionierender Code lässt
  kaum freie Wortwahl zu. Wo Spielraum ist — etwa in Kommentaren — kann markiert werden,
  in der Logik selbst kaum.

**Was daraus für dieses Netz folgt: nichts.** Kein Modul, keine App, keine Seite verliert
durch eine Markierung irgendein Recht. Wer wissen will, wer etwas gebaut hat, liest die
Git-Historie — die ist genauer als jedes Wasserzeichen und liegt seit dem ersten Tag vor.

---

## 3 · Was Anthropics Bedingungen sagen

Der Kern, in beiden Fassungen (Verbraucher und kommerziell) gleichlautend:

- **Der Kunde behält die Rechte an seinen Eingaben und erhält die Rechte an den
  Ausgaben.** Anthropic tritt seine etwaigen Rechte an den Ausgaben ausdrücklich an den
  Kunden ab.
- **Anthropic erhebt keinen eigenen Anspruch** auf Kundeninhalte.
- **Es gibt keine Beteiligungs-, Umsatz- oder Lizenzgebühren-Klausel.** Nichts, was an
  Einnahmen anknüpft, und erst recht nichts, was an *Ersparnissen* anknüpft. Die
  Vorstellung „eines Tages sagen die, du hast so viel gespart, gib was ab" hat in den
  Bedingungen keinen Anker.
- Für die kommerzielle Nutzung tritt sogar das Gegenteil hinzu: Anthropic **verteidigt**
  Kunden gegen Urheberrechts-Vorwürfe wegen der Nutzung des Dienstes und der Ausgaben.

**Der ehrliche Vorbehalt.** Bedingungen können geändert werden — für die **Zukunft**.
Eine spätere Fassung kann keine rückwirkende Eigentümerstellung an dem begründen, was
2026 entstanden ist; dafür bräuchte es einen Vertrag, den Klaus schließt, nicht eine
einseitige Änderung. Wer ganz sicher gehen will, sichert die heute geltende Fassung ab
(siehe Abschnitt 9, letzter Punkt).

---

## 4 · Das echte Thema: nicht wem es gehört, sondern ob es überhaupt jemandem gehört

Hier liegt der wahre Kern, den das Gerücht verdreht hat.

**Deutschland.** § 2 Abs. 2 UrhG verlangt eine **persönliche geistige Schöpfung**;
§ 69a UrhG sagt für Software dasselbe. Ein Mensch muss das Werk geprägt haben. Rein
maschinell erzeugter Code ist danach **nicht geschützt** — nicht, weil ein Anbieter die
Rechte hätte, sondern weil **niemand** sie hat. Ein bloßer Prompt reicht nach heutigem
Stand nicht; es braucht die menschliche Prägung: Auswahl, Anordnung, Nachbearbeitung,
Entwurf.

**USA.** Dieselbe Linie, anderer Weg: *Thaler v. Perlmutter* (D.C. Circuit) und die
ständige Praxis des US Copyright Office — ohne menschliche Urheberschaft keine
Registrierung, kein Schutz.

**Was das für einen Prozess bedeutet.** Wer wegen eines nachgebauten Programms klagt und
nur generierte Bausteine vorweisen kann, kann verlieren. Von außen sieht das aus wie
„ihm wurden die Rechte aberkannt". Gewonnen hat dabei aber niemand die Rechte — sie sind
schlicht **frei**. Anthropic steht in dieser Konstellation überhaupt nicht auf dem Feld.

---

## 5 · Was in diesem Netz die menschliche Schöpfung trägt

Genau hier steht Klaus besser da als fast jeder, der „mit KI gebaut hat" — und
paradoxerweise ist es der Teil, der bisher **nirgends als Rechte-Aussage aufgeschrieben**
war. Die Prägung ist da, sie war nur nicht benannt. Nachprüfbar, mit Fundstelle:

| Was | Wo es liegt | Warum es trägt |
|---|---|---|
| **Die Architektur** des Protokolls | `docs/ARCHITEKTUR.md`, `docs/INTERFACES.md` | Die Verträge zwischen den Modulen sind Entwurfsentscheidungen, keine Ausgabe. Ein Schwellenwert von 0,80, ein Empfangsmodus ohne Pulsation, die Trennung Hub/Endknoten — das hat sich niemand generieren lassen. |
| **Auswahl und Anordnung** der 25 Module | `docs/components/*`, `status.json` | Welches Modul es gibt, was es darf, was ausdrücklich nicht — das ist die Sammlung, und die Sammlung ist die Schöpfung. |
| **Die Spezifikationen** | `docs/INTERFACES.md`, `docs/components/<NN>_*.md` | Eigenständige Sprachwerke, unabhängig vom Code. |
| **Die Vier-Schichten-Lesart und die Vision** | `docs/einladung/einladung.md`, `docs/components/_vision_*.md` | Vier Sprachen, ein durchgehaltenes Bild. Konzeptarbeit. |
| **Die Kalibrierung** | `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`, `RELATEDNESS_CENTER` v2 | Messreihen, Entscheidungen an Messwerten, verworfene Wege. Das ist Forschungsarbeit mit Protokoll. |
| **Die Wirtschafts- und Marktentscheidungen** | `docs/PLAN_PILZ_WIRTSCHAFT.md` | Ein durchargumentiertes Papier, keine generierte Liste. |
| **Der Verlauf** | `docs/PULS.md`, `docs/sessions/BRIEF_*`, Git-Historie | Über 800 Vorgänge mit Datum, Begründung und Widerruf. Der beste Urheberschafts-Nachweis, den man haben kann — er zeigt das **Ringen**, nicht nur das Ergebnis. |
| **Die Marken und Namen** | WorkFloh, SBKIM, Sage-Protokol, die Kim-Familie, PWA Toolpoint | Benennung ist Gestaltung; siehe Abschnitt 7. |

**Die Rolle der KI-Werkzeuge dabei** ist die eines Werkzeugs — wie ein Compiler, ein
Zeichenprogramm oder eine Rechtschreibprüfung. Sie führt aus, was in den Briefen, Karten
und Tafeln festgelegt wurde. Wer die `docs/sessions/BRIEF_*`-Kette liest, sieht, dass die
Vorgabe stets von Klaus kam und jede Sitzung an sie gebunden war.

---

## 6 · Was ehrlicherweise **nicht** geschützt ist

Das gehört genauso dazu, sonst ist das Papier eine Beruhigungspille:

- **Triviale erzeugte Schnipsel** — eine Hilfsfunktion, eine Schleife, eine
  Standard-Fehlerbehandlung. Daran hat niemand Rechte, auch Klaus nicht.
- **Allerwelts-Gerüst** — Manifest-Dateien, Service-Worker-Standardmuster,
  CSS-Zurücksetzer.
- **Bloße Ideen** — die Idee „Apps finden sich über Bedeutung" ist frei. Geschützt ist
  ihre **konkrete Ausformung**: diese Spezifikation, dieser Code, dieser Text.
- **Das Protokoll als Idee, gewollt frei** — SBKIM **soll** nachgebaut werden können.
  Das ist keine Schwäche, sondern eine Entscheidung (siehe `PLAN_PILZ_WIRTSCHAFT.md` und
  die Lizenz A in Abschnitt 8).

---

## 7 · Mehrere KI-Anbieter überlagern keine Rechte

Klaus' Überlegung war: wenn das System bewusst mit mehreren Anbietern arbeitet
(Anthropic, OpenAI, Google, europäische Modelle), überlagern sich deren Rechte, und
keiner kann etwas beanspruchen.

**Das Ziel stimmt, der Weg nicht.** Es gibt gar nichts zu überlagern: kein Anbieter hält
Rechte an den Ausgaben. Sie treten sie ab oder haben von vornherein keine. Mehrere
Anbieter zu nutzen **addiert also keine Ansprüche — begründet aber auch keine.** Der
Schutz kommt nicht aus der Zahl der Werkzeuge, sondern aus der menschlichen Prägung
(Abschnitt 5).

**Wofür die Multi-Anbieter-Auslegung sehr wohl gut ist:** sie ist ein
**Unabhängigkeits**-Argument, kein Rechte-Argument. SBKIM ist kein Anthropic-Produkt und
kein OpenAI-Produkt. Es ist ein neutraler Treffpunkt, und genau das macht es für Dritte
überhaupt erst annehmbar. Das gehört in die Vermarktung, nicht in die Rechte-Frage.

**Zum Protokoll selbst:** die Spezifikation ist ein Sprachwerk von Klaus. Dass sie
beschreibt, wie fremde KI-Systeme miteinander reden sollen, gibt diesen Systemen oder
ihren Herstellern keinerlei Anteil daran — so wenig, wie ein Wörterbuch dem Verlag
Rechte an den Gesprächen gibt, die damit geführt werden.

---

## 8 · Wie die Rechte hier geregelt sind: zwei Lizenzen

Die Tafeln des Netzes sagen zwei Dinge, die sich nur scheinbar widersprechen: *das
Protokoll soll nachgebaut werden können* und *die Apps sollen verkäuflich sein*. Deshalb
zwei Lizenzen, klar getrennt:

**A · Protokoll-Lizenz** (offen, mit Namensnennung, Weitergabe erlaubt)
für `Sage-Protokol`, `SB-KIMTool-Point`, `mycel-karte`.
Wer SBKIM nachbauen, forken oder in eigene Apps einbauen will, darf das. Genau dafür
wurde es geschrieben. Bedingung ist die Namensnennung und der Hinweis auf die Herkunft.

**B · App-Lizenz** (freie Nutzung der bisherigen Versionen, Stichtags-Vorbehalt,
Weiterverbreitung nur mit Zustimmung) für alle übrigen Repos.
Vorbild und Muster ist die seit 2026 bestehende `Mein-WorkFloh/LICENSE`.

Welche Lizenz für ein Repo gilt, steht in dessen `LICENSE` und in dessen `RECHTE.md`.

**Ein Fork ist kein Vorfall.** Er kopiert nur schon Öffentliches, gibt keinen
Konto-Zugriff, ändert am Original nichts und bleibt als „forked from" gekennzeichnet.
Bei einem Repo wie SB-KIMTool-Point ist er die vorgesehene Reaktion. Siehe
`CLAUDE.md` § „Fork ≠ Vorfall".

---

## 9 · Was tatsächlich schützt

In der Reihenfolge ihrer Wirkung:

1. **Die Git-Historie mit Zeitstempel.** Sie belegt, wer wann was entschieden hat, mit
   Begründung und mit den verworfenen Wegen. Das ist der stärkste Nachweis menschlicher
   Prägung, den es gibt — und er ist bereits vollständig vorhanden.
2. **Die Dokumentation.** `INTERFACES.md`, die Karten, die Brief-Kette, `PULS.md`. Sie
   zeigt, dass Vorgabe und Entwurf vom Menschen kamen.
3. **Ein Urheberrechtsvermerk an jeder Datei, die nach außen geht.** Steht bereits in den
   `index.html`-Köpfen und in den Impressen.
4. **Eine Lizenzdatei je Repo.** Der Punkt, der bis 2026-08-16 fehlte: von 33 Repos hatte
   **eines** eine `LICENSE`. Das ist jetzt behoben.
5. **Das Impressum.** § 5 DDG, und zugleich der Ort, an dem eine natürliche Person
   erkennbar hinter dem Werk steht.
6. **Der eigene `_CR`-Block** in Rezeptbuch und Mixarium. Klaus' eigenes Wasserzeichen,
   seit langem eingebaut — die Ironie der ganzen Sorge.
7. **Eine gespeicherte Kopie der heute geltenden Anbieter-Bedingungen**, mit Datum. Wer
   sich später auf eine Rechte-Abtretung berufen will, sollte den Wortlaut haben, der zum
   Zeitpunkt der Erstellung galt. Ein PDF im Ordner genügt.

## 10 · Was nicht schützt

- **Obfuskation.** Web-Code ist immer lesbar. Verschleierung kostet Geschwindigkeit und
  hält niemanden auf. Ausdrücklich nicht der Weg — siehe `CLAUDE.md` § „Fork ≠ Vorfall"
  und `PLAN_PILZ_WIRTSCHAFT.md` § 12.
- **DRM oder Gerätebindung.** Teuer, bricht das Vertrauensversprechen der Apps, hält
  ebenfalls niemanden auf.
- **Verschweigen, dass KI beteiligt war.** Bringt nichts (die Markierung ist da) und
  beschädigt genau die Glaubwürdigkeit, von der PWA Toolpoint leben soll.

---

## 11 · Namen und Marken — ein Zeiger, kein Rat

Urheberrecht schützt das Werk, nicht den **Namen**. Für Namen gilt das Markenrecht, und
da gibt es zwei Stufen:

- **Ohne Eintragung** kann ein geschäftlich benutzter Name als
  Unternehmenskennzeichen Schutz genießen (§ 5 MarkenG) — abhängig von Bekanntheit und
  tatsächlicher Benutzung, und in der Reichweite begrenzt.
- **Mit Eintragung** beim DPMA ist der Schutz klar umrissen und durchsetzbar; er kostet
  Gebühren und muss gepflegt werden.

Betrifft konkret: **WorkFloh**, **SBKIM**, **Sage-Protokol**, die **Kim-Familie**
(Kimboard, Kimseek, Kimhub, Kim-Bell, Kim-sync), **PWA Toolpoint**, **BookLedgerPro**.
Sobald Stufe 2 aus `PWA-Toolpoint/CLAUDE.md` § „Die Stufen" erreicht ist — also der erste
Preis genannt wird —, lohnt die Frage, ob mindestens einer dieser Namen eingetragen
werden soll. Das ist eine Kosten-Nutzen-Entscheidung für Klaus, nicht für eine Sitzung.

---

## 12 · Die Geld-Frage, zusammengefasst

- **Anthropic kann nichts von Klaus verlangen**, weder an Umsatz noch an Ersparnis. Es
  gibt keine Klausel, an die sich das hängen ließe; die Bedingungen sagen das Gegenteil.
- **Was Klaus zahlt**, ist das Abonnement. Damit ist die Nutzung abgegolten.
- **Was Klaus beachten muss**, liegt woanders: die Nutzungsrichtlinien des Anbieters
  (was man mit dem Werkzeug bauen darf), und die **Gewerbe-Schwelle** — sobald zum ersten
  Mal etwas gegen Bezahlung angeboten wird, wird das Gewerbe angemeldet, vorher nicht,
  aber auch nicht später (`PWA-Toolpoint/CLAUDE.md` § „Die Stufen",
  `PLAN_PILZ_WIRTSCHAFT.md`).
- **Solange nur gezeigt und nichts verkauft wird**, entsteht keine dieser Pflichten.

---

## Quellen (abgerufen 2026-08-16)

**Wasserzeichen**
- Anthropic: „How Claude's text watermarking works" — <https://www.anthropic.com/news/claude-text-watermark>
- Claude-Hilfe: „How Claude marks AI-generated content" — <https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content>
- TechCrunch, 2026-08-11 — <https://techcrunch.com/2026/08/11/anthropic-says-it-will-watermark-text-generated-by-its-ai-models/>
- TechCrunch, 2026-08-15 (Einzelheiten, auch zu Code) — <https://techcrunch.com/2026/08/15/anthropic-shares-more-details-about-how-claudes-new-watermarks-will-work/>
- Forbes, 2026-08-13 — <https://www.forbes.com/sites/anishasircar/2026/08/13/claude-will-now-leave-a-watermark-on-everything-it-writes-what-does-that-mean/>

**Bedingungen und Rechte an den Ausgaben**
- Anthropic Commercial Terms — <https://www.anthropic.com/legal/commercial-terms>
- Anthropic Consumer Terms — <https://www.anthropic.com/legal/consumer-terms>
- Anthropic: „Expanded legal protections and improvements to our API" — <https://www.anthropic.com/news/expanded-legal-protections-api-improvements>

**Der Vergleich 2026 (Anthropic als Beklagte)**
- Lieff Cabraser, Sammelklage der Rechteinhaber — <https://www.lieffcabraser.com/anthropic-authors-rights/>

**Schutzfähigkeit KI-erzeugter Werke**
- Norton Rose Fulbright, Übersicht 2026 — <https://www.nortonrosefulbright.com/en/knowledge/publications/ce8eaa5f/ai-in-litigation-series-an-update-on-ai-copyright-cases-in-2026>
- Vorys: „Vibe Coding & The Diminishing Role of Copyright in AI-Generated Software" — <https://www.vorys.com/publication-vibe-coding-the-diminishing-role-of-copyright-in-ai-generated-software>
- CMS: „KI-generierter Softwarecode in der Due Diligence" — <https://cms.law/de/deu/legal-updates/ki-generierter-softwarecode-in-der-due-diligence>
- e-recht24: „KI Urheberrecht" — <https://www.e-recht24.de/ki/13288-ki-urheberrecht.html>

---

## Pflege dieser Datei

Sie ist ein lebendes Dokument. Wer etwas Neues findet — ein Urteil, eine geänderte
Bedingung, eine eingetragene Marke —, trägt es hier ein, mit Datum und Quelle, und
vermerkt es in `docs/PULS.md`. Die `RECHTE.md` der anderen Repos verweisen hierher und
müssen dafür **nicht** angefasst werden.

**Änderungen**

- 2026-08-16 · angelegt · Faktencheck zum Wasserzeichen-Gerücht, zwei Lizenzen
  eingeführt, netzweiter Rollout von `LICENSE` + `RECHTE.md`, Mit-Bauer-Klarstellung.
