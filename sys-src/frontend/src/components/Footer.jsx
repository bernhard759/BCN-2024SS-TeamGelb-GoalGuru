import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="text-white mt-5 p-4" style={{backgroundColor: "var(--bs-gray-800)"}}>
      <Container>
        <Row>
          <Col md="4" className="text-center">
            <h5>About Us</h5>
            <p>This is an app to predict the outcomes of soccer games developed in the context of the Cyberlytics project.</p>
          </Col>
          <Col md="4" className="d-flex justify-content-center align-items-center">
            <h3>Goal<i>Guru</i></h3>
          </Col>
          <Col md="4" className="text-center">
            <h5>Contact</h5>
            <p>Email: goalguru123[at]gmail.com</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
