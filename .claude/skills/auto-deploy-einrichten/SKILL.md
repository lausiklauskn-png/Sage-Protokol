---
name: auto-deploy-einrichten
description: Richtet für eine von Klaus' Web-Apps/Seiten den automatischen Deploy ein — Änderungen auf `main` gehen ohne Sitzung von allein live. Anwenden, wenn eine Seite „automatisch deployen / hochladen / live schalten" bekommen soll, wenn Klaus sagt „richte Auto-Deploy für <App> ein" (z.B. Alis-Moderaum, Perfect-Skin-Fashion, Perfect-Skin-Beauty, family-project), oder wenn eine Live-Seite veraltet ist, obwohl `main` neuer ist. Deckt BEIDE Welten ab: GitHub Pages (deployt schon selbst — fast nichts zu tun) UND eigener Server (Hetzner + Caddy, 2-Minuten-Cron `git reset --hard origin/main`). Server-agnostisch (Domain/Verzeichnis/Auslieferung als Parameter). WICHTIG: Die Repo-Seite macht die Sitzung voll automatisch; der EINMALIGE Server-Schritt (Cron/Clone/Caddy) ist ein kopierfertiger Ein-Zeilen-Befehl, den KLAUS in der Server-Konsole einfügt — eine Sitzung hat keinen Server-Zugang.
---

# Auto-Deploy einrichten (Änderung auf `main` → von allein live)

