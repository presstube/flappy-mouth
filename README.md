# Mouthy Bird

[Play Mouthy Bird! (laptop/desktop only)](https://presstube.github.io/mouthy-bird/)

![Mouthy Bird Gameplay](https://presstube.github.io/mouthy-bird/mouthy-bird-4.gif)

**Mouthy Bird** is a game where the player opens and closes their mouth to control the altitude of their "bird" and make it through an ever faster approaching series of walls. Based on the classic game [Flappy Bird](https://en.wikipedia.org/wiki/Flappy_Bird) by Dong Nguyen.

The game provides audio tones in each ear to assist with navigation. The left ear tone corresponds to the height of the bird while the right ear tone corresponds to the height of the next hole the bird needs to fly through. This allows players to play with their eyes closed just by matching the two tones.

Mouth Bird was coded with the assistance of ChatGPT 4o. To learn more about how to use AI to write code visit: [WORMHOLE](https://presstube.com/wormhole)

## How It Works

- **Face Detection**: The game uses [face-api.js](https://github.com/justadudewhohacks/face-api.js) to detect and analyze facial features. The mouth's openness controls the bird's vertical position, and an eyebrow shrug can trigger a game restart.
- **Audio**: Background audio and sound effects are generated and controlled using [Tone.js](https://tonejs.github.io/). The pitch changes based on the bird's position and the proximity of obstacles, providing additional sensory cues.

## Installation

To run the game locally, follow these steps:

1. **Clone the repository**:

   ```
   git clone https://github.com/presstube/mouthy-bird.git
   cd mouthy-bird
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Start the development server**:

   ```
   npm run dev
   ```

## Controls

- **Mouth**: Open and close your mouth to control the height of the bird.
- **Eyebrow Shrug**: Restart the game once you're dead.
- **C Key**: Toggle the dat.GUI panel for adjusting game settings.

## Customization

### dat.GUI

The game features a built-in settings panel using [dat.GUI](https://github.com/dataarts/dat.gui) for easy customization. You can adjust various parameters, including:

- **Detection Interval**: The frequency of face detection updates.
- **Thresholds**: Customize the sensitivity of mouth and eyebrow detection.
- **Audio**: Adjust the pitch range and other audio settings.

To customize settings, press the 'C' key to toggle the settings panel.

### Face-API Model

The game uses a pre-trained model for face detection, located in the `public/models` directory. You can replace these models with custom models if needed.

## Acknowledgments

- **Face Detection**: Powered by [face-api.js](https://github.com/justadudewhohacks/face-api.js).
- **Audio Synthesis**: Managed with [Tone.js](https://tonejs.github.io/).
- **Graphics and Interaction**: Implemented using the HTML5 Canvas API.

## Live Demo

Try the live demo [here](https://presstube.github.io/mouthy-bird/).
