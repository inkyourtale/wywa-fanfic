const galleryCollections = [
  { name: 'Collection 01', photos: PH.slice(0, 5) },
  { name: 'Collection 02', photos: PH.slice(5, 10) },
  { name: 'Collection 03', photos: PH.slice(10) },
].filter(collection => collection.photos.length);
let galleryFavourites = new Set();
try {
  const stored = JSON.parse(localStorage.getItem('gallery-favourites') || '[]');
  if (Array.isArray(stored)) galleryFavourites = new Set(stored.filter(p => PH.includes(p)));
} catch {}
let galleryViewing = PH.slice();
const galleryCount = items => `${items.length} photo${items.length === 1 ? '' : 's'}`;
function galleryCover(p) {
  return `<img src="${p}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`;
}
function galleryHome() {
  const favourites = PH.filter(p => galleryFavourites.has(p));
  return `<div class="gallery-page"><header class="gallery-heading"><div><div class="gallery-eyebrow">Your personal library</div><h1>Photos</h1></div><span class="gallery-monogram" aria-hidden="true">✿</span></header>
    <section class="gallery-section"><div class="gallery-section-heading"><h2>Folders</h2><span>2 folders</span></div><div class="gallery-folders"><button class="gallery-folder" onclick="go(()=>galleryAlbum('all'))"><span class="gallery-folder-icon"></span><b>All Photos</b><small>${galleryCount(PH)}</small></button><button class="gallery-folder" onclick="go(()=>galleryFolder())"><span class="gallery-folder-icon"></span><b>Collections</b><small>${galleryCollections.length} albums</small></button></div></section>
    <section class="gallery-section"><div class="gallery-section-heading"><h2>Favourites</h2><span>Made for keeping</span></div><button class="gallery-favourite" onclick="go(()=>galleryAlbum('favourites'))"><span class="gallery-favourite-cover">${favourites.length ? galleryCover(favourites[0]) : '♡'}</span><span><b>Your favourites</b><small>${favourites.length ? galleryCount(favourites) : 'A little closer to your heart.<br>Save the photos you love.'}</small></span><span>›</span></button></section>
    <section class="gallery-section"><div class="gallery-section-heading"><h2>Collections</h2><span>${galleryCollections.length} albums</span></div>${galleryCollectionCards()}</section></div>`;
}
function galleryCollectionCards() {
  return `<div class="gallery-collections">${galleryCollections.map((c,i) => `<button class="gallery-collection" onclick="go(()=>galleryAlbum(${i}))"><span class="gallery-cover">${galleryCover(c.photos[0])}<span>${c.photos.length}</span></span><b>${c.name}</b><small>${galleryCount(c.photos)}</small></button>`).join('')}</div>`;
}
function galleryFolder() {
  return `<div class="gallery-page"><button class="gallery-back" onclick="back()">‹ Photos</button><h1 class="gallery-album-title">Collections</h1><p class="gallery-album-count">${galleryCollections.length} albums</p>${galleryCollectionCards()}</div>`;
}
function galleryAlbum(key) {
  const items = key === 'all' ? PH : key === 'favourites' ? PH.filter(p => galleryFavourites.has(p)) : galleryCollections[key].photos;
  const title = key === 'all' ? 'All Photos' : key === 'favourites' ? 'Favourites' : galleryCollections[key].name;
  return `<div class="gallery-page"><button class="gallery-back" onclick="back()">‹ Back</button><h1 class="gallery-album-title">${title}</h1><p class="gallery-album-count">${galleryCount(items)}</p>${items.length ? `<div class="gallery-grid">${items.map(p => `<button class="gallery-thumb" aria-label="Open photo ${PH.indexOf(p) + 1}" onclick="galleryOpen('${key}','${p}')">${galleryCover(p)}${galleryFavourites.has(p) ? '<span>♥</span>' : ''}</button>`).join('')}</div>` : '<div class="gallery-empty"><span>♡</span>No favourites yet.<br>Open a photo and tap the heart to save it here.</div>'}</div>`;
}
function galleryOpen(key, p) {
  galleryViewing = (key === 'all' ? PH : key === 'favourites' ? PH.filter(p => galleryFavourites.has(p)) : galleryCollections[Number(key)].photos).slice();
  go(() => pv(p));
}
function galleryToggle(p) {
  galleryFavourites.has(p) ? galleryFavourites.delete(p) : galleryFavourites.add(p);
  try { localStorage.setItem('gallery-favourites', JSON.stringify([...galleryFavourites])); } catch {}
  paint();
}
function galleryStep(p, step) {
  const next = galleryViewing[galleryViewing.indexOf(p) + step];
  if (next) { st[st.length - 1] = () => pv(next); paint(); }
}
function galleryViewer(p) {
  const index = galleryViewing.indexOf(p), saved = galleryFavourites.has(p);
  return `<div class="fx gallery-viewer"><header class="gallery-viewer-header"><button onclick="back()" aria-label="Back to album">‹</button><span>${index + 1} of ${galleryViewing.length}</span><span>Photo ${PH.indexOf(p) + 1}</span></header><img src="${p}" alt="Photo ${PH.indexOf(p) + 1}"><div class="gallery-viewer-actions"><button onclick="galleryStep('${p}',-1)" aria-label="Previous photo" ${index <= 0 ? 'disabled' : ''}>‹</button><button onclick="galleryToggle('${p}')" aria-label="${saved ? 'Remove from' : 'Add to'} favourites" aria-pressed="${saved}">${saved ? '♥' : '♡'}</button><button onclick="galleryStep('${p}',1)" aria-label="Next photo" ${index >= galleryViewing.length - 1 ? 'disabled' : ''}>›</button></div></div>`;
}
