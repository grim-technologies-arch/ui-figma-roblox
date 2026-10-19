--!nocheck
-- Builds StarterGui.ShopGui: the Figma stud shop rebuilt as native, editable Roblox UI.
-- Consolidated final state of the 2026-10-18 session (builder + baked-fade swap + buy-button prep).
-- Run with the Studio MCP execute_luau (Edit datamodel). Replaces any existing ShopGui.
--
-- ASSET IDS BELOW BELONG TO THE ACCOUNT THAT UPLOADED THEM. For a new game, re-upload the PNGs in
-- ../../roblox-assets (serve them with `python -I -m http.server 8765 --bind 127.0.0.1` and pass
-- http://localhost:8765/<file>.png URLs to the Studio MCP upload_image tool), then paste the new ids.
local DRY_RUN = false -- true: build but do not parent (syntax/runtime check without touching the game)

local ASSET = {
	studTile = "rbxassetid://73394678597111",     -- stud_tile.png (Tile, 96x96)
	gem = "rbxassetid://124001765663206",         -- gem.png (Figma vector gem, exported 512px)
	robux = "rbxassetid://103447470268697",       -- robux.png (163x188 incl. outline + shadow)
	studsCard = "rbxassetid://84974314867151",    -- studs_card.png (fade top->bottom)
	studsBundle = "rbxassetid://89363631219310",  -- studs_bundle.png (fade bottom->top)
	studsBtnBig = "rbxassetid://101411798479621", -- studs_btn_big.png
	studsBtnSmall = "rbxassetid://133961229340644", -- studs_btn_small.png
}

local StarterGui = game:GetService("StarterGui")
local OUTLINE = Color3.fromHex("14161C")
local FONT = Font.fromEnum(Enum.Font.FredokaOne)
local WHITE = Color3.new(1, 1, 1)
local function shade(c, k) return Color3.new(c.R * k, c.G * k, c.B * k) end

local function new(class, props, parent)
	local o = Instance.new(class)
	for k, v in pairs(props) do o[k] = v end
	if parent then o.Parent = parent end
	return o
end
-- UIStroke in Border mode draws outside the frame = Figma "Outside" stroke
local function stroke(parent, t, color, transp)
	return new("UIStroke", {Thickness = t, Color = color or OUTLINE, Transparency = transp or 0,
		ApplyStrokeMode = Enum.ApplyStrokeMode.Border, LineJoinMode = Enum.LineJoinMode.Miter}, parent)
end
local function tiledStuds(parent, transp, z)
	return new("ImageLabel", {Name = "Studs", BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), Image = ASSET.studTile,
		ScaleType = Enum.ScaleType.Tile, TileSize = UDim2.fromOffset(96, 96), ImageTransparency = transp, ZIndex = z}, parent)
end
local function bakedStuds(parent, image, z)
	return new("ImageLabel", {Name = "StudsFade", BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), Image = image,
		ScaleType = Enum.ScaleType.Stretch, ZIndex = z}, parent)
end
-- face -> duplicate -> nudge down -> darker ; outside stroke
local function block(parent, name, x, y, w, h, color, o)
	o = o or {}
	local depthPx = o.depth or 10
	local c = new("Frame", {Name = name, BackgroundTransparency = 1, Position = UDim2.fromOffset(x, y),
		Size = UDim2.fromOffset(w, h + depthPx), ZIndex = o.z or 1}, parent)
	local d = new("Frame", {Name = "Depth", BackgroundColor3 = shade(color, o.depthShade or 0.62), BorderSizePixel = 0,
		Position = UDim2.fromOffset(0, depthPx), Size = UDim2.fromOffset(w, h), ZIndex = 1}, c)
	stroke(d, o.stroke or 4)
	local f = new("Frame", {Name = "Face", BackgroundColor3 = color, BorderSizePixel = 0, Size = UDim2.fromOffset(w, h), ZIndex = 2}, c)
	stroke(f, o.stroke or 4)
	return c, f
