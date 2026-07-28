---
name: auslieferung-pruefen-und-sperren
description: Prüft, was eine Live-Seite WIRKLICH ins Netz gibt, und sperrt versehentlich mitgelieferte Server-Dateien. Anwenden, wenn eine Seite auf einem eigenen Server (Hetzner + Caddy) oder GitHub Pages liegt und Klaus fragt „liegt da etwas offen / kann jemand meinen Schlüssel sehen / prüf mal die Internetseite", nach jedem Fork/Fremdzugriff-Schreck, vor einer öffentlichen App-Freigabe, und IMMER wenn ein Repo serverseitige Dateien mitliefert (`server/`, `*.php`, `.env`, Konfig-Vorlagen). Kern-Falle: ein statisch ausliefernder Server (Caddy/nginx/Pages) führt KEIN PHP aus und gibt jede Datei als KLARTEXT heraus; `.htaccess` wirkt NUR bei Apache und schützt dort gar nichts. Deckt beides ab: den netzweiten Geheimnis-Scan über alle Repos UND die konkrete Caddy-Sperre inklusive Beweis (Gegenprobe, dass sie nötig war).
---

# Auslieferung prüfen und sperren

Das feste Rezept für die Frage **„Was gibt meine Seite in Wahrheit heraus?"** — und wie
man das Zuviel dichtmacht, **ohne** die Seite kaputtzumachen.

> Entstanden am 2026-07-28 an `family-projekt.de`: Der PHP-Quelltext des `server/`-
> Ordners war öffentlich lesbar, weil Caddy kein PHP ausführt und `/srv/family-project`
> ein `git clone` des Repos ist. Die vorhandene `.htaccess` schützte dort **nichts**.

---

## Die vier Wahrheiten, die man vorher wissen muss

1. **Ein statischer Server liefert ALLES aus, was im Verzeichnis liegt** — auch `.php`,
   `.env.example`, `.md`, Backup-Dateien. Er führt nichts aus, er reicht Bytes durch.
   Wird das Verzeichnis per `git clone` befüllt, ist **der gesamte Repo-Inhalt** im Netz.
2. **`.htaccess` wirkt ausschließlich bei Apache.** Caddy, nginx und GitHub Pages
   ignorieren sie kommentarlos. Eine `.htaccess` im Repo ist **kein** Beleg für Schutz.
3. **Ein Auffang (`try_files … /index.html`) ist kein Schutz.** Er greift nur, solange
   die Datei **nicht existiert**. Liegt sie da, wird sie ausgeliefert. Wer „da kommt ja
   die Startseite" als Sicherheit liest, irrt — das ist Zufall.
4. **Geheimnisse brauchen beides:** `.gitignore` (kommt nie ins Repo) **und** eine
   ausdrückliche Server-Sperre (falls sie doch einmal dort landet). Gürtel und Hosenträger.

---

## Schritt 1 — Netzweiter Geheimnis-Scan (Repo-Seite)

Über **getrackte** Dateien scannen, denn nur die werden veröffentlicht. `data:image`
ausschließen und überlange Zeilen filtern — sonst erzeugen eingebettete Base64-Bilder in
Single-File-PWAs eine Lawine von Fehlalarmen (real passiert: 3,6 MB Ausgabe).

```bash
for d in /home/user/*/ ; do [ -d "$d/.git" ] || continue
  git -C "$d" rev-parse HEAD >/dev/null 2>&1 || continue
  hits=$(git -C "$d" grep -nIiE -- '-----BEGIN [A-Z ]*PRIVATE KEY|sk-ant-api[A-Za-z0-9_-]{10}|\bghp_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{40}|\bAKIA[0-9A-Z]{16}\b|node_key\.plain' \
        $(git -C "$d" rev-parse HEAD) 2>/dev/null \
      | grep -v 'data:image' | awk 'length($0) < 400' | head -3)
  [ -n "$hits" ] && { echo "!!! $(basename $d)"; echo "$hits" | cut -c1-200; }
done
```

Zusätzlich prüfen: hartcodierte Zuweisungen (`api_key|token|secret|passwort` gefolgt von
20+ Zeichen, Platzhalter wie `XXXX|YOUR|DEIN|EXAMPLE` herausfiltern), getrackte
`.env`/`*.pem`/`*.key`, und private JWK-Schlüssel (`"d"` neben `"crv":"Ed25519"`).

**Erwartete Fehlalarme** — jeweils **einzeln nachsehen**, nicht blind melden:
- die `.gitignore`-Zeile, die das Geheimnis *ausschließt*
- Code, der einen PEM-String **baut** (`"-----BEGIN PRIVATE KEY-----\n"+…`)
- `*.example`-Vorlagen mit Platzhaltern
- Testdateien mit `secret` im **Namen**

**SBKIM-Sporen sind unbedenklich:** sie tragen nur den öffentlichen Teil (`x`), kein
`d`. Öffentliche Schlüssel *sollen* offen liegen — damit prüft man Signaturen, man
fälscht sie nicht.

---

## Schritt 2 — Herausfinden, wie die Seite ausgeliefert wird

**Nie raten.** Drei getrennte Orte, die sich leicht verwechseln lassen:

| Ort | Prompt | Paketbefehl | Rolle |
|---|---|---|---|
| Tablet / Termux | `~ $` | `pkg` | **kein** Server |
| Hetzner Cloud-Server | `root@ubuntu-…:~#` | `apt` | statische Auslieferung (Caddy im Docker) |
| Hetzner Webhosting | (konsoleH/WebFTP) | — | Apache **mit PHP**, hier wirkt `.htaccess` |

