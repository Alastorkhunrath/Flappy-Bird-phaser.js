import { EventBus } from './game/EventBus';


import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
// import * as Phaser from 'phaser';

function App()
{

  
    EventBus.on('saved-score-to-local', (score: number) => {
        setRecordScore(score)
    })




    const [recordScore, setRecordScore] = useState<number | null>(() => {
        try{
            const savedScore = localStorage.getItem('recordScore');
            return savedScore ? parseInt(savedScore, 10) : 0;

        } catch(err){
            console.error('Error reading from localStorage:', err);
            return null;
        }
        
    })

    useEffect(() => {
        try {
            if (recordScore !== null){
                localStorage.setItem('recordScore', recordScore.toString());
            }
        } catch(err){
            console.error('Error saving to localStorage:', err)
        }
        
    }, [recordScore]);


    useEffect(() => {
        EventBus.emit('show-record-in-game')
    },[])



    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);


    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
        </div>
    )
}

export default App
