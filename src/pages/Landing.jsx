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
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

  // // Adjust map size on render
  // map.on('render', function () {
  //   map.resize();
  // });
    
  useEffect(() => {

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
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
  