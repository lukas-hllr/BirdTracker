const attribution =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const mymap = L.map("BirdTrackerMap").setView([51.163361, 10.447683], 6);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);
var marker;
var lat; //marker coordinates
var lng; //marker coordinates
var birdSpecies;
var number;
var temp;
var date;
var loc;
var type;
var description;
var houseNumber
var road;
var city;
var town;
var layerGroup = L.layerGroup().addTo(mymap); //contains a layergroup of all markers
L.Control.geocoder({ expand: 'click', defaultMarkGeocode: true }).on('markgeocode', function(e) { 
  mymap.setView(e.geocode.center, 20
    
); }).addTo(mymap); //location searchbar
function onPopupOpen() {
  var tempMarker = this;
  // To remove marker on click of delete
  $(".delete:visible").click(function () {
      mymap.removeLayer(tempMarker);
  });
}

document.querySelector('.close').addEventListener('click', function(){
  document.querySelector('.modal').style.display = 'none';
})

function Save(){
  birdSpecies = document.getElementById('birdSpecies').value;
  number = document.getElementById('number').value;
  temp = document.getElementById('temp').value;
  date = document.getElementById('date').value;
  loc = document.getElementById('loc').value;
  type = document.getElementById('type').value;
  description = document.getElementById('description').value;
  document.querySelector('.modal').style.display = 'none';
  marker = L.marker([lat, lng]).addTo(layerGroup);
  marker.on("popupopen", onPopupOpen);
  if(houseNumber !== undefined && road !== undefined && city !== undefined){
    marker.bindPopup(city + '<br />'+ road + houseNumber + '<br />' + birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete'>Löschen</button>"+ '<br />').openPopup();
  }else if(houseNumber !== undefined && road !== undefined && town !== undefined){
    marker.bindPopup(town + '<br />'+ road +  +houseNumber + '<br />' + birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete'>Löschen</button>"+ '<br />').openPopup();
  }else{
    marker.bindPopup( birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete'>Löschen</button>"+ '<br />').openPopup();
  }

}
mymap.on('click', function (e) {
  lat = e.latlng.lat;
  lng = e.latlng.lng; 
  document.querySelector('.modal').style.display = 'flex';
  $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+ lat +'&lon='+ lng +'', function(data){
    console.log(data.address);
    houseNumber = data.address.house_number;
    road = data.address.road;
    city = data.address.city;
    town = data.address.town;
});
});


  

