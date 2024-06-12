import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('main', () => {
  it('renders the App component', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});