import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import LastFiveGames from '../components/TeamMatches';


const mock = new MockAdapter(axios);

// LastFiveGames test suite
describe('LastFiveGames', () => {

  // Before each test, mock the axios GET request
  beforeEach(() => {
    mock.onGet('https://api.openligadb.de/getmatchdata/bl1/2023/Bayern').reply(200, []);
  });

  // After each test, reset the mock.
  afterEach(() => {
    mock.reset();
  });


  // Test case:  API errors.
  it('handle API errors ', async () => {
    mock.onGet('https://api.openligadb.de/getmatchdata/bl1/2023/Bayern').reply(500);

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
        //mock response with two match with bayern win
        matchID: 1,
        matchDateTimeUTC: '2023-06-24T15:00:00Z',
        team1: { teamName: 'Bayern', teamIconUrl: 'url-to-bayern-icon' },
        team2: { teamName: 'Dortmund', teamIconUrl: 'url-to-dortmund-icon' },
        matchResults: [
          { resultTypeID: 2, pointsTeam1: 3, pointsTeam2: 1 }
        ]
      },
      {
        matchID: 2,
        matchDateTimeUTC: '2023-06-17T15:00:00Z',
        team1: { teamName: 'Dortmund', teamIconUrl: 'url-to-dortmund-icon' },
        team2: { teamName: 'Bayern', teamIconUrl: 'url-to-bayern-icon' },
        matchResults: [
          { resultTypeID: 2, pointsTeam1: 0, pointsTeam2: 2 }
        ]
      }
    ];
   
    
    mock.onGet('https://api.openligadb.de/getmatchdata/bl1/2023/Bayern').reply(200, mockResponse);

    await act(async () => {
      render(<LastFiveGames team1="Bayern" team2="Union Berlin" />);
    });

    await waitFor(() => {
      // debug the render output
      console.log(document.body.innerHTML);

      const greenCircles = screen.getAllByText('', { selector: '.bg-success' });
      console.log(greenCircles); // Log the win elements
      expect(greenCircles).toHaveLength(2); // Two games, both wins for Bayern
    });



    describe('getResultColor', () => {
      const teamName = 'Bayern';
      const opponentName = 'Dortmund';
    
      // Test for Win
      it('returns bg-success when the team wins', () => {
        console.log(teamName, opponentName)
        const game = {
          team1: { teamName: teamName },
          team2: { teamName: opponentName },
          matchResults: [
            { resultTypeID: 2, pointsTeam1: 3, pointsTeam2: 1 }
          ]
        };
        const result = getResultColor(game, teamName);
        expect(result).toEqual('bg-success');
      });
    
      // Test for Loss
      it('returns bg-danger when the team loses', () => {
        const game = {
          team1: { teamName: teamName },
          team2: { teamName: opponentName },
          matchResults: [
            { resultTypeID: 2, pointsTeam1: 1, pointsTeam2: 3 }
          ]
        };
        const result = getResultColor(game, teamName);
        expect(result).toEqual('bg-danger');
      });
    
      // Test for Draw
      it('returns bg-warning when the game is a draw', () => {
        const game = {
          team1: { teamName: teamName },
          team2: { teamName: opponentName },
          matchResults: [
            { resultTypeID: 2, pointsTeam1: 2, pointsTeam2: 2 }
          ]
        };
        const result = getResultColor(game, teamName);
        expect(result).toEqual('bg-warning');
      });
    
      // Test for Missing Match Results
      it('returns bg-danger when no matching result type is found', () => {
        const game = {
          team1: { teamName: teamName },
          team2: { teamName: opponentName },
          matchResults: []  // Empty or no relevant match result type
        };
        const result = getResultColor(game, teamName);
        console.log(result)
        expect(result).toEqual('bg-danger');
      });
    });
    


  });
});
