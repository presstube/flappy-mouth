import { getMouthOpen } from "./face.js";
import { initializeSound, updatePitch, stopSound } from "./sound.js";

const canvas = document.createElement("canvas");
canvas.id = "gameCanvas"; // Set the ID for the canvas to apply CSS
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Set canvas dimensions to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let gap = 200;
let birdX = 50;
let birdY = canvas.height / 2;
let targetBirdY = birdY; // Target y position based on mouthOpen
let gravity = 0.1;
let lift = -4;
let velocity = 0;
let score = 0;
let pipeWidth = 100;
let initPipeSpeed = 10;
let pipeSpeed = initPipeSpeed;
let pipeSpeedIncrement = 0.1; // Speed increment for each passed pipe
let pipeSpacing = 700; // Increased space between consecutive pipes
let gameRunning = true;

// On key down
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameRunning) {
      moveUp();
    } else {
      resetGame();
    }
  }
});

function moveUp() {
  velocity = lift;
}

// Pipe coordinates
let pipes = [];

function spawnPipe() {
  // Ensure the pipe gap is always on screen
  let minHeight = 50;
  let maxHeight = canvas.height - gap - minHeight - 40; // 40 is the height of the ground
  let pipeY = Math.floor(Math.random() * maxHeight) + minHeight;
  pipes.push({
    x: canvas.width,
    y: pipeY,
  });
}

// Spawn the first pipe
spawnPipe();

function resetGame() {
  birdX = 50;
  birdY = canvas.height / 2;
  targetBirdY = birdY;
  velocity = 0;
  score = 0;
  pipeSpeed = initPipeSpeed; // Reset pipe speed
  pipes = [];
  spawnPipe();
  gameRunning = true;
  initializeSound(); // Restart the sound when the game starts again with a new random note
  draw();
}

// Draw shapes
function draw() {
  if (!gameRunning) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background with 50% alpha
  ctx.fillStyle = "rgba(112, 197, 206, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw pipes
  ctx.fillStyle = "#228B22";
  let nextPipeGapY = 0; // Default value if no pipes are present
  for (let i = 0; i < pipes.length; i++) {
    let constant = pipes[i].y + gap; // Position of the lower pipe
    ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].y); // Upper pipe
    ctx.fillRect(
      pipes[i].x,
      constant,
      pipeWidth,
      canvas.height - constant - 40,
    ); // Lower pipe

    if (i === 0) {
      nextPipeGapY = pipes[i].y + gap / 2; // Y position of the center of the first pipe gap
    }

    pipes[i].x -= pipeSpeed;

    // Detect collision
    if (
      birdX + 20 >= pipes[i].x &&
      birdX <= pipes[i].x + pipeWidth &&
      (birdY <= pipes[i].y || birdY + 20 >= constant)
    ) {
      gameRunning = false;
      console.log("COLLIDE");
      stopSound(); // Stop sound on game over
      return;
    }

    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
      score++;
      pipeSpeed += pipeSpeedIncrement; // Increase pipe speed with each passed pipe
    }
  }

  // Spawn new pipes at regular intervals
  if (pipes[pipes.length - 1].x < canvas.width - pipeSpacing) {
    spawnPipe();
  }

  // Draw ground
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  // Draw bird
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(birdX, birdY, 20, 20);

  // Update bird's target position based on mouthOpen value from face.js
  targetBirdY = canvas.height - getMouthOpen() * canvas.height;

  // Tween bird's position towards targetBirdY
  const tweenSpeed = 0.1; // Adjust tween speed as needed
  birdY += (targetBirdY - birdY) * tweenSpeed;

  // Update pitch based on bird's position and the next pipe gap
  updatePitch(birdY, canvas.height, nextPipeGapY);

  // Draw score
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, canvas.height - 20);

  requestAnimationFrame(draw);
}

export function startFlappyBird() {
  draw();
}

export { resetGame }; // Export the getter function
