import React, { useState, useEffect, useRef } from 'react';
import gameBg from "/img/gamebg.gif"
import traveLeft from "/img/traveLeft.gif"
import traveRight from "/img/traveRight.gif"
import imgBall from "/img/ball.gif"
import { characters } from "../utils/datas"

const GamePvP = ({ activePlayers }) => {

  const [playgroundHeight, setPlaygroundHeight] = useState(window.innerHeight)
  const [playgroundWidth, setPlaygroundWidth] = useState(window.innerWidth)
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [scoreUpdated, setScoreUpdated] = useState(false);
  const [isGoal, setIsGoal] = useState(false)
  const gravity = 0.2; // Gravity constant
  const drag = 0.99; // Drag constant to reduce velocity over time
  const goalPostionConst = 100; // Width of each goal post
  const honrizonSpeed = 5;
  const verticalSpeed = 12;
  const hitForce = 7;
  const crashForce = 3;
  const ballRadius = 20;
  const playerRadius = 40;
  const goalWidth = 145;
  const goalHeight = 200;

  const [ball, setBall] = useState({
    x: playgroundWidth / 2,
    y: 100,
    vx: 0,
    vy: 0,
    radius: ballRadius,
  });

  const [player1, setPlayer1] = useState({
    x: 200,
    y: playgroundHeight,
    vx: 0,
    vy: 0,
    radius: playerRadius, // Player radius
  });

  const [player2, setPlayer2] = useState({
    x: playgroundWidth - 200,
    y: playgroundHeight,
    vx: 0,
    vy: 0,
    radius: playerRadius,
  });

  //------------------------------------------------------------------------------------------------------------------------------------------//

  const isBallInContactWithPlayer = (ball, player) => {
    const distance = Math.sqrt((player.x - ball.x) ** 2 + (player.y - ball.y) ** 2);
    return distance <= player.radius + ball.radius;
  };
  const isPlayerInContactWithPlayer = (player1, player2) => {
    const distance = Math.sqrt((player1.x - player2.x) ** 2 + (player1.y - player2.y) ** 2);
    return distance <= player1.radius + player2.radius;
  };
  const hitBall = (player, hitForce) => {
    // Calculate distance between the player and the ball
    const distance = Math.sqrt(
      (player.x - ball.x) ** 2 + (player.y - ball.y) ** 2
    );

    // If player is close enough to the ball
    // if (distance < player.radius + ball.radius) {
    const directionX = ball.x - player.x > 0 ? 1 : -1;
    const directionY = ball.y - player.y > 0 ? 1 : -1;
    // Apply hit force to ball's velocity
    setBall((prevBall) => ({
      ...prevBall,
      vx: prevBall.vx + hitForce * directionX, // Hit ball in the x direction
      vy: prevBall.vy + hitForce * directionY * 2, // Hit ball in the y direction
    }));
    // }
  };
  const resetGame = () => {
    setBall((pre) => ({
      ...pre,
      x: playgroundWidth / 2,
      y: playgroundHeight / 2,
      vx: 0,
      vy: 0,
    }));
    setPlayer1((pre) => ({
      ...pre,
      x: 200,
    }));
    setPlayer2((pre) => ({
      ...pre,
      x: playgroundWidth - 200,
    }));
    setIsGoal(false)
  }

  //------------------------------------------------------------------------------------------------------------------------------------------//
  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight;
      const newWidth = window.innerWidth;

      setPlaygroundHeight(newHeight);
      setPlaygroundWidth(newWidth);

      setBall((prev) => ({
        ...prev,
        y: newHeight - prev.radius / 2
      }));

      setPlayer1((prev) => ({
        ...prev,
        x: 200,
      }));

      setPlayer2((prev) => ({
        ...prev,
        x: playgroundWidth - 200,
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'a') {
        setPlayer1((prev) => ({ ...prev, vx: -honrizonSpeed }));
      }
      if (e.key === 'd') {
        setPlayer1((prev) => ({ ...prev, vx: honrizonSpeed }));
      }
      if (e.key === 'w' && player1.y === playgroundHeight - player1.radius) {
        setPlayer1((prev) => ({ ...prev, vy: -verticalSpeed })); // Jump force
      }
      if (e.key === 'ArrowLeft') {
        setPlayer2((prev) => ({ ...prev, vx: -honrizonSpeed }));
      }
      if (e.key === 'ArrowRight') {
        setPlayer2((prev) => ({ ...prev, vx: honrizonSpeed }));
      }
      if (e.key === 'ArrowUp' && player2.y === playgroundHeight - player2.radius) {
        setPlayer2((prev) => ({ ...prev, vy: -verticalSpeed })); // Jump force
      }
      if (e.key === 's') {
        hitBall(player1, hitForce);
      }
      if (e.key === 'm') {
        hitBall(player2, hitForce);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === 'a' || e.key === 'd') {
        setPlayer1((prev) => ({ ...prev, vx: 0 }));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setPlayer2((prev) => ({ ...prev, vx: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    if (isBallInContactWithPlayer(ball, player1)) hitBall(player1, crashForce)
    if (isBallInContactWithPlayer(ball, player2)) hitBall(player2, crashForce)

    if ((player1.x - player2.x) < 2 * playerRadius && (player1.y - player2.y) < playerRadius) {////////////////////////////////////////////////////
      // if (isPlayerInContactWithPlayer(player1, player2) && player1.y === player2.y) {
      // If player1 is moving toward player2
      if (player1.x < player2.x && player1.vx > 0) {
        // Stop player1 from moving right
        // setPlayer1((prev) => ({ ...prev, vx: 0 }));
      }

      // If player2 is moving toward player1
      if (player1.x < player2.x && player2.vx < 0) {
        // Stop player2 from moving left
        // setPlayer2((prev) => ({ ...prev, vx: 0 }));
      }

      // Additional logic to prevent overlap
      if (player1.x > player2.x && player1.vx < 0) {
        // setPlayer1((prev) => ({ ...prev, vx: 0 }));
      }

      if (player1.x > player2.x && player2.vx > 0) {
        // setPlayer2((prev) => ({ ...prev, vx: 0 }));
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player1, player2]);

  useEffect(() => {
    if (goalPostionConst < ball.x && ball.x < goalWidth + goalPostionConst && playgroundHeight - goalHeight < ball.y && ball.y < playgroundHeight) {
      if (!scoreUpdated) {
        // setBall((pre) => ({
        //   ...pre,
        //   vx: 0,
        // }));
        setScore((prev) => ({
          ...prev,
          player2: prev.player2 + 1, // Increment player2's score by 1
        }));
        setScoreUpdated(true);
        setTimeout(resetGame, 1000);
        setIsGoal(true)
      }
    } else if (playgroundWidth - goalWidth - goalPostionConst < ball.x && ball.x < playgroundWidth - goalPostionConst && playgroundHeight - goalHeight < ball.y && ball.y < playgroundHeight) {
      if (!scoreUpdated) {
        // setBall((pre) => ({
        //   ...pre,
        //   vx: 0,
        // }));
        setScore((prev) => ({
          ...prev,
          player1: prev.player1 + 1, // Increment player1's score by 1
        }));
        setScoreUpdated(true);
        setTimeout(resetGame, 1000);
        setIsGoal(true)
      }
    } else {
      setScoreUpdated(false); // Reset when the ball is not in scoring position
    }
  }, [ball])

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      // Ball physics
      setBall((prevBall) => {
        let newVy = prevBall.vy + gravity; // Apply gravity to ball
        let newY = prevBall.y + newVy;

        let newVx = prevBall.vx * drag; // Apply drag to ball
        let newX = prevBall.x + newVx;

        // Ball collision with ground
        if (newY > playgroundHeight - prevBall.radius) {
          newY = playgroundHeight - prevBall.radius;
          newVy = -newVy * 0.7; // Bounce with energy loss
        }
        if (newY < prevBall.radius) {
          newY = prevBall.radius;
          newVy = -newVy * 0.7; // Bounce back from the top boundary
        }
        // Ball collision with vertical boundaries (left/right)
        if (newX < prevBall.radius) {
          newX = prevBall.radius;
          newVx = -newVx * 0.7; // Bounce back from the left boundary
        }
        if (newX > playgroundWidth - prevBall.radius) {
          newX = playgroundWidth - prevBall.radius;
          newVx = -newVx * 0.7; // Bounce back from the right boundary
        }
        if (playgroundHeight - goalHeight - ballRadius/2 <= newY && newY <= playgroundHeight - goalHeight + ballRadius/2 && goalPostionConst < newX && newX < goalWidth + goalPostionConst || playgroundHeight - goalHeight - ballRadius/2 <= newY && newY <= playgroundHeight - goalHeight + ballRadius/2 && playgroundWidth - goalPostionConst - goalWidth < newX && newX < playgroundWidth) {
          newY = playgroundHeight - goalHeight - prevBall.radius;
          newVy = -newVy * 0.7; // Bounce with energy loss
        }

        return { ...prevBall, x: newX, y: newY, vx: newVx, vy: newVy };
      });
    
      // Player 1 physics
      setPlayer1((prevPlayer) => {
        let newVy = prevPlayer.vy + gravity; // Apply gravity to player
        let newY = prevPlayer.y + newVy;

        let newVx = prevPlayer.vx; // Apply inertia (velocity continues)
        let newX = prevPlayer.x + newVx;

        // Player 1 collision with ground
        if (newY > playgroundHeight - prevPlayer.radius) {
          newY = playgroundHeight - prevPlayer.radius;
          newVy = 0; // Stop vertical movement on ground
        }
        if (newY < prevPlayer.radius) {
          newY = prevPlayer.radius; // Stop at the top boundary
          newVy = 0; // Prevent further upward movement
        }


        // Player 1 collision with vertical boundaries (left/right)
        if (newX < prevPlayer.radius) {
          newX = prevPlayer.radius; // Stop at the left boundary
        }
        if (newX > playgroundWidth - prevPlayer.radius) {
          newX = playgroundWidth - prevPlayer.radius; // Stop at the right boundary
        }

        return { ...prevPlayer, x: newX, y: newY, vx: newVx, vy: newVy };
      });

      // Player 2 physics
      setPlayer2((prevPlayer) => {
        let newVy = prevPlayer.vy + gravity; // Apply gravity to player
        let newY = prevPlayer.y + newVy;

        let newVx = prevPlayer.vx; // Apply inertia (velocity continues)
        let newX = prevPlayer.x + newVx;

        // Player 2 collision with ground
        if (newY > playgroundHeight - prevPlayer.radius) {
          newY = playgroundHeight - prevPlayer.radius;
          newVy = 0; // Stop vertical movement on ground
        }
        if (newY < prevPlayer.radius) {
          newY = prevPlayer.radius; // Stop at the top boundary
          newVy = 0; // Prevent further upward movement
        }

        // Player 2 collision with vertical boundaries (left/right)
        if (newX < prevPlayer.radius) {
          newX = prevPlayer.radius; // Stop at the left boundary
        }
        if (newX > playgroundWidth - prevPlayer.radius) {
          newX = playgroundWidth - prevPlayer.radius; // Stop at the right boundary
        }
        return { ...prevPlayer, x: newX, y: newY, vx: newVx, vy: newVy };
      });
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
    return () => cancelAnimationFrame(gameLoop);
  }, []);

  return (
    <div className="relative w-full h-full bg-green-500 overflow-hidden" id="maingame">
      <img className=" w-full h-full z-0" src={gameBg} alt="" />
      {/* Scoreboard */}
      <div className="absolute top-0 left-0 right-0 flex justify-between p-4 text- text-black text-2xl">
        <div>Player 1: {score.player1}</div>
        <div className={`text-white font-extrabold text-5xl ${isGoal ? '' : 'hidden'}`}>Goal</div>
        <div>Player 2: {score.player2}</div>
        <div>{playgroundHeight}</div>
        <div>{playgroundWidth}</div>
      </div>

      {/* Playground */}
      {/* <div className="relative mx-auto border-red-500 border-2 rounded-xl w-full h-full" >  */}
      {/* style={{ width: `${playgroundWidth}px`, height: `${groundHeight}px` }}> */}

      {/* Left Goal (Player 2's goal) */}
      {/* Left goal door */}
      <img
        src={traveLeft}
        className="absolute left-0 bottom-0 z-10"
        style={{ width: `${goalWidth}px`, height: `${goalHeight}px`, left: `${goalPostionConst}px`, bottom: 0 }}
      ></img>

      {/* Right Goal (Player 1's goal) */}
      {/* Right goal door */}
      <img
        src={traveRight}
        className="absolute right-0 bottom-0"
        style={{ width: `${goalWidth}px`, height: `${goalHeight}px`, right: `${goalPostionConst}px`, bottom: 0 }}
      ></img>

      {/* Player 1 */}
      <img
        className="absolute rounded-full"
        src={characters[activePlayers[0]]}
        style={{
          width: `${player1.radius * 2}px`,
          height: `${player1.radius * 2}px`,
          left: `${player1.x - player1.radius}px`,
          top: `${player1.y - player1.radius}px`,
        }}
      ></img>

      {/* Player 2 */}
      <img
        className="absolute rounded-full"
        src={characters[activePlayers[1]]}
        style={{
          width: `${player2.radius * 2}px`,
          height: `${player2.radius * 2}px`,
          left: `${player2.x - player2.radius}px`,
          top: `${player2.y - player2.radius}px`,
        }}
      ></img>

      {/* Ball */}
      <img
        src={imgBall}
        className="absolute rounded-full"
        style={{
          width: `${ball.radius * 2}px`,
          height: `${ball.radius * 2}px`,
          left: `${ball.x - ball.radius}px`,
          top: `${ball.y - ball.radius}px`,
        }}
      ></img>

      {/* Ground */}

      {/* </div> */}
    </div>
  );
}

export default GamePvP;








