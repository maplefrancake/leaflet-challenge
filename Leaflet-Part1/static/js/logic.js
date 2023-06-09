const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



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
        
        earthquakeCircles.push(
            L.circle([lat,lon], {
                radius: markerSize(mag)
            })
        )
        console.log(earthquakeCircles[i])
    }
})

function markerSize(mag){
    return (mag*30000);
};



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

var earthquakeLayer = L.layerGroup(earthquakeCircles);

// Create an overlay object to hold our overlay.
var overlayMaps = {
    'Earthquakes': earthquakeLayer
};

// create the map
var myMap = L.map("map", {
    center: [33,-84],
    zoom: 5,
    layers: [street, earthquakeLayer]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

