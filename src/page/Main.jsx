import React, { useState } from "react"
import img_frontlogo from "/img/frontlogo.jpg"
import btn_start from "/img/btn_start.png"
import btn_player1 from "/img/btn_player1.jpg"
import btn_player2 from "/img/btn_player2.jpg"
import img_selectMode from "/img/selectMode.jpg"
import GamePvP from "./GamePvP"
import {characters} from "../utils/datas"


const Main = () => {
    const [gameState, setGameState] = useState('front');
    const [activeCharacters, setActiveCharacters] = useState([]);

    const front = () => {
        setGameState("front");
    }
    const selectMode = () => {
        setGameState("selectMode");
    }
    const playerSel1 = () => {
        setGameState("playerSel1");
    }
    const playerSel2 = () => {
        setGameState("playerSel2");
    }
    const startPlay1 = () => {
        setGameState("startPlay1");
    }
    const startPlay2 = () => {
        setGameState("startPlay2");
    }

    const handleToggleCharacter = (index) => {
        if (activeCharacters.includes(index)) {
            // Remove the index if it's already active
            setActiveCharacters(activeCharacters.filter(i => i !== index));
        } else if (activeCharacters.length < 2) {
            // Add the index if less than 2 are active
            setActiveCharacters([...activeCharacters, index]);
        }
    };
    return (
        <div className="bg-white h-screen">
            {gameState === "front" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <img className='w-[30%] rounded-lg' src={img_frontlogo} alt="start image here" />
                    <p className='font-black text-5xl mt-10 mb-10'>Soccer Head</p>
                    <button onClick={selectMode} >
                        <img className="w-[80%]" src={btn_start} alt="start button here" />
                    </button>
                </div>
            )}
            {gameState === "selectMode" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="mb-20">
                        <button>
                            <img className="w-60 transition-transform duration-300 transform hover:scale-150" src={btn_player1} alt="" />
                        </button>
                    </div>
                    <div>
                        <button onClick={playerSel2}>
                            <img className="w-60 transition-transform duration-300 transform hover:scale-150 " src={btn_player2} alt="" />
                        </button>
                    </div>

                </div>

            )}
            {gameState === "playerSel2" && (
                <div className="flex flex-col items-center justify-center min-h-screen space-y-20">
                    {characters.reduce((acc, img, index) => {
                        if (index % 7 === 0) acc.push([]); // Create a new row every 7 images
                        acc[acc.length - 1].push(img);
                        return acc;
                    }, []).map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center items-center space-x-[4%]">
                            {row.map((img, imgIndex) => {
                                const globalIndex = rowIndex * 7 + imgIndex; // Calculate global index
                                return (
                                    <img
                                        key={globalIndex}
                                        className={`w-[8%] h-[8%] transform transition-transform duration-150 ${activeCharacters.includes(globalIndex) ? 'scale-150' : ''}`}
                                        src={img}
                                        alt=""
                                        onClick={() => handleToggleCharacter(globalIndex)}
                                    />
                                );
                            })}
                        </div>
                    ))}

                    <div className="flex justify-center pb-4">
                        <button onClick={startPlay2} className={` bg-green-400 rounded-lg px-4  ${activeCharacters.length == 2 ? '' : 'hidden'}`}>start</button>
                    </div>
                </div>
            )}
            {gameState === "startPlay2" && (
                // <GamePvP activePlayers = {[activeCharacters]} />
                <GamePvP activePlayers = {[1,3]} />
            )}
        </div>
    )
}


export default Main
