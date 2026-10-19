---
name: ui-figma-roblox
description: Design Roblox shop, HUD and menu interfaces in Figma with layered panels, stud textures, reusable product cards, icons, button systems and currency displays, using a bundled local asset library (Kek UI Essentials pack plus a ~975-file UI Resources capture of textures, effects, backgrounds, renders, faces, brushes, icons and UI sounds). Use when creating or refining a Roblox UI mockup in Figma, building a stud-style shop/HUD, or picking textures, halftones, sparkles, rays, stud tiles or other UI art for a Roblox game.
---

# Roblox Stud UI Design in Figma

Create a cohesive, game-ready Roblox interface mockup in Figma. Use the detailed construction guide in [references/design-workflow.md](references/design-workflow.md) when building the interface or when you need the specific layer recipes and checkpoints. Use [references/asset-library.md](references/asset-library.md) when choosing art from the bundled assets.

## Choose the right scope

Use this skill for visual design and Figma construction of Roblox game UI: shops, product cards, HUD buttons, currency displays, and related interface mockups. It does not define Roblox gameplay behavior, scripting, monetization rules, or a guaranteed Figma-to-Roblox export pipeline. If the user asks for implementation in Roblox Studio, design the UI and then explain which asset/export steps need to be verified in the user's current toolchain.

When the Figma MCP is connected, load the `figma:figma-use` skill before any `use_figma` call (and `figma:figma-generate-design` for full screens). Upload chosen bitmap assets from this skill's `assets/` folder rather than re-downloading them.

The source tutorial builds a stylized green shop interface with Robux pricing, gem imagery, shop/base/sell buttons, sidebar actions, and a currency counter. Treat these as worked examples. Preserve the user's game theme, palette, platform, terminology, and requested components when they differ.

## Operating workflow

1. **Clarify only material unknowns.** Infer reasonable defaults for a mockup. Ask a concise question only when a missing choice would change the whole design, such as the target screen/platform, game theme, or required shop contents. If the user supplies a reference, prioritize it over the tutorial's colors and layout.
2. **Set the canvas and organize the file.** Create a frame at the target presentation size. The tutorial uses 1920 × 1080 for a desktop presentation. Keep source imagery behind the UI, lock the background, and group/name related components as you build.
3. **Build from large forms to small details.** Establish the base panel, header, and major content blocks before text, icons, texture, and decorative polish. Keep each component editable and reusable.
4. **Create a consistent visual language.** Reuse a small set of fill, gradient, outline, shadow, corner, text, and spacing decisions. Use color to distinguish function or category, not as decoration without meaning. Check that labels remain legible over texture and effects.
5. **Construct components as layered shapes.** Prefer editable vector layers for dimensional buttons and panels. Where a second offset layer is used as an extrusion, keep the offset small and consistent. Add an outer outline deliberately; duplicate/flatten outline layers only when the result stays editable enough for future changes.
6. **Use texture with restraint.** Tile stud textures instead of stretching them when appropriate. Lower their visual dominance with a blend mode or opacity adjustment, and keep texture behind labels and important symbols.
7. **Make repeated content systematic.** Build one product card or button carefully, duplicate it, then change only content and category color. Align repeated components and inspect the gaps and outer padding; use Figma's spacing measurements rather than eyeballing alone.
8. **Check the whole screen.** Review at presentation size and zoomed in. Look for inconsistent spacing, poor contrast, oversized outlines, clutter, clipped content, and text that feels misaligned. Refine the frame to fit the content with balanced padding.
9. **Deliver the requested artifact.** If tools allow, provide the editable Figma file or clearly identify the deliverable and any unresolved export steps. Do not claim that a mockup is implemented in Roblox or ready to import unless that has actually been verified.

## Design constraints

