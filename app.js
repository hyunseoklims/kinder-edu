document.querySelectorAll('.nav-toggle').forEach(btn=>btn.addEventListener('click',()=>{const nav=document.querySelector('.site-nav');const open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));}));
document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
const apps=document.querySelectorAll('.app');const title=document.querySelector('#program-title');const msg=document.querySelector('#character-message');
apps.forEach(app=>app.addEventListener('click',()=>{apps.forEach(x=>x.classList.remove('active'));app.classList.add('active');if(title)title.textContent=app.dataset.app;if(msg)msg.innerHTML=app.dataset.app==='Photo TwinSweep'?'와! 이번 사진도<br>잘 찍었는데?':'이 도구도 곧<br>여기서 만나요!';}));
const analyze=document.querySelector('#analyze');if(analyze)analyze.addEventListener('click',()=>{analyze.disabled=true;analyze.textContent='분석 중…';if(msg)msg.innerHTML='사진을 차근차근<br>살펴보고 있어요.';setTimeout(()=>{analyze.disabled=false;analyze.textContent='분석 시작';if(msg)msg.innerHTML='정리가 끝났어요!<br>한번 확인해볼까요?';},1400);});
// Service page interactions
const classroomButtons=document.querySelectorAll('[data-classroom]');classroomButtons.forEach(b=>b.addEventListener('click',()=>{document.querySelector('#classroom')?.scrollIntoView({behavior:'smooth'});}));
document.querySelectorAll('.toon-person').forEach(p=>p.addEventListener('click',()=>{const was=p.classList.contains('show-info');document.querySelectorAll('.toon-person').forEach(x=>x.classList.remove('show-info'));if(!was)p.classList.add('show-info');}));

// Homepage service previews. Images and copy stay independent for easy updates.
const prototypeStage=document.querySelector('.prototype-stage');
if(prototypeStage){
  const services={
    programs:{number:'01 / 06',kicker:'FOR TEACHERS',title:'프로그램',description:'교실의 하루를 돕는 도구를 만나보세요.',hint:'교사를 위한 업무 도구',image:'./assets/brand/cards/programs-card-art-v3.png',href:'./programs.html'},
    magazine:{number:'02 / 06',kicker:'PLAY & IDEAS',title:'놀자 매거진',description:'다음 주의 놀이를 한눈에 살펴보세요.',hint:'주간 놀이 큐레이션',image:'./assets/brand/cards/play-magazine-card-art-v2.png',href:'./play.html'},
    games:{number:'03 / 06',kicker:'PLAY TOGETHER',title:'게임',description:'아이들과 함께하는 놀이의 문을 열어요.',hint:'게임 탐색',image:'./assets/brand/cards/games-card-art-v2.png',href:'./games.html'},
    making:{number:'04 / 06',kicker:'MAKE & SHARE',title:'만들기',description:'우리 반에 필요한 결과물을 만들어보세요.',hint:'이름표 · 카드 · 스티커',image:'./assets/brand/cards/making-card-art-v2.png',href:'./create.html'},
    webtoon:{number:'05 / 06',kicker:'ORIGINAL STORIES',title:'웹툰',description:'《공무가》의 인물과 이야기를 만나보세요.',hint:'오리지널 웹툰',image:'./assets/brand/cards/webtoon-card-art-v2.png',href:'./webtoon.html'},
    blog:{number:'06 / 06',kicker:'NOTES & IDEAS',title:'블로그',description:'교실과 일상에서 발견한 생각을 기록해요.',hint:'브랜드 노트',image:'./assets/brand/cards/blog-card-art-v2.png',href:'./blog.html'}
  };
  const railLinks=[...document.querySelectorAll('.prototype-rail-link')];
  const preview={number:document.querySelector('#preview-number'),kicker:document.querySelector('#preview-kicker'),title:document.querySelector('#preview-title'),description:document.querySelector('#preview-description'),hint:document.querySelector('#preview-hint'),image:document.querySelector('#preview-image'),open:document.querySelector('#preview-open')};
  let showTimer=0;
  let hideTimer=0;
  const isTouch=()=>window.matchMedia('(hover: none)').matches;
  const clearTimers=()=>{window.clearTimeout(showTimer);window.clearTimeout(hideTimer);};
  function showSection(key){
    const item=services[key];if(!item)return;
    clearTimers();
    preview.number.textContent=item.number;
    preview.kicker.textContent=item.kicker;
    preview.title.textContent=item.title;
    preview.description.textContent=item.description;
    preview.hint.textContent=item.hint;
    preview.image.src=item.image;
    preview.open.href=item.href;
    preview.open.setAttribute('aria-label',`${item.title} 페이지 열기`);
    prototypeStage.dataset.activeSection=key;
    prototypeStage.classList.add('is-previewing');
    railLinks.forEach(link=>link.classList.toggle('is-active',link.dataset.section===key));
  }
  function hidePreview(){clearTimers();prototypeStage.classList.remove('is-previewing');prototypeStage.dataset.activeSection='';railLinks.forEach(link=>link.classList.remove('is-active'));}
  function scheduleHide(){window.clearTimeout(hideTimer);hideTimer=window.setTimeout(hidePreview,450);}
  railLinks.forEach(link=>{
    link.addEventListener('pointerenter',event=>{if(event.pointerType==='touch')return;clearTimers();showTimer=window.setTimeout(()=>showSection(link.dataset.section),140);});
    link.addEventListener('pointerleave',()=>{window.clearTimeout(showTimer);scheduleHide();});
    link.addEventListener('focus',()=>{if(!isTouch())showSection(link.dataset.section);});
    link.addEventListener('click',event=>{if(!isTouch())return;if(prototypeStage.dataset.activeSection!==link.dataset.section){event.preventDefault();showSection(link.dataset.section);}});
  });
  prototypeStage.addEventListener('pointerenter',()=>window.clearTimeout(hideTimer));
  prototypeStage.addEventListener('pointerleave',scheduleHide);
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hidePreview();});
  document.addEventListener('pointerdown',event=>{if(isTouch()&&!event.target.closest('.prototype-rail,.prototype-stage'))hidePreview();});
}
