import { GameObjects, Scene } from "phaser";

export class Pipe extends GameObjects.Sprite{
    body: Phaser.Physics.Arcade.Body;
    passed: boolean = false;
    constructor(scene: Scene, x:number,y:number, keyImage: string){
        super(scene,x,y,keyImage);
        this.setDepth(1)
        scene.add.existing(this)
        scene.physics.add.existing(this, false)
        this.body = this.body as Phaser.Physics.Arcade.Body;
        this.body.setGravity(0)
        this.body.setSize(200,760, true)
        this.setScale(0.4)
        this.body.setVelocityX(0)

    }


    static preload(
        scene: Scene, 
        key: string, 
        path: string, 
        config?: Phaser.Types.Loader.FileTypes.ImageFrameConfig){   
        scene.load.image(key, path) 
    }



}