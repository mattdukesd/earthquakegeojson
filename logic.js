var LatLon = [];
var faultLatLon = [];
var mag;
var magSize;
var magColor;
var earthquakes = [];
var faultLines = [];

var quakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
var boundariesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

d3.json(quakesUrl, function(data) {

	for (var i = 0; i < data.features.length;i++) {
	    LatLon = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]];
	    mag = data.features[i].properties.mag;

	    if (mag <= 3) {
	      magSize = 20000;
	      magColor = "rgb(0,255,0)";
	    } else if (mag <=4) {
	      magSize = 60000;
	      magColor = "rgb(127,255,0)";
	    } else if (mag <=5) {
	      magSize = 110000;
	      magColor = "rgb(255,255,0)";
	    }else if (mag <= 6) {
	      magSize = 160000;
	      magColor = "rgb(255,127,0)";
	    } else {
	      magSize = 210000;
	      magColor = "rgb(255,0,0)";
	    }

	    earthquakes.push(
	    	L.circle(LatLon, {
	        	stroke: false,
	        	fillOpacity: 0.5,
	        	color: magColor,
	        	fillColor: magColor,
	        	radius: magSize
	      	}).bindPopup("<h2>Epicenter:</h2>" + data.features[i].properties.place +"<h4>Timestamp:</h4>" +timeConvert(data.features[i].properties.time) + "<hr><h4>Magnitude:</h4>"+mag)
	    )

	}


	d3.json(boundariesUrl, function(error, bounds) {

		faultLines = L.geoJson(bounds, {
	    	style: function(feature) {
	      		return {
	        		color: "white",
	        		fillOpacity: 0,
	        		weight: 1.5
	      		};
	    	},
		})

	  	var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
	  	"access_token=pk.eyJ1Ijoiam9zaG5lYWw2MTkiLCJhIjoiY2plNmh3YWZjMDBpNzJxcWt3emhsNmtlMyJ9.LfHfkdb2TgA8ibhxuEsPNQ");

	  	var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
	    "access_token=pk.eyJ1Ijoiam9zaG5lYWw2MTkiLCJhIjoiY2plNmh3YWZjMDBpNzJxcWt3emhsNmtlMyJ9.LfHfkdb2TgA8ibhxuEsPNQ");

	  	var sattelite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?"+
	    "access_token=pk.eyJ1Ijoiam9zaG5lYWw2MTkiLCJhIjoiY2plNmkxdDZyMDBrYTJxcDh3bHp3cTk1cyJ9.R1dkuJ_Jd1KB8YEZmeCNIg");


	  	var earthquakeLayer = L.layerGroup(earthquakes);

	  	var baseMaps = {
	    	"Street Map": streetMap,
	    	"Dark Map": darkmap,
	    	"Sattelite": sattelite
	  	};

	  	var overlayMaps = {
		    "Earthquakes": earthquakeLayer,
		    "Fault Lines": faultLines
	  	};

	  	var myMap = L.map("map", {
	    	center: [37.09, -95.71],
		    zoom: 4,
		    layers: [streetMap, darkmap, sattelite,faultLines]
	  	});

	  	L.control.layers(baseMaps, overlayMaps, {
	    	collapsed: false
	  	}).addTo(myMap);

	  	earthquakeLayer.addTo(myMap);

  	});

});

console.log("Finished");

function timeConvert(input) {
  var utcSeconds = input/1000;
  var d = new Date(0);
  d.setUTCSeconds(utcSeconds);
  return d;
}
