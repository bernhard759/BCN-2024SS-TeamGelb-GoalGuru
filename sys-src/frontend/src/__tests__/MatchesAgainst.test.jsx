import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MatchInfo from '../components/MatchesAgainst';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

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
    render(<I18nextProvider i18n={i18n}><MatchInfo team1="Team A" team2="Team B" /></I18nextProvider>);
    await waitFor(() => {
      expect(screen.getByText(/Last Matches Against Each Other/i)).toBeInTheDocument();
    });
  });

  // Test case: First shows the loading state
  it('displays loading state initially', () => {
    render(<MatchInfo team1="Team A" team2="Team B" />);
    expect(screen.getByTestId("matchloading")).toBeInTheDocument();
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

    const { getByTestId } = render(<MatchInfo team1="Team A" team2="Team B" />);
    expect(getByTestId("matchloading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("matchloading")).not.toBeInTheDocument();
    });
  });



});
