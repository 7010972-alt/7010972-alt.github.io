//Walker 

class Walker {
  constructor(x, y, color) {
    this.color = color;
    this.speed = 4;
    this.size = 2;
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

let walkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  background(200);
}

function draw() {
  for (let walker of walkers) {

    walker.display();
    walker.move();
  }
}

function mousePressed() {
  let r = random(255);
  let g = random(255);
  let b = random(255);


  let someWalker = new Walker(mouseX, mouseY, color(r,g,b));
  walkers.push(someWalker);

}


//only 2 walkers

// let firstWalker;
// let secondWalker;

// function draw() {
//   firstWalker.display();
//   firstWalker.move();

//   secondWalker.display();
//   secondWalker.move();
// }
