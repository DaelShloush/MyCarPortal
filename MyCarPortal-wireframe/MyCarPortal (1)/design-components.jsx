
// MyCarPortal — Hi-Fi Design Components
// Based on DESIGN.md — Heebo + RTL + color system

// ══════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════
const T = {
  // Primary palette
  p900: '#0f172a', p800: '#1e293b', p700: '#2C3E50',
  p600: '#334155', p500: '#2563eb', p400: '#3b82f6',
  p100: '#dbeafe', p50:  '#eff6ff',
  // Neutrals
  g900: '#111827', g700: '#374151', g500: '#6b7280',
  g400: '#9ca3af', g200: '#e5e7eb', g100: '#f3f4f6', g50: '#f9fafb',
  // Risk
  rGB: '#dcfce7', rGBd: '#22c55e', rGT: '#15803d',
  rWB: '#fef9c3', rWBd: '#eab308', rWT: '#854d0e',
  rHB: '#fee2e2', rHBd: '#ef4444', rHT: '#b91c1c',
  // Semantic
  success: '#22c55e', warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6',
};
const F = "'Heebo', sans-serif";
const riskCfg = (score) => {
  if (score <= 33) return {bg:T.rGB, bd:T.rGBd, tx:T.rGT, label:'נראה טוב'};
  if (score <= 66) return {bg:T.rWB, bd:T.rWBd, tx:T.rWT, label:'יש מה לבדוק'};
  return          {bg:T.rHB, bd:T.rHBd, tx:T.rHT, label:'סיכון גבוה'};
};

// ══════════════════════════════════════════
// ATOMS
// ══════════════════════════════════════════

// Image placeholder
const ImgPH = ({h=180, label='תמונת רכב', style={}}) => (
  <div style={{height:h, background:T.g100, borderRadius:12,
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    gap:6, color:T.g400, fontFamily:F, ...style}}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    </svg>
    <span style={{fontSize:12}}>{label}</span>
  </div>
);

// Logo placeholder
const LogoPH = ({size=36}) => (
  <div style={{width:size, height:size, borderRadius:8, background:'#fff',
    border:`1px solid ${T.g200}`, boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none" stroke={T.p700} strokeWidth="2">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    </svg>
  </div>
);

// Risk Badge
const RiskBadge = ({score=28, size='md'}) => {
  const cfg = riskCfg(score);
  if (size==='sm') return (
    <span style={{background:cfg.bg, color:cfg.tx, border:`1px solid ${cfg.bd}`,
      borderRadius:20, padding:'2px 10px', fontFamily:F, fontSize:12, fontWeight:700,
      whiteSpace:'nowrap'}}>
      {score}/100
    </span>
  );
  return (
    <div style={{display:'inline-flex', alignItems:'center', gap:10,
      background:cfg.bg, border:`2px solid ${cfg.bd}`,
      borderRadius:40, padding:'8px 16px 8px 8px', fontFamily:F, flexShrink:0}}>
      <div style={{width:42, height:42, borderRadius:'50%', background:cfg.bd, color:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontWeight:900, fontSize:18, flexShrink:0, lineHeight:1}}>{score}</div>
      <div>
        <div style={{fontWeight:700, fontSize:14, color:cfg.tx, lineHeight:1.2}}>{cfg.label}</div>
        <div style={{fontSize:12, color:cfg.tx, opacity:.7, marginTop:2}}>{score}/100</div>
      </div>
    </div>
  );
};

// Button
const Btn = ({label='', full, sm, secondary, ghost, danger, icon, style={}, onClick}) => {
  let bg = T.p500, color = '#fff', border = 'none';
  if (secondary) { bg='#fff'; color=T.g700; border=`1.5px solid ${T.g200}`; }
  if (ghost)     { bg='transparent'; color=T.p500; border=`1.5px solid ${T.p500}`; }
  if (danger)    { bg=T.danger; color='#fff'; border='none'; }
  return (
    <div onClick={onClick} style={{
      padding: sm ? '6px 14px' : '10px 20px',
      background: bg, color, border, borderRadius: 10,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      fontFamily: F, fontSize: sm ? 13 : 15, fontWeight: 700,
      cursor: 'pointer', userSelect: 'none', flexShrink: 0,
      width: full ? '100%' : 'auto', boxSizing: 'border-box',
      boxShadow: (!secondary && !ghost) ? '0 1px 3px rgba(37,99,235,0.3)' : 'none',
      ...style
    }}>
      {icon && <span style={{fontSize:16}}>{icon}</span>}
      {label}
    </div>
  );
};

// Icon button
const IconBtn = ({icon, label='', style={}}) => (
  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3,
    padding:'6px 10px', borderRadius:10, background:'#fff', border:`1px solid ${T.g200}`,
    fontFamily:F, fontSize:11, color:T.g700, cursor:'pointer', flexShrink:0, ...style}}>
    <span style={{fontSize:18}}>{icon}</span>
    {label && <span>{label}</span>}
  </div>
);

