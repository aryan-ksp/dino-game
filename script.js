const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const dinoImg = new Image();
dinoImg.src = "images/dino.png";

const cactusImg = new Image();
cactusImg.src = "images/cactus.png";

const cloudImg = new Image();
cloudImg.src = "images/cloud.png";

// Load sounds
const jumpSound = new Audio("sounds/jump.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

let dino = { x: 50, y: 150, width: 40, height: 40, dy: 0, gravity: 1, jumpPower: -15, onGround: true };
let obstacles = [];
let clouds = [];
let gameOver = false;
let score = 0;
let frameCount = 0; // Track frames for slow score update

function drawDino() {
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawClouds() {
    clouds.forEach(cloud => {
        ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);
    });
}

function updateGame() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gravity & Jump
    if (!dino.onGround) {
        dino.dy += dino.gravity;
        dino.y += dino.dy;
    }
    if (dino.y >= 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.onGround = true;
    }

    // Move obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= 5;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    
    // Move clouds
    clouds.forEach(cloud => {
        cloud.x -= 2;
    });
    clouds = clouds.filter(cloud => cloud.x + cloud.width > 0);

    // Collision detection
    obstacles.forEach(obstacle => {
        if (dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y) {
                gameOver = true;
                gameOverSound.play();
                alert("Game Over! Score: " + Math.floor(score / 10)); // Adjusted score
        }
    });

    // Add new obstacles
    if (Math.random() < 0.01) {
        obstacles.push({ x: canvas.width, y: 160, width: 30, height: 40 });
    }

    // Add new clouds
    if (Math.random() < 0.01) {
        clouds.push({ x: canvas.width, y: Math.random() * 50 + 10, width: 50, height: 30 });
    }

    // Slow Score Update (Increase every 10 frames)
    frameCount++;
    if (frameCount % 10 === 0) { // Updates every 10 frames
        score++;
        document.getElementById("scoreBox").innerText = "Score: " + Math.floor(score / 10);
    }

    drawClouds();
    drawDino();
    drawObstacles();
    requestAnimationFrame(updateGame);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && dino.onGround) {
        dino.dy = dino.jumpPower;
        dino.onGround = false;
        jumpSound.play();
    }
});

updateGame();
