#!/usr/bin/env bash
# Gegenprobe zu tests/smoke_bau1617_sprache.mjs.
#
# Ein Waechter ohne Gegenprobe ist nur ein gruener Haken. Diese hier baut
# Fehler ein — jeder MUSS die Probe umwerfen, und zwar mit dem Namen SEINER
# Zusicherung in der roten Zeile.
#
# GEARBEITET WIRD AN EINER WEGWERF-KOPIE. Die echten Dateien werden nie
# angefasst: ein abgebrochener Lauf soll kein sabotiertes Modul im Depot
# hinterlassen (dieselbe Bauart wie gegenprobe_bau23_sprache.sh).
#
# ⚠ HINZUFUEGEN STATT AENDERN, wo immer es geht. Nimmt man einer Zeile ihr
# T() weg, verliert damit zugleich ihr Schluessel seine Fundstelle — dann
# feuert der Nachbar-Waechter zuerst, und der gemeinte bleibt ungemessen.
# Genau dieser Fehler ist beim 23er-Rollout zweimal passiert.
#
# Lauf:  bash tests/gegenprobe_bau1617_sprache.sh
set -u
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WURZEL="$(cd "$HIER/.." && pwd)"
KOPIE="$(mktemp -d)"
trap 'rm -rf "$KOPIE"' EXIT

mkdir -p "$KOPIE/src/modules" "$KOPIE/tests" "$KOPIE/docs"
# ⚠ DIE AUSGANGSLAGE IST AUCH EINE POSITIVLISTE. Abschnitt 4 der Probe liest
# seit dem 2026-09-14 (spaet) `docs/INTERFACES.md` — ohne diese Zeile ist die
# Kopie SCHON OHNE EINGRIFF rot, und dann misst die ganze Gegenprobe nichts.
# Genau so beim ersten Lauf passiert; die Ausgangslage-Pruefung hat es gefangen.
frisch() {
  cp "$WURZEL/src/modules/16_siegel.js"          "$KOPIE/src/modules/"
  cp "$WURZEL/src/modules/17_floating_widget.js" "$KOPIE/src/modules/"
  cp "$WURZEL/tests/smoke_bau1617_sprache.mjs"   "$KOPIE/tests/"
  cp "$WURZEL/docs/INTERFACES.md"                "$KOPIE/docs/"
}

gefangen=0; durch=0; tot=0

# saboten <datei-relativ> <beschreibung> <alt> <neu>
saboten() {
  local rel="$1" was="$2" alt="$3" neu="$4"
  frisch
  if ! python3 - "$KOPIE/$rel" "$alt" "$neu" <<'PY'
import sys, io
d, a, n = sys.argv[1], sys.argv[2], sys.argv[3]
s = io.open(d, encoding="utf-8").read()
if a not in s: raise SystemExit(3)
io.open(d, "w", encoding="utf-8").write(s.replace(a, n, 1))
PY
  then echo "  ✗ $was → ANKER NICHT GEFUNDEN (misst nichts)"; tot=$((tot+1)); return; fi
  if (cd "$KOPIE" && node tests/smoke_bau1617_sprache.mjs > /tmp/gp1617.txt 2>&1); then
    echo "  ✗ $was → gruen geblieben, NICHT GEFANGEN"; durch=$((durch+1))
  else
    echo "  ✓ $was → rot: $(grep -m1 '✗' /tmp/gp1617.txt | sed 's/^ *//' | cut -c1-92)"; gefangen=$((gefangen+1))
  fi
}

echo "═══ Ausgangslage ═══"
frisch
if (cd "$KOPIE" && node tests/smoke_bau1617_sprache.mjs > /tmp/gp1617_0.txt 2>&1); then
  echo "  ✓ die Kopie ist ohne Eingriff gruen"
else
  echo "  ✗ die Kopie ist SCHON OHNE EINGRIFF rot — die Gegenprobe misst nichts."
  grep '✗' /tmp/gp1617_0.txt | head -3; exit 1
fi

M16=src/modules/16_siegel.js
M17=src/modules/17_floating_widget.js
PROBE=tests/smoke_bau1617_sprache.mjs

echo; echo "═══ A · das Woerterbuch gegen den Code ═══"
# Der stille Verfall, gegen den der ganze Waechter gebaut ist.
saboten "$M16" "16: ein deutscher Satz aendert sich, der Eintrag bleibt" \
  'T("Pflicht-Module")' 'T("Pflicht-Module der App")'
saboten "$M17" "17: ein Lampen-Etikett aendert sich, der Eintrag bleibt" \
  '    verkehr: "verkehr",' '    verkehr: "netzverkehr",'
