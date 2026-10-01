import { GameObjects, Scene } from "phaser";




export class Bird extends GameObjects.Sprite{

    constructor(scene: Scene, x:number,y:number, keyImage: string){
        super(scene, x, y, keyImage)

        this.setDepth(10)
        scene.add.existing(this)
        scene.physics.add.existing(this, false)
        this.setScale(0.17)
        if (this.body){
            const body = this.body as Phaser.Physics.Arcade.Body
            body.setSize(200, 250, true)         
            body.setGravityY(0)
   
        } else {
            const err = new Error('Not body')
            console.log(err)
        }
       
        

        
    }
    static preload(
        scene: Scene, 
        key: string, 
        path: string, 
        config?: Phaser.Types.Loader.FileTypes.ImageFrameConfig){   
        scene.load.image(key, path) 
    }
    animDead(){
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setVelocityY(-150)
        this.angle = 330
        this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                
                body.setGravityY(350)
            },
            loop: false,
            repeat: 0
        })
    }
}