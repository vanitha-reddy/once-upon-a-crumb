(function(){
/* ---------- illustrations ---------- */
const art = {
  cookie:(c)=>`<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="40" fill="${c[0]}"/><circle cx="50" cy="52" r="40" fill="none" stroke="${[].concat(c[1])[0]}" stroke-width="3" stroke-dasharray="6 9" opacity=".5"/>${[[35,38],[60,34],[66,58],[42,66],[52,50],[28,58]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="4" fill="${[].concat(c[1])[i%[].concat(c[1]).length]}"/>`).join('')}</svg>`,
  cupcake:(c)=>`<svg viewBox="0 0 100 100"><path d="M24 54h52l-8 38H32z" fill="${c[1]}"/><path d="M34 56l3 34M44 56l1 34M56 56l-1 34M66 56l-3 34" stroke="#00000022" stroke-width="3"/><path d="M20 56c-4-14 8-22 16-20 0-12 12-20 22-14 8-6 22 0 20 12 10 2 12 16 4 22z" fill="${c[0]}"/><circle cx="54" cy="18" r="8" fill="${c[2]}"/><path d="M54 10q4-6 9-6" stroke="#6E9B60" stroke-width="3" fill="none"/></svg>`,
  brownie:(c)=>`<svg viewBox="0 0 100 100"><path d="M14 40l36-16 36 16v34l-36 16-36-16z" fill="${c[1]}"/><path d="M14 40l36 16 36-16-36-16z" fill="${c[0]}"/><path d="M50 56v34" stroke="#00000022" stroke-width="2"/>${[[40,38],[55,33],[60,44],[34,46]].map(([x,y])=>`<path d="M${x} ${y}l4-3 3 4z" fill="${c[2]}"/>`).join('')}</svg>`,
  cake:(c)=>`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="84" rx="40" ry="9" fill="${c[1]}"/><rect x="10" y="40" width="80" height="44" fill="${c[1]}"/><rect x="10" y="58" width="80" height="6" fill="${c[0]}"/><ellipse cx="50" cy="40" rx="40" ry="9" fill="${c[0]}"/>${[22,36,50,64,78].map(x=>`<circle cx="${x}" cy="38" r="4" fill="${c[2]}"/>`).join('')}<rect x="48" y="16" width="4" height="18" fill="${c[2]}"/><path d="M50 6q5 6 0 10q-5-4 0-10" fill="#F2BE4B"/></svg>`,
  macaron:(c)=>`<svg viewBox="0 0 100 100">${[[30,60,c[0]],[62,42,c[2]]].map(([x,y,col])=>`<g transform="translate(${x-30} ${y-50})"><ellipse cx="30" cy="40" rx="24" ry="10" fill="${col}"/><rect x="8" y="46" width="44" height="8" rx="4" fill="${c[1]}"/><ellipse cx="30" cy="58" rx="24" ry="10" fill="${col}"/></g>`).join('')}</svg>`,
  bar:(c)=>`<svg viewBox="0 0 100 100"><rect x="14" y="30" width="72" height="44" rx="8" fill="${c[1]}"/><rect x="14" y="30" width="72" height="16" rx="8" fill="${c[0]}"/>${[[26,38],[46,36],[66,39]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="${c[2]}"/>`).join('')}</svg>`
};

/* ---------- menu data (edit treats and prices here) ---------- */
// disc: the coloured circle each treat sits on (butter, lav, pink, sky, mint, peach)
// img: optional photo path, e.g. 'images/nutella.png'; without one the drawn cookie is used
// Prices are placeholders until confirmed.
const MENU = [
  {id:'nutella', name:'Nutella Hazelnut', short:'Nutella hazelnut', cat:'Cookies', price:3.5, unit:'each', desc:'A golden cookie crowned with a pool of Nutella and a scatter of chopped toasted hazelnuts.', tags:['Nuts'], kind:'cookie', c:['#B9783F','#4A2416'], disc:'butter', img:'images/nutella-hazelnut.png', flag:'Bestseller', box:true},
  {id:'kinder', name:'Kinder Bueno', short:'Kinder Bueno', cat:'Cookies', price:3.5, unit:'each', desc:'Chunky cookie topped with Kinder Bueno pieces and a drizzle of hazelnut cream.', tags:['Nuts'], kind:'cookie', c:['#D9A866',['#F5EBDD','#6B3A1F']], disc:'sky', img:'images/kinder-bueno.png', box:true},
  {id:'biscoff', name:'Lotus Biscoff', short:'Lotus Biscoff', cat:'Cookies', price:3.5, unit:'each', desc:'Brown sugar cookie with a whole Lotus biscuit on top and drips of Biscoff caramel.', tags:[], kind:'cookie', c:['#C98A4B','#8A4E22'], disc:'pink', img:'images/lotus-biscoff.png', box:true},
  {id:'oreo', name:'Oreo Cookies and Cream', short:'Oreo cookies and cream', cat:'Cookies', price:3.5, unit:'each', desc:'Studded with Oreo crumbs, filled with cookies-and-cream and topped with half an Oreo.', tags:[], kind:'cookie', c:['#2E2220','#F5EFE6'], disc:'lav', img:'images/oreo-cookies-and-cream.png', flag:'New', box:true},
  {id:'toffee', name:'Toffee Chocolate Chunk', short:'Toffee choc chunk', cat:'Cookies', price:3.5, unit:'each', desc:'Buttery cookie packed with dark chocolate chunks and chewy pieces of toffee.', tags:[], kind:'cookie', c:['#D9A15E',['#3A1E14','#E2A23B']], disc:'mint', img:'images/toffee-chocolate-chunk.png', box:true}
];
// Filters only show for categories that have treats on the menu
const CATEGORIES = ['All', ...['Cookies','Cupcakes','Brownies','Cakes','Boxes'].filter(c=>MENU.some(m=>m.cat===c))];
const BOX_PRICE = 19, BOX_SIZE = 6, BASE_LEAD = 2, CAKE_LEAD = 5;
const SLOTS = {5:['4 to 5 pm','5 to 6 pm','6 to 7 pm'], 6:['10 to 11 am','11 am to 12 pm','12 to 1 pm','1 to 2 pm']};
const byId = Object.fromEntries(MENU.map(m=>[m.id,m]));
const boxable = MENU.filter(m=>m.box);
const $ = id => document.getElementById(id);
const money = n => '$' + n.toFixed(2);
const esc = s => String(s).replace(/[<>&"]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]));
const pic = (m, kind) => m.img ? `<img src="${m.img}" alt="">` : art[kind||m.kind](m.c);
const plate = (m, kind) => `<div class="plate" style="background:var(--${m.disc})">${pic(m, kind)}</div>`;
const stepper = (attrs, n, {min=0, maxed=false, label=''}={}) => `
  <div class="stepper"><button type="button" ${attrs} data-d="-1" aria-label="One fewer ${label}" ${n<=min?'disabled':''}>−</button><output>${n}</output><button type="button" class="plus" ${attrs} data-d="1" aria-label="One more ${label}" ${maxed?'disabled':''}>+</button></div>`;

/* ---------- state ---------- */
let bag = load();                       // [{key, id?, box?:[ids], qty}]
let boxSlots = [];
let filter = 'All';
let pickup = {date:null, time:null};
let step = 'bag';                       // bag | when | done
let form = {name:'', phone:'', notes:''};
function load(){ try{ const v = JSON.parse(localStorage.getItem('sd-bag')); return Array.isArray(v) ? v.filter(l=>l && l.qty>0 && (l.box ? l.box.every(i=>byId[i]) : byId[l.id])) : []; }catch(e){ return []; } }
function save(){ try{ localStorage.setItem('sd-bag', JSON.stringify(bag)); }catch(e){} }

/* ---------- header ---------- */
const burger = $('burger'), navLinks = $('navLinks');
burger.addEventListener('click', ()=>{ const open = navLinks.classList.toggle('open'); burger.setAttribute('aria-expanded', open); });
navLinks.addEventListener('click', e=>{ if(e.target.closest('a')){ navLinks.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

/* ---------- hero plates ---------- */
const strip = offset => Array.from({length:7}, (_,i)=>plate(MENU[(i+offset)%MENU.length])).join('');
$('platesTop').innerHTML = strip(0);
$('platesBottom').innerHTML = strip(3);

/* ---------- cutoff clock: orders close Thursday 8 pm for that weekend ---------- */
function nextCutoff(now){
  const d = new Date(now); d.setHours(20,0,0,0);
  d.setDate(d.getDate() + (4 - d.getDay() + 7) % 7);
  if (d <= now) d.setDate(d.getDate() + 7);
  return d;
}
function tick(){
  const now = new Date(), end = nextCutoff(now);
  let s = Math.max(0, Math.floor((end - now)/1000));
  const dd = Math.floor(s/86400); s%=86400;
  const hh = Math.floor(s/3600); s%=3600;
  const p = n => String(n).padStart(2,'0');
  $('cd-d').textContent = dd;
  $('cd-h').textContent = p(hh);
  $('cd-m').textContent = p(Math.floor(s/60));
  $('cd-s').textContent = p(s%60);
  const fri = new Date(end); fri.setDate(end.getDate()+1);
  const sat = new Date(end); sat.setDate(end.getDate()+2);
  const f = d => d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
  $('cutoffTitle').textContent = `Orders close Thursday ${f(end)} at 8 pm`;
  $('cutoffNote').textContent = `For pickup Friday ${f(fri)}, 4 to 7 pm, or Saturday ${f(sat)}, 10 am to 2 pm.`;
}
tick(); setInterval(tick, 1000);

/* ---------- menu ---------- */
const chipsEl = $('chips');
chipsEl.hidden = CATEGORIES.length <= 2;
chipsEl.innerHTML = CATEGORIES.map(c=>`<button class="pill" type="button" data-cat="${c}" aria-pressed="${c===filter}">${c}</button>`).join('');
chipsEl.addEventListener('click', e=>{
  const b = e.target.closest('[data-cat]'); if(!b) return;
  filter = b.dataset.cat;
  chipsEl.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed', x===b));
  renderMenu();
});
const qtyOf = id => (bag.find(l=>l.id===id)||{qty:0}).qty;
function renderMenu(){
  $('grid').innerHTML = MENU.filter(m=>filter==='All'||m.cat===filter).map(m=>`
    <article class="item">
      <div class="plate" style="background:var(--${m.disc})">${pic(m)}${m.flag?`<span class="flag">${m.flag}</span>`:''}</div>
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
      ${m.tags.length||m.lead?`<div class="meta">${m.tags.map(t=>`<span>${t}</span>`).join('')}${m.lead?`<span class="notice">${m.lead} days' notice</span>`:''}</div>`:''}
      <div class="price">${money(m.price)} <small>${m.unit}</small></div>
      ${stepper(`data-item="${m.id}"`, qtyOf(m.id), {label:m.name})}
    </article>`).join('');
}
$('grid').addEventListener('click', e=>{
  const b = e.target.closest('[data-item]'); if(!b) return;
  const id = b.dataset.item, d = +b.dataset.d;
  let line = bag.find(l=>l.id===id);
  if(!line){ line = {key:id, id, qty:0}; bag.push(line); }
  line.qty += d;
  if(line.qty<=0) bag = bag.filter(l=>l!==line);
  if(d>0) fly(b);
  changed(d>0 && line.qty===1 ? `${byId[id].name} is in your bag` : '');
});

/* ---------- box builder ---------- */
const countIn = id => boxSlots.filter(x=>x===id).length;
function renderBox(){
  const full = boxSlots.length >= BOX_SIZE;
  $('flavors').innerHTML = boxable.map(m=>`
    <div class="flavor">${plate(m,'cookie')}<h4>${m.short}</h4><p>${m.tags.join(' · ') || 'Classic'}</p>
      ${stepper(`data-fl="${m.id}"`, countIn(m.id), {maxed:full, label:m.name})}</div>`).join('');
  $('slots').innerHTML = Array.from({length:BOX_SIZE},(_,i)=>{
    const id = boxSlots[i];
    return id ? `<button class="slot filled" type="button" data-i="${i}" style="background:var(--${byId[id].disc})" aria-label="Take out ${byId[id].name}">${pic(byId[id],'cookie')}</button>`
              : `<div class="slot" aria-hidden="true"></div>`;
  }).join('');
  $('boxMeter').textContent = `${boxSlots.length} of ${BOX_SIZE}`;
  const left = BOX_SIZE - boxSlots.length;
  $('boxAdd').disabled = left > 0;
  $('boxAdd').textContent = left > 0 ? `Pick ${left} more` : 'Add box to bag';
  $('boxSurprise').textContent = full ? 'Shuffle it' : boxSlots.length ? 'Fill the rest for me' : 'Surprise me';
}
$('flavors').addEventListener('click', e=>{
  const b = e.target.closest('[data-fl]'); if(!b) return;
  const id = b.dataset.fl;
  if(+b.dataset.d > 0){ if(boxSlots.length < BOX_SIZE) boxSlots.push(id); }
  else { const i = boxSlots.lastIndexOf(id); if(i>-1) boxSlots.splice(i,1); }
  renderBox();
});
$('slots').addEventListener('click', e=>{
  const s = e.target.closest('.slot.filled'); if(!s) return;
  boxSlots.splice(+s.dataset.i,1); renderBox();
});
$('boxSurprise').addEventListener('click', ()=>{
  if(boxSlots.length >= BOX_SIZE) boxSlots = [];
  while(boxSlots.length < BOX_SIZE) boxSlots.push(boxable[Math.floor(Math.random()*boxable.length)].id);
  renderBox();
});
$('boxAdd').addEventListener('click', e=>{
  const flavors = [...boxSlots].sort();
  const key = 'box:' + flavors.join(',');
  const line = bag.find(l=>l.key===key);
  if(line) line.qty++; else bag.push({key, box:flavors, qty:1});
  fly(e.currentTarget);
  boxSlots = []; renderBox();
  changed('Cookie box added to your bag');
});

/* ---------- bag maths ---------- */
const lineInfo = l => l.box
  ? {name:'Mix & match cookie box', sub:summarize(l.box), price:BOX_PRICE, m:byId[l.box[0]], kind:'cookie', lead:BASE_LEAD}
  : {name:byId[l.id].name, sub:byId[l.id].unit, price:byId[l.id].price, m:byId[l.id], kind:byId[l.id].kind, lead:byId[l.id].lead||BASE_LEAD};
function summarize(ids){ const c={}; ids.forEach(i=>c[i]=(c[i]||0)+1); return Object.entries(c).map(([i,n])=>`${n}× ${byId[i].short}`).join(', '); }
const itemsCount = () => bag.reduce((a,l)=>a+l.qty,0);
const subtotal = () => bag.reduce((a,l)=>a+lineInfo(l).price*l.qty,0);
const leadDays = () => bag.reduce((a,l)=>Math.max(a,lineInfo(l).lead), BASE_LEAD);
const plural = n => `${n} item${n===1?'':'s'}`;

function changed(msg){
  save(); renderMenu(); renderChrome();
  if(msg) toast(msg);
  if(drawer.classList.contains('open')) renderDrawer();
}
function renderChrome(){
  const n = itemsCount(), b = $('bagBtn');
  $('bagCount').textContent = n;
  b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  $('dockTotal').textContent = money(subtotal());
  $('dockCount').textContent = n ? `${plural(n)} in your bag` : 'Your bag is empty';
  $('dockBtn').disabled = !n;
  $('dock').classList.toggle('away', !n);
  $('dockBtn').textContent = n ? 'Choose a pickup' : 'Add a treat';
}

/* ---------- drawer ---------- */
const drawer = $('drawer'), scrim = $('scrim');
function openBag(toStep){ step = toStep || 'bag'; if(!bag.length) step = 'bag'; renderDrawer(); drawer.classList.add('open'); scrim.classList.add('open'); drawer.setAttribute('aria-hidden','false'); $('closeBag').focus(); }
function closeBag(){ drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); if(step==='done') step='bag'; }
$('bagBtn').addEventListener('click', ()=>openBag('bag'));
$('dockBtn').addEventListener('click', ()=>openBag('when'));
$('closeBag').addEventListener('click', closeBag);
scrim.addEventListener('click', closeBag);
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && drawer.classList.contains('open')) closeBag(); });
$('steps').addEventListener('click', e=>{ const b = e.target.closest('[data-step]'); if(!b || b.disabled) return; step = b.dataset.step; renderDrawer(); });

function pickupDates(){
  // Fridays and Saturdays at least `lead` days out, next 6 options
  const out = [], d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+leadDays());
  while(out.length<6){ if(d.getDay()===5||d.getDay()===6) out.push(new Date(d)); d.setDate(d.getDate()+1); }
  return out;
}

function renderSteps(){
  $('steps').hidden = step==='done';
  $('steps').querySelectorAll('[data-step]').forEach(b=>{
    if(b.dataset.step===step) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current');
    b.disabled = b.dataset.step==='when' && !bag.length;
  });
}

function renderDrawer(){
  if(step==='done') return;
  if(!bag.length) step = 'bag';
  renderSteps();
  const body = $('dBody'), foot = $('dFoot');
  if(!bag.length){
    body.innerHTML = `<div class="empty"><b>Your bag is empty</b>Add a few treats from the menu, or build a cookie box, and they'll show up here.</div>`;
    foot.innerHTML = `<a class="pill coral block" href="#menu" id="toMenu">See the menu</a>`;
    $('toMenu').onclick = closeBag;
    return;
  }
  const sub = subtotal(), n = itemsCount();
  if(step==='bag'){
    body.innerHTML = `<div><h3>Your bag</h3><div style="display:flex;flex-direction:column;gap:16px">${bag.map((l,i)=>{ const x=lineInfo(l); return `
      <div class="line">${plate(x.m, x.kind)}
        <div style="min-width:0"><div class="nm">${x.name}</div><div class="sm">${x.sub}</div>${stepper(`data-line="${i}"`, l.qty, {label:x.name})}</div>
        <div class="lp">${money(x.price*l.qty)}</div></div>`; }).join('')}</div></div>
      <p class="hint">${leadDays()>BASE_LEAD?`Your bag has a cake, so the earliest pickup is ${CAKE_LEAD} days out.`:"Orders need 2 days' notice."}</p>`;
    foot.innerHTML = `
      <div class="row"><span>${plural(n)}</span><span>${money(sub)}</span></div>
      <div class="row total"><span>Total</span><span>${money(sub)}</span></div>
      <button class="pill coral block" id="toWhen" type="button">Choose a day</button>`;
    body.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>{
      const l = bag[+b.dataset.line]; l.qty += +b.dataset.d;
      if(l.qty<=0) bag.splice(+b.dataset.line,1);
      changed();
    });
    $('toWhen').onclick = ()=>{ step='when'; renderDrawer(); };
    return;
  }
  // step === 'when'
  const dates = pickupDates();
  if(pickup.date && !dates.some(d=>d.getTime()===pickup.date)) pickup = {date:null,time:null};
  const sel = pickup.date ? new Date(pickup.date) : null;
  body.innerHTML = `
    <div><h3>Which day?</h3>
      <div class="dates">${dates.map(d=>`<button type="button" class="date" data-date="${d.getTime()}" aria-pressed="${pickup.date===d.getTime()}"><small>${d.toLocaleDateString(undefined,{weekday:'short'})}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString(undefined,{month:'short'})}</small></button>`).join('')}</div>
      <p class="hint">Pickup is Fridays and Saturdays. ${leadDays()>BASE_LEAD?`Cakes need ${CAKE_LEAD} days' notice, so the first dates are a little further out.`:"Orders need 2 days' notice."}</p></div>
    ${sel?`<div><h3>What time?</h3><div class="times">${SLOTS[sel.getDay()].map(t=>`<button type="button" class="pill" data-time="${t}" aria-pressed="${pickup.time===t}">${t}</button>`).join('')}</div></div>`:''}
    <div><h3>Your details</h3>
      <label class="f">Name<input id="oName" autocomplete="name" placeholder="Priya Sharma"></label>
      <label class="f">Phone<input id="oPhone" type="tel" autocomplete="tel" placeholder="(555) 014-2290"></label>
      <label class="f">Gift note or anything we should know (optional)<textarea id="oNotes" rows="2" placeholder="Cake message, allergies, gift wrap…"></textarea></label>
      <p class="err" id="oErr" hidden></p>
    </div>
    <div><button class="pill" type="button" id="toBag">Back to your bag</button></div>`;
  [['oName','name'],['oPhone','phone'],['oNotes','notes']].forEach(([id,k])=>{ const el=$(id); el.value=form[k]; el.oninput=()=>form[k]=el.value; });
  foot.innerHTML = `
    <div class="row"><span>${plural(n)}</span><span>${money(sub)}</span></div>
    <div class="row"><span>Pickup</span><span>Free</span></div>
    <div class="row"><span>When</span><span>${sel?`${sel.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}${pickup.time?`, ${pickup.time}`:''}`:'Pick a day'}</span></div>
    <div class="row total"><span>Pay at pickup</span><span>${money(sub)}</span></div>
    <button class="pill coral block" id="placeOrder" type="button">${!sel?'Pick a day and time':!pickup.time?'Pick a time':'Place pre-order'}</button>`;
  body.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{ pickup={date:+b.dataset.date,time:null}; renderDrawer(); });
  body.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{ pickup.time=b.dataset.time; renderDrawer(); });
  $('toBag').onclick = ()=>{ step='bag'; renderDrawer(); };
  $('placeOrder').onclick = placeOrder;
}

function orderCode(){
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'SD-' + Array.from({length:4}, ()=>abc[Math.floor(Math.random()*abc.length)]).join('');
}
function placeOrder(){
  const err = $('oErr');
  const name = form.name.trim(), phone = form.phone.trim();
  const problem = !pickup.date ? 'Choose a pickup day.' : !pickup.time ? 'Choose a pickup time.' : !name ? 'Add your name so we can label your box.' : phone.replace(/\D/g,'').length<7 ? 'Add a phone number we can text when your order is ready.' : '';
  if(problem){ err.textContent = problem; err.hidden = false; err.scrollIntoView({block:'nearest'}); return; }
  const d = new Date(pickup.date), total = subtotal();
  const items = bag.map(l=>{ const x=lineInfo(l); return `<li><span>${l.qty}× ${x.name}</span><span>${money(x.price*l.qty)}</span></li>`; }).join('');
  step = 'done'; renderSteps();
  $('dBody').innerHTML = `
    <div class="ticket">
      <h3>Thank you, ${esc(name.split(' ')[0])}!</h3>
      <p>Your order code</p>
      <div class="code">${orderCode()}</div>
      <ul>${items}</ul>
      <div class="row total"><span>Due at pickup</span><span>${money(total)}</span></div>
      <p><b>Pickup:</b> ${d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}, ${pickup.time}</p>
      <p class="hint">We'll text ${esc(phone)} with the pickup address the day before.</p>
    </div>`;
  $('dFoot').innerHTML = `<button class="pill coral block" id="again" type="button">Start a new order</button>`;
  $('again').onclick = closeBag;
  bag = []; pickup = {date:null,time:null}; form = {name:'',phone:'',notes:''};
  save(); renderMenu(); renderChrome();
}

/* ---------- little delights ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function fly(from){
  if(reduce) return;
  const a = from.getBoundingClientRect(), b = $('bagBtn').getBoundingClientRect();
  const dot = document.createElement('div'); dot.className='flyer';
  dot.style.left = a.left + a.width/2 - 9 + 'px'; dot.style.top = a.top + a.height/2 - 9 + 'px';
  document.body.appendChild(dot);
  dot.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${(b.left+b.width/2)-(a.left+a.width/2)}px,${(b.top+b.height/2)-(a.top+a.height/2)}px) scale(.4)`}],{duration:600,easing:'cubic-bezier(.5,-0.3,.7,1)'}).onfinish=()=>dot.remove();
}
let tt;
function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),1800); }

renderMenu(); renderBox(); renderChrome();
})();
