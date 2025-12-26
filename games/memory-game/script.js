const tiles = document.querySelectorAll(".tile");
const highScoreElement = document.getElementById("highScore");
const gameStatus = document.getElementById("gameStatus");
const resetButton = document.getElementById("resetButton");
const colors = ["green", "red", "yellow", "blue"];

let sequence = [];
let playerTurn = false;
let playerIndex = 0;
let highScore = 0;
let score = 0;

tiles.forEach(tile => {
    tile.addEventListener("click", () => {
        // If showing sequence or game is over
        if (!playerTurn) return;

        // When clicked, flash tile and check color
        const color = tile.dataset.color;
        flashTile(color);
        checkInput(color);
    })
});

resetButton.addEventListener("click", () => {
    resetGame();
})

function nextRound() {
    // Pick random color and add it to the sequence
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    showSequence();
}

async function showSequence() {
    // Disable player input
    playerTurn = false;

    // Show colors from sequence
    for (const color of sequence) {
        flashTile(color);
        await new Promise(r => setTimeout(r, 500));
    }

    // Enable player input
    playerTurn = true;
}

function flashTile(color) {
    // Get right tile
    const tile = document.querySelector(`.tile.${color}`);

    // Flash tile
    tile.classList.add("active");
    setTimeout(() => {
        tile.classList.remove("active");
    }, 300);
}

function checkInput(color) {
    const correctColor = sequence[playerIndex];

    if (color === correctColor) {
        playerIndex++;

        // Check if whole sequence inputted
        if (playerIndex === sequence.length) {
            score++;

            // Update scores
            gameStatus.textContent = "Score: " + score;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = "High Score: " + highScore;
            }

            // Go to the next round
            playerIndex = 0;
            setTimeout(() => {
                nextRound();
            }, 800);
            return;
        }
    }

    // Wrong input sequence
    else {
        gameStatus.textContent = "Game over";
        playerTurn = false;
        setTimeout(() => {
            resetGame();
        }, 1500);
    }
}

function resetGame() {
    sequence = [];
    playerTurn = false;
    playerIndex = 0;
    score = 0;
    gameStatus.textContent = "";
    nextRound();
}

// Start by adding round
setTimeout(() => {
    nextRound();
}, 800);
