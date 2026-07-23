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
      nodeId: "VtvtrDV4KhQv3Q9B9jwZL5UIc9W7xrsKLduZ9xqk9T8",
      text: "Kochrezepte, Kochen, Essen, Gerichte, Zutaten, Mahlzeiten, Küche, Backen. Verbundener Knoten (verified-match)." },
    { label: "Mein-Mixarium", anchorId: "https://lausiklauskn-png.github.io/Mein-Mixarium/",
      nodeId: "YD68l2ScNzd-RWS8tCrL_JAtgpoPp3i3VKc4N9GKvbo",
      text: "Cocktails, Drinks, Mocktails, Mixgetränke, Bar, Longdrinks, Aperitif. Verbundener Knoten (verified-match)." },
    { label: "BookLedgerPro", anchorId: "https://lausiklauskn-png.github.io/BookLedgerPro/",
      nodeId: "MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ",
      text: "Buchhaltung, Belege, Konten, Rechnungen, Umsatzsteuer, EÜR, GoBD, Kostenstellen, Aufträge, verschlüsselt offline-first. Verbundener Knoten (verified-match)." },
    { label: "SB·KIMTool·Point", anchorId: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",
      nodeId: "JZ7MeMtprz5XAiXF81agCQ1mmynZUUPl_gLerqR_Zrg",
      text: "SBKIM-Werkzeuge, Tool-Point, Modul-Sammlung, Observatorium light für Forker, Werkzeugkiste. Verbundener Knoten (verified-match)." },
    { label: "Jasons-Tresor", anchorId: null,
      nodeId: "lbUthjt-outt4ns4NJQI2TaMzubX4BzQJGp_Odx_vek",
      text: "Jasons-Tresor-Bibliothek, Tresor, sichere Ablage, geschützte Sammlung. Verbundener Knoten (verified-match)." },
    { label: "Mein-Tresor", anchorId: null,
      nodeId: "feV3o4qJF58caokPJr_oajm9dcnKwGjVXzBum8M8icM",
      text: "Mein-Tresor-Bibliothek, Tresor, sichere Ablage, geschützte Sammlung, Schwester von Jasons-Tresor. Verbundener Knoten (verified-match)." },
    { label: "Kim-Bell", anchorId: "https://lausiklauskn-png.github.io/Kim-Bell/",
      nodeId: "Xg1xKoZ9vIgimEKlqeCDL_u4ptbRT6qvKplPAppyJfI",
      text: "Netz-Anmeldung, Rendezvous, Identität, Spore erzeugen, Glocke, Mycel, Knoten, sauber im gemeinsamen SBKIM-Raum anmelden und andere Knoten finden. Verbundener Knoten (verified-match; Live-Cross-Knoten-Handshake Sage↔Kim-Bell im Browser bestätigt 2026-07-08; Cosinus 0.8711)." },
    { label: "Kimseek", anchorId: "https://lausiklauskn-png.github.io/Kimseek/",
      nodeId: "Yd8mwHSDYkcyd1meDe-7DJa5PS4KrY5bsl8VDn6x-TM",
      text: "Semantische Suche, Bedeutung, Absicht, Embedding, Bedeutungs-Sortierung, Sprachsuche, Spracheingabe, OCR, Handschrift-Erkennung, KI-Brücke, Web-Suche, versteht die Bedeutung hinter der Frage statt nur Stichwörter. Verbundener Knoten (verified-match; Cosinus Sage↔Kimseek 0.8553; Live-Handshake wartet auf Klaus' Browser-Lauf)." },
    { label: "Kimboard", anchorId: "https://lausiklauskn-png.github.io/Kimboard/",
      nodeId: "1f9Jb7c3SEI8dUOtGR6_meMaOaPgbz2GWXMLmPCZMv8",
      text: "Pinnwand, Notizen, Merken, Frage-Antwort, dummes Brett, Nostr, geräteübergreifend, nach Bedeutung sortiert, Impulse und Verbindungen festhalten. Verbundener Knoten (verified-match; Cosinus Sage↔Kimboard 0.8262; Live-Handshake wartet auf Klaus' Browser-Lauf)." },
    { label: "Family Projekt", anchorId: "https://family-projekt.de/",
      nodeId: "XoYhjpgm0F_lWqmaygHEdStBUDGAl70wcOZR--NhhR4",
      text: "Werkzeuge, Apps, Marktplatz, family-projekt.de, App-Bündelung, fremde Apps anbieten mit oder ohne Mycel, freies neutrales Netzwerk, Netzwerk der Werkzeuge, Plattform. Verbundener Knoten (verified-match; Cosinus Sage↔Family 0.8287)." },
    { label: "Tomys Hub", anchorId: "https://lausiklauskn-png.github.io/Tomys-Hub/",
      nodeId: "yaerFGfy7yAajFEce-sUiE6jo263TwkUmbsjIS8Js-8",
      text: "Digitaldruck, Textildruck, Stick, Stickerei, Werbeartikel, Werbetechnik, Werbemittel, bedruckte Tassen, Untersetzer, Handtücher, Werbeflaggen, Werbung. Verbundener Knoten (verified-match zu Family 0.8073 und BookLedgerPro 0.8064; fachverwandte Werkzeug-Domäne — kein Sage-Match; live bidirektional established 2026-07-11)." },
    { label: "Private Brain", anchorId: "https://lausiklauskn-png.github.io/Privat-Brain/",
      nodeId: "6rmW2Q-53mzEylZiWuW4yNsbnxlyEoLD11860i3y0Cg",
      text: "Privates zweites Gehirn, eigene Daten, Mails, Dokumente, Fotos, Notizen, semantische kombinierende Suche über gemischte Daten, Bedeutungs-Katalog, offline, verschlüsselt, liest nur und schlägt vor. Verbundener Knoten (verified-spore 2026-07-20; Cross-Knoten-Match-Score noch offen)." },
    { label: "Muttis-Rezeptbuch", anchorId: "https://lausiklauskn-png.github.io/Muttis-Rezeptbuch/",
      nodeId: "8TVDCTAcPLg4Lbe3ecbvXoICLCEQNd90YYIw4dPN3mg",
      text: "Kochrezepte, Kochen, Essen, Gerichte, Zutaten, Mahlzeiten, Küche, Backen, hausgemacht, wandelbarer Rezept-Baukasten. Verbundener Knoten (verified-match 2026-07-23; Cosinus Sage↔Muttis 0.8766; Schwester von Mein-Rezeptbuch 0.878 — eigene, getrennte Identität)." },
  ];

  global.SAGE_KNOTEN_KORPUS = SAGE_KNOTEN_KORPUS;

  if (typeof console !== "undefined" && console.info) {
    console.info("SAGE-KNOTEN-KORPUS bereit, Einträge: " + SAGE_KNOTEN_KORPUS.length + " (verbundene Knoten).");
  }
})(typeof window !== "undefined" ? window : globalThis);
