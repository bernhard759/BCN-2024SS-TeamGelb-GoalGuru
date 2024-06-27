import React, { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import { MdSportsSoccer } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { FaSun, FaMoon } from 'react-icons/fa';
import { FaGlobe } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import "./AppNavBar.css"

export default function AppNavbar() {

  // Translation
  const { t } = useTranslation();

  // State
  //----------------------------------------------------------------
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  //----------------------------------------------------------------

  // Refs
  //----------------------------------------------------------------
  const infoIconRef = useRef(null);
  //----------------------------------------------------------------

  // Effects
  //----------------------------------------------------------------
  useEffect(() => {
    // Change the theme
    const body = document.body;
    body.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  //----------------------------------------------------------------


  // Funcs
  //----------------------------------------------------------------
  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent default behavior
      handleModalOpen();
    }
  };
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  //----------------------------------------------------------------

  // Markup
  return (
    <>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/"><b>G<MdSportsSoccer className="text-primary" />al<i className="text-primary">Guru</i></b></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom">{t('nav.predict')}</Nav.Link>
              <Nav.Link as={Link} to="/gameday" className="nav-link-custom">{t('nav.gameday')}</Nav.Link>
            </Nav>
            <Nav>
              <div className="d-flex jsutify-content-center align-items-center gap-2">
                {/* Language switcher */}
                <DropdownButton
                  id="language-dropdown"
                  title={<FaGlobe />}
                  variant="outline-secondary"
                >
                  <Dropdown.Item
                    active={currentLanguage === 'en'} // Highlight the active language
                    onClick={() => {
                      setCurrentLanguage('en');
                      i18n.changeLanguage('en');
                    }}
                  >
                    EN
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={currentLanguage === 'de'}
                    onClick={() => {
                      setCurrentLanguage('de');
                      i18n.changeLanguage('de');
                    }}
                  >
                    DE
                  </Dropdown.Item>
                </DropdownButton>
                {/*Theme picker*/}
                <div className="icon-wrapper"
                  role="button"
                  tabIndex={0}
                  aria-label="Toggle theme"
                  onClick={toggleTheme}>
                  {isDarkMode ? <FaSun className="text-secondary" /> : <FaMoon className="text-secondary" />}
                </div>
                {/*App info*/}
                <div
                  className="icon-wrapper"
                  role="button"
                  tabIndex={0}
                  aria-label="Open information modal"
                  onClick={handleModalOpen}
                  onKeyDown={handleKeyDown}
                  ref={infoIconRef}
                >
                  <MdInfoOutline className="clickable-icon text-secondary" />
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleModalClose} size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <h2>Welcome to GoalGuru!</h2>

          <p>GoalGuru is your go-to app for predicting soccer match outcomes. Here's how to use it:</p>

          <ol>
            <li>Select a match from the available teams.</li>

            <li>View detailed information for each team:</li>
            <ul>
              <li>Recent performance</li>
              <li>Head-to-head history</li>
            </ul>
            <li>Analyze the win, draw, and lose probabilities generated by our machine learning model.</li>
            <li>Make your prediction by trusing our model or based on the additional team information and your soccer knowledge.</li>
          </ol>
          <p>Currently, GoalGuru focuses on the German soccer league (Bundesliga), but we're expanding to include more leagues soon. Stay tuned for updates!</p>
          <p>Our backend utilizes a logistic regression model to provide accurate predictions. Use this information to enhance your understanding of each match and improve your prediction skills.</p>
          <p>Enjoy GoalGuru and may your predictions be spot-on!</p>
        </Modal.Body>
      </Modal>
    </>
  );
}