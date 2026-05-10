# Modul 02 — Spore

> **Status:** 🟫 Schablone  ·  **Schicht:** Kern  ·  **Anker:** Sage-Page → Karte 4, Eintrag 02
> **Datei (Code):** `src/modules/02_spore.js`
>
> _Ed25519-Identität, signierte Visitenkarte, abgeworfen unter
> `/.well-known/sbkim/spore.json` — die Knoten-Ich-Erklärung des
> Mycels._

---

## Im Mycel-Bild

Die Spore ist die **signierte Visitenkarte** des Knotens. Sie trägt
Identität (Ed25519-Schlüsselpaar), Domäne und Endpunkt-Adressen — alles
zusammengefasst in einer kleinen JSON-Datei mit Signatur. Ein Knoten,
der seine Spore verliert, ist gestorben: ein Pilz wächst nicht aus dem
Nichts wieder, er beginnt mit einer neuen Spore und ist damit ein neuer
Knoten. Das ist konsequent: Identität bedeutet, den eigenen Schlüssel
zu halten.

---

## Visualisierung

```svg
<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sporeBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <filter id="sporeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect x="20" y="20" width="440" height="200" rx="14" fill="url(#sporeBg)" stroke="#6366F1" stroke-width="1.5" filter="url(#sporeShadow)"/>
  <text x="40" y="56" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">protocolVersion</text>
  <text x="200" y="56" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">"0.1"</text>
  <text x="40" y="84" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">nodeId</text>
  <text x="200" y="84" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">sha256(publicKey)</text>
  <text x="40" y="112" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">domain</text>
  <text x="200" y="112" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">"rezeptbuch.example"</text>
  <text x="40" y="140" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">domainKeywords</text>
  <text x="200" y="140" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">["Backen","Saucen",...]</text>
  <text x="40" y="168" font-family="ui-monospace,monospace" font-size="13" fill="#F59E0B">endpointPaths</text>
  <text x="200" y="168" font-family="ui-monospace,monospace" font-size="13" fill="#EEEEFF">{ spore, query, ... }</text>
  <g transform="translate(380,140)">
    <circle r="32" fill="none" stroke="#16A34A" stroke-width="2"/>
    <text x="0" y="-4" text-anchor="middle" font-size="11" fill="#16A34A">Ed25519</text>
    <text x="0" y="12" text-anchor="middle" font-size="11" fill="#16A34A">Signatur</text>
  </g>
  <text x="40" y="200" font-family="ui-monospace,monospace" font-size="11" fill="#94A3B8">— Spore wird unter /.well-known/sbkim/spore.json abgelegt —</text>
</svg>
```

---

## Zweck

Erzeugt und verwaltet die Identität eines Knotens:

- Ed25519-Schlüsselpaar (einmalig, persistent in `sbkim_keys`)
- `node_id` = SHA-256 des öffentlichen Schlüssels
- Spore-JSON mit Meta-Daten und Signatur, ausgeliefert unter
  `/.well-known/sbkim/spore.json` (oder Alias)

Geht der private Schlüssel verloren, ist der Knoten tot — ein neuer
Aufbau erzeugt einen neuen Knoten. Konsistent mit dem Pilz-Modell.

---

## Verantwortlichkeiten

**Macht:**
- Schlüsselpaar erzeugen (WebCrypto Ed25519)
- Schlüsselpaar persistieren in `sbkim_keys`
- `node_id` aus public key ableiten (SHA-256)
- Spore-JSON bauen, signieren, validieren
- Fremde Spore prüfen (Signatur-Verifikation)

**Macht nicht:**
- Keine Wiederherstellung verlorener Schlüssel
- Keine Backup-Funktion (ein verlorener Knoten ist gestorben)
- Keine Spore-Veröffentlichung (das deployt der Betreiber manuell ins Repo)

---

## Schnittstelle

*(noch zu spezifizieren)* — Vorgeschlagene Skizze:

```
init() → Promise<void>
  // lädt vorhandenes Schlüsselpaar oder erzeugt neues

getNodeId() → string  // hex-string der SHA-256 vom public key
getPublicKeyJwk() → JsonWebKey
generateOwnSpore(meta: {
  domain: string,
  nodeName: string,
  nodeType: "provider" | "seeker" | "hybrid",
  domainDescription: string,
  domainKeywords: string[],
  endpointPaths: { spore, query, anastomosis, heterokaryosis, legacy },
  protocolVersion: string,
}) → Promise<SporeJson>

verifyForeignSpore(spore: SporeJson) → Promise<{
  valid: boolean,
  reason?: string,
}>
```

### Datenformat: SporeJson

*(noch zu spezifizieren — Pflichtfelder im Detail)*

Skizze (siehe Paper Kapitel 13, sobald verfügbar):

```jsonc
{
  "protocolVersion": "0.1",
  "nodeId":          "<sha256-hex>",
  "publicKey":       { /* JWK */ },
  "domain":          "rezeptbuch.example.org",
  "nodeName":        "Rezeptbuch Klaus",
  "nodeType":        "hybrid",
  "domainDescription": "...",
  "domainKeywords":  ["...","..."],
  "domainVector":    [/* 384 floats, optional bei kleinen Spores */],
  "endpointPaths":   { /* siehe INTERFACES §3 */ },
  "createdAt":       "2026-05-10T07:00:00Z",
  "signature":       "<base64-ed25519>"
}
```

### Storage

Stores: `sbkim_keys`, `sbkim_spore`.

---

## Manueller Test

1. `tests/manual_check.html`: Knopf "Spore init".
2. Erwartung: erste Ausführung erzeugt Schlüssel, zeigt `node_id`.
   Zweite Ausführung lädt denselben Schlüssel (gleiche `node_id`).
3. Knopf "Eigene Spore generieren": JSON-Ausgabe ins Fenster.
4. Knopf "Fremde Spore prüfen" mit der eigenen JSON: `valid: true`.
5. Knopf "Spore manipulieren und prüfen": ein Feld ändern, erwartet
   `valid: false`.

---

## Risiken & offene Punkte

- WebCrypto unterstützt Ed25519 erst ab modernen Browsern. Bei
  ungeeignetem Browser: init scheitert, Endknoten-App läuft trotzdem.
- Spore-Format darf keine personenbezogenen Daten aus dem Endknoten-App
  Storage enthalten (Trennung).
- Domainwechsel → Spore neu generieren und neu deployen
  (`sbkim_integration.md` §4.3).

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Site-Echo | 2026-05-10 | Site-Echo | Hero, Bio-Metapher, Spore-SVG, Querverweise |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |

---

**Querverweise**

- **Abhängigkeiten:** Modul 01 (Storage)
- **Wird genutzt von:** Modul 05 (Anastomose) · Modul 07 (Apoptose) · Modul 06 (Heterokaryose) · Modul 10 (Reputation)
- **Site-Karte:** [Karte 4 · Module-Bento](../../index.html#screen-overview), Eintrag 02 · [Karte 10 · Andocken](../../index.html#screen-overview) (Live-Generator)
- **Glossar:** [Spore](../GLOSSAR.md), [Knoten-ID](../GLOSSAR.md), [Ed25519](../GLOSSAR.md)
- **Integration:** `sbkim_integration.md` §4.2 (Schlüsselgenerierung), §4.3 (Spore deployen), §7 (Versionierung)
- **Paper:** Kapitel 13 (Spore-Format)
