
// MyCarPortal — Hi-Fi Design Screens

// ══════════════════════════════════════════
// LANDING PAGE — MOBILE
// ══════════════════════════════════════════
const DesignLandingMobile = () => (
  <Screen>
    <NavBar right={
      <div style={{display:'flex', gap:8}}>
        <Btn label="התחבר" sm secondary />
      </div>
    } />
    <Scroll>
      {/* Hero */}
      <div style={{background:T.p700, padding:'32px 20px 28px', textAlign:'center'}}>
        <div style={{fontFamily:F, fontSize:28, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>
          בדוק כל רכב בישראל<br/>תוך שניות
        </div>
        <div style={{fontFamily:F, fontSize:14, color:'rgba(255,255,255,0.72)', marginBottom:22}}>
          מידע רשמי ממשרד התחבורה — חינם, ללא הרשמה
        </div>
        <div style={{background:'#fff', borderRadius:16, padding:'6px 6px 6px 16px',
          display:'flex', alignItems:'center', gap:8, marginBottom:12,
          boxShadow:'0 4px 16px rgba(0,0,0,0.2)'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.g400} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span style={{fontFamily:F, fontSize:15, color:T.g400, flex:1}}>הזן מספר רישוי...</span>
          <div style={{width:36, height:36, borderRadius:10, background:T.g100,
            display:'flex', alignItems:'center', justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.g500} strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <Btn label="חפש" style={{borderRadius:12, padding:'9px 18px', fontSize:14}} />
        </div>
        <div style={{fontFamily:F, fontSize:12, color:'rgba(255,255,255,0.55)'}}>
          לחץ 📷 לצילום לוחית רישוי (OCR)
        </div>
      </div>

      {/* Feature chips */}
      <div style={{display:'flex', gap:8, padding:'16px 16px 10px', overflowX:'auto'}}>
        {[['📊','דירוג סיכון'],['👥','בעלויות'],['🔧','ריקולים'],['🛡️','בטיחות ADAS']].map(([ic,lb])=>(
          <div key={lb} style={{display:'flex', alignItems:'center', gap:6, background:'#fff',
            border:`1px solid ${T.g200}`, borderRadius:20, padding:'7px 14px',
            fontFamily:F, fontSize:13, color:T.g700, whiteSpace:'nowrap', flexShrink:0,
            boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
            <span>{ic}</span><span>{lb}</span>
          </div>
        ))}
      </div>

      {/* Example result */}
      <div style={{margin:'6px 16px', background:'#fff', border:`1.5px solid ${T.g200}`,
        borderRadius:14, padding:14, boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
        <div style={{fontFamily:F, fontSize:11, color:T.g400, marginBottom:8}}>דוגמה לתוצאה:</div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <div style={{fontFamily:F, fontSize:16, fontWeight:700, color:T.g900}}>טויוטה COROLLA 2019</div>
            <div style={{fontFamily:F, fontSize:13, color:T.g500, marginTop:2}}>יד 3 · לבן שנהב · בנזין</div>
          </div>
          <LogoPH size={40} />
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
          <RiskBadge score={28} />
          <div style={{fontFamily:F, fontSize:13, color:T.g500}}>87,400 ק"מ</div>
        </div>
      </div>

      {/* Why section */}
      <div style={{padding:'16px 16px 12px'}}>
        <div style={{fontFamily:F, fontSize:17, fontWeight:700, color:T.g900, marginBottom:12}}>
          למה MyCarPortal?
        </div>
        {[
          {ic:'🏛️', t:'מידע רשמי', d:'ישירות ממשרד התחבורה — data.gov.il'},
          {ic:'🆓', t:'חינם לגמרי', d:'ללא הרשמה, ללא תשלום לחיפוש'},
          {ic:'⚡', t:'מהיר', d:'תוצאה תוך 3 שניות'},
          {ic:'📱', t:'PWA', d:'עובד גם אופליין, מותקן כאפליקציה'},
        ].map(({ic,t,d})=>(
          <div key={t} style={{display:'flex', gap:12, alignItems:'flex-start', marginBottom:12}}>
            <div style={{width:38, height:38, borderRadius:10, background:T.p50,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0}}>
              {ic}
            </div>
            <div>
              <div style={{fontFamily:F, fontSize:14, fontWeight:700, color:T.g900}}>{t}</div>
              <div style={{fontFamily:F, fontSize:13, color:T.g500, marginTop:1}}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Personal mgmt CTA */}
      <div style={{margin:'0 16px 16px', background:T.p50, border:`1px solid ${T.p100}`,
        borderRadius:16, padding:18}}>
        <div style={{fontFamily:F, fontSize:16, fontWeight:700, color:T.p700, marginBottom:4}}>
          ניהול רכב אישי
        </div>
        <div style={{fontFamily:F, fontSize:13, color:T.g500, marginBottom:14}}>
          תזכורות טסט וביטוח, מסמכים דיגיטליים, היסטוריית טיפולים
        </div>
        <Btn label="הירשם חינם ←" full />
      </div>

      {/* Pricing */}
      <div style={{padding:'0 16px 24px'}}>
        <div style={{fontFamily:F, fontSize:17, fontWeight:700, color:T.g900, marginBottom:12}}>תוכניות</div>
        <div style={{display:'flex', gap:10}}>
          <Card style={{flex:1, marginBottom:0}}>
            <div style={{fontFamily:F, fontSize:15, fontWeight:700, marginBottom:8}}>חינם</div>
            {['חיפוש ללא הגבלה','1 רכב לניהול','5 מועדפים','תזכורות אימייל'].map(f=>(
              <div key={f} style={{display:'flex', alignItems:'center', gap:6, marginBottom:5, fontFamily:F, fontSize:13, color:T.g700}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {f}
              </div>
            ))}
          </Card>
          <Card style={{flex:1, marginBottom:0, border:`2px solid ${T.p500}`}}>
            <Tag label="פרמיום" />
            <div style={{fontFamily:F, fontSize:13, color:T.g500, margin:'4px 0 8px'}}>₪9.90 / חודש</div>
            {['3 רכבים','Push notifications','PDF Report','ללא פרסומות'].map(f=>(
              <div key={f} style={{display:'flex', alignItems:'center', gap:6, marginBottom:5, fontFamily:F, fontSize:13, color:T.g700}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.p500} strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {f}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Scroll>
    <BotNav active="search" />
  </Screen>
);

// ══════════════════════════════════════════
// SEARCH RESULTS — MOBILE
// ══════════════════════════════════════════
const DesignSearchMobile = () => (
  <Screen>
    <NavBar title="1234567" hasBack />
    <Scroll>
      {/* Car image */}
      <ImgPH h={190} label="Toyota Corolla 2019 — imagin.studio" style={{borderRadius:0}} />

      {/* Vehicle header */}
      <div style={{padding:'14px 16px 12px', background:'#fff',
        borderBottom:`1px solid ${T.g200}`}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:F, fontSize:21, fontWeight:900, color:T.g900, lineHeight:1.2}}>
              טויוטה COROLLA 2019
            </div>
            <div style={{fontFamily:F, fontSize:13, color:T.g500, marginTop:3}}>
              יד 3 · לבן שנהב · בנזין
            </div>
          </div>
          <LogoPH size={44} />
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <RiskBadge score={28} />
          <div style={{display:'flex', gap:8}}>
            {['⭐','📤','📄'].map(ic=>(
              <div key={ic} style={{width:34, height:34, borderRadius:8, background:T.g100,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:17,
                border:`1px solid ${T.g200}`, cursor:'pointer'}}>{ic}</div>
            ))}
            <Btn label="🚗 הוסף" sm style={{fontSize:12}} />
          </div>
        </div>
      </div>

      <div style={{padding:'14px 16px 20px'}}>
        {/* Section 1 */}
        <SHdr title="פרטים כלליים" />
        <SBody>
          <DRow label="יצרן" val="טויוטה יפן" />
          <DRow label="דגם מסחרי" val="COROLLA COMFORT" />
          <DRow label="שנת ייצור" val="2019" />
          <DRow label="סוג דלק" val="בנזין" />
          <DRow label="עלייה לכביש" val="03/2019" />
          <DRow label="תג נכה" val="לא רשום" />
        </SBody>

        {/* Section 2 */}
        <SHdr title="מנוע ומפרט טכני" />
        <SBody>
          <DRow label="נפח מנוע" val='1,798 סמ"ק' />
          <DRow label="כוח" val='140 כ"ס' />
          <DRow label="הנעה" val="קדמית" />
          <DRow label="תיבת הילוכים" val="אוטומטית" />
          <DRow label="דלתות / מושבים" val="4 / 5" />
          <DRow label="סוג מרכב" val="סדאן" />
        </SBody>

        {/* Section 3: Ownership */}
        <SHdr title="היסטוריית בעלויות" />
        <SBody>
          <div style={{display:'flex', gap:8, marginBottom:12}}>
            <Tag label="3 בעלים" />
            <Tag label="ממוצע 2.5 שנים" color={T.g100} textColor={T.g700} />
          </div>
          <div style={{position:'relative', paddingRight:24}}>
            <div style={{position:'absolute', right:7, top:6, bottom:6, width:2,
              background:T.g200, borderRadius:1}} />
            {[{d:'03/2019',t:'החכר (ליסינג)',ic:'🏢',cur:false},
              {d:'12/2021',t:'פרטי',ic:'👤',cur:false},
              {d:'07/2023',t:'פרטי — בעלים נוכחי',ic:'👤',cur:true}].map(({d,t,ic,cur})=>(
              <div key={d} style={{display:'flex', gap:10, marginBottom:12, alignItems:'center', position:'relative'}}>
                <div style={{position:'absolute', right:-24, width:14, height:14, borderRadius:'50%',
                  background:cur?T.p500:T.g300||'#d1d5db', border:`2px solid #fff`,
                  boxShadow:`0 0 0 2px ${cur?T.p500:T.g200}`, flexShrink:0}} />
                <div style={{background:cur?T.p50:T.g50, border:`1px solid ${cur?T.p100:T.g200}`,
                  borderRadius:10, padding:'8px 12px', flex:1}}>
                  <div style={{fontFamily:F, fontSize:12, color:T.g500}}>{d}</div>
                  <div style={{fontFamily:F, fontSize:14, fontWeight:cur?700:500, color:cur?T.p500:T.g700}}>
                    {ic} {t}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:'#fefce8', border:`1px solid #fde68a`, borderRadius:8,
            padding:'8px 12px', fontFamily:F, fontSize:13, color:'#92400e'}}>
            ℹ️ הרכב התחיל כרכב ליסינג — מקובל בישראל
          </div>
        </SBody>

        {/* Section 4: Test & KM */}
        <SHdr title="טסט וקילומטראז'" />
        <SBody>
          <DRow label="טסט אחרון" val="15/01/2026" />
          <DRow label="תוקף טסט" val="15/01/2027 ✅" ok />
          <DRow label='ק"מ בטסט' val="87,400" />
          <DRow label='ממוצע ק"מ/שנה' val="12,486 ✅" ok />
          <DRow label="שינוי מבנה" val="לא ✅" ok />
          <DRow label="שינוי צבע" val="לא ✅" ok />
        </SBody>

        {/* Section 5: Recalls */}
        <SHdr title="ריקולים" />
        <SBody>
          <div style={{display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
            background:'#f0fdf4', border:`1px solid #bbf7d0`, borderRadius:10,
            fontFamily:F, fontSize:14, color:'#166534', fontWeight:600}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            אין ריקולים פתוחים
          </div>
        </SBody>

        {/* Section 6: Safety */}
        <SHdr title="בטיחות ו-ADAS" />
        <SBody>
          <div style={{display:'flex', gap:8, marginBottom:12}}>
            <div style={{flex:1, textAlign:'center', background:T.g50, borderRadius:10, padding:12}}>
              <div style={{fontFamily:F, fontSize:24, fontWeight:900, color:T.success}}>82</div>
              <div style={{fontFamily:F, fontSize:12, color:T.g500}}>ניקוד בטיחות</div>
            </div>
            <div style={{flex:1, textAlign:'center', background:T.g50, borderRadius:10, padding:12}}>
              <div style={{fontFamily:F, fontSize:24, fontWeight:900, color:T.g700}}>7</div>
              <div style={{fontFamily:F, fontSize:12, color:T.g500}}>כריות אוויר</div>
            </div>
          </div>
          <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
            {['ABS','ESP','בקרת סטייה','ניטור מרחק','מצלמת רוורס','בלימת חירום','זיהוי הולכי רגל'].map(f=>(
              <div key={f} style={{display:'flex', alignItems:'center', gap:4, background:'#f0fdf4',
                border:`1px solid #bbf7d0`, borderRadius:8, padding:'4px 9px',
                fontFamily:F, fontSize:12, color:'#166534'}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </SBody>

        {/* Section 7: Risk Breakdown */}
        <SHdr title="פירוט ציון סיכון" />
        <SBody>
          <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:14}}>
            <div style={{position:'relative', width:80, height:80, flexShrink:0}}>
              <svg viewBox="0 0 100 100" width="80" height="80">
                <circle cx="50" cy="50" r="40" fill="none" stroke={T.g200} strokeWidth="14"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke={T.success} strokeWidth="14"
                  strokeDasharray={`${28*2.51} ${72*2.51}`} strokeDashoffset="62.8"
                  strokeLinecap="round" transform="rotate(-90 50 50)"/>
              </svg>
              <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', fontFamily:F}}>
                <div style={{fontSize:20, fontWeight:900, color:T.g900}}>28</div>
                <div style={{fontSize:9, color:T.g500}}>מתוך 100</div>
              </div>
            </div>
            <div style={{fontFamily:F}}>
              <div style={{fontSize:16, fontWeight:700, color:T.success}}>נראה טוב</div>
              <div style={{fontSize:13, color:T.g500, marginTop:2, lineHeight:1.4}}>
                הנתונים הציבוריים<br/>נראים תקינים
              </div>
            </div>
          </div>
          {[{l:'בעלויות',s:6,m:20},{l:'תדירות החלפה',s:0,m:10},{l:'גיל רכב',s:5,m:15},
            {l:'סטטוס טסט',s:0,m:15},{l:"קילומטראז'",s:4,m:15},{l:'שינוי מבנה',s:0,m:10},
            {l:'ריקולים',s:0,m:10},{l:'סוג בעלות',s:3,m:5}].map(({l,s,m})=>{
            const pct = (s/m)*100;
            const c = pct>50?T.danger:pct>25?T.warning:T.success;
            return (
              <div key={l} style={{display:'flex', alignItems:'center', gap:8, marginBottom:9}}>
                <div style={{width:80, fontFamily:F, fontSize:12, color:T.g500, flexShrink:0, textAlign:'right'}}>{l}</div>
                <div style={{flex:1, background:T.g200, borderRadius:4, height:8, overflow:'hidden'}}>
                  <div style={{width:`${pct}%`, height:'100%', background:c, borderRadius:4}} />
                </div>
                <div style={{width:30, fontFamily:F, fontSize:12, color:T.g700, textAlign:'left', flexShrink:0}}>{s}/{m}</div>
              </div>
            );
          })}
          <div style={{background:'#fef3c7', border:`1px solid #fde68a`, borderRadius:8,
            padding:'9px 12px', fontFamily:F, fontSize:12, color:'#92400e', marginTop:8, lineHeight:1.5}}>
            ⚠️ הציון מבוסס על נתונים ציבוריים בלבד. לא כולל היסטוריית תאונות.
            <strong> מומלץ בחום לבצע בדיקה פיזית במכון מורשה.</strong>
          </div>
        </SBody>

        {/* Links */}
        <SHdr title="קישורים שימושיים" />
        <SBody>
          {[{ic:'🚔', t:'בדיקת רכב גנוב', d:'police.gov.il — בטאב חדש'},
            {ic:'🏛️', t:'אתר משרד התחבורה', d:'gov.il'}].map(({ic,t,d})=>(
            <div key={t} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0',
              borderBottom:`1px solid ${T.g100}`, fontFamily:F}}>
              <span style={{fontSize:22}}>{ic}</span>
              <div>
                <div style={{fontSize:14, fontWeight:600, color:T.p500}}>{t} ↗</div>
                <div style={{fontSize:12, color:T.g500}}>{d}</div>
              </div>
            </div>
          ))}
        </SBody>
        <div style={{height:20}} />
      </div>
    </Scroll>
  </Screen>
);

// ══════════════════════════════════════════
// DASHBOARD — MOBILE
// ══════════════════════════════════════════
const DesignDashboardMobile = () => (
  <Screen>
    <NavBar />
    <Scroll>
      <AlertBanner
        text="טסט של הקורולה פג בעוד 28 ימים"
        sub="לחץ לצפייה בפרטים ולהוספת תזכורת"
        type="warn" />
      <div style={{padding:'14px 16px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <div style={{fontFamily:F, fontSize:18, fontWeight:700, color:T.g900}}>הרכבים שלי</div>
          <Btn label="+ הוסף" sm secondary />
        </div>

        {/* Vehicle card */}
        <div style={{background:'#fff', border:`1.5px solid ${T.g200}`, borderRadius:16,
          overflow:'hidden', marginBottom:12, boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
          <ImgPH h={110} label="Toyota Corolla 2019" style={{borderRadius:0}} />
          <div style={{padding:14}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
              <div>
                <div style={{fontFamily:F, fontSize:15, fontWeight:700, color:T.g900}}>הרכב שלי — קורולה</div>
                <div style={{fontFamily:F, fontSize:13, color:T.g500}}>טויוטה COROLLA 2019</div>
              </div>
              <RiskBadge score={28} size="sm" />
            </div>
            {/* Progress bars */}
            <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom:12}}>
              {[{label:'טסט', days:28, pct:7, suffix:'⚠️ 28 יום'},
                {label:'ביטוח', days:120, pct:40, suffix:'✅ 120 יום'}].map(({label,days,pct,suffix})=>(
                <div key={label} style={{display:'flex', alignItems:'center', gap:8}}>
                  <div style={{fontFamily:F, fontSize:12, color:T.g500, width:36, flexShrink:0}}>{label}</div>
                  <ProgressBar pct={pct} days={days} />
                  <div style={{fontFamily:F, fontSize:12, color:days<30?T.warning:T.success,
                    fontWeight:700, whiteSpace:'nowrap', flexShrink:0}}>{suffix}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex', gap:8}}>
              <Btn label="פרטים מלאים" secondary style={{flex:1, padding:'9px'}} />
              <Btn label="🔧 טיפולים" ghost style={{flex:1, padding:'9px'}} />
            </div>
          </div>
        </div>

        {/* Empty slot */}
        <div style={{border:`2px dashed ${T.g200}`, borderRadius:16, padding:24,
          textAlign:'center', marginBottom:16}}>
          <div style={{width:44, height:44, borderRadius:12, background:T.g100,
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.g400} strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <div style={{fontFamily:F, fontSize:14, color:T.g500, marginBottom:4}}>הוסף רכב נוסף</div>
          <div style={{fontFamily:F, fontSize:12, color:T.g400}}>פרמיום: עד 3 רכבים</div>
        </div>

        {/* Quick actions */}
        <div style={{fontFamily:F, fontSize:16, fontWeight:700, color:T.g900, marginBottom:10}}>
          פעולות מהירות
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          {[{ic:'🔍',l:'חפש רכב'},{ic:'⭐',l:'מועדפים'},{ic:'🕐',l:'היסטוריה'},{ic:'📊',l:'השווה רכבים'}].map(({ic,l})=>(
            <div key={l} style={{background:'#fff', border:`1px solid ${T.g200}`, borderRadius:12,
              padding:14, display:'flex', alignItems:'center', gap:10, cursor:'pointer',
              boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
              <span style={{fontSize:22}}>{ic}</span>
              <span style={{fontFamily:F, fontSize:14, color:T.g700}}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </Scroll>
    <BotNav active="cars" />
  </Screen>
);

// ══════════════════════════════════════════
// DESKTOP LANDING
// ══════════════════════════════════════════
const DesignDesktopLanding = () => (
  <div style={{width:1280, background:'#fff', fontFamily:F}}>
    {/* Desktop Navbar */}
    <div style={{background:'#fff', borderBottom:`1px solid ${T.g200}`, padding:'0 40px',
      height:64, display:'flex', alignItems:'center', justifyContent:'space-between',
      position:'sticky', top:0, boxShadow:'0 1px 6px rgba(0,0,0,0.06)'}}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={T.p500} strokeWidth="2">
          <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
          <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
        </svg>
        <span style={{fontSize:20, fontWeight:900, color:T.p700}}>MyCarPortal</span>
      </div>
      <nav style={{display:'flex', gap:6}}>
        {['בית','מועדפים','היסטוריה','אודות'].map(l=>(
          <div key={l} style={{padding:'6px 14px', borderRadius:8, fontFamily:F, fontSize:14,
            color:T.g700, cursor:'pointer'}}>
            {l}
          </div>
        ))}
      </nav>
      <div style={{display:'flex', gap:8}}>
        <Btn label="התחבר" secondary sm />
        <Btn label="הירשם חינם" sm />
      </div>
    </div>

    {/* Hero */}
    <div style={{background:T.p700, padding:'64px 80px', display:'flex', gap:48, alignItems:'center'}}>
      <div style={{flex:1}}>
        <div style={{fontSize:40, fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:14}}>
          בדוק כל רכב בישראל<br/>תוך שניות
        </div>
        <div style={{fontSize:16, color:'rgba(255,255,255,0.72)', marginBottom:28}}>
          מידע רשמי ממשרד התחבורה, דירוג סיכון מבוסס נתונים, חינם לחלוטין
        </div>
        <div style={{background:'#fff', borderRadius:16, padding:'6px 6px 6px 20px',
          display:'flex', gap:12, alignItems:'center', maxWidth:480, marginBottom:16,
          boxShadow:'0 8px 24px rgba(0,0,0,0.25)'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.g400} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span style={{fontSize:16, color:T.g400, flex:1}}>הקלד מספר רישוי (7–8 ספרות)...</span>
          <div style={{width:40, height:40, borderRadius:10, background:T.g100, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.g500} strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <Btn label="חפש" style={{padding:'12px 28px', fontSize:15, borderRadius:12}} />
        </div>
        <div style={{display:'flex', gap:10}}>
          {['✅ חינם ללא הרשמה','✅ מידע רשמי','✅ תוצאה תוך 3 שניות'].map(t=>(
            <span key={t} style={{background:'rgba(255,255,255,0.15)', borderRadius:20,
              padding:'5px 14px', fontSize:13, color:'rgba(255,255,255,0.9)', fontFamily:F}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{flex:1}}>
        <ImgPH h={280} label="Screenshot — עמוד תוצאות חיפוש"
          style={{borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)'}} />
      </div>
    </div>

    {/* Feature row */}
    <div style={{display:'flex', background:'#fff', borderBottom:`1px solid ${T.g200}`}}>
      {[['📊','דירוג סיכון','ציון 0–100 מ-8 פרמטרים אמיתיים'],
        ['👥','היסטוריית בעלויות','Timeline מלא — מי החזיק ומתי'],
        ['🔧','ריקולים פתוחים','תקלות ידועות שלא תוקנו'],
        ['🛡️','מפרט בטיחות ADAS','כריות אוויר, ABS, בקרת יציבות']].map(([ic,t,d])=>(
        <div key={t} style={{flex:1, padding:'28px 24px', borderLeft:`1px solid ${T.g200}`, textAlign:'center'}}>
          <div style={{width:52, height:52, borderRadius:14, background:T.p50,
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:26}}>
            {ic}
          </div>
          <div style={{fontSize:16, fontWeight:700, color:T.g900, marginBottom:5}}>{t}</div>
          <div style={{fontSize:13, color:T.g500, lineHeight:1.4}}>{d}</div>
        </div>
      ))}
    </div>

    {/* Personal management */}
    <div style={{padding:'60px 80px', display:'flex', gap:60, alignItems:'center',
      background:T.g50, borderBottom:`1px solid ${T.g200}`}}>
      <div style={{flex:1.2}}>
        <Tag label="ניהול רכב אישי" />
        <div style={{fontSize:30, fontWeight:900, color:T.g900, margin:'12px 0 12px', lineHeight:1.2}}>
          הכל במקום אחד —<br/>גם אחרי הקנייה
        </div>
        <div style={{fontSize:15, color:T.g500, marginBottom:22, lineHeight:1.6}}>
          תזכורות אוטומטיות לטסט ולביטוח, ניהול מסמכים דיגיטלי,
          היסטוריית טיפולים ומחולל מודעת מכירה חכם.
        </div>
        {['🔔 תזכורות טסט וביטוח — 30 יום מראש',
          '📂 מסמכים דיגיטליים — רישיון, ביטוח, קבלות',
          '🔧 היסטוריית טיפולים — תיעוד כל שירות',
          '📝 מודעת מכירה אוטומטית — בלחיצה אחת'].map(f=>(
          <div key={f} style={{display:'flex', alignItems:'center', gap:8, marginBottom:9,
            fontFamily:F, fontSize:14, color:T.g700}}>
            {f}
          </div>
        ))}
        <Btn label="הירשם חינם ←" style={{marginTop:18, padding:'12px 28px', fontSize:16}} />
      </div>
      <div style={{flex:1}}>
        <ImgPH h={280} label="Dashboard Screenshot" style={{borderRadius:20}} />
      </div>
    </div>

    {/* Pricing */}
    <div style={{padding:'60px 80px', background:'#fff'}}>
      <div style={{textAlign:'center', marginBottom:36}}>
        <div style={{fontSize:28, fontWeight:900, color:T.g900}}>תוכניות ומחירים</div>
        <div style={{fontSize:15, color:T.g500, marginTop:6}}>התחילו בחינם, שדרגו כשתצטרכו</div>
      </div>
      <div style={{display:'flex', gap:20, maxWidth:700, margin:'0 auto'}}>
        <Card style={{flex:1, marginBottom:0, padding:28}}>
          <div style={{fontSize:20, fontWeight:700, marginBottom:4}}>חינם</div>
          <div style={{fontSize:13, color:T.g500, marginBottom:20}}>לאורח ולמשתמש רשום</div>
          {[['חיפוש ללא הגבלה',true],['דירוג סיכון',true],['1 רכב לניהול',true],
            ['5 מועדפים',true],['תזכורות אימייל',true],['Push Notifications',false],
            ['הפקת PDF',false],['ללא פרסומות',false]].map(([f,ok])=>(
            <div key={f} style={{display:'flex', alignItems:'center', gap:8, marginBottom:8,
              fontFamily:F, fontSize:14, color:ok?T.g700:T.g400}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={ok?T.success:T.g300||'#d1d5db'} strokeWidth="2.5">
                {ok ? <polyline points="20 6 9 17 4 12"/> : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
              </svg>
              {f}
            </div>
          ))}
        </Card>
        <Card style={{flex:1, marginBottom:0, padding:28, border:`2px solid ${T.p500}`,
          boxShadow:`0 4px 20px ${T.p100}`}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4}}>
            <div style={{fontSize:20, fontWeight:700}}>פרמיום</div>
            <Tag label="הכי פופולרי ✨" />
          </div>
          <div style={{fontSize:24, fontWeight:900, color:T.p500, marginBottom:4}}>₪9.90
            <span style={{fontSize:14, color:T.g500, fontWeight:400}}> / חודש</span>
          </div>
          <div style={{fontSize:13, color:T.g500, marginBottom:20}}>ביטול בכל עת</div>
          {[['חיפוש ללא הגבלה',true],['דירוג סיכון',true],['3 רכבים לניהול',true],
            ['מועדפים ללא הגבלה',true],['Push Notifications',true],
            ['הפקת PDF',true],['ללא פרסומות',true],['השוואת 4 רכבים',true]].map(([f,ok])=>(
            <div key={f} style={{display:'flex', alignItems:'center', gap:8, marginBottom:8,
              fontFamily:F, fontSize:14, color:T.g700}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.p500} strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {f}
            </div>
          ))}
          <Btn label="התחל עכשיו" full style={{marginTop:16, padding:'12px'}} />
        </Card>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════
// AUTH — LOGIN MOBILE
// ══════════════════════════════════════════
const DesignLoginMobile = () => (
  <Screen>
    <Scroll style={{padding:'32px 24px'}}>
      <div style={{textAlign:'center', marginBottom:28}}>
        <div style={{width:56, height:56, borderRadius:16, background:T.p50,
          display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.p500} strokeWidth="2">
            <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
            <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
        <div style={{fontFamily:F, fontSize:24, fontWeight:900, color:T.g900}}>MyCarPortal</div>
        <div style={{fontFamily:F, fontSize:14, color:T.g500, marginTop:4}}>ברוכים הבאים</div>
      </div>

      <Btn label="המשך עם Google" full secondary
        style={{marginBottom:14, padding:'12px',
          display:'flex', gap:10, alignItems:'center', justifyContent:'center'}}
        icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
      />
      <Sep />
      <div style={{marginBottom:10}}>
        <label style={{fontFamily:F, fontSize:13, color:T.g700, display:'block', marginBottom:5, fontWeight:600}}>
          אימייל
        </label>
        <Field ph="your@email.com" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.g400} strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>} />
      </div>
      <div style={{marginBottom:6}}>
        <label style={{fontFamily:F, fontSize:13, color:T.g700, display:'block', marginBottom:5, fontWeight:600}}>
          סיסמה
        </label>
        <Field ph="••••••••" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.g400} strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>} />
      </div>
      <div style={{textAlign:'left', marginBottom:20}}>
        <span style={{fontFamily:F, fontSize:13, color:T.p500, cursor:'pointer'}}>שכחת סיסמה?</span>
      </div>
      <Btn label="התחבר" full style={{marginBottom:16, padding:'13px'}} />
      <div style={{fontFamily:F, fontSize:13, color:T.g500, textAlign:'center'}}>
        אין לך חשבון?{' '}
        <span style={{color:T.p500, fontWeight:700, cursor:'pointer'}}>הירשם חינם</span>
      </div>
    </Scroll>
  </Screen>
);

Object.assign(window, {
  DesignLandingMobile, DesignSearchMobile,
  DesignDashboardMobile, DesignDesktopLanding, DesignLoginMobile,
});
