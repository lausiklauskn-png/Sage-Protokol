# BRIEF — Briefkasten entdoppeln/löschen/verlinken (B) + Mikrofon/Modul 21 fehlt (C)

**Stand 2026-07-12.** Aus Klaus' Live-Tablet-Test nach dem A17-Last-Schoner (Web-Worker,
kein Einfrieren mehr — ✅) + dem Partner-Link „↗ App öffnen" (✅ gebaut + netzweit ausgerollt).
Zwei klar umrissene Folge-Baustellen bleiben. **Freibrief gilt** (siehe `CLAUDE.md` § Freibrief).

## Kontext / Diagnose (wichtig zu verstehen)
Server-los heißt: die **Antwort eines Knotens kommt nur, wenn dessen Tab offen + im
Vordergrund + wach** ist. Auf **einem** Gerät kann Klaus nicht zwei Apps gleichzeitig vorn
halten → die Cross-Knoten-Antwort bleibt oft aus, das System zeigt „wer könnte antworten"
und legt die Frage in den **Briefkasten** (A12). Genau daher die **Doppel-Fragen**. Der
Partner-Link (schon gebaut) ist die Selbst-Suche-Abhilfe. Diese zwei Punkte bleiben:

## B) Briefkasten (A12) — entdoppeln, löschen, verlinken
**Ort:** `src/modules/23_rendezvous_ui.js` (Kanon) — die Briefkasten/„offene Fragen"-Anzeige.
Relevante Funktionen: `recordOpenQuestion` (~Z. 131, hängt Einträge an) + die Render-Stelle
der offenen Fragen (`#sbkim-rdv-incoming` / „📬 Antworten abholen"-Pfad) + „🗑 leeren".
**Befund (Klaus-Screenshot):** dieselbe Frage steht x-fach drin („offen: Erfrischungs-
getränk … an Mein Mixarium" mehrfach), Zähler „Antworten abholen (13)".
**Zu bauen (reine Anzeige/Speicher, KEIN Protokoll-Bump, Kern 02/05/05b unberührt):**
1. **Entdoppeln beim Schreiben:** `recordOpenQuestion` dedupt gleiche `(frage-text, ziel-nodeName)`
   → statt neuem Eintrag den bestehenden aktualisieren (Zähler `tries`+1, `lastTs`). Dedup-Schlüssel
   normalisiert (trim + lowercase). Persistenz-Key wie gehabt (A12, pro App/Origin, kein PII —
   nur Text/Zielname/Zeit/Zähler).
2. **Anzeige zusammengefasst:** pro (Frage→Ziel) EINE Zeile mit „×N · zuletzt vor …".
3. **Löschen je Eintrag:** ein 🗑-Knopf pro Gruppe (nicht nur global „leeren"). Entfernt genau
   diese Gruppe aus dem Speicher + Anzeige.
4. **Partner-Link je Eintrag:** „↗ App öffnen" zum Ziel-Knoten (Adresse aus der beim Eintrag
   gespeicherten Spore/endpoint — falls nicht gespeichert, beim Schreiben `card.spore.endpoint`
   mit ablegen). Gleiches Muster wie schon in `renderCards` (Commit „Partner-Link …", 2026-07-12).
**Akzeptanz (headless, `smoke_bau23_rendezvous_ui.mjs` erweitern):** gleiche Frage 3× →
1 Gruppe mit tries=3; 🗑 entfernt nur diese Gruppe; Eintrag mit endpoint zeigt „↗ App öffnen"-Link;
kein PII; fail-soft ohne endpoint. Byte-1:1 `sbkim-bundle`, dann netzweiter Rollout (7 Apps,
Subagenten, SW-Bump, Kimboard/Kimseek sha-Guard) — Muster siehe die zwei Rollouts vom 2026-07-12.

## C) Mikrofon / Modul 21 (Spracheingabe) fehlt in den Apps
**Befund (Klaus-Screenshot, Mixarium):** Klick aufs 🎤 im Netz-Panel → „🎤 Spracheingabe
(Modul 21) nicht geladen — bitte tippen." Mikrofon-Hardware ist da. Ursache: die App lädt
`21_spracheingabe.js` **nicht** (das Skript-Tag / die Modul-Datei fehlt). `onVoiceClick`
(Modul 23 UI, ~Z. 1029) prüft `global.SbkimSpeech` → fehlt → genau diese Meldung. Dasselbe
gilt fürs 🎤 im Such-Widget (Modul 22).
**Zu tun:**
1. **Audit:** pro App prüfen, ob `sbkim/21_spracheingabe.js` (bzw. `modules/…`) existiert UND
   im `index.html` per `<script>` geladen wird (vor Modul 22/23-Init). Wahrscheinlich fehlt
   Datei UND/ODER Script-Tag in mehreren Apps.
2. **Nachziehen:** Datei byte-1:1 aus Sage-Kanon `src/modules/21_spracheingabe.js` kopieren +
   Script-Tag ergänzen (Reihenfolge: 21 vor 22/23). SW-Cache-Bump. Byte-1:1-Disziplin +
   Kimboard/Kimseek sha-Guard.
3. **Ehrlich fail-soft prüfen:** Modul 21 nutzt Browser-Web-Speech ODER EU-Cloud (BYOK). Auf
   Android-Chrome ist Web-Speech u.U. nicht/eingeschränkt verfügbar → dann ehrliche Meldung
   statt totem Knopf (ist schon so). Klaus soll wissen: ohne EU-Schlüssel evtl. nur Tippen.
   **Fremdnutzer-Brille:** kein toter Knopf, klare Ansage.
**Akzeptanz:** in der App ist `SbkimSpeech` geladen (Selbstcheck-Konsole), 🎤 startet die
Erkennung ODER gibt die ehrliche „braucht EU-Schlüssel/Browser unterstützt nicht"-Meldung —
nicht mehr „Modul 21 nicht geladen". Sichttest Klaus.

## Reihenfolge-Empfehlung
1. **C zuerst** (kleiner, klarer Defekt „toter Knopf" — nur Datei + Script-Tag + Rollout).
2. **B** (Briefkasten dedupe/löschen/verlinken — etwas mehr Logik + Rollout).
3. Danach optional **A16** (lernender Sortierer, eigener Brief liegt:
   `docs/sessions/BRIEF_A16_LERNENDER_SORTIERER.md`).
4. Optional/auf Zuruf: **Modell selbst hosten** (Flaschenhals/Offline, `/models/…`-Pfad in
   Modul 03 existiert schon) — löst NICHT das Einfrieren (das ist der Worker), rein
   Ladezeit/Offline/HuggingFace-Unabhängigkeit.

## Pflichtlektüre vor Arbeit
`CLAUDE.md` → `docs/PULS.md` (oberste Einträge 2026-07-12) → dieser Brief →
Code der Scheibe (`src/modules/23_rendezvous_ui.js`, `src/modules/21_spracheingabe.js`).

## Abschluss-Befehl (Kette reißt nie ab)
Am Ende: PULS fortschreiben, PLAN abhaken, neuen Folge-Brief anlegen + vollständig als
Codeblock im Chat ausgeben, Pflichtlektüre + diesen Abschluss-Befehl wiederholen. Freibrief gilt.
