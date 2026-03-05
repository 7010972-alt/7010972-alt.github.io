let street;

// all countries that have street view
let countries = [
  "Albania",
  "Andorra",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Bhutan",
  "Bolivia",
  "Botswana",
  "Brazil",
  "Bulgaria",
  "Cambodia",
  "Canada",
  "Chile",
  "Colombia",
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
  "New Zealand",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
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
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
];

//map variables
let currentLocations = [];
let currentMap = "world";

let newlat;
let newlng;

//banner
let bannerHeight = 70
let banner;

//drop down country picker
let mapOptions;

function setup() {
  noCanvas();

  //create drop menu
  mapOptions = createSelect()
  mapOptions.position(20, 20);
  mapOptions.style("z-index", "11")

  for (country of countries) {
    mapOptions.option(country, country)
  }

  setupMap()

  //fix random
  let randomlocation = random(currentLocations)
  newlat = randomlocation.lat
  newlng = randomlocation.lng


  street = createElement("iframe");
  street.attribute(
    "src",
    `https://www.google.com/maps?q=&layer=c&cbll=${newlat},${newlng}&cbp=11,0,0,0,0&output=svembed`
  );

  street.attribute("allowfullscreen", "");
  street.style("border", "0");
  street.position(0, 0);
  street.size(windowWidth, windowHeight);
}

function draw() {
  
}

function windowResized() {
  street.size(windowWidth, windowHeight);
}

function addmap(map) {
  for (let location of map) {
    currentLocations.push(
      {
      lat: location[0],
      lng: location[1],
      }
    )
  }
}

function setupMap() {
  currentLocations = [];
  if (currentMap === "america") {
    addmap(america)
  }
  else if (currentMap === "world") {
    addmap(world)
  }
}

function keyPressed() {
  if (keyCode === 32) {
    console.log(mapOptions.value());
  }
}

  // //create top banner
  // banner = createDiv("Open G");
  // banner.position(0, 0);
  // banner.size(windowWidth, bannerHeight);
  // banner.style("background", "rgb(154, 255, 120)");
  // banner.style("color", "white");
  // banner.style("z-index", "10");

  // //center the words in the banner horizontally and vertically
  // banner.style("display", "flex");
  // banner.style("justify-content", "center");
  // banner.style("align-items", "center");

  // banner.style("font-size", "50px");
  // banner.style("color", "rgb(0, 0, 0)");
  // banner.style("font-weight", "bold");

  // banner.style("border-bottom", "4px solid black");
  // banner.style("box-sizing", "border-box");