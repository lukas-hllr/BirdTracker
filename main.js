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
var id;
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

// bird.id = 1; // wird von der Datenbank entsprechend zugewiesen
mymap.options.minZoom = 3; // maximaler zoom raus
mymap.options.maxZoom = 18; // maximaler zoom rein


onLoad();

function onPopupOpen() {
  // mymap.removeLayer(marker);
  // sidebar.setContent(
  //   '<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>'
  // );
  console.log("TEST")
  console.log(id);
  postLoeschen();
  // console.log(loeschenbutton)
  // postLoeschen(loeschenbutton, loeschenButtonName);  


}

function postLoeschen(){


// xhr.onload = function () {
// 	var users = JSON.parse(xhr.responseText);
// 	if (xhr.readyState == 4 && xhr.status == "200") {
// 		console.table(users);
// 	} else {
// 		console.error(users);
// 	}
// }
// p.send(null);
  var p = new XMLHttpRequest();
  var url2 = "https://localhost:5001/Birds/" + id 
  console.log("3" +url2);
  p.open("DELETE",url2, true);
  p.onload = function () { 
    //var bird = JSON.parse(p.responseText);
    if (p.readyState == 4 && p.status == "204"){
      console.table("Klappt");
      alert("Vogel erfolgreich geloescht!");
      // mymap.removeLayer(layerGroup)
      onLoad();
    }
    else {
      alert("Löschen nicht erfolgreich");
    }
  }
  p.send(null)

}
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
  bird.Adress = array[1];
  bird.BoxKind = document.getElementById("type").value;
  if(array[2] === undefined && array[3] === undefined){
    bird.City = array[4];
  }
  if(array[2] === undefined && array[4] === undefined){
    bird.City = array[3];
  } 
  if(array[3] === undefined && array[4] === undefined){
    bird.City = array[2];
  }if(array[3] === undefined && array[4] === undefined && array[2] === undefined){
    bird.City = " "
  }
  bird.Compass = document.getElementById("loc").value;
  if (array[0] !== undefined){
    bird.Housenumber = array[0];
  }
  bird.Id = 1                                               //wird von der Datenbank entsprechend zugewiesen
  bird.Latitude = lat;
  bird.Longitude = lng;
  bird.Message = document.getElementById("description").value;
  bird.NestDate = document.getElementById("date").value;
  bird.NumberChicks = document.getElementById("number").value;
  bird.Plz = array[5];
  if (array[0] === undefined){
    bird.Housenumber = array[0];
  }
  bird.Species = document.getElementById("birdSpecies").value;
  bird.Temperature = document.getElementById("temp").value;

  document.querySelector(".modal").style.display = "none";
  L.marker([lat, lng]).addTo(layerGroup);

 // var xml1 = js2xml(bird)
  var xml1 = '<?xml version="1.0" encoding="utf-8"?>\n<Bird xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/BirdTrackerProject">\n' +  js2xml(bird) +'\n</Bird>';
  console.log(xml1)
  
   
  // configure a request
  const url1 = "https://localhost:5001/Birds";
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
  // Reload the current page, without using the cache
  setTimeout (function () {
    console.log("Neu laden")
    onLoad();
  }, 2000)


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
  const url = "https://localhost:5001/Birds"; //falls es nicht klappt mit port 5001 ausprobieren bzw 44357

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
            id = lati[i].children[0].textContent;
            var loeschenButtonName = lati[i].children[1].textContent;
            console.log( "1" + loeschenButtonName );
            console.log( "2 " + id);
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
                "°C<br />" +
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

