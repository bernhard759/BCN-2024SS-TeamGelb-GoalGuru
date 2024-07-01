import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CiFaceFrown } from "react-icons/ci";



// Error boundary class component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught an error:", error, errorInfo);
  }

  render() {
    const { t } = this.props.useTranslation();

    if (this.state.hasError) {
      return (
        <Container className="my-5 d-flex gap-2 p-3 text-secondary flex-column justify-content-center align-items-center border-2 border-top border-bottom">
            <CiFaceFrown className="display-5"/>
            <p className="lead fw-bold" data-testid="errorboundarymsg">{t('errorBoundary.message')}</p>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundaryWrapper(props) {
  const { t } = useTranslation();
  return <ErrorBoundary useTranslation={() => ({ t })} {...props} />;
}
