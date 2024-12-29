class Boid {
  constructor() {
      // Initialize position, velocity, and acceleration vectors for each boid
      this.position = createVector(random(width), random(height));
      this.velocity = p5.Vector.random2D(); // Random initial direction
      this.velocity.setMag(random(2, 4)); // Set random initial speed
      this.acceleration = createVector(); // No initial acceleration

      // Set limits for steering and speed
      this.maxForce = 0.2; // Maximum steering force
      this.maxSpeed = 5;   // Maximum velocity magnitude
  }

  edges() {
      // Wrap the boid around the edges of the canvas
      if (this.position.x > width) {
          this.position.x = 0;
      } else if (this.position.x < 0) {
          this.position.x = width;
      }
      if (this.position.y > height) {
          this.position.y = 0;
      } else if (this.position.y < 0) {
          this.position.y = height;
      }
  }

  align(boids) {
      // Compute alignment force (steer towards the average velocity of nearby boids)
      let perceptionRadius = 25; // Radius of perception
      let steering = createVector(); // Steering vector
      let total = 0; // Counter for boids within the perception radius

      // Check all other boids
      for (let other of boids) {
          let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
          if (other != this && d < perceptionRadius) {
              steering.add(other.velocity); // Add their velocity
              total++;
          }
      }

      if (total > 0) {
          steering.div(total); // Average velocity
          steering.setMag(this.maxSpeed); // Match max speed
          steering.sub(this.velocity); // Calculate steering force
          steering.limit(this.maxForce); // Limit the force
      }

      return steering;
  }

  separation(boids) {
      // Compute separation force (avoid crowding other boids)
      let perceptionRadius = 24; // Radius of separation
      let steering = createVector();
      let total = 0;

      for (let other of boids) {
          let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
          if (other != this && d < perceptionRadius) {
              let diff = p5.Vector.sub(this.position, other.position); // Direction away from other boid
              diff.div(d * d); // Weight by inverse square of distance
              steering.add(diff);
              total++;
          }
      }

      if (total > 0) {
          steering.div(total); // Average direction
          steering.setMag(this.maxSpeed); // Match max speed
          steering.sub(this.velocity); // Calculate steering force
          steering.limit(this.maxForce); // Limit the force
      }

      return steering;
  }

  cohesion(boids) {
      // Compute cohesion force (steer towards the average position of nearby boids)
      let perceptionRadius = 50; // Radius of perception
      let steering = createVector();
      let total = 0;

      for (let other of boids) {
          let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
          if (other != this && d < perceptionRadius) {
              steering.add(other.position); // Add their position
              total++;
          }
      }

      if (total > 0) {
          steering.div(total); // Average position
          steering.sub(this.position); // Direction towards the average position
          steering.setMag(this.maxSpeed); // Match max speed
          steering.sub(this.velocity); // Calculate steering force
          steering.limit(this.maxForce); // Limit the force
      }

      return steering;
  }

  followMouse() {
      // Compute steering force to follow the mouse
      let mousePos = createVector(mouseX, mouseY); // Position of the mouse
      let steering = p5.Vector.sub(mousePos, this.position); // Direction towards the mouse
      steering.setMag(this.maxSpeed); // Match max speed
      steering.sub(this.velocity); // Calculate steering force
      steering.limit(this.maxForce); // Limit the force
      return steering;
  }

  flock(boids) {
      // Combine all steering behaviors: alignment, cohesion, separation, and following the mouse
      let alignment = this.align(boids);
      let cohesion = this.cohesion(boids);
      let separation = this.separation(boids);
      let followMouse = this.followMouse();

      // Weight the behaviors
      alignment.mult(alignSlider.value());
      cohesion.mult(cohesionSlider.value());
      separation.mult(separationSlider.value());
      followMouse.mult(1);

      // Accumulate the steering forces
      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
      this.acceleration.add(followMouse);
  }

  update() {
      // Update position and velocity of the boid
      this.position.add(this.velocity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed); // Ensure velocity does not exceed max speed
      this.acceleration.mult(0); // Reset acceleration for the next frame
  }

  show() {
      // Display the boid as an arrow
      const arrowSize = 20; // Size of the arrow
      const angle = this.velocity.heading(); // Direction of movement

      push(); // Save transformation state
      translate(this.position.x, this.position.y); // Move to boid position
      rotate(angle); // Rotate to match velocity direction
      strokeWeight(2); // Line thickness
      stroke(255); // White color
      line(0, 0, arrowSize * 0.5, 0); // Draw arrow body
      triangle(arrowSize * 0.75, 0, arrowSize, arrowSize * 0.25, arrowSize, -arrowSize * 0.25); // Draw arrow head
      pop(); // Restore transformation state
  }
}
