
class Boid {
    constructor() {
      this.position = createVector(random(width), random(height));
      this.velocity = p5.Vector.random2D();
      this.velocity.setMag(random(2, 4));
      this.acceleration = createVector();
      this.maxForce = 0.2;
      this.maxSpeed = 5;
    
    }
  
    edges() {
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
         // Tính toán hướng đồng phương của các thể
    //Đặt bán kình là 25
      let perceptionRadius = 25;
      let steering = createVector();
      let total = 0;
        //Tính khoảng các từ cá thể đang xét tới các cá thể khác
      for (let other of boids) {
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        //Nếu có cá thể trong bán kính đang xét thì cộng lại giá trị vector vận tốc của chúng
        if (other != this && d < perceptionRadius) {
          steering.add(other.velocity);
          total++;
        }
      }
      //Tính toán vector vận tốc trung bình
      if (total > 0) {
        steering.div(total);
        //Đặt độ lớn của vector = max
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    separation(boids) {
       // Tìm vị trí thích hợp để giữ khoảng cách an toán
    //Đặt bán kình là 24
      let perceptionRadius = 24;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        //Tính khoảng các từ cá thể đang xét tới các cá thể khác
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        //Nếu có cá thể trong bán kính đang xét thì cộng lại vị trí chúng
        if (other != this && d < perceptionRadius) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
      }
      //Tính toán vị trí trung bình
      if (total > 0) {
        steering.div(total);
        //Tới vị trí cần đền với tốc đọ Max
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
  
    cohesion(boids) {
    // Nhập bầy, tìm vị trí thích để nhập
    //Đặt bán kình là 50
      let perceptionRadius = 50;
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        //Tính khoảng các từ cá thể đang xét tới các cá thể khác
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
       //Nếu có cá thể trong bán kính đang xét thì cộng lại vị trí chúng
        if (other != this && d < perceptionRadius) {
          steering.add(other.position);
          total++;
        }
      }
      //Tính toán vị trí trung bình
      if (total > 0) {
        steering.div(total);
        steering.sub(this.position);
        //Tới vị trí cần đền với tốc đọ Max
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;
    }
    
    //Hàm cho mục tiêu đi theo chuột
    followMouse() {
      let mousePos = createVector(mouseX, mouseY);
      let steering = p5.Vector.sub(mousePos, this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
      return steering;
    }

    flock(boids) {
      let alignment = this.align(boids);
      let cohesion = this.cohesion(boids);
      let separation = this.separation(boids);
      let followMouse = this.followMouse();
       
      alignment.mult(alignSlider.value());
      cohesion.mult(cohesionSlider.value());
      separation.mult(separationSlider.value());
      followMouse.mult(1);
      

      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
      this.acceleration.add(followMouse);
      
    }
    
  
    update() {
      this.position.add(this.velocity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.acceleration.mult(0);
    }
  
    show() {
    //Set arrow size and angle

    const arrowSize = 20;
    const angle = this.velocity.heading();

    // Push transformation matrix
    push();

    // Translate to the current position
    translate(this.position.x, this.position.y);

    // Rotate based on velocity angle
    rotate(angle);

    // Draw arrow body
    strokeWeight(2);
    stroke(255);
    line(0, 0, arrowSize * 0.5, 0);

    // Draw arrow head
    triangle(arrowSize * 0.75, 0, arrowSize, arrowSize * 0.25, arrowSize, -arrowSize * 0.25);

    // Pop transformation matrix
    pop();
    }
   
  }
  