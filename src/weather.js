/* Sample weather scenarios, not a live weather service. */
const weatherScenarios={
  sunny:{name:'Sunny',icon:'☀️',temp:27,high:29,low:23,feels:29,wind:9,gust:16,rain:5,mm:0,humidity:64,uv:6,visibility:12,hours:[23,25,27,29,28,25]},
  rain:{name:'Rain',icon:'🌧️',temp:24,high:27,low:22,feels:25,wind:18,gust:31,rain:85,mm:8,humidity:91,uv:2,visibility:5,hours:[22,23,24,26,25,23]},
  storm:{name:'Thunderstorm',icon:'⛈️',temp:23,high:25,low:21,feels:24,wind:32,gust:52,rain:95,mm:22,humidity:95,uv:1,visibility:2,hours:[21,22,23,24,23,22]},
};
const weatherWeek=[{day:'Mon',mode:'rain'},{day:'Tue',mode:'storm'},{day:'Wed',mode:'rain'},{day:'Thu',mode:'sunny'},{day:'Fri',mode:'sunny'},{day:'Sat',mode:'rain'},{day:'Sun',mode:'sunny'}];
const weatherUI={mode:'rain',unit:'C',day:0,trail:'woodland',checked:new Set()};
try{if(localStorage.getItem('weather-unit')==='F')weatherUI.unit='F';}catch{}
function weatherTemp(c){return Math.round(weatherUI.unit==='F'?c*9/5+32:c)+'°';}
function weatherHiking(mode=weatherUI.mode,trail=weatherUI.trail){
  if(mode==='storm')return {label:'Do not hike',tone:'stop',reason:'Thunderstorms and strong gusts make this scenario unsuitable for hiking. Postpone your trip. If thunder is heard, move into a substantial building or a hard-topped vehicle; no outdoor location is safe during a thunderstorm.'};
  if(mode==='rain')return {label:'Not recommended',tone:'caution',reason:'Rain, gusts and reduced visibility make this scenario less suitable for hiking. Wet ground can be slippery. Consider postponing, and check trail closures and local flood alerts before making plans.'};
  return {label:trail==='ridge'?'Extra caution':'More favourable',tone:trail==='ridge'?'caution':'good',reason:trail==='ridge'?'This sunny scenario has lighter wind, but an exposed ridge offers little shade or shelter. Account for UV exposure and changing mountain weather before choosing a route.':'Lighter wind and a low chance of rain make this scenario more favourable. Plan for sun exposure, carry water, and verify the current trail forecast and conditions before setting out.'};
}
function weatherChange(key,value){
  if(!['mode','trail','unit','day'].includes(key))return;
  if(key==='day'&&(!Number.isInteger(value)||!weatherWeek[value]))return;
  if(key==='mode'&&!weatherScenarios[value])return;
  if(key==='trail'&&!['woodland','ridge'].includes(value))return;
  if(key==='unit'&&!['C','F'].includes(value))return;
  const scroll=document.querySelector('.weather-content')?.scrollTop||0;
  weatherUI[key]=value;
  if(key==='mode')weatherUI.day=-1;
  if(key==='unit')try{localStorage.setItem('weather-unit',value);}catch{}
  paint();const content=document.querySelector('.weather-content');if(content)content.scrollTop=scroll;
}
function weatherSelectDay(index){weatherChange('day',index);}
function weatherCheck(index,checked){checked?weatherUI.checked.add(index):weatherUI.checked.delete(index);}
function weatherScene(){
  const mode=weatherUI.mode;
  const rain=mode==='sunny'?'':Array.from({length:mode==='storm'?42:28},(_,i)=>`<i class="weather-drop" style="--left:${(i*37)%101}%;--length:${18+i%5*7}px;--speed:${.7+i%8*.12}s;--delay:-${i*.31}s"></i>`).join('');
  return `<div class="weather-scene" aria-hidden="true">${mode==='sunny'?'<div class="weather-sun"></div>':''}<div class="weather-cloud"></div><div class="weather-cloud second"></div><svg class="weather-landscape" viewBox="0 0 400 700" preserveAspectRatio="none"><path d="M0 400 90 165 160 325 249 80 400 300V700H0Z" fill="#314e62"/><path d="m213 178 36-98 45 112-34-24-16 22Z" fill="#c5d1d6" opacity=".35"/><path d="M0 500 100 320 190 470 300 270 400 430V700H0Z" fill="#2c4a54"/><path d="M0 610Q100 470 190 560T400 505V700H0Z" fill="#1f3c45"/></svg>${rain}${mode==='storm'?'<div class="weather-lightning"></div>':''}</div>`;
}
function weatherView(){
  if(weatherUI.day>=0)weatherUI.mode=weatherWeek[weatherUI.day].mode;
  const w=weatherScenarios[weatherUI.mode],hike=weatherHiking();
  const hours=['06:00','09:00','12:00','15:00','18:00','21:00'];
  return `<section class="fx weather-app weather-${weatherUI.mode}" aria-label="Weather"><div>${weatherScene()}</div><main class="weather-content"><header class="weather-top"><span>WEATHER PREVIEW · SAMPLE DATA</span><button class="weather-unit" aria-label="Switch to degrees ${weatherUI.unit==='C'?'Fahrenheit':'Celsius'}" onclick="weatherChange('unit','${weatherUI.unit==='C'?'F':'C'}')">°${weatherUI.unit} ⇄</button></header><div class="weather-current"><h1>Lindenwell</h1><div class="weather-temperature">${weatherTemp(w.temp)}</div><p class="weather-description">${w.name}</p><div class="weather-high-low">H:${weatherTemp(w.high)} &nbsp; L:${weatherTemp(w.low)} · Feels like ${weatherTemp(w.feels)}</div></div><div class="weather-modes" aria-label="Preview weather conditions">${Object.entries(weatherScenarios).map(([key,s])=>`<button aria-pressed="${weatherUI.mode===key}" onclick="weatherChange('mode','${key}')">${s.icon} ${key==='storm'?'Storm':s.name}</button>`).join('')}</div>
  <section class="weather-glass"><h2 class="weather-card-heading">Hourly · sample day</h2><div class="weather-hourly">${hours.map((hour,i)=>`<div class="weather-hour"><small>${hour}</small><span class="weather-hour-icon" aria-label="${w.name}">${w.icon}</span><span>${weatherTemp(w.hours[i])}</span></div>`).join('')}</div></section>
  <section class="weather-glass"><div class="weather-hike-heading"><div><p class="weather-card-heading">Trail outlook</p><h2>Is it a hiking day?</h2></div><span class="weather-hike-symbol" aria-hidden="true">⛰</span></div><span class="weather-hike-status ${hike.tone}" role="status">${hike.label}</span><p class="weather-hike-copy">${hike.reason}</p><label class="weather-trail-label">Route type<select aria-label="Route type" onchange="weatherChange('trail',this.value)"><option value="woodland" ${weatherUI.trail==='woodland'?'selected':''}>Woodland trail</option><option value="ridge" ${weatherUI.trail==='ridge'?'selected':''}>Exposed ridge</option></select></label><div class="weather-factors"><span><small>Rain chance</small><b>${w.rain}%</b></span><span><small>Wind</small><b>${w.wind} km/h</b></span><span><small>Visibility</small><b>${w.visibility} km</b></span></div></section>
  <div class="weather-details"><section class="weather-glass"><h2 class="weather-card-heading">Wind</h2><p class="weather-metric">${w.wind} <span>km/h</span></p><p class="weather-metric-note">Gusts ${w.gust} km/h</p></section><section class="weather-glass"><h2 class="weather-card-heading">Rainfall</h2><p class="weather-metric">${w.mm} <span>mm</span></p><p class="weather-metric-note">Sample 24-hour total</p></section><section class="weather-glass"><h2 class="weather-card-heading">UV index</h2><p class="weather-metric">${w.uv}</p><p class="weather-metric-note">${w.uv>=6?'High · Plan sun protection':'Lower UV in this scenario'}</p></section><section class="weather-glass"><h2 class="weather-card-heading">Humidity</h2><p class="weather-metric">${w.humidity}<span>%</span></p><p class="weather-metric-note">${w.humidity>85?'Damp conditions':'Moisture in the air'}</p></section></div>
  <section class="weather-glass weather-week"><h2 class="weather-card-heading">Sample week · tap a day</h2>${weatherWeek.map((day,i)=>{const s=weatherScenarios[day.mode];return `<button class="weather-day" aria-label="${day.day}, ${s.name}" aria-pressed="${weatherUI.day===i}" onclick="weatherSelectDay(${i})"><span class="weather-day-name">${day.day}</span><span class="weather-day-icon">${s.icon}</span><span class="weather-day-low">${weatherTemp(s.low)}</span><span class="weather-day-range"></span><span>${weatherTemp(s.high)}</span></button>`;}).join('')}</section>
  <section class="weather-glass weather-checklist"><h2 class="weather-card-heading">Before you head out</h2>${['Check the current local forecast and alerts','Check trail access and conditions','Pack water, layers and sun protection','Share your route and return plan'].map((label,i)=>`<label class="weather-check"><input type="checkbox" ${weatherUI.checked.has(i)?'checked':''} onchange="weatherCheck(${i},this.checked)"><span>${label}</span></label>`).join('')}</section><p class="weather-info">Illustrative conditions, not a live forecast or a trail safety assessment. Use current local forecasts and land-manager advice.<br><a href="https://www.weather.gov/safety/lightning-outdoors" target="_blank" rel="noopener noreferrer">National Weather Service · Lightning safety ↗</a></p></main></section>`;
}
ROOT.weather=weatherView;
