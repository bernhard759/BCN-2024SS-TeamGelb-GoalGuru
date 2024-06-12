import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GameSelect from '../components/GameSelect';

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

    expect(screen.getByRole('button', { name: 'Predict' })).toBeInTheDocument();
  });

  // Button disabled when same team selected
  it('disables the "Predict" button when the same team is selected twice', async () => {
    render(<GameSelect onTeamSelection={() => {}} />);

    // Wait for the teams to be fetched and rendered
    await waitFor(() => screen.getAllByText('Team A'));

    const predictButton = screen.getByRole('button', { name: 'Predict' });

    // Check if the "Predict" button is disabled
    expect(predictButton).toBeDisabled();
  });


});

