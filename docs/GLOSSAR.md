# Glossar

Kompaktes Vokabular für SBKIM. Bei unklarem Begriff zuerst hier nachsehen.
Alle Begriffe sind im Paper (`sbkim_paper.pdf`) ausführlicher beschrieben;
hier steht nur die Kurzform für den Sitzungsalltag.

---

**Anastomose**
Handshake zwischen zwei Knoten, nachdem ein semantisches Match festgestellt
wurde. Ergebnis: beide Knoten kennen sich gegenseitig namentlich
(Geschwisterliste). Biologische Analogie: Hyphen-Verschmelzung zwischen
Pilzfäden. → Modul 05.

**Anbieter (provider)**
Knotentyp, der nur auf eingehende Anfragen reagiert. Sendet selbst nichts.

**Apoptose**
Programmierter Selbst-Tod eines Knotens. Ausgelöst durch Quorum,
Schlüsselkompromittierung, Domänen-Stilllegung oder manuelle Auflösung
durch den Betreiber. Hinterlässt ein signiertes Vermächtnis. → Modul 07.

**Domäne**
Die kuratierte Thematik eines Knotens (z.B. "Kochrezepte" für Rezeptbuch,
"Cocktails" für Mixarium). Wird durch einen Domänen-Vektor (Embedding der
Beschreibung + Stichworte) repräsentiert.

**Embedding**
Vektor (Float32Array(384)) eines Textes, erzeugt durch das Modell
`Xenova/multilingual-e5-small`. Identische Bedeutung → ähnlicher Vektor
(Cosine-Sim hoch). → Modul 03.

**Endknoten**
Eine echte PWA des Betreibers, in die SBKIM eingebaut wurde. Aktuell
geplant: Rezeptbuch und Mixarium.

**Föderation**
Mehrere Knoten unterschiedlicher Betreiber, die sich gefunden und
verbunden haben. Kein zentraler Server, kein Verzeichnis.

**Geschwisterknoten**
Knoten, mit denen ein erfolgreicher Anastomose-Handshake stattgefunden
hat. Sind in der lokalen Liste eines Knotens gespeichert.

**Heterokaryose**
Datenaustausch zwischen verbundenen Geschwisterknoten. Inhalt:
Erfahrungswerte, neue Domänen-Stichworte, ggf. anonymisierte
Anfragestatistik. Niemals personenbezogene Daten. → Modul 06.

**Hub**
Dieses Repo (Sage-Protokol). Spezifikations- und Bauplatz, kein Knoten.

**Hybrid**
Knotentyp, der sowohl antwortet als auch eigene Anfragen sendet. Default
für Endknoten.

**Knoten**
Eine Instanz eines SBKIM-fähigen PWA-Repos. Hat eine `node_id`, eine
Domäne, einen Knotentyp und eine Spore. Lebt im Browser-Storage seiner
Nutzer.

**node_id**
SHA-256 des öffentlichen Ed25519-Schlüssels eines Knotens. Eindeutig,
nicht regenerierbar. Geht der private Schlüssel verloren, ist der Knoten
tot.

**Quorum**
Kollektive Misstrauensschwelle. Wenn genug Geschwisterknoten einem Knoten
misstrauen, löst sich dieser per Apoptose auf. Schwellwert in
`docs/components/07_apoptose.md`.

**Spore**
Signierte JSON-Visitenkarte eines Knotens. Enthält `node_id`,
öffentlichen Schlüssel, Domäne, Endpunkt-Pfade, Protokoll-Version,
Signatur. Wird unter `/.well-known/sbkim/spore.json` ausgeliefert. → Modul 02.

**Suchender (seeker)**
Knotentyp, der eigene Anfragen ins Netz sendet, aber selbst nicht
antwortet.

**Vermächtnis (legacy)**
Signierte Abschiedsnachricht eines apoptotisch sterbenden Knotens. Warnt
Geschwisterknoten und nennt ggf. den Grund (z.B.
"Schlüssel kompromittiert"). Aufbewahrungsfrist konfigurierbar.

---

## Arbeits-Vokabular dieses Repos

**Bausitzung**
Eine Claude-Sitzung, die genau ein Modul implementiert.

**Briefing**
Der initiale Text, mit dem eine Bau- oder Spec-Sitzung gestartet wird.
Vorlage: `docs/sessions/BRIEFING_TEMPLATE.md`.

**Hauptsitzung**
Eine Claude-Sitzung, die koordiniert, integriert und das Gesamtbild hält.

**Komponenten-Karte**
Eine Datei `docs/components/<NN>_<name>.md`. Enthält die Spezifikation
eines Moduls und seinen aktuellen Bauzustand.

**PULS**
Datei `docs/PULS.md`. Lebender Status. Wird von jeder Sitzung am Ende
verpflichtend gepflegt.

**Sichttest / manueller Sichttest**
Browser-basierte Prüfung, dass ein Modul tut, was es soll. Über
`tests/manual_check.html`.

**Spec-Sitzung**
Eine Claude-Sitzung, die eine leere Komponenten-Karte mit Detail-Spec
füllt. Schreibt keinen Code.

**Übergabeprotokoll**
Datei in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`. Wird am Ende
jeder Sitzung angelegt.
