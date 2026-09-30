import Phaser from 'phaser';
import {Sound} from './Sound';
type Bridge={ready():void;start():void;complete(stats:object):void;onRestart(cb:()=>void):void;onMuteChange(cb:(muted:boolean)=>void):void;toggleSound():boolean;isMuted():boolean;requestFullscreen():void};
declare global{interface Window{KinderGameBridge?:{createGameClient(id:string):Bridge}}}
export class GameShell{
 readonly sound=new Sound();readonly bridge=window.KinderGameBridge?.createGameClient('acorn-collector');
 constructor(private restart:()=>void){this.bridge?.onRestart(()=>this.reset());this.bridge?.onMuteChange(m=>this.mute(m));document.getElementById('restart')!.onclick=()=>this.reset();document.getElementById('sound')!.onclick=()=>this.mute(this.bridge?this.bridge.toggleSound():!this.sound.muted);document.getElementById('fullscreen')!.onclick=()=>{if(window.parent!==window)this.bridge?.requestFullscreen();else if(document.fullscreenElement)void document.exitFullscreen();else void document.documentElement.requestFullscreen?.();};this.mute(this.bridge?.isMuted()??false);}
 reset(){this.sound.stop();this.restart();}
 mute(value:boolean){this.sound.setMuted(value);const b=document.getElementById('sound')!;b.textContent=value?'♫̸':'♪';b.setAttribute('aria-label',value?'소리 켜기':'소리 끄기');b.setAttribute('aria-pressed',String(value));}
 announce(text:string){document.getElementById('announcement')!.textContent=text;}
 ready(){document.getElementById('loading')!.hidden=true;this.bridge?.ready();}
}
export function createGame(scene:Phaser.Scene){return new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1600,height:900,backgroundColor:'#342013',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},input:{activePointers:3},scene,render:{antialias:true,pixelArt:false}});}
