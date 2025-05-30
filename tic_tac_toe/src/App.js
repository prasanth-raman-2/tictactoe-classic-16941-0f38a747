import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main container for TicTacToe Classic game.
 * Provides a 3x3 grid, two-player turn-based play, win/draw detection, and restart capability.
 */
function TicTacToeGame() {
  // 'X' and 'O' represent the two players
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'win' | 'draw'
  const [winner, setWinner] = useState(null);

  const playerMark = isXNext ? 'X' : 'O';

  // Helper to check for a win
  // Returns: 'X', 'O', or null
  function calculateWinner(boardArr) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6] // diags
    ];
    for (let line of lines) {
      const [a,b,c] = line;
      if (boardArr[a] && boardArr[a] === boardArr[b] && boardArr[a] === boardArr[c]) {
        return boardArr[a];
      }
    }
    return null;
  }

  // Handler for clicking on a cell
  // No move possible if cell is filled or game over
  function handleCellClick(idx) {
    if (board[idx] || gameStatus !== 'playing') return;
    const nextBoard = board.slice();
    nextBoard[idx] = playerMark;
    const currentWinner = calculateWinner(nextBoard);
    if (currentWinner) {
      setBoard(nextBoard);
      setGameStatus('win');
      setWinner(currentWinner);
      return;
    }
    const filled = nextBoard.every(cell => cell);
    setBoard(nextBoard);
    if (filled) {
      setGameStatus('draw');
      setWinner(null);
    } else {
      setIsXNext(!isXNext);
    }
  }

  // Restart the game
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('playing');
    setWinner(null);
  }

  // Styling colors based on specified design
  const colorTheme = {
    primary: "#ffffff",
    secondary: "#222222",
    accent: "#4caf50"
  };

  // Game status message
  let statusMessage;
  if (gameStatus === 'win') {
    statusMessage = (
      <span>
        <span style={{ color: colorTheme.accent, fontWeight: 600 }}>
          Player {winner}
        </span> wins!
      </span>
    );
  } else if (gameStatus === 'draw') {
    statusMessage = (
      <span>
        <span style={{ color: colorTheme.secondary, fontWeight: 600 }}>
          Draw!
        </span>
      </span>
    );
  } else {
    statusMessage = (
      <span>
        Current turn:&nbsp;
        <span style={{ color: colorTheme.accent, fontWeight: 600 }}>
          Player {playerMark}
        </span>
      </span>
    );
  }

  // Inline styles - grid and cells
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 64px)',
    gridTemplateRows: 'repeat(3, 64px)',
    gap: '12px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    background: colorTheme.primary,
    padding: '24px',
    borderRadius: '18px',
    boxShadow: '0 6px 32px 0 rgba(0,0,0,0.14)'
  };

  const cellStyle = {
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 700,
    border: `2px solid ${colorTheme.secondary}`,
    borderRadius: '12px',
    background: colorTheme.primary,
    color: colorTheme.secondary,
    cursor: 'pointer',
    transition: 'background 0.15s'
  };

  function renderCell(idx) {
    return (
      <button
        type="button"
        style={{
          ...cellStyle,
          background: board[idx]
            ? (board[idx] === 'X'
                ? 'rgba(76,175,80,0.13)'
                : 'rgba(34,34,34,0.12)')
            : colorTheme.primary,
          cursor: (board[idx] || gameStatus !== 'playing') ? 'default' : 'pointer'
        }}
        aria-label={`cell ${idx}`}
        key={idx}
        onClick={() => handleCellClick(idx)}
        disabled={!!board[idx] || gameStatus !== 'playing'}
      >
        {board[idx]}
      </button>
    );
  }

  // Minimal clean layout centered
  return (
    <div className="tictactoe-wrapper" style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--base-dark)'
    }}>
      <div>
        <div
          className="ttt-header"
          style={{
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '1.25rem',
            fontWeight: 500,
            color: colorTheme.secondary
          }}
        >
          Classic Tic Tac Toe
        </div>
        <div style={{
          textAlign: 'center',
          marginBottom: '18px',
          minHeight: '32px',
          fontSize: '1rem'
        }}>
          {statusMessage}
        </div>
        <div style={gridStyle}>
          {[...Array(9)].map((_, i) => renderCell(i))}
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          alignItems: 'center'
        }}>
          <button
            className="btn btn-large"
            style={{
              backgroundColor: colorTheme.accent,
              color: '#fff',
              border: 'none',
              minWidth: '120px',
              marginTop: '8px',
              fontWeight: 600,
              fontSize: '1.07rem'
            }}
            onClick={handleRestart}
            tabIndex={0}
            type="button"
          >
            Restart Game
          </button>
          {(gameStatus === 'win' || gameStatus === 'draw') && (
            <div style={{ fontSize: '0.97rem', color: colorTheme.secondary, opacity: 0.87 }}>
              Game over. Press "Restart Game" to play again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn" tabIndex={-1} disabled style={{ opacity: 0.3, pointerEvents: 'none' }}>
              Template Button
            </button>
          </div>
        </div>
      </nav>
      <main>
        {/* Replace hero content with the TicTacToeGame component */}
        <TicTacToeGame />
      </main>
    </div>
  );
}

export default App;