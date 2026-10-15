// Host-only adapter. All face editing, templates and models live in the independent face-ssok project.
const TOOL_ID='face-ssok',VERSION=1;
const local=['http://127.0.0.1:5188','http://localhost:5188','http://127.0.0.1:8126','http://127.0.0.1:5191'].includes(location.origin);
const entry=new URL(local?'http://127.0.0.1:5190/?embed=kinder-edu':'https://face-ssok.vercel.app/?embed=kinder-edu');
let frame,snapshot,ready=false,loaded,resolveLoad,rejectLoad,loadTimer,dirty=false;
function send(type,extra={}){if(ready&&frame?.isConnected)frame.contentWindow.postMessage({type,toolId:TOOL_ID,version:VERSION,...extra},entry.origin);}
function sendClass(){
  const c=snapshot?.classes?.find(c=>c.id===snapshot.activeId),selected=new Set(snapshot?.selectedIds||[]);
  const children=(c?.children||[]).filter(child=>selected.has(child.id)).map(({id,num,name,image})=>({id,num,name,image:image||null}));
  send('KINDER_MAKING_CLASS',{classInfo:c?{year:c.year||'',className:c.className||''}:{},children,sentAt:new Date().toISOString()});
}
window.addEventListener('message',event=>{
  if(!frame||event.source!==frame.contentWindow||event.origin!==entry.origin)return;
  const data=event.data;if(data?.version!==VERSION||data.toolId!==TOOL_ID)return;
  if(data.type==='KINDER_MAKING_READY'){ready=true;clearTimeout(loadTimer);resolveLoad?.();sendClass();}
  if(data.type==='KINDER_MAKING_DIRTY'&&data.dirty===true)dirty=true;
  if(data.type==='KINDER_MAKING_HEIGHT'&&Number.isFinite(data.height)){
    const workspace=document.querySelector('#making-workspace');if(workspace)workspace.style.minHeight=matchMedia('(max-width:1200px)').matches?`${Math.max(520,Math.min(2000,data.height))}px`:'';
  }
});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
async function mount(target,adapter){
  snapshot=adapter.getSnapshot();
  if(frame?.isConnected){sendClass();return loaded;}
  ready=false;loaded=new Promise((resolve,reject)=>{resolveLoad=resolve;rejectLoad=reject;});
  frame=document.createElement('iframe');frame.dataset.makingFrame=TOOL_ID;frame.title='얼굴쏙 편집기';frame.src=entry.href;
  frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox allow-modals');
  frame.referrerPolicy='strict-origin';frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#fff;min-width:0;';
  target.replaceChildren(frame);
  const failed=message=>{clearTimeout(loadTimer);ready=false;frame?.remove();rejectLoad?.(new Error(message));};
  frame.onerror=()=>failed('얼굴쏙 연결에 실패했습니다. 다시 실행해주세요.');
  loadTimer=setTimeout(()=>failed('얼굴쏙 응답이 없습니다. 연결을 확인하고 다시 실행해주세요.'),45000);
  return loaded;
}
async function update(next){snapshot=next;sendClass();}
async function selectPerson(childId){if(snapshot?.selectedIds?.includes(childId))send('KINDER_MAKING_SELECT',{childId});}
window.FaceSsok={mount,update,selectPerson};