// Section header (dark)
const SHdr = ({title}) => (
  <div style={{background:T.p700, color:'#fff', padding:'9px 14px',
    borderRadius:'10px 10px 0 0', fontFamily:F, fontSize:13, fontWeight:700,
    letterSpacing:.3}}>
    {title}
  </div>
);

// Section body
const SBody = ({children, style={}}) => (
  <div style={{border:`1px solid ${T.g200}`, borderTop:'none', borderRadius:'0 0 10px 10px',
    padding:'12px 14px', background:'#fff', marginBottom:14, ...style}}>
    {children}
  </div>
);

// Data row
const DRow = ({label, val, warn, ok}) => {
  const valColor = warn ? T.warning : ok ? T.success : T.g700;
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'6px 0', borderBottom:`1px solid ${T.g100}`, fontFamily:F}}>
      <span style={{color:T.g500, fontSize:13}}>{label}</span>
      <span style={{fontWeight:600, fontSize:13, color:valColor}}>{val}</span>
    </div>
  );
};

// Card
const Card = ({children, style={}, highlighted=false}) => (
  <div style={{background:'#fff', border:`1.5px solid ${highlighted?T.p500:T.g200}`,
    borderRadius:14, padding:16, marginBottom:12,
    boxShadow:'0 1px 6px rgba(0,0,0,0.05)', ...style}}>
    {children}
  </div>
);

// Input field
const Field = ({ph='', icon, value='', large=false, style={}}) => (
  <div style={{background:'#fff', border:`1.5px solid ${T.g200}`, borderRadius:12,
    padding: large ? '14px 18px' : '10px 14px',
    display:'flex', alignItems:'center', gap:10,
    fontFamily:F, fontSize: large ? 16 : 14, color:T.g400,
    boxShadow:'0 1px 3px rgba(0,0,0,0.04)', ...style}}>
    {icon && <span style={{fontSize: large ? 20 : 17}}>{icon}</span>}
    <span style={{flex:1}}>{value || ph}</span>
  </div>
);

