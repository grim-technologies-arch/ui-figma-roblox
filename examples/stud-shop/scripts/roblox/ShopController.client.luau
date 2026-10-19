-- ShopController: fit-to-screen, close button, buy-button animations, purchase prompts.
-- Other scripts can open/close the shop with: ShopGui.Toggle:Fire(true / false)
-- User preference (2026-10-18): animate ONLY the buy buttons — no card, shop-open or close-button animations.
local TweenService = game:GetService("TweenService")
local Players = game:GetService("Players")
local MarketplaceService = game:GetService("MarketplaceService")

local gui = script.Parent
local shop = gui:WaitForChild("Shop")
local fitScale = shop:WaitForChild("FitScale")
local camera = workspace.CurrentCamera

local Back, Quad = Enum.EasingStyle.Back, Enum.EasingStyle.Quad
local Out = Enum.EasingDirection.Out

local function tween(obj, t, props, style, dir)
	local tw = TweenService:Create(obj, TweenInfo.new(t, style or Quad, dir or Out), props)
	tw:Play()
	return tw
end

-- fit to screen ---------------------------------------------------------
local function fit()
	local vp = camera.ViewportSize
	fitScale.Scale = math.min(vp.Y / 1080, vp.X * 0.92 / 880, vp.Y * 0.9 / 800)
end
camera:GetPropertyChangedSignal("ViewportSize"):Connect(fit)
fit()

-- open / close (no animation) -------------------------------------------
gui:WaitForChild("Toggle").Event:Connect(function(state)
	if state == nil then state = not shop.Visible end
	shop.Visible = state
end)
shop:WaitForChild("CloseButton").Face:WaitForChild("Hit").Activated:Connect(function()
	shop.Visible = false
end)

-- buy buttons: hover grow + shine sweep, press sinks face into depth -----
local function sweep(face, duration)
	local shine = face:FindFirstChild("Shine")
	local g = shine and shine:FindFirstChildOfClass("UIGradient")
	if not g then return end
	g.Offset = Vector2.new(-1, 0)
	tween(g, duration or 0.45, {Offset = Vector2.new(1, 0)})
end

local function wireBuyButton(container)
	local face = container:WaitForChild("Face")
	local depth = container:FindFirstChild("Depth")
	local hit = face:WaitForChild("Hit")
	local scale = container:WaitForChild("HoverScale")
	local rest = face.Position
	local sink = UDim2.fromOffset(0, depth and math.max(depth.Position.Y.Offset - 2, 2) or 4)
	local hovering = false

	hit.MouseEnter:Connect(function()
		hovering = true
		tween(scale, 0.18, {Scale = 1.06}, Back, Out)
		sweep(face)
	end)
	hit.MouseLeave:Connect(function()
		hovering = false
		tween(scale, 0.18, {Scale = 1})
		tween(face, 0.08, {Position = rest})
	end)
	hit.MouseButton1Down:Connect(function()
		tween(face, 0.06, {Position = sink})
		tween(scale, 0.08, {Scale = 0.96})
	end)
	hit.MouseButton1Up:Connect(function()
		tween(face, 0.12, {Position = rest}, Back, Out)
		tween(scale, 0.15, {Scale = hovering and 1.06 or 1}, Back, Out)
	end)
	hit.Activated:Connect(function()
		local id = container:GetAttribute("DeveloperProductId")
		if id and id ~= 0 then
			MarketplaceService:PromptProductPurchase(Players.LocalPlayer, id)
		else
			warn("ShopGui: set the DeveloperProductId attribute on " .. container:GetFullName())
		end
	end)
end

local bundleButton
for _, d in ipairs(shop:GetDescendants()) do
	if d.Name == "PriceButton" and d:IsA("Frame") then
		if d:FindFirstAncestor("BundleCard") then bundleButton = d end
		wireBuyButton(d)
	end
end

-- bundle buy button glints every few seconds
if bundleButton then
	task.spawn(function()
		while gui.Parent do
			task.wait(3.5)
			if shop.Visible then sweep(bundleButton.Face, 0.7) end
		end
	end)
end
