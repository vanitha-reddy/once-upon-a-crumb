/* Once Upon a Crumb: tests.
   Open tests.html (or index.html?test) in a browser. The tests drive the real page
   and show a results panel. They use their own saved bag, so a real bag is untouched. */
(function(){
const C = window.crumb;
const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];
const click = el => { if(!el) throw new Error('element to click was not found'); el.click(); };
const text = id => $(id).textContent.trim();
const day = (y,m,d,h=0,min=0) => new Date(y, m-1, d, h, min);
const ymd = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

const tests = [];
const test = (name, fn) => tests.push({name, fn});
function eq(actual, expected, what=''){
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if(a !== e) throw new Error(`${what ? what + ': ' : ''}expected ${e}, got ${a}`);
}
function ok(cond, what){ if(!cond) throw new Error(what || 'expected true'); }

// shortcuts for driving the page
const plus = id => click(document.querySelector(`[data-item="${id}"][data-d="1"]`));
const minus = id => click(document.querySelector(`[data-item="${id}"][data-d="-1"]`));
const qtyOnCard = id => +document.querySelector(`[data-item="${id}"]`).parentElement.querySelector('output').textContent;
const addFlavor = id => click(document.querySelector(`[data-fl="${id}"][data-d="1"]`));
const firstId = () => C.MENU[0].id;
function checkoutWith({date=true, time=true, name='Test Customer', phone='555 014 2290'}={}){
  click($('bagBtn')); click($('toWhen'));
  if(date) click(document.querySelector('[data-date]'));
  if(date && time) click(document.querySelector('[data-time]'));
  const n = $('oName'), p = $('oPhone');
  n.value = name; n.dispatchEvent(new Event('input'));
  p.value = phone; p.dispatchEvent(new Event('input'));
  click($('placeOrder'));
}

/* ---------- order cutoff countdown ---------- */
test('Orders close Thursday 8 pm: from a Tuesday it is that week\'s Thursday', ()=>{
  eq(C.nextCutoff(day(2026,10,13,10)).toString(), day(2026,10,15,20).toString());
});
test('Thursday 7:59 pm still counts down to that evening', ()=>{
  eq(C.nextCutoff(day(2026,10,15,19,59)).toString(), day(2026,10,15,20).toString());
});
test('At Thursday 8 pm the countdown moves to next Thursday', ()=>{
  eq(C.nextCutoff(day(2026,10,15,20)).toString(), day(2026,10,22,20).toString());
});
test('Friday and Sunday count down to the next Thursday', ()=>{
  eq(C.nextCutoff(day(2026,10,16,9)).toString(), day(2026,10,22,20).toString(), 'Friday');
  eq(C.nextCutoff(day(2026,10,18,9)).toString(), day(2026,10,22,20).toString(), 'Sunday');
});
test('The countdown on the page shows a Thursday and sensible numbers', ()=>{
  ok(/^Orders close Thursday .+ at 8 pm$/.test(text('cutoffTitle')), 'title: ' + text('cutoffTitle'));
  const d = +text('cd-d'), h = +text('cd-h'), m = +text('cd-m'), s = +text('cd-s');
  ok(d >= 0 && d <= 7, 'days ' + d);
  ok(h >= 0 && h < 24 && m >= 0 && m < 60 && s >= 0 && s < 60, `clock ${h}:${m}:${s}`);
});

/* ---------- pickup days ---------- */
test('Pickup days are only Fridays and Saturdays, six of them, in order', ()=>{
  const ds = C.pickupDates(2, day(2026,10,13,10));
  eq(ds.length, 6, 'count');
  ok(ds.every(d => d.getDay()===5 || d.getDay()===6), 'all Fri/Sat');
  ok(ds.every((d,i) => i===0 || d > ds[i-1]), 'ascending');
});
test('Cookies need 2 days\' notice: a Tuesday order can be picked up that Friday', ()=>{
  eq(ymd(C.pickupDates(C.BASE_LEAD, day(2026,10,13,10))[0]), '2026-10-16');
});
test('A Thursday order skips Friday and starts on Saturday', ()=>{
  eq(ymd(C.pickupDates(C.BASE_LEAD, day(2026,10,15,10))[0]), '2026-10-17');
});
test('Cakes need 5 days\' notice: a Tuesday cake order starts the next Friday', ()=>{
  eq(C.CAKE_LEAD, 5, 'cake notice');
  eq(ymd(C.pickupDates(C.CAKE_LEAD, day(2026,10,13,10))[0]), '2026-10-23');
});
test('Friday has three pickup slots (4 to 7 pm) and Saturday has four (10 am to 2 pm)', ()=>{
  eq(C.SLOTS[5], ['4 to 5 pm','5 to 6 pm','6 to 7 pm']);
  eq(C.SLOTS[6], ['10 to 11 am','11 am to 12 pm','12 to 1 pm','1 to 2 pm']);
});

/* ---------- order codes and prices ---------- */
test('Order codes look like OC-XXXX with no easily confused letters', ()=>{
  for(let i=0;i<300;i++){
    const c = C.orderCode();
    ok(/^OC-[A-HJ-NP-Z2-9]{4}$/.test(c), 'bad code ' + c);
  }
});
test('Prices show as dollars with two decimals', ()=>{
  eq(C.money(3.5), '$3.50'); eq(C.money(19), '$19.00'); eq(C.money(0), '$0.00');
});

/* ---------- menu ---------- */
test('Every cookie has a unique id, a name, a price and a photo that loads', ()=>{
  const ids = C.MENU.map(m=>m.id);
  eq(new Set(ids).size, ids.length, 'unique ids');
  C.MENU.forEach(m=>{
    ok(m.name && m.price > 0, m.id + ' needs a name and price');
    ok(m.img, m.id + ' needs a photo');
  });
  const broken = $$('img').filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src'));
  eq(broken, [], 'broken images');
});
test('The menu shows one card per cookie, in menu order', ()=>{
  eq($$('#grid .item h3').map(h=>h.textContent), C.MENU.map(m=>m.name));
});
test('Category filters hide while everything on the menu is a cookie', ()=>{
  const cats = new Set(C.MENU.map(m=>m.cat));
  eq($('chips').hidden, cats.size <= 1);
});
test('See inside swaps to the cut-open photo and back', ()=>{
  const filled = C.MENU.filter(m=>m.inside);
  eq($$('[data-peek]').length, filled.length, 'one button per filled cookie');
  if(!filled.length) return;
  const id = filled[0].id, btn = () => document.querySelector(`[data-peek="${id}"]`);
  click(btn());
  ok(btn().previousElementSibling.classList.contains('inside'), 'plate shows inside');
  eq(btn().textContent, 'See outside');
  click(btn());
  eq(btn().textContent, 'See inside');
});

/* ---------- bag from the menu ---------- */
test('+ and − on a menu card change the bag', ()=>{
  const id = firstId();
  eq(qtyOnCard(id), 0, 'starts empty');
  ok(document.querySelector(`[data-item="${id}"][data-d="-1"]`).disabled, '− disabled at 0');
  plus(id); plus(id);
  eq(qtyOnCard(id), 2, 'card');
  eq(text('bagCount'), '2', 'header badge');
  minus(id);
  eq(qtyOnCard(id), 1, 'after −');
  eq(C.state().bag.length, 1, 'one line in bag');
});
test('The bag bar shows the running total and hides when the bag is empty', ()=>{
  ok($('dock').classList.contains('away'), 'hidden when empty');
  const m = C.MENU[0];
  plus(m.id); plus(m.id); plus(m.id);
  eq(text('dockTotal'), C.money(m.price*3));
  eq(text('dockCount'), '3 items in your bag');
  ok(!$('dock').classList.contains('away'), 'visible');
});
test('The bag is saved, so it survives a page refresh', ()=>{
  plus(firstId());
  const saved = JSON.parse(localStorage.getItem(C.BAG_KEY));
  eq(saved.length, 1); eq(saved[0].qty, 1);
});

/* ---------- build a box ---------- */
test('The box needs exactly 6 cookies before it can be added', ()=>{
  const [a, b] = C.MENU.filter(m=>m.box);
  addFlavor(a.id); addFlavor(a.id); addFlavor(b.id);
  eq(text('boxMeter'), '3 of 6');
  eq(text('boxAdd'), 'Pick 3 more');
  ok($('boxAdd').disabled, 'add disabled');
  addFlavor(b.id); addFlavor(b.id); addFlavor(b.id);
  eq(text('boxAdd'), 'Add box to bag');
  ok(!$('boxAdd').disabled, 'add enabled');
  ok($$('[data-fl][data-d="1"]').every(x=>x.disabled), '+ disabled once full');
});
test('Tapping a cookie in the box takes it out', ()=>{
  addFlavor(C.MENU[0].id); addFlavor(C.MENU[1].id);
  click(document.querySelector('.slot.filled'));
  eq(C.state().boxSlots, [C.MENU[1].id]);
  eq(text('boxMeter'), '1 of 6');
});
test('Surprise me fills the empty slots, then shuffles a full box', ()=>{
  addFlavor(C.MENU[0].id);
  eq(text('boxSurprise'), 'Fill the rest for me');
  click($('boxSurprise'));
  eq(C.state().boxSlots.length, 6, 'filled');
  eq(C.state().boxSlots[0], C.MENU[0].id, 'kept my pick');
  eq(text('boxSurprise'), 'Shuffle it');
  click($('boxSurprise'));
  eq(C.state().boxSlots.length, 6, 'still 6 after shuffle');
  const valid = new Set(C.MENU.filter(m=>m.box).map(m=>m.id));
  ok(C.state().boxSlots.every(id=>valid.has(id)), 'only box flavours');
});
test('Adding a box puts it in the bag at the box price and empties the builder', ()=>{
  click($('boxSurprise')); click($('boxAdd'));
  const bag = C.state().bag;
  eq(bag.length, 1); ok(bag[0].box && bag[0].box.length === 6, 'box line with 6 cookies');
  eq(text('dockTotal'), C.money(C.BOX_PRICE));
  eq(C.state().boxSlots, [], 'builder empty');
});
test('Two identical boxes stack as one line with quantity 2', ()=>{
  const id = C.MENU[0].id;
  for(let r=0;r<2;r++){ for(let i=0;i<6;i++) addFlavor(id); click($('boxAdd')); }
  eq(C.state().bag.length, 1); eq(C.state().bag[0].qty, 2);
});

/* ---------- bag drawer and checkout ---------- */
test('Bag total adds cookies and boxes together', ()=>{
  const m = C.MENU[0];
  plus(m.id); plus(m.id);
  click($('boxSurprise')); click($('boxAdd'));
  const expected = C.money(m.price*2 + C.BOX_PRICE);
  eq(text('dockTotal'), expected, 'bag bar');
  click($('bagBtn'));
  eq(document.querySelector('.d-foot .row.total span:last-child').textContent, expected, 'drawer total');
  eq($$('.d-body .line').length, 2, 'two lines');
});
test('Quantity buttons in the bag update the total and remove a line at zero', ()=>{
  const m = C.MENU[0];
  plus(m.id);
  click($('bagBtn'));
  click(document.querySelector('[data-line="0"][data-d="1"]'));
  eq(text('dockTotal'), C.money(m.price*2));
  click(document.querySelector('[data-line="0"][data-d="-1"]'));
  click(document.querySelector('[data-line="0"][data-d="-1"]'));
  eq(C.state().bag, []);
  ok(document.querySelector('.d-body .empty'), 'shows empty bag');
});
test('Checkout asks for a day, then a time, then a name, then a phone number', ()=>{
  plus(firstId());
  const err = () => text('oErr');
  checkoutWith({date:false}); eq(err(), 'Choose a pickup day.');
  C.reset(); plus(firstId());
  checkoutWith({time:false}); eq(err(), 'Choose a pickup time.');
  C.reset(); plus(firstId());
  checkoutWith({name:'  '}); eq(err(), 'Add your name so we can label your box.');
  C.reset(); plus(firstId());
  checkoutWith({phone:'12'}); eq(err(), 'Add a phone number we can text when your order is ready.');
});
test('The When step only offers Fridays and Saturdays with the right time slots', ()=>{
  plus(firstId());
  click($('bagBtn')); click($('toWhen'));
  const dates = $$('[data-date]').map(b => new Date(+b.dataset.date));
  eq(dates.length, 6);
  ok(dates.every(d => d.getDay()===5 || d.getDay()===6), 'Fri/Sat only');
  const earliest = new Date(); earliest.setHours(0,0,0,0); earliest.setDate(earliest.getDate()+C.BASE_LEAD);
  ok(dates[0] >= earliest, 'respects 2 days\' notice');
  click(document.querySelector('[data-date]'));
  eq($$('[data-time]').map(b=>b.textContent), C.SLOTS[dates[0].getDay()]);
});
test('Placing an order gives an OC- code, a summary, and empties the bag', ()=>{
  const m = C.MENU[0];
  plus(m.id); plus(m.id);
  checkoutWith({name:'Vanitha Test'});
  const ticket = document.querySelector('.ticket');
  ok(ticket, 'ticket shown');
  ok(/^OC-[A-HJ-NP-Z2-9]{4}$/.test(ticket.querySelector('.code').textContent), 'code ' + ticket.querySelector('.code').textContent);
  ok(ticket.textContent.includes('Thank you, Vanitha!'), 'greets by first name');
  ok(ticket.textContent.includes(`2× ${m.name}`), 'lists the cookies');
  ok(ticket.textContent.includes(C.money(m.price*2)), 'shows the total');
  eq(C.state().bag, [], 'bag emptied');
  eq(text('bagCount'), '0');
});
test('Names typed at checkout cannot inject HTML into the order ticket', ()=>{
  plus(firstId());
  checkoutWith({name:'<img src=x onerror=alert(1)>'});
  ok(!document.querySelector('.ticket img'), 'no image injected');
});

/* ---------- runner ---------- */
const panel = document.createElement('section');
panel.setAttribute('aria-label','Test results');
panel.style.cssText = 'position:fixed;inset:12px 12px auto auto;width:min(460px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;z-index:999;background:#FFF9EE;color:#2A1715;border:2px solid #2A1715;border-radius:22px;padding:18px 20px;font:14px/1.45 "DM Sans",system-ui,sans-serif;box-shadow:0 20px 40px -20px rgba(0,0,0,.5)';
document.body.appendChild(panel);

let pass = 0; const rows = [];
const html = s => String(s).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
for(const t of tests){
  C.reset();
  try{ t.fn(); pass++; rows.push(`<li style="padding:5px 0;border-bottom:1px dashed #2a171533"><span style="color:#2E8B57;font-weight:700">✓</span> ${html(t.name)}</li>`); }
  catch(e){ rows.push(`<li style="padding:5px 0;border-bottom:1px dashed #2a171533"><span style="color:#E5574B;font-weight:700">✗</span> ${html(t.name)}<div style="color:#E5574B;font-size:12px;margin:2px 0 0 18px">${html(e.message)}</div></li>`); console.error('FAILED:', t.name, e); }
}
C.reset();
try{ localStorage.removeItem(C.BAG_KEY); }catch(e){}
window.scrollTo(0,0);

const failed = tests.length - pass;
panel.innerHTML = `
  <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
    <strong style="font:800 20px/1.1 'Bricolage Grotesque',system-ui,sans-serif">${failed ? `${failed} test${failed===1?'':'s'} failed` : 'All tests passed'}</strong>
    <button type="button" id="closeTests" style="border:1.5px solid #2A1715;background:none;border-radius:999px;padding:4px 12px;font:inherit;font-weight:700;cursor:pointer">Close</button>
  </div>
  <p style="margin:6px 0 10px;color:#6F5A51">${pass} of ${tests.length} passed</p>
  <ul style="list-style:none;padding:0;margin:0">${rows.join('')}</ul>`;
panel.style.borderColor = failed ? '#E5574B' : '#2E8B57';
$('closeTests').onclick = () => panel.remove();
window.crumbTestResults = {passed: pass, failed, total: tests.length};
document.title = (failed ? '✗ ' : '✓ ') + document.title;
})();