```bash
ssh root@<IP> "ls -l /etc/caddy/Caddyfile; docker ps --format '{{.Names}}'"
# Caddy im Docker? -> Mount-Quelle der Caddyfile finden:
ssh root@<IP> "docker inspect caddy --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{\"\n\"}}{{end}}'"
```

> **Befehle an Klaus immer als `ssh root@<IP> '<befehl>'` geben.** Dann kann der Befehl
> gar nicht versehentlich auf dem Tablet landen — die häufigste Fehlerquelle.

---

## Schritt 3 — Sperre bauen (Caddy) und lokal beweisen

`handle`-Blöcke greifen **in der Reihenfolge, in der sie stehen**, und schließen sich
gegenseitig aus. Deshalb: Sperre **vor** den Auffangblock, und das bisherige
`try_files`/`file_server` **in** den Auffangblock verschieben.

```caddy
	# /server/ sperren — NICHT entfernen
	handle /server/* {
		respond 404
	}

	# Alles Übrige wie bisher
	handle {
		try_files {path} {path}/ /index.html
		file_server
	}
```

**Vor dem Anfassen des Servers lokal beweisen** — Caddy-Binary holen, Testverzeichnis
mit einer Datei anlegen, die einen *Fake*-Token enthält, und **beide** Fassungen messen:

```bash
curl -sSL -o caddy.tgz https://github.com/caddyserver/caddy/releases/download/v2.8.4/caddy_2.8.4_linux_amd64.tar.gz && tar xzf caddy.tgz caddy
./caddy validate --config <datei> --adapter caddyfile     # muss "Valid configuration" sagen
./caddy start --config <datei> --adapter caddyfile
curl -s -o /tmp/b -w '%{http_code}\n' http://localhost:9999/server/freigabe-config.php
grep -c 'FAKE_TOKEN' /tmp/b     # neu: 0 · alt: 1
```

**Die Gegenprobe mit der alten Fassung ist Pflicht.** Sie belegt, dass die Sperre nötig
war — ohne sie ist die Änderung nur eine Behauptung.

---

## Schritt 4 — Live scharfschalten (mit Rückweg)

```bash
cp -a <Caddyfile> <Caddyfile>.bak-$(date +%F)        # 1. Sicherungskopie ZUERST
python3 …                                             # 2. Ersetzen mit assert count==1
docker exec -w /etc/caddy caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec -w /etc/caddy caddy caddy reload          # 3. erst wenn "Valid configuration"
```

Ersetzen **immer** mit einer Zusicherung, dass das Muster **genau einmal** vorkommt —
sonst zerlegt ein Skript den fremden Teil der Datei (z. B. den Relay-Block):

```python
n = s.count(old); assert n == 1, "ABBRUCH: %dx gefunden" % n
```

**Beweis danach — beide Hälften, sonst ist es kein Beweis:**

```bash
for p in / /assets/app.js /server/freigabe-config.php /server/freigabe.php; do
  printf '%s  %s\n' "$(curl -s -o /dev/null -w '%{http_code}' https://<domain>$p)" "$p"
done
# 200 bei / und /assets  -> Seite lebt
# 404 bei allen /server/ -> Sperre greift
```

Rückweg, falls etwas klemmt:

```bash
cp -a <Caddyfile>.bak-<datum> <Caddyfile> && docker exec -w /etc/caddy caddy caddy reload
```

---

## Schritt 5 — Repo nachziehen (sonst kommt es zurück)

Die Sperre gehört **auch** in `Caddyfile.example` und in den Kern-Block der Deploy-Doku
— sonst kopiert die nächste Sitzung (oder ein Forker) wieder die ungeschützte Fassung.
Dazu einen Abschnitt „Warum die Sperre nötig ist" mit den Prüf-Befehlen.

---

## Was NICHT der Weg ist

- **Obfuskation.** Web-Code ist im Browser immer lesbar; Verschleierung ist ein Schloss
  aus Pappe und widerspricht bei SBKIM der Absicht (Protokoll + Werkzeuge **sollen**
  nachgebaut werden können). Schutz = **Copyright + Git-Historie**, nicht Verstecken.
- **Repos privat stellen**, nur weil jemand geforkt hat. Ein Fork ist eine bewusste,
  harmlose Handlung an schon-Öffentlichem — kein Vorfall (siehe CLAUDE.md § Fork ≠ Vorfall).
- **Panik bei einem Fund melden.** Erst prüfen, wo das Geheimnis *wirklich* liegt: oft
  steht die echte Konfig auf einer ganz anderen Maschine und war nie exponiert. Die
  ehrliche Einordnung („Quelltext-Einsicht, kein Token-Leck → Härtung, kein Notfall")
  ist Teil des Ergebnisses.

## Fremdnutzer-/Marktplatz-Brille

Für den family-projekt.de-Marktplatz gilt dasselbe für **fremde** Apps: wer sein Repo
dort anbietet, liefert damit potenziell seinen ganzen Repo-Inhalt aus. Die Sperre und
die `.gitignore`-Regel gehören deshalb in jede Vorlage — und in die Anleitung der
Hinweis, dass eine `.htaccess` je nach Server **wirkungslos** ist.
