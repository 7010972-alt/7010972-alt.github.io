//Arrays and Object Notation Assignment
//Bertin Li
//March 5/26

//Making maps on https://map-degen.vercel.app/
//Converting them to coords at https://education.openguessr.com/tools/map-converter
//I used leaflet maps which somehow had everything I needed like getting corrdinates from where I clicked, and adding markers and many more
//the Leaflet website was incredibly easy to follow aswell https://leafletjs.com/examples.html

let street;
let map;
let mapID;

//ranks and images
let Rank = "coal";
let nextBestSet = 2500;
let nextBestBlitz = 0;
let nextBestNMPZ = 0;
let nextBestBlink = 0;

//rank sields
let shieldSize = 80;
let rankIcon;

let coalS = "coalShield.png";
let bronzeS = "bronzeShield.png";
let silverS = "silverShield.png";
let goldS = "goldShield.png";
let diamondS = "diamondShield.png";
let obsidianS = "obsidianShield.png";
let slimeS = "slimeShield.png";
let interS = "interShield.png";

let currentShield = coalS;

let coalP = "coalPin.png";
let bronzeP = "bronzePin.png";
let silverP = "silverPin.png";
let goldP = "goldPin.png";
let diamondP = "diamondPin.png";
let obsidianP = "obsidianPin.png";
let slimeP = "slimePin.png";
let interP = "interPin.png";

let currentPin = coalP;

// all countries that have street view
let countries = [
  "None",
  "Albania",
  "Andorra",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Bulgaria",
  "Cambodia",
  "Canada",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Czechia",
  "Denmark",
  "Dominican Republic",
  "Ecuador",
  "Estonia",
  "Eswatini",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Guatemala",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kyrgyzstan",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Malta",
  "Mexico",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Namibia",
  "Netherlands",
  "Nepal",
  "New Zealand",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "San Marino",
  "Sao Tome and Principe",
  "Senegal",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Tunisia",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Vietnam",
];

//markers
let answermarker;
let marker;

let answerIcon = L.icon({
  iconUrl: 'green_marker.png',

  iconSize: [30, 40], // size of the icon
  iconAnchor: [15, 39], // point of the icon which will correspond to marker's location
});

//game variables
let mapShowing = true;
let winStreak = 0;
let worldMapSize = 14916862;
let points;

let bestSet = 0;
let bestBlitz = 0;
let bestNMPZ = 0;
let bestBlink = 0;

//map variables
let ultraDis = 50000; 
let superDis = 250000;
let correctDis = 1000000;
let wrongDis = 6000000;
let answerLine;
let answerPadding = 50;
let mapOriginalHeight = 300;
let mapOriginalWidth = 400;
let newHeight = 450;
let newWidth = 600;
let mapBottom = 20;
let mapRight = 75;
let enlarged = false;

let totalDistance;
let endScreen = false;
let clickedPoint;
let lastAnswer;
let randomlocation;
let currentLocations = [];
let newlat;
let newlng;

//banner
let bannerHeight = 70;
let banner;
let bannerText;

let textsize;
let textSizeScreenDividor = 75;

//drop down country picker
let mapOptions;
let opttextsize;
let opttextsizeDivisor = 70;
let optionsX = 20;
let optionsY = 15;
let optxwidth;
let optyheight = bannerHeight / 2;
let optxwidthDivisor = 25;

let switching = true;

//buttons
let confirmButton;
let hideMapButton;
let startSetButton;
let setTypeDropDown;
let showRankButton;

//set variables
let blitzTime = 10;

let setLocations = [];
let setClickedPoints = [];
let setActive = false;
let curretnRoundNumber = 0;
let maxRounds = 5;
let totalSetPoints = 0;
let setMarkers = [];
let setLineColors = [];

let timeRestriction = 60;
let timeLeft;
let nextInterval;
let time = 0;

//black cover
let cover;
let covering = false;

//blink cover
let blink = false;
let blinkTime = 0;
let blinkCountdown;
let blinkMax = 3;
let visibleTime = 1;
let decreaseAmount = 0.1;

