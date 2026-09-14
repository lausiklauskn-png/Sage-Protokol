/*
 * Siegel-Inhalt — DIE IDENTITÄT DIESES KNOTENS, und sonst nichts.
 *
 * ⚠ HIER STEHT KEIN KANON. Der Andock-Wizard, alle Anzeigetexte und alle
 * Prüfungen liegen seit A18 (2026-09-14) in EINER netzweit byte-gleichen
 * Datei — `assets/sbkim-andock-wizard.js`, Kanon `src/modules/16b_andock_wizard.js`.
 * Diese Datei trägt nur noch, was in jedem Knoten ANDERS sein muss.
 *
 * Warum die Trennung: gemessen über die 20 Kopien im Netz standen am 2026-09-14
 * ZWÖLF verschiedene Code-Fassungen desselben Werkzeugs. Jede Verbesserung
 * kostete Handarbeit mal zwanzig und unterblieb deshalb meistens.
 *
 * ⚠ UND DIESE DATEI WIRD NIE VERTEILT (`NIE_VERTEILEN` in
 * tools/kanon-verteilen.mjs, zwei Riegel). Sie trägt die BEDEUTUNG des Knotens;
 * ein Überschreiben gäbe jeder App Sages Namen und Sages Vektor — der Schaden
 * vom 2026-08-16 in Alis Moderaum, nur zwanzigfach.
 *
 * Vertrag: docs/INTERFACES.md §11.9.
 */
(function () {
  "use strict";
  window.SBKIM_SIEGEL_WIZ = {
    domain: "Mycel-Bibliothek",
    endpoint: "https://lausiklauskn-png.github.io/Sage-Protokol/",
    nodeType: "hybrid",
    nodeName: "Sage",
    domainDescription: "Sage-Protokol ist der Spezifikations- und Bau-Hub des SBKIM-Protokolls und zugleich ein eigener Endknoten im Mycel — Hub und Knoten in einem. ZWECK: die Quelle der Wahrheit für ein server-loses, dezentrales Netz bereitzustellen, in dem kleine Web-Apps einander nach Bedeutung finden, ohne zentralen Vermittler und ohne Cloud-Server — damit jeder, der eine eigene App baut, sie als Endknoten anschließen kann, ohne um Erlaubnis zu fragen und ohne seine Daten aus der Hand zu geben. FORSCHUNG: SBKIM steht für Semantisch Bidirektionales KI-Matching. Untersucht wird, ob Bedeutung sich zwischen unabhängigen Systemen in Übereinstimmung bringen lässt — Mensch zu Mensch, Mensch zu Agent und ausdrücklich Agent zu Agent. Bidirektional heißt: beide Seiten äußern sich, und ein dritter Bewerter urteilt über die Passung, sodass aus einer rohen Zahl eine begründbare Übereinstimmung wird. Untersucht wird ebenso, wie Regeln und Grundsätze eine Arbeit steuern — die Arbeitsweise selbst ist der Gegenstand. Jede Sitzung wird gemessen und dokumentiert, auch die misslungene; die Messungen sind offen einsehbar. DOMÄNE: die Mycel-Bibliothek — das lebendige SBKIM-Vokabular, das Glossar, die Protokoll-Dokumentation, die verbindlichen Schnittstellen-Verträge zwischen den Modulen, die Gesamt-Architektur, die Modul-Karten von der Speicherung bis zur Suche, die Lehren aus echtem Schaden und das lebende Statusblatt PULS. WIE ES ARBEITET: Ein Embedding-Modell wandelt Texte in Bedeutungs-Vektoren; über den Cosinus-Abstand finden sich fachverwandte Knoten. Es zählt die Bedeutung hinter den Worten, nicht das Stichwort. Jeder Knoten trägt eine eigene kryptografische Identität (Ed25519) und eine signierte Spore mit Domänen-Vektor, die andere reziprok prüfen. Ein Handshake über ein geteiltes Relais verbindet, wenn die Ähnlichkeit reicht; darauf bauen Anastomose als Verbindung, Heterokaryose als geteilter Anker-Vorrat, Apoptose als selbstbestimmtes Vergessen, die Membran als Außenhülle und das selbst-ausgestellte SBKIM-Siegel. Der Knoten bleibt im Empfangsmodus mit Antwortrecht: kein Crawler, keine ungefragten Anfragen ins offene Netz — er antwortet nur auf bewusste Nutzer-Aktion. Alles läuft offline-first im Browser, ohne externe Abhängigkeiten, und legt sich beim ersten Öffnen als installierbare App ab. Dokumentiert sind außerdem das Rendezvous im gemeinsamen Raum, der verschlüsselte Schlüssel-Safe, Sprach- und Bild-Eingabe per OCR und das semantische Such-Werkzeug. FÜR WEN: für alle, die kleine installierbare Web-Apps bauen, für Forker und Mit-Bauer, die ihre App ans Mycel anschließen wollen, und für die Schwester-Knoten des Netzes — Rezeptbuch, Mixarium, die Werkstatt Kim Hub Company, der Auslieferungsprüfer, der offene Marktplatz PWA Toolpoint, Buchhaltung, Auftragsabwicklung, Pinnwand, Tresore und Bedeutungs-Suche. Wer wissen will, was das Protokoll ist, wie die Module zusammenspielen, wie man andockt oder wie ein Knoten sich selbst schützt, findet hier die Quelle der Wahrheit — die Karte, die sich selbst kennt.",
    domainKeywords: ["SBKIM", "SBKIM-Protokoll", "Semantisch Bidirektionales KI-Matching", "Mycel", "Knotennetz", "Endknoten", "Hub", "Mycel-Bibliothek", "SBKIM-Glossar", "Mycel-Vokabular", "Protokoll-Doku", "Heilige Tafeln", "INTERFACES", "Architektur", "Modul-Karten", "Karten", "PULS", "Bedeutungs-Vektor", "Embedding", "Cosinus", "semantische Suche", "bidirektionales Matching", "Agent zu Agent", "Forschung", "Messung", "Gegenprobe", "offene Daten", "Ed25519", "Spore", "Signatur", "Handshake", "Anastomose", "Heterokaryose", "Apoptose", "Membran", "Siegel", "Rendezvous", "Relais", "Schlüssel-Safe", "server-los", "offline-first", "ohne Cloud", "Empfangsmodus", "Datenschutz", "Progressive Web App", "Forker", "Mit-Bauer", "Schwesternetz-Beobachtungen", "Sitzungs-Briefe", "Übergabeprotokolle"],
    stammCategories: ["Protokoll-Doku", "Mycel-Vokabular", "Heilige Tafeln", "Karten", "INTERFACES", "ARCHITEKTUR"],
    guestCategories: ["Glossar-Wartung", "Schwesternetz-Beobachtungen", "Sitzungs-Briefe", "Übergabeprotokolle"],
    backupPrefix: "sage-backup",   // Dateiname-Präfix des verschlüsselten Backups
  };
})();
