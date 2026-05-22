// Serpinski triangle

let triPoints = [
  {x: 400, y: 100},
  {x: 400, y: 900},
  {x: 1800, y: 900}
];

let theDepth = 0;
let theColors = ["red", "green", "blue", "yellow", "pink", "lightgreen", "brown"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  serpinski(triPoints, theDepth);
}

function draw() {
}

function mousePressed() {
  if (theDepth <= 6) {
    theDepth += 1;
  }
  else {
    theDepth = 0;
  }

  background(0);
  serpinski(triPoints, theDepth);
}

function serpinski(points, depth) {
  fill(theColors[depth]);
  triangle(
    points[0].x, points[0].y, 
    points[1].x, points[1].y, 
    points[2].x, points[2].y
  );

  //base case
  if (depth > 0) {

    //top triangle

    serpinski([
      points[0],
      midPoint(points[0], points[1]),
      midPoint(points[0], points[2])
    ],
    
    depth - 1
    );

    //bottom right

    serpinski([
      points[2],
      midPoint(points[1], points[2]),
      midPoint(points[0], points[2])
    ],
    
    depth - 1
    );

    //bottom left

    serpinski([
      points[1],
      midPoint(points[1], points[2]),
      midPoint(points[0], points[1])
    ],
    
    depth - 1
    );
  }
}

function midPoint(point1, point2) {
  let midx = (point1.x + point2.x) / 2;
  let midy = (point1.y + point2.y) / 2;
  return {x: midx, y: midy};
}