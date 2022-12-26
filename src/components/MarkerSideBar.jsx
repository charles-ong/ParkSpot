import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';


function MarkerSideBar(props){
    
    const directions = "https://www.google.com/maps/dir//"+ props.latLng + "/@" + props.latLng + ",16.75z";

    var placement = "start";
    if (/Android|iPhone/i.test(navigator.userAgent)) {
        placement = "bottom"
    }

    function hide(){
        const markers = document.getElementsByClassName("mapboxgl-marker")    // all added markers in DOM
        // Remove all added markers (except user location button)
        if (markers.length > 0){
            for (let i=0; i<markers.length; i++){
                if (!markers[i].className.includes("location")){
                markers[i].parentNode.removeChild(markers[i]);
                }
            }
        }
        props.onHide();
    }

    return(
        <>
        <Offcanvas show={props.show} onHide={hide} backdrop={false} scroll={true} placement = {placement}>
            <Offcanvas.Header closeButton>
            <Offcanvas.Title>{props.details.Name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <p>Suburb: {props.details.Suburb}</p>
                <p>City: {props.details.City}</p>
                <a href={directions} target="_blank"><Button>Get Directions</Button></a>
            </Offcanvas.Body>
        </Offcanvas>
        
        </>
    );
}

export default MarkerSideBar