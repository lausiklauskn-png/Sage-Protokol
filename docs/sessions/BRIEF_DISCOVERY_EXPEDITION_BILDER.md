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

WICHTIG — Anspruch (Klaus 2026-06-23): das Ziel ist KEINE schlichte Markdown-Seite,
sondern eine eigene, sehr ansprechende DISCOVERY-EXPEDITIONS-SEITE, die der
Einladungs-Site in NICHTS nachsteht — eher besser. Begründung: es ist eine
Dokumentation der Schöpfung (der Schöpfer/Jehova soll gewürdigt werden). Lies
docs/components/_discovery_expedition.md § „Gestaltung & Hintergrund-Vision" —
die ist verbindlich (Kosmos → Element-Wanderung → Mycel → Pilz-Galerie, dezente
versteckte Botschaften, würdevoll/andeutend, WebGL three.js+GSAP wie die Einladung,
Tablet-tauglich + Reduced-Motion).

Auftrag (Phasen — je eigener Commit; bei zu großem Umfang in zwei Sitzungen teilen,
Bilder zuerst, Seite danach — eigenes Urteil):
1. Klaus' generierte Pilz-Bilder entgegennehmen (Chat/Upload). Pro Bild in
   assets/discovery/<pilz>.(webp|png) ablegen, sinnvoll benennen (mykorrhiza,
   physarum, radiotroph, weissfaeule, plastik, flechte, armillaria, biolumineszenz,
   ophiocordyceps, mitbauer, hyphendruck). Vernünftige Größe (Pillow:
   pip3 install pillow), Repo nicht aufblähen. Als „KI-generiert" kennzeichnen.
2. Bilder in docs/components/_discovery_expedition.md neben den jeweiligen
   Pilz-Eintrag einbetten (Bildunterschrift „KI-generiert").
3. DIE SEITE bauen — eine eigenständige, hochwertige HTML-Seite (z. B.
   docs/discovery/index.html), die die § Gestaltung & Hintergrund-Vision umsetzt:
   Kosmos-Tiefe → Element-Wanderung (Sternenstaub Richtung Erde) → Übergang in
   goldenes Mycel → Pilz-Galerie mit den Bildern + Staun-Texten + leisem SBKIM-
   Bezug; dezente, würdevolle „versteckte Botschaften". Werkzeug-Basis wie die
   Einladung (lokal vendoriertes three.js + GSAP). Performance + Reduced-Motion +
   Tablet (Galaxy Tab S6) beachten. Mindestens Einladungs-Qualität.
4. Optional/additiv: ein, zwei stärkste Motive + 2–3 Sätze in die Einladungs-Site
   (docs/einladung/) einweben — im bestehenden Stil, NICHT umbauen.
5. PULS + Übergabeprotokoll. Headless-Smokes grün halten (keine Modul-Logik).
   Klaus-Sichttest abwarten für die Seite (Browser, Tab S6).

Leitplanken:
- Doku + Assets + eigenständige Vision-Seite. KEIN Modul-Code, kein Protokoll-Bump.
- Keine PII. Bilder als „KI-generiert" kennzeichnen.
- Ton: würdevoll, staunend, ehrlich — wo Wissenschaft endet und Glaube beginnt,
  nichts behaupten, nur andeuten (wie in der Vision-Karte beschrieben).
- Discovery-MECHANIK (Verzeichnis/Gossip bauen) ist NICHT diese Sitzung — spätere
  Spec/Bau-Sitzung Modul 14. Hier Vision/Doku/Bilder/Seite.
```
