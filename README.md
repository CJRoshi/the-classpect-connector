# The Classpect Connector

A fan-made reference tool for Homestuck classpects, built around the idea that classes and aspects can be mapped onto a numeric coordinate system — and that the resulting geometry reveals meaningful relationships between them.

Inspired by *Homestuck* by Andrew Hussie.

---

## Most Recent Updates

Glyphs Galore (8/24/2026):

- Added Classpect Glyphs to all Classpect Pages
- New Settings Page to Customize Things
- New Secrets?
- Improved Graphics and Assets
- Made Kankri Buggier

Scryer Sepulchre (5/26/2026):

- New Theory Coinciding with Scryer release

SEO Suffering (3/12/2026):

- Added a bunch of changes to make the site indexable and searchable

### Hotfixes

- Hotfix 1 (Planned) -- Day Zero Bugs
- Hotfix 2 (Planned) -- Merch Merch Merch

### Past Updates

- Initial Release
- The "Fresh Coat" Upd8
- Lock The Taskbar

## What It Does

The Classpect Connector lets you explore every combination of class and aspect from Homestuck, using a fun fan-extension of the system. For each classpect, you can read:

- A numeric value
- Some pairwise relationships between this classpect and others
- The **rotation graph**: a visual plot of how the classpect relates to its geometric rotations and reflection on a coordinate grid

You can also browse:

- **Class pages** — covering all canon classes (the two master and twelve standard classes)
- **Aspect pages** — covering all twelve aspects with flavor text and cross-links
- **Character tag pages** — curated pages grouping characters by session, storyline, or theme
- **Special pages** — Prospit/Derse alignment, balanced/symmetric classpects, theory notes, FAQ, and more
- **Search** — find any classpect, class, or aspect by name

## Code Structure

```plain
/
├── index.html                  # App shell + hash router
├── 404.html                    # Custom 404
├── about.html                  # About page
├── balanced.html               # Balanced classpects
├── canon.html                  # Canon classpects overview
├── symmetric.html              # Symmetric classpects
├── prospit.html                # Prospit dreamers
├── derse.html                  # Derse dreamers
├── theory.html                 # Extended theory notes
├── rungs.html                  # Rungs notes and views
├── faq.html                    # FAQ + Glossary
├── credits.html                # Credits
├── settings.html               # Sitewide settings (Polarity, glyph style, Secrets tracker)
│
├── components/                 # Shared React components
│
├── data/                       # JSON data files (aspects, classes, moons, characters, predictions)
│
├── fonts/                      # Bundled display font (Typostuck)
│
├── images/
│   ├── aspects/                # Aspect icons (no-bg + with-bg)
│   ├── classes/                # Class emblems (bg / no-bg / outline / rings)
│   ├── figures/                # Theory-page figures
│   ├── playericons-deco/       # Crowns, chevrons, player pawns
│   ├── special/                # Logos, OG-image, misc marks
│   └── tags/                   # Per-tag banner art
│
├── snd/                        # UI chimes (item-get, pester notif)
│
└── tag/                        # Standalone tag pages (Homestuck, Sburb A/B, Sgrub A/B,
                                #   Cherubs, Beyond Canon, Predictions, Influencers,
                                #   Hiveswap, OC Session)
```
