# PULS-Auslagerung 2026-09-14 (Nacht) — „Der Sprach-Wächter war blind für 52 Texte"

**Ausgelagert am 2026-09-14**, damit `docs/PULS.md` unter seiner
3000-Zeilen-Grenze bleibt. Wortwörtlich, nichts gekürzt.

---

## Stand 2026-09-14 (Haupt-Sitzung, Nachtrag) · ⚠ DER SPRACH-WÄCHTER WAR BLIND FÜR 52 TEXTE

**Rolle:** Haupt-Sitzung, Bau. PR #988 gemergt (`d71a678`). **Die Zahlen im
Eintrag darunter sind damit überholt** — dort stehen 195 Schlüssel und 16/16;
gültig sind **237** und **17/17**.

**Der Befund.** Im echten Fenster stand unter lauter englischen Zeilen
**„Speicher dauerhaft: unbekannt"**. Die beiden Wächter von heute früh waren
dabei grün — und zu Recht: sie messen das Wörterbuch gegen die `T()`-Aufrufe,
in beide Richtungen. **Ein Text, der gar nicht durch `T()` geht, kommt in
keiner der beiden Mengen vor.** Er war für sie unsichtbar.

Gemessen: **52 Stellen.** Knöpfe („Abbrechen", „🤝 Andocken", „📥 Einspielen",
„🔒 im Tresor merken"), Kurzinfos („ja"/„nein"/„unbekannt", „an"/„aus") und
Fehlerzeilen („✗ Fehler: ", „✗ Verbinden fehlgeschlagen: "). Alle umhüllt,
**42 neue Wörterbuch-Einträge**.

**Gefunden hat es kein Wächter, sondern ein Blick ins Fenster** — ein
Browser-Lauf, der das Modul allein lud und den sichtbaren Text auslas.

**Der neue Wächter** misst **Anzeige-Stellen**, nicht Zeichenketten schlechthin:
eine Suche nach „jedem Literal mit einem Buchstaben" fand **627** Treffer, fast
alle CSS, Tag- und Ereignis-Namen. Gemessen werden Zuweisungen an
`textContent`/`title`/`placeholder`/`alt` und das dritte Argument von `el()`.

**⚠ Benannte Grenze:** ein Text, der über einen selbstgebauten Umweg in den DOM
kommt, fällt nicht auf. Zweite Verteidigungslinie, keine
Vollständigkeits-Garantie.

**⚠ Drei eigene Fehler beim Bauen des Wächters.**

1. **Sein erster Filter verbot das Richtige.** Er hielt jedes Literal mit einem
   Doppelpunkt für CSS — und warf `"🧠 KI-Richter: "` und `"✗ Fehler: "` heraus,
   also echte Anzeigetexte. CSS erkennt man an `;` oder an `eigenschaft: wert`.
   Ein Gegenprobe-Fall nagelt jetzt die **Gegenrichtung** fest.
2. **Der Scanner nahm die Wörterbuch-Grenze falsch** (`\n  };` statt
   `\n  } };`) und übersprang **360 Zeilen echten Code**. Drei Stellen blieben
   im ersten Durchgang unentdeckt.
3. **Fall C1 fing aus dem falschen Grund.** Er nahm einer Zeile ihr `T()` —
   damit verlor ihr Schlüssel seine Fundstelle, der Nachbar-Wächter fiel zuerst.
   Jetzt wird **hinzugefügt**. Derselbe Fehler wie in A2, **zum zweiten Mal an
   einem Tag**.

**Gemessen.**

| | |
|---|---|
| `tests/smoke_bau23_sprache.mjs` | **17 bestanden, 0 fehlgeschlagen** |
| `node tests/run_alle.mjs` | **101 Proben — 101 grün, 0 rot, 0 nicht lauffähig** |
| Gegenprobe (jetzt 9 Fälle) | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |
| Wörterbuch | 195 → **237** Schlüssel |
| Bauvorlagen | **ein** md5 für alle drei Kopien |

**Im Browser belegt** (Chromium, Modul allein geladen, `lang="en"`): statt
„Speicher dauerhaft: unbekannt" steht **„Storage permanent: unknown"**; auf
Deutsch unverändert; keine Seitenfehler.

**Nächster sinnvoller Schritt:** unverändert das Ausrollen in die 16 Apps —
jetzt mit dem vollständigen Wörterbuch.
