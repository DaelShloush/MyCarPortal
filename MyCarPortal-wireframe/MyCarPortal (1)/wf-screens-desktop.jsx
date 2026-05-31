
// MyCarPortal — Desktop Wireframe Screens (1280px)
// Layout: Top Navbar + Right Sidebar (RTL) + Main Content

// ── Shared Desktop Shell ──
const DSidebar = ({active='search'}) => {
  const items = [{ic:'',l:'חיפוש',id:'search'},{ic:'',l:'הרכבים שלי',id:'cars'},
    {ic:'⭐',l:'מועדפים',id:'fav'},{ic:'',l:'היסטוריה',id:'hist'},{ic:'',l:'הגדרות',id:'set'}];
  return (
    <div style={{width:210, borderLeft:`1px solid ${BD}`, padding:'16px 10px', flexShrink:0, background:'#fff'}}>
      {items.map(({ic,l,id})=>(
        <div key={id} style={{display:'flex', alignItems:'center', gap:8, padding:'9px 10px', borderRadius:8,
          fontFamily:F, fontSize:15, background:active===id?LT:'transparent',
          fontWeight:active===id?700:400, color:active===id?DK:MD, marginBottom:3}}>
          <span style={{fontSize:17}}>{ic}</span><span>{l}</span>
        </div>
      ))}
      <div style={{borderTop:`1px solid ${BD}`, marginTop:14, paddingTop:14}}>
        <div style={{display:'flex', alignItems:'center', gap:8, padding:'8px 10px', fontFamily:F, fontSize:14, color:MD}}>
          <span style={{width:28, height:28, borderRadius:'50%', background:LT, border:`1px solid ${BD}`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:13}}></span>
          <span>דנה כהן</span>
        </div>
      </div>
    </div>
  );
};

const DNavBar = ({searchVal=''}) => (
  <div style={{background:'#fff', borderBottom:`1px solid ${BD}`, padding:'11px 28px',
    display:'flex', alignItems:'center', gap:16, flexShrink:0}}>
    <div style={{fontSize:20, fontWeight:700, color:DK, fontFamily:F, flexShrink:0}}>MyCarPortal</div>
    <div style={{flex:1, background:LT, border:`1px solid ${BD}`, borderRadius:8, padding:'8px 14px',
      display:'flex', alignItems:'center', gap:8, fontFamily:F, fontSize:14, color:MD, maxWidth:420}}>
      <span></span><span>{searchVal || 'חיפוש לפי מספר רישוי...'}</span>
      {searchVal && <span style={{fontSize:17, marginRight:'auto'}}></span>}
    </div>
    <div style={{display:'flex', gap:10, marginRight:'auto'}}>
      <Btn label="הירשם" sm />
      <Btn label="התחבר" sm secondary />
    </div>
  </div>
);

const DShell = ({children, active='search', searchVal='', noSidebar=false}) => (
  <div style={{width:1280, background:'#f9fafb', fontFamily:F, display:'flex', flexDirection:'column', minHeight:720}}>
    <DNavBar searchVal={searchVal} />
    <div style={{flex:1, display:'flex', flexDirection:'row-reverse'}}>
      {!noSidebar && <DSidebar active={active} />}
      <div style={{flex:1, overflow:'auto'}}>{children}</div>
    </div>
  </div>
);

