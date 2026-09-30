import Phaser from 'phaser';
export class Progress{
 count=0;private icons:Phaser.GameObjects.Image[]=[];
 constructor(private scene:Phaser.Scene,total:number,texture:string){const g=scene.add.graphics().setDepth(20);g.fillStyle(0x62361f).fillRoundedRect(586,26,468,110,48);g.fillStyle(0xffedc5).fillRoundedRect(594,32,452,98,42);g.lineStyle(3,0xe6b36b).strokeRoundedRect(599,37,442,88,38);for(let i=0;i<total;i++)this.icons.push(scene.add.image(654+i*83,79,texture).setDisplaySize(57,65).setAlpha(.25).setDepth(21));}
 add(){const image=this.icons[this.count++];image.setAlpha(1);this.scene.tweens.add({targets:image,scaleX:image.scaleX*1.25,scaleY:image.scaleY*1.25,yoyo:true,duration:180});return this.count;}
}
