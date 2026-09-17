# Brief an die nächste Sitzung — die Rezept-Börse: JSON-Rezepte kostenlos teilen, mit Spendenknopf

**Geschrieben am 2026-09-17** von der Sitzung, die die KI-Schulung auf beide Seiten
gestellt hat (`docs/sessions/archiv/2026-09-17_ki-schulung-veroeffentlicht.md`).

**AUFTRAG (Klaus, im Chat, in drei Nachträgen):** *„eine Möglichkeit suchen, auf
meinem Hetzner Server Dateien hochzuladen von meinem Rezeptbuch. JSON-Dateien, die
als Rezepte eingefügt werden können von anderen, also wieder heruntergeladen werden
können. Und zwar kostenlos."* — *„kostenlos mit Vorbehalt. Ich möchte gern auch Geld
haben dafür, dass es auch Arbeit war. Aber das mache ich jetzt später. Das soll aber
mit eingeplant werden. Vielleicht unter einem Spendenbutton."* — *„es soll auch in
family projekt.de."*

---

## 1 · Pflichtlektüre

1. `CLAUDE.md` dieses Depots (Sitzungsstart-Pflicht, Befund/Rat-Regel).
2. `docs/PULS.md`, oberster Eintrag.
3. Diesen Brief zu Ende.
4. `family-project/CLAUDE.md` § „Was hier leicht kaputtgeht" und
   `family-project/server/README.md` — die drei Maschinen und was wo läuft.
5. `Mein-Rezeptbuch/CLAUDE.md` § „HERKUNFT AM REZEPT" — das Export-Format v10.
6. Skills `seiten-bauregeln`, `app-container-schaufenster` (family-project),
   `auslieferung-pruefen-und-sperren` (bevor irgendetwas auf den Server geht).

## 2 · Was schon da ist — nicht neu bauen

| Was | Wo | Stand |
|---|---|---|
| Export/Import von Rezepten als JSON | Mein-Rezeptbuch, Muttis-Rezeptbuch, Mein-Mixarium | `version: 10`, trägt je Rezept `uid` und `herkunft` (Knoten-Kennung + Datum, **nie** ein Gerätename). Der Import erkennt Dubletten an `uid` und bringt Ordner mit |
| Spenden ohne Betrag | `family-project/assets/config/spenden.js` (`FP_SPENDEN`, PayPal.Me) · `PWA-Toolpoint/assets/config/kaffeekasse.js` | scharf, freiwillig, sperrt nichts. **Das ist Klaus' „Spendenbutton"** — nichts Neues erfinden |
| Auslieferung family-projekt.de | Hetzner **Cloud**, Caddy im Docker, `deploy/auto-pull.sh` zieht `main` alle zwei Minuten | gibt **jede** Datei des Depots als Klartext heraus — kein PHP, keine Uploads |
| Einreichen + Freigeben | Hetzner **Webhosting** (Apache + PHP): `server/einreichung.php`, `server/freigabe.php` — schreiben per GitHub-Token ins Depot | der einzige vorhandene Weg, aus einem Formular etwas ins Depot zu bekommen |

## 3 · Der Vorschlag — Befund und Rat getrennt

**Befund:** ein „Upload auf den Server" braucht auf der Cloud-Maschine einen
schreibenden Dienst, den es dort nicht gibt und der (Fremdnutzer-Brille) sofort
Missbrauch, Speicher- und Rechtsfragen aufmacht (fremde Rezepte mit fremden Bildern
und Namen). **Was es dagegen schon gibt, ist das Depot:** was auf `main` liegt, ist
zwei Minuten später online, versioniert, und der Weg dorthin ist für Klaus derselbe
wie für jede Seite.

**Rat (drei Stufen, jede für sich fertig):**

