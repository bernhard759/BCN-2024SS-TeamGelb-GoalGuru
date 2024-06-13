import { render, screen } from '@testing-library/react';
import App from '../App';


// App test suite
describe('App', () => {

  // Header
  //----------------------------------------------------------------
  it('renders the header', () => {
    render(<App />);

    const headerElement = screen.getByTestId('header');  // Get the element that contains the text 'GoalGuru'
    expect(headerElement).toBeInTheDocument();   // Assert that the element is present in the document


    const subheaderText = screen.getByTestId('predicting');
    expect(subheaderText).toBeInTheDocument();
  });
  //----------------------------------------------------------------

  // Team selection component
  //----------------------------------------------------------------
  it('renders the team selection component', () => {
    render(<App />);

    const teamSelectionComponent = screen.getByLabelText('Team1 selection');
    expect(teamSelectionComponent).toBeInTheDocument();
  });
  //----------------------------------------------------------------

  // First prediction message
  //----------------------------------------------------------------
  it('renders the "Make your first prediction" message when no teams are selected', () => {
    render(<App />);

    const predictionMessage = screen.getByTestId('firstprediction');
    expect(predictionMessage).toBeInTheDocument();
  });
  //----------------------------------------------------------------
});

