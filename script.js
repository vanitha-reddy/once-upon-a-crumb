(function(){
/* ---------- illustrations ---------- */
const art = {
  cookie:(c)=>`<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="40" fill="${c[0]}"/><circle cx="50" cy="52" r="40" fill="none" stroke="${c[1]}" stroke-width="3" stroke-dasharray="6 9" opacity=".5"/>${[[35,38],[60,34],[66,58],[42,66],[52,50],[28,58]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="4" fill="${c[1]}"/>`).join('')}</svg>`,
  cupcake:(c)=>`<svg viewBox="0 0 100 100"><path d="M24 54h52l-8 38H32z" fill="${c[1]}"/><path d="M34 56l3 34M44 56l1 34M56 56l-1 34M66 56l-3 34" stroke="#00000022" stroke-width="3"/><path d="M20 56c-4-14 8-22 16-20 0-12 12-20 22-14 8-6 22 0 20 12 10 2 12 16 4 22z" fill="${c[0]}"/><circle cx="54" cy="18" r="8" fill="${c[2]}"/><path d="M54 10q4-6 9-6" stroke="#6E9B60" stroke-width="3" fill="none"/></svg>`,
  brownie:(c)=>`<svg viewBox="0 0 100 100"><path d="M14 40l36-16 36 16v34l-36 16-36-16z" fill="${c[1]}"/><path d="M14 40l36 16 36-16-36-16z" fill="${c[0]}"/><path d="M50 56v34" stroke="#00000022" stroke-width="2"/>${[[40,38],[55,33],[60,44],[34,46]].map(([x,y])=>`<path d="M${x} ${y}l4-3 3 4z" fill="${c[2]}"/>`).join('')}</svg>`,
  cake:(c)=>`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="84" rx="40" ry="9" fill="${c[1]}"/><rect x="10" y="40" width="80" height="44" fill="${c[1]}"/><rect x="10" y="58" width="80" height="6" fill="${c[0]}"/><ellipse cx="50" cy="40" rx="40" ry="9" fill="${c[0]}"/>${[22,36,50,64,78].map(x=>`<circle cx="${x}" cy="38" r="4" fill="${c[2]}"/>`).join('')}<rect x="48" y="16" width="4" height="18" fill="${c[2]}"/><path d="M50 6q5 6 0 10q-5-4 0-10" fill="#F2BE4B"/></svg>`,
  macaron:(c)=>`<svg viewBox="0 0 100 100">${[[30,60,c[0]],[62,42,c[2]]].map(([x,y,col])=>`<g transform="translate(${x-30} ${y-50})"><ellipse cx="30" cy="40" rx="24" ry="10" fill="${col}"/><rect x="8" y="46" width="44" height="8" rx="4" fill="${c[1]}"/><ellipse cx="30" cy="58" rx="24" ry="10" fill="${col}"/></g>`).join('')}</svg>`,
  bar:(c)=>`<svg viewBox="0 0 100 100"><rect x="14" y="30" width="72" height="44" rx="8" fill="${c[1]}"/><rect x="14" y="30" width="72" height="16" rx="8" fill="${c[0]}"/>${[[26,38],[46,36],[66,39]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="${c[2]}"/>`).join('')}</svg>`
};

/* ---------- menu data (edit prices and items here) ---------- */
const MENU = [
  {id:'bbcc', name:'Brown Butter Chocolate Chunk', cat:'Cookies', price:3.5, unit:'each', desc:'Nutty brown butter, dark chocolate puddles and a pinch of flaky salt.', tags:[], kind:'cookie', c:['#C98A4B','#3A1E14'], flag:'Bestseller', box:true},
  {id:'pista', name:'Pistachio Rose Shortbread', cat:'Cookies', price:3.75, unit:'each', desc:'Buttery shortbread with crushed pistachio and a hint of rosewater.', tags:['Nuts'], kind:'cookie', c:['#D9C27A','#7FA36A'], box:true},
  {id:'snick', name:'Salted Caramel Snickerdoodle', cat:'Cookies', price:3.5, unit:'each', desc:'Cinnamon-sugar crust with a soft caramel centre.', tags:[], kind:'cookie', c:['#E2B077','#A0612A'], box:true},
  {id:'lemon', name:'Lemon Blueberry Crinkle', cat:'Cookies', price:3.5, unit:'each', desc:'Bright, chewy and dusted in powdered sugar. Made with almond flour.', tags:['GF','Nuts'], kind:'cookie', c:['#F4E3A3','#4B4C9A'], box:true},
  {id:'chai', name:'Masala Chai Sugar Cookie', cat:'Cookies', price:3.5, unit:'each', desc:'Cardamom, ginger and cinnamon with a chai glaze.', tags:['Vegan'], kind:'cookie', c:['#D6A673','#7A4A2A'], box:true},
  {id:'straw', name:'Strawberry Shortcake Cupcake', cat:'Cupcakes', price:4.25, unit:'each', desc:'Vanilla sponge, fresh strawberry filling and whipped mascarpone.', tags:[], kind:'cupcake', c:['#F7B6C6','#F2D9A8','#E0445E'], flag:'New'},
  {id:'mango', name:'Mango Lassi Cupcake', cat:'Cupcakes', price:4.25, unit:'each', desc:'Mango and yogurt cake with cardamom cream cheese frosting.', tags:[], kind:'cupcake', c:['#FFD27A','#F5E6C4','#F29B38']},
  {id:'cocoa', name:'Double Cocoa Cupcake', cat:'Cupcakes', price:4.0, unit:'each', desc:'Dark chocolate cake under a cloud of fudge frosting.', tags:['Vegan'], kind:'cupcake', c:['#6B3A2A','#3A1E14','#E0445E']},
  {id:'fudge', name:'Fudgy Sea Salt Brownie', cat:'Brownies', price:4.0, unit:'each', desc:'Crackly top, molten middle, finished with Maldon salt.', tags:[], kind:'brownie', c:['#5A2E1F','#3A1C12','#F5EFE6'], flag:'Bestseller'},
  {id:'biscoff', name:'Biscoff Blondie', cat:'Brownies', price:4.0, unit:'each', desc:'Brown sugar blondie swirled with cookie butter.', tags:[], kind:'bar', c:['#E4B06C','#C98A4B','#8A4E22']},
  {id:'cele', name:'Celebration Cake', cat:'Cakes', price:42, unit:'6-inch, serves 8', desc:'Vanilla bean layers, berry jam and buttercream. Add a message in the notes.', tags:[], kind:'cake', c:['#F7C3CF','#FFF6EE','#E0445E'], lead:5},
  {id:'rasm', name:'Rasmalai Tres Leches', cat:'Cakes', price:48, unit:'8-inch, serves 12', desc:'Saffron milk-soaked sponge with pistachio and rose petals.', tags:['Nuts'], kind:'cake', c:['#F3D58C','#FFF4DE','#7FA36A'], lead:5, flag:'Pre-order favourite'},
  {id:'mac', name:'Macaron Box', cat:'Boxes', price:28, unit:'box of 12', desc:'Raspberry, pistachio, salted caramel and earl grey, three of each.', tags:['GF','Nuts'], kind:'macaron', c:['#F59BB0','#FFF3E6','#A8D08D']}
];
const CATEGORIES = ['All','Cookies','Cupcakes','Brownies','Cakes','Boxes'];
const BOX_PRICE = 19, BOX_SIZE = 6, BASE_LEAD = 2, CAKE_LEAD = 5;
const byId = Object.fromEntries(MENU.map(m=>[m.id,m]));
const money = n => '$' + n.toFixed(2);
const esc = s => String(s).replace(/[<>&"]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]));

/* ---------- state ---------- */
let bag = load('sd-bag', []);          // [{key, id?, box?:[ids], qty}]
let boxSlots = [];
let filter = 'All';
let pickup = {date:null, time:null};
let step = 'bag';                       // bag | done
function load(k, d){ try{ const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v.filter(validLine) : d; }catch(e){ return d; } }
function validLine(l){ return l && l.qty > 0 && (l.box ? l.box.every(i=>byId[i]) : byId[l.id]); }
function save(){ try{ localStorage.setItem('sd-bag', JSON.stringify(bag)); }catch(e){} }

/* ---------- cutoff clock: orders close Thursday 8 pm for that weekend ---------- */
function nextCutoff(now){
  const d = new Date(now); d.setHours(20,0,0,0);
  const add = (4 - d.getDay() + 7) % 7; d.setDate(d.getDate() + add);
  if (d <= now) d.setDate(d.getDate() + 7);
  return d;
}
function tick(){
  const now = new Date(), end = nextCutoff(now);
  let s = Math.max(0, Math.floor((end - now)/1000));
  const dd = Math.floor(s/86400); s%=86400;
  const hh = Math.floor(s/3600); s%=3600;
  const mm = Math.floor(s/60), ss = s%60;
  const p = n => String(n).padStart(2,'0');
  document.getElementById('cd-d').textContent = dd;
  document.getElementById('cd-h').textContent = p(hh);
  document.getElementById('cd-m').textContent = p(mm);
  document.getElementById('cd-s').textContent = p(ss);
  const fri = new Date(end); fri.setDate(end.getDate()+1);
  const sat = new Date(end); sat.setDate(end.getDate()+2);
  const f = d => d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
  document.getElementById('cutoffTitle').textContent = `Orders close Thursday ${f(end)} at 8 pm`;
  document.getElementById('cutoffNote').textContent = `For pickup Friday ${f(fri)} (4–7 pm) or Saturday ${f(sat)} (10 am–2 pm).`;
}
tick(); setInterval(tick, 1000);

/* ---------- ticker ---------- */
const tickerItems = ['Fresh every Friday & Saturday',"Cakes need 5 days' notice",'Mix & match 6 cookies for $19','Vegan and gluten-free options','Pay at pickup'];
document.getElementById('ticker').innerHTML = [...tickerItems,...tickerItems].map(t=>`<span>✦ ${esc(t)}</span>`).join('');

/* ---------- menu ---------- */
const chipsEl = document.getElementById('chips');
chipsEl.innerHTML = CATEGORIES.map(c=>`<button class="chip" type="button" data-cat="${c}" aria-pressed="${c===filter}">${c}</button>`).join('');
chipsEl.addEventListener('click', e=>{
  const b = e.target.closest('.chip'); if(!b) return;
  filter = b.dataset.cat;
  chipsEl.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed', x===b));
  renderMenu();
});
function renderMenu(){
  const items = MENU.filter(m=>filter==='All'||m.cat===filter);
  document.getElementById('grid').innerHTML = items.map(m=>`
    <article class="card">
      <div class="art">${m.flag?`<span class="badge">${m.flag}</span>`:''}${art[m.kind](m.c)}</div>
      <div class="body">
        <h3>${m.name}</h3>
        <p>${m.desc}</p>
        <div class="tags">${m.tags.map(t=>`<span class="tag">${t}</span>`).join('')}${m.lead?`<span class="tag lead">${m.lead} days' notice</span>`:''}</div>
        <div class="buy"><span class="price">${money(m.price)} <small>${m.unit}</small></span>
          <button class="add" type="button" data-add="${m.id}">Add</button></div>
      </div>
    </article>`).join('');
}
renderMenu();
document.getElementById('grid').addEventListener('click', e=>{
  const b = e.target.closest('[data-add]'); if(!b) return;
  addItem(b.dataset.add);
  fly(b);
  b.textContent='Added ✓'; b.classList.add('done');
  setTimeout(()=>{ b.textContent='Add'; b.classList.remove('done'); }, 1100);
});

function addItem(id){
  const line = bag.find(l=>l.id===id);
  if(line) line.qty++; else bag.push({key:id, id, qty:1});
  afterChange(`${byId[id].name} added`);
}
function afterChange(msg){
  save(); renderCount();
  if(msg) toast(msg);
  if(drawer.classList.contains('open')) renderDrawer();
}

/* ---------- box builder ---------- */
const flavorsEl = document.getElementById('flavors'), slotsEl = document.getElementById('slots');
const boxable = MENU.filter(m=>m.box);
flavorsEl.innerHTML = boxable.map(m=>`<button class="flavor" type="button" data-fl="${m.id}">${art.cookie(m.c)}<span class="n">${m.name}</span><span class="k" data-k="${m.id}">×0</span></button>`).join('');
flavorsEl.addEventListener('click', e=>{
  const b = e.target.closest('[data-fl]'); if(!b) return;
  if(boxSlots.length>=BOX_SIZE){ toast('Your box is full. Tap a cookie to swap it out.'); return; }
  boxSlots.push(b.dataset.fl); renderBox();
});
slotsEl.addEventListener('click', e=>{
  const s = e.target.closest('.slot.filled'); if(!s) return;
  boxSlots.splice(+s.dataset.i,1); renderBox();
});
document.getElementById('boxSurprise').addEventListener('click', ()=>{
  boxSlots = Array.from({length:BOX_SIZE}, ()=>boxable[Math.floor(Math.random()*boxable.length)].id);
  renderBox();
});
document.getElementById('boxAdd').addEventListener('click', e=>{
  const flavors = [...boxSlots].sort();
  const key = 'box:' + flavors.join(',');
  const line = bag.find(l=>l.key===key);
  if(line) line.qty++; else bag.push({key, box:flavors, qty:1});
  fly(e.currentTarget);
  boxSlots = []; renderBox();
  afterChange('Cookie box added');
});
function renderBox(){
  slotsEl.innerHTML = Array.from({length:BOX_SIZE},(_,i)=>{
    const id = boxSlots[i];
    return id ? `<button class="slot filled" type="button" data-i="${i}" aria-label="Remove ${byId[id].name}">${art.cookie(byId[id].c)}<span class="x">✕</span></button>`
              : `<div class="slot" aria-hidden="true"></div>`;
  }).join('');
  boxable.forEach(m=>{ document.querySelector(`[data-k="${m.id}"]`).textContent = '×' + boxSlots.filter(x=>x===m.id).length; });
  document.getElementById('boxMeter').textContent = `${boxSlots.length} of ${BOX_SIZE} filled`;
  document.getElementById('boxAdd').disabled = boxSlots.length < BOX_SIZE;
}
renderBox();

/* ---------- bag / drawer ---------- */
const drawer = document.getElementById('drawer'), scrim = document.getElementById('scrim');
function openBag(){ step = 'bag'; renderDrawer(); drawer.classList.add('open'); scrim.classList.add('open'); drawer.setAttribute('aria-hidden','false'); document.getElementById('closeBag').focus(); }
function closeBag(){ drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
document.getElementById('bagBtn').addEventListener('click', openBag);
document.getElementById('closeBag').addEventListener('click', closeBag);
scrim.addEventListener('click', closeBag);
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeBag(); });

const lineInfo = l => l.box
  ? {name:'Mix & match cookie box', sub: summarize(l.box), price:BOX_PRICE, art:art.cookie(byId[l.box[0]].c), lead:BASE_LEAD}
  : {name:byId[l.id].name, sub:byId[l.id].unit, price:byId[l.id].price, art:art[byId[l.id].kind](byId[l.id].c), lead:byId[l.id].lead||BASE_LEAD};
function summarize(ids){ const c={}; ids.forEach(i=>c[i]=(c[i]||0)+1); return Object.entries(c).map(([i,n])=>`${n}× ${byId[i].name.split(' ').slice(-2).join(' ')}`).join(', '); }
const itemsCount = () => bag.reduce((a,l)=>a+l.qty,0);
const subtotal = () => bag.reduce((a,l)=>a+lineInfo(l).price*l.qty,0);
const leadDays = () => bag.reduce((a,l)=>Math.max(a,lineInfo(l).lead), BASE_LEAD);
function renderCount(){
  const b = document.getElementById('bagBtn');
  document.getElementById('bagCount').textContent = itemsCount();
  b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}

function pickupDates(){
  // Fridays and Saturdays at least `lead` days out, next 6 options
  const out = [], lead = leadDays();
  const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+lead);
  while(out.length<6){ if(d.getDay()===5||d.getDay()===6) out.push(new Date(d)); d.setDate(d.getDate()+1); }
  return out;
}
const SLOTS = {5:['4:00 pm','5:00 pm','6:00 pm'], 6:['10:00 am','11:00 am','12:00 pm','1:00 pm']};

function renderDrawer(){
  const body = document.getElementById('dBody'), foot = document.getElementById('dFoot');
  if(step==='done') return;
  document.getElementById('dTitle').textContent = 'Your bag';
  if(!bag.length){
    body.innerHTML = `<div class="empty"><b>Your bag is empty</b>Add a few treats from the menu, or build a cookie box, and they'll show up here.</div>`;
    foot.innerHTML = `<a class="btn primary" href="#menu" id="toMenu">Browse the menu</a>`;
    document.getElementById('toMenu').onclick = closeBag;
    return;
  }
  keepForm();
  const dates = pickupDates();
  if(pickup.date && !dates.some(d=>d.getTime()===pickup.date)) pickup = {date:null,time:null};
  const lines = bag.map((l,i)=>{ const x=lineInfo(l); return `
    <div class="line"><div class="thumb">${x.art}</div>
      <div style="min-width:0"><div class="nm">${x.name}</div><div class="sm">${x.sub}</div>
        <div class="qty"><button type="button" data-q="${i}" data-d="-1" aria-label="One fewer">−</button><span>${l.qty}</span><button type="button" data-q="${i}" data-d="1" aria-label="One more">+</button></div></div>
      <div class="lp">${money(x.price*l.qty)}</div></div>`; }).join('');
  const sel = pickup.date ? new Date(pickup.date) : null;
  body.innerHTML = `
    ${lines}
    <fieldset><legend>Pickup day</legend>
      <div class="dates">${dates.map(d=>`<button type="button" class="date" data-date="${d.getTime()}" aria-pressed="${pickup.date===d.getTime()}"><small>${d.toLocaleDateString(undefined,{weekday:'short'})}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString(undefined,{month:'short'})}</small></button>`).join('')}</div>
      <p class="hint">${leadDays()>BASE_LEAD?`Your bag has a cake, so the earliest pickup is ${CAKE_LEAD} days out.`:"Orders need 2 days' notice."}</p>
    </fieldset>
    ${sel?`<fieldset><legend>Pickup time</legend><div class="times">${SLOTS[sel.getDay()].map(t=>`<button type="button" class="chip" data-time="${t}" aria-pressed="${pickup.time===t}">${t}</button>`).join('')}</div></fieldset>`:''}
    <fieldset><legend>Your details</legend>
      <label class="f">Name<input id="oName" autocomplete="name" placeholder="Priya Sharma"></label>
      <label class="f">Phone<input id="oPhone" type="tel" autocomplete="tel" placeholder="(555) 014-2290"></label>
      <label class="f">Notes for the baker<textarea id="oNotes" rows="2" placeholder="Cake message, allergies, gift wrap…"></textarea></label>
    </fieldset>
    <p class="err" id="oErr" hidden></p>`;
  const sub = subtotal();
  foot.innerHTML = `
    <div class="sumrow"><span>${itemsCount()} item${itemsCount()===1?'':'s'}</span><span>${money(sub)}</span></div>
    <div class="sumrow total"><span>Pay at pickup</span><span>${money(sub)}</span></div>
    <button class="btn primary" id="placeOrder" type="button">Place pre-order</button>`;
  restoreForm();
  body.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{
    const l = bag[+b.dataset.q]; l.qty += +b.dataset.d;
    if(l.qty<=0) bag.splice(+b.dataset.q,1);
    afterChange();
  });
  body.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{ pickup={date:+b.dataset.date,time:null}; renderDrawer(); });
  body.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{ pickup.time=b.dataset.time; renderDrawer(); });
  document.getElementById('placeOrder').onclick = placeOrder;
}
let formDraft = {};
function keepForm(){ ['oName','oPhone','oNotes'].forEach(id=>{ const el=document.getElementById(id); if(el) formDraft[id]=el.value; }); }
function restoreForm(){ Object.entries(formDraft).forEach(([id,v])=>{ const el=document.getElementById(id); if(el) el.value=v; }); }

