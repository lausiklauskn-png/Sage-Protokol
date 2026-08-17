---
name: geraetename
description: Rezept für einen frei wählbaren „Gerätenamen" (Anzeige-/Spitzname), damit ein SBKIM-Knoten/eine App im gemeinsamen Netz-Raum, auf der Mycel-Karte UND auf den Brett-Zetteln unterscheidbar wird — z. B. „Kimboard · Klaus-Handy" statt nur „Kimboard". Anwenden, wenn mehrere Instanzen derselben App (zwei Geräte, DeX + Tablet) auf der Karte/im Raum nur an der kryptischen Kennung unterscheidbar sind, ODER wenn ein Nutzer fragt „von wem kommt das?/kann man einen Namen dazugeben?". WICHTIG (family-projekt.de-Marktplatz, fremde Apps): Der Name ist NUR ein Hinweis, NIE ein Vertrauens-Beweis — jeder kann jeden Namen wählen. Darum: Name immer MIT Kennung anzeigen, eigene Kontakt-Namen (TOFU/B7) gewinnen, selbst-gewählte Namen als „nicht geprüft" markieren. Kein Spore-Re-Sign, kein Eingriff ins Kern-Modul 23 — reine Anzeige-Glue.
---

# Gerätename (frei wählbarer Anzeige-Name für einen SBKIM-Knoten)

