//Arrays and Object Notation Assignment
//Bertin Li
//March 5/26

//Making maps on https://map-degen.vercel.app/
//Converting them to coords at https://education.openguessr.com/tools/map-converter

let street;
let map;

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
var answermarker;
var marker;

//game variables
let mapShowing = true;
let winStreak = 0;
let worldMapSize = 14916862;
let points;

//map variables
let totalDistance;
let endScreen = false
let clickedPoint;
let lastAnswer;
let randomlocation;
let currentLocations = [];
let newlat;
let newlng;

//banner
let bannerHeight = 70
let banner;
let bannerText;

let textsize;
let textSizeScreenDividor = 75

//drop down country picker
let mapOptions;
let opttextsize;
let opttextsizeDivisor = 70
let optionsX = 20
let optionsY = 15
let optxwidth;
let optyheight = bannerHeight / 2
let optxwidthDivisor = 25

let switching = true

//buttons
let confirmButton;
let hideMapButton;

function setup() {
  noCanvas();

  //leaflet map
  map = L.map("map").setView([0, 0], 1);

  //pasted from leaflet
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  //marker placement
  marker = L.marker([0, 0]).addTo(map);
  var popup = L.popup();

  //when the map is clicked
  function onMapClick(e) {
    if (endScreen === false) {
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;

      marker.setLatLng([lat, lng]);
      
      clickedPoint = {
        lat: lat,
        lng: lng,
      }
    }
  }

  clickedPoint = {
    lat: 0,
    lng: 0,
  }

  map.on('click', onMapClick);

  //create top banner
  textsize = (windowWidth + windowHeight) / textSizeScreenDividor

  //load info
  if (localStorage.getItem("Streak") !== null) {
    winStreak = Number(localStorage.getItem("Streak"));
  }
  // if (localStorage.getItem("Points") !== null) {
  //   points = Number(localStorage.getItem("Points"));
  // }

  bannerText = ("Distance: " + "..." + " | Points: " + "...")

  banner = createDiv(bannerText);
  banner.style("background", "rgb(154, 255, 120)");
  banner.style("color", "white");
  banner.style("z-index", "10");

  banner.style("display", "flex");
  banner.style("padding-right", "2vw")
  banner.style("justify-content", "flex-end");
  banner.style("align-items", "center");

  banner.style("color", "rgb(0, 0, 0)");
  banner.style("font-weight", "bold");

  banner.style("border-bottom", "4px solid black");
  banner.style("box-sizing", "border-box");

  setupMap()

  //pick random location
  randomlocation = random(currentLocations)
  newlat = randomlocation.lat
  newlng = randomlocation.lng

  //add the part that is going to have the street view on it
  street = createElement("iframe");
  street.attribute("allowfullscreen", "");
  street.style("border", "0");
  street.position(0, 0);
  street.size(windowWidth, windowHeight);

  //button to confirm
  confirmButton = createButton("Confirm");
  confirmButton.size(60, 50);
  confirmButton.style("position", "absolute");
  confirmButton.style("z-index", "12");

  confirmButton.mousePressed(confirmed);
  confirmButton.touchStarted(confirmed);

  //button to hide map
  hideMapButton = createButton("Confirm");
  hideMapButton.size(60, 50);
  hideMapButton.style("position", "absolute");
  hideMapButton.style("z-index", "12");

  hideMapButton.mousePressed(hideMap);
  hideMapButton.touchStarted(hideMap);
}

function draw() {
  nextmap()
  fixsizes()
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
    )
  }
}

function fixsizes() {
  optxwidth = (windowWidth + windowHeight) / optxwidthDivisor

  banner.position(0, 0);
  banner.size(windowWidth, bannerHeight);

  textsize = (windowWidth + windowHeight) / textSizeScreenDividor
  banner.style("font-size", `${textsize}px`);

  confirmButton.position(windowWidth - 67, windowHeight - 250);
  hideMapButton.position(windowWidth - 67, windowHeight - 310);

}

//space bar
function keyPressed() {
  if (key === " ") {
    confirmed()
  }
}

function confirmed() {
  if (endScreen === false) {
    //find meters
    
    let point1 = L.latLng(randomlocation.lat, randomlocation.lng);
    let point2 = L.latLng(clickedPoint.lat, clickedPoint.lng);

    totalDistance = point1.distanceTo(point2);

    console.log(totalDistance)

    afterGuess()
  }
  else if (endScreen === true) {
    answermarker.remove()
    mapChange()
    endScreen = false
    map.setView([0, 0], 1);
  }
}

function hideMap() {
  if (mapShowing === true) {
    select("#map").hide();
    mapShowing = false;
  }
  else {
    select("#map").show();
    mapShowing = true;
  }
}

function nextmap() {
  if (switching) {
    randomlocation = random(currentLocations)
    newlat = randomlocation.lat
    newlng = randomlocation.lng

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
      addmap(country[1], country[0])
    }
}

function afterGuess() {
  endScreen = true;

  //exponential points
  points = Math.round(5000 * Math.exp(-10 * totalDistance / worldMapSize));

  //set distance text
  let measurement = "m"
  let displayAmount = totalDistance
  if (totalDistance > 1000) {
    measurement = "km"
    displayAmount = displayAmount / 1000
  }
  banner.html("Distance: " + round(displayAmount).toLocaleString() + measurement + " | Points: " + points)

  answermarker = L.marker([randomlocation.lat, randomlocation.lng]).addTo(map);
  adjustAfterGuess()
}

function adjustAfterGuess() {
  //set the bounds to both the points as 2 corners
  let bounds = L.latLngBounds(
    [randomlocation.lat, randomlocation.lng],
    [clickedPoint.lat, clickedPoint.lng]
  );
  

  //leaflit feautre to make the map fit 2 coordinates 
  map.fitBounds(bounds, { padding: [40, 40] });
}

function mapChange() {
  switching = true
  saveProgress()
  marker.setLatLng([0, 0]);
  clickedPoint = {
    lat: 0,
    lng: 0,
  }
  banner.html("Distance: " + "..." + " | Points: " + "...")
}

function saveProgress() {
  //localStorage.setItem("Streak", winStreak);
}