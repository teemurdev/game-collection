let currentPlayer = "X"; // Default
const cells = document.querySelectorAll(".cell");
let mode = "easy"; // Default
const modeSelect = document.getElementById("modeSelect");
modeSelect.value = mode; // Set default
const resetButton = document.getElementById("resetButton");
const gameStatus = document.getElementById("gameStatus");
const winnerStatus = document.getElementById("winnerStatus");

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]

function checkWinner() {
    let winner = null;
    for (let line of winningCombinations) {
        const [a,b,c] = line;

        // Checks if line contains three identical values
        if (
            cells[a].textContent !== "" &&
            cells[b].textContent === cells[a].textContent &&
            cells[c].textContent === cells[a].textContent
        ) {
            winner = cells[a].textContent;
        }
    }
    // Set winner
    if (winner && winnerStatus.textContent === "") {
        winnerStatus.textContent = winner + " is winner";
    }
}

function makeRandomMove() {
    // Get empty cells
    const emptyCells = [...cells].filter(cell => cell.textContent === "");
    if (emptyCells.length === 0) return;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Make move
    randomCell.textContent = "O";
}

function makeNormalMove() {
    let winningCell = null;
    let blockingCell = null;

    // Checks for possible winning and blocking moves
    for (let line of winningCombinations) {
        const [a,b,c] = line;

        const values = [
            cells[a].textContent,
            cells[b].textContent,
            cells[c].textContent
        ]

        // Check winning move
        if (
            values.filter(v => v === "O").length === 2 &&
            values.filter(v => v === "").length === 1
        ) {
            if (values[0] === "") winningCell = a;
            if (values[1] === "") winningCell = b;
            if (values[2] === "") winningCell = c;
        }

        // Check blocking move
        if (
            values.filter(v => v === "X").length === 2 &&
            values.filter(v => v === "").length === 1
        ) {
            if (values[0] === "") blockingCell = a;
            if (values[1] === "") blockingCell = b;
            if (values[2] === "") blockingCell = c;
        }
    }

    if (winningCell !== null) {
        cells[winningCell].textContent = "O";
        return;
    }
    if (blockingCell !== null) {
        cells[blockingCell].textContent = "O";
        return;
    }
    // Do random move if can not win or block opponent's win
    makeRandomMove();
}

function resetBoard() {
    winnerStatus.textContent = "";
    cells.forEach(cell => {
        cell.textContent = "";
    })
}

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        // Make move if there is no winner yet and cell is empty
        if (winnerStatus.textContent === "" && cell.textContent === "") {

            // Player's move
            cell.textContent = currentPlayer;
            checkWinner();

            // Computer's move or player switch
            switch (mode) {
                case "easy":
                    makeRandomMove();
                    checkWinner();
                    break;
                case "normal":
                    makeNormalMove();
                    checkWinner();
                    break;
                default:
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                    break;
            }
        }
    });
});

modeSelect.addEventListener("change", () => {
    mode = modeSelect.value;
    resetBoard();
})

resetButton.addEventListener("click", () => {
    resetBoard();
})
