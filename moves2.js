const cells = document.querySelectorAll(".cell");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const resetButton = document.querySelector("#resetButton");
const turnMsg = document.querySelector(".turn");
const historyButton = document.querySelector(".history");
const modalContainer = document.querySelector(".modal-container");
const closeModal = document.querySelector("#close");
const moveLogList = document.getElementById("moveLogList");

// state
let currentPlayer = "X";
turnMsg.innerHTML = `X's turn!`;
let moveHistory = [];
let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let currentMove = 0;
let boardClickable = true;

// event handler
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => playerMove(index));
});

const playerMove = (cellIndex) => {
  if (
    !boardClickable ||
    board[Math.floor(cellIndex / 3)][cellIndex % 3] !== ""
  ) {
    return;
  }

  // update state
  currentMove++;
  board[Math.floor(cellIndex / 3)][cellIndex % 3] = currentPlayer;
  moveHistory[currentMove] = board.map((row) => [...row]);
  cells[cellIndex].textContent = currentPlayer;

  // update move log
  const cellPosition = getCellPosition(cellIndex);
  const moveDescription = `${currentPlayer} played ${cellPosition} cell`;
  updateMoveLog(moveDescription);

  // add colors
  if (currentPlayer === "X") {
    cells[cellIndex].classList.add("blue");
  } else {
    cells[cellIndex].classList.add("pink");
  }

  // check win/draw
  if (checkWin()) {
    gameResult(`${currentPlayer} wins!`);
  } else if (!emptyCells()) {
    gameResult(`It's a draw!`);
    turnMsg.innerHTML = `Draw!`;
    historyButton.style.opacity = "1";
  } else {
    // switch to the next player and turn msg
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    turnMsg.innerHTML = `${currentPlayer}'s turn!`;
  }
};

// update move log
const updateMoveLog = (message) => {
  const moveItem = document.createElement("li");
  moveItem.textContent = message;
  moveLogList.appendChild(moveItem);
};

// get postion
const getCellPosition = (cellIndex) => {
  const row = Math.floor(cellIndex / 3);
  const col = cellIndex % 3;
  if (row === 0) {
    if (col === 0) return "top left";
    if (col === 1) return "top middle";
    if (col === 2) return "top right";
  } else if (row === 1) {
    if (col === 0) return "middle left";
    if (col === 1) return "center";
    if (col === 2) return "middle right";
  } else {
    if (col === 0) return "bottom left";
    if (col === 1) return "bottom middle";
    if (col === 2) return "bottom right";
  }
};

// update board state for reset
const resetBoard = () => {
  cells.forEach((cell, i) => {
    cell.textContent = board[Math.floor(i / 3)][i % 3];
    cell.classList.remove("blue");
    cell.classList.remove("pink");
  });
};

// update board for prev & next
const updateBoard = () => {
  cells.forEach((cell, i) => {
    cell.textContent = board[Math.floor(i / 3)][i % 3];
  });
};

// check winner
const checkWin = () => {
  // win pattern
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // loop winPattern
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    // rows and cols
    const boardA = board[Math.floor(a / 3)][a % 3];
    const boardB = board[Math.floor(b / 3)][b % 3];
    const boardC = board[Math.floor(c / 3)][c % 3];

    if (boardA && boardA === boardB && boardA === boardC) {
      boardClickable = false;
      turnMsg.innerHTML = `${currentPlayer} wins!`;
      historyButton.style.opacity = "1";
      return true;
    }
  }
  return false;
};

// check board for empty cells / draw
const emptyCells = () => board.some((row) => row.some((cell) => cell === ""));

// result
const gameResult = (message) => {
  setTimeout(() => {
    alert(message);
    boardClickable = false;
  }, 100);
  prevButton.disabled = false;
  prevButton.style.cursor = "pointer";
  nextButton.disabled = false;
  nextButton.style.cursor = "pointer";
  historyButton.disabled = false;
  historyButton.style.cursor = "pointer";
};

// reset
resetButton.addEventListener("click", () => {
  boardClickable = true;
  currentPlayer = "X";
  moveHistory = [];
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentMove = 0;
  prevButton.disabled = true;
  prevButton.style.cursor = "not-allowed";
  nextButton.disabled = true;
  nextButton.style.cursor = "not-allowed";
  turnMsg.innerHTML = `X's turn!`;
  historyButton.style.opacity = "0";
  historyButton.disabled = true;
  historyButton.style.cursor = "default";
  resetBoard();
  clearMoveLog();
});

// prev
prevButton.addEventListener("click", () => {
  if (currentMove > 0) {
    currentMove--;
    board = moveHistory[currentMove].map((row) => [...row]);
    updateBoard();
  }
});

// next
nextButton.addEventListener("click", () => {
  if (currentMove < moveHistory.length - 1) {
    currentMove++;
    board = moveHistory[currentMove].map((row) => [...row]);
    updateBoard();
  }
});
// open & close modal
historyButton.addEventListener("click", () => {
  modalContainer.classList.add("show");
});

closeModal.addEventListener("click", () => {
  modalContainer.classList.remove("show");
});

// clear list when reset
const clearMoveLog = () => {
  moveLogList.innerHTML = "";
};