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
function onPopupOpen() {
      mymap.removeLayer(marker);
      sidebar.setContent('<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>')
}
mymap.options.minZoom = 3; // maximaler zoom raus 
mymap.options.maxZoom = 18; // maximaler zoom rein


var sidebar = L.control.sidebar('sidebar', { // Position der Sidebar
  position: 'left'
});

mymap.addControl(sidebar);


document.querySelector('.closebtn').addEventListener('click', function(){ //schließt das Fenster
  document.querySelector('.modal').style.display = 'none';
})

function Save(){                                                    // Speicherung der Nutzereingaben
  birdSpecies = document.getElementById('birdSpecies').value;
  number = document.getElementById('number').value;
  temp = document.getElementById('temp').value;
  date = document.getElementById('date').value;
  loc = document.getElementById('loc').value;
  type = document.getElementById('type').value;
  description = document.getElementById('description').value;
  document.querySelector('.modal').style.display = 'none';
  marker = L.marker([lat, lng]).addTo(layerGroup);                
  marker.on('click', function(e){                             //setzt den Marker
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
    if(houseNumber !== undefined && road !== undefined && city !== undefined){ // schreibt die Daten in die Sidebar
      sidebar.setContent('<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' + '<br />' + city + '<br />'+ road + ' ' +houseNumber + '<br />' + birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />' + '</div>')
    }else if(houseNumber !== undefined && road !== undefined && town !== undefined){
      sidebar.setContent('<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' + '<br />' + town + '<br />'+ road + ' '+ houseNumber + '<br />' + birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />' + '</div>')
    }else{
      sidebar.setContent('<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' + '<br />' + birdSpecies + '<br />' + number + '<br />' + temp + '<br />' + date + '<br />' + loc + '<br />' + type + '<br />' + description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />' + '</div>')
    }
    sidebar.show(); 
    
});
    
  })
}
mymap.on('click', function (e) { // lässt das Eingabefenster erscheinen
  lat = e.latlng.lat;
  lng = e.latlng.lng; 
  document.querySelector('.modal').style.display = 'flex';
});

EasyButton = L.easyButton('fa-exchange', function(){  // Sidebar mit Inhalt wird erstellt bzw. initialisiert
  sidebar.toggle();
  sidebar.setContent('<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form></div>')
}).addTo(mymap)

function change(){ // führt die Suche über die Sidebar durch
var test = document.getElementsByClassName('sideSuche')[0].value
console.log(test)
$.get('//nominatim.openstreetmap.org/search?format=json&q='+test, function(data){
      mymap.setView([data[0].lat, data[0].lon],18)
    });
}






