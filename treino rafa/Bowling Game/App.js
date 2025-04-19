import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [frames, setFrames] = useState(Array(10).fill([]));
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentRoll, setCurrentRoll] = useState(0);
  const [scores, setScores] = useState(Array(10).fill(0));
  const [gameOver, setGameOver] = useState(false);
  const [randomMode, setRandomMode] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);

  const resetGame = () => {
    setFrames(Array(10).fill([]));
    setCurrentFrame(0);
    setCurrentRoll(0);
    setScores(Array(10).fill(0));
    setGameOver(false);
  };

  const roll = (pins) => {
    if (gameOver) return;

    const newFrames = [...frames];
    newFrames[currentFrame] = [...newFrames[currentFrame], pins];
    setFrames(newFrames);

    updateScores(newFrames);

    if (currentFrame < 9) {
      if (pins === 10 || newFrames[currentFrame].length === 2) {
        setCurrentFrame(currentFrame + 1);
        setCurrentRoll(0);
      } else {
        setCurrentRoll(currentRoll + 1);
      }
    } else {
      const frame10 = newFrames[9];
      if (frame10.length === 3 || 
          (frame10.length === 2 && frame10[0] + frame10[1] < 10)) {
        setGameOver(true);
        setGameHistory([...gameHistory, scores[9]]);
      }
    }
  };

  const updateScores = (frames) => {
    const newScores = Array(10).fill(0);
    let total = 0;

    for (let i = 0; i < 10; i++) {
      if (i < frames.length && frames[i].length > 0) {
        const frame = frames[i];
        let frameScore = frame.reduce((sum, pins) => sum + pins, 0);
        
        if (i < 9) {
          if (frame[0] === 10) {
            let bonus = 0;
            if (i + 1 < frames.length && frames[i + 1].length > 0) {
              bonus += frames[i + 1][0];
              if (frames[i + 1].length > 1) {
                bonus += frames[i + 1][1];
              } else if (i + 2 < frames.length && frames[i + 2].length > 0) {
                bonus += frames[i + 2][0];
              }
            }
            frameScore += bonus;
          } else if (frame.length > 1 && frame[0] + frame[1] === 10) {
            if (i + 1 < frames.length && frames[i + 1].length > 0) {
              frameScore += frames[i + 1][0];
            }
          }
        }
        
        total += frameScore;
        newScores[i] = total;
      } else {
        newScores[i] = total;
      }
    }

    setScores(newScores);
  };

  const randomRoll = () => {
    if (gameOver) return;
    
    let pins;
    if (currentRoll === 0 && currentFrame < 9) {
      pins = Math.floor(Math.random() * 11);
    } else if (currentFrame < 9) {
      const remaining = 10 - frames[currentFrame][0];
      pins = Math.floor(Math.random() * (remaining + 1));
    } else {
      const frame = frames[9];
      if (frame.length === 0) {
        pins = Math.floor(Math.random() * 11);
      } else if (frame.length === 1) {
        if (frame[0] === 10) {
          pins = Math.floor(Math.random() * 11);
        } else {
          pins = Math.floor(Math.random() * (11 - frame[0]));
        }
      } else if (frame.length === 2) {
        if (frame[0] === 10 || frame[0] + frame[1] === 10) {
          pins = Math.floor(Math.random() * 11);
        } else {
          setGameOver(true);
          setGameHistory([...gameHistory, scores[9]]);
          return;
        }
      }
    }
    
    roll(pins);
  };

  const startRandomGame = () => {
    resetGame();
    setRandomMode(true);
  };

  const stopRandomGame = () => {
    setRandomMode(false);
  };

  useEffect(() => {
    let interval;
    if (randomMode && !gameOver) {
      interval = setInterval(randomRoll, 1000);
    }
    return () => clearInterval(interval);
  }, [randomMode, gameOver, frames, currentFrame, currentRoll]);

  return (
    <div className="bowling-app">
      <header className="app-header">
        <h1>🎳 Jogo de Boliche 🎳</h1>
      </header>
      
      <div className="game-controls">
        <button onClick={resetGame} className="control-btn">Novo Jogo</button>
        {!randomMode ? (
          <button onClick={startRandomGame} className="control-btn">Jogo Automático</button>
        ) : (
          <button onClick={stopRandomGame} className="control-btn">Parar Jogo</button>
        )}
      </div>
      
      <div className="scoreboard">
        <div className="frames-container">
          {frames.map((frame, index) => (
            <div key={index} className={`frame ${index === currentFrame && !gameOver ? 'active-frame' : ''}`}>
              <div className="frame-number">Quadro {index + 1}</div>
              <div className="frame-rolls">
                {frame.map((pins, rollIndex) => (
                  <span key={rollIndex} className="roll-value">
                    {pins === 10 && rollIndex === 0 ? 'X' : 
                     frame.length > 1 && rollIndex === 1 && frame[0] + frame[1] === 10 ? '/' : 
                     pins}
                  </span>
                ))}
              </div>
              <div className="frame-score">{scores[index] || ''}</div>
            </div>
          ))}
        </div>
      </div>
      
      {!randomMode && !gameOver && (
        <div className="roll-controls">
          <h3>Selecione os pinos derrubados:</h3>
          <div className="pins-buttons">
            {Array.from({length: 11}, (_, i) => i).map(pins => (
              <button
                key={pins}
                onClick={() => roll(pins)}
                className="pin-btn"
                disabled={
                  (currentRoll === 1 && currentFrame < 9 && pins > 10 - frames[currentFrame][0]) ||
                  (currentFrame === 9 && 
                   ((frames[9].length === 1 && frames[9][0] < 10 && pins > 10 - frames[9][0]) ||
                    (frames[9].length === 2 && frames[9][0] + frames[9][1] < 10)))
                }
              >
                {pins}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {gameOver && (
        <div className="game-over">
          <h2>Jogo Terminado! 🎉</h2>
          <p>Pontuação final: <strong>{scores[9]}</strong></p>
          {gameHistory.length > 0 && (
            <div className="game-history">
              <h3>Histórico de Pontuações:</h3>
              <ul>
                {gameHistory.map((score, index) => (
                  <li key={index}>Jogo {index + 1}: {score} pontos</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;