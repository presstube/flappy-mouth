import * as faceapi from "face-api.js";
import dat from "dat.gui";

import { resetGame } from "./flappyBird.js";

const defaultSettings = {
  inputSize: 160,
  detectionInterval: 200,
  scoreThreshold: 0.5,
  eyebrowThresholdFloor: 10,
  eyebrowThresholdCeil: 30,
  mouthThresholdFloor: 10,
  mouthThresholdCeil: 50,
  pitchFloor: 200, // Minimum frequency in Hz
  pitchCeil: 800, // Maximum frequency in Hz
  model: "tinyFaceDetector",
  showLandmarks: true,
  showGraphics: true,
};

function loadSettings() {
  const savedSettings = localStorage.getItem("faceDetectionSettings");
  let settings = savedSettings
    ? JSON.parse(savedSettings)
    : { ...defaultSettings };

  for (const key in defaultSettings) {
    if (!(key in settings)) {
      settings[key] = defaultSettings[key];
    }
  }
  return settings;
}

let settings = loadSettings();
let intervalId;
let previousDetection = null;
let canvas;
let ctx;
let mouthOpen = 0; // Initialize mouthOpen value
let leftEyebrowRaise = 0; // Initialize mouthOpen value
let lastResetTime = 0; // Track the last reset time

async function setupWebcam() {
  const video = document.createElement("video");
  video.id = "video";
  document.body.appendChild(video);

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadModels() {
  const MODEL_URL = "./models";
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.mtcnn.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
}

function euclideanDistance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function drawCircle(ctx, x, y, radius, color, alpha) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.closePath();
  ctx.globalAlpha = 1.0; // Reset alpha to default
}

function drawDiamond(ctx, x, y, size, color, alpha) {
  ctx.beginPath();
  ctx.moveTo(x, y - size); // Top
  ctx.lineTo(x + size, y); // Right
  ctx.lineTo(x, y + size); // Bottom
  ctx.lineTo(x - size, y); // Left
  ctx.lineTo(x, y - size); // Back to top
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.closePath();
  ctx.globalAlpha = 1.0; // Reset alpha to default
}

function calculateEyebrowRaise(eyebrow, eye) {
  const verticalDistances = eyebrow.map((point, index) => {
    return eye[index] ? Math.abs(point.y - eye[index].y) : 0;
  });
  const averageDistance =
    verticalDistances.reduce((sum, dist) => sum + dist, 0) /
    verticalDistances.length;

  const normalizedValue =
    (averageDistance - settings.eyebrowThresholdFloor) /
    (settings.eyebrowThresholdCeil - settings.eyebrowThresholdFloor);
  return Math.max(0.0, Math.min(1.0, normalizedValue)); // Ensure the value is between 0.0 and 1.0
}

function calculateMouthOpen(mouth) {
  const verticalDistance = euclideanDistance(mouth[3], mouth[9]);
  const normalizedValue =
    (verticalDistance - settings.mouthThresholdFloor) /
    (settings.mouthThresholdCeil - settings.mouthThresholdFloor);
  return Math.max(0.0, Math.min(1.0, normalizedValue)); // Ensure the value is between 0.0 and 1.0
}

async function detectFaces(videoEl) {
  const detections = await faceapi
    .detectAllFaces(
      videoEl,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: settings.inputSize,
        scoreThreshold: settings.scoreThreshold,
      }),
    )
    .withFaceLandmarks()
    .withFaceExpressions();

  const displaySize = {
    width: videoEl.videoWidth,
    height: videoEl.videoHeight,
  };
  faceapi.matchDimensions(canvas, displaySize);

  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (settings.showLandmarks) {
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }

  for (let detection of resizedDetections) {
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const leftEyebrow = landmarks.getLeftEyeBrow();
    const rightEyebrow = landmarks.getRightEyeBrow();
    const mouth = landmarks.getMouth();

    if (leftEye.length === 6 && rightEye.length === 6) {
      leftEyebrowRaise = calculateEyebrowRaise(leftEyebrow, leftEye);
      const rightEyebrowRaise = calculateEyebrowRaise(rightEyebrow, rightEye);

      const currentTime = Date.now();
      if (leftEyebrowRaise > 0.7 && currentTime - lastResetTime > 3000) {
        resetGame();
        lastResetTime = currentTime; // Update the last reset time
      }

      if (settings.showGraphics) {
        if (leftEyebrowRaise > 0) {
          const leftEyeCenter = {
            x: (leftEye[0].x + leftEye[3].x) / 2,
            y: (leftEye[1].y + leftEye[5].y) / 2,
          };
          drawCircle(
            ctx,
            leftEyeCenter.x,
            leftEyeCenter.y,
            5,
            "blue",
            leftEyebrowRaise,
          );
        }
        if (rightEyebrowRaise > 0) {
          const rightEyeCenter = {
            x: (rightEye[0].x + rightEye[3].x) / 2,
            y: (rightEye[1].y + rightEye[5].y) / 2,
          };
          drawCircle(
            ctx,
            rightEyeCenter.x,
            rightEyeCenter.y,
            5,
            "blue",
            rightEyebrowRaise,
          );
        }

        mouthOpen = calculateMouthOpen(mouth);
        if (mouthOpen > 0) {
          const thirdEyePosition = {
            x: (leftEye[0].x + rightEye[3].x) / 2,
            y: (leftEyebrow[2].y + rightEyebrow[2].y) / 2 - 20, // Adjust the y-coordinate as needed
          };
          drawDiamond(
            ctx,
            thirdEyePosition.x,
            thirdEyePosition.y,
            10,
            "blue",
            mouthOpen,
          );
        }
      }
    } else {
      console.log("Error: Eye landmarks not detected correctly.");
    }
  }
}

