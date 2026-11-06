/* Local X-style timeline. Actions stay inside this browser. */
const xUsers=[
  {name:'Bae Joohyun',handle:'joohyun_b',avatar:'imgwr.jpg'},
  {name:'Seungwan',handle:'seungwan_s',avatar:'imgwen.jpg'},
  {name:'Yeri',handle:'yerim_k',avatar:'imgyr.jpg'},
  {name:'Seulgi',handle:'seulgi_k',avatar:'imgseul.jpg'},
  {name:'Joy',handle:'joy_p',avatar:'imgjoy.jpg'},
];
const xSeed=[
  {id:'seed-0',user:1,text:'A good evening is good company and nowhere to rush. ☁',photo:PH[0],likes:128,reposts:12},
  {id:'seed-1',user:2,text:'Reminder to take a break. And by a break I mean something from the bakery. #LittleThings',photo:null,likes:67,reposts:8},
  {id:'seed-2',user:0,text:'A few moments from the camera roll. Keeping these here.',photo:PH[3],likes:94,reposts:5},
  {id:'seed-3',user:3,text:'The best plans leave a little room for getting lost. #PhotoDiary',photo:PH[6],likes:215,reposts:21},
  {id:'seed-4',user:4,text:'Just one more photo. Always one more photo.',photo:PH[9],likes:143,reposts:9},
  {id:'seed-5',user:1,text:'Some days the little things are the whole story. #LittleThings',photo:null,likes:86,reposts:4},
  {id:'seed-6',user:0,text:'Leaving a little space for the things that make me happy. #PhotoDiary',photo:PH[12],likes:73,reposts:3},
];
const xData={likes:[],reposts:[],bookmarks:[],replies:{},posts:[],following:[1,2,3,4],bio:'Small thoughts. Little moments. ☁'};
try{
  const stored=JSON.parse(localStorage.getItem('x-local')||'{}');
  for(const key of ['likes','reposts','bookmarks'])if(Array.isArray(stored[key]))xData[key]=stored[key].filter(id=>typeof id==='string'&&/^(seed-\d+|local-\d+-\d+)$/.test(id));
  if(Array.isArray(stored.following))xData.following=stored.following.filter(i=>Number.isInteger(i)&&i>0&&i<xUsers.length);
  if(typeof stored.bio==='string')xData.bio=stored.bio.slice(0,160);
  if(Array.isArray(stored.posts))xData.posts=stored.posts.filter(p=>p&&/^local-\d+-\d+$/.test(p.id)&&typeof p.text==='string'&&(p.photo===null||PH.includes(p.photo))).map(p=>({...p,text:p.text.slice(0,280),user:0,likes:0,reposts:0}));
  if(stored.replies&&typeof stored.replies==='object')for(const [id,items]of Object.entries(stored.replies))if(/^(seed-\d+|local-\d+-\d+)$/.test(id)&&Array.isArray(items))xData.replies[id]=items.filter(t=>typeof t==='string').map(t=>t.slice(0,280));
}catch{}
const xUI={screen:'home',tab:'for-you',profile:0,query:'',modal:null,post:null,draft:'',photo:null};
const xEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function xPersist(){try{localStorage.setItem('x-local',JSON.stringify(xData));}catch{}}
function xPosts(){return [...xData.posts,...xSeed];}
function xGet(id){return xPosts().find(p=>p.id===id);}
function xIcon(name){
  const paths={home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM9 21h6"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',reply:'<path d="M21 11a9 9 0 0 1-9 9H4l1-4A9 9 0 1 1 21 11Z"/>',repost:'<path d="m4 8 3-3 3 3M7 5v12h7m6-1-3 3-3-3m3 3V7h-7"/>',save:'<path d="M5 3h14v18l-7-5-7 5Z"/>',compose:'<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15Z"/>'};
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
function xNavigate(screen,profile=0){xUI.screen=screen;xUI.profile=profile;xUI.query='';xUI.modal=null;xRefresh(true);}
function xRefresh(reset=false){
  const main=document.querySelector('.x-main');if(!main)return;
  const top=reset?0:main.scrollTop;main.innerHTML=xContent();main.scrollTop=top;
  document.querySelector('.x-nav').innerHTML=xNav();document.querySelector('.x-header-title').textContent=xTitle();xRenderModal();
}
function xToggle(type,id){if(!['likes','reposts','bookmarks'].includes(type)||!xGet(id))return;const list=xData[type],i=list.indexOf(id);i<0?list.push(id):list.splice(i,1);xPersist();xRefresh();}
function xFollow(user){if(user<1||user>=xUsers.length)return;const i=xData.following.indexOf(user);i<0?xData.following.push(user):xData.following.splice(i,1);xPersist();xRefresh();}
function xPost(p){
  const u=xUsers[p.user],liked=xData.likes.includes(p.id),reposted=xData.reposts.includes(p.id),saved=xData.bookmarks.includes(p.id),replies=xData.replies[p.id]||[];
  return `<article class="x-post"><button class="x-post-user-avatar" aria-label="View ${u.name}'s profile" onclick="xNavigate('profile',${p.user})"><img class="x-avatar" src="${u.avatar}" alt=""></button><div class="x-post-body"><header class="x-post-heading"><button onclick="xNavigate('profile',${p.user})">${u.name}</button><span>@${u.handle} · ${p.id.startsWith('local-')?'now':'photo diary'}</span></header><p class="x-post-text">${xEscape(p.text)}</p>${p.photo?`<button class="x-media" aria-label="Expand photo" onclick="xOpenModal('photo','${p.id}')"><img src="${p.photo}" alt="Photo from ${u.name}" loading="lazy"></button>`:''}<div class="x-post-actions"><button aria-label="Reply" onclick="xOpenModal('replies','${p.id}')">${xIcon('reply')}<span>${replies.length||''}</span></button><button class="${reposted?'x-reposted':''}" aria-label="${reposted?'Undo repost':'Repost'}" aria-pressed="${reposted}" onclick="xToggle('reposts','${p.id}')">${xIcon('repost')}<span>${p.reposts+(reposted?1:0)}</span></button><button class="${liked?'x-liked':''}" aria-label="${liked?'Unlike':'Like'}" aria-pressed="${liked}" onclick="xToggle('likes','${p.id}')">${xIcon('heart')}<span>${p.likes+(liked?1:0)}</span></button><button class="${saved?'x-bookmarked':''}" aria-label="${saved?'Remove bookmark':'Bookmark'}" aria-pressed="${saved}" onclick="xToggle('bookmarks','${p.id}')">${xIcon('save')}</button></div></div></article>`;
}
function xTimeline(posts){return posts.length?posts.map(xPost).join(''):'<div class="x-empty"><b>A little quiet here</b>Follow someone, bookmark a post, or join the conversation.</div>';}
function xTitle(){return {home:'Home',explore:'Explore',activity:'Your activity',bookmarks:'Bookmarks',profile:xUsers[xUI.profile].name}[xUI.screen]||'Home';}
function xContent(){
  if(xUI.screen==='home')return `<div class="x-tabs" role="tablist" aria-label="Timeline"><button role="tab" aria-selected="${xUI.tab==='for-you'}" onclick="xUI.tab='for-you';xRefresh(true)">For you</button><button role="tab" aria-selected="${xUI.tab==='following'}" onclick="xUI.tab='following';xRefresh(true)">Following</button></div>${xTimeline(xPosts().filter(p=>xUI.tab==='for-you'||xData.following.includes(p.user)||p.user===0))}<p class="x-local-note">Your local timeline · Posts and interactions stay in this browser.</p>`;
  if(xUI.screen==='explore')return `<label class="x-search">${xIcon('search')}<input aria-label="Search posts and people" placeholder="Search X" value="${xEscape(xUI.query)}" oninput="xSearch(this.value)"></label><div class="x-search-results">${xSearchResults()}</div>`;
  if(xUI.screen==='bookmarks')return `<h2 class="x-page-title">Your saved corner</h2><p class="x-subtitle">Keep the posts you want to come back to.</p>${xTimeline(xPosts().filter(p=>xData.bookmarks.includes(p.id)))}`;
  if(xUI.screen==='activity')return `<h2 class="x-page-title">Conversations you’re in</h2><p class="x-subtitle">Posts you’ve liked, reposted, or replied to.</p>${xTimeline(xPosts().filter(p=>xData.likes.includes(p.id)||xData.reposts.includes(p.id)||(xData.replies[p.id]||[]).length))}`;
  const user=xUsers[xUI.profile],own=xUI.profile===0,following=xData.following.includes(xUI.profile),posts=xPosts().filter(p=>p.user===xUI.profile||(own&&xData.reposts.includes(p.id)));
  return `<div class="x-profile-cover"></div><div class="x-profile"><div class="x-profile-top"><img src="${user.avatar}" alt="${user.name}">${own?'<button class="x-pill" onclick="xOpenModal(\'edit\')">Edit profile</button>':`<button class="x-pill ${following?'is-following':''}" onclick="xFollow(${xUI.profile})">${following?'Following ✓':'Follow'}</button>`}</div><h2>${user.name}</h2><p class="x-profile-handle">@${user.handle}</p><p class="x-profile-bio">${xEscape(own?xData.bio:'A little photo diary. Thoughts along the way.')}</p><div class="x-profile-stats"><span><b>${posts.length}</b> posts & reposts</span>${own?`<span><b>${xData.following.length}</b> following</span>`:''}</div></div><div class="x-profile-label">Posts</div>${xTimeline(posts)}`;
}
function xSearchResults(){
  if(!xUI.query.trim())return `<h2 class="x-page-title">Explore your circle</h2><p class="x-subtitle">Search people, captions, or a hashtag.</p>${['#LittleThings','#PhotoDiary','Seungwan','Joohyun'].map((q,i)=>`<button class="x-trend" onclick="xChooseSearch(${i})"><small>${i<2?'In your local timeline':'People in your circle'}</small><b>${q}</b></button>`).join('')}`;
  const q=xUI.query.toLowerCase();return xTimeline(xPosts().filter(p=>(p.text+' '+xUsers[p.user].name+' '+xUsers[p.user].handle).toLowerCase().includes(q)));
}
function xSearch(value){xUI.query=value;document.querySelector('.x-search-results').innerHTML=xSearchResults();}
function xChooseSearch(index){const value=['#LittleThings','#PhotoDiary','Seungwan','Joohyun'][index];document.querySelector('.x-search input').value=value;xSearch(value);}
function xNav(){return [['home','home','Home'],['explore','search','Explore'],['activity','bell','Your activity'],['bookmarks','save','Bookmarks'],['profile',null,'Your profile']].map(([screen,icon,label])=>`<button aria-label="${label}" ${xUI.screen===screen&&(screen!=='profile'||xUI.profile===0)?'aria-current="page"':''} onclick="xNavigate('${screen}')">${icon?xIcon(icon):'<img src="imgwr.jpg" alt="">'}</button>`).join('');}
function xOpenModal(modal,id=null){xUI.modal=modal;xUI.post=id;xRenderModal();}
function xCloseModal(){xUI.modal=null;xRenderModal();}
function xDraft(value){xUI.draft=value;document.querySelector('.x-draft-count').textContent=value.length+'/280';}
function xSelectPhoto(photo){xUI.photo=photo;xRenderModal();}
function xPublish(form){
  const text=form.elements.text.value.trim().slice(0,280);if(!text&&!xUI.photo)return;
  if(xUI.photo&&!PH.includes(xUI.photo))return;
  xData.posts.unshift({id:'local-'+Date.now()+'-'+Math.floor(Math.random()*1000000),user:0,text,photo:xUI.photo,likes:0,reposts:0});xPersist();xUI.draft='';xUI.photo=null;xNavigate('home');toast('Posted to your local timeline');
}
function xReply(form){const text=form.elements.reply.value.trim().slice(0,280),id=xUI.post;if(!text||!xGet(id))return;if(!xData.replies[id])xData.replies[id]=[];xData.replies[id].push(text);xPersist();xRefresh();}
function xRenderModal(){
  const mount=document.querySelector('.x-modal-mount');if(!mount)return;const modal=xUI.modal,p=xGet(xUI.post);
  if(!modal){mount.innerHTML='';return;}
  if(modal==='photo'&&p?.photo){mount.innerHTML=`<div class="x-lightbox" role="dialog" aria-label="Photo"><button aria-label="Close photo" onclick="xCloseModal()">×</button><img src="${p.photo}" alt="Photo by ${xUsers[p.user].name}"></div>`;return;}
  let title='',body='',footer='';
  if(modal==='compose'){
    title='New post';body=`<form onsubmit="event.preventDefault();xPublish(this)"><textarea class="x-compose-text" name="text" aria-label="Post text" placeholder="What’s happening?" maxlength="280" oninput="xDraft(this.value)">${xEscape(xUI.draft)}</textarea><div class="x-picker-label"><span>Attach a photo from your library</span><button type="button" onclick="xSelectPhoto(null)">Remove photo</button></div><div class="x-photo-picker">${PH.map((photo,i)=>`<button type="button" aria-label="Attach photo ${i+1}" aria-pressed="${photo===xUI.photo}" onclick="xSelectPhoto('${photo}')"><img src="${photo}" alt="" loading="lazy"></button>`).join('')}</div><div class="x-compose-footer"><output class="x-draft-count">${xUI.draft.length}/280</output><button class="x-submit" type="submit">Post locally</button></div><p class="x-local-note">Only saved in this browser. Nothing is published to X.</p></form>`;
  }else if(modal==='replies'&&p){title='Conversation';body=xPost(p)+(xData.replies[p.id]||[]).map(text=>`<div class="x-reply"><img class="x-avatar" src="imgwr.jpg" alt=""><p><b>${xUsers[0].name}</b>${xEscape(text)}</p></div>`).join('');footer='<form class="x-reply-form" onsubmit="event.preventDefault();xReply(this)"><input name="reply" aria-label="Write a reply" placeholder="Post your reply…" maxlength="280" required><button class="x-submit" type="submit">Reply</button></form>';
  }else if(modal==='edit'){title='Edit profile';body=`<form onsubmit="event.preventDefault();xData.bio=this.elements.bio.value.trim();xPersist();xCloseModal();xRefresh()"><label class="x-picker-label" for="x-bio">Bio</label><textarea id="x-bio" name="bio" class="x-compose-text" maxlength="160">${xEscape(xData.bio)}</textarea><button class="x-submit" type="submit">Save profile</button></form>`;
  }else{xUI.modal=null;mount.innerHTML='';return;}
  mount.innerHTML=`<div class="x-modal" onclick="if(event.target===this)xCloseModal()"><section class="x-sheet" role="dialog" aria-modal="true" aria-label="${title}" onkeydown="if(event.key==='Escape')xCloseModal()"><header class="x-sheet-header"><h2>${title}</h2><button aria-label="Close dialog" onclick="xCloseModal()">×</button></header><div class="x-sheet-body">${body}</div>${footer}</section></div>`;
}
function xApp(){return `<section class="x-screen" aria-label="X"><header class="x-header"><button aria-label="Your profile" onclick="xNavigate('profile')"><img class="x-avatar" src="imgwr.jpg" alt=""></button><h1 class="x-header-title">${xTitle()}</h1><button class="x-logo" aria-label="Home timeline" onclick="xNavigate('home')">𝕏</button></header><main class="x-main">${xContent()}</main><button class="x-fab" aria-label="Create a post" onclick="xOpenModal('compose')">${xIcon('compose')}</button><nav class="x-nav" aria-label="X navigation">${xNav()}</nav><div class="x-modal-mount"></div></section>`;}
ROOT.X=xApp;
