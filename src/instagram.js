/* Local interactive Instagram-style demo. No account or network publishing. */
const igUsers = [
  {handle:'joohyun.b',name:'Bae Joohyun',avatar:'imgwr.jpg'},
  {handle:'seungwan.s',name:'Seungwan',avatar:'imgwen.jpg'},
  {handle:'yerim.k',name:'Yeri',avatar:'imgyr.jpg'},
  {handle:'seulgi.k',name:'Seulgi',avatar:'imgseul.jpg'},
  {handle:'joy.p',name:'Joy',avatar:'imgjoy.jpg'},
];
const igSeedPosts = PH.map((photo,i)=>({id:'photo-'+i,photo,user:i%5,caption:['Little moments, kept close.','A day worth remembering.','From my camera roll.','A little collection of lately.','Good company.'][i%5],likes:84+i*17}));
const igData = {likes:[],saved:[],comments:{},following:[1,2,3,4],published:[],bio:'A little collection of my days. ☁'};
try {
  const stored=JSON.parse(localStorage.getItem('instagram-local')||'{}');
  for(const key of ['likes','saved']) if(Array.isArray(stored[key])) igData[key]=stored[key].filter(v=>typeof v==='string');
  if(Array.isArray(stored.following))igData.following=stored.following.filter(v=>Number.isInteger(v)&&v>0&&v<igUsers.length);
  if(typeof stored.bio==='string')igData.bio=stored.bio.slice(0,150);
  if(Array.isArray(stored.published))igData.published=stored.published.filter(p=>p&&typeof p.id==='string'&&PH.includes(p.photo)&&typeof p.caption==='string').map(p=>({...p,user:0,likes:0,caption:p.caption.slice(0,500)}));
  if(stored.comments&&typeof stored.comments==='object')for(const [id,comments] of Object.entries(stored.comments))if(Array.isArray(comments))igData.comments[id]=comments.filter(c=>typeof c==='string').map(c=>c.slice(0,300));
}catch{}
const igUI={screen:'feed',profile:0,query:'',modal:null,post:null,story:0,selected:PH[0],caption:''};
const igEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function igPersist(){try{localStorage.setItem('instagram-local',JSON.stringify(igData));}catch{}}
function igPosts(){return [...igData.published,...igSeedPosts];}
function igGet(id){return igPosts().find(p=>p.id===id);}
function igIcon(name,filled=false){
  const paths={home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',comment:'<path d="M21 11.5A9.5 9.5 0 1 1 4.2 5.4 9.5 9.5 0 0 1 21 11.5Z"/><path d="m18 18 3 3-1-6"/>',save:'<path d="M5 3h14v18l-7-5-7 5Z"/>',plus:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7v10M7 12h10"/>',grid:'<path d="M3 3h18v18H3ZM3 9h18M3 15h18M9 3v18M15 3v18"/>'};
  return `<svg viewBox="0 0 24 24" fill="${filled?'currentColor':'none'}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
function igNavigate(screen,profile=0){igUI.screen=screen;igUI.profile=profile;igUI.modal=null;igUI.query='';igRefresh(true);}
function igRefresh(reset=false){
  const main=document.querySelector('.ig-main');
  if(!main)return;
  const top=reset?0:main.scrollTop; main.innerHTML=igContent(); main.scrollTop=top;
  document.querySelector('.ig-nav').innerHTML=igNav();igRenderModal();
}
function igToggle(type,id){
  if(!igGet(id))return;
  const list=igData[type],index=list.indexOf(id); index<0?list.push(id):list.splice(index,1);igPersist();igRefresh();
}
function igDoubleLike(id){if(!igData.likes.includes(id))igToggle('likes',id);}
function igFollow(user){const i=igData.following.indexOf(user);i<0?igData.following.push(user):igData.following.splice(i,1);igPersist();igRefresh();}
function igPost(p){
  const user=igUsers[p.user],liked=igData.likes.includes(p.id),saved=igData.saved.includes(p.id),comments=igData.comments[p.id]||[];
  return `<article class="ig-post"><header class="ig-post-heading"><button class="ig-user-button" onclick="igNavigate('profile',${p.user})"><img class="ig-avatar" src="${user.avatar}" alt=""><span><b>${user.handle}</b><small>From the photo library</small></span></button></header><img class="ig-post-photo" src="${p.photo}" alt="Photo shared by ${user.handle}" loading="lazy" ondblclick="igDoubleLike('${p.id}')"><div class="ig-post-actions"><button class="ig-action ig-like" aria-label="${liked?'Unlike':'Like'} post" aria-pressed="${liked}" onclick="igToggle('likes','${p.id}')">${igIcon('heart')}</button><button class="ig-action" aria-label="View comments" onclick="igOpenModal('comments','${p.id}')">${igIcon('comment')}</button><button class="ig-action ig-save" aria-label="${saved?'Unsave':'Save'} post" aria-pressed="${saved}" onclick="igToggle('saved','${p.id}')">${igIcon('save')}</button></div><div class="ig-post-copy"><p class="ig-likes">${(p.likes+(liked?1:0)).toLocaleString()} likes</p><p class="ig-caption"><b>${user.handle}</b>${igEscape(p.caption)}</p><button class="ig-comments-link" onclick="igOpenModal('comments','${p.id}')">${comments.length?'View '+comments.length+' comment'+(comments.length===1?'':'s'):'Add a comment…'}</button><p class="ig-time">${p.id.startsWith('local-')?'JUST NOW':'PHOTO DIARY'}</p></div></article>`;
}
function igGrid(posts){return posts.length?`<div class="ig-grid">${posts.map(p=>`<button aria-label="View photo by ${igUsers[p.user].handle}" onclick="igOpenModal('post','${p.id}')"><img src="${p.photo}" alt="" loading="lazy"></button>`).join('')}</div>`:'<div class="ig-empty"><b>Nothing here yet</b>Save a post or share a photo from your library.</div>';}
function igContent(){
  if(igUI.screen==='feed')return `<div class="ig-stories">${igUsers.map((u,i)=>`<button class="ig-story" onclick="igOpenStory(${i})"><span class="ig-story-ring"><img src="${u.avatar}" alt=""></span><small>${i?u.handle:'Your story'}</small></button>`).join('')}</div>${igPosts().map(igPost).join('')}`;
  if(igUI.screen==='explore')return `<label class="ig-search">${igIcon('search')}<input aria-label="Search posts and people" placeholder="Search people or captions" value="${igEscape(igUI.query)}" oninput="igSearch(this.value)"></label><div class="ig-explore-results">${igExploreResults()}</div>`;
  if(igUI.screen==='saved')return `<h1 class="ig-page-heading">Saved</h1><p class="ig-subtitle">A collection just for you</p>${igGrid(igPosts().filter(p=>igData.saved.includes(p.id)))}`;
  if(igUI.screen==='activity')return `<h1 class="ig-page-heading">Your activity</h1><p class="ig-subtitle">Posts you’ve liked</p>${igGrid(igPosts().filter(p=>igData.likes.includes(p.id)))}`;
  const user=igUsers[igUI.profile],posts=igPosts().filter(p=>p.user===igUI.profile),own=igUI.profile===0,following=igData.following.includes(igUI.profile);
  return `<div class="ig-profile"><div class="ig-profile-top"><img class="ig-profile-avatar" src="${user.avatar}" alt="${user.name}"><div class="ig-profile-stats"><span><b>${posts.length}</b><small>posts</small></span><span><b>${own?igData.saved.length:'—'}</b><small>${own?'saved':'followers'}</small></span><span><b>${own?igData.following.length:'—'}</b><small>following</small></span></div></div><h2>${user.handle}</h2><p>${igEscape(own?igData.bio:user.name+' · A photo diary.')}</p><div class="ig-profile-buttons">${own?'<button class="ig-soft-button" onclick="igOpenModal(\'edit\')">Edit profile</button><button class="ig-soft-button" onclick="igNavigate(\'saved\')">Saved posts</button>':`<button class="ig-soft-button ${following?'is-following':''}" onclick="igFollow(${igUI.profile})">${following?'Following ✓':'Follow'}</button><button class="ig-soft-button" onclick="igNavigate('feed')">Back to feed</button>`}</div></div><div class="ig-grid-label">${igIcon('grid')}</div>${igGrid(posts)}`;
}
function igExploreResults(){const q=igUI.query.toLowerCase();return igGrid(igPosts().filter(p=>(igUsers[p.user].handle+' '+igUsers[p.user].name+' '+p.caption).toLowerCase().includes(q)));}
function igSearch(value){igUI.query=value;document.querySelector('.ig-explore-results').innerHTML=igExploreResults();}
function igNav(){return `<button aria-label="Home" ${igUI.screen==='feed'?'aria-current="page"':''} onclick="igNavigate('feed')">${igIcon('home')}</button><button aria-label="Explore" ${igUI.screen==='explore'?'aria-current="page"':''} onclick="igNavigate('explore')">${igIcon('search')}</button><button aria-label="Create post" onclick="igOpenModal('compose')">${igIcon('plus')}</button><button aria-label="Saved posts" ${igUI.screen==='saved'?'aria-current="page"':''} onclick="igNavigate('saved')">${igIcon('save')}</button><button aria-label="Your profile" ${igUI.screen==='profile'&&igUI.profile===0?'aria-current="page"':''} onclick="igNavigate('profile')"><img src="imgwr.jpg" alt=""></button>`;}
function igOpenModal(modal,id=null){igUI.modal=modal;igUI.post=id;igRenderModal();}
function igCloseModal(){igUI.modal=null;igRenderModal();}
function igOpenStory(index){igUI.story=index;igOpenModal('story');}
function igStoryStep(step){igUI.story=Math.max(0,Math.min(igUsers.length-1,igUI.story+step));igRenderModal();}
function igAddComment(form){const text=form.elements.comment.value.trim();if(!text)return;const id=igUI.post;if(!igData.comments[id])igData.comments[id]=[];igData.comments[id].push(text.slice(0,300));igPersist();igRefresh();}
function igPublish(form){
  if(!PH.includes(igUI.selected))return;
  const caption=form.elements.caption.value.trim().slice(0,500);
  igData.published.unshift({id:'local-'+Date.now(),photo:igUI.selected,caption,user:0,likes:0});igPersist();igNavigate('feed');toast('Post added to your local feed');
}
function igRenderModal(){
  const mount=document.querySelector('.ig-modal-mount');if(!mount)return;
  const modal=igUI.modal,p=igGet(igUI.post);
  if(!modal){mount.innerHTML='';return;}
  if(modal==='story'){
    const user=igUsers[igUI.story];mount.innerHTML=`<div class="ig-story-view"><div class="ig-story-progress">${igUsers.map((_,i)=>`<span class="${i<=igUI.story?'seen':''}"></span>`).join('')}</div><div class="ig-story-heading"><img class="ig-avatar" src="${user.avatar}" alt=""><b>${user.handle}</b><button aria-label="Close story" onclick="igCloseModal()">×</button></div><img src="${PH[igUI.story]}" alt="Photo from ${user.handle}"><div class="ig-story-footer"><button onclick="igStoryStep(-1)" ${igUI.story===0?'disabled':''}>‹ Previous</button><button onclick="igStoryStep(1)" ${igUI.story===igUsers.length-1?'disabled':''}>Next ›</button></div></div>`;return;
  }
  let title='',body='',footer='';
  if(modal==='comments'&&p){title='Comments';body=`<div class="ig-comment"><img class="ig-avatar" src="${igUsers[p.user].avatar}" alt=""><p><b>${igUsers[p.user].handle}</b>${igEscape(p.caption)}</p></div>${(igData.comments[p.id]||[]).map(c=>`<div class="ig-comment"><img class="ig-avatar" src="imgwr.jpg" alt=""><p><b>${igUsers[0].handle}</b>${igEscape(c)}</p></div>`).join('')}`;footer='<form class="ig-comment-form" onsubmit="event.preventDefault();igAddComment(this)"><input name="comment" aria-label="Add a comment" placeholder="Add a comment…" maxlength="300" required><button class="ig-submit" type="submit">Post</button></form>';}
  else if(modal==='compose'){title='New post';body=`<form onsubmit="event.preventDefault();igPublish(this)"><label class="ig-form-label">Choose from your existing photos</label><div class="ig-compose-grid">${PH.map(photo=>`<button type="button" aria-label="Select photo ${PH.indexOf(photo)+1}" aria-pressed="${photo===igUI.selected}" onclick="igUI.selected='${photo}';this.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===this?'true':'false'))"><img src="${photo}" alt="" loading="lazy"></button>`).join('')}</div><label class="ig-form-label" for="ig-caption">Caption</label><textarea id="ig-caption" name="caption" placeholder="Write a caption…" maxlength="500"></textarea><button class="ig-primary" type="submit">Add to local feed</button><p class="ig-notice">Posts and comments are saved in this browser. Nothing is sent to Instagram.</p></form>`;}
  else if(modal==='edit'){title='Edit profile';body=`<form onsubmit="event.preventDefault();igData.bio=this.elements.bio.value.trim();igPersist();igCloseModal();igRefresh()"><label class="ig-form-label" for="ig-bio">Bio</label><textarea id="ig-bio" name="bio" maxlength="150">${igEscape(igData.bio)}</textarea><button class="ig-primary" type="submit">Save profile</button></form>`;}
  else if(modal==='post'&&p){title='Post';body=igPost(p);}
  else {igUI.modal=null;mount.innerHTML='';return;}
  mount.innerHTML=`<div class="ig-overlay" onclick="if(event.target===this)igCloseModal()"><section class="ig-sheet" role="dialog" aria-modal="true" aria-label="${title}" onkeydown="if(event.key==='Escape')igCloseModal()"><header class="ig-sheet-heading"><h2>${title}</h2><button aria-label="Close dialog" onclick="igCloseModal()">×</button></header><div class="ig-sheet-body">${body}</div>${footer}</section></div>`;
}
function instagram(){return `<section class="ig-screen" aria-label="Instagram"><header class="ig-header"><button class="ig-wordmark" onclick="igNavigate('feed')">Instagram</button><div class="ig-header-actions"><button aria-label="Your activity" onclick="igNavigate('activity')">${igIcon('heart')}</button><button aria-label="Create post" onclick="igOpenModal('compose')">${igIcon('plus')}</button></div></header><main class="ig-main">${igContent()}</main><nav class="ig-nav" aria-label="Instagram navigation">${igNav()}</nav><div class="ig-modal-mount"></div></section>`;}
ROOT.instagram=instagram;
