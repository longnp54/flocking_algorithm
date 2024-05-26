const flock = [];
//Tạo thanh trượt để thay đổi hệ số
let alignSlider, cohesionSlider, separationSlider;


//
function setup() {
  createCanvas(windowWidth, windowHeight);
  alignSlider = createSlider(0, 5, 1, 0.1);
  alignSlider.position(10, 10);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider.position(10, 40);
  separationSlider = createSlider(0, 5, 1, 0.1);
  separationSlider.position(10, 70);
   // tạo 100 cá thể 
  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  background(0);
  //In ra giá trị của thanh slider ra màn hình
  fill(255);
  textSize(16);
  text(`Align ${alignSlider.value()}`, alignSlider.x + alignSlider.width + 10, alignSlider.y + 16);
  text(`Cohesion: ${cohesionSlider.value()}`, cohesionSlider.x + cohesionSlider.width + 10, cohesionSlider.y + 16);
  text(`Separation: ${separationSlider.value()}`, separationSlider.x + separationSlider.width + 10, separationSlider.y + 16);
  for (let boid of flock) {
   
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }

}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
