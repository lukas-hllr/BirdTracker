const attribution =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const mymap = L.map("BirdTrackerMap").setView([51.163361, 10.447683], 6);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);
var marker;
var layerGroup = L.layerGroup().addTo(mymap); //contains a layergroup of all markers
L.Control.geocoder().addTo(mymap); //location searchbar

// add's a marker to the map
mymap.on("click", function (e) {
  marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(layerGroup);
  marker.bindPopup("<input type='button' value='Delete' class='marker-delete-button'/>");
  marker.on("popupopen", onPopupOpen);
});

function onPopupOpen() {
  var tempMarker = this;
  // To remove marker on click of delete
  $(".marker-delete-button:visible").click(function () {
      mymap.removeLayer(tempMarker);
  });
}