import Phaser from 'phaser';
export type DropTarget={contains(x:number,y:number):boolean;hover(active:boolean):void;accept(item:Phaser.GameObjects.Image):void};
export function enableDrag(scene:Phaser.Scene,item:Phaser.GameObjects.Image,target:DropTarget,onStart:()=>void){const home={x:item.x,y:item.y,scaleX:item.scaleX,scaleY:item.scaleY,angle:item.angle};let committed=false,dragging=false;
 item.setInteractive(new Phaser.Geom.Rectangle(-item.width*.12,-item.height*.12,item.width*1.24,item.height*1.24),Phaser.Geom.Rectangle.Contains);scene.input.setDraggable(item);
 item.on('dragstart',()=>{dragging=true;onStart();scene.tweens.killTweensOf(item);item.setDepth(30).setScale(home.scaleX*1.12,home.scaleY*1.12);});
 item.on('drag',(_p:Phaser.Input.Pointer,x:number,y:number)=>{item.setPosition(Phaser.Math.Clamp(x,65,1535),Phaser.Math.Clamp(y,170,835));target.hover(target.contains(item.x,item.y));});
 const returnHome=()=>{target.hover(false);item.setDepth(8);scene.tweens.add({targets:item,...home,duration:350,ease:'Back.Out'});};
 item.on('dragend',()=>{dragging=false;if(committed)return;if(target.contains(item.x,item.y)){committed=true;item.disableInteractive();target.hover(false);target.accept(item);}else returnHome();});
 scene.input.on('gameout',()=>{if(!committed&&item.input&&dragging)returnHome();});
}
