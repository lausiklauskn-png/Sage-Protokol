# Übergabe 2026-08-12 — 🗂 Plan: fremde Apps auf den Marktplatz holen

**Rolle:** Plan-Sitzung, ausdrücklich **kein Bau**.
**Auftrag:** [`BRIEF_PLAN_FREMDE_APPS_AUFNEHMEN.md`](../BRIEF_PLAN_FREMDE_APPS_AUFNEHMEN.md)
**Ergebnis:** [`docs/PLAN_FREMDE_APPS.md`](../../PLAN_FREMDE_APPS.md)

Klaus' Idee: fremde PWAs vom Markt aktiv auf PWA Toolpoint holen — eintragen,
dann die Besitzer ansprechen. Motiv ausdrücklich **Reichweite, nicht Provision.**
Ursprünglich gedacht: erster Schub fünfzig Apps.

---

## 1. Der Befund, der die halbe Aufgabe erledigt hat

Der Auftrag las sich, als müsse für Frage B erst einiges gebaut werden. Ein Blick
in den echten Code von `PWA-Toolpoint` hat drei der Bedingungen bereits erfüllt
vorgefunden:

| Bedingung aus dem Auftrag | Stand | Fundstelle |
|---|---|---|
| „sichtbarer, sofort wirksamer Weg raus pro Eintrag" | **steht** — „⚑ Melden" an jeder Karte, nativer Dialog, ohne Konto, ohne E-Mail, mit `eintrag_id` + Bot-Falle | `assets/app.js` Z. 851 ff. |
| „kein Anschein einer Partnerschaft" | **steht** — `own:false` ⇒ `rel="nofollow ugc"` | `assets/karte.js` Z. 299–302 |
| „Sperre, ohne den Eintrag zu verstecken" | **steht** — rot ⇒ Eintrag bleibt, Grund dabei, Link aus | `assets/config/wache-hand.json` |

**Was tatsächlich fehlt, ist klein:** die vier Meldegründe heißen *kaputt ·
anders · recht · sonstig*. **Keiner heißt „das ist meine App".** Wer seinen
Eintrag loswerden will, muss ihn heute unter „Etwas anderes" melden.

> **Lehre, dieselbe wie am 2026-08-09 (§14 Punkt 2 des Wirtschafts-Papiers):**
> vor der Diagnose greppen, nicht danach. Der Auftrag beschrieb einen fehlenden
> Weg raus — der Weg war da. Hätte ich das nicht geprüft, hätte der Plan einen
> Bau vorgeschlagen, der zur Hälfte schon existiert.

## 2. Der `img:`-Konflikt — echt, aber kleiner als angenommen

Der Auftrag nennt ihn *„ein echter Konflikt zwischen dem Pflichtfeld und der
Idee"*. Gemessen:

- **Der Renderer kann es längst.** Ohne `img` zeichnet `karte.js` Z. 308–311 ein
  **leeres Feld fester Größe** — kein Platzhalter-Symbol, kein kaputtes Bild,
  kein Layout-Sprung.
- **Fund der Woche schließt bildlose Einträge aus** (`fundKandidaten()`,
  Z. 364–367). Das ist richtig, nicht kaputt: ohne Bild taugt ein Eintrag nicht
  zum Herausstellen.
