const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const DINO_WIDTH = 50;
const DINO_HEIGHT = 50;
const CACTUS_WIDTH = 30;
const CACTUS_HEIGHT = 60;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 50;
const GRAVITY = 0.4;
const JUMP_SPEED = 10;
const LEVEL_SPEED_INCREMENT = 1;
const dinoImg = document.getElementById("dino-img");
const cactusImg = document.getElementById("cactus-img");
const birdImg = document.getElementById("bird-img");

let dino = {
    x: 50,
    y: canvas.height - DINO_HEIGHT,
    vy: 0,
    isJumping: false,
};
let cactus = {
    x: canvas.width,
    y: canvas.height - CACTUS_HEIGHT,
};
let bird = {
    x: canvas.width,
    y: canvas.height - BIRD_HEIGHT - DINO_HEIGHT,
};
let score = 0;
let level = 1;
let cactusSpeed = 4;
let birdSpeed = 6;
let isPaused = false; // added variable for pause state

function drawDino() {
    ctx.drawImage(dinoImg, dino.x, dino.y, DINO_WIDTH, DINO_HEIGHT);
}

function drawCactus() {
    ctx.drawImage(cactusImg, cactus.x, cactus.y, CACTUS_WIDTH, CACTUS_HEIGHT);
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, BIRD_HEIGHT, BIRD_WIDTH);
}

function handleJump() {
    if (!dino.isJumping) {
        dino.vy = -JUMP_SPEED;
        dino.isJumping = true;
    }
}

function handleInput(event) {
    if (event.keyCode === 32) {
        handleJump();
    }
}

document.addEventListener("keydown", handleInput);

function checkCollision() {
    if (dino.x + DINO_WIDTH > cactus.x && dino.x < cactus.x + CACTUS_WIDTH &&
        dino.y + DINO_HEIGHT > cactus.y) {
        alert(`Game over! Your score is ${score}.`);
        location.reload();
    }

    if (dino.x + DINO_WIDTH > bird.x && dino.x < bird.x + BIRD_WIDTH &&
        dino.y + DINO_HEIGHT > bird.y && dino.y < bird.y + BIRD_HEIGHT) {
        alert(`Game over! Your score is ${score}.`);
        location.reload();
    }
}

function update() {
    dino.y += dino.vy;
    dino.vy += GRAVITY;

    if (dino.y >= canvas.height - DINO_HEIGHT) {
        dino.y = canvas.height - DINO_HEIGHT;
        dino.vy = 0;
        dino.isJumping = false;
    }

    cactus.x -= cactusSpeed;
    bird.x -= birdSpeed;

    if (cactus.x < -CACTUS_WIDTH) {
        cactus.x = canvas.width;
        score++;
        if (score % 15 === 0) {
            level++;
            cactusSpeed += LEVEL_SPEED_INCREMENT;
            birdSpeed += LEVEL_SPEED_INCREMENT;
        }
    }

    if (bird.x < -BIRD_WIDTH) {
        bird.x = canvas.width;
        bird.y = canvas.height - BIRD_HEIGHT - (Math.random() * 100);
    }

    checkCollision();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDino();
    drawCactus();
    drawBird(); // draw the bird
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    document.getElementById("score-value").textContent = score;
    document.getElementById("level-value").textContent = level;
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Dino Game", canvas.width - 10, canvas.height - 10);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

const pauseButton = document.getElementById("pause-button");

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseButton.textContent = "Resume";
        gameLoop();
    } else {
        pauseButton.textContent = "Pause";
    }
}
pauseButton.addEventListener("click", togglePause);