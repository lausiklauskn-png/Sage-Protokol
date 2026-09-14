# PULS-Auslagerung 2026-09-14 (zweite)

Ausgelagert aus [`docs/PULS.md`](../../PULS.md), weil die Datei mit dem Eintrag
zum Sprach-Haken in Modul 23 sonst ueber **3.000** Zeilen gestiegen waere.
**Ausgelagert, nicht gekuerzt** — der Wortlaut steht hier byte-gleich, wie er in
PULS.md stand.

**Zwei** Eintraege, 44 + 38 Zeilen. Gemessen: 2.976 vor dem neuen Eintrag,
3.005 danach — also ueber der Grenze; nach beiden Auslagerungen **2.973**.

Der zweite wurde erst noetig, weil die erste Auslagerung nicht reichte. Beide
stehen hier byte-gleich untereinander, in der Reihenfolge, in der sie in
PULS.md standen.

---

## Stand 2026-09-10 (Haupt-Sitzung, später) · 🔴 NEUN VON 21 KNOTEN FALLEN UNTER DEN HANDSHAKE-BODEN

**Was getan.** Klaus' Mycel-Mitschnitt hat gezeigt, dass Sage im Raum mit einer
**160-Zeichen-Beschreibung** steht. Nachgemessen gegen den Boden
`PROVIDER_MIN_MATCH = 0.80`: **neun von einundzwanzig** Knoten kämen damit nicht
durch, **vier allein deswegen** — PWA Toolpoint 0.8112 → 0.7961 ·
Auslieferungsprüfer 0.8405 → 0.7944 · Mixarium 0.8223 → 0.7909 · Private Brain
0.8104 → 0.7868. Kimboard hängt mit 0.8014 um 14 Tausendstel über der Kante.

⚠ **Gefunden haben es zwei eigene Proben**, die beim Umstellen der abgelegten
Spore zu Recht rot wurden (`smoke_bau04e_relatedness`,
`smoke_bau23_rendezvous`). Sie messen seit jeher die richtige Zusicherung — sie
hatten nur nie die Spore vor sich, die wirklich im Raum steht. **Eine Probe, die
die falsche Ausgangslage bekommt, misst zuverlässig das Falsche.**

**Ursache und Abhilfe.** Sages `assets/siegel-inhalt.js` brachte selbst nur die
160 Zeichen mit und ließ die gespeicherte Spore das Feld still überschreiben —
dieselbe Fassung, die Klaus in Kim Hub Company zweimal beanstandet hat. Jetzt
gewinnt der gepflegte Text (**3028 Zeichen, 50 Stichworte**, nennt Name, Zweck,
Forschung, Protokoll), der zuletzt signierte bleibt hinter einem Knopf.
**14 Wächter, 11 Gegenproben**, jede von Hand nachgestellt — jede rote Zeile
trägt den Namen ihrer eigenen Zusicherung.

**Nebenbefund:** Sages Spore löste ihren **eigenen Namen falsch** auf —
*„Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel"* statt *„Semantisch
Bidirektionales KI-Matching"*, wie das Gutachten es seit jeher sagt.

**Klaus hat entschieden:** *„die Neuere ist die Richtige, auch bei der Kennung"*
— Sages geltende Kennung ist `BgjXhSApoOrJ…`. Ausgeführt wird sie **mit dem
nächsten Signieren**: die Raum-Fassung trägt die richtige Kennung **und** den
dünnen Text; sie jetzt abzulegen hieße, den kaputten Stand festzuschreiben.

**Was offen ist.** Klaus signiert im Sage-Siegel neu → dann einmal tauschen
(Kennung **und** Text), alle zwanzig `matchScore` neu rechnen, und die sechs
`sage_inbox.json` in den Schwester-Repos nachziehen. Die fünf Knoten, die schon
**vorher** unter 0.80 lagen (Tomys Hub, Alis Moderaum, beide Perfect Skin,
Muster Werbetechnik), sind eine eigene Aufgabe.

**Nächster sinnvoller Schritt.** Klaus: Sage-Siegel öffnen, den Text im Feld
stehen lassen, „Beschreibung übernehmen → Vektor & Spore neu signieren", Spore
schicken.

---


---

## Stand 2026-09-10 (Haupt-Sitzung, Abschluss) · ✅ SAGE NEU SIGNIERT — VIER KNOTEN SIND ZURÜCK

**Was getan.** Klaus hat um 13:20 UTC im Sage-Siegel neu signiert. Die Spore
trägt **beides** richtig: die geltende Kennung `BgjXhSApoOrJ…` und den
gepflegten Text (3028 Zeichen, 50 Stichworte, 17 Schnipsel). Verifiziert: VALID,
L2 = 0.999999927, wortgleich mit **allen drei** Wegen zur Spore.

**Alle zwanzig `matchScore` neu gerechnet** — gegen die Spore, die wirklich im
Raum steht. Von den neun Knoten unter dem Boden 0.80 sind **vier zurück**:

| | vorher | jetzt |
|---|---|---|
| Auslieferungsprüfer | 0.7944 | **0.836978** |
| Mixarium | 0.7909 | **0.817718** |
| Private Brain | 0.7868 | **0.811482** |
| PWA Toolpoint | 0.7961 | **0.811202** |
| Kim Hub Company | 0.8636 | **0.917107** ← höchster Wert im Netz |

**Was offen ist.**

- **Fünf liegen weiter unter 0.80**, und Sage ist nicht mehr ihr Hebel — vier
  von ihnen sind mit dem neuen Hub sogar gestiegen. Was fehlt, ist die **eigene**
  Beschreibung: Alis Moderaum 0.795460 · Muster Werbetechnik 0.793613 · Perfect
  Skin Fashion 0.793030 · Tomys Hub 0.786371 · Perfect Skin Beauty 0.783216.
- **BookLedgerPro** steht weiter mit 0.855505 gegen die ALTE Sage — keine
  erreichbare Spore in dieser Umgebung. Benannte Lücke, keine geschätzte Zahl.
- **Die Gegenseite ist ungemessen:** gerechnet ist gegen die *abgelegten* Sporen.
  Ob die den Live-Fassungen entsprechen, ist für achtzehn von zwanzig offen.
- **Die Adresskarten** in fünf Schwester-Repos (`sbkim/sage_inbox.json`) zeigen
  noch auf die alte Kennung.

**Nächster sinnvoller Schritt.** Die Adresskarten nachziehen (die
`*.verify.md`-Prüfprotokolle bleiben unangetastet — sie belegen, was am
jeweiligen Datum galt). Danach: die fünf Knoten unter dem Boden, einer nach dem
anderen.

---

