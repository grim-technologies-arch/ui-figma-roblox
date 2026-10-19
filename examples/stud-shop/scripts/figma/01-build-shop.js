// use_figma script 1/3 — builds the reference-matched stud shop (verbatim from the 2026-10-18 session, ran clean).
// File-specific values to replace before reuse:
//   '2:2'  -> your 1920x1080 screen frame id (script clears its children first, so it is retry-safe)
//   STUD   -> imageHash of kek_stud.png uploaded via upload_assets (TILE)
//   SCENE  -> imageHash of a game-scene background (blurred + locked as reference only)
// Font: Fredoka One Regular (check listAvailableFontsAsync first).
const FONT = {family:'Fredoka One', style:'Regular'};
await figma.loadFontAsync(FONT);
const screen = await figma.getNodeByIdAsync('2:2');
for (const c of [...screen.children]) c.remove();

const STUD = 'a8f99b5ffb5e1a5fd07c4c3dcac36fa3980f12be';
const SCENE = '0c2c7e5b8255fa9d269909e5840cefec00c9725c';
const hex = h => ({r:parseInt(h.slice(1,3),16)/255, g:parseInt(h.slice(3,5),16)/255, b:parseInt(h.slice(5,7),16)/255});
const shade = (h,k) => { const c = hex(h); return {r:c.r*k, g:c.g*k, b:c.b*k}; };
const OUT = hex('#14161C');
const crisp = d => ({type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:1}, offset:{x:0,y:d}, radius:0, spread:0, visible:true, blendMode:'NORMAL'});
const STUD_SCALE = 0.375;
const G = (nodes, name) => { const g = figma.group(nodes, screen); g.name = name; return g; };

