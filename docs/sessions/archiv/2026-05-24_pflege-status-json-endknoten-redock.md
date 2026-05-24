# 2026-05-24 · Mini-Pflege — `status.json` Endknoten-Daten nachgezogen

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-status-json-endknoten-redock`. Anschluss nach PR #148
(Brief Spec 16).

## Anlass

Klaus' Hinweis im Sichttest-Dialog 2026-05-24: „ich habe vorhin was
gelesen, von Sporen die zuletzt 16.05.26 aktualisiert wurden?"
`status.json` Endknoten-Daten waren noch auf dem **Erst-Andock-Stand**
(2026-05-16, alte Tablet-Chrome-nodeIds), obwohl der DeX-Chrome-Re-
Andock am 2026-05-17 mit frischen nodeIds erfolgt war und seitdem in
PULS-Endknoten-Tabelle korrekt dokumentiert ist.

**Reine Anzeige-Drift, keine technische Konsequenz** — alle drei
Endknoten kommunizieren live. Aber die Sage-Page zeigte beim Endknoten-
Karten-Render veraltete IDs (`RHhposP0…` / `7xf0tt33_…` statt der
aktuellen `BSWxXm…` / `JOlHK3…`).

## Geänderte Dateien

- `status.json` Endknoten-Block (Rezeptbuch + Mixarium)
- `docs/PULS.md` Sitzungs-Eintrag oben

## Eingriffe im Detail

### `status.json`

**Rezeptbuch:**

```diff
- "integratedAt": "2026-05-16",
- "nodeId": "RHhposP0ZBXwUWDn71ffY7QISi_9LvGzlja8mAZ-LRI",
+ "integratedAt": "2026-05-16",
+ "reIntegratedAt": "2026-05-17",
+ "nodeId": "BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY",
+ "previousNodeIds": ["RHhposP0ZBXwUWDn71ffY7QISi_9LvGzlja8mAZ-LRI"],
```

**Mixarium:**

```diff
- "integratedAt": "2026-05-16",
- "nodeId": "7xf0tt33_sInwkqWURdpY1EYDIC9EMfkbC0XXZfoEg4",
+ "integratedAt": "2026-05-16",
+ "reIntegratedAt": "2026-05-17",
+ "nodeId": "JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY",
+ "previousNodeIds": ["7xf0tt33_sInwkqWURdpY1EYDIC9EMfkbC0XXZfoEg4"],
```

**Sage:** unverändert (Erst-Andock 2026-05-21, keine Drift).

### Bewusste Entscheidungen

- **`integratedAt` bleibt 2026-05-16** für Rezeptbuch + Mixarium —
  das ist das Erst-Andock-Datum und semantisch korrekt. Re-Andock-
  Information ist additiv via neues `reIntegratedAt`-Feld.
- **`pingStatus` bleibt `live-direct`** für alle drei — das ist
  HTTP-Liveness (Spore antwortet HTTP 200), nicht der Handshake-
  Pfad-Status. PULS dokumentiert separat den Channel-Bridge-
  Handshake.
- **`previousNodeIds` als Array** gewählt: falls weitere Re-Andocks
  kommen, einfach hinten anhängen — keine Schema-Änderung pro
  Re-Andock nötig.
- **`update_puls_pie.py` aufgerufen** — Pie unverändert (16 Module,
  Verteilung gleich, weil Endknoten-Block nichts mit Pie zu tun
  hat).

### `docs/PULS.md`

Sitzungs-Eintrag oben (über dem Modul-16-Stub-Eintrag) mit voller
Beschreibung. PULS-Endknoten-Tabelle UNVERÄNDERT — die hatte die
korrekten Daten schon, das ist die Source-of-Truth-Doku; status.json
wurde zur PULS-Wahrheit nachgezogen, nicht andersrum.

## Disziplin

- KEIN Code-Eingriff, nur Daten-Pflege.
- KEIN Eingriff in PULS-Endknoten-Tabelle.
- KEINE Modul-Änderung, KEINE neuen Backlogs.
- KEINE Schema-Erweiterung außerhalb der zwei neuen optionalen Felder
  (`reIntegratedAt`, `previousNodeIds`).

## Sichttest

Klaus kann auf der gehosteten Sage-Page nach Pages-Build prüfen, ob
die Endknoten-Karten jetzt die neuen nodeIds anzeigen (z.B.
`BSWxXm…` statt `RHhposP0…` für Rezeptbuch). Pages-Build typisch
1–2 min nach Merge.

## Vorgemerkt

- **Spec-Sitzung 16 SBKIM-Siegel** als nächste eigentliche Sitzung —
  Brief liegt auf `main` (PR #148 gemerged 2026-05-24).
- Folgesitzungs-Pipeline weiterhin: Spec 16 → Bau 16 → Sichttest →
  Spec 15.B mit Siegel-Hook → Endknoten-Migration → App-Freigabe.

## Nächster sinnvoller Schritt

PR mergen → fertig. Klaus startet die Spec-Sitzung 16 mit dem Brief-
Codeblock aus `docs/sessions/BRIEF_SPEC_16_SIEGEL.md` in einer neuen
Sitzung.
