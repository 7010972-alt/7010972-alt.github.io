// Interactive Scene
// Bertin
// Febuary 25, 2026
//
// Extra for Experts:
// I used local storage to save the users data onto their browser
let mapSizeY;
let mapSizeX;

//stats
let startOriginGrowSize = 100;
let startGrowSize = 4;
let startMoveAmount = 4;
let startAllRadius = 20;

//stats
let prestige = 0;
let wins = 10;
let originGrowSize = 100;
let originUPGAmount = 1;
let growSize = 4;
let growUPGAmount = 5;
let growUPGRatio = 0.25;
let moveAmount = 4;
let speedUPGAmount = 2;
let speedUPGRatio = 0.25;
let radiusUPGAmount = 5;

//game variables
let border = 6;
let maxDrift = 1;
let minDrift = -1;
let allRadius = 20;

//button and text spacing
let buttonSeperation = 30;
let buttonSpaceBase = 165;
let buttonXSpace = 15;
let textSeperation = 25;
let textSpaceBase = 25;

//circle variables
let prestigeSize = 2;
let radiusVariety = 8;
let goldRarity = 100;
let goldGainMuilti = 50;
let goldSpeedMuilti = 5;

//rectangle setup
let rectX = mapSizeX / 2;
let rectY = mapSizeY / 1.2;
let rectSize = 25;
let rectRangeX1;
let rectRangeY1;
let rectRangeX2;
let rectRangeY2;

//circle setup
circleSpreadCoverage = 300;
circleSpread = 0;
circleAmount = 400;
circlesSetup = [];

function setup() {
  //localStorage.clear()
  if (localStorage.getItem("wins") !== null) {
    wins = Number(localStorage.getItem("wins"));
  }
  if (localStorage.getItem("moveAmount") !== null) {
    moveAmount = Number(localStorage.getItem("moveAmount"));
  }
  if (localStorage.getItem("growSize") !== null) {
    originGrowSize = Number(localStorage.getItem("growSize"));
  }
  if (localStorage.getItem("rectSize") !== null) {
    rectSize = Number(localStorage.getItem("rectSize"));
  }
  if (localStorage.getItem("radius") !== null) {
    allRadius = Number(localStorage.getItem("radius"));
  }
  if (localStorage.getItem("prestige") !== null) {
    prestige = Number(localStorage.getItem("prestige"));
  }

  //create buttons and move game size to screen size
  mapSizeY = displayHeight;
  mapSizeX = displayWidth;
  createCanvas(mapSizeX, mapSizeY);
  let button1 = createButton("1 Win | UPG Speed");
  button1.position(buttonXSpace, buttonSpaceBase);
  button1.mousePressed(speedUPG);

  let button2 = createButton("1 Win | UPG Grow Size");
  button2.position(buttonXSpace, buttonSpaceBase + buttonSeperation);
  button2.mousePressed(sizeUPG);

  let button5 = createButton("1 Win | UPG Ball Size");
  button5.position(buttonXSpace, buttonSpaceBase + buttonSeperation * 2);
  button5.mousePressed(radiusUPG);

  let button6 = createButton("10 Win | Prestige");
  button6.position(buttonXSpace, buttonSpaceBase + buttonSeperation * 3);
  button6.mousePressed(prestigeUPG);

  let button3 = createButton("SAVE PROGRESS");
  button3.position(buttonXSpace, buttonSpaceBase + buttonSeperation * 4);
  button3.mousePressed(saveProgress);

  let button4 = createButton("CLEAR PROGRESS");
  button4.position(buttonXSpace, buttonSpaceBase + buttonSeperation * 5);
  button4.mousePressed(unSaveProgress);

  rectX = mapSizeX / 2 - rectSize / 2;
  rectY = mapSizeY / 1.2 - rectSize / 2;

  //adds:
  //0.circle Number
  //1.CircleX
  //2.CircleY
  //3.Left X Range
  //4.Right X Range
  //5.Top Y Range
  //6.Bottom Y Range
  //7.DriftX
  //8.DriftY
  //9.Radius

  circleSpreadCoverage = mapSizeX / 2.5;

  originUPGAmount = originGrowSize * growUPGRatio;
  growSize = originGrowSize / circleAmount;
  growUPGAmount = growSize * growUPGRatio;

  speedUPGAmount = moveAmount * speedUPGRatio;

  circleSpread = circleSpreadCoverage / circleAmount;

  //sets up the circles
  for (let i = 0; i < circleAmount; i++) {
    append(circlesSetup, [
      i,
      mapSizeX / 2 + (-1) ** i * (circleSpread * i),
      mapSizeY / 2,
      0,
      0,
      0,
      0,
      random(minDrift, maxDrift),
      random(minDrift, maxDrift),
      random(
        allRadius - allRadius / radiusVariety,
        allRadius + allRadius / radiusVariety
      ),
    ]);
  }
}

