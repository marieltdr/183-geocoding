mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWVsdGRyIiwiYSI6ImNtaDljY3lnNjA1NzIya3Bwbmw4YThndHMifQ.8xjaPLZ8qauEqwsk7tsrLw';
const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/marieltdr/cmh9cfchm009g01ra3lh24uro', // Use the standard style for the map
        zoom: 12, // initial zoom level, 0 is the world view, higher values zoom in
        center: [-122.275, 37.871] // center the map on this longitude and latitude
     });
     
  map.on('load', function() {
      map.addSource('points-data', {
            type: 'geojson',
            data: 'https://raw.githubusercontent.com/marieltdr/183geodata/refs/heads/main/183data.geojson',
            generateId: true,
            cluster: true, // Enable clustering
            clusterMaxZoom: 12, // Max zoom level to cluster points on
            clusterRadius: 50 // Radius in pixels to use for clustering
      });

        map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points-data',
        filter: ['has', 'point_count'], // Filter for cluster features
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6', // Color for clusters with less than 100 points
                100, '#f1f075', // Color for clusters with 100-750 points
                750, '#f28cb1' // Color for clusters with 750+ points
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20, 100, 30, 750, 40 // Radius based on point count
            ]
        }
    });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'points-data',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'points-data',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff',
                'circle-emissive-strength': 1
            }
        });

     map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points-data',
        paint: {
        'circle-radius': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            12, // Size when hovered
            6   // Default size
        ],
        'circle-color': 'blue'
          }
      });
      map.on('click', 'points-layer', (e) => {
          // Get coordinates/geometry
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;

          // Create popup content using the properties from the data
           const popupContent = `
              <div>
                  <h3>${properties["original_*Landmark*"]}</h3>
                  <p><strong>Address:</strong> ${properties["original_*Address*"]}</p>
                  <p><strong>Architect & Date:</strong> ${properties["original_*Architect & Date*"]}</p>
                  <p><strong>Designated:</strong> ${properties["original_*  Designated  *"]}</p>
                  ${properties.Link ? `<p><a href="${properties.Link}" target="_blank">More Information</a></p>` : ''}
                  ${properties["original_*Notes*"] ? `<p><strong>Notes:</strong> ${properties["original_*Notes*"]}</p>` : ''}
              </div>
    `      ;
        // Build and attach popup to coordinates
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
      let hoveredStateId = null;

map.on('mousemove', 'points-layer', (e) => {
    if (e.features.length > 0) {
        if (hoveredStateId !== null) {
            map.setFeatureState(
                { source: 'points-data', id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
            { source: 'points-data', id: hoveredStateId },
            { hover: true }
        );
    }
});

map.on('mouseleave', 'points-layer', () => {
    if (hoveredStateId !== null) {
        map.setFeatureState(
            { source: 'points-data', id: hoveredStateId },
            { hover: false }
        );
    }
    hoveredStateId = null;
});

  });
    hoveredStateId = null;
});

  });
