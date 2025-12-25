const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
const highScoreElement = document.getElementById("highScore");
highScoreElement.textContent = "High Score: 0";
const gameStatus = document.getElementById("gameStatus");

const gridSize = 50;
const tileCount = Math.floor(canvas.width / gridSize);

// Starting position for snake
const initialPosition = {
    x: Math.floor(tileCount / 2),
    y: Math.floor(tileCount / 2)
};
// Movement vectors
const directions = {
    ArrowUp:    { dx: 0, dy: -1 },
    ArrowDown:  { dx: 0, dy: 1 },
    ArrowLeft:  { dx: -1, dy: 0 },
    ArrowRight: { dx: 1, dy: 0 }
};

let snake = [{ ...initialPosition }];
let dx = 1;
let dy = 0;
let score = 0;
let highScore = 0;
let directionChanged = false;
let apple = randomApple();
let lastUpdate = 0;
let speed = 250;

document.addEventListener("keydown", handleInput);

function handleInput(e) {
    // Allow only one direction change per update
    if (directionChanged) return;

    const newDir = directions[e.key];
    if (!newDir) return;

    // Do not allow 180 degree turns
    if (newDir.dx !== -dx && newDir.dy !== -dy) {
        dx = newDir.dx;
        dy = newDir.dy;
        directionChanged = true;
    }
}

function gameLoop(timestamp) {
    // Speeds determines update rate
    if (timestamp - lastUpdate > speed) {
        update();
        draw();
        lastUpdate = timestamp;
        directionChanged = false;
    }
    requestAnimationFrame(gameLoop);
}

function update() {
    // New head
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // Check collision
    if (isWallCollision(head) || isSelfCollision(head)) {
        resetGame();
        return;
    }

    // Add new part to front
    snake.unshift(head);

    // Check collision with apple
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        apple = randomApple();
        if (apple === null) {
            resetGame();
            return;
        }
    } 
    // If no collision with apple, then delete part from back
    else {
        snake.pop();
    }

    // Update score and high score
    gameStatus.textContent = "Score: " + score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = "High Score: " + highScore;
    }
}

function draw() {
    // Board
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Snake
    ctx.fillStyle = "green";
    snake.forEach(part => {
        ctx.fillRect(
            part.x * gridSize,
            part.y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    });

    // Apple
    ctx.fillStyle = "red";
    ctx.fillRect(
        apple.x * gridSize,
        apple.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );
}

function randomApple() {
    // Get free tiles
    const freeTiles = [];
    for (let x = 0; x < tileCount; x++) {
        for (let y = 0; y < tileCount; y++) {
            if (!snake.some(part => part.x === x && part.y === y)) {
                freeTiles.push({ x, y });
            }
        }
    }

    // Pick one from free tiles
    if (freeTiles.length === 0) return null;
    return freeTiles[Math.floor(Math.random() * freeTiles.length)];
}

function isWallCollision(head) {
    return (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    );
}

function isSelfCollision(head) {
    // Loop through every part of the snake except the head
    for (let i = 1; i < snake.length; i++) {
        const part = snake[i];

        // If any body part has the same coordinates -> collision
        if (part.x === head.x && part.y === head.y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    snake = [{ ...initialPosition }];
    dx = 1;
    dy = 0;
    score = 0;
    apple = randomApple();
    directionChanged = false;
}

requestAnimationFrame(gameLoop);
