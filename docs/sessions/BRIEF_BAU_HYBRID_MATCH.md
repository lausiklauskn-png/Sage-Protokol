# Brief — Bau-Sitzung Hybrid-Match (Modul 04.D + Sub-B-Hochstufung)

> Auslöser: Brainstorming Klaus + Sage 2026-06-20. Konzept liegt vollständig in
> [`docs/HYBRID-MATCH-KONZEPT.md`](../HYBRID-MATCH-KONZEPT.md). Vorgeschichte:
> Anisotropie-Befund [`docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`](../LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md).

Diese Bau-Sitzung setzt den **Match-Zeit-Richter** des Hybrid-Match additiv um. Sie ändert
**nicht** das netzweite Embedding/den Vorfilter-Default (das ist ein eigener, koordinierter
Schritt — siehe Tabus). Freibrief gilt (CLAUDE.md § Freibrief).

Der vollständige, copy-paste-fähige Sitzungs-Brief:

```
Rolle: Bau-Sitzung — Modul 04 Hybrid-Match (Match-Zeit-LLM-Richter, additiv).

Pflichtlese (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md (oberste Einträge: Anisotropie-Befund + BLP verified-match + dieses Brainstorming)
3. docs/HYBRID-MATCH-KONZEPT.md   (das Konzept, verbindlich)
4. docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md   (warum)
5. docs/INTERFACES.md § 1 Modul 04
6. docs/components/04_match.md + src/modules/04_match.js (v.a. das schon vorhandene
   Sub-B explainMatchLLM — der Keim)

Ziel (additiv, fail-soft, nichts Bestehendes brechen):
- Eine Hybrid-Match-Schicht auf Basis des vorhandenen Sub-B explainMatchLLM:
  * VORFILTER bleibt lokal: bestehender Cosinus (Modul 04) liefert Kandidaten.
  * RICHTER (neu): provider-abstrahierter LLM-Pass urteilt über die Kandidaten
    (passt/passt-nicht + Begründung + Score). Anbieter-Abstraktion: Claude / Mistral /
    OpenAI / lokal — Knoten wählt, EU-Default für DSGVO-Knoten, BYOK (kein hardcoded Key).
  * FAIL-SOFT: LLM nicht erreichbar / kein opt-in -> Vorfilter-Ergebnis gilt (lokal
    entscheidet weiter). KEIN harter Fehler.
  * BEZEUGUNG: Urteil-Format (Score + Begründung + Anbieter-Marker + Datum), das ein
    Aufrufer signiert in die Inbox legen kann.
- Smoke-Test (Mock-LLM): Happy-Path Richter, Fail-soft-Fallback auf lokal, opt-in aus.
- Panel in tests/manual_check.html (Knopf-Sichttest, Mock-Anbieter).
- INTERFACES § Modul 04 + Karte 04 um die Hybrid-Schicht ergänzen.

Tabus (WICHTIG):
- KEINE netzweite Schwellen-Änderung und KEIN Whitening-Flip von matchDimensions/queryLocal
  in dieser Sitzung — das ist der separate Anisotropie-Hebel (eigene koordinierte
  Entscheidung, Klaus). Hybrid baut NEBEN den bestehenden Pfaden, ändert deren Default nicht.
- KEIN PROTOCOL_VERSION-/DB_VERSION-Bump ohne Klaus.
- BYOK, opt-in, kein Schlüssel im Code, kein PII, Empfangsmodus (keine Eigenanfragen ins
  offene Netz außer dem bewussten, vom Knoten konfigurierten Richter-Call).
- Vorfilter MUSS offline/server-los lauffähig bleiben (lokales Embedding).

Klaus entscheidet im Bau (offene Parameter, Konzept § Offene Bau-Parameter):
1. Richter Pflicht oder opt-in (Empfehlung opt-in).
2. Bidirektional-Regel: eine Seite genügt vs. beide nötig.
3. Vorfilter roh-mit-höherer-Schwelle vs. gewhitened (falls Anisotropie-Hebel schon gezogen).

Abschluss: Headless-Smoke grün, node --check grün, Sichttest-Knopf da (wartet auf Klaus'
Browser-Lauf). PULS + Übergabeprotokoll. Branch-Vorschlag: claude/bau-04d-hybrid-match.
Eigenen PR selbst mergen, sobald getestet + abgegrenzt (Freibrief).
```

## Voraussetzungen / Hinweise für die Bau-Sitzung
- Der **Anisotropie-Hebel** (Whitening + Schwellen-Neukalibrierung von Modul 04) ist eine
  **separate** netzweite Entscheidung — diese Sitzung wartet nicht darauf, baut aber so, dass
  beides später zusammenpasst (Vorfilter austauschbar).
- Headless-LLM-Aufrufe sind im Sage-Container ggf. gesperrt (Egress) — Smoke nutzt einen
  **Mock-Anbieter**; der echte Anbieter-Call wird über Klaus' Browser-Sichttest mit echtem
  Key geprüft (analog Bau 04.B).
