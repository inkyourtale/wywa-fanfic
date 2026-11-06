/* Small app previews; keep weather explicitly labelled as sample data. */
const widgetEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function homeWidgetEvent(now=new Date()){
  const today=calendarKey(now),events=calendarEventsFor(today);
  if(events.length)return {...events[0],date:today,isToday:true};
  return [...calendarRequested.filter(e=>e.date&&!e.pending),...calendarEvents].filter(e=>e.date>today).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''))[0]||null;
}
function homeWidgetNote(){const all=notesAll();return all.find(n=>notesLocal.pinned.includes(n.id))||all.find(n=>n.id==='later-1')||all[0];}
function homeWidgetOpen(app,button){
  if(app==='notes'){notesUI.collection='all';notesUI.query='';}
  if(app==='calendar'){
    const now=new Date(),event=homeWidgetEvent(now),date=calendarParse(event?.date||calendarKey(now));
    calendarUI.selected=calendarKey(date);calendarUI.year=date.getFullYear();calendarUI.month=date.getMonth();
  }
  openApp(app,button);
  if(app==='notes'){const note=homeWidgetNote();if(note)go(()=>notesReader(note.id));}
}
function homeWidgetsMarkup(now=new Date()){
  const event=homeWidgetEvent(now),mode=weatherUI.day>=0?weatherWeek[weatherUI.day].mode:weatherUI.mode,w=weatherScenarios[mode],note=homeWidgetNote();
  const eventLabel=event?(event.isToday?'Today':calendarParse(event.date).toLocaleDateString(undefined,{month:'short',day:'numeric'}))+' · '+calendarTimeLabel(event.time):'Make room for something good';
  return `<button class="home-widget home-widget-calendar" aria-label="Open calendar${event?', '+widgetEscape(event.title):''}" onclick="homeWidgetOpen('calendar',this)"><span class="home-widget-label">${widgetEscape(now.toLocaleDateString(undefined,{weekday:'long'}))}</span><span class="home-widget-date">${now.getDate()}</span><span class="home-widget-event"><b>${event?widgetEscape(event.title):'No upcoming plans'}</b><small>${widgetEscape(eventLabel)}</small></span></button><button class="home-widget home-widget-weather ${mode}" aria-label="Open weather, ${w.name}, sample data" onclick="homeWidgetOpen('weather',this)"><span class="home-widget-label">Lindenwell</span><span class="home-widget-weather-symbol" aria-hidden="true">${w.icon}</span><span class="home-widget-temperature">${weatherTemp(w.temp)}</span><span class="home-widget-weather-description">${w.name}</span><span class="home-widget-weather-range">H:${weatherTemp(w.high)} &nbsp; L:${weatherTemp(w.low)}</span><span class="home-widget-sample">SAMPLE</span></button><button class="home-widget home-widget-note" aria-label="Open featured note" onclick="homeWidgetOpen('notes',this)"><span class="home-widget-label">${note&&notesLocal.pinned.includes(note.id)?'Pinned note':'From your notes'}</span><b>${widgetEscape(note?.title||'A fresh page')}</b><p>${widgetEscape(note?.body.split('\n').find(line=>line.trim())||'Keep a thought for later.')}</p></button>`;
}
function homeWidgetsUpdate(){const mount=document.querySelector('.home-widgets');if(mount)mount.innerHTML=homeWidgetsMarkup();}
const homeLayout=document.createElement('div');homeLayout.className='home-layout';
const homeWidgetMount=document.createElement('section');homeWidgetMount.className='home-widgets';homeWidgetMount.setAttribute('aria-label','Home screen widgets');
homeLayout.appendChild(homeWidgetMount);homeLayout.appendChild(H.querySelector('.gr'));H.appendChild(homeLayout);homeWidgetsUpdate();
new MutationObserver(()=>{if(!A.classList.contains('on'))homeWidgetsUpdate();}).observe(A,{attributes:true,attributeFilter:['class']});
setInterval(homeWidgetsUpdate,60000);
window.addEventListener('focus',homeWidgetsUpdate);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)homeWidgetsUpdate();});
