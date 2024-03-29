import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Table from 'react-bootstrap/Table';

function MarkerSideBar(props){
    
    const directions = "https://www.google.com/maps/dir//"+ props.latLng + "/@" + props.latLng + ",16.75z";
    const telephone = "tel:" + props.details.Phone;
    const [pricesTable,setPricesTable] = useState(null);

    useEffect(() => {
        if (props.details.Price){
            var prices = JSON.parse(props.details.Price);
    
            setPricesTable(
                <Table striped size="sm">
                    {/* note: "index" does not work */}
                    {prices.map(({type, period, rate}) => (
                        <>
                        {type}
                        <tbody>
                            <tr key={period}>
                                <td>{period}</td>
                                <td>{rate}</td>
                            </tr>
                        </tbody>
                        </>
                    ))}
                </Table>
            );
        }
        else {
            setPricesTable(null);
        }
    }, [props.show, props.details]);

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
                <p> <div className='font-bold'>City: </div> {props.details.City}</p>
                <p> <div className='font-bold'>Suburb: </div> {props.details.Suburb}</p>
                <a href={directions} target="_blank"><Button>Get Directions</Button></a>
                <p className="mt-3 mb-1 font-bold">Prices:</p>
                {pricesTable}
                <p> <div className='font-bold'>Phone: </div><a target="_blank" href={telephone}>{props.details.Phone}</a></p>
                <p> <div className='font-bold'>Website: </div><a target="_blank" href={props.details.Website}>{props.details.Website}</a></p>
            </Offcanvas.Body>
        </Offcanvas>
        
        </>
    );
}

export default MarkerSideBar