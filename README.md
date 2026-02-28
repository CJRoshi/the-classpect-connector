# The Classpect Connector

A fan-made reference tool for Homestuck classpects, built around the idea that classes and aspects can be mapped onto a numeric coordinate system — and that the resulting geometry reveals meaningful relationships between them.

Inspired by *Homestuck* by Andrew Hussie.

---

## Most Recent Update

Lock The Taskbar (2/28/2026):

- Changed some secret reactions to be unlockable
- Made Kankri Buggier

The "Fresh Coat" Update (2/24/2026):

- Added more clickable tags to help sort classpects
- (Each of these tags has its own index page)
- Massive overhauls of most pages to accomodate mobile users
- Lots of secrets and goodies
- One [S] page
- Made Kankri Buggier

### Hotfixes

- Hotfix 1 -- Site Logo Fix
- Hotfix 2 -- Tag Routing Fix


### Past Updates

Initial Release

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
├── about.html                  # About page
├── balanced.html               # Balanced classpects
├── canon.html                  # Canon classpects overview
├── symmetric.html              # Symmetric classpects
├── prospit.html                # Prospit dreamers
├── derse.html                  # Derse dreamers
├── theory.html                 # Extended theory notes
├── faq.html                    # FAQ
├── credits.html                # Credits
│
├── components/                 # Shared React components
│
├── tag/                        # Character tag pages (standalone HTML)
│
├── data/                       # JSON data files
│
├── images/                     # All static image assets
│
└── snd/                        # Sound effects
```
