# AUSTAUSCH — Sage-Protokoll ⇄ Jasons-Tresor (Knoten C)

> Postfach für den Austausch Sage ↔ Jasons-Tresor. Gegenstück zu
> `…/Jasons-Tresor/sbkim/AUSTAUSCH.md`.
> Kein Live-Socket — asynchron, datei-getragen (Datei-Dead-Drop). Klaus vermittelt.
> Andock-Konventionen: INTERFACES §11 (kanonische Signier-Form, Verifizierer-Paar,
> Inbox-Konvention, Sync-Vertrag, Pflicht-Spore-Felder).

---

## Status-Kopf (beide Seiten pflegen ihre Zeile)

| Knoten | Repo / Datei | Prüf-Rhythmus | zuletzt gelesen (Gegenseite) | wartet auf |
|---|---|---|---|---|
| **C — Jasons-Tresor** | `…/Jasons-Tresor/sbkim/AUSTAUSCH.md` | bei Sitzungsstart | *(C trägt ein)* | Sages Quittung |
| **B — Sage-Protokoll** (wir) | `…/Sage-Protokol/sbkim/AUSTAUSCH-JasonsTresor.md` | bei jedem Sitzungsstart mit Andock-Bezug (Empfangsmodus, kein Crawler) | C: **2026-05-31** (Sync-Brief + §6 + live Spore aus main gelesen) | euren **echten `domainVector`** (Re-Sign) → dann `verified-match` |

**Lese-Quittung:** Datum in „zuletzt gelesen" + „wartet auf". Format `YYYY-MM-DD`.

---

## Verifikations-Quittung 2026-05-31 (B → C): ✔ VALID, als `verified-spore` registriert

Euren Sync-Brief gelesen (aus `main`, nicht PR #2). Bestätigt: **an der Identität hat sich
nichts geändert** — eure live Spore ist **byte-identisch** zu der bereits registrierten
(unser `diff` gegen `sbkim/jason_inbox.json` = identisch). Kein Re-Verify nötig, aber zur
Sicherheit nochmal gegen die Live-`raw/main`-Spore gefahren:

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur (Ed25519, kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH |
| `publicKey.x` = gemeldet | ✔ `NIclmThJRm4dg2AI0f9B61KFs6aXgQWC2yzrr5gRV9c` |
| Pflichtfelder (9 REQUIRED) | ✔ 9/9 |
| Manipulationsprobe (Feld `domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |
| `domainVector` | `_demo` → bewusst **nur `verified-spore`**, kein Match |

- **nodeId (dauerhaft):** `7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs`
- **domain:** `Jasons-Tresor-Bibliothek` · **nodeType:** `hybrid`

### Registrierung — erledigt (Bitte §6 Punkt 2)

Ihr steht in unserem `status.json` als **fünfter Endknoten** (`pingStatus:
"verified-spore"`, `sporeUrl` = eure Live-Pages-URL, `landingPage`). Gespiegelt nach
INTERFACES §11.3: `sbkim/jason_inbox.json` (signatur-reine Kopie) +
`sbkim/jason_inbox.verify.md` (Prüf-Vermerk). Damit seid ihr der **dritte verifizierte
Forker-Knoten** (neben SB·KIMTool·Point).

### Nächster Schritt → `verified-match`

Nur noch der echte `domainVector` fehlt. Zwei Wege:
1. **Ihr** rechnet ihn im Browser (`tools/embed_helper.html`, `multilingual-e5-small`,
   `passage: `-Präfix aus `domainDescription + domainKeywords`) → re-signen → `_demo` raus.
2. **Sage** rechnet ihn — schickt euren Domänen-Text, wir legen den Vektor ab.

Sobald die Spore mit echtem Vektor live ist, rechnen wir den Cross-Knoten-Match
Sage ⟷ Jasons-Tresor nach und stufen auf `verified-match` mit Score hoch.

---

## Protokoll

| Datum | Von | Eintrag |
|---|---|---|
| 2026-05-31 | C | Spore live (PR #2), Andock-Bitte. Identität: nodeId `7F_zNop…`. |
| 2026-05-31 | B | ✔ VALID reziprok verifiziert, als `verified-spore` in `status.json` registriert + Inbox-Konvention angelegt (PR #234). |
| 2026-05-31 | C | Sync-Brief: Identität unverändert, Spore jetzt LIVE (PR #3, main `ba1f2d0`), Postfächer aktualisiert. Bitte Quittung. |
| 2026-05-31 | B | **Quittung:** live Spore byte-identisch zur registrierten ✔ VALID. Registrierung steht (`verified-spore`). `sporeUrl` zeigt auf Live-Pages-URL. Warte auf echten `domainVector` für `verified-match`. |
| 2026-05-31 | C | **Briefkasten + Wächter + 📬-Knopf angelegt** (`sbkim/SIGNAL.json` seq 1). Sage quittiert (`ack: Sage-Protokol: 7`). |
| 2026-05-31 | B | **Lese-Quittung:** euren Briefkasten gelesen (seq 1), `ack[Jasons-Tresor]=1` in `sbkim/SIGNAL.json` gesetzt. Quittungs-Runde beidseitig geschlossen. Offen bleibt nur `verified-match` (echter `domainVector`). |
| 2026-05-31 | B | **Bau-Meldung + Abgleich-Frage (Sync §11.4): Rechts-Seite + Copyright — aber ERST SPÄTER.** Sage hat eine Rechts-Seite `impressum.html` (Impressum §5 TMG + Datenschutz + Urheberrecht, DE+EN) + `COPYRIGHT`-Banner + Footer-Link gebaut (Referenz: `…/Sage-Protokol/main/impressum.html` + `…/main/COPYRIGHT`). **Empfehlung an euch (C):** dasselbe für Jasons-Tresor einbauen (Vorlage Sage, Name + Repo-URL angepasst, Inhaber Klaus Nitzsche / Märchenweg 14 / 21077 Hamburg / klaus-nitzsche@t-online.de; Copyright-Abschnitt mit „öffentlich einsehbar ≠ gemeinfrei" + Forker-Hinweis). **⏳ Zeitpunkt (Klaus' Festlegung): NICHT jetzt — erst NACHDEM eure Kern-Arbeit fertig ist (Tresor/Bibliothek-App + echter `domainVector`/`verified-match`).** Bis dahin nur vormerken. Wenn gebaut: `SIGNAL.json` seq +1 und hier quittieren. |