// Mobile Navbar
const NavBar = ({title='', hasBack=false, right=null}) => (
  <div style={{background:'#fff', borderBottom:`1px solid ${T.g200}`, padding:'0 16px',
    height:56, display:'flex', alignItems:'center', justifyContent:'space-between',
    flexShrink:0, position:'sticky', top:0, zIndex:50,
    boxShadow:'0 1px 6px rgba(0,0,0,0.06)'}}>
    <div style={{display:'flex', alignItems:'center', gap:10}}>
      {hasBack && (
        <div style={{width:34, height:34, borderRadius:8, background:T.g100,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.g700} strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      )}
      <div style={{fontFamily:F, fontSize:18, fontWeight:900, color:T.p700, display:'flex', alignItems:'center', gap:6}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.p500} strokeWidth="2">
          <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
          <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
        </svg>
        MyCarPortal
      </div>
    </div>
    {title && <div style={{fontFamily:F, fontSize:15, fontWeight:700, color:T.g900}}>{title}</div>}
    {right || (
      <div style={{width:34, height:34, borderRadius:'50%', background:T.g100,
        border:`1px solid ${T.g200}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.g500} strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    )}
  </div>
);

// Bottom Navigation
const BotNav = ({active='search'}) => {
  const tabs = [
    {id:'search', label:'חיפוש',
      icon:<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>},
    {id:'cars',   label:'הרכבים שלי',
      icon:<><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>},
    {id:'fav',    label:'מועדפים',
      icon:<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>},
    {id:'hist',   label:'היסטוריה',
      icon:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>},
    {id:'set',    label:'הגדרות',
      icon:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>},
  ];
  return (
    <div style={{background:'#fff', borderTop:`1px solid ${T.g200}`, display:'flex',
      justifyContent:'space-around', padding:'6px 0 10px', flexShrink:0,
      boxShadow:'0 -1px 8px rgba(0,0,0,0.06)'}}>
      {tabs.map(({id,label,icon})=>{
        const isActive = active===id;
        return (
          <div key={id} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2,
            color:isActive?T.p500:T.g400, fontFamily:F, fontSize:10, fontWeight:isActive?700:400,
            minWidth:50, cursor:'pointer'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive?T.p500:'none'}
              stroke={isActive?T.p500:T.g400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {icon}
            </svg>
            <span>{label}</span>
            {isActive && <div style={{width:4, height:4, borderRadius:'50%', background:T.p500}} />}
          </div>
        );
      })}
    </div>
  );
};

// Alert Banner
const AlertBanner = ({text, sub='', type='warn'}) => {
  const cfg = {
    warn:  {bg:'#fef3c7', bd:'#f59e0b', tx:'#92400e', ic:'⚠️'},
    danger:{bg:'#fee2e2', bd:'#ef4444', tx:'#991b1b', ic:'🔴'},
    info:  {bg:'#eff6ff', bd:'#3b82f6', tx:'#1e40af', ic:'ℹ️'},
  }[type];
  return (
    <div style={{background:cfg.bg, border:`1px solid ${cfg.bd}`, borderRadius:10, margin:'12px 16px 0',
      padding:'10px 14px', display:'flex', alignItems:'flex-start', gap:10, fontFamily:F}}>
      <span style={{fontSize:18, flexShrink:0}}>{cfg.ic}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:14, fontWeight:700, color:cfg.tx}}>{text}</div>
        {sub && <div style={{fontSize:12, color:cfg.tx, opacity:.8, marginTop:2}}>{sub}</div>}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.tx} strokeWidth="2" style={{flexShrink:0, marginTop:2, cursor:'pointer'}}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  );
};

// Progress bar with color
const ProgressBar = ({pct=0, days=0}) => {
  const color = days > 60 ? T.success : days > 30 ? T.warning : T.danger;
  return (
    <div style={{background:T.g200, borderRadius:4, height:6, overflow:'hidden', flex:1}}>
      <div style={{width:`${Math.min(100,pct)}%`, height:'100%', background:color,
        borderRadius:4, transition:'width .3s'}} />
    </div>
  );
};

// Screen container
const Screen = ({children, w=390, style={}}) => (
  <div style={{width:w, background:T.g50, borderRadius:20, overflow:'hidden',
    boxShadow:'0 8px 32px rgba(0,0,0,0.15)', display:'flex', flexDirection:'column', ...style}}>
    {children}
  </div>
);

const Scroll = ({children, style={}}) => (
  <div style={{flex:1, overflowY:'auto', ...style}}>{children}</div>
);

// Separator
const Sep = ({text='או'}) => (
  <div style={{display:'flex', alignItems:'center', gap:8, margin:'10px 0'}}>
    <div style={{flex:1, height:1, background:T.g200}}/><span style={{fontFamily:F, fontSize:13, color:T.g400}}>{text}</span>
    <div style={{flex:1, height:1, background:T.g200}}/>
  </div>
);

// Tag / badge
const Tag = ({label, color=T.p100, textColor=T.p500}) => (
  <span style={{background:color, color:textColor, borderRadius:20, padding:'3px 10px',
    fontFamily:F, fontSize:12, fontWeight:700, whiteSpace:'nowrap'}}>{label}</span>
);

Object.assign(window, {
  T, F, riskCfg,
  ImgPH, LogoPH, RiskBadge, Btn, IconBtn,
  SHdr, SBody, DRow, Card, Field,
  NavBar, BotNav, AlertBanner, ProgressBar,
  Screen, Scroll, Sep, Tag,
});
