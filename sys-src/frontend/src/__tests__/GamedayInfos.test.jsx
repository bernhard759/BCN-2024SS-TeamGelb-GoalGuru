import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach } from 'vitest';
import GamedayInfos from '../components/gameday/GamedayInfos';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// Mock axios
const mockAxios = new MockAdapter(axios);

describe('GamedayInfos', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  // Loading skeletons present
  it('renders loading skeletons initially', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <GamedayInfos />
        </MemoryRouter>
      </I18nextProvider>
    );

    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons).toHaveLength(9);
  });

  // Match data rendering
  it('renders match data after successful API call', async () => {
    const mockMatchData = [
      {
        matchID: 1,
        team1: { teamName: 'Team A' },
        team2: { teamName: 'Team B' },
        matchResults: [{ resultTypeID: 2, pointsTeam1: 2, pointsTeam2: 1 }],
        group: { groupOrderID: 1 },
        matchDateTime: '2023-06-27',
        leagueSeason: '2023'
      },
    ];

    mockAxios.onGet('https://api.openligadb.de/getmatchdata/bl1/2023').reply(200, mockMatchData);

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <GamedayInfos />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument();
      // Use the actual translated text here instead of keys
      expect(screen.getByText(/Result: 2 - 1/)).toBeInTheDocument();
      expect(screen.getByText(/Winner: Team A/)).toBeInTheDocument();
    });
  });

  // Error message
  it('renders error message when API call fails', async () => {
    mockAxios.onGet('https://api.openligadb.de/getmatchdata/bl1/2023').reply(500);

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <GamedayInfos />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      // Use the actual translated text for the error message
      expect(screen.getByText(/No match data available/)).toBeInTheDocument();
    });
  });
});
