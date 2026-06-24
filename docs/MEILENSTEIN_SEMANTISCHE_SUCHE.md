# MEILENSTEIN — Semantische, bidirektionale, server-lose Bedeutungs-Suche

> **Besonderer Punkt. Nicht unterschwellig behandeln.** Auf diesem Fundament
> wird weitergebaut. (Klaus 2026-06-21)

Am 2026-06-21 ist im Sage-Mycel etwas entstanden, das mehr ist als ein Widget:
ein **Such-Werkzeug, das die Bedeutung hinter den Worten versteht** — nicht die
Stichwörter zählt. Und zwar **ohne Server**, im Browser, peer-to-peer gedacht.
Dieser Meilenstein hält fest, **auf welchen Spuren** das gewachsen ist, **was
bewiesen** wurde und **was noch zu beweisen** bleibt.

> **Siehe auch:** [`WARUM_SBKIM_STATT_KI.md`](WARUM_SBKIM_STATT_KI.md) — die
> ehrliche Positionierung „Warum diese App statt einfach eine KI?" (Alleinstellung,
> wo der Wert wirklich entsteht, ob auch Server-Seiten mitmachen können).

---

## 1. Was das Besondere ist

**Semantische, bidirektionale Suche.** Zwei Eigenschaften, die zusammen den Kern
ausmachen:

- **Semantisch** — gesucht und sortiert wird nach **Bedeutung/Absicht**, nicht
  nach exakten Wörtern. „NoBite Permethrin-Kleidungsspray" ist bedeutungsnah zu
  „Mittel gegen Zecken", auch ohne das Wort „Zecke".
- **Bidirektional** — ein Knoten **fragt** (sucht bei anderen nach Bedeutung)
  **und antwortet** (beantwortet die Bedeutungs-Fragen anderer). Empfangsmodus
  mit Antwortrecht.
- **Server-los** — kein zentraler Index, kein Konto, keine Cloud, kein Türsteher
  mit verborgenen Interessen. Peer-to-peer zwischen kleinen PWAs.

Das ist der Gegenentwurf zur Schlagwort-Suchmaschine: nicht „welche Seite enthält
diese Wörter", sondern „**was meint dieser Mensch wirklich — und wer im Netz hat
dazu etwas, das passt?**"

---

## 2. Auf welchen Spuren es gewachsen ist (das Fundament)

Das Such-Werkzeug hat nichts neu erfunden — es **komponiert** die SBKIM-Bausteine:

- **Modul 03 Embedding** (`Xenova/multilingual-e5-small`, 384 Dim) — die
  eigentliche **Bedeutungs-Maschine**: Text → Vektor. Lokal, server-los.
- **Modul 04 Match** — `queryLocal` (Cosinus-Sortierung über einen Korpus) +
  `hybridMatch` (KI-Richter). Die **Sortier-/Urteils-Schicht**.
- **Modul 02 Spore** — semantische Identität eines Knotens; Basis der
  Agenten-Visitenkarte (eine Identität, zwei Leser).
- **Modul 17 Floating-Widget** — Drag/Self-Mount/X/Persistenz-Mechanik, hier
  wiederverwendet (17 selbst unangetastet).
- **Das BLP-Zwei-Stufen-Muster** — Eingang (Sammeln) → in-App-Sortiermaschine
  (03+04). Sage-native nachgebaut.
- **Die Vier-Schichten-Lesart** — das Werkzeug ist **Pilz-Schicht** (bewusstes,
  benanntes, nutzer-ausgelöstes Tool), der Mycel-Knoten bleibt Empfangsmodus.

Der Werdegang in Increments (alle 2026-06-21):
Modul 21 Spracheingabe → Modul 22 Widget-Shell → Mehrfach-Suche (App/Knoten/Netz)
→ KI-Such-Brücke (Stufe A, Kopier-Weg) → **Bedeutung-zuerst-Prompt** →
**Agenten-Visitenkarte** → Schärfen-Feld → **Recall-Lehre** (NoBite) → Treffer-UI
(10 + Pfeil + Prozente + 🖨 Block) → **Tresor B1** (Shamir 2/3) →
**B2 automatischer KI-Aufruf** (Claude direkt aus dem Browser) → Agenten-Einladung
(`llms.txt`) → Fortschrittsbalken.

---

## 3. Was bewiesen ist

