import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MdSportsSoccer } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

function Footer() {
  // Translation
  const { t } = useTranslation();

  // Markup
  return (
    <footer className="text-white p-4" style={{ backgroundColor: "var(--bs-gray-800)" }}>
      <Container>
        <Row>
          <Col md="4" className="text-center">
            <h5>{t('footer.aboutheader')}</h5>
            <p>{t('footer.abouttext')}</p>
          </Col>
          <Col md="4" className="d-flex justify-content-center align-items-center">
            <h3><span>G</span><MdSportsSoccer /><span>al</span><i>Guru</i></h3>
          </Col>
          <Col md="4" className="text-center">
            <h5>{t('footer.contactheader')}</h5>
            <p>Email: goalguru123[at]gmail.com</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
