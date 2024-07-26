import { init as initFaceAPI } from "./face.js";
import { startFlappyBird } from "./flappyBird.js";
import { initializeSound } from "./sound.js";

async function init() {
  await initFaceAPI();
  initializeSound();
  startFlappyBird();
}

init();
