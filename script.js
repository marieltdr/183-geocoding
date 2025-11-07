mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWVsdGRyIiwiYSI6ImNtaDljY3lnNjA1NzIya3Bwbmw4YThndHMifQ.8xjaPLZ8qauEqwsk7tsrLw';
const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/marieltdr/cmh9cfchm009g01ra3lh24uro', 
        zoom: 12, 
        center: [-122.275, 37.871] 
     });
     
  map.on('load', function() {
      map.addSource('points-data', {
            type: 'geojson',
            data: 'https://raw.githubusercontent.com/marieltdr/183geodata/refs/heads/main/183data.geojson',
            generateId: true,
            cluster: true, 
            clusterMaxZoom: 12, 
            clusterRadius: 50 
      });

        map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points-data',
        filter: ['has', 'point_count'], 
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6', 
                100, '#f1f075', 
                750, '#f28cb1' 
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20, 100, 30, 750, 40 
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

        map.addInteraction('click-clusters', {
            type: 'click',
            target: { layerId: 'clusters' },
            handler: (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });
                const clusterId = features[0].properties.cluster_id;
                map.getSource('earthquakes').getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (err) return;

                        map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom
                        });
                    }
                );
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
