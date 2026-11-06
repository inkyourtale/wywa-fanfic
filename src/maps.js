/* Illustrated Lindenwell map; all routes are local previews. */
const mapUI = { query: '', category: 'All', zoom: 1, muted: false, route: false, saved: new Set() };
const mapSymbols = ['▣', '▤', '⌂', '▥', '⌂', '♨', '♧', '+'];
const mapColors = ['#ad72c5', '#5386ca', '#8499a5', '#818da4', '#8499a5', '#de9846', '#6fa582', '#e0717b'];
const mapCategories = ['Stay', 'Transit', 'Home', 'Civic', 'Home', 'Food', 'Parks', 'Health'];
const mapEscape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function mapMatches() {
  return PL.map((p, i) => i).filter(i => (mapUI.category === 'All' || mapCategories[i] === mapUI.category) && `${PL[i][0]} ${PL[i][1]}`.toLowerCase().includes(mapUI.query.toLowerCase()));
}
function mapSelect(i) { sel = i; mapUI.route = false; paint(); }
function mapCategory(category) { mapUI.category = category; sel = -1; mapUI.route = false; paint(); }
function mapSearch(value) {
  mapUI.query = value;
  sel = -1;
  mapUI.route = false;
  document.querySelector('.maps-results').innerHTML = mapResults();
  document.querySelectorAll('.maps-marker').forEach(marker => {
    marker.hidden = !mapMatches().includes(Number(marker.dataset.place));
    marker.classList.remove('is-selected');
  });
  document.querySelector('.maps-route')?.remove();
}
function mapZoom(step) {
  mapUI.zoom = Math.max(1, Math.min(1.8, mapUI.zoom + step));
  document.querySelector('.maps-world').style.transform = `scale(${mapUI.zoom})`;
}
function mapLocate() {
  mapUI.zoom = 1.35;
  document.querySelector('.maps-world').style.transform = 'scale(1.35) translate(3%, -7%)';
  toast('Centered on your Lindenwell location');
}
function mapSave() {
  mapUI.saved.has(sel) ? mapUI.saved.delete(sel) : mapUI.saved.add(sel);
  paint();
}
function mapResults() {
  if (sel >= 0) {
    const p = PL[sel], saved = mapUI.saved.has(sel);
    return `<div class="maps-detail"><div class="maps-detail-heading"><div><h2>${mapEscape(p[0])}</h2><div class="sub">${mapEscape(p[1])} · Lindenwell</div></div><button class="maps-close" aria-label="Close place" onclick="sel=-1;mapUI.route=false;paint()">×</button></div><p>${mapUI.route ? 'Route preview · From your location<br>Follow the blue line to your destination.' : 'Explore the riverside neighbourhood and nearby places.'}</p><div class="maps-actions"><button onclick="mapUI.route=!mapUI.route;paint()">${mapUI.route ? 'End preview' : '↗ Preview route'}</button><button onclick="mapSave()">${saved ? '✓ Saved' : '+ Save place'}</button></div><p>Illustrated map · Route previews are not for navigation.</p></div>`;
  }
  const matches = mapMatches();
  return `<div class="maps-section-title"><h2>${mapUI.query ? 'Search results' : mapUI.category === 'All' ? 'Explore nearby' : mapUI.category}</h2><span>${matches.length} places</span></div>${matches.map(i => `<button class="maps-place" onclick="mapSelect(${i})"><span class="maps-place-icon" style="--pin:${mapColors[i]}">${mapSymbols[i]}</span><span class="maps-place-text"><b>${mapEscape(PL[i][0])}</b><small>${mapEscape(PL[i][1])} · Lindenwell${mapUI.saved.has(i) ? ' · Saved' : ''}</small></span><span>›</span></button>`).join('') || '<p class="maps-empty">No places found. Try another name or category.</p>'}`;
}
function renderDetailedMap() {
  const blocks = Array.from({length: 64}, (_, i) => {
    const x = 14 + (i % 8) * 51, y = 80 + Math.floor(i / 8) * 68;
    return `<rect x="${x}" y="${y}" width="${22 + i % 3 * 5}" height="${25 + i % 4 * 4}" rx="3" fill="${i % 3 ? '#deded6' : '#d5dace'}" stroke="#d0d2c8" stroke-width=".6"/>`;
  }).join('');
  const streets = 'M0 157H430 M0 291H430 M0 430H430 M0 565H430 M54 0V700 M155 0V700 M260 0V700 M365 0V700 M0 640L430 115';
  const route = mapUI.route && sel >= 0 ? `<path class="maps-route" d="M202 399 L202 430 L${PL[sel][2] * 4.3} 430 L${PL[sel][2] * 4.3} ${PL[sel][3] * 7}" fill="none" stroke="#1688ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` : '';
  const matches = mapMatches();
  return `<section class="maps-screen${mapUI.muted ? ' is-muted' : ''}" aria-label="Lindenwell Maps">
    <div class="maps-canvas"><div class="maps-world" style="transform:scale(${mapUI.zoom})">
      <svg viewBox="0 0 430 700" preserveAspectRatio="none" aria-hidden="true">
        <rect width="430" height="700" fill="#eae9e1"/>${blocks}
        <path d="M0 85Q60 60 123 94L133 213 18 237 0 216Z M294 480Q330 447 430 468V650L316 625Z" fill="#c9ddbe"/>
        <path d="M-30 330C65 266 97 375 192 331S315 256 460 312" fill="none" stroke="#98c9db" stroke-width="51"/>
        <path d="M-30 330C65 266 97 375 192 331S315 256 460 312" fill="none" stroke="#b4d9e5" stroke-width="43"/>
        <path d="${streets}" fill="none" stroke="#d0d0c6" stroke-width="13"/>
        <path d="${streets}" fill="none" stroke="#fffef9" stroke-width="10"/>
        <path d="M-20 510Q100 470 187 513T460 485" fill="none" stroke="#d6c58a" stroke-width="17"/>
        <path d="M-20 510Q100 470 187 513T460 485" fill="none" stroke="#fff0b5" stroke-width="12"/>
        <path d="M0 112L430 120" stroke="#b6b4ad" stroke-width="3" stroke-dasharray="6 4"/>
        <g fill="#91958d" font-family="system-ui,sans-serif" font-size="9" text-anchor="middle">
          <text x="218" y="151">STATION ROAD</text><text x="211" y="424">RIVERSIDE DRIVE</text>
          <text x="102" y="558">FOREST LANE</text><text x="304" y="508" transform="rotate(-8 304 508)">LINDEN AVENUE</text>
          <text x="61" y="185" fill="#739067">Riverside Park</text><text x="350" y="590" fill="#739067">Botanical Gardens</text>
          <text x="238" y="316" fill="#6098af" transform="rotate(-13 238 316)">Linden River</text>
          <text x="374" y="376" transform="rotate(-90 374 376)">CIVIC STREET</text>
        </g>${route}
      </svg><div class="maps-label">LINDENWELL</div>
      ${PL.map((p,i) => `<button class="maps-marker${i === sel ? ' is-selected' : ''}" data-place="${i}" ${matches.includes(i) ? '' : 'hidden'} style="left:${p[2]}%;top:${p[3]}%;--pin:${mapColors[i]}" aria-label="${mapEscape(p[0])}" onclick="mapSelect(${i})"><i>${mapSymbols[i]}</i><span>${mapEscape(p[0])}</span></button>`).join('')}
      <div class="maps-location" role="img" aria-label="Your illustrated location"></div>
    </div></div>
    <div class="maps-weather">☁ 24°<small>Lindenwell · Rain</small></div>
    <div class="maps-tools"><button aria-label="Toggle muted map colors" aria-pressed="${mapUI.muted}" onclick="mapUI.muted=!mapUI.muted;paint()">▱</button><button aria-label="Center on your location" onclick="mapLocate()">➤</button><button aria-label="Zoom in" onclick="mapZoom(.2)">+</button><button aria-label="Zoom out" onclick="mapZoom(-.2)">−</button></div>
    <div class="maps-compass">N<span>▲</span></div>
    <div class="maps-sheet"><div class="maps-handle"></div><label class="maps-search"><span aria-hidden="true">⌕</span><input aria-label="Search Maps" placeholder="Search Maps" value="${mapEscape(mapUI.query)}" oninput="mapSearch(this.value)"><button aria-label="Clear search" onclick="mapSearch('');this.previousElementSibling.value=''">×</button></label>
    <div class="maps-categories" aria-label="Place categories">${['All', 'Food', 'Stay', 'Transit', 'Health', 'Parks', 'Home', 'Civic'].map(c => `<button class="${mapUI.category === c ? 'active' : ''}" aria-pressed="${mapUI.category === c}" onclick="mapCategory('${c}')">${c}</button>`).join('')}</div>
    <div class="maps-results">${mapResults()}</div></div>
  </section>`;
}
