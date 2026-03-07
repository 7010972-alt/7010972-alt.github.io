let map;

function setup() {
  createCanvas(windowWidth, windowHeight);

  map = L.map("map").setView([13.2579464, -14.3220717], 3);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  //marker placement
  var marker = L.marker([0, 0]).addTo(map);
  var popup = L.popup();

  function onMapClick(e) {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;

    marker.setLatLng([lat, lng]);
  }

  map.on('click', onMapClick);

}

function draw() {

}
