# Bundled asset library

All paths are relative to the skill root (`~/.claude/skills/ui-figma-roblox/`).

## 1. Kek UI Essentials — `assets/kek-ui-essentials/`

106 files (105 PNG, 1 WebP) from the user-supplied `KekUIEssentials.rar`. Full family counts and filenames: [ASSET-NOTES.md](../assets/kek-ui-essentials/ASSET-NOTES.md).

Most useful for stud UI:

| Need | File(s) |
| --- | --- |
| Repeating stud surface | `kek_stud.png` |
| Halftone fills / corners | `kek_circle_halftone_*.png`, `kek_square_halftone_*.png`, `kek_zoomed_halftone_1.png` |
| Sunburst behind a hero item | `kek_rays.webp`, `kek_light_*.png` |
| Sparkle / shine accents | `kek_sparkle_*.png`, `kek_spark_*.png` |
| Energy / action accents | `kek_slash_*.png`, `kek_speedlines_*.png`, `kek_flame_*.png`, `kek_smoke_*.png` |
| Decorative frames | `kek_chain_*.png`, `kek_circle_*.png`, `kek_design_*.png`, `quelly_spiral_*.png` |

## 2. UI Resources capture — `assets/ui-resources/`

Captured from `https://ui-resources.com/api/resources` (catalog dated 2026-10-13, 1134 records). Bundled: every direct `download_url` / `download_url2` file except two zip packs.

| Folder under `files/` | Files | Typical use |
| --- | --- | --- |
| `Effects/` | ~423 | halftones, sunbursts, stars, sparkles, chains, lightning, flames, slashes |
| `Backgrounds/` | ~199 | scene backdrops for mockup context, city/nature/horror/fantasy themes |
| `Renders/` | ~156 | character and item renders for product cards |
| `Textures/` | ~122 | stud, metal, paper, grid, checkerboard, magma, frosty surfaces |
| `Faces/` | ~34 | Roblox face decals |
| `Brushes/` | ~20 | paint brush strokes |
| `Other/` | ~12 | blueprint frames, color reference sheets |
| `Icons/` | 4 | Robux icon (PNG + SVG), crystal, misc |
| `Sounds/` | 6 | UI open/close/click/hover/slide MP3s |

Common tags: Halftones, Sunbursts, Stars, Characters, City, Circle, Sparke (sic), Chains, Lightning, Paper, Grid, Stud, Roblox, Flames, Metal, Patterns, Slash, Smoke, Crystal. Many records are tagged `Undefined` or `Dump`, so search titles and descriptions too.

### Files in this folder

- `MANIFEST.csv` — one row per catalog link: `resource_id, title, category, description, tags, link_field, source_url, downloaded_path, download_status, http_status, content_type, size_bytes, sha256, final_url`. `downloaded_path` is relative to `assets/ui-resources/`.
- `LINK-ONLY-RESOURCES.csv` — 154 records with no direct file (Figma/Studio plugins, sites, tutorials, software).
- `catalog.json` — raw API response.
- `SUMMARY.json`, `failures.json`, `README.md` — capture totals and notes.

### Not bundled

Two catalog entries were zip archives and are left out of this skill. Their manifest rows have `download_status = excluded-zip-not-bundled` and an empty `downloaded_path`:

- `1010` "Vectors by Montzter" (Icons, ~44 MB zip)
- `714668956` "5000+ Pixel Icons" by Windwolf (Icons, ~5.8 MB zip)

Fetch them from `source_url` only if the user asks, into a fresh directory outside the skill.

One extensionless JPEG (`1220` "color theory basics") was renamed to `files/Other/1220-download_url-G9ivY83W4AAG9Jo.jpg`; the manifest reflects the new path.

### Lookup recipes

Find candidates by tag, title or description, then open the image with Read to check it visually:

```bash
grep -i "stud" ~/.claude/skills/ui-figma-roblox/assets/ui-resources/MANIFEST.csv | cut -d, -f2,3,5,8
```

```bash
python -I -c "import csv,sys;[print(r['category'],r['title'],r['tags'],r['downloaded_path'],sep=' | ') for r in csv.DictReader(open(sys.argv[1],encoding='utf-8-sig')) if r['downloaded_path'] and sys.argv[2].lower() in (r['title']+r['tags']+r['description']).lower()]" ~/.claude/skills/ui-figma-roblox/assets/ui-resources/MANIFEST.csv sunburst
```

## Usage rules

1. Prefer the smallest asset set that solves the visual need. Choose by the actual image, not the filename.
2. Copy an asset into the user's project before editing. Never modify the bundled originals.
3. Keep `title`, creator (`description` often holds "By <creator>") and `source_url` beside any asset moved into a project.
4. The capture is point-in-time. Check the live listing for changes and terms before a commercial release.
5. No license is implied. A "free" label is not redistribution permission. If rights are unclear, use the asset as reference only or ask the user to confirm.
6. Link-only records (plugins, software) are discovery pointers, not endorsements. Verify publisher, compatibility and data handling before recommending one. Never run downloaded software.