// face -> Ctrl+D duplicate -> arrow-key nudge down -> darker; Outside stroke; optional tiled Overlay studs
function block(name, x, y, w, h, color, {stroke = 4, depth = 10, studs = 0.7, r = 0} = {}) {
  const face = figma.createRectangle(); screen.appendChild(face);
  face.name = name + '/face'; face.resize(w, h); face.x = x; face.y = y; face.cornerRadius = r;
  face.fills = [{type:'SOLID', color:hex(color)}];
  face.strokes = [{type:'SOLID', color:OUT}]; face.strokeWeight = stroke; face.strokeAlign = 'OUTSIDE';
  const d = face.clone(); d.name = name + '/depth';
  screen.insertChild(screen.children.indexOf(face), d);
  d.y = y + depth; d.fills = [{type:'SOLID', color:shade(color, 0.62)}];
  const out = [d, face];
  if (studs) {
    const s = figma.createRectangle(); screen.appendChild(s);
    s.name = name + '/studs'; s.resize(w, h); s.x = x; s.y = y; s.cornerRadius = r;
    s.fills = [{type:'IMAGE', imageHash:STUD, scaleMode:'TILE', scalingFactor:STUD_SCALE}];
    s.blendMode = 'OVERLAY'; s.opacity = studs; out.push(s);
  }
  return out;
}
function styleText(t, stroke, shadow, color = '#FFFFFF') {
  t.fills = [{type:'SOLID', color:hex(color)}];
  t.strokes = [{type:'SOLID', color:OUT}]; t.strokeWeight = stroke; t.strokeAlign = 'OUTSIDE';
  t.effects = [crisp(shadow)];
}
function label(name, chars, x, y, w, h, size, {align = 'CENTER', stroke = 4, shadow = 4, color} = {}) {
  const t = figma.createText(); screen.appendChild(t);
  t.fontName = FONT; t.characters = chars; t.fontSize = size; t.name = name;
  t.textAutoResize = 'NONE'; t.resize(w, h); t.x = x; t.y = y;
  t.textAlignHorizontal = align; t.textAlignVertical = 'CENTER';
  styleText(t, stroke, shadow, color); return t;
}
function autoText(name, chars, size, stroke = 3, shadow = 3) {
  const t = figma.createText(); screen.appendChild(t);
  t.fontName = FONT; t.characters = chars; t.fontSize = size; t.name = name;
  t.textAutoResize = 'WIDTH_AND_HEIGHT'; styleText(t, stroke, shadow); return t;
}
function centerPair(icon, text, cx, cy, gap = 8) {
  const total = icon.width + gap + text.width;
  icon.x = Math.round(cx - total / 2); icon.y = Math.round(cy - icon.height / 2);
  text.x = icon.x + icon.width + gap; text.y = Math.round(cy - text.height / 2);
}
const ROBUX = '<svg width="72" height="79" viewBox="0 0 72 79" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M65.8941 27.46C65.8941 23.9988 64.0476 20.8005 61.0501 19.0699H61.05L40.844 7.4038C37.87 5.68673 34.2111 5.67333 31.2263 7.36357L31.156 7.4038L10.9499 19.0699C7.95244 20.8005 6.10591 23.9988 6.10591 27.46V50.7919C6.10591 54.2531 7.95243 57.4514 10.9499 59.182L31.156 70.848C34.1534 72.5786 37.8466 72.5786 40.844 70.848L61.0501 59.1819C64.0476 57.4513 65.8941 54.2531 65.8941 50.7919V27.46ZM72 50.7919C72 56.4345 68.9897 61.6486 64.1029 64.4699L64.1029 64.4698L43.897 76.1359C39.0103 78.9572 32.9897 78.9572 28.103 76.1359L7.89698 64.4698C3.0103 61.6485 0 56.4345 0 50.7919V27.46C0 21.8174 3.0103 16.6033 7.89698 13.782L28.103 2.11598C32.9897 -0.705327 39.0103 -0.705327 43.897 2.11598L64.103 13.782H64.1029C68.9897 16.6033 72 21.8174 72 27.46V50.7919Z" fill="white"/><path fill-rule="evenodd" d="M31.8073 13.9479C34.4018 12.45 37.5983 12.45 40.1928 13.9479L55.7086 22.9059C58.303 24.4038 59.9013 27.1721 59.9013 30.1679V48.084C59.9013 51.0798 58.303 53.8481 55.7086 55.346L40.1928 64.3039C37.5983 65.8018 34.4018 65.8018 31.8073 64.3039L16.2915 55.346C13.6971 53.8481 12.0988 51.0798 12.0988 48.084V30.1679C12.0988 27.1721 13.6971 24.4038 16.2915 22.9059L31.8073 13.9479ZM30.3012 33.4271V44.8248H41.6989V33.4271H30.3012Z" fill="white"/></svg>';
function robux(h) {
  const n = figma.createNodeFromSvg(ROBUX); screen.appendChild(n);
  n.name = 'icon/robux'; n.fills = []; n.clipsContent = false; n.rescale(h / 79);
  for (const v of n.findAll(c => c.type === 'VECTOR')) { v.strokes = [{type:'SOLID', color:OUT}]; v.strokeWeight = 2; v.strokeAlign = 'OUTSIDE'; }
  n.effects = [crisp(3)]; return n;
}
const SPARK = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -12 Q2 -2 12 0 Q2 2 0 12 Q-2 2 -12 0 Q-2 -2 0 -12Z" fill="#FFFFFF"/>`;
// cushion-cut gem drawn as editable vector so the black outline follows the silhouette
const GEM_SVG = '<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-8 100 100)" stroke-linejoin="round">' +
  '<rect x="20" y="20" width="160" height="160" rx="44" fill="#6F5BFF"/>' +
  '<g stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.5">' +
  '<polygon points="33,33 100,22 100,50" fill="#FFFFFF"/><polygon points="33,33 100,50 50,100 22,100" fill="#D9D2FF"/>' +
  '<polygon points="100,22 167,33 100,50" fill="#C9ECFF"/><polygon points="167,33 178,100 150,100 100,50" fill="#7FC4FF"/>' +
  '<polygon points="178,100 167,167 150,100" fill="#6A4DF0"/><polygon points="167,167 100,178 100,150 150,100" fill="#4A30C8"/>' +
  '<polygon points="100,178 33,167 100,150" fill="#7F5CF5"/><polygon points="33,167 22,100 50,100 100,150" fill="#A98BFF"/>' +
  '<polygon points="100,50 150,100 100,100" fill="#F7F5FF"/><polygon points="100,50 100,100 50,100" fill="#FFFFFF"/>' +
  '<polygon points="50,100 100,100 100,150" fill="#D7CCFF"/><polygon points="100,100 150,100 100,150" fill="#B9A8FF"/></g>' +
  '<rect x="20" y="20" width="160" height="160" rx="44" fill="none" stroke="#14161C" stroke-width="9"/></g>' +
  SPARK(168, 34, 1.1) + SPARK(32, 166, 0.8) + SPARK(150, 150, 0.6) + '</svg>';
function gem(cx, cy, size) {
  const n = figma.createNodeFromSvg(GEM_SVG); screen.appendChild(n);
  n.name = 'icon/gem'; n.fills = []; n.clipsContent = false; n.rescale(size / 200);
  n.x = Math.round(cx - size / 2); n.y = Math.round(cy - size / 2); n.effects = [crisp(5)]; return n;
}
function priceButton(x, y, w, h, price, iconH, size) {
  const b = block('price-button', x, y, w, h, '#45D63A', {stroke:3, depth:6, studs:0});
  const rb = robux(iconH); const t = autoText('price', price, size, 3, 3);
  centerPair(rb, t, x + w / 2, y + h / 2, 10);
  return G([...b, rb, t], 'price-button');
}

// ---------- background (game scene, softened, locked) ----------
const scene = figma.createRectangle(); screen.appendChild(scene);
scene.name = 'bg/scene'; scene.resize(1960, 1120); scene.x = -20; scene.y = -20;
scene.fills = [{type:'IMAGE', imageHash:SCENE, scaleMode:'FILL'}];
scene.effects = [{type:'LAYER_BLUR', radius:14, visible:true}];
const background = G([scene], 'background-reference'); background.locked = true;

// ---------- panel ----------
const P = {x:520, y:148, w:880, h:784};
const panelBase = G(block('panel', P.x, P.y, P.w, P.h, '#474C56', {stroke:4, depth:12, studs:0}), 'panel-base');

