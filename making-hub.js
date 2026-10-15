/* Local class hub. No class or image data is sent to a server. */
window.initMakingHub = async function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid = () => crypto.randomUUID();
  let db, state = {classes:[], activeId:null, updatedAt:null, backedUpAt:null}, selected = new Set();
  let draft = null, dirty = false, busy = false, timer;
  const dialog = $('#making-manager');
  const activeClass = () => state.classes.find(c => c.id === state.activeId);
  const notify = message => { $('#making-notice').textContent = message; $('#making-notice').classList.add('is-visible'); clearTimeout(timer); timer = setTimeout(() => $('#making-notice').classList.remove('is-visible'), 5000); };
  const avatar = child => child.image ? `<img class="making-avatar" src="${esc(child.image)}" alt="${esc(child.name)} 사진">` : '<span class="making-avatar" aria-label="사진 없음">사진</span>';
  const btn = (action, label, cls = '') => `<button class="making-btn ${cls}" type="button" data-action="${action}">${label}</button>`;

  function openDB() {
    return new Promise((resolve,reject) => {
      const request = indexedDB.open('KINDER_EDU_MAKING_LOCAL', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('hub');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('다른 만들기 창을 닫고 다시 열어주세요.'));
    });
  }
  function readState() {
    return new Promise((resolve,reject) => { const r = db.transaction('hub').objectStore('hub').get('state'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
  }
  async function persist(next, changed = true) {
    if (changed) next.updatedAt = new Date().toISOString();
    await new Promise((resolve,reject) => {
      const tx = db.transaction('hub','readwrite');
      tx.objectStore('hub').put(next,'state');
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('저장이 중단되었습니다.'));
    });
    state = next;
  }
  function normalizeClasses(classes) {
    if (!Array.isArray(classes) || classes.length > 100) throw new Error('학급 목록 형식이 올바르지 않습니다.');
    const ids = new Set();
    return classes.map(c => {
      if (!c || typeof c.id !== 'string' || !c.id || ids.has(c.id) || typeof c.className !== 'string' || !c.className.trim()) throw new Error('학급 정보가 올바르지 않습니다.');
      ids.add(c.id);
      if (!Array.isArray(c.children) || c.children.length > 200) throw new Error('학급원은 학급당 200명까지 등록할 수 있습니다.');
      const childIds = new Set();
      const children = c.children.map((child,i) => {
        if (!child || typeof child.id !== 'string' || childIds.has(child.id) || typeof child.name !== 'string' || !child.name.trim()) throw new Error('학급원 정보가 올바르지 않습니다.');
        childIds.add(child.id);
        if (child.image && (typeof child.image !== 'string' || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(child.image) || child.image.length > 4200000)) throw new Error('지원하지 않는 이미지 데이터입니다.');
        const birth = typeof child.birth === 'string' ? child.birth : '';
        if (birth && !/^\d{4}-\d{2}-\d{2}$/.test(birth)) throw new Error('생일 형식이 올바르지 않습니다.');
        return {id:child.id,num:i+1,name:child.name.trim().slice(0,60),birth,image:child.image || null};
      });
      return {id:c.id,year:String(c.year || new Date().getFullYear()).slice(0,4),className:c.className.trim().slice(0,60),ageGroup:String(c.ageGroup || '').slice(0,30),institution:String(c.institution || '').slice(0,80),teacherName:String(c.teacherName || '').slice(0,60),children};
    });
  }
  function renderSidebar() {
    const c = activeClass();
    $('#making-classes').innerHTML = `<p class="panel-kicker">MY CLASS</p><h1>우리 반</h1><span class="making-local">● 이 브라우저에만 저장됩니다</span>
      <label for="making-class-select">학급 선택</label><select id="making-class-select" ${state.classes.length?'':'disabled'}>${state.classes.length ? state.classes.map(item => `<option value="${esc(item.id)}" ${item.id===state.activeId?'selected':''}>${esc(item.year)}학년도 · ${esc(item.className)}</option>`).join('') : '<option>등록된 학급이 없어요</option>'}</select>
      <div class="making-actions">${btn('new','+ 새 학급')}${c?btn('edit','학급 관리'):''}</div>
      ${c ? `<div class="making-class-summary"><strong>${esc(c.className)}</strong><p>${esc(c.year)}학년도${c.ageGroup?' · '+esc(c.ageGroup):''} · ${c.children.length}명</p></div><div class="making-roster-head"><b>학급원 <span id="making-selected-count">${selected.size}</span>명 선택</b><button type="button" data-action="select-all">${selected.size===c.children.length && c.children.length?'선택 해제':'전체 선택'}</button></div><div class="making-roster">${c.children.length ? c.children.map(child => `<label class="making-child"> <input type="checkbox" data-child="${esc(child.id)}" ${selected.has(child.id)?'checked':''}>${avatar(child)}<b>${esc(child.name)}</b><small>${child.num}번</small></label>`).join('') : '<p class="making-empty">학급 관리에서 이름과 사진을<br>등록해주세요.</p>'}</div>` : '<p class="making-empty">학급을 만들고<br>아이들의 이름을 등록해보세요.<br>사진은 나중에 추가해도 괜찮아요.</p>'}
      <div class="making-backup"><div class="making-actions">${btn('export','백업 내보내기')}${btn('import','백업 가져오기')}</div><p>${state.updatedAt && (!state.backedUpAt || state.updatedAt > state.backedUpAt) ? '백업하지 않은 변경 사항이 있어요.' : state.backedUpAt ? '마지막 백업: '+esc(new Date(state.backedUpAt).toLocaleString('ko-KR')) : '학급 정보와 사진을 파일로 보관할 수 있어요.'}<br>사이트 데이터 삭제 전에는 꼭 백업해주세요.</p></div>`;
  }
  function renderWorkspace() {
    const workspace = $('#making-workspace');
    workspace.innerHTML = `<div class="making-welcome"><div class="making-welcome-icon">✂</div><span class="making-eyebrow">OUR CLASS, OUR CREATION</span><h2>우리 반의 이야기를<br>만들어보세요</h2><p>학급을 등록하고 아이들의 이름과 사진을 모아두세요.<br>만들기 도구에서 우리 반 자료를 활용할 수 있어요.</p><div class="making-steps"><span>01 학급 등록</span><span>02 학급원 선택</span><span>03 만들기 시작</span></div>${btn(activeClass()?'edit':'new',activeClass()?'우리 반 관리하기':'첫 학급 만들기','primary')}<p class="making-help">학급 정보와 사진은 서버로 업로드하지 않습니다.</p></div>`;
  }
  function readDraft() {
    if (!draft) return;
    const form = dialog.querySelector('form');
    for (const key of ['year','className','ageGroup','institution','teacherName']) draft[key] = form.elements[key].value;
    dialog.querySelectorAll('[data-row]').forEach(row => {
      const child = draft.children.find(ch => ch.id === row.dataset.row);
      child.name = row.querySelector('[data-field=name]').value;
      child.birth = row.querySelector('[data-field=birth]').value;
    });
  }
  function renderDraft() {
    dialog.innerHTML = `<form class="making-form"><header class="making-dialog-header"><h2 id="making-manager-title">${state.classes.some(c=>c.id===draft.id)?'학급 관리':'새 학급 만들기'}</h2>${btn('close','닫기')}</header><div class="making-info-fields">
      <label>학년도<input name="year" type="number" min="2000" max="2100" required value="${esc(draft.year)}"></label><label>학급명<input name="className" maxlength="60" required value="${esc(draft.className)}" placeholder="예: 햇살반"></label><label>연령<select name="ageGroup">${['','만 0세','만 1세','만 2세','만 3세','만 4세','만 5세','혼합 연령'].map(a=>`<option ${a===draft.ageGroup?'selected':''}>${a}</option>`).join('')}</select></label><label>기관명 (선택)<input name="institution" maxlength="80" value="${esc(draft.institution)}"></label><label>교사명 (선택)<input name="teacherName" maxlength="60" value="${esc(draft.teacherName)}"></label></div>
      <div class="making-member-head"><h3>학급원 <span>${draft.children.length}명</span></h3>${btn('add','+ 한 명 추가')}</div><p class="making-help">번호 · 사진 · 이름 · 생일 (선택)<br>사진은 JPG·PNG·WebP, 한 장당 3MB까지 등록할 수 있어요.</p>
      <div id="making-edit-rows">${draft.children.map((ch,i)=>`<div class="making-edit-row" data-row="${esc(ch.id)}"><span>${i+1}번</span>${avatar(ch)}<input data-field="name" aria-label="${i+1}번 이름" maxlength="60" required value="${esc(ch.name)}" placeholder="이름"><input data-field="birth" aria-label="${i+1}번 생일" type="date" value="${esc(ch.birth)}"><div>${btn('photo','사진 등록')}${ch.image?btn('remove-photo','사진 제거'):''}</div>${btn('remove-child','삭제','danger')}</div>`).join('')}</div>
      <label style="margin-top:20px">이름 한 번에 추가<textarea id="making-bulk-names" placeholder="한 줄에 한 명씩 입력해주세요"></textarea></label><div style="margin-top:8px">${btn('bulk','이름 목록 추가')}</div><p class="making-help">저장 버튼을 누르기 전까지 변경 사항은 반영되지 않습니다.</p><p class="making-error" role="alert"></p><footer class="making-dialog-footer">${state.classes.some(c=>c.id===draft.id)?btn('delete-class','학급 삭제','danger'):'<span></span>'}<div>${btn('close','취소')}<button class="making-btn primary" type="submit">학급 저장</button></div></footer></form>`;
  }
  function openManager(isNew = false) {
    draft = isNew || !activeClass() ? {id:uid(),year:String(new Date().getFullYear()),className:'',ageGroup:'',institution:'',teacherName:'',children:[]} : structuredClone(activeClass());
    dirty = false;
    renderDraft(); dialog.showModal();
  }
  function closeManager() { if (busy) return; if (dirty && !confirm('저장하지 않은 변경 사항을 버릴까요?')) return; dialog.close(); draft = null; dirty = false; }
  async function pickFile(accept) {
    return new Promise(resolve => {
      const input = document.createElement('input'); input.type='file'; input.accept=accept;
      input.addEventListener('change', () => resolve(input.files[0] || null), {once:true});
      input.addEventListener('cancel', () => resolve(null), {once:true}); input.click();
    });
  }
  async function imageData(file) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>3*1024*1024) throw new Error('JPG·PNG·WebP 이미지를 3MB 이하로 선택해주세요.');
    // Re-encode locally: bound image dimensions and strip embedded metadata.
    const bitmap = await createImageBitmap(file);
    try {
      if (bitmap.width * bitmap.height > 40000000) throw new Error('이미지 해상도가 너무 큽니다. 작은 이미지로 등록해주세요.');
      const scale = Math.min(1,1024/Math.max(bitmap.width,bitmap.height));
      const canvas = document.createElement('canvas'); canvas.width=Math.max(1,Math.round(bitmap.width*scale)); canvas.height=Math.max(1,Math.round(bitmap.height*scale));
      canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
      return canvas.toDataURL('image/webp',.9);
    } finally { bitmap.close(); }
  }
  async function exportBackup() {
    // Explicit save picker keeps cancellation from being reported as a backup.
    const backedUpAt = new Date().toISOString();
    const blob = new Blob([JSON.stringify({format:'kinder-making-backup',version:1,exportedAt:backedUpAt,classes:state.classes,activeId:state.activeId})],{type:'application/json'});
    const name = `킨더에듀-학급백업-${backedUpAt.slice(0,10)}.json`;
    if (window.showSaveFilePicker) {
      const handle = await window.showSaveFilePicker({suggestedName:name,types:[{description:'학급 백업',accept:{'application/json':['.json']}}]});
      const writer = await handle.createWritable(); await writer.write(blob); await writer.close();
      await persist({...state,backedUpAt},false); renderSidebar(); notify('학급 정보와 사진 백업을 저장했습니다.');
    } else {
      const url=URL.createObjectURL(blob), a=document.createElement('a'); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),30000);
      notify('백업 다운로드를 요청했습니다. 파일이 저장되었는지 확인해주세요.');
    }
  }
  async function importBackup() {
    const file = await pickFile('.json,application/json'); if (!file) return;
    if (file.size>150*1024*1024) throw new Error('백업 파일은 150MB 이하로 선택해주세요.');
    const backup=JSON.parse(await file.text());
    if (backup.format!=='kinder-making-backup' || backup.version!==1) throw new Error('킨더에듀 학급 백업 파일이 아닙니다.');
    const classes=normalizeClasses(backup.classes);
    if (!classes.length) throw new Error('백업에 등록된 학급이 없습니다.');
    if (!confirm(`${classes.length}개 학급을 추가할까요? 현재 학급은 유지됩니다.`)) return;
    // Import as copies, so a backup can never overwrite a current class.
    classes.forEach(c=>{c.id=uid();c.children.forEach(ch=>ch.id=uid());});
    if (classes.length+state.classes.length>100) throw new Error('학급은 최대 100개까지 보관할 수 있습니다.');
    await persist({...state,classes:[...state.classes,...classes],activeId:classes[0].id}); selected.clear(); renderSidebar(); renderWorkspace(); notify('백업의 학급과 사진을 추가했습니다.');
  }
  async function action(name, target) {
    if (name==='new') { if (state.classes.length>=100) throw new Error('학급은 최대 100개까지 등록할 수 있습니다.'); openManager(true); }
    if (name==='edit') openManager();
    if (name==='close') closeManager();
    if (name==='select-all') { const c=activeClass(); selected=selected.size===c.children.length ? new Set() : new Set(c.children.map(ch=>ch.id));renderSidebar(); }
    if (name==='export') await exportBackup();
    if (name==='import') await importBackup();
    if (['add','bulk','photo','remove-photo','remove-child'].includes(name)) {
      readDraft();
      if (name==='add') { if (draft.children.length>=200) throw new Error('학급원은 200명까지 등록할 수 있습니다.'); draft.children.push({id:uid(),name:'',birth:'',image:null}); }
      if (name==='bulk') { const names=$('#making-bulk-names').value.split(/\r?\n/).map(n=>n.trim()).filter(Boolean); if (!names.length) return; if (draft.children.length+names.length>200) throw new Error('학급원은 200명까지 등록할 수 있습니다.'); draft.children.push(...names.map(name=>({id:uid(),name:name.slice(0,60),birth:'',image:null}))); }
      const row=target.closest('[data-row]'); const child=row && draft.children.find(ch=>ch.id===row.dataset.row);
      if (name==='remove-child') { if (!confirm(`${child.name || '이 학급원'}을 목록에서 삭제할까요?`)) return; draft.children=draft.children.filter(ch=>ch.id!==child.id); }
      if (name==='remove-photo') child.image=null;
      if (name==='photo') { const file=await pickFile('image/jpeg,image/png,image/webp'); if (!file) return; child.image=await imageData(file); }
      dirty=true;renderDraft();
    }
    if (name==='delete-class') {
      if (!confirm(`‘${draft.className}’ 학급과 사진을 삭제할까요? 백업이 없으면 복구할 수 없습니다.`)) return;
      const classes=state.classes.filter(c=>c.id!==draft.id);
      await persist({...state,classes,activeId:classes[0]?.id || null}); selected.clear(); dirty=false;dialog.close();draft=null;renderSidebar();renderWorkspace();notify('학급을 삭제했습니다.');
    }
  }
  function report(error) { if (error?.name==='AbortError') return; const message=error?.name==='QuotaExceededError' ? '저장 공간이 부족합니다. 백업 후 사용하지 않는 사진을 정리해주세요.' : error.message || '처리하지 못했습니다. 다시 시도해주세요.'; if (dialog.open) dialog.querySelector('.making-error').textContent=message; else notify(message); }
  document.addEventListener('click', async event => {
    const target=event.target.closest('[data-action]'); if (!target || (!target.closest('.making-layout') && !target.closest('#making-manager'))) return;
    if (busy) return;
    busy=true;
    // Closing does not acquire the write lock.
    if (target.dataset.action==='close') busy=false;
    try { await action(target.dataset.action,target); } catch(error) {report(error);} finally {busy=false;}
  });
  $('#making-classes').addEventListener('change',async event=>{
    if (busy) {renderSidebar();return;}
    if (event.target.matches('[data-child]')) {event.target.checked?selected.add(event.target.dataset.child):selected.delete(event.target.dataset.child);renderSidebar();}
    if (event.target.id==='making-class-select') {
      busy=true;
      try {await persist({...state,activeId:event.target.value},false);selected.clear();renderSidebar();renderWorkspace();} catch(error){report(error);renderSidebar();} finally {busy=false;}
    }
  });
  dialog.addEventListener('input',()=>{dirty=true;});
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeManager();});
  dialog.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;busy=true;
    try {readDraft();const clean=normalizeClasses([draft])[0]; const classes=state.classes.filter(c=>c.id!==clean.id);classes.push(clean);await persist({...state,classes,activeId:clean.id});selected=new Set([...selected].filter(id=>clean.children.some(ch=>ch.id===id)));dirty=false;dialog.close();draft=null;renderSidebar();renderWorkspace();notify('학급 정보와 사진을 이 브라우저에 저장했습니다.');} catch(error){report(error);} finally {busy=false;}
  });
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  try {
    db=await openDB();
    const saved=await readState();
    if (saved) state={...saved,classes:normalizeClasses(saved.classes)};
    else {
      // Read-only migration of the previous editor's local class list.
      const old=localStorage.getItem('KINDER_EDU_CLASSES_V1');
      if(old){state.classes=normalizeClasses(JSON.parse(old));state.activeId=localStorage.getItem('KINDER_EDU_ACTIVE_CLASS_ID');await persist(state);}
    }
    if(!activeClass())state.activeId=state.classes[0]?.id || null;
    renderSidebar();renderWorkspace();
  } catch(error) {
    $('#making-classes').innerHTML='<h1>로컬 저장소 확인</h1><p class="making-empty">학급 정보를 불러오지 못했습니다.<br>브라우저의 사이트 저장 권한을 확인하고 새로고침해주세요.<br>기존 저장 데이터는 삭제하지 않았습니다.</p>';
    renderWorkspace();$('#making-workspace').querySelectorAll('[data-action]').forEach(b=>b.disabled=true);report(error);
  }
};
