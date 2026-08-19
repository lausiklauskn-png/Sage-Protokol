#!/usr/bin/env bash
# Gegenprobe zum Melde-Weg der Pinnwand (pinnwand/index.html).
#
# WOZU: `smoke_pinnwand_melden.mjs` war beim ERSTEN Lauf grün — 49 von 49. Das
# ist der Moment, in dem man am genauesten hinsehen muss, nicht der, in dem man
# aufhört. Ein Wächter ohne Gegenprobe ist nur ein grüner Haken.
#
# Diese Datei baut jeden Fehler wirklich in die AUSGELIEFERTE Seite ein, den die
# Probe fangen soll, und sieht nach, ob sie dann auch umfällt. Danach wird die
# Seite aus einer Sicherung zurückgeholt — auch bei Abbruch (trap).
#
# Aufruf: bash tests/gegenprobe_pinnwand_melden.sh   ·   Exit 0 = jeder gefangen.
set -u
cd "$(dirname "$0")/.."

SICHER="$(mktemp -d)"
cp pinnwand/index.html "$SICHER/"
zurueck() { cp "$SICHER/index.html" pinnwand/index.html; }
trap 'zurueck; rm -rf "$SICHER"' EXIT INT TERM

gruen=0; rot=0

ersetze() {
  python3 - "$1" "$2" "$3" <<'PY'
import sys
datei, alt, neu = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(datei, encoding='utf-8').read()
if alt not in s:
    sys.stderr.write('Muster nicht gefunden: ' + alt[:70] + '\n')
    sys.exit(1)
open(datei, 'w', encoding='utf-8').write(s.replace(alt, neu, 1))
PY
}
loesche() { ersetze "$1" "$2" ""; }

# KEIN `| tail` — über grün entscheidet nur der eigene Rückgabewert.
probe_gruen() { node tests/smoke_pinnwand_melden.mjs >/dev/null 2>&1; }

probe() {
  local was="$1"; shift
  "$@" || { echo "  ✗ $was — der Eingriff selbst ist fehlgeschlagen"; rot=$((rot+1)); zurueck; return; }
  if probe_gruen; then
    echo "  ✗ $was — die Probe blieb GRÜN, das ist unbewacht"
    rot=$((rot+1))
  else
    echo "  ✓ $was — gefangen"
    gruen=$((gruen+1))
  fi
  zurueck
}

echo "== Gegenprobe · Pinnwand-Melde-Weg =="
echo ""

D=pinnwand/index.html

# ── Der teuerste Fehler: eine behauptete statt gemessene Ausfüllzeit ────────
# Genau das stand in Kimboard zuerst im Code (`Math.max(1700, …)`). Es hätte
# dem Dienst 1700 ms gemeldet, auch wenn nur 200 vergangen waren.
#
# BEIM ERSTEN LAUF BLIEB DIESER EINGRIFF UNGEFANGEN — und das war lehrreich:
# SOLANGE DIE WARTEZEIT DASTEHT, ÄNDERT `Math.max` NICHTS. Beim Absenden sind
# dann immer mindestens 1700 ms vergangen, die Schranke greift nie, echte und
# behauptete Zahl sind gleich. Kein Messaufbau der Welt kann die beiden
# auseinanderhalten, weil sie sich nicht unterscheiden.
#
# Gefährlich wird es erst in KOMBINATION: nimmt später jemand die Wartezeit
# heraus, meldet die App eine Zahl, die sie nie gemessen hat — und die Probe
# „der Riegel wird abgewartet" bliebe grün, weil die Zahl ja stimmt. Genau so
# ist es in Kimboard passiert.
#
# Deshalb ist der Wächter dagegen ein QUELLTEXT-Wächter: die Zahl MUSS die
# schlichte Differenz sein. Was man nicht messen kann, muss man festschreiben.
probe "behauptete statt gemessene Ausfüllzeit" \
  ersetze "$D" "fp_elapsed: Date.now() - offenSeit" "fp_elapsed: Math.max(1700, Date.now() - offenSeit)"