Das feste Rezept, damit eine Seite **ohne Sitzung** aktuell wird: was einmal auf
`main` liegt, schaltet sich **von allein** live. Bewiesen an `family-projekt.de`
(2026-07-26, Klaus' Live-Test: WorkFloh-Änderung kam von allein auf der Seite an).

## Der eine Satz, den man nie vergessen darf

Es gibt **zwei Schritte**, und dieser Skill trennt sie sauber:

1. **Die Änderung auf `main` bringen** (das *Machen*) — Sitzung oder Klaus selbst
   (kleine Edits direkt in der GitHub-Web-UI).
2. **Die Änderung live schalten** (das *Hochladen*) — **das** richtet dieser Skill
   ein, sodass es danach **von allein** läuft.

**Auto-Deploy erledigt nur Schritt 2.** Er *erzeugt* keine Änderung, er *trägt* nur,
was schon auf `main` ist, auf die Live-Seite.

## Ehrliche Grenze (unbedingt so an Klaus sagen)

- **Repo-Seite = voll automatisch.** Die Sitzung legt alle Deploy-Dateien selbst an
  und mergt sie (Freibrief).
- **Server-Seite = einmalig, von Klaus.** Der Cron-Einbau / `git clone` / Caddy-Block
  läuft **auf dem Server** — **eine Claude-Sitzung hat keinen Server-Zugang** (kein
  SSH). Die Sitzung erzeugt den **exakten, kopierfertigen Befehl**; **Klaus fügt ihn
  einmal in die Server-Konsole ein.** Danach läuft es für immer von allein.
  - Bei **GitHub Pages** entfällt der Server-Schritt komplett.

---

## Schritt 0 — Welche Welt? (erst bestimmen, dann handeln)

Vor allem klären, **wie die Seite ausgeliefert wird** — das entscheidet alles:

| Frage | Welt A — GitHub Pages | Welt B — eigener Server |
|---|---|---|
| Adresse | `…github.io/<repo>/` | eigene Domain (`alis-moderaum.de` o.ä.) |
| Erkennungs-Zeichen | keine `deploy/`, kein `Caddyfile.example` | `deploy/`, `Caddyfile.example`, `server/` |
| Deploy-Weg | Pages baut bei Merge auf `main` selbst | `git pull`/`reset` auf dem Server |
| Server-Schritt nötig? | **Nein** | **Ja, einmalig (Klaus)** |

**Wenn unklar, welche Domain/welcher Server:** Klaus fragen (`AskUserQuestion`) —
„Läuft <App> auf GitHub Pages (…github.io) oder auf einem eigenen Server mit eigener
Domain?" Nicht raten.

---

## Welt A — GitHub Pages (fast nichts zu tun)

Pages deployt **automatisch bei jedem Merge auf `main`**. Zu prüfen/sicherzustellen:

1. **Default-Branch = Deploy-Quelle.** Bei manchen Repos ist der GitHub-Default ein
   alter Decoy (siehe Rezeptbuch-Regel) — Pages muss auf **`main`** zeigen:
   GitHub → **Settings → Pages → Source: „Deploy from a branch" → Branch `main` /
   `/ (root)` → Save**. (Das ist ein GitHub-UI-Schritt für Klaus, kein Server.)
2. **`.nojekyll`** im Repo-Wurzel (leere Datei) — sonst filtert Jekyll Dateien
   (z.B. `_`-Ordner) weg. Fehlt sie → die Sitzung legt sie an.
3. **Relative Pfade** (`./…`, nicht `/…`), damit die App auch unter dem
   `/<repo>/`-Unterpfad läuft.
4. **Cache-Bust:** hat die App einen Service-Worker, dessen `CACHE`-Version bei
   Shell-Änderungen erhöhen; Klaus macht **Hard-Reload** (Strg+Shift+R) nach dem Merge.

**Ergebnis:** Merge auf `main` → Pages aktualisiert sich in ~1 Min von selbst. **Kein
Cron, kein Server.**

---

## Welt B — eigener Server (Hetzner + Caddy, das family-project-Muster)

Die Live-Seite ist ein `git clone` in einem Verzeichnis, das ein **statischer
Webserver** (Caddy) ausliefert; ein **Cron** zieht `main` alle 2 Minuten nach.

### B1 — Repo-Seite (Sitzung, voll automatisch)

In das Repo legen (aus den Vorlagen unten, an App angepasst):

- `deploy/auto-pull.sh` — der wartbare Selbst-Updater (Vorlage unten).
- `deploy/AUTO_DEPLOY.md` — die Ein-Zeilen-Einrichtung + Prüf-/Entfern-Befehle.
- `Caddyfile.example` — der Site-Block für diese Domain.
- `docs/DEPLOY.md` — der volle Weg (Verzeichnis, Caddy, Prüfen).
- ggf. `.nojekyll` (schadet nie).

**Parameter je App** (server-agnostisch — nichts fest verdrahten, aus diesen ableiten):

- `APP` = Repo-/App-Name (z.B. `alis-moderaum`).
- `DOMAIN` = Live-Domain (z.B. `alis-moderaum.de`, + `www.`).
- `DIR` = Server-Zielverzeichnis (Konvention: `/srv/<APP>`).
- `BRANCH` = Deploy-Branch (i.d.R. `main`).
- `INTERVAL` = Cron-Takt (Default alle 2 Min: `*/2 * * * *`).

### B2 — Server-Seite (EINMALIG, Klaus in der Server-Konsole)

Die Sitzung **erzeugt** diese Befehle mit den echten Werten und gibt sie Klaus als
kopierfertige Blöcke im Chat (Einzelschritte, nicht als ein Wust):

**(a) Verzeichnis + Klon (einmalig):**
```sh
sudo mkdir -p /srv/<APP> && sudo chown "$USER":"$USER" /srv/<APP>
git clone https://github.com/lausiklauskn-png/<APP>.git /srv/<APP>
cd /srv/<APP> && git checkout <BRANCH>
```

**(b) Sofort ziehen + 2-Minuten-Cron einrichten (eine Zeile, doppelte vermeiden):**
```sh
cd /srv/<APP> && git fetch origin <BRANCH> && git reset --hard origin/<BRANCH> && \
( crontab -l 2>/dev/null | grep -v '<APP> auto-deploy' ; \
  echo '*/2 * * * * cd /srv/<APP> && git fetch origin <BRANCH> && git reset --hard origin/<BRANCH> >> /tmp/<APP>-deploy.log 2>&1 # <APP> auto-deploy' ) | crontab -
```

**(c) Caddy-Site-Block** (aus `Caddyfile.example`) ins Caddyfile + `caddy reload`.

**Prüfen:** `crontab -l | grep <APP>` zeigt die Zeile · `cat /tmp/<APP>-deploy.log`
zeigt den Verlauf · `curl -I https://<DOMAIN>` gibt `200`.

**Ist der Cron schon da (Seite veraltet trotz neuem `main`)?** Zuerst
`crontab -l | grep <APP>` prüfen lassen — evtl. läuft er gar nicht und muss nur
(neu) eingerichtet werden. Das ist oft die ganze „Reparatur".

---

## Vorlage — `deploy/auto-pull.sh`

```sh
#!/usr/bin/env sh
# <APP> — Auto-Deploy (server-seitiger Selbst-Updater).
# Holt den aktuellen <BRANCH>-Stand und schaltet ihn live. Statischer Webserver
# liefert aus (kein Reload nötig). Bewusst `fetch + reset --hard`: das Verzeichnis
# ist reines Deploy-Ziel ohne lokale Änderungen — ein Pull kann nie an einem
# schmutzigen Arbeitsbaum scheitern. Einsatz: einmalig per Cron (siehe AUTO_DEPLOY.md).
set -eu
DIR="${APP_DIR:-/srv/<APP>}"
LOG="${APP_DEPLOY_LOG:-/tmp/<APP>-deploy.log}"
cd "$DIR"
before="$(git rev-parse HEAD 2>/dev/null || echo none)"
git fetch origin <BRANCH> --quiet
git reset --hard origin/<BRANCH> --quiet
after="$(git rev-parse HEAD)"
[ "$before" != "$after" ] && echo "$(date '+%Y-%m-%d %H:%M:%S') deploy ${before} -> ${after}" >> "$LOG"
```

## Vorlage — `Caddyfile.example` (Site-Block)

```caddy
<DOMAIN>, www.<DOMAIN> {
    root * /srv/<APP>
    encode zstd gzip
    file_server
    try_files {path} {path}/ /index.html
    @js path *.js
    header @js Content-Type "text/javascript; charset=utf-8"
}
```

---

## Wichtige Leitplanken (immer)

- **`git reset --hard origin/<BRANCH>`** verwirft bewusst lokale Änderungen im
  Deploy-Verzeichnis — dort wird **nie** von Hand editiert; alles läuft über `main`.
- **Kein Reload nach Pull nötig** (statischer Server); nur Browser-Cache/Service-Worker
  ist hartnäckig → **Hard-Reload**.
- **Kein Secret/PII** in Repo-Dateien. (Ein *Schreib*-Weg vom Browser ins Repo — falls
  je gewünscht — braucht einen GitHub-Token, der **nur** server-seitig liegen darf,
  hinter Auth; das ist ein **anderer** Skill/Auftrag, nicht dieser hier.)
- **Marktplatz-Brille:** app-agnostisch, ohne Hardcodes — das Muster ist Vorlage für
  jede weitere Seite und jeden weiteren Server.

## Abschluss (Sitzung)

1. Deploy-Dateien committen + mergen (Freibrief; reine Infrastruktur, kein App-Code).
2. **Die kopierfertigen Server-Befehle als Chat-Blöcke** ausgeben (Welt B) bzw. den
   Pages-Settings-Schritt (Welt A) — Einzelschritte, klarer Erfolgs-Indikator je Block.
3. In `docs/DEPLOY.md`/`PULS.md` vermerken, dass Auto-Deploy eingerichtet ist.
4. **Sichttest bleibt Klaus:** nach dem Server-Schritt eine kleine Test-Änderung auf
   `main` → nach ≤2 Min auf der Live-Seite (nach Hard-Reload) sichtbar? Das ist der
   Beweis, dass es von allein läuft.
