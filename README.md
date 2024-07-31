# Mouthy Bird

![Mouthy Bird Gameplay](https://presstube.github.io/mouthy-bird/mouthy-bird-2.gif)

[Play Mouthy Bird! (laptop/desktop only)](https://presstube.github.io/mouthy-bird/)

**Mouthy Bird** is an interactive, face-controlled game where the player uses facial movements to control a bird's flight, avoiding obstacles and aiming for a high score. The game uses face detection technology to track facial expressions and map them to in-game actions.

This game was coded with assistance from ChatGPT 4o. To learn more about how to use AI to write code visit my AI coding workshop project: [WORMHOLE](https://presstube.com/wormhole)

## Features

- **Face-Controlled Flight**: Control the bird's movement by opening and closing your mouth, which adjusts the bird's altitude. An eyebrow shrug can restart the game.
- **Dynamic Obstacles**: Navigate through pipes that continuously spawn, increasing in difficulty by speeding up as you progress.
- **Visual and Audio Feedback**: The game provides real-time visual feedback and sound effects, including unique tones in each ear to assist with navigation.
- **Audio Navigation**: The right ear tone corresponds to the height of the hole, while the left ear tone corresponds to the height of the bird. This allows for an immersive experience where players can potentially play with their eyes closed.

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

4. **Open your browser** and navigate to the local server address provided, typically `http://localhost:3000`.

## Controls

- **Mouth**: Open and close your mouth to control the height of the "bird".
- **C Key**: Toggle the dat.GUI panel for adjusting game settings.
- **Eyebrow Shrug**: Restart the game.

## Customization

### dat.GUI

The game features a built-in settings panel using [dat.GUI](https://github.com/dataarts/dat.gui) for easy customization. You can adjust various parameters, including:

- **Detection Interval**: The frequency of face detection updates.
- **Thresholds**: Customize the sensitivity of mouth and eyebrow detection.
- **Audio**: Adjust the pitch range and other audio settings.

To customize settings, press the 'C' key to toggle the settings panel.

### Face-API Model

The game uses a pre-trained model for face detection, located in the `public/models` directory. You can replace these models with custom models if needed.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

- **Face Detection**: Powered by [face-api.js](https://github.com/justadudewhohacks/face-api.js).
- **Audio Synthesis**: Managed with [Tone.js](https://tonejs.github.io/).
- **Graphics and Interaction**: Implemented using the HTML5 Canvas API.

## Live Demo

Try the live demo [here](https://presstube.github.io/mouthy-bird/).