//moves rectangle and makes sure it does not leave screen
function move() {
  if (keyIsDown(UP_ARROW) === true) {
    if (rectY > 0 + border) {
      rectY -= moveAmount;
    } else {
      for (let Number = 0; Number < circleAmount; Number++) {
        circlesSetup[Number][2] += moveAmount;
      }
    }
  }
  if (keyIsDown(DOWN_ARROW) === true) {
    if (rectY <= mapSizeY - rectSize - border) {
      rectY += moveAmount;
    } else {
      for (let Number = 0; Number < circleAmount; Number++) {
        circlesSetup[Number][2] -= moveAmount;
      }
    }
  }
  if (keyIsDown(LEFT_ARROW) === true) {
    if (rectX > 0 + border) {
      rectX -= moveAmount;
    } else {
      for (let Number = 0; Number < circleAmount; Number++) {
        circlesSetup[Number][1] += moveAmount;
      }
    }
  }
  if (keyIsDown(RIGHT_ARROW) === true) {
    if (rectX <= mapSizeX - rectSize - border) {
      rectX += moveAmount;
    } else {
      for (let Number = 0; Number < circleAmount; Number++) {
        circlesSetup[Number][1] -= moveAmount;
      }
    }
  }
}

//randomly moves the circles in a direction
function circleRandomMove(Number) {
  if (prestige >= 1 && Number % goldRarity === 0) {
    circlesSetup[Number][1] += circlesSetup[Number][7] * goldSpeedMuilti;
    circlesSetup[Number][2] += circlesSetup[Number][8] * goldSpeedMuilti;
  } else {
    circlesSetup[Number][1] += circlesSetup[Number][7];
    circlesSetup[Number][2] += circlesSetup[Number][8];
  }
}

//this checks if ball is eaten
function eat(Number) {
  if (
    rectRangeX1 < circlesSetup[Number][4] &&
    rectRangeX2 > circlesSetup[Number][3]
  ) {
    if (
      rectRangeY1 < circlesSetup[Number][6] &&
      rectRangeY2 > circlesSetup[Number][5]
    ) {
      moveCircle(Number);
    }
  }
}

//moves the position of the ball
function moveCircle(Number) {
  let muilti = 1;
  let shiftmuilt = 1;
  if (prestige >= 1 && Number % goldRarity === 0) {
    rectSize += growSize * goldGainMuilti;
    muilti = goldGainMuilti;
    shiftmuilt = goldGainMuilti;
  } 
  else {
    rectSize += growSize;
  }

  rectX -= growSize * shiftmuilt / 2;
  rectY -= growSize * shiftmuilt / 2;
  circlesSetup[Number][1] = random(0, mapSizeX);
  circlesSetup[Number][2] = random(0, mapSizeY);
  circlesSetup[Number][7] = random(minDrift, maxDrift);
  circlesSetup[Number][8] = random(minDrift, maxDrift);

  //border cutoff
  if (rectY < 0 + border) {
    rectY += (growSize * muilti) / 2;
  }
  if (rectRangeY2 > mapSizeY - border) {
    rectY -= (growSize * muilti) / 2;
  }
  if (rectX < 0 + border) {
    rectX += (growSize * muilti) / 2;
  }
  if (rectRangeX2 > mapSizeX - border) {
    rectX -= (growSize * muilti) / 2;
  }
}

