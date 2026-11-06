const settingsDefaults = { airplane:false, wifi:true, network:'Lindenwell_5G', bluetooth:true, cellular:true, brightness:100, dark:false, blur:14, wallpaper:'original', notifications:true, reduceMotion:false, name:"Joohyun’s iPhone" };
const phoneSettings = {...settingsDefaults};
try {
  const stored = JSON.parse(localStorage.getItem('phone-settings') || '{}');
  for (const key of Object.keys(settingsDefaults)) if (typeof stored?.[key] === typeof settingsDefaults[key]) phoneSettings[key] = stored[key];
} catch {}
phoneSettings.brightness = Math.max(30,Math.min(100,phoneSettings.brightness));
phoneSettings.blur = Math.max(0,Math.min(30,phoneSettings.blur));
const settingsWallpapers = { original:'url(imgbjh.jpg) center/cover', coast:'linear-gradient(145deg,#91b7c7,#506e98 55%,#e9c9bd)', dusk:'linear-gradient(150deg,#373f6a,#9c7a9d 60%,#ecc5b4)' };
if (!settingsWallpapers[phoneSettings.wallpaper]) phoneSettings.wallpaper='original';
const settingsEscape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function settingsApply() {
  P.style.setProperty('--screen-dim', String(1-phoneSettings.brightness/100));
  P.style.setProperty('--wallpaper-blur',phoneSettings.blur+'px');
  P.classList.toggle('settings-dark',phoneSettings.dark);
  P.classList.toggle('reduce-motion',phoneSettings.reduceMotion);
  H.style.background=settingsWallpapers[phoneSettings.wallpaper];
}
function settingsSet(key,value,repaint=true) {
  if (!(key in settingsDefaults) || typeof value !== typeof settingsDefaults[key]) return;
  phoneSettings[key]=value;
  settingsApply();
  try {localStorage.setItem('phone-settings',JSON.stringify(phoneSettings));} catch {}
  if(repaint) paint();
}
function settingsToggle(key) {settingsSet(key,!phoneSettings[key]);}
function settingsSwitch(label,key,icon,color,disabled=false) {
  return `<button class="settings-row" role="switch" aria-label="${label}" aria-checked="${phoneSettings[key]}" onclick="settingsToggle('${key}')" ${disabled?'disabled':''}><span class="settings-icon" style="--icon:${color}">${icon}</span><span class="settings-row-label">${label}</span><span class="settings-switch" aria-hidden="true"></span></button>`;
}
function settingsLink(label,page,icon,color,value='') {
  return `<button class="settings-row" data-search="${label.toLowerCase()}" onclick="go(()=>settingsDetail('${page}'))"><span class="settings-icon" style="--icon:${color}">${icon}</span><span class="settings-row-label">${label}</span><span class="settings-value">${settingsEscape(value)}</span><span class="settings-chevron">›</span></button>`;
}
function settingsGroup(title,content) { return `<section class="settings-group"><h2>${title}</h2><div class="settings-card">${content}</div></section>`; }
function settingsSearch(query) {
  const text=query.trim().toLowerCase();let matches=0;
  document.querySelectorAll('.settings-page .settings-group').forEach(group=>{
    let visible=0;
    group.querySelectorAll('.settings-row').forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(text);if(!row.hidden)visible++;});
    group.hidden=!visible;matches+=visible;
  });
  document.querySelector('.settings-profile').hidden=!!text;
  document.querySelector('.settings-empty').hidden=!!matches;
}
function settingsHome() {
  const p=phoneSettings;
  return `<div class="settings-page"><div class="settings-eyebrow">Make it yours</div><h1 class="settings-title">Settings</h1><label class="settings-search"><span>⌕</span><input aria-label="Search settings" placeholder="Search settings" oninput="settingsSearch(this.value)"></label><button class="settings-profile" onclick="go(()=>settingsDetail('profile'))"><img class="settings-avatar" src="imgwr.jpg" alt=""><span><b>Bae Joohyun</b><small>Personal profile & device</small></span><span class="settings-chevron">›</span></button>
  ${settingsGroup('Connections',settingsSwitch('Airplane Mode','airplane','✈','#dca161')+settingsLink('Wi-Fi','wifi','≋','#759dc7',p.airplane?'Airplane Mode':p.wifi?p.network:'Off')+settingsLink('Bluetooth','bluetooth','ᛒ','#819dcd',p.bluetooth?'On':'Off')+settingsLink('Cellular','cellular','▥','#74b899',p.airplane?'Off':p.cellular?'On':'Off'))}
  ${settingsGroup('Personalise',settingsLink('Display & Brightness','display','☀','#8d9bc4',p.brightness+'%')+settingsLink('Wallpaper','wallpaper','▧','#8faeaa')+settingsLink('Notifications','notifications','♧','#c3888d',p.notifications?'On':'Off'))}
  ${settingsGroup('Your device',settingsLink('General','general','⚙','#9a9fac')+settingsLink('About','about','ⓘ','#86a3b5'))}<p class="settings-empty" hidden>No matching settings.</p><p class="settings-note">Preferences apply to this phone preview. Connection controls simulate device settings.</p></div>`;
}
function settingsSlider(label,key,min,max,suffix) {
  return `<div class="settings-card settings-slider"><label for="settings-${key}">${label}<output id="settings-${key}-value">${phoneSettings[key]}${suffix}</output></label><input id="settings-${key}" type="range" min="${min}" max="${max}" value="${phoneSettings[key]}" oninput="settingsSet('${key}',Number(this.value),false);document.getElementById('settings-${key}-value').textContent=this.value+'${suffix}'"></div>`;
}
function settingsInfo(label,value) {return `<div class="settings-row"><span class="settings-row-label">${label}</span><span class="settings-value">${settingsEscape(value)}</span></div>`;}
function settingsDetail(page) {
  const p=phoneSettings;let title='',content='';
  if(page==='wifi') {
    title='Wi-Fi';content=settingsGroup('Connection',settingsSwitch('Wi-Fi','wifi','≋','#759dc7',p.airplane));
    content+=settingsGroup('Available networks',['Lindenwell_5G','Riverside Guest','Home Network'].map(name=>`<button class="settings-row" ${!p.wifi||p.airplane?'disabled':''} onclick="settingsSet('network','${name}')"><span class="settings-icon" style="--icon:#759dc7">≋</span><span class="settings-row-label">${name}</span><span class="settings-value">${p.wifi&&!p.airplane&&p.network===name?'Connected ✓':'Join'}</span></button>`).join(''))+'<p class="settings-note">Networks are simulated in this preview. Your computer’s network connection stays unchanged.</p>';
  } else if(page==='bluetooth'||page==='cellular') {
    title=page==='bluetooth'?'Bluetooth':'Cellular';content=settingsGroup('Connection',settingsSwitch(title,page,page==='bluetooth'?'ᛒ':'▥','#819dcd',page==='cellular'&&p.airplane))+'<p class="settings-note">This switch is a simulated device preference.</p>';
  } else if(page==='display') {
    title='Display & Brightness';content=settingsGroup('Appearance',settingsSwitch('Dark Settings','dark','◐','#8d9bc4'))+settingsSlider('Screen brightness','brightness',30,100,'%')+'<p class="settings-note">Brightness changes the entire phone preview. Dark Settings changes the appearance of Settings.</p>';
  } else if(page==='wallpaper') {
    title='Wallpaper';content=`<div class="settings-card settings-wallpapers">${Object.entries(settingsWallpapers).map(([key,bg])=>`<button class="settings-wallpaper" aria-pressed="${p.wallpaper===key}" onclick="settingsSet('wallpaper','${key}')"><span style="background:${bg}"></span>${key==='original'?'Original':key==='coast'?'Coast':'Dusk'}</button>`).join('')}</div><p class="settings-note">Choose a home screen wallpaper.</p>`+settingsSlider('Wallpaper blur','blur',0,30,'px');
  } else if(page==='notifications') {
    title='Notifications';content=settingsGroup('Banners',settingsSwitch('Allow Notifications','notifications','♧','#c3888d'))+'<p class="settings-note">Controls the message and social notification banners shown after unlocking. It does not change browser notification permissions.</p>';
  } else if(page==='general') {
    title='General';content=settingsGroup('Accessibility',settingsSwitch('Reduce Motion','reduceMotion','≈','#8faeaa'))+settingsGroup('Device',settingsLink('About','about','ⓘ','#86a3b5'))+'<p class="settings-note">Reduce Motion disables animations and transitions in this phone preview.</p>';
  } else if(page==='profile') {
    title='Your device';content=`<form class="settings-card settings-field" onsubmit="event.preventDefault();const name=this.elements.deviceName.value.trim();if(name){settingsSet('name',name);toast('Device name saved')}"><label for="settings-device-name">Device name</label><input id="settings-device-name" name="deviceName" value="${settingsEscape(p.name)}" maxlength="40" required><button class="settings-primary" type="submit">Save name</button></form><p class="settings-note">Saved locally in this browser.</p>`;
  } else {
    title='About';content=settingsGroup('Device information',settingsInfo('Name',p.name)+settingsInfo('Interface','iPhone preview')+settingsInfo('Photos',String(PH.length))+settingsInfo('Collections',String(galleryCollections.length)))+'<p class="settings-note">This is an interactive web interface, with preferences stored on this browser.</p>';
  }
  return `<div class="settings-page"><button class="settings-back" onclick="back()">‹ Back</button><h1 class="settings-detail-title">${title}</h1>${content}</div>`;
}
settingsApply();
