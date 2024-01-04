mapboxgl.accessToken = 'pk.eyJ1IjoicnJ1ZmZvbG8iLCJhIjoiY2xxemVyOGptMDE0ajJrbmV5ZnQycThybiJ9.UDP5hR7NNGR0O0lAqfCMLQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-77.1945, 41.2033],
  zoom: 7
});

map.on('load', async() => {

    var geoJson = await fetchGeoJSON();
    console.log(geoJson);
    // Add an image to use as a custom marker
    map.loadImage(
    'http://localhost:3000/custom_marker.png',
    (error, image) => {
    if (error) throw error;
    map.addImage('custom-marker', image);
    
    map.addSource('points', {
    type: 'geojson',
    data: geoJson
    });
     
    // Add a symbol layer
    map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'points',
    'layout': {
    'icon-image': 'custom-marker',
    }
    });
    }
    );
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
    });

    map.on('mouseenter', 'points', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
         
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
         
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });
         
        map.on('mouseleave', 'points', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
        });


    function GetData(){
        fetch('http://localhost:3001/geojsonbridges').then(response => {
            var geoJSON = response.json();
           
            
        return geoJSON;
    })}

    async function fetchGeoJSON() {
        try {
          const response =  await fetch('http://localhost:3001/geojsonbridges'); // Replace with your actual GeoJSON endpoint
          if (!response.ok) {
          
            throw new Error('Network response was not ok.');
          }
          const geoJSONData =  response.json();
          return geoJSONData;
        } catch (error) {
          console.error('Error fetching or parsing GeoJSON:', error);
          return null;
        }
      }
