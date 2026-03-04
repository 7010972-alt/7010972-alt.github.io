// Ball Object Array

let balls = [];

let moveSpeed = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  for (let ball of balls) {
    //move
    ball.x += ball.dx;
    ball.y += ball.dy;
    fill(ball.col)
    circle(ball.x, ball.y, ball.radius);
    if (ball.x > width  + ball.radius) {
      ball.x = 0 - ball.radius;
    }
    else if (ball.x < 0 - ball.radius) {
      ball.x = width  + ball.radius;
    }
    else if (ball.y > height + ball.radius) {
      ball.y = 0 - ball.radius;
    }
    else if (ball.y < 0 - ball.radius) {
      ball.y = height + ball.radius;
    }
  }
}

function spawnball(_x, _y) {
  let theBall = {
    x: _x,
    y: _y,
    dx: random(-moveSpeed, moveSpeed),
    dy: random(-moveSpeed, moveSpeed),
    radius: random(10, 40),
    col: color(random(255), random(255), random(255))
  };
  balls.push(theBall);
}

function mousePressed() {
  spawnball(mouseX, mouseY);
}