# PULS-Auslagerung August 2026 (4) — die Anker-Sitzung vom 17.08.

Ausgelagert am **2026-08-24** aus `docs/PULS.md` (Schutz-Klausel: 3000 Zeilen —
**auslagern statt kürzen**; die Datei stand bei 3.019). Wortwörtlich übernommen,
nichts gekürzt und nichts zusammengefasst; die Git-Historie trägt es ohnehin.

---

## Stand 2026-08-17 (Pflege) — 📕 Zehn Sitzungs-Anker · Abschluss · Brief „Hassrede vom Brett"

**Rolle:** Hauptsitzung. Schließt den Tag mit drei Aufträgen ab (Urheberrecht ·
Gerätename · Anker) und legt den Auftrag für die nächste Sitzung.

**Zehn Anker angelegt und gemergt.** Jedes Repo, das bisher keine `CLAUDE.md`
hatte, hat jetzt eine: Alis-Moderaum #48 · Company-Brain #16 · Kim-Bell #48 ·
Kimboard #101 · Kimseek #66 · Mein-Workfloh-Page #15 · Perfect-Skin-Beauty #52 ·
Perfect-Skin-Fashion #24 · Tomys-Hub #159 · family-project #282. Vorher geprüft
gegen `origin/main`, Proben je Repo grün.

**Ehrlich zur Länge:** angekündigt waren ~25 Zeilen, geworden sind 78–97. Grund
ist eine Entscheidung, keine Nachlässigkeit — Freibrief, Gerätenamen-Regel und Ton
stehen **wörtlich** drin statt als Verweis. Eine Sitzung, die den Anker liest, aber
dem Verweis nicht folgt, ist genau die, für die er gedacht ist.

### Der Fehler dieser Sitzung, im eigenen Werk gefunden

Der frisch angelegte Kimboard-Anker nannte als Prüfung nur `npm test` samt der Zahl
„6 bestanden". Kimboards eigene `README.md` sagt dagegen: *„Alles prüfen mit
`node tests/alle.mjs` (nicht nur `npm test`)"* — `npm test` läuft `node --test` und
fasst die **26 Proben unter `tests/`** nicht an, darunter ausgerechnet
`smoke_loeschen.mjs`.

Das ist wörtlich die Falle aus der eigenen Tafel: *„wer nur die eine Probe aufruft,
die er kennt, merkt so etwas nie."* Der Anker sah dabei aus wie eine vollständige
Auskunft — das ist das Gefährliche daran, nicht die falsche Zahl. Berichtigt am
selben Tag, mitsamt der Begründung im Anker selbst.

**Und der richtige Läufer förderte prompt einen toten Wächter zutage:**
`hilfe … ROT (0 Proben)`, per `git stash` als vorbestehend belegt. Nicht die App
war kaputt, die **Probe** war es — `assets/hilfe.js` ist der letzte von 14
Einträgen der Nachlade-Kette, jedes Glied an `requestIdleCallback`; die Probe
wartete stur 1800 ms und starb beim Zugriff. **Rot, aber stumm.** An zwei Stellen
auf `waitForFunction` umgestellt → **22 Prüfungen grün statt keiner**, Gegenprobe
gefahren (Erklärtext raus ⇒ rot, zurück ⇒ grün).

Das wiegt, weil dieser Wächter erzwingt, dass **jeder sichtbare Knopf eine
Erklär-Blase hat** — und der neue Kimboard-Brief verlässt sich für den Melde-Knopf
darauf. Zwei Lehren, in Kimboards Anker festgehalten: **eine Uhr misst nicht, ob
etwas fertig ist** (auf die Bedingung warten, nie auf eine Dauer), und **`| tail`
ist zum Lesen da, nicht zum Urteilen** (der erste Aufruf meldete „exit 0" — das
war `tail`).

### Neuer Auftrag: Hassrede vom Brett nehmen (Kimboard)

Klaus' Frage: *„Sie müssen endgültig vom Board genommen werden können, nicht vom
Rechner — das geht glaube ich nicht. oder?"* Seine Vermutung stimmt zur Hälfte.

| Ort | Was möglich ist |
|---|---|
| Klaus' **eigenes** Relais (`relay.family-projekt.de`) | wirklich entfernen |
| jedes **Kimboard** | aus der Anzeige nehmen |
| **fremde** Relais | nur bitten, [NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md) verpflichtet niemanden |

Das halbe Fundament liegt: „Bei allen löschen" ist gebaut (kind 5), und seit dem
2026-08-01 wird **nur nach Hause gesendet**. Was fehlt, ist der Melde-Weg —
Kimboard hat keinen, obwohl [Art. 16 DSA](https://gesetz-digitale-dienste.de/dsa/artikel-16/)
ihn für Hosting-Anbieter verlangt und Klaus für sein Relais einer ist.

Klaus entschied (AskUserQuestion): **alle drei Stränge** — eigenes Relais,
signierte Sperr-Liste, Melde-Weg. Voller Auftrag mit Grenzen, Reihenfolge und
Wächtern in [`Kimboard/docs/BRIEF_MODERATION_UND_RECHT.md`](https://github.com/lausiklauskn-png/Kimboard/blob/main/docs/BRIEF_MODERATION_UND_RECHT.md).

**Offen und ausdrücklich nicht erledigt:**
- Was auf dem Hetzner-Server wirklich läuft, ist **ungeprüft** — der Egress-Proxy
  blockt beide Relais (`CONNECT tunnel failed, 403`). Erster Schritt der neuen
  Sitzung, ein `ssh`-Einzeiler für Klaus.
- `family-project/impressum.html` Punkt 5 sagt *„Netz-Inhalte sind Ende-zu-Ende
  verschlüsselt"*. Für Direktnachrichten und Gruppen stimmt das; das **offene
  Brett** läuft im Klartext. Erst belegen, dann formulieren — eigener PR.
- Zwei vorbestehend rote Proben in SB-KIMTool-Point (Probe 27), per `git stash`
  als nicht von dieser Sitzung verursacht belegt.

---