- Maintain a clear hierarchy: screen title/header, primary offer or content, secondary options, navigation/actions, then currency or status.
- Use gradients, strokes, hard shadows, and stud texture to support a tactile Roblox aesthetic; avoid applying every effect to every element.
- Keep text and icons visually centered within their control. A group's bounding box can be centered while its visible contents still look off-center; inspect the visible shape.
- Keep spacing and strokes proportional when resizing. Figma's Scale tool changes properties such as stroke widths; after scaling, inspect and correct text size, stroke weight, shadow distance, and icon size individually.
- Keep layer names meaningful and nesting shallow enough to edit. Group semantic components (for example, `shop-frame`, `product-card`, `top-navigation`, `currency-display`) and name repeated items consistently.
- Avoid flattening the source artwork prematurely. Preserve originals or editable copies before destructive vectorization, flattening, or outlining operations.
- Use external assets only when they fit the game's art direction and the user's allowed sources. Do not imply that a downloaded icon is licensed for the user's project.

## Bundled asset libraries

Two local libraries ship inside this skill. Check them before generating or downloading new art. Full details and lookup recipes: [references/asset-library.md](references/asset-library.md).

- `assets/kek-ui-essentials/` — 106 PNG/WebP files from the Kek UI Essentials pack: stud tile (`kek_stud.png`), halftones, rays, sparks, sparkles, chains, flames, smoke, slashes, speed lines, spirals. Inventory in [ASSET-NOTES.md](assets/kek-ui-essentials/ASSET-NOTES.md).
- `assets/ui-resources/` — point-in-time capture of [UI Resources](https://ui-resources.com/) direct files, grouped under `files/<Category>/` (Backgrounds, Brushes, Effects, Faces, Icons, Other, Renders, Sounds, Textures). `MANIFEST.csv` maps each catalog record (title, creator, tags, source URL, SHA-256) to its local file. `LINK-ONLY-RESOURCES.csv` lists records with no direct file (plugins, sites, tutorials). Two zip packs from the catalog are not bundled; their manifest rows are marked `excluded-zip-not-bundled`.

Search the manifest by tag or title instead of listing folders, then view the candidate image before using it. Names are clues, not guarantees.

Licensing: neither library grants a blanket license. The Kek pack had no license file; UI Resources is a community directory and a "free" label is not redistribution permission. Keep source URL and creator with any asset moved into a project, and confirm rights before commercial release.

## Working with Figma

Use the current Figma interface and available tools. The tutorial demonstrates Space + drag to pan, Ctrl + scroll to zoom, frame presets, shape/text tools, alignment controls, arrow-key nudging, Ctrl/Cmd + D to duplicate, Ctrl/Cmd + G to group, and entering a group to edit nested layers. Key bindings may vary by OS or change in Figma; use menus/tooltips when uncertain.

For image icons that need a shaped outline, recognize the limitation first: an ordinary stroke around a bitmap follows its rectangular image bounds. Use an appropriate vector asset (for example `assets/ui-resources/files/Icons/75-download_url2-RobuxIcon.svg`) or a verified image-tracing/vectorization workflow when the outline must follow the silhouette. Check the vector result at small size; tracing is only a convenience, not a guarantee of clean geometry. If a plugin is needed, use only a trusted plugin available in the user's Figma environment and preserve the original bitmap.

## Worked example: stud shop, Figma to Roblox

Read [examples/stud-shop/README.md](examples/stud-shop/README.md) before building a shop, or before porting a Figma mockup into Roblox. It contains:

- the user's reference image;
- the rejected first attempt, with the reasons it was rejected;
- the final Figma recipe, as verified `use_figma` scripts;
- the Roblox StarterGui port, with a Luau builder, a LocalScript, and baked stud and fade assets;
- the user's preferences.

Key points:

- When the user gives a reference image, match it closely: square corners, a translucent frame, button rim, lip and sheen, and fading studs.
- Roblox has no Overlay blend mode. UIGradient fades did not render on tiled studs, so bake the fades into images.
- Animate only the buy buttons.
- Never act in Roblox Studio unless the user asks for that specific action.

## Source and interpretation

This skill is adapted from Kek's "The Greatest Stud UI Tutorial on Roblox (w/ Figma)" and its English auto-generated transcript. The tutorial is a visual design walkthrough, not a current Figma reference manual or a Roblox import specification. For the chapter map and detailed design recipe, see [references/design-workflow.md](references/design-workflow.md). Source: https://www.youtube.com/watch?v=gnIKtS3nUqo. UI asset source: https://ui-resources.com/.
