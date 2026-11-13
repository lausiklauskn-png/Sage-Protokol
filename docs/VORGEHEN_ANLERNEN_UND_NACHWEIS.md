# Erkennung anlernen und nachweisen – das Vorgehen zum Wiederholen

**Stand:** 2026-11-13, nach der ersten vollständigen Runde (Datei-Organizer, BookLedgerPro, Familienakte; zweiter Prüfer Codex).
Dieses Blatt beschreibt den **Weg**, damit er sich wiederholen und auf weitere Apps ausdehnen lässt. Messzahlen und
Sitzungs-Befunde stehen in Kimhub (`forschung/`), die Regeln im Einzelnen im Repo Datei-Organizer
(`docs/PRUEFREGELN-GRUPPE.md`, `docs/PRUEFSTAPEL-VERMIETERIN-REGELN.md`). Der Briefkasten zum zweiten KI-System:
[`ZUSAMMENARBEIT_ANDERES_KI_SYSTEM.md`](ZUSAMMENARBEIT_ANDERES_KI_SYSTEM.md).

## Wozu

Eine App schlägt etwas vor (Ablagefach, Art, Absender, Frist, Konto). Ob ein Umbau das besser macht, soll sich **zeigen lassen**,
ohne echte Unterlagen aus der Hand zu geben – und so, dass niemand sich selbst benotet.

## Der Ablauf, eine Runde

| Schritt | Was | Wer | Was dabei nicht passieren darf |
|---|---|---|---|
| 1 | **Regeln vorab** einchecken: Frage, Felder, was als richtig zählt, Auswertung | Sitzung | nachträglich ändern, ohne Nachtrag mit Datum und Grund |
| 2 | **Lehrdaten** schreiben lassen (erfunden), daran lernen und abstimmen | Agenten ohne Einblick in App und Prüfstapel | an Prüfdaten lernen |
| 3 | **Einfrieren**: Stand der App mit Commit-Kennung festhalten | Sitzung | danach noch an der Erkennung drehen |
| 4 | **Prüfstapel** schreiben lassen, ungelesen einchecken | neuer Agent, kennt nur Auftrag, Listen, Fachregel | App, Lehrdaten oder alte Stapel kennen |
| 5 | **Drei Einordner** ordnen den Stapel unabhängig ein | Stapel-Autor, zweiter Agent, anderes KI-System über den Briefkasten | Lösungen oder Zahlen im Briefkasten |
| 6 | **Soll = Mehrheit** je Feld; ohne Mehrheit „strittig“, nicht gewertet; Einigkeit berichten | Werkzeug | das Soll von Hand richten |
| 7 | **Einmal messen**, alter gegen neuen Stand am selben Stapel, mit Spanne und Prüfung auf gesicherten Unterschied | Werkzeug | mehrfach messen und die beste Zahl nehmen |
| 8 | **Berichten**: auch was schlechter wurde, eigene Fehler, Werkzeugfehler, was nicht gemessen ist | Sitzung | „nicht gemessen“ als 0 % ausgeben |
| 9 | **Verbraucht**: am Stapel darf jetzt gelernt werden, als Nachweis taugt er nicht mehr | – | denselben Stapel zweimal als Beweis nehmen |
| 10 | **Übernehmen** nur, was gesichert besser ist – byte-gleich mit Pin, keine zweite Fassung | Sitzung, Ausgabe nur auf Klaus' Wort | einen Baustein ohne Nachweis in eine andere App tragen |

## Was die Runde 2026-11-12/13 dazugelernt hat

- **Form wechseln:** Dieselben Stücke als Text und als gesetzte, „gescannte“ Seiten durch die Texterkennung der App schicken.
  Gemessen wird beides; der Unterschied zeigt, was die Texterkennung kostet.
- **Die Kette messen, nicht nur die Glieder:** vom gescannten Stück über Sortierung und Frist bis zur geplanten Erinnerung. Jede
  verlorene Frist wird dem Glied zugeordnet, an dem sie verloren ging.
- **Folgejahr:** derselbe erfundene Haushalt ein Jahr später mit geänderten Werten; gemessen mit und ohne das im ersten Jahr
  „Gemerkte“. So zeigt sich, ob Merken hilft – und ob es schadet, wenn derselbe Absender zu verschiedenen Sachen schreibt.
- **Kreuztest:** Jedes System an den Unterlagen messen, die das andere System geschrieben hat. Beide waren an fremder Machart
  deutlich schwächer; ein Nachweis an eigener Machart reicht darum nicht.
- **Vergleich fair stellen:** Die zu vergleichende App bekommt die Stücke so, wie sie sie im Betrieb bekommt (Dateiname und Art wie
  in echt). Ein erster Vergleich mit Textdateien stellte die Familienakte schlechter, als sie ist, und wurde berichtigt.
- **Abstimmwerte sind kein Nachweis:** Ein auffällig guter Wert beim Abstimmen kam daher, dass der Stand schon an den Prüfdaten
  gelernt hatte. Abstimmen nur mit abgeschaltetem Gelernten oder an verbrauchten Stapeln.
- **Zeit mitmessen:** je Glied die Zeit je Stück, hochgerechnet als Orientierung, mit der Maschine dazugeschrieben.

## Ausdehnen auf weitere Apps

1. Eine neue App bekommt zuerst eine **Standmessung** an einem vorhandenen, noch unverbrauchten oder neuen Stapel ihrer Art.
2. Ein Baustein aus einer anderen App kommt erst hinein, wenn er **dort** am fremden Stapel gesichert besser ist als das Vorhandene.
3. Jede Runde ändert **eine** Bedingung (Gegend, Lebenslage, Form, Zeit, Schreiber), damit sichtbar bleibt, woran es liegt.
4. Stapel, Einordner-Pakete, Messung und Bericht entstehen durch **Werkzeuge im Repo**, nicht von Hand – ein Aufruf je Jahr oder
   Runde. Wer die Runde wiederholt, ruft dieselben Werkzeuge auf.
5. Der zweite Prüfer aus einem anderen KI-System bleibt **unabhängig**: Er liest nur den Briefkasten und entwirft sein Vorgehen selbst.

## Grenzen

Alles Bisherige gilt für **erfundene** Unterlagen, die KI-Agenten geschrieben haben. Eine Aussage über echte Unterlagen braucht
eine Stichprobe auf dem Gerät des Nutzers, von der nur Zahlen das Gerät verlassen. Geräte (Tablet, Handy), die Glocke am Gerät
und die Suche über die Knoten sind in dieser Runde nicht gemessen.
