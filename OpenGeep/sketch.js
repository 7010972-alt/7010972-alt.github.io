let maps;

function setup() {
  createCanvas(windowWidth, windowHeight);

  maps = createElement("iframe");
  maps.attribute("src", "https://www.google.ca/maps");
  maps.size(500, 500);
  maps.position(20, 20);

  // optional styling so it's obvious
  maps.style("border", "2px solid black");
}

function draw() {
  background(220);
}