//show next rank info
let showingRankInfo = false;
let showRankScreen;

function setup() {
  noCanvas();

  rankIcon = createImg(currentShield, "rank display");
  rankIcon.size(shieldSize, shieldSize);
  rankIcon.style("z-index", "20");

  //leaflet map
  map = L.map("map").setView([0, 0], 1);

  //pasted from leaflet
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  mapID  = select("#map");

  //marker placement
  marker = L.marker([0, 0]).addTo(map);

  //when the map is clicked
  function onMapClick(e) {
    if (endScreen === false) {
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;

      marker.setLatLng([lat, lng]);
      
      clickedPoint = {
        lat: lat,
        lng: lng,
      };
    }
  }

  clickedPoint = {
    lat: 0,
    lng: 0,
  };

  map.on('click', onMapClick);

  //create top banner
  textsize = (windowWidth + windowHeight) / textSizeScreenDividor;

  //load info
  if (localStorage.getItem("BestSet") !== null) {
    bestSet = Number(localStorage.getItem("BestSet"));
  }
  if (localStorage.getItem("BestBlitz") !== null) {
    bestBlitz = Number(localStorage.getItem("BestBlitz"));
  }
  if (localStorage.getItem("BestNMPZ") !== null) {
    bestNMPZ = Number(localStorage.getItem("BestNMPZ"));
  }
  if (localStorage.getItem("BestBlink") !== null) {
    bestBlink = Number(localStorage.getItem("BestBlink"));
  }

  //default text
  bannerText = "Best Set: " + bestSet.toLocaleString();

  banner = createDiv(bannerText);
  banner.style("background", "rgb(154, 255, 120)");
  banner.style("color", "white");
  banner.style("z-index", "20");

  banner.style("display", "flex");
  banner.style("padding-right", "2vw");
  banner.style("justify-content", "flex-end");
  banner.style("align-items", "center");

  banner.style("color", "rgb(0, 0, 0)");
  banner.style("font-weight", "bold");

  banner.style("border-bottom", "4px solid black");
  banner.style("box-sizing", "border-box");

  setupMap();

  //pick random location
  randomlocation = random(currentLocations);
  newlat = randomlocation.lat;
  newlng = randomlocation.lng;

  //add the part that is going to have the street view on it
  street = createElement("iframe");
  street.attribute("allowfullscreen", "");
  street.style("border", "0");
  street.position(0, 0);
  street.size(windowWidth, windowHeight);

  //button to confirm
  confirmButton = createButton("Confirm (Space)");
  confirmButton.size(60, 50);
  confirmButton.style("position", "absolute");
  confirmButton.style("z-index", "14");

  confirmButton.mousePressed(confirmed);

  //button to hide map
  hideMapButton = createButton("Toggle Map");
  hideMapButton.size(60, 50);
  hideMapButton.style("position", "absolute");
  hideMapButton.style("z-index", "12");

  hideMapButton.mousePressed(hideMap);

  //button to start a set
  startSetButton = createButton("Start Set");
  startSetButton.size(80, 30);
  startSetButton.style("position", "absolute");
  startSetButton.style("z-index", "21");

  startSetButton.mousePressed(startSet);

  //dropdown menu to select set type
  setTypeDropDown = createSelect();
  setTypeDropDown.size(80, 20);
  setTypeDropDown.style("z-index", "21");
  setTypeDropDown.option("Normal", "normal");
  setTypeDropDown.option("Blitz", "blitz");
  setTypeDropDown.option("NMPZ", "NMPZ");
  setTypeDropDown.option("Blink", "blink");

  //button to start a set
  showRankButton = createButton("Rank Info");
  showRankButton.size(shieldSize, 20);
  showRankButton.style("position", "absolute");
  showRankButton.style("z-index", "21");

  showRankButton.mousePressed(showRank);


  //create cover
  cover = createDiv();
  cover.style("background", "rgb(0, 0, 0)");
  cover.style("z-index", "-1");

  cover.style("display", "flex");
  cover.style("justify-content", "center");
  cover.style("align-items", "center");
  cover.style("font-weight", "bold");

  cover.style("font-size", "50px");
  cover.style("color", "white");

  //create rank info
  showRankScreen = createDiv();
  showRankScreen.style("background", "rgb(154, 255, 120)");
  showRankScreen.style("z-index", "-1");

  showRankScreen.style("display", "flex");
  showRankScreen.style("justify-content", "center");
  showRankScreen.style("align-items", "center");
  showRankScreen.style("font-weight", "bold");

  showRankScreen.style("font-size", "20px");
  showRankScreen.style("color", "white");

  changeMapSize();

}

