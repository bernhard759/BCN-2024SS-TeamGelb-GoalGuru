import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach } from 'vitest';
import MatchDetails from '../components/MatchDetails';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n'; // Adjust the path to your i18n configuration

const mock = new MockAdapter(axios);

const mockMatchData = {
  team1: { teamName: 'Team A' },
  team2: { teamName: 'Team B' },
  matchDateTime: '2023-06-27T12:00:00Z',
  matchResults: [
    { resultTypeID: 2, pointsTeam1: 2, pointsTeam2: 1 }
  ],
  location: { locationCity: 'City A' },
  leagueName: 'League A',
  leagueSeason: '2023'
};

const mockPredictionData = {
  teams: ['Team A', 'Team B'],
  probabilities: {
    home: 0.6,
    draw: 0.3,
    away: 0.1
  }
};

describe('MatchDetails', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('renders match details and prediction correctly', async () => {
    mock.onGet('https://api.openligadb.de/getmatchdata/1').reply(200, mockMatchData);

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/match/1']}>
          <Routes>
            <Route path="/match/:matchId" element={<MatchDetails />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(screen.getByText(/Loading match details.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Team A vs Team B/i)).toBeInTheDocument();
      expect(screen.getByText(/Date:/i)).toBeInTheDocument();
      expect(screen.getByText(/Result:/i)).toBeInTheDocument();
      expect(screen.getByText(/Location:/i)).toBeInTheDocument();
      expect(screen.getByText(/League:/i)).toBeInTheDocument();
      expect(screen.getByText(/Season:/i)).toBeInTheDocument();
    });
  });
});
