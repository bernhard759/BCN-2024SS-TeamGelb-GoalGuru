import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="mb-4">{t('notfound.title')}</h2>
          <p className="mb-4">{t('notfound.message')}</p>
          <Button as={Link} to="/" variant="secondary">
            {t('notfound.backhome')}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