async function onPlay(videoEl) {
  clearInterval(intervalId);
  intervalId = setInterval(async () => {
    await detectFaces(videoEl);
  }, settings.detectionInterval);
}

function initGUI() {
  const gui = new dat.GUI({ autoPlace: false });
  gui.add(settings, "inputSize", 128, 320, 32).onChange(onSettingsChange);
  gui.add(settings, "detectionInterval", 1, 500, 20).onChange(onSettingsChange);
  gui.add(settings, "scoreThreshold", 0.1, 0.9, 0.1).onChange(onSettingsChange);
  gui
    .add(settings, "eyebrowThresholdFloor", 0, 50, 1)
    .onChange(onSettingsChange);
  gui
    .add(settings, "eyebrowThresholdCeil", 0, 50, 1)
    .onChange(onSettingsChange);
  gui.add(settings, "mouthThresholdFloor", 0, 50, 1).onChange(onSettingsChange);
  gui.add(settings, "mouthThresholdCeil", 0, 50, 1).onChange(onSettingsChange);
  gui.add(settings, "pitchFloor", 0, 1000).onChange(onSettingsChange); // Add pitchFloor to GUI
  gui.add(settings, "pitchCeil", 0, 1000).onChange(onSettingsChange); // Add pitchCeil to GUI
  gui
    .add(settings, "model", ["tinyFaceDetector", "ssdMobilenetv1", "mtcnn"])
    .onChange(onSettingsChange);
  gui.add(settings, "showLandmarks").onChange(onSettingsChange);
  gui.add(settings, "showGraphics").onChange(onSettingsChange);

  const customContainer = document.getElementById("gui-container");
  customContainer.appendChild(gui.domElement);

  // Load and apply GUI visibility state
  const guiState = localStorage.getItem("guiVisibilityState");
  if (guiState === "hidden") {
    gui.hide();
  }

  // Add button to toggle GUI visibility and save state
  const toggleButton = document.createElement("button");
  toggleButton.innerText = "Toggle GUI";
  toggleButton.style.position = "absolute";
  toggleButton.style.top = "10px";
  toggleButton.style.right = "10px";
  toggleButton.style.zIndex = "1000";
  document.body.appendChild(toggleButton);

  toggleButton.addEventListener("click", () => {
    if (gui.domElement.style.display === "none") {
      gui.show();
      localStorage.setItem("guiVisibilityState", "visible");
    } else {
      gui.hide();
      localStorage.setItem("guiVisibilityState", "hidden");
    }
  });
}

function onSettingsChange() {
  saveSettings(settings);
  const video = document.getElementById("video");
  if (video) {
    onPlay(video);
  }
}

function saveSettings(settings) {
  localStorage.setItem("faceDetectionSettings", JSON.stringify(settings));
}

async function init() {
  await loadModels();
  const video = await setupWebcam();
  video.play();
  video.addEventListener("play", () => {
    onPlay(video);
  });
  canvas = document.createElement("canvas");
  canvas.id = "overlay";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  initGUI();
}

function getMouthOpen() {
  return mouthOpen;
}

function getPitchRange() {
  return { pitchFloor: settings.pitchFloor, pitchCeil: settings.pitchCeil };
}

export { init, getMouthOpen, getPitchRange }; // Export the getter function
