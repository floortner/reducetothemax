/* Option A navigation layer.
   Loaded after the Option B prototype (site/new). It leaves every page and route untouched and only
   replaces the navigation chrome: the rail, the header tabs, the type switcher and the phone menu.
   6 apps instead of 12: Home, Explore, Issues, Library, Automate, Admin. */
(function(){
const GR=[
 {id:'home',name:'Home',rep:'home',hl:'p',tabs:[{n:'Overview',routes:['home/overview','home/business','quickstart/landing']}]},
 {id:'explore',name:'Explore',rep:'infrastructure',hl:'y',tabs:[
  {n:'Entities',lbl:'Entity type',items:[['Hosts','infrastructure/hosts'],['Network','infrastructure/network'],['Kubernetes','infrastructure/kubernetes'],['Clouds','infrastructure/clouds'],['Services','applications/services'],['Frontends','experience/frontends'],['Synthetic','experience/synthetic'],['SLOs','applications/slos'],['Cost','infrastructure/cost']]},
  {n:'Telemetry',lbl:'Signal',items:[['Logs','telemetry/logs'],['Traces','telemetry/traces'],['Metrics','telemetry/metrics'],['Events','telemetry/business-events'],['User sessions','telemetry/user-sessions'],['LLM & Agentic','telemetry/ai']]},
  {n:'Analyze',lbl:'Analysis',items:[['Errors','applications/errors'],['Profile & Debug','applications/profiling'],['Heatmaps','experience/heatmaps'],['User analytics','experience/user-analytics'],['Feature flags','experience/feature-flags']]},
  {n:'Map',prefix:'smartscape/',routes:['smartscape/grail']}]},
 {id:'issues',name:'Issues',rep:'issues',hl:'p',badgeApps:['issues'],tabs:[
  {n:'Problems',routes:['issues/problems']},
  {n:'Security',lbl:'Security',items:[['Vulnerabilities','security/vulnerabilities'],['SIEM','security/siem'],['Detections','security/detectors'],['User audits','security/user-audits']]},
  {n:'Recommendations',routes:['issues/recommendations']}]},
 {id:'library',name:'Library',rep:'documents',hl:'b',tabs:[
  {n:'All',lbl:'Type',items:[['Dashboards','documents/dashboards'],['Notebooks','documents/notebooks'],['Pages','documents/pages'],['Launchpads','documents/launchpads'],['Investigations','issues/investigations']]}]},
 {id:'automate',name:'Automate',rep:'automate',hl:'b',badgeApps:['automate'],tabs:[
  {n:'Workflows',routes:['automate/workflows']},{n:'Executions',routes:['automate/executions']},{n:'Guardians',routes:['automate/guardians']},
  {n:'Templates',lbl:'Templates for',items:[['Infrastructure','infrastructure/templates'],['Applications','applications/templates'],['Security','security/templates']]}]},
 {id:'admin',name:'Admin',rep:'admin',hl:'b',badgeApps:['admin'],tabs:[
  {n:'Coverage',routes:['admin/coverage']},{n:'Fleet',routes:['admin/fleet']},{n:'Hub',routes:['admin/apps']},{n:'Access requests',routes:['admin/access']},{n:'Settings',routes:['admin/settings']}]}
];
GR.forEach(g=>g.tabs.forEach(t=>{if(t.items)t.routes=t.items.map(i=>i[1])}));
const APP2G={home:'home',quickstart:'home',smartscape:'explore',infrastructure:'explore',applications:'explore',experience:'explore',telemetry:'explore',issues:'issues',security:'issues',documents:'library',automate:'automate',admin:'admin'};
const route=()=>cur?`${cur.app.id}/${cur.tab.id}`:'';
const hit=(t,r)=>t.routes.includes(r)||(t.prefix&&r.startsWith(t.prefix));
function where(){
  const r=route();
  for(const g of GR)for(const t of g.tabs)if(hit(t,r))return{g,t};
  const g=GR.find(x=>x.id===(APP2G[cur&&cur.app.id]||'home'));return{g,t:null};
}
const LASTI={},LASTG={};
const tabRoute=(g,t)=>{const l=LASTI[g.id+'/'+t.n];return l&&hit(t,l)?l:t.routes[0]};
const gRoute=g=>LASTG[g.id]||tabRoute(g,g.tabs[0]);
const gIcon=(g,s)=>appIcon(appOf(g.rep),s);
const gBadge=g=>(g.badgeApps||[]).reduce((n,id)=>{const a=appOf(id);return n+(a&&a.badge?a.badge():0)},0);
const tBadge=t=>{let n=0,tone='r',sq=false;t.routes.forEach(r=>{const b=findTab(r)&&findTab(r).badge;if(b&&b.fn){const v=b.fn();if(v){if(!n){tone=b.tone;sq=b.square}n+=v}}});return n?`<span class="n ${tone}${sq?' sq':''}">${n}</span>`:''};
const iBadge=r=>{const b=findTab(r)&&findTab(r).badge;if(!b)return '';if(b.label)return `<span class="n ${b.tone} lbl">${b.label}</span>`;const n=b.fn?b.fn():0;return n?`<span class="n ${b.tone}${b.square?' sq':''}">${n}</span>`:''};

renderRail=function(){
  const ra=[...new Set(HIST.map(x=>x.app))].slice(0,3),pins=HIST.filter(x=>x.pinned),cg=where().g;
  const link=g=>{const n=gBadge(g);return `<a class="app" data-g="${g.hl}" href="#/${gRoute(g)}" ${g.id===cg.id?'aria-current="page"':''} title="${esc(g.name)}">${gIcon(g,22)}<span class="lbl">${esc(g.name)}</span>${n?`<span class="pip" aria-label="${n} open">${n}</span>`:''}</a>`};
  const G=id=>GR.find(g=>g.id===id);
  $('#rail').innerHTML=`<a class="brand" href="#/home/overview" aria-label="Home" title="Home"><div class="bmark">${brandMark()}</div><div class="bwide">${brandWide()}</div></a>
  ${link(G('home'))}
  <button class="app" data-g="b" data-search title="Search">${svgI(NAVI.search)}<span class="lbl">Search</span><kbd class="tail">${/Mac/.test(navigator.platform)?'⌘ K':'Ctrl K'}</kbd></button>
  <button class="app" data-g="b" id="assistbtn" aria-haspopup="dialog" aria-expanded="${assistOpen}" title="Assist">${svgI(NAVI.assist)}<span class="lbl">Assist</span><kbd class="tail">${/Mac/.test(navigator.platform)?'⌘ I':'Ctrl I'}</kbd></button>
  <button class="app" data-g="b" id="recbtn" aria-haspopup="dialog" aria-expanded="${recOpen}" title="Recents">${svgI(NAVI.recents)}<span class="lbl">Recents</span><span class="mini tail" aria-hidden="true">${ra.map(id=>`<i>${appIcon(appOf(id),14)}</i>`).join('')}</span></button>
  <div class="sep"></div>${link(G('explore'))}${link(G('issues'))}<div class="sep"></div>${link(G('library'))}${link(G('automate'))}${link(G('admin'))}`+
  (pins.length?`<div class="sep"></div>`+pins.map(x=>`<button class="app" data-g="g" data-h="${x.id}" title="${esc(x.label)}"><svg class="i" viewBox="0 0 24 24">${ICO.pin}</svg><span class="lbl">${esc(x.label)}</span></button>`).join(''):'')+
  `<div class="grow"></div><div class="foot"><button class="app" data-g="g" id="collapse" title="Collapse navigation">${svgI(NAVI.collapse)}<span class="lbl">Collapse</span></button></div>`;
};

renderHead=function(){
  const {g,t}=where(),r=route();
  if(t)LASTI[g.id+'/'+t.n]=r;LASTG[g.id]=r;
  {const h=$('#pageh');if(h)h.textContent=`${t?t.n:cur.tab.name}${t&&t.items?' – '+((t.items.find(i=>i[1]===r)||[])[0]||''):''} – ${g.name}`}
  $('#appid').innerHTML=isMobile()?`<span class="mbrand"><a href="#/home/overview" aria-label="Dynatrace home">${brandWide()}</a></span>`:
    `<a class="appname gname" href="#/${g.tabs[0].routes[0]}" title="Open the ${esc(g.name)} start page">${gIcon(g,24)}<span>${esc(g.name)}</span></a><div class="pop"><button class="appchev" data-pop="appmenu" aria-haspopup="menu" aria-expanded="false" aria-label="${esc(g.name)} menu" title="Menu">${svgI(ICO.chev,'style="width:14px;height:14px"')}</button><div class="menu" id="appmenu" hidden role="menu"></div></div>`;
  const docs=USER_DOCS.filter(d=>APP2G[d.app]===g.id);
  $('#tabs').hidden=g.tabs.length<2&&!docs.length;
  $('#tabs').innerHTML=g.tabs.map(tt=>`<a href="#/${tabRoute(g,tt)}" role="tab" aria-selected="${tt===t}">${esc(tt.n)}${tBadge(tt)}</a>`).join('')+
    docs.map(d=>`<a href="#/${d.app}/doc-${d.id}" role="tab" aria-selected="${cur.tab.id==='doc-'+d.id}">${iconImg(DOC_TYPES[d.type][3],16)}${esc(d.name)}<span class="tabx" data-tabx="${esc(d.id)}" title="Remove ${esc(d.name)}" aria-label="Remove ${esc(d.name)}">×</span></a>`).join('');
  $('#addmenu').innerHTML=addMenuHtml(cur.app);$('#addmenu').hidden=true;$('#rmmenu').hidden=true;
  const sw=$('#aswitch');
  if(sw){if(t&&t.items){sw.hidden=false;sw.innerHTML=`<span class="asl">${esc(t.lbl||t.n)}</span>`+t.items.map(([n,rt])=>`<a class="achip" href="#/${rt}" ${rt===r?'aria-current="page"':''}>${esc(n)}${iBadge(rt)}</a>`).join('')}else{sw.hidden=true;sw.innerHTML=''}}
  const ab=$('#abadge');if(ab)ab.hidden=false;
};

renderMmenu=function(){
  const el=$('#mmenu');if(!el)return;
  const cg=where().g;
  const item=g=>{const ok=MOB_OK.find(x=>g.tabs.some(t=>hit(t,x))),rt=ok||gRoute(g),n=gBadge(g);
    return `<a class="mmi ${ok?'':'off'}" data-g="${g.hl}" href="#/${rt}" ${g.id===cg.id?'aria-current="page"':''}>${gIcon(g,22)}<span>${esc(g.name)}</span>${n?`<i class="mpip2">${n}</i>`:''}${ok?'':'<em>Desktop</em>'}</a>`};
  const pins=HIST.filter(x=>x.pinned);
  el.innerHTML=`<div class="mmh"><div class="mmbrand">${brandWide()}</div><button class="icbtn" id="mmclose" aria-label="Close menu">×</button></div>
   <div class="mmb"><h5>Apps</h5>${GR.map(item).join('')}
   ${pins.length?`<h5>Pinned</h5>${pins.map(h=>{const ok=MOB_OK.includes(h.app+'/'+h.tab);return `<button class="mmi ${ok?'':'off'}" data-g="g" data-h="${h.id}"><svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICO.pin}</svg><span>${esc(h.label)}</span>${ok?'':'<em>Desktop</em>'}</button>`}).join('')}`:''}
   <p class="muted mmn">Items marked Desktop open on a larger screen. Phones show a read-only subset.</p></div>`;
};

const _um=renderUserMenu;
renderUserMenu=function(){_um();$('#usermenu').insertAdjacentHTML('afterbegin',`<a class="mi" role="menuitem" href="../new/">Switch to Option B<small>Original navigation, 12 apps</small></a><div class="msep"></div>`)};

/* Home absorbs QuickStart, Business templates and the Smartscape launcher */
{const ht=appOf('home').tabs.find(t=>t.id==='overview'),_r=ht.render;
 ht.render=function(host){_r(host);host.insertAdjacentHTML('beforeend',`<section class="card" style="margin-top:16px"><h2>Get started</h2><p class="muted" style="margin:0 0 10px">Set up data collection, start from an industry dashboard or explore your environment on the map.</p><div class="acts" style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="#/quickstart/landing">Open QuickStart</a><a class="btn" href="#/home/business">Dashboard templates</a><a class="btn" href="#/smartscape/grail">Open the map</a></div></section>`)}}

/* header group link and chrome elements */
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('.gname');if(a){e.preventDefault();e.stopPropagation();const g=where().g;go(...g.tabs[0].routes[0].split("/"))}},true);
$('#body').insertAdjacentHTML('beforebegin','<nav class="aswitch" id="aswitch" hidden aria-label="View type"></nav>');
$('.apphead > .pop:last-child').insertAdjacentHTML('beforebegin','<span class="abadge" id="abadge" hidden title="Option A: 6 apps">Option A</span>');
const st=document.createElement('style');st.textContent=`
.aswitch{display:flex;align-items:center;gap:6px;padding:8px 20px;border-bottom:1px solid var(--line);background:var(--panel);overflow-x:auto;white-space:nowrap}
.aswitch[hidden]{display:none}
.asl{color:var(--muted);font-size:12px;margin-right:4px}
.achip{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border:1px solid var(--line);border-radius:16px;color:var(--text);text-decoration:none;background:var(--panel)}
.achip:hover{background:var(--hover)}
.achip[aria-current=page]{background:var(--accent-soft);border-color:var(--accent);font-weight:600}
.abadge{margin-left:auto;font-size:12px;color:var(--muted);border:1px solid var(--line);border-radius:10px;padding:1px 9px;margin-right:10px}
.apphead>.pop:last-child{margin-left:0}
@media (max-width:700px){.aswitch{padding:8px 12px}.abadge{display:none}.achip{min-height:40px}}`;
document.head.appendChild(st);
renderUserMenu();render();
})();
