# BRIEF — Spore v0.2: echte Vektoren (A6) + Schnipsel-Mittel (A10) in EINER Welle

**Datum:** 2026-07-12 · **Art:** Spec-vor-Code (Protokoll-/Spore-Vertrag) — NICHT gleich bauen
**Freibrief gilt** (Sage `CLAUDE.md` § Freibrief). Branch-Vorschlag: `claude/spec-spore-v02`.

---

## Warum dieser Brief / Klaus' Entscheid (2026-07-12)

A6 (echte Embedding-Vektoren statt `_demo`) **und** A10 („Schnipsel-Mittel" für gratis
„verwandt") ändern **beide** den **Spore-Datenvertrag** und erzwingen **beide** dieselbe
teure, koordinierte **Neu-Signier-Welle** (jeder Knoten erzeugt + committet seine `spore.json`
neu; lebende Browser-Identitäten neu signieren). Zweimal wäre Verschwendung.

**Klaus-Entscheid:** **A10 fest mit rein.** A6 + A10 werden in **EINEN** Protokoll-Sprung
(`PROTOCOL_VERSION` 0.1 → 0.2) und **EINE** Neu-Signier-Welle gebündelt. Kein zweites Mal
alle Knoten neu signieren.

## Leitplanken (verbindlich)

- **Spec/Vertrag VOR Code** (Sage-Regel): zuerst `docs/INTERFACES.md` — `PROTOCOL_VERSION`
  0.1 → 0.2 + neues Spore-Schema — DANN Modul-Code. Nie umgekehrt.
- **0.80-Andock-Riegel** (`PROVIDER_MIN_MATCH`) bleibt unberührt; A6/A10 verbessern die
  Vektor-Qualität, gaten aber nichts neu.
- **Kein PII, privater Schlüssel NIE ins Repo** — die Neu-Signatur passiert lokal mit dem
  Knoten-Schlüssel; nur die öffentliche `spore.json` wird committet.
- **Headless = Beweis** (`npm test`); Browser-Sichttest bleibt Klaus. Erst mergen, dann
  Live-Prüfung (netzweiter Freibrief).
- **Übergang sauber:** während der Welle können alte 0.1- und neue 0.2-Sporen kurz koexistieren
  → Umgang damit ist Teil der Spec (Frage unten).

## Was zu tun ist (in dieser Reihenfolge)

### 1. Spec „Spore v0.2" (`docs/INTERFACES.md`) — zuerst, kein Code
- `PROTOCOL_VERSION` 0.1 → 0.2.
- **A6:** `domainVector` = **echter** Embedding-Vektor (Modul 03) statt `_demo`. Folge:
  ein Treffer zählt als **„verified-match"** statt nur „verified-spore".
- **A10:** neues Feld **`snippetVectors`** (o. ä.) in der Spore — pro Domänen-Passage/Satz
  ein Vektor, mit **Obergrenze** (Anzahl/Format festlegen). Damit wird „verwandt" **gratis**
  messbar getrennt (zentriert), ohne KI-Richter.
- **Migration/Übergang:** definieren, ob 0.1-Sporen während der Welle **toleriert** oder
  **abgelehnt** werden (siehe offene Frage 2).

### 2. Re-Sign-Automatik bauen (Klaus' Kernwunsch)
- **Headless automatisierbar:** echten `domainVector` + `snippetVectors` aus der
  Domänen-Beschreibung rechnen (Modul 03 `embed`) + Spore-JSON zusammenbauen (Modul 02
  `generateOwnSpore`) + `npm run verify`.
- **Lokal bleibt:** die **Ed25519-Signatur** mit dem privaten Knoten-Schlüssel (nie im Repo).
- **Ergebnis:** ein **„Spore neu signieren (v0.2)"-Pfad** als Skript **und/oder** Knopf pro
  App → die Welle wird zu **„ein Befehl/Klick pro App"** statt Handarbeit. (Batch über Klaus'
  eigene Knoten möglich, wenn er die Schlüssel lokal bereitstellt — berührt Safe/Modul 20.)

