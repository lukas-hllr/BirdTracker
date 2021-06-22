const attribution =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const mymap = L.map("BirdTrackerMap").setView([51.163361, 10.447683], 6);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);
var marker;
var layerGroup = L.layerGroup().addTo(mymap); //contains a layergroup of all markers
L.Control.geocoder().addTo(mymap); //location searchbar
var btn = document.getElementById('remove')
//delets only the last marker on mousewheel press
window.addEventListener("auxclick", function (e) {
  mymap.removeLayer(marker);
});

// add's a marker to the map
mymap.on("click", function (e) {
  marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(layerGroup);
  marker.bindPopup(); //no function yet
  marker.on('click', function(e){
      e.target.removeFrom(mymap)
  });
});


