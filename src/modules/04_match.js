/*
 * SBKIM — Modul 04 — Match
 *
 * Skalarprodukt zweier L2-normalisierter Float32Array(384). Bei korrekt
 * normalisierten Eingaben aus Modul 03 ist das identisch zur Cosinus-
 * Aehnlichkeit. Reine Funktion, kein async, kein Zustand.
 *
 * Public surface (registered on window.SbkimMatch):
 *   match(queryVec, passageVec) -> number
 *   isAboveProviderThreshold(score) -> boolean
 *   matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds) -> MatchDimensionsResult
 *   PROVIDER_MIN_MATCH -> number   (0.80, gespiegelt aus INTERFACES.md §0)
 *   SCHICHT_MIN_MATCH -> number    (0.60, Bau 04.A, gespiegelt aus INTERFACES.md §0)
 *   DimensionsAllNullError -> ErrorFactory
 *
 * Self-check: emits a console.info line on script load (synchronous,
 * before any call). Modul 04 has no async load step. See INTERFACES.md
 * and docs/components/04_match.md for the binding spec.
 *
 * Bau 04.A `matchDimensions` synchron (2026-05-19): drei orthogonale
 * Schichten (fachlich / prozess / skalierung) gemäß Brief 03 / M04-
 * Erweiterung. In Stufe A sind die drei Schichten eine Heuristik über
 * demselben Embedding-Raum: alle drei ergeben denselben Lane-Cosinus
 * (siehe Karte 04 § Drei-Schichten-Modell „Aufteilung in drei
 * Schichten"). Die echte semantische Differenzierung passiert in
 * Stufe B via `explainMatchLLM` — eigene Folge-Sitzung Bau 04.B.
 * `BridgeProposal` (Brief 03 § Brücken-Feld-Spec) wird NUR von
 * Stufe B befüllt; Bau 04.A liefert `bruecke: null`.
 */
