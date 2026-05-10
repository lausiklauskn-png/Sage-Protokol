# Modul 06 — Heterokaryose (Datenaustausch zwischen Geschwistern)

**Status:** Schablone (Spec ausstehend) — späte Phase, vorerst nicht prioritär
**Datei (Code):** `src/modules/06_heterokaryose.js`
**Abhängigkeiten:** Modul 05 (Anastomose), Modul 02 (Spore)

---

## Zweck

Erlaubt verbundenen Geschwisterknoten, kontrolliert Erfahrungswerte
auszutauschen — etwa neu hinzugekommene Domänen-Stichworte oder
anonymisierte Anfrage-Statistik. Biologische Analogie: Nährstoffaustausch
zwischen verschmolzenen Pilzfäden.

---

## Verantwortung

**Macht:**
- Aktiv angefragten Datensatz an einen Geschwisterknoten senden
- Eingehenden Heterokaryose-Datensatz validieren (Signatur, Schema)
- Inhalte in lokalem Speicher übernehmen, **nur** wenn der Betreiber
  das in der Konfiguration freigegeben hat (Default: aus)
- Datensätze sind klein, signiert, ohne personenbezogene Daten

**Macht nicht:**
- Keine automatische Übernahme ohne Freigabe
- Kein Sync-Protokoll, keine Konsistenzgarantien
- Keine Inhaltsdaten der Endknoten-App (keine Rezepte, keine Cocktails)

---

## Schnittstelle

*(noch zu spezifizieren)*

```
init({ enabled: boolean }) → Promise<void>

shareWith(siblingNodeId: string, payload: HeterokaryosisPayload)
  → Promise<{ accepted: boolean }>

onIncoming(handler: (payload: HeterokaryosisPayload) → "accept"|"reject")
```

---

## Datenformat: HeterokaryosisPayload

*(noch zu spezifizieren)*

Skizze:

```jsonc
{
  "fromNodeId": "...",
  "type":       "domainKeywordsUpdate" | "anonStats" | "...",
  "data":       { /* type-spezifisch */ },
  "createdAt":  "...",
  "signature":  "..."
}
```

---

## Konfiguration

Default: **aus**. Heterokaryose ist Opt-In durch den Betreiber.

```
HETEROKARYOSIS_ENABLED = false
```

---

## Manueller Test

*(später, sobald 05 steht)*

---

## Risiken / Edge Cases

- Vergiftung: ein bösartiger Knoten könnte falsche Stichworte streuen
  → Quorum-Mechanik (Modul 07 / Apoptose) als Gegengewicht.
- Datenschutz: anonymisierte Anfrage-Statistik darf keine
  Re-Identifikation erlauben (k-Anonymität, in Spec festlegen).

---

## Querverweise

- `sbkim_integration.md` §9 ("keine personenbezogenen Daten")
- `sbkim_paper.pdf` Kapitel 15

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
