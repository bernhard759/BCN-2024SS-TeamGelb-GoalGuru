import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import NotFound from '../components/notfound/NotFound';

describe('NotFound', () => {

// Check if everything is rendered correctly
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <NotFound />
        </I18nextProvider>
      </BrowserRouter>
    );

    // Check if the title is present
    expect(screen.getByText(/Page Not Found/)).toBeInTheDocument();

    // Check if the message is present
    expect(screen.getByText(/The page you're looking for doesn't exist or has been moved/)).toBeInTheDocument();
  });
});
