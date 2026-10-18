const U='MuhammadFaizan-prog';
document.getElementById('theme').onclick=()=>{const r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('theme',r.dataset.theme)}catch(e){}};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
fetch(`https://github-contributions-api.jogruber.de/v4/${U}?y=last`).then(r=>r.json()).then(d=>{
  document.getElementById('gh-contrib').textContent=`${d.total.lastYear} in the last year`;
  const cal=document.getElementById('cal');const first=new Date(d.contributions[0].date).getDay();
  for(let i=0;i<first;i++)cal.appendChild(Object.assign(document.createElement('i'),{style:'visibility:hidden'}));
  d.contributions.forEach(c=>{const i=document.createElement('i');i.dataset.l=c.level;i.title=`${c.count} on ${c.date}`;cal.appendChild(i)});
}).catch(()=>{document.getElementById('gh-contrib').textContent=''});
fetch(`https://api.github.com/users/${U}`).then(r=>r.json()).then(u=>{if(u.public_repos!=null){document.getElementById('gh-repos').textContent=u.public_repos;document.getElementById('gh-followers').textContent=u.followers}}).catch(()=>{});
const vo=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){v.play().catch(()=>{})}else v.pause()}),{threshold:.35});
document.querySelectorAll('.media video').forEach(v=>vo.observe(v));

(()=>{const k='fz-visit',base='https://abacus.jasoncameron.dev';let seen=null;try{seen=sessionStorage.getItem(k)}catch(e){}
const ord=n=>{const s=['th','st','nd','rd'],v=n%100;return n.toLocaleString('en-US')+(s[(v-20)%10]||s[v]||s[0])};
const show=n=>{if(!n||n<1)return;document.getElementById('vnum').textContent=ord(n);document.getElementById('visitor').hidden=false};
if(seen){show(+seen);return}
fetch(`${base}/hit/faizi-dev/visits`).then(r=>r.json()).then(d=>{try{sessionStorage.setItem(k,d.value)}catch(e){}show(d.value)}).catch(()=>{});})();
