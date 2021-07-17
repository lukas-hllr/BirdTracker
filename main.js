const attribution =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const mymap = L.map("BirdTrackerMap").setView([51.163361, 10.447683], 6);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);
var marker;
var lat; //marker coordinates
var lng; //marker coordinates
var Species;
var number;
var temp;
var date;
var village
var loc;
var type;
var description;
var houseNumber;
var Adress;
var city;
var town;
var EasyButton;
var layerGroup = L.layerGroup().addTo(mymap); //contains a layergroup of all markers
var birdArray;
let bird = new Object([]);
bird.id = 1;  // wird von der Datenbank entsprechend zugewiesen

onLoad();

function onPopupOpen() {
  mymap.removeLayer(marker);
  sidebar.setContent(
    '<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>'
  );
}
mymap.options.minZoom = 3; // maximaler zoom raus
mymap.options.maxZoom = 18; // maximaler zoom rein

var sidebar = L.control.sidebar("sidebar", {
  // Position der Sidebar
  position: "left",
});

mymap.addControl(sidebar);

document.querySelector(".closebtn").addEventListener("click", function () {
  //schließt das Fenster
  document.querySelector(".modal").style.display = "none";
});

function Save() {
  var birdArray1 = getAdress()
  console.log(birdArray1)
  // Speicherung der Nutzereingaben
  bird.Species = document.getElementById("birdSpecies").value;
  if(birdArray1[1] === undefined) { 
    bird.Adress = " ";
  } else{
    bird.Adress = birdArray1[1].value;
  }
  bird.Plz =  89473;
  bird.NestDate = document.getElementById("date").value;
  bird.Temperature = document.getElementById("temp").value;
  bird.NumberChicks = document.getElementById("number").value;
  bird.BoxKind = document.getElementById("type").value;
  bird.Compass = document.getElementById("loc").value;
  bird.Longitude = lng;
  bird.Latitude = lat;
  bird.description = document.getElementById("description").value;
  // if(birdArray1[0] === undefined){
  //   bird.houseNumber = " "
  // } else {
    bird.houseNumber = birdArray1[0].value;
  // }
  // if(birdArray1[2] === undefined){
  //   bird.city = " "
  // } else {
    bird.city = birdArray1[2];
  // }
  
  console.log(bird.city)

  document.querySelector(".modal").style.display = "none";
  L.marker([lat, lng]).addTo(layerGroup);
  // console.log(bird)


  var xml1 = '<?xml version="1.0" encoding="utf-8"> \n <bird>\n' +  js2xml(bird) +'\n</bird>';
  console.log(xml1)
}

function getAdress (){
  $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+ lat +'&lon='+ lng +'', function(data){
    console.log(data.address)
    birdArray[0] = data.address.house_number;
    birdArray[1] = data.address.road;
    birdArray[2] = data.address.city;
    birdArray[3] = data.address.town;
    // birdArray[4] = data.address.village;
    console.log(birdArray)
    if(birdArray[0]=== undefined){
      birdArray[0] = " "
    }
    if (birdArray[1] === undefined){
      birdArray[1] = " "
    }
    if(birdArray[2] === undefined && birdArray[3] !== undefined && birdArray[4] === undefined){
      birdArray[2] = birdArray[3]
    }
    else if(birdArray[2] !== undefined && birdArray[3] === undefined && birdArray[4] === undefined){
      birdArray[2] = birdArray[2]
    }
    // else if(birdArray[2] === undefined && birdArray[3] === undefined && birdArray[4] !== undefined){
    //   birdArray[2] = birdArray[4]
    // }
    else{
      birdArray[2] = " "
    }
  })
  return birdArray;
}




  
 
  /*marker.on('click', function(e){                             //setzt den Marker
    marker = e.target;
    bird.lat = e.latlng.lat;
    bird.lng = e.latlng.lng;
    $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+ bird.lat +'&lon='+ bird.lng +'', function(data){
    console.log(data.address);
    houseNumber = data.address.house_number;
    road = data.address.road;
    city = data.address.city;
    town = data.address.town;
    if(houseNumber !== undefined && road !== undefined && city !== undefined){ // schreibt die Daten in die Sidebar
      sidebar.setContent('<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' + '<br />'+ 'Stadt: ' + city + '<br />' + 'Straße: ' + road + ' ' +houseNumber + '<br />' + 'Vogelart: ' + bird.birdSpecies + '<br />' + 'Anzahl: ' + bird.number + '<br />' + 'Temperatur: ' + bird.temp + '<br />' + 'Datum: ' + bird.date + '<br />' + 'Aufhängeort: ' + bird.loc + '<br />' + 'Brutkastenart: ' + bird.type + '<br />' + 'Beschreibung: ' + bird.description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />' + '</div>')
    }else if(houseNumber !== undefined && road !== undefined && town !== undefined){
      sidebar.setContent('<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' + '<br />' + 'Stadt: ' + town + '<br />' + 'Straße: ' + road + ' '+ houseNumber + '<br />' + 'Vogelart: ' + bird.birdSpecies + '<br />' + 'Anzahl: ' + bird.number + '<br />' + 'Temperatur: ' + bird.temp + '<br />' + 'Datum: ' + bird.date + '<br />' + 'Aufhängeort: ' + bird.loc + '<br />' + 'Brutkastenart: ' + bird.type + '<br />' + 'Beschreibung: ' + bird.description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />' + '</div>')
    }else{
      sidebar.setContent('<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' + '<br />' + 'Vogelart: ' + bird.birdSpecies + '<br />' + 'Anzahl: ' + bird.number + '<br />' + 'Temperatur: ' + bird.temp + '<br />' + 'Datum: ' + bird.date + '<br />' + 'Aufhängeort: ' + bird.loc + '<br />' + 'Brutkastenart: ' + bird.type + '<br />' + 'Beschreibung: ' + bird.description + '<br />' + "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>"+ '<br />' + '</div>')
    }
    sidebar.show(); 
    
  });
    
  })*/




