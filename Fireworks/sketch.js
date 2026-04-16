// Fireworks OOP demo

class Particle {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 3;
    this.r = 255;
    this.b = 0;
    this.g = 0;
    this.opactiy = 255;
    this.angle = angle;
    this.speed = random(1, 3);
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opactiy);
    circle(this.x, this.y, this.radius * 2);
  }

  update() {
    // this.x += this.dx;
    // this.y += this.dy;
    let reference = this.angle % 90;

    let xGain = cos(reference);
    let yGain = sin(reference);

    this.x += xGain * this.speed;
    this.y += yGain * this.speed;

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
    let part = new Particle(mouseX, mouseY, random(0, 360));
    fireworks.push(part);
  }
}
