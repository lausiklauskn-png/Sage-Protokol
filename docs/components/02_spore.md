# Modul 02 — Spore (Identität, Schlüssel, Visitenkarte)

**Status:** Schablone (Spec ausstehend)
**Datei (Code):** `src/modules/02_spore.js`
**Abhängigkeiten:** Modul 01 (Storage)

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

## Verantwortung

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

*(noch zu spezifizieren)*

Vorgeschlagene Skizze:

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

---

## Datenformat: SporeJson

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

---

## Storage

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

## Risiken / Edge Cases

- WebCrypto unterstützt Ed25519 erst ab modernen Browsern. Bei
  ungeeignetem Browser: init scheitert, Endknoten-App läuft trotzdem.
- Spore-Format darf keine personenbezogenen Daten aus dem Endknoten-App
  Storage enthalten (Trennung).
- Domainwechsel → Spore neu generieren und neu deployen
  (`sbkim_integration.md` §4.3).

---

## Querverweise

- `sbkim_integration.md` §4.2 (Schlüsselgenerierung)
- `sbkim_integration.md` §4.3 (Spore deployen)
- `sbkim_integration.md` §7 (Versionierung)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
