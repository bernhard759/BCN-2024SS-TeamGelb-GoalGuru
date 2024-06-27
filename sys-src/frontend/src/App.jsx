import { useEffect, useState } from 'react'
import './App.css'
import { MdSportsSoccer } from "react-icons/md";
import GameSelect from './components/GameSelect';
import AppNavbar from './components/AppNavBar';
import GamePrediction from './components/GamePrediction';
import SoccerIcon from './components/SoccerIcon';
import { useTranslation } from 'react-i18next';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import GamedayInfos from "./components/gameday/GamedayInfos"
import i18n from './i18n';
import TeamMatches from './components/TeamMatches';
import MatchesAgainst from './components/MatchesAgainst';
import MatchDetails from './components/gameday/MatchDetails';

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
    <BrowserRouter>
    <div id="app">

      <AppNavbar />

      <div id="content" style={{minHeight: "100vh", paddingBottom: "3em"}}>

      <Routes>
          <Route path="/" element={
  
      <>
      <SoccerIcon />

        {/* Header */}
        <div className="header d-flex justify-content-center align-items-center flex-column mb-4" style={{paddingTop: "4em", paddingBottom: "3em"}}>
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

                {/* LastFiveGames */}
                <TeamMatches team1={selectedTeams[0]} team2= {selectedTeams[1]}></TeamMatches>
                {/* */}

                {/* MatchInfo */}
                <MatchesAgainst team1={selectedTeams[0]} team2= {selectedTeams[1]}> </MatchesAgainst>
                {/* */}
              
              </div>

             

            </div>
          ) : (
            <h3 className="text-center mx-3 text-secondary" data-testid="firstprediction" style={{marginTop: "2em", marginBottom: "8em"}}>{t("app.firstpred")} &#9917;</h3>
          )}

        </div>
        </>

        } />
        <Route path="/gameday" element={<GamedayInfos />} />
        <Route path="/match/:matchId" element={<MatchDetails />} />
        </Routes>


        


      </div>
      <Footer /> 
    </div>
    </BrowserRouter>
  )
}

export default App
