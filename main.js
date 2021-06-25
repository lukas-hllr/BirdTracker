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
var EasyButton;
var layerGroup = L.layerGroup().addTo(mymap); //contains a layergroup of all markers
var searchbar = L.Control.geocoder({ expand: 'click', defaultMarkGeocode: false }).on('markgeocode', function(e) { 
  mymap.setView(e.geocode.center, 20); }).addTo(mymap) //location searchbar
function onPopupOpen() {
      mymap.removeLayer(marker);
}

var sidebar = L.control.sidebar('sidebar', {
  position: 'left'
});

mymap.addControl(sidebar);


document.querySelector('.closebtn').addEventListener('click', function(){
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
  marker.on('click', function(e){
    marker = e.target;
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    console.log(lat, lng)
    $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+ lat +'&lon='+ lng +'', function(data){
    console.log(data.address);
    houseNumber = data.address.house_number;
    road = data.address.road;
    city = data.address.city;
    town = data.address.town;
    if(houseNumber !== undefined && road !== undefined && city !== undefined){
      sidebar.setContent(city + '<br />'+ road + ' ' +houseNumber + '<br />' + birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />')
    }else if(houseNumber !== undefined && road !== undefined && town !== undefined){
      sidebar.setContent(town + '<br />'+ road + ' '+ houseNumber + '<br />' + birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />')
    }else{
      sidebar.setContent( birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />')
    }
    sidebar.show();
    
});
    
  })
}
mymap.on('click', function (e) {
  lat = e.latlng.lat;
  lng = e.latlng.lng; 
  document.querySelector('.modal').style.display = 'flex';
});

EasyButton = L.easyButton('fa-exchange', function(){
  sidebar.toggle();
}).addTo(mymap)
