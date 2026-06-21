/*
 * SBKIM — Sage-Page Such-Korpus (Bau 22 B-Schritt 2026-06-21).
 *
 * Der durchsuchbare Korpus der Sage-Page für das Such-Widget (Modul 22).
 * Kuratierte Domäne der Sage „Mycel-Bibliothek": die SBKIM-WERKZEUGE
 * (Module 00–22) — jedes mit anzeigbarem Titel + Bedeutungs-Text +
 * Anker-ID. Klaus' Festlegung 2026-06-21 (erster Korpus = die Tool-
 * Bibliothek; Glossar/Doku ist eine spätere Erweiterung).
 *
 * Schema pro Eintrag (Modul 04 § Sub (c) queryLocal + HYBRID-MATCH-EINBAU.md):
 *   { label:    anzeigbarer Titel,
 *     text:     Bedeutungs-Text MIT Alltags-Synonymen (Recall-Lehre 3 aus
 *               HYBRID-MATCH-EINBAU.md — Embedding UND Richter sehen die
 *               umgangssprachliche Variante),
 *     anchorId: opake Anker-ID (Modul-Nummer, z.B. "modul-15") }
 *
 * KEIN passageVec hier — die Vektoren werden zur Laufzeit lazy via Modul 03
 * (SbkimEmbedding.embedPassageBatch) erzeugt, wenn das Such-Widget zum
 * ersten Mal benutzt wird (sbkim-init.js § sageBuildSuchkorpus). So bleibt
 * die Sage-Page leicht beim Start (kein 30-MB-Modell-Download im Boot).
 *
 * KEIN PII, keine Schlüssel — reine öffentliche Modul-Beschreibungen.
 */
