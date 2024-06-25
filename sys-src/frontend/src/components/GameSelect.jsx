import { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import i18n from '../i18n';
import { useToasts } from 'react-bootstrap-toasts';
import { useTranslation } from 'react-i18next';

// Change language to German
i18n.changeLanguage('de');

function GameSelect({ onTeamSelection }) {

  // Toasts
  const toasts = useToasts();

  // Translation
  const { t } = useTranslation();

  // State
  //----------------------------------------------------------------
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [teams, setTeams] = useState([]); // Used for the select options
  const [buttonDisabled, setButtonDisabled] = useState(true);
  //----------------------------------------------------------------

  // Data fetching
  //----------------------------------------------------------------
  useEffect(() => {
    // Fetch teams from the backend API
    axios.get('/api/teams')
      .then(response => setTeams(response.data.teams))
      .catch(error => {
        console.error('Error fetching teams:', error);
        toasts.show({
          headerContent: 'Warning',
          bodyContent: 'We cant get the teams to select from. Please try again.',
          toastProps: {
            autohide: true,
            delay: 3000
          }
        });
      });
  }, []);

  useEffect(() => {
    setButtonDisabled(team1 == team2 || team1 == '' || team2 == '')
  }, [team1, team2])
  //----------------------------------------------------------------

  // Funcs
  //----------------------------------------------------------------
  /**
   * Handles the change event for the first team selection dropdown.
   *
   * @param {Object} event - The change event object.
   */
  const handleTeam1Change = (event) => {
    setTeam1(event.target.value);
  };

  /**
   * Handles the change event for the second team selection dropdown.
   *
   * @param {Object} event - The change event object.
   */
  const handleTeam2Change = (event) => {
    setTeam2(event.target.value);
  };

  //----------------------------------------------------------------

  // Markup
  return (
    <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap fs-5">
      {/*Team select*/}
      <Form.Select aria-label="Team1 selection" data-testid="teamselect1" size="lg" className="form-select-lg" style={{ maxWidth: "400px" }} value={team1} onChange={handleTeam1Change}>
        <option value="">{t("gameselect.select")}</option>
        {teams.map((team, index) => (
          <option key={index} value={team}>{team}</option>
        ))}
      </Form.Select>
      <span className="mx-2">vs.</span>
      {/*Team select*/}
      <Form.Select aria-label="Team2 selection" data-testid="teamselect2" size="lg" className="form-select-lg" style={{ maxWidth: "400px" }} value={team2} onChange={handleTeam2Change}>
        <option value="">{t("gameselect.select")}</option>
        {teams.map((team, index) => (
          <option key={index} value={team}>{team}</option>
        ))}
      </Form.Select>
      <Button variant="primary" data-testid="predictbtn" size="lg" onClick={() => onTeamSelection(team1, team2)}
        disabled={buttonDisabled}>{t("gameselect.predict")}</Button>
    </div>
  );
}

export default GameSelect
