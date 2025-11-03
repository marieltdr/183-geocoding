mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWVsdGRyIiwiYSI6ImNtaDljY3lnNjA1NzIya3Bwbmw4YThndHMifQ.8xjaPLZ8qauEqwsk7tsrLw';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/marieltdr/cmh9cfchm009g01ra3lh24uro', // Use the standard style for the map
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: [-122.27, 37.87] // center the map on this longitude and latitude
    });
    map.on('load', function() {
        map.addSource('points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/marieltdr/183geodata/refs/heads/main/183data.geojson'
    });
    map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points-data',
        paint: {
            'circle-color': '#7d42fbff',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#DFC5FE'
        }
    });
     map.on('click', 'points-layer', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        const popupContent = `
            <div>
                <h3>${properties.Landmark}</h3>
                <p><strong>Address:</strong> ${properties.Address}</p>
                <p><strong>Architect & Date:</strong> ${properties.Architect_&_Date}</p>
                <p><strong>Designated:</strong> ${properties._Designated_}</p>
                ${properties.Link ? `<p><a href="${properties.Link}" target="_blank">More Information</a></p>` : ''}
                ${properties.Notes ? `<p><strong>Notes:</strong> ${properties.Notes}</p>` : ''}
            </div>
        `;
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });
     // Change cursor to pointer when hovering over points
    map.on('mouseenter', 'points-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change cursor back when leaving points
    map.on('mouseleave', 'points-layer', () => {
        map.getCanvas().style.cursor = '';
    });
});
