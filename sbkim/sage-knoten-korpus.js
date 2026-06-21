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
    { label: "Mein-Rezeptbuch", anchorId: "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/",
      text: "Kochrezepte, Kochen, Essen, Gerichte, Zutaten, Mahlzeiten, Küche, Backen. Verbundener Knoten (verified-match)." },
    { label: "Mein-Mixarium", anchorId: "https://lausiklauskn-png.github.io/Mein-Mixarium/",
      text: "Cocktails, Drinks, Mocktails, Mixgetränke, Bar, Longdrinks, Aperitif. Verbundener Knoten (verified-match)." },
    { label: "BookLedgerPro", anchorId: "https://lausiklauskn-png.github.io/BookLedgerPro/",
      text: "Buchhaltung, Belege, Konten, Rechnungen, Umsatzsteuer, EÜR, GoBD, Kostenstellen, Aufträge, verschlüsselt offline-first. Verbundener Knoten (verified-match)." },
    { label: "SB·KIMTool·Point", anchorId: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",
      text: "SBKIM-Werkzeuge, Tool-Point, Modul-Sammlung, Observatorium light für Forker, Werkzeugkiste. Verbundener Knoten (verified-match)." },
    { label: "Jasons-Tresor", anchorId: null,
      text: "Jasons-Tresor-Bibliothek, Tresor, sichere Ablage, geschützte Sammlung. Verbundener Knoten (verified-match)." },
    { label: "Mein-Tresor", anchorId: null,
      text: "Mein-Tresor-Bibliothek, Tresor, sichere Ablage, geschützte Sammlung, Schwester von Jasons-Tresor. Verbundener Knoten (verified-match)." },
  ];

  global.SAGE_KNOTEN_KORPUS = SAGE_KNOTEN_KORPUS;

  if (typeof console !== "undefined" && console.info) {
    console.info("SAGE-KNOTEN-KORPUS bereit, Einträge: " + SAGE_KNOTEN_KORPUS.length + " (verbundene Knoten).");
  }
})(typeof window !== "undefined" ? window : globalThis);
