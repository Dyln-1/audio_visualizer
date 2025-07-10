// Global variables
let audio;              // p5.Sound object
let fft;                // FFT analyzer
let baseHue = 0;        // Starting hue for color cycling
let rotationSpeed = 0.06; // Speed of rotation
let playing = false;    // Whether the visualizer is active

function preload() {
  // Load your audio file from the audio folder
  audio = loadSound('audio/music.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  colorMode(HSL);
  fft = new p5.FFT();

  // Start audio in loop, but muted (autoplay-safe)
  audio.loop();
  audio.setVolume(0);
  fft.setInput(audio);
}

function draw() {
  background(0);

  // If audio isn't active yet, show a message
  if (!playing) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text('Click anywhere to start the audio visualizer', width / 2, height / 2);
    return;
  }

  // Analyze the audio frequency spectrum
  let spectrum = fft.analyze();
  translate(width / 2, height / 2);

  let bars = spectrum.length;
  let angleStep = TWO_PI / bars;

  for (let i = 0; i < bars; i++) {
    let amp = spectrum[i];
    let len = map(amp, 0, 255, 5, height / 2);
    let hue = (baseHue + i * 0.5) % 360;

    push();
    rotate(i * angleStep + frameCount * rotationSpeed);
    fill(hue, 100, len / 3);
    noStroke();
    rect(0, 0, 2, len);
    pop();
  }
}

// Trigger audio and visualizer on first click
function mousePressed() {
  if (!playing) {
    audio.setVolume(1); // Unmute audio
    playing = true;
  } else {
    baseHue = floor(random(360)); // Change color scheme on future clicks
  }
}

// Adjust rotation speed based on horizontal mouse position
function mouseMoved() {
  let pct = mouseX / width;
  rotationSpeed = 0.001 + pct * 0.05;
}

// Resize canvas when window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
