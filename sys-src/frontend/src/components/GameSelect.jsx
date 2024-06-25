import { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import i18n from '../i18n';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Change language to German
i18n.changeLanguage('de');

function GameSelect({ onTeamSelection }) {

  // Translation
  const { t } = useTranslation();

  // Toast stuff
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
        showTheToast('We cant get the teams to select from. Please try again.');
      });
  }, []);

  useEffect(() => {
    setButtonDisabled(team1 == team2 || team1 == '' || team2 == '')
  }, [team1, team2])
  //----------------------------------------------------------------

  // Funcs
  //----------------------------------------------------------------

  const showTheToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

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
    <>
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

      {/* Message toast warning */}
      <ToastContainer className="position-absolute top-0 end-0 mx-2" style={{maxWidth: "15em", marginTop: "5em"}}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto text-danger">Error</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default GameSelect
