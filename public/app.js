const $=s=>document.querySelector(s);let T=localStorage.getItem('t'),ME=null,GIFTS={};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function api(p,o={}){const h={};if(!o.form)h['Content-Type']='application/json';if(T)h.Authorization='Bearer '+T;
 const r=await fetch('/api/'+p,{method:o.m||(o.b||o.form?'POST':'GET'),headers:h,body:o.form||(o.b?JSON.stringify(o.b):undefined)});
 const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Dogoggora');return j}
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.i);toast.i=setTimeout(()=>t.hidden=true,2500)}
const go=async v=>{try{await V[v]()}catch(e){toast(e.message)}};
function giftSheet(id){const s=document.createElement('div');s.className='sheet';
 s.innerHTML='<div>'+Object.entries(GIFTS).map(([k,g])=>`<button data-k="${k}">${g.icon} ${g.coins}</button>`).join('')+'<button class="alt" id="x">Cufi</button></div>';
 s.onclick=async e=>{const k=e.target.dataset.k;if(e.target.id==='x'||e.target===s){s.remove();return}if(!k)return;
  try{await api('wallet/gift',{b:{videoId:id,gift:k}});toast('Gift ergameera 🎁');s.remove()}catch(x){toast(x.message)}};document.body.append(s)}
const V={
async auth(){$('#nav').hidden=true;
 $('#app').innerHTML=`<div class="box"><h1>Deeggarsa Creator</h1><input id="ph" placeholder="+2519xxxxxxxx" inputmode="tel"><input id="nm" placeholder="Maqaa (galmaa’uuf qofa)"><input id="pw" type="password" placeholder="Password"><button id="lg">Seeni</button><button id="rg" class="alt">Galmaa’i</button></div>`;
 const f=async p=>{try{const j=await api('auth/'+p,{b:{phone:$('#ph').value.trim(),name:$('#nm').value.trim(),password:$('#pw').value}});T=j.token;localStorage.setItem('t',T);start()}catch(e){toast(e.message)}};
 $('#lg').onclick=()=>f('login');$('#rg').onclick=()=>f('register')},
async feed(){$('#app').innerHTML='<div class="feed" id="fd"></div>';let off=0,busy=false;const fd=$('#fd');
 const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target.querySelector('video');
  if(e.isIntersecting){v.play().catch(()=>{});if(!e.target.seen){e.target.seen=1;api('videos/'+e.target.dataset.id+'/view',{m:'POST'}).catch(()=>{})}}else v.pause()}),{threshold:.7});
 async function more(){if(busy)return;busy=true;const vs=await api('videos/feed?offset='+off);off+=vs.length;
  if(!off)fd.innerHTML='<p class="empty">Video hin jiru. Duraan ol-fe’i!</p>';
  vs.forEach(v=>{const d=document.createElement('section');d.className='vid';d.dataset.id=v.id;
   d.innerHTML=`<video src="${esc(v.url)}" loop playsinline muted></video><div class="info"><b>@${esc(v.name)}</b><p>${esc(v.caption)}</p></div><div class="side"><button class="lk">${v.liked?'❤️':'🤍'}<small>${v.likes}</small></button><button class="cm">💬<small>${v.comments}</small></button><button class="gf">🎁</button><button class="fw">${v.followed?'✔':'＋'}</button></div>`;
   const vd=d.querySelector('video');vd.onclick=()=>vd.muted=!vd.muted;
   d.querySelector('.lk').onclick=async e=>{const b=e.currentTarget;try{const r=await api('videos/'+v.id+'/like',{m:'POST'});v.likes+=r.liked?1:-1;b.innerHTML=(r.liked?'❤️':'🤍')+'<small>'+v.likes+'</small>'}catch(x){toast(x.message)}};
   d.querySelector('.cm').onclick=async()=>{const t=prompt('Comment kee');if(t)try{await api('videos/'+v.id+'/comments',{b:{text:t}});toast('Comment ergameera')}catch(x){toast(x.message)}};
   d.querySelector('.gf').onclick=()=>giftSheet(v.id);
   d.querySelector('.fw').onclick=async e=>{try{const r=await api('videos/follow/'+v.user_id,{m:'POST'});e.currentTarget.textContent=r.followed?'✔':'＋'}catch(x){toast(x.message)}};
   io.observe(d);fd.append(d)});busy=false}
 fd.onscroll=()=>{if(fd.scrollTop+fd.clientHeight*2>fd.scrollHeight)more().catch(()=>busy=false)};await more()},
