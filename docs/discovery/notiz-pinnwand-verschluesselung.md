<!-- NOTIZ / ERKUNDUNG (Brainstorm-Sitzung 2026-06-25): KEIN Bau, kein Krypto-Code.
     Modelle ordnen, Trade-offs ehrlich, Empfehlung + offene Fragen für Klaus.
     Bewusst NICHT in die Sage-Page eingebaut, NICHT verlinkt — nur Notiz/Parkplatz.
     Nicht ohne Klaus' Wort verlinken/veröffentlichen. Krypto ist sicherheits-
     sensibel: erst Klaus' Richtungsentscheid, DANN ggf. Bau-Brief. -->

# Erkundung — Verschlüsselung & Privatheit der Pinnwand

> Auslöser: Klaus' Befund (2026-06-25). Die heute gebaute Verschlüsselung
> (gemeinsames Passwort, `pinnwand/index.html` § „Privates Brett") hat das
> **Verteilungs-Problem**: man muss das Passwort out-of-band schicken
> (WhatsApp o.ä.) — genau **da** sitzt die Schwachstelle. WhatsApp/Signal lösen
> das mit **Public-Key-Krypto**: jeder hat ein eigenes Schlüsselpaar, man tauscht
> nur **öffentliche** Schlüssel (kein Geheimnis), das gemeinsame Geheimnis
> entsteht per ECDH automatisch. **Kein Passwort verschicken.**
>
> Diese Notiz ordnet die Modelle, benennt das harte Problem ehrlich (Schlüssel-
> austausch/MITM) und legt eine Empfehlung + offene Fragen vor. Anschluss an den
> bestehenden Entwurf `docs/E2E-VERTRAULICHKEIT.md` (PR #302, Mycel-Spore-Schicht)
> — siehe § 6.

---

## 0. Das Schöne zuerst: wir haben das Schlüsselpaar schon

Jede Pinnwand-Notiz ist ein **NIP-01-Nostr-Event**, signiert mit einem
**secp256k1/Schnorr-Schlüsselpaar** (BIP340). Der **Kurz-Name auf dem Zettel
IST der öffentliche Schlüssel** (`short(ev.pubkey)`). Das heißt:

- **Die „Adresse" existiert bereits** — jeder Teilnehmer ist über seinen
  sichtbaren Pubkey ansprechbar, ohne dass irgendwer etwas Geheimes austauscht.
- **ECDH ist bereits da:** `pinnwand/modules/noble-secp256k1.js` (v1.7.1,
  vendoriert) exportiert `getSharedSecret(privA, pubB)`. Damit lässt sich aus
  *meinem privaten* + *deinem öffentlichen* Schlüssel automatisch dasselbe
  gemeinsame Geheimnis ableiten wie umgekehrt — **kein Passwort, kein Server.**
  Das ist exakt das Muster von **Nostr NIP-04 / NIP-44** (verschlüsselte DMs).
- **Keine neue Abhängigkeit, kein neues Schlüssel-Feld, kein Protokoll-Bump**
  auf der Pinnwand. Der Schlüssel, der heute schon signiert, leitet morgen auch
  das Geheimnis ab.

Das ist der entscheidende Unterschied zum Passwort: **ein öffentlicher Schlüssel
darf offen sein.** Man muss nichts Geheimes über einen unsicheren Kanal schicken.

---

## 1. Die ehrliche Gabelung — Entdeckung ⟂ Geheimhaltung

Das ist der Kern, den man nicht verwischen darf. Es gibt **zwei
verschiedene Bedürfnisse**, und sie schließen sich technisch aus:

### A — Offenes Brett (Fremde finden dich nach Bedeutung)
Der ganze Sinn ist **Entdeckung durch Unbekannte**: jemand tippt „was er sucht",
und die Bedeutungs-Sortierung (Embedding + KI-Richter) findet **deine** Notiz,
obwohl du ihn nicht kennst.
- **Kann NICHT Ende-zu-Ende verschlüsselt sein.** Zwei Gründe, beide hart:
  1. Man kennt den Empfänger **nicht vorab** → an wessen Schlüssel sollte man
     verschlüsseln?
  2. Die Bedeutungs-Sortierung **muss den Klartext lesen**, um zu ranken. Wer
     rankt (Relay/Fremde), müsste entschlüsseln können → dann ist es nicht mehr
     geheim.
- **Bleibt naturgemäß öffentlich** — pseudonym (Pubkey statt Name), Transport
  per `wss`/TLS verschlüsselt, aber das Relay und jeder Leser sehen den Inhalt.
- **Das ist kein Mangel, sondern Wesen.** Entdeckbarkeit und Geheimhaltung sind
  orthogonal. Man wählt eins **pro Notiz/Raum**, nicht für die ganze App.

### B — Privat an Bekannte (man weiß, mit wem)
Hier geht der WhatsApp-Stil **voll auf**: öffentliche Schlüssel einmal tauschen
(dürfen offen sein), danach **kein Passwort mehr**. ECDH erzeugt das Geheimnis,
der Inhalt liegt für das Relay nur als Geheimtext.

> **Feiner, wichtiger Zusatz:** Auch ein privater Kanal kann **semantische Suche
> behalten** — nur eben **lokal bei den Mitgliedern**. Wer entschlüsseln kann,
> entschlüsselt im Browser und sortiert dann lokal nach Bedeutung. Die
> *Entdeckung-durch-Fremde* stirbt, die *Suche-unter-Mitgliedern* überlebt.

**Merksatz für die App:** Offenes Brett = Schaufenster (sichtbar, durchsuchbar
für alle). Privater Kanal = verschlossener Raum (nur Mitglieder, drinnen voll
durchsuchbar). Niemals beides im selben Thread vermischen.

---

## 2. Die Modelle nebeneinander — wie sieht das in EINER App aus?

Heute hat die Pinnwand ein Feld „🔒 Privates Brett: Passwort (leer = offen)".
Vorschlag, ohne zu verwirren — **getrennte Räume statt gemischter Threads:**

| Raum | Sichtbarkeit | Schlüssel | Suche | Wofür |
|---|---|---|---|---|
| **Offenes Brett** | öffentlich, pseudonym | keiner (Klartext) | für alle (Fremde finden dich) | Entdeckung, Aushang, „ich suche/biete" |
| **Schnell-Brett** | Geheimtext fürs Relay | **ein gemeinsames Passwort** | lokal (wer Passwort hat) | spontane Runde, „tippt dieses Wort, wir sind 10 min drin" |
| **Privater Kanal** | Geheimtext fürs Relay | **Public-Key (ECDH)** | lokal (Mitglieder) | bekannte Leute, dauerhaft, ohne Geheimnis-Versand |

- **Eine klare Umschaltung** (Reiter/Modus), nicht drei Felder nebeneinander.
- **Sichtbarer Zustand:** das offene Brett trägt ein „durchsuchbar/öffentlich"-
  Abzeichen; private Räume ein Schloss + farbigen Rahmen. Die App sagt heute
  schon ehrlich „Relay sieht nur Geheimtext" — diese Ehrlichkeit beibehalten.

---

## 3. Das eigentlich harte Problem: Schlüsselaustausch & MITM

**Ehrlich benannt:** Public-Key löst das Passwort-Verteilungs-Problem, aber es
verschiebt es — es löst es nicht in Luft auf. Der harte Teil ist der
**Erst-Tausch**: woher weiß ich, dass der Pubkey, den ich für „Anna" halte,
**wirklich Annas** ist und nicht der eines Angreifers in der Mitte (MITM), der
mir seinen Schlüssel unterschiebt und still mitliest?

**Aber — und das ist die gute Nachricht — die Verschiebung ist ein echter
Gewinn:**

| | Passwort-Weg (heute) | Public-Key-Weg |
|---|---|---|
| Was muss out-of-band? | ein **Geheimnis** (das Passwort) | nur eine **Verifikation** (Fingerprint) |
| Wenn jemand mithört | **kompromittiert** (er hat das Passwort) | **harmlos** (Pubkey/Fingerprint sind nicht geheim) |
| Wann verifizierbar | nur beim Verteilen | **jederzeit danach**, auch öffentlich |

Der Pubkey/Fingerprint darf **laut vorgelesen, auf den Tisch gelegt, öffentlich
gepostet** werden. Abfangen nützt dem Angreifer nichts. Das ist der ganze
Vorteil.

**Austausch-Methoden (von stark zu bequem):**
- **QR-Code persönlich** — stärkster Weg, kein MITM möglich (man sieht sich).
- **Sicherheits-Nummer/Fingerprint vergleichen** (wie WhatsApp/Signal): nach dem
  Tausch beide eine kurze Prüfzahl ihrer beiden Schlüssel zeigen; stimmen sie
  überein, war kein MITM dazwischen. Vergleich darf über jeden Kanal laufen,
  sogar öffentlich.
- **Link/Pubkey teilen** (Chat, E-Mail) — bequem, aber der Kanal selbst könnte
  manipuliert sein → **danach Fingerprint vergleichen** schließt die Lücke.
- **Auf dem offenen Brett posten** — am bequemsten, am schwächsten gegen MITM,
  solange kein Fingerprint-Vergleich folgt. **TOFU** (trust on first use): beim
  ersten Mal vertrauen, Schlüssel merken, bei Wechsel warnen.

**Ehrliche Untergrenze:** Es gibt **keinen server-losen Zauber**, der die
einmalige Verifikation überflüssig macht. Aber „einen nicht-geheimen Fingerprint
einmal vergleichen" ist deutlich sicherer und bequemer als „ein Geheimnis sicher
verschicken".

---

## 4. Gruppen (mehr als 2)

Zwei saubere Wege, mit klarem Trade-off:

- **A — An jeden Pubkey einzeln verschlüsseln** (N versiegelte Umschläge pro
  Nachricht).
  - ➕ Kein gemeinsamer Gruppen-Schlüssel, Mitglied entfernen = einfach weglassen.
  - ➖ Nachrichtengröße wächst mit der Mitgliederzahl; verrät die Empfänger-Anzahl.
  - **Gut für kleine, wechselnde Kreise.**
- **B — Gruppen-Schlüssel „wrappen"** (ein symmetrischer Gruppen-Schlüssel, der
  per Public-Key **einmal an jeden** verteilt wird — nie im Klartext gesendet;
  der Nachrichten-Text wird **einmal** mit dem Gruppen-Schlüssel verschlüsselt).
  - ➕ Nachrichten-Körper O(1); nur die Schlüssel-Verteilung ist O(N), einmalig.
  - ➖ Mitglied **entfernen** = neu schlüsseln (Gruppen-Schlüssel rotieren, für
    die Verbleibenden neu wrappen).
  - **Gut für größere, stabile Gruppen.**

**Empfehlung:** **Start mit A** (einfach, passt zu den kleinen Pinnwand-Kreisen
— Verein/Nische/Ort). **B** als Folge-Schritt, wenn Gruppen groß und stabil
werden.

---

## 5. Erst-Kontakt/Annehmen — passt zum Briefkasten

WhatsApps gerichteter Handshake (Kontaktanfrage → Annehmen) passt sauber auf den
**Briefkasten-Gedanken** (`notiz-briefkasten-pinnwand.md`: „Briefkasten =
adressierte Post A→B **+ Quittung**"):

```
A sendet Kontakt-Anfrage  (enthält A's Pubkey)
B nimmt an / quittiert     (enthält B's Pubkey)   ← das ist die Quittung
→ beide haben den Pubkey des anderen → Kanal etabliert
→ danach Fingerprint-Vergleich (§3) schließt MITM aus
```

Die Anfrage darf über das **offene Brett** reisen; die Sicherheit kommt erst aus
dem Fingerprint-Vergleich, nicht aus dem Transport. Das **Annehmen = Quittung**
ist genau das Briefkasten-Muster.

---

## 6. Verhältnis zu PR #302 (`docs/E2E-VERTRAULICHKEIT.md`)

**Wichtige Klärung — es sind zwei verschiedene Schlüssel-Systeme, nicht ein
Konflikt:**

| | Mycel-Spore (PR #302) | Pinnwand (diese Notiz) |
|---|---|---|
| Identitäts-Schlüssel | **Ed25519** (nur signieren, kann **kein** ECDH) | **secp256k1/Schnorr** (kann ECDH **nativ**) |
| Verschlüsselungs-Weg | **X25519** sealed-box + **neues** Spore-Feld `encryptionPublicKey` | **secp256k1-ECDH** mit dem **vorhandenen** Schlüssel |
| Protokoll | braucht `0.2`-Bump (neues Feld) | **kein Bump, kein neues Feld** |
| Abhängigkeit | X25519 via WebCrypto (modern, **geräte-abhängig**) | noble v1.7.1 **schon vendoriert**, überall |

- **PR #302 hat recht für seine Schicht:** die Spore-Identität ist Ed25519 und
  kann nicht ECDH; dort ist ein **separater X25519-Schlüssel** der richtige Weg
  (sealed box, sauber spezifiziert). Das bleibt der Mycel-Spore-Pfad.
- **Für die Pinnwand ist der secp256k1-Weg eleganter:** der Schlüssel, der schon
  da ist (und schon die sichtbare „Adresse" bildet), kann direkt ECDH. **Kein
  zweiter Schlüssel, kein neues Feld, keine geräte-abhängige WebCrypto-X25519-
  Stütze.** Das ist exakt NIP-04/NIP-44.
- **WebCrypto-X25519** ist in modernem Chrome verfügbar, aber geräte-abhängig
  (und für die Pinnwand bräuchte man dafür einen **zusätzlichen** Schlüssel,
  weil Schnorr-Keys kein X25519 sind) — **kein Gewinn** auf der Pinnwand.

**Design-Sorgfalt (sicherheits-sensibel, beim Bau ernst nehmen):** NIP-04 hatte
bekannte Schwächen (rohes ECDH-X-Koordinaten-Geheimnis, CBC, kein eigener MAC).
Ein echter Bau folgt dem **NIP-44-Design**: ECDH → **HKDF-SHA256** als
ordentliche Schlüssel-Ableitung → **AES-GCM-256** (authentifiziert) →
**versioniertes** Umschlag-Format. Genau die Primitiven, die PR #302 §2.1 schon
auflistet — nur mit secp256k1 statt X25519 im ECDH-Schritt.

---

## 7. Metadaten-Ehrlichkeit — was bleibt sichtbar?

Selbst bei perfekt verschlüsseltem **Inhalt** sieht das Relay weiterhin:

- **WER** postet (Pubkey — pseudonym, aber **dauerhaft** → über Zeit
  verknüpfbar/verfolgbar).
- **WANN** und **WIE OFT** (Zeitstempel, Frequenz).
- **WIE VIEL** (Nachrichtengröße).
- **WORAUF** geantwortet wird (`e`-Tags → Thread-Struktur, soziales Geflecht).
- **DASS** es verschlüsselt ist (`enc`-Tag) und im Gruppen-Modus A evtl. die
  **Empfänger-Anzahl**.

**Klartext für Klaus:** Verschlüsselung schützt den **Inhalt**, **nicht** das
Verkehrs-/Beziehungs-Muster. Wer auch Metadaten verbergen will, bräuchte mehr
(rotierende Schlüssel, Größen-Auffüllung, Cover-Traffic, Mixnet) — **außerhalb
des Rahmens** und für eine server-lose Pinnwand unrealistisch. Lieber ehrlich
sagen: „Inhalt geheim, dass du mit wem wann redest, sieht das Relay."

---

## 8. Empfehlung (zusammengefasst)

1. **Zwei Schichten getrennt lassen.** PR #302 (X25519) bleibt der **Mycel-
   Spore**-Pfad; die **Pinnwand** geht **secp256k1-ECDH** (vorhandener Schlüssel,
   keine neue Abhängigkeit, kein Bump). Nicht zwangs-vereinheitlichen.
2. **Offenes Brett bleibt Klartext** (pseudonym, Transport-TLS) — Entdeckung ⟂
   Geheimhaltung, ehrlich so benennen.
3. **Privater Kanal per Public-Key** (kein Passwort versenden), NIP-44-Design
   (ECDH → HKDF-SHA256 → AES-GCM-256, versionierter Umschlag).
4. **Schnell-Brett (Passwort) behalten** als bequemer Sonderfall daneben — nicht
   ausbauen, nicht rausreißen.
5. **Schlüsselaustausch:** TOFU + **nicht-geheimer Fingerprint-Vergleich**
   (QR persönlich am stärksten). Den MITM-Erst-Tausch ehrlich benennen.
6. **Gruppen:** mit Weg A starten (an jeden Pubkey einzeln), B später.
7. **Erst-Kontakt = Briefkasten-Handshake** (Anfrage → Annehmen/Quittung).

---

## 9. Offene Fragen für Klaus (Richtungsentscheid vor jedem Bau)

1. **Privater-Kanal-Weg:** Public-Key (secp256k1-ECDH, vorhandener Schlüssel) —
   wie empfohlen? Oder zunächst beim Passwort bleiben? Oder beides nebeneinander?
2. **Schnell-Brett (Passwort):** behalten als Sonderfall, oder durch Public-Key
   ersetzen?
3. **Schlüsselaustausch-UX:** Womit anfangen — QR persönlich, Pubkey/Link teilen,
   auf dem offenen Brett posten? (Fingerprint-Vergleich kommt in jedem Fall dazu.)
4. **Gruppen jetzt schon mitdenken** (Weg A) oder erst 1:1 sauber bauen?
5. **Nächster Schritt:** Notiz reicht erstmal (später entscheiden), ODER ein
   **Bau-Brief** für den Public-Key-Privatkanal, ODER den PR-#302-Entwurf um
   einen Pinnwand-Abschnitt erweitern?

*Erkundungs-Notiz, 2026-06-25. Kein Bau in dieser Sitzung. Belege: bestehende
Verschlüsselung `pinnwand/index.html` (Z. 396–435), `getSharedSecret` in
`pinnwand/modules/noble-secp256k1.js` (Z. 867), E2E-Entwurf `docs/E2E-
VERTRAULICHKEIT.md` (PR #302), Briefkasten/Pinnwand `notiz-briefkasten-pinnwand.md`,
freie Such-Stufen `docs/discovery/nostr-test/RICHTER-STUFEN.md`.*
