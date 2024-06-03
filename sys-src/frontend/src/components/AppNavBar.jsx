import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import { MdSportsSoccer } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";

export default function AppNavbar() {
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="#"><b>G<MdSportsSoccer className="text-primary" />al<i className="text-primary">Guru</i></b></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/*<Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>*/}
            </Nav>
            <Nav>
              <div className="icon-wrapper"><MdInfoOutline onClick={handleModalOpen} className="clickable-icon text-secondary"/></div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your modal content here */}
          <p>This is the modal content.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}