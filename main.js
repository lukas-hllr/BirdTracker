const attribution =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const mymap = L.map("BirdTrackerMap").setView([51.163361, 10.447683], 6);

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });

const heatmapTileUrl = "http://localhost:6969/heatmap-server/example.svg";
const heatmapTiles = L.tileLayer(heatmapTileUrl);
heatmapTiles.setZIndex(2);

tiles.addTo(mymap);
heatmapTiles.addTo(mymap);

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
var houseNumber;
var road;
var city;
var town;
var EasyButton;
var layerGroup = L.layerGroup().addTo(mymap); //contains a layergroup of all markers

const birds = [];

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

  birdSpecies = document.getElementById("birdSpecies").value;
  number = document.getElementById("number").value;
  temp = document.getElementById("temp").value;
  date = document.getElementById("date").value;
  loc = document.getElementById("loc").value;
  type = document.getElementById("type").value;
  description = document.getElementById("description").value;
  document.querySelector(".modal").style.display = "none";
  marker = L.marker([lat, lng]);
  marker.addTo(layerGroup);

  var bird = new Bird(document, marker);
  birds.push(bird);

  console.log(getXML(birds));

  marker.on("click", function (e) {
    //setzt den Marker
    marker = e.target;
    console.log(JSON.stringify(e.latlng));
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    console.log(lat, lng);
    $.get(
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
        lat +
        "&lon=" +
        lng +
        "",
      function (data) {
        console.log(data.address);
        houseNumber = data.address.house_number;
        road = data.address.road;
        city = data.address.city;
        town = data.address.town;
        if (
          houseNumber !== undefined &&
          road !== undefined &&
          city !== undefined
        ) {
          // schreibt die Daten in die Sidebar
          sidebar.setContent(
            '<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' +
              "<br />" +
              city +
              "<br />" +
              road +
              " " +
              houseNumber +
              "<br />" +
              birdSpecies +
              "<br />" +
              number +
              "<br />" +
              temp +
              "<br />" +
              date +
              "<br />" +
              loc +
              "<br />" +
              type +
              "<br />" +
              description +
              "<br />" +
              "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>" +
              "<br />" +
              "</div>"
          );
        } else if (
          houseNumber !== undefined &&
          road !== undefined &&
          town !== undefined
        ) {
          sidebar.setContent(
            '<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' +
              "<br />" +
              town +
              "<br />" +
              road +
              " " +
              houseNumber +
              "<br />" +
              birdSpecies +
              "<br />" +
              number +
              "<br />" +
              temp +
              "<br />" +
              date +
              "<br />" +
              loc +
              "<br />" +
              type +
              "<br />" +
              description +
              "<br />" +
              "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>" +
              "<br />" +
              "</div>"
          );
        } else {
          sidebar.setContent(
            '<div class="box"><h2>Suche</h2><form><input class="sideSuche" type="text" name="" placeholder="Adresse..."><input onclick="change()" class="sideSuche" type="button" name="" value="Suche"></form>' +
              "<br />" +
              birdSpecies +
              "<br />" +
              number +
              "<br />" +
              temp +
              "<br />" +
              date +
              "<br />" +
              loc +
              "<br />" +
              type +
              "<br />" +
              description +
              "<br />" +
              "<button type='button' class='delete' onclick='onPopupOpen()'>Löschen</button>" +
              "<br />" +
              "</div>"
          );
        }
        sidebar.show();
      }
    );
  });
}
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

mymap.on("dragend", function onDragEnd() {
  var width = mymap.getBounds().getEast() - mymap.getBounds().getWest();
  var height = mymap.getBounds().getNorth() - mymap.getBounds().getSouth();

  console.log(
    "center:\t" +
      mymap.getCenter() +
      "\nwidth:\t" +
      width +
      "\nheight:\t" +
      height +
      "\nsize:\t" +
      mymap.getSize() +
      "\nNW:\t\t" +
      mymap.getBounds().getNorthWest() +
      "\nSW:\t\t" +
      mymap.getBounds().getSouthEast()
  );
});

function change() {
  // führt die Suche über die Sidebar durch
  var test = document.getElementsByClassName("sideSuche")[0].value;
  console.log(test);
  $.get(
    "//nominatim.openstreetmap.org/search?format=json&q=" + test,
    function (data) {
      mymap.setView([data[0].lat, data[0].lon], 18);
    }
  );
}

class Bird {
  constructor(document, marker) {
    this.birdSpecies = document.getElementById("birdSpecies").value;
    this.number = document.getElementById("number").value;
    this.temp = document.getElementById("temp").value;
    this.date = document.getElementById("date").value;
    this.loc = document.getElementById("loc").value;
    this.type = document.getElementById("type").value;
    this.description = document.getElementById("description").value;
    this.marker = marker;
    this.latLng = marker.getLatLng();
  }
}

function getXML(x) {
  //marker vorher entfernen der macht nur ärger..
  var json = JSON.stringify(x, function (i, val) {
    switch (i) {
      case "marker":
        return undefined;
      default:
        return val;
    }
  });
  //wieder zsm fügen
  var json2 = { arrayOfBirds: [] };
  json2.arrayOfBirds = JSON.parse(json);

  return json2xml(json2, "   ");
}

function json2xml(o, tab) {
  var toXml = function (v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
        for (var i = 0, n = v.length; i < n; i++)
          xml += ind + toXml(v[i], name, ind + "\t") + "\n";
      } else if (typeof v == "object") {
        var hasChild = false;
        xml += ind + "<" + name;
        for (var m in v) {
          if (m.charAt(0) == "@")
            xml += " " + m.substr(1) + '="' + v[m].toString() + '"';
          else hasChild = true;
        }
        xml += hasChild ? ">" : "/>";
        if (hasChild) {
          for (var m in v) {
            if (m == "#text") xml += v[m];
            else if (m == "#cdata") xml += "<![CDATA[" + v[m] + "]]>";
            else if (m.charAt(0) != "@") xml += toXml(v[m], m, ind + "\t");
          }
          xml +=
            (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
        }
      } else {
        xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
      }

      return xml;
    },
    xml = "";
  for (var m in o) {
    xml += toXml(o[m], m, "");
  }
  return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}
