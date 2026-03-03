// Ball Object Array

let balls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  for (let ball of balls) {
    //move
    ball.x += ball.dx;
    ball.y += ball.dy;
    circle(ball.x, ball.y, ball.radius);
  }
}

function spawnball() {
  let theBall = {
    x: random(width),
    y: random(height),
    dx: random(-5, 5),
    dy: random(-5, 5),
    radius: random(10, 40)
  };
  balls.push(theBall);
}

function mousePressed() {
  spawnball();
}