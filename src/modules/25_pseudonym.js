/*
 * SBKIM — Modul 25 — Pseudonymisierung (E2E-Vertraulichkeit Grad B)
 *
 * Der „empfohlene Sofortweg" aus docs/E2E-VERTRAULICHKEIT.md §1.1: sensible
 * Werte in einer Nutzlast werden vor dem Versand durch lesbare Platzhalter-Token
 * ersetzt (`[[KUNDE_1]]`, `[[IBAN_1]]`, `[[EMAIL_1]]`), der Anker-Tresor
 * (Token → Klartext) bleibt getrennt und wird menschlich/separat übergeben.
 *
 * Verfassungstreu:
 *   - BUILD-FREI, keine neue Krypto-Primitive, KEIN Spore-Feld, protocolVersion
 *     bleibt 0.1. Der Briefkasten bleibt menschlich lesbar/auditierbar (§11.1),
 *     Struktur + Ed25519-Signatur bleiben prüfbar.
 *   - Kein Draht-Vertrag zwischen Modulen — reiner Text-/Objekt-Transform. Der
 *     Anker-Tresor verlässt den öffentlichen Kanal NIE (Aufrufer-Pflicht).
 *   - Fail-soft: NIE ein Throw außer InvalidPseudonymArgError bei klarer
 *     Aufrufer-Fehlbedienung (z.B. text ist kein String).
 *
 * Ehrliche Grenze (§1.1): Pseudonymisierung ≠ Verschlüsselung. Metadaten
 * (Anzahl Datensätze, Frequenz, Beträge, Korrelationsmuster) leaken weiter.
 * Für echte Korrelations-Sensibilität → Grad C (versiegelter Umschlag, B6).
 *
 * Public surface (registered on window.SbkimPseudonym):
 *   pseudonymize(text, options?)        -> { text, map, tokens }
 *   rehydrate(text, map)                -> text
 *   pseudonymizeObject(obj, options?)   -> { data, map, tokens }
 *   rehydrateObject(obj, map)           -> obj
 *   getBuiltinPatterns()                -> Array<{ type, description }>
 *   makeToken(type, index)              -> "[[TYPE_INDEX]]"
 *   parseToken(token)                   -> { type, index } | null
 *   isToken(str)                        -> boolean
 *   serializeVault(map)                 -> string   (Anker-Tresor, für Handover)
 *   parseVault(str)                     -> map
 *   InvalidPseudonymArgError            -> ErrorFactory (sync throw)
 *
 * Der Anker-Tresor (map) kann vom Aufrufer verschlüsselt at-rest abgelegt werden,
 * z.B. über Modul 20 SbkimSecret.putSecret — das ist NICHT Teil dieses Moduls
 * (Entkopplung). Dieses Modul liefert nur serializeVault/parseVault.
 *
 * Self-check: emits a console.info line on script load (synchronous).
 * Spec: docs/E2E-VERTRAULICHKEIT.md §1.1 · docs/components/25_pseudonym.md.
 */
