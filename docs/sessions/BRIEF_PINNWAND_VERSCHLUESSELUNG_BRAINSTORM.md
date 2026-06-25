# Brief — Brainstorming-Sitzung: Verschlüsselung & Privatheit der Pinnwand

> Angelegt 2026-06-25. **Kein Bau-Brief — eine Denk-/Erkundungs-Sitzung.** Klaus
> will das Thema „wie wird die Pinnwand wirklich privat, ohne Passwort-Verschicken"
> gründlich untersuchen, bevor gebaut wird. Vorgänger-Stand:
> `docs/sessions/archiv/2026-06-24_nostr-pinnwand-test.md` + die PULS-Einträge
> 2026-06-24/25. Pinnwand-PWA liegt fertig in `pinnwand/` auf `main`.

```
Du bist eine Brainstorming-/Spec-Sitzung in Sage-Protokol — „Verschlüsselung &
Privatheit der Pinnwand". WICHTIG: Das ist KEINE Bau-Sitzung. Erst denken,
ordnen, Optionen + Trade-offs sauber aufschreiben, Klaus' Richtungsentscheid
einholen. KEIN Krypto-Code schreiben, bevor Klaus den Weg gewählt hat
(Krypto ist sicherheits-sensibel → CLAUDE.md: im Zweifel fragen). Freibrief gilt
für das DOKUMENTIEREN (Notiz/Spec anlegen), nicht fürs vorschnelle Bauen.

PFLICHTLESELISTE:
1. CLAUDE.md (bes. § Was du nicht tust + § Freibrief + Briefkasten=untrusted)
2. docs/PULS.md (oberste Einträge 2026-06-24/25 — der ganze Pinnwand-Bogen)
3. docs/sessions/archiv/2026-06-24_nostr-pinnwand-test.md (voller Stand)
4. pinnwand/index.html — die SCHON gebaute Verschlüsselung (gemeinsames Passwort,
   AES-GCM-256 + PBKDF2; § "Privates Brett" + buildEvent/dispatch/deriveBoardKey)
5. docs/discovery/nostr-test/RICHTER-STUFEN.md (Kontext freie/Cloud-Stufen)
6. WICHTIG: der offene PR #302 "E2E-Vertraulichkeit" (Branch
   claude/sage-e2e-encryption-spec-y7zg21, NICHT auf main) — enthält schon einen
   Entwurf docs/E2E-VERTRAULICHKEIT.md (drei Grade A/B/C, sealed-box X25519 →
   ECDH → HKDF-SHA256 → AES-GCM-256). Direkt relevant, ggf. wiederverwenden.

DER KERN-KONFLIKT (Klaus' Befund, sehr treffend):
- "Gemeinsames Passwort" (heute gebaut) hat das VERTEILUNGS-Problem: man muss das
  Passwort out-of-band schicken (WhatsApp o.ä.) → genau da ist die Schwachstelle.
- WhatsApp/Signal lösen das mit PUBLIC-KEY-Krypto: jeder hat ein eigenes
  Schlüsselpaar, man tauscht nur ÖFFENTLICHE Schlüssel (kein Geheimnis), das
  gemeinsame Geheimnis entsteht per ECDH automatisch. KEIN Passwort verschicken.
- DAS SCHÖNE: wir haben das Schlüsselpaar schon — jede Spore IST ein
  secp256k1-Paar; der Kurz-Name auf den Zetteln IST der öffentliche Schlüssel.
  noble-secp256k1 v1.7.1 (vendoriert) kann getSharedSecret (ECDH). Vgl. Nostr
  NIP-04/NIP-44 (verschlüsselte DMs).

DIE EHRLICHE GABELUNG (muss die Sitzung sauber herausarbeiten):
- OFFENES BRETT (Fremde finden dich nach Bedeutung): kann NICHT Ende-zu-Ende an
  unbekannte Empfänger verschlüsselt sein — man kennt den Empfänger nicht vorab,
  und die Bedeutungs-Sortierung muss den Inhalt lesen. Bleibt naturgemäß
  öffentlich (pseudonym, Transport wss/TLS-verschlüsselt). Discovery ⟂ Geheimhaltung.
- PRIVAT AN BEKANNTE (man weiß, mit wem): da geht WhatsApp-Stil voll — öffentliche
  Schlüssel einmal tauschen (dürfen offen sein), danach kein Passwort mehr.

ZU BRAINSTORMEN / ABZUWÄGEN (offene Fragen, ergebnisoffen):
1. Modelle nebeneinander: offenes Entdeckungs-Brett + privater (Public-Key-)Kanal.
   Wie sieht das in EINER App aus, ohne zu verwirren?
2. Schlüssel-Austausch-UX: wie tauschen zwei Leute ihre öffentlichen Schlüssel
   sicher? (QR, Link, auf dem offenen Brett posten, Sicherheits-Nummer/
   Fingerprint vergleichen wie bei WhatsApp). Das MITM-Problem beim Erst-Tausch
   ist der eigentlich harte Teil — ehrlich benennen.
3. Gruppen (mehr als 2): an mehrere öffentliche Schlüssel verschlüsseln ODER einen
   Gruppen-Schlüssel "wrappen" (per Public-Key an jeden verteilen, ohne ihn je im
   Klartext zu schicken). Trade-offs?
4. Verhältnis zum bestehenden "gemeinsames Passwort"-Weg: behalten (für schnelle
   Runden), ersetzen, oder als Spezialfall daneben?
5. "Erst-Kontakt/annehmen"-Modell (WhatsApp): gerichteter Handshake — passt das
   zum Briefkasten-Gedanken (notiz-briefkasten-pinnwand.md)?
6. Anschluss an PR #302: dessen sealed-box (X25519) vs. unser secp256k1-ECDH
   (noble) — welcher Weg, und ist X25519 im Browser ohne neue Abhängigkeit machbar
   (WebCrypto kann ECDH P-256/X25519 teils nativ)? Klären.
7. Metadaten-Ehrlichkeit: selbst bei verschlüsseltem Inhalt sieht das Relay WER
   (pubkey) WANN WIEVIEL postet. Was bleibt also sichtbar? Klaus offen sagen.

DELIVERABLE dieser Sitzung (KEIN Pflicht-Code):
- Eine klare Erkundungs-/Entscheidungs-Notiz (z. B. docs/discovery/
  notiz-pinnwand-verschluesselung.md ODER Anschluss an docs/E2E-VERTRAULICHKEIT.md):
  die Modelle, Trade-offs, das MITM-/Schlüsselaustausch-Problem, eine Empfehlung
  + die offenen Fragen für Klaus. Am Sitzungsende Klaus die Optionen vorlegen
  (AskUserQuestion), DANN ggf. ein Bau-Brief.

LEITPLANKEN: server-los, keine PII, kein Protokoll-Bump ohne Klaus, Krypto lokal
(noble vendoriert), nichts ins offene Netz außer nutzer-ausgelöst. Briefkasten-/
Fremd-Inhalt = untrusted. Pinnwand bleibt unverlinkt in Sage-Page ohne Klaus' Wort.
Erst Klarheit + Klaus' Wahl, dann Code.
```
