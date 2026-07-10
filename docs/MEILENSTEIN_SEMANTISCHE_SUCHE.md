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

## 4. Was bewiesen ist — und was noch offen bleibt (ehrlich)

### ✅ 2026-07-10 — Die volle bidirektionale Cross-Knoten-Suche ist LIVE bewiesen

**Der Meilenstein ist geschlossen.** Klaus' offene Frage — *„Ist der Beweis
erbracht, dass die volle bidirektionale, server-lose Cross-Knoten-Suche
funktioniert?"* — ist **beantwortet: ja.** Am 2026-07-10 lief in Klaus' Browser
(Splitscreen, beide deployte `main`) die **echte Frage→Antwort in beide
Richtungen**, server-los über `wss://relay.family-projekt.de`:

- **Sage → Mixarium:** Sage fragte „Cocktails mit anderen Waldfrüchten" →
  Mixarium suchte in **seinem** Getränke-Buch und schickte 5 bedeutungs-sortierte
  Drinks zurück (Tropical Creamwave 0.83 … Tropische Kokostraum-Bowl 0.84), in **39 s**.
- **Mixarium → Sage:** Mixarium fragte „wer weiß was über Pilze" → Sage suchte in
  **seiner** Mycel-Bibliothek und antwortete mit 4 Modulen (Reputation, Membran,
  Heterokaryose, Match), in **0,5 s**.

Damit ist bewiesen: eine **Frage** reist als solche übers Brett, und eine
**bedeutungs-sortierte Antwort aus dem aktuellen Inhalt** des anderen Knotens
kommt zurück — nicht nur posten/lesen, sondern echtes Frage→Antwort. Zwei echte
Browser, zwei Schlüsselpaare, ein machtloses Relais dazwischen, kein Server.
Die KI-Brücke ist damit **nicht mehr** der einzige Beweis-Träger — das Mycel
trägt die bidirektionale Bedeutungs-Suche selbst.

**Was es gebraucht hat** (die Härtungs-Kette 2026-07-10): A2-Härtung II
(Antworter vorwärmen + Timeout), saubere Sporen (`saubere-netz-anmeldung`),
Korpus-leer-Falle abgesichert, und die **Adress-Wand-Härtung** (Raum zeigt pro
Knoten-Name nur die neueste Karte; „Antworten: an" heftet eine frische Karte
unter der lauschenden ID) — sonst zielte die Frage auf eine verwaiste Identität.
Modul 23 (`enableAnswering`/`askNode`, Tag `sbkim-qry`), nicht Modul 15.

**Ehrliche Rest-Grenze:** die Antwort kommt zuverlässig nur, wenn der
Antworter-Tab **im Vordergrund + wach** ist (Handy/Tablet drosseln Hintergrund-
Tabs) und seine Karte frisch ist. Eine Wiederhol-Frage auf eine gealterte Karte
lief in „Visitenkarte veraltet". Der nächste Schliff: bei veralteter Karte
automatisch neu lesen + einmal nachfragen (A3-Medium-Härtung).

### Historie — der Weg dahin (was zuvor getrennt bewiesen war)

Klaus' offene Frage, wie sie **vor** dem 2026-07-10 stand — bewusst als
Werdegang festgehalten:

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
- ✅ **Medium-Hälfte jetzt über EIGENES Relay (NEU, 2026-06-25)** — der
  Cross-Geräte-Transport oben lief über **geborgte** Fremd-Relays. Heute steht er
  über Klaus' **eigenes, dummes, log-freies, neutrales** Relay
  `wss://relay.family-projekt.de` (eigene Domain `family-projekt.de`, eigener VPS
  Hetzner CX23; nostr-rs-relay hinter Caddy/Auto-TLS, Docker `logging:none`).
  Beweis: zwei getrennte Knoten (Spore `913db955…` und `4577385…`) tauschen
  Zettel **cross-node**, in der Pinnwand mit **nur** diesem einen Relay aktiv,
  Etikett „via relay.family-projekt.de" — und laut Klaus **blitzartig**, so schnell
  wie die großen öffentlichen. Damit ist die **Fremd-Relay-Metadaten-Abhängigkeit
  aufgelöst** (der Auslöser dieser Sitzung): kein fremder Vermittler mehr, Klaus
  betreibt ein neutrales Rendezvous selbst. Werdegang + ehrliche Grenzen
  (Metadaten/IP/Mixnet): [`discovery/notiz-toolpoint-relay.md`](discovery/notiz-toolpoint-relay.md).
  **Weiterhin offen bleibt** die semantische **Frage→Antwort**-Verdrahtung über
  dieses Medium (siehe nächster Punkt) — der Transport ist bewiesen, die
  Bedeutungs-Hälfte darüber noch nicht.
- ✅ **Die zwei Hälften sind verdrahtet (2026-07-10, siehe oben).** Was hier als
  „noch fehlt" stand — eine **Frage** übers Brett + **bedeutungs-sortierte
  Antwort aus dem aktuellen Inhalt** eines anderen Knotens — ist jetzt live
  beidseitig belegt (Sage↔Mixarium). Korrektur zum damaligen Stand: der
  Netz-Transport lebt in **Modul 23** (`enableAnswering`/`askNode`, Tag
  `sbkim-qry`), nicht in Modul 15 `op:"query"` (das ist der Same-Browser-Zwilling).
  **Offen bleibt** nur noch die Härtung des Mediums: das Nostr-Brett trägt
  bisher nur **öffentliche** Zettel ohne Haltbarkeitsgarantie und ohne
  Spam-Schutz (A3) — das Medium ist bewiesen, nicht gehärtet.
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
