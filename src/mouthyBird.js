import { getMouthOpen } from "./face.js";
import {
  initializeSound,
  updatePitch,
  stopSound,
  playGameOverMelody,
} from "./sound.js";

const canvas = document.createElement("canvas");
canvas.id = "gameCanvas"; // Set the ID for the canvas to apply CSS
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Set canvas dimensions to fullscreen with retina scaling
let dpr = window.devicePixelRatio || 1;
function setCanvasSize() {
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.scale(dpr, dpr);
}
setCanvasSize();

// Load custom font
const font = new FontFace("Kriller4", "url(/Kriller4.woff2)");
font.load().then((loadedFont) => {
  document.fonts.add(loadedFont);
});

// Game variables
let gap = 200;
let birdX = 50; // Ensure birdX is defined here
let birdY = canvas.height / (2 * dpr); // Adjust for retina scaling
let targetBirdY = birdY; // Target y position based on mouthOpen
let gravity = 0.1;
let lift = -4;
let velocity = 0;
let score = 0;
let pipeWidth = 100;
let initPipeSpeed = 3;
let pipeSpeed = initPipeSpeed;
let pipeSpeedIncrement = 0.1; // Speed increment for each passed pipe
let pipeSpacing = 700; // Increased space between consecutive pipes
let gameRunning = true;

function moveUp() {
  velocity = lift;
}

// Pipe coordinates
let pipes = [];

function spawnPipe() {
  // Ensure the pipe gap is always on screen
  let minHeight = 50;
  let maxHeight = canvas.height / dpr - gap - minHeight;
  let pipeY = Math.floor(Math.random() * maxHeight) + minHeight;
  pipes.push({
    x: canvas.width / dpr,
    y: pipeY,
  });
}

// Spawn the first pipe
spawnPipe();

export function resetGame() {
  birdX = 50;
  birdY = canvas.height / (2 * dpr);
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

// Helper function to draw rounded rectangles
function drawRoundedRect(ctx, x, y, width, height, radius, fillColor) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

// Draw shapes
function draw() {
  if (!gameRunning) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

  // Draw pipes
  ctx.fillStyle = "#FFFFFF"; // Set pipe color to white
  let nextPipeX = 0; // Default value if no pipes are present
  let nextPipeY = 0; // Default value if no pipes are present
  for (let i = 0; i < pipes.length; i++) {
    let constant = pipes[i].y + gap; // Position of the lower pipe
    drawRoundedRect(ctx, pipes[i].x, 0, pipeWidth, pipes[i].y, 4, "#FFFFFF"); // Upper pipe
    drawRoundedRect(
      ctx,
      pipes[i].x,
      constant,
      pipeWidth,
      canvas.height / dpr - constant,
      4,
      "#FFFFFF",
    ); // Lower pipe

    if (i === 0) {
      nextPipeX = pipes[i].x; // X position of the first pipe
      nextPipeY = pipes[i].y + gap / 2; // Y position of the center of the first pipe gap
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
      playGameOverMelody(); // Play the game over melody
      return;
    }

    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
      score++;
      pipeSpeed += pipeSpeedIncrement; // Increase pipe speed with each passed pipe
    }
  }

  // Spawn new pipes at regular intervals
  if (pipes[pipes.length - 1].x < (canvas.width - pipeSpacing * dpr) / dpr) {
    spawnPipe();
  }

  // Draw bird
  drawRoundedRect(ctx, birdX, birdY, 20, 20, 4, "#FFFFFF"); // Bird with rounded corners

  // Update bird's target position based on mouthOpen value from face.js
  targetBirdY = (canvas.height - getMouthOpen() * canvas.height) / dpr;

  // Tween bird's position towards targetBirdY
  const tweenSpeed = 0.1; // Adjust tween speed as needed
  birdY += (targetBirdY - birdY) * tweenSpeed;

  // Update pitch and panning based on bird's position and the next pipe position
  updatePitch(
    birdY,
    canvas.height / dpr,
    nextPipeX,
    nextPipeY,
    canvas.width / dpr,
    birdX,
  );

  // Draw score with custom font at top right
  ctx.fillStyle = "#fff";
  ctx.font = "20px Kriller4";
  ctx.textAlign = "right";
  ctx.fillText("Score: " + score, canvas.width / dpr - 10, 20);

  requestAnimationFrame(draw);
}

export function startMouthyBird() {
  draw();
}

export function isGameRunning() {
  return gameRunning;
}

// Handle window resize events
window.addEventListener("resize", () => {
  // Recalculate device pixel ratio
  dpr = window.devicePixelRatio || 1;
  setCanvasSize();

  // Adjust birdY position to fit new canvas height
  birdY = Math.min(birdY, canvas.height / dpr);
  targetBirdY = Math.min(targetBirdY, canvas.height / dpr);
});
