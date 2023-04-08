// import URL for GeoJSON
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

var myMap = L.map("map").setView([0, 0], 2);

// add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// determine the color for the markers based on depth of the earthquake
function getMarkerColor(depth) {
    if (depth < 10) {
        return '#00ff00'; // green
    } else if (depth < 50) {
        return '#ffff00'; // yellow
    } else if (depth < 100) {
        return '#ffa500'; // orange
    } else {
        return '#ff0000'; // red
    }
}

// define a function to set the marker size based on the earthquake magnitude
function getMarkerSize(magnitude) {
    return magnitude * 1.5;
}

// data promise
d3.json(url).then(function(data){
    // add the data to a layer based on the geoJSON file
    L.geoJSON(data,{
        // create new circle markers for each point
        pointToLayer: function(feature,latlng){
            return L.circleMarker(latlng,{
                radius: getMarkerSize(feature.properties.mag),
                fillColor: getMarkerColor(feature.geometry.coordinates[2]),
                color: `#000`,
                weight: 1,
                opacity: 1
            })
        },
        // bind a popup with additional information about the earthquake
        onEachFeature: function(feature,layer){
            layer.bindPopup("<h3>"+ feature.properties.place + "</h3><hr><p> Magnitude: " + 
            feature.properties.mag + '&nbsp; &nbsp; &nbsp;' + "Depth: " + feature.geometry.coordinates[2] + "</br>" + (new Date (feature.properties.time)));
        }
    }).addTo(myMap);

    // set up legend on the map
    var legend = L.control({position: "bottomright"});
    // create the legend
    legend.onAdd = function(myMap){
        var div = L.DomUtil.create("div","info legend");
        limits = [-10, 10, 30, 50, 70,90];
        labels = [];
        // add the colors and information to an array for the legend    
        for (var i=0; i<limits.length; i++){
            labels.push(
            '<li style=\"background-color:' + getMarkerColor(limits[i] +1) + '"></li>' +
            " " + limits[i] + (limits[i+1]? '&ndash;' + limits[i+1] + '<br>' : '+'));
        }
        // push all the labels to the innerHTML of the legend
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // add legend to map
    legend.addTo(myMap);
});




