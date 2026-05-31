
// MyCarPortal Wireframe Screens

// ══════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════

const LandingA = () => (
  <Screen>
    <NavBar actions={['התחבר']} />
    <Scroll>
      <div style={{background:'#f3f4f6', padding:'28px 18px 22px', textAlign:'center'}}>
        <div style={{fontFamily:F, fontSize:27, fontWeight:700, color:DK, lineHeight:1.2, marginBottom:8}}>
          בדוק כל רכב בישראל<br/>תוך שניות
        </div>
        <div style={{fontFamily:F, fontSize:14, color:MD, marginBottom:18}}>מידע רשמי ממשרד התחבורה — חינם, ללא הרשמה</div>
        <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:12, padding:'11px 14px',
          display:'flex', alignItems:'center', gap:8, marginBottom:10, textAlign:'right'}}>
          <span style={{fontSize:20}}></span>
          <span style={{fontFamily:F, fontSize:16, color:'#aaa', flex:1}}>מספר רישוי...</span>
          <span style={{fontSize:18}}></span>
        </div>
        <Btn label="חפש רכב " full />
        <div style={{fontFamily:F, fontSize:12, color:MD, marginTop:8}}>לחץ  לצילום לוחית עם OCR</div>
      </div>

      <div style={{display:'flex', gap:8, padding:'14px 16px 10px'}}>
        {[['','דירוג סיכון'],['','בעלויות'],['','ריקולים']].map(([ic,lb])=>(
          <div key={lb} style={{flex:1, background:LT, border:`1px solid ${BD}`, borderRadius:10,
            padding:'10px 6px', textAlign:'center', fontFamily:F, fontSize:12}}>
            <div style={{fontSize:22, marginBottom:3}}>{ic}</div>{lb}
          </div>
        ))}
      </div>

      <div style={{padding:'0 16px 14px'}}>
        <SHdr title="למה MyCarPortal?" />
        {[[' מידע רשמי','data.gov.il'],[' חינם לגמרי','ללא הרשמה'],[' מהיר','תוצאה תוך 3 שניות'],[' PWA','עובד גם אופליין']].map(([a,b])=>(
          <div key={a} style={{display:'flex', justifyContent:'space-between', marginBottom:8, fontFamily:F, fontSize:14}}>
            <span style={{color:DK}}>{a}</span><span style={{color:MD}}>{b}</span>
          </div>
        ))}
      </div>

      <div style={{background:'#f3f4f6', margin:'0 16px 16px', borderRadius:12, padding:14}}>
        <div style={{fontFamily:F, fontSize:15, fontWeight:700, color:DK, marginBottom:6}}>ניהול רכב אישי</div>
        <Img h={72} label="Screenshot דשבורד" style={{marginBottom:10}} />
        <div style={{fontFamily:F, fontSize:13, color:MD, marginBottom:10}}>תזכורות, מסמכים, היסטוריית טיפולים</div>
        <Btn label="הירשם חינם" full secondary />
      </div>

      <div style={{padding:'0 16px 20px'}}>
        <SHdr title="תוכניות" />
        <div style={{display:'flex', gap:8}}>
          <Card style={{flex:1, marginBottom:0}}>
            <div style={{fontFamily:F, fontSize:14, fontWeight:700, marginBottom:6}}>חינם</div>
            <div style={{fontFamily:F, fontSize:12, color:MD}}>חיפוש ללא הגבלה</div>
            <div style={{fontFamily:F, fontSize:12, color:MD}}>1 רכב לניהול</div>
            <div style={{fontFamily:F, fontSize:12, color:MD}}>5 מועדפים</div>
          </Card>
          <Card style={{flex:1, marginBottom:0, border:`1.5px solid ${BD}`}}>
            <div style={{fontFamily:F, fontSize:14, fontWeight:700, color:DK, marginBottom:6}}>פרמיום ₪9.90/חודש</div>
            <div style={{fontFamily:F, fontSize:12, color:MD}}>3 רכבים לניהול</div>
            <div style={{fontFamily:F, fontSize:12, color:MD}}>מסמכים ללא הגבלה</div>
            <div style={{fontFamily:F, fontSize:12, color:MD}}>Push notifications</div>
          </Card>
        </div>
      </div>
    </Scroll>
    <BotNav active="search" />
  </Screen>
);

const LandingB = () => (
  <Screen>
    <div style={{background:BL, padding:'18px 18px 24px', flexShrink:0}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22, fontFamily:F}}>
        <div style={{fontSize:20, fontWeight:700, color:'#fff'}}>MyCarPortal</div>
        <div style={{background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)',
          borderRadius:8, padding:'5px 14px', color:'#fff', fontFamily:F, fontSize:14}}>התחבר</div>
      </div>
      <div style={{fontFamily:F, fontSize:22, fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:6}}>
        בדוק רכב לפני הקנייה
      </div>
      <div style={{fontFamily:F, fontSize:14, color:'rgba(255,255,255,0.8)', marginBottom:16}}>
        כל המידע הרשמי, דירוג סיכון, חינם
      </div>
      <div style={{background:'#fff', borderRadius:12, padding:'4px 4px 4px 12px',
        display:'flex', alignItems:'center', gap:8}}>
        <span style={{fontSize:18}}></span>
        <span style={{fontFamily:F, fontSize:15, color:'#aaa', flex:1}}>מספר רישוי...</span>
        <Btn label="חפש" style={{borderRadius:10, padding:'9px 16px'}} />
      </div>
    </div>

    <Scroll style={{padding:16}}>
      <div style={{marginBottom:16}}>
        <div style={{fontFamily:F, fontSize:14, color:MD, marginBottom:8}}> חיפושים אחרונים</div>
        {[{p:'1234567',m:'טויוטה קורולה 2019',s:28,l:'good'},{p:'9876543',m:'מזדה 3 2021',s:45,l:'warn'}].map(v=>(
          <div key={v.p} style={{display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'9px 12px', background:LT, borderRadius:8, marginBottom:6, fontFamily:F}}>
            <div>
              <div style={{fontSize:15, fontWeight:600}}>{v.p}</div>
              <div style={{fontSize:13, color:MD}}>{v.m}</div>
            </div>
            <RiskBadge score={v.s} level={v.l} />
          </div>
        ))}
      </div>

      <div style={{fontFamily:F, fontSize:15, fontWeight:700, color:DK, marginBottom:10}}>מה תמצאו כאן?</div>
      {[
        {ic:'', t:'דירוג סיכון', d:'ציון 0–100 מ-8 פרמטרים אמיתיים'},
        {ic:'', t:'היסטוריית בעלויות', d:'כמה ידיים עבר הרכב ומתי'},
        {ic:'', t:'ריקולים פתוחים', d:'תקלות ידועות שלא תוקנו'},
        {ic:'', t:'בטיחות ADAS', d:'כריות אוויר, ABS, בקרת יציבות'},
      ].map(({ic,t,d})=>(
        <div key={t} style={{display:'flex', gap:12, padding:'10px 12px', background:'#fff',
          border:`1px solid ${BD}`, borderRadius:10, marginBottom:8, alignItems:'flex-start', fontFamily:F}}>
          <span style={{fontSize:24}}>{ic}</span>
          <div>
            <div style={{fontWeight:600, fontSize:14, color:DK}}>{t}</div>
            <div style={{fontSize:13, color:MD}}>{d}</div>
          </div>
        </div>
      ))}
      <Btn label=" הוסף למסך הבית (PWA)" full secondary style={{marginTop:8}} />
    </Scroll>
    <BotNav active="search" />
  </Screen>
);

// ══════════════════════════════════════════
// SEARCH RESULTS
// ══════════════════════════════════════════

