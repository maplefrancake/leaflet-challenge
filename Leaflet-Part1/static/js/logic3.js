const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"

d3.json(url).then(function (data) {
    console.log(data.features)
    createFeatures(data.features);
})

function createFeatures(earthquakeList){
    var earthquakeCircles = [];
    // loop through all features listed in JSON
    for (i=0; i < earthquakeList.length; i++){
        var coordinates = earthquakeList[i].geometry.coordinates;
        var lat = coordinates[1];
        var lon = coordinates[0];
        var depth = coordinates[2];

        mag = earthquakeList[i].properties.mag;
        place = earthquakeList[i].properties.place;
        time = earthquakeList[i].properties.time;

        earthquakeCircles.push(
            L.circle([lat,lon], {
                radius: circleSize(mag),
                color: depthColor(depth),
                fillcolor: depthColor(depth),
                fillOpacity: 0.5
            })
        )
    }
    earthquakeLayer = L.layerGroup(earthquakeCircles);
    createEarthquakeMap(earthquakeLayer);
};

function circleSize(mag) {
    return (mag*30000);
};

function depthColor(depth) {
    var color="";
    switch (true) {
        case (depth > -10 && depth <= 10):
            color = "lawngreen";
            break;
        case (depth > 10 && depth <=30):
            color = "greenyellow";
            break;
        case (depth > 30 && depth <= 50):
            color = "gold";
            break;
        case (depth > 50 && depth <=70):
            color="goldenrod";
            break;
        case (depth > 70 && depth <= 90):
            color = "orangered";
            break;
        case (depth >90):
            color = "darkred";
            break;
        default: color="black";
    }
    return color;
};

function createEarthquakeMap(earthquakes){
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    /* var earthquakeLayerGroup = L.layerGroup();
    earthquakeLayerGroup.addLayer(earthquakes) */

    var overlayMaps = {
        "Earthquakes": earthquakes
    }

    var myMap = L.map("map", {
        center: [37.77124961153776, -122.48807161368451],
        zoom: 5,
        layers: [street,earthquakes]

    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // LEGEND
    var legend = L.control({position:"bottomright"});
    var div = L.DomUtil.create("div", "legend");
    var legendTitle = ['<strong>Earthquake Depth</strong>']
    var legendText = ["-10 - 10","10 - 30","30 - 50","50 - 70","70 - 90","90+"]
    var legendColors = ["lawngreen","greenyellow","gold","goldenrod","orangered","darkred"]

    legend.onAdd = function (map) {
        
        var x=10,y=10,dx=20,dy=20
        for (i=0; i<legendText.length; i++){
            div.innerHTML += legendTitle.push(`<i style="background-color:${legendColors[i]}"></i>${legendText[i]}`);
            /* legendRects.push(new shape(x,y,dx,dy,legendColors[i],legendText[i]));
            y=y+25;  */
        }
        div.innerHTML = legendTitle.join('<br>');
        return div;
    };
    legend.addTo(myMap);
}