Ein **kleiner, frei gewählter Name** („Klaus-Handy", „Werkstatt-Tablet", „Klaus N."),
den ein Nutzer seiner App-Instanz gibt, damit man im **Netz-Raum / auf der
Mycel-Karte** und auf den **Brett-Zetteln** sieht, **von wem** etwas kommt — statt
nur die kryptische Kennung (`6f902d9b…54a4`) zu sehen.

**Auslöser (real, Klaus 2026-07-18):** zwei Instanzen derselben App (Kimboard auf
DeX + Handy) tauchen beide als „Kimboard" im Raum auf und sind nur an der Kennung
unterscheidbar. Der Gerätename löst das: „Kimboard · Klaus-Handy" vs
„Kimboard · Klaus-DeX".

---

## 🔒 SICHERHEITS-MODELL (Pflicht — Marktplatz/Fremd-App-tauglich)

Der Gerätename ist **selbst-behauptet und NICHT authentifiziert**. Jeder — auch ein
Fremder auf dem family-projekt.de-Marktplatz — kann sich **jeden** Namen geben.
Darum ist der Name **ein Hinweis, niemals ein Vertrauens-Beweis**. Drei feste Regeln
entschärfen Namens-Kollision/Spoofing; sie sind **verbindlich**, nicht optional:

1. **Name IMMER mit Kennung anzeigen** — nie der Name allein. Format:
   `Klaus N. · 6f902d9b…`. Zwei „Klaus N." bleiben so an der Kennung unterscheidbar.
2. **Eigene Kontakt-Namen gewinnen.** Ist ein Absender bereits als **Kontakt**
   gemerkt (TOFU + Sicherheitsnummer, Skill/Bau B7 `dm_crypto`), zeige **den vom
   Nutzer vergebenen Kontakt-Namen** — nicht den selbst-behaupteten `nick`. So kann
   ein Fremder mit fremdem Schlüssel keinen echten Kontakt vortäuschen.
3. **Selbst-gewählte Namen als solche markieren** (z. B. Tilde `~Klaus N.`, kursiv,
   oder Titel „selbst gewählt, nicht geprüft"). Die kryptografische Wahrheit bleibt
   **Kennung / Sicherheitsnummer**, nicht der Name.

**Folge:** Namens-Kollisionen sind **ungefährlich by design** — die Kennung
disambiguiert immer, echte Vertrauens-Entscheidungen laufen über Schlüssel/
Sicherheitsnummer, nie über den frei wählbaren Namen.

---

## Was NICHT angefasst wird

- **KEIN Spore-Re-Sign.** Der Name geht NICHT in `generateOwnSpore({nodeName})` —
  die signierte Identität behält ihren kanonischen App-Namen (z. B. „Kimboard").
  Nur die **Anzeige** (Anmelde-Karte im Raum + Brett-Zettel) bekommt den Zusatz.
- **KEIN Eingriff ins Kern-Modul 23** (`23_rendezvous.js` bleibt byte-1:1, Drift-Guard
  grün). Die Anzeige im Raum kommt aus der **Anmelde-Karte** (`cfg.nodeName`), die
  über die öffentliche Fläche `SbkimRendezvous.init/configure({nodeName})` gesetzt
  wird — reine App-Glue.
- **Kein PII-Zwang, kein Klarname nötig.** Freitext, der Nutzer wählt. Fail-soft
  (kein Name → alles läuft wie bisher, nur ohne Zusatz).
- **Kein Protokoll-/DB-/`PROVIDER_MIN_MATCH`-Bump.** Der `nick`-Tag ist ein
  additiver, ignorierbarer Nostr-Tag; alte Clients übersehen ihn einfach.

---

## Datenmodell

- **Speicher:** `localStorage`-Schlüssel **`sbkim_geraetename`** — **ein** Name pro
  Browser-Instanz/Gerät, **geteilt über alle Apps derselben Origin** (bewusst: der
  Nutzer benennt „dieses Gerät/mich" einmal, nicht je App neu). Freitext, auf ~40
  Zeichen gekürzt, fail-soft.
  - *Warum geteilt statt app-suffixed:* die Absicht ist „dieses Gerät heißt X", und
    zwei Instanzen (DeX vs. Handy) sind ohnehin getrennte localStorage-Töpfe → der
    Nutzer setzt dort verschiedene Namen. (Abweichung von der sonst app-suffixed
    Geteilte-Origin-Regel ist hier gewollt und dokumentiert.)
- **Netz-Karte/Raum:** Anzeige-Name = `CFG.nodeName + " · " + geraetename`
  (Basis-App-Name + Zusatz), an `SbkimRendezvous.init/configure` + `…UI.init`
  durchgereicht. Die Anmelde-Karte trägt ihn (`23_rendezvous.js` Zeile ~547 baut die
  Karte aus `cfg.nodeName`).
- **Brett-Zettel:** additiver Nostr-Tag **`['nick', geraetename]`** auf jedem
  gesendeten Event. Beim Rendern: Kontakt-Name (deiner) **>** `nick` (markiert) **>**
  nur Kennung — immer **mit** Kennung.
- **Kopplung:** ändert der Nutzer den Namen, feuert die App
  `window.dispatchEvent(new CustomEvent('sbkim:geraetename-changed'))`; der
  Rendezvous-Glue hört darauf und ruft `SbkimRendezvous.configure({nodeName})` neu.

---

## Einbau — die vier Stellen (überall gleich)

> **Verbindlich seit 2026-08-16: das Feld gehört ins Panel, nicht in die `index.html`**
> (netzweite Tafel `docs/INTERFACES.md` §11.7). Die frühere Fassung dieses Rezepts
> beschrieb den Weg über vier Stellen im App-Hauptskript. Der ist nicht falsch, aber
> unnötig: jede App mit Netz-Anschluss hat dasselbe Panel `#sbkim-rdv-panel`, und der
> Glue kann sein Feld dort selbst einhängen. **Kein `index.html`-Eingriff, kein
> `build.py`-Lauf, keine QC-Datei** — das war der Grund, warum der Einbau in elf Apps
> jahrelang halb blieb: der Glue las den Namen, aber niemand hatte das Feld gebaut.

### 1) Helfer + Feld ins Panel — im **app-eigenen Glue**

Gehört in `assets/rendezvous-init.js` / `modules/rendezvous-init.js` /
`sbkim/sbkim-init.js`. **NIEMALS** in `23_rendezvous_ui.js` oder
`sbkim-rendezvous-ui.js` — das sind byte-1:1-Kopien mit Drift-Guard.

```js
// Gerätename (frei wählbarer Anzeige-Name, lokal, kein PII): NUR an die Anzeige/
// Anmeldung hängen — NICHT an generateOwnSpore (kein Spore-Re-Sign).
function geraetename() { try { return (localStorage.getItem("sbkim_geraetename") || "").trim().slice(0, 40); } catch (_e) { return ""; } }
function displayNodeName(base) { var g = geraetename(); return g ? (base + " · " + g) : base; }

// Alle Namensfelder der Seite gleichziehen. Eine App darf mehrere haben (Panel +
// eigenes Feld in den Einstellungen); sie schreiben denselben Speicher und dürfen
// beim Tippen nicht auseinanderlaufen. Programmatisches Setzen von .value löst
// kein "input" aus — deshalb keine Schleife.
function syncGeraetenameFields() {
  try {
    var v = geraetename();
    var list = document.querySelectorAll("[data-sbkim-geraetename]");
    for (var i = 0; i < list.length; i++) { if (list[i].value !== v) list[i].value = v; }
  } catch (_e) {}
}

function injectGeraetenameField() {
  function tryInject() {
    var panel = document.getElementById("sbkim-rdv-panel");
    if (!panel) return false;
    // Erkennungs-Marke statt fester id, und bewusst NUR im Panel gesucht: ein
    // app-eigenes Feld an anderer Stelle bleibt erlaubt (es zieht per
    // syncGeraetenameFields mit), aber im Panel steht nie ein zweites.
    if (panel.querySelector("[data-sbkim-geraetename]")) return true;
    var wrap = document.createElement("div");
    wrap.style.cssText = "margin:8px 0;display:flex;gap:6px;align-items:center;flex-wrap:wrap";
    var lab = document.createElement("span"); lab.textContent = "🏷️ Gerätename:"; lab.style.cssText = "color:#9aa7b6;font-size:.85rem";
    var inp = document.createElement("input"); inp.id = "sbkim-geraetename"; inp.type = "text"; inp.maxLength = 40;
    inp.setAttribute("data-sbkim-geraetename", "1");
    inp.placeholder = "z. B. Klaus-Handy (frei wählbar)"; inp.value = geraetename();
    inp.style.cssText = "flex:1;min-width:120px;padding:4px 6px;border-radius:6px;border:1px solid #33414f;background:#0d1520;color:#dfeaf2;font:inherit";
    inp.title = "Nur ein Anzeige-Hinweis, kein Vertrauens-Beweis — die Kennung bleibt daneben.";
    inp.addEventListener("input", function () {
      try { localStorage.setItem("sbkim_geraetename", String(inp.value || "").trim().slice(0, 40)); } catch (_e) {}
      try { window.dispatchEvent(new CustomEvent("sbkim:geraetename-changed")); } catch (_e) {}
    });
    wrap.appendChild(lab); wrap.appendChild(inp);
    panel.insertBefore(wrap, panel.children[1] || null);
    return true;
  }
  if (tryInject()) return;
  // Das Panel entsteht erst beim Öffnen — darum der Beobachter als Rückfall.
  try { var mo = new MutationObserver(function () { if (tryInject()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); } catch (_e) {}
}
```

**Hat die App schon ein eigenes Feld** (Kimboard in den Einstellungen, Private Brain im
Pinnwand-Fenster), bekommt es nur `data-sbkim-geraetename="1"` dazu — dann zieht es beim
Abgleich mit, und das Panel-Feld entsteht trotzdem. **Baut ein Helfer mehrere Felder**
(Mein-Rezeptbuch: Buch-Name *und* Gerätename aus derselben Funktion), wird die Marke
**bedingt** gesetzt — sonst überschreibt der Abgleich den Buch-Namen:

```js
if (speichern === "sbkim_geraetename") inp.setAttribute("data-sbkim-geraetename", "1");
```

### 2) `nick`-Tag beim Senden (in `buildEvent`, direkt bei den Tags)

```js
const tags = [['t', TAG], ...extraTags];
const _nick = getGeraetename();
if (_nick) tags.push(['nick', _nick]);   // additiv, ignorierbar, kein PII-Zwang
```

### 3) Absender-Anzeige beim Rendern (Kontakt > nick > Kennung — IMMER mit Kennung)

Ersetzt das nackte `who.textContent = short(ev.pubkey)`:

```js
who.className = 'who mono';
who.textContent = authorLabel(ev);      // s. u.
```

```js
// SICHERHEIT: eigener Kontakt-Name gewinnt (TOFU/B7); sonst selbst-behaupteter
// nick, klar markiert (~); immer mit Kennung; Fremd-Name ist nie Vertrauen.
function authorLabel(ev) {
  const kennung = short(ev.pubkey);
  // 1) eigener, vertrauter Kontakt-Name (aus B7 dmContacts) gewinnt
  try {
    if (typeof dmContacts === 'object' && dmContacts[ev.pubkey] && dmContacts[ev.pubkey].name) {
      return dmContacts[ev.pubkey].name + ' · ' + kennung;
    }
  } catch (_e) {}
  // 2) selbst-behaupteter nick — als „nicht geprüft" markiert (Tilde)
  const nk = (ev.tags || []).find((t) => t[0] === 'nick');
  if (nk && nk[1]) return '~' + String(nk[1]).slice(0, 40) + ' · ' + kennung;
  // 3) nur die Kennung
  return kennung;
}
```

(`textContent` escapt selbst — kein XSS über einen bösartigen `nick`.)

### 4) Rendezvous-Glue (`rendezvous-init.js` o. Ä.) — Anzeige-Name + Kopplung

```js
function geraetename() { try { return (localStorage.getItem('sbkim_geraetename') || '').trim().slice(0, 40); } catch { return ''; } }
function displayNodeName() { var g = geraetename(); return g ? (CFG.nodeName + ' · ' + g) : CFG.nodeName; }
```

`displayNodeName()` **nur** an die Anzeige/Anmeldung geben — NICHT an
`generateOwnSpore`:

```js
window.SbkimRendezvous.init({ nodeName: displayNodeName(), /* … */ });
window.SbkimRendezvousUI.init({ nodeName: displayNodeName(), /* … */ });
```

Kopplung — beim Namenswechsel **erst die Felder abgleichen**, dann neu konfigurieren
(fail-soft). Ohne den Abgleich stehen zwei Felder derselben App auseinander:

```js
injectGeraetenameField();
try {
  window.addEventListener('sbkim:geraetename-changed', function () {
    syncGeraetenameFields();
    try { if (window.SbkimRendezvous && window.SbkimRendezvous.configure) window.SbkimRendezvous.configure({ nodeName: displayNodeName() }); } catch (_e) {}
  });
} catch (_e) {}
```

### 5) Cache-Bust

Service-Worker-`CACHE_VERSION` erhöhen (App-Schale geändert).

---

## Verifikation

- **Headless:** `node --check` auf die Glue-Datei, plus eine Probe, die die Marke
  `data-sbkim-geraetename` und den Abgleich im Glue nachweist. Der Drift-Guard der
  Panel-Kopie muss **unverändert grün** bleiben — ist er rot, wurde in die Kopie
  geschrieben statt in den Glue.
- **Die Prüfung braucht eine Gegenprobe.** Ein `grep`, der nur bestätigt, ist der Ort,
  an dem man sich am leichtesten selbst recht gibt: die Marke aus einer Wegwerf-Kopie
  entfernen und nachsehen, ob die Probe wirklich umfällt.
- **Der Bestandsaufnahme nicht trauen, ohne zu fetchen** (Befund 2026-08-16): eine
  Übersicht „wer hat es schon" auf ungefetchten Klonen meldete drei Apps falsch — zwei
  hatten es längst, eine parallele Sitzung hatte am selben Tag nachgezogen. Immer gegen
  `origin/main` prüfen (`git grep … origin/main`), nie gegen das Arbeitsverzeichnis.
- **Browser (Klaus):** auf zwei Instanzen verschiedene Namen setzen → im Raum
  „App · Name1" vs „App · Name2"; wo es zwei Felder gibt, beim Tippen zusehen, ob das
  zweite mitzieht; auf dem Brett „~Name · Kennung" (fremd) bzw. „DeinKontaktName ·
  Kennung" (gemerkt). Nicht ersetzbar.

---

## Rollout-Reihenfolge (netzweit)

1. **Erst EINE App** voll bauen (Referenz) + Klaus' Browser-Test.
2. **Dann** in die übrigen Netz-Apps. Jede hat genau **eine** app-eigene Glue-Datei —
   dort hinein, nie in die byte-kopierte Panel-Datei. Der **Brett-Teil** (`nick`-Tag +
   `authorLabel`, Abschnitte 2 und 3) gilt nur für Apps mit dem Frage-Antwort-Brett
   (Kimboard, Pinnwand); reine Karten-Apps bekommen nur Teil 1 + 4.
3. Nie eine ungetestete Optik in 20 Repos propagieren — erst validieren, dann fächern.
4. **Hat eine App eine eigene Fassung** (anderer Funktionsname, zwei Felder, Feld in der
   eigenen Seite statt im Panel), wird sie **von Hand** angepasst statt schematisch
   überschrieben. Vier der zwanzig waren 2026-08-16 solche Fälle — ein Skript, das sie
   überfährt, macht aus einer Verbesserung einen Fehler.