const HEAD_H = 104, CLOSE_W = 112;
const header = G([...block('header', P.x, P.y, P.w - CLOSE_W, HEAD_H, '#3CB9F2', {depth:10}),
  label('header-title', 'SHOP!', P.x + 26, P.y, 400, HEAD_H, 66, {align:'LEFT', stroke:5, shadow:5})], 'header');
const close = G([...block('close', P.x + P.w - CLOSE_W, P.y, CLOSE_W, HEAD_H, '#F24848', {depth:10}),
  label('close-label', 'X', P.x + P.w - CLOSE_W, P.y, CLOSE_W, HEAD_H, 66, {stroke:5, shadow:5})], 'close-button');

// ---------- bundle hero card ----------
const bx = P.x + 30, by = P.y + 140, bw = 820, bh = 260;
const bBase = block('bundle', bx, by, bw, bh, '#F6BE18', {depth:10, studs:0});
const mask = figma.createRectangle(); screen.appendChild(mask);
mask.name = 'bundle/mask'; mask.resize(bw, bh); mask.x = bx; mask.y = by; mask.fills = [{type:'SOLID', color:{r:1,g:1,b:1}}]; mask.isMask = true;
const art = figma.createNodeFromSvg(`<svg width="${bw}" height="${bh}" viewBox="0 0 ${bw} ${bh}" xmlns="http://www.w3.org/2000/svg">` +
  '<polygon points="320,0 470,0 380,260 230,260" fill="#FFD84A"/><polygon points="500,0 530,0 440,260 410,260" fill="#FFD84A"/>' +
  '<rect x="545" y="-15" width="290" height="290" rx="60" transform="rotate(-8 690 130)" fill="#FFE27A" stroke="#E0A10A" stroke-width="6"/></svg>');
screen.appendChild(art); art.name = 'bundle/art'; art.fills = []; art.clipsContent = false; art.x = bx; art.y = by;
const bArt = G([mask, art], 'bundle-art (masked)');
const bStuds = figma.createRectangle(); screen.appendChild(bStuds);
bStuds.name = 'bundle/studs'; bStuds.resize(bw, bh); bStuds.x = bx; bStuds.y = by;
bStuds.fills = [{type:'IMAGE', imageHash:STUD, scaleMode:'TILE', scalingFactor:STUD_SCALE}]; bStuds.blendMode = 'OVERLAY'; bStuds.opacity = 0.6;
const bTitle = label('bundle-title', 'BUNDLE', bx + 24, by + 12, 420, 84, 76, {align:'LEFT', stroke:5, shadow:5, color:'#FFE21F'});
const bul1 = autoText('bullet-1', '•  5,000 Gems', 28); bul1.x = bx + 28; bul1.y = by + 100;
const bul2 = autoText('bullet-2', '•  2x Gem Boost (1 hr)', 28); bul2.x = bx + 28; bul2.y = by + 136;
const bPrice = priceButton(bx + 24, by + 180, 280, 64, '499', 38, 44);
const bGem = gem(bx + 690, by + 128, 232);
const bundle = G([...bBase, bArt, bStuds, bTitle, bul1, bul2, bPrice, bGem], 'bundle-card');

// ---------- currency product cards: build one, duplicate twice ----------
const cy0 = P.y + 434, cw = 260, ch = 310, gap = 20;
const PRODUCTS = [{t:'+100 Gems', p:'25'}, {t:'+550 Gems', p:'99'}, {t:'+1,200 Gems', p:'199'}];
const cx0 = bx;
const c0 = G([...block('card', cx0, cy0, cw, ch, '#27A5EC', {depth:10}),
  label('card-title', PRODUCTS[0].t, cx0 + 10, cy0 + 8, cw - 20, 54, 38),
  gem(cx0 + cw / 2, cy0 + 150, 172),
  priceButton(cx0 + 20, cy0 + 244, cw - 40, 50, PRODUCTS[0].p, 30, 34)], 'product-card/100-gems');
const cards = [c0];
for (let i = 1; i < 3; i++) {
  const c = c0.clone(); c.x = c0.x + i * (cw + gap);
  c.name = 'product-card/' + PRODUCTS[i].t.replace(/[^0-9]/g, '') + '-gems';
  c.findOne(n => n.name === 'card-title').characters = PRODUCTS[i].t;
  const pr = c.findOne(n => n.name === 'price'); pr.characters = PRODUCTS[i].p;
  const ox = cx0 + i * (cw + gap);
  centerPair(c.findOne(n => n.name === 'icon/robux'), pr, ox + 20 + (cw - 40) / 2, cy0 + 244 + 25, 10);
  cards.push(c);
}
const productCards = G(cards, 'product-cards');
const shopPanel = G([panelBase, header, close, bundle, productCards], 'shop-panel');

const b = n => ({name:n.name, id:n.id, x:Math.round(n.x), y:Math.round(n.y), w:Math.round(n.width), h:Math.round(n.height)});
return { shopPanel: b(shopPanel), parts: [header, close, bundle, ...cards].map(b), bg: b(background) };
