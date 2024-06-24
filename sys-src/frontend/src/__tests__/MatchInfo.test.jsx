import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MatchInfo from '../components/MatchInfo'; // Adjust the import path as needed

const mock = new MockAdapter(axios);

// MatchInfo test suite
describe('MatchInfo', () => {
  // Before each test, mock the axios GET request
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

  // Test case: Displays loading state initially
  it('displays loading state initially', () => {
    render(<MatchInfo team1="Team A" team2="Team B" />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

 /* // Test case: Displays "No matches available" message when API returns empty array
  it('displays "No matches available" message when API returns empty array', async () => {
    render(<MatchInfo team1="Team A" team2="Team B" />);
    await waitFor(() => {
      expect(screen.getByText(/No matches available/i)).toBeInTheDocument();
    });
  });

  // Test case: Displays match data correctly
  it('displays match data correctly', async () => {
    const mockResponse = [
      { home_goals: 1, away_goals: 2 },
      { home_goals: 3, away_goals: 1 },
      { home_goals: 0, away_goals: 0 },
      { home_goals: 2, away_goals: 3 },
      { home_goals: 1, away_goals: 1 }
    ];

    mock.onGet('/api/matches').reply(200, mockResponse);

    render(<MatchInfo team1="Team A" team2="Team B" />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(6); // Including header row
      mockResponse.slice(-5).forEach((match) => {
        expect(screen.getByText(match.home_goals.toString())).toBeInTheDocument();
        expect(screen.getByText(match.away_goals.toString())).toBeInTheDocument();
      });
    });
  });

  // Test case: Handles API errors gracefully
  it('handles API errors gracefully', async () => {
    mock.onGet('/api/matches').reply(500);

    render(<MatchInfo team1="Team A" team2="Team B" />);

    await waitFor(() => {
      expect(screen.getByText(/There was an error fetching the match data!/i)).toBeInTheDocument();
    });
  });*/
});
