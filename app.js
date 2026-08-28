let rows=[];
let charts={};
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const num=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);
const avg=a=>a.length?a.reduce((s,r)=>s+r.Revenue,0)/a.reduce((s,r)=>s+r.DealsClosed,0):0;

const sample=[
['North','Ava','Core Platform',420000,18],['North','Liam','Analytics Pro',310000,13],['North','Noah','Core Platform',270000,12],
['South','Mia','Analytics Pro',510000,19],['South','Ethan','Core Platform',390000,15],['South','Olivia','Security Suite',185000,10],
['West','Lucas','Security Suite',620000,20],['West','Emma','Core Platform',355000,14],['West','James','Analytics Pro',295000,11],
['East','Sophia','Core Platform',480000,18],['East','Henry','Analytics Pro',260000,12],['East','Charlotte','Security Suite',230000,9]
].map(([Region,Rep,Product,Revenue,DealsClosed])=>({Region,Rep,Product,Revenue,DealsClosed}));

function normalize(data){
 return data.map(r=>{const get=k=>r[k]??r[k.replaceAll(' ','')]??r[k.toLowerCase()]??r[k.replaceAll(' ','_')]??'';return {Region:String(get('Region')).trim(),Rep:String(get('Sales Rep')||get('Rep')).trim(),Product:String(get('Product')).trim(),Revenue:Number(String(get('Revenue')).replace(/[$,]/g,''))||0,DealsClosed:Number(get('Deals Closed')||get('DealsClosed'))||0}}).filter(r=>r.Region&&r.Rep&&r.Product);
}
function groupBy(key){const m=new Map();rows.forEach(r=>{const k=r[key];if(!m.has(k))m.set(k,{name:k,revenue:0,deals:0});const x=m.get(k);x.revenue+=r.Revenue;x.deals+=r.DealsClosed});return [...m.values()].map(x=>({...x,avgDeal:x.deals?x.revenue/x.deals:0}));}
function metricValue(x,m){return m==='revenue'?x.revenue:m==='deals'?x.deals:x.avgDeal}
function metricLabel(m){return m==='revenue'?'Revenue':m==='deals'?'Deals Closed':'Average Deal Size'}
function formatMetric(v,m){return m==='revenue'||m==='avgDeal'?money(v):num(v)}
function renderTable(id,data,m){const sorted=[...data].sort((a,b)=>metricValue(b,m)-metricValue(a,m));const top=sorted[0]?.name;$(id).innerHTML=`<thead><tr><th>Name</th><th>${metricLabel(m)}</th><th>Avg deal</th></tr></thead><tbody>${sorted.map(x=>`<tr><td><strong>${x.name===top?'🏆 ':''}${x.name}</strong></td><td>${formatMetric(metricValue(x,m),m)}</td><td>${money(x.avgDeal)}</td></tr>`).join('')}</tbody>`}
function renderChart(canvasId,data,m){const ctx=$(canvasId);if(charts[canvasId])charts[canvasId].destroy();const sorted=[...data].sort((a,b)=>metricValue(b,m)-metricValue(a,m));charts[canvasId]=new Chart(ctx,{type:'bar',data:{labels:sorted.map(x=>x.name),datasets:[{label:metricLabel(m),data:sorted.map(x=>metricValue(x,m))}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{callback:v=>m==='deals'?v:money(v)}}}}})}
function update(){if(!rows.length)return;const m=$('metricSelect').value,totalRev=rows.reduce((s,r)=>s+r.Revenue,0),totalDeals=rows.reduce((s,r)=>s+r.DealsClosed,0);$('totalRevenue').textContent=money(totalRev);$('totalDeals').textContent=num(totalDeals);$('avgDealSize').textContent=money(totalDeals?totalRev/totalDeals:0);const reps=groupBy('Rep'),best=[...reps].sort((a,b)=>metricValue(b,m)-metricValue(a,m))[0];$('topPerformer').textContent=best?.name||'—';const regions=groupBy('Region'),products=groupBy('Product');renderChart('regionChart',regions,m);renderChart('repChart',reps,m);renderChart('productChart',products,m);renderTable('regionTable',regions,m);renderTable('repTable',reps,m);renderTable('productTable',products,m);const weakest=[...reps].sort((a,b)=>metricValue(a,m)-metricValue(b,m)).slice(0,2);$('executiveSummary').textContent=`${best.name} is the leading sales rep on ${metricLabel(m).toLowerCase()} at ${formatMetric(metricValue(best,m),m)}. ${regions.sort((a,b)=>b.revenue-a.revenue)[0].name} is the strongest region by revenue, while ${products.sort((a,b)=>b.revenue-a.revenue)[0].name} generates the most revenue.`;$('attentionList').innerHTML=weakest.map(x=>`<li><strong>${x.name}</strong> is among the lowest on ${metricLabel(m).toLowerCase()} (${formatMetric(metricValue(x,m),m)}). Review pipeline mix, territory coverage and recent deal activity.</li>`).join('');$('dashboard').classList.remove('hidden');}
function load(data,label){rows=normalize(data);$('fileStatus').textContent=`Loaded ${rows.length} rows${label?' · '+label:''}`;update()}
$('sampleBtn').onclick=()=>load(sample,'sample data');
$('fileInput').onchange=e=>{const file=e.target.files[0];if(!file)return;Papa.parse(file,{header:true,skipEmptyLines:true,complete:r=>load(r.data,file.name),error:err=>$('fileStatus').textContent='Could not read that CSV: '+err.message})};
$('metricSelect').onchange=update;
load(sample,'sample data');
