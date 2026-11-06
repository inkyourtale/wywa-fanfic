/* Date and timezone use the visitor's device settings; no location permission needed. */
function calendarKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function calendarParse(key){const [year,month,day]=key.split('-').map(Number);return new Date(year,month-1,day,12);}
const calendarNow=new Date();
const calendarUI={year:calendarNow.getFullYear(),month:calendarNow.getMonth(),selected:calendarKey(calendarNow)};
let calendarEvents=[];
try{const saved=JSON.parse(localStorage.getItem('calendar-events')||'[]');if(Array.isArray(saved))calendarEvents=saved.filter(e=>e&&typeof e.id==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(e.date)&&typeof e.title==='string'&&typeof e.time==='string'&&typeof e.notes==='string');}catch{}
const calendarEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const calendarRequested = [
  {id:'request-dinner',date:'2026-11-06',title:'Dinner with Seungwan',time:'19:00',notes:'Riverside Hotel',seed:true},
  {id:'request-missing',date:'2026-07-21',title:"He's missing",time:'',notes:'',seed:true},
  ...Array.from({length:8},(_,i)=>({id:'request-night-'+(i+1),date:`2026-10-${12+i}`,title:'Working night shift',time:'Night shift',notes:`Night ${i+1} of 8 · 12–19 October`,seed:true})),
  {id:'request-house',date:'2026-11-07',title:'House viewing',time:'11:00',notes:'Saturday house viewing',seed:true},
];
function calendarPendingRequests(){return calendarRequested.filter(e=>e.pending&&!calendarEvents.some(event=>event.requestId===e.id));}
function calendarTimeLabel(time){if(!/^\d{2}:\d{2}$/.test(time))return time||'All day';const [h,m]=time.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}`;}
function calendarAllEvents(){
  const year=calendarUI.year,original=[];
  for(const key of Object.keys(EV)){
    const [month,day]=key.split('-').map(Number);
    for(const [i,e] of EV[key].entries())original.push({id:'original-'+key+'-'+i,date:calendarKey(new Date(/birthday/i.test(e[0])?year:2024,month,day,12)),title:e[0],time:e[1]==='All day'?'':e[1],notes:/birthday/i.test(e[0])?'Birthday · repeats yearly':'Original calendar event',seed:true});
  }
  return [...original,...calendarRequested.filter(e=>!e.pending),...calendarEvents,...calendarPendingRequests()].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||(a.time||'').localeCompare(b.time||''));
}
function calendarEventList(){const events=calendarAllEvents();return `<section class="calendar-all-events"><div class="calendar-agenda-heading"><h2>All events</h2><span>${events.length} events</span></div>${events.map(e=>`<article class="calendar-event"><div class="calendar-event-date">${e.date?`<button onclick="calendarSelect('${e.date}')" aria-label="Show event date">${calendarEscape(calendarParse(e.date).toLocaleDateString(undefined,{day:'numeric',month:'short'}))}<small>${calendarParse(e.date).getFullYear()}</small></button>`:'<span>Date to<small>confirm</small></span>'}</div><div class="calendar-event-body"><h3>${calendarEscape(e.title)}</h3><p>${e.time?calendarTimeLabel(e.time)+' · ':''}${calendarEscape(e.notes)}</p>${e.pending?`<button class="calendar-schedule" onclick="go(()=>calendarEditor('${e.id}'))">Set date</button>`:''}</div>${!e.seed&&!e.pending?`<button class="calendar-delete" aria-label="Delete event" onclick="calendarDelete('${e.id}')">×</button>`:''}</article>`).join('')}</section>`;}
function calendarZone(){return Intl.DateTimeFormat().resolvedOptions().timeZone||'Device local time';}
function calendarSeedEvents(date){
  const entries=EV[date.getMonth()+'-'+date.getDate()]||[];
  return entries.filter(e=>/birthday/i.test(e[0])||date.getFullYear()===2024).map((e,i)=>({id:'seed-'+i,title:e[0],time:e[1]==='All day'?'':e[1],notes:/birthday/i.test(e[0])?'Birthday · repeats yearly':'Original calendar event',seed:true}));
}
function calendarEventsFor(key){return [...calendarSeedEvents(calendarParse(key)),...calendarRequested.filter(e=>!e.pending&&e.date===key),...calendarEvents.filter(e=>e.date===key)].sort((a,b)=>(a.time||'').localeCompare(b.time||''));}
function calendarSelect(key){const date=calendarParse(key);calendarUI.selected=key;calendarUI.year=date.getFullYear();calendarUI.month=date.getMonth();paint();}
function calendarMove(offset){const date=new Date(calendarUI.year,calendarUI.month+offset,1,12);const selectedDay=calendarParse(calendarUI.selected).getDate();const max=new Date(date.getFullYear(),date.getMonth()+1,0,12).getDate();date.setDate(Math.min(selectedDay,max));calendarSelect(calendarKey(date));}
function calendarToday(){calendarSelect(calendarKey(new Date()));}
function calendarDelete(id){calendarEvents=calendarEvents.filter(e=>e.id!==id);calendarStore();paint();}
function calendarStore(){try{localStorage.setItem('calendar-events',JSON.stringify(calendarEvents));}catch{}}
function calendarCreate(form){
  const title=form.elements.eventTitle.value.trim().slice(0,100),date=form.elements.date.value,time=form.elements.allDay.checked?'':form.elements.time.value,notes=form.elements.notes.value.trim().slice(0,500);
  if(!title||!/^\d{4}-\d{2}-\d{2}$/.test(date)||calendarKey(calendarParse(date))!==date)return;
  const requestId=form.elements.requestId?.value||'',nights=requestId==='request-night'?7:1;
  for(let i=0;i<nights;i++){
    const day=calendarParse(date);day.setDate(day.getDate()+i);
    calendarEvents.push({id:'event-'+Date.now()+'-'+Math.floor(Math.random()*1000000),title,date:calendarKey(day),time,notes:nights===7?`Night ${i+1} of 7${notes?' · '+notes:''}`:notes,requestId});
  }
  calendarStore();
  const selected=calendarParse(date);calendarUI.selected=date;calendarUI.year=selected.getFullYear();calendarUI.month=selected.getMonth();back();
}
function calendarEditor(requestId=''){const request=calendarPendingRequests().find(e=>e.id===requestId);return `<div class="calendar-page"><button class="calendar-back" onclick="back()">‹ Calendar</button><header class="calendar-top"><div><p>Make a little time</p><h1>New event</h1></div></header><form class="calendar-form" onsubmit="event.preventDefault();calendarCreate(this)"><input type="hidden" name="requestId" value="${request?.id||''}"><label for="calendar-title">Title</label><input id="calendar-title" name="eventTitle" placeholder="What’s the plan?" value="${calendarEscape(request?.title||'')}" maxlength="100" required><label for="calendar-date">Date</label><input id="calendar-date" type="date" name="date" value="${request?'':calendarUI.selected}" min="1900-01-01" max="9999-12-31" required><label class="calendar-checkbox"><input type="checkbox" name="allDay" ${request?.id==='request-night'?'checked':''} onchange="this.form.elements.time.disabled=this.checked">All-day event</label><label for="calendar-time">Time</label><input id="calendar-time" type="time" name="time" value="${request?.time||'09:00'}" ${request?.id==='request-night'?'disabled':''}><label for="calendar-notes">Notes</label><textarea id="calendar-notes" name="notes" placeholder="Anything to remember…" maxlength="500">${calendarEscape(request?.id==='request-night'?'Night shift':request?.id==='request-house'?'Saturday house viewing':'')}</textarea><button class="calendar-save" type="submit">Save event</button></form><p class="calendar-note">Events are saved locally in this browser. Dates use ${calendarEscape(calendarZone())}.</p></div>`;}
function calendarView(){
  const now=new Date(),today=calendarKey(now),first=new Date(calendarUI.year,calendarUI.month,1,12),selected=calendarParse(calendarUI.selected),events=calendarEventsFor(calendarUI.selected);
  const start=new Date(calendarUI.year,calendarUI.month,1-first.getDay(),12);
  const cells=Array.from({length:42},(_,i)=>{const date=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i,12),key=calendarKey(date),outside=date.getMonth()!==calendarUI.month;return `<button class="calendar-cell${outside?' is-outside':''}${key===today?' is-today':''}${key===calendarUI.selected?' is-selected':''}" aria-label="${calendarEscape(date.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'}))}" aria-pressed="${key===calendarUI.selected}" ${key===today?'aria-current="date"':''} onclick="calendarSelect('${key}')"><span>${date.getDate()}</span>${calendarEventsFor(key).length?'<i aria-hidden="true"></i>':''}</button>`;}).join('');
  const weekdays=Array.from({length:7},(_,i)=>new Date(2024,0,7+i,12).toLocaleDateString(undefined,{weekday:'short'}));
  return `<div class="calendar-page"><header class="calendar-top"><div><p>Your days, thoughtfully planned</p><h1>Calendar</h1></div><button class="calendar-add" aria-label="Add event" onclick="go(()=>calendarEditor())"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></header><p class="calendar-zone"><span></span>${calendarEscape(calendarZone().replaceAll('_',' '))} · Device local time</p><div class="calendar-month-heading"><div><h2>${first.toLocaleDateString(undefined,{month:'long'})}</h2><p>${calendarUI.year}</p></div><div class="calendar-month-controls"><button class="calendar-today" onclick="calendarToday()">Today</button><button aria-label="Previous month" onclick="calendarMove(-1)">‹</button><button aria-label="Next month" onclick="calendarMove(1)">›</button></div></div><section class="calendar-month-card" aria-label="Month calendar"><div class="calendar-weekdays">${weekdays.map(day=>`<span>${calendarEscape(day)}</span>`).join('')}</div><div class="calendar-days">${cells}</div></section><div class="calendar-legend"><span><i></i>Event scheduled</span><span>Tap a date to see your plans</span></div><section><div class="calendar-agenda-heading"><h2>${calendarUI.selected===today?'Today':selected.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</h2><span>${events.length} event${events.length===1?'':'s'}</span></div>${events.length?events.map(e=>`<article class="calendar-event"><time>${calendarEscape(e.requestId==='request-night'?'Night shift':calendarTimeLabel(e.time))}</time><div class="calendar-event-body"><h3>${calendarEscape(e.title)}</h3>${e.notes?`<p>${calendarEscape(e.notes)}</p>`:''}</div>${!e.seed?`<button class="calendar-delete" aria-label="Delete ${calendarEscape(e.title)}" onclick="calendarDelete('${e.id}')">×</button>`:''}</article>`).join(''):'<div class="calendar-empty"><span>☷</span><h3>A little breathing room</h3><p>No plans for this day.<br>Leave it open, or make it memorable.</p><button onclick="go(()=>calendarEditor())">+ Add a plan</button></div>'}</section>${calendarEventList()}<p class="calendar-note">The app icon follows your device’s local day and date, and updates when you return or the date changes.</p></div>`;
}
let calendarLastDate='',calendarLastZone='';
function calendarUpdateIcon(){
  const now=new Date(),key=calendarKey(now),zone=calendarZone(),icon=document.querySelector(".ap[onclick*=\"'calendar'\"] .ico");
  if(icon){icon.classList.add('calendar-live-icon');icon.innerHTML=`<span class="calendar-icon-weekday">${calendarEscape(now.toLocaleDateString(undefined,{weekday:'short'}).toLocaleUpperCase())}</span><span class="calendar-icon-date">${now.getDate()}</span>`;icon.parentElement.setAttribute('aria-label','Calendar, '+now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}));}
  if((calendarLastDate&&calendarLastDate!==key)||(calendarLastZone&&calendarLastZone!==zone)){
    if(calendarUI.selected===calendarLastDate){calendarUI.selected=key;calendarUI.year=now.getFullYear();calendarUI.month=now.getMonth();}
    if(document.querySelector('.calendar-days'))paint();
  }
  calendarLastDate=key;calendarLastZone=zone;
}
ROOT.calendar=calendarView;
calendarUpdateIcon();
setInterval(calendarUpdateIcon,30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)calendarUpdateIcon();});
window.addEventListener('focus',calendarUpdateIcon);
