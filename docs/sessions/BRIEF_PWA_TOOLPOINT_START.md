# BRIEF für die nächste Sitzung — PWA Toolpoint, Stufe 0 (2026-08-09)

**Freibrief gilt** (`CLAUDE.md` § Freibrief, netzweit): eigenständig bauen, eigene
PRs selbst mergen, wenn getestet, abgegrenzt und nicht architektonisch
zweifelhaft; bei echtem Zweifel erst Klaus fragen; **nie stillschweigend**
(Commit + PULS dokumentieren).

---

## Pflichtlektüre — in dieser Reihenfolge, vor dem ersten Handgriff

1. `Sage-Protokol/CLAUDE.md` — die Verfassung. Besonders § Sitzungsstart-Pflicht
   (immer frisch von `origin/main`), § Freibrief, § Tafel-Evolutions-Klausel,
   § Fremdnutzer-/Marktplatz-Brille, § Auslieferungs-Brille.
2. **`Sage-Protokol/docs/PLAN_PILZ_WIRTSCHAFT.md`** — das Wirtschafts-Papier.
   Für diese Sitzung besonders **§ 8b** (was der Klon ist), **§ 8b1** (warum
   eigenes Repo), **§ 8d** (der langsame Start), **§ 12** (was nicht gebaut
   wird), **§ 13** (rechtliche Punkte).
3. `Sage-Protokol/docs/PULS.md` — oberster Eintrag (Stand 2026-08-09 (11)).
4. `family-project/docs/BRIEF_UEBERGABE_2026-08-09_PLANMODUS.md`, Abschnitt 3
   und 4 — die zehn Lehren aus Fehlern und die Arbeitsweise mit Klaus.
5. Erst dann Code: `family-project/markt.html`, `assets/config/listings.js`,
   `server/einreichung.php` — die Teile, die kopiert werden.

Nicht lesen, was nicht gebraucht wird.

---

## Wo wir stehen — in fünf Zeilen

- **Kein Geld ist geflossen.** Nur ein Spenden-Hinweis auf der Seite. Über
  Beteiligungen wurde mit niemandem gesprochen — das kommt **in einer Woche**.
- **Das Wirtschafts-Papier steht** (Sage #803–#808, sechs Durchgänge): drei
  Säulen, Übersichtsblatt, innerer Kreis, offener Markt, langsamer Start.
- **Ein Bau ist erledigt:** Sicherungs-Erinnerung in Alis' Warenwirtschaft
  (Alis-Moderaum #37, 17/17 grün) — **Sichttest wartet auf Klaus**.
- **Entschieden:** der offene Markt wird ein **eigenes Repo** (nicht
  SB-KIMTool-Point umbenennen — 191 Dateien verweisen darauf, die Spore ist auf
  die alte Adresse signiert). Arbeitsname **PWA Toolpoint**.
- **Der Bau hängt an einer Sache:** Domain und endgültiger Name. Ohne die kein
  Repo.

---

## Auftrag dieser Sitzung: Stufe 0 — bauen, nichts anbieten

**Erst prüfen, ob Klaus die Domain entschieden hat.** Wenn nicht: fragen, und
solange nur die decision-freien Teile vorbereiten. **Nichts veröffentlichen.**

### Was gebaut wird

Ein neues Repo (Name nach Klaus' Entscheidung), das die Marktplatz-Maschine aus
family-project trägt:

1. **Byte-Kopien statt Neubau** (Bausatz-Regel, § 5): `markt.html`, die
   Suchmodule (03/04), das Einreich-Formular, der Vektor-Katalog, die
   Mess-Anzeige. **Nie die Kopie ändern — die Quelle ändern und neu kopieren.**
   Einen **Drift-Guard** von Anfang an mitliefern; das ist die ganze Miete für
   „nicht doppelte Wartung".
2. **Eigene Kennungen:** eigene DB-Kennung (**nicht** `familyproject`, sonst
   kollidieren die Datenbestände auf geteilter Adresse), eigene Spore, eigener
   Rendezvous-Raum.
3. **Eigenes Gesicht:** nüchtern, professionell, kein Community-Ton. Kein
   Sandkasten und keine Modell-Demo an der Eingangstür.
4. **Stufe-1-tauglich, aber noch nicht scharf:** ein Formular *„Ich hätte
   Interesse"*, **kein Preis, kein Prozentsatz, kein „jetzt eintragen für X €"**.
   Die Grenze zwischen Zeigen und Anbieten wird scharf gezogen (§ 8d).
5. **Impressum und Datenschutzerklärung** vorbereiten — gehören auch auf eine
   Seite, die nur zeigt.

### Was ausdrücklich NICHT gebaut wird

- **kein Bezahlvorgang** (§ 4b) · **keine automatische Auszahlung** (§ 4d)
- **kein Kopierschutz / keine Obfuskation** (Tafel in `CLAUDE.md`)
- keine Preise, keine Provisionslogik — das ist Stufe 2 und braucht die
  Gewerbeanmeldung davor
- **SB-KIMTool-Point wird nicht umbenannt und nicht ausgeräumt.** Es bleibt
  Werkzeug-Hub und Knoten. Was gebraucht wird, wird kopiert.

### Prüfung

Headless-Smoke, dessen **eigener Rückgabewert** über grün entscheidet — kein
`| tail` in der Kette (Lehre 3.3). Drift-Guard grün. Danach ehrlich:
*„Sichttest ungeprüft, wartet auf Klaus' Browser-Lauf."*

---

## Was Klaus tun muss (in dieser Reihenfolge)

1. **Namen und Domain entscheiden** und die Domain registrieren. Ohne sie kein
   Repo, ohne Repo kein Anfang. Maßstab aus § 8b: einmal laut vorlesen — wer
   danach nicht weiß, was es ist, ist es der falsche Name.
2. **Nichts weiter.** Kein Gewerbe, kein Konto, keine Verträge — das ist Stufe 2
   und kommt erst, wenn ein Preis auf der Seite steht.
3. **Zwei Sichttests offen** (nichts zu bauen, nur ansehen):
   - Alis' Warenwirtschaft: sitzt der Sicherungs-Hinweis gut im Kopf, auch
     schmal auf dem Tablet?
   - Marktplatz: bleiben die Apps grün, sind die grünen Quittungs-Bänder weg?
4. **In einer Woche:** das Gespräch über Beteiligungen. Danach steht fest, ob
   § 4d (Rohertrag) so gebaut wird.

---

## Offene Entscheidungen (§ 15 des Papiers)

Bezahlvorgang für Beauty's Shop · Grundlage der Beteiligung (Empfehlung:
Rohertrag) · innerer Kreis ja/nein · Everlast · Jahresbeitrag · **Name und
Domain des Marktes** · Provisionshöhe · verfügbare Zeit im Monat.

---

## Abschluss-Befehl (die Kette reißt nie ab)

Am Sitzungsende: `docs/PULS.md` fortschreiben · Übergabeprotokoll in
`docs/sessions/archiv/` · **neuen Brief nach diesem Muster anlegen und darin
Pflichtlektüre und diesen Abschluss-Befehl wiederholen** · den vollständigen
Brief als Codeblock in der Chat-Antwort ausgeben, weil Klaus zuerst den Chat
liest.