upload(){$('#app').innerHTML=`<div class="box"><h2>Video ol-fe’i</h2><input id="f" type="file" accept="video/*"><input id="cp" maxlength="150" placeholder="Ibsa (caption)"><button id="up">Ol-fe’i</button></div>`;
 $('#up').onclick=async()=>{const f=$('#f').files[0];if(!f)return toast('Video filadhu');const fd=new FormData();fd.append('caption',$('#cp').value);fd.append('video',f);
  $('#up').disabled=true;try{await api('videos',{form:fd});toast('Ol-fe’ameera ✅');go('feed')}catch(e){toast(e.message);$('#up').disabled=false}}},
async wallet(){const m=await api('auth/me');
 $('#app').innerHTML=`<div class="box"><h2>Wallet</h2><div class="big">${m.coins} coins</div><p class="note">1 Birr = 1 coin. Telebirr’n ergiitii lakkoofsa ref galchi; admin ni mirkaneessa.</p><input id="co" type="number" placeholder="Coins meeqa?"><input id="rf" placeholder="Telebirr ref lakkoofsa"><button id="by">Bituu gaafadhu</button></div>`;
 $('#by').onclick=async()=>{try{await api('wallet/buy',{b:{coins:+$('#co').value,ref:$('#rf').value}});toast('Gaaffiin ergameera')}catch(e){toast(e.message)}}},
async creator(){const d=await api('creator/dashboard');
 $('#app').innerHTML=`<div class="box"><h2>Creator</h2><div class="big">${d.earned} Birr</div><p class="note">Video ${d.videos} · Hordoftoota ${d.followers} · Gift ${d.gifts}</p><select id="mt"><option>Telebirr</option><option>CBE Birr</option><option>Baankii</option><option>Payoneer</option></select><input id="ac" placeholder="Lakkoofsa akaawuntii"><input id="wc" type="number" placeholder="Hanga Birr (min ${d.min})"><button id="wd">Baasii gaafadhu</button><h3>Gift dhiyoo</h3>${d.recent.map(r=>`<p>${esc(r.name)} · ${r.coins} coins</p>`).join('')||'<p class="note">Ammaaf hin jiru</p>'}</div>`;
 $('#wd').onclick=async()=>{try{await api('creator/withdraw',{b:{birr:+$('#wc').value,method:$('#mt').value,account:$('#ac').value}});toast('Gaaffiin ergameera');go('creator')}catch(e){toast(e.message)}}},
async admin(){const[o,w]=await Promise.all([api('admin/orders'),api('admin/withdrawals')]);
 $('#app').innerHTML=`<div class="box"><h2>Admin</h2><h3>Coins</h3>${o.map(x=>`<p>${esc(x.phone)} · ${x.coins} · ref ${esc(x.ref)} <button data-u="orders/${x.id}/approve">✔</button> <button data-u="orders/${x.id}/reject">✖</button></p>`).join('')||'<p class="note">Hin jiru</p>'}<h3>Baasii</h3>${w.map(x=>`<p>${esc(x.phone)} · ${x.birr} Birr · ${esc(x.method)} ${esc(x.account)} <button data-u="withdrawals/${x.id}/paid">✔</button> <button data-u="withdrawals/${x.id}/reject">✖</button></p>`).join('')||'<p class="note">Hin jiru</p>'}</div>`;
 $('#app').onclick=async e=>{const u=e.target.dataset.u;if(!u)return;try{await api('admin/'+u,{m:'POST'});go('admin')}catch(x){toast(x.message)}}}};
function nav(){const n=$('#nav');n.hidden=false;
 n.innerHTML=[['feed','🏠'],['upload','➕'],['wallet','💰'],['creator','📊'],...(ME.role==='admin'?[['admin','🛡️']]:[]),['out','🚪']].map(([k,i])=>`<button data-v="${k}">${i}</button>`).join('');
 n.onclick=e=>{const v=e.target.dataset.v;if(v==='out'){localStorage.removeItem('t');T=null;return V.auth()}if(v)go(v)}}
async function start(){try{ME=await api('auth/me');GIFTS=await api('wallet/gifts');nav();go('feed')}catch{T=null;V.auth()}}
T?start():V.auth();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
