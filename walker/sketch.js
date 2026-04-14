//Walker 

class Walker {
  constructor(x, y, color) {
    this.color = color;
    this.speed = 10;
    this.size = 10;
    this.x = x;
    this.y = y;
  }

  display() {
    fill(this.color);
    stroke(this.color);
    circle(this.x, this.y, this.size);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.x += this.speed;
    }

    else if (choice < 50) {
      this.x -= this.speed;
    }

    else if (choice < 75) {
      this.y += this.speed;
    }

    else {
      this.y -= this.speed;
    }
  }
}

let firstWalker;

let secondWalker;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  firstWalker = new Walker(width / 2, height / 2, "red");
  secondWalker = new Walker(width / 4, height / 4, "blue");


}

function draw() {
  firstWalker.display();
  firstWalker.move();

  secondWalker.display();
  secondWalker.move();
}
