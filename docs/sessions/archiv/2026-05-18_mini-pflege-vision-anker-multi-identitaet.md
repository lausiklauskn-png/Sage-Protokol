# Mini-Pflege 2026-05-18 — Vision-Anker Multi-Identität in der IndexedDB

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker-multi-identitaet`. Folge zum Marathon-
Tag 2026-05-17 (PR #75 → #82).

---

## 1. Was geschah

Klaus' Folge-Gedanke nach dem Schlaf, klar abgegrenzt zu Lehre 1
(Browser-Instanzen-Trennung). Worüber Lehre 1 als **Verlust-Risiko**
sprach — zwei Browser-Instanzen erzeugen ungewollt zwei separate
Identitäten — wird hier als **Feature** umgekehrt: **bewusst mehrere
Identitäten in derselben IndexedDB**.

Klaus' Bild: „mehrere Identitäten in mehreren Ebenen im Browser oder
auf dem Tablet oder im Rechner, je nach Arbeitsoberfläche."

## 2. Konzept

- **Heute:** Modul 02 hat einen Singleton-Slot `sbkim_keys["main"]`.
  Eine PWA = eine Identität pro Browser-Instanz.
- **Vision:** Modul 02 unterstützt **mehrere Identitäten** in derselben
  IndexedDB (`sbkim_keys["main"]`, `["beruflich"]`, `["test"]` etc.).
- **Aktive-Identität-Marker** `sbkim_meta["active-identity"]` bestimmt,
  welche Identität Module 05/06/07 gerade nutzen.

## 3. Was eingetragen

- **`docs/PULS.md` § Vision-Anker** um sechsten Anker erweitert mit
  Konzept-Beschreibung, Spec-Schritten, Trade-offs, Verbindungen zu
  anderen Vision-Ankern.
- **`docs/PULS.md` § Sitzungs-Einträge** neuer Top-Eintrag.
- **Dieses Übergabeprotokoll.**

## 4. Sechs Vision-Anker jetzt im Repo

1. V1 — Sage als Hybrid-Knoten
2. V3-Ausbau — Niedrigeres Onboarding
3. Universum-Vision (umgesetzt PR #79 + #80)
4. Königin-Relay (Modul 13?)
5. Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser
6. **Multi-Identität in der IndexedDB** — neuer Anker (dieses)

## 5. Was NICHT angefasst

- Modul-Code, INTERFACES.md, Modul-Karten, Sage-Page, `status.json`
- Vision lebt rein in PULS, kein Code-Eingriff
- `update_puls_pie.py` NICHT aufgerufen

## 6. Nächster sinnvoller Schritt

Klaus entscheidet:

- **Storage-Persist-Schutz-Mini-Pflege** (`navigator.storage.persist()`
  in `SbkimStorage.init()`) — adressiert Spore-Verlust vom 2026-05-17
- **Spec-Sitzung V1 „Sage als Hybrid-Knoten"** — Brief liegt fertig in
  gestrigen Chat als kopierbarer Codeblock
- **Anderes** — Klaus' Wunsch

## 7. Konvention für die übernächste Sitzung

Standard-Konvention beim `Befehl schreiben` (offene PRs auflisten,
Brief gegen `main`-Stand, Sektionen 0-7, Brief am Ende im
4-Backtick-Codeblock).

---

**Vorgänger:** Vision-Anker Königin-Relay + Identitäts-Container
(PR #82, `e58f102`). **Branch:** `claude/pflege-vision-anker-multi-identitaet`.
