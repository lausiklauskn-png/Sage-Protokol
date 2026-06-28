# Übergabeprotokoll — Inhalts-treuer Domänen-Vektor (2026-06-28)

**Rolle:** Bausitzung · **Branch:** `claude/content-based-domain-vector-w3qx62`
**Freibrief galt** (CLAUDE.md § Freibrief).

## Auftrag
Den `domainVector` der Spore aus dem **echten App-Inhalt** erzeugen statt aus
der Selbstbeschreibung („Hülle"), inkl. Re-Embedding-Werkzeug, Spec-vor-Code,
zuerst nur in Sage, dann netzweiter Rollout. Plus Meilenstein-Doku.

## Was gebaut wurde (Sage, Hub)
- **Modul 03** `embedContentVector(samples, opts?)` → `{vector, count, source}`.
- **Modul 02** `regenerateOwnSpore(updates, key?)` + Allow-List-Erweiterung
  (`embeddingSource`, `embeddingVersion`, `embeddingCapabilities`, `embeddingNeeds`).
- Additive Spore-Felder `embeddingSource` (`content|description`) +
  `embeddingVersion`. PROTOCOL_VERSION bleibt `"0.1"`.
- Bundle `sbkim-connect.js`: optionaler `sampleContent()`-Callback in
  `createIdentity` (fail-soft Fallback auf Beschreibung). Byte-1:1-Kopien 02/03.
- Spec-Karten 02 + 03 nachgezogen. Meilenstein
  `docs/MEILENSTEIN_VON_DER_HUELLE_ZUM_INHALT.md` (Bild-Platzhalter).
- Smoke `tests/smoke_inhaltstreuer_domainvektor.mjs` 25/25 grün.

## Entscheide (Klaus „keine Präferenz" → empfohlene Defaults)
1. Vektor-Quelle: **Inhalt entscheidend, Beschreibung nur Fallback** (markiert
   via `embeddingSource`).
2. Sampling: **bis ~32 Einträge, nur unkritische Labels/Kategorien**; sensible
   Apps (Tresor/BLP) nur Fach-Namen, nie Klartext-Beträge/Belege.
3. Schwelle: **zentrierter Cosinus + neu kalibrieren** — als eigene Folge-Sitzung
   mit echten Browser-Vorher/Nachher-Messwerten (nicht still, nicht blind).

## Offen / nächste Schritte
- Browser-Live-Match (echtes e5-Modell) — wartet auf Klaus.
- 0.80-Schwelle neu kalibrieren (eigene Sitzung).
- Netzweiter Rollout: `sampleContent()` je Knoten + Re-Sign im Browser
  (Reihenfolge wie Modul 23). Verified-match vorher/nachher vergleichen.

## Datenverträge / Leitplanken eingehalten
384-dim, L2-norm, `Xenova/multilingual-e5-small`, `embedPassage`-Pfad. Additive
Felder, kein PROTOCOL_VERSION-Sprung. Kein PII (nur Labels). Empfangsmodus
unberührt (Re-Embedding nutzer-ausgelöst). Kopieren statt klonen (byte-1:1).
