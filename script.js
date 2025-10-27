mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWVsdGRyIiwiYSI6ImNtaDljY3lnNjA1NzIya3Bwbmw4YThndHMifQ.8xjaPLZ8qauEqwsk7tsrLw';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/marieltdr/cmh9cfchm009g01ra3lh24uro', // Use the standard style for the map
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: [-122.27, 37.87] // center the map on this longitude and latitude
    });