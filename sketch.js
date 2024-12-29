const flock = [];
// Create sliders to adjust the weights for alignment, cohesion, and separation behaviors
let alignSlider, cohesionSlider, separationSlider;

function setup() {
  // Create a canvas to fit the window size
  createCanvas(windowWidth, windowHeight);

  // Initialize sliders for alignment, cohesion, and separation
  alignSlider = createSlider(0, 5, 1, 0.1); // Alignment slider: min=0, max=5, default=1, step=0.1
  alignSlider.position(10, 10); // Set slider position
  cohesionSlider = createSlider(0, 5, 1, 0.1); // Cohesion slider: min=0, max=5, default=1, step=0.1
  cohesionSlider.position(10, 40); // Set slider position
  separationSlider = createSlider(0, 5, 1, 0.1); // Separation slider: min=0, max=5, default=1, step=0.1
  separationSlider.position(10, 70); // Set slider position

  // Create 100 boid objects and add them to the flock array
  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  // Set the background color to black
  background(0);

  // Display the slider values on the canvas
  fill(255); // Set text color to white
  textSize(16); // Set text size
  text(`Align: ${alignSlider.value()}`, alignSlider.x + alignSlider.width + 10, alignSlider.y + 16);
  text(`Cohesion: ${cohesionSlider.value()}`, cohesionSlider.x + cohesionSlider.width + 10, cohesionSlider.y + 16);
  text(`Separation: ${separationSlider.value()}`, separationSlider.x + separationSlider.width + 10, separationSlider.y + 16);

  // Loop through each boid in the flock
  for (let boid of flock) {
    boid.edges(); // Check if the boid is at the canvas edge and wrap around if necessary
    boid.flock(flock); // Apply flocking behaviors based on nearby boids
    boid.update(); // Update the boid's position and velocity
    boid.show(); // Render the boid on the canvas
  }
}

// Adjust the canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