// ── Desktop: Landing Page ──
const DesktopLanding = () => (
  <div style={{width:1280, background:'#fff', fontFamily:F, display:'flex', flexDirection:'column'}}>
    <div style={{background:'#fff', borderBottom:`1px solid ${BD}`, padding:'12px 40px',
      display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div style={{fontSize:20, fontWeight:700, color:DK}}>MyCarPortal</div>
      <div style={{flex:1, maxWidth:380, margin:'0 24px', background:LT, border:`1px solid ${BD}`,
        borderRadius:8, padding:'8px 14px', display:'flex', gap:8, alignItems:'center', fontFamily:F, fontSize:14, color:MD}}>
        <span></span><span>מספר רישוי...</span>
      </div>
      <div style={{display:'flex', gap:10}}>
        <Btn label="התחבר" sm secondary />
        <Btn label="הירשם חינם" sm />
      </div>
    </div>
    {/* Hero */}
    <div style={{background:'#f3f4f6', padding:'52px 80px', display:'flex', gap:48, alignItems:'center'}}>
      <div style={{flex:1}}>
        <div style={{fontSize:36, fontWeight:700, color:DK, lineHeight:1.2, marginBottom:12}}>
          בדוק כל רכב בישראל<br/>תוך שניות
        </div>
        <div style={{fontSize:15, color:MD, marginBottom:24}}>מידע רשמי ממשרד התחבורה, דירוג סיכון, חינם לחלוטין</div>
        <div style={{background:'#fff', border:`1.5px solid ${DK}`, borderRadius:12, padding:'12px 16px',
          display:'flex', gap:12, alignItems:'center', maxWidth:440, marginBottom:14}}>
          <span style={{fontSize:22}}></span>
          <span style={{fontSize:16, color:MD, flex:1}}>הקלד מספר רישוי (7–8 ספרות)...</span>
          <span style={{fontSize:18}}></span>
          <Btn label="חפש" style={{padding:'9px 20px', fontSize:14}} />
        </div>
        <div style={{display:'flex', gap:10}}>
          {[' חינם ללא הרשמה',' מידע רשמי',' תוך שניות'].map(t=>(
            <span key={t} style={{background:'#fff', border:`1px solid ${BD}`, borderRadius:20, padding:'4px 12px', fontSize:13, color:DK}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{flex:1}}>
        <Img h={240} label="Screenshot — עמוד תוצאות חיפוש" />
      </div>
    </div>
    {/* Feature row */}
    <div style={{display:'flex', borderBottom:`1px solid ${BD}`, background:'#fff'}}>
      {[['','דירוג סיכון','ציון 0–100 מ-8 פרמטרים'],['','היסטוריית בעלויות','Timeline מלא מ-2017'],
        ['','ריקולים פתוחים','מאגר משרד התחבורה'],['','מפרט בטיחות','ADAS + כריות אוויר']].map(([ic,t,d])=>(
        <div key={t} style={{flex:1, padding:'24px 20px', borderLeft:`1px solid ${BD}`, textAlign:'center'}}>
          <div style={{fontSize:28, marginBottom:8}}>{ic}</div>
          <div style={{fontSize:15, fontWeight:700, color:DK, marginBottom:5}}>{t}</div>
          <div style={{fontSize:13, color:MD}}>{d}</div>
        </div>
      ))}
    </div>
    {/* Personal management + Pricing */}
    <div style={{display:'flex', padding:'36px 40px', gap:32, background:'#fff'}}>
      <div style={{flex:1.5, paddingLeft:32}}>
        <div style={{fontSize:24, fontWeight:700, color:DK, marginBottom:10}}>ניהול רכב אישי</div>
        <div style={{fontSize:14, color:MD, marginBottom:14}}>תזכורות, מסמכים, היסטוריית טיפולים, מודעת מכירה אוטומטית</div>
        {[' תזכורות אוטומטיות לטסט וביטוח',' אחסון מסמכים דיגיטלי',' היסטוריית טיפולים',' מודעת מכירה בלחיצה אחת'].map(f=>(
          <div key={f} style={{fontSize:14, color:DK, marginBottom:6}}>{f}</div>
        ))}
        <Btn label="הירשם חינם " style={{marginTop:14}} />
      </div>
      <div style={{flex:1}}>
        <Img h={180} label="Dashboard Screenshot" />
      </div>
      <div style={{flex:1, display:'flex', flexDirection:'column', gap:12}}>
        <Card style={{marginBottom:0}}>
          <div style={{fontSize:15, fontWeight:700, marginBottom:8}}>חינם</div>
          {['חיפוש ללא הגבלה','1 רכב לניהול','5 מועדפים','תזכורות אימייל'].map(f=>(
            <div key={f} style={{fontSize:12, color:MD, marginBottom:4}}> {f}</div>
          ))}
        </Card>
        <Card style={{marginBottom:0, border:`1.5px solid ${DK}`}}>
          <div style={{fontSize:15, fontWeight:700, marginBottom:2}}>פרמיום</div>
          <div style={{fontSize:12, color:MD, marginBottom:8}}>₪9.90 / חודש</div>
          {['3 רכבים','Push notifications','הפקת PDF','ללא פרסומות'].map(f=>(
            <div key={f} style={{fontSize:12, color:DK, marginBottom:4}}> {f}</div>
          ))}
          <Btn label="שדרגו" full style={{marginTop:8, fontSize:13}} />
        </Card>
      </div>
    </div>
  </div>
);

// ── Desktop: Search Results ──
const DesktopSearch = () => (
  <DShell searchVal="1234567" noSidebar>
    <div style={{display:'flex', height:'100%'}}>
      {/* Sticky left panel */}
      <div style={{width:300, borderLeft:`1px solid ${BD}`, padding:18, flexShrink:0, background:'#fff', overflowY:'auto'}}>
        <Img h={140} label="Toyota Corolla 2019 — CGI" style={{marginBottom:14}} />
        <div style={{fontFamily:F, fontSize:18, fontWeight:700, color:DK, marginBottom:3}}>טויוטה COROLLA 2019</div>
        <div style={{fontFamily:F, fontSize:13, color:MD, marginBottom:10}}>יד 3 · לבן שנהב · בנזין</div>
        <RiskBadge score={28} level="good" />
        <div style={{marginTop:12, display:'flex', flexWrap:'wrap', gap:6}}>
          {['⭐ מועדפים',' שתף',' PDF',' הוסף'].map(a=>(
            <Btn key={a} label={a} sm secondary style={{flex:'1 1 auto', fontSize:12}} />
          ))}
        </div>
        {/* Quick nav */}
        <div style={{marginTop:16}}>
          <div style={{fontFamily:F, fontSize:13, fontWeight:700, color:MD, marginBottom:8}}>מעבר מהיר:</div>
          {['פרטים כלליים','מנוע ומפרט','בעלויות','טסט וק"מ','ריקולים','בטיחות','סביבה','ציון סיכון'].map(s=>(
            <div key={s} style={{padding:'5px 8px', borderRadius:6, fontFamily:F, fontSize:13, color:DK,
              borderBottom:`1px solid ${BD}`, cursor:'pointer'}}> {s}</div>
          ))}
        </div>
      </div>
      {/* Main scrollable content */}
      <div style={{flex:1, padding:'20px 32px', overflowY:'auto', background:'#fafafa'}}>
        <Note>Single page עם גלילה — כל הסקשנים:</Note>
        <SHdr title="פרטים כלליים" />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px 32px', marginBottom:16}}>
          {[['יצרן','טויוטה יפן'],['דגם','COROLLA COMFORT'],['שנה','2019'],['דלק','בנזין'],['עלייה לכביש','03/2019'],['תג נכה',' לא רשום']].map(([l,v])=>(
            <Row key={l} label={l} val={v} />
          ))}
        </div>
        <SHdr title="מנוע ומפרט טכני" />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px 32px', marginBottom:16}}>
          {[['נפח מנוע','1,798 סמ"ק'],['כוח','140 כ"ס'],['הנעה','קדמית'],['תיבת הילוכים','אוטומטית'],['דלתות / מושבים','4 / 5'],['סוג מרכב','סדאן']].map(([l,v])=>(
            <Row key={l} label={l} val={v} />
          ))}
        </div>
        <SHdr title="היסטוריית בעלויות" />
        <div style={{display:'flex', gap:10, marginBottom:14}}>
          {[{d:'03/2019',t:'החכר (ליסינג)',ic:''},{d:'12/2021',t:'פרטי',ic:''},{d:'07/2023',t:'פרטי — נוכחי',ic:''}].map(({d,t,ic})=>(
            <div key={d} style={{flex:1, background:'#fff', border:`1px solid ${BD}`, borderRadius:10, padding:12, fontFamily:F, textAlign:'center'}}>
              <div style={{fontSize:22, marginBottom:4}}>{ic}</div>
              <div style={{fontSize:14, fontWeight:700, color:DK}}>{t}</div>
              <div style={{fontSize:12, color:MD}}>{d}</div>
            </div>
          ))}
        </div>
        <SHdr title="טסט וקילומטראז'" />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px 32px', marginBottom:16}}>
          {[['טסט אחרון','15/01/2026'],['תוקף','15/01/2027 '],['ק"מ','87,400'],['ממוצע/שנה','12,486 '],['שינוי מבנה','לא '],['שינוי צבע','לא ']].map(([l,v])=>(
            <Row key={l} label={l} val={v} />
          ))}
        </div>
        <SHdr title="ריקולים" />
        <div style={{background:'#fff', border:`1px solid ${BD}`, borderRadius:8, padding:12,
          fontFamily:F, fontSize:14, color:DK, marginBottom:16}}> אין ריקולים פתוחים</div>
        <SHdr title="בטיחות ו-ADAS" />
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16}}>
          {['ABS ','ESP ','בקרת סטייה ','ניטור מרחק ','מצלמת רוורס ','בלימת חירום ','זיהוי הולכי רגל ','שטח מת ','אורות גבוהים '].map(f=>(
            <div key={f} style={{background:'#fff', border:`1px solid ${BD}`, borderRadius:6, padding:'6px 10px', fontFamily:F, fontSize:13}}>{f}</div>
          ))}
        </div>
        <SHdr title="פירוט דירוג סיכון" />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 32px', marginBottom:20}}>
          {[{l:'בעלויות',s:6,m:20},{l:'תדירות החלפה',s:0,m:10},{l:'גיל רכב',s:5,m:15},
            {l:'סטטוס טסט',s:0,m:15},{l:'קילומטראז\'',s:4,m:15},{l:'שינוי מבנה',s:0,m:10},
            {l:'ריקולים',s:0,m:10},{l:'סוג בעלות',s:3,m:5}].map(({l,s,m})=>(
            <div key={l} style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
              <div style={{width:80, fontFamily:F, fontSize:12, color:MD, flexShrink:0}}>{l}</div>
              <div style={{flex:1, background:BD, borderRadius:4, height:8, overflow:'hidden'}}>
                <div style={{width:`${(s/m)*100}%`, height:'100%', background:DK, borderRadius:4}} />
              </div>
              <div style={{width:28, fontFamily:F, fontSize:12, color:DK, flexShrink:0}}>{s}/{m}</div>
            </div>
          ))}
        </div>
        <Note> מבוסס על נתונים ציבוריים בלבד. מומלץ בחום לבצע בדיקה פיזית.</Note>
      </div>
    </div>
  </DShell>
);

// ── Desktop: Dashboard ──
const DesktopDashboard = () => (
  <DShell active="cars">
    <div style={{padding:'24px 32px'}}>
      <Alert text="טסט של קורולה פג בעוד 28 ימים — לחץ להוסיף לתזכורות" type="warn" />
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20, marginBottom:16}}>
        <div style={{fontFamily:F, fontSize:20, fontWeight:700, color:DK}}>הרכבים שלי</div>
        <Btn label="+ הוסף רכב" sm />
      </div>
      <Note>חינם: 1 רכב · פרמיום: עד 3 רכבים</Note>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28}}>
        {/* Active card */}
        <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:14, overflow:'hidden'}}>
          <Img h={100} label="Toyota Corolla 2019" style={{borderRadius:0, border:'none'}} />
          <div style={{padding:14}}>
            <div style={{fontFamily:F, fontSize:15, fontWeight:700, marginBottom:4}}>הרכב שלי — קורולה</div>
            <div style={{fontFamily:F, fontSize:13, color:MD, marginBottom:8}}>טויוטה COROLLA 2019 · 1234567</div>
            <div style={{display:'flex', gap:6, marginBottom:10, flexWrap:'wrap'}}>
              <div style={{background:'#e5e7eb', borderRadius:6, padding:'4px 8px', fontFamily:F, fontSize:12}}> טסט: 28 יום</div>
              <div style={{background:'#f3f4f6', borderRadius:6, padding:'4px 8px', fontFamily:F, fontSize:12}}> ביטוח: 120 יום</div>
            </div>
            <div style={{display:'flex', gap:6}}>
              <Btn label="פרטים" sm secondary style={{flex:1}} />
              <Btn label="" sm ghost />
            </div>
          </div>
        </div>
        {/* Empty slot 2 */}
        <div style={{background:'#fff', border:`1.5px dashed ${BD}`, borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:200, fontFamily:F, color:MD, gap:8}}>
          <span style={{fontSize:32}}>+</span>
          <span style={{fontSize:14}}>הוסף רכב</span>
          <span style={{fontSize:12}}>פרמיום: עד 3 רכבים</span>
        </div>
        {/* Empty slot 3 */}
        <div style={{background:'#fff', border:`1.5px dashed ${BD}`, borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:200, fontFamily:F, color:MD, gap:8, opacity:0.5}}>
          <span style={{fontSize:32}}>+</span>
          <span style={{fontSize:14}}>הוסף רכב</span>
        </div>
      </div>

      {/* Quick actions + reminders */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
        <div>
          <SHdr title="תזכורות קרובות" />
          {[{ic:'',t:'טסט שנתי — קורולה',d:'28 יום',w:true},{ic:'',t:'ביטוח — קורולה',d:'120 יום',w:false}].map(({ic,t,d,w})=>(
            <Card key={t} style={{padding:'10px 14px', marginBottom:8}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:F}}>
                <span style={{fontSize:14}}>{ic} {t}</span>
                <span style={{fontSize:13, fontWeight:700, color:w?DK:MD}}>{d}</span>
              </div>
            </Card>
          ))}
        </div>
        <div>
          <SHdr title="פעולות מהירות" />
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            {[{ic:'',l:'חיפוש רכב'},{ic:'⭐',l:'מועדפים'},{ic:'',l:'היסטוריה'},{ic:'',l:'השווה רכבים'}].map(({ic,l})=>(
              <Card key={l} style={{marginBottom:0, textAlign:'center', padding:12}}>
                <div style={{fontSize:24}}>{ic}</div>
                <div style={{fontFamily:F, fontSize:13, marginTop:4}}>{l}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  </DShell>
);

// ── Desktop: Vehicle Detail ──
const DesktopVehicleDetail = () => (
  <DShell active="cars">
    <div style={{display:'flex', height:'100%'}}>
      {/* Left panel: vehicle info + tabs */}
      <div style={{width:260, borderLeft:`1px solid ${BD}`, padding:16, flexShrink:0, background:'#fff', display:'flex', flexDirection:'column'}}>
        <Img h={120} label="Toyota Corolla CGI" style={{marginBottom:12}} />
        <div style={{fontFamily:F, fontSize:16, fontWeight:700, marginBottom:3}}>קורולה 2019</div>
        <div style={{fontFamily:F, fontSize:13, color:MD, marginBottom:8}}>טויוטה · 1234567</div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:12}}>
          <div style={{background:'#e5e7eb', borderRadius:6, padding:'4px 8px', fontFamily:F, fontSize:12}}> טסט: 28 יום</div>
          <div style={{background:'#f3f4f6', borderRadius:6, padding:'4px 8px', fontFamily:F, fontSize:12}}> ביטוח: 4 חודשים</div>
        </div>
        <div style={{flex:1}}>
          {[' כללי',' טיפולים',' מסמכים',' תזכורות'].map((tab,i)=>(
            <div key={tab} style={{padding:'10px 12px', borderRadius:8, fontFamily:F, fontSize:14,
              background:i===1?LT:'transparent', fontWeight:i===1?700:400, color:i===1?DK:MD,
              marginBottom:3, cursor:'pointer'}}>{tab}</div>
          ))}
        </div>
        <Btn label=" צור מודעת מכירה" full secondary style={{marginTop:8}} />
      </div>
      {/* Main: active tab content */}
      <div style={{flex:1, padding:'20px 32px', overflowY:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
          <div style={{fontFamily:F, fontSize:18, fontWeight:700}}>היסטוריית טיפולים</div>
          <Btn label="+ הוסף טיפול" sm />
        </div>
        <Note>Timeline משולב — טיפולים ידניים + היסטוריית בעלויות ממשלתית</Note>
        {[{d:'03/2026',ic:'',t:'החלפת שמן + פילטר',p:'מוסך טויוטה הרצליה',km:'87,400',cost:'₪350'},
          {d:'08/2025',ic:'',t:'החלפת בלמים קדמיים',p:'מוסך מקס ת"א',km:'82,100',cost:'₪1,200'},
          {d:'01/2025',ic:'',t:'טסט שנתי — עבר ',p:'מכון טסט ממשלתי',km:'80,200',cost:'—'},
          {d:'07/2023',ic:'',t:'העברת בעלות (ממשלתי)',p:'',km:'',cost:''}].map(({d,ic,t,p,km,cost})=>(
          <div key={d} style={{display:'flex', gap:14, marginBottom:14, fontFamily:F}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
              <div style={{width:34, height:34, borderRadius:'50%', background:LT, border:`1.5px solid ${BD}`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0}}>{ic}</div>
              <div style={{width:1, height:24, background:BD}} />
            </div>
            <div style={{flex:1, background:'#fff', border:`1px solid ${BD}`, borderRadius:10, padding:'10px 14px'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:3}}>
                <span style={{fontWeight:700, fontSize:14, color:DK}}>{t}</span>
                <span style={{fontSize:12, color:MD}}>{d}</span>
              </div>
              {p && <div style={{fontSize:13, color:MD}}>{p}</div>}
              {km && <div style={{display:'flex', justifyContent:'space-between', marginTop:3, fontSize:12, color:MD}}>
                <span>{km} ק"מ</span><span style={{fontWeight:700, color:DK}}>{cost}</span>
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </DShell>
);

// ── Desktop: Favorites ──
const DesktopFavorites = () => (
  <DShell active="fav">
    <div style={{padding:'24px 32px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
        <div style={{fontFamily:F, fontSize:18, fontWeight:700}}>מועדפים</div>
        <div style={{display:'flex', gap:8}}>
          <Btn label=" השווה נבחרים" sm secondary />
          <Btn label="+ הוסף מועדף" sm />
        </div>
      </div>
      <Note>חינם: עד 5 מועדפים · פרמיום: ללא הגבלה</Note>
      {/* List + comparison side by side */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:24}}>
        {/* List */}
        <div>
          <SHdr title="הרשימה שלי (3)" />
          {[{p:'1234567',m:'טויוטה קורולה 2019',s:28,l:'good'},{p:'9876543',m:'מזדה 3 2021',s:45,l:'warn'},{p:'5551234',m:'הונדה סיוויק 2018',s:70,l:'bad'}].map(({p,m,s,l})=>(
            <Card key={p}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                <div>
                  <div style={{fontFamily:F, fontSize:14, fontWeight:700}}>{m}</div>
                  <div style={{fontFamily:F, fontSize:12, color:MD}}>{p}</div>
                </div>
                <RiskBadge score={s} level={l} />
              </div>
              <Field ph={'הוסף הערה...'} style={{marginBottom:7, fontSize:12}} />
              <div style={{display:'flex', gap:6}}>
                <Btn label="פרטים" sm secondary style={{flex:1}} />
                <Btn label="" sm ghost />
              </div>
            </Card>
          ))}
        </div>
        {/* Comparison table */}
        <div>
          <SHdr title="השוואה מהירה" />
          <div style={{background:'#fff', border:`1px solid ${BD}`, borderRadius:12, overflow:'hidden'}}>
            {[{f:'—', vals:['קורולה 19','מזדה 21','סיוויק 18'], isH:true},
              {f:'ציון סיכון', vals:['28 ','45 ','70 '], g:0},
              {f:'שנה', vals:['2019','2021','2018'], g:1},
              {f:'בעלים', vals:['3','2','5'], g:1},
              {f:'ק"מ', vals:['87K','45K','120K'], g:1},
              {f:'טסט', vals:['351 יום','280 יום','פג '], g:0},
              {f:'שינוי מבנה', vals:['לא ','לא ','כן '], g:0},
            ].map(({f,vals,g,isH})=>(
              <div key={f} style={{display:'flex', borderBottom:`1px solid ${BD}`}}>
                <div style={{width:110, padding:'9px 12px', fontFamily:F, fontSize:13, color:isH?DK:MD, fontWeight:isH?700:400, borderLeft:`1px solid ${BD}`, background:isH?LT:'#fff', flexShrink:0}}>{isH?'':f}</div>
                {vals.map((v,ci)=>(
                  <div key={ci} style={{flex:1, padding:'9px 8px', textAlign:'center', fontFamily:F, fontSize:13,
                    fontWeight:isH||g===ci?700:400, color:isH?DK:g===ci?DK:MD,
                    background:isH?LT:g===ci?'#f3f4f6':'#fff', borderLeft:`1px solid ${BD}`}}>{v}</div>
                ))}
              </div>
            ))}
          </div>
          <Note>ירוק = הערך הטוב ביותר בשורה</Note>
        </div>
      </div>
    </div>
  </DShell>
);

// ── Desktop: Auth (Login) ──
const DesktopLogin = () => (
  <div style={{width:1280, background:'#f3f4f6', fontFamily:F, display:'flex', flexDirection:'column', minHeight:720}}>
    <div style={{background:'#fff', borderBottom:`1px solid ${BD}`, padding:'12px 40px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div style={{fontSize:20, fontWeight:700, color:DK}}>MyCarPortal</div>
    </div>
    <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40}}>
      <div style={{display:'flex', gap:0, background:'#fff', border:`1px solid ${BD}`, borderRadius:16, overflow:'hidden', maxWidth:800, width:'100%', boxShadow:'0 4px 24px rgba(0,0,0,0.06)'}}>
        {/* Left: marketing */}
        <div style={{flex:1, background:'#f3f4f6', padding:40, display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{fontSize:22, fontWeight:700, color:DK, marginBottom:12}}>בדוק כל רכב<br/>תוך שניות</div>
          <div style={{fontSize:14, color:MD, marginBottom:20}}>הצטרפו ל-MyCarPortal וקבלו:</div>
          {[' תזכורות טסט וביטוח',' ניהול מסמכים','⭐ מועדפים וחיפוש מהיר',' היסטוריית טיפולים'].map(f=>(
            <div key={f} style={{fontSize:14, color:DK, marginBottom:8}}>{f}</div>
          ))}
        </div>
        {/* Right: form */}
        <div style={{flex:1, padding:40}}>
          <div style={{fontSize:20, fontWeight:700, color:DK, marginBottom:3}}>ברוכים הבאים</div>
          <div style={{fontSize:14, color:MD, marginBottom:22}}>התחברו לחשבון שלכם</div>
          <Btn label="G  המשך עם Google" full secondary style={{marginBottom:12}} />
          <Sep />
          <Field ph="אימייל" icon="" style={{marginBottom:8}} />
          <Field ph="סיסמה" icon="" style={{marginBottom:6}} />
          <div style={{textAlign:'left', marginBottom:16}}>
            <span style={{fontSize:13, color:DK}}>שכחתם סיסמה?</span>
          </div>
          <Btn label="התחבר" full style={{marginBottom:12}} />
          <div style={{fontSize:13, color:MD, textAlign:'center'}}>אין לכם חשבון? <span style={{color:DK, fontWeight:700}}>הירשמו חינם</span></div>
        </div>
      </div>
    </div>
  </div>
);

// ── Desktop: Sale Ad ──
const DesktopSaleAd = () => (
  <DShell active="cars">
    <div style={{padding:'24px 32px'}}>
      <div style={{fontFamily:F, fontSize:18, fontWeight:700, marginBottom:16}}> מודעת מכירה אוטומטית</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:28}}>
        {/* Form */}
        <div>
          <SHdr title="נתוני הרכב (אוטומטי)" />
          <Card>
            {[['יצרן','טויוטה COROLLA 2019'],['ק"מ','87,400'],['טסט','עד 01/2027 '],['ריקולים','אין '],['ציון','28/100 ']].map(([l,v])=>(
              <Row key={l} label={l} val={v} />
            ))}
          </Card>
          <SHdr title="מה אתם מוסיפים:" style={{marginTop:14}} />
          <Field ph="מחיר מבוקש (₪)" icon="" style={{marginBottom:8}} />
          <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:8, padding:12,
            fontFamily:F, fontSize:14, color:MD, minHeight:80, marginBottom:8}}>
            הערות חופשיות — "יד שנייה מליסינג, רכב שמור"
          </div>
          <Field ph="טלפון (אופציונלי)" icon="" style={{marginBottom:8}} />
          <div style={{border:'2px dashed #bbb', borderRadius:8, padding:14, textAlign:'center', fontFamily:F}}>
            <div style={{fontSize:22, marginBottom:4}}></div>
            <div style={{fontSize:14, color:MD}}>תמונת רכב (פרמיום)</div>
          </div>
        </div>
        {/* Preview */}
        <div>
          <SHdr title="תצוגה מקדימה" />
          <div style={{background:LT, border:`1px solid ${BD}`, borderRadius:12, padding:16}}>
            <div style={{fontFamily:F, fontSize:12, color:DK, lineHeight:1.8, background:'#fff',
              padding:14, borderRadius:8, border:`1px solid ${BD}`, whiteSpace:'pre-wrap'}}>
{` למכירה — טויוטה COROLLA 2019

 פרטי הרכב:
• שנה: 2019 | צבע: לבן שנהב
• דלק: בנזין | אוטומטית
• 1,798 סמ"ק | 140 כ"ס

 מצב:
• ק"מ: 87,400
• טסט עד: 01/2027 
• 3 בעלים | ללא שינוי מבנה 

 מחיר: ₪95,000

 mycarportal.co.il/search/1234567`}
            </div>
            <div style={{display:'flex', gap:8, marginTop:12}}>
              <Btn label=" העתק" full secondary style={{flex:1}} />
              <Btn label=" WhatsApp" full style={{flex:1, background:'#374151'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </DShell>
);

// ── Desktop: Settings ──
const DesktopSettings = () => (
  <DShell active="set">
    <div style={{padding:'24px 32px'}}>
      <div style={{fontFamily:F, fontSize:18, fontWeight:700, marginBottom:20}}>הגדרות</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:28}}>
        {/* Profile */}
        <div>
          <SHdr title="פרופיל" />
          <Card>
            <div style={{display:'flex', gap:14, alignItems:'center', marginBottom:14}}>
              <div style={{width:52, height:52, borderRadius:'50%', background:LT, border:`2px solid ${BD}`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}></div>
              <div>
                <div style={{fontFamily:F, fontSize:16, fontWeight:700}}>דנה כהן</div>
                <div style={{fontFamily:F, fontSize:13, color:MD}}>dana@gmail.com</div>
              </div>
              <Btn label="ערוך" sm secondary style={{marginRight:'auto'}} />
            </div>
            <Field ph="שם מלא" style={{marginBottom:8}} />
            <Field ph="אימייל" icon="" style={{marginBottom:10}} />
            <Btn label="שמור שינויים" full />
          </Card>
          <SHdr title="תוכנית" style={{marginTop:14}} />
          <Card style={{border:`1.5px solid ${DK}`}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontFamily:F, fontSize:15, fontWeight:700}}>תוכנית: חינם</div>
                <div style={{fontFamily:F, fontSize:13, color:MD}}>1 רכב · 5 מועדפים</div>
              </div>
              <Btn label="שדרג ₪9.90/חודש" sm />
            </div>
          </Card>
        </div>
        {/* Notifications + General */}
        <div>
          <SHdr title="התראות" />
          <Card>
            {[{l:'תזכורת טסט (30 יום לפני)',on:true},{l:'תזכורת ביטוח',on:true},{l:'Push Notifications',on:false,locked:true}].map(({l,on,locked})=>(
              <div key={l} style={{display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'10px 0', borderBottom:`1px solid ${BD}`, fontFamily:F}}>
                <div>
                  <span style={{fontSize:14, color:locked?MD:DK}}>{l}</span>
                  {locked && <span style={{fontSize:11, color:MD, marginRight:5}}>(פרמיום)</span>}
                </div>
                <div style={{width:38, height:21, background:on&&!locked?DK:BD, borderRadius:11, position:'relative', flexShrink:0}}>
                  <div style={{width:17, height:17, background:'#fff', borderRadius:'50%', position:'absolute',
                    top:2, ...(on&&!locked?{left:18}:{left:2})}} />
                </div>
              </div>
            ))}
          </Card>
          <SHdr title="כללי" style={{marginTop:14}} />
          <Card>
            {['היסטוריית חיפושים','מדיניות פרטיות','תנאי שימוש','פנייה לתמיכה'].map(item=>(
              <div key={item} style={{display:'flex', justifyContent:'space-between', padding:'10px 0',
                borderBottom:`1px solid ${BD}`, fontFamily:F, fontSize:14, color:DK}}>
                <span>{item}</span><span style={{color:MD}}>›</span>
              </div>
            ))}
            <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', fontFamily:F, fontSize:14, color:DK}}>
              <span>התנתק</span><span>›</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </DShell>
);

// Export
Object.assign(window, {
  DSidebar, DNavBar, DShell,
  DesktopLanding, DesktopSearch, DesktopDashboard,
  DesktopVehicleDetail, DesktopFavorites,
  DesktopLogin, DesktopSaleAd, DesktopSettings,
});
