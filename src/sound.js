// sound.js
import * as Tone from "tone";
import { getPitchRange } from "./face.js";

let synth;

export function initializeSound() {
  synth = new Tone.Synth().toDestination();
  const now = Tone.now();
  synth.triggerAttack("C4", now);
}

export function updatePitch(birdY, canvasHeight) {
  const { pitchFloor, pitchCeil } = getPitchRange();

  // Map birdY to a frequency value between pitchFloor and pitchCeil
  const pitch =
    ((canvasHeight - birdY) / canvasHeight) * (pitchCeil - pitchFloor) +
    pitchFloor;
  synth.frequency.setValueAtTime(pitch, Tone.now());
}

export function stopSound() {
  synth.triggerRelease(Tone.now());
}
