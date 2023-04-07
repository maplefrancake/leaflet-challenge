const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"

var earthquakeCircles = [];

// create the circle markers for each earthquake in the dataset
d3.json(url).then(function (data){
    for (i=0; i < data.features.length; i++) {
        coordinates = data.features[i].geometry.coordinates,
        lat = coordinates[1],
        lon = coordinates[0],
        depth = coordinates[2],
        mag = data.features[i].properties.mag,
        place = data.features[i].properties.place,
        time = data.features[i].properties.time
        size = markerSize(mag);

        earthquakeCircles.push(
            L.circle([lat,lon], {
                radius: size
            })
        )
        /* var earthquakeMarker = L.circle([lat,lon], {
            "radius": size,
            /* color: "red",
            fillColor: "red",
            fillOpacity: 0.75,
            stroke: false 
        })
        earthquakeCircles.push(earthquakeMarker);
        console.log(`earthquakeCircle: ${JSON.stringify(earthquakeCircles[i])}`) */
    }
})

function markerSize(mag){
    return Math.abs(mag*30000);
};

var testLocations = [
    {
        coordinates: [40.7128, -74.0059],
        state: {
            name: "New York State",
        }
    },
    {
        coordinates: [34.0522, -118.2437],
        state: {
            name: "California"
        }
    }
]

var testMarkers=[];
for (var i=0; i<testLocations.length; i++) {
    var lat = testLocations[i]["coordinates"][0]
    var lon = testLocations[i]["coordinates"][1]
    testMarkers.push(
        L.circle([lat,lon], {
            radius: 10000
        })
    )
    console.log(`test: ${JSON.stringify(testMarkers[i])}`)
}

// MAP STUFF

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

console.log(earthquakeCircles)
var earthquakeLayer = L.layerGroup(earthquakeCircles);

console.log(testMarkers)
var testLayer = L.layerGroup(testMarkers);

// Create an overlay object to hold our overlay.
var overlayMaps = {
    Earthquakes: earthquakeLayer,
    "test": testLayer
};

// create the map
var myMap = L.map("map", {
    center: [33,-84],
    zoom: 5,
    layers: [street, testLayer, earthquakeLayer]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

