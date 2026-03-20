// 2d rect array

const GRID_SIZE = 100;
let rows;
let cols;
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);

  rows = Math.floor(windowHeight / GRID_SIZE);
  cols = Math.floor(windowWidth / GRID_SIZE);

  grid = generateRandomGrid(cols, rows);
}

function draw() {
  background(220);

  displayGrid(cols, rows);
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(Math.round(random(0, 1)));
    }
  }
  return newGrid;
}

function generateEmptyRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(Math.round(0));
    }
  }
  return newGrid;
}

function displayGrid(cols, rows) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill("white");
      }
      else {
        fill("black");
      }
      square(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE);
    }
  }
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(cols, rows);
  }
  else if (key === "e") {
    grid = generateEmptyRandomGrid(cols, rows);
  }
}

function mousePressed() {
  let x = Math.floor(mouseX / GRID_SIZE);
  let y = Math.floor(mouseY / GRID_SIZE);
  let change = [];

  change.push([x,y]);

  change.push([x + 1,y]);
  change.push([x,y + 1]);
  change.push([x,y - 1]);
  change.push([x - 1,y]);

  for (let coord of change) {
    if (coord[0] >= 0 && coord[0] <= cols && coord[1] >= 0 && coord[1] <= rows) {
      if (grid[coord[1]][coord[0]] === 0){
        grid[coord[1]][coord[0]] = 1;
      }
      else {
        grid[coord[1]][coord[0]] = 0;
      }
    }
  }
}
