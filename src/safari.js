const safariUI = { panel: 'start', history: SH.slice(), opened: [] };
const safariFavourites = [
  { name: 'Apple', letter: 'a', color: '#738b9d', url: 'https://www.apple.com' },
  { name: 'Google', letter: 'G', color: '#779bd0', url: 'https://www.google.com' },
  { name: 'Wikipedia', letter: 'W', color: '#b2aca1', url: 'https://www.wikipedia.org' },
  { name: 'YouTube', letter: '▶', color: '#cf7d79', url: 'https://www.youtube.com' },
];
const safariEscape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safariDestination(value) {
  const text = value.trim();
  if (!text) return null;
  if (/^https?:\/\//i.test(text)) {
    try { return new URL(text).href; } catch { return null; }
  }
  if (/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#][^\s]*)?$/i.test(text)) return `https://${text}`;
  return `https://www.google.com/search?q=${encodeURIComponent(text)}`;
}
function safariOpen(value) {
  const url = safariDestination(value);
  if (!url) return;
  const link = document.createElement('a');
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.click();
  safariUI.history = [value.trim(), ...safariUI.history.filter(v => v !== value.trim())].slice(0, 12);
  safariUI.opened = [url, ...safariUI.opened.filter(v => v !== url)].slice(0, 12);
  paint();
}
function safariRecent(index) { safariOpen(safariUI.history[index]); }
function safariPanel(panel) { safariUI.panel = panel; paint(); }
function safariIcon(name) {
  const paths = {
    home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
    book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-6-2-10 1Z"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
function safariStart() {
  const panel = safariUI.panel;
  const favourites = `<div class="safari-favourites">${safariFavourites.map((f,i) => `<button class="safari-favourite" onclick="safariOpen(safariFavourites[${i}].url)" title="Open ${f.name} in a new browser tab"><span class="safari-tile" style="--tile:${f.color}">${f.letter}</span><small>${f.name}</small></button>`).join('')}</div>`;
  const recent = `<div class="safari-recent safari-glass">${safariUI.history.length ? safariUI.history.map((value,i) => `<button onclick="safariRecent(${i})" title="Search in a new browser tab"><span>↺</span><span>${safariEscape(value)}</span><span>↗</span></button>`).join('') : '<p class="safari-empty">Your recent searches will appear here.</p>'}</div>`;
  const content = panel === 'opened' ? `<section class="safari-section"><div class="safari-section-heading"><h2>Opened links</h2><button onclick="safariUI.opened=[];paint()">Clear</button></div><div class="safari-recent safari-glass">${safariUI.opened.map((url,i) => `<button onclick="safariOpen(safariUI.opened[${i}])"><span>↗</span><span>${safariEscape(url)}</span><span>↗</span></button>`).join('') || '<p class="safari-empty">No links opened yet.<br>Search or choose a favourite to get started.</p>'}</div></section>` : `<section class="safari-section"><div class="safari-section-heading"><h2>Favourites</h2><span>${safariFavourites.length} websites</span></div>${favourites}</section>${panel === 'start' ? `<section class="safari-section"><div class="safari-note safari-glass"><span>↗</span><div><b>A little room to explore.</b><p>Your favourite places on the web,<br>all within reach.</p></div></div></section><section class="safari-section"><div class="safari-section-heading"><h2>Recent searches</h2><button onclick="safariUI.history=[];paint()">Clear</button></div>${recent}</section>` : ''}`;
  return `<section class="safari-screen" aria-label="Safari"><div class="safari-scroll"><div class="safari-topline"><span>SAFARI</span><span class="safari-profile">BJ</span></div><header class="safari-hero"><p>Your window to the web</p><h1>${panel === 'start' ? 'Start Page' : panel === 'bookmarks' ? 'Bookmarks' : 'Your browsing'}</h1></header>${content}<p class="safari-footer-note">Websites and searches open in a new browser tab.</p></div><footer class="safari-bottom"><form class="safari-address" onsubmit="event.preventDefault();safariOpen(this.elements.address.value)"><span aria-hidden="true">⌕</span><input name="address" type="text" aria-label="Search or enter website" placeholder="Search or enter website" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"><button type="submit">Go</button></form><nav class="safari-toolbar" aria-label="Browser toolbar"><button onclick="safariPanel('start')" aria-label="Start page" aria-pressed="${panel === 'start'}">${safariIcon('home')}</button><button onclick="document.querySelector('.safari-address input').focus()" aria-label="Search">${safariIcon('search')}</button><button onclick="safariPanel('bookmarks')" aria-label="Bookmarks" aria-pressed="${panel === 'bookmarks'}">${safariIcon('book')}</button><button onclick="safariPanel('opened')" aria-label="Opened links" aria-pressed="${panel === 'opened'}"><span class="safari-count">${safariUI.opened.length}</span></button></nav></footer></section>`;
}
