// Image Demo

let RGBChicken;

function preload() {
  RGBChicken = loadImage("RBChicken.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)
}

function draw() {
  background(220);
  image(RGBChicken, mouseX, mouseY, RGBChicken.width, RGBChicken.height);
}
