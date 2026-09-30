import Phaser from 'phaser';
import {createGame,GameShell} from '../../shared/core/GameShell';
import {Progress} from '../../shared/core/Progress';
import {enableDrag} from '../../shared/core/Drag';
import {celebrate} from '../../shared/core/Success';
import {assets,acornPositions,basketTarget} from './assets';
let shell:GameShell;
class AutumnScene extends Phaser.Scene{
 constructor(){super('autumn');}
 preload(){for(const [key,url]of Object.entries(assets))this.load.image(key,url);this.load.on('loaderror',()=>{document.getElementById('loading')!.textContent='숲 그림을 불러오지 못했어요. 다시 시작해 주세요.';});}
 create(){
 this.add.image(800,450,'background').setDisplaySize(1600,900);
 // Functional HUD surfaces; all representational game artwork is separately loaded raster art.
 const panel=this.add.graphics().setDepth(20);panel.fillStyle(0x61351e).fillRoundedRect(34,26,445,148,24);panel.fillStyle(0xffedc5).fillRoundedRect(40,30,433,138,20);panel.lineStyle(3,0xe0ae67).strokeRoundedRect(47,37,419,124,17);
 this.add.text(254,72,'다람쥐의 가을 준비',{fontFamily:'sans-serif',fontSize:'31px',fontStyle:'bold',color:'#5a2e19'}).setOrigin(.5).setDepth(21);
 this.add.text(254,126,'도토리 5개를 모아보아요!',{fontFamily:'sans-serif',fontSize:'27px',fontStyle:'bold',color:'#784523'}).setOrigin(.5).setDepth(21);
 const progress=new Progress(this,5,'acorn');
 this.add.ellipse(244,755,335,44,0x563519,.25);
 const squirrel=this.add.image(233,527,'squirrel').setDisplaySize(420,378).setDepth(5);
 this.tweens.add({targets:squirrel,y:521,duration:1700,yoyo:true,repeat:-1,ease:'Sine.InOut'});
 this.add.ellipse(1380,800,288,36,0x4f2b14,.28);
 const halo=this.add.ellipse(1380,709,340,120,0xffe496,.18).setStrokeStyle(7,0xffefb5,.7).setDepth(4);
 const basket=this.add.image(1380,641,'basket').setDisplaySize(338,338).setDepth(6);
 const cue=this.add.text(1375,449,'↓',{fontSize:'64px',fontStyle:'bold',color:'#fff5cd',stroke:'#825027',strokeThickness:5}).setOrigin(.5).setDepth(7);
 this.tweens.add({targets:cue,y:466,alpha:.6,duration:800,yoyo:true,repeat:-1});
 const helpBg=this.add.graphics().setDepth(6);helpBg.fillStyle(0xfff1cf,.98).fillRoundedRect(46,789,365,70,24).lineStyle(3,0xc38b48).strokeRoundedRect(46,789,365,70,24);
 const help=this.add.text(228,824,'도토리를 바구니에 쏙!',{fontFamily:'sans-serif',fontSize:'26px',fontStyle:'bold',color:'#62361f'}).setOrigin(.5).setDepth(7);
 let started=false,pending=0;
 const contains=(x:number,y:number)=>Math.abs(x-basketTarget.x)<basketTarget.width/2&&Math.abs(y-basketTarget.y)<basketTarget.height/2;
 const hover=(active:boolean)=>{halo.setAlpha(active?1:.45);basket.setTint(active?0xfff3c8:0xffffff);cue.setVisible(!active&&progress.count===0);};
 const accept=(item:Phaser.GameObjects.Image)=>{const n=progress.add();pending++;shell.sound.chime(n);shell.sound.speak(['하나','둘','셋','넷','다섯'][n-1]);shell.announce(`도토리 ${n}개를 모았어요.`);
 const number=this.add.text(1380,519,String(n),{fontFamily:'sans-serif',fontSize:'94px',fontStyle:'bold',color:'#fff4bc',stroke:'#7b401d',strokeThickness:8}).setOrigin(.5).setDepth(32);
 this.tweens.add({targets:number,y:435,alpha:0,duration:1000,onComplete:()=>number.destroy()});
 this.tweens.add({targets:item,x:1380+(n-3)*24,y:671,scaleX:item.scaleX*.6,scaleY:item.scaleY*.6,angle:(n-3)*13,duration:400,ease:'Cubic.Out',onComplete:()=>{item.setDepth(7);pending--;if(progress.count===5&&pending===0){this.tweens.killTweensOf(squirrel);help.setText('고마워! 겨울이 든든해!');celebrate(this,squirrel,()=>shell.reset());shell.sound.speak('다 모았네! 고마워!');shell.bridge?.complete({collected:5});}}});
 this.tweens.add({targets:basket,angle:{from:-3,to:3},duration:110,yoyo:true,repeat:1,onComplete:()=>basket.setAngle(0)});cue.setVisible(false);};
 for(const [x,y,angle]of acornPositions){this.add.ellipse(x,y+45,98,23,0x56321c,.22).setDepth(3);const acorn=this.add.image(x,y,'acorn').setDisplaySize(112,116).setAngle(angle).setDepth(8);enableDrag(this,acorn,{contains,hover,accept},()=>{shell.sound.unlock();if(!started){started=true;shell.bridge?.start();}help.setText('바구니에 쏙!');});}
 shell.ready();this.events.once('shutdown',()=>{shell.sound.stop();});
 }
}
const scene=new AutumnScene();shell=new GameShell(()=>scene.scene.restart());createGame(scene);