# Umgekehrt: ein neuer Text ohne Uebersetzung.
saboten "$M16" "16: ein T()-Aufruf ohne englische Fassung" \
  'T("Pflicht-Module")' 'T("Pflicht-Module") + T("Ein Satz ohne Uebersetzung")'
saboten "$M17" "17: ein T()-Aufruf ohne englische Fassung" \
  'T("Schließen")' 'T("Schließen") + T("Noch ein Satz ohne Uebersetzung")'
# Eine „Uebersetzung", die das Deutsche nur abschreibt, ist keine.
# ⚠ Genommen wird ein Text, den der LAUFZEIT-Teil NICHT prueft — sonst faellt
# jener zuerst und der Kopie-Waechter bleibt ungemessen.
saboten "$M16" "16: eine Uebersetzung ist nur eine Kopie des Deutschen" \
  '"Attested: —",' '"Bezeugt: —",'
saboten "$M17" "17: eine Uebersetzung ist nur eine Kopie des Deutschen" \
  '"Richtung":     "Direction",' '"Richtung":     "Richtung",'

echo; echo "═══ B · die DATEN-Tabellen ═══"
# ⚠ DAS IST DIE BLINDSTELLE VON A, und sie ist die teurere: ein NEU
# HINZUGEFUEGTER Aspekt ohne Uebersetzung taucht in keiner der beiden Mengen
# von A auf. Und genau das wird passieren — CLAUDE.md § Sicherheits-Module
# pflegen Aspekte verpflichtet jede Schutz-Modul-Sitzung, hier anzuhaengen.
saboten "$M16" "16: ein NEUER Aspekt-Eintrag ohne englische Fassung" \
  '  var ZERTIFIKAT_ASPEKTE = [
    {' '  var ZERTIFIKAT_ASPEKTE = [
    {
      since:       "2026-09-14",
      module:      "99",
      aspect:      "Ein frischer Aspekt ohne Uebersetzung",
      description: "Er wurde angehaengt und niemand hat ihn uebersetzt.",
    },
    {'
saboten "$M16" "16: ein Aspekt-TEXT aendert sich in den Daten" \
  'aspect:      "Relais-Client gehört zur Selbst-Prüfung",' \
  'aspect:      "Der Relais-Client gehört zur Selbst-Prüfung",'
saboten "$M16" "16: ein deutscher Modul-NAME verliert seine Fassung" \
  '{ id: "15", name: "Membran",' '{ id: "15", name: "Membrane-Modul",'
saboten "$M17" "17: ein Tooltip aendert sich in den Daten" \
  'siegel:  "SBKIM-Siegel — Modul 16 Self-Inscribing-Bezeugung. Klick öffnet Aspekte-Modal.",' \
  'siegel:  "SBKIM-Siegel — Modul 16 Self-Inscribing-Bezeugung. Tipp öffnet Aspekte-Modal.",'

echo; echo "═══ C · zur Laufzeit ═══"
saboten "$M16" "16: init({lang}) wird nicht mehr gelesen" \
  '    if (opts.lang === "de" || opts.lang === "en") optLang = opts.lang;' \
  '    /* abgeschaltet */'
saboten "$M17" "17: init({lang}) wird nicht mehr gelesen" \
  '    if (opts.lang === "de" || opts.lang === "en") optLang = opts.lang;' \
  '    /* abgeschaltet */'
# Ohne <html lang> bliebe das Siegel in neunzehn Apps deutsch, obwohl die
# Seite englisch ist — sie muessten alle erst init({lang}) nachruesten.
saboten "$M16" "16: <html lang> wird nicht mehr gelesen" \
  '      if (l === "en") return "en";' '      if (false) return "en";'
saboten "$M17" "17: <html lang> wird nicht mehr gelesen" \
  '      if (l === "en") return "en";' '      if (false) return "en";'
saboten "$M16" "16: T() gibt immer den deutschen Satz zurueck" \
  '    if (sprache() !== "en") return de;' '    return de;'
saboten "$M17" "17: T() gibt immer den deutschen Satz zurueck" \
  '    if (sprache() !== "en") return de;' '    return de;'
# DIE GEGENRICHTUNG, und sie ist die wichtigere: neunzehn Apps duerfen von
# dieser Aenderung nichts merken, solange sie nichts einstellen.
saboten "$M16" "16: es wird IMMER uebersetzt, auch ohne Einstellung" \
  '    return "de";
  }

  /* Bei JEDEM Aufruf' '    return "en";
  }

  /* Bei JEDEM Aufruf'
saboten "$M17" "17: es wird IMMER uebersetzt, auch ohne Einstellung" \
  '    return "de";
  }

  /* Der einzige Ort' '    return "en";
  }

  /* Der einzige Ort'
# Ein unbekannter Wert darf die Seiten-Sprache NICHT schlagen.
saboten "$M16" "16: lang:'ru' setzt hart auf Deutsch zurueck" \
  '    if (opts.lang === "de" || opts.lang === "en") optLang = opts.lang;' \
  '    if (typeof opts.lang === "string") optLang = (opts.lang === "en") ? "en" : "de";'
# Die DATEN gehen nicht mehr durch T() — dreizehn deutsche Absaetze mitten im
# englischen Modal. Kein Wörterbuch-Waechter sieht das; nur der Laufzeit-Teil.
saboten "$M16" "16: die Aspekte-Daten gehen wieder an T() vorbei" \
  'desc.textContent = T(a.description);' 'desc.textContent = a.description;'
saboten "$M16" "16: der Aspekt-TITEL geht wieder an T() vorbei" \
  'aspect.textContent = "· " + T(a.aspect);' 'aspect.textContent = "· " + a.aspect;'

echo; echo "═══ D · geht jeder Anzeigetext durch T()? ═══"
# ⚠ DIESER BLOCK MISST DIE BLINDSTELLE VON A. Ein Text, der GAR NICHT durch
# T() geht, kommt weder im Woerterbuch noch unter den T()-Aufrufen vor — fuer
# A ist er unsichtbar. Genau so blieben beim 23er-Rollout 52 Stellen deutsch,
# waehrend A gruen meldete.
saboten "$M16" "16: ein Anzeigetext geht wieder an T() vorbei" \
  'modulesHeader.textContent = T("Pflicht-Module");' \
  'modulesHeader.textContent = T("Pflicht-Module"); modulesHeader.title = "Ein Anzeigetext ohne Haken";'
saboten "$M17" "17: ein Anzeigetext geht wieder an T() vorbei" \
  'tip.textContent = T("RAM-only FIFO — Tab-Reload leert die Liste.");' \
  'tip.textContent = T("RAM-only FIFO — Tab-Reload leert die Liste."); tip.title = "Noch ein Anzeigetext ohne Haken";'

echo; echo "═══ E · die Probe selbst ═══"
# Was in Abschnitt D wirklich die Arbeit tut, ist der VORFILTER: nur Zeilen
# mit einer Anzeige-Zuweisung kommen ueberhaupt in die innere Schleife. Faellt
# er weg, meldet der Waechter CSS, Tag-Namen und Ereignis-Namen als Fehler und
# verbietet damit das Richtige.
#
# ⚠ HIER STAND EIN FALL ZUM CSS-FILTER, und er ist am 2026-09-14 herausgeflogen,
# weil er NICHTS GEMESSEN HAT: abgeschaltet blieb die Probe gruen (0 vor, 0
# nach). In 16 und 17 entsteht CSS ueber style.cssText-Arrays und buildCss() —
# also auf Zeilen, die der Vorfilter gar nicht erst durchlaesst. Der Filter war
# aus der 23er-Probe mitkopiert und dort noetig; hier war er ein gruener Haken.
# Ein Riegel, den keine Gegenprobe von seinem Fehlen unterscheiden kann, ist
# eine Behauptung — also raus, und an seine Stelle der Fall, der wirklich misst.
saboten "$PROBE" "der Vorfilter faellt weg — der Waechter verbietet das Richtige" \
  '    if (!/(textContent|innerText|innerHTML|\.title\s*=|\.placeholder\s*=|\.alt\s*=|aria-label)/.test(s)) return;' \
  '    if (false) return;'
# Und der Wichtigste: ohne das Aufklappen des Modals misst der ganze
# Laufzeit-Teil von Modul 16 eine LEERE Zeichenkette und ist trivial gruen.
# Genau das war beim ersten Lauf dieser Probe der Fall.
saboten "$PROBE" "das Modal wird nicht mehr geoeffnet — alles darunter misst nichts" \
  '  if (badge) badge.click();' '  if (badge && false) badge.click();'

echo
echo "═══ F · das Wappen gegen die Tafel (Abschnitt 4) ═══"
# ⚠ HINZUFUEGEN STATT AENDERN. Wer einen vorhandenen Wappen-Text UMBENENNT,
# faellt zugleich aus der Tafel — dann feuert derselbe Waechter, aber aus dem
# anderen Grund, und man weiss nicht, welche Haelfte gemessen wurde. Ein NEU
# eingehaengter <text> ist der Fall, um den es wirklich geht: genau so kommt
# ein deutscher Satz kuenftig ins Wappen.
saboten "src/modules/16_siegel.js" \
  "ein NEUER deutscher Text kommt ins Wappen, ohne in der Tafel zu stehen" \
  '>SBKIM<' '>SBKIM</text><text>GEPRUEFTE URKUNDE<'

# Die Gegenrichtung: das Wappen bleibt, die Tafel verliert ihren Eintrag. Ohne
# diesen Fall waere nicht gemessen, dass der Waechter die TAFEL wirklich liest —
# er koennte gegen eine fest verdrahtete Liste pruefen und saehe gleich aus.
saboten "docs/INTERFACES.md" \
  "die Tafel verliert einen Wappen-Text — der Abgleich muss ihn vermissen" \
  'OFFIZIELLE BESTÄTIGUNG → OFFICIAL ATTESTATION' \
  'OFFIZIELLE BESTAETIGUNG -> hier stand er einmal'

# ══ Seit das Wappen mitspricht (Klaus 2026-09-14) ═══════════════════════════
# Ein Eintrag OHNE englische Fassung bleibt auf Englisch STILL deutsch stehen:
# T() gibt ihn unveraendert zurueck, die Ersetzung entfaellt, nichts faellt auf.
# ⚠ BEIDE FOLGENDEN FAELLE MUSSTEN GESCHAERFT WERDEN. Die erste Fassung
# benannte den Woerterbuch-Schluessel um — damit verlor er zugleich seine
# Fundstelle im Code, und ABSCHNITT 1 feuerte zuerst („1 tot"). Gefangen war
# der Fall, gemessen hatte er den Nachbarn. Dieselbe Falle wie oben im Kopf
# beschrieben, beim ersten Lauf prompt zugeschnappt.
#
# Geschaerft ueber "SBKIM": es steht wirklich im Wappen und hat mit Absicht
# KEINEN Woerterbuch-Eintrag — also faellt genau der gemeinte Waechter.
saboten "src/modules/16_siegel.js" \
  "ein WAPPEN_TEXTE-Eintrag ohne englische Fassung (der Eigenname)" \
  'var WAPPEN_TEXTE = ["OFFIZIELLE BESTÄTIGUNG", "SIEGEL"];' \
  'var WAPPEN_TEXTE = ["OFFIZIELLE BESTÄTIGUNG", "SIEGEL", "SBKIM"];'

# Der Waechter von Abschnitt 4 LIEST nur; dieser hier faellt nur, wenn das
# gerenderte Wappen wirklich gemessen wird (4b).
saboten "src/modules/16_siegel.js" \
  "renderWappenSvg() fuehrt die Texte nicht mehr durch T() — auf Englisch bleibt es deutsch" \
  '      svg = svg.replace(">" + de + "<", ">" + escapeXmlText(uebersetzt) + "<");' \
  '      svg = svg;'

# Ein Eintrag, der im Wappen gar nicht vorkommt, ist tot — er wuerde nie
# ersetzt, und niemand saehe es.
# Und die Gegenrichtung, ebenfalls geschaerft: „Pflicht-Module" HAT eine
# englische Fassung, steht aber nicht im Wappen. Damit kann nur noch der
# GENAU-EINMAL-Waechter fallen — ein frei erfundenes Wort haette zuerst den
# Woerterbuch-Waechter umgeworfen und nichts ueber diesen hier gesagt.
saboten "src/modules/16_siegel.js" \
  "ein WAPPEN_TEXTE-Eintrag steht gar nicht im Wappen (ist also tot)" \
  'var WAPPEN_TEXTE = ["OFFIZIELLE BESTÄTIGUNG", "SIEGEL"];' \
  'var WAPPEN_TEXTE = ["OFFIZIELLE BESTÄTIGUNG", "SIEGEL", "Pflicht-Module"];'

# ⚠ KEIN FALL zur Abbruch-Bedingung `if (uebersetzt === de) continue;`, und
# das ist eine BENANNTE GRENZE statt einer Luecke: nimmt man sie weg, laeuft
# auf Deutsch ein replace(">X<", ">X<") — dasselbe Ergebnis, byte-genau. Der
# Fall waere IMMER „nicht gefangen", ohne dass der Waechter etwas falsch
# macht. Ein Fall, der nichts messen kann, sieht aus wie Deckung.

frisch
echo
echo "$gefangen gefangen · $durch durchgerutscht · $tot tote Anker"
[ "$durch" -eq 0 ] && [ "$tot" -eq 0 ] || exit 1
