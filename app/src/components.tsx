/** Reusable visual primitives. Keep props and states explicit for future QML equivalents. */
const TReact:any=(globalThis as any).React;
namespace ThreadUI{
  export function Icon({name,size=18}:{name:string;size?:number}){
    const shapes:any={
      layers:<g><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></g>,
      grid:<g><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></g>,
      package:<g><path d="m12 2 9 5-9 5-9-5 9-5zM3 7v10l9 5 9-5V7M12 12v10"/></g>,
      search:<g><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></g>,
      plus:<g><path d="M12 5v14M5 12h14"/></g>,
      chevron:<path d="m9 6 6 6-6 6"/>,down:<path d="m6 9 6 6 6-6"/>,
      arrows:<g><path d="M5 6h13l-4-4m4 4-4 4M19 18H6l4 4m-4-4 4-4"/></g>,
      box:<g><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M9 5V2h6v3"/></g>,
      factory:<g><path d="M3 21V10l6 4v-4l6 4V5h5v16H3zM15 8h5M7 18h2m3 0h2m3 0h2"/></g>,
      store:<g><path d="M3 10h18l-2-6H5l-2 6zM5 10v11h14V10M9 21v-7h6v7"/></g>,
      warehouse:<g><path d="m2 10 10-7 10 7v11H2V10zM7 21v-8h10v8M7 16h10"/></g>,
      clock:<g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></g>,
      edit:<g><path d="M4 20h16M5 16l11-11 3 3L8 19H5v-3z"/></g>,
      alert:<g><path d="m12 3 10 18H2L12 3zM12 9v5M12 18h.01"/></g>,
      check:<path d="m4 12 5 5L20 6"/>,
      spark:<g><path d="M12 2v5m0 10v5M2 12h5m10 0h5M5 5l4 4m6 6 4 4m0-14-4 4m-6 6-4 4"/></g>,
      target:<g><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></g>,
      chart:<g><path d="M3 20h18M4 16l5-6 4 3 6-8"/></g>,
      settings:<g><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></g>,
      bookmark:<g><path d="M6 3h12v18l-6-4-6 4V3z"/></g>,
      globe:<g><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></g>,
      menu:<g><path d="M4 6h16M4 12h16M4 18h16"/></g>,
      close:<path d="M5 5l14 14M19 5 5 19"/>,
      info:<g><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></g>,
      download:<g><path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/></g>,
      play:<path d="m8 5 11 7-11 7V5z"/>,
      sliders:<g><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/></g>
    };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]||shapes.package}</svg>;
  }
  export function StatusChip({status,small=false}:{status:string;small?:boolean}){let key=status.toLowerCase().replace(/ /g,'-');return <span className={'status-chip '+key+(small?' small':'')}><i className="status-dot"/>{status}</span>}
  export function Metric({label,value,note,accent}:{label:string;value:string;note?:string;accent?:string}){return <div className="metric"><div className="metric-label">{label}</div><div className={'metric-value '+(accent||'')}>{value}</div>{note&&<div className="metric-note">{note}</div>}</div>}
  export function Sparkline({values,color='#5c55d8',height=42}:{values:number[];color?:string;height?:number}){const hi=Math.max(...values,1),lo=Math.min(...values,0),d=Math.max(1,hi-lo);const line=values.map((v,i)=>`${(i*100)/(values.length-1)},${36-32*(v-lo)/d}`).join(' ');return <svg className="sparkline" viewBox="0 0 100 40" height={height} preserveAspectRatio="none"><polyline points={line} fill="none" stroke={color} strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/></svg>}
  export function AvatarProduct({kind='knit',large=false}:{kind?:string;large?:boolean}){
    return <div className={'product-avatar '+(large?'large':'')+' '+kind}>
      {kind==='knit'||kind==='coat'||kind==='shirt'?<svg viewBox="0 0 84 90" aria-hidden="true"><path d="M29 13 17 20 5 36l14 10 7-9v40h33V37l8 9 13-10-15-16-12-7-7 8H36z" fill={kind==='coat'?'#9bacb1':kind==='shirt'?'#eae3d3':'#c8b4a4'} stroke="#817a77" strokeWidth="1.1"/><path d="M29 13c4 11 20 11 24 0M26 42h33M32 17l5 5M51 18l-4 5" fill="none" stroke="#796e67" strokeOpacity=".55" strokeWidth="1.2"/></svg>:kind==='shoe'?<svg viewBox="0 0 90 78"><path d="M10 43c11 0 20-18 30-18 6 12 24 20 40 23 9 2 8 14-5 16H16C4 64 1 50 10 43z" fill="#bdc9d1" stroke="#6e7980" strokeWidth="2"/><path d="M28 38h18M23 43h23M16 61h62" stroke="#fff" strokeWidth="2"/></svg>:<Icon name="package" size={large?48:28}/>}
    </div>
  }
  export function SectionTitle({kicker,title,right}:{kicker?:string;title:string;right?:any}){return <div className="section-head"><div><div className="overline">{kicker}</div><h2>{title}</h2></div>{right}</div>}
}
(globalThis as any).ThreadUI=ThreadUI;
