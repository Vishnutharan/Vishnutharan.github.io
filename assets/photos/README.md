# Photo slots

| Slot  | File                              | Where it shows            | Ideal size |
|-------|-----------------------------------|---------------------------|------------|
| hero  | `public/assets/photos/hero.webp`  | Hero, right of your name  | 800×1000 (4:5) |
| about | `public/assets/photos/about.webp` | About section             | 750×940 (4:5)  |

Until a file exists, an animated gradient placeholder is shown automatically.
Quick way: `python3 scripts/optimize_photos.py my-photo.jpg [second-photo.jpg]`
Paths can be changed in `src/content.js` → `person.photos`.
