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
    const layout = document.querySelector('.game-layout');
    const sidebar = document.querySelector('#game-sidebar');
    const surface = document.querySelector('#game-surface');
    let gameList = (data.games && data.games.length) ? data.games : [];
    let activeGame = null;
    let isMuted = false;
    let activeCategory = '전체';
    let activeAge = '전체';
    let activeTheme = '전체';
    let searchQuery = '';

    // 기본 상태: 검색 및 필터 사이드바를 기본으로 열어두어(expanded) 유저가 바로 조건 검색을 활용할 수 있도록 설정
    layout.classList.add('sidebar-expanded');

    // registry.json 비동기 로드 시도
    fetch('./games/registry.json')
      .then(res => res.ok ? res.json() : null)
      .then(reg => {
        if (reg && Array.isArray(reg.games) && reg.games.length) {
          gameList = reg.games;
          renderSidebar();
          const curId = new URLSearchParams(window.location.search).get('id');
          if (curId && gameList.some(g => g.id === curId)) {
            renderStage(curId);
          } else if (!layout.classList.contains('is-playing')) {
            renderLibrary();
          }
        }
      })
      .catch(() => {});

    function getActiveFilterCount() {
      let count = 0;
      if (activeCategory !== '전체') count++;
      if (activeAge !== '전체') count++;
      if (activeTheme !== '전체') count++;
      if (searchQuery) count++;
      return count;
    }

    function renderSidebar() {
      if (!sidebar) return;
      const categories = ['전체', '수·과학', '자연탐구', '신체운동', '의사소통', '예술경험'];
      const ages = ['전체', '만 3세', '만 4세', '만 5세'];
      const themes = ['전체', '가을', '사계절'];
      const isExpanded = layout.classList.contains('sidebar-expanded');

      sidebar.innerHTML = `
        <button type="button" class="game-sidebar-edge-toggle" data-sidebar-edge-toggle aria-label="${isExpanded ? '필터 접기' : '필터 열기'}" title="${isExpanded ? '필터 접기' : '필터 열기'}">
          <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 4l-6 6 6 6M17 4l-6 6 6 6"/>
          </svg>
        </button>
        <div class="game-sidebar__content">
          <div class="game-sidebar__top">
            <span class="game-sidebar__title">🔍 필터 및 검색</span>
          </div>
          <div class="game-search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="게임 이름, 주제 검색..." value="${escapeHtml(searchQuery)}" id="game-search-input">
          </div>
          <div class="game-filter-group">
            <span class="game-filter-label">교육 영역</span>
            <div class="game-filter-chips">
              ${categories.map(cat => `<button type="button" class="game-chip-btn${activeCategory === cat ? ' is-active' : ''}" data-filter-cat="${cat}">${cat}</button>`).join('')}
            </div>
          </div>
          <div class="game-filter-group">
            <span class="game-filter-label">대상 연령</span>
            <div class="game-filter-chips">
              ${ages.map(age => `<button type="button" class="game-chip-btn${activeAge === age ? ' is-active' : ''}" data-filter-age="${age}">${age}</button>`).join('')}
            </div>
          </div>
          <div class="game-filter-group">
            <span class="game-filter-label">계절·생활주제</span>
            <div class="game-filter-chips">
              ${themes.map(thm => `<button type="button" class="game-chip-btn${activeTheme === thm ? ' is-active' : ''}" data-filter-theme="${thm}">${thm}</button>`).join('')}
            </div>
          </div>
          <button type="button" class="game-filter-reset" data-filter-reset>↺ 조건 초기화</button>
        </div>
      `;

      // 우측선 중간 « » 엣지 토글 버튼 클릭
      sidebar.querySelector('[data-sidebar-edge-toggle]')?.addEventListener('click', () => {
        layout.classList.toggle('sidebar-expanded');
        updateSidebarToggleBtn();
      });

      const searchInput = sidebar.querySelector('#game-search-input');
      searchInput?.addEventListener('input', e => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderLibrary();
      });

      sidebar.querySelectorAll('[data-filter-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.filterCat;
          renderSidebar();
          renderLibrary();
        });
      });

      sidebar.querySelectorAll('[data-filter-age]').forEach(btn => {
        btn.addEventListener('click', () => {
          activeAge = btn.dataset.filterAge;
          renderSidebar();
          renderLibrary();
        });
      });

      sidebar.querySelectorAll('[data-filter-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTheme = btn.dataset.filterTheme;
          renderSidebar();
          renderLibrary();
        });
      });

      sidebar.querySelector('[data-filter-reset]')?.addEventListener('click', () => {
        activeCategory = '전체';
        activeAge = '전체';
        activeTheme = '전체';
        searchQuery = '';
        renderSidebar();
        renderLibrary();
      });
    }

    function updateSidebarToggleBtn() {
      const isExpanded = layout.classList.contains('sidebar-expanded');
      const edgeBtn = sidebar.querySelector('[data-sidebar-edge-toggle]');
      if (edgeBtn) {
        edgeBtn.setAttribute('aria-expanded', String(isExpanded));
        edgeBtn.title = isExpanded ? '필터 접기' : '필터 열기';
      }
      const toggleBtn = surface.querySelector('[data-toggle-sidebar]');
      if (!toggleBtn) return;
      toggleBtn.classList.toggle('is-active', isExpanded);
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));
      const filterCount = getActiveFilterCount();
      const countBadge = filterCount > 0 ? `<span class="game-filter-badge">${filterCount}</span>` : '';
      toggleBtn.innerHTML = `
        <span class="toggle-icon">🔍</span>
        <span class="toggle-text">${isExpanded ? '필터 닫기' : '필터 & 검색'}</span>
        ${countBadge}
      `;
    }

    function getFilteredGames() {
      return gameList.filter(game => {
        if (activeCategory !== '전체' && game.category !== activeCategory && !game.category?.includes?.(activeCategory)) return false;
        if (activeAge !== '전체' && !game.age?.includes?.(activeAge) && !game.ageGroup?.includes?.(activeAge)) return false;
        if (activeTheme !== '전체' && game.theme !== activeTheme) return false;
        if (searchQuery) {
          const matchTitle = (game.title || '').toLowerCase().includes(searchQuery);
          const matchDesc = (game.description || game.summary || '').toLowerCase().includes(searchQuery);
          const matchCat = (game.category || '').toLowerCase().includes(searchQuery);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }
        return true;
      });
    }

    function renderLibrary() {
      activeGame = null;
      layout.classList.remove('is-playing');
      const filtered = getFilteredGames();
      const featuredGame = filtered.find(g => g.featured) || filtered[0] || gameList[0];
      const isExpanded = layout.classList.contains('sidebar-expanded');
      const filterCount = getActiveFilterCount();
      const countBadge = filterCount > 0 ? `<span class="game-filter-badge">${filterCount}</span>` : '';

      const categories = [
        { label: '🌟 전체', key: '전체' },
        { label: '📐 수·과학', key: '수·과학' },
        { label: '🌿 자연탐구', key: '자연탐구' },
        { label: '🏃 신체운동', key: '신체운동' },
        { label: '💬 의사소통', key: '의사소통' },
        { label: '🎵 예술경험', key: '예술경험' }
      ];

      let contentHtml = `
        <div class="game-library-view">
          <div class="game-library-header">
            <div class="game-library-title-group">
              <p class="panel-kicker">GAME LIBRARY</p>
              <h1>🎮 킨더 놀이터 <span class="game-count-badge">${filtered.length}개의 놀이</span></h1>
              <p class="game-library-subtitle">가을 테마 누리과정 5개 영역 인터랙티브 놀이 모음</p>
            </div>
            <div class="game-header-actions">
              <button type="button" class="game-sidebar-toggle-btn${isExpanded ? ' is-active' : ''}" data-toggle-sidebar aria-expanded="${isExpanded}">
                <span class="toggle-icon">🔍</span>
                <span class="toggle-text">${isExpanded ? '필터 닫기' : '필터 & 검색'}</span>
                ${countBadge}
              </button>
            </div>
          </div>

          <nav class="game-quick-categories" aria-label="놀이 영역 필터">
            ${categories.map(c => `
              <button type="button" class="game-quick-cat${activeCategory === c.key ? ' is-active' : ''}" data-quick-cat="${c.key}">
                ${c.label}
              </button>
            `).join('')}
          </nav>
      `;

      // 추천 배너는 필터가 없는 기본 상태일 때 상단에 와이드로 전시
      if (featuredGame && !searchQuery && activeCategory === '전체' && activeAge === '전체' && activeTheme === '전체') {
        contentHtml += `
          <article class="game-hero-featured" data-play="${featuredGame.id}" tabindex="0" role="button" aria-label="${escapeHtml(featuredGame.title)} 시작하기" style="cursor:pointer;">
            <div class="game-hero-art">
              <img src="${featuredGame.cover || featuredGame.thumbnail}" alt="${escapeHtml(featuredGame.title)} 커버 이미지">
              <span class="game-hero-floating-badge">🍁 대표 추천 놀이</span>
            </div>
            <div class="game-hero-info">
              <div class="game-hero-badges">
                <span class="game-badge featured">이달의 놀이</span>
                <span class="game-badge cat">${escapeHtml(featuredGame.category || '놀이')}</span>
                <span class="game-badge age">${escapeHtml(featuredGame.age || '만 3~5세')}</span>
                <span class="game-badge time">${escapeHtml(featuredGame.time || featuredGame.playTime || '약 3분')}</span>
                <span class="game-badge season">가을 숲</span>
              </div>
              <h2>${escapeHtml(featuredGame.title)}</h2>
              <p>${escapeHtml(featuredGame.summary || featuredGame.description || '')}</p>
              <div class="game-hero-actions">
                <button type="button" class="game-play-btn" data-play="${featuredGame.id}">지금 플레이하기 ▶</button>
                <span class="game-play-tip">💡 클릭하면 설치 없이 바로 실행됩니다</span>
              </div>
            </div>
          </article>
        `;
      }

      if (!filtered.length) {
        contentHtml += `
          <div class="game-empty-state">
            <p style="font-size:36px; margin-bottom:12px;">🔍</p>
            <h3>조건에 맞는 놀이를 찾지 못했어요</h3>
            <p style="margin-top:6px; color:var(--text-sub);">검색어를 바꾸거나 필터 조건을 초기화해보세요.</p>
            <button type="button" class="soft-button" style="margin-top:16px; display:inline-block;" data-filter-reset-quick>↺ 조건 초기화</button>
          </div>
        `;
      } else {
        contentHtml += `
          <div class="game-cards-section">
            <div class="game-section-header">
              <h3>🍁 가을 놀이터 전체 목록 (${filtered.length})</h3>
              <span class="game-section-guide">원하는 놀이 카드를 클릭하면 즉시 시작됩니다</span>
            </div>
            <div class="game-grid">
              ${filtered.map(game => `
                <article class="game-card-item" data-play="${game.id}" tabindex="0" role="button" aria-label="${escapeHtml(game.title)} 시작하기">
                  <div class="game-card-thumb">
                    <img src="${game.thumbnail}" alt="${escapeHtml(game.title)}" loading="lazy">
                    <span class="game-card-hover-play">▶ 플레이</span>
                  </div>
                  <div class="game-card-meta-top">
                    <span class="game-badge cat">${escapeHtml(game.category || '놀이')}</span>
                    <span class="game-badge age">${escapeHtml(game.age || '')}</span>
                  </div>
                  <div class="game-card-meta">
                    <h4>${escapeHtml(game.title)}</h4>
                    <p>${escapeHtml(game.summary || game.description || '')}</p>
                  </div>
                  <div class="game-card-footer">
                    <span>⏱️ ${escapeHtml(game.playTime || game.time || '약 3분')}</span>
                    <span class="game-card-action">놀이 시작 →</span>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        `;
      }

      contentHtml += `</div>`;
      surface.innerHTML = contentHtml;

      // 상단 사이드바 토글 버튼 이벤트
      surface.querySelector('[data-toggle-sidebar]')?.addEventListener('click', () => {
        layout.classList.toggle('sidebar-expanded');
        updateSidebarToggleBtn();
      });

      // 퀵 카테고리 탭 클릭 이벤트
      surface.querySelectorAll('[data-quick-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.quickCat;
          renderSidebar();
          renderLibrary();
        });
      });

      // 빈 화면 초기화 버튼 이벤트
      surface.querySelector('[data-filter-reset-quick]')?.addEventListener('click', () => {
        activeCategory = '전체';
        activeAge = '전체';
        activeTheme = '전체';
        searchQuery = '';
        renderSidebar();
        renderLibrary();
      });

      // 게임 플레이 버튼 및 카드 클릭 이벤트 바인딩
      surface.querySelectorAll('[data-play]').forEach(el => {
        el.addEventListener('click', e => {
          e.stopPropagation();
          const gameId = el.dataset.play;
          if (gameId) renderStage(gameId);
        });
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const gameId = el.dataset.play;
            if (gameId) renderStage(gameId);
          }
        });
      });
    }

    function renderStage(id) {
      activeGame = gameList.find(g => g.id === id);
      if (!activeGame) return;

      layout.classList.add('is-playing');
      const entryUrl = activeGame.entry || `./games/${activeGame.id}/index.html`;
      const guide = activeGame.teacherGuide || {};

      try {
        history.replaceState(null, '', '?id=' + encodeURIComponent(id));
      } catch (_) {}

      surface.innerHTML = `
        <div class="game-stage-view">
          <div class="game-stage-toolbar">
            <button class="soft-button" type="button" data-game-back>← 게임 목록</button>
            <strong>${escapeHtml(activeGame.title)} <span class="meta">· ${escapeHtml(activeGame.category || '')}</span></strong>
            <button class="soft-button teacher-guide-btn" type="button" data-teacher-guide>💡 지도 팁</button>
            <button class="soft-button" type="button" data-restart>다시 시작</button>
            <button class="soft-button" type="button" data-volume aria-pressed="${isMuted ? 'true' : 'false'}">${isMuted ? '🔇 음소거됨' : '🔊 소리 켬'}</button>
            <button class="soft-button" type="button" data-fullscreen>전체화면</button>
          </div>
          <div class="game-frame-container" id="game-frame-container">
            <div class="game-frame-wrapper">
              <iframe id="game-sandbox-iframe" src="${entryUrl}" allow="fullscreen; autoplay" title="${escapeHtml(activeGame.title)}"></iframe>
            </div>
          </div>
          <!-- 교사 지도 가이드 드로어 (Rule 18) -->
          <div class="teacher-guide-drawer" id="teacher-guide-drawer" hidden>
            <div class="teacher-guide-header">
              <div class="guide-title-row">
                <span class="guide-icon">💡</span>
                <h3>교사 지도 가이드</h3>
              </div>
              <button class="soft-button guide-close-btn" type="button" data-close-guide aria-label="닫기">✕</button>
            </div>
            <div class="teacher-guide-body">
              <div class="guide-card">
                <span class="guide-kicker">🎯 누리과정 연계 영역</span>
                <p class="guide-nuri">${escapeHtml(guide.nuriArea || '해당 놀이의 누리과정 연계 내용입니다.')}</p>
                <div class="guide-sub-info">
                  <strong>핵심 발달 역량:</strong> ${escapeHtml(guide.coreCompetency || '탐구 및 조작 능력')}
                </div>
              </div>
              <div class="guide-card">
                <span class="guide-kicker">💬 선생님 상호작용 발문 예시</span>
                <ul class="guide-prompt-list">
                  ${(guide.prompts || ['“아이와 함께 게임 속 그림을 이야기해보세요.”']).map(p => `<li>${escapeHtml(p)}</li>`).join('')}
                </ul>
              </div>
              <div class="guide-card">
                <span class="guide-kicker">🎨 오프라인 연계 확장 활동</span>
                <ul class="guide-activity-list">
                  ${(guide.offlineActivities || ['교실 바깥놀이 및 미술 영역과 연계해 활동을 확장해보세요.']).map(a => `<li>${escapeHtml(a)}</li>`).join('')}
                </ul>
              </div>
              <div class="guide-card guide-worksheet-box">
                <span class="guide-kicker">🖨️ 수업 연계 활동지</span>
                <p><strong>${escapeHtml(guide.worksheet || '활동지')}</strong></p>
                <button class="btn-print-worksheet" type="button" data-print-worksheet>📄 활동지 인쇄하기</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // 지도 팁 드로어 토글
      const guideDrawer = surface.querySelector('#teacher-guide-drawer');
      surface.querySelector('[data-teacher-guide]')?.addEventListener('click', () => {
        if (guideDrawer) guideDrawer.hidden = !guideDrawer.hidden;
      });
      surface.querySelector('[data-close-guide]')?.addEventListener('click', () => {
        if (guideDrawer) guideDrawer.hidden = true;
      });
      surface.querySelector('[data-print-worksheet]')?.addEventListener('click', () => {
        window.print();
      });

      // 뒤로가기 버튼
      surface.querySelector('[data-game-back]')?.addEventListener('click', () => {
        try { history.replaceState(null, '', window.location.pathname); } catch (_) {}
        renderLibrary();
      });

      const iframe = surface.querySelector('#game-sandbox-iframe');

      function sendToGame(type, payload) {
        if (!iframe || !iframe.contentWindow) return;
        iframe.contentWindow.postMessage({
          source: 'kinder-edu-host',
          type: type,
          gameId: activeGame.id,
          payload: payload || {}
        }, '*');
      }

      surface.querySelector('[data-restart]').addEventListener('click', () => {
        sendToGame('HOST_RESTART');
        if (iframe) iframe.src = entryUrl;
      });

      const volumeBtn = surface.querySelector('[data-volume]');
      volumeBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        volumeBtn.setAttribute('aria-pressed', String(isMuted));
        volumeBtn.textContent = isMuted ? '🔇 음소거됨' : '🔊 소리 켬';
        sendToGame('HOST_SET_MUTED', { muted: isMuted });
      });

      const fullscreenBtn = surface.querySelector('[data-fullscreen]');
      fullscreenBtn.addEventListener('click', () => {
        const frameContainer = surface.querySelector('#game-frame-container');
        if (!document.fullscreenElement) {
          if (frameContainer.requestFullscreen) {
            frameContainer.requestFullscreen();
          } else if (frameContainer.webkitRequestFullscreen) {
            frameContainer.webkitRequestFullscreen();
          }
        } else {
          document.exitFullscreen?.();
        }
      });
    }

    // 포스트메시지 수신 (게임 -> 호스트)
    window.addEventListener('message', event => {
      const data = event.data;
      if (!data || data.source !== 'kinder-edu-game') return;
      if (data.type === 'REQUEST_FULLSCREEN') {
        const frameContainer = surface.querySelector('#game-frame-container');
        frameContainer?.requestFullscreen?.();
      }
      if (data.type === 'EXIT_GAME') {
        try { history.replaceState(null, '', window.location.pathname); } catch (_) {}
        renderLibrary();
      }
    });

    surface.addEventListener('click', event => {
      const playBtn = event.target.closest('[data-play]');
      if (playBtn) {
        renderStage(playBtn.dataset.play);
      }
      if (event.target.closest('[data-game-back]')) {
        try { history.replaceState(null, '', window.location.pathname); } catch (_) {}
        renderLibrary();
      }
    });

    surface.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        const playBtn = event.target.closest('[data-play]');
        if (playBtn) {
          event.preventDefault();
          renderStage(playBtn.dataset.play);
        }
      }
    });

    renderSidebar();
    const initialGameId = new URLSearchParams(window.location.search).get('id');
    if (initialGameId && gameList.some(g => g.id === initialGameId)) {
      renderStage(initialGameId);
    } else {
      renderLibrary();
    }
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