mymap.on("click", function (e) {
  // lässt das Eingabefenster erscheinen
  lat = e.latlng.lat;
  lng = e.latlng.lng;
  document.querySelector(".modal").style.display = "flex";
});

EasyButton = L.easyButton("fa-exchange", function () {
  // Sidebar mit Inhalt wird erstellt bzw. initialisiert
  sidebar.toggle();
  sidebar.setContent(
    '<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form></div>'
  );
}).addTo(mymap);

function change() {
  // führt die Suche über die Sidebar durch
  var test = document.getElementsByClassName("sideSuche")[0].value;
  // console.log(test);
  $.get(
    "//nominatim.openstreetmap.org/search?format=json&q=" + test,
    function (data) {
      mymap.setView([data[0].lat, data[0].lon], 18);
    }
  );
}


function onLoad() {
  const Http = new XMLHttpRequest();
  const url = "https://localhost:5001/Birds"; //falls es nicht klappt mit port 5001 ausprobieren bzw 44357

  Http.open("GET", url);
  Http.setRequestHeader("Accept", "application/xml");
  // Http.responseType = 'xml'
  Http.onload = () => {
    const data = Http.responseXML;
    console.log(data);
    var lati = data.getElementsByTagName("Bird");
    birdArray = new Array(lati.length);
    for (var i = 0; i < lati.length; i++) {
      var lon = lati[i].children[9].textContent;
      var lat = lati[i].children[10].textContent;
      marker = L.marker([lat, lon]).addTo(layerGroup);
      marker.on("click", function (e) {
        lat = parseFloat(e.latlng.lat).toFixed(12);
        lng = parseFloat(e.latlng.lng).toFixed(12);
        console.log(lat, lng);
        var lati = data.getElementsByTagName("Bird");
        for (var i = 0; i < lati.length; i++) {
          var lng1 = lati[i].children[9].textContent;
          var lat1 = lati[i].children[10].textContent;
          if (lat === lat1 && lng === lng1) {
            console.log("true");
            console.log(lat1, lng1);
            console.log(lati[i]);
            // schreibt die Daten in die Sidebar
            sidebar.setContent(
              '<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' +
                "<br />" +
                "Stadt: " +
                city +
                "<br />" +
                "Straße: " +
                lati[i].children[2].textContent +
                " " +
                houseNumber +
                "<br />" +
                "Vogelart: " +
                lati[i].children[1].textContent +
                "<br />" +
                "Anzahl: " +
                lati[i].children[6].textContent +
                "<br />" +
                "Temperatur: " +
                lati[i].children[5].textContent +
                "<br />" +
                "Datum: " +
                lati[i].children[4].textContent +
                "<br />" +
                "Aufhängeort: " +
                lati[i].children[8].textContent +
                "<br />" +
                "Brutkastenart: " +
                lati[i].children[7].textContent +
                "<br />" +
                "Beschreibung: " +
                bird.description +
                "<br />" +
                "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>" +
                "<br />" +
                "</div>"
            );
            sidebar.show();
          }
        }
      });
    }
  };
  Http.send();
}
function js2xml(js, wraptag){
  if(js instanceof Object){
    return js2xml(Object.keys(js).map(function(key){return js2xml(js[key], key);}).join('\n'), wraptag);
   }else{return ((wraptag)?'<'+ wraptag+'>' : '' ) + js + ((wraptag)?'</'+ wraptag+'>' : '' );}
}
