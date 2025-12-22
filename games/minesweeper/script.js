const width = 10;
const height = 10;
const mineCount = 15;

let board = [];
let boardElement = document.getElementById("board");
let gameOver = false;
const gameStatus = document.getElementById("gameStatus");
const resetButton = document.getElementById("resetButton");

// Structure of a cell object:
// { x, y, hasMine, isOpen, isFlagged, neighborMines, element }

function createBoard() {
    board = [];
    boardElement.innerHTML = "";

    // Set CSS‑grid size
    boardElement.style.gridTemplateColumns = `repeat(${width}, 30px)`;

    // Create cells
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = {
                x,
                y,
                hasMine: false,
                isOpen: false,
                isFlagged: false,
                neighborMines: 0,
                element: document.createElement("div")
            };

            cell.element.classList.add("cell");

            // Left click => open the cell
            cell.element.addEventListener("click", () => onCellClick(cell));

            // Right click => toggle a flag
            cell.element.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                toggleFlag(cell);
            });

            board.push(cell);
            boardElement.appendChild(cell.element);
        }
    }
    placeMines();
    calculateNumbers();
}

function getCell(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return null;
    return board[y * width + x];
}

function placeMines() {
    let placed = 0;
    while (placed < mineCount) {
        // Pick random cell from board
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const cell = getCell(x, y);

        // If there is no mine, add mine
        if (cell !== null && !cell.hasMine) {
            cell.hasMine = true;
            placed++;
        }
    }
}

function calculateNumbers() {
    // Loop through all cells
    for (let cell of board) {
        // Skip if cell has mine
        if (cell.hasMine) {
            cell.neighborMines = 0;
            continue;
        }
        let count = 0;
        // Check all neighbouring cells
        for (let ny = cell.y - 1; ny <= cell.y + 1; ny++) {
            for (let nx = cell.x - 1; nx <= cell.x + 1; nx++) {

                // Skip the cell itself
                if (nx === cell.x && ny === cell.y) continue;

                // If neighbour cell has mine, then increase count
                const neighbor = getCell(nx, ny);
                if (neighbor && neighbor.hasMine) count++;
            }
        }
        // Set mine count
        cell.neighborMines = count;
    }
}


function onCellClick(cell) {
    // No action
    if (gameOver || cell.isOpen || cell.isFlagged) return;

    // Game over
    if (cell.hasMine) {
        revealMines();
        gameOver = true;
        gameStatus.textContent = "Game Over";
        return;
    }

    // Game goes on
    openCell(cell);
    checkWin();
}

function openCell(cell) {
    // Already open
    if (cell.isOpen) return;

    cell.isOpen = true;
    cell.element.classList.add("open");
    cell.element.textContent = cell.neighborMines > 0 ? cell.neighborMines : "";

    // If this cell has no neighboring mines, also open its neighbors
    if (cell.neighborMines === 0) {
        // Check all neighbouring cells
        for (let ny = cell.y - 1; ny <= cell.y + 1; ny++) {
            for (let nx = cell.x - 1; nx <= cell.x + 1; nx++) {

                // Skip the cell itself
                if (nx === cell.x && ny === cell.y) continue;

                // Open the neighbor if it is not open and does not contain a mine
                const neighbor = getCell(nx, ny);
                if (neighbor && !neighbor.isOpen && !neighbor.hasMine) {
                    openCell(neighbor);
                }
            }
        }
    }
}

function revealMines() {
    for (let cell of board) {
        if (cell.hasMine) {
            cell.element.classList.add("mine");
            cell.element.textContent = "💣";
        }
    }
}

function toggleFlag(cell) {
    if (gameOver || cell.isOpen) return;
    cell.isFlagged = !cell.isFlagged;
    cell.element.textContent = cell.isFlagged ? "🚩" : "";
}

function checkWin() {
    // If all non-mine cells are open, the player wins
    const unopened = board.filter(c => !c.isOpen && !c.hasMine);
    if (unopened.length === 0) {
        gameOver = true;
        gameStatus.textContent = "You won";
    }
}

resetButton.addEventListener("click", () => {
    gameOver = false;
    gameStatus.textContent = "";
    createBoard();
});

// Start by creating board
createBoard();