const SearchA = () => (
  <Screen>
    <NavBar title="1234567" actions={['']} />
    <Scroll>
      <Img h={155} label="תמונת CGI — Toyota Corolla 2019 (imagin.studio)" style={{borderRadius:0, border:'none'}} />
      <div style={{padding:'12px 16px 10px', background:'#fff', borderBottom:`1px solid ${BD}`}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6}}>
          <div>
            <div style={{fontFamily:F, fontSize:19, fontWeight:700, color:DK}}>טויוטה COROLLA 2019</div>
            <div style={{fontFamily:F, fontSize:13, color:MD}}>יד 3 · לבן שנהב · בנזין</div>
          </div>
          <Img h={34} label="" style={{width:44, border:'none', background:'transparent', flexShrink:0}} />
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <RiskBadge score={28} level="good" />
          <div style={{display:'flex', gap:10}}>
            <span style={{fontSize:20}}>⭐</span>
            <span style={{fontSize:20}}></span>
            <span style={{fontSize:20}}></span>
            <span style={{fontSize:20}}></span>
          </div>
        </div>
      </div>

      <div style={{padding:'14px 16px 20px'}}>
        <SHdr title="פרטים כלליים" />
        {[['יצרן','טויוטה יפן'],['דגם מסחרי','COROLLA COMFORT'],['שנת ייצור','2019'],
          ['סוג דלק','בנזין'],['עלייה לכביש','03/2019'],['תג נכה',' לא רשום']].map(([l,v])=>(
          <Row key={l} label={l} val={v} />
        ))}

        <SHdr title="מנוע ומפרט טכני" style={{marginTop:16}} />
        {[['נפח מנוע','1,798 סמ"ק'],['כוח','140 כ"ס'],['הנעה','קדמית'],
          ['תיבת הילוכים','אוטומטית'],['דלתות / מושבים','4 / 5'],['סוג מרכב','סדאן']].map(([l,v])=>(
          <Row key={l} label={l} val={v} />
        ))}

        <SHdr title="היסטוריית בעלויות" style={{marginTop:16}} />
        <div style={{display:'flex', gap:6, marginBottom:10}}>
          <span style={{background:'#e5e7eb', color:'#374151', borderRadius:20, padding:'2px 10px', fontFamily:F, fontSize:12}}>3 בעלים</span>
          <span style={{background:'#f3f4f6', color:MD, borderRadius:20, padding:'2px 10px', fontFamily:F, fontSize:12}}>ממוצע 2.5 שנים</span>
        </div>
        {[{d:'03/2019',t:'החכר (ליסינג)',ic:'',cur:false},{d:'12/2021',t:'פרטי',ic:'',cur:false},{d:'07/2023',t:'פרטי — בעלים נוכחי',ic:'',cur:true}].map(({d,t,ic,cur})=>(
          <div key={d} style={{display:'flex', gap:10, marginBottom:10, fontFamily:F, alignItems:'flex-start'}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2, paddingTop:3}}>
              <div style={{width:10, height:10, borderRadius:'50%', background:cur?BL:BD, flexShrink:0}} />
              <div style={{width:1, height:22, background:BD}} />
            </div>
            <div style={{fontSize:13}}>
              <span style={{color:MD}}>{d}</span>
              <span style={{color:cur?BL:DK, fontWeight:cur?700:400, marginRight:6}}> {ic} {t}</span>
            </div>
          </div>
        ))}
        <Note>ℹ הרכב התחיל כליסינג — חישוב "יד" מבוסס על בעלויות פרטיות בלבד</Note>

        <SHdr title="טסט וקילומטראז'" style={{marginTop:8}} />
        {[['טסט אחרון','15/01/2026'],['תוקף טסט','15/01/2027 '],['ק"מ בטסט','87,400'],
          ['ממוצע ק"מ/שנה','12,486 '],['שינוי מבנה','לא '],['שינוי צבע','לא ']].map(([l,v])=>(
          <Row key={l} label={l} val={v} />
        ))}

        <SHdr title="ריקולים" style={{marginTop:16}} />
        <div style={{background:'#f3f4f6', border:'1px solid #d1d5db', borderRadius:8, padding:10,
          fontFamily:F, fontSize:14, color:MD}}> אין ריקולים פתוחים</div>

        <SHdr title="בטיחות ו-ADAS" style={{marginTop:16}} />
        <Row label="ניקוד בטיחות" val="82 / 100" />
        <Row label="כריות אוויר" val="7" />
        <div style={{display:'flex', flexWrap:'wrap', gap:5, marginTop:8}}>
          {['ABS ','ESP ','בקרת סטייה ','ניטור מרחק ','מצלמת רוורס ','בלימת חירום ','זיהוי הולכי רגל '].map(f=>(
            <span key={f} style={{background:'#f3f4f6', borderRadius:6, padding:'3px 8px', fontFamily:F, fontSize:12, color:MD}}>{f}</span>
          ))}
        </div>

        <SHdr title="סביבה ופליטות" style={{marginTop:16}} />
        {[['מדד ירוק','8.5'],['CO₂ (WLTP)','120 g/km'],['קבוצת זיהום','12']].map(([l,v])=>(
          <Row key={l} label={l} val={v} />
        ))}

        <SHdr title="צמיגים" style={{marginTop:16}} />
        {[['קדמי','205/55R16'],['אחורי','205/55R16']].map(([l,v])=>(<Row key={l} label={l} val={v} />))}

        <SHdr title="פירוט דירוג סיכון" style={{marginTop:16}} />
        {[{l:'בעלויות',s:6,m:20},{l:'תדירות החלפה',s:0,m:10},{l:'גיל רכב',s:5,m:15},
          {l:'סטטוס טסט',s:0,m:15},{l:'קילומטראז\'',s:4,m:15},{l:'שינוי מבנה',s:0,m:10},
          {l:'ריקולים',s:0,m:10},{l:'סוג בעלות',s:3,m:5}].map(({l,s,m})=>(
          <div key={l} style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
            <div style={{width:72, fontFamily:F, fontSize:12, color:MD, flexShrink:0}}>{l}</div>
            <div style={{flex:1, background:BD, borderRadius:4, height:8, overflow:'hidden'}}>
              <div style={{width:`${(s/m)*100}%`, height:'100%', borderRadius:4,
                background:s/m>0.5?RD:s/m>0.25?YL:GN}} />
            </div>
            <div style={{width:28, fontFamily:F, fontSize:12, color:DK, flexShrink:0, textAlign:'left'}}>{s}/{m}</div>
          </div>
        ))}
        <Note> מבוסס על נתונים ציבוריים בלבד. מומלץ בחום לבצע בדיקה פיזית במכון מורשה.</Note>

        <SHdr title="קישורים שימושיים" style={{marginTop:8}} />
        <div style={{background:LT, borderRadius:8, padding:'9px 12px', marginBottom:6, fontFamily:F, fontSize:14}}> בדיקת רכב גנוב — police.gov.il </div>
        <div style={{background:LT, borderRadius:8, padding:'9px 12px', fontFamily:F, fontSize:14}}> אתר משרד התחבורה </div>
        <div style={{height:20}} />
      </div>
    </Scroll>
  </Screen>
);