### 3. A6 + A10 im Code umsetzen (Modul 03 + 02, byte-gleich in die Apps)
- Modul 03: `_demo` → echte Vektoren; `snippetVectors` erzeugen.
- Modul 02: Spore-Assembly + Verify auf v0.2 heben.
- Byte-gleiche Kopien in alle Apps (Drift-Guard im Smoke).

### 4. EINE Neu-Signier-Welle
- Alle Knoten neu signieren (Klaus fährt den Prozess pro App via Automatik aus Schritt 2).
- `sbkim/NETZ-STAND.md` + PULS + `PLAN_SEMANTIK_KRYPTO.md` (A6 ✅ · A10 ✅) nachziehen.

### Parallel — schnelle Haken OHNE Bau (nur Klaus' Tablet)
- **A7** Sichttest App-Integration Hybrid + Multi-Query
- **A8** Sichttest „Wählen"-Umschalter verbunden ↔ verwandt
- **A9** Sichttest „verwandt · KI" mit echtem Schlüssel
- **B1** Sichttest Modul-20-Safe-Modal (einrichten/entsperren/Recovery)

## Datenverträge / betroffene Dateien

- `docs/INTERFACES.md` (`PROTOCOL_VERSION`, Spore-Schema v0.2) — **zuerst**.
- `src/modules/03_embedding.js` (echte Vektoren + `snippetVectors`),
  `src/modules/02_spore.js` (Assembly/Verify v0.2) + byte-gleiche App-Kopien.
- Re-Sign-Skript/-Knopf (neu), `npm run verify`.
- `docs/PLAN_SEMANTIK_KRYPTO.md` (A6/A10 abhaken nach Abschluss),
  `docs/checkliste_semantik_krypto.html`, `docs/PULS.md`, `sbkim/NETZ-STAND.md`.

## Akzeptanzkriterien

- [ ] INTERFACES.md v0.2 (PROTOCOL_VERSION + Spore-Schema) **vor** Code aktualisiert.
- [ ] Echter `domainVector` (A6) — kein `_demo` mehr; Treffer = „verified-match".
- [ ] `snippetVectors` (A10) in der Spore; „verwandt" gratis messbar getrennt.
- [ ] Re-Sign-Automatik: ein Befehl/Klick pro App erzeugt gültige v0.2-Spore; `npm run verify` ✔.
- [ ] Privater Schlüssel nie im Repo; kein PII; 0.80-Riegel unberührt.
- [ ] Headless-Smoke grün; Drift-Guards grün. Browser-Sichttest markiert „wartet auf Klaus".

## Offene Fragen an Klaus (im Spec zu klären)

1. **Schnipsel-Granularität (A10):** wie viele Vektoren pro Spore (Obergrenze), pro Satz oder
   pro Absatz? (Balance Trennschärfe ↔ Spore-Größe.)
2. **Übergang 0.1 → 0.2:** während der Neu-Signier-Welle alte 0.1-Sporen **kurz tolerieren**
   (weicher Übergang) oder **harter Schnitt** (nur 0.2 wird gehandshaket)?
3. **Re-Sign-Automatik-Form:** Skript (Termux) **oder** Knopf in jeder App **oder** beides?
   (Batch über alle Knoten braucht Schlüssel lokal — Safe/Modul 20 einbeziehen?)

## Pflichtlektüre vor der Arbeit (in dieser Reihenfolge)

1. Sage `CLAUDE.md` (§ Freibrief, § Spec/Vertrag vor Code, § Was du nicht tust).
2. `docs/PULS.md` (oberster Eintrag) + **dieser Brief**.
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — A6 + A10 (Kontext, Reihenfolge).
4. `docs/INTERFACES.md` — `PROTOCOL_VERSION` + aktuelles Spore-Schema.
5. Karten + Code Modul **03** (Embedding) und **02** (Spore); `docs/checkliste_semantik_krypto.html`.

## Abschluss-Befehl (am Ende der Sitzung)

`docs/PULS.md` fortschreiben; `PLAN_SEMANTIK_KRYPTO.md` + die HTML-Checkliste nachziehen;
neuen Folge-Brief `docs/sessions/BRIEF_*.md` anlegen **und vollständig als Codeblock im Chat**
ausgeben; Pflichtlektüre + Abschluss-Befehl wiederholen (die Kette reißt nie ab). Freibrief gilt.
