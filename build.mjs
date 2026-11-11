// node build.mjs  -> generates static, crawlable pages from source/*.src.html
import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';
const SITE='https://byrsateam.github.io',PLAY='https://play.google.com/store/apps/details?id=com.budgetzen.app';
const GSC='',BING=''; // paste Google Search Console / Bing verification tokens here, then rebuild
const TODAY=new Date().toISOString().slice(0,10);
const LANGS=[['en','English','en_US'],['fr','Français','fr_FR'],['ar','العربية','ar_AR'],['es','Español','es_ES'],['de','Deutsch','de_DE'],['pt','Português','pt_BR'],['it','Italiano','it_IT'],['tr','Türkçe','tr_TR'],['ja','日本語','ja_JP'],['ko','한국어','ko_KR']];
// Keyword-rich <title> per language (budget app) and for the company home page
const TB={en:'BudgetZen – Private Budget Planner & Expense Tracker',fr:'BudgetZen – Application de budget privée et hors ligne',ar:'BudgetZen – تطبيق ميزانية خاص يعمل دون إنترنت',es:'BudgetZen – App de presupuesto privada y sin conexión',de:'BudgetZen – Private Budget-App, komplett offline',pt:'BudgetZen – App de orçamento privado e offline',it:'BudgetZen – App budget privata e offline',tr:'BudgetZen – Gizli ve çevrimdışı bütçe uygulaması',ja:'BudgetZen – オフラインで安心の家計簿アプリ',ko:'BudgetZen – 완전 오프라인 프라이빗 가계부 앱'};
const TI={en:'Byrsa Team | Privacy-First Mobile Apps',fr:'Byrsa Team | Applications mobiles axées sur la vie privée',ar:'Byrsa Team | تطبيقات جوال تضع الخصوصية أولاً',es:'Byrsa Team | Apps móviles centradas en la privacidad',de:'Byrsa Team | Datenschutzorientierte Mobile Apps',pt:'Byrsa Team | Apps móveis com foco em privacidade',it:'Byrsa Team | App mobile orientate alla privacy',tr:'Byrsa Team | Gizlilik öncelikli mobil uygulamalar',ja:'Byrsa Team | プライバシー重視のモバイルアプリ',ko:'Byrsa Team | 프라이버시 우선 모바일 앱'};
const SMALL={'BudgetZen-logo.png':'BudgetZen-logo-256.webp'}; // light icon used inside pages
const fit=s=>{if(s.length<=160)return s;const c=s.slice(0,158),i=Math.max(c.lastIndexOf('. '),c.lastIndexOf('。'));return i>80?c.slice(0,i+1):c.slice(0,c.lastIndexOf(' '))+'…'};
const rd=f=>fs.readFileSync(f,'utf8'),esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const grab=(src,names)=>vm.runInNewContext(src.slice(src.indexOf('<script>')+8,src.indexOf('const $='))+`;({${names}})`);
const EXTRA='.ln{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px;max-width:720px;margin:0 auto 14px}.ln a{margin:0;text-decoration:underline}.ln a[aria-current]{font-weight:700;text-decoration:none;color:var(--pr)}.card .em{font-size:32px;display:block;line-height:1.3}footer p{margin-top:6px}';
const css=s=>s.match(/<style>([\s\S]*?)<\/style>/)[1].replace('.rv{opacity:0;transform:translateY(24px);transition:.7s}.rv.on{opacity:1;transform:none}','.js .rv{opacity:0;transform:translateY(24px);transition:.7s}.js .rv.on{opacity:1;transform:none}').replace(/url\(hero-/g,'url(/hero-')+EXTRA;
const loc=(l,f)=>f===''?(l=='en'?'/':`/${l}/`):`${l=='en'?'':'/'+l}/${f}`,abs=(l,f)=>SITE+loc(l,f);
const out=(l,f)=>(loc(l,f).slice(1)+(f===''?'index.html':'')),W=(p,t)=>{fs.mkdirSync(path.dirname(p)||'.',{recursive:true});fs.writeFileSync(p,t)};
const sel=(l,f)=>`<select id="L" aria-label="Language">${LANGS.map(([c,n])=>`<option value="${loc(c,f)}"${c==l?' selected':''}>${n}</option>`).join('')}</select>`;
const nav=(l,f)=>`<nav class="ln" aria-label="Languages">${LANGS.map(([c,n])=>`<a href="${loc(c,f)}" hreflang="${c}" lang="${c}"${c==l?' aria-current="page"':''}>${n}</a>`).join('')}</nav>`;
const ld=o=>`<script type="application/ld+json">${JSON.stringify(o)}</script>`;
const JS=`const $=s=>document.querySelector(s),R=document.documentElement;
$('#L').onchange=e=>location.href=e.target.value;
$('#T').onclick=()=>{const t=R.dataset.t=='dark'?'light':'dark';R.dataset.t=t;try{localStorage.bzt=t}catch(e){}};
const io=new IntersectionObserver(a=>a.forEach(x=>x.isIntersecting&&x.target.classList.add('on')),{threshold:.1});document.querySelectorAll('.rv').forEach(e=>io.observe(e));`;
const shell=({l,f,title,desc,img,imgAlt,j,style,body})=>`<!DOCTYPE html>
<html lang="${l}" dir="${l=='ar'?'rtl':'ltr'}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${abs(l,f)}">
${LANGS.map(([c])=>`<link rel="alternate" hreflang="${c}" href="${abs(c,f)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${abs('en',f)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#5b5bf5">
${GSC?`<meta name="google-site-verification" content="${GSC}">\n`:''}${BING?`<meta name="msvalidate.01" content="${BING}">\n`:''}<meta property="og:type" content="website"><meta property="og:site_name" content="Byrsa Team">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${abs(l,f)}"><meta property="og:locale" content="${LANGS.find(x=>x[0]==l)[2]}">
<meta property="og:image" content="${SITE}/${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(imgAlt)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${SITE}/${img}">
<link rel="icon" href="/favicon.png"><link rel="apple-touch-icon" href="/BudgetZen-logo-256.webp">
<script>(function(){var d=document.documentElement,t;d.classList.add('js');try{t=localStorage.bzt}catch(e){}d.dataset.t=t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')})()</script>
<style>${style}</style>
${j.map(ld).join('\n')}
</head><body>${body}
<script>${JS}</script></body></html>
`;
const ORG={'@type':'Organization','@id':SITE+'/#org',name:'Byrsa Team',url:SITE+'/',logo:SITE+'/byrsa-icon.webp'};
const crumbs=(l,name)=>({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Byrsa Team',item:abs(l,'')},{'@type':'ListItem',position:2,name,item:abs(l,'budgetzen.html')}]});
const pages=[]; // for sitemap

// ---------- BudgetZen product page ----------
{const src=rd('source/budgetzen.src.html'),{D,E,G}=grab(src,'D,E,G'),style=css(src);
for(const [l] of LANGS){const d=D[l],e=E[l],[ca,cb]=e[2].split('::'),v=['0','100%','10','∞'];
const body=`
<header><a class="bt" href="${loc(l,'')}"><img src="/favicon.png" width="22" height="22" alt="">Byrsa Team</a><b class="br"><img src="/BudgetZen-logo-256.webp" width="30" height="30" alt=""><span>BudgetZen</span></b>
${sel(l,'budgetzen.html')}
<button class="ic" id="T" aria-label="Theme">🌓</button><a class="btn s hc" rel="noopener" href="${PLAY}">${esc(d[3])}</a></header>
<main>
<div class="hero"><div class="orb" aria-hidden="true"><i></i><i></i><i></i><em><span>🔒</span><span>🧠</span><span>🏆</span><span>🌍</span></em><img src="/BudgetZen-logo-256.webp" width="120" height="120" alt=""></div>
<div class="pill">${esc(d[0])}</div><h1>${esc(d[1])}</h1><p class="sub">${esc(d[2])}</p>
<a class="btn" rel="noopener" href="${PLAY}">${esc(d[3])}</a><p class="tr">${esc(d[4])}</p></div>
<div class="stats rv">${d[5].split('|').map((t,i)=>`<div class="stat"><b>${v[i]}</b><span>${esc(t)}</span></div>`).join('')}</div>
<section class="rv"><h2>${esc(d[6])}</h2><div class="g">${d[7].split('|').map((x,i)=>{const[a,b,c]=x.split('::');return`<article class="card${i>5?' hl':''}"><span class="em" aria-hidden="true">${a}</span><h3>${esc(b)}</h3><p>${esc(c)}</p></article>`}).join('')}</div></section>
<section class="rv"><p class="eb">${esc(e[0])}</p><h2>${esc(e[1])}</h2><div class="g2">${e[3].split('|').map(x=>{const[a,b,c]=x.split('::');return`<div class="it"><span aria-hidden="true">${a}</span><div><b>${esc(b)}</b><p>${esc(c)}</p></div></div>`}).join('')}</div>
<div class="cb"><span aria-hidden="true">❌</span><div><b>${esc(ca)}</b><p>${esc(cb)}</p></div><span aria-hidden="true">✔️</span></div></section>
<section class="rv"><div class="g"><div class="plan"><h3>${esc(d[8])}</h3><ul>${d[9].split('|').map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
<div class="plan lt"><h3>${esc(d[10])}</h3><div class="price">${esc(d[11])}</div><ul>${d[12].split('|').map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="warn">${esc(d[13])}</div></div></div>
<p class="note">${esc(d[14])}</p></section>
<div class="fin rv"><h2>${esc(d[15])}</h2><ul class="lg">${G[l].split('|').map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
</main>
<footer>${nav(l,'budgetzen.html')}<a href="${loc(l,'')}">Byrsa Team</a><a href="https://sadokjabli.github.io/budgetzen-legal-pages/" rel="noopener">${esc(d[16])}</a><p>© 2026 Byrsa Team</p></footer>
<div class="bar"><a class="btn" rel="noopener" href="${PLAY}">${esc(d[3])}</a></div>`;
const app={'@context':'https://schema.org','@type':'MobileApplication',name:'BudgetZen',description:d[2],applicationCategory:'FinanceApplication',operatingSystem:'Android',url:abs(l,'budgetzen.html'),installUrl:PLAY,downloadUrl:PLAY,image:SITE+'/BudgetZen-logo.png',inLanguage:LANGS.map(x=>x[0]),featureList:D.en[7].split('|').map(x=>x.split('::')[1]).join(', '),offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:ORG};
W(out(l,'budgetzen.html'),shell({l,f:'budgetzen.html',title:TB[l],desc:fit(`${d[2]} ${d[4]}`.length>160?d[2]:`${d[2]} ${d[4]}`),img:'og-budgetzen.png',imgAlt:'BudgetZen',j:[app,crumbs(l,'BudgetZen')],style,body}));}
pages.push('budgetzen.html');}

// ---------- Byrsa Team home ----------
{const src=rd('source/index.src.html'),{U,A,P,Q}=grab(src,'U,A,P,Q'),style=css(src);
for(const [l] of LANGS){const d=U[l]||U.en,e=P[l],q=Q[l],v=['0','100%','0','10'];
const apps=A.map(a=>`<article class="ap"><div><div class="ah"><div class="ai${a.full?' f':''}"><img src="/${SMALL[a.icon]||a.icon}" alt="${esc(a.name)} app icon" width="64" height="64"></div><div><h3>${esc(a.name)}</h3><div class="tag">${esc(a.tag[l]||a.tag.en)}</div></div></div><p>${esc(a.desc[l]||a.desc.en)}</p></div><div class="ab"><a class="btn g" rel="noopener" href="${a.play}">${esc(d[4])}</a>${a.page?`<a class="btn o"${/^https?:/.test(a.page)?' rel="noopener"':''} href="${/^https?:/.test(a.page)?a.page:loc(l,a.page)}">${esc(d[5].replace('{n}',a.name))}</a>`:''}</div></article>`).join('');
const body=`
<header><b><img src="/byrsa-icon.webp" width="32" height="32" alt="Byrsa Team logo">Byrsa Team</b><a class="nl" href="#apps">${esc(d[0])}</a>
${sel(l,'')}
<button class="ic" id="T" aria-label="Theme">🌓</button></header>
<main>
<div class="hero"><div class="hi"><div class="pill">${esc(d[1])}</div><h1>${esc(d[2])}</h1><p class="sub">${esc(d[3])}</p></div></div>
<section id="apps" class="rv"><h2>${esc(d[0])}</h2><div class="aps">${apps}</div></section>
<div class="stats rv">${e[1].split('|').map((t,i)=>`<div class="stat"><b>${v[i]}</b><span>${esc(t)}</span></div>`).join('')}</div>
<div class="flow rv" aria-hidden="true">${e[3].split('|').map((t,i)=>`<b${i==3?' class="x"':''}>${['📱 ','🧠 ','💾 ','☁️ '][i]}${esc(t)}</b>`).join('<i>→</i>')}</div>
<section class="rv"><h2>${esc(e[0])}</h2><div class="g">${e[2].split('|').map(x=>{const[a,b,c]=x.split('::');return`<article class="card"><span class="em" aria-hidden="true">${a}</span><h3>${esc(b)}</h3><p>${esc(c)}</p></article>`}).join('')}</div></section>
<section class="rv"><div class="leg"><h2>${esc(q[0])}</h2><p>${esc(q[1])}</p><p>${esc(q[2])}</p><div class="qc">${q[3].split('|').map(x=>{const[a,b]=x.split('::');return`<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`}).join('')}</div></div></section>
</main>
<footer>${nav(l,'')}© 2026 Byrsa Team. ${esc(d[6])}</footer>`;
const site=[{'@context':'https://schema.org',...ORG,description:d[3],inLanguage:l},{'@context':'https://schema.org','@type':'WebSite',name:'Byrsa Team',url:SITE+'/',inLanguage:l}];
W(out(l,''),shell({l,f:'',title:TI[l],desc:fit(d[3]),img:'og-byrsa.jpg',imgAlt:'Byrsa Team',j:site,style,body}));}
pages.push('');}

// ---------- sitemap, robots, 404 ----------
const urls=pages.flatMap(f=>LANGS.map(([l])=>`<url><loc>${abs(l,f)}</loc><lastmod>${TODAY}</lastmod>${LANGS.map(([c])=>`<xhtml:link rel="alternate" hreflang="${c}" href="${abs(c,f)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${abs('en',f)}"/></url>`));
W('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
W('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
W('404.html',`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 | Byrsa Team</title><link rel="icon" href="/favicon.png"><style>body{font:18px system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f6f7ff;color:#1b1f3b;text-align:center}a{color:#5b5bf5;font-weight:700}</style></head><body><main><h1>404</h1><p>Page not found.</p><p><a href="/">Byrsa Team</a> · <a href="/budgetzen.html">BudgetZen</a></p></main></body></html>\n`);
console.log('Built',LANGS.length*pages.length,'pages + sitemap.xml, robots.txt, 404.html');
