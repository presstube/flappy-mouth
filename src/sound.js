// sound.js
import * as Tone from "tone";
import { getPitchRange } from "./face.js";

let synthBird, synthPipe, tremoloBird, tremoloPipe;

export function initializeSound() {
  // Create new synths
  synthBird = new Tone.Synth().toDestination();
  tremoloBird = new Tone.Tremolo().toDestination();
  synthBird.connect(tremoloBird);
  tremoloBird.start();

  synthPipe = new Tone.Synth().toDestination();
  tremoloPipe = new Tone.Tremolo().toDestination();
  synthPipe.connect(tremoloPipe);
  tremoloPipe.start();

  // Start both synths with the note "C4"
  const now = Tone.now();
  synthBird.triggerAttack("C4", now);
  synthPipe.triggerAttack("C4", now);
}

export function updatePitch(birdY, canvasHeight, pipeGapY) {
  const { pitchFloor, pitchCeil } = getPitchRange();

  // Map birdY to a frequency value between pitchFloor and pitchCeil
  const birdPitch =
    ((canvasHeight - birdY) / canvasHeight) * (pitchCeil - pitchFloor) +
    pitchFloor;
  synthBird.frequency.setValueAtTime(birdPitch, Tone.now());

  // Map pipeGapY to a frequency value between pitchFloor and pitchCeil
  const pipePitch =
    ((canvasHeight - pipeGapY) / canvasHeight) * (pitchCeil - pitchFloor) +
    pitchFloor;
  synthPipe.frequency.setValueAtTime(pipePitch, Tone.now());

  // Map birdY to a tremolo depth value between 0 and 1
  const tremoloDepth = (canvasHeight - birdY) / canvasHeight;
  tremoloBird.depth.setValueAtTime(tremoloDepth, Tone.now());
  tremoloPipe.depth.setValueAtTime(tremoloDepth, Tone.now());
}

export function stopSound() {
  synthBird.triggerRelease(Tone.now());
  synthPipe.triggerRelease(Tone.now());
}
