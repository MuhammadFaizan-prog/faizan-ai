const U='MuhammadFaizan-prog';
document.getElementById('theme').onclick=()=>{const r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('theme',r.dataset.theme)}catch(e){}};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
fetch(`https://github-contributions-api.jogruber.de/v4/${U}?y=${new Date().getFullYear()}`).then(r=>r.json()).then(d=>{
  document.getElementById('gh-contrib').textContent=`${Object.values(d.total)[0]} in ${new Date().getFullYear()}`;
  const cal=document.getElementById('cal');const first=new Date(d.contributions[0].date).getDay();
  for(let i=0;i<first;i++)cal.appendChild(Object.assign(document.createElement('i'),{style:'visibility:hidden'}));
  d.contributions.forEach(c=>{const i=document.createElement('i');i.dataset.l=c.level;i.title=`${c.count} on ${c.date}`;cal.appendChild(i)});
}).catch(()=>{document.getElementById('gh-contrib').textContent=''});
fetch(`https://api.github.com/users/${U}`).then(r=>r.json()).then(u=>{if(u.public_repos!=null){document.getElementById('gh-repos').textContent=u.public_repos}}).catch(()=>{});

(()=>{const k='fz-visit',base='https://abacus.jasoncameron.dev';let seen=null;try{seen=sessionStorage.getItem(k)}catch(e){}
const ord=n=>{const s=['th','st','nd','rd'],v=n%100;return n.toLocaleString('en-US')+(s[(v-20)%10]||s[v]||s[0])};
const show=n=>{if(!n||n<1)return;document.getElementById('vnum').textContent=ord(n);document.getElementById('visitor').hidden=false};
if(seen){show(+seen);return}
fetch(`${base}/hit/faizi-dev/visits`).then(r=>r.json()).then(d=>{try{sessionStorage.setItem(k,d.value)}catch(e){}show(d.value)}).catch(()=>{});})();

(()=>{const m=document.getElementById('modal'),body=document.getElementById('modal-body'),title=document.getElementById('modal-title');let last=null;
const close=()=>{m.classList.remove('open');document.body.classList.remove('locked');setTimeout(()=>{m.hidden=true;body.innerHTML=''},250);last&&last.focus()};
document.querySelectorAll('.demo-btn').forEach(b=>b.addEventListener('click',()=>{last=b;const d=b.dataset;title.textContent=b.closest('.row').querySelector('h3').firstChild.textContent.trim();
 if(d.video)body.innerHTML=`<video src="${d.video}" poster="${d.poster}" controls autoplay muted playsinline loop></video>`;
 else if(d.youtube)body.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${d.youtube}?autoplay=1&rel=0" title="Demo video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
 else body.innerHTML=`<img src="${d.image}" alt="${d.alt||''}">`;
 m.hidden=false;document.body.classList.add('locked');requestAnimationFrame(()=>m.classList.add('open'));document.getElementById('modal-close').focus();}));
document.getElementById('modal-close').onclick=close;m.addEventListener('click',e=>{if(e.target===m)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!m.hidden)close()});})();