- **Semantisches Verstehen + Sortieren funktioniert** — belegt an festen
  Referenz-Fällen ([`components/_such_referenzfaelle.md`](components/_such_referenzfaelle.md)):
  - **Wespen** — Off-Topic („Nest entfernen") landet unten, trotz Wort-Überlappung.
  - **Hund + Katze** — die KI erkennt aus zwei Worten Kontext die **Konsequenz**
    (Permethrin ist für Katzen tödlich) und sammelt amtliche/tierärztliche
    Warnquellen (BVL, Uni Gießen) — **ohne** dass „Permethrin/Katze" im Prompt
    stand. Bestanden mit Auszeichnung.
- **Server-loser Browser-Direkt-Aufruf an eine KI mit Web-Suche geht** (B2,
  CORS-Beweis live erbracht) — der Behelfs-Weg, über den wir die semantische
  Qualität ohne eigenes Knoten-Netz testen konnten.

---

## 4. Was NOCH NICHT bewiesen ist (ehrlich)

Klaus' offene Frage, bewusst festgehalten: **Ist der Beweis erbracht, dass die
volle bidirektionale, server-lose Cross-Knoten-Suche funktioniert?** — **Noch
nicht vollständig.** Sauber getrennt:

- ✅ **Semantik-Hälfte bewiesen** — Bedeutung verstehen + ranken.
- ✅ **Medium-Hälfte bewiesen (NEU, 2026-06-24)** — der **server-lose Transport
  zwischen zwei getrennten Geräten** steht. Boden-Beweis über ein geborgtes
  dummes Brett (Nostr-Relays): Klaus' Handy (Spore `e87a1618…b365`) tippt einen
  Zettel → er taucht live im Tablet-Browser (andere Spore `2e084f93…7fae`, andere
  Identität) via `relay.damus.io` auf, und umgekehrt. **Zwei echte Browser, zwei
  Schlüsselpaare, ein machtloses Brett dazwischen — Klaus betreibt nichts.** Damit
  ist „Browser fragt Browser server-los" **nicht mehr nur über die KI-Brücke**
  belegt, sondern direkt über ein Medium. Test (Notiz-Charakter, nicht verlinkt):
  [`discovery/nostr-test/`](discovery/nostr-test/), Protokoll
  [`sessions/archiv/2026-06-24_nostr-pinnwand-test.md`](sessions/archiv/2026-06-24_nostr-pinnwand-test.md).
- ⏳ **Was noch fehlt — die zwei Hälften verdrahten.** Bewiesen sind jetzt
  *Semantik* (lokal) und *Medium* (server-loser Cross-Geräte-Transport) — aber
  **getrennt**. Noch nicht gezeigt: dass eine **Frage** als solche übers Brett
  geht und eine **bedeutungs-sortierte Antwort aus dem aktuellen Inhalt** eines
  anderen Knotens zurückkommt (Frage→Antwort statt nur posten/lesen; Modul 04.C
  `queryLocal` + Modul 15 Membran `op:"query"`). Plus: das Nostr-Brett trägt
  bisher nur **öffentliche** Zettel ohne Haltbarkeitsgarantie und ohne
  Spam-Schutz — das Medium ist bewiesen, nicht gehärtet.
- **Warum der Umweg über die KI-Brücke war?** Weil wir (noch) kein Knoten-Netz und
  keinen Server hatten, haben wir die **semantische Qualität** über eine externe
  KI (Pilz-Egress) getestet — als **Beweis-Träger und Brücke**, bis das Mycel
  selbst genug Fruchtkörper hat. Mit dem Medium-Beweis ist die Brücke nun nicht
  mehr der **einzige** Weg, server-los zwischen Browsern zu reden — ein echter
  Schritt vom Zwischenstand zum Fundament.

Das ist genau die Lücke, die die nächsten Bauten schließen (Modul 04.C
Cross-Knoten-Antwort, Modul 15 Membran `op:"query"`, der Cross-Knoten-Such-Test
Phase C).

---

## 5. Worauf wir aufbauen

- **B3 — sicherheits-/eignungs-bewusster Richter:** Unsicheres rot markieren /
  herabstufen, Sicheres hochstufen (der Hund-Katze-Fall zeigt den Bedarf).
- **Cross-Knoten-Bidirektionalität** (Modul 04.C + 15) — die fehlende Hälfte.
- **Verteilung als Werkzeug:** download-/kopierfähige PWA in der
  Observatoriums-Werkzeugkiste; Einbau in Endknoten (Mein-Mixarium /
  Mein-Rezeptbuch) als Testwert; ins SBKIM-Tool als **eigenständiges** Werkzeug
  (nicht nur Andock-Tool — es läuft allein).
- **Offene Strategie-Frage (Klaus 2026-06-21):** Soll das Werkzeug einen
  **eigenen Knoten-Status** bekommen? Einschätzung: es ist ein **Pilz-Werkzeug /
  Agent-Frontend**, das in Knoten **eingebettet** wird und standalone laufen kann;
  mit eigener Spore/Visitenkarte + Tresor wird es **knoten-ähnlich** (ein
  Agent-Fruchtkörper), ohne eine kuratierte Inhalts-Domäne zu sein. Empfehlung:
  erst **einbettbar + standalone** festigen, „eigener Knoten" als bewusster
  Folge-Entscheid.

---

*Dieser Meilenstein wird in CLAUDE.md verankert, damit er nicht verloren geht.*
