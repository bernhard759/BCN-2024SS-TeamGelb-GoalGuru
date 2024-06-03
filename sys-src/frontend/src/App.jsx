import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MdSportsSoccer } from "react-icons/md";
import GameSelect from './components/GameSelect';
import AppNavbar from './components/AppNavBar';

function App() {

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

  /*
  // Testing api
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api")
      .then((res) => { console.log(data); return res.json() })
      .then((data) => setData(data.message));
  }, []);*/

  // Markup
  return (
    <div id="app">

      <AppNavbar/>

      <div className="header my-5 d-flex justify-content-center align-items-center flex-column">
        <h1 className="display-1 fw-bold">G<MdSportsSoccer className="text-primary" />al<i className="text-primary">Guru</i></h1>
        <h2 className="text-center">Predicting soccer games with AI</h2>
      </div>

      <div className="my-2 mx-5">

      {/* Game Selection
      - We pass down the state changer function and the selected teams as props
      - The state changer function as prop is called from within this component to update the state on the app level here
      */}
      <GameSelect onTeamSelection={handleTeamSelection} />
      {/*<p>{!data ? "Loading..." : data}</p>*/}


      {selectedTeams.every(team => team !== "") ? (
        <div>
          <h3 className="text-center m-5">{selectedTeams.join('  vs  ')}</h3>
          {/* Game Prediction Result*/}
          {/*<GamePrediction teams={selectedTeams}></GamePrediction>*/}

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
        <h3 className="text-center m-5 text-secondary">Make your first prediction &#9917;</h3>
      )}

    </div>
    </div>
  )
}

export default App
