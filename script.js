// Global variables for audio and visualization
let audio;              // p5.Sound object for playing music
let fft;                // FFT analyzer for frequency spectrum
let baseHue = 0;        // Base hue for color cycling of bars
let rotationSpeed = 0.06; // Rotation speed of visualizer bars
let playing = false;    // Flag to indicate if audio is playing

function preload() {
  // Load the audio file (make sure 'music.mp3' is in your project folder)
  audio = loadSound('music.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  colorMode(HSL);
  fft = new p5.FFT();
  fft.setInput(audio);
}

function draw() {
  background(0);

  if (!playing) {
    // Show instructions before playing
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text('Click anywhere to start the audio visualizer', width / 2, height / 2);
    return;
  }

  // Analyze the frequency spectrum of the audio
  let spectrum = fft.analyze();

  // Move origin to center of canvas for circular drawing
  translate(width / 2, height / 2);

  let bars = spectrum.length;           // Number of bars 
  let angleStep = TWO_PI / bars;        // Angle between each bar

  for (let i = 0; i < bars; i++) {
    let amp = spectrum[i];                               // Amplitude of frequency
    let len = map(amp, 0, 255, 5, height / 2);          // Length of the bar based on amplitude
    let hue = (baseHue + i * 0.5) % 360;                // Hue cycles through diferrent colors 

    push();
    rotate(i * angleStep + frameCount * rotationSpeed); // Rotate bar around center
    fill(hue, 100, len / 3);                             // Set bar color 
    noStroke();
    rect(0, 0, 2, len);                                  // Draw the bar rect
    pop();
  }
}

// Called on mouse press to start or change visualizer
function mousePressed() {
  if (!playing) {
    // Resume AudioContext to satisfy browser autoplay policies
    getAudioContext().resume().then(() => {
      audio.loop();           // Start looping the audio
      audio.setVolume(1);     // Unmute audio
      playing = true;         // Mark as playing
    });
  } else {
    // Change colors on clicks
    baseHue = floor(random(360));
  }
}

// Adjust rotation speed by horizontal mouse position
function mouseMoved() {
  let pct = mouseX / width;
  rotationSpeed = 0.001 + pct * 0.05;
}

// Resize canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