(function (global) {
  "use strict";

  // Token-Form: [[TYP_INDEX]] — Typ = Großbuchstaben/Ziffern/Unterstrich, Index = Ziffern.
  var TOKEN_RE_SRC = "\\[\\[[A-Z][A-Z0-9_]*_\\d+\\]\\]";
  function tokenRe() { return new RegExp(TOKEN_RE_SRC, "g"); }

  // Eingebaute Erkenner. EMAIL + IBAN sind Standard; TEL ist opt-in (falsch-positiv-
  // anfällig bei langen Ziffernketten), daher NICHT im Default-`types`.
  var BUILTIN = {
    EMAIL: {
      description: "E-Mail-Adresse (name@host.tld).",
      re: function () { return /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g; },
    },
    IBAN: {
      description: "IBAN (kompakt oder in 4er-Gruppen mit Leerzeichen).",
      re: function () { return /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]){10,30}\b/g; },
    },
    TEL: {
      description: "Telefonnummer (lange Ziffernkette mit +/Leerzeichen/Trenner). Opt-in.",
      re: function () { return /\+?\d(?:[\d\s\/().-]{6,})\d/g; },
    },
  };
  var DEFAULT_TYPES = ["EMAIL", "IBAN"];

  function makeError(name, message) {
    var e = new Error(message);
    e.name = name;
    return e;
  }
  function InvalidPseudonymArgError(message) {
    return makeError("InvalidPseudonymArgError", message);
  }

  function isString(x) { return typeof x === "string"; }

  function makeToken(type, index) {
    if (!isString(type) || !/^[A-Z][A-Z0-9_]*$/.test(type)) {
      throw InvalidPseudonymArgError("Token-Typ muss GROSS beginnen: " + String(type));
    }
    if (typeof index !== "number" || index < 1 || Math.floor(index) !== index) {
      throw InvalidPseudonymArgError("Token-Index muss ganze Zahl ≥ 1 sein: " + String(index));
    }
    return "[[" + type + "_" + index + "]]";
  }

  function parseToken(token) {
    if (!isString(token)) return null;
    var m = /^\[\[([A-Z][A-Z0-9_]*)_(\d+)\]\]$/.exec(token);
    if (!m) return null;
    return { type: m[1], index: parseInt(m[2], 10) };
  }

  function isToken(str) {
    return isString(str) && new RegExp("^" + TOKEN_RE_SRC + "$").test(str);
  }

  // Regex-Sonderzeichen in Literalen entschärfen (für explizite `values`).
  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Wendet `transform` NUR auf Text-Segmente an, die KEIN bestehendes Token sind —
  // so werden schon gesetzte Token nie erneut erkannt/verschachtelt.
  function eachNonTokenSegment(text, transform) {
    var re = tokenRe();
    var out = "", last = 0, m;
    while ((m = re.exec(text))) {
      out += transform(text.slice(last, m.index));
      out += m[0];
      last = m.index + m[0].length;
    }
    out += transform(text.slice(last));
    return out;
  }

  // Zustand für einen Pseudonymisierungs-Lauf: stabile Token über die Map hinweg.
  function makeState(initialMap) {
    var map = {};          // token -> original
    var reverse = {};      // original -> token
    var counters = {};     // type -> höchster vergebener Index
    var created = [];      // in DIESEM Lauf neu erzeugte Token
    if (initialMap && typeof initialMap === "object") {
      Object.keys(initialMap).forEach(function (tok) {
        var orig = initialMap[tok];
        if (!isString(orig)) return;
        var p = parseToken(tok);
        if (!p) return;
        map[tok] = orig;
        reverse[orig] = tok;
        if (!counters[p.type] || p.index > counters[p.type]) counters[p.type] = p.index;
      });
    }
    return {
      map: map,
      // Gibt für einen Klartext-Treffer ein stabiles Token zurück (neu oder wiederverwendet).
      tokenFor: function (type, value) {
        if (Object.prototype.hasOwnProperty.call(reverse, value)) return reverse[value];
        var idx = (counters[type] || 0) + 1;
        counters[type] = idx;
        var tok = makeToken(type, idx);
        map[tok] = value;
        reverse[value] = tok;
        created.push(tok);
        return tok;
      },
      created: created,
    };
  }

  // Ersetzt in `text` alle Treffer von `re` (Typ `type`) durch stabile Token,
  // ohne bestehende Token anzufassen.
  function replaceByRegex(text, type, re, state) {
    return eachNonTokenSegment(text, function (seg) {
      return seg.replace(re, function (match) {
        return state.tokenFor(type, match);
      });
    });
  }

  // Normalisiert die `values`-Option auf [{ value, type }].
  function normalizeValues(options) {
    var values = options.values || [];
    var defaultType = options.valueType || "WERT";
    if (!Array.isArray(values)) {
      throw InvalidPseudonymArgError("options.values muss ein Array sein.");
    }
    var out = [];
    values.forEach(function (v) {
      if (v == null) return;
      if (isString(v)) {
        if (v.length) out.push({ value: v, type: defaultType });
      } else if (typeof v === "object" && isString(v.value) && v.value.length) {
        var t = v.type || defaultType;
        if (!/^[A-Z][A-Z0-9_]*$/.test(t)) {
          throw InvalidPseudonymArgError("values[].type muss GROSS beginnen: " + t);
        }
        out.push({ value: v.value, type: t });
      }
    });
    // Längste zuerst — verhindert, dass ein kürzerer Wert einen längeren zerschneidet.
    out.sort(function (a, b) { return b.value.length - a.value.length; });
    return out;
  }

  /*
   * pseudonymize(text, options?) -> { text, map, tokens }
   *   options.values       : Array<string | {value, type}>  — explizite Klartexte (z.B. Namen)
   *   options.valueType    : Default-Typ für string-values (Default "WERT")
   *   options.types        : eingebaute Erkenner (Default ["EMAIL","IBAN"]; "TEL" opt-in)
   *   options.customPatterns : Array<{type, regex}> — eigene Erkenner (global-Flag wird erzwungen)
   *   options.map          : bestehender Anker-Tresor → stabile Token über Läufe hinweg
   *
   * Reihenfolge (deterministisch): explizite values → EMAIL → IBAN → (TEL) → customPatterns.
   */
  function pseudonymize(text, options) {
    if (!isString(text)) {
      throw InvalidPseudonymArgError("pseudonymize(text): text muss ein String sein.");
    }
    options = options || {};
    var state = makeState(options.map);
    var out = text;

    // 1) Explizite Werte (höchste Priorität, z.B. Namen).
    var vals = normalizeValues(options);
    vals.forEach(function (entry) {
      var re = new RegExp(escapeRegExp(entry.value), "g");
      out = replaceByRegex(out, entry.type, re, state);
    });

    // 2) Eingebaute Erkenner in fester Reihenfolge.
    var types = options.types || DEFAULT_TYPES;
    if (!Array.isArray(types)) {
      throw InvalidPseudonymArgError("options.types muss ein Array sein.");
    }
    ["EMAIL", "IBAN", "TEL"].forEach(function (t) {
      if (types.indexOf(t) !== -1 && BUILTIN[t]) {
        out = replaceByRegex(out, t, BUILTIN[t].re(), state);
      }
    });

    // 3) Eigene Erkenner.
    var custom = options.customPatterns || [];
    if (!Array.isArray(custom)) {
      throw InvalidPseudonymArgError("options.customPatterns muss ein Array sein.");
    }
    custom.forEach(function (p) {
      if (!p || !isString(p.type) || !/^[A-Z][A-Z0-9_]*$/.test(p.type)) {
        throw InvalidPseudonymArgError("customPatterns[].type muss GROSS beginnen.");
      }
      if (!(p.regex instanceof RegExp)) {
        throw InvalidPseudonymArgError("customPatterns[].regex muss ein RegExp sein.");
      }
      var re = new RegExp(p.regex.source, p.regex.flags.indexOf("g") === -1 ? p.regex.flags + "g" : p.regex.flags);
      out = replaceByRegex(out, p.type, re, state);
    });

    return { text: out, map: state.map, tokens: state.created.slice() };
  }

  /*
   * rehydrate(text, map) -> text
   * Ersetzt Token wieder durch ihre Klartexte. Fail-soft: unbekannte Token bleiben stehen.
   */
  function rehydrate(text, map) {
    if (!isString(text)) {
      throw InvalidPseudonymArgError("rehydrate(text): text muss ein String sein.");
    }
    if (!map || typeof map !== "object") return text;
    return text.replace(tokenRe(), function (tok) {
      return Object.prototype.hasOwnProperty.call(map, tok) ? map[tok] : tok;
    });
  }

  // Tief-Klon mit Transform aller String-Blätter; teilt EINE state-Map über das Objekt.
  function walkStrings(value, fn) {
    if (isString(value)) return fn(value);
    if (Array.isArray(value)) return value.map(function (v) { return walkStrings(v, fn); });
    if (value && typeof value === "object") {
      var out = {};
      Object.keys(value).forEach(function (k) { out[k] = walkStrings(value[k], fn); });
      return out;
    }
    return value; // Zahlen/Booleans/null unverändert
  }

  /*
   * pseudonymizeObject(obj, options?) -> { data, map, tokens }
   * Wandert durch alle String-Blätter eines (verschachtelten) Objekts/Arrays und
   * pseudonymisiert sie mit EINER gemeinsamen Map (stabile Token über das Objekt).
   * Zahlen/Booleans/null bleiben unberührt (Grad-B-Grenze: Beträge leaken weiter).
   */
  function pseudonymizeObject(obj, options) {
    options = options || {};
    var sharedMap = options.map ? JSON.parse(JSON.stringify(options.map)) : {};
    var allTokens = [];
    var data = walkStrings(obj, function (str) {
      var res = pseudonymize(str, Object.assign({}, options, { map: sharedMap }));
      // sharedMap fortschreiben (pseudonymize klont die übergebene Map intern).
      Object.keys(res.map).forEach(function (t) { sharedMap[t] = res.map[t]; });
      res.tokens.forEach(function (t) { if (allTokens.indexOf(t) === -1) allTokens.push(t); });
      return res.text;
    });
    return { data: data, map: sharedMap, tokens: allTokens };
  }

  /*
   * rehydrateObject(obj, map) -> obj
   * Kehrt pseudonymizeObject um: alle String-Blätter zurück-ersetzen.
   */
  function rehydrateObject(obj, map) {
    return walkStrings(obj, function (str) { return rehydrate(str, map); });
  }

  function getBuiltinPatterns() {
    return Object.keys(BUILTIN).map(function (t) {
      return { type: t, description: BUILTIN[t].description, defaultOn: DEFAULT_TYPES.indexOf(t) !== -1 };
    });
  }

  // Anker-Tresor als Text (JSON) für separaten/menschlichen Handover. Enthält
  // KLARTEXT — NIE über den öffentlichen Kanal senden (Aufrufer-Pflicht).
  function serializeVault(map) {
    if (!map || typeof map !== "object") map = {};
    return JSON.stringify({ sbkimAnchorVault: 1, grade: "B", map: map }, null, 2);
  }
  function parseVault(str) {
    if (!isString(str)) throw InvalidPseudonymArgError("parseVault(str): str muss ein String sein.");
    var obj;
    try { obj = JSON.parse(str); }
    catch (e) { throw InvalidPseudonymArgError("parseVault: kein gültiges JSON."); }
    if (!obj || typeof obj !== "object" || !obj.map || typeof obj.map !== "object") {
      throw InvalidPseudonymArgError("parseVault: erwartet { map: {...} }.");
    }
    return obj.map;
  }

  var SbkimPseudonym = {
    pseudonymize: pseudonymize,
    rehydrate: rehydrate,
    pseudonymizeObject: pseudonymizeObject,
    rehydrateObject: rehydrateObject,
    getBuiltinPatterns: getBuiltinPatterns,
    makeToken: makeToken,
    parseToken: parseToken,
    isToken: isToken,
    serializeVault: serializeVault,
    parseVault: parseVault,
    InvalidPseudonymArgError: InvalidPseudonymArgError,
    _meta: {
      grade: "B",
      buildFree: true,
      protocolVersion: "0.1", // Grad B ändert NICHTS am Draht-Protokoll.
      builtinTypes: Object.keys(BUILTIN),
      defaultTypes: DEFAULT_TYPES.slice(),
      tokenPattern: TOKEN_RE_SRC,
      spec: "docs/E2E-VERTRAULICHKEIT.md §1.1",
    },
  };

  global.SbkimPseudonym = SbkimPseudonym;

  if (typeof console !== "undefined" && console.info) {
    console.info(
      "MODUL 25 PSEUDONYM (Grad B) bereit, Funktionen: pseudonymize/rehydrate/" +
        "pseudonymizeObject/rehydrateObject/serializeVault/parseVault, Default-Typen: " +
        DEFAULT_TYPES.join("+") + " (build-frei, protocolVersion 0.1 unverändert)",
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
