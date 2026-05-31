
// MyCarPortal Wireframe Primitives
// Shared design tokens + atomic components

const BL = '#1f2937', GN = '#374151', YL = '#6b7280', RD = '#1f2937';
const DK = '#111827', MD = '#9ca3af', LT = '#f9fafb', BD = '#d1d5db';
const F  = "'Balsamiq Sans', cursive";

// Placeholder line (text mockup)
const Ln = ({w='100%', h=10, c=BD, mb=5}) =>
  <div style={{width:w, height:h, background:c, borderRadius:2, marginBottom:mb}} />;

// Image / media placeholder
const Img = ({h=120, label='תמונה', style={}}) => (
  <div style={{height:h, border:'1.5px dashed #bbb', background:'#f9fafb', borderRadius:4,
    display:'flex', alignItems:'center', justifyContent:'center',
    color:'#bbb', fontFamily:F, fontSize:12, ...style}}>
    {label}
  </div>
);

// Input field
const Field = ({ph='', icon='', style={}}) => (
  <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:8,
    padding:'10px 14px', display:'flex', alignItems:'center', gap:8,
    fontFamily:F, fontSize:15, color:'#aaa', ...style}}>
    {icon && <span>{icon}</span>}<span>{ph}</span>
  </div>
);

// Button
const Btn = ({label='כפתור', full, sm, secondary, ghost, style={}}) => {
  const bg = ghost ? 'transparent' : secondary ? '#fff' : BL;
  const col = ghost ? MD : secondary ? DK : '#fff';
  const border = secondary || ghost ? `1.5px solid ${BD}` : 'none';
  return (
    <div style={{padding:sm?'7px 12px':'11px 18px', background:bg, color:col, border,
      borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:F, fontSize:sm?13:15, fontWeight:600, width:full?'100%':'auto',
      cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, ...style}}>
      {label}
    </div>
  );
};

// Card
const Card = ({children, style={}}) => (
  <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:12, padding:14, marginBottom:10, ...style}}>
    {children}
  </div>
);

// Section header
const SHdr = ({title, style={}}) => (
  <div style={{fontFamily:F, fontSize:16, fontWeight:700, color:DK, marginBottom:10,
    borderBottom:`2px solid ${BL}22`, paddingBottom:5, ...style}}>{title}</div>
);

// Data row
const Row = ({label, val}) => (
  <div style={{display:'flex', justifyContent:'space-between', padding:'5px 0',
    borderBottom:`1px solid #f3f4f6`, fontFamily:F}}>
    <span style={{color:MD, fontSize:13}}>{label}</span>
    <span style={{fontWeight:600, fontSize:14, color:DK}}>{val}</span>
  </div>
);

// Risk badge
const RiskBadge = ({score=28, level='good'}) => {
  const labels = {good:'נראה טוב', warn:'יש מה לבדוק', bad:'סיכון גבוה'};
  return (
    <div style={{display:'inline-flex', alignItems:'center', gap:6,
      background:'#fff', border:`1.5px solid ${DK}`, borderRadius:50, padding:'4px 12px 4px 6px', fontFamily:F, flexShrink:0}}>
      <div style={{width:30, height:30, borderRadius:'50%', background:DK, color:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14}}>
        {score}
      </div>
      <span style={{color:DK, fontWeight:700, fontSize:13}}>{labels[level]}</span>
    </div>
  );
};

// Mobile navbar
const NavBar = ({title='', actions=[], logoOnly=false}) => (
  <div style={{background:'#fff', borderBottom:`1px solid ${BD}`, padding:'10px 16px',
    display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:F, flexShrink:0}}>
    <div style={{fontSize:16, fontWeight:700, color:DK}}>MyCarPortal</div>
    {title && <div style={{fontSize:14, fontWeight:600, color:DK}}>{title}</div>}
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      {actions.map((a,i) => <span key={i} style={{fontSize:14, cursor:'pointer', color:MD}}>{a}</span>)}
      <div style={{width:28, height:28, borderRadius:'50%', border:`1.5px solid ${BD}`,
        background:LT, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:MD}}>AA</div>
    </div>
  </div>
);

// Bottom navigation
const BotNav = ({active='search'}) => {
  const tabs = [
    {id:'search', label:'חיפוש'},
    {id:'cars',   label:'הרכבים שלי'},
    {id:'fav',    label:'מועדפים'},
    {id:'hist',   label:'היסטוריה'},
    {id:'set',    label:'הגדרות'},
  ];
  return (
    <div style={{background:'#fff', borderTop:`1px solid ${BD}`, display:'flex',
      justifyContent:'space-around', padding:'8px 0 10px', flexShrink:0}}>
      {tabs.map(({id,label}) => (
        <div key={id} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2,
          fontFamily:F, fontSize:10}}>
          <div style={{width:24, height:24, borderRadius:6, border:`1.5px solid ${active===id?DK:BD}`,
            background:active===id?DK:'transparent', marginBottom:1}} />
          <span style={{color:active===id?DK:MD}}>{label}</span>
        </div>
      ))}
    </div>
  );
};

// Alert banner
const Alert = ({text, type='warn'}) => (
  <div style={{background:'#f3f4f6', borderRight:`3px solid ${DK}`, padding:'9px 14px',
    fontFamily:F, fontSize:14, color:DK, flexShrink:0}}>
    [ ! ] {text}
  </div>
);

// Screen wrapper
const Screen = ({children, w=390, style={}}) => (
  <div style={{width:w, background:'#fff', borderRadius:14, overflow:'hidden',
    boxShadow:'0 4px 24px rgba(0,0,0,0.14)', border:`1px solid ${BD}`,
    display:'flex', flexDirection:'column', ...style}}>
    {children}
  </div>
);

// Scrollable content
const Scroll = ({children, style={}}) => (
  <div style={{flex:1, overflow:'auto', ...style}}>{children}</div>
);

// Wireframe annotation
const Note = ({children}) => (
  <div style={{fontFamily:F, fontSize:12, color:'#d97706', borderRight:'2px solid #fbbf24',
    background:'#fffbeb', padding:'3px 8px', marginTop:4, marginBottom:8, fontStyle:'italic'}}>
    {children}
  </div>
);

// Separator line with text
const Sep = ({text='או'}) => (
  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:12}}>
    <div style={{flex:1, height:1, background:BD}} />
    <span style={{fontFamily:F, fontSize:13, color:MD, whiteSpace:'nowrap'}}>{text}</span>
    <div style={{flex:1, height:1, background:BD}} />
  </div>
);

// Export all to window for cross-file access
Object.assign(window, {
  BL, GN, YL, RD, DK, MD, LT, BD, F,
  Ln, Img, Field, Btn, Card, SHdr, Row, RiskBadge,
  NavBar, BotNav, Alert, Screen, Scroll, Note, Sep
});
