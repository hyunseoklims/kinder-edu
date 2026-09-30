export class Sound {
 muted=false;
 private audio?:AudioContext;
 unlock(){try{this.audio??=new AudioContext();void this.audio.resume();}catch{}}
 setMuted(value:boolean){this.muted=value;if(value)window.speechSynthesis?.cancel();}
 speak(text:string){if(this.muted||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=0.82;const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith('ko'));if(voice)u.voice=voice;speechSynthesis.speak(u);}
 chime(count:number){if(this.muted)return;this.unlock();const ctx=this.audio;if(!ctx)return;const now=ctx.currentTime;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=[523,587,659,784,880][count-1]??523;gain.gain.setValueAtTime(.16,now);gain.gain.exponentialRampToValueAtTime(.001,now+.45);osc.connect(gain).connect(ctx.destination);osc.start(now);osc.stop(now+.5);}
 stop(){window.speechSynthesis?.cancel();}
}
