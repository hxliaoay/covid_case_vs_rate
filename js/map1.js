mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
container: 'map', // container ID
projection: 'albers',
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 4, // starting zoom
center: [-98, 38] // starting center
});

async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-2020-rates.json');
    let covidRates = await response.json();

    map.on('load', function loadingData() {
        map.addSource('covidRates', {
            type: 'geojson',
            data: 'assets/us-covid-2020-rates.json'
        });
        
        map.addLayer({
            'id': 'covidRates-layer',
            'type': 'fill',
            'source': 'covidRates',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FFEDA0',   // stop_output_0
                    34,          // stop_input_0
                    '#FED976',   // stop_output_1
                    53,          // stop_input_1
                    '#FEB24C',   // stop_output_2
                    70,          // stop_input_2
                    '#FD8D3C',   // stop_output_3
                    89,         // stop_input_3
                    '#FC4E2A',   // stop_output_4
                    115,         // stop_input_4
                    '#E31A1C',   // stop_output_5
                    163,         // stop_input_5
                    '#BD0026'
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
        const layers = [
            '0-34',
            '35-53',
            '54-70',
            '71-89',
            '90-115',
            '116-163',
            '164-291'
        ];
        const colors = [
            '#FFEDA070',
            '#FED97670',
            '#FEB24C70',
            '#FD8D3C70',
            '#FC4E2A70',
            '#E31A1C70',
            '#BD002670'
        ];
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Covid Rates<br>(cases per 1,000 people)</b><br><br>";

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;
        
            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });


        map.on('mousemove', ({point}) => {
            const county = map.queryRenderedFeatures(point, {
                layers: ['covidRates-layer']
            });
            document.getElementById('text-description').innerHTML = state.length ?
                `<h3>${county[0].properties.county}</h3><p><strong><em>${county[0].properties.rates}</strong> cases per 1,000 people</em></p>` :
                `<p>Hover over a county!</p>`;
        });
        
    });

 };

geojsonFetch();
