# PULS-Auslagerung 2026-11-15 — ein Eintrag vom 2026-10-13

**Ausgelagert am 2026-11-15**, weil `docs/PULS.md` mit dem Eintrag „Lebendige Bilder“ über der 3000-Zeilen-Grenze
gestanden hätte (2995 vorher). Die Schutz-Klausel im Kopf von PULS.md verlangt **auslagern statt kürzen**: hier steht der
Eintrag **wortwörtlich**.

---

## 2026-10-13 · Eigenes Netz Schritt 2+3 · Einstellung „Netz“ in 23-UI, internes Relais, erster Träger Sende-Prüfer

**Brief:** [`docs/BRIEF_2026-10-13_eigenes-netz-schritt2.md`](BRIEF_2026-10-13_eigenes-netz-schritt2.md).

**Gebaut:**
- **23-UI (#1075):** Box „Netz“ in der Mycel-Blase (`<details data-sbkim-netz-box>`, Knopf `data-sbkim-netz` = oeffentlich · eigen · ungueltig).
  - Ein Netz anlegen oder per Code beitreten.
  - **Beitritts-Link** `#sbkim-netz=` + base64url({v:1,n,r,c}): Die App fragt vor der Übernahme und nennt dabei Name und Relais; danach wird die Adresse geputzt. Daneben der Weg von Hand.
  - „Zurück zum öffentlichen Netz“ löscht die Einstellung.
  - Im eigenen Netz wird beim Öffnen automatisch verbunden.
  - Eine kaputte Einstellung verbindet nicht und fällt nicht still zurück.
  - INTERFACES ist zuerst geschrieben. Die Bündel sind nachgezogen; `smoke_vollbundle` prüft jetzt den Inhalt statt eines sha.
- **Internes Relais (family-project #355):** `server/relais-intern/` mit `einrichten.sh`, `config.toml`, Caddy-Block und `EINRICHTEN.md`.
  - Zweiter Container `relay-intern` neben `relay`; die Software ist abgelesen.
  - Flut-Grenzen gesetzt, **keine pubkey_whitelist** (Klaus: „jederzeit ein neues Tool hinzufügen“).
  - Caddy wird nur nach `validate` neu geladen; das Werkzeug ist wiederholbar.
- **Sende-Prüfer (#76):** 05b, 23 und 23-UI byte-1:1 per `kanon-verteilen` (die Nachbarn eingeengt auf einen Verweis), Pins nachgezogen, Cache v66.

**Gemessen:**
- `smoke_netz_ui` 44 grün; `gegenprobe_netz_ui` 9 gefangen · 0 blind · 0 tot.
- `smoke_relais_intern` 21 grün; `gegenprobe_relais_intern` 9 gefangen · 0 blind · 0 tot.
- Sende-Prüfer: `npm test` 675 grün. Im Browser steht die Netz-Box da, und beim Laden geht kein ws hinaus.

⚠ **Nicht gemessen:**
- das interne Relais am echten Server (Klaus: INWX-DNS, dann `einrichten.sh` auf dem Hetzner Cloud-Server)
- der Beitritt per Link am Tablet

⚠ **Offen:**
- 16 weitere Träger hängen bei Modul 23 nach, Modul 23-UI sogar in **zwei** älteren Fassungen (Jasons- und Mein-Tresor eigen). Das ist ein Generationssprung; die Proben laufen je im Ziel-Repo.
- Workflow PDF, Workflow-Needs und Workflow-Calculate sind noch nicht angedockt.
- Der Knopf in der Mycel-Karte fehlt noch.

**Nächster Schritt:** Klaus richtet das Relais ein und macht den Sichttest im Sende-Prüfer. Danach Schritt 4 (Träger nachziehen) und Schritt 5 (Mycel-Karte).