//if the rectangle is moving on the border and gains size, keep it in the screen
function moveBack(Number) {
  if (circlesSetup[Number][1] > mapSizeX + allRadius) {
    circlesSetup[Number][1] = 0 - allRadius;
  } else if (circlesSetup[Number][1] < 0 - allRadius) {
    circlesSetup[Number][1] = mapSizeX + allRadius;
  } else if (circlesSetup[Number][2] > mapSizeY + allRadius) {
    circlesSetup[Number][2] = 0 - allRadius;
  } else if (circlesSetup[Number][2] < 0 - allRadius) {
    circlesSetup[Number][2] = mapSizeY + allRadius;
  }
}

//gives each circle a range that is detectable
function circleSizeSetter(Number) {
  let sizeMuilti = 1;
  if (prestige >= 1 && Number % goldRarity === 0) {
    fill("yellow");
    sizeMuilti = prestigeSize;
  } else {
    fill("green");
  }

  circle(
    circlesSetup[Number][1],
    circlesSetup[Number][2],
    circlesSetup[Number][9] * sizeMuilti
  );

  circlesSetup[Number][3] = circlesSetup[Number][1] - allRadius * sizeMuilti / 2;
  circlesSetup[Number][4] = circlesSetup[Number][1] + allRadius * sizeMuilti / 2;
  circlesSetup[Number][5] = circlesSetup[Number][2] - allRadius * sizeMuilti / 2;
  circlesSetup[Number][6] = circlesSetup[Number][2] + allRadius * sizeMuilti / 2;
}

//gives rectangle detectable range
function rectSizeSetter() {
  rect(rectX, rectY, rectSize);
  rectRangeX1 = rectX;
  rectRangeX2 = rectX + rectSize;
  rectRangeY1 = rectY;
  rectRangeY2 = rectY + rectSize;
}

//resets square size when you get a win
function winCounter() {
  if (rectSize > mapSizeX * 2) {
    erase();
    noErase();
    rectSize = 25;
    wins += 1;
    rectX = mapSizeX / 2;
    rectY = mapSizeY / 1.2;
  }
}
//upgrade speed
function speedUPG() {
  if (wins >= 1) {
    moveAmount += speedUPGAmount;
    wins -= 1;
  }
}

//upgrade size
function sizeUPG() {
  if (wins >= 1) {
    growSize += growUPGAmount;
    originGrowSize += originUPGAmount;
    wins -= 1;
  }
}

//upgrade radius
function radiusUPG() {
  if (wins >= 1) {
    allRadius += radiusUPGAmount;
    wins -= 1;
    for (let Number = 0; Number < circleAmount; Number++) {
      circlesSetup[Number][9] = random(
        allRadius - allRadius / radiusVariety,
        allRadius + allRadius / radiusVariety
      );
    }
  }
}

//prestiges
function prestigeUPG() {
  if (wins >= 10) {
    prestige += 1;
    wins = 0;
    originGrowSize = startOriginGrowSize;
    growSize = originGrowSize / circleAmount;
    allRadius = startAllRadius;
    moveAmount = startMoveAmount;
  }
}

//saves progress to browser
function saveProgress() {
  localStorage.setItem("wins", wins);
  localStorage.setItem("rectSize", rectSize);
  localStorage.setItem("moveAmount", moveAmount);
  localStorage.setItem("growSize", originGrowSize);
  localStorage.setItem("radius", allRadius);
  localStorage.setItem("prestige", prestige);
}

//removes all saved progress
function unSaveProgress() {
  localStorage.clear();
}

//set up texts
function texts() {
  fill("white");
  textSize(15);
  text("Size " + str(round(rectSize)), 10, textSpaceBase);
  text(
    "Grow Amount " + str(round(growSize, 2)),
    10,
    textSpaceBase + textSeperation * 1
  );
  text(
    "Speed " + str(round(moveAmount)),
    10,
    textSpaceBase + textSeperation * 2
  );
  text(
    "Ball Size " + str(round(allRadius)),
    10,
    textSpaceBase + textSeperation * 3
  );
  text("Wins " + str(round(wins)), 10, textSpaceBase + textSeperation * 4);
  text(
    "Prestige " + str(round(prestige)),
    10,
    textSpaceBase + textSeperation * 5
  );
}

function draw() {
  background("black");
  for (let i = 0; i < circleAmount; i++) {
    moveBack(i);

    circleSizeSetter(i);
    fill("rgb(202,48,202)");
    rectSizeSetter(i);
    eat(i);
    circleRandomMove(i);
  }

  fill("black");
  texts();
  winCounter();
  move();
}