# Und der Beweis, dass die Kombination wirklich das Loch ist: beides zusammen.
probe "Wartezeit weg UND behauptete Zahl (die Kimboard-Falle)" \
  ersetze "$D" "if (offen < 1700) await new Promise((r) => setTimeout(r, 1700 - offen));" ""

probe "der Bot-Riegel wird gar nicht abgewartet" \
  ersetze "$D" "if (offen < 1700) await new Promise((r) => setTimeout(r, 1700 - offen));" ""

probe "zu kurz gewartet (300 ms statt 1,7 s)" \
  ersetze "$D" "if (offen < 1700) await new Promise((r) => setTimeout(r, 1700 - offen));" \
               "if (offen < 300) await new Promise((r) => setTimeout(r, 300 - offen));"

# ── Der Inhalt darf das Gerät nicht verlassen ──────────────────────────────
probe "der beanstandete Inhalt wird mitgeschickt" \
  ersetze "$D" "nachricht: 'Absender-Kennung: '" "inhalt: ev.content, nachricht: 'Absender-Kennung: '"

# ── Gemeldet heißt gemeldet ────────────────────────────────────────────────
probe "ein Fehler wird als Erfolg verkauft" \
  ersetze "$D" "if (antwort.ok && j && j.ok) return { weg: 'dienst' };" "return { weg: 'dienst' };"

probe "ein freundliches 200 mit ok:false gilt als gemeldet" \
  ersetze "$D" "if (antwort.ok && j && j.ok)" "if (antwort.ok)"

probe "ein Netzfehler wird verschluckt" \
  ersetze "$D" "return { weg: 'fehler', grund: String(e && e.message ? e.message : e) };" "return { weg: 'dienst' };"

probe "der Grund des Dienstes wird unterschlagen" \
  ersetze "$D" "grund: (j && j.error) || ('HTTP ' + antwort.status)" "grund: 'unbekannt'"

# ── Fail-soft ──────────────────────────────────────────────────────────────
probe "ohne Dienst und ohne Adresse wird trotzdem gesendet" \
  ersetze "$D" "if (!k.endpunkt && !k.mail) return { weg: 'keiner' };" ""

probe "der Mail-Vordruck trägt die Kennung nicht" \
  ersetze "$D" "+ '&body=' + encodeURIComponent('Gemeldeter Zettel: ' + ev.id" "+ '&body=' + encodeURIComponent('Gemeldeter Zettel: ' + ('' "

probe "ohne Melde-Weg blendet es auch nicht mehr aus" \
  ersetze "$D" "  if (qViews.has(ev.id)) { hideQuestion(ev.id, (qViews.get(ev.id) || {}).li); return; }
  hidden.add(ev.id); saveHidden();" "  return;"

# ── Ausgeblendet bleibt ausgeblendet ───────────────────────────────────────
# Ohne diese Zeile käme eine gemeldete Antwort beim nächsten Laden zurück.
probe "gemeldete Antworten kommen nach dem Neuladen zurück" \
  loesche "$D" "  if (hidden.has(ev.id)) return;
  view.answerIds.add(ev.id);"

probe "die Ausblendung wird nicht dauerhaft gemerkt" \
  ersetze "$D" "  hidden.add(ev.id); saveHidden();" "  hidden.add(ev.id);"

probe "eine gemeldete Frage wird nicht aus der Anzeige genommen" \
  ersetze "$D" "if (qViews.has(ev.id)) { hideQuestion(ev.id, (qViews.get(ev.id) || {}).li); return; }" ""

probe "die Antwort bleibt in der Liste stehen" \
  ersetze "$D" "    if (i >= 0) view.answers.splice(i, 1);
    view.answerIds.delete(ev.id);" "    view.answerIds.delete(ev.id);"

