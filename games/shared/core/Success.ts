import Phaser from 'phaser';
export function celebrate(scene:Phaser.Scene,squirrel:Phaser.GameObjects.Image,again:()=>void){squirrel.setTexture('squirrel-happy');scene.tweens.add({targets:squirrel,y:squirrel.y-65,angle:{from:-5,to:5},duration:290,yoyo:true,repeat:5,ease:'Sine.InOut'});
 for(let i=0;i<48;i++){const p=scene.add.rectangle(Phaser.Math.Between(180,1460),-40,Phaser.Math.Between(8,16),Phaser.Math.Between(12,23),[0xffd569,0xfff0c9,0xe87837][i%3]).setDepth(40);scene.tweens.add({targets:p,y:940,x:p.x+Phaser.Math.Between(-150,150),angle:Phaser.Math.Between(180,720),duration:Phaser.Math.Between(2000,3500),delay:i*25,onComplete:()=>p.destroy()});}
 const panel=scene.add.rectangle(860,354,630,175,0xffedc5,.97).setStrokeStyle(5,0x844a24).setDepth(35);
 const text=scene.add.text(860,320,'가을 준비 끝!',{fontFamily:'sans-serif',fontSize:'48px',fontStyle:'bold',color:'#5c301c'}).setOrigin(.5).setDepth(36);
 const button=scene.add.text(860,395,'↻  한 번 더',{fontFamily:'sans-serif',fontSize:'30px',fontStyle:'bold',color:'#754321',backgroundColor:'#ffcf72',padding:{x:28,y:10}}).setOrigin(.5).setDepth(36).setInteractive({useHandCursor:true}).on('pointerdown',again);
 scene.tweens.add({targets:[panel,text,button],alpha:{from:0,to:1},duration:350});
}
