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
var village;
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
var array = new Array(6);
// let xml = new Object([]);
let bird = new Object([]);
bird.id = 1; // wird von der Datenbank entsprechend zugewiesen

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
  // Speicherung der Nutzereingaben

  console.log(array)

  bird.Species = document.getElementById("birdSpecies").value;
  bird.Adress = array[1];
  bird.Plz = array[5];
  bird.NestDate = document.getElementById("date").value;
  bird.Temperature = document.getElementById("temp").value;
  bird.NumberChicks = document.getElementById("number").value;
  bird.BoxKind = document.getElementById("type").value;
  bird.Compass = document.getElementById("loc").value;
  bird.Latitude = lat;
  bird.Longitude = lng;
  bird.NestDate = document.getElementById("date").value;
  bird.NumberChicks = document.getElementById("number").value;
  bird.Plz = birdArray1[5];
  bird.Species = document.getElementById("birdSpecies").value;
  bird.Temperature = document.getElementById("temp").value;
  bird.houseNumber = birdArray1[0]
  bird.Message = document.getElementById("description").value;
  bird.houseNumber = array[0];
  if(array[2] === undefined && array[3] === undefined){
    bird.city = array[4];
  }
  if(array[2] === undefined && array[4] === undefined){
    bird.city = array[3];
  } 
  if(array[3] === undefined && array[4] === undefined){
    bird.city = array[2];
  }if(array[3] === undefined && array[4] === undefined && array[2] === undefined){
    bird.city = " "
  }


  document.querySelector(".modal").style.display = "none";
  L.marker([lat, lng]).addTo(layerGroup);

 // var xml1 = js2xml(bird)
  var xml1 = '<?xml version="1.0" encoding="utf-8"?>\n<Bird xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/BirdTrackerProject">\n' +  js2xml(bird) +'\n</Bird>';
  console.log(xml1)
  
   
  // configure a request
  const url1 = "http://localhost:5000/Birds";
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url1);

  // set headers
  xhr.setRequestHeader("Content-Type", "application/xml");
  xhr.setRequestHeader("Accept", "application/xml");
  // xhr.setRequestHeader(

  // send request
  xhr.send(xml1);

  // listen for `load` event
  xhr.onload = () => {
    console.log(xhr.responseText);
  };
  // // Reload the current page, without using the cache
  // document.location.reload(true);
}

function getAdress() {
  $.get(
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
      lat +
      "&lon=" +
      lng +
      "",
    function (data) {
      array[0] = data.address.house_number;
      array[1] = data.address.road;
      array[2] = data.address.city;
      array[3] = data.address.town;
      array[5] = data.address.postcode;
      array[4] = data.address.village;
    }
  );
}

mymap.on("click", function (e) {
  // lässt das Eingabefenster erscheinen
  lat = e.latlng.lat;
  lng = e.latlng.lng;
  document.querySelector(".modal").style.display = "flex";
  getAdress();
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
  $.get(
    "//nominatim.openstreetmap.org/search?format=json&q=" + test,
    function (data) {
      mymap.setView([data[0].lat, data[0].lon], 18);
    }
  );
}

function onLoad() {
  const Http = new XMLHttpRequest();
  const url = "https://localhost:44357/Birds"; //falls es nicht klappt mit port 5001 ausprobieren bzw 44357

  Http.open("GET", url);
  Http.setRequestHeader("Accept", "application/xml");
  // Http.responseType = 'xml'
  Http.onload = () => {
    const data = Http.responseXML;
    var lati = data.getElementsByTagName("Bird");
    console.log(lati)
    birdArray = new Array(lati.length);
    for (var i = 0; i < lati.length; i++) {
      var lon = lati[i].children[9].textContent;
      var lat = lati[i].children[10].textContent;
      marker = L.marker([lat, lon]).addTo(layerGroup);
      marker.on("click", function (e) {
        console.log(e.target)
        lat = parseFloat(e.latlng.lat).toFixed(12);
        lng = parseFloat(e.latlng.lng).toFixed(12);
        var lati = data.getElementsByTagName("Bird");
        for (var i = 0; i < lati.length; i++) {
          var lng1 = lati[i].children[9].textContent;
          var lat1 = lati[i].children[10].textContent;
          if (lat === lat1 && lng === lng1) {

            // schreibt die Daten in die Sidebar
            sidebar.setContent(
              '<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' +
                "<br />" +
                "Stadt: " +
                lati[i].children[12].textContent +
                "<br />" +
                "Straße: " +
                lati[i].children[2].textContent +
                " " +
                lati[i].children[13].textContent +
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
                lati[i].children[11].textContent +
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
function js2xml(js, wraptag) {
  if (js instanceof Object) {
    return js2xml(
      Object.keys(js)
        .map(function (key) {
          return js2xml(js[key], key);
        })
        .join("\n"),
      wraptag
    );
  } else {
    return (
      (wraptag ? "<" + wraptag + ">" : "") +
      js +
      (wraptag ? "</" + wraptag + ">" : "")
    );
  }
}

//  function Bird (Adress, BoxKind, Compass, Latitude, Longitude, NestDate, NumberChicks, Plz, Species, Temperature, houseNumber, Message, city) {
//     // let Bird = {
//     Adress = Adress,
//       BoxKind : BoxKind,
//       City : city,
//       Compass : Compass,
//       Housenumber : houseNumber,
//       Latitude : Latitude,
//       Longitude : Longitude,
//       Message : Message,
//       NestDate : NestDate,
//       NumberChicks : NumberChicks,
//       Plz : Plz,
//       Species : Species,
//       Temperature : Temperature
//     // }
    
//   }
