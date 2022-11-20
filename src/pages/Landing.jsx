import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlc29uZyIsImEiOiJjbGFqNnh2bDAwOXZlM3ZycWVkZ3YycnlzIn0.o43APqITPr1TxZFDwtClPA';

// Components
import UserMarkerSubmission from "../components/UserMarkerSubmission"

// CSS
import "./styles/Landing.css"
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css'


// Page Function
function Landing() {

  const mapContainer = useRef(null)
  const [lng, setLng] = useState(115.8613);
  const [lat, setLat] = useState(-31.9523);
  const [zoom, setZoom] = useState(9);
  const [markerLngLat, setMarkerLngLat] = useState(null);
  const [value, setValue] = useState("");

  const [userMarker, setUserMarker] = useState(false);
    
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

    // Temporary variables to enable immediate updating of values
    var newLng = lng;
    var newLat = lat;
    var newZoom = zoom;

    // Change Lat, Lng on move
    map.on('move', () => {
      newLng = map.getCenter().lng.toFixed(4);
      newLat = map.getCenter().lat.toFixed(4);
      newZoom = map.getZoom().toFixed(2);
      setLng(newLng);
      setLat(newLat);
      setZoom(newZoom);
    });

    // Fullscreen control
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl({
        showCompass: true,
        visualizePitch: true
      }), 'top-right'
    );

    // Add users' geolocation button
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      }), 'top-right'
    );
    
    // Home Position for Home Button (Perth)
    const homePosition = {
      center: [115.8613, -31.9523],
    };
    class HomeButton {
      onAdd(map) {
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button>
          <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="font-size: 20px;"><title>Reset map</title><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
          </button>`;
        div.addEventListener("contextmenu", (e) => e.preventDefault());
        div.addEventListener("click", () => map.flyTo(homePosition));
        return div;
      }
      onRemove(map) {}
    }
    map.addControl(new HomeButton());

    // Adding Markers Control
    class AddMarkerButton {
      onAdd(map) {
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"><title>Suggest Free Parking Spot</title><path fill="currentColor" fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg></button>`;
        div.addEventListener("contextmenu", (e) => e.preventDefault());
        div.addEventListener("click", function(){
          const markers = document.getElementsByClassName("mapboxgl-marker")    // all added markers in DOM
          // Remove all added markers
          if (markers.length > 0){
            while(markers.length > 0){
              markers[0].parentNode.removeChild(markers[0]);
            }
          }
          // Add marker iff there are no markers
          if (markers.length == 0){
            const marker = new mapboxgl.Marker({
                draggable: "true",
                scale: 0.8,
                color: "#FF0000"
              }).setLngLat([newLng, newLat]).addTo(map);
            
            
            function onDragEnd() {
              const lngLat = marker.getLngLat();
              console.log(marker.getLngLat());
              const latLng = marker.getLngLat();
              setMarkerLngLat(latLng.lng.toString() + "," + latLng.lat.toString());
            }
            
            marker.on('dragend', onDragEnd);
            
            setUserMarker(true);

            const latLng = marker.getLngLat();
            setMarkerLngLat(latLng.lng.toString() + "," + latLng.lat.toString());
          }
        });
        return div;
      }
      onRemove(map) {}
    }
    map.addControl(new AddMarkerButton());

    // Search Box (Mapbox Search JS)
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      countries: 'au',
      bbox: [111.42, -35.93, 128.98, -12.91],
      collapsed: true
    });
    map.addControl(geocoder, "top-left")

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <>
    <div className="map-container">
      <div id="map" ref={mapContainer}/>
    </div>
    <div className="map-overlay-container">
      <div className="top-2 left-2">
        {/* <p>Longitude: {lng}, Latitude: {lat}, Zoom: {zoom}</p> */}
        {/* <form>
          <SearchBox accessToken={mapboxgl.accessToken} />
        </form> */}
      </div>
    </div>
    <div className="user-submission-buttons">
      <UserMarkerSubmission
        show = {userMarker}
        onHide ={() => setUserMarker(false)}
        lngLat = {markerLngLat}
      />
    </div>
    </>
  )
}
  
export default Landing
  