function draw() {
  nextmap();
  fixsizes();
  bannerTextChange();
  timeDrain();
  lockDropDown();
  NMPZ();
  covertoggle();
  blinkToggle();
  rankModify();
  changeRankInfo();
}

function changeRankInfo() {
  if (rank === "obsidian") {
    showRankScreen.html("hello");
  }
}

function rankModify() {
  if (bestSet > 22500 && bestBlitz > 21500 && bestNMPZ > 21000 && bestBlink > 20000) {
    rank = "inter";
    currentPin = interP;
    currentShield = interS;

    // nextBestSet = "5000" + "/" + bestSet;
    // nextBestBlitz = "0" + "/" + bestBlink;
    // nextBestNMPZ = "0" + "/" + bestNMPZ;
    // nextBestBlink = "0" + "/" + bestBlink;
  }
  else if (bestSet > 20000 && bestBlitz > 19000 && bestNMPZ > 18000 && bestBlink > 17000) {
    rank = "slime";
    currentPin = slimeP;
    currentShield = slimeS;

    nextBestSet = "22500" + "/" + bestSet;
    nextBestBlitz = "21500" + "/" + bestBlink;
    nextBestNMPZ = "21000" + "/" + bestNMPZ;
    nextBestBlink = "20000" + "/" + bestBlink;
  }
  else if (bestSet > 17500 && bestBlitz > 15000 && bestNMPZ > 12500) {
    rank = "obsidian";
    currentPin = obsidianP;
    currentShield = obsidianS;

    nextBestSet = "20000" + "/" + bestSet;
    nextBestBlitz = "19000" + "/" + bestBlink;
    nextBestNMPZ = "18000" + "/" + bestNMPZ;
    nextBestBlink = "17000" + "/" + bestBlink;
  }
  else if (bestSet > 15000 && bestBlitz > 10000 && bestNMPZ > 7500) {
    rank = "diamond";
    currentPin = diamondP;
    currentShield = diamondS;

    nextBestSet = "17500" + "/" + bestSet;
    nextBestBlitz = "15000" + "/" + bestBlink;
    nextBestNMPZ = "12500" + "/" + bestNMPZ;
    nextBestBlink = "0" + "/" + bestBlink;
  }
  else if (bestSet > 10000 && bestBlitz > 5000) {
    rank = "gold";
    currentPin = goldP;
    currentShield = goldS;

    nextBestSet = "15000" + "/" + bestSet;
    nextBestBlitz = "10000" + "/" + bestBlink;
    nextBestNMPZ = "7500" + "/" + bestNMPZ;
    nextBestBlink = "0" + "/" + bestBlink;
  }
  else if (bestSet > 5000) {
    rank = "silver";
    currentPin = silverP;
    currentShield = silverS;

    nextBestSet = "10000" + "/" + bestSet;
    nextBestBlitz = "5000" + "/" + bestBlink;
    nextBestNMPZ = "0" + "/" + bestNMPZ;
    nextBestBlink = "0" + "/" + bestBlink;
  }
  else if (bestSet > 2500) {
    rank = "bronze";
    currentPin = bronzeP;
    currentShield = bronzeS;

    nextBestSet = "5000" + "/" + bestSet;
    nextBestBlitz = "0" + "/" + bestBlink;
    nextBestNMPZ = "0" + "/" + bestNMPZ;
    nextBestBlink = "0" + "/" + bestBlink;
  }



  markerIcon = L.icon({
    iconUrl: currentPin,

    iconSize: [40, 40],
    iconAnchor: [20, 38],
  });
  marker.setIcon(markerIcon);

  rankIcon.attribute("src", currentShield);
}

