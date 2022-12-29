import React, { useState, useRef } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image'
import emailjs from 'emailjs-com';

function UserMarkerSubmission(props){

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true)
    const handleClose = () => setShowModal(false);
    const source = "https://api.mapbox.com/styles/v1/charlesong/clajdaze2000e14qpshcv9szq/static/pin-m-circle+ff0000(" + props.lngLat + ")/auto/600x300@2x?attribution=true&logo=false&access_token=pk.eyJ1IjoiY2hhcmxlc29uZyIsImEiOiJjbGFqNnh2bDAwOXZlM3ZycWVkZ3YycnlzIn0.o43APqITPr1TxZFDwtClPA";
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        console.log(form.current);
        emailjs.sendForm('service_le7cdeo', 'template_a1wcjvf', form.current, 'm5Hi3f20sfOb0duDs')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
        handleClose();
    };

    function cancel() {
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

    if (props.show == true){
        return (
            <>
            <Button variant="danger" onClick={cancel}>
                Cancel
            </Button>
            <Button variant="success" onClick={handleShow}>
                Submit
            </Button>
    
            <Modal show={showModal} onHide={handleClose} centered size="md">
                <Modal.Header closeButton>
                <Modal.Title>Suggest Free Parking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image fluid src={source}/>
                    <div className="mb-3 mt-3">
                        <Form ref={form} onSubmit={sendEmail}>
                            <Form.Group className="mb-3" controlId="coordinates">
                                <Form.Label>Coordinates:</Form.Label>
                                <Form.Control type="text" name="coordinates" value={props.lngLat}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Your Email: </Form.Label>
                                <Form.Control type="email" name="user_email"/>
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleClose}>
                                Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                Submit Suggestion
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </div>          
                </Modal.Body>
                
            </Modal>
            </>
        )
    }
}

export default UserMarkerSubmission