import React, { useState} from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Modal from 'react-bootstrap';

function MarkerDetailsBar(props) {
    // const [show, setShow] = useState(true);
    // const handleShow = () => setShow(true)
    // const handleClose = () => setShow(false);

    if (props.show == true){
        return(
            <>
                {/* <Offcanvas show={show} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        Some text as placeholder. In real life you can have the elements you
                        have chosen. Like, text, images, lists, etc.
                    </Offcanvas.Body>
                </Offcanvas> */}
                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <p>name</p>
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>hello</p>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default MarkerDetailsBar