end
-- text with outline + hard 0-blur shadow. In ZIndexBehavior.Sibling a child always draws above its
-- parent, so the shadow must be a SIBLING label nudged down, not a child.
local function label(parent, name, text, x, y, w, h, size, o)
	o = o or {}
	local holder = new("Frame", {Name = name, BackgroundTransparency = 1, Position = UDim2.fromOffset(x, y),
		Size = UDim2.fromOffset(w, h), ZIndex = o.z or 10, AutomaticSize = o.auto and Enum.AutomaticSize.X or Enum.AutomaticSize.None}, parent)
	local function mk(nm, col, dy, z)
		local t = new("TextLabel", {Name = nm, BackgroundTransparency = 1, Text = text, FontFace = FONT, TextSize = size,
			TextColor3 = col, Position = UDim2.fromOffset(0, dy), Size = o.auto and UDim2.new(0, 0, 1, 0) or UDim2.fromScale(1, 1),
			AutomaticSize = o.auto and Enum.AutomaticSize.X or Enum.AutomaticSize.None,
			TextXAlignment = o.align or Enum.TextXAlignment.Center, TextYAlignment = Enum.TextYAlignment.Center, ZIndex = z}, holder)
		new("UIStroke", {Thickness = o.stroke or 3, Color = dy > 0 and Color3.new(0, 0, 0) or OUTLINE,
			ApplyStrokeMode = Enum.ApplyStrokeMode.Contextual, LineJoinMode = Enum.LineJoinMode.Round}, t)
		return t
	end
	mk("Shadow", Color3.new(0, 0, 0), o.shadow or 3, (o.z or 10))
	mk("Text", o.color or WHITE, 0, (o.z or 10) + 1)
	return holder
end
-- light rim + darker bottom lip
local function bevel(face, base, rimColor, rimPx, lipFrac, z)
	local w, h = face.Size.X.Offset, face.Size.Y.Offset
	local lipH = math.floor(h * lipFrac + 0.5)
	new("Frame", {Name = "Lip", BackgroundColor3 = shade(base, 0.8), BorderSizePixel = 0,
		Position = UDim2.fromOffset(0, h - lipH), Size = UDim2.fromOffset(w, lipH), ZIndex = z}, face)
	new("Frame", {Name = "LipHighlight", BackgroundColor3 = rimColor, BackgroundTransparency = 0.4, BorderSizePixel = 0,
		Position = UDim2.fromOffset(0, h - lipH), Size = UDim2.fromOffset(w, 2), ZIndex = z + 1}, face)
	local rim = new("Frame", {Name = "Rim", BackgroundTransparency = 1, Position = UDim2.fromOffset(rimPx, rimPx),
		Size = UDim2.fromOffset(w - rimPx * 2, h - rimPx * 2), ZIndex = z + 2}, face)
	stroke(rim, rimPx, rimColor, 0.15)
end
-- static diagonal sheen bars; CanvasGroup clips rotated children (ClipsDescendants does not)
local function sheen(face, bars, z, transp)
	local cg = new("CanvasGroup", {Name = "Sheen", BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), ZIndex = z}, face)
	for i, b in ipairs(bars) do
		new("Frame", {Name = "Bar" .. i, BackgroundColor3 = WHITE, BackgroundTransparency = b.t or transp, BorderSizePixel = 0,
			AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromOffset(b.x, b.y), Size = UDim2.fromOffset(b.w, b.h),
			Rotation = b.r}, cg)
	end
	return cg
end
-- hover shine: white frame whose UIGradient.Offset is tweened -1 -> 1 by ShopController
local function hoverShine(face, z)
	local f = new("Frame", {Name = "Shine", BackgroundColor3 = WHITE, BorderSizePixel = 0, Size = UDim2.fromScale(1, 1), ZIndex = z}, face)
	new("UIGradient", {Rotation = 25, Offset = Vector2.new(-1, 0), Transparency = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 1), NumberSequenceKeypoint.new(0.38, 1),
		NumberSequenceKeypoint.new(0.46, 0.55), NumberSequenceKeypoint.new(0.5, 0.35),
		NumberSequenceKeypoint.new(0.54, 0.55), NumberSequenceKeypoint.new(0.62, 1),
		NumberSequenceKeypoint.new(1, 1)})}, f)
