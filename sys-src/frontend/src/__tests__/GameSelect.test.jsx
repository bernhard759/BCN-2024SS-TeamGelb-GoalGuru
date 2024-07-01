import { render, screen, waitFor, act } from '@testing-library/react';
import GameSelect from '../components/GameSelect';
import { server } from './__mocks__/server';
import { http, HttpResponse } from 'msw';

// GameSelect test suite
describe('GameSelect', () => {

  // Dropdowns with data fetching
  it('renders the team selection dropdowns', async () => {

    // Render the GameSelect component with a mock onTeamSelection function
    await act(async () => {
      render(<GameSelect onTeamSelection={() => { }} />);
    });

    await waitFor(() => {
      screen.getAllByText('Team A')
    }); // Wait for the 'Team A' option to be rendered

    const teamAElements = screen.getAllByText('Team A');
    const firstTeamAElement = teamAElements[0];

    expect(firstTeamAElement).toBeInTheDocument();

  });

  // Versus
  it('renders the "vs." text between the team selection dropdowns', async () => {
    await act(async () => {
      render(<GameSelect onTeamSelection={() => { }} />);
    });

    expect(screen.getByText('vs.')).toBeInTheDocument();
  });

  // Predict Button
  it('renders the "Predict" button', async () => {
    await act(async () => {
      render(<GameSelect onTeamSelection={() => { }} />);
    });

    expect(screen.getByTestId("predictbtn")).toBeInTheDocument();
  });

  // Button disabled when same team selected
  it('disables the "Predict" button when the same team is selected twice', async () => {
    render(<GameSelect onTeamSelection={() => {}} />);

    // Wait for the teams to be fetched and rendered
    await waitFor(() => screen.getAllByText('Team A'));

    const predictButton = screen.getByTestId("predictbtn");

    // Check if the "Predict" button is disabled
    expect(predictButton).toBeDisabled();
  });

  // Error toast check
  it('shows an error toast when team fetching fails', async () => {
    // Override the handler just for this test
    server.use(
      http.get('/api/teams', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await act(async () => {
      render(<GameSelect onTeamSelection={() => {}} />);
    });

    await waitFor(() => {
      const errorToast = screen.getByTestId('error-toast');
      expect(errorToast).toBeInTheDocument();
    });
  });

});

