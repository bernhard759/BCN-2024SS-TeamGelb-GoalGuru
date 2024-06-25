import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="text-white mt-5 p-4" style={{backgroundColor: "var(--bs-gray-800)"}}>
      <Container>
        <Row>
          <Col md="4">
            <h5>About Us</h5>
            <p></p>
          </Col>
          <Col md="4">
            <h5>Contact</h5>
            <p>Email: info@example.com</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
