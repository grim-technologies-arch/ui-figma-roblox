# Worked example: stud shop (Figma → Roblox StarterGui)

Session of 2026-10-18. A complete run of this skill from prompt to a working in-game ScreenGui, including the corrections the user asked for. Use it as a reference implementation and as a record of the user's taste.

## Files

| Path | What it is |
| --- | --- |
| `renders/00-user-reference.webp` | The target the user supplied. **Match this look.** |
| `renders/01-rejected-first-attempt.png` | First attempt, before the reference arrived. Rounded green panel, rarity-coloured cards, gem HUD. The user rejected it as not like the reference. |
| `renders/02-figma-fullscreen-translucent.png` | Figma build after the translucency pass, over a blurred game scene. |
| `renders/03-figma-panel-final.png` | Final Figma panel with button bevels. |
| `renders/04-roblox-studio-playtest.jpg` | The same UI as a native Roblox ScreenGui in a playtest. |
| `scripts/figma/01..03-*.js` | The exact `use_figma` scripts that built the final file, in run order. All ran clean. Node ids and image hashes are file-specific; the header of each script says what to replace. |
| `scripts/bake_roblox_studs.py` | Makes the Roblox stud images: an Overlay-emulating tile plus pre-faded overlays. Reproduces `roblox-assets/` byte-for-byte. |
| `scripts/roblox/build_shopgui.luau` | Consolidated Luau builder for `StarterGui.ShopGui` in its final state. **Not yet executed as a single file.** Every block in it ran in the session, but in separate calls; a dry run (`DRY_RUN = true`) was attempted and did not happen because the Studio instance had closed. Set `ls.Source` from `ShopController.client.luau` (or define `CONTROLLER_SOURCE`) before running. |
| `scripts/roblox/ShopController.client.luau` | Final LocalScript: fit-to-screen, close, buy-button animations, purchase prompts. |
| `roblox-assets/*.png` | The uploaded images. The asset ids in the builder belong to the uploading account; re-upload for another game. |

## Layout (design px, panel 880 × 784 centred on 1920 × 1080)

- **Frame:** square corners, dark slate `#383D47` at ~68 % opacity, 4 px outside outline `#14161C`. No depth copy, because a darker copy shows through a translucent face.
- **Header:** full width minus the close button, 104 px tall, cyan `#3CB9F2`, full tiled studs. "SHOP!" is left-aligned at 66 px. The close button sits flush at the right end, 112 × 104, red `#F24848`, with the same build.
- **Bundle hero card:** 820 × 260, gold `#F6BE18`. "BUNDLE" in yellow `#FFE21F` with a black outline, two bullets, and a green Robux price button. On the right, translucent white diagonal stripes and a rounded "halo" square (white 38 %, gold outline) sit behind a large gem, clipped by a mask.
- **Three currency cards:** 260 × 310, gap 20, blue `#27A5EC`. Title, large gem, and a full-width green price bar.
- **Padding:** 30 px inside the panel. Depth offsets are 10 px for cards, header and close, and 6 px for buttons.

## Techniques that the user explicitly asked for

1. **Depth:** duplicate the face, nudge it down, fill it darker (×0.62; ×0.45 on buttons so it reads as a thick bottom edge).
2. **Outlines:** set to Outside, 3–5 px, one near-black colour everywhere.
3. **Studs:** `kek_stud.png` as an image fill on its own layer, set to Tile (scalingFactor 0.375 = 24 px studs), with Overlay blending.
4. **Transparency ("see the transparency"):**
   - The frame is translucent.
   - Stud layers fade through an alpha-gradient mask: top→bottom on cards, bottom→top on the bundle and buttons.
   - Sheen and halo are translucent white, not flat tints.
5. **Button effects ("you forgot the button effects"):**
   - a light inner rim (Inside stroke 3–4 px);
   - a darker bottom lip (~20 % height on buttons, 12 % on the header and close) with a 2 px light line on top;
   - masked diagonal sheen stripes;
   - faint studs that fade upward.

   The header and close button get the rim and lip only.
6. **Hard shadows:** 0 blur, 100 % opacity, on text and icons.

## Roblox port lessons (verified in Studio)

- **Overlay blending:** Roblox has none. Convert the grey stud tile to white-alpha highlights and black-alpha shadows (`bake_roblox_studs.py`). With normal blending, that looks like Overlay on any colour.
- **Fades:** `UIGradient.Transparency` did not visibly fade a tiled `ImageLabel`, nor a `CanvasGroup` wrapping one. **Bake the fade into the image** and use `ScaleType.Stretch`.
  - To check a fade, measure the contrast in the capture (PIL stddev per band). JPEG captures fooled the eye.
  - `AssetService:CreateEditableImageAsync` can read back an uploaded asset's alpha.
- **Outlines:** `UIStroke` in Border mode draws outside, like Figma's Outside stroke. Use `LineJoinMode.Miter` for square corners.
- **Hard text shadow:** use a black duplicate `TextLabel` nudged down as a **sibling**. Under `ZIndexBehavior.Sibling` a child always draws above its parent.
- **Clipping:** `ClipsDescendants` does not clip rotated children. Use a `CanvasGroup` for the stripes, halo and sheen.
- **Hover scaling:** to scale from the centre with `UIScale`, set `AnchorPoint = (0.5, 0.5)` and move `Position` to the centre first.
- **Shine sweep:** use a white `Frame` with a narrow-band `UIGradient` (Rotation 25) and tween `Offset` from (-1, 0) to (1, 0). No CanvasGroup is needed.
- **Upload path:**
  - Serve local PNGs with `python -I -m http.server 8765 --bind 127.0.0.1`, pass `http://localhost:8765/x.png` to the Studio MCP `upload_image`, then stop the server.
  - Figma `get_screenshot` exports at 1×. To get a larger export, rescale a temporary clone, export it, then delete the clone.
- **Uploading to Figma from Git Bash on Windows:** `curl -F "file=@~/..."` fails with `(26)`. `cd` into the folder and use a relative path.
- **Figma Starter plan:** it has an MCP call limit, which was hit near the end of the session. Batch calls and avoid extra screenshots.

## User preferences learned

- When a reference image is given, match it closely: square corners, translucency, layout, button effects. Generic interpretations were rejected.
- **Animations:** only on the **buy buttons** (hover grow 1.06 with a shine sweep; press sinks the face into its depth). No card, shop-open or close-button animations. The bundle buy button's idle glint every 3.5 s was kept.
- **Roblox Studio:** do not run anything in Studio unless the user asks for that specific action. Several Studio instances (other commissions) can be open at once.
