mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
container: 'map', // container ID
projection: 'albers',
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 4, // starting zoom
center: [-98, 38] // starting center
});

const grades = [10000, 36000, 116000, 317000, 756000],
colors = ['rgb(240, 249, 232)', 'rgb(186, 228, 188)', 'rgb(123, 204, 196)', `rgb(67, 162, 202)`, `rgb(8, 104, 172)`],
radii = [3, 12, 20, 35, 54];


map.on('load', () => {


map.addSource('counts', {
    type: 'geojson',
    data: 'assets/us-covid-2020-counts.json'
});

map.addLayer({
        'id': 'us-covid-2020-counts-point',
        'type': 'circle',
        'source': 'counts',
        'minzoom': 3.5,
        'paint': {
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [{
                        zoom: 3.5,
                        value: grades[0]
                    }, radii[0]],
                    [{
                        zoom: 3.5,
                        value: grades[1]
                    }, radii[1]],
                    [{
                        zoom: 3.5,
                        value: grades[2]
                    }, radii[2]],
                    [{
                        zoom: 3.5,
                        value: grades[3]
                    }, radii[3]],
                    [{
                        zoom: 3.5,
                        value: grades[4]
                    }, radii[4]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]],
                    [grades[3], colors[3]],
                    [grades[4], colors[4]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    },
    'waterway-label'
);


map.on('click', 'us-covid-2020-counts-point', (event) => {
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>number of cases:</strong> ${event.features[0].properties.cases}`)
        .addTo(map);
});

});


const legend = document.getElementById('legend');

var labels = ['<strong>number of cases</strong>'],
vbreak;
for (var i = 0; i < grades.length; i++) {
vbreak = grades[i];
dot_radii = 2 * radii[i];
labels.push(
    '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
    'px; height: ' +
    dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
    '</span></p>');

}
const source =
'<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';
legend.innerHTML = labels.join('') + source;