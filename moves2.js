const cells = document.querySelectorAll(".cell");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const resetButton = document.getElementById("resetButton");
const turnMsg = document.querySelector(".turn");
// win pattern
let winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// initial board state
let currentPlayer = "X";
let moveHistory = [];
let board = ["", "", "", "", "", "", "", "", ""];
let currentMove = 0;
let boardClickable = true;

// event handler
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => playerMove(index));
});

const playerMove = (cellIndex) => {
  if (!boardClickable || board[cellIndex] !== "") {
    return;
  }

  // update game state
  currentMove++;
  moveHistory[currentMove] = [...board];

  board[cellIndex] = currentPlayer;
  cells[cellIndex].textContent = currentPlayer;

  if (currentPlayer === "X") {
    cells[cellIndex].classList.add("blue");
  } else {
    cells[cellIndex].classList.add("pink");
  }

  // game flow
  if (checkWin()) {
    gameResult(`${currentPlayer} wins!`);
  } else if (!emptyCells()) {
    gameResult(`It's a draw!`);
  } else {
    // switch to the next player and turn msg
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    turnMsg.innerHTML = `${currentPlayer}'s turn!`;
  }
};

// update board state
const updateBoard = () => {
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
  });
};

// check winner
const checkWin = () => {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      boardClickable = false;
      return true;
    }
    ``;
  }
  return false;
};

// loop over board to check empty cells
const emptyCells = () => {
  return board.some((cell) => cell === "");
};

// result alert
const gameResult = (message) => {
  setTimeout(() => {
    alert(message);
    boardClickable = false;
  }, 100);
};

// reset
resetButton.addEventListener("click", () => {
  boardClickable = true;
  currentPlayer = "X";
  moveHistory = [];
  board = ["", "", "", "", "", "", "", "", ""];
  currentMove = 0;
  updateBoard();
});

prevButton.addEventListener("click", () => {
  if (currentMove > 0) {
    currentMove--;
    board = [...moveHistory[currentMove]];
    console.log(board)
    updateBoard();
  }
});

nextButton.addEventListener("click", () => {
  if (currentMove < moveHistory.length - 1) {
    currentMove++;
    board = [...moveHistory[currentMove]];
    updateBoard();
  }
});
