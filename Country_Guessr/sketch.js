//Grid Assignment
//I am adding onto my arrays project so you can find most of my grid assignment work near the bottom of my code

//Bertin Li
//March 5/26

//Making maps on https://map-degen.vercel.app/
//Converting them to coords at https://education.openguessr.com/tools/map-converter
//I used leaflet maps which somehow had everything I needed like getting corrdinates from where I clicked, and adding markers and many more
//the Leaflet website was incredibly easy to follow aswell https://leafletjs.com/examples.html



//set up p5 party
let shared;

function preload() {
  partyConnect(
    "wss://demoserver.p5party.org",
    "country_guessr"
  );

  shared = partyLoadShared("shared", {
    transfers: {},

    gameStarted: false,

    normalPlayers: 0,
    normalMap: "none",
    normalGuessed: false,
    normalround: "ongoing",
    normalTimeLeft: -1,
    normalTimeMax: 60,
    normalConfirm: false,
    normalMapChanged: false,
    normalRoundNumber: 0,
    normalPartyEnded: false,
    normalClickedPositions: [],
    normalStarted: false,

    blitzPlayers: 0,


    NMPZPlayers: 0,
    blinkPlayers: 0,

  });
}

let street;
let map;
let mapID;

//let stats
let totalGuesses = 0;
let totalGreen = 0;
let totalPurple = 0;
let totalGold = 0;

//ranks and images
let Rank = "coal";
let nextBestSet = 2500;
let nextBestBlitz = 0;
let nextBestNMPZ = 0;
let nextBestBlink = 0;

//rank sields
let shieldSize = 80;
let rankIcon;

let allPins = "allPins.png";
let allPinsDisplay;

let allShields = "allShields.png";
let allShieldsDisplay;

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

//markers
let answermarker;
let marker;

let answerIcon = L.icon({
  iconUrl: 'green_marker.png',

  iconSize: [30, 40], //size of the icon
  iconAnchor: [15, 39], //point of the icon which will correspond to marker's location
});

//game variables
let viewing = false;
let allowGuess = true;
let timeAfterFirstGuess = 16;
let calcLocation;
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
let currentBannerColor = "rgb(177, 255, 151)"

let bannerGreen = "rgb(112, 255, 64)"
let bannerRed = "rgb(255, 88, 88)"
let bannerPurple = "rgb(192, 83, 255)"
let bannerOrange = "rgb(250, 221, 91)"


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
let joinButton;
let startPartyButton;
let showGridButton;
let showGridDropDown;
let heatMapDropDown;
let heatMapType;
let Labels;
let DataShowButton;
let loadData;
let uploadData;
let dataType;

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
let visibleTime = 0.5;
let decreaseAmount = 0.1;

//show next rank info
let showingRankInfo = false;
let showRankScreen;

//show grid screen
let showGrid = false;
let showGridScreen;

let griddedMap;
let gridMapID;

//data transfer
let dataShow = false;
let dataTransScreen;

let transferCode = "";

//p5 party local variables
let inParty = false;
let currentParty;
let lockedIn = false;

let wasNormalGuessed = false;
let maxPartyRoundNumber = 5;

let displayMarkers = []
let currentMuiltIcon = coalP
let preChangeClickedLength;
let waitingLobby = false;
let lobbyJoined = false;