(function (global) {
  "use strict";

  var SAGE_SUCHKORPUS = [
    { label: "00 — Doku-Fenster", anchorId: "modul-00",
      text: "Versteckte Hilfe und Doku. Fünf Klicks auf das Such-Symbol öffnen ein Protokoll-Fenster mit Anleitung, Status, Speicher-Anzeige. Hilfe, Handbuch, Info, About, Onboarding." },
    { label: "01 — Storage", anchorId: "modul-01",
      text: "Lokaler Speicher im Browser. Daten sichern, IndexedDB, Stores anlegen, Persistenz, Datenhaltung, Datenbank, speichern und laden ohne Server." },
    { label: "02 — Spore", anchorId: "modul-02",
      text: "Identität des Knotens. Eigene Kennung erzeugen (nodeId), Schlüssel, Signatur, Spore. Backup exportieren und importieren, verschlüsseltes Backup mit Passwort." },
    { label: "03 — Embedding", anchorId: "modul-03",
      text: "Text in Bedeutung umwandeln. Semantische Vektoren, e5-Modell, Einbettung, damit Sätze nach Sinn vergleichbar werden. Grundlage der bedeutungsbasierten Suche." },
    { label: "04 — Match", anchorId: "modul-04",
      text: "Bedeutungen vergleichen. Ähnlichkeit messen (Cosinus), lokale Suche queryLocal, KI-Richter hybridMatch, Treffer bewerten und sortieren, passt oder passt nicht." },
    { label: "05 — Anastomose", anchorId: "modul-05",
      text: "Zwei Knoten verbinden. Handshake, Verknüpfung zwischen Apps aufbauen, Verbindung herstellen, koppeln, zusammenschließen." },
    { label: "06 — Heterokaryose", anchorId: "modul-06",
      text: "Geteiltes Wissen zwischen verbundenen Knoten. Gemeinsame Inhalte, Wissens-Austausch, Daten teilen mit verbundenen Geschwistern." },
    { label: "07 — Apoptose", anchorId: "modul-07",
      text: "Knoten-Tod und Vermächtnis. Selbst-Abschaltung, Erbe an Geschwister weitergeben, Nachlass, geordnetes Beenden eines Knotens." },
    { label: "08 — UI-Demo", anchorId: "modul-08",
      text: "Beispiel-Oberfläche und Nachrichten-Ausgang (Outbox). Demo-UI, Vorlage, Schaufenster für die Module." },
    { label: "09 — Einbau-PWA", anchorId: "modul-09",
      text: "Ein Modul in eine echte App einbauen. Andock-Anleitung, Integration in Rezeptbuch oder Mixarium, Schritt-für-Schritt-Einbau, installieren, übernehmen." },
    { label: "10 — Reputation", anchorId: "modul-10",
      text: "Vertrauen und Ruf eines Knotens. Reputations-Schutz, wer ist verlässlich. Geplant (Schutz-Backlog), noch nicht gebaut." },
    { label: "11 — Rate-Limit", anchorId: "modul-11",
      text: "Drosselung und Anfrage-Begrenzung. Schutz vor Überlastung und Spam, zu viele Anfragen bremsen. Geplant (Schutz-Backlog)." },
    { label: "12 — Blocklist", anchorId: "modul-12",
      text: "Sperrliste. Knoten blockieren, manuelle Blockade, jemanden ausschließen, Bann. Geplant (Schutz-Backlog)." },
    { label: "14 — Diffusion", anchorId: "modul-14",
      text: "Wuchs durch Empfehlung. Leads weitergeben, konsensuelle Empfehlung im Handshake, Mundpropaganda im Netz. Geplant (Backlog)." },
    { label: "15 — Membran", anchorId: "modul-15",
      text: "Außenhülle und Schutz nach außen. Fremde Zugriffe erkennen, KI-Browser-Agenten bemerken, Fremdzugriff-Lampe, App-zu-App-Brücke per postMessage. Sicherheit gegen fremden Zugriff, wer schaut auf meine App." },
    { label: "16 — Siegel", anchorId: "modul-16",
      text: "SBKIM-Siegel, das Selbst-Zertifikat. Vertrauens-Abzeichen, Auszeichnung, Plakette, Bronze und Gold, beweist erfüllte Pflicht-Module." },
    { label: "17 — Floating-Widget", anchorId: "modul-17",
      text: "Schwebendes Status-Fenster. Vier Lampen LEBT, VERKEHR, FREMD, SIEGEL zeigen den Live-Zustand. Verschiebbares Mini-Panel, Statusanzeige, Kontrollleuchte." },
    { label: "18 — Tool-PWA", anchorId: "modul-18",
      text: "Andock-Wizard und Werkzeug-Container. Fremden Knoten verbinden, Spore installieren, Tool öffnen, neuen Knoten anbinden." },
    { label: "19 — Andock-Wizard", anchorId: "modul-19",
      text: "Kopierbarer Andock-Assistent. Neue Spore-Vorlage erzeugen, Knoten anmelden, sich am Mycel anschließen, Einrichtungs-Helfer." },
    { label: "20 — Schlüssel-Safe", anchorId: "modul-20",
      text: "Identität sichern im verschlüsselten Safe. Privater Schlüssel, Passwort, Shamir-Wiederherstellung 2 von 3, Backup der Identität, Tresor für die Kennung." },
    { label: "21 — Spracheingabe", anchorId: "modul-21",
      text: "Sprechen statt tippen. Mikrofon, Spracherkennung, Sprache zu Text, mehrsprachig Deutsch Englisch Russisch, diktieren, Voice." },
    { label: "22 — Such-Widget", anchorId: "modul-22",
      text: "Schwebendes Such-Tool, die Lupe. Eine Suchmaschine, die sich in jede App legen lässt, Sprache und Suche kombiniert, frei beweglich, bis zur Lupe minimierbar." },
  ];

  global.SAGE_SUCHKORPUS = SAGE_SUCHKORPUS;

  if (typeof console !== "undefined" && console.info) {
    console.info("SAGE-SUCHKORPUS bereit, Einträge: " + SAGE_SUCHKORPUS.length + " (Module-Bibliothek).");
  }
})(typeof window !== "undefined" ? window : globalThis);
