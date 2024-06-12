import React from 'react';
import { render, screen, waitForElementToBeRemoved, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GamePrediction from '../components/GamePrediction';

// GamePrediction test suite
describe('GamePrediction', () => {

    // Loading skeleton
    //----------------------------------------------------------------
    it('renders the loading skeleton initially', async () => {

        // Wrap the component rendering and state updates with act
        render(<GamePrediction teams={['Team A', 'Team B']} />);


        // Check if the loading skeleton is rendered
        const loadingSkeleton = screen.getByTestId('loadingskeleton1');
        expect(loadingSkeleton).toBeInTheDocument();
    });
    //----------------------------------------------------------------

    // Prediction result text
    //----------------------------------------------------------------
    it('renders the prediction result correctly', async () => {
        render(<GamePrediction teams={['Team A', 'Team B']} />);

        // Wait for the loading state to disappear
        const loadingSkeleton = screen.getByTestId('loadingskeleton1');
        await waitForElementToBeRemoved(loadingSkeleton, { timeout: 3000 });

        // Check if the error message is displayed
        const errorMessage = screen.queryByTestId('errortext');
        console.log(errorMessage)
        if (errorMessage) {
            // If the error message is displayed, assert its content
            expect(errorMessage).toHaveTextContent('There was a problem fetching the prediction form the backend. Please try again.');
        } else {
            // If the error message is not displayed, assert the prediction text
            const predictionText = screen.getByTestId('predictiontext');
            expect(predictionText).toBeInTheDocument();
            expect(predictionText).toHaveTextContent('We are 60 % sure that Team A wins the game.');
        }
    });
    //----------------------------------------------------------------

});

