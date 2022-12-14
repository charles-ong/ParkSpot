import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';


function MarkerSideBar(props){
    
    const directions = "https://www.google.com/maps/dir//"+ props.latLng;

    var placement = "start";
    if (/Android|iPhone/i.test(navigator.userAgent)) {
        placement = "bottom"
    }

    return(
        <>
        <Offcanvas show={props.show} onHide={props.onHide} backdrop={false} scroll={true} placement = {placement}>
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