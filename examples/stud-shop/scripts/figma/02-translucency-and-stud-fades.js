// use_figma script 2/3 — "see the transparency" pass (verbatim, ran clean).
// '7:154' = the shop-panel group id returned by script 1; replace before reuse.
const panel = await figma.getNodeByIdAsync('7:154');
const mutated = [], created = [], removed = [];

// 1. translucent main frame: game scene shows through; remove opaque depth copy that would show behind it
const pDepth = panel.findOne(n => n.name === 'panel/depth');
if (pDepth) { removed.push(pDepth.id); pDepth.remove(); }
const pFace = panel.findOne(n => n.name === 'panel/face');
pFace.fills = [{type:'SOLID', color:{r:0.22, g:0.24, b:0.28}, opacity:0.68}];
pFace.strokes = [{type:'SOLID', color:{r:0.08, g:0.09, b:0.11}}]; pFace.strokeWeight = 4; pFace.strokeAlign = 'OUTSIDE';
mutated.push(pFace.id);

// 2. stud overlays fade out via alpha-gradient mask
const TOP_DOWN = [[0,1,0],[-1,0,1]];   // opaque at top -> clear at bottom
const BOTTOM_UP = [[0,-1,1],[1,0,0]];  // opaque at bottom -> clear at top
function fadeStuds(studs, transform, end, opacity) {
  if (studs.parent.name && studs.parent.name.startsWith('studs-fade')) return null;
  const parent = studs.parent, idx = parent.children.indexOf(studs);
  const m = figma.createRectangle(); parent.insertChild(idx, m);
  m.name = 'studs-fade/mask'; m.resize(studs.width, studs.height); m.x = studs.x; m.y = studs.y;
  m.fills = [{type:'GRADIENT_LINEAR', gradientTransform: transform,
    gradientStops: [{position:0, color:{r:1,g:1,b:1,a:1}}, {position:end, color:{r:1,g:1,b:1,a:0}}]}];
  m.isMask = true;
  studs.opacity = opacity;
  const g = figma.group([m, studs], parent, idx); g.name = 'studs-fade';
  created.push(m.id, g.id); return g;
}
for (const s of panel.findAll(n => n.name === 'card/studs')) fadeStuds(s, TOP_DOWN, 0.8, 0.85);
const bStuds = panel.findOne(n => n.name === 'bundle/studs');
if (bStuds) fadeStuds(bStuds, BOTTOM_UP, 0.75, 0.6);
// header + close keep full, crisp studs like the reference
for (const n of panel.findAll(n => n.name === 'header/studs' || n.name === 'close/studs')) { n.opacity = 0.85; mutated.push(n.id); }

// 3. bundle sheen: translucent white stripes + glow tile instead of flat yellow
const art = panel.findOne(n => n.name === 'bundle/art');
const shapes = art.findAll(n => n.type === 'VECTOR' || n.type === 'RECTANGLE' || n.type === 'POLYGON');
shapes.forEach((s, i) => {
  const isHalo = i === shapes.length - 1;
  s.fills = [{type:'SOLID', color:{r:1,g:1,b:1}, opacity: isHalo ? 0.38 : 0.22}];
  if (isHalo) { s.strokes = [{type:'SOLID', color:{r:0.85,g:0.6,b:0.02}}]; s.strokeWeight = 6; }
  mutated.push(s.id);
});
return { mutated, created, removed, artShapes: shapes.map(s => s.type + ':' + s.name) };
