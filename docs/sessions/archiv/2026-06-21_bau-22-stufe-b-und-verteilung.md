# Übergabeprotokoll — 2026-06-21 · Bau 22 Such-Werkzeug Stufe A→B + Verteilung

**Rolle:** Bau/Pflege-Sitzung Modul 22 (Such-Werkzeug). Sehr langer, interaktiver
Increment-Marathon mit Klaus am Galaxy-Tab-S6, live getestet.

**Alle PRs gemerged (#351–#379).** Kein offener PR aus dieser Sitzung. (Fremd-PR
#302 BLP-E2E vom 2026-06-19 bleibt offen — Klaus-Entscheid.)

---

## Was gebaut wurde (chronologisch)

### Stufe A — KI-Such-Brücke (Gratis-Kopier-Pfad)
Der Kern-Gedanke: das Widget **sucht nicht selbst**, es **baut den Prompt und
ordnet die Antwort**. Eine KI mit Web-Suche liefert Quellen als Text (kein CORS-
Problem auf dem Kopier-Weg). `buildPrompt(query, context)` + `parseAiAnswer`
(Code-Fence + URL-Müll-Säuberung, am Real-Test bestätigt) + `setAiAnswer` →
bestehende Sortier-Pipeline. KI-Anbieter-Dropdown. **Browser-Sichttest grün**
(ChatGPT-Antwort live geparst + sortiert).

### Prompt-Reife (Klaus' konzeptionelle Beiträge)
- **Recall-Lehre (NoBite-Befund):** ein gutes Mittel fiel KOMPLETT raus, weil die
  KI es beim **Sammeln** nicht erfasste — nicht weil die Sortierung schlecht war.
  Stufe 1 (Recall) ≠ Stufe 2 (Ranking).
- **Bedeutung zuerst, nicht Breite:** Prompt führt jetzt mit „VERSTEHE ZUERST DIE
  BEDEUTUNG … suche danach, nicht nach Wörtern".
- **Schärfen-Feld:** fordert vor dem Prompt aktiv zum Präzisieren auf (Kontext →
  in den Prompt gewoben).
- **Agenten-Visitenkarte-Präambel:** das Tool stellt vor jeder Anfrage sein Ziel
  vor — „Verstehen beginnt am Handschlag". Vision-Karte `_vision_such_agent.md`.

### Treffer-Anzeige
10 sichtbar + „▾ weitere 10"; Wert als **Prozent**; **Inhalts-Snippet** unter dem
Titel; **🖨 Block kopieren** (alle Treffer als Text → Klaus-Relay);
**Fortschrittsbalken** während des Web-Such-Aufrufs.

### Stufe B1 — Widget-Tresor (self-contained)
Klaus' Entscheid: **eigenes, portables Schloss** im Widget (nicht an Modul 20
gekoppelt). WebCrypto **PBKDF2-SHA256 ≥600k → AES-GCM-256**, **Shamir 2-von-3**
(GF256, aus Modul 20 portiert), localStorage `sbkim_search_widget_vault`. Surface
`hasVault/isVaultUnlocked/createVault/unlockVault/lockVault/deleteVault/
setVaultSecret/recoverVaultPassword`. 🔐-Modal-UI (anlegen/entsperren/sperren/
löschen + Anteile-Sicherung). Passwort nie gehalten, Schlüssel nur im RAM,
falsches Passwort → false (kein Oracle), kein Klartext im Speicher.

### Stufe B2 — automatischer Claude-Aufruf (Probe, EIN Anbieter)
`autoSearch(query)` → `POST api.anthropic.com/v1/messages` mit Header
`anthropic-dangerous-direct-browser-access` + `web_search`-Tool → `parseAiAnswer`
→ sortieren. Schlüssel aus Tresor/`init({apiKey})`, Modell `init({aiModel})`,
`max_tokens` 8192. Fail-soft (CORS/Key/Netz → Hinweis + Kopier-Weg-Fallback;
keine Liste → Rohantwort ins Einfüge-Feld zur Diagnose).
**CORS LIVE bestätigt** — der Browser-Direkt-Aufruf funktioniert. Live-Läufe:
30 Treffer (Hund), 38 Treffer (Hund + Katze). **Referenzfall 2 bestanden mit
Auszeichnung:** mit „Hund + Katze"-Kontext erkannte Claude die Permethrin/Katzen-
Konsequenz von selbst (BVL, Uni Gießen Kleintierklinik …), ohne dass „Permethrin/
Katze" im Prompt stand.

