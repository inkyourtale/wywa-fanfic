/* Mail preview: existing messages and local drafts, no email is sent. */
const mailData={read:[],starred:[],archived:[],drafts:[]};
try{
  const stored=JSON.parse(localStorage.getItem('mail-local')||'{}');
  for(const key of ['read','starred','archived'])if(Array.isArray(stored[key]))mailData[key]=stored[key].filter(i=>Number.isInteger(i)&&i>=0&&i<ML.length);
  if(Array.isArray(stored.drafts))mailData.drafts=stored.drafts.filter(d=>d&&/^draft-\d+-\d+$/.test(d.id)&&['to','subject','body'].every(k=>typeof d[k]==='string'));
}catch{}
const mailUI={folder:'inbox',filter:'all',query:''};
const mailEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mailPlain(body){return body.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,'');}
function mailPersist(){try{localStorage.setItem('mail-local',JSON.stringify(mailData));}catch{}}
function mailIcon(name){const paths={inbox:'<path d="M5 3h14l3 13v5H2v-5ZM2 16h6l2 3h4l2-3h6"/>',archive:'<rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v13h14V8M9 12h6"/>',draft:'<path d="M14 3H5v18h14V8ZM14 3v5h5M8 12h8M8 16h5"/>',compose:'<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15Z"/>',star:'<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',read:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/>'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;}
function mailFolder(folder){mailUI.folder=folder;mailUI.filter='all';mailUI.query='';paint();}
function mailToggle(key,index){if(!['read','starred','archived'].includes(key)||!ML[index])return;const i=mailData[key].indexOf(index);i<0?mailData[key].push(index):mailData[key].splice(i,1);mailPersist();paint();}
function mailOpen(index){if(!ML[index])return;if(!mailData.read.includes(index)){mailData.read.push(index);mailPersist();}go(()=>mailReader(index));}
function mailMatches(){return ML.map((m,i)=>i).filter(i=>{
  const inFolder=mailUI.folder==='archive'?mailData.archived.includes(i):!mailData.archived.includes(i);
  return inFolder&&(mailUI.filter!=='unread'||!mailData.read.includes(i))&&(mailUI.filter!=='starred'||mailData.starred.includes(i))&&ML[i].join(' ').toLowerCase().includes(mailUI.query.toLowerCase());
});}
function mailAvatar(index){return `<span class="mail-sender-avatar" style="--sender-bg:${index%2?'#f0eae2':'#e8eef5'};--sender-ink:${index%2?'#b49b7c':'#87a0b9'}">${mailEscape(ML[index][0][0])}</span>`;}
function mailCards(){
  if(mailUI.folder==='drafts'){
    const drafts=mailData.drafts.filter(d=>(d.to+' '+d.subject+' '+d.body).toLowerCase().includes(mailUI.query.toLowerCase()));
    return drafts.length?drafts.map(d=>`<article class="mail-card"><span class="mail-sender-avatar">✎</span><button class="mail-open" onclick="go(()=>mailComposer('${d.id}'))"><div class="mail-card-meta"><b>${mailEscape(d.to||'No recipient')}</b><time>Draft</time></div><h2>${mailEscape(d.subject||'No subject')}</h2><p>${mailEscape(d.body||'Continue writing…')}</p></button><div class="mail-status"><button aria-label="Delete draft" onclick="mailDeleteDraft('${d.id}')">×</button></div></article>`).join(''):'<div class="mail-empty"><b>A fresh page</b>No drafts here yet. Tap compose to start writing.</div>';
  }
  const matches=mailMatches();
  return matches.length?matches.map(i=>{const m=ML[i],unread=!mailData.read.includes(i),starred=mailData.starred.includes(i);return `<article class="mail-card${unread?' is-unread':''}">${mailAvatar(i)}<button class="mail-open" onclick="mailOpen(${i})"><div class="mail-card-meta"><b>${mailEscape(m[0])}</b><time>${mailEscape(m[2])}</time></div><h2>${mailEscape(m[1])}</h2><p>${mailEscape(mailPlain(m[3]))}</p></button><div class="mail-status">${unread?'<span class="mail-dot" aria-label="Unread"></span>':''}<button aria-label="${starred?'Unstar':'Star'} message" aria-pressed="${starred}" onclick="mailToggle('starred',${i})">${starred?'★':'☆'}</button></div></article>`;}).join(''):'<div class="mail-empty"><b>All clear</b>No messages match this view. Try another filter or search.</div>';
}
function mailSearch(query){mailUI.query=query;document.querySelector('.mail-results').innerHTML=mailCards();}
function mailNav(){return [['inbox','inbox','Inbox'],['archive','archive','Archive'],['drafts','draft','Drafts']].map(([folder,icon,label])=>`<button ${mailUI.folder===folder?'aria-current="page"':''} onclick="mailFolder('${folder}')">${mailIcon(icon)}<span>${label}</span></button>`).join('');}
function mailHome(){
  const unread=ML.filter((m,i)=>!mailData.read.includes(i)&&!mailData.archived.includes(i)).length,title={inbox:'Inbox',archive:'Archive',drafts:'Drafts'}[mailUI.folder];
  return `<section class="mail-app" aria-label="Mail"><header class="mail-top"><span class="mail-wordmark">Mail</span><span class="mail-profile">BJ</span><button class="mail-compose-button" aria-label="Compose draft" onclick="go(()=>mailComposer())">${mailIcon('compose')}</button></header><main class="mail-content"><div class="mail-heading"><div><p>Your personal mailbox</p><h1>${title}</h1></div><span class="mail-unread-count" aria-label="${unread} unread messages">${unread}</span></div><label class="mail-search"><span>⌕</span><input aria-label="Search mail" placeholder="Search messages" value="${mailEscape(mailUI.query)}" oninput="mailSearch(this.value)"></label>${mailUI.folder!=='drafts'?`<div class="mail-filters" aria-label="Filter messages">${[['all','All mail'],['unread','Unread'],['starred','Starred']].map(([key,label])=>`<button aria-pressed="${mailUI.filter===key}" onclick="mailUI.filter='${key}';paint()">${label}</button>`).join('')}</div>`:''}<div class="mail-list-heading"><span>${mailUI.folder==='drafts'?'Unsent messages':'Messages'}</span><span>Saved on this browser</span></div><div class="mail-results">${mailCards()}</div><p class="mail-local-note">A quiet place for your correspondence.<br>Read status, stars, archives and drafts stay saved locally.</p></main><nav class="mail-nav" aria-label="Mail folders">${mailNav()}</nav></section>`;
}
function mailReader(index){
  const m=ML[index];if(!m)return mailHome();const starred=mailData.starred.includes(index),read=mailData.read.includes(index),archived=mailData.archived.includes(index);
  return `<section class="mail-app mail-reader"><header class="mail-top"><button onclick="back()">‹ Mail</button><span class="mail-wordmark">Message</span><button aria-label="Reply with a draft" onclick="go(()=>mailComposer(null,${index}))">${mailIcon('compose')}</button></header><main class="mail-content"><h1 class="mail-subject">${mailEscape(m[1])}</h1><div class="mail-reader-sender">${mailAvatar(index)}<div><b>${mailEscape(m[0])}</b><small>To: Bae Joohyun<br>${mailEscape(m[2])}</small></div></div><div class="mail-message-body">${mailEscape(mailPlain(m[3])).replace(/\n/g,'<br>')}</div></main><nav class="mail-nav" aria-label="Message actions"><button aria-label="${starred?'Unstar':'Star'} message" aria-pressed="${starred}" onclick="mailToggle('starred',${index})">${mailIcon('star')}<span>${starred?'Starred':'Star'}</span></button><button onclick="mailToggle('read',${index})">${mailIcon('read')}<span>Mark ${read?'unread':'read'}</span></button><button onclick="mailToggle('archived',${index});back()">${mailIcon('archive')}<span>${archived?'Move to Inbox':'Archive'}</span></button></nav></section>`;
}
function mailDeleteDraft(id){mailData.drafts=mailData.drafts.filter(d=>d.id!==id);mailPersist();paint();}
function mailSaveDraft(form,id){
  const draft={id:id||'draft-'+Date.now()+'-'+Math.floor(Math.random()*1000000),to:form.elements.recipient.value.trim().slice(0,200),subject:form.elements.subject.value.trim().slice(0,200),body:form.elements.body.value.slice(0,10000)};
  if(!draft.to&&!draft.subject&&!draft.body.trim()){toast('Write something before saving');return;}
  mailData.drafts=[draft,...mailData.drafts.filter(d=>d.id!==draft.id)];mailPersist();mailUI.folder='drafts';back();toast('Draft saved locally');
}
function mailComposer(id=null,replyIndex=null){
  const reply=ML[replyIndex],draft=mailData.drafts.find(d=>d.id===id)||{to:reply?reply[0]:'',subject:reply?'Re: '+reply[1]:'',body:''};
  return `<section class="mail-app"><header class="mail-top"><button onclick="back()">‹ Mail</button><span class="mail-wordmark">${reply?'Reply draft':'New draft'}</span><span class="mail-profile">BJ</span></header><main class="mail-content"><form id="mail-compose-form" class="mail-compose-form" onsubmit="event.preventDefault();mailSaveDraft(this,${id?`'${id}'`:'null'})"><div class="mail-compose-field"><label for="mail-to">To</label><input id="mail-to" name="recipient" aria-label="Recipient" value="${mailEscape(draft.to)}" placeholder="Name or email" maxlength="200"></div><div class="mail-compose-field"><label for="mail-subject">Subject</label><input id="mail-subject" name="subject" value="${mailEscape(draft.subject)}" placeholder="Subject" maxlength="200"></div><textarea name="body" aria-label="Message body" placeholder="Write your message…" maxlength="10000">${mailEscape(draft.body)}</textarea><p class="mail-local-note">Draft only. No email is sent from this preview.</p></form></main><footer class="mail-compose-footer"><button type="submit" form="mail-compose-form" class="mail-draft-save">Save draft</button></footer></section>`;
}
ROOT.mail=mailHome;
