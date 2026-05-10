# Modul 01 — Storage (IndexedDB-Wrapper)

**Status:** Schablone (Spec ausstehend)
**Datei (Code):** `src/modules/01_storage.js`
**Abhängigkeiten:** keine

---

## Zweck

Einheitlicher Zugriff auf IndexedDB für alle SBKIM-Module. Vermeidet,
dass jedes Modul eigene Open/Upgrade-Logik hat. Stellt sicher, dass die
SBKIM-Daten **getrennt** vom Endknoten-Anwendungs-Storage liegen
(Store-Präfix `sbkim_*`).

---

## Verantwortung

**Macht:**
- Datenbank `sbkim` öffnen, Versionen verwalten
- Stores anlegen (Liste in Spec)
- get/put/delete/getAll auf Stores
- Promise-basiertes API (kein Callback-IDB)

**Macht nicht:**
- Keine Anwendungslogik (welche Werte geschrieben werden, entscheidet
  das jeweilige Modul)
- Keine Verschlüsselung der Werte (Schlüsselablage ist Sache von Modul 02)
- Keine Migration aus dem Endknoten-Anwendungs-Storage (strikte Trennung)

---

## Schnittstelle

*(noch zu spezifizieren — Spec-Sitzung füllt aus)*

Vorgeschlagene Skizze:

```
init() → Promise<void>
  // öffnet/migriert die DB

getStore(storeName: string) → StoreHandle
get(storeName, key) → Promise<any | undefined>
put(storeName, key, value) → Promise<void>
del(storeName, key) → Promise<void>
all(storeName) → Promise<Array<{key, value}>>
clear(storeName) → Promise<void>
```

Stores (vorläufige Liste, in Spec zu finalisieren):

| Store | Zweck | Modul |
|---|---|---|
| `sbkim_keys` | privater/öffentlicher Ed25519-Schlüssel | 02 |
| `sbkim_spore` | eigene Spore | 02 |
| `sbkim_siblings` | Geschwisterknoten | 05 |
| `sbkim_anastomosis_log` | Handshake-Historie | 05 |
| `sbkim_legacy_inbox` | empfangene Vermächtnisse | 07 |
| `sbkim_doku_meta` | Letzter Sichttest pro Modul | 00 |

---

## Konfigurationswerte

```
SBKIM_STORE_PREFIX = "sbkim_"
```

---

## Manueller Test

1. `tests/manual_check.html` öffnen, Knopf "Storage init".
2. DevTools → Application → IndexedDB → `sbkim` muss vorhanden sein,
   alle erwarteten Stores angelegt.
3. Knopf "Storage round-trip": put → get → del. Erwartung: alle drei
   ohne Fehler, Wert nach del weg.

---

## Risiken / Edge Cases

- Privatmodus / inkognito: IDB kann unzugänglich sein → init muss sauber
  scheitern (return rejected Promise mit verständlicher Meldung), darf
  Hauptanwendung nicht abstürzen lassen.
- Versionsupgrade: bei künftigen Schema-Änderungen müssen alte Stores
  migriert werden, nicht überschrieben.
- Quotaüberschreitung: bei put → bewusst weiterreichen (kein Silent-Fail).

---

## Querverweise

- `sbkim_integration.md` §4.2 (Schlüsselablage)
- `sbkim_integration.md` §9 ("Keine Vermischung mit Hauptanwendungs-Storage")

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
