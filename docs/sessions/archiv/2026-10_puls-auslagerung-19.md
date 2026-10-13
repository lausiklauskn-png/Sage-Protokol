# PULS-Auslagerung 2026-10-13 — „Das gelbe Band lag über der Knopfleiste“

**Ausgelagert am 2026-10-13**, weil `docs/PULS.md` über der 3000-Zeilen-Grenze stand
(3046 Zeilen nach dem Eintrag „Eigenes Netz Schritt 4+5“). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-09-17 · Das gelbe Band lag über der Knopfleiste — jetzt ist es eine Pille

**Klaus mit Bild aus der eingebetteten Demo-Seite:** *„nur das große
Erklärfenster, das gelbe, wo alles drin steht … das muss nicht sein, das kann
weg sein, das steht ja schon in dem Text."*

Er hatte **zweimal** recht. Das Band stand `position: fixed` mittig unter der
Kopfzeile, trug drei Zeilen Erklärung — und im Rahmen der Demo-Seite lag es
**über der Knopfleiste**: „Analyse aus" war dahinter nicht mehr zu treffen.

Es ist jetzt eine kurze Pille in der Reihe neben „Kanal" und „Ereignisse":
`▶ Mitschnitt 2026-09-10 · kein Live-Verkehr`. **Gemessen im Rahmen der
Demo-Seite (818 px):** Pille und Knopf stehen beide bei y[49,75], und
`elementFromPoint` auf der Knopfmitte trifft `recLbl` — der Knopf ist frei.

⚠ **TAFEL-EVOLUTIONS-KLAUSEL, AUSDRÜCKLICH BENANNT.** Die alte Zusicherung
lautete *„Das Band sagt, was es ist: echter Verkehr, von wann, gleichmäßig
abgespielt — nicht im Originaltempo — und kein Live-Verkehr."* Sie ist **nicht
gestrichen, sondern umgezogen**: von wann, aus wie vielen Aufzeichnungen und
„nicht im Originaltempo" stehen jetzt in der **Start-Meldung im Protokoll** und
im Hinweistext des Reglers. `wiedergabe.mjs` misst den Satz seitdem
**innerhalb der `logEvent`-Zeile** — ein Umzug darf eine Zusicherung nicht
still weicher machen.

⚠ **UND DER NEUE WÄCHTER WAR BEI 1280 px BLIND.** Nachgestellt mit dem alten
Kasten über acht Breiten: zugedeckt ist der Knopf zwischen **480 und 1000 px**;
bei 1280 ist die Kopfzeile einreihig und bei 400 dreireihig, dort ist er frei.
**Die Vorgabe von Playwright ist 1280** — genau die eine Breite, bei der der
Fehler nicht auftritt. Die Ausgangslage wird deshalb gesetzt (900 px), mit
einem Selbst-Riegel darauf, dass die Kopfzeile dort wirklich umbrochen ist.

⚠ **UND DIE GEGENPROBE VON HAND MUSSTE BEIDES ZURÜCKDREHEN.** Mit dem festen
Kasten allein blieb der Browser-Wächter grün — die kurze Pille reicht dort gar
nicht bis zum Knopf. Erst mit festem Kasten **und** langem Text fiel er, mit
`demoBadge` als dem, was obenauf liegt. *Wer zwei Dinge zugleich ändert und nur
eines zurückdreht, hat seinen Wächter nicht geprüft.*

**Netzweit nachgezählt, gegen `origin/main` aller 34 Repos:** die Karte mit
Wiedergabe gibt es **zweimal** (`mycel-karte`, Sages abgeleitete Kopie), und
**drei** Seiten binden sie ein — `sbkim-demo/index.html`, Sages **Startseite**
(`index.html:1338`) und `family-project/mycelkarte.html`. Die ersten beiden
zeigen auf Sages Kopie und waren vom 404 des Vortags betroffen; die dritte
zeigt auf die eigenständige App.

**Gebaut wurde im Quell-Repo** (`mycel-karte` PR #29, Cache-Bump v25 → v26),
die Kopie hier ist **abgeleitet**, nicht von Hand geändert.

**Geprüft:** `node tests/run_alle.mjs` → **107 grün · 0 rot · 0 nicht
lauffähig** · `gegenprobe_mycelkarte_kopie` **18 gefangen · 0 durchgerutscht ·
0 aus falschem Grund · 0 tote Anker**. Im Quell-Repo: 63 + 76 + 7 grün, im
Browser 40 + 37 + 12 grün, Gegenproben 35/35 und 40/40.

**Offen:** die Demo-Seite sagt um den Rahmen herum *„zeigt, was wirklich
passiert"*. Während einer Wiedergabe stimmt dieser Satz nicht; die Pille sagt
es unmittelbar darüber. Nicht geändert — ob der Absatz nachgezogen wird,
entscheidet Klaus.