function placeOrder(){
  keepForm();
  const err = document.getElementById('oErr');
  const name = (formDraft.oName||'').trim(), phone = (formDraft.oPhone||'').trim();
  const problem = !pickup.date ? 'Choose a pickup day.' : !pickup.time ? 'Choose a pickup time.' : !name ? 'Add your name so we can label your box.' : phone.replace(/\D/g,'').length<7 ? 'Add a phone number we can text when your order is ready.' : '';
  if(problem){ err.textContent = problem; err.hidden = false; return; }
  const code = 'SD-' + Math.random().toString(36).slice(2,6).toUpperCase().padEnd(4,'0');
  const d = new Date(pickup.date);
  const items = bag.map(l=>{ const x=lineInfo(l); return `<li><span>${l.qty}× ${x.name}</span><span>${money(x.price*l.qty)}</span></li>`; }).join('');
  const total = subtotal();
  step = 'done';
  document.getElementById('dTitle').textContent = 'Order placed';
  document.getElementById('dBody').innerHTML = `
    <div class="ticket">
      <h3>Thank you, ${esc(name.split(' ')[0])}!</h3>
      <div>Order code <span class="code">${code}</span></div>
      <ul>${items}</ul>
      <div class="sumrow total"><span>Due at pickup</span><span>${money(total)}</span></div>
      <p>Pickup: ${d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})} at ${pickup.time}</p>
      <p class="hint">We'll text ${esc(phone)} with the pickup address the day before.</p>
    </div>`;
  document.getElementById('dFoot').innerHTML = `<button class="btn primary" id="again" type="button">Start a new order</button>`;
  document.getElementById('again').onclick = ()=>{ step='bag'; closeBag(); };
  bag = []; pickup = {date:null,time:null}; formDraft = {}; save(); renderCount();
}

/* ---------- little delights ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function fly(from){
  if(reduce) return;
  const a = from.getBoundingClientRect(), b = document.getElementById('bagBtn').getBoundingClientRect();
  const dot = document.createElement('div'); dot.className='flyer';
  dot.style.left = a.left + a.width/2 - 9 + 'px'; dot.style.top = a.top + a.height/2 - 9 + 'px';
  document.body.appendChild(dot);
  dot.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${(b.left+b.width/2)-(a.left+a.width/2)}px,${(b.top+b.height/2)-(a.top+a.height/2)}px) scale(.4)`}],{duration:600,easing:'cubic-bezier(.5,-0.3,.7,1)'}).onfinish=()=>dot.remove();
}
let tt;
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),1800); }

renderCount();
})();
