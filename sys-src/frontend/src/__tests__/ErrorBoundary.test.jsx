import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/error/ErrorBoundary';


// Mock component that throws an error
const ThrowError = () => {
    throw new Error('Test error');
};

describe('ErrorBoundary', () => {

    // Rendering children when no error is there
    it('renders children when there is no error', () => {
        const { getByText } = render(
                <ErrorBoundary>
                    <p>Test Content</p>
                </ErrorBoundary>
        );

        expect(getByText('Test Content')).toBeDefined();
    });

    // Test error boundary
    it('renders error message when there is an error', () => {

        // Suppress console.error
        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
                <ErrorBoundary>
                    {/* Here we throw the error for testing purposes */}
                    <ThrowError />
                </ErrorBoundary>
        );

        expect(screen.getByTestId("errorboundarymsg")).toBeInTheDocument();

        // Restore console.error
        consoleErrorMock.mockRestore();
    });
});
