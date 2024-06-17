import { useEffect, useState } from 'react'
import './App.css'
import { MdSportsSoccer } from "react-icons/md";
import GameSelect from './components/GameSelect';
import AppNavbar from './components/AppNavBar';
import GamePrediction from './components/GamePrediction';
import SoccerIcon from './components/SoccerIcon';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

function App() {

  // Translation
  const { t } = useTranslation();

  // State
  //----------------------------------------------------------------
  // Selected Teams State variable
  const [selectedTeams, setSelectedTeams] = useState(["", ""]);
  //----------------------------------------------------------------

  // Funcs
  //----------------------------------------------------------------
  // State Changer
  const handleTeamSelection = (team1, team2) => {
    setSelectedTeams([team1, team2]);
  };
  //----------------------------------------------------------------

  // Markup
  return (
    <div id="app">

      <AppNavbar />

      <div id="content">

      <SoccerIcon />

        {/* Header */}
        <div className="header d-flex justify-content-center align-items-center flex-column" style={{marginTop: "4em", marginBottom: "3em"}}>
          <h1 className="display-1 fw-bold" data-testid="header">G<MdSportsSoccer className="text-primary" />al<i className="text-primary">Guru</i></h1>
          <h2 className="text-center" data-testid="predicting">{t("app.desctext")}</h2>
          <h5 style={{maxWidth: "800px"}} className="text-center my-2">{t("app.infotext")}</h5>
        </div>

        <div className="my-2 mx-5">

          {/* Game Selection
          - We pass down the state changer function and the selected teams as props
          - The state changer function as prop is called from within this component to update the state on the app level here
          */}
          <GameSelect onTeamSelection={handleTeamSelection} />

          {/* Render when both teams are selected*/}
          {selectedTeams.every(team => team !== "") ? (
            <div>
              <div>
                <div className="display-5 m-4 mt-5 mx-4 d-flex justify-content-between align-items-center">
                  <p>{selectedTeams[0]}</p>
                  <p>vs.</p>
                  <p>{selectedTeams[1]}</p>
                </div>
                {/* Game Prediction Result*/}
                <GamePrediction teams={selectedTeams}></GamePrediction>
              </div>

              {/* MatchInfo (previous matches of the two teams)*/}
              {/*<MatchInfo teams={selectedTeams}></MatchInfo>*/}

              {/* FormInfo Team 1*/}
              {/*<FormInfo teams={selectedTeams[0]}></FormInfo>*/}

              {/* FormInfo Team 2*/}
              {/*<FormInfo team={selectedTeams[1]}></FormInfo>*/}

              {/* FormationInfo Team 1*/}
              {/*<FormationInfo team={selectedTeams[0]}></FormationInfo>*/}

              {/* FormationInfo Team 2*/}
              {/*<FormationInfo team={selectedTeams[1]}></FormationInfo>*/}

            </div>
          ) : (
            <h3 className="text-center m-5 text-secondary" data-testid="firstprediction">{t("app.firstpred")} &#9917;</h3>
          )}

        </div>

      </div>
    </div>
  )
}

export default App
