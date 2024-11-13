let map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    
    // Function for marker size
    function getRadius(magnitude) {
        return magnitude === 0 ? 1 : magnitude * 4;
    }

    // Function for marker color
    function getColor(depth) {
        return depth > 90 ? '#ea2c2c' :
               depth > 70 ? '#ea822c' :
               depth > 50 ? '#ee9c00' :
               depth > 30 ? '#eecc00' :
               depth > 10 ? '#d4ee00' :
                          '#98ee00';
    }

    // Function for marker style
    function styleInfo(feature) {
        return {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    // Create GeoJSON layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`
                <h3>Location: ${feature.properties.place}</h3>
                <hr>
                <p>Magnitude: ${feature.properties.mag}</p>
                <p>Depth: ${feature.geometry.coordinates[2]} km</p>
            `);
        }
    }).addTo(map);

    // Create legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [-10, 10, 30, 50, 70, 90];
        let colors = ['#98ee00', '#d4ee00', '#eecc00', '#ee9c00', '#ea822c', '#ea2c2c'];

        // Loop through intervals
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += 
                '<i style="background:' + colors[i] + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);
});