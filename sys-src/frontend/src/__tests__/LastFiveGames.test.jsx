import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import LastFiveGames from '../components/LastFiveGames';

const mock = new MockAdapter(axios);

// LastFiveGames test suite
describe('LastFiveGames', () => {

  // Before each test, mock the axios GET request
  beforeEach(() => {
    mock.onGet('https://api.openligadb.de/getmatchdata/bl1/2023').reply(200, []);
  });

  // After each test, reset the mock
  afterEach(() => {
    mock.reset();
  });

  // Test case: Renders the component
 /* it('renders the LastFiveGames component', async () => {
    await act(async () => {
      render(<LastFiveGames team1="Bayern" team2="Union Berlin" />);
    });

    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element.textContent.match(/Last Five Games for Bayern/i);
      })).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element.textContent.match(/Last Five Games for Union Berlin/i);
      })).toBeInTheDocument();
    });
  });*/

  // Test case: Displays "No games available" message when API returns empty array
  it('displays no games available when API returns empty array', async () => {
    await act(async () => {
      render(<LastFiveGames team1="Bayern" team2="Union Berlin" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/No games available for Team Bayern/i)).toBeInTheDocument();
      expect(screen.getByText(/No games available for Team Union Berlin/i)).toBeInTheDocument();
    });
  });

  // Test case: Handles API errors gracefully
  it('handles API errors gracefully', async () => {
    mock.onGet('https://api.openligadb.de/getmatchdata/bl1/2023').reply(500);

    await act(async () => {
      render(<LastFiveGames team1="Bayern" team2="Union Berlin" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/No games available for Team Bayern/i)).toBeInTheDocument();
      expect(screen.getByText(/No games available for Team Union Berlin/i)).toBeInTheDocument();
    });
  });

  // Test case: Displays the correct result colors
  it('displays correct result colors', async () => {
    const mockResponse = [
      {
        matchID: 1,
        matchDateTimeUTC: '2023-06-24T15:00:00Z',
        team1: { shortName: 'Bayern', teamIconUrl: 'url-to-bayern-icon' },
        team2: { shortName: 'Dortmund', teamIconUrl: 'url-to-dortmund-icon' },
        matchResults: [
          { resultTypeID: 2, pointsTeam1: 3, pointsTeam2: 1 }
        ]
      },
      {
        matchID: 2,
        matchDateTimeUTC: '2023-06-17T15:00:00Z',
        team1: { shortName: 'Dortmund', teamIconUrl: 'url-to-dortmund-icon' },
        team2: { shortName: 'Bayern', teamIconUrl: 'url-to-bayern-icon' },
        matchResults: [
          { resultTypeID: 2, pointsTeam1: 0, pointsTeam2: 2 }
        ]
      }
    ];

    mock.onGet('https://api.openligadb.de/getmatchdata/bl1/2023').reply(200, mockResponse);

    await act(async () => {
      render(<LastFiveGames team1="Bayern" team2="Union Berlin" />);
    });

    await waitFor(() => {
      // Log the rendered output for debugging
      console.log(document.body.innerHTML);

      const greenCircles = screen.getAllByText('', { selector: '.green' });
      console.log(greenCircles); // Log the found elements
      expect(greenCircles).toHaveLength(2); // Two games, both wins for Bayern
    });
  });
});
