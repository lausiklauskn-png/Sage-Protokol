/*
 * SBKIM — Sage-Page Knoten-Korpus (Bau 22 Mehrfach 2026-06-21).
 *
 * Durchsuchbarer Korpus der VERBUNDENEN Mycel-Knoten für den „Knoten"-Bereich
 * des Such-Widgets (Modul 22). Damit findet die Frage „welcher Knoten passt zu
 * meiner Suche" semantisch den richtigen Nachbarn — komplett aus LOKAL bekannten
 * Sporen-Daten, OHNE Netz-Anfrage (Empfangsmodus gewahrt; das Mycel bleibt
 * Empfangsmodus, nur das Pilz-Werkzeug fragt aktiv — und auch das hier nicht,
 * weil der Knoten-Bereich rein lokal über die bekannten Nachbarn sucht).
 *
 * Quelle der Einträge: sbkim/NETZ-STAND.md (verified-match-Nachbarn, Stand
 * 2026-06-21). label = Knotenname, text = Domäne + Stichworte (synonym-reich),
 * anchorId = Endpunkt-URL (Link im Treffer). KEIN passageVec hier — lazy via
 * Modul 03 beim ersten Gebrauch (sbkim-init.js § sageBuildKnotenKorpus).
 *
 * KEIN PII, keine Schlüssel — nur öffentliche Spore-/Domänen-Angaben.
 */
(function (global) {
  "use strict";

  var SAGE_KNOTEN_KORPUS = [
    // nodeId (Bau Query-über-Relais 2026-06-28): ermöglicht die LIVE-Cross-
    // Knoten-Frage übers Relais (Modul 22 queryNode → Modul 05 queryNostr).
    // Öffentliche Spore-nodeIds aus jedem sbkim/spore.json — kein PII.
    { label: "Mein-Rezeptbuch", anchorId: "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/",
      nodeId: "uOpUBezUVbOMsVd2C9BkHW80agnLx5tCx_nIRy2KkXg",
      text: "Kochrezepte, Kochen, Essen, Gerichte, Zutaten, Mahlzeiten, Küche, Backen. Verbundener Knoten (verified-match)." },
    { label: "Mein-Mixarium", anchorId: "https://lausiklauskn-png.github.io/Mein-Mixarium/",
      nodeId: "B7Fke9CYTR1BrC3xOXzEY5q9RuRH8xxHPUuqRHV3utA",
      text: "Cocktails, Drinks, Mocktails, Mixgetränke, Bar, Longdrinks, Aperitif. Verbundener Knoten (verified-match)." },
    { label: "BookLedgerPro", anchorId: "https://lausiklauskn-png.github.io/BookLedgerPro/",
      nodeId: "MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ",
      text: "Buchhaltung, Belege, Konten, Rechnungen, Umsatzsteuer, EÜR, GoBD, Kostenstellen, Aufträge, verschlüsselt offline-first. Verbundener Knoten (verified-match)." },
    { label: "SB·KIMTool·Point", anchorId: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",
      nodeId: "CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY",
      text: "SBKIM-Werkzeuge, Tool-Point, Modul-Sammlung, Observatorium light für Forker, Werkzeugkiste. Verbundener Knoten (verified-match)." },
    { label: "Jasons-Tresor", anchorId: null,
      nodeId: "E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM",
      text: "Jasons-Tresor-Bibliothek, Tresor, sichere Ablage, geschützte Sammlung. Verbundener Knoten (verified-match)." },
    { label: "Mein-Tresor", anchorId: null,
      nodeId: "wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0",
      text: "Mein-Tresor-Bibliothek, Tresor, sichere Ablage, geschützte Sammlung, Schwester von Jasons-Tresor. Verbundener Knoten (verified-match)." },
    { label: "Kim-Bell", anchorId: "https://lausiklauskn-png.github.io/Kim-Bell/",
      nodeId: "e9TlbEzxdL6UrlwCWjrTxwuWOLDXZ_AIvx12BMrhPaw",
      text: "Netz-Anmeldung, Rendezvous, Identität, Spore erzeugen, Glocke, Mycel, Knoten, sauber im gemeinsamen SBKIM-Raum anmelden und andere Knoten finden. Verbundener Knoten (verified-match; Live-Cross-Knoten-Handshake Sage↔Kim-Bell im Browser bestätigt 2026-07-08; Cosinus 0.8711)." },
    { label: "Kimseek", anchorId: "https://lausiklauskn-png.github.io/Kimseek/",
      nodeId: "I7qX13yu4BEFIi8yd_5MepkC1b7sFAk2W17d5re5x8Y",
      text: "Semantische Suche, Bedeutung, Absicht, Embedding, Bedeutungs-Sortierung, Sprachsuche, Spracheingabe, OCR, Handschrift-Erkennung, KI-Brücke, Web-Suche, versteht die Bedeutung hinter der Frage statt nur Stichwörter. Verbundener Knoten (verified-match; Cosinus Sage↔Kimseek 0.8553; Live-Handshake wartet auf Klaus' Browser-Lauf)." },
    { label: "Kimboard", anchorId: "https://lausiklauskn-png.github.io/Kimboard/",
      nodeId: "Hc0t9z4te4kWoh7cBMtJAb7m6Nl17eBKxwPvbJ5Rqfk",
      text: "Pinnwand, Notizen, Merken, Frage-Antwort, dummes Brett, Nostr, geräteübergreifend, nach Bedeutung sortiert, Impulse und Verbindungen festhalten. Verbundener Knoten (verified-match; Cosinus Sage↔Kimboard 0.8262; Live-Handshake wartet auf Klaus' Browser-Lauf)." },
  ];

  global.SAGE_KNOTEN_KORPUS = SAGE_KNOTEN_KORPUS;

  if (typeof console !== "undefined" && console.info) {
    console.info("SAGE-KNOTEN-KORPUS bereit, Einträge: " + SAGE_KNOTEN_KORPUS.length + " (verbundene Knoten).");
  }
})(typeof window !== "undefined" ? window : globalThis);
