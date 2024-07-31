import { init as initFaceAPI } from "./face.js";
import { startMouthyBird } from "./mouthyBird.js";
import { initializeSound } from "./sound.js";

async function init() {
  await initFaceAPI();
  initializeSound();
  startMouthyBird();
}

init();