end

local GREEN = Color3.fromHex("45D63A")
local function priceButton(parent, x, y, w, h, price, iconH, size)
	local c, f = block(parent, "PriceButton", x, y, w, h, GREEN, {stroke = 3, depth = 6, depthShade = 0.45, z = 20})
	-- centre anchor so the HoverScale grows from the middle
	c.AnchorPoint = Vector2.new(0.5, 0.5)
	c.Position = UDim2.fromOffset(x + w / 2, y + (h + 6) / 2)
	new("UIScale", {Name = "HoverScale"}, c)
	local a = math.deg(math.atan(0.8))
	local bw = 0.2 * w * math.cos(math.atan(0.8))
	sheen(f, {
		{x = 0.6 * w - 0.4 * h, y = h / 2, w = bw, h = h * 2.2, r = a},
		{x = 0.78 * w - 0.4 * h, y = h / 2, w = bw * 0.2, h = h * 2.2, r = a},
	}, 3, 0.8)
	bakedStuds(f, w >= 260 and ASSET.studsBtnBig or ASSET.studsBtnSmall, 4)
	bevel(f, GREEN, Color3.fromHex("A6FF8F"), 3, 0.2, 5)
	hoverShine(f, 9)
	local content = new("Frame", {Name = "Content", BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), ZIndex = 10}, f)
	new("UIListLayout", {FillDirection = Enum.FillDirection.Horizontal, HorizontalAlignment = Enum.HorizontalAlignment.Center,
		VerticalAlignment = Enum.VerticalAlignment.Center, Padding = UDim.new(0, 10), SortOrder = Enum.SortOrder.LayoutOrder}, content)
	new("ImageLabel", {Name = "Robux", BackgroundTransparency = 1, Image = ASSET.robux, ScaleType = Enum.ScaleType.Fit,
		Size = UDim2.fromOffset(math.floor(iconH * 163 / 188 + 0.5), iconH), LayoutOrder = 1, ZIndex = 10}, content)
	local pl = label(content, "Price", price, 0, 0, 0, h, size, {auto = true, stroke = 3, shadow = 3, z = 11})
	pl.LayoutOrder = 2
	new("TextButton", {Name = "Hit", BackgroundTransparency = 1, Text = "", Size = UDim2.fromScale(1, 1), ZIndex = 30}, f)
	c:SetAttribute("DeveloperProductId", 0)
	return c
end
local function gem(parent, cx, cy, size)
	return new("ImageLabel", {Name = "Gem", BackgroundTransparency = 1, Image = ASSET.gem, ScaleType = Enum.ScaleType.Fit,
		AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromOffset(cx, cy), Size = UDim2.fromOffset(size, size), ZIndex = 15}, parent)
end

-- ===== build =====
local gui = new("ScreenGui", {Name = "ShopGui", ResetOnSpawn = false, IgnoreGuiInset = true,
	ZIndexBehavior = Enum.ZIndexBehavior.Sibling, DisplayOrder = 10})
new("BindableEvent", {Name = "Toggle"}, gui)
local shop = new("Frame", {Name = "Shop", BackgroundTransparency = 1, AnchorPoint = Vector2.new(0.5, 0.5),
	Position = UDim2.fromScale(0.5, 0.5), Size = UDim2.fromOffset(880, 794)}, gui)
new("UIScale", {Name = "FitScale", Scale = 1}, shop)

-- translucent main frame, no depth copy (it would show through)
local panel = new("Frame", {Name = "PanelBase", BackgroundColor3 = Color3.fromHex("383D47"), BackgroundTransparency = 0.32,
	BorderSizePixel = 0, Size = UDim2.fromOffset(880, 784), ZIndex = 1}, shop)
stroke(panel, 4)

local HEAD = Color3.fromHex("3CB9F2")
local _, hf = block(shop, "Header", 0, 0, 768, 104, HEAD, {z = 5})
tiledStuds(hf, 0.3, 3)
bevel(hf, HEAD, Color3.fromHex("A8E9FF"), 4, 0.12, 4)
label(hf, "Title", "SHOP!", 26, 0, 400, 104, 66, {align = Enum.TextXAlignment.Left, stroke = 5, shadow = 5})