function setup() {
  noCanvas();

  //add maps to a list
  setupMap();

  //give each party a map
  setPartyMap()

  rankIcon = createImg(currentShield, "rank display");
  rankIcon.size(shieldSize, shieldSize);
  rankIcon.style("z-index", "21");
  rankIcon.style("opacity", "1");

  allPinsDisplay = createImg(allPins, "all the pins");
  allPinsDisplay.style("z-index", "21");
  allPinsDisplay.style("z-index", "-1");
  allPinsDisplay.style("opacity", "0");

  allShieldsDisplay = createImg(allShields, "all the Shields");
  allShieldsDisplay.style("z-index", "21");
  allShieldsDisplay.style("z-index", "-1");
  allShieldsDisplay.style("opacity", "0");

  //leaflet map
  map = L.map("map").setView([0, 0], 1);

  //pasted from leaflet
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  mapID = select("#map");

  //marker placement
  marker = L.marker([0, 0]).addTo(map);

  //when the map is clicked
  function onMapClick(e) {
    if (endScreen === false && !lockedIn) {
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;

      marker.setLatLng([lat, lng]);
      
      clickedPoint = {
        lat: lat,
        lng: lng,
      };
    }
  }

  //gridded map
  griddedMap = L.map("griddedmap").setView([0, 0], 1);

  //pasted from leaflet
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(griddedMap);

  //set points when normal map is clicked
  clickedPoint = {
    lat: 0,
    lng: 0,
  };

  gridMapID = select("#griddedmap");

  gridMapID.hide()

  addGrid();

  map.on('click', onMapClick);

  //create top banner
  textsize = (windowWidth + windowHeight) / textSizeScreenDividor;

  //load info

  //load best sets
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

  //load saved stats
  if (localStorage.getItem("totalguesses") !== null) {
    totalGuesses = Number(localStorage.getItem("totalguesses"));
  }
  if (localStorage.getItem("totalgreen") !== null) {
    totalGreen = Number(localStorage.getItem("totalgreen"));
  }
  if (localStorage.getItem("totalpurple") !== null) {
    totalPurple = Number(localStorage.getItem("totalpurple"));
  }
  if (localStorage.getItem("totalgold") !== null) {
    totalGold = Number(localStorage.getItem("totalgold"));
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

  //button to start a set
  joinButton = createButton("Join Party");
  joinButton.size(80, 30);
  joinButton.style("position", "absolute");
  joinButton.style("z-index", "21");

  joinButton.mousePressed(joinWait);

  //button to start a party
  startPartyButton = createButton("Start Party");
  startPartyButton.size(80, 30);
  startPartyButton.style("position", "absolute");
  startPartyButton.style("z-index", "-1");

  startPartyButton.mousePressed(joiningCheck);

  //dropdown menu to select set type
  setTypeDropDown = createSelect();
  setTypeDropDown.size(160, 20);
  setTypeDropDown.style("z-index", "21");
  setTypeDropDown.option("Normal", "normal");
  setTypeDropDown.option("Blitz", "blitz");
  setTypeDropDown.option("NMPZ", "NMPZ");
  setTypeDropDown.option("Blink", "blink");

  //dropdown menu to select what type of info you want to see
  showGridDropDown = createSelect();
  showGridDropDown.size(80, 30);
  showGridDropDown.style("z-index", "-1");
  showGridDropDown.option("Total", "total");
  showGridDropDown.option("Grid", "grid");

  //dropdown menu to select what type of heat map you want to see
  heatMapDropDown = createSelect();
  heatMapDropDown.size(80, 30);
  heatMapDropDown.style("z-index", "-1");
  heatMapDropDown.option("None", "none");
  heatMapDropDown.option("Correct", "correct");
  heatMapDropDown.option("% Correct", "percent");
  heatMapDropDown.option("Distance", "distance");
  heatMapDropDown.option("Answer", "answer");
  heatMapDropDown.option("Guessed", "guessed");

  heatMapDropDown.changed(findHeatValues);

  //dropdown menu to select what type of heat map you want to see
  heatMapType = createInput();
  heatMapType.size(75, 24);
  heatMapType.style("z-index", "-1");
  heatMapType.value("1");

  heatMapType.changed(findHeatValues);

  //button to upload data to saved data
  uploadData = createButton("Upload");
  uploadData.size(80, 30);
  uploadData.style("position", "absolute");
  uploadData.style("z-index", "-1");

  uploadData.mousePressed(dataUpload);

  //button to start a party
  loadData = createButton("Load");
  loadData.size(80, 30);
  loadData.style("position", "absolute");
  loadData.style("z-index", "-1");

  loadData.mousePressed(dataLoad);

  //used to write the keycode for data trans
  dataType = createInput();
  dataType.size(75, 24);
  dataType.style("z-index", "-1");
  dataType.value("Slimed");

  //create labels
  Labels = createDiv();
  Labels.size(240, 20)
  Labels.style("background", "rgb(154, 255, 120)");
  Labels.style("z-index", "-1");
  Labels.style("opacity", "0");

  Labels.style("display", "flex");
  Labels.style("justify-content", "center");
  Labels.style("align-items", "center");
  Labels.style("font-weight", "bold");

  Labels.style("color", "black");

  //button to start a set
  showRankButton = createButton("Rank Info");
  showRankButton.size(shieldSize, 20);
  showRankButton.style("position", "absolute");
  showRankButton.style("z-index", "21");

  showRankButton.mousePressed(showRank);

  //button to who the grid screen a set
  showGridButton = createButton("Stats");
  showGridButton.size(shieldSize, 20);
  showGridButton.style("position", "absolute");
  showGridButton.style("z-index", "21");

  showGridButton.mousePressed(displayGrid);

  //button to open the datat transfer screen
  DataShowButton = createButton("Data Ex.");
  DataShowButton.size(shieldSize, 20);
  DataShowButton.style("position", "absolute");
  DataShowButton.style("z-index", "21");

  DataShowButton.mousePressed(ShowDataScreen);


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
  showRankScreen.style("opacity", "0");

  showRankScreen.style("justify-content", "left");
  showRankScreen.style("align-items", "center");
  showRankScreen.style("font-weight", "bold");

  showRankScreen.style("color", "black");
  showRankScreen.style("border-radius", "12px");
  showRankScreen.style("border", "4px solid black");

  //create grid info
  showGridScreen = createDiv();
  showGridScreen.style("background", "rgb(154, 255, 120)");
  showGridScreen.style("z-index", "-1");
  showGridScreen.style("opacity", "0");

  showGridScreen.style("justify-content", "left");
  showGridScreen.style("align-items", "center");
  showGridScreen.style("font-weight", "bold");

  showGridScreen.style("color", "black");
  showGridScreen.style("border-radius", "12px");
  showGridScreen.style("border", "4px solid black");

  //create grid info
  dataTransScreen = createDiv();
  dataTransScreen.style("background", "rgb(154, 255, 120)");
  dataTransScreen.style("z-index", "-1");
  dataTransScreen.style("opacity", "0");

  dataTransScreen.style("display", "flex");
  dataTransScreen.style("justify-content", "center");
  dataTransScreen.style("align-items", "flex-start");
  dataTransScreen.style("font-weight", "bold");

  dataTransScreen.style("text-align", "center");
  dataTransScreen.style("color", "black");
  dataTransScreen.style("border-radius", "12px");
  dataTransScreen.style("border", "4px solid black");

  changeMapSize();
}

function draw() {
  nextmap();
  fixsizes();
  bannerTextChange();
  timeDrain();
  lockStartJoin();
  NMPZ();
  covertoggle();
  blinkToggle();
  rankModify();
  forceConfirm();
  forceLeaveEnd();
  checkPartyEnded();
  partyTimeChange();
  displayOthers();
  togglePartyButton();
  joinParty();
  lockMap();
  bannerColChange();
  gridTextChange();
  labelConfigure();
  showButtonLock();
  dataInfo();
}

function resetGridView() {
  //set the grids view
  griddedMap.setView([0, 0], 2);
  currentgrid = "none"

  //make the highlighted square disappear
  if (selectSquare !== undefined) {
    selectSquare.remove()
  }

  //remove all guesses that had been there before
  for (let item of shownPastGuesses) {
    item.remove()
  }
  shownPastGuesses = [];

}

function dataInfo() {
  dataTransScreen.html(
    "Data Transfer" + "<br>" +
    "<br>" +
    "Move data from 2 different devices or browser (Browser -> Browser)" + "<br>" +
    "!!! The device which uploads the data will be reverted to a new account !!!" + "<br>" +
    "!!! receiving account will have data replaced !!!" + "<br>" +
    "!!! NEVER CLOSE WINDOW DURING PROCESS !!!" + "<br>" +
    "<br>" +
    "1: If you are in the account that has the data, choose a code and type it in" + "<br>" +
    "2: Press UPLOAD and if it worked then your code will appear at the bottom" + "<br>" +
    "3: Go onto the device you want to recieve the data, type in the code and press LOAD" + "<br>" +
    "<br>" +
    "<br>" +
    "<br>" +
    `Code: ${transferCode}`
  )
}

//conditions when some buttons need to be disabled
function showButtonLock() {
  if (viewing) {
    showGridButton.attribute("disabled", "");
    showRankButton.attribute("disabled", "");
    DataShowButton.attribute("disabled", "");
  }
  else if (dataShow) {
    showGridButton.attribute("disabled", "");
    showRankButton.attribute("disabled", "");
  }
  else if (showingRankInfo) {
    showGridButton.attribute("disabled", "");
    DataShowButton.attribute("disabled", "");
  }
  else if (showGrid) {
    showRankButton.attribute("disabled", "");
    DataShowButton.attribute("disabled", "");
  }
  else {
    showGridButton.removeAttribute("disabled");
    showRankButton.removeAttribute("disabled");
    DataShowButton.removeAttribute("disabled");
  }
}

//change what the label says based on situation
function labelConfigure() {
  if (dataShow || showGrid) {
    Labels.style("z-index", "20");
    Labels.style("opacity", "1");

    if (dataShow) {
      Labels.html("> Load < > Upload < > Code <")
    }
    else if (showGrid) {
      Labels.html("> Stats < > Heat Map < > Value <")
    }
  }
  else {
    Labels.style("z-index", "-1");
    Labels.style("opacity", "0");
  }
}

function dataUpload() {
  //stop if the code is empty or if a code already exists
  if (dataType.value() !== "") {
    if (dataType.value().toLowerCase() in shared.transfers) {
      return
    }

  shared.transfers[dataType.value().toLowerCase()] = {
    //best sets
    bestSet: bestSet,
    bestBlitz: bestBlitz,
    bestNMPZ: bestNMPZ,
    bestBlink: bestBlink,

    //global stats
    totalGuesses: totalGuesses,
    totalGreen: totalGreen,
    totalPurple: totalPurple,
    totalGold: totalGold,

    //the map grid
    mapGrid: structuredClone(mapGrid)
  }

  transferCode = dataType.value()
  dataType.value("")

  //reset values
  bestSet = 0
  bestBlitz = 0
  bestNMPZ = 0
  bestBlink = 0

  totalGuesses = 0
  totalGreen = 0
  totalPurple = 0
  totalGold = 0

  resetGridView();
  //reset the grid
  mapGrid = []
  saveProgress()
  localStorage.removeItem("griddedmap")

  addGrid()
  }
}

function dataLoad() {
  //if the code is found then load the data
  if (dataType.value().toLowerCase() in shared.transfers) {

    //load sets
    bestSet = shared.transfers[dataType.value().toLowerCase()].bestSet
    bestBlitz = shared.transfers[dataType.value().toLowerCase()].bestBlitz
    bestNMPZ = shared.transfers[dataType.value().toLowerCase()].bestNMPZ
    bestBlink = shared.transfers[dataType.value().toLowerCase()].bestBlink

    //load total stats
    totalGuesses = shared.transfers[dataType.value().toLowerCase()].totalGuesses
    totalGreen = shared.transfers[dataType.value().toLowerCase()].totalGreen
    totalPurple = shared.transfers[dataType.value().toLowerCase()].totalPurple
    totalGold = shared.transfers[dataType.value().toLowerCase()].totalGold

    //load the map grid
    mapGrid = shared.transfers[dataType.value().toLowerCase()].mapGrid

    delete shared.transfers[dataType.value().toLowerCase()]

    dataType.value("")

    saveProgress()
  }
}

function ShowDataScreen() {
  if (!dataShow) {
    dataTransScreen.style("z-index", "20");
    dataTransScreen.style("opacity", "1");

    uploadData.style("z-index", "20");
    uploadData.style("opacity", "1");

    loadData.style("z-index", "20");
    loadData.style("opacity", "1");

    dataType.style("z-index", "20");
    dataType.style("opacity", "1");

    dataShow = true;
  }
  else {
    dataTransScreen.style("z-index", "-1");
    dataTransScreen.style("opacity", "0");

    uploadData.style("z-index", "-1");
    uploadData.style("opacity", "0");

    loadData.style("z-index", "-1");
    loadData.style("opacity", "0");

    dataType.style("z-index", "-1");
    dataType.style("opacity", "0");

    dataShow = false;
  }
}

function gridTextChange() {
//update the text of each grid and player total stats
if (showGridDropDown.value() === "grid") {
  if (currentgrid && currentgrid !== "none") {

    let displayDis = "none"

    //change the distance to text form
    if (currentgrid.averageDistance >= 1000) {
      displayDis = (round(currentgrid.averageDistance / 1000)).toLocaleString() + "km"
    }
    else if (currentgrid.answerAmount === 0) {
      displayDis = "none"
    }
    else {
      displayDis = round(currentgrid.averageDistance).toLocaleString() + "m"
    }

    showGridScreen.html(
      "Grid Stats" + "<br>" +
      "Been Answer: " + currentgrid.answerAmount + "<br>" +
      "Correct: " + currentgrid.correctAmount + "<br>" +
      "Missed: " + currentgrid.wrongAmount + "<br>" +

      "Guessed: " + currentgrid.guessedAmount + "<br>" +
      "Avg Distance: " + displayDis + "<br>" +
      "Correct %: " + currentgrid.correctPercent
    );
  }
  else {
    showGridScreen.html(
      "No Grid Selected"
    );
  }
}

//show total stats
else {

  //convert to percentages
  let missPercent = round(((totalGuesses - (totalGreen + totalPurple + totalGold)) / totalGuesses) * 100)
  let greenPercent = round((totalGreen / totalGuesses) * 100)
  let purplePercent = round((totalPurple / totalGuesses) * 100)
  let goldPercent = round((totalGold / totalGuesses) * 100)


  showGridScreen.html(
    "Total Stats" + "<br>" +
    "Guesses: " + totalGuesses + "<br>" +
    "Rank: " + rank + "<br>" +
    "1000km +: " + missPercent + "%" + "<br>" +
    "1000km - 250km: " + greenPercent + "%" + "<br>" +
    "250km - 50km: " + purplePercent + "%" + "<br>" +
    "50km - 0km: " + goldPercent + "%"
  );
}
}

//changes the color of the banner based on the conditions
//wil be red when time is running low and matches color of the answer line
function bannerColChange() {
  if (timeLeft > 0 && timeLeft <= timeAfterFirstGuess && !endScreen) {
    banner.style("background", "rgb(206, 29, 29)");
  }
  else if (endScreen) {
    banner.style("background", currentBannerColor);
  }
  else {
    banner.style("background", "rgb(154, 255, 120)");
  }
}

//make sure that the map is open during parties and closed during viewing mode
function lockMap() {
  if (lockedIn || viewing) {
    hideMapButton.attribute("disabled", "");
  }
  else {
    hideMapButton.removeAttribute("disabled");
  }
}

//show and hide the start party button
function togglePartyButton() {
  if (waitingLobby) {
    startPartyButton.style("z-index", "25")
  }
  else {
    startPartyButton.style("z-index", "-1")
  }
}

//display the other players markers in the same party
function displayOthers() {
  if (inParty) {
    if (setTypeDropDown.value() === "normal" && shared.normalround === "over" && preChangeClickedLength !== shared.normalClickedPositions.length) {
      preChangeClickedLength = shared.normalClickedPositions.length;
      for (let info of shared.normalClickedPositions) {

        //calculate distance so that line color can be changed
        let point1 = L.latLng(shared.normalMap.lat, shared.normalMap.lng);
        let point2 = L.latLng(info.lat, info.lng);

        let distance = point1.distanceTo(point2);

        let lineCol = "black";
        if (distance <= ultraDis) {
          lineCol = "orange";
        }
        else if (distance <= superDis) {
          lineCol = "purple";
        }
        else if (distance <= correctDis) {
          lineCol = "green";
        }
        else if (distance >= wrongDis) {
          lineCol = "red";
        }

        currentMuiltIcon = info.Pin

        //used to show the marks of other players
        muiltIcon = L.icon({
          iconUrl: currentMuiltIcon,

          iconSize: [40, 40],
          iconAnchor: [20, 37],
        });

        let muiltMarker = L.marker([info.lat, info.lng], {icon: muiltIcon}).addTo(map);
        let muiltAnswerLine = L.polyline(
          [[info.lat, info.lng], [shared.normalMap.lat, shared.normalMap.lng]],
          {
            color: lineCol,
            opacity: 0.7
          }
        ).addTo(map);

        displayMarkers.push(muiltMarker)
        displayMarkers.push(muiltAnswerLine)

      }
    }
  }
}

//will kick everyone out of a party when all rounds are up and reset local varibales
function checkPartyEnded() {
  if (inParty && currentParty === "normal" && shared.normalPartyEnded && !waitingLobby) {

    //local resets
    currentParty = "none";
    inParty = false;
    waitingLobby = false;
    lobbyJoined = false;
    lockedIn = false;
    endScreen = false;
    covering = false;
    timeLeft = 0;
    preChangeClickedLength = 0;

    for (let item of displayMarkers) {
      item.remove();
    }
    displayMarkers = [];

    //reset map
    mapID.style("bottom", "20px");
    mapID.style("right", "75px");
    mapID.size(mapOriginalWidth, mapOriginalHeight);
    map.invalidateSize();
    map.setView([0, 0], 1);

    marker.setLatLng([0, 0]);
    clickedPoint = { lat: 0, lng: 0 };


    mapChange()
  }
}

// if someone has guessed then change everyone's time
function partyTimeChange() {
  if (inParty) {
    if (setTypeDropDown.value() === "normal" && shared.normalGuessed) {
      if (timeLeft > timeAfterFirstGuess) {
        timeLeft = timeAfterFirstGuess;
        time = millis()
      }
    }
  }
}

//force everyone in party to leave endscreen
function forceLeaveEnd() {
  if (inParty && endScreen) {
    if (setTypeDropDown.value() === "normal" && shared.normalround === "ongoing") {
      confirmed()
    }
  }
}

//forces others in the party to confirm
function forceConfirm() {
  if (setTypeDropDown.value() === "normal" && shared.normalConfirm === true && inParty && !endScreen) {
    confirmed()
  }
}

//at the start will choose a map for each party
function setPartyMap() {
  if (shared.normalMap === "none") {
    shared.normalMap = random(currentLocations);
    shared.normalRoundNumber = 1;
  }
}

//this runs when players first press join party
//will send them to the waiting lobby of the chosen party
function joinWait() {
  if (!inParty) {
    inParty = true;
    waitingLobby = true;
    covering = true;
    if (setTypeDropDown.value() === "normal") {
      shared.normalPartyEnded = true;
      currentParty = "normal";
      shared.normalPlayers += 1;
    }
    else if (setTypeDropDown.value() === "blitz") {
      currentParty = "blitz"
      shared.blitzPlayers += 1
    }
    else if (setTypeDropDown.value() === "NMPZ") {
      currentParty = "NMPZ"
      shared.NMPZPlayers += 1
    }
    else if (setTypeDropDown.value() === "blink") {
      currentParty = "blink"
      shared.blinkPlayers += 1
    }
  }
}

//runs when the start party button is pressed and will lead to all players in the waiting lobby to join
function joiningCheck() {
  if (setTypeDropDown.value() === "normal") {
    shared.normalStarted = true;
  }
  else if (setTypeDropDown.value() === "blitz") {

  }
  else if (setTypeDropDown.value() === "NMPZ") {

  }
  else if (setTypeDropDown.value() === "blink") {

  }
}

//checks if the conditions are met and places the player into a party
function joinParty() {
  if (!lobbyJoined) {
    if (setTypeDropDown.value() === "normal" && shared.normalStarted) {
      
      setPartyMap();
      if (shared.normalPartyEnded) {
        shared.normalPartyEnded = false;
        timeLeft = 0;
      }
      partyChange(shared.normalMap, "normal");

      //goes into all of them
      lobbyJoined = true;
      waitingLobby = false;
      covering = false;
    }
    else if (setTypeDropDown.value() === "blitz") {
      currentParty = "blitz"
      shared.blitzPlayers += 1
    }
    else if (setTypeDropDown.value() === "NMPZ") {
      currentParty = "NMPZ"
      shared.NMPZPlayers += 1
    }
    else if (setTypeDropDown.value() === "blink") {
      currentParty = "blink"
      shared.blinkPlayers += 1
    }
  }
}

//generates a new place for the party street view
function partyChange(place, type) {
  newlat = place.lat;
  newlng = place.lng;
  
  street.attribute(
    "src",
    `https://www.google.com/maps?q=&layer=c&cbll=${newlat},${newlng}&cbp=11,0,0,0,0&output=svembed`
  );

  //add the basic time if it hasn't already been added
  if (type === "normal") {
    timeLeft = shared.normalTimeMax;
  }

  //shared.normalClickedPositions = []
}

//I wanted the player to not be able to join parties or sets or change the dropdown value when they are in either one
function lockStartJoin() {
  if (inParty || setActive || endScreen || viewing) {
    joinButton.attribute("disabled", "");
    startSetButton.attribute("disabled", "");
    setTypeDropDown.attribute("disabled", "");
  }
  else {
    joinButton.removeAttribute("disabled");
    startSetButton.removeAttribute("disabled");
    setTypeDropDown.removeAttribute("disabled");
  }
}


//this changes the ranks based on how the players best scores are
function rankModify() {
  if (bestSet > 22500 && bestBlitz > 21500 && bestNMPZ > 21000 && bestBlink > 20000) {
    rank = "Inter-Dimensional";
    currentPin = interP;
    currentShield = interS;

    nextBestSet = "25000";
    nextBestBlitz = "25000";
    nextBestNMPZ = "25000";
    nextBestBlink = "25000";
  }
  else if (bestSet > 20000 && bestBlitz > 19000 && bestNMPZ > 18000 && bestBlink > 17000) {
    rank = "Slime";
    currentPin = slimeP;
    currentShield = slimeS;

    nextBestSet = "22500";
    nextBestBlitz = "21500";
    nextBestNMPZ = "21000";
    nextBestBlink = "20000";
  }
  else if (bestSet > 17500 && bestBlitz > 15000 && bestNMPZ > 12500) {
    rank = "Obsidian";
    currentPin = obsidianP;
    currentShield = obsidianS;

    nextBestSet = "20000";
    nextBestBlitz = "19000";
    nextBestNMPZ = "18000";
    nextBestBlink = "17000";
  }
  else if (bestSet > 15000 && bestBlitz > 10000 && bestNMPZ > 7500) {
    rank = "Diamond";
    currentPin = diamondP;
    currentShield = diamondS;

    nextBestSet = "17500";
    nextBestBlitz = "15000";
    nextBestNMPZ = "12500";
    nextBestBlink = "0";
  }
  else if (bestSet > 10000 && bestBlitz > 5000) {
    rank = "Gold";
    currentPin = goldP;
    currentShield = goldS;

    nextBestSet = "15000";
    nextBestBlitz = "10000";
    nextBestNMPZ = "7500";
    nextBestBlink = "0";
  }
  else if (bestSet > 5000) {
    rank = "Silver";
    currentPin = silverP;
    currentShield = silverS;

    nextBestSet = "10000";
    nextBestBlitz = "5000";
    nextBestNMPZ = "0";
    nextBestBlink = "0";
  }
  else if (bestSet > 2500) {
    rank = "Bronze";
    currentPin = bronzeP;
    currentShield = bronzeS;

    nextBestSet = "5000";
    nextBestBlitz = "0";
    nextBestNMPZ = "0";
    nextBestBlink = "0";
  }
  else {
    rank = "Coal"

    currentPin = coalP;
    currentShield = coalS;
  }

  //change the color of each line depending on if they met the req
  let normCol = "red";
  let blitzCol = "red";
  let NMPZCol = "red";
  let blinkCol = "red";

  if (bestSet >= nextBestSet) {
    normCol = "green";
  }
  if (bestBlitz >= nextBestBlitz) {
    blitzCol = "green";
  }
  if (bestNMPZ >= nextBestNMPZ) {
    NMPZCol = "green";
  }
  if (bestBlink >= nextBestBlink) {
    blinkCol = "green";
  }

  //change rank info screen so they know the req
  showRankScreen.html(
    `<span style="font-size:${windowWidth / 30}px;">Requirements</span><br>` +
    `<span style="color:black;"></span><br>` +

    `<span style="color:${normCol};">${"Normal: " + bestSet + "/" + nextBestSet}</span><br>` +
    `<span style="color:${blitzCol};">${"Blitz: " + bestBlitz + "/" + nextBestBlitz}</span><br>` +
    `<span style="color:${NMPZCol};">${"NMPZ: " + bestNMPZ + "/" + nextBestNMPZ}</span><br>` +
    `<span style="color:${blinkCol};">${"Blink: " + bestBlink + "/" + nextBestBlink}</span>`
  );


  //used for the skin of you rown icon
  markerIcon = L.icon({
    iconUrl: currentPin,

    iconSize: [40, 40],
    iconAnchor: [20, 37],
  });

  marker.setIcon(markerIcon);

  rankIcon.attribute("src", currentShield);
}

//this is used to hide and how the cover
function covertoggle() {
  if (covering) {
    cover.style("z-index", "1");
  }
  else {
    cover.style("z-index", "-1");
  }
}


//runs a countdown then uncovers for visible time and then covers again
//for the blink gamemode
function blinkToggle() {
  if (blink) {
    if (Date.now() - blinkTime > 100) {
      blinkTime = Date.now();
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

//always make the street view the full size of the screen
function windowResized() {
  street.size(windowWidth, windowHeight);
}


//converts each location into a lat and lng and a country although my game developed to not even use the country part
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
  joinButton.position(90, 10);

  setTypeDropDown.position(10, 40);

  rankIcon.position(10, bannerHeight + 10);

  //change sizes of the rank info in relation to the screensizes
  showRankButton.position(10, bannerHeight + shieldSize + 5);
  showRankScreen.size(windowWidth / 2, windowWidth / 4);
  showRankScreen.position(windowWidth / 4, windowHeight / 2 - windowWidth / 8);
  showRankScreen.style("font-size", windowWidth / 40 + "px");
  showRankScreen.style("padding-left", windowWidth / 40 + "px");
  showRankScreen.style("padding-top", windowWidth / 20 + "px");

  showGridButton.position(10, bannerHeight + shieldSize + 30);
  showGridScreen.size(windowWidth / 1.5, windowWidth / 3.25);
  showGridScreen.position(windowWidth / 6.5, windowHeight / 2.25 - windowWidth / 8);
  showGridScreen.style("font-size", windowWidth / 69 + "px");
  showGridScreen.style("padding-left", windowWidth / 40 + "px");
  showGridScreen.style("padding-top", windowWidth / 60 + "px");
  showGridDropDown.position(175, 30);
  heatMapDropDown.position(255, 30);
  heatMapType.position(335, 30);
  Labels.position(175, 10)

  uploadData.position(255, 30);
  loadData.position(175, 30);
  dataType.position(335, 30);

  let gridMapH = windowWidth / 3.2
  let gridmapW = windowWidth / 2.25

  gridMapID.position(windowWidth / 1.19 - gridmapW, windowHeight / 2.17 - windowWidth / 8)
  gridMapID.size(gridmapW, gridMapH)

  dataTransScreen.size(windowWidth / 1.5, windowWidth / 3.25);
  dataTransScreen.position(windowWidth / 6.5, windowHeight / 2.25 - windowWidth / 8);
  dataTransScreen.style("font-size", windowWidth / 69 + "px");
  dataTransScreen.style("padding-left", windowWidth / 40 + "px");
  dataTransScreen.style("padding-top", windowWidth / 60 + "px");

  DataShowButton.position(10, bannerHeight + shieldSize + 55);

  griddedMap.invalidateSize()

  let showRankPosY = windowHeight / 2 - windowWidth / 8;

  //change the sizes of the rank displays
  allPinsDisplay.position(windowWidth / 1.95, windowHeight / 1.97);
  allPinsDisplay.size(windowWidth / 4, windowWidth / 6);

  allShieldsDisplay.position(windowWidth / 1.95, showRankPosY + windowHeight / 100);
  allShieldsDisplay.size(windowWidth / 4, windowWidth / 6);

  //always have start party button in the middle of the screen
  startPartyButton.position(windowWidth / 2, windowHeight / 2);
   
}

//shows the grids
function displayGrid() {
  if (!showGrid) {
    showGridScreen.style("z-index", "20");
    showGridScreen.style("opacity", "1");
    gridMapID.show()
    showGridDropDown.style("z-index", "21");
    showGridDropDown.style("opacity", "1");
    heatMapDropDown.style("z-index", "21");
    heatMapDropDown.style("opacity", "1");
    heatMapType.style("z-index", "21");
    heatMapType.style("opacity", "1");
    showGrid = true;
  }
  else {
    resetGridView();
    showGridScreen.style("z-index", "-1");
    showGridScreen.style("opacity", "0");
    gridMapID.hide()
    showGridDropDown.style("z-index", "-1");
    showGridDropDown.style("opacity", "0");
    heatMapDropDown.style("z-index", "-1");
    heatMapDropDown.style("opacity", "0");
    heatMapType.style("z-index", "-1");
    heatMapType.style("opacity", "0");
    showGrid = false;
  }
}

//shows the info for rank up
function showRank() {
  if (!showingRankInfo) {
    showRankScreen.style("z-index", "20");
    showRankScreen.style("opacity", "1");

    allPinsDisplay.style("z-index", "21");
    allPinsDisplay.style("opacity", "1");

    allShieldsDisplay.style("z-index", "21");
    allShieldsDisplay.style("opacity", "1");
    showingRankInfo = true;
  }
  else {
    showRankScreen.style("z-index", "-1");
    showRankScreen.style("opacity", "0");

    allPinsDisplay.style("z-index", "-1");
    allPinsDisplay.style("opacity", "0");

    allShieldsDisplay.style("z-index", "-1");
    allShieldsDisplay.style("opacity", "0");

    showingRankInfo = false;
  }
}

function bannerTextChange() {
  if (!endScreen) {
    if (setActive) {
      banner.html("Round: " + curretnRoundNumber + "/" + maxRounds + " | Time Left: " + timeLeft);
    }
    else if (inParty) {
      if (setTypeDropDown.value() === "normal") {
        banner.html("Round: " + shared.normalRoundNumber + "/" + maxPartyRoundNumber + " | Time Left: " + timeLeft);
      }
    }
    else if (viewing) {
      banner.html("Viewing Mode")
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
  if (!endScreen && !waitingLobby) {
    if ((setActive || inParty) && timeLeft >= 0 && Date.now() - time > 1000) {
      time = Date.now();
      timeLeft -= 1;
    }

    //ran out of time
    if (timeLeft < 0) {
      timeLeft = 0;

      //if time ends and you are in a party
      //be forced to confirm the guess and set the state
      if (inParty) {
        if (shared.normalround === "ongoing") {
          shared.normalround = "over"
        }
        confirmed()
      }

      else {
        //hide screen after timeout
        covering = true;
      }
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

    if (!viewing) {
      randomlocation = random(currentLocations);
      newlat = randomlocation.lat;
      newlng = randomlocation.lng;
    }
    
    street.attribute(
      "src",
      `https://www.google.com/maps?q=&layer=c&cbll=${newlat},${newlng}&cbp=11,0,0,0,0&output=svembed`
    );
    switching = false;
  }
}

//put all the maps from the locations script into a table
function setupMap() {
  currentLocations = [];
  for (let country of allCountries) {
    addmap(country[1], country[0]);
  }
}

function confirmed() {
  //exit the viewing mode
  if (viewing) {
    viewing = false;
    mapID.show()
    mapChange()
    return
  }

  if (mapShowing && !waitingLobby) {
    //if you are in a party
    if (inParty) {
      if (!endScreen) {
        //if they are in the normal party
        if (setTypeDropDown.value() === "normal") {
          //if in normal party and round is ongoing
          if (shared.normalround === "ongoing" && timeLeft > 0) {

            //make the marks show for other players when you put in a guess
            if (!lockedIn) {
              shared.normalClickedPositions.push({
                lat: clickedPoint.lat,
                lng: clickedPoint.lng,
                Pin: currentPin,
              });
            }


            lockedIn = true;

            //if someone has guessed then trigger the time limit
            if (shared.normalGuessed === false && timeLeft > timeAfterFirstGuess) {
              shared.normalGuessed = true;

              //reset some variables
              shared.normalMapChanged = false;
              shared.normalConfirm = false;
            }
          }

          //going into the end of a party round
          else {
            //add the clicked location to the liist holding all the players clicked locations
            if (!lockedIn) {
              shared.normalClickedPositions.push({
                lat: clickedPoint.lat,
                lng: clickedPoint.lng,
                Pin: currentPin,
              })
            }

            lockedIn = true
            shared.normalround = "over"

            afterGuess()
          }
        }
      }
      //escape the end screen when inside of a party
      else {
        for (let item of displayMarkers) {
          item.remove()
        }
        preChangeClickedLength = 0;
        shared.normalClickedPositions = [];
        displayMarkers = [];
        
        //variables that reset from only 1 player
        if (!shared.normalMapChanged) {
          if (currentParty === "normal") {
            shared.normalMapChanged = true;
            shared.normalMap = random(currentLocations);
            shared.normalRoundNumber += 1;
          }
        }

        if (shared.normalround === "over") {
          shared.normalround = "ongoing";
        }

        //make others leave end screen
        shared.normalEndScreenLeave = true;

        //reset all values and end the party round if it was the last round
        if (shared.normalRoundNumber > maxPartyRoundNumber) {
          shared.normalRoundNumber = 1;
          shared.normalStarted = false;
          shared.normalPartyEnded = true;
        }

        //reset values
        shared.normalGuessed = false;
        shared.normalConfirm = false;
        shared.normalround = "ongoing";
        shared.forceConfirm = false;
        lockedIn = false;
        partyChange(shared.normalMap, "normal");

        leaveMap();
      }

    }

    //what normally runs when you are not in a party
    else {
      if (!endScreen) {
        afterGuess();
      }
      else if (endScreen === true && allowGuess) {
        mapChange();
        leaveMap();
      }
    }
  }
}

//makes you leave the endscreen and removes markers also reverts map back
function leaveMap() {

  endScreen = false;
  answermarker.remove();
  answerLine.remove();
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


//runs after the player has guessed
function afterGuess() {

  currentBannerColor = "rgb(177, 255, 151)";

  //make so that they cannot spam rounds
  allowGuess = false;
  setTimeout(() => {
    allowGuess = true;
  }, 1000);


  covering = false;

  //determine location for calculations
  if (!inParty) {
    calcLocation = randomlocation
  }
  else {
    if (setTypeDropDown.value() === "normal") {
      calcLocation = shared.normalMap
    }
  }


  //find meters
  
  let point1 = L.latLng(calcLocation.lat, calcLocation.lng);
  let point2 = L.latLng(clickedPoint.lat, clickedPoint.lng);

  totalDistance = point1.distanceTo(point2);

  //add stats
  totalGuesses += 1

  //determine which color stat to add
    if (totalDistance <= ultraDis) {
      totalGold += 1
    }
    else if (totalDistance <= superDis) {
      totalPurple += 1
    }
    else if (totalDistance <= correctDis) {
      totalGreen += 1
    }


  //add grid stats
  addGridStats(clickedPoint, calcLocation, totalDistance)

  //do the heat calculations
  findHeatValues();

  endScreen = true;

  //exponential points
  //got this equation from geoguessr
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
      setLocations.push([calcLocation.lat, calcLocation.lng]);
      setClickedPoints.push([clickedPoint.lat, clickedPoint.lng]);

      //save line colors
      let lineCol = "black";
      if (totalDistance <= ultraDis) {
        lineCol = "orange";
        currentBannerColor = bannerOrange;
      }
      else if (totalDistance <= superDis) {
        lineCol = "purple";
        currentBannerColor = bannerPurple;
      }
      else if (totalDistance <= correctDis) {
        lineCol = "green";
        currentBannerColor = bannerGreen;
      }
      else if (totalDistance >= wrongDis) {
        lineCol = "red";
        currentBannerColor = bannerRed;
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

  answermarker = L.marker([calcLocation.lat, calcLocation.lng], {icon: answerIcon}).addTo(map);

  //set line colors
  let lineCol = "black";
  if (totalDistance <= ultraDis) {
    lineCol = "orange";
    currentBannerColor = bannerOrange
  }
  else if (totalDistance <= superDis) {
    lineCol = "purple";
    currentBannerColor = bannerPurple
  }
  else if (totalDistance <= correctDis) {
    lineCol = "green";
    currentBannerColor = bannerGreen
  }
  else if (totalDistance >= wrongDis) {
    lineCol = "red";
    currentBannerColor = bannerRed
  }

  //show a line from the clicked point to the answer
  answerLine = L.polyline([[calcLocation.lat, calcLocation.lng],[clickedPoint.lat, clickedPoint.lng]], {
    color: lineCol,
    opacity: 0.7
  }).addTo(map);

  adjustAfterGuess();
}

function adjustAfterGuess() {
  //set the bounds to both the points as 2 corners
  let bounds = L.latLngBounds(
    [calcLocation.lat, calcLocation.lng],
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


//storage
function saveProgress() {
  //set bests
  localStorage.setItem("BestSet", bestSet);
  localStorage.setItem("BestBlitz", bestBlitz);
  localStorage.setItem("BestNMPZ", bestNMPZ);
  localStorage.setItem("BestBlink", bestBlink);

  //stats
  localStorage.setItem("totalguesses", totalGuesses);
  localStorage.setItem("totalgreen", totalGreen);
  localStorage.setItem("totalpurple", totalPurple);
  localStorage.setItem("totalgold", totalGold);
  localStorage.setItem("griddedmap", JSON.stringify(mapGrid));
}


//this is what I am making for my grid assignment
//the basic idea is that the map will be divided into many grids to serve many purposes
// - players can see how much the 2d map is stretched (places like Greenland look massive but are not actually)
// - stats will be saved to each grid showing players their best and worst areas


//grid system for map
const GRID_LENGTH = 15;
let gridOpacity = 0.5;
let gridWeight = 1;
let mapGrid = []
let basicGridInfo = {
  answerAmount: 0,
  correctAmount: 0,
  wrongAmount: 0,

  guessedAmount: 0,
  averageDistance: 0,
  correctPercent: 0,

  pastGuesses: []
}

let currentgrid;

var selectSquare;
let shownPastGuesses = [];

//heat map stats
let greenSquares = [];
let redSquares = [];

function addGrid() {
  //create a new grid if the player does not have one already
  if (localStorage.getItem("griddedmap") === null) {

    //lng
    let rows = 360 / GRID_LENGTH

    //lat
    let cols = 180 / GRID_LENGTH

    for (let c = 0; c < cols; c++) {
      mapGrid.push([])
      for (let r = 0; r < rows; r++) {
        mapGrid[c].push(structuredClone(basicGridInfo))
      }
    }
  }
  else {
    mapGrid = JSON.parse(localStorage.getItem("griddedmap"));
  }

  //create the grid pattern on the map, I mad all values in the for loop positive so it is easier to create the grid
  //latitidue is 180 tall
  for (let lat = 0; lat <= 180; lat += GRID_LENGTH) {
    let gridLine = L.polyline(
      [[lat - 90, -180], [lat - 90, 180]],
      {
        color: "black",
        opacity: gridOpacity,
        weight: gridWeight
      }
    ).addTo(griddedMap);
  }

  //longitude is 360 long
  for (let lng = 0; lng <= 360; lng += GRID_LENGTH) {
    let gridLine = L.polyline(
      [[-90, lng - 180], [90, lng - 180]],
      {
        color: "black",
        opacity: gridOpacity,
        weight: gridWeight
      }
    ).addTo(griddedMap);
  }

  //function to determine the current grid
  function onGridMapClick(e) {
    if (selectSquare !== undefined) {
      selectSquare.remove()
    }

    let lat = e.latlng.lat;
    let lng = e.latlng.lng;

    let currentCol = Math.floor((lat + 90) / GRID_LENGTH)
    let currentRow = Math.floor((lng + 180) / GRID_LENGTH)

    currentgrid = mapGrid[currentCol][currentRow]

    //if the player presses outside of the gridded map
    if (currentgrid === undefined) {
      currentgrid = "none"
    }

    //create a select square
    selectSquare = L.polygon([
    [((currentCol) * GRID_LENGTH) - 90, ((currentRow) * GRID_LENGTH) - 180],
    [((currentCol) * GRID_LENGTH) - 90, ((currentRow + 1) * GRID_LENGTH) - 180],
    [((currentCol + 1) * GRID_LENGTH) - 90, ((currentRow + 1) * GRID_LENGTH) - 180],
    [((currentCol + 1) * GRID_LENGTH) - 90, ((currentRow) * GRID_LENGTH) - 180]
    ], {
      color: "rgb(187, 196, 74)",
      weight: 1,
      opacity: 1,

      fillColor: "yellow",
      fillOpacity: 0.3
    }).addTo(griddedMap);

    //remove all guesses that had been there before
    for (let item of shownPastGuesses) {
      item.remove()
    }
    shownPastGuesses = [];

    //show all guesses that were in that grid
    for (let info of currentgrid.pastGuesses) {
      //create all the parts
      let gridAnswerMark = L.marker([info.answerLat, info.answerLng], {icon: answerIcon}).addTo(griddedMap);
      let gridClickedMark = L.marker([info.clickedLat, info.clickedLng], {icon: markerIcon}).addTo(griddedMap);
      let gridAnswerLine = L.polyline([[info.clickedLat, info.clickedLng],[info.answerLat, info.answerLng]], {
        color: info.lineColor,
        opacity: 0.7
      }).addTo(griddedMap);

      //when clicked show the viewer what that location looked like
      gridAnswerMark.on("click", function () {
        viewing = true;
        resetGridView();

        //hide the map grid page
        showGridScreen.style("z-index", "-1");
        showGridScreen.style("opacity", "0");
        gridMapID.hide()
        showGridDropDown.style("z-index", "-1");
        showGridDropDown.style("opacity", "0");
        heatMapDropDown.style("z-index", "-1");
        heatMapDropDown.style("opacity", "0");
        heatMapType.style("z-index", "-1");
        heatMapType.style("opacity", "0");
        Labels.style("z-index", "-1");
        Labels.style("opacity", "0");
        showGrid = false;

        //make sure the player cannot access map
        mapID.hide()
        hideMapButton.attribute("disabled", "");

        //show the previous location
        newlat = info.answerLat
        newlng = info.answerLng
        switching = true;
      });

      //place all marks in list for later removal
      shownPastGuesses.push(gridAnswerMark)
      shownPastGuesses.push(gridClickedMark)
      shownPastGuesses.push(gridAnswerLine)
    }
  }

  griddedMap.on("click", onGridMapClick);
}

function addGridStats(clicked, answer, totaldis) {

  //find which grid the answer is in
  let ansLat = answer.lat
  let ansLng = answer.lng

  let answerCol = Math.floor((ansLat + 90) / GRID_LENGTH)
  let answerRow = Math.floor((ansLng + 180) / GRID_LENGTH)

  //find whcih grid the guess was in
  let clickLat = clicked.lat
  let clickLng = clicked.lng

  let clickedCol = Math.floor((clickLat + 90) / GRID_LENGTH)
  let clickedRow = Math.floor((clickLng + 180) / GRID_LENGTH)

  //add to the amount of times the answer has been in that grid
  mapGrid[answerCol][answerRow].answerAmount += 1

  //add if the player guessed in the same grid as answer
  if (clickedCol === answerCol && clickedRow === answerRow) {
    mapGrid[answerCol][answerRow].correctAmount += 1
  }
  //add if player gets wrong
  else {
    mapGrid[answerCol][answerRow].wrongAmount += 1
  }

  //add to the amount of times the player has guessed this grid
  mapGrid[clickedCol][clickedRow].guessedAmount += 1

  //find the average distance of all guesses when the answer was this grid
  let guessAmount = mapGrid[answerCol][answerRow].answerAmount
  if (guessAmount === 1) {
    mapGrid[answerCol][answerRow].averageDistance = totaldis
  }
  else {
    mapGrid[answerCol][answerRow].averageDistance = ((guessAmount - 1) * mapGrid[answerCol][answerRow].averageDistance + totaldis) / guessAmount
  }

  //find the percent of getting the grid correct
  mapGrid[answerCol][answerRow].correctPercent = round((mapGrid[answerCol][answerRow].correctAmount / guessAmount) * 100)

  //save the guess to the grid

  //find what color the line will be
  let lineCol = "black";
  if (totaldis <= ultraDis) {
    lineCol = "orange";
  }
  else if (totaldis <= superDis) {
    lineCol = "purple";
  }
  else if (totaldis <= correctDis) {
    lineCol = "green";
  }
  else if (totaldis >= wrongDis) {
    lineCol = "red";
  }

  mapGrid[answerCol][answerRow].pastGuesses.push({
    clickedLat: clickLat,
    clickedLng: clickLng,
    answerLat: ansLat,
    answerLng: ansLng,
    lineColor: lineCol
  })

}

//get values for the heat map
function findHeatValues() {
  //remove all squares and reset the array
  for (let item of greenSquares) {
    item.remove()
  }
  greenSquares = []

  for (let item of redSquares) {
    item.remove()
  }
  redSquares = []
  
  if (heatMapType.value() !== "") {

    //only run if the typed in value contains a number
    if (!Number.isNaN(Number(heatMapType.value()))) {
      //go through each grid
      for (let col = 0; col < mapGrid.length;  col++) {
        for (let row = 0; row < mapGrid[col].length; row++) {
          let checkGrid = mapGrid[col][row]

          //if the "correct" heat map is selected
          if (heatMapDropDown.value() === "correct") {
            //make green squares if the pass req
            if (checkGrid.answerAmount !== 0 && checkGrid.correctAmount >= heatMapType.value()) {
              addGreen(col, row)
            }

            //this is for creating red squares
            if (checkGrid.answerAmount !== 0 && checkGrid.correctAmount < heatMapType.value()) {
              addRed(col, row)
            }
          }

          //if the "answer" heat map is selected
          if (heatMapDropDown.value() === "answer") {
            //make green squares if the pass req
            if (checkGrid.answerAmount !== 0 && checkGrid.answerAmount >= heatMapType.value()) {
              addGreen(col, row)
            }

            //this is for creating red squares
            if (checkGrid.answerAmount !== 0 && checkGrid.answerAmount < heatMapType.value()) {
              addRed(col, row)
            }
          }

          //if the "guessed" heat map is selected
          if (heatMapDropDown.value() === "guessed") {
            //make green squares if the pass req
            if (checkGrid.guessedAmount >= heatMapType.value()) {
              addGreen(col, row)
            }

            //this is for creating red squares
            if (checkGrid.guessedAmount < heatMapType.value()) {
              addRed(col, row)
            }
          }

          //if the "percent" heat map is selected
          if (heatMapDropDown.value() === "percent") {
            //make green squares if the pass req
            if (checkGrid.answerAmount !== 0 && (checkGrid.correctAmount / checkGrid.answerAmount) * 100 >= heatMapType.value()) {
              addGreen(col, row)
            }

            //this is for creating red squares
            if (checkGrid.answerAmount !== 0 && (checkGrid.correctAmount / checkGrid.answerAmount) * 100 < heatMapType.value()) {
              addRed(col, row)
            }
          }

          //if the "distance" heat map is selected
          //dividing the values by 1000 to simulate km
          if (heatMapDropDown.value() === "distance") {
            //make green squares if the pass req
            if (checkGrid.answerAmount !== 0 && checkGrid.averageDistance / 1000 <= heatMapType.value()) {
              addGreen(col, row)
            }

            //this is for creating red squares
            if (checkGrid.answerAmount !== 0 && checkGrid.averageDistance / 1000 > heatMapType.value()) {
              addRed(col, row)
            }
          }


        }
      }
    }
  }
}

function addGreen(col, row) {
  //add the heat maps
  //create a heat map green square
  rightSquare = L.polygon([
  [((col) * GRID_LENGTH) - 90, ((row) * GRID_LENGTH) - 180],
  [((col) * GRID_LENGTH) - 90, ((row + 1) * GRID_LENGTH) - 180],
  [((col + 1) * GRID_LENGTH) - 90, ((row + 1) * GRID_LENGTH) - 180],
  [((col + 1) * GRID_LENGTH) - 90, ((row) * GRID_LENGTH) - 180]
  ], {
    color: "rgb(54, 202, 98)",
    weight: 1,
    opacity: 1,

    fillColor: "green",
    fillOpacity: 0.3
  }).addTo(griddedMap);

  greenSquares.push(rightSquare)
}

function addRed(col, row) {
  //add the heat maps
  //create a heat map red square
  wrongSquare = L.polygon([
  [((col) * GRID_LENGTH) - 90, ((row) * GRID_LENGTH) - 180],
  [((col) * GRID_LENGTH) - 90, ((row + 1) * GRID_LENGTH) - 180],
  [((col + 1) * GRID_LENGTH) - 90, ((row + 1) * GRID_LENGTH) - 180],
  [((col + 1) * GRID_LENGTH) - 90, ((row) * GRID_LENGTH) - 180]
  ], {
    color: "rgb(255, 131, 131)",
    weight: 1,
    opacity: 1,

    fillColor: "rgb(255, 131, 131)",
    fillOpacity: 0.3
  }).addTo(griddedMap);

  redSquares.push(wrongSquare)
}