function covertoggle() {
  if (covering) {
    cover.style("z-index", "1");
  }
  else {
    cover.style("z-index", "-1");
  }
}

function blinkToggle() {
  if (blink) {
    if (millis() - blinkTime > 100) {
      blinkTime = millis();
      blinkCountdown -= decreaseAmount;

      //show text in 2 decimal places
      cover.html((blinkCountdown - visibleTime + decreaseAmount).toFixed(1));
      if (blinkCountdown < visibleTime) {
        covering = false;
        cover.html("");
        if (blinkCountdown < 0) {
          blink = false;
          covering = true;
        }
      }
    }
  }
}

function windowResized() {
  street.size(windowWidth, windowHeight);
}

function addmap(map, country) {
  for (let location of map) {
    currentLocations.push(
      {
        lat: location[0],
        lng: location[1],
        cnt: country,
      }
    );
  }
}

function lockDropDown() {
  if (setActive) {
    setTypeDropDown.attribute("disabled", "");
  }
  else {
    setTypeDropDown.removeAttribute("disabled");
  }
}

function fixsizes() {
  optxwidth = (windowWidth + windowHeight) / optxwidthDivisor;

  banner.position(0, 0);
  banner.size(windowWidth, bannerHeight);

  cover.size(windowWidth, windowHeight);
  cover.position(0,0);

  textsize = (windowWidth + windowHeight) / textSizeScreenDividor;
  banner.style("font-size", `${textsize}px`);

  confirmButton.position(windowWidth - 67, windowHeight - 250);
  hideMapButton.position(windowWidth - 67, windowHeight - 310);
  startSetButton.position(10, 10);
  setTypeDropDown.position(10, 40);

  rankIcon.position(windowWidth - shieldSize - 10, bannerHeight + 10);
  showRankButton.position(windowWidth - shieldSize - 10, bannerHeight + shieldSize + 5);
  showRankScreen.size(windowWidth / 2, windowHeight / 2);
  showRankScreen.position(windowWidth / 4, windowHeight / 4);
}

//shows the info for rank up
function showRank() {
  if (!showingRankInfo) {
    showRankScreen.style("z-index", "20");
    showingRankInfo = true;
  }
  else {
    showRankScreen.style("z-index", "-1");
    showingRankInfo = false;
  }
}

function bannerTextChange() {
  if (!endScreen) {
    if (setActive) {
      banner.html("Round: " + curretnRoundNumber + "/" + maxRounds + " | Time Left: " + timeLeft);
    }
    else {
      if (setTypeDropDown.value() === "normal") {
        banner.html("Best Set: " + bestSet.toLocaleString());
      }
      else if (setTypeDropDown.value() === "blitz") {
        banner.html("Best Blitz Set: " + bestBlitz.toLocaleString());
      }
      else if (setTypeDropDown.value() === "NMPZ") {
        banner.html("Best NMPZ Set: " + bestNMPZ.toLocaleString());
      }
      else if (setTypeDropDown.value() === "blink") {
        banner.html("Best Blink Set: " + bestBlink.toLocaleString());
      }
    }
  }
}

function timeDrain() {
  if (!endScreen) {
    if (setActive && timeLeft >= 0 && millis() - time > 1000) {
      time = millis();
      timeLeft -= 1;

      console.log(timeLeft);
    }

    //ran out of time
    if (timeLeft < 0) {
      //hide screen after timeout
      covering = true;
      timeLeft = 0;
    }
  }
}

function startSet() {
  if (!setActive) {
    setActive = true;
    curretnRoundNumber = 1;
    mapChange();
  }
}

