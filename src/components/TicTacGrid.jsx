import "./TicTacGrid.css";
import { useEffect, useState } from "react";

const TicTacGrid = () => {

  const [playerScore, setPlayerScore] = useState({ player1: 0, player2: 0 });
  const [computerScore, setComputerScore] = useState(0);

  const [playWithCom, setPlayWithCom] = useState(false); // initially player v/s player

  const [squares, setSquares] = useState(Array(9).fill(""));
  const [winningSquares, setWinningSquares] = useState([]); // to highlight the squares after someone wins

  const [isXTurn, setIsXTurn] = useState(true); // initially X turn

  const [status, setStatus] = useState("");

  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getWinner = (squares) => {
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: pattern };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    // if a game won, or clicked on the same square, or the game is draw, stops the user from clicking the squares
    if (squares[index] || status.startsWith("Winner") || status === "Game is Draw") return; 

    const updatedSquares = [...squares];
    updatedSquares[index] = isXTurn ? "X" : "O";
    setSquares(updatedSquares);
    setIsXTurn(!isXTurn);

    if (!playWithCom) {
      const result = getWinner(updatedSquares);
      if (result) {
        setWinningSquares(result.line);
        setStatus(`Winner is ${result.winner}`);

        // increment score after every win
        if (result.winner === "X") {
          setPlayerScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
        } else {
          setPlayerScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
        }
      } else if (!updatedSquares.includes("")) {
        setStatus("Game is Draw");
      } else {
        setStatus(`${isXTurn ? "O" : "X"} Turn`);
      }
    }
  };

  const computerMove = () => {
    const board = [...squares];

    // Com will try to win
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === "O" && board[b] === "O" && !board[c]) return playAt(c);
      if (board[a] === "O" && board[c] === "O" && !board[b]) return playAt(b);
      if (board[b] === "O" && board[c] === "O" && !board[a]) return playAt(a);
    }

    // Com will try to block player
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === "X" && board[b] === "X" && !board[c]) return playAt(c);
      if (board[a] === "X" && board[c] === "X" && !board[b]) return playAt(b);
      if (board[b] === "X" && board[c] === "X" && !board[a]) return playAt(a);
    }

    // Else Com will choose a random square
    const emptySpots = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
    if (emptySpots.length > 0) {
      const randomIdx = emptySpots[Math.floor(Math.random() * emptySpots.length)];
      playAt(randomIdx);
    }
  };

  const playAt = (index) => {
    const updated = [...squares];
    updated[index] = "O";
    setSquares(updated);
    setIsXTurn(true);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(""));
    setIsXTurn(true);
    setStatus("");
    setWinningSquares([]);
  };

  const switchToPvP = () => {
    resetGame();
    setPlayerScore({player1:0, player2:0})
     setComputerScore(0)
    setPlayWithCom(false);
  };

  const switchToPvC = () => {
    resetGame();
    setPlayerScore({player1:0, player2:0})
    setComputerScore(0)
    setPlayWithCom(true);
  };

  useEffect(() => {
    if (playWithCom) {
      const result = getWinner(squares);

      if (result) {
        setWinningSquares(result.line);
        setStatus(result.winner === "X" ? "Player Wins!" : "Computer Wins!");

        if (result.winner === "X") {
          setPlayerScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
        } else {
          setComputerScore((prev) => prev + 1);
        }
      } else if (!squares.includes("")) {
        setStatus("Game is Draw");
      } else if (!isXTurn) {
        setStatus("Next Turn: Computer (O)");
        const moveTimer = setTimeout(() => computerMove(), 500);
        return () => clearTimeout(moveTimer);
      } else {
        setStatus("Next Turn: Player (X)");
      }
    }
  }, [squares, isXTurn, playWithCom]);


  return (
    <section className="container">
      <h2 className="score-heading">
        Score
      </h2>

      <div className="scoreboard">
        <h3>Player 1 ( X ) : {playerScore.player1}</h3>
        {playWithCom ? (
          <h3>Computer ( O ) : {computerScore}</h3>
        ) : (
          <h3>Player 2 ( O ) : {playerScore.player2}</h3>
        )}
      </div>

      <div className="tic-tac-container">
        {[0, 1, 2].map((row) => (
          <div key={row} className="tic-tac-row">
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return (
                <button
                  key={index}
                  className={`tic-tac-button ${
                    squares[index] === "X" ? "colorX" : squares[index] === "O" ? "colorO" : ""
                  }`}
                  style={{
                    backgroundColor: winningSquares.includes(index) ? "#ec264a" : undefined,
                  }}
                  disabled={squares[index] || status.startsWith("Winner") || status === "Game is Draw"}
                  onClick={() => handleClick(index)}
                >
                  {squares[index]}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <h2 className="game-status">{status}</h2>

      <button onClick={resetGame} className="reset">Reset Game</button>

      <h1>Game Modes</h1>
      <div className="game-modes">
        <button onClick={switchToPvP} className="modes">
          🤵🏼 v/s 👲🏼
        </button>

        <button onClick={switchToPvC} className="modes">
          🤵🏼 v/s 🤖
        </button>
      </div>
    </section>
  );
};

export default TicTacGrid;
