// initialize basemmap
mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
zoom: 3.3, // starting zoom
center: [-96, 36] // starting center
});

// load data and add as layer
async function geojsonFetch() {
let response = await fetch('assets/us-covid-2020-rates.json');
let covid = await response.json();

map.on('load', function loadingData() {
    map.addSource('covid', {
        type: 'geojson',
        data: covid
    });

    map.addLayer({
        'id': 'covid-layer',
        'type': 'fill',
        'source': 'covid',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                '#FFEDA0',   // stop_output_0
                5,          // stop_input_0
                '#FED976',   // stop_output_1
                10,          // stop_input_1
                '#FEB24C',   // stop_output_2
                20,          // stop_input_2
                '#FD8D3C',   // stop_output_3
                40,         // stop_input_3
                '#FC4E2A',   // stop_output_4
                60,         // stop_input_4
                '#E31A1C',   // stop_output_5
                80,         // stop_input_5
                '#BD0026',   // stop_output_6
                100,        // stop_input_6
                "#800026"    // stop_output_7
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });

    const layers = [
        '0-4',
        '5-10',
        '11-19',
        '20-39',
        '40-59',
        '50-79',
        '80-99',
        '100+'
    ];
    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670',
        '#80002670'
    ];

    // create legend
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Cases per 100,000 Residents</b> (Source:<a href='https://data.census.gov/cedsci/table?g=0100000US%24050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true'>ACS</a>)";


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
});

map.on('mousemove', ({point}) => {
    const county = map.queryRenderedFeatures(point, {
        layers: ['covid-layer']
    });
    document.getElementById('text-escription').innerHTML = county.length ?
        `<h3>${county[0].properties.county}</h3><p><strong><em>${county[0].properties.rates}</strong> Cases per 100,000</em></p>` :
        `<p>Hover over a County!</p>`;
});
}

geojsonFetch();