(function (global) {
  "use strict";

  var EMBEDDING_DIM = 384;
  var PROVIDER_MIN_MATCH = 0.80;
  // Bau 04.A (2026-05-19): pro-Dimension-Schwelle aus § 0 (Brief 03).
  // Eine Schicht unter SCHICHT_MIN_MATCH ist erlaubt (typischer
  // Brücken-Anlass); 2+ Schichten unter SCHICHT_MIN_MATCH triggern
  // Apoptose im Aufrufer (siehe Karte 04 § Schwellen-Vertrag).
  var SCHICHT_MIN_MATCH = 0.60;
  // Bau 04.A: Read-Anker für Tests + Doku-Kommentar im _meta-Block.
  var MATCH_DIMENSIONS_LANES = ["fachlich", "prozess", "skalierung"];

  function makeError(name, message, cause) {
    var e = new Error(message);
    e.name = name;
    if (cause !== undefined) e.cause = cause;
    return e;
  }

  // Bau 04.A: Factory für den synchronen Wurf, wenn alle vier
  // Vektoren null sind. Aufrufer hätte vor dem Aufruf prüfen müssen
  // (siehe Karte 04 § Fehlerverhalten).
  function DimensionsAllNullError(message) {
    return makeError("DimensionsAllNullError", message);
  }

  function describe(vec) {
    if (vec === null) return "null";
    if (vec === undefined) return "undefined";
    var ctor = vec && vec.constructor && vec.constructor.name;
    return ctor || typeof vec;
  }

  function assertVector(vec, paramName) {
    if (!(vec instanceof Float32Array)) {
      throw makeError(
        "InvalidVectorError",
        "Parameter '" + paramName + "' muss Float32Array sein, war: " + describe(vec) + ". " +
          "Modul 04 erwartet Vektoren von Modul 03 (Float32Array, Laenge " + EMBEDDING_DIM + ", L2-normalisiert).",
      );
    }
    if (vec.length !== EMBEDDING_DIM) {
      throw makeError(
        "ShapeMismatchError",
        "Parameter '" + paramName + "' hat Laenge " + vec.length + ", erwartet " + EMBEDDING_DIM + ". " +
          "Wahrscheinliche Ursache: Vektor aus anderer Modell-Version. Siehe INTERFACES.md §0 EMBEDDING_DIM.",
      );
    }
  }

  function match(queryVec, passageVec) {
    assertVector(queryVec, "queryVec");
    assertVector(passageVec, "passageVec");
    // Length equality is implied by both being EMBEDDING_DIM. We still
    // guard explicitly in case the constant ever drifts between modules.
    if (queryVec.length !== passageVec.length) {
      throw makeError(
        "ShapeMismatchError",
        "Vektor-Laengen unterscheiden sich: queryVec=" + queryVec.length + ", passageVec=" + passageVec.length + ".",
      );
    }
    var sum = 0;
    for (var i = 0; i < queryVec.length; i++) {
      sum += queryVec[i] * passageVec[i];
    }
    return sum;
  }

  function isAboveProviderThreshold(score) {
    return score >= PROVIDER_MIN_MATCH;
  }

  // Bau 04.A: null-safe wrapper um match(). Returns null, wenn eine
  // Seite null ist; sonst delegiert an match() mit voller Validierung
  // (InvalidVectorError / ShapeMismatchError werden hochgereicht).
  function cosineSafe(a, b) {
    if (a === null || b === null) return null;
    return match(a, b);
  }

  // Bau 04.A: matchDimensions — drei orthogonale Schichten + overall.
  // Berechnung gemäß Karte 04 § Drei-Schichten-Modell:
  //
  //   Lane 1 (queryCap × passageNeeds): A bietet → B sucht.
  //     Berechenbar wenn queryCap != null UND passageNeeds != null.
  //   Lane 2 (queryNeeds × passageCap): A sucht ← B bietet.
  //     Berechenbar wenn queryNeeds != null UND passageCap != null.
  //
  //   availableLanes = Anzahl berechenbarer Lanes ∈ {0, 1, 2}.
  //   Schicht-Score:
  //     beide Lanes berechenbar → Mittelwert der zwei Lane-Cosinus
  //     genau eine Lane → Single-Lane-Wert
  //     keine Lane → null
  //   In Stufe A sind alle drei Schichten (fachlich/prozess/
  //   skalierung) identisch dem Schicht-Score (Heuristik — die echte
  //   Differenzierung kommt in Stufe B / Bau 04.B via explainMatchLLM).
  //   overall = Mittelwert der nicht-null Schichten; in Stufe A also
  //   gleich dem Schicht-Score, weil alle drei identisch sind.
  //
  // Vor-Checks:
  //   alle vier null → DimensionsAllNullError SYNCHRON.
  //   eine Seite vollständig null (queryCap UND queryNeeds null ODER
  //     passageCap UND passageNeeds null) → Nur-Anbieter-Modus:
  //     alle Schichten null, availableLanes:0, kein Throw.
  function matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds) {
    var qCapNull = queryCap === null;
    var qNeedsNull = queryNeeds === null;
    var pCapNull = passageCap === null;
    var pNeedsNull = passageNeeds === null;

    if (qCapNull && qNeedsNull && pCapNull && pNeedsNull) {
      throw DimensionsAllNullError(
        "matchDimensions: alle vier Vektoren null. Aufrufer haette vor dem Aufruf pruefen muessen " +
          "(siehe Karte 04 § Fehlerverhalten + § Drei-Schichten-Modell § Nur-Anbieter-Modus).",
      );
    }

    var qFullNull = qCapNull && qNeedsNull;
    var pFullNull = pCapNull && pNeedsNull;
    if (qFullNull || pFullNull) {
      // Nur-Anbieter-Modus: eine Seite hat gar keine Vektoren.
      // Aufrufer faellt auf match(domainVectorA, domainVectorB) zurueck.
      return {
        fachlich: null,
        prozess: null,
        skalierung: null,
        overall: null,
        availableLanes: 0,
        bruecke: null,
      };
    }

    // Lane-Berechnung. cosineSafe gibt null zurueck, wenn eine Seite null.
    var lane1 = cosineSafe(queryCap, passageNeeds);   // A bietet → B sucht
    var lane2 = cosineSafe(queryNeeds, passageCap);   // A sucht ← B bietet

    var lanes = [];
    if (lane1 !== null) lanes.push(lane1);
    if (lane2 !== null) lanes.push(lane2);
    var availableLanes = lanes.length;

    var schichtScore;
    if (availableLanes === 0) {
      schichtScore = null;
    } else if (availableLanes === 1) {
      schichtScore = lanes[0];
    } else {
      schichtScore = (lanes[0] + lanes[1]) / 2;
    }

    // Stufe-A-Heuristik: alle drei Schichten ergeben denselben
    // Lane-Cosinus (Karte 04 § Drei-Schichten-Modell § „Aufteilung in
    // drei Schichten"). Stufe B (Bau 04.B) liefert die echte
    // Differenzierung via LLM.
    var fachlich = schichtScore;
    var prozess = schichtScore;
    var skalierung = schichtScore;

    // overall = Mittelwert der nicht-null Schichten. Da in Stufe A alle
    // drei Schichten identisch sind, ist overall gleich dem
    // Schicht-Score (oder null, wenn keine Lane berechenbar war).
    var overall = schichtScore;

    return {
      fachlich: fachlich,
      prozess: prozess,
      skalierung: skalierung,
      overall: overall,
      availableLanes: availableLanes,
      bruecke: null,  // Stufe B (Bau 04.B) befüllt das via explainMatchLLM
    };
  }

  var SbkimMatch = {
    match: match,
    isAboveProviderThreshold: isAboveProviderThreshold,
    matchDimensions: matchDimensions,
    PROVIDER_MIN_MATCH: PROVIDER_MIN_MATCH,
    SCHICHT_MIN_MATCH: SCHICHT_MIN_MATCH,
    DimensionsAllNullError: DimensionsAllNullError,
    _meta: {
      embeddingDim: EMBEDDING_DIM,
      providerMinMatch: PROVIDER_MIN_MATCH,
      schichtMinMatch: SCHICHT_MIN_MATCH,
      matchDimensionsLanes: MATCH_DIMENSIONS_LANES.slice(),
    },
  };

  global.SbkimMatch = SbkimMatch;

  // Self-check: emitted on script load (synchronous, no async load step).
  // Format is uniform across all SBKIM modules — see INTERFACES.md.
  // Bau 04.A erweitert die Funktions-Liste um matchDimensions; Schwellen-
  // Block nennt PROVIDER_MIN_MATCH und SCHICHT_MIN_MATCH.
  if (typeof console !== "undefined" && console.info) {
    console.info(
      "MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold/matchDimensions, " +
        "Schwellen: PROVIDER_MIN_MATCH=" + PROVIDER_MIN_MATCH +
        ", SCHICHT_MIN_MATCH=" + SCHICHT_MIN_MATCH,
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
