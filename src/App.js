import './App.css';
import { useState, useEffect } from 'react';
import Square from './components/Square';
import Board from './components/Board';

const defaultSquares = () => (new Array(9)).fill(null);

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const nullIndexes = squares.filter(square => square === null);
    const notNullIndexes = squares.filter(square => square !== null);
    if (nullIndexes.length === 0 && notNullIndexes.length > 1) {
      alert("Game Over");
    } else {
      const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
      const linesThatAre = (a, b, c) => {
        return lines.filter(squareIndexes => {
          const squareValues = squareIndexes.map(index => squares[index]);
          return JSON.stringify([a, b, c].sort()) === JSON.stringify(squareValues.sort());
        });
      };
      const emptyIndexes = squares
        .map((square, index) => square === null ? index : null)
        .filter(val => val !== null);
      const playerWon = linesThatAre('x', 'x', 'x').length > 0;
      const computerWon = linesThatAre('o', 'o', 'o').length > 0;
      if (playerWon) {
        setWinner('x');
      }
      if (computerWon) {
        setWinner('o');
      }
      const putComputerAt = index => {
        let newSquares = squares;
        newSquares[index] = 'o';
        setSquares([...newSquares]);
      };
      if (isComputerTurn) {

        const winingLines = linesThatAre('o', 'o', null);
        if (winingLines.length > 0) {
          const winIndex = winingLines[0].filter(index => squares[index] === null)[0];
          putComputerAt(winIndex);
          return;
        }

        const linesToBlock = linesThatAre('x', 'x', null);
        if (linesToBlock.length > 0) {
          const blockIndex = linesToBlock[0].filter(index => squares[index] === null)[0];
          putComputerAt(blockIndex);
          return;
        }

        const linesToContinue = linesThatAre('o', null, null);
        if (linesToContinue.length > 0) {
          putComputerAt(linesToContinue[0].filter(index => squares[index] === null)[0]);
          return;
        }

        const randomIndex = emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
        putComputerAt(randomIndex);
      }
    }
  }, [squares]);



  const handleSquareClick = (index) => {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newSquares = squares;
      if (squares[index] === null)
        newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  }

  const refresh = () => {
    setWinner(null);
    setSquares(defaultSquares());
  }

  return (
    <div className="container">
      <div className="status-container">
        <div className="menu-container">
          <button onClick={refresh} className="refresh-btn">
            Refresh
          </button>
        </div>
        <div className="players-info">
          <p>X - you</p>
          <p>O - computer</p>
        </div>
        <div className="win-status">
          {!!winner && winner === 'x' && (
            <div className="result green">
              You WON!
            </div>
          )}
          {!!winner && winner === 'o' && (
            <div className="result red">
              You LOST!
            </div>
          )}
        </div>
      </div>
      <div className="game-container">
        <div className="game-wrapper">
          <Board>
            {squares.map((square, index) =>
              <Square
                key={index}
                x={square === 'x' ? 1 : 0}
                o={square === 'o' ? 1 : 0}
                onClick={() => handleSquareClick(index)} />
            )}
          </Board>
        </div>
      </div>
    </div>
  );
}

export default App;
