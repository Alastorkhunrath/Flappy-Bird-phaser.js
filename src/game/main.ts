import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Types } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 600,
    parent: 'game-container',

    input: {

        keyboard: true // Включить клавиатуру
    },
    render: {
        pixelArt: true,
        antialias: false
    },
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {x: 0, y: 0 },
            debug: true
        }
    },
    backgroundColor: '#028af8',
    scene: [
        MainGame
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