const SearchB = () => (
  <Screen>
    <NavBar title="1234567" actions={['']} />
    <Scroll>
      <Img h={155} label="תמונת CGI — Toyota Corolla 2019" style={{borderRadius:0, border:'none'}} />
      <div style={{padding:'12px 16px 8px', background:'#fff', borderBottom:`2px solid ${BL}22`}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
          <div>
            <div style={{fontFamily:F, fontSize:17, fontWeight:700}}>טויוטה COROLLA 2019</div>
            <div style={{fontFamily:F, fontSize:13, color:MD}}>יד 3 · לבן שנהב</div>
          </div>
          <RiskBadge score={28} level="good" />
        </div>
        <Note>Quick-nav גלילה אופקית — אנקורים לסקשנים:</Note>
        <div style={{display:'flex', gap:6, overflowX:'auto', paddingBottom:4}}>
          {['כללי','מנוע','בעלויות','טסט','ריקולים','בטיחות','סביבה','פירוט'].map(s=>(
            <div key={s} style={{background:LT, border:`1px solid ${BD}`, borderRadius:20,
              padding:'4px 11px', fontFamily:F, fontSize:12, whiteSpace:'nowrap', flexShrink:0}}>{s}</div>
          ))}
        </div>
      </div>

      <div style={{padding:'10px 16px', display:'flex', gap:8}}>
        <Btn label=" הוסף לרכבים שלי" full style={{flex:2, fontSize:13}} />
        <Btn label="⭐" secondary style={{padding:'11px 14px'}} />
        <Btn label="" secondary style={{padding:'11px 14px'}} />
      </div>

      <div style={{padding:'0 16px 16px'}}>
        <SHdr title="פרטים כלליים" />
        <div style={{display:'flex', flexWrap:'wrap', gap:7, marginBottom:14}}>
          {[['יצרן','טויוטה'],['שנה','2019'],['דלק','בנזין'],['מרכב','סדאן'],['הנעה','קדמית'],['הילוכים','אוטומטי']].map(([l,v])=>(
            <div key={l} style={{background:LT, border:`1px solid ${BD}`, borderRadius:8, padding:'7px 11px', fontFamily:F}}>
              <div style={{fontSize:10, color:MD}}>{l}</div>
              <div style={{fontSize:14, fontWeight:600, color:DK}}>{v}</div>
            </div>
          ))}
        </div>

        <SHdr title="היסטוריית בעלויות" />
        <div style={{display:'flex', gap:8, marginBottom:10}}>
          {[['3','בעלים'],['2.5 שנים','ממוצע'],['07/23','מהבעלים הנוכחי']].map(([v,l])=>(
            <div key={l} style={{flex:1, background:LT, border:`1px solid ${BD}`, borderRadius:10, padding:'8px 6px', textAlign:'center', fontFamily:F}}>
              <div style={{fontSize:18, fontWeight:700, color:DK}}>{v}</div>
              <div style={{fontSize:11, color:MD}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex', gap:4, alignItems:'center', fontFamily:F, fontSize:12, flexWrap:'wrap', marginBottom:12}}>
          <span style={{background:'#e5e7eb', color:'#374151', borderRadius:20, padding:'3px 10px'}}> 03/19 ליסינג</span>
          <span style={{color:MD}}></span>
          <span style={{background:'#f3f4f6', color:MD, borderRadius:20, padding:'3px 10px'}}> 12/21 פרטי</span>
          <span style={{color:MD}}></span>
          <span style={{background:'#f3f4f6', color:DK, borderRadius:20, padding:'3px 10px', fontWeight:700}}> 07/23 פרטי </span>
        </div>

        <SHdr title="טסט וקילומטראז'" />
        <div style={{display:'flex', gap:8, marginBottom:14}}>
          {[{v:'351',l:'ימים לטסט',c:GN},{v:'87,400',l:'ק"מ',c:DK},{v:'',l:'ללא שינויים',c:GN}].map(({v,l,c})=>(
            <Card key={l} style={{flex:1, marginBottom:0, textAlign:'center', padding:10}}>
              <div style={{fontFamily:F, fontSize:20, fontWeight:700, color:c}}>{v}</div>
              <div style={{fontFamily:F, fontSize:10, color:MD}}>{l}</div>
            </Card>
          ))}
        </div>

        <SHdr title="ריקולים" />
        <div style={{background:'#f3f4f6', border:'1px solid #d1d5db', borderRadius:8, padding:10,
          fontFamily:F, fontSize:14, color:MD, marginBottom:14}}> אין ריקולים פתוחים</div>

        <SHdr title="בטיחות" />
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <Card style={{flex:1, marginBottom:0, textAlign:'center', padding:10}}>
            <div style={{fontFamily:F, fontSize:22, fontWeight:700, color:MD}}>82</div>
            <div style={{fontFamily:F, fontSize:10, color:MD}}>ניקוד בטיחות</div>
          </Card>
          <Card style={{flex:1, marginBottom:0, textAlign:'center', padding:10}}>
            <div style={{fontFamily:F, fontSize:22, fontWeight:700}}>7</div>
            <div style={{fontFamily:F, fontSize:10, color:MD}}>כריות אוויר</div>
          </Card>
        </div>
        <div style={{display:'flex', flexWrap:'wrap', gap:5, marginBottom:14}}>
          {['ABS ','ESP ','סטייה ','מרחק ','רוורס ','חירום '].map(f=>(
            <span key={f} style={{background:'#f3f4f6', borderRadius:6, padding:'3px 8px', fontFamily:F, fontSize:12, color:MD}}>{f}</span>
          ))}
        </div>

        <SHdr title="פירוט ציון סיכון" />
        <div style={{display:'flex', justifyContent:'center', marginBottom:12}}>
          <div style={{position:'relative', width:90, height:90}}>
            <svg viewBox="0 0 100 100" width="90" height="90">
              <circle cx="50" cy="50" r="40" fill="none" stroke={BD} strokeWidth="12"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#9ca3af" strokeWidth="12"
                strokeDasharray={`${28*2.51} ${72*2.51}`} strokeDashoffset="62.8" strokeLinecap="round" transform="rotate(-90 50 50)"/>
            </svg>
            <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:F}}>
              <div style={{fontSize:20, fontWeight:700, color:DK}}>28</div>
              <div style={{fontSize:10, color:MD}}>נראה טוב</div>
            </div>
          </div>
        </div>
        {[['בעלויות',30],['גיל רכב',33],['טסט',0],['ק"מ',27],['ריקולים',0]].map(([l,pct])=>(
          <div key={l} style={{display:'flex', alignItems:'center', gap:8, marginBottom:7}}>
            <div style={{width:60, fontFamily:F, fontSize:12, color:MD, flexShrink:0}}>{l}</div>
            <div style={{flex:1, background:BD, borderRadius:4, height:7, overflow:'hidden'}}>
              <div style={{width:`${pct}%`, height:'100%', background:pct>50?RD:pct>25?YL:GN, borderRadius:4}} />
            </div>
          </div>
        ))}
        <div style={{height:20}} />
      </div>
    </Scroll>
  </Screen>
);

// ══════════════════════════════════════════
// ONBOARDING FLOW
// ══════════════════════════════════════════

const OBStep = ({step, children}) => (
  <Screen w={260}>
    <div style={{background:BL, padding:'10px 14px', flexShrink:0}}>
      <div style={{display:'flex', gap:3, marginBottom:6}}>
        {[1,2,3,4].map(n=>(
          <div key={n} style={{height:4, flex:1, borderRadius:2, background:n<=step?'#fff':'rgba(255,255,255,0.3)'}} />
        ))}
      </div>
      <div style={{fontFamily:F, fontSize:13, color:'rgba(255,255,255,0.8)'}}>שלב {step} מתוך 4</div>
    </div>
    <Scroll style={{padding:14}}>{children}</Scroll>
  </Screen>
);

const OnboardingA = () => (
  <div style={{display:'flex', gap:10}}>
    <OBStep step={1}>
      <div style={{fontFamily:F, fontSize:17, fontWeight:700, color:DK, marginBottom:3}}>צרו חשבון חינם</div>
      <div style={{fontFamily:F, fontSize:12, color:MD, marginBottom:14}}>כדי לשמור מועדפים ולנהל רכבים</div>
      <Btn label="G  המשך עם Google" full secondary style={{marginBottom:10, fontSize:13}} />
      <Sep />
      <Field ph="שם מלא" style={{marginBottom:7, fontSize:14}} />
      <Field ph="אימייל" icon="" style={{marginBottom:7, fontSize:14}} />
      <Field ph="סיסמה" icon="" style={{marginBottom:14, fontSize:14}} />
      <Btn label="צור חשבון" full />
      <div style={{fontFamily:F, fontSize:12, color:MD, textAlign:'center', marginTop:8}}>
        יש לך חשבון? <span style={{color:DK}}>התחבר</span>
      </div>
    </OBStep>

    <OBStep step={2}>
      <div style={{textAlign:'center', padding:'16px 0'}}>
        <div style={{fontSize:42, marginBottom:10}}></div>
        <div style={{fontFamily:F, fontSize:16, fontWeight:700, color:DK, marginBottom:6}}>בדקו את האימייל</div>
        <div style={{fontFamily:F, fontSize:12, color:MD, marginBottom:18}}>שלחנו קישור אימות<br/>ל-dana@gmail.com</div>
        <Btn label="פתח אימייל" full style={{marginBottom:7}} />
        <Btn label="שלח שוב" full secondary />
        <div style={{fontFamily:F, fontSize:11, color:MD, marginTop:14}}>לא קיבלתם? בדקו ספאם</div>
      </div>
    </OBStep>

    <OBStep step={3}>
      <div style={{textAlign:'center', padding:'6px 0 14px'}}>
        <div style={{fontSize:36}}></div>
        <div style={{fontFamily:F, fontSize:16, fontWeight:700, color:DK, marginBottom:3}}>ברוכים הבאים!</div>
        <div style={{fontFamily:F, fontSize:12, color:MD}}>הוסיפו את הרכב הראשון</div>
      </div>
      <Field ph="מספר רישוי" icon="" style={{marginBottom:7, fontSize:14}} />
      <Note>שולפים נתונים אוטומטית מ-data.gov.il</Note>
      <Field ph={'כינוי: "הרכב שלי"'} style={{marginBottom:7, fontSize:14}} />
      <Field ph="תאריך תום ביטוח" icon="" style={{marginBottom:14, fontSize:14}} />
      <Btn label="הוסף רכב " full style={{marginBottom:7}} />
      <Btn label="דלג לעכשיו" full ghost />
    </OBStep>

    <OBStep step={4}>
      <Alert text="הרכב נוסף בהצלחה!" type="success" />
      <div style={{marginTop:10}}>
        <div style={{fontFamily:F, fontSize:14, fontWeight:700, color:DK, marginBottom:8}}>הרכבים שלי</div>
        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:7}}>
            <div>
              <div style={{fontFamily:F, fontSize:14, fontWeight:700}}> טויוטה קורולה 2019</div>
              <div style={{fontFamily:F, fontSize:11, color:MD}}>1234567</div>
            </div>
          </div>
          <div style={{fontFamily:F, fontSize:12, color:MD}}> טסט: 28 יום</div>
          <div style={{fontFamily:F, fontSize:12, color:MD}}> ביטוח: 4 חודשים</div>
          <div style={{display:'flex', gap:5, marginTop:8}}>
            <Btn label="פרטים" sm secondary style={{flex:1}} />
            <Btn label="עדכן" sm ghost style={{flex:1}} />
          </div>
        </Card>
        <Btn label="+ הוסף רכב נוסף" full secondary />
      </div>
    </OBStep>
  </div>
);

const OnboardingB = () => (
  <div style={{display:'flex', gap:10}}>
    <OBStep step={1}>
      <div style={{textAlign:'center', paddingTop:6}}>
        <div style={{fontFamily:F, fontSize:20, fontWeight:700, color:DK, marginBottom:3}}>MyCarPortal</div>
        <div style={{fontFamily:F, fontSize:12, color:MD, marginBottom:16}}>בדק רכב · נהל רכב · חסוך כסף</div>
        <Img h={90} label="אילוסטרציה: רכב + נתונים" style={{marginBottom:18}} />
        <Btn label="G  הצטרפו עם Google" full style={{marginBottom:8}} />
        <Btn label=" הצטרפו עם אימייל" full secondary style={{marginBottom:14}} />
        <div style={{fontFamily:F, fontSize:12, color:MD}}>יש לכם חשבון? <span style={{color:DK}}>התחברו</span></div>
      </div>
    </OBStep>

    <OBStep step={2}>
      <div style={{textAlign:'center', padding:'8px 0'}}>
        <div style={{width:48, height:48, borderRadius:'50%', background:'#374151', color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
          margin:'0 auto 12px', fontFamily:F, fontWeight:700}}>G</div>
        <div style={{fontFamily:F, fontSize:15, fontWeight:700, color:DK, marginBottom:5}}>כניסה דרך Google</div>
        <div style={{fontFamily:F, fontSize:12, color:MD, marginBottom:14}}>נפתח חלון הרשאות של Google</div>
        <div style={{background:'#f3f4f6', border:'1px solid #d1d5db', borderRadius:10,
          padding:10, marginBottom:12, fontFamily:F, fontSize:12, textAlign:'right'}}>
          <div style={{color:DK, fontWeight:700, marginBottom:4}}> מה MyCarPortal רואה?</div>
          <div style={{color:MD}}> שם ואימייל בלבד</div>
          <div style={{color:DK}}> לא תמונה, לא אנשי קשר</div>
        </div>
        <Btn label="אשר גישה" full />
      </div>
    </OBStep>

    <OBStep step={3}>
      <div style={{fontFamily:F, fontSize:16, fontWeight:700, color:DK, marginBottom:3}}>שלום דנה </div>
      <div style={{fontFamily:F, fontSize:12, color:MD, marginBottom:14}}>שאלה אחת להתאמה אישית</div>
      <div style={{fontFamily:F, fontSize:13, color:DK, marginBottom:8}}>מה הסיבה העיקרית לשימוש?</div>
      {[{id:'buy',l:' מחפש/ת לקנות רכב'},{id:'own',l:' בעל/ת רכב, רוצה לנהל'},{id:'both',l:' שניהם'}].map(({id,l})=>(
        <div key={id} style={{background:LT, border:`1.5px solid ${BD}`, borderRadius:10,
          padding:'10px 12px', marginBottom:7, fontFamily:F, fontSize:13, color:DK}}>
          {l}
        </div>
      ))}
      <Btn label="המשך " full style={{marginTop:6}} />
    </OBStep>

    <OBStep step={4}>
      <div style={{fontFamily:F, fontSize:15, fontWeight:700, color:DK, marginBottom:3}}>הוסיפו רכב</div>
      <div style={{fontFamily:F, fontSize:12, color:MD, marginBottom:12}}>הקלידו מספר — נשלוף הכל אוטומטית</div>
      <div style={{background:DK, borderRadius:10, padding:'14px', marginBottom:10, textAlign:'center'}}>
        <div style={{fontFamily:F, fontSize:24, fontWeight:700, color:'#fff', letterSpacing:5}}>1234567</div>
        <div style={{fontFamily:F, fontSize:11, color:'rgba(255,255,255,0.5)'}}>לוחית רישוי</div>
      </div>
      <Btn label=" צלמו לוחית (OCR)" full secondary style={{marginBottom:7}} />
      <Note>Claude Vision מזהה מספר מתמונה</Note>
      <div style={{background:'#f3f4f6', borderRadius:8, padding:9, marginBottom:10, fontFamily:F}}>
        <div style={{fontSize:12, color:DK, fontWeight:700, marginBottom:2}}> נמצא!</div>
        <div style={{fontSize:13, color:DK}}>טויוטה COROLLA 2019</div>
        <div style={{fontSize:11, color:MD}}>לבן שנהב · בנזין · יד 3</div>
      </div>
      <Field ph={'כינוי (למשל: "הרכב שלי")'} style={{marginBottom:10, fontSize:13}} />
      <Btn label="שמור והתחל " full />
    </OBStep>
  </div>
);

// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════

const DashboardA = () => (
  <Screen>
    <NavBar title="הרכבים שלי" />
    <Scroll>
      <Alert text="טסט של קורולה פג בעוד 28 ימים — לחץ להוסיף לתזכורות" type="warn" />
      <div style={{padding:16}}>
        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
            <div>
              <div style={{fontFamily:F, fontSize:16, fontWeight:700}}> הרכב שלי</div>
              <div style={{fontFamily:F, fontSize:13, color:MD}}>טויוטה קורולה 2019</div>
            </div>
            <Img h={48} label="CGI" style={{width:68, borderRadius:8, border:'none', background:'#f5f5f5', flexShrink:0}} />
          </div>
          <div style={{display:'flex', gap:7, marginBottom:10, flexWrap:'wrap'}}>
            <div style={{background:'#e5e7eb', border:'1px solid #d1d5db', borderRadius:6, padding:'5px 9px', fontFamily:F, fontSize:12}}> טסט: 28 יום</div>
            <div style={{background:'#f3f4f6', border:'1px solid #d1d5db', borderRadius:6, padding:'5px 9px', fontFamily:F, fontSize:12}}> ביטוח: 120 יום</div>
          </div>
          <div style={{fontFamily:F, fontSize:13, color:MD, marginBottom:8}}>ק"מ אחרון: 87,400 · ציון:  28/100</div>
          <div style={{display:'flex', gap:6}}>
            <Btn label="פרטים" sm secondary style={{flex:1}} />
            <Btn label=" טיפולים" sm ghost style={{flex:1}} />
            <Btn label="" sm ghost />
          </div>
        </Card>

        <Btn label="+ הוסף רכב" full secondary />
        <Note>חינם: 1 רכב · פרמיום: עד 3 רכבים</Note>

        <SHdr title="פעולות מהירות" style={{marginTop:14}} />
        <div style={{display:'flex', gap:8}}>
          {[{ic:'',l:'חיפוש'},{ic:'⭐',l:'מועדפים'},{ic:'',l:'היסטוריה'}].map(({ic,l})=>(
            <Card key={l} style={{flex:1, marginBottom:0, textAlign:'center', padding:10}}>
              <div style={{fontSize:22}}>{ic}</div>
              <div style={{fontFamily:F, fontSize:12, marginTop:4}}>{l}</div>
            </Card>
          ))}
        </div>
      </div>
    </Scroll>
    <BotNav active="cars" />
  </Screen>
);

const DashboardB = () => (
  <Screen>
    <div style={{background:BL, padding:'14px 16px', flexShrink:0}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <div style={{fontFamily:F, fontSize:18, fontWeight:700, color:'#fff'}}>שלום, דנה </div>
        <div style={{width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.2)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}></div>
      </div>
      <div style={{display:'flex', gap:8}}>
        {[{v:'28',l:'ימים לטסט',w:true},{v:'120',l:'ימים לביטוח',w:false},{v:'87.4K',l:'ק"מ אחרון',w:false}].map(({v,l,w})=>(
          <div key={l} style={{flex:1, background:'rgba(255,255,255,0.15)', borderRadius:10, padding:'9px 6px', textAlign:'center', fontFamily:F}}>
            <div style={{fontSize:18, fontWeight:700, color:w?'#fde68a':'#fff'}}>{v}</div>
            <div style={{fontSize:10, color:'rgba(255,255,255,0.7)'}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
    <Scroll style={{padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <div style={{fontFamily:F, fontSize:15, fontWeight:700}}>הרכבים שלי</div>
        <Btn label="+ הוסף" sm secondary />
      </div>
      <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:14, overflow:'hidden', marginBottom:12}}>
        <Img h={95} label="Toyota Corolla 2019" style={{borderRadius:0, border:'none'}} />
        <div style={{padding:12}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
            <div style={{fontFamily:F, fontSize:14, fontWeight:700}}>הרכב שלי — קורולה</div>
            <RiskBadge score={28} level="good" />
          </div>
          <div style={{display:'flex', gap:6, marginBottom:8}}>
            <div style={{background:'#e5e7eb', borderRadius:6, padding:'4px 7px', fontFamily:F, fontSize:11}}> טסט ב-28 יום</div>
            <div style={{background:'#f3f4f6', borderRadius:6, padding:'4px 7px', fontFamily:F, fontSize:11}}> ביטוח 120 יום</div>
          </div>
          <div style={{display:'flex', gap:6}}>
            <Btn label="פרטים מלאים" sm secondary style={{flex:1}} />
            <Btn label="" sm ghost />
            <Btn label="" sm ghost />
          </div>
        </div>
      </div>
      <SHdr title="תזכורות קרובות" />
      {[{ic:'',t:'טסט שנתי — קורולה',d:'28 יום',c:YL},{ic:'',t:'ביטוח — קורולה',d:'120 יום',c:GN}].map(({ic,t,d,c})=>(
        <Card key={t} style={{padding:'9px 12px', marginBottom:7}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:F}}>
            <span style={{fontSize:14}}>{ic} {t}</span>
            <span style={{fontSize:13, color:c, fontWeight:700}}>{d}</span>
          </div>
        </Card>
      ))}
    </Scroll>
    <BotNav active="cars" />
  </Screen>
);

// ══════════════════════════════════════════
// VEHICLE DETAIL
// ══════════════════════════════════════════

const VehicleDetailA = () => (
  <Screen>
    <NavBar title="קורולה 2019" actions={['']} />
    <Img h={120} label="Toyota Corolla CGI" style={{borderRadius:0, border:'none', flexShrink:0}} />
    <div style={{display:'flex', borderBottom:`1px solid ${BD}`, background:'#fff', flexShrink:0}}>
      {['כללי','טיפולים','מסמכים','תזכורות'].map((tab,i)=>(
        <div key={tab} style={{flex:1, padding:'9px 4px', textAlign:'center', fontFamily:F, fontSize:13,
          borderBottom:i===1?`2.5px solid ${BL}`:'2.5px solid transparent',
          color:i===1?BL:MD}}>
          {tab}
        </div>
      ))}
    </div>
    <Scroll style={{padding:14}}>
      <Note>Tab פעיל: טיפולים</Note>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <div style={{fontFamily:F, fontSize:14, fontWeight:700}}>היסטוריית טיפולים</div>
        <Btn label="+ הוסף" sm secondary />
      </div>
      {[{d:'03/2026',ic:'',t:'החלפת שמן + פילטר',p:'מוסך טויוטה הרצליה',km:'87,400',cost:'₪350'},
        {d:'08/2025',ic:'',t:'החלפת בלמים קדמיים',p:'מוסך מקס ת"א',km:'82,100',cost:'₪1,200'},
        {d:'01/2025',ic:'',t:'טסט שנתי — עבר ',p:'מכון טסט ממשלתי',km:'80,200',cost:'—'},
        {d:'07/2023',ic:'',t:'העברת בעלות (ממשלתי)',p:'',km:'',cost:''}].map(({d,ic,t,p,km,cost})=>(
        <div key={d} style={{display:'flex', gap:10, marginBottom:12, fontFamily:F, alignItems:'flex-start'}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
            <div style={{width:30, height:30, borderRadius:'50%', background:LT, border:`1.5px solid ${BD}`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0}}>{ic}</div>
            <div style={{width:1, height:24, background:BD}} />
          </div>
          <div style={{flex:1, background:'#fff', border:`1px solid ${BD}`, borderRadius:10, padding:'8px 11px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:3}}>
              <span style={{fontWeight:600, fontSize:13, color:DK}}>{t}</span>
              <span style={{fontSize:11, color:MD}}>{d}</span>
            </div>
            {p && <div style={{fontSize:12, color:MD}}>{p}</div>}
            {km && <div style={{display:'flex', justifyContent:'space-between', marginTop:3, fontSize:12, color:MD}}>
              <span>{km} ק"מ</span><span style={{color:DK, fontWeight:600}}>{cost}</span>
            </div>}
          </div>
        </div>
      ))}
      <Note> שילוב היסטוריית טיפולים ידנית + נתוני בעלויות ממשלתיים</Note>
      <div style={{background:'#f3f4f6', border:'1px solid #d1d5db', borderRadius:10, padding:12, marginTop:6}}>
        <div style={{fontFamily:F, fontSize:13, fontWeight:700, color:DK, marginBottom:3}}>רוצים למכור?</div>
        <div style={{fontFamily:F, fontSize:12, color:MD, marginBottom:8}}>צרו מודעה אוטומטית מהנתונים</div>
        <Btn label=" צור מודעת מכירה" full secondary />
      </div>
    </Scroll>
    <BotNav active="cars" />
  </Screen>
);

const VehicleDetailB = () => (
  <Screen>
    <NavBar title="קורולה 2019" actions={['']} />
    <div style={{padding:'9px 14px', background:'#fff', borderBottom:`1px solid ${BD}`, flexShrink:0}}>
      <div style={{fontFamily:F, fontSize:14, fontWeight:700, marginBottom:3}}> הרכב שלי — קורולה</div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <span style={{fontFamily:F, fontSize:12, color:MD}}> טסט: 28 יום</span>
        <span style={{fontFamily:F, fontSize:12, color:MD}}> ביטוח: 4 חודשים</span>
        <span style={{fontFamily:F, fontSize:12, color:DK}}> ציון: 28</span>
      </div>
    </div>
    <div style={{display:'flex', gap:4, padding:'8px 10px', background:'#fff', borderBottom:`1px solid ${BD}`, flexShrink:0, overflowX:'auto'}}>
      {[{l:' מסמכים',a:true},{l:' טיפולים'},{l:' תזכורות'},{l:' כללי'}].map(({l,a})=>(
        <div key={l} style={{padding:'6px 10px', borderRadius:8, fontFamily:F, fontSize:12, flexShrink:0,
          background:a?BL:LT, color:a?'#fff':MD, whiteSpace:'nowrap'}}>{l}</div>
      ))}
    </div>
    <Scroll style={{padding:14}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <div style={{fontFamily:F, fontSize:14, fontWeight:700}}>מסמכי הרכב</div>
        <Btn label="+ העלה" sm secondary />
      </div>
      <Note>חינם: עד 5 מסמכים · פרמיום: ללא הגבלה</Note>
      {[{t:'רישיון רכב',d:'12/2025',ic:'',s:'1.2MB'},{t:'ביטוח — מגדל',d:'06/2026',ic:'',s:'0.8MB'},{t:'גליון טסט',d:'01/2026',ic:'',s:'0.5MB'}].map(({t,d,ic,s})=>(
        <div key={t} style={{display:'flex', gap:9, padding:'9px 11px', background:LT,
          border:`1px solid ${BD}`, borderRadius:10, marginBottom:7, alignItems:'center'}}>
          <div style={{width:34, height:34, borderRadius:8, background:'#fff', border:`1px solid ${BD}`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0}}>{ic}</div>
          <div style={{flex:1, fontFamily:F}}>
            <div style={{fontSize:13, fontWeight:600}}>{t}</div>
            <div style={{fontSize:11, color:MD}}>{d} · {s}</div>
          </div>
          <span style={{fontSize:16, cursor:'pointer'}}></span>
          <span style={{fontSize:16, cursor:'pointer'}}></span>
        </div>
      ))}
      <div style={{border:'2px dashed #bbb', borderRadius:10, padding:14, textAlign:'center', fontFamily:F, marginTop:6}}>
        <div style={{fontSize:24, marginBottom:4}}></div>
        <div style={{fontSize:14, color:MD}}>גרירה או בחירת קובץ</div>
        <div style={{fontSize:12, color:'#bbb'}}>JPG, PNG, PDF · מקס 10MB</div>
      </div>
    </Scroll>
    <BotNav active="cars" />
  </Screen>
);

// ══════════════════════════════════════════
// FAVORITES
// ══════════════════════════════════════════

const FavoritesA = () => (
  <Screen>
    <NavBar title="מועדפים" />
    <Scroll style={{padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <div style={{fontFamily:F, fontSize:13, color:MD}}>3 / 5 שמורים (חינם)</div>
        <Btn label=" השווה" sm secondary />
      </div>
      {[{p:'1234567',m:'טויוטה קורולה 2019',s:28,l:'good'},{p:'9876543',m:'מזדה 3 2021',s:45,l:'warn'},{p:'5551234',m:'הונדה סיוויק 2018',s:70,l:'bad'}].map(({p,m,s,l})=>(
        <Card key={p}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
            <div>
              <div style={{fontFamily:F, fontSize:14, fontWeight:700}}>{m}</div>
              <div style={{fontFamily:F, fontSize:12, color:MD}}>{p}</div>
            </div>
            <RiskBadge score={s} level={l} />
          </div>
          <Field ph={'הוסף הערה... ("ראיתי ביד2, מחיר 85K")'} style={{marginBottom:8, fontSize:12}} />
          <div style={{display:'flex', gap:6}}>
            <Btn label="פרטים" sm secondary style={{flex:1}} />
            <Btn label="" sm ghost />
          </div>
        </Card>
      ))}
      <Note>פרמיום: ללא הגבלת מועדפים + השוואת 4 רכבים</Note>
    </Scroll>
    <BotNav active="fav" />
  </Screen>
);

const FavoritesB = () => (
  <Screen>
    <NavBar title="השוואת רכבים" actions={['']} />
    <Note style={{margin:'8px 16px 0'}}>גלילה אופקית · ירוק = הערך הטוב ביותר</Note>
    <Scroll style={{overflowX:'auto'}}>
      {[
        {f:'—', vals:['קורולה 19','מזדה 3 21','סיוויק 18'], isHeader:true},
        {f:'ציון סיכון', vals:['28 ','45 ','70 '], good:0},
        {f:'שנה', vals:['2019','2021','2018'], good:1},
        {f:'בעלים', vals:['3','2','5'], good:1},
        {f:'ק"מ', vals:['87K','45K','120K'], good:1},
        {f:'טסט', vals:['351 יום','280 יום','פג! '], good:0},
        {f:'שינוי מבנה', vals:['לא ','לא ','כן '], good:0},
        {f:'כוח', vals:['140 כ"ס','160 כ"ס','150 כ"ס'], good:1},
      ].map(({f,vals,good,isHeader})=>(
        <div key={f} style={{display:'flex', minWidth:390, borderBottom:`1px solid ${BD}`}}>
          <div style={{width:90, flexShrink:0, padding:'8px 10px', fontFamily:F, fontSize:12,
            color:isHeader?DK:MD, fontWeight:isHeader?700:400, borderLeft:`1px solid ${BD}`,
            background:isHeader?LT:'#fff'}}>{isHeader?'':f}</div>
          {vals.map((v,ci)=>(
            <div key={ci} style={{flex:1, minWidth:88, padding:'8px 6px', textAlign:'center',
              fontFamily:F, fontSize:isHeader?13:12, fontWeight:isHeader?700:good===ci?700:400,
              color:isHeader?DK:good===ci?GN:DK,
              background:isHeader?LT:good===ci?'#f0fdf4':ci===0?'#f8faff':'#fff',
              borderLeft:`1px solid ${BD}`}}>{v}</div>
          ))}
        </div>
      ))}
    </Scroll>
    <BotNav active="fav" />
  </Screen>
);

// ══════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════

const LoginScreen = () => (
  <Screen>
    <div style={{padding:'28px 22px', flex:1, display:'flex', flexDirection:'column'}}>
      <div style={{fontFamily:F, fontSize:26, fontWeight:700, color:DK, textAlign:'center', marginBottom:4}}>MyCarPortal</div>
      <div style={{fontFamily:F, fontSize:14, color:MD, textAlign:'center', marginBottom:26}}>התחברו לחשבון שלכם</div>
      <Btn label="G  המשך עם Google" full secondary style={{marginBottom:12}} />
      <Sep />
      <Field ph="אימייל" icon="" style={{marginBottom:8}} />
      <Field ph="סיסמה" icon="" style={{marginBottom:5}} />
      <div style={{textAlign:'left', marginBottom:16}}>
        <span style={{fontFamily:F, fontSize:13, color:DK}}>שכחתם סיסמה?</span>
      </div>
      <Btn label="התחבר" full style={{marginBottom:12}} />
      <div style={{fontFamily:F, fontSize:13, color:MD, textAlign:'center'}}>
        אין לכם חשבון? <span style={{color:DK}}>הירשמו חינם</span>
      </div>
    </div>
  </Screen>
);

const RegisterScreen = () => (
  <Screen>
    <div style={{padding:'22px 22px', flex:1, display:'flex', flexDirection:'column'}}>
      <div style={{fontFamily:F, fontSize:22, fontWeight:700, color:DK, textAlign:'center', marginBottom:3}}>צרו חשבון חינם</div>
      <div style={{fontFamily:F, fontSize:13, color:MD, textAlign:'center', marginBottom:20}}>כדי לשמור מועדפים ולנהל רכבים</div>
      <Btn label="G  הצטרפו עם Google" full secondary style={{marginBottom:10}} />
      <Sep />
      <Field ph="שם מלא" style={{marginBottom:8}} />
      <Field ph="אימייל" icon="" style={{marginBottom:8}} />
      <Field ph="סיסמה (לפחות 8 תווים)" icon="" style={{marginBottom:16}} />
      <Btn label="צור חשבון" full style={{marginBottom:10}} />
      <div style={{fontFamily:F, fontSize:12, color:MD, textAlign:'center'}}>
        בלחיצה על "צור חשבון" אתם מסכימים ל<span style={{color:DK}}>תנאי השימוש</span>
      </div>
      <div style={{fontFamily:F, fontSize:13, color:MD, textAlign:'center', marginTop:12}}>
        יש לכם חשבון? <span style={{color:DK}}>התחברו</span>
      </div>
    </div>
  </Screen>
);

// ══════════════════════════════════════════
// SALE AD GENERATOR
// ══════════════════════════════════════════

const SaleAdForm = () => (
  <Screen>
    <NavBar title="מודעת מכירה" actions={['']} />
    <Scroll style={{padding:16}}>
      <div style={{fontFamily:F, fontSize:15, fontWeight:700, marginBottom:10}}> צרו מודעה אוטומטית</div>
      <Card>
        <div style={{fontFamily:F, fontSize:13, color:MD, marginBottom:6}}>נתוני הרכב (אוטומטי מה-API)</div>
        {[['יצרן ודגם','טויוטה COROLLA 2019'],['ק"מ','87,400'],['טסט','בתוקף עד 01/2027 '],['ריקולים','אין '],['ציון סיכון','28/100 ']].map(([l,v])=>(
          <Row key={l} label={l} val={v} />
        ))}
      </Card>
      <div style={{marginBottom:12}}>
        <div style={{fontFamily:F, fontSize:14, fontWeight:700, marginBottom:8}}>מה אתם מוסיפים:</div>
        <Field ph="מחיר מבוקש (₪)" icon="" style={{marginBottom:8}} />
        <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:8, padding:12,
          fontFamily:F, fontSize:14, color:'#aaa', minHeight:70, marginBottom:8}}>
          הערות חופשיות — "יד שנייה מליסינג, רכב שמור"
        </div>
        <Field ph="טלפון ליצירת קשר (אופציונלי)" icon="" style={{marginBottom:8}} />
        <div style={{border:'2px dashed #bbb', borderRadius:8, padding:14, textAlign:'center', fontFamily:F}}>
          <div style={{fontSize:22, marginBottom:4}}></div>
          <div style={{fontSize:14, color:MD}}>תמונת רכב (פרמיום)</div>
          <div style={{fontSize:12, color:'#bbb'}}>JPG/PNG · מקס 5MB</div>
        </div>
      </div>
      <Btn label=" תצוגה מקדימה" full style={{marginBottom:8}} />
    </Scroll>
    <BotNav active="cars" />
  </Screen>
);

const SaleAdPreview = () => (
  <Screen>
    <NavBar title="תצוגה מקדימה" actions={['']} />
    <Scroll style={{padding:16}}>
      <div style={{background:LT, border:`1.5px solid ${BD}`, borderRadius:12, padding:14, marginBottom:12}}>
        <div style={{fontFamily:F, fontSize:14, fontWeight:700, color:DK, marginBottom:8}}>המודעה שלכם:</div>
        <div style={{fontFamily:F, fontSize:12, color:DK, lineHeight:1.8, background:'#fff',
          padding:12, borderRadius:8, border:`1px solid ${BD}`, whiteSpace:'pre-wrap'}}>
{` למכירה — טויוטה COROLLA 2019

 פרטי הרכב:
• שנת ייצור: 2019 | צבע: לבן שנהב
• דלק: בנזין | הנעה: קדמית, אוטומטית
• נפח מנוע: 1,798 סמ"ק | 140 כ"ס

 מצב הרכב:
• ק"מ: 87,400
• טסט בתוקף עד: 01/2027 
• 3 בעלים | ללא שינוי מבנה 
• ללא ריקולים פתוחים 

 טיפולים אחרונים:
• 03/2026 — החלפת שמן (₪350)
• 08/2025 — החלפת בלמים (₪1,200)

 מחיר: ₪95,000
 יד שנייה מליסינג, רכב שמור

 mycarportal.co.il/search/1234567`}
        </div>
      </div>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <Btn label=" העתק טקסט" full secondary style={{flex:1}} />
        <Btn label=" WhatsApp" full style={{flex:1, background:'#374151'}} />
      </div>
      <Btn label=" שמור מודעה" full secondary />
      <Note>חינם: טקסט בלבד · פרמיום: עם תמונות + שמירה ב-DB</Note>
    </Scroll>
    <BotNav active="cars" />
  </Screen>
);

// ══════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════

const SettingsScreen = () => (
  <Screen>
    <NavBar title="הגדרות" />
    <Scroll style={{padding:16}}>
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
        <div style={{width:50, height:50, borderRadius:'50%', background:LT, border:`2px solid ${BD}`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}></div>
        <div>
          <div style={{fontFamily:F, fontSize:16, fontWeight:700}}>דנה כהן</div>
          <div style={{fontFamily:F, fontSize:13, color:MD}}>dana@gmail.com</div>
        </div>
        <Btn label="ערוך" sm secondary style={{marginRight:'auto'}} />
      </div>
      <Card style={{background:'#f3f4f6', border:'1.5px solid #d1d5db', marginBottom:14}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontFamily:F, fontSize:14, fontWeight:700, color:DK}}>תוכנית: חינם</div>
            <div style={{fontFamily:F, fontSize:12, color:MD}}>1 רכב · 5 מועדפים · אימייל בלבד</div>
          </div>
          <Btn label="שדרג ₪9.90" sm style={{fontSize:12}} />
        </div>
      </Card>
      <SHdr title="התראות" />
      {[{l:'תזכורת טסט (30 יום לפני)',on:true},{l:'תזכורת ביטוח',on:true},{l:'Push Notifications',on:false,locked:true}].map(({l,on,locked})=>(
        <div key={l} style={{display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'10px 0', borderBottom:`1px solid ${BD}`, fontFamily:F}}>
          <div>
            <span style={{fontSize:14, color:locked?MD:DK}}>{l}</span>
            {locked && <span style={{fontSize:11, color:DK, marginRight:5}}>(פרמיום)</span>}
          </div>
          <div style={{width:38, height:21, background:on&&!locked?BL:BD, borderRadius:11, position:'relative', flexShrink:0}}>
            <div style={{width:17, height:17, background:'#fff', borderRadius:'50%', position:'absolute',
              top:2, ...(on&&!locked?{left:18}:{left:2})}} />
          </div>
        </div>
      ))}
      <SHdr title="כללי" style={{marginTop:14}} />
      {['היסטוריית חיפושים','מדיניות פרטיות','תנאי שימוש','פנייה לתמיכה','התנתק'].map(item=>(
        <div key={item} style={{display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'11px 0', borderBottom:`1px solid ${BD}`, fontFamily:F,
          color:item==='התנתק'?RD:DK, fontSize:15}}>
          <span>{item}</span><span style={{color:MD}}>›</span>
        </div>
      ))}
      <div style={{height:20}} />
    </Scroll>
    <BotNav active="set" />
  </Screen>
);

// ══════════════════════════════════════════
// DESKTOP LANDING
// ══════════════════════════════════════════

const DesktopLandingA = () => (
  <div style={{width:1280, background:'#fff', fontFamily:F}}>
    <div style={{background:'#fff', borderBottom:`1px solid ${BD}`, padding:'13px 48px',
      display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div style={{fontSize:22, fontWeight:700, color:DK}}>MyCarPortal</div>
      <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:8, padding:'8px 18px',
        display:'flex', alignItems:'center', gap:8, width:300, color:'#aaa', fontSize:15}}>
        <span></span><span>מספר רישוי...</span>
      </div>
      <div style={{display:'flex', gap:10}}>
        <Btn label="התחבר" secondary sm />
        <Btn label="הירשם חינם" sm />
      </div>
    </div>
    <div style={{background:'#f3f4f6', padding:'56px 48px',
      display:'flex', gap:48, alignItems:'center'}}>
      <div style={{flex:1}}>
        <div style={{fontSize:36, fontWeight:700, color:DK, lineHeight:1.2, marginBottom:12}}>
          בדוק כל רכב בישראל<br/>תוך שניות
        </div>
        <div style={{fontSize:16, color:MD, marginBottom:26}}>מידע רשמי ממשרד התחבורה, דירוג סיכון, חינם לחלוטין</div>
        <div style={{background:'#fff', border:`1.5px solid ${BD}`, borderRadius:12, padding:'12px 16px',
          display:'flex', alignItems:'center', gap:10, marginBottom:14, maxWidth:440}}>
          <span style={{fontSize:22}}></span>
          <span style={{fontSize:16, color:'#aaa', flex:1}}>הקלד מספר רישוי (7-8 ספרות)...</span>
          <span style={{fontSize:20}}></span>
          <Btn label="חפש" style={{padding:'9px 20px', fontSize:14}} />
        </div>
        <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
          {[' חינם ללא הרשמה',' מידע רשמי',' תוצאה תוך שניות'].map(t=>(
            <span key={t} style={{background:'rgba(255,255,255,0.7)', borderRadius:20, padding:'4px 12px', fontSize:14, color:DK}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{flex:1}}>
        <Img h={260} label="Screenshot תוצאות חיפוש" />
      </div>
    </div>
    <div style={{display:'flex', borderBottom:`1px solid ${BD}`}}>
      {[['','דירוג סיכון','ציון 0–100 מ-8 פרמטרים'],['','היסטוריית בעלויות','Timeline מ-2017'],
        ['','ריקולים פתוחים','מאגר משרד התחבורה'],['','מפרט בטיחות','ADAS, כריות אוויר']].map(([ic,t,d])=>(
        <div key={t} style={{flex:1, padding:'26px 22px', borderLeft:`1px solid ${BD}`, textAlign:'center'}}>
          <div style={{fontSize:30, marginBottom:8}}>{ic}</div>
          <div style={{fontSize:16, fontWeight:700, color:DK, marginBottom:5}}>{t}</div>
          <div style={{fontSize:13, color:MD}}>{d}</div>
        </div>
      ))}
    </div>
    <div style={{display:'flex', gap:0, padding:'36px 48px', alignItems:'center', borderBottom:`1px solid ${BD}`}}>
      <div style={{flex:1, paddingLeft:40}}>
        <div style={{fontSize:28, fontWeight:700, color:DK, marginBottom:10}}>ניהול רכב אישי</div>
        <div style={{fontSize:14, color:MD, marginBottom:14, maxWidth:400}}>תזכורות טסט וביטוח, מסמכים דיגיטליים, היסטוריית טיפולים, מודעת מכירה אוטומטית</div>
        {[' תזכורות אוטומטיות לטסט וביטוח',' אחסון מסמכים דיגיטלי',' היסטוריית טיפולים + עלויות',' מודעת מכירה בלחיצה אחת'].map(f=>(
          <div key={f} style={{fontSize:14, color:DK, marginBottom:6}}>{f}</div>
        ))}
        <Btn label="הירשם חינם " style={{marginTop:12}} />
      </div>
      <div style={{flex:1}}>
        <Img h={220} label="Dashboard Screenshot" />
      </div>
    </div>
    <div style={{padding:'32px 48px', display:'flex', gap:24}}>
      <Card style={{flex:1}}>
        <div style={{fontSize:18, fontWeight:700, marginBottom:10}}>חינם</div>
        {['חיפוש ללא הגבלה','1 רכב לניהול','5 מועדפים','היסטוריית 20 חיפושים','תזכורות אימייל'].map(f=>(
          <div key={f} style={{fontSize:13, color:MD, marginBottom:5}}> {f}</div>
        ))}
      </Card>
      <Card style={{flex:1, border:`1.5px solid ${BD}`}}>
        <div style={{fontSize:18, fontWeight:700, color:DK, marginBottom:2}}>פרמיום</div>
        <div style={{fontSize:13, color:MD, marginBottom:10}}>₪9.90 / חודש</div>
        {['עד 3 רכבים לניהול','מועדפים ללא הגבלה','Push notifications','הפקת PDF','ללא פרסומות','השוואת 4 רכבים'].map(f=>(
          <div key={f} style={{fontSize:13, color:DK, marginBottom:5}}> {f}</div>
        ))}
        <Btn label="שדרגו עכשיו" full style={{marginTop:10}} />
      </Card>
    </div>
  </div>
);

const DesktopLandingB = () => (
  <div style={{width:1280, background:'#fff', fontFamily:F}}>
    <div style={{background:DK, padding:'13px 48px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div style={{fontSize:22, fontWeight:700, color:'#fff'}}>MyCarPortal</div>
      <div style={{background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)',
        borderRadius:10, padding:'9px 18px', display:'flex', alignItems:'center', gap:10, width:380, color:'rgba(255,255,255,0.5)', fontSize:14}}>
        <span></span><span>הקלד מספר רישוי לבדיקה...</span>
        <Btn label="חפש" sm style={{marginRight:'auto', padding:'6px 16px', background:BL}} />
      </div>
      <div style={{display:'flex', gap:8}}>
        <Btn label="התחבר" sm style={{background:'transparent', border:'1px solid rgba(255,255,255,0.3)', color:'#fff'}} />
        <Btn label="הירשם" sm style={{background:BL}} />
      </div>
    </div>
    <div style={{padding:'70px 48px', textAlign:'center', borderBottom:`1px solid ${BD}`}}>
      <div style={{fontSize:40, fontWeight:700, color:DK, marginBottom:10}}>בדוק כל רכב, תוך שניות</div>
      <div style={{fontSize:16, color:MD, marginBottom:28, maxWidth:560, margin:'0 auto 28px'}}>
        דירוג סיכון, היסטוריית בעלויות, ריקולים — הכל ממשרד התחבורה, חינם ללא הרשמה
      </div>
      <div style={{background:LT, border:`2px solid ${BD}`, borderRadius:16, padding:'18px 22px',
        maxWidth:540, margin:'0 auto', display:'flex', gap:12, alignItems:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
        <span style={{fontSize:22}}></span>
        <span style={{flex:1, fontSize:17, color:'#aaa'}}>הקלד מספר רישוי...</span>
        <span style={{fontSize:20}}></span>
        <Btn label="חפש " style={{fontSize:15, padding:'11px 26px'}} />
      </div>
    </div>
    <div style={{padding:'30px 48px'}}>
      <div style={{fontSize:17, fontWeight:700, color:DK, marginBottom:16}}>דוגמאות — ראו איך זה נראה:</div>
      <div style={{display:'flex', gap:16}}>
        {[{m:'טויוטה קורולה 2019',s:28,l:'good'},{m:'מזדה 3 2021',s:45,l:'warn'},{m:'הונדה סיוויק 2018',s:70,l:'bad'}].map(({m,s,l})=>(
          <div key={m} style={{flex:1, background:'#fff', border:`1.5px solid ${BD}`, borderRadius:12, overflow:'hidden'}}>
            <Img h={80} label={m} style={{borderRadius:0, border:'none'}} />
            <div style={{padding:12}}>
              <div style={{fontSize:14, fontWeight:700, marginBottom:6}}>{m}</div>
              <RiskBadge score={s} level={l} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Export all screens to window
Object.assign(window, {
  LandingA, LandingB, SearchA, SearchB,
  OBStep, OnboardingA, OnboardingB,
  DashboardA, DashboardB,
  VehicleDetailA, VehicleDetailB,
  FavoritesA, FavoritesB,
  LoginScreen, RegisterScreen,
  SaleAdForm, SaleAdPreview,
  SettingsScreen,
  DesktopLandingA, DesktopLandingB,
});