//space bar
function keyPressed() {
  if (key === " ") {
    confirmed();
  }
}


function hideMap() {
  if (mapShowing === true) {
    mapID.hide();
    mapShowing = false;
  }
  else {
    mapID.show();
    mapShowing = true;
  }
}

function nextmap() {
  if (switching) {
    randomlocation = random(currentLocations);
    newlat = randomlocation.lat;
    newlng = randomlocation.lng;
    
    street.attribute(
      "src",
      `https://www.google.com/maps?q=&layer=c&cbll=${newlat},${newlng}&cbp=11,0,0,0,0&output=svembed`
    );
    switching = false;
  }
}

function setupMap() {
  currentLocations = [];
  for (let country of allCountries) {
    addmap(country[1], country[0]);
  }
}
  
function confirmed() {
  if (mapShowing) {
    if (endScreen === false) {
      covering = false;
      //find meters
      
      let point1 = L.latLng(randomlocation.lat, randomlocation.lng);
      let point2 = L.latLng(clickedPoint.lat, clickedPoint.lng);

      totalDistance = point1.distanceTo(point2);

      afterGuess();
    }
    else if (endScreen === true) {
      endScreen = false;
      answermarker.remove();
      answerLine.remove();
      mapChange();
      map.setView([0, 0], 1);

      //change map size back to original
      enlarged = false;
      mapID.style("bottom", "20px");
      mapID.style("right", "75px");
      mapID.size(mapOriginalWidth, mapOriginalHeight);
      map.invalidateSize();
      map.setView([0, 0], 1);

      for (let item of setMarkers) {
        item.remove();
      }
    }
  }
}


//runs after the player has guessed
function afterGuess() {
  endScreen = true;

  //exponential points
  points = Math.round(5000 * Math.exp(-10 * totalDistance / worldMapSize));

  //set distance text
  let measurement = "m";
  let displayAmount = totalDistance;
  if (totalDistance > 1000) {
    measurement = "km";
    displayAmount = displayAmount / 1000;
  }

  //text after guess
  banner.html("Distance: " + round(displayAmount).toLocaleString() + measurement + " | Points: " + points);

  //if this is during a set
  if (setActive) {
    //add points
    totalSetPoints += points;
    if (curretnRoundNumber < maxRounds) {
      curretnRoundNumber += 1;
      setLocations.push([randomlocation.lat, randomlocation.lng]);
      setClickedPoints.push([clickedPoint.lat, clickedPoint.lng]);

      //save line colors
      let lineCol = "black";
      if (totalDistance <= ultraDis) {
        lineCol = "orange";
      }
      else if (totalDistance <= superDis) {
        lineCol = "purple";
      }
      else if (totalDistance <= correctDis) {
        lineCol = "green";
      }
      else if (totalDistance >= wrongDis) {
        lineCol = "red";
      }

      setLineColors.push(lineCol);
    }
    //end set and reset all variables
    else {
      //show the previous guesses, the idea is that the final guess will be shown normally so all 5 guesses will be shown
      for (i = 0; i < maxRounds - 1; i++) {
        let setAnswerMarker = L.marker([setLocations[i][0], setLocations[i][1]], {icon: answerIcon}).addTo(map);
        let setClickedMarker = L.marker([setClickedPoints[i][0], setClickedPoints[i][1]], {icon: markerIcon}).addTo(map);
        let setAnswerLine = L.polyline([[setLocations[i][0], setLocations[i][1]],[setClickedPoints[i][0], setClickedPoints[i][1]]], {
          color: setLineColors[i],
          opacity: 0.7
        }).addTo(map);

        setMarkers.push(setAnswerMarker);
        setMarkers.push(setClickedMarker);
        setMarkers.push(setAnswerLine);
      }
      
      if (setTypeDropDown.value() === "normal") {
        if (bestSet < totalSetPoints) {
          bestSet = totalSetPoints;
        }
      }
      else if (setTypeDropDown.value() === "blitz") {
        if (bestBlitz < totalSetPoints) {
          bestBlitz = totalSetPoints;
        }
      }
      else if (setTypeDropDown.value() === "NMPZ") {
        if (bestNMPZ < totalSetPoints) {
          bestNMPZ = totalSetPoints;
        }
      }
      else if (setTypeDropDown.value() === "blink") {
        if (bestBlink < totalSetPoints) {
          bestBlink = totalSetPoints;
        }
      }

      banner.html("Distance: " + round(displayAmount).toLocaleString() + measurement + " | Points: " + points + " | Round Overall: " + totalSetPoints);
      setActive = false;
      curretnRoundNumber = 1;
      totalSetPoints = 0;
      setLocations = [];
      setClickedPoints = [];
      setLineColors = [];
    }
  }

  //fill screen with map
  mapID.style("bottom", "0px");
  mapID.style("right", "0px");
  mapID.size(windowWidth, windowHeight - bannerHeight);
  map.invalidateSize();

  answermarker = L.marker([randomlocation.lat, randomlocation.lng], {icon: answerIcon}).addTo(map);

  //set line colors
  let lineCol = "black";
  if (totalDistance <= ultraDis) {
    lineCol = "orange";
  }
  else if (totalDistance <= superDis) {
    lineCol = "purple";
  }
  else if (totalDistance <= correctDis) {
    lineCol = "green";
  }
  else if (totalDistance >= wrongDis) {
    lineCol = "red";
  }

  //show a line from the clicked point to the answer
  answerLine = L.polyline([[randomlocation.lat, randomlocation.lng],[clickedPoint.lat, clickedPoint.lng]], {
    color: lineCol,
    opacity: 0.7
  }).addTo(map);

  adjustAfterGuess();
}

