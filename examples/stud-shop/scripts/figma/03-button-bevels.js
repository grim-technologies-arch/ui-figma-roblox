// use_figma script 3/3 — reference button effects (verbatim, ran clean).
// '7:154' = shop-panel group id; STUD = kek_stud imageHash. Replace before reuse. Idempotent (skips groups that already have bevel/rim).
const panel = await figma.getNodeByIdAsync('7:154');
const STUD = 'a8f99b5ffb5e1a5fd07c4c3dcac36fa3980f12be';
const hex = h => ({r:parseInt(h.slice(1,3),16)/255, g:parseInt(h.slice(3,5),16)/255, b:parseInt(h.slice(5,7),16)/255});
const shade = (h,k) => { const c = hex(h); return {r:c.r*k, g:c.g*k, b:c.b*k}; };
const created = [];

function bevel(group, base, rimHex, {rim = 3, lip = 0.2, sheen = false, studs = 0} = {}) {
  if (group.findOne(n => n.name === 'bevel/rim')) return;
  const face = group.children.find(n => n.name.endsWith('/face'));
  const depth = group.children.find(n => n.name.endsWith('/depth'));
  const {x, y, width:w, height:h} = face;
  let idx = group.children.indexOf(face) + 1;
  const existingStuds = group.children.find(n => n.name.endsWith('/studs'));
  if (existingStuds) idx = group.children.indexOf(existingStuds) + 1;

  if (sheen) {
    // diagonal translucent sheen, clipped to the face with a mask
    const m = figma.createRectangle(); group.insertChild(idx, m);
    m.name = 'sheen/mask'; m.resize(w, h); m.x = x; m.y = y; m.fills = [{type:'SOLID', color:{r:1,g:1,b:1}}]; m.isMask = true;
    const s = figma.createNodeFromSvg(`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">` +
      `<polygon points="${w*0.50},0 ${w*0.70},0 ${w*0.70-h*0.8},${h} ${w*0.50-h*0.8},${h}" fill="#FFFFFF"/>` +
      `<polygon points="${w*0.76},0 ${w*0.80},0 ${w*0.80-h*0.8},${h} ${w*0.76-h*0.8},${h}" fill="#FFFFFF"/></svg>`);
    group.insertChild(idx + 1, s); s.name = 'sheen/stripes'; s.fills = []; s.clipsContent = false; s.x = x; s.y = y;
    for (const v of s.findAll(n => n.type === 'VECTOR')) v.fills = [{type:'SOLID', color:{r:1,g:1,b:1}, opacity:0.2}];
    const sg = figma.group([m, s], group, idx); sg.name = 'sheen'; created.push(sg.id);
    idx++;
  }
  if (studs) {
    // faint studs that fade out toward the top
    const m = figma.createRectangle(); group.insertChild(idx, m);
    m.name = 'studs-fade/mask'; m.resize(w, h); m.x = x; m.y = y; m.isMask = true;
    m.fills = [{type:'GRADIENT_LINEAR', gradientTransform:[[0,-1,1],[1,0,0]],
      gradientStops:[{position:0, color:{r:1,g:1,b:1,a:1}}, {position:0.9, color:{r:1,g:1,b:1,a:0}}]}];
    const t = figma.createRectangle(); group.insertChild(idx + 1, t);
    t.name = 'price-button/studs'; t.resize(w, h); t.x = x; t.y = y;
    t.fills = [{type:'IMAGE', imageHash:STUD, scaleMode:'TILE', scalingFactor:0.375}];
    t.blendMode = 'OVERLAY'; t.opacity = studs;
    const tg = figma.group([m, t], group, idx); tg.name = 'studs-fade'; created.push(tg.id);
    idx++;
  }
  // darker lip along the inside bottom of the face
  const lipH = Math.round(h * lip);
  const l = figma.createRectangle(); group.insertChild(idx, l);
  l.name = 'bevel/lip'; l.resize(w, lipH); l.x = x; l.y = y + h - lipH;
  l.fills = [{type:'SOLID', color:shade(base, 0.8)}];
  const line = figma.createRectangle(); group.insertChild(idx + 1, line);
  line.name = 'bevel/lip-highlight'; line.resize(w, 2); line.x = x; line.y = y + h - lipH;
  line.fills = [{type:'SOLID', color:hex(rimHex)}]; line.opacity = 0.6;
  // light inner rim just inside the dark outline
  const r = figma.createRectangle(); group.insertChild(idx + 2, r);
  r.name = 'bevel/rim'; r.resize(w, h); r.x = x; r.y = y; r.fills = [];
  r.strokes = [{type:'SOLID', color:hex(rimHex)}]; r.strokeWeight = rim; r.strokeAlign = 'INSIDE'; r.opacity = 0.85;
  if (depth) depth.fills = [{type:'SOLID', color:shade(base, 0.45)}];
  created.push(l.id, line.id, r.id);
}

const buttons = panel.findAll(n => n.type === 'GROUP' && n.name === 'price-button');
for (const b of buttons) bevel(b, '#45D63A', '#A6FF8F', {rim: 3, lip: 0.2, sheen: true, studs: 0.35});
bevel(panel.findOne(n => n.name === 'header'), '#3CB9F2', '#A8E9FF', {rim: 4, lip: 0.12});
bevel(panel.findOne(n => n.name === 'close-button'), '#F24848', '#FFA3A3', {rim: 4, lip: 0.12});
return { buttons: buttons.length, created };
