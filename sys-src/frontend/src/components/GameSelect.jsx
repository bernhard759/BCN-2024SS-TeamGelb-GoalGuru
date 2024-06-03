import { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

function GameSelect({ onTeamSelection }) {

  // State
  //----------------------------------------------------------------
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [teams, setTeams] = useState([]); // Used for the select options
  //----------------------------------------------------------------

  // Data fetching
  //----------------------------------------------------------------
  useEffect(() => {
    // Fetch teams from the backend API
    fetch('/api/teams')
      .then(response => response.json())
      .then(data => setTeams(data.teams))
      .catch(error => console.error('Error fetching teams:', error));
  }, []);
  //----------------------------------------------------------------

  // Funcs
  //----------------------------------------------------------------
  const handleTeam1Change = (event) => {
    setTeam1(event.target.value);
  };

  const handleTeam2Change = (event) => {
    setTeam2(event.target.value);
  };
  //----------------------------------------------------------------


  // Markup
  return (
    <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap fs-5">
      <Form.Select aria-label="Team1 selection" size="lg" className="form-select-lg max-width-select" value={team1} onChange={handleTeam1Change}>
        <option value="">Select a team</option>
        {/* TODO: Remove hard coded options after we have dummy data */}
        <option value="Team1">One</option>
        <option value="Team2">Two</option>
        <option value="Team3">Three</option>
        {teams.map((team, index) => (
          <option key={index} value={team}>{team}</option>
        ))}
      </Form.Select>
      <span className="mx-2">vs.</span>
      <Form.Select aria-label="Team2 selection" size="lg" className="form-select-lg max-width-select" value={team2} onChange={handleTeam2Change}>
        <option value="">Select a team</option>
        {/* TODO: Remove hard coded options after we have dummy data */}
        <option value="Team1">One</option>
        <option value="Team2">Two</option>
        <option value="Team3">Three</option>
        {teams.map((team, index) => (
          <option key={index} value={team}>{team}</option>
        ))}
      </Form.Select>
      <Button variant="primary" size="lg" onClick={() => onTeamSelection(team1, team2)}>Predict</Button>
      {/*<ul>
        <li>{team1}</li>
        <li>{team2}</li>
      </ul>*/}
    </div>
  );
}

export default GameSelect;
