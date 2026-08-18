---
name: veroeffentlichung-pruefen
description: Nachsehen, ob die eigene Arbeit wirklich oben ist und wirklich in main angekommen ist — bevor eine Sitzung „fertig" meldet, ein PR geöffnet oder ein Zweig weiterverwendet wird. Anwenden nach dem Pushen und nach dem Mergen, vor jedem „alles erledigt", und immer wenn `git diff` gegen main einen Unterschied meldet und unklar ist, in welche Richtung er zeigt. Deckt die Fälle ab, an denen frühere Sitzungen gescheitert sind: der Upstream zeigt nach `checkout -B` auf main statt auf den gleichnamigen Zweig · nach einem Squash-Merge sind Commit-Kennungen wertlos, nur der Inhalt zählt · eine Parallel-Sitzung bewegt main, und ein PR aus dem alten Zweig würde fremde Arbeit zurückdrehen · ein PR kann erfolgreich mergen und dabei nichts enthalten. Werkzeug: `node tools/zweig-pruefen.mjs <zweig>`. Kein Zwang, keine Pflicht — ein Hilfsmittel, das wachsen darf.
---

# Veröffentlichung prüfen — ist die Arbeit wirklich angekommen?

**Kein starres Gesetz, sondern ein Verbesserungsschritt** (Klaus 2026-08-17).
Wer es nicht braucht, lässt es. Wer einen neuen Fall findet, trägt ihn unten ein.

---

## Warum es das gibt

`git diff origin/main origin/<zweig>` meldet einen Unterschied, sagt aber **nicht,
in welche Richtung er zeigt**. Dieselbe Meldung bedeutet zwei entgegengesetzte
Dinge:

| Richtung | Bedeutung |
|---|---|
| der Zweig hat etwas, das `main` fehlt | **Arbeit geht verloren** |
| `main` hat etwas, das der Zweig nicht kennt | harmlos — aber ein PR daraus **dreht fremde Arbeit zurück** |

Am 2026-08-17 trat beides an **einem Tag dreimal** auf. Einmal hätte es 433 Zeilen
einer Parallel-Sitzung gelöscht.

Der tiefere Grund, warum das schwer zu sehen ist: **eine Prüfung, die einem recht
gibt, beendet das Nachsehen.** Wer den falschen Maßstab anlegt, bekommt grün und
hört auf — und genau dann geht etwas verloren.

---

## Das Werkzeug

```bash
node tools/zweig-pruefen.mjs <zweig>              # alle Nachbar-Repos
node tools/zweig-pruefen.mjs <zweig> ../Kimboard  # nur bestimmte
```

Es rechnet die Richtung aus, statt sie zu raten, und kennt **drei** Ergebnisse:

| | |
|---|---|
| `✓ erledigt` | alles, was der Zweig getan hat, steht in `main` |
| `✗ offen` | unversioniert · nicht gepusht · oder eine Datei, die `main` nicht hat |
| `⊘ nicht prüfbar` | `fetch` schlug fehl, kein Hauptzweig gefunden — **nicht dasselbe wie „in Ordnung"** |

Nicht hinter eine Pipe hängen: `| tail` liefert den Rückgabewert von `tail`.

---

## Von Hand, wenn es schnell gehen muss

```bash
git rev-list --count origin/<zweig>..HEAD   # 0 = wirklich alles oben
git status --porcelain                      # leer = nichts liegen geblieben
basis=$(git merge-base origin/main origin/<zweig>)
git diff --name-only "$basis" origin/<zweig>   # was hat MEIN Zweig angefasst?
```

Für jede dieser Dateien: steht der Inhalt so auch in `main`? Dann ist die Arbeit
drin — auch nach einem Squash-Merge.

Zum Schluss die ehrlichste Probe: **einen Satz greppen, den nur du geschrieben
hast.**

```bash
git show origin/main:<datei> | grep -F "<dein Satz>"
```

---

## Die Fälle — eine wachsende Liste

**Wer einen neuen findet, trägt ihn hier ein: Datum · was passierte · welches
Kommando ihn gefunden hätte.** Nichts löschen, auch wenn ein Fall alt wirkt —
gerade die alten sind die, die wiederkommen.

### 1 · Der Upstream zeigt woanders hin (2026-08-08)
`git checkout -B <zweig> origin/main` setzt den Upstream auf **`main`**. Wer
danach gegen `@{upstream}` prüft, vergleicht mit `main` und bekommt „sauber",
während oben ein ganz anderer Stand liegt. Eine Sitzung meldete so **31 Repos
sauber**, während ein unveröffentlichter Commit dalag.
→ Gegen `origin/<zweig>` messen, nie gegen `@{upstream}`.

### 2 · Der Push schiebt nicht deinen Stand (2026-08-15)
`git push -u origin <zweig>` ohne Refspec pusht den **gleichnamigen lokalen
Zweig**, nicht `HEAD`. Ein PR wurde angelegt, als gemergt gemeldet und
geschlossen — **ohne eine einzige Zeile zu enthalten**.
→ `git push origin refs/heads/<zweig>:refs/heads/<zweig>` und vor dem Mergen
nachsehen, ob der Zweig überhaupt etwas trägt.

### 3 · Squash-Merge macht Commits wertlos (2026-08-17)
Danach zeigt der Zweig auf die Commits **vor** dem Squash. `git log main..zweig`
listet sie brav auf, obwohl ihr Inhalt längst in `main` steht.
→ **Inhalt vergleichen, nicht Commits.**

### 4 · Die Parallel-Sitzung (2026-08-17, dreimal)
Perfect Skin Beauty (#50), Kimboard (#102), Sage. Während der Arbeit landete
fremdes auf `main`. In Kimboard hätte ein PR aus dem alten Zweig **433 Zeilen**
gelöscht — Moderations-Brief und ein reparierter Wächter.
→ Nach dem Mergen frisch abzweigen, nicht auf dem alten Stand weiterbauen.

### 5 · Der falsche Maßstab im Werkzeug selbst (2026-08-17)
Der erste Entwurf dieses Skripts zählte **alle** Hinzufügungen gegen `main` und
meldete daraufhin 8 Repos rot. Die Zahlen kamen von den **nächtlichen
Messläufen**, die in `main` Dateien geändert hatten, die der Zweig nie berührte
— eine geänderte Zeile zählt als ein Minus **und** ein Plus.
→ Nur die Dateien vergleichen, die der Zweig **selbst** angefasst hat.

### 6 · Die Warnung, die man nie los wird (2026-08-17)
Nach der Korrektur meldete das Skript **31 von 31** „veraltet" — richtig
gerechnet, aber wertlos: `main` bewegt sich ständig. Eine Dauerwarnung lernt man
zu übersehen.
→ Nur melden, was zu tun ist. Der Rückstand steht einmal am Ende als Hinweis.

---

## Was das hier NICHT ist

- **Keine Pflicht.** Niemand muss das Skript laufen lassen, um etwas zu mergen.
- **Kein Wächter, der etwas blockiert.** Es rechnet und meldet, mehr nicht.
- **Kein Ersatz fürs Hinsehen.** Meldet es `✗`, gehört der Diff **gelesen**,
  bevor irgendetwas passiert.

## Lebendes Dokument

Diese Datei darf wachsen und darf **widerlegt** werden. Wer einen besseren
Maßstab findet, ersetzt den alten hier — mit Datum und Begründung, damit die
nächste Sitzung sieht, warum. Fälle werden **ergänzt, nicht gelöscht**.

Spiegel im Obsidian-Speicher: `SP-FP-md-Speicher/Skills/veroeffentlichung-pruefen.md`.
