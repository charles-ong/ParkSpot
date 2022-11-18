import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image'

function UserMarkerSubmission(props){

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true)
    const source = "https://api.mapbox.com/styles/v1/charlesong/clajdaze2000e14qpshcv9szq/static/pin-m-circle+ff0000(" + props.lngLat + ")/auto/600x300@2x?attribution=true&logo=false&access_token=pk.eyJ1IjoiY2hhcmxlc29uZyIsImEiOiJjbGFqNnh2bDAwOXZlM3ZycWVkZ3YycnlzIn0.o43APqITPr1TxZFDwtClPA";

    function cancel() {
        const markers = document.getElementsByClassName("mapboxgl-marker")    // all added markers in DOM
        // Remove all added markers
        if (markers.length > 0){
            while(markers.length > 0){
                markers[0].parentNode.removeChild(markers[0]);
            }
        }
        props.onHide();
    }

    if (props.show == true){
        return (
            <>
            <Button variant="danger" onClick={cancel}>
                Cancel
            </Button>
            <Button variant="success" onClick={handleShow}>
                Submit
            </Button>
    
            <Modal show={showModal} onHide={handleClose} centered size="sm">
                <Modal.Header closeButton>
                <Modal.Title>Suggest Free Parking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image fluid src={source}/>
                    <Form 
                        data-netlify="true"
                        name="ParkSpot Marker Submission"
                        method="post"
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>Coordinates</Form.Label>
                            <Form.Control placeholder="Disabled input" disabled name="ParkSpot Marker Submission" value={props.lngLat}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" name="ParkSpot Marker Submission"/>
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" onClick={handleClose}>
                    Submit Suggestion
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        )
    }
}

export default UserMarkerSubmission