- **Die harte Sperre sitzt allein im Studio** (`studio.js` Z. 345 · 1005:
  *„Ohne brauchbares Bild wird das nicht übernommen."*).

**Vorschlag:** `img` bleibt Pflicht für `own:true`, wird optional für
`own:false`. **Kein neutraler Platzhalter** — ein generisches Ersatz-Symbol wäre
eine Behauptung über eine App, die niemand geprüft hat. Leer ist ehrlicher, und
es ist zugleich der sichtbare Anreiz für den Anbieter, sich zu melden. Genau die
Reaktion, die gemessen werden soll.

## 3. Die vier Antworten

**A — verlinken oder hosten? → nur verlinken.** Ich habe aktiv nach einem Fall
gesucht, in dem Hosten mehr bringt. Drei Kandidaten, alle fallen; der stärkste
Grund gegen das Hosten ist nicht die Lizenz, sondern die Messung: gehostete Apps
lägen auf Klaus' Hosting, der Marktplatz würde **seine eigene Leistung messen**
und als fremde ausweisen. Das bricht die Regel, die ihn trägt. (Lizenz-Punkt
bleibt daneben bestehen: ein Repo ohne Lizenzdatei ist „alle Rechte vorbehalten";
ein Fork auf GitHub ist gedeckt, ein Weiterveröffentlichen unter eigener Adresse
nicht.)

**B — eintragen ohne zu fragen? → ja, für einen Link-Katalog, nach zwei kleinen
Bauten** (fünfter Meldegrund · `img` optional für Fremde).

**C — wie ansprechen? → GitHub-Issue, nicht Impressum-Mail.** Die Warnung steht
unverkürzt im Papier: §7 UWG gilt auch B2B, ein kostenloses Angebot bleibt
geschäftlich, wenn es dem eigenen Zweck dient — und Reichweite **ist** ein
eigener Zweck. Fünfzig Anschreiben sind nicht fünfzig kleine Risiken, sondern
fünfzig Gelegenheiten für **eine** Abmahnung. Ein wortwörtlicher Vorschlagstext
liegt im Papier §4; der Weg raus steht darin im **ersten** Absatz.
**Keine Rechtsberatung** — Risiko benannt, Entscheidung bei Klaus.

**D — „die ersten hundert kosten nichts" → Klaus vorgelegt, nicht korrigiert.**

## 4. Klaus' Entscheidungen (AskUserQuestion, 2026-08-12)

1. **„Der Eintrag kostet nichts."** Sein Originalsatz kündigte an, dass es ab
   hundertundeins etwas kostet — nach seiner eigenen Tafel §8d damit Stufe 2 mit
   Gewerbeanmeldung davor. Die gewählte Fassung bleibt Stufe 1. Die Zahl hundert
   lebt als **innere Messmarke** weiter, steht aber nirgends geschrieben und
   bindet damit niemanden.
2. **Erster Schub: fünf Apps**, nicht fünfzig. Danach vier Zahlen zählen, dann
   erst entscheiden.

## 5. Klaus' Nebenfrage — wie weit vom bezahlbaren Modell?

Mit den Zahlen aus §9, Bedarf 2.000–3.000 €/Monat:

| Weg | nötig | Reihenfolge |
|---|---|---|
| ① Beteiligung | **2–3 Partner** | erreichbar, teils vorhanden |
| ② Wartung | **~100 Kunden** à 20 € | über Jahre |
| ③ Provision | **400–500 Käufe/Monat** | erst nach ① ② |
| ④ Jahresbeitrag | **500 zahlende Anbieter** | erst nach ③ |

**Fünfzig Einträge sind ein Zehntel von ④** — und ④ ist der letzte der vier Wege.
Die Idee wächst auf den zwei **langsamsten** Geld-Wegen. Das macht sie nicht
falsch: sie zahlt auf **Reichweite** ein, und genau das hat Klaus als Ziel
benannt. Aber sie ist **kein Schritt aufs Einkommen zu**.

**Steht heute Geld irgendwo? Nein** — Papier-Stand unverändert: null Einnahmen,
nur ein Spenden-Hinweis. Von §15 blockieren **0b** (Rohertrag als Grundlage) und
**5** (verfügbare Zeit) die schnellen Wege ① und ②; beide kosten je einen Satz
und liegen seit 2026-08-09 offen. **Wir stehen mitten in Stufe 1** — und Stufe 1
ist selbst die Messung.

## 6. Ehrlich vermerkt, statt still zu bleiben

§14 Punkt 7 des Wirtschafts-Papiers sagt, der offene Markt komme *„erst wenn 1–5
stehen"*. Toolpoint ist vorgezogen worden. Das ist vertretbar (der Bau war eine
Kopie, §8b, und kostete fast nichts), aber es ist eine bewusste Abweichung von
der eigenen Reihenfolge. Sie steht jetzt im Papier §6 statt nirgends. An der
Reihenfolge des **Geldes** (① ② ③ ④) ändert sie nichts.

## 7. Tabu eingehalten

Kein Eintrag entstanden, auch nicht probeweise · keine E-Mail an irgendwen ·
kein Code geändert · keine Rechtsberatung · Frage D **nicht** stillschweigend
korrigiert.

## 8. Nächster sinnvoller Schritt

1. **Bau-Brief für `PWA-Toolpoint`** (B1 fünfter Meldegrund · B2 `img` optional
   für Fremde · B3 „eingetragen, nicht abgestimmt"). Liegt als
   `BRIEF_BAU_FREMD_EINTRAEGE_TOOLPOINT.md`.
2. **Fünf Apps aussuchen** — nach den Regeln aus Papier §7 Schritt 2.
3. **§15 Punkt 0b und 5 entscheiden** — je ein Satz, und sie blockieren die
   *schnellen* Wege ① und ②, während dieser Plan den langsamsten bedient.
4. Offen aus der Vorgänger-Sitzung: Klaus' Browser-Sichttest der zwölf Sprachen ·
   vier abweichende Modul-23-Kopien · `PULS.md` bei ~9.900 Zeilen gegen die
   eigene 3.000-Zeilen-Grenze.
