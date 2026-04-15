// Fireworks OOP demo

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 3;
    this.r = 255;
    this.b = 0;
    this.g = 0;
    this.opactiy = 255;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opactiy);
    circle(this.x, this.y, this.radius * 2);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opactiy -= 5;
    if (this.opactiy <= 0) {
      fireworks = fireworks.filter(part => part !== this);
    }
  }
}

let fireworks = [];
const NUMBER_OF_PARTICLES = 250;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  for (let fires of fireworks) {
    fires.display();
    fires.update();
  }
}

function mousePressed() {
  for (let i = 0; i < NUMBER_OF_PARTICLES; i++) {
    let part = new Particle(mouseX, mouseY);
    fireworks.push(part);
  }
}
