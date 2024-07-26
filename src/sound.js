// sound.js
import * as Tone from "tone";
import { getPitchRange } from "./face.js";

let synthBird, synthPipe, gameOverSynth;
let pannerBird, pannerPipe;

export function initializeSound() {
  // Create new synths
  synthBird = new Tone.Synth();
  synthPipe = new Tone.Synth();

  // Create panners for stereo effect
  pannerBird = new Tone.Panner(-1).toDestination(); // Pan to left channel
  pannerPipe = new Tone.Panner(0).toDestination(); // Initially centered

  // Chain the bird synth to the left panner
  synthBird.connect(pannerBird);

  // Chain the pipe synth to the panner
  synthPipe.connect(pannerPipe);

  // Start both synths with the note "C4"
  const now = Tone.now();
  synthBird.triggerAttack("C4", now);
  synthPipe.triggerAttack("C4", now);
}

export function updatePitch(
  birdY,
  canvasHeight,
  pipeX,
  pipeY,
  canvasWidth,
  birdX,
) {
  const { pitchFloor, pitchCeil } = getPitchRange();

  // Map birdY to a frequency value between pitchFloor and pitchCeil
  const birdPitch =
    ((canvasHeight - birdY) / canvasHeight) * (pitchCeil - pitchFloor) +
    pitchFloor;
  synthBird.frequency.setValueAtTime(birdPitch, Tone.now());

  // Calculate the panning value based on the pipe's position relative to the bird and screen width
  const relativePipeX = pipeX - birdX;
  const panningValue = relativePipeX / (canvasWidth / 2); // Normalize between -1 and 1
  const clampedPanningValue = Math.max(-1, Math.min(1, panningValue)); // Ensure within range
  pannerPipe.pan.setValueAtTime(clampedPanningValue, Tone.now());

  // Map pipeY to a frequency value between pitchFloor and pitchCeil
  const pipePitch =
    ((canvasHeight - pipeY) / canvasHeight) * (pitchCeil - pitchFloor) +
    pitchFloor;
  synthPipe.frequency.setValueAtTime(pipePitch, Tone.now());
}

export function stopSound() {
  synthBird.triggerRelease(Tone.now());
  synthPipe.triggerRelease(Tone.now());
}

export function playGameOverMelody() {
  gameOverSynth = new Tone.Synth().toDestination();

  const now = Tone.now();
  const melody = [
    { note: "C4", duration: "8n", time: now },
    { note: "A3", duration: "8n", time: now + 0.5 },
    { note: "F3", duration: "8n", time: now + 1 },
    { note: "E3", duration: "8n", time: now + 1.5 },
    { note: "D3", duration: "8n", time: now + 2 },
    { note: "C3", duration: "4n", time: now + 2.5 },
  ];

  melody.forEach(({ note, duration, time }) => {
    gameOverSynth.triggerAttackRelease(note, duration, time);
  });
}
