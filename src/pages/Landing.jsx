import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlc29uZyIsImEiOiJjbGFqNnh2bDAwOXZlM3ZycWVkZ3YycnlzIn0.o43APqITPr1TxZFDwtClPA';

// Components

// CSS
import "./styles/Landing.css"
import "mapbox-gl/dist/mapbox-gl.css";
// import 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css'

// Page Function
function Landing() {

  const mapContainer = useRef(null)
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
    
  useEffect(() => {

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/charlesong/clajdaze2000e14qpshcv9szq",
      center: [lng, lat],
      zoom: zoom
    });

    // Popups on marker click
    map.on('click', (event) => {
      // If the user clicked on one of your markers, get its information.
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["free-parking-perth"]
      });
      if (!features.length) {
        return;
      }
      const feature = features[0];
    
      const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `<h3>${feature.properties.Name}</h3><p>${feature.properties.Suburb}, ${feature.properties.City}</p>`
        )
        .addTo(map);
    });

    // Change Lat, Lng on move
    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // 
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
    );
    
    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div className="map-container">
      Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      <div id="map" ref={mapContainer}/>
    </div>
  )
}
  
export default Landing
  