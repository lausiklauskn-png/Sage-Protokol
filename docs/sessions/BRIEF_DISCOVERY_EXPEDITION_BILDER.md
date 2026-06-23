# Brief — Folge-Sitzung: Discovery-Expedition Bildmaterial + Einladungs-Verfeinerung

> Angelegt 2026-06-23. Voraussetzung: Klaus hat aus den Bild-Prompts in
> [`docs/components/_discovery_expedition.md`](../components/_discovery_expedition.md)
> § „Bild-Prompts pro Pilz-Fähigkeit" Bilder generiert und an die Sitzung gegeben.

```
Du bist eine Bau-Sitzung in Sage-Protokol — „Discovery-Expedition: Bildmaterial".
Freibrief gilt (CLAUDE.md § Freibrief; eigene PRs selbstständig mergen, wenn
getestet + abgegrenzt). Klaus hat „merge ohne Rückfrage selbstständig" erlaubt.

Pflichtleseliste:
1. CLAUDE.md
2. docs/PULS.md (oberster Eintrag)
3. docs/components/_discovery_expedition.md  ← die Vision-Karte
4. docs/components/14_diffusion.md § Discovery / Expedition
5. docs/components/_vision_einladung.md + docs/einladung/index.html (nur betroffene Stellen)

Auftrag:
1. Klaus' generierte Pilz-Bilder entgegennehmen (er fügt sie in den Chat / Upload).
   Pro Bild: in assets/ ablegen (z. B. assets/discovery/<pilz>.webp oder .png),
   sinnvoll benennen (mykorrhiza, physarum, radiotroph, weissfaeule, plastik,
   flechte, armillaria, biolumineszenz, ophiocordyceps, mitbauer, hyphendruck).
   Wenn möglich auf vernünftige Größe bringen (Pillow ist installierbar:
   pip3 install pillow), damit das Repo nicht aufbläht.
2. Die Bilder in docs/components/_discovery_expedition.md neben den jeweiligen
   Pilz-Eintrag einbetten (Markdown-Bild + kurze Bildunterschrift/Quelle „KI-
   generiert").
3. Die Pilz-Erzählung in die Einladungs-Site verfeinern (docs/einladung/ —
   Schicht-1-Mycel-/Pilz-Sektion): ein bis zwei der stärksten Motive + 2–3 Sätze
   „was wir von den Pilzen lernen" einweben. NICHT die ganze Site umbauen —
   additiv, im bestehenden Stil (vgl. _vision_einladung.md).
4. PULS + Übergabeprotokoll. Headless-Smokes grün halten (keine Modul-Logik
   betroffen — reine Doku/Assets). Klaus-Sichttest abwarten für die Einladungs-Site.

Leitplanken:
- Nur Doku + Assets, KEIN Modul-Code, kein Protokoll-Bump.
- Keine PII in Bildunterschriften/Dateinamen.
- Bilder als „KI-generiert" kennzeichnen.
- Discovery-MECHANIK (Verzeichnis/Gossip bauen) ist NICHT diese Sitzung — das ist
  eine spätere Spec/Bau-Sitzung Modul 14. Hier nur Vision/Doku/Bilder.
```
