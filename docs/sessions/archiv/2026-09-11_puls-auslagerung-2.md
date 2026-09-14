# PULS-Auslagerung vom 2026-09-11 (zweiter Griff) — eine Sitzung im vollen Wortlaut

**Warum diese Datei existiert.** Nach dem Eintrag dieser Sitzung stand
`docs/PULS.md` bei **2.991 von 3.000 Zeilen** — neun Zeilen Luft sind keine
Luft, die nächste Sitzung stünde sofort wieder an der Grenze. Ausgelagert statt
gekürzt, wie die Schutz-Klausel es verlangt.

**Was ausgelagert wurde:** der Eintrag vom **2026-09-09 (Haupt-Sitzung, spät)** —
*„Zwei Knoten auf einer Adresse haben jetzt zwei Kennungen"* (57 Zeilen).

Das Übergabeprotokoll dazu liegt unverändert in
[`2026-09-09_zwei-knoten-sporen-abschluss.md`](2026-09-09_zwei-knoten-sporen-abschluss.md).

---

## Stand 2026-09-09 (Haupt-Sitzung, spät) · ✅ ZWEI KNOTEN AUF EINER ADRESSE HABEN JETZT ZWEI KENNUNGEN

**Was getan.**

- **Die Spore des Auslieferungsprüfers ist abgelegt und verifiziert.** Klaus hat
  sie in dessen Browser erzeugt; headless reziprok geprüft mit Sages
  Modul-02-Pfad (**deep**-kanonisches JSON, nicht nur oben sortiert — mein
  erster Anlauf sortierte nur die obersten Schlüssel und meldete „ungültig",
  während die Signatur einwandfrei war). ✔ VALID, Kennung
  `yF1ONN8LQskao9MoTyRADywKYIHLr0BM9CUXQj5X9GM` = SHA-256 des rohen
  öffentlichen Schlüssels. Sage-Cosinus **offline nachgerechnet 0.840471**,
  Marktplatz⟷Prüfer 0.817974, L2 = 1, 384 Zahlen.
  Sie liegt als `PWA-Toolpoint/sbkim/pruefer-spore.json` — byte-gleich wie
  Klaus sie geschickt hat. `sbkim/spore.json` gehört dem Marktplatz, weil
  Modul 15 die Adresse aus dem Endpunkt ableitet.
- **Ein Wächter besteht darauf, dass es zwei Knoten sind**, nicht zwei Dateien:
  verschiedene Kennung **und** verschiedener Schlüssel. Zwei Dateien, die
  dalägen, sähen auch dann nach zwei Knoten aus, wenn beide aus demselben
  Browser-Zustand stammten.
- **Kim Hub Companys Siegel wird gebaut wie bei PWA Toolpoint** (Klaus:
  *„Also genauso wie bei Tool PWA Toolpoint machen."*). Die **Seite** bringt die
  Lampen-Leiste mit, Modul 16 hängt sein Wappen dort hinein, Modul 17 wird gar
  nicht mehr geladen.
- **`kim-hub-company/tools/aus-kimhub-holen.mjs`** holt alle gepinnten Kopien
  auf einmal.

**Zwei Befunde, die es aufzuschreiben lohnt.**

1. ⚠ **Ein Endpunkt, der auf eine SEITE zeigt, hat keinen Sporen-Ort.** Modul 15
   baut die Adresse als `endpoint + "/sbkim/spore.json"`. Für den Prüfer ergibt
   das `…/auslieferungspruefer.html/sbkim/spore.json` — **diese Adresse liefert
   nichts aus**, und auf GitHub Pages kann sie es nicht. Die abgelegte Spore ist
   damit **Beleg, nicht Sender**. Das schärft die Lehre vom 2026-09-02, statt
   ihr zu widersprechen: neu ist, dass ein Knoten hier **gar keinen** abholbaren
   Ort hat, und das gilt für jeden Knoten mit einem Seiten-Endpunkt.
   **Vorschlag:** ein optionales `sporePath` neben dem Endpunkt im Kanon,
   Vorgabe unverändert — **kein** Eingriff in eine Kopie, der ergäbe eine dritte
   Modul-Generation. *Offen, Klaus entscheidet.*
2. ⚠ **„Ein Drift-Guard sagt unverändert, nicht aktuell" — zum dritten Mal in
   einer Woche.** Klaus hat denselben Befund zweimal geschickt („die
   Agentenpillen sind immer noch nicht in der Startposition"); die Arbeit war in
   Kimhub getan, hierher kopiert war nur `index.html`. Beim dritten Mal ist es
   keine Unachtsamkeit mehr, sondern ein fehlendes Werkzeug — deshalb der
   Nachzieh-Holer, der seine **Liste** aus dem Drift-Guard liest statt einer
   zweiten.

**Was offen ist.**

- Der **Live-Handshake** beider Toolpoint-Knoten — den sieht nur Klaus' Browser.
- Der Kanon-Vorschlag `sporePath` (Punkt 1 oben).
- Die **45 abweichenden Modul-Kopien** netzweit aus dem Lauf vom 2026-09-09.
- Warum die **Lighthouse-Zahlen der PWA-Toolpoint-Startseite** gefallen sind
  (99·100·96·100, CLS 0,062 gegen die dokumentierten 100·100·100, CLS 0).
  **Nicht untersucht** — die Messung fiel nebenbei an.

**Was NICHT gemessen ist:** wie es am Tablet aussieht. Klaus' Sichttest ist
nicht ersetzbar.