### Weiteres
- **KI-Anbieter:** Mistral + Aleph Alpha RAUS (Klaus: Aleph Alpha ohne Web-Suche,
  Mistral 4× schwach), **Gemini** dazu (Benchmark-Spitze abstraktes Schließen +
  Mehrsprachig). Nur widget-scoped — BLP behält Mistral intern.
- **SearXNG** als wählbare Suchmaschine.
- **X (oben parken) leert den Inhalt, – (minimieren) behält ihn.**
- **Werkzeugkiste:** Modul 22 als eigene Kachel „Such-Werkzeug" in der
  Vorteilspack-Truhe (kopierbarer Code + Einbau-Anleitung).
- **`llms.txt`** an der Wurzel — maschinenlesbare Agenten-Einladung (Schicht 3
  Mit-Bauer in gleicher Würde).
- **Meilenstein-Doku** `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` + ⭐-Anker in
  CLAUDE.md (Klaus: nicht unterschwellig verschwinden lassen).
- **Referenz-Fälle-Karte** `docs/components/_such_referenzfaelle.md` (Wespen +
  Hund-Katze, B3-Goldstandard).
- **`impressum.html`** Datenschutz um Such-Tool/externe-KI-Aufrufe ergänzt
  (Sektion 6 DE+EN). Spenden-Button bewusst weggelassen (Klaus).

**Tests:** Headless-Smoke Modul 22 **148/148**; Vorteilspack-Truhe **22/22**.

---

## Sicherheit gewahrt
Tresor-Krypto spiegelt die geprüften Parameter (Modul 02/20). Schlüssel nur lokal/
verschlüsselt, nur an den vom Nutzer gewählten Anbieter, nie ins Mycel/an Dritte.
KI-/Web-Suche ist Pilz-Schicht (bewusste, getrennt ausgelöste Nutzer-Aktion) —
Knoten bleibt Empfangsmodus. Briefkasten-/Fremd-Inhalt unverändert untrusted.

## Was bewiesen ist / was nicht (Meilenstein-Kernpunkt)
- ✅ Semantisches Verstehen + Sortieren (Referenz-Fälle).
- ✅ Server-loser Browser-Direkt-Aufruf an eine KI mit Web-Suche (CORS).
- ⏳ Volle **bidirektionale Cross-Knoten-Suche server-los** noch NICHT end-to-end
  (braucht ≥2 echte Knoten; KI-Brücke war Behelfs-Beweis-Träger).

## Offene Punkte (für die nächste Sitzung)
1. Klaus-Browser-Sichttests der neuen Felder (Tresor-UI, Fortschrittsbalken, ⚡).
2. **B3** — sicherheits-/eignungs-bewusster Richter (Unsicheres rot/herabstufen).
3. **Such-Panel breiter ziehbar** (Klaus: unteres Lesefeld eng).
4. **Standalone-Single-File-PWA-Download** des Such-Tools + eigene Fußzeile.
5. **Endknoten-Einbau-Test** (Mein-Mixarium / Mein-Rezeptbuch — externes Repo).
6. **PULS-Überlauf** (5882 > 3000) — Archiv-Auslagerung als eigene Wartung.
7. **PR #302** (BLP-E2E-Antwort) — Klaus-Entscheid mergen/lassen.
8. **SB-KIMTool-Point** informieren (Such-Tool + Breitziehen + Impressum) —
   Klaus relayt den Brief (es baut bereits an seiner PWA-App).

## Nächster sinnvoller Schritt
B3 (Richter) oder Breitziehen oder Standalone-PWA — siehe Folge-Brief
`docs/sessions/BRIEF_BAU_22_B3_UND_VERTEILUNG.md`. Vorher Klaus' Sichttests.
