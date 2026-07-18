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

### 1) Kleine Helfer + Namensfeld (App-Hauptskript, z. B. `index.html`)

```js
// Gerätename (lokal, kein PII): frei wählbarer Anzeige-Name, reist als Hinweis mit.
// SICHERHEIT: nur Anzeige, nie Vertrauen — immer zusammen mit der Kennung zeigen.
const LS_GERAETENAME = 'sbkim_geraetename';
function getGeraetename() { try { return (localStorage.getItem(LS_GERAETENAME) || '').trim().slice(0, 40); } catch { return ''; } }
function setGeraetename(v) { try { localStorage.setItem(LS_GERAETENAME, String(v || '').trim().slice(0, 40)); } catch { /* */ } }
```

Ein Textfeld nahe der Identitäts-/Spore-Anzeige, das beim Tippen speichert + das
Kopplungs-Event feuert:

```js
const gnEl = document.getElementById('geraetename');
if (gnEl) {
  gnEl.value = getGeraetename();
  gnEl.addEventListener('input', () => {
    setGeraetename(gnEl.value);
    try { window.dispatchEvent(new CustomEvent('sbkim:geraetename-changed')); } catch (_e) {}
  });
}
```

HTML (Beispiel-Pille, Platzhalter macht die Freiwilligkeit klar):

```html
<span class="pill">🏷️ Gerätename:
  <input id="geraetename" type="text" maxlength="40" placeholder="z. B. Klaus-Handy (frei wählbar)"
         style="border:none;background:transparent;color:inherit;font:inherit;min-width:120px;">
</span>
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

Kopplung — beim Namenswechsel neu konfigurieren (fail-soft):

```js
try {
  window.addEventListener('sbkim:geraetename-changed', function () {
    try { if (window.SbkimRendezvous && window.SbkimRendezvous.configure) window.SbkimRendezvous.configure({ nodeName: displayNodeName() }); } catch (_e) {}
  });
} catch (_e) {}
```

### 5) Cache-Bust

Service-Worker-`CACHE_VERSION` erhöhen (App-Schale geändert).

---

## Verifikation

- **Headless:** ein kleiner Smoke/`node --test`, der prüft: Namensfeld + `nick`-Tag +
  `authorLabel` + `displayNodeName` sind verdrahtet (grep im `index.html`), plus
  `node --check` auf den Skript-Block. Kern-Modul 23 Drift-Guard bleibt grün
  (unangetastet).
- **Browser (Klaus):** auf zwei Instanzen verschiedene Namen setzen → im Raum
  „App · Name1" vs „App · Name2"; auf dem Brett „~Name · Kennung" (fremd) bzw.
  „DeinKontaktName · Kennung" (gemerkt). Nicht ersetzbar.

---

## Rollout-Reihenfolge (netzweit)

1. **Erst EINE App** voll bauen (Referenz, z. B. Kimboard) + Klaus' Browser-Test.
2. **Dann** byte-ähnlich in die übrigen Netz-Apps (jede hat einen `rendezvous-init`-
   Glue mit `CFG.nodeName` → Teil 4). Der **Brett-Teil** (2+3) gilt nur für Apps mit
   dem Frage-Antwort-Brett (Kimboard, Pinnwand); reine Karten-Apps bekommen nur
   Teil 1 + 4.
3. Nie eine ungetestete Optik in 20 Repos propagieren — erst validieren, dann fächern.