local RED = Color3.fromHex("F24848")
local _, cf = block(shop, "CloseButton", 768, 0, 112, 104, RED, {z = 5})
tiledStuds(cf, 0.3, 3)
bevel(cf, RED, Color3.fromHex("FFA3A3"), 4, 0.12, 4)
label(cf, "X", "X", 0, 0, 112, 104, 66, {stroke = 5, shadow = 5})
new("TextButton", {Name = "Hit", BackgroundTransparency = 1, Text = "", Size = UDim2.fromScale(1, 1), ZIndex = 30}, cf)

-- bundle hero card
local GOLD = Color3.fromHex("F6BE18")
local _, bf = block(shop, "BundleCard", 30, 140, 820, 260, GOLD, {z = 3})
local art = new("CanvasGroup", {Name = "Art", BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), ZIndex = 3}, bf)
local ang = math.deg(math.atan(90 / 260))
new("Frame", {Name = "Stripe1", BackgroundColor3 = WHITE, BackgroundTransparency = 0.78, BorderSizePixel = 0,
	AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromOffset(350, 130), Size = UDim2.fromOffset(142, 420), Rotation = ang}, art)
new("Frame", {Name = "Stripe2", BackgroundColor3 = WHITE, BackgroundTransparency = 0.78, BorderSizePixel = 0,
	AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromOffset(470, 130), Size = UDim2.fromOffset(28, 420), Rotation = ang}, art)
local halo = new("Frame", {Name = "Halo", BackgroundColor3 = WHITE, BackgroundTransparency = 0.62, BorderSizePixel = 0,
	AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromOffset(690, 130), Size = UDim2.fromOffset(290, 290), Rotation = -8}, art)
new("UICorner", {CornerRadius = UDim.new(0, 60)}, halo)
new("UIStroke", {Thickness = 6, Color = Color3.fromHex("D99A05"), ApplyStrokeMode = Enum.ApplyStrokeMode.Border}, halo)
bakedStuds(bf, ASSET.studsBundle, 4)
label(bf, "Title", "BUNDLE", 24, 12, 420, 84, 76, {align = Enum.TextXAlignment.Left, stroke = 5, shadow = 5, color = Color3.fromHex("FFE21F")})
label(bf, "Bullet1", "•  5,000 Gems", 28, 98, 400, 36, 28, {align = Enum.TextXAlignment.Left})
label(bf, "Bullet2", "•  2x Gem Boost (1 hr)", 28, 134, 400, 36, 28, {align = Enum.TextXAlignment.Left})
priceButton(bf, 24, 180, 280, 64, "499", 38, 44)
gem(bf, 690, 128, 232)

-- currency product cards
local BLUE = Color3.fromHex("27A5EC")
local products = {{"+100 Gems", "25"}, {"+550 Gems", "99"}, {"+1,200 Gems", "199"}}
for i, p in ipairs(products) do
	local _, f = block(shop, "ProductCard" .. i, 30 + (i - 1) * 280, 434, 260, 310, BLUE, {z = 3})
	bakedStuds(f, ASSET.studsCard, 3)
	label(f, "Title", p[1], 10, 8, 240, 54, 38, {stroke = 4, shadow = 4})
	gem(f, 130, 150, 172)
	priceButton(f, 20, 244, 220, 50, p[2], 30, 34)
end

-- client controller (source kept next to this file as ShopController.client.luau)
local ls = new("LocalScript", {Name = "ShopController"}, gui)
ls.Source = CONTROLLER_SOURCE or "-- paste ShopController.client.luau here"

local n = #gui:GetDescendants()
if DRY_RUN then
	gui:Destroy()
	return "dry run ok, descendants: " .. n
end
local old = StarterGui:FindFirstChild("ShopGui")
if old then old:Destroy() end
gui.Parent = StarterGui
return "ShopGui built, descendants: " .. n
