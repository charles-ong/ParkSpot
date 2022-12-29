import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Steps, Hints } from 'intro.js-react';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlc29uZyIsImEiOiJjbGFqNnh2bDAwOXZlM3ZycWVkZ3YycnlzIn0.o43APqITPr1TxZFDwtClPA';

// Components
import UserMarkerSubmission from "../components/UserMarkerSubmission"
import MarkerSideBar from '../components/MarkerSideBar';

// CSS
import "./styles/Landing.css"
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'intro.js/introjs.css';
// import 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css'


// Page Function
function Landing() {

  const mapContainer = useRef(null);
  const [lng, setLng] = useState(115.8613);
  const [lat, setLat] = useState(-31.9523);
  const [zoom, setZoom] = useState(9);
  const [userMarkerLngLat, setUserMarkerLngLat] = useState(null);
  const [markerLatLng, setMarkerLatLng] = useState(null);
  const [userMarker, setUserMarker] = useState(false);
  const [markerDetails, setMarkerDetails] = useState({});
  const [sideBarShow, setSideBarShow] = useState(false);
  const [enableTour, setEnableTour] = useState(false);

  const steps = [
    {
      title: "Hello 👋",
      element: '.body',
      intro: 'Welcome to Parkspot!',
      position: 'right',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighlightClass',
    },

    {
      element: '.mapboxgl-ctrl-geocoder',
      intro: 'This is the search bar. You can search for any place within Western Australia',
    },
    {
      element: '.navigation-ctrl',
      intro: 'Click the + and - buttons to zoom in and out and the compass button to reset the bearing.',
    },
    {
      element: '.mapboxgl-ctrl-geolocate',
      intro: 'Click this button to view your current location.',
    },
    {
      element: '.add-marker-button',
      intro: "Found a free parking spot that's not on the map? Click here to help us add it to the map.",
    },

    {
      element: '.home-button',
      // intro: 'Click this button to reset the map view back to Perth.',
      intro: 'Click this button to install this site as an application.'
    },
    
    {
      element: '.help-button',
      intro: "And that's it! If you need help, click this button to start the tour again. Happy parking! 🚗",
    },
  ];

  // if (/Android|iPhone/i.test(navigator.userAgent)) { // test if it works on other devices
  //   steps[6] = steps[7];
  //   steps.pop();
  // }

  const options = {
    showStepNumbers: true
  }

  const onExit = () => {};

  // For installing application (only works on desktop atm)
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    e.preventDefault();
    // Save the event because you'll need to trigger it later.
    deferredPrompt = e;
  });

  useEffect(() => {
    // Clears storage on load
    mapboxgl.clearStorage();

    // Map Load
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/charlesong/clajdaze2000e14qpshcv9szq",
      center: [lng, lat],
      zoom: zoom
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

    // Heatmap
    map.on('click',(event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["heatmap"]
      });
      if (!features.length) {
        return;
      }
      const feature = features[0];
      map.panTo(feature.geometry.coordinates, {zoom: parseFloat(newZoom)+2.5});
    })

    // Parking Markers
    map.on('click', (event) => {
      if (newZoom >= 12.20){
        const features = map.queryRenderedFeatures(event.point, {
          layers: ["free-parking-perth"]
        });
        if (!features.length) {
          return;
        }
        const feature = features[0];
        
        // const popup = new mapboxgl.Popup({ offset: [0, -15] })
        //   .setLngLat(feature.geometry.coordinates)
        //   .setHTML(
        //     `<h3>${feature.properties.Name}</h3><p>${feature.properties.Suburb}, ${feature.properties.City}</p>`
        //   )
        //   .addTo(map);


        map.panTo(feature.geometry.coordinates, {zoom: parseFloat(newZoom)+2});
  
        const markers = document.getElementsByClassName("mapboxgl-marker")    // all added markers in DOM
        // Remove all added markers (except user location button)
        if (markers.length > 0){
          for (let i=0; i<markers.length; i++){
            if (!markers[i].className.includes("location")){
              markers[i].parentNode.removeChild(markers[i]);
            }
          }
        }
        setUserMarker(false);
  
        const marker = new mapboxgl.Marker({
          scale: 0.8,
          color: "#FF0000",
          draggable: false
        }).setLngLat(feature.geometry.coordinates).addTo(map);
        
        const coordinates = feature.geometry.coordinates;
        setMarkerLatLng(coordinates[1] + "," + coordinates[0]);
        
        const details = {
          Name: feature.properties.Name,
          Suburb: feature.properties.Suburb,
          City: feature.properties.City,
          Price: feature.properties.Price
        };
        setMarkerDetails(details);
        setSideBarShow(true);
      }
    });

    // Change cursor on hover
    map.on('load', function() {
      map.on("mouseenter", ["free-parking-perth", "heatmap"], (event) => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', ["free-parking-perth", "heatmap"], (event) => {
        map.getCanvas().style.cursor = 'default';
      });
    });

    // Add navigation control (the +/- zoom buttons, compass and compass visualisation on change of pitch)
    map.addControl(new mapboxgl.NavigationControl({
        showZoom: true,
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

    // Adding Markers Control
    class AddMarkerButton {
      onAdd(map) {
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button class="add-marker-button"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"><title>Suggest Free Parking Spot</title><path fill="currentColor" fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg></button>`;
        div.addEventListener("contextmenu", (e) => e.preventDefault());
        div.addEventListener("click", function(){
          setSideBarShow(false);  // turn off sidebar
          const markers = document.getElementsByClassName("mapboxgl-marker")    // all added markers in DOM
          // Remove all added markers (except user location button)
          if (markers.length > 0){
            for (let i=0; i<markers.length; i++){
              if (!markers[i].className.includes("location")){
                markers[i].parentNode.removeChild(markers[i]);
              }
            }
          }
          // Add marker
          const marker = new mapboxgl.Marker({
              draggable: "true",
              scale: 0.8,
              color: "#FF0000"
            }).setLngLat([newLng, newLat]).addTo(map);
          
          
          function onDragEnd() {
            const lngLat = marker.getLngLat();
            setUserMarkerLngLat(lngLat.lng.toString() + "," + lngLat.lat.toString());
          }
          
          marker.on('dragend', onDragEnd);
          
          setUserMarker(true);

          const lngLat = marker.getLngLat();
          setUserMarkerLngLat(lngLat.lng.toString() + "," + lngLat.lat.toString());
        });
        return div;
      }
      onRemove(map) {}
    }
    map.addControl(new AddMarkerButton());

    // // Home Position for Home Button (Perth)
    // const homePosition = {
    //   center: [115.8613, -31.9523],
    // };
    class HomeButton {
      onAdd(map) {
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button class="home-button">
          <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="font-size: 20px;"><title>Install App</title><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
          </button>`;
        div.addEventListener("contextmenu", (e) => e.preventDefault());
        // div.addEventListener("click", () => map.flyTo(homePosition));
        div.addEventListener('click', (e) => {
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice
            .then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
                div.style.display = "none";
              } 
              else {
                console.log('User dismissed the A2HS prompt');
                // div.style.display = "none";
              }
              // deferredPrompt = null;
            });
          });
        return div;
      }
      onRemove(map) {}
    }
    // if (!/Android|iPhone/i.test(navigator.userAgent)) {
      map.addControl(new HomeButton());   // test if works on other devices
    // }

    class HelpButton {
      onAdd(map) {
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button class="help-button">
          <svg xmlns="http://www.w3.org/2000/svg" idth="24px" height="24px" fill="currentColor" class="bi bi-info" viewBox="0 0 16 16"><title>Information</title>
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
          </button>`;
        div.addEventListener("contextmenu", (e) => e.preventDefault());
        div.addEventListener("click", () => setEnableTour(true));
        return div;
      }
      onRemove(map) {}
    }
    map.addControl(new HelpButton());

    // Search Box (Mapbox Search JS)
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      countries: 'au',
      bbox: [111.42, -35.93, 128.98, -12.91]
    });
    map.addControl(geocoder, "top-left")

    // Change the classname of parent div of the navigation buttons
    const navcontrols = document.getElementsByClassName("mapboxgl-ctrl-zoom-out");
    navcontrols[0].parentNode.className = "navigation-ctrl mapboxgl-ctrl mapboxgl-ctrl-group";

    // Enable the product tour after map has been loaded
    setEnableTour(true);

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <>
    <div className="map-container">
      <div id="map" ref={mapContainer}>
      </div>
    </div>
    <div className="map-overlay-container">
      <div className="top-2 left-2">
        {/* <p>Longitude: {lng}, Latitude: {lat}, Zoom: {zoom}</p> */}
        <MarkerSideBar
          show = {sideBarShow}
          details = {markerDetails}
          latLng = {markerLatLng}
          onHide = {() => setSideBarShow(false)}
        />

        <Steps
          enabled = {enableTour}
          steps = {steps}
          initialStep = {0}
          onExit = {onExit}
          onBeforeExit = {()=> setEnableTour(false)}
          onComplete = {()=> setEnableTour(false)}
          options = {options}
        />

      </div>
    </div>
    <div className="user-submission-buttons">
      
      <UserMarkerSubmission
        show = {userMarker}
        onHide = {() => setUserMarker(false)}
        lngLat = {userMarkerLngLat}
      />
    </div>
    </>
  )
}
  
export default Landing
  