probe "die Antwort verschwindet nicht aus der Anzeige" \
  ersetze "$D" "if (eintrag.li && eintrag.li.parentNode) eintrag.li.parentNode.removeChild(eintrag.li);
    return;" "return;"

# ── Verdrahtung ────────────────────────────────────────────────────────────
probe "das Fähnchen fehlt an der Frage" \
  loesche "$D" "  card.appendChild(meldeKnopf(ev, 'q-melden'));
"

probe "das Fähnchen fehlt an der Antwort" \
  loesche "$D" "  head.appendChild(meldeKnopf(ev, 'a-melden'));
"

probe "das Fähnchen der Antwort hat keine Gestaltung" \
  ersetze "$D" "  .a-melden {" "  .a-melden-unbenutzt {"

# ── Ein Ort der Wahrheit ───────────────────────────────────────────────────
# Ein zweiter Sperr-Weg von hier aus wäre der Anfang zweier Listen, die
# auseinanderlaufen. Gesperrt wird in Kimboard.
probe "die Pinnwand sperrt selbst (zweiter Ort der Wahrheit)" \
  ersetze "$D" "  admin.appendChild(adminTxt);" "  admin.appendChild(adminTxt); gesperrteZettel.add(ev.id);"

probe "der Betreiber-Bereich verschweigt, wo gesperrt wird" \
  ersetze "$D" "'Gesperrt wird in Kimboard — dort im Studio oder in '" "'Irgendwo. '+('"

# ── Der Schnitt selbst ─────────────────────────────────────────────────────
# Findet die Probe ihre Marken nicht, misst sie NICHTS. Sie darf dann nicht
# grün werden — das ist der Fehler, der eine Probe still macht.
probe "die Anfangsmarke des Blocks ist weg" \
  ersetze "$D" "// ---- Melde-Weg (Art. 16 DSA) ---" "// ---- Irgendwas ---"

probe "der Beschwerdeweg zeigt ins Leere" \
  ersetze "$D" "const MELDE_BESCHWERDEWEG = 'impressum.html';" "const MELDE_BESCHWERDEWEG = 'gibtesnicht.html';"

# ── Die Lage im Bild — nur die Browser-Probe kann das sehen ────────────────
# Der Fund, der diese Zeilen erzwungen hat: beide Knöpfe werden 32 px breit
# gezeichnet, nicht 24 (eine allgemeine `button`-Regel legt Innenabstand dazu,
# und `.q-del` sagt kein `box-sizing`). Mit dem gerechneten `right: 40px`
# überlappten sie sich um 2 px. Kein Nachrechnen hat das gefunden — erst das
# Ausmessen im Browser.
#
# Diese beiden Eingriffe kosten je einen Browser-Start (~5 s). Das ist der
# Preis dafür, dass „der Knopf ist da" nicht mehr nur behauptet ist.
probe_browser_gruen() { node pinnwand/_smoke_melden.mjs >/dev/null 2>&1; }

probe_b() {
  local was="$1"; shift
  "$@" || { echo "  ✗ $was — der Eingriff selbst ist fehlgeschlagen"; rot=$((rot+1)); zurueck; return; }
  if probe_browser_gruen; then
    echo "  ✗ $was — die Browser-Probe blieb GRÜN, das ist unbewacht"
    rot=$((rot+1))
  else
    echo "  ✓ $was — gefangen (Browser)"
    gruen=$((gruen+1))
  fi
  zurueck
}

probe_b "die Knöpfe überlappen sich wieder (der echte Fund)" \
  ersetze "$D" "right: calc(var(--x-rand) + var(--x-groesse) + var(--x-luft));" "right: 40px;"

probe_b "das Fähnchen wird unsichtbar gestellt" \
  ersetze "$D" "  .q-melden {
    position: absolute; top: 10px; height: 24px;" "  .q-melden {
    display: none !important;
    position: absolute; top: 10px; height: 24px;"

echo ""
echo "== $gruen gefangen, $rot ungefangen =="
exit $(( rot > 0 ? 1 : 0 ))