function adjustAfterGuess() {
  //set the bounds to both the points as 2 corners
  let bounds = L.latLngBounds(
    [randomlocation.lat, randomlocation.lng],
    [clickedPoint.lat, clickedPoint.lng]
  );
  

  //leaflit feautre to make the map fit 2 coordinates 
  map.fitBounds(bounds, { padding: [answerPadding, answerPadding] });
}

//stands for No Pan, Move, or Zoom
//also no moving allowed for blink
function NMPZ() {
  if (setActive && (setTypeDropDown.value() === "NMPZ" || setTypeDropDown.value() === "blink")) {
    street.style("pointer-events", "none");
  }
  else {
    street.style("pointer-events", "auto");
  }
}

function changeMapSize() {
  //make sure they are not on phone
  mapID.mouseOver(() => {
    if (windowWidth + windowHeight > 2000 && !enlarged && !endScreen) {
      mapID.size(newWidth, newHeight);
      map.invalidateSize();
      enlarged = true;
    }
  });

  mapID.mouseOut(() => {
    if (windowWidth + windowHeight > 2000 && enlarged && !endScreen) {
      mapID.size(mapOriginalWidth, mapOriginalHeight);
      // mapID.position(
      //   windowWidth - mapRight - mapOriginalWidth,
      //   windowHeight - mapBottom - mapOriginalHeight
      // );
      map.invalidateSize();
      enlarged = false;
    }
  });
}

function mapChange() {
  switching = true;
  saveProgress();
  marker.setLatLng([0, 0]);
  clickedPoint = {
    lat: 0,
    lng: 0,
  };
  if (setActive) {
    timeLeft = timeRestriction + 1;
    if (setTypeDropDown.value() === "blitz") {
      timeLeft = blitzTime + 1;
    }
  }
  if (setActive && setTypeDropDown.value() === "blink") {
    blink = true;

    //have to plus 1 because one second gets removed instantly
    blinkCountdown = blinkMax + visibleTime;
    covering = true;
    cover.html(blinkCountdown);
  }
}

function saveProgress() {
  localStorage.setItem("BestSet", bestSet);
  localStorage.setItem("BestBlitz", bestBlitz);
  localStorage.setItem("BestNMPZ", bestNMPZ);
  localStorage.setItem("BestBlink", bestBlink);
}