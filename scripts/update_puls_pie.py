#!/usr/bin/env python3
"""Aktualisiert den Mermaid-Pie-Block in docs/PULS.md aus status.json.

Aufruf:  python3 scripts/update_puls_pie.py

Liest status.json (modules + schutzBacklog + diffusionBacklog +
membranBacklog), zaehlt pro score-Wert und ersetzt den existierenden
```mermaid / pie showData / ...```-Block in docs/PULS.md. Datum kommt
aus status.json.lastUpdated.

Idempotent: mehrfacher Aufruf erzeugt keine Drift.

Pflicht: nach jedem status.json-Schreiben aufrufen, bevor committet
wird. Siehe CLAUDE.md, Block "Pflicht am Sitzungsende".
"""

import json
import re
import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
STATUS_PATH = REPO_ROOT / "status.json"
PULS_PATH = REPO_ROOT / "docs" / "PULS.md"

STATUS_ORDER = [
    ("schablone", "\U0001F7EB Schablone"),
    ("werkstatt", "\U0001F7E7 In Werkstatt"),
    ("spec",      "\U0001F7E8 Spec fertig"),
    ("stub",      "\U0001F7E6 Code-Stub"),
    ("fertig",    "\U0001F7E9 Fertig"),
]

PIE_RE = re.compile(
    r"```mermaid\npie showData\n  title [^\n]*\n(?:  \"[^\n]*\n)*```"
)


def count_statuses(status):
    counts = {key: 0 for key, _ in STATUS_ORDER}
    pool = (
        status.get("modules", [])
        + status.get("schutzBacklog", [])
        + status.get("diffusionBacklog", [])
        + status.get("membranBacklog", [])
    )
    for module in pool:
        score = module.get("score")
        if score not in counts:
            raise SystemExit(
                f"Unbekannter score-Wert '{score}' bei Modul {module.get('id')}"
            )
        counts[score] += 1
    return counts


def render_pie(counts, total, when):
    lines = [
        "```mermaid",
        "pie showData",
        f"  title Modulstand {when} ({total} Module)",
    ]
    for key, label in STATUS_ORDER:
        lines.append(f'  "{label}" : {counts[key]}')
    lines.append("```")
    return "\n".join(lines)


def main():
    status = json.loads(STATUS_PATH.read_text(encoding="utf-8"))
    counts = count_statuses(status)
    total = sum(counts.values())
    when = status.get("lastUpdated", date.today().isoformat())
    new_block = render_pie(counts, total, when)

    puls = PULS_PATH.read_text(encoding="utf-8")
    if not PIE_RE.search(puls):
        raise SystemExit(
            "Pie-Block in PULS.md nicht gefunden. Wurde die Struktur geaendert?"
        )

    new_puls = PIE_RE.sub(new_block, puls)
    if new_puls == puls:
        print(f"PULS-Pie ist bereits aktuell (Stand {when}, {total} Module).")
        return

    PULS_PATH.write_text(new_puls, encoding="utf-8")
    print(f"PULS-Pie aktualisiert (Stand {when}, {total} Module):")
    for key, label in STATUS_ORDER:
        print(f"  {label}: {counts[key]}")


if __name__ == "__main__":
    main()
