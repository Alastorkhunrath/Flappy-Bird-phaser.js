import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

import { Bird } from '../entities/Bird';
import { Pipe } from '../entities/Pipe';
import { Math } from 'phaser';

import { FontsConfig } from '../configs/fonts.config'


let coordXPipe = 1100

interface Pair {
    pipeBottom: Pipe,
    pipeTop: Pipe
}

export class Game extends Scene
{
    start: boolean = false
    bird: Bird
    pipeBottom: Pipe
    pipeTop: Pipe
    pipes: Pair[] = []
    gameOver: boolean = false

    score: number = 0
    recordScore: number = 0


    // UI
    scoreText: Phaser.GameObjects.Text
    background: Phaser.GameObjects.Image
    restartButton: Phaser.GameObjects.Text



    constructor ()
    {
        super('Game');
    }

    init(){

        EventBus.on('show-record-in-game', (record: number) => {
            try{
                this.recordScore = record
            } catch(err){
                console.error('Not data on record score', err)
                this.recordScore = 0
            }
        })

    }

    preload ()
    {
        this.load.image('background', 'assets/back.png');

        this.load.font('PixelFontMono', 'fonts/pixel/PixeloidMono.otf', 'opentype');

        Bird.preload(this, 'bird', 'assets/bird.png')
        Pipe.preload(this, 'pipe_bottom', 'assets/pipe_bottom.png')
        Pipe.preload(this, 'pipe_top', 'assets/pipe_top.png')

        // this.load.bitmapFont(FontsConfig.BITMAP.PIXEL, )
        

    }

    create ()
    {
        const SCREEN_WIDTH = Number(this.game.config.width)
        const SCREEN_HEIGHT = Number(this.game.config.height)



        // this.physics.add.image(0,0, 'background').setOrigin(0,0)
        this.background = this.add.image(0,0, 'background').setOrigin(0,0).setDepth(-1);
        this.bird = new Bird(this, 100, 250, 'bird')
        console.log(this.physics.config)
        this.scoreText = this.add.text(SCREEN_WIDTH/2, 100, this.score.toString(), {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'PixelFontMono'
        }).setDepth(9).setOrigin(0.5, 0.5)

        this.restartButton = this.add.text(
            SCREEN_WIDTH/2,
            SCREEN_HEIGHT / 2,
            'RESTART',
            {
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#2980b9',
                padding: { x: 20, y: 10 },
                fontFamily: 'PixelFontMono'
            }
        ).setOrigin(0.5, 0.5).setVisible(false)
        .setInteractive({ useHandCursor: true })
        .setDepth(100).on('pointerdown', () => {


            this.restartGame()
            // console.log('Перезапуск игры')
        })


        
        for(let i=0; i<4; i++){
            const coordYPipe = Math.Between(20, 150)
            const pair:Pair = {
                pipeBottom: new Pipe(this, coordXPipe , coordYPipe + 420, 'pipe_bottom'),
                pipeTop: new Pipe(this, coordXPipe, coordYPipe, 'pipe_top')
            }
            this.pipes.push(pair);
            coordXPipe += 300
        }

       
        

        // Отключаем гравитацию для птицы до старта игры
        // this.bird.body?.setGravityY(0);

        this.input.keyboard?.on('keydown-SPACE', () => {

            const birdBody = this.bird.body as Phaser.Physics.Arcade.Body
                if (this.gameOver){
                    return
                }
                if (!this.start) {
                    this.start = true;
                    birdBody?.setGravityY(350);
                    birdBody?.setVelocityY(-150);
                    this.pipes.forEach((pipes) => {                        
                        pipes.pipeBottom.body.setVelocityX(-200)
                        pipes.pipeBottom.passed = false
                        pipes.pipeTop.body.setVelocityX(-200)
                       
                    })




                } else {
                    birdBody?.setVelocityY(-180);
                    this.bird.angle = 330;

                   
                }
            
        });

        
        EventBus.emit('current-scene-ready', this);

    }

    onHit() {

        // console.log('Произошло касание')
        this.gameOver = true
        const birdBody = this.bird.body as Phaser.Physics.Arcade.Body
        birdBody?.setGravityY(0)
        birdBody?.setVelocityY(0)

        this.pipes.forEach((pipe) => {
            pipe.pipeBottom.body.setVelocity(0,0)
            pipe.pipeTop.body.setVelocity(0,0)
        })

        birdBody.checkCollision.none = true
        this.bird.animDead()

        if (this.score > this.recordScore){
            EventBus.emit('saved-score-to-local', this.score)
        }

        
        this.restartButton.setVisible(true)
        

        
    }

    update(): void {
        if (this.background.x <= -1024){
            this.background.x = 0
        }
        this.background.x -= 1
        if (!this.gameOver && this.start){
            // console.log('Игра началась')
            if (this.bird.angle < 30){
                this.bird.angle += 0.5
            }
            
            this.pipes.forEach((pipes) => {
                if (pipes.pipeBottom.x < this.bird.x && !pipes.pipeBottom.passed){
                        pipes.pipeBottom.passed = true
                        this.score += 1
                        this.scoreText.setText(this.score.toString())
    
                }
                if (pipes.pipeBottom.x <= -50){
                    
                    pipes.pipeBottom.passed = false
                    pipes.pipeBottom.x = 1100
                    pipes.pipeTop.x = 1100
                    pipes.pipeTop.y = Math.Between(20, 150)
                    pipes.pipeBottom.y = pipes.pipeTop.y + 420
                }
               });

             this.pipes.forEach((pipe) => {
                 this.physics.add.overlap(this.bird, 
                    pipe.pipeBottom, 
                    this.onHit, 
                    undefined, 
                    this);
    
                this.physics.add.overlap(this.bird, 
                    pipe.pipeTop, 
                    this.onHit, 
                    undefined, 
                    this)
            }) 
        }
    }
    
    restartGame() {
        
        this.gameOver = false
        this.start = false
        this.score = 0
        this.scoreText.setText(this.score.toString())
        this.bird.y = 250
        this.bird.angle = 0
        
       

        const birdBody = this.bird.body as Phaser.Physics.Arcade.Body;
        birdBody.setVelocity(0, 0);
        birdBody?.setGravity(0)
        birdBody.enable = true;
        birdBody.checkCollision.none = false
        this.restartButton.setVisible(false)

        this.pipes.forEach(pair => {
            if (pair.pipeBottom.scene) {
                pair.pipeBottom.destroy();
            }
            if (pair.pipeTop.scene) {
                pair.pipeTop.destroy();
            }
        });
        let coordXPipe = 1100
        this.pipes = []
        for(let i=0; i<4; i++){
            const coordYPipe = Math.Between(20, 150)
            const pair:Pair = {
                pipeBottom: new Pipe(this, coordXPipe , coordYPipe + 420, 'pipe_bottom'),
                pipeTop: new Pipe(this, coordXPipe, coordYPipe, 'pipe_top')
            }
            this.pipes.push(pair);
            coordXPipe += 300
        }

    }


}
