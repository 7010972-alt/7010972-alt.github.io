// Generate Art Demo

let theTiles = [];
const THESIZE = 2;


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let y = THESIZE / 2; y < height; y += THESIZE) {
    for (let x = THESIZE / 2; x < width; x += THESIZE) {
      let someTile = spawnTile(x, y, THESIZE);
      theTiles.push(someTile);
    }
  }
}

function draw() {
  background(220);
  for (tile of theTiles) {
    line(tile.x1, tile.y1, tile.x2, tile.y2);
  }
}

function spawnTile(x, y, tileSize) {
  let choice = random(100);
  let tile;
  if (choice < 50) {
    //positive slope
    tile = {
      x1 : x - tileSize / 2,
      y1 : y + tileSize / 2,
      x2 : x + tileSize / 2,
      y2 : y - tileSize / 2,
    };
  }
  else {
    //negative slope
    tile = {
      x1 : x - tileSize / 2,
      y1 : y - tileSize / 2,
      x2 : x + tileSize / 2,
      y2 : y + tileSize / 2,
    };
  }
  return tile;
}