/*
 * Siegel-Inhalt — DIE IDENTITÄT DIESES KNOTENS, und sonst nichts.
 *
 * Der Andock-Wizard kommt aus dem Kanon (`../src/modules/16b_andock_wizard.js`)
 * und liest nur `window.SBKIM_SIEGEL_WIZ`. Diese Datei wird NIE verteilt: sie
 * trägt die Bedeutung des Knotens (docs/INTERFACES.md §11.9).
 *
 * ⚠ Modul 03 rechnet aus der Beschreibung den Domänen-Vektor. Das Wichtigste
 * steht vorn (Name, Zweck, Protokoll). Sie geht ins Netz: keine Personendaten.
 */
(function () {
  "use strict";
  window.SBKIM_SIEGEL_WIZ = {
    domain: "Protokoll/Vorführung/Forschung",
    endpoint: "https://lausiklauskn-png.github.io/Sage-Protokol/sbkim-demo/",
    nodeType: "hybrid",
    nodeName: "SBKIM-Demo",
    domainDescription: "SBKIM-Demo ist die Vorführung des SBKIM-Protokolls im Mycel und ein eigener Knoten. ZWECK: zeigen, wie zwei Apps sich gegenseitig nach Bedeutung fragen: eine sagt in eigenen Worten, was sie sucht, die andere prüft selbst, ob sie dazu etwas hat, und antwortet aus ihrem eigenen Bestand. Dazu die erste lauffähige Fassung vom März 2026 als Ausstellungsstück, mit ihren Grenzen benannt, die lebende Mycel-Karte und die Papiere zum Protokoll. FORSCHUNG UND PROTOKOLL: SBKIM heißt Semantisches Bidirektionales KI-Matching, eine offene Spezifikation aus dem Sage-Protokol; Bedeutung wird als Vektor verglichen, jeder Knoten trägt eine signierte Spore und eine eigene Kennung, und mit dem Netz verbindet er sich nur auf ausdrücklichen Klick. WAS ES NICHT IST: keine Suchmaschine und kein Verzeichnis; die Demo lädt keine Daten hoch. FÜR WEN: für alle, die verstehen wollen, wie Apps ohne zentralen Server zueinander finden, und für Entwickler, die das Protokoll nachbauen wollen.",
    domainKeywords: ["SBKIM", "SBKIM-Protokoll", "Sage-Protokol", "Mycel", "Knoten", "Demo", "Vorführung", "semantisches Matching", "bidirektional", "Bedeutung", "Vektor", "Spore", "Protokoll", "Forschung", "Papiere", "Mycel-Karte", "ohne Server"],
    stammCategories: ["Protokoll", "Vorführung", "Forschung"],
    guestCategories: ["Werkzeug", "Netz", "Siegel"],
    backupPrefix: "sbkim-demo-backup",
  };
})();
