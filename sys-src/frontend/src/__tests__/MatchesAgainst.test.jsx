import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MatchInfo from '../components/MatchesAgainst'; 

const mock = new MockAdapter(axios);

// Test suite for MatchInfo
describe('MatchInfo', () => {
// Mock the axios GET request before to each test.
  beforeEach(() => {
    mock.onGet('/api/matches').reply(200, []);
  });

  // After each test, reset the mock
  afterEach(() => {
    mock.reset();
  });

  // Test case: Renders the component
  it('renders the MatchInfo component', async () => {
    render(<MatchInfo team1="Team A" team2="Team B" />);
    await waitFor(() => {
      expect(screen.getByText(/Last Five Matches/i)).toBeInTheDocument();
    });
  });

// Test case: First shows the loading state
  it('displays loading state initially', () => {
    render(<MatchInfo team1="Team A" team2="Team B" />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  
  // Test case: Checks API request parameters
  it('checks API request parameters', async () => {
    render(<MatchInfo team1="Team A" team2="Team B" />);
    await waitFor(() => {
      expect(mock.history.get[0].params).toEqual({
        home_team: 'Team A',
        away_team: 'Team B'
      });
    });
  });


  // Test the starting status of loading
  it('displays loading state initially', async () => {
// In order to simulate a network delay, this delays the mock answer.
    mock.onGet('/api/matches').reply(() => {
      return new Promise((resolve) => setTimeout(() => resolve([200, []]), 100));
    });

    const { getByText } = render(<MatchInfo team1="Team A" team2="Team B" />);
    expect(getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });


  
});
