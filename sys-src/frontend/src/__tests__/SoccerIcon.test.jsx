import { render, screen } from '@testing-library/react';
import SoccerIcon from '../components/SoccerIcon';

describe('SoccerIcon', () => {

  it('renders the soccer icon', () => {
    render(<SoccerIcon />);
    const soccerIcon = screen.getByTestId('soccericon');
    expect(soccerIcon).toBeInTheDocument();
  });

});
