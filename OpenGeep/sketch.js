//Making maps on https://map-degen.vercel.app/
//Converting them to coords at https://education.openguessr.com/tools/map-converter

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

//game variables
winStreak = 0;

//map variables
let randomlocation;
let currentLocations = [];
let newlat;
let newlng;

//banner
let bannerHeight = 70
let banner;
let bannerText = "Win Streak: 0"

//drop down country picker
let mapOptions;
let optionsX = 20
let optionsY = 15

let switching = true

function setup() {
  noCanvas();

  console.log(america[0])

  //create top banner
  banner = createDiv(bannerText);
  banner.position(0, 0);
  banner.size(windowWidth, bannerHeight);
  banner.style("background", "rgb(154, 255, 120)");
  banner.style("color", "white");
  banner.style("z-index", "10");

  //center the words in the banner horizontally and vertically
  banner.style("display", "flex");
  banner.style("justify-content", "center");
  banner.style("align-items", "center");

  banner.style("font-size", "50px");
  banner.style("color", "rgb(0, 0, 0)");
  banner.style("font-weight", "bold");

  banner.style("border-bottom", "4px solid black");
  banner.style("box-sizing", "border-box");


  //create drop menu
  mapOptions = createSelect()
  mapOptions.position(optionsX, optionsY);
  mapOptions.style("z-index", "11")
  mapOptions.style("width", "200px");
  mapOptions.style("height", "40px");
  mapOptions.style("font-size", "20px");

  //give countries of each map the country they are in
  for (country of countries) {
    mapOptions.option(country, country)
  }

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
}

function draw() {
  nextmap()
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
      cnt: country
      }
    )
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

function keyPressed() {
  if (keyCode === 32) {
    if (randomlocation.cnt === mapOptions.value()) {
      winStreak += 1
    }
    else {
      winStreak = 0
    }
    banner.html("Win Streak: " + winStreak)
    switching = true
  }
}