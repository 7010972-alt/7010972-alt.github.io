// Connected Nodes Demo

let nodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  //draw the lines
  for (let node of nodes) {
    node.update();
    node.connectTo(nodes);
  }
  
  //draw circles overtop of lines
  for (let node of nodes) {
    node.display();
  }

  if (keyIsPressed) {
    placeNode();
  }
}

function mousePressed() {
  placeNode();
}

function placeNode() {
  let somePoint = new MovingPoint(mouseX, mouseY);
  nodes.push(somePoint);
}

class MovingPoint {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.xTime = random(1000);
    this.yTime = random(1000);
    this.color = color(random(255), random(255), random(255));
    this.speed = 5;
    this.deltaTime = 0.05;
    this.reach = 500;
    this.minSize = 15;
    this.maxSize = 50;
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius * 2);
  }

  update() {
    this.move();
    this.wrapAround();
    this.adjustSize();
  }

  adjustSize() {
    let mouseDistance = dist(mouseX, mouseY, this.x, this.y);

    if (mouseDistance < this.reach) {
      let theSize = map(mouseDistance, 0, this.reach, this.maxSize, this.minSize);
      this.radius = theSize;
    }
    else {
      this.radius = 15;
    }
  }

  connectTo(nodesArray) {
    for (let otherNode of nodesArray) {
      if (this !== otherNode) {
        let distanceApart = dist(this.x, this.y, otherNode.x, otherNode.y);
  
        if (distanceApart < this.reach) {
          stroke(this.color);
          line(this.x, this.y, otherNode.x, otherNode.y);
        }
      }
    }
  }

  wrapAround() {
    if (this.x < 0) {
      this.x += windowWidth;
    }
    if (this.x > windowWidth) {
      this.x -= windowWidth;
    }
    if (this.y < 0) {
      this.y += windowHeight;
    }
    if (this.y > windowHeight) {
      this.y -= windowHeight;
    }
  }
  
  move() {
    let dx = noise(this.xTime);
    let dy = noise(this.yTime);
  
    //scale from 0-1
    dx = map(dx, 0, 1, -this.speed, this.speed);
    dy = map(dy, 0, 1, -this.speed, this.speed);
  
    //move point
    this.x += dx;
    this.y += dy;
  
    //move on time axis
    this.xTime += this.deltaTime;
    this.yTime += this.deltaTime;
  }

}