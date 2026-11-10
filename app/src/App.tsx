/** THREAD: interactive frontend prototype. No live data or actionable backend. */
const Model:any = (globalThis as any).ThreadModel;
const UI:any = (globalThis as any).ThreadUI;
const R:any = (globalThis as any).React;
type Page = 'explore'|'lineage'|'scenario'|'portfolio';
type AppState={
  page:Page;productId:string;query:string;category:string;filter:string;sort:string;
  selectedNode:string; settings:any; simulatedSettings:any; result:any;dirty:boolean;week:number;
  selectedIds:string[]; savedAt:string; notice:string;compactNav:boolean;helpOpen:boolean;
};
const sections:{id:Page;icon:string;label:string;short:string}[]=[
  {id:'explore',icon:'grid',label:'Product Explorer',short:'Products'},
  {id:'lineage',icon:'layers',label:'Supply Network',short:'Network'},
  {id:'scenario',icon:'sliders',label:'Scenario Studio',short:'Scenarios'},
  {id:'portfolio',icon:'chart',label:'Portfolio Exposure',short:'Portfolio'}
];
class ThreadApp extends (R.Component as any){
  state:AppState={page:'explore',productId:'SK-10048',query:'',category:'All',filter:'All',sort:'relevance',selectedNode:'east',settings:{...Model.initialSettings},simulatedSettings:{...Model.initialSettings},result:Model.simulate(Model.first,Model.initialSettings),dirty:false,week:5,selectedIds:[],savedAt:'',notice:'',compactNav:false,helpOpen:false};
  private noticeTimer:any=null;
  componentDidMount(){
    document.addEventListener('keydown',this.keyboard);
    try{const raw=localStorage.getItem('thread-demo-draft');if(raw){const s=JSON.parse(raw);if(s&&s.settings){const product=Model.products.find((p:any)=>p.id===s.productId)||Model.first;this.setState({savedAt:s.savedAt||'',settings:s.settings,productId:product.id,result:Model.simulate(product,Model.initialSettings),dirty:true});}}}catch(_){}
  }
  componentWillUnmount(){document.removeEventListener('keydown',this.keyboard);if(this.noticeTimer)clearTimeout(this.noticeTimer)}
  keyboard=(e:KeyboardEvent)=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();this.go('explore');setTimeout(()=>document.getElementById('product-search')?.focus(),40);
    }
    if(e.key==='Escape'&&this.state.helpOpen)this.setState({helpOpen:false});
  };
  message=(text:string)=>{if(this.noticeTimer)clearTimeout(this.noticeTimer);this.setState({notice:text});this.noticeTimer=setTimeout(()=>this.setState({notice:''}),4200)};
  go=(page:Page)=>this.setState({page});
  selected=()=>Model.products.find((p:any)=>p.id===this.state.productId)||Model.first;
  product=(id:string)=>{
    const p=Model.products.find((v:any)=>v.id===id)||Model.first;
    this.setState({productId:p.id,result:Model.simulate(p,this.state.simulatedSettings),dirty:this.state.dirty,selectedNode:'east'});
  };
  setParam=(field:string,value:any)=>this.setState({settings:{...this.state.settings,[field]:value},dirty:true});
  run=()=>{
    const s=this.state.settings;
    if(s.duration>7){this.message('Scenario duration must be seven weeks or less.');return;}
    this.setState({result:Model.simulate(this.selected(),s),simulatedSettings:{...s},dirty:false,page:'scenario'});
    this.message('Simulation updated · illustrative model · no live system changed');
  };
  save=()=>{
    const at=new Date().toLocaleString('en-GB');
    try{localStorage.setItem('thread-demo-draft',JSON.stringify({productId:this.state.productId,settings:this.state.settings,savedAt:at}));this.setState({savedAt:at});this.message('Draft saved locally in your browser.');}
    catch(_){this.message('Browser storage unavailable; draft not saved.');}
  };
  reset=()=>{const settings={...Model.initialSettings};this.setState({settings,simulatedSettings:{...settings},result:Model.simulate(this.selected(),settings),dirty:false,week:5});this.message('Scenario reset to the default example.');};
  toggleSelect=(id:string)=>this.setState({selectedIds:this.state.selectedIds.includes(id)?this.state.selectedIds.filter(x=>x!==id):this.state.selectedIds.concat([id])});
  filtered=()=>{
    const q=this.state.query.trim().toLowerCase();let xs=Model.products.filter((p:any)=>(this.state.category==='All'||p.category===this.state.category)&&(this.state.filter==='All'||p.risk===this.state.filter)&&(!q||(p.name+' '+p.id+' '+p.category).toLowerCase().includes(q)));
    if(this.state.sort==='stock')xs=xs.slice().sort((a:any,b:any)=>a.stock-b.stock);
    if(this.state.sort==='demand')xs=xs.slice().sort((a:any,b:any)=>b.baseDemand-a.baseDemand);
    return xs;
  };
  kpi=(r:any)=>[{label:'Projected service level',value:r.service.toFixed(1)+'%',note:(r.changePct>=0?'+':'')+r.changePct.toFixed(1)+' pp vs baseline',accent:r.service<93?'warn':'good'},
    {label:'Unmet demand',value:Model.number(r.impactUnits)+' u',note:r.proposedStockouts+' of 8 weeks affected',accent:r.impactUnits?'warn':''},
    {label:'Revenue exposure',value:Model.currency(r.revenueAtRisk),note:'Scenario estimate · not a forecast',accent:r.revenueAtRisk?'warn':''},
    {label:'Mitigation cost',value:Model.currency(r.cost),note:'Illustrative operating cost'}];
  renderHeader(){const s=this.state;return <header className="global-header">
      <div className="brand-block"><div className="brand-symbol"><span></span><span></span><span></span></div><div className="brand-title">THREAD<span className="brand-slash">/</span></div><div className="brand-sub">Connected Planning</div></div>
      <div className="workspace-selector"><UI.Icon name="globe" size={15}/><span>Global Planning Unit</span><UI.Icon name="down" size={13}/></div>
      <div className="top-divider"/><div className="calendar-context"><UI.Icon name="clock" size={15}/> 8-week outlook <UI.Icon name="down" size={13}/></div>
      <div className="top-spacer"/><span className="demo-pill"><i/> SYNTHETIC DATA</span>
      <button className="global-search" onClick={()=>{this.go('explore');setTimeout(()=>document.getElementById('product-search')?.focus(),30);}}><UI.Icon name="search" size={16}/> Search products, facilities <kbd>Ctrl K</kbd></button>
      <button className="outline action" onClick={this.save}><UI.Icon name="bookmark" size={16}/> Save Draft</button>
      <button className="primary action" onClick={this.run}><UI.Icon name="play" size={15}/> Run Simulation</button>
      <button className="icon-button" aria-label="About this prototype" onClick={()=>this.setState({helpOpen:true})}><UI.Icon name="info" size={19}/></button>
  </header>}
  renderNav(){return <nav className="nav-rail" aria-label="Main navigation"><div className="nav-stack">
    {sections.map(x=><button key={x.id} className={'nav-item '+(this.state.page===x.id?'current':'')} title={x.label} aria-label={x.label} aria-current={this.state.page===x.id?'page':undefined} onClick={()=>this.go(x.id)}><UI.Icon name={x.icon} size={20}/><span>{x.short}</span></button>)}
    </div><div className="nav-bottom"><button className="nav-item" onClick={()=>this.setState({helpOpen:true})} title="About"><UI.Icon name="info" size={19}/><span>About</span></button></div>
    </nav>}
  renderCrumb(trail:string[]){return <div className="breadcrumbs">{trail.map((x,i)=><span key={i}>{i>0&&<UI.Icon name="chevron" size={12}/>} {x}</span>)}<div className="context-right"><span className="live-dot"/> Demo workspace · No real operations</div></div>}
  renderExplorerList(embedded=false){const s=this.state,filtered=this.filtered(),p=this.selected();return <section className={'explorer-panel '+(embedded?'embedded':'')}>
    <div className="panel-titlebar"><div><div className="overline">CATALOG / SCOPE</div><h2>Product Explorer</h2></div><span className="count-square">{Model.number(Model.products.length)}</span></div>
    <div className="explorer-sub">Manage the catalog. Follow one SKU through its dependencies.</div>
    <label className="search-input"><UI.Icon name="search" size={16}/><input id="product-search" value={s.query} onChange={(e:any)=>this.setState({query:e.target.value})} placeholder="Search product or SKU" aria-label="Search products or SKU"/></label>
    <div className="filter-grid"><select value={s.category} onChange={(e:any)=>this.setState({category:e.target.value})} aria-label="Product category"><option>All</option>{['Apparel','Footwear','Home','Beauty','Outdoor'].map(x=><option key={x}>{x}</option>)}</select>
      <select value={s.filter} onChange={(e:any)=>this.setState({filter:e.target.value})} aria-label="Risk filter"><option>All</option><option>At risk</option><option>Watch</option><option>Healthy</option></select></div>
    <div className="result-meta"><span>{Model.number(filtered.length)} matches</span><select value={s.sort} onChange={(e:any)=>this.setState({sort:e.target.value})} aria-label="Sort products"><option value="relevance">By catalog</option><option value="stock">Low stock</option><option value="demand">High demand</option></select></div>
    <div className="catalog-items" role="listbox" aria-label="Products">
      {filtered.slice(0,30).map((x:any)=><button key={x.id} type="button" className={'product-row '+(x.id===p.id?'selected':'')} aria-selected={x.id===p.id} onClick={()=>this.product(x.id)}>
          <UI.AvatarProduct kind={x.image}/><div className="product-copy"><div className="product-name">{x.name}</div><div className="product-code">{x.id} · {x.category}</div><div className="product-stock">{Model.number(x.stock)} u available</div></div><div className="product-row-end"><UI.StatusChip status={x.risk} small/><UI.Icon name="chevron" size={14}/></div>
        </button>)}
      {filtered.length===0&&<div className="empty-state">No matching products. Try changing the search or filters.</div>}
      {filtered.length>30&&<div className="more-products">Showing first 30 of {Model.number(filtered.length)} matching SKUs. Narrow your search to find more.</div>}
    </div><div className="explorer-foot"><UI.Icon name="layers" size={16}/> {Model.productsAtRisk()} catalog SKUs flagged for review</div>
  </section>}
  renderNetwork(mode:'overview'|'lineage'='overview'){
    const s=this.state,pr=this.selected(),w=s.result.weeks[s.week-1],sev=Model.severity(w);
    const figures:any={retail:[22,51],east:[45,38],west:[46,73],factory:[70,42],supplier:[89,23]};
    const nodes=mode==='lineage'?['supplier','factory','east','west','retail']:['retail','east','factory','supplier','west'];
    return <div className={'network-viz '+(mode==='lineage'?'lineage':'')}>
      <div className="network-top"><div><div className="overline">SPATIAL LINEAGE / {mode==='lineage'?'FULL NETWORK':'PRODUCT FOCUS'}</div><h3>{pr.name} <span className="code-label">{pr.id}</span></h3></div><div className="network-meta"><UI.StatusChip status={sev}/><span className="network-date">W{String(s.week).padStart(2,'0')} / 08</span></div></div>
      <div className="network-labelbar"><span><i className="swatch iris"/> Active product path</span><span><i className="swatch warning"/> Projected constraint</span><span><i className="swatch neutral"/> Secondary flow</span></div>
      <svg className="network-links" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="flow-line"><stop offset="0%" stopColor="#7774da"/><stop offset="100%" stopColor="#a5a2f5"/></linearGradient></defs>
      <g className="base-graph"><path d="M220 255 C 290 255 350 190 450 190 S 625 210 700 210 S 790 120 890 115"/><path d="M450 190 C 480 295 495 355 460 375 S 330 360 220 255"/><path d="M700 210 C 790 210 805 190 890 115"/></g>
      <g className="active-graph"><path d="M220 255 C 290 255 350 190 450 190 S 625 210 700 210 S 790 120 890 115" /></g>
      {(sev==='At risk'||sev==='Watch')&&<g className="warning-graph"><path d="M220 255 C 290 255 350 190 450 190" /></g>}
      {[[220,255],[450,190],[460,375],[700,210],[890,115]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="6" fill="#fff" stroke="#9290dc" strokeWidth="2"/><circle cx={x} cy={y} r="2.3" fill="#6159ce"/></g>)}
      </svg>
      <div className="spatial-grid" aria-label="Supply chain facility nodes">{nodes.map((id:string)=>{
        const loc=Model.locations.find((n:any)=>n.id===id),xy=figures[id];const title=loc?.name||id;
        return <button key={id} type="button" onClick={()=>this.setState({selectedNode:id})} className={'physical-node '+(s.selectedNode===id?'selected ':'')+(id==='east'&&sev!=='Healthy'?'risk':'')} style={{left:xy[0]+'%',top:xy[1]+'%'}} aria-pressed={s.selectedNode===id}>
          <span className="physical-icon"><UI.Icon name={loc?.icon||'package'} size={id==='factory'?27:24}/></span>
          <span className="physical-label"><strong>{title}</strong><small>{loc?.subtitle}</small></span>
          <span className="node-pin"><i/></span>
        </button>})}</div>
      <div className="network-note"><UI.Icon name="info" size={14}/> Abstract spatial diagram; locations and projections are synthetic. <button onClick={()=>this.go(mode==='lineage'?'explore':'lineage')}>{mode==='lineage'?'Back to Product':'Explore full lineage'} <UI.Icon name="chevron" size={13}/></button></div>
    </div>;
  }
  renderTimeline(){const s=this.state,rows=s.result.weeks,hi=Math.max(...rows.flatMap((v:any)=>[v.baseline,v.proposed,v.demand]))*1.12||1;const px=(w:number)=>30+(w-1)*94;const py=(v:number)=>125-v/hi*95;
    const pLine=rows.map((v:any)=>`${px(v.week)},${py(v.proposed)}`).join(' '),bLine=rows.map((v:any)=>`${px(v.week)},${py(v.baseline)}`).join(' ');
    return <div className="timeline"><div className="timeline-header"><div><div className="overline">TIME MACHINE</div><h3>Inventory trajectory <small>8-week horizon</small></h3></div><div className="legend"><span><i className="swatch iris"/> Scenario</span><span><i className="swatch neutral"/> Baseline</span></div></div>
      <div className="timeline-main"><svg viewBox="0 0 725 150" preserveAspectRatio="none" aria-label="Week-by-week inventory comparison" role="img">{[0,1,2,3].map(i=><line key={i} x1="30" x2="710" y1={20+i*33} y2={20+i*33} stroke="#e8e9f1" strokeWidth="1"/>)}<polyline points={bLine} fill="none" stroke="#aeb5c6" strokeWidth="2.3" strokeDasharray="6 5" vectorEffect="non-scaling-stroke"/><polyline points={pLine} fill="none" stroke="#5149d7" strokeWidth="3.4" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
        <line x1={px(s.week)} x2={px(s.week)} y1="9" y2="135" stroke="#7268da" strokeWidth="1.3" strokeDasharray="3 3"/>
        {rows.map((v:any)=><g key={v.week} onClick={()=>this.setState({week:v.week})} style={{cursor:'pointer'}}><circle cx={px(v.week)} cy={py(v.proposed)} r={s.week===v.week?5.5:3.4} fill="#554cdb" stroke="#fff" strokeWidth="2"/><text x={px(v.week)} y="146" textAnchor="middle" fontSize="11" fill="#697587">W{v.week}</text><rect x={px(v.week)-35} y="0" width="70" height="149" fill="transparent"/></g>)}
      </svg><div className="timeline-readout"><span>W{String(s.week).padStart(2,'0')}</span><b>{Model.number(rows[s.week-1].proposed)} units</b><small>{rows[s.week-1].shortfall?Model.number(rows[s.week-1].shortfall)+' unfulfilled':Model.severity(rows[s.week-1])+' coverage'}</small></div></div>
      <input className="time-range" type="range" min="1" max="8" step="1" value={s.week} onChange={(e:any)=>this.setState({week:Number(e.target.value)})} aria-label="Week scrubber"/>
    </div>;
  }
  renderNodeInspector(){const loc=Model.locations.find((n:any)=>n.id===this.state.selectedNode)||Model.locations[1],s=this.state,r=s.result,w=r.weeks[s.week-1],product=this.selected();return <section className="inspector">
    <div className="inspector-head"><div className="overline">CONTEXTUAL INSPECTOR</div><h2>{loc.name}</h2><div className="inspector-sub">{loc.region}</div></div>
    <div className="inspector-section"><div className="mini-graphic"><div className="facility-graphic"><UI.Icon name={loc.icon} size={46}/></div><div><div className="overline">CONNECTED NODE</div><strong>{loc.subtitle}</strong><p>{loc.detail}</p></div></div></div>
    <div className="inspector-section"><div className="inspector-section-title">Selected product</div><div className="selected-product"><UI.AvatarProduct kind={product.image}/><div><strong>{product.name}</strong><small>{product.id} · {product.category}</small></div></div><div className="inspector-rows"><div><span>Stock at start</span><b>{Model.number(product.stock)} u</b></div><div><span>Demand / week</span><b>{Model.number(product.baseDemand)} u</b></div><div><span>Projected stock · W{s.week}</span><b>{Model.number(w.proposed)} u</b></div><div><span>Coverage state</span><UI.StatusChip status={Model.severity(w)} small/></div></div></div>
    <div className="inspector-section"><div className="inspector-section-title">Scenario context {s.dirty?'(draft)':'(simulated)'}</div><div className="inspector-rows"><div><span>Demand uplift</span><b>+{s.settings.uplift}%</b></div><div><span>Extra capacity</span><b>+{s.settings.capacity}%</b></div><div><span>Transport</span><b>{s.settings.transport==='express'?'Express':'Standard'}</b></div></div>{s.dirty&&<p className="draft-warning">Parameters changed. Run simulation to update projections.</p>}</div>
    <div className="inspector-bottom"><button className="primary wide" onClick={()=>this.go('scenario')}><UI.Icon name="sliders" size={16}/> Explore what-if scenarios</button><button className="outline wide" onClick={()=>this.go('lineage')}><UI.Icon name="layers" size={16}/> Open full supply network</button></div>
  </section>}
  renderProducts(){const s=this.state,p=this.selected(),r=s.result;return <div className="view-frame">
    {this.renderCrumb(['Portfolio','Products',p.id])}
    <div className="page-overview"><div><div className="eyebrow">01 / PRODUCT INTELLIGENCE</div><h1>Follow the product. <em>See the system.</em></h1><p>Start with one SKU, trace its dependencies, and inspect how planning decisions change outcomes.</p></div><div className="overview-tally"><span>CATALOG</span><strong>1,284</strong><small>SKUs · {Model.productsAtRisk()} flagged for review</small></div></div>
    <div className="workbench"><div className="workbench-left">{this.renderExplorerList()}</div><div className="workbench-center"><div className="center-hero">{this.renderNetwork('overview')}</div>{this.renderTimeline()}</div><div className="workbench-right">{this.renderNodeInspector()}</div></div>
    <footer className="status-footer"><span><i className="system-indicator"/> LOCAL SIMULATOR · SYNTHETIC DATA</span><span>Selected: {p.id}</span><span>Scenario state: {s.dirty?'Changes not simulated':'Simulated · illustrative'}</span><span>Thread Studio v0.1</span></footer>
  </div>}
  renderLineage(){const p=this.selected(),r=this.state.result;return <div className="view-frame">
    {this.renderCrumb(['Portfolio','Products',p.id,'Supply lineage'])}
    <div className="page-overview"><div><div className="eyebrow">02 / CONNECTED SYSTEMS</div><h1>One product. <em>Five connected layers.</em></h1><p>Inspect how material, production, distribution and retail demand depend on each other.</p></div><div className="title-actions"><button className="outline" onClick={()=>this.go('explore')}><UI.Icon name="chevron"/> Product Explorer</button><button className="primary" onClick={()=>this.go('scenario')}><UI.Icon name="spark"/> Investigate impact</button></div></div>
    <div className="lineage-grid"><div className="lineage-main">{this.renderNetwork('lineage')}<div className="lineage-kpis">{this.kpi(r).map((x:any)=><UI.Metric key={x.label} {...x}/>)}</div><div className="lineage-explain"><div className="explain-number">01</div><div><div className="overline">THE DESIGN HYPOTHESIS</div><strong>Don't make people translate six disconnected dashboards into one mental model.</strong><p>Selection is persistent across product discovery, network inspection, scenario testing and portfolio exposure. Every node opens the same contextual inspector.</p></div></div></div><div className="lineage-side">{this.renderNodeInspector()}</div></div>
    <footer className="status-footer"><span><i className="system-indicator"/> FULL LINEAGE · ILLUSTRATIVE</span><span>No operational systems connected</span></footer>
  </div>}
  renderRange(label:string,key:string,min:number,max:number,step:number,unit:string,description:string){const value=this.state.settings[key];return <label className="parameter"><span className="parameter-top"><strong>{label}</strong><b>{value>0&&key==='uplift'?'+':''}{Model.number(value)}{unit}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e:any)=>this.setParam(key,Number(e.target.value))}/><span className="parameter-desc">{description}</span></label>}
  renderScenario(){const s=this.state,p=this.selected(),r=s.result,rows=r.weeks;return <div className="view-frame">
    {this.renderCrumb(['Portfolio','Products',p.id,'Scenario Studio'])}
    <div className="page-overview scenario-title"><div><div className="eyebrow">03 / DECISION SIMULATION</div><h1>Change an assumption. <em>Understand the consequences.</em></h1><p>Explore one decision at a time. Compare a proposal with a consistent, no-promotion baseline.</p></div><div className="scenario-title-actions"><span className={'scenario-state '+(s.dirty?'unsimulated':'simulated')}><i/> {s.dirty?'UNSIMULATED CHANGES':'RESULTS CURRENT'}</span><button className="outline" onClick={this.reset}><UI.Icon name="arrows" size={15}/> Reset</button></div></div>
    <div className="scenario-grid"><section className="scenario-controls"><div className="panel-titlebar"><div><div className="overline">PROPOSED PLAN</div><h2>Scenario controls</h2></div><span className="scenario-count">DRAFT 01</span></div><div className="scenario-selected"><UI.AvatarProduct kind={p.image}/><div><strong>{p.name}</strong><small>{p.id} · {p.category}</small></div><button className="text-link" onClick={()=>this.go('explore')}>Change</button></div>
      <div className="controls-inner">
        {this.renderRange('Demand uplift','uplift',0,70,5,'%','Promotional increase during the selected planning period.')}
        {this.renderRange('Promotion duration','duration',1,6,1,' w','Starting in the second simulation week.')}
        {this.renderRange('Extra production capacity','capacity',0,35,5,'%','Illustrative manufacturing overtime or additional shifts.')}
        {this.renderRange('Distribution transfer','transfer',0,1500,100,' u','One-time transfer, divided between weeks 3 and 4.')}
        <div className="parameter"><span className="parameter-top"><strong>Transport strategy</strong></span><div className="segmented"><button className={s.settings.transport==='standard'?'active':''} onClick={()=>this.setParam('transport','standard')}>Standard</button><button className={s.settings.transport==='express'?'active':''} onClick={()=>this.setParam('transport','express')}>Express</button></div><span className="parameter-desc">Express changes the synthetic replenishment lag.</span></div>
      </div><div className="controls-bottom"><button className="primary wide" onClick={this.run}><UI.Icon name="play" size={17}/> Run simulation</button><button className="outline wide" onClick={this.save}><UI.Icon name="bookmark" size={16}/> Save draft locally</button></div>
    </section><div className="scenario-center"><div className="scenario-banner"><UI.Icon name="spark" size={21}/><div><strong>Simulation / not a production forecast</strong><p>Deterministic, fictional stock and flow model across an eight-week horizon.</p></div></div>
      <div className="comparison-head"><div className="overline">PROJECTED OUTCOMES</div><h2>{s.dirty?'Last simulated results':'Demand +'+s.settings.uplift+'%'} <small>vs no-promotion baseline</small></h2></div>
      <div className="kpi-grid">{this.kpi(r).map((x:any)=><UI.Metric key={x.label} {...x}/>)}</div>
      {this.renderTimeline()}
      <div className="decision-explain"><div className="decision-explain-header"><UI.Icon name="target" size={21}/><strong>What changed?</strong></div><p>{r.impactUnits>0?`In this illustrative run, ${Model.number(r.impactUnits)} units of demand are not fulfilled across ${r.proposedStockouts} week(s). The first shortage appears in week ${r.firstRiskWeek}.`:'This illustrative scenario meets all modeled demand, though buffer levels and costs may still change.'} {r.cost>0?`The chosen mitigations add ${Model.currency(r.cost)} in estimated costs.`:'No extra mitigation costs are modeled.'}</p><button className="text-link" onClick={()=>this.go('lineage')}>Inspect affected network <UI.Icon name="chevron" size={13}/></button></div>
    </div><aside className="scenario-right"><div className="inspector-head"><div className="overline">COMPARISON / DECISION</div><h2>Before → After</h2><div className="inspector-sub">Never confuse scenario preview with execution.</div></div><div className="scenario-table"><div><span>Service level</span><b>{r.baselineService.toFixed(1)}% → {r.service.toFixed(1)}%</b></div><div><span>Weeks with shortfall</span><b>{r.baselineStockouts} → {r.proposedStockouts}</b></div><div><span>Additional mitigation</span><b>{Model.currency(r.cost)}</b></div><div><span>Sales exposure</span><b>{Model.currency(r.revenueAtRisk)}</b></div></div><div className="inspector-section"><div className="inspector-section-title">Explanation of model</div><p className="muted-copy">Fixed weekly demand patterns, short replenishment lag and simple stock arithmetic. No ML, live customer data or validated financial forecasting.</p></div><div className="state-note"><UI.Icon name="info" size={18}/><span>Saving a draft stores settings in this browser only. THREAD cannot publish anything to real systems.</span></div><div className="inspector-bottom"><button className="outline wide" onClick={()=>this.go('portfolio')}><UI.Icon name="chart" size={16}/> Check portfolio exposure</button><button className="primary wide" onClick={this.save}><UI.Icon name="bookmark" size={16}/> Save scenario draft</button></div></aside></div>
    <footer className="status-footer"><span><i className="system-indicator"/> LOCAL MODEL · NOT LIVE</span><span>Plan changes require a simulation run</span><span>Applying to operations is not supported</span></footer>
  </div>}
  renderPortfolio(){const s=this.state,summary=Model.portfolioRisk(s.simulatedSettings),flagged=Model.products.filter((p:any)=>p.risk==='At risk'),selectedSet=new Set(s.selectedIds);
    const affected=flagged.map((p:any)=>({p,r:Model.simulate(p,s.simulatedSettings)})).sort((a:any,b:any)=>b.r.revenueAtRisk-a.r.revenueAtRisk);
    const visible=affected.slice(0,24);
    return <div className="view-frame">
      {this.renderCrumb(['Portfolio','Exposure overview'])}
      <div className="page-overview"><div><div className="eyebrow">04 / PORTFOLIO INTELLIGENCE</div><h1>One change. <em>Many dependencies.</em></h1><p>Understand where shared resources create exposure beyond the currently selected product.</p></div><button className="outline" onClick={()=>this.go('scenario')}><UI.Icon name="sliders" size={17}/> Back to scenario</button></div>
      <div className="portfolio-stats"><UI.Metric label="Total catalog" value={Model.number(Model.products.length)} note="Synthetic product records"/><UI.Metric label="Flagged for review" value={Model.number(flagged.length)} note="Predefined catalog status"/><UI.Metric label="Projected shortage SKUs" value={Model.number(summary.atRisk)} note="Within flagged sample only" accent="warn"/><UI.Metric label="Modeled unmet demand" value={Model.number(summary.shortfall)+' u'} note="Flagged sample / 8-week horizon" accent="warn"/></div>
      <div className="portfolio-body"><section className="portfolio-table-section"><div className="panel-titlebar"><div><div className="overline">EXCEPTION EXPLORER</div><h2>Products requiring attention</h2></div><span className="count-square">{flagged.length}</span></div><div className="portfolio-toolbar"><span>{selectedSet.size} manually selected · {summary.atRisk} projected shortages</span><button className="text-link" onClick={()=>this.setState({selectedIds:visible.map((x:any)=>x.p.id)})}>Select visible</button><button className="text-link" onClick={()=>this.setState({selectedIds:[]})}>Clear</button></div>
        <div className="portfolio-table-wrap"><table className="portfolio-table"><thead><tr><th><span className="sr-only">Select</span></th><th>PRODUCT / SKU</th><th>WAREHOUSE STOCK</th><th>DEMAND / WK</th><th>UNMET DEMAND</th><th>EXPOSURE</th><th>VIEW</th></tr></thead><tbody>{visible.map(({p,r}:any)=><tr key={p.id} className={s.productId===p.id?'highlighted':''}><td><input type="checkbox" checked={selectedSet.has(p.id)} aria-label={'Select '+p.name} onChange={()=>this.toggleSelect(p.id)}/></td><td><div className="table-name">{p.name}</div><span className="product-code">{p.id}</span></td><td>{Model.number(p.stock)} u</td><td>{Model.number(p.baseDemand)}</td><td className={r.impactUnits?'red-figure':''}>{Model.number(r.impactUnits)} u</td><td className={r.revenueAtRisk?'red-figure':''}>{Model.currency(r.revenueAtRisk)}</td><td><button className="row-link" onClick={()=>{this.product(p.id);this.go('lineage')}}>Inspect <UI.Icon name="chevron" size={12}/></button></td></tr>)}</tbody></table></div><div className="table-foot">Showing 24 of {flagged.length} flagged SKUs. Counts outside the flagged sample are not modeled here.</div></section>
        <aside className="portfolio-side"><div className="inspector-head"><div className="overline">SHARED NETWORK</div><h2>Where impact travels</h2><p className="inspector-sub">Illustrative sample, not a full-network forecast.</p></div><div className="dependency-illustration"><svg viewBox="0 0 310 170" width="100%"><path d="M42 85 C105 85 120 40 164 40 S230 85 276 85" fill="none" stroke="#7269d6" strokeWidth="3"/><path d="M164 40 C170 108 203 132 260 140" fill="none" stroke="#a5a2e9" strokeWidth="2" strokeDasharray="5 6"/>{[[42,85],[164,40],[276,85],[260,140]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="15" fill="#fff" stroke="#908bda" strokeWidth="2"/><circle cx={x} cy={y} r="4.5" fill="#655bd7"/></g>)}<text x="42" y="118" fill="#67718a" fontSize="10" textAnchor="middle">Stores</text><text x="164" y="16" fill="#67718a" fontSize="10" textAnchor="middle">DC East</text><text x="276" y="118" fill="#67718a" fontSize="10" textAnchor="middle">VN-01</text></svg></div><div className="inspector-section"><div className="inspector-section-title">What the selected scope means</div><p className="muted-copy">Portfolio metrics above are calculated for the 43 catalog-flagged SKUs. Selecting rows is a UI grouping action and does not change the model until a separate scenario is run.</p></div><div className="portfolio-side-bottom"><button className="primary wide" onClick={()=>this.go('scenario')}><UI.Icon name="spark" size={16}/> Refine the scenario</button><button className="outline wide" onClick={()=>{const csv='sku,product,stock,weekly_demand,unmet_units,revenue_exposure\n'+affected.map(({p,r}:any)=>`${p.id},"${p.name}",${p.stock},${p.baseDemand},${r.impactUnits},${r.revenueAtRisk}`).join('\n');const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='thread-portfolio-synthetic.csv';a.click();}}><UI.Icon name="download" size={16}/> Export synthetic CSV</button></div></aside>
      </div><footer className="status-footer"><span><i className="system-indicator"/> PORTFOLIO DEMO · SYNTHETIC</span><span>SKU universe: 1,284 · flagged sample: {flagged.length}</span></footer>
    </div>}
  renderHelp(){if(!this.state.helpOpen)return null;return <div className="modal-mask" onClick={()=>this.setState({helpOpen:false})}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={(e:any)=>e.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={()=>this.setState({helpOpen:false})}><UI.Icon name="close"/></button><div className="eyebrow">ABOUT THIS PROTOTYPE</div><h2 id="about-title">THREAD / From shelf to source</h2><p>Independent, interactive design-engineering demonstration of a connected planning experience. Built with React, TypeScript and a deterministic synthetic model for portfolio evaluation.</p><p>Try selecting a product, inspecting a supply node, changing the promotion assumption, running a simulation, scrubbing the week timeline, or checking Portfolio Exposure.</p><div className="modal-highlight">All companies, products, location details and model outcomes are illustrative. No live data feeds, manufacturing systems or operational actions are connected.</div><button className="primary wide" onClick={()=>this.setState({helpOpen:false})}>Continue exploring</button></div></div>}
  render(){return <div className="app-shell">{this.renderHeader()}{this.renderNav()}<main className="app-main">{this.state.page==='explore'?this.renderProducts():this.state.page==='lineage'?this.renderLineage():this.state.page==='scenario'?this.renderScenario():this.renderPortfolio()}</main>{this.state.notice&&<div className="toast"><UI.Icon name="info" size={16}/>{this.state.notice}</div>}{this.renderHelp()}</div>}
}
(globalThis as any).ThreadApp=ThreadApp;
