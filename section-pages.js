(function () {
  const data = window.KINDER_SECTION_DATA;
  if (!data) return;

  const body = document.body;
  const sectionKey = body.dataset.section;
  const section = data.sections[sectionKey];
  if (!section) return;
  document.documentElement.style.setProperty('--accent', section.accent);
  document.documentElement.style.setProperty('--accent-hover', section.hover);
  document.documentElement.style.setProperty('--soft', section.soft);

  const icons = {
    magazine: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 8c-4-3-8-3-12-2v19c4-1 8-1 12 2 4-3 8-3 12-2V6c-4-1-8-1-12 2ZM16 8v19M7 12c2-.4 4-.2 6 .7m-6 4c2-.4 4-.2 6 .7m6-4.7c2-1 4-1.1 6-.7m-6 5.4c2-1 4-1.1 6-.7"/></svg>',
    programs: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="17" rx="2"/><path d="M2 27h28M12 23l-1 4m10-4 1 4M12 14h8m-8 4h5"/></svg>',
    games: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 11h12c3 0 5 2 6 5l2 7c.7 3-2 5-4 3l-5-4H11l-5 4c-2 2-4.7 0-4-3l2-7c1-3 3-5 6-5ZM9 15v6m-3-3h6"/><circle cx="22" cy="16" r="1"/><circle cx="25" cy="19" r="1"/></svg>',
    making: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 5h12l6 6v16H7zM19 5v6h6m-15 11 8-8 4 4-8 8-5 1zm8-8 2-2 4 4-2 2"/></svg>',
    webtoon: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 5h24v16h-9l-4 5-2-5H4z"/><circle cx="11" cy="12" r="2"/><circle cx="21" cy="12" r="2"/><path d="M7 18c.5-2 2-3 4-3m7 3c.5-2 1.5-3 3-3s2.5 1 3 3"/></svg>',
    blog: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="4" width="22" height="24" rx="2"/><path d="M10 10h12m-12 5h12m-12 5h8"/></svg>'
  };
  const mobileLabels = { magazine: 'MAGAZINE', programs: 'PROGRAM', games: 'GAME', making: 'CREATE', webtoon: 'WEBTOON', blog: 'BLOG' };
  const nav = document.querySelector('[data-global-nav]');
  nav.className = 'global-nav';
  nav.innerHTML = `<nav class="global-nav__links" aria-label="전체 서비스">
    <a class="global-nav__link global-nav__home" href="./index.html" aria-label="홈" title="홈"><span class="global-nav__icon"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m4 14 12-10 12 10M7 12v15h7v-9h5v9h6V12"/></svg></span><span class="global-nav__label">홈</span><span class="global-nav__mobile-label" aria-hidden="true">HOME <b>→</b></span></a>
    ${Object.entries(data.sections).map(([key,item]) => `<a class="global-nav__link${key === sectionKey ? ' is-active' : ''}" href="${item.path}" title="${item.label}"${key === sectionKey ? ' aria-current="page"' : ''}><span class="global-nav__icon">${icons[key]}</span><span class="global-nav__label">${item.label}</span><span class="global-nav__mobile-label" aria-hidden="true">${mobileLabels[key]} <b>→</b></span></a>`).join('')}
  </nav><a class="global-nav__brand" href="./index.html" aria-label="JINNI'S 홈"><img src="./assets/brand/jinnis-kinder-edu-direction-1-logo.png" alt="JINNI'S"></a>`;

  const globalNavLinks = [...nav.querySelectorAll('.global-nav__link')];
  const isCompactNav = () => window.matchMedia('(max-width: 600px)').matches;
  globalNavLinks.forEach(link => link.addEventListener('click', event => {
    if (!isCompactNav() || link.classList.contains('is-mobile-armed')) return;
    event.preventDefault();
    globalNavLinks.forEach(item => item.classList.remove('is-mobile-armed'));
    link.classList.add('is-mobile-armed');
    nav.classList.add('has-mobile-armed');
  }));
  document.addEventListener('pointerdown', event => {
    if (isCompactNav() && !event.target.closest('.global-nav__link')) {
      globalNavLinks.forEach(link => link.classList.remove('is-mobile-armed'));
      nav.classList.remove('has-mobile-armed');
    }
  });

  const footer = document.querySelector('[data-utility-footer]');
  footer.className = 'utility-footer';
  footer.innerHTML = `<span>JINNI'S · © Kinder Edu</span><span class="utility-footer__center"><span>이용안내</span><span>콘텐츠·저작권 안내</span><span>개인정보 안내</span></span><span class="utility-footer__right">공식 채널 준비 중</span>`;

  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function initMagazine() {
    const model = data.magazine;
    const spread = document.querySelector('#magazine-spread');
    const indicator = document.querySelector('#page-indicator');
    const resourcePanel = document.querySelector('#resource-panel');
    const archive = document.querySelector('#archive-panel');
    const archiveWrap = document.querySelector('.archive-wrap');
    const trigger = document.querySelector('.archive-trigger');
    let pageIndex = 0;
    let closeTimer = 0;
    let wheelLocked = false;

    function renderPage() {
      const page = model.pages[pageIndex];
      spread.innerHTML = `<article class="magazine-page" aria-live="polite"><div class="magazine-page__copy"><span class="panel-kicker">${escapeHtml(page.eyebrow)}</span><h2>${escapeHtml(page.title)}</h2><p>${escapeHtml(page.copy)}</p>${page.resource ? `<button class="soft-button" type="button" data-resource="${page.resource}">활용자료 보기</button>` : ''}</div><div class="magazine-page__visual">MAGAZINE PAGE PLACEHOLDER</div></article>`;
      indicator.textContent = `${pageIndex + 1} / ${model.pages.length}`;
    }
    function movePage(direction) { pageIndex = Math.max(0, Math.min(model.pages.length - 1, pageIndex + direction)); renderPage(); }
    function renderResourceList() {
      resourcePanel.innerHTML = `<p class="panel-kicker">RESOURCE PANEL</p><h2>활용자료</h2><p>잡지에서 연결된 자료를 선택하면 이 패널만 변경됩니다.</p><div class="resource-list">${model.resources.map(item => `<button class="resource-card" type="button" data-resource="${item.id}"><b>${escapeHtml(item.title)}</b><span>${escapeHtml(item.area)}</span></button>`).join('')}</div>`;
    }
    function renderResource(id) {
      const item = model.resources.find(entry => entry.id === id);
      if (!item) return;
      resourcePanel.innerHTML = `<button class="soft-button resource-back" type="button" data-resource-back>← 자료 목록</button><div class="resource-detail"><p class="panel-kicker">RESOURCE DETAIL</p><h2>${escapeHtml(item.title)}</h2><dl><dt>대상</dt><dd>${escapeHtml(item.age)}</dd><dt>영역</dt><dd>${escapeHtml(item.area)}</dd></dl><p>${escapeHtml(item.body)}</p><div class="empty-slot">다운로드 파일 및 관련 콘텐츠 슬롯</div></div>`;
    }
    archive.innerHTML = `<p class="archive-year">2026</p>${model.issues.map(issue => `<button class="archive-issue${issue.current ? ' is-active' : ''}" type="button" data-issue="${issue.id}">${issue.month}${issue.current ? ' · 현재' : ''}</button>`).join('')}`;
    document.querySelector('[data-page-prev]').addEventListener('click', () => movePage(-1));
    document.querySelector('[data-page-next]').addEventListener('click', () => movePage(1));
    spread.addEventListener('click', event => { const button = event.target.closest('[data-resource]'); if (button) renderResource(button.dataset.resource); });
    resourcePanel.addEventListener('click', event => { const resource = event.target.closest('[data-resource]'); if (resource) renderResource(resource.dataset.resource); if (event.target.closest('[data-resource-back]')) renderResourceList(); });
    document.querySelector('.magazine-reader').addEventListener('keydown', event => { if (event.key === 'ArrowLeft') movePage(-1); if (event.key === 'ArrowRight') movePage(1); if (event.key === 'Escape') { archiveWrap.classList.remove('is-open'); trigger.setAttribute('aria-expanded','false'); } });
    document.querySelector('.magazine-reader').addEventListener('wheel', event => { if (wheelLocked || Math.abs(event.deltaY) < 20) return; wheelLocked = true; movePage(event.deltaY > 0 ? 1 : -1); window.setTimeout(() => { wheelLocked = false; }, 420); }, { passive: true });
    trigger.addEventListener('click', () => { const open = archiveWrap.classList.toggle('is-open'); trigger.setAttribute('aria-expanded', String(open)); });
    archiveWrap.addEventListener('pointerleave', event => { if (event.pointerType === 'touch') return; closeTimer = window.setTimeout(() => archiveWrap.classList.remove('is-open'), 380); });
    archiveWrap.addEventListener('pointerenter', () => window.clearTimeout(closeTimer));
    archive.addEventListener('click', event => { const issue = event.target.closest('[data-issue]'); if (!issue) return; archive.querySelectorAll('.archive-issue').forEach(button => button.classList.toggle('is-active', button === issue)); pageIndex = 0; renderPage(); renderResourceList(); archiveWrap.classList.remove('is-open'); trigger.setAttribute('aria-expanded','false'); history.replaceState(null, '', `#issue=${issue.dataset.issue}`); });
    renderPage(); renderResourceList();
  }

  function initPrograms() {
    const list = document.querySelector('#program-list');
    const workspace = document.querySelector('#program-workspace');
    const context = document.querySelector('#program-context');
    let activeId = null;
    list.className = 'program-list';
    list.innerHTML = data.programs.map(item => `<button class="program-item" type="button" data-program="${item.id}">${escapeHtml(item.name)}</button>`).join('');
    function showContext(id) { const item = data.programs.find(entry => entry.id === id); context.innerHTML = `<p class="panel-kicker">CONTEXT</p><h2>${escapeHtml(item.name)}</h2><div class="program-context__art">PROGRAM IMAGE SLOT</div><p>${escapeHtml(item.summary)}</p><p class="meta">${escapeHtml(item.status)}</p>`; }
    function showWorkspace(id) { const item = data.programs.find(entry => entry.id === id); activeId = id; list.querySelectorAll('.program-item').forEach(button => button.classList.toggle('is-active', button.dataset.program === id)); workspace.innerHTML = `<div class="workspace-app"><div class="workspace-app__window"><div><p class="panel-kicker">PROGRAM WORKSPACE</p><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.status)}</p></div></div></div>`; }
    list.addEventListener('pointerover', event => { const button = event.target.closest('[data-program]'); if (button) showContext(button.dataset.program); });
    list.addEventListener('focusin', event => { const button = event.target.closest('[data-program]'); if (button) showContext(button.dataset.program); });
    list.addEventListener('pointerleave', () => showContext(activeId || data.programs[0].id));
    list.addEventListener('click', event => { const button = event.target.closest('[data-program]'); if (button) { showWorkspace(button.dataset.program); showContext(button.dataset.program); } });
    workspace.innerHTML = `<div class="workspace-empty"><div><p class="panel-kicker">WORKSPACE</p><h2>프로그램을 선택해 실행하세요</h2><p class="meta">Hover는 우측 설명만 바꾸고 Click이 중앙 프로그램을 실행합니다.</p></div></div>`;
    showContext(data.programs[0].id);
  }

  function initGames() {
    const surface = document.querySelector('#game-surface');
    let activeGame = null;
    function renderLibrary() {
      activeGame = null;
      const featured = data.games[0];
      surface.innerHTML = `<div class="game-heading"><div><p class="panel-kicker">GAME LIBRARY</p><h1>게임</h1></div><p class="meta">게임별 독립 프로젝트를 연결하는 Launcher</p></div><div class="chip-row"><span class="category-chip">전체</span><span class="category-chip">자연탐구</span><span class="category-chip">수·과학</span></div><article class="game-feature"><div><p class="panel-kicker">FEATURED GAME</p><h2>${escapeHtml(featured.title)}</h2><p>${escapeHtml(featured.description)}</p><button class="soft-button" type="button" data-play="${featured.id}">Main 안에서 실행</button></div><div class="game-feature__art">16:9 GAME COVER SLOT</div></article><div class="game-cards">${data.games.map(game => `<button class="game-card" type="button" data-play="${game.id}"><span class="game-card__thumb">16:9 THUMBNAIL</span><b>${escapeHtml(game.title)}</b><p class="meta">${escapeHtml(game.category)} · ${escapeHtml(game.age)}</p></button>`).join('')}</div>`;
    }
    function renderStage(id) {
      activeGame = data.games.find(game => game.id === id);
      surface.innerHTML = `<div class="game-stage"><div class="game-toolbar"><button class="soft-button" type="button" data-game-back>← 게임 목록</button><strong>${escapeHtml(activeGame.title)}</strong><button class="soft-button" type="button" data-restart>다시 시작</button><button class="soft-button" type="button" data-volume aria-pressed="false">음량</button><button class="soft-button" type="button" data-fullscreen>전체화면</button></div><div class="game-frame"><div><p class="panel-kicker">GAME STAGE</p><h2>${escapeHtml(activeGame.title)}</h2><p>${escapeHtml(activeGame.description)}</p><p class="meta">독립 게임 entry가 이 영역에 mount됩니다.</p></div></div></div>`;
    }
    surface.addEventListener('click', event => {
      const play = event.target.closest('[data-play]'); if (play) renderStage(play.dataset.play);
      if (event.target.closest('[data-game-back]')) renderLibrary();
      if (event.target.closest('[data-restart]') && activeGame) renderStage(activeGame.id);
      const volume = event.target.closest('[data-volume]'); if (volume) { const muted = volume.getAttribute('aria-pressed') !== 'true'; volume.setAttribute('aria-pressed', String(muted)); volume.textContent = muted ? '음소거됨' : '음량'; }
      if (event.target.closest('[data-fullscreen]')) surface.requestFullscreen?.();
    });
    renderLibrary();
  }

  function initMaking() {
    const list = document.querySelector('#template-list');
    const canvas = document.querySelector('#template-canvas');
    const inspector = document.querySelector('#template-inspector');
    let current = data.templates[0];
    let scale = 1;
    list.className = 'template-list';
    list.innerHTML = data.templates.map(item => `<button class="template-item" type="button" data-template="${item.id}"><span class="template-thumb">${escapeHtml(item.category)}</span><b>${escapeHtml(item.title)}</b></button>`).join('');
    function values() { return Object.fromEntries(current.fields.map(field => [field.key, field.value])); }
    function renderCanvas() { const state = values(); canvas.innerHTML = `<div class="canvas-toolbar"><strong>${escapeHtml(current.title)}</strong><button class="soft-button" type="button" data-zoom=".75">75%</button><button class="soft-button" type="button" data-zoom="1">100%</button><button class="soft-button" type="button" data-zoom="1.25">125%</button><button class="soft-button" type="button">미리보기</button><button class="soft-button" type="button">내보내기</button></div><div class="canvas-stage"><article class="canvas-paper" style="--template-ratio:${current.ratio};--canvas-scale:${scale};--template-color:${escapeHtml(state.color || section.accent)}"><div><p class="panel-kicker">TEMPLATE PREVIEW</p><h2 data-canvas-title>${escapeHtml(state.name || state.title || current.title)}</h2><p data-canvas-message>${escapeHtml(state.message || current.category)}</p></div></article></div>`; }
    function renderInspector() { inspector.innerHTML = `<p class="panel-kicker">INSPECTOR</p><h2>필요한 값만 수정</h2>${current.fields.map(field => `<label class="inspector-field">${escapeHtml(field.label)}<input type="${field.type}" value="${escapeHtml(field.value)}" data-field="${field.key}"></label>`).join('')}<p class="meta">Template Schema가 노출할 항목을 결정합니다.</p>`; }
    function selectTemplate(id) { current = data.templates.find(item => item.id === id); scale = 1; list.querySelectorAll('.template-item').forEach(item => item.classList.toggle('is-active', item.dataset.template === id)); renderCanvas(); renderInspector(); }
    list.addEventListener('click', event => { const item = event.target.closest('[data-template]'); if (item) selectTemplate(item.dataset.template); });
    canvas.addEventListener('click', event => { const zoom = event.target.closest('[data-zoom]'); if (zoom) { scale = Number(zoom.dataset.zoom); canvas.querySelector('.canvas-paper')?.style.setProperty('--canvas-scale', scale); } });
    inspector.addEventListener('input', event => { const input = event.target.closest('[data-field]'); if (!input) return; const field = current.fields.find(item => item.key === input.dataset.field); field.value = input.value; const state = values(); const title = canvas.querySelector('[data-canvas-title]'); const message = canvas.querySelector('[data-canvas-message]'); if (title) title.textContent = state.name || state.title || current.title; if (message) message.textContent = state.message || current.category; if (state.color) canvas.querySelector('.canvas-paper')?.style.setProperty('--template-color', state.color); });
    selectTemplate(current.id);
  }

  function initWebtoon() {
    const main = document.querySelector('#webtoon-main');
    const model = data.webtoon;
    let tab = 'episodes';
    let episodeIndex = 0;
    function tabContent() {
      if (tab === 'episodes') return `<div class="episode-grid">${model.episodes.map((episode,index) => `<button class="episode-card" type="button" data-episode="${index}"><img src="${episode.thumbnail}" alt=""><b>${escapeHtml(episode.number)}</b><span>${escapeHtml(episode.title)}</span></button>`).join('')}</div>`;
      if (tab === 'characters') return `<div class="empty-slot">등장인물 portrait와 한 줄 설명이 들어갈 데이터 슬롯입니다.</div>`;
      return `<div class="empty-slot">작품 배경과 관계를 정리할 세계관 데이터 슬롯입니다.</div>`;
    }
    function renderHome() { main.innerHTML = `<div class="webtoon-home"><section class="series-hero"><div class="series-cover"><img src="${model.cover}" alt="공무가 작품 이미지"></div><div><p class="panel-kicker">ORIGINAL WEBTOON</p><h1>${escapeHtml(model.title)}</h1><p class="meta">작품 소개 콘텐츠 준비 중</p><button class="soft-button" type="button" data-episode="0">최신화 보기</button></div></section><section class="series-content"><div class="series-tabs"><button class="series-tab${tab==='episodes'?' is-active':''}" data-tab="episodes">회차</button><button class="series-tab${tab==='characters'?' is-active':''}" data-tab="characters">등장인물</button><button class="series-tab${tab==='world'?' is-active':''}" data-tab="world">세계관</button></div><div data-tab-content>${tabContent()}</div></section></div>`; }
    function renderReader(index) { episodeIndex = index; const episode = model.episodes[index]; main.innerHTML = `<section class="webtoon-reader"><div class="reader-toolbar"><button class="soft-button" type="button" data-series-back>← 작품으로</button><strong>${escapeHtml(model.title)} · ${escapeHtml(episode.number)} · ${escapeHtml(episode.title)}</strong><button class="soft-button" type="button" data-reader-prev>이전화</button><button class="soft-button" type="button" data-episode-list>회차목록</button><button class="soft-button" type="button" data-reader-next>다음화</button></div><div class="reader-scroll"><div class="reader-strip">${episode.images.map(image => `<img src="${image}" alt="웹툰 Reader 테스트 이미지">`).join('')}<div class="reader-end"><button class="soft-button" data-reader-prev>이전화</button><button class="soft-button" data-episode-list>회차목록</button><button class="soft-button" data-reader-next>다음화</button></div></div></div></section>`; }
    main.addEventListener('click', event => {
      const tabButton = event.target.closest('[data-tab]'); if (tabButton) { tab = tabButton.dataset.tab; renderHome(); return; }
      const episode = event.target.closest('[data-episode]'); if (episode) { renderReader(Number(episode.dataset.episode)); return; }
      if (event.target.closest('[data-series-back],[data-episode-list]')) { renderHome(); return; }
      if (event.target.closest('[data-reader-prev]')) renderReader(Math.max(0, episodeIndex - 1));
      if (event.target.closest('[data-reader-next]')) renderReader(Math.min(model.episodes.length - 1, episodeIndex + 1));
    });
    renderHome();
  }

  function markdownToHtml(markdown) {
    return markdown.split(/\r?\n/).filter(line => line.trim()).map(line => {
      if (line.startsWith('# ')) return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      if (line.startsWith('## ')) return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      return `<p>${escapeHtml(line)}</p>`;
    }).join('');
  }

  function initBlog() {
    const categories = document.querySelector('#blog-categories');
    const content = document.querySelector('#blog-content');
    const model = data.blog;
    let activeCategory = '전체 글';
    let feedScroll = 0;
    categories.innerHTML = model.categories.map((item,index) => `<button class="blog-category${index===0?' is-active':''}" type="button" data-category="${item}">${item}</button>`).join('');
    function filteredPosts() { return activeCategory === '전체 글' ? model.posts : model.posts.filter(post => post.category === activeCategory); }
    function card(post) { return `<article class="blog-card" tabindex="0" data-post="${post.id}"><img src="${post.thumbnail}" alt=""><span class="panel-kicker">${escapeHtml(post.category)}</span><h2>${escapeHtml(post.title)}</h2><p>${escapeHtml(post.summary)}</p><time>${escapeHtml(post.date)}</time></article>`; }
    function renderFeed() { const posts = filteredPosts(); if (!posts.length) { content.innerHTML = '<div class="empty-slot">이 카테고리의 글을 준비하고 있습니다.</div>'; return; } const featured = posts[0]; content.innerHTML = `<article class="blog-feature" tabindex="0" data-post="${featured.id}"><div><span class="panel-kicker">FEATURED · ${escapeHtml(featured.category)}</span><h1>${escapeHtml(featured.title)}</h1><p>${escapeHtml(featured.summary)}</p><time>${escapeHtml(featured.date)}</time></div><img src="${featured.thumbnail}" alt=""></article><div class="blog-grid">${posts.slice(1).map(card).join('')}</div>`; content.scrollTop = feedScroll; }
    async function renderArticle(id) { const post = model.posts.find(item => item.id === id); feedScroll = content.scrollTop; content.innerHTML = '<div class="empty-slot">글을 불러오는 중입니다.</div>'; let markdown = `# ${post.title}\n\n${post.summary}`; try { const response = await fetch(post.markdown); if (response.ok) markdown = await response.text(); } catch (_) {} content.innerHTML = `<article class="article-reader"><button class="soft-button article-back" type="button" data-article-back>← 글 목록</button><span class="panel-kicker">${escapeHtml(post.category)}</span>${markdownToHtml(markdown)}<time class="meta">${escapeHtml(post.date)}</time></article>`; content.scrollTop = 0; }
    categories.addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; activeCategory = button.dataset.category; categories.querySelectorAll('.blog-category').forEach(item => item.classList.toggle('is-active', item === button)); feedScroll = 0; renderFeed(); });
    content.addEventListener('click', event => { const post = event.target.closest('[data-post]'); if (post) renderArticle(post.dataset.post); if (event.target.closest('[data-article-back]')) renderFeed(); });
    content.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-post]')) { event.preventDefault(); renderArticle(event.target.dataset.post); } });
    renderFeed();
  }

  ({ magazine: initMagazine, programs: initPrograms, games: initGames, making: initMaking, webtoon: initWebtoon, blog: initBlog }[sectionKey])?.();
})();