1. **Stufe A — Klaus' eigene Rezepte, Download für alle.** Ordner
   `family-project/rezepte/` mit JSON-Dateien im v10-Format (Klaus exportiert aus dem
   Rezeptbuch, legt die Datei ab — per Termux oder als Anhang im Chat an eine Sitzung),
   dazu `rezepte/index.json` (Name, Beschreibung, Anzahl Rezepte, Datum, Dateiname) und
   eine Seite `werkzeuge/rezept-boerse.html` nach dem FP_TOOL-Muster: Liste, je Datei
   ein **echter Download**, daneben „so kommt es ins Rezeptbuch" (Import → Hinzufügen,
   Herkunft bleibt erhalten), Spenden-Knopf aus `FP_SPENDEN`. Karte in `werkzeuge.js`,
   Markt-Eintrag hinter der KI-Schulung, Sitemap, Cache-Bump, Wächter + Gegenprobe.
   **Dasselbe auf PWA Toolpoint** (Eintrag mit Kaffeekasse, Seite an der Wurzel oder
   Verweis auf family-projekt.de — Klaus fragen, ob eine Kopie oder ein Link).
2. **Stufe B — Fremde reichen ein.** Über `einreichung.php` auf dem Webhosting (der
   Weg existiert), mit Klaus' Freigabe im Studio, **nie** direkt online. Vorher der
   Prüfer über jede Datei: kein Personenbezug, keine Schlüssel, keine fremden
   Adressen in Bildern.
3. **Stufe C — Geld.** Erst Spende (jetzt), ein Preis später **nur mit Gewerbe**
   (PWA Toolpoint § Stufen). Ein Preis vor der Anmeldung wäre der Fehler, vor dem
   Toolpoints Wächter „kein Preis auf der Seite" steht.

## 4 · Fallen

- **Ein Rezept-JSON kann Personenbezug tragen** — Klaus' eigene Ordner-Namen,
  Notizen, Bilder mit Menschen. Vor dem Ablegen: Prüfer über die Datei, Bilder
  ansehen. Die Herkunfts-Kette trägt nur Kennungen; das ist gewollt und bleibt so.
- **Eine Datei, die Sushi in „Knabbereien" verwandelt.** Kategorien-Kennungen aus
  dem Rezeptbuch kommen im Mixarium als „fremd" an — das ist seit dem 2026-09-16
  gewollt (eigener Reiter), aber auf der Börsen-Seite gehört dazu ein Satz, welche
  App die Datei geschrieben hat.
- **`safeImg` im Markt verlangt eine https-Adresse ohne `.svg`** — ein Karten-Bild
  aus dem Depot muss unter `https://family-projekt.de/…png` liegen.
- **Der Cache-Bump wird gegen `origin/main` geprüft** — family-project steht auf
  `v121`, PWA Toolpoint auf `v61`, und dort trägt jede `?v=` dieselbe Zahl.
- **Frisch von `origin/main` abzweigen**, in jedem Depot; in PWA Toolpoint committet
  der nächtliche Messwerte-Lauf von allein.

## 4b · Eine Kleinigkeit mit Datum — der Sichttest der KI-Schulung

Der Eintrag `eigen-ki-schulung` in `PWA-Toolpoint/assets/config/listings.js` trägt
`sichttest: "ausstehend"`. **Sobald Klaus die Seite im Browser angesehen hat**, wird
daraus sein Datum — nicht vorher, und nicht von einer Sitzung im Voraus gesetzt.
Ein Wächter besteht darauf, dass dort eines der drei zulässigen Dinge steht; ein
erfundenes Datum wäre genau die Sorte Grün, gegen die er gebaut ist.

Fragen, ob er sie sich angesehen hat, statt zu warten — die Adressen stehen im
Protokoll `docs/sessions/archiv/2026-09-17_ki-schulung-veroeffentlicht.md`.

## 5 · Offene Fragen an Klaus

1. Stufe A reicht für den Anfang — oder sollen Fremde von Beginn an einreichen können?
2. Auf PWA Toolpoint eine eigene Kopie der Börse oder nur der Eintrag mit Link?
3. Welche Rezepte zuerst — alles aus Mein Rezeptbuch, oder eine ausgewählte Datei?

## 6 · Abschluss-Befehl

`docs/PULS.md` fortschreiben (Stand: 2980 von 3000 Zeilen — **auslagern, nicht
kürzen**, wenn es eng wird) · Übergabeprotokoll unter `docs/sessions/archiv/` ·
Funde, die nicht dazugehören, in `docs/PFLEGE-LISTE.md` (zehn Punkte offen) ·
nächsten Brief als Codeblock im Chat · `SIGNAL.json` seq (91) nur erhöhen, wenn
wirklich etwas gemeldet wurde.
