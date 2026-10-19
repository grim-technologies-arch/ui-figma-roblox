# Design workflow and construction recipes

This reference turns the source tutorial into a reusable workflow for Claude. It separates the tutorial’s demonstrated techniques from decisions that should adapt to each game and current Figma version.

## Tutorial at a glance

Source video: [The Greatest Stud UI Tutorial on Roblox (w/ Figma)](https://www.youtube.com/watch?v=gnIKtS3nUqo)

| Video time | Tutorial section | Reusable lesson |
| --- | --- | --- |
| 0:47 | Figma basics | Understand canvas, layers, properties, and frame setup. |
| 1:25 | Background | Use a game scene as context; lock it and soften it when it competes with the mockup. |
| 2:33 | Main frame | Establish panel position, transparency, and outline. |
| 3:50 | Header | Create a layered, gradient header aligned to the panel. |
| 7:30 | Exit button | Derive a new control from the header component and restyle it. |
| 9:29 | Stud texture | Tile texture and reduce its contrast so it adds material without overpowering content. |
| 14:27 | Product-card construction begins | Build a hero card with title, price, icon, description, and image region. |
| 14:57 | Robux icon | Use vector art when the icon needs a silhouette-following stroke. |
| 20:06 | Gem icon | Use a masked image region as a focal image and manage layer order. |
| 22:00 | Smaller product boxes | Derive smaller cards from the hero card and preserve proportions and editable layers. |
| 34:04 | Top buttons | Add a top navigation row by reusing a button, then change label and category color. |
| 39:15 | Left buttons | Create a vertical action menu by reusing square controls and adapting color, label, and icon. |
| 51:25 | Currency | Add a readable balance and compact top-up button. |
| 56:30 | Slow mode button | Extend the same component system to a contextual game action. |

The video includes an auto-generated transcript. Use the linked chapter timestamps to revisit visual details; transcript wording is imperfect, especially around asset names and shortcuts.

## 1. Establish context and canvas

- Pick a target frame that matches the user’s actual destination. The tutorial picks a 1920 × 1080 frame for a desktop-style presentation; do not assume that size for mobile, console, or another aspect ratio.
- Place a representative game scene behind the design only if it helps judge contrast and placement. Lock that layer to prevent accidental movement.
- Optional: soften a busy scene with a subtle layer blur. The interface should remain the focal point.
- Keep reference images separate from finished UI layers and name them clearly.

## 2. Build the main panel and header

1. Draw the main panel near the intended screen position. Use a dark or translucent fill when the game scene should remain visible, then apply a deliberate outline.
2. Align the panel with the intended screen center and reserve room for the header and controls.
3. Create the header at the top edge of the panel. Use a restrained vertical gradient for depth.
4. Duplicate a header shape and offset it slightly to create a shallow raised or extruded edge. Use a darker solid fill for the offset layer so the depth reads clearly.
5. Group the header layers, name the group, and verify the outline is consistent where header and panel meet.
6. Leave room for a close/exit control. Derive it from the header shape so outline weight and dimensional treatment stay consistent, then use a functionally clear contrasting color.

The source tutorial sometimes duplicates and flattens layers to form a clean outside outline. Treat this as an optional technique. Keep an editable backup before flattening, and use the least destructive technique supported by the current Figma UI.

## 3. Apply stud texture and depth effects

- Add a stud texture as an image fill or image layer. Tile it when stretching would distort the pattern.
- Adjust scale and position so the repeat feels intentional at the target viewing size.
- Reduce its visual dominance with a suitable blend mode such as Overlay or by lowering opacity. Inspect on both light and dark areas.
- Avoid placing high-contrast texture beneath small body text. If text readability falls, reduce texture strength or add a calmer text backing.
- Add inner highlights or outlines selectively. Choose one or two accent treatments and keep their weight consistent.
- For a hard 3D text/button shadow, use a small offset and little or no blur. Ensure the shadow does not blur the silhouette or make controls look misaligned.

## 4. Create a hero product card

A reusable shop card can contain:

- A card frame with layered fill, border, and subtle stud texture.
- A short product title.
- A clear price row with currency symbol/icon.
- A primary purchase button.
- A compact description, if the product needs explanation.
- A masked showcase image or item render.

Build this as a named, editable group. Keep text separate from decorative shapes so the card can be resized and translated. Use a group mask for the item-image area only when clipping is useful; ensure the actual image, mask, and card fill are ordered correctly in the layer tree.

### Image and icon outline recipe

A stroke applied to a bitmap usually traces its rectangular frame rather than the visible icon. To get a true silhouette outline:

1. Prefer an existing vector icon or a clean transparent PNG plus an image-editing outline if raster output is acceptable.
2. If the workflow requires vector editing, use a trusted image-to-vector tool/plugin and preserve the source bitmap.
3. Inspect the resulting path for holes, rough edges, tiny fragments, and excessive points.
4. Set vector fill, outline position/weight, and opacity deliberately; then resize proportionally and inspect at actual UI scale.
5. If tracing quality is poor, use a clean vector asset or make the outline in a dedicated raster editor. Do not present auto-tracing as perfect.

## 5. Derive a row of product cards

- Duplicate the hero card instead of rebuilding each item.
- Resize using a scaling method that preserves proportions, then adjust text, outline, shadow, and icons individually. In Figma, scaling can scale stroke/effect values too, so re-check them.
- Remove content that does not belong in compact cards (for example, long descriptions) and enlarge the primary price or label only if hierarchy remains clear.
- Replace the title, price, icon, showcase image, and product-specific color. Keep position, spacing, and control size consistent.
- Use alignment/distribution tools, then inspect measured gaps and outer padding. The tutorial checks pixel gaps and corrects one-pixel differences.
- Group the repeated cards under a descriptive parent layer and name each child by its product/content rather than leaving generic duplicate names.

## 6. Add navigation and action controls

### Top navigation

Create or reuse a compact button style for top-level destinations such as Base, Shop, and Sell. Duplicate the control, change its label and category color, and align all controls along a common baseline. Use consistent text centering, outline thickness, and spacing.

### Side action buttons

Use a square or near-square variant for secondary actions such as Shop, Rebirth, Index, and Settings. Reuse the base shape and adjust icon, label, and color deliberately. Place the icon inside the same semantic component group so alignment and later movement remain predictable. Keep the order and labels aligned with the game’s real navigation.

### Contextual utility action

The tutorial’s Slow Mode button is a final example of extending the component system to a context-specific action. Treat it as an optional feature only when the game actually has that mechanic. The general method is to reuse the established button language, make the label/icon immediately understandable, and place the control where its action makes sense.

## 7. Add currency display and top-up control

- Place the currency readout in a consistent HUD area, separate from the modal content if it is persistent game HUD.
- Use a short, scannable balance format that fits the expected number of digits and local conventions.
- Pair the balance with a compact plus/add control. Create the button as layered editable shapes, then align the symbol optically rather than relying only on its text box.
- Check the balance and action at reduced scale; they should remain legible without competing with the main shop action.
- Use the game’s actual currency and symbol; the tutorial’s `$` is only an example.

## 8. Use the bundled asset libraries

This skill bundles two local libraries; see [asset-library.md](asset-library.md) for inventories, lookup commands and licensing rules.

- `assets/kek-ui-essentials/` — the 106 supplied Kek UI Essentials images. Useful for stud tiling, halftone fills, rays, sparks, chains, and other game-effect accents.
- `assets/ui-resources/` — the UI Resources direct-file capture, grouped by category, with `MANIFEST.csv` and `LINK-ONLY-RESOURCES.csv`.

1. Search the local manifest by the interface need (title, tags, description) before searching the web or downloading again. Useful categories include Textures, Effects, Backgrounds, Renders and Icons; useful tags include Stud, Roblox, Halftones, Sunbursts, Stars, Chains, Lightning.
2. Preview a candidate before use; choose based on the actual image, not only its filename. Keep the bundled original unchanged and duplicate it before editing.
3. Prefer the smallest asset set that solves the visual need. Keep the source URL and attribution notes beside any asset moved into a project.
4. If permissions are unclear, use the asset as inspiration or ask the user to confirm rights before including it in a commercial project or redistributed bundle. A catalog label such as "free" is not a blanket license.
5. The capture is point-in-time; check the live item at https://ui-resources.com/ for changes and terms before use. The site also lists software, Figma plugins, Roblox Studio plugins and tutorials (see `LINK-ONLY-RESOURCES.csv`). Treat listings as discovery pointers, not endorsements: verify the current publisher, compatibility, permissions, and data handling before recommending or using a plugin. The catalog's owned-project section has listed tools such as RoImport, UI Plus, Screenify, Color Shift, and Blend flattener, but availability and behavior can change.

## 9. Component and layer organization

Use a predictable hierarchy, adapting to the design:

```text
shop-screen
├── background-reference (locked)
├── shop-panel
│   ├── panel-base
│   ├── header
│   ├── close-button
│   ├── hero-product-card
│   └── product-list
│       ├── product-card-01
│       ├── product-card-02
│       └── product-card-03
├── top-navigation
├── side-actions
└── currency-display
```

Keep editable source elements. Group by function, not by arbitrary selection history. Use reusable components/variants when that matches the user’s desired Figma workflow and avoids needless divergence between repeated controls.

## 10. Review checklist

### Layout
- [ ] The composition matches the target aspect ratio and safe screen area.
- [ ] Main panel, header, and close control are aligned and have clear spacing.
- [ ] Repeated cards align with consistent gaps and outer padding.
- [ ] Controls do not collide with important game content or one another.

### Hierarchy and readability
- [ ] A viewer can identify the screen purpose and primary action quickly.
- [ ] Text is readable at the intended device size.
- [ ] Texture and effects do not obscure labels or icons.
- [ ] Color encodes useful differences and remains coherent across components.

### Craft and editability
- [ ] Repeated controls share consistent geometry, stroke, shadow, and alignment.
- [ ] Scaled elements have had their strokes/effects checked and corrected.
- [ ] Bitmap outlines do not form unintended rectangular boxes.
- [ ] Layer names and grouping support editing; source assets remain recoverable.

### Delivery
- [ ] State whether this is a Figma mockup, an exported asset set, or a verified Studio implementation.
- [ ] If export/import is requested, verify the user’s current pipeline and formats before claiming compatibility.
- [ ] List assumptions or unresolved asset/licensing/export constraints briefly.

## 11. Common failure modes and corrections

| Symptom | Likely cause | Correction |
| --- | --- | --- |
| The texture overwhelms the UI | High opacity/contrast or unsuitable blend mode | Lower opacity, tune blend mode, or remove it behind text. |
| A bitmap icon gets a square outline | Stroke is following the bitmap bounds | Use vector artwork or outline the raster silhouette in an image editor. |
| A resized card’s text or outline looks too heavy | Scale changed stroke/effect values or text proportions | Correct those properties individually after scaling. |
| Product cards look uneven | Spacing was eyeballed or cards have different bounds | Align/distribute, check measured gaps and outer padding, then inspect visually. |
| A grouped item is hard to select | Nested group selection is ambiguous | Expand the layer tree or use Figma’s group-entry/selection modifier; confirm the selected layer before editing. |
| The UI looks polished only when zoomed in | Details are too fine for real display scale | Review at presentation scale, enlarge critical labels/icons, simplify effects. |
| The mockup is called import-ready without evidence | Design work was conflated with implementation/export | Verify the actual Figma-to-Roblox pipeline and describe the deliverable accurately. |
